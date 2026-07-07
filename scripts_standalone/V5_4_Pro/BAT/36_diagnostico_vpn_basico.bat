@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Diagnóstico VPN básico
:: Categoria: Citrix / VPN | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_36_diagnostico_vpn_basico_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Diagnóstico VPN básico >> "%LOGFILE%" 2>nul

echo Ejecutando: V5.4 Pro - Diagnóstico VPN básico
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Diagnóstico VPN básico
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-VpnConnection -AllUserConnection -ErrorAction SilentlyContinue | Export-Csv '%OUT%\36_vpn_connections.csv' -NoTypeInformation; Get-NetAdapter | Export-Csv '%OUT%\36_adapters.csv' -NoTypeInformation; Test-NetConnection 'vpn.empresa.local' | Out-File '%OUT%\36_vpn_test.txt'"
route print > "%OUT%\36_routes.txt"


echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal