/**
 * boxplot-anatomy.js
 * Componente visual interactivo para la enseñanza de la Anatomía del Boxplot y Outliers.
 * Contexto Geotécnico: Filtrado de ruido electromagnético en lecturas de extensómetros de taludes.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    hasOutlier: true,
  };

  const cleanData = [4.1, 4.5, 4.8, 5.0, 5.2, 5.4, 5.7, 6.0, 6.3, 6.8];
  const noiseData = [4.1, 4.5, 4.8, 5.0, 5.2, 5.4, 5.7, 6.0, 6.3, 48.5]; // Ruido de 48.5 mm

  function getStats(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const n = sorted.length;
    const q1 = sorted[Math.floor(n * 0.25)];
    const median = (sorted[Math.floor((n - 1) / 2)] + sorted[Math.ceil((n - 1) / 2)]) / 2;
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(sorted[0], q1 - 1.5 * iqr);
    const upperWhisker = Math.min(sorted[n - 1], q3 + 1.5 * iqr);
    const mean = (sorted.reduce((a, b) => a + b, 0) / n).toFixed(2);
    const outliers = sorted.filter(x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr);

    return {
      min: sorted[0],
      max: sorted[n - 1],
      q1,
      median,
      q3,
      iqr: parseFloat(iqr.toFixed(2)),
      lowerWhisker: parseFloat(lowerWhisker.toFixed(2)),
      upperWhisker: parseFloat(upperWhisker.toFixed(2)),
      mean: parseFloat(mean),
      outliers,
    };
  }

  function renderWidget() {
    const container = document.getElementById("boxplot-anatomy-container");
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
            <span class="flow-badge">Módulo 2 &bull; Lección 2.2</span>
            <h4 class="flow-title">Anatomía del Boxplot Geotécnico: Detección de Ruido y Outliers</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="bp-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="bp-mode-wb">
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
          <div class="wb-title-badge">ANATOMÍA DEL DIAGRAMA DE CAJA Y BIGOTES (TUKEY)</div>

          <div class="wb-boxplot-schematic">
            <!-- Outliers Superiores -->
            <div class="bp-part bp-outlier-zone">
              <span class="bp-badge-outlier">🔴 OUTLIER (Punto Atípico)</span>
              <span class="bp-formula">Lectura &gt; Q3 + 1.5 &times; IQR (Ruido de telemetría o pico espurio)</span>
            </div>

            <!-- Bigote Superior -->
            <div class="bp-part bp-whisker">
              <div class="whisker-line"></div>
              <span class="bp-label">Bigote Superior: <code>Q3 + 1.5 &times; IQR</code> (Límite normal superior)</span>
            </div>

            <!-- Caja Principal (IQR) -->
            <div class="bp-box-body">
              <div class="bp-q3-line">
                <span class="q-label">Q3 (Percentil 75)</span>
                <span class="q-desc">El 75% de las lecturas está por debajo de este valor</span>
              </div>

              <div class="bp-median-line">
                <span class="q-label-med">MEDIANA (Q2 - Percentil 50)</span>
                <span class="q-desc-med">⭐ Valor central robusto: NO se altera por picos de ruido</span>
              </div>

              <div class="bp-q1-line">
                <span class="q-label">Q1 (Percentil 25)</span>
                <span class="q-desc">El 25% de las lecturas está por debajo</span>
              </div>

              <div class="bp-iqr-bracket">
                <span>Rango Intercuartílico: IQR = Q3 - Q1 (Dispersión del 50% central)</span>
              </div>
            </div>

            <!-- Bigote Inferior -->
            <div class="bp-part bp-whisker">
              <div class="whisker-line"></div>
              <span class="bp-label">Bigote Inferior: <code>Q1 - 1.5 &times; IQR</code> (Límite normal inferior)</span>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-red); margin-top:0;">🚨 ¿Por qué NO usar la Media en Instrumentación?</h5>
            <p style="font-size:0.86em; color:var(--text-main); line-height:1.45;">
              Si un sensor tiene 9 lecturas de <strong>5.0 mm</strong> y una descarga estática induce un pico falso de <strong>50.0 mm</strong>:
            </p>
            <ul class="bullet-list" style="margin-top:8px; font-size:0.85em; gap:8px;">
              <li><strong>Media Aritmética:</strong> Se dispara a <code>9.5 mm</code> ➔ <em>¡Dispara una falsa alarma de evacuación!</em></li>
              <li><strong>Mediana del Boxplot:</strong> Permanece en <code>5.0 mm</code> y aísla el <code>50.0 mm</code> como un punto rojo exterior (outlier) listo para ser limpiado.</li>
            </ul>
          </div>

          <div class="wb-card-glass" style="margin-top:14px; border-left:3px solid var(--accent-emerald);">
            <h5 style="color:var(--accent-emerald); margin-top:0;">🐍 Código en Matplotlib</h5>
            <div class="wb-code-block">
import matplotlib.pyplot as plt

# Generar el boxplot con Matplotlib
plt.boxplot(df['extensometro_mm'], vert=True)
plt.ylabel("Desplazamiento (mm)")
plt.title("Detección de Outliers en Extensómetro")</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const data = state.hasOutlier ? noiseData : cleanData;
    const s = getStats(data);

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Barra de Control -->
        <div class="bp-sim-toolbar">
          <div class="bp-toggle-group">
            <span class="bp-toggle-label">Estado de la Serie del Extensómetro:</span>
            <button class="bp-state-btn ${state.hasOutlier ? 'active-noise' : ''}" id="bp-btn-noise">
              ⚡ Con Pico de Ruido (Outlier = 48.5 mm)
            </button>
            <button class="bp-state-btn ${!state.hasOutlier ? 'active-clean' : ''}" id="bp-btn-clean">
              ✅ Señal Limpia (Sin Outliers)
            </button>
          </div>

          <div class="bp-status-pill ${state.hasOutlier ? 'pill-alert' : 'pill-ok'}">
            ${state.hasOutlier ? '⚠️ 1 Outlier Detectado por Tukey' : '✓ Datos en Distribución Normal'}
          </div>
        </div>

        <!-- Comparativa Visual: Diagrama SVG Interactivo + Métricas -->
        <div class="bp-sim-grid">
          <!-- Gráfico SVG del Boxplot -->
          <div class="bp-graphic-card">
            <div class="bp-svg-container">
              <svg viewBox="0 0 280 260" class="bp-svg">
                <!-- Eje Y de referencia -->
                <line x1="45" y1="20" x2="45" y2="230" stroke="var(--border-subtle)" stroke-width="1.5" />
                <text x="35" y="25" class="svg-axis-txt" text-anchor="end">50 mm</text>
                <text x="35" y="125" class="svg-axis-txt" text-anchor="end">25 mm</text>
                <text x="35" y="225" class="svg-axis-txt" text-anchor="end">0 mm</text>

                ${state.hasOutlier ? `
                  <!-- Punto Outlier -->
                  <circle cx="150" cy="27" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="2" class="pulse-ring" />
                  <text x="165" y="31" class="svg-outlier-txt">48.5 mm (Outlier)</text>
                ` : ''}

                <!-- Bigote Superior -->
                <line x1="150" y1="170" x2="150" y2="190" stroke="var(--accent-blue)" stroke-width="2" />
                <line x1="130" y1="170" x2="170" y2="170" stroke="var(--accent-blue)" stroke-width="2" />
                <text x="180" y="174" class="svg-bp-txt">Bigote Sup: ${s.upperWhisker} mm</text>

                <!-- Caja (Q1 a Q3) -->
                <rect x="110" y="190" width="80" height="30" fill="rgba(56, 189, 248, 0.15)" stroke="var(--accent-blue)" stroke-width="2" rx="3" />
                <text x="200" y="194" class="svg-bp-txt">Q3: ${s.q3} mm</text>

                <!-- Mediana -->
                <line x1="110" y1="205" x2="190" y2="205" stroke="#f59e0b" stroke-width="3" />
                <text x="200" y="209" class="svg-bp-txt-med">Mediana: ${s.median} mm</text>

                <text x="200" y="224" class="svg-bp-txt">Q1: ${s.q1} mm</text>

                <!-- Bigote Inferior -->
                <line x1="150" y1="220" x2="150" y2="230" stroke="var(--accent-blue)" stroke-width="2" />
                <line x1="130" y1="230" x2="170" y2="230" stroke="var(--accent-blue)" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- Tarjetas Comparativas de Impacto -->
          <div class="bp-metrics-col">
            <div class="metric-comparison-card ${state.hasOutlier ? 'distorted' : ''}">
              <div class="mc-title">Media Aritmética (<code>df.mean()</code>)</div>
              <div class="mc-val" style="color:${state.hasOutlier ? '#ef4444' : 'var(--text-main)'};">
                ${s.mean} <small>mm</small>
              </div>
              <div class="mc-desc">
                ${state.hasOutlier 
                  ? '🚨 <strong>Distorsionada:</strong> Se disparó artificialmente por un solo dato falso.' 
                  : 'Sensible pero normalizada cuando los datos están limpios.'}
              </div>
            </div>

            <div class="metric-comparison-card robust">
              <div class="mc-title">Mediana Robusta (<code>df.median()</code>)</div>
              <div class="mc-val" style="color:#10b981;">
                ${s.median} <small>mm</small>
              </div>
              <div class="mc-desc">
                🛡️ <strong>Imperturbable:</strong> Se mantiene fiel a la realidad física de la ladera sin importar los picos erráticos de sensor.
              </div>
            </div>

            <div class="bp-summary-box">
              <span>Rango Intercuartílico (IQR): <strong>${s.iqr} mm</strong></span> |
              <span>Bigotes normales: <strong>[${s.lowerWhisker}, ${s.upperWhisker}] mm</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("bp-mode-sim");
    const btnWb = document.getElementById("bp-mode-wb");

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

    const btnNoise = document.getElementById("bp-btn-noise");
    const btnClean = document.getElementById("bp-btn-clean");

    if (btnNoise) {
      btnNoise.addEventListener("click", () => {
        state.hasOutlier = true;
        renderWidget();
      });
    }
    if (btnClean) {
      btnClean.addEventListener("click", () => {
        state.hasOutlier = false;
        renderWidget();
      });
    }
  }

  window.initBoxplotWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("boxplot-anatomy-container")) {
      window.initBoxplotWidget();
    }
  });
})();
