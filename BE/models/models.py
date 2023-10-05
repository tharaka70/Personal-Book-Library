from sqlalchemy import Boolean, Column, ForeignKey, Integer, String , Date
from sqlalchemy.orm import relationship

from db_config.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name =  Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String,nullable=False)
    disabled = Column(Boolean, default=False)

    books = relationship("Book", back_populates="owner")


class Book(Base):
    __tablename__ = "book"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True , nullable=False)
    author = Column(String, index=True, nullable=False)
    published_date = Column(Date)
    isbn = Column(String, index=True,unique=True)
    cover_image = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="books")
