from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.DataBaseProvider.repository import Repo
from app.api import router as todo_router
from app.services import router as services_router

# from bson.objectid import ObjectId
# pydantic.json.ENCODERS_BY_TYPE[ObjectId] = str

app = FastAPI()

# List with all origins allowed to send requests
origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:3000/",
    "http://localhost:80",
    "localhost:80",
    "http://localhost:80/",
    "http://localhost"
]

# this middleware is responsible for allow requests from a different protocol, IP address and port
app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
async def startup_db_client():
    app.repo = Repo()


@app.on_event("shutdown")
async def shutdown_db_client():
    app.repo.close()

app.include_router(todo_router, tags=["todos"], prefix="/todos")

app.include_router(services_router, tags=["services"], prefix="/services")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
