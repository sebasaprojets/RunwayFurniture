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
    name: 'Roberto Castillo',
    role: 'Founder · Director · Designer',
    quote: 'Your lifestyle is my source of inspiration.',
  },
  /** Replace with the real enquiries address — it is only used by the contact form (mailto). */
  contactEmail: 'contact@runwayfurniture.example',
}

/** Optional cinematic film for the hero. Drop an mp4 in /public/media and set the path. */
export const heroVideo: { src: string; poster?: string } | null = null

export const navItems = [
  { label: 'Projects', href: '#projects', image: photos.villaPool },
  { label: 'Collections', href: '#materials', image: photos.livingRoom },
  { label: 'Hospitality', href: '#hospitality', image: photos.resortPool },
  { label: 'Residential', href: '#projects', image: photos.villaDusk },
  { label: 'About', href: '#founder', image: founderDeck },
  { label: 'Contact', href: '#contact', image: photos.restaurant },
]

export type Category =
  | 'Luxury Hospitality'
  | 'Resorts & Destinations'
  | 'Private Residences'
  | 'Bespoke Furniture'
  | 'Commercial & Lifestyle Spaces'

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
  materials: (keyof typeof textures)[]
  furniture: string[]
  cover: string
  gallery: string[]
  /** true = demonstration concept, not a delivered client project. */
  isConcept: boolean
}

export const projects: Project[] = [
  {
    slug: 'horizon-suites',
    title: 'Horizon Suites',
    category: 'Luxury Hospitality',
    summary: 'Five-star guest suites where every piece is drawn for rest, light and quiet.',
    concept:
      'A calm, layered palette of linen, oak and stone lets the view and the light do the work — the furniture frames the experience rather than competing with it.',
    narrative:
      'Upholstered headboards, custom bedside joinery, lounge chairs and writing desks are designed as one family, specified for the durability of hospitality and the comfort of a private home.',
    materials: ['oak', 'linen', 'marble', 'bronze'],
    furniture: ['Upholstered bed & headboard wall', 'Floating oak bedside joinery', 'Reading lounge chair', 'Writing desk with bronze details'],
    cover: photos.hotelSuite,
    gallery: [photos.hotelRoom, photos.hotelBedroom, photos.lounge],
    isConcept: true,
  },
  {
    slug: 'coastal-resort',
    title: 'Coastal Resort',
    category: 'Resorts & Destinations',
    summary: 'Pool decks, palms and horizon lines — outdoor living designed for the tropics.',
    concept:
      'Furniture is kept low and horizontal so nothing interrupts the line between pool, sea and sky.',
    narrative:
      'Teak loungers, performance-linen daybeds and stone-top tables are specified to live outside — salt, sun and humidity included — and to glow at golden hour.',
    materials: ['walnut', 'linen', 'travertine', 'bronze'],
    furniture: ['Teak sun loungers', 'Performance linen daybeds', 'Stone-top side tables', 'Poolside parasols'],
    cover: photos.resortPool,
    gallery: [photos.resortLoungers, photos.resortBeach, photos.resortTropical],
    isConcept: true,
  },
  {
    slug: 'villa-moderna',
    title: 'Villa Moderna',
    category: 'Private Residences',
    summary: 'A contemporary villa where indoor and outdoor living become one continuous space.',
    concept:
      'Large glass openings, pale stone and warm timber — the interior is furnished as an extension of the architecture and the landscape.',
    narrative:
      'Deep sofas, sculptural lounge chairs and monolithic stone tables are scaled to double-height volumes, with outdoor pieces echoing the same lines around the pool.',
    materials: ['travertine', 'oak', 'boucle', 'glass'],
    furniture: ['Modular lounge sofa', 'Monolithic stone coffee table', 'Sculptural lounge chairs', 'Outdoor dining set'],
    cover: photos.villaPool,
    gallery: [photos.villaDusk, photos.villaModern, photos.livingGallery],
    isConcept: true,
  },
  {
    slug: 'atelier-dining',
    title: 'Atelier Dining',
    category: 'Commercial & Lifestyle Spaces',
    summary: 'A restaurant and lounge interior with warm light, rich timber and tailored seating.',
    concept:
      'Banquettes, dining chairs and bar stools are designed as one continuous joinery language, tuned for long evenings and full rooms.',
    narrative:
      'Walnut, leather and brushed bronze under warm, low lighting — robust enough for daily service, refined enough to define the atmosphere of the space.',
    materials: ['walnut', 'leather', 'bronze', 'marble'],
    furniture: ['Custom banquette seating', 'Walnut dining chairs', 'Marble-top tables', 'Bronze bar stools'],
    cover: photos.restaurant,
    gallery: [photos.livingDining, photos.lounge],
    isConcept: true,
  },
  {
    slug: 'tropical-retreat',
    title: 'Tropical Retreat',
    category: 'Luxury Hospitality',
    summary: 'A resort retreat where pool, garden and pavilion are furnished as one landscape.',
    concept: 'Seating is arranged to face the view, not each other — every chair is a front-row seat to the landscape.',
    narrative:
      'Woven loungers, deep outdoor sofas and lanterns on stone, chosen to soften the architecture and hold the warmth of the evening light.',
    materials: ['linen', 'travertine', 'bronze', 'oak'],
    furniture: ['Woven pool loungers', 'Deep outdoor sofas', 'Stone low tables', 'Bronze lanterns'],
    cover: photos.resortTropical,
    gallery: [photos.resortBeach, photos.resortLoungers],
    isConcept: true,
  },
  {
    slug: 'arc-lounge-collection',
    title: 'Arc Lounge Collection',
    category: 'Bespoke Furniture',
    summary: 'Sculptural sofas and lounge chairs developed from first sketch to final upholstery.',
    concept:
      'One continuous curve defines the shell, the arm and the base. Proportions are tuned to each project rather than fixed.',
    narrative:
      'Configured in oak, walnut or bronze with leather, linen or bouclé upholstery. Explore the demonstration chair in the bespoke studio below — each finish is a real option.',
    materials: ['oak', 'walnut', 'leather', 'boucle'],
    furniture: ['Lounge chair', 'Three-seat sofa', 'Matching ottoman', 'Custom dimensions on request'],
    cover: photos.sofa,
    gallery: [photos.sofaRoom, photos.livingRoom],
    isConcept: true,
  },
]

export const hospitalityScenes = [
  { title: 'Suites', caption: 'Calm, layered rooms designed for rest, light and quiet.', image: photos.hotelSuite },
  { title: 'Resorts', caption: 'Furniture that faces the horizon and holds the last light of the day.', image: photos.resortPool },
  { title: 'Lounges', caption: 'Deep seating and low tables composed for long conversations.', image: photos.livingGallery },
  { title: 'Destinations', caption: 'Architecture, landscape and interior read as one continuous view.', image: photos.villaModern },
  { title: 'Dining', caption: 'Restaurants and bars with warm light, rich timber and tailored seating.', image: photos.restaurant },
]

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
