<#
============================================================
ScriptForge 404 - V5 Pro - Reparar Outlook basico
Categoria: Office / Outlook | Nivel de riesgo: MEDIO
Generado: 2026-07-07 08:13:25 | Version de script: 5.2.4-standalone
Tecnico: QA | Cliente/equipo: CAU
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
$LogFile = Join-Path $LogDir ("v5_pro_07_reparar_outlook_basico_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Reparar Outlook basico"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Reparar Outlook basico'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-Process OUTLOOK -ErrorAction SilentlyContinue | Select-Object ProcessName,Id,StartTime | Out-String | Write-Log
    $operation = 'diagnostico'
    if ($false -and -not $DryRun) {
        Get-Process OUTLOOK -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        $arg = switch ($operation) { 'safe-mode' {'/safe'} 'resetnavpane' {'/resetnavpane'} 'cleanviews' {'/cleanviews'} 'profiles' {'/profiles'} default {''} }
        Start-Process outlook.exe -ArgumentList $arg
    } else { Write-Log 'Modo diagnostico: sin cambios.' }
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."