#!/usr/bin/env bash
echo "========================================================"
echo " Starting CivicConnect (Frontend + Backend + AI Service)"
echo " Government of Jharkhand Societal Innovation Portal"
echo "========================================================"
echo ""

# Change to script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Check Node.js
if ! command -v node &> /dev/null
then
    echo "[ERROR] Node.js is not installed or not in PATH! Please install Node.js from https://nodejs.org"
    exit 1
fi

# Run setup if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing root dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "[INFO] Installing client dependencies..."
    npm --prefix client install
fi

if [ ! -d "server/node_modules" ]; then
    echo "[INFO] Installing server dependencies..."
    npm --prefix server install
fi

echo ""
echo "[INFO] Starting all services with single command: npm run dev"
echo "  - Backend Server:  http://localhost:5000"
echo "  - React Frontend:  http://localhost:5173"
echo ""

npm run dev
