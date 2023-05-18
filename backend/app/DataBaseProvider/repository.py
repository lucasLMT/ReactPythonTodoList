import configparser
from .DBInterface.dynamodb_repository import DynamoRepo
from .DBInterface.mongodb_repository import MongoRepo


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
        dbName = parser.get("database", "name")
        if dbName == "mongodb":
            self.repo = MongoRepo(
                "reactpythonapp")
        # elif dbName == "mysql":
        #     self.repo = MySQLRepo(
        #         "reactpythonapp")
        elif dbName == "dynamodb":
            self.repo = DynamoRepo(
                "reactpythonapp")

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
