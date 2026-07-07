<#
============================================================
ScriptForge 404 - V5 Pro - Reparar Outlook avanzado
Categoria: Office / Outlook | Nivel de riesgo: ALTO
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
$LogFile = Join-Path $LogDir ("v5_pro_08_reparar_outlook_avanzado_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Reparar Outlook avanzado"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Reparar Outlook avanzado'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-Process OUTLOOK -ErrorAction SilentlyContinue | Select-Object ProcessName,Id,StartTime | Out-File (Join-Path $OutputFolder 'outlook_process.txt') -ErrorAction SilentlyContinue
    $Roam = Join-Path $env:LOCALAPPDATA 'Microsoft\Outlook\RoamCache'
    if (Test-Path $Roam) { Get-ChildItem $Roam | Select-Object Name,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder 'roamcache_antes.csv') -NoTypeInformation -Encoding UTF8 }
    reg export 'HKCU\Software\Microsoft\Office\16.0\Outlook\Resiliency' (Join-Path $OutputFolder 'resiliency_antes.reg') /y | Out-String | Write-Log
    if ($false -and -not $DryRun) {
        Get-Process OUTLOOK -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        if (Test-Path $Roam) { Remove-Item (Join-Path $Roam "*") -Force -ErrorAction SilentlyContinue }
        Write-Log "Resiliency no solicitado."
        Start-Process outlook.exe 
    } else { Write-Log 'Modo diagnostico: sin limpieza.' }
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."