/**
 * function-anatomy.js
 * Componente visual interactivo para la enseñanza de la Anatomía de Funciones (def) en Python.
 * Contexto Geotécnico: Cálculo de Resistencia al Esfuerzo Cortante (Mohr-Coulomb: tau = c + sigma * tan(phi))
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
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

    let contentHtml = "";
    if (state.mode === "whiteboard") {
      contentHtml = renderWhiteboardMode();
    } else {
      contentHtml = renderSimulatorMode(res);
    }

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.4</span>
            <h4 class="flow-title">Anatomía de Funciones (<code>def</code>): La Máquina de Cálculo Geotécnico</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="fn-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="fn-mode-wb">
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
          <div class="wb-title-badge">ANATOMÍA DE UNA FUNCIÓN EN PYTHON: <code>def</code></div>

          <!-- Diagrama de Máquina de Cálculo -->
          <div class="wb-machine-diagram">
            <!-- Entradas (Inlets) -->
            <div class="wb-machine-inputs">
              <div class="machine-pipe">
                <span class="pipe-label">Parámetro 1</span>
                <span class="pipe-val"><code>c</code> (Cohesión, kPa)</span>
                <span class="pipe-arrow">▼</span>
              </div>
              <div class="machine-pipe">
                <span class="pipe-label">Parámetro 2</span>
                <span class="pipe-val"><code>sigma</code> (Esfuerzo, kPa)</span>
                <span class="pipe-arrow">▼</span>
              </div>
              <div class="machine-pipe">
                <span class="pipe-label">Parámetro 3</span>
                <span class="pipe-val"><code>phi_grados</code> (Ángulo, °)</span>
                <span class="pipe-arrow">▼</span>
              </div>
            </div>

            <!-- Cuerpo / Cámara de la Máquina -->
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
                  <span class="step-comment"># Convierte grados a radianes</span>
                </div>
                <div class="chamber-step">
                  <span class="step-line">2</span>
                  <code>tau = c + sigma * math.tan(phi_rad)</code>
                  <span class="step-comment"># Aplica Mohr-Coulomb</span>
                </div>
                <div class="chamber-step return-step">
                  <span class="step-line">3</span>
                  <code>return tau</code>
                  <span class="step-comment"># Expulsa el resultado al exterior</span>
                </div>
              </div>
            </div>

            <!-- Salida (Outlet) -->
            <div class="wb-machine-output">
              <span class="pipe-arrow">▼</span>
              <div class="output-reception">
                <span class="outlet-label">Variable Receptora en el Programa Principal:</span>
                <code>resistencia = calcular_resistencia(15, 80, 28)</code>
                <span class="outlet-val">➔ <code>resistencia</code> recibe <strong>57.54 kPa</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-emerald); margin-top:0;">🔑 Las 4 Partes Obligatorias</h5>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:10px;">
              <li><strong>1. Palabra clave <code>def</code>:</strong> Notifica al intérprete de Python que se está creando una nueva herramienta reutilizable.</li>
              <li><strong>2. Parámetros <code>(a, b, ...)</code>:</strong> Las variables de entrada que alimentan a la máquina. Solo existen mientras la función se ejecuta.</li>
              <li><strong>3. Dos puntos <code>:</code> e Indentación:</strong> Todo el código que pertenezca a la máquina debe tener una sangría fija (4 espacios).</li>
              <li><strong>4. Sentencia <code>return</code>:</strong> La compuerta de salida. Si la olvidas, la función realiza el cálculo pero devuelve <code>None</code>.</li>
            </ul>
          </div>

          <div class="wb-card-glass" style="margin-top:14px; border-left:3px solid var(--accent-amber);">
            <h5 style="color:var(--accent-amber); margin-top:0;">⚠️ Diferencia Crucial: <code>print()</code> vs <code>return</code></h5>
            <p style="font-size:0.85em; color:var(--text-muted); margin:0;">
              <code>print()</code> solo muestra un texto en la consola para el ojo humano.<br>
              <code>return</code> entrega el dato en memoria para que pueda ser guardado en una variable y usado en cálculos posteriores de Factor de Seguridad (FS).
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode(res) {
    const c = state.c.toFixed(1);
    const sigma = state.sigma.toFixed(1);
    const phi = state.phi.toFixed(1);
    const tau = res.tau.toFixed(2);
    const frictional = res.frictionalComponent.toFixed(2);

    return `
      <div class="simulator-view animate-fade-in">
        <div class="fn-simulator-grid">
          <!-- Columna Izquierda: Parámetros y Presets -->
          <div class="fn-controls-col">
            <div class="fn-presets-group">
              <label class="fn-group-title">Suelos Típicos de Referencia:</label>
              <div class="fn-presets-buttons">
                <button class="fn-preset-btn ${state.preset === 'arena' ? 'active' : ''}" data-preset="arena">
                  🏖️ Arena Limpia
                </button>
                <button class="fn-preset-btn ${state.preset === 'arcilla' ? 'active' : ''}" data-preset="arcilla">
                  🏺 Arcilla Blanda
                </button>
                <button class="fn-preset-btn ${state.preset === 'talud' ? 'active' : ''}" data-preset="talud">
                  ⛰️ Suelo de Talud
                </button>
              </div>
            </div>

            <div class="fn-sliders-container">
              <div class="slider-field">
                <div class="slider-header-row">
                  <span>Cohesión <code>c</code>:</span>
                  <strong class="slider-val-badge">${c} kPa</strong>
                </div>
                <input type="range" min="0" max="50" step="1" value="${state.c}" id="slider-fn-c" class="flow-slider">
                <span class="slider-hint">Resistencia intrínseca debida a cementación / electroquímica</span>
              </div>

              <div class="slider-field">
                <div class="slider-header-row">
                  <span>Esfuerzo Normal <code>sigma</code>:</span>
                  <strong class="slider-val-badge">${sigma} kPa</strong>
                </div>
                <input type="range" min="10" max="250" step="5" value="${state.sigma}" id="slider-fn-sigma" class="flow-slider">
                <span class="slider-hint">Sobrecarga y peso propio del suelo sobre el plano de falla</span>
              </div>

              <div class="slider-field">
                <div class="slider-header-row">
                  <span>Ángulo de Fricción <code>phi</code>:</span>
                  <strong class="slider-val-badge">${phi}°</strong>
                </div>
                <input type="range" min="5" max="45" step="1" value="${state.phi}" id="slider-fn-phi" class="flow-slider">
                <span class="slider-hint">Traba mecánica y rozamiento entre partículas de suelo</span>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Trazado en Vivo de la Función -->
          <div class="fn-trace-col">
            <div class="fn-code-trace-card">
              <div class="trace-header">
                <span class="trace-tag">EJECUCIÓN EN TIEMPO REAL</span>
                <span class="trace-tag-right">Python 3.11</span>
              </div>
              <pre class="trace-pre"><code><span class="tok-kw">import</span> math

<span class="tok-kw">def</span> <span class="tok-fn">calcular_resistencia_corte</span>(c, sigma, phi_grados):
    <span class="tok-comment"># 1. Conversión angular: phi = ${phi}°</span>
    phi_rad = math.radians(phi_grados)  <span class="tok-live-comment"># ➔ ${res.phiRad.toFixed(4)} rad</span>
    
    <span class="tok-comment"># 2. Resistencia por fricción (sigma * tan(phi))</span>
    friccion = sigma * math.tan(phi_rad) <span class="tok-live-comment"># ➔ ${frictional} kPa</span>
    
    <span class="tok-comment"># 3. Suma total de Mohr-Coulomb</span>
    tau = c + friccion                  <span class="tok-live-comment"># ➔ ${c} + ${frictional}</span>
    
    <span class="tok-kw">return</span> tau

<span class="tok-comment"># Invocación con los valores de los controles:</span>
tau_disponible = <span class="tok-fn">calcular_resistencia_corte</span>(${c}, ${sigma}, ${phi})</code></pre>

              <div class="fn-result-banner">
                <div class="result-label">Resistencia Cortante Retornada (<code>tau</code>):</div>
                <div class="result-number">${tau} <span class="result-unit">kPa</span></div>
                <div class="result-breakdown">
                  Cohesión pura: <strong>${c} kPa</strong> (${((state.c / res.tau) * 100 || 0).toFixed(0)}%) + 
                  Fricción confinada: <strong>${frictional} kPa</strong> (${((res.frictionalComponent / res.tau) * 100 || 0).toFixed(0)}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("fn-mode-sim");
    const btnWb = document.getElementById("fn-mode-wb");

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

    // Sliders
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
    document.querySelectorAll(".fn-preset-btn").forEach(btn => {
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
