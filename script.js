/* Theme toggle + system preference */
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
function setTheme(mode){
  root.classList.toggle('theme-light', mode === 'light');
  root.classList.toggle('theme-dark', mode !== 'light');
  localStorage.setItem('ae-theme', mode);
}
const saved = localStorage.getItem('ae-theme');
if(saved){ setTheme(saved); }
toggle?.addEventListener('click', ()=>{
  const next = root.classList.contains('theme-light') ? 'dark' : 'light';
  setTheme(next);
});

/* Mobile nav */
const navBtn = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
navBtn?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  navBtn.setAttribute('aria-expanded', String(open));
});

/* Typewriter headline */
(function typewriter(){
  const el = document.getElementById('typewriter');
  if(!el) return;
  const phrases = JSON.parse(el.getAttribute('data-phrases') || '[]');
  let i = 0, j = 0, deleting = false;

  function tick(){
    const full = phrases[i % phrases.length];
    if(!deleting){
      j++;
      el.textContent = full.slice(0, j);
      if(j === full.length){ deleting = true; setTimeout(tick, 1600); return; }
      setTimeout(tick, 36);
    }else{
      j--;
      el.textContent = full.slice(0, j);
      if(j === 0){ deleting = false; i++; setTimeout(tick, 400); return; }
      setTimeout(tick, 24);
    }
  }
  tick();
})();

/* AESL preview (toy) */
const input = document.getElementById('intent');
const preview = document.getElementById('aeskPreview');
function toAESL(text){
  // Tiny illustrative mapping — replace with your real compiler later.
  const lower = text.toLowerCase();
  const steps = [];
  if(/invoice/.test(lower)) steps.push('- task: generate_invoice\n  source: orders.latest');
  if(/slack|notify/.test(lower)) steps.push('- task: notify\n  channel: #ops\n  message: "Invoice created"');
  if(/save|records|ledger/.test(lower)) steps.push('- task: record\n  target: ledger.audit');
  return [
    'workflow:',
    '  name: intent_run',
    '  approvals: low_confidence',
    '  steps:',
    steps.length ? steps.map(s=>'    '+s).join('\n') : '    - task: parse_intent\n      input: "'+text.replace(/"/g,'\\"')+'"',
  ].join('\n');
}
input?.addEventListener('input', e => {
  const v = e.target.value.trim();
  preview.textContent = v ? toAESL(v) : 'workflow:\n  name: (start typing…)\n  steps: []';
});

/* Email capture stub */
window.handleSignup = function(e){
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if(!email) return false;
  console.log('Early Operator:', email);
  alert('Thanks — we’ll be in touch soon.');
  e.target.reset();
  return false;
};

/* Year */
document.getElementById('year').textContent = new Date().getFullYear();
