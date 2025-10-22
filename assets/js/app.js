// Theme toggle
(function(){
  const html=document.documentElement;
  const btn=document.getElementById('toggleTheme');
  const key='ae-theme';
  const saved=localStorage.getItem(key);
  if(saved){ html.setAttribute('data-theme', saved); }
  btn.addEventListener('click',()=>{
    const next=html.getAttribute('data-theme')==='dark'?'light':'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(key, next);
  });
})();
// Reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:"-10% 0px -10% 0px",threshold:.08});
document.querySelectorAll('[data-reveal], .hero-inner').forEach(n=>io.observe(n));
// Features carousel
(function(){
  const track=document.getElementById('fTrack'); if(!track) return;
  const dots=document.getElementById('fDots');
  const slides=[...track.children];
  slides.forEach((_,i)=>{const b=document.createElement('button'); if(i===0)b.classList.add('active'); b.onclick=()=>go(i,true); dots.appendChild(b)});
  let i=0, timer, interval=+document.querySelector('.carousel')?.dataset?.interval || 4200;
  function mark(){dots.querySelectorAll('button').forEach((d,di)=>d.classList.toggle('active',di===i));}
  function go(n,manual){i=(n+slides.length)%slides.length;slides[i].scrollIntoView({behavior:'smooth',inline:'center'});mark();if(manual){restart();}}
  function next(){go(i+1,false)}
  function start(){timer=setInterval(next,interval)}
  function stop(){clearInterval(timer)}
  function restart(){stop();start()}
  start();
  // drag
  let down=false,sx=0,sl=0;
  track.addEventListener('pointerdown',e=>{down=true;sx=e.pageX;sl=track.scrollLeft;track.setPointerCapture(e.pointerId)});
  window.addEventListener('pointerup',()=>{down=false});
  window.addEventListener('pointermove',e=>{if(!down) return;track.scrollLeft=sl-(e.pageX-sx)});
})();
// Infinite ribbon
(function(){
  const wrap=document.getElementById('ribbon'); const rack=document.getElementById('rTrack');
  if(!wrap||!rack) return;
  rack.innerHTML += rack.innerHTML;
  let x=0, play=true, speed=.6;
  function step(){ if(play){ x-=speed; const w=rack.scrollWidth/2; if(-x>=w) x+=w; rack.style.transform=`translateX(${x}px)`; } requestAnimationFrame(step); }
  step();
  wrap.addEventListener('mouseenter',()=>play=false);
  wrap.addEventListener('mouseleave',()=>play=true);
  let drag=false,sx=0,start=0;
  wrap.addEventListener('mousedown',e=>{drag=true;sx=e.pageX;start=x;play=false});
  window.addEventListener('mouseup',()=>{drag=false;play=true});
  window.addEventListener('mousemove',e=>{if(!drag) return;x=start+(e.pageX-sx);rack.style.transform=`translateX(${x}px)`});
  wrap.addEventListener('touchstart',e=>{drag=true;sx=e.touches[0].pageX;start=x;play=false},{passive:true});
  wrap.addEventListener('touchend',()=>{drag=false;play=true},{passive:true});
  wrap.addEventListener('touchmove',e=>{if(!drag) return;x=start+(e.touches[0].pageX-sx);rack.style.transform=`translateX(${x}px)`},{passive:true});
})();