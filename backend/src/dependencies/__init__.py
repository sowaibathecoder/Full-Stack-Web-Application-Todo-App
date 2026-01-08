"""
Dependency injection package for the Full-Stack Multi-User Todo Web Application.
"""
from .auth import get_current_user_id

__all__ = ["get_current_user_id"]