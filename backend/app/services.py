from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .DataModels.models import UserModel

router = APIRouter()

collectionUsers = "users"


@router.post("/user")
async def get_user(request: Request, user=Body(...)) -> dict:
    props = {
        "collection": collectionUsers,
        "filter": {"email": user.get("email"), "password": user.get("password")},
        "label": "User",
        "projection": {"_id": 0, "id": "$_id", "email": 1}
    }
    result = request.app.repo.list(props)

    if result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"id": result.data.id, "email": result.data.email})
    else:
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)


@router.post("/user/register")
async def register_user(request: Request, user=Body(...)):
    user["googleId"] = user.get("googleId") or ""
    props = {
        "collection": collectionUsers,
        "filter": {"email": user.get("email")},
        "label": "Email " + user.get("email"),
        "data": user,
        "model": UserModel
    }
    result = request.app.repo.add(props)
    if result.get("message") is not None:
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)
