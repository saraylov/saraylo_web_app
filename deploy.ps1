# Deployment script for GitHub Pages
Write-Host "Building the application..."
npm run build:webauth

Write-Host "Copying files to docs folder..."
# Create docs directory if it doesn't exist
if (!(Test-Path -Path "docs")) {
    New-Item -ItemType Directory -Path "docs"
}

# Copy all files from distWebAuth to docs
Copy-Item -Path "distWebAuth/*" -Destination "docs" -Recurse -Force

Write-Host "Deployment files are ready in docs folder"
Write-Host "Please commit and push to GitHub to deploy"