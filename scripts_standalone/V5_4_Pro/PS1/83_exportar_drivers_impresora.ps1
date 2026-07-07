<#
============================================================
ScriptForge 404 - V5.4 Pro - Exportar drivers impresora
Categoria: Impresoras | Nivel de riesgo: BAJO
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

# Comprobacion de permisos de administrador + autoelevacion UAC
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "[INFO] Este script requiere permisos de administrador." -ForegroundColor Yellow
    Write-Host "[INFO] Solicitando elevacion UAC..." -ForegroundColor Yellow
    $arguments = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$PSCommandPath`"")
    if ($DryRun) { $arguments += "-DryRun" }
    if ($Silent) { $arguments += "-Silent" }
    $workingDirectory = Split-Path -Parent $PSCommandPath
    Start-Process -FilePath "powershell.exe" -ArgumentList $arguments -Verb RunAs -WorkingDirectory $workingDirectory
    exit
}

# Configuracion de log
$LogDir = ".\logs"
if (-not (Test-Path $LogDir)) { New-Item -Path $LogDir -ItemType Directory -Force | Out-Null }
$LogFile = Join-Path $LogDir ("v5_pro_83_exportar_drivers_impresora_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Exportar drivers impresora"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Exportar drivers impresora'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    pnputil /enum-drivers | Out-File (Join-Path $OutputFolder '83_pnputil_drivers.txt') -Encoding UTF8
    Get-PrinterDriver -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '83_printer_drivers.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Drivers inventariados.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."