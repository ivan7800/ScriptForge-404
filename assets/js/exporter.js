/* ============================================================
   ScriptForge 404 - exporter.js
   Copia al portapapeles y descarga de archivos, 100% en cliente.
   ============================================================ */

const SFExporter = (() => {

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback para contextos sin Clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch (e) {
      console.warn('[SFExporter] Error copiando al portapapeles', e);
      return false;
    }
  }

  function downloadFile(filename, content, mime = 'text/plain') {
    try {
      const blob = new Blob([content], { type: mime + ';charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      return true;
    } catch (e) {
      console.warn('[SFExporter] Error descargando archivo', e);
      return false;
    }
  }

  /**
   * Descarga varios archivos en secuencia con un pequeño delay entre
   * cada uno, para evitar que el navegador bloquee descargas multiples.
   * files = [{ filename, content, mime }]
   */
  function downloadAll(files, delayMs = 350) {
    return new Promise((resolve) => {
      let index = 0;
      function next() {
        if (index >= files.length) {
          resolve(true);
          return;
        }
        const f = files[index];
        downloadFile(f.filename, f.content, f.mime);
        index++;
        setTimeout(next, delayMs);
      }
      next();
    });
  }

  return {
    copyToClipboard,
    downloadFile,
    downloadAll
  };
})();
