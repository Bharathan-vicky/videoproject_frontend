# Project Structure Analysis: Video Analysis System

## Overview
This repository contains the complete source code for the **CitNow Video Analysis System**. It is structured as a monorepo containing both the Frontend and Backend applications.

## Directory Structure
```text
/ (Root)
├── frontend/           # React Frontend Application
│   ├── src/
│   ├── public/
│   └── package.json
│   
└── backend/            # FastAPI Component (Python)
    ├── main.py         # API Entry Point & Application Logic
    ├── Dude.py         # Core Media Analysis Logic
    ├── requirements.txt # Python Dependencies
    └── ...
```

---

## 1. Frontend Application (`/frontend`)
**Technology**: React 19, Material UI v7, React Router v7.

### Purpose
Provides the user interface for:
- **Super Admins**: To manage dealers and users.
- **Dealer Admins**: To manage their dealership's users and view team performance.
- **Dealer Users**: To submit videos for analysis and view their own results.

### Key Features
- **Dashboards**: Role-specific views.
- **Analysis Submission**: Forms for single and bulk video uploads.
- **Results Visualization**: Charts and detailed breakdowns of video/audio quality.
- **PDF Export**: Ability to download analysis reports.

---

## 2. Backend Application (`/backend`)
**Technology**: Python 3.10+, FastAPI, MongoDB (Motor), PyTorch, FFmpeg.

### Purpose
Serves as the API for the frontend and performs the heavy lifting of media processing.

### Key Components
- **`main.py`**: 
    - **API Server**: Configures FastAPI, CORS, and Routes.
    - **Authentication**: JWT-based RBAC (Super Admin, Dealer Admin, Dealer User).
    - **Database**: MongoDB connection management.
    - **Endpoints**: `/token`, `/admin/login`, `/dealer/login`, `/results`, `/users`, etc.

- **`Dude.py` (UnifiedMediaAnalyzer)**:
    - **Media Extraction**: Downloads videos from CitNow URLs.
    - **Audio Analysis**: Uses `librosa` to score volume, noise, clarity, etc.
    - **Video Analysis**: Uses `OpenCV` to score resolution, stability, lighting, etc.
    - **AI Processing**: 
        - **Transcription**: Faster-Whisper.
        - **Translation**: NLLB / MarianMT.
        - **Summarization**: BART.

### Dependencies
Key libraries include: `fastapi`, `uvicorn`, `motor` (MongoDB), `torch`, `transformers`, `opencv-python`, `librosa`, `faster-whisper`.

### Setup Requirements
- **System**: FFmpeg must be installed and accessible in the system PATH.
- **Database**: MongoDB instance (default: `mongodb://localhost:27017/`).
- **Models**: The system downloads several AI models (HuggingFace) on first run.

---

## Running the Project

### Frontend
```bash
cd frontend
npm start
```

### Backend
```bash
cd backend
# Install dependencies
pip install -r requirements.txt
# Run the server
uvicorn main:app --reload
```
