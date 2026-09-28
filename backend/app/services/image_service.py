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


DEFAULT_MODEL = os.getenv(
    "IMAGE_MODEL",
    "flux"
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
# GENERATE IMAGE
# =========================================================

def generate_image(

    prompt: str,

    model: str | None = None

):

    if not prompt or not prompt.strip():

        raise ValueError(
            "Image prompt is required."
        )


    if not POLLINATIONS_API_KEY:

        raise ValueError(
            "POLLINATIONS_API_KEY is not configured "
            "in backend/.env"
        )


    selected_model = (

        model
        or DEFAULT_MODEL

    ).strip()


    # =====================================================
    # URL ENCODING
    # =====================================================

    encoded_prompt = quote(
        prompt.strip(),
        safe=""
    )


    # =====================================================
    # API URL
    # =====================================================

    api_url = (

        "https://gen.pollinations.ai/image/"

        f"{encoded_prompt}"

        f"?model={quote(selected_model, safe='')}"

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

            timeout=180

        ) as response:

            image_data = response.read()


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
            "Pollinations Image Error:",
            error
        )


        raise RuntimeError(
            f"Image generation failed: {error}"
        ) from error


    # =====================================================
    # VALIDATION
    # =====================================================

    if not image_data:

        raise RuntimeError(
            "Image API returned empty data."
        )


    if not content_type.startswith(
        "image/"
    ):

        raise RuntimeError(
            "Image API did not return an image."
        )


    # =====================================================
    # EXTENSION
    # =====================================================

    if "png" in content_type:

        extension = "png"

    elif "webp" in content_type:

        extension = "webp"

    elif "svg" in content_type:

        extension = "svg"

    else:

        extension = "jpg"


    # =====================================================
    # FILE NAME
    # =====================================================

    filename = (

        f"{uuid.uuid4().hex}"

        f".{extension}"

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

    ) as image_file:

        image_file.write(
            image_data
        )


    # =====================================================
    # RESULT
    # =====================================================

    return {

        "filename":
            filename,

        "image_path":
            f"/uploads/generated/{filename}",

        "model":
            selected_model,

    }