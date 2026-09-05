"""
analyze.py
FastAPI Router for CivicConnect AI Multi-Modal Inference Endpoints
"""

from fastapi import APIRouter, HTTPException
from ..models.schemas import (
    AnalyzeRequest,
    ImageClassifyRequest,
    TextClassifyRequest,
    DuplicateCheckRequest,
    PriorityPredictionRequest,
    UniversityMatchRequest
)
from ..inference.image_classifier import image_classifier
from ..inference.text_classifier import text_classifier
from ..inference.duplicate_detector import duplicate_detector
from ..inference.priority_predictor import priority_predictor
from ..inference.university_matcher import university_matcher

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "CivicConnect Python AI Multi-Modal Service",
        "models": {
            "image_classifier": "MobileNetV3-Civic-Jharkhand",
            "text_nlp": "Jharkhand-Civic-NLP-v2",
            "duplicate_detector": "MultiModal-Geo-Embedding-v1",
            "priority_regressor": "CivicRisk-XGB-Regressor"
        }
    }

@router.post("/analyze")
async def analyze_problem(req: AnalyzeRequest):
    """
    Execute full multi-modal analysis:
    1. Text NLP categorization & severity
    2. Computer Vision image classification
    3. Priority regression prediction
    4. Multi-modal duplicate detection (text + image + geospatial)
    5. University expertise & proximity matching
    """
    text_content = req.description or req.text or ""
    title_content = req.title or ""
    combined_text = f"{title_content} {text_content}".strip()

    # 1. Text Classification
    text_res = text_classifier.classify(text_content, title=title_content)

    # 2. Image Classification
    img_res = image_classifier.classify(req.image, category_hint=req.category or text_res["category"])

    # Harmonize Category
    final_category = req.category or text_res["category"]

    # 3. Priority Prediction
    priority_res = priority_predictor.predict(
        category=final_category,
        text=combined_text,
        severity=text_res["severity"],
        impacted_count=50,
        has_image=img_res["hasVisualEvidence"]
    )

    # 4. Duplicate Detection
    new_prob_dict = {
        "title": title_content,
        "description": text_content,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "image": req.image
    }
    dup_res = duplicate_detector.detect(new_prob_dict, req.existing_problems or [])

    # 5. University Matching
    matched_univs = university_matcher.match(
        category=final_category,
        text=combined_text,
        district=req.district or "Ranchi",
        latitude=req.latitude,
        longitude=req.longitude
    )

    return {
        "success": True,
        "category": final_category,
        "suggestedCategory": final_category,
        "categoryConfidence": text_res["confidence"],
        "severity": text_res["severity"],
        "priority": priority_res["priority"],
        "priorityScore": priority_res["priorityScore"],
        "priorityConfidence": priority_res["priorityConfidence"],
        "priorityReasoning": priority_res["priorityReasoning"],
        "imageConfidence": img_res["confidence"],
        "hasVisualEvidence": img_res["hasVisualEvidence"],
        "textConfidence": text_res["confidence"],
        "duplicateProbability": dup_res["duplicateProbability"],
        "isPossibleDuplicate": dup_res["isPossibleDuplicate"],
        "highestSimilarity": dup_res["highestSimilarity"],
        "similarProblems": dup_res["similarProblems"],
        "topMatch": dup_res["topMatch"],
        "recommendedDepartment": text_res["recommendedDepartment"],
        "recommendedAction": text_res["recommendedAction"],
        "matchedUniversities": matched_univs
    }

@router.post("/classify-image")
async def classify_image_endpoint(req: ImageClassifyRequest):
    return image_classifier.classify(req.image, category_hint=req.category_hint)

@router.post("/classify-text")
async def classify_text_endpoint(req: TextClassifyRequest):
    return text_classifier.classify(req.text, title=req.title or "")

@router.post("/duplicate-check")
async def duplicate_check_endpoint(req: DuplicateCheckRequest):
    new_prob_dict = {
        "title": req.title,
        "description": req.text,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "image": req.image
    }
    return duplicate_detector.detect(new_prob_dict, req.existing_problems)

@router.post("/priority-prediction")
async def priority_prediction_endpoint(req: PriorityPredictionRequest):
    return priority_predictor.predict(
        category=req.category,
        text=req.text,
        severity=req.severity or "MEDIUM",
        impacted_count=req.impacted_count or 50,
        has_image=req.has_image or False
    )

@router.post("/university-match")
async def university_match_endpoint(req: UniversityMatchRequest):
    return university_matcher.match(
        category=req.category,
        text=req.text,
        district=req.district or "Ranchi",
        latitude=req.latitude,
        longitude=req.longitude,
        university_list=req.universities or []
    )
