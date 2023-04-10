from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

router = APIRouter()


@router.post("/user")
async def add_todo(request: Request, user=Body(...)):
    result = request.app.repo.add(user)
    if result.get("message") is not None:
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=result)
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)
