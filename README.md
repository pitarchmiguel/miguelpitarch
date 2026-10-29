# STUDIO / 01 — Miguel Pitarch

Portfolio personal con Next.js App Router, TypeScript estricto y Tailwind CSS 4. Primera fase del diseño responsive: sin scroll virtual, cursores personalizados, transiciones de página, parallax ni animaciones complejas.

## Desarrollo

Requisitos: Node.js 24 y npm 11 (Node mínimo de Next.js: 20.9).

```sh
npm ci
npm run dev
```

El servidor de desarrollo usa el puerto 3000. Para elegir otro: `npm run dev -- --port 3001`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

Pruebas de navegador reproducibles:

```sh
npx playwright install chromium
npm run test:e2e
```

En el entorno cloud ya existe Chromium: `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e`. La suite cubre escritorio y móvil, navegación, foco del menú, imágenes, ausencia de desbordamiento y páginas 404.

`npm start` sirve la compilación de producción. No requiere variables de entorno, credenciales ni servicios externos para funcionar. Las fuentes y las imágenes se sirven localmente. En el entorno cloud, usar `npm ci --cache /workspace/.npm` si el caché predeterminado no es escribible.

## Contenido

- `/`: presentación, sobre mí, proyectos seleccionados y contacto.
- `/proyectos/palabrio`: herramienta para aprender inglés.
- `/proyectos/qr-carta`: SaaS de carta digital para bares y restaurantes.
- Los proyectos aún no tienen URL pública. No se muestran demos, métricas, clientes o resultados inventados.
- Datos de proyectos: `src/lib/projects.ts`.
- Contacto: `src/components/contact.tsx`. Se conserva `hello@miguelpitarch.com`, del portfolio anterior.

## Diseño y recursos

Referencia de composición: https://www.dennissnellenberg.com/, inspeccionada en escritorio (1440 × 900) y móvil (390 × 844). Adaptación a Miguel Pitarch: retrato, nombre, textos y proyectos propios. Los recursos del sitio de referencia no se distribuyen con la aplicación.

Se utiliza Inter Variable como alternativa de licencia libre a Neue Montreal. La fuente se instala mediante `@fontsource-variable/inter` (SIL Open Font License). Iconos de Lucide (ISC), alternativa libre a las marcas de navegación. Licencias en `docs/licenses/`.

Las imágenes de `public/images/` son provisionales y se han convertido a WebP:

- `miguel-studio.webp`: extensión de estudio asistida por IA a partir de `public/profile.png`. No representa una nueva sesión fotográfica real. Sustituir por un retrato propio de alta resolución antes de publicar una versión definitiva.
- `palabrio.webp` y `qr-carta.webp`: portadas conceptuales generadas; no son capturas de las aplicaciones.

La fase siguiente puede añadir los efectos de movimiento por separado, manteniendo alternativas con movimiento reducido.

## Accesibilidad y comportamiento

Menú modal nativo con foco contenido, cierre con Escape y bloqueo de scroll; enlace para saltar al contenido; navegación por teclado; nombres accesibles de controles; hora local de Madrid sin discrepancias de hidratación. Los enlaces externos se abren con `noopener noreferrer`. Las fichas de proyectos enlazan a páginas internas reales.

Consulta `design-qa.md` para las pruebas visuales y las diferencias intencionadas respecto a la referencia. Esta rama no se ha fusionado ni desplegado.
