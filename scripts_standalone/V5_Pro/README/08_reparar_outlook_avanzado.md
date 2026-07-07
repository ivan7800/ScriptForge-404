# V5 Pro - Reparar Outlook avanzado

**Categoria:** Office / Outlook  
**Nivel de riesgo:** ALTO  
**Requiere administrador:** No  
**Generado:** 2026-07-07 07:56:51  
**Tecnico:** CAU  
**Cliente/equipo:** Equipo local  
**Version del script:** 5.2.2-standalone  

## Descripcion
Diagnostica y repara caches de Outlook: RoamCache, Autocomplete, Resiliency y add-ins. No borra perfiles por defecto.

## Que hace este script
Genera comandos BAT y PS1 basados en la plantilla "V5 Pro - Reparar Outlook avanzado" con las opciones configuradas por el usuario en ScriptForge 404.

## Motivos del nivel de riesgo
- Puede borrar caches y claves de resiliencia de Outlook del usuario.

## Requisitos previos
- Cerrar Outlook.
- No usar si el usuario necesita conservar Autocomplete/caches sin respaldo.

## Posibilidad de rollback
Las caches se regeneran. Las claves Resiliency se recrean automáticamente por Office.

## Advertencia
Revisa siempre el contenido del script antes de ejecutarlo. Usalo unicamente en equipos donde tengas autorizacion. El autor de ScriptForge 404 no se responsabiliza de danos derivados de un uso indebido.

---

## Nota v5.2.2

Este script standalone se entrega en modo seguro/diagnostico por defecto cuando la plantilla tiene acciones de reparacion. Para generar una variante de reparacion real, usa la app, revisa el informe de riesgo y activa el campo correspondiente.
