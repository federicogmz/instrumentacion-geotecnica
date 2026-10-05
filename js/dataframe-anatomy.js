/**
 * dataframe-anatomy.js
 * Componente visual interactivo y conceptual integrado para la enseñanza de la Anatomía de DataFrames en Pandas.
 * Contexto Geotécnico: Estación Pluviométrica SIATA Ancón Norte (canales gemelos de balancín p1 y p2).
 * 
 * Integra el esquema conceptual de la matriz 2D de pizarra con el explorador interactivo de métodos y canales en tiempo real.
 */

(function () {
  let state = {
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

    const col = state.selectedChannel;
    const values = state.data.map(d => d[col]);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.6 &bull; Esquema de Pizarra &amp; Simulador en Tiempo Real</span>
            <h4 class="flow-title">📊 Anatomía de un DataFrame: Registro del Pluviómetro SIATA</h4>
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          Un <strong>DataFrame de Pandas</strong> organiza el monitoreo en dos dimensiones: el <strong>Eje 0 (filas)</strong> indexado por fecha y hora (<code>DatetimeIndex</code>) y el <strong>Eje 1 (columnas)</strong> que identifica los canales de instrumentación. Haz clic en los canales y métodos para interactuar:
        </p>

        <!-- Barra de Exploración de Canales y Métodos -->
        <div class="df-sim-toolbar" style="margin-top: 0.35rem;">
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
            <span class="selector-label">Inspección de Atributo / Método:</span>
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

        <!-- Matriz Interactiva de Datos con Indicadores de Ejes -->
        <div class="df-interactive-table-wrapper">
          <div class="table-responsive">
            <table class="df-sensor-table">
              <thead>
                <tr>
                  <th class="idx-th">Eje 0: DatetimeIndex (Fecha y Hora)</th>
                  <th class="${col === 'p1' ? 'th-active-col' : ''}">p1 (mm)</th>
                  <th class="${col === 'p2' ? 'th-active-col' : ''}">p2 (mm)</th>
                  <th class="${col === 'p' ? 'th-active-col' : ''}">p = max(p1, p2)</th>
                  <th>Evento Físico Observado</th>
                </tr>
              </thead>
              <tbody>
                ${state.data.map(d => `
                  <tr>
                    <td class="idx-td"><code>${d.date}</code></td>
                    <td class="${col === 'p1' ? 'td-active-col' : ''}">${d.p1.toFixed(1)}</td>
                    <td class="${col === 'p2' ? 'td-active-col' : ''}">${d.p2.toFixed(1)}</td>
                    <td class="${col === 'p' ? 'td-active-col' : ''}"><strong>${d.p.toFixed(1)}</strong></td>
                    <td style="color:var(--text-muted); font-size:0.82rem;">${d.event}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Panel de Trazado de Código y Salida en Vivo -->
        <div class="df-output-panel">
          ${renderMethodOutput(col, avg, minVal, maxVal)}
        </div>

        <!-- Pizarra Conceptual y Buenas Prácticas Geotécnicas -->
        <div class="idx-conceptual-footer">
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">🌧️</span>
            <div class="idx-concept-text">
              <strong>¿Por qué usar Pandas con el Pluviómetro?</strong><br>
              La estación SIATA de Ancón Norte registra precipitaciones cada <strong>5 minutos</strong> durante más de 2 años (más de <strong>229.000 filas</strong>). Pandas optimiza estas operaciones vectorizadas en memoria con NumPy en microsegundos, reemplazando bucles lentos.
            </div>
          </div>
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">⚖️</span>
            <div class="idx-concept-text">
              <strong>Redundancia Física de Balancines (p1 y p2):</strong><br>
              Los pluviómetros profesionales cuentan con dos cubetas para evitar pérdida de datos si una se atasca con sedimentos. Consolidamos con <code>df[['p1', 'p2']].max(axis=1)</code>.
            </div>
          </div>
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">⚡</span>
            <div class="idx-concept-text">
              <strong>Atributos vs Métodos:</strong><br>
              • <strong>Atributos (sin paréntesis):</strong> Propiedades estructurales: <code>df.shape</code>, <code>df.columns</code>.<br>
              • <strong>Métodos (con paréntesis):</strong> Acciones o cálculos: <code>df.head(3)</code>, <code>df.describe()</code>.
            </div>
          </div>
        </div>

      </div>
    `;

    attachEvents();
  }

  function renderMethodOutput(col, avg, minVal, maxVal) {
    if (state.selectedMethod === 'head') {
      return `
        <div class="df-method-result">
          <div class="df-snippet-code">
            <span class="tok-comment"># Método .head(3): inspeccionar las primeras 3 lecturas temporales</span>
            <code>print(df_lluvia.head(3))</code>
          </div>
          <div class="df-snippet-out">
            <pre><code>                     p1   p2
Fecha y Hora                
2019-05-03 16:00:00  0.0  0.0
2019-05-03 16:05:00  0.2  0.2
2019-05-03 16:10:00  1.4  1.4</code></pre>
          </div>
        </div>
      `;
    }
    if (state.selectedMethod === 'shape') {
      return `
        <div class="df-method-result">
          <div class="df-snippet-code">
            <span class="tok-comment"># Atributo .shape: (filas_temporales, canales_sensores)</span>
            <code>print(df_lluvia.shape)</code>
          </div>
          <div class="df-snippet-out">
            <div class="shape-badge-row">
              <span class="shape-pill">➔ (229345, 2)</span>
              <span class="shape-desc">229.345 estampas de tiempo (muestreo c/5 min) &times; 2 canales de balancín</span>
            </div>
          </div>
        </div>
      `;
    }
    if (state.selectedMethod === 'columns') {
      return `
        <div class="df-method-result">
          <div class="df-snippet-code">
            <span class="tok-comment"># Atributo .columns: lista de variables de instrumentación</span>
            <code>print(list(df_lluvia.columns))</code>
          </div>
          <div class="df-snippet-out">
            <pre><code>['p1', 'p2']  # Balancín 1 y Balancín 2 (mm)</code></pre>
          </div>
        </div>
      `;
    }
    if (state.selectedMethod === 'describe') {
      return `
        <div class="df-method-result">
          <div class="df-snippet-code">
            <span class="tok-comment"># Método .describe(): resumen estadístico de la estación pluviométrica</span>
            <code>print(df_lluvia.describe())</code>
          </div>
          <div class="df-snippet-out">
            <pre><code>                  p1            p2
count  229345.000000 229345.000000
mean        0.013085      0.012171
std         0.112724      0.106910
min         0.000000      0.000000
25%         0.000000      0.000000
50%         0.000000      0.000000
75%         0.000000      0.000000
max         6.942667      6.942667</code></pre>
          </div>
          <div class="df-describe-alert">
            <strong style="color: #f59e0b;">⚠️ El Hallazgo Geotécnico (El Sesgo de los Ceros):</strong><br>
            Observa que la media de lluvia es de apenas <strong>~0.013 mm</strong> y hasta el percentil 75% el registro es <strong>0.00 mm</strong>. Como la mayor parte del tiempo no llueve en la ladera, la abundancia de ceros secos sesga y aplana el promedio hacia abajo. En la <strong>Lección 1.7</strong> aprenderemos a aplicar filtros booleanos (<code>condicion = df > 0</code>) para calcular la estadística no sesgada de los aguaceros activos.
          </div>
        </div>
      `;
    }
  }

  function attachEvents() {
    // Selectores de canal
    document.querySelectorAll(".df-chan-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.selectedChannel = btn.dataset.chan;
        renderWidget();
      });
    });

    // Selectores de método
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
