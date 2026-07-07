<#
============================================================
ScriptForge 404 - V5 Pro - Reparar unidades de red
Categoria: Unidades de red | Nivel de riesgo: MEDIO
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
$LogFile = Join-Path $LogDir ("v5_pro_06_reparar_unidades_red_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Reparar unidades de red"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Reparar unidades de red'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $Server = 'servidor'
    $Unc = '\servidor\recurso'
    net use | Out-File (Join-Path $OutputFolder 'netuse_antes.txt') -Encoding UTF8
    cmdkey /list | Out-File (Join-Path $OutputFolder 'cmdkey.txt') -Encoding UTF8
    Test-NetConnection -ComputerName $Server -Port 445 | Out-String | Write-Log
    if (Test-Path $Unc) { Write-Log "Acceso OK a $Unc" } else { Write-Log "No hay acceso a $Unc" }
    Get-SmbMapping -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder 'smb_mappings.csv') -NoTypeInformation -Encoding UTF8
    if ($false -and -not $DryRun) { net use * /persistent:yes | Out-String | Write-Log } else { Write-Log 'Modo diagnostico: sin reconexion forzada.' }
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."