// Ensure all project external links open in a new tab reliably
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-link-btn').forEach(link => {
    link.addEventListener('click', e => {
      // Always open in new tab, even if browser JS navigation interferes
      window.open(link.href, '_blank', 'noopener');
      e.preventDefault();
    });
  });
});
// scripts.js - extracted from index.html

/* THEME */
const btn = document.getElementById('theme-btn');
const html = document.documentElement;
let dark = true;
btn.addEventListener('click', () => {
  dark = !dark;
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  btn.textContent = dark ? '☀' : '☾';
});

/* SCROLL REVEAL */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ANIMATED BACKGROUND */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);

const pts = Array.from({ length: 55 }, () => ({
  x: Math.random() * canvas.width, y: Math.random() * canvas.height,
  r: Math.random() * 1.4 + .3,
  vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
  hue: [165, 200, 280][Math.floor(Math.random() * 3)],
  alpha: Math.random() * .5 + .15,
}));

let t = 0;
(function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = html.getAttribute('data-theme') !== 'light';
  [165, 200, 280].forEach((hue, w) => {
    const amp = 18 + w * 12, freq = .0012 + w * .0005, yBase = canvas.height * (.25 + w * .25);
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 3) {
      const y = yBase + Math.sin(x * freq + t + w * 2) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isDark ? `hsla(${hue},65%,62%,.07)` : `hsla(${hue},55%,40%,.05)`;
    ctx.lineWidth = 1; ctx.stroke();
  });
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? `hsla(${p.hue},70%,65%,${p.alpha})` : `hsla(${p.hue},55%,35%,${p.alpha * .5})`;
    ctx.fill();
  });
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
      if (d < 100) {
        const a = (1 - d / 100) * (isDark ? .07 : .04);
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = isDark ? `rgba(62,207,173,${a})` : `rgba(13,158,129,${a})`;
        ctx.lineWidth = .6; ctx.stroke();
      }
    }
  }
  t += .008; requestAnimationFrame(draw);
})();

/* HERO PARALLAX */
const heroName = document.querySelector('.hero-name');
document.addEventListener('mousemove', e => {
  heroName.style.transform = `translate(${(e.clientX / window.innerWidth - .5) * 8}px,${(e.clientY / window.innerHeight - .5) * 4}px)`;
});
