import os
import uuid

from pathlib import Path

from urllib.parse import quote

from urllib.request import (
    Request,
    urlopen,
)

from dotenv import load_dotenv


load_dotenv()


# =========================================================
# CONFIG
# =========================================================

POLLINATIONS_API_KEY = os.getenv(
    "POLLINATIONS_API_KEY",
    ""
)


DEFAULT_VIDEO_MODEL = os.getenv(
    "VIDEO_MODEL",
    "veo"
)


# =========================================================
# DIRECTORY
# =========================================================

BACKEND_DIR = (
    Path(__file__)
    .resolve()
    .parents[2]
)


GENERATED_DIR = (
    BACKEND_DIR
    / "uploads"
    / "generated"
)


GENERATED_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =========================================================
# GENERATE VIDEO
# =========================================================

def generate_video(

    prompt: str,

    model: str | None = None,

    duration: int = 4

):

    if not prompt or not prompt.strip():

        raise ValueError(
            "Video prompt is required."
        )


    if not POLLINATIONS_API_KEY:

        raise ValueError(
            "POLLINATIONS_API_KEY is not configured "
            "in backend/.env"
        )


    selected_model = (

        model
        or DEFAULT_VIDEO_MODEL

    ).strip()


    # =====================================================
    # ENCODE PROMPT
    # =====================================================

    encoded_prompt = quote(

        prompt.strip(),

        safe=""

    )


    # =====================================================
    # API URL
    # =====================================================

    api_url = (

        "https://gen.pollinations.ai/video/"

        f"{encoded_prompt}"

        f"?model={quote(selected_model, safe='')}"

        f"&duration={duration}"

    )


    # =====================================================
    # REQUEST
    # =====================================================

    request = Request(

        api_url,

        headers={

            "Authorization":
                f"Bearer {POLLINATIONS_API_KEY}",

            "User-Agent":
                "Future-AI",

        },

        method="GET",
    )


    # =====================================================
    # API CALL
    # =====================================================

    try:

        with urlopen(

            request,

            timeout=600

        ) as response:

            video_data =response.read()


            content_type = (

                response.headers

                .get(
                    "Content-Type",
                    ""
                )

                .lower()

            )


    except Exception as error:

        print(
            "Pollinations Video Error:",
            error
        )


        raise RuntimeError(
            f"Video generation failed: {error}"
        ) from error


    # =====================================================
    # VALIDATE
    # =====================================================

    if not video_data:

        raise RuntimeError(
            "Video API returned empty data."
        )


    if "video" not in content_type:

        raise RuntimeError(
            "Video API did not return a video file."
        )


    # =====================================================
    # FILE
    # =====================================================

    filename = (
        f"{uuid.uuid4().hex}.mp4"
    )


    file_path = (
        GENERATED_DIR
        / filename
    )


    # =====================================================
    # SAVE
    # =====================================================

    with open(

        file_path,

        "wb"

    ) as video_file:

        video_file.write(
            video_data
        )


    # =====================================================
    # RETURN
    # =====================================================

    return {

        "filename":
            filename,

        "video_path":
            f"/uploads/generated/{filename}",

        "model":
            selected_model,

        "duration":
            duration,

    }