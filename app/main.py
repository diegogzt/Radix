from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="RADIX Medical Dashboard API",
    description="Backend API for RADIX application",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4321",  # Astro Dev Server
        "http://localhost:4322",  # Astro Dev Server alt
        "http://localhost:5409",  # Preview server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "RADIX API is running"}
