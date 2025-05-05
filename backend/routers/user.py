from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from services.auth import get_current_user
from services.llm import get_suggestions
from database import get_db
from models import Chat, Message, MessageType
from schemas import ChatCreate, ChatOut, MessageCreate, ChatPatch

router = APIRouter(prefix="/chats", tags=["Chats"], dependencies=[Depends(get_current_user)])

# ----------------------------
# Get LLM suggestions
# ----------------------------
@router.get("/suggestions", response_model=List[str])
def chat_suggestions():
    return get_suggestions()

# ----------------------------
# Create a new chat
# ----------------------------
@router.post("/", response_model=ChatOut)
def create_chat(
    body: ChatCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    chat = Chat(name=body.name, user_id=current_user.id)
    db.add(chat)
    db.flush()  # populate chat_id

    for m in body.messages:
        db.add(Message(chat_id=chat.chat_id, content=m.content, type=MessageType(m.type)))

    db.commit()
    db.refresh(chat)

    return ChatOut.from_orm(chat)

# ----------------------------
# List all chats (latest first)
# ----------------------------
@router.get("/", response_model=List[ChatOut])
def list_chats(db: Session = Depends(get_db), current=Depends(get_current_user)):
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == current.id)
        .order_by(Chat.updated_at.desc())
        .all()
    )
    return chats

# ----------------------------
# Get a single chat
# ----------------------------
@router.get("/{chat_id}", response_model=ChatOut)
def get_chat(chat_id: str, db: Session = Depends(get_db), current=Depends(get_current_user)):
    chat = db.query(Chat).filter(Chat.chat_id == chat_id, Chat.user_id == current.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat

# ----------------------------
# Add a message to a chat
# ----------------------------
@router.post("/{chat_id}/messages", response_model=ChatOut)
def add_message(
    chat_id: str,
    m: MessageCreate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.chat_id == chat_id, Chat.user_id == current.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    msg = Message(chat_id=chat.chat_id, content=m.content, type=MessageType(m.type))
    db.add(msg)

    chat.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(chat)
    return chat

# ----------------------------
# Delete a chat
# ----------------------------
@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(chat_id: str, db: Session = Depends(get_db), current=Depends(get_current_user)):
    chat = db.query(Chat).filter(Chat.chat_id == chat_id, Chat.user_id == current.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    db.delete(chat)
    db.commit()
    return

# ----------------------------
# Rename a chat
# ----------------------------
@router.patch("/{chat_id}", response_model=ChatOut)
def rename_chat(
    chat_id: str,
    patch: ChatPatch,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.chat_id == chat_id, Chat.user_id == current.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    chat.name = patch.name
    chat.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(chat)
    return chat

