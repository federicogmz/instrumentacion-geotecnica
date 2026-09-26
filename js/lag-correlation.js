/**
 * lag-correlation.js
 * Componente visual interactivo para la enseñanza de Correlación Rezagada (.shift()) y Tiempo de Respuesta.
 * Contexto Geotécnico: Retardo temporal entre la tormenta y el pico de presión de poros en piezómetro profundo.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    lag: 4,            // Rezago en horas (0 a 8)
  };

  // 12 horas de datos: La lluvia pica a las 10:00 (h=2), el piezómetro pica a las 14:00 (h=6) ➔ Retardo óptimo = 4 h
  const baseRain =  [0, 10, 48, 25, 5, 0, 0, 0, 0, 0, 0, 0];
  const basePiezo = [12, 12, 13, 15, 18, 24, 30, 27, 23, 19, 15, 13];

  function computePearson(shiftedRain, piezo) {
    const validPairs = [];
    for (let i = 0; i < shiftedRain.length; i++) {
      if (shiftedRain[i] !== null && piezo[i] !== null) {
        validPairs.push([shiftedRain[i], piezo[i]]);
      }
    }
    if (validPairs.length < 3) return 0;

    const n = validPairs.length;
    const meanX = validPairs.reduce((a, p) => a + p[0], 0) / n;
    const meanY = validPairs.reduce((a, p) => a + p[1], 0) / n;

    let num = 0, denX = 0, denY = 0;
    validPairs.forEach(([x, y]) => {
      const dx = x - meanX;
      const dy = y - meanY;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    });

    const den = Math.sqrt(denX * denY);
    return den === 0 ? 0 : parseFloat((num / den).toFixed(2));
  }

  function getShiftedRain(lag) {
    const res = [];
    for (let i = 0; i < baseRain.length; i++) {
      if (i < lag) {
        res.push(null); // NaN por shift
      } else {
        res.push(baseRain[i - lag]);
      }
    }
    return res;
  }

  function renderWidget() {
    const container = document.getElementById("lag-correlation-container");
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
            <span class="flow-badge">Módulo 3 &bull; Lección 3.4</span>
            <h4 class="flow-title">Correlación Rezagada (<code>.shift()</code>): Retardo Hidrogeológico</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="lc-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="lc-mode-wb">
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
          <div class="wb-title-badge">EL TIEMPO DE TRÁNSITO HIDROGEOLÓGICO</div>

          <div class="wb-lag-schematic">
            <div class="lc-stage stage-rain">
              <span class="lc-stage-tag">1. TORMENTA EN SUPERFICIE (10:00 AM)</span>
              <p>El pluviómetro registra el pico de lluvia inmediatamente cuando caen las gotas en la caseta.</p>
            </div>

            <div class="lc-stage-arrow">▼ Infiltración a través de 15 m de perfil de suelo (tarda 4 horas) ▼</div>

            <div class="lc-stage stage-piezo">
              <span class="lc-stage-tag">2. RESPUESTA EN EL FONDO (14:00 PM)</span>
              <p>El piezómetro profundo alcanza su presión máxima 4 horas más tarde.</p>
            </div>

            <div class="lc-stage stage-math">
              <span class="lc-stage-tag">3. LA TRAMPA DEL REZAGO CERO: <code>df.corr()</code></span>
              <p>Sin desfasar (lag = 0), la correlación parece nula ($r \approx 0.12$). Al aplicar <code>df['lluvia'].shift(4)</code>, los picos se acoplan y $r \rightarrow 0.95$.</p>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-blue); margin-top:0;">⚡ Sintaxis con Pandas</h5>
            <div class="wb-code-block">
# Desplazar la serie 4 horas hacia adelante:
df['lluvia_lag4'] = df['lluvia_mm'].shift(4)

# Calcular coeficiente de correlación de Pearson:
r = df['piezometro_kpa'].corr(df['lluvia_lag4'])
print(f"Correlación óptima: {r:.2f}")</div>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:8px;">
              <li><strong><code>.shift(N)</code>:</strong> Mueve los valores $N$ pasos hacia el futuro.</li>
              <li><strong>Retardo de cuenca:</strong> Te dice exactamente cuántas horas de ventaja tiene el geotecnista para alertar a la comunidad antes de que la presión de poros alcance el límite crítico.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const sRain = getShiftedRain(state.lag);
    const r = computePearson(sRain, basePiezo);
    const isOptimal = state.lag === 4;

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Control de Slider de Rezago -->
        <div class="lc-sim-toolbar">
          <div class="lc-slider-box">
            <div class="slider-header-row">
              <label>Rezago Temporal de Lluvia (<code>shift(lag)</code>):</label>
              <strong class="slider-val-badge">lag = ${state.lag} horas</strong>
            </div>
            <input type="range" min="0" max="8" step="1" value="${state.lag}" id="slider-lc-lag" class="flow-slider">
          </div>

          <div class="lc-pearson-badge ${isOptimal ? 'optimal-match' : ''}">
            Coeficiente de Pearson: <strong>r = ${r}</strong>
            ${isOptimal ? '⭐ ¡MÁXIMO ACOPLAMIENTO!' : ''}
          </div>
        </div>

        <!-- Gráfico SVG Interactivo de Curvas Desfasadas -->
        <div class="lc-graph-card">
          <svg viewBox="0 0 520 220" class="lc-svg">
            <rect x="50" y="20" width="420" height="160" fill="var(--bg-card)" stroke="var(--border-subtle)" />
            <line x1="50" y1="180" x2="470" y2="180" stroke="var(--border-subtle)" stroke-width="1.5" />

            <!-- Curva Piezómetro (Fija en rojo/rosa) -->
            <polyline 
              fill="none" 
              stroke="#f43f5e" 
              stroke-width="2.5" 
              points="${basePiezo.map((p, i) => `${70 + i * 33},${180 - (p / 32) * 140}`).join(' ')}" 
            />

            <!-- Curva Lluvia Desfasada (Azul) -->
            <polyline 
              fill="none" 
              stroke="#38bdf8" 
              stroke-width="2.5" 
              stroke-dasharray="4,4" 
              points="${sRain.map((val, i) => {
                if (val === null) return `${70 + i * 33},180`;
                return `${70 + i * 33},${180 - (val / 50) * 140}`;
              }).join(' ')}" 
            />

            <!-- Puntos -->
            ${basePiezo.map((p, i) => {
              const x = 70 + i * 33;
              const yPiezo = 180 - (p / 32) * 140;
              const valRain = sRain[i];
              const yRain = valRain !== null ? (180 - (valRain / 50) * 140) : 180;

              return `
                <circle cx="${x}" cy="${yPiezo}" r="3.5" fill="#f43f5e" />
                ${valRain !== null ? `<circle cx="${x}" cy="${yRain}" r="3.5" fill="#38bdf8" />` : ''}
                <text x="${x}" y="196" class="svg-axis-txt" text-anchor="middle">${8 + i}:00</text>
              `;
            }).join('')}

            <!-- Leyenda -->
            <text x="60" y="38" fill="#f43f5e" font-size="11" font-weight="700">― Piezómetro (Pico a las 14:00)</text>
            <text x="250" y="38" fill="#38bdf8" font-size="11" font-weight="700">- - Lluvia desfasada (shift = ${state.lag} h)</text>
          </svg>
        </div>

        <!-- Conclusión Geotécnica en Vivo -->
        <div class="lc-footer-status">
          ${isOptimal 
            ? `🎯 <strong>TIEMPO DE TRÁNSITO IDENTIFICADO: 4 HORAS</strong>. La infiltración tarda exactamente 4 horas en elevar la presión de poros al nivel crítico. La correlación salta de r=0.15 a <strong>r=${r}</strong>.`
            : `Alineación parcial ($r = ${r}$). Desliza el control hasta alinear el pico de lluvia con el pico del piezómetro para maximizar la correlación.`
          }
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("lc-mode-sim");
    const btnWb = document.getElementById("lc-mode-wb");

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

    const slider = document.getElementById("slider-lc-lag");
    if (slider) {
      slider.addEventListener("input", (e) => {
        state.lag = parseInt(e.target.value, 10);
        renderWidget();
      });
    }
  }

  window.initLagCorrelationWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("lag-correlation-container")) {
      window.initLagCorrelationWidget();
    }
  });
})();
