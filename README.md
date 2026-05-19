# Algovisual – Algorithm Convergence Visualizer
### MERN Stack · MongoDB · Express · React · Node.js

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/algoconv-mern)

A full-stack educational web application that visualizes, analyzes, and compares the convergence behavior of iterative numerical algorithms. Built with the MERN stack. Designed for students and researchers in numerical analysis, optimization, and machine learning.

---

## Project Structure

```
algoconv-mern/
│
├── vercel.json              ← Vercel deployment config
├── package.json             ← Root: concurrently dev script
├── .gitignore
│
├── server/                  ← Express + Node.js Backend
│   ├── index.js             ← Entry point, MongoDB connect, middleware
│   ├── engine.js            ← All 8 algorithm implementations (JS)
│   ├── package.json
│   ├── .env.example
│   ├── routes/
│   │   ├── run.js           ← POST /api/run
│   │   ├── compare.js       ← POST /api/compare
│   │   ├── history.js       ← GET/DELETE /api/history/*
│   │   └── algorithms.js    ← GET /api/algorithms
│   ├── controllers/
│   │   ├── runController.js
│   │   ├── compareController.js
│   │   └── historyController.js
│   └── models/
│       ├── Run.js           ← Mongoose schema for algorithm runs
│       └── Comparison.js    ← Mongoose schema for comparisons
│
└── client/                  ← React + Vite Frontend
    ├── index.html
    ├── vite.config.js       ← Proxy /api → Express in dev
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx         ← React entry point
        ├── App.jsx          ← Router + Layout
        ├── index.css        ← Global CSS variables + base styles
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ConvergenceCharts.jsx   ← 4 Chart.js charts
        │   ├── IterationTable.jsx      ← Sortable iteration data
        │   └── MetricsRow.jsx          ← 4 metric cards
        ├── pages/
        │   ├── Home.jsx       ← Landing + algorithm cards
        │   ├── Visualizer.jsx ← Main algorithm runner
        │   ├── Comparison.jsx ← Side-by-side comparison
        │   ├── History.jsx    ← Session run history
        │   └── About.jsx      ← Stack info + API docs
        ├── context/
        │   └── HistoryContext.jsx  ← Global run history state
        └── utils/
            ├── api.js         ← Fetch wrapper for all API calls
            └── constants.js   ← Algorithm list + colors
```

---

## Quick Start — Run Locally

### Prerequisites
- **Node.js** 18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
  OR use **MongoDB Atlas** free cluster → https://www.mongodb.com/atlas

### Step 1 — Install all dependencies
```bash
cd algoconv-mern
npm run install:all
```

### Step 2 — Configure environment
```bash
# Server env
cp server/.env.example server/.env
# Edit server/.env:
# MONGO_URI=mongodb://127.0.0.1:27017/algoconv   ← local
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/algoconv  ← Atlas
```

### Step 3 — Run in development mode
```bash
npm run dev
```

This starts both:
- **Backend** → http://localhost:5000  (Express + MongoDB)
- **Frontend** → http://localhost:5173 (Vite dev server, proxies /api to backend)

Open **http://localhost:5173** in your browser.

---

## API Reference

| Method   | Endpoint                  | Description                         |
|----------|--------------------------|-------------------------------------|
| `POST`   | `/api/run`               | Execute a single algorithm          |
| `POST`   | `/api/compare`           | Compare two algorithms              |
| `GET`    | `/api/history/runs`      | Get all runs (paginated)            |
| `GET`    | `/api/history/runs/:id`  | Get single run with iterations      |
| `DELETE` | `/api/history/runs/:id`  | Delete a run                        |
| `GET`    | `/api/algorithms`        | List all algorithms + metadata      |
| `GET`    | `/api/health`            | Health check + DB status            |

### POST /api/run — Example
```json
{
  "algorithm": "newton_raphson",
  "function": "x**3 - 2*x - 5",
  "x0": 2.0,
  "max_iterations": 100,
  "tolerance": 1e-6
}
```

### POST /api/compare — Example
```json
{
  "algorithm1": "gradient_descent",
  "algorithm2": "newton_raphson",
  "function": "x**3 - 2*x - 5",
  "x0": 2.0,
  "learning_rate": 0.1,
  "max_iterations": 200,
  "tolerance": 1e-6
}
```

### Algorithm Keys
| Key                   | Label                    | Category         |
|-----------------------|--------------------------|------------------|
| `gradient_descent`    | Gradient Descent         | Optimization     |
| `newton_raphson`      | Newton–Raphson           | Root-Finding     |
| `bisection`           | Bisection Method         | Root-Finding     |
| `secant`              | Secant Method            | Root-Finding     |
| `simulated_annealing` | Simulated Annealing      | Metaheuristic    |
| `genetic`             | Genetic Algorithm        | Evolutionary     |
| `linear_regression`   | Linear Regression GD     | Machine Learning |
| `logistic_regression` | Logistic Regression GD   | Machine Learning |

---

## Upload to GitHub

```bash
# 1. Initialize git repo
cd algoconv-mern
git init
git add .
git commit -m "feat: initial AlgoConv MERN implementation"

# 2. Create repo on GitHub (go to github.com → New repository → name: algoconv-mern)

# 3. Push
git remote add origin https://github.com/YOUR_USERNAME/algoconv-mern.git
git branch -M main
git push -u origin main
```

---

## Deploy to Vercel

### Step 1 — Build the React client first
```bash
cd client
npm run build
cd ..
```

### Step 2 — Push build output to GitHub
```bash
# Remove client/dist from .gitignore temporarily for Vercel static deploy
git add client/dist -f
git commit -m "build: add client dist for Vercel"
git push
```

### Step 3 — Deploy via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

When prompted:
- **Framework**: Other
- **Build command**: `cd client && npm run build`
- **Output directory**: `client/dist`
- **Root directory**: `.` (keep as root)

### Step 4 — Set Environment Variables on Vercel
Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**:

```
MONGO_URI    = mongodb+srv://user:pass@cluster.mongodb.net/algoconv
NODE_ENV     = production
CLIENT_URL   = https://your-app.vercel.app
```

### Step 5 — Redeploy
```bash
vercel --prod
```

Your app will be live at `https://algoconv-mern-xxxx.vercel.app` ✓

---

## MongoDB Atlas Setup (Free)

1. Go to https://www.mongodb.com/atlas → Create free cluster
2. **Database Access** → Add user → username + password
3. **Network Access** → Add IP → `0.0.0.0/0` (allow all for Vercel)
4. **Clusters** → Connect → Connect your application → copy URI
5. Replace `<password>` in the URI and set as `MONGO_URI` in Vercel env vars

---

## Tech Stack

| Layer     | Technology                          | Purpose                        |
|-----------|-------------------------------------|--------------------------------|
| Frontend  | React 18 + Vite                     | SPA with fast HMR              |
| Routing   | React Router v6                     | Client-side navigation         |
| Charts    | Chart.js 4 + react-chartjs-2        | Convergence visualizations     |
| State     | React Context API                   | Global run history             |
| Backend   | Node.js + Express 4                 | REST API server                |
| Database  | MongoDB + Mongoose                  | Persistent run storage         |
| Algorithm | Pure JavaScript (engine.js)         | All 8 algorithms               |
| Deploy    | Vercel (frontend + serverless)      | Hosting + CI/CD                |
| DB Host   | MongoDB Atlas                       | Managed database               |

---

*Chandigarh University — UG Mini Project 2026*
