<#
============================================================
ScriptForge 404 - V5.4 Pro - Generar informe HTML ticket
Categoria: Tickets CAU | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_84_generar_informe_html_ticket_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Generar informe HTML ticket"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Generar informe HTML ticket'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $ticket='TICKET-0000'; $issue='Descripción breve'
    $info=[pscustomobject]@{Ticket=$ticket;Issue=$issue;Computer=$env:COMPUTERNAME;User=$env:USERNAME;Date=(Get-Date)}
    $info | ConvertTo-Html -Title $ticket | Set-Content (Join-Path $OutputFolder '84_informe_ticket.html') -Encoding UTF8
    Get-ComputerInfo | Out-File (Join-Path $OutputFolder '84_computer.txt') -Encoding UTF8
    Get-NetIPConfiguration | Out-File (Join-Path $OutputFolder '84_network.txt') -Encoding UTF8
    Write-Log 'Informe HTML generado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."