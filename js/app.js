/**
 * app.js — v3.0 (Gamified Edition)
 * ─────────────────────────────────────────────────────────────────────────────
 * Mejoras v3.0:
 *   • Panel lateral colapsable con mapa completo de lecciones (P1, N1)
 *   • Transición automática entre módulos al terminar el último ejercicio (P2)
 *   • Persistencia y restauración de posición ("continuar donde lo dejé") (P3)
 *   • Indicadores de progreso por módulo en el nav header (G4)
 *   • Animación de confeti/partículas CSS al completar ejercicio (G2)
 *   • Sistema de 6 badges desbloqueables (G3)
 *   • Barra de progreso segmentada por módulos (G1)
 *   • Card de celebración de módulo completo (G1 extra)
 *   • Fix preset "50/50" activo al inicio (N4)
 *   • Fix placeholder progress-count en HTML (T1)
 *   • Breakpoints móvil mejorados (R1, R2) via CSS
 * ─────────────────────────────────────────────────────────────────────────────
 */

class CourseApp {
  constructor() {
    // ── Estado principal ──────────────────────────────────────────────────────
    this.currentSection  = localStorage.getItem("ig_last_section")  || "teoria";
    this.currentLessonIdx = parseInt(localStorage.getItem("ig_last_lesson") || "0", 10);
    this.currentTheme    = localStorage.getItem("ig_theme")          || "dark";
    this.completedLessons = new Set(
      JSON.parse(localStorage.getItem("ig_completed_lessons") || "[]")
    );
    this.sessionCompleted = 0;  // Para badge "Velocista"
    this.editor = null;
    this.sidebarOpen = localStorage.getItem("ig_sidebar_open") !== "false";

    // ── Módulos ordenados ─────────────────────────────────────────────────────
    this.MODULE_ORDER = ["modulo1", "modulo2", "modulo3"];
    this.NEXT_MODULE  = { modulo1: "modulo2", modulo2: "modulo3", modulo3: null };
    this.MODULE_NAMES = {
      modulo1: { label: "Módulo 1", emoji: "🐍", short: "M1" },
      modulo2: { label: "Módulo 2", emoji: "📊", short: "M2" },
      modulo3: { label: "Módulo 3", emoji: "🔬", short: "M3" },
    };

    // ── Badges ────────────────────────────────────────────────────────────────
    this.BADGES = [
      {
        id: "first_code",
        emoji: "🐍",
        name: "Primer Código",
        desc: "Completaste tu primer ejercicio",
        condition: () => this.completedLessons.size >= 1,
      },
      {
        id: "module1",
        emoji: "📋",
        name: "Data Explorer",
        desc: "Completaste todo el Módulo 1",
        condition: () => this._moduleComplete("modulo1"),
      },
      {
        id: "module2",
        emoji: "📊",
        name: "Visualizador",
        desc: "Completaste todo el Módulo 2",
        condition: () => this._moduleComplete("modulo2"),
      },
      {
        id: "module3",
        emoji: "🔬",
        name: "Analista",
        desc: "Completaste todo el Módulo 3",
        condition: () => this._moduleComplete("modulo3"),
      },
      {
        id: "all_done",
        emoji: "🏆",
        name: "Geotécnico Digital",
        desc: "¡Completaste el curso completo!",
        condition: () => this._allComplete(),
      },
      {
        id: "speed",
        emoji: "⚡",
        name: "Velocista",
        desc: "Completaste 3 ejercicios en una sesión",
        condition: () => this.sessionCompleted >= 3,
      },
    ];
    this.earnedBadges = new Set(
      JSON.parse(localStorage.getItem("ig_badges") || "[]")
    );

    // ── DOM refs ──────────────────────────────────────────────────────────────
    this.dom = {
      navTabs:         document.querySelectorAll(".nav-tab-btn"),
      btnThemeToggle:  document.getElementById("btn-theme-toggle"),
      pyodideBadge:    document.getElementById("pyodide-status"),
      pyodideText:     document.getElementById("pyodide-status-text"),
      progressText:    document.getElementById("progress-count"),
      progressBar:     document.getElementById("progress-fill"),
      progressSegs:    document.getElementById("progress-segments"),
      theoryPane:      document.getElementById("theory-pane"),
      editorPane:      document.getElementById("editor-pane"),
      codeTextarea:    document.getElementById("code-input"),
      lineNumbers:     document.getElementById("line-numbers"),
      btnRun:          document.getElementById("btn-run"),
      btnReset:        document.getElementById("btn-reset"),
      btnHint:         document.getElementById("btn-hint"),
      btnSolution:     document.getElementById("btn-solution"),
      hintContent:     document.getElementById("hint-content"),
      solutionContent: document.getElementById("solution-content"),
      accordionHint:   document.getElementById("hint-box"),
      accordionSolution: document.getElementById("solution-box"),
      tabConsole:      document.getElementById("tab-console"),
      tabPlot:         document.getElementById("tab-plot"),
      consoleOutput:   document.getElementById("console-output"),
      plotDisplay:     document.getElementById("plot-display"),
      validationBanner: document.getElementById("validation-banner"),
      sidebar:         document.getElementById("course-sidebar"),
      btnSidebarToggle: document.getElementById("btn-sidebar-toggle"),
      sidebarContent:  document.getElementById("sidebar-content"),
      badgesContainer: document.getElementById("badges-container"),
      confettiCanvas:  document.getElementById("confetti-canvas"),
      moduleCompleteModal: document.getElementById("module-complete-modal"),
    };

    this._init();
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  INICIALIZACIÓN
  // ───────────────────────────────────────────────────────────────────────────
  _init() {
    this.applyTheme(this.currentTheme);
    this.initEditor();

    // Nav tabs
    this.dom.navTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        if (target) this.switchSection(target);
      });
    });

    // Pyodide status
    window.pyodideRunner.onStatus((msg, state) => {
      this.dom.pyodideText.textContent = msg;
      this.dom.pyodideBadge.className  = `pyodide-status-badge ${state}`;
      if (state === "ready") {
        this.dom.btnRun.disabled = false;
        this.dom.btnRun.innerHTML = '<span>▶</span> Ejecutar Código <kbd style="font-size:0.7em;opacity:0.8;margin-left:4px">Ctrl+Enter</kbd>';
      } else if (state === "loading") {
        this.dom.btnRun.disabled = true;
      }
    });
    window.pyodideRunner.init();

    // Editor actions
    this.dom.btnRun.addEventListener("click",     () => this.executeCurrentCode());
    this.dom.btnReset.addEventListener("click",   () => this.resetCode());
    this.dom.btnHint.addEventListener("click",    () => this.toggleHint());
    this.dom.btnSolution.addEventListener("click",() => this.toggleSolution());

    // Console tabs
    this.dom.tabConsole.addEventListener("click", () => this.switchConsoleTab("console"));
    this.dom.tabPlot.addEventListener("click",    () => this.switchConsoleTab("plot"));
    document.getElementById("btn-clear-console").addEventListener("click", () => {
      this.dom.consoleOutput.textContent = "";
    });

    // Sidebar toggle
    if (this.dom.btnSidebarToggle) {
      this.dom.btnSidebarToggle.addEventListener("click", () => this.toggleSidebar());
    }

    // Cerrar modal de módulo completo
    const modalClose = document.getElementById("module-complete-close");
    if (modalClose) {
      modalClose.addEventListener("click", () => {
        this.dom.moduleCompleteModal.style.display = "none";
      });
    }
    const modalNext = document.getElementById("module-complete-next");
    if (modalNext) {
      modalNext.addEventListener("click", () => {
        this.dom.moduleCompleteModal.style.display = "none";
        const next = this.NEXT_MODULE[this.currentSection];
        if (next) this.switchSection(next);
      });
    }

    // Renderizar sección inicial (restaurando posición)
    const savedSection = localStorage.getItem("ig_last_section");
    const savedLesson  = parseInt(localStorage.getItem("ig_last_lesson") || "0", 10);
    if (savedSection && savedSection !== "teoria") {
      this.currentSection   = savedSection;
      this.currentLessonIdx = savedLesson;
      this.switchSection(savedSection, savedLesson);
    } else {
      this.switchSection("teoria");
    }

    // Sidebar initial state
    if (!this.sidebarOpen) this._setSidebarState(false, false);

    this.updateProgress();
    this.updateNavBadges();
    this.renderBadges();
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  EDITOR (CodeMirror)
  // ───────────────────────────────────────────────────────────────────────────
  initEditor() {
    if (typeof CodeMirror !== "undefined") {
      this.editor = CodeMirror.fromTextArea(this.dom.codeTextarea, {
        mode: "python",
        theme: this.currentTheme === "light" ? "eclipse" : "dracula",
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        extraKeys: {
          "Ctrl-Enter": () => this.executeCurrentCode(),
          "Cmd-Enter":  () => this.executeCurrentCode(),
          Tab: (cm) => cm.replaceSelection("    ", "end"),
        },
      });
      if (this.dom.lineNumbers) this.dom.lineNumbers.style.display = "none";
    } else {
      this.dom.codeTextarea.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          const s = this.dom.codeTextarea.selectionStart;
          const en = this.dom.codeTextarea.selectionEnd;
          this.dom.codeTextarea.value =
            this.dom.codeTextarea.value.substring(0, s) + "    " +
            this.dom.codeTextarea.value.substring(en);
          this.dom.codeTextarea.selectionStart =
          this.dom.codeTextarea.selectionEnd = s + 4;
        } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          this.executeCurrentCode();
        }
      });
    }
  }

  getCode()      { return this.editor ? this.editor.getValue() : this.dom.codeTextarea.value; }
  setCode(code)  {
    if (this.editor) {
      this.editor.setValue(code);
      setTimeout(() => this.editor.refresh(), 50);
    } else {
      this.dom.codeTextarea.value = code;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  TEMA
  // ───────────────────────────────────────────────────────────────────────────
  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ig_theme", theme);
    this.dom.btnThemeToggle.textContent = theme === "light" ? "🌙" : "☀️";
    if (this.editor) this.editor.setOption("theme", theme === "light" ? "eclipse" : "dracula");
  }
  toggleTheme() { this.applyTheme(this.currentTheme === "light" ? "dark" : "light"); }

  // ───────────────────────────────────────────────────────────────────────────
  //  NAVEGACIÓN PRINCIPAL
  // ───────────────────────────────────────────────────────────────────────────
  switchSection(sectionKey, lessonIdx = 0) {
    this.currentSection   = sectionKey;
    this.currentLessonIdx = lessonIdx;

    // Guardar posición
    localStorage.setItem("ig_last_section", sectionKey);
    localStorage.setItem("ig_last_lesson",  String(lessonIdx));

    // Nav tabs highlight
    this.dom.navTabs.forEach((b) =>
      b.classList.toggle("active", b.dataset && b.dataset.target === sectionKey)
    );

    const grid = document.querySelector(".workspace-grid");

    if (sectionKey === "teoria") {
      this.renderTheorySection();
      this.dom.editorPane.style.display = "none";
      grid.style.gridTemplateColumns = "1fr";
      this._hideSidebarForNonLesson();
    } else if (sectionKey === "sandbox") {
      this.dom.editorPane.style.display = "flex";
      grid.style.gridTemplateColumns = this.sidebarOpen ? "var(--sidebar-w) 1fr 1fr" : "1fr 1fr";
      this.renderSandboxSection();
      if (this.editor) this.editor.refresh();
    } else {
      this.dom.editorPane.style.display = "flex";
      grid.style.gridTemplateColumns = this.sidebarOpen ? "var(--sidebar-w) 1fr 1fr" : "1fr 1fr";
      this.renderLesson();
      if (this.editor) this.editor.refresh();
    }

    this.updateNavBadges();
    this.renderSidebar();
  }

  _hideSidebarForNonLesson() {
    if (this.dom.sidebar) this.dom.sidebar.style.display = "none";
    if (this.dom.btnSidebarToggle) this.dom.btnSidebarToggle.style.display = "none";
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  SIDEBAR — Mapa de curso
  // ───────────────────────────────────────────────────────────────────────────
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    localStorage.setItem("ig_sidebar_open", String(this.sidebarOpen));
    this._setSidebarState(this.sidebarOpen, true);
  }

  _setSidebarState(open, animate = true) {
    const sidebar = this.dom.sidebar;
    const btn     = this.dom.btnSidebarToggle;
    if (!sidebar) return;

    if (open) {
      sidebar.classList.remove("collapsed");
      if (btn) btn.innerHTML = '<span>◀</span> Lecciones';
    } else {
      sidebar.classList.add("collapsed");
      if (btn) btn.innerHTML = '<span>▶</span> Ver mapa';
    }

    // Ajustar grid
    const grid = document.querySelector(".workspace-grid");
    if (grid && this.currentSection !== "teoria") {
      grid.style.gridTemplateColumns = open ? "var(--sidebar-w) 1fr 1fr" : "1fr 1fr";
    }
  }

  renderSidebar() {
    const sidebar = this.dom.sidebar;
    const btn     = this.dom.btnSidebarToggle;
    if (!sidebar) return;

    // Mostrar sidebar solo en módulos con lecciones
    const hasLessons = ["modulo1","modulo2","modulo3"].includes(this.currentSection);
    sidebar.style.display   = hasLessons ? "flex" : "none";
    if (btn) btn.style.display = hasLessons ? "flex" : "none";
    if (!hasLessons) return;

    // Estado del botón
    this._setSidebarState(this.sidebarOpen, false);

    // Contenido: mapa de módulos
    let html = '<div class="sidebar-inner">';
    html += '<div class="sidebar-title">🗺️ Mapa del Curso</div>';

    this.MODULE_ORDER.forEach((modKey) => {
      const mod      = COURSE_DATA[modKey];
      const info     = this.MODULE_NAMES[modKey];
      const total    = mod.lessons.length;
      const done     = mod.lessons.filter(l => this.completedLessons.has(l.id)).length;
      const isActive = modKey === this.currentSection;
      const allDone  = done === total;

      html += `<div class="sidebar-module ${isActive ? "active" : ""} ${allDone ? "done" : ""}">
        <div class="sidebar-module-header" onclick="window.courseApp.switchSection('${modKey}')">
          <span class="sidebar-module-emoji">${info.emoji}</span>
          <div class="sidebar-module-label">
            <strong>${info.label}</strong>
            <span class="sidebar-mod-progress">${done}/${total}</span>
          </div>
          ${allDone ? '<span class="sidebar-done-badge">✅</span>' : ''}
        </div>`;

      if (isActive) {
        html += '<div class="sidebar-lessons">';
        mod.lessons.forEach((lesson, idx) => {
          const completed = this.completedLessons.has(lesson.id);
          const current   = (idx === this.currentLessonIdx);
          const shortTitle = lesson.title.replace(/^\d+\.\d+\s*🏆?\s*/,"").replace(/^Reto Integrador:/,"🏆").substring(0,38);
          html += `
            <div class="sidebar-lesson ${completed ? "completed" : ""} ${current ? "current" : ""}"
                 onclick="window.courseApp.goToLesson('${modKey}', ${idx})">
              <span class="sidebar-lesson-icon">${completed ? "✅" : current ? "▶" : "○"}</span>
              <span class="sidebar-lesson-text">${shortTitle}</span>
            </div>`;
        });
        html += '</div>';
      }

      html += '</div>';
    });

    html += '</div>';
    if (this.dom.sidebarContent) this.dom.sidebarContent.innerHTML = html;
  }

  goToLesson(moduleKey, lessonIdx) {
    if (moduleKey !== this.currentSection) {
      this.currentSection = moduleKey;
    }
    this.currentLessonIdx = lessonIdx;
    localStorage.setItem("ig_last_section", moduleKey);
    localStorage.setItem("ig_last_lesson",  String(lessonIdx));

    // Update nav tabs
    this.dom.navTabs.forEach((b) =>
      b.classList.toggle("active", b.dataset && b.dataset.target === moduleKey)
    );

    this.dom.editorPane.style.display = "flex";
    document.querySelector(".workspace-grid").style.gridTemplateColumns =
      this.sidebarOpen ? "var(--sidebar-w) 1fr 1fr" : "1fr 1fr";

    this.renderLesson();
    this.renderSidebar();
    if (this.editor) this.editor.refresh();
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  INDICADORES DE PROGRESO EN NAV
  // ───────────────────────────────────────────────────────────────────────────
  updateNavBadges() {
    this.MODULE_ORDER.forEach((modKey) => {
      const mod   = COURSE_DATA[modKey];
      if (!mod || !mod.lessons) return;
      const done  = mod.lessons.filter(l => this.completedLessons.has(l.id)).length;
      const total = mod.lessons.length;
      const badge = document.getElementById(`nav-badge-${modKey}`);
      if (badge) {
        badge.textContent = `${done}/${total}`;
        badge.className   = `nav-progress-badge ${done === total ? "complete" : ""}`;
      }
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  RENDERIZADO DE SECCIONES
  // ───────────────────────────────────────────────────────────────────────────
  renderTheorySection() {
    const data = COURSE_DATA.teoria;

    // Calcular progreso global para mostrar en teoría
    let totalEx = 0, doneEx = 0;
    this.MODULE_ORDER.forEach(m => {
      totalEx += COURSE_DATA[m].lessons.length;
      doneEx  += COURSE_DATA[m].lessons.filter(l => this.completedLessons.has(l.id)).length;
    });
    const pct = totalEx ? Math.round((doneEx / totalEx) * 100) : 0;

    let html = `
      <div class="lesson-header">
        <span class="lesson-tag">Investigación de Campo y Geomecánica</span>
        <h2>${data.title}</h2>
        <p>${data.subtitle}</p>
      </div>
      <div class="theory-body">
        <p>${data.intro}</p>
        <div class="theory-callout" style="margin-top:1.25rem">
          <strong>📍 Características del Movimiento en Masa:</strong><br>
          Se localiza en el flanco oriental de la Cordillera Central, caracterizado por una cobertura de suelo residual y saprolito derivado de anfibolitas y esquistos. La principal zona de cizallamiento y deformación basal se identificó a <strong>22 metros de profundidad</strong>, con planos secundarios a 11 m y 16 m.
        </div>

        <h3 style="margin:1.5rem 0 0.5rem; font-size:1.15rem; color:var(--text-main);">📡 Instrumentos de Monitoreo Geotécnico In-Situ</h3>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">
          Conoce los sensores que componen el esquema de monitoreo continuo de SIATA en el sitio:
        </p>
        <div class="sensor-cards-grid">
    `;

    data.sensors.forEach((s) => {
      html += `
        <div class="sensor-card">
          <div class="sensor-card-top">
            <span class="sensor-icon">${s.icon}</span>
            <span class="sensor-role-tag">${s.tag}</span>
          </div>
          <h3>${s.name}</h3>
          <div class="sensor-meta">Columnas: ${s.columns} | Muestreo: ${s.freq}</div>
          <p>${s.desc}</p>
          <p style="font-size:0.8rem; color:var(--accent-cyan); margin-top:auto;"><strong>Rol en el talud:</strong> ${s.impact}</p>
        </div>
      `;
    });

    // Roadmap del curso
    html += `
        </div>

        <h3 style="margin:2rem 0 1rem; font-size:1.15rem; color:var(--text-main);">🗺️ Ruta de Aprendizaje del Curso</h3>
        <div class="course-roadmap">
    `;
    this.MODULE_ORDER.forEach((modKey) => {
      const mod     = COURSE_DATA[modKey];
      const info    = this.MODULE_NAMES[modKey];
      const done    = mod.lessons.filter(l => this.completedLessons.has(l.id)).length;
      const total   = mod.lessons.length;
      const modPct  = total ? Math.round((done/total)*100) : 0;
      const allDone = done === total;
      html += `
          <div class="roadmap-module ${allDone ? "done" : done > 0 ? "in-progress" : ""}">
            <div class="roadmap-module-icon">${info.emoji}</div>
            <div class="roadmap-module-body">
              <div class="roadmap-module-title">${info.label}</div>
              <div class="roadmap-module-sub">${mod.title}</div>
              <div class="roadmap-progress-mini">
                <div class="roadmap-bar" style="width:${modPct}%"></div>
              </div>
              <div class="roadmap-mod-count">${done} / ${total} ejercicios</div>
            </div>
            <button class="btn-tool roadmap-btn" onclick="window.courseApp.switchSection('${modKey}')">
              ${allDone ? "Repasar" : done > 0 ? "Continuar ➡" : "Comenzar ➡"}
            </button>
          </div>
      `;
    });
    html += `</div>`;

    if (pct > 0) {
      html += `
        <div class="teoria-resume-banner">
          <span>🚀 Progreso actual: <strong>${doneEx}/${totalEx} ejercicios (${pct}%)</strong></span>
          <button class="btn-run" style="padding:0.5rem 1.25rem; font-size:0.88rem;" onclick="window.courseApp._resumeLastPosition()">
            Continuar donde lo dejé →
          </button>
        </div>
      `;
    } else {
      html += `
        <div style="margin-top:2rem; padding:1.5rem; background:rgba(56,189,248,0.08); border-radius:var(--radius-md); border:1px solid rgba(56,189,248,0.2); text-align:center;">
          <h4 style="color:var(--text-main); font-size:1.1rem; margin-bottom:0.5rem;">🚀 ¿Listo para comenzar?</h4>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1.25rem;">
            Aprenderás a procesar y visualizar estos mismos datos en Python desde cero.
          </p>
          <button class="btn-run" style="padding:0.75rem 2rem; font-size:1rem; margin:0 auto;" onclick="window.courseApp.switchSection('modulo1')">
            Comenzar con Módulo 1: Fundamentos de Python ➔
          </button>
        </div>
      `;
    }

    html += `</div>`;
    this.dom.theoryPane.innerHTML = html;
  }

  _resumeLastPosition() {
    const sec = localStorage.getItem("ig_last_section");
    const idx = parseInt(localStorage.getItem("ig_last_lesson") || "0", 10);
    if (sec && sec !== "teoria") {
      this.switchSection(sec, idx);
    } else {
      this.switchSection("modulo1", 0);
    }
  }

  renderLesson() {
    const moduleData   = COURSE_DATA[this.currentSection];
    if (!moduleData || !moduleData.lessons) return;

    const lesson       = moduleData.lessons[this.currentLessonIdx];
    const totalLessons = moduleData.lessons.length;
    const isCompleted  = this.completedLessons.has(lesson.id);
    const isLast       = this.currentLessonIdx === totalLessons - 1;
    const nextModule   = this.NEXT_MODULE[this.currentSection];

    // Guardar posición
    localStorage.setItem("ig_last_section", this.currentSection);
    localStorage.setItem("ig_last_lesson",  String(this.currentLessonIdx));

    // Indicador de pasos mini
    let stepsHtml = `<div class="lesson-steps">`;
    for (let i = 0; i < totalLessons; i++) {
      const st = this.completedLessons.has(moduleData.lessons[i].id)
        ? "done" : i === this.currentLessonIdx ? "current" : "";
      stepsHtml += `<span class="lesson-step ${st}" onclick="window.courseApp.goToLesson('${this.currentSection}', ${i})" title="${moduleData.lessons[i].title}"></span>`;
    }
    stepsHtml += `</div>`;

    // Botón de navegación derecha: "Siguiente" o "Ir a Módulo X"
    let nextBtn = "";
    if (!isLast) {
      nextBtn = `<button class="btn-tool btn-next-lesson" onclick="window.courseApp.nextLesson()">Siguiente Ejercicio ➡</button>`;
    } else if (nextModule) {
      const nextInfo = this.MODULE_NAMES[nextModule];
      nextBtn = `<button class="btn-run btn-next-module" onclick="window.courseApp.switchSection('${nextModule}')">
        Comenzar ${nextInfo.label} ${nextInfo.emoji} ➔
      </button>`;
    } else {
      nextBtn = `<button class="btn-tool" disabled style="opacity:0.4;cursor:default;">🏁 ¡Curso Completado!</button>`;
    }

    let html = `
      <div class="lesson-header">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <span class="lesson-tag">${moduleData.title}</span>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            ${stepsHtml}
            <span style="font-size:0.78rem; font-weight:700; color:var(--text-dim); white-space:nowrap;">
              ${this.currentLessonIdx + 1} / ${totalLessons}
            </span>
          </div>
        </div>
        <h2>${lesson.title}</h2>
        <p>${moduleData.subtitle}</p>
      </div>
      <div class="theory-body">
        <div>${lesson.concept}</div>
        <div class="instruction-box" style="margin-top:1.25rem;">
          <h4>🎯 Reto Práctico (Escribe tu código en el editor)</h4>
          <p>${lesson.instruction}</p>
        </div>
      </div>
      <div class="lesson-nav-bar">
        <button class="btn-tool btn-prev-lesson"
                onclick="window.courseApp.prevLesson()"
                ${this.currentLessonIdx === 0 ? "disabled style='opacity:0.4'" : ""}>
          ⬅ Anterior
        </button>
        ${nextBtn}
      </div>
    `;

    this.dom.theoryPane.innerHTML = html;

    // Editor
    this.setCode(lesson.initialCode);
    this.dom.hintContent.textContent    = lesson.hint;
    this.dom.solutionContent.textContent = lesson.solution;
    this.dom.accordionHint.style.display     = "none";
    this.dom.accordionSolution.style.display = "none";

    if (isCompleted) {
      this.dom.validationBanner.className   = "validation-banner success";
      this.dom.validationBanner.style.display = "flex";
      this.dom.validationBanner.innerHTML   = "✅ ¡Ya has completado este ejercicio previamente!";
    } else {
      this.dom.validationBanner.style.display = "none";
    }

    // Widgets pedagógicos
    this._initWidgets(lesson.id);

    // Sidebar
    this.renderSidebar();
  }

  renderSandboxSection() {
    const sandbox = COURSE_DATA.sandbox;
    this.dom.theoryPane.innerHTML = `
      <div class="lesson-header">
        <span class="lesson-tag" style="background:rgba(168,85,247,0.15); color:var(--accent-purple);">Laboratorio Libre</span>
        <h2>${sandbox.title}</h2>
        <p>${sandbox.subtitle}</p>
      </div>
      <div class="theory-body">
        <div>${sandbox.description}</div>
        <div class="theory-callout" style="margin-top:1rem;">
          💡 <strong>Ideas para explorar:</strong>
          <ul>
            <li>Calcula la precipitación total acumulada: <code>df['p'].sum()</code>.</li>
            <li>Grafica cualquier sensor: <code>df['C1'].plot()</code>.</li>
            <li>Prueba correlaciones entre cabeceo y balanceo: <code>df[['C1', 'B1']].corr()</code>.</li>
          </ul>
        </div>
      </div>
    `;
    this.setCode(sandbox.initialCode);
    this.dom.accordionHint.style.display     = "none";
    this.dom.accordionSolution.style.display = "none";
    this.dom.validationBanner.style.display  = "none";
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  WIDGETS
  // ───────────────────────────────────────────────────────────────────────────
  _initWidgets(lessonId) {
    const map = {
      m1_l2: () => window.initListIndexingWidget       && window.initListIndexingWidget(),
      m1_l3: () => window.initConditionalFlowWidget    && window.initConditionalFlowWidget(),
      m1_l4: () => window.initFunctionAnatomyWidget    && window.initFunctionAnatomyWidget(),
      m1_l5: () => window.initForLoopWidget            && window.initForLoopWidget(),
      m1_l6: () => window.initDataFrameAnatomyWidget   && window.initDataFrameAnatomyWidget(),
      m1_l7: () => window.initBooleanFilterWidget      && window.initBooleanFilterWidget(),
      m1_l8: () => window.initSensorConcatWidget       && window.initSensorConcatWidget(),
      m2_l2: () => window.initBoxplotWidget            && window.initBoxplotWidget(),
      m2_l3: () => window.initThresholdBandsWidget     && window.initThresholdBandsWidget(),
      m2_l4: () => window.initDualAxisRainWidget       && window.initDualAxisRainWidget(),
      m3_l1: () => window.initMissingDataWidget        && window.initMissingDataWidget(),
      m3_l2: () => window.initRollingWindowWidget      && window.initRollingWindowWidget(),
      m3_l3: () => window.initVelocityAccelerationWidget && window.initVelocityAccelerationWidget(),
      m3_l4: () => window.initLagCorrelationWidget     && window.initLagCorrelationWidget(),
    };
    if (map[lessonId]) map[lessonId]();
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  NAVEGACIÓN ENTRE LECCIONES
  // ───────────────────────────────────────────────────────────────────────────
  prevLesson() {
    if (this.currentLessonIdx > 0) {
      this.currentLessonIdx--;
      this.renderLesson();
    }
  }

  nextLesson() {
    const moduleData = COURSE_DATA[this.currentSection];
    if (moduleData && this.currentLessonIdx < moduleData.lessons.length - 1) {
      this.currentLessonIdx++;
      this.renderLesson();
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  EDITOR — ACCIONES
  // ───────────────────────────────────────────────────────────────────────────
  resetCode() {
    const moduleData = COURSE_DATA[this.currentSection];
    if (this.currentSection === "sandbox") {
      this.setCode(COURSE_DATA.sandbox.initialCode);
    } else if (moduleData && moduleData.lessons) {
      this.setCode(moduleData.lessons[this.currentLessonIdx].initialCode);
    }
    this.dom.validationBanner.style.display = "none";
  }

  toggleHint() {
    const box = this.dom.accordionHint;
    box.style.display = (box.style.display === "none" || !box.style.display) ? "block" : "none";
  }

  toggleSolution() {
    const box = this.dom.accordionSolution;
    box.style.display = (box.style.display === "none" || !box.style.display) ? "block" : "none";
  }

  switchConsoleTab(tab) {
    const isConsole = tab === "console";
    this.dom.tabConsole.classList.toggle("active", isConsole);
    this.dom.tabPlot.classList.toggle("active", !isConsole);
    this.dom.consoleOutput.style.display = isConsole ? "block" : "none";
    this.dom.plotDisplay.classList.toggle("active", !isConsole);
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  EJECUCIÓN DE CÓDIGO
  // ───────────────────────────────────────────────────────────────────────────
  async executeCurrentCode() {
    const code = this.getCode();
    this.dom.btnRun.disabled = true;
    this.dom.btnRun.innerHTML = '<span>⏳</span> Ejecutando...';

    const result = await window.pyodideRunner.runCode(code);

    this.dom.btnRun.disabled = false;
    this.dom.btnRun.innerHTML = '<span>▶</span> Ejecutar Código <kbd style="font-size:0.7em;opacity:0.8;margin-left:4px">Ctrl+Enter</kbd>';

    // Consola
    this.dom.consoleOutput.textContent = result.output;
    this.dom.consoleOutput.className   = result.success
      ? "console-output-area" : "console-output-area error";

    // Gráficos
    if (result.hasPlot) {
      this.dom.plotDisplay.innerHTML = "";
      result.plots.forEach((b64) => {
        const img = document.createElement("img");
        img.src   = "data:image/png;base64," + b64;
        img.alt   = "Figura Matplotlib";
        this.dom.plotDisplay.appendChild(img);
      });
      this.switchConsoleTab("plot");
    } else {
      this.switchConsoleTab("console");
    }

    // Validación
    const moduleData = COURSE_DATA[this.currentSection];
    if (moduleData && moduleData.lessons) {
      const lesson    = moduleData.lessons[this.currentLessonIdx];
      const wasAlreadyDone = this.completedLessons.has(lesson.id);

      if (lesson.validator && lesson.validator(result.output, result.hasPlot)) {
        this.dom.validationBanner.className   = "validation-banner success";
        this.dom.validationBanner.style.display = "flex";
        this.dom.validationBanner.innerHTML   = "🎉 ¡Excelente trabajo! El código fue verificado con éxito.";

        if (!wasAlreadyDone) {
          this.completedLessons.add(lesson.id);
          this.sessionCompleted++;
          localStorage.setItem("ig_completed_lessons",
            JSON.stringify(Array.from(this.completedLessons)));

          this.updateProgress();
          this.updateNavBadges();
          this.renderSidebar();

          // Animación de confeti
          this._launchConfetti();

          // Verificar badges nuevos
          const newBadges = this._checkNewBadges();
          if (newBadges.length > 0) {
            setTimeout(() => this._showBadgeToast(newBadges[0]), 1200);
          }

          // Verificar módulo completo
          const modComplete = this._moduleComplete(this.currentSection);
          const isLastLesson = (this.currentLessonIdx === moduleData.lessons.length - 1);
          if (modComplete && isLastLesson) {
            setTimeout(() => this._showModuleCompleteModal(), 2000);
          }
        }
      } else {
        this.dom.validationBanner.className   = "validation-banner";
        this.dom.validationBanner.style.display = "none";
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  PROGRESO
  // ───────────────────────────────────────────────────────────────────────────
  updateProgress() {
    let totalExercises = 0;
    let completed      = 0;
    this.MODULE_ORDER.forEach((m) => {
      totalExercises += COURSE_DATA[m].lessons.length;
      completed      += COURSE_DATA[m].lessons.filter(l => this.completedLessons.has(l.id)).length;
    });

    const pct = totalExercises ? Math.round((completed / totalExercises) * 100) : 0;
    this.dom.progressText.textContent = `${completed} / ${totalExercises} ejercicios (${pct}%)`;
    this.dom.progressBar.style.width  = `${pct}%`;

    // Barra segmentada
    this._updateSegmentedBar();
  }

  _updateSegmentedBar() {
    const segsEl = this.dom.progressSegs;
    if (!segsEl) return;

    let html = "";
    this.MODULE_ORDER.forEach((modKey) => {
      const mod   = COURSE_DATA[modKey];
      const done  = mod.lessons.filter(l => this.completedLessons.has(l.id)).length;
      const total = mod.lessons.length;
      const pct   = total ? Math.round((done / total) * 100) : 0;
      const info  = this.MODULE_NAMES[modKey];
      html += `
        <div class="seg-module" title="${info.label}: ${done}/${total}">
          <span class="seg-label">${info.short}</span>
          <div class="seg-track">
            <div class="seg-fill ${done===total ? "complete" : ""}" style="width:${pct}%"></div>
          </div>
          <span class="seg-count">${done}/${total}</span>
        </div>
      `;
    });
    segsEl.innerHTML = html;
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  BADGES
  // ───────────────────────────────────────────────────────────────────────────
  _moduleComplete(modKey) {
    const mod = COURSE_DATA[modKey];
    if (!mod || !mod.lessons) return false;
    return mod.lessons.every(l => this.completedLessons.has(l.id));
  }

  _allComplete() {
    return this.MODULE_ORDER.every(m => this._moduleComplete(m));
  }

  _checkNewBadges() {
    const newBadges = [];
    this.BADGES.forEach((badge) => {
      if (!this.earnedBadges.has(badge.id) && badge.condition()) {
        this.earnedBadges.add(badge.id);
        newBadges.push(badge);
      }
    });
    if (newBadges.length > 0) {
      localStorage.setItem("ig_badges", JSON.stringify(Array.from(this.earnedBadges)));
      this.renderBadges();
    }
    return newBadges;
  }

  renderBadges() {
    const el = this.dom.badgesContainer;
    if (!el) return;

    let html = "";
    this.BADGES.forEach((badge) => {
      const earned = this.earnedBadges.has(badge.id);
      html += `
        <div class="badge-item ${earned ? "earned" : "locked"}" title="${badge.name}: ${badge.desc}">
          <span class="badge-emoji">${badge.emoji}</span>
          <span class="badge-name">${badge.name}</span>
        </div>
      `;
    });
    el.innerHTML = html;
  }

  _showBadgeToast(badge) {
    const existing = document.getElementById("badge-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "badge-toast";
    toast.className = "badge-toast";
    toast.innerHTML = `
      <span class="badge-toast-emoji">${badge.emoji}</span>
      <div>
        <div class="badge-toast-title">¡Logro desbloqueado!</div>
        <div class="badge-toast-name">${badge.name}</div>
        <div class="badge-toast-desc">${badge.desc}</div>
      </div>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  MODAL MÓDULO COMPLETO
  // ───────────────────────────────────────────────────────────────────────────
  _showModuleCompleteModal() {
    const modal  = this.dom.moduleCompleteModal;
    if (!modal) return;

    const info   = this.MODULE_NAMES[this.currentSection];
    const next   = this.NEXT_MODULE[this.currentSection];
    const nextInfo = next ? this.MODULE_NAMES[next] : null;

    modal.querySelector(".mcm-module-name").textContent = info.label;
    modal.querySelector(".mcm-module-emoji").textContent = info.emoji;
    modal.querySelector(".mcm-lessons-done").textContent =
      COURSE_DATA[this.currentSection].lessons.length + " ejercicios";

    const nextBtn = document.getElementById("module-complete-next");
    if (nextBtn) {
      if (nextInfo) {
        nextBtn.textContent = `Comenzar ${nextInfo.label} ${nextInfo.emoji} →`;
        nextBtn.style.display = "block";
      } else {
        nextBtn.textContent = "🏆 Ver mi progreso completo";
      }
    }

    modal.style.display = "flex";
    this._launchConfetti(120);
  }

  // ───────────────────────────────────────────────────────────────────────────
  //  CONFETI (CSS Canvas ligero)
  // ───────────────────────────────────────────────────────────────────────────
  _launchConfetti(count = 60) {
    const canvas = this.dom.confettiCanvas;
    if (!canvas) return;

    canvas.style.display = "block";
    const ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#38bdf8","#10b981","#f59e0b","#a855f7","#f43f5e","#ffffff"];
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 60,
      w: 8 + Math.random() * 8,
      h: 4 + Math.random() * 4,
      r: Math.random() * Math.PI * 2,
      dr: (Math.random() - 0.5) * 0.15,
      dx: (Math.random() - 0.5) * 3,
      dy: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x  += p.dx;
        p.y  += p.dy;
        p.r  += p.dr;
        p.alpha = Math.max(0, 1 - frame / 90);
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 100) requestAnimationFrame(animate);
      else canvas.style.display = "none";
    };
    requestAnimationFrame(animate);
  }
}

// ── Bootstrap ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  window.courseApp = new CourseApp();
});
