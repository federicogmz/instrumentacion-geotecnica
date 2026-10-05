/**
 * layout-resizer.js
 * Divisor interactivo y minimalista entre el panel de Teoría y el Editor de Código.
 * 
 * Funcionalidades:
 * - Slider minimalista entre ambas secciones (drag & drop con mouse o touch)
 * - Doble clic en el divisor para centrar al 50% / 50%
 * - Rango acotado seguro (25% a 75%) para garantizar legibilidad en ambas secciones
 * - Refresco automático de CodeMirror al cambiar dimensiones
 * - Persistencia del ancho preferido en localStorage
 */

(function () {
  let isProgrammaticResize = false;
  let state = {
    theoryPct: 50,
    isDragging: false,
    startX: 0,
    startPct: 50,
  };

  const STORAGE_KEY = "geotech_workspace_split";

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const val = parseFloat(saved);
      if (!isNaN(val) && val >= 25 && val <= 75) {
        state.theoryPct = val;
      }
    } else {
      state.theoryPct = window.innerWidth > 1200 ? 55 : 50;
    }

    applyLayout(state.theoryPct, false);
    attachEvents();
  }

  function applyLayout(pct, save = true) {
    pct = Math.max(25, Math.min(75, Math.round(pct)));
    state.theoryPct = pct;

    const grid = document.getElementById("workspace-grid");
    const theoryPane = document.getElementById("theory-pane");
    const editorPane = document.getElementById("editor-pane");
    const resizer = document.getElementById("workspace-resizer");

    if (!grid || !theoryPane || !editorPane) return;

    const savedSec = localStorage.getItem("ig_last_section");
    const isTheory = grid.classList.contains("mode-theory-full") || 
                     (window.courseApp && window.courseApp.currentSection === "teoria") ||
                     (!window.courseApp && (!savedSec || savedSec === "teoria"));

    if (isTheory) {
      if (resizer) resizer.style.display = "none";
      if (editorPane) editorPane.style.display = "none";
      theoryPane.style.display = "flex";
      theoryPane.style.flex = "1 1 100%";
      theoryPane.style.width = "100%";
      if (save) localStorage.setItem(STORAGE_KEY, pct);
      return;
    }

    // Modo Dividido (Módulos 1-3 y Sandbox)
    theoryPane.style.display = "flex";
    editorPane.style.display = "flex";
    if (resizer) resizer.style.display = "flex";

    // Proporciones fluidas seguras
    theoryPane.style.flex = `0 0 calc(${pct}% - 5px)`;
    editorPane.style.flex = `0 0 calc(${100 - pct}% - 5px)`;

    if (save) {
      localStorage.setItem(STORAGE_KEY, pct);
    }

    refreshCodeMirror();
  }

  function refreshCodeMirror() {
    if (window.courseApp && window.courseApp.editor) {
      setTimeout(() => {
        window.courseApp.editor.refresh();
      }, 50);
    }
    isProgrammaticResize = true;
    window.dispatchEvent(new Event("resize"));
    isProgrammaticResize = false;
  }

  function attachEvents() {
    const resizer = document.getElementById("workspace-resizer");
    const grid = document.getElementById("workspace-grid");

    if (resizer && grid) {
      // Doble clic para restablecer al 50% / 50%
      resizer.addEventListener("dblclick", () => {
        applyLayout(50);
      });

      // Arrastre con Mouse
      resizer.addEventListener("mousedown", (e) => {
        state.isDragging = true;
        state.startX = e.clientX;
        state.startPct = state.theoryPct;
        document.body.classList.add("is-resizing-workspace");
        e.preventDefault();
      });

      window.addEventListener("mousemove", (e) => {
        if (!state.isDragging) return;
        const rect = grid.getBoundingClientRect();
        if (rect.width <= 0) return;

        const offsetX = e.clientX - rect.left;
        const newPct = (offsetX / rect.width) * 100;
        applyLayout(newPct, false);
      });

      window.addEventListener("mouseup", () => {
        if (state.isDragging) {
          state.isDragging = false;
          document.body.classList.remove("is-resizing-workspace");
          localStorage.setItem(STORAGE_KEY, state.theoryPct);
          refreshCodeMirror();
        }
      });

      // Arrastre Táctil (Móviles / Tablets)
      resizer.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          state.isDragging = true;
          state.startX = e.touches[0].clientX;
          state.startPct = state.theoryPct;
          document.body.classList.add("is-resizing-workspace");
        }
      }, { passive: true });

      window.addEventListener("touchmove", (e) => {
        if (!state.isDragging || e.touches.length !== 1) return;
        const rect = grid.getBoundingClientRect();
        if (rect.width <= 0) return;

        const offsetX = e.touches[0].clientX - rect.left;
        const newPct = (offsetX / rect.width) * 100;
        applyLayout(newPct, false);
      }, { passive: true });

      window.addEventListener("touchend", () => {
        if (state.isDragging) {
          state.isDragging = false;
          document.body.classList.remove("is-resizing-workspace");
          localStorage.setItem(STORAGE_KEY, state.theoryPct);
          refreshCodeMirror();
        }
      });
    }

    // Reajustar en cambio de tamaño de ventana
    window.addEventListener("resize", () => {
      if (isProgrammaticResize) return;
      if (window.innerWidth > 900) {
        applyLayout(state.theoryPct, false);
      }
    });
  }

  // API pública
  window.workspaceResizer = {
    setSplit: applyLayout,
    getSplit: () => state.theoryPct,
    applyCurrentLayout: () => applyLayout(state.theoryPct, false),
  };

  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
})();
