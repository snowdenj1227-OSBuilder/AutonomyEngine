/* ===== Simple utilities ===== */
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

/* ===== Features carousel (auto + manual + dots) ===== */
function makeCarousel(root){
  const track = qs('.track', root);
  const slides = qsa('.feature', track);
  const dotsWrap = qs('.dots', root);
  const interval = +root.dataset.interval || 3800;
  let index = 0, timer;

  // build dots
  slides.forEach((_,i)=>{
    const b = document.createElement('button');
    b.addEventListener('click', ()=>go(i, true));
    dotsWrap.appendChild(b);
  });

  function mark(){
    qsa('button', dotsWrap).forEach((d,i)=>d.classList.toggle('active', i===index));
  }

  function go(i, stopAuto=false){
    index = (i+slides.length)%slides.length;
    const card = slides[index];
    card.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    mark();
    if(stopAuto){stop(); start();}
  }

  function next(){ go(index+1); }
  function start(){
    if(root.dataset.autoplay === 'true'){
      stop(); timer = setInterval(next, interval);
    }
  }
  function stop(){ if(timer) clearInterval(timer); }

  // Manual drag (desktop)
  let isDown=false, startX, scrollLeft;
  track.addEventListener('mousedown', (e)=>{
    isDown=true; startX=e.pageX; scrollLeft=track.scrollLeft; track.classList.add('grabbing');
  });
  window.addEventListener('mouseup', ()=>{isDown=false; track.classList.remove('grabbing');});
  window.addEventListener('mousemove', (e)=>{
    if(!isDown) return;
    const dx = e.pageX - startX;
    track.scrollLeft = scrollLeft - dx;
  });

  // Touch drag
  track.addEventListener('touchstart',(e)=>{isDown=true; startX=e.touches[0].pageX; scrollLeft=track.scrollLeft;},{passive:true});
  track.addEventListener('touchend',()=>{isDown=false;});
  track.addEventListener('touchmove',(e)=>{ if(!isDown) return; const dx=e.touches[0].pageX-startX; track.scrollLeft=scrollLeft-dx; },{passive:true});

  // snap observer to update index
  let snapTO;
  track.addEventListener('scroll', ()=>{
    if(snapTO) clearTimeout(snapTO);
    snapTO = setTimeout(()=>{
      let nearest = 0, min = Infinity;
      slides.forEach((s,i)=>{
        const rect = s.getBoundingClientRect();
        const center = rect.left + rect.width/2;
        const diff = Math.abs(center - window.innerWidth/2);
        if(diff < min){ min=diff; nearest=i; }
      });
      index = nearest; mark();
    }, 120);
  });

  mark(); start();
}

/* ===== Infinite ribbon (auto + manual drag) ===== */
function makeRibbon(root){
  const track = qs('.ribbon-track', root);
  const speed = +(root.dataset.speed || 0.4); // px per frame approx
  // duplicate content for seamless loop
  track.innerHTML = track.innerHTML + track.innerHTML;
  let x = 0, playing = true, raf;

  function step(){
    if(playing){
      x -= speed;
      const width = track.scrollWidth / 2;
      if(-x >= width) x += width;
      track.style.transform = `translateX(${x}px)`;
    }
    raf = requestAnimationFrame(step);
  }
  step();

  // pause on hover/press
  root.addEventListener('mouseenter', ()=> playing=false);
  root.addEventListener('mouseleave', ()=> playing=true);

  // drag manual
  let dragging=false, startX, startOffset;
  root.addEventListener('mousedown', (e)=>{ dragging=true; startX=e.pageX; startOffset=x; playing=false; });
  window.addEventListener('mouseup', ()=>{ dragging=false; playing=true; });
  window.addEventListener('mousemove', (e)=>{ if(!dragging) return; x = startOffset + (e.pageX-startX); track.style.transform=`translateX(${x}px)`; });

  // touch
  root.addEventListener('touchstart', (e)=>{ dragging=true; startX=e.touches[0].pageX; startOffset=x; playing=false; }, {passive:true});
  root.addEventListener('touchend', ()=>{ dragging=false; playing=true; }, {passive:true});
  root.addEventListener('touchmove', (e)=>{ if(!dragging) return; x = startOffset + (e.touches[0].pageX-startX); track.style.transform=`translateX(${x}px)`; }, {passive:true});
}

/* boot */
window.addEventListener('DOMContentLoaded', ()=>{
  qsa('.carousel').forEach(makeCarousel);
  qsa('.ribbon').forEach(makeRibbon);
});
