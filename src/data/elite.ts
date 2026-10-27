import type { T } from '../i18n'

/** Palm fronds radiating from a crown point; reused by several drawings. */
const fronds = (x: number, y: number) =>
  `M${x} ${y}c-8 -6 -16 -4 -22 2M${x} ${y}c-4 -10 -12 -14 -18 -14M${x} ${y}c6 -10 14 -12 20 -8M${x} ${y}c8 -4 16 0 20 8M${x} ${y}c0 -8 2 -14 6 -18`
const circle = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`

/**
 * Line drawings on a 240×160 canvas. `lines` are the gold strokes; `water` is
 * drawn fainter in mineral so sea and pools read as a second layer.
 */
export type Drawing = { lines: string[]; water?: string[] }

/** A property for sale. Photos are added as they arrive from the owner. */
export type Listing = { name: string; location: T; image: string; details?: T; price?: string }

export type EliteKind = { key: string; title: T; text: T; drawing: Drawing; listings: Listing[] }

export const eliteKinds: EliteKind[] = [
  {
    key: 'hotels',
    title: { en: 'Hotels', es: 'Hoteles' },
    text: {
      en: 'Boutique and resort hotels, operating or ready for repositioning.',
      es: 'Hoteles boutique y resorts, en operación o listos para reposicionar.',
    },
    drawing: {
      lines: [
        'M10 140H230',
        'M95 140V30H145V140M90 30H150M110 30V20H130V30',
        'M95 45H145M95 60H145M95 75H145M95 90H145M95 105H145M95 120H145',
        'M112 30V140M128 30V140',
        'M145 140V95H200V140M145 110H200M145 125H200M163 95V140M182 95V140',
        'M95 140V115H60V140M55 115H95',
        'M114 140V130H126V140',
        'M40 140C42 120 44 105 42 92',
        fronds(42, 92),
      ],
    },
    listings: [],
  },
  {
    key: 'land',
    title: { en: 'Land', es: 'Terrenos' },
    text: {
      en: 'Coastal and hillside plots selected for development potential.',
      es: 'Lotes costeros y de ladera seleccionados por su potencial de desarrollo.',
    },
    drawing: {
      lines: [
        'M10 100L45 70L70 90L100 60L135 95',
        'M10 120C50 100 80 104 120 112S190 100 230 108',
        'M10 140H230',
        'M60 140L80 118H160L180 140M120 118V140M70 129H170',
        'M190 140V100M190 100L208 106L190 112',
        circle(76, 46, 14),
        'M150 50q4 -4 8 0q4 -4 8 0M172 40q3 -3 6 0q3 -3 6 0',
      ],
    },
    listings: [],
  },
  {
    key: 'islands',
    title: { en: 'Private islands', es: 'Islas privadas' },
    text: {
      en: 'Islands and cays for a private estate or an exclusive resort.',
      es: 'Islas y cayos para una residencia privada o un resort exclusivo.',
    },
    drawing: {
      lines: [
        'M50 130C70 105 170 105 190 130',
        'M110 113V100H140V113M105 100H145M122 113V105H128V113',
        'M80 120C82 102 80 90 76 78',
        fronds(76, 78),
        'M162 120C160 104 162 92 168 82',
        fronds(168, 82),
        'M195 124H227L220 131H202ZM211 124V100L224 121H211',
        circle(204, 44, 11),
      ],
      water: ['M10 131H230', 'M28 140H118M138 140H212', 'M52 149H180'],
    },
    listings: [],
  },
  {
    key: 'condos',
    title: { en: 'Condominiums', es: 'Condominios' },
    text: {
      en: 'Residential towers and gated communities in prime locations.',
      es: 'Torres residenciales y comunidades privadas en ubicaciones prime.',
    },
    drawing: {
      lines: [
        'M10 140H230',
        'M30 140V60H90V140M30 75H90M30 90H90M30 105H90M30 120H90M50 60V140M70 60V140',
        'M100 140V35H150V140M100 50H150M100 65H150M100 80H150M100 95H150M100 110H150M100 125H150M125 35V140',
        'M160 140V80H210V140M160 95H210M160 110H210M160 125H210M185 80V140',
        'M222 140V126',
        circle(222, 119, 7),
        'M18 140V128',
        circle(18, 122, 6),
      ],
    },
    listings: [],
  },
  {
    key: 'villas',
    title: { en: 'Luxury villas', es: 'Villas de lujo' },
    text: {
      en: 'Architect-designed villas with views, privacy and land.',
      es: 'Villas de autor con vistas, privacidad y terreno.',
    },
    drawing: {
      lines: [
        'M10 92L50 57L80 80L115 47L160 85L190 66L230 92',
        'M80 78V55H170V78M100 55V78M125 55V78M150 55V78',
        'M60 78H190M60 86H190',
        'M70 86V112H160V86M95 86V112M120 86V112M145 86V112',
        'M30 112H210M40 120H200',
        'M50 120L60 133H190L200 120',
        'M205 112C207 96 206 86 202 76',
        fronds(202, 76),
        'M10 140H230',
      ],
      water: ['M75 126H105M120 126H162', 'M88 130H140'],
    },
    listings: [],
  },
]

/** A static SVG of one drawing, for places that need an image URL (the menu backdrop). */
export function drawingUrl(d: Drawing) {
  const g = (paths: string[], color: string, op: number) =>
    paths.map((p) => `<path d="${p}" stroke="${color}" stroke-opacity="${op}"/>`).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -20 360 200" fill="none" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round">${g(d.lines, '#b89a6a', 1)}${g(d.water ?? [], '#d2c4ae', 0.6)}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
