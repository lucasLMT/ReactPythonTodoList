from pymongo import MongoClient


def getMongoDB():
    client = MongoClient()
    return client
