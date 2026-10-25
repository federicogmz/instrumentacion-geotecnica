/**
 * velocity-acceleration.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.4.
 * Cinemática Angular con Cabeceo Diario (C1): Velocidad y Aceleración con .diff().
 *
 * Integra en un único lienzo:
 * 1. Pizarra conceptual: Posición angular C1 (°), Velocidad angular C1.diff() (°/día) y
 *    Aceleración angular C1.diff().diff() (°/día²) bajo las 3 fases de Saito.
 * 2. Simulador interactivo con 3 escenarios (Creep Secundario, Aceleración Terciaria y
 *    Pulso Real Ancón Norte en C1), 3 gráficos SVG sincronizados y un inspector de diferencias
 *    finitas fila a fila (y_t - y_{t-1}).
 */

(function () {
  let state = {
    scenario: "tertiary", // 'secondary' | 'tertiary' | 'ancon_real'
    activeDay: 6,         // Día inspeccionado (1 a 8)
  };

  const SCENARIOS = {
    secondary: {
      label: "🟢 Fase Secundaria (Creep Constante)",
      dayLabels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
      // Rotación constante de +0.020 °/día -> aceleración = 0.000 °/día²
      c1: [1.800, 1.820, 1.840, 1.860, 1.880, 1.900, 1.920, 1.940],
      statusPill: "✓ Fase Secundaria Estable: ω = +0.020 °/día | α = 0.000 °/día²",
      isCritical: false,
      summary:
        "ESTABILIDAD EN FLUENCIA SECUNDARIA: El ángulo de cabeceo C1 aumenta linealmente a razón constante (+0.020 °/día). La segunda derivada (.diff().diff()) es 0.000 °/día², indicando deformación estacionaria sin aceleración.",
    },
    tertiary: {
      label: "🔴 Fase Terciaria (Aceleración Progresiva)",
      dayLabels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
      // Velocidad creciente: +0.015, +0.025, +0.040, +0.060, +0.085, +0.115, +0.150 °/día
      c1: [1.800, 1.815, 1.840, 1.880, 1.940, 2.025, 2.140, 2.290],
      statusPill: "🚨 Fase Terciaria Detectada: ω_max = +0.150 °/día | α > 0 persistente",
      isCritical: true,
      summary:
        "ALERTA DE ACELERACIÓN CINEMÁTICA (CRITERIO DE SAITO): La velocidad angular diaria (C1.diff()) crece cada día (+0.015 ➔ +0.150 °/día) y la aceleración angular (vel_C1.diff()) se mantiene positiva (> 0 °/día²), anunciando inestabilidad progresiva.",
    },
    ancon_real: {
      label: "⚡ Pulso Real Ancón Norte (Ene 2021 en C1)",
      dayLabels: ["05-Ene", "06-Ene", "07-Ene", "08-Ene", "09-Ene", "10-Ene", "11-Ene", "12-Ene"],
      // Ventana real de df_activo['C1'] alrededor del máximo histórico de velocidad (10-Ene-2021: +0.1042 °/día)
      c1: [2.0339, 2.0445, 2.0313, 1.9204, 1.9123, 2.0165, 1.9810, 2.0172],
      statusPill: "⚡ Serie Real Ancón Norte: ω_max = +0.1042 °/día (10-Ene-2021)",
      isCritical: false,
      summary:
        "PULSO REAL EN INCLINÓMETRO C1 (ANCÓN NORTE): En datos reales diarios, C1 registra variaciones bidireccionales por posibles efectos termoelásticos o perturbaciones transitorias (caída de -0.1109 °/día el 08-Ene seguida de recuperación de +0.1042 °/día el 10-Ene). El operador .diff() cuantifica con precisión ambos saltos.",
    },
  };

  function computeKinematics(c1Arr) {
    const vel = [null]; // Día 1: NaN en C1.diff()
    for (let i = 1; i < c1Arr.length; i++) {
      vel.push(parseFloat((c1Arr[i] - c1Arr[i - 1]).toFixed(4)));
    }
    const acel = [null, null]; // Día 1 y Día 2: NaN en vel_C1.diff()
    for (let i = 2; i < vel.length; i++) {
      acel.push(parseFloat((vel[i] - vel[i - 1]).toFixed(4)));
    }
    return { vel, acel };
  }

  function renderPanelSvg({ values, labels, activeIdx, color, unit, yMin, yMax, zeroLine, thresholdLine }) {
    const width = 340;
    const height = 140;
    const padL = 42;
    const padR = 14;
    const padT = 16;
    const padB = 26;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const n = values.length;
    const stepX = plotW / (n - 1);

    const xAt = (i) => padL + i * stepX;
    const yAt = (v) => {
      const clamped = Math.max(yMin, Math.min(yMax, v));
      return padT + plotH - ((clamped - yMin) / (yMax - yMin || 1)) * plotH;
    };

    const validPts = values
      .map((v, i) => (v === null ? null : `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");

    const activeX = xAt(activeIdx).toFixed(1);

    const yMid = (yMin + yMax) / 2;
    const yTicks = [yMin, yMid, yMax];

    return `
      <svg viewBox="0 0 ${width} ${height}" class="va-svg" style="max-height:145px; overflow:visible;">
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="var(--bg-card)" stroke="var(--border-subtle)" rx="4" />

        ${yTicks
          .map((tv) => {
            const y = yAt(tv).toFixed(1);
            return `
              <line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="rgba(148,163,184,0.16)" stroke-dasharray="2,2" />
              <text x="${padL - 5}" y="${(parseFloat(y) + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="#94a3b8" font-family="monospace">${tv.toFixed(2)}</text>
            `;
          })
          .join("")}

        ${
          zeroLine && yMin < 0 && yMax > 0
            ? `<line x1="${padL}" y1="${yAt(0).toFixed(1)}" x2="${width - padR}" y2="${yAt(0).toFixed(1)}" stroke="rgba(148,163,184,0.55)" stroke-width="1.1" />`
            : ""
        }

        ${
          thresholdLine !== undefined
            ? `
              <line x1="${padL}" y1="${yAt(thresholdLine).toFixed(1)}" x2="${width - padR}" y2="${yAt(thresholdLine).toFixed(1)}" stroke="#ef4444" stroke-dasharray="4,3" stroke-width="1.3" />
              <text x="${width - padR - 4}" y="${(yAt(thresholdLine) - 4).toFixed(1)}" text-anchor="end" font-size="8.5" font-weight="700" fill="#ef4444">Umbral ref. ${thresholdLine} ${unit}</text>
            `
            : ""
        }

        <!-- Cursor vertical del día activo -->
        <line x1="${activeX}" y1="${padT}" x2="${activeX}" y2="${padT + plotH}" stroke="#0ea5e9" stroke-width="1.4" stroke-dasharray="2,2" />

        ${validPts ? `<polyline fill="none" stroke="${color}" stroke-width="2.5" points="${validPts}" />` : ""}

        ${values
          .map((v, i) => {
            const cx = xAt(i).toFixed(1);
            const isSel = i === activeIdx;
            if (v === null) {
              const cy = yAt(zeroLine && yMin < 0 ? 0 : yMin).toFixed(1);
              return `
                <circle cx="${cx}" cy="${cy}" r="${isSel ? 4.5 : 3}" fill="#94a3b8" stroke="#ffffff" stroke-width="1" />
                <text x="${cx}" y="${(parseFloat(cy) - 6).toFixed(1)}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#94a3b8">NaN</text>
              `;
            }
            const cy = yAt(v).toFixed(1);
            const ptColor = thresholdLine !== undefined && Math.abs(v) >= thresholdLine ? "#ef4444" : color;
            return `
              <circle cx="${cx}" cy="${cy}" r="${isSel ? 5.5 : 3.5}" fill="${ptColor}" stroke="#ffffff" stroke-width="${isSel ? 2 : 1}" />
              ${
                isSel
                  ? `<text x="${cx}" y="${(parseFloat(cy) - 7).toFixed(1)}" text-anchor="middle" font-size="9" font-weight="800" fill="${ptColor}">${v >= 0 && zeroLine ? "+" + v.toFixed(4) : v.toFixed(4)}</text>`
                  : ""
              }
            `;
          })
          .join("")}

        ${labels
          .map((lbl, i) => {
            const cx = xAt(i);
            const isSel = i === activeIdx;
            return `
              <text x="${cx.toFixed(1)}" y="${height - 7}" text-anchor="middle" font-size="9" font-weight="${isSel ? "800" : "600"}" fill="${isSel ? "#0ea5e9" : "#64748b"}">${lbl}</text>
              <rect x="${(cx - stepX / 2).toFixed(1)}" y="${padT}" width="${stepX.toFixed(1)}" height="${plotH + 20}" fill="transparent" class="va-day-hit" data-day="${i + 1}" style="cursor:pointer;" />
            `;
          })
          .join("")}
      </svg>
    `;
  }

  function renderWidget() {
    const container = document.getElementById("velocity-acceleration-container");
    if (!container) return;

    const scen = SCENARIOS[state.scenario] || SCENARIOS.tertiary;
    const c1 = scen.c1;
    const { vel, acel } = computeKinematics(c1);
    const idx = Math.max(0, Math.min(c1.length - 1, state.activeDay - 1));

    const curC1 = c1[idx];
    const prevC1 = idx > 0 ? c1[idx - 1] : null;
    const curVel = vel[idx];
    const prevVel = idx > 0 ? vel[idx - 1] : null;
    const curAcel = acel[idx];

    const c1Min = state.scenario === "ancon_real" ? 1.88 : 1.75;
    const c1Max = state.scenario === "ancon_real" ? 2.08 : 2.35;
    const velMin = state.scenario === "ancon_real" ? -0.14 : -0.02;
    const velMax = state.scenario === "ancon_real" ? 0.14 : 0.18;
    const acelMin = state.scenario === "ancon_real" ? -0.16 : -0.02;
    const acelMax = state.scenario === "ancon_real" ? 0.16 : 0.06;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.4 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">📈 Cinemática del Cabeceo Diario (<code>C1</code>): Velocidad y Aceleración con <code>.diff()</code></h4>
          </div>
          <div class="bp-status-pill ${scen.isCritical ? "pill-alert" : "pill-ok"}">
            ${scen.statusPill}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          El inclinómetro mide el <strong>ángulo de cabeceo diario <code>C1</code> en grados (<code>°</code>)</strong>, que representa la posición angular del talud. Al aplicar la diferencia finita discreta <code>.diff()</code> una y dos veces, obtenemos la <strong>velocidad angular diaria (<code>°/día</code>)</strong> y la <strong>aceleración angular diaria (<code>°/día²</code>)</strong>:
        </p>

        <!-- 1. ESQUEMA CONCEPTUAL DE PIZARRA -->
        <div class="whiteboard-view" style="margin-top: 0.3rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">JERARQUÍA CINEMÁTICA DEL CABECEO DIARIO (C1) Y FASES DE SAITO</div>

            <div class="wb-velocity-schematic">
              <div class="va-phase-card border-normal">
                <span class="va-phase-num">1. Posición Angular $\\theta(t)$: <code>df_activo['C1']</code> (Grados, <code>°</code>)</span>
                <p>Mide la inclinación acumulada del sensor cada día (de $1.70^\\circ$ a $2.56^\\circ$ en Ancón Norte). Por sí sola, una curva suave puede ocultar el inicio de una aceleración peligrosa.</p>
              </div>

              <div class="va-phase-card border-warning">
                <span class="va-phase-num">2. Velocidad Angular $\\omega(t) = \\Delta\\theta/\\Delta t$: <code>df_activo['C1'].diff()</code> (<code>°/día</code>)</span>
                <p>Resta el ángulo de hoy menos el de ayer ($\\theta_t - \\theta_{t-1}$). En <strong>Fluencia Secundaria</strong> $\\omega$ es constante; en series reales también refleja ciclos termoelásticos ($\\omega &gt; 0$ y $\\omega &lt; 0$).</p>
              </div>

              <div class="va-phase-card border-danger">
                <span class="va-phase-num">3. Aceleración Angular $\\alpha(t) = \\Delta\\omega/\\Delta t$: <code>vel_C1.diff()</code> (<code>°/día²</code>)</span>
                <p>Segunda derivada discreta ($\\omega_t - \\omega_{t-1}$). Cuando $\\alpha &gt; 0$ de forma sostenida (<strong>Fase Terciaria de Saito/Fukuzono</strong>) o presenta picos extremos, alerta sobre desestabilización activa.</p>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">⚡ Derivadas Discretas sobre C1</h5>
              <div class="wb-code-block" style="font-size:0.75rem;"># 1. Velocidad angular diaria (°/día):
df_activo['vel_C1'] = df_activo['C1'].diff()

# 2. Aceleración angular diaria (°/día²):
df_activo['acel_C1'] = df_activo['vel_C1'].diff()</div>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.84em; gap:6px;">
                <li><strong><code>C1.diff()</code>:</strong> Calcula $\\text{C1}_t - \\text{C1}_{t-1}$ en <code>°/día</code> (día 1 queda en <code>NaN</code>).</li>
                <li><strong><code>vel_C1.diff()</code>:</strong> Calcula $\\omega_t - \\omega_{t-1}$ en <code>°/día²</code> (días 1 y 2 quedan en <code>NaN</code>).</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO DE 3 NIVELES CINEMÁTICOS -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.6rem;">
            <strong style="font-size: 0.86rem; color: var(--text-main);">
              🧪 Simulador Cinemático de <code>C1</code> (Alterna el régimen y haz clic en cualquier día para inspeccionar <code>.diff()</code>):
            </strong>
          </div>

          <!-- Barra de Selección de Escenario + Inspector de Día -->
          <div class="va-sim-toolbar" style="justify-content:space-between;">
            <div class="va-buttons-group">
              <button type="button" class="va-btn ${state.scenario === "secondary" ? "active" : ""}" data-scen="secondary">
                🟢 Creep Secundario (ω cte, α = 0)
              </button>
              <button type="button" class="va-btn ${state.scenario === "tertiary" ? "active-alert" : ""}" data-scen="tertiary">
                🔴 Fase Terciaria (Aceleración α &gt; 0)
              </button>
              <button type="button" class="va-btn ${state.scenario === "ancon_real" ? "active-alert" : ""}" data-scen="ancon_real">
                ⚡ Pulso Real Ancón Norte (Ene 2021)
              </button>
            </div>

            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:0.76rem; font-weight:700; color:var(--text-main);">Día Activo ($t$): <strong style="color:#0ea5e9;">${scen.dayLabels[idx]}</strong></span>
              <input type="range" min="1" max="${c1.length}" step="1" value="${state.activeDay}" id="slider-va-day" class="flow-slider" style="width:120px;">
            </div>
          </div>

          <!-- 3 Gráficos Cinemáticos Sincronizados: Posición C1 (°), Velocidad (°/día) y Aceleración (°/día²) -->
          <div class="va-triple-graphs">
            <!-- Panel 1: Ángulo de Cabeceo C1 -->
            <div class="va-graph-box">
              <div class="va-graph-title">1. Ángulo Cabeceo <code>C1</code> (<code>°</code>)</div>
              ${renderPanelSvg({
                values: c1,
                labels: scen.dayLabels,
                activeIdx: idx,
                color: "#0284c7",
                unit: "°",
                yMin: c1Min,
                yMax: c1Max,
                zeroLine: false,
              })}
            </div>

            <!-- Panel 2: Velocidad Angular C1.diff() -->
            <div class="va-graph-box">
              <div class="va-graph-title">2. Velocidad <code>C1.diff()</code> (<code>°/día</code>)</div>
              ${renderPanelSvg({
                values: vel,
                labels: scen.dayLabels,
                activeIdx: idx,
                color: "#10b981",
                unit: "°/d",
                yMin: velMin,
                yMax: velMax,
                zeroLine: true,
                thresholdLine: 0.08,
              })}
            </div>

            <!-- Panel 3: Aceleración Angular vel_C1.diff() -->
            <div class="va-graph-box">
              <div class="va-graph-title">3. Aceleración <code>vel_C1.diff()</code> (<code>°/día²</code>)</div>
              ${renderPanelSvg({
                values: acel,
                labels: scen.dayLabels,
                activeIdx: idx,
                color: "#f59e0b",
                unit: "°/d²",
                yMin: acelMin,
                yMax: acelMax,
                zeroLine: true,
              })}
            </div>
          </div>

          <!-- Inspector Matemático de Diferencias Finitas en el Día Activo -->
          <div class="va-inspector-strip">
            <div class="va-insp-item">
              <span class="va-insp-label">Posición Angular $\\theta_t$ (${scen.dayLabels[idx]})</span>
              <strong class="va-insp-val" style="color:#0284c7;">${curC1.toFixed(4)}°</strong>
              <span class="va-insp-sub">${prevC1 !== null ? `Ayer (${scen.dayLabels[idx - 1]}): ${prevC1.toFixed(4)}°` : "Primer registro de la serie"}</span>
            </div>

            <div class="va-insp-item">
              <span class="va-insp-label">1ª Derivada: Velocidad $\\omega_t = \\theta_t - \\theta_{t-1}$</span>
              <strong class="va-insp-val" style="color:${curVel !== null && Math.abs(curVel) >= 0.08 ? "#ef4444" : "#10b981"};">
                ${curVel === null ? "NaN (Sin día previo)" : (curVel >= 0 ? "+" : "") + curVel.toFixed(4) + " °/día"}
              </strong>
              <span class="va-insp-sub">
                ${curVel === null ? "Día 1 no tiene t-1 para restar" : `${curC1.toFixed(4)}° - ${prevC1.toFixed(4)}° = ${(curVel >= 0 ? "+" : "") + curVel.toFixed(4)} °/día`}
              </span>
            </div>

            <div class="va-insp-item">
              <span class="va-insp-label">2ª Derivada: Aceleración $\\alpha_t = \\omega_t - \\omega_{t-1}$</span>
              <strong class="va-insp-val" style="color:#f59e0b;">
                ${curAcel === null ? "NaN (Sin ω previa)" : (curAcel >= 0 ? "+" : "") + curAcel.toFixed(4) + " °/día²"}
              </strong>
              <span class="va-insp-sub">
                ${curAcel === null ? "Días 1 y 2 no tienen dos ω consecutivas" : `${curVel.toFixed(4)} - (${prevVel.toFixed(4)}) = ${(curAcel >= 0 ? "+" : "") + curAcel.toFixed(4)} °/día²`}
              </span>
            </div>
          </div>

          <!-- Banner de Diagnóstico Geotécnico -->
          <div class="va-status-footer ${scen.isCritical ? "status-critical" : "status-normal"}" style="margin-top: 0.65rem;">
            <div class="va-status-text">
              ${scen.isCritical ? "🚨" : "✅"} <strong>Diagnóstico Cinemático:</strong> ${scen.summary}
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    document.querySelectorAll(".va-btn[data-scen]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.scenario = btn.getAttribute("data-scen");
        renderWidget();
      });
    });

    const slider = document.getElementById("slider-va-day");
    if (slider) {
      slider.addEventListener("input", (e) => {
        state.activeDay = parseInt(e.target.value, 10);
        renderWidget();
      });
    }

    document.querySelectorAll(".va-day-hit[data-day]").forEach((el) => {
      el.addEventListener("click", () => {
        const d = parseInt(el.getAttribute("data-day"), 10);
        if (d >= 1 && d <= 8) {
          state.activeDay = d;
          renderWidget();
        }
      });
    });
  }

  window.initVelocityAccelerationWidget = function () {
    renderWidget();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("velocity-acceleration-container")) {
        window.initVelocityAccelerationWidget();
      }
    });
  } else {
    if (document.getElementById("velocity-acceleration-container")) {
      window.initVelocityAccelerationWidget();
    }
  }
})();
