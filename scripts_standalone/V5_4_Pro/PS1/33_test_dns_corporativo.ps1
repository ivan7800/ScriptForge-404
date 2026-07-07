<#
============================================================
ScriptForge 404 - V5.4 Pro - Test DNS corporativo
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
$LogFile = Join-Path $LogDir ("v5_pro_33_test_dns_corporativo_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5.4 Pro - Test DNS corporativo"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5.4 Pro - Test DNS corporativo'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    $dns=''
    $names='intranet.empresa.local,www.microsoft.com'.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    $results = foreach($n in $names){
        try { if($dns){ Resolve-DnsName $n -Server $dns -ErrorAction Stop } else { Resolve-DnsName $n -ErrorAction Stop } }
        catch { [pscustomobject]@{Name=$n; Error=$_.Exception.Message} }
    }
    $results | Export-Csv (Join-Path $OutputFolder '33_dns_results.csv') -NoTypeInformation -Encoding UTF8
    Write-Log 'Test DNS corporativo finalizado.'

}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."