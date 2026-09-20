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
