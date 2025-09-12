# Test script to verify Svelte app builds correctly with Node.js 20

Write-Host "Testing Svelte app build with Node.js 20..." -ForegroundColor Green

# Check if Node.js is installed and version
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
    
    # Check if version is 20 or higher
    if ($nodeVersion -match "v(\d+)") {
        $majorVersion = [int]$matches[1]
        if ($majorVersion -lt 20) {
            Write-Host "Warning: Node.js version 20 or higher is recommended" -ForegroundColor Yellow
        } else {
            Write-Host "Node.js version is compatible" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: npm is not installed" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Run TypeScript check
Write-Host "Running TypeScript check..." -ForegroundColor Cyan
npm run check

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: TypeScript check failed" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "Building the application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "Test completed successfully!" -ForegroundColor Green
Write-Host "The Svelte application is ready for deployment." -ForegroundColor Cyan