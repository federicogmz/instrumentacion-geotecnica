/**
 * list-indexing.js
 * Componente visual interactivo y conceptual integrado para la enseñanza de Listas,
 * Indexación (base 0 y negativa) y Slicing en Python aplicado a Geotecnia.
 * Contexto: Serie temporal diaria de deformaciones en un extensómetro de grieta (Ancón Norte).
 */

(function () {
  let state = {
    selectedIndex: 0,
    sliceStart: 2,
    sliceStop: 5,
    activeTab: "single", // 'single', 'slicing', 'aggregations'
    readings: [
      { id: "Día 1", time: "t0", val: 0.2, status: "Línea Base", tagClass: "tag-baseline", note: "Instalación del sensor en la corona y calibración a cero" },
      { id: "Día 2", time: "t1", val: 0.5, status: "Normal", tagClass: "tag-normal", note: "Deformación elástica inicial del macizo rocoso" },
      { id: "Día 3", time: "t2", val: 0.9, status: "Normal", tagClass: "tag-normal", note: "Inicio de lluvias continuas registradas por pluviómetro" },
      { id: "Día 4", time: "t3", val: 1.4, status: "Atención", tagClass: "tag-alert", note: "Aceleración leve de la grieta por infiltración de agua" },
      { id: "Día 5", time: "t4", val: 2.2, status: "Alerta", tagClass: "tag-alert", note: "Apertura progresiva y saturación del talud" },
      { id: "Día 6", time: "t5", val: 2.9, status: "Alerta", tagClass: "tag-alert", note: "Superación del umbral preventivo de seguridad" },
      { id: "Día 7", time: "t6", val: 3.8, status: "Crítico", tagClass: "tag-critical", note: "Lectura más reciente en tiempo real (alerta de evacuación)" }
    ]
  };

  const slicePresets = [
    { label: "📅 Línea Base (Día 1 a 3)", start: 0, stop: 3 },
    { label: "🌧️ Evento de Lluvias (Día 3 a 5)", start: 2, stop: 5 },
    { label: "🚨 Ventana Crítica (Día 5 a 7)", start: 4, stop: 7 },
    { label: "📊 Registro Completo (7 Días)", start: 0, stop: 7 }
  ];

  function renderWidget() {
    const container = document.getElementById("list-indexing-container");
    if (!container) return;

    const n = state.readings.length;
    const sel = state.selectedIndex;
    // Normalizar índice si es negativo para ubicar nodo físico
    const normIdx = sel >= 0 ? sel : n + sel;
    const currentReading = state.readings[normIdx] || state.readings[0];
    const sliceItems = state.readings.slice(state.sliceStart, state.sliceStop);

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.2 &bull; Serie Temporal en Tiempo Real</span>
            <h4 class="flow-title">📈 Extensómetro de Corona: Anatomía de una Serie Temporal en Memoria</h4>
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          La variable <code>deformaciones = [0.2, 0.5, 0.9, 1.4, 2.2, 2.9, 3.8]</code> registra 7 días de monitoreo milimétrico de grieta en el talud de <strong>Ancón Norte</strong>. Haz clic en cualquier día o índice para interactuar:
        </p>

        <!-- Visualizador Central de Serie Temporal (Memoria Contigua) -->
        <div class="idx-visual-memory">
          <div class="memory-grid">
            ${state.readings.map((r, i) => {
              let isSelected = false;
              let isSliceSelected = false;

              if (state.activeTab === 'single') {
                isSelected = (i === normIdx);
              } else if (state.activeTab === 'slicing') {
                isSliceSelected = (i >= state.sliceStart && i < state.sliceStop);
              } else {
                isSelected = true;
              }

              return `
                <div class="memory-node ${isSelected ? 'node-selected' : ''} ${isSliceSelected ? 'node-sliced' : ''}" data-idx="${i}" title="Clic para seleccionar ${r.id}">
                  <div class="node-pos-idx">i = ${i}</div>
                  <div class="node-body">
                    <span class="node-sensor-id">${r.id}</span>
                    <span class="node-val">${r.val}</span>
                    <span class="node-unit">mm</span>
                    <span class="node-tag-badge ${r.tagClass}">${r.status}</span>
                    <span class="node-depth">${r.time}</span>
                  </div>
                  <div class="node-neg-idx">i = ${i - n}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Sub-pestañas de Operación -->
        <div class="idx-subtabs">
          <button class="idx-subtab-btn ${state.activeTab === 'single' ? 'active' : ''}" data-tab="single">
            🎯 Acceso por Índice Directo
          </button>
          <button class="idx-subtab-btn ${state.activeTab === 'slicing' ? 'active' : ''}" data-tab="slicing">
            ✂️ Rebanado Temporal (Slicing [start:stop])
          </button>
          <button class="idx-subtab-btn ${state.activeTab === 'aggregations' ? 'active' : ''}" data-tab="aggregations">
            📈 Estadísticos de Serie (len, sum, promedio)
          </button>
        </div>

        <!-- Panel de Control y Salida en Vivo -->
        <div class="idx-controls-panel">
          ${renderTabControls(n, normIdx, currentReading, sliceItems)}
        </div>

        <!-- Pizarra Conceptual Integrada al Pie -->
        <div class="idx-conceptual-footer">
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">💡</span>
            <div class="idx-concept-text">
              <strong>¿Por qué en series de tiempo empezamos en índice 0?</strong><br>
              En física y programación, el índice representa el <em>tiempo transcurrido o desplazamiento (offset)</em> respecto al origen: en el momento inicial $t_0$, han pasado exactamente <code>0</code> intervalos de muestreo.
            </div>
          </div>
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">🚨</span>
            <div class="idx-concept-text">
              <strong>Poder de <code>[-1]</code> en Telemetría y Alerta Temprana:</strong><br>
              En sistemas de monitoreo continuo (SAT), <code>deformaciones[-1]</code> consulta al instante la <strong>lectura más reciente del datalogger</strong> sin requerir saber cuántos días o miles de muestras tiene la serie.
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderTabControls(n, normIdx, currentReading, sliceItems) {
    if (state.activeTab === 'single') {
      return `
        <div class="idx-tab-content">
          <div class="idx-control-group">
            <label class="idx-control-title">Selecciona el día o posición a consultar en <code>deformaciones</code>:</label>
            <div class="idx-btn-pills">
              <span class="pills-label">Positivos:</span>
              ${state.readings.map((r, i) => `
                <button class="idx-pill-btn ${state.selectedIndex === i ? 'active' : ''}" data-idx="${i}" title="${r.id} (${r.time})">
                  [${i}]
                </button>
              `).join('')}
            </div>
            <div class="idx-btn-pills" style="margin-top:0.45rem;">
              <span class="pills-label">Negativos:</span>
              ${state.readings.map((r, i) => {
                const neg = i - n;
                return `
                  <button class="idx-pill-btn neg-pill ${state.selectedIndex === neg ? 'active' : ''}" data-idx="${neg}" title="${r.id} (${r.time})">
                    [${neg}]
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="idx-result-card">
            <div class="idx-code-snippet">
              <span class="code-comment"># Consulta en tiempo real por índice temporal</span>
              <code>lectura = deformaciones[${state.selectedIndex}]</code>
              <span class="code-comment"># Registro: ${currentReading.id} (${currentReading.time}) &bull; Condición: ${currentReading.status}</span>
              <div class="code-output">➔ Valor retornado: <strong>${currentReading.val} mm</strong> (${currentReading.status})</div>
            </div>
            <div class="idx-explanation">
              ${getIndexExplanation(state.selectedIndex, n, currentReading)}
            </div>
          </div>
        </div>
      `;
    }

    if (state.activeTab === 'slicing') {
      // Buscar si la selección actual coincide con algún preset
      const currentPresetIdx = slicePresets.findIndex(
        p => p.start === state.sliceStart && p.stop === state.sliceStop
      );

      const sliceVals = sliceItems.map(r => r.val);

      return `
        <div class="idx-tab-content">
          <div class="discrete-slice-box">
            <!-- 1. Presets Geotécnicos de Ventana Rápida -->
            <div class="slice-presets-container">
              <span class="slice-presets-label">⚡ Ventanas de Monitoreo Geotécnico Típicas:</span>
              <div class="slice-presets-pills">
                ${slicePresets.map((p, idx) => `
                  <button class="slice-preset-btn ${currentPresetIdx === idx ? 'active' : ''}" data-preset="${idx}">
                    ${p.label} <code>[${p.start}:${p.stop}]</code>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- 2. Selectores Discretos para Inicio y Fin -->
            <div class="discrete-pickers-grid">
              <!-- Selector de Inicio (Start) -->
              <div class="picker-column">
                <span class="picker-label">Inicio de Ventana (<code>start</code>, inclusivo): <strong>Día ${state.sliceStart + 1} (i = ${state.sliceStart})</strong></span>
                <div class="picker-buttons-row">
                  ${[0, 1, 2, 3, 4, 5].map(idx => `
                    <button class="discrete-idx-btn ${state.sliceStart === idx ? 'active-start' : ''}" data-pick-start="${idx}">
                      [${idx}] Día ${idx + 1}
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Selector de Fin (Stop) -->
              <div class="picker-column">
                <span class="picker-label">Fin de Ventana (<code>stop</code>, exclusivo): <strong>Corta antes de Día ${state.sliceStop + 1} (i = ${state.sliceStop})</strong></span>
                <div class="picker-buttons-row">
                  ${[1, 2, 3, 4, 5, 6, 7].map(idx => `
                    <button class="discrete-idx-btn ${state.sliceStop === idx ? 'active-stop' : ''}" data-pick-stop="${idx}">
                      [:${idx}]
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="idx-result-card">
            <div class="idx-code-snippet">
              <span class="code-comment"># Rebanado (slicing) de ventana temporal en Python</span>
              <code>ventana = deformaciones[${state.sliceStart} : ${state.sliceStop}]</code>
              <div class="code-output">
                ➔ Sublista resultante: <strong>[ ${sliceVals.join(', ')} ]</strong> mm
              </div>
            </div>
            <div class="idx-explanation">
              ${state.sliceStop <= state.sliceStart ? `
                <span style="color:#ef4444; font-weight:700;">⚠️ Cuando start &gt;= stop (${state.sliceStart} &gt;= ${state.sliceStop}), Python retorna una lista vacía <code>[]</code> porque el intervalo temporal carece de duración positiva.</span>
              ` : `
                Lecturas aisladas: <strong>${sliceItems.length} días</strong> (desde índice <code>${state.sliceStart}</code> [${sliceItems[0]?.id}] hasta <code>${state.sliceStop - 1}</code> [${sliceItems[sliceItems.length - 1]?.id}]).<br>
                <strong>¿Por qué el extremo <code>stop</code> (${state.sliceStop}) es exclusivo?</strong> En series de tiempo, la resta algebraica <code>stop - start = ${state.sliceStop} - ${state.sliceStart} = ${sliceItems.length}</code> determina exactamente la duración en días de la ventana analizada.
              `}
            </div>
          </div>
        </div>
      `;
    }

    if (state.activeTab === 'aggregations') {
      const vals = state.readings.map(r => r.val);
      const sum = vals.reduce((a, b) => a + b, 0);
      const avg = (sum / vals.length).toFixed(2);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const totalDelta = (vals[vals.length - 1] - vals[0]).toFixed(1);

      return `
        <div class="idx-tab-content">
          <div class="aggregations-grid">
            <div class="agg-card">
              <span class="agg-fn">len(deformaciones)</span>
              <span class="agg-val">${vals.length} <small>días</small></span>
              <span class="agg-desc">Número de muestras temporales registradas</span>
            </div>
            <div class="agg-card">
              <span class="agg-fn">sum(deformaciones)</span>
              <span class="agg-val">${sum.toFixed(1)} <small>mm</small></span>
              <span class="agg-desc">Suma total de lecturas del sensor</span>
            </div>
            <div class="agg-card highlight">
              <span class="agg-fn">sum() / len()</span>
              <span class="agg-val">${avg} <small>mm</small></span>
              <span class="agg-desc">Deformación promedio de la serie analizada</span>
            </div>
            <div class="agg-card">
              <span class="agg-fn">min() / max()</span>
              <span class="agg-val">${min} / ${max} <small>mm</small></span>
              <span class="agg-desc">Rango de apertura (Línea Base vs Máximo)</span>
            </div>
            <div class="agg-card">
              <span class="agg-fn">[-1] - [0]</span>
              <span class="agg-val">+${totalDelta} <small>mm</small></span>
              <span class="agg-desc">Apertura neta acumulada durante los 7 días</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  function getIndexExplanation(idx, n, current) {
    if (idx === 0) {
      return `⭐ <strong>Índice [0] (Línea Base de Referencia):</strong> Corresponde a la primera lectura en $t_0$ (${current.val} mm) tras fijar y calibrar el sensor. Cualquier desplazamiento acumulado futuro se calcula restando este valor inicial.`;
    }
    if (idx === -1 || idx === n - 1) {
      return `🚨 <strong>Índice [-1] (Lectura en Tiempo Real):</strong> Corresponde a la última transmisión del datalogger (${current.val} mm en ${current.id}). En sistemas de alerta temprana (SAT), <code>deformaciones[-1]</code> permite consultar la condición actual inmediata sin importar cuántos miles de datos contenga la serie histórica.`;
    }
    if (idx === -2 || idx === n - 2) {
      const vPrev = current.val;
      const vLast = state.readings[n - 1].val;
      const rate = (vLast - vPrev).toFixed(1);
      return `⚡ <strong>Índice [-2] (Día Anterior):</strong> Lectura de la víspera (${vPrev} mm). ¡Fundamental para calcular la velocidad de deformación diaria!: <code>velocidad = deformaciones[-1] - deformaciones[-2]</code> (${vLast} - ${vPrev} = <strong>${rate} mm/día</strong>).`;
    }
    return `📅 <strong>${current.id} (${current.time}):</strong> Lectura registrada de <strong>${current.val} mm</strong>. Contexto: <em>${current.note}</em>.`;
  }

  function attachEvents() {
    // 1. Clics directos en los nodos de memoria
    document.querySelectorAll(".memory-node").forEach(node => {
      node.addEventListener("click", () => {
        const idx = parseInt(node.dataset.idx, 10);
        if (!isNaN(idx)) {
          state.selectedIndex = idx;
          state.activeTab = "single";
          renderWidget();
        }
      });
    });

    // 2. Pestañas de operación
    document.querySelectorAll(".idx-subtab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.dataset.tab;
        renderWidget();
      });
    });

    // 3. Botones de índice directo (Positivos y Negativos)
    document.querySelectorAll(".idx-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.selectedIndex = parseInt(btn.dataset.idx, 10);
        renderWidget();
      });
    });

    // 4. Presets rápidos de Slicing Geotécnico
    document.querySelectorAll(".slice-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const pIdx = parseInt(btn.dataset.preset, 10);
        if (!isNaN(pIdx) && slicePresets[pIdx]) {
          state.sliceStart = slicePresets[pIdx].start;
          state.sliceStop = slicePresets[pIdx].stop;
          renderWidget();
        }
      });
    });

    // 5. Selectores discretos de Start
    document.querySelectorAll("[data-pick-start]").forEach(btn => {
      btn.addEventListener("click", () => {
        const val = parseInt(btn.dataset.pickStart, 10);
        state.sliceStart = val;
        if (state.sliceStart >= state.sliceStop) {
          state.sliceStop = Math.min(7, state.sliceStart + 1);
        }
        renderWidget();
      });
    });

    // 6. Selectores discretos de Stop
    document.querySelectorAll("[data-pick-stop]").forEach(btn => {
      btn.addEventListener("click", () => {
        const val = parseInt(btn.dataset.pickStop, 10);
        state.sliceStop = val;
        if (state.sliceStop <= state.sliceStart) {
          state.sliceStart = Math.max(0, state.sliceStop - 1);
        }
        renderWidget();
      });
    });
  }

  window.initListIndexingWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("list-indexing-container")) {
      window.initListIndexingWidget();
    }
  });
})();
