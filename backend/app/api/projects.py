from fastapi import APIRouter


router = APIRouter()


@router.get("/projects")
def projects():

    return {

        "success": True,

        "projects": []

    }