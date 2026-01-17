# Git Setup Commands

If git is not accessible from PowerShell, you can run these commands in Git Bash or after adding git to your PATH.

## Commands to run:

```bash
# Navigate to project directory
cd d:\Nitin\2026\PROJECT

# Initialize git repository (if not already initialized)
git init

# Add remote repository
git remote add origin git@github.com:nitinkumar11402-glitc/Frontend.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit"

# Set main branch and push
git branch -M main
git push -u origin main
```

## If you get authentication errors:

Make sure you have:
1. SSH key set up with GitHub
2. Or use HTTPS instead: `git remote add origin https://github.com/nitinkumar11402-glitc/Frontend.git`
