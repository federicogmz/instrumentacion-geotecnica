/**
 * velocity-acceleration.js
 * Componente visual interactivo para la enseñanza de Derivadas Discretas (.diff()) y Velocidad de Deformación.
 * Contexto Geotécnico: Criterio de falla progresiva de Saito y cálculo de velocidad de desplazamiento en taludes.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    phase: "tertiary", // 'secondary' o 'tertiary'
  };

  const secondaryDisplacements = [10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5]; // Creep constante
  const tertiaryDisplacements =  [10.0, 10.5, 11.2, 12.3, 14.1, 17.0, 22.5, 34.0]; // Aceleración hacia la falla

  function calculateVelocities(arr) {
    const v = [0]; // Primer valor no tiene delta previo
    for (let i = 1; i < arr.length; i++) {
      v.push(parseFloat((arr[i] - arr[i - 1]).toFixed(2)));
    }
    return v;
  }

  function renderWidget() {
    const container = document.getElementById("velocity-acceleration-container");
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
            <span class="flow-badge">Módulo 3 &bull; Lección 3.3</span>
            <h4 class="flow-title">Derivadas Discretas (<code>.diff()</code>): Velocidad y Aceleración de Falla</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="va-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="va-mode-wb">
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
          <div class="wb-title-badge">LAS 3 FASES DE DEFORMACIÓN EN TALUDES (CRITERIO DE SAITO)</div>

          <div class="wb-velocity-schematic">
            <!-- Fase 1 -->
            <div class="va-phase-card border-normal">
              <span class="va-phase-num">Fase 1: Deformación Primaria (Transitoria)</span>
              <p>Tras una lluvia o excavación, la velocidad decrece con el tiempo ($\Delta v / \Delta t &lt; 0$). El suelo se acomoda hacia el equilibrio.</p>
            </div>

            <!-- Fase 2 -->
            <div class="va-phase-card border-warning">
              <span class="va-phase-num">Fase 2: Deformación Secundaria (Creep Estable)</span>
              <p>Velocidad constante ($\Delta d / \Delta t \approx \text{constante}$). El talud se deforma lentamente a ritmo uniforme (ej. 0.5 mm/día).</p>
            </div>

            <!-- Fase 3 -->
            <div class="va-phase-card border-danger">
              <span class="va-phase-num">Fase 3: Deformación Terciaria (Aceleración Crítica)</span>
              <p>La velocidad se dispara exponencialmente ($\Delta v / \Delta t &gt; 0$). La falla y colapso de la masa de tierra son inminentes.</p>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-emerald); margin-top:0;">⚡ Derivada Numérica con Pandas</h5>
            <div class="wb-code-block">
# 1. Velocidad de deformación (mm/día)
df['velocidad_mm_dia'] = df['desp_mm'].diff()

# 2. Aceleración (mm/día²)
df['aceleracion'] = df['velocidad_mm_dia'].diff()</div>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:8px;">
              <li><strong><code>.diff()</code>:</strong> Resta a cada fila el valor de la fila anterior: $y_t - y_{t-1}$.</li>
              <li><strong>Fila inicial:</strong> El primer registro siempre resulta en <code>NaN</code> porque no tiene dato anterior contra el cual restarse.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const isTertiary = state.phase === "tertiary";
    const d = isTertiary ? tertiaryDisplacements : secondaryDisplacements;
    const v = calculateVelocities(d);
    const maxV = Math.max(...v);
    const isCritical = maxV >= 2.0;

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Selector de Régimen Geotécnico -->
        <div class="va-sim-toolbar">
          <span class="va-label">Régimen Geotécnico de la Ladera:</span>
          <div class="va-buttons-group">
            <button class="va-btn ${!isTertiary ? 'active' : ''}" id="va-btn-sec">
              🟢 Fase Secundaria (Creep Constante = 0.5 mm/día)
            </button>
            <button class="va-btn ${isTertiary ? 'active-alert' : ''}" id="va-btn-ter">
              🔴 Fase Terciaria (Aceleración hacia el Colapso)
            </button>
          </div>
        </div>

        <!-- Gráficos Comparativos: Desplazamiento Acumulado vs Velocidad .diff() -->
        <div class="va-dual-graphs">
          <!-- Gráfica 1: Desplazamiento -->
          <div class="va-graph-box">
            <div class="va-graph-title">1. Desplazamiento Acumulado (<code>df['desp_mm']</code>)</div>
            <svg viewBox="0 0 450 130" class="va-svg">
              <rect x="40" y="10" width="390" height="95" fill="var(--bg-card)" stroke="var(--border-subtle)" />
              <polyline 
                fill="none" 
                stroke="#38bdf8" 
                stroke-width="2.5" 
                points="${d.map((val, i) => `${55 + i * 50},${95 - (val / 35) * 80}`).join(' ')}" 
              />
              ${d.map((val, i) => `
                <circle cx="${55 + i * 50}" cy="${95 - (val / 35) * 80}" r="3.5" fill="#38bdf8" stroke="#ffffff" stroke-width="1" />
                <text x="${55 + i * 50}" y="120" class="svg-axis-txt" text-anchor="middle">D${i+1}</text>
              `).join('')}
            </svg>
          </div>

          <!-- Gráfica 2: Velocidad derivada .diff() -->
          <div class="va-graph-box">
            <div class="va-graph-title">
              2. Velocidad de Deformación (<code>df['desp_mm'].diff()</code>, mm/día)
            </div>
            <svg viewBox="0 0 450 130" class="va-svg">
              <rect x="40" y="10" width="390" height="95" fill="var(--bg-card)" stroke="var(--border-subtle)" />
              <!-- Línea de Umbral de Alarma 2.0 mm/día -->
              <line x1="40" y1="${95 - (2.0 / 12) * 80}" x2="430" y2="${95 - (2.0 / 12) * 80}" stroke="#ef4444" stroke-dasharray="3,3" stroke-width="1.5" />
              <text x="425" y="${90 - (2.0 / 12) * 80}" class="svg-outlier-txt" text-anchor="end">Umbral Alerta: 2.0 mm/día</text>

              <polyline 
                fill="none" 
                stroke="${isCritical ? '#ef4444' : '#10b981'}" 
                stroke-width="2.5" 
                points="${v.map((val, i) => `${55 + i * 50},${95 - (val / 12) * 80}`).join(' ')}" 
              />
              ${v.map((val, i) => `
                <circle cx="${55 + i * 50}" cy="${95 - (val / 12) * 80}" r="3.5" fill="${val >= 2.0 ? '#ef4444' : '#10b981'}" stroke="#ffffff" stroke-width="1" />
                <text x="${55 + i * 50}" y="${85 - (val / 12) * 80}" class="svg-pt-val" text-anchor="middle">${i === 0 ? 'NaN' : val}</text>
              `).join('')}
            </svg>
          </div>
        </div>

        <!-- Banner de Diagnóstico Geotécnico -->
        <div class="va-status-footer ${isCritical ? 'status-critical' : 'status-normal'}">
          <div class="va-status-text">
            ${isCritical 
              ? `🚨 <strong>ALERTA DE COLAPSO:</strong> Velocidad máxima de <strong>${maxV} mm/día</strong> supera el umbral admisible. Fase terciaria detectada con .diff().`
              : `✅ <strong>ESTABILIDAD APARENTE:</strong> Velocidad constante de <strong>${maxV} mm/día</strong> (Creep secundario sin aceleración).`
            }
          </div>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("va-mode-sim");
    const btnWb = document.getElementById("va-mode-wb");

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

    const btnSec = document.getElementById("va-btn-sec");
    const btnTer = document.getElementById("va-btn-ter");

    if (btnSec) {
      btnSec.addEventListener("click", () => {
        state.phase = "secondary";
        renderWidget();
      });
    }
    if (btnTer) {
      btnTer.addEventListener("click", () => {
        state.phase = "tertiary";
        renderWidget();
      });
    }
  }

  window.initVelocityAccelerationWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("velocity-acceleration-container")) {
      window.initVelocityAccelerationWidget();
    }
  });
})();
