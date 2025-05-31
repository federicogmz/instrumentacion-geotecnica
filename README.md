# Curso de Instrumentación Geotécnica | Universidad EAFIT

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)  
![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg) ![Jupyter Notebooks](https://img.shields.io/badge/Notebooks-Jupyter-orange) ![Data Science](https://img.shields.io/badge/Focus-Data%20Science-green)

---

### Docentes
- **M.Eng. Federico Gómez**  
  [fjgomezc@eafit.edu.co](mailto:fjgomezc@eafit.edu.co)
- **M.Eng. Juliana Álvarez**  
  [jalvarezz@eafit.edu.co](mailto:jalvarezz@eafit.edu.co)

---

## Descripción General

Este curso está diseñado para introducir a los estudiantes en el mundo de la instrumentación geotécnica, combinando conceptos teóricos con aplicaciones prácticas y el uso de herramientas modernas de análisis de datos. A través de casos de estudio reales y el manejo de sensores, los participantes aprenderán a leer, analizar y visualizar datos relevantes para la ingeniería geotécnica.

Para facilitar tu aprendizaje, puedes abrir y ejecutar los notebooks interactivos directamente en Google Colab:

[![Abrir en Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/)

## Objetivos del Curso

- Comprender los principios básicos de la instrumentación geotécnica y su importancia en la ingeniería civil.
- Familiarizarse con los principales tipos de sensores utilizados en monitoreo geotécnico.
- Desarrollar habilidades en el manejo y análisis de datos utilizando Python.
- Aplicar técnicas de visualización para interpretar resultados y tomar decisiones informadas.
- Analizar un caso de estudio real integrando diferentes fuentes de información.

## Contenido teórico del curso

### Módulo 1: Conceptos básicos de la Instrumentación Geotécnica
La instrumentación geotécnica es esencial para anticipar riesgos y garantizar la estabilidad de estructuras y suelos. Este módulo sienta las bases técnicas y conceptuales, desde su importancia hasta las herramientas clave para implementarla.
- ¿Por qué es fundamental la instrumentación geotécnica?
- ¿Qué debemos monitorear?
- Escalas de monitoreo
- Tipos de sensores
- Riesgo a partir de amenazas

### Módulo 2: Variables hidrometeorológicas
El agua, en sus distintas formas, es un agente crítico en la geotecnia. Este módulo analiza cómo fenómenos como la lluvia influyen en fallas geotécnicas y qué métodos emplear para monitorearlos.
- ¿Por qué se producen fallas en estructuras, suelo o rocas?
- Factores de falla: condicionantes, pre-detonantes y detonantes
- La lluvia como factor detonante
- ¿Cómo estudiar y entender la lluvia?
- Monitoreo de la lluvia
- Pluviómetros, radares y satélites

### Módulo 3: El agua en el suelo
El equilibrio hídrico del suelo determina su estabilidad. Este módulo explora el papel del agua en fallas geotécnicas, desde la infiltración hasta tecnologías para medir su impacto.
- ¿Por qué se producen fallas en estructuras, suelo o rocas?
- La lluvia y la humedad como factores pre-detonantes y detonantes
- Impacto del agua en los suelos desde una perspectiva geotécnica
- Infiltración: ¿Cómo afecta la estabilidad interna del suelo?
- Monitoreo de la humedad del suelo
- Sensores de humedad, tensiómetros, piezómetros, lisímetros y satélites

### Módulo 4: Medición de deformaciones
Las deformaciones son indicadores silenciosos de posibles colapsos. Este módulo aborda su origen, relevancia y las tecnologías para detectarlas, desde métodos tradicionales hasta innovaciones satelitales.
- Deformaciones en suelos y estructuras
- Importancia de medir y monitorear deformaciones
- ¿Qué causa las deformaciones?
- Relación entre esfuerzos y deformaciones
- Instrumentos para medir deformaciones
- Extensómetros, acelerómetros, inclinómetros, TDR, drones y satélites

### Módulo 5: Interpretación y análisis de datos en instrumentación geotécnica
Los datos sin análisis son solo números. Este módulo enseña a transformar información cruda en decisiones, integrando técnicas estadísticas, modelos teóricos y protocolos de acción.
- Interpretación de datos
- Etapas de la interpretación de datos
  - Pre-procesamiento
  - Análisis de tendencias
  - Comparación de modelos teóricos
  - Análisis espacial
  - Evaluación de desempeño estructural
- Criterios de alarma y acción

## Contenido práctico del curso

### Módulo 1: Introducción a Python
- Configuración del entorno de trabajo: uso de Jupyter Notebooks, Google Colab o VSCode para escribir y ejecutar código Python.
- Sintaxis básica de Python: declaración de variables, tipos de datos (números, texto, booleanos), operaciones matemáticas y condicionales (`if`, `else`).
- Estructura y uso de funciones simples con `def` para reutilizar código.
- Manipulación de datos con listas y pandas: creación de listas, acceso a elementos, operaciones básicas y uso de pandas para leer y analizar datos en tablas (DataFrames).
- Consulta de apéndice en el notebook para ejemplos rápidos de funciones y comandos útiles.

### Módulo 2: Visualización de Datos
- Carga, integración y limpieza de datos reales de sensores usando pandas.
- Gráficas de líneas simples y multivariables para análisis temporal y comparativo.
- Remuestreo y agregación de datos para análisis por día, semana, etc.
- Boxplots para detección visual de dispersión y valores atípicos (outliers), con explicación interpretativa.
- Detección de anomalías mediante líneas de referencia (media, cuartiles, límites de boxplot).
- Histogramas para analizar la distribución de variables.
- Gráficas con doble eje para comparar variables con diferentes escalas (ejemplo: humedad vs. precipitación).

### Módulo 3: Análisis y Manejo de Datos Temporales
- Limpieza y transformación de datos: manejo de valores nulos, interpolación lineal y comparación con otros métodos.
- Identificación de valores atípicos (outliers) y anomalías en todas las series y escalas mediante Z-Score y método de Tukey (boxplot).
- Análisis exploratorio: estadísticas descriptivas, visualización de acumulados, tasas de cambio y boxplots.
- Descomposición de series temporales: obtención de tendencia, estacionalidad y residuos para cada variable y escala.
- Comparación de tendencias y análisis de periodos críticos, especialmente en presencia de anomalías.
- Análisis de correlación y correlación rezagada entre variables para identificar influencias y periodos de interés.

## Sensores y Equipos Utilizados

- **Pluviómetro:** Medición de precipitación para evaluar la influencia de la lluvia en la estabilidad del terreno.
- **Acelerómetro:** Detección de movimientos del suelo.
- **Extensómetro:** Monitoreo de deformaciones y desplazamientos en el terreno.
- **Sensor de Humedad:** Evaluación del contenido de agua en el suelo.
- **TDR (Reflectometría en el Dominio del Tiempo):** Medición de deformaciones en el subsuelo.
- **Cámaras y Drones:** Inspección visual, generación de mapas de cambios y perfiles topográficos.

## Recursos del Curso

- Notebooks interactivos en la carpeta `notebooks/` para cada módulo.
- Datos reales en la carpeta `data/` para análisis y ejercicios prácticos.
- Documentos de referencia y material complementario.

## Recomendaciones para el Estudio

- Explora y ejecuta los notebooks para afianzar los conceptos.
- Analiza los datos de sensores y experimenta con diferentes visualizaciones.
- Consulta la bibliografía recomendada y los recursos adicionales.
- Participa activamente en las discusiones y plantea tus dudas.

## Contacto

Para preguntas, sugerencias o acompañamiento durante el curso, no dudes en escribirnos a los correos de los docentes.

---

¡Te damos la bienvenida y te deseamos una experiencia de aprendizaje enriquecedora y exitosa en instrumentación geotécnica!