/* ============================================================
   ScriptForge 404 - templates-cau-mega.js
   Mega Pack CAU/N1/N2/N3 basado en el repositorio premium de
   250+ scripts propuesto por el usuario.

   Nota de diseño:
   - Estas entradas amplían el catálogo con plantillas generativas.
   - Las acciones con riesgo se generan con modo seguro por defecto:
     campo executeChanges=false + soporte DryRun global.
   - Las plantillas ya específicas de templates.js/templates-extra.js
     se conservan; este pack añade cobertura masiva y editable.
   ============================================================ */

(function () {
  if (typeof SFTemplates === 'undefined' || !Array.isArray(SFTemplates)) {
    console.warn('SFTemplates no esta disponible. No se cargan plantillas CAU Mega Pack.');
    return;
  }

  const templates = SFTemplates;
  const exists = (id) => templates.some(t => t.id === id);
  const add = (tpl) => { if (!exists(tpl.id)) templates.push(tpl); };

  const CAU_MEGA_ENTRIES = [
  {
    "id": "cau-mega-01-launcher-maestro-con-menu-por-categorias",
    "name": "Launcher maestro con menú por categorías",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-ejecutar-como-administrador",
    "name": "Ejecutar como administrador",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-comprobar-si-el-script-esta-elevado",
    "name": "Comprobar si el script está elevado",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-crear-carpeta-de-trabajo-temporal",
    "name": "Crear carpeta de trabajo temporal",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-crear-punto-de-restauracion",
    "name": "Crear punto de restauración",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-modo-diagnostico-sin-modificar-nada",
    "name": "Modo diagnóstico sin modificar nada",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-modo-reparacion-automatica",
    "name": "Modo reparación automática",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-modo-silencioso-corporativo",
    "name": "Modo silencioso corporativo",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-exportar-informe-final-a-txt-html-csv",
    "name": "Exportar informe final a TXT/HTML/CSV",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-menu-interactivo-con-opciones-numeradas",
    "name": "Menú interactivo con opciones numeradas",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-cargador-de-modulos-comunes",
    "name": "Cargador de módulos comunes",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-validador-de-permisos",
    "name": "Validador de permisos",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-validador-de-conexion-a-internet",
    "name": "Validador de conexión a internet",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-validador-de-dominio-corporativo",
    "name": "Validador de dominio corporativo",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-detector-de-windows-10-11",
    "name": "Detector de Windows 10/11",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-detector-de-arquitectura-32-64-bits",
    "name": "Detector de arquitectura 32/64 bits",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-detector-de-portatil-sobremesa-vm",
    "name": "Detector de portátil/sobremesa/VM",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-comprobador-de-version-de-powershell",
    "name": "Comprobador de versión de PowerShell",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-actualizador-del-propio-toolkit",
    "name": "Actualizador del propio toolkit",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-01-generador-automatico-de-nuevos-scripts-desde-plantilla",
    "name": "Generador automático de nuevos scripts desde plantilla",
    "category": "Base CAU",
    "section": "Scripts base del repositorio",
    "scriptTypeHint": "PS1/HTML",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧰"
  },
  {
    "id": "cau-mega-02-inventario-completo-del-pc",
    "name": "Inventario completo del PC",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-exportar-hostname-usuario-dominio-ip-serial",
    "name": "Exportar hostname, usuario, dominio, IP, serial",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-modelo-fabricante-y-bios",
    "name": "Ver modelo, fabricante y BIOS",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-numero-de-serie",
    "name": "Ver número de serie",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-cpu-ram-disco",
    "name": "Ver CPU/RAM/disco",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-version-de-windows-y-build",
    "name": "Ver versión de Windows y build",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-uptime-del-equipo",
    "name": "Ver uptime del equipo",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-usuario-logado",
    "name": "Ver usuario logado",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-grupos-locales-del-usuario",
    "name": "Ver grupos locales del usuario",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-programas-instalados",
    "name": "Ver programas instalados",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-hotfixes-instalados",
    "name": "Ver hotfixes instalados",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-actualizaciones-pendientes",
    "name": "Ver actualizaciones pendientes",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-estado-de-activacion-windows",
    "name": "Ver estado de activación Windows",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-licencia-office",
    "name": "Ver licencia Office",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-impresoras-instaladas",
    "name": "Ver impresoras instaladas",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-unidades-de-red-mapeadas",
    "name": "Ver unidades de red mapeadas",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1/BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-conexiones-vpn-activas",
    "name": "Ver conexiones VPN activas",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-adaptadores-de-red",
    "name": "Ver adaptadores de red",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-ver-proxy-configurado",
    "name": "Ver proxy configurado",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-generar-informe-html-del-equipo",
    "name": "Generar informe HTML del equipo",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-02-generar-informe-para-ticket-cau",
    "name": "Generar informe para ticket CAU",
    "category": "Inventario",
    "section": "Inventario del equipo",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🧾"
  },
  {
    "id": "cau-mega-03-diagnostico-completo-de-red",
    "name": "Diagnóstico completo de red",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-mostrar-ip-gateway-dns-mac",
    "name": "Mostrar IP, gateway, DNS, MAC",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-renovar-ip",
    "name": "Renovar IP",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-liberar-ip",
    "name": "Liberar IP",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-flush-dns",
    "name": "Flush DNS",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-reset-winsock",
    "name": "Reset Winsock",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-reset-tcp-ip",
    "name": "Reset TCP/IP",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-probar-ping-a-gateway",
    "name": "Probar ping a gateway",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-probar-ping-a-dns-corporativo",
    "name": "Probar ping a DNS corporativo",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-probar-ping-a-servidor-concreto",
    "name": "Probar ping a servidor concreto",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-test-de-puertos-tcp",
    "name": "Test de puertos TCP",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-test-de-conectividad-vpn",
    "name": "Test de conectividad VPN",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-ver-rutas-activas",
    "name": "Ver rutas activas",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-limpiar-cache-arp",
    "name": "Limpiar caché ARP",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-reiniciar-adaptador-de-red",
    "name": "Reiniciar adaptador de red",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-desactivar-activar-wifi",
    "name": "Desactivar/activar WiFi",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-reparar-adaptador-ethernet",
    "name": "Reparar adaptador Ethernet",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-ver-velocidad-del-enlace",
    "name": "Ver velocidad del enlace",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-detectar-red-publica-privada-dominio",
    "name": "Detectar red pública/privada/dominio",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-cambiar-perfil-de-red-a-privado-dominio-cuando-proceda",
    "name": "Cambiar perfil de red a privado/dominio cuando proceda",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-comprobar-resolucion-dns-interna",
    "name": "Comprobar resolución DNS interna",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-comprobar-proxy-winhttp",
    "name": "Comprobar proxy WinHTTP",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1/BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-reset-proxy-winhttp",
    "name": "Reset proxy WinHTTP",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-configurar-proxy-corporativo",
    "name": "Configurar proxy corporativo",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-quitar-proxy-erroneo",
    "name": "Quitar proxy erróneo",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-diagnostico-de-acceso-a-intranet",
    "name": "Diagnóstico de acceso a intranet",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-diagnostico-de-acceso-a-rutas-unc",
    "name": "Diagnóstico de acceso a rutas UNC",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-diagnostico-de-latencia",
    "name": "Diagnóstico de latencia",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-03-exportar-resultado-de-red-para-ticket",
    "name": "Exportar resultado de red para ticket",
    "category": "Red",
    "section": "Red, IP, DNS y conectividad",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌐"
  },
  {
    "id": "cau-mega-04-mapear-unidad-de-red-simple",
    "name": "Mapear unidad de red simple",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-mapear-varias-unidades-de-red",
    "name": "Mapear varias unidades de red",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-mapear-unidad-segun-usuario-departamento",
    "name": "Mapear unidad según usuario/departamento",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-mapear-unidad-segun-grupo-ad",
    "name": "Mapear unidad según grupo AD",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-desconectar-unidad-de-red",
    "name": "Desconectar unidad de red",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-desconectar-todas-las-unidades",
    "name": "Desconectar todas las unidades",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-reparar-unidades-desconectadas",
    "name": "Reparar unidades desconectadas",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-comprobar-acceso-a-ruta-unc",
    "name": "Comprobar acceso a ruta UNC",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-comprobar-permisos-sobre-carpeta-compartida",
    "name": "Comprobar permisos sobre carpeta compartida",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-crear-acceso-directo-a-carpeta-corporativa",
    "name": "Crear acceso directo a carpeta corporativa",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-crear-unidad-persistente",
    "name": "Crear unidad persistente",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-crear-unidad-temporal-no-persistente",
    "name": "Crear unidad temporal no persistente",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-limpiar-credenciales-de-red-antiguas",
    "name": "Limpiar credenciales de red antiguas",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-anadir-credencial-con-cmdkey",
    "name": "Añadir credencial con cmdkey",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-eliminar-credencial-con-cmdkey",
    "name": "Eliminar credencial con cmdkey",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-diagnostico-de-error-acceso-denegado",
    "name": "Diagnóstico de error “acceso denegado”",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-diagnostico-de-error-ruta-no-encontrada",
    "name": "Diagnóstico de error “ruta no encontrada”",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-04-generador-interactivo-de-script-de-mapeo",
    "name": "Generador interactivo de script de mapeo",
    "category": "Unidades de red",
    "section": "Unidades de red y recursos compartidos",
    "scriptTypeHint": "PS1/HTML",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🗂️"
  },
  {
    "id": "cau-mega-05-diagnostico-office-completo",
    "name": "Diagnóstico Office completo",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-reparacion-rapida-office",
    "name": "Reparación rápida Office",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-reparacion-online-office",
    "name": "Reparación online Office",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-limpiar-cache-office",
    "name": "Limpiar caché Office",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-limpiar-credenciales-office",
    "name": "Limpiar credenciales Office",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-ver-version-office-instalada",
    "name": "Ver versión Office instalada",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-ver-canal-office",
    "name": "Ver canal Office",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-ver-arquitectura-office-32-64-bits",
    "name": "Ver arquitectura Office 32/64 bits",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-ver-licencias-office",
    "name": "Ver licencias Office",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-forzar-actualizacion-office",
    "name": "Forzar actualización Office",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-resetear-activacion-office",
    "name": "Resetear activación Office",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-reparar-outlook-no-abre",
    "name": "Reparar Outlook no abre",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-crear-nuevo-perfil-outlook",
    "name": "Crear nuevo perfil Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-abrir-panel-de-perfiles-outlook",
    "name": "Abrir panel de perfiles Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-borrar-cache-de-autocomplete-outlook",
    "name": "Borrar caché de Autocomplete Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-reparar-ost-corrupto",
    "name": "Reparar OST corrupto",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-limpiar-cache-roamcache",
    "name": "Limpiar caché RoamCache",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-reiniciar-busqueda-outlook",
    "name": "Reiniciar búsqueda Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-reparar-indexacion-outlook",
    "name": "Reparar indexación Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-reparar-complementos-outlook",
    "name": "Reparar complementos Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-deshabilitar-todos-los-add-ins-outlook",
    "name": "Deshabilitar todos los add-ins Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-habilitar-add-in-concreto",
    "name": "Habilitar add-in concreto",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-reparar-boton-teams-meeting-outlook",
    "name": "Reparar botón Teams Meeting Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1/BAT",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-registrar-teams-meeting-add-in",
    "name": "Registrar Teams Meeting Add-in",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-ver-loadbehavior-de-add-ins-outlook",
    "name": "Ver LoadBehavior de add-ins Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-resetear-firma-outlook",
    "name": "Resetear firma Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-exportar-configuracion-outlook",
    "name": "Exportar configuración Outlook",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-abrir-outlook-en-modo-seguro",
    "name": "Abrir Outlook en modo seguro",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-abrir-outlook-con-resetnavpane",
    "name": "Abrir Outlook con /resetnavpane",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-abrir-outlook-con-cleanviews",
    "name": "Abrir Outlook con /cleanviews",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-abrir-outlook-con-profiles",
    "name": "Abrir Outlook con /profiles",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-05-diagnostico-teams-outlook-add-in",
    "name": "Diagnóstico Teams + Outlook + Add-in",
    "category": "Office / Outlook",
    "section": "Office, Outlook y Microsoft 365",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📬"
  },
  {
    "id": "cau-mega-06-diagnostico-teams-clasico-nuevo",
    "name": "Diagnóstico Teams clásico/nuevo",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-cerrar-teams-completamente",
    "name": "Cerrar Teams completamente",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-limpiar-cache-teams-clasico",
    "name": "Limpiar caché Teams clásico",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-limpiar-cache-new-teams",
    "name": "Limpiar caché New Teams",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-reinstalar-teams-por-usuario",
    "name": "Reinstalar Teams por usuario",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-reinstalar-teams-machine-wide",
    "name": "Reinstalar Teams Machine-Wide",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-ver-version-teams-instalada",
    "name": "Ver versión Teams instalada",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-ver-rutas-del-teams-add-in",
    "name": "Ver rutas del Teams Add-in",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-reparar-teams-meeting-add-in",
    "name": "Reparar Teams Meeting Add-in",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-forzar-registro-dll-add-in-teams",
    "name": "Forzar registro DLL Add-in Teams",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-detectar-conflicto-entre-teams-clasico-y-nuevo",
    "name": "Detectar conflicto entre Teams clásico y nuevo",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-limpiar-credenciales-teams",
    "name": "Limpiar credenciales Teams",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-abrir-logs-teams",
    "name": "Abrir logs Teams",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-exportar-logs-teams-para-ticket",
    "name": "Exportar logs Teams para ticket",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-reset-de-estado-teams-sin-borrar-datos-criticos",
    "name": "Reset de estado Teams sin borrar datos críticos",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-comprobador-de-webview2",
    "name": "Comprobador de WebView2",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "💬"
  },
  {
    "id": "cau-mega-06-reinstalar-webview2-runtime",
    "name": "Reinstalar WebView2 Runtime",
    "category": "Teams",
    "section": "Microsoft Teams",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "💬"
  },
  {
    "id": "cau-mega-07-diagnostico-windows-update",
    "name": "Diagnóstico Windows Update",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-reiniciar-servicios-windows-update",
    "name": "Reiniciar servicios Windows Update",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-limpiar-softwaredistribution",
    "name": "Limpiar SoftwareDistribution",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-limpiar-catroot2",
    "name": "Limpiar Catroot2",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-reset-completo-windows-update",
    "name": "Reset completo Windows Update",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-buscar-actualizaciones-pendientes",
    "name": "Buscar actualizaciones pendientes",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-instalar-actualizaciones-con-pswindowsupdate",
    "name": "Instalar actualizaciones con PSWindowsUpdate",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-ver-historial-de-updates",
    "name": "Ver historial de updates",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-desinstalar-kb-concreta",
    "name": "Desinstalar KB concreta",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1/BAT",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-ocultar-update-problematico",
    "name": "Ocultar update problemático",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-reparar-error-windows-update-generico",
    "name": "Reparar error Windows Update genérico",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-exportar-errores-windows-update",
    "name": "Exportar errores Windows Update",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-comprobar-reboot-pendiente",
    "name": "Comprobar reboot pendiente",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-07-forzar-reinicio-controlado",
    "name": "Forzar reinicio controlado",
    "category": "Windows Update",
    "section": "Windows Update",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔄"
  },
  {
    "id": "cau-mega-08-limpieza-temporal-basica",
    "name": "Limpieza temporal básica",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-limpieza-avanzada-de-temporales",
    "name": "Limpieza avanzada de temporales",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-limpiar-temp",
    "name": "Limpiar %temp%",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-limpiar-c-windows-temp",
    "name": "Limpiar C:\\Windows\\Temp",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-limpiar-cache-navegador",
    "name": "Limpiar caché navegador",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-limpiar-cache-teams-office-onedrive",
    "name": "Limpiar caché Teams/Office/OneDrive",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-vaciar-papelera",
    "name": "Vaciar papelera",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ejecutar-liberador-de-espacio",
    "name": "Ejecutar Liberador de espacio",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ejecutar-storage-sense",
    "name": "Ejecutar Storage Sense",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-detectar-archivos-grandes",
    "name": "Detectar archivos grandes",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-detectar-perfiles-pesados",
    "name": "Detectar perfiles pesados",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-detectar-disco-lleno",
    "name": "Detectar disco lleno",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ver-estado-smart-basico",
    "name": "Ver estado SMART básico",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ver-salud-de-disco",
    "name": "Ver salud de disco",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-reparar-disco-con-chkdsk-programado",
    "name": "Reparar disco con CHKDSK programado",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ejecutar-sfc",
    "name": "Ejecutar SFC",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ejecutar-dism-scanhealth",
    "name": "Ejecutar DISM ScanHealth",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ejecutar-dism-restorehealth",
    "name": "Ejecutar DISM RestoreHealth",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-reparacion-windows-sfc-dism-update-reset",
    "name": "Reparación Windows: SFC + DISM + Update Reset",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ver-procesos-que-mas-consumen-cpu",
    "name": "Ver procesos que más consumen CPU",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-ver-procesos-que-mas-consumen-ram",
    "name": "Ver procesos que más consumen RAM",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-matar-proceso-bloqueado",
    "name": "Matar proceso bloqueado",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-reiniciar-explorer",
    "name": "Reiniciar Explorer",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-reiniciar-spooler",
    "name": "Reiniciar spooler",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-08-reiniciar-servicios-criticos",
    "name": "Reiniciar servicios críticos",
    "category": "Rendimiento",
    "section": "Rendimiento y limpieza",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚡"
  },
  {
    "id": "cau-mega-09-reiniciar-cola-de-impresion",
    "name": "Reiniciar cola de impresión",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-limpiar-cola-de-impresion",
    "name": "Limpiar cola de impresión",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-reinstalar-impresora-por-nombre",
    "name": "Reinstalar impresora por nombre",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-instalar-impresora-de-red",
    "name": "Instalar impresora de red",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-eliminar-impresora",
    "name": "Eliminar impresora",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-eliminar-todas-las-impresoras-de-red",
    "name": "Eliminar todas las impresoras de red",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-ver-impresora-predeterminada",
    "name": "Ver impresora predeterminada",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-establecer-impresora-predeterminada",
    "name": "Establecer impresora predeterminada",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-ver-drivers-de-impresora",
    "name": "Ver drivers de impresora",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-eliminar-driver-de-impresora",
    "name": "Eliminar driver de impresora",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-reparar-error-spooler",
    "name": "Reparar error spooler",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1/BAT",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-diagnostico-completo-de-impresion",
    "name": "Diagnóstico completo de impresión",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-instalar-impresoras-por-sede",
    "name": "Instalar impresoras por sede",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-instalar-impresoras-por-departamento",
    "name": "Instalar impresoras por departamento",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-exportar-listado-de-impresoras",
    "name": "Exportar listado de impresoras",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-09-abrir-panel-clasico-de-impresoras",
    "name": "Abrir panel clásico de impresoras",
    "category": "Impresoras",
    "section": "Impresoras",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🖨️"
  },
  {
    "id": "cau-mega-10-limpiar-cache-edge",
    "name": "Limpiar caché Edge",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-limpiar-cache-chrome",
    "name": "Limpiar caché Chrome",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-limpiar-cache-firefox",
    "name": "Limpiar caché Firefox",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-reset-edge",
    "name": "Reset Edge",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-reset-chrome",
    "name": "Reset Chrome",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-reparar-edge-webview2",
    "name": "Reparar Edge WebView2",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-comprobar-version-edge",
    "name": "Comprobar versión Edge",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-comprobar-version-chrome",
    "name": "Comprobar versión Chrome",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-instalar-extension-corporativa",
    "name": "Instalar extensión corporativa",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-quitar-extension-problematica",
    "name": "Quitar extensión problemática",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-restaurar-navegador-predeterminado",
    "name": "Restaurar navegador predeterminado",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-asociar-pdf-a-edge-adobe",
    "name": "Asociar PDF a Edge/Adobe",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-asociar-ica-a-citrix",
    "name": "Asociar .ica a Citrix",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1/BAT",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-reparar-descargas-bloqueadas",
    "name": "Reparar descargas bloqueadas",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-limpiar-cookies-de-sitio-concreto",
    "name": "Limpiar cookies de sitio concreto",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-10-abrir-urls-corporativas-en-portal-html",
    "name": "Abrir URLs corporativas en portal HTML",
    "category": "Navegadores",
    "section": "Navegadores",
    "scriptTypeHint": "HTML/BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🌍"
  },
  {
    "id": "cau-mega-11-diagnostico-onedrive",
    "name": "Diagnóstico OneDrive",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-reiniciar-onedrive",
    "name": "Reiniciar OneDrive",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-reset-onedrive",
    "name": "Reset OneDrive",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-ver-estado-de-sincronizacion",
    "name": "Ver estado de sincronización",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-detectar-conflictos-onedrive",
    "name": "Detectar conflictos OneDrive",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-limpiar-cache-onedrive",
    "name": "Limpiar caché OneDrive",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-reinstalar-onedrive",
    "name": "Reinstalar OneDrive",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-forzar-inicio-onedrive",
    "name": "Forzar inicio OneDrive",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-comprobar-known-folder-move",
    "name": "Comprobar Known Folder Move",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-reparar-escritorio-documentos-no-sincronizan",
    "name": "Reparar Escritorio/Documentos no sincronizan",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-11-exportar-estado-onedrive",
    "name": "Exportar estado OneDrive",
    "category": "OneDrive",
    "section": "OneDrive y sincronización",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "☁️"
  },
  {
    "id": "cau-mega-12-diagnostico-citrix-workspace",
    "name": "Diagnóstico Citrix Workspace",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-limpiar-cache-citrix",
    "name": "Limpiar caché Citrix",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-reparar-asociacion-ica",
    "name": "Reparar asociación .ica",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-reinstalar-citrix-workspace",
    "name": "Reinstalar Citrix Workspace",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-ver-version-citrix",
    "name": "Ver versión Citrix",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-eliminar-restos-citrix",
    "name": "Eliminar restos Citrix",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-diagnostico-vpn",
    "name": "Diagnóstico VPN",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-reiniciar-servicio-vpn",
    "name": "Reiniciar servicio VPN",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-limpiar-credenciales-vpn",
    "name": "Limpiar credenciales VPN",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-test-de-acceso-a-portal-vpn",
    "name": "Test de acceso a portal VPN",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-test-de-puertos-vpn",
    "name": "Test de puertos VPN",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-reparar-cliente-vpn",
    "name": "Reparar cliente VPN",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-abrir-herramientas-de-asistencia-remota",
    "name": "Abrir herramientas de asistencia remota",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "BAT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-ejecutar-quick-assist",
    "name": "Ejecutar Quick Assist",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-12-ejecutar-mstsc",
    "name": "Ejecutar mstsc",
    "category": "Citrix / VPN",
    "section": "Citrix, VPN y acceso remoto",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🔐"
  },
  {
    "id": "cau-mega-13-ver-dominio-del-equipo",
    "name": "Ver dominio del equipo",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-comprobar-relacion-de-confianza-dominio",
    "name": "Comprobar relación de confianza dominio",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-reparar-secure-channel",
    "name": "Reparar secure channel",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-ver-grupos-ad-del-usuario",
    "name": "Ver grupos AD del usuario",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-ver-grupos-locales",
    "name": "Ver grupos locales",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-anadir-usuario-a-grupo-local",
    "name": "Añadir usuario a grupo local",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-quitar-usuario-de-grupo-local",
    "name": "Quitar usuario de grupo local",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-ver-administradores-locales",
    "name": "Ver administradores locales",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-comprobar-ultimo-login",
    "name": "Comprobar último login",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-forzar-gpupdate",
    "name": "Forzar gpupdate",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-exportar-gpresult-html",
    "name": "Exportar GPResult HTML",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-abrir-rsop",
    "name": "Abrir RSOP",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "BAT",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-ver-politicas-aplicadas",
    "name": "Ver políticas aplicadas",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-diagnostico-de-gpo",
    "name": "Diagnóstico de GPO",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-limpiar-cache-de-politicas",
    "name": "Limpiar caché de políticas",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-ver-controlador-de-dominio-usado",
    "name": "Ver controlador de dominio usado",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-test-de-conectividad-con-dc",
    "name": "Test de conectividad con DC",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-sincronizar-hora-con-dominio",
    "name": "Sincronizar hora con dominio",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-13-reparar-error-de-hora-dominio",
    "name": "Reparar error de hora/dominio",
    "category": "AD / Dominio",
    "section": "Active Directory, dominio y usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🏢"
  },
  {
    "id": "cau-mega-14-ver-si-el-equipo-esta-unido-a-entra-id",
    "name": "Ver si el equipo está unido a Entra ID",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-ejecutar-dsregcmd-status-y-exportar",
    "name": "Ejecutar dsregcmd /status y exportar",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-diagnostico-hibrido-ad-entra",
    "name": "Diagnóstico híbrido AD/Entra",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-ver-estado-mdm",
    "name": "Ver estado MDM",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-ver-cuenta-escolar-o-laboral",
    "name": "Ver cuenta escolar o laboral",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-forzar-sincronizacion-intune",
    "name": "Forzar sincronización Intune",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-abrir-pagina-de-sincronizacion-empresa-escuela",
    "name": "Abrir página de sincronización empresa/escuela",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-reiniciar-servicio-intune-management-extension",
    "name": "Reiniciar servicio Intune Management Extension",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-ver-logs-intune-ime",
    "name": "Ver logs Intune IME",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-exportar-logs-intune",
    "name": "Exportar logs Intune",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-diagnostico-autopilot",
    "name": "Diagnóstico Autopilot",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-ver-hash-autopilot",
    "name": "Ver hash Autopilot",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-exportar-hardware-hash",
    "name": "Exportar hardware hash",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-comprobar-esp-autopilot",
    "name": "Comprobar ESP Autopilot",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-ver-apps-win32-instaladas-por-intune",
    "name": "Ver apps Win32 instaladas por Intune",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-ver-politicas-aplicadas-mdm",
    "name": "Ver políticas aplicadas MDM",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-limpiar-cache-company-portal",
    "name": "Limpiar caché Company Portal",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-reparar-company-portal",
    "name": "Reparar Company Portal",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-reinstalar-company-portal",
    "name": "Reinstalar Company Portal",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-diagnostico-cumplimiento-dispositivo",
    "name": "Diagnóstico cumplimiento dispositivo",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-ver-bitlocker-escrow-check-basico",
    "name": "Ver BitLocker escrow/check básico",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-14-diagnostico-completo-intune-para-ticket",
    "name": "Diagnóstico completo Intune para ticket",
    "category": "Intune / Autopilot",
    "section": "Intune, Autopilot y Entra ID",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛰️"
  },
  {
    "id": "cau-mega-15-reinstalar-cliente-sccm",
    "name": "Reinstalar cliente SCCM",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-reparar-cliente-sccm",
    "name": "Reparar cliente SCCM",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-reiniciar-servicio-ccmexec",
    "name": "Reiniciar servicio CCMExec",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-ver-estado-cliente-sccm",
    "name": "Ver estado cliente SCCM",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-forzar-machine-policy-retrieval",
    "name": "Forzar Machine Policy Retrieval",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-forzar-user-policy-retrieval",
    "name": "Forzar User Policy Retrieval",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-forzar-hardware-inventory",
    "name": "Forzar Hardware Inventory",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-forzar-software-inventory",
    "name": "Forzar Software Inventory",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-forzar-application-deployment-evaluation",
    "name": "Forzar Application Deployment Evaluation",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-forzar-updates-deployment-evaluation",
    "name": "Forzar Updates Deployment Evaluation",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-abrir-software-center",
    "name": "Abrir Software Center",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-limpiar-cache-sccm",
    "name": "Limpiar caché SCCM",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-ver-tamano-cache-sccm",
    "name": "Ver tamaño caché SCCM",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-ver-logs-sccm-principales",
    "name": "Ver logs SCCM principales",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1/BAT",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-exportar-logs-sccm",
    "name": "Exportar logs SCCM",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-reasignar-site-code-sccm",
    "name": "Reasignar site code SCCM",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-15-diagnostico-completo-sccm",
    "name": "Diagnóstico completo SCCM",
    "category": "SCCM",
    "section": "SCCM / MECM",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📦"
  },
  {
    "id": "cau-mega-16-instalar-msi-silencioso",
    "name": "Instalar MSI silencioso",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-exe-silencioso",
    "name": "Instalar EXE silencioso",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-desinstalar-msi-por-guid",
    "name": "Desinstalar MSI por GUID",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-desinstalar-programa-por-nombre",
    "name": "Desinstalar programa por nombre",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-listar-programas-instalados",
    "name": "Listar programas instalados",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-buscar-software-vulnerable-antiguo",
    "name": "Buscar software vulnerable/antiguo",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-paquete-corporativo",
    "name": "Instalar paquete corporativo",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-reinstalar-aplicacion-corporativa",
    "name": "Reinstalar aplicación corporativa",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-reparar-instalacion-msi",
    "name": "Reparar instalación MSI",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-limpiar-restos-de-aplicacion",
    "name": "Limpiar restos de aplicación",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-visual-c-redistributables",
    "name": "Instalar Visual C++ Redistributables",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-net-runtime",
    "name": "Instalar .NET Runtime",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-webview2-runtime",
    "name": "Instalar WebView2 Runtime",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-java-corporativo-si-aplica",
    "name": "Instalar Java corporativo si aplica",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-adobe-reader",
    "name": "Instalar Adobe Reader",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-7-zip",
    "name": "Instalar 7-Zip",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-instalar-herramientas-cau",
    "name": "Instalar herramientas CAU",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-16-generador-de-instalador-silencioso",
    "name": "Generador de instalador silencioso",
    "category": "Software",
    "section": "Instalación y desinstalación de software",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "💿"
  },
  {
    "id": "cau-mega-17-ver-servicios-detenidos-criticos",
    "name": "Ver servicios detenidos críticos",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reiniciar-servicio-concreto",
    "name": "Reiniciar servicio concreto",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1/BAT",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-cambiar-tipo-de-inicio-de-servicio",
    "name": "Cambiar tipo de inicio de servicio",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reparar-servicio-windows-update",
    "name": "Reparar servicio Windows Update",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reparar-servicio-spooler",
    "name": "Reparar servicio Spooler",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reparar-servicio-bits",
    "name": "Reparar servicio BITS",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reparar-servicio-wmi",
    "name": "Reparar servicio WMI",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reparar-servicio-winrm",
    "name": "Reparar servicio WinRM",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reparar-servicio-defender",
    "name": "Reparar servicio Defender",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reiniciar-servicios-office-clicktorun",
    "name": "Reiniciar servicios Office/ClickToRun",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reiniciar-servicios-sccm",
    "name": "Reiniciar servicios SCCM",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-reiniciar-servicios-intune",
    "name": "Reiniciar servicios Intune",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-17-exportar-estado-de-servicios",
    "name": "Exportar estado de servicios",
    "category": "Servicios",
    "section": "Servicios de Windows",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⚙️"
  },
  {
    "id": "cau-mega-18-backup-de-clave-de-registro",
    "name": "Backup de clave de registro",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-restaurar-clave-de-registro",
    "name": "Restaurar clave de registro",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-crear-valor-de-registro",
    "name": "Crear valor de registro",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-modificar-valor-de-registro",
    "name": "Modificar valor de registro",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-eliminar-valor-de-registro",
    "name": "Eliminar valor de registro",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-reparar-claves-outlook-add-ins",
    "name": "Reparar claves Outlook Add-ins",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-reparar-asociacion-de-archivos",
    "name": "Reparar asociación de archivos",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-reparar-claves-teams-add-in",
    "name": "Reparar claves Teams Add-in",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-reparar-proxy-por-registro",
    "name": "Reparar proxy por registro",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-reparar-onedrive-policies",
    "name": "Reparar OneDrive policies",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-exportar-claves-relevantes-para-ticket",
    "name": "Exportar claves relevantes para ticket",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-18-comparar-registro-equipo-sano-equipo-roto",
    "name": "Comparar registro equipo sano/equipo roto",
    "category": "Registro",
    "section": "Registro de Windows",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🧬"
  },
  {
    "id": "cau-mega-19-ver-estado-microsoft-defender",
    "name": "Ver estado Microsoft Defender",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-actualizar-firmas-defender",
    "name": "Actualizar firmas Defender",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-lanzar-analisis-rapido-defender",
    "name": "Lanzar análisis rápido Defender",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-lanzar-analisis-completo-defender",
    "name": "Lanzar análisis completo Defender",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-ver-amenazas-detectadas",
    "name": "Ver amenazas detectadas",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-ver-estado-firewall",
    "name": "Ver estado firewall",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-activar-firewall",
    "name": "Activar firewall",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-comprobar-reglas-firewall-concretas",
    "name": "Comprobar reglas firewall concretas",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-exportar-reglas-firewall",
    "name": "Exportar reglas firewall",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-ver-estado-bitlocker",
    "name": "Ver estado BitLocker",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-suspender-bitlocker-temporalmente",
    "name": "Suspender BitLocker temporalmente",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-reanudar-bitlocker",
    "name": "Reanudar BitLocker",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-ver-protectores-bitlocker",
    "name": "Ver protectores BitLocker",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-comprobar-tpm",
    "name": "Comprobar TPM",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-ver-secure-boot",
    "name": "Ver Secure Boot",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-ver-estado-uac",
    "name": "Ver estado UAC",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-detectar-software-no-autorizado",
    "name": "Detectar software no autorizado",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-detectar-usuarios-admins-locales-no-esperados",
    "name": "Detectar usuarios admins locales no esperados",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-revisar-tareas-programadas-sospechosas",
    "name": "Revisar tareas programadas sospechosas",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-revisar-procesos-sospechosos-basicos",
    "name": "Revisar procesos sospechosos básicos",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-19-exportar-informe-de-seguridad-endpoint",
    "name": "Exportar informe de seguridad endpoint",
    "category": "Seguridad",
    "section": "Seguridad, Defender, firewall y BitLocker",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🛡️"
  },
  {
    "id": "cau-mega-20-listar-certificados-usuario",
    "name": "Listar certificados usuario",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-20-listar-certificados-equipo",
    "name": "Listar certificados equipo",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-20-comprobar-certificados-caducados",
    "name": "Comprobar certificados caducados",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-20-instalar-certificado-raiz-corporativo",
    "name": "Instalar certificado raíz corporativo",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-20-eliminar-certificado-concreto",
    "name": "Eliminar certificado concreto",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-20-diagnostico-certificado-vpn",
    "name": "Diagnóstico certificado VPN",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-20-diagnostico-certificado-wifi",
    "name": "Diagnóstico certificado WiFi",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-20-diagnostico-certificado-web-interna",
    "name": "Diagnóstico certificado web interna",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-20-exportar-inventario-certificados",
    "name": "Exportar inventario certificados",
    "category": "Certificados",
    "section": "Certificados",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "📜"
  },
  {
    "id": "cau-mega-21-ver-tamano-del-perfil",
    "name": "Ver tamaño del perfil",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-limpiar-temporales-del-perfil",
    "name": "Limpiar temporales del perfil",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-reparar-perfil-corrupto-leve",
    "name": "Reparar perfil corrupto leve",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-crear-backup-de-perfil",
    "name": "Crear backup de perfil",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-migrar-escritorio-documentos-favoritos",
    "name": "Migrar escritorio/documentos favoritos",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-reiniciar-configuracion-explorer",
    "name": "Reiniciar configuración Explorer",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-restaurar-iconos-escritorio",
    "name": "Restaurar iconos escritorio",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-limpiar-credenciales-usuario",
    "name": "Limpiar credenciales usuario",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-abrir-credential-manager",
    "name": "Abrir Credential Manager",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-borrar-cache-de-credenciales-especificas",
    "name": "Borrar caché de credenciales específicas",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": false,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-resetear-asociaciones-de-archivos-usuario",
    "name": "Resetear asociaciones de archivos usuario",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-detectar-perfiles-huerfanos",
    "name": "Detectar perfiles huérfanos",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-eliminar-perfil-local-antiguo",
    "name": "Eliminar perfil local antiguo",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-reparar-menu-inicio",
    "name": "Reparar menú inicio",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "👤"
  },
  {
    "id": "cau-mega-21-reparar-barra-de-tareas",
    "name": "Reparar barra de tareas",
    "category": "Perfil de usuario",
    "section": "Perfil de usuario",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "👤"
  },
  {
    "id": "cau-mega-22-ver-permisos-de-carpeta",
    "name": "Ver permisos de carpeta",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-exportar-acl",
    "name": "Exportar ACL",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-restaurar-acl",
    "name": "Restaurar ACL",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-tomar-propiedad-de-carpeta",
    "name": "Tomar propiedad de carpeta",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-conceder-permisos-a-grupo",
    "name": "Conceder permisos a grupo",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-quitar-permisos-incorrectos",
    "name": "Quitar permisos incorrectos",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-reparar-permisos-de-perfil",
    "name": "Reparar permisos de perfil",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-reparar-permisos-de-carpeta-temporal",
    "name": "Reparar permisos de carpeta temporal",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-reparar-permisos-de-carpeta-app-corporativa",
    "name": "Reparar permisos de carpeta app corporativa",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-22-comparar-permisos-entre-carpetas",
    "name": "Comparar permisos entre carpetas",
    "category": "Permisos",
    "section": "Permisos, carpetas y ACL",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🔑"
  },
  {
    "id": "cau-mega-23-exportar-eventos-criticos-ultimas-24h",
    "name": "Exportar eventos críticos últimas 24h",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-exportar-eventos-de-aplicacion",
    "name": "Exportar eventos de aplicación",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-exportar-eventos-de-sistema",
    "name": "Exportar eventos de sistema",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-exportar-eventos-office",
    "name": "Exportar eventos Office",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-exportar-eventos-teams",
    "name": "Exportar eventos Teams",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-exportar-eventos-windows-update",
    "name": "Exportar eventos Windows Update",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-exportar-eventos-bitlocker",
    "name": "Exportar eventos BitLocker",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-exportar-eventos-defender",
    "name": "Exportar eventos Defender",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-exportar-eventos-applocker-wdac",
    "name": "Exportar eventos AppLocker/WDAC",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-buscar-errores-por-id-de-evento",
    "name": "Buscar errores por ID de evento",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-generar-zip-de-logs-para-escalado",
    "name": "Generar ZIP de logs para escalado",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-generar-informe-html-de-errores",
    "name": "Generar informe HTML de errores",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-abrir-event-viewer-filtrado",
    "name": "Abrir Event Viewer filtrado",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-monitorizar-proceso-en-tiempo-real",
    "name": "Monitorizar proceso en tiempo real",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-23-monitorizar-servicio-en-tiempo-real",
    "name": "Monitorizar servicio en tiempo real",
    "category": "Logs / Eventos",
    "section": "Logs, eventos y diagnóstico",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "📚"
  },
  {
    "id": "cau-mega-24-apagado-seguro",
    "name": "Apagado seguro",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-reinicio-seguro",
    "name": "Reinicio seguro",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-reinicio-con-aviso",
    "name": "Reinicio con aviso",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-cancelar-apagado",
    "name": "Cancelar apagado",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-programar-reinicio",
    "name": "Programar reinicio",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-ver-ultimo-reinicio",
    "name": "Ver último reinicio",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-ver-causa-del-ultimo-apagado",
    "name": "Ver causa del último apagado",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-cambiar-plan-de-energia",
    "name": "Cambiar plan de energía",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-desactivar-suspension-temporalmente",
    "name": "Desactivar suspensión temporalmente",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "alto",
    "requiresAdmin": true,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-activar-alto-rendimiento",
    "name": "Activar alto rendimiento",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-diagnostico-bateria-portatil",
    "name": "Diagnóstico batería portátil",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-generar-battery-report",
    "name": "Generar battery report",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-24-generar-sleep-study",
    "name": "Generar sleep study",
    "category": "Energia",
    "section": "Energía, apagado y reinicio",
    "scriptTypeHint": "BAT/PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "⏻"
  },
  {
    "id": "cau-mega-25-diagnostico-dispositivos-pnp",
    "name": "Diagnóstico dispositivos PnP",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-ver-dispositivos-con-error",
    "name": "Ver dispositivos con error",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-reiniciar-dispositivo-concreto",
    "name": "Reiniciar dispositivo concreto",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-ver-drivers-instalados",
    "name": "Ver drivers instalados",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-exportar-drivers",
    "name": "Exportar drivers",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-instalar-driver-inf",
    "name": "Instalar driver INF",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-ver-camaras-detectadas",
    "name": "Ver cámaras detectadas",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-ver-microfonos-detectados",
    "name": "Ver micrófonos detectados",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-ver-dispositivos-de-audio",
    "name": "Ver dispositivos de audio",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-reiniciar-servicio-audio",
    "name": "Reiniciar servicio audio",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "BAT/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-reparar-audio-basico",
    "name": "Reparar audio básico",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-diagnostico-webcam-teams",
    "name": "Diagnóstico webcam Teams",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-diagnostico-monitor-externo",
    "name": "Diagnóstico monitor externo",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-resetear-escala-dpi-usuario",
    "name": "Resetear escala/DPI usuario",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-abrir-configuracion-pantalla",
    "name": "Abrir configuración pantalla",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-25-abrir-configuracion-sonido",
    "name": "Abrir configuración sonido",
    "category": "Dispositivos",
    "section": "Pantalla, audio, periféricos y drivers",
    "scriptTypeHint": "BAT",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": true,
    "icon": "🖱️"
  },
  {
    "id": "cau-mega-26-generar-plantilla-de-ticket",
    "name": "Generar plantilla de ticket",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "PS1/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-informe-para-escalado-n2",
    "name": "Generar informe para escalado N2",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-informe-para-escalado-n3",
    "name": "Generar informe para escalado N3",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-copiar-diagnostico-al-portapapeles",
    "name": "Copiar diagnóstico al portapapeles",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-crear-resumen-de-incidencia",
    "name": "Crear resumen de incidencia",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-crear-checklist-segun-tipo-de-problema",
    "name": "Crear checklist según tipo de problema",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "HTML/PS1",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-plantilla-de-cierre",
    "name": "Generar plantilla de cierre",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "HTML/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-plantilla-de-comunicacion-al-usuario",
    "name": "Generar plantilla de comunicación al usuario",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-checklist-outlook-no-abre",
    "name": "Generar checklist “Outlook no abre”",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "HTML/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-checklist-sin-red",
    "name": "Generar checklist “sin red”",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "HTML/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-checklist-no-imprime",
    "name": "Generar checklist “no imprime”",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "HTML/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-checklist-teams-no-funciona",
    "name": "Generar checklist “Teams no funciona”",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "HTML/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-checklist-equipo-lento",
    "name": "Generar checklist “equipo lento”",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "HTML/PS1",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-26-generar-zip-de-evidencias",
    "name": "Generar ZIP de evidencias",
    "category": "Tickets CAU",
    "section": "Automatización de tickets CAU",
    "scriptTypeHint": "PS1",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "🎫"
  },
  {
    "id": "cau-mega-27-usuario-no-contesta",
    "name": "Usuario no contesta",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-solicitud-de-reinicio",
    "name": "Solicitud de reinicio",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-solicitud-de-captura-de-pantalla",
    "name": "Solicitud de captura de pantalla",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-solicitud-de-conexion-remota",
    "name": "Solicitud de conexión remota",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-ticket-resuelto",
    "name": "Ticket resuelto",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-ticket-escalado",
    "name": "Ticket escalado",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-falta-informacion",
    "name": "Falta información",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-incidencia-masiva",
    "name": "Incidencia masiva",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-mantenimiento-programado",
    "name": "Mantenimiento programado",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-instrucciones-para-mapear-unidad",
    "name": "Instrucciones para mapear unidad",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-instrucciones-para-resetear-contrasena",
    "name": "Instrucciones para resetear contraseña",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-instrucciones-para-limpiar-cache-navegador",
    "name": "Instrucciones para limpiar caché navegador",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-instrucciones-para-usar-citrix",
    "name": "Instrucciones para usar Citrix",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-27-instrucciones-para-configurar-mfa",
    "name": "Instrucciones para configurar MFA",
    "category": "Comunicaciones",
    "section": "Plantillas de comunicación al usuario",
    "scriptTypeHint": "TXT/HTML",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": false,
    "icon": "✉️"
  },
  {
    "id": "cau-mega-29-reparar-red-basica",
    "name": "Reparar red básica",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Flush DNS, renovar IP, reset adaptador, test gateway",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-outlook-basico",
    "name": "Reparar Outlook básico",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Cerrar Outlook, modo seguro, reset navpane, limpiar caché",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-teams-basico",
    "name": "Reparar Teams básico",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Cerrar Teams, limpiar caché, reabrir",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-impresora-basica",
    "name": "Reparar impresora básica",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Reiniciar spooler, limpiar cola",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-equipo-lento-basico",
    "name": "Equipo lento básico",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Temp, papelera, procesos, disco",
    "level": "N1/N2",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-navegador",
    "name": "Reparar navegador",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Caché, cookies, proxy, WebView2",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-onedrive-basico",
    "name": "Reparar OneDrive básico",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Reinicio, reset, comprobación",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-mapear-unidades-estandar",
    "name": "Mapear unidades estándar",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Reconectar unidades frecuentes",
    "level": "N1/N2",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-diagnostico-rapido-cau",
    "name": "Diagnóstico rápido CAU",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Inventario + red + disco + usuario",
    "level": "N1/N2",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-generar-informe-de-ticket",
    "name": "Generar informe de ticket",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Todo lo básico exportado",
    "level": "N1/N2",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-windows-avanzado",
    "name": "Reparar Windows avanzado",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "SFC, DISM, Update Reset, servicios",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-office-avanzado",
    "name": "Reparar Office avanzado",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Reparación Office, licencias, cachés, perfil Outlook",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-teams-outlook-add-in",
    "name": "Reparar Teams Outlook Add-in",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "DLL, registro, LoadBehavior, rutas, WebView2",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-sccm",
    "name": "Reparar SCCM",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Cliente, caché, acciones, logs",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-intune",
    "name": "Reparar Intune",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Sync, IME, logs, Company Portal",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-diagnostico-autopilot",
    "name": "Diagnóstico Autopilot",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "dsregcmd, MDM, ESP, políticas",
    "level": "N1/N2",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-perfil-usuario",
    "name": "Reparar perfil usuario",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Cachés, permisos, shell, credenciales",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-dominio",
    "name": "Reparar dominio",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Secure channel, gpupdate, hora, DC",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-reparar-impresion-avanzada",
    "name": "Reparar impresión avanzada",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Drivers, puertos, spooler, permisos",
    "level": "N1/N2",
    "risk": "medio",
    "requiresAdmin": true,
    "icon": "🚑"
  },
  {
    "id": "cau-mega-29-paquete-de-evidencias-n3",
    "name": "Paquete de evidencias N3",
    "category": "Todo en uno",
    "section": "Scripts “todo en uno” recomendados",
    "scriptTypeHint": "Logs, eventos, inventario, HTML final",
    "level": "N1/N2",
    "risk": "bajo",
    "requiresAdmin": false,
    "icon": "🚑"
  }
];

  function esc(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function isReadOnly(name) {
    const n = String(name || '').toLowerCase();
    return /^(ver|listar|comprobar|detectar|diagn[oó]stico|exportar|generar informe|inventario|mostrar|abrir)/.test(n)
      || n.includes('diagnóstico') || n.includes('diagnostico') || n.includes('estado') || n.includes('informe');
  }

  function defaultTarget(entry) {
    const c = entry.category;
    const n = entry.name.toLowerCase();
    if (c === 'Red') return n.includes('puerto') ? 'servidor:443' : 'servidor.corporativo.local';
    if (c === 'Unidades de red') return '\\\\servidor\\recurso';
    if (c === 'Impresoras') return 'IMPRESORA_CORPORATIVA';
    if (c === 'Servicios') return 'Spooler';
    if (c === 'Software') return 'Nombre del programa';
    if (c === 'Registro') return 'HKCU:\\Software\\Vendor\\Clave';
    if (c === 'Permisos') return 'C:\\Ruta\\Carpeta';
    if (c === 'Certificados') return 'CN=Certificado';
    if (c === 'Citrix / VPN') return 'https://portal-vpn.local';
    if (c === 'AD / Dominio') return '$env:USERDOMAIN';
    if (c === 'Tickets CAU') return 'Incidencia del usuario';
    if (c === 'Comunicaciones') return 'Nombre del usuario';
    return '';
  }

  function riskNotes(entry) {
    const notes = [];
    notes.push('Plantilla generativa CAU: revisa y adapta variables corporativas antes de ejecutar.');
    if (entry.risk === 'alto') notes.push('Riesgo alto: puede modificar servicios, registro, software, permisos, clientes corporativos o configuraciones persistentes.');
    if (entry.risk === 'medio') notes.push('Riesgo medio: puede reiniciar servicios, limpiar caches o cambiar configuracion del usuario/equipo.');
    if (entry.requiresAdmin) notes.push('Requiere consola elevada para funcionar correctamente.');
    notes.push('No incluye datos internos hardcodeados; usa campos configurables por el tecnico.');
    return notes;
  }

  function fieldsFor(entry) {
    const base = [
      { key: 'targetValue', label: 'Valor objetivo opcional (servidor, ruta, servicio, programa, impresora, usuario, URL...)', type: 'text', default: defaultTarget(entry) },
      { key: 'outputFolder', label: 'Carpeta local de salida para informes/evidencias', type: 'text', default: '.\\CAU_Reports' }
    ];
    if (!isReadOnly(entry.name) || entry.risk !== 'bajo') {
      base.push({ key: 'executeChanges', label: 'Ejecutar cambios reales. Si no, genera diagnostico/guia segura.', type: 'checkbox', default: false });
    }
    return base;
  }

  function checklistPre(entry) {
    const list = ['Revisar el script generado antes de ejecutarlo.', 'Confirmar autorizacion sobre el equipo y el usuario afectados.'];
    if (entry.requiresAdmin) list.push('Abrir consola como Administrador.');
    if (entry.category === 'Unidades de red') list.push('Validar ruta UNC, letra de unidad y permisos del usuario.');
    if (entry.category === 'Office / Outlook' || entry.category === 'Teams') list.push('Cerrar Outlook/Teams antes de acciones de reparacion o limpieza.');
    if (entry.category === 'Windows Update') list.push('Comprobar que no hay instalacion de actualizaciones en curso.');
    if (entry.category === 'Registro') list.push('Exportar copia de seguridad de la clave antes de modificarla.');
    if (entry.category === 'Permisos') list.push('Exportar ACL actual antes de aplicar cambios.');
    if (entry.category === 'Software') list.push('Confirmar GUID, ruta MSI/EXE o nombre exacto del programa.');
    return list;
  }

  function checklistPost(entry) {
    const list = ['Revisar salida en pantalla y log generado.', 'Adjuntar evidencias al ticket si procede.'];
    if (entry.category === 'Red') list.push('Probar conectividad, DNS y acceso a recursos internos.');
    if (entry.category === 'Unidades de red') list.push('Comprobar acceso desde Explorador y con net use.');
    if (entry.category === 'Office / Outlook') list.push('Abrir Outlook/Office y validar comportamiento con el usuario.');
    if (entry.category === 'Teams') list.push('Abrir Teams y verificar inicio de sesion, reuniones y add-in si aplica.');
    if (entry.category === 'Impresoras') list.push('Imprimir pagina de prueba si procede.');
    if (entry.category === 'Intune / Autopilot') list.push('Verificar estado en Company Portal/Intune si se tiene acceso.');
    return list;
  }

  function rollbackText(entry) {
    if (entry.risk === 'bajo') return 'No suele requerir rollback: es diagnostico o lectura de informacion.';
    if (entry.category === 'Unidades de red') return 'Deshacer con net use LETRA: /delete /y o remapear la unidad anterior.';
    if (entry.category === 'Registro') return 'Restaurar el .reg exportado antes del cambio.';
    if (entry.category === 'Permisos') return 'Restaurar ACL desde el backup generado con icacls /restore.';
    if (entry.category === 'Servicios') return 'Volver a establecer el tipo de inicio o estado anterior del servicio.';
    if (entry.category === 'Software') return 'Reinstalar la aplicacion o revertir con el instalador corporativo si procede.';
    return 'Rollback dependiente del entorno. Antes de ejecutar, crea evidencia/backup y documenta el estado inicial.';
  }

  function batHeader(entry, v) {
    const target = String(v.targetValue || defaultTarget(entry) || '');
    const out = String(v.outputFolder || '.\\CAU_Reports');
    return `set "TARGET=${target}"
set "OUTDIR=${out}"
if not exist "%OUTDIR%" mkdir "%OUTDIR%" >nul 2>&1
echo Categoria: ${entry.category}
echo Nivel CAU: ${entry.level}
echo Objetivo: %TARGET%
echo Salida: %OUTDIR%
echo.`;
  }

  function ps1Header(entry, v) {
    const target = esc(v.targetValue || defaultTarget(entry) || '');
    const out = esc(v.outputFolder || '.\\CAU_Reports');
    const exec = v.executeChanges ? 'true' : 'false';
    return `$TargetValue = "${target}"
$OutputFolder = "${out}"
$ExecuteChanges = $${exec}
if (-not (Test-Path $OutputFolder)) { New-Item -Path $OutputFolder -ItemType Directory -Force | Out-Null }
Write-Log "Categoria: ${entry.category} | Nivel CAU: ${entry.level} | Objetivo: $TargetValue"
if (-not $ExecuteChanges -and '${entry.risk}' -ne 'bajo') { Write-Log "Modo seguro: no se aplicaran cambios reales salvo que actives Ejecutar cambios reales." }`;
  }

  function batBody(entry, v) {
    const n = entry.name.toLowerCase();
    const c = entry.category;
    let b = batHeader(entry, v) + '\n';

    if (c === 'Inventario' || n.includes('inventario') || n.startsWith('ver ') || n.startsWith('exportar hostname')) {
      b += `hostname
whoami
ver
wmic computersystem get manufacturer,model,totalphysicalmemory
wmic bios get serialnumber,smbiosbiosversion
wmic os get caption,version,buildnumber,lastbootuptime
ipconfig /all
net use
wmic product get name,version > "%OUTDIR%\\software_instalado.txt" 2>nul
echo Informe guardado parcialmente en %OUTDIR%`;
    } else if (c === 'Red') {
      b += `ipconfig /all
route print
arp -a
ping -n 2 %TARGET%
nslookup %TARGET%
${n.includes('flush') || n.includes('dns') ? 'ipconfig /flushdns' : 'echo DNS: solo diagnostico salvo plantilla especifica.'}
${n.includes('winsock') ? (v.executeChanges ? 'netsh winsock reset' : 'echo [MODO SEGURO] netsh winsock reset') : ''}
${n.includes('tcp') ? (v.executeChanges ? 'netsh int ip reset' : 'echo [MODO SEGURO] netsh int ip reset') : ''}`;
    } else if (c === 'Unidades de red') {
      b += `echo Estado actual de unidades:
net use
echo Probando recurso UNC: %TARGET%
dir "%TARGET%" >nul 2>&1
if %errorlevel% neq 0 echo [AVISO] No hay acceso o la ruta no existe.
${n.includes('mapear') ? (v.executeChanges ? 'net use Z: "%TARGET%" /persistent:no' : 'echo [MODO SEGURO] net use Z: "%TARGET%" /persistent:no') : ''}
${n.includes('desconectar') ? (v.executeChanges ? 'net use Z: /delete /y' : 'echo [MODO SEGURO] net use Z: /delete /y') : ''}
${n.includes('credencial') ? (v.executeChanges ? 'cmdkey /list' : 'echo [MODO SEGURO] revisar cmdkey /list y eliminar solo entradas concretas') : ''}`;
    } else if (c === 'Office / Outlook') {
      b += `echo Diagnostico Office/Outlook
where outlook.exe
reg query "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins" /s > "%OUTDIR%\\outlook_addins.txt" 2>nul
echo Comandos utiles:
echo outlook.exe /safe
echo outlook.exe /resetnavpane
echo outlook.exe /profiles
${v.executeChanges ? 'taskkill /f /im outlook.exe >nul 2>&1' : 'echo [MODO SEGURO] no se cierran procesos ni se limpian caches.'}`;
    } else if (c === 'Teams') {
      b += `echo Diagnostico Teams
where teams.exe
reg query "HKCU\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect" /s
${v.executeChanges ? 'taskkill /f /im ms-teams.exe >nul 2>&1\ntaskkill /f /im Teams.exe >nul 2>&1' : 'echo [MODO SEGURO] no se cierra Teams ni se borra cache.'}`;
    } else if (c === 'Windows Update') {
      b += `sc query wuauserv
sc query bits
sc query cryptsvc
${v.executeChanges ? 'net stop wuauserv\nnet stop bits\nnet start bits\nnet start wuauserv' : 'echo [MODO SEGURO] no se reinician servicios ni se limpia SoftwareDistribution.'}`;
    } else if (c === 'Impresoras') {
      b += `wmic printer get name,default,portname
sc query Spooler
${v.executeChanges ? 'net stop spooler\nnet start spooler' : 'echo [MODO SEGURO] no se reinicia spooler ni se limpia cola.'}`;
    } else if (c === 'Energia') {
      b += `powercfg /list
powercfg /batteryreport /output "%OUTDIR%\\battery-report.html"
${n.includes('reinicio') && v.executeChanges ? 'shutdown /r /t 60 /c "Reinicio programado por soporte"' : ''}
${n.includes('apagado') && v.executeChanges ? 'shutdown /s /t 60 /c "Apagado programado por soporte"' : ''}
${n.includes('cancelar') ? 'shutdown /a' : ''}`;
    } else if (c === 'Navegadores') {
      b += `reg query "HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations" /s > "%OUTDIR%\\url_associations.txt" 2>nul
echo Revisar caches de Edge/Chrome/Firefox por usuario.
${v.executeChanges ? 'echo Ejecutar limpieza especifica solo tras validar perfiles de usuario.' : 'echo [MODO SEGURO] no se elimina cache del navegador.'}`;
    } else {
      b += `echo Plantilla CAU generativa: ${entry.name}
echo Esta plantilla crea una base segura para adaptar al entorno.
echo 1. Revisar objetivo: %TARGET%
echo 2. Ejecutar diagnostico previo.
echo 3. Aplicar cambios solo si estan autorizados.
echo.
echo Informacion basica:
hostname
whoami
ver
ipconfig | findstr /i "IPv4 Gateway DNS"
${v.executeChanges ? 'echo [CAMBIOS ACTIVADOS] Anade aqui el comando corporativo validado.' : 'echo [MODO SEGURO] no se ejecutan cambios reales.'}`;
    }
    return b;
  }

  function ps1Body(entry, v) {
    const n = entry.name.toLowerCase();
    const c = entry.category;
    let b = ps1Header(entry, v) + '\n\n';
    const safeChange = (real, sim) => `if ($ExecuteChanges -and -not $DryRun) {\n${real}\n} else {\n    Write-Log "[MODO SEGURO] ${sim}"\n}`;

    if (c === 'Inventario' || n.includes('inventario') || n.startsWith('ver ') || n.startsWith('exportar hostname')) {
      b += `Write-Log "Recopilando inventario del equipo..."
Get-ComputerInfo | Select-Object CsName, OsName, OsVersion, OsBuildNumber, CsManufacturer, CsModel, CsDomain | Format-List | Out-String | Write-Log
Get-CimInstance Win32_BIOS | Select-Object SerialNumber, SMBIOSBIOSVersion | Format-List | Out-String | Write-Log
Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, DriveType, Size, FreeSpace | Format-Table -AutoSize | Out-String | Write-Log
Get-NetIPConfiguration | Format-Table -AutoSize | Out-String | Write-Log
Get-Printer -ErrorAction SilentlyContinue | Select-Object Name, DriverName, PortName | Format-Table -AutoSize | Out-String | Write-Log
Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Select-Object DisplayName, DisplayVersion, Publisher | Sort-Object DisplayName | Export-Csv (Join-Path $OutputFolder 'software_instalado.csv') -NoTypeInformation -Encoding UTF8`;
    } else if (c === 'Red') {
      b += `Write-Log "Diagnostico de red..."
Get-NetIPConfiguration | Format-Table -AutoSize | Out-String | Write-Log
Get-NetAdapter | Format-Table -AutoSize | Out-String | Write-Log
Get-DnsClientServerAddress | Format-Table -AutoSize | Out-String | Write-Log
Test-Connection -ComputerName $TargetValue -Count 2 -ErrorAction SilentlyContinue | Out-String | Write-Log
try { Resolve-DnsName $TargetValue -ErrorAction Stop | Out-String | Write-Log } catch { Write-Log "DNS: $($_.Exception.Message)" }
${n.includes('puerto') ? 'Test-NetConnection -ComputerName ($TargetValue -split ":")[0] -Port ([int](($TargetValue -split ":")[1])) | Out-String | Write-Log' : ''}
${n.includes('flush') || n.includes('dns') ? safeChange('    Clear-DnsClientCache\n    Write-Log "Cache DNS limpiada."','Clear-DnsClientCache') : ''}
${n.includes('winsock') ? safeChange('    netsh winsock reset | Out-String | Write-Log','netsh winsock reset') : ''}
${n.includes('tcp') ? safeChange('    netsh int ip reset | Out-String | Write-Log','netsh int ip reset') : ''}`;
    } else if (c === 'Unidades de red') {
      b += `Write-Log "Unidades de red actuales:"
Get-PSDrive -PSProvider FileSystem | Where-Object { $_.DisplayRoot } | Format-Table -AutoSize | Out-String | Write-Log
Write-Log "Probando ruta: $TargetValue"
if (Test-Path $TargetValue) { Write-Log "Acceso UNC OK" } else { Write-Log "Sin acceso o ruta no encontrada" }
${n.includes('mapear') ? safeChange('    New-PSDrive -Name Z -PSProvider FileSystem -Root $TargetValue -Persist | Out-Null\n    Write-Log "Unidad Z: mapeada."','New-PSDrive Z: -> $TargetValue') : ''}
${n.includes('desconectar') ? safeChange('    Remove-PSDrive -Name Z -Force -ErrorAction SilentlyContinue\n    net use Z: /delete /y | Out-String | Write-Log','Eliminar unidad Z:') : ''}
${n.includes('credencial') ? 'cmdkey /list | Out-String | Write-Log' : ''}`;
    } else if (c === 'Office / Outlook') {
      b += `Write-Log "Diagnostico Office/Outlook..."
Get-Process outlook -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, StartTime | Format-Table -AutoSize | Out-String | Write-Log
Get-ChildItem 'HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins' -ErrorAction SilentlyContinue | ForEach-Object { Get-ItemProperty $_.PSPath } | Format-List | Out-String | Write-Log
Write-Log "Comandos utiles: outlook.exe /safe, /resetnavpane, /profiles, /cleanviews"
${n.includes('perfil') ? 'Write-Log "Para perfiles: abrir control mlcfg32.cpl o Outlook /profiles segun version."' : ''}
${n.includes('licencia') ? 'cscript.exe "$env:ProgramFiles\\Microsoft Office\\Office16\\OSPP.VBS" /dstatus 2>$null | Out-String | Write-Log' : ''}
${v.executeChanges ? 'Get-Process outlook -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue' : 'Write-Log "[MODO SEGURO] no se cierran procesos ni se limpian caches."'}`;
    } else if (c === 'Teams') {
      b += `Write-Log "Diagnostico Teams..."
Get-Process *teams* -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, Path | Format-Table -AutoSize | Out-String | Write-Log
Get-ChildItem "$env:LOCALAPPDATA\\Microsoft\\TeamsMeetingAdd-in" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName, Length | Format-Table -AutoSize | Out-String | Write-Log
Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Office\\Outlook\\Addins\\TeamsAddin.FastConnect' -ErrorAction SilentlyContinue | Format-List | Out-String | Write-Log
${v.executeChanges ? 'Get-Process *teams* -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue' : 'Write-Log "[MODO SEGURO] no se cierra Teams ni se borra cache."'}`;
    } else if (c === 'Windows Update') {
      b += `Write-Log "Estado Windows Update/BITS/CryptSvc..."
Get-Service wuauserv,bits,cryptsvc -ErrorAction SilentlyContinue | Format-Table -AutoSize | Out-String | Write-Log
Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 20 | Format-Table -AutoSize | Out-String | Write-Log
${safeChange('    Restart-Service bits,wuauserv -Force -ErrorAction SilentlyContinue\n    Write-Log "Servicios Windows Update reiniciados."','Restart-Service bits,wuauserv')}`;
    } else if (c === 'Rendimiento') {
      b += `Write-Log "Diagnostico de rendimiento..."
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 ProcessName,CPU,Id | Format-Table -AutoSize | Out-String | Write-Log
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 10 ProcessName,@{n='MB';e={[math]::Round($_.WorkingSet/1MB,1)}} | Format-Table -AutoSize | Out-String | Write-Log
Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, FreeSpace, Size | Format-Table -AutoSize | Out-String | Write-Log
${n.includes('sfc') ? safeChange('    sfc /scannow | Out-String | Write-Log','sfc /scannow') : ''}
${n.includes('dism') ? safeChange('    DISM /Online /Cleanup-Image /RestoreHealth | Out-String | Write-Log','DISM RestoreHealth') : ''}`;
    } else if (c === 'Impresoras') {
      b += `Write-Log "Diagnostico de impresion..."
Get-Printer -ErrorAction SilentlyContinue | Format-Table -AutoSize | Out-String | Write-Log
Get-Service Spooler | Format-List | Out-String | Write-Log
${safeChange('    Restart-Service Spooler -Force\n    Write-Log "Spooler reiniciado."','Restart-Service Spooler')}`;
    } else if (c === 'Navegadores') {
      b += `Write-Log "Diagnostico navegadores/asociaciones..."
Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice' -ErrorAction SilentlyContinue | Format-List | Out-String | Write-Log
Get-ChildItem "$env:LOCALAPPDATA\\Microsoft\\Edge\\User Data" -ErrorAction SilentlyContinue | Select-Object Name, LastWriteTime | Out-String | Write-Log
Write-Log "Modo seguro: no se borran caches hasta validar perfil y navegador cerrado."`;
    } else if (c === 'OneDrive') {
      b += `Write-Log "Diagnostico OneDrive..."
Get-Process OneDrive -ErrorAction SilentlyContinue | Select-Object Id, Path | Format-Table -AutoSize | Out-String | Write-Log
Get-ChildItem "$env:LOCALAPPDATA\\Microsoft\\OneDrive\\logs" -ErrorAction SilentlyContinue | Select-Object -First 20 FullName, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Log
${n.includes('reset') ? safeChange('    Start-Process "$env:LOCALAPPDATA\\Microsoft\\OneDrive\\OneDrive.exe" -ArgumentList "/reset"\n    Write-Log "Reset OneDrive lanzado."','OneDrive.exe /reset') : ''}`;
    } else if (c === 'Citrix / VPN') {
      b += `Write-Log "Diagnostico Citrix/VPN..."
Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -match 'Citrix|VPN' } | Select-Object DisplayName, DisplayVersion | Format-Table -AutoSize | Out-String | Write-Log
Test-NetConnection -ComputerName ($TargetValue -replace '^https?://','') -Port 443 | Out-String | Write-Log
Write-Log "Para .ica: validar asociacion de archivo con Citrix Workspace."`;
    } else if (c === 'AD / Dominio') {
      b += `Write-Log "Diagnostico dominio/GPO..."
whoami /groups | Out-String | Write-Log
gpresult /r | Out-String | Write-Log
nltest /dsgetdc:$env:USERDOMAIN 2>$null | Out-String | Write-Log
${n.includes('gpupdate') ? safeChange('    gpupdate /force | Out-String | Write-Log','gpupdate /force') : ''}`;
    } else if (c === 'Intune / Autopilot') {
      b += `Write-Log "Diagnostico Intune/Autopilot/Entra..."
dsregcmd /status | Out-String | Write-Log
Get-Service IntuneManagementExtension -ErrorAction SilentlyContinue | Format-List | Out-String | Write-Log
Get-ChildItem 'C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs' -ErrorAction SilentlyContinue | Select-Object -First 30 FullName, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Log
${n.includes('sync') || n.includes('sincron') ? safeChange('    Get-ScheduledTask | Where-Object {$_.TaskName -match "PushLaunch|Schedule" -and $_.TaskPath -match "EnterpriseMgmt"} | Start-ScheduledTask','Start-ScheduledTask EnterpriseMgmt sync') : ''}`;
    } else if (c === 'SCCM') {
      b += `Write-Log "Diagnostico SCCM/MECM..."
Get-Service CcmExec -ErrorAction SilentlyContinue | Format-List | Out-String | Write-Log
Get-ChildItem 'C:\\Windows\\CCM\\Logs' -ErrorAction SilentlyContinue | Select-Object -First 30 FullName, LastWriteTime | Format-Table -AutoSize | Out-String | Write-Log
${n.includes('policy') ? safeChange('    Invoke-WmiMethod -Namespace root\\ccm -Class SMS_Client -Name TriggerSchedule "{00000000-0000-0000-0000-000000000021}" | Out-Null','TriggerSchedule Machine Policy Retrieval') : ''}`;
    } else if (c === 'Software') {
      b += `Write-Log "Inventario/busqueda de software..."
Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*, HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like "*$TargetValue*" } | Select-Object DisplayName, DisplayVersion, Publisher, UninstallString | Format-List | Out-String | Write-Log
Write-Log "Para instalar/desinstalar, valida MSI/EXE/GUID y usa instaladores corporativos."`;
    } else if (c === 'Servicios') {
      b += `Write-Log "Estado de servicios..."
Get-Service | Where-Object { $_.Name -like "*$TargetValue*" -or $_.DisplayName -like "*$TargetValue*" } | Format-Table -AutoSize | Out-String | Write-Log
${n.includes('reiniciar') || n.includes('reparar') ? safeChange('    Restart-Service -Name $TargetValue -Force -ErrorAction Stop\n    Write-Log "Servicio reiniciado: $TargetValue"','Restart-Service $TargetValue') : ''}`;
    } else if (c === 'Registro') {
      b += `Write-Log "Trabajo con registro: $TargetValue"
Write-Log "Exporta siempre una copia antes de modificar."
${safeChange('    Write-Log "Añade aqui Set-ItemProperty/New-ItemProperty validado para tu clave."','Modificar registro solo tras backup')}`;
    } else if (c === 'Seguridad') {
      b += `Write-Log "Diagnostico seguridad endpoint..."
Get-MpComputerStatus -ErrorAction SilentlyContinue | Format-List | Out-String | Write-Log
Get-NetFirewallProfile | Format-Table -AutoSize | Out-String | Write-Log
Get-BitLockerVolume -ErrorAction SilentlyContinue | Format-Table -AutoSize | Out-String | Write-Log
${n.includes('defender') && n.includes('análisis') ? safeChange('    Start-MpScan -ScanType QuickScan\n    Write-Log "Analisis rapido Defender iniciado."','Start-MpScan QuickScan') : ''}`;
    } else if (c === 'Certificados') {
      b += `Write-Log "Inventario de certificados..."
Get-ChildItem Cert:\\CurrentUser\\My, Cert:\\LocalMachine\\My -ErrorAction SilentlyContinue | Select-Object Subject, NotAfter, Thumbprint | Sort-Object NotAfter | Format-Table -AutoSize | Out-String | Write-Log
Write-Log "Para instalar/eliminar certificados, valida thumbprint y store antes de ejecutar."`;
    } else if (c === 'Perfil de usuario') {
      b += `Write-Log "Diagnostico perfil de usuario..."
$profilePath = $env:USERPROFILE
Write-Log "Perfil: $profilePath"
Get-ChildItem $profilePath -Force -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 20 FullName, Length | Format-Table -AutoSize | Out-String | Write-Log
cmdkey /list | Out-String | Write-Log`;
    } else if (c === 'Permisos') {
      b += `Write-Log "Permisos sobre: $TargetValue"
Get-Acl $TargetValue -ErrorAction SilentlyContinue | Format-List | Out-String | Write-Log
${safeChange('    icacls $TargetValue | Out-String | Write-Log\n    Write-Log "Añade aqui el cambio ACL corporativo validado."','Exportar/Modificar ACL tras backup')}`;
    } else if (c === 'Logs / Eventos') {
      b += `Write-Log "Exportando eventos recientes..."
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2,3; StartTime=(Get-Date).AddDays(-1)} -ErrorAction SilentlyContinue | Select-Object TimeCreated, Id, ProviderName, Message -First 100 | Export-Csv (Join-Path $OutputFolder 'eventos_system_24h.csv') -NoTypeInformation -Encoding UTF8
Get-WinEvent -FilterHashtable @{LogName='Application'; Level=1,2,3; StartTime=(Get-Date).AddDays(-1)} -ErrorAction SilentlyContinue | Select-Object TimeCreated, Id, ProviderName, Message -First 100 | Export-Csv (Join-Path $OutputFolder 'eventos_app_24h.csv') -NoTypeInformation -Encoding UTF8
Write-Log "Eventos exportados en $OutputFolder"`;
    } else if (c === 'Energia') {
      b += `Write-Log "Diagnostico energia/reinicio..."
powercfg /list | Out-String | Write-Log
powercfg /batteryreport /output (Join-Path $OutputFolder 'battery-report.html') | Out-String | Write-Log
${n.includes('reinicio') ? safeChange('    shutdown /r /t 60 /c "Reinicio programado por soporte"','shutdown /r /t 60') : ''}
${n.includes('apagado') ? safeChange('    shutdown /s /t 60 /c "Apagado programado por soporte"','shutdown /s /t 60') : ''}
${n.includes('cancelar') ? 'shutdown /a | Out-String | Write-Log' : ''}`;
    } else if (c === 'Dispositivos') {
      b += `Write-Log "Diagnostico dispositivos/drivers..."
Get-PnpDevice | Where-Object Status -ne 'OK' | Format-Table -AutoSize | Out-String | Write-Log
pnputil /enum-drivers | Out-String | Write-Log
Get-CimInstance Win32_SoundDevice | Format-Table -AutoSize | Out-String | Write-Log`;
    } else if (c === 'Tickets CAU' || c === 'Comunicaciones') {
      b += `$file = Join-Path $OutputFolder ('${entry.name.replace(/'/g, "")}'.Replace(' ','_') + '.txt')
$ticketText = @"
${entry.name}

Usuario/equipo: $TargetValue
Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm')

Resumen:
- Incidencia revisada por soporte.
- Acciones realizadas/documentadas.
- Pendiente de validacion con usuario si aplica.

Checklist:
[ ] Diagnostico previo realizado
[ ] Evidencias adjuntas
[ ] Usuario informado
[ ] Cierre o escalado documentado
"@
Set-Content -Path $file -Value $ticketText -Encoding UTF8
Write-Log "Plantilla generada: $file"`;
    } else if (c === 'Todo en uno') {
      b += `Write-Log "Pack todo en uno: ${entry.name}"
Get-ComputerInfo | Select-Object CsName, OsName, OsVersion, OsBuildNumber | Format-List | Out-String | Write-Log
Get-NetIPConfiguration | Out-String | Write-Log
Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, FreeSpace, Size | Format-Table -AutoSize | Out-String | Write-Log
Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddHours(-12)} -ErrorAction SilentlyContinue | Select-Object -First 30 TimeCreated,Id,ProviderName,Message | Out-String | Write-Log
Write-Log "Modo todo en uno seguro: activa cambios reales solo tras revisar el bloque especifico."`;
    } else {
      b += `Write-Log "Plantilla CAU generativa: ${entry.name}"
Write-Log "Objetivo: $TargetValue"
Write-Log "1) Diagnostico previo"
Get-ComputerInfo | Select-Object CsName, OsName, OsVersion, OsBuildNumber | Format-List | Out-String | Write-Log
Get-NetIPConfiguration | Format-Table -AutoSize | Out-String | Write-Log
if ($ExecuteChanges -and -not $DryRun) { Write-Log "Añade aqui el comando corporativo validado para esta plantilla." } else { Write-Log "Modo seguro: sin cambios reales." }`;
    }
    return b;
  }

  function makeTemplate(entry) {
    return {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      icon: entry.icon,
      risk: entry.risk,
      requiresAdmin: entry.requiresAdmin,
      description: `${entry.section}. Tipo recomendado: ${entry.scriptTypeHint || 'PS1/BAT'}. Nivel: ${entry.level}. Plantilla CAU generativa para ${entry.name.toLowerCase()}.`,
      fields: fieldsFor(entry),
      riskNotes: riskNotes(entry),
      riskyFields: entry.risk === 'bajo' ? [] : [{ key: 'executeChanges', label: 'Ejecutar cambios reales eleva el riesgo. Mantener desactivado para diagnostico/guia segura.', level: entry.risk }],
      checklistPre: checklistPre(entry),
      checklistPost: checklistPost(entry),
      rollback: rollbackText(entry),
      batBody: (v) => batBody(entry, v),
      ps1Body: (v) => ps1Body(entry, v)
    };
  }

  CAU_MEGA_ENTRIES.forEach(entry => add(makeTemplate(entry)));
})();
