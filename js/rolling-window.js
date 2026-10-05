/**
 * rolling-window.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.2.
 * Ventanas Móviles (.rolling()) y Cálculo de Lluvia Antecedente en Geotecnia.
 * 
 * Integra en un único lienzo:
 * 1. Esquema conceptual de pizarra: Las 3 fases del lente deslizante (calentamiento con NaN, ventana activa y umbrales Chleborad).
 * 2. Cinta interactiva de días con ventana móvil visual translúcida.
 * 3. Deslizador temporal para experimentar el avance de la ventana y el cálculo en vivo.
 */

(function () {
  let state = {
    windowSize: 3,  // Ventana de 3 días para ilustración compacta
    currentDay: 4,  // Día seleccionado en el slider (1 a 10)
  };

  const dailyRain = [0, 12, 45, 28, 5, 0, 18, 35, 8, 2]; // Lluvia en mm por día

  function computeRolling(w, dayIdx) {
    if (dayIdx < w - 1) {
      return { isNaN: true, val: null, slice: [] };
    }
    const slice = dailyRain.slice(dayIdx - w + 1, dayIdx + 1);
    const sum = slice.reduce((a, b) => a + b, 0);
    return { isNaN: false, val: sum, slice };
  }

  function renderWidget() {
    const container = document.getElementById("rolling-window-container");
    if (!container) return;

    const w = state.windowSize;
    const currentIdx = state.currentDay - 1;
    const res = computeRolling(w, currentIdx);

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.2 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">⏳ Ventana Móvil (<code>.rolling()</code>): Lluvia Antecedente Acumulada</h4>
          </div>
          <div class="bp-status-pill ${res.isNaN ? 'pill-warn' : 'pill-ok'}">
            ${res.isNaN ? `⏳ D${state.currentDay}: Período de Calentamiento (NaN)` : `✓ D${state.currentDay}: Lluvia Acumulada = ${res.val} mm`}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          El método <code>.rolling(window=N)</code> desliza un lente temporal sobre la serie. <strong>Los primeros $N-1$ días resultan en <code>NaN</code></strong> porque no disponen del historial previo suficiente para llenar la ventana. A continuación se integran el esquema conceptual del mecanismo y el simulador interactivo de arrastre:
        </p>

        <!-- 1. ESQUEMA CONCEPTUAL DE PIZARRA (EL LENTE DESLIZANTE) -->
        <div class="whiteboard-view" style="margin-top: 0.25rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">CÓMO FUNCIONA EL LENTE DESLIZANTE TEMPORAL</div>

            <div class="wb-rolling-schematic">
              <!-- Calentamiento de la ventana -->
              <div class="rw-phase-box phase-warmup">
                <div class="rw-phase-tag">1. PERÍODO DE CALENTAMIENTO (Primeros N-1 días)</div>
                <div class="rw-phase-desc">
                  Si la ventana es de 3 días (<code>window=3</code>), los días 1 y 2 <strong>no tienen suficientes datos previos</strong>.<br>
                  Pandas les asigna automáticamente <code>NaN</code> por rigor matemático.
                </div>
              </div>

              <!-- Ventana activa -->
              <div class="rw-phase-box phase-active">
                <div class="rw-phase-tag">2. LA VENTANA ALCANZA TAMAÑO COMPLETO (Día N en adelante)</div>
                <div class="rw-phase-desc">
                  En el día 3, la ventana suma $[t-2, t]$ y entrega su primer resultado.<br>
                  En el día 4, el lente avanza 1 paso: <strong>entra el día 4 y sale el día 1</strong>.
                </div>
              </div>

              <!-- Aplicación en Geotecnia -->
              <div class="rw-phase-box phase-geotech">
                <div class="rw-phase-tag">3. MODELOS DE UMBRALES DE DESLIZAMIENTO (Chleborad / SIATA)</div>
                <div class="rw-phase-desc">
                  El agua infiltrada no desaparece de inmediato. La <em>lluvia acumulada de 30 días ($A_{30}$)</em> cuantifica la pérdida de succión matricial y la elevación de presiones de poros en el talud.
                </div>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">⚡ Sintaxis en Pandas</h5>
              <div class="wb-code-block" style="font-size:0.77rem;"># Lluvia antecedente de 30 días acumulada:
df['lluvia_ant_30d'] = (
    df['p']
    .rolling(window=30)
    .sum()
)</div>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.86em; gap:8px;">
                <li><strong><code>.rolling(30)</code>:</strong> Define el ancho del lente temporal.</li>
                <li><strong><code>.sum()</code>:</strong> Agrega los milímetros (acumulado hidrológico).</li>
                <li><strong><code>.mean()</code>:</strong> Promedia valores (suavizado de ruido).</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO CON CINTA TEMPORAL DINÁMICA -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <strong style="font-size: 0.86rem; color: var(--text-main);">
            🎞️ Simulador del Lente Temporal en Movimiento (Mueve el deslizador para avanzar los días):
          </strong>

          <!-- Barra de Control del Deslizador de Fecha -->
          <div class="rw-sim-toolbar" style="margin: 0.75rem 0;">
            <div class="rw-slider-box">
              <div class="slider-header-row">
                <label>Día de Evaluación (Fecha Activa $t$):</label>
                <strong class="slider-val-badge">Día D${state.currentDay}</strong>
              </div>
              <input type="range" min="1" max="10" step="1" value="${state.currentDay}" id="slider-rw-day" class="flow-slider">
            </div>

            <div class="rw-window-badge">
              Tamaño del Lente: <strong>${w} días</strong> (<code>window=${w}</code>)
            </div>
          </div>

          <!-- Visualizador de la Cinta de Días con la Ventana Translúcida -->
          <div class="rw-track-container">
            <div class="rw-track">
              ${dailyRain.map((r, i) => {
                const inWindow = i >= (currentIdx - w + 1) && i <= currentIdx;
                const isTargetDay = i === currentIdx;

                let cellClass = "rw-day-cell";
                if (inWindow) cellClass += " in-window";
                if (isTargetDay) cellClass += " target-day";

                return `
                  <div class="${cellClass}">
                    <span class="rw-day-id">D${i + 1}</span>
                    <span class="rw-day-rain">${r} <small>mm</small></span>
                    ${isTargetDay ? '<span class="rw-day-pin">▼ t</span>' : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Resultado Acumulado e Interpretación Geotécnica -->
          <div class="rw-result-grid" style="margin-top: 0.75rem;">
            <div class="rw-result-card ${res.isNaN ? 'is-nan' : 'is-val'}">
              <div class="rw-res-header">
                <span>Lluvia Acumulada en la Ventana de ${w} Días:</span>
                <span class="rw-calc-desc">
                  ${res.isNaN 
                    ? `(Faltan ${w - state.currentDay} días para completar la ventana de ${w})` 
                    : `Días [D${state.currentDay - w + 1} a D${state.currentDay}]: ${res.slice.join(' + ')}`
                  }
                </span>
              </div>
              <div class="rw-res-val">
                ${res.isNaN 
                  ? 'NaN <small style="font-size:0.8rem; font-weight:500;">(Período de Calentamiento)</small>' 
                  : `${res.val} <small>mm</small>`
                }
              </div>
            </div>

            <!-- Código Pandas Dinámico -->
            <div class="rw-code-box">
              <pre class="trace-pre"><code><span class="tok-comment"># En la fila del día D${state.currentDay}:</span>
df[<span class="tok-str">'lluvia_ant_${w}d'</span>].loc[<span class="tok-str">'D${state.currentDay}'</span>] ➔ <span class="tok-live-comment">${res.isNaN ? 'np.nan (Incompleto)' : res.val + ' mm acumulados'}</span></code></pre>
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const slider = document.getElementById("slider-rw-day");
    if (slider) {
      slider.addEventListener("input", (e) => {
        state.currentDay = parseInt(e.target.value, 10);
        renderWidget();
      });
    }
  }

  window.initRollingWindowWidget = function () {
    renderWidget();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("rolling-window-container")) {
        window.initRollingWindowWidget();
      }
    });
  } else {
    if (document.getElementById("rolling-window-container")) {
      window.initRollingWindowWidget();
    }
  }
})();
