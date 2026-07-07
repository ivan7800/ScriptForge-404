@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Diagnostico rapido PC
:: Categoria: Diagnostico | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_01_diagnostico_rapido_pc_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Diagnostico rapido PC >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Diagnostico rapido PC
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Diagnostico rapido PC
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ComputerInfo | Select CsName,OsName,OsVersion,OsBuildNumber,CsDomain,CsManufacturer,CsModel,CsTotalPhysicalMemory | Format-List | Out-File '%OUT%\diagnostico_rapido.txt'; Get-NetIPConfiguration | Out-File '%OUT%\red.txt'; Get-CimInstance Win32_LogicalDisk | Select DeviceID,Size,FreeSpace | Export-Csv '%OUT%\discos.csv' -NoTypeInformation; Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 50 | Select TimeCreated,Id,ProviderName,Message | Export-Csv '%OUT%\eventos_criticos.csv' -NoTypeInformation"
echo [OK] Diagnostico exportado en %OUT%

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal