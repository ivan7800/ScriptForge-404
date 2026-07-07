@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Diagnostico Citrix ICA
:: Categoria: Citrix / VPN | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_20_diagnostico_citrix_ica_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Diagnostico Citrix ICA >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Diagnostico Citrix ICA
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Diagnostico Citrix ICA
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
reg query "HKCR\.ica" > "%OUT%\ica_assoc.txt" 2>&1
reg query "HKLM\SOFTWARE\WOW6432Node\Citrix" /s > "%OUT%\citrix_reg.txt" 2>&1
tasklist | findstr /i "SelfService Receiver wfcrun32" > "%OUT%\citrix_process.txt"

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal