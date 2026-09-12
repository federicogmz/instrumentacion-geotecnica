/**
 * pyodide-runner.js
 * Gestor del motor de Python en WebAssembly (Pyodide) para ejecución de código
 * en el navegador, montaje de datos CSV y renderizado de gráficos de Matplotlib.
 */

class PyodideRunner {
  constructor() {
    this.pyodide = null;
    this.isLoading = false;
    this.isReady = false;
    this.statusListeners = [];
  }

  onStatus(callback) {
    this.statusListeners.push(callback);
  }

  notifyStatus(message, state) {
    this.statusListeners.forEach((cb) => cb(message, state));
  }

  async init() {
    if (this.isReady || this.isLoading) return;
    this.isLoading = true;

    try {
      this.notifyStatus("Descargando motor Python WebAssembly...", "loading");

      // Cargar script de Pyodide si no está presente
      if (typeof loadPyodide === "undefined") {
        await this.loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js");
      }

      this.notifyStatus("Inicializando intérprete de Python...", "loading");
      this.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
      });

      this.notifyStatus("Instalando paquetes científicos (numpy, pandas, matplotlib)...", "loading");
      await this.pyodide.loadPackage(["numpy", "pandas", "matplotlib"]);

      this.notifyStatus("Precargando registros de sensores de Ancón Norte...", "loading");
      await this.mountDataFiles();

      this.isReady = true;
      this.isLoading = false;
      this.notifyStatus("Python 3 listo para ejecución interactiva", "ready");
    } catch (error) {
      console.error("Error al inicializar Pyodide:", error);
      this.isLoading = false;
      this.notifyStatus("Error al cargar Python: " + error.message, "error");
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async mountDataFiles() {
    try {
      // Intentar cargar data/df_ancon.csv desde el servidor web
      const response = await fetch("./data/df_ancon.csv");
      if (response.ok) {
        const csvText = await response.text();
        // Escribir en el filesystem virtual de Pyodide
        this.pyodide.FS.writeFile("/df_ancon.csv", csvText);
        this.pyodide.FS.writeFile("df_ancon.csv", csvText);

        // Crear carpeta data si se requiere
        try {
          this.pyodide.FS.mkdir("/data");
        } catch (e) {}
        try {
          this.pyodide.FS.writeFile("/data/df_ancon.csv", csvText);
        } catch (e) {}
      }
    } catch (e) {
      console.warn("No se pudo cargar el archivo CSV externo, cargando respaldo embebido...", e);
      // Respaldo de emergencia sintético con fechas reales
      this.writeFallbackData();
    }
  }

  writeFallbackData() {
    // Generar un fragmento representativo si no hay conectividad a ./data/df_ancon.csv
    let sampleCSV = "Unnamed: 0,sh1,p,C1,B1,Tem_1,DE1\n";
    const startDate = new Date("2020-03-24");
    for (let i = 0; i < 100; i++) {
      const cur = new Date(startDate);
      cur.setDate(startDate.getDate() + i);
      const dStr = cur.toISOString().split("T")[0];
      const sh1 = (55 + Math.sin(i / 5) * 15 + Math.random() * 2).toFixed(2);
      const p = Math.random() > 0.7 ? (Math.random() * 35).toFixed(1) : "0.0";
      const c1 = (1.75 + i * 0.008 + (Math.random() - 0.5) * 0.02).toFixed(3);
      const b1 = (-0.6 + i * 0.004 + (Math.random() - 0.5) * 0.01).toFixed(3);
      const tem = (26 + Math.sin(i / 3) * 3).toFixed(1);
      const de1 = (Math.random() > 0.8 ? (Math.random() * 1.5).toFixed(2) : "0.0");
      sampleCSV += `${dStr},${sh1},${p},${c1},${b1},${tem},${de1}\n`;
    }
    this.pyodide.FS.writeFile("/df_ancon.csv", sampleCSV);
    this.pyodide.FS.writeFile("df_ancon.csv", sampleCSV);
  }

  async runCode(code) {
    if (!this.isReady) {
      return {
        success: false,
        output: "⚠️ El motor de Python todavía se está inicializando. Por favor espera unos segundos...",
        plots: [],
        hasPlot: false
      };
    }

    // Configuración para interceptar stdout, stderr y capturar gráficos de Matplotlib
    const wrapper = `
import sys
import io
import base64

# Redirigir stdout y stderr
__captured_stdout__ = io.StringIO()
__captured_stderr__ = io.StringIO()
sys.stdout = __captured_stdout__
sys.stderr = __captured_stderr__

__plots__ = []

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
except ImportError:
    plt = None

try:
    # Ejecutar código del usuario
    exec(${JSON.stringify(code)}, globals())

    # Capturar gráficos generados
    if plt and len(plt.get_fignums()) > 0:
        for fig_num in plt.get_fignums():
            fig = plt.figure(fig_num)
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight', dpi=120)
            buf.seek(0)
            __plots__.append(base64.b64encode(buf.read()).decode('utf-8'))
        plt.close('all')

except Exception as e:
    import traceback
    traceback.print_exc(file=__captured_stderr__)

sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

__output_text__ = __captured_stdout__.getvalue()
__error_text__ = __captured_stderr__.getvalue()
`;

    try {
      await this.pyodide.runPythonAsync(wrapper);

      const outputText = this.pyodide.globals.get("__output_text__") || "";
      const errorText = this.pyodide.globals.get("__error_text__") || "";
      const plotsProxy = this.pyodide.globals.get("__plots__");
      const plots = plotsProxy ? plotsProxy.toJs() : [];

      const combinedOutput = (outputText + (errorText ? "\n🛑 Error en ejecución:\n" + errorText : "")).trim();

      return {
        success: !errorText,
        output: combinedOutput || "(El código se ejecutó sin generar texto de salida)",
        plots: plots,
        hasPlot: plots.length > 0
      };
    } catch (err) {
      return {
        success: false,
        output: "🛑 Error crítico de ejecución en Python:\n" + err.message,
        plots: [],
        hasPlot: false
      };
    }
  }
}

// Instancia global del runner
window.pyodideRunner = new PyodideRunner();
