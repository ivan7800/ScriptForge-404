@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Diagnóstico Outlook completo
:: Categoria: Office / Outlook | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_47_diagnostico_outlook_completo_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Diagnóstico Outlook completo >> "%LOGFILE%" 2>nul

echo Ejecutando: V5.4 Pro - Diagnóstico Outlook completo
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Diagnóstico Outlook completo
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
tasklist | findstr /i outlook > "%OUT%\47_outlook_process.txt"
reg query "HKCU\Software\Microsoft\Office\Outlook\Addins" /s > "%OUT%\47_addins.txt" 2>&1
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem $env:LOCALAPPDATA\Microsoft\Outlook -Filter *.ost -ErrorAction SilentlyContinue | Select Name,Length,LastWriteTime | Export-Csv '%OUT%\47_ost.csv' -NoTypeInformation"


echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal