@echo off
echo ========================================
echo   Pushing to GitHub - Vercel will auto-deploy
echo ========================================
echo.

cd /d "%~dp0"

echo Adding all files...
git add .
if errorlevel 1 (
    echo ERROR: Git not found or not in a repo. Install Git from git-scm.com
    pause
    exit /b 1
)

echo.
echo What changed:
git status

echo.
set /p commit_msg="Commit message (Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update site

echo.
echo Committing...
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo Nothing to commit - no changes, or commit failed.
    pause
    exit /b 1
)

echo.
echo Pushing to GitHub...
git push origin main 2>nul
if errorlevel 1 (
    echo Trying master branch...
    git push origin master
)

echo.
echo ========================================
echo   Done. Vercel will deploy automatically.
echo   Check vercel.com/dashboard for status.
echo ========================================
pause
