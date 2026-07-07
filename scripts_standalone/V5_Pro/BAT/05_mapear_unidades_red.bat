@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Mapear unidades de red
:: Categoria: Unidades de red | Nivel de riesgo: MEDIO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_05_mapear_unidades_red_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Mapear unidades de red >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Mapear unidades de red
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Mapear unidades de red
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
set "MAPFILE=%OUT%\maplist.txt"
> "%MAPFILE%" (
echo P:=\servidor\departamento
echo S:=\servidor\comun
)
for /f "usebackq tokens=1,* delims==" %%A in ("%MAPFILE%") do (
  echo Mapeando %%A a %%B
  net use "%%A" /delete /y >nul 2>&1
  net use "%%A" "%%B" /persistent:yes
)
net use

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal