import { useEffect, type RefObject } from 'react'
import { useNavigation } from '../app/NavigationContext'

export function useGestures(root: RefObject<HTMLElement | null>) {
  const { navigate, state } = useNavigation()
  useEffect(() => {
    const el = root.current; if (!el) return
    let start: { x: number; y: number; id: number } | null = null
    let sum = 0, lastWheel = 0, lastSlide = -1000
    const interactive = (target: EventTarget | null) => target instanceof Element && !!target.closest('button,a,input,textarea,select,summary,dialog')
    const key = (e: KeyboardEvent) => {
      if (e.altKey || e.metaKey || e.ctrlKey || (e.target instanceof Element && e.target.closest('input,textarea,select,dialog'))) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); navigate(state.requested + (e.key === 'ArrowRight' ? 1 : -1)) }
    }
    const down = (e: PointerEvent) => { if (!interactive(e.target) && e.button === 0) start = { x: e.clientX, y: e.clientY, id: e.pointerId } }
    const up = (e: PointerEvent) => {
      if (!start || start.id !== e.pointerId) return
      const dx = e.clientX - start.x, dy = e.clientY - start.y; start = null
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(state.requested + (dx < 0 ? 1 : -1))
    }
    const cancel = () => { start = null }
    const wheel = (e: WheelEvent) => {
      if (interactive(e.target) || Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.3 || Math.abs(e.deltaX) < 2) return
      const direction = Math.sign(e.deltaX)
      if ((state.requested === 0 && direction < 0) || (state.requested === 4 && direction > 0)) return
      e.preventDefault()
      const now = performance.now(); if (now - lastSlide < 1000) return
      if (now - lastWheel > 160) sum = 0
      lastWheel = now; sum += e.deltaX
      if (Math.abs(sum) > 70) { navigate(state.requested + Math.sign(sum)); sum = 0; lastSlide = now }
    }
    window.addEventListener('keydown', key); el.addEventListener('pointerdown', down); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', cancel); el.addEventListener('wheel', wheel, { passive: false })
    return () => { window.removeEventListener('keydown', key); el.removeEventListener('pointerdown', down); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', cancel); el.removeEventListener('wheel', wheel) }
  }, [root, navigate, state.requested])
}
