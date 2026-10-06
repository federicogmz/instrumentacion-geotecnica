/**
 * resampling-flow.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.2.
 * Remuestreo Temporal (.resample()) y Agregaciones Físicas en Geotecnia.
 */

(function () {
  let state = {
    freq: "W", // 'D', 'W', 'M'
  };

  // 14 días de datos de prueba
  const dailyData = [
    { day: "01", p: 0.0, sh: 54.2, de: 0.0 },
    { day: "02", p: 14.5, sh: 56.1, de: 0.1 },
    { day: "03", p: 42.0, sh: 61.8, de: 0.8 },
    { day: "04", p: 18.2, sh: 62.4, de: 0.2 },
    { day: "05", p: 0.0, sh: 60.5, de: 0.0 },
    { day: "06", p: 0.0, sh: 58.7, de: 0.0 },
    { day: "07", p: 5.4, sh: 58.2, de: 0.0 },
    { day: "08", p: 25.0, sh: 62.0, de: 0.3 },
    { day: "09", p: 38.6, sh: 65.4, de: 1.5 },
    { day: "10", p: 12.0, sh: 64.1, de: 0.4 },
    { day: "11", p: 0.0, sh: 61.3, de: 0.0 },
    { day: "12", p: 0.0, sh: 59.8, de: 0.0 },
    { day: "13", p: 2.1, sh: 58.9, de: 0.0 },
    { day: "14", p: 0.0, sh: 57.5, de: 0.0 },
  ];

  function getAggregatedData() {
    if (state.freq === "D") {
      return dailyData.map(d => ({ label: `D${d.day}`, p: d.p, sh: d.sh, de: d.de }));
    }
    if (state.freq === "W") {
      const w1 = dailyData.slice(0, 7);
      const w2 = dailyData.slice(7, 14);
      return [
        {
          label: "Semana 1",
          p: parseFloat(w1.reduce((acc, x) => acc + x.p, 0).toFixed(1)),
          sh: parseFloat((w1.reduce((acc, x) => acc + x.sh, 0) / 7).toFixed(1)),
          de: Math.max(...w1.map(x => x.de)),
        },
        {
          label: "Semana 2",
          p: parseFloat(w2.reduce((acc, x) => acc + x.p, 0).toFixed(1)),
          sh: parseFloat((w2.reduce((acc, x) => acc + x.sh, 0) / 7).toFixed(1)),
          de: Math.max(...w2.map(x => x.de)),
        }
      ];
    }
    if (state.freq === "M") {
      return [
        {
          label: "Mes Completo",
          p: parseFloat(dailyData.reduce((acc, x) => acc + x.p, 0).toFixed(1)),
          sh: parseFloat((dailyData.reduce((acc, x) => acc + x.sh, 0) / dailyData.length).toFixed(1)),
          de: Math.max(...dailyData.map(x => x.de)),
        }
      ];
    }
  }

  function renderWidget() {
    const container = document.getElementById("resampling-flow-container");
    if (!container) return;

    const items = getAggregatedData();
    const maxP = Math.max(...items.map(x => x.p), 1);

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.2 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">⏱️ Remuestreo Temporal (.resample()): Coherencia Física de Agregación</h4>
          </div>
          <div class="bp-status-pill pill-ok">
            Frecuencia Activa: <strong>${state.freq === 'D' ? 'Diaria (1D)' : state.freq === 'W' ? 'Semanal (1W)' : 'Mensual (1ME)'}</strong>
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          Al cambiar la escala temporal con <code>.resample()</code>, <strong>cada variable física exige una función matemática diferente</strong>:
          la lluvia se acumula con <code>sum</code> (volumen de agua), la humedad se promedia con <code>mean</code> (estado hidrogeológico) y la deformación registra su pico crítico con <code>max</code>.
        </p>

        <!-- Selector de Frecuencia -->
        <div style="display:flex; gap:0.5rem; margin: 0.85rem 0; flex-wrap:wrap;">
          <button id="btn-resample-d" class="bp-part-btn ${state.freq === 'D' ? 'active' : ''}">📅 Diaria ('1D')</button>
          <button id="btn-resample-w" class="bp-part-btn ${state.freq === 'W' ? 'active' : ''}">📆 Semanal ('1W')</button>
          <button id="btn-resample-m" class="bp-part-btn ${state.freq === 'M' ? 'active' : ''}">🗓️ Mensual ('1ME')</button>
        </div>

        <!-- Pizarra Gráfica SVG -->
        <div class="tb-graph-wrapper" style="overflow-x:auto;">
          <svg viewBox="0 0 540 180" class="tb-svg" style="width:100%; min-width:480px; height:auto;">
            <line x1="40" y1="140" x2="520" y2="140" stroke="var(--border-subtle)" stroke-width="1.5"/>
            <line x1="40" y1="20" x2="40" y2="140" stroke="var(--border-subtle)" stroke-width="1.5"/>

            ${items.map((it, i) => {
              const step = 460 / items.length;
              const x = 50 + i * step + step / 2;
              const barW = Math.min(step * 0.6, 50);
              const barH = (it.p / (maxP * 1.15)) * 105;
              const y = 140 - barH;
              return `
                <!-- Barra de lluvia sum -->
                <rect x="${x - barW / 2}" y="${y}" width="${barW}" height="${barH}" fill="#38bdf8" rx="2" stroke="#0284c7" stroke-width="1"/>
                <text x="${x}" y="${y - 5}" class="svg-axis-txt" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="middle">${it.p} mm</text>
                
                <!-- Etiqueta eje X -->
                <text x="${x}" y="156" class="svg-axis-txt" font-size="10" text-anchor="middle">${it.label}</text>
                
                <!-- Círculo de humedad mean -->
                <circle cx="${x}" cy="${130 - (it.sh - 50) * 3}" r="4" fill="#16a34a" stroke="#ffffff" stroke-width="1.5"/>
                <text x="${x}" y="${122 - (it.sh - 50) * 3}" class="svg-axis-txt" font-size="9" font-weight="bold" fill="#16a34a" text-anchor="middle">${it.sh}%</text>
              `;
            }).join("")}
          </svg>
        </div>

        <!-- Tarjetas de resumen físico -->
        <div class="tb-summary-cards" style="margin-top:0.75rem;">
          <div class="tb-stat-pill pill-cyan">🌧️ Lluvia (<code>.sum()</code>): <strong>${items.reduce((a, b) => a + b.p, 0).toFixed(1)} mm total</strong></div>
          <div class="tb-stat-pill pill-green">💧 Humedad (<code>.mean()</code>): <strong>${(items.reduce((a, b) => a + b.sh, 0) / items.length).toFixed(1)}% promedio</strong></div>
          <div class="tb-stat-pill pill-orange">⚡ Deformación (<code>.max()</code>): <strong>${Math.max(...items.map(x => x.de)).toFixed(1)} mm pico</strong></div>
        </div>

        <!-- Código Python generado -->
        <div class="tb-code-footer" style="margin-top:0.75rem;">
          <pre class="trace-pre"><code><span class="tok-comment"># Agregación temporal respetando la física de cada sensor:</span>
df_resampled = df_activo.resample(<span class="tok-str">'${state.freq === 'D' ? '1D' : state.freq === 'W' ? '1W' : '1ME'}'</span>).agg({
    <span class="tok-str">'p1'</span>: <span class="tok-str">'sum'</span>,    <span class="tok-live-comment"># Acumulado total de lluvia (mm)</span>
    <span class="tok-str">'sh1'</span>: <span class="tok-str">'mean'</span>,  <span class="tok-live-comment"># Estado de humedad medio (%)</span>
    <span class="tok-str">'DE1'</span>: <span class="tok-str">'max'</span>    <span class="tok-live-comment"># Deformación máxima registrada (mm)</span>
})</code></pre>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const bD = document.getElementById("btn-resample-d");
    const bW = document.getElementById("btn-resample-w");
    const bM = document.getElementById("btn-resample-m");

    if (bD) bD.addEventListener("click", () => { state.freq = "D"; renderWidget(); });
    if (bW) bW.addEventListener("click", () => { state.freq = "W"; renderWidget(); });
    if (bM) bM.addEventListener("click", () => { state.freq = "M"; renderWidget(); });
  }

  window.initResamplingFlowWidget = function () { renderWidget(); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("resampling-flow-container")) window.initResamplingFlowWidget();
    });
  } else {
    if (document.getElementById("resampling-flow-container")) window.initResamplingFlowWidget();
  }
})();
