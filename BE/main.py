from sqlalchemy.orm import Session
from crud import crud
from models import models
from schemas import schemas
from schemas.user_schema import Token, TokenData , User, UserInDB ,UserCreate , UserOut, UpdateUser
from schemas.book_schema import Book
from db_config.database import SessionLocal, engine
from datetime import datetime, timedelta
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from book_api_router import book_main as book
from crud.user_crud import get_password_hash, verify_password, create_access_token , validate_username , create_new_user,update_user_crud
from typing import List

# to get a string like this run:
# openssl rand -hex 32


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


models.Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
def get_user(db, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

        
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)] ):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        db = SessionLocal() 
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    try:
        user = get_user(db, username=token_data.username)
        if user is None:
            raise credentials_exception
        return user
    finally:
        db.close() 
        
async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)]
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
        
app.include_router(book.router,
                   dependencies=[Depends(get_current_active_user)]
                   )



@app.post("/token", response_model=Token ,  tags=["AUTHENTICATION | LOGIN | ACCESS TOKEN"])
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
     db: Session = Depends(get_db)
):
    user = authenticate_user( db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


#### Endpoint to create users  #######
"""
Endpoint to add users
"""


@app.post("/api/v1/user", response_model=UserOut, tags=["USER OPERATIONS"])
async def add_user(user_data: UserCreate, db: Session = Depends(get_db)):
    username = user_data.username
    hashpw = get_password_hash(user_data.password)

    if validate_username(db, username) == True:
        raise HTTPException(status_code=406, detail="Username Already exists")

    new_user = models.User (
        username=username,
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashpw,
        disabled=user_data.disabled,
    )

    new_user = create_new_user(db, new_user)
    return new_user

"""
Endpoint to update users in database
"""


@app.put("/api/v1/user", response_model=UserOut, tags=["USER OPERATIONS"])
async def update_user(current_user: Annotated[User, Depends(get_current_active_user)],user_id: int, user_data: UpdateUser, db: Session = Depends(get_db)):
    user_data = { 
                    "full_name":user_data.full_name,
                    "disabled":user_data.disabled
                }
    updated_user = update_user_crud(db, user_data, user_id)
    return updated_user



@app.get("/api/v1/users/me/", response_model=User , tags=["USER OPERATIONS"])
async def read_users_me(
    
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return current_user


@app.get("/api/v1/users/me/books/",response_model=List[Book],tags=["GET BOOKS BY USER"])
async def read_own_books(
    current_user: Annotated[User, Depends(get_current_active_user)],
    db: Session = Depends(get_db)
):
    books = crud.get_books_by_user(db, user_id=current_user.id)
    return books
