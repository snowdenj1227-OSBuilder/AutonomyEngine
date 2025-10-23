// Keep nav background solid after first scroll
const nav = document.querySelector('.nav');
const solid = () => nav.style.background = 'rgba(16,17,19,.9)';
const glass = () => nav.style.background = 'linear-gradient(to bottom, rgba(16,17,19,.6), rgba(16,17,19,0))';
let scrolled = false;
window.addEventListener('scroll', () => {
  if (window.scrollY > 8 && !scrolled){ solid(); scrolled = true; }
  else if (window.scrollY <= 8 && scrolled){ glass(); scrolled = false; }
});

// Placeholder for modal open (we wire the interactive demo next)
document.getElementById('seeItWork')?.addEventListener('click', () => {
  // TODO: open modal
  console.log('Open interactive modal');
});
const modal = document.getElementById('demoModal');
const seeBtn = document.getElementById('seeItWork');
const closeBtn = document.getElementById('modalClose');

function openModal(){
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  autoplayDemo(); // kick off the 8–10s preview
}
function closeModal(){
  modal.hidden = true;
  document.body.style.overflow = '';
  resetDemo(true);
}

seeBtn?.addEventListener('click', openModal);
closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
window.addEventListener('keydown', (e)=>{ if(!modal.hidden && e.key === 'Escape') closeModal(); });
const intentEl = document.getElementById('aeIntent');
const aeslOut = document.getElementById('aeslOut');
const logOut  = document.getElementById('logOut');
const runBtn  = document.getElementById('runBtn');
const compileState = document.getElementById('compileState');

let timers = [];
function at(ms, fn){ timers.push(setTimeout(fn, ms)); }
function clearTimers(){ timers.forEach(clearTimeout); timers = []; }

function resetDemo(clearInput=false){
  clearTimers();
  compileState.textContent = '';
  aeslOut.textContent = '';
  logOut.textContent = '';
  if(clearInput) intentEl.value = 'when a shopify order is paid, create invoice and notify slack #ops';
  intentEl.disabled = false;
  runBtn.disabled = false;
}
function toAESL(text){
  const t = text.toLowerCase();
  const steps = [];
  let trigger = 'manual.trigger()';

  if(t.includes('shopify') && (t.includes('paid') || t.includes('order paid'))) trigger = 'shopify.order_paid';
  if(t.includes('stripe') && (t.includes('invoice') || t.includes('create invoice'))) steps.push('stripe.create_invoice()');
  if(t.includes('slack')) steps.push(`slack.post("ops","invoice ready")`);
  if(t.includes('gmail') || t.includes('email')) steps.push('gmail.send("ops@example.com","notification")');
  if(steps.length === 0) steps.push('noop()');

  return `workflow "run" {\n  trigger: ${trigger}\n  steps: [\n    ${steps.join(',\n    ')}\n  ]\n}`;
}
function log(lines, start=0, gap=600){
  lines.forEach((ln, i)=> at(start + i*gap, ()=> {
    logOut.textContent += (logOut.textContent ? '\n' : '') + ln;
    logOut.scrollTop = logOut.scrollHeight;
  }));
}
function autoplayDemo(){
  resetDemo(false);
  intentEl.disabled = true;
  runBtn.disabled = true;

  const text = intentEl.value;
  at(300, ()=> compileState.textContent = 'Compiling…');
  const aesl = toAESL(text);

  // print AESL lines with rhythm
  const lines = aesl.split('\n');
  lines.forEach((ln, i)=> at(1200 + i*120, ()=> {
    aeslOut.textContent += (i?'\n':'') + ln;
  }));

  // run log
  log(['▶ compiling AESL'], 900, 1);
  log(['✔ stripe.create_invoice()', '✔ slack.post()', '✔ ledger.append(record)'], 2200, 700);
  at(4500, ()=> {
    log(['⚙ human_approval: not_required'], 0, 1);
    compileState.textContent = 'Completed';
    // hand off to interactive mode
    at(800, ()=> { intentEl.disabled = false; runBtn.disabled = false; compileState.textContent = 'Try your own instruction'; });
  });
}
runBtn?.addEventListener('click', ()=>{
  clearTimers();
  compileState.textContent = 'Compiling…';
  aeslOut.textContent = '';
  logOut.textContent = '';

  const aesl = toAESL(intentEl.value);
  aesl.split('\n').forEach((ln, i)=> at(200 + i*80, ()=> {
    aeslOut.textContent += (i?'\n':'') + ln;
  }));

  log(['▶ compiling AESL'], 200, 1);
  // naive step detection
  const hasStripe = /stripe\.create_invoice/.test(aesl);
  const hasSlack  = /slack\.post/.test(aesl);
  const steps = [
    hasStripe && '✔ stripe.create_invoice()',
    hasSlack  && '✔ slack.post()',
    '✔ ledger.append(record)'
  ].filter(Boolean);
  log(steps, 900, 650);

  at(900 + steps.length*650 + 300, ()=> {
    compileState.textContent = 'Completed';
  });
});
