# SPA using python, react e fastAPI

## Setting up the ambient

- Create a folder of the project and setting up a virtual environment with

  `python -m venv env`

- Inside the environment install fastAPI and uvicorn

  `pip install fastapi uvicorn`

## Things to get eyes on

### FastAPI

- When you are working with MongoDB, when you acquire data from database it's returned the ID as an ObjectID, the json encoder isn't able to parse that object, as an work around, you can do this. This code you'll tell to json encoder how to deal with ObjectId in a json.

`https://github.com/tiangolo/fastapi/issues/1515`

`https://stackoverflow.com/questions/71467630/fastapi-issues-with-mongodb-typeerror-objectid-object-is-not-iterable?noredirect=1&lq=1`

```
import pydantic
from bson.objectid import ObjectId
pydantic.json.ENCODERS_BY_TYPE[ObjectId] = str
```
