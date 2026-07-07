<#
============================================================
ScriptForge 404 - V5.4 Pro - Ver rutas Teams Add-in
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
$LogFile = Join-Path $LogDir ("v5_pro_59_ver_rutas_teams_addin_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Ver rutas Teams Add-in"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Ver rutas Teams Add-in'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $roots=@("$env:LOCALAPPDATA\Microsoft\TeamsMeetingAdd-in","$env:ProgramFiles\Microsoft\TeamsMeetingAdd-in","${env:ProgramFiles(x86)}\Microsoft\TeamsMeetingAdd-in")
    foreach($r in $roots){ if(Test-Path $r){ Get-ChildItem $r -Recurse -ErrorAction SilentlyContinue | Select FullName,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder ('59_' + ($r -replace '[^a-zA-Z0-9]','_') + '.csv')) -NoTypeInformation -Encoding UTF8 } }
    Write-Log 'Rutas Teams Add-in exportadas.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."