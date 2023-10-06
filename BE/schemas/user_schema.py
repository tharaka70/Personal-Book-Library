from pydantic import BaseModel
from .book_schema import BookBase , Book , BookCreate

class Token(BaseModel):
    id : int
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class UserOut(User):
    id: int
    books: list[Book] = []
    

class UserInDB(User):
    hashed_password: str
    
    class Config:
        orm_mode = True

    
class UserCreate(User):
    password: str
    
class UpdateUser(BaseModel):
    full_name: str | None = None
    disabled: bool | None = None