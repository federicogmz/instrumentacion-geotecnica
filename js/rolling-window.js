/**
 * rolling-window.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.3.
 * Ventanas Móviles (.rolling()) vs. Acumulado Histórico (.cumsum()) en Geotecnia.
 *
 * Integra en un único lienzo:
 * 1. Pizarra conceptual: Diferencia física y matemática entre .cumsum() (memoria infinita)
 *    y .rolling(window=k).sum() (memoria finita con drenaje), más el efecto de min_periods=1.
 * 2. Simulador interactivo con controles de ancho de ventana (3, 5, 7 días), modo de
 *    calentamiento (min_periods=1 vs NaN), riel clicable de 10 días y gráfico SVG sincronizado
 *    que contrasta en vivo el hietograma diario, la ventana móvil y la curva acumulada .cumsum().
 */

(function () {
  let state = {
    windowSize: 3,    // Ancho de ventana k: 3, 5 o 7 días
    currentDay: 4,    // Día activo t (1 a 10)
    minPeriodsOne: false, // false = estricto (NaN en primeros k-1 días), true = min_periods=1
  };

  const dailyRain = [0, 12, 45, 28, 5, 0, 18, 35, 8, 2]; // mm por día (D1 a D10)
  const maxDaily = Math.max(...dailyRain); // 45 mm

  // Serie completa de acumulado histórico .cumsum()
  const cumsumSeries = [];
  dailyRain.reduce((acc, val, i) => {
    const next = acc + val;
    cumsumSeries[i] = next;
    return next;
  }, 0);
  const maxTotal = cumsumSeries[cumsumSeries.length - 1]; // 153 mm

  function computeDayMetrics(w, dayIdx, minPeriodsOne) {
    const startIdx = Math.max(0, dayIdx - w + 1);
    const slice = dailyRain.slice(startIdx, dayIdx + 1);
    const partialSum = slice.reduce((a, b) => a + b, 0);
    const isWarmup = dayIdx < w - 1;
    const isNaNResult = isWarmup && !minPeriodsOne;

    const cumSlice = dailyRain.slice(0, dayIdx + 1);
    const cumVal = cumsumSeries[dayIdx];

    return {
      isWarmup,
      isNaN: isNaNResult,
      val: isNaNResult ? null : partialSum,
      partialSum,
      startIdx,
      endIdx: dayIdx,
      slice,
      cumVal,
      cumSlice,
    };
  }

  function computeFullRollingSeries(w, minPeriodsOne) {
    return dailyRain.map((_, idx) => computeDayMetrics(w, idx, minPeriodsOne));
  }

  function buildComparisonSvg(w, currentIdx, minPeriodsOne) {
    const width = 760;
    const height = 225;
    const padL = 46;
    const padR = 24;
    const padT = 24;
    const padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const n = dailyRain.length;
    const stepX = plotW / n;

    const yMax = 160; // Escala común en mm (máx cumsum = 153 mm)
    const xAt = (i) => padL + stepX * i + stepX / 2;
    const yAt = (val) => padT + plotH - (Math.min(yMax, Math.max(0, val)) / yMax) * plotH;

    const rollingSeries = computeFullRollingSeries(w, minPeriodsOne);

    // Sombreado de la ventana activa [startIdx .. currentIdx]
    const winStartIdx = Math.max(0, currentIdx - w + 1);
    const winX1 = padL + winStartIdx * stepX + 3;
    const winX2 = padL + (currentIdx + 1) * stepX - 3;
    const winW = Math.max(0, winX2 - winX1);

    // Grilla horizontal
    const yTicks = [0, 40, 80, 120, 160];
    const gridLines = yTicks
      .map((yv) => {
        const y = yAt(yv).toFixed(1);
        return `
          <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="rgba(148,163,184,0.18)" stroke-dasharray="3,3" />
          <text x="${padL - 7}" y="${(parseFloat(y) + 3.5).toFixed(1)}" text-anchor="end" font-size="10" fill="#94a3b8" font-family="monospace">${yv}</text>
        `;
      })
      .join("");

    // Barras de lluvia diaria p(t)
    const barW = Math.min(28, stepX * 0.44);
    const barsSvg = dailyRain
      .map((r, i) => {
        const cx = xAt(i);
        const by = yAt(r);
        const bh = Math.max(1.5, padT + plotH - by);
        const inWin = i >= winStartIdx && i <= currentIdx;
        const isTarget = i === currentIdx;
        const fill = isTarget
          ? "#0ea5e9"
          : inWin
          ? "rgba(56, 189, 248, 0.72)"
          : "rgba(148, 163, 184, 0.32)";
        return `
          <rect x="${(cx - barW / 2).toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}"
                rx="3" fill="${fill}" />
          ${
            r > 0
              ? `<text x="${cx.toFixed(1)}" y="${(by - 4).toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#64748b">${r}</text>`
              : ""
          }
        `;
      })
      .join("");

    // Curva de acumulado histórico .cumsum() (Escalera / línea continua violeta)
    const cumPoints = cumsumSeries
      .map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`)
      .join(" ");
    const cumDots = cumsumSeries
      .map((v, i) => {
        const cx = xAt(i).toFixed(1);
        const cy = yAt(v).toFixed(1);
        const r = i === currentIdx ? 5.5 : 3.2;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#8b5cf6" stroke="#ffffff" stroke-width="${i === currentIdx ? 2 : 1}" />`;
      })
      .join("");

    // Curva de ventana móvil .rolling(w).sum() (Verde esmeralda)
    const validRollingPts = rollingSeries
      .map((item, i) => (item.isNaN ? null : `${xAt(i).toFixed(1)},${yAt(item.val).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");

    const rollingDots = rollingSeries
      .map((item, i) => {
        const cx = xAt(i).toFixed(1);
        if (item.isNaN) {
          const cy = yAt(0).toFixed(1);
          return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />`;
        }
        const cy = yAt(item.val).toFixed(1);
        const r = i === currentIdx ? 6 : 3.6;
        return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#10b981" stroke="#ffffff" stroke-width="${i === currentIdx ? 2 : 1.2}" />`;
      })
      .join("");

    // Eje X y zonas clicables por día
    const xLabelsAndHitboxes = dailyRain
      .map((_, i) => {
        const cx = xAt(i);
        const isTarget = i === currentIdx;
        return `
          <text x="${cx.toFixed(1)}" y="${height - 10}" text-anchor="middle"
                font-size="11" font-weight="${isTarget ? "800" : "600"}"
                fill="${isTarget ? "#10b981" : "#64748b"}">D${i + 1}</text>
          <rect x="${(padL + i * stepX).toFixed(1)}" y="${padT}" width="${stepX.toFixed(1)}" height="${plotH + 22}"
                fill="transparent" class="rw-svg-day-hit" data-day="${i + 1}" style="cursor:pointer;" />
        `;
      })
      .join("");

    const activeX = xAt(currentIdx).toFixed(1);

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:auto; display:block; overflow:visible;">
        <!-- Leyenda superior integrada -->
        <g transform="translate(${padL}, 13)" font-size="10.5" font-weight="700">
          <rect x="0" y="-8" width="10" height="10" rx="2" fill="#38bdf8" />
          <text x="14" y="0" fill="#64748b">Lluvia diaria p(t)</text>

          <line x1="128" y1="-3" x2="146" y2="-3" stroke="#10b981" stroke-width="2.8" />
          <circle cx="137" cy="-3" r="3.5" fill="#10b981" />
          <text x="151" y="0" fill="#10b981">.rolling(${w}).sum() (Sube y drena)</text>

          <line x1="358" y1="-3" x2="376" y2="-3" stroke="#8b5cf6" stroke-width="2.4" stroke-dasharray="4,2" />
          <circle cx="367" cy="-3" r="3.5" fill="#8b5cf6" />
          <text x="381" y="0" fill="#8b5cf6">.cumsum() (Acumulado histórico D1..Dt)</text>
        </g>

        ${gridLines}

        <!-- Banda translúcida del Lente Móvil Activo -->
        <rect x="${winX1.toFixed(1)}" y="${padT}" width="${winW.toFixed(1)}" height="${plotH}"
              rx="6" fill="rgba(16, 185, 129, 0.10)" stroke="rgba(16, 185, 129, 0.45)" stroke-dasharray="4,3" />
        <text x="${(winX1 + winW / 2).toFixed(1)}" y="${padT + 13}" text-anchor="middle"
              font-size="9.5" font-weight="800" fill="#10b981">
          Lente window=${w} (D${winStartIdx + 1}..D${currentIdx + 1})
        </text>

        <!-- Línea vertical del día activo t -->
        <line x1="${activeX}" y1="${padT}" x2="${activeX}" y2="${padT + plotH}"
              stroke="#10b981" stroke-width="1.5" stroke-dasharray="2,2" />

        ${barsSvg}

        <!-- Curva .cumsum() -->
        <polyline fill="none" stroke="#8b5cf6" stroke-width="2.3" stroke-dasharray="5,3" points="${cumPoints}" />
        ${cumDots}

        <!-- Curva .rolling().sum() -->
        ${
          validRollingPts
            ? `<polyline fill="none" stroke="#10b981" stroke-width="3" points="${validRollingPts}" />`
            : ""
        }
        ${rollingDots}

        <!-- Línea base eje X -->
        <line x1="${padL}" y1="${padT + plotH}" x2="${width - padR}" y2="${padT + plotH}" stroke="rgba(148,163,184,0.45)" stroke-width="1.2" />
        <text x="12" y="${padT + plotH / 2}" transform="rotate(-90 12 ${padT + plotH / 2})"
              text-anchor="middle" font-size="10" font-weight="700" fill="#94a3b8">Lluvia (mm)</text>

        ${xLabelsAndHitboxes}
      </svg>
    `;
  }

  function renderWidget() {
    const container = document.getElementById("rolling-window-container");
    if (!container) return;

    const w = state.windowSize;
    const currentIdx = state.currentDay - 1;
    const res = computeDayMetrics(w, currentIdx, state.minPeriodsOne);

    const minPeriodsArg = state.minPeriodsOne ? ", min_periods=1" : "";

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.3 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">⏳ Ventana Móvil (<code>.rolling()</code>) vs. Acumulado Total (<code>.cumsum()</code>)</h4>
          </div>
          <div class="bp-status-pill ${res.isNaN ? "pill-warn" : "pill-ok"}">
            ${
              res.isNaN
                ? `⏳ D${state.currentDay}: Calentamiento (rolling = NaN | cumsum = ${res.cumVal} mm)`
                : `✓ D${state.currentDay}: Ventana ${w}d = ${res.val} mm | Acumulado Total = ${res.cumVal} mm`
            }
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          En hidrogeotecnia necesitamos distinguir entre <strong>cuánta agua ha entrado en total desde el inicio del monitoreo</strong> (<code>.cumsum()</code>) y <strong>cuánta agua permanece activa en los poros durante los últimos $k$ días</strong> (<code>.rolling(window=k).sum()</code>):
        </p>

        <!-- 1. ESQUEMA CONCEPTUAL DE PIZARRA -->
        <div class="whiteboard-view" style="margin-top: 0.35rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">MEMORIA FINITA (.ROLLING) VS. MEMORIA INFINITA (.CUMSUM)</div>

            <div class="wb-rolling-schematic">
              <div class="rw-phase-box phase-geotech">
                <div class="rw-phase-tag">1. ACUMULADO HISTÓRICO TOTAL: <code>df['p'].cumsum()</code> (Memoria Infinita)</div>
                <div class="rw-phase-desc">
                  Suma todos los días desde el inicio $D_1$ hasta la fecha actual $t$: $\\text{CumSum}(t) = \\sum_{i=1}^{t} p_i$.<br>
                  Genera una <strong>curva escalonada monótonamente creciente</strong> que nunca baja. Ideal para medir la lluvia total de la campaña o el desplazamiento acumulado total.
                </div>
              </div>

              <div class="rw-phase-box phase-active">
                <div class="rw-phase-tag">2. VENTANA MÓVIL ANTECEDENTE: <code>df['p'].rolling(window=k).sum()</code> (Memoria Finita)</div>
                <div class="rw-phase-desc">
                  Suma únicamente los últimos $k$ días $[t-k+1,\\, t]$. Cuando avanza un día, <strong>entra el día nuevo y sale el día $t-k$</strong>.<br>
                  La curva <strong>sube con las tormentas y desciende en días secos</strong>, modelando la saturación y el drenaje natural del talud.
                </div>
              </div>

              <div class="rw-phase-box phase-warmup">
                <div class="rw-phase-tag">3. PERÍODO DE CALENTAMIENTO (Primeros $k-1$ días) Y <code>min_periods=1</code></div>
                <div class="rw-phase-desc">
                  Por defecto, los primeros $k-1$ días devuelven <code>NaN</code> porque aún no completan $k$ registros previos.<br>
                  Añadiendo <code>min_periods=1</code>, Pandas calcula la suma parcial disponible desde el primer día sin dejar huecos <code>NaN</code>.
                </div>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">⚡ Sintaxis Comparada en Pandas</h5>
              <div class="wb-code-block" style="font-size:0.75rem;"># 1. Lluvia acumulada histórica (escalera):
df['lluvia_acum'] = df['p'].cumsum()

# 2. Lluvia antecedente móvil de 30 días:
df['lluvia_30d'] = (
    df['p']
    .rolling(window=30, min_periods=1)
    .sum()
)</div>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.84em; gap:6px;">
                <li><strong><code>.cumsum()</code>:</strong> No olvida ningún evento pasado; mide el aporte total acumulado.</li>
                <li><strong><code>.rolling(30).sum()</code>:</strong> Cuantifica la lluvia antecedente reciente ($A_{30}$) que controla la presión de poros actual.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.65rem;">
            <strong style="font-size: 0.88rem; color: var(--text-main);">
              🎞️ Laboratorio del Lente Temporal (Haz clic en cualquier día D1–D10 o usa los controles):
            </strong>
            <span style="font-size: 0.76rem; color: var(--text-muted);">
              Observa cómo en días secos (D5–D6) la ventana móvil desciende mientras <code>.cumsum()</code> sigue en ascenso
            </span>
          </div>

          <!-- Barra de Controles Rediseñada -->
          <div class="rw-sim-toolbar">
            <!-- Control de Día t -->
            <div class="rw-slider-box">
              <div class="slider-header-row" style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; margin-bottom:6px;">
                <span style="font-size:0.78rem; font-weight:700; color:var(--text-main);">
                  Día de Evaluación ($t$): <strong style="color:#10b981;">Día D${state.currentDay}</strong> (${dailyRain[currentIdx]} mm hoy)
                </span>
                <div style="display:inline-flex; gap:4px;">
                  <button type="button" id="btn-rw-prev" class="rw-step-btn" ${state.currentDay <= 1 ? "disabled" : ""}>◀ Anterior</button>
                  <button type="button" id="btn-rw-next" class="rw-step-btn" ${state.currentDay >= 10 ? "disabled" : ""}>Siguiente ▶</button>
                </div>
              </div>
              <input type="range" min="1" max="10" step="1" value="${state.currentDay}" id="slider-rw-day" class="flow-slider" style="width:100%;">
            </div>

            <!-- Selector de Tamaño de Ventana (window=k) -->
            <div class="rw-control-group">
              <span class="rw-ctrl-label">Tamaño de Ventana (<code>window</code>):</span>
              <div class="rw-pill-group">
                ${[3, 5, 7]
                  .map(
                    (k) => `
                  <button type="button" class="rw-pill-btn ${state.windowSize === k ? "active" : ""}" data-win="${k}">
                    ${k} días
                  </button>
                `
                  )
                  .join("")}
              </div>
            </div>

            <!-- Toggle min_periods=1 -->
            <div class="rw-control-group">
              <span class="rw-ctrl-label">Borde Inicial ($t &lt; k$):</span>
              <button type="button" id="btn-rw-minperiods" class="rw-pill-btn ${state.minPeriodsOne ? "active" : ""}">
                ${state.minPeriodsOne ? "✓ min_periods=1 (Suma parcial)" : "⚠️ Estricto (NaN inicial)"}
              </button>
            </div>
          </div>

          <!-- Riel Interactivo de Celdas D1..D10 -->
          <div class="rw-track-container">
            <div class="rw-track">
              ${dailyRain
                .map((r, i) => {
                  const inWindow = i >= res.startIdx && i <= currentIdx;
                  const isPastOutsideWindow = i < res.startIdx;
                  const isTargetDay = i === currentIdx;
                  const barPct = Math.round((r / maxDaily) * 100);

                  let cellClass = "rw-day-cell";
                  if (inWindow) cellClass += " in-window";
                  if (isPastOutsideWindow) cellClass += " past-cum-only";
                  if (isTargetDay) cellClass += " target-day";

                  return `
                  <div class="${cellClass}" data-day="${i + 1}" title="Haz clic para evaluar el día D${i + 1}">
                    <span class="rw-day-id">D${i + 1}</span>
                    <div class="rw-mini-bar-wrap">
                      <div class="rw-mini-bar" style="height:${Math.max(6, barPct)}%;"></div>
                    </div>
                    <span class="rw-day-rain">${r}<small> mm</small></span>
                    <span class="rw-day-cum-sub">Σ=${cumsumSeries[i]}</span>
                    ${isTargetDay ? '<span class="rw-day-pin">▼ Día t</span>' : ""}
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>

          <!-- Gráfico SVG Sincronizado: Lluvia Diaria + .rolling(k).sum() + .cumsum() -->
          <div class="rw-chart-panel">
            ${buildComparisonSvg(w, currentIdx, state.minPeriodsOne)}
          </div>

          <!-- Tarjetas Comparativas de Resultado en el Día t + Código Pandas -->
          <div class="rw-result-grid" style="margin-top: 0.75rem;">
            <!-- Tarjeta 1: Ventana Móvil .rolling() -->
            <div class="rw-result-card ${res.isNaN ? "is-nan" : "is-val"}">
              <div class="rw-res-header">
                <strong style="color:#10b981; font-size:0.8rem;">1. Lluvia Antecedente en Ventana (<code>.rolling(${w}${minPeriodsArg}).sum()</code>)</strong>
                <span class="rw-calc-desc">
                  ${
                    res.isNaN
                      ? `Faltan ${w - state.currentDay} días para llenar window=${w} (activa min_periods=1 arriba para suma parcial)`
                      : `Suma ventana [D${res.startIdx + 1}..D${state.currentDay}]: ${res.slice.join(" + ")} mm`
                  }
                </span>
              </div>
              <div class="rw-res-val">
                ${
                  res.isNaN
                    ? `NaN <small style="font-size:0.78rem; font-weight:600;">(Calentamiento: suma parcial = ${res.partialSum} mm)</small>`
                    : `${res.val} <small>mm en los últimos ${res.slice.length} días</small>`
                }
              </div>
            </div>

            <!-- Tarjeta 2: Acumulado Histórico .cumsum() -->
            <div class="rw-result-card is-cumsum">
              <div class="rw-res-header">
                <strong style="color:#8b5cf6; font-size:0.8rem;">2. Lluvia Acumulada Total (<code>.cumsum()</code> desde D1 hasta D${state.currentDay})</strong>
                <span class="rw-calc-desc">
                  Suma histórica [D1..D${state.currentDay}]: ${res.cumSlice.join(" + ")} mm
                </span>
              </div>
              <div class="rw-res-val" style="color:#8b5cf6;">
                ${res.cumVal} <small>mm acumulados totales (${Math.round((res.cumVal / maxTotal) * 100)}% del total de 10d)</small>
              </div>
            </div>
          </div>

          <!-- Código Pandas Dinámico Limpio -->
          <div class="rw-code-box" style="margin-top: 0.65rem;">
            <pre class="trace-pre"><code><span class="tok-comment"># Evaluación en la fila del día D${state.currentDay}:</span>
df[<span class="tok-str">'lluvia_acum'</span>].loc[<span class="tok-str">'D${state.currentDay}'</span>]   <span class="tok-comment"># .cumsum()</span>                  ➔ <span class="tok-live-comment">${res.cumVal} mm (Memoria desde D1)</span>
df[<span class="tok-str">'lluvia_ant_${w}d'</span>].loc[<span class="tok-str">'D${state.currentDay}'</span>] <span class="tok-comment"># .rolling(${w}${minPeriodsArg}).sum()</span> ➔ <span class="tok-live-comment">${res.isNaN ? "np.nan (Ventana incompleta)" : res.val + " mm (Últimos " + res.slice.length + " días)"}</span></code></pre>
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

    const prevBtn = document.getElementById("btn-rw-prev");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (state.currentDay > 1) {
          state.currentDay--;
          renderWidget();
        }
      });
    }

    const nextBtn = document.getElementById("btn-rw-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (state.currentDay < 10) {
          state.currentDay++;
          renderWidget();
        }
      });
    }

    document.querySelectorAll(".rw-pill-btn[data-win]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.windowSize = parseInt(btn.getAttribute("data-win"), 10);
        renderWidget();
      });
    });

    const minPBtn = document.getElementById("btn-rw-minperiods");
    if (minPBtn) {
      minPBtn.addEventListener("click", () => {
        state.minPeriodsOne = !state.minPeriodsOne;
        renderWidget();
      });
    }

    document.querySelectorAll(".rw-day-cell[data-day], .rw-svg-day-hit[data-day]").forEach((el) => {
      el.addEventListener("click", () => {
        const d = parseInt(el.getAttribute("data-day"), 10);
        if (d >= 1 && d <= 10) {
          state.currentDay = d;
          renderWidget();
        }
      });
    });
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
