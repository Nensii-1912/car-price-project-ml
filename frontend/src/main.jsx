import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Car,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Gauge,
  Home,
  Info,
  Menu,
  RefreshCw,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./styles.css";

const API = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API,
});

/* =========================================================
   DEFAULT FORM
========================================================= */

const emptyCar = {
  Brand: "Maruti",
  Model: "Swift",
  Year: 2021,
  Mileage_kmpl: 20,
  Engine_CC: 1197,
  Horsepower: 88,
  Fuel_Type: "Petrol",
  Transmission: "Manual",
  Owner_Type: "First",
  Color: "White",
  City: "Rajkot",
  Kms_Driven: 25000,
  Insurance_Valid: 1,
  Service_History: 1,
  Num_of_Accidents: 0,
  Tax_Paid: 1,
  Number_of_Doors: 4,
  Number_of_Seats: 5,
  Registration_Age: 4,
  model: "Random Forest",
};

/* =========================================================
   VALIDATION RANGES
========================================================= */

const numericRules = {
  Year: {
    min: 1990,
    max: 2026,
    step: 1,
    label: "Year",
  },

  Mileage_kmpl: {
    min: 1,
    max: 100,
    step: 0.1,
    label: "Mileage",
  },

  Engine_CC: {
    min: 300,
    max: 10000,
    step: 1,
    label: "Engine CC",
  },

  Horsepower: {
    min: 20,
    max: 2000,
    step: 1,
    label: "Horsepower",
  },

  Kms_Driven: {
    min: 0,
    max: 1000000,
    step: 1,
    label: "Kms Driven",
  },

  Num_of_Accidents: {
    min: 0,
    max: 20,
    step: 1,
    label: "Number of Accidents",
  },

  Number_of_Doors: {
    min: 2,
    max: 6,
    step: 1,
    label: "Number of Doors",
  },

  Number_of_Seats: {
    min: 1,
    max: 10,
    step: 1,
    label: "Number of Seats",
  },

  Registration_Age: {
    min: 0,
    max: 50,
    step: 1,
    label: "Registration Age",
  },
};

/* =========================================================
   FALLBACK DROPDOWN OPTIONS
   Backend /options values are preferred.
========================================================= */

const fallbackOptions = {
  Brand: [
    "Maruti",
    "Hyundai",
    "Tata",
    "Honda",
    "Toyota",
    "Mahindra",
    "Ford",
    "Volkswagen",
    "Renault",
    "Kia",
    "Nissan",
    "Skoda",
    "BMW",
    "Mercedes",
    "Audi",
  ],

  Model: [
    "Swift",
    "Baleno",
    "WagonR",
    "Alto",
    "Dzire",
    "i20",
    "Creta",
    "Venue",
    "Nexon",
    "Punch",
    "City",
    "Amaze",
    "Fortuner",
    "XUV500",
    "Seltos",
  ],

  Fuel_Type: [
    "Petrol",
    "Diesel",
    "CNG",
    "Electric",
    "Hybrid",
    "LPG",
  ],

  Transmission: [
    "Manual",
    "Automatic",
    "AMT",
    "CVT",
    "DCT",
  ],

  Owner_Type: [
    "First",
    "Second",
    "Third",
    "Fourth & Above",
  ],

  Color: [
    "White",
    "Black",
    "Silver",
    "Grey",
    "Red",
    "Blue",
    "Brown",
    "Green",
    "Orange",
    "Yellow",
    "Other",
  ],

  City: [
    "Rajkot",
    "Ahmedabad",
    "Bangalore",
    "Chennai",
    "Delhi",
    "Hyderabad",
    "Kolkata",
    "Mumbai",
    "Pune",
  ],
};

/* =========================================================
   MONEY FORMAT
========================================================= */

function money(value) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—";
  }

  return (
    "₹" +
    Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })
  );
}

/* =========================================================
   APP SHELL
========================================================= */

function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    {
      to: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      to: "/predict",
      label: "Predict Price",
      icon: CircleDollarSign,
    },
    {
      to: "/models",
      label: "Model Lab",
      icon: BarChart3,
    },
    {
      to: "/about",
      label: "Project",
      icon: Info,
    },
     {
      to: "/contact",
      label: "Contact",
      icon: Info,
    },
  ];

  return (
    <div className="app">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Car size={22} />
          </div>

          <div>
            <div className="brand-name">
              AutoValue <span>AI</span>
            </div>

            <div className="brand-sub">
              Used Car Intelligence
            </div>
          </div>
        </div>

        <nav className="nav">
          <div className="nav-label">MAIN</div>

          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />

              <span>{label}</span>

              {to === location.pathname && (
                <ChevronRight
                  size={16}
                  className="nav-arrow"
                />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <Sparkles size={18} />

          <strong>Live ML metrics</strong>

          <p>
            Values come from the artifacts exported by
            your notebook.
          </p>
        </div>

        <div className="sidebar-footer">
          Final Year ML Project • 2026
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

          <div className="crumb">
            Machine Learning <span>/</span>{" "}
            {links.find(
              (x) => x.to === location.pathname
            )?.label || "Project"}
          </div>

          <div className="live-pill">
            <span className="pulse"></span>
            API Connected
          </div>
        </header>

        <div className="page">{children}</div>
      </main>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  note,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>

      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-note">{note}</div>
      </div>
    </div>
  );
}

/* =========================================================
   MODELS HOOK
========================================================= */

function useModels() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const response = await api.get("/models");

      setData(response.data);
      setError("");
    } catch (e) {
      setError(
        e.response?.data?.detail ||
          "Backend is not running or artifacts are missing."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    data,
    error,
    loading,
    reload: load,
  };
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const {
    data,
    error,
    loading,
    reload,
  } = useModels();

  const bestVisible = useMemo(() => {
    if (!data?.models?.length) return null;

    return data.models.reduce((a, b) =>
      a.test_r2 > b.test_r2 ? a : b
    );
  }, [data]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={15} />
            DATA-DRIVEN VALUATION
          </div>

          <h1>
            Know the value.
            <br />
            <span>Before you buy.</span>
          </h1>

          <p>
            Predict used-car prices with your trained
            machine learning models and explore live
            evaluation metrics directly from your notebook
            artifacts.
          </p>

          <div className="hero-actions">
            <NavLink
              to="/predict"
              className="btn primary"
            >
              Predict a Car
              <ArrowRight size={17} />
            </NavLink>

            <NavLink
              to="/models"
              className="btn ghost"
            >
              Explore Models
            </NavLink>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>

          <div className="car-glass">
            <div className="car-glow"></div>

            <Car
              size={118}
              strokeWidth={1.1}
            />

            <div className="car-tag">
              RF ENGINE
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="alert warning">
          <Activity size={18} />

          <div>
            <strong>
              Backend needs attention.
            </strong>

            <br />

            {error}
          </div>

          <button
            className="small-btn"
            onClick={reload}
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      )}

      <div className="section-head">
        <div>
          <div className="section-kicker">
            LIVE PROJECT STATUS
          </div>

          <h2>Your ML control center</h2>
        </div>

        <button
          className="icon-btn"
          onClick={reload}
          title="Refresh metrics"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Zap}
          label="Deployed Model"
          value={
            data?.deployed_model || "—"
          }
          note="Read from notebook export"
        />

        <StatCard
          icon={TrendingUp}
          label="Test R²"
          value={
            bestVisible
              ? `${bestVisible.test_r2.toFixed(
                  2
                )}%`
              : "—"
          }
          note={
            bestVisible
              ? bestVisible.name
              : "Live metric"
          }
        />

        <StatCard
          icon={Gauge}
          label="Features"
          value={
            data?.feature_count ?? "—"
          }
          note="Final training columns"
        />

        <StatCard
          icon={Activity}
          label="Test Rows"
          value={
            data?.test_rows?.toLocaleString(
              "en-IN"
            ) ?? "—"
          }
          note="20% test split"
        />
      </div>

      <section className="dashboard-grid">
        <div className="panel process-panel">
          <div className="panel-title">
            <div>
              <span className="mini-kicker">
                PIPELINE
              </span>

              <h3>
                From notebook to prediction
              </h3>
            </div>

            <CheckCircle2 size={20} />
          </div>

          <div className="timeline">
            {[
              [
                "01",
                "Clean",
                "Missing values, duplicates and data preparation",
              ],
              [
                "02",
                "Transform",
                "Encoding + numerical scaling",
              ],
              [
                "03",
                "Train",
                "Regression models learn from training data",
              ],
              [
                "04",
                "Export",
                "Notebook writes live model + metric artifacts",
              ],
              [
                "05",
                "Predict",
                "FastAPI serves predictions to React",
              ],
            ].map(([n, t, d]) => (
              <div
                className="timeline-item"
                key={n}
              >
                <div className="timeline-num">
                  {n}
                </div>

                <div>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="mini-kicker">
                MODEL SNAPSHOT
              </span>

              <h3>
                Evaluation at a glance
              </h3>
            </div>

            <BarChart3 size={20} />
          </div>

          {loading ? (
            <div className="empty">
              Loading live metrics…
            </div>
          ) : data?.models?.length ? (
            <div className="model-mini-list">
              {data.models
                .slice(0, 6)
                .map((m) => (
                  <div
                    className="model-mini"
                    key={m.name}
                  >
                    <div>
                      <strong>
                        {m.name}
                      </strong>

                      <span>
                        Test R²
                      </span>
                    </div>

                    <div className="meter">
                      <i
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              100,
                              m.test_r2
                            )
                          )}%`,
                        }}
                      ></i>
                    </div>

                    <b>
                      {m.test_r2.toFixed(2)}%
                    </b>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty">
              Run the notebook export cell to
              load models.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* =========================================================
   PREDICT PAGE
========================================================= */

function Predict() {
  const [form, setForm] =
    useState(emptyCar);

  const [models, setModels] =
    useState([]);

  const [options, setOptions] =
    useState(fallbackOptions);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [validationErrors, setValidationErrors] =
    useState({});

  /* -------------------------------------------------------
     LOAD MODELS + DROPDOWN OPTIONS
  ------------------------------------------------------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        const modelResponse =
          await api.get("/models");

        setModels(
          modelResponse.data.models || []
        );
      } catch {
        setModels([]);
      }

      try {
        const optionResponse =
          await api.get("/options");

        const backendOptions =
          optionResponse.data || {};

        setOptions((prev) => ({
          ...prev,

          Brand:
            backendOptions.Brand ||
            backendOptions.brands ||
            prev.Brand,

          Model:
            backendOptions.Model ||
            backendOptions.models ||
            prev.Model,

          Fuel_Type:
            backendOptions.Fuel_Type ||
            backendOptions.fuel_types ||
            prev.Fuel_Type,

          Transmission:
            backendOptions.Transmission ||
            backendOptions.transmissions ||
            prev.Transmission,

          Owner_Type:
            backendOptions.Owner_Type ||
            backendOptions.owner_types ||
            prev.Owner_Type,

          Color:
            backendOptions.Color ||
            backendOptions.colors ||
            prev.Color,

          City:
            backendOptions.City ||
            backendOptions.cities ||
            prev.City,
        }));
      } catch {
        // Keep fallback options
      }
    };

    loadData();
  }, []);

  /* -------------------------------------------------------
     FIELD DEFINITIONS
  ------------------------------------------------------- */

  const fields = [
    ["Brand", "select"],
    ["Model", "select"],

    ["Year", "number"],
    ["Mileage_kmpl", "number"],
    ["Engine_CC", "number"],
    ["Horsepower", "number"],

    ["Fuel_Type", "select"],
    ["Transmission", "select"],
    ["Owner_Type", "select"],
    ["Color", "select"],
    ["City", "select"],

    ["Kms_Driven", "number"],

    ["Insurance_Valid", "boolean"],
    ["Service_History", "boolean"],

    ["Num_of_Accidents", "number"],

    ["Tax_Paid", "boolean"],

    ["Number_of_Doors", "number"],
    ["Number_of_Seats", "number"],
    ["Registration_Age", "number"],
  ];

  /* -------------------------------------------------------
     VALIDATE SINGLE FIELD
  ------------------------------------------------------- */

  const validateField = (
    key,
    value
  ) => {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return `${numericRules[key]?.label || key} is required.`;
    }

    if (!numericRules[key]) {
      return "";
    }

    const numberValue =
      Number(value);

    if (Number.isNaN(numberValue)) {
      return `${numericRules[key].label} must be a valid number.`;
    }

    const rule =
      numericRules[key];

    if (numberValue < rule.min) {
      return `${rule.label} cannot be below ${rule.min}.`;
    }

    if (numberValue > rule.max) {
      return `${rule.label} cannot be above ${rule.max}.`;
    }

    if (numberValue < 0) {
      return `${rule.label} cannot be negative.`;
    }

    return "";
  };

  /* -------------------------------------------------------
     UPDATE FIELD
  ------------------------------------------------------- */

  const set = (
    key,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (numericRules[key]) {
      const fieldError =
        validateField(
          key,
          value
        );

      setValidationErrors(
        (prev) => ({
          ...prev,
          [key]: fieldError,
        })
      );
    }
  };

  /* -------------------------------------------------------
     VALIDATE ALL FIELDS
  ------------------------------------------------------- */

  const validateForm = () => {
    const errors = {};

    Object.keys(numericRules).forEach(
      (key) => {
        const message =
          validateField(
            key,
            form[key]
          );

        if (message) {
          errors[key] = message;
        }
      }
    );

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* -------------------------------------------------------
     SUBMIT
  ------------------------------------------------------- */

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    const valid =
      validateForm();

    if (!valid) {
      setError(
        "Please correct the highlighted fields before predicting."
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
      };

      fields.forEach(
        ([key, type]) => {
          if (
            type === "number" ||
            type === "boolean"
          ) {
            payload[key] =
              Number(payload[key]);
          }
        }
      );

      const response =
        await api.post(
          "/predict",
          payload
        );

      setResult(
        response.data
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Prediction failed."
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------
     SELECT OPTION HELPER
  ------------------------------------------------------- */

  const renderOptions = (
    key
  ) => {
    const values =
      options[key] || [];

    return values.map(
      (value) => (
        <option
          key={String(value)}
          value={value}
        >
          {value}
        </option>
      )
    );
  };

  /* -------------------------------------------------------
     RANGE TEXT
  ------------------------------------------------------- */

  const rangeText = (
    key
  ) => {
    const rule =
      numericRules[key];

    if (!rule) return "";

    return `Allowed: ${rule.min.toLocaleString(
      "en-IN"
    )} – ${rule.max.toLocaleString(
      "en-IN"
    )}`;
  };

  return (
    <>
      <div className="page-title">
        <div>
          <div className="section-kicker">
            PREDICTION STUDIO
          </div>

          <h1>
            Estimate a car's price
          </h1>

          <p>
            Enter vehicle details. The selected
            trained model performs the prediction
            through FastAPI.
          </p>
        </div>
      </div>

      <div className="predict-layout">
        <form
          className="panel form-panel"
          onSubmit={submit}
        >
          <div className="form-heading">
            <Car size={21} />

            <div>
              <h3>
                Vehicle details
              </h3>

              <p>
                Choose values from the dropdowns
                and enter valid numeric values.
              </p>
            </div>
          </div>

          <div className="field-grid">
            {fields.map(
              ([key, type]) => {
                const fieldError =
                  validationErrors[key];

                return (
                  <label
                    className={`field ${
                      fieldError
                        ? "field-error"
                        : ""
                    }`}
                    key={key}
                  >
                    <span>
                      {key.replaceAll(
                        "_",
                        " "
                      )}
                    </span>

                    {/* DROPDOWN */}
                    {type ===
                    "select" ? (
                      <select
                        value={
                          form[key]
                        }
                        onChange={(e) =>
                          set(
                            key,
                            e.target.value
                          )
                        }
                        required
                      >
                        {renderOptions(
                          key
                        )}
                      </select>
                    ) : type ===
                      "boolean" ? (
                      /* YES / NO */
                      <select
                        value={
                          form[key]
                        }
                        onChange={(e) =>
                          set(
                            key,
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="1">
                          Yes / 1
                        </option>

                        <option value="0">
                          No / 0
                        </option>
                      </select>
                    ) : (
                      /* NUMBER INPUT */
                      <>
                        <input
                          type="number"
                          value={
                            form[key]
                          }
                          min={
                            numericRules[
                              key
                            ]?.min
                          }
                          max={
                            numericRules[
                              key
                            ]?.max
                          }
                          step={
                            numericRules[
                              key
                            ]?.step || 1
                          }
                          required
                          onKeyDown={(e) => {
                            /*
                             * Prevent minus sign
                             */
                            if (
                              e.key ===
                              "-" ||
                              e.key ===
                              "e"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const value =
                              e.target.value;

                            set(
                              key,
                              value
                            );
                          }}
                        />

                        <small className="field-range">
                          {rangeText(
                            key
                          )}
                        </small>

                        {fieldError && (
                          <small className="validation-message">
                            {fieldError}
                          </small>
                        )}
                      </>
                    )}
                  </label>
                );
              }
            )}
          </div>

          {/* MODEL DROPDOWN */}

          <label className="field model-select">
            <span>
              Prediction model
            </span>

            <select
              value={form.model}
              onChange={(e) =>
                set(
                  "model",
                  e.target.value
                )
              }
            >
              {models.length ? (
                models.map((m) => (
                  <option
                    key={m.name}
                    value={m.name}
                  >
                    {m.name}
                  </option>
                ))
              ) : (
                <option value="Random Forest">
                  Random Forest
                </option>
              )}
            </select>
          </label>

          {error && (
            <div className="alert error">
              <X size={17} />
              {error}
            </div>
          )}

          <button
            className="btn primary full"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw
                  className="spin"
                  size={17}
                />
                Predicting…
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Predict Market Price
              </>
            )}
          </button>
        </form>

        <div className="result-column">
          <div
            className={`result-card ${
              result
                ? "has-result"
                : ""
            }`}
          >
            <div className="result-icon">
              <CircleDollarSign
                size={30}
              />
            </div>

            <div className="mini-kicker">
              PREDICTED VALUE
            </div>

            <div className="price">
              {result
                ? money(
                    result.predicted_price
                  )
                : "₹ —"}
            </div>

            <p>
              {result
                ? `Generated by ${result.model}`
                : "Your prediction will appear here."}
            </p>

            {result && (
              <div className="result-chip">
                <CheckCircle2 size={14} />
                Live model response
              </div>
            )}
          </div>

          <div className="panel tip-panel">
            <div className="mini-kicker">
              PROJECT NOTE
            </div>

            <h3>
              Why this is dynamic
            </h3>

            <p>
              The page does not contain a
              hard-coded prediction. It sends
              your form data to FastAPI, which
              loads the latest exported model
              artifact and returns its prediction.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   MODELS PAGE
========================================================= */

function Models() {
  const {
    data,
    error,
    loading,
    reload,
  } = useModels();

  const chartData =
    data?.models?.map((m) => ({
      name: m.name.replace(
        " (Tuned)",
        ""
      ),
      r2: m.test_r2,
    })) || [];

  return (
    <>
      <div className="page-title title-row">
        <div>
          <div className="section-kicker">
            MODEL LAB
          </div>

          <h1>
            Compare your regressors
          </h1>

          <p>
            These numbers are loaded from
            <code>
              model_registry.pkl
            </code>
            , not typed into the UI.
          </p>
        </div>

        <button
          className="btn ghost"
          onClick={reload}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert warning">
          <Activity size={18} />
          {error}
        </div>
      )}

      <div className="model-grid">
        <div className="panel chart-panel">
          <div className="panel-title">
            <div>
              <span className="mini-kicker">
                TEST PERFORMANCE
              </span>

              <h3>
                R² comparison
              </h3>
            </div>

            <TrendingUp size={20} />
          </div>

          {loading ? (
            <div className="empty">
              Loading…
            </div>
          ) : chartData.length ? (
            <ResponsiveContainer
              width="100%"
              height={330}
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(v) =>
                    `${v}%`
                  }
                />

                <Tooltip
                  formatter={(v) => [
                    `${Number(v).toFixed(
                      2
                    )}%`,
                    "Test R²",
                  ]}
                />

                <Bar
                  dataKey="r2"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                >
                  {chartData.map(
                    (_, i) => (
                      <Cell key={i} />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty">
              No models exported yet.
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="mini-kicker">
                REGISTRY
              </span>

              <h3>
                Live model metrics
              </h3>
            </div>

            <Activity size={20} />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Train R²</th>
                  <th>Test R²</th>
                  <th>MAE</th>
                  <th>RMSE</th>
                </tr>
              </thead>

              <tbody>
                {data?.models?.map(
                  (m) => (
                    <tr key={m.name}>
                      <td>
                        <strong>
                          {m.name}
                        </strong>

                        {m.name ===
                          data.deployed_model && (
                          <span className="deployed">
                            LIVE
                          </span>
                        )}
                      </td>

                      <td>
                        {m.train_r2.toFixed(
                          2
                        )}
                        %
                      </td>

                      <td className="accent-num">
                        {m.test_r2.toFixed(
                          2
                        )}
                        %
                      </td>

                      <td>
                        {money(m.mae)}
                      </td>

                      <td>
                        {money(m.rmse)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="panel source-panel">
        <div>
          <div className="mini-kicker">
            NOTEBOOK SYNC
          </div>

          <h3>
            How updates reach this page
          </h3>
        </div>

        <div className="sync-flow">
          <span>Notebook</span>
          <ArrowRight />
          <span>Export cell</span>
          <ArrowRight />
          <span>model_artifacts</span>
          <ArrowRight />
          <span>FastAPI</span>
          <ArrowRight />
          <span>React</span>
        </div>

        <p>
          Whenever you retrain a model and run
          the final export cell, the backend
          detects the changed artifact files
          automatically. Refreshing this page
          loads the new metrics.
        </p>
      </div>
    </>
  );
}

/* =========================================================
   ABOUT PAGE
========================================================= */

function About() {
  return (
    <>
      <div className="page-title">
        <div>
          <div className="section-kicker">
            FINAL PROJECT
          </div>

          <h1>
            Inside AutoValue AI
          </h1>

          <p>
            A clean separation between ML
            training, API serving, and the React
            user interface.
          </p>
        </div>
      </div>

      <div className="about-grid">
        <div className="panel about-main">
          <div className="about-icon">
            <Car size={27} />
          </div>

          <h2>
            Used Car Price Prediction
          </h2>

          <p>
            The machine learning notebook prepares
            used-car data, trains regression models
            and exports the trained model state.
            The React application never needs to
            know how the model was trained; it
            communicates with FastAPI through a
            small REST API.
          </p>

          <div className="architecture">
            {[
              [
                "01",
                "ML Notebook",
                "Training + evaluation + artifact export",
              ],
              [
                "02",
                "FastAPI",
                "Loads artifacts + prediction endpoints",
              ],
              [
                "03",
                "React",
                "Attractive multi-page interface",
              ],
              [
                "04",
                "Model Registry",
                "Live metrics for every exported model",
              ],
            ].map(([n, t, d]) => (
              <div
                className="arch-card"
                key={n}
              >
                <b>{n}</b>

                <div>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="mini-kicker">
            CURRENT DESIGN
          </div>

          <div className="feature-list">
            <div>
              <Zap />
              Dynamic predictions
            </div>

            <div>
              <BarChart3 />
              Live model comparison
            </div>

            <div>
              <RefreshCw />
              Artifact auto-reload
            </div>

            <div>
              <Activity />
              REST API architecture
            </div>

            <div>
              <Sparkles />
              Responsive UI
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   APP
========================================================= */

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      return;
    }

    setSent(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">GET IN TOUCH</span>
          <h1>Contact Us</h1>
          <p>
            Have a question about CarValue AI? Send us a message and we will
            be happy to help.
          </p>
        </div>
      </div>

      <div className="contact-grid">
        <div className="card contact-info">
          <h2>Let's Connect</h2>
          <p>
            If you have questions, suggestions, or feedback about the used car
            price prediction system, feel free to contact us.
          </p>

          <div className="contact-item">
            <div className="contact-icon">📧</div>
            <div>
              <strong>Email</strong>
              <span>support@carvalueai.com</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <strong>Location</strong>
              <span>Gujarat, India</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">🤖</div>
            <div>
              <strong>Project</strong>
              <span>AI Based Used Car Price Prediction</span>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">⏱️</div>
            <div>
              <strong>Response Time</strong>
              <span>Usually within 24–48 hours</span>
            </div>
          </div>
        </div>

        <div className="card contact-form-card">
          <h2>Send a Message</h2>

          {sent && (
            <div className="success-message">
              ✅ Your message has been submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows="6"
                required
              />
            </div>

            <button type="submit" className="primary-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppShell>
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/predict"
          element={<Predict />}
        />

        <Route
          path="/models"
          element={<Models />}
        />

        <Route
          path="/about"
          element={<About />}
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AppShell>
  );
}

/* =========================================================
   ROOT
========================================================= */

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);