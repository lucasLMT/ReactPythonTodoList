from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

router = APIRouter()


@router.get("/")
async def get_todos(request: Request) -> dict:
    result = request.app.repo.list()
    if result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)
    else:
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)


@router.post("/")
async def add_todo(request: Request, todo=Body(...)):
    result = request.app.repo.add(todo)
    if result.get("message") is not None:
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=result)
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)


@router.put("/{id}")
async def update_todo(id: str, request: Request, todo=Body(...)):
    result = request.app.repo.update(id, todo)
    if result.get("message") is not None:
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)


@router.delete("/{id}")
async def delete_todo(id: str, request: Request):
    result = request.app.repo.delete(id)
    if result.get("message") is not None:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=result)
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)
