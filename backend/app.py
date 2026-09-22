from pathlib import Path
from typing import Any
import json
import time

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
ARTIFACT_DIR = BASE_DIR / "model_artifacts"

app = FastAPI(
    title="Car Price Prediction API",
    version="1.0.0",
    description="FastAPI backend for the used-car price prediction final project."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_cache = {
    "models": None,
    "registry": None,
    "artifacts": None,
    "run_info": None,
    "signature": None,
}

def _signature():
    files = [
        ARTIFACT_DIR / "models.pkl",
        ARTIFACT_DIR / "model_registry.pkl",
        ARTIFACT_DIR / "preprocessing_artifacts.pkl",
        ARTIFACT_DIR / "run_info.json",
    ]
    return tuple(
        (str(p), p.stat().st_mtime_ns, p.stat().st_size)
        for p in files if p.exists()
    )

def load_artifacts(force=False):
    sig = _signature()
    if not force and _cache["signature"] == sig and _cache["models"] is not None:
        return _cache

    required = [
        ARTIFACT_DIR / "models.pkl",
        ARTIFACT_DIR / "model_registry.pkl",
        ARTIFACT_DIR / "preprocessing_artifacts.pkl",
    ]
    missing = [str(p) for p in required if not p.exists()]
    if missing:
        raise RuntimeError(
            "Model artifacts are missing. Run the notebook export cell first. "
            f"Missing: {missing}"
        )

    _cache["models"] = joblib.load(ARTIFACT_DIR / "models.pkl")
    _cache["registry"] = joblib.load(ARTIFACT_DIR / "model_registry.pkl")
    _cache["artifacts"] = joblib.load(ARTIFACT_DIR / "preprocessing_artifacts.pkl")

    info_path = ARTIFACT_DIR / "run_info.json"
    _cache["run_info"] = (
        json.loads(info_path.read_text(encoding="utf-8"))
        if info_path.exists() else {}
    )
    _cache["signature"] = sig
    return _cache

@app.on_event("startup")
def startup():
    ARTIFACT_DIR.mkdir(exist_ok=True)

class CarInput(BaseModel):
    Brand: str
    Model: str
    Year: int = Field(ge=1980, le=2100)
    Mileage_kmpl: float = Field(gt=0)
    Engine_CC: float = Field(gt=0)
    Horsepower: float = Field(gt=0)
    Fuel_Type: str
    Transmission: str
    Owner_Type: str
    Color: str
    City: str
    Kms_Driven: float = Field(ge=0)
    Insurance_Valid: int = Field(ge=0, le=1)
    Service_History: int = Field(ge=0, le=1)
    Num_of_Accidents: int = Field(ge=0)
    Tax_Paid: int = Field(ge=0, le=1)
    Number_of_Doors: int = Field(ge=1, le=10)
    Number_of_Seats: int = Field(ge=1, le=20)
    Registration_Age: float = Field(ge=0)
    model: str = "Random Forest"

def _prepare_input(payload: CarInput, artifacts: dict) -> pd.DataFrame:
    data = payload.model_dump()
    selected_model = data.pop("model", "Random Forest")

    # Match the notebook's preprocessing:
    # Owner_Type -> numeric mapping, Transmission -> LabelEncoder,
    # selected categorical columns -> get_dummies(drop_first=True),
    # numeric model columns -> StandardScaler.
    owner_map = {
        "First": 1,
        "Second": 2,
        "Third": 3,
        "Fourth+": 4,
    }

    row = pd.DataFrame([data])
    row["Owner_Type"] = row["Owner_Type"].map(owner_map)

    if row["Owner_Type"].isna().any():
        raise HTTPException(status_code=400, detail="Invalid Owner_Type.")

    le = artifacts.get("transmission_encoder")
    if le is not None:
        try:
            row["Transmission"] = le.transform(row["Transmission"])
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Transmission value was not present in the training data."
            )

    categorical_cols = ["Brand", "Model", "Fuel_Type", "Color", "City"]
    row = pd.get_dummies(
        row,
        columns=categorical_cols,
        drop_first=True,
        dtype=int,
    )

    feature_names = artifacts["feature_names"]
    row = row.reindex(columns=feature_names, fill_value=0)

    num_cols = artifacts["num_cols"]
    scaler = artifacts["scaler"]
    row[num_cols] = scaler.transform(row[num_cols])

    return row

@app.get("/api/health")
def health():
    try:
        data = load_artifacts()
        return {
            "status": "ok",
            "artifacts_loaded": True,
            "models": list(data["models"].keys()),
            "deployed_model": data["run_info"].get("deployed_model"),
            "updated_at": data["run_info"].get("generated_at"),
        }
    except Exception as exc:
        return {
            "status": "waiting",
            "artifacts_loaded": False,
            "message": str(exc),
        }

@app.get("/api/models")
def models():
    try:
        data = load_artifacts()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    result = []
    for name, metrics in data["registry"].items():
        result.append({
            "name": name,
            "train_r2": round(float(metrics.get("train_r2", 0)) * 100, 2),
            "test_r2": round(float(metrics.get("test_r2", 0)) * 100, 2),
            "mae": round(float(metrics.get("mae", 0)), 2),
            "rmse": round(float(metrics.get("rmse", 0)), 2),
            "rss": round(float(metrics.get("rss", 0)), 2) if "rss" in metrics else None,
        })

    return {
        "models": result,
        "deployed_model": data["run_info"].get("deployed_model"),
        "feature_count": data["run_info"].get("feature_count"),
        "train_rows": data["run_info"].get("train_rows"),
        "test_rows": data["run_info"].get("test_rows"),
        "generated_at": data["run_info"].get("generated_at"),
    }

@app.get("/api/metadata")
def metadata():
    try:
        data = load_artifacts()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    return {
        "feature_names": data["artifacts"].get("feature_names", []),
        "num_cols": data["artifacts"].get("num_cols", []),
        "deployed_model": data["run_info"].get("deployed_model"),
        "generated_at": data["run_info"].get("generated_at"),
    }

@app.post("/api/predict")
def predict(payload: CarInput):
    try:
        data = load_artifacts()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    model_name = payload.model
    if model_name not in data["models"]:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{model_name}' is not available. "
                   f"Available models: {list(data['models'].keys())}"
        )

    X = _prepare_input(payload, data["artifacts"])
    estimator = data["models"][model_name]

    try:
        prediction = float(estimator.predict(X)[0])
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    return {
        "model": model_name,
        "predicted_price": round(prediction, 2),
        "currency": "INR",
        "generated_at": data["run_info"].get("generated_at"),
    }
