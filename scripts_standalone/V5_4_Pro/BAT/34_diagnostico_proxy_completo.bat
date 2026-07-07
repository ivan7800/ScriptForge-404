@echo off
:: ============================================================
:: ScriptForge 404 - V5.4 Pro - Diagnóstico proxy completo
:: Categoria: Red | Nivel de riesgo: BAJO
:: Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
:: Tecnico: CAU | Cliente/equipo: EQUIPO
:: Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
:: ============================================================
setlocal enabledelayedexpansion

:: Configuracion de log
set "LOGDIR=.\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%" >nul 2>&1
set "LOGFILE=%LOGDIR%\v5_pro_34_diagnostico_proxy_completo_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%.log"
set "LOGFILE=%LOGFILE: =0%"
echo [%date% %time%] Inicio de script: V5.4 Pro - Diagnóstico proxy completo >> "%LOGFILE%" 2>nul

echo Ejecutando: V5.4 Pro - Diagnóstico proxy completo
echo.
set "OUT=C:\CAU\ScriptForge404"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - Diagnóstico proxy completo
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%
netsh winhttp show proxy > "%OUT%\34_winhttp_proxy.txt"
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable > "%OUT%\34_proxy_hkcu.txt" 2>&1
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer >> "%OUT%\34_proxy_hkcu.txt" 2>&1
set http > "%OUT%\34_env_http.txt" 2>&1
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest 'https://www.microsoft.com' -UseBasicParsing -TimeoutSec 15 | Select StatusCode,StatusDescription | Out-File '%OUT%\34_webtest.txt' } catch { $_.Exception.Message | Out-File '%OUT%\34_webtest.txt' }"


echo [%date% %time%] Fin de script >> "%LOGFILE%" 2>nul
echo.
echo Script finalizado.
endlocal