# Cinza Studio — Sitio web

Web de una página para **Cinza Studio**, barbería y asesoría de imagen masculina
en Providencia, Santiago. Estética premium oscura, monocromática (negro, grises
de hormigón, blanco roto), tipografía Archivo expandida y animaciones al scroll.

## Estructura

```
cinza-studio/
├── index.html            # Página única (todas las secciones)
├── css/
│   └── styles.css        # Diseño completo (variables, secciones, responsive)
├── js/
│   └── main.js           # Nav, reveals, contadores, hero, galería, horarios, cursor
└── public/
    ├── brand/
    │   └── logo.jpg      # Logo de la marca (trazo continuo, tal cual el original)
    └── img/
        ├── hero/
        │   ├── cinza.png       # Render del local aportado (fuente, 2.2 MB)
        │   └── cinza.webp      # Versión optimizada usada en el hero (96 KB)
        ├── gallery/
        │   └── g1–g16.jpg      # Fotos de muestra (Unsplash) — reemplazar por fotos reales
        └── team/
            └── t1–t7.jpg       # Retratos de muestra (Unsplash) — reemplazar por fotos reales
```

## Cómo verla

Es un sitio 100% estático. Opciones:

```bash
# Opción 1: servidor local
cd cinza-studio
python3 -m http.server 8080
# → http://localhost:8080

# Opción 2: abrir index.html directamente en el navegador
```

## Secciones

1. Nav fija con menú y botón **Reservar**
2. Hero a pantalla completa — lema gigante interactivo (spotlight que sigue al mouse,
   efecto scramble al cargar, parallax al scroll)
3. Manifiesto: CORTE · BARBA · ESTILO · DISCIPLINA · PRESENCIA
4. Filosofía: cada corte según la estructura del rostro (columna sticky)
5. Cifras con contadores animados (+1.000 clientes)
6. Servicios y precios por categoría (CLP)
7. Galería — grid masonry, hover destaca, clic pone la foto en primer plano (lightbox)
8. Equipo (6 barberos)
9. Marquee con nombre y conceptos de marca (doble fila, direcciones opuestas)
10. Contacto: dirección, mapa embebido, horarios con estado abierto/cerrado
    (calculado en hora de Santiago), WhatsApp e Instagram
11. Footer

## Datos del negocio (donde están)

| Dato | Dónde |
|---|---|
| Links de reserva | `index.html` — todos los botones "Reservar" → `https://cinza.site.agendapro.com/cl/sucursal/216010` |
| WhatsApp | `index.html` — `https://wa.me/56947997276` |
| Instagram | `index.html` — `https://www.instagram.com/cinzastudio.cl/` |
| Horarios | `js/main.js` → objeto `HOURS` (L–S 10–20, D 11–17, `America/Santiago`) |
| Precios / servicios | `index.html` → sección `#servicios` |
| Equipo | `index.html` → sección `#equipo` |
| Colores / tipografía | `css/styles.css` → `:root` |

## Notas

- **Fotos**: la galería, el equipo y la filosofía usan fotos de muestra de Unsplash.
  Reemplazar los archivos en `public/img/` manteniendo los nombres (o editando los
  `src` en `index.html`).
- **Mapa**: iframe de Google Maps con `output=embed` (no requiere API key),
  estilizado en modo oscuro con filtro CSS.
- **Accesibilidad**: skip-link, `aria` en menú/lightbox, foco visible,
  `prefers-reduced-motion` desactiva animaciones.
- **Responsive**: breakpoints en 1024px y 640px; menú hamburguesa en móvil.
