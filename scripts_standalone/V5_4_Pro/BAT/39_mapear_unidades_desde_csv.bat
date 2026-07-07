@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Mapear unidades desde CSV
:: Categoria: Unidades de red | Nivel de riesgo: MEDIO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_39_mapear_unidades_desde_csv_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Mapear unidades desde CSV >> "%LOGFILE%" 2>nul

echo Ejecutando: V5.4 Pro - Mapear unidades desde CSV
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Mapear unidades desde CSV
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
echo CSV esperado: Drive,Path,Description
if not exist "C:\CAU\unidades.csv" echo No existe CSV: C:\CAU\unidades.csv
powershell -NoProfile -ExecutionPolicy Bypass -Command "if(Test-Path 'C:\CAU\unidades.csv'){ Import-Csv 'C:\CAU\unidades.csv' | Format-Table | Out-File '%OUT%\39_csv_preview.txt' }"
echo [MODO DIAGNOSTICO] No se ejecutan cambios reales. Active reparacion para aplicar acciones.

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal