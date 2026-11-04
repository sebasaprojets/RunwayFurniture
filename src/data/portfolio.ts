import type { T } from '../i18n'
import { real } from './site'

/** Copy and imagery from the Runway Furniture International company portfolio 2026–2027. */

export const story: T[] = [
  {
    en: 'On behalf of the Runway Furniture team, we would like to thank you for the opportunity to introduce our company.',
    es: 'En nombre del equipo de Runway Furniture, queremos agradecerle la oportunidad de presentarle nuestra empresa.',
  },
  {
    en: 'For over 17 years, Runway Furniture has been a leading manufacturer and supplier of high-quality furniture, with offices across the globe, including our head office in Montréal, Canada.',
    es: 'Desde hace más de 17 años, Runway Furniture es un fabricante y proveedor líder de mobiliario de alta calidad, con oficinas en todo el mundo y sede central en Montreal, Canadá.',
  },
  {
    en: 'We build long-term relationships by providing exceptional and innovative products and services that exceed the expectations of our esteemed customers.',
    es: 'Construimos relaciones a largo plazo ofreciendo productos y servicios excepcionales e innovadores que superan las expectativas de nuestros clientes.',
  },
  {
    en: 'We manufacture and supply to retail stores and the hospitality industry worldwide, with a strong focus on Contract Furnishing.',
    es: 'Fabricamos y suministramos para tiendas y para la industria hotelera de todo el mundo, con un fuerte enfoque en el Contract Furnishing.',
  },
  {
    en: 'We have collaborated with leading international architectural and design firms to provide furniture for commercial, hospitality and residential projects of various sizes.',
    es: 'Hemos colaborado con destacados estudios internacionales de arquitectura y diseño para amueblar proyectos comerciales, hoteleros y residenciales de todas las escalas.',
  },
]

export const storyImages = { cover: real('pf-cover'), lobby: real('pf-story-lobby'), chair: real('pf-story-chair') }

/** What Runway does — the four pillars of the "Architecture & Design Vision" page. */
export const services: { title: T; icon: 'bed' | 'sofa' | 'chair' | 'layers' }[] = [
  { title: { en: 'Hospitality solutions', es: 'Soluciones hoteleras' }, icon: 'bed' },
  { title: { en: 'Custom furniture', es: 'Mobiliario a medida' }, icon: 'sofa' },
  { title: { en: 'Interior design', es: 'Diseño de interiores' }, icon: 'chair' },
  { title: { en: 'FF&E procurement', es: 'Compras de FF&E' }, icon: 'layers' },
]

/** Architecture & design vision — one card per portfolio panel. */
export const vision: { title: T; text: T; image: string }[] = [
  {
    title: { en: 'Architecture & Design Vision', es: 'Visión de arquitectura y diseño' },
    text: { en: 'Where architectural imagination meets furniture craftsmanship.', es: 'Donde la imaginación arquitectónica se encuentra con el oficio del mueble.' },
    image: real('pf-arch-house'),
  },
  {
    title: { en: 'Contemporary Architecture', es: 'Arquitectura contemporánea' },
    text: { en: 'Bold forms. Functional design. Timeless spaces.', es: 'Formas audaces. Diseño funcional. Espacios atemporales.' },
    image: real('pf-arch-red'),
  },
  {
    title: { en: 'Architectural Innovation', es: 'Innovación arquitectónica' },
    text: { en: 'Design concepts that inspire unique hospitality and lifestyle destinations.', es: 'Conceptos de diseño que inspiran destinos hoteleros y de estilo de vida únicos.' },
    image: real('pf-arch-gallery'),
  },
  {
    title: { en: 'Interior Design & Furniture', es: 'Interiorismo y mobiliario' },
    text: { en: 'Bespoke furniture and interior solutions that bring spaces to life.', es: 'Mobiliario a medida y soluciones de interiorismo que dan vida a los espacios.' },
    image: real('pf-arch-interior'),
  },
  {
    title: { en: 'Design Without Boundaries', es: 'Diseño sin fronteras' },
    text: {
      en: 'From private residences to resort destinations, we create spaces in harmony with their environment.',
      es: 'De residencias privadas a destinos turísticos, creamos espacios en armonía con su entorno.',
    },
    image: real('pf-arch-lake'),
  },
]

/** Luxury hospitality & hotel projects — the five kinds of venue Runway furnishes. */
export const venues: { title: T; icon: 'bed' | 'dining' | 'lotus' | 'armchair' | 'building' }[] = [
  { title: { en: 'Hotels & Resorts', es: 'Hoteles y resorts' }, icon: 'bed' },
  { title: { en: 'Restaurants & Lounges', es: 'Restaurantes y lounges' }, icon: 'dining' },
  { title: { en: 'Spas & Wellness', es: 'Spas y bienestar' }, icon: 'lotus' },
  { title: { en: 'Villas & Residences', es: 'Villas y residencias' }, icon: 'armchair' },
  { title: { en: 'Full FF&E Solutions', es: 'Soluciones FF&E completas' }, icon: 'building' },
]

export const hospitalityImages = [real('pf-hosp-villa'), real('pf-hosp-lounge'), real('pf-hosp-glass'), real('pf-hosp-orange')]

/** From concept to reality: each image pairs the sketch with the finished space. */
export const conceptReality: { title: T; kind: T; text: T; image: string }[] = [
  {
    title: { en: 'Luxury Resort Lobby', es: 'Lobby de resort de lujo' },
    kind: { en: 'Hotel projects', es: 'Proyectos hoteleros' },
    text: { en: 'Design, manufacture and installation of custom FF&E.', es: 'Diseño, fabricación e instalación de FF&E a medida.' },
    image: real('pf-cr-lobby'),
  },
  {
    title: { en: 'Guest Rooms & Suites', es: 'Habitaciones y suites' },
    kind: { en: 'Hotel projects', es: 'Proyectos hoteleros' },
    text: { en: 'Tailored furniture solutions for comfort, style and durability.', es: 'Mobiliario a la medida para el confort, el estilo y la durabilidad.' },
    image: real('pf-cr-room'),
  },
  {
    title: { en: 'Pool & Outdoor Living', es: 'Piscina y vida exterior' },
    kind: { en: 'Hotel projects', es: 'Proyectos hoteleros' },
    text: { en: 'Bespoke outdoor furniture for unique hospitality experiences.', es: 'Mobiliario exterior a medida para experiencias hoteleras únicas.' },
    image: real('pf-cr-pool'),
  },
  {
    title: { en: 'The Bridge House Hotel', es: 'The Bridge House Hotel' },
    kind: { en: 'Interior furniture · United Kingdom', es: 'Mobiliario interior · Reino Unido' },
    text: { en: 'Leather lounge seating and an aviator trunk table, from sketch to the hotel lounge.', es: 'Sofás de cuero y una mesa baúl de aviador, del boceto al salón del hotel.' },
    image: real('pf-sr-bridge'),
  },
  {
    title: { en: 'Costa Esmeralda by Lifestyle', es: 'Costa Esmeralda by Lifestyle' },
    kind: { en: 'Resort & outdoor living · Dominican Republic', es: 'Resort y vida exterior · República Dominicana' },
    text: { en: 'Canopy daybeds and teak loungers facing the Caribbean.', es: 'Camas de día con toldo y camastros de teca frente al Caribe.' },
    image: real('pf-sr-esmeralda'),
  },
  {
    title: { en: "Morgan's Hotel Ltd.", es: "Morgan's Hotel Ltd." },
    kind: { en: 'Hospitality interiors · United Kingdom', es: 'Interiores hoteleros · Reino Unido' },
    text: { en: 'Suites with sculpted joinery and warm light.', es: 'Suites con carpintería esculpida y luz cálida.' },
    image: real('pf-sr-morgans'),
  },
  {
    title: { en: 'Hospitality Interior', es: 'Interior hotelero' },
    kind: { en: 'Original Runway photography', es: 'Fotografía original de Runway' },
    text: { en: 'An upholstered headboard wall and bench, drawn and then delivered.', es: 'Un cabecero tapizado de pared y su banco, dibujados y luego entregados.' },
    image: real('pf-sr-interior'),
  },
]

export const awards: { name: T; image: string }[] = [
  { name: { en: 'Furniture Design Award — Singapore', es: 'Furniture Design Award — Singapur' }, image: real('award-fda-singapore') },
  { name: { en: "Furniture Today · Canada's 50 Best — Designer of the Year 2013", es: 'Furniture Today · Los 50 mejores de Canadá — Diseñador del año 2013' }, image: real('award-furniture-today') },
  { name: { en: "A' Design Award Winner 2011 — Good Design", es: "A' Design Award, ganador 2011 — Good Design" }, image: real('award-adesign-2011') },
  { name: { en: 'Furniture Design Award', es: 'Furniture Design Award' }, image: real('award-furniture-design') },
  { name: { en: 'Canadian Excellence Award 2008', es: 'Canadian Excellence Award 2008' }, image: real('award-canadian-excellence') },
]

export const factory = {
  steps: [
    { en: 'Design', es: 'Diseño' },
    { en: 'Engineering', es: 'Ingeniería' },
    { en: 'Prototype', es: 'Prototipo' },
    { en: 'Manufacturing', es: 'Fabricación' },
    { en: 'Quality control', es: 'Control de calidad' },
  ] satisfies T[],
  images: [
    { src: real('pf-fac-upholster'), alt: { en: 'Measuring a curved sofa during upholstery', es: 'Midiendo un sofá curvo durante el tapizado' } },
    { src: real('pf-fac-table'), alt: { en: 'Finishing a sculpted timber dining table', es: 'Acabado de una mesa de comedor de madera esculpida' } },
    { src: real('pf-fac-frame'), alt: { en: 'Building a solid-wood sofa frame', es: 'Construcción de la estructura de madera maciza de un sofá' } },
    { src: real('pf-fac-final'), alt: { en: 'The finished curved sofa, from drawing to reality', es: 'El sofá curvo terminado, del plano a la realidad' } },
  ] satisfies { src: string; alt: T }[],
}

/** The global presence page: what Runway delivers worldwide. */
export const presence: T[] = [
  { en: 'Hospitality projects', es: 'Proyectos hoteleros' },
  { en: 'Residential developments', es: 'Desarrollos residenciales' },
  { en: 'Commercial spaces', es: 'Espacios comerciales' },
  { en: 'Global delivery', es: 'Entregas en todo el mundo' },
]
