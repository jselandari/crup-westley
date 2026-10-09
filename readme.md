# Escore de Westley

PWA para calcular el score de Westley (gravedad del crup). Funciona sin conexión.

## Puntaje

| Ítem | Opciones |
|---|---|
| Conciencia | Normal = 0 · Desorientado = 5 |
| Cianosis | Ausente = 0 · Con agitación = 4 · En reposo = 5 |
| Estridor | Ausente = 0 · Con agitación = 1 · En reposo = 2 |
| Entrada de aire | Normal = 0 · Disminuida = 1 · Marcadamente disminuida = 2 |
| Retracciones | Ausentes = 0 · Leves = 1 · Moderadas = 2 · Graves = 3 |

| Puntaje | Crup |
|---|---|
| ≤ 2 | Leve |
| 3 a 5 | Moderado |
| 6 a 11 | Grave |
| ≥ 12 | Insuficiencia respiratoria inminente |

## Archivos

```
index.html
app.js
styles.css
manifest.json
sw.js
readme.md
icons/
  icon-192.png
  icon-512.png
  icon-maskable-512.png
  icon-maskable-640.png
  apple-touch-icon.png
```

Íconos sugeridos: 192×192, 512×512, maskable 512×512 y 640×640 (contenido importante dentro del 80 % central), apple-touch-icon 180×180.

## Publicar en GitHub Pages

1. Subir todo a la raíz del repositorio (con la carpeta `icons/`).
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Abrir `https://<usuario>.github.io/<repo>/`.

Todas las rutas son relativas, así que funciona en subcarpetas.

## Actualizar

Al cambiar cualquier archivo, subir el número de versión en `sw.js` (`westley-v1` → `westley-v2`) para que los dispositivos descarguen la versión nueva.

Herramienta de apoyo. No reemplaza el juicio clínico.
