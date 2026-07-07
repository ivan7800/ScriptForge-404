# V5 Pro - Reparar unidades de red

**Categoria:** Unidades de red  
**Nivel de riesgo:** MEDIO  
**Requiere administrador:** No  
**Generado:** 2026-07-07 07:56:51  
**Tecnico:** CAU  
**Cliente/equipo:** Equipo local  
**Version del script:** 5.2.2-standalone  

## Descripcion
Diagnostica unidades desconectadas, servidor SMB 445, rutas UNC y credenciales guardadas. Puede reconectar unidades persistentes.

## Que hace este script
Genera comandos BAT y PS1 basados en la plantilla "V5 Pro - Reparar unidades de red" con las opciones configuradas por el usuario en ScriptForge 404.

## Motivos del nivel de riesgo
- Puede eliminar/reconectar mapeos si se activa reparacion.

## Requisitos previos
- Verificar si el usuario tiene VPN activa.
- Confirmar permisos sobre el recurso.

## Posibilidad de rollback
Volver a mapear manualmente unidades eliminadas o restaurar credenciales.

## Advertencia
Revisa siempre el contenido del script antes de ejecutarlo. Usalo unicamente en equipos donde tengas autorizacion. El autor de ScriptForge 404 no se responsabiliza de danos derivados de un uso indebido.

---

## Nota v5.2.2

Este script standalone se entrega en modo seguro/diagnostico por defecto cuando la plantilla tiene acciones de reparacion. Para generar una variante de reparacion real, usa la app, revisa el informe de riesgo y activa el campo correspondiente.
