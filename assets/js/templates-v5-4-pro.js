/* ============================================================
   ScriptForge 404 - templates-v5-4-pro.js
   Pack V5.4 Advanced CAU Script Pack: 60 plantillas Pro adicionales.
   Mantiene modo diagnostico por defecto y solo ejecuta cambios si el usuario activa reparacion.
   ============================================================ */
(function () {
  if (typeof SFTemplates === 'undefined' || !Array.isArray(SFTemplates)) {
    console.warn('SFTemplates no esta disponible. No se cargan plantillas V5.4 Pro.');
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
  function rep(text, v, lang) {
    return String(text || '').replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
      const val = v[key];
      if (typeof val === 'boolean') return val ? 'true' : 'false';
      return lang === 'ps' ? psq(val ?? '') : batq(val ?? '');
    });
  }
  function headerPs(v, name) {
    return `$OutputFolder = '${psq(v.outputFolder || 'C:\\CAU\\ScriptForge404')}'
if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null }
Write-Log 'V5.4 Pro - ${psq(name)}'
Write-Log ('Equipo: ' + $env:COMPUTERNAME + ' | Usuario: ' + $env:USERNAME)
Write-Log ('Salida: ' + $OutputFolder)`;
  }
  function headerBat(v, name) {
    return `set "OUT=${batq(v.outputFolder || 'C:\\CAU\\ScriptForge404')}"
if not exist "%OUT%" mkdir "%OUT%" >nul 2>&1
echo V5.4 Pro - ${batq(name)}
echo Equipo: %COMPUTERNAME% ^| Usuario: %USERNAME%
echo Salida: %OUT%`;
  }
  const hasRepair = (spec) => !!(spec.batRepair || spec.psRepair);
  const riskyFields = (risk) => risk === 'alto'
    ? [{ key: 'executeRepair', label: 'Al activar reparacion se realizan cambios de sistema, registro, servicios, software o configuracion.', level: 'alto' }]
    : [{ key: 'executeRepair', label: 'Al activar reparacion se realizan cambios locales controlados.', level: 'medio' }];
  const SPECS = [
  {
    "num": 31,
    "slug": "diagnostico-red-avanzado",
    "title": "Diagnóstico red avanzado",
    "category": "Red",
    "icon": "🌐",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Exporta configuración IP, DNS, rutas, adaptadores, proxy y pruebas de conectividad para escalado CAU/N2.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "testHosts",
        "label": "Hosts de prueba separados por coma",
        "type": "text",
        "default": "gateway,8.8.8.8,www.microsoft.com"
      }
    ],
    "batDiag": "ipconfig /all > \"%OUT%\\\\31_ipconfig_all.txt\"\nroute print > \"%OUT%\\\\31_route_print.txt\"\narp -a > \"%OUT%\\\\31_arp.txt\"\nnetsh winhttp show proxy > \"%OUT%\\\\31_winhttp_proxy.txt\"\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-NetAdapter | Export-Csv '%OUT%\\\\31_adapters.csv' -NoTypeInformation; Get-DnsClientServerAddress | Export-Csv '%OUT%\\\\31_dns.csv' -NoTypeInformation; '{{testHosts}}'.Split(',') | ForEach-Object { Test-NetConnection $_.Trim() } | Out-File '%OUT%\\\\31_tests.txt'\"",
    "psDiag": "Get-NetIPConfiguration | Out-File (Join-Path $OutputFolder '31_net_ipconfiguration.txt') -Encoding UTF8\nGet-NetAdapter | Sort-Object Name | Export-Csv (Join-Path $OutputFolder '31_adapters.csv') -NoTypeInformation -Encoding UTF8\nGet-DnsClientServerAddress | Export-Csv (Join-Path $OutputFolder '31_dns.csv') -NoTypeInformation -Encoding UTF8\nGet-NetRoute | Export-Csv (Join-Path $OutputFolder '31_routes.csv') -NoTypeInformation -Encoding UTF8\nnetsh winhttp show proxy | Out-File (Join-Path $OutputFolder '31_winhttp_proxy.txt') -Encoding UTF8\n'{{testHosts}}'.Split(',') | ForEach-Object { $h=$_.Trim(); if($h){ Test-NetConnection $h | Out-File (Join-Path $OutputFolder ('31_test_' + ($h -replace '[^a-zA-Z0-9.-]','_') + '.txt')) -Encoding UTF8 } }\nWrite-Log 'Diagnóstico avanzado de red exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 32,
    "slug": "test-puertos-tcp",
    "title": "Test de puertos TCP",
    "category": "Red",
    "icon": "🔌",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Prueba puertos TCP contra uno o varios hosts y exporta resultados CSV para incidencias de intranet, VPN o servicios.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "hosts",
        "label": "Hosts separados por coma",
        "type": "text",
        "default": "servidor,portal.empresa.local"
      },
      {
        "key": "ports",
        "label": "Puertos separados por coma",
        "type": "text",
        "default": "80,443,445,3389"
      }
    ],
    "batDiag": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$hosts='{{hosts}}'.Split(','); $ports='{{ports}}'.Split(','); $r=foreach($h in $hosts){foreach($p in $ports){Test-NetConnection $h.Trim() -Port ([int]$p.Trim()) | Select ComputerName,RemotePort,TcpTestSucceeded}}; $r | Export-Csv '%OUT%\\\\32_tcp_ports.csv' -NoTypeInformation\"",
    "psDiag": "$hosts='{{hosts}}'.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }\n$ports='{{ports}}'.Split(',') | ForEach-Object { [int]$_.Trim() }\n$results = foreach($h in $hosts){ foreach($p in $ports){ Test-NetConnection -ComputerName $h -Port $p -WarningAction SilentlyContinue | Select-Object ComputerName,RemotePort,TcpTestSucceeded,ResolvedAddresses,SourceAddress } }\n$results | Export-Csv (Join-Path $OutputFolder '32_tcp_ports.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Test TCP finalizado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 33,
    "slug": "test-dns-corporativo",
    "title": "Test DNS corporativo",
    "category": "Red",
    "icon": "🧭",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Comprueba resolución DNS interna/externa usando DNS configurado o servidor DNS concreto.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "dnsServer",
        "label": "DNS opcional",
        "type": "text",
        "default": ""
      },
      {
        "key": "names",
        "label": "Nombres DNS separados por coma",
        "type": "text",
        "default": "intranet.empresa.local,www.microsoft.com"
      }
    ],
    "batDiag": "nslookup > \"%OUT%\\\\33_nslookup_default.txt\"\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"$dns='{{dnsServer}}'; '{{names}}'.Split(',') | %% { $n=$_.Trim(); if($n){ if($dns){ Resolve-DnsName $n -Server $dns -ErrorAction SilentlyContinue } else { Resolve-DnsName $n -ErrorAction SilentlyContinue } } } | Export-Csv '%OUT%\\\\33_dns_results.csv' -NoTypeInformation\"",
    "psDiag": "$dns='{{dnsServer}}'\n$names='{{names}}'.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }\n$results = foreach($n in $names){\n    try { if($dns){ Resolve-DnsName $n -Server $dns -ErrorAction Stop } else { Resolve-DnsName $n -ErrorAction Stop } }\n    catch { [pscustomobject]@{Name=$n; Error=$_.Exception.Message} }\n}\n$results | Export-Csv (Join-Path $OutputFolder '33_dns_results.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Test DNS corporativo finalizado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 34,
    "slug": "diagnostico-proxy-completo",
    "title": "Diagnóstico proxy completo",
    "category": "Red",
    "icon": "🧱",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Exporta proxy WinHTTP, proxy de usuario, variables de entorno y pruebas web básicas.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "testUrl",
        "label": "URL de prueba",
        "type": "text",
        "default": "https://www.microsoft.com"
      }
    ],
    "batDiag": "netsh winhttp show proxy > \"%OUT%\\\\34_winhttp_proxy.txt\"\nreg query \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\" /v ProxyEnable > \"%OUT%\\\\34_proxy_hkcu.txt\" 2>&1\nreg query \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\" /v ProxyServer >> \"%OUT%\\\\34_proxy_hkcu.txt\" 2>&1\nset http > \"%OUT%\\\\34_env_http.txt\" 2>&1\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"try { Invoke-WebRequest '{{testUrl}}' -UseBasicParsing -TimeoutSec 15 | Select StatusCode,StatusDescription | Out-File '%OUT%\\\\34_webtest.txt' } catch { $_.Exception.Message | Out-File '%OUT%\\\\34_webtest.txt' }\"",
    "psDiag": "netsh winhttp show proxy | Out-File (Join-Path $OutputFolder '34_winhttp_proxy.txt') -Encoding UTF8\nGet-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' | Select-Object ProxyEnable,ProxyServer,AutoConfigURL | Export-Csv (Join-Path $OutputFolder '34_proxy_hkcu.csv') -NoTypeInformation -Encoding UTF8\nGet-ChildItem Env: | Where-Object Name -match 'proxy|http' | Export-Csv (Join-Path $OutputFolder '34_proxy_env.csv') -NoTypeInformation -Encoding UTF8\ntry { Invoke-WebRequest '{{testUrl}}' -UseBasicParsing -TimeoutSec 15 | Select-Object StatusCode,StatusDescription | Out-File (Join-Path $OutputFolder '34_webtest.txt') -Encoding UTF8 } catch { $_.Exception.Message | Out-File (Join-Path $OutputFolder '34_webtest.txt') -Encoding UTF8 }\nWrite-Log 'Diagnóstico proxy exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 35,
    "slug": "reset-proxy-winhttp-ie",
    "title": "Reset proxy WinHTTP/usuario",
    "category": "Red",
    "icon": "🧽",
    "risk": "alto",
    "requiresAdmin": true,
    "description": "Resetea proxy WinHTTP y opcionalmente proxy del usuario actual. Incluye diagnóstico previo.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "resetUserProxy",
        "label": "Quitar proxy HKCU del usuario actual",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "netsh winhttp show proxy > \"%OUT%\\\\35_proxy_antes.txt\"\nreg query \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\" /v ProxyServer >> \"%OUT%\\\\35_proxy_antes.txt\" 2>&1",
    "psDiag": "netsh winhttp show proxy | Out-File (Join-Path $OutputFolder '35_proxy_antes.txt') -Encoding UTF8\nGet-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' | Select ProxyEnable,ProxyServer,AutoConfigURL | Export-Csv (Join-Path $OutputFolder '35_proxy_hkcu_antes.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "netsh winhttp reset proxy\nif \"{{resetUserProxy}}\"==\"true\" reg add \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\" /v ProxyEnable /t REG_DWORD /d 0 /f",
    "psRepair": "netsh winhttp reset proxy | Out-String | Write-Log\nif ('{{resetUserProxy}}' -eq 'true') { Set-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' -Name ProxyEnable -Type DWord -Value 0; Write-Log 'Proxy HKCU desactivado.' }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Reconfigurar proxy corporativo desde GPO/Intune o restaurar ProxyEnable/ProxyServer documentado en el log."
  },
  {
    "num": 36,
    "slug": "diagnostico-vpn-basico",
    "title": "Diagnóstico VPN básico",
    "category": "Citrix / VPN",
    "icon": "🛰️",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Lista conexiones VPN, adaptadores, rutas y pruebas de conectividad para incidencias de acceso remoto.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "vpnHost",
        "label": "Host/portal VPN de prueba",
        "type": "text",
        "default": "vpn.empresa.local"
      }
    ],
    "batDiag": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-VpnConnection -AllUserConnection -ErrorAction SilentlyContinue | Export-Csv '%OUT%\\\\36_vpn_connections.csv' -NoTypeInformation; Get-NetAdapter | Export-Csv '%OUT%\\\\36_adapters.csv' -NoTypeInformation; Test-NetConnection '{{vpnHost}}' | Out-File '%OUT%\\\\36_vpn_test.txt'\"\nroute print > \"%OUT%\\\\36_routes.txt\"",
    "psDiag": "Get-VpnConnection -AllUserConnection -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '36_vpn_connections.csv') -NoTypeInformation -Encoding UTF8\nGet-NetAdapter | Export-Csv (Join-Path $OutputFolder '36_adapters.csv') -NoTypeInformation -Encoding UTF8\nGet-NetRoute | Export-Csv (Join-Path $OutputFolder '36_routes.csv') -NoTypeInformation -Encoding UTF8\nTest-NetConnection '{{vpnHost}}' | Out-File (Join-Path $OutputFolder '36_vpn_test.txt') -Encoding UTF8\nWrite-Log 'Diagnóstico VPN básico exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 37,
    "slug": "exportar-trazas-red-ticket",
    "title": "Exportar trazas de red para ticket",
    "category": "Red",
    "icon": "📡",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Captura traza ETL breve con netsh trace y la guarda para escalado N2/N3.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "seconds",
        "label": "Segundos de captura",
        "type": "number",
        "default": 30
      }
    ],
    "batDiag": "echo Preparado para capturar traza de red durante {{seconds}} segundos.",
    "psDiag": "Write-Log 'Preparado para capturar traza de red con netsh trace.'",
    "batRepair": "netsh trace start capture=yes report=yes tracefile=\"%OUT%\\\\37_trace.etl\"\ntimeout /t {{seconds}} /nobreak\nnetsh trace stop",
    "psRepair": "$trace = Join-Path $OutputFolder '37_trace.etl'\nnetsh trace start capture=yes report=yes tracefile=\"$trace\" | Out-String | Write-Log\nStart-Sleep -Seconds {{seconds}}\nnetsh trace stop | Out-String | Write-Log\nWrite-Log ('Traza guardada en ' + $trace)",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Detener la traza con `netsh trace stop` si quedara activa."
  },
  {
    "num": 38,
    "slug": "reiniciar-adaptador-red-seleccionado",
    "title": "Reiniciar adaptador de red seleccionado",
    "category": "Red",
    "icon": "🔁",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Lista adaptadores y reinicia el indicado por nombre exacto si se activa reparación.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "adapterName",
        "label": "Nombre del adaptador",
        "type": "text",
        "default": "Ethernet"
      }
    ],
    "batDiag": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-NetAdapter | Format-Table Name,Status,LinkSpeed | Out-File '%OUT%\\\\38_adapters.txt'\"",
    "psDiag": "Get-NetAdapter | Sort-Object Name | Format-Table Name,Status,LinkSpeed,InterfaceDescription | Out-File (Join-Path $OutputFolder '38_adapters.txt') -Encoding UTF8",
    "batRepair": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"Restart-NetAdapter -Name '{{adapterName}}' -Confirm:$false\"",
    "psRepair": "Restart-NetAdapter -Name '{{adapterName}}' -Confirm:$false\nWrite-Log 'Adaptador reiniciado: {{adapterName}}'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Si no recupera conexión, reiniciar equipo o reactivar adaptador manualmente desde ncpa.cpl."
  },
  {
    "num": 39,
    "slug": "mapear-unidades-desde-csv",
    "title": "Mapear unidades desde CSV",
    "category": "Unidades de red",
    "icon": "🗃️",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Mapea unidades desde un CSV con columnas Drive,Path,Description. Ideal para sedes/departamentos.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "csvPath",
        "label": "Ruta CSV",
        "type": "text",
        "default": "C:\\CAU\\unidades.csv"
      },
      {
        "key": "persistent",
        "label": "Persistente",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "echo CSV esperado: Drive,Path,Description\nif not exist \"{{csvPath}}\" echo No existe CSV: {{csvPath}}\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"if(Test-Path '{{csvPath}}'){ Import-Csv '{{csvPath}}' | Format-Table | Out-File '%OUT%\\\\39_csv_preview.txt' }\"",
    "psDiag": "$CsvPath='{{csvPath}}'\nif (-not (Test-Path $CsvPath)) { Write-Log ('No existe CSV: ' + $CsvPath); return }\nImport-Csv $CsvPath | Format-Table | Out-File (Join-Path $OutputFolder '39_csv_preview.txt') -Encoding UTF8",
    "batRepair": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"Import-Csv '{{csvPath}}' | %% { net use ($_.Drive) ($_.Path) /persistent:{{persistent}} }\"",
    "psRepair": "Import-Csv $CsvPath | ForEach-Object {\n    $drive=$_.Drive.Trim().TrimEnd(':'); $path=$_.Path.Trim()\n    if($drive -and $path){ Remove-PSDrive -Name $drive -Force -ErrorAction SilentlyContinue; New-PSDrive -Name $drive -PSProvider FileSystem -Root $path -Persist:${{persistent}} | Out-Null; Write-Log ('Mapeada ' + $drive + ': -> ' + $path) }\n}",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Eliminar unidades con `net use LETRA: /delete /y` o restaurar backup de unidades."
  },
  {
    "num": 40,
    "slug": "mapear-unidades-por-departamento",
    "title": "Mapear unidades por departamento",
    "category": "Unidades de red",
    "icon": "🏢",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Genera mapeos según departamento seleccionado usando una tabla editable dentro del script.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "department",
        "label": "Departamento",
        "type": "text",
        "default": "CAU"
      },
      {
        "key": "mapTable",
        "label": "Tabla Departamento|Drive|Path",
        "type": "textarea",
        "default": "CAU|P|\\\\servidor\\cau\nCAU|S|\\\\servidor\\software\nRRHH|R|\\\\servidor\\rrhh"
      },
      {
        "key": "persistent",
        "label": "Persistente",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "echo Departamento: {{department}}\necho Revise tabla de mapeos configurada en la app.",
    "psDiag": "Write-Log 'Departamento solicitado: {{department}}'\n$Table = @('{{mapTable}}'.Split([Environment]::NewLine))\n$Table | Out-File (Join-Path $OutputFolder '40_tabla_mapeos.txt') -Encoding UTF8",
    "batRepair": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$dept='{{department}}'; '{{mapTable}}'.Split([Environment]::NewLine) | %% { $p=$_.Split('|'); if($p[0] -eq $dept){ net use ($p[1]+':') $p[2] /persistent:{{persistent}} } }\"",
    "psRepair": "$dept='{{department}}'\n'{{mapTable}}'.Split([Environment]::NewLine) | ForEach-Object {\n    $p=$_.Split('|'); if($p.Count -ge 3 -and $p[0].Trim() -eq $dept){ $drive=$p[1].Trim(); $path=$p[2].Trim(); Remove-PSDrive -Name $drive -Force -ErrorAction SilentlyContinue; New-PSDrive -Name $drive -PSProvider FileSystem -Root $path -Persist:${{persistent}} | Out-Null; Write-Log ('Mapeada ' + $drive + ': -> ' + $path) }\n}",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Eliminar las letras mapeadas para el departamento con net use LETRA: /delete."
  },
  {
    "num": 41,
    "slug": "reparar-unidades-desconectadas",
    "title": "Reparar unidades desconectadas",
    "category": "Unidades de red",
    "icon": "🧩",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Detecta unidades de red desconectadas y reintenta acceso/mapeo básico.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "net use > \"%OUT%\\\\41_net_use_antes.txt\"",
    "psDiag": "net use | Out-File (Join-Path $OutputFolder '41_net_use_antes.txt') -Encoding UTF8\nGet-PSDrive -PSProvider FileSystem | Where-Object DisplayRoot | Export-Csv (Join-Path $OutputFolder '41_psdrives.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "net use > \"%OUT%\\\\41_net_use_reparacion.txt\"\nfor /f \"tokens=1,2,3\" %%A in ('net use ^| find \"Desconectado\"') do net use %%A /persistent:yes",
    "psRepair": "$mapped = Get-PSDrive -PSProvider FileSystem | Where-Object DisplayRoot\nforeach($m in $mapped){ try { Test-Path ($m.Name + ':\\') | Out-Null; Write-Log ('OK ' + $m.Name + ': ' + $m.DisplayRoot) } catch { Write-Log ('Error en ' + $m.Name + ': ' + $_.Exception.Message) } }\ncmd /c 'net use' | Out-String | Write-Log",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Eliminar y volver a mapear manualmente la unidad afectada si sigue desconectada."
  },
  {
    "num": 42,
    "slug": "desconectar-todas-unidades-red",
    "title": "Desconectar todas las unidades de red",
    "category": "Unidades de red",
    "icon": "⛔",
    "risk": "alto",
    "requiresAdmin": false,
    "description": "Desconecta todas las unidades de red del usuario actual tras exportar backup.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "net use > \"%OUT%\\\\42_net_use_backup.txt\"",
    "psDiag": "cmd /c 'net use' | Out-File (Join-Path $OutputFolder '42_net_use_backup.txt') -Encoding UTF8\nGet-PSDrive -PSProvider FileSystem | Where DisplayRoot | Export-Csv (Join-Path $OutputFolder '42_psdrive_backup.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "net use * /delete /y",
    "psRepair": "cmd /c 'net use * /delete /y' | Out-String | Write-Log",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Restaurar desde `42_psdrive_backup.csv` o volver a mapear con plantillas de unidades."
  },
  {
    "num": 43,
    "slug": "backup-unidades-mapeadas",
    "title": "Backup unidades mapeadas",
    "category": "Unidades de red",
    "icon": "💾",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Exporta unidades de red actuales a CSV y TXT para recuperación posterior.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "net use > \"%OUT%\\\\43_net_use.txt\"\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-PSDrive -PSProvider FileSystem | Where DisplayRoot | Select Name,DisplayRoot,Description | Export-Csv '%OUT%\\\\43_unidades.csv' -NoTypeInformation\"",
    "psDiag": "cmd /c 'net use' | Out-File (Join-Path $OutputFolder '43_net_use.txt') -Encoding UTF8\nGet-PSDrive -PSProvider FileSystem | Where-Object DisplayRoot | Select-Object Name,DisplayRoot,Description | Export-Csv (Join-Path $OutputFolder '43_unidades.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Backup de unidades exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 44,
    "slug": "restaurar-unidades-mapeadas",
    "title": "Restaurar unidades mapeadas",
    "category": "Unidades de red",
    "icon": "♻️",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Restaura unidades desde CSV generado por el backup de unidades.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "csvPath",
        "label": "CSV de backup",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404\\43_unidades.csv"
      }
    ],
    "batDiag": "if not exist \"{{csvPath}}\" echo No existe CSV: {{csvPath}}",
    "psDiag": "$CsvPath='{{csvPath}}'\nif(-not(Test-Path $CsvPath)){ Write-Log ('No existe CSV: ' + $CsvPath); return }\nImport-Csv $CsvPath | Format-Table | Out-File (Join-Path $OutputFolder '44_preview_restore.txt') -Encoding UTF8",
    "batRepair": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"Import-Csv '{{csvPath}}' | %% { net use ($_.Name+':') $_.DisplayRoot /persistent:yes }\"",
    "psRepair": "Import-Csv $CsvPath | ForEach-Object { if($_.Name -and $_.DisplayRoot){ New-PSDrive -Name $_.Name -PSProvider FileSystem -Root $_.DisplayRoot -Persist -ErrorAction SilentlyContinue | Out-Null; Write-Log ('Restaurada ' + $_.Name + ':') } }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Desconectar las unidades restauradas con net use LETRA: /delete."
  },
  {
    "num": 45,
    "slug": "diagnostico-permisos-unc",
    "title": "Diagnóstico permisos UNC",
    "category": "Unidades de red",
    "icon": "🔐",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Comprueba acceso de lectura/escritura a ruta UNC sin modificar permisos.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "uncPath",
        "label": "Ruta UNC",
        "type": "text",
        "default": "\\\\servidor\\recurso"
      }
    ],
    "batDiag": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$p='{{uncPath}}'; Test-Path $p | Out-File '%OUT%\\\\45_testpath.txt'; Get-Acl $p | Format-List | Out-File '%OUT%\\\\45_acl.txt'\"",
    "psDiag": "$Path='{{uncPath}}'\n[pscustomobject]@{Path=$Path; Exists=(Test-Path $Path); User=$env:USERNAME; Computer=$env:COMPUTERNAME} | Export-Csv (Join-Path $OutputFolder '45_unc_access.csv') -NoTypeInformation -Encoding UTF8\ntry { Get-Acl $Path | Format-List | Out-File (Join-Path $OutputFolder '45_acl.txt') -Encoding UTF8 } catch { $_.Exception.Message | Out-File (Join-Path $OutputFolder '45_acl_error.txt') -Encoding UTF8 }\ntry { $tmp=Join-Path $Path ('sf404_test_' + $env:USERNAME + '.tmp'); 'test' | Set-Content $tmp -ErrorAction Stop; Remove-Item $tmp -Force; 'Write OK' | Out-File (Join-Path $OutputFolder '45_write_test.txt') } catch { $_.Exception.Message | Out-File (Join-Path $OutputFolder '45_write_test.txt') }\nWrite-Log 'Diagnóstico de permisos UNC finalizado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura salvo archivo temporal de prueba que se elimina automáticamente."
  },
  {
    "num": 46,
    "slug": "generador-unidades-red-interactivo",
    "title": "Generador unidades de red interactivo",
    "category": "Unidades de red",
    "icon": "🏗️",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Genera un BAT independiente para mapear una unidad con letra, ruta UNC y persistencia.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "driveLetter",
        "label": "Letra",
        "type": "text",
        "default": "P:"
      },
      {
        "key": "uncPath",
        "label": "Ruta UNC",
        "type": "text",
        "default": "\\\\servidor\\departamento"
      },
      {
        "key": "persistent",
        "label": "Persistente",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "> \"%OUT%\\\\46_mapear_unidad_generado.bat\" echo @echo off\n>> \"%OUT%\\\\46_mapear_unidad_generado.bat\" echo net use {{driveLetter}} \"{{uncPath}}\" /persistent:{{persistent}}\necho Generado: %OUT%\\\\46_mapear_unidad_generado.bat",
    "psDiag": "$bat = Join-Path $OutputFolder '46_mapear_unidad_generado.bat'\n'@echo off' | Set-Content $bat -Encoding ASCII\n'net use {{driveLetter}} \"{{uncPath}}\" /persistent:{{persistent}}' | Add-Content $bat -Encoding ASCII\nWrite-Log ('Generado: ' + $bat)",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Borrar el BAT generado si no se necesita."
  },
  {
    "num": 47,
    "slug": "diagnostico-outlook-completo",
    "title": "Diagnóstico Outlook completo",
    "category": "Office / Outlook",
    "icon": "📧",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Exporta procesos, perfiles, add-ins, OST/PST recientes y eventos relacionados con Outlook.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "tasklist | findstr /i outlook > \"%OUT%\\\\47_outlook_process.txt\"\nreg query \"HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\" /s > \"%OUT%\\\\47_addins.txt\" 2>&1\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-ChildItem $env:LOCALAPPDATA\\\\Microsoft\\\\Outlook -Filter *.ost -ErrorAction SilentlyContinue | Select Name,Length,LastWriteTime | Export-Csv '%OUT%\\\\47_ost.csv' -NoTypeInformation\"",
    "psDiag": "Get-Process OUTLOOK -ErrorAction SilentlyContinue | Select-Object Name,Id,StartTime,Path | Export-Csv (Join-Path $OutputFolder '47_outlook_process.csv') -NoTypeInformation -Encoding UTF8\nGet-ChildItem 'HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins' -ErrorAction SilentlyContinue | ForEach-Object { Get-ItemProperty $_.PSPath | Select-Object PSChildName,FriendlyName,LoadBehavior,Description } | Export-Csv (Join-Path $OutputFolder '47_addins.csv') -NoTypeInformation -Encoding UTF8\nGet-ChildItem \"$env:LOCALAPPDATA\\Microsoft\\Outlook\" -Include *.ost,*.pst -Recurse -ErrorAction SilentlyContinue | Select-Object FullName,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder '47_datafiles.csv') -NoTypeInformation -Encoding UTF8\nGet-WinEvent -FilterHashtable @{LogName='Application'; StartTime=(Get-Date).AddDays(-3)} -ErrorAction SilentlyContinue | Where-Object {$_.ProviderName -match 'Outlook|Office|Application Error'} | Select-Object TimeCreated,Id,ProviderName,Message | Export-Csv (Join-Path $OutputFolder '47_events.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Diagnóstico Outlook completo exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 48,
    "slug": "reparar-outlook-no-abre",
    "title": "Reparar Outlook no abre",
    "category": "Office / Outlook",
    "icon": "🧰",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Cierra Outlook opcionalmente y genera accesos de reparación: safe mode, resetnavpane y profiles.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "killOutlook",
        "label": "Cerrar Outlook",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "tasklist | findstr /i outlook > \"%OUT%\\\\48_outlook_process.txt\"",
    "psDiag": "Get-Process OUTLOOK -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '48_outlook_process.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "if \"{{killOutlook}}\"==\"true\" taskkill /IM OUTLOOK.EXE /F\nstart outlook.exe /safe\nstart outlook.exe /resetnavpane\ncontrol mlcfg32.cpl",
    "psRepair": "if ('{{killOutlook}}' -eq 'true') { Get-Process OUTLOOK -ErrorAction SilentlyContinue | Stop-Process -Force; Write-Log 'Outlook cerrado.' }\nStart-Process outlook.exe -ArgumentList '/safe'\nStart-Process outlook.exe -ArgumentList '/resetnavpane'\nStart-Process control.exe -ArgumentList 'mlcfg32.cpl'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Reabrir Outlook normal. Si se cambió perfil, restaurar perfil anterior desde Panel de correo."
  },
  {
    "num": 49,
    "slug": "recrear-perfil-outlook-asistido",
    "title": "Recrear perfil Outlook asistido",
    "category": "Office / Outlook",
    "icon": "🪪",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Abre panel de perfiles y documenta perfiles actuales. No borra perfiles automáticamente.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "reg query \"HKCU\\Software\\Microsoft\\Office\\16.0\\Outlook\\Profiles\" /s > \"%OUT%\\\\49_profiles_backup.txt\" 2>&1",
    "psDiag": "Get-ChildItem 'HKCU:\\Software\\Microsoft\\Office\\16.0\\Outlook\\Profiles' -ErrorAction SilentlyContinue | Select-Object PSChildName | Export-Csv (Join-Path $OutputFolder '49_profiles.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "control mlcfg32.cpl",
    "psRepair": "Start-Process control.exe -ArgumentList 'mlcfg32.cpl'\nWrite-Log 'Panel de perfiles abierto. Crear perfil nuevo manualmente y conservar perfil antiguo hasta validar.'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Seleccionar de nuevo el perfil anterior desde Panel de correo si el nuevo perfil no funciona."
  },
  {
    "num": 50,
    "slug": "limpiar-roamcache-outlook",
    "title": "Limpiar RoamCache Outlook",
    "category": "Office / Outlook",
    "icon": "🧹",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Limpia RoamCache de Outlook tras backup opcional para resolver autocompletado/vistas/cache corrupta.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "backupFirst",
        "label": "Backup antes de limpiar",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "dir \"%LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache\" > \"%OUT%\\\\50_roamcache_antes.txt\" 2>&1",
    "psDiag": "$rc=Join-Path $env:LOCALAPPDATA 'Microsoft\\Outlook\\RoamCache'\nGet-ChildItem $rc -ErrorAction SilentlyContinue | Select FullName,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder '50_roamcache_antes.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "if \"{{backupFirst}}\"==\"true\" xcopy \"%LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache\" \"%OUT%\\RoamCache_Backup\\\" /E /I /Y\npowershell -NoProfile -Command \"Remove-Item $env:LOCALAPPDATA\\\\Microsoft\\\\Outlook\\\\RoamCache\\\\* -Force -ErrorAction SilentlyContinue\"",
    "psRepair": "$rc=Join-Path $env:LOCALAPPDATA 'Microsoft\\Outlook\\RoamCache'\nif ('{{backupFirst}}' -eq 'true' -and (Test-Path $rc)) { Copy-Item $rc (Join-Path $OutputFolder 'RoamCache_Backup') -Recurse -Force -ErrorAction SilentlyContinue }\nif(Test-Path $rc){ Remove-Item (Join-Path $rc '*') -Force -ErrorAction SilentlyContinue; Write-Log 'RoamCache limpiada.' }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Restaurar la carpeta RoamCache_Backup si fuera necesario."
  },
  {
    "num": 51,
    "slug": "limpiar-autocomplete-outlook",
    "title": "Limpiar Autocomplete Outlook",
    "category": "Office / Outlook",
    "icon": "📇",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Localiza y limpia caché de autocompletar de Outlook con backup previo.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "backupFirst",
        "label": "Backup antes de limpiar",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "dir \"%LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache\\Stream_Autocomplete*.dat\" > \"%OUT%\\\\51_autocomplete_antes.txt\" 2>&1",
    "psDiag": "$files=Get-ChildItem \"$env:LOCALAPPDATA\\Microsoft\\Outlook\\RoamCache\" -Filter 'Stream_Autocomplete*.dat' -ErrorAction SilentlyContinue\n$files | Select FullName,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder '51_autocomplete.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "if \"{{backupFirst}}\"==\"true\" copy \"%LOCALAPPDATA%\\Microsoft\\Outlook\\RoamCache\\Stream_Autocomplete*.dat\" \"%OUT%\" >nul 2>&1\npowershell -NoProfile -Command \"Remove-Item $env:LOCALAPPDATA\\\\Microsoft\\\\Outlook\\\\RoamCache\\\\Stream_Autocomplete*.dat -Force -ErrorAction SilentlyContinue\"",
    "psRepair": "$dir=Join-Path $env:LOCALAPPDATA 'Microsoft\\Outlook\\RoamCache'\n$files=Get-ChildItem $dir -Filter 'Stream_Autocomplete*.dat' -ErrorAction SilentlyContinue\nif ('{{backupFirst}}' -eq 'true') { $files | Copy-Item -Destination $OutputFolder -Force -ErrorAction SilentlyContinue }\n$files | Remove-Item -Force -ErrorAction SilentlyContinue\nWrite-Log 'Autocomplete limpiado.'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Copiar de vuelta el archivo Stream_Autocomplete respaldado antes de abrir Outlook."
  },
  {
    "num": 52,
    "slug": "reparar-indexacion-outlook",
    "title": "Reparar indexación Outlook",
    "category": "Office / Outlook",
    "icon": "🔎",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Diagnostica búsqueda Windows/Outlook y reinicia Windows Search si se activa reparación.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "sc query WSearch > \"%OUT%\\\\52_wsearch.txt\"",
    "psDiag": "Get-Service WSearch -ErrorAction SilentlyContinue | Format-List * | Out-File (Join-Path $OutputFolder '52_wsearch.txt') -Encoding UTF8\nGet-WinEvent -FilterHashtable @{LogName='Application'; ProviderName='Microsoft-Windows-Search'; StartTime=(Get-Date).AddDays(-7)} -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '52_search_events.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "net stop WSearch\nnet start WSearch",
    "psRepair": "Restart-Service WSearch -Force\nWrite-Log 'Windows Search reiniciado.'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Volver a reiniciar WSearch o reconstruir índice desde opciones de indización si persiste."
  },
  {
    "num": 53,
    "slug": "ver-addins-outlook-loadbehavior",
    "title": "Ver Add-ins Outlook LoadBehavior",
    "category": "Office / Outlook",
    "icon": "🧩",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Exporta todos los add-ins de Outlook y su LoadBehavior para detectar complementos deshabilitados.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "reg query \"HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\" /s > \"%OUT%\\\\53_addins_hkcu.txt\" 2>&1\nreg query \"HKLM\\Software\\Microsoft\\Office\\Outlook\\Addins\" /s > \"%OUT%\\\\53_addins_hklm.txt\" 2>&1",
    "psDiag": "$roots='HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins','HKLM:\\Software\\Microsoft\\Office\\Outlook\\Addins','HKLM:\\Software\\WOW6432Node\\Microsoft\\Office\\Outlook\\Addins'\n$results=foreach($r in $roots){ Get-ChildItem $r -ErrorAction SilentlyContinue | ForEach-Object { $p=Get-ItemProperty $_.PSPath; [pscustomobject]@{Root=$r; Addin=$_.PSChildName; FriendlyName=$p.FriendlyName; LoadBehavior=$p.LoadBehavior; Description=$p.Description} } }\n$results | Export-Csv (Join-Path $OutputFolder '53_outlook_addins.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Add-ins exportados.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 54,
    "slug": "habilitar-addin-outlook-concreto",
    "title": "Habilitar Add-in Outlook concreto",
    "category": "Office / Outlook",
    "icon": "✅",
    "risk": "alto",
    "requiresAdmin": false,
    "description": "Cambia LoadBehavior=3 para un add-in concreto de Outlook en HKCU/HKLM si existe.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "addinName",
        "label": "Nombre técnico del add-in",
        "type": "text",
        "default": "TeamsAddin.FastConnect"
      }
    ],
    "batDiag": "reg query \"HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\{{addinName}}\" > \"%OUT%\\\\54_addin_antes.txt\" 2>&1\nreg query \"HKLM\\Software\\Microsoft\\Office\\Outlook\\Addins\\{{addinName}}\" >> \"%OUT%\\\\54_addin_antes.txt\" 2>&1",
    "psDiag": "$addin='{{addinName}}'\n$paths=@(\"HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\$addin\",\"HKLM:\\Software\\Microsoft\\Office\\Outlook\\Addins\\$addin\",\"HKLM:\\Software\\WOW6432Node\\Microsoft\\Office\\Outlook\\Addins\\$addin\")\nforeach($p in $paths){ if(Test-Path $p){ Get-ItemProperty $p | Select * | Export-Csv (Join-Path $OutputFolder ('54_' + ($p -replace '[^a-zA-Z0-9]','_') + '.csv')) -NoTypeInformation -Encoding UTF8 } }",
    "batRepair": "reg add \"HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\{{addinName}}\" /v LoadBehavior /t REG_DWORD /d 3 /f",
    "psRepair": "$addin='{{addinName}}'\n$paths=@(\"HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\$addin\",\"HKLM:\\Software\\Microsoft\\Office\\Outlook\\Addins\\$addin\",\"HKLM:\\Software\\WOW6432Node\\Microsoft\\Office\\Outlook\\Addins\\$addin\")\nforeach($p in $paths){ if(Test-Path $p){ Set-ItemProperty $p -Name LoadBehavior -Type DWord -Value 3; Write-Log ('LoadBehavior=3 en ' + $p) } }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Restaurar LoadBehavior anterior desde el CSV/registro exportado."
  },
  {
    "num": 55,
    "slug": "diagnostico-licencia-office",
    "title": "Diagnóstico licencia Office",
    "category": "Office / Outlook",
    "icon": "🏷️",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Busca Office ClickToRun, canal, arquitectura y estado de licencia con ospp.vbs si existe.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration\" > \"%OUT%\\\\55_office_ctr.txt\" 2>&1\nfor /f \"delims=\" %%F in ('dir /b /s \"%ProgramFiles%\\Microsoft Office\\Office16\\OSPP.VBS\" 2^>nul') do cscript //nologo \"%%F\" /dstatus > \"%OUT%\\\\55_ospp.txt\"",
    "psDiag": "Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration' -ErrorAction SilentlyContinue | Select-Object * | Export-Csv (Join-Path $OutputFolder '55_office_ctr.csv') -NoTypeInformation -Encoding UTF8\n$ospp = Get-ChildItem \"$env:ProgramFiles\\Microsoft Office\" -Filter OSPP.VBS -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1\nif($ospp){ cscript.exe //nologo $ospp.FullName /dstatus | Out-File (Join-Path $OutputFolder '55_ospp_dstatus.txt') -Encoding UTF8 }\nWrite-Log 'Diagnóstico licencia Office exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 56,
    "slug": "forzar-actualizacion-office-c2r",
    "title": "Forzar actualización Office C2R",
    "category": "Office / Outlook",
    "icon": "⬆️",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Localiza OfficeC2RClient.exe y fuerza actualización ClickToRun si se activa reparación.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "dir \"%ProgramFiles%\\Common Files\\Microsoft Shared\\ClickToRun\\OfficeC2RClient.exe\" > \"%OUT%\\\\56_c2r_path.txt\" 2>&1",
    "psDiag": "$client = Join-Path $env:ProgramFiles 'Common Files\\Microsoft Shared\\ClickToRun\\OfficeC2RClient.exe'\n[pscustomobject]@{Path=$client; Exists=(Test-Path $client)} | Export-Csv (Join-Path $OutputFolder '56_c2r.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "\"%ProgramFiles%\\Common Files\\Microsoft Shared\\ClickToRun\\OfficeC2RClient.exe\" /update user",
    "psRepair": "$client = Join-Path $env:ProgramFiles 'Common Files\\Microsoft Shared\\ClickToRun\\OfficeC2RClient.exe'\nif(Test-Path $client){ Start-Process $client -ArgumentList '/update user' -Wait; Write-Log 'Actualización Office lanzada.' } else { Write-Log 'OfficeC2RClient no encontrado.' }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No hay rollback directo de actualización ClickToRun desde este script."
  },
  {
    "num": 57,
    "slug": "diagnostico-teams-new-classic",
    "title": "Diagnóstico Teams clásico/nuevo",
    "category": "Teams",
    "icon": "🟣",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Detecta Teams clásico, New Teams/AppX, procesos, rutas y versiones.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "tasklist | findstr /i \"teams ms-teams\" > \"%OUT%\\\\57_teams_process.txt\"\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-AppxPackage *MSTeams* | Select Name,Version,PackageFullName | Export-Csv '%OUT%\\\\57_newteams_appx.csv' -NoTypeInformation; Get-ChildItem $env:LOCALAPPDATA\\\\Microsoft\\\\Teams -ErrorAction SilentlyContinue | Select FullName,LastWriteTime | Export-Csv '%OUT%\\\\57_classic_paths.csv' -NoTypeInformation\"",
    "psDiag": "Get-Process Teams,ms-teams -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '57_teams_process.csv') -NoTypeInformation -Encoding UTF8\nGet-AppxPackage *MSTeams* -ErrorAction SilentlyContinue | Select Name,Version,PackageFullName | Export-Csv (Join-Path $OutputFolder '57_newteams_appx.csv') -NoTypeInformation -Encoding UTF8\nGet-ChildItem \"$env:LOCALAPPDATA\\Microsoft\\Teams\" -ErrorAction SilentlyContinue | Select FullName,LastWriteTime | Export-Csv (Join-Path $OutputFolder '57_classic_paths.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Diagnóstico Teams exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 58,
    "slug": "reparar-webview2-runtime",
    "title": "Reparar WebView2 Runtime",
    "category": "Teams",
    "icon": "🌍",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Comprueba WebView2 Runtime y ejecuta instalador local si se proporciona y se activa reparación.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "installerPath",
        "label": "Ruta instalador WebView2 opcional",
        "type": "text",
        "default": ""
      }
    ],
    "batDiag": "reg query \"HKLM\\SOFTWARE\\Microsoft\\EdgeUpdate\\Clients\" /s | findstr /i WebView > \"%OUT%\\\\58_webview2_registry.txt\" 2>&1",
    "psDiag": "Get-ChildItem 'HKLM:\\SOFTWARE\\Microsoft\\EdgeUpdate\\Clients' -ErrorAction SilentlyContinue | ForEach-Object { Get-ItemProperty $_.PSPath } | Where-Object { $_.name -match 'WebView' } | Export-Csv (Join-Path $OutputFolder '58_webview2.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "if exist \"{{installerPath}}\" \"{{installerPath}}\" /silent /install",
    "psRepair": "$Installer='{{installerPath}}'\nif($Installer -and (Test-Path $Installer)){ Start-Process $Installer -ArgumentList '/silent /install' -Wait; Write-Log 'Instalador WebView2 ejecutado.' } else { Write-Log 'No se ha indicado instalador WebView2 válido.' }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Reinstalar WebView2 con el instalador corporativo aprobado si hubiera error."
  },
  {
    "num": 59,
    "slug": "ver-rutas-teams-addin",
    "title": "Ver rutas Teams Add-in",
    "category": "Teams",
    "icon": "🧭",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Localiza versiones del Teams Meeting Add-in y DLLs disponibles bajo AppData/Program Files.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "dir \"%LOCALAPPDATA%\\Microsoft\\TeamsMeetingAdd-in\" /s > \"%OUT%\\\\59_teams_addin_paths.txt\" 2>&1\ndir \"%ProgramFiles%\\Microsoft\\TeamsMeetingAdd-in\" /s >> \"%OUT%\\\\59_teams_addin_paths.txt\" 2>&1",
    "psDiag": "$roots=@(\"$env:LOCALAPPDATA\\Microsoft\\TeamsMeetingAdd-in\",\"$env:ProgramFiles\\Microsoft\\TeamsMeetingAdd-in\",\"${env:ProgramFiles(x86)}\\Microsoft\\TeamsMeetingAdd-in\")\nforeach($r in $roots){ if(Test-Path $r){ Get-ChildItem $r -Recurse -ErrorAction SilentlyContinue | Select FullName,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder ('59_' + ($r -replace '[^a-zA-Z0-9]','_') + '.csv')) -NoTypeInformation -Encoding UTF8 } }\nWrite-Log 'Rutas Teams Add-in exportadas.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 60,
    "slug": "reparar-loadbehavior-teams-addin",
    "title": "Reparar LoadBehavior Teams Add-in",
    "category": "Teams",
    "icon": "📅",
    "risk": "alto",
    "requiresAdmin": true,
    "description": "Fuerza LoadBehavior=3 para TeamsAddin.FastConnect en claves habituales y exporta backup previo.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "reg query \"HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect\" > \"%OUT%\\\\60_teams_addin_antes.txt\" 2>&1\nreg query \"HKLM\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect\" >> \"%OUT%\\\\60_teams_addin_antes.txt\" 2>&1",
    "psDiag": "$paths=@('HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect','HKLM:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect','HKLM:\\Software\\WOW6432Node\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect')\nforeach($p in $paths){ if(Test-Path $p){ Get-ItemProperty $p | Export-Csv (Join-Path $OutputFolder ('60_backup_' + ($p -replace '[^a-zA-Z0-9]','_') + '.csv')) -NoTypeInformation -Encoding UTF8 } }",
    "batRepair": "reg add \"HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect\" /v LoadBehavior /t REG_DWORD /d 3 /f",
    "psRepair": "$paths=@('HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect','HKLM:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect','HKLM:\\Software\\WOW6432Node\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect')\nforeach($p in $paths){ if(Test-Path $p){ Set-ItemProperty $p -Name LoadBehavior -Type DWord -Value 3; Write-Log ('LoadBehavior=3 en ' + $p) } }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Restaurar LoadBehavior anterior desde backup o cambiar valor manualmente."
  },
  {
    "num": 61,
    "slug": "exportar-logs-teams-addin",
    "title": "Exportar logs Teams Add-in",
    "category": "Teams",
    "icon": "📦",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Copia logs de Teams, Add-in y Outlook recientes a carpeta de evidencias.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "zipOutput",
        "label": "Crear ZIP",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$dest='%OUT%\\\\61_logs'; New-Item $dest -ItemType Directory -Force | Out-Null; Copy-Item $env:APPDATA\\\\Microsoft\\\\Teams\\\\logs.txt $dest -ErrorAction SilentlyContinue; Copy-Item $env:LOCALAPPDATA\\\\Microsoft\\\\TeamsMeetingAdd-in $dest -Recurse -ErrorAction SilentlyContinue\"",
    "psDiag": "$dest=Join-Path $OutputFolder '61_logs'\nNew-Item $dest -ItemType Directory -Force | Out-Null\nCopy-Item \"$env:APPDATA\\Microsoft\\Teams\\logs.txt\" $dest -ErrorAction SilentlyContinue\nCopy-Item \"$env:LOCALAPPDATA\\Microsoft\\TeamsMeetingAdd-in\" $dest -Recurse -ErrorAction SilentlyContinue\nGet-WinEvent -FilterHashtable @{LogName='Application'; StartTime=(Get-Date).AddDays(-3)} -ErrorAction SilentlyContinue | Where-Object {$_.ProviderName -match 'Outlook|Teams|Office'} | Export-Csv (Join-Path $dest 'events.csv') -NoTypeInformation -Encoding UTF8\nif('{{zipOutput}}' -eq 'true'){ Compress-Archive $dest (Join-Path $OutputFolder '61_logs_teams_addin.zip') -Force }\nWrite-Log 'Logs Teams/Add-in exportados.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura/copia."
  },
  {
    "num": 62,
    "slug": "limpiar-cache-new-teams-seguro",
    "title": "Limpiar caché New Teams seguro",
    "category": "Teams",
    "icon": "🧹",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Limpia cachés de New Teams con backup opcional y cierre controlado.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "backupFirst",
        "label": "Backup antes de limpiar",
        "type": "checkbox",
        "default": true
      },
      {
        "key": "closeTeams",
        "label": "Cerrar Teams",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "dir \"%LOCALAPPDATA%\\Packages\\MSTeams_8wekyb3d8bbwe\" > \"%OUT%\\\\62_newteams_path.txt\" 2>&1",
    "psDiag": "$pkg=Join-Path $env:LOCALAPPDATA 'Packages\\MSTeams_8wekyb3d8bbwe'\nGet-ChildItem $pkg -ErrorAction SilentlyContinue | Select FullName,LastWriteTime | Export-Csv (Join-Path $OutputFolder '62_newteams_paths.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "if \"{{closeTeams}}\"==\"true\" taskkill /IM ms-teams.exe /F >nul 2>&1\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"$p='$env:LOCALAPPDATA\\\\Packages\\\\MSTeams_8wekyb3d8bbwe'; if(Test-Path $p){ if('{{backupFirst}}' -eq 'true'){ Copy-Item $p '%OUT%\\\\MSTeams_backup' -Recurse -Force -ErrorAction SilentlyContinue }; Get-ChildItem $p -Include Cache,Code Cache,GPUCache -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue }\"",
    "psRepair": "if('{{closeTeams}}' -eq 'true'){ Get-Process ms-teams,Teams -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }\n$pkg=Join-Path $env:LOCALAPPDATA 'Packages\\MSTeams_8wekyb3d8bbwe'\nif(Test-Path $pkg){ if('{{backupFirst}}' -eq 'true'){ Copy-Item $pkg (Join-Path $OutputFolder 'MSTeams_backup') -Recurse -Force -ErrorAction SilentlyContinue }; Get-ChildItem $pkg -Include 'Cache','Code Cache','GPUCache' -Recurse -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue; Write-Log 'Caché New Teams limpiada.' }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Restaurar carpeta MSTeams_backup antes de abrir Teams si fuera necesario."
  },
  {
    "num": 63,
    "slug": "reinstalar-teams-usuario",
    "title": "Reinstalar Teams por usuario",
    "category": "Teams",
    "icon": "🔄",
    "risk": "alto",
    "requiresAdmin": false,
    "description": "Desinstala/reinstala Teams de usuario con winget si está disponible. Diagnóstico por defecto.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "winget list Microsoft.Teams > \"%OUT%\\\\63_winget_teams.txt\" 2>&1",
    "psDiag": "winget list Microsoft.Teams | Out-File (Join-Path $OutputFolder '63_winget_teams.txt') -Encoding UTF8\nGet-AppxPackage *MSTeams* -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '63_appx_teams.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "winget uninstall --id Microsoft.Teams -e --silent\nwinget install --id Microsoft.Teams -e --silent",
    "psRepair": "winget uninstall --id Microsoft.Teams -e --silent | Out-String | Write-Log\nwinget install --id Microsoft.Teams -e --silent | Out-String | Write-Log",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Reinstalar Teams con instalador corporativo o Microsoft Store/winget aprobado."
  },
  {
    "num": 64,
    "slug": "diagnostico-reunion-teams-outlook",
    "title": "Diagnóstico reunión Teams/Outlook",
    "category": "Teams",
    "icon": "🗓️",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Cruza Outlook, Teams, Add-in, LoadBehavior y rutas para incidencias del botón Reunión de Teams.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "reg query \"HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect\" /s > \"%OUT%\\\\64_addin_hkcu.txt\" 2>&1\ndir \"%LOCALAPPDATA%\\Microsoft\\TeamsMeetingAdd-in\" /s > \"%OUT%\\\\64_addin_paths.txt\" 2>&1\ntasklist | findstr /i \"outlook teams ms-teams\" > \"%OUT%\\\\64_process.txt\"",
    "psDiag": "Get-Process OUTLOOK,Teams,ms-teams -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '64_process.csv') -NoTypeInformation -Encoding UTF8\n$paths=@('HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect','HKLM:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect','HKLM:\\Software\\WOW6432Node\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect')\nforeach($p in $paths){ if(Test-Path $p){ Get-ItemProperty $p | Export-Csv (Join-Path $OutputFolder ('64_' + ($p -replace '[^a-zA-Z0-9]','_') + '.csv')) -NoTypeInformation -Encoding UTF8 } }\nGet-ChildItem \"$env:LOCALAPPDATA\\Microsoft\\TeamsMeetingAdd-in\" -Recurse -ErrorAction SilentlyContinue | Select FullName,LastWriteTime | Export-Csv (Join-Path $OutputFolder '64_addin_paths.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Diagnóstico reunión Teams/Outlook exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 65,
    "slug": "diagnostico-entra-id-dsregcmd",
    "title": "Diagnóstico Entra ID dsregcmd",
    "category": "Intune / Autopilot",
    "icon": "🧭",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Exporta dsregcmd /status y datos de unión AD/AAD.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "dsregcmd /status > \"%OUT%\\65_dsregcmd_status.txt\"",
    "psDiag": "dsregcmd /status | Out-File (Join-Path $OutputFolder '65_dsregcmd_status.txt') -Encoding UTF8\nWrite-Log 'dsregcmd exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 66,
    "slug": "exportar-dsregcmd-html",
    "title": "Exportar dsregcmd HTML",
    "category": "Intune / Autopilot",
    "icon": "🧭",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Convierte dsregcmd /status a TXT y HTML básico para ticket.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "dsregcmd /status > \"%OUT%\\66_dsregcmd_status.txt\"",
    "psDiag": "$txt=Join-Path $OutputFolder '66_dsregcmd_status.txt'; dsregcmd /status | Out-File $txt -Encoding UTF8; $content=Get-Content $txt -Raw; ConvertTo-Html -Title 'dsregcmd status' -Body ('<pre>' + [System.Web.HttpUtility]::HtmlEncode($content) + '</pre>') | Set-Content (Join-Path $OutputFolder '66_dsregcmd_status.html') -Encoding UTF8",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 67,
    "slug": "diagnostico-intune-ime",
    "title": "Diagnóstico Intune IME",
    "category": "Intune / Autopilot",
    "icon": "🧭",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Exporta servicio Intune Management Extension, rutas y eventos.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "sc query IntuneManagementExtension > \"%OUT%\\67_ime_service.txt\" 2>&1",
    "psDiag": "Get-Service IntuneManagementExtension -ErrorAction SilentlyContinue | Format-List * | Out-File (Join-Path $OutputFolder '67_ime_service.txt') -Encoding UTF8\nGet-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider/Admin'; StartTime=(Get-Date).AddDays(-7)} -ErrorAction SilentlyContinue | Select TimeCreated,Id,ProviderName,Message | Export-Csv (Join-Path $OutputFolder '67_mdm_events.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 71,
    "slug": "diagnostico-autopilot-esp",
    "title": "Diagnóstico Autopilot ESP",
    "category": "Intune / Autopilot",
    "icon": "🧭",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Exporta claves y eventos relacionados con Autopilot/ESP.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "reg query \"HKLM\\SOFTWARE\\Microsoft\\Provisioning\\Diagnostics\\Autopilot\" /s > \"%OUT%\\71_autopilot_registry.txt\" 2>&1",
    "psDiag": "Get-ChildItem 'HKLM:\\SOFTWARE\\Microsoft\\Provisioning\\Diagnostics\\Autopilot' -Recurse -ErrorAction SilentlyContinue | ForEach-Object { Get-ItemProperty $_.PSPath } | Export-Csv (Join-Path $OutputFolder '71_autopilot_registry.csv') -NoTypeInformation -Encoding UTF8\nGet-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Provisioning-Diagnostics-Provider/Admin'; StartTime=(Get-Date).AddDays(-14)} -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '71_provisioning_events.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 72,
    "slug": "comprobar-estado-mdm",
    "title": "Comprobar estado MDM",
    "category": "Intune / Autopilot",
    "icon": "🧭",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Revisa inscripción MDM, cuentas trabajo/escuela y políticas aplicadas.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "dsregcmd /status > \"%OUT%\\72_dsregcmd.txt\"",
    "psDiag": "dsregcmd /status | Out-File (Join-Path $OutputFolder '72_dsregcmd.txt') -Encoding UTF8\nGet-ChildItem 'HKLM:\\SOFTWARE\\Microsoft\\Enrollments' -Recurse -ErrorAction SilentlyContinue | Select PSChildName,PSPath | Export-Csv (Join-Path $OutputFolder '72_enrollments.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 68,
    "slug": "reiniciar-intune-management-extension",
    "title": "Reiniciar Intune Management Extension",
    "category": "Intune / Autopilot",
    "icon": "🔁",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Reinicia el servicio IntuneManagementExtension tras exportar estado previo.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "sc query IntuneManagementExtension > \"%OUT%\\68_ime_antes.txt\" 2>&1",
    "psDiag": "Get-Service IntuneManagementExtension -ErrorAction SilentlyContinue | Format-List * | Out-File (Join-Path $OutputFolder '68_ime_antes.txt') -Encoding UTF8",
    "batRepair": "net stop IntuneManagementExtension\nnet start IntuneManagementExtension",
    "psRepair": "Restart-Service IntuneManagementExtension -Force\nWrite-Log 'IME reiniciado.'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Volver a reiniciar IME o reiniciar equipo si el servicio queda inconsistente."
  },
  {
    "num": 69,
    "slug": "forzar-sync-company-portal",
    "title": "Forzar sync Company Portal",
    "category": "Intune / Autopilot",
    "icon": "🏢",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Abre configuración de cuentas trabajo/escuela y lanza tareas EnterpriseMgmt detectadas si se solicita.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "runTasks",
        "label": "Ejecutar tareas EnterpriseMgmt",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "schtasks /query /fo LIST /v | findstr /i EnterpriseMgmt > \"%OUT%\\69_enterprisemgmt_tasks.txt\"",
    "psDiag": "Get-ScheduledTask | Where-Object {$_.TaskPath -match 'EnterpriseMgmt'} | Export-Csv (Join-Path $OutputFolder '69_enterprisemgmt_tasks.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "start ms-settings:workplace\nif \"{{runTasks}}\"==\"true\" powershell -NoProfile -Command \"Get-ScheduledTask | ? {$_.TaskPath -match 'EnterpriseMgmt'} | Start-ScheduledTask\"",
    "psRepair": "Start-Process 'ms-settings:workplace'\nif('{{runTasks}}' -eq 'true'){ Get-ScheduledTask | Where-Object {$_.TaskPath -match 'EnterpriseMgmt'} | Start-ScheduledTask; Write-Log 'Tareas EnterpriseMgmt lanzadas.' }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica salvo esperar a que finalicen tareas o reiniciar equipo."
  },
  {
    "num": 70,
    "slug": "exportar-logs-intune-completo",
    "title": "Exportar logs Intune completo",
    "category": "Intune / Autopilot",
    "icon": "📦",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Copia logs IME, eventos MDM y dsregcmd para escalado.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "zipOutput",
        "label": "Crear ZIP",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$d='%OUT%\\\\70_intune_logs'; New-Item $d -ItemType Directory -Force | Out-Null; Copy-Item 'C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\*' $d -ErrorAction SilentlyContinue; dsregcmd /status | Out-File (Join-Path $d 'dsregcmd.txt')\"",
    "psDiag": "$d=Join-Path $OutputFolder '70_intune_logs'\nNew-Item $d -ItemType Directory -Force | Out-Null\nCopy-Item 'C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\*' $d -ErrorAction SilentlyContinue\ndsregcmd /status | Out-File (Join-Path $d 'dsregcmd.txt') -Encoding UTF8\nGet-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider/Admin'; StartTime=(Get-Date).AddDays(-14)} -ErrorAction SilentlyContinue | Export-Csv (Join-Path $d 'mdm_events.csv') -NoTypeInformation -Encoding UTF8\nif('{{zipOutput}}' -eq 'true'){ Compress-Archive $d (Join-Path $OutputFolder '70_intune_logs.zip') -Force }\nWrite-Log 'Logs Intune exportados.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura/copia."
  },
  {
    "num": 73,
    "slug": "reparar-ccmexec",
    "title": "Reparar CCMExec",
    "category": "SCCM",
    "icon": "🛠️",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Reinicia CCMExec y comprueba WMI/cliente.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "sc query CcmExec > \"%OUT%\\73_ccmexec_antes.txt\" 2>&1",
    "psDiag": "Get-Service CcmExec -ErrorAction SilentlyContinue | Format-List * | Out-File (Join-Path $OutputFolder '73_ccmexec_antes.txt') -Encoding UTF8",
    "batRepair": "net stop CcmExec\nnet start CcmExec",
    "psRepair": "Restart-Service CcmExec -Force\nWrite-Log 'CCMExec reiniciado.'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Reiniciar SCCM/Software Center o volver a descargar contenido desplegado si se limpió caché."
  },
  {
    "num": 74,
    "slug": "forzar-acciones-sccm",
    "title": "Forzar acciones SCCM",
    "category": "SCCM",
    "icon": "🛠️",
    "risk": "medio",
    "requiresAdmin": true,
    "description": "Lanza acciones habituales de cliente SCCM por ScheduleID.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "echo Acciones SCCM preparadas > \"%OUT%\\74_sccm_actions.txt\"",
    "psDiag": "Write-Log 'Acciones SCCM preparadas.'",
    "batRepair": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$ids=@('{00000000-0000-0000-0000-000000000021}','{00000000-0000-0000-0000-000000000022}','{00000000-0000-0000-0000-000000000003}','{00000000-0000-0000-0000-000000000113}'); foreach($id in $ids){ Invoke-WmiMethod -Namespace root\\ccm -Class SMS_Client -Name TriggerSchedule -ArgumentList $id }\"",
    "psRepair": "$ids=@('{00000000-0000-0000-0000-000000000021}','{00000000-0000-0000-0000-000000000022}','{00000000-0000-0000-0000-000000000003}','{00000000-0000-0000-0000-000000000113}')\nforeach($id in $ids){ Invoke-WmiMethod -Namespace root\\ccm -Class SMS_Client -Name TriggerSchedule -ArgumentList $id | Out-Null; Write-Log ('Schedule lanzado: ' + $id) }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Reiniciar SCCM/Software Center o volver a descargar contenido desplegado si se limpió caché."
  },
  {
    "num": 75,
    "slug": "limpiar-cache-sccm",
    "title": "Limpiar caché SCCM",
    "category": "SCCM",
    "icon": "🛠️",
    "risk": "alto",
    "requiresAdmin": true,
    "description": "Vacía caché SCCM mediante UIResource.UIResourceMgr si se activa.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "powershell -NoProfile -Command \"Get-WmiObject -Namespace root\\ccm\\SoftMgmtAgent -Class CacheInfoEx | Export-Csv '%OUT%\\75_sccm_cache.csv' -NoTypeInformation\"",
    "psDiag": "Get-WmiObject -Namespace root\\ccm\\SoftMgmtAgent -Class CacheInfoEx -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '75_sccm_cache.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$resman=New-Object -ComObject UIResource.UIResourceMgr; $cache=$resman.GetCacheInfo(); $cache.GetCacheElements() | %% { $cache.DeleteCacheElement($_.CacheElementID) }\"",
    "psRepair": "$resman=New-Object -ComObject UIResource.UIResourceMgr\n$cache=$resman.GetCacheInfo()\n$cache.GetCacheElements() | ForEach-Object { $cache.DeleteCacheElement($_.CacheElementID); Write-Log ('Eliminado cache ID: ' + $_.CacheElementID) }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Reiniciar SCCM/Software Center o volver a descargar contenido desplegado si se limpió caché."
  },
  {
    "num": 76,
    "slug": "exportar-logs-sccm-completo",
    "title": "Exportar logs SCCM completo",
    "category": "SCCM",
    "icon": "📦",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Copia logs principales de CCM para escalado.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "zipOutput",
        "label": "Crear ZIP",
        "type": "checkbox",
        "default": true
      }
    ],
    "batDiag": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"$d='%OUT%\\\\76_sccm_logs'; New-Item $d -ItemType Directory -Force | Out-Null; Copy-Item 'C:\\Windows\\CCM\\Logs\\*.log' $d -ErrorAction SilentlyContinue\"",
    "psDiag": "$d=Join-Path $OutputFolder '76_sccm_logs'\nNew-Item $d -ItemType Directory -Force | Out-Null\nCopy-Item 'C:\\Windows\\CCM\\Logs\\*.log' $d -ErrorAction SilentlyContinue\nif('{{zipOutput}}' -eq 'true'){ Compress-Archive $d (Join-Path $OutputFolder '76_sccm_logs.zip') -Force }\nWrite-Log 'Logs SCCM exportados.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura/copia."
  },
  {
    "num": 77,
    "slug": "diagnostico-cliente-sccm",
    "title": "Diagnóstico cliente SCCM",
    "category": "SCCM",
    "icon": "🧾",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Exporta cliente SCCM, site code, servicio, WMI y Software Center.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "sc query CcmExec > \"%OUT%\\\\77_ccmexec.txt\" 2>&1\npowershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-WmiObject -Namespace root\\\\ccm -Class SMS_Client | Export-Csv '%OUT%\\\\77_sms_client.csv' -NoTypeInformation\"",
    "psDiag": "Get-Service CcmExec -ErrorAction SilentlyContinue | Format-List * | Out-File (Join-Path $OutputFolder '77_ccmexec.txt') -Encoding UTF8\nGet-WmiObject -Namespace root\\ccm -Class SMS_Client -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '77_sms_client.csv') -NoTypeInformation -Encoding UTF8\nGet-ChildItem 'C:\\Windows\\CCM\\Logs' -ErrorAction SilentlyContinue | Select Name,Length,LastWriteTime | Export-Csv (Join-Path $OutputFolder '77_logs_list.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Diagnóstico cliente SCCM exportado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 78,
    "slug": "abrir-software-center",
    "title": "Abrir Software Center",
    "category": "SCCM",
    "icon": "🪟",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Abre Software Center y exporta ruta detectada.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "if exist \"%WINDIR%\\CCM\\SCClient.exe\" start \"\" \"%WINDIR%\\CCM\\SCClient.exe\"",
    "psDiag": "$sc=Join-Path $env:WINDIR 'CCM\\SCClient.exe'\n[pscustomobject]@{SoftwareCenter=$sc; Exists=(Test-Path $sc)} | Export-Csv (Join-Path $OutputFolder '78_software_center.csv') -NoTypeInformation -Encoding UTF8\nif(Test-Path $sc){ Start-Process $sc; Write-Log 'Software Center abierto.' } else { Write-Log 'Software Center no encontrado.' }",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Cerrar Software Center."
  },
  {
    "num": 79,
    "slug": "diagnostico-impresoras-completo",
    "title": "Diagnóstico impresoras completo",
    "category": "Impresoras",
    "icon": "🖨️",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Exporta impresoras, puertos, drivers y servicio spooler.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "powershell -NoProfile -Command \"Get-Printer | Export-Csv '%OUT%\\79_printers.csv' -NoTypeInformation; Get-PrinterDriver | Export-Csv '%OUT%\\79_drivers.csv' -NoTypeInformation\"",
    "psDiag": "Get-Printer -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '79_printers.csv') -NoTypeInformation -Encoding UTF8\nGet-PrinterPort -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '79_ports.csv') -NoTypeInformation -Encoding UTF8\nGet-PrinterDriver -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '79_drivers.csv') -NoTypeInformation -Encoding UTF8\nGet-Service Spooler | Format-List * | Out-File (Join-Path $OutputFolder '79_spooler.txt') -Encoding UTF8",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 80,
    "slug": "instalar-impresora-red",
    "title": "Instalar impresora de red",
    "category": "Impresoras",
    "icon": "➕",
    "risk": "medio",
    "requiresAdmin": false,
    "description": "Instala impresora de red por ruta UNC y opcionalmente la establece como predeterminada.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "printerPath",
        "label": "Ruta impresora",
        "type": "text",
        "default": "\\\\servidor\\impresora"
      },
      {
        "key": "setDefault",
        "label": "Establecer predeterminada",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "echo Ruta impresora: {{printerPath}}",
    "psDiag": "Write-Log 'Ruta impresora: {{printerPath}}'",
    "batRepair": "rundll32 printui.dll,PrintUIEntry /in /n \"{{printerPath}}\"\nif \"{{setDefault}}\"==\"true\" rundll32 printui.dll,PrintUIEntry /y /n \"{{printerPath}}\"",
    "psRepair": "Add-Printer -ConnectionName '{{printerPath}}'\nif('{{setDefault}}' -eq 'true'){ (New-Object -ComObject WScript.Network).SetDefaultPrinter('{{printerPath}}') }\nWrite-Log 'Impresora instalada.'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Eliminar impresora desde configuración o con Remove-Printer/Add-Printer según corresponda."
  },
  {
    "num": 81,
    "slug": "eliminar-impresoras-red",
    "title": "Eliminar impresoras de red",
    "category": "Impresoras",
    "icon": "➖",
    "risk": "alto",
    "requiresAdmin": false,
    "description": "Elimina impresoras de red, todas o por filtro, tras exportar inventario.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      },
      {
        "key": "nameFilter",
        "label": "Filtro de nombre/conexión",
        "type": "text",
        "default": "\\\\servidor"
      }
    ],
    "batDiag": "powershell -NoProfile -Command \"Get-Printer | Export-Csv '%OUT%\\81_printers_backup.csv' -NoTypeInformation\"",
    "psDiag": "Get-Printer | Export-Csv (Join-Path $OutputFolder '81_printers_backup.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-Printer | ? { $_.Name -like '*{{nameFilter}}*' -or $_.ShareName -like '*{{nameFilter}}*' } | Remove-Printer\"",
    "psRepair": "Get-Printer | Where-Object { $_.Name -like '*{{nameFilter}}*' -or $_.ShareName -like '*{{nameFilter}}*' } | ForEach-Object { Remove-Printer -Name $_.Name; Write-Log ('Eliminada: ' + $_.Name) }",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Reinstalar desde backup `81_printers_backup.csv` o por ruta UNC."
  },
  {
    "num": 82,
    "slug": "limpiar-spooler-avanzado",
    "title": "Limpiar Spooler avanzado",
    "category": "Impresoras",
    "icon": "🧽",
    "risk": "alto",
    "requiresAdmin": true,
    "description": "Detiene spooler, limpia trabajos pendientes y lo reinicia.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "executeRepair",
        "label": "Ejecutar reparación/cambios reales",
        "type": "checkbox",
        "default": false
      }
    ],
    "batDiag": "dir \"%WINDIR%\\System32\\spool\\PRINTERS\" > \"%OUT%\\82_spool_antes.txt\" 2>&1",
    "psDiag": "Get-ChildItem \"$env:WINDIR\\System32\\spool\\PRINTERS\" -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '82_spool_antes.csv') -NoTypeInformation -Encoding UTF8",
    "batRepair": "net stop spooler\ndel /q /f \"%WINDIR%\\System32\\spool\\PRINTERS\\*.*\"\nnet start spooler",
    "psRepair": "Stop-Service Spooler -Force\nRemove-Item \"$env:WINDIR\\System32\\spool\\PRINTERS\\*\" -Force -ErrorAction SilentlyContinue\nStart-Service Spooler\nWrite-Log 'Spooler limpiado y reiniciado.'",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No hay rollback de trabajos eliminados; reimprimir documentos pendientes."
  },
  {
    "num": 83,
    "slug": "exportar-drivers-impresora",
    "title": "Exportar drivers impresora",
    "category": "Impresoras",
    "icon": "💾",
    "risk": "bajo",
    "requiresAdmin": true,
    "description": "Exporta drivers de impresora instalados con pnputil para backup/evidencia.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      }
    ],
    "batDiag": "pnputil /enum-drivers > \"%OUT%\\83_pnputil_drivers.txt\"",
    "psDiag": "pnputil /enum-drivers | Out-File (Join-Path $OutputFolder '83_pnputil_drivers.txt') -Encoding UTF8\nGet-PrinterDriver -ErrorAction SilentlyContinue | Export-Csv (Join-Path $OutputFolder '83_printer_drivers.csv') -NoTypeInformation -Encoding UTF8\nWrite-Log 'Drivers inventariados.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 84,
    "slug": "generar-informe-html-ticket",
    "title": "Generar informe HTML ticket",
    "category": "Tickets CAU",
    "icon": "📄",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Genera informe HTML con datos básicos de equipo, usuario, red y descripción de incidencia.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "ticketId",
        "label": "Ticket",
        "type": "text",
        "default": "TICKET-0000"
      },
      {
        "key": "issue",
        "label": "Incidencia",
        "type": "text",
        "default": "Descripción breve"
      }
    ],
    "batDiag": "powershell -NoProfile -ExecutionPolicy Bypass -Command \"Get-ComputerInfo | Out-File '%OUT%\\84_computer.txt'; ipconfig /all > '%OUT%\\84_ipconfig.txt'\"",
    "psDiag": "$ticket='{{ticketId}}'; $issue='{{issue}}'\n$info=[pscustomobject]@{Ticket=$ticket;Issue=$issue;Computer=$env:COMPUTERNAME;User=$env:USERNAME;Date=(Get-Date)}\n$info | ConvertTo-Html -Title $ticket | Set-Content (Join-Path $OutputFolder '84_informe_ticket.html') -Encoding UTF8\nGet-ComputerInfo | Out-File (Join-Path $OutputFolder '84_computer.txt') -Encoding UTF8\nGet-NetIPConfiguration | Out-File (Join-Path $OutputFolder '84_network.txt') -Encoding UTF8\nWrite-Log 'Informe HTML generado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo lectura."
  },
  {
    "num": 85,
    "slug": "generar-zip-evidencias-cau",
    "title": "Generar ZIP evidencias CAU",
    "category": "Tickets CAU",
    "icon": "🗜️",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Agrupa logs generados en un ZIP para adjuntar al ticket.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "sourceFolder",
        "label": "Carpeta a comprimir",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "zipName",
        "label": "Nombre ZIP",
        "type": "text",
        "default": "evidencias_cau.zip"
      }
    ],
    "batDiag": "powershell -NoProfile -Command \"Compress-Archive -Path '{{sourceFolder}}\\*' -DestinationPath '%OUT%\\{{zipName}}' -Force\"",
    "psDiag": "$src='{{sourceFolder}}'; $zip=Join-Path $OutputFolder '{{zipName}}'\nif(Test-Path $src){ Compress-Archive -Path (Join-Path $src '*') -DestinationPath $zip -Force; Write-Log ('ZIP generado: ' + $zip) } else { Write-Log ('No existe carpeta origen: ' + $src) }",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "Borrar ZIP si contiene datos que no deben adjuntarse."
  },
  {
    "num": 86,
    "slug": "copiar-resumen-diagnostico-portapapeles",
    "title": "Copiar resumen diagnóstico al portapapeles",
    "category": "Tickets CAU",
    "icon": "📋",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Genera resumen breve de equipo/red y lo copia al portapapeles.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "issue",
        "label": "Incidencia",
        "type": "text",
        "default": "Pendiente de completar"
      }
    ],
    "batDiag": "powershell -NoProfile -Command \"$s='Equipo: '+$env:COMPUTERNAME+' Usuario: '+$env:USERNAME+' Incidencia: {{issue}}'; Set-Clipboard $s; $s | Out-File '%OUT%\\86_resumen.txt'\"",
    "psDiag": "$summary = \"Equipo: $env:COMPUTERNAME`nUsuario: $env:USERNAME`nIncidencia: {{issue}}`nFecha: $(Get-Date)\"\n$summary | Set-Clipboard\n$summary | Out-File (Join-Path $OutputFolder '86_resumen.txt') -Encoding UTF8\nWrite-Log 'Resumen copiado al portapapeles.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica."
  },
  {
    "num": 87,
    "slug": "checklist-outlook-no-abre",
    "title": "Checklist Outlook no abre",
    "category": "Tickets CAU",
    "icon": "🧾",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Genera checklist/plantilla HTML para documentación y comunicación CAU.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "ticketId",
        "label": "Ticket",
        "type": "text",
        "default": "TICKET-0000"
      }
    ],
    "batDiag": "echo Generando Checklist Outlook no abre > \"%OUT%\\87_checklist.txt\"",
    "psDiag": "$items = '1. Abrir en modo seguro;2. Revisar add-ins;3. Reset navpane;4. Revisar perfil;5. Revisar OST/PST;6. Escalar con eventos'.Split(';')\n$html = $items | ForEach-Object { '<li>' + $_ + '</li>' }\n('<h1>{{ticketId}} - Outlook no abre</h1><ul>' + ($html -join '') + '</ul>') | Set-Content (Join-Path $OutputFolder '87_checklist-outlook-no-abre.html') -Encoding UTF8\nWrite-Log 'Checklist/plantilla generado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo genera documentación."
  },
  {
    "num": 88,
    "slug": "checklist-sin-red",
    "title": "Checklist sin red",
    "category": "Tickets CAU",
    "icon": "🧾",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Genera checklist/plantilla HTML para documentación y comunicación CAU.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "ticketId",
        "label": "Ticket",
        "type": "text",
        "default": "TICKET-0000"
      }
    ],
    "batDiag": "echo Generando Checklist sin red > \"%OUT%\\88_checklist.txt\"",
    "psDiag": "$items = '1. Ver IP/gateway/DNS;2. Ping gateway;3. Test DNS;4. Proxy/VPN;5. Recursos UNC;6. Reset controlado si procede'.Split(';')\n$html = $items | ForEach-Object { '<li>' + $_ + '</li>' }\n('<h1>{{ticketId}} - Sin red</h1><ul>' + ($html -join '') + '</ul>') | Set-Content (Join-Path $OutputFolder '88_checklist-sin-red.html') -Encoding UTF8\nWrite-Log 'Checklist/plantilla generado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo genera documentación."
  },
  {
    "num": 89,
    "slug": "checklist-no-imprime",
    "title": "Checklist no imprime",
    "category": "Tickets CAU",
    "icon": "🧾",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Genera checklist/plantilla HTML para documentación y comunicación CAU.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "ticketId",
        "label": "Ticket",
        "type": "text",
        "default": "TICKET-0000"
      }
    ],
    "batDiag": "echo Generando Checklist no imprime > \"%OUT%\\89_checklist.txt\"",
    "psDiag": "$items = '1. Revisar impresora predeterminada;2. Reiniciar spooler;3. Limpiar cola;4. Probar driver/puerto;5. Reinstalar impresora;6. Escalar con logs'.Split(';')\n$html = $items | ForEach-Object { '<li>' + $_ + '</li>' }\n('<h1>{{ticketId}} - No imprime</h1><ul>' + ($html -join '') + '</ul>') | Set-Content (Join-Path $OutputFolder '89_checklist-no-imprime.html') -Encoding UTF8\nWrite-Log 'Checklist/plantilla generado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo genera documentación."
  },
  {
    "num": 90,
    "slug": "plantilla-cierre-ticket",
    "title": "Plantilla cierre ticket",
    "category": "Tickets CAU",
    "icon": "🧾",
    "risk": "bajo",
    "requiresAdmin": false,
    "description": "Genera checklist/plantilla HTML para documentación y comunicación CAU.",
    "fields": [
      {
        "key": "outputFolder",
        "label": "Carpeta de salida/logs",
        "type": "text",
        "default": "C:\\CAU\\ScriptForge404"
      },
      {
        "key": "ticketId",
        "label": "Ticket",
        "type": "text",
        "default": "TICKET-0000"
      }
    ],
    "batDiag": "echo Generando Plantilla cierre ticket > \"%OUT%\\90_checklist.txt\"",
    "psDiag": "$items = 'Se informa al usuario de que la incidencia queda resuelta.;Acciones realizadas: diagnóstico, reparación y validación.;Si reaparece, reabrir ticket con capturas/logs.'.Split(';')\n$html = $items | ForEach-Object { '<li>' + $_ + '</li>' }\n('<h1>{{ticketId}} - Cierre de ticket</h1><ul>' + ($html -join '') + '</ul>') | Set-Content (Join-Path $OutputFolder '90_plantilla-cierre-ticket.html') -Encoding UTF8\nWrite-Log 'Checklist/plantilla generado.'",
    "batRepair": "",
    "psRepair": "",
    "checklistPre": [
      "Ejecutar primero en modo diagnóstico.",
      "Confirmar autorización del usuario/equipo antes de aplicar cambios."
    ],
    "checklistPost": [
      "Revisar logs generados en la carpeta de salida.",
      "Validar con el usuario que la incidencia queda resuelta."
    ],
    "rollback": "No aplica: solo genera documentación."
  }
];

  SPECS.forEach(spec => {
    const repairable = hasRepair(spec);
    add({
      id: `v5-pro-${String(spec.num).padStart(2, '0')}-${spec.slug}`,
      name: `V5.4 Pro - ${spec.title}`,
      category: spec.category,
      icon: spec.icon,
      risk: spec.risk,
      requiresAdmin: !!spec.requiresAdmin,
      description: spec.description,
      fields: spec.fields || [],
      riskyFields: repairable ? riskyFields(spec.risk) : [],
      riskNotes: spec.risk === 'alto'
        ? ['Plantilla V5.4 Pro con posibles cambios sensibles si se activa reparacion. Por defecto genera diagnostico.']
        : spec.risk === 'medio'
          ? ['Plantilla V5.4 Pro con cambios locales controlados si se activa reparacion.']
          : ['Plantilla V5.4 Pro de diagnostico/soporte.'],
      checklistPre: spec.checklistPre || [],
      checklistPost: spec.checklistPost || [],
      rollback: spec.rollback || 'No aplica.',
      batBody: (v) => tpl`${headerBat(v, spec.title)}
${rep(spec.batDiag, v, 'bat')}
${repairable ? (bool(v.executeRepair) ? rep(spec.batRepair, v, 'bat') : 'echo [MODO DIAGNOSTICO] No se ejecutan cambios reales. Active reparacion para aplicar acciones.') : ''}`,
      ps1Body: (v) => tpl`${headerPs(v, spec.title)}
${rep(spec.psDiag, v, 'ps')}
${repairable ? (bool(v.executeRepair) ? rep(spec.psRepair, v, 'ps') : "Write-Log 'Modo diagnostico: no se ejecutan cambios reales. Active reparacion para aplicar acciones.'") : ''}`
    });
  });
})();
