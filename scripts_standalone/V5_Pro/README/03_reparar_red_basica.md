# V5 Pro - Reparar red basica

**Categoria:** Red  
**Nivel de riesgo:** MEDIO  
**Requiere administrador:** Si  
**Generado:** 2026-07-07 07:56:51  
**Tecnico:** CAU  
**Cliente/equipo:** Equipo local  
**Version del script:** 5.2.2-standalone  

## Descripcion
Diagnostica y, opcionalmente, repara conectividad basica: DNS, IP, gateway, adaptador, ping y proxy WinHTTP.

## Que hace este script
Genera comandos BAT y PS1 basados en la plantilla "V5 Pro - Reparar red basica" con las opciones configuradas por el usuario en ScriptForge 404.

## Motivos del nivel de riesgo
- Puede renovar IP y reiniciar adaptador si se activa reparacion.

## Requisitos previos
- Confirmar si el equipo usa VPN o proxy corporativo.
- Guardar trabajo abierto si se reinicia adaptador.

## Posibilidad de rollback
Reiniciar el equipo o restaurar proxy/adaptador manualmente si el cambio no ayuda.

## Advertencia
Revisa siempre el contenido del script antes de ejecutarlo. Usalo unicamente en equipos donde tengas autorizacion. El autor de ScriptForge 404 no se responsabiliza de danos derivados de un uso indebido.

---

## Nota v5.2.2

Este script standalone se entrega en modo seguro/diagnostico por defecto cuando la plantilla tiene acciones de reparacion. Para generar una variante de reparacion real, usa la app, revisa el informe de riesgo y activa el campo correspondiente.
