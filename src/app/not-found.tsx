import Link from 'next/link';
import { Navigation } from '@/components/navigation';
export default function NotFound() {
  return <><Navigation dark/><main id="contenido" tabIndex={-1} className="not-found"><p className="eyebrow">404 / No encontrado</p><h1>Por aquí<br/>no era.</h1><Link className="pill-button" href="/"><span className="magnetic-label">Volver al inicio</span></Link></main></>;
}
