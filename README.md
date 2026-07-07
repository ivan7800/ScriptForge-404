# ScriptForge 404 v5.6 — Auto-UAC Final

Generador profesional de scripts de administración Windows (`.BAT` y `.PS1`) para CAU, soporte técnico, sistemas y administradores. Es una app web estática, 100% local, sin backend y preparada para GitHub Pages.

## Estado de esta entrega

- **620 plantillas activas**.
- **90 plantillas Pro** (`V5 Pro` + `V5.4 Pro`) priorizadas para incidencias reales de CAU/N2.
- Generación de **BAT**, **PS1**, **README** y **checklist**.
- **Autoelevación UAC opcional** para scripts que requieren administrador.
- Análisis de riesgo bajo/medio/alto con confirmación para acciones de riesgo alto.
- Historial local en `localStorage`.
- 10 skins visuales sincronizadas con el portal de apps.
- Biblioteca y wizard optimizados con carga progresiva para no renderizar 620 tarjetas de golpe.
- Manifest PWA y service worker básico para uso offline de los assets principales.
- Compatible con GitHub Pages sin build, sin npm y sin servidor.

## Autoelevación UAC

Cuando una plantilla está marcada como **Admin**, el wizard muestra la opción:

```text
Autoelevar con UAC si requiere administrador
```

Si está activada, el script generado detecta si no se está ejecutando con permisos elevados y solicita UAC automáticamente:

- En `.BAT`, relanza el propio archivo con `Start-Process -Verb RunAs`.
- En `.PS1`, relanza PowerShell con `-ExecutionPolicy Bypass`, conserva `-DryRun` y `-Silent` si estaban activos y ejecuta el mismo script como administrador.
- Si el usuario cancela UAC, el script original se cierra y no continúa la ejecución.

Si la opción se desactiva, el comportamiento vuelve al modo seguro clásico: el script solo avisa de que necesita administrador y se detiene.

## Estructura principal

```text
/index.html
/apps-corporativas.html
/favicon.svg
/site.webmanifest
/sw.js
/.nojekyll
/assets/css/styles.css
/assets/js/storage.js
/assets/js/security.js
/assets/js/templates.js
/assets/js/templates-extra.js
/assets/js/templates-cau-mega.js
/assets/js/templates-v5-pro.js
/assets/js/templates-v5-4-pro.js
/assets/js/generator.js
/assets/js/exporter.js
/assets/js/app.js
/scripts_standalone/V5_Pro/
/scripts_standalone/V5_4_Pro/
/docs/historico/
/CHANGELOG.md
/INFORME_FINAL_SCRIPT_FORGE_404_V5_6.md
/audit.js
/audit_app_render.js
/LICENSE
```

## Uso recomendado

1. Abre `index.html` o publica el proyecto en GitHub Pages.
2. Acepta el aviso legal.
3. Pulsa **Crear script**.
4. Busca por incidencia o categoría: `Teams`, `Outlook`, `SCCM`, `Intune`, `Citrix`, `proxy`, `unidad`, `impresora`.
5. Configura campos y opciones globales.
6. En scripts Admin, decide si quieres mantener activada la autoelevación UAC.
7. Revisa el panel de seguridad y el informe de riesgo.
8. Exporta BAT, PS1, README y checklist.
9. Revisa siempre el contenido antes de ejecutar en un equipo real.

## Publicar en GitHub Pages

1. Crea o abre el repositorio en GitHub.
2. Sube **todo el contenido de esta carpeta**, no el ZIP cerrado.
3. Asegúrate de que `index.html` queda en la raíz del repositorio.
4. Ve a **Settings → Pages**.
5. En **Build and deployment**, selecciona **Deploy from a branch**.
6. Rama: `main`. Carpeta: `/ (root)`.
7. Guarda y espera a que GitHub publique la URL.

No hace falta instalar dependencias, ejecutar `npm`, compilar ni configurar backend.

## Validación técnica

Comandos ejecutables desde la raíz del proyecto:

```bash
node --check assets/js/app.js
node --check assets/js/*.js
node audit.js
node audit_app_render.js
```

Resultado esperado: auditoría limpia, 620 plantillas, 0 IDs duplicados, 0 errores de generación, 0 incidencias de here-string PowerShell y 0 incidencias de generación Auto-UAC.

## Aviso legal

ScriptForge 404 genera scripts de administración. Úsalo solo en equipos donde tengas autorización. Revisa cada salida antes de ejecutarla. El análisis de riesgo es heurístico y no sustituye una revisión humana ni pruebas en entorno controlado.

## Licencia

MIT. Ver `LICENSE`.
