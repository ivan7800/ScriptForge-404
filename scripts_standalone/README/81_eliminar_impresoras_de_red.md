# V5.4 Pro - Eliminar impresoras de red

**Categoria:** Impresoras  
**Nivel de riesgo:** ALTO  
**Requiere administrador:** No  
**Generado:** 2026-07-07 08:47:22  
**Tecnico:** CAU  
**Cliente/equipo:** EQUIPO  
**Version del script:** 5.4-standalone  

## Descripcion
Elimina impresoras de red, todas o por filtro, tras exportar inventario.

## Que hace este script
Genera comandos BAT y PS1 basados en la plantilla "V5.4 Pro - Eliminar impresoras de red" con las opciones configuradas por el usuario en ScriptForge 404.

## Motivos del nivel de riesgo
- Plantilla V5.4 Pro con posibles cambios sensibles si se activa reparacion. Por defecto genera diagnostico.

## Requisitos previos
- Ejecutar primero en modo diagnóstico.
- Confirmar autorización del usuario/equipo antes de aplicar cambios.

## Posibilidad de rollback
Reinstalar desde backup `81_printers_backup.csv` o por ruta UNC.

## Advertencia
Revisa siempre el contenido del script antes de ejecutarlo. Usalo unicamente en equipos donde tengas autorizacion. El autor de ScriptForge 404 no se responsabiliza de danos derivados de un uso indebido.

CHECKLIST - V5.4 Pro - Eliminar impresoras de red
============================================================

ANTES DE EJECUTAR:
  [ ] 1. Ejecutar primero en modo diagnóstico.
  [ ] 2. Confirmar autorización del usuario/equipo antes de aplicar cambios.

DESPUES DE EJECUTAR:
  [ ] 1. Revisar logs generados en la carpeta de salida.
  [ ] 2. Validar con el usuario que la incidencia queda resuelta.

NIVEL DE RIESGO DETECTADO: ALTO
Motivos:
  - Plantilla V5.4 Pro con posibles cambios sensibles si se activa reparacion. Por defecto genera diagnostico.

ROLLBACK:
  Reinstalar desde backup `81_printers_backup.csv` o por ruta UNC.