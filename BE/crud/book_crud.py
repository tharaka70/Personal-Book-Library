from schemas.user_schema import Token, TokenData , User, UserInDB 
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import Depends, FastAPI, HTTPException, status
from datetime import datetime, timedelta
from typing import Annotated
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from models import models
from db_config.database import SessionLocal, engine
from sqlalchemy.exc import NoResultFound

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)




def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt







def validate_username(db:Session, fullusername:str):
    """Returns a SQL Alchemy Object Similar sounding users from user table

    Args:
        db (Session): the database session
        username (str | None, optional): The username for the lookup. Defaults to None.

    Returns:
        sqlalchemy object: Contains user's data from the User Table
    """
    if fullusername != None:
        result = db.query(models.User).filter(models.User.username==fullusername).first()
        if result is not None:
            return True
        else:
            return False
    # return result
    
def create_new_user(db:Session, user:models.User) -> None:
    """
    return the complete user object after creating the user
    """
    db.add(user)
    db.commit()
    user = db.query(models.User).filter(models.User.username==user.username).one()
    return user

def update_book(db:Session,book_data,book_id:int):
    db.query(models.Book).filter(models.Book.id == book_id).update(book_data)
    db.commit()
    book = db.query(models.Book).filter(models.Book.id == book_id).one()
    return book


def delete_book(db: Session, book_id: int):
    try:
        # Get the book to be deleted
        book = db.query(models.Book).filter(models.Book.id == book_id).one()

        # Delete the book from the database
        db.delete(book)
        db.commit()

        # Return the deleted book
        return book

    except NoResultFound:
        raise HTTPException(status_code=404, detail="Invalid book id")
        return None
