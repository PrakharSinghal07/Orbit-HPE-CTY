from pydantic import BaseModel, Field , EmailStr
from typing import List, Literal
from datetime import datetime


class ChatRequest(BaseModel):
  query: str


class ChatResponse(BaseModel):
  response: str


class Suggestions(BaseModel):
  Suggestions: List[str]
  
class Message(BaseModel):
    type: Literal["user", "bot"]
    text: str

    
class NewConversation(BaseModel):
    title: str
    messages: List[Message]
    

class ConvPatch(BaseModel):
  userMsg: Message
  botMsg: Message
  prompt: str

class UserCreate(BaseModel):
  username: str
  email: EmailStr
  password: str

class UserLogin(BaseModel):
  username: str
  password: str

class Token(BaseModel):
  access_token: str
  token_type: str
  expires_at: datetime