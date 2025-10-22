// year in footer
document.getElementById('y').textContent = new Date().getFullYear();

// scroll reveal
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{ rootMargin: "0px 0px -10% 0px", threshold:.08 });
document.querySelectorAll('[data-reveal]').forEach(n=> io.observe(n));

// Feature rail (big cards) with arrows + drag
const fTrack = document.getElementById('featureTrack');
if (fTrack){
  const getStep = () => fTrack.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(fTrack).columnGap||20);
  document.querySelector('.feat-btn.prev')?.addEventListener('click', ()=> fTrack.scrollBy({left:-getStep(), behavior:'smooth'}));
  document.querySelector('.feat-btn.next')?.addEventListener('click', ()=> fTrack.scrollBy({left:+getStep(), behavior:'smooth'}));

  let down=false, start=0, startScroll=0;
  fTrack.addEventListener('pointerdown', e=>{ down=true; fTrack.setPointerCapture(e.pointerId); start=e.clientX; startScroll=fTrack.scrollLeft; });
  fTrack.addEventListener('pointermove', e=>{ if(!down) return; fTrack.scrollLeft = startScroll + (start - e.clientX); });
  fTrack.addEventListener('pointerup', ()=> down=false);
}

// Infinite marquee: duplicate belt contents once for seamless 200%
const belt = document.getElementById('belt');
if (belt && !belt.dataset.cloned) {
  belt.dataset.cloned = '1';
  const children = Array.from(belt.children);
  children.forEach(el=> belt.appendChild(el.cloneNode(true)));
  // CSS animation translates -50%, matching exact duplication
}
