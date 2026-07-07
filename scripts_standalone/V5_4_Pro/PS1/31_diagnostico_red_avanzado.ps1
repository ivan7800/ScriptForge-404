<#
============================================================
ScriptForge 404 - V5.4 Pro - Diagnóstico red avanzado
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
$LogFile = Join-Path $LogDir ("v5_pro_31_diagnostico_red_avanzado_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Diagnóstico red avanzado"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Diagnóstico red avanzado'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-NetIPConfiguration | Out-File (Join-Path $OutputFolder '31_net_ipconfiguration.txt') -Encoding UTF8
    Get-NetAdapter | Sort-Object Name | Export-Csv (Join-Path $OutputFolder '31_adapters.csv') -NoTypeInformation -Encoding UTF8
    Get-DnsClientServerAddress | Export-Csv (Join-Path $OutputFolder '31_dns.csv') -NoTypeInformation -Encoding UTF8
    Get-NetRoute | Export-Csv (Join-Path $OutputFolder '31_routes.csv') -NoTypeInformation -Encoding UTF8
    netsh winhttp show proxy | Out-File (Join-Path $OutputFolder '31_winhttp_proxy.txt') -Encoding UTF8
    'gateway,8.8.8.8,www.microsoft.com'.Split(',') | ForEach-Object { $h=$_.Trim(); if($h){ Test-NetConnection $h | Out-File (Join-Path $OutputFolder ('31_test_' + ($h -replace '[^a-zA-Z0-9.-]','_') + '.txt')) -Encoding UTF8 } }
    Write-Log 'Diagnóstico avanzado de red exportado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."