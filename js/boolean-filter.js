/**
 * boolean-filter.js
 * Componente visual interactivo para la enseñanza de Filtrado Booleano y Máscaras en Pandas.
 * Contexto Geotécnico: Tamiz de eventos pluviométricos y discriminación de lluvias detonantes en ladera.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    threshold: 0.0, // umbral de lluvia en mm
    records: [
      { id: "REG-01", date: "2019-05-03 16:00", p1: 0.0, p2: 0.0, rain: 0.0, event: "Seco" },
      { id: "REG-02", date: "2019-05-03 16:05", p1: 0.4, p2: 0.4, rain: 0.4, event: "Llovizna leve" },
      { id: "REG-03", date: "2019-05-03 16:10", p1: 1.8, p2: 1.8, rain: 1.8, event: "Lluvia moderada" },
      { id: "REG-04", date: "2019-05-03 16:15", p1: 4.2, p2: 4.4, rain: 4.4, event: "Aguacero intenso" },
      { id: "REG-05", date: "2019-05-03 16:20", p1: 0.8, p2: 0.8, rain: 0.8, event: "Remanente" },
      { id: "REG-06", date: "2019-05-03 16:25", p1: 0.0, p2: 0.0, rain: 0.0, event: "Seco" },
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
            <h4 class="flow-title">Filtrado Booleano en Pandas: El Tamiz Pluviométrico</h4>
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
                <strong>Registro Pluviométrico Completo (<code>df_lluvia</code>):</strong>
              </div>
              <div class="sieve-table-preview">
                <table class="wb-mini-table">
                  <thead>
                    <tr><th>Hora (5 min)</th><th>p1</th><th>p2</th><th>p = max(p1,p2)</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>16:00</td><td>0.0</td><td>0.0</td><td>0.0 mm</td></tr>
                    <tr class="hl-row"><td>16:05</td><td>0.4</td><td>0.4</td><td>0.4 mm</td></tr>
                    <tr class="hl-row"><td>16:10</td><td>1.8</td><td>1.8</td><td>1.8 mm</td></tr>
                    <tr class="hl-row"><td>16:15</td><td>4.2</td><td>4.4</td><td>4.4 mm</td></tr>
                    <tr class="hl-row"><td>16:20</td><td>0.8</td><td>0.8</td><td>0.8 mm</td></tr>
                    <tr><td>16:25</td><td>0.0</td><td>0.0</td><td>0.0 mm</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="sieve-arrow">▼ Se aplica condición booleana: <code>df['p'] &gt; 0.0</code> ▼</div>

            <!-- 2. Máscara Booleana -->
            <div class="sieve-step-card highlight-mask">
              <div class="sieve-step-header">
                <span class="step-badge mask-badge">Paso 2</span>
                <strong>Máscara Booleana Vectorizada (Serie de <code>True / False</code>):</strong>
              </div>
              <div class="mask-series-preview">
                <span class="mask-item false-item">16:00: False</span>
                <span class="mask-item true-item">16:05: True</span>
                <span class="mask-item true-item">16:10: True</span>
                <span class="mask-item true-item">16:15: True</span>
                <span class="mask-item true-item">16:20: True</span>
                <span class="mask-item false-item">16:25: False</span>
              </div>
            </div>

            <div class="sieve-arrow">▼ Indexación en corchetes: <code>df_lluvia[mascara]</code> ▼</div>

            <!-- 3. DataFrame Filtrado -->
            <div class="sieve-step-card highlight-filtered">
              <div class="sieve-step-header">
                <span class="step-badge filtered-badge">Paso 3</span>
                <strong>El Tamiz deja caer únicamente los registros con lluvia activa (<code>True</code>):</strong>
              </div>
              <div class="sieve-table-preview">
                <table class="wb-mini-table">
                  <thead>
                    <tr><th>Hora</th><th>Lluvia (p)</th><th>Clasificación del Evento</th></tr>
                  </thead>
                  <tbody>
                    <tr class="hl-row"><td>16:05</td><td>0.4 mm</td><td>🌦️ Llovizna</td></tr>
                    <tr class="hl-row"><td>16:10</td><td>1.8 mm</td><td>🌧️ Lluvia moderada</td></tr>
                    <tr class="hl-row"><td>16:15</td><td>4.4 mm</td><td>⛈️ Aguacero intenso</td></tr>
                    <tr class="hl-row"><td>16:20</td><td>0.8 mm</td><td>🌧️ Remanente</td></tr>
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
              <li><strong>Sin bucles for:</strong> Pandas evalúa 229.000 lecturas en milisegundos mediante código compilado en C (NumPy vectorizado).</li>
              <li><strong>Estructura <code>df[condicion]</code>:</strong> Al pasar una Serie de booleanos entre los corchetes de indexación, Pandas preserva solo las filas con valor <code>True</code>.</li>
              <li><strong>Múltiples condiciones:</strong> Para combinar criterios (ej. balancín 1 mayor a 0 Y balancín 2 mayor a 0) se usan operadores bit a bit con paréntesis obligatorios:
                <br><code>df[(df['p1'] &gt; 0) & (df['p2'] &gt; 0)]</code>
                <br><small style="color:var(--accent-amber); font-weight:600;">(No usar 'and' / 'or' de Python estándar)</small>
              </li>
            </ul>
          </div>

          <div class="wb-card-glass" style="margin-top:14px; border-left:3px solid var(--accent-emerald);">
            <h5 style="color:var(--accent-emerald); margin-top:0;">📡 Relevancia en Instrumentación</h5>
            <p style="font-size:0.85em; color:var(--text-muted); margin:0;">
              En el Valle de Aburrá, el 85% de las horas no llueve. El filtrado booleano permite descartar millones de ceros y aislar instantáneamente las tormentas detonantes que aumentan la presión de poros en la ladera.
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
      isTrue: state.threshold === 0.0 ? r.rain > 0.0 : r.rain >= th
    }));

    const passedRows = evaluated.filter(r => r.isTrue);

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Control de Umbral -->
        <div class="filter-controls-bar">
          <div class="filter-slider-box">
            <div class="slider-header-row">
              <label>Umbral de Precipitación (<code>umbral_lluvia</code>):</label>
              <strong class="slider-val-badge">${th === 0.0 ? '> 0.0 mm (Lluvia Activa)' : '>= ' + th.toFixed(1) + ' mm'}</strong>
            </div>
            <input type="range" min="0.0" max="4.5" step="0.5" value="${th}" id="slider-filter-th" class="flow-slider">
          </div>

          <div class="filter-presets">
            <button class="filter-preset-btn ${th === 0.0 ? 'active' : ''}" data-val="0.0">
              🌧️ Lluvia Activa (&gt; 0 mm)
            </button>
            <button class="filter-preset-btn ${th === 1.5 ? 'active' : ''}" data-val="1.5">
              🌦️ Moderada (&gt;= 1.5 mm)
            </button>
            <button class="filter-preset-btn ${th === 3.5 ? 'active' : ''}" data-val="3.5">
              ⛈️ Intensa / Detonante (&gt;= 3.5 mm)
            </button>
          </div>
        </div>

        <!-- Tablas: Original con Máscara + Resultado Filtrado -->
        <div class="filter-tables-grid">
          <!-- Tabla 1: Generación de Máscara -->
          <div class="filter-table-card">
            <div class="ft-header">
              <span class="ft-title">1. Pluviómetro y Máscara Booleana</span>
              <span class="ft-badge"><code>df['p'] ${th === 0.0 ? '&gt; 0.0' : '&gt;= ' + th.toFixed(1)}</code></span>
            </div>
            <div class="table-responsive">
              <table class="geotech-sim-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Hora</th>
                    <th>p1</th>
                    <th>p2</th>
                    <th>p = max</th>
                    <th>Máscara Booleana</th>
                  </tr>
                </thead>
                <tbody>
                  ${evaluated.map(r => `
                    <tr class="${r.isTrue ? 'row-matches-filter' : 'row-dimmed'}">
                      <td><strong>${r.id}</strong></td>
                      <td>${r.date.split(" ")[1]}</td>
                      <td>${r.p1.toFixed(1)}</td>
                      <td>${r.p2.toFixed(1)}</td>
                      <td><strong>${r.rain.toFixed(1)} mm</strong></td>
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
              <span class="ft-badge success">${passedRows.length} intervalo(s) seleccionado(s)</span>
            </div>
            <div class="table-responsive">
              <table class="geotech-sim-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Precipitación (p)</th>
                    <th>Tipo de Evento</th>
                    <th>Efecto en Talud</th>
                  </tr>
                </thead>
                <tbody>
                  ${passedRows.length > 0 ? passedRows.map(r => `
                    <tr class="row-critical-highlight">
                      <td><code>${r.date}</code></td>
                      <td style="color:var(--accent-blue); font-weight:700;">${r.rain.toFixed(1)} mm</td>
                      <td>${r.event}</td>
                      <td>${r.rain >= 3.5 ? '🚨 Infiltración acelerada' : '💧 Humedecimiento superficial'}</td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td colspan="4" style="text-align:center; padding:1.5rem; color:var(--text-muted);">
                        Ningún intervalo superó el umbral de ${th.toFixed(1)} mm. El tamiz descartó todas las filas.
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Panel de Trazado de Código en Vivo -->
        <div class="filter-code-preview">
          <div class="fcp-label">Código Python equivalente ejecutado:</div>
          <pre class="fcp-code"><code># 1. Definir máscara booleana:
mascara = df['p'] ${th === 0.0 ? '> 0.0' : '>= ' + th.toFixed(1)}

# 2. Indexar DataFrame:
df_filtrado = df[mascara]
print(f"Intervalos filtrados: {len(df_filtrado)} de {state.records.length} registros")</code></pre>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("filter-mode-sim");
    const btnWb = document.getElementById("filter-mode-wb");
    const slider = document.getElementById("slider-filter-th");

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
