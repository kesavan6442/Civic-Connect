# CivicConnect ML Pipeline & Training Framework
Government of Jharkhand Societal Innovation Platform

## Overview
This directory contains the machine learning training scripts, datasets preparation, evaluation benchmarks, and inference pipelines for multi-modal civic grievance triage:
1. **Text NLP Model**: Categorization, severity extraction, keyword analysis, and department routing.
2. **Computer Vision Model**: Transfer learning classification for civic defects (potholes, garbage, water leaks, broken infrastructure) based on the QR4Change and Civic Issue datasets.
3. **Duplicate Detection Engine**: Multi-modal similarity (Text embeddings + Vision embeddings + Geospatial Haversine distance + Category overlap).
4. **AI Multi-Factor University Matcher**: Dynamic scoring (0-100) matching citizen problems with accredited universities based on department, research portfolio, faculty, and location.

## Directory Structure
- `datasets/`: Dataset definitions and unified cross-dataset label mapping.
- `models/`: Saved model weights, feature vectors, and evaluation benchmark artifacts.
- `training/`:
  - `prepare_datasets.py`: Generates train/validation/test splits.
  - `train_text_model.py`: Trains and saves text categorization artifacts.
  - `train_image_model.py`: Fine-tunes vision transfer learning classifier.
  - `evaluate_models.py`: Runs full test evaluation producing accuracy, precision, recall, F1, confusion matrices, and Precision@K.
- `inference/`: End-to-end multi-modal inference pipeline.
- `app.py`: FastAPI server launcher.

## Running Training & Evaluation
```bash
python ml/training/prepare_datasets.py
python ml/training/train_text_model.py
python ml/training/train_image_model.py
python ml/training/evaluate_models.py
```
