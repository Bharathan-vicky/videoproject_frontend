# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # Hugging Face Spaces specific cache directory
    TRANSFORMERS_CACHE=/app/cache \
    HF_HOME=/app/cache

# Install system dependencies including FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (Required for Hugging Face Spaces)
RUN useradd -m -u 1000 user

# Set working directory
WORKDIR /app

# Create necessary directories and fix permissions AS ROOT before switching
RUN mkdir -p /app/cache && mkdir -p /app/bulk_analysis_reports && \
    chown -R user:user /app/cache && \
    chown -R user:user /app/bulk_analysis_reports && \
    chmod 777 /app/cache && chmod 777 /app/bulk_analysis_reports

# Switch to the non-root user
USER user

# Copy requirements first to leverage Docker cache
COPY --chown=user:user requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Copy the rest of the application
COPY --chown=user:user . .

# Update PATH to include local bin where pip installed packages
ENV PATH="/home/user/.local/bin:$PATH"

# Expose the port Hugging Face Spaces expects (7860)
EXPOSE 7860

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "2"]
