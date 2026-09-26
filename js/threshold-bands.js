/**
 * threshold-bands.js
 * Componente visual interactivo para la enseñanza de Semáforos de Alerta y Bandas Coloreadas (axhspan).
 * Contexto Geotécnico: Protocolos de alerta temprana y evacuación en taludes instrumentados.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    tYellow: 5.0,
    tOrange: 10.0,
    tRed: 15.0,
  };

  const timeSeries = [
    { day: "D1", val: 2.1 },
    { day: "D2", val: 3.4 },
    { day: "D3", val: 4.8 },
    { day: "D4", val: 6.2 },
    { day: "D5", val: 8.5 },
    { day: "D6", val: 11.2 },
    { day: "D7", val: 13.8 },
    { day: "D8", val: 16.5 },
    { day: "D9", val: 18.2 },
    { day: "D10", val: 19.8 },
  ];

  function evaluateSeries() {
    let normal = 0, yellow = 0, orange = 0, red = 0;
    timeSeries.forEach(p => {
      if (p.val < state.tYellow) normal++;
      else if (p.val < state.tOrange) yellow++;
      else if (p.val < state.tRed) orange++;
      else red++;
    });
    return { normal, yellow, orange, red };
  }

  function renderWidget() {
    const container = document.getElementById("threshold-bands-container");
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
            <span class="flow-badge">Módulo 2 &bull; Lección 2.3</span>
            <h4 class="flow-title">Semáforo de Umbrales Geotécnicos: Zonificación con <code>axhspan</code></h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="tb-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="tb-mode-wb">
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
          <div class="wb-title-badge">ZONIFICACIÓN DE RIESGO: <code>plt.axhspan(ymin, ymax)</code></div>

          <div class="wb-bands-schematic">
            <!-- Banda Roja -->
            <div class="schematic-band band-red">
              <div class="band-tag">🔴 ZONA ROJA: EMERGENCIA (&gt; 15 mm)</div>
              <div class="band-action">Evacuación inmediata y cierre de vía</div>
              <code class="band-code">ax.axhspan(15, 25, color='red', alpha=0.2)</code>
            </div>

            <!-- Banda Naranja -->
            <div class="schematic-band band-orange">
              <div class="band-tag">🟠 ZONA NARANJA: ALERTA (10 a 15 mm)</div>
              <div class="band-action">Aceleración de deformación &bull; Comité técnico</div>
              <code class="band-code">ax.axhspan(10, 15, color='orange', alpha=0.2)</code>
            </div>

            <!-- Banda Amarilla -->
            <div class="schematic-band band-yellow">
              <div class="band-tag">🟡 ZONA AMARILLA: PREVENTIVO (5 a 10 mm)</div>
              <div class="band-action">Incremento en frecuencia de telemetría e inspección visual</div>
              <code class="band-code">ax.axhspan(5, 10, color='yellow', alpha=0.2)</code>
            </div>

            <!-- Banda Verde -->
            <div class="schematic-band band-green">
              <div class="band-tag">🟢 ZONA VERDE: ESTABLE (0 a 5 mm)</div>
              <div class="band-action">Operación normal segura</div>
              <code class="band-code">ax.axhspan(0, 5, color='green', alpha=0.2)</code>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-emerald); margin-top:0;">🎯 ¿Por qué usar <code>axhspan</code>?</h5>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:10px;">
              <li><strong>Infinito Horizontal:</strong> A diferencia de dibujar un rectángulo manual, <code>axhspan()</code> se extiende automáticamente por todo el ancho del eje X (desde el primer día hasta el último).</li>
              <li><strong>Transparencia (<code>alpha=0.2</code>):</strong> Permite que las franjas de color sirvan de fondo de seguridad sin tapar la curva de deformación ni la cuadrícula.</li>
              <li><strong>Visualización Intuitiva:</strong> El operador no tiene que memorizar números en tablas; ve de un vistazo cuándo la curva cruza de amarillo a rojo.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const stats = evaluateSeries();

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Controles de Umbrales Deslizables -->
        <div class="tb-controls-bar">
          <div class="tb-slider-group">
            <div class="slider-header-row">
              <span>Umbral Preventivo (🟡):</span>
              <strong style="color:#eab308;">${state.tYellow.toFixed(1)} mm</strong>
            </div>
            <input type="range" min="3.0" max="8.0" step="0.5" value="${state.tYellow}" id="slider-tb-yellow" class="flow-slider">
          </div>

          <div class="tb-slider-group">
            <div class="slider-header-row">
              <span>Umbral Alerta (🟠):</span>
              <strong style="color:#f97316;">${state.tOrange.toFixed(1)} mm</strong>
            </div>
            <input type="range" min="8.5" max="14.0" step="0.5" value="${state.tOrange}" id="slider-tb-orange" class="flow-slider">
          </div>

          <div class="tb-slider-group">
            <div class="slider-header-row">
              <span>Umbral Emergencia (🔴):</span>
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
            <text x="42" y="${200 - (state.tYellow * 8.5)}" class="svg-axis-txt" text-anchor="end">${state.tYellow} mm</text>
            <text x="42" y="${200 - (state.tOrange * 8.5)}" class="svg-axis-txt" text-anchor="end">${state.tOrange} mm</text>
            <text x="42" y="${200 - (state.tRed * 8.5)}" class="svg-axis-txt" text-anchor="end">${state.tRed} mm</text>

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
        <div class="tb-summary-cards">
          <div class="tb-stat-pill pill-green">🟢 Normal: <strong>${stats.normal} días</strong></div>
          <div class="tb-stat-pill pill-yellow">🟡 Preventivo: <strong>${stats.yellow} días</strong></div>
          <div class="tb-stat-pill pill-orange">🟠 Alerta: <strong>${stats.orange} días</strong></div>
          <div class="tb-stat-pill pill-red">🔴 Emergencia: <strong>${stats.red} días</strong></div>
        </div>

        <!-- Código Generado -->
        <div class="tb-code-footer">
          <pre class="trace-pre"><code><span class="tok-comment"># Añadir zonas de semáforo con cotas dinámicas:</span>
ax.plot(fechas, deformacion, color=<span class="tok-str">'#38bdf8'</span>, lw=2, label=<span class="tok-str">'Extensómetro EXT-01'</span>)
ax.axhspan(0, ${state.tYellow.toFixed(1)}, color=<span class="tok-str">'green'</span>, alpha=0.2, label=<span class="tok-str">'Normal'</span>)
ax.axhspan(${state.tYellow.toFixed(1)}, ${state.tOrange.toFixed(1)}, color=<span class="tok-str">'yellow'</span>, alpha=0.2, label=<span class="tok-str">'Preventivo'</span>)
ax.axhspan(${state.tOrange.toFixed(1)}, ${state.tRed.toFixed(1)}, color=<span class="tok-str">'orange'</span>, alpha=0.2, label=<span class="tok-str">'Alerta'</span>)
ax.axhspan(${state.tRed.toFixed(1)}, 25.0, color=<span class="tok-str">'red'</span>, alpha=0.2, label=<span class="tok-str">'Emergencia'</span>)</code></pre>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("tb-mode-sim");
    const btnWb = document.getElementById("tb-mode-wb");

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

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("threshold-bands-container")) {
      window.initThresholdBandsWidget();
    }
  });
})();
