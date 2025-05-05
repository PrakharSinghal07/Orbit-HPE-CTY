from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas import UserCreate, UserLogin, Token
from models import User
from database import get_db
from services.auth import hash_password, verify_password
from services.auth import create_access_token

router = APIRouter(tags=["Authentication"])

"""
    Create a new user and return a JWT.
"""
@router.post("/signup", response_model=Token)
def signup(u: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == u.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=u.name,
        email=u.email,
        password=hash_password(u.password)
    )
    db.add(user); db.commit(); db.refresh(user)
    token, expires_at = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "expires_at": expires_at}

"""
    Verify credentials and return a JWT.
"""
@router.post("/login", response_model=Token)
def login(u: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == u.email).first()
    if not user or not verify_password(u.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token, expires_at = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "expires_at": expires_at}
