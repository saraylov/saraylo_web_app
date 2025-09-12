# Script to verify the complete Svelte application setup

Write-Host "=== Quantum Consciousness Runner - Svelte Web App Setup Verification ===" -ForegroundColor Cyan

# Check if required files exist
$requiredFiles = @(
    "package.json",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.node.json",
    "index.html",
    "src/main.ts",
    "src/App.svelte",
    "src/app.css",
    "src/telegram.ts",
    "public/favicon.svg",
    "README.md",
    "DEVELOPMENT.md",
    "RUNNING.md",
    "Dockerfile",
    "docker-compose.yml",
    "nginx.conf",
    "run_dev.ps1",
    "run_docker.ps1",
    "test_build.ps1"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        $missingFiles += $file
        Write-Host "❌ Missing file: $file" -ForegroundColor Red
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "✅ All required files are present" -ForegroundColor Green
} else {
    Write-Host "❌ $($missingFiles.Count) files are missing" -ForegroundColor Red
    exit 1
}

# Check Node.js and npm
Write-Host "`n=== Checking Node.js and npm ===" -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js or npm not found" -ForegroundColor Red
    exit 1
}

# Check Docker
Write-Host "`n=== Checking Docker ===" -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "✅ $dockerVersion" -ForegroundColor Green
    
    $dockerComposeVersion = docker-compose --version
    Write-Host "✅ $dockerComposeVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker not found (required for Docker deployment only)" -ForegroundColor Yellow
}

# Test build
Write-Host "`n=== Testing application build ===" -ForegroundColor Cyan
try {
    npm run check
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript check passed" -ForegroundColor Green
    } else {
        Write-Host "❌ TypeScript check failed" -ForegroundColor Red
        exit 1
    }
    
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Build test failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Setup Verification Complete ===" -ForegroundColor Cyan
Write-Host "✅ All checks passed! The Svelte application is ready for development and deployment." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. For development: .\run_dev.ps1" -ForegroundColor Yellow
Write-Host "2. For Docker deployment: .\run_docker.ps1" -ForegroundColor Yellow