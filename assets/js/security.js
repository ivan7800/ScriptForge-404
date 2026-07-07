/* ============================================================
   ScriptForge 404 - security.js
   Motor de analisis de riesgo. Es una heuristica de ayuda,
   NO una garantia de seguridad (esto se advierte tambien
   en la interfaz).
   ============================================================ */

const SFSecurity = (() => {
  const LEVELS = { BAJO: 'bajo', MEDIO: 'medio', ALTO: 'alto' };
  const LEVEL_WEIGHT = { bajo: 1, medio: 2, alto: 3 };

  // Palabras clave que, si aparecen en un comando libre (constructor guiado
  // o plantilla vacia), elevan el riesgo automaticamente.
  const DANGER_PATTERNS = [
    { re: /\brd\s+\/s/i, level: 'alto', label: 'Borrado recursivo de carpetas (rd /s)' },
    { re: /\bdel\s+\/f.*\/s/i, level: 'alto', label: 'Borrado forzado y recursivo de archivos' },
    { re: /\bformat\s/i, level: 'alto', label: 'Formateo de unidad' },
    { re: /\breg\s+delete/i, level: 'alto', label: 'Eliminacion de claves de registro' },
    { re: /\breg\s+add/i, level: 'alto', label: 'Modificacion de claves de registro' },
    { re: /\bicacls\b/i, level: 'alto', label: 'Cambio de permisos NTFS' },
    { re: /\btakeown\b/i, level: 'alto', label: 'Cambio de propietario de archivos' },
    { re: /\bnet\s+stop\b/i, level: 'medio', label: 'Detencion de servicio' },
    { re: /\bnet\s+start\b/i, level: 'bajo', label: 'Inicio de servicio' },
    { re: /\bshutdown\b/i, level: 'alto', label: 'Apagado o reinicio del equipo' },
    { re: /\bdiskpart\b/i, level: 'alto', label: 'Gestion de particiones de disco' },
    { re: /\bnetsh\s+winsock\s+reset\b/i, level: 'medio', label: 'Reset de Winsock (requiere reinicio)' },
    { re: /\bnetsh\s+int\s+ip\s+reset\b/i, level: 'medio', label: 'Reset de pila TCP/IP (requiere reinicio)' },
    { re: /Remove-Item/i, level: 'medio', label: 'Eliminacion de archivos/carpetas (PowerShell)' },
    { re: /Set-ItemProperty|New-ItemProperty|Remove-ItemProperty/i, level: 'alto', label: 'Modificacion del registro (PowerShell)' },
    { re: /Stop-Service|Restart-Service/i, level: 'medio', label: 'Detencion/reinicio de servicio (PowerShell)' },
    { re: /Clear-EventLog|wevtutil\s+cl/i, level: 'alto', label: 'Borrado de logs de eventos' },
    { re: /Remove-LocalUser|net\s+user.*\/delete/i, level: 'alto', label: 'Eliminacion de perfil/usuario' },
    { re: /Disable-WindowsOptionalFeature|sc\s+config.*disabled/i, level: 'alto', label: 'Desactivacion de componentes del sistema' }
  ];

  function scanFreeTextForRisk(text) {
    const reasons = [];
    let maxLevel = 'bajo';
    if (!text) return { level: maxLevel, reasons };
    const lines = String(text).split('\n');
    lines.forEach(line => {
      DANGER_PATTERNS.forEach(pattern => {
        if (pattern.re.test(line)) {
          reasons.push(pattern.label);
          if (LEVEL_WEIGHT[pattern.level] > LEVEL_WEIGHT[maxLevel]) {
            maxLevel = pattern.level;
          }
        }
      });
    });
    return { level: maxLevel, reasons: [...new Set(reasons)] };
  }

  /**
   * Calcula el riesgo efectivo de una generacion, combinando:
   * - el riesgo base de la plantilla
   * - los "riskNotes" propios de la plantilla (siempre se listan)
   * - opciones marcadas por el usuario que puedan elevar el riesgo
   * - en el caso del constructor guiado, un escaneo de texto libre
   */
  function analyzeRisk(template, fieldValues) {
    let level = template.risk || LEVELS.BAJO;
    let reasons = Array.isArray(template.riskNotes) ? [...template.riskNotes] : [];

    // Campos que el propio template marca como "riskyIf" (opcional)
    if (Array.isArray(template.riskyFields)) {
      template.riskyFields.forEach(rf => {
        const val = fieldValues[rf.key];
        const triggered = rf.when ? rf.when(val) : !!val;
        if (triggered) {
          reasons.push(rf.label);
          if (LEVEL_WEIGHT[rf.level] > LEVEL_WEIGHT[level]) {
            level = rf.level;
          }
        }
      });
    }

    // Constructor guiado / plantilla vacia: escanear comandos libres
    if (template.id === 'custom-guided' || template.id === 'empty-template') {
      const freeText = fieldValues.customCommands || '';
      const scan = scanFreeTextForRisk(freeText);
      reasons = reasons.concat(scan.reasons);
      if (LEVEL_WEIGHT[scan.level] > LEVEL_WEIGHT[level]) {
        level = scan.level;
      }
    }

    return {
      level,
      reasons: [...new Set(reasons)],
      requiresConfirmation: level === LEVELS.ALTO,
      requiresAdmin: !!template.requiresAdmin
    };
  }

  function levelLabel(level) {
    return { bajo: 'Riesgo bajo', medio: 'Riesgo medio', alto: 'Riesgo alto' }[level] || 'Riesgo desconocido';
  }

  function levelBadgeClass(level) {
    return 'risk-badge risk-' + (level || 'bajo');
  }

  return {
    LEVELS,
    analyzeRisk,
    scanFreeTextForRisk,
    levelLabel,
    levelBadgeClass,
    DANGER_PATTERNS
  };
})();
