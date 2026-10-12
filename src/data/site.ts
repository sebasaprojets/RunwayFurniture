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
  { label: 'Projects', href: '#projects', image: grotto },
  { label: 'Collections', href: '#materials', image: drawingLounge },
  { label: 'Hospitality', href: '#hospitality', image: resortPanorama },
  { label: 'Residential', href: '#projects', image: coastDeck },
  { label: 'About', href: '#founder', image: founderDeck },
  { label: 'Contact', href: '#contact', image: atelier },
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
    slug: 'grotto-suite',
    title: 'The Grotto Suite',
    category: 'Luxury Hospitality',
    summary: 'A bathing suite carved into the cliff, suspended over open water on structural glass.',
    concept:
      'Raw limestone is left untouched while every object placed within it is resolved to the millimetre — a dialogue between the geological and the crafted.',
    narrative:
      'Low stone benches, a monolithic marble tub surround and travertine side tables are scaled to the cave rather than to the room. Warm grazing light is concealed in the rock, so the furniture reads as if lit by the sea itself.',
    materials: ['marble', 'travertine', 'linen', 'bronze'],
    furniture: ['Monolith marble tub surround', 'Travertine pedestal tables', 'Teak and linen bath stool', 'Brushed bronze towel valet'],
    cover: grotto,
    gallery: [grotto, resortPanorama, coastPool],
    isConcept: true,
  },
  {
    slug: 'shoreline-residence',
    title: 'Shoreline Residence',
    category: 'Resorts & Destinations',
    summary: 'Infinity edges, dark timber decking and frameless glass opening onto a Caribbean bay.',
    concept:
      'The house steps down towards the water in thin horizontal planes; furniture is kept low so that nothing interrupts the horizon line.',
    narrative:
      'Weathered ipe decking, outdoor upholstery in performance linen and sculpted loungers that hold the light at the end of the day. Every piece is specified to live outside — salt, sun and humidity included.',
    materials: ['walnut', 'linen', 'glass', 'bronze'],
    furniture: ['Low teak loungers', 'Performance linen daybeds', 'Stone-top outdoor dining', 'Frameless glass balustrade detailing'],
    cover: coastDeck,
    gallery: [coastDeck, coastPool, resortSunset],
    isConcept: true,
  },
  {
    slug: 'maison-blanche',
    title: 'Maison Blanche',
    category: 'Private Residences',
    summary: 'A gallery-like living room where a single lounge chair carries the entire composition.',
    concept:
      'An architectural white box drawn first as lines, then furnished as an exhibition: few pieces, each one placed with intent.',
    narrative:
      'Lacquered low storage runs the full length of the wall, while sculpted drum tables and a cognac leather lounge chair add warmth and weight to the pale envelope.',
    materials: ['leather', 'oak', 'boucle', 'marble'],
    furniture: ['Cognac leather lounge chair', 'Lacquered floating credenza', 'Drum coffee tables', 'Bouclé ottoman'],
    cover: drawingLounge,
    gallery: [drawingLounge, atelier, coastDeck],
    isConcept: true,
  },
  {
    slug: 'atelier-rosso',
    title: 'Atelier Rosso',
    category: 'Commercial & Lifestyle Spaces',
    summary: 'A terracotta storefront for a design studio — the street becomes the window display.',
    concept:
      'A single bold volume in terracotta frames a dark timber shopfront; inside, shelving and work tables are treated as one continuous joinery piece.',
    narrative:
      'Blackened oak, raw plaster and a pendant suspended at exactly the height of the eye-line. The furniture plan is designed to be read from the pavement as much as from within.',
    materials: ['walnut', 'oak', 'bronze', 'travertine'],
    furniture: ['Continuous oak shelving wall', 'Blackened work tables', 'Single cone pendant', 'Leather studio seating'],
    cover: atelier,
    gallery: [atelier, drawingLounge, grotto],
    isConcept: true,
  },
  {
    slug: 'sunset-lounge',
    title: 'Sunset Pool Lounge',
    category: 'Luxury Hospitality',
    summary: 'An oceanfront lounge for golden hour — deep sofas, low tables and lanterns on stone.',
    concept:
      'Seating is arranged to face the sun, not each other. The pool, the terrace and the sea are read as one continuous surface.',
    narrative:
      'Deep modular sofas in sand-coloured performance fabric, black stone low tables and loungers that line the pool edge like a procession towards the horizon.',
    materials: ['linen', 'travertine', 'bronze', 'glass'],
    furniture: ['Deep modular lounge sofas', 'Black stone low tables', 'Poolside loungers & parasols', 'Bronze lanterns'],
    cover: resortSunset,
    gallery: [resortPanorama, resortSunset, coastPool],
    isConcept: true,
  },
  {
    slug: 'arc-lounge-chair',
    title: 'Arc Lounge Chair',
    category: 'Bespoke Furniture',
    summary: 'A sculptural lounge chair developed from first sketch to final upholstery.',
    concept:
      'One continuous curve, drawn by hand, defines the shell, the arm and the base. Proportion is tuned to each project rather than fixed.',
    narrative:
      'Configured in oak, walnut or bronze with leather, linen or bouclé upholstery. Explore it in the bespoke studio below — each finish is a real option of the demonstration piece.',
    materials: ['oak', 'walnut', 'leather', 'boucle'],
    furniture: ['Lounge chair', 'Matching ottoman', 'Custom dimensions on request'],
    cover: drawingLounge,
    gallery: [drawingLounge, atelier],
    isConcept: true,
  },
]

export const hospitalityScenes = [
  { title: 'Suites', caption: 'Natural stone, warm grazing light and water beneath your feet.', image: grotto },
  { title: 'Resorts', caption: 'Furniture that faces the horizon and holds the last light of the day.', image: resortPanorama },
  { title: 'Lounges', caption: 'Deep seating and low tables composed for long conversations.', image: resortSunset },
  { title: 'Destinations', caption: 'Architecture, landscape and interior read as one continuous view.', image: coastDeck },
  { title: 'Retail & Lifestyle', caption: 'Spaces designed to be read from the street as much as from within.', image: atelier },
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
