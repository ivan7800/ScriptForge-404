const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = __dirname;
const jsDir = path.join(root, 'assets', 'js');
const context = {
  console,
  Date,
  window: {},
  localStorage: { getItem(){ return null; }, setItem(){}, removeItem(){} },
  document: {}
};
vm.createContext(context);

const jsFiles = ['security.js','templates.js','templates-extra.js','templates-cau-mega.js','templates-v5-pro.js','templates-v5-4-pro.js','generator.js'];
for (const file of jsFiles) {
  const fullPath = path.join(jsDir, file);
  try {
    vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: file });
    console.log('[OK] loaded', file);
  } catch (error) {
    console.error('[ERROR] load', file, error);
    process.exit(1);
  }
}

const SFTemplates = vm.runInContext('SFTemplates', context);
const SFGenerator = vm.runInContext('SFGenerator', context);
if (!Array.isArray(SFTemplates)) {
  console.error('[ERROR] SFTemplates no es un array');
  process.exit(1);
}

const options = {
  scriptType: 'both',
  createLog: true,
  logPath: '.\\logs',
  dryRun: false,
  silent: false,
  confirmDangerous: true,
  comments: true,
  pauseAtEnd: false,
  autoElevate: true,
  version: '5.6-auto-uac-final',
  technician: 'QA',
  client: 'TEST'
};

const ids = new Set();
const duplicateIds = [];
for (const tpl of SFTemplates) {
  if (ids.has(tpl.id)) duplicateIds.push(tpl.id);
  ids.add(tpl.id);
}

let generationErrors = [];
let powerShellHereStringIssues = [];
let autoElevateIssues = [];
for (const tpl of SFTemplates) {
  const values = {};
  for (const field of (tpl.fields || [])) {
    values[field.key] = field.default ?? (field.type === 'checkbox' ? false : '');
  }
  try {
    const result = SFGenerator.generateAll(tpl, values, options);
    if (!result.bat && !result.ps1) generationErrors.push([tpl.id, 'empty outputs']);
    if (tpl.requiresAdmin) {
      if (result.bat && !result.bat.includes('Solicitando elevacion UAC')) autoElevateIssues.push([tpl.id, 'BAT without Auto-UAC']);
      if (result.ps1 && !result.ps1.includes('Solicitando elevacion UAC')) autoElevateIssues.push([tpl.id, 'PS1 without Auto-UAC']);
    }
    if (result.ps1) {
      const lines = result.ps1.split(/\r?\n/);
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if ((trimmed === "'@" || trimmed === '"@') && line !== trimmed) {
          powerShellHereStringIssues.push([tpl.id, index + 1, 'closing delimiter is indented']);
        }
        if (/^['\"]@\s*\|/.test(trimmed)) {
          powerShellHereStringIssues.push([tpl.id, index + 1, 'closing delimiter has pipeline/content after it']);
        }
      });
    }
  } catch (error) {
    generationErrors.push([tpl.id, error.message]);
  }
}

const v5Templates = SFTemplates.filter(t => t.id.startsWith('v5-pro-'));
const categories = {};
for (const tpl of SFTemplates) categories[tpl.category] = (categories[tpl.category] || 0) + 1;

const requiredStandalone = [
  ['01 Diagnóstico rápido PC', '01_diagnostico_rapido_pc'],
  ['05 Mapear unidades de red', '05_mapear_unidades_red'],
  ['04 Reset DNS/Winsock/TCP-IP', '04_reset_dns_winsock_tcpip'],
  ['09 Reparar botón Teams/Outlook', '09_reparar_boton_teams_outlook'],
  ['22 Diagnóstico Intune/Autopilot', '22_diagnostico_intune_autopilot']
];
const standaloneChecks = requiredStandalone.map(([name, slug]) => {
  const bat = path.join(root, 'scripts_standalone', 'V5_Pro', 'BAT', `${slug}.bat`);
  const ps1 = path.join(root, 'scripts_standalone', 'V5_Pro', 'PS1', `${slug}.ps1`);
  const readme = path.join(root, 'scripts_standalone', 'V5_Pro', 'README', `${slug}.md`);
  return { name, bat: fs.existsSync(bat), ps1: fs.existsSync(ps1), readme: fs.existsSync(readme) };
});

const v54StandaloneRoot = path.join(root, 'scripts_standalone', 'V5_4_Pro');
const countFiles = (dir, ext) => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(ext)).length : 0;
const v54StandaloneChecks = {
  bat: countFiles(path.join(v54StandaloneRoot, 'BAT'), '.bat'),
  ps1: countFiles(path.join(v54StandaloneRoot, 'PS1'), '.ps1'),
  readme: countFiles(path.join(v54StandaloneRoot, 'README'), '.md'),
  manifest: fs.existsSync(path.join(v54StandaloneRoot, 'manifest.json')),
};

console.log('\n=== ScriptForge 404 audit v5.6 Auto-UAC final ===');
console.log('Total templates:', SFTemplates.length);
console.log('V5 Pro templates:', v5Templates.length);
console.log('Duplicate IDs:', duplicateIds.length);
console.log('Generation errors:', generationErrors.length);
console.log('PowerShell here-string issues:', powerShellHereStringIssues.length);
console.log('Auto-UAC generation issues:', autoElevateIssues.length);
console.log('Standalone 5-script checks:', JSON.stringify(standaloneChecks, null, 2));
console.log('V5.4 standalone checks:', JSON.stringify(v54StandaloneChecks, null, 2));
console.log('Categories:', JSON.stringify(categories, null, 2));

if (duplicateIds.length || generationErrors.length || powerShellHereStringIssues.length || autoElevateIssues.length || standaloneChecks.some(c => !c.bat || !c.ps1 || !c.readme) || v54StandaloneChecks.bat !== 60 || v54StandaloneChecks.ps1 !== 60 || v54StandaloneChecks.readme !== 60 || !v54StandaloneChecks.manifest) {
  console.error('\n[FAIL] Audit found issues');
  console.error('duplicates:', duplicateIds.slice(0, 20));
  console.error('generationErrors:', generationErrors.slice(0, 20));
  console.error('powerShellHereStringIssues:', powerShellHereStringIssues.slice(0, 20));
  console.error('autoElevateIssues:', autoElevateIssues.slice(0, 20));
  process.exit(1);
}

console.log('\n[OK] Audit clean.');
