"""
Main FastAPI application for the Full-Stack Multi-User Todo Web Application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from .routes import router as api_router
from .config import settings


from .db import create_db_and_tables


class ForwardedHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to handle forwarded headers from reverse proxies like Hugging Face Spaces
    """
    async def dispatch(self, request: Request, call_next):
        # Check for forwarded headers from reverse proxy
        forwarded_proto = request.headers.get('X-Forwarded-Proto', '').lower()
        forwarded_host = request.headers.get('X-Forwarded-Host', '')

        # If request came via HTTPS originally, ensure the scheme is preserved
        if forwarded_proto == 'https':
            request.scope['scheme'] = 'https'

        # If forwarded host is provided, update the server info
        if forwarded_host:
            # Split host and port if present
            if ':' in forwarded_host:
                host, port_str = forwarded_host.split(':', 1)
                port = int(port_str)
            else:
                host = forwarded_host
                port = 443 if forwarded_proto == 'https' else 80

            # Update the server information in the request scope
            request.scope['server'] = (host, port)

        response = await call_next(request)
        return response

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    """
    app = FastAPI(
        title="Full-Stack Multi-User Todo Web Application API",
        description="API for the Full-Stack Multi-User Todo Web Application",
        version="1.0.0",
        openapi_url="/api/openapi.json",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
    )

    # Add forwarded headers middleware first (handles X-Forwarded-* headers from reverse proxies)
    app.add_middleware(ForwardedHeadersMiddleware)

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins.split(",") if settings.allowed_origins else ["*"],  # Configure specific origins in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Create database tables on startup
    @app.on_event("startup")
    def on_startup():
        create_db_and_tables()

    # Include API routes
    app.include_router(api_router, prefix="/api", tags=["tasks"])

    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development"
    )