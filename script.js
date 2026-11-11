const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
  menu.querySelector('span').textContent = open ? '−' : '+';
});
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  menu.querySelector('span').textContent = '+';
}
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  document.querySelectorAll('.section-heading, .about-body, .project, .timeline article, .skill-rows > div').forEach(el => {
    el.classList.add('reveal'); observer.observe(el);
  });
  const sections = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navigation.querySelectorAll('a').forEach(a => {
      const active = a.hash === '#' + entry.target.id;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(section => sections.observe(section));
}
const portrait = document.querySelector('[data-tilt]');
portrait.addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType === 'touch') return;
  const rect = portrait.getBoundingClientRect();
  portrait.style.setProperty('--ry', ((event.clientX - rect.left) / rect.width - .5) * 9 + 'deg');
  portrait.style.setProperty('--rx', -((event.clientY - rect.top) / rect.height - .5) * 7 + 'deg');
});
portrait.addEventListener('pointerleave', () => {
  portrait.style.setProperty('--ry', '0deg'); portrait.style.setProperty('--rx', '0deg');
});
let ticking = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.progress').style.width = (total > 0 ? window.scrollY / total * 100 : 0) + '%';
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); } }, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('swamypalacharla@gmail.com');
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = 'Email: swamypalacharla@gmail.com';
  }
});
