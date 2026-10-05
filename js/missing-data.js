/**
 * missing-data.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.1.
 * Tratamiento de Datos Faltantes (NaN) e Interpolación Lineal en Telemetría Geotécnica.
 * 
 * Integra en un único lienzo:
 * 1. Esquema conceptual de pizarra: Comparativa metodológica (dropna vs ffill vs interpolate).
 * 2. Protocolo geotécnico para huecos temporales en taludes.
 * 3. Simulador interactivo en tiempo real con SVG que reconstruye la curva de infiltración según el método elegido.
 */

(function () {
  let state = {
    method: "interpolate", // 'raw', 'dropna', 'ffill', 'interpolate'
  };

  const rawSeries = [
    { t: "08:00", val: 16.5 },
    { t: "09:00", val: 19.0 },
    { t: "10:00", val: null }, // Corte
    { t: "11:00", val: null }, // Corte
    { t: "12:00", val: null }, // Corte
    { t: "13:00", val: 24.6 }, // Reanudación
    { t: "14:00", val: 23.8 },
  ];

  function getProcessedSeries() {
    if (state.method === "raw") {
      return rawSeries.map(p => ({ ...p, displayVal: p.val, wasImputed: false }));
    }
    if (state.method === "dropna") {
      return rawSeries.filter(p => p.val !== null).map(p => ({ ...p, displayVal: p.val, wasImputed: false }));
    }
    if (state.method === "ffill") {
      return rawSeries.map(p => {
        if (p.t === "10:00" || p.t === "11:00" || p.t === "12:00") {
          return { ...p, displayVal: 19.0, wasImputed: true };
        }
        return { ...p, displayVal: p.val, wasImputed: false };
      });
    }
    if (state.method === "interpolate") {
      // 19.0 a 24.6 en 4 pasos -> +1.4 por hora: 20.4, 21.8, 23.2
      return rawSeries.map(p => {
        if (p.t === "10:00") return { ...p, displayVal: 20.4, wasImputed: true };
        if (p.t === "11:00") return { ...p, displayVal: 21.8, wasImputed: true };
        if (p.t === "12:00") return { ...p, displayVal: 23.2, wasImputed: true };
        return { ...p, displayVal: p.val, wasImputed: false };
      });
    }
  }

  function getPandasCodeSnippet() {
    if (state.method === "raw") {
      return `<span class="tok-comment"># Diagnosticar datos nulos en la serie temporal:</span>\nprint(df[<span class="tok-str">'presion_kpa'</span>].isna().sum())  <span class="tok-live-comment"># ➔ 3 datos faltantes detectados</span>`;
    }
    if (state.method === "dropna") {
      return `<span class="tok-comment"># Eliminar filas con NaN (rompe el paso temporal uniforme):</span>\ndf_limpio = df.dropna(subset=[<span class="tok-str">'presion_kpa'</span>])\n<span class="tok-live-comment"># ➔ Peligro: Se pierden horas en el eje cronológico; se rompe Δt constante</span>`;
    }
    if (state.method === "ffill") {
      return `<span class="tok-comment"># Relleno hacia adelante (mantiene el valor previo):</span>\ndf[<span class="tok-str">'presion_kpa'</span>] = df[<span class="tok-str">'presion_kpa'</span>].ffill()\n<span class="tok-live-comment"># ➔ 10:00, 11:00 y 12:00 quedan fijados artificialmente en 19.0 kPa</span>`;
    }
    if (state.method === "interpolate") {
      return `<span class="tok-comment"># Interpolación lineal física (conserva continuidad temporal):</span>\ndf[<span class="tok-str">'presion_kpa'</span>] = df[<span class="tok-str">'presion_kpa'</span>].interpolate(method=<span class="tok-str">'linear'</span>)\n<span class="tok-live-comment"># ➔ Pendiente continua calculada: 20.4, 21.8 y 23.2 kPa preservando el índice</span>`;
    }
  }

  function renderWidget() {
    const container = document.getElementById("missing-data-container");
    if (!container) return;

    const pts = getProcessedSeries();

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.1 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">🔬 Tratamiento de Datos Faltantes (<code>NaN</code>): El Dilema de la Telemetría</h4>
          </div>
          <div class="bp-status-pill ${state.method === 'interpolate' ? 'pill-ok' : state.method === 'dropna' ? 'pill-alert' : 'pill-warn'}">
            ${state.method === 'interpolate' ? '✨ Interpolación Lineal: Índice Regular Preservado' : state.method === 'dropna' ? '⚠️ Paso Temporal Roto (Filas Eliminadas)' : state.method === 'ffill' ? '➡️ Escalón Falso Plano' : '⚡ 3 Vacíos Detectados'}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          En telemetría geotécnica, las caídas de señal generan huecos (<code>NaN</code>). <strong>Eliminar filas con <code>dropna()</code> destruye la regularidad del paso temporal ($\\Delta t$)</strong>, imposibilitando calcular derivadas de velocidad o acumulados móviles con rigor. A continuación se integran la comparativa de métodos y el simulador de reconstrucción:
        </p>

        <!-- 1. ESQUEMA CONCEPTUAL DE PIZARRA (COMPARATIVA METODOLÓGICA) -->
        <div class="whiteboard-view" style="margin-top: 0.25rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">COMPARATIVA METODOLÓGICA ANTE HUECOS (NaN)</div>

            <div class="wb-missing-schematic">
              <!-- Método 1: dropna -->
              <div class="md-method-card border-danger">
                <div class="md-method-tag">1. <code>df.dropna()</code> &bull; Eliminación Directa</div>
                <div class="md-desc">
                  Corta y borra las filas con <code>NaN</code>. <strong style="color:#ef4444;">¡Peligro en series de tiempo!</strong>
                  Destruye el paso de tiempo regular ($\\Delta t = 1\\text{ h}$), impidiendo calcular derivadas y ventanas móviles con precisión.
                </div>
              </div>

              <!-- Método 2: ffill -->
              <div class="md-method-card border-warning">
                <div class="md-method-tag">2. <code>df.ffill()</code> &bull; Relleno Hacia Adelante (Forward Fill)</div>
                <div class="md-desc">
                  Copia el último valor conocido como un escalón constante plano. Asume falsamente que las presiones no variaron durante la tormenta.
                </div>
              </div>

              <!-- Método 3: interpolate -->
              <div class="md-method-card border-success">
                <div class="md-method-tag">3. <code>df.interpolate(method='linear')</code> &bull; Recomendado</div>
                <div class="md-desc">
                  Une con una recta continua el punto antes del corte con la reanudación. Preserva la física del fenómeno y conserva intacto el índice temporal.
                </div>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">🛡️ Protocolo Geotécnico de Decisión</h5>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.86em; gap:8px;">
                <li><strong>Huecos breves (&lt; 6 horas):</strong> La interpolación lineal es excelente porque la inercia hidrogeológica del suelo es lenta y gradual.</li>
                <li><strong>Cortes prolongados (&gt; 2 días):</strong> NO interpolar a ciegas. Pudo ocurrir un aguacero severo durante el corte; debe marcarse como tramo no monitoreado.</li>
                <li><strong>Diagnóstico previo:</strong> Siempre inicia auditando con <code>df.isna().sum()</code>.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO CON SVG DINÁMICO -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <strong style="font-size: 0.86rem; color: var(--text-main);">
            🧪 Simulador de Estrategias de Reconstrucción (Haz clic para alternar en tiempo real):
          </strong>

          <!-- Barra de Métodos -->
          <div class="md-sim-toolbar" style="margin: 0.75rem 0;">
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
          <div class="md-code-footer" style="margin-top: 0.75rem;">
            <pre class="trace-pre"><code>${getPandasCodeSnippet()}</code></pre>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("missing-data-container")) {
        window.initMissingDataWidget();
      }
    });
  } else {
    if (document.getElementById("missing-data-container")) {
      window.initMissingDataWidget();
    }
  }
})();
