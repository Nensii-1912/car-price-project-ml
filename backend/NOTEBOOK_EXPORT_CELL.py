# ============================================================
# FINAL EXPORT CELL - RUN THIS AFTER TRAINING YOUR MODELS
# ============================================================
#
# Purpose:
# 1. Saves every trained regression model that exists in this notebook.
# 2. Saves the exact scaler/feature information needed by FastAPI.
# 3. Saves live metrics for the React Model Comparison page.
# 4. The FastAPI backend automatically notices changed artifact files.
#
# IMPORTANT:
# Your notebook already creates X_train, X_test, y_train, y_test,
# scaler, num_cols and le. Keep those cells before this cell.
#
# Put this cell at the END of your notebook and run it after training.

import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

OUT = os.path.join(os.getcwd(), "model_artifacts")
os.makedirs(OUT, exist_ok=True)

# Add a model here only after it has actually been trained in the notebook.
candidate_models = {
    "Linear Regression": globals().get("lr"),
    "Lasso": globals().get("lasso"),
    "Ridge": globals().get("ridge"),
    "ElasticNet": globals().get("en"),
    "Decision Tree (Tuned)": globals().get("dt"),
    "Random Forest": globals().get("rf"),
    "Gradient Boosting": globals().get("gbr"),
    "KNN": globals().get("knn"),
    "SVR": globals().get("svr"),
}

models = {
    name: model
    for name, model in candidate_models.items()
    if model is not None and hasattr(model, "predict")
}

if not models:
    raise RuntimeError("No trained regression models were found.")

def metric_record(display_name, estimator):
    pred_train = estimator.predict(X_train)
    pred_test = estimator.predict(X_test)

    return {
        "display_name": display_name,
        "train_r2": float(r2_score(y_train, pred_train)),
        "test_r2": float(r2_score(y_test, pred_test)),
        "mae": float(mean_absolute_error(y_test, pred_test)),
        "rmse": float(np.sqrt(mean_squared_error(y_test, pred_test))),
        "rss": float(np.sum((y_test - pred_test) ** 2)),
    }

registry = {
    name: metric_record(name, estimator)
    for name, estimator in models.items()
}

# Current project model: Random Forest.
# If RF exists, it is marked as the deployed model.
deployed_model = "Random Forest" if "Random Forest" in models else next(iter(models))

# Save all trained models.
joblib.dump(models, os.path.join(OUT, "models.pkl"))

# Save the exact preprocessing state used by the notebook.
preprocessing_artifacts = {
    "feature_names": list(X_train.columns),
    "scaler": scaler,
    "num_cols": list(num_cols),
    "transmission_encoder": le,
}
joblib.dump(
    preprocessing_artifacts,
    os.path.join(OUT, "preprocessing_artifacts.pkl")
)

# Save metrics.
joblib.dump(registry, os.path.join(OUT, "model_registry.pkl"))

# Human-readable run information.
run_info = {
    "source_notebook": "mlproject.ipynb",
    "feature_count": int(len(X_train.columns)),
    "deployed_model": deployed_model,
    "train_rows": int(len(X_train)),
    "test_rows": int(len(X_test)),
    "generated_at": datetime.now().astimezone().isoformat(),
    "available_models": list(models.keys()),
}

with open(os.path.join(OUT, "run_info.json"), "w", encoding="utf-8") as f:
    json.dump(run_info, f, indent=2)

# Optional notebook comparison table.
comparison = pd.DataFrame(registry).T
comparison["train_r2_percent"] = comparison["train_r2"] * 100
comparison["test_r2_percent"] = comparison["test_r2"] * 100

print("=" * 60)
print("MODEL ARTIFACT EXPORT COMPLETE")
print("=" * 60)
print("Available models:", list(models.keys()))
print("Deployed model:", deployed_model)
print("Artifacts folder:", os.path.abspath(OUT))
print("\nModel comparison:")
display(
    comparison[
        ["display_name", "train_r2_percent", "test_r2_percent", "mae", "rmse", "rss"]
    ].round(4)
)
print("\nRestart is NOT required for FastAPI.")
print("Refresh the React pages to see the new metrics/model.")
