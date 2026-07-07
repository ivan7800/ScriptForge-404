<#
============================================================
ScriptForge 404 - V5 Pro - Mapear unidades de red
Categoria: Unidades de red | Nivel de riesgo: MEDIO
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
$LogFile = Join-Path $LogDir ("v5_pro_05_mapear_unidades_red_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Mapear unidades de red"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Mapear unidades de red'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $maps = @('P:=\servidor\departamento', 'S:=\servidor\comun')
    $maps | ForEach-Object {
        $line = $_.Trim(); if (-not $line -or $line.StartsWith('#')) { return }
        $parts = $line -split '=', 2
        if ($parts.Count -lt 2) { Write-Log ('Linea de mapeo ignorada: ' + $line); return }
        $drive = $parts[0].Trim().TrimEnd(':')
        $unc = $parts[1].Trim()
        Write-Log ('Mapeando ' + $drive + ': a ' + $unc)
        if ($true) { Remove-PSDrive -Name $drive -Force -ErrorAction SilentlyContinue }
        if (-not $DryRun) { New-PSDrive -Name $drive -PSProvider FileSystem -Root $unc -Persist:$true | Out-Null } else { Write-Log ('DryRun activo: no se crea la unidad ' + $drive + ':') }
    }
    net use | Out-String | Write-Log
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."