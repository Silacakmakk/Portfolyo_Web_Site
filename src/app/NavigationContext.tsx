import { createContext, useCallback, useContext, useEffect, useReducer, useState, type ReactNode } from 'react'
import { sections } from '../content/portfolio'
import { clampIndex, indexFromHash, navigationReducer, type NavigationAction, type NavigationState } from '../navigation/model'

type Navigation = { state: NavigationState; dispatch: React.Dispatch<NavigationAction>; navigate: (index: number) => void; reducedMotion: boolean }
const Context = createContext<Navigation | null>(null)
export function NavigationProvider({ children }: { children: ReactNode }) {
  const initial = indexFromHash(window.location.hash)
  const [state, dispatch] = useReducer(navigationReducer, { displayed: initial, requested: initial, transitioning: false })
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const navigate = useCallback((index: number) => {
    index = clampIndex(index)
    const hash = `#${sections[index].id}`
    if (window.location.hash !== hash) history.pushState(null, '', hash)
    dispatch({ type: 'request', index })
  }, [])
  useEffect(() => {
    const sync = () => dispatch({ type: 'request', index: indexFromHash(window.location.hash) })
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const motion = () => setReducedMotion(media.matches)
    window.addEventListener('popstate', sync); window.addEventListener('hashchange', sync); media.addEventListener('change', motion)
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync); media.removeEventListener('change', motion) }
  }, [])
  return <Context.Provider value={{ state, dispatch, navigate, reducedMotion }}>{children}</Context.Provider>
}
export function useNavigation() { const value = useContext(Context); if (!value) throw new Error('NavigationProvider is required'); return value }
