<#
============================================================
ScriptForge 404 - V5.4 Pro - Diagnóstico permisos UNC
Categoria: Unidades de red | Nivel de riesgo: BAJO
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
$LogFile = Join-Path $LogDir ("v5_pro_45_diagnostico_permisos_unc_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Diagnóstico permisos UNC"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Diagnóstico permisos UNC'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $Path='\servidor\recurso'
    [pscustomobject]@{Path=$Path; Exists=(Test-Path $Path); User=$env:USERNAME; Computer=$env:COMPUTERNAME} | Export-Csv (Join-Path $OutputFolder '45_unc_access.csv') -NoTypeInformation -Encoding UTF8
    try { Get-Acl $Path | Format-List | Out-File (Join-Path $OutputFolder '45_acl.txt') -Encoding UTF8 } catch { $_.Exception.Message | Out-File (Join-Path $OutputFolder '45_acl_error.txt') -Encoding UTF8 }
    try { $tmp=Join-Path $Path ('sf404_test_' + $env:USERNAME + '.tmp'); 'test' | Set-Content $tmp -ErrorAction Stop; Remove-Item $tmp -Force; 'Write OK' | Out-File (Join-Path $OutputFolder '45_write_test.txt') } catch { $_.Exception.Message | Out-File (Join-Path $OutputFolder '45_write_test.txt') }
    Write-Log 'Diagnóstico de permisos UNC finalizado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."