import grotto from '../assets/img/grotto-suite.jpg'
import atelier from '../assets/img/atelier-facade.jpg'
import drawingLounge from '../assets/img/drawing-lounge.jpg'
import coastDeck from '../assets/img/coast-deck.jpg'
import coastPool from '../assets/img/coast-pool.jpg'
import resortSunset from '../assets/img/resort-sunset.jpg'
import resortPanorama from '../assets/img/resort-panorama.jpg'
import founderDeck from '../assets/img/founder-deck.jpg'
import founderStanding from '../assets/img/founder-standing.jpg'
import founderSeated from '../assets/img/founder-seated.jpg'

import marble from '../assets/materials/marble.jpg'
import travertine from '../assets/materials/travertine.jpg'
import oak from '../assets/materials/oak.jpg'
import walnut from '../assets/materials/walnut.jpg'
import leather from '../assets/materials/leather.jpg'
import linen from '../assets/materials/linen.jpg'
import boucle from '../assets/materials/boucle.jpg'
import bronze from '../assets/materials/bronze.jpg'
import glass from '../assets/materials/glass.jpg'
import type { T } from '../i18n'
import { photo } from './remote'

/** Photography supplied by Runway (company profile, Vondom residential book, Kenkoon catalogue). */
const realFiles = import.meta.glob<string>('../assets/img/real/*.jpg', { eager: true, import: 'default' })
const real = (name: string) => {
  const url = realFiles[`../assets/img/real/${name}.jpg`]
  if (!url) throw new Error(`Missing image: ${name}`)
  return url
}

/** Modern editorial photography (remote, with the supplied images as offline fallbacks). */
export const photos = {
  hotelSuite: photo('1582719478250-c89cae4dc85b', grotto),
  hotelRoom: photo('1590490360182-c33d57733427', grotto),
  hotelBedroom: photo('1631049307264-da0ec9d70304', grotto),
  resortPool: photo('1566073771259-6a8506099945', resortPanorama),
  resortLoungers: photo('1571896349842-33c89424de2d', resortSunset),
  resortBeach: photo('1520250497591-112f2f40a3f4', coastPool),
  resortTropical: photo('1540541338287-41700207dee6', resortSunset),
  villaPool: photo('1600585154340-be6161a56a0c', coastDeck),
  villaDusk: photo('1600596542815-ffad4c1539a9', coastPool),
  villaModern: photo('1613490493576-7fde63acd811', coastDeck),
  livingRoom: photo('1618221195710-dd6b41faaea6', drawingLounge),
  livingGallery: photo('1600607687939-ce8a6c25118c', drawingLounge),
  livingDining: photo('1600210492486-724fe5c67fb0', atelier),
  lounge: photo('1586023492125-27b2c045efd7', drawingLounge),
  sofa: photo('1555041469-a586c61ea9bc', drawingLounge),
  sofaRoom: photo('1567016432779-094069958ea5', drawingLounge),
  restaurant: photo('1517248135467-4c7edcad34c4', atelier),
}

/** Supplied photography used for full-bleed moments outside the project pages. */
export const showcase = {
  residence: real('sardinera-1'),
  contact: real('lounge-sunset'),
}

export const images = {
  grotto,
  atelier,
  drawingLounge,
  coastDeck,
  coastPool,
  resortSunset,
  resortPanorama,
  founderDeck,
  founderStanding,
  founderSeated,
}

export const textures = { marble, travertine, oak, walnut, leather, linen, boucle, bronze, glass }

/**
 * Brand facts — taken only from material supplied by the company
 * (founder letter, company profile, catalogues). Edit here; everything else reads from this file.
 * Copy is bilingual: { en, es }.
 */
export const brand = {
  name: 'Runway',
  full: 'Runway Furniture International',
  since: 2009,
  years: 17,
  offices: [
    { city: 'Montreal', cityLabel: { en: 'Montreal', es: 'Montreal' }, country: { en: 'Canada', es: 'Canadá' }, lat: 45.5, lon: -73.57 },
    { city: 'Singapore', cityLabel: { en: 'Singapore', es: 'Singapur' }, country: { en: 'Singapore', es: 'Singapur' }, lat: 1.35, lon: 103.82 },
  ],
  regions: [
    { en: 'Canada', es: 'Canadá' },
    { en: 'Caribbean', es: 'Caribe' },
    { en: 'USA', es: 'EE. UU.' },
    { en: 'Europe', es: 'Europa' },
    { en: 'Asia', es: 'Asia' },
  ] satisfies T[],
  founder: {
    name: 'Roberto Castle',
    role: { en: 'Founder · Director · Designer', es: 'Fundador · Director · Diseñador' },
    quote: { en: 'Your lifestyle is my source of inspiration.', es: 'Tu estilo de vida es mi fuente de inspiración.' },
  },
  /** Enquiries address from the company profile — used by the contact form (mailto). */
  contactEmail: 'info@runwayfurniture.com',
  website: 'www.runwayfurniture.com',
  award: { en: 'Canadian Excellence Award 2008', es: 'Canadian Excellence Award 2008' },
}

/** Optional cinematic film for the hero. Drop an mp4 in /public/media and set the path. */
export const heroVideo: { src: string; poster?: string } | null = null

/** Films supplied by Runway, served from /public/media. */
export const films = [
  {
    title: { en: 'The Runway Film', es: 'La película Runway' },
    caption: {
      en: 'Resorts, villas and beach clubs furnished by Runway — a four-minute tour of the work.',
      es: 'Resorts, villas y beach clubs amueblados por Runway: un recorrido de cuatro minutos por nuestro trabajo.',
    },
    src: './media/runway-film.mp4',
    poster: './media/runway-film.jpg',
    duration: '4:07',
  },
  {
    title: { en: 'The Showroom', es: 'El showroom' },
    caption: {
      en: 'Inside the Foresta showroom: living, dining and lighting collections on display.',
      es: 'Dentro del showroom Foresta: colecciones de sala, comedor e iluminación en exhibición.',
    },
    src: './media/showroom.mp4',
    poster: './media/showroom.jpg',
    duration: '1:10',
  },
]

export const navItems = [
  { label: { en: 'Projects', es: 'Proyectos' }, href: '#projects', image: real('sardinera-1') },
  { label: { en: 'Hospitality', es: 'Hotelería' }, href: '#hospitality', image: real('gansevoort-pool') },
  { label: { en: 'Collections', es: 'Colecciones' }, href: '#collections', image: real('kenkoon-mesh-sunset') },
  { label: { en: 'Clients', es: 'Clientes' }, href: '#clients', image: real('beachclub-pool') },
  { label: { en: 'About', es: 'Nosotros' }, href: '#founder', image: founderDeck },
  { label: { en: 'Contact', es: 'Contacto' }, href: '#contact', image: real('lounge-sunset') },
]

export type Category = 'Luxury Hospitality' | 'Resorts & Destinations' | 'Private Residences' | 'Bespoke Furniture' | 'Commercial & Lifestyle Spaces'

export const categories: Category[] = [
  'Luxury Hospitality',
  'Resorts & Destinations',
  'Private Residences',
  'Bespoke Furniture',
  'Commercial & Lifestyle Spaces',
]

export const categoryLabel: Record<Category, T> = {
  'Luxury Hospitality': { en: 'Luxury Hospitality', es: 'Hotelería de lujo' },
  'Resorts & Destinations': { en: 'Resorts & Destinations', es: 'Resorts y destinos' },
  'Private Residences': { en: 'Private Residences', es: 'Residencias privadas' },
  'Bespoke Furniture': { en: 'Bespoke Furniture', es: 'Mobiliario a medida' },
  'Commercial & Lifestyle Spaces': { en: 'Commercial & Lifestyle Spaces', es: 'Espacios comerciales' },
}

export type Project = {
  slug: string
  title: string
  category: Category
  /** Only set when known — concept projects stay unlocated. */
  location?: T
  summary: T
  concept: T
  narrative: T
  /** Material palette keys — shown only when set. */
  materials?: (keyof typeof textures)[]
  furniture: T[]
  cover: string
  gallery: string[]
  /** true = demonstration concept, not a delivered client project. */
  isConcept: boolean
  /** Brand or programme the furniture came from, when relevant. */
  collection?: string
}

const same = (s: string): T => ({ en: s, es: s })

export const projects: Project[] = [
  {
    slug: 'ocean-club-gansevoort',
    title: 'Ocean Club',
    category: 'Luxury Hospitality',
    location: { en: 'Gansevoort · Dominican Republic', es: 'Gansevoort · República Dominicana' },
    summary: {
      en: 'Beachfront terraces, pool decks and suites for the Ocean Club, operated by the Gansevoort Hotel Group.',
      es: 'Terrazas frente al mar, áreas de piscina y suites para el Ocean Club, operado por el Gansevoort Hotel Group.',
    },
    concept: {
      en: 'Low, deep outdoor lounges in black and teak run the full length of the beach terrace, framing the sea rather than blocking it.',
      es: 'Salas exteriores bajas y profundas en negro y teca recorren toda la terraza de playa, enmarcando el mar en lugar de taparlo.',
    },
    narrative: {
      en: 'From the oceanfront deck and pool cabanas to the bar, the wine lounge and the suites, the furniture carries one calm, contemporary language through every space of the resort.',
      es: 'Desde la terraza frente al océano y las cabañas de piscina hasta el bar, la cava y las suites, el mobiliario mantiene un mismo lenguaje sereno y contemporáneo en todo el resort.',
    },
    furniture: [
      { en: 'Teak and black outdoor lounge sets', es: 'Salas exteriores en teca y negro' },
      { en: 'Bar-height communal tables', es: 'Mesas comunales altas' },
      { en: 'Pool cabanas and sun loungers', es: 'Cabañas y camastros de piscina' },
      { en: 'Wine lounge seating', es: 'Asientos para la cava' },
    ],
    cover: real('gansevoort-pool'),
    gallery: [real('gansevoort-beach'), real('gansevoort-terrace'), real('gansevoort-lounge'), real('gansevoort-wine')],
    isConcept: false,
  },
  {
    slug: 'la-roca-house',
    title: 'La Roca House',
    category: 'Private Residences',
    location: { en: 'Morelia · Mexico', es: 'Morelia · México' },
    collection: 'Vondom',
    summary: {
      en: 'A cliff-edge house where living, dining and terrace open onto the valley below.',
      es: 'Una casa al borde del acantilado donde sala, comedor y terraza se abren al valle.',
    },
    concept: {
      en: 'Sculptural pieces in warm tones sit against raw concrete and full-height glass, so the landscape becomes the main wall of the house.',
      es: 'Piezas escultóricas en tonos cálidos contra concreto aparente y cristal de piso a techo: el paisaje se convierte en el muro principal de la casa.',
    },
    narrative: {
      en: 'Dining, lounge and terrace furniture by Vondom carry the same soft, organic lines from the interior out to the deck at dusk.',
      es: 'El mobiliario de comedor, sala y terraza de Vondom lleva las mismas líneas suaves y orgánicas del interior hasta la terraza al atardecer.',
    },
    furniture: [
      { en: 'Sculptural dining chairs', es: 'Sillas de comedor escultóricas' },
      { en: 'Indoor-outdoor lounge seating', es: 'Asientos de sala interior y exterior' },
      { en: 'Terrace sofas and low tables', es: 'Sofás y mesas bajas de terraza' },
      { en: 'Statement lighting', es: 'Iluminación protagonista' },
    ],
    cover: real('la-roca-3'),
    gallery: [real('la-roca-1'), real('la-roca-2'), real('la-roca-0')],
    isConcept: false,
  },
  {
    slug: 'costa-esmeralda',
    title: 'Costa Esmeralda',
    category: 'Resorts & Destinations',
    location: { en: 'Puerto Plata · Dominican Republic', es: 'Puerto Plata · República Dominicana' },
    summary: {
      en: 'A Lifestyle Holidays vacation resort, furnished around its infinity pools and ocean terraces.',
      es: 'Un resort vacacional de Lifestyle Holidays, amueblado en torno a sus piscinas infinitas y terrazas al mar.',
    },
    concept: {
      en: 'Teak loungers and long dining tables are lined up along the edge of the infinity pool, every seat facing the Atlantic.',
      es: 'Camastros de teca y largas mesas de comedor se alinean al borde de la piscina infinita, cada asiento mirando al Atlántico.',
    },
    narrative: {
      en: 'Poolside loungers, daybeds and outdoor dining were specified for constant sun, salt and use — and to stay warm and inviting at golden hour.',
      es: 'Camastros, camas de día y comedores exteriores pensados para el sol, la sal y el uso constante, y para seguir siendo cálidos e invitantes al atardecer.',
    },
    furniture: [
      { en: 'Teak sun loungers', es: 'Camastros de teca' },
      { en: 'Woven daybeds', es: 'Camas de día tejidas' },
      { en: 'Outdoor dining tables and chairs', es: 'Mesas y sillas de comedor exterior' },
      { en: 'Pool terrace furniture', es: 'Mobiliario para terraza de piscina' },
    ],
    cover: real('costa-esmeralda-deck'),
    gallery: [real('costa-esmeralda-dining')],
    isConcept: false,
  },
  {
    slug: 'sardinera-house',
    title: 'Sardinera House',
    category: 'Private Residences',
    location: { en: 'Jávea · Spain', es: 'Jávea · España' },
    collection: 'Vondom',
    summary: {
      en: 'A white Mediterranean villa stepping down towards the sea around an infinity pool.',
      es: 'Una villa mediterránea blanca que desciende hacia el mar alrededor de una piscina infinita.',
    },
    concept: {
      en: 'Clean white architecture and pale outdoor furniture let the water, the sky and the light do the work.',
      es: 'Arquitectura blanca y limpia con mobiliario exterior en tonos claros: el agua, el cielo y la luz hacen el resto.',
    },
    narrative: {
      en: 'Outdoor lounge and dining pieces by Vondom extend each level of the house onto its terraces, all the way to the pool edge.',
      es: 'Las piezas de sala y comedor exterior de Vondom extienden cada nivel de la casa hacia sus terrazas, hasta el borde de la piscina.',
    },
    furniture: [
      { en: 'Outdoor lounge sofas', es: 'Sofás de exterior' },
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Terrace dining sets', es: 'Comedores de terraza' },
      { en: 'Planters and accents', es: 'Maceteros y accesorios' },
    ],
    cover: real('sardinera-1'),
    gallery: [real('sardinera-2'), real('sardinera-3'), real('sardinera-0')],
    isConcept: false,
  },
  {
    slug: 'morgans-hotel',
    title: "Morgan's Hotel",
    category: 'Luxury Hospitality',
    location: { en: 'United Kingdom', es: 'Reino Unido' },
    summary: {
      en: 'Contemporary guest rooms and bathrooms with bold pattern, dark stone and warm wood.',
      es: 'Habitaciones y baños contemporáneos con estampados audaces, piedra oscura y madera cálida.',
    },
    concept: {
      en: 'Crisp white bedding and pale timber against graphic rugs and dark walls — calm rooms with a confident character.',
      es: 'Ropa de cama blanca y madera clara frente a alfombras gráficas y muros oscuros: habitaciones serenas con carácter.',
    },
    narrative: {
      en: 'Beds, bedside pieces, writing desks and vanity units were supplied for Morgan’s Hotel Ltd as one coordinated family.',
      es: 'Camas, mesas de noche, escritorios y muebles de baño se suministraron para Morgan’s Hotel Ltd como una sola familia coordinada.',
    },
    furniture: [
      { en: 'Upholstered beds', es: 'Camas tapizadas' },
      { en: 'Bedside and desk joinery', es: 'Mesas de noche y escritorios' },
      { en: 'Floating timber vanity units', es: 'Muebles de baño flotantes en madera' },
      { en: 'Statement mirrors', es: 'Espejos protagonistas' },
    ],
    cover: real('morgans-suite'),
    gallery: [real('morgans-bath')],
    isConcept: false,
  },
  {
    slug: 'finca-lomo-felipe',
    title: 'Finca Lomo Felipe',
    category: 'Private Residences',
    location: { en: 'Canary Islands · Spain', es: 'Islas Canarias · España' },
    collection: 'Vondom',
    summary: {
      en: 'A volcanic-island estate with garden terraces, lit pools and ocean views.',
      es: 'Una finca en una isla volcánica con terrazas ajardinadas, piscinas iluminadas y vistas al océano.',
    },
    concept: {
      en: 'Bold red lounge chairs and illuminated pieces bring colour and light to stone terraces and tropical gardens.',
      es: 'Sillones rojos intensos y piezas iluminadas llevan color y luz a terrazas de piedra y jardines tropicales.',
    },
    narrative: {
      en: 'Vondom outdoor furniture furnishes the pergolas, the pool decks and the gardens, glowing after dark like part of the landscape.',
      es: 'El mobiliario exterior de Vondom viste las pérgolas, las piscinas y los jardines, y brilla de noche como parte del paisaje.',
    },
    furniture: [
      { en: 'Pergola lounge chairs', es: 'Sillones para pérgola' },
      { en: 'Illuminated planters and furniture', es: 'Maceteros y muebles iluminados' },
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Garden seating', es: 'Asientos de jardín' },
    ],
    cover: real('lomo-felipe-3'),
    gallery: [real('lomo-felipe-1'), real('lomo-felipe-2'), real('lomo-felipe-0')],
    isConcept: false,
  },
  {
    slug: 'sosua-ocean-village',
    title: 'Sosua Ocean Village',
    category: 'Resorts & Destinations',
    location: { en: 'Sosúa · Dominican Republic', es: 'Sosúa · República Dominicana' },
    summary: {
      en: 'A private oceanfront residential community of villas, each with its own pool and garden.',
      es: 'Una comunidad residencial privada frente al mar, con villas que tienen piscina y jardín propios.',
    },
    concept: {
      en: 'Furniture for a whole community: villas, terraces and pools that share one relaxed, tropical standard.',
      es: 'Mobiliario para toda una comunidad: villas, terrazas y piscinas con un mismo estándar relajado y tropical.',
    },
    narrative: {
      en: 'Runway supplied interior and outdoor furniture across the villas of this private residential community on the north coast.',
      es: 'Runway suministró mobiliario interior y exterior para las villas de esta comunidad residencial privada en la costa norte.',
    },
    furniture: [
      { en: 'Villa living and dining', es: 'Salas y comedores para villas' },
      { en: 'Bedroom furniture', es: 'Mobiliario de dormitorio' },
      { en: 'Pool terrace furniture', es: 'Mobiliario para terraza de piscina' },
      { en: 'Outdoor lounges', es: 'Salas exteriores' },
    ],
    cover: real('sosua-aerial'),
    gallery: [],
    isConcept: false,
  },
  {
    slug: 'oslo-house',
    title: 'Oslo House',
    category: 'Private Residences',
    location: { en: 'Alicante · Spain', es: 'Alicante · España' },
    collection: 'Vondom',
    summary: {
      en: 'A cantilevered house on the hillside, with an infinity pool facing the mountains.',
      es: 'Una casa en voladizo sobre la ladera, con piscina infinita frente a las montañas.',
    },
    concept: {
      en: 'White, light and open: indoor and outdoor rooms flow into each other behind walls of glass.',
      es: 'Blanca, luminosa y abierta: los espacios interiores y exteriores se funden tras muros de cristal.',
    },
    narrative: {
      en: 'Dining, lounge and pool furniture by Vondom repeat the same pale tones and soft shapes inside and out.',
      es: 'El mobiliario de comedor, sala y piscina de Vondom repite los mismos tonos claros y formas suaves dentro y fuera.',
    },
    furniture: [
      { en: 'Indoor-outdoor dining sets', es: 'Comedores interior y exterior' },
      { en: 'Sculptural lounge chairs', es: 'Sillones escultóricos' },
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Terrace tables', es: 'Mesas de terraza' },
    ],
    cover: real('oslo-3'),
    gallery: [real('oslo-1'), real('oslo-2'), real('oslo-0')],
    isConcept: false,
  },
  {
    slug: 'bridge-house-hotel',
    title: 'The Bridge House Hotel',
    category: 'Luxury Hospitality',
    location: { en: 'United Kingdom', es: 'Reino Unido' },
    summary: {
      en: 'A characterful lounge of aged leather, reclaimed wood and industrial detail.',
      es: 'Un lounge con carácter: cuero envejecido, madera recuperada y detalles industriales.',
    },
    concept: {
      en: 'Worn leather sofas and vintage-inspired pieces against raw plaster and timber — warmth and history in one room.',
      es: 'Sofás de cuero gastado y piezas de inspiración vintage contra yeso y madera en bruto: calidez e historia en un solo espacio.',
    },
    narrative: {
      en: 'Lounge seating, coffee tables and accent pieces were supplied to give the hotel’s public spaces a relaxed, lived-in character.',
      es: 'Se suministraron asientos de lounge, mesas de centro y piezas de acento para dar a las áreas públicas del hotel un carácter relajado y acogedor.',
    },
    furniture: [
      { en: 'Aged leather sofas', es: 'Sofás de cuero envejecido' },
      { en: 'Leather lounge chairs', es: 'Sillones de cuero' },
      { en: 'Industrial coffee tables', es: 'Mesas de centro industriales' },
      { en: 'Accent furniture', es: 'Muebles de acento' },
    ],
    cover: real('bridge-house-lounge'),
    gallery: [],
    isConcept: false,
  },
  {
    slug: 'beverly-hills-house',
    title: 'Beverly Hills House',
    category: 'Private Residences',
    location: { en: 'Beverly Hills · USA', es: 'Beverly Hills · EE. UU.' },
    collection: 'Vondom',
    summary: {
      en: 'A low, long Californian house around a deep blue pool and timber deck.',
      es: 'Una casa californiana baja y alargada alrededor de una piscina azul profundo y una terraza de madera.',
    },
    concept: {
      en: 'White outdoor lounges float on the wooden deck, mirroring the long horizontal lines of the house.',
      es: 'Salas exteriores blancas flotan sobre la terraza de madera, reflejando las largas líneas horizontales de la casa.',
    },
    narrative: {
      en: 'Vondom pool and lounge furniture furnish the deck and terraces, designed to be enjoyed from late afternoon into the evening.',
      es: 'El mobiliario de piscina y sala de Vondom viste la terraza, pensado para disfrutarse desde la tarde hasta la noche.',
    },
    furniture: [
      { en: 'Outdoor lounge sofas', es: 'Sofás de exterior' },
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Low terrace tables', es: 'Mesas bajas de terraza' },
      { en: 'Garden accents', es: 'Accesorios de jardín' },
    ],
    cover: real('beverly-2'),
    gallery: [real('beverly-1'), real('beverly-0')],
    isConcept: false,
  },
  {
    slug: 'arrecife-royal',
    title: 'Arrecife Royal',
    category: 'Resorts & Destinations',
    location: { en: 'Dominican Republic', es: 'República Dominicana' },
    collection: 'Vondom',
    summary: {
      en: 'A Caribbean residence with sweeping pool terraces and a long dining room facing the sea.',
      es: 'Una residencia caribeña con amplias terrazas de piscina y un gran comedor frente al mar.',
    },
    concept: {
      en: 'Generous outdoor living: loungers along the pool, a dining table for twenty and a view that never ends.',
      es: 'Vida exterior generosa: camastros a lo largo de la piscina, una mesa para veinte y una vista sin fin.',
    },
    narrative: {
      en: 'Pool, dining and lounge furniture by Vondom link the white architecture to its gardens and to the sea beyond.',
      es: 'El mobiliario de piscina, comedor y sala de Vondom une la arquitectura blanca con sus jardines y con el mar.',
    },
    furniture: [
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Large dining table and chairs', es: 'Gran mesa de comedor y sillas' },
      { en: 'Outdoor lounge sets', es: 'Salas exteriores' },
      { en: 'Pendant lighting', es: 'Lámparas colgantes' },
    ],
    cover: real('arrecife-1'),
    gallery: [real('arrecife-2'), real('arrecife-0')],
    isConcept: false,
  },
]

export const hospitalityScenes = [
  {
    title: { en: 'Suites', es: 'Suites' },
    caption: { en: 'Calm, layered rooms designed for rest, light and quiet.', es: 'Habitaciones serenas y en capas, pensadas para el descanso, la luz y el silencio.' },
    image: real('suite-warm'),
  },
  {
    title: { en: 'Resorts', es: 'Resorts' },
    caption: { en: 'Furniture that faces the horizon and holds the last light of the day.', es: 'Mobiliario que mira al horizonte y retiene la última luz del día.' },
    image: real('resort-infinity'),
  },
  {
    title: { en: 'Lounges', es: 'Lounges' },
    caption: { en: 'Deep seating and warm light, composed for long evenings by the sea.', es: 'Asientos profundos y luz cálida para largas noches junto al mar.' },
    image: real('lounge-sunset'),
  },
  {
    title: { en: 'Beach Clubs', es: 'Beach clubs' },
    caption: { en: 'Sculptural loungers and daybeds that turn a pool deck into a destination.', es: 'Camastros escultóricos y camas de día que convierten una piscina en un destino.' },
    image: real('beachclub-pool'),
  },
  {
    title: { en: 'Bars', es: 'Bares' },
    caption: { en: 'Illuminated bars and terraces built for sun, salt and full houses.', es: 'Barras iluminadas y terrazas hechas para el sol, la sal y el lleno total.' },
    image: real('bar-pool'),
  },
]

/** Client list, as published in the Runway company profile. Venue names stay as written. */
export const clients = {
  regions: [
    {
      region: { en: 'Caribbean', es: 'Caribe' },
      names: [
        'Radisson Aruba Resort, Casino & Spa — Aruba',
        'Cambridge Beaches — Bermuda',
        'Ocean Club by Gansevoort — Dominican Republic',
        'Costa Esmeralda by Lifestyle — Dominican Republic',
        'The Royal Villas by Lifestyle — Dominican Republic',
        'Infiniti Blu Ocean Condos — Dominican Republic',
        'Sea Horse Ranch Villas — Dominican Republic',
        'Sosua Ocean Village — Dominican Republic',
        'Grand Paradise Playa Dorada — Dominican Republic',
        'Hilton Rose Hall Resort & Spa — Montego Bay, Jamaica',
        'Cooper Island Resort — British Virgin Islands',
        'Kapok Hotel — Trinidad & Tobago',
        'Rinco Beach Resort — Puerto Rico',
      ],
    },
    {
      region: { en: 'Asia', es: 'Asia' },
      names: [
        'Four Seasons Resort — Koh Samui, Thailand',
        'Sofitel Hotel — Singapore',
        'Hilton Hotel (Rooftop) — Hong Kong',
        'Rock Bar — Bali, Indonesia',
        'Khayangan Estate — Bali',
        'Alia Hotel — Goa, India',
        'Eden Island Resorts — Seychelles',
      ],
    },
    {
      region: { en: 'USA & Europe', es: 'EE. UU. y Europa' },
      names: [
        'Fontainebleau Miami Beach (Pool Bar) — USA',
        'Rocco Forte Hotel — Frankfurt, Germany',
        'Rixos Hotel Group — Turkey',
        'Leopolda Resorts — Italy',
        'Casa India — Ibiza, Spain',
        'Palm Beach Hotel — Cyprus',
        "Morgan's Hotel Ltd — UK",
        'The Bridge House Hotel — UK',
        'Isle of Eriska Hotel — UK',
        'The Churchill Hotel — UK',
        'The Varsity Hotel — UK',
        'Fuller, Smith & Turner — UK',
        'Sobornaya Sloboda — Moscow',
      ],
    },
    {
      region: { en: 'Canada', es: 'Canadá' },
      names: ['Sheraton Hotel', 'Aldo Construction', 'Groupe Cholette', 'Trans Management'],
    },
  ],
  celebrities: [
    'Oprah Winfrey',
    'Angelina Jolie',
    'Bruce Willis',
    'Sharon Stone',
    'Pierce Brosnan',
    'Arnold Schwarzenegger',
    'Janet Jackson',
    'Michael Bublé',
    'Goldie Hawn & Kurt Russell',
    'Elizabeth Hurley',
    'Dennis Quaid',
    'John Cusack',
    'Ozzy Osbourne',
    'LeAnn Rimes',
    'The Edge (U2)',
    'Jacques Villeneuve',
  ],
  dignitaries: [
    { en: 'HRH King Abdullah of Jordan', es: 'S. M. el Rey Abdalá de Jordania' },
    same('Bill Clinton'),
    { en: 'The Prime Minister of New Zealand', es: 'El Primer Ministro de Nueva Zelanda' },
  ] satisfies T[],
  media: ['HGTV', 'Entertainment Tonight', 'Queer Eye for the Straight Guy', 'Two and a Half Men'],
}

export type Collection = { name: string; pieces: string; description: T; image: string }

/** Kenkoon — modernized outdoor furniture represented by Runway. Collection names from the Kenkoon catalogue. */
export const kenkoon = {
  name: 'Kenkoon',
  designer: 'Metchanun Suensilpong',
  collections: [
    {
      name: 'Stainless Steel & Mesh',
      pieces: 'Antenna · Arena · Black Beo · Botanic · Dune · Dux · Geometric · Morphose · Self · Sunglass · TT',
      description: {
        en: 'Light, graphic frames in stainless steel with outdoor mesh and cushions, from dining chairs to cocoon loungers.',
        es: 'Estructuras ligeras y gráficas en acero inoxidable con malla exterior y cojines, desde sillas de comedor hasta loungers tipo capullo.',
      },
      image: real('kenkoon-mesh-sunset'),
    },
    {
      name: 'Transformation of Howdah',
      pieces: 'Capsule · Gaz',
      description: {
        en: 'Canopied daybeds and pavilions inspired by the howdah — a private room for the pool, the garden or the beach.',
        es: 'Camas de día con dosel y pabellones inspirados en el howdah: una habitación privada para la piscina, el jardín o la playa.',
      },
      image: real('kenkoon-howdah'),
    },
    {
      name: 'Braided Rope, Stone & Metal',
      pieces: 'Bloom · Bloxx · Diavik · Hana · Kage · Triz',
      description: {
        en: 'Hand-braided rope, natural stone and metal combined into lounge chairs, sofas and sculptural tables.',
        es: 'Cuerda trenzada a mano, piedra natural y metal combinados en sillones, sofás y mesas escultóricas.',
      },
      image: real('kenkoon-braided'),
    },
    {
      name: 'Teak & Stainless',
      pieces: 'Absorption · Arena · Barcode · Beo · Botanic · Kurf · Latitude · Shell · Slim · Taji',
      description: {
        en: 'Warm teak slats on stainless steel frames — loungers, dining and lounge sets built for coastal climates.',
        es: 'Listones de teca cálida sobre estructuras de acero inoxidable: camastros, comedores y salas hechos para climas costeros.',
      },
      image: real('kenkoon-teak-stainless'),
    },
    {
      name: 'Pure Teak',
      pieces: 'Absolute · Botanic · Saturno · Self',
      description: {
        en: 'Solid teak in its purest form: dining tables, chairs and faceted lounge pieces that age to a silver patina.',
        es: 'Teca maciza en su forma más pura: mesas, sillas y piezas facetadas que envejecen con una pátina plateada.',
      },
      image: real('kenkoon-pure-teak-2'),
    },
    {
      name: 'Accessories',
      pieces: 'Beo · Bibi · Q-Cina · The Door Shower · Vegeo · Waterfall',
      description: {
        en: 'Outdoor kitchens, bar carts and showers that complete the terrace.',
        es: 'Cocinas exteriores, carritos de bar y duchas que completan la terraza.',
      },
      image: real('kenkoon-accessories'),
    },
  ] satisfies Collection[],
}

/** Runway's own interior collection — leather and lounge pieces from the company profile. */
export const interiorCollection = [real('collection-sofa'), real('collection-salon'), real('collection-library'), real('collection-chesterfield')]

export type Material = {
  key: keyof typeof textures
  name: T
  family: T
  description: T
}

export const materials: Material[] = [
  {
    key: 'marble',
    name: { en: 'Calacatta Marble', es: 'Mármol Calacatta' },
    family: { en: 'Stone', es: 'Piedra' },
    description: {
      en: 'Warm white ground with soft grey and bronze veining, honed to a quiet satin finish.',
      es: 'Fondo blanco cálido con vetas suaves en gris y bronce, apomazado a un acabado satinado.',
    },
  },
  {
    key: 'travertine',
    name: { en: 'Travertine', es: 'Travertino' },
    family: { en: 'Stone', es: 'Piedra' },
    description: {
      en: 'Banded, porous and mineral — filled or left open for a more geological surface.',
      es: 'Veteado, poroso y mineral: relleno o con poro abierto para una superficie más geológica.',
    },
  },
  {
    key: 'oak',
    name: { en: 'European Oak', es: 'Roble europeo' },
    family: { en: 'Timber', es: 'Madera' },
    description: { en: 'Straight, calm grain in natural, smoked or blackened finishes.', es: 'Veta recta y serena en acabado natural, ahumado o ennegrecido.' },
  },
  {
    key: 'walnut',
    name: { en: 'American Walnut', es: 'Nogal americano' },
    family: { en: 'Timber', es: 'Madera' },
    description: {
      en: 'Deep chocolate tones and cathedral figure, oiled to deepen with age.',
      es: 'Tonos chocolate profundos y veta catedral, aceitado para oscurecerse con los años.',
    },
  },
  {
    key: 'leather',
    name: { en: 'Cognac Leather', es: 'Cuero coñac' },
    family: { en: 'Upholstery', es: 'Tapicería' },
    description: {
      en: 'Full-grain, vegetable-tanned hide that develops a patina over the years.',
      es: 'Piel de flor entera curtida al vegetal que desarrolla una pátina con los años.',
    },
  },
  {
    key: 'linen',
    name: { en: 'Belgian Linen', es: 'Lino belga' },
    family: { en: 'Textile', es: 'Textil' },
    description: {
      en: 'Slubbed natural weave, breathable and relaxed — also in performance grades.',
      es: 'Tejido natural con textura, transpirable y relajado; también en versiones de alto rendimiento.',
    },
  },
  {
    key: 'boucle',
    name: { en: 'Wool Bouclé', es: 'Bouclé de lana' },
    family: { en: 'Textile', es: 'Textil' },
    description: {
      en: 'Looped wool yarns with a soft, sculptural, light-catching texture.',
      es: 'Hilos de lana rizados con una textura suave y escultórica que atrapa la luz.',
    },
  },
  {
    key: 'bronze',
    name: { en: 'Brushed Bronze', es: 'Bronce cepillado' },
    family: { en: 'Metal', es: 'Metal' },
    description: {
      en: 'Hand-brushed and patinated; ages gracefully in coastal environments.',
      es: 'Cepillado a mano y patinado; envejece con elegancia en ambientes costeros.',
    },
  },
  {
    key: 'glass',
    name: { en: 'Smoked Glass', es: 'Vidrio ahumado' },
    family: { en: 'Mineral', es: 'Mineral' },
    description: {
      en: 'Structural and decorative glass in deep smoked and mineral tints.',
      es: 'Vidrio estructural y decorativo en tonos ahumados y minerales profundos.',
    },
  },
]
