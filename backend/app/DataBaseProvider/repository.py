from redbird.repos import MongoRepo
from pymongo import MongoClient
import configparser
from pydantic import BaseModel


def getMongoDB():
    client = MongoClient()
    return client


class Todo(BaseModel):
    id: int
    item: str


def getTodoRepo():
    parser = configparser.ConfigParser()
    # parser.read("../../../config.ini")
    parser.read("config.ini")

    if parser.get("database", "name") == "mongodb":
        client = MongoClient()
        # , model=Todo)
        return MongoRepo(client=client, database="reactpythonapp", collection="todolist")
    else:
        pass
