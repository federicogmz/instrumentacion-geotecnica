/**
 * course-data.js
 * Contenidos pedagógicos, conceptos teóricos, ejemplos sintácticos,
 * ejercicios interactivos (con código inicial no resuelto) y soluciones.
 */

const COURSE_DATA = {
  // =========================================================================
  // SECCIÓN 0: CASO DE ESTUDIO Y FUNDAMENTOS TEÓRICOS INICIALES
  // =========================================================================
  teoria: {
    id: "teoria",
    title: "Caso de Estudio: Movimiento en Masa Ancón Norte",
    subtitle: "Copacabana, Antioquia | Sistema de Monitoreo Geotécnico - SIATA",
    intro: `
      El proceso morfodinámico de <strong>Ancón Norte</strong> (Copacabana, Antioquia) corresponde a un 
      <strong>movimiento en masa complejo</strong> activo en un área de aproximadamente <strong>7 hectáreas</strong>, 
      localizado en la margen derecha del Río Medellín, sobre el km 18 de la autopista Medellín-Girardota.
      <br><br>
      A través de exploraciones geotécnicas y perforaciones instrumentadas, se identificaron superficies de cizallamiento 
      a profundidades de <strong>11 m, 16 m y 22 m</strong> (siendo esta última la superficie basal principal).
      La masa inestable amenaza infraestructuras críticas: el Poliducto Medellín-Cisneros, redes de acueducto, la vía nacional y más de 80 viviendas.
    `,
    sensors: [
      {
        id: "pluviometro",
        name: "Pluviómetro de Balancín",
        tag: "Factor Detonante",
        icon: "🌧️",
        columns: "p1, p2, p (mm)",
        freq: "5 minutos",
        desc: "Mide la precipitación acumulada por intervalos. Posee dos balancines gemelos (p1 y p2) para redundancia si alguno se obstruye por hojas o sedimentos.",
        impact: "La lluvia es el detonante primordial: satura los horizontes de meteorización y eleva presiones de poros en el talud."
      },
      {
        id: "humedad",
        name: "Sonda de Humedad del Suelo",
        tag: "Respuesta del Terreno",
        icon: "💧",
        columns: "sh1 (%)",
        freq: "5 minutos",
        desc: "Mide el contenido volumétrico de agua a nivel subsuperficial mediante reflectometría electromagnética.",
        impact: "Registra el avance del frente húmedo de infiltración. Al superar el 75-80%, el suelo se aproxima a la saturación perdiendo succión."
      },
      {
        id: "extensometro",
        name: "Extensómetro de Hilo / Varilla",
        tag: "Cinemática Superficial",
        icon: "📏",
        columns: "DE1 (mm)",
        freq: "1 minuto",
        desc: "Mide la apertura relativa milimétrica a través de las grietas de tracción principales en la corona del deslizamiento.",
        impact: "Cuantifica la velocidad de desplazamiento del terreno. Aceleraciones súbitas anticipan colapsos inminentes."
      },
      {
        id: "acelerometro",
        name: "Inclinómetro / Acelerómetro Biaxial",
        tag: "Rotación y Tilt",
        icon: "📐",
        columns: "C1 (Cabeceo), B1 (Balanceo) en °, Tem_1 (°C)",
        freq: "1 hora",
        desc: "Mide la rotación angular del terreno: C1 (Pitch / Cabeceo hacia la pendiente) y B1 (Roll / Balanceo lateral), junto con la temperatura.",
        impact: "Detecta giros o basculamientos de los bloques inestables antes de desplazamientos traslacionales mayores."
      }
    ]
  },

  // =========================================================================
  // SECCIÓN 1: MÓDULO 1 - FUNDAMENTOS DE PYTHON Y PANDAS
  // =========================================================================
  modulo1: {
    id: "modulo1",
    title: "Módulo 1: Fundamentos de Python y Pandas",
    subtitle: "Aprende a programar desde cero y manipula series de sensores",
    lessons: [
      {
        id: "m1_l1",
        title: "1.1 Variables Geotécnicas y Operaciones Básicas",
        concept: `
          <p>Una <strong>variable</strong> es una etiqueta que almacena un valor en memoria. En geotecnia guardamos parámetros físicos como números decimales (<code>float</code>), enteros (<code>int</code>) o texto (<code>str</code>):</p>
          <div class="code-example-block">
# Ejemplo de variables geotécnicas:
peso_unitario = 19.5       # float (kN/m^3)
profundidad = 22.0         # float (m)
numero_sensores = 4        # int (número de instrumentos)
estacion = "Ancón Norte"   # str (texto)
          </div>
          <p>Podemos realizar operaciones aritméticas directas: suma (<code>+</code>), resta (<code>-</code>), multiplicación (<code>*</code>) y división (<code>/</code>).</p>
          <p>Por ejemplo, el <strong>Esfuerzo Vertical Total</strong> se calcula como:</p>
          <p><center><code>esfuerzo_total = peso_unitario * profundidad</code></center></p>
        `,
        instruction: "Calcula el esfuerzo vertical total a la profundidad crítica de falla en Ancón Norte (22.0 m) multiplicando <code>peso_unitario * profundidad</code>, e imprime el resultado con <code>print(f'Esfuerzo vertical total: {esfuerzo_total} kPa')</code>.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.1: Variables y Operaciones Básicas
# -------------------------------------------------------------
# Parámetros del suelo en Ancón Norte:
peso_unitario = 19.5  # gamma en kN/m^3
profundidad = 22.0    # z en metros (superficie de falla basal)

# 1. Escribe la fórmula para calcular el esfuerzo total (multiplica peso_unitario por profundidad):
esfuerzo_total = None

# 2. Imprime el resultado usando la función print:
# print(f"Esfuerzo vertical total: {esfuerzo_total} kPa")
`,
        hint: "Asigna: `esfuerzo_total = peso_unitario * profundidad` y luego imprime el valor con `print()`.",
        solution: `peso_unitario = 19.5
profundidad = 22.0

esfuerzo_total = peso_unitario * profundidad
print(f"Esfuerzo vertical total: {esfuerzo_total} kPa")`,
        validator: (output) => output.includes("429") || output.includes("429.0")
      },
      {
        id: "m1_l2",
        title: "1.2 Listas, Indexación y Cálculo de Promedios",
        concept: `
          <p>Una <strong>lista</strong> guarda una secuencia ordenada de valores entre corchetes <code>[...]</code>, como una columna de lecturas en tu libreta de campo.</p>
          <p><strong>Reglas clave de indexación:</strong></p>
          <ul>
            <li>En Python el primer elemento es <code>lista[0]</code>.</li>
            <li>El último elemento se obtiene con índice negativo: <code>lista[-1]</code>.</li>
            <li>Para calcular el promedio usamos <code>sum(lista) / len(lista)</code>.</li>
          </ul>
          <div class="code-example-block">
lecturas = [0.4, 0.9, 1.5, 2.8]
print(lecturas[0])   # 0.4 mm (primera)
print(lecturas[-1])  # 2.8 mm (última)
          </div>
        `,
        instruction: "Dada la lista de lecturas de apertura en mm (<code>deformaciones</code>), extrae la primera lectura en <code>primera</code>, la última en <code>ultima</code> y calcula el <code>promedio</code> dividiendo <code>sum() / len()</code>.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.2: Listas e Indexación en Geotecnia
# -------------------------------------------------------------
deformaciones = [0.2, 0.5, 0.9, 1.4, 2.2, 2.9, 3.8]

# 1. Obtén la primera lectura (índice 0):
primera = None

# 2. Obtén la última lectura (índice -1):
ultima = None

# 3. Calcula el promedio (suma dividida entre la cantidad):
promedio = None

# Mostramos los resultados
print(f"Primera lectura: {primera} mm")
print(f"Última lectura: {ultima} mm")
print(f"Promedio de deformación: {promedio:.2f} mm" if promedio else "Promedio: pendiente")
`,
        hint: "Completa: `primera = deformaciones[0]`, `ultima = deformaciones[-1]`, y `promedio = sum(deformaciones) / len(deformaciones)`.",
        solution: `deformaciones = [0.2, 0.5, 0.9, 1.4, 2.2, 2.9, 3.8]

primera = deformaciones[0]
ultima = deformaciones[-1]
promedio = sum(deformaciones) / len(deformaciones)

print(f"Primera lectura: {primera} mm")
print(f"Última lectura: {ultima} mm")
print(f"Promedio de deformación: {promedio:.2f} mm")`,
        validator: (output) => output.includes("3.8") && output.includes("1.70")
      },
      {
        id: "m1_l3",
        title: "1.3 Estructuras de Control: Condicionales (if, elif, else)",
        concept: `
          <p>Ahora que dominamos variables y números, podemos <strong>tomar decisiones automáticas</strong> en Python a partir de umbrales físicos medidos por sensores geotécnicos.</p>
          
          <!-- Contenedor del Simulador y Diagrama de Flujo (Esquema de Pizarra) -->
          <div id="conditional-flow-container"></div>

          <p><strong>Estructura General de Sintaxis en Python:</strong></p>
          <div class="code-example-block">
if condicion:
    # Se ejecuta si la condicion es True y sale del bloque (cortocircuito)
elif otra_condicion:
    # Se evalúa únicamente si la condición anterior resultó False
else:
    # Se ejecuta por descarte si ninguna condición previa fue True
          </div>

          <p><strong>Criterio Geotécnico: Factor de Seguridad (FS)</strong></p>
          <p><center><code>FS = Fuerzas Resistentes / Fuerzas Actuantes</code></center></p>
          <ul>
            <li>Si <code>FS &lt; 1.0</code>: 🚨 <strong>Falla Inminente / Inestable</strong> (fuerzas actuantes superan la resistencia cortante).</li>
            <li>Si <code>FS &lt; 1.3</code>: ⚠️ <strong>Alerta / Precaución</strong> (margen de estabilidad crítico ante saturación de agua).</li>
            <li>Si <code>FS &gt;= 1.3</code>: ✅ <strong>Condición Estable</strong> (margen seguro según norma NSR-10).</li>
          </ul>
        `,
        instruction: "Calcula el Factor de Seguridad dividiendo <code>fuerzas_resistentes / fuerzas_actuantes</code> y completa la estructura <code>if / elif / else</code> para clasificar el talud.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.3: Condicionales y Criterio de Alarma
# -------------------------------------------------------------
fuerzas_resistentes = 145.0  # kN/m
fuerzas_actuantes = 120.0    # kN/m

# 1. Calcula el Factor de Seguridad (FS):
fs = None

# 2. Completa la estructura de control para evaluar el talud:
if fs is not None:
    print(f"Factor de Seguridad calculado: {fs:.2f}")
    if fs < 1.0:
        print("Estado: 🚨 INESTABLE (FS < 1.0)")
    elif fs < 1.3:
        print("Estado: ⚠️ ALERTA (1.0 <= FS < 1.3)")
    else:
        print("Estado: ✅ ESTABLE (FS >= 1.3)")
else:
    print("Calcula: fs = fuerzas_resistentes / fuerzas_actuantes")
`,
        hint: "Asigna: `fs = fuerzas_resistentes / fuerzas_actuantes`. El resultado dará aproximadamente 1.21 (Alerta).",
        solution: `fuerzas_resistentes = 145.0
fuerzas_actuantes = 120.0

fs = fuerzas_resistentes / fuerzas_actuantes
print(f"Factor de Seguridad calculado: {fs:.2f}")

if fs < 1.0:
    print("Estado: 🚨 INESTABLE (FS < 1.0)")
elif fs < 1.3:
    print("Estado: ⚠️ ALERTA (1.0 <= FS < 1.3)")
else:
    print("Estado: ✅ ESTABLE (FS >= 1.3)")`,
        validator: (output) => output.includes("1.21") || output.includes("ALERTA")
      },
      {
        id: "m1_l4",
        title: "1.4 Funciones en Python (def): Reutilización de Cálculos",
        concept: `
          <p>Una <strong>función</strong> es un bloque de código que empaqueta una fórmula para reutilizarla con cualquier sensor sin repetir líneas:</p>
          <div class="code-example-block">
def esfuerzo_efectivo(sigma_total, presion_poros):
    """Calcula el esfuerzo efectivo de Terzaghi: σ' = σ - u"""
    sigma_prima = sigma_total - presion_poros
    return sigma_prima
          </div>
          <p>Una vez definida con <code>def</code>, podemos llamarla pasando los valores: <code>esfuerzo_efectivo(429.0, 45.0)</code>.</p>
        `,
        instruction: "Define la función <code>esfuerzo_efectivo(sigma_total, presion_poros)</code> que retorne la resta <code>sigma_total - presion_poros</code>, y pruébala con los valores dados.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.4: Funciones Geotécnicas Reutilizables
# -------------------------------------------------------------
# 1. Completa la función para calcular el esfuerzo efectivo de Terzaghi (σ' = σ - u):
def esfuerzo_efectivo(sigma_total, presion_poros):
    # Escribe aquí la resta y retórnala con return
    pass

# 2. Prueba tu función con las lecturas de Ancón Norte a 22 m de profundidad:
sigma_v = 429.0  # kPa (esfuerzo vertical total)
u = 45.0         # kPa (presión de poros medida por piezómetro)

# sigma_prima = esfuerzo_efectivo(sigma_v, u)
# print(f"Esfuerzo vertical efectivo: {sigma_prima} kPa")
`,
        hint: "Dentro de la función escribe: `return sigma_total - presion_poros`, y luego descomenta las dos últimas líneas.",
        solution: `def esfuerzo_efectivo(sigma_total, presion_poros):
    return sigma_total - presion_poros

sigma_v = 429.0
u = 45.0

sigma_prima = esfuerzo_efectivo(sigma_v, u)
print(f"Esfuerzo vertical efectivo: {sigma_prima} kPa")`,
        validator: (output) => output.includes("384") || output.includes("384.0")
      },
      {
        id: "m1_l5",
        title: "1.5 Bucles con for: Iteración y Aplicación de Funciones",
        concept: `
          <p>En el monitoreo geotécnico, los instrumentos generan <strong>series temporales y colecciones de datos</strong> (ej. deformaciones a lo largo del tiempo o factores de seguridad en distintas secciones de un talud).</p>
          <p>Un <strong>bucle <code>for</code></strong> es la estructura de control que permite recorrer una lista elemento por elemento y <strong>aplicar una función automáticamente a cada dato</strong> sin repetir código a mano:</p>
          <div class="code-example-block">
# Sintaxis fundamental del bucle for:
for elemento in coleccion:
    # Acción que se ejecuta para cada elemento

# Ejemplo: iterar sobre una lista aplicando una función personalizada
for fs in lista_fs:
    estado = clasificar_talud(fs)
    print(f"FS: {fs:.2f} ➔ {estado}")
          </div>
          <p><strong>Tres Técnicas Clave de Iteración:</strong></p>
          <ul>
            <li><strong>Iteración directa:</strong> <code>for valor in lista:</code> recorre los valores secuencialmente.</li>
            <li><strong>Con índice (<code>enumerate</code>):</strong> <code>for i, valor in enumerate(lista, start=1):</code> entrega tanto la posición (sensor o día) como el valor medido.</li>
            <li><strong>Acumulación de resultados:</strong> Usar <code>.append()</code> dentro del bucle para guardar los resultados calculados en una lista nueva.</li>
          </ul>
          <div class="theory-callout" style="margin-top:1rem;">
            🌉 <strong>La Antesala a Pandas (¿Por qué esto nos lleva a la Lección 1.6?):</strong><br>
            Un bucle <code>for</code> es indispensable para entender la lógica de iteración. Sin embargo, cuando un sensor SIATA registra <strong>100.000 lecturas</strong> en una campaña de instrumentación, recorrer fila por fila con un <code>for</code> en Python puro se vuelve lento.<br>
            En la siguiente lección conoceremos <strong>Pandas</strong>, la librería que <em>vectoriza</em> estas operaciones para ejecutarlas sobre series masivas en milisegundos sin necesidad de escribir bucles manuales.
          </div>
        `,
        instruction: "Tienes una serie con 5 factores de seguridad (<code>factores_seguridad</code>) evaluados en distintos sectores del talud. Completa el bucle <code>for</code> para iterar sobre la lista, aplicar la función <code>clasificar_talud(fs)</code> a cada medición e imprimir su resultado.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.5: Bucles for y Aplicación de Funciones
# -------------------------------------------------------------
# Serie de factores de seguridad calculados en 5 perfiles del talud:
factores_seguridad = [1.45, 1.22, 0.88, 1.05, 1.35]

# 1. Función que clasifica cada lectura (reutilizando condicionales):
def clasificar_talud(fs):
    if fs < 1.0:
        return "🚨 INESTABLE"
    elif fs < 1.3:
        return "⚠️ ALERTA"
    else:
        return "✅ ESTABLE"

# 2. Completa el bucle for para iterar aplicando la función:
# for fs in factores_seguridad:
#     estado = clasificar_talud(fs)
#     print(f"FS = {fs:.2f} -> {estado}")
`,
        hint: "Descomenta las tres últimas líneas del bucle 'for fs in factores_seguridad:' asegurando la indentación de 4 espacios. Cada iteración evaluará un factor de seguridad diferente llamando a clasificar_talud(fs).",
        solution: `factores_seguridad = [1.45, 1.22, 0.88, 1.05, 1.35]

def clasificar_talud(fs):
    if fs < 1.0:
        return "🚨 INESTABLE"
    elif fs < 1.3:
        return "⚠️ ALERTA"
    else:
        return "✅ ESTABLE"

for fs in factores_seguridad:
    estado = clasificar_talud(fs)
    print(f"FS = {fs:.2f} -> {estado}")`,
        validator: (output) => output.includes("INESTABLE") && output.includes("ALERTA") && output.includes("ESTABLE") && (output.includes("0.88") || output.includes("1.45"))
      },
      {
        id: "m1_l6",
        title: "1.6 Primeros Pasos con Pandas: DataFrames e Índices",
        concept: `
          <p><strong>Pandas</strong> es la librería por excelencia para el manejo de series temporales. Organiza la información en una tabla bidimensional llamada <strong>DataFrame</strong>.</p>
          <div class="code-example-block">
import pandas as pd

# Cargar CSV asignando la primera columna (fecha) como índice
df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)

print(df.head(3))   # Muestra las 3 primeras filas
print(df.shape)     # Muestra (filas, columnas)
          </div>
        `,
        instruction: "Carga el archivo <code>'df_ancon.csv'</code>, convierte su índice a formato fecha con <code>pd.to_datetime</code> e imprime sus dimensiones con <code>df.shape</code>.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.6: Carga de Series Temporales con Pandas
# -------------------------------------------------------------
import pandas as pd

# 1. Lee el archivo 'df_ancon.csv' con index_col=0:
df = None

# 2. Convierte el índice a formato de fecha:
# df.index = pd.to_datetime(df.index)

# 3. Imprime las dimensiones y las primeras filas:
if df is not None:
    print(f"Dimensiones del DataFrame: {df.shape}")
    print("
Primeras filas del registro de Ancón Norte:")
    print(df.head(3))
else:
    print("Completa: df = pd.read_csv('df_ancon.csv', index_col=0)")
`,
        hint: "Escribe: `df = pd.read_csv('df_ancon.csv', index_col=0)` y luego descomenta la línea de `pd.to_datetime`.",
        solution: `import pandas as pd

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)

print(f"Dimensiones del DataFrame: {df.shape}")
print("
Primeras filas del registro de Ancón Norte:")
print(df.head(3))`,
        validator: (output) => output.includes("798") && output.includes("sh1")
      },
      {
        id: "m1_l7",
        title: "1.7 Filtrado Booleano y Consolidación de Canales",
        concept: `
          <p>Podemos aplicar la lógica condicional que aprendimos en 1.3 para filtrar filas de una tabla: <code>df[df['p'] > umbral]</code>.</p>
          <div class="code-example-block">
# Filtrar días con lluvia registrada
dias_con_lluvia = df[df['p'] > 0]
print(f"Días con lluvia: {len(dias_con_lluvia)}")
          </div>
          <div class="theory-callout">
            💡 <strong>Pregunta Instrumental Geotécnica:</strong><br>
            ¿Por qué el pluviómetro SIATA registra dos canales (<code>p1</code> y <code>p2</code>)? Son dos balancines gemelos en la misma estación para redundancia. Si hojas o sedimentos atascan uno, el otro sigue midiendo. Se toma <code>max(p1, p2)</code> para consolidar la lluvia.
          </div>
        `,
        instruction: "Carga el dataset y filtra los días con <strong>precipitación intensa mayor a 15.0 mm/día</strong>. Cuenta cuántos días superaron este umbral usando <code>len()</code>.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.7: Filtrado de Lluvia Detonante
# -------------------------------------------------------------
import pandas as pd

df = pd.read_csv('df_ancon.csv', index_col=0)

# 1. Filtra los días donde la columna 'p' sea mayor a 15.0:
lluvia_intensa = None

# 2. Imprime la cantidad de días encontrados:
if lluvia_intensa is not None:
    print(f"Días con lluvia > 15 mm/día: {len(lluvia_intensa)}")
    print("
Ejemplo de eventos intensos:")
    print(lluvia_intensa[['p', 'DE1']].head(4))
else:
    print("Aplica el filtro: lluvia_intensa = df[df['p'] > 15.0]")
`,
        hint: "Asigna: `lluvia_intensa = df[df['p'] > 15.0]`.",
        solution: `import pandas as pd

df = pd.read_csv('df_ancon.csv', index_col=0)
lluvia_intensa = df[df['p'] > 15.0]

print(f"Días con lluvia > 15 mm/día: {len(lluvia_intensa)}")
print("
Ejemplo de eventos intensos:")
print(lluvia_intensa[['p', 'DE1']].head(4))`,
        validator: (output) => output.includes("Días con lluvia > 15 mm/día:") && !output.includes("None")
      }
    ]
  },

  // =========================================================================
  // SECCIÓN 2: MÓDULO 2 - VISUALIZACIÓN DE SENSORES CON MATPLOTLIB
  // =========================================================================
  modulo2: {
    id: "modulo2",
    title: "Módulo 2: Visualización de Sensores Geotécnicos",
    subtitle: "Series Temporales, Boxplots, Zonas de Alerta y Doble Eje",
    lessons: [
      {
        id: "m2_l1",
        title: "2.1 Gráfica de Línea de Precipitación Diaria",
        concept: `
          <p>Para crear un gráfico con <strong>Matplotlib</strong>, usamos <code>plt.plot(x, y)</code>, añadimos etiquetas y mostramos la figura con <code>plt.show()</code>:</p>
          <div class="code-example-block">
import matplotlib.pyplot as plt

plt.figure(figsize=(9, 4))
plt.plot(df.index, df['p'], color='royalblue', label='Lluvia (p)')
plt.title('Precipitación Diaria')
plt.xlabel('Fecha')
plt.ylabel('Precipitación (mm/día)')
plt.grid(True)
plt.show()
          </div>
          <div class="theory-callout">
            📌 <strong>Contexto Geotécnico de Ancón Norte:</strong><br>
            Las perforaciones e inclinómetros identificaron superficies de falla a <strong>11 m, 16 m y 22 m</strong> de profundidad. La lluvia que estamos graficando es el agente que se infiltra hasta estas profundidades.
          </div>
        `,
        instruction: "Grafica la columna de lluvia <code>df['p']</code> en función del tiempo, añade el título <code>'Precipitación Diaria - Ancón Norte'</code> y llama a <code>plt.show()</code>.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 2.1: Gráfico de Línea con Matplotlib
# -------------------------------------------------------------
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)

plt.figure(figsize=(9, 3.8))

# 1. Escribe la instrucción plt.plot con el índice y la columna 'p':
# plt.plot(..., color='royalblue', label='Precipitación')

# 2. Configura título y etiquetas:
plt.title('Precipitación Diaria - Ancón Norte', fontweight='bold')
plt.xlabel('Fecha')
plt.ylabel('Precipitación (mm/día)')
plt.grid(True, linestyle='--', alpha=0.5)

# 3. Muestra la gráfica:
# plt.show()
`,
        hint: "Descomenta `plt.plot(df.index, df['p'], color='royalblue', label='Precipitación')` y `plt.show()`.",
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)

plt.figure(figsize=(9, 3.8))
plt.plot(df.index, df['p'], color='royalblue', label='Precipitación')
plt.title('Precipitación Diaria - Ancón Norte', fontweight='bold')
plt.xlabel('Fecha')
plt.ylabel('Precipitación (mm/día)')
plt.grid(True, linestyle='--', alpha=0.5)
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m2_l2",
        title: "2.2 Boxplot del Extensómetro y Umbrales de Outliers",
        concept: `
          <p>Un <strong>boxplot (diagrama de caja)</strong> resume la distribución estadística:</p>
          <ul>
            <li><strong>Caja:</strong> Rango intercuartílico (IQR = Q3 - Q1), donde está el 50% central de los días.</li>
            <li><strong>Límite superior:</strong> <code>Q3 + 1.5 * IQR</code>. Todo punto por encima es un <strong>outlier</strong> (aceleración inusual de la grieta).</li>
          </ul>
          <div class="code-example-block">
deformaciones = df[df['DE1'] > 0]['DE1']
plt.boxplot(deformaciones)
plt.show()
          </div>
        `,
        instruction: "Filtra los días con deformación activa (`DE1 > 0`), calcula el límite superior de alerta (`Q3 + 1.5 * IQR`) e imprime su valor antes de graficar el boxplot.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 2.2: Boxplot del Extensómetro
# -------------------------------------------------------------
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
deformacion_activa = df[df['DE1'] > 0]['DE1']

# 1. Calcula Q1, Q3 y el rango intercuartílico (IQR):
q1 = deformacion_activa.quantile(0.25)
q3 = deformacion_activa.quantile(0.75)
iqr = q3 - q1

# 2. Calcula el límite superior de alerta (Q3 + 1.5 * IQR):
limite_alerta = None

print(f"Límite superior de alerta: {limite_alerta:.3f} mm" if limite_alerta else "Calcula limite_alerta")

# 3. Grafica el boxplot:
plt.figure(figsize=(5, 4))
plt.boxplot(deformacion_activa, patch_artist=True)
plt.title('Boxplot de Deformación Diaria (DE1 > 0)')
plt.ylabel('Deformación (mm/día)')
plt.show()
`,
        hint: "Escribe: `limite_alerta = q3 + 1.5 * iqr`.",
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
deformacion_activa = df[df['DE1'] > 0]['DE1']

q1 = deformacion_activa.quantile(0.25)
q3 = deformacion_activa.quantile(0.75)
iqr = q3 - q1
limite_alerta = q3 + 1.5 * iqr

print(f"Límite superior de alerta: {limite_alerta:.3f} mm")

plt.figure(figsize=(5, 4))
plt.boxplot(deformacion_activa, patch_artist=True)
plt.title('Boxplot de Deformación Diaria (DE1 > 0)')
plt.ylabel('Deformación (mm/día)')
plt.show()`,
        validator: (output, hasPlot) => output.includes("Límite superior de alerta") && hasPlot
      },
      {
        id: "m2_l3",
        title: "2.3 Semáforo de Alerta con Zonas Coloreadas",
        concept: `
          <p>Podemos colorear el fondo de una serie de tiempo con <code>plt.axhspan(y_min, y_max, color=..., alpha=...)</code> para crear un semáforo visual de alerta geotécnica:</p>
          <ul>
            <li>🟢 Verde (Normal): Entre Q1 y Q3.</li>
            <li>🟠 Naranja (Precaución): Entre cuartiles y bigotes.</li>
            <li>🔴 Rojo (Alerta Crítica): Valores que superan el límite del boxplot.</li>
          </ul>
        `,
        instruction: "Colorea la zona de alerta crítica superior en rojo (desde `limite_superior` hasta el máximo de humedad) usando `plt.axhspan`.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 2.3: Zonas Coloreadas de Alerta Temprana
# -------------------------------------------------------------
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)
humedad = df['sh1'].dropna()

q1 = humedad.quantile(0.25)
q3 = humedad.quantile(0.75)
iqr = q3 - q1
lim_sup = q3 + 1.5 * iqr

plt.figure(figsize=(10, 4))

# Zona Normal
plt.axhspan(q1, q3, color='forestgreen', alpha=0.25, label='Normal (Q1-Q3)')

# 1. Agrega la zona roja de alerta crítica usando axhspan:
# plt.axhspan(lim_sup, humedad.max(), color='red', alpha=0.3, label='Alerta Crítica')

# Graficar la serie
plt.plot(humedad.index, humedad, color='navy', label='Humedad del Suelo')
plt.title('Sensor de Humedad con Zonas de Alerta')
plt.ylabel('Humedad (%)')
plt.legend()
plt.show()
`,
        hint: "Descomenta la línea `plt.axhspan(lim_sup, humedad.max(), color='red', alpha=0.3, label='Alerta Crítica')`.",
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)
humedad = df['sh1'].dropna()

q1 = humedad.quantile(0.25)
q3 = humedad.quantile(0.75)
iqr = q3 - q1
lim_sup = q3 + 1.5 * iqr

plt.figure(figsize=(10, 4))
plt.axhspan(q1, q3, color='forestgreen', alpha=0.25, label='Normal (Q1-Q3)')
plt.axhspan(lim_sup, humedad.max(), color='red', alpha=0.3, label='Alerta Crítica')
plt.plot(humedad.index, humedad, color='navy', label='Humedad del Suelo')
plt.title('Sensor de Humedad con Zonas de Alerta')
plt.ylabel('Humedad (%)')
plt.legend()
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m2_l4",
        title: "2.4 Remuestreo y Gráfica de Doble Eje (Lluvia Invertida)",
        concept: `
          <div class="theory-callout">
            ⚖️ <strong>Regla Geotécnica de Remuestreo:</strong><br>
            La lluvia se <strong>suma ('sum')</strong> porque es acumulativa, mientras que la humedad se <strong>promedia ('mean')</strong> porque representa un estado instantáneo.
          </div>
          <p>En ingeniería geológica, graficamos la lluvia en el eje superior derecho invertido (<code>ax2.invert_yaxis()</code>) para observar cómo cada aguacero impacta la humedad del terreno en el eje primario.</p>
        `,
        instruction: "Completa el remuestreo semanal de lluvia y humedad, y activa la inversión del eje Y con <code>ax2.invert_yaxis()</code>.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 2.4: Gráfica de Doble Eje con Lluvia Invertida
# -------------------------------------------------------------
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)

# 1. Remuestreo semanal:
df_sem = df.resample('1W').agg({'p': 'sum', 'sh1': 'mean'}).dropna()

fig, ax1 = plt.subplots(figsize=(10, 4))

# Eje 1 (Humedad):
ax1.plot(df_sem.index, df_sem['sh1'], color='darkblue', linewidth=2, label='Humedad (%)')
ax1.set_ylabel('Humedad (%)', color='darkblue')

# Eje 2 (Lluvia Invertida):
ax2 = ax1.twinx()
ax2.bar(df_sem.index, df_sem['p'], width=4, color='royalblue', alpha=0.4, label='Lluvia')
ax2.set_ylabel('Lluvia (mm/sem)', color='royalblue')

# 2. Invierte el eje de la lluvia para que caiga desde arriba:
# ax2.invert_yaxis()

plt.title('Relación Precipitación vs. Humedad a Escala Semanal')
plt.show()
`,
        hint: "Descomenta `ax2.invert_yaxis()`.",
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)

df_sem = df.resample('1W').agg({'p': 'sum', 'sh1': 'mean'}).dropna()

fig, ax1 = plt.subplots(figsize=(10, 4))
ax1.plot(df_sem.index, df_sem['sh1'], color='darkblue', linewidth=2)
ax1.set_ylabel('Humedad (%)', color='darkblue')

ax2 = ax1.twinx()
ax2.bar(df_sem.index, df_sem['p'], width=4, color='royalblue', alpha=0.4)
ax2.set_ylabel('Lluvia (mm/sem)', color='royalblue')
ax2.invert_yaxis()

plt.title('Relación Precipitación vs. Humedad a Escala Semanal')
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      }
    ]
  },

  // =========================================================================
  // SECCIÓN 3: MÓDULO 3 - ANÁLISIS TEMPORAL Y FEATURE ENGINEERING
  // =========================================================================
  modulo3: {
    id: "modulo3",
    title: "Módulo 3: Análisis Temporal y Feature Engineering",
    subtitle: "Interpolación, Lluvia Antecedente, Velocidad y Retardo de Infiltración",
    lessons: [
      {
        id: "m3_l1",
        title: "3.1 Diagnóstico de Datos Faltantes e Interpolación Lineal",
        concept: `
          <p>Los sensores sufren caídas de telemetría o baterías agotadas. 
          Nunca debemos borrar los registros con <code>dropna()</code> porque perderíamos semanas completas de monitoreo.</p>
          <p>Para rellenar huecos puntuales de pocos días en la sonda de humedad, aplicamos <strong>interpolación lineal</strong>:</p>
          <div class="code-example-block">
df['sh1'] = df['sh1'].interpolate(method='linear')
          </div>
        `,
        instruction: "Aplica <code>.interpolate(method='linear')</code> sobre la columna <code>df_activo['sh1']</code> y comprueba que los valores nulos se reduzcan a cero.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 3.1: Interpolación de Datos Faltantes
# -------------------------------------------------------------
import pandas as pd

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)

# Periodo coactivo con todos los sensores instalados
df_activo = df.loc['2020-03-24':].copy()

nulos_antes = df_activo['sh1'].isnull().sum()
print(f"Valores nulos en sh1 antes de interpolar: {nulos_antes}")

# 1. Aplica interpolación lineal:
# df_activo['sh1'] = df_activo['sh1'].interpolate(method='linear').bfill().ffill()

nulos_despues = df_activo['sh1'].isnull().sum()
print(f"Valores nulos después de interpolar: {nulos_despues}")
`,
        hint: "Descomenta la línea que usa `.interpolate(method='linear').bfill().ffill()`.",
        solution: `import pandas as pd

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)
df_activo = df.loc['2020-03-24':].copy()

print("Antes:", df_activo['sh1'].isnull().sum())
df_activo['sh1'] = df_activo['sh1'].interpolate(method='linear').bfill().ffill()
print("Valores nulos después de interpolar:", df_activo['sh1'].isnull().sum())`,
        validator: (output) => output.includes("después de interpolar: 0")
      },
      {
        id: "m3_l2",
        title: "3.2 Feature Engineering: Lluvia Antecedente Móvil (30 días)",
        concept: `
          <p>Los movimientos en masa en zonas de ladera responden a la <strong>lluvia antecedente</strong> (agua acumulada en las semanas previas que satura el suelo y eleva la presión de poros).</p>
          <p>Usamos <code>df['p'].rolling(window=30).sum()</code> para calcular el acumulado móvil en ventana de 30 días.</p>
        `,
        instruction: "Calcula la lluvia antecedente móvil a 30 días en la columna <code>df_activo['lluvia_30d']</code> y grafica su evolución.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 3.2: Lluvia Antecedente Móvil a 30 días
# -------------------------------------------------------------
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)
df_activo = df.loc['2020-03-24':].copy()

# 1. Calcula la lluvia móvil de 30 días con .rolling(window=30, min_periods=1).sum():
df_activo['lluvia_30d'] = None

if df_activo['lluvia_30d'] is not None:
    print(f"Máxima lluvia antecedente de 30 días: {df_activo['lluvia_30d'].max():.1f} mm")
    
    plt.figure(figsize=(9, 3.8))
    plt.plot(df_activo.index, df_activo['lluvia_30d'], color='navy', label='Lluvia 30d (mm)')
    plt.title('Evolución de la Lluvia Antecedente Móvil (30 días)')
    plt.ylabel('Precipitación 30d (mm)')
    plt.legend()
    plt.grid(True, alpha=0.4)
    plt.show()
else:
    print("Completa: df_activo['lluvia_30d'] = df_activo['p'].rolling(30, min_periods=1).sum()")
`,
        hint: "Asigna: `df_activo['lluvia_30d'] = df_activo['p'].rolling(30, min_periods=1).sum()`.",
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)
df_activo = df.loc['2020-03-24':].copy()

df_activo['lluvia_30d'] = df_activo['p'].rolling(30, min_periods=1).sum()
print(f"Máxima lluvia antecedente de 30 días: {df_activo['lluvia_30d'].max():.1f} mm")

plt.figure(figsize=(9, 3.8))
plt.plot(df_activo.index, df_activo['lluvia_30d'], color='navy')
plt.title('Lluvia Antecedente Móvil (30 días)')
plt.show()`,
        validator: (output, hasPlot) => output.includes("Máxima lluvia antecedente") && hasPlot
      },
      {
        id: "m3_l3",
        title: "3.3 Velocidad de Deformación con .diff()",
        concept: `
          <p>La <strong>velocidad de apertura de grietas</strong> ($\Delta DE1 / \Delta t$) indica la aceleración del talud. En Pandas se calcula con la primera diferencia discreta: <code>.diff()</code>.</p>
          <div class="code-example-block">
df['velocidad'] = df['DE1'].diff()  # mm/día
          </div>
          <p>Según el <strong>Método de la Velocidad Inversa (Fukuzono)</strong>, a medida que un talud se acerca a la rotura catastrófica, su velocidad se dispara hacia el infinito.</p>
        `,
        instruction: "Calcula la velocidad diaria de apertura de grieta usando <code>df_activo['DE1'].diff()</code> e identifica la velocidad máxima.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 3.3: Tasa de Deformación (Velocidad)
# -------------------------------------------------------------
import pandas as pd

df = pd.read_csv('df_ancon.csv', index_col=0)
df_activo = df.loc['2020-03-24':].copy()

# 1. Calcula la velocidad diaria con .diff():
tasa_deformacion = None

if tasa_deformacion is not None:
    max_vel = tasa_deformacion.max()
    print(f"Velocidad máxima de apertura registrada: {max_vel:.3f} mm/día")
else:
    print("Calcula: tasa_deformacion = df_activo['DE1'].diff()")
`,
        hint: "Asigna: `tasa_deformacion = df_activo['DE1'].diff()`.",
        solution: `import pandas as pd

df = pd.read_csv('df_ancon.csv', index_col=0)
df_activo = df.loc['2020-03-24':].copy()

tasa_deformacion = df_activo['DE1'].diff()
print(f"Velocidad máxima de apertura registrada: {tasa_deformacion.max():.3f} mm/día")`,
        validator: (output) => output.includes("Velocidad máxima de apertura registrada:") && !output.includes("None")
      },
      {
        id: "m3_l4",
        title: "3.4 Correlación Rezagada (Lag Correlation)",
        concept: `
          <p>¿Cuántos días tarda el agua de lluvia en infiltrarse y humedecer el perfil del suelo?
          Para averiguarlo, calculamos la correlación de Pearson desplazando temporalmente la lluvia con <code>df['p'].shift(lag)</code> para diferentes días de retardo (*lags*).</p>
          <p>El día que alcanza el <strong>pico de máxima correlación positiva</strong> corresponde al <strong>tiempo de percolación / infiltración</strong> del frente húmedo.</p>
        `,
        instruction: "Calcula la correlación entre humedad y lluvia para lags de -10 a +10 días y encuentra el retardo óptimo.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 3.4: Correlación Rezagada (Tiempo de Infiltración)
# -------------------------------------------------------------
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df_activo = df.loc['2020-03-24':].interpolate().bfill().ffill()

lags = range(-10, 11)
# 1. Calcula la correlación para cada desfase temporal:
corrs = [df_activo['sh1'].corr(df_activo['p'].shift(lag)) for lag in lags]

# 2. Encuentra el lag del pico máximo:
mejor_lag = list(lags)[np.argmax(corrs)]
max_r = max(corrs)

print(f"Máxima correlación alcanzada: r = {max_r:.3f} en lag = {mejor_lag} días")

# 3. Grafica el correlograma:
plt.figure(figsize=(8, 3.5))
plt.plot(lags, corrs, marker='o', color='teal')
plt.axvline(mejor_lag, color='crimson', linestyle='--', label=f'Pico: {mejor_lag} días')
plt.title('Correlación Rezagada: Lluvia vs. Humedad')
plt.xlabel('Lag (días)')
plt.ylabel('Correlación (r)')
plt.legend()
plt.grid(True, alpha=0.5)
plt.show()
`,
        hint: "Ejecuta el código para observar en cuántos días de desfase ocurre el pico de infiltración en Ancón Norte.",
        solution: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df_activo = df.loc['2020-03-24':].interpolate().bfill().ffill()

lags = range(-10, 11)
corrs = [df_activo['sh1'].corr(df_activo['p'].shift(lag)) for lag in lags]
mejor_lag = list(lags)[np.argmax(corrs)]
max_r = max(corrs)

print(f"Máxima correlación alcanzada: r = {max_r:.3f} en lag = {mejor_lag} días")

plt.figure(figsize=(8, 3.5))
plt.plot(lags, corrs, marker='o', color='teal')
plt.axvline(mejor_lag, color='crimson', linestyle='--')
plt.title('Correlación Rezagada')
plt.show()`,
        validator: (output, hasPlot) => output.includes("Máxima correlación") && hasPlot
      }
    ]
  },

  // =========================================================================
  // SECCIÓN 4: SANDBOX / LABORATORIO LIBRE
  // =========================================================================
  sandbox: {
    id: "sandbox",
    title: "Laboratorio Libre Geotécnico (Sandbox)",
    subtitle: "Espacio de Experimentación Abierto con los Datos de Ancón Norte",
    description: `
      <p>En este laboratorio puedes escribir cualquier script de Python para probar tus propias hipótesis o crear nuevas visualizaciones.</p>
      <div class="theory-callout">
        📁 <strong>Archivo disponible:</strong> <code>df_ancon.csv</code> con columnas <code>['sh1', 'p', 'C1', 'B1', 'Tem_1', 'DE1']</code> y fecha como índice.
      </div>
    `,
    initialCode: `# -------------------------------------------------------------
# LABORATORIO LIBRE: Experimenta con los datos de Ancón Norte
# -------------------------------------------------------------
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('df_ancon.csv', index_col=0)
df.index = pd.to_datetime(df.index)

# Explora las estadísticas generales:
print("Resumen estadístico de los sensores de Ancón Norte:")
print(df.describe())

# ¡Escribe tu propio código aquí abajo!
`
  }
};
