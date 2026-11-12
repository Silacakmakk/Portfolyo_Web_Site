import { useRef } from 'react'
import { experiences, profile, programs, projects } from '../content/portfolio'
import { useNavigation } from '../app/NavigationContext'
import styles from './SectionContent.module.css'

export function SectionContent({ index }: { index: number }) {
  const { navigate } = useNavigation()
  if (index === 0) return <div className={styles.about}>
    <p className={styles.statement}>Kütahya Dumlupınar Üniversitesi Bilgisayar Mühendisliği bölümünden <em>3,92 ortalamayla fakülte birincisi</em> olarak mezun oldum.</p>
    <p>SQL, Python ve Excel ile veri analizi, veri kalitesi ve raporlama; makine öğrenmesiyle model geliştirme üzerine çalışıyorum.</p>
    <div className={styles.highlights}><span><strong>3,92</strong><small>Mezuniyet ortalaması / 4,00</small></span><span><strong>%92,5</strong><small>Yayımlanan MLP çalışması · doğruluk</small></span></div>
    <div className={styles.tags}>{profile.skills.slice(0, 6).map(skill => <span key={skill}>{skill}</span>)}</div>
    <button className="text-link" onClick={() => navigate(3)}>Çalışmalarımı keşfet <span aria-hidden="true">↗</span></button>
    <span className={styles.personal}>Ekranın dışında: kitaplar, doğa yürüyüşleri ve yeni deneyimler.</span>
  </div>
  if (index === 1) return <div className={styles.experiences}>{experiences.map((item, i) => <article className={styles.experience} key={item.organization}>
    <div className={styles.rowLabel}><span>0{i + 1}</span><time>{item.date}</time></div><h2>{item.role}</h2><p className={styles.organization}>{item.organization}</p><ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
  </article>)}</div>
  if (index === 2) return <div className={styles.education}>
    <article><span className={styles.kicker}>EYLÜL 2021 — HAZİRAN 2026</span><h2>Bilgisayar Mühendisliği</h2><p>Kütahya Dumlupınar Üniversitesi</p><div className={styles.degree}><strong>3,92 <small>/ 4,00</small></strong><span>Fakülte birincisi</span></div></article>
    <div className={styles.subsection}><h3>Öğrenmeye devam.</h3><p className={styles.muted}>Sertifikalar ve programlar</p><ul>{programs.map(p => <li key={p}>{p}</li>)}</ul></div>
    <div className={styles.languages}><span>Türkçe <small>Ana dil</small></span><span>İngilizce <small>B2</small></span></div>
    <p className={styles.volunteer}>HummingBird gönüllüsü · Ağustos 2024’ten bu yana.</p>
  </div>
  if (index === 3) return <Projects />
  return <div className={styles.contact}>
    <span className={styles.kicker}>BİRLİKTE DÜŞÜNELİM.</span><a className={styles.email} href={`mailto:${profile.email}`}>{profile.email}<span aria-hidden="true">↗</span></a>
    <p>Veri analizi, makine öğrenmesi ve yazılım geliştirme alanlarında bir sohbetle başlayabiliriz.</p>
    <div className={styles.socials}>{profile.links.map(link => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}</div>
    <p className={styles.signoff}>Tanışmak dileğiyle,<br /><em>Sıla.</em></p>
  </div>
}

function Projects() {
  const dialog = useRef<HTMLDialogElement>(null)
  return <div className={styles.projects}>
    {projects.map((project, index) => <details key={project.id} className={styles.project}>
      <summary><span className={`${styles.art} ${styles[project.art]}`} aria-hidden="true"><span>0{index + 1}</span></span><span className={styles.projectSummary}><small>{project.category}</small><h2>{project.short}</h2></span><span className={styles.expand} aria-hidden="true">+</span></summary>
      <div className={styles.projectBody}><h3>{project.title}</h3><p>{project.description}</p><p>{project.detail}</p><div className={styles.tags}>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">Proje deposunu incele <span aria-hidden="true">↗</span></a>}</div>
    </details>)}
    <a className="text-link" href={profile.links[1].url} target="_blank" rel="noopener noreferrer">GitHub profilimi incele <span aria-hidden="true">↗</span></a>
    <button className={styles.sourceButton} onClick={() => dialog.current?.showModal()}>Çalışmalar hakkında</button>
    <dialog className={styles.dialog} ref={dialog} aria-labelledby="project-note"><h2 id="project-note">Çalışmalar hakkında</h2><p>Projelerin ayrıntılarında mevcut kaynak depolarına ulaşabilirsiniz. Görsel desenler kavramsaldır; proje ekran görüntüsü değildir. Yayın ve çalışma bilgileri CV’ye dayanır.</p><form method="dialog"><button className="text-link">Kapat <span aria-hidden="true">×</span></button></form></dialog>
  </div>
}
