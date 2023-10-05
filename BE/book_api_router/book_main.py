from fastapi import APIRouter,Depends, HTTPException
from db_config.database import SessionLocal
from crud import book_crud
from crud import crud
from models import models
from schemas import book_schema
from schemas import user_schema
from sqlalchemy.orm import Session

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




# @router.post("/inbook-users/", response_model=schemas.User)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     return crud.create_user(db=db, user=user)

@router.post("/api/v1/user/{user_id}/books/", response_model=book_schema.Book,tags=["ADD BOOKS"])
def create_book_for_user(
    user_id: int, book: book_schema.BookCreate, db: Session = Depends(get_db)
):
    return crud.create_user_book(db=db, book=book, user_id=user_id)


@router.get("/api/v1/users/{user_id}", response_model=user_schema.UserOut,tags=["GET BOOKS BY USER"])
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/api/v1/all_books/", response_model=list[book_schema.Book],tags=["VIEW ALL BOOKS"])
def read_books(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    books = crud.get_books(db, skip=skip, limit=limit)
    return books


@router.put("/api/v1/book", response_model=book_schema.BookBase, tags=["UPDATE BOOK"])
async def update_user(book_id: int, book_data: book_schema.BookBase, db: Session = Depends(get_db)):
    # datetime_object = datetime.strptime(book_data.published_date, "%Y-%m-%d").date()
    book_data = { 
                    "title": book_data.title,
                    "author": book_data.author,
                    "published_date": book_data.published_date,
                    "isbn": book_data.isbn,
                    "cover_image": book_data.cover_image
                }
    updated_book = book_crud.update_book(db, book_data, book_id)
    return updated_book

@router.delete("/api/v1/book/{book_id}", tags=["DELETE BOOK"])
async def delete_book(book_id: int, db: Session = Depends(get_db)):
    deleted_book = book_crud.delete_book(db, book_id)
    if deleted_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": f"Book with ID {book_id} has been deleted successfully"}