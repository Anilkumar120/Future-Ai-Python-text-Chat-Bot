from pathlib import Path

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles


from app.api.health import (
    router as health_router
)

from app.api.chat import (
    router as chat_router
)

from app.api.projects import (
    router as projects_router
)

from app.api.image import (
    router as image_router
)

from app.api.video import (
    router as video_router
)


# =========================================================
# PATHS
# =========================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)


UPLOADS_DIR = (
    BASE_DIR
    / "uploads"
)


GENERATED_DIR = (
    UPLOADS_DIR
    / "generated"
)


GENERATED_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(

    title="Future AI API",

    version="1.0.0"

)


# =========================================================
# CORS
# =========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[

        "http://localhost:5173",

        "http://127.0.0.1:5173",

    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)


# =========================================================
# HEALTH
# =========================================================

app.include_router(

    health_router,

    prefix="/api"

)


# =========================================================
# CHAT
# =========================================================

app.include_router(

    chat_router,

    prefix="/api"

)


# =========================================================
# PROJECTS
# =========================================================

app.include_router(

    projects_router,

    prefix="/api"

)


# =========================================================
# IMAGE
# =========================================================

app.include_router(

    image_router,

    prefix="/api"

)


# =========================================================
# VIDEO
# =========================================================

app.include_router(

    video_router,

    prefix="/api"

)


# =========================================================
# STATIC UPLOADS
# =========================================================

app.mount(

    "/uploads",

    StaticFiles(

        directory=str(
            UPLOADS_DIR
        )

    ),

    name="uploads"

)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {

        "success": True,

        "name":
            "Future AI",

        "status":
            "running"

    }