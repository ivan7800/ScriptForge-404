<#
============================================================
ScriptForge 404 - V5.4 Pro - Diagnóstico reunión Teams/Outlook
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
$LogFile = Join-Path $LogDir ("v5_pro_64_diagnostico_reunion_teams_outlook_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Diagnóstico reunión Teams/Outlook"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Diagnóstico reunión Teams/Outlook'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-Process OUTLOOK,Teams,ms-teams -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '64_process.csv') -NoTypeInformation -Encoding UTF8
    $paths=@('HKCU:\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect','HKLM:\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect','HKLM:\Software\WOW6432Node\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect')
    foreach($p in $paths){ if(Test-Path $p){ Get-ItemProperty $p | Export-Csv (Join-Path $OutputFolder ('64_' + ($p -replace '[^a-zA-Z0-9]','_') + '.csv')) -NoTypeInformation -Encoding UTF8 } }
    Get-ChildItem "$env:LOCALAPPDATA\Microsoft\TeamsMeetingAdd-in" -Recurse -ErrorAction SilentlyContinue | Select FullName,LastWriteTime | Export-Csv (Join-Path $OutputFolder '64_addin_paths.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Diagnóstico reunión Teams/Outlook exportado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."