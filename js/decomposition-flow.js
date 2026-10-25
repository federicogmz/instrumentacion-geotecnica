/**
 * decomposition-flow.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.5.
 * Descomposición Aditiva de Series Temporales: Y(t) = T(t) + S(t) + R(t) con statsmodels.
 *
 * Integra en un único lienzo:
 * 1. Pizarra conceptual: Explicación paso a paso de cómo seasonal_decompose extrae
 *    Tendencia T(t) (media móvil centrada y bordes NaN), Estacionalidad S(t) (ciclo de
 *    media cero) y Residuo R(t) = Y(t) - T(t) - S(t) (detección de anomalías > 2σ).
 * 2. Simulador interactivo de 4 paneles SVG sincronizados con ejes y unidades (°),
 *    constructor aditivo en vivo superpuesto sobre Y(t), visualización opcional de los
 *    bordes NaN de la media móvil centrada, e inspector matemático por fecha t.
 */

(function () {
  let state = {
    useTrend: true,
    useSeasonal: true,
    useResid: true,
    showEdgeNaN: false,
    activeIdx: 9, // Índice activo (0 = Ene ... 9 = Oct ... 11 = Dic)
  };

  const timeAxis = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  // Componentes de C1 (Cabeceo del inclinómetro en grados °)
  const baseTrend =  [1.80, 1.85, 1.90, 1.95, 2.00, 2.05, 2.10, 2.15, 2.20, 2.25, 2.30, 2.35];
  // Ciclo estacional de media exactamente 0.00°
  const baseSeason = [0.10, 0.15, 0.08, -0.05, -0.13, -0.15, -0.10, -0.15, -0.08, 0.05, 0.13, 0.15];
  // Residuo: ruido normal (~±0.02°) + 2 anomalías por tormenta en Mayo (+0.25°) y Octubre (+0.35°)
  const baseResid =  [0.01, -0.02, 0.01, -0.01, 0.25, -0.02, 0.01, -0.01, 0.02, 0.35, -0.01, 0.01];
  const observedY =  timeAxis.map((_, i) => parseFloat((baseTrend[i] + baseSeason[i] + baseResid[i]).toFixed(2)));

  const residThreshold = 0.12; // Umbral ±2σ para destacar anomalías en R(t)

  function isEdgeNaNIndex(i) {
    return state.showEdgeNaN && (i === 0 || i === timeAxis.length - 1);
  }

  function buildPanelSvg({
    values,
    overlayValues,
    yMin,
    yMax,
    color,
    overlayColor,
    zeroLine,
    bandLimit,
    markEdgeNaN,
    panelTitle,
    panelBadge,
  }) {
    const width = 740;
    const height = 104;
    const padL = 48;
    const padR = 20;
    const padT = 14;
    const padB = 22;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const n = timeAxis.length;
    const stepX = plotW / (n - 1);

    const xAt = (i) => padL + i * stepX;
    const yAt = (v) => {
      const clamped = Math.max(yMin, Math.min(yMax, v));
      return padT + plotH - ((clamped - yMin) / (yMax - yMin || 1)) * plotH;
    };

    const yMid = (yMin + yMax) / 2;
    const yTicks = [yMin, yMid, yMax];

    const ptsMain = values
      .map((v, i) => (markEdgeNaN && isEdgeNaNIndex(i) ? null : `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");

    const ptsOverlay = overlayValues
      ? overlayValues
          .map((v, i) => (v === null ? null : `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`))
          .filter(Boolean)
          .join(" ")
      : "";

    const activeX = xAt(state.activeIdx).toFixed(1);

    return `
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:auto; display:block; overflow:visible;">
        <!-- Fondo del área de trazado -->
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="var(--bg-card)" stroke="var(--border-subtle)" rx="4" />

        <!-- Sombreado de bordes NaN (P/2) cuando está activo -->
        ${
          markEdgeNaN && state.showEdgeNaN
            ? `
              <rect x="${padL}" y="${padT}" width="${(stepX * 1.15).toFixed(1)}" height="${plotH}" fill="rgba(239,68,68,0.10)" />
              <text x="${(padL + stepX * 0.55).toFixed(1)}" y="${padT + plotH / 2 + 3}" text-anchor="middle" font-size="8.5" font-weight="800" fill="#ef4444">NaN (P/2)</text>
              <rect x="${(width - padR - stepX * 1.15).toFixed(1)}" y="${padT}" width="${(stepX * 1.15).toFixed(1)}" height="${plotH}" fill="rgba(239,68,68,0.10)" />
              <text x="${(width - padR - stepX * 0.55).toFixed(1)}" y="${padT + plotH / 2 + 3}" text-anchor="middle" font-size="8.5" font-weight="800" fill="#ef4444">NaN (P/2)</text>
            `
            : ""
        }

        <!-- Banda de umbral ilustrativo para el panel de Residuo -->
        ${
          bandLimit
            ? `
              <rect x="${padL}" y="${yAt(bandLimit).toFixed(1)}" width="${plotW}" height="${(yAt(-bandLimit) - yAt(bandLimit)).toFixed(1)}"
                    fill="rgba(16, 185, 129, 0.08)" />
              <line x1="${padL}" y1="${yAt(bandLimit).toFixed(1)}" x2="${width - padR}" y2="${yAt(bandLimit).toFixed(1)}" stroke="#ef4444" stroke-dasharray="4,3" stroke-width="1.1" />
              <line x1="${padL}" y1="${yAt(-bandLimit).toFixed(1)}" x2="${width - padR}" y2="${yAt(-bandLimit).toFixed(1)}" stroke="#ef4444" stroke-dasharray="4,3" stroke-width="1.1" />
              <text x="${width - padR - 4}" y="${(yAt(bandLimit) - 3).toFixed(1)}" text-anchor="end" font-size="8.5" font-weight="700" fill="#ef4444">Umbral ref. (+${bandLimit}°)</text>
            `
            : ""
        }

        <!-- Grilla horizontal y etiquetas Y -->
        ${yTicks
          .map((tv) => {
            const y = yAt(tv).toFixed(1);
            return `
              <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="rgba(148,163,184,0.16)" stroke-dasharray="2,2" />
              <text x="${padL - 6}" y="${(parseFloat(y) + 3).toFixed(1)}" text-anchor="end" font-size="9.5" fill="#94a3b8" font-family="monospace">${tv >= 0 && zeroLine ? (tv === 0 ? "0.00" : "+" + tv.toFixed(2)) : tv.toFixed(2)}°</text>
            `;
          })
          .join("")}

        ${
          zeroLine
            ? `<line x1="${padL}" y1="${yAt(0).toFixed(1)}" x2="${width - padR}" y2="${yAt(0).toFixed(1)}" stroke="rgba(148,163,184,0.5)" stroke-width="1.1" />`
            : ""
        }

        <!-- Cursor vertical sincronizado en el mes activo -->
        <line x1="${activeX}" y1="${padT}" x2="${activeX}" y2="${padT + plotH}" stroke="#0ea5e9" stroke-width="1.5" stroke-dasharray="2,2" />

        <!-- Serie Principal -->
        ${
          ptsMain
            ? `<polyline fill="none" stroke="${color}" stroke-width="${overlayValues ? "2" : "2.5"}" ${overlayValues ? 'stroke-opacity="0.45"' : ""} points="${ptsMain}" />`
            : ""
        }

        <!-- Serie Superpuesta (Reconstrucción Aditiva en Panel 1) -->
        ${
          ptsOverlay
            ? `<polyline fill="none" stroke="${overlayColor}" stroke-width="2.8" stroke-dasharray="5,2" points="${ptsOverlay}" />`
            : ""
        }

        <!-- Puntos de la serie -->
        ${values
          .map((v, i) => {
            const cx = xAt(i).toFixed(1);
            const isSel = i === state.activeIdx;
            if (markEdgeNaN && isEdgeNaNIndex(i)) {
              const cy = yAt(yMid).toFixed(1);
              return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" />`;
            }
            const cy = yAt(v).toFixed(1);
            const isOutlier = bandLimit && Math.abs(v) > bandLimit;
            const ptColor = isOutlier ? "#ef4444" : color;
            const r = isSel ? 5.5 : isOutlier ? 4.8 : 3.2;
            return `
              <circle cx="${cx}" cy="${cy}" r="${r}" fill="${ptColor}" stroke="#ffffff" stroke-width="${isSel ? 2 : 1}" />
            `;
          })
          .join("")}

        <!-- Etiquetas de meses y áreas clicables -->
        ${timeAxis
          .map((m, i) => {
            const cx = xAt(i);
            const isSel = i === state.activeIdx;
            return `
              <text x="${cx.toFixed(1)}" y="${height - 5}" text-anchor="middle" font-size="9.5"
                    font-weight="${isSel ? "800" : "600"}" fill="${isSel ? "#0ea5e9" : "#64748b"}">${m}</text>
              <rect x="${(cx - stepX / 2).toFixed(1)}" y="${padT}" width="${stepX.toFixed(1)}" height="${plotH + 20}"
                    fill="transparent" class="dec-month-hit" data-idx="${i}" style="cursor:pointer;" />
            `;
          })
          .join("")}
      </svg>
    `;
  }

  function renderWidget() {
    const container = document.getElementById("decomposition-flow-container");
    if (!container) return;

    const idx = state.activeIdx;
    const monthName = timeAxis[idx];
    const edgeNaN = isEdgeNaNIndex(idx);

    // Señal reconstruida según los switches activos
    const hasAnyLayer = state.useTrend || state.useSeasonal || state.useResid;
    const reconstructedSeries = hasAnyLayer
      ? timeAxis.map((_, i) => {
          if (state.showEdgeNaN && (i === 0 || i === timeAxis.length - 1) && (state.useTrend || state.useResid)) {
            return null;
          }
          let sum = 0;
          if (state.useTrend) sum += baseTrend[i];
          if (state.useSeasonal) sum += baseSeason[i];
          if (state.useResid) sum += baseResid[i];
          // Si no se incluye la tendencia, centramos alrededor de la media 2.05° para comparar en el mismo eje Y del Panel 1
          if (!state.useTrend) sum += 2.05;
          return parseFloat(sum.toFixed(2));
        })
      : null;

    const activeFormulaParts = [];
    if (state.useTrend) activeFormulaParts.push("T(t)");
    else if (hasAnyLayer) activeFormulaParts.push("2.05^\\circ");
    if (state.useSeasonal) activeFormulaParts.push("S(t)");
    if (state.useResid) activeFormulaParts.push("R(t)");
    const formulaMathHtml = activeFormulaParts.length > 0 ? `$${activeFormulaParts.join(" + ")}$` : "Sin capas activas";
    const formulaTextLabel = activeFormulaParts.length > 0 ? activeFormulaParts.join(" + ").replace("^\\circ", "°") : "Ninguna";

    const curY = observedY[idx];
    const curT = baseTrend[idx];
    const curS = baseSeason[idx];
    const curR = baseResid[idx];
    const isAnomaly = !edgeNaN && Math.abs(curR) > residThreshold;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.5 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">🔄 Descomposición Aditiva: $Y(t) = T(t) + S(t) + R(t)$ (<code>seasonal_decompose</code>)</h4>
          </div>
          <div class="bp-status-pill ${edgeNaN ? "pill-warn" : isAnomaly ? "pill-alert" : "pill-ok"}">
            ${
              edgeNaN
                ? `⏳ ${monthName}: Borde de Ventana Centrada (T y R = NaN)`
                : isAnomaly
                ? `🚨 ${monthName}: Anomalía en Residuo R = +${curR.toFixed(2)}° (> umbral)`
                : `✓ ${monthName}: Residuo Normal R = ${curR >= 0 ? "+" : ""}${curR.toFixed(2)}°`
            }
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          La señal bruta de un inclinómetro (<code>C1</code>) mezcla tres procesos con escalas físicas distintas. La función <code>seasonal_decompose(serie, model='additive', period=P)</code> separa matemáticamente la serie en <strong>tres capas aditivas</strong>:
        </p>

        <!-- 1. PIZARRA CONCEPTUAL: CÓMO FUNCIONA SEASONAL_DECOMPOSE PASO A PASO -->
        <div class="whiteboard-view" style="margin-top: 0.35rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">ALGORITMO INTERNO DE SEASONAL_DECOMPOSE (MODELO ADITIVO)</div>

            <div class="wb-rolling-schematic">
              <div class="rw-phase-box phase-geotech">
                <div class="rw-phase-tag">PASO 1: TENDENCIA $T(t)$ — Filtro de Media Móvil Centrada (<code>period=P</code>)</div>
                <div class="rw-phase-desc">
                  Suaviza la serie original promediando una ventana centrada de ancho $P$. Elimina los ciclos rápidos y aísla la <strong>deformación plástica irreversible a largo plazo</strong>.<br>
                  <em>Efecto de borde:</em> Los primeros $P/2$ y últimos $P/2$ registros quedan como <code>NaN</code> por falta de ventana completa en los extremos (ej. 15 días en cada borde cuando <code>period=30</code>).
                </div>
              </div>

              <div class="rw-phase-box phase-active" style="border-left-color:#9333ea; background:rgba(147,51,234,0.08);">
                <div class="rw-phase-tag">PASO 2: ESTACIONALIDAD $S(t)$ — Patrón Periódico de Media Cero</div>
                <div class="rw-phase-desc">
                  A la serie sin tendencia ($Y(t) - T(t)$) se le calcula el promedio para cada fase del ciclo $P$. Representa <strong>ciclos repetitivos reversibles</strong> (dilatación térmica diurna o ciclos estacionales húmedo/seco) cuya suma neta es $0^\\circ$.
                </div>
              </div>

              <div class="rw-phase-box phase-warmup">
                <div class="rw-phase-tag">PASO 3: RESIDUO $R(t) = Y(t) - T(t) - S(t)$ — Detector de Anomalías</div>
                <div class="rw-phase-desc">
                  Es lo que no puede explicarse ni por la deriva lenta ni por el ciclo normal. En días estables vale $\\approx 0^\\circ$; los <strong>picos que superan $\\pm 2\\sigma$ revelan eventos súbitos</strong> (tormentas intensas o movimientos bruscos).
                </div>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">⚡ Implementación en Statsmodels</h5>
              <div class="wb-code-block" style="font-size:0.74rem;">from statsmodels.tsa.seasonal import seasonal_decompose

# Descomposición con ciclo de P = 30 días:
descomp = seasonal_decompose(
    df_activo['C1'],
    model='additive',
    period=30
)
df_activo['C1_tend']  = descomp.trend
df_activo['C1_estac'] = descomp.seasonal
df_activo['C1_resid'] = descomp.resid</div>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.84em; gap:6px;">
                <li><strong><code>model='additive'</code>:</strong> $Y(t) = T(t) + S(t) + R(t)$, usado cuando la amplitud del ciclo no crece con el nivel de la serie.</li>
                <li><strong><code>period=30</code>:</strong> Define la longitud del ciclo en número de filas (30 días en frecuencia diaria).</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO DE DESCOMPOSICIÓN Y RECONSTRUCCIÓN -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.6rem;">
            <strong style="font-size: 0.86rem; color: var(--text-main);">
              🎛️ Simulador Esquema Anual de Descomposición Aditiva (Haz clic en cualquier mes o activa/desactiva capas):
            </strong>
          </div>

          <!-- Barra de Controles Interactivos -->
          <div class="rw-sim-toolbar" style="margin-bottom: 0.75rem;">
            <div class="rw-control-group">
              <span class="rw-ctrl-label">Capas en la Señal Reconstruida $\\hat{Y}(t)$:</span>
              <div class="rw-pill-group">
                <button type="button" id="btn-dec-trend" class="rw-pill-btn ${state.useTrend ? "active" : ""}">
                  ${state.useTrend ? "✓" : "+"} Tendencia T(t)
                </button>
                <button type="button" id="btn-dec-season" class="rw-pill-btn ${state.useSeasonal ? "active" : ""}">
                  ${state.useSeasonal ? "✓" : "+"} Estacionalidad S(t)
                </button>
                <button type="button" id="btn-dec-resid" class="rw-pill-btn ${state.useResid ? "active" : ""}">
                  ${state.useResid ? "✓" : "+"} Residuo R(t)
                </button>
              </div>
            </div>

            <div class="rw-control-group">
              <span class="rw-ctrl-label">Efecto Ventana Centrada:</span>
              <button type="button" id="btn-dec-edgenan" class="rw-pill-btn ${state.showEdgeNaN ? "active" : ""}">
                ${state.showEdgeNaN ? "✓ Mostrando Bordes NaN (P/2)" : "Ver Bordes NaN (P/2)"}
              </button>
            </div>

            <div class="rw-control-group" style="min-width:190px;">
              <span class="rw-ctrl-label">Mes Inspeccionado ($t$): <strong style="color:#0ea5e9;">${monthName}</strong></span>
              <input type="range" min="0" max="11" step="1" value="${state.activeIdx}" id="slider-dec-month" class="flow-slider" style="width:100%;">
            </div>
          </div>

          <!-- Ecuación Aditiva en Vivo para el Mes Seleccionado -->
          <div class="dec-equation-banner ${isAnomaly ? "is-anomaly" : ""}">
            <div class="dec-eq-title">
              🔍 <strong>Lupa Matemática en $t = \\text{${monthName}}$:</strong>
              <span>$Y(\\text{${monthName}}) = T(\\text{${monthName}}) + S(\\text{${monthName}}) + R(\\text{${monthName}})$</span>
            </div>
            <div class="dec-eq-boxes">
              <div class="dec-eq-chip chip-obs">
                <span class="chip-lbl">1. Observado $Y(t)$</span>
                <strong>${curY.toFixed(2)}°</strong>
              </div>
              <span class="dec-eq-op">=</span>
              <div class="dec-eq-chip chip-trend">
                <span class="chip-lbl">2. Tendencia $T(t)$</span>
                <strong>${edgeNaN ? "NaN" : curT.toFixed(2) + "°"}</strong>
              </div>
              <span class="dec-eq-op">+</span>
              <div class="dec-eq-chip chip-season">
                <span class="chip-lbl">3. Ciclo $S(t)$</span>
                <strong>${(curS >= 0 ? "+" : "") + curS.toFixed(2)}°</strong>
              </div>
              <span class="dec-eq-op">+</span>
              <div class="dec-eq-chip chip-resid ${isAnomaly ? "chip-alert" : ""}">
                <span class="chip-lbl">4. Residuo $R(t)$</span>
                <strong>${edgeNaN ? "NaN" : (curR >= 0 ? "+" : "") + curR.toFixed(2) + "°"} ${isAnomaly ? "🚨" : ""}</strong>
              </div>
            </div>
          </div>

          <!-- 4 Paneles SVG Sincronizados -->
          <div style="display:flex; flex-direction:column; gap:0.55rem; margin-top: 0.65rem;">
            <!-- Panel 1: Observada Y(t) + Reconstruida -->
            <div class="dec-panel-card" style="border-left: 4px solid #0284c7;">
              <div class="dec-panel-header">
                <span style="color:#0284c7;">1. Serie Observada $Y(t)$ [<code>df_activo['C1']</code>] vs. Reconstrucción Activa (${formulaMathHtml})</span>
                <span class="dec-panel-meta">Línea sólida: $Y(t)$ real &bull; Línea punteada ámbar: ${formulaTextLabel}</span>
              </div>
              ${buildPanelSvg({
                values: observedY,
                overlayValues: reconstructedSeries,
                yMin: 1.70,
                yMax: 2.80,
                color: "#0284c7",
                overlayColor: "#f59e0b",
                zeroLine: false,
                markEdgeNaN: false,
              })}
            </div>

            <!-- Panel 2: Tendencia T(t) -->
            <div class="dec-panel-card ${state.useTrend ? "" : "is-muted-layer"}" style="border-left: 4px solid #16a34a;">
              <div class="dec-panel-header">
                <span style="color:#16a34a;">2. Componente de Tendencia $T(t)$ [<code>descomp.trend</code>]</span>
                <span class="dec-panel-meta">Media móvil centrada: Deformación lenta de +1.80° a +2.35°</span>
              </div>
              ${buildPanelSvg({
                values: baseTrend,
                yMin: 1.70,
                yMax: 2.45,
                color: "#16a34a",
                zeroLine: false,
                markEdgeNaN: true,
              })}
            </div>

            <!-- Panel 3: Estacionalidad S(t) -->
            <div class="dec-panel-card ${state.useSeasonal ? "" : "is-muted-layer"}" style="border-left: 4px solid #9333ea;">
              <div class="dec-panel-header">
                <span style="color:#9333ea;">3. Componente Estacional $S(t)$ [<code>descomp.seasonal</code>]</span>
                <span class="dec-panel-meta">Oscilación periódica simétrica alrededor de 0.00° (amplitud ±0.15°)</span>
              </div>
              ${buildPanelSvg({
                values: baseSeason,
                yMin: -0.22,
                yMax: 0.22,
                color: "#9333ea",
                zeroLine: true,
                markEdgeNaN: false,
              })}
            </div>

            <!-- Panel 4: Residuo R(t) -->
            <div class="dec-panel-card ${state.useResid ? "" : "is-muted-layer"}" style="border-left: 4px solid #dc2626;">
              <div class="dec-panel-header">
                <span style="color:#dc2626;">4. Componente Residual $R(t) = Y(t) - T(t) - S(t)$ [<code>descomp.resid</code>]</span>
                <span class="dec-panel-meta">⚠️ Supera el umbral ±2σ en Mayo (+0.25°) y Octubre (+0.35°)</span>
              </div>
              ${buildPanelSvg({
                values: baseResid,
                yMin: -0.20,
                yMax: 0.42,
                color: "#dc2626",
                zeroLine: true,
                bandLimit: residThreshold,
                markEdgeNaN: true,
              })}
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const bT = document.getElementById("btn-dec-trend");
    const bS = document.getElementById("btn-dec-season");
    const bR = document.getElementById("btn-dec-resid");
    const bN = document.getElementById("btn-dec-edgenan");
    const slider = document.getElementById("slider-dec-month");

    if (bT) bT.addEventListener("click", () => { state.useTrend = !state.useTrend; renderWidget(); });
    if (bS) bS.addEventListener("click", () => { state.useSeasonal = !state.useSeasonal; renderWidget(); });
    if (bR) bR.addEventListener("click", () => { state.useResid = !state.useResid; renderWidget(); });
    if (bN) bN.addEventListener("click", () => { state.showEdgeNaN = !state.showEdgeNaN; renderWidget(); });

    if (slider) {
      slider.addEventListener("input", (e) => {
        state.activeIdx = parseInt(e.target.value, 10);
        renderWidget();
      });
    }

    document.querySelectorAll(".dec-month-hit[data-idx]").forEach((el) => {
      el.addEventListener("click", () => {
        const i = parseInt(el.getAttribute("data-idx"), 10);
        if (i >= 0 && i < timeAxis.length) {
          state.activeIdx = i;
          renderWidget();
        }
      });
    });
  }

  window.initDecompositionFlowWidget = function () {
    renderWidget();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("decomposition-flow-container")) {
        window.initDecompositionFlowWidget();
      }
    });
  } else {
    if (document.getElementById("decomposition-flow-container")) {
      window.initDecompositionFlowWidget();
    }
  }
})();
