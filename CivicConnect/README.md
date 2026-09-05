# CivicConnect – Jharkhand Societal Innovation Portal

A unified, multi-stakeholder civic innovation and problem resolution platform for the Government of Jharkhand.

---

## 🚀 How to Run on Any Machine (One Command)

### Prerequisites
- **Node.js** (v18 or higher recommended) - [Download Node.js](https://nodejs.org)
- **MongoDB** (running locally on port 27017, or set `MONGO_URI` in `server/.env`)
- *(Optional)* **Python 3.10+** (if running the Python AI microservice separately)

---

### Method 1: Single Terminal Command (Windows, macOS, Linux)

In the project root directory (`CivicConnect`):

```bash
# First time setup (installs root, client, and server dependencies)
npm run setup

# Start Frontend & Backend simultaneously
npm run dev
# OR simply:
npm start
```

### Method 2: One-Click Scripts
- **Windows**: Double-click `start.bat`
- **macOS / Linux**: Run `./start.sh`

---

## 🌐 Running Endpoints
Once started, open your browser:
- **Frontend Web Portal**: [http://localhost:5173](http://localhost:5173)
- **Backend Express API**: [http://localhost:5000](http://localhost:5000)
- **Python AI Microservice** *(Optional)*: [http://localhost:8000](http://localhost:8000)

---

## 📂 Project Architecture

```
CivicConnect/
├── client/                     # React 19 + Vite + Bootstrap 5 Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI & Gov Components
│   │   ├── pages/citizen/      # Complete Citizen Engagement Module
│   │   ├── modules/university/ # University Research & Innovation Portal
│   │   └── services/           # Real API Service Connectors
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── controllers/            # Citizen, University, AI, Notification APIs
│   ├── models/                 # Mongoose Schemas (User, Problem, University, etc.)
│   ├── routes/                 # Express API Endpoints (/api/citizens, /api/universities, etc.)
│   ├── services/               # Dynamic University Matching & AI Bridge
│   └── seed.js                 # Automatic DB Seeding (Universities, Problems)
├── ai-service/                 # Python FastAPI AI Microservice (Port 8000)
│   └── app/inference/          # Multi-Modal Classifiers, Priority Regressors & University Matcher
├── package.json                # Root single-command manager (concurrently)
├── start.bat                   # Windows 1-click startup script
└── start.sh                    # Linux/macOS startup script
```

---

## 🛠️ Key Features
- **Citizen Grievance & Challenge Submission**: Auto geo-tagging, image evidence upload, duplicate check, and real-time status tracking.
- **Dynamic University Routing**: Challenges are automatically scored and routed to state universities (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, etc.) based on departmental relevance, research portfolio, and geographic proximity.
- **Resilient AI Pipeline**: Multi-modal AI runs via FastAPI with an instant Node.js ML fallback, ensuring zero downtime even without Python installed.
