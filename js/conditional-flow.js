/**
 * conditional-flow.js
 * Componente visual interactivo para la enseñanza de estructuras condicionales (if, elif, else)
 * Basado en el esquema de flujo dibujado en pizarra:
 * Variable de entrada (var) -> Contenedor punteado -> Bloques IF / elif / else con bifurcaciones True / False.
 * 
 * Compatible con temas claro y oscuro, adaptable a dispositivos móviles y responsive.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    fsValue: 1.21,
    isAnimating: false,
    activeStep: null,
  };

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
        ? "🚨 INESTABLE (Falla Inminente)"
        : isElifTrue
        ? "⚠️ ALERTA (Precaución / Monitoreo Crítico)"
        : "✅ ESTABLE (Condición Segura)",
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
        <div class="flow-step-item active-success">
          <span class="step-num">1</span>
          <div class="step-desc">
            <strong>Entrada de Variable:</strong> <code>var = fs = ${fs}</code> ingresa al contenedor condicional.
          </div>
        </div>
        <div class="flow-step-item active-success">
          <span class="step-num">2</span>
          <div class="step-desc">
            <strong>Evaluación IF:</strong> ¿<code>${fs} &lt; 1.0</code>? ➔ <strong style="color:var(--accent-emerald);">True (Verdadero)</strong>.
            El flujo toma la bifurcación derecha (flecha verde).
          </div>
        </div>
        <div class="flow-step-item active-success">
          <span class="step-num">3</span>
          <div class="step-desc">
            <strong>Ejecución y Cortocircuito:</strong> Se ejecuta <code>print("Estado: 🚨 INESTABLE")</code> y <strong>el flujo sale de la estructura</strong>. Las ramas <code>elif</code> y <code>else</code> se omiten por completo.
          </div>
        </div>
      `;
    } else if (evalResult.elifBranch) {
      return `
        <div class="flow-step-item active-success">
          <span class="step-num">1</span>
          <div class="step-desc">
            <strong>Entrada de Variable:</strong> <code>var = fs = ${fs}</code> ingresa al contenedor condicional.
          </div>
        </div>
        <div class="flow-step-item active-fail">
          <span class="step-num">2</span>
          <div class="step-desc">
            <strong>Evaluación IF:</strong> ¿<code>${fs} &lt; 1.0</code>? ➔ <strong style="color:var(--accent-rose);">False (Falso)</strong>.
            El flujo desciende por la flecha roja hacia el siguiente bloque.
          </div>
        </div>
        <div class="flow-step-item active-success">
          <span class="step-num">3</span>
          <div class="step-desc">
            <strong>Evaluación elif:</strong> ¿<code>${fs} &lt; 1.3</code>? ➔ <strong style="color:var(--accent-emerald);">True (Verdadero)</strong>.
            El flujo toma la bifurcación derecha (flecha verde).
          </div>
        </div>
        <div class="flow-step-item active-success">
          <span class="step-num">4</span>
          <div class="step-desc">
            <strong>Ejecución y Cortocircuito:</strong> Se ejecuta <code>print("Estado: ⚠️ ALERTA")</code> y el flujo sale. La rama <code>else</code> <strong>nunca se ejecuta</strong>.
          </div>
        </div>
      `;
    } else {
      return `
        <div class="flow-step-item active-success">
          <span class="step-num">1</span>
          <div class="step-desc">
            <strong>Entrada de Variable:</strong> <code>var = fs = ${fs}</code> ingresa al contenedor condicional.
          </div>
        </div>
        <div class="flow-step-item active-fail">
          <span class="step-num">2</span>
          <div class="step-desc">
            <strong>Evaluación IF:</strong> ¿<code>${fs} &lt; 1.0</code>? ➔ <strong style="color:var(--accent-rose);">False</strong>. Desciende por la flecha roja.
          </div>
        </div>
        <div class="flow-step-item active-fail">
          <span class="step-num">3</span>
          <div class="step-desc">
            <strong>Evaluación elif:</strong> ¿<code>${fs} &lt; 1.3</code>? ➔ <strong style="color:var(--accent-rose);">False</strong>. Desciende por la flecha roja.
          </div>
        </div>
        <div class="flow-step-item active-success">
          <span class="step-num">4</span>
          <div class="step-desc">
            <strong>Rama else por Descarte:</strong> Ninguna condición anterior se cumplió. Se ejecuta el bloque por defecto: <code>print("Estado: ✅ ESTABLE")</code>.
          </div>
        </div>
      `;
    }
  }

  function renderWidget() {
    const container = document.getElementById("conditional-flow-container");
    if (!container) return;

    const evalResult = evaluateFlow(state.fsValue);
    const isWb = state.mode === "whiteboard";

    container.innerHTML = `
      <div class="cf-widget-card">
        
        <!-- Barra de Modos y Controles -->
        <div class="cf-toolbar">
          <div class="cf-mode-toggle">
            <button class="cf-btn-tab ${!isWb ? 'active' : ''}" id="cf-tab-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="cf-btn-tab ${isWb ? 'active' : ''}" id="cf-tab-wb">
              📐 Esquema de Pizarra
            </button>
          </div>

          ${!isWb ? `
          <div class="cf-presets">
            <span class="cf-presets-label">Valores rápidos:</span>
            <button class="cf-pill-btn ${state.fsValue === 0.85 ? 'active-pill' : ''}" data-val="0.85">
              🚨 0.85 (Falla)
            </button>
            <button class="cf-pill-btn ${state.fsValue === 1.21 ? 'active-pill' : ''}" data-val="1.21">
              ⚠️ 1.21 (Alerta)
            </button>
            <button class="cf-pill-btn ${state.fsValue === 1.55 ? 'active-pill' : ''}" data-val="1.55">
              ✅ 1.55 (Estable)
            </button>
          </div>
          ` : ''}
        </div>

        ${!isWb ? `
        <!-- Control Deslizante de Variable -->
        <div class="cf-slider-bar">
          <div class="cf-slider-header">
            <span>Variable de Entrada (<code>var</code> / <code>fs</code>):</span>
            <span class="cf-val-badge">FS = <strong>${state.fsValue.toFixed(2)}</strong></span>
          </div>
          <input type="range" class="cf-range-slider" id="cf-fs-slider" min="0.5" max="2.0" step="0.01" value="${state.fsValue}">
          <div class="cf-slider-ticks">
            <span>0.50 (Falla)</span>
            <span>1.00 (Límite Inestable)</span>
            <span>1.30 (Límite Alerta)</span>
            <span>2.00 (Estable)</span>
          </div>
        </div>
        ` : ''}

        <!-- Lienzo del Diagrama de Flujo -->
        <div class="cf-canvas">
          
          <!-- NODO ENTRADA: var -->
          <div class="cf-top-var-wrapper">
            <div class="cf-var-circle" id="cf-node-var">
              <span class="cf-var-label">var</span>
            </div>
            <div class="cf-var-caption">
              ${isWb ? '<span class="cf-var-badge-wb">Var 1</span>' : `<code>fs = ${state.fsValue.toFixed(2)}</code>`}
            </div>
          </div>

          <!-- Flecha de Entrada hacia abajo (Verde) -->
          <div class="cf-arrow-down-green">
            <div class="cf-stem-green"></div>
            <div class="cf-head-green">▼</div>
          </div>

          <!-- CONTENEDOR PUNTEADO (Caja de Condicionales) -->
          <div class="cf-dashed-container">
            <div class="cf-container-tag">
              Bloque Condicional · Evaluación Secuencial de Cortocircuito
            </div>

            <!-- BLOQUE 1: IF -->
            <div class="cf-row-node" id="cf-row-if">
              <div class="cf-box-cond ${isWb ? 'box-whiteboard' : (evalResult.activeNode === 'if' ? 'box-active-true' : (evalResult.fs >= 1.0 ? 'box-passed' : ''))}">
                <span class="cf-keyword">IF</span>
                <span class="cf-cond-expr">${isWb ? 'condicion' : 'fs &lt; 1.0'}</span>
              </div>

              <!-- Salida Horizontal Verde: True -->
              <div class="cf-branch-right ${isWb || evalResult.ifBranch ? 'branch-active-true' : ''}">
                <div class="cf-h-arrow-green">
                  <span class="cf-h-line-green"></span>
                  <span class="cf-h-head-green">➔</span>
                </div>
                <div class="cf-action-bubble ${evalResult.ifBranch ? 'action-active' : ''}">
                  <span class="cf-badge-bool true-badge">True</span>
                  <div class="cf-action-text">
                    ${isWb ? 'Ejecuta bloque IF y SALE ➔' : '<code>print("🚨 INESTABLE")</code> ➔ SALE'}
                  </div>
                </div>
              </div>
            </div>

            <!-- Flecha Vertical Roja: False (hacia elif) -->
            <div class="cf-v-arrow-red ${isWb || !evalResult.ifBranch ? 'v-active-false' : 'v-dimmed'}">
              <span class="cf-badge-bool false-badge">False</span>
              <div class="cf-v-stem-red"></div>
              <div class="cf-v-head-red">▼</div>
            </div>

            <!-- BLOQUE 2: ELIF -->
            <div class="cf-row-node" id="cf-row-elif">
              <div class="cf-box-cond ${isWb ? 'box-whiteboard' : (evalResult.activeNode === 'elif' ? 'box-active-true' : (evalResult.fs >= 1.3 ? 'box-passed' : (evalResult.ifBranch ? 'box-skipped' : '')))}">
                <span class="cf-keyword">elif</span>
                <span class="cf-cond-expr">${isWb ? 'otra_condicion' : 'fs &lt; 1.3'}</span>
              </div>

              <!-- Salida Horizontal Verde: True -->
              <div class="cf-branch-right ${isWb || evalResult.elifBranch ? 'branch-active-true' : ''}">
                <div class="cf-h-arrow-green">
                  <span class="cf-h-line-green"></span>
                  <span class="cf-h-head-green">➔</span>
                </div>
                <div class="cf-action-bubble ${evalResult.elifBranch ? 'action-active' : ''}">
                  <span class="cf-badge-bool true-badge">True</span>
                  <div class="cf-action-text">
                    ${isWb ? 'Ejecuta bloque elif y SALE ➔' : '<code>print("⚠️ ALERTA")</code> ➔ SALE'}
                  </div>
                </div>
              </div>
            </div>

            <!-- Flecha Vertical Roja: False (hacia else) -->
            <div class="cf-v-arrow-red ${isWb || evalResult.elseBranch ? 'v-active-false' : 'v-dimmed'}">
              <span class="cf-badge-bool false-badge">False</span>
              <div class="cf-v-stem-red"></div>
              <div class="cf-v-head-red">▼</div>
            </div>

            <!-- BLOQUE 3: ELSE -->
            <div class="cf-row-node" id="cf-row-else">
              <div class="cf-box-cond ${isWb ? 'box-whiteboard' : (evalResult.activeNode === 'else' ? 'box-active-true' : (evalResult.ifBranch || evalResult.elifBranch ? 'box-skipped' : ''))}">
                <span class="cf-keyword">else</span>
                <span class="cf-cond-expr">${isWb ? '(sin condición)' : '(por descarte)'}</span>
              </div>

              <!-- Salida Horizontal Verde: True -->
              <div class="cf-branch-right ${isWb || evalResult.elseBranch ? 'branch-active-true' : ''}">
                <div class="cf-h-arrow-green">
                  <span class="cf-h-line-green"></span>
                  <span class="cf-h-head-green">➔</span>
                </div>
                <div class="cf-action-bubble ${evalResult.elseBranch ? 'action-active' : ''}">
                  <span class="cf-badge-bool true-badge">True</span>
                  <div class="cf-action-text">
                    ${isWb ? 'Ejecuta bloque else y SALE ➔' : '<code>print("✅ ESTABLE")</code> ➔ SALE'}
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

        <!-- Panel de Narrativa y Reglas Mnemotécnicas -->
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
                <p>Python evalúa estrictamente en orden: primero <code>if</code>, luego los <code>elif</code> secuenciales y finalmente <code>else</code>.</p>
              </div>
            </div>
            <div class="cf-takeaway-item">
              <span class="cf-takeaway-icon">⚡</span>
              <div>
                <strong>Cortocircuito (Exclusión Mutua)</strong>
                <p>Tan pronto una condición es <code>True</code>, se ejecuta su bloque y se ignora el resto. Solo una rama puede ganar.</p>
              </div>
            </div>
            <div class="cf-takeaway-item">
              <span class="cf-takeaway-icon">🛡️</span>
              <div>
                <strong>El Bloque else es la Red de Seguridad</strong>
                <p>No lleva condición lógica; se activa automáticamente si ninguna de las condiciones anteriores fue verdadera.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const tabSim = document.getElementById("cf-tab-sim");
    const tabWb = document.getElementById("cf-tab-wb");
    const slider = document.getElementById("cf-fs-slider");
    const pills = document.querySelectorAll(".cf-pill-btn");

    if (tabSim) {
      tabSim.addEventListener("click", () => {
        state.mode = "simulator";
        renderWidget();
      });
    }

    if (tabWb) {
      tabWb.addEventListener("click", () => {
        state.mode = "whiteboard";
        renderWidget();
      });
    }

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
