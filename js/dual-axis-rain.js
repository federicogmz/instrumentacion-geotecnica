/**
 * dual-axis-rain.js
 * Componente visual interactivo y esquema de pizarra para Procesos Acoplados en Geotecnia:
 * Doble Eje Y con Lluvia Invertida (twinx + invert_yaxis) - Lección 2.4.
 * 
 * Integra:
 * 1. Esquema conceptual de pizarra: El perfil físico Ladera-Atmósfera (Cielo ☁️, Infiltración ▼, Suelo ⛰️).
 * 2. Simulador dinámico con SVG: Trazado simultáneo de Precipitación (p1 en royalblue) y Humedad del suelo (sh1 en crimson).
 * 3. Inspección interactiva de cada parte: fig, ax1, ax2 y el mecanismo de ax1.invert_yaxis().
 * 4. Comparador en vivo: Demostración de colisión visual sin inversión vs. claridad física con inversión.
 */

(function () {
  let state = {
    isInverted: true,
    selectedTarget: "all", // 'all', 'fig', 'ax1', 'ax2', 'invert'
  };

  // Serie sintética representativa de Ancón Norte durante una semana de tormentas
  const days = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12"];
  const rainData = [0.0, 4.2, 28.5, 52.0, 14.8, 2.0, 0.0, 18.4, 38.0, 8.5, 1.2, 0.0];      // Lluvia p1 en mm/día
  const moistData = [48.2, 48.6, 52.4, 61.8, 65.2, 64.0, 61.5, 62.8, 66.4, 65.8, 62.0, 58.5]; // Humedad sh1 en %

  function initWidget() {
    renderWidget();
  }

  function setTarget(newTarget) {
    state.selectedTarget = newTarget;
    renderWidget();
  }

  function toggleInvert() {
    state.isInverted = !state.isInverted;
    renderWidget();
  }

  function getDetails() {
    const t = state.selectedTarget;
    const inv = state.isInverted;

    if (t === "fig") {
      return {
        badge: "Marco Global Panorámico",
        name: "fig (matplotlib.figure.Figure)",
        type: "matplotlib.figure.Figure",
        shape: "figsize=(12, 4) &bull; Proporción Panorámica 3:1",
        code: `fig, ax1 = plt.subplots(figsize=(12, 4), sharex=True)
# Lienzo panorámico extendido horizontalmente para permitir
# una lectura clara de las tormentas diarias a lo largo del tiempo.
plt.show()`,
        desc: "<strong><code>fig</code> es el lienzo maestro de papel.</strong> Al configurar <code>figsize=(12, 4)</code>, creamos un marco panorámico horizontal con proporción 3:1. Esto es vital en hidrogeología para que las fluctuaciones diarias de precipitación y humedad no se compriman en el eje del tiempo, facilitando la identificación de retrasos entre la lluvia y la saturación del talud.",
        highlightColor: "#f59e0b",
      };
    }

    if (t === "ax1") {
      return {
        badge: "Eje Primario (Margen Izquierdo - Atmósfera)",
        name: "ax1 (Eje de Precipitación p1)",
        type: "matplotlib.axes.AxesSubplot",
        shape: "Escala Y Izquierda: 0 a 60 mm &bull; Color: 'royalblue'",
        code: `ax1.plot(df_ancon.index, df_ancon['p1'], label='p1', linewidth=0.8, color='royalblue')
ax1.set_ylabel('Precipitación', color='royalblue')
ax1.invert_yaxis()  # Ancla el cero en el techo`,
        desc: "<strong><code>ax1</code> controla la condición de frontera atmosférica (la lluvia).</strong> Habita en el margen izquierdo de la figura. Para mantener coherencia visual absoluta, se sincroniza el color del trazo con el color de la etiqueta rotulada mediante <code>color='royalblue'</code>. Al aplicar <code>ax1.invert_yaxis()</code>, el cero se ancla en el techo superior y las lluvias crecen hacia abajo.",
        highlightColor: "#2563eb",
      };
    }

    if (t === "ax2") {
      return {
        badge: "Eje Gemelo Secundario (Margen Derecho - Subsuelo)",
        name: "ax2 = ax1.twinx() (Eje de Humedad sh1)",
        type: "matplotlib.axes.AxesSubplot (Clonado con twinx)",
        shape: "Escala Y Derecha: 40% a 70% &bull; Color: 'crimson'",
        code: `ax2 = ax1.twinx()  # Clona el eje X horizontal en el margen derecho
ax2.plot(df_ancon.index, df_ancon['sh1'], label='sh1', linewidth=0.8, color='crimson')
ax2.set_ylabel('Humedad', color='crimson')`,
        desc: "<strong><code>ax2</code> representa la respuesta física del subsuelo (humedad volumétrica).</strong> Se crea invocando <code>ax1.twinx()</code>, lo que clona exactamente el eje X de fechas pero abre un sistema de coordenadas vertical independiente en el margen derecho. Esto permite graficar una variable que oscila entre 40% y 70% sin que quede aplastada por la escala de 0 a 60 mm de la lluvia.",
        highlightColor: "#dc2626",
      };
    }

    if (t === "invert") {
      return {
        badge: "Mecanismo Hidrogeológico de Inversión",
        name: "ax1.invert_yaxis() (Lluvia Invertida)",
        type: "Método de instancia de Axes",
        shape: inv ? "Estado: ACTIVO (0 mm en el techo)" : "Estado: DESACTIVADO (Eje normal)",
        code: inv
          ? `ax1.invert_yaxis()
# Resultado: El techo es Y=0 mm; los picos de tormenta descienden hacia abajo.
# La curva de humedad sube libremente desde el piso sin colisión visual.`
          : `# Sin inversión:
# ax1.invert_yaxis()  <- OMITIDO
# Problema: Tanto la lluvia como la humedad crecen desde el piso (Y=0),
# provocando que las barras azules tapen la curva roja.`,
        desc: "<strong><code>ax1.invert_yaxis()</code> invierte la dirección matemática del eje vertical.</strong> En lugar de que el cero esté en la base, se coloca en el techo de la figura. Los aguaceros descienden físicamente 'desde el cielo', mientras que la humedad del suelo sube libremente desde la base. Es la convención gráfica por excelencia en estabilidad de taludes e hidrogeología para desacoplar procesos acoplados.",
        highlightColor: "#0284c7",
      };
    }

    // Default 'all'
    return {
      badge: "Arquitectura Completa del Proceso Acoplado",
      name: "fig, ax1 + ax2 = ax1.twinx() + ax1.invert_yaxis()",
      type: "Doble Eje Cartesiano Sincronizado",
      shape: `Precipitación: 0-60 mm (Izq) &bull; Humedad: 40-70% (Der) &bull; Inversión: ${inv ? "ACTIVA" : "INACTIVA"}`,
      code: `# Código completo de la Lección 2.4:
fig, ax1 = plt.subplots(figsize=(12, 4), sharex=True)

# 1. Eje Primario: Precipitación en royalblue con eje invertido
ax1.plot(df_ancon.index, df_ancon['p1'], label='p1', linewidth=0.8, color='royalblue')
ax1.set_ylabel('Precipitación', color='royalblue')
${inv ? "ax1.invert_yaxis()  # Tormentas caen desde arriba" : "# ax1.invert_yaxis()  (Eje normal)"}

# 2. Eje Gemelo: Humedad en crimson
ax2 = ax1.twinx()
ax2.plot(df_ancon.index, df_ancon['sh1'], label='sh1', linewidth=0.8, color='crimson')
ax2.set_ylabel('Humedad', color='crimson')

plt.show()`,
      desc: "Este sistema acoplado resuelve el desafío de superponer <strong>causa (lluvia atmosférica)</strong> y <strong>efecto (infiltración y saturación del suelo)</strong> en una misma ventana temporal. Haz clic en los botones de inspección o directamente sobre los elementos del gráfico para estudiar cada objeto en detalle.",
      highlightColor: "#6366f1",
    };
  }

  function renderSVG() {
    const inv = state.isInverted;
    const t = state.selectedTarget;

    const svgW = 860;
    const svgH = 340;
    const padL = 75;
    const padR = 75;
    const padT = 40;
    const padB = 45;
    const plotW = svgW - padL - padR;
    const plotH = svgH - padT - padB;

    const maxRain = 60;
    const minMoist = 40;
    const maxMoist = 70;
    const moistRange = maxMoist - minMoist;

    // Calcular puntos de humedad
    const moistPoints = moistData.map((val, i) => {
      const x = padL + (i / (moistData.length - 1)) * plotW;
      const normalized = (val - minMoist) / moistRange;
      const y = padT + plotH - normalized * plotH;
      return { x, y, val };
    });
    const moistPath = moistPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

    // Flags de selección
    const isFig = t === "fig";
    const isAx1 = t === "ax1" || t === "invert";
    const isAx2 = t === "ax2";

    return `
      <svg viewBox="0 0 ${svgW} ${svgH}" class="da-svg" style="width: 100%; height: auto; display: block; border-radius: 8px;">
        <defs>
          <linearGradient id="daFigGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--bg-card)" stop-opacity="0.95" />
            <stop offset="100%" stop-color="var(--bg-surface)" stop-opacity="0.95" />
          </linearGradient>
          <filter id="da-glow-gold" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f59e0b" flood-opacity="0.6"/>
          </filter>
          <filter id="da-glow-blue" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#2563eb" flood-opacity="0.6"/>
          </filter>
          <filter id="da-glow-red" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#dc2626" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- 1. MARCO GLOBAL FIG (FIGURE) -->
        <g class="da-click-target" data-target="fig" style="cursor: pointer;">
          <rect x="20" y="10" width="${svgW - 40}" height="${svgH - 20}" rx="10"
            fill="url(#daFigGrad)"
            stroke="${isFig ? '#f59e0b' : 'var(--border-card)'}"
            stroke-width="${isFig ? '3' : '1.5'}"
            filter="${isFig ? 'url(#da-glow-gold)' : 'none'}"
          />
          <!-- Badge Figure -->
          <rect x="35" y="16" width="230" height="20" rx="10" fill="${isFig ? '#f59e0b' : 'var(--bg-surface)'}" stroke="var(--border-subtle)" stroke-width="1"/>
          <text x="150" y="30" text-anchor="middle" font-size="10.5" font-weight="700" fill="${isFig ? '#ffffff' : 'var(--accent-amber)'}" font-family="var(--font-mono)">
            🖼️ fig = Figure(figsize=(12, 4))
          </text>
        </g>

        <!-- Fondo del Área Cartesiana -->
        <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="var(--bg-surface)" stroke="var(--border-subtle)" stroke-width="1" rx="4"/>

        <!-- Líneas guía de cuadrícula suave -->
        ${[0.25, 0.5, 0.75].map(ratio => `
          <line x1="${padL}" y1="${padT + plotH * ratio}" x2="${padL + plotW}" y2="${padT + plotH * ratio}" stroke="var(--border-subtle)" stroke-width="0.5" stroke-dasharray="3,3" opacity="0.6"/>
        `).join('')}

        <!-- 2. EJE PRIMARIO AX1 (PREPIPACIÓN - AZUL IZQUIERDA) -->
        <g class="da-click-target" data-target="ax1" style="cursor: pointer; opacity: ${isAx2 ? 0.35 : 1}; transition: all 0.2s ease;">
          <!-- Línea vertical del eje Y1 -->
          <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#2563eb" stroke-width="${isAx1 ? '3' : '2'}"/>

          <!-- Rótulo de ax1 (Precipitación) -->
          <text x="26" y="${padT + plotH / 2}" transform="rotate(-90 26 ${padT + plotH / 2})" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2563eb" font-family="var(--font-mono)">
            ax1 &bull; Precipitación (mm)
          </text>

          <!-- Ticks y Números de ax1 -->
          ${inv ? `
            <!-- Invertido: 0 mm arriba, 60 mm abajo -->
            <line x1="${padL - 6}" y1="${padT + 1}" x2="${padL}" y2="${padT + 1}" stroke="#2563eb" stroke-width="1.5"/>
            <text x="${padL - 10}" y="${padT + 4}" text-anchor="end" font-size="9.5" font-weight="700" fill="#2563eb" font-family="var(--font-mono)">0 mm</text>

            <line x1="${padL - 4}" y1="${padT + plotH / 2}" x2="${padL}" y2="${padT + plotH / 2}" stroke="#2563eb" stroke-width="1"/>
            <text x="${padL - 10}" y="${padT + plotH / 2 + 3}" text-anchor="end" font-size="9" fill="#2563eb" font-family="var(--font-mono)">30 mm</text>

            <line x1="${padL - 6}" y1="${padT + plotH - 1}" x2="${padL}" y2="${padT + plotH - 1}" stroke="#2563eb" stroke-width="1.5"/>
            <text x="${padL - 10}" y="${padT + plotH}" text-anchor="end" font-size="9.5" font-weight="700" fill="#2563eb" font-family="var(--font-mono)">60 mm</text>
          ` : `
            <!-- Normal: 0 mm abajo, 60 mm arriba -->
            <line x1="${padL - 6}" y1="${padT + plotH - 1}" x2="${padL}" y2="${padT + plotH - 1}" stroke="#2563eb" stroke-width="1.5"/>
            <text x="${padL - 10}" y="${padT + plotH}" text-anchor="end" font-size="9.5" font-weight="700" fill="#2563eb" font-family="var(--font-mono)">0 mm</text>

            <line x1="${padL - 4}" y1="${padT + plotH / 2}" x2="${padL}" y2="${padT + plotH / 2}" stroke="#2563eb" stroke-width="1"/>
            <text x="${padL - 10}" y="${padT + plotH / 2 + 3}" text-anchor="end" font-size="9" fill="#2563eb" font-family="var(--font-mono)">30 mm</text>

            <line x1="${padL - 6}" y1="${padT + 1}" x2="${padL}" y2="${padT + 1}" stroke="#2563eb" stroke-width="1.5"/>
            <text x="${padL - 10}" y="${padT + 4}" text-anchor="end" font-size="9.5" font-weight="700" fill="#2563eb" font-family="var(--font-mono)">60 mm</text>
          `}

          <!-- BARRAS DE LLUVIA (ax1) -->
          ${rainData.map((r, i) => {
            const barW = plotW / (rainData.length * 1.8);
            const bx = padL + 15 + i * (plotW / rainData.length);
            const bH = (r / maxRain) * (plotH - 20);

            if (r === 0) return '';

            if (inv) {
              // Cuelga del techo (y = padT hacia abajo)
              return `
                <rect x="${bx.toFixed(1)}" y="${padT}" width="${barW.toFixed(1)}" height="${bH.toFixed(1)}"
                  fill="rgba(37, 99, 235, 0.45)"
                  stroke="#2563eb"
                  stroke-width="${isAx1 ? '1.8' : '1'}"
                  rx="2"
                />
              `;
            } else {
              // Crece desde abajo (y = padT + plotH hacia arriba)
              return `
                <rect x="${bx.toFixed(1)}" y="${(padT + plotH - bH).toFixed(1)}" width="${barW.toFixed(1)}" height="${bH.toFixed(1)}"
                  fill="rgba(37, 99, 235, 0.45)"
                  stroke="#2563eb"
                  stroke-width="${isAx1 ? '1.8' : '1'}"
                  rx="2"
                />
              `;
            }
          }).join('')}
        </g>

        <!-- 3. EJE GEMELO AX2 (HUMEDAD - ROJO DERECHA) -->
        <g class="da-click-target" data-target="ax2" style="cursor: pointer; opacity: ${isAx1 ? 0.35 : 1}; transition: all 0.2s ease;">
          <!-- Línea vertical del eje Y2 -->
          <line x1="${padL + plotW}" y1="${padT}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#dc2626" stroke-width="${isAx2 ? '3' : '2'}"/>

          <!-- Rótulo de ax2 (Humedad) -->
          <text x="${svgW - 22}" y="${padT + plotH / 2}" transform="rotate(90 ${svgW - 22} ${padT + plotH / 2})" text-anchor="middle" font-size="11.5" font-weight="700" fill="#dc2626" font-family="var(--font-mono)">
            ax2 = ax1.twinx() &bull; Humedad (%)
          </text>

          <!-- Ticks y Números de ax2 (Siempre normal: 40% abajo, 70% arriba) -->
          <line x1="${padL + plotW}" y1="${padT + plotH - 1}" x2="${padL + plotW + 6}" y2="${padT + plotH - 1}" stroke="#dc2626" stroke-width="1.5"/>
          <text x="${padL + plotW + 10}" y="${padT + plotH}" font-size="9.5" font-weight="700" fill="#dc2626" font-family="var(--font-mono)">40%</text>

          <line x1="${padL + plotW}" y1="${padT + plotH / 2}" x2="${padL + plotW + 4}" y2="${padT + plotH / 2}" stroke="#dc2626" stroke-width="1"/>
          <text x="${padL + plotW + 10}" y="${padT + plotH / 2 + 3}" font-size="9" fill="#dc2626" font-family="var(--font-mono)">55%</text>

          <line x1="${padL + plotW}" y1="${padT + 1}" x2="${padL + plotW + 6}" y2="${padT + 1}" stroke="#dc2626" stroke-width="1.5"/>
          <text x="${padL + plotW + 10}" y="${padT + 4}" font-size="9.5" font-weight="700" fill="#dc2626" font-family="var(--font-mono)">70%</text>

          <!-- CURVA DE HUMEDAD (ax2) -->
          <path d="${moistPath}" fill="none" stroke="#dc2626" stroke-width="${isAx2 ? '3' : '2.2'}" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Puntos en cada día -->
          ${moistPoints.map((p, i) => `
            <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${isAx2 ? '4.5' : '3.5'}" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
          `).join('')}
        </g>

        <!-- 4. EJE X COMPARTIDO (FECHAS) -->
        <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="var(--border-subtle)" stroke-width="1.5"/>
        ${days.map((d, i) => {
          const cx = padL + (i / (days.length - 1)) * plotW;
          return `
            <line x1="${cx}" y1="${padT + plotH}" x2="${cx}" y2="${padT + plotH + 5}" stroke="var(--border-subtle)" stroke-width="1"/>
            <text x="${cx}" y="${padT + plotH + 18}" text-anchor="middle" font-size="9" font-weight="600" fill="var(--text-muted)" font-family="var(--font-mono)">${d}</text>
          `;
        }).join('')}
        <text x="${padL + plotW / 2}" y="${padT + plotH + 34}" text-anchor="middle" font-size="10" font-weight="700" fill="var(--text-main)">
          Eje X Compartido por Ambos Sensores (sharex) &bull; Días de Monitoreo
        </text>

        <!-- 5. ANOTACIÓN VISUAL DE INVERSIÓN (CEILING VS FLOOR) -->
        <g class="da-click-target" data-target="invert" style="cursor: pointer;">
          ${inv ? `
            <!-- Caja de Techo (Atmósfera) -->
            <rect x="${padL + 20}" y="${padT + 8}" width="260" height="24" rx="4" fill="rgba(37, 99, 235, 0.15)" stroke="#2563eb" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="${padL + 30}" y="${padT + 24}" font-size="10" font-weight="700" fill="#2563eb">
              ☁️ ax1.invert_yaxis(): Lluvia cae desde el techo &darr;
            </text>

            <!-- Caja de Suelo (Humedad) -->
            <rect x="${padL + plotW - 275}" y="${padT + plotH - 32}" width="260" height="24" rx="4" fill="rgba(220, 38, 38, 0.12)" stroke="#dc2626" stroke-width="1" stroke-dasharray="3,2"/>
            <text x="${padL + plotW - 265}" y="${padT + plotH - 16}" font-size="10" font-weight="700" fill="#dc2626">
              ⛰️ ax2 (Humedad): Sube desde el subsuelo &uarr;
            </text>
          ` : `
            <!-- Alerta de Colisión cuando no está invertido -->
            <rect x="${padL + plotW / 2 - 160}" y="${padT + plotH / 2 - 16}" width="320" height="32" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
            <text x="${padL + plotW / 2}" y="${padT + plotH / 2 + 5}" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">
              ⚠️ ¡Colisión! Las barras de lluvia tapan la humedad
            </text>
          `}
        </g>
      </svg>
    `;
  }

  function renderWidget() {
    const container = document.getElementById("dual-axis-rain-container");
    if (!container) return;

    const inv = state.isInverted;
    const t = state.selectedTarget;
    const details = getDetails();

    container.innerHTML = `
      <style>
        .da-card {
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
        [data-theme="light"] .da-card {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }
        .da-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .da-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .da-toggle-btn.btn-active {
          background: rgba(37, 99, 235, 0.12);
          color: #2563eb;
          border-color: #3b82f6;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.2);
        }
        .da-toggle-btn.btn-inactive {
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fca5a5;
        }
        [data-theme="dark"] .da-toggle-btn.btn-inactive {
          background: rgba(185, 28, 28, 0.2);
          color: #f87171;
          border-color: #ef4444;
        }
        .da-inspect-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }
        .da-target-btn {
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
        .da-target-btn:hover {
          border-color: var(--accent-primary);
          color: var(--text-main);
        }
        .da-target-btn.active {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
        }
        .da-canvas-wrap {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          overflow: hidden;
        }
        [data-theme="light"] .da-canvas-wrap {
          background: #f8fafc;
        }
        .da-details-box {
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
          .da-details-box {
            grid-template-columns: 1fr;
          }
        }
        .da-diff-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
        .da-diff-table th {
          background: var(--bg-card);
          padding: 0.45rem 0.6rem;
          text-align: left;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-main);
          font-weight: 700;
        }
        .da-diff-table td {
          padding: 0.45rem 0.6rem;
          border-bottom: 1px solid var(--border-subtle);
          color: var(--text-muted);
        }
        .da-schematic-strip {
          display: grid;
          grid-template-columns: 1fr 40px 1fr;
          align-items: center;
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .da-schematic-strip {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="da-card">
        <!-- Encabezado con Botón de Inversión y Badge -->
        <div class="da-toolbar">
          <div>
            <span class="flow-badge">Módulo 2 &bull; Lección 2.4 &bull; Pizarra Conceptual &amp; Simulador Acoplado</span>
            <h4 class="flow-title" style="margin-top: 2px;">
              🌧️ Doble Eje Y (<code>twinx</code>) y Lluvia Invertida (<code>invert_yaxis</code>)
            </h4>
          </div>

          <div>
            <button class="da-toggle-btn ${inv ? 'btn-active' : 'btn-inactive'}" id="da-invert-toggle">
              ${inv ? '🌧️ Inversión Activa: ax1.invert_yaxis() [Limpio]' : '⚠️ Inversión Desactivada [Colisión Visual]'}
            </button>
          </div>
        </div>

        <!-- 1. ESQUEMA CONCEPTUAL INTEGRADO: EL PERFIL FÍSICO LADERA - ATMÓSFERA -->
        <div class="da-schematic-strip">
          <div style="background: rgba(37, 99, 235, 0.08); border-left: 3px solid #2563eb; border-radius: 4px; padding: 0.5rem 0.75rem;">
            <div style="font-size: 0.72rem; font-weight: 700; color: #2563eb; text-transform: uppercase;">
              ☁️ ATMÓSFERA &bull; EJE PRIMARIO (ax1)
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Precipitación (<code>p1</code>) en <strong>royalblue</strong>. Al invertir el eje, las tormentas <strong>caen desde el techo</strong> hacia abajo, replicando la gravedad.
            </div>
          </div>

          <div style="text-align: center; font-size: 1.1rem; color: var(--accent-emerald);">
            ➔
          </div>

          <div style="background: rgba(220, 38, 38, 0.08); border-left: 3px solid #dc2626; border-radius: 4px; padding: 0.5rem 0.75rem;">
            <div style="font-size: 0.72rem; font-weight: 700; color: #dc2626; text-transform: uppercase;">
              ⛰️ SUBSUELO &bull; EJE GEMELO (ax2 = ax1.twinx())
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Humedad del suelo (<code>sh1</code>) en <strong>crimson</strong>. La saturación <strong>sube desde la base</strong> del talud. No hay colisión entre ambas curvas.
            </div>
          </div>
        </div>

        <!-- Barra de Botones de Inspección Interactiva -->
        <div class="da-inspect-bar">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
            🔍 Inspeccionar Partes:
          </span>
          <button class="da-target-btn ${t === 'all' ? 'active' : ''}" data-target="all">
            🔘 Ver Todo
          </button>
          <button class="da-target-btn ${t === 'fig' ? 'active' : ''}" data-target="fig" style="${t === 'fig' ? 'background: #f59e0b; border-color: #f59e0b;' : ''}">
            🖼️ fig (Lienzo 12x4)
          </button>
          <button class="da-target-btn ${t === 'ax1' ? 'active' : ''}" data-target="ax1" style="${t === 'ax1' ? 'background: #2563eb; border-color: #2563eb;' : ''}">
            🌧️ ax1 (Lluvia p1)
          </button>
          <button class="da-target-btn ${t === 'ax2' ? 'active' : ''}" data-target="ax2" style="${t === 'ax2' ? 'background: #dc2626; border-color: #dc2626;' : ''}">
            💧 ax2 (Humedad sh1)
          </button>
          <button class="da-target-btn ${t === 'invert' ? 'active' : ''}" data-target="invert" style="${t === 'invert' ? 'background: #0284c7; border-color: #0284c7;' : ''}">
            ↕️ invert_yaxis()
          </button>
        </div>

        <!-- 2. SIMULADOR SVG DINÁMICO -->
        <div class="da-canvas-wrap">
          ${renderSVG()}
        </div>

        <!-- 3. PANEL DE DIAGNÓSTICO Y CÓDIGO DE LA PARTE SELECCIONADA -->
        <div class="da-details-box">
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
              <strong>Objeto Matplotlib:</strong> <code>${details.type}</code>
            </div>
          </div>

          <div>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
              💻 Código Python de esta Parte:
            </span>
            <pre style="margin: 0.35rem 0 0 0; padding: 0.75rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.77rem; font-family: var(--font-mono); color: var(--text-main); overflow-x: auto; line-height: 1.45;"><code>${details.code}</code></pre>
          </div>
        </div>

        <!-- 4. TABLA COMPARATIVA: EJE PRIMARIO VS EJE SECUNDARIO -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem;">
          <strong style="font-size: 0.84rem; color: var(--text-main);">
            ⚡ Síntesis de Diseño: Desacoplamiento de Ejes en la Ladera de Ancón Norte
          </strong>
          <table class="da-diff-table">
            <thead>
              <tr>
                <th style="width: 20%;">Criterio Técnico</th>
                <th style="width: 40%; color: #2563eb;">Eje Primario (<code>ax1</code>)</th>
                <th style="width: 40%; color: #dc2626;">Eje Gemelo (<code>ax2 = ax1.twinx()</code>)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Variable y Canal</strong></td>
                <td>Precipitación acumulada (<code>p1</code>)</td>
                <td>Humedad volumétrica del suelo (<code>sh1</code>)</td>
              </tr>
              <tr>
                <td><strong>Unidad Física</strong></td>
                <td>Milímetros diarios (<code>0 a 60 mm</code>)</td>
                <td>Porcentaje de saturación (<code>40% a 70%</code>)</td>
              </tr>
              <tr>
                <td><strong>Color Temático</strong></td>
                <td><code>'royalblue'</code> (Azul lluvia institucional)</td>
                <td><code>'crimson'</code> (Rojo saturación geotécnica)</td>
              </tr>
              <tr>
                <td><strong>Dirección del Eje Y</strong></td>
                <td><strong>Invertido:</strong> <code>ax1.invert_yaxis()</code> (0 mm en el techo)</td>
                <td><strong>Normal:</strong> Crece desde la base hacia arriba</td>
              </tr>
              <tr>
                <td><strong>Interpretación</strong></td>
                <td>El agua precipita desde la atmósfera.</td>
                <td>El suelo se satura progresivamente tras el aguacero.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Eventos
    const btnToggle = document.getElementById("da-invert-toggle");
    if (btnToggle) {
      btnToggle.onclick = toggleInvert;
    }

    // Botones de inspección de partes
    container.querySelectorAll(".da-target-btn").forEach((btn) => {
      btn.onclick = () => {
        const target = btn.getAttribute("data-target");
        if (target) setTarget(target);
      };
    });

    // Clicks directos en el SVG
    container.querySelectorAll(".da-click-target").forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const target = el.getAttribute("data-target");
        if (target) setTarget(target);
      };
    });
  }

  // Exportar globalmente
  window.initDualAxisRainWidget = initWidget;

  // Auto-inicializar si el contenedor existe
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.getElementById("dual-axis-rain-container")) {
        initWidget();
      }
    });
  } else {
    if (document.getElementById("dual-axis-rain-container")) {
      initWidget();
    }
  }
})();
