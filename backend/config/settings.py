from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses Pydantic Settings for validation and type safety.
    """
    environment: str = "development"
    port: int = 8000
    
    # Database configuration
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = "postgres"
    db_name: str = "notes_app_dev"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/notes_app_dev"
    
    # CORS configuration
    cors_origins: str = "http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env.dev"
        case_sensitive = False


def get_settings() -> Settings:
    """
    Factory function to get settings based on environment.
    Loads the appropriate .env file based on ENVIRONMENT variable.
    """
    env = os.getenv("ENVIRONMENT", "development")
    env_file = f".env.{env}"
    
    class DynamicSettings(Settings):
        class Config:
            env_file = env_file
            case_sensitive = False
    
    return DynamicSettings()


# Global settings instance
settings = get_settings()
