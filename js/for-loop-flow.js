/**
 * for-loop-flow.js
 * Componente visual interactivo para la enseñanza de Bucles FOR e iteración en Python.
 * Contexto Geotécnico: Cinta transportadora de lecturas de extensómetro y detección de umbrales críticos.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    currentIndex: 0,
    isPlaying: false,
    timer: null,
    threshold: 10.0,
    readings: [
      { id: "L-01", val: 4.2, time: "08:00" },
      { id: "L-02", val: 8.5, time: "09:00" },
      { id: "L-03", val: 12.1, time: "10:00" },
      { id: "L-04", val: 7.8, time: "11:00" },
      { id: "L-05", val: 15.3, time: "12:00" }
    ],
    results: [],
  };

  function computeResultsUpTo(index) {
    const res = [];
    for (let i = 0; i <= index && i < state.readings.length; i++) {
      const item = state.readings[i];
      if (item.val >= state.threshold) {
        res.push({
          idx: i,
          id: item.id,
          val: item.val,
          time: item.time,
          status: "CRÍTICO (>= 10.0 mm)"
        });
      }
    }
    return res;
  }

  function renderWidget() {
    const container = document.getElementById("for-loop-container");
    if (!container) return;

    let contentHtml = "";
    if (state.mode === "whiteboard") {
      contentHtml = renderWhiteboardMode();
    } else {
      contentHtml = renderSimulatorMode();
    }

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.5</span>
            <h4 class="flow-title">Bucles con <code>for</code>: La Cinta Transportadora de Sensores</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="loop-mode-sim">
              ⚡ Simulador Paso a Paso
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="loop-mode-wb">
              📋 Esquema Conceptual (Pizarra)
            </button>
          </div>
        </div>

        ${contentHtml}
      </div>
    `;

    attachEvents();
  }

  function renderWhiteboardMode() {
    return `
      <div class="whiteboard-view animate-fade-in">
        <div class="wb-diagram-col">
          <div class="wb-title-badge">CÓMO FUNCIONA UN BUCLE <code>for</code> EN MEMORIA</div>

          <div class="wb-conveyor-schematic">
            <!-- 1. Lista Fuente -->
            <div class="conveyor-source-box">
              <span class="source-tag">1. COLECCIÓN FUENTE (Iterable)</span>
              <div class="source-items-preview">
                <code>lecturas = [4.2, 8.5, 12.1, 7.8, 15.3]</code>
              </div>
            </div>

            <!-- Flecha hacia extractor -->
            <div class="conveyor-arrow">▼ toma 1 elemento por ciclo ▼</div>

            <!-- 2. Variable Iteradora -->
            <div class="conveyor-iterator-box">
              <span class="iterator-tag">2. VARIABLE TEMPORAL: <code>for lectura in lecturas:</code></span>
              <div class="iterator-badge">
                <span class="it-var">lectura</span> = valor actual del turno
              </div>
            </div>

            <!-- Flecha hacia estación de proceso -->
            <div class="conveyor-arrow">▼ ingresa al bloque indentado ▼</div>

            <!-- 3. Estación de Proceso -->
            <div class="conveyor-station-box">
              <span class="station-tag">3. ESTACIÓN DE PROCESAMIENTO (4 espacios)</span>
              <div class="station-logic">
                <div class="logic-code">
                  <code>if lectura >= 10.0:</code><br>
                  &nbsp;&nbsp;&nbsp;&nbsp;<code>alertas.append(lectura)</code>
                </div>
              </div>
            </div>

            <!-- Flecha hacia colector -->
            <div class="conveyor-arrow">▼ acumula si se cumple ▼</div>

            <!-- 4. Lista Acumuladora -->
            <div class="conveyor-accumulator-box">
              <span class="acc-tag">4. RESULTADO ACUMULADO</span>
              <div class="acc-items-preview">
                <code>alertas ➔ [12.1, 15.3]</code>
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-emerald); margin-top:0;">🎯 Los 3 Principios del <code>for</code> en Python</h5>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:10px;">
              <li><strong>Sin contadores manuales:</strong> A diferencia de C o Java, en Python no necesitas <code>i = 0; i &lt; n; i++</code>. El <code>for</code> extrae directamente los valores reales de la lista.</li>
              <li><strong>Auto-terminación:</strong> El bucle sabe exactamente cuándo termina la lista. Cuando se procesa el último elemento, sale automáticamente sin peligro de desbordamiento.</li>
              <li><strong>El Patrón Acumulador:</strong> Creas una lista vacía <code>alertas = []</code> antes del bucle, y dentro usas <code>.append()</code> para guardar solo lo que te interesa.</li>
            </ul>
          </div>

          <div class="wb-card-glass" style="margin-top:14px; border-left:3px solid var(--accent-blue);">
            <h5 style="color:var(--accent-blue); margin-top:0;">⚡ Aplicación de Funciones</h5>
            <p style="font-size:0.85em; color:var(--text-muted); margin:0;">
              En instrumentación, un bucle <code>for</code> es el motor que aplica las funciones creadas en la Lección 1.4 a miles de datos de sensores provenientes de dataloggers en campo.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const total = state.readings.length;
    const isCompleted = state.currentIndex >= total;
    const currentItem = isCompleted ? null : state.readings[state.currentIndex];
    const accumulated = computeResultsUpTo(isCompleted ? total - 1 : state.currentIndex);
    const isCurrentAlert = currentItem && currentItem.val >= state.threshold;

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Barra de Control de Simulación -->
        <div class="loop-toolbar">
          <div class="loop-buttons">
            <button class="loop-btn primary" id="loop-btn-step" ${isCompleted ? 'disabled' : ''}>
              ▶ Siguiente Paso (${state.currentIndex + 1}/${total})
            </button>
            <button class="loop-btn secondary" id="loop-btn-play">
              ${state.isPlaying ? '⏸ Pausar' : '⚡ Auto Play'}
            </button>
            <button class="loop-btn reset" id="loop-btn-reset">
              ↺ Reiniciar
            </button>
          </div>

          <div class="loop-progress-indicator">
            <span class="prog-text">Progreso del Bucle:</span>
            <div class="prog-bar-track">
              <div class="prog-bar-fill" style="width:${(state.currentIndex / total) * 100}%;"></div>
            </div>
            <span class="prog-count">${Math.min(state.currentIndex, total)} / ${total}</span>
          </div>
        </div>

        <!-- Cinta de Lecturas (Conveyor Belt) -->
        <div class="conveyor-belt-container">
          <div class="conveyor-track">
            ${state.readings.map((r, i) => {
              const isPast = i < state.currentIndex;
              const isCurrent = i === state.currentIndex && !isCompleted;
              const isFuture = i > state.currentIndex || isCompleted;

              let cardClass = "conveyor-item";
              if (isPast) cardClass += " item-processed";
              if (isCurrent) cardClass += " item-active pulse-ring";
              if (r.val >= state.threshold) cardClass += " item-threshold-exceeded";

              return `
                <div class="${cardClass}">
                  <div class="item-tag">${r.id} (${r.time})</div>
                  <div class="item-val">${r.val} <small>mm</small></div>
                  <div class="item-status">
                    ${r.val >= state.threshold ? '🚨 ALERTA' : '✅ NORMAL'}
                  </div>
                  ${isCurrent ? '<div class="item-pointer">▲ lectura actual</div>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Trazador de Código e Indicador de Acumulación -->
        <div class="loop-execution-grid">
          <!-- Columna Izquierda: Código con línea activa iluminada -->
          <div class="loop-code-card">
            <div class="trace-header">
              <span class="trace-tag">TRAZADO DE EJECUCIÓN</span>
              <span class="trace-tag-right">
                ${isCompleted ? '🏁 BUCLE FINALIZADO' : `Ciclo ${state.currentIndex + 1} de ${total}`}
              </span>
            </div>
            <pre class="trace-pre"><code><span class="code-line">alertas_criticas = []</span>
<span class="code-line ${!isCompleted ? 'line-highlight-active' : ''}">for lectura in lecturas:  <span class="tok-live-comment"># lectura = ${currentItem ? currentItem.val + ' mm' : 'Fin'}</span></span>
<span class="code-line ${!isCompleted ? 'line-highlight-condition' : ''}">    if lectura >= 10.0:   <span class="tok-live-comment"># ¿${currentItem ? currentItem.val + ' >= 10.0' : '-'}? ➔ ${isCurrentAlert ? 'True' : 'False'}</span></span>
<span class="code-line ${!isCompleted && isCurrentAlert ? 'line-highlight-append' : ''}">        alertas_criticas.append(lectura)</span>
<span class="code-line ${isCompleted ? 'line-highlight-active' : ''}">print(f"Total alertas: {len(alertas_criticas)}")</span></code></pre>
          </div>

          <!-- Columna Derecha: Estado de la Lista Acumuladora -->
          <div class="loop-results-card">
            <div class="results-header">
              <span class="res-title">Lista Acumuladora <code>alertas_criticas</code>:</span>
              <span class="res-badge">${accumulated.length} evento(s)</span>
            </div>

            <div class="results-box">
              [
              ${accumulated.map(a => `
                <span class="res-pill">
                  <strong>${a.val} mm</strong> (${a.id})
                </span>
              `).join(', ')}
              ${accumulated.length === 0 ? '<span class="res-empty">(Lista vacía por ahora...)</span>' : ''}
              ]
            </div>

            <div class="results-summary-row">
              <div class="sum-item">
                <span class="sum-label">Lecturas Analizadas:</span>
                <span class="sum-num">${Math.min(state.currentIndex, total)} / ${total}</span>
              </div>
              <div class="sum-item">
                <span class="sum-label">Superaron Umbral:</span>
                <span class="sum-num" style="color:var(--accent-red);">${accumulated.length}</span>
              </div>
              <div class="sum-item">
                <span class="sum-label">En Rango Normal:</span>
                <span class="sum-num" style="color:var(--accent-emerald);">${Math.min(state.currentIndex, total) - accumulated.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function stepForward() {
    if (state.currentIndex < state.readings.length) {
      state.currentIndex++;
      renderWidget();
    } else {
      pauseAutoPlay();
    }
  }

  function startAutoPlay() {
    state.isPlaying = true;
    if (state.currentIndex >= state.readings.length) {
      state.currentIndex = 0;
    }
    renderWidget();
    state.timer = setInterval(() => {
      if (state.currentIndex < state.readings.length) {
        state.currentIndex++;
        renderWidget();
      } else {
        pauseAutoPlay();
      }
    }, 1200);
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
    const btnSim = document.getElementById("loop-mode-sim");
    const btnWb = document.getElementById("loop-mode-wb");

    if (btnSim) {
      btnSim.addEventListener("click", () => {
        pauseAutoPlay();
        state.mode = "simulator";
        renderWidget();
      });
    }
    if (btnWb) {
      btnWb.addEventListener("click", () => {
        pauseAutoPlay();
        state.mode = "whiteboard";
        renderWidget();
      });
    }

    const btnStep = document.getElementById("loop-btn-step");
    const btnPlay = document.getElementById("loop-btn-play");
    const btnReset = document.getElementById("loop-btn-reset");

    if (btnStep) {
      btnStep.addEventListener("click", () => {
        pauseAutoPlay();
        stepForward();
      });
    }

    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        if (state.isPlaying) {
          pauseAutoPlay();
        } else {
          startAutoPlay();
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        resetLoop();
      });
    }
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
