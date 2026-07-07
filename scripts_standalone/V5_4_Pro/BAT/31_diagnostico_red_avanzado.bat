@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Diagnóstico red avanzado
:: Categoria: Red | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_31_diagnostico_red_avanzado_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Diagnóstico red avanzado >> "%LOGFILE%" 2>nul

echo Ejecutando: V5.4 Pro - Diagnóstico red avanzado
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Diagnóstico red avanzado
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
ipconfig /all > "%OUT%\31_ipconfig_all.txt"
route print > "%OUT%\31_route_print.txt"
arp -a > "%OUT%\31_arp.txt"
netsh winhttp show proxy > "%OUT%\31_winhttp_proxy.txt"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetAdapter | Export-Csv '%OUT%\31_adapters.csv' -NoTypeInformation; Get-DnsClientServerAddress | Export-Csv '%OUT%\31_dns.csv' -NoTypeInformation; 'gateway,8.8.8.8,www.microsoft.com'.Split(',') | ForEach-Object { Test-NetConnection $_.Trim() } | Out-File '%OUT%\31_tests.txt'"


echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal