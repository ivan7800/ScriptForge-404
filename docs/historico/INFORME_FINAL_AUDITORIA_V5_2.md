# Informe histórico de auditoría — ScriptForge 404 v5.1 → v5.2

## 1. Resumen ejecutivo

ScriptForge 404 llegaba a esta auditoría ya en buen estado: motor de plantillas sólido (560 plantillas, 0 IDs duplicados, 0 errores de generación BAT/PS1 verificados con Node), sin dependencias de backend, sin `eval`/`Function` dinámico, y con `escapeHtml` aplicado de forma consistente en las más de 25 rutas donde se inyecta contenido dinámico en el DOM. Las auditorías previas (V4, V5, V5.1) ya habían corregido riesgos reales (cierre de procesos Outlook/Teams en modo diagnóstico).

Esta ronda encontró **0 problemas críticos**, **1 problema alto** (página huérfana sin retorno), y varios problemas medios/bajos de coherencia de marca, accesibilidad y documentación desactualizada. Todo se ha corregido directamente sobre el proyecto.

Veredicto: el proyecto **no llegaba a 9,5/10 antes de esta ronda** por los motivos del punto 12. Con las correcciones aplicadas, sube de forma justificada pero sigue sin validación en Windows real, que es el único bloqueo real para un 10/10 operativo.

## 2. Problemas críticos encontrados

Ninguno. El proyecto abre desde `index.html`, no tiene rutas absolutas rotas, no depende de un backend, y el motor de generación funciona sin excepciones sobre las 560 plantillas.

## 3. Problemas altos encontrados

- **Página sin retorno (`apps-corporativas.html`)**: se accedía a ella desde el dashboard principal (`window.open(...)`), pero no tenía ningún enlace de vuelta a ScriptForge 404. Para un usuario que la abre en la misma pestaña (o que pierde el `_blank`), era un callejón sin salida. Corregido.

## 4. Problemas medios y bajos

- **Inconsistencia de marca/offline**: `apps-corporativas.html` cargaba Google Fonts (`fonts.googleapis.com`), contradiciendo el mensaje "100% local, sin backend" del propio `index.html` y añadiendo una petición de red innecesaria + tracking de terceros. Medio.
- **README desactualizado**: el título seguía diciendo "ScriptForge 404 v4" y el árbol de archivos no incluía `templates-v5-pro.js`, `scripts_standalone/`, ni los informes V5/V5.1. Medio (afecta a la primera impresión de un revisor/inversor en GitHub).
- **Accesibilidad del portal de apps**: el buscador solo tenía `placeholder` (no válido como etiqueta para lectores de pantalla) y los botones de filtro no comunicaban su estado activo/inactivo (`aria-pressed`). Bajo-medio.
- **Falta `.nojekyll`**: no bloqueaba nada hoy, pero es buena práctica estándar en GitHub Pages para evitar que Jekyll procese o ignore archivos/carpetas que empiecen por `_` en el futuro. Bajo (preventivo).
- **Sin validación en Windows real**: honesto y ya señalado en auditorías previas — sigue pendiente. No es un bug de la app, es un límite del entorno de auditoría.

## 5. Correcciones realizadas

1. Añadido enlace de retorno "← ScriptForge 404" en la cabecera de `apps-corporativas.html`.
2. Eliminada la dependencia de Google Fonts; sustituida por la misma pila de fuentes del sistema (`-apple-system, Segoe UI, system-ui...`) que ya usa `index.html`, manteniendo coherencia visual y la promesa de "100% local".
3. Añadido `favicon.svg` y meta-descripción a `apps-corporativas.html` (antes no tenía ninguna de las dos).
4. Añadida etiqueta accesible (`<label class="sr-only">` + `aria-label`) al buscador del portal de apps.
5. Añadido `role="group"` + `aria-label` al contenedor de filtros, y `aria-pressed` dinámico a cada botón de filtro.
6. Añadido `.nojekyll` en la raíz del repositorio.
7. Actualizado `README.md` en esa fase: titulo corregido entonces a "v5.1". En v5.2.2 el README activo ya queda actualizado a v5.2.2 y 560 plantillas.

## 6. Mejoras UX/UI aplicadas

- Navegación cerrada entre las dos páginas del sitio (antes solo iba en un sentido).
- Coherencia tipográfica entre `index.html` (dark, técnico) y `apps-corporativas.html` (portal claro): misma familia de fuentes del sistema en ambas.

## 7. Mejoras móviles aplicadas

No se detectaron roturas móviles reales: `index.html`/`styles.css` ya tenían `@media (max-width: 640px)` cubriendo panel, topbar y grupos de botones, y `apps-corporativas.html` usa `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`, que es responsive por diseño sin necesitar media queries adicionales. No se ha tocado nada aquí porque ya funcionaba bien; se verificó en vez de "arreglar lo que no está roto".

## 8. Mejoras de seguridad aplicadas

- Ninguna corrección de seguridad fue necesaria en esta ronda: no hay `eval`, no hay `innerHTML` con datos de usuario sin `escapeHtml`, los enlaces externos usan `target="_blank" rel="noopener noreferrer"` correctamente, y no hay rutas ni credenciales corporativas hardcodeadas (confirmado por grep).
- Se retiró la llamada a Google Fonts, lo que de paso elimina una fuga de datos de navegación (IP/user-agent) hacia un dominio de terceros en una herramienta que se anuncia como "100% local".

## 9. Mejoras de rendimiento aplicadas

- Al eliminar Google Fonts se ahorra una petición de red bloqueante + el download de la fuente en cada carga de `apps-corporativas.html`, mejorando el first paint especialmente en redes corporativas restringidas (el público objetivo real de esta herramienta).

## 10. Verificación final

- `node --check` sin errores en los 9 archivos JS del proyecto.
- Motor de plantillas: 560 plantillas, 0 IDs duplicados, 0 fallos de generación BAT/PS1 (verificado ejecutando la lógica de `audit.js` del propio repo en Node con un DOM simulado).
- Sin rutas absolutas rotas (`href="/..."` / `src="/..."`) en ningún HTML.
- Sin archivos con espacios, tildes o prefijo `_` que puedan dar problemas en GitHub/Jekyll.
- Tamaño total del repo: ~924 KB — sin archivos pesados que puedan dar problemas en GitHub Pages.
- `apps-corporativas.html` ahora enlaza de vuelta a `index.html` y no depende de servicios externos.

## 11. Riesgos pendientes

- Los `.bat`/`.ps1` (tanto los generados por la app como los 30 de `scripts_standalone/`) no se han ejecutado en un Windows real desde este entorno. Deben probarse en una VM o equipo piloto antes de distribuirlos al equipo CAU, tal y como ya advertían los informes V5 y V5.1.
- El listado de `apps-corporativas.html` son enlaces de descarga oficiales fijos; conviene revisarlos periódicamente porque las URLs de fabricantes cambian con el tiempo.

## 12. Qué faltaría para un 10/10 real

1. Validación funcional de los scripts PS1/BAT en Windows real (PowerShell 5.1 y 7), incluyendo los 30 de `scripts_standalone/`.
2. Un test automatizado (aunque sea básico, con Playwright o similar) que abra `index.html` en un navegador real y verifique que el wizard completo (plantilla → campos → generación → exportación) funciona de principio a fin, no solo que el motor de generación no lanza excepciones.
3. Revisión periódica de los enlaces externos de `apps-corporativas.html` para detectar URLs de fabricante caducadas.

## 13. Puntuación por categorías

- CTO / arquitectura: 9.0
- UX/UI: 8.5
- QA / estabilidad: 8.5
- Seguridad: 9.0
- Rendimiento: 9.0
- Accesibilidad: 8.0
- GitHub Pages: 9.5
- Valor como producto: 8.5
- Potencial comercial: 7.5 (herramienta de nicho IT/CAU, no un producto de consumo masivo, pero con buena ejecución para venderse como toolkit interno o plantilla white-label)

## 14. Puntuación global final

**8.7 / 10.**

No llega a 9,5 porque, honestamente, ningún .bat/.ps1 de este repositorio se ha ejecutado en un Windows real desde este entorno de auditoría — y eso es precisamente lo que determina si una herramienta para técnicos CAU es fiable en producción. El código está limpio, seguro y bien estructurado; lo que falta es validación de campo, no calidad de ingeniería.
