/* =========================================================
   E-PORTFOLIO — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initParticles();
  initAOS();
  initHamburger();
  initScrollSpy();
  initDarkMode();
  initBackToTop();
  initSkillBars();
  initPdfChecks();
  initPdfModal();
});

/* ---------- Loading screen ---------- */
function initLoadingScreen(){
  const screen = document.getElementById('loadingScreen');
  window.addEventListener('load', () => {
    setTimeout(() => screen.classList.add('hidden'), 500);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => screen.classList.add('hidden'), 3000);
}

/* ---------- Subtle background particles ---------- */
function initParticles(){
  const container = document.getElementById('particles');
  const count = window.innerWidth < 768 ? 12 : 24;
  for (let i = 0; i < count; i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 4 + Math.random() * 8;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (10 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

/* ---------- AOS (scroll reveal) ---------- */
function initAOS(){
  if (window.AOS){
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }
}

/* ---------- Mobile hamburger menu ---------- */
function initHamburger(){
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Scroll spy: highlight active nav link ---------- */
function initScrollSpy(){
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));
}

/* ---------- Dark mode toggle (remembers preference) ---------- */
function initDarkMode(){
  const toggle = document.getElementById('darkToggle');
  const icon = toggle.querySelector('i');
  const saved = localStorage.getItem('ewaste-theme');

  if (saved === 'dark'){
    document.body.classList.add('dark');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    icon.classList.toggle('fa-moon', !isDark);
    icon.classList.toggle('fa-sun', isDark);
    localStorage.setItem('ewaste-theme', isDark ? 'dark' : 'light');
  });
}

/* ---------- Back to top button ---------- */
function initBackToTop(){
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Animated skill bars (fires once visible) ---------- */
function initSkillBars(){
  const items = document.querySelectorAll('.skill-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const item = entry.target;
        const percent = item.dataset.percent || 0;
        const fill = item.querySelector('.skill-fill');
        fill.style.width = percent + '%';
        io.unobserve(item);
      }
    });
  }, { threshold: 0.4 });

  items.forEach(item => io.observe(item));
}

/* ---------- Check whether activity / assignment PDFs actually exist ----------
   If a linked PDF is missing, disable the View/Download buttons gracefully
   and show a "PDF not added yet" note instead of a broken link. */
function initPdfChecks(){
  const blocks = document.querySelectorAll('.doc-actions');

  blocks.forEach(block => {
    const url = block.dataset.view;
    if (!url) return;

    fetch(url, { method: 'HEAD' })
      .then(res => {
        if (!res.ok) markMissing(block);
      })
      .catch(() => markMissing(block));
  });
}

function markMissing(block){
  block.querySelectorAll('a').forEach(a => {
    a.classList.add('is-disabled');
    a.style.pointerEvents = 'none';
    a.style.opacity = '0.45';
  });
  const note = block.nextElementSibling;
  if (note && note.classList.contains('doc-missing-note')){
    note.hidden = false;
    note.style.display = 'block';
  }
}

/* ---------- PDF modal viewer (optional nicer preview instead of new tab) ----------
   Currently "View" buttons open target="_blank" per spec. This modal is wired up
   for future use — call openPdfModal(url) from anywhere if you'd rather preview
   in-page instead of opening a new browser tab. */
function initPdfModal(){
  const modal = document.getElementById('pdfModal');
  const frame = document.getElementById('pdfFrame');
  const closeBtn = document.getElementById('pdfModalClose');

  window.openPdfModal = (url) => {
    frame.src = url;
    modal.hidden = false;
  };

  const close = () => {
    modal.hidden = true;
    frame.src = '';
  };

  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
}
