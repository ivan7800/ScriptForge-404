<#
============================================================
ScriptForge 404 - V5.4 Pro - Diagnóstico VPN básico
Categoria: Citrix / VPN | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_36_diagnostico_vpn_basico_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Diagnóstico VPN básico"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Diagnóstico VPN básico'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-VpnConnection -AllUserConnection -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '36_vpn_connections.csv') -NoTypeInformation -Encoding UTF8
    Get-NetAdapter | Export-Csv (Join-Path $OutputFolder '36_adapters.csv') -NoTypeInformation -Encoding UTF8
    Get-NetRoute | Export-Csv (Join-Path $OutputFolder '36_routes.csv') -NoTypeInformation -Encoding UTF8
    Test-NetConnection 'vpn.empresa.local' | Out-File (Join-Path $OutputFolder '36_vpn_test.txt') -Encoding UTF8
    Write-Log 'Diagnóstico VPN básico exportado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."