// year in footer
document.getElementById('y').textContent = new Date().getFullYear();

// scroll reveal
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{ rootMargin: "0px 0px -10% 0px", threshold:.08 });
document.querySelectorAll('[data-reveal]').forEach(n=> io.observe(n));

// slider drag scrub
const track = document.getElementById('railTrack');
if(track){
  let down=false, start=0, saved=0;
  const stop=()=> track.style.animationPlayState='paused';
  const play=()=> track.style.animationPlayState='running';
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', ()=>{ down=false; play(); });
  track.addEventListener('pointerdown', e=>{
    down=true; start=e.clientX;
    const m = getComputedStyle(track).transform;
    saved = m.includes('matrix') ? parseFloat(m.split(',')[4]) : 0;
    track.setPointerCapture(e.pointerId); stop();
  });
  track.addEventListener('pointermove', e=>{
    if(!down) return;
    const dx = e.clientX - start;
    track.style.transform = `translateX(${saved + dx}px)`;
  });
  track.addEventListener('pointerup', ()=> down=false);
}
