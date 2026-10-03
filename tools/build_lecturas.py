#!/usr/bin/env python3
"""Regenera lecturas.html (datos embebidos) y el README de cada carpeta de lecturas/.

Uso (desde la raíz del repositorio):
    python3 tools/build_lecturas.py

La fuente de verdad es lecturas/lecturas.json. Para agregar una lectura:
  1. Añade un objeto en "lecturas" (copia uno existente) y, si tienes el PDF y su
     licencia permite redistribuirlo, guárdalo en la carpeta del módulo y pon su ruta en "pdf".
  2. Ejecuta este script.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / 'lecturas' / 'lecturas.json').read_text(encoding='utf-8'))

# 1) lecturas.html
html_path = ROOT / 'lecturas.html'
html = html_path.read_text(encoding='utf-8')
payload = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
html, n = re.subn(r'(<script id="lecturas-data" type="application/json">).*?(</script>)',
                  lambda m: m.group(1) + payload + m.group(2), html, count=1, flags=re.S)
assert n == 1, 'No se encontró el bloque de datos en lecturas.html'
html_path.write_text(html, encoding='utf-8')

# 2) README por carpeta
LV = {'esencial': '⭐ Esencial', 'complementaria': 'Complementaria'}
for m in data['modulos']:
    items = [x for x in data['lecturas'] if x['modulo'] == m['id']]
    lines = [f"# {m['icono']} {('Clase 00' if m['n'] == 0 else 'Módulo ' + str(m['n']))}: {m['titulo']}", '',
             m['intro'], '',
             f"Versión navegable, con preguntas guía y progreso: <{data['base']}lecturas.html#{m['id']}>", '']
    for x in items:
        lines.append(f"## {x['orden']}. {x['titulo']}")
        lines.append(f"{x['autores']} ({x['anio']}). *{x['fuente']}*. — {LV[x['nivel']]}")
        lines.append('')
        lines.append(f"- **Cómo complementa la clase:** {x['complementa']}")
        lines.append(f"- **Pregunta guía:** {x['pregunta']}")
        lines.append(f"- **Enlace:** {x['url']}")
        if x.get('pdf'):
            lines.append(f"- **PDF en el repositorio:** [{Path(x['pdf']).name}]({Path(x['pdf']).name}) · {x['licencia']}")
        else:
            lines.append(f"- **Acceso:** {x['licencia']}")
        lines.append('')
    out = ROOT / m['carpeta'] / 'README.md'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text('\n'.join(lines), encoding='utf-8')
print('OK:', len(data['lecturas']), 'lecturas,', len(data['modulos']), 'módulos')
