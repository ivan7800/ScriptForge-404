<#
============================================================
ScriptForge 404 - V5 Pro - Diagnostico rapido PC
Categoria: Diagnostico | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_01_diagnostico_rapido_pc_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Diagnostico rapido PC"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Diagnostico rapido PC'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $hours = [int]'24'
    Get-ComputerInfo | Select-Object CsName,OsName,OsVersion,OsBuildNumber,CsDomain,CsManufacturer,CsModel,CsTotalPhysicalMemory | Format-List | Out-File (Join-Path $OutputFolder 'diagnostico_rapido.txt') -Encoding UTF8
    Get-NetIPConfiguration | Out-File (Join-Path $OutputFolder 'red.txt') -Encoding UTF8
    Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID,@{n='SizeGB';e={[math]::Round($_.Size/1GB,2)}},@{n='FreeGB';e={[math]::Round($_.FreeSpace/1GB,2)}} | Export-Csv (Join-Path $OutputFolder 'discos.csv') -NoTypeInformation -Encoding UTF8
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 ProcessName,Id,CPU,WS | Export-Csv (Join-Path $OutputFolder 'top_procesos.csv') -NoTypeInformation -Encoding UTF8
    Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddHours(-$hours)} -ErrorAction SilentlyContinue | Select-Object -First 80 TimeCreated,Id,ProviderName,Message | Export-Csv (Join-Path $OutputFolder 'eventos_criticos.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Diagnostico rapido exportado.'
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."