@echo off
title CodeBuddy - Modern UI Edition
color 0d

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║              🎨 CodeBuddy - MODERN UI EDITION               ║
echo  ║         Stunning Design + OpenAI Vision + Tavily AI          ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo ✨ MODERN UI FEATURES:
echo  🎨 Beautiful gradient backgrounds and glass morphism effects
echo  🌟 Smooth animations and transitions  
echo  💎 Modern card-based design with shadows and depth
echo  🔄 Pulse animations and dynamic loading states
echo  🎯 Professional button designs with gradient effects
echo  📱 Dark theme with premium glass elements
echo.

echo 🤖 AI CAPABILITIES:
echo  ✅ OpenAI GPT-4 Vision - Real code extraction
echo  ✅ Tavily AI - Intelligent analysis
echo  ✅ Multi-language support
echo  ✅ Enhanced error detection
echo.

echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Starting the modern UI experience...
echo.
echo 📱 EXPERIENCE THE NEW DESIGN:
echo    • Stunning dark gradient backgrounds
echo    • Smooth entrance animations  
echo    • Modern glass-morphism cards
echo    • Professional button designs
echo    • Dynamic loading animations
echo    • Real-time status indicators
echo.
echo 🎨 UI Highlights:
echo    • Dark theme with blue/purple gradients
echo    • Glass-effect cards with subtle borders
echo    • Animated buttons with shadow effects
echo    • Confidence badges and status indicators
echo    • Smooth fade-in and slide animations
echo.

call npx expo start --tunnel

echo.
echo App closed. Press any key to exit...
pause >nul