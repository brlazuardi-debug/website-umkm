from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "UMKM Backend API"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite+aiosqlite:///./umkm.db"
    SECRET_KEY: str = "super-secret-key-change-in-production"
    DEBUG_MOCK_AUTH: bool = True
    CLERK_SECRET_KEY: str | None = None
    CLERK_PEM_PUBLIC_KEY: str | None = None
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB

settings = Settings()
