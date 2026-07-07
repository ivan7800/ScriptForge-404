# Changelog

## v5.6.0 — Auto-UAC Final — 2026-07-07

### Elevación de permisos
- Añadida opción global en el wizard: **Autoelevar con UAC si requiere administrador**.
- El motor `.BAT` relanza el propio script con `Start-Process -Verb RunAs` cuando la plantilla requiere admin y no está elevada.
- El motor `.PS1` relanza PowerShell con `-ExecutionPolicy Bypass`, conserva `-DryRun` y `-Silent`, y ejecuta el mismo `.ps1` como administrador.
- Los scripts standalone Admin de `scripts_standalone/V5_Pro/` y `scripts_standalone/V5_4_Pro/` se han sincronizado con autoelevación UAC.
- README y checklist generados indican si la autoelevación está activada, desactivada o no aplica.

### Verificación
- `node --check assets/js/*.js` OK.
- `node audit.js` OK: 620 plantillas, 0 duplicados, 0 errores de generación, 0 incidencias Auto-UAC.
- `node audit_app_render.js` OK.

## v5.5.0 — Final GitHub Audit — 2026-07-07

### Correcciones críticas y altas
- Actualizada la versión visible de ayuda interna a **5.5 Final GitHub Audit**.
- Eliminado el renderizado masivo inicial de 620 tarjetas: biblioteca y wizard cargan 80 resultados y permiten **Mostrar más**.
- Añadida navegación de wizard más segura: no se puede saltar a pasos de generación/exportación sin plantilla o sin script generado.
- Añadida mejora de accesibilidad con enlace “Saltar al contenido principal”.
- Añadido cierre de modal con tecla `Escape`.
- Añadido `site.webmanifest` y `sw.js` para PWA/offline básico en GitHub Pages.
- Añadida documentación final y movidos informes antiguos a `docs/historico/` para limpiar la raíz.

### UX/UI
- Mantenida identidad Control Center Premium.
- Mejorada la percepción de producto final reduciendo ruido documental en raíz.
- Mejorado el portal de apps con copy más prudente para entornos corporativos.

### Verificación
- `node --check assets/js/app.js` OK.
- `node --check assets/js/*.js` OK.
- `node audit.js` OK: 620 plantillas, 90 Pro, 0 duplicados, 0 errores de generación.
- `node audit_app_render.js` OK.

## v5.4.0 — Advanced CAU Script Pack — 2026-07-07

- Añadido `assets/js/templates-v5-4-pro.js` con 60 plantillas Pro nuevas.
- Total activo: 620 plantillas = 48 base/extra + 482 Mega Pack CAU + 30 V5 Pro + 60 V5.4 Pro.
- Añadidos 60 BAT standalone, 60 PS1 standalone y 60 README/checklist en `scripts_standalone/V5_4_Pro/`.
- Nuevas áreas reforzadas: red avanzada, unidades de red, Office/Outlook, Teams/WebView2, Intune/Autopilot, SCCM, impresoras y evidencias/tickets.

## v5.3.0 — Control Center Premium — 2026-07-07

- Rediseño de interfaz principal con estética oscura corporativa tipo centro de operaciones.
- Nueva landing premium, dashboard, wizard lateral, biblioteca técnica y Generation Studio.
- Se mantienen generación, historial, riesgo, skins, portal de apps y standalone.

## Historial anterior

Los informes y changelogs históricos se conservan en `docs/historico/`.
