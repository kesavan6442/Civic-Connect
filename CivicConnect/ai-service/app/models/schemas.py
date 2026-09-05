"""
Pydantic schemas for CivicConnect Python AI Service
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    title: Optional[str] = ""
    text: Optional[str] = ""
    description: Optional[str] = ""
    image: Optional[str] = None          # Base64 string, URL, or filepath
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    district: Optional[str] = "Ranchi"
    category: Optional[str] = None
    existing_problems: Optional[List[Dict[str, Any]]] = []

class ImageClassifyRequest(BaseModel):
    image: str
    category_hint: Optional[str] = None

class TextClassifyRequest(BaseModel):
    text: str
    title: Optional[str] = ""

class DuplicateCheckRequest(BaseModel):
    title: str
    text: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image: Optional[str] = None
    existing_problems: List[Dict[str, Any]] = []

class PriorityPredictionRequest(BaseModel):
    category: str
    text: str
    severity: Optional[str] = "MEDIUM"
    impacted_count: Optional[int] = 50
    has_image: Optional[bool] = False
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class UniversityMatchRequest(BaseModel):
    category: str
    text: str
    district: Optional[str] = "Ranchi"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    universities: Optional[List[Dict[str, Any]]] = []
