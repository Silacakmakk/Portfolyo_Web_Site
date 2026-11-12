import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRef, type RefObject } from 'react'
import { useNavigation } from '../app/NavigationContext'

gsap.registerPlugin(useGSAP)
export type SurfaceMotion = { transition: number; section: number }
export function useSectionTransition(content: RefObject<HTMLElement | null>, motion: RefObject<SurfaceMotion>) {
  const { state, dispatch, reducedMotion } = useNavigation()
  const displayed = useRef(state.displayed); displayed.current = state.displayed
  useGSAP(() => {
    const node = content.current; if (!node) return
    const target = state.requested
    if (reducedMotion || displayed.current === target) {
      gsap.set(node, { opacity: 1, x: 0, filter: 'blur(0px)' })
      motion.current.transition = 0; motion.current.section = target
      dispatch({ type: 'commit', index: target }); dispatch({ type: 'finish' }); return
    }
    const direction = target > displayed.current ? 1 : -1
    const tl = gsap.timeline({ onComplete: () => dispatch({ type: 'finish' }) })
    tl.to(motion.current, { transition: 1, duration: .18 }, 0)
      .to(node, { opacity: 0, x: -direction * 36, filter: 'blur(5px)', duration: .19 }, 0)
      .call(() => {
        dispatch({ type: 'commit', index: target })
        motion.current.section = target
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
      .fromTo(node, { x: direction * 48, opacity: 0, filter: 'blur(5px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: .65, ease: 'power3.out' })
      .to(motion.current, { transition: 0, duration: .7 }, .2)
  }, { scope: content, dependencies: [state.requested, reducedMotion], revertOnUpdate: true })
}
