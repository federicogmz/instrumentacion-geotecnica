/**
 * list-indexing.js
 * Componente visual interactivo para la enseñanza de Listas, Indexación y Slicing en Python.
 * Contexto Geotécnico: Batería de sensores piezométricos a lo largo de un sondeo (PZ-01 a PZ-05).
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    selectedIndex: 0,
    sliceStart: 1,
    sliceStop: 4,
    activeTab: "single", // 'single', 'slicing', 'aggregations'
    sensors: [
      { id: "PZ-01", depth: "2.0 m", pressure: 12.5, status: "Normal" },
      { id: "PZ-02", depth: "5.0 m", pressure: 18.2, status: "Normal" },
      { id: "PZ-03", depth: "8.5 m", pressure: 25.0, status: "Normal" },
      { id: "PZ-04", depth: "12.0 m", pressure: 31.4, status: "Alerta" },
      { id: "PZ-05", depth: "16.0 m", pressure: 42.8, status: "Crítico" },
    ]
  };

  function renderWidget() {
    const container = document.getElementById("list-indexing-container");
    if (!container) return;

    const n = state.sensors.length;

    let contentHtml = "";
    if (state.mode === "whiteboard") {
      contentHtml = renderWhiteboardMode(n);
    } else {
      contentHtml = renderSimulatorMode(n);
    }

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.2</span>
            <h4 class="flow-title">Batería de Sensores: Indexación y Slicing en Python</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="idx-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="idx-mode-wb">
              📋 Esquema Conceptual (Pizarra)
            </button>
          </div>
        </div>

        ${contentHtml}
      </div>
    `;

    attachEvents();
  }

  function renderWhiteboardMode(n) {
    return `
      <div class="whiteboard-view animate-fade-in">
        <div class="wb-diagram-col">
          <div class="wb-title-badge">MEMORIA CONTIGUA DE SENSORES: <code>presiones_kpa</code></div>
          
          <div class="wb-index-table-wrapper">
            <!-- Índices Positivos -->
            <div class="wb-idx-row pos-row">
              <span class="wb-idx-label">Índice Positivo ➔</span>
              <div class="wb-cells-group">
                ${state.sensors.map((s, i) => `
                  <div class="wb-idx-cell pos-cell">
                    <span class="idx-num">[ ${i} ]</span>
                    <span class="idx-arrow">▼</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Cajas de Datos en Memoria -->
            <div class="wb-data-row">
              <span class="wb-idx-label">Valor en Lista ➔</span>
              <div class="wb-cells-group">
                ${state.sensors.map((s, i) => `
                  <div class="wb-data-cell">
                    <span class="cell-sensor">${s.id}</span>
                    <span class="cell-val">${s.pressure}</span>
                    <span class="cell-unit">kPa (${s.depth})</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Índices Negativos -->
            <div class="wb-idx-row neg-row">
              <span class="wb-idx-label">Índice Negativo ➔</span>
              <div class="wb-cells-group">
                ${state.sensors.map((s, i) => `
                  <div class="wb-idx-cell neg-cell">
                    <span class="idx-arrow">▲</span>
                    <span class="idx-num">[ ${i - n} ]</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="wb-annotations-grid">
            <div class="wb-note-card">
              <span class="wb-note-icon">💡</span>
              <div class="wb-note-text">
                <strong>¿Por qué empieza en 0?</strong><br>
                El índice indica el <em>desplazamiento (offset)</em> en la memoria RAM desde el puntero inicial.
                El primer elemento está a <code>0</code> pasos de distancia.
              </div>
            </div>
            <div class="wb-note-card highlight-danger">
              <span class="wb-note-icon">📌</span>
              <div class="wb-note-text">
                <strong>Último elemento con <code>[-1]</code>:</strong><br>
                No necesitas calcular <code>len(lista) - 1</code>. En geotecnia, <code>presiones[-1]</code> extrae directamente la lectura del sensor más profundo o más reciente.
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-blue); margin-top:0;">✂️ Regla de Oro del Slicing: <code>[inicio : fin]</code></h5>
            <div class="wb-code-block">
# Sintaxis de rebanado
sub_tramo = presiones[1:4]
# Toma los índices: 1, 2, 3
# Resultado: [18.2, 25.0, 31.4]
# ¡El índice 4 (fin) NUNCA se incluye!</div>
            <ul class="bullet-list" style="margin-top:12px; font-size:0.88em; gap:8px;">
              <li><strong>Inicio (inclusivo):</strong> Comienza en el índice especificado. Si se omite <code>[:3]</code>, empieza desde <code>0</code>.</li>
              <li><strong>Fin (exclusivo):</strong> Se detiene estrictamente en <code>fin - 1</code>. Si se omite <code>[2:]</code>, va hasta el final.</li>
              <li><strong>Longitud resultante:</strong> Siempre es exactamente <code>fin - inicio</code> (aquí: 4 - 1 = 3 elementos).</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode(n) {
    const sel = state.selectedIndex;
    // normalizar indice positivo si es negativo
    const normIdx = sel >= 0 ? sel : n + sel;
    const currentSensor = state.sensors[normIdx] || state.sensors[0];

    // Slicing slice
    const sliceItems = state.sensors.slice(state.sliceStart, state.sliceStop);

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Sub-pestañas de simulación -->
        <div class="idx-subtabs">
          <button class="idx-subtab-btn ${state.activeTab === 'single' ? 'active' : ''}" data-tab="single">
            🎯 Acceso por Índice Directo
          </button>
          <button class="idx-subtab-btn ${state.activeTab === 'slicing' ? 'active' : ''}" data-tab="slicing">
            ✂️ Rebanado (Slicing [start:stop])
          </button>
          <button class="idx-subtab-btn ${state.activeTab === 'aggregations' ? 'active' : ''}" data-tab="aggregations">
            📊 Funciones Nativas (len, sum, min, max)
          </button>
        </div>

        <!-- Visualizador Central de Memoria Contigua -->
        <div class="idx-visual-memory">
          <div class="memory-grid">
            ${state.sensors.map((s, i) => {
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
                <div class="memory-node ${isSelected ? 'node-selected' : ''} ${isSliceSelected ? 'node-sliced' : ''}">
                  <div class="node-pos-idx">i = ${i}</div>
                  <div class="node-body">
                    <span class="node-sensor-id">${s.id}</span>
                    <span class="node-val">${s.pressure}</span>
                    <span class="node-unit">kPa</span>
                    <span class="node-depth">${s.depth}</span>
                  </div>
                  <div class="node-neg-idx">i = ${i - n}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Panel de Control y Código Dinámico -->
        <div class="idx-controls-panel">
          ${renderTabControls(n, normIdx, currentSensor, sliceItems)}
        </div>
      </div>
    `;
  }

  function renderTabControls(n, normIdx, currentSensor, sliceItems) {
    if (state.activeTab === 'single') {
      return `
        <div class="idx-tab-content">
          <div class="idx-control-group">
            <label class="idx-control-title">Selecciona el índice a consultar en <code>presiones</code>:</label>
            <div class="idx-btn-pills">
              <span class="pills-label">Positivos:</span>
              ${state.sensors.map((s, i) => `
                <button class="idx-pill-btn ${state.selectedIndex === i ? 'active' : ''}" data-idx="${i}">
                  [${i}]
                </button>
              `).join('')}
            </div>
            <div class="idx-btn-pills" style="margin-top:6px;">
              <span class="pills-label">Negativos:</span>
              ${state.sensors.map((s, i) => {
                const neg = i - n;
                return `
                  <button class="idx-pill-btn neg-pill ${state.selectedIndex === neg ? 'active' : ''}" data-idx="${neg}">
                    [${neg}]
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <div class="idx-result-card">
            <div class="idx-code-snippet">
              <span class="code-comment"># Extracción en tiempo real</span>
              <code>lectura = presiones[${state.selectedIndex}]</code>
              <span class="code-comment"># Sensor: ${currentSensor.id} (${currentSensor.depth})</span>
              <div class="code-output">➔ Valor retornado: <strong>${currentSensor.pressure} kPa</strong> (${currentSensor.status})</div>
            </div>
            <div class="idx-explanation">
              ${state.selectedIndex === 0 
                ? '⭐ <strong>Índice [0]:</strong> Primer elemento de la lista (sensor más superficial PZ-01 a 2.0 m).'
                : state.selectedIndex === -1
                ? '🚨 <strong>Índice [-1]:</strong> Último elemento de la lista (sensor más profundo PZ-05 a 16.0 m). ¡Ideal para lecturas en tiempo real!'
                : `Acceso al sensor <strong>${currentSensor.id}</strong> ubicado a <strong>${currentSensor.depth}</strong>.`
              }
            </div>
          </div>
        </div>
      `;
    }

    if (state.activeTab === 'slicing') {
      return `
        <div class="idx-tab-content">
          <div class="idx-control-group">
            <label class="idx-control-title">Ajusta los extremos del corte <code>presiones[start : stop]</code>:</label>
            <div class="slicing-sliders-grid">
              <div class="slider-field">
                <span>Inicio (start, inclusivo): <strong id="val-slice-start">${state.sliceStart}</strong></span>
                <input type="range" min="0" max="3" step="1" value="${state.sliceStart}" id="slider-slice-start" class="flow-slider">
              </div>
              <div class="slider-field">
                <span>Fin (stop, exclusivo): <strong id="val-slice-stop">${state.sliceStop}</strong></span>
                <input type="range" min="1" max="5" step="1" value="${state.sliceStop}" id="slider-slice-stop" class="flow-slider">
              </div>
            </div>
          </div>

          <div class="idx-result-card">
            <div class="idx-code-snippet">
              <span class="code-comment"># Rebanado de lista en Python</span>
              <code>tramo = presiones[${state.sliceStart} : ${state.sliceStop}]</code>
              <div class="code-output">
                ➔ Sublista resultante: <strong>[ ${sliceItems.map(s => s.pressure).join(', ')} ]</strong>
              </div>
            </div>
            <div class="idx-explanation">
              Elementos extraídos: <strong>${sliceItems.length}</strong> (desde el índice <code>${state.sliceStart}</code> hasta el <code>${state.sliceStop - 1}</code>).
              ${state.sliceStop <= state.sliceStart ? '<span style="color:var(--accent-red);">⚠️ Cuando start &gt;= stop, Python retorna una lista vacía <code>[]</code>.</span>' : ''}
            </div>
          </div>
        </div>
      `;
    }

    if (state.activeTab === 'aggregations') {
      const pressures = state.sensors.map(s => s.pressure);
      const sum = pressures.reduce((a, b) => a + b, 0);
      const avg = (sum / pressures.length).toFixed(2);
      const min = Math.min(...pressures);
      const max = Math.max(...pressures);

      return `
        <div class="idx-tab-content">
          <div class="aggregations-grid">
            <div class="agg-card">
              <span class="agg-fn">len(presiones)</span>
              <span class="agg-val">${pressures.length}</span>
              <span class="agg-desc">Número total de sensores en el pozo</span>
            </div>
            <div class="agg-card">
              <span class="agg-fn">sum(presiones)</span>
              <span class="agg-val">${sum.toFixed(1)} <small>kPa</small></span>
              <span class="agg-desc">Suma acumulada de presiones</span>
            </div>
            <div class="agg-card highlight">
              <span class="agg-fn">sum() / len()</span>
              <span class="agg-val">${avg} <small>kPa</small></span>
              <span class="agg-desc">Presión de poros promedio</span>
            </div>
            <div class="agg-card">
              <span class="agg-fn">min() / max()</span>
              <span class="agg-val">${min} / ${max} <small>kPa</small></span>
              <span class="agg-desc">Rango de presiones en el perfil</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  function attachEvents() {
    const btnSim = document.getElementById("idx-mode-sim");
    const btnWb = document.getElementById("idx-mode-wb");

    if (btnSim) {
      btnSim.addEventListener("click", () => {
        state.mode = "simulator";
        renderWidget();
      });
    }
    if (btnWb) {
      btnWb.addEventListener("click", () => {
        state.mode = "whiteboard";
        renderWidget();
      });
    }

    // Tabs
    document.querySelectorAll(".idx-subtab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.dataset.tab;
        renderWidget();
      });
    });

    // Pills single index
    document.querySelectorAll(".idx-pill-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.selectedIndex = parseInt(btn.dataset.idx, 10);
        renderWidget();
      });
    });

    // Slicing sliders
    const sStart = document.getElementById("slider-slice-start");
    const sStop = document.getElementById("slider-slice-stop");

    if (sStart && sStop) {
      sStart.addEventListener("input", (e) => {
        state.sliceStart = parseInt(e.target.value, 10);
        if (state.sliceStart >= state.sliceStop) {
          state.sliceStop = Math.min(5, state.sliceStart + 1);
        }
        renderWidget();
      });

      sStop.addEventListener("input", (e) => {
        state.sliceStop = parseInt(e.target.value, 10);
        if (state.sliceStop <= state.sliceStart) {
          state.sliceStart = Math.max(0, state.sliceStop - 1);
        }
        renderWidget();
      });
    }
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
