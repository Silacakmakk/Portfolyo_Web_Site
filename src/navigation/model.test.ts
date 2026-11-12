import { describe, expect, it } from 'vitest'
import { clampIndex, indexFromHash, navigationReducer } from './model'

describe('section navigation', () => {
  it('resolves shared links and safely handles unknown hashes', () => {
    expect(indexFromHash('#projeler')).toBe(3)
    expect(indexFromHash('#egitim')).toBe(2)
    expect(indexFromHash('#unknown')).toBe(0)
    expect(indexFromHash('#%')).toBe(0)
  })
  it('keeps horizontal navigation at its boundaries', () => {
    expect(clampIndex(-1)).toBe(0)
    expect(clampIndex(5)).toBe(4)
    expect(clampIndex(NaN)).toBe(0)
  })
  it('discards obsolete transition commits after a newer selection', () => {
    let state = { displayed: 0, requested: 0, transitioning: false }
    state = navigationReducer(state, { type: 'request', index: 1 })
    state = navigationReducer(state, { type: 'request', index: 4 })
    state = navigationReducer(state, { type: 'commit', index: 1 })
    expect(state.displayed).toBe(0)
    state = navigationReducer(state, { type: 'commit', index: 4 })
    state = navigationReducer(state, { type: 'finish' })
    expect(state).toEqual({ displayed: 4, requested: 4, transitioning: false })
  })
})
