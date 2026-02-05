"""
Authentication routes for the Full-Stack Multi-User Todo Web Application.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select, Session
from typing import Dict
from datetime import timedelta
from ..models import User
from ..auth import Token, verify_password, get_password_hash, create_access_token
from ..db import get_session
from ..dependencies.auth import get_current_user_id
from pydantic import BaseModel

router = APIRouter()

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=Token)
def register_user(user_data: UserRegister, session: Session = Depends(get_session)):
    """
    Register a new user and return an access token.
    """
    try:
        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Validate password length for security (to avoid bcrypt 72-byte limit)
        # Clean the password first to remove any potential invisible characters
        clean_password = user_data.password.strip()

        password_bytes = clean_password.encode('utf-8')
        if len(password_bytes) > 72:
            raise HTTPException(
                status_code=400,
                detail="Password cannot be longer than 72 bytes. Please use a shorter password."
            )

        # Hash the password
        hashed_password = get_password_hash(clean_password)

        # Create new user with hashed password - ID will be auto-generated
        new_user = User(
            email=user_data.email,
            name=user_data.name,
            hashed_password=hashed_password
        )

        session.add(new_user)
        session.commit()
        # Refresh to get the generated ID
        session.refresh(new_user)

        # Create access token
        access_token_expires = timedelta(minutes=10080)  # 7 days
        access_token = create_access_token(
            data={"sub": new_user.id},
            expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        # Re-raise HTTP exceptions (like 400 for existing user)
        raise
    except Exception as e:
        # Log the error for debugging (in a real app, use proper logging)
        print(f"Registration error: {str(e)}")
        # Raise a generic 500 error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=Token)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    """
    Authenticate user and return an access token.
    """
    try:
        # Validate password length for security (to avoid bcrypt 72-byte limit)
        # Clean the password first to remove any potential invisible characters
        clean_password = form_data.password.strip()

        password_bytes = clean_password.encode('utf-8')
        if len(password_bytes) > 72:
            raise HTTPException(
                status_code=400,
                detail="Password cannot be longer than 72 bytes. Please use a shorter password."
            )

        # Find user by email
        user = session.exec(select(User).where(User.email == form_data.username)).first()
        if not user or not verify_password(clean_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=10080)  # 7 days
        access_token = create_access_token(
            data={"sub": user.id},
            expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error for debugging
        print(f"Login error: {str(e)}")
        # Raise a generic 500 error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/profile")
def get_profile(current_user_id: str = Depends(get_current_user_id), session: Session = Depends(get_session)):
    """
    Get current user profile information.
    """
    try:
        user = session.exec(select(User).where(User.id == current_user_id)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return user
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error for debugging
        print(f"Profile error: {str(e)}")
        # Raise a generic 500 error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Profile retrieval failed: {str(e)}"
        )