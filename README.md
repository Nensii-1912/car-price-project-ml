# AutoValue AI — Used Car Price Prediction

Final-submission-ready starter architecture:

- **ML:** your `mlproject_original.ipynb`
- **Backend:** FastAPI
- **Frontend:** React + Vite
- **Charts:** Recharts
- **Icons:** Lucide
- **Model artifacts:** `backend/model_artifacts/`

## 1. Important notebook integration

Your notebook already contains the important objects:

- `X_train`, `X_test`, `y_train`, `y_test`
- `scaler`
- `num_cols`
- `le`
- trained model variables such as `rf`, and later `lr`, `ridge`, `lasso`, `en`, `dt`, `gbr`, etc.

Open:

`backend/NOTEBOOK_EXPORT_CELL.py`

Copy its complete contents into a **new final cell at the end of your notebook**.

Run all the model-training cells first, then run this final export cell.

It creates:

```text
backend/
└── model_artifacts/
    ├── models.pkl
    ├── model_registry.pkl
    ├── preprocessing_artifacts.pkl
    └── run_info.json
```

### Why this design is important

The React page does NOT contain static scores.

Notebook → export artifacts → FastAPI → React

If you change model parameters, retrain, add another regression model, or change the resulting metrics, run the notebook/export cell again. FastAPI checks the artifact file timestamps and reloads them automatically. Refreshing the React Model Lab page then shows the new values.

**A `.ipynb` file cannot magically change a trained model just because a cell was edited. The notebook must be executed/retrained and the export cell must run.** This is the correct practical deployment workflow for a college project.

## 2. Folder structure

```text
car_price_final_project/
│
├── mlproject_original.ipynb
├── README.md
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── NOTEBOOK_EXPORT_CELL.py
│   └── model_artifacts/
│       └── <-- generated after notebook export
│
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        └── styles.css
```

## 3. Copy artifacts

After running the notebook export cell, copy the generated:

```text
model_artifacts/
```

folder into:

```text
car_price_final_project/backend/
```

The notebook can also be configured to write directly there by changing `OUT` in the export cell to your backend path.

For example, if your project folder is next to the notebook:

```python
OUT = r"C:\path\to\car_price_final_project\backend\model_artifacts"
```

Using an absolute path is easiest for a final submission.

## 4. Start FastAPI

Open terminal inside `backend`:

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install:

```bash
pip install -r requirements.txt
```

Start:

```bash
uvicorn app:app --reload
```

Backend:

`http://127.0.0.1:8000`

API docs:

`http://127.0.0.1:8000/docs`

## 5. Start React

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite address shown in the terminal, normally:

`http://localhost:5173`

## 6. Pages

### Dashboard
Project overview, live deployed model, feature count, test rows, and model snapshot.

### Predict Price
Attractive vehicle form. Sends real input to FastAPI and displays the prediction returned by the trained model.

### Model Lab
Reads the live model registry and displays:

- Train R²
- Test R²
- MAE
- RMSE
- model comparison chart
- currently deployed model

### Project
Explains the architecture and ML → API → frontend flow.

## 7. Adding more regression models later

In the notebook, train a new model and store it in a variable, for example:

```python
from sklearn.linear_model import Ridge

ridge = Ridge(alpha=5)
ridge.fit(X_train, y_train)
```

The export cell already checks for:

```text
lr
lasso
ridge
en
dt
rf
gbr
knn
svr
```

So once the variable exists and the model is trained, run the export cell again.

The model automatically appears in:

- Model Lab
- model comparison chart
- prediction model dropdown

No React code change is required.

## 8. Final-submission note

Keep the notebook as the source of truth for model training.

Keep FastAPI as the serving layer.

Keep React as the presentation/UI layer.

This separation makes the project easier to demonstrate and explain during viva.
