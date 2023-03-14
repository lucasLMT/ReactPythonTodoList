from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from MongoDB.mongoProvider import getMongoDB
import pydantic
from bson.objectid import ObjectId
pydantic.json.ENCODERS_BY_TYPE[ObjectId] = str

app = FastAPI()

# List with all origins allowed to send requests
origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:3000/"
]

# origins = ["*"]

# this middleware is responsible for allow requests from a different protocol, IP address and port
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}


todos = [
    {
        "id": "1",
        "item": "Read a book."
    },
    {
        "id": "2",
        "item": "Cycle around town."
    }
]


# @app.get("/todos", tags=["todos"])
# async def get_todos() -> dict:
#     return {"data": todos}

@app.get("/todos")
async def get_todos() -> dict:
    db = getMongoDB()
    # The use of the parameter projection excluding the field _id resolves our problem with the ObjectId
    todo = db.reactpythonapp.todolist.find(projection={"_id": False})
    listTodo = list(todo)
    data = dict({'data': listTodo})
    # value = json_util.dumps(data)
    return data


@app.post("/todos", tags=["todos"])
async def add_todo(new_todo: dict) -> dict:
    db = getMongoDB()

    if db.reactpythonapp.todolist.count_documents({"item": new_todo.get("item")}) > 0:
        return {
            "data": {"Todo already exists"}
        }
    else:
        new_id = db.reactpythonapp.todolist.count_documents({}) + 1
        db.reactpythonapp.todolist.insert_one(
            {"id": new_id, "item": new_todo.get("item")})
        return {
            "data": {"Todo added."}
        }


@app.put("/todos/{id}", tags=["todos"])
async def update_todo(id: int, body: dict) -> dict:
    db = getMongoDB()
    if db.reactpythonapp.todolist.find_one_and_update({"id": id}, {"$set": {"item": body.get("item")}}) is not None:
        return {
            "data": f"Todo with id {id} has been updated."
        }
    else:
        return {
            "data": f"Todo with id {id} not found."
        }


@app.delete("/todos/{id}", tags=["todos"])
async def delete_todo(id: int) -> dict:
    db = getMongoDB()
    result = db.reactpythonapp.todolist.delete_one({"id": id})
    if result.deleted_count:
        return {
            "data": f"Todo with id {id} has been deleted."
        }
    else:
        return {
            "data": f"Todo with id {id} not found."
        }


if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
