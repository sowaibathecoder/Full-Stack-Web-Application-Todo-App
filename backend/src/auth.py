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

# Security configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)
security = HTTPBearer()

# JWT token configuration
SECRET_KEY = settings.better_auth_secret
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    try:
        # Ensure the plain password is within bcrypt limits
        if len(plain_password.encode('utf-8')) > 72:
            # Truncate to 72 bytes if needed
            truncated_bytes = plain_password.encode('utf-8')[:72]
            plain_password = truncated_bytes.decode('utf-8', errors='ignore')

        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        # If there's an error during verification, try with truncated password anyway
        if "password cannot be longer than 72 bytes" in str(e):
            truncated_bytes = plain_password.encode('utf-8')[:72]
            safe_password = truncated_bytes.decode('utf-8', errors='ignore')
            return pwd_context.verify(safe_password, hashed_password)
        else:
            raise e


def get_password_hash(password: str) -> str:
    """
    Generate a hash for a plain password.
    Bcrypt has a maximum length of 72 bytes, so we truncate if necessary.
    """
    try:
        # Bcrypt has a 72-byte limit, so we need to handle long passwords
        if len(password.encode('utf-8')) > 72:
            # Truncate to 72 bytes while preserving as much of the original password as possible
            # We'll decode back to string to ensure we don't cut in the middle of a multi-byte character
            truncated_bytes = password.encode('utf-8')[:72]
            password = truncated_bytes.decode('utf-8', errors='ignore')

        return pwd_context.hash(password)
    except Exception as e:
        # Log the error for debugging
        print(f"Password hash error: {str(e)}, password length: {len(password.encode('utf-8'))} bytes")

        # If the error is specifically about password length, try to truncate anyway
        if "password cannot be longer than 72 bytes" in str(e) or len(password.encode('utf-8')) > 72:
            truncated_bytes = password.encode('utf-8')[:72]
            safe_password = truncated_bytes.decode('utf-8', errors='ignore')
            return pwd_context.hash(safe_password)
        else:
            raise e


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[TokenData]:
    """
    Verify a JWT token and return the user ID if valid.
    """
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
    """
    Get the current user ID from the JWT token in the Authorization header.
    """
    token = credentials.credentials
    token_data = verify_token(token)

    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token_data.user_id