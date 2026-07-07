@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Test de puertos TCP
:: Categoria: Red | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_32_test_puertos_tcp_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Test de puertos TCP >> "%LOGFILE%" 2>nul

echo Ejecutando: V5.4 Pro - Test de puertos TCP
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Test de puertos TCP
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
powershell -NoProfile -ExecutionPolicy Bypass -Command "$hosts='servidor,portal.empresa.local'.Split(','); $ports='80,443,445,3389'.Split(','); $r=foreach($h in $hosts){foreach($p in $ports){Test-NetConnection $h.Trim() -Port ([int]$p.Trim()) | Select ComputerName,RemotePort,TcpTestSucceeded}}; $r | Export-Csv '%OUT%\32_tcp_ports.csv' -NoTypeInformation"


echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal