/**
 * resampling-flow.js
 * Componente visual interactivo y esquema de pizarra integrado para la Lección 3.1.
 * Remuestreo Temporal (.resample()), Consolidación de Precipitación (p) y Agregaciones Físicas en Geotecnia.
 */

(function () {
  let state = {
    freq: "5min", // Inicia en la mayor resolución temporal: '5min', 'D', 'W', 'M'
  };

  // Ventana de alta resolución a 5 minutos (12 intervalos = 1 hora durante la tormenta del Día 03)
  // Tras consolidar p = max(p1, p2) y pasar el DataFrame de intervalos variables a paso uniforme '5min'
  const fiveMinData = [
    { label: "14:05", p: 1.2, sh: 58.4, de: 0.02 },
    { label: "14:10", p: 2.8, sh: 59.1, de: 0.04 },
    { label: "14:15", p: 4.5, sh: 60.0, de: 0.08 },
    { label: "14:20", p: 6.4, sh: 61.2, de: 0.12 },
    { label: "14:25", p: 7.2, sh: 62.5, de: 0.15 },
    { label: "14:30", p: 5.8, sh: 63.1, de: 0.12 },
    { label: "14:35", p: 4.6, sh: 63.4, de: 0.09 },
    { label: "14:40", p: 3.5, sh: 63.2, de: 0.07 },
    { label: "14:45", p: 2.6, sh: 62.9, de: 0.05 },
    { label: "14:50", p: 1.8, sh: 62.7, de: 0.03 },
    { label: "14:55", p: 1.0, sh: 62.6, de: 0.02 },
    { label: "15:00", p: 0.6, sh: 62.5, de: 0.01 },
  ];

  // 14 días de datos diarios agregados
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
    if (state.freq === "5min") {
      return fiveMinData;
    }
    if (state.freq === "D") {
      return dailyData.map(d => ({ label: `D${d.day}`, p: d.p, sh: d.sh, de: d.de }));
    }
    if (state.freq === "W") {
      const w1 = dailyData.slice(0, 7);
      const w2 = dailyData.slice(7, 14);
      return [
        {
          label: "Semana 1 (D01–D07)",
          p: parseFloat(w1.reduce((acc, x) => acc + x.p, 0).toFixed(1)),
          sh: parseFloat((w1.reduce((acc, x) => acc + x.sh, 0) / 7).toFixed(1)),
          de: parseFloat(w1.reduce((acc, x) => acc + x.de, 0).toFixed(2)),
        },
        {
          label: "Semana 2 (D08–D14)",
          p: parseFloat(w2.reduce((acc, x) => acc + x.p, 0).toFixed(1)),
          sh: parseFloat((w2.reduce((acc, x) => acc + x.sh, 0) / 7).toFixed(1)),
          de: parseFloat(w2.reduce((acc, x) => acc + x.de, 0).toFixed(2)),
        }
      ];
    }
    if (state.freq === "M") {
      return [
        {
          label: "Mes Consolidado ('1ME')",
          p: parseFloat(dailyData.reduce((acc, x) => acc + x.p, 0).toFixed(1)),
          sh: parseFloat((dailyData.reduce((acc, x) => acc + x.sh, 0) / dailyData.length).toFixed(1)),
          de: parseFloat(dailyData.reduce((acc, x) => acc + x.de, 0).toFixed(2)),
        }
      ];
    }
  }

  function getFreqLabel() {
    if (state.freq === "5min") return "Base Regularizada (5min)";
    if (state.freq === "D") return "Diaria (1D)";
    if (state.freq === "W") return "Semanal (1W)";
    return "Mensual (1ME)";
  }

  function getScaleDescription() {
    if (state.freq === "5min") {
      return "🔍 <strong>Alta Resolución (<code>'5min'</code>):</strong> Serie unificada al mismo paso temporal de 5 min tras consolidar <code>p = max(p1, p2)</code> (1 h de tormenta del Día 03). Haz clic en <strong>Diaria</strong>, <strong>Semanal</strong> o <strong>Mensual</strong> para ver cómo cambia al agregarse.";
    }
    if (state.freq === "D") {
      return "📅 <strong>Agregación Diaria (<code>'1D'</code>):</strong> Cada barra resume los intervalos de 5 min en 1 día. La lluvia <code>p</code> y la deformación <code>DE1</code> se suman (<code>sum</code>); la humedad <code>sh1</code> se promedia (<code>mean</code>).";
    }
    if (state.freq === "W") {
      return "📆 <strong>Agregación Semanal (<code>'1W'</code>):</strong> Los días se agrupan en bloques semanales. Se acumulan los volúmenes de lluvia (<code>sum</code>) y deformaciones (<code>sum</code>), suavizando el estado de humedad (<code>mean</code>).";
    }
    return "🗓️ <strong>Agregación Mensual (<code>'1ME'</code>):</strong> Todos los registros del periodo se consolidan en un único balance hidro-mecánico: lluvia total acumulada (<code>157.8 mm</code>), humedad media (<code>60.1%</code>) y deformación acumulada (<code>3.30 mm</code>).";
  }

  function renderWidget() {
    const container = document.getElementById("resampling-flow-container");
    if (!container) return;

    const items = getAggregatedData();
    const maxP = Math.max(...items.map(x => x.p), 1);
    const totalP = items.reduce((a, b) => a + b.p, 0).toFixed(1);
    const avgSh = (items.reduce((a, b) => a + b.sh, 0) / items.length).toFixed(1);
    const totalDe = items.reduce((a, b) => a + b.de, 0).toFixed(2);
    const isDense = items.length > 4;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 3 &bull; Lección 3.1 &bull; Pizarra Conceptual &amp; Simulador Integrado</span>
            <h4 class="flow-title">⏱️ Remuestreo Temporal (<code>.resample()</code>): De Intervalos Variables a Escalas Agregadas</h4>
          </div>
          <div class="bp-status-pill pill-ok">
            Frecuencia Activa: <strong>${getFreqLabel()}</strong>
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          Al concatenar los sensores en crudo, el DataFrame no tiene frecuencia definida (intervalos variables de <code>1 min</code>, <code>5 min</code> y <code>1 h</code>). Primero consolidamos los dos canales de lluvia en una sola variable <code>p = max(p1, p2)</code> y aplicamos <code>.resample('5min')</code> para igualar el paso temporal. Al agregar en el tiempo, <strong>cada variable física exige su función coherente</strong>: lluvia <code>p</code> con <code>sum()</code>, humedad <code>sh1</code> con <code>mean()</code> y deformación <code>DE1</code> con <code>sum()</code> (acumulado de deformaciones).
        </p>

        <!-- Barra de Botones de Frecuencia Rediseñada -->
        <div class="rf-freq-toolbar">
          <span class="rf-toolbar-label">🎛️ Escala Temporal:</span>
          <div class="rf-freq-group" role="group" aria-label="Selector de frecuencia de remuestreo">
            <button id="btn-resample-5min" class="rf-freq-btn ${state.freq === '5min' ? 'active' : ''}">
              <span>⚡ Alta Resolución</span>
              <span class="rf-code-tag">'5min'</span>
            </button>
            <button id="btn-resample-d" class="rf-freq-btn ${state.freq === 'D' ? 'active' : ''}">
              <span>📅 Diaria</span>
              <span class="rf-code-tag">'1D'</span>
            </button>
            <button id="btn-resample-w" class="rf-freq-btn ${state.freq === 'W' ? 'active' : ''}">
              <span>📆 Semanal</span>
              <span class="rf-code-tag">'1W'</span>
            </button>
            <button id="btn-resample-m" class="rf-freq-btn ${state.freq === 'M' ? 'active' : ''}">
              <span>🗓️ Mensual</span>
              <span class="rf-code-tag">'1ME'</span>
            </button>
          </div>
        </div>

        <div class="rf-scale-banner">
          <span>${getScaleDescription()}</span>
        </div>

        <!-- Pizarra Gráfica SVG -->
        <div class="tb-graph-wrapper" style="overflow-x:auto;">
          <svg viewBox="0 0 650 205" class="tb-svg" style="width:100%; min-width:540px; height:auto;">
            <!-- Leyenda superior integrada -->
            <text x="45" y="14" class="svg-axis-txt" font-size="9.5" font-weight="700" fill="#0284c7">■ Barras: Lluvia p (.sum, mm)</text>
            <text x="235" y="14" class="svg-axis-txt" font-size="9.5" font-weight="700" fill="#16a34a">● Puntos: Humedad sh1 (.mean, %)</text>
            <text x="445" y="14" class="svg-axis-txt" font-size="9.5" font-weight="700" fill="#d97706">▲ Fila inf.: Deformación DE1 (.sum, mm)</text>

            <line x1="40" y1="148" x2="630" y2="148" stroke="var(--border-subtle)" stroke-width="1.5"/>
            <line x1="40" y1="24" x2="40" y2="148" stroke="var(--border-subtle)" stroke-width="1.5"/>

            ${items.map((it, i) => {
              const step = 580 / items.length;
              const x = 45 + i * step + step / 2;
              const barW = Math.min(step * 0.56, 64);
              const barH = (it.p / (maxP * 1.18)) * 102;
              const y = 148 - barH;
              const pLabel = isDense ? `${it.p}` : `${it.p} mm`;
              const deLabel = isDense ? (it.de > 0 ? `+${it.de}` : `0`) : `ΔDE1: +${it.de} mm`;
              return `
                <!-- Barra de lluvia p (.sum) -->
                <rect x="${x - barW / 2}" y="${y}" width="${barW}" height="${barH}" fill="#38bdf8" rx="3" stroke="#0284c7" stroke-width="1"/>
                <text x="${x}" y="${y - 4}" class="svg-axis-txt" font-size="${isDense ? '8.5' : '10'}" font-weight="bold" fill="#0284c7" text-anchor="middle">${pLabel}</text>
                
                <!-- Etiqueta eje X -->
                <text x="${x}" y="164" class="svg-axis-txt" font-size="${isDense ? '8.5' : '10'}" font-weight="600" text-anchor="middle">${it.label}</text>
                <!-- Etiqueta ΔDE1 acumulada por intervalo -->
                <text x="${x}" y="180" class="svg-axis-txt" font-size="${isDense ? '8' : '9.5'}" font-weight="bold" fill="${it.de > 0 ? '#d97706' : 'var(--text-dim)'}" text-anchor="middle">${deLabel}</text>
                
                <!-- Círculo de humedad sh1 (.mean) -->
                <circle cx="${x}" cy="${134 - (it.sh - 50) * 3}" r="4" fill="#16a34a" stroke="#ffffff" stroke-width="1.5"/>
                <text x="${x}" y="${125 - (it.sh - 50) * 3}" class="svg-axis-txt" font-size="8.5" font-weight="bold" fill="#16a34a" text-anchor="middle">${it.sh}%</text>
              `;
            }).join("")}
          </svg>
        </div>

        <!-- Tarjetas de resumen físico -->
        <div class="tb-summary-cards" style="margin-top:0.75rem;">
          <div class="tb-stat-pill pill-cyan">🌧️ Precipitación <code>p</code> (<code>.sum()</code>): <strong>${totalP} mm acumulados</strong></div>
          <div class="tb-stat-pill pill-green">💧 Humedad <code>sh1</code> (<code>.mean()</code>): <strong>${avgSh}% promedio</strong></div>
          <div class="tb-stat-pill pill-orange">📏 Deformación <code>DE1</code> (<code>.sum()</code>): <strong>${totalDe} mm acumulados</strong></div>
        </div>

        <!-- Código Python generado -->
        <div class="tb-code-footer" style="margin-top:0.75rem;">
          <pre class="trace-pre"><code><span class="tok-comment"># 1. Consolidar los dos pluviómetros (p1 y p2) en una única variable 'p' con el máximo:</span>
df[<span class="tok-str">'p'</span>] = df[[<span class="tok-str">'p1'</span>, <span class="tok-str">'p2'</span>]].max(axis=1)

<span class="tok-comment"># 2. Remuestreo temporal a escala '${state.freq === '5min' ? '5min' : state.freq === 'D' ? '1D' : state.freq === 'W' ? '1W' : '1ME'}' respetando la física de cada sensor:</span>
df_resampled = df.resample(<span class="tok-str">'${state.freq === '5min' ? '5min' : state.freq === 'D' ? '1D' : state.freq === 'W' ? '1W' : '1ME'}'</span>).agg({
    <span class="tok-str">'p'</span>: <span class="tok-str">'sum'</span>,    <span class="tok-live-comment"># Acumulado de precipitación en el intervalo (mm)</span>
    <span class="tok-str">'sh1'</span>: <span class="tok-str">'mean'</span>,  <span class="tok-live-comment"># Estado de humedad volumétrica promedio (%)</span>
    <span class="tok-str">'DE1'</span>: <span class="tok-str">'sum'</span>    <span class="tok-live-comment"># Acumulado de deformaciones en el intervalo (mm)</span>
})</code></pre>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const b5m = document.getElementById("btn-resample-5min");
    const bD = document.getElementById("btn-resample-d");
    const bW = document.getElementById("btn-resample-w");
    const bM = document.getElementById("btn-resample-m");

    if (b5m) b5m.addEventListener("click", () => { state.freq = "5min"; renderWidget(); });
    if (bD) bD.addEventListener("click", () => { state.freq = "D"; renderWidget(); });
    if (bW) bW.addEventListener("click", () => { state.freq = "W"; renderWidget(); });
    if (bM) bM.addEventListener("click", () => { state.freq = "M"; renderWidget(); });
  }

  window.initResamplingFlowWidget = function () { state.freq = "5min"; renderWidget(); };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("resampling-flow-container")) window.initResamplingFlowWidget();
    });
  } else {
    if (document.getElementById("resampling-flow-container")) window.initResamplingFlowWidget();
  }
})();

