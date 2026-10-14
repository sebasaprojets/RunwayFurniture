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
 * (founder letter / brochure). Edit here; everything else reads from this file.
 */
export const brand = {
  name: 'Runway',
  full: 'Runway Furniture International',
  since: 2009,
  years: 17,
  pillars: ['Luxury Hospitality', 'Residential', 'Bespoke Furniture'],
  offices: [
    { city: 'Montreal', country: 'Canada', lat: 45.5, lon: -73.57 },
    { city: 'Singapore', country: 'Singapore', lat: 1.35, lon: 103.82 },
  ],
  regions: ['Canada', 'Caribbean', 'USA', 'Europe', 'Asia'],
  founder: {
    name: 'Roberto Castle',
    role: 'Founder · Director · Designer',
    quote: 'Your lifestyle is my source of inspiration.',
  },
  /** Enquiries address from the company profile — used by the contact form (mailto). */
  contactEmail: 'info@runwayfurniture.com',
  website: 'www.runwayfurniture.com',
  award: 'Canadian Excellence Award 2008',
}

/** Optional cinematic film for the hero. Drop an mp4 in /public/media and set the path. */
export const heroVideo: { src: string; poster?: string } | null = null

/** Films supplied by Runway, served from /public/media. */
export const films = [
  {
    title: 'The Runway Film',
    caption: 'Resorts, villas and beach clubs furnished by Runway — a four-minute tour of the work.',
    src: './media/runway-film.mp4',
    poster: './media/runway-film.jpg',
    duration: '4:07',
  },
  {
    title: 'The Showroom',
    caption: 'Inside the Foresta showroom: living, dining and lighting collections on display.',
    src: './media/showroom.mp4',
    poster: './media/showroom.jpg',
    duration: '1:10',
  },
]

export const navItems = [
  { label: 'Projects', href: '#projects', image: real('sardinera-1') },
  { label: 'Hospitality', href: '#hospitality', image: real('gansevoort-pool') },
  { label: 'Collections', href: '#collections', image: real('kenkoon-mesh-sunset') },
  { label: 'Clients', href: '#clients', image: real('beachclub-pool') },
  { label: 'About', href: '#founder', image: founderDeck },
  { label: 'Contact', href: '#contact', image: real('lounge-sunset') },
]

export type Category = 'Luxury Hospitality' | 'Resorts & Destinations' | 'Private Residences' | 'Bespoke Furniture' | 'Commercial & Lifestyle Spaces'

export const categories: Category[] = [
  'Luxury Hospitality',
  'Resorts & Destinations',
  'Private Residences',
  'Bespoke Furniture',
  'Commercial & Lifestyle Spaces',
]

export type Project = {
  slug: string
  title: string
  category: Category
  /** Only set when known — concept projects stay unlocated. */
  location?: string
  summary: string
  concept: string
  narrative: string
  /** Material palette keys — shown only when set. */
  materials?: (keyof typeof textures)[]
  furniture: string[]
  cover: string
  gallery: string[]
  /** true = demonstration concept, not a delivered client project. */
  isConcept: boolean
  /** Brand or programme the furniture came from, when relevant. */
  collection?: string
}

export const projects: Project[] = [
  {
    slug: 'ocean-club-gansevoort',
    title: 'Ocean Club',
    category: 'Luxury Hospitality',
    location: 'Gansevoort · Dominican Republic',
    summary: 'Beachfront terraces, pool decks and suites for the Ocean Club, operated by the Gansevoort Hotel Group.',
    concept: 'Low, deep outdoor lounges in black and teak run the full length of the beach terrace, framing the sea rather than blocking it.',
    narrative:
      'From the oceanfront deck and pool cabanas to the bar, the wine lounge and the suites, the furniture carries one calm, contemporary language through every space of the resort.',
    furniture: ['Teak and black outdoor lounge sets', 'Bar-height communal tables', 'Pool cabanas and sun loungers', 'Wine lounge seating'],
    cover: real('gansevoort-pool'),
    gallery: [real('gansevoort-beach'), real('gansevoort-terrace'), real('gansevoort-lounge'), real('gansevoort-wine')],
    isConcept: false,
  },
  {
    slug: 'la-roca-house',
    title: 'La Roca House',
    category: 'Private Residences',
    location: 'Morelia · Mexico',
    collection: 'Vondom',
    summary: 'A cliff-edge house where living, dining and terrace open onto the valley below.',
    concept: 'Sculptural pieces in warm tones sit against raw concrete and full-height glass, so the landscape becomes the main wall of the house.',
    narrative: 'Dining, lounge and terrace furniture by Vondom carry the same soft, organic lines from the interior out to the deck at dusk.',
    furniture: ['Sculptural dining chairs', 'Indoor-outdoor lounge seating', 'Terrace sofas and low tables', 'Statement lighting'],
    cover: real('la-roca-3'),
    gallery: [real('la-roca-1'), real('la-roca-2'), real('la-roca-0')],
    isConcept: false,
  },
  {
    slug: 'costa-esmeralda',
    title: 'Costa Esmeralda',
    category: 'Resorts & Destinations',
    location: 'Puerto Plata · Dominican Republic',
    summary: 'A Lifestyle Holidays vacation resort, furnished around its infinity pools and ocean terraces.',
    concept: 'Teak loungers and long dining tables are lined up along the edge of the infinity pool, every seat facing the Atlantic.',
    narrative: 'Poolside loungers, daybeds and outdoor dining were specified for constant sun, salt and use — and to stay warm and inviting at golden hour.',
    furniture: ['Teak sun loungers', 'Woven daybeds', 'Outdoor dining tables and chairs', 'Pool terrace furniture'],
    cover: real('costa-esmeralda-deck'),
    gallery: [real('costa-esmeralda-dining')],
    isConcept: false,
  },
  {
    slug: 'sardinera-house',
    title: 'Sardinera House',
    category: 'Private Residences',
    location: 'Jávea · Spain',
    collection: 'Vondom',
    summary: 'A white Mediterranean villa stepping down towards the sea around an infinity pool.',
    concept: 'Clean white architecture and pale outdoor furniture let the water, the sky and the light do the work.',
    narrative: 'Outdoor lounge and dining pieces by Vondom extend each level of the house onto its terraces, all the way to the pool edge.',
    furniture: ['Outdoor lounge sofas', 'Pool loungers', 'Terrace dining sets', 'Planters and accents'],
    cover: real('sardinera-1'),
    gallery: [real('sardinera-2'), real('sardinera-3'), real('sardinera-0')],
    isConcept: false,
  },
  {
    slug: 'morgans-hotel',
    title: "Morgan's Hotel",
    category: 'Luxury Hospitality',
    location: 'United Kingdom',
    summary: 'Contemporary guest rooms and bathrooms with bold pattern, dark stone and warm wood.',
    concept: 'Crisp white bedding and pale timber against graphic rugs and dark walls — calm rooms with a confident character.',
    narrative: 'Beds, bedside pieces, writing desks and vanity units were supplied for Morgan’s Hotel Ltd as one coordinated family.',
    furniture: ['Upholstered beds', 'Bedside and desk joinery', 'Floating timber vanity units', 'Statement mirrors'],
    cover: real('morgans-suite'),
    gallery: [real('morgans-bath')],
    isConcept: false,
  },
  {
    slug: 'finca-lomo-felipe',
    title: 'Finca Lomo Felipe',
    category: 'Private Residences',
    location: 'Canary Islands · Spain',
    collection: 'Vondom',
    summary: 'A volcanic-island estate with garden terraces, lit pools and ocean views.',
    concept: 'Bold red lounge chairs and illuminated pieces bring colour and light to stone terraces and tropical gardens.',
    narrative: 'Vondom outdoor furniture furnishes the pergolas, the pool decks and the gardens, glowing after dark like part of the landscape.',
    furniture: ['Pergola lounge chairs', 'Illuminated planters and furniture', 'Pool loungers', 'Garden seating'],
    cover: real('lomo-felipe-3'),
    gallery: [real('lomo-felipe-1'), real('lomo-felipe-2'), real('lomo-felipe-0')],
    isConcept: false,
  },
  {
    slug: 'sosua-ocean-village',
    title: 'Sosua Ocean Village',
    category: 'Resorts & Destinations',
    location: 'Sosúa · Dominican Republic',
    summary: 'A private oceanfront residential community of villas, each with its own pool and garden.',
    concept: 'Furniture for a whole community: villas, terraces and pools that share one relaxed, tropical standard.',
    narrative: 'Runway supplied interior and outdoor furniture across the villas of this private residential community on the north coast.',
    furniture: ['Villa living and dining', 'Bedroom furniture', 'Pool terrace furniture', 'Outdoor lounges'],
    cover: real('sosua-aerial'),
    gallery: [],
    isConcept: false,
  },
  {
    slug: 'oslo-house',
    title: 'Oslo House',
    category: 'Private Residences',
    location: 'Alicante · Spain',
    collection: 'Vondom',
    summary: 'A cantilevered house on the hillside, with an infinity pool facing the mountains.',
    concept: 'White, light and open: indoor and outdoor rooms flow into each other behind walls of glass.',
    narrative: 'Dining, lounge and pool furniture by Vondom repeat the same pale tones and soft shapes inside and out.',
    furniture: ['Indoor-outdoor dining sets', 'Sculptural lounge chairs', 'Pool loungers', 'Terrace tables'],
    cover: real('oslo-3'),
    gallery: [real('oslo-1'), real('oslo-2'), real('oslo-0')],
    isConcept: false,
  },
  {
    slug: 'bridge-house-hotel',
    title: 'The Bridge House Hotel',
    category: 'Luxury Hospitality',
    location: 'United Kingdom',
    summary: 'A characterful lounge of aged leather, reclaimed wood and industrial detail.',
    concept: 'Worn leather sofas and vintage-inspired pieces against raw plaster and timber — warmth and history in one room.',
    narrative: 'Lounge seating, coffee tables and accent pieces were supplied to give the hotel’s public spaces a relaxed, lived-in character.',
    furniture: ['Aged leather sofas', 'Leather lounge chairs', 'Industrial coffee tables', 'Accent furniture'],
    cover: real('bridge-house-lounge'),
    gallery: [],
    isConcept: false,
  },
  {
    slug: 'beverly-hills-house',
    title: 'Beverly Hills House',
    category: 'Private Residences',
    location: 'Beverly Hills · USA',
    collection: 'Vondom',
    summary: 'A low, long Californian house around a deep blue pool and timber deck.',
    concept: 'White outdoor lounges float on the wooden deck, mirroring the long horizontal lines of the house.',
    narrative: 'Vondom pool and lounge furniture furnish the deck and terraces, designed to be enjoyed from late afternoon into the evening.',
    furniture: ['Outdoor lounge sofas', 'Pool loungers', 'Low terrace tables', 'Garden accents'],
    cover: real('beverly-2'),
    gallery: [real('beverly-1'), real('beverly-0')],
    isConcept: false,
  },
  {
    slug: 'arrecife-royal',
    title: 'Arrecife Royal',
    category: 'Resorts & Destinations',
    location: 'Dominican Republic',
    collection: 'Vondom',
    summary: 'A Caribbean residence with sweeping pool terraces and a long dining room facing the sea.',
    concept: 'Generous outdoor living: loungers along the pool, a dining table for twenty and a view that never ends.',
    narrative: 'Pool, dining and lounge furniture by Vondom link the white architecture to its gardens and to the sea beyond.',
    furniture: ['Pool loungers', 'Large dining table and chairs', 'Outdoor lounge sets', 'Pendant lighting'],
    cover: real('arrecife-1'),
    gallery: [real('arrecife-2'), real('arrecife-0')],
    isConcept: false,
  },
]

export const hospitalityScenes = [
  { title: 'Suites', caption: 'Calm, layered rooms designed for rest, light and quiet.', image: real('suite-warm') },
  { title: 'Resorts', caption: 'Furniture that faces the horizon and holds the last light of the day.', image: real('resort-infinity') },
  { title: 'Lounges', caption: 'Deep seating and warm light, composed for long evenings by the sea.', image: real('lounge-sunset') },
  { title: 'Beach Clubs', caption: 'Sculptural loungers and daybeds that turn a pool deck into a destination.', image: real('beachclub-pool') },
  { title: 'Bars', caption: 'Illuminated bars and terraces built for sun, salt and full houses.', image: real('bar-pool') },
]

/** Client list, as published in the Runway company profile. */
export const clients = {
  regions: [
    {
      region: 'Caribbean',
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
      region: 'Asia',
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
      region: 'USA & Europe',
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
      region: 'Canada',
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
  dignitaries: ['HRH King Abdullah of Jordan', 'Bill Clinton', 'The Prime Minister of New Zealand'],
  media: ['HGTV', 'Entertainment Tonight', 'Queer Eye for the Straight Guy', 'Two and a Half Men'],
}

export type Collection = { name: string; pieces: string; description: string; image: string }

/** Kenkoon — modernized outdoor furniture represented by Runway. Collection names from the Kenkoon catalogue. */
export const kenkoon = {
  name: 'Kenkoon',
  tagline: 'Modernized outdoor experience',
  designer: 'Metchanun Suensilpong',
  collections: [
    {
      name: 'Stainless Steel & Mesh',
      pieces: 'Antenna · Arena · Black Beo · Botanic · Dune · Dux · Geometric · Morphose · Self · Sunglass · TT',
      description: 'Light, graphic frames in stainless steel with outdoor mesh and cushions, from dining chairs to cocoon loungers.',
      image: real('kenkoon-mesh-sunset'),
    },
    {
      name: 'Transformation of Howdah',
      pieces: 'Capsule · Gaz',
      description: 'Canopied daybeds and pavilions inspired by the howdah — a private room for the pool, the garden or the beach.',
      image: real('kenkoon-howdah'),
    },
    {
      name: 'Braided Rope, Stone & Metal',
      pieces: 'Bloom · Bloxx · Diavik · Hana · Kage · Triz',
      description: 'Hand-braided rope, natural stone and metal combined into lounge chairs, sofas and sculptural tables.',
      image: real('kenkoon-braided'),
    },
    {
      name: 'Teak & Stainless',
      pieces: 'Absorption · Arena · Barcode · Beo · Botanic · Kurf · Latitude · Shell · Slim · Taji',
      description: 'Warm teak slats on stainless steel frames — loungers, dining and lounge sets built for coastal climates.',
      image: real('kenkoon-teak-stainless'),
    },
    {
      name: 'Pure Teak',
      pieces: 'Absolute · Botanic · Saturno · Self',
      description: 'Solid teak in its purest form: dining tables, chairs and faceted lounge pieces that age to a silver patina.',
      image: real('kenkoon-pure-teak-2'),
    },
    {
      name: 'Accessories',
      pieces: 'Beo · Bibi · Q-Cina · The Door Shower · Vegeo · Waterfall',
      description: 'Outdoor kitchens, bar carts and showers that complete the terrace.',
      image: real('kenkoon-accessories'),
    },
  ] satisfies Collection[],
}

/** Runway's own interior collection — leather and lounge pieces from the company profile. */
export const interiorCollection = [real('collection-sofa'), real('collection-salon'), real('collection-library'), real('collection-chesterfield')]

export type Material = {
  key: keyof typeof textures
  name: string
  family: string
  description: string
}

export const materials: Material[] = [
  { key: 'marble', name: 'Calacatta Marble', family: 'Stone', description: 'Warm white ground with soft grey and bronze veining, honed to a quiet satin finish.' },
  { key: 'travertine', name: 'Travertine', family: 'Stone', description: 'Banded, porous and mineral — filled or left open for a more geological surface.' },
  { key: 'oak', name: 'European Oak', family: 'Timber', description: 'Straight, calm grain in natural, smoked or blackened finishes.' },
  { key: 'walnut', name: 'American Walnut', family: 'Timber', description: 'Deep chocolate tones and cathedral figure, oiled to deepen with age.' },
  { key: 'leather', name: 'Cognac Leather', family: 'Upholstery', description: 'Full-grain, vegetable-tanned hide that develops a patina over the years.' },
  { key: 'linen', name: 'Belgian Linen', family: 'Textile', description: 'Slubbed natural weave, breathable and relaxed — also in performance grades.' },
  { key: 'boucle', name: 'Wool Bouclé', family: 'Textile', description: 'Looped wool yarns with a soft, sculptural, light-catching texture.' },
  { key: 'bronze', name: 'Brushed Bronze', family: 'Metal', description: 'Hand-brushed and patinated; ages gracefully in coastal environments.' },
  { key: 'glass', name: 'Smoked Glass', family: 'Mineral', description: 'Structural and decorative glass in deep smoked and mineral tints.' },
]
