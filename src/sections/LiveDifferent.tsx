import { animate, motion, useInView, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, CookingPot, FileText, HeartHandshake, Sofa, Wheat } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FadeIn } from '../components/FadeIn'
import { MaskImage } from '../components/MaskImage'
import { Pic } from '../components/Pic'
import { RevealText } from '../components/RevealText'
import { openWhatsApp, real } from '../data/site'
import { useLang } from '../i18n'
import { easeCine, easeLuxe, MOTION_QUERY, useCalmScroll } from '../lib/motion'
import { gsap } from '../lib/scroll'

/**
 * Runway's social cause, with the charity Live Different and Vista Verde Village: homes rebuilt for
 * families with very few resources in the Dominican Republic, furnished and stocked by Runway.
 * Stories, photos and quotes come from the two Live Different case files supplied by the company,
 * which are linked here in full.
 */
const PDF = {
  josefina: './live-different/josefina-and-angel-2016.pdf',
  olgaria: './live-different/olgaria-hernandez-2016.pdf',
}
const img = {
  couple: real('ld-josefina-angel'),
  door: real('ld-josefina-door'),
  before: real('ld-josefina-before'),
  after: real('ld-josefina-after'),
  home: real('ld-josefina-home'),
  olgaria: real('ld-olgaria-portrait'),
  grandson: real('ld-olgaria-grandson'),
  aerial: real('ld-community-aerial'),
}

/** A house drawn in one line as it scrolls into view; the heart inside fills in last. */
function HouseMark({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 35%'] })
  const draw = useTransform(scrollYProgress, [0, 0.8], [0, 1], { clamp: true })
  const fill = useTransform(scrollYProgress, [0.75, 1], [0, 1], { clamp: true })
  const pop = useTransform(scrollYProgress, [0.75, 0.9, 1], [0.4, 1.15, 1], { clamp: true })
  const stroke = { stroke: 'currentColor', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <div ref={ref} className={className}>
    <svg viewBox="0 0 120 110" className="h-auto w-full" aria-hidden>
      <motion.path d="M8 52 L60 8 L112 52" style={{ pathLength: draw }} {...stroke} />
      <motion.path d="M20 44 V102 H100 V44" style={{ pathLength: draw }} {...stroke} />
      <motion.path d="M10 102 H110" style={{ pathLength: draw }} {...stroke} />
      <motion.path
        d="M60 88 C40 74 36 62 44 56 C50 51 57 54 60 60 C63 54 70 51 76 56 C84 62 80 74 60 88 Z"
        style={{ pathLength: draw, fillOpacity: fill, scale: pop, transformOrigin: '60px 70px' }}
        stroke="#b9543d"
        strokeWidth={1.5}
        fill="#b9543d"
      />
    </svg>
    </div>
  )
}

/** A number that counts up the first time it is seen. */
function Count({ to, className = '' }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    const c = animate(0, to, { duration: 2, ease: easeCine, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [seen, to])
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {n}
    </span>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="mt-10 flex items-end gap-4 border-t border-ink/10 pt-6">
      <Count to={value} className="font-display text-7xl leading-[0.8] text-terracotta md:text-8xl" />
      <p className="max-w-[14rem] pb-1 text-xs leading-relaxed tracking-[0.14em] text-ink/60 uppercase">{label}</p>
    </div>
  )
}

function PdfLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-8 inline-flex items-center gap-3 rounded-full border border-ink/20 py-3 pr-5 pl-4 text-xs font-semibold tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:border-terracotta hover:bg-terracotta hover:text-bone"
    >
      <FileText className="size-4" strokeWidth={1.5} />
      {label}
      <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
    </a>
  )
}

/** Before → after: as the frame scrolls through the screen the new home slides in from the right over the old one. */
function BeforeAfter() {
  const { t } = useLang()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 25%'] })
  const s = useTransform(scrollYProgress, [0.2, 0.75], [0.0001, 1], { clamp: true })
  const inv = useTransform(s, (v) => 1 / v)
  // the new home slides in from the right, so the old house stays on the "Before" side
  const line = useTransform(s, (v) => `${(1 - v) * 100}%`)
  return (
    <div ref={ref} className="relative aspect-[16/9] overflow-hidden bg-smoke sm:aspect-[21/9]">
      <Pic src={img.before} sizes="(min-width: 1024px) 66vw, 100vw">
        <img src={img.before} alt={t('Before: the old house, dark and damaged', 'Antes: la casa vieja, oscura y deteriorada')} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </Pic>
      <motion.div style={{ scaleX: s }} className="absolute inset-0 origin-right overflow-hidden will-change-transform">
        <Pic src={img.after} sizes="(min-width: 1024px) 66vw, 100vw">
          <motion.img
            style={{ scaleX: inv }}
            src={img.after}
            alt={t('After: Josefina and Angel in their new, furnished living room', 'Después: Josefina y Ángel en su nueva sala amueblada')}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full origin-right object-cover"
          />
        </Pic>
      </motion.div>
      <motion.span style={{ left: line }} className="pointer-events-none absolute inset-y-0 w-px bg-bone/80 shadow-[0_0_20px_rgba(255,255,255,.6)]" aria-hidden />
      <span className="eyebrow absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1.5 text-[0.6875rem] text-bone backdrop-blur-sm">{t('Before', 'Antes')}</span>
      <span className="eyebrow absolute right-4 bottom-4 rounded-full bg-terracotta px-3 py-1.5 text-[0.6875rem] text-bone">{t('After', 'Después')}</span>
    </div>
  )
}

/**
 * Opening scene, in the language of the site's other film moments: pinned to the screen and driven
 * only by the scroll (nothing runs while you are elsewhere). A small window onto the old house opens
 * to the full frame in cold, dim light; the camera pushes in, the letterbox lifts, and the shot
 * dissolves into the warm, furnished new home.
 */
function CauseScene() {
  const { t } = useLang()
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_QUERY, () => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', scrub: 0.6, pin: true },
      })
      tl.fromTo(q('[data-frame]'), { clipPath: 'inset(30% 36% 30% 36%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo(q('[data-a]'), { scale: 1.5 }, { scale: 1.08, ease: 'none', duration: 1.6 }, 0)
        .fromTo(q('[data-pre]'), { opacity: 1, y: 0 }, { opacity: 0, y: -50, duration: 0.45 }, 0.05)
        .fromTo(q('[data-line1] > *'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.4 }, 0.55)
        .to(q('[data-line1] > *'), { opacity: 0, y: -40, stagger: 0.06, duration: 0.3 }, 1.2)
        .fromTo(q('[data-b]'), { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1.04, ease: 'power1.out', duration: 0.9 }, 1.3)
        .fromTo(q('[data-cold]'), { opacity: 1 }, { opacity: 0, duration: 0.6 }, 1.3)
        .fromTo(q('[data-bar]'), { scaleY: 1 }, { scaleY: 0, ease: 'power2.inOut', duration: 0.7 }, 1.4)
        .fromTo(q('[data-glow]'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.6)
        .fromTo(q('[data-line2] > *'), { opacity: 0, y: 60 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.45 }, 1.8)
        // hold the finished shot before the page moves on
        .to({}, { duration: 1.1 })
    })
    return () => mm.revert()
  }, [])

  return (
    <div ref={root} className="relative h-[100svh] overflow-hidden bg-ink text-bone" role="img" aria-label={t('From a house that let the rain in to a furnished new home', 'De una casa donde entraba la lluvia a un nuevo hogar amueblado')}>
      <p data-pre className="display absolute inset-x-0 top-[12%] z-10 px-5 text-center text-[9vw] text-bone/90 uppercase md:text-[5vw]">
        {t('Some homes', 'Algunos hogares')} <span className="italic text-terracotta">{t('wait years', 'esperan años')}</span>
      </p>
      <div data-frame className="absolute inset-0 overflow-hidden">
        <Pic src={img.door}>
          <img data-a src={img.door} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[72%_45%] will-change-transform" />
        </Pic>
        {/* cold, rainy-day light over the old house */}
        <div data-cold className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,32,.5),rgba(8,14,20,.7))]" />
        <Pic src={img.home}>
          <img data-b src={img.home} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-0 will-change-transform" />
        </Pic>
        {/* the warm light of the new home */}
        <div data-glow className="absolute inset-0 bg-[radial-gradient(80%_60%_at_60%_40%,rgba(255,190,120,.18),transparent_70%)] opacity-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/40" />
      </div>
      <div data-bar className="absolute inset-x-0 top-0 h-[11vh] origin-top bg-ink" />
      <div data-bar className="absolute inset-x-0 bottom-0 h-[11vh] origin-bottom bg-ink" />
      <div data-line1 className="absolute inset-x-0 bottom-[16%] z-10 px-5 text-center md:px-10">
        <p className="eyebrow text-terracotta">{t('Scene 08 — The Cause', 'Escena 08 — La causa')}</p>
        <p className="display mt-6 text-[10vw] uppercase md:text-[5.6vw]">
          {t('for a roof', 'por un techo')} <span className="italic text-bone/70">{t('against the rain.', 'contra la lluvia.')}</span>
        </p>
      </div>
      <div data-line2 className="absolute inset-x-0 bottom-[14%] z-10 px-5 text-center md:px-10">
        <p className="eyebrow text-gold">Live Different · Runway Furniture</p>
        <p className="display mt-6 text-[11vw] uppercase md:text-[6.5vw]">
          {t('Then, ', 'Entonces, ')}
          <span className="italic text-gold">{t('a home.', 'un hogar.')}</span>
        </p>
        <p className="mx-auto mt-6 max-w-lg text-bone/80">
          {t('We help rebuild it — and fill it with furniture, household essentials and even food.', 'Ayudamos a reconstruirlo — y lo llenamos de muebles, utensilios y hasta comida.')}
        </p>
      </div>
    </div>
  )
}

export function LiveDifferent() {
  const { t } = useLang()
  const calm = useCalmScroll()
  const band = useRef<HTMLDivElement>(null)
  const { scrollYProgress: bandP } = useScroll({ target: band, offset: ['start end', 'end start'] })
  const bandScale = useTransform(bandP, [0, 0.6], [1.38, 1.18])
  const bandY = useTransform(bandP, [0, 1], ['-8%', '8%'])
  const pillars = [
    { icon: Sofa, title: t('Furniture', 'Muebles'), text: t('Beds, tables, chairs and living rooms for every new home.', 'Camas, mesas, sillas y salas para cada nuevo hogar.') },
    { icon: CookingPot, title: t('Household essentials', 'Utensilios'), text: t('Kitchenware and everything a family needs to start again.', 'Utensilios de cocina y todo lo que una familia necesita para empezar de nuevo.') },
    { icon: Wheat, title: t('Even food', 'Hasta comida'), text: t('Groceries so the first days in the new home are easy ones.', 'Alimentos para que los primeros días en el nuevo hogar sean tranquilos.') },
  ]

  return (
    <section id="live-different" className="relative overflow-hidden bg-bone text-ink" aria-labelledby="ld-title">
      <CauseScene />
      <div className="mx-auto max-w-[1600px] px-5 pt-28 pb-20 md:px-10 md:pt-40 md:pb-28">
        {/* intro */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-terracotta">
              <HeartHandshake className="size-4" strokeWidth={1.5} />
              {t('Giving back · Live Different', 'Causa social · Live Different')}
            </p>
            <RevealText
              id="ld-title"
              text={t('More than\nfurniture.\nA home.', 'Más que\nmuebles.\nUn hogar.')}
              accent={['home.', 'hogar.']}
              accentClass="italic text-terracotta"
              className="display mt-6 text-[15vw] uppercase sm:text-[10vw] lg:text-[6.4vw]"
            />
          </div>
          <FadeIn className="lg:col-span-5">
            <HouseMark className="mb-8 w-24 text-ink md:w-28" />
            <p className="text-[1.08rem] leading-relaxed text-ink/80">
              {t(
                'Together with Live Different, a charity that helps families with very few resources, and Vista Verde Village, Runway helps give families in the Dominican Republic a new home — and fills it with furniture, household essentials and even food, so they can start again with dignity.',
                'Junto a Live Different, una organización de ayuda a familias de pocos recursos, y Vista Verde Village, Runway ayuda a darles un nuevo hogar a familias en República Dominicana — y lo llena de muebles, utensilios y hasta comida, para que puedan empezar de nuevo con dignidad.',
              )}
            </p>
          </FadeIn>
        </div>

        {/* what each home receives */}
        <div className="mt-16 grid gap-px overflow-hidden border-b border-ink/10 sm:grid-cols-3 md:mt-24">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1, ease: easeLuxe, delay: i * 0.12 }}
              className="pb-8 sm:px-6 sm:first:pl-0"
            >
              <motion.span
                className="block h-px origin-left bg-terracotta"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: easeCine, delay: 0.2 + i * 0.15 }}
              />
              <motion.span
                className="mt-7 inline-grid size-12 place-items-center rounded-full bg-terracotta/10"
                initial={{ scale: 0, rotate: -90 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.35 + i * 0.15 }}
              >
                <p.icon className="size-5 text-terracotta" strokeWidth={1.4} />
              </motion.span>
              <p className="mt-5 font-display text-2xl">{p.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{p.text}</p>
            </motion.div>
          ))}
        </div>

        {/* story 1 — Josefina & Angel */}
        <div className="mt-24 grid gap-12 md:mt-36 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <MaskImage src={img.couple} alt={t('Josefina and Angel in front of their old home', 'Josefina y Ángel frente a su antigua casa')} className="aspect-[4/3]" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:self-center">
            <p className="eyebrow text-bronze">{t('Dominican Republic · July 2016', 'República Dominicana · Julio 2016')}</p>
            <h3 className="mt-4 font-display text-5xl leading-none md:text-6xl">Josefina &amp; Ángel</h3>
            <FadeIn>
              <div className="mt-8 space-y-4 leading-relaxed text-ink/70">
                <p>
                  {t(
                    'Fina, 65, and her husband Gerald, 66, lived for 27 years in a house whose roof leaked every time it rained — their belongings covered in plastic, the river coming in when it rose. Gerald’s old motorbike taxi was their only income.',
                    'Fina, de 65 años, y su esposo Gerald, de 66, vivieron 27 años en una casa cuyo techo goteaba cada vez que llovía — sus cosas cubiertas con plástico y el río entrando cuando crecía. El viejo motoconcho de Gerald era su único ingreso.',
                  )}
                </p>
                <p>
                  {t(
                    'Live Different, Runway Furniture and Vista Verde partnered to build them a new home, free of the burdens they had carried for so long.',
                    'Live Different, Runway Furniture y Vista Verde se unieron para construirles un nuevo hogar, libre de las cargas que llevaron por tanto tiempo.',
                  )}
                </p>
              </div>
              <Stat value={27} label={t('years under a roof that leaked every time it rained', 'años bajo un techo que goteaba cada vez que llovía')} />
              <PdfLink href={PDF.josefina} label={t('Read their story (PDF)', 'Leer su historia (PDF)')} />
            </FadeIn>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <BeforeAfter />
        </div>

        {/* the quote */}
        <FadeIn className="mx-auto mt-20 max-w-5xl text-center md:mt-32">
          <p className="font-display text-7xl leading-none text-terracotta">“</p>
          <RevealText
            as="blockquote"
            text={t('Thank you. Now we don’t\nhave to fear the rain\nand the dark clouds.', 'Gracias. Ahora ya no\ntenemos que temerle a la\nlluvia ni a las nubes oscuras.')}
            accent={['rain', 'lluvia']}
            accentClass="italic text-terracotta"
            stagger={0.05}
            className="font-display text-[8.5vw] leading-[1.05] uppercase sm:text-[6vw] lg:text-[4.4vw]"
          />
          <p className="eyebrow mt-6 text-bronze">— Josefina</p>
        </FadeIn>

        {/* story 2 — Olgaria */}
        <div className="mt-24 grid gap-12 md:mt-36 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:order-2 lg:col-span-6 lg:col-start-7">
            <MaskImage src={img.olgaria} alt={t('Olgaria Hernández, 87, at the window of her old house', 'Olgaria Hernández, de 87 años, en la ventana de su antigua casa')} className="aspect-[4/3]" from="left" sizes="(min-width: 1024px) 50vw, 100vw" />
            {/* the white frame is part of the image, so it opens with it instead of waiting empty */}
            <div className="relative z-10 -mt-[22%] ml-auto w-[46%]">
              <MaskImage src={img.grandson} alt={t('Olgaria with her grandson', 'Olgaria con su nieto')} className="aspect-[4/5]" frame="border-[6px] border-bone" delay={0.2} sizes="(min-width: 1024px) 24vw, 46vw" />
            </div>
          </div>
          <div className="lg:order-1 lg:col-span-5 lg:self-center">
            <p className="eyebrow text-bronze">{t('Dominican Republic · 2016', 'República Dominicana · 2016')}</p>
            <h3 className="mt-4 font-display text-5xl leading-none md:text-6xl">
              Olgaria <span className="italic text-terracotta">“Niña”</span> Hernández
            </h3>
            <FadeIn>
              <div className="mt-8 space-y-4 leading-relaxed text-ink/70">
                <p>
                  {t(
                    'At 87, Niña had lived since 1974 in a house right on the ocean, where every storm brought water inside and she worried about her safety when she was home alone.',
                    'A sus 87 años, Niña vivía desde 1974 en una casa frente al mar, donde cada tormenta metía agua y le preocupaba su seguridad cuando estaba sola.',
                  )}
                </p>
                <p>
                  {t(
                    'She could never have built a new home on her own. Her new one has a sales window at the front, where she sells the beans and sweets she makes for the community.',
                    'Nunca habría podido construir un nuevo hogar por su cuenta. El nuevo tiene una ventana de venta al frente, donde vende las habichuelas y los dulces que prepara para la comunidad.',
                  )}
                </p>
              </div>
              <Stat value={41} label={t('years in a house the sea flooded with every storm', 'años en una casa que el mar inundaba con cada tormenta')} />
              <PdfLink href={PDF.olgaria} label={t('Read her story (PDF)', 'Leer su historia (PDF)')} />
            </FadeIn>
          </div>
        </div>
      </div>

      {/* closing band */}
      <div ref={band} className="relative isolate overflow-hidden bg-ink text-bone">
        <Pic src={img.aerial}>
          <motion.img
            src={img.aerial}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ scale: bandScale, y: calm ? undefined : bandY }}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45 will-change-transform"
          />
        </Pic>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
          <FadeIn className="max-w-2xl">
            <p className="eyebrow text-gold">{t('Live Different · Runway Furniture · Vista Verde Village', 'Live Different · Runway Furniture · Vista Verde Village')}</p>
            <p className="display mt-6 text-[10vw] leading-[0.95] uppercase sm:text-[6vw] lg:text-[4.2vw]">
              {t('Every home we furnish ', 'Cada hogar que amueblamos ')}
              <span className="italic text-gold">{t('carries this purpose.', 'lleva este propósito.')}</span>
            </p>
            <p className="mt-6 max-w-lg leading-relaxed text-bone/70">
              {t('Would you like to be part of it? Write to us and we will tell you how to help.', '¿Quieres ser parte? Escríbenos y te contamos cómo ayudar.')}
            </p>
            <button
              onClick={() => openWhatsApp(t('Hello Runway, I would like to help with the Live Different cause.', 'Hola Runway, me gustaría ayudar con la causa de Live Different.'))}
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3.5 text-xs font-semibold tracking-[0.2em] text-ink uppercase transition-colors duration-500 hover:bg-bone"
            >
              <HeartHandshake className="size-4" strokeWidth={1.5} />
              {t('I want to help', 'Quiero ayudar')}
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
