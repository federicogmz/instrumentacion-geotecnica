/**
 * matplotlib-anatomy.js
 * Pizarra Conceptual y Simulador Dinámico de Renderizado en Matplotlib (Lección 2.1).
 * 
 * Experiencia interactiva:
 * - Arranca 100% apagado (lienzo vacío).
 * - El estudiante "escribe/ejecuta" cada línea de código de forma secuencial.
 * - Al ejecutar .plot(), se generan los ejes coordenados y marcas numéricas junto con la curva (sin nombres de ejes).
 * - En el paso 4 (xlabel/ylabel) se encienden los nombres y unidades físicas.
 * - Figura grande, didáctica y con cero solapamientos.
 */

(function () {
  let state = {
    layers: {
      figure: false,
      plot: false,
      title: false,
      labels: false,
      grid: false,
    },
    activeLayer: null,
    timer: null,
    animating: false,
  };

  // Serie de lluvia sintética representativa de Ancón Norte (mm/día)
  const rainData = [
    { date: "05-03", rain: 0.0 },
    { date: "05-10", rain: 12.4 },
    { date: "05-17", rain: 2.1 },
    { date: "05-24", rain: 38.6 },
    { date: "05-31", rain: 5.2 },
    { date: "06-07", rain: 0.0 },
    { date: "06-14", rain: 26.8 },
    { date: "06-21", rain: 44.2 },
    { date: "06-28", rain: 8.0 },
    { date: "07-05", rain: 1.5 },
  ];

  const codeSteps = [
    {
      id: "figure",
      num: 1,
      name: "1. Instanciar el Lienzo",
      code: "plt.figure(figsize=(9, 3.8))",
      obj: "Objeto: Figure",
      actionDesc: "Reserva el marco gráfico en memoria con dimensiones físicas en pulgadas (9 de ancho × 3.8 de alto). Aún no hay ejes ni datos.",
      feedback: "✅ <strong>Paso 1:</strong> Se instanció el lienzo de papel (Figure). Espacio preparado en memoria.",
      color: "#3b82f6",
    },
    {
      id: "plot",
      num: 2,
      name: "2. Trazar Serie & Crear Ejes",
      code: "plt.plot(df.index, df['p'], color='royalblue', label='Precipitación')",
      obj: "Objetos: Axes, XAxis/YAxis (Ticks) & Line2D",
      actionDesc: "Calcula los rangos numéricos de los datos, genera los ejes cartesianos, dibuja las marcas de escala (ticks) y traza la curva de lluvia.",
      feedback: "✅ <strong>Paso 2:</strong> Matplotlib creó automáticamente el sistema de coordenadas cartesianas, las marcas de escala numérica y la curva azul.",
      color: "#2563eb",
    },
    {
      id: "title",
      num: 3,
      name: "3. Título Técnico",
      code: "plt.title('Precipitación Diaria - Ancón Norte', fontweight='bold')",
      obj: "Objeto: Axes.title (Text)",
      actionDesc: "Ancla el encabezado técnico centrado sobre la gráfica, identificando el fenómeno analizado y la ladera monitoreada.",
      feedback: "✅ <strong>Paso 3:</strong> Encabezado técnico institucional agregado en la parte superior.",
      color: "#06b6d4",
    },
    {
      id: "labels",
      num: 4,
      name: "4. Nombres de Ejes & Unidades",
      code: "plt.xlabel('Fecha')\nplt.ylabel('Precipitación (mm/día)')",
      obj: "Objetos: XAxis.label & YAxis.label (Text)",
      actionDesc: "Define explícitamente qué variable física y qué unidad de medida representa cada eje (fundamental para no cometer errores de escala).",
      feedback: "✅ <strong>Paso 4:</strong> Rótulos físicos activados: 'Fecha' en el eje horizontal y 'Precipitación (mm/día)' en el eje vertical.",
      color: "#10b981",
    },
    {
      id: "grid",
      num: 5,
      name: "5. Malla de Medición (Cuadrícula)",
      code: "plt.grid(True, linestyle='--', alpha=0.5)",
      obj: "Objeto: Axes.grid (GridLines)",
      actionDesc: "Dibuja líneas guía punteadas semitransparentes que facilitan al analista interpolar magnitudes visualmente sin regla.",
      feedback: "✅ <strong>Paso 5:</strong> Cuadrícula técnica visible. ¡Gráfica completa y lista para diagnóstico!",
      color: "#f59e0b",
    },
  ];

  function initWidget() {
    renderWidget();
  }

  function renderWidget() {
    const container = document.getElementById("matplotlib-anatomy-container");
    if (!container) return;

    const l = state.layers;
    const activeCount = Object.values(l).filter(Boolean).length;

    // Dimensiones amplias y proporciones generosas para que la figura se aprecie grande y nítida
    const svgW = 820;
    const svgH = 360;
    const padL = 95;  // Espacio holgado: label Y en x=30, números de escala en x=85 (cero solapamientos)
    const padR = 35;
    const padT = 65;  // Espacio holgado: título en y=35, gráfica arranca en y=65
    const padB = 65;  // Espacio holgado: fechas en y=318, label Fecha en y=348
    const plotW = svgW - padL - padR;
    const plotH = svgH - padT - padB;
    const maxVal = 50;

    const points = rainData.map((d, i) => {
      const x = padL + (i / (rainData.length - 1)) * plotW;
      const y = padT + plotH - (d.rain / maxVal) * plotH;
      return { x, y, ...d };
    });

    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

    // Mensaje de estado dinámico
    let statusText = "⚪ <em>Lienzo vacío. Haz clic en '▶ Ejecutar Línea 1' para instanciar la figura en memoria.</em>";
    if (l.grid) {
      statusText = "🎉 <strong>¡Gráfica completamente renderizada!</strong> Todas las capas de Matplotlib están activas.";
    } else if (l.labels) {
      statusText = "💡 Ejes rotulados con unidades físicas. Falta la cuadrícula de lectura técnica para estimar magnitudes.";
    } else if (l.title) {
      statusText = "🏷️ Título asignado. Observa que los ejes aún no tienen nombres ni unidades.";
    } else if (l.plot) {
      statusText = "📈 <strong>¡Ejes y serie generados!</strong> Al llamar <code>plt.plot()</code>, Matplotlib generó automáticamente los ejes y la escala numérica, pero <em>sin nombres de variables</em> aún.";
    } else if (l.figure) {
      statusText = "📄 <strong>Lienzo de papel instanciado.</strong> Marco de 9 × 3.8 pulgadas listo; ejecuta <code>plt.plot()</code> para trazar los datos.";
    }

    container.innerHTML = `
      <style>
        .ma-wrapper {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-subtle, rgba(226, 232, 240, 0.9));
          border-radius: var(--radius-md, 12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin: 1.25rem 0;
          font-family: inherit;
        }

        /* Barra de Título Superior */
        .ma-top-bar {
          background: var(--bg-elevated, rgba(15, 23, 42, 0.03));
          border-bottom: 1px solid var(--border-subtle, #e2e8f0);
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .ma-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ma-main-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main, #0f172a);
        }
        .ma-badge-step {
          background: rgba(59, 130, 246, 0.12);
          color: var(--accent-primary, #2563eb);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          border: 1px solid rgba(59, 130, 246, 0.25);
        }

        /* Botones de Control General */
        .ma-controls {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .ma-btn {
          background: var(--bg-card, #ffffff);
          border: 1px solid var(--border-subtle, #cbd5e1);
          color: var(--text-main, #334155);
          border-radius: 6px;
          padding: 0.35rem 0.65rem;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.2s ease;
        }
        .ma-btn:hover {
          background: var(--bg-hover, #f1f5f9);
          border-color: var(--accent-primary, #3b82f6);
          color: var(--accent-primary, #3b82f6);
        }
        .ma-btn-primary {
          background: #2563eb;
          color: #ffffff;
          border-color: #1d4ed8;
        }
        .ma-btn-primary:hover {
          background: #1d4ed8;
          color: #ffffff;
        }

        /* Marco de la Ventana Gráfica (Lienzo Grande) */
        .ma-canvas-section {
          padding: 1.15rem;
          background: var(--bg-main, #f8fafc);
          border-bottom: 1px solid var(--border-subtle, #e2e8f0);
        }
        .ma-window-frame {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }
        .ma-window-header {
          background: #f1f5f9;
          border-bottom: 1px solid #e2e8f0;
          padding: 0.45rem 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          font-family: var(--font-mono, monospace);
          color: #475569;
        }
        .ma-window-dots {
          display: flex;
          gap: 5px;
        }
        .ma-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          display: inline-block;
        }
        .ma-dot-red { background: #ef4444; }
        .ma-dot-yellow { background: #f59e0b; }
        .ma-dot-green { background: #10b981; }

        /* Consola Interactiva de Pasos de Código */
        .ma-console-section {
          padding: 1.15rem;
          background: var(--bg-card, #ffffff);
        }
        .ma-console-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .ma-console-title {
          font-size: 0.84rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted, #64748b);
        }
        .ma-code-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 0.65rem;
        }
        .ma-step-card {
          background: var(--bg-main, #f8fafc);
          border: 1px solid var(--border-subtle, #e2e8f0);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .ma-step-card:hover {
          background: #ffffff;
          border-color: var(--accent-primary, #3b82f6);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
        }
        .ma-step-card.is-executed {
          background: rgba(37, 99, 235, 0.03);
          border-color: #3b82f6;
        }
        .ma-step-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
          margin-bottom: 0.35rem;
        }
        .ma-step-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-main, #0f172a);
        }
        .ma-step-status-pill {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 999px;
        }
        .pill-off {
          background: #e2e8f0;
          color: #64748b;
        }
        .pill-on {
          background: #10b981;
          color: #ffffff;
        }
        .ma-step-code {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          background: rgba(15, 23, 42, 0.05);
          color: var(--accent-primary, #1d4ed8);
          padding: 0.25rem 0.4rem;
          border-radius: 4px;
          margin-bottom: 0.35rem;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .ma-step-desc {
          font-size: 0.74rem;
          color: var(--text-muted, #64748b);
          margin: 0;
          line-height: 1.4;
        }

        /* Barra de Feedback Inferior */
        .ma-feedback-bar {
          background: rgba(59, 130, 246, 0.06);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 6px;
          padding: 0.55rem 0.85rem;
          margin-top: 0.85rem;
          font-size: 0.82rem;
          color: var(--text-main, #1e293b);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      </style>

      <div class="ma-wrapper animate-fade-in">
        <!-- Encabezado con Controles -->
        <div class="ma-top-bar">
          <div class="ma-title-group">
            <span class="ma-badge-step">Pizarra &bull; Lección 2.1</span>
            <h4 class="ma-main-title">🎨 ¿Cómo se Renderiza Matplotlib Línea a Línea?</h4>
          </div>

          <div class="ma-controls">
            <button class="ma-btn ma-btn-primary" id="ma-btn-next" title="Ejecuta la siguiente instrucción en orden">
              <span>▶</span> <span>Siguiente Línea</span>
            </button>
            <button class="ma-btn" id="ma-btn-auto" title="Ejecución secuencial automática con animación">
              <span>🎬</span> <span>Auto-Ejecutar Todo</span>
            </button>
            <button class="ma-btn" id="ma-btn-reset" title="Apaga todas las capas para reiniciar">
              <span>🧹</span> <span>Lienzo Vacío</span>
            </button>
          </div>
        </div>

        <!-- Sección de Lienzo Gráfico Grande (Visual Canvas) -->
        <div class="ma-canvas-section">
          <div class="ma-window-frame">
            <div class="ma-window-header">
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="ma-window-dots">
                  <span class="ma-dot ma-dot-red"></span>
                  <span class="ma-dot ma-dot-yellow"></span>
                  <span class="ma-dot ma-dot-green"></span>
                </div>
                <span><strong>Figure 1</strong> &bull; Tamaño físico: 9.0" × 3.8"</span>
              </div>
              <div>
                <span>Líneas ejecutadas: <strong>${activeCount}/5</strong></span>
              </div>
            </div>

            <!-- Gráfica SVG Grande y Nítida -->
            <div style="padding: 0.75rem 1rem; text-align: center; background: #ffffff;">
              <svg viewBox="0 0 ${svgW} ${svgH}" style="width: 100%; height: auto; max-height: 340px; display: block; margin: 0 auto;">
                
                ${
                  !l.figure
                    ? `
                  <!-- ESTADO 0: Lienzo Vacío (Antes de ejecutar plt.figure) -->
                  <rect x="2" y="2" width="${svgW - 4}" height="${svgH - 4}" rx="8"
                    fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="6 6" />
                  <g transform="translate(${svgW / 2}, ${svgH / 2})">
                    <circle cx="0" cy="-25" r="24" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" stroke-width="1.5" />
                    <text x="0" y="-18" font-size="20" text-anchor="middle">🎨</text>
                    <text x="0" y="15" fill="#334155" font-size="14" font-weight="700" text-anchor="middle">
                      Lienzo en Blanco (Memoria No Inicializada)
                    </text>
                    <text x="0" y="36" fill="#64748b" font-size="11.5" text-anchor="middle">
                      Haz clic en "▶ Siguiente Línea" o en la tarjeta 1 para instanciar plt.figure(figsize=(9, 3.8))
                    </text>
                  </g>
                `
                    : `
                  <!-- PASO 1: Lienzo Base de Papel (plt.figure) -->
                  <rect x="2" y="2" width="${svgW - 4}" height="${svgH - 4}" rx="8"
                    fill="#ffffff" stroke="#94a3b8" stroke-width="1.2" />

                  <!-- Marco y fondo de los ejes cartesianos (Axes) -->
                  ${
                    l.plot
                      ? `
                    <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" 
                      fill="#fafafa" stroke="#334155" stroke-width="1.2" />

                    <!-- PASO 5: Cuadrícula Técnica (plt.grid) -->
                    ${
                      l.grid
                        ? `
                      <g class="ma-grid-layer" opacity="0.6">
                        <!-- Malla horizontal de lluvia (0, 10, 20, 30, 40, 50 mm) -->
                        ${[0, 10, 20, 30, 40, 50]
                          .map((v) => {
                            const y = padT + plotH - (v / maxVal) * plotH;
                            return `
                              <line x1="${padL}" y1="${y}" x2="${padL + plotW}" y2="${y}" 
                                stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4" />
                            `;
                          })
                          .join("")}

                        <!-- Malla vertical cronológica -->
                        ${points
                          .map((p) => {
                            return `
                              <line x1="${p.x}" y1="${padT}" x2="${p.x}" y2="${padT + plotH}" 
                                stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4" opacity="0.4" />
                            `;
                          })
                          .join("")}
                      </g>
                    `
                        : ""
                    }

                    <!-- PASO 2: Ejes Cartesianos, Marcas y Escala Numérica (Ticks generados por plt.plot) -->
                    <!-- NOTA CLAVE: .plot() crea las marcas numéricas de la escala, pero NO los nombres de variables -->
                    <g class="ma-axes-ticks">
                      <!-- Marcas y números del eje Y (Precipitación: 0 a 50) -->
                      ${[0, 10, 20, 30, 40, 50]
                        .map((v) => {
                          const y = padT + plotH - (v / maxVal) * plotH;
                          return `
                            <line x1="${padL - 6}" y1="${y}" x2="${padL}" y2="${y}" stroke="#334155" stroke-width="1.4" />
                            <text x="${padL - 10}" y="${y + 4}" fill="#475569" font-size="11" text-anchor="end" font-family="monospace">${v}</text>
                          `;
                        })
                        .join("")}

                      <!-- Marcas y fechas del eje X -->
                      ${points
                        .map((p) => {
                          return `
                            <line x1="${p.x}" y1="${padT + plotH}" x2="${p.x}" y2="${padT + plotH + 6}" stroke="#334155" stroke-width="1.4" />
                            <text x="${p.x}" y="${padT + plotH + 20}" fill="#475569" font-size="10.5" text-anchor="middle" font-family="monospace">${p.date}</text>
                          `;
                        })
                        .join("")}
                    </g>

                    <!-- PASO 2: Curva Vectorial de Lluvia (plt.plot) -->
                    <g class="ma-plot-line">
                      <!-- Sombra / Halo suave -->
                      <path d="${pathD}" fill="none" stroke="rgba(37, 99, 235, 0.2)" stroke-width="7" />
                      <!-- Trazo continuo de precipitación -->
                      <path d="${pathD}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                      <!-- Puntos muestreados -->
                      ${points
                        .map((p) => {
                          return `
                            <circle cx="${p.x}" cy="${p.y}" r="4.2" fill="#2563eb" stroke="#ffffff" stroke-width="1.8" />
                          `;
                        })
                        .join("")}
                    </g>

                    <!-- PASO 4: Nombres de Ejes y Unidades Físicas (plt.xlabel / plt.ylabel) -->
                    <!-- CERO SOLAPAMIENTOS: Separación de más de 50px de los números -->
                    ${
                      l.labels
                        ? `
                      <g class="ma-axis-labels">
                        <!-- Nombre del Eje X -->
                        <text x="${padL + plotW / 2}" y="${padT + plotH + 46}" 
                          fill="#0f172a" font-size="13" font-weight="700" text-anchor="middle">
                          Fecha
                        </text>

                        <!-- Nombre del Eje Y Rotado (Precipitación mm/día) -->
                        <text x="${-(padT + plotH / 2)}" y="32" transform="rotate(-90)" 
                          fill="#0f172a" font-size="13" font-weight="700" text-anchor="middle">
                          Precipitación (mm/día)
                        </text>
                      </g>
                    `
                        : ""
                    }

                    <!-- PASO 3: Título Institucional (plt.title) -->
                    <!-- CERO SOLAPAMIENTOS: Espacio superior limpio de 35px -->
                    ${
                      l.title
                        ? `
                      <g class="ma-title-layer">
                        <text x="${padL + plotW / 2}" y="36" 
                          fill="#0f172a" font-size="14.5" font-weight="800" text-anchor="middle" letter-spacing="0.2px">
                          Precipitación Diaria – Ancón Norte
                        </text>
                      </g>
                    `
                        : ""
                    }
                  `
                      : `
                    <!-- Caso en que solo está figure activo -->
                    <g transform="translate(${svgW / 2}, ${svgH / 2})">
                      <rect x="-180" y="-35" width="360" height="70" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
                      <text x="0" y="-8" fill="#334155" font-size="12" font-weight="700" text-anchor="middle">
                        📄 Objeto Figure instanciado: plt.figure(figsize=(9, 3.8))
                      </text>
                      <text x="0" y="16" fill="#64748b" font-size="11" text-anchor="middle">
                        Lienzo preparado en memoria. Ejecuta la Línea 2 (plt.plot) para trazar la serie y los ejes.
                      </text>
                    </g>
                  `
                  }
                `
                }
              </svg>
            </div>
          </div>
        </div>

        <!-- Consola Interactiva: Cada Tarjeta Representa una Línea de Código -->
        <div class="ma-console-section">
          <div class="ma-console-header">
            <span class="ma-console-title">💻 Consola de Renderizado: Haz Clic en las Líneas de Código</span>
            <span style="font-size:0.75rem; color:var(--text-muted,#64748b);">Haz clic para encender o apagar cualquier instrucción</span>
          </div>

          <div class="ma-code-grid">
            ${codeSteps
              .map((step) => {
                const isExecuted = l[step.id];
                return `
                  <div class="ma-step-card ${isExecuted ? "is-executed" : ""}" data-step-id="${step.id}">
                    <div>
                      <div class="ma-step-top">
                        <span class="ma-step-name">${step.name}</span>
                        <span class="ma-step-status-pill ${isExecuted ? "pill-on" : "pill-off"}">
                          ${isExecuted ? "✓ Activa" : "⚪ Apagada"}
                        </span>
                      </div>
                      <code class="ma-step-code">${step.code}</code>
                    </div>
                    <p class="ma-step-desc">${step.actionDesc}</p>
                  </div>
                `;
              })
              .join("")}
          </div>

          <!-- Barra de Explicación Didáctica -->
          <div class="ma-feedback-bar">
            <span>💬</span>
            <div>${statusText}</div>
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function attachEvents() {
    const container = document.getElementById("matplotlib-anatomy-container");
    if (!container) return;

    // Clic en cualquier tarjeta de código para encender/apagar esa instrucción
    container.querySelectorAll(".ma-step-card").forEach((card) => {
      card.addEventListener("click", () => {
        stopAnimation();
        const stepId = card.dataset.stepId;
        
        // Si el estudiante enciende plot directamente, encender figure también por pedagogía
        if (stepId === "plot" && !state.layers.plot) {
          state.layers.figure = true;
          state.layers.plot = true;
        } else if (stepId === "figure" && state.layers.figure) {
          // Si apaga figure, apagar todo
          Object.keys(state.layers).forEach((k) => (state.layers[k] = false));
        } else {
          state.layers[stepId] = !state.layers[stepId];
        }

        renderWidget();
      });
    });

    // Botón Siguiente Línea (Paso a Paso)
    const btnNext = container.querySelector("#ma-btn-next");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        stopAnimation();
        const sequence = ["figure", "plot", "title", "labels", "grid"];
        const nextUnexecuted = sequence.find((k) => !state.layers[k]);
        if (nextUnexecuted) {
          state.layers[nextUnexecuted] = true;
        } else {
          // Si ya están todas, reiniciar
          Object.keys(state.layers).forEach((k) => (state.layers[k] = false));
          state.layers.figure = true;
        }
        renderWidget();
      });
    }

    // Botón Auto-Ejecutar Todo (Animación Secuencial)
    const btnAuto = container.querySelector("#ma-btn-auto");
    if (btnAuto) {
      btnAuto.addEventListener("click", () => {
        startAutoPlay();
      });
    }

    // Botón Reiniciar / Lienzo Vacío
    const btnReset = container.querySelector("#ma-btn-reset");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        stopAnimation();
        Object.keys(state.layers).forEach((k) => (state.layers[k] = false));
        renderWidget();
      });
    }
  }

  function stopAnimation() {
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
    state.animating = false;
  }

  function startAutoPlay() {
    stopAnimation();
    state.animating = true;

    // Resetear a falso
    Object.keys(state.layers).forEach((k) => (state.layers[k] = false));
    renderWidget();

    const sequence = ["figure", "plot", "title", "labels", "grid"];
    let idx = 0;

    function next() {
      if (idx < sequence.length) {
        state.layers[sequence[idx]] = true;
        renderWidget();
        idx++;
        state.timer = setTimeout(next, 950);
      } else {
        state.animating = false;
        state.timer = null;
      }
    }

    state.timer = setTimeout(next, 500);
  }

  window.initMatplotlibAnatomyWidget = initWidget;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
