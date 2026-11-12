import { useEffect, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import fragmentShader from './liquid.frag.glsl?raw'
import type { SurfaceMotion } from '../transitions/useSectionTransition'
import styles from './LiquidSurface.module.css'

export type Quality = 'high' | 'low' | 'still'
type Props = { motion: RefObject<SurfaceMotion>; reducedMotion: boolean; quality: Quality; dim: boolean }
const vertexShader = 'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}'

export function LiquidSurface({ motion, reducedMotion, quality, dim }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)
  const dimRef = useRef(dim); dimRef.current = dim
  useEffect(() => {
    const element = canvas.current; if (!element) return
    let renderer: THREE.WebGLRenderer | undefined, frame = 0, stopped = false, clock = 0, previous = 0, rendered = 0
    let scene: THREE.Scene, material: THREE.ShaderMaterial, geometry: THREE.PlaneGeometry
    const rings: THREE.Vector4[] = Array.from({ length: 6 }, () => new THREE.Vector4(0, 0, -10, 0))
    const mouse = new THREE.Vector2(.7, .5), target = mouse.clone()
    let ringIndex = 0, lastRipple = -1
    const still = reducedMotion || quality === 'still'
    const fps = quality === 'low' ? 30 : 60
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const wake = () => { if (!frame && !stopped && !document.hidden) frame = requestAnimationFrame(draw) }
    function draw(now: number) {
      frame = 0; if (stopped || document.hidden || !renderer) return
      const dt = previous ? Math.min((now - previous) / 1000, .05) : .016; previous = now
      if (!still) clock += dt
      if (now - rendered >= 1000 / fps - 1 || still) {
        rendered = now; mouse.lerp(target, .1)
        material.uniforms.time.value = clock
        material.uniforms.mouse.value.copy(mouse)
        material.uniforms.change.value = reducedMotion ? 0 : motion.current.transition
        material.uniforms.section.value = motion.current.section
        material.uniforms.night.value = dimRef.current ? 1 : 0
        renderer.render(scene, camera)
      }
      if (!still) wake()
    }
    const ripple = (x: number, y: number, force: number) => {
      if (still) return
      rings[ringIndex++ % 6].set(x, y, clock, force); wake()
    }
    const move = (e: PointerEvent) => {
      target.set(e.clientX / innerWidth, 1 - e.clientY / innerHeight)
      if (clock - lastRipple > .16) { ripple(target.x, target.y, .25); lastRipple = clock }
    }
    const down = (e: PointerEvent) => ripple(e.clientX / innerWidth, 1 - e.clientY / innerHeight, .7)
    const resize = () => {
      if (!renderer) return
      renderer.setSize(innerWidth, innerHeight, false)
      material.uniforms.res.value.set(element.width, element.height)
      wake()
    }
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0 } else { previous = 0; wake() } }
    const lost = (e: Event) => { e.preventDefault(); stopped = true; cancelAnimationFrame(frame); setFallback(true) }
    try {
      renderer = new THREE.WebGLRenderer({ canvas: element, antialias: false, alpha: true, powerPreference: 'low-power' })
      renderer.debug.onShaderError = (gl, program, vertex, fragment) => {
        console.error('Liquid shader compilation failed:', gl.getProgramInfoLog(program), gl.getShaderInfoLog(vertex), gl.getShaderInfoLog(fragment))
        stopped = true; setFallback(true)
      }
      renderer.setPixelRatio(quality === 'low' ? .8 : Math.min(devicePixelRatio || 1, 1.5))
      scene = new THREE.Scene(); geometry = new THREE.PlaneGeometry(2, 2)
      material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, depthTest: false, depthWrite: false, uniforms: {
        res: { value: new THREE.Vector2() }, time: { value: 0 }, mouse: { value: mouse.clone() },
        power: { value: still ? .25 : .65 }, change: { value: 0 }, section: { value: motion.current.section },
        night: { value: dimRef.current ? 1 : 0 }, rings: { value: rings },
      } })
      scene.add(new THREE.Mesh(geometry, material)); setFallback(false)
      resize()
      window.addEventListener('resize', resize); window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerdown', down, { passive: true })
      document.addEventListener('visibilitychange', visibility); element.addEventListener('webglcontextlost', lost)
    } catch { setFallback(true); renderer?.dispose() }
    return () => {
      stopped = true; cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', down)
      document.removeEventListener('visibilitychange', visibility); element.removeEventListener('webglcontextlost', lost)
      // React StrictMode reuses this canvas; asynchronously losing its context
      // here would also invalidate the renderer created by the next effect.
      material?.dispose(); geometry?.dispose(); renderer?.dispose()
    }
  }, [motion, reducedMotion, quality, dim])
  return <div className={styles.surface} data-fallback={fallback || undefined} aria-hidden="true"><canvas ref={canvas} hidden={fallback} /><div className={styles.shade} /></div>
}
