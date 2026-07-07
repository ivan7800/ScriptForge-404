# Faltantes recomendados para V6

La V5.1 ya es fuerte. No necesita cientos de scripts nuevos de golpe; necesita convertir mas plantillas genericas en scripts especificos y probados.

## Prioridad alta

1. WebView2 Runtime: diagnostico, reparacion e instalacion offline.
2. Winget/App Installer: comprobar, reparar, instalar apps permitidas.
3. VPN corporativa generica: diagnostico de servicio, rutas, DNS, puertos y credenciales.
4. MFA/Company Portal: checklist y diagnostico de cuenta laboral.
5. Outlook perfiles: creador guiado de nuevo perfil y backup previo.
6. Teams Add-in: detector de versiones y registro por arquitectura Office/Teams.
7. Impresoras por sede/departamento: CSV configurable.
8. Unidades de red por CSV: letra, UNC, persistencia, descripcion.
9. Intune IME avanzado: triggers, logs, deteccion Win32 apps.
10. SCCM actions GUI/menu: Machine Policy, User Policy, HW/SW Inventory, App Eval, Updates Eval.

## Prioridad media

11. Plantilla de ticket automatica con diagnostico pegable.
12. Exportacion HTML bonita de inventario.
13. Generador de ZIP de evidencias.
14. Asociaciones de archivos: PDF, ICA, URL handlers.
15. Certificados corporativos desde ruta configurable.
16. BitLocker recovery status sin exponer claves.
17. Defender quick scan y update de firmas.
18. Firewall profile/report.
19. Diagnostico de proxy usuario + WinHTTP + navegador.
20. Reparacion de Windows Store/AppX basica.

## No recomendado sin control

- Desactivar Defender o firewall sin politica formal.
- Borrar logs/evidencias.
- Ejecutar scripts remotos sin trazabilidad.
- Guardar credenciales en claro.
- Cambios masivos de registro sin backup.
