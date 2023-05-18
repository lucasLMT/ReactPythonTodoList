from operator import itemgetter
from fastapi.encoders import jsonable_encoder
from .mysql_initializer import MySQLInitializer
from .repository_interface import RepoInterface


class MySQLRepo(RepoInterface):
    def __init__(self, databaseName) -> None:
        mysql = MySQLInitializer(databaseName)
        self.client = mysql.getConnection()

    def close(self):
        self.client.close()

    # props = {
    #     "collection": collection,
    #     "filter": {"user": user},
    #     "label": "Todo",
    #     "projection": {"_id": 0, "id": "$_id", "item": 1, "user": 1}
    # }
    def list(self, props: dict) -> dict:
        collection, filter, projection = itemgetter(
            "collection", "filter", "projection")(props)

        try:
            fields = []
            values = []
            for key, value in filter:
                fields.append("{} = {}".format(key, "%s"))
                values.append(value)

            selectStatement = "SELECT * FROM {} WHERE {}".format(
                collection, " AND ".join(fields))

            self.client.cursor.execute(selectStatement, **values)
            todos = self.client.cursor.fetchall()
            return {'data': list(todos)}
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }

    # props = {
    #     "collection": collection,
    #     "filter": {"item": todo.get("item"), "user": user},
    #     "label": "Todo",
    #     "data": todo,
    #     "model": TodoModel
    # }
    def add(self, props: dict) -> dict:
        collection, filter, data, label, model = itemgetter(
            "collection", "filter", "data", "label", "model")(props)

        try:
            data_json: dict = jsonable_encoder(model(**data))

            fields = []
            types = []
            values = []
            for key, value in data_json:
                fields.append(key)
                types.append("%s")
                values.append(value)

            insertStatement = "INSERT INTO {} ({}) VALUES ({})".format(
                collection, ", ".join(fields), ", ".join(types))

            self.client.cursor.execute(insertStatement, **values)
            self.client.commit()

            return {
                "message": f'{label} added.',
                "id": data_json.get("id")
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
    def update(self, props: dict) -> dict:
        collection, filter, data, label, model = itemgetter(
            "collection", "filter", "data", "label", "model")(props)
        try:
            not_empty_todo = {k: v for k, v in data.items()
                              if v is not None}
            json_todo = jsonable_encoder(model(**not_empty_todo))

            fields = []
            values = []
            for key, value in json_todo:
                fields.append("{} = %s".format(str(key).replace("_", "")))
                values.append(value)

            filterFields = []
            filterValues = []
            for key, value in filter:
                filterFields.append("{} = %s".format(
                    str(key).replace("_", "")))
                filterValues.append(value)

            updateStatement = "UPDATE {} SET {} WHERE {}".format(
                collection, ", ".join(fields), " AND ".join(filterFields))

            self.client.cursor.execute(
                updateStatement, **values, **filterValues)
            self.client.commit()

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
    def delete(self, props: dict) -> dict:
        collection, filter, label = itemgetter(
            "collection", "filter", "label")(props)
        try:
            filterFields = []
            filterValues = []
            for key, value in filter:
                filterFields.append("{} = %s".format(
                    str(key).replace("_", "")))
                filterValues.append(value)

            deleteStatement = "DELETE FROM {} WHERE {}".format(
                collection, " AND ".join(filterFields))
            self.client.cursor.execute(deleteStatement, **filterValues)
            self.client.commit()

            return {
                "message": f"{label} has been deleted."
            }
        except Exception as ex:
            return {
                "consoleError": str(ex)
            }
