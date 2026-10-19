import type { T } from '../i18n'
import { real } from './site'

/** Photography from the 2025 project reference book, the 2026 new-product book, the 2025 catalogue and the Q kitchen catalogue. */

export type Hotel = { slug: string; name: string; city: T; lat: number; lon: number; image: string }

const h = (slug: string, name: string, city: T, lat: number, lon: number): Hotel => ({ slug, name, city, lat, lon, image: real(`hotel-${slug}`) })

/** Signature hotels and resorts, in the order they are shown. */
export const hotels: Hotel[] = [
  h('st-regis-maldives', 'The St. Regis Maldives Vommuli', { en: 'Vommuli, Maldives', es: 'Vommuli, Maldivas' }, 2.95, 72.9),
  h('w-new-york', 'W New York', { en: 'New York, USA', es: 'Nueva York, EE. UU.' }, 40.76, -73.97),
  h('fontainebleau-miami', 'Fontainebleau', { en: 'Miami Beach, USA', es: 'Miami Beach, EE. UU.' }, 25.82, -80.12),
  h('w-hong-kong', 'W Hong Kong', { en: 'Hong Kong', es: 'Hong Kong' }, 22.3, 114.16),
  h('six-senses-zil-pasyon', 'Six Senses Zil Pasyon', { en: 'Félicité Island, Seychelles', es: 'Isla Félicité, Seychelles' }, -4.32, 55.87),
  h('conrad-koh-samui', 'Conrad Koh Samui', { en: 'Koh Samui, Thailand', es: 'Koh Samui, Tailandia' }, 9.43, 99.93),
  h('w-santiago', 'W Santiago', { en: 'Santiago, Chile', es: 'Santiago, Chile' }, -33.41, -70.6),
  h('roomers-frankfurt', 'Roomers', { en: 'Frankfurt, Germany', es: 'Fráncfort, Alemania' }, 50.11, 8.66),
  h('anantara-kihavah', 'Anantara Kihavah Villas', { en: 'Baa Atoll, Maldives', es: 'Atolón Baa, Maldivas' }, 5.3, 73.0),
  h('sheraton-miyazaki', 'Sheraton Grande Ocean Resort', { en: 'Miyazaki, Japan', es: 'Miyazaki, Japón' }, 31.95, 131.47),
  h('iniala-phuket', 'Iniala Beach Resort', { en: 'Phuket, Thailand', es: 'Phuket, Tailandia' }, 8.13, 98.3),
  h('st-regis-bangkok', 'The St. Regis Bangkok', { en: 'Bangkok, Thailand', es: 'Bangkok, Tailandia' }, 13.74, 100.54),
  h('aqua-mekong', 'Aqua Expeditions Mekong', { en: 'Vietnam & Cambodia', es: 'Vietnam y Camboya' }, 11.56, 104.92),
  h('w-bangkok', 'W Bangkok · The House on Sathorn', { en: 'Bangkok, Thailand', es: 'Bangkok, Tailandia' }, 13.72, 100.53),
  h('sofitel-kuala-lumpur', 'Sofitel Kuala Lumpur Damansara', { en: 'Kuala Lumpur, Malaysia', es: 'Kuala Lumpur, Malasia' }, 3.15, 101.66),
  h('ritz-carlton-bangkok', 'The Ritz-Carlton Residences', { en: 'Bangkok, Thailand', es: 'Bangkok, Tailandia' }, 13.73, 100.55),
  h('le-meridien-bangkok', 'Le Méridien', { en: 'Bangkok, Thailand', es: 'Bangkok, Tailandia' }, 13.73, 100.53),
  h('hua-hin-marriott', 'Hua Hin Marriott Resort & Spa', { en: 'Hua Hin, Thailand', es: 'Hua Hin, Tailandia' }, 12.6, 99.95),
  h('veranda-chiang-mai', 'Veranda High Resort', { en: 'Chiang Mai, Thailand', es: 'Chiang Mai, Tailandia' }, 18.85, 98.7),
  h('dusit-khao-yai', 'dusitD2 Khao Yai', { en: 'Khao Yai, Thailand', es: 'Khao Yai, Tailandia' }, 14.55, 101.4),
  h('suanlangbaan-bangkok', 'Suanlangbaan', { en: 'Bangkok, Thailand', es: 'Bangkok, Tailandia' }, 13.73, 100.55),
]

/** Every property in the reference book, for the running ticker. */
export const hotelNames = [
  'W Santiago', 'W New York', 'W Hong Kong', 'Roomers Frankfurt', 'Wenhua Yipin', 'Sheraton Grande Ocean Resort', 'The St. Regis Maldives',
  'Fontainebleau Miami', 'Six Senses Zil Pasyon', 'La Viola Kyoto', 'Aqua Expeditions Mekong', 'Sofitel Kuala Lumpur', 'The Ocean Club',
  'The Greens TTDI', 'W Bangkok', 'The Ritz-Carlton Residences', 'The St. Regis Bangkok', 'InterContinental Samui', 'Conrad Koh Samui',
  'Hua Hin Marriott', 'Anantara Kihavah', 'Anantara Mai Khao', 'Hilton', 'Iniala Beach Resort', 'Le Méridien', 'The Esse Asoke',
  'Noble Ploenchit', 'Hyde', 'dusitD2 Khao Yai', 'Q Chidlom', 'Veranda Resort', 'Veranda High Resort', 'Y / A / O Residence', 'Vana Residence',
  'Quattro by Sansiri', 'Baan Mai Khao', 'Suanlangbaan',
]

/** Countries and territories represented in the reference book. */
export const hotelCountries = 13

export type Piece = { slug: string; name: string; type: T; family: string; image: string; dark?: boolean }

const p = (slug: string, name: string, type: T, family: string, dark?: boolean): Piece => ({ slug, name, type, family, image: real(`new26-${slug}`), dark })

/** New for 2026. */
export const newPieces: Piece[] = [
  p('flamingo-chair', 'Flamingo', { en: 'Folding chair', es: 'Silla plegable' }, 'Flamingo', true),
  p('curvix-bench', 'Curvix', { en: 'Bench', es: 'Banco' }, 'Curvix'),
  p('bio-sofa', 'Bio', { en: 'Sofa', es: 'Sofá' }, 'Bio'),
  p('maasai-rotation-bed', 'Maasai', { en: 'Rotation bed', es: 'Cama giratoria' }, 'Maasai', true),
  p('samui-island-table', 'Samui Island', { en: 'Coffee table', es: 'Mesa de centro' }, 'Island'),
  p('linea-bench', 'Linea', { en: 'Dining bench', es: 'Banco de comedor' }, 'Linea'),
  p('sefera-lounge', 'Sefera', { en: 'Sofa lounge', es: 'Sofá lounge' }, 'Sefera'),
  p('dritto-chair', 'Dritto', { en: 'Dining chair', es: 'Silla de comedor' }, 'Dritto'),
  p('mayonette-table', 'Mayonette', { en: 'Coffee table', es: 'Mesa de centro' }, 'Mayon'),
  p('anise-mini-bench', 'Anise', { en: 'Mini bench', es: 'Banco pequeño' }, 'Anise'),
  p('maasai-sofa', 'Maasai', { en: '1-seat sofa', es: 'Sofá individual' }, 'Maasai'),
  p('linea-chair', 'Linea', { en: 'Dining chair', es: 'Silla de comedor' }, 'Linea'),
  p('mayon-table', 'Mayon', { en: 'Coffee table', es: 'Mesa de centro' }, 'Mayon', true),
  p('maasai-stool', 'Maasai', { en: 'Stool', es: 'Taburete' }, 'Maasai'),
  p('rain-bench', 'Rain', { en: 'Bench', es: 'Banco' }, 'Rain', true),
]

/** Thirty-year story, from the 2025 catalogue. */
export const heritage = {
  images: { water: real('kk25-gazer-water'), beach: real('kk25-bouffi-beach'), window: real('kk25-window-desert'), dune: real('kk25-chair-dune'), forest: real('kk25-gazebo-forest') },
  milestones: [
    {
      year: '1990s',
      text: {
        en: 'Teak marine accessories and outdoor furniture, built with Swedish know-how for Scandinavian waters.',
        es: 'Accesorios náuticos y mobiliario exterior en teca, con conocimiento técnico sueco para el mercado escandinavo.',
      },
    },
    {
      year: '1998',
      text: {
        en: 'The TAJI collection pairs teak with stainless steel — and the language turns from tropical to modern architectural.',
        es: 'La colección TAJI une teca y acero inoxidable, y el lenguaje pasa de lo tropical a lo arquitectónico moderno.',
      },
    },
    {
      year: '150+',
      text: {
        en: 'Designs signed by Metchanun Suensilpong since 1998, with design awards in America and Asia.',
        es: 'Diseños firmados por Metchanun Suensilpong desde 1998, con premios de diseño en América y Asia.',
      },
    },
  ],
  designers: [
    {
      name: 'Metchanun Suensilpong',
      text: {
        en: 'Trained between Europe and Asia; behind more than 150 designs since 1998, timeless and free of any single style.',
        es: 'Formado entre Europa y Asia; autor de más de 150 diseños desde 1998, atemporales y libres de un único estilo.',
      },
    },
    {
      name: 'Doonyapol Srichan',
      text: {
        en: 'Designing since 2005 with engineers and artists — an Asian mindset, a passion for material, precise detailing.',
        es: 'Diseña desde 2005 junto a ingenieros y artistas: mirada asiática, pasión por el material y detalle preciso.',
      },
    },
  ],
}

/** Q outdoor & indoor kitchens. */
export const kitchens = {
  ardente: { red: real('qrua-ardente-red'), garden: real('qrua-ardente-garden'), garden2: real('qrua-ardente-garden-2'), detail: real('qrua-ardente-detail') },
  tavolo: { closed: real('qrua-tavolo-closed'), open: real('qrua-tavolo-open'), top: real('qrua-tavolo-top'), front: real('qrua-tavolo-front') },
  lines: [
    { name: 'Indoor', image: real('qrua-indoor-kitchen'), text: { en: 'Teak, black steel and stone — a kitchen that reads as architecture.', es: 'Teca, acero negro y piedra: una cocina que se lee como arquitectura.' } },
    { name: 'Compact', image: real('qrua-compact-living'), text: { en: 'A complete kitchen that closes into a single cabinet.', es: 'Una cocina completa que se cierra en un solo mueble.' } },
    { name: 'Outdoor', image: real('qrua-outdoor-wall'), text: { en: 'Built for terraces and gardens, all year round.', es: 'Pensada para terrazas y jardines, todo el año.' } },
  ],
}
