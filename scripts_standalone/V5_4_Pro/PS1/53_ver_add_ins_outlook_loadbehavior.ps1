<#
============================================================
ScriptForge 404 - V5.4 Pro - Ver Add-ins Outlook LoadBehavior
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
$LogFile = Join-Path $LogDir ("v5_pro_53_ver_addins_outlook_loadbehavior_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Ver Add-ins Outlook LoadBehavior"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Ver Add-ins Outlook LoadBehavior'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $roots='HKCU:\Software\Microsoft\Office\Outlook\Addins','HKLM:\Software\Microsoft\Office\Outlook\Addins','HKLM:\Software\WOW6432Node\Microsoft\Office\Outlook\Addins'
    $results=foreach($r in $roots){ Get-ChildItem $r -ErrorAction SilentlyContinue | ForEach-Object { $p=Get-ItemProperty $_.PSPath; [pscustomobject]@{Root=$r; Addin=$_.PSChildName; FriendlyName=$p.FriendlyName; LoadBehavior=$p.LoadBehavior; Description=$p.Description} } }
    $results | Export-Csv (Join-Path $OutputFolder '53_outlook_addins.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Add-ins exportados.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."