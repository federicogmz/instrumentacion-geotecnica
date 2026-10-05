/**
 * for-loop-flow.js
 * Componente visual interactivo y conceptual integrado para la enseñanza de Bucles FOR e iteración en Python.
 * Contexto Geotécnico: Cinta transportadora de lecturas de extensómetro y aplicación de funciones de evaluación.
 * 
 * Integra:
 * 1. Pizarra de Anatomía Sintáctica del bucle for (palabra clave, variable de ciclo, in, serie, dos puntos, sangría).
 * 2. Aplicación directa de una función clasificadora sobre cada dato (sin métodos no vistos como .append()).
 * 3. Cinta transportadora interactiva con trazado de código y terminal de salida en tiempo real.
 */

(function () {
  let state = {
    currentIndex: 0,
    isPlaying: false,
    timer: null,
    readings: [
      { id: "L-01", val: 4.2, time: "08:00" },
      { id: "L-02", val: 8.5, time: "09:00" },
      { id: "L-03", val: 12.1, time: "10:00" },
      { id: "L-04", val: 7.8, time: "11:00" },
      { id: "L-05", val: 15.3, time: "12:00" }
    ],
  };

  // Función geotécnica pura que clasifica cada lectura (reutilizando el concepto de la Lección 1.4)
  function evaluarDeformacion(val) {
    if (val >= 10.0) {
      return { tag: "🚨 ALERTA CRÍTICA", color: "#ef4444", status: "crítico" };
    } else if (val >= 6.0) {
      return { tag: "⚠️ PREVENTIVA", color: "#f59e0b", status: "alerta" };
    } else {
      return { tag: "✅ NORMAL", color: "#10b981", status: "normal" };
    }
  }

  function renderWidget() {
    const container = document.getElementById("for-loop-container");
    if (!container) return;

    const total = state.readings.length;
    const isCompleted = state.currentIndex >= total;
    const currentItem = isCompleted ? null : state.readings[state.currentIndex];
    const currentEval = currentItem ? evaluarDeformacion(currentItem.val) : null;

    // Generar las líneas de salida impresas en la terminal hasta el ciclo actual
    const printedLogs = [];
    for (let i = 0; i < state.currentIndex && i < total; i++) {
      const r = state.readings[i];
      const ev = evaluarDeformacion(r.val);
      printedLogs.push({
        idx: i + 1,
        text: `[${r.time}] ${r.id}: ${r.val.toFixed(1)} mm ➔ ${ev.tag}`,
        color: ev.color
      });
    }

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.5 &bull; Pizarra Sintáctica &amp; Simulador en Tiempo Real</span>
            <h4 class="flow-title">🔁 Anatomía del Bucle <code>for</code>: Aplicación de Funciones a Series Temporales</h4>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; background:rgba(56,189,248,0.12); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); border-radius:12px; padding:4px 10px; font-weight:600;">
              📏 Extensómetro Ancón Norte
            </span>
          </div>
        </div>

        <!-- 1. PIZARRA CONCEPTUAL: ESTRUCTURA SINTÁCTICA DEL BUCLE FOR -->
        <div class="for-syntax-whiteboard">
          <div class="for-syntax-header">
            <div style="font-size:0.78rem; font-weight:800; color:var(--accent-primary); letter-spacing:0.8px; text-transform:uppercase;">
              📋 Pizarra: Las 5 Partes de la Declaración del Bucle <code>for</code>
            </div>
            <span style="font-size:0.72rem; color:var(--text-muted);">Sintaxis estándar de Python</span>
          </div>

          <!-- Tokens de la Cabecera del Bucle -->
          <div class="for-syntax-tokens-row">
            <!-- Token 1: for -->
            <div class="for-token-card" style="border-top:3px solid var(--accent-primary);">
              <div class="for-token-pill" style="color:var(--accent-primary);">for</div>
              <div class="for-token-desc">
                <strong>Palabra clave:</strong> Inicia la instrucción de iteración automática.
              </div>
            </div>

            <!-- Token 2: variable de ciclo -->
            <div class="for-token-card" style="border-top:3px solid #38bdf8;">
              <div class="for-token-pill" style="color:#38bdf8;">lectura</div>
              <div class="for-token-desc">
                <strong>Variable de ciclo:</strong> Adopta el valor del dato en cada vuelta.
              </div>
            </div>

            <!-- Token 3: in -->
            <div class="for-token-card" style="border-top:3px solid var(--accent-primary);">
              <div class="for-token-pill" style="color:var(--accent-primary);">in</div>
              <div class="for-token-desc">
                <strong>Pertenencia:</strong> Enlaza la variable con la colección de datos.
              </div>
            </div>

            <!-- Token 4: colección -->
            <div class="for-token-card" style="border-top:3px solid #f59e0b;">
              <div class="for-token-pill" style="color:#f59e0b;">deformaciones</div>
              <div class="for-token-desc">
                <strong>Serie o Lista:</strong> Colección secuencial de valores a recorrer.
              </div>
            </div>

            <!-- Token 5: dos puntos -->
            <div class="for-token-card" style="border-top:3px solid #ec4899; max-width:90px;">
              <div class="for-token-pill" style="color:#ec4899;">:</div>
              <div class="for-token-desc">
                <strong>Dos puntos:</strong> Abren el bloque de instrucciones subordinadas.
              </div>
            </div>
          </div>

          <!-- Cuerpo Indentado: Aplicación de la Función -->
          <div class="for-body-indent-box">
            <div style="font-size:0.74rem; font-weight:700; color:var(--accent-primary); text-transform:uppercase; letter-spacing:0.5px;">
              ↳ Sangría Obligatoria (4 Espacios) — Cuerpo de Ejecución por Cada Elemento:
            </div>
            <div style="font-family:var(--font-mono); font-size:0.82rem; color:var(--text-main); margin-top:2px;">
              <code>&nbsp;&nbsp;&nbsp;&nbsp;estado = evaluar_deformacion(lectura)</code>
              <span style="color:var(--text-muted); font-size:0.75rem; margin-left:8px;">← Aplica la función de la Lección 1.4 al dato del ciclo</span>
            </div>
            <div style="font-family:var(--font-mono); font-size:0.82rem; color:var(--text-main);">
              <code>&nbsp;&nbsp;&nbsp;&nbsp;print(f"Medición: {lectura} mm -> {estado}")</code>
              <span style="color:var(--text-muted); font-size:0.75rem; margin-left:8px;">← Comunica el diagnóstico a la consola</span>
            </div>
          </div>
        </div>

        <!-- 2. BARRA DE CONTROL DE LA SIMULACIÓN -->
        <div class="loop-toolbar" style="margin-top: 0.35rem;">
          <div class="loop-buttons">
            <button class="loop-btn primary" id="loop-btn-step" ${isCompleted ? 'disabled' : ''}>
              ${isCompleted ? '🏁 Bucle Concluido' : `▶ Siguiente Ciclo (${state.currentIndex + 1}/${total})`}
            </button>
            <button class="loop-btn secondary" id="loop-btn-play">
              ${state.isPlaying ? '⏸ Pausar' : '⚡ Auto Play'}
            </button>
            <button class="loop-btn reset" id="loop-btn-reset">
              ↺ Reiniciar
            </button>
          </div>

          <div class="loop-progress-indicator">
            <span class="prog-text">Progreso:</span>
            <div class="prog-bar-track">
              <div class="prog-bar-fill" style="width:${(Math.min(state.currentIndex, total) / total) * 100}%;"></div>
            </div>
            <span class="prog-count">${Math.min(state.currentIndex, total)} / ${total} lecturas</span>
          </div>
        </div>

        <!-- 3. CINTA TRANSPORTADORA DE MEDICIONES -->
        <div class="conveyor-belt-container">
          <div class="conveyor-track">
            ${state.readings.map((r, i) => {
              const isPast = i < state.currentIndex;
              const isCurrent = i === state.currentIndex && !isCompleted;
              const ev = evaluarDeformacion(r.val);

              let cardClass = "conveyor-item";
              if (isPast) cardClass += " item-processed";
              if (isCurrent) cardClass += " item-active pulse-ring";
              if (r.val >= 10.0) cardClass += " item-threshold-exceeded";

              return `
                <div class="${cardClass}" title="Lectura ${r.id} (${r.val} mm)">
                  <div class="item-tag">${r.id} (${r.time})</div>
                  <div class="item-val">${r.val} <small>mm</small></div>
                  <div class="item-status" style="color:${ev.color};">
                    ${ev.tag}
                  </div>
                  ${isCurrent ? '<div class="item-pointer">▲ EN PROCESO</div>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. TRAZADO DE CÓDIGO Y TERMINAL EN TIEMPO REAL -->
        <div class="loop-execution-grid">
          <!-- Columna Izquierda: Código con línea activa iluminada -->
          <div class="loop-code-card">
            <div class="trace-header">
              <span class="trace-tag">TRAZADO DE CÓDIGO EN MEMORIA</span>
              <span class="trace-tag-right">
                ${isCompleted ? '🏁 BUCLE FINALIZADO' : `Ciclo ${state.currentIndex + 1} de ${total}`}
              </span>
            </div>
            <pre class="trace-pre"><code><span class="code-line"># 1. Definición previa de la función:</span>
<span class="code-line">def evaluar_deformacion(lectura): ...</span>
<span class="code-line"></span>
<span class="code-line ${!isCompleted ? 'line-highlight-active' : ''}">for lectura in deformaciones:  <span class="tok-live-comment"># lectura = ${currentItem ? currentItem.val + ' mm' : 'Fin de la serie'}</span></span>
<span class="code-line ${!isCompleted ? 'line-highlight-condition' : ''}">    estado = evaluar_deformacion(lectura)  <span class="tok-live-comment"># estado = "${currentEval ? currentEval.tag : '-'}"</span></span>
<span class="code-line ${!isCompleted ? 'line-highlight-active' : ''}">    print(f"{lectura} mm -> {estado}")</span></code></pre>
          </div>

          <!-- Columna Derecha: Salida Impresa en Consola (Como en Jupyter/Terminal) -->
          <div class="loop-results-card">
            <div class="results-header">
              <span class="res-title">🖥️ Salida en Consola (<code>print</code>):</span>
              <span class="res-badge" style="color:var(--accent-primary);">
                ${printedLogs.length} línea(s) impresa(s)
              </span>
            </div>

            <div class="for-terminal-output">
              <div style="color:var(--text-dim); font-size:0.74rem; margin-bottom:4px;">
                # Terminal interactiva de Python:
              </div>
              ${printedLogs.length > 0 ? printedLogs.map(l => `
                <div style="line-height:1.45;">
                  <span style="color:#38bdf8;">&gt;&gt;&gt;</span> 
                  <span style="color:${l.color}; font-weight:600;">${l.text}</span>
                </div>
              `).join('') : `
                <div style="color:var(--text-muted); font-style:italic; padding:0.5rem 0;">
                  (Presiona "▶ Siguiente Ciclo" para iniciar la primera iteración...)
                </div>
              `}
              ${isCompleted ? `
                <div style="margin-top:6px; color:#10b981; font-weight:700; border-top:1px dashed #334155; padding-top:4px;">
                  ✓ Proceso finalizado: Todas las lecturas fueron evaluadas e impresas.
                </div>
              ` : ''}
            </div>

            <div class="results-summary-row">
              <div class="sum-item">
                <span class="sum-label">Lecturas Procesadas:</span>
                <span class="sum-num">${Math.min(state.currentIndex, total)} / ${total}</span>
              </div>
              <div class="sum-item">
                <span class="sum-label">Críticas (≥ 10 mm):</span>
                <span class="sum-num" style="color:#ef4444; font-weight:800;">
                  ${state.readings.slice(0, state.currentIndex).filter(r => r.val >= 10.0).length}
                </span>
              </div>
              <div class="sum-item">
                <span class="sum-label">Normales / Preventivas:</span>
                <span class="sum-num" style="color:#10b981; font-weight:800;">
                  ${state.readings.slice(0, state.currentIndex).filter(r => r.val < 10.0).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. FUNDAMENTOS GEOTÉCNICOS -->
        <div class="idx-conceptual-footer" style="margin-top:1rem;">
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">🎯</span>
            <div class="idx-concept-text">
              <strong>Sin Contadores Ni Índices Manuales:</strong><br>
              A diferencia de otros entornos donde debes gestionar variables auxiliares (<code>i = 0, i++</code>), en Python el bucle <code>for valor in serie:</code> extrae directamente el dato físico medido en cada vuelta.
            </div>
          </div>
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">⚙️</span>
            <div class="idx-concept-text">
              <strong>Aplicación Modular de Funciones:</strong><br>
              La función empaqueta el criterio técnico de evaluación (Lección 1.4) y el bucle <code>for</code> se encarga de aplicarla automáticamente a cada lectura, comunicando los diagnósticos en pantalla mediante <code>print()</code>.
            </div>
          </div>
        </div>

      </div>
    `;

    attachEvents();
  }

  function advanceStep() {
    if (state.currentIndex < state.readings.length) {
      state.currentIndex++;
      renderWidget();
    } else {
      pauseAutoPlay();
    }
  }

  function toggleAutoPlay() {
    if (state.isPlaying) {
      pauseAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  function startAutoPlay() {
    if (state.currentIndex >= state.readings.length) {
      state.currentIndex = 0;
    }
    state.isPlaying = true;
    state.timer = setInterval(() => {
      if (state.currentIndex < state.readings.length) {
        state.currentIndex++;
        renderWidget();
      } else {
        pauseAutoPlay();
      }
    }, 1100);
    renderWidget();
  }

  function pauseAutoPlay() {
    state.isPlaying = false;
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
    renderWidget();
  }

  function resetLoop() {
    pauseAutoPlay();
    state.currentIndex = 0;
    renderWidget();
  }

  function attachEvents() {
    const btnStep = document.getElementById("loop-btn-step");
    const btnPlay = document.getElementById("loop-btn-play");
    const btnReset = document.getElementById("loop-btn-reset");

    if (btnStep) btnStep.addEventListener("click", advanceStep);
    if (btnPlay) btnPlay.addEventListener("click", toggleAutoPlay);
    if (btnReset) btnReset.addEventListener("click", resetLoop);
  }

  window.initForLoopWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("for-loop-container")) {
      window.initForLoopWidget();
    }
  });
})();
