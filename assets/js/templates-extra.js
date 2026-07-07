/* ============================================================
   ScriptForge 404 - templates-extra.js
   Pack ampliado basado en scripts reales de soporte Windows/CAU.
   No sustituye a templates.js: añade plantillas nuevas si no existen.
   ============================================================ */

(function () {
  if (typeof SFTemplates === 'undefined' || !Array.isArray(SFTemplates)) {
    console.warn('SFTemplates no esta disponible. No se cargan plantillas extra.');
    return;
  }

  const templates = SFTemplates;
  const exists = (id) => templates.some(t => t.id === id);
  const add = (tpl) => { if (!exists(tpl.id)) templates.push(tpl); };
  const safeLines = (text) => String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const batEchoLines = (text) => safeLines(text).map(l => 'echo ' + l).join('\n');

  // ============================================================
  // UNIDADES DE RED
  // ============================================================

  add({
    id: 'network-map-drive-single',
    name: 'Mapear unidad de red',
    category: 'Unidades de red',
    icon: '🗂️',
    risk: 'medio',
    requiresAdmin: false,
    description: 'Mapea una unidad de red con letra, ruta UNC, persistencia y credenciales opcionales.',
    fields: [
      { key: 'driveLetter', label: 'Letra de unidad', type: 'text', default: 'Z:' },
      { key: 'uncPath', label: 'Ruta UNC', type: 'text', default: '\\\\servidor\\recurso' },
      { key: 'persistent', label: 'Mantener unidad tras reiniciar', type: 'checkbox', default: false },
      { key: 'useCredentials', label: 'Pedir credenciales de dominio/usuario', type: 'checkbox', default: false },
      { key: 'domainUser', label: 'Usuario opcional, ejemplo DOMINIO\\usuario', type: 'text', default: '' },
      { key: 'deleteExisting', label: 'Eliminar mapeo previo de esa letra antes de mapear', type: 'checkbox', default: true }
    ],
    riskNotes: ['Modifica conexiones de red del usuario actual.', 'No almacena contraseñas en el script: las pide en ejecución si se activa credenciales.'],
    checklistPre: ['Comprobar que la ruta UNC existe y que el usuario tiene permisos.', 'Evitar letras de unidad ya usadas por aplicaciones críticas.'],
    checklistPost: ['Abrir la unidad desde Explorador.', 'Ejecutar net use para verificar el estado.'],
    rollback: 'Ejecutar net use LETRA: /delete /y o la plantilla de desmapear unidad.',
    batBody: (v) => `set "DRIVE=${v.driveLetter || 'Z:'}"
set "UNC=${v.uncPath || '\\\\servidor\\recurso'}"
set "PERSISTENT=${v.persistent ? 'yes' : 'no'}"
${v.deleteExisting ? `echo Eliminando mapeo previo si existe...
net use "%DRIVE%" /delete /y >nul 2>&1` : 'echo No se elimina ningun mapeo previo.'}
echo Mapeando %DRIVE% a %UNC%...
${v.useCredentials ? `set /p NETUSER="Usuario (DOMINIO\\usuario) [${v.domainUser || ''}]: "
if "%NETUSER%"=="" set "NETUSER=${v.domainUser || ''}"
if "%NETUSER%"=="" (
  net use "%DRIVE%" "%UNC%" /persistent:%PERSISTENT%
) else (
  net use "%DRIVE%" "%UNC%" /user:"%NETUSER%" * /persistent:%PERSISTENT%
)` : `net use "%DRIVE%" "%UNC%" /persistent:%PERSISTENT%`}
if %errorlevel% neq 0 (
  echo [ERROR] No se pudo mapear la unidad.
  exit /b 1
)
echo [OK] Unidad mapeada correctamente.
net use "%DRIVE%"`,
    ps1Body: (v) => `$Drive = "${(v.driveLetter || 'Z:').replace(':','')}"
$Unc = "${v.uncPath || '\\\\servidor\\recurso'}"
$Persist = $${v.persistent ? 'true' : 'false'}
if ($DryRun) { Write-Log "[SIMULACION] Mapear $Drive: a $Unc" }
else {
    ${v.deleteExisting ? `if (Get-PSDrive -Name $Drive -ErrorAction SilentlyContinue) {
        Write-Log "Eliminando mapeo previo $Drive..."
        Remove-PSDrive -Name $Drive -Force -ErrorAction SilentlyContinue
    }` : ''}
    ${v.useCredentials ? `$cred = Get-Credential -Message "Credenciales para $Unc"
    New-PSDrive -Name $Drive -PSProvider FileSystem -Root $Unc -Persist:$Persist -Credential $cred | Out-Null` : `New-PSDrive -Name $Drive -PSProvider FileSystem -Root $Unc -Persist:$Persist | Out-Null`}
    Write-Log "Unidad $Drive: mapeada a $Unc"
}`
  });

  add({
    id: 'network-unmap-drive',
    name: 'Desmapear unidad de red',
    category: 'Unidades de red',
    icon: '🔌',
    risk: 'medio',
    requiresAdmin: false,
    description: 'Elimina una unidad de red concreta o todas las unidades de red del usuario actual.',
    fields: [
      { key: 'driveLetter', label: 'Letra de unidad o * para todas', type: 'text', default: 'Z:' },
      { key: 'force', label: 'Forzar eliminación sin preguntar', type: 'checkbox', default: true }
    ],
    riskNotes: ['Puede cortar accesos de red usados por aplicaciones abiertas.'],
    checklistPre: ['Cerrar documentos abiertos desde la unidad de red.'],
    checklistPost: ['Ejecutar net use y comprobar que la unidad ya no aparece.'],
    rollback: 'Volver a mapear la unidad con la plantilla de mapeo.',
    batBody: (v) => `set "DRIVE=${v.driveLetter || 'Z:'}"
echo Eliminando mapeo: %DRIVE%
${v.dryRun ? 'echo [SIMULACION] net use "%DRIVE%" /delete' : `net use "%DRIVE%" /delete ${v.force ? '/y' : ''}`}
net use`,
    ps1Body: (v) => `$Drive = "${(v.driveLetter || 'Z:').replace(':','')}"
if ($Drive -eq "*") {
    Write-Log "Eliminando todas las unidades de red persistentes..."
    if (-not $DryRun) { net use * /delete ${v.force ? '/y' : ''} | Out-String | Write-Log }
} else {
    Write-Log "Eliminando unidad $Drive:"
    if (-not $DryRun) { Remove-PSDrive -Name $Drive -Force -ErrorAction SilentlyContinue }
}`
  });

  add({
    id: 'network-map-multiple-drives',
    name: 'Mapear varias unidades de red',
    category: 'Unidades de red',
    icon: '🗃️',
    risk: 'medio',
    requiresAdmin: false,
    description: 'Mapea varias unidades usando una lista LETRA=\\\\servidor\\recurso.',
    fields: [
      { key: 'mapList', label: 'Unidades una por línea. Ejemplo: Z:=\\\\servidor\\departamento', type: 'textarea', default: 'Z:=\\\\servidor\\departamento\nY:=\\\\servidor\\comun' },
      { key: 'persistent', label: 'Mantener tras reiniciar', type: 'checkbox', default: false },
      { key: 'deleteExisting', label: 'Borrar cada letra antes de mapear', type: 'checkbox', default: true }
    ],
    riskNotes: ['Modifica varios mapeos de red del usuario actual.'],
    checklistPre: ['Validar cada ruta UNC.', 'Confirmar que las letras no chocan con unidades existentes.'],
    checklistPost: ['Ejecutar net use y revisar errores por cada unidad.'],
    rollback: 'Desmapear las letras creadas con net use LETRA: /delete /y.',
    batBody: (v) => `set "MAPFILE=%TEMP%\\sf404_maps_%RANDOM%.txt"
> "%MAPFILE%" (
${batEchoLines(v.mapList || 'Z:=\\\\servidor\\departamento')}
)
for /f "usebackq tokens=1,* delims==" %%A in ("%MAPFILE%") do (
  echo.
  echo Mapeando %%A a %%B
  ${v.deleteExisting ? 'net use "%%A" /delete /y >nul 2>&1' : 'rem No se elimina mapeo previo'}
  ${v.dryRun ? 'echo [SIMULACION] net use "%%A" "%%B" /persistent:' + (v.persistent ? 'yes' : 'no') : 'net use "%%A" "%%B" /persistent:' + (v.persistent ? 'yes' : 'no')}
)
del "%MAPFILE%" >nul 2>&1
net use`,
    ps1Body: (v) => `$MapText = @'
${v.mapList || 'Z:=\\\\servidor\\departamento'}
'@
$MapText -split "\`n" | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith('#')) { return }
    $parts = $line -split '=', 2
    $drive = $parts[0].Trim().TrimEnd(':')
    $unc = $parts[1].Trim()
    Write-Log "Mapeando $drive: a $unc"
    if (-not $DryRun) {
        ${v.deleteExisting ? 'Remove-PSDrive -Name $drive -Force -ErrorAction SilentlyContinue' : ''}
        New-PSDrive -Name $drive -PSProvider FileSystem -Root $unc -Persist:$${v.persistent ? 'true' : 'false'} | Out-Null
    }
}`
  });

  add({
    id: 'network-test-share-access',
    name: 'Probar acceso a recurso de red',
    category: 'Unidades de red',
    icon: '🧪',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Comprueba DNS, ping opcional, puerto SMB 445 y acceso a una ruta UNC.',
    fields: [
      { key: 'server', label: 'Servidor', type: 'text', default: 'servidor' },
      { key: 'uncPath', label: 'Ruta UNC a probar', type: 'text', default: '\\\\servidor\\recurso' },
      { key: 'ping', label: 'Incluir ping', type: 'checkbox', default: true }
    ],
    riskNotes: ['Solo lectura. No modifica el equipo.'],
    checklistPre: ['Conectarse a VPN/red corporativa si aplica.'],
    checklistPost: ['Guardar el resultado en el ticket.'],
    rollback: null,
    batBody: (v) => `echo Probando servidor ${v.server || 'servidor'}...
nslookup ${v.server || 'servidor'}
${v.ping ? `ping -n 4 ${v.server || 'servidor'}` : 'echo Ping omitido.'}
powershell -NoProfile -Command "Test-NetConnection -ComputerName '${v.server || 'servidor'}' -Port 445"
echo.
echo Probando acceso a ${v.uncPath || '\\\\servidor\\recurso'}
dir "${v.uncPath || '\\\\servidor\\recurso'}"`,
    ps1Body: (v) => `$Server = "${v.server || 'servidor'}"
$Unc = "${v.uncPath || '\\\\servidor\\recurso'}"
Write-Log "Resolviendo DNS de $Server"
Resolve-DnsName $Server -ErrorAction SilentlyContinue | Out-String | Write-Log
${v.ping ? `Test-Connection $Server -Count 4 -ErrorAction SilentlyContinue | Out-String | Write-Log` : 'Write-Log "Ping omitido."'}
Test-NetConnection -ComputerName $Server -Port 445 | Out-String | Write-Log
if (Test-Path $Unc) { Write-Log "Acceso UNC OK: $Unc" } else { Write-Log "No se puede acceder a $Unc" }`
  });

  add({
    id: 'network-clear-stored-credentials',
    name: 'Limpiar credenciales de red guardadas',
    category: 'Unidades de red',
    icon: '🧽',
    risk: 'medio',
    requiresAdmin: false,
    description: 'Lista o elimina credenciales guardadas con cmdkey para resolver conflictos de acceso a recursos compartidos.',
    fields: [
      { key: 'mode', label: 'Acción', type: 'select', options: ['listar', 'eliminar-servidor'], default: 'listar' },
      { key: 'server', label: 'Servidor a eliminar de cmdkey', type: 'text', default: 'servidor' }
    ],
    riskNotes: ['Eliminar credenciales puede obligar a volver a autenticarse en recursos corporativos.'],
    checklistPre: ['Confirmar con el usuario que recuerda sus credenciales.'],
    checklistPost: ['Volver a acceder al recurso y comprobar si pide credenciales correctas.'],
    rollback: 'No hay rollback automático: Windows volverá a guardar credenciales cuando el usuario acceda y las recuerde.',
    batBody: (v) => `${v.mode === 'listar' ? 'cmdkey /list' : `echo Eliminando credencial guardada para ${v.server || 'servidor'}...
${v.dryRun ? 'echo [SIMULACION] cmdkey /delete:' + (v.server || 'servidor') : 'cmdkey /delete:' + (v.server || 'servidor')}
cmdkey /list`}`,
    ps1Body: (v) => `${v.mode === 'listar' ? `cmdkey /list | Out-String | Write-Log` : `Write-Log "Eliminando credencial guardada para ${v.server || 'servidor'}"
if (-not $DryRun) { cmdkey /delete:${v.server || 'servidor'} | Out-String | Write-Log }
cmdkey /list | Out-String | Write-Log`}`
  });

  // ============================================================
  // OFFICE / TEAMS / OUTLOOK
  // ============================================================

  add({
    id: 'teams-outlook-addin-advanced-user-script',
    name: 'Teams Meeting Add-in avanzado',
    category: 'Outlook',
    icon: '📅',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Repara de forma avanzada el botón Reunión de Teams en Outlook Classic: LoadBehavior, Resiliency, DLL y reinicio de Teams/Outlook.',
    fields: [
      { key: 'closeApps', label: 'Cerrar Outlook y Teams al iniciar', type: 'checkbox', default: true },
      { key: 'clearTeamsSharedConfig', label: 'Borrar TeamsSharedConfig para regeneración limpia', type: 'checkbox', default: true },
      { key: 'clearOutlookResiliency', label: 'Limpiar Outlook Resiliency', type: 'checkbox', default: true },
      { key: 'openAppsAfter', label: 'Abrir Teams y Outlook al finalizar', type: 'checkbox', default: true }
    ],
    riskNotes: ['Modifica claves HKCU de Outlook y registra el Add-in de Teams.', 'Cierra procesos de usuario si se activa la opción.'],
    checklistPre: ['Cerrar documentos y correos abiertos.', 'Comprobar que New Teams se ha abierto al menos una vez.', 'Comprobar Outlook Classic y Microsoft 365 Apps.'],
    checklistPost: ['Abrir Outlook Classic y comprobar si aparece Reunión de Teams.', 'Revisar complementos COM si no aparece.'],
    rollback: 'Restaurar el perfil de usuario o eliminar claves HKCU añadidas si una política corporativa las gestiona.',
    batBody: (v) => `${v.closeApps ? `echo Cerrando Outlook y Teams...
taskkill /IM OUTLOOK.EXE /F >nul 2>&1
taskkill /IM ms-teams.exe /F >nul 2>&1
taskkill /IM msteams.exe /F >nul 2>&1
taskkill /IM Teams.exe /F >nul 2>&1
timeout /t 5 /nobreak >nul` : 'echo No se cierran Outlook ni Teams por configuracion.'}
set "OFFICEBITNESS=x64"
set "REGSVR=%SystemRoot%\\System32\\regsvr32.exe"
reg query "HKLM\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration" /v Platform 2>nul | findstr /i "x86" >nul
if %errorlevel% equ 0 (
    set "OFFICEBITNESS=x86"
    set "REGSVR=%SystemRoot%\\SysWOW64\\regsvr32.exe"
)
set "ADDINROOT=%LOCALAPPDATA%\\Microsoft\\TeamsMeetingAdd-in"
set "ADDINPATH="
if not exist "%ADDINROOT%" (
    echo [ERROR] No existe %ADDINROOT%. Abre Teams, espera unos minutos y repite.
    exit /b 1
)
for /f "delims=" %%D in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -Path $env:LOCALAPPDATA\\Microsoft\\TeamsMeetingAdd-in -Directory | Sort-Object {[version]$_.Name} -Descending | Select-Object -ExpandProperty Name" 2^>nul') do (
    if exist "%ADDINROOT%\\%%D\\%OFFICEBITNESS%\\Microsoft.Teams.AddinLoader.dll" (
        if not defined ADDINPATH set "ADDINPATH=%ADDINROOT%\\%%D\\%OFFICEBITNESS%"
    )
)
if not defined ADDINPATH (
    echo [ERROR] No se encontro Microsoft.Teams.AddinLoader.dll para %OFFICEBITNESS%.
    exit /b 1
)
${v.clearTeamsSharedConfig ? `set "TSC=%LOCALAPPDATA%\\Publishers\\8wekyb3d8bbwe\\TeamsSharedConfig"
if exist "%TSC%" rmdir /s /q "%TSC%" >nul 2>&1` : ''}
reg add "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" /v LoadBehavior /t REG_DWORD /d 3 /f
reg add "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" /v FriendlyName /t REG_SZ /d "Microsoft Teams Meeting Add-in for Microsoft Office" /f
reg add "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" /v Description /t REG_SZ /d "Microsoft Teams Meeting Add-in for Microsoft Office" /f
reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DoNotDisableAddinList" /v TeamsAddin.FastConnect /t REG_DWORD /d 1 /f
${v.clearOutlookResiliency ? `reg delete "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DisabledItems" /f >nul 2>&1
reg delete "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\CrashingAddinList" /f >nul 2>&1` : ''}
"%REGSVR%" /s /n /i:user "%ADDINPATH%\\Microsoft.Teams.AddinLoader.dll"
if %errorlevel% neq 0 echo [AVISO] regsvr32 devolvio errorlevel %errorlevel%.
${v.openAppsAfter ? `start "" "ms-teams:"
timeout /t 20 /nobreak >nul
start "" outlook.exe` : ''}
echo [OK] Reparacion avanzada finalizada.`,
    ps1Body: (v) => `Write-Log "Reparacion avanzada de Teams Meeting Add-in"
${v.closeApps ? `"OUTLOOK","ms-teams","msteams","Teams" | ForEach-Object { Get-Process $_ -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }` : ''}
$platform = (Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration" -ErrorAction SilentlyContinue).Platform
$bitness = if ($platform -match "x86") { "x86" } else { "x64" }
$regsvr = if ($bitness -eq "x86") { "$env:windir\\SysWOW64\\regsvr32.exe" } else { "$env:windir\\System32\\regsvr32.exe" }
$root = Join-Path $env:LOCALAPPDATA "Microsoft\\TeamsMeetingAdd-in"
if (-not (Test-Path $root)) { throw "No existe $root. Abre Teams y espera unos minutos." }
$addin = Get-ChildItem $root -Directory | Sort-Object {[version]$_.Name} -Descending | ForEach-Object {
    $candidate = Join-Path $_.FullName "$bitness\\Microsoft.Teams.AddinLoader.dll"
    if (Test-Path $candidate) { $candidate }
} | Select-Object -First 1
if (-not $addin) { throw "No se encontro DLL del add-in para $bitness" }
${v.clearTeamsSharedConfig ? `$tsc = Join-Path $env:LOCALAPPDATA "Publishers\\8wekyb3d8bbwe\\TeamsSharedConfig"
if (Test-Path $tsc -and -not $DryRun) { Remove-Item $tsc -Recurse -Force -ErrorAction SilentlyContinue }` : ''}
if (-not $DryRun) {
    New-Item "HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" -Force | Out-Null
    Set-ItemProperty "HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" -Name LoadBehavior -Type DWord -Value 3
    Set-ItemProperty "HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" -Name FriendlyName -Value "Microsoft Teams Meeting Add-in for Microsoft Office"
    Set-ItemProperty "HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" -Name Description -Value "Microsoft Teams Meeting Add-in for Microsoft Office"
    New-Item "HKCU:\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DoNotDisableAddinList" -Force | Out-Null
    Set-ItemProperty "HKCU:\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DoNotDisableAddinList" -Name TeamsAddin.FastConnect -Type DWord -Value 1
    ${v.clearOutlookResiliency ? `Remove-Item "HKCU:\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DisabledItems" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "HKCU:\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\CrashingAddinList" -Recurse -Force -ErrorAction SilentlyContinue` : ''}
    Start-Process $regsvr -ArgumentList "/s /n /i:user \`"$addin\`"" -Wait
}
Write-Log "Add-in procesado: $addin"
${v.openAppsAfter ? `if (-not $DryRun) { Start-Process "ms-teams:"; Start-Sleep -Seconds 20; Start-Process outlook.exe }` : ''}`
  });

  add({
    id: 'office-total-cleanup-controlled',
    name: 'Limpieza total controlada de Office',
    category: 'Office',
    icon: '🧨',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Plantilla de último recurso para limpiar restos de Office/ClickToRun con logging y confirmación.',
    fields: [
      { key: 'removeFolders', label: 'Eliminar carpetas Office/ClickToRun', type: 'checkbox', default: true },
      { key: 'removeTasks', label: 'Eliminar tareas programadas Office', type: 'checkbox', default: true },
      { key: 'removeServices', label: 'Detener/eliminar servicios Office', type: 'checkbox', default: false },
      { key: 'removeShortcuts', label: 'Eliminar accesos directos Office', type: 'checkbox', default: true }
    ],
    riskNotes: ['Desinstalación/limpieza agresiva: puede dejar Office inutilizable hasta reinstalar.', 'Usar solo si una reparación normal de Office no funciona.'],
    checklistPre: ['Crear punto de restauración.', 'Confirmar que hay instalador/licencia para reinstalar Office.', 'Cerrar todas las apps Office y Teams.'],
    checklistPost: ['Reiniciar equipo.', 'Reinstalar Microsoft 365 Apps si aplica.', 'Validar activación.'],
    rollback: 'Restaurar punto de restauración o reinstalar Office/Microsoft 365 Apps.',
    batBody: (v) => `echo Cerrando procesos Office/Teams...
for %%P in (WINWORD.EXE EXCEL.EXE POWERPNT.EXE OUTLOOK.EXE ONENOTE.EXE MSACCESS.EXE VISIO.EXE PROJECT.EXE LYNC.EXE TEAMS.EXE MSTEAMS.EXE OfficeClickToRun.exe appvlp.exe) do taskkill /f /im %%P >nul 2>&1
${v.removeServices ? `echo Deteniendo servicios Office...
for %%S in (ClickToRunSvc OfficeSvc osppsvc) do (
  sc stop %%S >nul 2>&1
  sc delete %%S >nul 2>&1
)` : 'echo No se eliminan servicios por configuracion.'}
${v.removeTasks ? `echo Eliminando tareas programadas Office...
schtasks /delete /tn "\\Microsoft\\Office\\Office Automatic Updates 2.0" /f >nul 2>&1
schtasks /delete /tn "\\Microsoft\\Office\\Office ClickToRun Service Monitor" /f >nul 2>&1
schtasks /delete /tn "\\Microsoft\\Office\\OfficeTelemetryAgentFallBack2016" /f >nul 2>&1
schtasks /delete /tn "\\Microsoft\\Office\\OfficeTelemetryAgentLogOn2016" /f >nul 2>&1
schtasks /delete /tn "\\Microsoft\\Office\\Office Feature Updates" /f >nul 2>&1` : ''}
${v.removeFolders ? `echo Eliminando carpetas Office/ClickToRun...
for %%D in ("C:\\Program Files\\Microsoft Office" "C:\\Program Files (x86)\\Microsoft Office" "C:\\Program Files\\Common Files\\Microsoft Shared\\Office16" "C:\\Program Files\\Common Files\\Microsoft Shared\\ClickToRun" "C:\\ProgramData\\Microsoft\\Office" "C:\\ProgramData\\Microsoft\\ClickToRun" "C:\\MSOCache" "%LocalAppData%\\Microsoft\\Office" "%AppData%\\Microsoft\\Office") do (
  if exist %%~D (
    takeown /f %%~D /r /d y >nul 2>&1
    icacls %%~D /grant administrators:F /t /c >nul 2>&1
    rd /s /q %%~D >nul 2>&1
  )
)` : ''}
${v.removeShortcuts ? `echo Eliminando accesos directos Office...
for %%D in ("%ProgramData%\\Microsoft\\Windows\\Start Menu\\Programs" "%AppData%\\Microsoft\\Windows\\Start Menu\\Programs" "%Public%\\Desktop" "%UserProfile%\\Desktop") do (
  del /f /q "%%~D\\*Word*.lnk" "%%~D\\*Excel*.lnk" "%%~D\\*PowerPoint*.lnk" "%%~D\\*Outlook*.lnk" >nul 2>&1
)` : ''}
echo [OK] Limpieza finalizada. Reinicia antes de reinstalar Office.`,
    ps1Body: (v) => `$procs = "WINWORD","EXCEL","POWERPNT","OUTLOOK","ONENOTE","MSACCESS","VISIO","PROJECT","LYNC","TEAMS","MSTEAMS","OfficeClickToRun","appvlp"
$procs | ForEach-Object { Get-Process $_ -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }
${v.removeServices ? `$services = "ClickToRunSvc","OfficeSvc","osppsvc"
foreach ($s in $services) { if (-not $DryRun) { Stop-Service $s -Force -ErrorAction SilentlyContinue; sc.exe delete $s | Out-Null } }` : 'Write-Log "No se eliminan servicios por configuracion."'}
${v.removeFolders ? `$folders = @("$env:ProgramFiles\\Microsoft Office", "${'${env:ProgramFiles(x86)'}\\Microsoft Office", "$env:ProgramFiles\\Common Files\\Microsoft Shared\\Office16", "$env:ProgramFiles\\Common Files\\Microsoft Shared\\ClickToRun", "$env:ProgramData\\Microsoft\\Office", "$env:ProgramData\\Microsoft\\ClickToRun", "C:\\MSOCache", "$env:LOCALAPPDATA\\Microsoft\\Office", "$env:APPDATA\\Microsoft\\Office")
foreach ($f in $folders) { if (Test-Path $f) { Write-Log "Eliminando $f"; if (-not $DryRun) { Remove-Item $f -Recurse -Force -ErrorAction SilentlyContinue } } }` : ''}
Write-Log "Limpieza Office finalizada. Reinicia antes de reinstalar."`
  });

  add({
    id: 'open-windows-optional-updates',
    name: 'Abrir actualizaciones opcionales',
    category: 'Windows Update',
    icon: '🪟',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Abre directamente la pantalla de actualizaciones opcionales de Windows.',
    fields: [
      { key: 'elevate', label: 'Intentar relanzar con permisos de administrador', type: 'checkbox', default: false }
    ],
    riskNotes: ['No instala nada por sí mismo; solo abre Configuración.'],
    checklistPre: ['Guardar trabajo antes de instalar drivers opcionales.'],
    checklistPost: ['Reiniciar si Windows lo solicita.'],
    rollback: null,
    batBody: (v) => `${v.elevate ? `net session >nul 2>&1
if %errorlevel% neq 0 (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)` : ''}
start ms-settings:windowsupdate-optionalupdates`,
    ps1Body: (v) => `Start-Process "ms-settings:windowsupdate-optionalupdates"`
  });

  add({
    id: 'windows-update-direct-internet-reset',
    name: 'Windows Update directo a Internet',
    category: 'Windows Update',
    icon: '🌐',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Desactiva proxy de usuario, elimina política WindowsUpdate y abre Windows Update. Útil solo en escenarios controlados.',
    fields: [
      { key: 'killVpnProcess', label: 'Cerrar proceso VPN/red corporativa opcional', type: 'checkbox', default: false },
      { key: 'vpnProcess', label: 'Proceso VPN a cerrar', type: 'text', default: 'dsNetworkConnect.exe' },
      { key: 'stopSccm', label: 'Detener cliente SCCM/CcmExec temporalmente', type: 'checkbox', default: false }
    ],
    riskNotes: ['Elimina políticas locales de Windows Update.', 'Puede saltarse mecanismos corporativos si se usa fuera de procedimiento autorizado.'],
    checklistPre: ['Usar solo con autorización del entorno IT.', 'Exportar clave WindowsUpdate si se quiere rollback.'],
    checklistPost: ['Reaplicar políticas con gpupdate /force o reiniciar si aplica.'],
    rollback: 'gpupdate /force, reinicio o restauración de políticas corporativas.',
    batBody: (v) => `${v.killVpnProcess ? `taskkill /f /im "${v.vpnProcess || 'dsNetworkConnect.exe'}" 2>nul` : ''}
taskkill /f /im "SystemSettings.exe" 2>nul
reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f
net stop wuauserv
reg delete "HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" /f
net start wuauserv
${v.stopSccm ? 'net stop CcmExec >nul 2>&1' : ''}
explorer ms-settings:windowsupdate-action`,
    ps1Body: (v) => `${v.killVpnProcess ? `Get-Process "${(v.vpnProcess || 'dsNetworkConnect.exe').replace('.exe','')}" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue` : ''}
Set-ItemProperty "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyEnable -Type DWord -Value 0
Stop-Service wuauserv -Force -ErrorAction SilentlyContinue
if (-not $DryRun) { Remove-Item "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate" -Recurse -Force -ErrorAction SilentlyContinue }
Start-Service wuauserv -ErrorAction SilentlyContinue
${v.stopSccm ? 'Stop-Service CcmExec -Force -ErrorAction SilentlyContinue' : ''}
Start-Process "ms-settings:windowsupdate-action"`
  });

  // ============================================================
  // SCCM / INTUNE / CORPORATIVO
  // ============================================================

  add({
    id: 'sccm-client-reinstall-from-share',
    name: 'Reinstalar cliente SCCM desde recurso de red',
    category: 'SCCM',
    icon: '🏢',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Desinstala, limpia restos y reinstala SCCM/ConfigMgr desde una ruta de red configurable.',
    fields: [
      { key: 'sharePath', label: 'Ruta UNC con ccmsetup.exe', type: 'text', default: '\\\\servidor\\SCCMCLIENT' },
      { key: 'siteCode', label: 'Código de sitio SCCM', type: 'text', default: 'P01' },
      { key: 'mapDrive', label: 'Letra temporal para mapear', type: 'text', default: 'W:' },
      { key: 'useCredentials', label: 'Pedir credenciales para el recurso', type: 'checkbox', default: true },
      { key: 'restartBetween', label: 'Programar reinicio entre desinstalación e instalación', type: 'checkbox', default: false }
    ],
    riskNotes: ['Desinstala y reinstala agente corporativo SCCM.', 'Puede afectar a inventario, despliegues y cumplimiento hasta que vuelva a registrar.'],
    checklistPre: ['Validar ruta UNC y permisos.', 'Confirmar código de sitio.', 'Ejecutar en ventana de mantenimiento si reinicia.'],
    checklistPost: ['Comprobar servicio CcmExec.', 'Revisar C:\\Windows\\ccmsetup\\Logs\\ccmsetup.log.', 'Forzar acciones cliente si aplica.'],
    rollback: 'Reinstalar cliente SCCM con parámetros corporativos correctos o restaurar imagen/procedimiento oficial.',
    batBody: (v) => `set "DRIVE=${v.mapDrive || 'W:'}"
set "SHARE=${v.sharePath || '\\\\servidor\\SCCMCLIENT'}"
set "SITECODE=${v.siteCode || 'P01'}"
net use "%DRIVE%" /delete /y >nul 2>&1
${v.useCredentials ? `set /p TECHUSER="Usuario para recurso de red (DOMINIO\\usuario): "
net use "%DRIVE%" "%SHARE%" /user:"%TECHUSER%" * /persistent:no` : `net use "%DRIVE%" "%SHARE%" /persistent:no`}
if %errorlevel% neq 0 (
  echo [ERROR] No se pudo conectar al recurso SCCM.
  exit /b 1
)
echo Desinstalando SCCM...
start /wait "%DRIVE%\\ccmsetup.exe" /uninstall
${v.restartBetween ? `reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce" /v "SF404_SCCM_INSTALL" /t REG_SZ /d "cmd /c %~f0" /f
echo Reiniciando para continuar...
shutdown -r -t 10
exit /b` : ''}
echo Limpiando restos SCCM...
for %%D in ("%SystemDrive%\\SMSTSLog" "%SystemDrive%\\_SMSTaskSequence" "%windir%\\CCM" "%windir%\\ccmcache" "%windir%\\ccmsetup") do rd %%D /s /q 2>nul
del "%windir%\\SMSCFG.INI" /q 2>nul
echo Instalando SCCM...
start /wait "%DRIVE%\\ccmsetup.exe" SMSSITECODE=%SITECODE%
net use "%DRIVE%" /delete /y
echo [OK] Proceso SCCM lanzado. Revisa ccmsetup.log.`,
    ps1Body: (v) => `$Drive = "${(v.mapDrive || 'W:').replace(':','')}"
$Share = "${v.sharePath || '\\\\servidor\\SCCMCLIENT'}"
$SiteCode = "${v.siteCode || 'P01'}"
if (-not $DryRun) {
    Remove-PSDrive -Name $Drive -Force -ErrorAction SilentlyContinue
    ${v.useCredentials ? '$cred = Get-Credential -Message "Credenciales para recurso SCCM"\n    New-PSDrive -Name $Drive -PSProvider FileSystem -Root $Share -Credential $cred | Out-Null' : 'New-PSDrive -Name $Drive -PSProvider FileSystem -Root $Share | Out-Null'}
    $setup = "$Drive\`:\\ccmsetup.exe"
    Start-Process $setup -ArgumentList "/uninstall" -Wait
    $paths = @("$env:SystemDrive\\SMSTSLog","$env:SystemDrive\\_SMSTaskSequence","$env:windir\\CCM","$env:windir\\ccmcache","$env:windir\\ccmsetup")
    foreach ($p in $paths) { Remove-Item $p -Recurse -Force -ErrorAction SilentlyContinue }
    Remove-Item "$env:windir\\SMSCFG.INI" -Force -ErrorAction SilentlyContinue
    Start-Process $setup -ArgumentList "SMSSITECODE=$SiteCode" -Wait
    Remove-PSDrive -Name $Drive -Force -ErrorAction SilentlyContinue
}
Write-Log "Proceso SCCM finalizado. Revisa ccmsetup.log."`
  });

  add({
    id: 'sccm-client-actions-trigger',
    name: 'Forzar acciones cliente SCCM',
    category: 'SCCM',
    icon: '🔁',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Lanza ciclos comunes del cliente SCCM/ConfigMgr mediante WMI/CIM.',
    fields: [
      { key: 'machinePolicy', label: 'Machine Policy Retrieval & Evaluation', type: 'checkbox', default: true },
      { key: 'hardwareInventory', label: 'Hardware Inventory', type: 'checkbox', default: true },
      { key: 'softwareUpdates', label: 'Software Updates Scan', type: 'checkbox', default: true }
    ],
    riskNotes: ['Puede aumentar carga temporal en cliente/servidor SCCM.'],
    checklistPre: ['Comprobar que el servicio CcmExec está iniciado.'],
    checklistPost: ['Revisar logs SCCM en C:\\Windows\\CCM\\Logs.'],
    rollback: null,
    batBody: (v) => `sc query CcmExec
${v.machinePolicy ? 'powershell -NoProfile -Command "Invoke-CimMethod -Namespace root\\ccm -ClassName SMS_Client -MethodName TriggerSchedule -Arguments @{sScheduleID=\'{00000000-0000-0000-0000-000000000021}\'}"' : ''}
${v.hardwareInventory ? 'powershell -NoProfile -Command "Invoke-CimMethod -Namespace root\\ccm -ClassName SMS_Client -MethodName TriggerSchedule -Arguments @{sScheduleID=\'{00000000-0000-0000-0000-000000000001}\'}"' : ''}
${v.softwareUpdates ? 'powershell -NoProfile -Command "Invoke-CimMethod -Namespace root\\ccm -ClassName SMS_Client -MethodName TriggerSchedule -Arguments @{sScheduleID=\'{00000000-0000-0000-0000-000000000113}\'}"' : ''}`,
    ps1Body: (v) => `Get-Service CcmExec -ErrorAction SilentlyContinue | Format-List | Out-String | Write-Log
${v.machinePolicy ? `Invoke-CimMethod -Namespace root\\ccm -ClassName SMS_Client -MethodName TriggerSchedule -Arguments @{sScheduleID='{00000000-0000-0000-0000-000000000021}'} | Out-Null` : ''}
${v.hardwareInventory ? `Invoke-CimMethod -Namespace root\\ccm -ClassName SMS_Client -MethodName TriggerSchedule -Arguments @{sScheduleID='{00000000-0000-0000-0000-000000000001}'} | Out-Null` : ''}
${v.softwareUpdates ? `Invoke-CimMethod -Namespace root\\ccm -ClassName SMS_Client -MethodName TriggerSchedule -Arguments @{sScheduleID='{00000000-0000-0000-0000-000000000113}'} | Out-Null` : ''}
Write-Log "Acciones SCCM solicitadas."`
  });

  add({
    id: 'intune-sync-company-portal',
    name: 'Forzar sincronización Intune/MDM',
    category: 'Intune',
    icon: '☁️',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Abre sincronización de cuenta laboral y recoge estado básico MDM/Autopilot.',
    fields: [
      { key: 'openSettings', label: 'Abrir página de cuentas trabajo/escuela', type: 'checkbox', default: true },
      { key: 'runDsregcmd', label: 'Ejecutar dsregcmd /status', type: 'checkbox', default: true }
    ],
    riskNotes: ['No cambia políticas directamente, pero puede disparar sincronización del dispositivo.'],
    checklistPre: ['Equipo conectado a Internet y usuario con sesión corporativa.'],
    checklistPost: ['Revisar Portal de Empresa / Intune si la sincronización no baja políticas.'],
    rollback: null,
    batBody: (v) => `${v.runDsregcmd ? 'dsregcmd /status' : ''}
${v.openSettings ? 'start ms-settings:workplace' : ''}
echo Para sincronizacion manual: Configuracion > Cuentas > Acceso al trabajo o escuela > Info > Sincronizar.`,
    ps1Body: (v) => `${v.runDsregcmd ? `dsregcmd /status | Out-String | Write-Log` : ''}
${v.openSettings ? `Start-Process "ms-settings:workplace"` : ''}
Write-Log "Revisar sincronizacion desde Acceso al trabajo o escuela."`
  });

  // ============================================================
  // SOFTWARE / DESINSTALACION / INVENTARIO
  // ============================================================

  add({
    id: 'software-uninstall-by-name-safe',
    name: 'Desinstalar software por nombre',
    category: 'Software',
    icon: '🗑️',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Busca software instalado por nombre y permite desinstalar con MSI/WMI o cadena de desinstalación.',
    fields: [
      { key: 'searchName', label: 'Texto a buscar en el nombre del software', type: 'text', default: 'NombreSoftware' },
      { key: 'method', label: 'Método', type: 'select', options: ['listar', 'msi-wmic', 'registry-uninstall-string'], default: 'listar' }
    ],
    riskNotes: ['Desinstalar software puede afectar al usuario o a componentes corporativos.', 'WMIC product puede ser lento y activar reparación MSI en algunos equipos.'],
    checklistPre: ['Confirmar software exacto con el usuario.', 'Cerrar el programa antes de desinstalar.'],
    checklistPost: ['Reiniciar si lo solicita.', 'Comprobar que el software ya no aparece en Programas.'],
    rollback: 'Reinstalar desde fuente oficial/corporativa.',
    batBody: (v) => `set "QUERY=${v.searchName || 'NombreSoftware'}"
echo Buscando software: %QUERY%
wmic product where "Name like '%%%QUERY%%% '" get Name,Version,Vendor 2>nul
powershell -NoProfile -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like '*%QUERY%*' } | Select-Object DisplayName,DisplayVersion,Publisher,UninstallString | Format-List"
${v.method === 'msi-wmic' ? `set /p CONF="Escribe SI para intentar desinstalar coincidencias MSI: "
if "%CONF%"=="SI" wmic product where "Name like '%%%QUERY%%% '" call uninstall /nointeractive` : ''}
${v.method === 'registry-uninstall-string' ? `echo Usa el UninstallString mostrado arriba. Esta plantilla no ejecuta automaticamente cadenas no verificadas.` : ''}`,
    ps1Body: (v) => `$Query = "${v.searchName || 'NombreSoftware'}"
$items = Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like "*$Query*" }
$items | Select-Object DisplayName,DisplayVersion,Publisher,UninstallString | Format-List | Out-String | Write-Log
${v.method === 'msi-wmic' ? `Write-Log "Metodo MSI/WMIC seleccionado. Revisa coincidencias antes de ejecutar en produccion."` : ''}
${v.method === 'registry-uninstall-string' ? `Write-Log "Metodo registry-uninstall-string: no se ejecuta automaticamente por seguridad."` : ''}`
  });

  add({
    id: 'software-list-installed-csv',
    name: 'Exportar software instalado a CSV',
    category: 'Software',
    icon: '📦',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Genera listado de software instalado desde claves Uninstall en CSV.',
    fields: [
      { key: 'outputPath', label: 'Ruta CSV', type: 'text', default: '%USERPROFILE%\\Desktop\\software_instalado.csv' }
    ],
    riskNotes: ['Solo lectura.'],
    checklistPre: ['Ninguno.'],
    checklistPost: ['Adjuntar CSV al ticket si aplica.'],
    rollback: null,
    batBody: (v) => `powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Where-Object DisplayName | Select DisplayName,DisplayVersion,Publisher,InstallDate | Sort DisplayName | Export-Csv -NoTypeInformation -Encoding UTF8 '${v.outputPath || '%USERPROFILE%\\Desktop\\software_instalado.csv'}'"
echo CSV generado en ${v.outputPath || '%USERPROFILE%\\Desktop\\software_instalado.csv'}`,
    ps1Body: (v) => `$Out = "${v.outputPath || '$env:USERPROFILE\\Desktop\\software_instalado.csv'}"
Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue |
Where-Object DisplayName | Select-Object DisplayName,DisplayVersion,Publisher,InstallDate | Sort-Object DisplayName |
Export-Csv -Path $Out -NoTypeInformation -Encoding UTF8
Write-Log "CSV generado: $Out"`
  });

  add({
    id: 'install-msi-or-exe-from-share',
    name: 'Instalar MSI/EXE desde recurso de red',
    category: 'Software',
    icon: '⬇️',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Instala un paquete MSI o EXE desde una ruta local/UNC con argumentos configurables.',
    fields: [
      { key: 'installerPath', label: 'Ruta instalador MSI/EXE', type: 'text', default: '\\\\servidor\\software\\setup.msi' },
      { key: 'arguments', label: 'Argumentos silenciosos', type: 'text', default: '/qn /norestart' },
      { key: 'kind', label: 'Tipo', type: 'select', options: ['msi', 'exe'], default: 'msi' }
    ],
    riskNotes: ['Instala software con permisos elevados.', 'Usar solo paquetes de origen confiable.'],
    checklistPre: ['Verificar hash/firma del instalador.', 'Confirmar compatibilidad con el equipo.'],
    checklistPost: ['Comprobar instalación y reinicio pendiente.'],
    rollback: 'Desinstalar paquete desde Programas o línea de comandos del fabricante.',
    batBody: (v) => `set "INSTALLER=${v.installerPath || '\\\\servidor\\software\\setup.msi'}"
if not exist "%INSTALLER%" (
  echo [ERROR] No existe %INSTALLER%
  exit /b 1
)
${v.kind === 'msi' ? `msiexec /i "%INSTALLER%" ${v.arguments || '/qn /norestart'}` : `start /wait "" "%INSTALLER%" ${v.arguments || '/quiet /norestart'}`}
if %errorlevel% neq 0 echo [AVISO] Instalador devolvio errorlevel %errorlevel%`,
    ps1Body: (v) => `$Installer = "${v.installerPath || '\\\\servidor\\software\\setup.msi'}"
if (-not (Test-Path $Installer)) { throw "No existe $Installer" }
${v.kind === 'msi' ? `Start-Process msiexec.exe -ArgumentList "/i \`"$Installer\`" ${v.arguments || '/qn /norestart'}" -Wait` : `Start-Process $Installer -ArgumentList "${v.arguments || '/quiet /norestart'}" -Wait`}
Write-Log "Instalador finalizado."`
  });

  // ============================================================
  // SISTEMA / RED / ENERGIA
  // ============================================================

  add({
    id: 'safe-shutdown-restart',
    name: 'Apagado o reinicio seguro',
    category: 'Energia',
    icon: '⏻',
    risk: 'alto',
    requiresAdmin: false,
    description: 'Genera un BAT/PS1 de apagado, reinicio o cancelación con temporizador y mensaje.',
    fields: [
      { key: 'action', label: 'Acción', type: 'select', options: ['apagar', 'reiniciar', 'cancelar'], default: 'apagar' },
      { key: 'seconds', label: 'Segundos de espera', type: 'number', default: 0 },
      { key: 'message', label: 'Mensaje al usuario', type: 'text', default: 'Mantenimiento del sistema' }
    ],
    riskNotes: ['Apaga o reinicia el equipo y puede interrumpir trabajo abierto.'],
    checklistPre: ['Guardar trabajo abierto.', 'Avisar al usuario.'],
    checklistPost: ['Validar que el equipo vuelve correctamente si era reinicio.'],
    rollback: 'Usar shutdown /a antes de que venza el temporizador.',
    batBody: (v) => `${v.action === 'cancelar' ? 'shutdown.exe /a' : `shutdown.exe ${v.action === 'reiniciar' ? '-r' : '-s'} -t ${Number(v.seconds || 0)} -c "${v.message || 'Mantenimiento del sistema'}"`}`,
    ps1Body: (v) => `${v.action === 'cancelar' ? `shutdown.exe /a` : `shutdown.exe ${v.action === 'reiniciar' ? '-r' : '-s'} -t ${Number(v.seconds || 0)} -c "${v.message || 'Mantenimiento del sistema'}"`}`
  });

  add({
    id: 'set-power-plan',
    name: 'Cambiar plan de energía',
    category: 'Energia',
    icon: '🔋',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Activa alto rendimiento, equilibrado o ahorro de energía mediante powercfg.',
    fields: [
      { key: 'plan', label: 'Plan', type: 'select', options: ['equilibrado', 'alto-rendimiento', 'ahorro'], default: 'equilibrado' }
    ],
    riskNotes: ['Cambia comportamiento energético y consumo/batería.'],
    checklistPre: ['Adecuar al tipo de equipo: portátil/sobremesa.'],
    checklistPost: ['Verificar plan activo con powercfg /getactivescheme.'],
    rollback: 'Volver a plan equilibrado.',
    batBody: (v) => `set "GUID=381b4222-f694-41f0-9685-ff5bb260df2e"
if "${v.plan}"=="alto-rendimiento" set "GUID=8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"
if "${v.plan}"=="ahorro" set "GUID=a1841308-3541-4fab-bc81-f71556f20b4a"
powercfg /setactive %GUID%
powercfg /getactivescheme`,
    ps1Body: (v) => `$guid = "381b4222-f694-41f0-9685-ff5bb260df2e"
if ("${v.plan}" -eq "alto-rendimiento") { $guid = "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c" }
if ("${v.plan}" -eq "ahorro") { $guid = "a1841308-3541-4fab-bc81-f71556f20b4a" }
powercfg /setactive $guid
powercfg /getactivescheme | Out-String | Write-Log`
  });

  add({
    id: 'windows-repair-dism-sfc',
    name: 'Reparar Windows con DISM y SFC',
    category: 'Sistema',
    icon: '🛠️',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Ejecuta DISM RestoreHealth y SFC /scannow con log.',
    fields: [
      { key: 'runDism', label: 'Ejecutar DISM /RestoreHealth', type: 'checkbox', default: true },
      { key: 'runSfc', label: 'Ejecutar SFC /scannow', type: 'checkbox', default: true }
    ],
    riskNotes: ['Repara componentes del sistema; puede tardar bastante.'],
    checklistPre: ['Conectar a corriente si es portátil.', 'No apagar durante el proceso.'],
    checklistPost: ['Reiniciar si encuentra reparaciones.', 'Revisar CBS.log si persisten errores.'],
    rollback: null,
    batBody: (v) => `${v.runDism ? 'DISM /Online /Cleanup-Image /RestoreHealth' : ''}
${v.runSfc ? 'sfc /scannow' : ''}`,
    ps1Body: (v) => `${v.runDism ? `Start-Process DISM.exe -ArgumentList "/Online /Cleanup-Image /RestoreHealth" -Wait -NoNewWindow` : ''}
${v.runSfc ? `Start-Process sfc.exe -ArgumentList "/scannow" -Wait -NoNewWindow` : ''}`
  });

  add({
    id: 'restart-explorer-shell',
    name: 'Reiniciar Explorer y shell Windows',
    category: 'Sistema',
    icon: '🧭',
    risk: 'medio',
    requiresAdmin: false,
    description: 'Reinicia explorer.exe para resolver bloqueos de barra de tareas, escritorio o iconos.',
    fields: [
      { key: 'clearIconCache', label: 'Limpiar caché de iconos antes de reiniciar', type: 'checkbox', default: false }
    ],
    riskNotes: ['Cierra ventanas de Explorador abiertas.'],
    checklistPre: ['Guardar rutas abiertas importantes.'],
    checklistPost: ['Comprobar barra de tareas e iconos.'],
    rollback: 'Volver a iniciar explorer.exe manualmente si no arranca.',
    batBody: (v) => `taskkill /f /im explorer.exe
${v.clearIconCache ? 'del /f /q "%LOCALAPPDATA%\\IconCache.db" >nul 2>&1' : ''}
start explorer.exe`,
    ps1Body: (v) => `Get-Process explorer -ErrorAction SilentlyContinue | Stop-Process -Force
${v.clearIconCache ? `Remove-Item "$env:LOCALAPPDATA\\IconCache.db" -Force -ErrorAction SilentlyContinue` : ''}
Start-Process explorer.exe`
  });

  add({
    id: 'proxy-enable-disable',
    name: 'Activar/desactivar proxy Windows',
    category: 'Red',
    icon: '🧱',
    risk: 'alto',
    requiresAdmin: false,
    description: 'Cambia ProxyEnable y ProxyServer del usuario actual.',
    fields: [
      { key: 'mode', label: 'Acción', type: 'select', options: ['desactivar', 'activar'], default: 'desactivar' },
      { key: 'proxyServer', label: 'Proxy servidor:puerto', type: 'text', default: 'proxy.empresa.local:8080' }
    ],
    riskNotes: ['Puede dejar al usuario sin acceso a Internet/intranet si se configura mal.'],
    checklistPre: ['Anotar configuración anterior.', 'Confirmar si la empresa usa PAC/proxy gestionado.'],
    checklistPost: ['Probar navegador y aplicaciones corporativas.'],
    rollback: 'Volver a activar/desactivar con los valores correctos o aplicar GPO. ',
    batBody: (v) => `${v.mode === 'desactivar' ? `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f` : `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f
reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer /t REG_SZ /d "${v.proxyServer || 'proxy.empresa.local:8080'}" /f`}
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 8`,
    ps1Body: (v) => `${v.mode === 'desactivar' ? `Set-ItemProperty "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyEnable -Type DWord -Value 0` : `Set-ItemProperty "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyEnable -Type DWord -Value 1
Set-ItemProperty "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" -Name ProxyServer -Value "${v.proxyServer || 'proxy.empresa.local:8080'}"`}
Write-Log "Proxy actualizado."`
  });

  add({
    id: 'gpupdate-and-policy-report',
    name: 'Actualizar políticas y generar GPResult',
    category: 'Sistema',
    icon: '📜',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Ejecuta gpupdate /force y genera informe HTML de políticas aplicadas.',
    fields: [
      { key: 'outputPath', label: 'Ruta informe HTML', type: 'text', default: '%USERPROFILE%\\Desktop\\gpresult.html' },
      { key: 'force', label: 'Forzar actualización de políticas', type: 'checkbox', default: true }
    ],
    riskNotes: ['Puede aplicar cambios de GPO inmediatamente.'],
    checklistPre: ['Guardar trabajo si GPO puede requerir cierre de sesión/reinicio.'],
    checklistPost: ['Abrir informe HTML y revisar GPOs aplicadas.'],
    rollback: 'Depende de la política aplicada; normalmente se gestiona desde dominio/MDM.',
    batBody: (v) => `${v.force ? 'gpupdate /force' : 'gpupdate'}
gpresult /h "${v.outputPath || '%USERPROFILE%\\Desktop\\gpresult.html'}" /f
start "" "${v.outputPath || '%USERPROFILE%\\Desktop\\gpresult.html'}"`,
    ps1Body: (v) => `${v.force ? 'gpupdate /force | Out-String | Write-Log' : 'gpupdate | Out-String | Write-Log'}
$Out = "${v.outputPath || '$env:USERPROFILE\\Desktop\\gpresult.html'}"
gpresult /h $Out /f
Start-Process $Out`
  });

  add({
    id: 'eventlog-export-support',
    name: 'Exportar logs de eventos para soporte',
    category: 'Logs CAU',
    icon: '📚',
    risk: 'bajo',
    requiresAdmin: true,
    description: 'Exporta eventos recientes de Sistema y Aplicación a EVTX/TXT para análisis.',
    fields: [
      { key: 'days', label: 'Días hacia atrás', type: 'number', default: 3 },
      { key: 'targetDir', label: 'Carpeta destino', type: 'text', default: '%USERPROFILE%\\Desktop\\Logs_Soporte' }
    ],
    riskNotes: ['Solo exporta información; puede contener datos técnicos sensibles.'],
    checklistPre: ['Asegurar que el usuario autoriza recopilar logs.'],
    checklistPost: ['Comprimir carpeta y adjuntar al ticket.'],
    rollback: 'Eliminar la carpeta exportada si ya no se necesita.',
    batBody: (v) => `set "OUT=${v.targetDir || '%USERPROFILE%\\Desktop\\Logs_Soporte'}"
if not exist "%OUT%" mkdir "%OUT%"
wevtutil epl System "%OUT%\\System.evtx"
wevtutil epl Application "%OUT%\\Application.evtx"
powershell -NoProfile -Command "Get-WinEvent -FilterHashtable @{LogName='System'; StartTime=(Get-Date).AddDays(-${Number(v.days || 3)})} | Select TimeCreated,Id,ProviderName,LevelDisplayName,Message | Export-Csv -NoTypeInformation -Encoding UTF8 '%OUT%\\System_recent.csv'"
echo Logs exportados en %OUT%`,
    ps1Body: (v) => `$Out = "${v.targetDir || '$env:USERPROFILE\\Desktop\\Logs_Soporte'}"
if (-not (Test-Path $Out)) { New-Item $Out -ItemType Directory -Force | Out-Null }
wevtutil epl System (Join-Path $Out "System.evtx")
wevtutil epl Application (Join-Path $Out "Application.evtx")
Get-WinEvent -FilterHashtable @{LogName='System'; StartTime=(Get-Date).AddDays(-${Number(v.days || 3)})} | Select-Object TimeCreated,Id,ProviderName,LevelDisplayName,Message | Export-Csv (Join-Path $Out "System_recent.csv") -NoTypeInformation -Encoding UTF8
Write-Log "Logs exportados en $Out"`
  });

  add({
    id: 'browser-cache-cleaner',
    name: 'Limpiar caché de navegadores',
    category: 'Navegadores',
    icon: '🌍',
    risk: 'medio',
    requiresAdmin: false,
    description: 'Cierra navegador opcionalmente y limpia cachés de Edge, Chrome y Firefox del usuario actual.',
    fields: [
      { key: 'edge', label: 'Edge', type: 'checkbox', default: true },
      { key: 'chrome', label: 'Chrome', type: 'checkbox', default: true },
      { key: 'firefox', label: 'Firefox', type: 'checkbox', default: false },
      { key: 'closeBrowsers', label: 'Cerrar navegadores antes de limpiar', type: 'checkbox', default: false }
    ],
    riskNotes: ['Puede cerrar sesiones temporales o ralentizar primera carga de páginas.'],
    checklistPre: ['Avisar al usuario y cerrar pestañas importantes.'],
    checklistPost: ['Abrir navegador y probar web afectada.'],
    rollback: 'No hay rollback de caché borrada.',
    batBody: (v) => `${v.closeBrowsers ? `taskkill /f /im msedge.exe >nul 2>&1
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im firefox.exe >nul 2>&1` : ''}
${v.edge ? 'rd /s /q "%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Cache" >nul 2>&1' : ''}
${v.chrome ? 'rd /s /q "%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Cache" >nul 2>&1' : ''}
${v.firefox ? 'for /d %%D in ("%APPDATA%\\Mozilla\\Firefox\\Profiles\\*") do rd /s /q "%%D\\cache2" >nul 2>&1' : ''}
echo Limpieza de caché finalizada.`,
    ps1Body: (v) => `${v.closeBrowsers ? `"msedge","chrome","firefox" | ForEach-Object { Get-Process $_ -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }` : ''}
${v.edge ? `Remove-Item "$env:LOCALAPPDATA\\Microsoft\\Edge\\User Data\\Default\\Cache" -Recurse -Force -ErrorAction SilentlyContinue` : ''}
${v.chrome ? `Remove-Item "$env:LOCALAPPDATA\\Google\\Chrome\\User Data\\Default\\Cache" -Recurse -Force -ErrorAction SilentlyContinue` : ''}
${v.firefox ? `Get-ChildItem "$env:APPDATA\\Mozilla\\Firefox\\Profiles" -Directory -ErrorAction SilentlyContinue | ForEach-Object { Remove-Item (Join-Path $_.FullName "cache2") -Recurse -Force -ErrorAction SilentlyContinue }` : ''}
Write-Log "Limpieza de caché finalizada."`
  });

  add({
    id: 'local-admins-audit',
    name: 'Auditar administradores locales',
    category: 'Usuarios',
    icon: '👥',
    risk: 'bajo',
    requiresAdmin: true,
    description: 'Lista miembros del grupo Administradores local y datos básicos de usuarios locales.',
    fields: [
      { key: 'exportCsv', label: 'Exportar a CSV en Escritorio', type: 'checkbox', default: true }
    ],
    riskNotes: ['Solo lectura.'],
    checklistPre: ['Ninguno.'],
    checklistPost: ['Revisar miembros no autorizados.'],
    rollback: null,
    batBody: (v) => `net localgroup Administradores
net user
${v.exportCsv ? 'powershell -NoProfile -Command "Get-LocalGroupMember Administradores | Export-Csv -NoTypeInformation -Encoding UTF8 $env:USERPROFILE\\Desktop\\admins_locales.csv"' : ''}`,
    ps1Body: (v) => `Get-LocalGroupMember Administradores | Format-Table -AutoSize | Out-String | Write-Log
Get-LocalUser | Select-Object Name,Enabled,LastLogon | Format-Table -AutoSize | Out-String | Write-Log
${v.exportCsv ? `Get-LocalGroupMember Administradores | Export-Csv "$env:USERPROFILE\\Desktop\\admins_locales.csv" -NoTypeInformation -Encoding UTF8` : ''}`
  });

  add({
    id: 'cau-interactive-toolkit-basic',
    name: 'Toolkit CAU interactivo básico',
    category: 'Logs CAU',
    icon: '🧰',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Menú interactivo estilo CAU: info sistema, DISM/SFC, reset red, limpieza temporal, DNS, IP e informe.',
    fields: [
      { key: 'includeRepair', label: 'Incluir opción DISM/SFC', type: 'checkbox', default: true },
      { key: 'includeNetworkReset', label: 'Incluir opción reset red', type: 'checkbox', default: true },
      { key: 'includeTempClean', label: 'Incluir opción limpieza temporales', type: 'checkbox', default: true }
    ],
    riskNotes: ['Incluye acciones de reparación, borrado temporal y reset de red según opciones.'],
    checklistPre: ['Ejecutar solo con permiso del usuario/empresa.', 'Guardar trabajo antes de reset red o reparación larga.'],
    checklistPost: ['Guardar log generado y reiniciar si se hizo reset de red.'],
    rollback: 'Depende de la acción elegida; reset de red suele requerir reinicio.',
    batBody: (v) => `set "LOG=%USERPROFILE%\\Desktop\\CAU_Toolkit_%COMPUTERNAME%.log"
:menu
cls
echo =============================================
echo   ScriptForge 404 - Toolkit CAU
echo =============================================
echo 1. Informacion del sistema
${v.includeRepair ? 'echo 2. Reparar Windows DISM/SFC' : ''}
${v.includeNetworkReset ? 'echo 3. Reset red DNS/Winsock/IP' : ''}
${v.includeTempClean ? 'echo 4. Limpiar temporales' : ''}
echo 5. Flush DNS
echo 6. Ver IP/adaptadores
echo 7. Generar informe completo
echo 0. Salir
set /p op=Selecciona opcion: 
if "%op%"=="1" (systeminfo | more & systeminfo >> "%LOG%" & pause & goto menu)
${v.includeRepair ? 'if "%op%"=="2" (DISM /Online /Cleanup-Image /RestoreHealth >> "%LOG%" 2>&1 & sfc /scannow >> "%LOG%" 2>&1 & pause & goto menu)' : ''}
${v.includeNetworkReset ? 'if "%op%"=="3" (ipconfig /release >> "%LOG%" 2>&1 & ipconfig /renew >> "%LOG%" 2>&1 & ipconfig /flushdns >> "%LOG%" 2>&1 & netsh winsock reset >> "%LOG%" 2>&1 & netsh int ip reset >> "%LOG%" 2>&1 & echo Reinicio recomendado & pause & goto menu)' : ''}
${v.includeTempClean ? 'if "%op%"=="4" (del /s /f /q "%temp%\\*" >> "%LOG%" 2>&1 & pause & goto menu)' : ''}
if "%op%"=="5" (ipconfig /flushdns & pause & goto menu)
if "%op%"=="6" (ipconfig /all | more & ipconfig /all >> "%LOG%" & pause & goto menu)
if "%op%"=="7" (systeminfo >> "%LOG%" & ipconfig /all >> "%LOG%" & tasklist >> "%LOG%" & echo Informe: %LOG% & pause & goto menu)
if "%op%"=="0" exit /b
goto menu`,
    ps1Body: (v) => `Write-Log "Para toolkit interactivo se recomienda exportar en BAT. En PowerShell se genera diagnostico equivalente."
Get-ComputerInfo | Out-String | Write-Log
Get-NetIPConfiguration | Out-String | Write-Log
Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 | Out-String | Write-Log`
  });

  // ============================================================
  // APPS UTILES / PORTAL
  // ============================================================

  add({
    id: 'open-apps-corporativas-portal',
    name: 'Abrir portal de apps útiles',
    category: 'Apps utiles',
    icon: '🔗',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Abre una página HTML local con enlaces oficiales a herramientas útiles de soporte.',
    fields: [
      { key: 'portalPath', label: 'Ruta/URL del portal', type: 'text', default: 'apps-corporativas.html' }
    ],
    riskNotes: ['Solo abre enlaces/página local.'],
    checklistPre: ['Verificar que el portal contiene enlaces autorizados por la organización si se usa en empresa.'],
    checklistPost: ['Comprobar que los enlaces abren en nueva pestaña.'],
    rollback: null,
    batBody: (v) => `start "" "${v.portalPath || 'apps-corporativas.html'}"`,
    ps1Body: (v) => `Start-Process "${v.portalPath || 'apps-corporativas.html'}"`
  });

})();
