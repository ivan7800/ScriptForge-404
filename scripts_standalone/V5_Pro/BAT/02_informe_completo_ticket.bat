@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Informe completo para ticket
:: Categoria: Tickets CAU | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_02_informe_completo_ticket_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Informe completo para ticket >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Informe completo para ticket
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Informe completo para ticket
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
set "TICKET=TICKET-0000"
set "ISSUE=General"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$o='%OUT%'; $t='TICKET-0000'; $i='General'; Get-ComputerInfo | Out-File (Join-Path $o 'computerinfo.txt'); Get-NetIPConfiguration | Out-File (Join-Path $o 'network.txt'); Get-Service | Sort Status,Name | Export-Csv (Join-Path $o 'services.csv') -NoTypeInformation; Get-Printer -ErrorAction SilentlyContinue | Export-Csv (Join-Path $o 'printers.csv') -NoTypeInformation; Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*,HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue | Select DisplayName,DisplayVersion,Publisher,InstallDate | Where DisplayName | Export-Csv (Join-Path $o 'software.csv') -NoTypeInformation; '<h1>'+ $t +'</h1><p>'+ $i +'</p><p>'+ $env:COMPUTERNAME +'</p>' | Set-Content (Join-Path $o 'informe.html')"
echo [OK] Informe generado: %OUT%

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal