<#
============================================================
ScriptForge 404 - V5.4 Pro - Diagnóstico proxy completo
Categoria: Red | Nivel de riesgo: BAJO
Generado: 2026-07-07 08:47:22 | Version de script: 5.4-standalone
Tecnico: CAU | Cliente/equipo: EQUIPO
Generado con ScriptForge 404 - revisa siempre el contenido antes de ejecutar.
============================================================
#>

[CmdletBinding()]
param(
    [switch]$DryRun = $false,
    [switch]$Silent = $false
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Configuracion de log
$LogDir = ".\logs"
if (-not (Test-Path $LogDir)) { New-Item -Path $LogDir -ItemType Directory -Force | Out-Null }
$LogFile = Join-Path $LogDir ("v5_pro_34_diagnostico_proxy_completo_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Diagnóstico proxy completo"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Diagnóstico proxy completo'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    netsh winhttp show proxy | Out-File (Join-Path $OutputFolder '34_winhttp_proxy.txt') -Encoding UTF8
    Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' | Select-Object ProxyEnable,ProxyServer,AutoConfigURL | Export-Csv (Join-Path $OutputFolder '34_proxy_hkcu.csv') -NoTypeInformation -Encoding UTF8
    Get-ChildItem Env: | Where-Object Name -match 'proxy|http' | Export-Csv (Join-Path $OutputFolder '34_proxy_env.csv') -NoTypeInformation -Encoding UTF8
    try { Invoke-WebRequest 'https://www.microsoft.com' -UseBasicParsing -TimeoutSec 15 | Select-Object StatusCode,StatusDescription | Out-File (Join-Path $OutputFolder '34_webtest.txt') -Encoding UTF8 } catch { $_.Exception.Message | Out-File (Join-Path $OutputFolder '34_webtest.txt') -Encoding UTF8 }
    Write-Log 'Diagnóstico proxy exportado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."