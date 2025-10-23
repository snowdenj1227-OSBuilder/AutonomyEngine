// Keep nav background solid after first scroll
const nav = document.querySelector('.nav');
const solid = () => nav.style.background = 'rgba(16,17,19,.9)';
const glass = () => nav.style.background = 'linear-gradient(to bottom, rgba(16,17,19,.6), rgba(16,17,19,0))';
let scrolled = false;
window.addEventListener('scroll', () => {
  if (window.scrollY > 8 && !scrolled){ solid(); scrolled = true; }
  else if (window.scrollY <= 8 && scrolled){ glass(); scrolled = false; }
});

// Placeholder for modal open (we wire the interactive demo next)
document.getElementById('seeItWork')?.addEventListener('click', () => {
  // TODO: open modal
  console.log('Open interactive modal');
});
