from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# ─── AUTH ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_at: datetime

# ─── CHAT / MESSAGE ────────────────────────────────────────────────────────────

class MessageCreate(BaseModel):
    content: str
    type: str

class ChatCreate(BaseModel):
    name: str
    messages: Optional[List[MessageCreate]] = []

class MessageOut(BaseModel):
    content: str
    type: str
    class Config:
        from_attributes = True

class ChatOut(BaseModel):
    chat_id: str
    name: str
    messages: List[MessageOut]
    class Config:
        from_attributes  = True

class ChatPatch(BaseModel):
    name: str