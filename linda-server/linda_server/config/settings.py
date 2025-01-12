import os
from typing import List, Optional
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

class Settings:
    """Application settings loaded from environment variables."""
    
    def __init__(self):
        # JWT Settings
        self.SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
        if not self.SECRET_KEY:
            raise ValueError("JWT_SECRET_KEY must be set")
            
        self.JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
        self.JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
        
        # CORS Settings
        cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
        self.CORS_ORIGINS: List[str] = cors_origins.split(",") if cors_origins else []
        
        # Library Settings
        self.LIBRARY_PATH: str = os.getenv("LIBRARY_PATH", "libraries/my_library/libmylibrary.so")

    @classmethod
    def load(cls) -> 'Settings':
        """Factory method to create settings instance."""
        return cls()

# Create settings instance
settings = Settings.load()

def get_settings() -> Settings:
    """Dependency injection for settings."""
    return settings
