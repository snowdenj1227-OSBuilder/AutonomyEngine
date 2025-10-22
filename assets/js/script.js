// Theme toggle (default dark; persists)
(function(){
  const r = document.documentElement;
  const key = 'ae-theme';
  const saved = localStorage.getItem(key);
  if(saved){ r.setAttribute('data-theme', saved); }
  document.getElementById('themeToggle').addEventListener('click', ()=>{
    const next = r.getAttribute('data-theme')==='dark' ? 'light':'dark';
    r.setAttribute('data-theme', next);
    localStorage.setItem(key, next);
  });
})();

// Reveal on view
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:"-10% 0px -10% 0px",threshold:.08});
document.querySelectorAll('[data-reveal]').forEach(n=>io.observe(n));

// Features carousel: auto + manual + dots
(function(){
  const root = document.querySelector('.carousel');
  if(!root) return;
  const track = document.getElementById('featuresTrack');
  const dotsWrap = document.getElementById('featuresDots');
  const slides = [...track.children];
  const auto = root.dataset.autoplay === 'true';
  const interval = +root.dataset.interval || 4200;
  let index = 0, timer;

  // dots
  slides.forEach((_,i)=>{
    const b = document.createElement('button');
    b.addEventListener('click', ()=>go(i,true));
    dotsWrap.appendChild(b);
  });
  function mark(){ dotsWrap.querySelectorAll('button').forEach((d,i)=>d.classList.toggle('active', i===index)); }

  function go(i, manual=false){
    index = (i+slides.length)%slides.length;
    slides[index].scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    mark();
    if(manual){ stop(); start(); }
  }
  function next(){ go(index+1); }
  function start(){ if(auto){ stop(); timer = setInterval(next, interval);} }
  function stop(){ if(timer) clearInterval(timer); }

  // drag
  let isDown=false, startX, scrollLeft;
  track.addEventListener('pointerdown', (e)=>{ isDown=true; startX=e.pageX; scrollLeft=track.scrollLeft; track.setPointerCapture(e.pointerId); });
  window.addEventListener('pointerup', ()=>{ isDown=false; });
  window.addEventListener('pointermove', (e)=>{ if(!isDown) return; const dx = e.pageX - startX; track.scrollLeft = scrollLeft - dx; });

  mark(); start();
})();

// Infinite ribbon: auto + manual drag
(function(){
  const wrap = document.getElementById('howRibbon');
  const track = document.getElementById('howTrack');
  if(!wrap || !track) return;

  // clone for seamless loop
  track.innerHTML = track.innerHTML + track.innerHTML;
  let x=0, play=true, speed=.5;

  function step(){
    if(play){
      x -= speed;
      const width = track.scrollWidth/2;
      if(-x >= width) x += width;
      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(step);
  }
  step();

  wrap.addEventListener('mouseenter', ()=> play=false);
  wrap.addEventListener('mouseleave', ()=> play=true);

  // drag
  let drag=false, sx=0, start=0;
  wrap.addEventListener('mousedown', (e)=>{ drag=true; sx=e.pageX; start=x; play=false; });
  window.addEventListener('mouseup', ()=>{ drag=false; play=true; });
  window.addEventListener('mousemove', (e)=>{ if(!drag) return; x = start + (e.pageX-sx); track.style.transform = `translateX(${x}px)`; });

  // touch
  wrap.addEventListener('touchstart', (e)=>{ drag=true; sx=e.touches[0].pageX; start=x; play=false; }, {passive:true});
  wrap.addEventListener('touchend', ()=>{ drag=false; play=true; }, {passive:true});
  wrap.addEventListener('touchmove', (e)=>{ if(!drag) return; x = start + (e.touches[0].pageX - sx); track.style.transform = `translateX(${x}px)`; }, {passive:true});
})();

// Waitlist: leave to Formsubmit backend; show UX feedback on submit
document.getElementById('wlForm').addEventListener('submit', function(){ setTimeout(()=>alert('Thanks — you’re on the list.'), 50) });
