@echo off
title CodeBuddy - Safe Modern UI
color 0a

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║              🛡️ CodeBuddy - SAFE MODERN UI                 ║
echo  ║         Modern Design + OpenAI Vision (No Gradients)        ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🛡️ SAFE UI VERSION:
echo  ✅ Modern animations and design
echo  ✅ No external gradient dependencies
echo  ✅ Works on all devices reliably
echo  ✅ Dark theme with solid colors
echo  ✅ All AI features intact
echo.

echo [1/3] Backing up current App.tsx...
if exist App.tsx copy App.tsx App-Gradient.tsx >nul

echo [2/3] Using safe modern UI version...
copy App-Safe.tsx App.tsx >nul

echo [3/3] Starting the app...
echo.
echo 📱 SAFE MODERN UI FEATURES:
echo    • Dark theme with solid colors
echo    • Smooth animations and transitions  
echo    • Modern card-based design
echo    • All OpenAI Vision capabilities
echo    • Reliable cross-platform compatibility
echo.

call npx expo start --tunnel

echo.
echo App closed. Press any key to exit...
pause >nul