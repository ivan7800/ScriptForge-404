@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Generador script unidad de red
:: Categoria: Unidades de red | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_29_generador_script_unidad_red_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Generador script unidad de red >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Generador script unidad de red
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Generador script unidad de red
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
set "GEN=%OUT%\Mapear_P.bat"
> "%GEN%" echo @echo off
>> "%GEN%" echo net use P: /delete /y ^>nul 2^>^&1
>> "%GEN%" echo net use P: "\servidor\departamento" /persistent:yes
echo Generado: %GEN%

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal