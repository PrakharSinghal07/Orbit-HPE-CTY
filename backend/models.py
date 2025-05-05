import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from database import Base
import enum

class UserType(enum.Enum):
    USER = "user"
    ADMIN = "admin"

class MessageType(enum.Enum):
    USER = "user"
    BOT = "bot"

class User(Base):
    __tablename__ = "users"
    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String, nullable=False)
    email        = Column(String, unique=True, index=True, nullable=False)
    password     = Column(String, nullable=False)
    google_token = Column(String, nullable=True)
    type         = Column(Enum(UserType), default=UserType.USER, nullable=False)

    chats        = relationship("Chat", back_populates="owner", cascade="all, delete")

class Chat(Base):
    __tablename__ = "chats"
    id         = Column(Integer, primary_key=True, index=True)
    chat_id    = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    name       = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages   = relationship("Message", back_populates="chat", cascade="all, delete", order_by="desc(Message.created_at)")
    owner      = relationship("User", back_populates="chats")

class Message(Base):
    __tablename__ = "messages"
    id         = Column(Integer, primary_key=True, index=True)
    chat_id    = Column(String, ForeignKey("chats.chat_id"), nullable=False)
    content    = Column(String, nullable=False)
    type       = Column(Enum(MessageType), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    chat       = relationship("Chat", back_populates="messages")
