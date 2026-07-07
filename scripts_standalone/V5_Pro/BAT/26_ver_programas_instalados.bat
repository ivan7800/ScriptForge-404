@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Ver programas instalados
:: Categoria: Software | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_26_ver_programas_instalados_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Ver programas instalados >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Ver programas instalados
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Ver programas instalados
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
powershell -NoProfile -Command "$f=''; Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*,HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue | Where {$_.DisplayName -and ($f -eq '' -or $_.DisplayName -like '*'+$f+'*')} | Select DisplayName,DisplayVersion,Publisher,InstallDate,UninstallString | Export-Csv '%OUT%\software_instalado.csv' -NoTypeInformation"

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal