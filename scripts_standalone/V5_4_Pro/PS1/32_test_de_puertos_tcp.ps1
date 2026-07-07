<#
============================================================
ScriptForge 404 - V5.4 Pro - Test de puertos TCP
Categoria: Red | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_32_test_puertos_tcp_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Test de puertos TCP"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Test de puertos TCP'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $hosts='servidor,portal.empresa.local'.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    $ports='80,443,445,3389'.Split(',') | ForEach-Object { [int]$_.Trim() }
    $results = foreach($h in $hosts){ foreach($p in $ports){ Test-NetConnection -ComputerName $h -Port $p -WarningAction SilentlyContinue | Select-Object ComputerName,RemotePort,TcpTestSucceeded,ResolvedAddresses,SourceAddress } }
    $results | Export-Csv (Join-Path $OutputFolder '32_tcp_ports.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Test TCP finalizado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."