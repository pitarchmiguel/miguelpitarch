gsap.registerPlugin(ScrollTrigger);

const isTouch = matchMedia("(hover: none)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------------- Smooth scroll (Lenis) ---------------- */
const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

$$('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const target = a.getAttribute("href");
    if (target.length < 2 && target !== "#top") return;
    e.preventDefault();
    closeMenu();
    lenis.scrollTo(target === "#top" ? 0 : target, { duration: 1.6 });
  })
);

/* ---------------- Loader ---------------- */
const words = ["Hello", "Hola", "Bonjour", "Ciao", "Olá", "やあ", "Hallå", "Guten tag", "Hallo"];
document.body.classList.add("is-loading");

function runLoader() {
  const text = $(".loader__text");
  const word = $(".loader__word");
  const path = $(".loader__curve path");
  const curved = "M0 0 Q500 100 1000 0 L1000 0 L0 0 Z";
  const flat = "M0 0 Q500 0 1000 0 L1000 0 L0 0 Z";
  gsap.set(path, { attr: { d: curved } });

  const tl = gsap.timeline();
  tl.to(word, { opacity: 1, duration: 0.4 });
  words.forEach((w, i) => {
    tl.call(() => (text.textContent = w), null, i === 0 ? 0.6 : `+=${i === 1 ? 0.35 : 0.14}`);
  });
  tl.to(word, { opacity: 0, y: -40, duration: 0.5, ease: "power2.in" }, "+=0.25")
    .to(".loader", { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, "-=0.2")
    .to(path, { attr: { d: flat }, duration: 0.9, ease: "power3.inOut" }, "<")
    .add(heroIn, "-=0.45")
    .call(() => {
      $(".loader").remove();
      document.body.classList.remove("is-loading");
      lenis.start();
    });
}

function heroIn() {
  gsap.from(".nav", { y: -40, opacity: 0, duration: 1.1, ease: "power3.out" });
  landscapeIn();
  gsap.from(".hero__badge", { y: 20, opacity: 0, duration: 1, ease: "power3.out", delay: 0.15 });
  gsap.from(".hero__line > span", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: 0.1, delay: 0.2 });
  gsap.from([".hero__sub", ".hero__cta"], { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.45 });
}

/* ---------------- Logo: "© Code by Miguel" → "Miguel Pitarch" ---------------- */
function setupLogo() {
  const roll = $(".logo__roll");
  const code = $(".logo__code").offsetWidth;
  const name = $(".logo__name").offsetWidth;
  const full = $(".logo__full").offsetWidth;
  roll.style.setProperty("--w-a", `${code + name}px`);
  roll.style.setProperty("--w-b", `${name + full}px`);
  roll.style.setProperty("--shift", `${code}px`);
}

/* ---------------- Hero: parallax + flecha ---------------- */
function setupHero() {
  gsap.set(".hero__content", { xPercent: -50, yPercent: -54, x: 0, y: 0 });
  const st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__content", { y: "-14vh", opacity: 0, ease: "none", scrollTrigger: st });
}

/* ---------------- Paisaje del hero por capas ---------------- */
// Cada capa es un elemento propio (<img> o <div>) dentro de un "escenario" 1920×1200
// escalado tipo cover. Las imágenes se decodifican una vez durante el loader y luego
// solo se mueven con transform, que lo hace la GPU sin volver a pintar nada.
const STAGE_W = 1920;
const STAGE_H = 1200;
let stageScale = 1;
const pct = (v, total) => `${(v / total) * 100}%`;

function addLayer(stage, cls, box) {
  const el = document.createElement("div");
  el.className = `lx ${cls}`;
  if (box) Object.assign(el.style, { left: pct(box.x, STAGE_W), top: pct(box.y, STAGE_H), width: pct(box.w, STAGE_W), height: pct(box.h, STAGE_H) });
  stage.appendChild(el);
  return el;
}

async function loadLandscape() {
  const stage = $(".hero__stage");
  if (!stage) return;
  let manifest;
  try {
    manifest = await (await fetch("assets/landscape/layers.json")).json();
  } catch (e) {
    return; // sin capas se queda el degradado del cielo
  }

  addLayer(stage, "lx-sky");
  addLayer(stage, "lx-glow");
  const decodes = [];
  manifest.layers.forEach((l) => {
    if (l.kind === "tree" && !$(".lx-ground", stage)) addLayer(stage, "lx-ground");
    const el = addLayer(stage, `lx-${l.kind}${l.side ? ` lx-tree-${l.side}` : ""}`, l);
    if (l.depth !== undefined) el.dataset.depth = l.depth;
    if (l.speed !== undefined) el.dataset.speed = l.speed;
    const img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.src = `assets/landscape/${l.src}`;
    el.appendChild(img);
    decodes.push(img.decode().catch(() => {}));
  });

  setGrain();
  sizeStage();
  await Promise.all(decodes);
}

// Grano de película: una textura pequeña generada una vez (antes era un filtro SVG en vivo)
function setGrain() {
  const c = document.createElement("canvas");
  c.width = c.height = 160;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + Math.random() * 40;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = Math.random() * 22;
  }
  ctx.putImageData(img, 0, 0);
  $(".hero__grain").style.backgroundImage = `url(${c.toDataURL()})`;
}

function sizeStage() {
  const hero = $(".hero");
  const stage = $(".hero__stage");
  if (!stage) return;
  const w = hero.clientWidth;
  const h = hero.clientHeight;
  stageScale = Math.max(w / STAGE_W, h / STAGE_H);
  Object.assign(stage.style, {
    width: `${STAGE_W * stageScale}px`,
    height: `${STAGE_H * stageScale}px`,
    left: `${(w - STAGE_W * stageScale) / 2}px`,
    top: `${(h - STAGE_H * stageScale) / 2}px`,
  });
}

// valores en unidades del paisaje → px en pantalla
const u = (v) => () => v * stageScale;

function landscapeIn() {
  const ridges = $$(".lx-ridge > img");
  if (!ridges.length) return;
  gsap.from(".lx-glow", { opacity: 0, scale: 0.6, duration: 3, ease: "power2.out", delay: 0.2 });
  // de atrás hacia delante: las cercanas suben desde más abajo
  ridges.forEach((img, i) => {
    const depth = parseFloat(img.parentNode.dataset.depth);
    gsap.from(img, { y: u(120 + depth * 320), duration: 2.2 + depth * 0.4, ease: "power3.out", delay: 0.05 + i * 0.09 });
  });
  gsap.from(".lx-fog > img", { opacity: 0, duration: 3, ease: "power2.out", delay: 0.7 });
  gsap.from(".lx-tree-l > img", { x: u(-320), duration: 2.2, ease: "power3.out", delay: 0.35 });
  gsap.from(".lx-tree-r > img", { x: u(320), duration: 2.2, ease: "power3.out", delay: 0.35 });
}

function setupLandscape() {
  if (!$(".lx-ridge")) return;
  const st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true };

  // parallax: lo lejano casi no se mueve respecto a la pantalla, lo cercano sí
  gsap.to(".lx-sky", { y: u(420), ease: "none", scrollTrigger: st });
  gsap.to(".lx-glow", { y: u(380), opacity: 0.4, ease: "none", scrollTrigger: st });
  $$(".lx-ridge").forEach((el) => {
    const depth = parseFloat(el.dataset.depth);
    gsap.to(el, { y: u((1 - depth) * 360 + 40), ease: "none", scrollTrigger: st });
  });
  gsap.to(".lx-fog", { y: u(200), ease: "none", scrollTrigger: st });
  gsap.to(".lx-tree-l", { x: u(-140), y: u(-60), ease: "none", scrollTrigger: st });
  gsap.to(".lx-tree-r", { x: u(140), y: u(-60), ease: "none", scrollTrigger: st });

  // niebla desplazándose en bucle: la imagen mide 2×ancho, así que -50% es un ciclo exacto
  $$(".lx-fog > img").forEach((img) => {
    const speed = parseFloat(img.parentNode.dataset.speed || 1);
    gsap.to(img, { xPercent: -50, duration: 120 / speed, ease: "none", repeat: -1 });
  });

  // el escenario no necesita animarse cuando el hero ya no se ve
  ScrollTrigger.create({
    trigger: ".hero", start: "top top", end: "bottom top",
    onLeave: () => gsap.set(".hero__bg", { visibility: "hidden" }),
    onEnterBack: () => gsap.set(".hero__bg", { visibility: "visible" }),
  });
}

/* ---------------- Burger + menú lateral ---------------- */
const burger = $(".burger");
let menuOpen = false;

function setupBurger() {
  if (isTouch || innerWidth <= 900) return;
  ScrollTrigger.create({
    trigger: ".hero",
    start: "bottom 75%",
    onEnter: () => gsap.to(burger, { scale: 1, duration: 0.45, ease: "back.out(1.6)" }),
    onLeaveBack: () => !menuOpen && gsap.to(burger, { scale: 0, duration: 0.35, ease: "power2.in" }),
  });
}

const menuPath = $(".menu__curve path");
// GSAP no anima hacia valores calc(); calculamos la distancia oculta en px
const menuHiddenX = () => $(".menu").offsetWidth + innerWidth * 0.1;
gsap.set(".menu", { x: menuHiddenX });
const curveIn = "M100 0 L100 1000 Q-100 500 100 0";
const curveFlat = "M100 0 L100 1000 Q100 500 100 0";

function openMenu() {
  menuOpen = true;
  document.body.classList.add("menu-open");
  burger.classList.add("is-open");
  burger.setAttribute("aria-expanded", "true");
  gsap.to(burger, { scale: 1, duration: 0.3 });
  gsap.to(".menu", { x: 0, duration: 0.85, ease: "power3.inOut" });
  gsap.fromTo(menuPath, { attr: { d: curveIn } }, { attr: { d: curveFlat }, duration: 1, ease: "power3.inOut" });
  gsap.fromTo(".menu__links a", { x: 80 }, { x: 0, duration: 0.9, stagger: 0.06, ease: "power3.out", delay: 0.15 });
}
function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  document.body.classList.remove("menu-open");
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  gsap.to(".menu", { x: menuHiddenX, duration: 0.8, ease: "power3.inOut" });
  gsap.fromTo(menuPath, { attr: { d: curveFlat } }, { attr: { d: curveIn }, duration: 0.8, ease: "power3.inOut" });
  if (scrollY < innerHeight * 0.25 && innerWidth > 900) gsap.to(burger, { scale: 0, duration: 0.35, delay: 0.3 });
}
burger.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
$(".menu-overlay").addEventListener("click", closeMenu);
addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

/* ---------------- Efecto magnético ---------------- */
function setupMagnetic() {
  if (isTouch) return;
  $$(".magnetic").forEach((el) => {
    const strength = parseFloat(el.dataset.strength || 0.35);
    const inner = el.querySelector(".btn-text, span:not(.btn-fill)");
    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const ixTo = inner && gsap.quickTo(inner, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const iyTo = inner && gsap.quickTo(inner, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength); yTo(dy * strength);
      if (inner) { ixTo(dx * strength * 0.5); iyTo(dy * strength * 0.5); }
    });
    el.addEventListener("mouseleave", () => {
      xTo(0); yTo(0);
      if (inner) { ixTo(0); iyTo(0); }
    });
  });
}

/* ---------------- Texto intro palabra a palabra ---------------- */
function setupSplit() {
  $$(".split-words").forEach((el) => {
    el.innerHTML = el.textContent
      .trim()
      .split(/\s+/)
      .map((w) => `<span class="w"><span>${w}</span></span>`)
      .join(" ");
    gsap.from(el.querySelectorAll(".w > span"), {
      yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.012,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
  $$(".fade-up").forEach((el) =>
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
  );
  gsap.fromTo(".intro__side .btn-round", { y: 60 }, {
    y: -60, ease: "none",
    scrollTrigger: { trigger: ".intro", start: "top bottom", end: "bottom top", scrub: true },
  });
}

/* ---------------- Lista de trabajos con modal flotante ---------------- */
function setupWorkModal() {
  if (isTouch) return;
  const modal = $(".work-modal");
  const view = $(".cursor-view");
  const slider = $(".work-modal__slider");
  const mx = gsap.quickTo(modal, "left", { duration: 0.8, ease: "power3" });
  const my = gsap.quickTo(modal, "top", { duration: 0.8, ease: "power3" });
  const vx = gsap.quickTo(view, "left", { duration: 0.45, ease: "power3" });
  const vy = gsap.quickTo(view, "top", { duration: 0.45, ease: "power3" });

  addEventListener("mousemove", (e) => { mx(e.clientX); my(e.clientY); vx(e.clientX); vy(e.clientY); });

  const list = $(".work__list");
  list.addEventListener("mouseenter", () => {
    gsap.to([modal, view], { scale: 1, duration: 0.4, ease: "power3.out" });
  });
  list.addEventListener("mouseleave", () => {
    gsap.to([modal, view], { scale: 0, duration: 0.4, ease: "power3.in" });
  });
  $$(".work__row").forEach((row) =>
    row.addEventListener("mouseenter", () => {
      slider.style.transform = `translateY(${-row.dataset.index * 100}%)`;
    })
  );
}

/* ---------------- Curva + footer ---------------- */
function setupScrollScenes() {
  gsap.fromTo(".curve", { height: "200%" }, {
    height: "100%", ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top 20%", scrub: true },
  });

  gsap.fromTo(".footer__top", { yPercent: -40 }, {
    yPercent: 0, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top top", scrub: true },
  });
  gsap.fromTo(".footer__arrow", { rotate: 270 }, {
    rotate: 180, ease: "none",
    scrollTrigger: { trigger: ".footer", start: "top bottom", end: "top top", scrub: true },
  });
}

/* ---------------- Hora local ---------------- */
function setupClock() {
  const el = $(".local-time");
  const tick = () => {
    const t = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Europe/Madrid", timeZoneName: "short",
    }).format(new Date());
    el.textContent = t;
  };
  tick();
  setInterval(tick, 10000);
}

/* ---------------- Init ---------------- */
Promise.all([document.fonts.ready, loadLandscape()]).then(() => {
  setupLogo();
  setupLandscape();
  setupHero();
  setupBurger();
  setupMagnetic();
  setupSplit();
  setupWorkModal();
  setupScrollScenes();
  setupClock();
  runLoader();
});
addEventListener("resize", () => {
  setupLogo();
  sizeStage();
  if (!menuOpen) gsap.set(".menu", { x: menuHiddenX });
  ScrollTrigger.refresh();
});
