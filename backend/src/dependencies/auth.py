"""
Authentication dependencies for the Full-Stack Multi-User Todo Web Application.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from ..config import settings
from ..auth import verify_token

# Initialize security scheme
security = HTTPBearer()


async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Dependency to get the current user ID from the JWT token in the Authorization header.
    This ensures that only authenticated users can access protected endpoints.
    """
    token = credentials.credentials

    # Verify the token and extract user information
    token_data = verify_token(token)

    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token_data.user_id