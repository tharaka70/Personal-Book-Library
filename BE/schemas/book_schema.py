from pydantic import BaseModel
from datetime import date, datetime

    
class BookBase(BaseModel):
    title : str
    author : str
    published_date : date
    isbn: str
    cover_image : str
    rating : int


class BookCreate(BookBase):
    pass


class Book(BookBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True