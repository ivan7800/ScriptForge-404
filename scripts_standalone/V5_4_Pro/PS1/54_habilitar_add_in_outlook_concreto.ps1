<#
============================================================
ScriptForge 404 - V5.4 Pro - Habilitar Add-in Outlook concreto
Categoria: Office / Outlook | Nivel de riesgo: ALTO
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
$LogFile = Join-Path $LogDir ("v5_pro_54_habilitar_addin_outlook_concreto_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

# Confirmacion obligatoria por riesgo ALTO
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "  ATENCION: este script contiene acciones de RIESGO ALTO." -ForegroundColor Yellow
Write-Host "  Revisa el informe de riesgo antes de continuar." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
$confirm = Read-Host "Escribe SI en mayusculas para continuar"
if ($confirm -ne "SI") {
    Write-Host "Operacion cancelada por el usuario."
    exit 1
}

Write-Log "Ejecutando: V5.4 Pro - Habilitar Add-in Outlook concreto"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Habilitar Add-in Outlook concreto'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $addin='TeamsAddin.FastConnect'
    $paths=@("HKCU:\Software\Microsoft\Office\Outlook\Addins\$addin","HKLM:\Software\Microsoft\Office\Outlook\Addins\$addin","HKLM:\Software\WOW6432Node\Microsoft\Office\Outlook\Addins\$addin")
    foreach($p in $paths){ if(Test-Path $p){ Get-ItemProperty $p | Select * | Export-Csv (Join-Path $OutputFolder ('54_' + ($p -replace '[^a-zA-Z0-9]','_') + '.csv')) -NoTypeInformation -Encoding UTF8 } }
    Write-Log 'Modo diagnostico: no se ejecutan cambios reales. Active reparacion para aplicar acciones.'
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."