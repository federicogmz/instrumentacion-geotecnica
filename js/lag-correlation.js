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

  // Datos reales de Ancón Norte (df_coactivo desde 2020-03-24, sh1 vs p.shift(lag))
  const anconLags = [
    -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  ];
  const anconCorrs = [
    0.0768, 0.0956, 0.1286, 0.1428, 0.1343, 0.1303, 0.1287, 0.1429, 0.1542, 0.1638,
    0.1844, 0.1943, 0.1884, 0.1989, 0.2590, 0.3065, 0.3076, 0.2713, 0.2582, 0.2385,
    0.2090, 0.1855, 0.1648, 0.1374, 0.1190, 0.1338, 0.1263, 0.1251, 0.1228
  ];
  const mejorLagAncon = 2;
  const maxRAncon = 0.308;

  function buildAnconCorrelogramSvg() {
    const W = 760, H = 330;
    const padL = 68, padR = 24, padT = 38, padB = 54;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    const minX = -15.2, maxX = 15.2;
    const minY = -0.02, maxY = 0.335;

    const xPos = (lag) => padL + ((lag - minX) / (maxX - minX)) * plotW;
    const yPos = (r) => padT + plotH - ((r - minY) / (maxY - minY)) * plotH;

    const xTicks = [-14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14];
    const yTicks = [0.00, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30];

    const polyPoints = anconLags
      .map((lag, idx) => `${xPos(lag).toFixed(1)},${yPos(anconCorrs[idx]).toFixed(1)}`)
      .join(" ");

    const zeroY = yPos(0).toFixed(1);
    const bestX = xPos(mejorLagAncon).toFixed(1);

    return `
      <svg viewBox="0 0 ${W} ${H}" class="lc-svg" style="width:100%; height:auto; display:block;">
        <!-- Fondo del área de trazado -->
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="var(--bg-card)" stroke="var(--border-subtle)" stroke-width="1.2" rx="2"/>

        <!-- Título del gráfico -->
        <text x="${padL + plotW / 2}" y="24" text-anchor="middle" fill="var(--text-main)" font-size="13.5" font-weight="700">
          Correlación Rezagada: Precipitación vs. Humedad del Suelo
        </text>

        <!-- Cuadrícula vertical y etiquetas X -->
        ${xTicks.map((t) => {
          const x = xPos(t).toFixed(1);
          return `
            <line x1="${x}" y1="${padT}" x2="${x}" y2="${padT + plotH}" stroke="rgba(148, 163, 184, 0.25)" stroke-width="1" />
            <line x1="${x}" y1="${padT + plotH}" x2="${x}" y2="${padT + plotH + 5}" stroke="var(--text-muted)" stroke-width="1" />
            <text x="${x}" y="${padT + plotH + 18}" text-anchor="middle" fill="var(--text-muted)" font-size="10.5">${t}</text>
          `;
        }).join("")}

        <!-- Cuadrícula horizontal y etiquetas Y -->
        ${yTicks.map((t) => {
          const y = yPos(t).toFixed(1);
          return `
            <line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" stroke="rgba(148, 163, 184, 0.25)" stroke-width="1" />
            <line x1="${padL - 5}" y1="${y}" x2="${padL}" y2="${y}" stroke="var(--text-muted)" stroke-width="1" />
            <text x="${padL - 9}" y="${parseFloat(y) + 3.5}" text-anchor="end" fill="var(--text-muted)" font-size="10.5">${t.toFixed(2)}</text>
          `;
        }).join("")}

        <!-- plt.axhline(0, color='gray', linestyle=':') -->
        <line x1="${padL}" y1="${zeroY}" x2="${padL + plotW}" y2="${zeroY}" stroke="#808080" stroke-width="1.5" stroke-dasharray="2,3" />

        <!-- plt.axvline(mejor_lag, color='red', linestyle='--') -->
        <line x1="${bestX}" y1="${padT}" x2="${bestX}" y2="${padT + plotH}" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="6,4" />

        <!-- Curva principal: color='teal', linewidth=1.5 -->
        <polyline fill="none" stroke="#008080" stroke-width="2" points="${polyPoints}" />

        <!-- Marcadores: marker='o', color='teal' -->
        ${anconLags.map((lag, idx) => {
          const cx = xPos(lag).toFixed(1);
          const cy = yPos(anconCorrs[idx]).toFixed(1);
          const isBest = lag === mejorLagAncon;
          return `
            <circle cx="${cx}" cy="${cy}" r="${isBest ? 5 : 3.8}" fill="#008080" stroke="${isBest ? '#ef4444' : 'none'}" stroke-width="${isBest ? '1.8' : '0'}">
              <title>Lag = ${lag} días | r = ${anconCorrs[idx].toFixed(3)}</title>
            </circle>
          `;
        }).join("")}

        <!-- Leyenda estilo Matplotlib -->
        <g transform="translate(${padL + 12}, ${padT + 10})">
          <rect x="0" y="0" width="305" height="26" rx="4" fill="var(--bg-card)" stroke="var(--border-subtle)" stroke-width="1" opacity="0.94" />
          <line x1="10" y1="13" x2="34" y2="13" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,3" />
          <text x="42" y="17" fill="var(--text-main)" font-size="11" font-weight="600">
            Máxima correlación: r=${maxRAncon.toFixed(3)} en lag=${mejorLagAncon} días
          </text>
        </g>

        <!-- Etiqueta Eje X -->
        <text x="${padL + plotW / 2}" y="${H - 12}" text-anchor="middle" fill="var(--text-main)" font-size="11.5" font-weight="600">
          Desfase temporal [Lag en días] (Lluvia retrasada respecto a Humedad)
        </text>

        <!-- Etiqueta Eje Y -->
        <text transform="translate(18, ${padT + plotH / 2}) rotate(-90)" text-anchor="middle" fill="var(--text-main)" font-size="11.5" font-weight="600">
          Coeficiente de Correlación (r)
        </text>
      </svg>
    `;
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
            <span class="flow-badge">Módulo 3 &bull; Lección 3.7 &bull; Pizarra Conceptual &amp; Correlograma Real</span>
            <h4 class="flow-title">⏱️ Correlación Rezagada (<code>.shift()</code>): Retardo Hidrogeológico</h4>
          </div>
          <div class="bp-status-pill ${isOptimal ? 'pill-ok' : 'pill-warn'}">
            ${isOptimal ? '⭐ ¡Acoplamiento Óptimo Identificado!' : `Simulador: Lag = ${state.lag} h &bull; r = ${r}`}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          El agua de lluvia no llega instantáneamente al plano de falla en profundidad; <strong>tarda horas o días en infiltrarse</strong>. Sin desfasar la serie con <code>.shift()</code>, la correlación directa es baja. A continuación se integran el esquema conceptual de alineación y el <strong>correlograma real de Ancón Norte (-14 a +14 días)</strong>:
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

              <div class="lc-stage-arrow">▼ Infiltración a través del perfil de suelo ▼</div>

              <div class="lc-stage stage-piezo">
                <span class="lc-stage-tag">2. RESPUESTA EN PROFUNDIDAD</span>
                <p>La sonda de humedad o piezómetro alcanza su pico horas o días después del aguacero.</p>
              </div>

              <div class="lc-stage stage-math">
                <span class="lc-stage-tag">3. LA TRAMPA DEL REZAGO CERO: <code>df.corr()</code></span>
                <p>Sin desfasar (<code>lag = 0</code>), los picos no coinciden. Al aplicar <code>df['p'].shift(lag)</code>, las crestas se acoplan y revelan el tiempo real de infiltración.</p>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">⚡ Sintaxis en Pandas con <code>.shift()</code></h5>
              <div class="wb-code-block" style="font-size:0.77rem;"># Evaluar retardos de -14 a +14 días:
lags = range(-14, 15)
correlaciones_lag = [
    df_coactivo['sh1'].corr(df_coactivo['p'].shift(lag))
    for lag in lags
]</div>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.86em; gap:8px;">
                <li><strong><code>.shift(lag)</code>:</strong> Desplaza la lluvia <code>lag</code> días respecto a la humedad.</li>
                <li><strong>Ventaja preventiva:</strong> El pico máximo (<code>r<sub>máx</sub></code>) indica cuántos días de anticipación ofrece el monitoreo.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR CONCEPTUAL CON SLIDER DE REZAGO -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <strong style="font-size: 0.86rem; color: var(--text-main);">
            🎚️ 1. Simulador Conceptual: Desliza el control para alinear el pulso de lluvia con la respuesta del sensor:
          </strong>

          <!-- Control de Slider de Rezago -->
          <div class="lc-sim-toolbar" style="margin: 0.75rem 0;">
            <div class="lc-slider-box">
              <div class="slider-header-row">
                <label>Rezago Temporal de Lluvia (<code>shift(lag)</code>):</label>
                <strong class="slider-val-badge">lag = ${state.lag} h</strong>
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
              <text x="60" y="38" fill="#f43f5e" font-size="11" font-weight="700">― Respuesta del Suelo (Pico a las 14:00)</text>
              <text x="275" y="38" fill="#38bdf8" font-size="11" font-weight="700">- - Lluvia desfasada (shift = ${state.lag})</text>
            </svg>
          </div>
        </div>

        <!-- 3. GRÁFICA REAL DE ANCÓN NORTE (-14 A +14 DÍAS) Y CÓDIGO COMPLETO -->
        <div class="simulator-view" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <strong style="font-size: 0.9rem; color: var(--text-main); display:block; margin-bottom: 0.5rem;">
            📈 2. Resultado Real en Ancón Norte: Precipitación (<code>p</code>) vs. Humedad del Suelo (<code>sh1</code>) [-14 a +14 días]
          </strong>
          <p style="margin: 0 0 0.75rem 0; font-size: 0.84rem; color: var(--text-muted);">
            Al evaluar los 29 desfases diarios sobre el periodo coactivo de Ancón Norte (<code>df_coactivo</code>), la correlación de Pearson pasa de <code>r = 0.259</code> en <code>lag = 0</code> a su máximo en <strong><code>lag = 2 días</code> (<code>r = 0.308</code>)</strong>:
          </p>

          <!-- Gráfica SVG del Correlograma de Ancón Norte -->
          <div class="lc-graph-card" style="padding: 0.65rem;">
            ${buildAnconCorrelogramSvg()}
          </div>

          <!-- Salida de Consola -->
          <div class="lc-footer-status" style="margin-top: 0.65rem; font-family: var(--font-mono, monospace); font-size: 0.84rem;">
            📌 Resultado: La máxima correlación ocurre en un lag de <strong>2 días</strong> (<strong>r = 0.308</strong>).
          </div>

          <!-- Código Python completo -->
          <div class="tb-code-footer" style="margin-top: 0.75rem;">
            <pre class="trace-pre"><code><span class="tok-kw">import</span> numpy <span class="tok-kw">as</span> np
<span class="tok-kw">import</span> matplotlib.pyplot <span class="tok-kw">as</span> plt

<span class="tok-comment"># Asegurar periodo coactivo continuo desde '2020-03-24'</span>
df_coactivo = df_ancon.loc[<span class="tok-str">'2020-03-24'</span>:].copy().interpolate(method=<span class="tok-str">'linear'</span>).bfill().ffill()

<span class="tok-comment"># Rango de desfase temporal: de -14 a +14 días</span>
lags = range(-14, 15)
correlaciones_lag = [df_coactivo[<span class="tok-str">'sh1'</span>].corr(df_coactivo[<span class="tok-str">'p'</span>].shift(lag)) <span class="tok-kw">for</span> lag <span class="tok-kw">in</span> lags]

<span class="tok-comment"># Identificar el desfase de máxima correlación</span>
max_idx = np.argmax(correlaciones_lag)
mejor_lag = list(lags)[max_idx]
max_r = correlaciones_lag[max_idx]

plt.figure(figsize=(9, 4))
plt.plot(lags, correlaciones_lag, marker=<span class="tok-str">'o'</span>, color=<span class="tok-str">'teal'</span>, linewidth=1.5)
plt.axvline(mejor_lag, color=<span class="tok-str">'red'</span>, linestyle=<span class="tok-str">'--'</span>, label=<span class="tok-str">f'Máxima correlación: r={max_r:.3f} en lag={mejor_lag} días'</span>)
plt.axhline(0, color=<span class="tok-str">'gray'</span>, linestyle=<span class="tok-str">':'</span>)
plt.title(<span class="tok-str">'Correlación Rezagada: Precipitación vs. Humedad del Suelo'</span>, fontweight=<span class="tok-str">'bold'</span>)
plt.xlabel(<span class="tok-str">'Desfase temporal [Lag en días] (Lluvia retrasada respecto a Humedad)'</span>)
plt.ylabel(<span class="tok-str">'Coeficiente de Correlación (r)'</span>)
plt.legend()
plt.grid(<span class="tok-kw">True</span>, alpha=0.5)
plt.tight_layout()
plt.show()

print(<span class="tok-str">f"📌 Resultado: La máxima correlación ocurre en un lag de {mejor_lag} días (r = {max_r:.3f})."</span>)</code></pre>
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
