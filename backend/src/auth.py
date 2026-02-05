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

# Configure password hashing context with multiple schemes for compatibility
# Use argon2 as primary with pbkdf2 fallback (removed bcrypt-related schemes)
pwd_context = CryptContext(
    schemes=["argon2", "pbkdf2_sha256"],
    deprecated="auto",
    argon2__rounds=10,
    argon2__memory_cost=102400,  # 100MB
    argon2__parallelism=1,
    pbkdf2_sha256__default_rounds=29000
)
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
    # Early reject – limit password length for security, specifically check for bcrypt 72-byte limit
    if len(plain_password.encode('utf-8')) > 72:  # Bcrypt has a 72-byte limit
        return False  # Don't even try – safe fail

    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Handle verification errors gracefully
        return False


def get_password_hash(password: str) -> str:
    # Early reject – prevent crash, specifically check for bcrypt 72-byte limit
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:  # Bcrypt has a 72-byte limit, enforce this to avoid bcrypt errors
        raise HTTPException(
            status_code=400,
            detail="Password cannot be longer than 72 bytes. Please use a shorter password."
        )

    try:
        return pwd_context.hash(password)  # Use full password, no truncation needed with argon2
    except Exception as e:
        # Handle any hashing issues
        error_msg = str(e).lower()
        print(f"Warning: password hashing issue: {e}")
        if "bcrypt" in error_msg or "72" in error_msg or "byte" in error_msg:
            raise HTTPException(
                status_code=400,
                detail="Password too long - please use a shorter password (under 72 characters)."
            )
        else:
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