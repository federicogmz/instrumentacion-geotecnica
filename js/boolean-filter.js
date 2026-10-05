/**
 * boolean-filter.js
 * Componente visual interactivo unificado para la enseñanza de Filtrado Booleano y Máscaras en Pandas.
 * Contexto Geotécnico: Tamiz de eventos pluviométricos y discriminación de lluvias detonantes en ladera.
 * Integra esquema conceptual de tamiz (Paso 1 -> Paso 2 -> Paso 3) con simulador interactivo en tiempo real.
 */

(function () {
  let state = {
    threshold: 0.0, // umbral de lluvia en mm
    records: [
      { id: "REG-01", date: "2019-05-03 16:00", p1: 0.0, p2: 0.0, rain: 0.0, event: "Seco", effect: "Sin infiltración" },
      { id: "REG-02", date: "2019-05-03 16:05", p1: 0.4, p2: 0.4, rain: 0.4, event: "Llovizna leve", effect: "Humedecimiento superficial" },
      { id: "REG-03", date: "2019-05-03 16:10", p1: 1.8, p2: 1.8, rain: 1.8, event: "Lluvia moderada", effect: "Avance frente húmedo" },
      { id: "REG-04", date: "2019-05-03 16:15", p1: 4.2, p2: 4.4, rain: 4.4, event: "Aguacero intenso", effect: "🚨 Infiltración acelerada / riesgo" },
      { id: "REG-05", date: "2019-05-03 16:20", p1: 0.8, p2: 0.8, rain: 0.8, event: "Remanente", effect: "Drenaje y retardo (lag)" },
      { id: "REG-06", date: "2019-05-03 16:25", p1: 0.0, p2: 0.0, rain: 0.0, event: "Seco", effect: "Sin recarga" },
    ]
  };

  function renderWidget() {
    const container = document.getElementById("boolean-filter-container");
    if (!container) return;

    const th = state.threshold;
    const evaluated = state.records.map(r => ({
      ...r,
      isTrue: state.threshold === 0.0 ? r.rain > 0.0 : r.rain >= th
    }));

    const passedRows = evaluated.filter(r => r.isTrue);
    const passCount = passedRows.length;
    const totalCount = state.records.length;
    const passPercent = Math.round((passCount / totalCount) * 100);

    const conditionText = th === 0.0 ? "df['p'] > 0.0" : `df['p'] >= ${th.toFixed(1)}`;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.7</span>
            <h4 class="flow-title">El Tamiz Pluviométrico: Filtrado Booleano Vectorizado en Pandas</h4>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; background:rgba(6,182,212,0.12); color:var(--accent-cyan); border:1px solid rgba(6,182,212,0.3); border-radius:12px; padding:4px 10px; font-weight:600;">
              🌧️ Estación SIATA Ancón Norte
            </span>
          </div>
        </div>

        <!-- Barra de Control Interactivo -->
        <div class="filter-controls-bar" style="margin-bottom:1.25rem;">
          <div class="filter-slider-box">
            <div class="slider-header-row">
              <label style="color:var(--text-main); font-weight:600;">
                Condición del Tamiz: <code>${conditionText}</code>
              </label>
              <strong class="slider-val-badge">
                ${th === 0.0 ? '> 0.0 mm (Lluvia Activa)' : '>= ' + th.toFixed(1) + ' mm'}
              </strong>
            </div>
            <input type="range" min="0.0" max="4.5" step="0.5" value="${th}" id="slider-filter-th" class="flow-slider" style="margin-top:0.4rem;">
          </div>

          <div class="filter-presets">
            <button class="filter-preset-btn ${th === 0.0 ? 'active' : ''}" data-val="0.0">
              🌧️ Lluvia Activa (&gt; 0 mm)
            </button>
            <button class="filter-preset-btn ${th === 1.5 ? 'active' : ''}" data-val="1.5">
              🌦️ Moderada (&gt;= 1.5 mm)
            </button>
            <button class="filter-preset-btn ${th === 3.5 ? 'active' : ''}" data-val="3.5">
              ⛈️ Tormenta Detonante (&gt;= 3.5 mm)
            </button>
          </div>
        </div>

        <!-- Esquema Conceptual Integrado: Arquitectura de 3 Pasos del Tamiz -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <!-- PASO 1: DataFrame Crudo con consolidación max(p1, p2) -->
          <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.9rem; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
              <span style="font-size:0.75rem; font-weight:700; background:rgba(59,130,246,0.15); color:var(--accent-primary); padding:2px 8px; border-radius:6px;">
                PASO 1
              </span>
              <span style="font-size:0.78rem; color:var(--text-muted);">Registro Crudo (<code>df_lluvia</code>)</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.6rem;">
              Consolidación de balancines gemelos: <code>p = max(p1, p2)</code>
            </div>
            <div class="table-responsive">
              <table class="wb-mini-table" style="width:100%; font-size:0.78rem;">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>p1</th>
                    <th>p2</th>
                    <th>p (max)</th>
                  </tr>
                </thead>
                <tbody>
                  ${evaluated.map(r => `
                    <tr class="${r.isTrue ? 'hl-row' : ''}">
                      <td><code>${r.date.split(" ")[1]}</code></td>
                      <td>${r.p1.toFixed(1)}</td>
                      <td>${r.p2.toFixed(1)}</td>
                      <td style="font-weight:700; color:${r.rain > 0 ? 'var(--accent-cyan)' : 'inherit'};">
                        ${r.rain.toFixed(1)} mm
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- PASO 2: Máscara Booleana Vectorizada -->
          <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.9rem; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
              <span style="font-size:0.75rem; font-weight:700; background:rgba(245,158,11,0.15); color:#f59e0b; padding:2px 8px; border-radius:6px;">
                PASO 2
              </span>
              <span style="font-size:0.78rem; color:var(--text-muted);">Serie Booleana (Máscara)</span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.6rem;">
              Evaluación vectorizada en C: <code>mascara = ${conditionText}</code>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${evaluated.map(r => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 8px; background:${r.isTrue ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)'}; border:1px solid ${r.isTrue ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)'}; border-radius:4px; font-size:0.78rem;">
                  <span><code>${r.date.split(" ")[1]}</code> (${r.rain.toFixed(1)} mm)</span>
                  <span class="bool-pill ${r.isTrue ? 'pill-true' : 'pill-false'}" style="font-size:0.72rem; padding:1px 6px;">
                    ${r.isTrue ? '✓ True (Pasa)' : '✗ False (Bloqueado)'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- PASO 3: DataFrame Filtrado df[mascara] -->
          <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.9rem; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
              <span style="font-size:0.75rem; font-weight:700; background:rgba(16,185,129,0.15); color:var(--accent-emerald); padding:2px 8px; border-radius:6px;">
                PASO 3
              </span>
              <span style="font-size:0.78rem; color:var(--accent-emerald); font-weight:700;">
                ${passCount} de ${totalCount} filas (${passPercent}%)
              </span>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.6rem;">
              El tamiz conserva solo filas <code>True</code>: <code>df[mascara]</code>
            </div>
            <div class="table-responsive">
              <table class="wb-mini-table" style="width:100%; font-size:0.78rem;">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Lluvia (p)</th>
                    <th>Evento / Diagnóstico</th>
                  </tr>
                </thead>
                <tbody>
                  ${passedRows.length > 0 ? passedRows.map(r => `
                    <tr class="hl-row">
                      <td><code>${r.date.split(" ")[1]}</code></td>
                      <td style="font-weight:700; color:var(--accent-cyan);">${r.rain.toFixed(1)} mm</td>
                      <td>
                        <div style="font-weight:600;">${r.event}</div>
                        <div style="font-size:0.7rem; color:${r.rain >= 3.5 ? '#ef4444' : 'var(--text-muted)'};">${r.effect}</div>
                      </td>
                    </tr>
                  `).join('') : `
                    <tr>
                      <td colspan="3" style="text-align:center; padding:1.2rem; color:var(--text-muted);">
                        Ningún intervalo superó el umbral. El tamiz descartó el 100% de las filas.
                      </td>
                    </tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Traza de Código Python Dinámica -->
        <div class="filter-code-preview" style="margin-bottom:1rem;">
          <div class="fcp-label">⚡ Código Python Vectorizado Equivalente:</div>
          <pre class="fcp-code"><code># 1. Consolidar canal de balancines gemelos:
df['p'] = df[['p1', 'p2']].max(axis=1)

# 2. Generar máscara booleana e indexar en corchetes sin bucles 'for':
mascara = ${conditionText}
df_filtrado = df[mascara]

print(f"Intervalos filtrados: {len(df_filtrado)} de {len(df)} registros ({len(df_filtrado)/len(df)*100:.1f}%)")</code></pre>
        </div>

        <!-- Tarjetas de Fundamentos y Reglas Geotécnicas -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:0.9rem;">
          <div class="wb-card-glass" style="border-left:3px solid var(--accent-primary); padding:0.85rem;">
            <strong style="color:var(--accent-primary); font-size:0.88rem;">🚀 C-Speed: Vectorización vs Bucles</strong>
            <p style="font-size:0.82rem; color:var(--text-muted); margin:0.35rem 0 0 0; line-height:1.5;">
              La estación de Ancón Norte acumula más de <strong>229.000 registros</strong>. Evaluar fila por fila con un bucle <code>for</code> manual tomaría segundos y congelaría el sistema. Pandas ejecuta la máscara a través de arreglos de NumPy en C en menos de <strong>3 milisegundos</strong>.
            </p>
          </div>

          <div class="wb-card-glass" style="border-left:3px solid var(--accent-amber); padding:0.85rem;">
            <strong style="color:#f59e0b; font-size:0.88rem;">⚠️ Múltiples Criterios: Operadores Bit a Bit</strong>
            <p style="font-size:0.82rem; color:var(--text-muted); margin:0.35rem 0 0 0; line-height:1.5;">
              Para combinar condiciones en Pandas <strong>nunca uses <code>and</code> ni <code>or</code></strong>. Debes usar <code>&</code> (AND) y <code>|</code> (OR), y encerrar <strong>cada condición obligatoriamente entre paréntesis</strong>:<br>
              <code>df[(df['p1'] &gt; 0) & (df['p2'] &gt; 0)]</code>
            </p>
          </div>

          <div class="wb-card-glass" style="border-left:3px solid var(--accent-emerald); padding:0.85rem;">
            <strong style="color:var(--accent-emerald); font-size:0.88rem;">🌧️ Relevancia en Hidro-Geotecnia</strong>
            <p style="font-size:0.82rem; color:var(--text-muted); margin:0.35rem 0 0 0; line-height:1.5;">
              En el clima tropical andino, más del 85% del año el pluviómetro registra <code>0.0 mm</code>. El filtrado booleano descarta el ruido seco y aísla con exactitud las tormentas detonantes para alimentar los modelos de infiltración y estabilidad de taludes.
            </p>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const slider = document.getElementById("slider-filter-th");
    if (slider) {
      slider.addEventListener("input", (e) => {
        state.threshold = parseFloat(e.target.value);
        renderWidget();
      });
    }

    document.querySelectorAll(".filter-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.threshold = parseFloat(btn.dataset.val);
        renderWidget();
      });
    });
  }

  window.initBooleanFilterWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("boolean-filter-container")) {
      window.initBooleanFilterWidget();
    }
  });
})();
