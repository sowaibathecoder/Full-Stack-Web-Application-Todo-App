"""
Configuration settings for the Full-Stack Multi-User Todo Web Application.
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database settings
    database_url: str = "sqlite:///./todo_app.db"  # Default to SQLite for development

    # JWT/Authentication settings
    better_auth_secret: str = "your-better-auth-secret-here"  # Should be set in environment
    auth_secret: str = "your-better-auth-secret-here"  # For backward compatibility
    access_token_expire_minutes: int = 10080  # 7 days
    jwt_algorithm: str = "HS256"

    # Application settings
    environment: str = "development"
    log_level: str = "INFO"
    allowed_origins: str = "*"  # Comma-separated list of allowed origins, defaults to all

    class Config:
        env_file = ".env"


settings = Settings()