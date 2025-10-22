
const track = document.querySelector('.carousel-track');
let auto = true;
let step = 1;
function loop(){ if (!track) return;
  if (auto){ track.scrollLeft += step;
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth || track.scrollLeft <= 0){ step *= -1; }
  }
  requestAnimationFrame(loop);
}
if (track){
  track.addEventListener('pointerdown', ()=>auto=false);
  track.addEventListener('pointerup', ()=>auto=true);
  track.addEventListener('touchstart', ()=>auto=false);
  track.addEventListener('touchend', ()=>auto=true);
  requestAnimationFrame(loop);
}
