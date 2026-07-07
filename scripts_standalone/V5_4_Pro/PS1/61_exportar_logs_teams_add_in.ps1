<#
============================================================
ScriptForge 404 - V5.4 Pro - Exportar logs Teams Add-in
Categoria: Teams | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_61_exportar_logs_teams_addin_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Exportar logs Teams Add-in"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Exportar logs Teams Add-in'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $dest=Join-Path $OutputFolder '61_logs'
    New-Item $dest -ItemType Directory -Force | Out-Null
    Copy-Item "$env:APPDATA\Microsoft\Teams\logs.txt" $dest -ErrorAction SilentlyContinue
    Copy-Item "$env:LOCALAPPDATA\Microsoft\TeamsMeetingAdd-in" $dest -Recurse -ErrorAction SilentlyContinue
    Get-WinEvent -FilterHashtable @{LogName='Application'; StartTime=(Get-Date).AddDays(-3)} -ErrorAction SilentlyContinue | Where-Object {$_.ProviderName -match 'Outlook|Teams|Office'} | Export-Csv (Join-Path $dest 'events.csv') -NoTypeInformation -Encoding UTF8
    if('true' -eq 'true'){ Compress-Archive $dest (Join-Path $OutputFolder '61_logs_teams_addin.zip') -Force }
    Write-Log 'Logs Teams/Add-in exportados.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."