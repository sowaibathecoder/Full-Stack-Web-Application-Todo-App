"""
API routes package for the Full-Stack Multi-User Todo Web Application.
"""
from fastapi import APIRouter
from . import tasks

router = APIRouter()
router.include_router(tasks.router, tags=["tasks"])