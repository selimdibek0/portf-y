@echo off
title Portfoy - Site ve Admin
cd /d "%~dp0"

echo.
echo  Eski sunucular kapatiliyor...
node scripts/free-ports.mjs
timeout /t 2 /nobreak >nul

echo.
echo  Sunucu baslatiliyor...
echo.
echo  Acilacak adresler:
echo    Site  - http://localhost:5173
echo    Admin - http://localhost:5173/admin/
echo.
echo  ONEMLI: 5174 veya baska port kullanmayin!
echo  Sifre: .env dosyasindaki ADMIN_PASSWORD
echo  Kapatmak icin Ctrl+C
echo.

npm run dev

pause
