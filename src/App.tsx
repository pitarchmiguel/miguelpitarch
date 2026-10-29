import { useEffect } from 'react';

const contactEmail = 'hello@miguelpitarch.com';
const contactHref = `mailto:${contactEmail}?subject=Hablemos%20de%20mi%20proyecto`;

function ArrowIcon() {
 return <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}

export default function Home() {
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window))return;
  const targets=document.querySelectorAll('.about h2,.about-bottom,.service,.contact-title');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.15});
  targets.forEach(target=>{target.classList.add('reveal');observer.observe(target)});
  return()=>{observer.disconnect();targets.forEach(target=>target.classList.remove('reveal'))};
 },[]);

 useEffect(() => {
  let cancelled=false;let cleanup:(()=>void)|undefined;
  const host=document.getElementById('scene-mount');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateScene(){
   cleanup?.();cleanup=undefined;
   if(!host || reducedMotion.matches)return;
   import('./scene').then(({mountScene})=>{if(!cancelled && !reducedMotion.matches && !cleanup)cleanup=mountScene(host)}).catch(()=>{});
  }
  updateScene();
  reducedMotion.addEventListener('change',updateScene);
  return()=>{cancelled=true;reducedMotion.removeEventListener('change',updateScene);cleanup?.()};
 },[]);
 return <>
  <a className="skip-link" href="#contenido">Saltar al contenido</a>
  <header className="nav"><a href="#inicio" className="brand" aria-label="Miguel Pitarch, inicio">mp<span>✳</span></a><nav aria-label="Navegación principal"><a href="#servicios">Servicios</a><a href="#sobre-mi">Sobre mí</a><a href="#proceso">Cómo trabajo</a><a className="contact-link" href={contactHref}>Hablemos <span><ArrowIcon /></span></a></nav></header>
  <main id="contenido" tabIndex={-1}>
  <section className="hero" id="inicio" aria-label="Presentación">
   <div className="hero-top"><span>DESARROLLADOR WEB & SOFTWARE</span><span className="availability"><i/> Abierto a nuevos proyectos</span></div>
   <div className="hero-stage"><h1><span>MIGUEL</span><span>PITARCH<span className="name-dot">.</span></span></h1><div className="scene-mount" id="scene-mount" aria-hidden="true"/></div>
   <div className="hero-bottom"><p>Convierto ideas en webs.<br/>Y problemas en software.</p><div className="hero-intro"><p className="hero-description">Creo webs y herramientas a medida para pequeños negocios que quieren captar clientes y simplificar su trabajo.</p><a className="project-link" href={contactHref}>Cuéntame tu proyecto <span aria-hidden="true"><ArrowIcon /></span></a></div><a href="#servicios" className="round-arrow" aria-label="Explorar servicios">↓</a></div>
   <div className="hero-caption"><span>INDEPENDIENTE. DE PRINCIPIO A FIN.</span><span>DESLIZA PARA EXPLORAR ↓</span></div>
  </section>
  <section className="about section-pad" id="sobre-mi"><div className="section-label"><span>01 / SOBRE MÍ</span><span>IDEAS + CÓDIGO</span></div><h2>Tu próximo paso,<br/>hecho <em>realidad.</em></h2><div className="about-bottom"><span className="small-mark" aria-hidden="true"><ArrowIcon /></span><p>Soy Miguel Pitarch, programador web. Trabajo contigo para entender tu negocio y crear la herramienta que necesita: desde una web que te represente hasta un software que simplifique tu día a día.</p><p>Una persona al otro lado.<br/>Una solución pensada para ti.</p></div></section>
  <section className="services section-pad" id="servicios"><div className="section-label"><span>02 / LO QUE PUEDO HACER POR TI</span><span>DEL CONCEPTO AL CÓDIGO</span></div><h2>Diseñado para destacar.<br/><span>Desarrollado para funcionar.</span></h2><div className="service-list">{[
 ['01','Desarrollo web','Una presencia digital que esté a la altura de tu negocio. Webs rápidas, cuidadas y fáciles de usar en cualquier pantalla.','WEB CORPORATIVA · LANDING PAGES · TIENDAS ONLINE'],
 ['02','Software a medida','La herramienta que encaja con tu forma de trabajar. Aplicaciones para organizar tu negocio, gestionar información y conectar a tu equipo.','APLICACIONES WEB · HERRAMIENTAS INTERNAS · PLATAFORMAS'],
 ['03','Automatización','Menos tareas repetitivas y más tiempo para lo que importa. Conecto tus herramientas y simplifico tus procesos.','INTEGRACIONES · FLUJOS DE TRABAJO · GESTIÓN DE DATOS']
 ].map(([n,title,copy,tags])=><article className="service" key={n}><span className="service-number">{n}</span><div><h3>{title}</h3><p>{copy}</p><span className="service-tags">{tags}</span></div><span className="service-arrow" aria-hidden="true"><ArrowIcon /></span></article>)}</div></section>
  <section className="process section-pad" id="proceso" aria-labelledby="process-title">
   <div className="section-label"><span>03 / CÓMO TRABAJO</span><span>DE LA PRIMERA IDEA A LA ENTREGA</span></div>
   <h2 id="process-title">Un proceso claro.<br/><em>Contigo en cada paso.</em></h2>
   <ol className="process-list">
    {[
     ['Hablamos de tu negocio', 'Me cuentas qué necesitas, para quién y qué te gustaría mejorar. No hace falta que tengas una solución técnica en mente.'],
     ['Definimos el proyecto', 'Acordamos el alcance, las prioridades y los siguientes pasos antes de empezar a desarrollar.'],
     ['Construimos y revisamos', 'Doy forma a la solución y la revisamos juntos para comprobar que responde a lo que necesitas.'],
     ['Preparamos la entrega', 'Probamos el resultado y repasamos cómo usarlo. También podemos hablar de mantenimiento y próximas mejoras.'],
    ].map(([title, description], index) => <li key={title}><span className="process-number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
   </ol>
  </section>
  <section className="contact section-pad" id="contacto"><div className="section-label"><span>04 / HABLEMOS</span><span>LO SIGUIENTE EMPIEZA AQUÍ</span></div><p>¿Una idea en mente?</p><p className="contact-intro">Cuéntame qué hace tu negocio, qué necesitas y cuándo te gustaría empezar. Lo vemos juntos.</p><a className="contact-title" href={contactHref}>Vamos a<br/>construirla.<span aria-hidden="true"><ArrowIcon /></span></a><a className="email" href={contactHref}>{contactEmail} <span aria-hidden="true"><ArrowIcon /></span></a><footer><a href="#inicio">miguelpitarch.com</a><span>DESARROLLO WEB & SOFTWARE</span><a href="#inicio">Volver arriba ↑</a></footer></section>
  </main>
 </>
}
