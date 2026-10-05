/**
 * threshold-bands.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 2.5.
 * Semáforo de Umbrales Geotécnicos y Zonificación con axhspan en Matplotlib.
 * 
 * Integra en un único lienzo:
 * 1. Esquema conceptual de pizarra: Los 4 niveles de riesgo (Verde, Amarillo, Naranja, Rojo) y axhspan.
 * 2. Simulador interactivo en tiempo real: Sliders de ajuste de umbrales con recálculo dinámico.
 * 3. Gráfica SVG con franjas transparentes y clasificación de días de alerta.
 */

(function () {
  let state = {
    tYellow: 5.0,  // Umbral preventivo
    tOrange: 10.0, // Umbral alerta
    tRed: 15.0,    // Umbral emergencia
  };

  const timeSeries = [
    { day: "D1", val: 1.2 },
    { day: "D2", val: 2.1 },
    { day: "D3", val: 4.5 },
    { day: "D4", val: 6.8 },
    { day: "D5", val: 8.5 },
    { day: "D6", val: 11.2 },
    { day: "D7", val: 12.8 },
    { day: "D8", val: 14.2 },
    { day: "D9", val: 16.5 },
    { day: "D10", val: 18.0 },
  ];

  function evaluateSeries() {
    let normal = 0, yellow = 0, orange = 0, red = 0;
    timeSeries.forEach(p => {
      if (p.val >= state.tRed) red++;
      else if (p.val >= state.tOrange) orange++;
      else if (p.val >= state.tYellow) yellow++;
      else normal++;
    });
    return { normal, yellow, orange, red };
  }

  function renderWidget() {
    const container = document.getElementById("threshold-bands-container");
    if (!container) return;

    const stats = evaluateSeries();

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 2 &bull; Lección 2.6 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">🚦 Semáforo de Umbrales Geotécnicos: Zonificación con <code>axhspan</code></h4>
          </div>
          <div class="bp-status-pill ${stats.red > 0 ? 'pill-alert' : 'pill-ok'}">
            ${stats.red > 0 ? `🚨 ${stats.red} Días en Zona Roja de Emergencia` : '✓ Operación en Rangos Controlados'}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          En monitoreo de taludes, las franjas horizontales translúcidas generadas con <code>ax.axhspan(ymin, ymax)</code> crean un <strong>semáforo visual continuo</strong> que abarca todo el tiempo sin saturar la curva. Observa la zonificación conceptual y ajusta los deslizadores interactivos para recalcular las alertas en vivo:
        </p>

        <!-- 1. ESQUEMA CONCEPTUAL DE PIZARRA (ZONIFICACIÓN DE RIESGO CON TUKEY) -->
        <div class="whiteboard-view" style="margin-top: 0.25rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">ZONIFICACIÓN DE RIESGO: UMBRALES DE TUKEY CON <code>ax.axhspan(ymin, ymax)</code></div>

            <div class="wb-bands-schematic">
              <!-- Banda Roja -->
              <div class="schematic-band band-red">
                <div class="band-tag">🔴 ZONA ROJA: EMERGENCIA (&gt; Q3 + 3.0&times;IQR &bull; &ge; ${state.tRed.toFixed(1)} mm)</div>
                <div class="band-action">Outliers severos &bull; Evacuación inmediata de la ladera y cierre vial</div>
                <code class="band-code">ax.axhspan(umbral_emergencia, y_max, color='red', alpha=0.25)</code>
              </div>

              <!-- Banda Naranja -->
              <div class="schematic-band band-orange">
                <div class="band-tag">🟠 ZONA NARANJA: ALERTA (Q3 + 1.5&times;IQR a Q3 + 3.0&times;IQR &bull; ${state.tOrange.toFixed(1)} a ${state.tRed.toFixed(1)} mm)</div>
                <div class="band-action">Outliers moderados &bull; Aceleración cinemática y activación de comité</div>
                <code class="band-code">ax.axhspan(umbral_alerta, umbral_emergencia, color='orange', alpha=0.25)</code>
              </div>

              <!-- Banda Amarilla -->
              <div class="schematic-band band-yellow">
                <div class="band-tag">🟡 ZONA AMARILLA: PREVENTIVO (Q3 a Q3 + 1.5&times;IQR &bull; ${state.tYellow.toFixed(1)} a ${state.tOrange.toFixed(1)} mm)</div>
                <div class="band-action">Bigote superior &bull; Aumento de frecuencia telemétrica e inspección</div>
                <code class="band-code">ax.axhspan(q3, umbral_alerta, color='gold', alpha=0.20)</code>
              </div>

              <!-- Banda Verde -->
              <div class="schematic-band band-green">
                <div class="band-tag">🟢 ZONA VERDE: ESTABLE (0 a Q3 &bull; 0 a ${state.tYellow.toFixed(1)} mm)</div>
                <div class="band-action">Régimen elástico habitual (75% de las observaciones históricas)</div>
                <code class="band-code">ax.axhspan(0, q3, color='green', alpha=0.15)</code>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">🎯 Método de Tukey vs Umbrales Arbitrarios</h5>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.86em; gap:8px;">
                <li><strong>Criterio Estadístico Objetivo:</strong> En lugar de fijar límites a ciegas, se calculan a partir de $Q_1$, $Q_3$ e $IQR$ del sensor.</li>
                <li><strong>Infinito Horizontal:</strong> <code>ax.axhspan()</code> proyecta las bandas sobre todo el eje temporal, facilitando ver cuándo la señal cruza cada umbral.</li>
                <li><strong>Transparencia Controlada (<code>alpha</code>):</strong> Mantiene visible la curva del sensor y la cuadrícula sin oscurecer los datos.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO CON SLIDERS Y SVG DINÁMICO -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <strong style="font-size: 0.86rem; color: var(--text-main);">
            🎛️ Calibración Dinámica de Umbrales (Arrastra para ver el impacto en tiempo real):
          </strong>

          <!-- Controles de Umbrales Deslizables -->
          <div class="tb-controls-bar" style="margin: 0.75rem 0;">
            <div class="tb-slider-group">
              <div class="slider-header-row">
                <span>🟡 Umbral Preventivo:</span>
                <strong style="color:#eab308;">${state.tYellow.toFixed(1)} mm</strong>
              </div>
              <input type="range" min="3.0" max="8.0" step="0.5" value="${state.tYellow}" id="slider-tb-yellow" class="flow-slider">
            </div>

            <div class="tb-slider-group">
              <div class="slider-header-row">
                <span>🟠 Umbral Alerta:</span>
                <strong style="color:#f97316;">${state.tOrange.toFixed(1)} mm</strong>
              </div>
              <input type="range" min="8.5" max="14.0" step="0.5" value="${state.tOrange}" id="slider-tb-orange" class="flow-slider">
            </div>

            <div class="tb-slider-group">
              <div class="slider-header-row">
                <span>🔴 Umbral Emergencia:</span>
                <strong style="color:#ef4444;">${state.tRed.toFixed(1)} mm</strong>
              </div>
              <input type="range" min="14.5" max="18.0" step="0.5" value="${state.tRed}" id="slider-tb-red" class="flow-slider">
            </div>
          </div>

          <!-- Gráfico SVG Interactivo con Bandas y Serie Temporal -->
          <div class="tb-graph-wrapper">
            <svg viewBox="0 0 500 220" class="tb-svg">
              <!-- Bandas axhspan -->
              <!-- Rojo: state.tRed a 22 mm -->
              <rect x="50" y="${200 - (22 * 8.5)}" width="430" height="${(22 - state.tRed) * 8.5}" fill="rgba(239, 68, 68, 0.22)" />
              <!-- Naranja: state.tOrange a state.tRed -->
              <rect x="50" y="${200 - (state.tRed * 8.5)}" width="430" height="${(state.tRed - state.tOrange) * 8.5}" fill="rgba(249, 115, 22, 0.22)" />
              <!-- Amarillo: state.tYellow a state.tOrange -->
              <rect x="50" y="${200 - (state.tOrange * 8.5)}" width="430" height="${(state.tOrange - state.tYellow) * 8.5}" fill="rgba(234, 179, 8, 0.22)" />
              <!-- Verde: 0 a state.tYellow -->
              <rect x="50" y="${200 - (state.tYellow * 8.5)}" width="430" height="${state.tYellow * 8.5}" fill="rgba(16, 185, 129, 0.22)" />

              <!-- Ejes -->
              <line x1="50" y1="200" x2="480" y2="200" stroke="var(--border-subtle)" stroke-width="1.5" />
              <line x1="50" y1="10" x2="50" y2="200" stroke="var(--border-subtle)" stroke-width="1.5" />

              <!-- Etiquetas Eje Y -->
              <text x="42" y="200" class="svg-axis-txt" text-anchor="end">0 mm</text>
              <text x="42" y="${200 - (state.tYellow * 8.5)}" class="svg-axis-txt" text-anchor="end">${state.tYellow.toFixed(1)}</text>
              <text x="42" y="${200 - (state.tOrange * 8.5)}" class="svg-axis-txt" text-anchor="end">${state.tOrange.toFixed(1)}</text>
              <text x="42" y="${200 - (state.tRed * 8.5)}" class="svg-axis-txt" text-anchor="end">${state.tRed.toFixed(1)}</text>

              <!-- Curva de Serie Temporal (Line) -->
              <polyline 
                fill="none" 
                stroke="#38bdf8" 
                stroke-width="2.5" 
                points="${timeSeries.map((p, i) => `${70 + i * 42},${200 - p.val * 8.5}`).join(' ')}" 
              />

              <!-- Puntos de la Serie -->
              ${timeSeries.map((p, i) => {
                const cx = 70 + i * 42;
                const cy = 200 - p.val * 8.5;
                let ptColor = "#10b981";
                if (p.val >= state.tRed) ptColor = "#ef4444";
                else if (p.val >= state.tOrange) ptColor = "#f97316";
                else if (p.val >= state.tYellow) ptColor = "#eab308";

                return `
                  <circle cx="${cx}" cy="${cy}" r="4.5" fill="${ptColor}" stroke="#ffffff" stroke-width="1.5" />
                  <text x="${cx}" y="215" class="svg-axis-txt" text-anchor="middle">${p.day}</text>
                `;
              }).join('')}
            </svg>
          </div>

          <!-- Estadísticas de Días en Cada Nivel -->
          <div class="tb-summary-cards" style="margin-top: 0.75rem;">
            <div class="tb-stat-pill pill-green">🟢 Normal: <strong>${stats.normal} días</strong></div>
            <div class="tb-stat-pill pill-yellow">🟡 Preventivo: <strong>${stats.yellow} días</strong></div>
            <div class="tb-stat-pill pill-orange">🟠 Alerta: <strong>${stats.orange} días</strong></div>
            <div class="tb-stat-pill pill-red">🔴 Emergencia: <strong>${stats.red} días</strong></div>
          </div>

          <!-- Código Python Generado Dinámicamente -->
          <div class="tb-code-footer" style="margin-top: 0.75rem;">
            <pre class="trace-pre"><code><span class="tok-comment"># Umbrales estadísticos de Tukey: Q3=${state.tYellow.toFixed(1)}mm, Alerta(Q3+1.5*IQR)=${state.tOrange.toFixed(1)}mm, Emergencia(Q3+3*IQR)=${state.tRed.toFixed(1)}mm</span>
ax.plot(df_ancon.index, df_ancon[<span class="tok-str">'DE1'</span>], color=<span class="tok-str">'black'</span>, lw=1.2, label=<span class="tok-str">'DE1 (Extensómetro)'</span>)
ax.axhspan(0, q3, color=<span class="tok-str">'green'</span>, alpha=0.15, label=<span class="tok-str">'Normal (&lt;= Q3)'</span>)
ax.axhspan(q3, umbral_alerta, color=<span class="tok-str">'gold'</span>, alpha=0.2, label=<span class="tok-str">'Prevención (Q3 a Q3+1.5*IQR)'</span>)
ax.axhspan(umbral_alerta, umbral_emergencia, color=<span class="tok-str">'orange'</span>, alpha=0.25, label=<span class="tok-str">'Alerta (Q3+1.5*IQR a Q3+3*IQR)'</span>)
ax.axhspan(umbral_emergencia, df_ancon[<span class="tok-str">'DE1'</span>].max() * 1.05, color=<span class="tok-str">'red'</span>, alpha=0.25, label=<span class="tok-str">'Emergencia (&gt; Q3+3*IQR)'</span>)</code></pre>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const sY = document.getElementById("slider-tb-yellow");
    const sO = document.getElementById("slider-tb-orange");
    const sR = document.getElementById("slider-tb-red");

    if (sY) {
      sY.addEventListener("input", (e) => {
        state.tYellow = parseFloat(e.target.value);
        if (state.tYellow >= state.tOrange) state.tOrange = state.tYellow + 1;
        renderWidget();
      });
    }
    if (sO) {
      sO.addEventListener("input", (e) => {
        state.tOrange = parseFloat(e.target.value);
        if (state.tOrange <= state.tYellow) state.tYellow = state.tOrange - 1;
        if (state.tOrange >= state.tRed) state.tRed = state.tOrange + 1;
        renderWidget();
      });
    }
    if (sR) {
      sR.addEventListener("input", (e) => {
        state.tRed = parseFloat(e.target.value);
        if (state.tRed <= state.tOrange) state.tOrange = state.tRed - 1;
        renderWidget();
      });
    }
  }

  window.initThresholdBandsWidget = function () {
    renderWidget();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("threshold-bands-container")) {
        window.initThresholdBandsWidget();
      }
    });
  } else {
    if (document.getElementById("threshold-bands-container")) {
      window.initThresholdBandsWidget();
    }
  }
})();
