/**
 * sensor-concat.js
 * Componente visual interactivo unificado para el Reto Integrador del Módulo 1 (Lección 1.8).
 * Fusión multivariada, concatenación temporal (pd.concat axis=1) y alineación de series:
 * 1. Pluviómetro SIATA (p1, p2)
 * 2. Sonda de Humedad Stevens (sh1)
 * 3. Extensómetro de Grieta (DE1)
 * 4. Acelerómetro e Inclinómetro (C1, B1, Tem_1)
 */

(function () {
  let state = {
    activeTab: "concat", // 'concat', 'pluv', 'hum', 'ext', 'accel'
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
    dataAccel: [
      { date: "2019-07-11 13:00:00", C1: 1.760, B1: -0.608, Tem_1: 33.87 },
      { date: "2019-07-11 14:00:00", C1: 1.760, B1: -0.609, Tem_1: 33.92 },
    ],
    dataConcat: [
      { date: "2019-07-11 13:50:00", p1: "0.0", p2: "0.0", sh1: "54.2", DE1: "0.000", C1: "NaN", B1: "NaN", Tem_1: "NaN", note: "Lectura simultánea lluvia/hum/ext", alert: false },
      { date: "2019-07-11 13:51:00", p1: "NaN", p2: "NaN", sh1: "NaN", DE1: "0.005", C1: "NaN", B1: "NaN", Tem_1: "NaN", note: "Muestreo rápido extensómetro (1 min)", alert: false },
      { date: "2019-07-11 13:52:00", p1: "NaN", p2: "NaN", sh1: "NaN", DE1: "0.012", C1: "NaN", B1: "NaN", Tem_1: "NaN", note: "Muestreo rápido extensómetro (1 min)", alert: false },
      { date: "2019-07-11 13:55:00", p1: "0.4", p2: "0.4", sh1: "54.3", DE1: "0.045", C1: "NaN", B1: "NaN", Tem_1: "NaN", note: "Inicio de lluvia y avance de humedad", alert: false },
      { date: "2019-07-11 14:00:00", p1: "1.2", p2: "1.2", sh1: "55.1", DE1: "0.120", C1: "1.76", B1: "-0.61", Tem_1: "33.9", note: "🎯 Sincronización horaria (los 4 sensores coinciden)", alert: false },
      { date: "2019-07-11 14:05:00", p1: "2.8", p2: "3.0", sh1: "56.4", DE1: "0.380", C1: "NaN", B1: "NaN", Tem_1: "NaN", note: "🚨 Aguacero intenso y aceleración de grieta", alert: true },
    ]
  };

  function renderWidget() {
    const container = document.getElementById("sensor-concat-container");
    if (!container) return;

    const tab = state.activeTab;

    container.innerHTML = `
      <div class="interactive-flow-card">
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 1 &bull; Lección 1.8 &bull; Reto Integrador</span>
            <h4 class="flow-title">Pipeline de Integración Cuatridimensional: Pluviómetro, Humedad, Extensómetro y Acelerómetro</h4>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; background:rgba(16,185,129,0.12); color:var(--accent-emerald); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:4px 10px; font-weight:600;">
              🏔️ Talud Ancón Norte
            </span>
          </div>
        </div>

        <!-- Esquema Conceptual de Arquitectura de Fusión (Diagrama de Bloques) -->
        <div style="margin-bottom:1.25rem;">
          <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:0.6rem;">
            Arquitectura de Concatenación Horizontal (<code>axis=1</code>) por DatetimeIndex:
          </div>

          <!-- Bloques de Entrada de los 4 Sensores -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap:0.75rem; margin-bottom:0.75rem;">
            <!-- Sensor 1: Pluviómetro -->
            <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-top:3px solid var(--accent-cyan); border-radius:var(--radius-sm); padding:0.75rem;">
              <div style="display:flex; align-items:center; gap:6px; font-weight:700; color:var(--accent-cyan); font-size:0.82rem;">
                🌧️ Pluviómetro SIATA
              </div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;"><code>pluviometro.csv</code></div>
              <div style="font-size:0.76rem; margin-top:4px; color:var(--text-main);">
                Canales: <code>['p1', 'p2']</code>
              </div>
              <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">Intervalo: c/5 min</div>
            </div>

            <!-- Sensor 2: Humedad Stevens -->
            <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-top:3px solid var(--accent-emerald); border-radius:var(--radius-sm); padding:0.75rem;">
              <div style="display:flex; align-items:center; gap:6px; font-weight:700; color:var(--accent-emerald); font-size:0.82rem;">
                💧 Sonda de Humedad
              </div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;"><code>humedad.csv</code></div>
              <div style="font-size:0.76rem; margin-top:4px; color:var(--text-main);">
                Canal: <code>['sh1']</code> (%)
              </div>
              <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">Intervalo: c/5 min</div>
            </div>

            <!-- Sensor 3: Extensómetro de Grieta -->
            <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-top:3px solid #f59e0b; border-radius:var(--radius-sm); padding:0.75rem;">
              <div style="display:flex; align-items:center; gap:6px; font-weight:700; color:#f59e0b; font-size:0.82rem;">
                📏 Extensómetro Hilo
              </div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;"><code>extensometro.csv</code></div>
              <div style="font-size:0.76rem; margin-top:4px; color:var(--text-main);">
                Canal: <code>['DE1']</code> (mm)
              </div>
              <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">Intervalo: c/1 min</div>
            </div>

            <!-- Sensor 4: Acelerómetro e Inclinómetro -->
            <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-top:3px solid #8b5cf6; border-radius:var(--radius-sm); padding:0.75rem;">
              <div style="display:flex; align-items:center; gap:6px; font-weight:700; color:#8b5cf6; font-size:0.82rem;">
                📐 Acelerómetro
              </div>
              <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;"><code>acelerometro.csv</code></div>
              <div style="font-size:0.76rem; margin-top:4px; color:var(--text-main);">
                Canales: <code>['C1','B1','Tem_1']</code>
              </div>
              <div style="font-size:0.7rem; color:var(--text-dim); margin-top:2px;">Intervalo: c/1 hora</div>
            </div>
          </div>

          <!-- Nodo Central de Fusión -->
          <div style="text-align:center; padding:0.65rem; background:rgba(59,130,246,0.06); border:1px dashed rgba(59,130,246,0.3); border-radius:var(--radius-sm); margin-bottom:0.75rem;">
            <div style="font-family:var(--font-mono); font-size:0.92rem; font-weight:700; color:var(--accent-primary);">
              df_ancon = pd.concat([df_pluv, df_hum, df_ext, df_accel], axis=1)
            </div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:3px;">
              Alineación cronológica automática mediante Outer Join &bull; 7 canales instrumentales integrados
            </div>
          </div>
        </div>

        <!-- Selector de Pestañas / Explorador de Datos -->
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:0.6rem; margin-bottom:0.75rem;">
          <span style="font-size:0.82rem; font-weight:600; color:var(--text-main);">
            Exploración de Canales Instrumentales:
          </span>
          <div class="channel-pills" style="display:flex; flex-wrap:wrap; gap:6px;">
            <button class="df-chan-btn ${tab === 'concat' ? 'active' : ''}" data-tab="concat" style="border:1px solid var(--accent-primary); font-weight:700;">
              🔗 Matriz Compilada (df_ancon)
            </button>
            <button class="df-chan-btn ${tab === 'pluv' ? 'active' : ''}" data-tab="pluv">
              🌧️ Pluviómetro (p1, p2)
            </button>
            <button class="df-chan-btn ${tab === 'hum' ? 'active' : ''}" data-tab="hum">
              💧 Humedad (sh1)
            </button>
            <button class="df-chan-btn ${tab === 'ext' ? 'active' : ''}" data-tab="ext">
              📏 Extensómetro (DE1)
            </button>
            <button class="df-chan-btn ${tab === 'accel' ? 'active' : ''}" data-tab="accel">
              📐 Acelerómetro (C1, B1, Tem_1)
            </button>
          </div>
        </div>

        <!-- Tabla Interactiva -->
        <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:0.75rem; margin-bottom:1.25rem;">
          <div class="table-responsive">
            ${renderTabTable(tab)}
          </div>
        </div>

        <!-- Pizarra de Conceptos Clave del Reto -->
        <div class="wb-card-glass" style="margin-bottom:1.25rem; border-left:3px solid var(--accent-primary); padding:0.85rem;">
          <div style="font-weight:700; color:var(--accent-primary); font-size:0.88rem; margin-bottom:0.35rem;">
            🧩 Desafío Computacional del Reto Integrador
          </div>
          <p style="font-size:0.84rem; color:var(--text-muted); margin:0; line-height:1.55;">
            En este reto final integrarás todos los pilares del Módulo 1 en un único script:
            definirás una <strong>función modular</strong> para estandarizar la lectura de cada sensor con su <code>DatetimeIndex</code>,
            emplearás un <strong>bucle <code>for</code> tradicional</strong> para iterar sobre la lista de archivos concatenando en la matriz maestra <code>df_ancon</code>,
            diagnosticarás el conflicto de escalas físicas con <code>df_ancon.plot()</code> y
            <strong>exportarás el archivo compilado</strong> a disco como <code>'df_ancon.csv'</code>.
          </p>
        </div>

        <!-- Tarjetas Metodológicas y Geotécnicas -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:0.9rem;">
          <div class="wb-card-glass" style="border-left:3px solid #8b5cf6; padding:0.85rem;">
            <strong style="color:#8b5cf6; font-size:0.88rem;">📐 El Acelerómetro en Ancón Norte</strong>
            <p style="font-size:0.82rem; color:var(--text-muted); margin:0.35rem 0 0 0; line-height:1.5;">
              Registra componentes angulares y cinemáticas del talud (<code>C1</code> y <code>B1</code>) junto con la temperatura de campo (<code>Tem_1</code>). Al unirse con la lluvia (causa), la humedad (avance de infiltración) y el extensómetro (deformación), obtenemos el monitoreo geotécnico acoplado completo.
            </p>
          </div>

          <div class="wb-card-glass" style="border-left:3px solid var(--accent-cyan); padding:0.85rem;">
            <strong style="color:var(--accent-cyan); font-size:0.88rem;">⏱️ Disparidad de Frecuencias (Outer Join)</strong>
            <p style="font-size:0.82rem; color:var(--text-muted); margin:0.35rem 0 0 0; line-height:1.5;">
              El extensómetro muestrea cada <strong>1 minuto</strong>, el pluviómetro y la humedad cada <strong>5 minutos</strong>, y el acelerómetro cada <strong>1 hora</strong>. Al concatenar con <code>axis=1</code>, Pandas preserva todas las marcas de tiempo e inserta <code>NaN</code> en las horas donde un sensor no registró.
            </p>
          </div>

          <div class="wb-card-glass" style="border-left:3px solid #f59e0b; padding:0.85rem;">
            <strong style="color:#f59e0b; font-size:0.88rem;">📊 ¿Por qué .plot() es 'malo' aquí?</strong>
            <p style="font-size:0.82rem; color:var(--text-muted); margin:0.35rem 0 0 0; line-height:1.5;">
              Al llamar <code>df_ancon.plot()</code> directamente, todas las variables comparten un único eje vertical: la humedad (~55%) y la temperatura (~34°C) acaparan la escala, aplastando la lluvia (0-5 mm) y la grieta (0-1 mm) al fondo. Esta limitación justifica el <strong>Módulo 2</strong> de visualización especializada.
            </p>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderTabTable(tab) {
    if (tab === "pluv") {
      return `
        <table class="df-sensor-table" style="width:100%; font-size:0.8rem;">
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
                <td style="color:var(--text-muted); font-size:0.78rem;">Estación SIATA Ancón Norte (c/5 min)</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (tab === "hum") {
      return `
        <table class="df-sensor-table" style="width:100%; font-size:0.8rem;">
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
                <td style="font-weight:700; color:var(--accent-emerald);">${d.sh1.toFixed(1)} %</td>
                <td style="color:var(--text-muted); font-size:0.78rem;">Sonda Stevens HydraProbe (c/5 min)</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (tab === "ext") {
      return `
        <table class="df-sensor-table" style="width:100%; font-size:0.8rem;">
          <thead>
            <tr>
              <th class="idx-th">Fecha y Hora (DatetimeIndex)</th>
              <th>DE1 (Apertura Grieta, mm)</th>
              <th>Frecuencia de Adquisición</th>
            </tr>
          </thead>
          <tbody>
            ${state.dataExt.map(d => `
              <tr>
                <td class="idx-td"><code>${d.date}</code></td>
                <td style="font-weight:700; color:#f59e0b;">${d.DE1.toFixed(3)} mm</td>
                <td style="color:var(--text-muted); font-size:0.78rem;">Muestreo continuo cada 1 min</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (tab === "accel") {
      return `
        <table class="df-sensor-table" style="width:100%; font-size:0.8rem;">
          <thead>
            <tr>
              <th class="idx-th">Fecha y Hora (DatetimeIndex)</th>
              <th style="color:#8b5cf6;">C1 (Canal 1)</th>
              <th style="color:#8b5cf6;">B1 (Canal 2)</th>
              <th style="color:#ec4899;">Tem_1 (°C)</th>
              <th>Frecuencia</th>
            </tr>
          </thead>
          <tbody>
            ${state.dataAccel.map(d => `
              <tr>
                <td class="idx-td"><code>${d.date}</code></td>
                <td style="font-weight:700; color:#8b5cf6;">${d.C1.toFixed(3)}</td>
                <td style="font-weight:700; color:#8b5cf6;">${d.B1.toFixed(3)}</td>
                <td style="font-weight:700; color:#ec4899;">${d.Tem_1.toFixed(2)} °C</td>
                <td style="color:var(--text-muted); font-size:0.78rem;">Muestreo horario (c/1 hora)</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Concat table (df_ancon)
    return `
      <table class="df-sensor-table" style="width:100%; font-size:0.78rem;">
        <thead>
          <tr>
            <th class="idx-th">DatetimeIndex</th>
            <th style="color:var(--accent-cyan);">p1</th>
            <th style="color:var(--accent-cyan);">p2</th>
            <th style="color:var(--accent-emerald);">sh1</th>
            <th style="color:#f59e0b;">DE1</th>
            <th style="color:#8b5cf6;">C1</th>
            <th style="color:#8b5cf6;">B1</th>
            <th style="color:#ec4899;">Tem_1</th>
            <th>Diagnóstico de Alineación</th>
          </tr>
        </thead>
        <tbody>
          ${state.dataConcat.map(d => `
            <tr class="${d.alert ? 'hl-row' : ''}">
              <td class="idx-td"><code>${d.date.split(' ')[1]}</code></td>
              <td style="${d.p1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:600;'}">${d.p1}</td>
              <td style="${d.p2 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:600;'}">${d.p2}</td>
              <td style="${d.sh1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:700; color:var(--accent-emerald);'}">${d.sh1}</td>
              <td style="${d.DE1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:700; color:#f59e0b;'}">${d.DE1}</td>
              <td style="${d.C1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:700; color:#8b5cf6;'}">${d.C1}</td>
              <td style="${d.B1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:700; color:#8b5cf6;'}">${d.B1}</td>
              <td style="${d.Tem_1 === 'NaN' ? 'color:var(--text-dim);' : 'font-weight:700; color:#ec4899;'}">${d.Tem_1}</td>
              <td style="font-size:0.74rem; color:${d.alert ? '#ef4444; font-weight:700;' : 'var(--text-muted)'};">
                ${d.note}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function attachEvents() {
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
