from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .DataModels.models import TodoModel, UpdateTodoModel
from .Auth.auth import get_current_user

router = APIRouter()

collection = "todolist"


@router.get("/")
async def get_todos(request: Request, user: str) -> dict:
    try:
        token = get_current_user(request.headers["x-auth-token"])  	
    except HTTPException as ex:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Could not validate credentials"})

    props = {
        "collection": collection,
        "filter": {"user": user or token.get("sub")},
        "label": "Todo",
        "projection": {"_id": 0, "id": "$_id", "item": 1, "user": 1}
    }
    result = request.app.repo.list(props)
    if result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)
    else:
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)


@router.post("/")
async def add_todo(request: Request, user: str, todo=Body(...)):
    try:
        token = get_current_user(request.headers["x-auth-token"])  	
    except HTTPException as ex:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Could not validate credentials"})

    props = {
        "collection": collection,
        "filter": {"item": todo.get("item"), "user": user},
        "label": "Todo",
        "data": todo,
        "model": TodoModel
    }
    result = request.app.repo.add(props)
    if result.get("message") is not None:
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=result)
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)


@router.put("/{id}")
async def update_todo(id: str, request: Request, user: str, todo=Body(...)):
    try:
        token = get_current_user(request.headers["x-auth-token"])  	
    except HTTPException as ex:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Could not validate credentials"})
    
    props = {
        "collection": collection,
        "filter": {"_id": id, "user": user},
        "label": "Todo",
        "id": id,
        "data": todo,
        "model": UpdateTodoModel
    }
    result = request.app.repo.update(props)
    if result.get("message") is not None:
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)


@router.delete("/{id}")
async def delete_todo(id: str, request: Request):
    try:
        token = get_current_user(request.headers["x-auth-token"])  	
    except HTTPException as ex:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"error": "Could not validate credentials"})
    
    props = {
        "collection": collection,
        "filter": {"_id": id},
        "label": "Todo",
    }
    result = request.app.repo.delete(props)
    if result.get("message") is not None:
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)
