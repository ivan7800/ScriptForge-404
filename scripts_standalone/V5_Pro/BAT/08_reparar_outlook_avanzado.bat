@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Reparar Outlook avanzado
:: Categoria: Office / Outlook | Nivel de riesgo: ALTO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_08_reparar_outlook_avanzado_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Reparar Outlook avanzado >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Reparar Outlook avanzado
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Reparar Outlook avanzado
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
tasklist | findstr /i OUTLOOK.EXE > "%OUT%\outlook_process.txt" 2>nul
if exist "%LOCALAPPDATA%\Microsoft\Outlook\RoamCache" dir "%LOCALAPPDATA%\Microsoft\Outlook\RoamCache" > "%OUT%\roamcache_antes.txt"
reg query "HKCU\Software\Microsoft\Office\16.0\Outlook\Resiliency" > "%OUT%\resiliency_antes.txt" 2>nul
echo [MODO DIAGNOSTICO] No se limpian caches.

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal