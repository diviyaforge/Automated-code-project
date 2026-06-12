import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import models
from database import engine
from routers import auth, analysis, sessions

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Automated Code Review Platform API",
    description="Backend service providing JWT Authentication, database logging, and Gemini LLM code analysis integration.",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(analysis.router)
app.include_router(sessions.router)

# Resolve path to frontend/dist folder
frontend_dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))

# Mount the assets folder if the build folder exists
if os.path.exists(os.path.join(frontend_dist_path, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="assets")

@app.get("/{catchall:path}")
async def serve_frontend(catchall: str):
    # Check if the requested path matches an actual file in the dist directory (like favicon.ico, vite.svg)
    file_path = os.path.join(frontend_dist_path, catchall)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
        
    # Do not serve index.html for missing API routes
    if catchall.startswith("api"):
        raise HTTPException(status_code=404, detail="Not Found")
        
    # Otherwise, return index.html for SPA routing
    index_file = os.path.join(frontend_dist_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
        
    # Fallback if no build is found
    return {
        "status": "online",
        "message": "Automated Code Review API is running successfully. (Frontend build not found, run 'npm run build' in the root directory to serve it here)."
    }

