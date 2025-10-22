// Year
document.getElementById('y') && (document.getElementById('y').textContent = new Date().getFullYear());

// Reveal
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
},{rootMargin:"-10% 0px -10% 0px", threshold:.08});
document.querySelectorAll('[data-reveal]').forEach(n=> io.observe(n));

/* ===== Manual one-at-a-time FEATURES ===== */
(function(){
  const track = document.getElementById('featTrack');
  const prev  = document.querySelector('#featCarousel .car-arrow.prev');
  const next  = document.querySelector('#featCarousel .car-arrow.next');
  const dots  = document.getElementById('featDots');
  if(!track || !prev || !next || !dots) return;

  const slides = Array.from(track.children);
  slides.forEach((_,i)=>{
    const b=document.createElement('button');
    b.type='button'; b.setAttribute('aria-label','Go to slide '+(i+1));
    if(i===0) b.setAttribute('aria-current','true');
    b.addEventListener('click', ()=> goTo(i));
    dots.appendChild(b);
  });

  const cardWidth = ()=> slides[0].getBoundingClientRect().width + 20; // include gap
  let index = 0, busy=false;

  function goTo(i){
    if(busy) return; busy=true;
    index = Math.max(0, Math.min(slides.length-1, i));
    track.scrollTo({ left: index * cardWidth(), behavior:'smooth' });
    dots.querySelectorAll('button').forEach((d,di)=> d.setAttribute('aria-current', di===index ? 'true' : 'false'));
    setTimeout(()=> busy=false, 380);
  }

  prev.addEventListener('click', ()=> goTo(index-1));
  next.addEventListener('click', ()=> goTo(index+1));

  // keep index in sync when user drags/scrolls
  let t;
  track.addEventListener('scroll', ()=>{
    clearTimeout(t);
    t=setTimeout(()=>{
      const i = Math.round(track.scrollLeft / cardWidth());
      if(i!==index){ index=i; dots.querySelectorAll('button').forEach((d,di)=> d.setAttribute('aria-current', di===index ? 'true' : 'false')); }
    }, 120);
  });

  // keyboard
  track.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight') { e.preventDefault(); goTo(index+1); }
    if(e.key==='ArrowLeft')  { e.preventDefault(); goTo(index-1); }
  });

  // snap on resize
  addEventListener('resize', ()=> goTo(index));
})();

/* ===== HOW IT COMES TOGETHER: infinite auto + manual ===== */
(function makeAutoLoop(){
  const track = document.getElementById('pipeTrack');
  const prev  = document.getElementById('pPrev');
  const next  = document.getElementById('pNext');
  if(!track || !prev || !next) return;

  // Clone once so 0 → -50% is a seamless loop
  if(!track.dataset.loopReady){
    track.dataset.loopReady = "1";
    Array.from(track.children).forEach(el => track.appendChild(el.cloneNode(true)));
  }

  // Auto speed based on total width
  const setSpeed = () => {
    const total = Array.from(track.children).reduce((w, el)=> w + el.getBoundingClientRect().width + 12, 0); // +gap
    const base = 28; // seconds for default content
    const dur  = Math.max(18, Math.min(60, (total/2000) * base));
    track.style.animationDuration = dur + 's';
  };
  setSpeed(); addEventListener('resize', ()=> requestAnimationFrame(setSpeed));

  // Manual: drag to scroll (pauses auto while dragging)
  let down=false, startX=0, startTx=0;
  const getTx = () => new DOMMatrix(getComputedStyle(track).transform).m41 || 0;
  const setTx = (x) => track.style.transform = `translateX(${x}px)`;
  const pause = () => { track.style.animationPlayState = 'paused'; };
  const play  = () => { track.style.animationPlayState = 'running'; };

  track.addEventListener('pointerdown', e=>{
    down=true; track.setPointerCapture(e.pointerId); pause();
    startX = e.clientX; startTx = getTx(); track.classList.add('grabbing');
  });
  track.addEventListener('pointermove', e=>{
    if(!down) return;
    const dx = e.clientX - startX;
    setTx(startTx + dx);
  });
  const end = ()=>{
    if(!down) return; down=false; track.classList.remove('grabbing');
    // normalize into [-width, 0] so CSS loop remains seamless
    const width = track.scrollWidth/2;
    let x = getTx();
    x = ((x % -width) + -width) % -width;
    setTx(x);
    play();
  };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
  track.addEventListener('mouseleave', ()=> down && end());

  // Wheel / trackpad
  track.addEventListener('wheel', e=>{
    pause();
    const cur = getTx();
    setTx(cur - (e.deltaY || e.deltaX));
    clearTimeout(track._wheelTimer);
    track._wheelTimer = setTimeout(()=> !down && play(), 300);
  }, {passive:true});

  // Arrows
  const step = ()=> Math.min(340, track.firstElementChild.getBoundingClientRect().width + 12);
  prev.addEventListener('click', ()=>{ pause(); setTx(getTx() + step());  clearTimeout(track._t); track._t=setTimeout(()=> play(), 250); });
  next.addEventListener('click', ()=>{ pause(); setTx(getTx() - step());  clearTimeout(track._t); track._t=setTimeout(()=> play(), 250); });
})();