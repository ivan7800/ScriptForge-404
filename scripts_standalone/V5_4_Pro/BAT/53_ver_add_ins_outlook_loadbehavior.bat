@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Ver Add-ins Outlook LoadBehavior
:: Categoria: Office / Outlook | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_53_ver_addins_outlook_loadbehavior_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Ver Add-ins Outlook LoadBehavior >> "%LOGFILE%" 2>nul

echo Ejecutando: V5.4 Pro - Ver Add-ins Outlook LoadBehavior
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Ver Add-ins Outlook LoadBehavior
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
reg query "HKCU\Software\Microsoft\Office\Outlook\Addins" /s > "%OUT%\53_addins_hkcu.txt" 2>&1
reg query "HKLM\Software\Microsoft\Office\Outlook\Addins" /s > "%OUT%\53_addins_hklm.txt" 2>&1


echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal