/**
 * missing-data.js
 * Componente visual interactivo para la enseñanza de Tratamiento de Datos Faltantes (NaN) e Interpolación.
 * Contexto Geotécnico: Pérdida de telemetría por corte de energía en caseta piezométrica Ancón Norte.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    method: "interpolate", // 'raw', 'dropna', 'ffill', 'interpolate'
  };

  const rawSeries = [
    { t: "08:00", val: 18.2, isMissing: false },
    { t: "09:00", val: 19.0, isMissing: false },
    { t: "10:00", val: null, isMissing: true },  // NaN
    { t: "11:00", val: null, isMissing: true },  // NaN
    { t: "12:00", val: null, isMissing: true },  // NaN
    { t: "13:00", val: 24.6, isMissing: false },
    { t: "14:00", val: 25.1, isMissing: false },
  ];

  function getProcessedSeries() {
    if (state.method === "raw") {
      return rawSeries.map(p => ({ ...p, displayVal: p.val }));
    }
    if (state.method === "dropna") {
      return rawSeries.filter(p => !p.isMissing).map(p => ({ ...p, displayVal: p.val }));
    }
    if (state.method === "ffill") {
      let last = 18.2;
      return rawSeries.map(p => {
        if (!p.isMissing) last = p.val;
        return { ...p, displayVal: last, wasImputed: p.isMissing };
      });
    }
    if (state.method === "interpolate") {
      // Interpolación lineal entre 19.0 a 09:00 y 24.6 a 13:00 (paso = 5.6 / 4 = 1.4 por hora)
      return rawSeries.map(p => {
        if (p.t === "10:00") return { ...p, displayVal: 20.4, wasImputed: true };
        if (p.t === "11:00") return { ...p, displayVal: 21.8, wasImputed: true };
        if (p.t === "12:00") return { ...p, displayVal: 23.2, wasImputed: true };
        return { ...p, displayVal: p.val, wasImputed: false };
      });
    }
  }

  function renderWidget() {
    const container = document.getElementById("missing-data-container");
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
            <span class="flow-badge">Módulo 3 &bull; Lección 3.1</span>
            <h4 class="flow-title">Tratamiento de Datos Faltantes (<code>NaN</code>): El Dilema de la Telemetría</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="md-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="md-mode-wb">
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
          <div class="wb-title-badge">COMPARATIVA METODOLÓGICA ANTE HUECOS (NaN)</div>

          <div class="wb-missing-schematic">
            <!-- Método 1: dropna -->
            <div class="md-method-card border-danger">
              <div class="md-method-tag">1. <code>df.dropna()</code> &bull; Eliminación Directa</div>
              <div class="md-desc">
                Corta y borra las filas con <code>NaN</code>. <strong style="color:#ef4444;">¡Peligro en series temporales!</strong>
                Destruye el paso de tiempo regular ($\Delta t = 1\text{ h}$), impidiendo calcular derivadas y ventanas móviles con precisión.
              </div>
            </div>

            <!-- Método 2: ffill -->
            <div class="md-method-card border-warning">
              <div class="md-method-tag">2. <code>df.ffill()</code> &bull; Relleno Hacia Adelante (Forward Fill)</div>
              <div class="md-desc">
                Copia el último valor conocido como un escalón constante plano. Útil en estados geológicos estacionarios, pero asume falsamente que el agua no se movió durante la tormenta.
              </div>
            </div>

            <!-- Método 3: interpolate -->
            <div class="md-method-card border-success">
              <div class="md-method-tag">3. <code>df.interpolate(method='linear')</code> &bull; Recomendado</div>
              <div class="md-desc">
                Une con una recta continua el punto antes del corte (19.0 kPa) con el punto de reanudación (24.6 kPa).
                Preserva la física del fenómeno de infiltración continua y conserva intacto el índice temporal.
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-emerald); margin-top:0;">🛡️ Protocolo en Geotecnia</h5>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:10px;">
              <li><strong>Huecos breves (&lt; 6 horas):</strong> La interpolación lineal es excelente porque la inercia hidrogeológica del suelo es lenta y suave.</li>
              <li><strong>Cortes prolongados (&gt; 2 días):</strong> NO interpolar a ciegas. Un aguacero severo pudo haber ocurrido durante el corte sin dejar registro. Debe marcarse el tramo como no monitoreado.</li>
              <li><strong>Detección previa:</strong> Siempre inicia diagnosticando con <code>df.isna().sum()</code> para cuantificar el porcentaje de pérdida instrumental.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const pts = getProcessedSeries();

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Barra de Métodos -->
        <div class="md-sim-toolbar">
          <span class="md-toolbar-label">Estrategia de Tratamiento:</span>
          <div class="md-buttons-group">
            <button class="md-btn ${state.method === 'raw' ? 'active' : ''}" data-meth="raw">
              ⚠️ Serie Cruda con NaN (Hueco)
            </button>
            <button class="md-btn ${state.method === 'dropna' ? 'active' : ''}" data-meth="dropna">
              ❌ dropna() (Eliminar Filas)
            </button>
            <button class="md-btn ${state.method === 'ffill' ? 'active' : ''}" data-meth="ffill">
              ➡️ ffill() (Repetir Último)
            </button>
            <button class="md-btn ${state.method === 'interpolate' ? 'active' : ''}" data-meth="interpolate">
              ✨ interpolate(linear) (Óptimo)
            </button>
          </div>
        </div>

        <!-- Gráfico SVG de la Serie Temporal Reconstruida -->
        <div class="md-graph-card">
          <svg viewBox="0 0 520 220" class="md-svg">
            <!-- Cuadrícula -->
            <rect x="50" y="20" width="420" height="160" fill="var(--bg-card)" stroke="var(--border-subtle)" />
            <line x1="50" y1="180" x2="470" y2="180" stroke="var(--border-subtle)" stroke-width="1.5" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="var(--border-subtle)" stroke-width="1.5" />

            <!-- Eje Y -->
            <text x="42" y="180" class="svg-axis-txt" text-anchor="end">15 kPa</text>
            <text x="42" y="100" class="svg-axis-txt" text-anchor="end">20 kPa</text>
            <text x="42" y="25" class="svg-axis-txt" text-anchor="end">25 kPa</text>

            <!-- Zona de Gap de Telemetría Sombreada -->
            <rect x="170" y="20" width="180" height="160" fill="rgba(239, 68, 68, 0.08)" />
            <text x="260" y="35" class="svg-gap-label" text-anchor="middle">⚡ CORTE DE TELEMETRÍA (10:00 a 12:00)</text>

            <!-- Línea Polilínea -->
            ${pts.length > 1 ? `
              <polyline 
                fill="none" 
                stroke="${state.method === 'interpolate' ? '#10b981' : state.method === 'ffill' ? '#f59e0b' : '#38bdf8'}" 
                stroke-width="2.5" 
                points="${pts.map((p, i) => {
                  const x = state.method === 'dropna' ? (70 + i * 90) : (70 + rawSeries.findIndex(r => r.t === p.t) * 60);
                  const y = p.displayVal !== null ? (180 - (p.displayVal - 15) * 15) : 180;
                  return `${x},${y}`;
                }).join(' ')}" 
              />
            ` : ''}

            <!-- Puntos de la Serie -->
            ${pts.map((p, i) => {
              const x = state.method === 'dropna' ? (70 + i * 90) : (70 + rawSeries.findIndex(r => r.t === p.t) * 60);
              const y = p.displayVal !== null ? (180 - (p.displayVal - 15) * 15) : 180;
              
              if (p.displayVal === null) {
                return `
                  <text x="${x}" y="100" class="svg-nan-marker" text-anchor="middle">❌ NaN</text>
                  <text x="${x}" y="196" class="svg-axis-txt" text-anchor="middle">${p.t}</text>
                `;
              }

              return `
                <circle cx="${x}" cy="${y}" r="4.5" fill="${p.wasImputed ? '#10b981' : '#38bdf8'}" stroke="#ffffff" stroke-width="1.5" />
                <text x="${x}" y="196" class="svg-axis-txt" text-anchor="middle">${p.t}</text>
                <text x="${x}" y="${y - 8}" class="svg-pt-val" text-anchor="middle">${p.displayVal}</text>
              `;
            }).join('')}
          </svg>
        </div>

        <!-- Código Pandas Dinámico -->
        <div class="md-code-footer">
          <pre class="trace-pre"><code>${getPandasCodeSnippet()}</code></pre>
        </div>
      </div>
    `;
  }

  function getPandasCodeSnippet() {
    if (state.method === "raw") {
      return `<span class="tok-comment"># Diagnosticar datos nulos en la serie temporal:</span>\nprint(df[<span class="tok-str">'presion_kpa'</span>].isna().sum())  <span class="tok-live-comment"># ➔ 3 datos faltantes detectados</span>`;
    }
    if (state.method === "dropna") {
      return `<span class="tok-comment"># Eliminar filas con NaN (rompe el paso temporal uniforme):</span>\ndf_limpio = df.dropna(subset=[<span class="tok-str">'presion_kpa'</span>])\n<span class="tok-live-comment"># ➔ La longitud se reduce de 7 a 4 filas; se pierde el orden horario constante</span>`;
    }
    if (state.method === "ffill") {
      return `<span class="tok-comment"># Relleno hacia adelante (mantiene el valor previo):</span>\ndf[<span class="tok-str">'presion_kpa'</span>] = df[<span class="tok-str">'presion_kpa'</span>].ffill()\n<span class="tok-live-comment"># ➔ 10:00, 11:00 y 12:00 quedan fijados artificialmente en 19.0 kPa</span>`;
    }
    if (state.method === "interpolate") {
      return `<span class="tok-comment"># Interpolación lineal física (conserva continuidad temporal):</span>\ndf[<span class="tok-str">'presion_kpa'</span>] = df[<span class="tok-str">'presion_kpa'</span>].interpolate(method=<span class="tok-str">'linear'</span>)\n<span class="tok-live-comment"># ➔ Pendiente suave calculada: 20.4, 21.8 y 23.2 kPa sin alterar el índice</span>`;
    }
  }

  function attachEvents() {
    const btnSim = document.getElementById("md-mode-sim");
    const btnWb = document.getElementById("md-mode-wb");

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

    document.querySelectorAll(".md-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.method = btn.dataset.meth;
        renderWidget();
      });
    });
  }

  window.initMissingDataWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("missing-data-container")) {
      window.initMissingDataWidget();
    }
  });
})();
