import { useEffect, useRef } from 'react';

export default function Home() {
 const hero = useRef<HTMLElement>(null);
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const targets=document.querySelectorAll('.about h2,.about-bottom,.service,.contact-title');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}}),{threshold:.15});
  targets.forEach(target=>{target.classList.add('reveal');observer.observe(target)});
  return()=>{observer.disconnect();targets.forEach(target=>target.classList.remove('reveal'))};
 },[]);

 useEffect(() => {
  let cancelled=false;let cleanup:(()=>void)|undefined;
  const host=document.getElementById('scene-mount');
  if(host)import('./scene').then(({mountScene})=>{if(!cancelled)cleanup=mountScene(host)}).catch(()=>{});
  return()=>{cancelled=true;cleanup?.()};
 },[]);
 return <main>
  <header className="nav"><a href="#inicio" className="brand" aria-label="Miguel Pitarch, inicio">mp<span>✳</span></a><nav aria-label="Navegación principal"><a href="#servicios">Servicios</a><a href="#sobre-mi">Sobre mí</a><a className="contact-link" href="mailto:hello@miguelpitarch.com">Hablemos <span>↗</span></a></nav></header>
  <section className="hero" id="inicio" ref={hero}>
   <div className="hero-top"><span>DESARROLLADOR WEB & SOFTWARE</span><span className="availability"><i/> Abierto a nuevos proyectos</span></div>
   <div className="hero-stage"><h1><span>MIGUEL</span><span>PITARCH<span className="name-dot">.</span></span></h1><div className="scene-mount" id="scene-mount" aria-hidden="true"/></div>
   <div className="hero-bottom"><p>Convierto ideas en webs.<br/>Y problemas en software.</p><p className="hero-description">Desarrollo experiencias digitales y soluciones a medida para empresas y pequeños negocios.</p><a href="#servicios" className="round-arrow" aria-label="Explorar servicios">↓</a></div>
   <div className="hero-caption"><span>INDEPENDIENTE. DE PRINCIPIO A FIN.</span><span>DESLIZA PARA EXPLORAR ↓</span></div>
  </section>
  <section className="about section-pad" id="sobre-mi"><div className="section-label"><span>01 / SOBRE MÍ</span><span>IDEAS + CÓDIGO</span></div><h2>Tu próximo paso,<br/>hecho <em>realidad.</em></h2><div className="about-bottom"><span className="small-mark" aria-hidden="true">↳</span><p>Soy Miguel Pitarch, programador web. Trabajo contigo para entender tu negocio y crear la herramienta que necesita: desde una web que te represente hasta un software que simplifique tu día a día.</p><p>Una persona al otro lado.<br/>Una solución pensada para ti.</p></div></section>
  <section className="services section-pad" id="servicios"><div className="section-label"><span>02 / LO QUE PUEDO HACER POR TI</span><span>DEL CONCEPTO AL CÓDIGO</span></div><h2>Diseñado para destacar.<br/><span>Desarrollado para funcionar.</span></h2><div className="service-list">{[
 ['01','Desarrollo web','Una presencia digital que esté a la altura de tu negocio. Webs rápidas, cuidadas y fáciles de usar en cualquier pantalla.','WEB CORPORATIVA · LANDING PAGES · TIENDAS ONLINE'],
 ['02','Software a medida','La herramienta que encaja con tu forma de trabajar. Aplicaciones para organizar tu negocio, gestionar información y conectar a tu equipo.','APLICACIONES WEB · HERRAMIENTAS INTERNAS · PLATAFORMAS'],
 ['03','Automatización','Menos tareas repetitivas y más tiempo para lo que importa. Conecto tus herramientas y simplifico tus procesos.','INTEGRACIONES · FLUJOS DE TRABAJO · GESTIÓN DE DATOS']
 ].map(([n,title,copy,tags])=><article className="service" key={n}><span className="service-number">{n}</span><div><h3>{title}</h3><p>{copy}</p><span className="service-tags">{tags}</span></div><span className="service-arrow" aria-hidden="true">↗</span></article>)}</div></section>
  <section className="contact section-pad" id="contacto"><div className="section-label"><span>03 / HABLEMOS</span><span>LO SIGUIENTE EMPIEZA AQUÍ</span></div><p>¿Una idea en mente?</p><a className="contact-title" href="mailto:hello@miguelpitarch.com">Vamos a<br/>construirla.<span aria-hidden="true">↗</span></a><a className="email" href="mailto:hello@miguelpitarch.com">hello@miguelpitarch.com <span>↗</span></a><footer><a href="#inicio">miguelpitarch.com</a><span>DESARROLLO WEB & SOFTWARE</span><a href="#inicio">Volver arriba ↑</a></footer></section>
 </main>
}
