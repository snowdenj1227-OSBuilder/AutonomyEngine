// Nav background solid after tiny scroll
const nav = document.querySelector('.nav');
const solid = () => nav.style.background = 'rgba(16,17,19,.9)';
const glass = () => nav.style.background = 'linear-gradient(to bottom, rgba(16,17,19,.6), rgba(16,17,19,0))';
let scrolled = false;
window.addEventListener('scroll', () => {
  if (window.scrollY > 1 && !scrolled){ solid(); scrolled = true; }
  else if (window.scrollY <= 1 && scrolled){ glass(); scrolled = false; }
});

// ===== Interactive Demo Modal =====
const modal = document.getElementById('demoModal');
const openBtn = document.getElementById('seeItWork');
const closeEls = modal.querySelectorAll('[data-close]');
const intentEl = document.getElementById('ae-intent');
const runBtn = document.getElementById('ae-run');
const compileRow = document.getElementById('ae-compile');
const aeslOut = document.getElementById('ae-aesl');
const logOut = document.getElementById('ae-log');
const statusEl = document.getElementById('ae-status');
const tryOwnBtn = document.getElementById('ae-try-own');

let autoplayTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  // force hidden on load
  modal.setAttribute('aria-hidden','true');
});

function openModal(){
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  resetDemo();
  autoplayTimer = setTimeout(()=> runDemo(intentEl.value, true), 1200);
}
function closeModal(){
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  clearTimeout(autoplayTimer);
}
openBtn?.addEventListener('click', openModal);
closeEls.forEach(el => el.addEventListener('click', closeModal));
window.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

function resetDemo(){
  aeslOut.textContent = ''; logOut.textContent = ''; statusEl.textContent = '';
  tryOwnBtn.classList.add('hidden'); compileRow.classList.add('hidden');
  intentEl.disabled = false; runBtn.disabled = false;
}

function toAESL(s){
  const txt = s.toLowerCase();
  const has = (k) => txt.includes(k);
  const steps = [];
  if (has('invoice') || has('stripe')) steps.push('stripe.create_invoice()');
  if (has('slack') || has('#'))      steps.push('slack.post("ops","invoice ready")');
  if (has('email') || has('gmail'))  steps.push('gmail.send("ops@example.com","notice")');
  if (has('power bi') || has('dataset')) steps.push('powerbi.refresh_dataset()');

  const trigger =
    (has('shopify') && has('paid')) ? 'shopify.order_paid' :
    (has('github') && has('push'))  ? 'github.push' : 'manual';

  return `workflow "ae_demo" {
  trigger: ${trigger}
  steps: [
    ${steps.join(',\n    ')}
  ]
}`;
}

function logLine(t){ logOut.textContent += t + '\n'; }
function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
function typeInto(el, text, step=10){
  el.textContent=''; let i=0;
  const tick=()=>{ el.textContent=text.slice(0,i); i+=step; if(i<=text.length) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}

async function runDemo(src){
  clearTimeout(autoplayTimer);
  intentEl.disabled = true; runBtn.disabled = true;
  compileRow.classList.remove('hidden'); aeslOut.textContent=''; logOut.textContent=''; statusEl.textContent='';
  await wait(900);
  const aesl = toAESL(src);
  compileRow.classList.add('hidden');
  typeInto(aeslOut, aesl, 12);
  await wait(900);
  logLine('▶ compiling AESL'); await wait(600);
  if(aesl.includes('create_invoice')){ logLine('✔ stripe.create_invoice()'); await wait(600); }
  if(aesl.includes('slack.post'))     { logLine('✔ slack.post()'); await wait(600); }
  if(aesl.includes('gmail.send'))     { logLine('✔ gmail.send()'); await wait(500); }
  logLine('✔ ledger.append(record)'); await wait(500);
  logLine('⚙ human_approval: not_required');
  statusEl.textContent='workflow completed';
  tryOwnBtn.classList.remove('hidden');
}
runBtn.addEventListener('click', ()=> runDemo(intentEl.value));
intentEl.addEventListener('input', ()=> clearTimeout(autoplayTimer));
tryOwnBtn.addEventListener('click', ()=> { resetDemo(); intentEl.focus(); });
