export const sections = [
  { id: 'hakkimda', label: 'Hakkımda', title: ['Merakla başlar.', 'Veriyle şekillenir.'], intro: 'Bilgisayar mühendisiyim. İş ihtiyaçlarını anlayan, veriden anlam çıkaran ve uygulanabilir çözümler geliştiren çalışmalar üretiyorum.' },
  { id: 'deneyim', label: 'Deneyim', title: ['Birlikte üretmek.', 'Yaparak öğrenmek.'], intro: 'Yazılım geliştirmeden veri tabanı tasarımına, kurumsal sistemlerden ekip koordinasyonuna uzanan deneyimlerim.' },
  { id: 'egitim', label: 'Eğitim', title: ['Öğrenmek,', 'hep yeniden.'], intro: 'Bilgisayar mühendisliği temeli; veri, yapay zekâ ve sürekli öğrenme merakı.' },
  { id: 'projeler', label: 'Projeler', title: ['Fikirden', 'çalışan çözüme.'], intro: 'Veri, modelleme ve yazılım geliştirme ekseninde seçili çalışmalarım.' },
  { id: 'iletisim', label: 'İletişim', title: ['Bir fikir,', 'bir merhaba.'], intro: 'Veriye dayalı çözümler ve yeni çalışma fırsatları üzerine konuşmak için bana ulaşabilirsiniz.' },
] as const

export const profile = {
  name: 'Sıla Çakmak', role: 'Bilgisayar Mühendisi',
  email: 'silacakmak411@gmail.com',
  links: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/slacakmakk/' },
    { label: 'GitHub', url: 'https://github.com/Silacakmakk' },
    { label: 'Medium', url: 'https://silacakmakk.medium.com/' },
  ],
  skills: ['SQL', 'Python', 'Pandas & NumPy', 'Veri analizi', 'Veri kalitesi', 'Makine öğrenmesi', 'İlişkisel veri tabanları', 'Excel', 'Raporlama', 'Teknik dokümantasyon'],
}

export const experiences = [
  { role: 'Bilgi Teknolojileri Stajyeri', organization: 'ÇİMKO Çimento ve Beton Sanayi A.Ş.', date: 'Temmuz — Ağustos 2026', points: ['20 iş günlük stajda kurumsal ağ ve sistem yönetimi süreçlerini destekledim.', 'Cisco switch, FortiGate, VLAN, DHCP ve FortiAP ile ağ testleri gerçekleştirdim; IP kamera entegrasyonu ve temel Active Directory sorunlarının çözümünde görev aldım.'] },
  { role: 'Takım Kaptanı', organization: 'Fikrine Sahip Çık Hackathon', date: 'Nisan — Mayıs 2026', points: ['Elektrikli araç bataryalarına yönelik fikirle 40 takım arasından finale kalan 10 takımdan biri olduk.', 'Finalde, taburculuk sonrası hasta takibine yönelik çözümü 12 saatte geliştirerek 6. sırayı elde ettik.', 'Problem analizi, çözüm gereksinimleri ve patent başvuru kurallarına uygun teknik dokümantasyon süreçlerini koordine ettim.'] },
  { role: 'İŞKUR Gençlik Programı Öğrencisi', organization: 'Kütahya Dumlupınar Üniversitesi · Sağlık, Kültür ve Spor Daire Başkanlığı', date: 'Ocak — Haziran 2026', points: ['Veri girişi, belge düzenleme ve dosya takibi süreçlerini yürüttüm.', 'Word ve Excel desteği; bilgisayar güncelleme, formatlama ve temel sorun giderme işlemleri gerçekleştirdim.'] },
  { role: 'Yazılım Geliştirme Stajyeri', organization: 'LTC İnovasyon A.Ş.', date: 'Temmuz — Eylül 2025', points: ['40 iş günlük stajda web uygulaması geliştirme ve veri tabanı tasarımına katkı sağladım.', 'Şirketin kariyer web sitesini geliştirerek canlıya aldım; kullanıcı modülleri, arayüz iyileştirmeleri, hata giderme ve SEO çalışmalarını yürüttüm.'] },
]

export const programs = ['Huawei HCIA–Artificial Intelligence', 'ZExperience AI Master Programı', 'Milli Teknoloji Akademisi Yapay Zekâ Uzmanlık Programı', 'Introduction to Data Science', 'R ile Veri Bilimine Giriş', 'Havacılık Motorları Okulu Programı']

export const projects = [
  { id: 'oyun-bagimliligi', category: 'MAKİNE ÖĞRENMESİ / YAYIN', title: 'Veriden risk göstergelerine.', short: 'Oyun bağımlılığı risk sınıflandırması', description: 'Davranışsal ve ruhsal sağlık göstergeleri kullanılarak oyun bağımlılığı risk düzeyinin makine öğrenmesi tabanlı sınıflandırılması.', detail: 'MLP modeliyle %92,5 doğruluk elde edilen çalışma, Journal of Scientific Reports-C dergisinin Ağustos 2026 sayısında yayımlandı.', tags: ['MLP', 'Sınıflandırma', 'Model değerlendirme'], art: 'signal', url: null },
  { id: 'diabetes', category: 'MAKİNE ÖĞRENMESİ', title: 'Verideki örüntüleri aramak.', short: 'Diabetes tespiti', description: 'Diabetes tespitine yönelik sınıflandırma çalışması.', detail: 'Jupyter Notebook ortamında normalizasyon ve özellik seçimi; hold-out ve 10 katlı çapraz doğrulama yöntemleriyle gerçekleştirilen makine öğrenmesi çalışması.', tags: ['Sınıflandırma', 'Özellik seçimi', 'Çapraz doğrulama'], art: 'dots', url: 'https://github.com/Silacakmakk/Diabetes-ML-Project' },
  { id: 'banka', category: 'VERİ TABANI', title: 'İlişkilerden bir sistem.', short: 'Banka Veri Tabanı Yönetim Projesi', description: 'Banka veri tabanı yönetimi üzerine geliştirdiğim proje.', detail: 'İlişkisel veri tabanı tasarımı ve SQL ilgi alanlarım doğrultusunda gerçekleştirdiğim çalışma.', tags: ['SQL', 'İlişkisel veri tabanı'], art: 'grid', url: 'https://github.com/Silacakmakk/banka-veritabani-projesi' },
  { id: 'organizasyon', category: 'YAZILIM GELİŞTİRME', title: 'Süreçlere düzen katmak.', short: 'Organizasyon Yönetim Sistemi', description: 'Organizasyon yönetimi üzerine gerçekleştirdiğim yazılım projesi.', detail: 'İş ihtiyaçlarını anlamaya ve süreçleri yapılandırmaya yönelik çalışmalarım arasında yer alıyor.', tags: ['Yazılım', 'Süreç yönetimi'], art: 'orbit', url: 'https://github.com/Silacakmakk/ORGANIZASYONYONETIMSISTEMI' },
] as const
