from pymongo import MongoClient
from ..DataModels.models import TodoModel, UpdateTodoModel
import configparser
from fastapi.encoders import jsonable_encoder
from operator import itemgetter


def getMongoDB():
    client = MongoClient()
    return client


class MongoRepo:
    def __init__(self, database) -> None:
        self.client = MongoClient()
        self.database = self.client[database]

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
        collection, filter, data = itemgetter(
            "collection", "filter", "data")(props)

        try:
            json_todo = jsonable_encoder(TodoModel(**data))
            if self.database[collection].find_one(filter) is not None:
                return {
                    "error": "Todo already exists"
                }

            created_todo = self.database[collection].insert_one(json_todo)
            return {
                "message": "Todo added.",
                "id": created_todo.inserted_id
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    def update(self, props):
        collection, filter, data = itemgetter(
            "collection", "filter", "data")(props)
        try:
            not_empty_todo = {k: v for k, v in data.items()
                              if v is not None}
            json_todo = jsonable_encoder(UpdateTodoModel(**not_empty_todo))
            if self.database[collection].find_one_and_update(filter, {"$set": json_todo}) is not None:
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

    def delete(self, props):
        collection, filter = itemgetter(
            "collection", "filter")(props)
        try:
            result = self.database[collection].delete_one(filter)
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

# props = {
#     "id": str, "12312312",
#     "collection": str, "name_of_collection",
#     "data": dict, "the data to add on database",
#     "filter": dict, "specific conditions to add, update or delete the data"
#     "projection": dict, "specify the fields that should be returned and how"
# }


class Repo:
    def __init__(self) -> None:
        parser = configparser.ConfigParser()
        parser.read("config.ini")

        if parser.get("database", "name") == "mongodb":
            self.repo = MongoRepo("reactpythonapp")

    def close(self):
        self.repo.close()

    def list(self, props):
        return self.repo.list(props)

    def add(self, props):
        return self.repo.add(props)

    def update(self, props):
        return self.repo.update(props)

    def delete(self, props):
        return self.repo.delete(props)
