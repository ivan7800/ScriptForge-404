@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - CAU Toolkit Master
:: Categoria: Base CAU | Nivel de riesgo: MEDIO
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
set "LOGFILE=%LOGDIR%\v5_pro_30_cau_toolkit_master_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - CAU Toolkit Master >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - CAU Toolkit Master
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - CAU Toolkit Master
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
net session >nul 2>&1 || (echo Ejecuta como Administrador para opciones avanzadas & pause)
:menu
cls
echo 1 Diagnostico rapido
echo 2 Red basica
echo 3 Outlook modo seguro
echo 4 Limpiar cache Teams
echo 5 Reiniciar spooler
echo 6 dsregcmd status
echo 7 Logs SCCM/Intune
echo 0 Salir
set /p op=Opcion: 
if "%op%"=="1" systeminfo & pause & goto menu
if "%op%"=="2" ipconfig /all & pause & goto menu
if "%op%"=="3" start outlook.exe /safe & goto menu
if "%op%"=="4" taskkill /IM ms-teams.exe /F & pause & goto menu
if "%op%"=="5" net stop spooler /y & net start spooler & pause & goto menu
if "%op%"=="6" dsregcmd /status & pause & goto menu
if "%op%"=="7" echo Exporta logs con la plantilla V5 correspondiente. & pause & goto menu
if "%op%"=="0" exit /b
goto menu

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal