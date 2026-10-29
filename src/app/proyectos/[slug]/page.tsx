import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Contact } from '@/components/contact';
import { getProject, projects } from '@/lib/projects';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return { title: project?.name ?? 'Proyecto no encontrado', description: project?.description };
}
export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const nextProject = projects[project.slug === 'palabrio' ? 1 : 0];
  return <><Navigation dark/><main id="contenido" tabIndex={-1} className="project-page">
    <div className="project-page-intro"><Link className="back-link inline-flex items-center gap-2" href="/#trabajos"><ArrowLeft size={18} aria-hidden="true"/>Todos los proyectos</Link><h1>{project.name}</h1><div className="project-facts grid gap-8"><div><h2 className="eyebrow">Proyecto</h2><p>{project.type}</p></div><div><h2 className="eyebrow">Área</h2><p>{project.category}</p></div><div><h2 className="eyebrow">Disponibilidad</h2><p>Aún sin enlace público</p></div></div></div>
    <div className="project-page-image" style={{ backgroundColor: project.background }}><Image src={project.image} alt={project.alt} width={1024} height={1024} priority sizes="(max-width: 720px) 100vw, 70vw"/></div>
    <section className="project-description"><p className="eyebrow">La idea</p><h2>{project.description}</h2><p>{project.intro}</p><p className="asset-note">Imagen conceptual provisional.</p></section>
    <Link className="next-project flex items-center justify-between" href={`/proyectos/${nextProject.slug}`}><span><span className="eyebrow block">Siguiente proyecto</span><span>{nextProject.name}</span></span><ArrowUpRight size={45} strokeWidth={1} aria-hidden="true"/></Link>
  </main><Contact/></>;
}
