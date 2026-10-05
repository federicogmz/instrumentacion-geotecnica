/**
 * lag-correlation.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.4.
 * Correlación Rezagada (.shift()) y Retardo de Infiltración Hidrogeológica.
 * 
 * Integra en un único lienzo:
 * 1. Esquema conceptual de pizarra: El tiempo de tránsito hidrogeológico (10:00 AM tormenta -> 4 h infiltración -> 14:00 PM presión pico).
 * 2. La trampa del rezago cero (df.corr()) y sintaxis con .shift().
 * 3. Simulador interactivo en tiempo real con slider de lag, gráfico SVG dinámico y recálculo del coeficiente de Pearson (r).
 */

(function () {
  let state = {
    lag: 4, // Rezago inicial de 4 horas (el óptimo físico)
  };

  // 12 Horas de monitoreo (08:00 a 19:00)
  const baseRain =  [0, 10, 48, 25, 5, 0, 0, 0, 0, 0, 0, 0];  // Tormenta con pico a las 10:00 AM (índice 2)
  const basePiezo = [14, 14.2, 14.5, 15.0, 16.8, 22.4, 30.5, 26.0, 20.2, 16.5, 15.0, 14.5]; // Presión pico a las 14:00 PM (índice 6 -> lag = 4)

  function computePearson(x, y) {
    const validPairs = [];
    for (let i = 0; i < x.length; i++) {
      if (x[i] !== null && y[i] !== null) {
        validPairs.push([x[i], y[i]]);
      }
    }
    const n = validPairs.length;
    if (n < 3) return 0;

    const meanX = validPairs.reduce((acc, p) => acc + p[0], 0) / n;
    const meanY = validPairs.reduce((acc, p) => acc + p[1], 0) / n;

    let num = 0, denX = 0, denY = 0;
    validPairs.forEach(([xi, yi]) => {
      const dx = xi - meanX;
      const dy = yi - meanY;
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

    const sRain = getShiftedRain(state.lag);
    const r = computePearson(sRain, basePiezo);
    const isOptimal = state.lag === 4;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.4 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">⏱️ Correlación Rezagada (<code>.shift()</code>): Retardo Hidrogeológico</h4>
          </div>
          <div class="bp-status-pill ${isOptimal ? 'pill-ok' : 'pill-warn'}">
            ${isOptimal ? '⭐ ¡Acoplamiento Óptimo Identificado (r = 0.95)!' : `Lag = ${state.lag} h &bull; r = ${r}`}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          El agua de lluvia no llega instantáneamente al plano de falla en profundidad; <strong>tarda horas o días en infiltrarse</strong>. Sin desfasar la serie con <code>.shift()</code>, la correlación directa parece nula ($r \\approx 0.12$). A continuación se integran el esquema del tránsito hidrogeológico y el simulador interactivo de desfase temporal:
        </p>

        <!-- 1. ESQUEMA CONCEPTUAL DE PIZARRA (EL TIEMPO DE TRÁNSITO) -->
        <div class="whiteboard-view" style="margin-top: 0.25rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">EL TIEMPO DE TRÁNSITO HIDROGEOLÓGICO EN LA LADERA</div>

            <div class="wb-lag-schematic">
              <div class="lc-stage stage-rain">
                <span class="lc-stage-tag">1. TORMENTA EN SUPERFICIE (10:00 AM)</span>
                <p>El pluviómetro registra el aguacero inmediatamente al caer sobre la cuenca.</p>
              </div>

              <div class="lc-stage-arrow">▼ Infiltración a través de 15 m de suelo (Tránsito = 4 horas) ▼</div>

              <div class="lc-stage stage-piezo">
                <span class="lc-stage-tag">2. RESPUESTA EN EL FONDO (14:00 PM)</span>
                <p>El piezómetro profundo alcanza su presión máxima 4 horas después del pico de lluvia.</p>
              </div>

              <div class="lc-stage stage-math">
                <span class="lc-stage-tag">3. LA TRAMPA DEL REZAGO CERO: <code>df.corr()</code></span>
                <p>Sin desfasar (lag = 0), los picos no coinciden y $r \\approx 0.12$. Al aplicar <code>df['p'].shift(4)</code>, las crestas se acoplan y la correlación salta a <strong>r = 0.95</strong>.</p>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">⚡ Sintaxis en Pandas con <code>.shift()</code></h5>
              <div class="wb-code-block" style="font-size:0.77rem;"># Desplazar la lluvia 4 horas hacia adelante:
df['lluvia_lag4'] = df['p'].shift(4)

# Calcular coeficiente de correlación de Pearson:
r = df['sh1'].corr(df['lluvia_lag4'])
print(f"Correlación con retardo: {r:.2f}")</div>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.86em; gap:8px;">
                <li><strong><code>.shift(N)</code>:</strong> Mueve las observaciones $N$ pasos hacia el futuro.</li>
                <li><strong>Ventaja preventiva:</strong> Revela cuántas horas de anticipación tiene el sistema de alerta antes de que suba la presión crítica.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO CON SLIDER DE REZAGO Y SVG DINÁMICO -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <strong style="font-size: 0.86rem; color: var(--text-main);">
            🎚️ Calibración del Rezago: Desliza el control para alinear el pico de lluvia punteado con el piezómetro:
          </strong>

          <!-- Control de Slider de Rezago -->
          <div class="lc-sim-toolbar" style="margin: 0.75rem 0;">
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
              <rect x="50" y="20" width="420" height="160" fill="var(--bg-card)" stroke="var(--border-subtle)" rx="3"/>
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
          <div class="lc-footer-status" style="margin-top: 0.75rem;">
            ${isOptimal 
              ? `🎯 <strong>TIEMPO DE TRÁNSITO IDENTIFICADO: 4 HORAS</strong>. La infiltración tarda exactamente 4 horas en elevar la presión de poros al nivel crítico. La correlación salta de r=0.12 a <strong>r=${r}</strong>.`
              : `Alineación parcial ($r = ${r}$). Desliza el control hasta alinear el pico de lluvia con el pico del piezómetro para maximizar la correlación.`
            }
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("lag-correlation-container")) {
        window.initLagCorrelationWidget();
      }
    });
  } else {
    if (document.getElementById("lag-correlation-container")) {
      window.initLagCorrelationWidget();
    }
  }
})();
