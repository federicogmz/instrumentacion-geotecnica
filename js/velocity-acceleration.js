/**
 * velocity-acceleration.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.3.
 * Cinemática del Talud: Cálculo de Velocidad y Aceleración con .diff() y Criterio de Saito.
 * 
 * Integra en un único lienzo:
 * 1. Esquema conceptual de pizarra: Las 3 fases de falla de Saito (Primaria, Secundaria, Terciaria).
 * 2. Simulador interactivo en tiempo real con gráficas duales: Desplazamiento acumulado vs. Velocidad derivada.
 * 3. Selector de régimen geotécnico (Creep estable vs. Aceleración crítica) y banner de alerta temprana.
 */

(function () {
  let state = {
    phase: "tertiary", // 'secondary' o 'tertiary'
  };

  const secondaryDisplacements = [10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5]; // Creep constante 0.5 mm/día
  const tertiaryDisplacements =  [10.0, 10.5, 11.2, 12.2, 14.0, 17.5, 23.0, 32.5]; // Aceleración exponencial

  function calculateVelocities(arr) {
    const v = [0]; // Día 1 sin derivada previa (representa NaN o 0)
    for (let i = 1; i < arr.length; i++) {
      v.push(parseFloat((arr[i] - arr[i - 1]).toFixed(2)));
    }
    return v;
  }

  function renderWidget() {
    const container = document.getElementById("velocity-acceleration-container");
    if (!container) return;

    const isTertiary = state.phase === "tertiary";
    const d = isTertiary ? tertiaryDisplacements : secondaryDisplacements;
    const v = calculateVelocities(d);
    const maxV = Math.max(...v);
    const isCritical = maxV >= 2.0;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.3 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">📈 Cinemática de Laderas: Velocidad y Aceleración de Falla con <code>.diff()</code></h4>
          </div>
          <div class="bp-status-pill ${isCritical ? 'pill-alert' : 'pill-ok'}">
            ${isCritical ? `🚨 Fase Terciaria Detectada: v_max = ${maxV} mm/día` : `✓ Fase Secundaria Estable: v = ${maxV} mm/día`}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          El desplazamiento acumulado puede ocultar el peligro; <strong>la derivada discreta de velocidad (<code>.diff()</code>) revela si la ladera está acelerando hacia el colapso</strong>. A continuación se integran el modelo teórico de Saito y el simulador de cálculo dinámico:
        </p>

        <!-- 1. ESQUEMA CONCEPTUAL DE PIZARRA (LAS 3 FASES DE SAITO) -->
        <div class="whiteboard-view" style="margin-top: 0.25rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">LAS 3 FASES DE DEFORMACIÓN EN TALUDES (CRITERIO DE SAITO)</div>

            <div class="wb-velocity-schematic">
              <!-- Fase 1 -->
              <div class="va-phase-card border-normal">
                <span class="va-phase-num">Fase 1: Deformación Primaria (Transitoria)</span>
                <p>Tras una lluvia o corte, la velocidad decrece con el tiempo ($\\Delta v / \\Delta t &lt; 0$). El suelo se acomoda hacia un nuevo estado de equilibrio.</p>
              </div>

              <!-- Fase 2 -->
              <div class="va-phase-card border-warning">
                <span class="va-phase-num">Fase 2: Deformación Secundaria (Creep Estable)</span>
                <p>Velocidad constante ($\\Delta d / \\Delta t \\approx \\text{constante}$). El talud se deforma lentamente a ritmo uniforme (ej. 0.5 mm/día sin aceleración).</p>
              </div>

              <!-- Fase 3 -->
              <div class="va-phase-card border-danger">
                <span class="va-phase-num">Fase 3: Deformación Terciaria (Aceleración Crítica)</span>
                <p>La velocidad se dispara progresivamente ($\\Delta v / \\Delta t &gt; 0$). La falla y colapso de la masa de suelo son inminentes.</p>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">⚡ Derivadas Numéricas con Pandas</h5>
              <div class="wb-code-block" style="font-size:0.77rem;"># 1. Velocidad de deformación (mm/día):
df['velocidad'] = df['DE1'].diff()

# 2. Aceleración cinemática (mm/día²):
df['aceleracion'] = df['velocidad'].diff()</div>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.86em; gap:8px;">
                <li><strong><code>.diff()</code>:</strong> Resta a cada fila el valor de la fila anterior ($y_t - y_{t-1}$).</li>
                <li><strong>Fila inicial:</strong> El primer registro siempre resulta en <code>NaN</code> porque no tiene dato anterior contra el cual restarse.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO CON GRÁFICAS DUALES -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <strong style="font-size: 0.86rem; color: var(--text-main);">
            🧪 Simulador Cinemático: Alterna el régimen para evaluar cómo responde la derivada <code>.diff()</code>:
          </strong>

          <!-- Selector de Régimen Geotécnico -->
          <div class="va-sim-toolbar" style="margin: 0.75rem 0;">
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
              <div class="va-graph-title">1. Desplazamiento Acumulado (<code>df['DE1']</code>, mm)</div>
              <svg viewBox="0 0 450 130" class="va-svg">
                <rect x="40" y="10" width="390" height="95" fill="var(--bg-card)" stroke="var(--border-subtle)" rx="3"/>
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
                2. Velocidad de Deformación (<code>df['DE1'].diff()</code>, mm/día)
              </div>
              <svg viewBox="0 0 450 130" class="va-svg">
                <rect x="40" y="10" width="390" height="95" fill="var(--bg-card)" stroke="var(--border-subtle)" rx="3"/>
                <!-- Línea de Umbral de Alarma 2.0 mm/día -->
                <line x1="40" y1="${95 - (2.0 / 12) * 80}" x2="430" y2="${95 - (2.0 / 12) * 80}" stroke="#ef4444" stroke-dasharray="3,3" stroke-width="1.5" />
                <text x="425" y="${90 - (2.0 / 12) * 80}" class="svg-outlier-txt" text-anchor="end">Alerta: 2.0 mm/día</text>

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
          <div class="va-status-footer ${isCritical ? 'status-critical' : 'status-normal'}" style="margin-top: 0.75rem;">
            <div class="va-status-text">
              ${isCritical 
                ? `🚨 <strong>ALERTA DE COLAPSO INMINENTE:</strong> Velocidad máxima de <strong>${maxV} mm/día</strong> supera el umbral crítico de 2.0 mm/día. Derivada positiva persistente detectada.`
                : `✅ <strong>ESTABILIDAD EN CREEP:</strong> Velocidad uniforme de <strong>${maxV} mm/día</strong> sin aceleración cinemática.`
              }
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
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
