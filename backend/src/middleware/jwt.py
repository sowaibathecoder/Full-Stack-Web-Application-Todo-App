"""
JWT middleware for the Full-Stack Multi-User Todo Web Application.
"""
from typing import Optional
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config import settings

# JWT configuration
SECRET_KEY = settings.better_auth_secret
ALGORITHM = "HS256"

security = HTTPBearer()


class JWTMiddleware:
    """
    Middleware to handle JWT token validation for protected routes.
    """

    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM

    async def __call__(self, request: Request):
        """
        Validate the JWT token in the request and attach user_id to request.state.
        """
        # Extract token from Authorization header
        credentials: HTTPAuthorizationCredentials = await security.__call__(request)

        if not credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Bearer token required",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = credentials.credentials

        try:
            # Decode the token to get user information
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            user_id: str = payload.get("sub")

            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            # Attach user_id to request state for use in route handlers
            request.state.user_id = user_id

        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )


# Alternative implementation as a dependency function
async def get_current_user_id(request: Request) -> str:
    """
    Dependency function to get current user ID from JWT token.
    """
    # Extract token from Authorization header
    credentials: HTTPAuthorizationCredentials = await security.__call__(request)

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        # Decode the token to get user information
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )