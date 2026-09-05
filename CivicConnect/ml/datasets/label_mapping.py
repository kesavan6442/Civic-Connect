"""
label_mapping.py
Unified Civic Issue Taxonomy and Cross-Dataset Label Mapping
"""

UNIFIED_CATEGORIES = [
    "Roads & Infrastructure",
    "Water Management",
    "Sanitation",
    "Electricity & Streetlights",
    "Healthcare",
    "Education",
    "Agriculture",
    "Environment",
    "Accessibility",
    "Public Services"
]

CIVICDEX_MAPPING = {
    "road_maintenance": "Roads & Infrastructure",
    "pothole": "Roads & Infrastructure",
    "culvert": "Roads & Infrastructure",
    "water_supply": "Water Management",
    "drainage": "Water Management",
    "sewerage": "Water Management",
    "waste_management": "Sanitation",
    "garbage": "Sanitation",
    "street_light": "Electricity & Streetlights",
    "power_outage": "Electricity & Streetlights",
    "school_facility": "Education",
    "health_center": "Healthcare",
    "crop_damage": "Agriculture",
    "pollution": "Environment"
}

QR4CHANGE_IMAGE_MAPPING = {
    "pothole": "Roads & Infrastructure",
    "damaged_road": "Roads & Infrastructure",
    "garbage_dump": "Sanitation",
    "overflowing_dustbin": "Sanitation",
    "water_leakage": "Water Management",
    "open_manhole": "Water Management",
    "broken_streetlight": "Electricity & Streetlights",
    "construction_debris": "Roads & Infrastructure"
}

SEVERITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
PRIORITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
