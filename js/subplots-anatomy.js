/**
 * subplots-anatomy.js
 * Componente visual interactivo y esquema de pizarra para la Instanciación de Subplots en Matplotlib (Lección 2.3).
 * 
 * Ilustra didácticamente:
 * 1. La diferencia entre fig (Lienzo contenedor / Figure) y axs (Matriz de coordenadas / Axes).
 * 2. La tupla de desempaquetado devuelta por plt.subplots(nrows, ncols).
 * 3. Cómo se indexan y renderizan las matrices de paneles:
 *    - 1D Stacked (4x1) para el talud de Ancón Norte (axs[0], axs[1], axs[2], axs[3]).
 *    - 2D Grid (2x2) con indexación matricial (axs[0, 0], axs[0, 1], axs[1, 0], axs[1, 1]).
 */

(function () {
  let state = {
    mode: "1d", // '1d' (4x1 Ancón) o '2d' (2x2 General)
    selectedTarget: "all", // 'all', 'fig', 'axs', 'panel-0', 'panel-1', 'panel-2', 'panel-3'
  };

  // Datos sintéticos representativos para trazar curvas en cada panel
  const samplePoints = 25;
  const dummyRain = Array.from({ length: samplePoints }, (_, i) => {
    return i === 5 ? 24 : i === 6 ? 48 : i === 7 ? 18 : i === 16 ? 35 : i === 17 ? 12 : Math.random() > 0.6 ? Math.random() * 8 : 0;
  });
  const dummyMoist = Array.from({ length: samplePoints }, (_, i) => {
    return 48 + Math.sin(i / 3.5) * 12 + (i > 6 ? 6 : 0) + (i > 17 ? 5 : 0);
  });
  const dummyAccelC = Array.from({ length: samplePoints }, (_, i) => {
    return 1.74 + i * 0.003 + (i > 7 ? 0.025 : 0) + Math.sin(i) * 0.004;
  });
  const dummyAccelB = Array.from({ length: samplePoints }, (_, i) => {
    return -0.61 + i * 0.0015 - (i > 7 ? 0.018 : 0) + Math.cos(i) * 0.003;
  });
  const dummyExt = Array.from({ length: samplePoints }, (_, i) => {
    return i < 8 ? 0.2 : i < 15 ? 1.4 + (i - 8) * 0.5 : 5.8 + (i - 15) * 0.8;
  });

  function initWidget() {
    renderWidget();
  }

  function setMode(newMode) {
    state.mode = newMode;
    state.selectedTarget = "all";
    renderWidget();
  }

  function setTarget(newTarget) {
    state.selectedTarget = newTarget;
    renderWidget();
  }

  function getDetails() {
    const is1D = state.mode === "1d";
    const t = state.selectedTarget;

    if (t === "fig") {
      return {
        badge: "Objeto Contenedor Maestro",
        name: "fig (matplotlib.figure.Figure)",
        type: "matplotlib.figure.Figure",
        shape: `figsize = (${is1D ? "8, 10" : "8, 6"}) pulgadas`,
        code: `fig, axs = plt.subplots(${is1D ? "4, 1, figsize=(8, 10), sharex=True" : "2, 2, figsize=(8, 6)"})
# fig es el lienzo de papel global (el marco físico exterior).
fig.suptitle("Monitoreo Ancón Norte", fontsize=14, fontweight="bold")
plt.tight_layout()  # Ajusta márgenes entre paneles
plt.show()`,
        desc: "<strong><code>fig</code> representa el lienzo completo</strong> (la hoja física o ventana). No dibuja curvas directamente, sino que define el tamaño global en pulgadas (<code>figsize</code>), gestiona títulos globales (<code>fig.suptitle</code>), ajusta el espaciado automático entre paneles (<code>plt.tight_layout</code>) y exporta la imagen final al disco (<code>fig.savefig('ancon.png')</code>).",
        highlightColor: "#f59e0b",
      };
    }

    if (t === "axs") {
      return {
        badge: is1D ? "Arreglo Unidimensional de Ejes" : "Matriz Bidimensional de Ejes",
        name: is1D ? "axs (np.ndarray de 4 elementos)" : "axs (np.ndarray de forma 2×2)",
        type: "numpy.ndarray (con instancias AxesSubplot)",
        shape: is1D ? "axs.shape == (4,)" : "axs.shape == (2, 2)",
        code: is1D
          ? `# En 4x1, axs es un vector unidimensional indexado con 1 corchete:
axs[0]  # Eje de Precipitación (p1)
axs[1]  # Eje de Humedad del Suelo (sh1)
axs[2]  # Eje de Acelerómetro (C1)
axs[3]  # Eje de Acelerómetro (B1)

# Podemos iterar sobre todos los paneles con un bucle:
for ax in axs:
    ax.grid(True, linestyle="--", alpha=0.5)`
          : `# En 2x2, axs es una matriz bidimensional indexada con [fila, columna]:
axs[0, 0]  # Fila 0, Columna 0 (Superior Izquierda)
axs[0, 1]  # Fila 0, Columna 1 (Superior Derecha)
axs[1, 0]  # Fila 1, Columna 0 (Inferior Izquierda)
axs[1, 1]  # Fila 1, Columna 1 (Inferior Derecha)`,
        desc: `<strong><code>axs</code> es una estructura de NumPy (<code>ndarray</code>)</strong> que agrupa a todos los sistemas de coordenadas independientes. Cada casilla del arreglo contiene un objeto <code>Axes</code> cartesiano propio. Para dibujar en un sensor en particular, se debe acceder a su posición exacta mediante corchetes.`,
        highlightColor: "#8b5cf6",
      };
    }

    if (t === "panel-0") {
      return {
        badge: is1D ? "Panel 0: Precipitación (Lluvia)" : "Panel [0, 0]: Fila 0, Columna 0",
        name: is1D ? "axs[0] (Axes de Precipitación)" : "axs[0, 0] (Lluvia p1)",
        type: "matplotlib.axes.AxesSubplot",
        shape: is1D ? "Índice: [0]" : "Índice: [0, 0]",
        code: is1D
          ? `axs[0].plot(df_ancon.index, df_ancon['p1'], label='p1', linewidth=0.8, color='royalblue')
axs[0].set_ylabel('Lluvia (mm/día)')
axs[0].legend(loc='upper left')`
          : `axs[0, 0].plot(df_ancon.index, df_ancon['p1'], label='p1', color='royalblue')
axs[0, 0].set_title('Precipitación p1')`,
        desc: "Sistema de coordenadas dedicado exclusivamente a la precipitación. Posee su propia escala vertical (0 a 60 mm). Al usar <code>axs[0].plot(...)</code> evitamos la confusión de <code>plt.plot()</code>, garantizando que los datos de lluvia se tracen exactamente en el panel superior.",
        highlightColor: "#3b82f6",
      };
    }

    if (t === "panel-1") {
      return {
        badge: is1D ? "Panel 1: Humedad del Suelo" : "Panel [0, 1]: Fila 0, Columna 1",
        name: is1D ? "axs[1] (Axes de Humedad)" : "axs[0, 1] (Humedad sh1)",
        type: "matplotlib.axes.AxesSubplot",
        shape: is1D ? "Índice: [1]" : "Índice: [0, 1]",
        code: is1D
          ? `axs[1].plot(df_ancon.index, df_ancon['sh1'], label='sh1', linewidth=0.8, color='crimson')
axs[1].set_ylabel('Humedad (%)')
axs[1].legend(loc='upper left')`
          : `axs[0, 1].plot(df_ancon.index, df_ancon['sh1'], label='sh1', color='crimson')
axs[0, 1].set_title('Humedad sh1')`,
        desc: "Sistema de coordenadas dedicado al contenido de humedad volumétrica. Su escala vertical autónoma (40% a 70%) no se ve aplastada por los milímetros de lluvia porque habita en su propio panel cartesiano.",
        highlightColor: "#ef4444",
      };
    }

    if (t === "panel-2") {
      return {
        badge: is1D ? "Panel 2: Acelerómetro Canal C1" : "Panel [1, 0]: Fila 1, Columna 0",
        name: is1D ? "axs[2] (Axes de Aceleración C1)" : "axs[1, 0] (Aceleración C1)",
        type: "matplotlib.axes.AxesSubplot",
        shape: is1D ? "Índice: [2]" : "Índice: [1, 0]",
        code: is1D
          ? `axs[2].plot(df_ancon.index, df_ancon['C1'], label='C1', linewidth=0.8, color='#0284c7')
axs[2].set_ylabel('Inclinación C1 (°)')
axs[2].legend(loc='upper left')`
          : `axs[1, 0].plot(df_ancon.index, df_ancon['C1'], label='C1', color='#0284c7')
axs[1, 0].set_title('Acelerómetro C1')`,
        desc: "Panel independiente para el canal de aceleración/inclinación C1. Registra sutiles variaciones angulares (1.74° a 1.78°), permitiendo diagnosticar respuestas cinemáticas del talud frente al incremento de agua en el suelo.",
        highlightColor: "#0284c7",
      };
    }

    if (t === "panel-3") {
      return {
        badge: is1D ? "Panel 3: Acelerómetro Canal B1" : "Panel [1, 1]: Fila 1, Columna 1",
        name: is1D ? "axs[3] (Axes de Aceleración B1)" : "axs[1, 1] (Extensómetro DE1)",
        type: "matplotlib.axes.AxesSubplot",
        shape: is1D ? "Índice: [3]" : "Índice: [1, 1]",
        code: is1D
          ? `axs[3].plot(df_ancon.index, df_ancon['B1'], label='B1', linewidth=0.8, color='#d97706')
axs[3].set_ylabel('Inclinación B1 (°)')
axs[3].set_xlabel('Fecha')  # Al usar sharex=True, solo el último panel muestra fechas
axs[3].legend(loc='upper left')`
          : `axs[1, 1].plot(df_ancon.index, df_ancon['DE1'], label='DE1', color='#10b981')
axs[1, 1].set_title('Extensómetro DE1')`,
        desc: is1D
          ? "El panel inferior del apilado. <strong>Al configurar <code>sharex=True</code></strong>, Matplotlib oculta automáticamente los números de fecha en los paneles superiores (axs[0], axs[1], axs[2]) y solo los dibuja en este panel inferior (axs[3]), manteniendo una lectura temporal impecable y sin saturación."
          : "Panel de la esquina inferior derecha para la apertura de grieta (DE1). Demuestra cómo una matriz 2D distribuye cuatro instrumentos en cuadrícula.",
        highlightColor: is1D ? "#d97706" : "#10b981",
      };
    }

    // Default 'all'
    return {
      badge: "Arquitectura Completa Ensamblada",
      name: `fig, axs = plt.subplots(${is1D ? "4, 1, figsize=(8, 10), sharex=True" : "2, 2, figsize=(8, 6)"})`,
      type: `Tupla de 2 elementos: (Figure, np.ndarray)`,
      shape: is1D ? "Lienzo 8x10 plg con 4 filas apiladas" : "Lienzo 8x6 plg con 2 filas × 2 columnas",
      code: is1D
        ? `# Desempaquetado estándar de Python:
fig, axs = plt.subplots(4, 1, figsize=(8, 10), sharex=True)

# 1. fig: El lienzo maestro (marco exterior)
# 2. axs: Arreglo unidimensional [axs[0], axs[1], axs[2], axs[3]]
axs[0].plot(df.index, df['p1'], label='p1')
axs[1].plot(df.index, df['sh1'], label='sh1')
axs[2].plot(df.index, df['C1'], label='C1')
axs[3].plot(df.index, df['B1'], label='B1')`
        : `# Desempaquetado de matriz 2D:
fig, axs = plt.subplots(2, 2, figsize=(8, 6))

# axs es bidimensional: axs[fila, columna]
axs[0, 0].plot(df.index, df['p1'])
axs[0, 1].plot(df.index, df['sh1'])
axs[1, 0].plot(df.index, df['C1'])
axs[1, 1].plot(df.index, df['DE1'])`,
      desc: `La función <code>plt.subplots()</code> retorna siempre una <strong>tupla de dos elementos</strong>: a la izquierda, <code>fig</code> (el lienzo maestro global de papel); a la derecha, <code>axs</code> (la matriz NumPy que contiene cada panel cartesiano independiente). Haz clic en los botones o directamente sobre el diagrama para explorar cada objeto en detalle.`,
      highlightColor: "#6366f1",
    };
  }

  function renderSVG() {
    const is1D = state.mode === "1d";
    const t = state.selectedTarget;

    const svgW = 860;
    const svgH = is1D ? 520 : 460;

    // Colores de realce
    const isFigActive = t === "fig" || t === "all";
    const isAxsActive = t === "axs" || t === "all";

    if (is1D) {
      // 4 paneles verticales
      const panelH = 78;
      const gap = 18;
      const startY = 68;
      const panelW = 680;
      const startX = 110;

      const panels = [
        { id: "panel-0", label: "axs[0]", sensor: "🌧️ Lluvia (p1)", data: dummyRain, color: "#3b82f6", unit: "mm" },
        { id: "panel-1", label: "axs[1]", sensor: "💧 Humedad (sh1)", data: dummyMoist, color: "#ef4444", unit: "%" },
        { id: "panel-2", label: "axs[2]", sensor: "📐 Acel. Canal C1", data: dummyAccelC, color: "#0284c7", unit: "°" },
        { id: "panel-3", label: "axs[3]", sensor: "📐 Acel. Canal B1", data: dummyAccelB, color: "#d97706", unit: "°" },
      ];

      return `
        <svg viewBox="0 0 ${svgW} ${svgH}" class="subplots-svg" style="width: 100%; height: auto; display: block; border-radius: 8px;">
          <defs>
            <linearGradient id="figGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="var(--bg-card)" stop-opacity="0.9" />
              <stop offset="100%" stop-color="var(--bg-surface)" stop-opacity="0.95" />
            </linearGradient>
            <filter id="glow-gold" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f59e0b" flood-opacity="0.6"/>
            </filter>
            <filter id="glow-purple" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#8b5cf6" flood-opacity="0.6"/>
            </filter>
            <filter id="glow-blue" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#3b82f6" flood-opacity="0.7"/>
            </filter>
          </defs>

          <!-- 1. MARCO FIG (FIGURE) -->
          <g class="svg-clickable-target" data-target="fig" style="cursor: pointer;">
            <!-- Fondo de la Figura -->
            <rect x="35" y="24" width="790" height="472" rx="12"
              fill="url(#figGrad)"
              stroke="${t === 'fig' ? '#f59e0b' : 'var(--border-card)'}"
              stroke-width="${t === 'fig' ? '3' : '1.5'}"
              stroke-dasharray="${t === 'fig' ? 'none' : 'none'}"
              filter="${t === 'fig' ? 'url(#glow-gold)' : 'none'}"
            />
            
            <!-- Etiqueta del Objeto Figure -->
            <rect x="50" y="12" width="220" height="24" rx="12" fill="${t === 'fig' ? '#f59e0b' : 'var(--bg-card)'}" stroke="${t === 'fig' ? '#b45309' : 'var(--border-subtle)'}" stroke-width="1.2"/>
            <text x="160" y="28" text-anchor="middle" font-size="11" font-weight="700" fill="${t === 'fig' ? '#ffffff' : 'var(--accent-amber)'}" font-family="var(--font-mono)">
              🖼️ fig = Figure(figsize=(8, 10))
            </text>

            <!-- Regla de Dimensión Física en Pulgadas -->
            <text x="735" y="28" text-anchor="end" font-size="10" font-weight="600" fill="var(--text-muted)">
              Ancho: 8 plg &bull; Alto: 10 plg
            </text>
          </g>

          <!-- 2. ENVOLTORIO AXS (NDARRAY) -->
          <g class="svg-clickable-target" data-target="axs" style="cursor: pointer;">
            <rect x="75" y="52" width="730" height="428" rx="8"
              fill="none"
              stroke="${t === 'axs' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.25)'}"
              stroke-width="${t === 'axs' ? '2.5' : '1'}"
              stroke-dasharray="6,4"
              filter="${t === 'axs' ? 'url(#glow-purple)' : 'none'}"
            />
            <!-- Tag de axs -->
            <rect x="680" y="44" width="118" height="18" rx="4" fill="${t === 'axs' ? '#8b5cf6' : 'var(--bg-surface)'}" stroke="var(--border-subtle)" stroke-width="1"/>
            <text x="739" y="57" text-anchor="middle" font-size="9.5" font-weight="700" fill="${t === 'axs' ? '#ffffff' : 'var(--accent-purple, #a855f7)'}" font-family="var(--font-mono)">
              📦 axs: ndarray(4,)
            </text>
          </g>

          <!-- 3. LOS 4 PANELES APILADOS -->
          ${panels.map((p, idx) => {
            const py = startY + idx * (panelH + gap);
            const isSelected = t === p.id;
            const isDimmed = t !== "all" && t !== "axs" && !isSelected;

            // Generar polyline de la curva
            const minV = Math.min(...p.data);
            const maxV = Math.max(...p.data);
            const range = maxV - minV || 1;
            const pts = p.data.map((val, i) => {
              const px = startX + 55 + (i / (p.data.length - 1)) * (panelW - 75);
              const normalized = (val - minV) / range;
              const pty = py + panelH - 12 - normalized * (panelH - 24);
              return `${px.toFixed(1)},${pty.toFixed(1)}`;
            }).join(" ");

            return `
              <g class="svg-clickable-target" data-target="${p.id}" style="cursor: pointer; opacity: ${isDimmed ? 0.35 : 1}; transition: all 0.2s ease;">
                <!-- Fondo del Subplot -->
                <rect x="${startX}" y="${py}" width="${panelW}" height="${panelH}" rx="6"
                  fill="var(--bg-surface)"
                  stroke="${isSelected ? p.color : 'var(--border-subtle)'}"
                  stroke-width="${isSelected ? '2.5' : '1'}"
                  filter="${isSelected ? 'url(#glow-blue)' : 'none'}"
                />

                <!-- Insignia del Índice de Python (axs[i]) -->
                <rect x="${startX - 65}" y="${py + 18}" width="55" height="24" rx="4"
                  fill="${isSelected ? p.color : 'var(--bg-card)'}"
                  stroke="${isSelected ? p.color : 'var(--border-subtle)'}"
                  stroke-width="1.2"
                />
                <text x="${startX - 38}" y="${py + 34}" text-anchor="middle" font-size="11" font-weight="700" fill="${isSelected ? '#ffffff' : p.color}" font-family="var(--font-mono)">
                  ${p.label}
                </text>

                <!-- Flecha conectora desde el índice hacia el panel -->
                <line x1="${startX - 10}" y1="${py + 30}" x2="${startX - 2}" y2="${py + 30}" stroke="${isSelected ? p.color : 'var(--border-subtle)'}" stroke-width="1.5"/>

                <!-- Ejes cartesianos del panel -->
                <!-- Eje Y -->
                <line x1="${startX + 45}" y1="${py + 10}" x2="${startX + 45}" y2="${py + panelH - 10}" stroke="var(--border-subtle)" stroke-width="1"/>
                <!-- Eje X -->
                <line x1="${startX + 45}" y1="${py + panelH - 10}" x2="${startX + panelW - 15}" y2="${py + panelH - 10}" stroke="var(--border-subtle)" stroke-width="1"/>

                <!-- Título/Sensor del panel -->
                <text x="${startX + 55}" y="${py + 18}" font-size="10.5" font-weight="700" fill="var(--text-main)">
                  ${p.sensor}
                </text>

                <!-- Cuadrícula técnica sutil -->
                <line x1="${startX + 45}" y1="${py + 38}" x2="${startX + panelW - 15}" y2="${py + 38}" stroke="var(--border-subtle)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.6"/>
                <line x1="${startX + 45}" y1="${py + 58}" x2="${startX + panelW - 15}" y2="${py + 58}" stroke="var(--border-subtle)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.6"/>

                <!-- Curva de datos del sensor -->
                <polyline points="${pts}" fill="none" stroke="${p.color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>

                <!-- Ticks y etiquetas -->
                <text x="${startX + 38}" y="${py + 18}" text-anchor="end" font-size="8.5" fill="var(--text-muted)" font-family="var(--font-mono)">${maxV.toFixed(0)}</text>
                <text x="${startX + 38}" y="${py + panelH - 10}" text-anchor="end" font-size="8.5" fill="var(--text-muted)" font-family="var(--font-mono)">${minV.toFixed(0)}</text>

                <!-- Indicador de Sincronización Temporal (sharex) -->
                ${idx < 3 ? `
                  <text x="${startX + panelW - 20}" y="${py + panelH - 14}" text-anchor="end" font-size="8.5" fill="var(--text-muted)" font-style="italic">
                    Fechas ocultadas (sharex)
                  </text>
                ` : `
                  <!-- Panel 3 (inferior) muestra las fechas sincronizadas -->
                  <text x="${startX + 55}" y="${py + panelH + 1}" font-size="8.5" fill="var(--accent-emerald)" font-weight="600" font-family="var(--font-mono)">2020-03</text>
                  <text x="${startX + (panelW/2) - 10}" y="${py + panelH + 1}" font-size="8.5" fill="var(--accent-emerald)" font-weight="600" font-family="var(--font-mono)">2020-09</text>
                  <text x="${startX + panelW - 40}" y="${py + panelH + 1}" font-size="8.5" fill="var(--accent-emerald)" font-weight="600" font-family="var(--font-mono)">2021-03</text>
                  <text x="${startX + panelW - 15}" y="${py + 20}" text-anchor="end" font-size="9" fill="var(--accent-emerald)" font-weight="700">
                    🔗 Eje X común activo
                  </text>
                `}
              </g>
            `;
          }).join("")}

          <!-- Marcador de sincronización vertical (Línea punteada que cruza los 4 subplots) -->
          <line x1="${startX + 220}" y1="${startY + 8}" x2="${startX + 220}" y2="${startY + 4 * (panelH + gap) - gap - 10}" stroke="var(--accent-emerald)" stroke-width="1.2" stroke-dasharray="4,3" opacity="${t === 'panel-3' || t === 'all' ? '0.75' : '0.2'}"/>
          <text x="${startX + 225}" y="${startY + 20}" font-size="8" fill="var(--accent-emerald)" font-weight="600" opacity="${t === 'panel-3' || t === 'all' ? '0.9' : '0'}">
            Sincronía temporal vertical
          </text>
        </svg>
      `;
    } else {
      // Modo 2D Grid: 2 filas x 2 columnas
      const gridW = 345;
      const gridH = 175;
      const gapX = 25;
      const gapY = 25;
      const startX = 85;
      const startY = 70;

      const gridPanels = [
        { id: "panel-0", row: 0, col: 0, label: "axs[0, 0]", sensor: "🌧️ Precipitación (p1)", data: dummyRain, color: "#3b82f6" },
        { id: "panel-1", row: 0, col: 1, label: "axs[0, 1]", sensor: "💧 Humedad (sh1)", data: dummyMoist, color: "#ef4444" },
        { id: "panel-2", row: 1, col: 0, label: "axs[1, 0]", sensor: "📐 Acelerómetro (C1)", data: dummyAccelC, color: "#0284c7" },
        { id: "panel-3", row: 1, col: 1, label: "axs[1, 1]", sensor: "📏 Extensómetro (DE1)", data: dummyExt, color: "#10b981" },
      ];

      return `
        <svg viewBox="0 0 ${svgW} ${svgH}" class="subplots-svg" style="width: 100%; height: auto; display: block; border-radius: 8px;">
          <defs>
            <linearGradient id="figGrad2D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="var(--bg-card)" stop-opacity="0.9" />
              <stop offset="100%" stop-color="var(--bg-surface)" stop-opacity="0.95" />
            </linearGradient>
            <filter id="glow-gold2" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f59e0b" flood-opacity="0.6"/>
            </filter>
            <filter id="glow-purple2" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#8b5cf6" flood-opacity="0.6"/>
            </filter>
          </defs>

          <!-- 1. MARCO FIG -->
          <g class="svg-clickable-target" data-target="fig" style="cursor: pointer;">
            <rect x="35" y="24" width="790" height="415" rx="12"
              fill="url(#figGrad2D)"
              stroke="${t === 'fig' ? '#f59e0b' : 'var(--border-card)'}"
              stroke-width="${t === 'fig' ? '3' : '1.5'}"
              filter="${t === 'fig' ? 'url(#glow-gold2)' : 'none'}"
            />
            <rect x="50" y="12" width="220" height="24" rx="12" fill="${t === 'fig' ? '#f59e0b' : 'var(--bg-card)'}" stroke="${t === 'fig' ? '#b45309' : 'var(--border-subtle)'}" stroke-width="1.2"/>
            <text x="160" y="28" text-anchor="middle" font-size="11" font-weight="700" fill="${t === 'fig' ? '#ffffff' : 'var(--accent-amber)'}" font-family="var(--font-mono)">
              🖼️ fig = Figure(figsize=(8, 6))
            </text>
            <text x="735" y="28" text-anchor="end" font-size="10" font-weight="600" fill="var(--text-muted)">
              Ancho: 8 plg &bull; Alto: 6 plg
            </text>
          </g>

          <!-- 2. ENVOLTORIO AXS MATRIZ 2D -->
          <g class="svg-clickable-target" data-target="axs" style="cursor: pointer;">
            <rect x="65" y="52" width="740" height="375" rx="8"
              fill="none"
              stroke="${t === 'axs' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.25)'}"
              stroke-width="${t === 'axs' ? '2.5' : '1'}"
              stroke-dasharray="6,4"
              filter="${t === 'axs' ? 'url(#glow-purple2)' : 'none'}"
            />
            <rect x="670" y="44" width="130" height="18" rx="4" fill="${t === 'axs' ? '#8b5cf6' : 'var(--bg-surface)'}" stroke="var(--border-subtle)" stroke-width="1"/>
            <text x="735" y="57" text-anchor="middle" font-size="9.5" font-weight="700" fill="${t === 'axs' ? '#ffffff' : 'var(--accent-purple, #a855f7)'}" font-family="var(--font-mono)">
              📦 axs: ndarray(2, 2)
            </text>
          </g>

          <!-- 3. LOS 4 PANELES DE LA MATRIZ 2D -->
          ${gridPanels.map((p) => {
            const px = startX + p.col * (gridW + gapX);
            const py = startY + p.row * (gridH + gapY);
            const isSelected = t === p.id;
            const isDimmed = t !== "all" && t !== "axs" && !isSelected;

            const minV = Math.min(...p.data);
            const maxV = Math.max(...p.data);
            const range = maxV - minV || 1;
            const pts = p.data.map((val, i) => {
              const ptX = px + 40 + (i / (p.data.length - 1)) * (gridW - 55);
              const normalized = (val - minV) / range;
              const ptY = py + gridH - 22 - normalized * (gridH - 52);
              return `${ptX.toFixed(1)},${ptY.toFixed(1)}`;
            }).join(" ");

            return `
              <g class="svg-clickable-target" data-target="${p.id}" style="cursor: pointer; opacity: ${isDimmed ? 0.35 : 1}; transition: all 0.2s ease;">
                <rect x="${px}" y="${py}" width="${gridW}" height="${gridH}" rx="6"
                  fill="var(--bg-surface)"
                  stroke="${isSelected ? p.color : 'var(--border-subtle)'}"
                  stroke-width="${isSelected ? '2.5' : '1'}"
                />

                <!-- Insignia del Índice [fila, columna] -->
                <rect x="${px + 10}" y="${py + 10}" width="75" height="22" rx="4"
                  fill="${isSelected ? p.color : 'var(--bg-card)'}"
                  stroke="${isSelected ? p.color : 'var(--border-subtle)'}"
                  stroke-width="1"
                />
                <text x="${px + 47}" y="${py + 25}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${isSelected ? '#ffffff' : p.color}" font-family="var(--font-mono)">
                  ${p.label}
                </text>

                <!-- Título del sensor -->
                <text x="${px + 95}" y="${py + 25}" font-size="10.5" font-weight="700" fill="var(--text-main)">
                  ${p.sensor}
                </text>

                <!-- Ejes cartesianos -->
                <line x1="${px + 35}" y1="${py + 40}" x2="${px + 35}" y2="${py + gridH - 18}" stroke="var(--border-subtle)" stroke-width="1"/>
                <line x1="${px + 35}" y1="${py + gridH - 18}" x2="${px + gridW - 12}" y2="${py + gridH - 18}" stroke="var(--border-subtle)" stroke-width="1"/>

                <!-- Curva -->
                <polyline points="${pts}" fill="none" stroke="${p.color}" stroke-width="1.8" stroke-linecap="round"/>

                <!-- Nota de indexación -->
                <text x="${px + gridW - 14}" y="${py + gridH - 6}" text-anchor="end" font-size="8" fill="var(--text-muted)">
                  Fila ${p.row}, Col ${p.col}
                </text>
              </g>
            `;
          }).join("")}
        </svg>
      `;
    }
  }

  function renderWidget() {
    const container = document.getElementById("subplots-anatomy-container");
    if (!container) return;

    const is1D = state.mode === "1d";
    const t = state.selectedTarget;
    const details = getDetails();

    container.innerHTML = `
      <style>
        .sa-card {
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
        [data-theme="light"] .sa-card {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }
        .sa-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sa-mode-pills {
          display: flex;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 3px;
          gap: 4px;
        }
        [data-theme="light"] .sa-mode-pills {
          background: #f1f5f9;
        }
        .sa-mode-btn {
          padding: 0.4rem 0.85rem;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sa-mode-btn.active {
          background: var(--bg-card);
          color: var(--accent-primary);
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        [data-theme="light"] .sa-mode-btn.active {
          background: #ffffff;
          color: #4f46e5;
        }
        .sa-inspect-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }
        .sa-target-btn {
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 600;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sa-target-btn:hover {
          border-color: var(--accent-primary);
          color: var(--text-main);
        }
        .sa-target-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
        }
        .sa-canvas-wrap {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          overflow: hidden;
        }
        [data-theme="light"] .sa-canvas-wrap {
          background: #f8fafc;
        }
        .sa-details-box {
          display: grid;
          grid-template-columns: 1.25fr 0.95fr;
          gap: 1rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-left: 4px solid ${details.highlightColor};
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        @media (max-width: 860px) {
          .sa-details-box {
            grid-template-columns: 1fr;
          }
        }
        .sa-diff-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
        .sa-diff-table th {
          background: var(--bg-card);
          padding: 0.45rem 0.6rem;
          text-align: left;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-main);
          font-weight: 700;
        }
        .sa-diff-table td {
          padding: 0.45rem 0.6rem;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-muted);
        }
      </style>

      <div class="sa-card">
        <!-- Encabezado con Switch de Casos -->
        <div class="sa-toolbar">
          <div>
            <span class="flow-badge">Módulo 2 &bull; Lección 2.3 &bull; Pizarra Conceptual &amp; Arquitectura de Subplots</span>
            <h4 class="flow-title" style="margin-top: 2px;">
              📊 Instanciación de Paneles: Desempaquetado de <code>fig</code> y <code>axs</code>
            </h4>
          </div>

          <div class="sa-mode-pills">
            <button class="sa-mode-btn ${is1D ? 'active' : ''}" id="sa-mode-1d-btn">
              📐 Ancón Norte: 4 × 1 (1D)
            </button>
            <button class="sa-mode-btn ${!is1D ? 'active' : ''}" id="sa-mode-2d-btn">
              🔲 Matriz General: 2 × 2 (2D)
            </button>
          </div>
        </div>

        <p style="margin: 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.55;">
          Al ejecutar <code>fig, axs = plt.subplots(nrows, ncols)</code>, Python desempaqueta dos entidades con roles totalmente distintos: 
          <strong><code>fig</code></strong> (el lienzo de papel maestro) y <strong><code>axs</code></strong> (el arreglo de sistemas de coordenadas cartesianas). 
          Haz clic en los controles o en cualquier elemento del dibujo para inspeccionar su comportamiento:
        </p>

        <!-- Barra de Botones de Inspección Interactiva -->
        <div class="sa-inspect-bar">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
            🔍 Inspeccionar:
          </span>
          <button class="sa-target-btn ${t === 'all' ? 'active' : ''}" data-target="all">
            🔘 Ver Todo
          </button>
          <button class="sa-target-btn ${t === 'fig' ? 'active' : ''}" data-target="fig" style="${t === 'fig' ? 'background: #f59e0b; border-color: #f59e0b;' : ''}">
            🖼️ fig (Lienzo Global)
          </button>
          <button class="sa-target-btn ${t === 'axs' ? 'active' : ''}" data-target="axs" style="${t === 'axs' ? 'background: #8b5cf6; border-color: #8b5cf6;' : ''}">
            📦 axs (Arreglo ndarray)
          </button>
          <button class="sa-target-btn ${t === 'panel-0' ? 'active' : ''}" data-target="panel-0">
            ${is1D ? 'axs[0] (p1)' : 'axs[0, 0] (p1)'}
          </button>
          <button class="sa-target-btn ${t === 'panel-1' ? 'active' : ''}" data-target="panel-1">
            ${is1D ? 'axs[1] (sh1)' : 'axs[0, 1] (sh1)'}
          </button>
          <button class="sa-target-btn ${t === 'panel-2' ? 'active' : ''}" data-target="panel-2">
            ${is1D ? 'axs[2] (C1)' : 'axs[1, 0] (C1)'}
          </button>
          <button class="sa-target-btn ${t === 'panel-3' ? 'active' : ''}" data-target="panel-3">
            ${is1D ? 'axs[3] (B1)' : 'axs[1, 1] (DE1)'}
          </button>
        </div>

        <!-- Render SVG del Esquema de Paneles -->
        <div class="sa-canvas-wrap">
          ${renderSVG()}
        </div>

        <!-- Panel de Diagnóstico & Código de la Selección -->
        <div class="sa-details-box">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.4rem;">
              <span style="font-size: 0.72rem; font-weight: 700; color: ${details.highlightColor}; text-transform: uppercase;">
                ${details.badge}
              </span>
              <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-card); padding: 2px 6px; border-radius: 4px;">
                ${details.shape}
              </span>
            </div>

            <h5 style="margin: 0 0 0.4rem 0; font-size: 1rem; color: var(--text-main);">
              ${details.name}
            </h5>

            <p style="margin: 0 0 0.6rem 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.55;">
              ${details.desc}
            </p>

            <div style="font-size: 0.78rem; color: var(--text-muted);">
              <strong>Tipo de Objeto Python:</strong> <code>${details.type}</code>
            </div>
          </div>

          <div>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
              💻 Sintaxis Python Asociada:
            </span>
            <pre style="margin: 0.35rem 0 0 0; padding: 0.75rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.77rem; font-family: var(--font-mono); color: var(--text-main); overflow-x: auto; line-height: 1.45;"><code>${details.code}</code></pre>
          </div>
        </div>

        <!-- Tabla Resumen Didáctica: fig vs axs -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem;">
          <strong style="font-size: 0.84rem; color: var(--text-main);">
            ⚡ Cuadro Comparativo Esencial: ¿Cuándo usar <code>fig</code> y cuándo usar <code>axs</code>?
          </strong>
          <table class="sa-diff-table">
            <thead>
              <tr>
                <th style="width: 20%;">Concepto</th>
                <th style="width: 40%; color: #f59e0b;">Lienzo Maestro: <code>fig</code></th>
                <th style="width: 40%; color: #8b5cf6;">Paneles de Coordenadas: <code>axs</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Naturaleza</strong></td>
                <td>Marco contenedor exterior (la hoja física de dibujo).</td>
                <td>Arreglo NumPy (<code>ndarray</code>) de sistemas de coordenadas.</td>
              </tr>
              <tr>
                <td><strong>Indexación</strong></td>
                <td>No se indexa. Es una única instancia global.</td>
                <td><strong>1D:</strong> <code>axs[i]</code> &bull; <strong>2D:</strong> <code>axs[fila, columna]</code></td>
              </tr>
              <tr>
                <td><strong>Responsabilidad</strong></td>
                <td>Tamaño físico (<code>figsize</code>), título global (<code>suptitle</code>), exportación (<code>savefig</code>), espaciado (<code>tight_layout</code>).</td>
                <td>Trazado de curvas (<code>.plot()</code>), rotulación de ejes (<code>.set_ylabel()</code>), leyendas (<code>.legend()</code>), límites (<code>.set_ylim()</code>).</td>
              </tr>
              <tr>
                <td><strong>En Ancón Norte</strong></td>
                <td>Alberga los 4 canales sincronizados en 8 × 10 pulgadas.</td>
                <td><code>axs[0]</code> es lluvia, <code>axs[1]</code> es humedad, <code>axs[2]</code> es aceleración C1, <code>axs[3]</code> es aceleración B1.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Event Listeners
    const btn1D = document.getElementById("sa-mode-1d-btn");
    const btn2D = document.getElementById("sa-mode-2d-btn");

    if (btn1D) btn1D.onclick = () => setMode("1d");
    if (btn2D) btn2D.onclick = () => setMode("2d");

    // Botones de target
    container.querySelectorAll(".sa-target-btn").forEach((btn) => {
      btn.onclick = () => {
        const target = btn.getAttribute("data-target");
        if (target) setTarget(target);
      };
    });

    // Clicks directos en el SVG
    container.querySelectorAll(".svg-clickable-target").forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const target = el.getAttribute("data-target");
        if (target) setTarget(target);
      };
    });
  }

  // Exportar globalmente
  window.initSubplotsAnatomyWidget = initWidget;

  // Auto-inicializar si el contenedor existe
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("subplots-anatomy-container")) {
        initWidget();
      }
    });
  } else {
    if (document.getElementById("subplots-anatomy-container")) {
      initWidget();
    }
  }
})();
