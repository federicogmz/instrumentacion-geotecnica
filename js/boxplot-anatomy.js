/**
 * boxplot-anatomy.js
 * Pizarra Conceptual y Simulador Dinámico e Interactivo de la Anatomía de Tukey (Lección 2.5).
 * 
 * Mejoras aplicadas:
 * 1. Esquema SVG Espacioso y Didáctico:
 *    - Eliminado el aplastamiento vertical (escala didáctica con quiebre de eje '//').
 *    - Caja amplia (90px de altura), bigotes generosos (50px c/u) y distancia vertical mínima de 40px entre etiquetas.
 *    - Cero solapamiento de textos o cotas.
 * 2. Estilos de Botones en Modo Claro y Oscuro:
 *    - Botón activo con fondo azul vibrante (#2563eb) y texto blanco nítido (#ffffff), sin perderse en blanco.
 *    - Botones inactivos con contraste óptimo en ambos temas.
 * 3. Simulador en Vivo y Métricas:
 *    - Todos los números formateados a 2 decimales (.toFixed(2)).
 *    - Alternancia en tiempo real de ruido de telemetría.
 */

(function () {
  let state = {
    hasOutlier: true,
    selectedPart: "all", // 'all', 'outlier', 'whisker_top', 'box_iqr', 'median', 'whisker_bottom', 'threshold'
  };

  const cleanData = [4.1, 4.5, 4.8, 5.0, 5.2, 5.4, 5.7, 6.0, 6.3, 6.8];
  const noiseData = [4.1, 4.5, 4.8, 5.0, 5.2, 5.4, 5.7, 6.0, 6.3, 48.5]; // Ruido de 48.5 mm

  function getStats(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const n = sorted.length;
    const q1 = sorted[Math.floor(n * 0.25)];
    const median = (sorted[Math.floor((n - 1) / 2)] + sorted[Math.ceil((n - 1) / 2)]) / 2;
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(sorted[0], q1 - 1.5 * iqr);
    const upperWhisker = Math.min(sorted[n - 1], q3 + 1.5 * iqr);
    const mean = sorted.reduce((a, b) => a + b, 0) / n;
    const outliers = sorted.filter(x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr);

    return {
      min: sorted[0],
      max: sorted[n - 1],
      q1: q1,
      median: median,
      q3: q3,
      iqr: iqr,
      lowerWhisker: lowerWhisker,
      upperWhisker: upperWhisker,
      mean: mean,
      outliers: outliers,
    };
  }

  const partDetails = {
    all: {
      badge: "Vista Global Integrada",
      title: "Anatomía Completa de la Caja y Bigotes (Tukey)",
      formula: "Distribución No Paramétrica Basada en Rangos Cuantílicos",
      desc: "El Boxplot divide la muestra en 4 cuartiles ($Q_1, Q_2, Q_3$). A diferencia del promedio y la desviación estándar, <strong>no asume una campana de Gauss</strong>, por lo que es inmune a las asimetrías de lluvia y picos erráticos de telemetría en sensores de laderas.",
      geotech: "Permite comparar de un solo vistazo la variabilidad de sensores con unidades distintas o identificar sensores con problemas de ruido eléctrico.",
      code: "plt.boxplot(df['DE1'].dropna(), patch_artist=True)\nplt.show()",
      color: "#2563eb",
    },
    outlier: {
      badge: "Punto Atípico de Telemetría",
      title: "Outlier: Lecturas Extremas Anómalas",
      formula: "x > Q_3 + 1.5 \\times IQR \\quad \\text{ó} \\quad x < Q_1 - 1.5 \\times IQR",
      desc: "Cualquier registro situado más allá de los bigotes se dibuja como un punto aislado. En instrumentación geotécnica, los outliers suelen ser descargas estáticas, cortes de señal de radio o fallas en el convertidor analógico-digital (ADC).",
      geotech: "⚠️ <strong>Regla Geotécnica:</strong> Si un pico coincide con lluvia intensa, puede ser un pulso real de deformación. Si ocurre en día seco y dura solo 1 lectura, es 100% ruido de telemetría y debe aislarse.",
      code: "# Detección programática de outliers en Pandas:\noutliers = df[df['DE1'] > q3 + 1.5 * iqr]['DE1']",
      color: "#ef4444",
    },
    whisker_top: {
      badge: "Límite Superior Normal",
      title: "Bigote Superior (Upper Whisker)",
      formula: "\\text{Bigote Sup} = \\min(\\max(\\text{datos}), Q_3 + 1.5 \\times IQR)",
      desc: "Se extiende desde la tapa de la caja ($Q_3$) hasta el dato real más alejado que no supere el umbral $Q_3 + 1.5 \\times IQR$. Todo lo que quede dentro de este bigote se considera variación natural permisible del sensor.",
      geotech: "En extensómetros, este límite recoge la dilatación térmica diaria normal del alambre sensor (variaciones de 1 a 3 mm por temperatura ambiental).",
      code: "upper_whisker = min(s.max(), q3 + 1.5 * iqr)",
      color: "#2563eb",
    },
    box_iqr: {
      badge: "Caja Central de Dispersión",
      title: "Caja Intercuartílica (IQR = Q3 - Q1)",
      formula: "IQR = Q_3 - Q_1 \\quad (50\\% \\text{ Central de las Observaciones})",
      desc: "El cuerpo rectangular de la caja abarca desde el percentil 25 ($Q_1$) hasta el percentil 75 ($Q_3$). Su altura gráfica representa el Rango Intercuartílico ($IQR$), la medida de dispersión más robusta de la estadística moderna.",
      geotech: "Una caja angosta indica un sensor muy estable en terreno firme; una caja alta o ensanchada refleja laderas activas con reptación continua.",
      code: "q1 = df['DE1'].quantile(0.25)\nq3 = df['DE1'].quantile(0.75)\niqr = q3 - q1",
      color: "#0284c7",
    },
    median: {
      badge: "Tendencia Central Robusta",
      title: "Mediana (Q2 - Percentil 50)",
      formula: "\\text{Mediana} = \\text{Punto medio de la serie ordenada}",
      desc: "Divide exactamente la mitad inferior de los datos de la mitad superior. Es <strong>completamente inmune a valores extremos</strong>: si un sensor de 5 mm sufre un falso pico de 1000 mm, la mediana no se moverá ni un solo milímetro.",
      geotech: "🛡️ <strong>Protocolo en Monitoreo:</strong> Para alimentar modelos de alerta temprana en tiempo real, se debe usar la mediana móvil y no el promedio móvil, previniendo falsas alarmas de evacuación.",
      code: "mediana = df['DE1'].median()  # ¡Inmune a picos espurios!",
      color: "#d97706",
    },
    whisker_bottom: {
      badge: "Límite Inferior Normal",
      title: "Bigote Inferior (Lower Whisker)",
      formula: "\\text{Bigote Inf} = \\max(\\min(\\text{datos}), Q_1 - 1.5 \\times IQR)",
      desc: "Se extiende hacia abajo desde la base de la caja ($Q_1$) hasta la menor lectura que no esté por debajo de $Q_1 - 1.5 \\times IQR$. En sensores de deformación sin precarga, suele aproximarse a cero.",
      geotech: "Permite detectar descalibraciones por aflojamiento del anclaje o valores negativos anómalos de telemetría (como el -999.0 de error).",
      code: "lower_whisker = max(s.min(), q1 - 1.5 * iqr)",
      color: "#2563eb",
    },
    threshold: {
      badge: "Criterio Cuantitativo de Alerta",
      title: "Umbral Superior de Tukey (Q3 + 1.5 × IQR)",
      formula: "\\text{Límite de Alerta} = Q_3 + 1.5 \\times IQR",
      desc: "Línea de corte estadística estandarizada por John Tukey. En geotecnia se adopta como el primer umbral objetivo para marcar registros que ameritan inspección en campo o revisión de cámara de video.",
      geotech: "Define la frontera matemática entre el régimen elástico-estacional y una anomalía cinemática en la ladera.",
      code: "limite_alerta = q3 + 1.5 * iqr\nprint(f'Límite de Alerta: {limite_alerta:.2f} mm')",
      color: "#ea580c",
    },
  };

  function renderWidget() {
    const container = document.getElementById("boxplot-anatomy-container");
    if (!container) return;

    const data = state.hasOutlier ? noiseData : cleanData;
    const s = getStats(data);
    const p = state.selectedPart;
    const d = partDetails[p] || partDetails.all;

    // Coordenadas fijas didácticas (Caja alta y espaciosa, sin aplastamiento)
    // viewBox: 0 0 500 350
    const yOutlier = 34;      // 48.50 mm (Outlier arriba)
    const yBreak = 70;        // Quiebre de eje //
    const yUpper = 105;       // Bigote Sup (7.80 mm)
    const yQ3 = 155;          // Q3 (6.00 mm)
    const yMedian = 195;      // Mediana (5.30 mm)
    const yQ1 = 235;          // Q1 (4.80 mm)
    const yLower = 280;       // Bigote Inf (4.10 mm)
    const yBase = 320;        // 0.00 mm (Base)

    const isSel = (part) => p === part || p === "all";

    container.innerHTML = `
      <style>
        .bp-anatomy-card {
          background: var(--bg-card);
          border: 1px solid var(--border-card);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          margin: 1.25rem 0;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        [data-theme="light"] .bp-anatomy-card {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }
        .bp-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .bp-part-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .bp-part-btn {
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          color: var(--text-main);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        [data-theme="light"] .bp-part-btn {
          background: #f1f5f9;
          color: #334155;
          border-color: #cbd5e1;
        }
        .bp-part-btn:hover {
          border-color: #2563eb;
          color: #2563eb;
        }
        [data-theme="light"] .bp-part-btn:hover {
          background: #e2e8f0;
          color: #1d4ed8;
        }
        .bp-part-btn.active {
          background: #2563eb !important;
          color: #ffffff !important;
          border-color: #1d4ed8 !important;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35) !important;
        }
        [data-theme="light"] .bp-part-btn.active {
          background: #2563eb !important;
          color: #ffffff !important;
          border-color: #1d4ed8 !important;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3) !important;
        }
        .bp-schematic-wrap {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 1.25rem;
          align-items: stretch;
        }
        @media (max-width: 920px) {
          .bp-schematic-wrap {
            grid-template-columns: 1fr;
          }
        }
        .bp-svg-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        [data-theme="light"] .bp-svg-box {
          background: #f8fafc;
          border-color: #e2e8f0;
        }
        .bp-svg-element {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .bp-svg-element:hover {
          filter: drop-shadow(0 0 5px rgba(37, 99, 235, 0.5));
        }
        .bp-detail-box {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .bp-info-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-left: 4px solid ${d.color};
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        [data-theme="light"] .bp-info-card {
          background: #ffffff;
          border-color: #e2e8f0;
          border-left-color: ${d.color};
        }
        .bp-sim-section {
          border-top: 1px dashed var(--border-subtle);
          padding-top: 1rem;
          margin-top: 0.25rem;
        }
        .bp-toggle-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.85rem;
        }
        .bp-mode-btn {
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          color: var(--text-muted);
        }
        [data-theme="light"] .bp-mode-btn {
          background: #f1f5f9;
          color: #475569;
          border-color: #cbd5e1;
        }
        .bp-mode-btn.active-noise {
          background: #fef2f2 !important;
          color: #dc2626 !important;
          border-color: #f87171 !important;
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2) !important;
        }
        [data-theme="dark"] .bp-mode-btn.active-noise {
          background: rgba(220, 38, 38, 0.15) !important;
          color: #fca5a5 !important;
        }
        .bp-mode-btn.active-clean {
          background: #ecfdf5 !important;
          color: #059669 !important;
          border-color: #34d399 !important;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2) !important;
        }
        [data-theme="dark"] .bp-mode-btn.active-clean {
          background: rgba(5, 150, 105, 0.15) !important;
          color: #6ee7b7 !important;
        }
        .bp-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 0.85rem;
        }
        .bp-metric-box {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        [data-theme="light"] .bp-metric-box {
          background: #ffffff;
          border-color: #e2e8f0;
        }
        .bp-metric-val {
          font-size: 1.55rem;
          font-weight: 800;
          font-family: var(--font-mono);
          line-height: 1.2;
        }
      </style>

      <div class="bp-anatomy-card">
        <!-- Encabezado Principal -->
        <div class="flow-header">
          <div class="flow-title-group">
            <span class="flow-badge">Módulo 2 &bull; Lección 2.5 &bull; Pizarra Didáctica &amp; Simulador Integrado</span>
            <h4 class="flow-title">📊 Anatomía Técnica del Boxplot de Tukey y Detección de Ruido</h4>
          </div>
          <div class="bp-status-pill ${state.hasOutlier ? 'pill-alert' : 'pill-ok'}">
            ${state.hasOutlier ? '⚠️ 1 Outlier de Telemetría (48.50 mm)' : '✓ Señal Saneada en Rango Normal'}
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          El <strong>Diagrama de Caja y Bigotes (Boxplot de Tukey)</strong> aísla cuantitativamente lecturas espurias de sensores sin asumir una distribución gaussiana. Explora los componentes anatómicos en el esquema de ingeniería y comprueba abajo la resistencia matemática de la mediana:
        </p>

        <!-- Barra de Navegación de Componentes Anatómicos -->
        <div class="bp-toolbar">
          <span style="font-size:0.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.04em;">
            🔍 Inspeccionar Elemento Anatómico:
          </span>
          <div class="bp-part-nav">
            <button class="bp-part-btn ${p === 'all' ? 'active' : ''}" data-part="all">📐 Vista General</button>
            <button class="bp-part-btn ${p === 'outlier' ? 'active' : ''}" data-part="outlier">🔴 Outliers</button>
            <button class="bp-part-btn ${p === 'whisker_top' ? 'active' : ''}" data-part="whisker_top">T Bigote Superior</button>
            <button class="bp-part-btn ${p === 'box_iqr' ? 'active' : ''}" data-part="box_iqr">📦 Caja Central (IQR)</button>
            <button class="bp-part-btn ${p === 'median' ? 'active' : ''}" data-part="median">⭐ Mediana (Q2)</button>
            <button class="bp-part-btn ${p === 'whisker_bottom' ? 'active' : ''}" data-part="whisker_bottom">⊥ Bigote Inferior</button>
            <button class="bp-part-btn ${p === 'threshold' ? 'active' : ''}" data-part="threshold">📏 Umbral Alerta</button>
          </div>
        </div>

        <!-- 1. ESQUEMA TÉCNICO DIDÁCTICO (PIZARRA VECTORIAL ESPACIOSA) -->
        <div class="bp-schematic-wrap">
          <!-- Esquema SVG Vectorial Técnico -->
          <div class="bp-svg-box">
            <div style="width:100%; display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.74rem; font-weight:700; color:var(--text-muted);">
              <span>ESQUEMA DE COTAS DE INGENIERÍA</span>
              <span>MAGNITUD (mm)</span>
            </div>

            <svg viewBox="0 0 500 350" style="width:100%; max-height:340px; overflow:visible;">
              <!-- EJE VERTICAL GRADUADO -->
              <g class="bp-axis-group">
                <!-- Línea continua inferior (0 a 10 mm) -->
                <line x1="58" y1="${yUpper - 10}" x2="58" y2="${yBase}" stroke="var(--border-subtle)" stroke-width="2" />
                <!-- Línea discontinua superior hacia el outlier -->
                <line x1="58" y1="${yOutlier - 10}" x2="58" y2="${yBreak - 10}" stroke="var(--border-subtle)" stroke-width="2" stroke-dasharray="3 3" />
                
                <!-- Símbolo de Quiebre de Escala // -->
                <g opacity="0.8">
                  <line x1="50" y1="${yBreak - 4}" x2="66" y2="${yBreak - 12}" stroke="var(--text-muted)" stroke-width="2" />
                  <line x1="50" y1="${yBreak + 4}" x2="66" y2="${yBreak - 4}" stroke="var(--text-muted)" stroke-width="2" />
                  <text x="74" y="${yBreak + 2}" font-size="8" font-weight="700" fill="var(--text-dim)">Quiebre de escala //</text>
                </g>

                <text x="54" y="16" font-size="10" font-weight="800" fill="var(--text-muted)" text-anchor="middle">mm</text>

                <!-- Ticks numéricos con su valor exacto -->
                ${state.hasOutlier ? `
                  <line x1="52" y1="${yOutlier}" x2="58" y2="${yOutlier}" stroke="#ef4444" stroke-width="2" />
                  <text x="46" y="${yOutlier + 4}" font-size="10" font-weight="800" fill="#ef4444" text-anchor="end" font-family="var(--font-mono)">48.5</text>
                ` : ''}

                <line x1="52" y1="${yUpper}" x2="58" y2="${yUpper}" stroke="var(--text-dim)" stroke-width="1.5" />
                <text x="46" y="${yUpper + 4}" font-size="9" font-weight="700" fill="var(--text-dim)" text-anchor="end" font-family="var(--font-mono)">7.8</text>

                <line x1="52" y1="${yQ3}" x2="58" y2="${yQ3}" stroke="var(--text-dim)" stroke-width="1.5" />
                <text x="46" y="${yQ3 + 4}" font-size="9" font-weight="700" fill="var(--text-dim)" text-anchor="end" font-family="var(--font-mono)">6.0</text>

                <line x1="52" y1="${yMedian}" x2="58" y2="${yMedian}" stroke="#d97706" stroke-width="2" />
                <text x="46" y="${yMedian + 4}" font-size="10" font-weight="800" fill="#d97706" text-anchor="end" font-family="var(--font-mono)">5.3</text>

                <line x1="52" y1="${yQ1}" x2="58" y2="${yQ1}" stroke="var(--text-dim)" stroke-width="1.5" />
                <text x="46" y="${yQ1 + 4}" font-size="9" font-weight="700" fill="var(--text-dim)" text-anchor="end" font-family="var(--font-mono)">4.8</text>

                <line x1="52" y1="${yLower}" x2="58" y2="${yLower}" stroke="var(--text-dim)" stroke-width="1.5" />
                <text x="46" y="${yLower + 4}" font-size="9" font-weight="700" fill="var(--text-dim)" text-anchor="end" font-family="var(--font-mono)">4.1</text>

                <line x1="52" y1="${yBase}" x2="58" y2="${yBase}" stroke="var(--text-dim)" stroke-width="1.5" />
                <text x="46" y="${yBase + 4}" font-size="9" fill="var(--text-dim)" text-anchor="end" font-family="var(--font-mono)">0.0</text>
              </g>

              <!-- LÍNEA DE CORTE DE ALERTA DE TUKEY (Q3 + 1.5 * IQR = 7.80 mm) -->
              <g class="bp-svg-element" data-part="threshold" opacity="${isSel('threshold') ? '1' : '0.35'}">
                <line x1="62" y1="${yUpper}" x2="480" y2="${yUpper}" stroke="#ea580c" stroke-width="${p === 'threshold' ? '2.5' : '1.5'}" stroke-dasharray="6 4" />
                <rect x="230" y="${yUpper - 22}" width="225" height="18" rx="3" fill="rgba(234, 88, 12, 0.12)" stroke="#ea580c" stroke-width="1" />
                <text x="238" y="${yUpper - 9}" font-size="9" font-weight="800" fill="#ea580c">
                  UMBRAL ALERTA: Q3 + 1.5×IQR = ${s.upperWhisker.toFixed(2)} mm
                </text>
              </g>

              <!-- OUTLIERS SUPERIORES -->
              ${state.hasOutlier ? `
                <g class="bp-svg-element" data-part="outlier" opacity="${isSel('outlier') ? '1' : '0.3'}">
                  <circle cx="150" cy="${yOutlier}" r="${p === 'outlier' ? '9' : '7'}" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" stroke-width="2" />
                  <circle cx="150" cy="${yOutlier}" r="4" fill="#ef4444" />
                  
                  <!-- Conector y etiqueta didáctica -->
                  <line x1="162" y1="${yOutlier}" x2="200" y2="${yOutlier}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="2 2" />
                  <rect x="205" y="${yOutlier - 12}" width="240" height="24" rx="4" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" stroke-width="1.2" />
                  <text x="214" y="${yOutlier + 4}" font-size="10" font-weight="800" fill="#ef4444">
                    🔴 OUTLIER: 48.50 mm (Pico Espurio de Telemetría)
                  </text>
                </g>
              ` : ''}

              <!-- BIGOTE SUPERIOR (Cap y Tallo) -->
              <g class="bp-svg-element" data-part="whisker_top" opacity="${isSel('whisker_top') ? '1' : '0.35'}">
                <!-- Tallo vertical (de Q3 a Bigote Sup) -->
                <line x1="150" y1="${yUpper}" x2="150" y2="${yQ3}" stroke="${p === 'whisker_top' ? '#2563eb' : '#3b82f6'}" stroke-width="${p === 'whisker_top' ? '3.5' : '2.5'}" />
                <!-- Tope horizontal (Cap) -->
                <line x1="115" y1="${yUpper}" x2="185" y2="${yUpper}" stroke="${p === 'whisker_top' ? '#2563eb' : '#3b82f6'}" stroke-width="${p === 'whisker_top' ? '4' : '3'}" stroke-linecap="round" />
                
                <!-- Etiqueta a la derecha -->
                <line x1="188" y1="${yUpper}" x2="215" y2="${yUpper}" stroke="#3b82f6" stroke-width="1" stroke-dasharray="2 2" />
                <rect x="218" y="${yUpper + 6}" width="165" height="18" rx="3" fill="rgba(37, 99, 235, 0.08)" stroke="#3b82f6" stroke-width="0.8" />
                <text x="224" y="${yUpper + 19}" font-size="9" font-weight="700" fill="#2563eb">
                  Bigote Sup: ${s.upperWhisker.toFixed(2)} mm
                </text>
              </g>

              <!-- COTA DE 1.5 * IQR -->
              <g class="bp-svg-element" data-part="whisker_top" opacity="${isSel('whisker_top') ? '1' : '0.4'}">
                <path d="M 195 ${yUpper} L 202 ${yUpper} L 202 ${(yUpper + yQ3)/2} L 207 ${(yUpper + yQ3)/2} L 202 ${(yUpper + yQ3)/2} L 202 ${yQ3} L 195 ${yQ3}" 
                      fill="none" stroke="#60a5fa" stroke-width="1.5" />
                <text x="212" y="${(yUpper + yQ3)/2 + 4}" font-size="8.5" font-weight="700" fill="#3b82f6">
                  1.5 × IQR = ${(1.5 * s.iqr).toFixed(2)} mm
                </text>
              </g>

              <!-- CAJA PRINCIPAL (IQR = Q3 - Q1 = 80px de altura) -->
              <g class="bp-svg-element" data-part="box_iqr" opacity="${isSel('box_iqr') ? '1' : '0.35'}">
                <rect x="95" y="${yQ3}" width="110" height="${yQ1 - yQ3}" 
                      fill="${p === 'box_iqr' ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.14)'}" 
                      stroke="${p === 'box_iqr' ? '#0284c7' : '#0ea5e9'}" 
                      stroke-width="${p === 'box_iqr' ? '3.5' : '2.5'}" rx="4" />
                
                <!-- Etiqueta Q3 -->
                <text x="90" y="${yQ3 + 4}" font-size="9" font-weight="700" fill="var(--text-muted)" text-anchor="end">Q3 (75%): ${s.q3.toFixed(2)} mm</text>
                
                <!-- Etiqueta Q1 -->
                <text x="90" y="${yQ1 + 4}" font-size="9" font-weight="700" fill="var(--text-muted)" text-anchor="end">Q1 (25%): ${s.q1.toFixed(2)} mm</text>
              </g>

              <!-- MEDIANA ROBUSTA (Q2) -->
              <g class="bp-svg-element" data-part="median" opacity="${isSel('median') ? '1' : '0.35'}">
                <line x1="95" y1="${yMedian}" x2="205" y2="${yMedian}" 
                      stroke="#d97706" stroke-width="${p === 'median' ? '5' : '3.5'}" stroke-linecap="round" />
                <circle cx="150" cy="${yMedian}" r="${p === 'median' ? '5.5' : '4'}" fill="#d97706" />
                
                <!-- Conector y placa de la mediana -->
                <line x1="208" y1="${yMedian}" x2="238" y2="${yMedian}" stroke="#d97706" stroke-width="1.5" stroke-dasharray="2 2" />
                <rect x="242" y="${yMedian - 12}" width="200" height="24" rx="4" fill="rgba(217, 119, 6, 0.15)" stroke="#d97706" stroke-width="1.3" />
                <text x="250" y="${yMedian + 4}" font-size="10.5" font-weight="800" fill="#d97706">
                  ⭐ MEDIANA (Q2): ${s.median.toFixed(2)} mm
                </text>
              </g>

              <!-- COTA DIMENSIONAL DE INGENIERÍA: BRACKET DE IQR -->
              <g class="bp-svg-element" data-part="box_iqr" opacity="${isSel('box_iqr') ? '1' : '0.4'}">
                <path d="M 210 ${yQ3} L 218 ${yQ3} L 218 ${yMedian} L 224 ${yMedian} L 218 ${yMedian} L 218 ${yQ1} L 210 ${yQ1}" 
                      fill="none" stroke="#0284c7" stroke-width="1.6" />
                <text x="228" y="${yQ1 - 10}" font-size="9" font-weight="800" fill="#0284c7">
                  IQR = ${s.iqr.toFixed(2)} mm (50% Central)
                </text>
              </g>

              <!-- BIGOTE INFERIOR (Cap y Tallo) -->
              <g class="bp-svg-element" data-part="whisker_bottom" opacity="${isSel('whisker_bottom') ? '1' : '0.35'}">
                <!-- Tallo vertical (de Q1 a Bigote Inf) -->
                <line x1="150" y1="${yQ1}" x2="150" y2="${yLower}" stroke="${p === 'whisker_bottom' ? '#2563eb' : '#3b82f6'}" stroke-width="${p === 'whisker_bottom' ? '3.5' : '2.5'}" />
                <!-- Tope horizontal (Cap) -->
                <line x1="115" y1="${yLower}" x2="185" y2="${yLower}" stroke="${p === 'whisker_bottom' ? '#2563eb' : '#3b82f6'}" stroke-width="${p === 'whisker_bottom' ? '4' : '3'}" stroke-linecap="round" />
                
                <!-- Etiqueta a la derecha -->
                <line x1="188" y1="${yLower}" x2="215" y2="${yLower}" stroke="#3b82f6" stroke-width="1" stroke-dasharray="2 2" />
                <rect x="218" y="${yLower - 10}" width="165" height="20" rx="3" fill="rgba(37, 99, 235, 0.08)" stroke="#3b82f6" stroke-width="0.8" />
                <text x="224" y="${yLower + 4}" font-size="9" font-weight="700" fill="#2563eb">
                  Bigote Inf: ${s.lowerWhisker.toFixed(2)} mm
                </text>
              </g>
            </svg>
            <div style="font-size:0.72rem; color:var(--text-dim); margin-top:4px;">
              💡 Haz clic en los botones superiores o en cualquier elemento del dibujo para inspeccionar su rol físico.
            </div>
          </div>

          <!-- Tarjeta de Fundamento Didáctico -->
          <div class="bp-detail-box">
            <div class="bp-info-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span class="badge" style="background:${d.color}22; color:${d.color}; border:1px solid ${d.color}66; font-size:0.72rem; font-weight:800;">
                  ${d.badge}
                </span>
                <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim);">Tukey (1977)</span>
              </div>
              <h5 style="margin:0 0 6px 0; color:var(--text-main); font-size:1.02rem;">${d.title}</h5>
              
              <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:6px 10px; margin-bottom:8px; font-family:var(--font-mono); font-size:0.8rem; color:${d.color}; font-weight:700;">
                ${d.formula}
              </div>

              <p style="margin:0 0 8px 0; font-size:0.83rem; color:var(--text-muted); line-height:1.5;">
                ${d.desc}
              </p>

              <div style="background:rgba(30, 41, 59, 0.4); border-left:3px solid ${d.color}; border-radius:0 var(--radius-sm) var(--radius-sm) 0; padding:6px 10px; margin-bottom:8px; font-size:0.8rem; color:var(--text-main); line-height:1.45;">
                <strong>Geotecnia de Taludes:</strong> ${d.geotech}
              </div>

              <div class="wb-code-block" style="font-size:0.75rem; margin-top:0;">${d.code}</div>
            </div>
          </div>
        </div>

        <!-- 2. SIMULADOR INTERACTIVO EN VIVO: PRUEBA DE ROBUSTEZ FRENTE A RUIDO -->
        <div class="bp-sim-section">
          <div class="bp-toggle-bar">
            <div>
              <strong style="font-size:0.88rem; color:var(--text-main);">⚡ Simulador de Telemetría: Media vs Mediana ante Descargas Estáticas</strong>
              <div style="font-size:0.78rem; color:var(--text-muted);">
                Observa cómo un único pico de ruido electromagnético falsea la media aritmética pero no altera la mediana:
              </div>
            </div>

            <div style="display:flex; gap:0.5rem;">
              <button class="bp-mode-btn ${state.hasOutlier ? 'active-noise' : ''}" id="bp-btn-noise">
                ⚡ Señal con Ruido (Pico = 48.50 mm)
              </button>
              <button class="bp-mode-btn ${!state.hasOutlier ? 'active-clean' : ''}" id="bp-btn-clean">
                ✅ Señal Saneada (Sin Outliers)
              </button>
            </div>
          </div>

          <!-- Métricas Comparativas Directas -->
          <div class="bp-metrics-grid">
            <!-- Tarjeta Media Aritmética -->
            <div class="bp-metric-box" style="border-top:3px solid ${state.hasOutlier ? '#ef4444' : '#2563eb'};">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.78rem; font-weight:700; color:var(--text-muted);">MEDIA ARITMÉTICA (<code>df.mean()</code>)</span>
                <span class="badge" style="background:${state.hasOutlier ? '#fef2f2' : '#f0fdf4'}; color:${state.hasOutlier ? '#b91c1c' : '#15803d'}; font-size:0.7rem;">
                  ${state.hasOutlier ? '🚨 Distorsionada' : 'Normal'}
                </span>
              </div>
              <div class="bp-metric-val" style="color:${state.hasOutlier ? '#ef4444' : 'var(--text-main)'};">
                ${s.mean.toFixed(2)} <span style="font-size:0.9rem; font-weight:600; color:var(--text-muted);">mm</span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
                ${state.hasOutlier 
                  ? '⚠️ <strong>Falsa Alarma:</strong> Se dispara artificialmente a <strong>' + s.mean.toFixed(2) + ' mm</strong> por 1 sola lectura espuria. Provocaría una orden de evacuación innecesaria en la faena minera o ladera vial.'
                  : 'Sensible pero representativa únicamente cuando los datos no contienen picos de telemetría.'}
              </div>
            </div>

            <!-- Tarjeta Mediana Robusta -->
            <div class="bp-metric-box" style="border-top:3px solid #10b981;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.78rem; font-weight:700; color:var(--text-muted);">MEDIANA ROBUSTA (<code>df.median()</code>)</span>
                <span class="badge" style="background:#ecfdf5; color:#047857; font-size:0.7rem;">
                  🛡️ Imperturbable
                </span>
              </div>
              <div class="bp-metric-val" style="color:#10b981;">
                ${s.median.toFixed(2)} <span style="font-size:0.9rem; font-weight:600; color:var(--text-muted);">mm</span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
                🛡️ <strong>Inalterable:</strong> Permanece anclada en <strong>${s.median.toFixed(2)} mm</strong>. Aísla automáticamente el pico espurio sin alterar el diagnóstico de estabilidad real de la ladera.
              </div>
            </div>

            <!-- Resumen Estadístico de Rango -->
            <div class="bp-metric-box" style="border-top:3px solid #0284c7;">
              <div style="font-size:0.78rem; font-weight:700; color:var(--text-muted);">RESUMEN CUANTÍLICO</div>
              <div style="display:flex; flex-direction:column; gap:4px; font-size:0.8rem; color:var(--text-main); margin-top:2px;">
                <div>Rango Intercuartílico (IQR): <strong style="font-family:var(--font-mono); color:#0284c7;">${s.iqr.toFixed(2)} mm</strong></div>
                <div>Límites Normales: <strong style="font-family:var(--font-mono);">[${s.lowerWhisker.toFixed(2)}, ${s.upperWhisker.toFixed(2)}] mm</strong></div>
                <div>Umbral Superior Alerta: <strong style="font-family:var(--font-mono); color:#ea580c;">${(s.q3 + 1.5 * s.iqr).toFixed(2)} mm</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const container = document.getElementById("boxplot-anatomy-container");
    if (!container) return;

    // Botones de inspección de partes anatómicas
    const partBtns = container.querySelectorAll(".bp-part-btn");
    partBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const part = btn.getAttribute("data-part");
        state.selectedPart = part;
        renderWidget();
      });
    });

    // Clics directos en los elementos vectoriales del SVG
    const svgElements = container.querySelectorAll(".bp-svg-element");
    svgElements.forEach(el => {
      el.addEventListener("click", () => {
        const part = el.getAttribute("data-part");
        state.selectedPart = part;
        renderWidget();
      });
    });

    // Alternador de ruido en la señal
    const btnNoise = document.getElementById("bp-btn-noise");
    const btnClean = document.getElementById("bp-btn-clean");

    if (btnNoise) {
      btnNoise.addEventListener("click", () => {
        state.hasOutlier = true;
        renderWidget();
      });
    }
    if (btnClean) {
      btnClean.addEventListener("click", () => {
        state.hasOutlier = false;
        renderWidget();
      });
    }
  }

  window.initBoxplotWidget = function () {
    renderWidget();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("boxplot-anatomy-container")) {
        window.initBoxplotWidget();
      }
    });
  } else {
    if (document.getElementById("boxplot-anatomy-container")) {
      window.initBoxplotWidget();
    }
  }
})();
