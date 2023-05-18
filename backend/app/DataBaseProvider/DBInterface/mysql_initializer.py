import mysql.connector
from mysql.connector import errorcode
from os import getenv


class MySQLInitializer:
    def __init__(self, databaseName: str) -> None:
        self.cnx = mysql.connector.connect(user="root",
                                           host=getenv(
                                               "DB_URL") or "localhost",
                                           password="")
        self.cursor = self.cnx.cursor()
        self.databaseName = databaseName

        self.init_tables()

    def close(self):
        self.cursor.close()
        self.cnx.close()

    def create_database(self):
        try:
            self.cursor.execute(
                "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(self.databaseName))
        except mysql.connector.Error as err:
            print("Failed creating database: {}".format(err))
            exit(1)

    def init_tables(self) -> None:
        TABLES = {}
        TABLES["todolist"] = (
            "CREATE TABLE `todolist` ("
            "   `id` varchar(37) NOT NULL,"
            "   `item` varchar(255) NOT NULL,"
            "   `user` varchar(255) NOT NULL,"
            "   PRIMARY KEY (`id`)"
            ") ENGINE=InnoDB")

        TABLES["users"] = (
            "CREATE TABLE `users` ("
            "   `id` varchar(37) NOT NULL,"
            "   `email` varchar(255) NOT NULL,"
            "   `password` varchar(255) NOT NULL,"
            "   `googleId` varchar(255) NOT NULL,"
            "   PRIMARY KEY (`id`)"
            ") ENGINE=InnoDB")

        try:
            self.cursor.execute("USE {}".format(self.databaseName))
        except mysql.connector.Error as err:
            print("Database {} does not exists.".format(self.databaseName))
            if err.errno == errorcode.ER_BAD_DB_ERROR:
                self.create_database()
                print("Database {} created successfully.".format(self.databaseName))
                self.cnx.database = self.databaseName
            else:
                print(err)
                exit(1)

        for table_name in TABLES:
            table_description = TABLES[table_name]
            try:
                print("Creating table {}: ".format(table_name), end='')
                self.cursor.execute(table_description)
            except mysql.connector.Error as err:
                if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                    print("already exists.")
                else:
                    print(err.msg)
            else:
                print("OK")

    def getConnection(self):
        return self.cnx
