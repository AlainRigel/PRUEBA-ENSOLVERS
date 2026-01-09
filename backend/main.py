from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from routers.notes import router as notes_router
from routers.categories import router as categories_router

# Create FastAPI application
app = FastAPI(
    title="Notes API",
    description="Full Stack Notes Application with Archive and Categories",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(notes_router)
app.include_router(categories_router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Notes API",
        "version": "1.0.0",
        "environment": settings.environment,
        "docs": "/api/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.environment
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.environment == "development"
    )
