<#
============================================================
ScriptForge 404 - V5 Pro - Reset DNS Winsock TCP/IP
Categoria: Red | Nivel de riesgo: ALTO
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
$LogFile = Join-Path $LogDir ("v5_pro_04_reset_dns_winsock_tcpip_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Reset DNS Winsock TCP/IP"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Reset DNS Winsock TCPIP'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    ipconfig /all | Out-File (Join-Path $OutputFolder 'antes_ipconfig.txt') -Encoding UTF8
    netsh winsock show catalog | Out-File (Join-Path $OutputFolder 'winsock_antes.txt') -Encoding UTF8
    if ($false -and -not $DryRun) {
        ipconfig /flushdns | Out-String | Write-Log
        netsh winsock reset | Out-String | Write-Log
        netsh int ip reset (Join-Path $OutputFolder 'tcpip_reset.log') | Out-String | Write-Log
        Write-Log "Proxy WinHTTP no modificado."
        Write-Log "Reinicio recomendado manualmente."
    } else { Write-Log 'Modo diagnostico: no se resetea Winsock/TCP/IP.' }
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."