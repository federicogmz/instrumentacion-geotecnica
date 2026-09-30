/* ==========================================================================
   Universidad EAFIT - Instrumentación Geotécnica
   Reveal.js Presentation Core Controller
   Soporte para Modo Claro (EAFIT Oficial) y Modo Oscuro, Pantalla Completa y KaTeX
   ========================================================================== */

// 1. Inicialización Inmediata del Tema para evitar parpadeo (FOUC)
(function initTheme() {
  const savedTheme = localStorage.getItem('eafit-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  // 2. Inicialización de Reveal.js (1920x1080 Widescreen)
  if (typeof Reveal !== 'undefined') {
    Reveal.initialize({
      width: 1920,
      height: 1080,
      margin: 0.02,
      minScale: 0.2,
      maxScale: 2.0,

      // Navegación
      hash: true,
      history: true,
      slideNumber: 'c/t',
      controls: true,
      controlsLayout: 'bottom-right',
      progress: true,
      center: false,
      transition: 'slide',
      transitionSpeed: 'default',
      backgroundTransition: 'fade',

      // Atajos de Teclado
      keyboard: {
        70: () => toggleFullScreen(), // Tecla 'F': Pantalla Completa
        84: () => toggleTheme(),      // Tecla 'T': Alternar Modo Claro / Oscuro
      },

      // Plugins
      plugins: [
        RevealHighlight,
        RevealMath.KaTeX
      ],

      // Configuración KaTeX
      katex: {
        version: '0.16.8',
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    });
  }

  // 2b. Ajuste automático del cuerpo de cada lámina (sin desbordes ni vacíos grandes)
  if (typeof Reveal !== 'undefined') {
    const refit = () => fitSlide(Reveal.getCurrentSlide());
    Reveal.on('ready', () => {
      wrapAllSlides();
      const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      ready.then(refit);
    });
    Reveal.on('slidechanged', refit);
    Reveal.on('resize', refit);
    // Las imágenes cargan tarde: recalcular cuando terminen
    window.addEventListener('load', refit);
    document.querySelectorAll('.reveal img').forEach(img => {
      if (!img.complete) img.addEventListener('load', refit, { once: true });
    });
  }

  // 3. Controladores de Botones de Interfaz
  const fsBtn = document.getElementById('btn-fullscreen');
  if (fsBtn) {
    fsBtn.addEventListener('click', toggleFullScreen);
  }

  const ovBtn = document.getElementById('btn-overview');
  if (ovBtn) {
    ovBtn.addEventListener('click', () => {
      if (typeof Reveal !== 'undefined') Reveal.toggleOverview();
    });
  }

  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    updateThemeButtonUI();
    themeBtn.addEventListener('click', toggleTheme);
  }
});

// Función para alternar Modo Claro / Oscuro
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('eafit-theme', newTheme);
  updateThemeButtonUI();
}

// Actualiza el texto y apariencia del botón de tema
function updateThemeButtonUI() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const themeText = document.getElementById('theme-text');
  const themeIcon = document.getElementById('theme-icon');

  if (themeText) {
    themeText.textContent = currentTheme === 'light' ? 'Modo Oscuro' : 'Modo Claro';
  }
  if (themeIcon) {
    themeIcon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
  }
}

// Función de Pantalla Completa
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn(`Error al activar pantalla completa: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}


// ==========================================================================
// AJUSTE AUTOMÁTICO DE LÁMINAS
// Los títulos (h1/h2/h3 iniciales) quedan fijos; el resto del contenido se envuelve
// en .fit-wrap y se escala: se reduce si desborda el lienzo y se amplía si queda
// mucho espacio vacío. El ancho se compensa (100/s %) para que el texto reflowee.
// ==========================================================================
const FIT_MIN = 0.55;      // reducción máxima
const FIT_MAX_TEXT = 1.25;   // ampliación máxima en láminas con texto
const FIT_MAX_VISUAL = 1.7;  // ampliación máxima en láminas casi solo de imagen
const FIT_FILL = 0.95;     // fracción del alto disponible a llenar en láminas escasas
const SLIDE_H = 1080;      // alto lógico del lienzo Reveal
const SLIDE_PAD_BOTTOM = 60;

function wrapAllSlides() {
  document.querySelectorAll('.reveal .slides > section').forEach(sec => {
    if (sec.classList.contains('slide-cover') || sec.querySelector(':scope > .fit-wrap')) return;
    const kids = Array.from(sec.children);
    let i = 0;
    // Bloque de encabezado: h1/h2/h3 consecutivos al inicio de la lámina
    while (i < kids.length && /^H[1-3]$/.test(kids[i].tagName)) i++;
    const body = kids.slice(i);
    if (!body.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'fit-wrap';
    body.forEach(k => wrap.appendChild(k));
    sec.appendChild(wrap);
  });
}

function fitSlide(sec) {
  if (!sec || sec.tagName !== 'SECTION') return;
  const wrap = sec.querySelector(':scope > .fit-wrap');
  if (!wrap) return;
  const scale = (typeof Reveal !== 'undefined' && Reveal.getScale()) || 1;
  const apply = s => {
    wrap.style.transform = s === 1 ? '' : `scale(${s})`;
    wrap.style.width = s === 1 ? '' : `${100 / s}%`;
  };
  wrap.style.marginTop = '';
  apply(1);

  const top = (wrap.getBoundingClientRect().top - sec.getBoundingClientRect().top) / scale;
  const room = SLIDE_H - SLIDE_PAD_BOTTOM - top;
  if (room <= 0) return;

  const used = s => wrap.scrollHeight * s;
  const fits = (s, limit) => used(s) <= limit && wrap.scrollWidth <= wrap.clientWidth + 2;
  // Lámina "visual": casi sin texto y con imágenes -> se puede ampliar más
  const textOnly = wrap.cloneNode(true);
  textOnly.querySelectorAll('svg').forEach(n => n.remove());
  const visual = wrap.querySelector('img, svg') && textOnly.textContent.replace(/\s+/g, ' ').trim().length < 220;

  if (!fits(1, room)) {
    let s = 1;
    while (s > FIT_MIN) {
      s = Math.round((s - 0.02) * 100) / 100;
      apply(s);
      if (fits(s, room)) break;
    }
  } else if (used(1) < room * 0.8) {
    const max = visual ? FIT_MAX_VISUAL : FIT_MAX_TEXT;
    let s = 1, best = 1;
    while (s < max) {
      s = Math.round((s + 0.05) * 100) / 100;
      apply(s);
      if (fits(s, room * FIT_FILL)) best = s; else break;
    }
    apply(best);
    // Láminas visuales: centrar verticalmente el sobrante
    if (visual) wrap.style.marginTop = `${Math.max(0, (room - used(best)) / 2)}px`;
  }
}
