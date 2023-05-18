from pymongo import MongoClient
from os import getenv
from operator import itemgetter
from fastapi.encoders import jsonable_encoder
from .repository_interface import RepoInterface


class MongoRepo(RepoInterface):
    def __init__(self, databaseName) -> None:
        self.client = MongoClient(getenv("DB_URL") or "mongodb://127.0.0.1")
        self.database = self.client[databaseName]

    def close(self):
        self.client.close()

    def list(self, props: dict):
        collection, filter, projection = itemgetter(
            "collection", "filter", "projection")(props)

        try:
            todo = self.database[collection].find(filter,
                                                  projection=projection)
            return {'data': list(todo)}
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    def add(self, props):
        collection, filter, data, label, model = itemgetter(
            "collection", "filter", "data", "label", "model")(props)

        try:
            json_todo = jsonable_encoder(model(**data))
            if self.database[collection].find_one(filter) is not None:
                return {
                    "error": f"{label} already exists."
                }

            created_todo = self.database[collection].insert_one(json_todo)
            return {
                "message": f'{label} added.',
                "id": created_todo.inserted_id
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    def update(self, props):
        collection, filter, data, label, model = itemgetter(
            "collection", "filter", "data", "label", "model")(props)
        try:
            not_empty_todo = {k: v for k, v in data.items()
                              if v is not None}
            json_todo = jsonable_encoder(model(**not_empty_todo))
            if self.database[collection].find_one_and_update(filter, {"$set": json_todo}) is not None:
                return {
                    "message": f"{label} has been updated."
                }

            return {
                "error": f"{label} not found."
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    def delete(self, props):
        collection, filter, label = itemgetter(
            "collection", "filter", "label")(props)
        try:
            result = self.database[collection].delete_one(filter)
            if result.deleted_count:
                return {
                    "message": f"{label} has been deleted."
                }
            return {
                "error": f"{label} not found."
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }
