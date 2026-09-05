"""
pipeline.py
Standalone ML Inference Pipeline orchestrating Text, Vision, Priority, Duplicate, and University Matching.
"""

from ...ai-service.app.inference.text_classifier import text_classifier
from ...ai-service.app.inference.image_classifier import image_classifier
from ...ai-service.app.inference.priority_predictor import priority_predictor
from ...ai-service.app.inference.duplicate_detector import duplicate_detector
from ...ai-service.app.inference.university_matcher import university_matcher

class CivicMLPipeline:
    def __init__(self):
        self.text = text_classifier
        self.vision = image_classifier
        self.priority = priority_predictor
        self.duplicate = duplicate_detector
        self.matcher = university_matcher

    def run_full_pipeline(self, title, description, category=None, image=None, latitude=None, longitude=None, district="Ranchi", existing_problems=None):
        text_res = self.text.classify(description, title=title)
        final_cat = category or text_res["category"]
        img_res = self.vision.classify(image, category_hint=final_cat)
        
        priority_res = self.priority.predict(
            category=final_cat,
            text=f"{title} {description}",
            severity=text_res["severity"],
            has_image=img_res["hasVisualEvidence"]
        )
        
        dup_res = self.duplicate.detect(
            {"title": title, "description": description, "latitude": latitude, "longitude": longitude, "image": image},
            existing_problems or []
        )
        
        matches = self.matcher.match(
            category=final_cat,
            text=f"{title} {description}",
            district=district,
            latitude=latitude,
            longitude=longitude
        )
        
        return {
            "category": final_cat,
            "textAnalysis": text_res,
            "imageAnalysis": img_res,
            "priority": priority_res,
            "duplicateCheck": dup_res,
            "matchedUniversities": matches
        }

pipeline = CivicMLPipeline()
