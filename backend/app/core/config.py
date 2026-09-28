import os

from dotenv import load_dotenv


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# SETTINGS
# =========================================================

class Settings:

    # =====================================================
    # APP
    # =====================================================

    APP_NAME = os.getenv(
        "APP_NAME",
        "Future AI"
    )

    ENVIRONMENT = os.getenv(
        "ENVIRONMENT",
        "development"
    )

    PORT = int(
        os.getenv(
            "PORT",
            "5000"
        )
    )

    # =====================================================
    # MONGODB
    # =====================================================

    MONGO_URL = os.getenv(
        "MONGO_URL",
        "mongodb://127.0.0.1:27017"
    )

    DATABASE_NAME = os.getenv(
        "DATABASE_NAME",
        "future_ai"
    )

    # =====================================================
    # GOOGLE GEMINI
    # =====================================================

    GEMINI_API_KEY = os.getenv(
        "GEMINI_API_KEY",
        ""
    )

    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-2.5-flash"
    )

    # =====================================================
    # JWT
    # =====================================================

    JWT_SECRET = os.getenv(
        "JWT_SECRET",
        ""
    )

    # =====================================================
    # IMAGE
    # =====================================================

    POLLINATIONS_API_KEY = os.getenv(
        "POLLINATIONS_API_KEY",
        ""
    )

    IMAGE_MODEL = os.getenv(
        "IMAGE_MODEL",
        "flux"
    )

    # =====================================================
    # VIDEO
    # =====================================================

    VIDEO_MODEL = os.getenv(
        "VIDEO_MODEL",
        "veo"
    )


# =========================================================
# SETTINGS INSTANCE
# =========================================================

settings = Settings()