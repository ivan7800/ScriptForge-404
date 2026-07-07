<#
============================================================
ScriptForge 404 - V5.4 Pro - Diagnóstico impresoras completo
Categoria: Impresoras | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_79_diagnostico_impresoras_completo_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Diagnóstico impresoras completo"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Diagnóstico impresoras completo'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-Printer -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '79_printers.csv') -NoTypeInformation -Encoding UTF8
    Get-PrinterPort -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '79_ports.csv') -NoTypeInformation -Encoding UTF8
    Get-PrinterDriver -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '79_drivers.csv') -NoTypeInformation -Encoding UTF8
    Get-Service Spooler | Format-List * | Out-File (Join-Path $OutputFolder '79_spooler.txt') -Encoding UTF8

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."