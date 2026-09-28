from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import settings

from app.services.ai_service import (
    generate_response,
    detect_intent,
)

from app.services.image_service import (
    generate_image,
)

from app.services.video_service import (
    generate_video,
)


router = APIRouter()


# =========================================================
# REQUEST MODEL
# =========================================================

class ChatRequest(BaseModel):

    message: str

    history: list = []


# =========================================================
# CHAT
# =========================================================

@router.post("/chat")
def chat(data: ChatRequest):

    message = data.message.strip()

    # =====================================================
    # EMPTY MESSAGE
    # =====================================================

    if not message:

        return {
            "success": False,
            "type": "text",
            "message": "Message is required.",
        }

    try:

        # =================================================
        # LOCAL INTENT DETECTION
        # =================================================
        #
        # IMAGE / VIDEO detection is now handled locally.
        #
        # No OpenRouter/Gemini request is made for detection.
        #

        intent = detect_intent(message)

        print(
            "=========================================="
        )

        print(
            "User Message:",
            message
        )

        print(
            "Detected Intent:",
            intent
        )

        print(
            "=========================================="
        )

        # =================================================
        # IMAGE
        # =================================================

        if intent == "IMAGE":

            result = generate_image(
                prompt=message,
                model=settings.IMAGE_MODEL,
            )

            return {

                "success": True,

                "type": "image",

                "message":
                    "Image generated successfully.",

                "image_url":
                    result["image_path"],

                "model":
                    result["model"],

                "prompt":
                    message,
            }

        # =================================================
        # VIDEO
        # =================================================

        if intent == "VIDEO":

            result = generate_video(
                prompt=message,
                model=settings.VIDEO_MODEL,
            )

            return {

                "success": True,

                "type": "video",

                "message":
                    "Video generated successfully.",

                "video_url":
                    result["video_path"],

                "model":
                    result["model"],

                "prompt":
                    message,
            }

        # =================================================
        # TEXT / CODE
        # =================================================

        response = generate_response(
            message=message,
            history=data.history,
        )

        return {

            "success": True,

            "type": "text",

            "message":
                response,
        }

    except Exception as error:

        print(
            "=========================================="
        )

        print(
            "Chat Error:",
            error
        )

        print(
            "=========================================="
        )

        return {

            "success": False,

            "type": "text",

            "message":
                str(error),
        }