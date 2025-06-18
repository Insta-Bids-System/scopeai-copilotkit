@echo off
echo Cleaning and rebuilding scopeai-copilotkit...

cd /d C:\Users\USER\Documents\scopeai-copilotkit

echo Step 1: Removing node_modules and cache...
rmdir /s /q node_modules 2>nul
rmdir /s /q .next 2>nul
del package-lock.json 2>nul

echo Step 2: Installing dependencies...
call npm install

echo Step 3: Done! Now run 'npm run dev' to start the server.
pause
