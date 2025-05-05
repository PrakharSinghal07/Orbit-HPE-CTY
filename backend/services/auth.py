from datetime import datetime, timedelta
from jose import jwt
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import get_db
from models import User

# JWT creation & verification.
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

"""
    Create a JWT with the given `data` as payload and an expiration.
    Returns (token, expires_at).
"""
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token, expire

"""
    Decode & verify a JWT. Returns payload dict or None on failure.
"""
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None

# — OAuth2 scheme to extract “Authorization: Bearer <token>”
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
"""
    FastAPI dependency that:
      1. Extracts the JWT from the Authorization header.
      2. Verifies & decodes it.
      3. Loads the corresponding User by email.
      4. Raises 401 if anything fails.
"""
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = verify_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# — password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
"""Hash a plaintext password."""
def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

"""Verify a plaintext password against a bcrypt hash."""
def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
