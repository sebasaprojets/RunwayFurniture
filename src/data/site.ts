import founderDeck from '../assets/img/founder-deck.jpg'
import founderStanding from '../assets/img/founder-standing.jpg'
import founderSeated from '../assets/img/founder-seated.jpg'

import type { T } from '../i18n'

/** Photography supplied by Runway (company profile, Vondom residential book, Kenkoon catalogue). */
const realFiles = import.meta.glob<string>('../assets/img/real/*.jpg', { eager: true, import: 'default' })
const real = (name: string) => {
  const url = realFiles[`../assets/img/real/${name}.jpg`]
  if (!url) throw new Error(`Missing image: ${name}`)
  return url
}

/** Lighter 960px version of a supplied photo, for grids and cards. */
const thumbs = new Map(
  Object.entries(realFiles)
    .filter(([k]) => k.endsWith('.sm.jpg'))
    .map(([k, v]) => [realFiles[k.replace('.sm.jpg', '.jpg')], v]),
)
export const thumb = (url: string) => thumbs.get(url) ?? url

/** Supplied photography used for full-bleed moments outside the project pages. */
export const showcase = {
  residence: real('sardinera-1'),
  contact: real('lounge-sunset'),
}

export const images = {
  founderDeck,
  founderStanding,
  founderSeated,
}

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
    /** HD version on YouTube (from the Drive material); the WhatsApp copy was 480p. */
    youtube: 'p2-C_48G3Zk',
    src: '',
    srcWebm: '',
    poster: './media/runway-film.jpg',
    duration: '',
  },
  {
    title: { en: 'The Showroom', es: 'El showroom' },
    caption: {
      en: 'Inside the Foresta showroom: living, dining and lighting collections on display.',
      es: 'Dentro del showroom Foresta: colecciones de sala, comedor e iluminación en exhibición.',
    },
    youtube: undefined as string | undefined,
    src: './media/showroom.mp4',
    srcWebm: './media/showroom.webm',
    poster: './media/showroom.jpg',
    duration: '1:10',
  },
]

export const navItems = [
  { label: { en: 'Projects', es: 'Proyectos' }, href: '#projects', image: real('sardinera-1') },
  { label: { en: 'Hospitality', es: 'Hotelería' }, href: '#hospitality', image: real('gansevoort-pool') },
  { label: { en: 'Collections', es: 'Colecciones' }, href: '#collections', image: real('kenkoon-mesh-sunset') },
  { label: { en: 'Clients', es: 'Clientes' }, href: '#clients', image: real('beachclub-pool') },
  { label: { en: 'About', es: 'Nosotros' }, href: '#founder', image: founderStanding },
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
    gallery: [
      real('gansevoort-beach'),
      real('gansevoort-terrace'),
      real('gansevoort-restaurant'),
      real('gansevoort-terrace-2'),
      real('gansevoort-suite'),
      real('gansevoort-bedroom'),
      real('gansevoort-bedroom-2'),
      real('gansevoort-living-2'),
      real('gansevoort-living'),
      real('gansevoort-kitchen'),
      real('gansevoort-lounge'),
      real('gansevoort-wine'),
      real('gansevoort-lounge-2'),
    ],
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
    gallery: [real('costa-esmeralda-loungers'), real('costa-esmeralda-pool'), real('costa-esmeralda-cabanas'), real('costa-esmeralda-dining')],
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
    gallery: [real('sosua-living'), real('sosua-kitchen'), real('sosua-stairs'), real('sosua-bedroom')],
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
    gallery: [real('bridge-house-sofa'), real('bridge-house-salon'), real('bridge-house-lounge-2'), real('bridge-house-sofa-2'), real('bridge-house-dining')],
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
  {
    slug: 'las-cumbres-house',
    title: 'Las Cumbres House',
    category: 'Private Residences',
    location: { en: 'Bétera · Spain', es: 'Bétera · España' },
    collection: 'Vondom',
    summary: {
      en: 'A stone-and-white villa wrapped around a turquoise pool and an old olive tree.',
      es: 'Una villa de piedra y blanco que rodea una piscina turquesa y un olivo centenario.',
    },
    concept: {
      en: 'The living room opens completely to the terrace, so the sofas sit half inside, half in the garden.',
      es: 'La sala se abre por completo a la terraza: los sofás quedan mitad dentro, mitad en el jardín.',
    },
    narrative: {
      en: 'Vondom lounge furniture in soft greys carries the same calm from the living room to the pool deck.',
      es: 'El mobiliario de sala de Vondom en grises suaves lleva la misma calma de la sala a la piscina.',
    },
    furniture: [
      { en: 'Indoor-outdoor sofas', es: 'Sofás interior y exterior' },
      { en: 'Low lounge tables', es: 'Mesas bajas de sala' },
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Terrace armchairs', es: 'Sillones de terraza' },
    ],
    cover: real('cumbres-1'),
    gallery: [real('cumbres-2'), real('cumbres-3'), real('cumbres-0')],
    isConcept: false,
  },
  {
    slug: 'herrero-house',
    title: 'Herrero House',
    category: 'Private Residences',
    location: { en: 'Barcelona · Spain', es: 'Barcelona · España' },
    collection: 'Vondom',
    summary: {
      en: 'A long white house on a green lawn, with a pool that runs the length of the garden.',
      es: 'Una casa blanca y alargada sobre el césped, con una piscina que recorre todo el jardín.',
    },
    concept: {
      en: 'Simple white volumes, blue water and green grass: the furniture keeps to the same clean palette.',
      es: 'Volúmenes blancos, agua azul y césped verde: el mobiliario respeta la misma paleta limpia.',
    },
    narrative: {
      en: 'Vondom outdoor dining and lounge pieces line the terraces along the house, facing the pool and the sun.',
      es: 'Las piezas de comedor y sala exterior de Vondom recorren las terrazas de la casa, frente a la piscina y el sol.',
    },
    furniture: [
      { en: 'Outdoor dining sets', es: 'Comedores exteriores' },
      { en: 'Terrace lounge chairs', es: 'Sillones de terraza' },
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Planters', es: 'Maceteros' },
    ],
    cover: real('herrero-1'),
    gallery: [real('herrero-2'), real('herrero-3'), real('herrero-0')],
    isConcept: false,
  },
  {
    slug: 'vitacura-house',
    title: 'Vitacura House',
    category: 'Private Residences',
    location: { en: 'Vitacura · Chile', es: 'Vitacura · Chile' },
    collection: 'Vondom',
    summary: {
      en: 'A hillside terrace in the Andes foothills, furnished for long afternoons outdoors.',
      es: 'Una terraza en las faldas de los Andes, amueblada para largas tardes al aire libre.',
    },
    concept: {
      en: 'Sculptural loungers and low sofas sit on pale stone, with the mountains as the backdrop.',
      es: 'Camastros escultóricos y sofás bajos sobre piedra clara, con las montañas de fondo.',
    },
    narrative: {
      en: 'Vondom lounge furniture turns the roof terrace into an outdoor living room with a view of the valley.',
      es: 'El mobiliario de Vondom convierte la terraza en una sala exterior con vista al valle.',
    },
    furniture: [
      { en: 'Sculptural sun loungers', es: 'Camastros escultóricos' },
      { en: 'Low outdoor sofas', es: 'Sofás bajos de exterior' },
      { en: 'Side tables', es: 'Mesas auxiliares' },
      { en: 'Parasols', es: 'Sombrillas' },
    ],
    cover: real('vitacura-1'),
    gallery: [real('vitacura-2'), real('vitacura-0')],
    isConcept: false,
  },
  {
    slug: 'la-cantera-house',
    title: 'La Cantera House',
    category: 'Private Residences',
    location: { en: 'Valencia · Spain', es: 'Valencia · España' },
    collection: 'Vondom',
    summary: {
      en: 'A cantilevered villa above the bay, with an infinity pool that glows at dusk.',
      es: 'Una villa en voladizo sobre la bahía, con una piscina infinita que brilla al atardecer.',
    },
    concept: {
      en: 'White dining chairs face the sea by day; lit sofas and loungers take over the pool deck at night.',
      es: 'De día, sillas blancas frente al mar; de noche, sofás y camastros iluminados toman la piscina.',
    },
    narrative: {
      en: 'Vondom dining, lounge and illuminated pieces furnish the terraces from morning to night.',
      es: 'Las piezas de comedor, sala e iluminadas de Vondom visten las terrazas de la mañana a la noche.',
    },
    furniture: [
      { en: 'Outdoor dining chairs', es: 'Sillas de comedor exterior' },
      { en: 'Illuminated lounge pieces', es: 'Piezas de sala iluminadas' },
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Terrace tables', es: 'Mesas de terraza' },
    ],
    cover: real('cantera-3'),
    gallery: [real('cantera-1'), real('cantera-2'), real('cantera-0')],
    isConcept: false,
  },
  {
    slug: 'ibiza-house',
    title: 'Ibiza House',
    category: 'Private Residences',
    location: { en: 'Ibiza · Spain', es: 'Ibiza · España' },
    collection: 'Vondom',
    summary: {
      en: 'A whitewashed Ibiza retreat with loungers set right into the pool.',
      es: 'Un refugio blanco en Ibiza con camastros dentro de la propia piscina.',
    },
    concept: {
      en: 'Everything is white — walls, floor and furniture — so the water and the sunset bring the colour.',
      es: 'Todo es blanco, muros, suelo y muebles: el agua y el atardecer ponen el color.',
    },
    narrative: {
      en: 'Vondom in-pool loungers and outdoor dining extend the house onto the water.',
      es: 'Los camastros para piscina y el comedor exterior de Vondom extienden la casa sobre el agua.',
    },
    furniture: [
      { en: 'In-pool sun loungers', es: 'Camastros para piscina' },
      { en: 'Outdoor dining set', es: 'Comedor exterior' },
      { en: 'Lounge chairs', es: 'Sillones' },
      { en: 'Side tables', es: 'Mesas auxiliares' },
    ],
    cover: real('ibiza-1'),
    gallery: [real('ibiza-0')],
    isConcept: false,
  },
  {
    slug: '1001-noches',
    title: '1001 Noches',
    category: 'Private Residences',
    location: { en: 'Almería · Spain', es: 'Almería · España' },
    collection: 'Vondom',
    summary: {
      en: 'A stone house set into the landscape, with long lawns and a pool terrace.',
      es: 'Una casa de piedra integrada en el paisaje, con amplios jardines y terraza de piscina.',
    },
    concept: {
      en: 'Grey loungers with red cushions echo the stone walls and add a single note of colour.',
      es: 'Camastros grises con cojines rojos dialogan con los muros de piedra y suman una sola nota de color.',
    },
    narrative: {
      en: 'Vondom loungers and lounge sets run along the pool and the covered terrace.',
      es: 'Los camastros y salas de Vondom recorren la piscina y la terraza cubierta.',
    },
    furniture: [
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Covered-terrace lounge', es: 'Sala de terraza cubierta' },
      { en: 'Planters', es: 'Maceteros' },
      { en: 'Side tables', es: 'Mesas auxiliares' },
    ],
    cover: real('noches-1'),
    gallery: [real('noches-2'), real('noches-0')],
    isConcept: false,
  },
  {
    slug: 'el-palomar-house',
    title: 'El Palomar House',
    category: 'Private Residences',
    location: { en: 'Mexico', es: 'México' },
    collection: 'Vondom',
    summary: {
      en: 'A glass pavilion house opening onto a lawn and a long terrace.',
      es: 'Una casa pabellón de cristal que se abre a un jardín y una larga terraza.',
    },
    concept: {
      en: 'Sculptural white and graphite pieces sit between the glass walls and the garden.',
      es: 'Piezas escultóricas en blanco y grafito entre los muros de cristal y el jardín.',
    },
    narrative: {
      en: 'Vondom lounge chairs, loungers and pouf seating furnish the terrace and the lawn.',
      es: 'Sillones, camastros y pufs de Vondom visten la terraza y el jardín.',
    },
    furniture: [
      { en: 'Sculptural lounge chairs', es: 'Sillones escultóricos' },
      { en: 'Garden sun loungers', es: 'Camastros de jardín' },
      { en: 'Pouf seating', es: 'Pufs' },
      { en: 'Terrace tables', es: 'Mesas de terraza' },
    ],
    cover: real('palomar-1'),
    gallery: [real('palomar-2'), real('palomar-3'), real('palomar-0')],
    isConcept: false,
  },
  {
    slug: 'modena-house',
    title: 'Modena House',
    category: 'Private Residences',
    location: { en: 'Modena · Italy', es: 'Módena · Italia' },
    collection: 'Vondom',
    summary: {
      en: 'A contemporary take on the gabled farmhouse, open to a green garden.',
      es: 'Una versión contemporánea de la casa de campo a dos aguas, abierta a un jardín verde.',
    },
    concept: {
      en: 'Black frames, white walls and climbing plants: the furniture stays light and graphic.',
      es: 'Marcos negros, muros blancos y enredaderas: el mobiliario se mantiene ligero y gráfico.',
    },
    narrative: {
      en: 'Vondom dining and lounge pieces connect the kitchen, the porch and the garden.',
      es: 'Las piezas de comedor y sala de Vondom conectan la cocina, el porche y el jardín.',
    },
    furniture: [
      { en: 'Outdoor dining set', es: 'Comedor exterior' },
      { en: 'Porch lounge chairs', es: 'Sillones de porche' },
      { en: 'Bar stools', es: 'Taburetes' },
      { en: 'Garden accents', es: 'Accesorios de jardín' },
    ],
    cover: real('modena-1'),
    gallery: [real('modena-3'), real('modena-2'), real('modena-0')],
    isConcept: false,
  },
  {
    slug: 'ottel-house',
    title: 'Öttel House',
    category: 'Private Residences',
    location: { en: 'Vizcaya · Spain', es: 'Vizcaya · España' },
    collection: 'Vondom',
    summary: {
      en: 'Warm, soft interiors in cream and wood, with a covered terrace for dining.',
      es: 'Interiores cálidos y suaves en crema y madera, con una terraza cubierta para comer.',
    },
    concept: {
      en: 'Deep sofas and round tables create a relaxed, family living space.',
      es: 'Sofás profundos y mesas redondas crean un espacio familiar y relajado.',
    },
    narrative: {
      en: 'Vondom seating and tables carry the same soft forms from the living room to the terrace.',
      es: 'Los asientos y mesas de Vondom llevan las mismas formas suaves de la sala a la terraza.',
    },
    furniture: [
      { en: 'Deep lounge sofas', es: 'Sofás profundos' },
      { en: 'Round coffee tables', es: 'Mesas de centro redondas' },
      { en: 'Terrace dining set', es: 'Comedor de terraza' },
      { en: 'Accent chairs', es: 'Sillas de acento' },
    ],
    cover: real('ottel-1'),
    gallery: [real('ottel-2'), real('ottel-0')],
    isConcept: false,
  },
  {
    slug: 'la-pinada-house',
    title: 'La Pinada House',
    category: 'Private Residences',
    location: { en: 'Valencia · Spain', es: 'Valencia · España' },
    collection: 'Vondom',
    summary: {
      en: 'A low house among pines, with a pergola dining terrace and a glowing glass front.',
      es: 'Una casa baja entre pinos, con un comedor bajo pérgola y una fachada de cristal iluminada.',
    },
    concept: {
      en: 'White chairs and long tables sit under the pergola, in the dappled light of the pines.',
      es: 'Sillas blancas y mesas largas bajo la pérgola, en la luz filtrada de los pinos.',
    },
    narrative: {
      en: 'Vondom dining furniture runs from the kitchen to the pergola and the garden.',
      es: 'El mobiliario de comedor de Vondom va de la cocina a la pérgola y al jardín.',
    },
    furniture: [
      { en: 'Pergola dining set', es: 'Comedor bajo pérgola' },
      { en: 'White dining chairs', es: 'Sillas de comedor blancas' },
      { en: 'Kitchen table', es: 'Mesa de cocina' },
      { en: 'Garden seating', es: 'Asientos de jardín' },
    ],
    cover: real('pinada-3'),
    gallery: [real('pinada-1'), real('pinada-2'), real('pinada-0')],
    isConcept: false,
  },
  {
    slug: 'castellon-house',
    title: 'Castellón House',
    category: 'Private Residences',
    location: { en: 'Castellón · Spain', es: 'Castellón · España' },
    collection: 'Vondom',
    summary: {
      en: 'Light-filled dining rooms with soft blinds and sculptural pendant lamps.',
      es: 'Comedores luminosos con cortinas suaves y lámparas colgantes escultóricas.',
    },
    concept: {
      en: 'Pale chairs, glass tables and woven pendants make a calm, bright dining space.',
      es: 'Sillas claras, mesas de cristal y lámparas tejidas crean un comedor sereno y luminoso.',
    },
    narrative: {
      en: 'Vondom dining chairs and pendant lighting furnish the indoor and covered dining areas.',
      es: 'Las sillas de comedor y lámparas de Vondom visten los comedores interiores y cubiertos.',
    },
    furniture: [
      { en: 'Dining chairs', es: 'Sillas de comedor' },
      { en: 'Glass dining table', es: 'Mesa de comedor de cristal' },
      { en: 'Woven pendant lamps', es: 'Lámparas colgantes tejidas' },
      { en: 'Side tables', es: 'Mesas auxiliares' },
    ],
    cover: real('castellon-1'),
    gallery: [real('castellon-2'), real('castellon-0')],
    isConcept: false,
  },
  {
    slug: 'kaloterakis',
    title: 'Kaloterakis',
    category: 'Private Residences',
    location: { en: 'Greece', es: 'Grecia' },
    collection: 'Vondom',
    summary: {
      en: 'A Mediterranean pool terrace that turns gold at sunset.',
      es: 'Una terraza mediterránea con piscina que se vuelve dorada al atardecer.',
    },
    concept: {
      en: 'White in-pool loungers and rounded seating stand out against the blue water and the sky.',
      es: 'Camastros blancos dentro de la piscina y asientos redondeados resaltan contra el agua y el cielo.',
    },
    narrative: {
      en: 'Vondom pool, lounge and planter pieces furnish the terraces and the garden paths.',
      es: 'Las piezas de piscina, sala y maceteros de Vondom visten las terrazas y los caminos del jardín.',
    },
    furniture: [
      { en: 'In-pool sun loungers', es: 'Camastros para piscina' },
      { en: 'Rounded lounge chairs', es: 'Sillones redondeados' },
      { en: 'Planters', es: 'Maceteros' },
      { en: 'Terrace furniture', es: 'Mobiliario de terraza' },
    ],
    cover: real('kaloterakis-1'),
    gallery: [real('kaloterakis-2'), real('kaloterakis-0')],
    isConcept: false,
  },
  {
    slug: 'finca-las-marias',
    title: 'Finca Las Marías',
    category: 'Private Residences',
    location: { en: 'Spain', es: 'España' },
    collection: 'Vondom',
    summary: {
      en: 'A modern country house with a deep covered porch facing the garden.',
      es: 'Una casa de campo moderna con un amplio porche cubierto frente al jardín.',
    },
    concept: {
      en: 'White outdoor furniture fills the porch, framed by timber and white walls.',
      es: 'Mobiliario exterior blanco llena el porche, enmarcado por madera y muros blancos.',
    },
    narrative: {
      en: 'Vondom lounge and dining pieces turn the porch into the main living room in summer.',
      es: 'Las piezas de sala y comedor de Vondom convierten el porche en la sala principal en verano.',
    },
    furniture: [
      { en: 'Porch lounge set', es: 'Sala de porche' },
      { en: 'Outdoor dining chairs', es: 'Sillas de comedor exterior' },
      { en: 'Side tables', es: 'Mesas auxiliares' },
      { en: 'Planters', es: 'Maceteros' },
    ],
    cover: real('marias-1'),
    gallery: [real('marias-0')],
    isConcept: false,
  },
  {
    slug: 'ocean-suites-altea',
    title: 'Ocean Suites',
    category: 'Private Residences',
    location: { en: 'Altea · Spain', es: 'Altea · España' },
    collection: 'Vondom',
    summary: {
      en: 'White terraces above the Mediterranean, lit up at dusk against the mountains.',
      es: 'Terrazas blancas sobre el Mediterráneo, iluminadas al atardecer frente a las montañas.',
    },
    concept: {
      en: 'Sculptural white chairs and loungers line the wooden decks of each suite.',
      es: 'Sillas y camastros blancos y escultóricos recorren las terrazas de madera de cada suite.',
    },
    narrative: {
      en: 'Vondom outdoor furniture furnishes the suite terraces, designed for evenings by the sea.',
      es: 'El mobiliario exterior de Vondom viste las terrazas de las suites, pensado para las noches junto al mar.',
    },
    furniture: [
      { en: 'Sculptural terrace chairs', es: 'Sillas escultóricas de terraza' },
      { en: 'Sun loungers', es: 'Camastros' },
      { en: 'Low tables', es: 'Mesas bajas' },
      { en: 'Illuminated pieces', es: 'Piezas iluminadas' },
    ],
    cover: real('altea-1'),
    gallery: [real('altea-0')],
    isConcept: false,
  },
  {
    slug: 'villa-la-reina',
    title: 'Villa La Reina',
    category: 'Private Residences',
    location: { en: 'Vrsar · Croatia', es: 'Vrsar · Croacia' },
    collection: 'Vondom',
    summary: {
      en: 'An Adriatic villa with a pool terrace and white architecture open to the sea air.',
      es: 'Una villa en el Adriático con terraza de piscina y arquitectura blanca abierta a la brisa del mar.',
    },
    concept: {
      en: 'Clean white volumes and pale outdoor furniture keep the focus on the pool and the light.',
      es: 'Volúmenes blancos y mobiliario exterior claro mantienen el protagonismo en la piscina y la luz.',
    },
    narrative: {
      en: 'Vondom loungers and lounge pieces furnish the pool deck and the terraces around the villa.',
      es: 'Los camastros y piezas de sala de Vondom visten la piscina y las terrazas de la villa.',
    },
    furniture: [
      { en: 'Pool loungers', es: 'Camastros de piscina' },
      { en: 'Outdoor lounge set', es: 'Sala exterior' },
      { en: 'Terrace tables', es: 'Mesas de terraza' },
      { en: 'Planters', es: 'Maceteros' },
    ],
    cover: real('reina-1'),
    gallery: [real('reina-2'), real('reina-0')],
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
      region: { en: 'Canada · developers & partners', es: 'Canadá · desarrolladores y socios' },
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
export const interiorCollection = [real('collection-cabinet'), real('collection-library'), real('collection-chesterfield')]
