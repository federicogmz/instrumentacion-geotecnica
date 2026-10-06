/**
 * correlation-matrix.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.6.
 * Matrices de Correlación Multivariables (Pearson vs. Spearman) con Heatmap.
 */

(function () {
  let state = {
    method: "pearson", // 'pearson' o 'spearman'
  };

  const sensors = ["p1", "sh1", "C1", "B1", "Tem_1", "DE1"];

  const pearsonData = {
    "p1":    { "p1": 1.0,  "sh1": 0.26,  "C1": 0.09,  "B1": -0.05, "Tem_1": -0.37, "DE1": -0.05 },
    "sh1":   { "p1": 0.26, "sh1": 1.0,   "C1": 0.38,  "B1": -0.26, "Tem_1": -0.42, "DE1": -0.00 },
    "C1":    { "p1": 0.09, "sh1": 0.38,  "C1": 1.0,   "B1": -0.91, "Tem_1": -0.14, "DE1": -0.03 },
    "B1":    { "p1": -0.05,"sh1": -0.26, "C1": -0.91, "B1": 1.0,   "Tem_1": 0.12,  "DE1": 0.05 },
    "Tem_1": { "p1": -0.37,"sh1": -0.42, "C1": -0.14, "B1": 0.12,  "Tem_1": 1.0,   "DE1": -0.00 },
    "DE1":   { "p1": -0.05,"sh1": -0.00, "C1": -0.03, "B1": 0.05,  "Tem_1": -0.00, "DE1": 1.0 }
  };

  const spearmanData = {
    "p1":    { "p1": 1.0,  "sh1": 0.30,  "C1": 0.19,  "B1": -0.18, "Tem_1": -0.47, "DE1": 0.18 },
    "sh1":   { "p1": 0.30, "sh1": 1.0,   "C1": 0.35,  "B1": -0.19, "Tem_1": -0.43, "DE1": 0.12 },
    "C1":    { "p1": 0.19, "sh1": 0.35,  "C1": 1.0,   "B1": -0.85, "Tem_1": -0.09, "DE1": 0.69 },
    "B1":    { "p1": -0.18,"sh1": -0.19, "C1": -0.85, "B1": 1.0,   "Tem_1": 0.06,  "DE1": -0.83 },
    "Tem_1": { "p1": -0.47,"sh1": -0.43, "C1": -0.09, "B1": 0.06,  "Tem_1": 1.0,   "DE1": -0.06 },
    "DE1":   { "p1": 0.18, "sh1": 0.12,  "C1": 0.69,  "B1": -0.83, "Tem_1": -0.06, "DE1": 1.0 }
  };

  function getColor(val) {
    // Escala coolwarm aproximada: -1 azul, 0 blanco/gris tenue, +1 rojo
    if (val >= 0) {
      const alpha = Math.min(1, Math.max(0.1, val));
      return `rgba(239, 68, 68, ${alpha * 0.75})`;
    } else {
      const alpha = Math.min(1, Math.max(0.1, Math.abs(val)));
      return `rgba(59, 130, 246, ${alpha * 0.75})`;
    }
  }

  function renderWidget() {
    const container = document.getElementById("correlation-matrix-container");
    if (!container) return;

    const isPearson = state.method === "pearson";
    const currentMat = isPearson ? pearsonData : spearmanData;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.6 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">🔗 Matriz de Correlación: Pearson (Lineal) vs. Spearman (Monotónico)</h4>
          </div>
          <div class="bp-status-pill ${isPearson ? 'pill-cyan' : 'pill-ok'}">
            ${isPearson ? '📐 Pearson: Coeficiente Lineal (r)' : '✨ Spearman: Coeficiente de Rangos (ρ)'}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          <strong>Lección Geotécnica Clave:</strong> Compara la correlación entre el cabeceo (<code>C1</code>) y la deformación (<code>DE1</code>).
          En Pearson es casi nula (<code>-0.03</code>) porque la relación física no es una recta. En Spearman salta a <strong>+0.69</strong> (y con <code>B1</code> a <strong>-0.83</strong>), revelando que cuando el talud rota, la grieta se abre de manera continua y monótona.
        </p>

        <!-- Selector de Método -->
        <div style="display:flex; gap:0.5rem; margin: 0.85rem 0; flex-wrap:wrap;">
          <button id="btn-corr-pearson" class="bp-part-btn ${isPearson ? 'active' : ''}">
            📏 Pearson (.corr(method='pearson'))
          </button>
          <button id="btn-corr-spearman" class="bp-part-btn ${!isPearson ? 'active' : ''}">
            📈 Spearman (.corr(method='spearman'))
          </button>
        </div>

        <!-- Heatmap en Grid CSS -->
        <div style="overflow-x:auto; margin:0.5rem 0;">
          <div style="display:grid; grid-template-columns: 70px repeat(${sensors.length}, minmax(50px, 1fr)); gap:3px; min-width:440px; text-align:center; font-size:0.8rem;">
            <!-- Header Row -->
            <div style="font-weight:bold; color:var(--text-muted); padding:6px;">Sensor</div>
            ${sensors.map(s => `<div style="font-weight:bold; color:var(--text-main); background:var(--bg-card); padding:6px; border-radius:3px;">${s}</div>`).join('')}

            <!-- Data Rows -->
            ${sensors.map(rowSensor => `
              <div style="font-weight:bold; color:var(--text-main); background:var(--bg-card); padding:8px 4px; display:flex; align-items:center; justify-content:center; border-radius:3px;">
                ${rowSensor}
              </div>
              ${sensors.map(colSensor => {
                const val = currentMat[rowSensor][colSensor];
                const bg = getColor(val);
                const highlight = (!isPearson && ((rowSensor === 'C1' && colSensor === 'DE1') || (rowSensor === 'B1' && colSensor === 'DE1')));
                return `
                  <div style="background:${bg}; padding:8px 4px; border-radius:3px; font-weight:${highlight ? 'bold' : 'normal'}; border:${highlight ? '2px solid #22c55e' : 'none'};" 
                       title="${rowSensor} vs ${colSensor}: ${val}">
                    ${val.toFixed(2)}
                  </div>
                `;
              }).join('')}
            `).join('')}
          </div>
        </div>

        <!-- Tarjetas comparativas -->
        <div class="tb-summary-cards" style="margin-top:0.75rem;">
          <div class="tb-stat-pill pill-cyan">Inclinación C1 vs DE1 (Pearson): <strong>-0.03 (Ciego a no-linealidad)</strong></div>
          <div class="tb-stat-pill pill-green">Inclinación C1 vs DE1 (Spearman): <strong>+0.69 (Fuerte correlación monótona)</strong></div>
        </div>

        <!-- Código Python generado -->
        <div class="tb-code-footer" style="margin-top:0.75rem;">
          <pre class="trace-pre"><code><span class="tok-comment"># Matriz de correlación ${isPearson ? 'lineal de Pearson' : 'monotónica de Spearman'}:</span>
cols = [<span class="tok-str">'p1'</span>, <span class="tok-str">'sh1'</span>, <span class="tok-str">'C1'</span>, <span class="tok-str">'B1'</span>, <span class="tok-str">'Tem_1'</span>, <span class="tok-str">'DE1'</span>]
matriz_corr = df_activo[cols].corr(method=<span class="tok-str">'${isPearson ? 'pearson' : 'spearman'}'</span>)

<span class="tok-comment"># Visualización de mapa de calor (Heatmap) con Matplotlib:</span>
plt.figure(figsize=(8, 6))
plt.imshow(matriz_corr, cmap=<span class="tok-str">'coolwarm'</span>, vmin=-1, vmax=1)
plt.colorbar()
plt.xticks(range(len(cols)), cols, rotation=45)
plt.yticks(range(len(cols)), cols)
plt.title(<span class="tok-str">'Matriz de Correlación de ${isPearson ? 'Pearson' : 'Spearman'}'</span>, fontweight=<span class="tok-str">'bold'</span>)
plt.tight_layout()
plt.show()</code></pre>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const bP = document.getElementById("btn-corr-pearson");
    const bS = document.getElementById("btn-corr-spearman");

    if (bP) bP.addEventListener("click", () => { state.method = "pearson"; renderWidget(); });
    if (bS) bS.addEventListener("click", () => { state.method = "spearman"; renderWidget(); });
  }

  window.initCorrelationMatrixWidget = function () { renderWidget(); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("correlation-matrix-container")) window.initCorrelationMatrixWidget();
    });
  } else {
    if (document.getElementById("correlation-matrix-container")) window.initCorrelationMatrixWidget();
  }
})();
