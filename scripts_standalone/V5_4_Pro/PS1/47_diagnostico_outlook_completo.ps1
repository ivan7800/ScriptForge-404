<#
============================================================
ScriptForge 404 - V5.4 Pro - Diagnóstico Outlook completo
Categoria: Office / Outlook | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_47_diagnostico_outlook_completo_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Diagnóstico Outlook completo"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Diagnóstico Outlook completo'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-Process OUTLOOK -ErrorAction SilentlyContinue | Select-Object Name,Id,StartTime,Path | Export-Csv (Join-Path $OutputFolder '47_outlook_process.csv') -NoTypeInformation -Encoding UTF8
    Get-ChildItem 'HKCU:\Software\Microsoft\Office\Outlook\Addins' -ErrorAction SilentlyContinue | ForEach-Object { Get-ItemProperty $_.PSPath | Select-Object PSChildName,FriendlyName,LoadBehavior,Description } | Export-Csv (Join-Path $OutputFolder '47_addins.csv') -NoTypeInformation -Encoding UTF8
    Get-ChildItem "$env:LOCALAPPDATA\Microsoft\Outlook" -Include *.ost,*.pst -Recurse -ErrorAction SilentlyContinue | Select-Object FullName,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder '47_datafiles.csv') -NoTypeInformation -Encoding UTF8
    Get-WinEvent -FilterHashtable @{LogName='Application'; StartTime=(Get-Date).AddDays(-3)} -ErrorAction SilentlyContinue | Where-Object {$_.ProviderName -match 'Outlook|Office|Application Error'} | Select-Object TimeCreated,Id,ProviderName,Message | Export-Csv (Join-Path $OutputFolder '47_events.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Diagnóstico Outlook completo exportado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."