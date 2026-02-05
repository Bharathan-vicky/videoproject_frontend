# CitNow Video Analysis Platform

A hybrid cloud-based video analysis tool for vehicle service centers.

## 🚀 Architecture
This project uses a **Cloud-First** architecture to ensure high performance even on low-end local hardware.

*   **Frontend**: React.js (Runs locally on your machine).
*   **Backend**: FastAPI (Runs on **Hugging Face Spaces** Cloud with 16GB RAM).
*   **AI Engine**: FFmpeg + OpenAI Whisper + Transformers (Offloaded to Cloud).
*   **Database**: MongoDB Atlas (Cloud Database).

## 🛠️ Quick Start

### 1. Start the Frontend
The backend is always running in the cloud, so you only need to start the frontend.

```bash
cd frontend
npm start
```
Access the app at: `http://localhost:3000`

### 2. Login
Use your credentials (e.g., `vicky@mail.com`). The app will automatically connect to the Cloud Backend.

## ☁️ Cloud Resources
*   **Backend API**: [https://bharathan56-citnow-backend.hf.space](https://bharathan56-citnow-backend.hf.space)
*   **Hugging Face Space**: [CitNow Backend Space](https://huggingface.co/spaces/bharathan56/citnow-backend)

## 📦 Project Structure
*   `frontend/` - React application source code.
*   `backend/` - Python FastAPI application (only needed for cloud deployment updates).

## ❓ Troubleshooting
*   **"API Error"**: Check if the Hugging Face Space is "Running" (Green badge). If it's "Sleeping", visiting the URL will wake it up (takes ~30s).
*   **Login Failed**: Ensure your internet connection is active (required to reach Cloud DB).
