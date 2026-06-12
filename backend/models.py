import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(150), nullable=False)
    last_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    dob = Column(String(50), nullable=True)
    hashed_password = Column(String(255), nullable=False)

    # Relationships
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    history = relationship("History", back_populates="user", cascade="all, delete-orphan")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    code = Column(Text, nullable=True)
    result = Column(Text, nullable=True)
    label = Column(String(255), nullable=True)
    date = Column(String(100), default=lambda: datetime.datetime.now().isoformat())

    # Relationships
    user = relationship("User", back_populates="sessions")

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    code = Column(Text, nullable=True)
    result = Column(Text, nullable=True)
    label = Column(String(255), nullable=True)
    date = Column(String(100), default=lambda: datetime.datetime.now().isoformat())

    # Relationships
    user = relationship("User", back_populates="history")
