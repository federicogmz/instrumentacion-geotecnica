/**
 * conditional-flow.js
 * Componente visual interactivo y conceptual integrado para la enseñanza de estructuras condicionales (if, elif, else)
 * Integra el esquema de flujo dibujado en pizarra con el simulador en tiempo real:
 * Variable de entrada (fs) -> Contenedor punteado -> Bloques IF / elif / else con bifurcaciones True / False.
 * 
 * Contexto geotécnico: Semáforo de Estabilidad de Taludes (Factor de Seguridad - FS).
 */

(function () {
  let state = {
    fsValue: 1.21,
  };

  const presets = [
    { val: 0.85, label: "🚨 0.85 Falla Inminente", desc: "Fuerzas desestabilizadoras superan a la resistencia cortante" },
    { val: 1.05, label: "🌧️ 1.05 Lluvias Críticas", desc: "Saturación por temporal; talud al límite del equilibrio" },
    { val: 1.21, label: "⚠️ 1.21 Ancón Norte (Alerta)", desc: "Margen de seguridad inferior a NSR-10 (FS < 1.3)" },
    { val: 1.55, label: "✅ 1.55 Macizo Seguro", desc: "Condición estable admisible según normativa" },
  ];

  function evaluateFlow(fs) {
    const isIfTrue = fs < 1.0;
    const isElifTrue = !isIfTrue && fs < 1.3;
    const isElseTrue = !isIfTrue && !isElifTrue;

    return {
      fs: fs,
      ifBranch: isIfTrue,
      elifBranch: isElifTrue,
      elseBranch: isElseTrue,
      activeNode: isIfTrue ? "if" : isElifTrue ? "elif" : "else",
      statusText: isIfTrue
        ? "🚨 INESTABLE (Falla Inminente · Evacuación Inmediata)"
        : isElifTrue
        ? "⚠️ ALERTA (Precaución · Monitoreo y Restricción)"
        : "✅ ESTABLE (Condición Segura · Operación Normal)",
      statusClass: isIfTrue
        ? "status-danger"
        : isElifTrue
        ? "status-warning"
        : "status-safe",
    };
  }

  function getStepNarrative(evalResult) {
    const fs = evalResult.fs.toFixed(2);
    if (evalResult.ifBranch) {
      return `
        <div class="flow-step-item">
          <span class="step-num" style="background:#0284c7; color:#fff; border-color:#0284c7;">1</span>
          <div class="step-desc">
            <strong>Entrada de Variable Geotécnica:</strong> El sistema lee la variable <code>fs = ${fs}</code> calculada por instrumentación.
          </div>
        </div>
        <div class="flow-step-item">
          <span class="step-num" style="background:#10b981; color:#fff; border-color:#10b981;">2</span>
          <div class="step-desc">
            <strong>Evaluación IF:</strong> ¿<code>${fs} &lt; 1.0</code>? ➔ <strong style="color:#10b981;">True (Verdadero)</strong>.
            Las fuerzas desestabilizadoras superan a las resistentes. El flujo toma la bifurcación derecha (flecha verde).
          </div>
        </div>
        <div class="flow-step-item">
          <span class="step-num" style="background:#ef4444; color:#fff; border-color:#ef4444;">3</span>
          <div class="step-desc">
            <strong>Ejecución y Cortocircuito:</strong> Se ejecuta <code>print("Estado: 🚨 INESTABLE")</code> y <strong>el intérprete sale del bloque de inmediato</strong>. Las ramas <code>elif</code> y <code>else</code> se ignoran por completo.
          </div>
        </div>
      `;
    } else if (evalResult.elifBranch) {
      return `
        <div class="flow-step-item">
          <span class="step-num" style="background:#0284c7; color:#fff; border-color:#0284c7;">1</span>
          <div class="step-desc">
            <strong>Entrada de Variable Geotécnica:</strong> El sistema lee la variable <code>fs = ${fs}</code> calculada por instrumentación.
          </div>
        </div>
        <div class="flow-step-item">
          <span class="step-num" style="background:#f59e0b; color:#fff; border-color:#f59e0b;">2</span>
          <div class="step-desc">
            <strong>Evaluación IF:</strong> ¿<code>${fs} &lt; 1.0</code>? ➔ <strong style="color:#ef4444;">False (Falso)</strong>.
            El talud no ha colapsado aún. El flujo desciende por la flecha roja hacia el bloque <code>elif</code>.
          </div>
        </div>
        <div class="flow-step-item">
          <span class="step-num" style="background:#10b981; color:#fff; border-color:#10b981;">3</span>
          <div class="step-desc">
            <strong>Evaluación elif:</strong> ¿<code>${fs} &lt; 1.3</code>? ➔ <strong style="color:#10b981;">True (Verdadero)</strong>.
            El factor está por debajo del estándar de seguridad ($FS < 1.3$). El flujo toma la bifurcación derecha (flecha verde).
          </div>
        </div>
        <div class="flow-step-item">
          <span class="step-num" style="background:#ef4444; color:#fff; border-color:#ef4444;">4</span>
          <div class="step-desc">
            <strong>Ejecución y Cortocircuito:</strong> Se ejecuta <code>print("Estado: ⚠️ ALERTA")</code> y el flujo sale. La rama <code>else</code> <strong>nunca se evalúa</strong>.
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flow-step-item">
          <span class="step-num" style="background:#0284c7; color:#fff; border-color:#0284c7;">1</span>
          <div class="step-desc">
            <strong>Entrada de Variable Geotécnica:</strong> El sistema lee la variable <code>fs = ${fs}</code> calculada por instrumentación.
          </div>
        </div>
        <div class="flow-step-item">
          <span class="step-num" style="background:#64748b; color:#fff; border-color:#64748b;">2</span>
          <div class="step-desc">
            <strong>Evaluación IF:</strong> ¿<code>${fs} &lt; 1.0</code>? ➔ <strong style="color:#ef4444;">False</strong>. Desciende por la flecha roja.
          </div>
        </div>
        <div class="flow-step-item">
          <span class="step-num" style="background:#64748b; color:#fff; border-color:#64748b;">3</span>
          <div class="step-desc">
            <strong>Evaluación elif:</strong> ¿<code>${fs} &lt; 1.3</code>? ➔ <strong style="color:#ef4444;">False</strong>. Desciende por la flecha roja.
          </div>
        </div>
        <div class="flow-step-item">
          <span class="step-num" style="background:#10b981; color:#fff; border-color:#10b981;">4</span>
          <div class="step-desc">
            <strong>Rama else (Red de Seguridad por Descarte):</strong> Ninguna condición de peligro fue verdadera. Se ejecuta el bloque por defecto: <code>print("Estado: ✅ ESTABLE")</code>.
          </div>
        </div>
      `;
    }
  }

  function renderWidget() {
    const container = document.getElementById("conditional-flow-container");
    if (!container) return;

    const evalResult = evaluateFlow(state.fsValue);

    container.innerHTML = `
      <div class="cf-widget-card">
        
        <!-- Encabezado Integrado de Pizarra & Simulador -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.3 &bull; Esquema de Pizarra &amp; Simulador en Tiempo Real</span>
            <h4 class="flow-title">🚦 Semáforo de Estabilidad Geotécnica: Lógica if / elif / else</h4>
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          Selecciona un escenario geotécnico o mueve el deslizador del Factor de Seguridad (<code>FS</code>) para observar cómo el intérprete de Python evalúa de arriba a abajo y bifurca el flujo (<code>True ➔</code> hacia la acción o <code>False ▼</code> descendiendo):
        </p>

        <!-- Barra de Presets Geotécnicos -->
        <div class="cf-presets" style="margin-top: 0.25rem;">
          <span class="cf-presets-label">Escenarios Rápidos:</span>
          ${presets.map(p => `
            <button class="cf-pill-btn ${Math.abs(state.fsValue - p.val) < 0.01 ? 'active-pill' : ''}" data-val="${p.val}" title="${p.desc}">
              ${p.label}
            </button>
          `).join('')}
        </div>

        <!-- Control Deslizante de Variable (FS) -->
        <div class="cf-slider-bar">
          <div class="cf-slider-header">
            <span>Variable Evaluada: <code>fs = fuerzas_resistentes / fuerzas_actuantes</code></span>
            <span class="cf-val-badge">FS = <strong>${state.fsValue.toFixed(2)}</strong></span>
          </div>
          <input type="range" class="cf-range-slider" id="cf-fs-slider" min="0.5" max="2.0" step="0.01" value="${state.fsValue}">
          <div class="cf-slider-ticks">
            <span style="color:#ef4444; font-weight:700;">0.50 (Falla)</span>
            <span style="color:#ef4444; font-weight:700;">1.00 (Límite Falla)</span>
            <span style="color:#f59e0b; font-weight:700;">1.30 (Límite NSR-10)</span>
            <span style="color:#10b981; font-weight:700;">2.00 (Estable)</span>
          </div>
        </div>

        <!-- Lienzo del Esquema de Flujo Conceptual (Pizarra Interactiva) -->
        <div class="cf-canvas">
          
          <!-- NODO ENTRADA: var / fs -->
          <div class="cf-top-var-wrapper">
            <div class="cf-var-circle" id="cf-node-var">
              <span class="cf-var-label">var</span>
            </div>
            <div class="cf-var-caption">
              <code>fs = ${state.fsValue.toFixed(2)}</code>
            </div>
          </div>

          <!-- Flecha Verde hacia abajo -->
          <div class="cf-arrow-down-green">
            <div class="cf-stem-green"></div>
            <div class="cf-head-green">▼</div>
          </div>

          <!-- CONTENEDOR PUNTEADO (Esquema de Pizarra) -->
          <div class="cf-dashed-container">
            <div class="cf-container-tag">
              Bloque Condicional · Evaluación Secuencial con Cortocircuito
            </div>

            <!-- BLOQUE 1: IF (fs < 1.0) -->
            <div class="cf-row-node" id="cf-row-if">
              <div class="cf-box-cond ${evalResult.activeNode === 'if' ? 'box-active-true' : (evalResult.fs >= 1.0 ? 'box-passed' : '')}">
                <span class="cf-keyword">IF</span>
                <span class="cf-cond-expr">fs &lt; 1.0</span>
              </div>

              <!-- Salida Horizontal Verde: True -->
              <div class="cf-branch-right ${evalResult.ifBranch ? 'branch-active-true' : ''}">
                <div class="cf-h-arrow-green">
                  <span class="cf-h-line-green"></span>
                  <span class="cf-h-head-green">➔</span>
                </div>
                <div class="cf-action-bubble ${evalResult.ifBranch ? 'action-active' : ''}">
                  <span class="cf-badge-bool true-badge">True</span>
                  <div class="cf-action-text">
                    <code>print("🚨 INESTABLE")</code> ➔ <strong>SALE</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flecha Vertical Roja: False (hacia elif) -->
            <div class="cf-v-arrow-red ${!evalResult.ifBranch ? 'v-active-false' : 'v-dimmed'}">
              <span class="cf-badge-bool false-badge">False</span>
              <div class="cf-v-stem-red"></div>
              <div class="cf-v-head-red">▼</div>
            </div>

            <!-- BLOQUE 2: ELIF (fs < 1.3) -->
            <div class="cf-row-node" id="cf-row-elif">
              <div class="cf-box-cond ${evalResult.activeNode === 'elif' ? 'box-active-true' : (evalResult.fs >= 1.3 ? 'box-passed' : (evalResult.ifBranch ? 'box-skipped' : ''))}">
                <span class="cf-keyword">elif</span>
                <span class="cf-cond-expr">fs &lt; 1.3</span>
              </div>

              <!-- Salida Horizontal Verde: True -->
              <div class="cf-branch-right ${evalResult.elifBranch ? 'branch-active-true' : ''}">
                <div class="cf-h-arrow-green">
                  <span class="cf-h-line-green"></span>
                  <span class="cf-h-head-green">➔</span>
                </div>
                <div class="cf-action-bubble ${evalResult.elifBranch ? 'action-active' : ''}">
                  <span class="cf-badge-bool true-badge">True</span>
                  <div class="cf-action-text">
                    <code>print("⚠️ ALERTA")</code> ➔ <strong>SALE</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flecha Vertical Roja: False (hacia else) -->
            <div class="cf-v-arrow-red ${evalResult.elseBranch ? 'v-active-false' : 'v-dimmed'}">
              <span class="cf-badge-bool false-badge">False</span>
              <div class="cf-v-stem-red"></div>
              <div class="cf-v-head-red">▼</div>
            </div>

            <!-- BLOQUE 3: ELSE (por descarte) -->
            <div class="cf-row-node" id="cf-row-else">
              <div class="cf-box-cond ${evalResult.activeNode === 'else' ? 'box-active-true' : (evalResult.ifBranch || evalResult.elifBranch ? 'box-skipped' : '')}">
                <span class="cf-keyword">else</span>
                <span class="cf-cond-expr">(por descarte)</span>
              </div>

              <!-- Salida Horizontal Verde: True -->
              <div class="cf-branch-right ${evalResult.elseBranch ? 'branch-active-true' : ''}">
                <div class="cf-h-arrow-green">
                  <span class="cf-h-line-green"></span>
                  <span class="cf-h-head-green">➔</span>
                </div>
                <div class="cf-action-bubble ${evalResult.elseBranch ? 'action-active' : ''}">
                  <span class="cf-badge-bool true-badge">True</span>
                  <div class="cf-action-text">
                    <code>print("✅ ESTABLE")</code> ➔ <strong>SALE</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Flecha Final hacia abajo -->
            <div class="cf-v-arrow-red v-dimmed" style="margin-top: 4px;">
              <span class="cf-badge-bool false-badge" style="opacity:0.6;">False</span>
              <div class="cf-v-stem-red" style="height: 12px;"></div>
              <div class="cf-v-head-red">▼</div>
            </div>

          </div> <!-- /cf-dashed-container -->

        </div> <!-- /cf-canvas -->

        <!-- Panel de Diagnóstico Geotécnico y Reglas de Python -->
        <div class="cf-explanation-card">
          <div class="cf-narrative-header">
            <span>🔍 Diagnóstico en Vivo del Intérprete:</span>
            <span class="cf-tag-result ${evalResult.statusClass}">${evalResult.statusText}</span>
          </div>

          <div class="cf-steps-narrative">
            ${getStepNarrative(evalResult)}
          </div>

          <div class="cf-takeaways-grid">
            <div class="cf-takeaway-item">
              <span class="cf-takeaway-icon">🎯</span>
              <div>
                <strong>Evaluación de Arriba hacia Abajo</strong>
                <p>Python evalúa estrictamente en orden secuencial: primero la cláusula <code>if</code>, luego los bloques <code>elif</code> y finalmente <code>else</code>.</p>
              </div>
            </div>
            <div class="cf-takeaway-item">
              <span class="cf-takeaway-icon">⚡</span>
              <div>
                <strong>Cortocircuito (Exclusión Mutua)</strong>
                <p>Tan pronto una condición resulta <code>True</code>, se ejecuta su bloque y se descarta el resto. Solo una rama puede ganar.</p>
              </div>
            </div>
            <div class="cf-takeaway-item">
              <span class="cf-takeaway-icon">🛡️</span>
              <div>
                <strong>else: Red de Seguridad por Descarte</strong>
                <p>No lleva condición lógica; se activa automáticamente si ninguna de las condiciones de alarma previas resultó verdadera.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const slider = document.getElementById("cf-fs-slider");
    const pills = document.querySelectorAll(".cf-pill-btn");

    if (slider) {
      slider.addEventListener("input", (e) => {
        state.fsValue = parseFloat(e.target.value);
        renderWidget();
      });
    }

    pills.forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = parseFloat(btn.dataset.val);
        state.fsValue = val;
        renderWidget();
      });
    });
  }

  // Exportar al ámbito global para inicialización desde app.js o curso
  window.initConditionalFlowWidget = function () {
    renderWidget();
  };

  // Autoejecución si el contenedor ya existe en el DOM
  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("conditional-flow-container")) {
      window.initConditionalFlowWidget();
    }
  });
})();
