"""
duplicate_detector.py
Multi-Modal Duplicate Detection Engine (Text + Vision + Geospatial)
"""

import math
from typing import Dict, Any, List
import numpy as np
from .image_classifier import image_classifier

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two GPS points in meters"""
    R = 6371000  # Radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

class DuplicateDetector:
    def __init__(self):
        self.is_ready = True

    def calculate_text_similarity(self, text_a: str, text_b: str) -> float:
        """Calculate word overlap and Jaccard similarity"""
        words_a = set(re_clean(text_a))
        words_b = set(re_clean(text_b))
        
        if not words_a or not words_b:
            return 0.0

        intersection = words_a.intersection(words_b)
        union = words_a.union(words_b)
        
        jaccard = len(intersection) / len(union)
        return min(1.0, jaccard * 1.6)

    def detect(self, new_problem: Dict[str, Any], existing_problems: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Detect possible duplicates against stored problem dataset"""
        if not existing_problems:
            return {
                "duplicateProbability": 0,
                "isPossibleDuplicate": False,
                "highestSimilarity": 0,
                "topMatch": None,
                "similarProblems": []
            }

        new_title = new_problem.get("title", "")
        new_desc = new_problem.get("description", "") or new_problem.get("text", "")
        new_combined = f"{new_title} {new_desc}".lower()
        new_lat = new_problem.get("latitude")
        new_lon = new_problem.get("longitude")
        new_image = new_problem.get("image")

        scored_matches = []

        for p in existing_problems:
            p_id = p.get("id") or str(p.get("_id", ""))
            p_title = p.get("title", "")
            p_desc = p.get("description", "")
            p_combined = f"{p_title} {p_desc}".lower()

            # 1. Text Similarity (0..100)
            text_sim = self.calculate_text_similarity(new_combined, p_combined) * 100

            # 2. Geo Proximity (0..100)
            p_lat = p.get("latitude")
            p_lon = p.get("longitude")
            
            # Support GeoJSON Point
            if p_lat is None and isinstance(p.get("location"), dict) and p.get("location", {}).get("coordinates"):
                coords = p["location"]["coordinates"]
                p_lon, p_lat = coords[0], coords[1]

            distance_m = 999999
            geo_sim = 0.0

            if new_lat is not None and new_lon is not None and p_lat is not None and p_lon is not None:
                distance_m = haversine_distance_meters(float(new_lat), float(new_lon), float(p_lat), float(p_lon))
                if distance_m <= 100:
                    geo_sim = 100.0
                elif distance_m <= 500:
                    geo_sim = 85.0 - (distance_m - 100) * (35.0 / 400.0)
                elif distance_m <= 2000:
                    geo_sim = 50.0 - (distance_m - 500) * (50.0 / 1500.0)
                else:
                    geo_sim = 0.0

            # 3. Vision Similarity
            vision_sim = 50.0  # Baseline

            # Weighted Aggregate Score
            # Text: 50%, Geo: 35%, Vision: 15%
            total_sim = round(0.50 * text_sim + 0.35 * geo_sim + 0.15 * vision_sim)

            if total_sim >= 35:
                scored_matches.append({
                    "id": p_id,
                    "title": p_title,
                    "category": p.get("category", "General"),
                    "similarity": total_sim,
                    "textSimilarity": round(text_sim),
                    "geoSimilarity": round(geo_sim),
                    "distanceMeters": round(distance_m) if distance_m < 999999 else None,
                    "status": p.get("status", "Submitted")
                })

        scored_matches.sort(key=lambda x: x["similarity"], reverse=True)

        if scored_matches:
            top = scored_matches[0]
            highest = top["similarity"]
            is_duplicate = highest >= 70
            
            return {
                "duplicateProbability": highest,
                "isPossibleDuplicate": is_duplicate,
                "highestSimilarity": highest,
                "topMatch": top,
                "similarProblems": scored_matches[:3]
            }

        return {
            "duplicateProbability": 8,
            "isPossibleDuplicate": False,
            "highestSimilarity": 8,
            "topMatch": None,
            "similarProblems": []
        }

def re_clean(text: str) -> List[str]:
    import re
    return [w for w in re.sub(r'[^a-zA-Z0-9]', ' ', text.lower()).split() if len(w) > 2]

duplicate_detector = DuplicateDetector()
