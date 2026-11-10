import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { BLOB, BUBBLES } from './RunwayLogo'

/** Logo centre in the drawing's units; the drawing maps 100 units to 1 metre. */
const CX = 406
const CY = 330
const U = 100
const DEPTH = 0.5

const toWorld = (x: number, y: number) => new THREE.Vector3((x - CX) / U, 0, (y - CY) / U)

/** Camera path: skims low past the bubbles, glides over RUNWAY, then rises to a hero view. */
const SHOTS = [
  { pos: [-3.3, 1.0, -4.3], look: [0.9, 0.35, -1.7] },
  { pos: [-2.7, 1.25, -1.3], look: [0.5, 0.42, -0.5] },
  { pos: [-2.4, 1.75, 3.4], look: [-0.15, 0.5, 1.3] },
  { pos: [0, 9.6, 7.4], look: [0, 0, 1.25] },
] as const
const FLIGHT = 3.9

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** Shapes of the mark, flipped so the drawing lies on the floor with its bubbles away from the viewer. */
function logoShapes() {
  const flip = (s: THREE.Shape) => {
    const pts = s.extractPoints(160)
    const out = new THREE.Shape(pts.shape.map((p) => new THREE.Vector2((p.x - CX) / U, -(p.y - CY) / U)))
    return out
  }
  const blob = SVGLoader.createShapes(new SVGLoader().parse(`<svg><path d="${BLOB}"/></svg>`).paths[0]).map(flip)
  const bubbles = BUBBLES.map((b) => {
    const s = new THREE.Shape()
    s.absarc((b.cx - CX) / U, -(b.cy - CY) / U, b.r / U, 0, Math.PI * 2, false)
    return new THREE.Shape(s.getSpacedPoints(160))
  })
  return [...blob, ...bubbles]
}

/** White lettering printed on the lacquered top, drawn in the drawing's own coordinates. */
function lettering() {
  const W = 4096
  const x0 = 110
  const y0 = 55
  const w = 592
  const h = 535
  const k = W / w
  const c = document.createElement('canvas')
  c.width = W
  c.height = Math.round(h * k)
  const g = c.getContext('2d')!
  g.scale(k, k)
  g.translate(-x0, -y0)
  g.fillStyle = '#fbf7f2'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = '400 64px "Josefin Sans", Manrope, sans-serif'
  ;(g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '6px'
  g.fillText('RUNWAY', 412, 452)
  g.font = '600 9.5px "Josefin Sans", Manrope, sans-serif'
  ;(g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '1.6px'
  g.fillText('FURNITURE', 431, 305)
  g.fillText('INTERNATIONAL', 431, 320)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 16
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  return { tex, size: [w / U, h / U] as const, centre: toWorld(x0 + w / 2, y0 + h / 2) }
}

/**
 * The Runway mark as a real object: a thick lacquered-red piece standing on a white studio floor,
 * filmed by a camera that skims past the bubbles and over the name before rising to show it whole,
 * with a shallow depth of field like the company's presentation film.
 */
export function IntroScene({
  onReady,
  onSettle,
  onFallback,
  still = false,
  paused = false,
}: {
  onReady?: () => void
  onSettle?: () => void
  /** called when the device has no real graphics acceleration; the opening then uses the flat logo */
  onFallback?: () => void
  still?: boolean
  /** stop drawing (the studio is lifting away); the last frame stays on screen */
  paused?: boolean
}) {
  const host = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    const el = host.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try {
      // refuse software rendering: it would take seconds per frame
      const force = new URLSearchParams(location.search).has('gl')
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: !force })
    } catch {
      onFallback?.()
      return
    }
    let disposed = false
    // Two paths. Desktops get the full film: retina sharpness, multisampling and real depth of field.
    // Phones and tablets ("lite") draw straight to the screen with the GPU's own antialiasing and no
    // depth-of-field pass, which is what produced grain and stutter on mobile GPUs.
    // If frames still run slow, the resolution steps down gently, never below a crisp floor.
    const device = Math.min(window.devicePixelRatio || 1, 2, 4200 / Math.max(window.innerWidth, 1))
    const nav = navigator as Navigator & { deviceMemory?: number }
    const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
    const lite = coarse || (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 4 || Math.min(window.innerWidth, window.innerHeight) < 600
    const TIERS = lite
      ? [{ dpr: Math.min(device, 2) }, { dpr: Math.min(device, 1.75) }, { dpr: Math.min(device, 1.5) }]
      : [{ dpr: device }, { dpr: Math.min(device, 1.5) }, { dpr: Math.min(device, 1.25) }]
    let tier = 0
    renderer.setPixelRatio(TIERS[tier].dpr)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // only the camera moves, so the soft shadows are computed once instead of every frame
    renderer.shadowMap.autoUpdate = false
    renderer.shadowMap.needsUpdate = true
    el.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%'

    const scene = new THREE.Scene()
    const white = new THREE.Color('#f3f1ee')
    scene.background = white
    scene.fog = new THREE.Fog(white, 20, 42)
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.35

    // studio floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: '#f6f4f1', roughness: 0.92 }))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // lights: a big soft key from above-left, a fill, and a rim to catch the lacquer
    scene.add(new THREE.HemisphereLight('#ffffff', '#d9d2c8', 1.25))
    const key = new THREE.DirectionalLight('#fff6ec', 2.4)
    key.position.set(-4, 9, 5)
    key.castShadow = true
    const big = !lite && Math.min(window.innerWidth, window.innerHeight) > 700
    key.shadow.mapSize.set(big ? 4096 : 2048, big ? 4096 : 2048)
    key.shadow.radius = 9
    key.shadow.blurSamples = 20
    key.shadow.bias = -0.0004
    const sc = key.shadow.camera
    sc.left = sc.bottom = -6
    sc.right = sc.top = 6
    sc.near = 1
    sc.far = 25
    scene.add(key)
    const rim = new THREE.DirectionalLight('#ffe0d0', 1.1)
    rim.position.set(5, 3, -6)
    scene.add(rim)
    // a tall softbox that glides past at the end, sending a streak of light across the lacquer
    RectAreaLightUniformsLib.init()
    const sweep = new THREE.RectAreaLight('#fff4ea', 0, 0.9, 7)
    sweep.position.set(-9, 6, -4.9)
    scene.add(sweep)

    // the mark
    const geo = new THREE.ExtrudeGeometry(logoShapes(), {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.022,
      bevelSegments: 4,
      curveSegments: 120,
    })
    const top = new THREE.MeshPhysicalMaterial({ color: '#5e050b', roughness: 0.42, clearcoat: 0.85, clearcoatRoughness: 0.18, sheen: 0.35, sheenColor: new THREE.Color('#c0202a') })
    const side = new THREE.MeshPhysicalMaterial({ color: '#120304', roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.35 })
    const mark = new THREE.Mesh(geo, [top, side])
    mark.rotation.x = -Math.PI / 2
    mark.castShadow = true
    mark.receiveShadow = true
    scene.add(mark)

    // lettering, laid just above the top face
    const L = lettering()
    const print = new THREE.Mesh(
      new THREE.PlaneGeometry(L.size[0], L.size[1]),
      new THREE.MeshStandardMaterial({ map: L.tex, transparent: true, roughness: 0.45, polygonOffset: true, polygonOffsetFactor: -2 }),
    )
    print.rotation.x = -Math.PI / 2
    print.position.set(L.centre.x, DEPTH + 0.026, L.centre.z)
    scene.add(print)

    const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 60)
    // multisampled, high-precision buffer: clean edges and smooth gradients on the lacquer
    const target = new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType })
    const composer = new EffectComposer(renderer, target)
    composer.addPass(new RenderPass(scene, camera))
    const bokeh = new BokehPass(scene, camera, { focus: 3, aperture: 0.01, maxblur: 0.014 })
    composer.addPass(bokeh)
    composer.addPass(new OutputPass())
    const bokehUniforms = bokeh.uniforms as unknown as Record<'focus' | 'aperture' | 'maxblur', { value: number }>

    const posCurve = new THREE.CatmullRomCurve3(SHOTS.map((s) => new THREE.Vector3(...s.pos)), false, 'centripetal')
    const lookCurve = new THREE.CatmullRomCurve3(SHOTS.map((s) => new THREE.Vector3(...s.look)), false, 'centripetal')
    const heroLook = new THREE.Vector3(...SHOTS[3].look)
    const heroDir = new THREE.Vector3(...SHOTS[3].pos).sub(heroLook).normalize()

    let heroDist = 13
    const resize = () => {
      const w = el.clientWidth || window.innerWidth
      const h = el.clientHeight || window.innerHeight
      renderer.setSize(w, h, false)
      if (!lite) composer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // keep the whole mark in frame on narrow screens
      const halfW = camera.aspect < 1 ? 3.7 : 3.25
      const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      heroDist = Math.max(14, halfW / (tanH * camera.aspect))
      // the studio fades into white only beyond the hero shot, so the mark stays crisp
      const fog = scene.fog as THREE.Fog
      fog.near = heroDist + 7
      fog.far = heroDist + 30
    }
    resize()
    window.addEventListener('resize', resize)
    const applyTier = () => {
      renderer.setPixelRatio(TIERS[tier].dpr)
      if (!lite) composer.setPixelRatio(TIERS[tier].dpr)
      resize()
    }
    applyTier()
    // compile every shader up front so the first seconds of the flight never stutter
    renderer.compile(scene, camera)

    const pos = new THREE.Vector3()
    const look = new THREE.Vector3()
    const heroPos = new THREE.Vector3()
    const times: number[] = []
    let last = 0
    let frames = 0
    let blurOn = !lite
    let start = -1
    let raf = 0
    let readySent = false
    let settleSent = false
    const frame = (now: number) => {
      // the first frame only warms the GPU up; the film's clock starts on the next one
      frames++
      if (frames === 2) start = now
      if (frames > 3 && !still) {
        times.push(now - last)
        if (times.length >= 14) {
          const sorted = [...times].sort((a, b) => a - b)
          // median frame over ~24ms (below ~40fps): drop one quality step
          if (sorted[7] > 24) {
            if (!lite && blurOn) blurOn = false
            else if (tier < TIERS.length - 1) {
              tier++
              applyTier()
            }
          }
          times.length = 0
        }
      }
      last = now
      const probe = (window as { __introT?: number }).__introT
      const t = still ? FLIGHT + 2 : typeof probe === 'number' ? probe : start < 0 ? 0 : Math.max(0, (now - start) / 1000)
      const u = easeInOut(Math.min(t / FLIGHT, 1))
      posCurve.getPoint(u, pos)
      lookCurve.getPoint(u, look)
      // blend the last stretch into a hero position that fits the screen, then drift slowly
      heroPos.copy(heroLook).addScaledVector(heroDir, heroDist)
      const k = THREE.MathUtils.smoothstep(u, 0.72, 1)
      pos.lerp(heroPos, k)
      const drift = Math.max(0, t - FLIGHT)
      pos.x += Math.sin(drift * 0.35) * 0.35 * k
      camera.position.copy(pos)
      camera.lookAt(look)
      // in the final shot the mark is lifted into the upper part of the frame, clear of the titles below
      const w = el.clientWidth || window.innerWidth
      const h = el.clientHeight || window.innerHeight
      camera.setViewOffset(w, h, 0, h * (w > h ? 0.025 : 0.045) * k, w, h)
      const dist = pos.distanceTo(look)
      bokehUniforms.focus.value = dist
      // shallow focus while close, opening up to a crisp product shot at the end
      bokehUniforms.aperture.value = THREE.MathUtils.lerp(0.014, 0.0006, k)
      // the depth-of-field pass is the heaviest step: skipped once the shot is sharp, or on light tiers
      bokeh.enabled = blurOn && k < 0.97
      const sw = THREE.MathUtils.smoothstep(t, FLIGHT - 0.1, FLIGHT + 2.3)
      sweep.position.x = THREE.MathUtils.lerp(-9, 9, sw)
      sweep.intensity = 14 * Math.sin(Math.PI * sw)
      sweep.lookAt(0, 0.5, 0.6)
      if (lite) renderer.render(scene, camera)
      else composer.render()
      // titles come in as the camera eases into the final shot, already clear of the mark
      if (!settleSent && t >= FLIGHT - 0.55) {
        settleSent = true
        onSettle?.()
      }
      if (!readySent) {
        readySent = true
        onReady?.()
      }
      if (!still && !pausedRef.current) raf = requestAnimationFrame(frame)
    }
    // the lettering is drawn once, with the brand font already loaded, so nothing is re-uploaded mid-flight
    const fontReady = Promise.race([
      document.fonts?.load('400 64px "Josefin Sans"') ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500)),
    ])
    fontReady.then(() => {
      if (disposed) return
      const fresh = lettering()
      const mat = print.material as THREE.MeshStandardMaterial
      mat.map?.dispose()
      mat.map = fresh.tex
      mat.needsUpdate = true
      renderer.initTexture(fresh.tex)
      renderer.compile(scene, camera)
      raf = requestAnimationFrame(frame)
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      geo.dispose()
      top.dispose()
      side.dispose()
      L.tex.dispose()
      ;(print.material as THREE.MeshStandardMaterial).map?.dispose()
      print.geometry.dispose()
      floor.geometry.dispose()
      pmrem.dispose()
      composer.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still])

  return <div ref={host} className="absolute inset-0" aria-hidden />
}

export default IntroScene
