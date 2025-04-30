from fastapi import FastAPI , Depends , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, suggestions, conversation
import os
from dotenv import load_dotenv  
from database import Base, engine ,SessionLocal
from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate, UserLogin, Token
from utils import hash_password, verify_password
from auth import create_access_token


load_dotenv()
frontendURL = os.getenv("FRONTEND_URL")
Base.metadata.create_all(bind=engine)


app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
   
    hashed_pw = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token, expires_at = create_access_token({"sub": new_user.username})
    return {"access_token": token, "token_type": "bearer", "expires_at": expires_at}

@app.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token, expires_at = create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer", "expires_at": expires_at}


origins = [
    frontendURL,
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


Base.metadata.create_all(bind=engine)


app.include_router(chat.router)
app.include_router(suggestions.router)
app.include_router(conversation.router)
