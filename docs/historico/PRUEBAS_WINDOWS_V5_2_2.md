# Pruebas Windows — ScriptForge 404 v5.2.2

## Estado real de esta entrega

Desde este entorno no se puede ejecutar Windows, `cmd.exe`, PowerShell 5.1, Intune, SCCM, Teams ni Outlook reales. Por tanto, **no se ha ejecutado físicamente ningún BAT/PS1 en Windows real desde aquí**.

Lo que sí se ha realizado en v5.2.2:

- Validación Node del motor completo.
- Carga de 560 plantillas.
- Detección de 30 plantillas V5 Pro.
- Regeneración de 30 BAT y 30 PS1 standalone.
- Comprobación de existencia de los 5 scripts clave en BAT, PS1 y README.
- Detección y corrección de un problema real de generación PS1 en unidades de red.
- Detección y corrección de cierres de here-string PowerShell con pipeline en plantillas de tickets/comunicaciones.

Resultado de `node audit.js`:

```text
Total templates: 560
V5 Pro templates: 30
Duplicate IDs: 0
Generation errors: 0
PowerShell here-string issues: 0
Standalone 5-script checks: OK
```

## 5 scripts clave a probar en Windows real

Carpeta base:

```text
scripts_standalone/V5_Pro/
```

### 1. Diagnóstico rápido PC

Archivos:

```text
BAT/01_diagnostico_rapido_pc.bat
PS1/01_diagnostico_rapido_pc.ps1
README/01_diagnostico_rapido_pc.md
```

Prueba recomendada:

```powershell
cd .\scripts_standalone\V5_Pro\PS1
powershell.exe -ExecutionPolicy Bypass -File .\01_diagnostico_rapido_pc.ps1
```

Resultado esperado:

- Crea carpeta `C:\CAU\ScriptForge404` si no existe.
- Exporta diagnóstico de equipo.
- Exporta red.
- Exporta discos.
- Exporta procesos y eventos críticos.
- No modifica configuración del equipo.

Nivel de riesgo: bajo.

### 2. Mapear unidades de red

Archivos:

```text
BAT/05_mapear_unidades_red.bat
PS1/05_mapear_unidades_red.ps1
README/05_mapear_unidades_red.md
```

Antes de probar:

- Sustituir `\\servidor\departamento` y `\\servidor\comun` por rutas UNC reales de prueba.
- Probar primero con una unidad temporal no crítica.
- Evitar letras usadas por aplicaciones corporativas.

Prueba PS1 recomendada:

```powershell
cd .\scripts_standalone\V5_Pro\PS1
powershell.exe -ExecutionPolicy Bypass -File .\05_mapear_unidades_red.ps1 -DryRun
```

Resultado esperado en `-DryRun`:

- Lee las líneas de mapeo.
- Muestra qué unidad mapearía.
- No crea unidades reales.

Prueba real controlada:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\05_mapear_unidades_red.ps1
```

Resultado esperado:

- Elimina mapeo previo de esa letra si aplica.
- Crea unidad persistente según la plantilla.
- `net use` muestra la unidad.

Nivel de riesgo: medio.

### 3. Reset DNS / Winsock / TCP-IP

Archivos:

```text
BAT/04_reset_dns_winsock_tcpip.bat
PS1/04_reset_dns_winsock_tcpip.ps1
README/04_reset_dns_winsock_tcpip.md
```

Prueba recomendada:

- Solo en VM, equipo piloto o ventana de mantenimiento.
- Ejecutar como administrador.
- Hacer snapshot o punto de restauración si procede.

Prueba inicial segura:

```powershell
cd .\scripts_standalone\V5_Pro\PS1
powershell.exe -ExecutionPolicy Bypass -File .\04_reset_dns_winsock_tcpip.ps1 -DryRun
```

Resultado esperado:

- Exporta `ipconfig` previo.
- Exporta catálogo Winsock previo si aplica.
- En modo diagnóstico no resetea TCP/IP/Winsock.

Nivel de riesgo: alto.

### 4. Reparar botón Teams Meeting en Outlook

Archivos:

```text
BAT/09_reparar_boton_teams_outlook.bat
PS1/09_reparar_boton_teams_outlook.ps1
README/09_reparar_boton_teams_outlook.md
```

Prueba recomendada:

- Ejecutar primero en equipo piloto con el problema real.
- Ejecutar como administrador.
- Cerrar manualmente Outlook/Teams antes de la prueba si se va a hacer reparación real.

Prueba diagnóstico:

```powershell
cd .\scripts_standalone\V5_Pro\PS1
powershell.exe -ExecutionPolicy Bypass -File .\09_reparar_boton_teams_outlook.ps1 -DryRun
```

Resultado esperado:

- Exporta procesos de Outlook/Teams.
- Exporta backup de clave Teams Add-in si existe.
- Detecta arquitectura Office y ruta del add-in.
- No toca registro ni registra DLL en modo diagnóstico.

Nivel de riesgo: alto.

### 5. Diagnóstico Intune / Autopilot

Archivos:

```text
BAT/22_diagnostico_intune_autopilot.bat
PS1/22_diagnostico_intune_autopilot.ps1
README/22_diagnostico_intune_autopilot.md
```

Prueba recomendada:

```powershell
cd .\scripts_standalone\V5_Pro\PS1
powershell.exe -ExecutionPolicy Bypass -File .\22_diagnostico_intune_autopilot.ps1
```

Resultado esperado:

- Exporta `dsregcmd /status`.
- Exporta información de enrollments MDM.
- Revisa servicio Intune Management Extension si existe.
- Exporta eventos MDM recientes.
- No modifica enrolamiento ni políticas.

Nivel de riesgo: bajo/medio técnico por requerir admin, pero funcionalmente diagnóstico.

## Criterio para aprobar la prueba real

Cada script se considera aprobado en Windows real si cumple:

1. No muestra errores rojos no controlados.
2. Crea logs en `logs/`.
3. Crea salidas en `C:\CAU\ScriptForge404` cuando aplica.
4. En modo diagnóstico no modifica el equipo.
5. Las acciones reales solo se ejecutan tras confirmación o decisión explícita.
6. El resultado es entendible para adjuntar a ticket CAU.

## Recomendación final

Probar primero en este orden:

1. `01_diagnostico_rapido_pc.ps1`
2. `22_diagnostico_intune_autopilot.ps1`
3. `05_mapear_unidades_red.ps1 -DryRun`
4. `04_reset_dns_winsock_tcpip.ps1 -DryRun`
5. `09_reparar_boton_teams_outlook.ps1 -DryRun`

Después, si todo está correcto, pasar a pruebas reales controladas en VM o equipo piloto.
