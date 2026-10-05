/**
 * histogram-kde.js
 * Pizarra Conceptual y Simulador Interactivo para la Lección 2.7.
 * Histogramas, Estimación de Densidad Kernel (KDE) y Umbrales Paramétricos (μ ± kσ).
 *
 * Integra en un único lienzo:
 * 1. Pizarra conceptual: Distribución Normal, regla 68-95-99.7% y umbrales de desviación estándar.
 * 2. Simulador interactivo: Ajuste de bins, toggle de curva KDE, campana de Gauss y cotas μ ± kσ.
 * 3. Renderizado SVG de alta precisión con datos reales del sensor de humedad sh1 de Ancón Norte.
 */

(function () {
  const sh1Data = [60.0, 59.52, 56.29, 51.01, 50.29, 50.01, 49.88, 49.74, 53.14, 61.66, 61.73, 61.26, 59.64, 56.6, 53.91, 53.34, 53.06, 52.79, 52.61, 52.43, 52.38, 51.51, 50.04, 51.71, 51.5, 51.54, 52.62, 52.52, 52.4, 52.22, 53.96, 59.04, 60.27, 60.16, 58.86, 54.39, 53.07, 52.83, 52.48, 51.89, 51.87, 51.93, 52.05, 56.38, 60.21, 60.05, 57.75, 54.73, 59.07, 59.87, 60.09, 60.22, 59.31, 55.93, 52.72, 52.21, 52.15, 52.19, 52.12, 51.99, 51.76, 51.31, 51.06, 50.97, 50.94, 50.87, 50.78, 50.73, 51.71, 55.57, 58.91, 56.51, 51.8, 51.25, 51.0, 50.89, 50.8, 50.7, 50.56, 51.88, 56.55, 59.45, 59.3, 57.53, 53.17, 51.7, 51.38, 51.12, 50.84, 50.57, 51.27, 53.24, 54.91, 55.69, 56.36, 57.94, 56.29, 55.44, 60.94, 62.18, 62.0, 61.02, 61.07, 60.91, 59.95, 56.46, 52.95, 54.12, 58.69, 60.95, 60.95, 60.99, 61.25, 61.46, 61.69, 61.85, 61.86, 61.77, 61.68, 61.69, 61.8, 61.78, 61.81, 61.81, 61.86, 62.22, 61.03, 56.83, 56.46, 54.42, 52.4, 53.02, 54.82, 60.44, 61.49, 61.85, 61.89, 61.86, 61.81, 61.74, 61.59, 61.18, 58.85, 54.14, 53.21, 52.88, 52.61, 52.32, 52.13, 51.79, 51.24, 50.8, 50.42, 50.22, 52.7, 59.34, 60.71, 60.84, 60.92, 61.02, 60.94, 61.2, 62.21, 62.8, 62.8, 62.8, 62.8, 62.39, 61.43, 61.73, 62.45, 62.8, 62.6, 61.63, 59.97, 58.57, 57.6, 56.93, 56.92, 55.4, 58.37, 59.99, 58.37, 58.32, 59.78, 59.05, 55.68, 60.16, 60.44, 59.78, 59.44, 59.94, 59.63, 58.51, 56.47, 59.09, 58.19, 58.78, 60.39, 61.72, 61.76, 60.95, 57.55, 55.27, 54.0, 54.0, 54.0, 54.0, 54.0, 54.0, 54.0, 54.0, 54.01, 54.83, 57.26, 58.19, 57.51, 59.2, 62.8, 62.39, 61.8, 62.44, 61.1, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 60.0, 59.99, 58.9, 55.85, 54.74, 54.82, 55.32, 56.07, 54.63, 55.86, 56.79, 56.01, 56.19, 56.39, 54.49, 53.7, 54.96, 53.06, 55.53, 55.47, 58.3, 59.98, 61.26, 61.62, 62.42, 62.8, 62.8, 62.8, 62.8, 62.16, 59.24, 54.96, 52.02, 49.9, 48.7, 49.19, 51.25, 52.71, 51.25, 51.53, 52.95, 55.01, 54.47, 54.52, 52.9, 51.49, 51.41, 51.19, 51.0, 50.99, 51.23, 51.75, 51.57, 51.29, 51.11, 51.06, 51.29, 54.37, 60.37, 58.5, 53.39, 52.16, 51.78, 51.37, 51.18, 51.09, 50.99, 50.87, 50.78, 50.72, 50.69, 53.12, 59.44, 59.91, 56.72, 52.39, 51.83, 51.27, 51.13, 51.06, 50.92, 50.81, 50.75, 50.69, 50.61, 50.56, 50.51, 50.44, 50.37, 50.3, 50.24, 50.17, 50.12, 50.08, 50.03, 50.0, 50.02, 50.0, 49.96, 49.91, 49.83, 49.84, 50.0, 49.98, 49.91, 49.83, 49.72, 49.63, 49.54, 49.7, 51.03, 55.13, 60.21, 58.63, 56.67, 60.57, 58.98, 53.77, 53.41, 58.2, 59.07, 54.98, 51.69, 51.26, 53.35, 59.5, 57.92, 55.5, 60.95, 61.13, 61.32, 61.54, 61.77, 61.75, 61.65, 61.61, 61.62, 61.82, 62.04, 62.03, 62.04, 62.11, 62.42, 62.37, 62.49, 62.41, 62.45, 62.33, 62.24, 62.07, 60.54, 56.03, 52.77, 52.92, 55.29, 53.93, 54.77, 61.03, 61.16, 61.18, 61.19, 61.2, 61.23, 60.27, 56.43, 52.21, 51.92, 54.8, 58.82, 54.41, 51.57, 51.14, 50.89, 50.71, 50.57, 50.51, 50.47, 50.45, 51.36, 55.67, 60.82, 60.86, 60.92, 61.17, 61.61, 61.71, 61.75, 61.76, 61.84, 61.87, 61.86, 61.87, 61.8, 61.63, 61.45, 61.31, 61.15, 61.2, 61.69, 61.68, 61.37, 61.16, 61.06, 61.2, 61.09, 60.87, 60.79, 60.79, 60.7, 60.52, 60.45, 60.37, 60.51, 60.92];

  let state = {
    bins: 25,
    showKDE: true,
    showGauss: true,
    showSigmaLines: true,
  };

  function computeStats(arr) {
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const variance = arr.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) / (n - 1);
    const std = Math.sqrt(variance);
    const sorted = [...arr].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(n / 2)];

    return { n, mean, std, min, max, median };
  }

  function computeHistogram(arr, numBins, minVal, maxVal) {
    const binWidth = (maxVal - minVal) / numBins;
    const bins = Array.from({ length: numBins }, (_, i) => ({
      x0: minVal + i * binWidth,
      x1: minVal + (i + 1) * binWidth,
      count: 0,
      density: 0,
    }));

    arr.forEach(val => {
      let idx = Math.floor((val - minVal) / binWidth);
      if (idx >= numBins) idx = numBins - 1;
      if (idx < 0) idx = 0;
      bins[idx].count++;
    });

    const total = arr.length;
    bins.forEach(b => {
      b.density = b.count / (total * binWidth);
    });

    return { bins, binWidth };
  }

  function evaluateNormalPDF(x, mean, std) {
    return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  }

  function evaluateGaussianKDE(data, xGrid, std) {
    const n = data.length;
    // Ancho de banda de Silverman: h = 1.06 * std * n^(-1/5)
    const h = 1.06 * std * Math.pow(n, -0.2);
    return xGrid.map(x => {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - data[i]) / h;
        sum += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
      }
      return sum / (n * h);
    });
  }

  function renderWidget() {
    const container = document.getElementById("histogram-kde-container");
    if (!container) return;

    const stats = computeStats(sh1Data);
    const minRange = Math.floor(stats.min - 2);
    const maxRange = Math.ceil(stats.max + 8);
    const { bins } = computeHistogram(sh1Data, state.bins, minRange, maxRange);

    const maxHistDensity = Math.max(...bins.map(b => b.density));
    const maxGaussDensity = evaluateNormalPDF(stats.mean, stats.mean, stats.std);
    const maxDensity = Math.max(maxHistDensity, maxGaussDensity) * 1.15;

    // Dimensiones SVG
    const svgW = 660;
    const svgH = 310;
    const padL = 60;
    const padR = 30;
    const padT = 30;
    const padB = 55;
    const plotW = svgW - padL - padR;
    const plotH = svgH - padT - padB;

    function scaleX(val) {
      return padL + ((val - minRange) / (maxRange - minRange)) * plotW;
    }

    function scaleY(dens) {
      return padT + plotH - (dens / maxDensity) * plotH;
    }

    // Puntos de la curva teórica Gaussiana
    const gridPoints = 80;
    const xStep = (maxRange - minRange) / (gridPoints - 1);
    const xGrid = Array.from({ length: gridPoints }, (_, i) => minRange + i * xStep);
    
    const gaussPoints = xGrid.map(x => `${scaleX(x).toFixed(1)},${scaleY(evaluateNormalPDF(x, stats.mean, stats.std)).toFixed(1)}`).join(" ");

    // Puntos de la curva KDE
    const kdeDensities = evaluateGaussianKDE(sh1Data, xGrid, stats.std);
    const kdePoints = xGrid.map((x, i) => `${scaleX(x).toFixed(1)},${scaleY(kdeDensities[i]).toFixed(1)}`).join(" ");

    const mu = stats.mean;
    const s = stats.std;

    const u1 = mu + s;
    const u2 = mu + 2 * s;
    const u3 = mu + 3 * s;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <!-- Encabezado Unificado -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 2 &bull; Lección 2.7 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">📊 Histograma, Curva KDE y Campana de Gauss: Umbrales Paramétricos (&mu; &plusmn; k&sigma;)</h4>
          </div>
          <div class="bp-status-pill pill-ok">
            ✓ Sensor de Humedad sh1 &bull; N = ${stats.n} lecturas
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          A diferencia del método no paramétrico de Tukey (usado en deformación acumulada), los sensores continuos con comportamiento oscilatorio o estacional (como la humedad o el cabeceo del inclinómetro) pueden modelarse con una <strong>distribución normal</strong>. Esto permite definir umbrales de alerta según el número de desviaciones estándar (&sigma;) respecto a la media (&mu;).
        </p>

        <!-- 1. ESQUEMA CONCEPTUAL DE PIZARRA (REGLA EMPÍRICA Y UMBRALES) -->
        <div class="whiteboard-view" style="margin-top: 0.25rem;">
          <div class="wb-diagram-col">
            <div class="wb-title-badge">ZONIFICACIÓN PARAMÉTRICA: REGLA DE GAUSS (68 - 95 - 99.7%)</div>

            <div class="wb-bands-schematic">
              <!-- Emergencia 3-sigma -->
              <div class="schematic-band band-red">
                <div class="band-tag">🔴 UMBRAL DE EMERGENCIA (&gt; &mu; + 3&sigma; &bull; &gt; ${u3.toFixed(2)}%)</div>
                <div class="band-action">Probabilidad teórica &lt; 0.15% &bull; Anomalía extrema / Saturación destructiva de ladera</div>
                <code class="band-code">plt.axvline(media + 3 * desv, color='crimson', linestyle='--')</code>
              </div>

              <!-- Alerta 2-sigma -->
              <div class="schematic-band band-orange">
                <div class="band-tag">🟠 UMBRAL DE ALERTA (&mu; + 2&sigma; a &mu; + 3&sigma; &bull; ${u2.toFixed(2)}% a ${u3.toFixed(2)}%)</div>
                <div class="band-action">Supera el 95.4% de registros históricos &bull; Condición hídrica severa, aviso a comité técnico</div>
                <code class="band-code">plt.axvline(media + 2 * desv, color='orange', linestyle=':')</code>
              </div>

              <!-- Atención 1-sigma -->
              <div class="schematic-band band-yellow">
                <div class="band-tag">🟡 UMBRAL PREVENTIVO (&mu; + 1&sigma; a &mu; + 2&sigma; &bull; ${u1.toFixed(2)}% a ${u2.toFixed(2)}%)</div>
                <div class="band-action">Supera el 68.3% habitual &bull; Incremento estacional de humedad, verificación visual</div>
                <code class="band-code">plt.axvline(media + 1 * desv, color='gold', linestyle=':')</code>
              </div>

              <!-- Normal 1-sigma -->
              <div class="schematic-band band-green">
                <div class="band-tag">🟢 ZONA NORMAL / LÍMITE BASAL (&mu; - 1&sigma; a &mu; + 1&sigma; &bull; ${(mu - s).toFixed(2)}% a ${u1.toFixed(2)}%)</div>
                <div class="band-action">Régimen hídrico representativo del suelo en Ancón Norte (&mu; = ${mu.toFixed(2)}%)</div>
                <code class="band-code">plt.axvline(media, color='red', linestyle='--')</code>
              </div>
            </div>
          </div>

          <div class="wb-rules-col">
            <div class="wb-card-glass">
              <h5 style="color:var(--accent-primary); margin-top:0;">💡 Enfoque Paramétrico vs No Paramétrico</h5>
              <ul class="bullet-list" style="margin-top:8px; font-size:0.86em; gap:8px;">
                <li><strong>Histograma (<code>plt.hist</code>):</strong> Agrupa datos continuos en intervalos discretos (<code>bins</code>). Con <code>density=True</code>, el área total suma 1.</li>
                <li><strong>KDE (Densidad Kernel):</strong> Suaviza las frecuencias para revelar la función continua de densidad sin depender del ancho de los bines.</li>
                <li><strong>Campana de Gauss:</strong> Modela la distribución teórica con solo dos parámetros: media (&mu;) y dispersión (&sigma;).</li>
                <li><strong>¿Cuándo usar este método?:</strong> Válido para variables simétricas (humedad, cabeceo). No debe aplicarse a lluvia (asimetría extrema) ni a deformación creciente (requiere Tukey).</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO CON CONTROLES DINÁMICOS -->
        <div class="simulator-view" style="margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
            <strong style="font-size: 0.86rem; color: var(--text-main);">
              🎛️ Controles Interactivos de Visualización Paramétrica:
            </strong>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button id="btn-toggle-kde" class="bp-part-btn ${state.showKDE ? 'active' : ''}">
                ${state.showKDE ? '✓ KDE Activado' : '+ Activar KDE'}
              </button>
              <button id="btn-toggle-gauss" class="bp-part-btn ${state.showGauss ? 'active' : ''}">
                ${state.showGauss ? '✓ Gauss Normal' : '+ Activar Gauss'}
              </button>
              <button id="btn-toggle-sigmas" class="bp-part-btn ${state.showSigmaLines ? 'active' : ''}">
                ${state.showSigmaLines ? '✓ Umbrales &mu; &plusmn; k&sigma;' : '+ Mostrar &mu; &plusmn; k&sigma;'}
              </button>
            </div>
          </div>

          <!-- Slider de Bins -->
          <div class="slider-header-row" style="margin-bottom:0.5rem;">
            <span style="font-size:0.84rem; color:var(--text-muted);">Resolución del Histograma (<code>bins = ${state.bins}</code>):</span>
            <input type="range" min="10" max="40" step="5" value="${state.bins}" id="slider-hist-bins" class="flow-slider" style="max-width:280px;">
          </div>

          <!-- Lienzo SVG del Histograma + KDE + Gauss -->
          <div class="tb-graph-wrapper" style="overflow-x:auto;">
            <svg viewBox="0 0 ${svgW} ${svgH}" class="tb-svg" style="width:100%; height:auto; min-width:540px;">
              <!-- Cuadrícula horizontal tenue -->
              ${[0.25, 0.5, 0.75, 1.0].map(frac => {
                const y = padT + plotH * (1 - frac);
                const densVal = (maxDensity * frac).toFixed(3);
                return `
                  <line x1="${padL}" y1="${y}" x2="${svgW - padR}" y2="${y}" stroke="var(--border-subtle)" stroke-dasharray="3,3" opacity="0.6"/>
                  <text x="${padL - 8}" y="${y + 4}" class="svg-axis-txt" text-anchor="end" font-size="10">${densVal}</text>
                `;
              }).join("")}

              <!-- Barras del Histograma -->
              ${bins.map(b => {
                const bx = scaleX(b.x0);
                const bw = Math.max(1, scaleX(b.x1) - bx - 1);
                const by = scaleY(b.density);
                const bh = Math.max(0, padT + plotH - by);
                return `
                  <rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" 
                        fill="rgba(56, 189, 248, 0.45)" stroke="#0284c7" stroke-width="1" rx="1.5">
                    <title>Rango: ${b.x0.toFixed(1)} - ${b.x1.toFixed(1)}% | Densidad: ${b.density.toFixed(4)} | N: ${b.count}</title>
                  </rect>
                `;
              }).join("")}

              <!-- Curva Normal Teórica de Gauss -->
              ${state.showGauss ? `
                <polyline fill="none" stroke="#9333ea" stroke-width="2" stroke-dasharray="5,4" points="${gaussPoints}"/>
              ` : ''}

              <!-- Curva KDE Suavizada -->
              ${state.showKDE ? `
                <polyline fill="none" stroke="#1d4ed8" stroke-width="2.5" points="${kdePoints}"/>
              ` : ''}

              <!-- Líneas Verticales de Umbrales Paramétricos -->
              ${state.showSigmaLines ? `
                <!-- Media mu -->
                <line x1="${scaleX(mu)}" y1="${padT}" x2="${scaleX(mu)}" y2="${padT + plotH}" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,3"/>
                <text x="${scaleX(mu)}" y="${padT - 8}" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">&mu; (${mu.toFixed(1)}%)</text>

                <!-- mu + 1 sigma -->
                <line x1="${scaleX(u1)}" y1="${padT}" x2="${scaleX(u1)}" y2="${padT + plotH}" stroke="#ca8a04" stroke-width="1.8" stroke-dasharray="3,3"/>
                <text x="${scaleX(u1)}" y="${padT - 8}" fill="#ca8a04" font-size="9.5" font-weight="bold" text-anchor="middle">&mu;+1&sigma;</text>

                <!-- mu + 2 sigma -->
                <line x1="${scaleX(u2)}" y1="${padT}" x2="${scaleX(u2)}" y2="${padT + plotH}" stroke="#ea580c" stroke-width="2" stroke-dasharray="3,2"/>
                <text x="${scaleX(u2)}" y="${padT - 8}" fill="#ea580c" font-size="9.5" font-weight="bold" text-anchor="middle">&mu;+2&sigma;</text>

                <!-- mu + 3 sigma -->
                ${scaleX(u3) < (svgW - padR) ? `
                  <line x1="${scaleX(u3)}" y1="${padT}" x2="${scaleX(u3)}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,2"/>
                  <text x="${scaleX(u3)}" y="${padT - 8}" fill="#dc2626" font-size="9.5" font-weight="bold" text-anchor="middle">&mu;+3&sigma;</text>
                ` : ''}
              ` : ''}

              <!-- Ejes X e Y -->
              <line x1="${padL}" y1="${padT + plotH}" x2="${svgW - padR}" y2="${padT + plotH}" stroke="var(--border-subtle)" stroke-width="1.5"/>
              <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="var(--border-subtle)" stroke-width="1.5"/>

              <!-- Etiquetas del Eje X -->
              ${[45, 50, 55, 60, 65, 70].map(val => {
                const x = scaleX(val);
                if (x < padL || x > svgW - padR) return '';
                return `
                  <line x1="${x}" y1="${padT + plotH}" x2="${x}" y2="${padT + plotH + 5}" stroke="var(--border-subtle)" stroke-width="1"/>
                  <text x="${x}" y="${padT + plotH + 18}" class="svg-axis-txt" text-anchor="middle" font-size="11">${val}%</text>
                `;
              }).join("")}

              <!-- Rótulos de Ejes -->
              <text x="${padL + plotW / 2}" y="${svgH - 12}" fill="var(--text-main)" font-size="12" font-weight="bold" text-anchor="middle">
                Humedad Volumétrica del Suelo sh1 (%)
              </text>
              <text x="16" y="${padT + plotH / 2}" fill="var(--text-main)" font-size="11" font-weight="bold" text-anchor="middle" transform="rotate(-90 16 ${padT + plotH / 2})">
                Densidad de Probabilidad
              </text>
            </svg>
          </div>

          <!-- Píldoras de Estadísticas en Vivo -->
          <div class="tb-summary-cards" style="margin-top: 0.75rem;">
            <div class="tb-stat-pill pill-green">🟢 &mu; Media: <strong>${mu.toFixed(2)}%</strong></div>
            <div class="tb-stat-pill pill-green">📐 &sigma; Desv: <strong>${s.toFixed(2)}%</strong></div>
            <div class="tb-stat-pill pill-yellow">🟡 Preventivo (&mu;+1&sigma;): <strong>${u1.toFixed(2)}%</strong></div>
            <div class="tb-stat-pill pill-orange">🟠 Alerta (&mu;+2&sigma;): <strong>${u2.toFixed(2)}%</strong></div>
            <div class="tb-stat-pill pill-red">🔴 Emergencia (&mu;+3&sigma;): <strong>${u3.toFixed(2)}%</strong></div>
          </div>

          <!-- Código Python Generado Dinámicamente -->
          <div class="tb-code-footer" style="margin-top: 0.75rem;">
            <pre class="trace-pre"><code><span class="tok-comment"># Trazado de Histograma, KDE y Umbrales Paramétricos:</span>
humedad = df_ancon[<span class="tok-str">'sh1'</span>].dropna()
media, desv = humedad.mean(), humedad.std()

plt.figure(figsize=(9, 4.5))
plt.hist(humedad, bins=${state.bins}, density=True, color=<span class="tok-str">'#38bdf8'</span>, edgecolor=<span class="tok-str">'black'</span>, alpha=0.6, label=<span class="tok-str">'Histograma'</span>)
${state.showKDE ? `humedad.plot.kde(color=<span class="tok-str">'#1d4ed8'</span>, lw=2.5, label=<span class="tok-str">'Curva KDE'</span>)\n` : ''}${state.showGauss ? `<span class="tok-comment"># Curva teórica normal:</span>
x = np.linspace(humedad.min() - 2, humedad.max() + 8, 100)
plt.plot(x, norm.pdf(x, media, desv), color=<span class="tok-str">'purple'</span>, linestyle=<span class="tok-str">'--'</span>, label=<span class="tok-str">'Gauss Normal'</span>)\n` : ''}${state.showSigmaLines ? `plt.axvline(media, color=<span class="tok-str">'red'</span>, linestyle=<span class="tok-str">'--'</span>, label=f<span class="tok-str">'Media (μ = {media:.2f}%)'</span>)
plt.axvline(media + desv, color=<span class="tok-str">'gold'</span>, linestyle=<span class="tok-str">':'</span>, label=f<span class="tok-str">'Preventivo (μ+1σ = {media+desv:.2f}%)'</span>)
plt.axvline(media + 2 * desv, color=<span class="tok-str">'orange'</span>, linestyle=<span class="tok-str">':'</span>, label=f<span class="tok-str">'Alerta (μ+2σ = {media+2*desv:.2f}%)'</span>)` : ''}
plt.title(<span class="tok-str">'Distribución de Humedad sh1 y Umbrales Paramétricos'</span>, fontweight=<span class="tok-str">'bold'</span>)
plt.xlabel(<span class="tok-str">'Humedad Volumétrica (%)'</span>)
plt.ylabel(<span class="tok-str">'Densidad'</span>)
plt.legend()
plt.grid(True, linestyle=<span class="tok-str">'--'</span>, alpha=0.4)
plt.show()</code></pre>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const sBins = document.getElementById("slider-hist-bins");
    const bKde = document.getElementById("btn-toggle-kde");
    const bGauss = document.getElementById("btn-toggle-gauss");
    const bSigmas = document.getElementById("btn-toggle-sigmas");

    if (sBins) {
      sBins.addEventListener("input", (e) => {
        state.bins = parseInt(e.target.value, 10);
        renderWidget();
      });
    }

    if (bKde) {
      bKde.addEventListener("click", () => {
        state.showKDE = !state.showKDE;
        renderWidget();
      });
    }

    if (bGauss) {
      bGauss.addEventListener("click", () => {
        state.showGauss = !state.showGauss;
        renderWidget();
      });
    }

    if (bSigmas) {
      bSigmas.addEventListener("click", () => {
        state.showSigmaLines = !state.showSigmaLines;
        renderWidget();
      });
    }
  }

  window.initHistogramKdeWidget = function () {
    renderWidget();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("histogram-kde-container")) {
        window.initHistogramKdeWidget();
      }
    });
  } else {
    if (document.getElementById("histogram-kde-container")) {
      window.initHistogramKdeWidget();
    }
  }
})();
