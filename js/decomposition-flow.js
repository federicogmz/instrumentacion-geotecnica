/**
 * decomposition-flow.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.5.
 * Descomposición de Series Temporales (Tendencia, Estacionalidad y Residuo) con statsmodels.
 */

(function () {
  let state = {
    showTrend: true,
    showSeasonal: true,
    showResid: true,
  };

  const timeAxis = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  // Señal sintética representativa de C1 (inclinómetro de cabeceo en Ancón Norte)
  const baseTrend = [1.8, 1.85, 1.9, 1.95, 2.0, 2.05, 2.1, 2.15, 2.2, 2.25, 2.3, 2.35]; // Rotación progresiva
  const baseSeason = [0.15, 0.2, 0.1, -0.05, -0.15, -0.2, -0.15, -0.05, 0.1, 0.15, 0.1, 0.05]; // Efecto térmico
  const baseResid = [0.0, 0.02, -0.01, 0.0, 0.25, -0.02, 0.0, 0.01, -0.01, 0.35, 0.0, -0.01]; // Picos anómalos (Mayo y Octubre)

  function renderWidget() {
    const container = document.getElementById("decomposition-flow-container");
    if (!container) return;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.5 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">🔄 Descomposición Aditiva: Y(t) = Tendencia(t) + Estacionalidad(t) + Residuo(t)</h4>
          </div>
          <div class="bp-status-pill pill-alert">
            🚨 2 Anomalías Residuales Detectadas (Mayo y Octubre)
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          Una serie de tiempo de instrumentación geotécnica (como el cabeceo <code>C1</code>) combina tres fenómenos físicos independientes.
          Al descomponerla con <code>seasonal_decompose</code>, aislamos la <strong>rotación real del talud</strong> de los <strong>ciclos térmicos</strong> y del <strong>ruido o eventos súbitos</strong>.
        </p>

        <!-- Controles de Capas -->
        <div style="display:flex; gap:0.5rem; margin: 0.85rem 0; flex-wrap:wrap;">
          <button id="btn-dec-trend" class="bp-part-btn ${state.showTrend ? 'active' : ''}">
            ${state.showTrend ? '✓ Tendencia Activa' : '+ Mostrar Tendencia'}
          </button>
          <button id="btn-dec-season" class="bp-part-btn ${state.showSeasonal ? 'active' : ''}">
            ${state.showSeasonal ? '✓ Estacionalidad Activa' : '+ Mostrar Estacionalidad'}
          </button>
          <button id="btn-dec-resid" class="bp-part-btn ${state.showResid ? 'active' : ''}">
            ${state.showResid ? '✓ Residuo Activo' : '+ Mostrar Residuo'}
          </button>
        </div>

        <!-- 4 Paneles Alineados -->
        <div style="display:flex; flex-direction:column; gap:0.5rem; margin: 0.5rem 0;">
          <!-- Panel 1: Original -->
          <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.6rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; color:#0284c7; margin-bottom:4px;">
              <span>1. Señal Original Y(t) [C1]</span>
              <span>Inclinación Bruta</span>
            </div>
            <svg viewBox="0 0 500 50" class="tb-svg" style="width:100%; height:45px;">
              <polyline fill="none" stroke="#0284c7" stroke-width="2" points="${timeAxis.map((_, i) => `${30 + i * 40},${40 - (baseTrend[i] + baseSeason[i] + baseResid[i] - 1.5) * 30}`).join(' ')}"/>
            </svg>
          </div>

          <!-- Panel 2: Tendencia -->
          ${state.showTrend ? `
          <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-left:3px solid #16a34a; border-radius:var(--radius-sm); padding:0.6rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; color:#16a34a; margin-bottom:4px;">
              <span>2. Tendencia T(t) &bull; Rotación Irreversible del Talud</span>
              <span>Crecimiento plástico continuo</span>
            </div>
            <svg viewBox="0 0 500 45" class="tb-svg" style="width:100%; height:40px;">
              <polyline fill="none" stroke="#16a34a" stroke-width="2.5" points="${timeAxis.map((_, i) => `${30 + i * 40},${40 - (baseTrend[i] - 1.7) * 45}`).join(' ')}"/>
            </svg>
          </div>` : ''}

          <!-- Panel 3: Estacionalidad -->
          ${state.showSeasonal ? `
          <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-left:3px solid #9333ea; border-radius:var(--radius-sm); padding:0.6rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; color:#9333ea; margin-bottom:4px;">
              <span>3. Estacionalidad S(t) &bull; Ciclo Térmico / Ambiental</span>
              <span>Oscilación periódica repetitiva</span>
            </div>
            <svg viewBox="0 0 500 45" class="tb-svg" style="width:100%; height:40px;">
              <line x1="20" y1="22" x2="480" y2="22" stroke="var(--border-subtle)" stroke-dasharray="3,3"/>
              <polyline fill="none" stroke="#9333ea" stroke-width="2" points="${timeAxis.map((_, i) => `${30 + i * 40},${22 - baseSeason[i] * 60}`).join(' ')}"/>
            </svg>
          </div>` : ''}

          <!-- Panel 4: Residuo -->
          ${state.showResid ? `
          <div style="background:rgba(239, 68, 68, 0.05); border:1px solid rgba(239, 68, 68, 0.25); border-left:3px solid #ef4444; border-radius:var(--radius-sm); padding:0.6rem;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:bold; color:#dc2626; margin-bottom:4px;">
              <span>4. Residuo R(t) &bull; Saltos Anómalos y Ruido de Telemetría</span>
              <span>⚠️ Picos súbitos = Activación cinemática</span>
            </div>
            <svg viewBox="0 0 500 45" class="tb-svg" style="width:100%; height:40px;">
              <line x1="20" y1="30" x2="480" y2="30" stroke="var(--border-subtle)" stroke-dasharray="3,3"/>
              <polyline fill="none" stroke="#dc2626" stroke-width="1.8" points="${timeAxis.map((_, i) => `${30 + i * 40},${30 - baseResid[i] * 70}`).join(' ')}"/>
              <circle cx="${30 + 4 * 40}" cy="${30 - 0.25 * 70}" r="4" fill="#dc2626"/>
              <circle cx="${30 + 9 * 40}" cy="${30 - 0.35 * 70}" r="4" fill="#dc2626"/>
            </svg>
          </div>` : ''}
        </div>

        <!-- Código Python generado -->
        <div class="tb-code-footer" style="margin-top:0.75rem;">
          <pre class="trace-pre"><code><span class="tok-comment"># Descomposición aditiva mensual con statsmodels:</span>
from statsmodels.tsa.seasonal import seasonal_decompose

descomp = seasonal_decompose(df_activo[<span class="tok-str">'C1'</span>], model=<span class="tok-str">'additive'</span>, period=30)
df_activo[<span class="tok-str">'C1_tendencia'</span>] = descomp.trend
df_activo[<span class="tok-str">'C1_estacional'</span>] = descomp.seasonal
df_activo[<span class="tok-str">'C1_residuo'</span>] = descomp.resid</code></pre>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const bT = document.getElementById("btn-dec-trend");
    const bS = document.getElementById("btn-dec-season");
    const bR = document.getElementById("btn-dec-resid");

    if (bT) bT.addEventListener("click", () => { state.showTrend = !state.showTrend; renderWidget(); });
    if (bS) bS.addEventListener("click", () => { state.showSeasonal = !state.showSeasonal; renderWidget(); });
    if (bR) bR.addEventListener("click", () => { state.showResid = !state.showResid; renderWidget(); });
  }

  window.initDecompositionFlowWidget = function () { renderWidget(); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("decomposition-flow-container")) window.initDecompositionFlowWidget();
    });
  } else {
    if (document.getElementById("decomposition-flow-container")) window.initDecompositionFlowWidget();
  }
})();
