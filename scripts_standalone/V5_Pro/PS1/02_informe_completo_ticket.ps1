<#
============================================================
ScriptForge 404 - V5 Pro - Informe completo para ticket
Categoria: Tickets CAU | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_02_informe_completo_ticket_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Informe completo para ticket"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Informe completo para ticket'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $Ticket = 'TICKET-0000'
    $Issue = 'General'
    Get-ComputerInfo | Out-File (Join-Path $OutputFolder 'computerinfo.txt') -Encoding UTF8
    Get-NetIPConfiguration | Out-File (Join-Path $OutputFolder 'network.txt') -Encoding UTF8
    Get-Service | Sort-Object Status,Name | Export-Csv (Join-Path $OutputFolder 'services.csv') -NoTypeInformation -Encoding UTF8
    Get-Printer -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder 'printers.csv') -NoTypeInformation -Encoding UTF8
    Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*,HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue | Where-Object DisplayName | Select-Object DisplayName,DisplayVersion,Publisher,InstallDate | Export-Csv (Join-Path $OutputFolder 'software.csv') -NoTypeInformation -Encoding UTF8
    Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2,3; StartTime=(Get-Date).AddDays(-2)} -ErrorAction SilentlyContinue | Select-Object -First 150 TimeCreated,Id,ProviderName,Message | Export-Csv (Join-Path $OutputFolder 'events_system.csv') -NoTypeInformation -Encoding UTF8
    $html = @"
    <h1>$Ticket</h1><h2>$Issue</h2><p>Equipo: $env:COMPUTERNAME</p><p>Usuario: $env:USERNAME</p><p>Fecha: $(Get-Date)</p><p>Carpeta de evidencias: $OutputFolder</p>
"@
    $html | Set-Content -Path (Join-Path $OutputFolder 'informe_ticket.html') -Encoding UTF8
    Write-Log 'Informe completo generado.'
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."