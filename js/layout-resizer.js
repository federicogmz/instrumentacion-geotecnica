/**
 * layout-resizer.js
 * Controlador interactivo para desplazar, redimensionar y ocultar/mostrar
 * los dos paneles principales (Teoría / Contenido a la izquierda vs Editor / Consola a la derecha).
 * 
 * Funcionalidades:
 * - Slider continuo (0% a 100%)
 * - Barra divisoria arrastrable (Splitter drag & drop)
 * - Botones rápidos de ajuste (100% Teoría, 65/35, 50/50, 35/65, 100% Editor)
 * - Chevrons de colapso y píldoras flotantes para restaurar
 * - Doble clic para centrar 50/50
 * - Refresco automático de CodeMirror al cambiar dimensiones
 * - Persistencia del estado en localStorage
 */

(function () {
  let isProgrammaticResize = false;
  let state = {
    theoryPct: 50, // porcentaje de ancho para el panel de teoría (0 a 100)
    isDragging: false,
    startX: 0,
    startPct: 50,
  };

  const STORAGE_KEY = "geotech_workspace_split";

  function init() {
    // Cargar preferencia guardada si existe (por defecto 55% para dar más aire a la teoría)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const val = parseFloat(saved);
      if (!isNaN(val) && val >= 0 && val <= 100) {
        state.theoryPct = val;
      }
    } else {
      // Si la pantalla es amplia, 55% de inicio evita que la teoría se sienta apretada
      state.theoryPct = window.innerWidth > 1200 ? 55 : 50;
    }

    applyLayout(state.theoryPct, false);
    attachEvents();
  }

  function applyLayout(pct, save = true) {
    pct = Math.max(0, Math.min(100, Math.round(pct)));
    state.theoryPct = pct;

    const grid = document.getElementById("workspace-grid");
    const theoryPane = document.getElementById("theory-pane");
    const editorPane = document.getElementById("editor-pane");
    const slider = document.getElementById("workspace-layout-slider");
    const resizer = document.getElementById("workspace-resizer");
    const btnRestoreTheory = document.getElementById("btn-restore-theory");
    const btnRestoreEditor = document.getElementById("btn-restore-editor");
    const pctBadge = document.getElementById("layout-pct-badge");

    if (!grid || !theoryPane || !editorPane) return;

    if (slider) slider.value = pct;

    if (pctBadge) {
      if (pct === 0) {
        pctBadge.textContent = "100% Editor";
      } else if (pct === 100) {
        pctBadge.textContent = "100% Teoría";
      } else {
        pctBadge.textContent = `${pct}% Teoría / ${100 - pct}% Editor`;
      }
    }

    // Actualizar botones de preset activos
    document.querySelectorAll(".layout-preset-btn").forEach(btn => {
      const p = parseInt(btn.dataset.pct, 10);
      btn.classList.toggle("active", p === pct);
    });

    if (pct <= 4) {
      // Ocultar completamente el panel de teoría
      grid.classList.add("theory-collapsed");
      grid.classList.remove("editor-collapsed");
      theoryPane.style.display = "none";
      editorPane.style.display = "flex";
      editorPane.style.flex = "1 1 100%";
      if (resizer) resizer.style.display = "none";
      if (btnRestoreTheory) btnRestoreTheory.classList.add("visible");
      if (btnRestoreEditor) btnRestoreEditor.classList.remove("visible");
    } else if (pct >= 96) {
      // Ocultar completamente el panel del editor
      grid.classList.add("editor-collapsed");
      grid.classList.remove("theory-collapsed");
      editorPane.style.display = "none";
      theoryPane.style.display = "flex";
      theoryPane.style.flex = "1 1 100%";
      if (resizer) resizer.style.display = "none";
      if (btnRestoreEditor) btnRestoreEditor.classList.add("visible");
      if (btnRestoreTheory) btnRestoreTheory.classList.remove("visible");
    } else {
      // Ambos paneles visibles con su ancho relativo
      grid.classList.remove("theory-collapsed", "editor-collapsed");
      theoryPane.style.display = "flex";
      editorPane.style.display = "flex";
      if (resizer) resizer.style.display = "flex";

      // Aplicar proporción fluida
      theoryPane.style.flex = `0 0 calc(${pct}% - 7px)`;
      editorPane.style.flex = `0 0 calc(${100 - pct}% - 7px)`;

      if (btnRestoreTheory) btnRestoreTheory.classList.remove("visible");
      if (btnRestoreEditor) btnRestoreEditor.classList.remove("visible");
    }

    if (save) {
      localStorage.setItem(STORAGE_KEY, pct);
    }

    // Notificar a CodeMirror y a la ventana para recalcular dimensiones
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
    // 1. Slider de rango continuo
    const slider = document.getElementById("workspace-layout-slider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        applyLayout(parseFloat(e.target.value));
      });
    }

    // 2. Botones de Preset rápido
    document.querySelectorAll(".layout-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const targetPct = parseFloat(btn.dataset.pct);
        applyLayout(targetPct);
      });
    });

    // 3. Botones chevrons en el resizer
    const btnColTheory = document.getElementById("btn-collapse-theory");
    const btnColEditor = document.getElementById("btn-collapse-editor");

    if (btnColTheory) {
      btnColTheory.addEventListener("click", (e) => {
        e.stopPropagation();
        if (state.theoryPct <= 10) {
          applyLayout(50); // Restaurar a equilibrado
        } else {
          applyLayout(0); // Ocultar teoría
        }
      });
    }

    if (btnColEditor) {
      btnColEditor.addEventListener("click", (e) => {
        e.stopPropagation();
        if (state.theoryPct >= 90) {
          applyLayout(50); // Restaurar a equilibrado
        } else {
          applyLayout(100); // Ocultar editor
        }
      });
    }

    // 4. Botones flotantes de restauración
    const btnResTheory = document.getElementById("btn-restore-theory");
    const btnResEditor = document.getElementById("btn-restore-editor");

    if (btnResTheory) {
      btnResTheory.addEventListener("click", () => applyLayout(50));
    }
    if (btnResEditor) {
      btnResEditor.addEventListener("click", () => applyLayout(50));
    }

    // 5. Drag & Drop de la barra divisoria (Splitter)
    const resizer = document.getElementById("workspace-resizer");
    const grid = document.getElementById("workspace-grid");

    if (resizer && grid) {
      // Doble clic para resetear a 50/50
      resizer.addEventListener("dblclick", () => {
        applyLayout(50);
      });

      // Mouse drag
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

      // Touch drag para móviles / tablets
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

    // Reajustar al rotar o redimensionar pantalla
    window.addEventListener("resize", () => {
      if (isProgrammaticResize) return;
      if (window.innerWidth <= 900) {
        // En móviles la cuadrícula se apila verticalmente por CSS
      } else {
        applyLayout(state.theoryPct, false);
      }
    });
  }

  // Exportar para acceso externo
  window.workspaceResizer = {
    setSplit: applyLayout,
    getSplit: () => state.theoryPct,
  };

  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
})();
