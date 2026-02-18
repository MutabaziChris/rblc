@echo off
echo ========================================
echo   Pushing your changes to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Adding all files...
git add .
if errorlevel 1 (
    echo ERROR: Git add failed. Is Git installed?
    pause
    exit /b 1
)

echo.
echo Step 2: Showing what will be committed...
git status

echo.
set /p commit_msg="Step 3: Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update: image upload, analytics, Google tag

echo Committing: %commit_msg%
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo No changes to commit, or commit failed.
    pause
    exit /b 1
)

echo.
echo Step 4: Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo Push failed. Trying 'master' branch...
    git push origin master
)

echo.
echo ========================================
echo   Done! Now go to your server and run:
echo   git pull origin main
echo   bash deploy.sh
echo ========================================
pause
