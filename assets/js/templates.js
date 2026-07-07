/* ============================================================
   ScriptForge 404 - templates.js
   Catalogo de plantillas. Datos puros + funciones generadoras
   de cuerpo de script (sin cabecera/pie, eso lo añade generator.js)

   Convenciones:
   - vars contiene los valores de los "fields" de la plantilla
     mas vars.dryRun (bool) y vars.silent (bool) inyectados por
     el motor a partir de las opciones globales del wizard.
   - batBody/ps1Body devuelven SOLO el cuerpo especifico de la
     plantilla, como string multilinea.
   ============================================================ */

const SFTemplates = (() => {
  const T = [];

  // ---------- 1. Diagnostico rapido del sistema ----------
  T.push({
    id: 'quick-diagnostic',
    name: 'Diagnostico rapido del sistema',
    category: 'Diagnostico',
    icon: '🩺',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Recoge datos basicos de red, sistema operativo y procesos activos para una primera revision.',
    fields: [
      { key: 'includeNetwork', label: 'Incluir diagnostico de red (ipconfig, ping)', type: 'checkbox', default: true }
    ],
    riskNotes: ['Solo lectura de informacion, no modifica nada en el equipo.'],
    checklistPre: ['Confirmar que el equipo tiene conexion de red si se desea probar conectividad.'],
    checklistPost: ['Revisar la salida en pantalla o el log generado para detectar anomalias.'],
    rollback: null,
    batBody: (v) => `echo Recopilando informacion del sistema...
ver
echo.
systeminfo | findstr /B /C:"Nombre de host" /C:"Host Name" /C:"Nombre del sistema operativo" /C:"OS Name" /C:"Version del sistema" /C:"OS Version"
echo.
tasklist | find /c /v ""
${v.includeNetwork ? `echo.
echo --- Diagnostico de red ---
ipconfig /all
ping -n 2 8.8.8.8` : 'echo (Diagnostico de red omitido por configuracion)'}`,
    ps1Body: (v) => `Write-Log "Recopilando informacion del sistema..."
$os = Get-CimInstance Win32_OperatingSystem
Write-Log ("Sistema operativo: {0} (build {1})" -f $os.Caption, $os.BuildNumber)
Write-Log ("Equipo: {0} | Usuario actual: {1}" -f $env:COMPUTERNAME, $env:USERNAME)
$procCount = (Get-Process).Count
Write-Log "Procesos activos: $procCount"
${v.includeNetwork ? `Write-Log "--- Diagnostico de red ---"
Get-NetIPConfiguration | Format-Table -AutoSize | Out-String | Write-Log
try {
    Test-Connection -ComputerName 8.8.8.8 -Count 2 -ErrorAction Stop | Out-Null
    Write-Log "Conectividad a Internet: OK"
} catch {
    Write-Log "Conectividad a Internet: FALLO"
}` : 'Write-Log "(Diagnostico de red omitido por configuracion)"'}`
  });

  // ---------- 2. Informe extendido hardware/software ----------
  T.push({
    id: 'extended-report',
    name: 'Informe extendido de hardware y software',
    category: 'Diagnostico',
    icon: '🖥️',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Genera un informe detallado de BIOS, memoria, discos, controladores y dispositivos.',
    fields: [
      { key: 'includeDrivers', label: 'Incluir listado de controladores (driverquery)', type: 'checkbox', default: true }
    ],
    riskNotes: ['Solo lectura de informacion, no modifica nada en el equipo.'],
    checklistPre: ['Ninguno especifico.'],
    checklistPost: ['Adjuntar el informe al ticket o incidencia correspondiente.'],
    rollback: null,
    batBody: (v) => `echo Generando informe extendido...
systeminfo
echo.
echo --- Procesos con servicios asociados ---
tasklist /svc
${v.includeDrivers ? `echo.
echo --- Controladores instalados ---
driverquery` : ''}`,
    ps1Body: (v) => `Write-Log "Generando informe extendido..."
Get-ComputerInfo | Select-Object CsName, OsName, OsVersion, OsArchitecture, CsProcessors, CsTotalPhysicalMemory | Format-List | Out-String | Write-Log
Write-Log "--- BIOS ---"
Get-CimInstance Win32_BIOS | Format-List Manufacturer, SMBIOSBIOSVersion, ReleaseDate | Out-String | Write-Log
Write-Log "--- Memoria fisica ---"
Get-CimInstance Win32_PhysicalMemory | Select-Object Manufacturer, Capacity, Speed | Format-Table -AutoSize | Out-String | Write-Log
Write-Log "--- Discos ---"
Get-CimInstance Win32_DiskDrive | Select-Object Model, Size, InterfaceType | Format-Table -AutoSize | Out-String | Write-Log
${v.includeDrivers ? `Write-Log "--- Dispositivos PnP ---"
Get-PnpDevice | Where-Object { $_.Status -ne "OK" } | Format-Table -AutoSize | Out-String | Write-Log` : ''}`
  });

  // ---------- 3. Limpieza de temporales ----------
  T.push({
    id: 'clean-temp',
    name: 'Limpieza de temporales',
    category: 'Limpieza',
    icon: '🧹',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Elimina archivos temporales de usuario y sistema. Opcionalmente limpia Prefetch y cache de Windows Update.',
    fields: [
      { key: 'cleanPrefetch', label: 'Limpiar carpeta Prefetch (puede afectar al arranque de apps la primera vez)', type: 'checkbox', default: false },
      { key: 'cleanWUCache', label: 'Limpiar cache de Windows Update (SoftwareDistribution)', type: 'checkbox', default: false }
    ],
    riskNotes: ['Borra archivos temporales; en general seguro pero irreversible.'],
    riskyFields: [
      { key: 'cleanPrefetch', label: 'Limpieza de Prefetch: puede ralentizar la primera apertura de programas.', level: 'medio' },
      { key: 'cleanWUCache', label: 'Limpieza de cache de Windows Update: fuerza redescarga de actualizaciones pendientes.', level: 'medio' }
    ],
    checklistPre: ['Cerrar aplicaciones abiertas para liberar archivos bloqueados.', 'Confirmar que no hay descargas de Windows Update en curso.'],
    checklistPost: ['Verificar espacio en disco liberado.', 'Reiniciar el equipo si se limpio la cache de Windows Update.'],
    rollback: 'No hay rollback: los temporales eliminados no son recuperables. No se tocan datos de usuario.',
    batBody: (v) => `echo Limpiando archivos temporales de usuario...
${v.dryRun ? 'echo [SIMULACION] del /f /q /s "%TEMP%\\*.*"' : 'del /f /q /s "%TEMP%\\*.*" >nul 2>&1'}
echo Limpiando temporales de sistema...
${v.dryRun ? 'echo [SIMULACION] del /f /q /s "C:\\Windows\\Temp\\*.*"' : 'del /f /q /s "C:\\Windows\\Temp\\*.*" >nul 2>&1'}
${v.cleanPrefetch ? `echo Limpiando Prefetch...
${v.dryRun ? 'echo [SIMULACION] del /f /q "C:\\Windows\\Prefetch\\*.*"' : 'del /f /q "C:\\Windows\\Prefetch\\*.*" >nul 2>&1'}` : ''}
${v.cleanWUCache ? `echo Deteniendo servicio wuauserv para limpiar cache de Windows Update...
${v.dryRun ? 'echo [SIMULACION] net stop wuauserv y limpieza de SoftwareDistribution' : `net stop wuauserv >nul 2>&1
del /f /q /s "C:\\Windows\\SoftwareDistribution\\Download\\*.*" >nul 2>&1
net start wuauserv >nul 2>&1`}` : ''}
echo Limpieza completada.`,
    ps1Body: (v) => `Write-Log "Limpiando archivos temporales de usuario..."
if ($DryRun) { Write-Log "[SIMULACION] Remove-Item $env:TEMP\\*" }
else { Get-ChildItem -Path $env:TEMP -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue }

Write-Log "Limpiando temporales de sistema (C:\\Windows\\Temp)..."
if ($DryRun) { Write-Log "[SIMULACION] Remove-Item C:\\Windows\\Temp\\*" }
else { Get-ChildItem -Path "C:\\Windows\\Temp" -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue }

${v.cleanPrefetch ? `Write-Log "Limpiando Prefetch..."
if ($DryRun) { Write-Log "[SIMULACION] Remove-Item C:\\Windows\\Prefetch\\*" }
else { Get-ChildItem -Path "C:\\Windows\\Prefetch" -Force -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue }` : ''}

${v.cleanWUCache ? `Write-Log "Limpiando cache de Windows Update..."
if ($DryRun) {
    Write-Log "[SIMULACION] Stop-Service wuauserv, limpiar SoftwareDistribution, Start-Service wuauserv"
} else {
    try {
        Stop-Service wuauserv -Force -ErrorAction Stop
        Get-ChildItem -Path "C:\\Windows\\SoftwareDistribution\\Download" -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
        Start-Service wuauserv -ErrorAction Stop
    } catch {
        Write-Log ("ERROR gestionando wuauserv: " + $_.Exception.Message)
    }
}` : ''}
Write-Log "Limpieza completada."`
  });

  // ---------- 4. Vaciado papelera y cache Explorer ----------
  T.push({
    id: 'empty-recycle',
    name: 'Vaciado de papelera y cache de Explorer',
    category: 'Limpieza',
    icon: '🗑️',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Vacia la papelera de reciclaje y limpia la cache de iconos y miniaturas de Explorer.',
    fields: [
      { key: 'restartExplorer', label: 'Reiniciar Explorer.exe tras limpiar la cache', type: 'checkbox', default: true }
    ],
    riskNotes: ['Los archivos de la papelera se eliminan de forma permanente.'],
    checklistPre: ['Confirmar con el usuario que no necesita nada de la papelera.'],
    checklistPost: ['Comprobar que el escritorio y la barra de tareas se ven correctamente tras reiniciar Explorer.'],
    rollback: 'No aplica: la papelera vaciada no es recuperable por este script.',
    batBody: (v) => `echo Vaciando papelera de reciclaje...
${v.dryRun ? 'echo [SIMULACION] powershell Clear-RecycleBin -Force' : 'powershell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"'}
echo Limpiando cache de iconos...
${v.dryRun ? 'echo [SIMULACION] borrado de IconCache.db y miniaturas' : `taskkill /f /im explorer.exe >nul 2>&1
del /f /q "%LOCALAPPDATA%\\IconCache.db" >nul 2>&1
del /f /q /s "%LOCALAPPDATA%\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" >nul 2>&1`}
${v.restartExplorer ? `echo Reiniciando Explorer...
${v.dryRun ? 'echo [SIMULACION] start explorer.exe' : 'start explorer.exe'}` : 'echo Explorer no se reinicia automaticamente (inicia sesion de nuevo si hace falta).'}`,
    ps1Body: (v) => `Write-Log "Vaciando papelera de reciclaje..."
if ($DryRun) { Write-Log "[SIMULACION] Clear-RecycleBin -Force" }
else { Clear-RecycleBin -Force -ErrorAction SilentlyContinue }

Write-Log "Limpiando cache de iconos y miniaturas..."
if ($DryRun) {
    Write-Log "[SIMULACION] Stop-Process explorer, borrar IconCache.db y thumbcache_*.db"
} else {
    Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
    Remove-Item "$env:LOCALAPPDATA\\IconCache.db" -Force -ErrorAction SilentlyContinue
    Remove-Item "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" -Force -ErrorAction SilentlyContinue
}
${v.restartExplorer ? `Write-Log "Reiniciando Explorer..."
if ($DryRun) { Write-Log "[SIMULACION] Start-Process explorer.exe" }
else { Start-Process explorer.exe }` : 'Write-Log "Explorer no se reinicia automaticamente."'}`
  });

  // ---------- 5. Reparacion de red basica ----------
  T.push({
    id: 'network-basic-repair',
    name: 'Reparacion de red basica',
    category: 'Red',
    icon: '🌐',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Renueva la configuracion IP y comprueba conectividad basica (ping, tracert).',
    fields: [
      { key: 'targetHost', label: 'Host para probar conectividad', type: 'text', default: '8.8.8.8' }
    ],
    riskNotes: ['Renovar el IP puede causar una breve perdida de conectividad mientras se re-obtiene la direccion.'],
    checklistPre: ['Avisar al usuario de una posible desconexion breve.'],
    checklistPost: ['Confirmar que el equipo recupera IP y conectividad tras el proceso.'],
    rollback: 'Si la renovacion de IP falla, el adaptador puede reactivarse manualmente con "ipconfig /renew" o reiniciando el adaptador de red.',
    batBody: (v) => `echo Liberando y renovando configuracion IP...
${v.dryRun ? 'echo [SIMULACION] ipconfig /release y ipconfig /renew' : `ipconfig /release
ipconfig /renew`}
echo.
echo Probando conectividad contra ${v.targetHost}...
ping -n 4 ${v.targetHost}
echo.
echo Traza de ruta...
tracert -h 15 ${v.targetHost}`,
    ps1Body: (v) => `Write-Log "Liberando y renovando configuracion IP..."
if ($DryRun) {
    Write-Log "[SIMULACION] ipconfig /release + ipconfig /renew"
} else {
    ipconfig /release | Out-Null
    ipconfig /renew | Out-Null
}
Write-Log "Probando conectividad contra ${v.targetHost}..."
try {
    $result = Test-Connection -ComputerName "${v.targetHost}" -Count 4 -ErrorAction Stop
    $result | Format-Table -AutoSize | Out-String | Write-Log
} catch {
    Write-Log ("Fallo de conectividad: " + $_.Exception.Message)
}
Write-Log "Traza de ruta..."
Test-NetConnection -ComputerName "${v.targetHost}" -TraceRoute -Hops 15 | Out-String | Write-Log`
  });

  // ---------- 6. Flush DNS + Reset Winsock + Reset TCP/IP ----------
  T.push({
    id: 'network-deep-reset',
    name: 'Flush DNS / Reset Winsock / Reset TCP-IP',
    category: 'Red',
    icon: '🔄',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Restablece por completo la pila de red. Requiere reinicio del equipo al finalizar.',
    fields: [
      { key: 'includeFirewallReset', label: 'Restablecer tambien reglas de Firewall a valores por defecto', type: 'checkbox', default: false }
    ],
    riskNotes: [
      'Reset de Winsock y TCP/IP requieren reinicio del equipo para aplicarse.',
      'Mientras no se reinicie, la conectividad puede comportarse de forma inestable.'
    ],
    riskyFields: [
      { key: 'includeFirewallReset', label: 'Restablecer el Firewall elimina reglas personalizadas existentes.', level: 'alto' }
    ],
    checklistPre: ['Guardar trabajo abierto.', 'Avisar al usuario de que el equipo debera reiniciarse al terminar.'],
    checklistPost: ['Reiniciar el equipo.', 'Verificar conectividad tras el reinicio.'],
    rollback: 'No hay rollback directo tras el reset; si el firewall se restablecio, las reglas personalizadas deben volver a crearse manualmente.',
    batBody: (v) => `echo Vaciando cache DNS...
${v.dryRun ? 'echo [SIMULACION] ipconfig /flushdns' : 'ipconfig /flushdns'}
echo Restableciendo Winsock...
${v.dryRun ? 'echo [SIMULACION] netsh winsock reset' : 'netsh winsock reset'}
echo Restableciendo pila TCP/IP...
${v.dryRun ? 'echo [SIMULACION] netsh int ip reset' : 'netsh int ip reset'}
${v.includeFirewallReset ? `echo Restableciendo reglas de Firewall...
${v.dryRun ? 'echo [SIMULACION] netsh advfirewall reset' : 'netsh advfirewall reset'}` : ''}
echo.
echo IMPORTANTE: reinicia el equipo para que los cambios surtan efecto.`,
    ps1Body: (v) => `Write-Log "Vaciando cache DNS..."
if ($DryRun) { Write-Log "[SIMULACION] ipconfig /flushdns" } else { ipconfig /flushdns | Out-Null }

Write-Log "Restableciendo Winsock..."
if ($DryRun) { Write-Log "[SIMULACION] netsh winsock reset" } else { netsh winsock reset | Out-Null }

Write-Log "Restableciendo pila TCP/IP..."
if ($DryRun) { Write-Log "[SIMULACION] netsh int ip reset" } else { netsh int ip reset | Out-Null }

${v.includeFirewallReset ? `Write-Log "Restableciendo reglas de Firewall a valores por defecto..."
if ($DryRun) { Write-Log "[SIMULACION] netsh advfirewall reset" } else { netsh advfirewall reset | Out-Null }` : ''}

Write-Log "IMPORTANTE: reinicia el equipo para aplicar los cambios."`
  });

  // ---------- 7. Reparacion de Microsoft Teams ----------
  T.push({
    id: 'teams-repair',
    name: 'Reparacion de Microsoft Teams',
    category: 'Teams',
    icon: '💬',
    risk: 'medio',
    requiresAdmin: false,
    description: 'Cierra Teams, limpia su cache local y permite relanzarlo desde el instalador estandar.',
    fields: [
      { key: 'reinstall', label: 'Intentar reinstalar Teams tras limpiar cache (usa el instalador de Microsoft)', type: 'checkbox', default: false }
    ],
    riskNotes: ['Se pierde el estado de sesion local; el usuario debera volver a iniciar sesion en Teams.'],
    checklistPre: ['Avisar al usuario de que debera volver a iniciar sesion tras el proceso.'],
    checklistPost: ['Abrir Teams manualmente y comprobar que inicia sesion correctamente.'],
    rollback: 'No hay rollback: la cache eliminada se regenera automaticamente al reabrir Teams.',
    batBody: (v) => `echo Cerrando Microsoft Teams...
taskkill /f /im Teams.exe >nul 2>&1
echo Limpiando cache local de Teams...
${v.dryRun ? 'echo [SIMULACION] borrado de %appdata%\\Microsoft\\Teams' : 'rd /s /q "%APPDATA%\\Microsoft\\Teams" >nul 2>&1'}
${v.reinstall ? `echo Intentando lanzar el instalador de Teams (requiere conexion a internet)...
${v.dryRun ? 'echo [SIMULACION] start "" "https://teams.microsoft.com/downloads"' : 'start "" "https://teams.microsoft.com/downloads"'}` : 'echo Vuelve a abrir Teams desde el menu inicio para regenerar la cache.'}`,
    ps1Body: (v) => `Write-Log "Cerrando Microsoft Teams..."
Stop-Process -Name Teams -Force -ErrorAction SilentlyContinue

Write-Log "Limpiando cache local de Teams..."
if ($DryRun) {
    Write-Log "[SIMULACION] Remove-Item $env:APPDATA\\Microsoft\\Teams -Recurse"
} else {
    Remove-Item "$env:APPDATA\\Microsoft\\Teams" -Recurse -Force -ErrorAction SilentlyContinue
}

${v.reinstall ? `Write-Log "Abriendo pagina de descarga de Teams..."
if ($DryRun) { Write-Log "[SIMULACION] Start-Process https://teams.microsoft.com/downloads" }
else { Start-Process "https://teams.microsoft.com/downloads" }` : 'Write-Log "Vuelve a abrir Teams manualmente para regenerar la cache."'}`
  });

  // ---------- 8. Reparacion Outlook / Add-in Teams Meeting ----------
  T.push({
    id: 'outlook-teams-addin-repair',
    name: 'Reparacion de Outlook y Add-in Teams Meeting',
    category: 'Outlook',
    icon: '📧',
    risk: 'medio',
    requiresAdmin: false,
    description: 'Cierra Outlook, limpia su cache de formularios y reactiva el complemento de Teams Meeting si esta deshabilitado.',
    fields: [
      { key: 'clearOutlookCache', label: 'Limpiar cache de formularios de Outlook (RoamCache)', type: 'checkbox', default: true }
    ],
    riskNotes: ['Se modifica una clave de registro de usuario (HKCU) para reactivar el complemento; se recomienda revisar antes de ejecutar.'],
    riskyFields: [
      { key: 'clearOutlookCache', label: 'La limpieza de RoamCache elimina datos de firma/autocompletado en cache local.', level: 'medio' }
    ],
    checklistPre: ['Cerrar Outlook completamente antes de ejecutar.'],
    checklistPost: ['Abrir Outlook y comprobar en Archivo > Opciones > Complementos que "Teams Meeting Add-in" esta activo.'],
    rollback: 'Si el complemento no aparece tras el cambio, puede reactivarse manualmente desde Outlook > Opciones > Complementos > Elementos deshabilitados.',
    batBody: (v) => `echo Cerrando Outlook...
taskkill /f /im OUTLOOK.EXE >nul 2>&1
${v.clearOutlookCache ? `echo Limpiando cache de formularios de Outlook (RoamCache)...
${v.dryRun ? 'echo [SIMULACION] borrado de %LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache' : 'del /f /q "%LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache\\*.*" >nul 2>&1'}` : ''}
echo Reactivando complemento Teams Meeting Add-in (registro de usuario)...
${v.dryRun ? 'echo [SIMULACION] reg add HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect /v LoadBehavior /t REG_DWORD /d 3 /f' : 'reg add "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" /v LoadBehavior /t REG_DWORD /d 3 /f'}
echo Abre Outlook y verifica el complemento en Archivo ^> Opciones ^> Complementos.`,
    ps1Body: (v) => `Write-Log "Cerrando Outlook..."
Stop-Process -Name OUTLOOK -Force -ErrorAction SilentlyContinue

${v.clearOutlookCache ? `Write-Log "Limpiando cache de formularios de Outlook (RoamCache)..."
if ($DryRun) {
    Write-Log "[SIMULACION] Remove-Item RoamCache\\*"
} else {
    Remove-Item "$env:LOCALAPPDATA\\Microsoft\\Outlook\\RoamCache\\*" -Force -ErrorAction SilentlyContinue
}` : ''}

Write-Log "Reactivando complemento Teams Meeting Add-in..."
$addinPath = "HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect"
if ($DryRun) {
    Write-Log "[SIMULACION] Set-ItemProperty $addinPath LoadBehavior = 3"
} else {
    try {
        if (-not (Test-Path $addinPath)) { New-Item -Path $addinPath -Force | Out-Null }
        Set-ItemProperty -Path $addinPath -Name "LoadBehavior" -Value 3 -Type DWord
    } catch {
        Write-Log ("ERROR reactivando complemento: " + $_.Exception.Message)
    }
}
Write-Log "Abre Outlook y verifica el complemento en Archivo > Opciones > Complementos."`
  });

  // ---------- 9. Reparacion rapida de Office 365 ----------
  T.push({
    id: 'office365-quick-repair',
    name: 'Reparacion rapida de Office 365',
    category: 'Office',
    icon: '📄',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Lanza la reparacion rapida de Office (Click-to-Run) sin necesidad de desinstalar nada.',
    fields: [
      { key: 'officePath', label: 'Ruta de OfficeClickToRun.exe', type: 'text', default: 'C:\\Program Files\\Common Files\\Microsoft Shared\\ClickToRun\\OfficeClickToRun.exe' }
    ],
    riskNotes: ['Cierra automaticamente las aplicaciones de Office abiertas antes de reparar.'],
    checklistPre: ['Guardar y cerrar todos los documentos de Office abiertos.'],
    checklistPost: ['Abrir cualquier app de Office y comprobar que funciona correctamente.'],
    rollback: 'La reparacion rapida no desinstala nada; si no soluciona el problema, se puede intentar una reparacion en linea desde el Panel de Control.',
    batBody: (v) => `echo Cerrando aplicaciones de Office abiertas...
taskkill /f /im WINWORD.EXE >nul 2>&1
taskkill /f /im EXCEL.EXE >nul 2>&1
taskkill /f /im OUTLOOK.EXE >nul 2>&1
taskkill /f /im POWERPNT.EXE >nul 2>&1
echo Lanzando reparacion rapida de Office...
${v.dryRun ? `echo [SIMULACION] "${v.officePath}" scenario=Repair platform=x64 culture=es-es RepairType=QuickRepair DisplayLevel=True` : `"${v.officePath}" scenario=Repair platform=x64 culture=es-es RepairType=QuickRepair DisplayLevel=True`}
echo Reparacion lanzada. Sigue el progreso en la ventana de Office que se abrira.`,
    ps1Body: (v) => `Write-Log "Cerrando aplicaciones de Office abiertas..."
@("WINWORD","EXCEL","OUTLOOK","POWERPNT") | ForEach-Object {
    Stop-Process -Name $_ -Force -ErrorAction SilentlyContinue
}
Write-Log "Lanzando reparacion rapida de Office..."
$officePath = "${v.officePath}"
if ($DryRun) {
    Write-Log "[SIMULACION] Start-Process $officePath -ArgumentList scenario=Repair RepairType=QuickRepair"
} else {
    if (Test-Path $officePath) {
        Start-Process -FilePath $officePath -ArgumentList "scenario=Repair platform=x64 culture=es-es RepairType=QuickRepair DisplayLevel=True"
        Write-Log "Reparacion lanzada. Sigue el progreso en la ventana de Office."
    } else {
        Write-Log "ERROR: no se encontro OfficeClickToRun.exe en la ruta indicada."
    }
}`
  });

  // ---------- 10. Revision y reinicio de servicios ----------
  T.push({
    id: 'services-review-restart',
    name: 'Revision y reinicio de servicios Windows',
    category: 'Servicios',
    icon: '⚙️',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Consulta el estado de un servicio y permite reiniciarlo de forma controlada.',
    fields: [
      { key: 'serviceName', label: 'Nombre del servicio (ej: Spooler, wuauserv, BITS)', type: 'text', default: 'Spooler' },
      { key: 'restartService', label: 'Reiniciar el servicio (no solo consultar)', type: 'checkbox', default: false }
    ],
    riskNotes: ['Detener/reiniciar un servicio critico del sistema puede afectar a otras aplicaciones que dependan de el.'],
    riskyFields: [
      { key: 'restartService', label: 'Se detendra y volvera a iniciar el servicio indicado, afectando a procesos dependientes.', level: 'alto' }
    ],
    checklistPre: ['Confirmar que el servicio indicado no es critico para procesos en curso.', 'Verificar el nombre exacto del servicio con "Get-Service" o services.msc.'],
    checklistPost: ['Comprobar que el servicio quedo en estado "Running" tras el reinicio.'],
    rollback: 'Si el servicio no arranca de nuevo, iniciarlo manualmente con "net start <servicio>" o desde services.msc.',
    batBody: (v) => `echo Consultando estado del servicio "${v.serviceName}"...
sc query "${v.serviceName}"
${v.restartService ? `echo.
echo Reiniciando servicio "${v.serviceName}"...
${v.dryRun ? `echo [SIMULACION] net stop "${v.serviceName}" y net start "${v.serviceName}"` : `net stop "${v.serviceName}"
net start "${v.serviceName}"`}` : 'echo Solo se ha consultado el estado (reinicio no solicitado).'}`,
    ps1Body: (v) => `Write-Log "Consultando estado del servicio ${v.serviceName}..."
try {
    $svc = Get-Service -Name "${v.serviceName}" -ErrorAction Stop
    Write-Log ("Estado actual: " + $svc.Status)
} catch {
    Write-Log ("ERROR: servicio '${v.serviceName}' no encontrado: " + $_.Exception.Message)
}
${v.restartService ? `Write-Log "Reiniciando servicio ${v.serviceName}..."
if ($DryRun) {
    Write-Log "[SIMULACION] Restart-Service ${v.serviceName} -Force"
} else {
    try {
        Restart-Service -Name "${v.serviceName}" -Force -ErrorAction Stop
        Write-Log "Servicio reiniciado correctamente."
    } catch {
        Write-Log ("ERROR reiniciando servicio: " + $_.Exception.Message)
    }
}` : 'Write-Log "Solo se ha consultado el estado (reinicio no solicitado)."'}`
  });

  // ---------- 11. Exportacion inventario de equipo ----------
  T.push({
    id: 'export-inventory',
    name: 'Exportacion de informacion del equipo',
    category: 'Exportacion',
    icon: '📋',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Exporta especificaciones basicas del equipo (hostname, IP, usuario, SO) a un archivo de texto.',
    fields: [
      { key: 'exportPath', label: 'Ruta de exportacion', type: 'text', default: '.\\inventario' }
    ],
    riskNotes: ['Solo lectura y escritura de un archivo de inventario, no modifica el sistema.'],
    checklistPre: ['Confirmar permisos de escritura en la ruta de exportacion.'],
    checklistPost: ['Verificar que el archivo de inventario se genero correctamente.'],
    rollback: null,
    batBody: (v) => `if not exist "${v.exportPath}" mkdir "${v.exportPath}"
set "INVFILE=${v.exportPath}\\inventario_%COMPUTERNAME%.txt"
echo Exportando inventario a %INVFILE%...
(
  echo === Inventario de equipo ===
  echo Fecha: %date% %time%
  echo Equipo: %COMPUTERNAME%
  echo Usuario: %USERNAME%
  echo.
  systeminfo | findstr /B /C:"Nombre del host" /C:"Host Name" /C:"Nombre del sistema operativo" /C:"OS Name"
  echo.
  ipconfig | findstr /C:"IPv4"
) > "%INVFILE%"
echo Inventario guardado en %INVFILE%`,
    ps1Body: (v) => `$exportPath = "${v.exportPath}"
if (-not (Test-Path $exportPath)) { New-Item -Path $exportPath -ItemType Directory -Force | Out-Null }
$invFile = Join-Path $exportPath ("inventario_" + $env:COMPUTERNAME + ".txt")
Write-Log "Exportando inventario a $invFile..."
$os = Get-CimInstance Win32_OperatingSystem
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch "Loopback" } | Select-Object -First 1).IPAddress
$content = @"
=== Inventario de equipo ===
Fecha: $(Get-Date)
Equipo: $env:COMPUTERNAME
Usuario: $env:USERNAME
Sistema operativo: $($os.Caption) ($($os.Version))
IP principal: $ip
"@
$content | Out-File -FilePath $invFile -Encoding UTF8
Write-Log "Inventario guardado en $invFile"`
  });

  // ---------- 12. Gestion de permisos de carpeta (icacls) ----------
  T.push({
    id: 'folder-permissions',
    name: 'Gestion de carpetas y permisos (icacls)',
    category: 'Permisos',
    icon: '🔐',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Otorga o revisa permisos NTFS de un usuario/grupo sobre una carpeta especifica.',
    fields: [
      { key: 'targetPath', label: 'Ruta de la carpeta', type: 'text', default: 'C:\\Datos\\Compartido' },
      { key: 'principal', label: 'Usuario o grupo (DOMINIO\\usuario)', type: 'text', default: 'DOMINIO\\usuario' },
      { key: 'permission', label: 'Permiso a otorgar', type: 'select', options: ['Lectura (R)', 'Modificar (M)', 'Control total (F)'], default: 'Lectura (R)' },
      { key: 'action', label: 'Accion', type: 'select', options: ['Consultar permisos actuales', 'Otorgar permiso'], default: 'Consultar permisos actuales' }
    ],
    riskNotes: ['Modificar permisos NTFS puede bloquear o exponer el acceso a datos sensibles si se aplica incorrectamente.'],
    riskyFields: [
      { key: 'action', label: 'Se va a otorgar un permiso NTFS nuevo sobre la carpeta indicada.', level: 'alto', when: (val) => val === 'Otorgar permiso' }
    ],
    checklistPre: ['Verificar que la ruta y el usuario/grupo son exactamente correctos.', 'Confirmar que se cuenta con autorizacion para modificar permisos en esa carpeta.'],
    checklistPost: ['Volver a consultar los permisos con icacls para confirmar el cambio aplicado.'],
    rollback: 'Antes de otorgar el permiso, se recomienda ejecutar primero este mismo script en modo "Consultar" y guardar la salida como referencia para revertir manualmente con icacls /remove si hiciera falta.',
    batBody: (v) => {
      const permCode = v.permission && v.permission.match(/\(([A-Z])\)/) ? v.permission.match(/\(([A-Z])\)/)[1] : 'R';
      if (v.action === 'Otorgar permiso') {
        return `echo Otorgando permiso ${v.permission} a "${v.principal}" sobre "${v.targetPath}"...
${v.dryRun ? `echo [SIMULACION] icacls "${v.targetPath}" /grant "${v.principal}":(${permCode})` : `icacls "${v.targetPath}" /grant "${v.principal}":(${permCode})`}
echo.
echo Permisos actuales tras el cambio:
icacls "${v.targetPath}"`;
      }
      return `echo Consultando permisos actuales de "${v.targetPath}"...
icacls "${v.targetPath}"`;
    },
    ps1Body: (v) => {
      const permCode = v.permission && v.permission.match(/\(([A-Z])\)/) ? v.permission.match(/\(([A-Z])\)/)[1] : 'R';
      if (v.action === 'Otorgar permiso') {
        return `Write-Log "Otorgando permiso ${v.permission} a ${v.principal} sobre ${v.targetPath}..."
if ($DryRun) {
    Write-Log "[SIMULACION] icacls \\"${v.targetPath}\\" /grant \\"${v.principal}\\":(${permCode})"
} else {
    icacls "${v.targetPath}" /grant "${v.principal}:(${permCode})"
}
Write-Log "Permisos actuales tras el cambio:"
icacls "${v.targetPath}" | Out-String | Write-Log`;
      }
      return `Write-Log "Consultando permisos actuales de ${v.targetPath}..."
icacls "${v.targetPath}" | Out-String | Write-Log`;
    }
  });

  // ---------- 13. Backup rapido de carpetas de usuario ----------
  T.push({
    id: 'quick-backup',
    name: 'Copia de seguridad basica de carpetas',
    category: 'Backup',
    icon: '💾',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Copia una carpeta de origen a un destino (unidad externa o red) usando Robocopy con reflejo (mirror).',
    fields: [
      { key: 'sourcePath', label: 'Carpeta de origen', type: 'text', default: 'C:\\Users\\%USERNAME%\\Documents' },
      { key: 'destPath', label: 'Carpeta de destino', type: 'text', default: 'D:\\Backup\\Documents' },
      { key: 'mirror', label: 'Modo espejo (borra en destino lo que ya no existe en origen)', type: 'checkbox', default: false }
    ],
    riskNotes: ['El modo espejo puede eliminar archivos en destino que no esten en el origen.'],
    riskyFields: [
      { key: 'mirror', label: 'El modo espejo (/MIR) borra en destino los archivos que ya no existen en origen.', level: 'medio' }
    ],
    checklistPre: ['Confirmar que la unidad de destino esta conectada y tiene espacio suficiente.'],
    checklistPost: ['Verificar el resumen de Robocopy (archivos copiados, omitidos, con error).'],
    rollback: 'Si se uso modo espejo y se borro algo por error, restaurar desde una copia previa; Robocopy no incluye papelera de reciclaje.',
    batBody: (v) => `echo Copiando desde "${v.sourcePath}" a "${v.destPath}"...
if not exist "${v.destPath}" mkdir "${v.destPath}"
${v.dryRun
  ? `echo [SIMULACION] robocopy "${v.sourcePath}" "${v.destPath}" ${v.mirror ? '/MIR' : '/E'} /R:2 /W:5 /LOG+:backup.log /L`
  : `robocopy "${v.sourcePath}" "${v.destPath}" ${v.mirror ? '/MIR' : '/E'} /R:2 /W:5`}
echo Copia finalizada. Revisa el codigo de salida de robocopy (0-7 son exitos parciales normales).`,
    ps1Body: (v) => `Write-Log "Copiando desde ${v.sourcePath} a ${v.destPath}..."
if (-not (Test-Path "${v.destPath}")) { New-Item -Path "${v.destPath}" -ItemType Directory -Force | Out-Null }
$robocopyArgs = @("${v.sourcePath}", "${v.destPath}", "${v.mirror ? '/MIR' : '/E'}", "/R:2", "/W:5")
if ($DryRun) { $robocopyArgs += "/L" }
$result = & robocopy @robocopyArgs
Write-Log ($result -join "\`n")
Write-Log "Copia finalizada. El codigo de salida 0-7 de robocopy indica exito o exito parcial."`
  });

  // ---------- 14. Gestion de tareas programadas ----------
  T.push({
    id: 'scheduled-tasks',
    name: 'Gestion de tareas programadas',
    category: 'Tareas',
    icon: '⏰',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Consulta, crea o elimina una tarea programada de Windows.',
    fields: [
      { key: 'action', label: 'Accion', type: 'select', options: ['Consultar', 'Crear', 'Eliminar'], default: 'Consultar' },
      { key: 'taskName', label: 'Nombre de la tarea', type: 'text', default: 'ScriptForge_Tarea' },
      { key: 'command', label: 'Comando a ejecutar (solo si Crear)', type: 'text', default: 'C:\\Scripts\\mantenimiento.bat' },
      { key: 'schedule', label: 'Frecuencia (solo si Crear)', type: 'select', options: ['DAILY', 'WEEKLY', 'ONLOGON'], default: 'DAILY' }
    ],
    riskNotes: ['Eliminar una tarea programada puede afectar a procesos automatizados existentes si no se identifica correctamente.'],
    riskyFields: [
      { key: 'action', label: 'Se eliminara permanentemente la tarea programada indicada.', level: 'medio', when: (val) => val === 'Eliminar' }
    ],
    checklistPre: ['Confirmar el nombre exacto de la tarea con "schtasks /query".'],
    checklistPost: ['Verificar con "schtasks /query /tn <nombre>" que la accion se aplico correctamente.'],
    rollback: 'Si se elimino una tarea por error, debe recrearse manualmente con los mismos parametros (accion, frecuencia, credenciales).',
    batBody: (v) => {
      if (v.action === 'Crear') {
        return `echo Creando tarea programada "${v.taskName}"...
${v.dryRun ? `echo [SIMULACION] schtasks /create /tn "${v.taskName}" /tr "${v.command}" /sc ${v.schedule} /f` : `schtasks /create /tn "${v.taskName}" /tr "${v.command}" /sc ${v.schedule} /f`}`;
      }
      if (v.action === 'Eliminar') {
        return `echo Eliminando tarea programada "${v.taskName}"...
${v.dryRun ? `echo [SIMULACION] schtasks /delete /tn "${v.taskName}" /f` : `schtasks /delete /tn "${v.taskName}" /f`}`;
      }
      return `echo Consultando tarea programada "${v.taskName}"...
schtasks /query /tn "${v.taskName}" /v /fo LIST`;
    },
    ps1Body: (v) => {
      if (v.action === 'Crear') {
        return `Write-Log "Creando tarea programada ${v.taskName}..."
if ($DryRun) {
    Write-Log "[SIMULACION] schtasks /create /tn ${v.taskName} /tr ${v.command} /sc ${v.schedule}"
} else {
    schtasks /create /tn "${v.taskName}" /tr "${v.command}" /sc ${v.schedule} /f | Out-String | Write-Log
}`;
      }
      if (v.action === 'Eliminar') {
        return `Write-Log "Eliminando tarea programada ${v.taskName}..."
if ($DryRun) {
    Write-Log "[SIMULACION] schtasks /delete /tn ${v.taskName} /f"
} else {
    schtasks /delete /tn "${v.taskName}" /f | Out-String | Write-Log
}`;
      }
      return `Write-Log "Consultando tarea programada ${v.taskName}..."
schtasks /query /tn "${v.taskName}" /v /fo LIST | Out-String | Write-Log`;
    }
  });

  // ---------- 15. Diagnostico Intune / Autopilot ----------
  T.push({
    id: 'intune-autopilot-diagnostic',
    name: 'Diagnostico de Intune / Autopilot',
    category: 'Intune',
    icon: '📱',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Consulta el estado de registro en Azure AD/Entra ID e Intune del equipo.',
    fields: [],
    riskNotes: ['Solo lectura de estado de registro, no modifica la inscripcion del equipo.'],
    checklistPre: ['Ninguno especifico.'],
    checklistPost: ['Adjuntar la salida al ticket si se detecta un estado "NO" en algun campo relevante.'],
    rollback: null,
    batBody: (v) => `echo Consultando estado de registro en Azure AD / Intune...
dsregcmd /status`,
    ps1Body: (v) => `Write-Log "Consultando estado de registro en Azure AD / Intune..."
$dsreg = dsregcmd /status
Write-Log ($dsreg -join "\`n")`
  });

  // ---------- 16. Diagnostico de sesion Citrix ----------
  T.push({
    id: 'citrix-diagnostic',
    name: 'Diagnostico de sesion Citrix (.ica)',
    category: 'Citrix',
    icon: '🖧',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Revisa procesos de Citrix activos y localiza logs recientes relacionados con archivos .ica.',
    fields: [
      { key: 'logPathCitrix', label: 'Ruta de logs de Citrix Workspace', type: 'text', default: '%LOCALAPPDATA%\\Citrix\\Logs' }
    ],
    riskNotes: ['Solo lectura de procesos y logs, no modifica la configuracion de Citrix.'],
    checklistPre: ['Confirmar que Citrix Workspace App esta instalado en el equipo.'],
    checklistPost: ['Adjuntar los logs relevantes al ticket de soporte.'],
    rollback: null,
    batBody: (v) => `echo Procesos de Citrix activos:
tasklist | findstr /I "wfica concentr receiver CDViewer"
echo.
echo Buscando logs recientes en ${v.logPathCitrix}...
if exist "${v.logPathCitrix}" (dir "${v.logPathCitrix}" /O:-D /T:W) else (echo No se encontro la carpeta de logs indicada.)`,
    ps1Body: (v) => `Write-Log "Procesos de Citrix activos:"
Get-Process | Where-Object { $_.ProcessName -match "wfica|concentr|receiver|CDViewer" } | Format-Table -AutoSize | Out-String | Write-Log

$citrixLogPath = "${v.logPathCitrix}"
Write-Log "Buscando logs recientes en $citrixLogPath..."
if (Test-Path $citrixLogPath) {
    Get-ChildItem -Path $citrixLogPath | Sort-Object LastWriteTime -Descending | Select-Object -First 10 | Format-Table Name, LastWriteTime -AutoSize | Out-String | Write-Log
} else {
    Write-Log "No se encontro la carpeta de logs indicada."
}`
  });

  // ---------- 17. Impresoras ----------
  T.push({
    id: 'printer-spooler-reset',
    name: 'Diagnostico y reset de cola de impresion',
    category: 'Impresoras',
    icon: '🖨️',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Detiene el servicio de cola de impresion, limpia trabajos atascados y lo reinicia.',
    fields: [],
    riskNotes: ['Se eliminan todos los trabajos de impresion en cola, no solo el que esta atascado.'],
    checklistPre: ['Avisar a los usuarios que compartan la impresora de que sus trabajos en cola se perderan.'],
    checklistPost: ['Enviar un trabajo de prueba a la impresora para confirmar que la cola funciona.'],
    rollback: 'Los trabajos de impresion eliminados deben reenviarse manualmente por el usuario.',
    batBody: (v) => `echo Deteniendo servicio de cola de impresion (Spooler)...
${v.dryRun ? 'echo [SIMULACION] net stop spooler' : 'net stop spooler'}
echo Limpiando trabajos de impresion atascados...
${v.dryRun ? 'echo [SIMULACION] del /f /q %systemroot%\\System32\\spool\\PRINTERS\\*.*' : 'del /f /q "%systemroot%\\System32\\spool\\PRINTERS\\*.*" >nul 2>&1'}
echo Reiniciando servicio de cola de impresion...
${v.dryRun ? 'echo [SIMULACION] net start spooler' : 'net start spooler'}`,
    ps1Body: (v) => `Write-Log "Deteniendo servicio de cola de impresion (Spooler)..."
if ($DryRun) { Write-Log "[SIMULACION] Stop-Service spooler -Force" } else { Stop-Service spooler -Force -ErrorAction SilentlyContinue }

Write-Log "Limpiando trabajos de impresion atascados..."
if ($DryRun) {
    Write-Log "[SIMULACION] Remove-Item spool\\PRINTERS\\*"
} else {
    Remove-Item "$env:systemroot\\System32\\spool\\PRINTERS\\*" -Force -ErrorAction SilentlyContinue
}

Write-Log "Reiniciando servicio de cola de impresion..."
if ($DryRun) { Write-Log "[SIMULACION] Start-Service spooler" } else { Start-Service spooler -ErrorAction SilentlyContinue }`
  });

  // ---------- 18. Registro de Windows: backup + edicion ----------
  T.push({
    id: 'registry-backup-edit',
    name: 'Backup y edicion segura de clave de registro',
    category: 'Registro',
    icon: '🗝️',
    risk: 'alto',
    requiresAdmin: true,
    description: 'Exporta siempre una copia de seguridad de la clave antes de aplicar cualquier cambio sobre ella.',
    fields: [
      { key: 'keyPath', label: 'Ruta de la clave (ej: HKCU\\Software\\MiApp)', type: 'text', default: 'HKCU\\Software\\MiApp' },
      { key: 'backupPath', label: 'Ruta del archivo de backup .reg', type: 'text', default: '.\\backups\\registro_backup.reg' },
      { key: 'action', label: 'Accion sobre la clave', type: 'select', options: ['Solo backup (no modificar)', 'Eliminar clave completa'], default: 'Solo backup (no modificar)' }
    ],
    riskNotes: ['Modificar o eliminar claves de registro incorrectas puede provocar inestabilidad del sistema o de aplicaciones.'],
    riskyFields: [
      { key: 'action', label: 'Se eliminara permanentemente la clave de registro indicada (tras backup).', level: 'alto', when: (val) => val === 'Eliminar clave completa' }
    ],
    checklistPre: ['Verificar que la ruta de la clave es exactamente la correcta.', 'Confirmar que existe espacio y permisos para guardar el backup .reg.'],
    checklistPost: ['Conservar el archivo .reg de backup hasta confirmar que no hay efectos secundarios.'],
    rollback: 'Para revertir, hacer doble clic en el archivo .reg exportado o ejecutar "reg import <archivo>.reg".',
    batBody: (v) => `echo Exportando backup de la clave "${v.keyPath}" antes de cualquier cambio...
if not exist "backups" mkdir "backups"
reg export "${v.keyPath}" "${v.backupPath}" /y
${v.action === 'Eliminar clave completa' ? `echo.
echo Eliminando clave "${v.keyPath}"...
${v.dryRun ? `echo [SIMULACION] reg delete "${v.keyPath}" /f` : `reg delete "${v.keyPath}" /f`}` : 'echo Solo se realizo el backup, no se modifico la clave.'}
echo.
echo Backup disponible en: ${v.backupPath}`,
    ps1Body: (v) => `Write-Log "Exportando backup de la clave ${v.keyPath} antes de cualquier cambio..."
$backupDir = Split-Path -Path "${v.backupPath}" -Parent
if ($backupDir -and -not (Test-Path $backupDir)) { New-Item -Path $backupDir -ItemType Directory -Force | Out-Null }
reg export "${v.keyPath}" "${v.backupPath}" /y | Out-Null
Write-Log "Backup guardado en ${v.backupPath}"
${v.action === 'Eliminar clave completa' ? `Write-Log "Eliminando clave ${v.keyPath}..."
if ($DryRun) {
    Write-Log "[SIMULACION] reg delete ${v.keyPath} /f"
} else {
    reg delete "${v.keyPath}" /f | Out-Null
}` : 'Write-Log "Solo se realizo el backup, no se modifico la clave."'}`
  });

  // ---------- 19. Windows Update diagnostico ----------
  T.push({
    id: 'windows-update-repair',
    name: 'Diagnostico y reparacion de Windows Update',
    category: 'Windows Update',
    icon: '🔧',
    risk: 'medio',
    requiresAdmin: true,
    description: 'Ejecuta SFC, DISM y opcionalmente reinicia los componentes de Windows Update (SoftwareDistribution/catroot2).',
    fields: [
      { key: 'resetComponents', label: 'Reiniciar componentes de Windows Update (renombra SoftwareDistribution y catroot2)', type: 'checkbox', default: false }
    ],
    riskNotes: ['DISM y SFC pueden tardar bastante tiempo en completarse.'],
    riskyFields: [
      { key: 'resetComponents', label: 'Se detienen servicios de Windows Update y se renombran sus carpetas de cache.', level: 'medio' }
    ],
    checklistPre: ['Confirmar que el equipo tiene espacio en disco suficiente para las operaciones de DISM.'],
    checklistPost: ['Volver a intentar Windows Update tras el proceso.'],
    rollback: 'Las carpetas renombradas (SoftwareDistribution.bak, catroot2.bak) se recrean automaticamente; si algo falla, pueden restaurarse manualmente renombrandolas de vuelta.',
    batBody: (v) => `echo Ejecutando comprobacion de archivos de sistema (SFC)...
${v.dryRun ? 'echo [SIMULACION] sfc /scannow' : 'sfc /scannow'}
echo.
echo Ejecutando reparacion de imagen (DISM)...
${v.dryRun ? 'echo [SIMULACION] DISM /Online /Cleanup-Image /RestoreHealth' : 'DISM /Online /Cleanup-Image /RestoreHealth'}
${v.resetComponents ? `echo.
echo Reiniciando componentes de Windows Update...
${v.dryRun ? 'echo [SIMULACION] detener BITS/wuauserv, renombrar SoftwareDistribution y catroot2, reiniciar servicios' : `net stop bits
net stop wuauserv
ren "%windir%\\SoftwareDistribution" SoftwareDistribution.bak
ren "%windir%\\System32\\catroot2" catroot2.bak
net start bits
net start wuauserv`}` : ''}`,
    ps1Body: (v) => `Write-Log "Ejecutando comprobacion de archivos de sistema (SFC)..."
if ($DryRun) { Write-Log "[SIMULACION] sfc /scannow" } else { sfc /scannow | Out-String | Write-Log }

Write-Log "Ejecutando reparacion de imagen (DISM)..."
if ($DryRun) { Write-Log "[SIMULACION] DISM /Online /Cleanup-Image /RestoreHealth" } else { DISM /Online /Cleanup-Image /RestoreHealth | Out-String | Write-Log }

${v.resetComponents ? `Write-Log "Reiniciando componentes de Windows Update..."
if ($DryRun) {
    Write-Log "[SIMULACION] Stop-Service bits,wuauserv; renombrar SoftwareDistribution y catroot2; Start-Service"
} else {
    try {
        Stop-Service bits, wuauserv -Force -ErrorAction Stop
        Rename-Item "$env:windir\\SoftwareDistribution" "SoftwareDistribution.bak" -ErrorAction SilentlyContinue
        Rename-Item "$env:windir\\System32\\catroot2" "catroot2.bak" -ErrorAction SilentlyContinue
        Start-Service bits, wuauserv -ErrorAction Stop
    } catch {
        Write-Log ("ERROR gestionando componentes de Windows Update: " + $_.Exception.Message)
    }
}` : ''}`
  });

  // ---------- 20. Logs de soporte para CAU ----------
  T.push({
    id: 'cau-log-collector',
    name: 'Recolector de logs para CAU',
    category: 'Logs CAU',
    icon: '📁',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Recopila los logs de eventos y del sistema mas habituales para adjuntar a una incidencia.',
    fields: [
      { key: 'outputFolder', label: 'Carpeta de salida', type: 'text', default: '.\\logs_cau' }
    ],
    riskNotes: ['Solo lectura y copia de logs existentes, no elimina ni modifica nada.'],
    checklistPre: ['Confirmar espacio disponible en la carpeta de salida.'],
    checklistPost: ['Comprimir la carpeta de salida y adjuntarla al ticket.'],
    rollback: null,
    batBody: (v) => `if not exist "${v.outputFolder}" mkdir "${v.outputFolder}"
echo Exportando log de eventos de Sistema...
wevtutil epl System "${v.outputFolder}\\System.evtx" /ow:true
echo Exportando log de eventos de Aplicacion...
wevtutil epl Application "${v.outputFolder}\\Application.evtx" /ow:true
echo Copiando CBS.log...
copy /y "%windir%\\Logs\\CBS\\CBS.log" "${v.outputFolder}\\CBS.log" >nul 2>&1
echo Copiando setupact.log si existe...
copy /y "%windir%\\Panther\\setupact.log" "${v.outputFolder}\\setupact.log" >nul 2>&1
echo Logs recopilados en ${v.outputFolder}`,
    ps1Body: (v) => `$outputFolder = "${v.outputFolder}"
if (-not (Test-Path $outputFolder)) { New-Item -Path $outputFolder -ItemType Directory -Force | Out-Null }
Write-Log "Exportando log de eventos de Sistema..."
wevtutil epl System (Join-Path $outputFolder "System.evtx") /ow:true
Write-Log "Exportando log de eventos de Aplicacion..."
wevtutil epl Application (Join-Path $outputFolder "Application.evtx") /ow:true
Write-Log "Copiando CBS.log..."
Copy-Item "$env:windir\\Logs\\CBS\\CBS.log" (Join-Path $outputFolder "CBS.log") -ErrorAction SilentlyContinue
Write-Log "Copiando setupact.log si existe..."
Copy-Item "$env:windir\\Panther\\setupact.log" (Join-Path $outputFolder "setupact.log") -ErrorAction SilentlyContinue
Write-Log "Logs recopilados en $outputFolder"`
  });

  // ---------- 21. Script personalizado guiado ----------
  T.push({
    id: 'custom-guided',
    name: 'Script personalizado guiado',
    category: 'Personalizado',
    icon: '🛠️',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Escribe tus propios comandos (uno por linea); el motor de riesgo los analiza automaticamente antes de generar.',
    fields: [
      { key: 'customCommands', label: 'Comandos (uno por linea, en formato compatible con BAT o PowerShell segun el tipo elegido)', type: 'textarea', default: 'echo Mi comando personalizado' }
    ],
    riskNotes: ['El nivel de riesgo de este script depende directamente de los comandos introducidos; revisa siempre el analisis de riesgo antes de ejecutar.'],
    checklistPre: ['Revisar linea por linea los comandos introducidos.', 'Comprobar el analisis de riesgo automatico antes de generar.'],
    checklistPost: ['Ejecutar primero en un equipo de pruebas si el riesgo detectado es medio o alto.'],
    rollback: 'Depende de los comandos introducidos; no hay rollback generico posible para comandos libres.',
    batBody: (v) => `echo ===== Comandos personalizados =====
${v.customCommands || 'echo (sin comandos definidos)'}`,
    ps1Body: (v) => `Write-Log "===== Comandos personalizados ====="
${v.customCommands || 'Write-Log "(sin comandos definidos)"'}`
  });

  // ---------- 22. Plantilla vacia profesional ----------
  T.push({
    id: 'empty-template',
    name: 'Plantilla vacia profesional',
    category: 'Personalizado',
    icon: '📝',
    risk: 'bajo',
    requiresAdmin: false,
    description: 'Solo la estructura base (cabecera, logging, manejo de errores) para construir tu propio script desde cero.',
    fields: [
      { key: 'customCommands', label: 'Comandos iniciales opcionales (uno por linea)', type: 'textarea', default: '' }
    ],
    riskNotes: ['El riesgo depende de lo que se añada al esqueleto; por defecto no incluye ninguna accion.'],
    checklistPre: ['Ninguno especifico para el esqueleto vacio.'],
    checklistPost: ['Revisar y completar el script antes de usarlo en un equipo real.'],
    rollback: null,
    batBody: (v) => `echo Esqueleto de script listo para completar.
${v.customCommands ? v.customCommands : ':: (Añade aqui tus comandos)'}`,
    ps1Body: (v) => `Write-Log "Esqueleto de script listo para completar."
${v.customCommands ? v.customCommands : '# (Añade aqui tus comandos)'}`
  });

  return T;
})();
