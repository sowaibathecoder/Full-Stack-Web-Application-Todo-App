"""
Authentication utilities for the Full-Stack Multi-User Todo Web Application.
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from .config import settings

# Configure bcrypt context with proper error handling for different environments
import bcrypt

# Check if bcrypt has the expected attributes, and patch if necessary
if not hasattr(bcrypt, '__about__'):
    # Create a mock __about__ module to satisfy passlib's version check
    import types
    bcrypt.__about__ = types.ModuleType('__about__')
    try:
        bcrypt.__about__.__version__ = getattr(bcrypt, '__version__', '4.0.0')  # Use a reasonable default
    except AttributeError:
        pass

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)
security = HTTPBearer()

SECRET_KEY = settings.better_auth_secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Early reject – bcrypt max 72 bytes
    if len(plain_password.encode('utf-8')) > 72:
        return False  # Don't even try – safe fail

    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    # Early reject – prevent crash
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password cannot be longer than 72 bytes/characters (bcrypt limit). Shorten it."
        )

    # Safe truncate – use bytes directly (no decode needed)
    safe_bytes = password_bytes[:72]

    try:
        return pwd_context.hash(safe_bytes.decode('utf-8', errors='ignore'))
    except Exception as e:
        # Handle bcrypt compatibility issues in various environments
        print(f"Warning: bcrypt hashing issue: {e}")
        # Re-raise the exception to maintain proper error handling
        raise HTTPException(
            status_code=400,
            detail="Password hashing error - please try again with a different password."
        )


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        token_data = TokenData(user_id=user_id)
        return token_data
    except JWTError:
        return None


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    token_data = verify_token(token)

    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token_data.user_id