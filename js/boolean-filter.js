/**
 * boolean-filter.js
 * Componente visual interactivo para la enseñanza de Filtrado Booleano y Máscaras en Pandas.
 * Contexto Geotécnico: Tamiz de registros de deformación y discriminación de umbrales críticos de ladera.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    threshold: 10.0,
    records: [
      { id: "EXT-01", date: "2024-05-01 08:00", displacement: 4.5, depth: "Superficial" },
      { id: "EXT-02", date: "2024-05-01 09:00", displacement: 8.2, depth: "3.5 m" },
      { id: "EXT-03", date: "2024-05-01 10:00", displacement: 12.8, depth: "6.0 m" },
      { id: "EXT-04", date: "2024-05-01 11:00", displacement: 6.9, depth: "8.5 m" },
      { id: "EXT-05", date: "2024-05-01 12:00", displacement: 15.4, depth: "12.0 m" },
    ]
  };

  function renderWidget() {
    const container = document.getElementById("boolean-filter-container");
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
            <span class="flow-badge">Módulo 1 &bull; Lección 1.7</span>
            <h4 class="flow-title">Filtrado Booleano en Pandas: El Tamiz Geotécnico</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="filter-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="filter-mode-wb">
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
          <div class="wb-title-badge">CÓMO FUNCIONA EL FILTRADO VECTORIZADO EN PANDAS</div>

          <div class="wb-sieve-diagram">
            <!-- 1. DataFrame Original -->
            <div class="sieve-step-card">
              <div class="sieve-step-header">
                <span class="step-badge">Paso 1</span>
                <strong>DataFrame Original Completo (<code>df</code>):</strong>
              </div>
              <div class="sieve-table-preview">
                <table class="wb-mini-table">
                  <thead>
                    <tr><th>Sensor</th><th>Desplazamiento</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>EXT-01</td><td>4.5 mm</td></tr>
                    <tr><td>EXT-02</td><td>8.2 mm</td></tr>
                    <tr class="hl-row"><td>EXT-03</td><td>12.8 mm</td></tr>
                    <tr><td>EXT-04</td><td>6.9 mm</td></tr>
                    <tr class="hl-row"><td>EXT-05</td><td>15.4 mm</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="sieve-arrow">▼ Se aplica condición: <code>df['desp'] &gt;= 10.0</code> ▼</div>

            <!-- 2. Máscara Booleana -->
            <div class="sieve-step-card highlight-mask">
              <div class="sieve-step-header">
                <span class="step-badge mask-badge">Paso 2</span>
                <strong>Máscara Booleana (Serie de <code>True / False</code>):</strong>
              </div>
              <div class="mask-series-preview">
                <span class="mask-item false-item">False</span>
                <span class="mask-item false-item">False</span>
                <span class="mask-item true-item">True (Cumple)</span>
                <span class="mask-item false-item">False</span>
                <span class="mask-item true-item">True (Cumple)</span>
              </div>
            </div>

            <div class="sieve-arrow">▼ Indexación: <code>df_filtrado = df[mascara]</code> ▼</div>

            <!-- 3. DataFrame Filtrado -->
            <div class="sieve-step-card highlight-filtered">
              <div class="sieve-step-header">
                <span class="step-badge filtered-badge">Paso 3</span>
                <strong>El Tamiz deja caer solo las filas <code>True</code>:</strong>
              </div>
              <div class="sieve-table-preview">
                <table class="wb-mini-table">
                  <thead>
                    <tr><th>Sensor</th><th>Desplazamiento</th><th>Estado</th></tr>
                  </thead>
                  <tbody>
                    <tr class="hl-row"><td>EXT-03</td><td>12.8 mm</td><td>🚨 Alerta</td></tr>
                    <tr class="hl-row"><td>EXT-05</td><td>15.4 mm</td><td>🚨 Alerta</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-blue); margin-top:0;">⚡ Reglas Clave de Filtrado en Pandas</h5>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:10px;">
              <li><strong>Sin bucles for lentos:</strong> Pandas evalúa millones de registros en nanosegundos usando código C vectorizado de NumPy.</li>
              <li><strong>Uso de corchetes dobles conceptuales:</strong> La sintaxis <code>df[df['col'] &gt; umbral]</code> es simplemente pasar la máscara booleana entre los corchetes de indexación de <code>df</code>.</li>
              <li><strong>Múltiples condiciones:</strong> En Pandas se usan operadores bit a bit con paréntesis obligatorios:
                <br><code>df[(df['col1'] &gt; 10) & (df['col2'] &lt; 5)]</code>
                <br><small style="color:var(--accent-amber); font-weight:600;">(No usar 'and' / 'or' de Python estándar)</small>
              </li>
            </ul>
          </div>

          <div class="wb-card-glass" style="margin-top:14px; border-left:3px solid var(--accent-emerald);">
            <h5 style="color:var(--accent-emerald); margin-top:0;">📡 Relevancia en Instrumentación</h5>
            <p style="font-size:0.85em; color:var(--text-muted); margin:0;">
              Permite aislar en una sola línea de código todas las lecturas anómalas de una red de 50 sensores durante una tormenta tropical.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const th = state.threshold;
    const evaluated = state.records.map(r => ({
      ...r,
      isTrue: r.displacement >= th
    }));

    const passedRows = evaluated.filter(r => r.isTrue);

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Control de Umbral -->
        <div class="filter-controls-bar">
          <div class="filter-slider-box">
            <div class="slider-header-row">
              <label>Umbral Crítico de Deformación (<code>umbral_mm</code>):</label>
              <strong class="slider-val-badge">${th.toFixed(1)} mm</strong>
            </div>
            <input type="range" min="4.0" max="18.0" step="0.5" value="${th}" id="slider-filter-th" class="flow-slider">
          </div>

          <div class="filter-presets">
            <button class="filter-preset-btn ${th === 8.0 ? 'active' : ''}" data-val="8.0">
              🟡 Preventivo (8.0 mm)
            </button>
            <button class="filter-preset-btn ${th === 10.0 ? 'active' : ''}" data-val="10.0">
              🟠 Alerta (10.0 mm)
            </button>
            <button class="filter-preset-btn ${th === 14.0 ? 'active' : ''}" data-val="14.0">
              🔴 Emergencia (14.0 mm)
            </button>
          </div>
        </div>

        <!-- Tablas: Original con Máscara + Resultado Filtrado -->
        <div class="filter-tables-grid">
          <!-- Tabla 1: Generación de Máscara -->
          <div class="filter-table-card">
            <div class="ft-header">
              <span class="ft-title">1. DataFrame Completo y Máscara Booleana</span>
              <span class="ft-badge"><code>df['desplazamiento_mm'] &gt;= ${th.toFixed(1)}</code></span>
            </div>
            <div class="table-responsive">
              <table class="geotech-sim-table">
                <thead>
                  <tr>
                    <th>Sensor</th>
                    <th>Fecha / Hora</th>
                    <th>Desplazamiento</th>
                    <th>Máscara (True/False)</th>
                  </tr>
                </thead>
                <tbody>
                  ${evaluated.map(r => `
                    <tr class="${r.isTrue ? 'row-matches-filter' : 'row-dimmed'}">
                      <td><strong>${r.id}</strong></td>
                      <td>${r.date}</td>
                      <td><strong>${r.displacement} mm</strong></td>
                      <td>
                        <span class="bool-pill ${r.isTrue ? 'pill-true' : 'pill-false'}">
                          ${r.isTrue ? '✓ True' : '✗ False'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tabla 2: DataFrame Resultante df[mascara] -->
          <div class="filter-table-card result-table-card">
            <div class="ft-header">
              <span class="ft-title">2. Resultado Filtrado: <code>df[mascara]</code></span>
              <span class="ft-badge success">${passedRows.length} fila(s) seleccionadas</span>
            </div>
            <div class="table-responsive">
              <table class="geotech-sim-table">
                <thead>
                  <tr>
                    <th>Sensor</th>
                    <th>Profundidad</th>
                    <th>Desplazamiento</th>
                    <th>Acción Geotécnica</th>
                  </tr>
                </thead>
                <tbody>
                  ${passedRows.map(r => `
                    <tr class="row-critical-highlight">
                      <td><strong>${r.id}</strong></td>
                      <td>${r.depth}</td>
                      <td style="color:var(--accent-red); font-weight:700;">${r.displacement} mm</td>
                      <td>🚨 Inspección / Alerta</td>
                    </tr>
                  `).join('')}
                  ${passedRows.length === 0 ? `
                    <tr>
                      <td colspan="4" style="text-align:center; color:var(--text-muted); padding:20px;">
                        Ningún sensor supera actualmente el umbral de ${th.toFixed(1)} mm (Condición Segura).
                      </td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Código Python en Vivo -->
        <div class="filter-code-footer">
          <pre class="trace-pre"><code><span class="tok-comment"># 1. Definir el umbral y crear la máscara booleana vectorizada</span>
umbral = ${th.toFixed(1)}
mascara = df[<span class="tok-str">'desplazamiento_mm'</span>] >= umbral  <span class="tok-live-comment"># Serie con [${evaluated.map(r => r.isTrue ? 'True' : 'False').join(', ')}]</span>

<span class="tok-comment"># 2. Filtrar el DataFrame pasando la máscara entre corchetes</span>
df_alertas = df[mascara]
print(f<span class="tok-str">"Sensores en condición crítica: {len(df_alertas)}"</span>)  <span class="tok-live-comment"># ➔ ${passedRows.length} sensores encontrados</span></code></pre>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("filter-mode-sim");
    const btnWb = document.getElementById("filter-mode-wb");

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

    const slider = document.getElementById("slider-filter-th");
    if (slider) {
      slider.addEventListener("input", (e) => {
        state.threshold = parseFloat(e.target.value);
        renderWidget();
      });
    }

    document.querySelectorAll(".filter-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.threshold = parseFloat(btn.dataset.val);
        renderWidget();
      });
    });
  }

  window.initBooleanFilterWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("boolean-filter-container")) {
      window.initBooleanFilterWidget();
    }
  });
})();
