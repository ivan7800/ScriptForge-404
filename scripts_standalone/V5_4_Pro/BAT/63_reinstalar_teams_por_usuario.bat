@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Reinstalar Teams por usuario
:: Categoria: Teams | Nivel de riesgo: ALTO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_63_reinstalar_teams_usuario_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Reinstalar Teams por usuario >> "%LOGFILE%" 2>nul

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

echo Ejecutando: V5.4 Pro - Reinstalar Teams por usuario
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Reinstalar Teams por usuario
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
winget list Microsoft.Teams > "%OUT%\63_winget_teams.txt" 2>&1
echo [MODO DIAGNOSTICO] No se ejecutan cambios reales. Active reparacion para aplicar acciones.

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal