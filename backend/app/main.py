
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import uuid

app = FastAPI(
    title="ChronoVision API",
    description="AI-powered CCTV Video Analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@app.get("/")
def home():
    return {
        "message": "Welcome to ChronoVision API"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "application": "ChronoVision",
        "version": "1.0.0"
    }

@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):

    allowed_extensions = {
        ".mp4", ".mov", ".avi", ".mkv", ".webm"
    }

    extension = Path(file.filename or "").suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported video format"
        )

    video_id = str(uuid.uuid4())
    destination = UPLOAD_DIR / f"{video_id}{extension}"

    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        await file.close()

    return {
        "video_id": video_id,
        "filename": file.filename,
        "status": "uploaded",
        "message": "Video uploaded successfully"
    }
