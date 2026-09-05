"""
prepare_datasets.py
Prepares and normalizes civic grievance text and image training datasets with train/val/test splits.
"""

import json
import os
import random

SAMPLE_CIVIC_DATASET = [
    {"text": "Severe potholes on Main Road causing two-wheeler accidents and traffic congestion", "category": "Roads & Infrastructure", "severity": "HIGH", "priority": "HIGH"},
    {"text": "Broken culvert and caved-in road near Kanke school creating severe hazard for children", "category": "Roads & Infrastructure", "severity": "CRITICAL", "priority": "CRITICAL"},
    {"text": "Major drinking water pipeline fracture in Sakchi Market wasting thousands of liters daily", "category": "Water Management", "severity": "HIGH", "priority": "HIGH"},
    {"text": "Open drainage overflow and sewage accumulation in residential colony creating health risk", "category": "Water Management", "severity": "HIGH", "priority": "HIGH"},
    {"text": "Overflowing garbage dump near vegetable market causing severe stench and disease vector", "category": "Sanitation", "severity": "HIGH", "priority": "HIGH"},
    {"text": "Commercial waste dumped on roadside not collected for past two weeks", "category": "Sanitation", "severity": "MEDIUM", "priority": "MEDIUM"},
    {"text": "Streetlights not functioning for 1km stretch on bypass road leading to night accidents", "category": "Electricity & Streetlights", "severity": "HIGH", "priority": "HIGH"},
    {"text": "High voltage transformer sparking and loose live wires hanging near footpath", "category": "Electricity & Streetlights", "severity": "CRITICAL", "priority": "CRITICAL"},
    {"text": "Primary Health Centre running out of essential anti-venom and emergency medicines", "category": "Healthcare", "severity": "CRITICAL", "priority": "CRITICAL"},
    {"text": "Government school building roof leaking during monsoon disrupting classes", "category": "Education", "severity": "MEDIUM", "priority": "MEDIUM"},
    {"text": "Canal irrigation gate broken resulting in crop water shortage in Kanke village", "category": "Agriculture", "severity": "HIGH", "priority": "HIGH"},
    {"text": "Industrial particulate smoke emission exceeding safety threshold near residential area", "category": "Environment", "severity": "HIGH", "priority": "HIGH"},
    {"text": "Wheelchair ramp missing at district collectorate office preventing access for disabled citizens", "category": "Accessibility", "severity": "MEDIUM", "priority": "MEDIUM"}
]

def prepare_splits(data, train_ratio=0.7, val_ratio=0.15, test_ratio=0.15):
    shuffled = list(data)
    random.seed(42)
    random.shuffle(shuffled)
    
    n = len(shuffled)
    n_train = int(n * train_ratio)
    n_val = int(n * val_ratio)
    
    train_set = shuffled[:n_train]
    val_set = shuffled[n_train:n_train + n_val]
    test_set = shuffled[n_train + n_val:]
    
    return train_set, val_set, test_set

if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(__file__), "..", "datasets")
    train, val, test = prepare_splits(SAMPLE_CIVIC_DATASET)
    
    with open(os.path.join(out_dir, "train.json"), "w", encoding="utf-8") as f:
        json.dump(train, f, indent=2)
    with open(os.path.join(out_dir, "val.json"), "w", encoding="utf-8") as f:
        json.dump(val, f, indent=2)
    with open(os.path.join(out_dir, "test.json"), "w", encoding="utf-8") as f:
        json.dump(test, f, indent=2)
        
    print(f"Dataset splits generated: Train={len(train)}, Val={len(val)}, Test={len(test)}")
