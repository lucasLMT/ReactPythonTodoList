from pydantic import BaseModel, Field
import uuid


class TodoModel(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    item: str
    user: str

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "id": "00010203-0405-0607-0809-0a0b0c0d0e0f",
                "item": "My important task",
                "user": "12313123122312",
            }
        }


class UpdateTodoModel(BaseModel):
    item: str
    user: str

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "item": "My important task",
                "user": "12313123122312",
            }
        }
