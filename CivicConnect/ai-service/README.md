# CivicConnect Python AI Service
**Government of Jharkhand Societal Innovation Platform**

This service provides multi-modal machine learning inference for citizen challenges and grievance triage:
1. **Computer Vision Image Classification**: Categorizes uploaded challenge evidence (Roads, Potholes, Water leakages, Streetlights, Garbage dumps, Sanitation) using MobileNet/ResNet feature extraction.
2. **NLP Text Classification**: Natural language processing on problem titles and descriptions to assess category, severity, and recommend departments.
3. **Priority Regression Model**: Continuously calculates a priority risk score [0..100] and maps to `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
4. **Multi-Modal Duplicate Detection**: Combines text embeddings, visual feature cosine distance, and Haversine geospatial proximity in meters.
5. **University Matching Engine**: Pairs civic challenges with state universities (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, CUJ, BAU) based on research domains and geographic proximity.

---

## 🚀 Running the Python AI Service

```bash
cd ai-service
python -m uvicorn app.main:app --port 8000 --reload
```

Health check:
`GET http://localhost:8000/api/ai/health`
