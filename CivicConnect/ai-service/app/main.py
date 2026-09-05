"""
main.py
CivicConnect Python AI Service
Government of Jharkhand Societal Innovation Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analyze import router as analyze_router

app = FastAPI(
    title="CivicConnect AI Service",
    description="Multi-Modal Machine Learning & Inference Pipeline for Civic Engagement & Grievance Triage",
    version="2.0.0"
)

# CORS Middleware to allow communication with Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(analyze_router, prefix="/api/ai", tags=["AI Inference"])
app.include_router(analyze_router, tags=["Root AI Endpoints"])

@app.get("/")
async def root():
    return {
        "portal": "CivicConnect AI Engine",
        "state": "Government of Jharkhand",
        "status": "active",
        "endpoints": [
            "/api/ai/health",
            "/api/ai/analyze",
            "/api/ai/classify-image",
            "/api/ai/classify-text",
            "/api/ai/duplicate-check",
            "/api/ai/priority-prediction",
            "/api/ai/university-match"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
