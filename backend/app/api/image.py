from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from app.services.image_service import generate_image


router = APIRouter()


class ImageRequest(BaseModel):
    prompt: str
    model: str = "flux"


@router.post("/image")
def create_image(
    data: ImageRequest,
    request: Request
):
    prompt = data.prompt.strip()

    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="Prompt is required."
        )

    try:
        result = generate_image(
            prompt=prompt,
            model=data.model
        )

        image_url = (
            str(request.base_url).rstrip("/")
            + result["image_path"]
        )

        return {
            "success": True,
            "message": "Image generated successfully.",
            "image_url": image_url,
            "model": result["model"],
            "prompt": prompt
        }

    except Exception as error:
        print("Image API Error:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )