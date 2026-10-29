# STUDIO / 01 — Movimiento ajustado al vídeo

Referencia adicional: `Screen Recording 2026-10-29 at 20.14.21_resized.mov`, facilitada por el usuario. Inspeccionados 44,93 segundos a 1204 × 720 mediante secuencias de fotogramas, incluidos los detalles del puntero entre los segundos 23–27 y la entrada del pie entre 39–45. La composición estática de la fase uno se conserva; la implementación no copia sus recursos gráficos ni incorpora bibliotecas de animación.

## Comportamiento

- Nombre continuo con velocidad ajustada y cambio progresivo de dirección al subir/bajar. Web Animations API conserva el avance al invertir la velocidad. Un control permite pausar; también se detiene fuera de pantalla. La animación no se inicia sin JavaScript.
- Retrato con parallax discreto de escritorio al desplazar la página. Se mantiene el scroll nativo.
- Aparición de introducción, proyectos y contacto mediante IntersectionObserver, sin ocultar el contenido ya visible ni el destino del foco.
- Menú con entrada lateral y enlaces escalonados, conservando dialog, Tab contenido, Escape y restauración del foco.
- Atracción más marcada de botones circulares, desplazamiento independiente de su texto y retorno elástico. Relleno azul ascendente en botones circulares y de contorno.
- Una previsualización global, fija al viewport y decorativa, reemplaza el seguimiento limitado al interior de cada fila. La imagen se acerca al cursor con una constante de suavizado de 100ms, y el círculo azul con 48ms. Al cambiar de fila, las portadas se deslizan verticalmente durante 600ms. Se conserva el enlace real bajo la capa y la previsualización estática al usar teclado.
- La capa del cursor no intercepta eventos, se oculta al salir, al cambiar a teclado o al perder el foco, y se recorta al viewport para no generar scroll horizontal.
- El borde blanco sobre el pie se aplana con el scroll y el contenido oscuro entra con un pequeño desplazamiento relativo.

Las cifras son parámetros de esta implementación, no mediciones exactas de la web original. `prefers-reduced-motion` desactiva animaciones, parallax, cursor y magnetismo, también al cambiar la preferencia con la página abierta. En pantallas táctiles permanecen las fichas estáticas y los enlaces normales. Observadores, eventos y frames pendientes se limpian al navegar.

## Validación final

- Lint, comprobación de tipos y build de producción: pasan.
- Suite Playwright sobre producción: **12 pasan, 0 fallan, 0 omitidas**, escritorio y móvil. Cubre navegación, foco, pausa, movimiento reducido, inversión real de velocidad, seguimiento del cursor cerca del borde de una fila, cambio de proyecto, ausencia de desbordamiento, imágenes y 404.
- Secuencia adicional de navegador en producción a 1440×900: nombre en ambas direcciones, varios movimientos laterales sobre una fila, cambio a QR Carta, botón magnético y relleno, dos posiciones del pie y cambio a movimiento reducido. Sin errores JavaScript.
- Comprobación adicional a 390×844: ficha estática, sin capa de cursor ni desbordamiento, y navegación a Palabrio.
- Capturas inspeccionadas en `/workspace/shared/studio01/video-match/`: `hero.png`, `project-enter.png`, `project-follow.png`, `project-switch.png`, `magnetic-fill.png`, `footer-enter.png`, `footer-open.png`, `mobile-work.png`.
- Fotogramas de la referencia en `/workspace/shared/studio01/video-reference/`: `contact-sheet.jpg`, `hover-sequence.jpg`, `footer-sequence.jpg`.

La revisión de estructura estática está en `design-qa.md`. No se afirma equivalencia exacta con todos los detalles del original ni validación en hardware Safari/iOS.
