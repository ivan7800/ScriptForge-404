<#
============================================================
ScriptForge 404 - V5 Pro - Reparar asociacion ICA
Categoria: Citrix / VPN | Nivel de riesgo: MEDIO
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
$LogFile = Join-Path $LogDir ("v5_pro_21_reparar_asociacion_ica_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Reparar asociacion ICA"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Reparar asociacion ICA'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    cmd /c assoc .ica | Out-String | Write-Log
    $exe=''
    if(-not $exe){ $exe=(Get-ChildItem 'C:\Program Files (x86)\Citrix','C:\Program Files\Citrix' -Filter wfica32.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1).FullName }
    if ($false -and -not $DryRun -and $exe) { cmd /c assoc .ica=Citrix.ICAClient | Out-String | Write-Log; cmd /c ftype Citrix.ICAClient=\"$exe\" \"%1\" | Out-String | Write-Log } else { Write-Log 'Modo diagnostico o ejecutable no encontrado.' }
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."