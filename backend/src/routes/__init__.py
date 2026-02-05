"""
API routes package for the Full-Stack Multi-User Todo Web Application.
"""
from fastapi import APIRouter
from . import tasks, auth

router = APIRouter()
router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])