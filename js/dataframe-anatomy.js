/**
 * dataframe-anatomy.js
 * Componente visual interactivo para la enseñanza de la Anatomía de DataFrames en Pandas.
 * Contexto Geotécnico: Estación Pluviométrica SIATA Ancón Norte (canales gemelos de balancín p1 y p2).
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    selectedChannel: "p1",
    selectedMethod: "head", // 'head', 'shape', 'columns', 'describe'
    data: [
      { date: "2019-05-03 16:00", p1: 0.0, p2: 0.0, p: 0.0, event: "Seco" },
      { date: "2019-05-03 16:05", p1: 0.2, p2: 0.2, p: 0.2, event: "Llovizna leve" },
      { date: "2019-05-03 16:10", p1: 1.4, p2: 1.4, p: 1.4, event: "Lluvia moderada" },
      { date: "2019-05-03 16:15", p1: 3.6, p2: 3.8, p: 3.8, event: "Aguacero fuerte" },
      { date: "2019-05-03 16:20", p1: 0.8, p2: 0.8, p: 0.8, event: "Remanente" },
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
            <h4 class="flow-title">Anatomía de un DataFrame: Registro del Pluviómetro SIATA</h4>
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
          <div class="wb-title-badge">ARQUITECTURA DE DATOS: <code>pandas.DataFrame</code> (Pluviómetro)</div>

          <div class="wb-df-diagram">
            <!-- Header Columnas -->
            <div class="df-columns-header">
              <span class="df-axis-tag">EJE 1: COLUMNAS (<code>df.columns</code>) ➔</span>
              <div class="df-col-badges">
                <span class="df-col-badge ${state.selectedChannel === 'p1' ? 'hl-col' : ''}">p1 (Balancín 1)</span>
                <span class="df-col-badge ${state.selectedChannel === 'p2' ? 'hl-col' : ''}">p2 (Balancín 2)</span>
                <span class="df-col-badge">p = max(p1, p2)</span>
              </div>
            </div>

            <!-- Cuerpo de la Tabla -->
            <div class="df-body-layout">
              <!-- Índice (Eje 0) -->
              <div class="df-index-col">
                <span class="df-axis-tag-vert">EJE 0: ÍNDICE TEMPORAL (<code>df.index</code>)</span>
                <div class="df-index-cells">
                  <span class="df-idx-cell">2019-05-03 16:00</span>
                  <span class="df-idx-cell">2019-05-03 16:05</span>
                  <span class="df-idx-cell">2019-05-03 16:10</span>
                  <span class="df-idx-cell">2019-05-03 16:15</span>
                  <span class="df-idx-cell">2019-05-03 16:20</span>
                </div>
              </div>

              <!-- Matriz de Valores -->
              <div class="df-values-matrix">
                <div class="df-matrix-tag">MATRIZ 2D DE VALORES (<code>df.values</code>, NumPy float64 en mm)</div>
                <div class="df-matrix-rows">
                  <div class="df-row-cells"><span class="hl-cell">0.0</span><span>0.0</span><span>0.0</span></div>
                  <div class="df-row-cells"><span class="hl-cell">0.2</span><span>0.2</span><span>0.2</span></div>
                  <div class="df-row-cells"><span class="hl-cell">1.4</span><span>1.4</span><span>1.4</span></div>
                  <div class="df-row-cells"><span class="hl-cell">3.6</span><span>3.8</span><span>3.8</span></div>
                  <div class="df-row-cells"><span class="hl-cell">0.8</span><span>0.8</span><span>0.8</span></div>
                </div>
              </div>
            </div>

            <!-- Desglose a Series 1D -->
            <div class="df-series-extract">
              <span class="extract-arrow">▼ Al extraer un solo balancín: <code>serie = df['p1']</code> ▼</span>
              <div class="series-card-preview">
                <span class="series-tag">PANDAS SERIES (1D: Índice Temporal + Vector Numérico de Lluvia)</span>
                <div class="series-items">
                  <code>2019-05-03 16:00 ➔ 0.0 mm</code> | 
                  <code>2019-05-03 16:05 ➔ 0.2 mm</code> | 
                  <code>2019-05-03 16:15 ➔ 3.6 mm ...</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="wb-explanation-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-teal); margin-top:0;">🌧️ ¿Por qué Pandas con el Pluviómetro?</h5>
            <p style="font-size:0.88em; color:var(--text-muted); line-height:1.5;">
              La estación SIATA de Ancón Norte registra precipitaciones cada <strong>5 minutos</strong> durante más de 2 años (más de <strong>229.000 filas</strong>).
            </p>
            <p style="font-size:0.88em; color:var(--text-muted); line-height:1.5;">
              Procesar esta serie con listas y bucles <code>for</code> manuales sería lento y susceptible a errores. <strong>Pandas</strong> optimiza estas operaciones vectorizadas en memoria con NumPy.
            </p>
          </div>

          <div class="wb-card-glass" style="margin-top:14px; border-left:3px solid var(--accent-orange);">
            <h5 style="color:var(--accent-orange); margin-top:0;">⚖️ Balancines Gemelos (p1 y p2)</h5>
            <p style="font-size:0.85em; color:var(--text-muted); margin:0;">
              Los pluviómetros profesionales cuentan con dos cubetas gemelas para <strong>redundancia física</strong>. Si hojas o ramas atascan una cubeta (ej. 3.6 vs 3.8 mm a las 16:15), el segundo canal garantiza la captura del evento. Se consolida con <code>max(p1, p2)</code>.
            </p>
          </div>

          <div class="wb-card-glass" style="margin-top:14px; border-left:3px solid var(--accent-blue);">
            <h5 style="color:var(--accent-blue); margin-top:0;">⚡ Atributos vs Métodos en Pandas</h5>
            <p style="font-size:0.85em; color:var(--text-muted); margin:0;">
              • <strong>Atributos (sin paréntesis):</strong> Propiedades estructurales: <code>df.shape</code>, <code>df.columns</code>, <code>df.index</code>.<br>
              • <strong>Métodos (con paréntesis):</strong> Cálculos o acciones: <code>df.head(3)</code>, <code>df.describe()</code>, <code>df.mean()</code>.
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
            <span class="selector-label">Canal del Pluviómetro:</span>
            <div class="channel-pills">
              <button class="df-chan-btn ${col === 'p1' ? 'active' : ''}" data-chan="p1">
                🌧️ Balancín 1 (p1)
              </button>
              <button class="df-chan-btn ${col === 'p2' ? 'active' : ''}" data-chan="p2">
                🌧️ Balancín 2 (p2)
              </button>
              <button class="df-chan-btn ${col === 'p' ? 'active' : ''}" data-chan="p">
                ⚖️ Consolidado (p)
              </button>
            </div>
          </div>

          <div class="df-methods-selector">
            <span class="selector-label">Inspección de Atributo/Método:</span>
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
                  <th class="idx-th">Fecha y Hora (DatetimeIndex)</th>
                  <th class="${col === 'p1' ? 'th-active-col' : ''}">p1 (mm)</th>
                  <th class="${col === 'p2' ? 'th-active-col' : ''}">p2 (mm)</th>
                  <th class="${col === 'p' ? 'th-active-col' : ''}">p = max(p1, p2)</th>
                  <th>Evento Observado</th>
                </tr>
              </thead>
              <tbody>
                ${state.data.map(d => `
                  <tr>
                    <td class="idx-td"><code>${d.date}</code></td>
                    <td class="${col === 'p1' ? 'td-active-col' : ''}">${d.p1.toFixed(1)}</td>
                    <td class="${col === 'p2' ? 'td-active-col' : ''}">${d.p2.toFixed(1)}</td>
                    <td class="${col === 'p' ? 'td-active-col' : ''}"><strong>${d.p.toFixed(1)}</strong></td>
                    <td style="color:var(--text-muted); font-size:0.85rem;">${d.event}</td>
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
            <code># Seleccionar canal y visualizar las primeras 3 lecturas:<br>serie = df['${col}']<br>print(serie.head(3))</code>
          </div>
          <div class="df-snippet-res">
            ➔ <strong>Serie de precipitación extraída (mm / 5 min):</strong><br>
            2019-05-03 16:00:00 &nbsp; ${state.data[0][col].toFixed(1)}<br>
            2019-05-03 16:05:00 &nbsp; ${state.data[1][col].toFixed(1)}<br>
            2019-05-03 16:10:00 &nbsp; ${state.data[2][col].toFixed(1)}<br>
            <span style="color:var(--text-muted); font-size:0.75rem;">Name: ${col}, dtype: float64</span>
          </div>
        </div>
      `;
    }

    if (state.selectedMethod === "shape") {
      return `
        <div class="df-snippet-box">
          <div class="df-snippet-code">
            <code># Dimensiones del DataFrame del pluviómetro:<br>print(df.shape)</code>
          </div>
          <div class="df-snippet-res">
            ➔ <strong>(229345, 2)</strong> en el archivo completo (229.345 estampas de tiempo cada 5 min y 2 canales balancín: <code>p1</code>, <code>p2</code>).
          </div>
        </div>
      `;
    }

    if (state.selectedMethod === "columns") {
      return `
        <div class="df-snippet-box">
          <div class="df-snippet-code">
            <code># Lista de canales de instrumentación:<br>print(list(df.columns))</code>
          </div>
          <div class="df-snippet-res">
            ➔ <strong>['p1', 'p2']</strong> (Canales gemelos de balancín en la estación SIATA)
          </div>
        </div>
      `;
    }

    if (state.selectedMethod === "describe") {
      return `
        <div class="df-snippet-box">
          <div class="df-snippet-code">
            <code># Estadísticas de precipitación del canal activo:<br>print(df['${col}'].describe())</code>
          </div>
          <div class="df-snippet-res">
            Media: <strong>${avg} mm/5min</strong> | Mín: <strong>${minVal} mm</strong> | Máx: <strong>${maxVal} mm</strong> (Aguacero pico).
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
