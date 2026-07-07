/* ============================================================
   ScriptForge 404 - storage.js
   Capa de persistencia sobre localStorage.
   Todas las claves usan el prefijo "scriptforge_".
   Ninguna funcion lanza excepciones hacia fuera: todo va
   envuelto en try/catch con fallback seguro.
   ============================================================ */

const SFStorage = (() => {
  const KEYS = {
    LEGAL: 'scriptforge_legal_accepted',
    CONFIG: 'scriptforge_config',
    HISTORY: 'scriptforge_history',
    WIZARD: 'scriptforge_last_wizard_state'
  };

  const MAX_HISTORY = 50;

  const DEFAULT_CONFIG = {
    skin: 'dark-pro',
    technician: '',
    client: '',
    logPath: '.\\logs',
    version: '1.0',
    autoElevate: true
  };

  function isAvailable() {
    try {
      const testKey = '__sf_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  function safeGet(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[SFStorage] Error leyendo', key, e);
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[SFStorage] Error guardando', key, e);
      return false;
    }
  }

  function safeRemove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('[SFStorage] Error eliminando', key, e);
      return false;
    }
  }

  // ---- Aviso legal ----
  function getLegalAccepted() {
    return safeGet(KEYS.LEGAL, null);
  }

  function setLegalAccepted() {
    return safeSet(KEYS.LEGAL, { accepted: true, date: new Date().toISOString() });
  }

  // ---- Configuracion ----
  function getConfig() {
    const stored = safeGet(KEYS.CONFIG, null);
    if (!stored) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...stored };
  }

  function setConfig(partialConfig) {
    const current = getConfig();
    const updated = { ...current, ...partialConfig };
    safeSet(KEYS.CONFIG, updated);
    return updated;
  }

  // ---- Historial ----
  function getHistory() {
    return safeGet(KEYS.HISTORY, []);
  }

  function addHistoryEntry(entry) {
    const history = getHistory();
    const record = {
      id: 'sf_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      timestamp: new Date().toISOString(),
      ...entry
    };
    history.unshift(record);
    while (history.length > MAX_HISTORY) history.pop();
    safeSet(KEYS.HISTORY, history);
    return record;
  }

  function getHistoryEntry(id) {
    return getHistory().find(item => item.id === id) || null;
  }

  function deleteHistoryEntry(id) {
    const history = getHistory().filter(item => item.id !== id);
    safeSet(KEYS.HISTORY, history);
    return history;
  }

  function clearHistory() {
    safeSet(KEYS.HISTORY, []);
    return [];
  }

  // ---- Estado de wizard a medias ----
  function getWizardState() {
    return safeGet(KEYS.WIZARD, null);
  }

  function setWizardState(state) {
    return safeSet(KEYS.WIZARD, state);
  }

  function clearWizardState() {
    return safeRemove(KEYS.WIZARD);
  }

  // ---- Reset total ----
  function resetAll() {
    safeRemove(KEYS.LEGAL);
    safeRemove(KEYS.CONFIG);
    safeRemove(KEYS.HISTORY);
    safeRemove(KEYS.WIZARD);
  }

  return {
    isAvailable,
    getLegalAccepted,
    setLegalAccepted,
    getConfig,
    setConfig,
    getHistory,
    addHistoryEntry,
    getHistoryEntry,
    deleteHistoryEntry,
    clearHistory,
    getWizardState,
    setWizardState,
    clearWizardState,
    resetAll,
    KEYS,
    MAX_HISTORY
  };
})();
