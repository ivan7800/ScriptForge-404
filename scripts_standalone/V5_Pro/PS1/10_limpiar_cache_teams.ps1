<#
============================================================
ScriptForge 404 - V5 Pro - Limpiar cache Teams
Categoria: Teams | Nivel de riesgo: MEDIO
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
$LogFile = Join-Path $LogDir ("v5_pro_10_limpiar_cache_teams_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Limpiar cache Teams"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Limpiar cache Teams'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-Process ms-teams,msteams,Teams -ErrorAction SilentlyContinue | Select-Object ProcessName,Id,StartTime | Export-Csv (Join-Path $OutputFolder 'procesos_teams.csv') -NoTypeInformation -ErrorAction SilentlyContinue
    $paths = @()
    if ($true) { $paths += @("$env:APPDATA\Microsoft\Teams\Cache", "$env:APPDATA\Microsoft\Teams\GPUCache", "$env:APPDATA\Microsoft\Teams\IndexedDB", "$env:APPDATA\Microsoft\Teams\Local Storage", "$env:APPDATA\Microsoft\Teams\tmp") }
    if ($true) { $paths += @("$env:LOCALAPPDATA\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams", "$env:LOCALAPPDATA\Publishers\8wekyb3d8bbwe\TeamsSharedConfig") }
    if ($false -and -not $DryRun) { Get-Process ms-teams,msteams,Teams -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }
    $paths | ForEach-Object { if (Test-Path $_) { Write-Log "Cache: $_"; if ($false -and -not $DryRun) { Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue } } }
    if ($false -and -not $DryRun) { Start-Process 'ms-teams:' }
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."