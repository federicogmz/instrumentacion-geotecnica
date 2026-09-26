/**
 * dual-axis-rain.js
 * Componente visual interactivo para la enseñanza de Gráficas de Doble Eje con Lluvia Invertida (twinx + invert_yaxis).
 * Contexto Geotécnico: Correlación física entre tormentas (lluvia que cae) y nivel freático (presión que sube).
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    isInverted: true,
  };

  const days = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"];
  const rain = [0, 5, 28, 45, 12, 2, 0, 18, 35, 5];       // Lluvia en mm
  const piezo = [12.0, 12.2, 14.5, 19.8, 22.4, 21.0, 19.5, 20.2, 24.1, 23.5]; // Presión en kPa

  function renderWidget() {
    const container = document.getElementById("dual-axis-rain-container");
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
            <span class="flow-badge">Módulo 2 &bull; Lección 2.4</span>
            <h4 class="flow-title">Perfil Geotécnico: Doble Eje con Lluvia Invertida (<code>twinx</code>)</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="da-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="da-mode-wb">
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
          <div class="wb-title-badge">EL PERFIL FÍSICO LADERA - ATMÓSFERA</div>

          <div class="wb-dual-axis-schematic">
            <!-- Cielo / Atmósfera -->
            <div class="da-zone zone-atmosphere">
              <div class="zone-tag">☁️ ATMÓSFERA (Eje Secundario Y2 - Invertido)</div>
              <div class="zone-desc">
                Las barras de lluvia <strong>caen desde el techo</strong> (0 mm arriba, 50 mm abajo).<br>
                <code>ax2 = ax1.twinx()</code> &bull; <code>ax2.invert_yaxis()</code>
              </div>
            </div>

            <!-- Infiltración -->
            <div class="da-zone-divider">
              <span>▼ Infiltración de Agua en la Ladera ▼</span>
            </div>

            <!-- Suelo / Piezómetro -->
            <div class="da-zone zone-subsoil">
              <div class="zone-tag">⛰️ SUBSUELO (Eje Primario Y1 - Normal)</div>
              <div class="zone-desc">
                La curva de presión de poros <strong>sube desde el suelo</strong> (0 kPa abajo, 30 kPa arriba).<br>
                <code>ax1.plot(fechas, presion_poros, color='red')</code>
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-blue); margin-top:0;">💡 ¿Por qué es el Estándar Internacional?</h5>
            <ul class="bullet-list" style="margin-top:10px; font-size:0.88em; gap:10px;">
              <li><strong>Desacoplamiento Visual:</strong> Si la lluvia y el piezómetro suben desde la misma base (Y=0), las barras de lluvia tapan la curva del sensor creando confusión visual.</li>
              <li><strong>Lectura Intuitiva:</strong> Refleja la física natural: la lluvia se precipita desde el cielo y la presión en el talud responde elevándose.</li>
              <li><strong>Escalas Independientes:</strong> La lluvia se mide en milímetros (mm) y la presión en kilopascales (kPa) o metros de columna de agua (m.c.a.). <code>twinx()</code> comparte el eje X (fechas) con dos escalas Y distintas.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const inv = state.isInverted;

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Control de Inversión de Eje -->
        <div class="da-sim-toolbar">
          <div class="da-toggle-group">
            <span class="da-label">Configuración del Eje de Lluvia (<code>ax2</code>):</span>
            <button class="da-btn ${inv ? 'active' : ''}" id="da-btn-invert">
              ${inv ? '🌧️ Lluvia Invertida Activa (ax2.invert_yaxis())' : '⚠️ Lluvia Normal (Sin Invertir - Se Solapan)'}
            </button>
          </div>

          <div class="da-badge-state ${inv ? 'badge-ok' : 'badge-warn'}">
            ${inv ? '✨ Estándar Geotécnico Limpio' : '❌ Curvas Solapadas'}
          </div>
        </div>

        <!-- Gráfico SVG Interactivo con Doble Eje -->
        <div class="da-graph-card">
          <svg viewBox="0 0 520 250" class="da-svg">
            <!-- Fondo y Cuadrícula -->
            <rect x="50" y="20" width="420" height="190" fill="var(--bg-card)" stroke="var(--border-subtle)" />
            
            <!-- Eje X -->
            <line x1="50" y1="210" x2="470" y2="210" stroke="var(--border-subtle)" stroke-width="1.5" />

            <!-- Eje Y1 Izquierdo (Piezómetro - Rojo/Cian) -->
            <line x1="50" y1="20" x2="50" y2="210" stroke="#f43f5e" stroke-width="2" />
            <text x="42" y="210" class="svg-axis-txt" fill="#f43f5e" text-anchor="end">0 kPa</text>
            <text x="42" y="115" class="svg-axis-txt" fill="#f43f5e" text-anchor="end">15 kPa</text>
            <text x="42" y="28" class="svg-axis-txt" fill="#f43f5e" text-anchor="end">30 kPa</text>

            <!-- Eje Y2 Derecho (Lluvia - Azul) -->
            <line x1="470" y1="20" x2="470" y2="210" stroke="#38bdf8" stroke-width="2" />
            ${inv ? `
              <text x="478" y="28" class="svg-axis-txt" fill="#38bdf8">0 mm</text>
              <text x="478" y="115" class="svg-axis-txt" fill="#38bdf8">25 mm</text>
              <text x="478" y="210" class="svg-axis-txt" fill="#38bdf8">50 mm</text>
            ` : `
              <text x="478" y="210" class="svg-axis-txt" fill="#38bdf8">0 mm</text>
              <text x="478" y="115" class="svg-axis-txt" fill="#38bdf8">25 mm</text>
              <text x="478" y="28" class="svg-axis-txt" fill="#38bdf8">50 mm</text>
            `}

            <!-- Barras de Lluvia (ax2) -->
            ${rain.map((r, i) => {
              const x = 65 + i * 40;
              const barW = 20;
              const barH = (r / 50) * 160;

              if (inv) {
                // Invertido: Cuelga desde arriba (y=20 hacia abajo)
                return `
                  <rect x="${x}" y="20" width="${barW}" height="${barH}" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="1" />
                `;
              } else {
                // Normal: Crece desde abajo (y=210 hacia arriba)
                return `
                  <rect x="${x}" y="${210 - barH}" width="${barW}" height="${barH}" fill="rgba(56, 189, 248, 0.4)" stroke="#38bdf8" stroke-width="1" />
                `;
              }
            }).join('')}

            <!-- Curva Piezométrica (ax1) -->
            <polyline 
              fill="none" 
              stroke="#f43f5e" 
              stroke-width="3" 
              points="${piezo.map((p, i) => `${75 + i * 40},${210 - (p / 30) * 190}`).join(' ')}" 
            />

            <!-- Puntos de Piezómetro -->
            ${piezo.map((p, i) => {
              const cx = 75 + i * 40;
              const cy = 210 - (p / 30) * 190;
              return `
                <circle cx="${cx}" cy="${cy}" r="4" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5" />
                <text x="${cx}" y="226" class="svg-axis-txt" text-anchor="middle">${days[i]}</text>
              `;
            }).join('')}
          </svg>
        </div>

        <!-- Código Matplotlib en Vivo -->
        <div class="da-code-footer">
          <pre class="trace-pre"><code><span class="tok-comment"># 1. Crear figura y eje primario para el sensor (curva continua):</span>
fig, ax1 = plt.subplots(figsize=(10, 5))
ax1.plot(df.index, df[<span class="tok-str">'presion_kpa'</span>], color=<span class="tok-str">'#f43f5e'</span>, lw=2.5, label=<span class="tok-str">'Piezómetro'</span>)
ax1.set_ylabel(<span class="tok-str">'Presión de Poros (kPa)'</span>, color=<span class="tok-str">'#f43f5e'</span>)

<span class="tok-comment"># 2. Crear eje secundario clonado compartiendo el tiempo X:</span>
ax2 = ax1.twinx()
ax2.bar(df.index, df[<span class="tok-str">'lluvia_mm'</span>], color=<span class="tok-str">'#38bdf8'</span>, alpha=0.4, width=0.4, label=<span class="tok-str">'Lluvia'</span>)
ax2.set_ylabel(<span class="tok-str">'Precipitación (mm)'</span>, color=<span class="tok-str">'#38bdf8'</span>)
${inv ? `ax2.invert_yaxis()  <span class="tok-live-comment"># ➔ ¡Lluvia invertida desde el techo!</span>` : `<span class="tok-comment"># ax2.invert_yaxis()  (Desactivado)</span>`}</code></pre>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("da-mode-sim");
    const btnWb = document.getElementById("da-mode-wb");

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

    const btnToggle = document.getElementById("da-btn-invert");
    if (btnToggle) {
      btnToggle.addEventListener("click", () => {
        state.isInverted = !state.isInverted;
        renderWidget();
      });
    }
  }

  window.initDualAxisRainWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("dual-axis-rain-container")) {
      window.initDualAxisRainWidget();
    }
  });
})();
