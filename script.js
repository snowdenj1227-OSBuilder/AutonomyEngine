// Smooth scroll + Slider with autoplay and keyboard support
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

  // Slider: list your slides here; drop files in /assets/slider/
  const slides = [
    "/assets/slider/slide-1.svg",
    "/assets/slider/slide-2.svg",
    "/assets/slider/slide-3.svg"
  ];
  const captions = [
    "Operators craft intent → audited systems",
    "Code • Tests • CAD • Proofs",
    "Ethical autonomy — privacy by design"
  ];

  const track = document.getElementById('glider-track');
  if(track){
    slides.forEach((src, i) => {
      const card = document.createElement('div');
      card.className = 'slide';
      card.innerHTML = `<img src="${src}" alt="" /><div class="caption">${captions[i]||""}</div>`;
      track.appendChild(card);
    });

    const prev = document.querySelector('.glider-btn.prev');
    const next = document.querySelector('.glider-btn.next');
    const step = () => track.clientWidth * 0.9;

    prev.addEventListener('click', () => track.scrollBy({left: -step(), behavior:'smooth'}));
    next.addEventListener('click', () => track.scrollBy({left: step(), behavior:'smooth'}));

    // Keyboard support
    track.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowRight') next.click();
      if(e.key === 'ArrowLeft') prev.click();
    });

    // Auto-play
    let dir = 1;
    setInterval(() => {
      if(Math.abs(track.scrollLeft + track.clientWidth - track.scrollWidth) < 4) dir = -1;
      if(track.scrollLeft <= 0) dir = 1;
      track.scrollBy({left: dir*step()/3, behavior:'smooth'});
    }, 3500);
  }
});
<script>
(function () {
  const track = document.getElementById('pipelineTrack');
  const marquee = document.getElementById('pipelineMarquee');
  if (!track || !marquee) return;

  // 1) Build a long track by cloning the initial set until we exceed a 3x viewport width.
  const seed = Array.from(track.children);
  function extendTrack() {
    const needed = (window.innerWidth * 3);
    while (track.scrollWidth < needed) {
      seed.forEach(node => track.appendChild(node.cloneNode(true)));
    }
  }
  extendTrack();
  window.addEventListener('resize', () => {
    // If someone shrinks the window, extend again if needed.
    extendTrack();
  });

  // 2) Animate left forever, recycling cards seamlessly.
  let x = 0;
  let speed = 0.6;                           // feel free to tweak
  let paused = false;

  function tick() {
    if (!paused) {
      x -= speed;
      // If the first card is fully out of view, move it to the end and bump x forward by its width.
      const first = track.firstElementChild;
      if (first) {
        const w = first.getBoundingClientRect().width + 24; // +gap
        if (Math.abs(x) >= w) {
          track.appendChild(first);
          x += w;
        }
      }
      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(tick);
  }
  tick();

  // 3) Pause on hover for better readability.
  marquee.addEventListener('mouseenter', () => paused = true);
  marquee.addEventListener('mouseleave', () => paused = false);
})();
</script>
