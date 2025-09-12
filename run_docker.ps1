# Script to build and run the Svelte application in Docker

Write-Host "=== Quantum Consciousness Runner - Svelte Web App ===" -ForegroundColor Cyan
Write-Host "Building and running Svelte application in Docker..." -ForegroundColor Green

# Check if Docker is installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Docker Compose is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Docker and Docker Compose found" -ForegroundColor Green

# Build the Docker image
Write-Host "Building Docker image..." -ForegroundColor Cyan
docker-compose build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to build Docker image" -ForegroundColor Red
    exit 1
}

# Start the container
Write-Host "Starting Docker container..." -ForegroundColor Cyan
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to start Docker container" -ForegroundColor Red
    exit 1
}

# Wait for services to start
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check service status
Write-Host "Checking service status..." -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "=== Application Access ===" -ForegroundColor Green
Write-Host "Svelte App: http://localhost:3003" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the application, run: docker-compose down" -ForegroundColor Yellow