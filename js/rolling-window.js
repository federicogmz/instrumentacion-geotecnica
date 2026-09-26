/**
 * rolling-window.js
 * Componente visual interactivo para la enseñanza de Ventanas Móviles (.rolling()) y Lluvia Antecedente.
 * Contexto Geotécnico: Saturación progresiva de laderas y cálculo de lluvia acumulada antecedente.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    windowSize: 5,     // Ventana móvil didáctica de 5 días
    currentDay: 7,     // Día activo (1 a 10)
  };

  const dailyRain = [0, 8, 15, 4, 32, 28, 12, 45, 10, 2]; // mm por día D1 a D10

  function computeRolling(w, dayIdx) {
    // dayIdx es 0-based
    if (dayIdx < w - 1) {
      return { val: null, slice: dailyRain.slice(0, dayIdx + 1), isNaN: true };
    }
    const slice = dailyRain.slice(dayIdx - w + 1, dayIdx + 1);
    const sum = slice.reduce((a, b) => a + b, 0);
    return { val: sum, slice, isNaN: false };
  }

  function renderWidget() {
    const container = document.getElementById("rolling-window-container");
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
            <span class="flow-badge">Módulo 3 &bull; Lección 3.2</span>
            <h4 class="flow-title">Ventana Móvil (<code>.rolling()</code>): Lluvia Antecedente Acumulada</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="rw-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="rw-mode-wb">
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
          <div class="wb-title-badge">CÓMO FUNCIONA EL LENTE DESLIZANTE TEMPORAL</div>

          <div class="wb-rolling-schematic">
            <!-- Calentamiento de la ventana -->
            <div class="rw-phase-box phase-warmup">
              <div class="rw-phase-tag">1. PERÍODO DE CALENTAMIENTO (Primeros N-1 días)</div>
              <div class="rw-phase-desc">
                Si la ventana es de 30 días (<code>window=30</code>), los días 1 al 29 <strong>no tienen suficientes datos previos</strong>.<br>
                Pandas les asigna automáticamente <code>NaN</code> por rigor matemático.
              </div>
            </div>

            <!-- Ventana activa -->
            <div class="rw-phase-box phase-active">
              <div class="rw-phase-tag">2. LA VENTANA ALCANZA TAMAÑO COMPLETO (Día N en adelante)</div>
              <div class="rw-phase-desc">
                En el día 30, la ventana suma $[t-29, t]$ y entrega su primer resultado numérico.<br>
                En el día 31, el lente avanza 1 paso: <strong>entra el día 31 y sale el día 1</strong>.
              </div>
            </div>

            <!-- Aplicación en Geotecnia -->
            <div class="rw-phase-box phase-geotech">
              <div class="rw-phase-tag">3. MODELOS DE UMBRALES DE DESLIZAMIENTO (SIATA / Chleborad)</div>
              <div class="rw-phase-desc">
                El agua infiltrada no desaparece de un día para otro. La <em>lluvia antecedente de 30 días ($A_{30}$)</em> mide la pérdida de succión matricial y la elevación de presiones de poros en el talud.
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-blue); margin-top:0;">⚡ Sintaxis en Pandas</h5>
            <div class="wb-code-block">
# Ventana móvil de 30 días sumada
df['lluvia_ant_30d'] = (
    df['lluvia_mm']
    .rolling(window=30)
    .sum()
)</div>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:8px;">
              <li><strong><code>.rolling(30)</code>:</strong> Define la anchura del lente deslizante temporal.</li>
              <li><strong><code>.sum()</code>:</strong> Agrega los valores dentro de la ventana (para lluvia acumulada).</li>
              <li><strong><code>.mean()</code>:</strong> Promedia los valores (para temperatura o nivel piezométrico suavizado).</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const w = state.windowSize;
    const currentIdx = state.currentDay - 1;
    const res = computeRolling(w, currentIdx);

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Barra de Control del Deslizador de Fecha -->
        <div class="rw-sim-toolbar">
          <div class="rw-slider-box">
            <div class="slider-header-row">
              <label>Día de Evaluación (Fecha Activa $t$):</label>
              <strong class="slider-val-badge">Día D${state.currentDay}</strong>
            </div>
            <input type="range" min="1" max="10" step="1" value="${state.currentDay}" id="slider-rw-day" class="flow-slider">
          </div>

          <div class="rw-window-badge">
            Ventana Móvil: <strong>${w} días</strong> (<code>window=${w}</code>)
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
        <div class="rw-result-grid">
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
            <pre class="trace-pre"><code><span class="tok-comment"># En la fila D${state.currentDay}:</span>
df[<span class="tok-str">'lluvia_ant_${w}d'</span>].loc[<span class="tok-str">'D${state.currentDay}'</span>] ➔ <span class="tok-live-comment">${res.isNaN ? 'np.nan' : res.val + ' mm acumulados'}</span></code></pre>
          </div>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("rw-mode-sim");
    const btnWb = document.getElementById("rw-mode-wb");

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

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("rolling-window-container")) {
      window.initRollingWindowWidget();
    }
  });
})();
