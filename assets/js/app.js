/* ============================================================
   ScriptForge 404 - app.js
   Bootstrap, estado global, routing entre pantallas y wizard.
   ============================================================ */

const SFApp = (() => {

  const APP_VERSION = '5.6 Auto-UAC Final';
  const PAGE_SIZE = 80;

  const SKINS = [
    { id: 'dark-pro', name: 'Dark Pro', desc: 'Oscuro tecnico equilibrado.' },
    { id: 'gold', name: 'Gold', desc: 'Premium dorado, ideal demo.' },
    { id: 'terminal', name: 'Terminal', desc: 'Verde consola clasico.' },
    { id: 'blue-sysadmin', name: 'Blue SysAdmin', desc: 'Azul corporativo IT.' },
    { id: 'red-alert', name: 'Red Alert', desc: 'Incidencias criticas.' },
    { id: 'midnight', name: 'Midnight', desc: 'Negro azulado elegante.' },
    { id: 'matrix', name: 'Matrix', desc: 'Cyber verde profundo.' },
    { id: 'violet', name: 'Violet Ops', desc: 'Morado moderno premium.' },
    { id: 'slate', name: 'Slate Light', desc: 'Claro sobrio para oficina.' },
    { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Alto contraste neon.' }
  ];

  const CATEGORY_ORDER = [
    'Base CAU', 'Diagnostico', 'Inventario', 'Limpieza', 'Rendimiento', 'Red', 'Unidades de red',
    'Office / Outlook', 'Office', 'Outlook', 'Teams', 'OneDrive', 'Citrix / VPN', 'Citrix',
    'Impresoras', 'Windows Update', 'Intune / Autopilot', 'Intune', 'SCCM', 'AD / Dominio',
    'Servicios', 'Registro', 'Seguridad', 'Certificados', 'Software', 'Permisos', 'Perfil de usuario',
    'Logs / Eventos', 'Logs CAU', 'Energia', 'Dispositivos', 'Navegadores', 'Usuarios',
    'Tickets CAU', 'Comunicaciones', 'Todo en uno', 'Exportacion', 'Backup', 'Tareas',
    'Sistema', 'Apps utiles', 'Personalizado'
  ];

  const state = {
    screen: 'landing',
    config: null,
    history: [],
    wizard: null,
    libraryFilter: { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE },
    helpOpen: false
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function getV5ProTemplates() {
    return SFTemplates.filter(t => t.id && t.id.startsWith('v5-pro-'));
  }

  function getRiskStats(list = SFTemplates) {
    return list.reduce((acc, t) => {
      acc[t.risk] = (acc[t.risk] || 0) + 1;
      return acc;
    }, { bajo: 0, medio: 0, alto: 0 });
  }

  function templateLevel(template) {
    const hay = [template.name, template.description, template.category, template.id].join(' ').toLowerCase();
    if (hay.includes('n3')) return 'N3';
    if (hay.includes('n2') || template.risk === 'alto' || template.requiresAdmin) return 'N2';
    return 'N1';
  }

  function templateTypeLabel(template) {
    if (template.id && template.id.startsWith('v5-pro-')) return 'V5 Pro';
    if (template.category === 'Comunicaciones' || template.category === 'Tickets CAU') return 'CAU';
    return 'Core';
  }

  function iconForCategory(category) {
    const map = {
      'Base CAU': '⌘', 'Diagnostico': '◇', 'Inventario': '▣', 'Limpieza': '✦', 'Rendimiento': '▰',
      'Red': '◎', 'Unidades de red': '⇄', 'Office / Outlook': '▤', 'Office': '▤', 'Outlook': '✉', 'Teams': '◈',
      'OneDrive': '☁', 'Citrix / VPN': '⇧', 'Citrix': '⇧', 'Impresoras': '▦', 'Windows Update': '⟳',
      'Intune / Autopilot': '⬡', 'Intune': '⬡', 'SCCM': '▧', 'AD / Dominio': '◉', 'Servicios': '⚙',
      'Registro': '⌁', 'Seguridad': '◆', 'Certificados': '▱', 'Software': '⬢', 'Permisos': '◇',
      'Perfil de usuario': '◌', 'Logs / Eventos': '≡', 'Logs CAU': '≡', 'Energia': '⏻', 'Dispositivos': '▣',
      'Navegadores': '◍', 'Tickets CAU': '✎', 'Comunicaciones': '✉', 'Todo en uno': '▥', 'Apps utiles': '↗'
    };
    return map[category] || '◆';
  }

  function renderMetric(label, value, detail, tone = '') {
    return `<div class="metric-card ${tone}"><span class="metric-card__label">${label}</span><strong>${value}</strong><small>${detail}</small></div>`;
  }

  function renderTemplateCard(t, action = `SFApp.startWizardWithTemplate('${t.id}')`) {
    const isPro = t.id && t.id.startsWith('v5-pro-');
    return `
      <button class="template-card ${isPro ? 'is-pro' : ''}" onclick="${action}">
        <span class="template-card__glow" aria-hidden="true"></span>
        <span class="template-card__icon">${iconForCategory(t.category)}</span>
        <span class="template-card__body">
          <span class="template-card__eyebrow">${escapeHtml(t.category)} · ${templateLevel(t)}</span>
          <span class="template-card__title">${escapeHtml(t.name)}</span>
          <span class="template-card__desc">${escapeHtml(t.description)}</span>
          <span class="template-card__meta">
            <span class="${SFSecurity.levelBadgeClass(t.risk)}">${SFSecurity.levelLabel(t.risk)}</span>
            <span class="tag tag-strong">${templateTypeLabel(t)}</span>
            ${t.requiresAdmin ? '<span class="tag">Admin</span>' : '<span class="tag">User</span>'}
          </span>
        </span>
      </button>`;
  }

  function $(sel) { return document.querySelector(sel); }

  function applySkin(skinId) {
    document.body.setAttribute('data-skin', skinId || 'dark-pro');
  }

  function toast(message) {
    let wrap = $('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      wrap.setAttribute('role', 'status');
      wrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  // ---------------------------------------------------------
  // Init
  // ---------------------------------------------------------
  function init() {
    state.config = SFStorage.getConfig();
    state.history = SFStorage.getHistory();
    applySkin(state.config.skin);
    registerServiceWorker();

    if (!SFStorage.isAvailable()) {
      toast('Aviso: localStorage no esta disponible. El historial no se guardara.');
    }

    const legal = SFStorage.getLegalAccepted();
    if (legal && legal.accepted) {
      state.screen = 'dashboard';
    } else {
      state.screen = 'landing';
    }
    render();
  }

  // ---------------------------------------------------------
  // Navegacion
  // ---------------------------------------------------------
  function goTo(screen) {
    state.screen = screen;
    window.scrollTo(0, 0);
    render();
  }

  function goDashboard() {
    state.wizard = null;
    goTo('dashboard');
  }

  function acceptLegal() {
    SFStorage.setLegalAccepted();
    goTo('dashboard');
  }

  // ---------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------
  function render() {
    const root = $('#app');
    if (state.screen === 'landing') {
      root.innerHTML = renderSkipLink() + renderLanding();
      return;
    }
    root.innerHTML = renderSkipLink() + renderTopbar() + `<main class="main main--control" id="main-content">${renderScreen()}</main>` + renderHelpModal();
  }

  function renderSkipLink() {
    return '<a class="skip-link" href="#main-content">Saltar al contenido principal</a>';
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (!/^https?:$/.test(window.location.protocol)) return;
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('[ScriptForge] Service worker no registrado:', err);
    });
  }

  function renderScreen() {
    switch (state.screen) {
      case 'dashboard': return renderDashboard();
      case 'wizard': return renderWizard();
      case 'history': return renderHistory();
      case 'library': return renderLibrary();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  }

  function renderTopbar() {
    const skin = SKINS.find(s => s.id === state.config.skin) || SKINS[0];
    const historyCount = SFStorage.getHistory().length;
    const v5Count = getV5ProTemplates().length;
    return `
    <header class="topbar control-topbar">
      <button class="topbar__brand brand-button" onclick="SFApp.goDashboard()" aria-label="Ir al dashboard">
        <span class="brand-orb" aria-hidden="true">SF</span>
        <span class="brand-copy"><strong>ScriptForge 404</strong><small>Control Center · CAU / Sistemas</small></span>
      </button>
      <div class="topbar__status" aria-label="Estado del proyecto">
        <span class="status-pill"><strong>${SFTemplates.length}</strong> plantillas</span>
        <span class="status-pill status-pill--pro"><strong>${v5Count}</strong> V5 Pro</span>
        <span class="status-pill">Skin: ${escapeHtml(skin.name)}</span>
      </div>
      <nav class="topbar__actions" aria-label="Acciones principales">
        <button class="btn btn-ghost btn-sm" onclick="SFApp.goDashboard()">Inicio</button>
        <button class="btn btn-ghost btn-sm" onclick="SFApp.goTo('library')">Biblioteca</button>
        <button class="btn btn-ghost btn-sm" onclick="SFApp.goTo('history')">Historial ${historyCount ? `<span class="nav-count">${historyCount}</span>` : ''}</button>
        <button class="btn btn-ghost btn-sm" onclick="window.open('apps-corporativas.html','_blank','noopener')">Apps</button>
        <button class="btn btn-ghost btn-sm" onclick="SFApp.goTo('settings')">Skins</button>
        <button class="btn btn-ghost btn-sm" onclick="SFApp.toggleHelp(true)">Ayuda</button>
      </nav>
    </header>`;
  }

  // ---------------------------------------------------------
  // Landing
  // ---------------------------------------------------------
  function renderLanding() {
    applySkin(state.config ? state.config.skin : 'dark-pro');
    const legal = SFStorage.getLegalAccepted();
    return `
    <main class="landing landing-premium" id="main-content">
      <div class="landing-bg" aria-hidden="true"></div>
      <section class="landing-shell">
        <div class="landing-panel landing-panel--hero">
          <div class="eyebrow">Control Center Premium · 100% local · GitHub Pages ready</div>
          <h1><span>ScriptForge</span> <strong>404</strong></h1>
          <p class="landing__tagline">Centro profesional para generar, auditar y exportar scripts BAT/PowerShell de soporte Windows, CAU y sistemas.</p>
          <div class="landing-actions">
            <button class="btn btn-primary btn-xl" onclick="SFApp.handleStart()">Crear script</button>
            <button class="btn btn-soft btn-xl" onclick="SFApp.handleStart(); setTimeout(()=>SFApp.goTo('library'),0)">Explorar biblioteca</button>
          </div>
          <div class="landing__meta">Sin backend · sin envío de datos · historial local · modo diagnóstico por defecto</div>
        </div>
        <div class="landing-panel landing-panel--stats">
          <div class="system-card__header"><span>Estado de la suite</span><b>ONLINE</b></div>
          <div class="metric-grid metric-grid--landing">
            ${renderMetric('Plantillas', SFTemplates.length, 'Mega Pack CAU')}
            ${renderMetric('V5 Pro', getV5ProTemplates().length, 'scripts críticos')}
            ${renderMetric('Formatos', 'BAT + PS1', 'README + checklist')}
            ${renderMetric('Seguridad', 'Riesgo', 'análisis integrado')}
          </div>
          <div class="quick-stack">
            <span>Accesos recomendados</span>
            <button onclick="SFApp.handleStart(); setTimeout(()=>SFApp.startWizardWithTemplate('v5-pro-01-diagnostico-rapido-pc'),0)">Diagnóstico rápido PC</button>
            <button onclick="SFApp.handleStart(); setTimeout(()=>SFApp.startWizardWithTemplate('v5-pro-05-mapear-unidades-red'),0)">Mapear unidades de red</button>
            <button onclick="SFApp.handleStart(); setTimeout(()=>SFApp.startWizardWithTemplate('v5-pro-09-reparar-boton-teams-outlook'),0)">Teams Meeting Outlook</button>
          </div>
        </div>
      </section>
    </main>
    ${!legal || !legal.accepted ? renderLegalModal() : ''}`;
  }

  function renderLegalModal() {
    return `
    <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <div class="modal">
        <h2 id="legal-title">Aviso legal y tecnico</h2>
        <p>Esta herramienta genera scripts de administracion para Windows. Revisa siempre el contenido antes de ejecutarlo. Usala solo en equipos donde tengas autorizacion. El autor no se responsabiliza de danos por uso indebido.</p>
        <label class="modal__checkbox">
          <input type="checkbox" id="legal-checkbox" />
          <span>He leido y entiendo el aviso anterior.</span>
        </label>
        <button class="btn btn-primary btn-block" id="legal-accept-btn" disabled onclick="SFApp.acceptLegal()">Aceptar y continuar</button>
      </div>
    </div>`;
  }

  function handleStart() {
    const legal = SFStorage.getLegalAccepted();
    if (legal && legal.accepted) {
      goTo('dashboard');
    } else {
      // El modal ya esta visible; enfocar checkbox
      const cb = $('#legal-checkbox');
      if (cb) cb.focus();
    }
  }

  // Delegacion para habilitar el boton de aceptar cuando se marca el checkbox
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'legal-checkbox') {
      const btn = $('#legal-accept-btn');
      if (btn) btn.disabled = !e.target.checked;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.helpOpen) toggleHelp(false);
  });

  // ---------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------
  function renderDashboard() {
    const recent = SFStorage.getHistory().slice(0, 3);
    const v5 = getV5ProTemplates();
    const risk = getRiskStats();
    const featuredIds = [
      'v5-pro-01-diagnostico-rapido-pc',
      'v5-pro-05-mapear-unidades-red',
      'v5-pro-04-reset-dns-winsock-tcpip',
      'v5-pro-09-reparar-boton-teams-outlook',
      'v5-pro-22-diagnostico-intune-autopilot'
    ];
    const featured = featuredIds.map(id => SFTemplates.find(t => t.id === id)).filter(Boolean);
    return `
    <section class="dashboard-hero">
      <div class="dashboard-hero__copy">
        <div class="eyebrow">Control Center Premium</div>
        <h1>Generador profesional de scripts Windows para CAU y sistemas.</h1>
        <p>Construye BAT, PS1, README, checklist e informe de riesgo desde una biblioteca técnica local, sin backend y preparada para GitHub Pages.</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-xl" onclick="SFApp.startWizard()">Nuevo script</button>
          <button class="btn btn-soft btn-xl" onclick="SFApp.goTo('library')">Explorar ${SFTemplates.length} plantillas</button>
          <button class="btn btn-ghost btn-xl" onclick="window.open('apps-corporativas.html','_blank','noopener')">Portal de apps</button>
        </div>
      </div>
      <div class="ops-panel">
        <div class="ops-panel__top"><span>ScriptForge Status</span><b>READY</b></div>
        <div class="ops-grid">
          ${renderMetric('Plantillas', SFTemplates.length, 'activas')}
          ${renderMetric('V5 Pro', v5.length, 'standalone')}
          ${renderMetric('Riesgo alto', risk.alto || 0, 'con confirmación', 'tone-danger')}
          ${renderMetric('Historial', SFStorage.getHistory().length, 'local')}
        </div>
      </div>
    </section>

    <section class="quick-actions">
      <button class="action-tile action-tile--primary" onclick="SFApp.startWizard()"><span>01</span><strong>Crear script</strong><small>Wizard guiado BAT/PS1</small></button>
      <button class="action-tile" onclick="SFApp.goTo('library')"><span>02</span><strong>Biblioteca</strong><small>Búsqueda + filtros CAU</small></button>
      <button class="action-tile" onclick="SFApp.goTo('history')"><span>03</span><strong>Historial</strong><small>Recargar trabajos recientes</small></button>
      <button class="action-tile" onclick="SFApp.goTo('settings')"><span>04</span><strong>Skins</strong><small>10 modos visuales</small></button>
    </section>

    <section class="section-head">
      <div><span class="eyebrow">V5 Pro destacadas</span><h2>Incidencias críticas de uso diario</h2></div>
      <button class="btn btn-sm" onclick="SFApp.goTo('library')">Ver todas</button>
    </section>
    <div class="template-grid template-grid--featured">
      ${featured.map(t => renderTemplateCard(t)).join('')}
    </div>

    <section class="dashboard-columns">
      <div class="panel panel-premium">
        <div class="panel-title-row"><h2>Centro de operaciones</h2><span class="tag tag-strong">Local</span></div>
        <div class="ops-list">
          <div><b>Modo seguro</b><span>standalone y plantillas críticas priorizan diagnóstico y confirmación.</span></div>
          <div><b>Exportación completa</b><span>BAT, PS1, README y checklist en segundos.</span></div>
          <div><b>CAU/N2</b><span>Teams, Outlook, Intune, SCCM, red, unidades, Citrix y Windows Update.</span></div>
        </div>
      </div>
      <div class="panel panel-premium">
        <div class="panel-title-row"><h2>Últimos scripts</h2>${recent.length ? '<span class="tag">recientes</span>' : ''}</div>
        ${recent.length ? recent.map(renderHistoryItem).join('') : `<div class="empty-state"><span class="empty-state__icon">▱</span>Aún no has generado scripts. Crea uno nuevo para llenar este panel.</div>`}
      </div>
    </section>
    `;
  }

  function renderHistoryItem(entry) {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleString('es-ES');
    return `
    <div class="history-item history-item--premium">
      <div>
        <div class="history-item__title">${escapeHtml(entry.templateName)} <span class="${SFSecurity.levelBadgeClass(entry.riskLevel)}">${SFSecurity.levelLabel(entry.riskLevel)}</span></div>
        <div class="history-item__meta">${escapeHtml(entry.category)} · ${escapeHtml(entry.scriptType.toUpperCase())} · ${dateStr}</div>
      </div>
      <div class="btn-group">
        <button class="btn btn-sm" onclick="SFApp.reloadHistoryEntry('${entry.id}')">Recargar</button>
        <button class="btn btn-sm btn-danger" aria-label="Eliminar del historial" onclick="SFApp.deleteHistoryEntry('${entry.id}')">Eliminar</button>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Historial (pantalla completa)
  // ---------------------------------------------------------
  function renderHistory() {
    const items = SFStorage.getHistory();
    return `
    <section class="page-header">
      <div><span class="eyebrow">Historial local</span><h1>Scripts generados</h1><p>Recarga, revisa o elimina trabajos guardados en este navegador.</p></div>
      ${items.length ? `<button class="btn btn-danger btn-sm" onclick="SFApp.confirmClearHistory()">Limpiar todo</button>` : ''}
    </section>
    <div class="panel panel-premium">
      ${items.length ? items.map(renderHistoryItem).join('') : `
      <div class="empty-state">
        <span class="empty-state__icon">▱</span>
        Aún no has generado ningún script. El historial se llenará automáticamente cuando generes uno.
      </div>`}
    </div>
    `;
  }

  function confirmClearHistory() {
    if (confirm('¿Seguro que quieres borrar todo el historial? Esta accion no se puede deshacer.')) {
      SFStorage.clearHistory();
      toast('Historial borrado.');
      render();
    }
  }

  function deleteHistoryEntry(id) {
    SFStorage.deleteHistoryEntry(id);
    toast('Entrada eliminada del historial.');
    render();
  }

  function reloadHistoryEntry(id) {
    const entry = SFStorage.getHistoryEntry(id);
    if (!entry) { toast('No se encontro esa entrada.'); return; }
    const template = SFTemplates.find(t => t.id === entry.templateId);
    if (!template) { toast('La plantilla original ya no existe.'); return; }
    state.wizard = {
      step: 5,
      scriptType: entry.scriptType,
      templateId: entry.templateId,
      fieldValues: { ...entry.fieldValues },
      options: { ...entry.options },
      generated: { bat: entry.bat, ps1: entry.ps1, readme: entry.readme, checklist: entry.checklist, riskInfo: { level: entry.riskLevel, reasons: entry.riskReasons || [], requiresConfirmation: entry.riskLevel === 'alto', requiresAdmin: template.requiresAdmin } },
      activeTab: entry.scriptType === 'ps1' ? 'ps1' : 'bat',
      confirmedRisk: true
    };
    goTo('wizard');
  }

  // ---------------------------------------------------------
  // Biblioteca de plantillas
  // ---------------------------------------------------------
  function renderLibrary() {
    if (!state.libraryFilter) state.libraryFilter = { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE };
    const filter = {
      q: state.libraryFilter.q || '',
      category: state.libraryFilter.category || 'all',
      risk: state.libraryFilter.risk || 'all',
      limit: Number(state.libraryFilter.limit) || PAGE_SIZE
    };
    const cats = ['all', ...getOrderedCategories()];
    const filtered = SFTemplates.filter(t => templateMatchesFilter(t, filter));
    const visible = filtered.slice(0, filter.limit);
    const v5 = getV5ProTemplates();
    const topCats = ['all', 'V5 Pro', 'Red', 'Unidades de red', 'Office / Outlook', 'Teams', 'Intune / Autopilot', 'SCCM', 'Citrix / VPN', 'Impresoras'];
    return `
    <section class="page-header page-header--library">
      <div><span class="eyebrow">Biblioteca técnica</span><h1>Catálogo premium de plantillas</h1><p>${SFTemplates.length} plantillas para CAU, soporte Windows y sistemas. Busca por incidencia, tecnología o riesgo.</p></div>
      <button class="btn btn-primary" onclick="SFApp.startWizard()">Nuevo script</button>
    </section>
    <div class="panel panel-premium library-console">
      <div class="quick-filter-row" role="list" aria-label="Filtros rápidos">
        ${topCats.map(c => {
          const active = (c === 'all' && filter.category === 'all' && !filter.q) || (c === 'V5 Pro' && filter.q === 'v5 pro') || filter.category === c;
          const action = c === 'all' ? `SFApp.setLibraryFilter('reset','all')` : (c === 'V5 Pro' ? `SFApp.setLibraryFilter('q','v5 pro')` : `SFApp.setLibraryFilter('category','${c}')`);
          return `<button class="chip-filter ${active ? 'is-active' : ''}" onclick="${action}">${c === 'all' ? 'Todas' : c}</button>`;
        }).join('')}
      </div>
      <div class="grid grid-3 mb-16">
        <div class="field field-search">
          <label for="library-search">Buscar</label>
          <input class="input" id="library-search" type="text" value="${escapeHtml(filter.q || '')}" placeholder="Teams, unidad, SCCM, proxy, Outlook..." oninput="SFApp.setLibraryFilter('q', this.value)" />
        </div>
        <div class="field">
          <label for="library-category">Categoría</label>
          <select id="library-category" onchange="SFApp.setLibraryFilter('category', this.value)">
            ${cats.map(c => `<option value="${escapeHtml(c)}" ${filter.category === c ? 'selected' : ''}>${c === 'all' ? 'Todas las categorías' : escapeHtml(c)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="library-risk">Riesgo</label>
          <select id="library-risk" onchange="SFApp.setLibraryFilter('risk', this.value)">
            <option value="all" ${filter.risk === 'all' ? 'selected' : ''}>Todos los riesgos</option>
            <option value="bajo" ${filter.risk === 'bajo' ? 'selected' : ''}>Riesgo bajo</option>
            <option value="medio" ${filter.risk === 'medio' ? 'selected' : ''}>Riesgo medio</option>
            <option value="alto" ${filter.risk === 'alto' ? 'selected' : ''}>Riesgo alto</option>
          </select>
        </div>
      </div>
      <div class="stats-row"><span><strong>${filtered.length}</strong> resultados</span><span><strong>${Math.min(visible.length, filtered.length)}</strong> visibles</span><span><strong>${v5.length}</strong> V5 Pro</span><span><strong>${getOrderedCategories().length}</strong> categorías</span></div>
    </div>
    ${filtered.length ? `<div class="template-grid">${visible.map(t => renderTemplateCard(t)).join('')}</div>${visible.length < filtered.length ? `<div class="load-more-row"><button class="btn btn-soft" onclick="SFApp.loadMoreLibrary()">Mostrar ${Math.min(PAGE_SIZE, filtered.length - visible.length)} más</button><span>${visible.length} de ${filtered.length} visibles</span></div>` : ''}` : '<div class="empty-state"><span class="empty-state__icon">◇</span>No hay plantillas que coincidan con el filtro.</div>'}
    `;
  }

  function setLibraryFilter(key, value) {
    if (!state.libraryFilter) state.libraryFilter = { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE };
    const activeId = document.activeElement ? document.activeElement.id : null;
    const selStart = document.activeElement && typeof document.activeElement.selectionStart === 'number' ? document.activeElement.selectionStart : null;
    const selEnd = document.activeElement && typeof document.activeElement.selectionEnd === 'number' ? document.activeElement.selectionEnd : null;
    if (key === 'reset') {
      state.libraryFilter = { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE };
    } else if (key === 'category' && value === 'V5 Pro') {
      state.libraryFilter.q = 'v5 pro';
      state.libraryFilter.category = 'all';
    } else {
      state.libraryFilter[key] = value;
      if (key !== 'limit') state.libraryFilter.limit = PAGE_SIZE;
      if (key === 'category' && value !== 'all') state.libraryFilter.q = state.libraryFilter.q === 'v5 pro' ? '' : state.libraryFilter.q;
    }
    render();
    if (activeId) {
      setTimeout(() => {
        const el = document.getElementById(activeId);
        if (el) {
          el.focus();
          if (selStart !== null && typeof el.setSelectionRange === 'function') el.setSelectionRange(selStart, selEnd);
        }
      }, 0);
    }
  }

  function loadMoreLibrary() {
    if (!state.libraryFilter) state.libraryFilter = { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE };
    state.libraryFilter.limit = (Number(state.libraryFilter.limit) || PAGE_SIZE) + PAGE_SIZE;
    render();
  }

  // ---------------------------------------------------------
  // Configuracion
  // ---------------------------------------------------------
  function renderSettings() {
    const cfg = state.config;
    return `
    <h1>Configuracion</h1>
    <div class="panel mb-16">
      <h3>Skin visual</h3>
      <p class="text-dim mb-16">El tema se guarda en este navegador y se comparte con el portal de Apps utiles.</p>
      <div class="skin-grid">
        ${SKINS.map(s => `
          <button class="skin-card ${cfg.skin === s.id ? 'is-active' : ''}" data-preview-skin="${s.id}" onclick="SFApp.setSkin('${s.id}')" aria-pressed="${cfg.skin === s.id ? 'true' : 'false'}">
            <span class="skin-card__preview"><i></i><i></i><i></i></span>
            <span class="skin-card__name">${s.name}</span>
            <span class="skin-card__desc">${s.desc}</span>
          </button>
        `).join('')}
      </div>
    </div>
    <div class="panel mb-16">
      <h3>Valores por defecto</h3>
      <div class="field">
        <label for="cfg-technician">Nombre de tecnico por defecto</label>
        <input class="input" id="cfg-technician" value="${escapeHtml(cfg.technician)}" />
      </div>
      <div class="field">
        <label for="cfg-client">Cliente/equipo por defecto</label>
        <input class="input" id="cfg-client" value="${escapeHtml(cfg.client)}" />
      </div>
      <div class="field">
        <label for="cfg-logpath">Ruta de log por defecto</label>
        <input class="input" id="cfg-logpath" value="${escapeHtml(cfg.logPath)}" />
      </div>
      <button class="btn btn-primary" onclick="SFApp.saveSettingsForm()">Guardar cambios</button>
    </div>
    <div class="panel mb-16">
      <h3>Aviso legal</h3>
      <p>Puedes volver a leer el aviso legal y tecnico mostrado al iniciar la app.</p>
      <button class="btn" onclick="SFApp.toggleHelp(true)">Ver información y aviso legal</button>
    </div>
    <div class="panel">
      <h3>Zona de riesgo</h3>
      <p>Esto borra permanentemente el historial, la configuracion y la aceptacion del aviso legal guardados en este navegador.</p>
      <button class="btn btn-danger" onclick="SFApp.confirmResetAll()">Reset total de la app</button>
    </div>
    `;
  }

  function setSkin(skinId) {
    state.config = SFStorage.setConfig({ skin: skinId });
    applySkin(skinId);
    render();
  }

  function saveSettingsForm() {
    const technician = $('#cfg-technician').value.trim();
    const client = $('#cfg-client').value.trim();
    const logPath = $('#cfg-logpath').value.trim() || '.\\logs';
    state.config = SFStorage.setConfig({ technician, client, logPath });
    toast('Configuracion guardada.');
    render();
  }

  function confirmResetAll() {
    if (confirm('¿Seguro que quieres resetear toda la app? Se borrara historial, configuracion y aviso legal aceptado.')) {
      SFStorage.resetAll();
      state.wizard = null;
      state.config = SFStorage.getConfig();
      toast('Aplicacion reseteada.');
      goTo('landing');
    }
  }

  // ---------------------------------------------------------
  // Modal de ayuda / acerca de
  // ---------------------------------------------------------
  function toggleHelp(open) {
    state.helpOpen = open;
    render();
  }

  function renderHelpModal() {
    if (!state.helpOpen) return '';
    return `
    <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="help-title" onclick="if(event.target===this) SFApp.toggleHelp(false)">
      <div class="modal">
        <h2 id="help-title">Acerca de ScriptForge 404</h2>
        <p><strong>Version:</strong> ${APP_VERSION}</p>
        <p>Generador de scripts profesionales de administracion Windows (.BAT/.PS1), 100% estatico, sin backend y sin envio de datos a ningun servidor.</p>
        <p><strong>Aviso legal:</strong> esta herramienta genera scripts de administracion para Windows. Revisa siempre el contenido antes de ejecutarlo. Usala solo en equipos donde tengas autorizacion. El autor no se responsabiliza de danos por uso indebido.</p>
        <p class="text-faint">El motor de analisis de riesgo es una ayuda heuristica y no sustituye la revision humana del script.</p>
        <button class="btn btn-primary btn-block" onclick="SFApp.toggleHelp(false)">Cerrar</button>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Wizard: estado y arranque
  // ---------------------------------------------------------
  const STEP_LABELS = ['Tipo', 'Categoria', 'Opciones', 'Seguridad', 'Generar', 'Riesgo', 'Exportar'];

  function defaultWizardOptions() {
    const cfg = state.config;
    return {
      scriptType: 'both',
      createLog: true,
      logPath: cfg.logPath || '.\\logs',
      dryRun: false,
      silent: false,
      confirmDangerous: true,
      comments: true,
      pauseAtEnd: true,
      version: cfg.version || '1.0',
      technician: cfg.technician || '',
      client: cfg.client || '',
      autoElevate: cfg.autoElevate !== false
    };
  }

  function fieldDefaults(template) {
    const values = {};
    (template.fields || []).forEach(f => { values[f.key] = f.default; });
    return values;
  }

  function getCurrentTemplate() {
    if (!state.wizard || !state.wizard.templateId) return null;
    return SFTemplates.find(t => t.id === state.wizard.templateId) || null;
  }
  function getOrderedCategories() {
    const available = [...new Set(SFTemplates.map(t => t.category))];
    const ordered = CATEGORY_ORDER.filter(c => available.includes(c));
    const extras = available.filter(c => !ordered.includes(c)).sort((a, b) => a.localeCompare(b));
    return [...ordered, ...extras];
  }

  function templateMatchesFilter(template, filter) {
    const q = String((filter && filter.q) || '').toLowerCase().trim();
    const cat = (filter && filter.category) || 'all';
    const risk = (filter && filter.risk) || 'all';
    const haystack = [template.id, template.name, template.category, template.description, template.risk, templateTypeLabel(template)]
      .join(' ')
      .toLowerCase();
    return (cat === 'all' || template.category === cat)
      && (risk === 'all' || template.risk === risk)
      && (!q || haystack.includes(q));
  }


  function startWizard() {
    state.wizard = {
      step: 1,
      templateId: null,
      fieldValues: {},
      options: defaultWizardOptions(),
      generated: null,
      activeTab: 'bat',
      confirmedRisk: false,
      templateFilter: { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE }
    };
    goTo('wizard');
  }

  function startWizardWithTemplate(templateId) {
    const template = SFTemplates.find(t => t.id === templateId);
    if (!template) { toast('Plantilla no encontrada.'); return; }
    state.wizard = {
      step: 3,
      templateId: templateId,
      fieldValues: fieldDefaults(template),
      options: defaultWizardOptions(),
      generated: null,
      activeTab: 'bat',
      confirmedRisk: false,
      templateFilter: { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE }
    };
    goTo('wizard');
  }

  function cancelWizard() {
    if (confirm('¿Seguro que quieres cancelar? Se perdera el progreso de este script (el historial no se ve afectado).')) {
      goDashboard();
    }
  }

  function wizardNext() {
    const next = Math.min(7, state.wizard.step + 1);
    if (canNavigateToStep(next)) state.wizard.step = next;
    render();
  }
  function wizardBack() { state.wizard.step = Math.max(1, state.wizard.step - 1); render(); }
  function wizardGoStep(n) {
    if (!canNavigateToStep(n)) { toast('Completa primero los pasos anteriores.'); return; }
    state.wizard.step = n;
    render();
  }
  function canNavigateToStep(n) {
    const w = state.wizard;
    if (!w) return false;
    if (n <= 2) return true;
    if (n <= 4) return !!w.templateId;
    if (n >= 5) return !!w.generated;
    return false;
  }

  // ---------------------------------------------------------
  // Wizard: render principal + stepper
  // ---------------------------------------------------------
  function renderWizard() {
    const w = state.wizard;
    if (!w) return '<div class="empty-state">No hay ningún script en curso. <button class="btn mt-16" onclick="SFApp.startWizard()">Empezar uno nuevo</button></div>';
    const template = getCurrentTemplate();
    return `
      <section class="wizard-layout">
        <aside class="wizard-sidebar">
          <div class="wizard-sidebar__brand"><span>Control Flow</span><strong>${w.step}/7</strong></div>
          ${renderStepper(w.step)}
          <div class="wizard-summary">
            <span class="eyebrow">Selección actual</span>
            <strong>${template ? escapeHtml(template.name) : 'Sin plantilla'}</strong>
            <small>${template ? `${escapeHtml(template.category)} · ${SFSecurity.levelLabel(template.risk)}` : 'Elige tipo y categoría para continuar.'}</small>
          </div>
        </aside>
        <section class="wizard-workspace">
          ${renderWizardStep(w)}
        </section>
      </section>
    `;
  }

  function renderStepper(current) {
    return `<nav class="stepper stepper--vertical" aria-label="Pasos del asistente">
      ${STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const allowed = canNavigateToStep(n);
        const cls = n === current ? 'is-active' : (n < current ? 'is-done' : '');
        return `<button class="stepper__item ${cls} ${allowed ? '' : 'is-disabled'}" ${allowed ? '' : 'disabled aria-disabled="true"'} onclick="SFApp.wizardGoStep(${n})"><span>${String(n).padStart(2, '0')}</span><strong>${label}</strong></button>`;
      }).join('')}
    </nav>`;
  }

  function renderWizardStep(w) {
    switch (w.step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      default: return '';
    }
  }

  // ---- Paso 1: tipo de script ----
  function renderStep1() {
    const w = state.wizard;
    const options = [
      { id: 'bat', label: 'Solo BAT', desc: 'Lanzador rápido, compatibilidad máxima y ejecución simple.', icon: 'BAT' },
      { id: 'ps1', label: 'Solo PS1', desc: 'Lógica avanzada, logs, diagnóstico y automatización seria.', icon: 'PS1' },
      { id: 'both', label: 'Ambos', desc: 'Genera BAT y PS1 sincronizados para entregar paquete completo.', icon: 'ALL' }
    ];
    return `
    <div class="panel panel-premium step-panel">
      <div class="step-header"><span class="eyebrow">Paso 1</span><h2>Formato de salida</h2><p>Define si necesitas lanzador rápido, PowerShell avanzado o ambos.</p></div>
      <div class="choice-grid">
        ${options.map(o => `
          <button class="choice-card ${w.options.scriptType === o.id ? 'is-active' : ''}" onclick="SFApp.setScriptType('${o.id}')">
            <span class="choice-card__icon">${o.icon}</span>
            <strong>${o.label}</strong>
            <small>${o.desc}</small>
          </button>
        `).join('')}
      </div>
      <div class="footer-actions">
        <button class="btn btn-ghost" onclick="SFApp.cancelWizard()">Cancelar</button>
        <button class="btn btn-primary" onclick="SFApp.wizardNext()">Siguiente</button>
      </div>
    </div>`;
  }

  function setScriptType(type) {
    state.wizard.options.scriptType = type;
    render();
  }

  // ---- Paso 2: categoria / plantilla ----
  function renderStep2() {
    const w = state.wizard;
    const filter = w.templateFilter || { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE };
    filter.limit = Number(filter.limit) || PAGE_SIZE;
    const cats = ['all', ...getOrderedCategories()];
    const risks = [
      { id: 'all', label: 'Todos los riesgos' },
      { id: 'bajo', label: 'Riesgo bajo' },
      { id: 'medio', label: 'Riesgo medio' },
      { id: 'alto', label: 'Riesgo alto' }
    ];
    const quick = ['v5 pro', 'Teams', 'Outlook', 'unidad', 'SCCM', 'Intune', 'Citrix', 'proxy', 'impresora'];
    const filtered = SFTemplates.filter(t => templateMatchesFilter(t, filter));
    const visible = filtered.slice(0, filter.limit);
    return `
    <div class="panel panel-premium step-panel">
      <div class="step-header"><span class="eyebrow">Paso 2</span><h2>Biblioteca de plantillas</h2><p>${SFTemplates.length} plantillas disponibles. Usa búsqueda, chips y filtros para localizar la incidencia exacta.</p></div>
      <div class="quick-filter-row">
        ${quick.map(q => `<button class="chip-filter ${(filter.q || '').toLowerCase() === q.toLowerCase() ? 'is-active' : ''}" onclick="SFApp.setWizardTemplateFilter('q','${q}')">${q}</button>`).join('')}
      </div>
      <div class="grid grid-3 mb-16">
        <div class="field field-search">
          <label for="wizard-template-search">Buscar plantilla</label>
          <input class="input" id="wizard-template-search" type="text" value="${escapeHtml(filter.q || '')}" placeholder="Teams, unidad, SCCM, proxy, Outlook..." oninput="SFApp.setWizardTemplateFilter('q', this.value)" />
        </div>
        <div class="field">
          <label for="wizard-template-category">Categoría</label>
          <select id="wizard-template-category" onchange="SFApp.setWizardTemplateFilter('category', this.value)">
            ${cats.map(c => `<option value="${escapeHtml(c)}" ${filter.category === c ? 'selected' : ''}>${c === 'all' ? 'Todas las categorías' : escapeHtml(c)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="wizard-template-risk">Riesgo</label>
          <select id="wizard-template-risk" onchange="SFApp.setWizardTemplateFilter('risk', this.value)">
            ${risks.map(r => `<option value="${r.id}" ${filter.risk === r.id ? 'selected' : ''}>${r.label}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="stats-row"><span><strong>${filtered.length}</strong> resultados</span><span><strong>${visible.length}</strong> visibles</span><span><strong>${getV5ProTemplates().length}</strong> V5 Pro</span><span><strong>${getOrderedCategories().length}</strong> categorías</span></div>
      ${filtered.length ? `<div class="template-grid mt-16">
        ${visible.map(t => renderTemplateCard(t, `SFApp.selectTemplate('${t.id}')`)).join('')}
      </div>${visible.length < filtered.length ? `<div class="load-more-row"><button class="btn btn-soft" onclick="SFApp.loadMoreWizardTemplates()">Mostrar ${Math.min(PAGE_SIZE, filtered.length - visible.length)} más</button><span>${visible.length} de ${filtered.length} visibles</span></div>` : ''}` : `<div class="empty-state">No hay plantillas con esos filtros. Prueba con otra palabra o categoría.</div>`}
      <div class="footer-actions">
        <button class="btn btn-ghost" onclick="SFApp.wizardBack()">Atrás</button>
        <button class="btn btn-ghost" onclick="SFApp.cancelWizard()">Cancelar</button>
      </div>
    </div>`;
  }

  function setWizardTemplateFilter(key, value) {
    if (!state.wizard.templateFilter) state.wizard.templateFilter = { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE };
    const activeId = document.activeElement ? document.activeElement.id : null;
    const selStart = document.activeElement && typeof document.activeElement.selectionStart === 'number' ? document.activeElement.selectionStart : null;
    const selEnd = document.activeElement && typeof document.activeElement.selectionEnd === 'number' ? document.activeElement.selectionEnd : null;
    state.wizard.templateFilter[key] = value;
    if (key !== 'limit') state.wizard.templateFilter.limit = PAGE_SIZE;
    render();
    if (activeId) {
      setTimeout(() => {
        const el = document.getElementById(activeId);
        if (el) {
          el.focus();
          if (selStart !== null && typeof el.setSelectionRange === 'function') el.setSelectionRange(selStart, selEnd);
        }
      }, 0);
    }
  }

  function loadMoreWizardTemplates() {
    if (!state.wizard) return;
    if (!state.wizard.templateFilter) state.wizard.templateFilter = { q: '', category: 'all', risk: 'all', limit: PAGE_SIZE };
    state.wizard.templateFilter.limit = (Number(state.wizard.templateFilter.limit) || PAGE_SIZE) + PAGE_SIZE;
    render();
  }

  function selectTemplate(templateId) {
    const template = SFTemplates.find(t => t.id === templateId);
    state.wizard.templateId = templateId;
    state.wizard.fieldValues = fieldDefaults(template);
    state.wizard.confirmedRisk = false;
    wizardNext();
  }

  // ---- Paso 3: opciones (campos de plantilla + opciones globales) ----
  function renderFieldInput(field, value) {
    const id = 'field-' + field.key;
    if (field.type === 'checkbox') {
      return `
      <div class="field">
        <label class="checkbox-row" for="${id}">
          <input type="checkbox" id="${id}" ${value ? 'checked' : ''} onchange="SFApp.setFieldValue('${field.key}', this.checked)" />
          <span>${escapeHtml(field.label)}</span>
        </label>
      </div>`;
    }
    if (field.type === 'select') {
      return `
      <div class="field">
        <label for="${id}">${escapeHtml(field.label)}</label>
        <select id="${id}" onchange="SFApp.setFieldValue('${field.key}', this.value)">
          ${field.options.map(o => `<option value="${escapeHtml(o)}" ${value === o ? 'selected' : ''}>${escapeHtml(o)}</option>`).join('')}
        </select>
      </div>`;
    }
    if (field.type === 'textarea') {
      return `
      <div class="field">
        <label for="${id}">${escapeHtml(field.label)}</label>
        <textarea id="${id}" onchange="SFApp.setFieldValue('${field.key}', this.value)">${escapeHtml(value || '')}</textarea>
      </div>`;
    }
    return `
    <div class="field">
      <label for="${id}">${escapeHtml(field.label)}</label>
      <input class="input" type="${field.type === 'number' ? 'number' : 'text'}" id="${id}" value="${escapeHtml(value || '')}" onchange="SFApp.setFieldValue('${field.key}', this.value)" />
    </div>`;
  }

  function renderStep3() {
    const w = state.wizard;
    const template = getCurrentTemplate();
    if (!template) return '<div class="empty-state">Selecciona primero una plantilla. <button class="btn mt-16" onclick="SFApp.wizardGoStep(2)">Volver a categorías</button></div>';
    const opts = w.options;
    return `
    <div class="studio-grid">
      <div class="panel panel-premium step-panel">
        <div class="step-header"><span class="eyebrow">Paso 3</span><h2>Configuración del script</h2><p>${escapeHtml(template.name)} — ${escapeHtml(template.description)}</p></div>
        ${(template.fields || []).length ? `<h3 class="subsection-title">Opciones específicas</h3>${template.fields.map(f => renderFieldInput(f, w.fieldValues[f.key])).join('')}` : '<p class="text-faint">Esta plantilla no tiene opciones específicas.</p>'}
      </div>
      <div class="panel panel-premium side-config">
        <div class="panel-title-row"><h3>Opciones globales</h3><span class="tag tag-strong">Perfil</span></div>
        <div class="field"><label for="opt-technician">Nombre del técnico</label><input class="input" id="opt-technician" value="${escapeHtml(opts.technician)}" onchange="SFApp.setOption('technician', this.value)" /></div>
        <div class="field"><label for="opt-client">Cliente / equipo</label><input class="input" id="opt-client" value="${escapeHtml(opts.client)}" onchange="SFApp.setOption('client', this.value)" /></div>
        <div class="field"><label for="opt-version">Versión del script</label><input class="input" id="opt-version" value="${escapeHtml(opts.version)}" onchange="SFApp.setOption('version', this.value)" /></div>
        <div class="toggle-stack">
          <label class="switch-row"><input type="checkbox" ${opts.createLog ? 'checked' : ''} onchange="SFApp.setOption('createLog', this.checked)" /><span>Crear log</span></label>
          ${opts.createLog ? `<div class="field"><label for="opt-logpath">Ruta de log</label><input class="input" id="opt-logpath" value="${escapeHtml(opts.logPath)}" onchange="SFApp.setOption('logPath', this.value)" /></div>` : ''}
          <label class="switch-row"><input type="checkbox" ${opts.dryRun ? 'checked' : ''} onchange="SFApp.setOption('dryRun', this.checked)" /><span>Dry-run / simulación</span></label>
          <label class="switch-row"><input type="checkbox" ${opts.silent ? 'checked' : ''} onchange="SFApp.setOption('silent', this.checked)" /><span>Modo silencioso</span></label>
          <label class="switch-row"><input type="checkbox" ${opts.comments ? 'checked' : ''} onchange="SFApp.setOption('comments', this.checked)" /><span>Comentarios y cabecera</span></label>
          <label class="switch-row"><input type="checkbox" ${opts.pauseAtEnd ? 'checked' : ''} onchange="SFApp.setOption('pauseAtEnd', this.checked)" /><span>Pausa al final</span></label>
          <label class="switch-row"><input type="checkbox" ${opts.confirmDangerous ? 'checked' : ''} onchange="SFApp.setOption('confirmDangerous', this.checked)" /><span>Confirmar riesgo alto</span></label>
          <label class="switch-row ${!template.requiresAdmin ? 'is-muted' : ''}"><input type="checkbox" ${opts.autoElevate ? 'checked' : ''} ${!template.requiresAdmin ? 'disabled' : ''} onchange="SFApp.setOption('autoElevate', this.checked)" /><span>Autoelevar con UAC si requiere administrador</span></label>
          <p class="text-faint">La autoelevación solo se aplica a plantillas marcadas como Admin. Si el usuario cancela UAC, el script se detiene sin ejecutar cambios.</p>
        </div>
      </div>
    </div>
    <div class="footer-actions">
      <button class="btn btn-ghost" onclick="SFApp.wizardGoStep(2)">Atrás</button>
      <button class="btn btn-ghost" onclick="SFApp.cancelWizard()">Cancelar</button>
      <button class="btn btn-primary" onclick="SFApp.wizardNext()">Siguiente</button>
    </div>`;
  }

  function setFieldValue(key, value) {
    state.wizard.fieldValues[key] = value;
    render();
  }

  function setOption(key, value) {
    state.wizard.options[key] = value;
    render();
  }

  // ---- Paso 4: seguridad y permisos ----
  function renderStep4() {
    const w = state.wizard;
    const template = getCurrentTemplate();
    if (!template) return '<div class="empty-state">Selecciona primero una plantilla.</div>';
    const riskInfo = SFSecurity.analyzeRisk(template, w.fieldValues);
    const needsConfirm = riskInfo.requiresConfirmation && w.options.confirmDangerous !== false;
    return `
    <div class="panel panel-premium step-panel security-panel">
      <div class="step-header"><span class="eyebrow">Paso 4</span><h2>Seguridad y permisos</h2><p>Revisión previa antes de generar. El análisis es orientativo y no sustituye la revisión humana.</p></div>
      <div class="security-summary">
        <div><span class="${SFSecurity.levelBadgeClass(riskInfo.level)}">${SFSecurity.levelLabel(riskInfo.level)}</span><strong>Nivel de riesgo</strong></div>
        <div><span class="tag ${template.requiresAdmin ? 'tag-danger' : 'tag-strong'}">${template.requiresAdmin ? (w.options.autoElevate ? 'Admin + Auto-UAC' : 'Admin manual') : 'Usuario'}</span><strong>Permisos</strong></div>
        <div><span class="tag">${templateLevel(template)}</span><strong>Nivel CAU</strong></div>
      </div>
      <div class="risk-meter level-${riskInfo.level}"><span></span><span></span><span></span></div>
      <div class="studio-grid">
        <div>
          <h3 class="subsection-title">Qué hace este script</h3>
          ${riskInfo.reasons.length ? `<ul class="checklist-list">${riskInfo.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : '<p class="text-dim">No se han detectado acciones de riesgo relevantes.</p>'}
        </div>
        <div>
          ${(template.checklistPre || []).length ? `<h3 class="subsection-title">Checklist previo</h3><ul class="checklist-list">${template.checklistPre.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>` : '<p class="text-faint">Sin checklist previo específico.</p>'}
        </div>
      </div>
      ${needsConfirm ? `
      <div class="danger-confirm mt-16">
        <label class="checkbox-row">
          <input type="checkbox" ${w.confirmedRisk ? 'checked' : ''} onchange="SFApp.setConfirmedRisk(this.checked)" />
          <span>Confirmo que he revisado el análisis de riesgo y quiero continuar con la generación de este script de <strong>riesgo alto</strong>.</span>
        </label>
      </div>` : ''}
      <div class="footer-actions">
        <button class="btn btn-ghost" onclick="SFApp.wizardGoStep(3)">Atrás</button>
        <button class="btn btn-ghost" onclick="SFApp.cancelWizard()">Cancelar</button>
        <button class="btn btn-primary" ${needsConfirm && !w.confirmedRisk ? 'disabled' : ''} onclick="SFApp.generateScript()">Generar script</button>
      </div>
    </div>`;
  }

  function setConfirmedRisk(val) {
    state.wizard.confirmedRisk = val;
    render();
  }

  // ---- Generacion (paso 4 -> 5) ----
  function generateScript() {
    const w = state.wizard;
    const template = getCurrentTemplate();
    if (!template) { toast('Selecciona una plantilla primero.'); return; }
    const result = SFGenerator.generateAll(template, w.fieldValues, w.options);
    w.generated = result;
    w.activeTab = w.options.scriptType === 'ps1' ? 'ps1' : 'bat';

    SFStorage.addHistoryEntry({
      templateId: template.id,
      templateName: template.name,
      category: template.category,
      scriptType: w.options.scriptType,
      riskLevel: result.riskInfo.level,
      riskReasons: result.riskInfo.reasons,
      fieldValues: { ...w.fieldValues },
      options: { ...w.options },
      bat: result.bat || null,
      ps1: result.ps1 || null,
      readme: result.readme,
      checklist: result.checklist
    });

    w.step = 5;
    render();
    toast('Script generado y guardado en el historial.');
  }

  // ---- Paso 5: preview / generacion ----
  function renderStep5() {
    const w = state.wizard;
    const template = getCurrentTemplate();
    if (!w.generated) return '<div class="empty-state">Aún no se ha generado nada. <button class="btn mt-16" onclick="SFApp.wizardGoStep(4)">Volver a seguridad</button></div>';
    const tabs = [];
    if (w.generated.bat) tabs.push({ id: 'bat', label: '.BAT' });
    if (w.generated.ps1) tabs.push({ id: 'ps1', label: '.PS1' });
    tabs.push({ id: 'readme', label: 'README' });
    tabs.push({ id: 'checklist', label: 'Checklist' });
    const activeContent = w.generated[w.activeTab] || '';
    const lineCount = activeContent ? activeContent.split(/\r?\n/).length : 0;
    return `
    <div class="generation-studio">
      <div class="panel panel-premium studio-info">
        <div class="step-header"><span class="eyebrow">Paso 5</span><h2>Generation Studio</h2><p>${escapeHtml(template ? template.name : '')}</p></div>
        <div class="script-status-grid">
          <div><span class="${SFSecurity.levelBadgeClass(w.generated.riskInfo.level)}">${SFSecurity.levelLabel(w.generated.riskInfo.level)}</span><small>Riesgo</small></div>
          <div><span class="tag tag-strong">${w.options.scriptType.toUpperCase()}</span><small>Salida</small></div>
          <div><span class="tag">${lineCount} líneas</span><small>${w.activeTab.toUpperCase()}</small></div>
          <div><span class="tag ${w.options.dryRun ? 'tag-strong' : ''}">${w.options.dryRun ? 'Dry-run' : 'Normal'}</span><small>Modo</small></div>
          <div><span class="tag ${template && template.requiresAdmin && w.options.autoElevate ? 'tag-danger' : ''}">${template && template.requiresAdmin ? (w.options.autoElevate ? 'Auto-UAC' : 'Admin manual') : 'Sin UAC'}</span><small>Elevación</small></div>
        </div>
        <div class="ops-list mt-16">
          <div><b>Validación</b><span>El script se ha generado y guardado en historial local.</span></div>
          <div><b>Revisión</b><span>Comprueba el código antes de ejecutar en un equipo real.</span></div>
          <div><b>Exportación</b><span>Puedes descargar BAT, PS1, README y checklist.</span></div>
        </div>
      </div>
      <div class="panel panel-premium code-studio">
        <div class="code-studio__top">
          <div class="code-tabs">${tabs.map(t => `<button class="code-tab ${w.activeTab === t.id ? 'is-active' : ''}" onclick="SFApp.setActiveTab('${t.id}')">${t.label}</button>`).join('')}</div>
          <button class="btn btn-sm" onclick="SFApp.copyActiveTab()">Copiar ${w.activeTab.toUpperCase()}</button>
        </div>
        <div class="code-window">
          <div class="code-window__bar"><span></span><span></span><span></span><strong>${w.activeTab.toUpperCase()} preview</strong></div>
          <div class="code-block code-block--premium">${escapeHtml(activeContent)}</div>
        </div>
        <div class="footer-actions">
          <button class="btn btn-ghost" onclick="SFApp.wizardGoStep(4)">Atrás</button>
          <button class="btn" onclick="SFApp.wizardGoStep(6)">Informe de riesgo</button>
          <button class="btn btn-primary" onclick="SFApp.wizardGoStep(7)">Exportar</button>
        </div>
      </div>
    </div>`;
  }

  function setActiveTab(tabId) {
    state.wizard.activeTab = tabId;
    render();
  }

  async function copyActiveTab() {
    const w = state.wizard;
    const content = w.generated[w.activeTab] || '';
    const ok = await SFExporter.copyToClipboard(content);
    toast(ok ? `${w.activeTab.toUpperCase()} copiado al portapapeles.` : 'No se pudo copiar. Copia manualmente el texto.');
  }

  // ---- Paso 6: informe de riesgo completo ----
  function renderStep6() {
    const w = state.wizard;
    const template = getCurrentTemplate();
    if (!w.generated) return '<div class="empty-state">Genera primero el script en el paso 5.</div>';
    const ri = w.generated.riskInfo;
    return `
    <div class="panel panel-premium step-panel">
      <div class="step-header"><span class="eyebrow">Paso 6</span><h2>Informe de riesgo</h2><p>Análisis técnico, checklist y rollback orientativo antes de ejecutar.</p></div>
      <div class="security-summary">
        <div><span class="${SFSecurity.levelBadgeClass(ri.level)}">${SFSecurity.levelLabel(ri.level)}</span><strong>Nivel</strong></div>
        <div><span class="tag ${ri.requiresAdmin ? 'tag-danger' : 'tag-strong'}">${ri.requiresAdmin ? 'Admin' : 'User'}</span><strong>Permisos</strong></div>
        <div><span class="tag">Heurístico</span><strong>Motor</strong></div>
      </div>
      <div class="risk-meter level-${ri.level}"><span></span><span></span><span></span></div>
      <div class="studio-grid">
        <div><h3 class="subsection-title">Motivos detectados</h3>${ri.reasons.length ? `<ul class="checklist-list">${ri.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : '<p class="text-dim">Sin acciones de riesgo relevantes detectadas.</p>'}</div>
        <div>${template ? `<h3 class="subsection-title">Checklist posterior</h3><ul class="checklist-list">${(template.checklistPost || []).map(c => `<li>${escapeHtml(c)}</li>`).join('') || '<li>Ninguno específico.</li>'}</ul>` : ''}</div>
      </div>
      ${template ? `<h3 class="subsection-title mt-16">Rollback orientativo</h3><p class="text-dim">${escapeHtml(template.rollback || 'No aplica para esta acción.')}</p>` : ''}
      <p class="text-faint mt-16">Este análisis es una ayuda heurística y no sustituye la revisión humana del script antes de ejecutarlo.</p>
      <div class="footer-actions">
        <button class="btn btn-ghost" onclick="SFApp.wizardGoStep(5)">Atrás</button>
        <button class="btn btn-primary" onclick="SFApp.wizardGoStep(7)">Ir a exportación</button>
      </div>
    </div>`;
  }

  // ---- Paso 7: exportacion ----
  // ---- Paso 7: exportacion ----
  function renderStep7() {
    const w = state.wizard;
    const template = getCurrentTemplate();
    if (!w.generated) return '<div class="empty-state">Genera primero el script en el paso 5.</div>';
    const g = w.generated;
    const items = [];
    if (g.bat) items.push({ key: 'bat', label: 'Script .BAT', filename: (template ? SFGenerator.slug(template.id) : 'script') + '.bat', mime: 'text/plain' });
    if (g.ps1) items.push({ key: 'ps1', label: 'Script .PS1', filename: (template ? SFGenerator.slug(template.id) : 'script') + '.ps1', mime: 'text/plain' });
    items.push({ key: 'readme', label: 'README.md', filename: 'README.md', mime: 'text/markdown' });
    items.push({ key: 'checklist', label: 'checklist.txt', filename: 'checklist.txt', mime: 'text/plain' });

    return `
    <div class="panel panel-premium step-panel export-panel">
      <div class="step-header"><span class="eyebrow">Paso 7</span><h2>Exportación</h2><p>Copia o descarga los archivos generados. Todo se procesa localmente en tu navegador.</p></div>
      <div class="export-grid">
        ${items.map(it => `
          <div class="export-card">
            <span class="export-card__icon">${it.key === 'bat' ? 'BAT' : it.key === 'ps1' ? 'PS1' : it.key === 'readme' ? 'MD' : 'TXT'}</span>
            <div><strong>${it.label}</strong><small>${it.filename}</small></div>
            <div class="btn-group">
              <button class="btn btn-sm" onclick="SFApp.copyItem('${it.key}')">Copiar</button>
              <button class="btn btn-sm btn-primary" onclick="SFApp.downloadItem('${it.key}', '${it.filename}', '${it.mime}')">Descargar</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="footer-actions">
        <button class="btn btn-ghost" onclick="SFApp.wizardGoStep(6)">Atrás</button>
        <button class="btn" onclick="SFApp.startWizard()">Generar otro script</button>
        <button class="btn btn-primary" onclick="SFApp.downloadAllItems()">Descargar todo</button>
        <button class="btn btn-soft" onclick="SFApp.goDashboard()">Volver al inicio</button>
      </div>
    </div>`;
  }

  async function copyItem(key) {
    const content = state.wizard.generated[key] || '';
    const ok = await SFExporter.copyToClipboard(content);
    toast(ok ? 'Copiado al portapapeles.' : 'No se pudo copiar.');
  }

  function downloadItem(key, filename, mime) {
    const content = state.wizard.generated[key] || '';
    SFExporter.downloadFile(filename, content, mime);
    toast('Descarga iniciada: ' + filename);
  }

  function downloadAllItems() {
    const w = state.wizard;
    const template = getCurrentTemplate();
    const files = [];
    if (w.generated.bat) files.push({ filename: (template ? SFGenerator.slug(template.id) : 'script') + '.bat', content: w.generated.bat, mime: 'text/plain' });
    if (w.generated.ps1) files.push({ filename: (template ? SFGenerator.slug(template.id) : 'script') + '.ps1', content: w.generated.ps1, mime: 'text/plain' });
    files.push({ filename: 'README.md', content: w.generated.readme, mime: 'text/markdown' });
    files.push({ filename: 'checklist.txt', content: w.generated.checklist, mime: 'text/plain' });
    toast('Descargando ' + files.length + ' archivo(s)...');
    return SFExporter.downloadAll(files);
  }

  return {
    escapeHtml, $, applySkin, toast, init, goTo, goDashboard, acceptLegal,
    render, renderScreen, renderTopbar, handleStart,
    renderHistoryItem, renderHistory, confirmClearHistory, deleteHistoryEntry, reloadHistoryEntry,
    renderLibrary, setLibraryFilter, loadMoreLibrary,
    renderSettings, setSkin, saveSettingsForm, confirmResetAll,
    toggleHelp, renderHelpModal,
    startWizard, startWizardWithTemplate, cancelWizard, wizardNext, wizardBack, wizardGoStep,
    renderWizard, setScriptType, setWizardTemplateFilter, loadMoreWizardTemplates, selectTemplate, setFieldValue, setOption, setConfirmedRisk,
    generateScript, setActiveTab, copyActiveTab, copyItem, downloadItem, downloadAllItems,
    state, SKINS, CATEGORY_ORDER, getOrderedCategories, APP_VERSION
  };
})();

document.addEventListener('DOMContentLoaded', SFApp.init);
