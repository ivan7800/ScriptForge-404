@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Reparar Teams completo
:: Categoria: Teams | Nivel de riesgo: ALTO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Comprobacion de permisos de administrador + autoelevacion UAC
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Este script requiere permisos de administrador.
    echo [INFO] Solicitando elevacion UAC...
    set "SF_SELF=%~f0"
    set "SF_CWD=%~dp0"
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath $env:SF_SELF -Verb RunAs -WorkingDirectory $env:SF_CWD"
    exit /b
)

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_11_reparar_teams_completo_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Reparar Teams completo >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Reparar Teams completo
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Reparar Teams completo
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
tasklist | findstr /i "ms-teams.exe msteams.exe Teams.exe" > "%OUT%\procesos_teams.txt" 2>nul
powershell -NoProfile -Command "Get-AppxPackage *MSTeams* | Select Name,Version,PackageFullName | Out-File '%OUT%\teams_appx.txt'; Get-ItemProperty HKLM:\Software\Microsoft\EdgeUpdate\Clients\* -ErrorAction SilentlyContinue | Where {$_.name -like '*WebView*'} | Out-File '%OUT%\webview2.txt'"
xcopy "%APPDATA%\Microsoft\Teams\logs.txt" "%OUT%\" /Y /I >nul 2>&1
echo [MODO DIAGNOSTICO] Sin cambios.

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal