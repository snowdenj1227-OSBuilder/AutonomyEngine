// Year
document.getElementById('y') && (document.getElementById('y').textContent = new Date().getFullYear());

// Reveal
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
},{rootMargin:"-10% 0px -10% 0px", threshold:.08});
document.querySelectorAll('[data-reveal]').forEach(n=> io.observe(n));

// Helper to make a loop track with manual controls
function makeLoop(trackSelector, {prevId, nextId} = {}){
  const track = document.querySelector(trackSelector);
  if(!track) return;

  // duplicate once for seamless 0 → -50% loop
  if(!track.dataset.loopReady){
    track.dataset.loopReady = "1";
    Array.from(track.children).forEach(c => track.appendChild(c.cloneNode(true)));
  }

  // speed auto-scale
  const setSpeed = () => {
    const total = Array.from(track.children).reduce((w, el)=> w + el.getBoundingClientRect().width, 0);
    const base = 40; // secs for ~2 widths
    track.style.animationDuration = Math.max(28, Math.min(70, (total/1200)*base)) + 's';
  };
  setSpeed(); addEventListener('resize', ()=> requestAnimationFrame(setSpeed));

  // manual controls
  let isDown=false, startX=0, startTx=0, pausedByDrag=false;
  const getTx = () => new DOMMatrix(getComputedStyle(track).transform).m41 || 0;
  const setTx = (x) => track.style.transform = `translateX(${x}px)`;
  const pause = () => track.style.animationPlayState = 'paused';
  const play  = () => track.style.animationPlayState = 'running';

  track.addEventListener('pointerdown', (e)=>{
    isDown = true; pausedByDrag = true; track.setPointerCapture(e.pointerId); pause();
    startX = e.clientX; startTx = getTx();
  });
  track.addEventListener('pointermove', (e)=>{
    if(!isDown) return;
    const dx = e.clientX - startX;
    setTx(startTx + dx);
  });
  const endDrag = ()=>{
    if(!isDown) return; isDown=false;
    // normalize position into [-width,0] to keep loop seamless
    const width = track.scrollWidth/2;
    let x = getTx();
    x = ((x % -width) + -width) % -width; // wrap to negative range
    setTx(x);
    if(pausedByDrag){ play(); pausedByDrag=false; }
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('mouseleave', ()=> isDown && endDrag());

  // wheel/trackpad
  track.addEventListener('wheel', (e)=>{
    pause();
    const cur = getTx();
    setTx(cur - (e.deltaY || e.deltaX));
    clearTimeout(track._wheelTimer);
    track._wheelTimer = setTimeout(()=> play(), 300);
  }, {passive:true});

  // arrows
  if(prevId || nextId){
    const prev = prevId ? document.getElementById(prevId) : null;
    const next = nextId ? document.getElementById(nextId) : null;
    const nudge = (dir)=>()=>{
      pause();
      const step = Math.min(420, track.firstElementChild.getBoundingClientRect().width + 20);
      setTx(getTx() + (dir * step));
      clearTimeout(track._arrowTimer);
      track._arrowTimer = setTimeout(()=> play(), 300);
    };
    prev && prev.addEventListener('click', nudge(+1));
    next && next.addEventListener('click', nudge(-1));
  }
}

// Initialize loops
makeLoop('#featuresTrack', { prevId:'fPrev', nextId:'fNext' });
makeLoop('#pipelineTrack', { prevId:'pPrev', nextId:'pNext' });
