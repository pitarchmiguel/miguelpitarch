export const projects = [
  {
    slug: 'palabrio',
    name: 'Palabrio',
    category: 'Aprendizaje de inglés',
    type: 'Proyecto personal',
    description: 'Una herramienta para aprender inglés.',
    intro: 'Aprender un idioma abre nuevas posibilidades. Palabrio es mi proyecto para ayudar a otras personas a aprender inglés.',
    image: '/images/palabrio.webp',
    alt: 'Imagen conceptual provisional de Palabrio: composición tipográfica naranja sobre papel crema.',
    background: '#eee9e1',
  },
  {
    slug: 'qr-carta',
    name: 'QR Carta',
    category: 'Software para hostelería',
    type: 'SaaS · Proyecto personal',
    description: 'La carta de tu negocio, en digital.',
    intro: 'QR Carta es un SaaS que ayuda a bares y restaurantes a tener su menú en formato digital. Un proyecto pensado para acercar el software al día a día de la hostelería.',
    image: '/images/qr-carta.webp',
    alt: 'Imagen conceptual provisional de QR Carta: una carta de papel sobre una mesa verde oliva.',
    background: '#3c4230',
  },
] as const;

export function getProject(slug: string) {
  return projects.find(project => project.slug === slug);
}
