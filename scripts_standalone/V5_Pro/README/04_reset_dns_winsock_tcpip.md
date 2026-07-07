# V5 Pro - Reset DNS Winsock TCP/IP

**Categoria:** Red  
**Nivel de riesgo:** ALTO  
**Requiere administrador:** Si  
**Generado:** 2026-07-07 07:56:51  
**Tecnico:** CAU  
**Cliente/equipo:** Equipo local  
**Version del script:** 5.2.2-standalone  

## Descripcion
Reset controlado de DNS, Winsock y pila TCP/IP. Pensado para incidencias de conectividad persistente.

## Que hace este script
Genera comandos BAT y PS1 basados en la plantilla "V5 Pro - Reset DNS Winsock TCP/IP" con las opciones configuradas por el usuario en ScriptForge 404.

## Motivos del nivel de riesgo
- Winsock/TCP reset puede requerir reinicio.
- Puede afectar VPN/proxy/adaptadores.

## Requisitos previos
- Confirmar ventana de mantenimiento o permiso del usuario.
- Anotar configuraciones especiales de red/proxy/VPN.

## Posibilidad de rollback
No hay rollback directo. Reaplicar configuración corporativa de red/proxy/VPN si procede.

## Advertencia
Revisa siempre el contenido del script antes de ejecutarlo. Usalo unicamente en equipos donde tengas autorizacion. El autor de ScriptForge 404 no se responsabiliza de danos derivados de un uso indebido.

---

## Nota v5.2.2

Este script standalone se entrega en modo seguro/diagnostico por defecto cuando la plantilla tiene acciones de reparacion. Para generar una variante de reparacion real, usa la app, revisa el informe de riesgo y activa el campo correspondiente.
