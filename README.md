# Stockia — App Web de Inventarios

Stockia es una aplicación estática de gestión de inventarios construida con HTML5, CSS3 y JavaScript nativo en módulos ES. No requiere Node, npm, Vite ni un proceso de compilación.

## Ejecutar

Como el navegador restringe los módulos ES al abrirlos con `file://`, usá cualquier servidor estático. Por ejemplo:

```bash
python3 -m http.server 8000
```

Luego abrí `http://localhost:8000/`.

`index.html` carga directamente `/src/styles/main.css` y `/src/main.js`; todos los imports de `src/` son relativos y no dependen de paquetes externos.

## Cambios de esta versión

- Se eliminó el buscador global del header, el ícono de lupa y el atajo `⌘K`/`Ctrl+K`.
- Se mantuvo el buscador de la tabla de Productos: “Filtrar por nombre, SKU o pasillo…”.
- Se eliminó el botón “Menú” y el estado manual de expansión del sidebar.
- El sidebar reserva un riel fijo de 72 px cuando está colapsado, muestra íconos centrados en áreas clicables de 40×40 px y se expande suavemente hasta 260 px por hover/foco como superposición, sin desplazar el contenido.
- Se conservaron el cambio claro/oscuro, los badges y el avatar/logout.
- Se eliminó la pantalla, ruta, navegación, drawer y servicios exclusivos de Proveedores.
- La conversión de kits/cajas continúa funcionando. El contador de kits representa productos cuyo SKU comienza con `KIT-`; no es una pantalla ni un vínculo con un módulo de Proveedores.
- Se eliminaron Node, npm, Vite y los artefactos de build. La aplicación no compila ni ejecuta un bundle: se sirve como archivos estáticos.

## Estructura

```text
index.html
public/
src/
  components/   UI reutilizable y drawers
  core/         store, router, iconos y formateadores
  data/         datos iniciales de demostración
  services/     reglas de inventario y autenticación
  views/        pantallas de la aplicación
  styles/       hojas CSS modulares
docs/           documentación técnica, guía y capturas
```

## Verificación

La verificación recomendada es:

```bash
python3 -m http.server 8000
```

Abrí la consola del navegador y comprobá el login, la navegación, el filtro de Productos, el cambio de tema, la expansión por hover del sidebar y la conversión de kits. No deben aparecer errores de módulos ni referencias a npm/Vite/Node.

La lista detallada de modificaciones y decisiones está en [`docs/ARQUITECTURA_Y_DOCUMENTACION.md`](docs/ARQUITECTURA_Y_DOCUMENTACION.md). Las capturas comparativas están en `docs/screenshots/sidebar-before-1280.png` y `docs/screenshots/sidebar-after-1280.png`.
