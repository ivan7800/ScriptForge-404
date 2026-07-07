# Checklist de pruebas Windows — ScriptForge 404 V5

## Entorno recomendado

- Windows 10/11 en VM o equipo piloto.
- Usuario estandar y usuario administrador.
- PowerShell 5.1 y, si existe, PowerShell 7.
- Outlook Classic, Teams, OneDrive, Citrix, SCCM/Intune si aplica.

## Pruebas minimas

1. Abrir `index.html` localmente.
2. Aceptar aviso legal.
3. Buscar `V5 Pro` en biblioteca.
4. Generar BAT y PS1 de las 30 plantillas.
5. Descargar archivos.
6. Copiar al portapapeles.
7. Recargar desde historial.
8. Validar que riesgo alto pide confirmacion.
9. Ejecutar primero con `Dry Run` o sin activar reparacion.
10. Probar reparaciones solo en equipo piloto.

## Plantillas a probar primero

- Diagnostico rapido PC.
- Informe completo para ticket.
- Ver programas instalados.
- Diagnostico Office 365.
- Diagnostico Intune Autopilot.
- Diagnostico Citrix ICA.

## Plantillas de riesgo alto

Probar solo con snapshot/rollback:

- Reset DNS Winsock TCP/IP.
- Reparar boton Teams Meeting en Outlook.
- Reparar Teams completo.
- Reparar impresoras.
- Limpieza avanzada PC.
- Reset Windows Update.
- Reparar cliente SCCM.
- Desinstalar programa.
