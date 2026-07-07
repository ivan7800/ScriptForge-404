<#
============================================================
ScriptForge 404 - V5.4 Pro - Diagnóstico Teams clásico/nuevo
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
$LogFile = Join-Path $LogDir ("v5_pro_57_diagnostico_teams_new_classic_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Diagnóstico Teams clásico/nuevo"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Diagnóstico Teams clásico/nuevo'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-Process Teams,ms-teams -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '57_teams_process.csv') -NoTypeInformation -Encoding UTF8
    Get-AppxPackage *MSTeams* -ErrorAction SilentlyContinue | Select Name,Version,PackageFullName | Export-Csv (Join-Path $OutputFolder '57_newteams_appx.csv') -NoTypeInformation -Encoding UTF8
    Get-ChildItem "$env:LOCALAPPDATA\Microsoft\Teams" -ErrorAction SilentlyContinue | Select FullName,LastWriteTime | Export-Csv (Join-Path $OutputFolder '57_classic_paths.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Diagnóstico Teams exportado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."