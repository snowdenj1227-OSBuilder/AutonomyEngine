
// Year
(()=>{const y=document.getElementById('y'); if(y) y.textContent=new Date().getFullYear();})();
// Reveal
(()=>{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{rootMargin:"-10% 0px -10% 0px",threshold:.08});
  document.querySelectorAll('[data-reveal]').forEach(n=>io.observe(n));
})();
// Features manual
(()=>{
  const track=document.getElementById('featTrack'); if(!track) return;
  const prev=document.querySelector('#featCarousel .car-arrow.prev');
  const next=document.querySelector('#featCarousel .car-arrow.next');
  const dots=document.getElementById('featDots');
  const slides=[...track.children];
  slides.forEach((_,i)=>{const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label','Go to slide '+(i+1)); if(i===0) b.setAttribute('aria-current','true'); b.onclick=()=>goTo(i); dots.appendChild(b)});
  const cardWidth=()=>slides[0].getBoundingClientRect().width+20; let index=0, busy=false;
  function goTo(i){ if(busy) return; busy=true; index=Math.max(0,Math.min(slides.length-1,i)); track.scrollTo({left:index*cardWidth(),behavior:'smooth'});
    dots.querySelectorAll('button').forEach((d,di)=>d.setAttribute('aria-current',di===index?'true':'false')); setTimeout(()=>busy=false,380); }
  prev.onclick=()=>goTo(index-1); next.onclick=()=>goTo(index+1);
  let t; track.addEventListener('scroll',()=>{clearTimeout(t); t=setTimeout(()=>{const i=Math.round(track.scrollLeft/cardWidth()); if(i!==index){index=i; dots.querySelectorAll('button').forEach((d,di)=>d.setAttribute('aria-current',di===index?'true':'false'));}},120)});
  addEventListener('resize',()=>goTo(index));
})();
// Pipeline big-cards auto scroll (seamless loop)
(()=>{
  const track=document.getElementById('pipeTrack'); if(!track) return;
  if(!track.dataset.cloned){ [...track.children].forEach(el=>track.appendChild(el.cloneNode(true))); track.dataset.cloned='1'; }
})();
// Waitlist
(()=>{
  const form=document.getElementById('wlForm'); const msg=document.getElementById('wlMsg'); if(!form) return;
  form.addEventListener('submit',async e=>{
    e.preventDefault(); msg.textContent='Submitting…';
    const data=new FormData(form);
    const ints=[...form.querySelectorAll('input[name="interests"]:checked')].map(i=>i.value); data.set('interests',ints.join(', '));
    try{const res=await fetch(window.FORM_ENDPOINT||'https://formspree.io/f/XXXXXXXX',{method:'POST',body:data,headers:{'Accept':'application/json'}});
      if(res.ok){msg.textContent='You’re on the list. Welcome!'; form.reset();} else {msg.textContent='Could not submit. Please try again.';}
    }catch(_){msg.textContent='Network error. Please try again.';}
  });
})();
