<#
============================================================
ScriptForge 404 - V5.4 Pro - Reset proxy WinHTTP/usuario
Categoria: Red | Nivel de riesgo: ALTO
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
$LogFile = Join-Path $LogDir ("v5_pro_35_reset_proxy_winhttp_ie_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

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

Write-Log "Ejecutando: V5.4 Pro - Reset proxy WinHTTP/usuario"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Reset proxy WinHTTP/usuario'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    netsh winhttp show proxy | Out-File (Join-Path $OutputFolder '35_proxy_antes.txt') -Encoding UTF8
    Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings' | Select ProxyEnable,ProxyServer,AutoConfigURL | Export-Csv (Join-Path $OutputFolder '35_proxy_hkcu_antes.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Modo diagnostico: no se ejecutan cambios reales. Active reparacion para aplicar acciones.'
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."