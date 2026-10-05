/**
 * function-anatomy.js
 * Componente visual interactivo y conceptual integrado para la enseñanza de la Anatomía de Funciones (def) en Python.
 * Contexto Geotécnico: Cálculo de Resistencia al Esfuerzo Cortante (Mohr-Coulomb: tau = c + sigma * tan(phi))
 * 
 * Integra el esquema conceptual de la "Máquina de Cálculo" de pizarra con el simulador interactivo en tiempo real.
 */

(function () {
  let state = {
    c: 15.0,           // Cohesión en kPa
    sigma: 80.0,       // Esfuerzo normal en kPa
    phi: 28.0,         // Ángulo de fricción en grados
    preset: "talud",   // 'arena', 'arcilla', 'talud'
  };

  function calculateTau(c, sigma, phiDeg) {
    const phiRad = (phiDeg * Math.PI) / 180;
    const frictionalComponent = sigma * Math.tan(phiRad);
    const tau = c + frictionalComponent;
    return {
      phiRad,
      frictionalComponent,
      tau,
    };
  }

  function renderWidget() {
    const container = document.getElementById("function-anatomy-container");
    if (!container) return;

    const res = calculateTau(state.c, state.sigma, state.phi);
    const c = state.c.toFixed(1);
    const sigma = state.sigma.toFixed(1);
    const phi = state.phi.toFixed(1);
    const tau = res.tau.toFixed(2);
    const frictional = res.frictionalComponent.toFixed(2);

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Integrado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.4 &bull; Esquema de Pizarra &amp; Simulador en Tiempo Real</span>
            <h4 class="flow-title">⚙️ Anatomía de Funciones (<code>def</code>): La Máquina de Cálculo Geotécnico</h4>
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          Una función en Python opera como una <strong>máquina de cálculo encapsulada</strong>: recibe parámetros por sus compuertas de entrada, ejecuta la fórmula en su cámara aislada (<em>ámbito local indentado a 4 espacios</em>) y devuelve el resultado con <code>return</code> hacia la variable receptora:
        </p>

        <!-- Presets Geotécnicos de Suelo -->
        <div class="cf-presets" style="margin-top: 0.25rem;">
          <span class="cf-presets-label">Suelos Típicos de Referencia:</span>
          <button class="cf-pill-btn ${state.preset === 'arena' ? 'active-pill' : ''}" data-preset="arena">
            🏖️ Arena Limpia (c=0, φ=32°)
          </button>
          <button class="cf-pill-btn ${state.preset === 'arcilla' ? 'active-pill' : ''}" data-preset="arcilla">
            🏺 Arcilla Blanda (c=28, φ=12°)
          </button>
          <button class="cf-pill-btn ${state.preset === 'talud' ? 'active-pill' : ''}" data-preset="talud">
            ⛰️ Talud Ancón Norte (c=15, φ=28°)
          </button>
        </div>

        <!-- Sliders de Entrada de Parámetros -->
        <div class="discrete-pickers-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
          <div class="picker-column">
            <span class="picker-label">Cohesión <code>c</code>: <strong>${c} kPa</strong></span>
            <input type="range" min="0" max="50" step="1" value="${state.c}" id="slider-fn-c" class="flow-slider">
            <span style="font-size:0.7rem; color:var(--text-dim);">Resistencia intrínseca del macizo</span>
          </div>

          <div class="picker-column">
            <span class="picker-label">Esfuerzo Normal <code>sigma</code>: <strong>${sigma} kPa</strong></span>
            <input type="range" min="10" max="250" step="5" value="${state.sigma}" id="slider-fn-sigma" class="flow-slider">
            <span style="font-size:0.7rem; color:var(--text-dim);">Sobrecarga y confinamiento en la falla</span>
          </div>

          <div class="picker-column">
            <span class="picker-label">Ángulo de Fricción <code>phi</code>: <strong>${phi}°</strong></span>
            <input type="range" min="5" max="45" step="1" value="${state.phi}" id="slider-fn-phi" class="flow-slider">
            <span style="font-size:0.7rem; color:var(--text-dim);">Fricción intergranular entre partículas</span>
          </div>
        </div>

        <!-- Diagrama de Pizarra de la Máquina de Cálculo Viva -->
        <div class="wb-machine-diagram" style="margin-top: 0.5rem;">
          <!-- 1. Tuberías de Entrada (Parámetros) -->
          <div class="wb-machine-inputs">
            <div class="machine-pipe">
              <span class="pipe-label">Parámetro 1</span>
              <span class="pipe-val"><code>c = ${c}</code> kPa</span>
              <span class="pipe-arrow">▼</span>
            </div>
            <div class="machine-pipe">
              <span class="pipe-label">Parámetro 2</span>
              <span class="pipe-val"><code>sigma = ${sigma}</code> kPa</span>
              <span class="pipe-arrow">▼</span>
            </div>
            <div class="machine-pipe">
              <span class="pipe-label">Parámetro 3</span>
              <span class="pipe-val"><code>phi_grados = ${phi}</code>°</span>
              <span class="pipe-arrow">▼</span>
            </div>
          </div>

          <!-- 2. Cuerpo de la Función / Cámara de Procesamiento -->
          <div class="wb-machine-body">
            <div class="machine-header">
              <span class="def-badge">def</span>
              <span class="fn-name">calcular_resistencia</span>
              <span class="fn-params">(c, sigma, phi_grados):</span>
            </div>
            <div class="machine-chamber">
              <div class="chamber-badge">ÁMBITO LOCAL (Indentación obligatoria: 4 espacios)</div>
              <div class="chamber-step">
                <span class="step-line">1</span>
                <code>phi_rad = math.radians(phi_grados)</code>
                <span class="step-comment"># Conversión ➔ ${res.phiRad.toFixed(4)} rad</span>
              </div>
              <div class="chamber-step">
                <span class="step-line">2</span>
                <code>tau = c + sigma * math.tan(phi_rad)</code>
                <span class="step-comment"># Mohr-Coulomb ➔ ${c} + ${frictional}</span>
              </div>
              <div class="chamber-step return-step">
                <span class="step-line">3</span>
                <code>return tau</code>
                <span class="step-comment"># Expulsa ${tau} kPa al exterior</span>
              </div>
            </div>
          </div>

          <!-- 3. Salida y Asignación en el Programa Principal -->
          <div class="wb-machine-output">
            <span class="pipe-arrow">▼</span>
            <div class="output-reception">
              <span class="outlet-label">Variable Receptora en el Script Principal:</span>
              <code>resistencia = calcular_resistencia(${c}, ${sigma}, ${phi})</code>
              <span class="outlet-val">➔ <code>resistencia</code> recibe en memoria: <strong>${tau} kPa</strong> (Cohesión: ${c} kPa + Fricción: ${frictional} kPa)</span>
            </div>
          </div>
        </div>

        <!-- Pizarra Conceptual y Reglas de Oro -->
        <div class="idx-conceptual-footer">
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">🔑</span>
            <div class="idx-concept-text">
              <strong>Las 4 Partes Obligatorias de una Función:</strong><br>
              <code>def</code> para declarar &bull; Parámetros <code>(a, b)</code> como compuertas de entrada &bull; Dos puntos <code>:</code> e indentación de 4 espacios (ámbito local) &bull; <code>return</code> para devolver el dato a la memoria.
            </div>
          </div>
          <div class="idx-concept-pill-card">
            <span class="idx-concept-icon">⚠️</span>
            <div class="idx-concept-text">
              <strong>Diferencia Crucial: <code>print()</code> vs <code>return</code>:</strong><br>
              <code>print()</code> solo dibuja caracteres en la pantalla para el ojo humano.<br>
              <code>return</code> entrega el valor numérico a la variable receptora para poder usarlo en cálculos posteriores (como el Factor de Seguridad).
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const sC = document.getElementById("slider-fn-c");
    const sSigma = document.getElementById("slider-fn-sigma");
    const sPhi = document.getElementById("slider-fn-phi");

    if (sC) {
      sC.addEventListener("input", (e) => {
        state.c = parseFloat(e.target.value);
        state.preset = "custom";
        renderWidget();
      });
    }
    if (sSigma) {
      sSigma.addEventListener("input", (e) => {
        state.sigma = parseFloat(e.target.value);
        state.preset = "custom";
        renderWidget();
      });
    }
    if (sPhi) {
      sPhi.addEventListener("input", (e) => {
        state.phi = parseFloat(e.target.value);
        state.preset = "custom";
        renderWidget();
      });
    }

    // Presets
    document.querySelectorAll(".cf-pill-btn[data-preset]").forEach(btn => {
      btn.addEventListener("click", () => {
        const p = btn.dataset.preset;
        state.preset = p;
        if (p === "arena") {
          state.c = 0.0;
          state.sigma = 100.0;
          state.phi = 32.0;
        } else if (p === "arcilla") {
          state.c = 28.0;
          state.sigma = 60.0;
          state.phi = 12.0;
        } else if (p === "talud") {
          state.c = 15.0;
          state.sigma = 80.0;
          state.phi = 28.0;
        }
        renderWidget();
      });
    });
  }

  window.initFunctionAnatomyWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("function-anatomy-container")) {
      window.initFunctionAnatomyWidget();
    }
  });
})();
