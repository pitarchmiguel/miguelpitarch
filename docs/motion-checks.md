# STUDIO / 01 — Segunda fase: movimiento

Se mantiene la composición de la fase uno. No se añade ninguna dependencia ni se sustituye el scroll nativo.

## Efectos

- Nombre en cinta continua con copia decorativa oculta para lectores de pantalla. Control de pausa/reanudación; se detiene al salir de pantalla y no se inicia sin JavaScript.
- Aparición de introducción, proyectos y contacto mediante IntersectionObserver. El contenido inicialmente visible no se oculta, y el foco de teclado mantiene visible su destino.
- Entrada lateral del menú y aparición escalonada de sus enlaces. Se conservan dialog nativo, Tab contenido, Escape y restauración del foco.
- Botones circulares con atracción suave hacia el ratón. Se conserva el posicionamiento propio del botón de contacto.
- Portadas de proyectos con seguimiento suave del puntero, pequeña inclinación y entrada al pasar el ratón. En móvil permanecen como imágenes estáticas.
- Transiciones de color, flechas y botón flotante de navegación.

`prefers-reduced-motion` desactiva animaciones, transiciones y desplazamientos magnéticos. Cambiar esa preferencia con la página abierta elimina observadores y eventos de puntero. Los efectos del ratón se desactivan en dispositivos táctiles. Los eventos y requestAnimationFrame pendientes se limpian al navegar.

## Validación

- Lint, comprobación de tipos y build de producción: pasan.
- Suite Playwright: 8 pruebas pasan, 0 fallan; escritorio y móvil.
- Verificación adicional sobre producción a 1440×900 y 390×844: transformación del nombre cambia en el tiempo; pausa/reanudación; variables de seguimiento del ratón y botones; cambio a movimiento reducido; sin desbordamiento ni errores JavaScript.
- Contenido visible y nombre sin animar con JavaScript desactivado.
- Capturas inspeccionadas en `/workspace/shared/studio01/motion/`: `desktop-hero.png`, `desktop-project-hover.png`, `desktop-menu.png`, `mobile-hero.png`, `mobile-work.png` y `mobile-menu.png`.
- La primera ejecución encontró un servidor de producción anterior aún activo con recursos de otra compilación; se detuvo y la suite se repitió con un servidor limpio. El resultado válido es el de las 8 pruebas completadas.

La revisión visual de estructura estática de la fase uno se conserva en `design-qa.md`. No se afirma equivalencia exacta con todos los efectos originales de la referencia, ni validación en hardware Safari/iOS.
