@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Diagnostico Office 365
:: Categoria: Office / Outlook | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_18_diagnostico_office_365_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Diagnostico Office 365 >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Diagnostico Office 365
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Diagnostico Office 365
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
reg query "HKLM\SOFTWARE\Microsoft\Office\ClickToRun\Configuration" > "%OUT%\office_clicktorun.txt" 2>&1
for /r "%ProgramFiles%\Microsoft Office" %%F in (ospp.vbs) do cscript //nologo "%%F" /dstatus > "%OUT%\office_license.txt" 2>&1

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal