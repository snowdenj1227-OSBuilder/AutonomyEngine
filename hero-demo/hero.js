// Minimal JS: tooltips + accessibility. No heavy loops.

// Reuse a single tooltip element for all logos
const tooltip = document.getElementById('tooltip');
const ttTitle = tooltip.querySelector('.tt-title');
const ttItems = tooltip.querySelectorAll('.tt-list li');

// Position tooltip above logo (flip if near top)
function positionTooltip(el){
  const r = el.getBoundingClientRect();
  const padding = 10;
  const x = r.left + r.width / 2;
  let top = r.top - tooltip.offsetHeight - 12;
  let left = x - tooltip.offsetWidth / 2;

  // Keep on-screen horizontally
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltip.offsetWidth - padding));
  // Flip below if not enough space above
  if (top < padding) top = r.bottom + 12;

  tooltip.style.transform = `translate(${left}px, ${top}px)`;
}

function showTooltip(el){
  ttTitle.textContent = el.dataset.title || '';
  ttItems[0].textContent = el.dataset.line1 || '';
  ttItems[1].textContent = el.dataset.line2 || '';
  tooltip.hidden = false;
  positionTooltip(el);
}

function hideTooltip(){ tooltip.hidden = true; }

// Attach events to each logo button
document.querySelectorAll('.logo').forEach(btn=>{
  btn.addEventListener('mouseenter', ()=> showTooltip(btn));
  btn.addEventListener('mouseleave', hideTooltip);
  btn.addEventListener('focus', ()=> showTooltip(btn));
  btn.addEventListener('blur', hideTooltip);
  // Reposition on move/resize
  btn.addEventListener('mousemove', ()=> positionTooltip(btn));
});

window.addEventListener('resize', ()=>{
  if (!tooltip.hidden) {
    const active = document.activeElement.classList.contains('logo') ? document.activeElement : null;
    if (active) positionTooltip(active);
  }
});

// Placeholder: wire modal later
document.getElementById('seeItWork')?.addEventListener('click', ()=>{
  // TODO: open modal. For now just log.
  console.log('See it work clicked — modal coming next.');
});
