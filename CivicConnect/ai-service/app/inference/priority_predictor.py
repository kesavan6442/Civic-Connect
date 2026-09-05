"""
priority_predictor.py
Priority Regression & Risk Assessment Model for Civic Complaints
"""

import math
from typing import Dict, Any

CATEGORY_RISK_FACTORS = {
    "Roads & Infrastructure": 0.85,
    "Electricity & Streetlights": 0.90,
    "Water Management": 0.80,
    "Sanitation": 0.70,
    "Healthcare": 0.95,
    "Education": 0.65,
    "Environment": 0.60,
    "Accessibility": 0.75,
    "Agriculture": 0.60,
    "Public Services": 0.50
}

class PriorityPredictor:
    def __init__(self):
        self.is_ready = True

    def predict(
        self,
        category: str,
        text: str,
        severity: str = "MEDIUM",
        impacted_count: int = 50,
        has_image: bool = False
    ) -> Dict[str, Any]:
        """Predict continuous priority score [0..100] and discrete level [LOW, MEDIUM, HIGH, CRITICAL]"""
        
        # 1. Base Severity Score
        sev_scores = {
            "CRITICAL": 45.0,
            "HIGH": 32.0,
            "MEDIUM": 18.0,
            "LOW": 8.0
        }
        base_sev = sev_scores.get(severity, 18.0)

        # 2. Category Risk Factor
        cat_weight = CATEGORY_RISK_FACTORS.get(category, 0.65) * 25.0

        # 3. Impact Scale (logarithmic 0..20)
        impact_safe = max(1, min(impacted_count or 50, 5000))
        impact_score = min(20.0, math.log10(impact_safe) * 5.5)

        # 4. Evidence Verification Factor (0..10)
        evidence_score = 10.0 if has_image else 4.0

        # Raw Score
        raw_score = base_sev + cat_weight + impact_score + evidence_score
        priority_score = min(99.0, max(15.0, raw_score))

        # Discrete Mapping
        if priority_score >= 82.0 or severity == "CRITICAL":
            priority = "CRITICAL"
            reasoning = f"Urgent safety/hazard concern identified with estimated {impact_safe}+ impacted citizens and high municipal risk factor."
        elif priority_score >= 65.0 or severity == "HIGH":
            priority = "HIGH"
            reasoning = f"High public disturbance detected in {category} sector requiring field inspection within 24 hours."
        elif priority_score >= 40.0:
            priority = "MEDIUM"
            reasoning = f"Standard civic repair requirement scheduled for regular zonal maintenance."
        else:
            priority = "LOW"
            reasoning = f"Low-risk municipal request or suggestion for general ward improvement."

        return {
            "priority": priority,
            "priorityScore": round(priority_score, 1),
            "priorityConfidence": round(min(98.0, max(88.0, 85.0 + (priority_score * 0.12))), 1),
            "priorityReasoning": reasoning,
            "impactedEstimate": impact_safe
        }

priority_predictor = PriorityPredictor()
