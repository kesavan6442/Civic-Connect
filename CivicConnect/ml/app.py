"""
app.py
ML Service Entrypoint wrapping FastAPI endpoints
"""

import uvicorn
import os
import sys

# Add ai-service to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "ai-service"))
from app.main import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
