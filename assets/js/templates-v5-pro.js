/* ============================================================
   ScriptForge 404 - templates-v5-pro.js
   Pack V5 Pro: 30 plantillas especificas de uso diario CAU/N2.

   Objetivo:
   - Sustituir plantillas genericas por scripts mucho mas concretos.
   - Mantener modo diagnostico por defecto.
   - Activar reparacion solo mediante campo executeRepair/executeChanges.
   - Evitar rutas corporativas, credenciales o nombres internos hardcodeados.
   ============================================================ */

(function () {
  if (typeof SFTemplates === 'undefined' || !Array.isArray(SFTemplates)) {
    console.warn('SFTemplates no esta disponible. No se cargan plantillas V5 Pro.');
    return;
  }

  const templates = SFTemplates;
  const exists = (id) => templates.some(t => t.id === id);
  const add = (tpl) => { if (!exists(tpl.id)) templates.unshift(tpl); };

  const psq = (s) => String(s ?? '').replace(/'/g, "''");
  const batq = (s) => String(s ?? '').replace(/"/g, '');
  const bool = (v) => !!v;
  const tpl = (strings, ...values) => {
    const raw = String.raw(strings, ...values);
    let out = '';
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === '\\' && raw[i + 1] === '\\') { out += '\\'; i++; }
      else if (raw[i] === '\\' && raw[i + 1] === 'n') { out += '\n'; i++; }
      else { out += raw[i]; }
    }
    return out;
  };

  const fieldTarget = (label, def) => ({ key: 'target', label, type: 'text', default: def });
  const fieldOut = { key: 'outputFolder', label: 'Carpeta de salida/logs', type: 'text', default: 'C:\\CAU\\ScriptForge404' };
  const fieldRepair = { key: 'executeRepair', label: 'Ejecutar reparacion/cambios reales', type: 'checkbox', default: false };
  const fieldOpen = { key: 'openTools', label: 'Abrir herramientas/paneles relacionados al terminar', type: 'checkbox', default: false };

  function headerPs(v, name) {
    return `$OutputFolder = '${psq(v.outputFolder || 'C:\\CAU\\ScriptForge404')}'
if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
Write-Log 'V5 Pro - ${psq(name)}'
Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
Write-Log ('Salida: ' + $OutputFolder)`;
  }

  function headerBat(v, name) {
    return `set "OUT=${batq(v.outputFolder || 'C:\\CAU\\ScriptForge404')}"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5 Pro - ${batq(name)}
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%`;
  }

  function riskHighRepair() {
    return [{ key: 'executeRepair', label: 'Al activar reparacion se modifican servicios, registro, caches, configuraciones o componentes del sistema.', level: 'alto' }];
  }

  function riskMediumRepair() {
    return [{ key: 'executeRepair', label: 'Al activar reparacion se realizan cambios locales controlados.', level: 'medio' }];
  }

  // 01
  add({
    id: 'v5-pro-01-diagnostico-rapido-pc',
    name: 'V5 Pro - Diagnostico rapido PC',
    category: 'Diagnostico', icon: '🩺', risk: 'bajo', requiresAdmin: false,
    description: 'Inventario rapido para CAU: sistema, usuario, dominio, IP, disco, uptime, procesos y errores recientes.',
    fields: [fieldOut, { key: 'hours', label: 'Horas de eventos a revisar', type: 'number', default: 24 }],
    riskNotes: ['Solo lectura. Genera evidencias para ticket.'],
    checklistPre: ['Ejecutar con el usuario afectado si el problema depende del perfil.', 'Comprobar que hay permisos para escribir en la carpeta de salida.'],
    checklistPost: ['Adjuntar TXT/CSV/HTML generado al ticket.', 'Revisar disco libre, IP, dominio y errores críticos.'], rollback: 'No aplica: solo lectura.',
    batBody: (v) => tpl`${headerBat(v, 'Diagnostico rapido PC')}
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ComputerInfo | Select CsName,OsName,OsVersion,OsBuildNumber,CsDomain,CsManufacturer,CsModel,CsTotalPhysicalMemory | Format-List | Out-File '%OUT%\\diagnostico_rapido.txt'; Get-NetIPConfiguration | Out-File '%OUT%\\red.txt'; Get-CimInstance Win32_LogicalDisk | Select DeviceID,Size,FreeSpace | Export-Csv '%OUT%\\discos.csv' -NoTypeInformation; Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddHours(-${v.hours || 24})} -MaxEvents 50 | Select TimeCreated,Id,ProviderName,Message | Export-Csv '%OUT%\\eventos_criticos.csv' -NoTypeInformation"
echo [OK] Diagnostico exportado en %OUT%`,
    ps1Body: (v) => tpl`${headerPs(v, 'Diagnostico rapido PC')}
$hours = [int]'${psq(v.hours || 24)}'
Get-ComputerInfo | Select-Object CsName,OsName,OsVersion,OsBuildNumber,CsDomain,CsManufacturer,CsModel,CsTotalPhysicalMemory | Format-List | Out-File (Join-Path $OutputFolder 'diagnostico_rapido.txt') -Encoding UTF8
Get-NetIPConfiguration | Out-File (Join-Path $OutputFolder 'red.txt') -Encoding UTF8
Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID,@{n='SizeGB';e={[math]::Round($_.Size/1GB,2)}},@{n='FreeGB';e={[math]::Round($_.FreeSpace/1GB,2)}} | Export-Csv (Join-Path $OutputFolder 'discos.csv') -NoTypeInformation -Encoding UTF8
Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 ProcessName,Id,CPU,WS | Export-Csv (Join-Path $OutputFolder 'top_procesos.csv') -NoTypeInformation -Encoding UTF8
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddHours(-$hours)} -ErrorAction SilentlyContinue | Select-Object -First 80 TimeCreated,Id,ProviderName,Message | Export-Csv (Join-Path $OutputFolder 'eventos_criticos.csv') -NoTypeInformation -Encoding UTF8
Write-Log 'Diagnostico rapido exportado.'`
  });

  // 02
  add({
    id: 'v5-pro-02-informe-completo-ticket',
    name: 'V5 Pro - Informe completo para ticket',
    category: 'Tickets CAU', icon: '🎫', risk: 'bajo', requiresAdmin: false,
    description: 'Genera un paquete de evidencias para escalar a N2/N3: inventario, red, eventos, software, servicios, impresoras y resumen HTML.',
    fields: [fieldOut, { key: 'ticketId', label: 'Numero de ticket/incidencia', type: 'text', default: 'TICKET-0000' }, { key: 'issueType', label: 'Tipo de incidencia', type: 'select', options: ['Red', 'Outlook', 'Teams', 'Impresora', 'Equipo lento', 'Office', 'Citrix', 'Intune/SCCM', 'General'], default: 'General' }],
    riskNotes: ['Solo lectura. Puede recopilar datos técnicos del equipo.'],
    checklistPre: ['Confirmar que el usuario autoriza recopilar evidencias técnicas.', 'No incluir datos sensibles innecesarios en el ticket.'],
    checklistPost: ['Revisar el HTML antes de adjuntarlo.', 'Comprimir carpeta si se requiere escalado.'], rollback: 'No aplica: solo lectura.',
    batBody: (v) => tpl`${headerBat(v, 'Informe completo para ticket')}
set "TICKET=${batq(v.ticketId || 'TICKET-0000')}"
set "ISSUE=${batq(v.issueType || 'General')}"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$o='%OUT%'; $t='${batq(v.ticketId || 'TICKET-0000')}'; $i='${batq(v.issueType || 'General')}'; Get-ComputerInfo | Out-File (Join-Path $o 'computerinfo.txt'); Get-NetIPConfiguration | Out-File (Join-Path $o 'network.txt'); Get-Service | Sort Status,Name | Export-Csv (Join-Path $o 'services.csv') -NoTypeInformation; Get-Printer -ErrorAction SilentlyContinue | Export-Csv (Join-Path $o 'printers.csv') -NoTypeInformation; Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Select DisplayName,DisplayVersion,Publisher,InstallDate | Where DisplayName | Export-Csv (Join-Path $o 'software.csv') -NoTypeInformation; '<h1>'+ $t +'</h1><p>'+ $i +'</p><p>'+ $env:COMPUTERNAME +'</p>' | Set-Content (Join-Path $o 'informe.html')"
echo [OK] Informe generado: %OUT%`,
    ps1Body: (v) => tpl`${headerPs(v, 'Informe completo para ticket')}
$Ticket = '${psq(v.ticketId || 'TICKET-0000')}'
$Issue = '${psq(v.issueType || 'General')}'
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
Write-Log 'Informe completo generado.'`
  });

  // 03
  add({
    id: 'v5-pro-03-reparar-red-basica',
    name: 'V5 Pro - Reparar red basica',
    category: 'Red', icon: '🌐', risk: 'medio', requiresAdmin: true,
    description: 'Diagnostica y, opcionalmente, repara conectividad basica: DNS, IP, gateway, adaptador, ping y proxy WinHTTP.',
    fields: [fieldOut, fieldRepair, { key: 'testHost', label: 'Host de prueba', type: 'text', default: '8.8.8.8' }, { key: 'restartAdapter', label: 'Reiniciar adaptador activo', type: 'checkbox', default: false }],
    riskyFields: riskMediumRepair(), riskNotes: ['Puede renovar IP y reiniciar adaptador si se activa reparacion.'],
    checklistPre: ['Confirmar si el equipo usa VPN o proxy corporativo.', 'Guardar trabajo abierto si se reinicia adaptador.'],
    checklistPost: ['Probar intranet, internet, DNS y recursos UNC.'], rollback: 'Reiniciar el equipo o restaurar proxy/adaptador manualmente si el cambio no ayuda.',
    batBody: (v) => tpl`${headerBat(v, 'Reparar red basica')}
ipconfig /all > "%OUT%\\ipconfig.txt"
route print > "%OUT%\\rutas.txt"
ping -n 4 ${batq(v.testHost || '8.8.8.8')}
netsh winhttp show proxy
${bool(v.executeRepair) ? `ipconfig /flushdns
ipconfig /release
ipconfig /renew
${bool(v.restartAdapter) ? 'powershell -NoProfile -Command "Get-NetAdapter | Where Status -eq Up | Restart-NetAdapter -Confirm:$false"' : 'rem Reinicio de adaptador no solicitado'}` : 'echo [MODO DIAGNOSTICO] No se aplican cambios.'}`,
    ps1Body: (v) => tpl`${headerPs(v, 'Reparar red basica')}
$TestHost = '${psq(v.testHost || '8.8.8.8')}'
Get-NetIPConfiguration | Out-File (Join-Path $OutputFolder 'net_ipconfig.txt') -Encoding UTF8
Get-NetRoute | Export-Csv (Join-Path $OutputFolder 'net_routes.csv') -NoTypeInformation -Encoding UTF8
Test-Connection $TestHost -Count 4 -ErrorAction SilentlyContinue | Out-String | Write-Log
netsh winhttp show proxy | Out-String | Write-Log
if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) {
    ipconfig /flushdns | Out-String | Write-Log
    ipconfig /release | Out-String | Write-Log
    ipconfig /renew | Out-String | Write-Log
    ${bool(v.restartAdapter) ? 'Get-NetAdapter | Where-Object Status -eq Up | Restart-NetAdapter -Confirm:$false' : 'Write-Log "Reinicio de adaptador no solicitado."'}
} else { Write-Log 'Modo diagnostico: sin cambios.' }`
  });

  // 04
  add({
    id: 'v5-pro-04-reset-dns-winsock-tcpip',
    name: 'V5 Pro - Reset DNS Winsock TCP/IP',
    category: 'Red', icon: '🧬', risk: 'alto', requiresAdmin: true,
    description: 'Reset controlado de DNS, Winsock y pila TCP/IP. Pensado para incidencias de conectividad persistente.',
    fields: [fieldOut, fieldRepair, { key: 'resetWinHttp', label: 'Resetear proxy WinHTTP', type: 'checkbox', default: false }, { key: 'scheduleReboot', label: 'Programar reinicio en 60 segundos', type: 'checkbox', default: false }],
    riskyFields: riskHighRepair(), riskNotes: ['Winsock/TCP reset puede requerir reinicio.', 'Puede afectar VPN/proxy/adaptadores.'],
    checklistPre: ['Confirmar ventana de mantenimiento o permiso del usuario.', 'Anotar configuraciones especiales de red/proxy/VPN.'],
    checklistPost: ['Reiniciar si se ha tocado Winsock/TCP.', 'Validar VPN, intranet y recursos de red.'], rollback: 'No hay rollback directo. Reaplicar configuración corporativa de red/proxy/VPN si procede.',
    batBody: (v) => tpl`${headerBat(v, 'Reset DNS Winsock TCPIP')}
ipconfig /all > "%OUT%\\antes_ipconfig.txt"
netsh winsock show catalog > "%OUT%\\winsock_antes.txt"
${bool(v.executeRepair) ? `ipconfig /flushdns
netsh winsock reset
netsh int ip reset "%OUT%\\tcpip_reset.log"
${bool(v.resetWinHttp) ? 'netsh winhttp reset proxy' : 'rem Proxy WinHTTP no modificado'}
${bool(v.scheduleReboot) ? 'shutdown /r /t 60 /c "Reinicio necesario tras reset red ScriptForge 404"' : 'echo Reinicio recomendado manualmente.'}` : 'echo [MODO DIAGNOSTICO] No se resetea Winsock/TCP/IP.'}`,
    ps1Body: (v) => tpl`${headerPs(v, 'Reset DNS Winsock TCPIP')}
ipconfig /all | Out-File (Join-Path $OutputFolder 'antes_ipconfig.txt') -Encoding UTF8
netsh winsock show catalog | Out-File (Join-Path $OutputFolder 'winsock_antes.txt') -Encoding UTF8
if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) {
    ipconfig /flushdns | Out-String | Write-Log
    netsh winsock reset | Out-String | Write-Log
    netsh int ip reset (Join-Path $OutputFolder 'tcpip_reset.log') | Out-String | Write-Log
    ${bool(v.resetWinHttp) ? 'netsh winhttp reset proxy | Out-String | Write-Log' : 'Write-Log "Proxy WinHTTP no modificado."'}
    ${bool(v.scheduleReboot) ? 'shutdown /r /t 60 /c "Reinicio necesario tras reset red ScriptForge 404"' : 'Write-Log "Reinicio recomendado manualmente."'}
} else { Write-Log 'Modo diagnostico: no se resetea Winsock/TCP/IP.' }`
  });

  // 05
  add({
    id: 'v5-pro-05-mapear-unidades-red',
    name: 'V5 Pro - Mapear unidades de red',
    category: 'Unidades de red', icon: '🗂️', risk: 'medio', requiresAdmin: false,
    description: 'Mapea varias unidades de red desde una lista LETRA=\\\\servidor\\recurso, con persistencia y borrado previo opcional.',
    fields: [fieldOut, { key: 'mapList', label: 'Unidades una por linea', type: 'textarea', default: 'P:=\\\\servidor\\departamento\nS:=\\\\servidor\\comun' }, { key: 'persistent', label: 'Persistente tras reiniciar', type: 'checkbox', default: true }, { key: 'deleteExisting', label: 'Eliminar mapeos previos de esas letras', type: 'checkbox', default: true }],
    riskNotes: ['Modifica unidades de red del usuario actual.'],
    checklistPre: ['Validar rutas UNC y permisos.', 'Cerrar documentos abiertos en esas letras.'],
    checklistPost: ['Ejecutar net use.', 'Probar apertura desde Explorador.'], rollback: 'net use LETRA: /delete /y por cada unidad.',
    batBody: (v) => tpl`${headerBat(v, 'Mapear unidades de red')}
set "MAPFILE=%OUT%\\maplist.txt"
> "%MAPFILE%" (
${String(v.mapList || '').split(/\n/).map(l => 'echo ' + batq(l)).join('\n')}
)
for /f "usebackq tokens=1,* delims==" %%A in ("%MAPFILE%") do (
  echo Mapeando %%A a %%B
  ${bool(v.deleteExisting) ? 'net use "%%A" /delete /y >nul 2>&1' : 'rem No se borra mapeo previo'}
  net use "%%A" "%%B" /persistent:${bool(v.persistent) ? 'yes' : 'no'}
)
net use`,
    ps1Body: (v) => tpl`${headerPs(v, 'Mapear unidades de red')}
$maps = @(${String(v.mapList || 'P:=\\\\servidor\\departamento').split(/\n/).map(l => "'" + psq(l.trim()) + "'").join(', ')})
$maps | ForEach-Object {
    $line = $_.Trim(); if (-not $line -or $line.StartsWith('#')) { return }
    $parts = $line -split '=', 2
    if ($parts.Count -lt 2) { Write-Log ('Linea de mapeo ignorada: ' + $line); return }
    $drive = $parts[0].Trim().TrimEnd(':')
    $unc = $parts[1].Trim()
    Write-Log ('Mapeando ' + $drive + ': a ' + $unc)
    if (${bool(v.deleteExisting) ? '$true' : '$false'}) { Remove-PSDrive -Name $drive -Force -ErrorAction SilentlyContinue }
    if (-not $DryRun) { New-PSDrive -Name $drive -PSProvider FileSystem -Root $unc -Persist:$${bool(v.persistent) ? 'true' : 'false'} | Out-Null } else { Write-Log ('DryRun activo: no se crea la unidad ' + $drive + ':') }
}
net use | Out-String | Write-Log`
  });

  // 06
  add({
    id: 'v5-pro-06-reparar-unidades-red',
    name: 'V5 Pro - Reparar unidades de red',
    category: 'Unidades de red', icon: '🔧', risk: 'medio', requiresAdmin: false,
    description: 'Diagnostica unidades desconectadas, servidor SMB 445, rutas UNC y credenciales guardadas. Puede reconectar unidades persistentes.',
    fields: [fieldOut, fieldRepair, { key: 'server', label: 'Servidor principal', type: 'text', default: 'servidor' }, { key: 'uncPath', label: 'Ruta UNC de prueba', type: 'text', default: '\\\\servidor\\recurso' }],
    riskyFields: riskMediumRepair(), riskNotes: ['Puede eliminar/reconectar mapeos si se activa reparacion.'],
    checklistPre: ['Verificar si el usuario tiene VPN activa.', 'Confirmar permisos sobre el recurso.'], checklistPost: ['Validar acceso a recursos compartidos.', 'Guardar credenciales solo si la politica corporativa lo permite.'], rollback: 'Volver a mapear manualmente unidades eliminadas o restaurar credenciales.',
    batBody: (v) => tpl`${headerBat(v, 'Reparar unidades de red')}
net use > "%OUT%\\netuse_antes.txt"
cmdkey /list > "%OUT%\\cmdkey.txt"
powershell -NoProfile -Command "Test-NetConnection -ComputerName '${batq(v.server || 'servidor')}' -Port 445"
dir "${batq(v.uncPath || '\\\\servidor\\recurso')}"
${bool(v.executeRepair) ? 'net use * /persistent:yes' : 'echo [MODO DIAGNOSTICO] No se reconectan unidades.'}`,
    ps1Body: (v) => tpl`${headerPs(v, 'Reparar unidades de red')}
$Server = '${psq(v.server || 'servidor')}'
$Unc = '${psq(v.uncPath || '\\\\servidor\\recurso')}'
net use | Out-File (Join-Path $OutputFolder 'netuse_antes.txt') -Encoding UTF8
cmdkey /list | Out-File (Join-Path $OutputFolder 'cmdkey.txt') -Encoding UTF8
Test-NetConnection -ComputerName $Server -Port 445 | Out-String | Write-Log
if (Test-Path $Unc) { Write-Log "Acceso OK a $Unc" } else { Write-Log "No hay acceso a $Unc" }
Get-SmbMapping -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder 'smb_mappings.csv') -NoTypeInformation -Encoding UTF8
if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) { net use * /persistent:yes | Out-String | Write-Log } else { Write-Log 'Modo diagnostico: sin reconexion forzada.' }`
  });

  // 07 Outlook basico
  add({
    id: 'v5-pro-07-reparar-outlook-basico', name: 'V5 Pro - Reparar Outlook basico', category: 'Office / Outlook', icon: '📧', risk: 'medio', requiresAdmin: false,
    description: 'Acciones seguras para Outlook Classic: cerrar proceso, modo seguro, resetnavpane, cleanviews y panel de perfiles.',
    fields: [fieldOut, fieldRepair, { key: 'operation', label: 'Operacion', type: 'select', options: ['diagnostico', 'safe-mode', 'resetnavpane', 'cleanviews', 'profiles'], default: 'diagnostico' }],
    riskyFields: riskMediumRepair(), riskNotes: ['Algunas opciones resetean vistas o paneles de Outlook del usuario.'], checklistPre: ['Cerrar correos en edición.', 'Confirmar que es Outlook Classic.'], checklistPost: ['Abrir Outlook y validar calendario/correo.', 'Si persiste, pasar a plantilla avanzada.'], rollback: 'Las vistas/paneles pueden requerir configuración manual de nuevo.',
    batBody: (v) => tpl`${headerBat(v, 'Reparar Outlook basico')}
tasklist | findstr /i OUTLOOK.EXE
${bool(v.executeRepair) ? `taskkill /IM OUTLOOK.EXE /F >nul 2>&1
${v.operation === 'safe-mode' ? 'start "" outlook.exe /safe' : v.operation === 'resetnavpane' ? 'start "" outlook.exe /resetnavpane' : v.operation === 'cleanviews' ? 'start "" outlook.exe /cleanviews' : v.operation === 'profiles' ? 'start "" outlook.exe /profiles' : 'start "" outlook.exe'}` : 'echo [MODO DIAGNOSTICO] No se modifica Outlook.'}`,
    ps1Body: (v) => tpl`${headerPs(v, 'Reparar Outlook basico')}
Get-Process OUTLOOK -ErrorAction SilentlyContinue | Select-Object ProcessName,Id,StartTime | Out-String | Write-Log
$operation = '${psq(v.operation || 'diagnostico')}'
if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) {
    Get-Process OUTLOOK -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    $arg = switch ($operation) { 'safe-mode' {'/safe'} 'resetnavpane' {'/resetnavpane'} 'cleanviews' {'/cleanviews'} 'profiles' {'/profiles'} default {''} }
    Start-Process outlook.exe -ArgumentList $arg
} else { Write-Log 'Modo diagnostico: sin cambios.' }`
  });

  // 08 Outlook avanzado
  add({
    id: 'v5-pro-08-reparar-outlook-avanzado', name: 'V5 Pro - Reparar Outlook avanzado', category: 'Office / Outlook', icon: '🧰', risk: 'alto', requiresAdmin: false,
    description: 'Diagnostica y repara caches de Outlook: RoamCache, Autocomplete, Resiliency y add-ins. No borra perfiles por defecto.',
    fields: [fieldOut, fieldRepair, { key: 'clearRoamCache', label: 'Limpiar RoamCache', type: 'checkbox', default: true }, { key: 'clearResiliency', label: 'Limpiar Resiliency DisabledItems/CrashingAddinList', type: 'checkbox', default: false }, { key: 'openProfiles', label: 'Abrir panel de perfiles al terminar', type: 'checkbox', default: false }],
    riskyFields: riskHighRepair(), riskNotes: ['Puede borrar caches y claves de resiliencia de Outlook del usuario.'], checklistPre: ['Cerrar Outlook.', 'No usar si el usuario necesita conservar Autocomplete/caches sin respaldo.'], checklistPost: ['Abrir Outlook y comprobar arranque, calendario y add-ins.'], rollback: 'Las caches se regeneran. Las claves Resiliency se recrean automáticamente por Office.',
    batBody: (v) => tpl`${headerBat(v, 'Reparar Outlook avanzado')}
tasklist | findstr /i OUTLOOK.EXE > "%OUT%\\outlook_process.txt" 2>nul
if exist "%LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache" dir "%LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache" > "%OUT%\\roamcache_antes.txt"
reg query "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency" > "%OUT%\\resiliency_antes.txt" 2>nul
${bool(v.executeRepair) ? `taskkill /IM OUTLOOK.EXE /F >nul 2>&1
${bool(v.clearRoamCache) ? 'del /f /q "%LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache\\*" >nul 2>&1' : 'rem RoamCache no solicitado'}
${bool(v.clearResiliency) ? 'reg delete "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DisabledItems" /f >nul 2>&1\nreg delete "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\CrashingAddinList" /f >nul 2>&1' : 'rem Resiliency no solicitado'}
${bool(v.openProfiles) ? 'start "" outlook.exe /profiles' : 'start "" outlook.exe'}` : 'echo [MODO DIAGNOSTICO] No se limpian caches.'}`,
    ps1Body: (v) => tpl`${headerPs(v, 'Reparar Outlook avanzado')}
Get-Process OUTLOOK -ErrorAction SilentlyContinue | Select-Object ProcessName,Id,StartTime | Out-File (Join-Path $OutputFolder 'outlook_process.txt') -ErrorAction SilentlyContinue
$Roam = Join-Path $env:LOCALAPPDATA 'Microsoft\Outlook\RoamCache'
if (Test-Path $Roam) { Get-ChildItem $Roam | Select-Object Name,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder 'roamcache_antes.csv') -NoTypeInformation -Encoding UTF8 }
reg export 'HKCU\Software\Microsoft\Office\16.0\Outlook\Resiliency' (Join-Path $OutputFolder 'resiliency_antes.reg') /y | Out-String | Write-Log
if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) {
    Get-Process OUTLOOK -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    ${bool(v.clearRoamCache) ? 'if (Test-Path $Roam) { Remove-Item (Join-Path $Roam "*") -Force -ErrorAction SilentlyContinue }' : 'Write-Log "RoamCache no solicitado."'}
    ${bool(v.clearResiliency) ? "Remove-Item 'HKCU:\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DisabledItems' -Recurse -Force -ErrorAction SilentlyContinue\n    Remove-Item 'HKCU:\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\CrashingAddinList' -Recurse -Force -ErrorAction SilentlyContinue" : 'Write-Log "Resiliency no solicitado."'}
    Start-Process outlook.exe ${bool(v.openProfiles) ? "-ArgumentList '/profiles'" : ''}
} else { Write-Log 'Modo diagnostico: sin limpieza.' }`
  });

  // 09 Teams Outlook add-in
  add({
    id: 'v5-pro-09-reparar-boton-teams-outlook', name: 'V5 Pro - Reparar boton Teams Meeting en Outlook', category: 'Teams', icon: '📅', risk: 'alto', requiresAdmin: true,
    description: 'Reparacion especifica del add-in Teams Meeting en Outlook Classic: detecta Office x86/x64, ruta TeamsMeetingAdd-in, LoadBehavior, Resiliency y registro DLL.',
    fields: [fieldOut, fieldRepair, { key: 'waitSeconds', label: 'Segundos de espera tras abrir Teams', type: 'number', default: 90 }, { key: 'startApps', label: 'Abrir Teams y Outlook al terminar', type: 'checkbox', default: true }],
    riskyFields: riskHighRepair(), riskNotes: ['Modifica HKCU de Outlook Addins/Resiliency y registra DLL del add-in.', 'Cierra Outlook/Teams.'], checklistPre: ['Cerrar Outlook y Teams.', 'Confirmar que se usa Outlook Classic + Microsoft 365 Apps.', 'Abrir Teams al menos una vez en ese usuario.'], checklistPost: ['Outlook > Calendario > Nueva reunion.', 'Si no aparece, abrir Teams 2 minutos y reiniciar Outlook.'], rollback: 'Restaurar claves HKCU exportadas y dejar que Teams regenere su integracion.',
    batBody: (v) => tpl`${headerBat(v, 'Reparar boton Teams Meeting Outlook')}
tasklist | findstr /i "OUTLOOK.EXE ms-teams.exe msteams.exe Teams.exe" > "%OUT%\\procesos_outlook_teams.txt" 2>nul
reg export "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" "%OUT%\\TeamsAddin_before.reg" /y >nul 2>&1
set "OFFICEBITNESS=x64"
set "REGSVR=%SystemRoot%\\System32\\regsvr32.exe"
reg query "HKLM\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration" /v Platform 2>nul | findstr /i "x86" >nul && set "OFFICEBITNESS=x86" && set "REGSVR=%SystemRoot%\\SysWOW64\\regsvr32.exe"
set "ADDINROOT=%LOCALAPPDATA%\\Microsoft\\TeamsMeetingAdd-in"
if not exist "%ADDINROOT%" (echo [ERROR] No existe TeamsMeetingAdd-in & exit /b 1)
for /f "delims=" %%D in ('powershell -NoProfile -Command "Get-ChildItem -Path $env:LOCALAPPDATA\\Microsoft\\TeamsMeetingAdd-in -Directory | Sort-Object {[version]$_.Name} -Descending | Select -Expand Name"') do if not defined ADDINPATH if exist "%ADDINROOT%\\%%D\\%OFFICEBITNESS%\\Microsoft.Teams.AddinLoader.dll" set "ADDINPATH=%ADDINROOT%\\%%D\\%OFFICEBITNESS%"
if not defined ADDINPATH (echo [ERROR] No se encontro AddinLoader.dll & exit /b 1)
${bool(v.executeRepair) ? `taskkill /IM OUTLOOK.EXE /F >nul 2>&1
taskkill /IM ms-teams.exe /F >nul 2>&1
taskkill /IM msteams.exe /F >nul 2>&1
taskkill /IM Teams.exe /F >nul 2>&1
reg add "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" /v LoadBehavior /t REG_DWORD /d 3 /f
reg add "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" /v FriendlyName /t REG_SZ /d "Microsoft Teams Meeting Add-in for Microsoft Office" /f
reg add "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" /v Description /t REG_SZ /d "Microsoft Teams Meeting Add-in for Microsoft Office" /f
reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DoNotDisableAddinList" /v TeamsAddin.FastConnect /t REG_DWORD /d 1 /f
reg delete "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\DisabledItems" /f >nul 2>&1
reg delete "HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Resiliency\\CrashingAddinList" /f >nul 2>&1
"%REGSVR%" /n /i:user "%ADDINPATH%\\Microsoft.Teams.AddinLoader.dll"
${bool(v.startApps) ? `start "" "ms-teams:"
timeout /t ${batq(v.waitSeconds || 90)} /nobreak >nul
start "" outlook.exe` : 'echo Apertura de apps no solicitada.'}` : 'echo [MODO DIAGNOSTICO] No se toca registro ni DLL.'}`,
    ps1Body: (v) => tpl`${headerPs(v, 'Reparar boton Teams Meeting Outlook')}
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
if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) {
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
    ${bool(v.startApps) ? `Start-Process 'ms-teams:'
    Start-Sleep -Seconds ${parseInt(v.waitSeconds || 90, 10)}
    Start-Process outlook.exe` : 'Write-Log "Apertura de Teams/Outlook no solicitada."'}
} else { Write-Log 'Modo diagnostico: sin tocar registro/DLL.' }`
  });

  // 10 Teams cache
  add({
    id: 'v5-pro-10-limpiar-cache-teams', name: 'V5 Pro - Limpiar cache Teams', category: 'Teams', icon: '🟣', risk: 'medio', requiresAdmin: false,
    description: 'Limpia cache de New Teams y Teams clasico para el usuario actual, con cierre previo de procesos.',
    fields: [fieldOut, fieldRepair, { key: 'classicTeams', label: 'Incluir Teams clasico', type: 'checkbox', default: true }, { key: 'newTeams', label: 'Incluir New Teams', type: 'checkbox', default: true }],
    riskyFields: riskMediumRepair(), riskNotes: ['Cierra Teams y borra caches locales regenerables.'], checklistPre: ['Cerrar llamadas/reuniones.', 'Confirmar que el usuario puede volver a iniciar sesion si se le solicita.'], checklistPost: ['Abrir Teams y validar chat, calendario y reuniones.'], rollback: 'La cache se regenera al abrir Teams.',
    batBody: (v) => tpl`${headerBat(v, 'Limpiar cache Teams')}
tasklist | findstr /i "ms-teams.exe msteams.exe Teams.exe" > "%OUT%\\procesos_teams.txt" 2>nul
${bool(v.executeRepair) ? `taskkill /IM ms-teams.exe /F >nul 2>&1
taskkill /IM msteams.exe /F >nul 2>&1
taskkill /IM Teams.exe /F >nul 2>&1
${bool(v.classicTeams) ? 'for %%D in ("%APPDATA%\\Microsoft\\Teams\\Cache" "%APPDATA%\\Microsoft\\Teams\\GPUCache" "%APPDATA%\\Microsoft\\Teams\\IndexedDB" "%APPDATA%\\Microsoft\\Teams\\Local Storage" "%APPDATA%\\Microsoft\\Teams\\tmp") do if exist %%~D rd /s /q %%~D' : 'rem Teams clasico omitido'}
${bool(v.newTeams) ? 'for %%D in ("%LOCALAPPDATA%\\Packages\\MSTeams_8wekyb3d8bbwe\\LocalCache\\Microsoft\\MSTeams" "%LOCALAPPDATA%\\Publishers\\8wekyb3d8bbwe\\TeamsSharedConfig") do if exist %%~D rd /s /q %%~D' : 'rem New Teams omitido'}
start "" "ms-teams:"` : 'echo [MODO DIAGNOSTICO] No se limpia cache.'}`,
    ps1Body: (v) => tpl`${headerPs(v, 'Limpiar cache Teams')}
Get-Process ms-teams,msteams,Teams -ErrorAction SilentlyContinue | Select-Object ProcessName,Id,StartTime | Export-Csv (Join-Path $OutputFolder 'procesos_teams.csv') -NoTypeInformation -ErrorAction SilentlyContinue
$paths = @()
if (${bool(v.classicTeams) ? '$true' : '$false'}) { $paths += @("$env:APPDATA\Microsoft\Teams\Cache", "$env:APPDATA\Microsoft\Teams\GPUCache", "$env:APPDATA\Microsoft\Teams\IndexedDB", "$env:APPDATA\Microsoft\Teams\Local Storage", "$env:APPDATA\Microsoft\Teams\tmp") }
if (${bool(v.newTeams) ? '$true' : '$false'}) { $paths += @("$env:LOCALAPPDATA\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams", "$env:LOCALAPPDATA\Publishers\8wekyb3d8bbwe\TeamsSharedConfig") }
if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) { Get-Process ms-teams,msteams,Teams -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }
$paths | ForEach-Object { if (Test-Path $_) { Write-Log "Cache: $_"; if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) { Remove-Item $_ -Recurse -Force -ErrorAction SilentlyContinue } } }
if (${bool(v.executeRepair) ? '$true' : '$false'} -and -not $DryRun) { Start-Process 'ms-teams:' }`
  });

  // We'll add remaining templates with concrete safe bodies using compact definitions.

  const compactTemplates = [
    ['v5-pro-11-reparar-teams-completo','V5 Pro - Reparar Teams completo','Teams','🧩','alto',true,'Diagnostico y reparacion completa Teams: procesos, caches, WebView2, paquetes AppX y logs.',
      [fieldOut, fieldRepair, {key:'checkWebView2',label:'Comprobar WebView2',type:'checkbox',default:true}, {key:'exportLogs',label:'Exportar logs Teams',type:'checkbox',default:true}], riskHighRepair(),
      (v)=>tpl`${headerBat(v,'Reparar Teams completo')}\ntasklist | findstr /i "ms-teams.exe msteams.exe Teams.exe" > "%OUT%\\procesos_teams.txt" 2>nul\npowershell -NoProfile -Command "Get-AppxPackage *MSTeams* | Select Name,Version,PackageFullName | Out-File '%OUT%\\teams_appx.txt'; Get-ItemProperty HKLM:\\Software\\Microsoft\\EdgeUpdate\\Clients\\* -ErrorAction SilentlyContinue | Where {$_.name -like '*WebView*'} | Out-File '%OUT%\\webview2.txt'"\n${bool(v.exportLogs)?'xcopy "%APPDATA%\\Microsoft\\Teams\\logs.txt" "%OUT%\\" /Y /I >nul 2>&1':''}\n${bool(v.executeRepair)?'taskkill /IM ms-teams.exe /F >nul 2>&1\ntaskkill /IM msteams.exe /F >nul 2>&1\ntaskkill /IM Teams.exe /F >nul 2>&1\nrd /s /q "%LOCALAPPDATA%\\Packages\\MSTeams_8wekyb3d8bbwe\\LocalCache\\Microsoft\\MSTeams" 2>nul\nstart "" "ms-teams:"':'echo [MODO DIAGNOSTICO] Sin cambios.'}`,
      (v)=>tpl`${headerPs(v,'Reparar Teams completo')}\nGet-Process ms-teams,msteams,Teams -ErrorAction SilentlyContinue | Select-Object ProcessName,Id,StartTime | Export-Csv (Join-Path $OutputFolder 'procesos_teams.csv') -NoTypeInformation -ErrorAction SilentlyContinue\nGet-AppxPackage *MSTeams* | Select-Object Name,Version,PackageFullName | Out-File (Join-Path $OutputFolder 'teams_appx.txt')\n${bool(v.checkWebView2)?"Get-ItemProperty HKLM:\\Software\\Microsoft\\EdgeUpdate\\Clients\\* -ErrorAction SilentlyContinue | Where-Object {$_.name -like '*WebView*'} | Out-File (Join-Path $OutputFolder 'webview2.txt')":''}\n${bool(v.exportLogs)?"Copy-Item \"$env:APPDATA\\Microsoft\\Teams\\logs.txt\" $OutputFolder -ErrorAction SilentlyContinue":''}\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { Get-Process ms-teams,msteams,Teams -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue; Remove-Item \"$env:LOCALAPPDATA\\Packages\\MSTeams_8wekyb3d8bbwe\\LocalCache\\Microsoft\\MSTeams\" -Recurse -Force -ErrorAction SilentlyContinue; Start-Process 'ms-teams:' } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-12-reiniciar-cola-impresion','V5 Pro - Reiniciar cola de impresion','Impresoras','🖨️','medio',true,'Reinicia Spooler y opcionalmente limpia trabajos pendientes en PRINTERS.',[fieldOut,fieldRepair,{key:'clearQueue',label:'Limpiar cola de impresion',type:'checkbox',default:true}],riskMediumRepair(),
      (v)=>tpl`${headerBat(v,'Reiniciar cola de impresion')}\nsc query spooler > "%OUT%\\spooler_antes.txt"\n${bool(v.executeRepair)?`net stop spooler /y\n${bool(v.clearQueue)?'del /q /f "%SystemRoot%\\System32\\spool\\PRINTERS\\*" 2>nul':'rem No se limpia cola'}\nnet start spooler`:'echo [MODO DIAGNOSTICO] Sin cambios.'}`,
      (v)=>tpl`${headerPs(v,'Reiniciar cola de impresion')}\nGet-Service Spooler | Out-String | Write-Log\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { Stop-Service Spooler -Force; ${bool(v.clearQueue)?'Remove-Item "$env:windir\\System32\\spool\\PRINTERS\\*" -Force -ErrorAction SilentlyContinue':''}; Start-Service Spooler } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-13-reparar-impresoras','V5 Pro - Reparar impresoras','Impresoras','🧾','alto',true,'Diagnostico de impresoras, drivers, puertos y cola; puede eliminar impresora concreta o reiniciar spooler.',[fieldOut,fieldRepair,{key:'printerName',label:'Nombre exacto de impresora opcional',type:'text',default:''},{key:'removePrinter',label:'Eliminar impresora indicada',type:'checkbox',default:false}],riskHighRepair(),
      (v)=>tpl`${headerBat(v,'Reparar impresoras')}\npowershell -NoProfile -Command "Get-Printer | Export-Csv '%OUT%\\printers.csv' -NoTypeInformation; Get-PrinterDriver | Export-Csv '%OUT%\\drivers_printer.csv' -NoTypeInformation; Get-PrinterPort | Export-Csv '%OUT%\\ports_printer.csv' -NoTypeInformation"\n${bool(v.executeRepair)?`net stop spooler /y\nnet start spooler\n${bool(v.removePrinter)&&v.printerName?`powershell -NoProfile -Command "Remove-Printer -Name '${batq(v.printerName)}'"`:'rem No se elimina impresora'}`:'echo [MODO DIAGNOSTICO] Sin cambios.'}`,
      (v)=>tpl`${headerPs(v,'Reparar impresoras')}\nGet-Printer | Export-Csv (Join-Path $OutputFolder 'printers.csv') -NoTypeInformation\nGet-PrinterDriver | Export-Csv (Join-Path $OutputFolder 'drivers_printer.csv') -NoTypeInformation\nGet-PrinterPort | Export-Csv (Join-Path $OutputFolder 'ports_printer.csv') -NoTypeInformation\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { Restart-Service Spooler -Force; ${bool(v.removePrinter)&&v.printerName?`Remove-Printer -Name '${psq(v.printerName)}' -ErrorAction SilentlyContinue`:''} } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-14-limpieza-temporales','V5 Pro - Limpieza temporales','Limpieza','🧹','medio',true,'Limpieza segura de TEMP de usuario y Windows Temp usando borrado controlado.',[fieldOut,fieldRepair,{key:'includeWindowsTemp',label:'Incluir C:\\Windows\\Temp',type:'checkbox',default:true},{key:'emptyRecycleBin',label:'Vaciar papelera',type:'checkbox',default:false}],riskMediumRepair(),
      (v)=>tpl`${headerBat(v,'Limpieza temporales')}\necho TEMP usuario: %TEMP%\n${bool(v.executeRepair)?`del /f /s /q "%TEMP%\\*" 2>nul\nfor /d %%D in ("%TEMP%\\*") do rd /s /q "%%D" 2>nul\n${bool(v.includeWindowsTemp)?'del /f /s /q "%SystemRoot%\\Temp\\*" 2>nul':''}\n${bool(v.emptyRecycleBin)?'powershell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"':''}`:'echo [MODO DIAGNOSTICO] Sin cambios.'}`,
      (v)=>tpl`${headerPs(v,'Limpieza temporales')}\nGet-ChildItem $env:TEMP -Force -ErrorAction SilentlyContinue | Measure-Object | Out-String | Write-Log\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { Remove-Item (Join-Path $env:TEMP '*') -Recurse -Force -ErrorAction SilentlyContinue; ${bool(v.includeWindowsTemp)?"Remove-Item \"$env:windir\\Temp\\*\" -Recurse -Force -ErrorAction SilentlyContinue":''}; ${bool(v.emptyRecycleBin)?'Clear-RecycleBin -Force -ErrorAction SilentlyContinue':''} } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-15-limpieza-avanzada-pc','V5 Pro - Limpieza avanzada PC','Rendimiento','🚀','alto',true,'Limpieza avanzada: temporales, Windows Update Download, caches comunes y top de consumo.',[fieldOut,fieldRepair,{key:'cleanUpdateDownload',label:'Limpiar SoftwareDistribution\\Download',type:'checkbox',default:false},{key:'cleanBrowserCache',label:'Limpiar cache Edge/Chrome',type:'checkbox',default:false}],riskHighRepair(),
      (v)=>tpl`${headerBat(v,'Limpieza avanzada PC')}\npowershell -NoProfile -Command "Get-Process | Sort CPU -Descending | Select -First 20 | Out-File '%OUT%\\top_cpu.txt'; Get-CimInstance Win32_LogicalDisk | Select DeviceID,FreeSpace,Size | Out-File '%OUT%\\discos.txt'"\n${bool(v.executeRepair)?`del /f /s /q "%TEMP%\\*" 2>nul\n${bool(v.cleanUpdateDownload)?'net stop wuauserv /y\nnet stop bits /y\ndel /f /s /q "%SystemRoot%\\SoftwareDistribution\\Download\\*" 2>nul\nnet start bits\nnet start wuauserv':''}\n${bool(v.cleanBrowserCache)?'rd /s /q "%LOCALAPPDATA%\\Microsoft\\Edge\\User Data\\Default\\Cache" 2>nul\nrd /s /q "%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Cache" 2>nul':''}`:'echo [MODO DIAGNOSTICO] Sin cambios.'}`,
      (v)=>tpl`${headerPs(v,'Limpieza avanzada PC')}\nGet-Process | Sort-Object CPU -Descending | Select-Object -First 20 | Out-File (Join-Path $OutputFolder 'top_cpu.txt')\nGet-CimInstance Win32_LogicalDisk | Select-Object DeviceID,FreeSpace,Size | Out-File (Join-Path $OutputFolder 'discos.txt')\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { Remove-Item (Join-Path $env:TEMP '*') -Recurse -Force -ErrorAction SilentlyContinue; ${bool(v.cleanUpdateDownload)?"Stop-Service wuauserv,bits -Force -ErrorAction SilentlyContinue; Remove-Item \"$env:windir\\SoftwareDistribution\\Download\\*\" -Recurse -Force -ErrorAction SilentlyContinue; Start-Service bits,wuauserv -ErrorAction SilentlyContinue":''}; ${bool(v.cleanBrowserCache)?"Remove-Item \"$env:LOCALAPPDATA\\Microsoft\\Edge\\User Data\\Default\\Cache\" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item \"$env:LOCALAPPDATA\\Google\\Chrome\\User Data\\Default\\Cache\" -Recurse -Force -ErrorAction SilentlyContinue":''} } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-16-sfc-dism-reparacion-windows','V5 Pro - SFC DISM reparacion Windows','Sistema','🧱','medio',true,'Ejecuta DISM ScanHealth/RestoreHealth y SFC con logs.',[fieldOut,fieldRepair,{key:'restoreHealth',label:'Ejecutar DISM RestoreHealth',type:'checkbox',default:true}],riskMediumRepair(),
      (v)=>tpl`${headerBat(v,'SFC DISM reparacion Windows')}\nDISM /Online /Cleanup-Image /ScanHealth > "%OUT%\\dism_scanhealth.log"\n${bool(v.executeRepair)&&bool(v.restoreHealth)?'DISM /Online /Cleanup-Image /RestoreHealth > "%OUT%\\dism_restorehealth.log"':'echo RestoreHealth omitido.'}\nsfc /scannow > "%OUT%\\sfc_scannow.log"`,
      (v)=>tpl`${headerPs(v,'SFC DISM reparacion Windows')}\nDISM /Online /Cleanup-Image /ScanHealth | Out-File (Join-Path $OutputFolder 'dism_scanhealth.log')\nif (${bool(v.executeRepair)&&bool(v.restoreHealth)?'$true':'$false'} -and -not $DryRun) { DISM /Online /Cleanup-Image /RestoreHealth | Out-File (Join-Path $OutputFolder 'dism_restorehealth.log') }\nsfc /scannow | Out-File (Join-Path $OutputFolder 'sfc_scannow.log')`],

    ['v5-pro-17-reset-windows-update','V5 Pro - Reset Windows Update','Windows Update','🔄','alto',true,'Reset controlado de servicios Windows Update, SoftwareDistribution Download y Catroot2 opcional.',[fieldOut,fieldRepair,{key:'clearCatroot2',label:'Renombrar Catroot2',type:'checkbox',default:false}],riskHighRepair(),
      (v)=>tpl`${headerBat(v,'Reset Windows Update')}\nsc query wuauserv > "%OUT%\\wu_services_antes.txt"\n${bool(v.executeRepair)?`net stop wuauserv /y\nnet stop bits /y\nnet stop cryptsvc /y\nren "%SystemRoot%\\SoftwareDistribution" "SoftwareDistribution.old.%RANDOM%" 2>nul\n${bool(v.clearCatroot2)?'ren "%SystemRoot%\\System32\\catroot2" "catroot2.old.%RANDOM%" 2>nul':''}\nnet start cryptsvc\nnet start bits\nnet start wuauserv`:'echo [MODO DIAGNOSTICO] Sin reset.'}`,
      (v)=>tpl`${headerPs(v,'Reset Windows Update')}\nGet-Service wuauserv,bits,cryptsvc | Out-String | Write-Log\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { Stop-Service wuauserv,bits,cryptsvc -Force -ErrorAction SilentlyContinue; Rename-Item "$env:windir\\SoftwareDistribution" ("SoftwareDistribution.old." + (Get-Random)) -ErrorAction SilentlyContinue; ${bool(v.clearCatroot2)?"Rename-Item \"$env:windir\\System32\\catroot2\" (\"catroot2.old.\" + (Get-Random)) -ErrorAction SilentlyContinue":''}; Start-Service cryptsvc,bits,wuauserv -ErrorAction SilentlyContinue } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-18-diagnostico-office-365','V5 Pro - Diagnostico Office 365','Office / Outlook','🏢','bajo',false,'Detecta Office ClickToRun: version, canal, plataforma, rutas, licencias OSPP si existe.',[fieldOut,{key:'includeOspp',label:'Intentar ospp.vbs /dstatus',type:'checkbox',default:true}],[],
      (v)=>tpl`${headerBat(v,'Diagnostico Office 365')}\nreg query "HKLM\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration" > "%OUT%\\office_clicktorun.txt" 2>&1\n${bool(v.includeOspp)?'for /r "%ProgramFiles%\\Microsoft Office" %%F in (ospp.vbs) do cscript //nologo "%%F" /dstatus > "%OUT%\\office_license.txt" 2>&1':''}`,
      (v)=>tpl`${headerPs(v,'Diagnostico Office 365')}\nGet-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration' -ErrorAction SilentlyContinue | Format-List | Out-File (Join-Path $OutputFolder 'office_clicktorun.txt')\n${bool(v.includeOspp)?"$ospp = Get-ChildItem \"$env:ProgramFiles\\Microsoft Office\" -Filter ospp.vbs -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1; if ($ospp) { cscript.exe //nologo $ospp.FullName /dstatus | Out-File (Join-Path $OutputFolder 'office_license.txt') }":''}`],

    ['v5-pro-19-reset-onedrive','V5 Pro - Reset OneDrive','OneDrive','☁️','medio',false,'Diagnostica y resetea OneDrive de usuario con rutas habituales.',[fieldOut,fieldRepair,{key:'restartOneDrive',label:'Reabrir OneDrive al terminar',type:'checkbox',default:true}],riskMediumRepair(),
      (v)=>tpl`${headerBat(v,'Reset OneDrive')}\ntasklist | findstr /i OneDrive.exe > "%OUT%\\onedrive_process.txt"\n${bool(v.executeRepair)?`taskkill /IM OneDrive.exe /F >nul 2>&1\nif exist "%LOCALAPPDATA%\\Microsoft\\OneDrive\\OneDrive.exe" "%LOCALAPPDATA%\\Microsoft\\OneDrive\\OneDrive.exe" /reset\ntimeout /t 10 /nobreak >nul\n${bool(v.restartOneDrive)?'start "" "%LOCALAPPDATA%\\Microsoft\\OneDrive\\OneDrive.exe"':''}`:'echo [MODO DIAGNOSTICO] Sin reset.'}`,
      (v)=>tpl`${headerPs(v,'Reset OneDrive')}\nGet-Process OneDrive -ErrorAction SilentlyContinue | Out-String | Write-Log\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { Get-Process OneDrive -ErrorAction SilentlyContinue | Stop-Process -Force; $exe=Join-Path $env:LOCALAPPDATA 'Microsoft\\OneDrive\\OneDrive.exe'; if(Test-Path $exe){ Start-Process $exe -ArgumentList '/reset'; Start-Sleep 10; ${bool(v.restartOneDrive)?'Start-Process $exe':''} } } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-20-diagnostico-citrix-ica','V5 Pro - Diagnostico Citrix ICA','Citrix / VPN','🖥️','bajo',false,'Diagnostica Citrix Workspace, asociacion .ica, procesos y rutas.',[fieldOut],[],
      (v)=>tpl`${headerBat(v,'Diagnostico Citrix ICA')}\nreg query "HKCR\\.ica" > "%OUT%\\ica_assoc.txt" 2>&1\nreg query "HKLM\\SOFTWARE\\WOW6432Node\\Citrix" /s > "%OUT%\\citrix_reg.txt" 2>&1\ntasklist | findstr /i "SelfService Receiver wfcrun32" > "%OUT%\\citrix_process.txt"`,
      (v)=>tpl`${headerPs(v,'Diagnostico Citrix ICA')}\ncmd /c assoc .ica | Out-String | Write-Log\nGet-ItemProperty HKLM:\\Software\\WOW6432Node\\Citrix\\* -ErrorAction SilentlyContinue | Out-File (Join-Path $OutputFolder 'citrix_registry.txt')\nGet-Process *citrix*,SelfService,Receiver,wfcrun32 -ErrorAction SilentlyContinue | Out-File (Join-Path $OutputFolder 'citrix_process.txt')`],

    ['v5-pro-21-reparar-asociacion-ica','V5 Pro - Reparar asociacion ICA','Citrix / VPN','📎','medio',false,'Reasocia archivos .ica a Citrix SelfService/Receiver si se encuentra instalado.',[fieldOut,fieldRepair,{key:'citrixExe',label:'Ruta opcional SelfService.exe/wfica32.exe',type:'text',default:''}],riskMediumRepair(),
      (v)=>tpl`${headerBat(v,'Reparar asociacion ICA')}\nassoc .ica > "%OUT%\\ica_assoc_antes.txt"\n${bool(v.executeRepair)?`powershell -NoProfile -ExecutionPolicy Bypass -Command "$exe='${batq(v.citrixExe || '')}'; if(-not $exe){$exe=(Get-ChildItem 'C:\\Program Files (x86)\\Citrix','C:\\Program Files\\Citrix' -Filter wfica32.exe -Recurse -ErrorAction SilentlyContinue | Select -First 1).FullName}; if($exe){cmd /c assoc .ica=Citrix.ICAClient; cmd /c ftype Citrix.ICAClient='\"' + $exe + '\" \"%1\"'} else {Write-Host 'No se encontro ejecutable Citrix'}}"`:'echo [MODO DIAGNOSTICO] Sin cambios.'}`,
      (v)=>tpl`${headerPs(v,'Reparar asociacion ICA')}\ncmd /c assoc .ica | Out-String | Write-Log\n$exe='${psq(v.citrixExe || '')}'\nif(-not $exe){ $exe=(Get-ChildItem 'C:\\Program Files (x86)\\Citrix','C:\\Program Files\\Citrix' -Filter wfica32.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1).FullName }\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun -and $exe) { cmd /c assoc .ica=Citrix.ICAClient | Out-String | Write-Log; cmd /c ftype Citrix.ICAClient=\"$exe\" \"%1\" | Out-String | Write-Log } else { Write-Log 'Modo diagnostico o ejecutable no encontrado.' }`],

    ['v5-pro-22-diagnostico-intune-autopilot','V5 Pro - Diagnostico Intune Autopilot','Intune / Autopilot','🧭','bajo',true,'Exporta dsregcmd, estado MDM, IME, eventos y datos basicos de Autopilot/Entra.',[fieldOut],[],
      (v)=>tpl`${headerBat(v,'Diagnostico Intune Autopilot')}\ndsregcmd /status > "%OUT%\\dsregcmd_status.txt"\nreg query "HKLM\\SOFTWARE\\Microsoft\\Enrollments" /s > "%OUT%\\enrollments.txt" 2>&1\nwevtutil qe "Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider/Admin" /c:80 /f:text > "%OUT%\\mdm_events.txt" 2>&1`,
      (v)=>tpl`${headerPs(v,'Diagnostico Intune Autopilot')}\ndsregcmd /status | Out-File (Join-Path $OutputFolder 'dsregcmd_status.txt')\nGet-ChildItem 'HKLM:\\SOFTWARE\\Microsoft\\Enrollments' -Recurse -ErrorAction SilentlyContinue | Out-File (Join-Path $OutputFolder 'enrollments.txt')\nGet-Service IntuneManagementExtension -ErrorAction SilentlyContinue | Out-String | Write-Log\nGet-WinEvent -LogName 'Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider/Admin' -MaxEvents 100 -ErrorAction SilentlyContinue | Select-Object TimeCreated,Id,ProviderName,Message | Export-Csv (Join-Path $OutputFolder 'mdm_events.csv') -NoTypeInformation`],

    ['v5-pro-23-forzar-sync-intune','V5 Pro - Forzar sincronizacion Intune','Intune / Autopilot','🔁','medio',true,'Reinicia IME y abre sincronizacion empresa/escuela; opcionalmente lanza tareas EnterpriseMgmt.',[fieldOut,fieldRepair,{key:'runTasks',label:'Ejecutar tareas EnterpriseMgmt detectadas',type:'checkbox',default:false}],riskMediumRepair(),
      (v)=>tpl`${headerBat(v,'Forzar sincronizacion Intune')}\nsc query IntuneManagementExtension > "%OUT%\\ime_service.txt" 2>&1\n${bool(v.executeRepair)?`net stop IntuneManagementExtension /y\nnet start IntuneManagementExtension\nstart ms-settings:workplace\n${bool(v.runTasks)?'powershell -NoProfile -Command "Get-ScheduledTask | Where TaskPath -like \'*EnterpriseMgmt*\' | Start-ScheduledTask"':''}`:'echo [MODO DIAGNOSTICO] Sin sync.'}`,
      (v)=>tpl`${headerPs(v,'Forzar sincronizacion Intune')}\nGet-Service IntuneManagementExtension -ErrorAction SilentlyContinue | Out-String | Write-Log\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { Restart-Service IntuneManagementExtension -Force -ErrorAction SilentlyContinue; Start-Process 'ms-settings:workplace'; ${bool(v.runTasks)?"Get-ScheduledTask | Where-Object TaskPath -like '*EnterpriseMgmt*' | Start-ScheduledTask":''} } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-24-reparar-cliente-sccm','V5 Pro - Reparar cliente SCCM','SCCM','🛠️','alto',true,'Repara/reinstala cliente SCCM con ccmsetup desde ruta configurable. No incluye rutas corporativas fijas.',[fieldOut,fieldRepair,{key:'ccmSetupPath',label:'Ruta ccmsetup.exe local o UNC',type:'text',default:'\\\\servidor\\SCCMCLIENT\\ccmsetup.exe'},{key:'siteCode',label:'Site Code',type:'text',default:'P01'},{key:'uninstallFirst',label:'Desinstalar antes de instalar',type:'checkbox',default:false}],riskHighRepair(),
      (v)=>tpl`${headerBat(v,'Reparar cliente SCCM')}\nsc query CcmExec > "%OUT%\\ccmexec_antes.txt" 2>&1\n${bool(v.executeRepair)?`${bool(v.uninstallFirst)?`"${batq(v.ccmSetupPath)}" /uninstall\ntimeout /t 20 /nobreak >nul`:''}\n"${batq(v.ccmSetupPath)}" SMSSITECODE=${batq(v.siteCode || 'P01')}`:'echo [MODO DIAGNOSTICO] Sin reinstalar SCCM.'}`,
      (v)=>tpl`${headerPs(v,'Reparar cliente SCCM')}\nGet-Service CcmExec -ErrorAction SilentlyContinue | Out-String | Write-Log\n$CcmSetup='${psq(v.ccmSetupPath || '\\\\servidor\\SCCMCLIENT\\ccmsetup.exe')}'\n$Site='${psq(v.siteCode || 'P01')}'\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun) { if(Test-Path $CcmSetup){ ${bool(v.uninstallFirst)?"Start-Process $CcmSetup -ArgumentList '/uninstall' -Wait; Start-Sleep 20;":''} Start-Process $CcmSetup -ArgumentList "SMSSITECODE=$Site" -Wait } else { throw 'No existe ccmsetup.exe: ' + $CcmSetup } } else { Write-Log 'Modo diagnostico.' }`],

    ['v5-pro-25-exportar-logs-sccm-intune','V5 Pro - Exportar logs SCCM Intune','Logs / Eventos','📦','bajo',true,'Copia logs SCCM/Intune principales a carpeta de salida para escalado.',[fieldOut,{key:'zipOutput',label:'Crear ZIP final',type:'checkbox',default:true}],[],
      (v)=>tpl`${headerBat(v,'Exportar logs SCCM Intune')}\nif exist "%windir%\\CCM\\Logs" xcopy "%windir%\\CCM\\Logs" "%OUT%\\SCCM_Logs\\" /E /I /Y >nul\nif exist "%ProgramData%\\Microsoft\\IntuneManagementExtension\\Logs" xcopy "%ProgramData%\\Microsoft\\IntuneManagementExtension\\Logs" "%OUT%\\Intune_Logs\\" /E /I /Y >nul\n${bool(v.zipOutput)?'powershell -NoProfile -Command "Compress-Archive -Path \'%OUT%\\*\' -DestinationPath \'%OUT%\\logs_sccm_intune.zip\' -Force"':''}`,
      (v)=>tpl`${headerPs(v,'Exportar logs SCCM Intune')}\n$paths=@("$env:windir\\CCM\\Logs","$env:ProgramData\\Microsoft\\IntuneManagementExtension\\Logs")\nforeach($p in $paths){ if(Test-Path $p){ Copy-Item $p (Join-Path $OutputFolder (Split-Path $p -Leaf)) -Recurse -Force -ErrorAction SilentlyContinue } }\n${bool(v.zipOutput)?"Compress-Archive -Path (Join-Path $OutputFolder '*') -DestinationPath (Join-Path $OutputFolder 'logs_sccm_intune.zip') -Force":''}`],

    ['v5-pro-26-ver-programas-instalados','V5 Pro - Ver programas instalados','Software','📋','bajo',false,'Exporta software instalado desde Uninstall 64/32 bits sin usar Win32_Product.',[fieldOut,{key:'filter',label:'Filtro opcional por nombre',type:'text',default:''}],[],
      (v)=>tpl`${headerBat(v,'Ver programas instalados')}\npowershell -NoProfile -Command "$f='${batq(v.filter || '')}'; Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Where {$_.DisplayName -and ($f -eq '' -or $_.DisplayName -like '*'+$f+'*')} | Select DisplayName,DisplayVersion,Publisher,InstallDate,UninstallString | Export-Csv '%OUT%\\software_instalado.csv' -NoTypeInformation"`,
      (v)=>tpl`${headerPs(v,'Ver programas instalados')}\n$f='${psq(v.filter || '')}'\nGet-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*,HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -and ($f -eq '' -or $_.DisplayName -like "*$f*") } | Select-Object DisplayName,DisplayVersion,Publisher,InstallDate,UninstallString | Export-Csv (Join-Path $OutputFolder 'software_instalado.csv') -NoTypeInformation -Encoding UTF8`],

    ['v5-pro-27-desinstalar-programa','V5 Pro - Desinstalar programa','Software','🗑️','alto',true,'Busca programa por nombre y ejecuta uninstall string si se confirma. Incluye modo diagnostico por defecto.',[fieldOut,fieldRepair,{key:'softwareName',label:'Nombre o parte del programa',type:'text',default:'Nombre del programa'}],riskHighRepair(),
      (v)=>tpl`${headerBat(v,'Desinstalar programa')}\npowershell -NoProfile -Command "$n='${batq(v.softwareName || '')}'; Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*,HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Where {$_.DisplayName -like '*'+$n+'*'} | Select DisplayName,UninstallString | Format-List"\n${bool(v.executeRepair)?'echo Revisa la salida y ejecuta manualmente el uninstall string validado.':'echo [MODO DIAGNOSTICO] No se desinstala automaticamente.'}`,
      (v)=>tpl`${headerPs(v,'Desinstalar programa')}\n$name='${psq(v.softwareName || '')}'\n$apps=Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*,HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* -ErrorAction SilentlyContinue | Where-Object {$_.DisplayName -like "*$name*"}\n$apps | Select-Object DisplayName,DisplayVersion,Publisher,UninstallString | Export-Csv (Join-Path $OutputFolder 'candidatos_desinstalacion.csv') -NoTypeInformation\nif (${bool(v.executeRepair)?'$true':'$false'} -and -not $DryRun -and $apps.Count -eq 1) { $u=$apps[0].UninstallString; Write-Log "UninstallString detectado: $u"; Write-Log 'Por seguridad V5 no ejecuta cadenas arbitrarias automaticamente. Ejecuta manualmente tras validar.' } else { Write-Log 'Modo diagnostico o multiples candidatos.' }`],

    ['v5-pro-28-diagnostico-defender-bitlocker','V5 Pro - Diagnostico Defender BitLocker','Seguridad','🛡️','bajo',true,'Estado de Defender, amenazas, firewall, TPM, Secure Boot y BitLocker.',[fieldOut],[],
      (v)=>tpl`${headerBat(v,'Diagnostico Defender BitLocker')}\npowershell -NoProfile -Command "Get-MpComputerStatus | Out-File '%OUT%\\defender_status.txt'; Get-MpThreatDetection | Out-File '%OUT%\\defender_threats.txt'; Get-BitLockerVolume | Out-File '%OUT%\\bitlocker.txt'; Get-Tpm | Out-File '%OUT%\\tpm.txt'; Confirm-SecureBootUEFI | Out-File '%OUT%\\secureboot.txt'"`,
      (v)=>tpl`${headerPs(v,'Diagnostico Defender BitLocker')}\nGet-MpComputerStatus | Out-File (Join-Path $OutputFolder 'defender_status.txt')\nGet-MpThreatDetection -ErrorAction SilentlyContinue | Out-File (Join-Path $OutputFolder 'defender_threats.txt')\nGet-NetFirewallProfile | Out-File (Join-Path $OutputFolder 'firewall.txt')\nGet-BitLockerVolume -ErrorAction SilentlyContinue | Out-File (Join-Path $OutputFolder 'bitlocker.txt')\nGet-Tpm -ErrorAction SilentlyContinue | Out-File (Join-Path $OutputFolder 'tpm.txt')\nConfirm-SecureBootUEFI -ErrorAction SilentlyContinue | Out-File (Join-Path $OutputFolder 'secureboot.txt')`],

    ['v5-pro-29-generador-script-unidad-red','V5 Pro - Generador script unidad de red','Unidades de red','🏗️','bajo',false,'Genera un BAT independiente para mapear una unidad de red con parametros elegidos.',[fieldOut,{key:'driveLetter',label:'Letra',type:'text',default:'P:'},{key:'uncPath',label:'Ruta UNC',type:'text',default:'\\\\servidor\\departamento'},{key:'persistent',label:'Persistente',type:'checkbox',default:true}],[],
      (v)=>tpl`${headerBat(v,'Generador script unidad de red')}\nset "GEN=%OUT%\\Mapear_${batq(v.driveLetter||'P').replace(':','')}.bat"\n> "%GEN%" echo @echo off\n>> "%GEN%" echo net use ${batq(v.driveLetter||'P:')} /delete /y ^>nul 2^>^&1\n>> "%GEN%" echo net use ${batq(v.driveLetter||'P:')} "${batq(v.uncPath||'\\\\servidor\\departamento')}" /persistent:${bool(v.persistent)?'yes':'no'}\necho Generado: %GEN%`,
      (v)=>tpl`${headerPs(v,'Generador script unidad de red')}
$gen = Join-Path $OutputFolder 'Mapear_${psq((v.driveLetter||'P:').replace(':',''))}.bat'
$lines = @(
    '@echo off',
    'net use ${psq(v.driveLetter||'P:')} /delete /y >nul 2>&1',
    'net use ${psq(v.driveLetter||'P:')} "${psq(v.uncPath||'\\\\servidor\\departamento')}" /persistent:${bool(v.persistent)?'yes':'no'}'
)
$lines | Set-Content $gen -Encoding ASCII
Write-Log ('Generado: ' + $gen)`],

    ['v5-pro-30-cau-toolkit-master','V5 Pro - CAU Toolkit Master','Base CAU','🧰','medio',true,'Launcher maestro con menu para diagnostico, red, Outlook, Teams, impresoras, Intune/SCCM y logs.',[fieldOut,{key:'includeAdminCheck',label:'Incluir comprobacion admin',type:'checkbox',default:true}],[],
      (v)=>tpl`${headerBat(v,'CAU Toolkit Master')}\n${bool(v.includeAdminCheck)?'net session >nul 2>&1 || (echo Ejecuta como Administrador para opciones avanzadas & pause)':''}\n:menu\ncls\necho 1 Diagnostico rapido\necho 2 Red basica\necho 3 Outlook modo seguro\necho 4 Limpiar cache Teams\necho 5 Reiniciar spooler\necho 6 dsregcmd status\necho 7 Logs SCCM/Intune\necho 0 Salir\nset /p op=Opcion: \nif "%op%"=="1" systeminfo & pause & goto menu\nif "%op%"=="2" ipconfig /all & pause & goto menu\nif "%op%"=="3" start outlook.exe /safe & goto menu\nif "%op%"=="4" taskkill /IM ms-teams.exe /F & pause & goto menu\nif "%op%"=="5" net stop spooler /y & net start spooler & pause & goto menu\nif "%op%"=="6" dsregcmd /status & pause & goto menu\nif "%op%"=="7" echo Exporta logs con la plantilla V5 correspondiente. & pause & goto menu\nif "%op%"=="0" exit /b\ngoto menu`,
      (v)=>tpl`${headerPs(v,'CAU Toolkit Master')}\nWrite-Log 'Este modo genera un launcher BAT maestro. Para menu interactivo completo usa la salida BAT de esta plantilla.'`]
  ];

  compactTemplates.forEach(([id,name,category,icon,risk,admin,description,fields,riskyFields,batBody,ps1Body]) => add({
    id, name, category, icon, risk, requiresAdmin: admin, description, fields,
    riskyFields,
    riskNotes: risk === 'alto' ? ['Plantilla V5 Pro con cambios potenciales en sistema o configuracion si se activa reparacion.'] : risk === 'medio' ? ['Plantilla V5 Pro con cambios locales controlados si se activa reparacion.'] : ['Plantilla V5 Pro de diagnostico/solo lectura.'],
    checklistPre: ['Ejecutar primero en modo diagnostico.', 'Revisar el script generado antes de ejecutarlo.', 'Confirmar permisos/autorizacion sobre el equipo.'],
    checklistPost: ['Validar resultado con el usuario.', 'Adjuntar logs al ticket si aplica.', 'Reiniciar si el propio script lo recomienda.'],
    rollback: risk === 'alto' ? 'Restaurar backups/exportaciones generadas y revertir cambios manualmente segun el caso.' : 'No aplica o se regenera automaticamente.',
    batBody, ps1Body
  }));

})();
