<#
============================================================
ScriptForge 404 - V5 Pro - Reparar boton Teams Meeting en Outlook
Categoria: Teams | Nivel de riesgo: ALTO
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
$LogFile = Join-Path $LogDir ("v5_pro_09_reparar_boton_teams_outlook_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    if ($LogFile) { Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue }
    if (-not $Silent) { Write-Host $line }
}

Write-Log "Ejecutando: V5 Pro - Reparar boton Teams Meeting en Outlook"

try {
    $OutputFolder = 'C:\CAU\ScriptForge404'
    if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
    Write-Log 'V5 Pro - Reparar boton Teams Meeting Outlook'
    Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
    Write-Log ('Salida: ' + $OutputFolder)
    Get-Process OUTLOOK,ms-teams,msteams,Teams -ErrorAction SilentlyContinue | Select-Object ProcessName,Id,StartTime | Export-Csv (Join-Path $OutputFolder 'procesos_outlook_teams.csv') -NoTypeInformation -ErrorAction SilentlyContinue
    $backup = Join-Path $OutputFolder 'TeamsAddin_before.reg'
    reg export 'HKCU\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect' $backup /y | Out-Null
    $platform = (Get-ItemProperty 'HKLM:\Software\Microsoft\Office\ClickToRun\Configuration' -ErrorAction SilentlyContinue).Platform
    $bitness = if ($platform -match 'x86') { 'x86' } else { 'x64' }
    $regsvr = if ($bitness -eq 'x86') { Join-Path $env:windir 'SysWOW64\regsvr32.exe' } else { Join-Path $env:windir 'System32\regsvr32.exe' }
    $root = Join-Path $env:LOCALAPPDATA 'Microsoft\TeamsMeetingAdd-in'
    $addin = Get-ChildItem $root -Directory -ErrorAction SilentlyContinue | Sort-Object {[version]$_.Name} -Descending | ForEach-Object { Join-Path $_.FullName "$bitness\Microsoft.Teams.AddinLoader.dll" } | Where-Object { Test-Path $_ } | Select-Object -First 1
    if (-not $addin) { throw 'No se encontro Microsoft.Teams.AddinLoader.dll para Office ' + $bitness }
    Write-Log ('Add-in detectado: ' + $addin)
    if ($false -and -not $DryRun) {
        Get-Process OUTLOOK,ms-teams,msteams,Teams -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        New-Item 'HKCU:\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect' -Force | Out-Null
        Set-ItemProperty 'HKCU:\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect' -Name LoadBehavior -Type DWord -Value 3
        Set-ItemProperty 'HKCU:\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect' -Name FriendlyName -Type String -Value 'Microsoft Teams Meeting Add-in for Microsoft Office'
        Set-ItemProperty 'HKCU:\Software\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect' -Name Description -Type String -Value 'Microsoft Teams Meeting Add-in for Microsoft Office'
        New-Item 'HKCU:\Software\Microsoft\Office\16.0\Outlook\Resiliency\DoNotDisableAddinList' -Force | Out-Null
        Set-ItemProperty 'HKCU:\Software\Microsoft\Office\16.0\Outlook\Resiliency\DoNotDisableAddinList' -Name TeamsAddin.FastConnect -Type DWord -Value 1
        Remove-Item 'HKCU:\Software\Microsoft\Office\16.0\Outlook\Resiliency\DisabledItems' -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item 'HKCU:\Software\Microsoft\Office\16.0\Outlook\Resiliency\CrashingAddinList' -Recurse -Force -ErrorAction SilentlyContinue
        Start-Process $regsvr -ArgumentList '/n','/i:user',('"' + $addin + '"') -Wait
        Start-Process 'ms-teams:'
        Start-Sleep -Seconds 90
        Start-Process outlook.exe
    } else { Write-Log 'Modo diagnostico: sin tocar registro/DLL.' }
}
catch {
    Write-Log ("ERROR no controlado: " + $_.Exception.Message)
    exit 1
}

Write-Log "Script finalizado."