import { sections } from '../content/portfolio'

export function clampIndex(index: number) { return Math.max(0, Math.min(sections.length - 1, Number.isFinite(index) ? Math.trunc(index) : 0)) }
export function indexFromHash(hash: string) { const id = hash.replace(/^#/, ''); const index = sections.findIndex(s => s.id === id); return index < 0 ? 0 : index }
export type NavigationState = { displayed: number; requested: number; transitioning: boolean }
export type NavigationAction = { type: 'request'; index: number } | { type: 'commit'; index: number } | { type: 'finish' }
export function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  if (action.type === 'request') { const requested = clampIndex(action.index); return { ...state, requested, transitioning: requested !== state.displayed } }
  if (action.type === 'commit') { if (action.index !== state.requested) return state; return { ...state, displayed: state.requested } }
  return { ...state, transitioning: state.displayed !== state.requested }
}
