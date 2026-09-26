/**
 * dataframe-anatomy.js
 * Componente visual interactivo para la enseñanza de la Anatomía de DataFrames en Pandas.
 * Contexto Geotécnico: Matriz de canales del Datalogger Ancón Norte (piezómetros, extensómetros, inclinómetros).
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    selectedChannel: "piezometro_kpa",
    selectedMethod: "head", // 'head', 'shape', 'columns', 'describe'
    data: [
      { date: "2024-05-01 00:00", piezometro_kpa: 18.5, extensometro_mm: 4.2, inclinometro_mm: 1.1, lluvia_mm: 0.0 },
      { date: "2024-05-01 06:00", piezometro_kpa: 22.1, extensometro_mm: 5.8, inclinometro_mm: 1.3, lluvia_mm: 14.5 },
      { date: "2024-05-01 12:00", piezometro_kpa: 31.4, extensometro_mm: 9.4, inclinometro_mm: 2.5, lluvia_mm: 32.0 },
      { date: "2024-05-01 18:00", piezometro_kpa: 28.0, extensometro_mm: 11.2, inclinometro_mm: 3.1, lluvia_mm: 8.0 },
      { date: "2024-05-02 00:00", piezometro_kpa: 24.3, extensometro_mm: 12.0, inclinometro_mm: 3.4, lluvia_mm: 2.0 },
    ]
  };

  function renderWidget() {
    const container = document.getElementById("dataframe-anatomy-container");
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
            <span class="flow-badge">Módulo 1 &bull; Lección 1.6</span>
            <h4 class="flow-title">Anatomía de un DataFrame en Pandas: Estructura 2D vs 1D</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="df-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="df-mode-wb">
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
          <div class="wb-title-badge">ARQUITECTURA DE DATOS: <code>pandas.DataFrame</code></div>

          <div class="wb-df-diagram">
            <!-- Header Columnas -->
            <div class="df-columns-header">
              <span class="df-axis-tag">EJE 1: COLUMNAS (<code>df.columns</code>) ➔</span>
              <div class="df-col-badges">
                <span class="df-col-badge hl-col">piezometro_kpa</span>
                <span class="df-col-badge">extensometro_mm</span>
                <span class="df-col-badge">inclinometro_mm</span>
                <span class="df-col-badge">lluvia_mm</span>
              </div>
            </div>

            <!-- Cuerpo de la Tabla -->
            <div class="df-body-layout">
              <!-- Índice (Eje 0) -->
              <div class="df-index-col">
                <span class="df-axis-tag-vert">EJE 0: ÍNDICE TEMPORAL (<code>df.index</code>)</span>
                <div class="df-index-cells">
                  <span class="df-idx-cell">2024-05-01 00:00</span>
                  <span class="df-idx-cell">2024-05-01 06:00</span>
                  <span class="df-idx-cell">2024-05-01 12:00</span>
                  <span class="df-idx-cell">2024-05-01 18:00</span>
                  <span class="df-idx-cell">2024-05-02 00:00</span>
                </div>
              </div>

              <!-- Matriz de Valores -->
              <div class="df-values-matrix">
                <div class="df-matrix-tag">MATRIZ 2D DE VALORES (<code>df.values</code>, NumPy float64)</div>
                <div class="df-matrix-rows">
                  <div class="df-row-cells"><span class="hl-cell">18.5</span><span>4.2</span><span>1.1</span><span>0.0</span></div>
                  <div class="df-row-cells"><span class="hl-cell">22.1</span><span>5.8</span><span>1.3</span><span>14.5</span></div>
                  <div class="df-row-cells"><span class="hl-cell">31.4</span><span>9.4</span><span>2.5</span><span>32.0</span></div>
                  <div class="df-row-cells"><span class="hl-cell">28.0</span><span>11.2</span><span>3.1</span><span>8.0</span></div>
                  <div class="df-row-cells"><span class="hl-cell">24.3</span><span>12.0</span><span>3.4</span><span>2.0</span></div>
                </div>
              </div>
            </div>

            <!-- Desglose a Series 1D -->
            <div class="df-series-extract">
              <span class="extract-arrow">▼ Al extraer una sola columna: <code>serie = df['piezometro_kpa']</code> ▼</span>
              <div class="series-card-preview">
                <span class="series-tag">PANDAS SERIES (1D: Índice + Vector de Valores)</span>
                <div class="series-items">
                  <code>2024-05-01 00:00 ➔ 18.5</code> | 
                  <code>2024-05-01 06:00 ➔ 22.1</code> | 
                  <code>2024-05-01 12:00 ➔ 31.4 ...</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-emerald); margin-top:0;">📚 Las 3 Reglas de Oro de Pandas</h5>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:10px;">
              <li><strong>DataFrame (2D):</strong> Es una tabla rectangular completa con múltiples canales de sensores, filas temporales y columnas rotuladas.</li>
              <li><strong>Series (1D):</strong> Es una sola columna aislada. Tiene un único tipo de dato (<code>dtype</code>) y conserva intacto el índice temporal.</li>
              <li><strong>Índice Temporal (<code>DatetimeIndex</code>):</strong> En instrumentación, el índice no son números 0, 1, 2, sino estampas de tiempo reales. Esto permite resamplear días, horas o semanas con <code>.resample()</code>.</li>
            </ul>
          </div>

          <div class="wb-card-glass" style="margin-top:14px; border-left:3px solid var(--accent-blue);">
            <h5 style="color:var(--accent-blue); margin-top:0;">⚡ Atributos vs Métodos</h5>
            <p style="font-size:0.85em; color:var(--text-muted); margin:0;">
              • <strong>Atributos (sin paréntesis):</strong> Propiedades fijas en memoria: <code>df.shape</code>, <code>df.columns</code>, <code>df.dtypes</code>.<br>
              • <strong>Métodos (con paréntesis):</strong> Acciones de cálculo: <code>df.head()</code>, <code>df.describe()</code>, <code>df.mean()</code>.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const col = state.selectedChannel;
    const values = state.data.map(d => d[col]);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Barra de Exploración de Canales y Atributos -->
        <div class="df-sim-toolbar">
          <div class="df-channel-selector">
            <span class="selector-label">Canal Activo (Series):</span>
            <div class="channel-pills">
              <button class="df-chan-btn ${col === 'piezometro_kpa' ? 'active' : ''}" data-chan="piezometro_kpa">
                💧 Piezómetro (kPa)
              </button>
              <button class="df-chan-btn ${col === 'extensometro_mm' ? 'active' : ''}" data-chan="extensometro_mm">
                📏 Extensómetro (mm)
              </button>
              <button class="df-chan-btn ${col === 'inclinometro_mm' ? 'active' : ''}" data-chan="inclinometro_mm">
                📐 Inclinómetro (mm)
              </button>
              <button class="df-chan-btn ${col === 'lluvia_mm' ? 'active' : ''}" data-chan="lluvia_mm">
                🌧️ Pluviómetro (mm)
              </button>
            </div>
          </div>

          <div class="df-methods-selector">
            <span class="selector-label">Inspección de Atributo:</span>
            <div class="channel-pills">
              <button class="df-meth-btn ${state.selectedMethod === 'head' ? 'active' : ''}" data-meth="head">
                .head(3)
              </button>
              <button class="df-meth-btn ${state.selectedMethod === 'shape' ? 'active' : ''}" data-meth="shape">
                .shape
              </button>
              <button class="df-meth-btn ${state.selectedMethod === 'columns' ? 'active' : ''}" data-meth="columns">
                .columns
              </button>
              <button class="df-meth-btn ${state.selectedMethod === 'describe' ? 'active' : ''}" data-meth="describe">
                .describe()
              </button>
            </div>
          </div>
        </div>

        <!-- Matriz Interactiva de Datos -->
        <div class="df-interactive-table-wrapper">
          <div class="table-responsive">
            <table class="df-sensor-table">
              <thead>
                <tr>
                  <th class="idx-th">Fecha / Hora (Index)</th>
                  <th class="${col === 'piezometro_kpa' ? 'th-active-col' : ''}">piezometro_kpa</th>
                  <th class="${col === 'extensometro_mm' ? 'th-active-col' : ''}">extensometro_mm</th>
                  <th class="${col === 'inclinometro_mm' ? 'th-active-col' : ''}">inclinometro_mm</th>
                  <th class="${col === 'lluvia_mm' ? 'th-active-col' : ''}">lluvia_mm</th>
                </tr>
              </thead>
              <tbody>
                ${state.data.map(d => `
                  <tr>
                    <td class="idx-td"><code>${d.date}</code></td>
                    <td class="${col === 'piezometro_kpa' ? 'td-active-col' : ''}">${d.piezometro_kpa}</td>
                    <td class="${col === 'extensometro_mm' ? 'td-active-col' : ''}">${d.extensometro_mm}</td>
                    <td class="${col === 'inclinometro_mm' ? 'td-active-col' : ''}">${d.inclinometro_mm}</td>
                    <td class="${col === 'lluvia_mm' ? 'td-active-col' : ''}">${d.lluvia_mm}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Panel de Trazado de Código y Salida -->
        <div class="df-output-panel">
          ${renderMethodOutput(col, avg, minVal, maxVal)}
        </div>
      </div>
    `;
  }

  function renderMethodOutput(col, avg, minVal, maxVal) {
    if (state.selectedMethod === "head") {
      return `
        <div class="df-snippet-box">
          <div class="df-snippet-code">
            <code># Seleccionar canal como Serie 1D y ver primeros registros:<br>serie = df['${col}']<br>print(serie.head(3))</code>
          </div>
          <div class="df-snippet-res">
            ➔ <strong>Serie Unidimensional extraída:</strong><br>
            2024-05-01 00:00 &nbsp; ${state.data[0][col]}<br>
            2024-05-01 06:00 &nbsp; ${state.data[1][col]}<br>
            2024-05-01 12:00 &nbsp; ${state.data[2][col]}<br>
            <span style="color:var(--text-muted); font-size:0.75rem;">Name: ${col}, dtype: float64</span>
          </div>
        </div>
      `;
    }

    if (state.selectedMethod === "shape") {
      return `
        <div class="df-snippet-box">
          <div class="df-snippet-code">
            <code># Dimensión de la matriz (Filas, Columnas):<br>print(df.shape)</code>
          </div>
          <div class="df-snippet-res">
            ➔ <strong>(5, 4)</strong>: 5 estampas temporales (filas) y 4 canales de instrumentación (columnas).
          </div>
        </div>
      `;
    }

    if (state.selectedMethod === "columns") {
      return `
        <div class="df-snippet-box">
          <div class="df-snippet-code">
            <code># Lista de nombres de canales de sensores:<br>print(list(df.columns))</code>
          </div>
          <div class="df-snippet-res">
            ➔ <strong>['piezometro_kpa', 'extensometro_mm', 'inclinometro_mm', 'lluvia_mm']</strong>
          </div>
        </div>
      `;
    }

    if (state.selectedMethod === "describe") {
      return `
        <div class="df-snippet-box">
          <div class="df-snippet-code">
            <code># Estadísticas descriptivas del canal activo:<br>print(df['${col}'].describe())</code>
          </div>
          <div class="df-snippet-res">
            Promedio: <strong>${avg}</strong> | Mínimo: <strong>${minVal}</strong> | Máximo: <strong>${maxVal}</strong> | Total lecturas: <strong>5</strong>
          </div>
        </div>
      `;
    }
  }

  function attachEvents() {
    const btnSim = document.getElementById("df-mode-sim");
    const btnWb = document.getElementById("df-mode-wb");

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

    document.querySelectorAll(".df-chan-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.selectedChannel = btn.dataset.chan;
        renderWidget();
      });
    });

    document.querySelectorAll(".df-meth-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.selectedMethod = btn.dataset.meth;
        renderWidget();
      });
    });
  }

  window.initDataFrameAnatomyWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("dataframe-anatomy-container")) {
      window.initDataFrameAnatomyWidget();
    }
  });
})();
