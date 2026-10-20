import { useEffect, useRef, useState } from 'react'

/**
 * The hero "film": a real-time WebGL scene of sunlit open water seen through a structural
 * glass floor — the brand's signature image — rendered procedurally so it is resolution
 * independent and weighs a few kilobytes instead of a multi-megabyte video.
 * Pauses when off-screen, renders a single still frame for reduced-motion users.
 */
const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`

const FRAG = `
precision highp float;
uniform vec2 r;
uniform float t;
uniform vec2 m;
#define TAU 6.28318530718

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}

float caustic(vec2 uv,float time){
  vec2 p=mod(uv*TAU,TAU)-250.;
  vec2 i=p;float c=1.;float inten=.005;
  for(int n=0;n<5;n++){
    float tt=time*(1.-(3.5/float(n+1)));
    i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));
    c+=1./length(vec2(p.x/(sin(i.x+tt)/inten),p.y/(cos(i.y+tt)/inten)));
  }
  c/=5.;c=1.17-pow(c,1.4);
  return pow(abs(c),8.);
}

void main(){
  vec2 uv=gl_FragCoord.xy/r;
  vec2 q=(gl_FragCoord.xy-.5*r)/r.y;
  // slow cinematic dolly + pointer parallax
  float time=t*.06;
  vec2 cam=q*1.15+vec2(time*.35,-time*.22)+m*.04;
  // depth: shallower (lighter) towards the cliff at the bottom-left, deep offshore top-right
  float depth=clamp(.55+.55*(q.x*.6+q.y*.9)+(fbm(cam*1.4)-.5)*.5,0.,1.);
  vec3 shallow=vec3(.09,.60,.64);
  vec3 mid=vec3(.03,.33,.42);
  vec3 deep=vec3(.012,.10,.15);
  vec3 col=mix(shallow,mid,smoothstep(0.,.55,depth));
  col=mix(col,deep,smoothstep(.45,1.,depth));
  // refracted caustics, fading with depth
  vec2 w=vec2(fbm(cam*2.+time),fbm(cam*2.-time+4.))*.35;
  float c=caustic(cam*.9+w,t*.32);
  float c2=caustic(cam*1.7-w+.3,t*.27+3.);
  col+=vec3(.6,.92,.88)*(c*.8+c2*.4)*(1.-depth*.7)*1.1;
  // surface swell highlights
  float swell=fbm(vec2(cam.x*3.,cam.y*6.)+vec2(0.,time*3.));
  col+=vec3(.07,.12,.12)*smoothstep(.55,.85,swell);
  // low sunset light raking in from the right — warm gold glints on the crests
  vec2 sunDir=normalize(vec2(1.,.55));
  float sunAmt=smoothstep(-.3,1.1,dot(q,sunDir));
  float glint=pow(smoothstep(.62,.95,fbm(cam*9.+vec2(t*.15,0.))),3.)*sunAmt;
  col+=vec3(1.,.74,.45)*glint*.9;
  col=mix(col,col*vec3(1.18,1.,.86),sunAmt*.35);
  // foam where water meets the rock at the lower-left edge
  float shore=smoothstep(.95,.35,length(uv-vec2(-.05,-.1)));
  float foam=smoothstep(.55,.8,fbm(cam*5.+vec2(t*.05)))*shore;
  col+=vec3(.75,.85,.85)*foam*.45;
  // grade: lifted blacks, compressed highlights, vignette
  col=col/(1.+col*.6);
  col=pow(col,vec3(.95,.98,1.03));
  float vig=smoothstep(1.35,.25,length(q*vec2(.8,1.)));
  col*=mix(.55,1.,vig);
  col+=(hash(gl_FragCoord.xy+t)-.5)*.025;
  gl_FragColor=vec4(col,1.);
}`

export function WaterCanvas({ still = false, className = '' }: { still?: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl) {
      setFailed(true)
      return
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true)
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uR = gl.getUniformLocation(prog, 'r')
    const uT = gl.getUniformLocation(prog, 't')
    const uM = gl.getUniformLocation(prog, 'm')

    // Render below native resolution — water is soft, and this keeps mobile GPUs cool.
    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, 1.5) * (window.innerWidth < 768 ? 0.55 : 0.7)
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * scale))
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * -2
    }
    window.addEventListener('pointermove', onMove)

    let raf = 0
    let visible = true
    const start = performance.now() - 40000
    // ~30 fps is plenty for slow water and halves the GPU load on modest laptops
    let last = 0
    const draw = (now: number) => {
      if (!still && visible) raf = requestAnimationFrame(draw)
      if (now - last < 32 && !still) return
      last = now
      mouse.x += (mouse.tx - mouse.x) * 0.03
      mouse.y += (mouse.ty - mouse.y) * 0.03
      gl.uniform2f(uR, canvas.width, canvas.height)
      gl.uniform1f(uT, (now - start) / 1000)
      gl.uniform2f(uM, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(draw)

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(draw)
    })
    io.observe(canvas)
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && visible) raf = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [still])

  if (failed)
    return <div className={`${className} bg-[radial-gradient(120%_90%_at_20%_100%,#0b4a52_0%,#05202a_45%,#030b10_100%)]`} />
  return <canvas ref={canvasRef} className={`${className} block h-full w-full`} aria-hidden />
}
