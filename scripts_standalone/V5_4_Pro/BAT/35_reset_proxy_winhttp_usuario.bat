@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Reset proxy WinHTTP/usuario
:: Categoria: Red | Nivel de riesgo: ALTO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
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
set "LOGFILE=%LOGDIR%\v5_pro_35_reset_proxy_winhttp_ie_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Reset proxy WinHTTP/usuario >> "%LOGFILE%" 2>nul

:: Confirmacion obligatoria por riesgo ALTO
echo ============================================================
echo   ATENCION: este script contiene acciones de RIESGO ALTO.
echo   Revisa el informe de riesgo antes de continuar.
echo ============================================================
set /p CONFIRMA="Escribe SI en mayusculas para continuar: "
if not "%CONFIRMA%"=="SI" (
    echo Operacion cancelada por el usuario.
    exit /b 1
)

echo Ejecutando: V5.4 Pro - Reset proxy WinHTTP/usuario
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Reset proxy WinHTTP/usuario
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
netsh winhttp show proxy > "%OUT%\35_proxy_antes.txt"
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer >> "%OUT%\35_proxy_antes.txt" 2>&1
echo [MODO DIAGNOSTICO] No se ejecutan cambios reales. Active reparacion para aplicar acciones.

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal