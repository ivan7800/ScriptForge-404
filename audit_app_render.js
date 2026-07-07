const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = __dirname;
const jsDir = path.join(root, 'assets', 'js');
let storage = {};
const context = {
  console,
  Date,
  Math,
  setTimeout,
  confirm: () => true,
  window: { scrollTo(){}, open() {}, localStorage: { getItem(k){ return storage[k] ?? null; }, setItem(k,v){ storage[k]=v; }, removeItem(k){ delete storage[k]; } } },
  document: { addEventListener(){}, querySelector(sel){ if(sel==='#app') return { innerHTML:'' }; return null; }, body: { setAttribute(){} }, createElement(){ return { setAttribute(){}, appendChild(){}, remove(){}, className:'', textContent:''}; } }
};
context.localStorage = context.window.localStorage;
vm.createContext(context);
for (const file of ['storage.js','security.js','templates.js','templates-extra.js','templates-cau-mega.js','templates-v5-pro.js','templates-v5-4-pro.js','generator.js','exporter.js','app.js']) {
  vm.runInContext(fs.readFileSync(path.join(jsDir, file), 'utf8'), context, { filename: file });
}
vm.runInContext(`
  SFApp.state.config = SFStorage.getConfig();
  SFApp.state.history = [];
  SFApp.state.screen = 'dashboard';
  const top = SFApp.renderTopbar();
  const dash = SFApp.renderScreen();
  SFApp.startWizard();
  const wizard = SFApp.renderWizard();
  SFApp.goTo = () => {};
  ({top: top.length, dash: dash.length, wizard: wizard.length, templates: SFTemplates.length});
`, context);
console.log('Render sanity OK');
