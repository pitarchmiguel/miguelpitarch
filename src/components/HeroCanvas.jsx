import { useEffect, useRef } from 'react'

/**
 * WebGL hero background — flowing, domain-warped noise in the brand
 * palette (bone + green). three.js is imported dynamically so it never
 * lands in the initial bundle. Honors prefers-reduced-motion and pauses
 * when the tab is hidden.
 */
export default function HeroCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      new URLSearchParams(location.search).has('static')

    let dispose = () => {}
    let cancelled = false

    import('three').then((THREE) => {
      if (cancelled) return

      const vert = `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `
      const frag = `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2  uMouse;
        uniform float uAspect;
        uniform float uScroll;

        vec2 hash(vec2 p){
          p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
          return -1.0 + 2.0*fract(sin(p)*43758.5453123);
        }
        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(
            mix(dot(hash(i),f), dot(hash(i+vec2(1.,0.)),f-vec2(1.,0.)), u.x),
            mix(dot(hash(i+vec2(0.,1.)),f-vec2(0.,1.)), dot(hash(i+vec2(1.,1.)),f-vec2(1.,1.)), u.x),
            u.y);
        }
        float fbm(vec2 p){
          float v=0.0, a=0.55;
          mat2 rot = mat2(0.8,0.6,-0.6,0.8);
          for(int i=0;i<5;i++){ v += a*noise(p); p = rot*p*1.9; a*=0.52; }
          return v;
        }

        void main(){
          vec2 uv = vUv;
          vec2 p = uv * vec2(uAspect,1.0) * 1.6;
          float t = uTime * 0.05;

          vec2 m = uMouse * vec2(uAspect,1.0) * 1.6;
          float mpush = 0.45 * exp(-length(p-m) * 2.2);

          vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2,1.3) - t));
          vec2 r = vec2(fbm(p + 2.4*q + vec2(1.7,9.2) + t*0.7),
                        fbm(p + 2.4*q + vec2(8.3,2.8) - t*0.4));
          float f = fbm(p + 2.6*r + mpush*2.0);

          vec3 bone   = vec3(0.953, 0.937, 0.910);
          vec3 boneLo = vec3(0.859, 0.835, 0.774);
          vec3 clay   = vec3(0.855, 0.561, 0.447); // warm terracotta tint
          vec3 terra  = vec3(0.776, 0.408, 0.263); // brand terracotta

          vec3 col = mix(bone, boneLo, smoothstep(0.1, 0.9, f));
          col = mix(col, clay, smoothstep(0.55, 0.85, f) * 0.30);
          float strand = smoothstep(0.47,0.5,f) * smoothstep(0.55,0.5,f);
          col = mix(col, terra, strand * (0.45 + mpush*1.3));

          float vig = smoothstep(1.4, 0.3, length(uv-0.5)*1.55);
          col = mix(bone, col, vig);
          col = mix(col, bone, uScroll * 0.9);

          gl_FragColor = vec4(col, 1.0);
        }
      `

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'low-power',
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const uniforms = {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uAspect: { value: 1 },
        uScroll: { value: 0 },
      }

      scene.add(
        new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms })
        )
      )

      const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
      const onMove = (e) => {
        mouse.tx = e.clientX / window.innerWidth
        mouse.ty = 1 - e.clientY / window.innerHeight
      }
      window.addEventListener('pointermove', onMove)

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        uniforms.uAspect.value = window.innerWidth / window.innerHeight
      }
      window.addEventListener('resize', resize)
      resize()

      const onScroll = () => {
        uniforms.uScroll.value = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1)
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      const clock = new THREE.Clock()
      let raf = 0
      let running = true

      const frame = () => {
        if (!running) return
        raf = requestAnimationFrame(frame)
        uniforms.uTime.value = clock.getElapsedTime()
        mouse.x += (mouse.tx - mouse.x) * 0.05
        mouse.y += (mouse.ty - mouse.y) * 0.05
        uniforms.uMouse.value.set(mouse.x, mouse.y)
        renderer.render(scene, camera)
      }

      const onVis = () => {
        if (reduced) return
        if (document.hidden) {
          running = false
          cancelAnimationFrame(raf)
        } else if (!running) {
          running = true
          clock.start()
          frame()
        }
      }
      document.addEventListener('visibilitychange', onVis)

      if (reduced) {
        renderer.render(scene, camera)
        running = false
      } else {
        frame()
      }

      dispose = () => {
        running = false
        cancelAnimationFrame(raf)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('resize', resize)
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('visibilitychange', onVis)
        renderer.dispose()
      }
    })

    return () => {
      cancelled = true
      dispose()
    }
  }, [])

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />
}
