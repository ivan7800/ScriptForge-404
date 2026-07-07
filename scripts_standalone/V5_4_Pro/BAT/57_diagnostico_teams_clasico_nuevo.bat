@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Diagnóstico Teams clásico/nuevo
:: Categoria: Teams | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_57_diagnostico_teams_new_classic_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Diagnóstico Teams clásico/nuevo >> "%LOGFILE%" 2>nul

echo Ejecutando: V5.4 Pro - Diagnóstico Teams clásico/nuevo
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Diagnóstico Teams clásico/nuevo
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
tasklist | findstr /i "teams ms-teams" > "%OUT%\57_teams_process.txt"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-AppxPackage *MSTeams* | Select Name,Version,PackageFullName | Export-Csv '%OUT%\57_newteams_appx.csv' -NoTypeInformation; Get-ChildItem $env:LOCALAPPDATA\Microsoft\Teams -ErrorAction SilentlyContinue | Select FullName,LastWriteTime | Export-Csv '%OUT%\57_classic_paths.csv' -NoTypeInformation"


echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal