import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { Quality } from '../graphics/LiquidSurface'
import { profile, sections } from '../content/portfolio'
import { SectionContent } from '../sections/SectionContent'
import { useGestures } from '../navigation/useGestures'
import { useSectionTransition, type SurfaceMotion } from '../transitions/useSectionTransition'
import { useNavigation } from './NavigationContext'
import styles from './App.module.css'

const LiquidSurface = lazy(() => import('../graphics/LiquidSurface').then(module => ({ default: module.LiquidSurface })))

function savedDim() { try { return localStorage.getItem('portfolio-dim') === 'true' } catch { return false } }

export function App() {
  const root = useRef<HTMLDivElement>(null), content = useRef<HTMLElement>(null)
  const { state, navigate, reducedMotion } = useNavigation()
  const motion = useRef<SurfaceMotion>({ transition: 0, section: state.displayed })
  const [quality, setQuality] = useState<Quality>(() => innerWidth < 650 ? 'low' : 'high')
  const [dim, setDim] = useState(savedDim)
  const current = sections[state.displayed]
  useGestures(root); useSectionTransition(content, motion)
  useEffect(() => { document.title = `${current.label} · Sıla Çakmak` }, [current.label])
  function toggleDim() { const value = !dim; setDim(value); try { localStorage.setItem('portfolio-dim', String(value)) } catch { /* Preferences are optional. */ } }
  return <div ref={root} className={styles.app} data-section={current.id}>
    <Suspense fallback={null}><LiquidSurface motion={motion} quality={quality} reducedMotion={reducedMotion} dim={dim} /></Suspense>
    <a className="skip-link" href="#icerik" onClick={event => { event.preventDefault(); content.current?.focus() }}>İçeriğe geç</a>
    <header className={styles.header}>
      <a className={styles.brand} href="#hakkimda" onClick={e => { e.preventDefault(); navigate(0) }}><span>SILA ÇAKMAK</span><small>{profile.role}</small></a>
      <div className={styles.headerRight}><span className={styles.headerNote}>MERAKLA ŞEKİLLENEN<br />BİR YOLCULUK.</span><button className={styles.hello} onClick={() => navigate(4)}>Bir merhaba <span aria-hidden="true">↗</span></button></div>
    </header>
    <main id="icerik" ref={content} tabIndex={-1} className={styles.main} aria-busy={state.transitioning}>
      <div className={styles.introduction}>
        <span className={styles.eyebrow}>0{state.displayed + 1} / {current.label.toLocaleUpperCase('tr-TR')}</span>
        <h1 id={current.id}>{current.title[0]}<br /><em>{current.title[1]}</em></h1>
        <p className={styles.intro}>{current.intro}</p>
        <span className={styles.signature}>Sıla Çakmak<span aria-hidden="true"> — </span><span>Veri. Düşünce. Üretim.</span></span>
      </div>
      <section className={styles.section} aria-label={`${current.label} içeriği`}><SectionContent index={state.displayed} /></section>
    </main>
    <div className={styles.sideCaption} aria-hidden="true">DÜŞÜN · ÜRET · GELİŞTİR</div>
    <footer className={styles.footer}>
      <div className={styles.navWrap}>
        <nav aria-label="Portfolyo bölümleri" className={styles.nav}>
          {sections.map((section, index) => <button key={section.id} type="button" aria-label={`${index + 1} · ${section.label}`} aria-current={state.displayed === index ? 'page' : undefined} onClick={() => navigate(index)}><span>{index + 1}</span></button>)}
        </nav>
        <span className={styles.indicator} style={{ transform: `translateX(${state.requested * 100}%)` }} aria-hidden="true" />
        <span className={styles.sectionLabel} aria-hidden="true">{current.label}</span>
      </div>
      <div className={styles.footerBottom}><span>© 2026 Sıla Çakmak</span><span className={styles.gestureHint}>YANA KAYDIR · KEŞFET</span><div className={styles.preferences}>
        <label><span className="sr-only">Efekt yoğunluğu</span><select value={quality} disabled={reducedMotion} onChange={e => setQuality(e.target.value as Quality)}><option value="high">Akışkan</option><option value="low">Hafif</option><option value="still">Durgun</option></select></label>
        <button type="button" onClick={toggleDim} aria-label="Loş görünüm" aria-pressed={dim}>{dim ? '☀' : '☾'}</button>
      </div></div>
      {reducedMotion && <span className={styles.motionNote}>Hareket azaltma tercihiniz uygulanıyor.</span>}
    </footer>
    <span className="sr-only" role="status" aria-live="polite">{current.label} bölümü</span>
  </div>
}
