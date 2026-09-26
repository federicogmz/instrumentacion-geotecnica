/**
 * sensor-concat.js
 * Componente visual interactivo para el Reto Integrador del Módulo 1.
 * Concatenación temporal multisensores y alineación de series (Pluviómetro, Humedad, Extensómetro).
 * Nota metodológica: No se evalúa el acelerómetro en este módulo.
 */

(function () {
  let state = {
    mode: "simulator", // 'simulator' o 'whiteboard'
    activeTab: "concat", // 'pluv', 'hum', 'ext', 'concat'
    dataPluv: [
      { date: "2019-07-11 13:50:00", p1: 0.0, p2: 0.0 },
      { date: "2019-07-11 13:55:00", p1: 0.4, p2: 0.4 },
      { date: "2019-07-11 14:00:00", p1: 1.2, p2: 1.2 },
      { date: "2019-07-11 14:05:00", p1: 2.8, p2: 3.0 },
    ],
    dataHum: [
      { date: "2019-07-11 13:50:00", sh1: 54.2 },
      { date: "2019-07-11 13:55:00", sh1: 54.3 },
      { date: "2019-07-11 14:00:00", sh1: 55.1 },
      { date: "2019-07-11 14:05:00", sh1: 56.4 },
    ],
    dataExt: [
      { date: "2019-07-11 13:50:00", DE1: 0.000 },
      { date: "2019-07-11 13:51:00", DE1: 0.005 },
      { date: "2019-07-11 13:52:00", DE1: 0.012 },
      { date: "2019-07-11 13:55:00", DE1: 0.045 },
      { date: "2019-07-11 14:00:00", DE1: 0.120 },
      { date: "2019-07-11 14:05:00", DE1: 0.380 },
    ],
    dataConcat: [
      { date: "2019-07-11 13:50:00", p1: "0.0", p2: "0.0", sh1: "54.2", DE1: "0.000", note: "Lectura simultánea" },
      { date: "2019-07-11 13:51:00", p1: "NaN", p2: "NaN", sh1: "NaN", DE1: "0.005", note: "Extensómetro a 1 min" },
      { date: "2019-07-11 13:52:00", p1: "NaN", p2: "NaN", sh1: "NaN", DE1: "0.012", note: "Extensómetro a 1 min" },
      { date: "2019-07-11 13:55:00", p1: "0.4", p2: "0.4", sh1: "54.3", DE1: "0.045", note: "Lectura simultánea" },
      { date: "2019-07-11 14:00:00", p1: "1.2", p2: "1.2", sh1: "55.1", DE1: "0.120", note: "Lluvia detonante activa" },
      { date: "2019-07-11 14:05:00", p1: "2.8", p2: "3.0", sh1: "56.4", DE1: "0.380", note: "Apertura de grieta" },
    ]
  };

  function renderWidget() {
    const container = document.getElementById("sensor-concat-container");
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
            <span class="flow-badge">Módulo 1 &bull; Lección 1.8</span>
            <h4 class="flow-title">Reto Integrador: Pipeline de Fusión y Concatenación Multisensores</h4>
          </div>
          <div class="flow-mode-toggle">
            <button class="flow-mode-btn ${state.mode === 'simulator' ? 'active' : ''}" id="concat-mode-sim">
              ⚡ Simulador Interactivo
            </button>
            <button class="flow-mode-btn ${state.mode === 'whiteboard' ? 'active' : ''}" id="concat-mode-wb">
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
          <div class="wb-title-badge">ARQUITECTURA DE INTEGRACIÓN TEMPORAL (<code>pd.concat</code>)</div>

          <div style="display:flex; flex-direction:column; gap:16px; margin-top:12px;">
            <!-- Cajas de los 3 sensores de entrada -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:10px;">
              <div class="wb-card-glass" style="border-top:3px solid var(--accent-blue); padding:10px;">
                <div style="font-weight:700; color:var(--accent-blue); font-size:0.85rem;">🌧️ Pluviómetro</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">pluviometro.csv</div>
                <div style="font-size:0.78rem; margin-top:4px;">Columnas: <code>p1, p2</code></div>
                <div style="font-size:0.72rem; color:var(--text-dim);">Frecuencia: cada 5 min</div>
              </div>

              <div class="wb-card-glass" style="border-top:3px solid var(--accent-teal); padding:10px;">
                <div style="font-weight:700; color:var(--accent-teal); font-size:0.85rem;">💧 Sonda Humedad</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">humedad.csv</div>
                <div style="font-size:0.78rem; margin-top:4px;">Columna: <code>sh1</code></div>
                <div style="font-size:0.72rem; color:var(--text-dim);">Frecuencia: cada 5 min</div>
              </div>

              <div class="wb-card-glass" style="border-top:3px solid var(--accent-emerald); padding:10px;">
                <div style="font-weight:700; color:var(--accent-emerald); font-size:0.85rem;">📏 Extensómetro</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">extensometro.csv</div>
                <div style="font-size:0.78rem; margin-top:4px;">Columna: <code>DE1</code></div>
                <div style="font-size:0.72rem; color:var(--text-dim);">Frecuencia: cada 1 min</div>
              </div>
            </div>

            <!-- Flecha de operación -->
            <div style="text-align:center; padding:6px; background:rgba(255,255,255,0.03); border-radius:8px; border:1px dashed var(--border-subtle);">
              <code style="color:var(--accent-yellow); font-size:0.95rem; font-weight:700;">
                df_ladera = pd.concat([df_pluv, df_hum, df_ext], axis=1)
              </code>
              <div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">
                Alineación automática por <code>DatetimeIndex</code> (unión externa temporal)
              </div>
            </div>

            <!-- DataFrame Unificado Resultante -->
            <div class="wb-card-glass" style="border:2px solid var(--accent-primary); background:rgba(59, 130, 246, 0.05); padding:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:var(--accent-primary);">🏔️ Matriz de Monitoreo Integrado: Ancón Norte</span>
                <span style="font-size:0.75rem; background:rgba(59, 130, 246, 0.2); padding:2px 8px; border-radius:12px; color:var(--accent-blue);">
                  Dimensiones: (1.067.337 filas, 4 columnas)
                </span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:6px;">
                Columnas consolidadas: <code>['p1', 'p2', 'sh1', 'DE1']</code>. Cada estampa temporal alinea en la misma fila las lecturas de los instrumentos correspondientes.
              </div>
            </div>
          </div>
        </div>

        <div class="wb-rules-col">
          <div class="wb-card-glass">
            <h5 style="color:var(--accent-yellow); margin-top:0;">⚠️ ¿Por qué NO evaluar el acelerómetro?</h5>
            <p style="font-size:0.85em; color:var(--text-muted); line-height:1.5;">
              En Ancón Norte, el acelerómetro biaxial mide rotación angular y cabeceo (<code>C1, B1</code>). En este primer módulo nos concentramos en los <strong>sensores hidro-mecánicos primarios</strong>: la causa detonante (lluvia), la infiltración en suelo (humedad) y la cinemática de corona (apertura de grieta en mm).
            </p>
          </div>

          <div class="wb-card-glass" style="margin-top:12px; border-left:3px solid var(--accent-teal);">
            <h5 style="color:var(--accent-teal); margin-top:0;">⏱️ Disparidad de Frecuencias de Muestreo</h5>
            <p style="font-size:0.85em; color:var(--text-muted); line-height:1.5;">
              El extensómetro registra cada <strong>1 minuto</strong> para captar deformaciones rápidas, mientras que el pluviómetro registra cada <strong>5 minutos</strong>. Al concatenar con <code>axis=1</code>, Pandas preserva todas las marcas de tiempo y coloca <code>NaN</code> en las horas donde un sensor no tiene lectura.
            </p>
          </div>

          <div class="wb-card-glass" style="margin-top:12px; border-left:3px solid var(--accent-blue);">
            <h5 style="color:var(--accent-blue); margin-top:0;">🔍 Exploración con lo Aprendido</h5>
            <p style="font-size:0.85em; color:var(--text-muted); margin:0;">
              • <code>df.shape</code>: Comprueba la matriz total (filas $	imes$ sensores).<br>
              • <code>df.head(3)</code>: Muestra los primeros registros simultáneos.<br>
              • <code>df.describe()</code>: Resumen de medias, mínimos y máximos.<br>
              • <code>df.notna().sum()</code>: Cuántas lecturas reales captó cada instrumento.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderSimulatorMode() {
    const tab = state.activeTab;

    return `
      <div class="simulator-view animate-fade-in">
        <!-- Selector de Sensor / Matriz Concatenada -->
        <div class="df-sim-toolbar">
          <div class="df-channel-selector" style="width:100%;">
            <span class="selector-label">Vista de Datos de Monitoreo:</span>
            <div class="channel-pills">
              <button class="df-chan-btn ${tab === 'pluv' ? 'active' : ''}" data-tab="pluv">
                🌧️ Pluviómetro (p1, p2)
              </button>
              <button class="df-chan-btn ${tab === 'hum' ? 'active' : ''}" data-tab="hum">
                💧 Humedad (sh1)
              </button>
              <button class="df-chan-btn ${tab === 'ext' ? 'active' : ''}" data-tab="ext">
                📏 Extensómetro (DE1)
              </button>
              <button class="df-chan-btn ${tab === 'concat' ? 'active' : ''}" data-tab="concat" style="border:1px solid var(--accent-primary);">
                🔗 Matriz Concatenada (df_ladera)
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla Interactiva según Tab -->
        <div class="df-interactive-table-wrapper">
          <div class="table-responsive">
            ${renderTabTable(tab)}
          </div>
        </div>

        <!-- Panel de Métricas e Instrucción Python -->
        <div class="filter-code-preview" style="margin-top:12px;">
          <div class="fcp-label">Operación de Fusión Multisensores:</div>
          <pre class="fcp-code"><code># Concatenación de sensores hidro-mecánicos sin evaluar acelerómetro:
df_ladera = pd.concat([df_pluv, df_hum, df_ext], axis=1)

print(f"Dimensiones de monitoreo: {df_ladera.shape}")
print(df_ladera.describe().round(2))</code></pre>
        </div>
      </div>
    `;
  }

  function renderTabTable(tab) {
    if (tab === "pluv") {
      return `
        <table class="df-sensor-table">
          <thead>
            <tr>
              <th class="idx-th">Fecha y Hora (DatetimeIndex)</th>
              <th>p1 (Balancín 1, mm)</th>
              <th>p2 (Balancín 2, mm)</th>
              <th>Instrumento</th>
            </tr>
          </thead>
          <tbody>
            ${state.dataPluv.map(d => `
              <tr>
                <td class="idx-td"><code>${d.date}</code></td>
                <td>${d.p1.toFixed(1)}</td>
                <td>${d.p2.toFixed(1)}</td>
                <td style="color:var(--text-muted); font-size:0.8rem;">Estación SIATA Ancón Norte</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (tab === "hum") {
      return `
        <table class="df-sensor-table">
          <thead>
            <tr>
              <th class="idx-th">TIMESTAMP (DatetimeIndex)</th>
              <th>sh1 (Humedad Volumétrica %)</th>
              <th>Instrumento</th>
            </tr>
          </thead>
          <tbody>
            ${state.dataHum.map(d => `
              <tr>
                <td class="idx-td"><code>${d.date}</code></td>
                <td><strong>${d.sh1.toFixed(1)} %</strong></td>
                <td style="color:var(--text-muted); font-size:0.8rem;">Sonda TDR de Perfil</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (tab === "ext") {
      return `
        <table class="df-sensor-table">
          <thead>
            <tr>
              <th class="idx-th">Fecha y Hora (DatetimeIndex)</th>
              <th>DE1 (Desplazamiento Grieta, mm)</th>
              <th>Frecuencia</th>
            </tr>
          </thead>
          <tbody>
            ${state.dataExt.map(d => `
              <tr>
                <td class="idx-td"><code>${d.date}</code></td>
                <td style="color:var(--accent-emerald); font-weight:700;">${d.DE1.toFixed(3)} mm</td>
                <td style="color:var(--text-muted); font-size:0.8rem;">Muestreo continuo cada 1 min</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Concat
    return `
      <table class="df-sensor-table">
        <thead>
          <tr>
            <th class="idx-th">DatetimeIndex (Unión Externa)</th>
            <th class="th-active-col">p1 (mm)</th>
            <th class="th-active-col">p2 (mm)</th>
            <th class="th-active-col">sh1 (%)</th>
            <th class="th-active-col">DE1 (mm)</th>
            <th>Diagnóstico de Alineación</th>
          </tr>
        </thead>
        <tbody>
          ${state.dataConcat.map(d => `
            <tr>
              <td class="idx-td"><code>${d.date}</code></td>
              <td style="${d.p1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:600;'}">${d.p1}</td>
              <td style="${d.p2 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:600;'}">${d.p2}</td>
              <td style="${d.sh1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:600; color:var(--accent-teal);'}">${d.sh1}</td>
              <td style="${d.DE1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:700; color:var(--accent-emerald);'}">${d.DE1}</td>
              <td style="font-size:0.8rem; color:${d.note.includes('detonante') ? 'var(--accent-red)' : 'var(--text-muted)'};">
                ${d.note}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function attachEvents() {
    const btnSim = document.getElementById("concat-mode-sim");
    const btnWb = document.getElementById("concat-mode-wb");

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

    document.querySelectorAll(".df-chan-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.dataset.tab;
        renderWidget();
      });
    });
  }

  window.initSensorConcatWidget = function () {
    renderWidget();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("sensor-concat-container")) {
      window.initSensorConcatWidget();
    }
  });
})();
