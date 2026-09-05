"""
university_matcher.py
AI Multi-Factor Matching Engine for Pairing Civic Challenges with Relevant State Universities & Research Teams
"""

import math
from typing import Dict, Any, List

JHARKHAND_UNIVERSITY_REGISTRY = [
    {
        "id": "UNIV-BIT-MESRA",
        "name": "Birla Institute of Technology (BIT) Mesra",
        "district": "Ranchi",
        "latitude": 23.4123,
        "longitude": 85.4399,
        "departments": ["Civil & Environmental Engineering", "Computer Science", "Remote Sensing & GIS"],
        "expertise": ["Roads & Infrastructure", "Water Management", "Geospatial Analytics", "Urban Planning"],
        "researchAreas": ["Smart Pavement Materials", "Urban Flood Hydrology", "Computer Vision Traffic Systems", "Infrastructure Durability"],
        "contact": "civic.rnd@bitmesra.ac.in",
        "nodalOfficer": "Dr. A. K. Sinha (Dean R&D)"
    },
    {
        "id": "UNIV-IIT-ISM-DHANBAD",
        "name": "Indian Institute of Technology (IIT ISM) Dhanbad",
        "district": "Dhanbad",
        "latitude": 23.8144,
        "longitude": 86.4412,
        "departments": ["Environmental Science & Engineering", "Mining Machinery", "Electrical Engineering"],
        "expertise": ["Environment", "Electricity & Streetlights", "Groundwater Hydrology", "Waste Management"],
        "researchAreas": ["Industrial Solid Waste", "Smart Grid Distribution", "Subsurface Water Mapping", "Renewable Energy"],
        "contact": "rural.tech@iitism.ac.in",
        "nodalOfficer": "Prof. R. Banerjee"
    },
    {
        "id": "UNIV-NIT-JAMSHEDPUR",
        "name": "National Institute of Technology (NIT) Jamshedpur",
        "district": "East Singhbhum",
        "latitude": 22.7766,
        "longitude": 86.1445,
        "departments": ["Civil Engineering", "Electronics & Communication", "Mechanical Engineering"],
        "expertise": ["Roads & Infrastructure", "Sanitation", "Smart City IoT", "Public Transportation"],
        "researchAreas": ["Recycled Bituminous Concrete", "Drainage Sensor Networks", "Low-cost Sanitation", "Urban Mobility"],
        "contact": "innovation@nitjsr.ac.in",
        "nodalOfficer": "Dr. Sanjay Kumar"
    },
    {
        "id": "UNIV-CUJ-RANCHI",
        "name": "Central University of Jharkhand (CUJ)",
        "district": "Ranchi",
        "latitude": 23.2388,
        "longitude": 85.2341,
        "departments": ["Water Engineering & Management", "Mass Communication", "Rural Development"],
        "expertise": ["Water Management", "Rural Livelihood", "Education", "Healthcare"],
        "researchAreas": ["Indigenous Water Harvesting", "Public Sanitation Awareness", "Tribal Healthcare Logistics", "Rural Supply Chains"],
        "contact": "social.innovation@cuj.ac.in",
        "nodalOfficer": "Dr. Manoj Kumar"
    },
    {
        "id": "UNIV-BAU-RANCHI",
        "name": "Birsa Agricultural University (BAU) Kanke",
        "district": "Ranchi",
        "latitude": 23.4419,
        "longitude": 85.3183,
        "departments": ["Agricultural Engineering", "Soil & Water Conservation", "Forestry"],
        "expertise": ["Agriculture", "Environment", "Rural Livelihood", "Soil Conservation"],
        "researchAreas": ["Micro-irrigation Optimization", "Watershed Management", "Organic Waste Composting", "Soil Erosion Prevention"],
        "contact": "extension@bauranchi.org",
        "nodalOfficer": "Dr. P. K. Singh"
    }
]

def calculate_geo_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance in kilometers"""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class UniversityMatcher:
    def __init__(self):
        self.is_ready = True

    def match(
        self,
        category: str,
        text: str = "",
        district: str = "Ranchi",
        latitude: float = None,
        longitude: float = None,
        university_list: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Multi-Factor University Matching Algorithm:
        1. Category vs University Expertise (40% weight)
        2. Problem description vs Research Areas (25% weight)
        3. Department relevance (15% weight)
        4. Location Proximity in km (20% weight)
        Generates dynamic matchReasons for full explainability.
        """
        candidates = university_list if (university_list and len(university_list) > 0) else JHARKHAND_UNIVERSITY_REGISTRY
        matched = []
        desc_lower = (text or "").lower()

        for u in candidates:
            u_id = u.get("id") or str(u.get("_id", ""))
            u_name = u.get("name", "")
            u_district = u.get("district", "")
            u_expertise = u.get("expertise", [])
            u_research = u.get("researchAreas", [])
            u_depts = u.get("departments", [])
            u_lat = u.get("latitude")
            u_lon = u.get("longitude")

            match_reasons = []

            # 1. Category & Expertise match
            expertise_score = 0.0
            matched_exp = [exp for exp in u_expertise if category.lower() in exp.lower() or exp.lower() in category.lower()]
            if matched_exp:
                expertise_score += 40.0
                match_reasons.append(f"Specialized {matched_exp[0]} domain expertise")
            elif any(exp.lower() in desc_lower for exp in u_expertise):
                expertise_score += 25.0
                match_reasons.append("Relevant institutional research portfolio")
            else:
                expertise_score += 15.0

            # 2. Research Areas Overlap
            research_score = 0.0
            matched_research = [ra for ra in u_research if any(w in desc_lower for w in ra.lower().split() if len(w) > 3)]
            if matched_research:
                research_score += 25.0
                match_reasons.append(f"Active research in {matched_research[0]}")
            else:
                research_score += 12.0

            # 3. Department Relevance
            dept_score = 0.0
            relevant_dept = u_depts[0] if u_depts else "Urban Innovation Cell"
            if any("civil" in d.lower() or "infrastructure" in d.lower() for d in u_depts) and "road" in category.lower():
                dept_score += 15.0
                relevant_dept = next(d for d in u_depts if "civil" in d.lower())
                match_reasons.append(f"{relevant_dept} faculty and laboratory facilities")
            elif any("water" in d.lower() or "environment" in d.lower() for d in u_depts) and "water" in category.lower():
                dept_score += 15.0
                relevant_dept = next(d for d in u_depts if "water" in d.lower() or "environ" in d.lower())
                match_reasons.append(f"{relevant_dept} analytical testing lab")
            elif any("electric" in d.lower() for d in u_depts) and "electric" in category.lower():
                dept_score += 15.0
                relevant_dept = next(d for d in u_depts if "electric" in d.lower())
                match_reasons.append(f"{relevant_dept} smart grid testing team")
            else:
                dept_score += 10.0

            # 4. Location Proximity (Distance Calculation)
            distance_km = 45.0
            if latitude is not None and longitude is not None and u_lat is not None and u_lon is not None:
                distance_km = round(calculate_geo_distance_km(float(latitude), float(longitude), float(u_lat), float(u_lon)), 1)
            elif district.lower() == u_district.lower():
                distance_km = 12.5

            if distance_km <= 20.0:
                proximity_score = 20.0
                match_reasons.append(f"Located in same district ({u_district}, {distance_km} km from challenge)")
            elif distance_km <= 60.0:
                proximity_score = 14.0
                match_reasons.append(f"Regional proximity ({distance_km} km distance)")
            else:
                proximity_score = 7.0

            # Total Multi-Factor Score
            total_score = min(98.5, max(45.0, round(expertise_score + research_score + dept_score + proximity_score, 1)))

            if total_score >= 50.0:
                matched.append({
                    "universityId": u_id,
                    "id": u_id,
                    "name": u_name,
                    "district": u_district,
                    "matchScore": total_score,
                    "distanceKm": distance_km,
                    "relevantDepartment": relevant_dept,
                    "expertise": u_expertise,
                    "researchAreas": u_research,
                    "matchReasons": match_reasons,
                    "contact": u.get("contact") or u.get("contactEmail", "nodal@jharkhand.edu.in"),
                    "status": "Available for Assignment"
                })

        # Sort by Match Score Descending
        matched.sort(key=lambda x: x["matchScore"], reverse=True)
        return matched

university_matcher = UniversityMatcher()
