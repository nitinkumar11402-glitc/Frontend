# Git Setup and Push Script
# Run this script from PowerShell or Git Bash

Write-Host "Setting up Git repository and pushing to remote..." -ForegroundColor Green

# Navigate to project directory
Set-Location "d:\Nitin\2026\PROJECT"

# Initialize git repository (if not already initialized)
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Add remote repository
Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin git@github.com:nitinkumar11402-glitc/Frontend.git

# Add all files
Write-Host "Adding all files..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit"

# Push to repository
Write-Host "Pushing to remote repository..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

Write-Host "Done! Your code has been pushed to the repository." -ForegroundColor Green
