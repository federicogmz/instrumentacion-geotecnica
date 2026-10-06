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
          
          <!-- Contenedor Interactivo de Indexación y Slicing (Esquema de Pizarra) -->
          <div id="list-indexing-container"></div>
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
          
          <!-- Contenedor Interactivo de Anatomía de Funciones (Esquema de Pizarra) -->
          <div id="function-anatomy-container"></div>
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
          
          <!-- Contenedor Interactivo de Bucles for (Esquema de Pizarra y Cinta) -->
          <div id="for-loop-container"></div>
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
        title: "1.6 Primeros Pasos con Pandas: DataFrames e Índices Pluviométricos",
        concept: `
          <p>Habiendo completado la Clase 1 de <strong>Lluvia y Monitoreo Hidrometeorológico</strong>, abordamos el procesamiento computacional de las estaciones pluviométricas. Una estación de balancines tipo SIATA genera cientos de miles de registros continuos (cada 5 minutos). Con bucles <code>for</code> manuales el análisis sería lento e ineficiente. Aquí entra <strong>Pandas</strong>, la librería estándar en geotecnia para organizar series temporales en tablas bidimensionales llamadas <strong>DataFrames</strong> indexadas en el tiempo (<code>DatetimeIndex</code>).</p>
          
          <!-- Contenedor Interactivo de Anatomía de DataFrame (Pluviómetros) -->
          <div id="dataframe-anatomy-container"></div>
          <div class="code-example-block">
import pandas as pd

# Cargar serie de tiempo del pluviómetro (fecha como índice)
df_lluvia = pd.read_csv('pluviometro.csv', index_col=0)
df_lluvia.index = pd.to_datetime(df_lluvia.index)

print(df_lluvia.head(3))   # Muestra las 3 primeras lecturas (canales p1 y p2)
print(df_lluvia.shape)     # (229345, 2) -> (filas temporales, canales de balancín)
          </div>
          <div class="theory-callout">
            💡 <strong>Conexión con Clase 1 (Lluvia):</strong><br>
            A este nivel no utilizamos aún <code>df_ancon.csv</code> porque esa tabla integrada se construye a partir de los sensores individuales. Comenzamos directamente con <code>pluviometro.csv</code> para analizar las lecturas crudas de precipitación.
          </div>
        `,
        instruction: "Carga la serie del pluviómetro <code>'pluviometro.csv'</code> asignando la fecha como índice (<code>index_col=0</code>), convierte el índice a fechas con <code>pd.to_datetime</code> e imprime sus dimensiones con <code>df_lluvia.shape</code> y sus 3 primeras filas con <code>df_lluvia.head(3)</code>.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.6: Carga de Series Temporales con Pandas (Pluviómetro)
# -------------------------------------------------------------
import pandas as pd

# 1. Lee el archivo 'pluviometro.csv' con index_col=0:
df_lluvia = None

# 2. Convierte el índice a formato de fecha:
# df_lluvia.index = pd.to_datetime(df_lluvia.index)

# 3. Imprime las dimensiones y las primeras filas:
if df_lluvia is not None:
    print(f"Dimensiones del registro de lluvia: {df_lluvia.shape}")
    print("\\nPrimeras lecturas del pluviómetro (canales p1 y p2):")
    print(df_lluvia.head(3))
else:
    print("Completa: df_lluvia = pd.read_csv('pluviometro.csv', index_col=0)")
`,
        hint: "Escribe: `df_lluvia = pd.read_csv('pluviometro.csv', index_col=0)` y luego descomenta `df_lluvia.index = pd.to_datetime(df_lluvia.index)`.",
        solution: `import pandas as pd

df_lluvia = pd.read_csv('pluviometro.csv', index_col=0)
df_lluvia.index = pd.to_datetime(df_lluvia.index)

print(f"Dimensiones del registro de lluvia: {df_lluvia.shape}")
print("\\nPrimeras lecturas del pluviómetro (canales p1 y p2):")
print(df_lluvia.head(3))`,
        validator: (output) => output.includes("p1") && output.includes("p2") && (output.includes("229345") || output.includes("Dimensiones del registro de lluvia:"))
      },
      {
        id: "m1_l7",
        title: "1.7 Filtrado Booleano y Consolidación de Canales de Lluvia",
        concept: `
          <p>En instrumentación geotécnica, la estación pluviométrica SIATA dispone de balancines gemelos (<code>p1</code> y <code>p2</code>) para redundancia física: si un embudo se obstruye con hojas o sedimentos, el balancín hermano continúa midiendo. Consolidamos la lluvia representativa tomando el máximo: <code>df['p'] = df[['p1', 'p2']].max(axis=1)</code>.</p>
          
          <p>Dado que la mayor parte del tiempo no llueve, aplicamos la lógica condicional aprendida en 1.3 mediante <strong>filtrado booleano</strong> vectorizado: <code>df[df['p'] > 0]</code>.</p>
          
          <!-- Contenedor Interactivo de Filtrado Booleano (Tamiz Pluviométrico) -->
          <div id="boolean-filter-container"></div>
          <div class="code-example-block">
# 1. Consolidar canal representativo de balancines gemelos
df['p'] = df[['p1', 'p2']].max(axis=1)

# 2. Filtrar intervalos donde hubo lluvia activa (descartar ceros)
lluvia_activa = df[df['p'] > 0]
print(f"Registros con lluvia: {len(lluvia_activa)}")
          </div>
        `,
        instruction: "Carga <code>'pluviometro.csv'</code>, consolida el canal representativo como <code>df['p'] = df[['p1', 'p2']].max(axis=1)</code>, filtra los intervalos con precipitación activa (<code>df['p'] > 0</code>) y cuenta cuántos registros registraron lluvia con <code>len()</code>.",
        initialCode: `# -------------------------------------------------------------
# EJERCICIO 1.7: Consolidación y Filtrado de Lluvia Activa
# -------------------------------------------------------------
import pandas as pd

df = pd.read_csv('pluviometro.csv', index_col=0)
df.index = pd.to_datetime(df.index)

# 1. Consolida la columna representativa 'p' con el máximo de p1 y p2:
df['p'] = None

# 2. Filtra los intervalos donde la lluvia 'p' sea mayor a 0:
lluvia_activa = None

# 3. Imprime la cantidad de registros encontrados y un vistazo:
if lluvia_activa is not None and df['p'] is not None:
    print(f"Registros con lluvia activa: {len(lluvia_activa)}")
    print("\\nPrimeros eventos registrados:")
    print(lluvia_activa[['p1', 'p2', 'p']].head(4))
else:
    print("Define: df['p'] = df[['p1', 'p2']].max(axis=1) y lluvia_activa = df[df['p'] > 0]")
`,
        hint: "Asigna: `df['p'] = df[['p1', 'p2']].max(axis=1)` y luego `lluvia_activa = df[df['p'] > 0]`.",
        solution: `import pandas as pd

df = pd.read_csv('pluviometro.csv', index_col=0)
df.index = pd.to_datetime(df.index)

df['p'] = df[['p1', 'p2']].max(axis=1)
lluvia_activa = df[df['p'] > 0]

print(f"Registros con lluvia activa: {len(lluvia_activa)}")
print("\\nPrimeros eventos registrados:")
print(lluvia_activa[['p1', 'p2', 'p']].head(4))`,
        validator: (output) => output.includes("Registros con lluvia activa:") && !output.includes("None") && output.includes("p")
      },
      {
        id: "m1_l8",
        title: "1.8 🏆 Reto Integrador: Concatenación y Exploración Multisensores",
        concept: `
          <p>Para cerrar el <strong>Módulo 1</strong>, integramos las series temporales de los sensores geotécnicos e hidrometeorológicos instalados en Ancón Norte estudiados hasta el momento:</p>
          <ul>
            <li>🌧️ <strong>Pluviómetro</strong> (<code>pluviometro.csv</code>): precipitación superficial detonante (<code>p1, p2</code>).</li>
            <li>💧 <strong>Sonda de Humedad</strong> (<code>humedad.csv</code>): contenido volumétrico de agua en suelo (<code>sh1</code>), registrando el avance del frente de infiltración.</li>
            <li>📏 <strong>Extensómetro</strong> (<code>extensometro.csv</code>): apertura milimétrica de grieta de tracción en corona (<code>DE1</code>).</li>
          </ul>
          
          <div class="theory-callout">
            ⚠️ <strong>Decisión Metodológica:</strong><br>
            En esta fase inicial nos enfocamos exclusivamente en los sensores hidro-mecánicos primarios (lluvia, humedad e inicio de deformación superficial). Por esta razón, <strong>no evaluaremos el acelerómetro/inclinómetro</strong> en este módulo (sus ángulos de cabeceo y balanceo se abordarán más adelante al estudiar deformaciones profundas).
          </div>
          
          <!-- Contenedor Interactivo de Fusión y Concatenación Multisensores -->
          <div id="sensor-concat-container"></div>
          
          <div class="code-example-block">
# Concatenación multivariada alineando automáticamente por DatetimeIndex:
df_ladera = pd.concat([df_pluv, df_hum, df_ext], axis=1)

print(df_ladera.shape)      # (filas totales x canales combinados)
print(df_ladera.describe()) # Estadísticas descriptivas de todos los sensores
          </div>
        `,
        instruction: "Carga las series de <code>'pluviometro.csv'</code>, <code>'humedad.csv'</code> y <code>'extensometro.csv'</code> definiendo su primera columna como índice y convirtiéndola a fechas con <code>pd.to_datetime</code>. Concatena los DataFrames con <code>pd.concat([df_pluv, df_hum, df_ext], axis=1)</code> e imprime las dimensiones totales con <code>df_ladera.shape</code> y el resumen estadístico con <code>df_ladera.describe()</code>.",
        initialCode: `# -------------------------------------------------------------
# RETO INTEGRADOR MÓDULO 1: Concatenación y Exploración de Sensores
# -------------------------------------------------------------
import pandas as pd

# 1. Cargar las 3 series de tiempo hidro-mecánicas (sin evaluar acelerómetro):
df_pluv = pd.read_csv('pluviometro.csv', index_col=0)
df_pluv.index = pd.to_datetime(df_pluv.index)

df_hum = pd.read_csv('humedad.csv', index_col=0)
df_hum.index = pd.to_datetime(df_hum.index)

df_ext = pd.read_csv('extensometro.csv', index_col=0)
df_ext.index = pd.to_datetime(df_ext.index)

# 2. Concatena los DataFrames por columnas (axis=1):
df_ladera = None

# 3. Explora el DataFrame integrado de monitoreo:
if df_ladera is not None:
    print(f"Dimensiones del monitoreo integrado: {df_ladera.shape}")
    print("\\nColumnas integradas:", list(df_ladera.columns))
    print("\\nResumen estadístico de los sensores de ladera:")
    print(df_ladera.describe().round(2))
else:
    print("Completa: df_ladera = pd.concat([df_pluv, df_hum, df_ext], axis=1)")
`,
        hint: "Escribe: `df_ladera = pd.concat([df_pluv, df_hum, df_ext], axis=1)`.",
        solution: `import pandas as pd

df_pluv = pd.read_csv('pluviometro.csv', index_col=0)
df_pluv.index = pd.to_datetime(df_pluv.index)

df_hum = pd.read_csv('humedad.csv', index_col=0)
df_hum.index = pd.to_datetime(df_hum.index)

df_ext = pd.read_csv('extensometro.csv', index_col=0)
df_ext.index = pd.to_datetime(df_ext.index)

df_ladera = pd.concat([df_pluv, df_hum, df_ext], axis=1)

print(f"Dimensiones del monitoreo integrado: {df_ladera.shape}")
print("\\nColumnas integradas:", list(df_ladera.columns))
print("\\nResumen estadístico de los sensores de ladera:")
print(df_ladera.describe().round(2))`,
        validator: (output) => output.includes("Dimensiones del monitoreo integrado:") && output.includes("sh1") && output.includes("DE1") && (output.includes("p1") || output.includes("p2"))
      }
    ]
  },

  // =========================================================================
  // SECCIÓN 2: MÓDULO 2 - VISUALIZACIÓN DE SENSORES CON MATPLOTLIB
  // =========================================================================
  modulo2: {
    id: "modulo2",
    title: "Módulo 2: Visualización de Sensores Geotécnicos",
    subtitle: "Series Temporales, Subplots, Ejes Gemelos y Umbrales de Alerta",
    lessons: [
      {
        id: "m2_l1",
        title: "2.1 Fundamentos de Matplotlib y Automatización de Gráficas de Sensores",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con el Módulo 1</div>
            <p style="margin: 0 0 0.5rem 0;">
              En el Módulo 1 aprendiste a compilar la matriz maestra <code>df_ancon</code> y exploraste sus resúmenes numéricos con <code>.describe()</code>.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Sin embargo, <strong>el resumen estadístico numérico es ciego a la evolución temporal</strong>: no nos dice cuándo inician los registros de cada instrumento, qué forma tienen las tormentas ni cómo fluctúan las variables a lo largo de los meses.
            </p>
            <p style="margin: 0;">
              Para interpretar con rigor el comportamiento de la ladera de <strong>Ancón Norte</strong>, primero debemos dominar la estructura gráfica de <strong>Matplotlib</strong> y luego automatizar la visualización de todos los sensores mediante funciones modulares y bucles.
            </p>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Anatomía Estructural de una Figura en Matplotlib</h4>
          <p>
            Una figura científica no se dibuja en un solo bloque monolítico: cada llamada de Python añade una capa gráfica sobre el marco de trabajo.
          </p>

          <!-- Simulador Interactivo de Matplotlib (Lienzo Grande Paso a Paso) -->
          <div id="matplotlib-anatomy-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. Automatización Multisensores con Funciones y Bucles</h4>
          <p>
            En lugar de duplicar 15 líneas de código por cada instrumento, combinamos una <strong>función modular</strong> con un <strong>bucle <code>for</code></strong> tradicional para recorrer la lista de canales de Ancón Norte: <code>['p1', 'sh1', 'C1', 'B1', 'DE1']</code>.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 0.85rem; margin: 1rem 0;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-primary); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-primary);">1. La Función Modular (<code>grafica(sensor)</code>)</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Encapsula la configuración del lienzo (<code>figsize=(9, 4)</code>), el trazado de la serie (<code>df[sensor]</code>), el título en negrilla, las etiquetas de ejes, la leyenda y la cuadrícula punteada.
              </p>
              <code style="font-size: 0.78rem;">def grafica(sensor): ...</code>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-cyan); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-cyan);">2. El Bucle de Recorrido</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Itera secuencialmente sobre la lista de sensores para desplegar la evolución temporal de cada instrumento por separado:
              </p>
              <code style="font-size: 0.78rem;">for sensor in lista_sensores:<br>&nbsp;&nbsp;grafica(sensor)</code>
            </div>
          </div>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Automatización de Series Temporales</strong><br>
            En el editor interactivo inferior definirás la función modular <code>grafica(sensor)</code> y la ejecutarás mediante un bucle <code>for</code> tradicional sobre la lista <code>['p1', 'sh1', 'C1', 'B1', 'DE1']</code> para generar las series temporales de todos los sensores.
          </div>
        `,
        instruction: "1. En el editor inferior, define la función modular <code>grafica(sensor)</code> que configure el lienzo (9x4 pulgadas), trace la serie temporal <code>df_ancon[sensor]</code> con ancho de línea 0.8, asigne título en negrilla, rotule los ejes 'Fecha' y el nombre del sensor, agregue leyenda en la esquina superior izquierda, cuadrícula punteada y despliegue con <code>plt.show()</code>.<br>2. Escribe un bucle <code>for</code> tradicional que recorra secuencialmente la lista de sensores <code>['p1', 'sh1', 'C1', 'B1', 'DE1']</code> invocando <code>grafica(sensor)</code> en cada iteración.<br>3. Ejecuta tu código para visualizar las 5 series temporales.",
        initialCode: `# ==============================================================
# EJERCICIO 2.1: Fundamentos de Matplotlib y Automatización Multisensores
# La matriz df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import matplotlib.pyplot as plt

# Paso 1: Define la función modular grafica(sensor) con lienzo (figsize=(9, 4)),
# trazado de la serie df_ancon[sensor] (linewidth=0.8), título en negrilla (fontsize=15),
# rotulación de ejes 'Fecha' y sensor, leyenda ('upper left'), cuadrícula punteada y plt.show():


# Paso 2: Escribe un bucle for tradicional que recorra cada sensor en ['p1', 'sh1', 'C1', 'B1', 'DE1']
# e invoque grafica(sensor) para desplegar cada serie temporal por separado:

`,
        hint: `Escribe:
def grafica(sensor):
    plt.figure(figsize=(9, 4))
    plt.plot(df_ancon.index, df_ancon[sensor], label=sensor, linewidth=0.8)
    plt.title(sensor, fontsize=15, fontweight='bold')
    plt.xlabel('Fecha')
    plt.ylabel(sensor)
    plt.legend(loc='upper left')
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.show()

for sensor in ['p1', 'sh1', 'C1', 'B1', 'DE1']:
    grafica(sensor)`,
        solution: `import matplotlib.pyplot as plt

def grafica(sensor):
    plt.figure(figsize=(9, 4))
    plt.plot(df_ancon.index, df_ancon[sensor], label=sensor, linewidth=0.8)
    plt.title(sensor, fontsize=15, fontweight='bold')
    plt.xlabel('Fecha')
    plt.ylabel(sensor)
    plt.legend(loc='upper left')
    plt.grid(True, linestyle='--', alpha=0.5)
    plt.show()

for sensor in ['p1', 'sh1', 'C1', 'B1', 'DE1']:
    grafica(sensor)`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m2_l2",
        title: "2.2 Diagnóstico Visual de Telemetría y Saneamiento de Datos (NaN)",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 2.1</div>
            <p style="margin: 0 0 0.5rem 0;">
              Al graficar secuencialmente todas las series en la lección 2.1, descubriste dos realidades físicas y operacionales de la instrumentación en Ancón Norte:
            </p>
            <ul style="margin: 0.35rem 0 0.85rem 1.25rem; font-size: 0.88rem; line-height: 1.6;">
              <li><strong>Desfases Temporales de Instalación:</strong> El pluviómetro (<code>p1</code>) inició registros en mayo de 2019, mientras que las sondas de humedad e inclinómetros se instalaron a inicios de 2020.</li>
              <li><strong>Anomalía Crítica en el Extensómetro (<code>DE1</code>):</strong> Al graficar la apertura de grieta, la gráfica aparece completamente distorsionada y aplastada contra el techo superior por la presencia de lecturas negativas abruptas como <code>-999.0</code>.</li>
            </ul>
            <p style="margin: 0;">
              En telemetría geotécnica, <strong>los valores negativos extremos representan la codificación numérica de fallas de conexión o caída de voltaje en el datalogger</strong> (datos faltantes artificialmente codificados). En esta lección aprenderemos a diagnosticar y sanear estas anomalías.
            </p>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Detección de Códigos Numéricos de Error en Telemetría</h4>
          <p>
            Los sistemas IoT y estaciones datalogger de campo frecuentemente asignan valores centinela (como <code>-999.0</code> o <code>-9999.0</code>) cuando un sensor se desconecta o pierde alimentación. Si se grafican directamente, Matplotlib expande el eje Y hasta incluir el número negativo extremo, reduciendo toda la señal física real (que varía de 0 a 15 mm) a una línea plana e imperceptible.
          </p>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. Saneamiento de Telemetría: Imputación de <code>np.nan</code> con <code>.loc</code></h4>
          <p>
            Para devolver la serie a su escala física genuina sin perder la cronología de las fechas, ubicamos las filas anómalas mediante una <strong>máscara booleana</strong> y les asignamos el valor nulo estándar de punto flotante <code>np.nan</code> (Not a Number):
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 0.85rem; margin: 1rem 0;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-amber); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-amber);">1. Máscara Booleana de Negativos</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Identifica qué filas contienen la codificación numérica de error (valores menores a 0 en la apertura de grieta):
              </p>
              <code style="font-size: 0.78rem;">condicion = df_ancon['DE1'] &lt; 0</code>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-emerald); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-emerald);">2. Asignación de <code>np.nan</code> con <code>.loc</code></strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Sustituye los códigos erróneos por <code>np.nan</code>. Al graficar de nuevo, Matplotlib ignora los nulos y conecta los tramos continuos sin caer al abismo negativo:
              </p>
              <code style="font-size: 0.78rem;">df_ancon.loc[condicion, 'DE1'] = np.nan</code>
            </div>
          </div>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Saneamiento y Normalización de DE1</strong><br>
            La matriz <code>df_ancon</code> y la función <code>grafica()</code> ya se encuentran en memoria. <strong>No es necesario volver a importar el CSV</strong>. Identifica la condición de valores negativos en <code>DE1</code>, asígnales <code>np.nan</code> mediante <code>.loc</code> y re-invoca <code>grafica('DE1')</code> para confirmar que la escala milimétrica real quede visible.
          </div>
        `,
        instruction: "1. En el editor inferior, define la condición booleana para identificar los registros negativos en <code>DE1</code> (menores que 0): <code>condicion = df_ancon['DE1'] &lt; 0</code>.<br>2. Sustituye esos códigos de error por valores nulos usando <code>df_ancon.loc[condicion, 'DE1'] = np.nan</code>.<br>3. Vuelve a invocar <code>grafica('DE1')</code> para verificar que la gráfica se normalice sin distorsiones en su rango real de milímetros.<br>4. Ejecuta tu código para validar.",
        initialCode: `# ==============================================================
# EJERCICIO 2.2: Diagnóstico de Telemetría y Saneamiento de DE1
# La matriz df_ancon y la función grafica() ya se encuentran en memoria.
# NO debes volver a importar el archivo CSV.
# ==============================================================
import numpy as np

# Paso 1: Define la condición booleana para detectar lecturas erróneas
# negativas en la columna 'DE1' (menores que 0):


# Paso 2: Asigna np.nan a esas posiciones utilizando df_ancon.loc[condicion, 'DE1'] = np.nan:


# Paso 3: Invoca grafica('DE1') para verificar que la serie de deformación
# se despliegue en su escala física real sin distorsiones:

`,
        hint: `Escribe:
condicion = df_ancon['DE1'] < 0
df_ancon.loc[condicion, 'DE1'] = np.nan
grafica('DE1')`,
        solution: `import numpy as np

condicion = df_ancon['DE1'] < 0
df_ancon.loc[condicion, 'DE1'] = np.nan
grafica('DE1')`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m2_l3",
        title: "2.3 Paneles Múltiples (Subplots) y Sincronización Temporal (sharex)",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 2.2</div>
            <p style="margin: 0 0 0.5rem 0;">
              En la lección previa aprendiste a graficar cada sensor en ventanas independientes y limpiaste la anomalía de telemetría en <code>DE1</code>.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Sin embargo, en el análisis de estabilidad de taludes, <strong>los procesos no ocurren de forma aislada</strong>: la precipitación se infiltra, incrementa la humedad del suelo y puede inducir rotaciones en el inclinómetro o aperturas en la grieta. Evaluar gráficos separados en ventanas desconectadas impide comparar visualmente los eventos simultáneos.
            </p>
            <p style="margin: 0;">
              Para resolver esto, utilizamos <strong>Subplots Apilados</strong> (<code>plt.subplots</code>). Pero aquí surge un desafío fundamental: como los sensores iniciaron mediciones en fechas distintas, debemos forzar la sincronización temporal horizontal mediante <code>sharex=True</code>.
            </p>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Arquitectura de Subplots Apilados</h4>
          <p>
            La función <code>plt.subplots(nrows, ncols, figsize=(ancho, alto))</code> crea una matriz de ejes gráficos en una sola figura:
          </p>

          <!-- Componente Visual Interactivo de Instanciación de Subplots -->
          <div id="subplots-anatomy-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. El Dilema Sin sharex vs. La Solución sharex=True</h4>
          <p>
            Comprende el impacto crítico de compartir el eje temporal horizontal:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 0.85rem; margin: 1rem 0;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid #ef4444; border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: #ef4444;">⚠️ Sin sharex (Desfase Cronológico)</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Cada panel auto-ajusta su escala de fechas según sus datos disponibles. Como la lluvia inició en mayo 2019 y los sensores geotécnicos en marzo 2020, las columnas verticales de tiempo quedan desalineadas, haciendo imposible ver si un aguacero coincidió con una deformación.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-emerald); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-emerald);">✅ Con sharex=True (Sincronización Total)</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Fuerza a todos los subplots a compartir una escala temporal unificada. Las fechas se ocultan en los paneles superiores para evitar saturación y solo se rotulan en el panel inferior, permitiendo una lectura vertical directa.
              </p>
            </div>
          </div>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Paneles Sincronizados de Ancón Norte</strong><br>
            En el editor interactivo inferior construirás los 4 subplots apilados (<code>figsize=(8, 10)</code>) con <code>sharex=True</code> para trazar en orden vertical la lluvia (<code>p1</code>), la humedad del suelo (<code>sh1</code>) y los componentes de aceleración/inclinación (<code>C1</code> y <code>B1</code>), obteniendo la primera radiografía sincrónica del talud.
          </div>
        `,
        instruction: "1. En el editor inferior, crea una figura con 4 subplots apilados verticalmente de 8 pulgadas de ancho por 10 de alto compartiendo el eje horizontal con <code>sharex=True</code>.<br>2. En el primer panel (<code>axs[0]</code>), traza la precipitación <code>p1</code> con etiqueta <code>'p1'</code> y ancho de línea 0.8.<br>3. En el segundo panel (<code>axs[1]</code>), traza la humedad <code>sh1</code> con etiqueta <code>'sh1'</code>.<br>4. En el tercer y cuarto panel (<code>axs[2]</code> y <code>axs[3]</code>), traza respectivamente los canales de acelerómetro <code>C1</code> y <code>B1</code> con ancho 0.8.<br>5. Añade leyendas a los paneles, ajusta el diseño y despliega la figura con <code>plt.show()</code>.",
        initialCode: `# ==============================================================
# EJERCICIO 2.3: Subplots Apilados y Sincronización Temporal (sharex)
# df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import matplotlib.pyplot as plt

# Paso 1: Crea la figura y los 4 subplots apilados (4 filas, 1 columna, figsize=(8, 10))
# forzando la sincronización temporal con sharex=True:


# Paso 2: Traza 'p1' en axs[0] con label='p1' y linewidth=0.8:


# Paso 3: Traza 'sh1' en axs[1] con label='sh1' y linewidth=0.8:


# Paso 4: Traza 'C1' en axs[2] y 'B1' en axs[3] con linewidth=0.8:


# Paso 5: Agrega leyendas a los paneles y despliega la figura con plt.show():

`,
        hint: `Escribe:
fig, axs = plt.subplots(4, 1, figsize=(8, 10), sharex=True)

axs[0].plot(df_ancon.index, df_ancon['p1'], label='p1', linewidth=0.8)
axs[1].plot(df_ancon.index, df_ancon['sh1'], label='sh1', linewidth=0.8)
axs[2].plot(df_ancon.index, df_ancon['C1'], label='C1', linewidth=0.8)
axs[3].plot(df_ancon.index, df_ancon['B1'], label='B1', linewidth=0.8)

for ax in axs:
    ax.legend(loc='upper left')
    ax.grid(True, linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()`,
        solution: `import matplotlib.pyplot as plt

fig, axs = plt.subplots(4, 1, figsize=(8, 10), sharex=True)

axs[0].plot(df_ancon.index, df_ancon['p1'], label='p1', linewidth=0.8)
axs[1].plot(df_ancon.index, df_ancon['sh1'], label='sh1', linewidth=0.8)
axs[2].plot(df_ancon.index, df_ancon['C1'], label='C1', linewidth=0.8)
axs[3].plot(df_ancon.index, df_ancon['B1'], label='B1', linewidth=0.8)

for ax in axs:
    ax.legend(loc='upper left')
    ax.grid(True, linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m2_l4",
        title: "2.4 Doble Eje Y (twinx) y Lluvia Invertida para Procesos Acoplados",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 2.3</div>
            <p style="margin: 0 0 0.5rem 0;">
              En la lección previa aprendiste a comparar sensores en paneles apilados con <code>sharex=True</code>.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Sin embargo, para estudiar la <strong>interacción directa causa-efecto</strong> (por ejemplo, cómo cada pulso de precipitación eleva instantáneamente la humedad del suelo), los ingenieros geotécnicos necesitan ver ambas series superpuestas en un único gráfico temporal.
            </p>
            <p style="margin: 0;">
              Como la precipitación (0 a 70 mm) y la humedad (45% a 65%) tienen magnitudes físicas totalmente distintas, dibujarlas en un mismo eje aplastaría la curva de lluvia. La solución estándar en hidrogeología es emplear un <strong>Doble Eje Y</strong> con <code>ax1.twinx()</code> e <strong>Invertir el Eje de Lluvia</strong> con <code>ax1.invert_yaxis()</code>: las tormentas descienden del cielo en azul, mientras la humedad evoluciona libremente desde el suelo en carmesí.
            </p>
          </div>

          <!-- Componente Visual Interactivo de Lluvia Invertida y Doble Eje -->
          <div id="dual-axis-rain-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Arquitectura de Dos Ejes con Escalas Independientes (twinx)</h4>
          <p>
            Matplotlib permite desacoplar los rangos verticales manteniendo un único eje horizontal de fechas:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 0.85rem; margin: 1rem 0;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid #1e3a8a; border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: #3b82f6;">1. Eje Primario (<code>ax1</code> - Atmósfera / Lluvia)</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                <code>fig, ax1 = plt.subplots(figsize=(12, 4))</code> crea el marco principal. Trazamos la precipitación en color <code>'royalblue'</code> y rotulamos su eje Y.
              </p>
              <code style="font-size: 0.78rem;">ax1.plot(..., color='royalblue')</code>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid #dc2626; border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: #ef4444;">2. Eje Gemelo Secundario (<code>ax2</code> - Subsuelo / Humedad)</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                <code>ax2 = ax1.twinx()</code> clona el eje X en el margen derecho. Trazamos la humedad en color <code>'crimson'</code> con su propia escala independiente de 0 a 100%.
              </p>
              <code style="font-size: 0.78rem;">ax2 = ax1.twinx()</code>
            </div>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. La Convención Hidrogeológica de Lluvia Invertida</h4>
          <p>
            Al ejecutar <code>ax1.invert_yaxis()</code>, el cero de la lluvia se ancla en el techo de la figura y los picos de tormenta crecen hacia abajo. Esta disposición evita que las líneas de lluvia interfieran visualmente con el ascenso del agua en el perfil del suelo.
          </p>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Lluvia Invertida y Respuesta de Humedad</strong><br>
            En el editor interactivo inferior configurarás la figura panorámica de 12x4 pulgadas, trazarás <code>p1</code> en <code>ax1</code> en color <code>'royalblue'</code> con su eje Y invertido, crearás el eje gemelo <code>ax2</code> para trazar <code>sh1</code> en color <code>'crimson'</code> y rotularás ambos ejes con sus colores temáticos.
          </div>
        `,
        instruction: "1. En el editor inferior, crea la figura y el eje primario con <code>fig, ax1 = plt.subplots(figsize=(12, 4), sharex=True)</code>.<br>2. En <code>ax1</code>, traza la precipitación <code>p1</code> en color <code>'royalblue'</code> con ancho de línea 0.8, rotula el eje Y como <code>'Precipitación'</code> con el mismo color e invierte el eje con <code>ax1.invert_yaxis()</code>.<br>3. Crea el eje secundario con <code>ax2 = ax1.twinx()</code>.<br>4. En <code>ax2</code>, traza la humedad <code>sh1</code> en color <code>'crimson'</code> con ancho 0.8 y rotula su eje Y como <code>'Humedad'</code> con el color correspondiente.<br>5. Despliega la gráfica acoplada con <code>plt.show()</code>.",
        initialCode: `# ==============================================================
# EJERCICIO 2.4: Doble Eje Y (twinx) y Lluvia Invertida
# df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import matplotlib.pyplot as plt

# Paso 1: Crea la figura y el eje primario ax1 con tamaño panorámico (12x4 pulgadas):


# Paso 2: Traza 'p1' en ax1 (color='royalblue', linewidth=0.8), rotula el eje Y
# como 'Precipitación' en color royalblue e invierte el eje Y con ax1.invert_yaxis():


# Paso 3: Crea el eje gemelo secundario con ax2 = ax1.twinx():


# Paso 4: Traza 'sh1' en ax2 (color='crimson', linewidth=0.8) y rotula su eje Y
# como 'Humedad' en color crimson:


# Paso 5: Muestra la figura con plt.show():

`,
        hint: `Escribe:
fig, ax1 = plt.subplots(figsize=(12, 4), sharex=True)

ax1.plot(df_ancon.index, df_ancon['p1'], label='p1', linewidth=0.8, color='royalblue')
ax1.set_ylabel('Precipitación', color='royalblue')
ax1.invert_yaxis()

ax2 = ax1.twinx()
ax2.plot(df_ancon.index, df_ancon['sh1'], label='sh1', linewidth=0.8, color='crimson')
ax2.set_ylabel('Humedad', color='crimson')

plt.show()`,
        solution: `import matplotlib.pyplot as plt

fig, ax1 = plt.subplots(figsize=(12, 4), sharex=True)

ax1.plot(df_ancon.index, df_ancon['p1'], label='p1', linewidth=0.8, color='royalblue')
ax1.set_ylabel('Precipitación', color='royalblue')
ax1.invert_yaxis()

ax2 = ax1.twinx()
ax2.plot(df_ancon.index, df_ancon['sh1'], label='sh1', linewidth=0.8, color='crimson')
ax2.set_ylabel('Humedad', color='crimson')

plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m2_l5",
        title: "2.5 Análisis de Dispersión con Boxplots Multivariables",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con las Lecciones 2.1 a 2.4</div>
            <p style="margin: 0 0 0.5rem 0;">
              En las lecciones anteriores aprendiste a visualizar las series temporales individuales, sincronizar paneles con <code>sharex=True</code> y acoplar lluvia con humedad mediante <code>twinx()</code>.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Sin embargo, las series en el tiempo no permiten comparar de un solo vistazo la <strong>dispersión estadística y los rangos operativos</strong> entre sensores que tienen escalas y unidades completamente diferentes.
            </p>
            <p style="margin: 0;">
              Para resolver esto sin sesgos de distribución normal, la ingeniería geotécnica recurre al <strong>Diagrama de Caja y Bigotes (Boxplot de Tukey)</strong>, permitiendo evaluar la variabilidad, identificar asimetrías y aislar lecturas atípicas (outliers) en toda la red de monitoreo.
            </p>
          </div>

          <!-- Componente Visual Interactivo de Boxplot de Tukey -->
          <div id="boxplot-anatomy-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Anatomía Estadística del Boxplot de Tukey</h4>
          <p>
            El boxplot resume la distribución de datos mediante 5 medidas clave sin asumir una campana de Gauss:
          </p>

          <ul style="margin: 0.35rem 0 0.85rem 1.25rem; font-size: 0.88rem; line-height: 1.6;">
            <li><strong>Mediana ($Q_2$ / Percentil 50):</strong> Medida central robusta. Inmune a picos espurios o descargas electromagnéticas de telemetría.</li>
            <li><strong>Caja Central ($IQR = Q_3 - Q_1$):</strong> Contiene el 50% central de las observaciones registradas. Refleja la estabilidad del sensor.</li>
            <li><strong>Bigotes Superior e Inferior:</strong> Se extienden hasta el dato real más alejado que no exceda $1.5 \\times IQR$ desde los cuartiles.</li>
            <li><strong>Outliers (Puntos Atípicos):</strong> Cualquier lectura fuera de los bigotes ($> Q_3 + 1.5 \\times IQR$). Requiere verificación para distinguir entre ruido instrumental y pulsos reales de movimiento.</li>
          </ul>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. Comparación Multivariable con Subplots en Matplotlib</h4>
          <p>
            En una instrumentación real coexisten sensores con órdenes de magnitud dispares:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem; margin: 1rem 0;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-primary); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-primary);">1. El Problema de Escala Única</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Graficar piezómetros en kPa (0 a 100), humedad en % (40 a 70) y extensómetros en mm (0 a 25) en un solo eje aplastaría los sensores de menor magnitud.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-cyan); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-cyan);">2. Cuadrícula Horizontal de Subplots</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Instanciamos 5 subplots en una fila. Cada variable recibe su propio panel con escala vertical independiente y legible.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-emerald); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-emerald);">3. Iteración Limpia con .dropna()</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Matplotlib requiere que los valores <code>NaN</code> sean descartados antes de calcular cuartiles en cada canal.
              </p>
            </div>
          </div>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Boxplots Multivariables de la Red Ancón Norte</strong><br>
            En el editor inferior definirás la lista de los 5 sensores de monitoreo, crearás una cuadrícula horizontal de 5 subplots, iterarás para trazar el boxplot de cada variable y observarás las diferencias de dispersión y outliers en toda la estación.
          </div>
        `,
        instruction: "1. Crea una lista con los identificadores de los 5 sensores de la ladera: precipitación (<code>p1</code>), humedad (<code>sh1</code>), piezómetros (<code>C1</code> y <code>B1</code>) y deformación (<code>DE1</code>).<br>2. Configura una cuadrícula panorámica de 5 subplots dispuestos en una única fila horizontal (1 fila &times; 5 columnas, con proporciones de 15 &times; 4 pulgadas).<br>3. Mediante un bucle de iteración, recorre cada sensor para generar su diagrama de caja y bigotes (boxplot) descartando los valores nulos, rellenando las cajas con color, titulando cada panel con el nombre del sensor y activando una cuadrícula tenue.<br>4. Ajusta la separación entre paneles para evitar solapamientos y renderiza la figura en pantalla.",
        initialCode: `# ==============================================================
# EJERCICIO 2.5: Boxplots Multivariables de Sensores Geotécnicos
# df_ancon ya se encuentra disponible y saneado en memoria.
# ==============================================================
import matplotlib.pyplot as plt

# Paso 1: Define la lista con los 5 sensores a comparar (lluvia, humedad, piezómetros y extensómetro):


# Paso 2: Instancia una fila de 5 subplots en una figura panorámica (15x4 pulgadas):


# Paso 3: Itera sobre cada sensor para graficar su boxplot (descartando nulos con .dropna()),
# rellena las cajas con color, asigna el título del sensor a cada panel y añade la cuadrícula:


# Paso 4: Ajusta los espacios entre paneles y muestra la gráfica:

`,
        hint: `Escribe:
columnas = ['p1', 'sh1', 'C1', 'B1', 'DE1']
fig, axs = plt.subplots(1, 5, figsize=(15, 4))

for i, col in enumerate(columnas):
    axs[i].boxplot(df_ancon[col].dropna(), patch_artist=True)
    axs[i].set_title(col)
    axs[i].grid(True, linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()`,
        solution: `import matplotlib.pyplot as plt

columnas = ['p1', 'sh1', 'C1', 'B1', 'DE1']
fig, axs = plt.subplots(1, 5, figsize=(15, 4))

for i, col in enumerate(columnas):
    axs[i].boxplot(df_ancon[col].dropna(), patch_artist=True)
    axs[i].set_title(col)
    axs[i].grid(True, linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m2_l6",
        title: "2.6 Semáforo Geotécnico y Bandas de Alerta con axhspan",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 2.5</div>
            <p style="margin: 0 0 0.5rem 0;">
              En la lección anterior aprendiste a diagnosticar la dispersión e identificar outliers mediante el Boxplot de Tukey.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              En la ingeniería de taludes y presas de relaves, los umbrales de alerta temprana <strong>nunca deben establecerse como números arbitrarios inventados a ciegas</strong>.
            </p>
            <p style="margin: 0;">
              El protocolo geotécnico estándar deriva las fronteras operativas del semáforo directamente de la <strong>estadística de base del sensor mediante el Método de Tukey</strong>: usando los cuartiles ($Q_1, Q_3$) y el rango intercuartílico ($IQR$) para demarcar cuantitativamente la frontera entre variaciones normales, atención preventiva, alerta técnica y emergencia por falla.
            </p>
          </div>

          <!-- Componente Visual Interactivo de Semáforo y Bandas de Alerta -->
          <div id="threshold-bands-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Zonificación de Riesgo Derivada del Método de Tukey</h4>
          <p>
            A partir de los cuantiles del sensor, el semáforo traduce la estadística a cuatro niveles operativos rigurosos:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.75rem; margin: 1rem 0;">
            <div style="background: rgba(34, 197, 94, 0.08); border-left: 4px solid #22c55e; padding: 0.75rem; border-radius: var(--radius-sm);">
              <strong style="color: #16a34a;">🟢 Zona Verde: Normal (0 a $Q_3$)</strong>
              <p style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-muted);">
                Abarca el 75% de las observaciones registradas. Representa el régimen elástico y las variaciones estacionales habituales sin aceleración.
              </p>
            </div>

            <div style="background: rgba(234, 179, 8, 0.08); border-left: 4px solid #eab308; padding: 0.75rem; border-radius: var(--radius-sm);">
              <strong style="color: #ca8a04;">🟡 Zona Amarilla: Prevención ($Q_3$ a $Q_3 + 1.5 \\times IQR$)</strong>
              <p style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-muted);">
                Zona comprendida en el bigote superior. La dispersión supera lo cotidiano pero aún se considera físicamente permisible. Incremento de vigilancia.
              </p>
            </div>

            <div style="background: rgba(249, 115, 22, 0.08); border-left: 4px solid #f97316; padding: 0.75rem; border-radius: var(--radius-sm);">
              <strong style="color: #ea580c;">🟠 Zona Naranja: Alerta ($Q_3 + 1.5 \\times IQR$ a $Q_3 + 3.0 \\times IQR$)</strong>
              <p style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-muted);">
                Supera el límite de Tukey (outliers moderados). Implica aceleración cinemática anómala o reptación activa: restricción de accesos y maquinaria pesada.
              </p>
            </div>

            <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 0.75rem; border-radius: var(--radius-sm);">
              <strong style="color: #dc2626;">🔴 Zona Roja: Emergencia ($> Q_3 + 3.0 \\times IQR$)</strong>
              <p style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-muted);">
                Zona de outliers severos y deformación acelerada de tercer orden (falla inminente). Orden de evacuación inmediata del personal de la ladera.
              </p>
            </div>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. Trazado Continuo del Semáforo con axhspan</h4>
          <p>
            El método <code>ax.axhspan(ymin, ymax, color, alpha, label)</code> dibuja una franja horizontal que cubre todo el historial temporal, permitiendo comparar visualmente si la serie temporal cruza los umbrales de Tukey calculados para ese sensor.
          </p>

          <div class="theory-callout" style="border-left-color: var(--accent-emerald); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Semáforo Estadístico de Tukey en DE1</strong><br>
            En el editor inferior calcularás los umbrales estadísticos de Tukey sobre la deformación activa del extensómetro (<code>DE1 &gt; 0</code>), y utilizarás los valores calculados de $Q_3$, <code>umbral_alerta</code> ($Q_3 + 1.5 \\times IQR$) y <code>umbral_emergencia</code> ($Q_3 + 3.0 \\times IQR$) como los límites de las franjas de <code>axhspan</code>.
          </div>
        `,
        instruction: "1. Aísla las lecturas con deformación activa del extensómetro <code>DE1</code> (valores mayores que cero descartando los nulos).<br>2. Calcula estadísticamente el primer cuartil ($Q_1$), el tercer cuartil ($Q_3$) y el rango intercuartílico ($IQR$).<br>3. Determina mediante el método de Tukey los dos límites superiores: el <strong>umbral de alerta</strong> ($Q_3 + 1.5 \\times IQR$) y el <strong>umbral de emergencia</strong> ($Q_3 + 3.0 \\times IQR$).<br>4. Configura una figura de 10 &times; 4 pulgadas y dibuja la serie temporal completa de <code>DE1</code> en trazo negro continuo.<br>5. Superpón las 4 zonas del semáforo con <code>axhspan</code> usando las variables estadísticas calculadas como cotas:<br>&bull; <strong>Verde:</strong> desde 0 hasta el tercer cuartil ($Q_3$).<br>&bull; <strong>Amarillo:</strong> desde $Q_3$ hasta el umbral de alerta.<br>&bull; <strong>Naranja:</strong> desde el umbral de alerta hasta el umbral de emergencia.<br>&bull; <strong>Rojo:</strong> desde el umbral de emergencia hacia arriba.<br>6. Añade título, rotula los ejes, posiciona la leyenda en la esquina superior izquierda, activa la cuadrícula y muestra el gráfico.",
        initialCode: `# ==============================================================
# EJERCICIO 2.6: Semáforo de Umbrales Estadísticos (Método de Tukey)
# df_ancon ya se encuentra disponible y saneado en memoria.
# ==============================================================
import matplotlib.pyplot as plt

# Paso 1: Filtra las lecturas de deformación activa de DE1 (valores > 0 sin nulos):


# Paso 2: Calcula los cuartiles Q1, Q3, el IQR y los umbrales de Tukey:
# - umbral_alerta: Q3 + 1.5 * IQR
# - umbral_emergencia: Q3 + 3.0 * IQR


# Paso 3: Crea la figura y eje (10x4 pulgadas), y traza la serie de DE1 en negro:


# Paso 4: Superpón las 4 bandas del semáforo usando las variables calculadas:
# Verde (0 a Q3), Amarillo (Q3 a alerta), Naranja (alerta a emergencia), Rojo (> emergencia):


# Paso 5: Configura título, etiquetas de ejes, leyenda, cuadrícula y despliega la figura:

`,
        hint: `Escribe:
de1_activo = df_ancon[df_ancon['DE1'] > 0]['DE1'].dropna()

q1 = de1_activo.quantile(0.25)
q3 = de1_activo.quantile(0.75)
iqr = q3 - q1
umbral_alerta = q3 + 1.5 * iqr
umbral_emergencia = q3 + 3.0 * iqr

fig, ax = plt.subplots(figsize=(10, 4))
ax.plot(df_ancon.index, df_ancon['DE1'], color='black', linewidth=1.2, label='DE1 (Extensómetro)')

ax.axhspan(0, q3, color='green', alpha=0.15, label='Normal (<= Q3)')
ax.axhspan(q3, umbral_alerta, color='gold', alpha=0.2, label='Prevención (Q3 a Q3+1.5*IQR)')
ax.axhspan(umbral_alerta, umbral_emergencia, color='orange', alpha=0.25, label='Alerta (Q3+1.5*IQR a Q3+3*IQR)')
ax.axhspan(umbral_emergencia, df_ancon['DE1'].max() * 1.05, color='red', alpha=0.25, label='Emergencia (> Q3+3*IQR)')

ax.set_title('Semáforo Geotécnico con Umbrales Estadísticos de Tukey (DE1)')
ax.set_ylabel('Deformación (mm)')
ax.set_xlabel('Fecha')
ax.legend(loc='upper left')
ax.grid(True, linestyle='--', alpha=0.5)
plt.tight_layout()
plt.show()`,
        solution: `import matplotlib.pyplot as plt

de1_activo = df_ancon[df_ancon['DE1'] > 0]['DE1'].dropna()

q1 = de1_activo.quantile(0.25)
q3 = de1_activo.quantile(0.75)
iqr = q3 - q1
umbral_alerta = q3 + 1.5 * iqr
umbral_emergencia = q3 + 3.0 * iqr

fig, ax = plt.subplots(figsize=(10, 4))
ax.plot(df_ancon.index, df_ancon['DE1'], color='black', linewidth=1.2, label='DE1 (Extensómetro)')

ax.axhspan(0, q3, color='green', alpha=0.15, label='Normal (<= Q3)')
ax.axhspan(q3, umbral_alerta, color='gold', alpha=0.2, label='Prevención (Q3 a Q3+1.5*IQR)')
ax.axhspan(umbral_alerta, umbral_emergencia, color='orange', alpha=0.25, label='Alerta (Q3+1.5*IQR a Q3+3*IQR)')
ax.axhspan(umbral_emergencia, df_ancon['DE1'].max() * 1.05, color='red', alpha=0.25, label='Emergencia (> Q3+3*IQR)')

ax.set_title('Semáforo Geotécnico con Umbrales Estadísticos de Tukey (DE1)')
ax.set_ylabel('Deformación (mm)')
ax.set_xlabel('Fecha')
ax.legend(loc='upper left')
ax.grid(True, linestyle='--', alpha=0.5)
plt.tight_layout()
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m2_l7",
        title: "2.7 Histogramas, Estimación de Densidad Kernel (KDE) y Umbrales Paramétricos",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 2.6</div>
            <p style="margin: 0 0 0.5rem 0;">
              En la lección anterior exploraste el método no paramétrico de Tukey, ideal para variables asimétricas o con tendencias unidireccionales (como la apertura acumulada del extensómetro <code>DE1</code>).
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Sin embargo, en sensores que fluctúan estacional o térmicamente alrededor de un nivel de equilibrio físico (como la <strong>humedad volumétrica del suelo (<code>sh1</code>)</strong> o el cabeceo del inclinómetro (<code>C1</code>)), el marco estadístico de la <strong>Distribución Normal (Gaussiana)</strong> ofrece un método complementario fundamental.
            </p>
            <p style="margin: 0;">
              En esta lección aprenderás a construir histogramas normalizados a densidad, superponer estimaciones continuas de densidad mediante núcleos (<strong>KDE</strong>) y derivar <strong>umbrales paramétricos de control basados en desviaciones estándar ($\\mu \\pm k\\sigma$)</strong>.
            </p>
          </div>

          <!-- Componente Visual Interactivo de Histograma, KDE y Campana de Gauss -->
          <div id="histogram-kde-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Histogramas de Frecuencia y Densidad de Probabilidad (<code>density=True</code>)</h4>
          <p>
            El histograma agrupa los datos continuos en un número finito de intervalos o columnas discretas (<code>bins</code>). Por defecto, Matplotlib grafica el conteo absoluto de observaciones en cada barra. Sin embargo, al activar <code>density=True</code>, Matplotlib normaliza las alturas para que el área total sume exactamente $1.0$:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem; margin: 1rem 0;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-primary); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-primary);">1. Sensibilidad al Parámetro <code>bins</code></strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Si seleccionas muy pocos intervalos (ej. <code>bins=5</code>), se pierde la forma de la campana. Si usas demasiados (ej. <code>bins=100</code>), aparecen valles y picos artificiales por escasez de datos. Un valor entre 20 y 30 es óptimo para series geotécnicas.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-cyan); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-cyan);">2. ¿Por qué <code>density=True</code>?</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Transforma el histograma discreto a la misma escala matemática de las curvas continuas de densidad (KDE y Campana de Gauss), permitiendo graficarlas superpuestas en el mismo eje Y.
              </p>
            </div>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. Estimación de Densidad Kernel (KDE)</h4>
          <p>
            La <strong>Estimación de Densidad Kernel (KDE)</strong> supera la rigidez de los rectángulos del histograma: coloca una pequeña función de distribución simétrica (kernel gaussiano) centrada en cada dato observado y suma todas las contribuciones. El resultado es una curva suave y continua que describe la verdadera silueta probabilística del sensor.
          </p>
          <p>
            En Pandas, se traza directamente sobre la serie con:
          </p>
          <pre class="trace-pre"><code>df_ancon['sh1'].dropna().plot.kde(color='#1e3a8a', linewidth=2.5, label='KDE')</code></pre>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">3. Umbrales Paramétricos Basados en la Desviación Estándar ($\\mu \\pm k\\sigma$)</h4>
          <p>
            Bajo el supuesto de normalidad, la <strong>Regla Empírica de Gauss ($68 - 95 - 99.7\%$)</strong> y el control estadístico de procesos permiten establecer umbrales de alerta según la distancia a la media muestral ($\\mu$):
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.75rem; margin: 1rem 0;">
            <div style="background: rgba(34, 197, 94, 0.08); border-left: 4px solid #22c55e; padding: 0.75rem; border-radius: var(--radius-sm);">
              <strong style="color: #16a34a;">🟢 Régimen Normal ($\\mu \\pm 1\\sigma$)</strong>
              <p style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-muted);">
                Abarca el <strong>68.3%</strong> de las observaciones históricas. Representa la variabilidad estacional típica del suelo en Ancón Norte.
              </p>
            </div>

            <div style="background: rgba(234, 179, 8, 0.08); border-left: 4px solid #eab308; padding: 0.75rem; border-radius: var(--radius-sm);">
              <strong style="color: #ca8a04;">🟡 Umbral Preventivo ($\\mu + 1\\sigma$)</strong>
              <p style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-muted);">
                Aproximadamente <strong>60.91%</strong> en <code>sh1</code>. Inicio de aumento significativo de saturación hídrica. Se activa inspección visual.
              </p>
            </div>

            <div style="background: rgba(249, 115, 22, 0.08); border-left: 4px solid #f97316; padding: 0.75rem; border-radius: var(--radius-sm);">
              <strong style="color: #ea580c;">🟠 Umbral de Alerta ($\\mu + 2\\sigma$)</strong>
              <p style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-muted);">
                Aproximadamente <strong>65.36%</strong> en <code>sh1</code>. Solo el 2.3% de los días supera esta cota por cola superior. Riesgo de incremento de presiones de poro.
              </p>
            </div>

            <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 0.75rem; border-radius: var(--radius-sm);">
              <strong style="color: #dc2626;">🔴 Umbral de Emergencia ($\\mu + 3\\sigma$)</strong>
              <p style="font-size: 0.8rem; margin: 0.25rem 0; color: var(--text-muted);">
                Aproximadamente <strong>69.81%</strong> en <code>sh1</code>. Criterio $3\\sigma$ de Shewhart. Probabilidad teórica $< 0.15\%$. Saturación crítica y amenaza de falla del talud.
              </p>
            </div>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">4. Trazado de Umbrales Verticales con <code>plt.axvline</code></h4>
          <p>
            En un histograma, los umbrales se demarcan con líneas verticales mediante <code>plt.axvline(x, color, linestyle, linewidth, label)</code>, proyectando las desviaciones estándar sobre el dominio físico del sensor.
          </p>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Histograma, KDE y Umbrales Paramétricos en sh1</strong><br>
            En el editor interactivo inferior aislarás los registros de humedad volumétrica <code>sh1</code>, calcularás su media ($\\mu$) y desviación estándar ($\\sigma$), trazarás el histograma normalizado con la curva KDE y superpondrás los umbrales paramétricos con <code>axvline</code>.
          </div>
        `,
        instruction: "1. Aísla la serie temporal de humedad volumétrica <code>sh1</code> de la matriz <code>df_ancon</code> descartando las observaciones nulas con <code>.dropna()</code>.<br>2. Calcula estadísticamente la media muestral (&mu;) con <code>.mean()</code> y la desviación estándar (&sigma;) con <code>.std()</code>.<br>3. Define dos umbrales paramétricos superiores:<br>&bull; <strong>Umbral preventivo:</strong> &mu; + 1&sigma;<br>&bull; <strong>Umbral de alerta:</strong> &mu; + 2&sigma;<br>4. Configura una figura de 9 &times; 4.5 pulgadas y traza el histograma normalizado a densidad de probabilidad (<code>density=True</code>) con 25 intervalos (<code>bins=25</code>), color celeste (<code>'#38bdf8'</code>), borde negro y transparencia <code>alpha=0.6</code>.<br>5. Superpón la curva continua de densidad Kernel (KDE) calculada sobre la serie con ancho de línea 2.5.<br>6. Traza líneas verticales con <code>plt.axvline()</code> para identificar la media (roja punteada), el umbral preventivo (dorada) y el umbral de alerta (naranja).<br>7. Asigna título en negrilla, rotula los ejes ('Humedad Volumétrica (%)' y 'Densidad de Probabilidad'), añade la leyenda explicativa, activa la cuadrícula y muestra el gráfico.",
        initialCode: `# ==============================================================
# EJERCICIO 2.7: Histogramas, KDE y Umbrales Paramétricos (μ ± kσ)
# df_ancon ya se encuentra disponible y saneado en memoria.
# ==============================================================
import matplotlib.pyplot as plt

# Paso 1: Extrae la serie del sensor de humedad sh1 sin valores nulos (.dropna()):


# Paso 2: Calcula la media (media) y la desviación estándar (desv) del sensor:


# Paso 3: Determina los dos umbrales paramétricos superiores basados en desviaciones:
# - umbral_preventivo: media + 1 * desv
# - umbral_alerta: media + 2 * desv


# Paso 4: Crea la figura (figsize=(9, 4.5)) y traza el histograma con density=True (bins=25):


# Paso 5: Superpón la curva KDE de densidad continua con .plot.kde():


# Paso 6: Traza las líneas verticales con plt.axvline() para la media y los umbrales (+1σ y +2σ):


# Paso 7: Configura título, etiquetas de ejes, leyenda, cuadrícula y despliega la gráfica:

`,
        hint: `Escribe:
humedad = df_ancon['sh1'].dropna()
media = humedad.mean()
desv = humedad.std()

umbral_preventivo = media + 1 * desv
umbral_alerta = media + 2 * desv

plt.figure(figsize=(9, 4.5))
plt.hist(humedad, bins=25, density=True, color='#38bdf8', edgecolor='black', alpha=0.6, label='Histograma (Densidad)')
humedad.plot.kde(color='#1e3a8a', linewidth=2.5, label='Curva KDE')

plt.axvline(media, color='red', linestyle='--', linewidth=2, label=f'Media (μ = {media:.2f}%)')
plt.axvline(umbral_preventivo, color='gold', linestyle=':', linewidth=2, label=f'Preventivo (μ+1σ = {umbral_preventivo:.2f}%)')
plt.axvline(umbral_alerta, color='orange', linestyle=':', linewidth=2, label=f'Alerta (μ+2σ = {umbral_alerta:.2f}%)')

plt.title('Distribución de Humedad sh1 y Umbrales Paramétricos', fontweight='bold')
plt.xlabel('Humedad Volumétrica (%)')
plt.ylabel('Densidad de Probabilidad')
plt.legend(loc='upper right')
plt.grid(True, linestyle='--', alpha=0.4)
plt.tight_layout()
plt.show()`,
        solution: `import matplotlib.pyplot as plt

humedad = df_ancon['sh1'].dropna()
media = humedad.mean()
desv = humedad.std()

umbral_preventivo = media + 1 * desv
umbral_alerta = media + 2 * desv

plt.figure(figsize=(9, 4.5))
plt.hist(humedad, bins=25, density=True, color='#38bdf8', edgecolor='black', alpha=0.6, label='Histograma (Densidad)')
humedad.plot.kde(color='#1e3a8a', linewidth=2.5, label='Curva KDE')

plt.axvline(media, color='red', linestyle='--', linewidth=2, label=f'Media (μ = {media:.2f}%)')
plt.axvline(umbral_preventivo, color='gold', linestyle=':', linewidth=2, label=f'Preventivo (μ+1σ = {umbral_preventivo:.2f}%)')
plt.axvline(umbral_alerta, color='orange', linestyle=':', linewidth=2, label=f'Alerta (μ+2σ = {umbral_alerta:.2f}%)')

plt.title('Distribución de Humedad sh1 y Umbrales Paramétricos', fontweight='bold')
plt.xlabel('Humedad Volumétrica (%)')
plt.ylabel('Densidad de Probabilidad')
plt.legend(loc='upper right')
plt.grid(True, linestyle='--', alpha=0.4)
plt.tight_layout()
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
    subtitle: "Interpolación, Remuestreo, Descomposición, Matrices de Correlación y Lags",
    lessons: [
      {
        id: "m3_l1",
        title: "3.1 Diagnóstico de Datos Faltantes e Interpolación Lineal",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con los Módulos 1 y 2</div>
            <p style="margin: 0 0 0.5rem 0;">
              En los módulos anteriores aprendiste a consolidar la matriz maestra <code>df_ancon</code>, limpiar códigos centinela (como <code>-999.0</code>), generar paneles sincronizados con <code>sharex=True</code> y trazar semáforos de alerta tanto con Tukey como con la aproximación Normal.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Ahora iniciamos el <strong>Módulo 3: Análisis Temporal y Feature Engineering</strong>. En la modelación cuantitativa de taludes (cálculo de cinemática, ventanas móviles, descomposición y modelos predictivos), los algoritmos <strong>exigen una condición rigurosa: un paso temporal constante e ininterrumpido ($\\Delta t$ regular)</strong>.
            </p>
            <p style="margin: 0;">
              En instrumentación geotécnica remota (como Ancón Norte), las tormentas severas, caídas de voltaje solar o pérdidas de telemetría generan huecos (<code>NaN</code>). En esta lección aprenderás a diagnosticarlos y aplicar <strong>interpolación lineal físicamente consistente</strong> sin destruir la cronología.
            </p>
          </div>

          <!-- Contenedor Interactivo de Datos Faltantes -->
          <div id="missing-data-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. El Peligro Geotécnico de <code>dropna()</code> en Series de Tiempo</h4>
          <p>
            Descartar filas con datos nulos mediante <code>.dropna()</code> es una práctica común en tablas estáticas, pero <strong>en series cronológicas es un error metodológico crítico</strong>:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem; margin: 1rem 0;">
            <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: #dc2626;">❌ Ruptura del Paso Temporal ($\\Delta t$) con <code>dropna()</code></strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Si un sensor pierde señal durante 4 días y borramos esas filas, el día 5 quedará adyacente al día 1. Al calcular velocidades ($\\Delta x / \\Delta t$), Pandas dividirá entre 1 día en lugar de 4, generando falsas aceleraciones críticas.
              </p>
            </div>

            <div style="background: rgba(16, 185, 129, 0.08); border-left: 4px solid #10b981; border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: #059669;">✔️ Preservación Cronológica con <code>interpolate()</code></strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Mantiene intactas todas las marcas de tiempo. Estima la trayectoria física trazando una pendiente continua entre la última lectura válida y la primera tras la reactivación del sensor.
              </p>
            </div>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. Tratamiento de Extremos con <code>.bfill()</code> y <code>.ffill()</code></h4>
          <p>
            Si los primeros registros de una serie son nulos, la interpolación lineal no puede extrapolar hacia atrás. Para garantizar una serie libre de nulos sin discontinuidades, se complementa encadenando:
          </p>
          <pre class="trace-pre"><code>df_activo['sh1'] = df_activo['sh1'].interpolate(method='linear').bfill().ffill()</code></pre>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Reconstrucción Temporal de la Sonda de Humedad</strong><br>
            Aislarás el periodo coactivo (desde el 24 de marzo de 2020), diagnosticarás los huecos de telemetría en la sonda <code>sh1</code> y reconstruirás la serie continua mediante interpolación lineal y relleno de bordes.
          </div>
        `,
        instruction: "1. A partir de <code>df_ancon</code>, aísla en <code>df_activo</code> la ventana temporal desde <code>'2020-03-24'</code> en adelante utilizando <code>.loc</code> y <code>.copy()</code>.<br>2. Cuenta y muestra en consola los valores nulos (<code>NaN</code>) en la columna <code>sh1</code> antes de intervenir la serie con <code>.isnull().sum()</code>.<br>3. Aplica interpolación lineal en <code>df_activo['sh1']</code> encadenando <code>.interpolate(method='linear')</code> con <code>.bfill()</code> y <code>.ffill()</code>.<br>4. Vuelve a consultar y muestra en consola los valores nulos en <code>df_activo['sh1']</code>, comprobando que se reduzcan exitosamente a 0.",
        initialCode: `# ==============================================================
# EJERCICIO 3.1: Diagnóstico de Gaps e Interpolación Lineal
# La matriz df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import pandas as pd

# Paso 1: Aísla el periodo coactivo (desde '2020-03-24' en adelante) en df_activo con .loc y .copy():


# Paso 2: Cuenta y muestra en consola los valores nulos en sh1 antes de interpolar (.isnull().sum()):


# Paso 3: Aplica interpolación lineal en df_activo['sh1'] (.interpolate(method='linear'))
# y asegura los extremos con .bfill() y .ffill():


# Paso 4: Vuelve a contar y muestra en consola los valores nulos en sh1 tras la interpolación:

`,
        hint: `Escribe:
df_activo = df_ancon.loc['2020-03-24':].copy()

nulos_antes = df_activo['sh1'].isnull().sum()
print("Valores nulos antes:", nulos_antes)

df_activo['sh1'] = df_activo['sh1'].interpolate(method='linear').bfill().ffill()

nulos_despues = df_activo['sh1'].isnull().sum()
print("Valores nulos después de interpolar:", nulos_despues)`,
        solution: `import pandas as pd

df_activo = df_ancon.loc['2020-03-24':].copy()

nulos_antes = df_activo['sh1'].isnull().sum()
print(f"Valores nulos en sh1 antes de interpolar: {nulos_antes}")

df_activo['sh1'] = df_activo['sh1'].interpolate(method='linear').bfill().ffill()

nulos_despues = df_activo['sh1'].isnull().sum()
print(f"Valores nulos después de interpolar: {nulos_despues}")`,
        validator: (output) => (output.includes("después de interpolar: 0") || output.includes("después: 0") || (output.includes("0") && !output.includes("None"))) && !output.includes("Error")
      },
      {
        id: "m3_l2",
        title: "3.2 Remuestreo Temporal (resample) y Agregaciones Físicas Coherentes",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 3.1</div>
            <p style="margin: 0 0 0.5rem 0;">
              Una vez garantizada la regularidad del paso temporal, frecuentemente necesitamos cambiar la escala de análisis: de registros diarios a resúmenes semanales (<code>'1W'</code>) o mensuales (<code>'1ME'</code>).
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              En geotecnia, <strong>cada tipo de sensor exige una función de agregación físicamente coherente</strong> con la variable que mide:
            </p>
            <ul style="margin: 0.35rem 0 0.85rem 1.25rem; font-size: 0.88rem; line-height: 1.6;">
              <li><strong>Precipitación (<code>p1</code>):</strong> Variable de flujo / masa. Debe agregarse con <code>sum()</code> para preservar el volumen total de agua caída en la cuenca.</li>
              <li><strong>Humedad y Piezómetros (<code>sh1</code>, <code>C1</code>):</strong> Variables de estado o nivel. Deben agregarse con <code>mean()</code> para reflejar la condición hídrica promedio del periodo.</li>
              <li><strong>Deformación de Extensómetros (<code>DE1</code>):</strong> Variable cinemática crítica. Se agrega con <code>max()</code> para retener el pico extremo de desplazamiento alcanzado.</li>
            </ul>
          </div>

          <!-- Contenedor Interactivo de Remuestreo Temporal -->
          <div id="resampling-flow-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. La Sintaxis Maestra de Agregación Multivariable</h4>
          <p>
            En lugar de calcular cada columna por separado, pasamos un diccionario de funciones físicas a <code>.agg()</code>:
          </p>
          <pre class="trace-pre"><code>df_semanal = df_activo.resample('1W').agg({
    'p1': 'sum',    # Lluvia semanal total (mm)
    'sh1': 'mean',  # Humedad media semanal (%)
    'DE1': 'max'    # Pico máximo de deformación (mm)
})</code></pre>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Agregación Semanal y Gráfico de Barras de Lluvia</strong><br>
            Remuestrearás la matriz <code>df_activo</code> a escala semanal (<code>'1W'</code>) aplicando la agregación física correspondiente, y graficarás el acumulado de precipitación semanal mediante un gráfico de barras.
          </div>
        `,
        instruction: "1. Aísla en <code>df_activo</code> la ventana temporal coactiva desde <code>'2020-03-24'</code> en adelante a partir de <code>df_ancon</code>.<br>2. Remuestrea a escala semanal con <code>.resample('1W')</code> aplicando <code>.agg()</code> con <code>sum</code> para la lluvia (<code>'p1'</code> o <code>'p'</code>), <code>mean</code> para la humedad (<code>'sh1'</code>) y <code>max</code> para la deformación (<code>'DE1'</code>), guardando el resultado en <code>df_semanal</code>.<br>3. Muestra en consola la lluvia semanal máxima registrada con <code>.max()</code>.<br>4. Configura una figura de 10 &times; 4 pulgadas y grafica la precipitación semanal en un gráfico de barras (<code>plt.bar</code>) con ancho de 5 días, color <code>'darkcyan'</code>, título en negrilla, rotulado de ejes, cuadrícula tenue y despliega con <code>plt.show()</code>.",
        initialCode: `# ==============================================================
# EJERCICIO 3.2: Remuestreo Semanal y Agregaciones Físicas
# La matriz df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import pandas as pd
import matplotlib.pyplot as plt

# Paso 1: Aísla el periodo coactivo (desde '2020-03-24' en adelante) en df_activo:


# Paso 2: Remuestrea a escala semanal ('1W') con .agg({'p1': 'sum', 'sh1': 'mean', 'DE1': 'max'}):


# Paso 3: Muestra en consola la lluvia semanal máxima registrada:


# Paso 4: Grafica la precipitación semanal en barras (plt.bar) de ancho 5 días, color 'darkcyan',
# configura título, etiquetas, cuadrícula y despliega con plt.show():

`,
        hint: `Escribe:
df_activo = df_ancon.loc['2020-03-24':].copy()
p_col = 'p1' if 'p1' in df_activo.columns else 'p'

df_semanal = df_activo.resample('1W').agg({
    p_col: 'sum',
    'sh1': 'mean',
    'DE1': 'max'
})

print(f"Lluvia semanal máxima: {df_semanal[p_col].max():.1f} mm")

plt.figure(figsize=(10, 4))
plt.bar(df_semanal.index, df_semanal[p_col], width=5, color='darkcyan', edgecolor='black', alpha=0.8)
plt.title('Precipitación Semanal Acumulada - Ancón Norte', fontweight='bold')
plt.xlabel('Fecha')
plt.ylabel('Lluvia Semanal (mm)')
plt.grid(True, linestyle='--', alpha=0.4)
plt.tight_layout()
plt.show()`,
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df_activo = df_ancon.loc['2020-03-24':].copy()
p_col = 'p1' if 'p1' in df_activo.columns else 'p'

df_semanal = df_activo.resample('1W').agg({
    p_col: 'sum',
    'sh1': 'mean',
    'DE1': 'max'
})

print(f"Lluvia semanal máxima: {df_semanal[p_col].max():.1f} mm")

plt.figure(figsize=(10, 4))
plt.bar(df_semanal.index, df_semanal[p_col], width=5, color='darkcyan', edgecolor='black', alpha=0.8)
plt.title('Precipitación Semanal Acumulada - Ancón Norte', fontweight='bold')
plt.xlabel('Fecha')
plt.ylabel('Lluvia Semanal (mm)')
plt.grid(True, linestyle='--', alpha=0.4)
plt.tight_layout()
plt.show()`,
        validator: (output, hasPlot) => output.includes("Lluvia semanal máxima") && hasPlot
      },
      {
        id: "m3_l3",
        title: "3.3 Feature Engineering: Ventanas Móviles (rolling) y Lluvia Antecedente",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 3.2</div>
            <p style="margin: 0 0 0.5rem 0;">
              En la lección anterior agregaste datos en bloques fijos discretos (semanas y meses).
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Sin embargo, en el monitoreo diario de alerta temprana necesitamos evaluar <strong>cómo evoluciona el estado hídrico del talud día tras día</strong> considerando el agua infiltrada en las semanas previas: la <strong>lluvia antecedente móvil</strong>.
            </p>
            <p style="margin: 0;">
              En geotecnia (modelo de Chleborad y umbrales de USGS), se analizan dos horizontes temporales móviles: la lluvia de evento (3 días) y la lluvia acumulada profunda (30 días). En esta lección aprenderás a construir estas variables predictivas mediante <code>.rolling()</code> y <code>.cumsum()</code>.
            </p>
          </div>

          <!-- Contenedor Interactivo de Ventana Móvil -->
          <div id="rolling-window-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Ventanas Móviles Continuas en Pandas</h4>
          <p>
            El método <code>.rolling(window=30, min_periods=1)</code> desplaza una ventana de 30 días continuos. El parámetro <code>min_periods=1</code> es fundamental: calcula la suma con los días disponibles al inicio de la serie evitando generar 29 valores <code>NaN</code> iniciales.
          </p>
          <pre class="trace-pre"><code>df_activo['lluvia_30d'] = df_activo['p1'].rolling(window=30, min_periods=1).sum()
df_activo['acumulado_DE1'] = df_activo['DE1'].cumsum()</code></pre>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Lluvia Antecedente Móvil y Desplazamiento Acumulado</strong><br>
            Calcularás la lluvia antecedente móvil de 30 días y la deformación acumulada, graficando ambas series en dos subplots verticales sincronizados para contrastar detonante vs respuesta del talud.
          </div>
        `,
        instruction: "1. Aísla el periodo coactivo desde <code>'2020-03-24'</code> en <code>df_activo</code>.<br>2. Calcula la lluvia antecedente móvil de 30 días usando <code>.rolling(window=30, min_periods=1).sum()</code> y guárdala en <code>df_activo['lluvia_30d']</code>.<br>3. Calcula la deformación acumulada histórica usando <code>.cumsum()</code> sobre <code>df_activo['DE1']</code> y guárdala en <code>df_activo['acumulado_DE1']</code>.<br>4. Configura una figura de 2 subplots verticales (<code>2, 1</code>, 10 &times; 6 pulgadas) sincronizados con <code>sharex=True</code>:<br>&bull; Panel superior: lluvia antecedente de 30 días en color azul marino con línea horizontal roja punteada en su valor medio.<br>&bull; Panel inferior: deformación superficial acumulada en color púrpura.<br>5. Añade títulos, etiquetas de ejes, leyendas, cuadrículas y despliega con <code>plt.show()</code>.",
        initialCode: `# ==============================================================
# EJERCICIO 3.3: Lluvia Antecedente Móvil y Acumulados Históricos
# La matriz df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import pandas as pd
import matplotlib.pyplot as plt

# Paso 1: Aísla el periodo coactivo (desde '2020-03-24' en adelante) en df_activo:


# Paso 2: Calcula la lluvia antecedente móvil de 30 días (.rolling(30, min_periods=1).sum()):


# Paso 3: Calcula la deformación acumulada histórica (.cumsum()):


# Paso 4: Crea los 2 subplots (2, 1, sharex=True, figsize=(10, 6)), grafica ambas series,
# configura títulos, etiquetas, cuadrículas y despliega la gráfica:

`,
        hint: `Escribe:
df_activo = df_ancon.loc['2020-03-24':].copy()
p_col = 'p1' if 'p1' in df_activo.columns else 'p'

df_activo['lluvia_30d'] = df_activo[p_col].rolling(window=30, min_periods=1).sum()
df_activo['acumulado_DE1'] = df_activo['DE1'].cumsum()

fig, axs = plt.subplots(2, 1, figsize=(10, 6), sharex=True)
axs[0].plot(df_activo.index, df_activo['lluvia_30d'], color='navy', label='Lluvia 30d (mm)')
axs[0].set_title('Lluvia Antecedente Móvil a 30 Días', fontweight='bold')
axs[0].set_ylabel('Precipitación 30d (mm)')
axs[0].legend()
axs[0].grid(True, alpha=0.4)

axs[1].plot(df_activo.index, df_activo['acumulado_DE1'], color='purple', label='Deformación Acumulada (mm)')
axs[1].set_title('Deformación Acumulada DE1', fontweight='bold')
axs[1].set_ylabel('Apertura Acumulada (mm)')
axs[1].set_xlabel('Fecha')
axs[1].legend()
axs[1].grid(True, alpha=0.4)

plt.tight_layout()
plt.show()`,
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df_activo = df_ancon.loc['2020-03-24':].copy()
p_col = 'p1' if 'p1' in df_activo.columns else 'p'

df_activo['lluvia_30d'] = df_activo[p_col].rolling(window=30, min_periods=1).sum()
df_activo['acumulado_DE1'] = df_activo['DE1'].cumsum()

fig, axs = plt.subplots(2, 1, figsize=(10, 6), sharex=True)
axs[0].plot(df_activo.index, df_activo['lluvia_30d'], color='navy', label='Lluvia 30d (mm)')
axs[0].set_title('Lluvia Antecedente Móvil a 30 Días', fontweight='bold')
axs[0].set_ylabel('Precipitación 30d (mm)')
axs[0].legend()
axs[0].grid(True, alpha=0.4)

axs[1].plot(df_activo.index, df_activo['acumulado_DE1'], color='purple', label='Deformación Acumulada (mm)')
axs[1].set_title('Deformación Acumulada DE1', fontweight='bold')
axs[1].set_ylabel('Apertura Acumulada (mm)')
axs[1].set_xlabel('Fecha')
axs[1].legend()
axs[1].grid(True, alpha=0.4)

plt.tight_layout()
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m3_l4",
        title: "3.4 Análisis Cinemático: Tasas de Deformación y Velocidad de Movimiento (.diff)",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 3.3</div>
            <p style="margin: 0 0 0.5rem 0;">
              El desplazamiento acumulado solo cuantifica cuánto se ha movido la masa en total, pero no advierte sobre la inminencia de una rotura catastrófica.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              El parámetro crítico para el monitoreo y evacuación de taludes es la <strong>velocidad de deformación</strong> ($v = \\Delta s / \\Delta t$).
            </p>
            <p style="margin: 0;">
              Según el <strong>Método de la Velocidad Inversa de Fukuzono y Saito</strong>, cuando una masa inestable entra en fluencia terciaria acelerada hacia el colapso, su velocidad tiende al infinito ($v \to \infty$) y su recíproco tiende a cero ($1/v \to 0$). En Pandas, la velocidad diaria se calcula mediante la primera diferencia discreta: <code>.diff()</code>.
            </p>
          </div>

          <!-- Contenedor Interactivo de Velocidad y Aceleración -->
          <div id="velocity-acceleration-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Velocidad Diaria Discreta</h4>
          <p>
            Para datos con paso diario ($\\Delta t = 1$), la velocidad de apertura de grieta ($mm/\\text{día}$) se obtiene restando la medición del día anterior:
          </p>
          <pre class="trace-pre"><code>df_activo['velocidad_DE1'] = df_activo['DE1'].diff().fillna(0)</code></pre>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Velocidad Diaria de Apertura y Gráfico de Doble Eje</strong><br>
            Calcularás la velocidad diaria de apertura de grieta en <code>DE1</code>, identificarás la velocidad máxima registrada y graficarás en un lienzo con doble eje (<code>twinx()</code>) la velocidad frente al desplazamiento acumulado.
          </div>
        `,
        instruction: "1. Aísla el periodo coactivo desde <code>'2020-03-24'</code> en <code>df_activo</code>.<br>2. Calcula la tasa diaria de apertura (velocidad en mm/día) aplicando <code>.diff()</code> sobre <code>df_activo['DE1']</code> y reemplaza el primer valor nulo con <code>.fillna(0)</code> en la columna <code>df_activo['velocidad_DE1']</code>.<br>3. Muestra en consola la velocidad máxima de apertura registrada con <code>.max()</code>.<br>4. Configura una figura de 10 &times; 4.5 pulgadas y genera un gráfico de doble eje (<code>twinx()</code>):<br>&bull; Eje 1 (izquierdo): serie de velocidad diaria en color naranja (<code>'darkorange'</code>) con ancho de línea 1.5.<br>&bull; Eje 2 (derecho): deformación total acumulada (<code>df_activo['DE1'].cumsum()</code>) en color púrpura.<br>5. Añade título en negrilla, rótulos en ambos ejes Y, cuadrícula y despliega con <code>plt.show()</code>.",
        initialCode: `# ==============================================================
# EJERCICIO 3.4: Velocidad de Deformación y Doble Eje Cinemático
# La matriz df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import pandas as pd
import matplotlib.pyplot as plt

# Paso 1: Aísla el periodo coactivo (desde '2020-03-24' en adelante) en df_activo:


# Paso 2: Calcula la tasa diaria de velocidad con .diff().fillna(0) en df_activo['velocidad_DE1']:


# Paso 3: Muestra en consola la velocidad máxima registrada (.max()):


# Paso 4: Crea la figura y el eje gemelo con ax1.twinx(), grafica velocidad y desplazamiento acumulado,
# rotula ambos ejes Y, añade título, cuadrícula y muestra la figura:

`,
        hint: `Escribe:
df_activo = df_ancon.loc['2020-03-24':].copy()
df_activo['velocidad_DE1'] = df_activo['DE1'].diff().fillna(0)
print(f"Velocidad máxima registrada: {df_activo['velocidad_DE1'].max():.3f} mm/día")

fig, ax1 = plt.subplots(figsize=(10, 4.5))
ax1.plot(df_activo.index, df_activo['velocidad_DE1'], color='darkorange', label='Velocidad (mm/día)', linewidth=1.5)
ax1.set_ylabel('Velocidad de apertura (mm/día)', color='darkorange', fontweight='bold')
ax1.tick_params(axis='y', labelcolor='darkorange')
ax1.grid(True, linestyle='--', alpha=0.4)

ax2 = ax1.twinx()
ax2.plot(df_activo.index, df_activo['DE1'].cumsum(), color='purple', label='Desplazamiento Acumulado (mm)', linewidth=2)
ax2.set_ylabel('Desplazamiento total (mm)', color='purple', fontweight='bold')
ax2.tick_params(axis='y', labelcolor='purple')

plt.title('Cinemática del Talud: Velocidad Diaria vs. Desplazamiento Acumulado', fontweight='bold')
plt.tight_layout()
plt.show()`,
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df_activo = df_ancon.loc['2020-03-24':].copy()
df_activo['velocidad_DE1'] = df_activo['DE1'].diff().fillna(0)
print(f"Velocidad máxima registrada: {df_activo['velocidad_DE1'].max():.3f} mm/día")

fig, ax1 = plt.subplots(figsize=(10, 4.5))
ax1.plot(df_activo.index, df_activo['velocidad_DE1'], color='darkorange', label='Velocidad (mm/día)', linewidth=1.5)
ax1.set_ylabel('Velocidad de apertura (mm/día)', color='darkorange', fontweight='bold')
ax1.tick_params(axis='y', labelcolor='darkorange')
ax1.grid(True, linestyle='--', alpha=0.4)

ax2 = ax1.twinx()
ax2.plot(df_activo.index, df_activo['DE1'].cumsum(), color='purple', label='Desplazamiento Acumulado (mm)', linewidth=2)
ax2.set_ylabel('Desplazamiento total (mm)', color='purple', fontweight='bold')
ax2.tick_params(axis='y', labelcolor='purple')

plt.title('Cinemática del Talud: Velocidad Diaria vs. Desplazamiento Acumulado', fontweight='bold')
plt.tight_layout()
plt.show()`,
        validator: (output, hasPlot) => output.includes("Velocidad máxima registrada:") && hasPlot
      },
      {
        id: "m3_l5",
        title: "3.5 Descomposición de Series Temporales (Tendencia, Estacionalidad y Residuo)",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 3.4</div>
            <p style="margin: 0 0 0.5rem 0;">
              Una serie de monitoreo geotécnico como la inclinación <code>C1</code> no es puramente aleatoria ni puramente monótona: superpone múltiples procesos físicos acoplados.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Mediante la <strong>descomposición aditiva clásica</strong> de series temporales, separamos algebraicamente la señal original $Y(t)$ en tres componentes independientes:
              $$Y(t) = \\text{Tendencia}(t) + \\text{Estacionalidad}(t) + \\text{Residuo}(t)$$
            </p>
            <ul style="margin: 0.35rem 0 0.85rem 1.25rem; font-size: 0.88rem; line-height: 1.6;">
              <li><strong>Tendencia $T(t)$ (Largo Plazo):</strong> Movimiento plástico irreversible o rotación progresiva de la masa inestable.</li>
              <li><strong>Estacionalidad $S(t)$ (Cíclica):</strong> Fluctuaciones periódicas de dilatación/contracción térmica día-noche o ciclos mensuales de humedad.</li>
              <li><strong>Residuo $R(t)$ (Anomalías y Ruido):</strong> Variaciones de alta frecuencia. En geotecnia, los picos residuales extremos marcan <strong>eventos detonantes súbitos de movimiento no atribuibles a ciclos estacionales</strong>.</li>
            </ul>
          </div>

          <!-- Contenedor Interactivo de Descomposición -->
          <div id="decomposition-flow-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Implementación con <code>statsmodels</code></h4>
          <p>
            Utilizamos la función <code>seasonal_decompose</code> de <code>statsmodels.tsa.seasonal</code> con un periodo mensual (<code>period=30</code>) sobre la serie saneada:
          </p>
          <pre class="trace-pre"><code>from statsmodels.tsa.seasonal import seasonal_decompose

descomp = seasonal_decompose(df_activo['C1'], model='additive', period=30)
df_activo['C1_tendencia'] = descomp.trend
df_activo['C1_estacional'] = descomp.seasonal
df_activo['C1_residuo'] = descomp.resid</code></pre>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Descomposición del Inclinómetro C1</strong><br>
            Descompondrás la inclinación <code>C1</code> en sus tres componentes aditivas y graficarás la figura de 4 paneles alineados para aislar la rotación real de la ladera de los efectos estacionales.
          </div>
        `,
        instruction: "1. Aísla en <code>df_activo</code> el periodo coactivo desde <code>'2020-03-24'</code> y asegura la continuidad de <code>C1</code> aplicando <code>.interpolate().bfill().ffill()</code>.<br>2. Importa <code>seasonal_decompose</code> desde <code>statsmodels.tsa.seasonal</code> y calcula la descomposición aditiva con <code>period=30</code> sobre <code>df_activo['C1']</code>.<br>3. Asigna las componentes a tres nuevas columnas: <code>'C1_tendencia'</code> (<code>descomp.trend</code>), <code>'C1_estacional'</code> (<code>descomp.seasonal</code>) y <code>'C1_residuo'</code> (<code>descomp.resid</code>).<br>4. Configura una figura de 4 subplots verticales (<code>figsize=(10, 8)</code>, <code>sharex=True</code>) graficando en orden: Original, Tendencia, Estacionalidad y Residuo, asignando títulos o etiquetas de ejes a cada panel.<br>5. Muestra en pantalla la figura con <code>plt.show()</code>.",
        initialCode: `# ==============================================================
# EJERCICIO 3.5: Descomposición de Series Temporales (C1)
# La matriz df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose

# Paso 1: Aísla el periodo coactivo (desde '2020-03-24':) y asegura continuidad con .interpolate().bfill().ffill():


# Paso 2: Aplica seasonal_decompose con model='additive' y period=30 sobre df_activo['C1']:


# Paso 3: Extrae .trend, .seasonal y .resid en columnas de df_activo:


# Paso 4: Grafica los 4 subplots verticales sincronizados (sharex=True, figsize=(10, 8)):
# Panel 0: Original, Panel 1: Tendencia, Panel 2: Estacionalidad, Panel 3: Residuo


# Paso 5: Despliega la gráfica:

`,
        hint: `Escribe:
df_activo = df_ancon.loc['2020-03-24':].copy()
df_activo['C1'] = df_activo['C1'].interpolate(method='linear').bfill().ffill()

descomp = seasonal_decompose(df_activo['C1'], model='additive', period=30)
df_activo['C1_tendencia'] = descomp.trend
df_activo['C1_estacional'] = descomp.seasonal
df_activo['C1_residuo'] = descomp.resid

fig, axs = plt.subplots(4, 1, figsize=(10, 8), sharex=True)
axs[0].plot(df_activo.index, df_activo['C1'], color='deepskyblue', label='Original C1')
axs[0].set_ylabel('Original (°)')
axs[0].legend(loc='upper right')

axs[1].plot(df_activo.index, df_activo['C1_tendencia'], color='forestgreen', label='Tendencia')
axs[1].set_ylabel('Tendencia (°)')
axs[1].legend(loc='upper right')

axs[2].plot(df_activo.index, df_activo['C1_estacional'], color='purple', label='Estacionalidad')
axs[2].set_ylabel('Estacional (°)')
axs[2].legend(loc='upper right')

axs[3].plot(df_activo.index, df_activo['C1_residuo'], color='crimson', label='Residuo')
axs[3].set_ylabel('Residuo (°)')
axs[3].legend(loc='upper right')

plt.suptitle('Descomposición Temporal de la Inclinación C1', fontweight='bold')
plt.tight_layout()
plt.show()`,
        solution: `import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose

df_activo = df_ancon.loc['2020-03-24':].copy()
df_activo['C1'] = df_activo['C1'].interpolate(method='linear').bfill().ffill()

descomp = seasonal_decompose(df_activo['C1'], model='additive', period=30)
df_activo['C1_tendencia'] = descomp.trend
df_activo['C1_estacional'] = descomp.seasonal
df_activo['C1_residuo'] = descomp.resid

fig, axs = plt.subplots(4, 1, figsize=(10, 8), sharex=True)
axs[0].plot(df_activo.index, df_activo['C1'], color='deepskyblue', label='Original C1')
axs[0].set_ylabel('Original (°)')
axs[0].legend(loc='upper right')

axs[1].plot(df_activo.index, df_activo['C1_tendencia'], color='forestgreen', label='Tendencia')
axs[1].set_ylabel('Tendencia (°)')
axs[1].legend(loc='upper right')

axs[2].plot(df_activo.index, df_activo['C1_estacional'], color='purple', label='Estacionalidad')
axs[2].set_ylabel('Estacional (°)')
axs[2].legend(loc='upper right')

axs[3].plot(df_activo.index, df_activo['C1_residuo'], color='crimson', label='Residuo')
axs[3].set_ylabel('Residuo (°)')
axs[3].legend(loc='upper right')

plt.suptitle('Descomposición Temporal de la Inclinación C1', fontweight='bold')
plt.tight_layout()
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m3_l6",
        title: "3.6 Matrices de Correlación Multivariables (Pearson vs. Spearman) y Heatmap",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 3.5</div>
            <p style="margin: 0 0 0.5rem 0;">
              Al monitorear múltiples canales de instrumentación (lluvia, humedad, inclinación, temperatura y grietas), es imprescindible determinar qué variables se mueven en sincronía física.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              En la estadística clásica se utiliza el <strong>coeficiente de correlación lineal de Pearson ($r$)</strong>. Sin embargo, en geotecnia muchas respuestas son <strong>marcadamente no lineales</strong> (por ejemplo, la apertura de una grieta frente a la rotación del inclinómetro no es una línea recta, sino un proceso monótono con saltos y fluencia).
            </p>
            <p style="margin: 0;">
              Aquí es donde el <strong>coeficiente de Spearman ($\rho$)</strong> resulta indispensable: evalúa la <strong>monotonicidad de los rangos</strong> sin exigir proporcionalidad lineal estricta. En esta lección construirás y compararás ambas matrices mediante un mapa de calor (Heatmap).
            </p>
          </div>

          <!-- Contenedor Interactivo de Matriz de Correlación -->
          <div id="correlation-matrix-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Pearson vs. Spearman en Ancón Norte</h4>
          <p>
            Observa el comportamiento de <code>C1</code> (cabeceo) frente a <code>DE1</code> (extensómetro):
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem; margin: 1rem 0;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-cyan); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-cyan);">Pearson ($r = -0.03$) &bull; Ciego a No-Linealidad</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Al buscar únicamente una recta perfecta, Pearson concluye erróneamente que no existe relación entre la rotación del talud y la apertura de grieta.
              </p>
            </div>

            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-top: 3px solid var(--accent-emerald); border-radius: var(--radius-sm); padding: 0.85rem;">
              <strong style="color: var(--accent-emerald);">Spearman ($\rho = +0.69$) &bull; Sensibilidad Monótona</strong>
              <p style="font-size: 0.82rem; margin: 0.35rem 0; color: var(--text-muted);">
                Al evaluar el orden de los rangos, Spearman revela una fuerte concordancia física: cuando el ángulo de inclinación avanza, la grieta superficial se abre monótonamente.
              </p>
            </div>
          </div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">2. Visualización con Mapa de Calor (Heatmap) en Matplotlib</h4>
          <p>
            Utilizamos <code>ax.imshow(matriz_corr, cmap='coolwarm', vmin=-1, vmax=1)</code> junto con <code>fig.colorbar()</code> y anotaciones numéricas en cada celda para una interpretación visual inmediata.
          </p>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Construcción del Heatmap de Spearman</strong><br>
            Calcularás la matriz de correlación monotónica de Spearman sobre los sensores activos de Ancón Norte y graficarás el mapa de calor anotado con Matplotlib.
          </div>
        `,
        instruction: "1. Aísla en <code>df_activo</code> el periodo coactivo desde <code>'2020-03-24'</code> e interpola los nulos con <code>.interpolate().bfill().ffill()</code>.<br>2. Define la lista de canales a comparar: <code>cols = ['p1', 'sh1', 'C1', 'B1', 'Tem_1', 'DE1']</code> (usando <code>'p'</code> si <code>'p1'</code> no está disponible).<br>3. Calcula la matriz de correlación monotónica aplicando <code>df_activo[cols].corr(method='spearman')</code>.<br>4. Configura una figura de 8 &times; 6.5 pulgadas y traza el mapa de calor con <code>plt.imshow(matriz_spearman, cmap='coolwarm', vmin=-1, vmax=1)</code>, añadiendo barra de color (<code>plt.colorbar()</code>) y rotulando los ejes con los nombres de los sensores.<br>5. Mediante un bucle anidado, superpón el valor numérico en el centro de cada celda con <code>plt.text()</code>.<br>6. Asigna título en negrilla y despliega con <code>plt.show()</code>.",
        initialCode: `# ==============================================================
# EJERCICIO 3.6: Matriz de Correlación de Spearman y Heatmap
# La matriz df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import pandas as pd
import matplotlib.pyplot as plt

# Paso 1: Aísla el periodo coactivo (desde '2020-03-24':) e interpola nulos:


# Paso 2: Define la lista de columnas y calcula la matriz con .corr(method='spearman'):


# Paso 3: Crea la figura (8x6.5 pulgadas) y traza el mapa de calor con plt.imshow:


# Paso 4: Añade colorbar, rotula los ejes X e Y con los nombres de las columnas:


# Paso 5: Itera sobre cada celda para escribir el valor numérico con plt.text y muestra la figura:

`,
        hint: `Escribe:
df_activo = df_ancon.loc['2020-03-24':].copy().interpolate(method='linear').bfill().ffill()
p_col = 'p1' if 'p1' in df_activo.columns else 'p'
cols = [p_col, 'sh1', 'C1', 'B1', 'Tem_1', 'DE1']

matriz_spearman = df_activo[cols].corr(method='spearman')

fig, ax = plt.subplots(figsize=(8, 6.5))
cax = ax.imshow(matriz_spearman, cmap='coolwarm', vmin=-1, vmax=1)
fig.colorbar(cax, shrink=0.8)

ax.set_xticks(range(len(cols)))
ax.set_xticklabels(cols, rotation=45, ha='right')
ax.set_yticks(range(len(cols)))
ax.set_yticklabels(cols)

for i in range(len(cols)):
    for j in range(len(cols)):
        val = matriz_spearman.iloc[i, j]
        ax.text(j, i, f"{val:.2f}", ha='center', va='center',
                color='white' if abs(val) > 0.55 else 'black', fontweight='bold')

plt.title('Matriz de Correlación de Spearman (Monotónica)', fontweight='bold')
plt.tight_layout()
plt.show()`,
        solution: `import pandas as pd
import matplotlib.pyplot as plt

df_activo = df_ancon.loc['2020-03-24':].copy().interpolate(method='linear').bfill().ffill()
p_col = 'p1' if 'p1' in df_activo.columns else 'p'
cols = [p_col, 'sh1', 'C1', 'B1', 'Tem_1', 'DE1']

matriz_spearman = df_activo[cols].corr(method='spearman')

fig, ax = plt.subplots(figsize=(8, 6.5))
cax = ax.imshow(matriz_spearman, cmap='coolwarm', vmin=-1, vmax=1)
fig.colorbar(cax, shrink=0.8)

ax.set_xticks(range(len(cols)))
ax.set_xticklabels(cols, rotation=45, ha='right')
ax.set_yticks(range(len(cols)))
ax.set_yticklabels(cols)

for i in range(len(cols)):
    for j in range(len(cols)):
        val = matriz_spearman.iloc[i, j]
        ax.text(j, i, f"{val:.2f}", ha='center', va='center',
                color='white' if abs(val) > 0.55 else 'black', fontweight='bold')

plt.title('Matriz de Correlación de Spearman (Monotónica)', fontweight='bold')
plt.tight_layout()
plt.show()`,
        validator: (output, hasPlot) => hasPlot
      },
      {
        id: "m3_l7",
        title: "3.7 Correlación Rezagada (Time-Lagged Cross-Correlation) y Retardo Crítico",
        concept: `
          <div class="theory-narrative-bridge">
            <div class="bridge-tag">🔗 Conexión Pedagógica con la Lección 3.6</div>
            <p style="margin: 0 0 0.5rem 0;">
              En la matriz de correlación de la lección anterior observaste que la correlación instantánea entre la lluvia diaria y la deformación en el mismo día es baja.
            </p>
            <p style="margin: 0 0 0.5rem 0;">
              Esto no significa que la lluvia no sea el detonante: significa que <strong>el agua requiere tiempo para infiltrarse a través del perfil del suelo, alcanzar las superficies de falla y elevar las presiones de poros</strong>.
            </p>
            <p style="margin: 0;">
              Para descubrir cuantitativamente el desfase temporal físico, aplicamos <strong>Correlación Rezagada (*Time-Lagged Cross-Correlation*)</strong>: desplazamos la serie detonante en el tiempo mediante <code>.shift(lag)</code> para una ventana de retardos ($-14$ a $+14$ días). El retardo que alcance el pico de máxima correlación ($r_{\\max}$) define el <strong>tiempo de percolación y tránsito hidráulico</strong> de la ladera de Ancón Norte.
            </p>
          </div>

          <!-- Contenedor Interactivo de Correlación Rezagada -->
          <div id="lag-correlation-container" style="margin: 1.25rem 0;"></div>

          <h4 style="margin: 1.25rem 0 0.5rem; color: var(--text-main);">1. Desplazamiento Temporal con <code>.shift(lag)</code></h4>
          <p>
            Al calcular la correlación desplazada:
          </p>
          <pre class="trace-pre"><code># Desplaza la lluvia 'lag' días hacia adelante:
correlacion = df_activo['sh1'].corr(df_activo['p1'].shift(lag))</code></pre>
          <ul style="margin: 0.35rem 0 0.85rem 1.25rem; font-size: 0.88rem; line-height: 1.6;">
            <li><strong>Lag &gt; 0:</strong> La lluvia ocurre antes del incremento en la variable de respuesta (comportamiento causal físico).</li>
            <li><strong>Pico de Máxima Correlación:</strong> Representa los días que tarda el frente húmedo en viajar desde la superficie hasta la profundidad de la sonda.</li>
          </ul>

          <div class="theory-callout" style="border-left-color: var(--accent-cyan); margin: 0.85rem 0;">
            <strong>💡 Tu Turno en el Editor: Descubrimiento del Tiempo de Infiltración</strong><br>
            Calcularás la correlación rezagada entre la lluvia y la humedad para retardos de -14 a +14 días, identificarás el lag óptimo del pico máximo y trazarás el correlograma con su línea de cota crítica.
          </div>
        `,
        instruction: "1. Aísla en <code>df_activo</code> la ventana temporal desde <code>'2020-03-24'</code> en adelante y asegura continuidad aplicando <code>.interpolate().bfill().ffill()</code>.<br>2. Define el rango de retardos temporales de -14 a +14 días: <code>lags = range(-14, 15)</code>.<br>3. Mediante una lista por comprensión o un bucle, calcula la correlación de Pearson entre la humedad <code>df_activo['sh1']</code> y la lluvia desplazada <code>df_activo['p1'].shift(lag)</code> (o <code>'p'</code>) para cada valor de lag.<br>4. Identifica el retardo que alcanza la correlación máxima (<code>mejor_lag</code>) y el valor de correlación pico (<code>max_r</code>), y muéstralos en consola.<br>5. Configura una figura de 8.5 &times; 3.8 pulgadas, grafica los puntos del correlograma con marcadores circulares y línea verde azulada (<code>'teal'</code>), añade una línea vertical roja punteada en el lag del pico con <code>plt.axvline()</code>, titula, rotula ejes, cuadrícula y despliega con <code>plt.show()</code>.",
        initialCode: `# ==============================================================
# EJERCICIO 3.7: Correlación Rezagada (Tiempo de Infiltración)
# La matriz df_ancon ya se encuentra disponible en memoria.
# ==============================================================
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Paso 1: Aísla df_activo (desde '2020-03-24':) y asegura continuidad con .interpolate().bfill().ffill():


# Paso 2: Define el rango de retardos temporales (lags) de -14 a +14 días (range(-14, 15)):


# Paso 3: Calcula la correlación entre sh1 y la lluvia desplazada .shift(lag) para cada lag:


# Paso 4: Encuentra el lag del pico máximo de correlación y muéstralo en consola:


# Paso 5: Grafica el correlograma (lags vs correlación), añade línea vertical en el pico y muestra la figura:

`,
        hint: `Escribe:
df_activo = df_ancon.loc['2020-03-24':].interpolate().bfill().ffill()
p_col = 'p1' if 'p1' in df_activo.columns else 'p'

lags = range(-14, 15)
corrs = [df_activo['sh1'].corr(df_activo[p_col].shift(lag)) for lag in lags]

mejor_lag = list(lags)[np.argmax(corrs)]
max_r = max(corrs)
print(f"Máxima correlación alcanzada: r = {max_r:.3f} en lag = {mejor_lag} días")

plt.figure(figsize=(8.5, 3.8))
plt.plot(list(lags), corrs, marker='o', color='teal', linewidth=1.5)
plt.axvline(mejor_lag, color='crimson', linestyle='--', label=f'Pico: {mejor_lag} días (r={max_r:.3f})')
plt.axhline(0, color='gray', linestyle=':')
plt.title('Correlación Rezagada: Lluvia vs. Humedad en Ancón Norte', fontweight='bold')
plt.xlabel('Lag (días de retardo)')
plt.ylabel('Correlación de Pearson (r)')
plt.legend()
plt.grid(True, alpha=0.5)
plt.tight_layout()
plt.show()`,
        solution: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df_activo = df_ancon.loc['2020-03-24':].interpolate().bfill().ffill()
p_col = 'p1' if 'p1' in df_activo.columns else 'p'

lags = range(-14, 15)
corrs = [df_activo['sh1'].corr(df_activo[p_col].shift(lag)) for lag in lags]

mejor_lag = list(lags)[np.argmax(corrs)]
max_r = max(corrs)
print(f"Máxima correlación alcanzada: r = {max_r:.3f} en lag = {mejor_lag} días")

plt.figure(figsize=(8.5, 3.8))
plt.plot(list(lags), corrs, marker='o', color='teal', linewidth=1.5)
plt.axvline(mejor_lag, color='crimson', linestyle='--', label=f'Pico: {mejor_lag} días (r={max_r:.3f})')
plt.axhline(0, color='gray', linestyle=':')
plt.title('Correlación Rezagada: Lluvia vs. Humedad en Ancón Norte', fontweight='bold')
plt.xlabel('Lag (días de retardo)')
plt.ylabel('Correlación de Pearson (r)')
plt.legend()
plt.grid(True, alpha=0.5)
plt.tight_layout()
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
