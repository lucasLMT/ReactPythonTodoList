import configparser
from abc import ABC, abstractmethod
from pymongo import MongoClient
from os import getenv
from operator import itemgetter
from fastapi.encoders import jsonable_encoder
import boto3
from boto3.dynamodb.conditions import Attr


class RepoInterface(ABC):
    @abstractmethod
    def __init__(self, databaseName: str) -> None:
        pass

    @abstractmethod
    def close(self) -> None:
        pass

    @abstractmethod
    def list(self, props: dict) -> dict:
        pass

    @abstractmethod
    def add(self, props: dict) -> dict:
        pass

    @abstractmethod
    def update(self, props: dict) -> dict:
        pass

    @abstractmethod
    def delete(self, props: dict) -> dict:
        pass


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


###############################################################################

class DynamodbInitializer:
    def __init__(self, databaseName: str) -> None:
        self.dynamodb = boto3.resource(
            'dynamodb', aws_access_key_id=getenv("DYNAMO_KEY_ID"),
            aws_secret_access_key=getenv("DYNAMO_ACCESS_KEY"),
            region_name=getenv("DYNAMO_REGION"))
        # self.create_database()

    def create_database(self):
        self.dynamodb.create_table(
            TableName='todolist',
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'  # Partition key
                },
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'
                },
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

        self.dynamodb.create_table(
            TableName='users',
            KeySchema=[
                {
                    'AttributeName': 'id',
                    'KeyType': 'HASH'  # Partition key
                },
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'id',
                    'AttributeType': 'S'
                },
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )

    def getClient(self):
        return self.dynamodb


class DynamoRepo(RepoInterface):
    def __init__(self, databaseName) -> None:
        self.initializer = DynamodbInitializer(databaseName)
        self.client = self.initializer.getClient()

    def close(self):
        self.client.close()

    # props = {
    #     "collection": collection,
    #     "filter": {"user": user},
    #     "label": "Todo",
    #     "projection": {"_id": 0, "id": "$_id", "item": 1, "user": 1}
    # }
    def list(self, props: dict):
        collection, filter, projection = itemgetter(
            "collection", "filter", "projection")(props)

        scan_kwargs = {
            'FilterExpression': Attr(list(filter.keys())[0]).eq(list(filter.values())[0]),
        }

        try:
            table = self.client.Table(collection)

            todos = []
            done = False
            start_key = None
            while not done:
                if start_key:
                    scan_kwargs['ExclusiveStartKey'] = start_key
                response = table.scan(**scan_kwargs)
                todos.extend(response.get('Items', []))
                start_key = response.get('LastEvaluatedKey', None)
                done = start_key is None

            return {'data': todos}
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    def add(self, props):
        collection, filter, data, label, model = itemgetter(
            "collection", "filter", "data", "label", "model")(props)

        try:
            json_todo = jsonable_encoder(model(**data))
            json_todo["id"] = json_todo["_id"]
            table = self.client.Table(collection)
            response = table.put_item(
                Item=json_todo
            )
            # if self.database[collection].find_one(filter) is not None:
            #     return {
            #         "error": f"{label} already exists."
            #     }

            # created_todo = self.database[collection].insert_one(json_todo)
            return {
                "message": f'{label} added.',
                "id": json_todo.get("id")
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    # props = {
    #     "collection": collection,
    #     "filter": {"_id": id, "user": user},
    #     "label": "Todo",
    #     "id": id,
    #     "data": todo,
    #     "model": UpdateTodoModel
    # }
    def update(self, props):
        collection, filter, data, label, model = itemgetter(
            "collection", "filter", "data", "label", "model")(props)
        try:
            not_empty_todo = {k: v for k, v in data.items()
                              if v is not None}
            json_todo = jsonable_encoder(model(**not_empty_todo))

            updateExpression = []
            expressionAttributeValues = {}
            expressionAttributeNames = {}
            for key, value in json_todo.items():
                updateExpression.append(f"#{key[0:2]} = :{key[0:2]}")
                expressionAttributeNames[f"#{key[0:2]}"] = key
                expressionAttributeValues[f":{key[0:2]}"] = value

            filter["id"] = filter["_id"]
            del filter["_id"]
            del filter["user"]
            table = self.client.Table(collection)
            response = table.update_item(
                Key=filter,
                UpdateExpression="set " + ", ".join(updateExpression),
                ExpressionAttributeNames=expressionAttributeNames,
                ExpressionAttributeValues=expressionAttributeValues
            )

            return {
                "message": f"{label} has been updated."
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    # props = {
    #     "collection": collection,
    #     "filter": {"_id": id},
    #     "label": "Todo",
    # }
    def delete(self, props):
        collection, filter, label = itemgetter(
            "collection", "filter", "label")(props)
        try:
            filter["id"] = filter["_id"]
            del filter["_id"]
            table = self.client.Table(collection)
            response = table.delete_item(
                Key=filter
            )

            return {
                "message": f"{label} has been deleted."
            }

        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

###############################################################################

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
