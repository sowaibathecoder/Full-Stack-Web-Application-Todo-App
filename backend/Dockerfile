# Use official Python 3.13 slim image (fast & small)
FROM python:3.13-slim

# Set working directory inside container
WORKDIR /app

# Copy only dependency files first (for caching)
COPY pyproject.toml requirements.txt ./

# Install UV (faster than pip) and dependencies
RUN pip install --no-cache-dir uv && \
    uv pip install --system -r requirements.txt

# Copy the rest of your backend code
COPY . .

# Expose port 7860 (Hugging Face Spaces fixed port)
EXPOSE 7860

# Run the app using uvicorn (your entry point)
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]