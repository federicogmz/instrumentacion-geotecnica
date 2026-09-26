/**
 * app.js
 * Controlador principal de la interfaz: navegación, estado de lecciones,
 * editor de código enriquecido (CodeMirror), alternancia de tema (claro/oscuro),
 * validación de ejercicios y renderizado de gráficos de Matplotlib.
 */

class CourseApp {
  constructor() {
    this.currentSection = "teoria";
    this.currentLessonIdx = 0;
    this.currentTheme = localStorage.getItem("ig_theme") || "dark";
    this.completedLessons = new Set(JSON.parse(localStorage.getItem("ig_completed_lessons") || "[]"));
    this.editor = null;

    this.dom = {
      navTabs: document.querySelectorAll(".nav-tab-btn"),
      btnThemeToggle: document.getElementById("btn-theme-toggle"),
      pyodideBadge: document.getElementById("pyodide-status"),
      pyodideText: document.getElementById("pyodide-status-text"),
      progressText: document.getElementById("progress-count"),
      progressBar: document.getElementById("progress-fill"),
      theoryPane: document.getElementById("theory-pane"),
      editorPane: document.getElementById("editor-pane"),
      codeTextarea: document.getElementById("code-input"),
      lineNumbers: document.getElementById("line-numbers"),
      btnRun: document.getElementById("btn-run"),
      btnReset: document.getElementById("btn-reset"),
      btnHint: document.getElementById("btn-hint"),
      btnSolution: document.getElementById("btn-solution"),
      consoleOutput: document.getElementById("console-output"),
      plotDisplay: document.getElementById("plot-display"),
      tabConsole: document.getElementById("tab-console"),
      tabPlot: document.getElementById("tab-plot"),
      validationBanner: document.getElementById("validation-banner"),
      accordionHint: document.getElementById("hint-box"),
      hintContent: document.getElementById("hint-content"),
      accordionSolution: document.getElementById("solution-box"),
      solutionContent: document.getElementById("solution-content"),
    };

    this.init();
  }

  init() {
    // 1. Inicializar tema (Claro / Oscuro)
    this.applyTheme(this.currentTheme);
    this.dom.btnThemeToggle.addEventListener("click", () => this.toggleTheme());

    // 2. Inicializar CodeMirror (Editor con resaltado de sintaxis enriquecido)
    this.initEditor();

    // 3. Escuchar eventos de navegación de pestañas
    this.dom.navTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        this.switchSection(target);
      });
    });

    // 4. Escuchar estado de Pyodide (WebAssembly Python)
    window.pyodideRunner.onStatus((msg, state) => {
      this.dom.pyodideText.textContent = msg;
      this.dom.pyodideBadge.className = `pyodide-status-badge ${state}`;
      if (state === "ready") {
        this.dom.btnRun.disabled = false;
        this.dom.btnRun.innerHTML = '<span>▶</span> Ejecutar Código <kbd style="font-size:0.7em;opacity:0.8;margin-left:4px">Ctrl+Enter</kbd>';
      } else if (state === "loading") {
        this.dom.btnRun.disabled = true;
      }
    });

    // 5. Iniciar Pyodide en segundo plano
    window.pyodideRunner.init();

    // 6. Botones de acción del editor
    this.dom.btnRun.addEventListener("click", () => this.executeCurrentCode());
    this.dom.btnReset.addEventListener("click", () => this.resetCode());
    this.dom.btnHint.addEventListener("click", () => this.toggleHint());
    this.dom.btnSolution.addEventListener("click", () => this.toggleSolution());

    // 7. Pestañas de consola vs gráfico
    this.dom.tabConsole.addEventListener("click", () => this.switchConsoleTab("console"));
    this.dom.tabPlot.addEventListener("click", () => this.switchConsoleTab("plot"));
    document.getElementById("btn-clear-console").addEventListener("click", () => {
      this.dom.consoleOutput.textContent = "";
    });

    // 8. Renderizar sección inicial y progreso
    this.switchSection("teoria");
    this.updateProgress();
  }

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
          "Cmd-Enter": () => this.executeCurrentCode(),
          Tab: (cm) => cm.replaceSelection("    ", "end"),
        },
      });

      // Ocultar números de línea manuales si CodeMirror está activo
      if (this.dom.lineNumbers) {
        this.dom.lineNumbers.style.display = "none";
      }
    } else {
      // Fallback para textarea tradicional
      this.dom.codeTextarea.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          const start = this.dom.codeTextarea.selectionStart;
          const end = this.dom.codeTextarea.selectionEnd;
          this.dom.codeTextarea.value =
            this.dom.codeTextarea.value.substring(0, start) + "    " + this.dom.codeTextarea.value.substring(end);
          this.dom.codeTextarea.selectionStart = this.dom.codeTextarea.selectionEnd = start + 4;
        } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          this.executeCurrentCode();
        }
      });
    }
  }

  getCode() {
    return this.editor ? this.editor.getValue() : this.dom.codeTextarea.value;
  }

  setCode(code) {
    if (this.editor) {
      this.editor.setValue(code);
      setTimeout(() => this.editor.refresh(), 50);
    } else {
      this.dom.codeTextarea.value = code;
    }
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ig_theme", theme);
    this.dom.btnThemeToggle.textContent = theme === "light" ? "🌙" : "☀️";

    if (this.editor) {
      this.editor.setOption("theme", theme === "light" ? "eclipse" : "dracula");
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  }

  switchSection(sectionKey) {
    this.currentSection = sectionKey;
    this.currentLessonIdx = 0;

    // Actualizar botones de navegación
    this.dom.navTabs.forEach((b) => {
      b.classList.toggle("active", b.dataset.target === sectionKey);
    });

    if (sectionKey === "teoria") {
      this.renderTheorySection();
      this.dom.editorPane.style.display = "none";
      document.querySelector(".workspace-grid").style.gridTemplateColumns = "1fr";
    } else if (sectionKey === "sandbox") {
      this.dom.editorPane.style.display = "flex";
      document.querySelector(".workspace-grid").style.gridTemplateColumns = "1fr 1fr";
      this.renderSandboxSection();
      if (this.editor) this.editor.refresh();
    } else {
      this.dom.editorPane.style.display = "flex";
      document.querySelector(".workspace-grid").style.gridTemplateColumns = "1fr 1fr";
      this.renderLesson();
      if (this.editor) this.editor.refresh();
    }
  }

  renderTheorySection() {
    const data = COURSE_DATA.teoria;
    let html = `
      <div class="lesson-header">
        <span class="lesson-tag">Investigación de Campo y Geomecánica</span>
        <h2>${data.title}</h2>
        <p>${data.subtitle}</p>
      </div>
      <div class="theory-body">
        <p>${data.intro}</p>
        <div class="theory-callout" style="margin-top:1.25rem">
          <strong>📍 Características del Movimiento en Masa:</strong>
          <br>
          Se localiza en el flanco oriental de la Cordillera Central, caracterizado por una cobertura de suelo residual y saprolito derivado de anfibolitas y esquistos. La principal zona de cizallamiento y deformación basal se identificó a <strong>22 metros de profundidad</strong>, con planos secundarios a 11 m y 16 m.
        </div>

        <h3 style="margin: 1.5rem 0 0.5rem; font-size:1.15rem; color:var(--text-main);">📡 Instrumentos de Monitoreo Geotécnico In-Situ</h3>
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

    html += `
        </div>

        <div style="margin-top:2rem; padding:1.5rem; background:rgba(56, 189, 248, 0.08); border-radius:var(--radius-md); border:1px solid rgba(56, 189, 248, 0.2); text-align:center;">
          <h4 style="color:var(--text-main); font-size:1.1rem; margin-bottom:0.5rem;">🚀 ¿Listo para comenzar con el análisis computacional?</h4>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1.25rem;">
            Aprenderás a procesar y visualizar estos mismos datos en Python desde cero, con ejercicios prácticos guiados.
          </p>
          <button class="btn-run" style="padding:0.75rem 2rem; font-size:1rem; margin:0 auto;" onclick="window.courseApp.switchSection('modulo1')">
            Comenzar con Módulo 1: Fundamentos de Python ➔
          </button>
        </div>
      </div>
    `;

    this.dom.theoryPane.innerHTML = html;
  }

  renderLesson() {
    const moduleData = COURSE_DATA[this.currentSection];
    if (!moduleData || !moduleData.lessons) return;

    const lesson = moduleData.lessons[this.currentLessonIdx];
    const totalLessons = moduleData.lessons.length;
    const isCompleted = this.completedLessons.has(lesson.id);

    let html = `
      <div class="lesson-header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="lesson-tag">${moduleData.title}</span>
          <span style="font-size:0.8rem; font-weight:700; color:var(--text-dim);">Ejercicio ${this.currentLessonIdx + 1} de ${totalLessons}</span>
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
      <div style="display:flex; justify-content:space-between; margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-subtle);">
        <button class="btn-tool" onclick="window.courseApp.prevLesson()" ${this.currentLessonIdx === 0 ? "disabled style='opacity:0.4'" : ""}>
          ⬅ Ejercicio Anterior
        </button>
        <button class="btn-tool" onclick="window.courseApp.nextLesson()" ${this.currentLessonIdx === totalLessons - 1 ? "disabled style='opacity:0.4'" : ""}>
          Siguiente Ejercicio ➡
        </button>
      </div>
    `;

    this.dom.theoryPane.innerHTML = html;

    // Cargar plantilla no resuelta en el editor
    this.setCode(lesson.initialCode);

    // Configurar pista y solución
    this.dom.hintContent.textContent = lesson.hint;
    this.dom.solutionContent.textContent = lesson.solution;
    this.dom.accordionHint.style.display = "none";
    this.dom.accordionSolution.style.display = "none";
    this.dom.validationBanner.style.display = isCompleted ? "flex" : "none";
    if (isCompleted) {
      this.dom.validationBanner.className = "validation-banner success";
      this.dom.validationBanner.innerHTML = "✅ ¡Ya has completado este ejercicio previamente!";
    }

    // Inicializar widget interactivo de flujo condicional (esquema de pizarra)
    if (lesson.id === "m1_l3" && window.initConditionalFlowWidget) {
      window.initConditionalFlowWidget();
    }
  }

  renderSandboxSection() {
    const sandbox = COURSE_DATA.sandbox;
    let html = `
      <div class="lesson-header">
        <span class="lesson-tag" style="background:rgba(168, 85, 247, 0.15); color:var(--accent-purple);">Laboratorio Libre</span>
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

    this.dom.theoryPane.innerHTML = html;
    this.setCode(sandbox.initialCode);
    this.dom.accordionHint.style.display = "none";
    this.dom.accordionSolution.style.display = "none";
    this.dom.validationBanner.style.display = "none";
  }

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
    box.style.display = box.style.display === "none" || !box.style.display ? "block" : "none";
  }

  toggleSolution() {
    const box = this.dom.accordionSolution;
    box.style.display = box.style.display === "none" || !box.style.display ? "block" : "none";
  }

  switchConsoleTab(tab) {
    if (tab === "console") {
      this.dom.tabConsole.classList.add("active");
      this.dom.tabPlot.classList.remove("active");
      this.dom.consoleOutput.style.display = "block";
      this.dom.plotDisplay.classList.remove("active");
    } else {
      this.dom.tabConsole.classList.remove("active");
      this.dom.tabPlot.classList.add("active");
      this.dom.consoleOutput.style.display = "none";
      this.dom.plotDisplay.classList.add("active");
    }
  }

  async executeCurrentCode() {
    const code = this.getCode();
    this.dom.btnRun.disabled = true;
    this.dom.btnRun.innerHTML = '<span>⏳</span> Ejecutando...';

    const result = await window.pyodideRunner.runCode(code);

    this.dom.btnRun.disabled = false;
    this.dom.btnRun.innerHTML = '<span>▶</span> Ejecutar Código <kbd style="font-size:0.7em;opacity:0.8;margin-left:4px">Ctrl+Enter</kbd>';

    // Mostrar texto en consola
    this.dom.consoleOutput.textContent = result.output;
    this.dom.consoleOutput.className = result.success ? "console-output-area" : "console-output-area error";

    // Si generó figuras de Matplotlib, renderizarlas
    if (result.hasPlot) {
      this.dom.plotDisplay.innerHTML = "";
      result.plots.forEach((base64Png) => {
        const img = document.createElement("img");
        img.src = "data:image/png;base64," + base64Png;
        img.alt = "Figura Matplotlib";
        this.dom.plotDisplay.appendChild(img);
      });
      this.switchConsoleTab("plot");
    } else {
      this.switchConsoleTab("console");
    }

    // Validar ejercicio actual
    const moduleData = COURSE_DATA[this.currentSection];
    if (moduleData && moduleData.lessons) {
      const lesson = moduleData.lessons[this.currentLessonIdx];
      if (lesson.validator && lesson.validator(result.output, result.hasPlot)) {
        this.dom.validationBanner.className = "validation-banner success";
        this.dom.validationBanner.style.display = "flex";
        this.dom.validationBanner.innerHTML = "🎉 ¡Excelente trabajo! El código fue verificado con éxito.";
        this.completedLessons.add(lesson.id);
        localStorage.setItem("ig_completed_lessons", JSON.stringify(Array.from(this.completedLessons)));
        this.updateProgress();
      } else {
        this.dom.validationBanner.className = "validation-banner";
        this.dom.validationBanner.style.display = "none";
      }
    }
  }

  updateProgress() {
    let totalExercises = 0;
    ["modulo1", "modulo2", "modulo3"].forEach((m) => {
      totalExercises += COURSE_DATA[m].lessons.length;
    });

    const completed = this.completedLessons.size;
    const pct = Math.round((completed / totalExercises) * 100);

    this.dom.progressText.textContent = `${completed} / ${totalExercises} ejercicios (${pct}%)`;
    this.dom.progressBar.style.width = `${pct}%`;
  }
}

// Iniciar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  window.courseApp = new CourseApp();
});
