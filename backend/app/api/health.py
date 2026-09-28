from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    return {
        "success": True,
        "status": "API is running"
    }