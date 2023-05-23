from fastapi import APIRouter, Body, Request, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from .DataModels.models import UserModel, Token
from .Auth.auth import authenticate_user, create_access_token, get_password_hash

router = APIRouter()

collectionUsers = "users"


@router.post("/user/token")
async def get_user(request: Request, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    props = {
        "collection": collectionUsers,
        "filter": {"email": form_data.username},
        "label": "User",
        "projection": {"_id": 0, "id": "$_id", "email": 1, "password": 1}
    }

    result = request.app.repo.list(props)

    if (len(result["data"]) == 0):
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"error": "User not found."})
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content=result)    
    elif authenticate_user(form_data.username, form_data.password, result["data"][0].get("password")) :                  
        access_token = create_access_token({"sub": result["data"][0].get("id"), "email": result["data"][0].get("email")})    
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": result.get("message"), "access_token": access_token, "token_type": "bearer"},
                             headers={"x-auth-token": access_token, "access-control-expose-headers": "x-auth-token"})   


@router.post("/user/register")
async def register_user(request: Request, user=Body(...)):
    user["googleId"] = user.get("googleId") or ""
    user["password"] = get_password_hash(user["password"])
    props = {
        "collection": collectionUsers,
        "filter": {"email": user.get("email")},
        "label": "Email " + user.get("email"),
        "data": user,
        "model": UserModel
    }
    result = request.app.repo.add(props)
    if result.get("message") is not None:
        access_token = create_access_token({"sub": result.get("id"), "email": user.get("email")})
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": result.get("message"), "access_token": access_token, "token_type": "bearer"},
                             headers={"x-auth-token": access_token, "access-control-expose-headers": "x-auth-token"}) 
    elif result.get("error") is not None:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=result)
    elif result.get("consoleError") is not None:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)
    

@router.post("/user/social")
async def social_login(request: Request, user=Body(...)):
    user["password"] = get_password_hash(user["email"])
    props = {
        "collection": collectionUsers,
        "filter": {"email": user.get("email")},
        "label": "Email " + user.get("email"),
        "data": user,
        "model": UserModel
    }

    users = request.app.repo.list(props)
    if (len(users["data"]) == 0):
        result = request.app.repo.add(props)
        if result.get("message") is not None:
            access_token = create_access_token({"sub": result.get("id"), "email": user.get("email"), "picture_url": user.get("picture_url"), "social_login": True})
            return JSONResponse(status_code=status.HTTP_200_OK, content={"message": result.get("message"), "access_token": access_token, "token_type": "bearer"},
                                headers={"x-auth-token": access_token, "access-control-expose-headers": "x-auth-token"}) 
        elif result.get("error") is not None:
            return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=result)
        elif result.get("consoleError") is not None:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=result)
    else:
        access_token = create_access_token({"sub": users["data"][0].get("id"), "email": user.get("email"), "picture_url": user.get("picture_url"), "social_login": True})
        return JSONResponse(status_code=status.HTTP_200_OK, content={"access_token": access_token, "token_type": "bearer"},
                            headers={"x-auth-token": access_token, "access-control-expose-headers": "x-auth-token"})         
