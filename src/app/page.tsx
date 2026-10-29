import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Globe } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Contact } from '@/components/contact';
import { projects } from '@/lib/projects';
import { HeroName } from '@/components/hero-name';
import { ProjectPreview } from '@/components/project-preview';

export default function Home() {
  return <>
    <Navigation/>
    <main id="contenido" tabIndex={-1}>
      <section className="hero" id="inicio" aria-label="Miguel Pitarch, desarrollador web y de software">
        <Image className="hero-portrait" src="/images/miguel-studio.webp" alt="Retrato de Miguel Pitarch. Imagen de estudio provisional creada a partir de su fotografía de perfil." fill priority sizes="(max-width: 720px) 160vh, 100vw"/>
        <div className="location-badge"><p>Desde<br/>Castellón,<br/>España</p><span className="globe-wrap"><Globe size={37} strokeWidth={1} aria-hidden="true"/></span></div>
        <div className="hero-role"><ArrowDownRight className="hero-arrow" size={27} strokeWidth={1.5} aria-hidden="true"/><p><span>Freelance</span>Web & Software Developer</p></div>
        <HeroName/>
        <Globe className="mobile-globe" size={40} strokeWidth={1} aria-hidden="true"/>
      </section>
      <section id="sobre-mi" className="intro-section" aria-labelledby="intro-title">
        <div className="intro-container grid">
          <h2 id="intro-title">Convierto ideas en experiencias digitales. Webs que conectan con las personas. Software que hace más sencillo el día a día.</h2>
          <div className="intro-aside"><p>Soy Miguel Pitarch, desarrollador web y de software. Combino diseño y código para crear soluciones a medida, de principio a fin.</p><a className="circle-button circle-dark" href="#contacto"><span className="magnetic-label">Sobre tu idea</span></a></div>
        </div>
      </section>
      <section id="trabajos" className="work-section" aria-labelledby="work-title">
        <div className="work-container">
          <h2 id="work-title" className="eyebrow work-label">Proyectos seleccionados</h2>
          <div className="work-list">
            {projects.map((project, index) => <Link href={`/proyectos/${project.slug}`} key={project.slug} className="project-row group" data-project-index={index}>
              <div className="project-cover" style={{ backgroundColor: project.background }}><Image src={project.image} alt={project.alt} width={1024} height={1024} sizes="(max-width: 720px) 90vw, 380px"/><span className="project-cover-label">Ver proyecto <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true"/></span></div>
              <div className="project-title-wrap"><span className="project-number" aria-hidden="true">0{index + 1}</span><h3>{project.name}</h3></div>
              <p className="project-category">{project.category}</p><ArrowUpRight className="project-arrow" size={30} strokeWidth={1} aria-hidden="true"/>
            </Link>)}
          </div>
          <div className="work-end flex justify-center"><a className="pill-button" href="#contacto"><span className="magnetic-label">Tu próximo proyecto <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true"/></span></a></div>
        </div>
      </section>
    </main>
    <Contact/>
    <ProjectPreview/>
  </>;
}
