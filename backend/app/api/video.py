from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.services.video_service import generate_video


router = APIRouter()


# =========================================================
# REQUEST MODEL
# =========================================================

class VideoRequest(BaseModel):

    prompt: str

    model: str = "veo"

    duration: int = 4


# =========================================================
# CREATE VIDEO
# =========================================================

@router.post("/video")
def create_video(
    data: VideoRequest,
    request: Request
):

    prompt = data.prompt.strip()


    # =====================================================
    # VALIDATE PROMPT
    # =====================================================

    if not prompt:

        raise HTTPException(
            status_code=400,
            detail="Prompt is required."
        )


    # =====================================================
    # VALIDATE DURATION
    # =====================================================

    if data.duration < 1:

        raise HTTPException(
            status_code=400,
            detail="Duration must be greater than 0."
        )


    try:

        result = generate_video(

            prompt=prompt,

            model=data.model,

            duration=data.duration

        )


        video_url = (

            str(request.base_url).rstrip("/")

            + result["video_path"]

        )


        return {

            "success": True,

            "message":
                "Video generated successfully.",

            "video_url":
                video_url,

            "model":
                result["model"],

            "duration":
                result["duration"],

            "prompt":
                prompt

        }


    except Exception as error:

        print(
            "Video API Error:",
            error
        )


        raise HTTPException(

            status_code=500,

            detail=str(error)

        )

