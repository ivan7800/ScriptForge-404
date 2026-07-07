@echo off
:: ============================================================
:: ScriptForge 404 - V5 Pro - Reparar boton Teams Meeting en Outlook
:: Categoria: Teams | Nivel de riesgo: ALTO
:: Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
:: Tecnico: QA | Cliente/equipo: CAU
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Comprobacion de permisos de administrador + autoelevacion UAC
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Este script requiere permisos de administrador.
    echo [INFO] Solicitando elevacion UAC...
    set "SF_SELF=%~f0"
    set "SF_CWD=%~dp0"
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath $env:SF_SELF -Verb RunAs -WorkingDirectory $env:SF_CWD"
    exit /b
)

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_09_reparar_boton_teams_outlook_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5 Pro - Reparar boton Teams Meeting en Outlook >> "%LOGFILE%" 2>nul

echo Ejecutando: V5 Pro - Reparar boton Teams Meeting en Outlook
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - Reparar boton Teams Meeting Outlook
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
tasklist | findstr /i "OUTLOOK.EXE ms-teams.exe msteams.exe Teams.exe" > "%OUT%\procesos_outlook_teams.txt" 2>nul
reg export "HKCU\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect" "%OUT%\TeamsAddin_before.reg" /y >nul 2>&1
set "OFFICEBITNESS=x64"
set "REGSVR=%SystemRoot%\System32\regsvr32.exe"
reg query "HKLM\SOFTWARE\Microsoft\Office\ClickToRun\Configuration" /v Platform 2>nul | findstr /i "x86" >nul && set "OFFICEBITNESS=x86" && set "REGSVR=%SystemRoot%\SysWOW64\regsvr32.exe"
set "ADDINROOT=%LOCALAPPDATA%\Microsoft\TeamsMeetingAdd-in"
if not exist "%ADDINROOT%" (echo [ERROR] No existe TeamsMeetingAdd-in & exit /b 1)
for /f "delims=" %%D in ('powershell -NoProfile -Command "Get-ChildItem -Path $env:LOCALAPPDATA\Microsoft\TeamsMeetingAdd-in -Directory | Sort-Object {[version]$_.Name} -Descending | Select -Expand Name"') do if not defined ADDINPATH if exist "%ADDINROOT%\%%D\%OFFICEBITNESS%\Microsoft.Teams.AddinLoader.dll" set "ADDINPATH=%ADDINROOT%\%%D\%OFFICEBITNESS%"
if not defined ADDINPATH (echo [ERROR] No se encontro AddinLoader.dll & exit /b 1)
echo [MODO DIAGNOSTICO] No se toca registro ni DLL.

echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal