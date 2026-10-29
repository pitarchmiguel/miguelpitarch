import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://miguelpitarch.com'),
  title: { default: 'Miguel Pitarch — Desarrollo web y software · STUDIO / 01', template: '%s — Miguel Pitarch' },
  description: 'Desarrollo web y software a medida con Miguel Pitarch. Explora Palabrio, QR Carta y mi forma de convertir ideas en productos digitales.',
  openGraph: { title: 'Miguel Pitarch — Desarrollo web y software', description: 'Ideas que se convierten en productos digitales. Portfolio personal · STUDIO / 01.', locale: 'es_ES', type: 'website' },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><a href="#contenido" className="skip-link">Saltar al contenido</a>{children}</body></html>;
}
