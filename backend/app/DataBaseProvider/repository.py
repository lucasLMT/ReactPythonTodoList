from pymongo import MongoClient
from ..DataModels.models import TodoModel, UpdateTodoModel
import configparser
from fastapi.encoders import jsonable_encoder


def getMongoDB():
    client = MongoClient()
    return client


class MongoRepo:
    def __init__(self, database, collection) -> None:
        self.client = MongoClient()
        self.database = self.client[database]
        self.collection = self.database[collection]

    def close(self):
        self.client.close()

    def list(self):
        try:
            todo = self.collection.find(
                projection={"_id": 0, "id": "$_id", "item": 1})
            return {'data': list(todo)}
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    def add(self, todo):
        try:
            json_todo = jsonable_encoder(TodoModel(**todo))
            if self.collection.find_one({"item": todo.get("item")}) is not None:
                return {
                    "error": "Todo already exists"
                }

            created_todo = self.collection.insert_one(json_todo)
            return {
                "message": "Todo added.",
                "id": created_todo.inserted_id
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    def update(self, id, todo):
        try:
            not_empty_todo = {k: v for k, v in todo.items()
                              if v is not None}
            json_todo = jsonable_encoder(UpdateTodoModel(**not_empty_todo))
            if self.collection.find_one_and_update({"_id": id}, {"$set": json_todo}) is not None:
                return {
                    "message": "Todo has been updated."
                }

            return {
                "error": "Todo not found."
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    def delete(self, id):
        try:
            result = self.collection.delete_one({"_id": id})
            if result.deleted_count:
                return {
                    "message": "Todo has been deleted."
                }
            return {
                "error": "Todo not found."
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }


class Repo:
    def __init__(self) -> None:
        parser = configparser.ConfigParser()
        parser.read("config.ini")

        if parser.get("database", "name") == "mongodb":
            self.repo = MongoRepo("reactpythonapp", "todolist")

    def close(self):
        self.repo.close()

    def list(self):
        return self.repo.list()

    def add(self, todo):
        return self.repo.add(todo)

    def update(self, id, todo):
        return self.repo.update(id, todo)

    def delete(self, id):
        return self.repo.delete(id)
