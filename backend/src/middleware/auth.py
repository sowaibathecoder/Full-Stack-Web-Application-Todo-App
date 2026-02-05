"""
Authentication middleware for the Full-Stack Multi-User Todo Web Application.
Handles JWT validation and user identification for protected routes.
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from ..config import settings

# Initialize security scheme
security = HTTPBearer()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token with the specified data and expiration.
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # Default to 7 days if no expiration is specified
        expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.better_auth_secret,
        algorithm=settings.jwt_algorithm
    )

    return encoded_jwt


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Dependency to get the current user ID from the JWT token in the Authorization header.
    This ensures that only authenticated users can access protected endpoints.
    """
    token = credentials.credentials

    try:
        # Decode the token to extract user information
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[settings.jwt_algorithm]
        )

        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials - no user ID in token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials - invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials - {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )