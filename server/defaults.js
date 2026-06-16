/** Varsayılan site içeriği — ilk kurulumda site.json olarak kaydedilir */
export function getDefaultContent() {
  const bi = (tr, en) => ({ tr, en });

  return {
    profile: {
      initials: "S.D.",
      name: "Selim Dibek",
      field: bi(
        "Girne Üniversitesi · Yazılım Mühendisliği · 4. Sınıf",
        "Girne University · Software Engineering · Year 4"
      ),
      photo: null,
      cvPdf: "/cv.html",
      badge: bi("Bitirme projesi hazırlığında", "Preparing graduation project"),
      tagline: bi(
        "Gerçek ihtiyaçları kullanılabilir yazılıma dönüştürmek — kod ile çözmek benim yöntemim.",
        "Turning real needs into usable software — solving with code is my approach."
      ),
      subtitle: bi(
        "Web ve mobil tabanlı uygulamalar geliştiriyorum; araç kiralama, randevu sistemleri ve iş süreçlerini dijitalleştiren full-stack projeler üzerinde çalışıyorum.",
        "I build web and mobile applications; full-stack projects including car rental, booking systems, and business process digitization."
      ),
      metrics: [
        { value: "3+", key: "projects" },
        { value: "3+", key: "experience" },
        { value: "8+", key: "stack" },
      ],
      contact: {
        email: "Selimdibek0@gmail.com",
        github: null,
        linkedin: null,
      },
    },
    timeline: [
      {
        id: "2022",
        year: "2022",
        tags: ["Java", "Algoritma", "OOP"],
        period: bi("Girne Üniversitesi — 1. Yıl", "Girne University — Year 1"),
        title: bi("Yazılım Mühendisliğine Giriş", "Entering Software Engineering"),
        highlight: bi(
          "Programlama temelleri, algoritma mantığı ve nesne yönelimli programlama dersleriyle mühendislik düşüncesini oluşturdum. İlk konsol uygulamalarımı ve takım çalışması projelerimi tamamladım.",
          "Built engineering thinking through programming fundamentals, algorithms, and OOP. Completed my first console apps and team projects."
        ),
        metric: bi("Temel mühendislik dersleri · 2 dönem projesi", "Core engineering courses · 2 semester projects"),
      },
      {
        id: "2023",
        year: "2023",
        tags: ["HTML/CSS", "JavaScript", "SQL"],
        period: bi("Girne Üniversitesi — 2. Yıl", "Girne University — Year 2"),
        title: bi("Web Geliştirmeye Geçiş", "Transition to Web Development"),
        highlight: bi(
          "Veritabanı yönetimi ve web teknolojileri dersleriyle frontend–backend ayrımını öğrendim. REST API mantığını kavrayarak ilk tam yığın ödev projelerimi geliştirdim.",
          "Learned frontend–backend separation through database management and web technologies. Built my first full-stack assignment projects with REST API design."
        ),
        metric: bi("İlk web projeleri · Veritabanı tasarımı", "First web projects · Database design"),
      },
      {
        id: "2024",
        year: "2024",
        tags: ["React", "Node.js", "SQL", "REST API"],
        period: bi("Girne Üniversitesi — 3. Yıl", "Girne University — Year 3"),
        title: bi("Uygulama Geliştirme Dönemi", "Application Development Phase"),
        highlight: bi(
          "Araç kiralama ve spor salonu randevu uygulamalarını sıfırdan tasarlayıp geliştirdim. Kullanıcı yönetimi, rezervasyon akışları ve admin panellerini uçtan uca hayata geçirdim.",
          "Designed and built car rental and gym booking apps from scratch. Implemented user management, reservation flows, and admin panels end-to-end."
        ),
        metric: bi("2 ana proje · Full-stack geliştirme", "2 major projects · Full-stack development"),
      },
      {
        id: "2025",
        year: "2025",
        tags: ["Full-Stack", "UI/UX", "Bitirme Projesi"],
        period: bi("Girne Üniversitesi — 4. Sınıf", "Girne University — Year 4"),
        title: bi("Bitirme & Profesyonelleşme", "Graduation & Professional Growth"),
        highlight: bi(
          "Son sınıfta mevcut projelerimi iyileştiriyor, yeni iş uygulamaları geliştiriyor ve bitirme projesi hazırlığı yapıyorum.",
          "In my final year I'm improving existing projects, building new business apps, and preparing my graduation project."
        ),
        metric: bi("Devam ediyor · Staj & iş birliği açık", "Ongoing · Open to internships & collaboration"),
      },
    ],
    projects: [
      {
        id: "car-rental",
        year: "2024",
        stack: ["React", "Node.js", "Express", "SQL"],
        screenshots: [null, null, null],
        demo: null,
        github: null,
        title: bi("Araç Kiralama Uygulaması", "Car Rental Application"),
        subtitle: bi("Online Rezervasyon ve Filo Yönetim Sistemi", "Online Reservation & Fleet Management System"),
        problem: bi(
          "Küçük ölçekli kiralama firmaları araç müsaitliğini telefon veya defter üzerinden takip ediyordu; çakışan rezervasyonlar operasyonel verimsizlik yaratıyordu.",
          "Small rental companies tracked vehicle availability by phone or notebook; overlapping reservations hurt operational efficiency."
        ),
        solution: bi(
          "Araç listeleme, tarih bazlı müsaitlik kontrolü, online rezervasyon ve admin paneli içeren full-stack bir uygulama geliştirdim.",
          "Built a full-stack app with vehicle listing, date-based availability, online booking, and admin panel."
        ),
        result: bi(
          "Rezervasyon süreci tek platformda toplandı; müsaitlik kontrolü otomatikleşerek çakışma riski ortadan kalktı.",
          "Reservation process unified on one platform; automatic availability checks eliminated conflicts."
        ),
      },
      {
        id: "gym-booking",
        year: "2024",
        stack: ["React", "JavaScript", "REST API", "SQL"],
        screenshots: [null, null, null],
        demo: null,
        github: null,
        title: bi("Spor Salonu Randevu Uygulaması", "Gym Appointment App"),
        subtitle: bi("Antrenör ve Seans Rezervasyon Platformu", "Trainer & Session Booking Platform"),
        problem: bi(
          "Antrenör seansları WhatsApp veya telefonla ayarlanıyordu; iptal edilen seanslar takip edilemiyordu.",
          "Trainer sessions were booked via WhatsApp or phone; cancellations weren't tracked."
        ),
        solution: bi(
          "Üyelerin antrenör seçip tarih/saat bazlı randevu alabildiği bir web uygulaması tasarladım.",
          "Designed a web app where members pick trainers and book by date/time."
        ),
        result: bi(
          "Randevu süreci dijitalleşti; üyeler 7/24 online rezervasyon yapabilir hale geldi.",
          "Booking went digital; members can reserve online 24/7."
        ),
      },
      {
        id: "web-apps",
        year: "2023–2025",
        stack: ["JavaScript", "React", "SQL", "Git"],
        screenshots: [null, null],
        demo: null,
        github: null,
        title: bi("İş Süreci Web Uygulamaları", "Business Process Web Apps"),
        subtitle: bi("Yönetim Paneli ve CRUD Tabanlı Sistemler", "Admin Panels & CRUD-Based Systems"),
        problem: bi(
          "Farklı sektörlerin veri yönetimi ihtiyaçları için tekrar kullanılabilir bir yapı gerekiyordu.",
          "Different domains needed reusable, scalable data management."
        ),
        solution: bi(
          "Modüler mimari ile CRUD ve raporlama ekranları içeren birden fazla web uygulaması geliştirdim.",
          "Built multiple web apps with modular auth, CRUD, and reporting."
        ),
        result: bi(
          "Her yeni proje öncekilerden öğrendiklerimle daha hızlı tamamlandı.",
          "Each new project shipped faster building on previous learnings."
        ),
      },
    ],
    skills: [
      { id: "javascript", name: "JavaScript", category: "language", duration: "3+ yıl", intensity: "high", projects: bi(["Araç Kiralama", "Randevu Uygulaması", "Web Projeleri"], ["Car Rental", "Booking App", "Web Projects"]) },
      { id: "react", name: "React", category: "frontend", duration: "18 ay", intensity: "high", projects: bi(["Araç Kiralama", "Randevu Uygulaması", "Bu Portföy"], ["Car Rental", "Booking App", "This Portfolio"]) },
      { id: "nodejs", name: "Node.js", category: "backend", duration: "14 ay", intensity: "high", projects: bi(["Araç Kiralama", "REST API Projeleri"], ["Car Rental", "REST API Projects"]) },
      { id: "sql", name: "SQL", category: "database", duration: "2+ yıl", intensity: "high", projects: bi(["Tüm Web Uygulamaları"], ["All Web Applications"]) },
      { id: "htmlcss", name: "HTML / CSS", category: "frontend", duration: "3+ yıl", intensity: "medium", projects: bi(["Tüm Projeler"], ["All Projects"]) },
      { id: "java", name: "Java", category: "language", duration: "2 yıl", intensity: "medium", projects: bi(["Üniversite Projeleri", "OOP Dersleri"], ["University Projects", "OOP Courses"]) },
      { id: "git", name: "Git", category: "tool", duration: "3+ yıl", intensity: "high", projects: bi(["Tüm Projeler"], ["All Projects"]) },
      { id: "restapi", name: "REST API", category: "architecture", duration: "12 ay", intensity: "medium", projects: bi(["Araç Kiralama", "Randevu Sistemi"], ["Car Rental", "Booking System"]) },
    ],
    library: [
      { id: "clean-code", type: "reading", status: "reading", title: bi("Clean Code", "Clean Code"), author: bi("Robert C. Martin", "Robert C. Martin"), note: bi("Okunabilir kod prensiplerini projelerime uyguluyorum.", "Applying readable code principles to my projects.") },
      { id: "fullstack-trend", type: "trend", status: "following", title: bi("Full-Stack Web Mimarileri", "Full-Stack Web Architectures"), author: bi("Sektör Trendi", "Industry Trend"), note: bi("React + Node.js ekosistemindeki modern kalıpları takip ediyorum.", "Following modern patterns in the React + Node.js ecosystem.") },
      { id: "user-first", type: "thought", status: "thinking", title: bi("Kullanıcı Önce Tasarım", "User-First Design"), author: bi("Kişisel Not", "Personal Note"), note: bi("Özelliği kodlamadan önce kullanıcı akışını haritalamak.", "Mapping user flow before coding a feature.") },
      { id: "ddia", type: "reading", status: "reading", title: bi("Designing Data-Intensive Applications", "Designing Data-Intensive Applications"), author: bi("Martin Kleppmann", "Martin Kleppmann"), note: bi("Bitirme projesi için veri modelleme referansı.", "Reference for data modeling in my graduation project.") },
    ],
    ui: {
      tr: {
        meta: { description: "Selim Dibek — Girne Üniversitesi Yazılım Mühendisliği portföyü", title: "Portföy | Selim Dibek" },
        nav: { timeline: "Zaman Tüneli", projects: "Projeler", skills: "Yetkinlikler", library: "Kütüphane", contact: "İletişim", cv: "CV İndir", theme: "Tema değiştir", menu: "Menü" },
        hero: { ctaProjects: "Vaka Analizlerini İncele", ctaTimeline: "Zaman Tüneli", scroll: "Aşağı kaydır", photoAlt: "Selim Dibek profil fotoğrafı", photoPlaceholder: "Fotoğraf eklenecek", metrics: { projects: "Tamamlanan Proje", experience: "Yıllık Deneyim", stack: "Aktif Teknoloji" } },
        timeline: { tag: "Akıllı CV", title: "Zaman Tüneli", desc: "Her döneme tıklayarak o yılların en büyük başarısını keşfedin.", placeholderTitle: "Bir dönem seçin", placeholderDesc: "Zaman çizgisindeki noktalara tıklayarak detayları görüntüleyin.", ariaLabel: "Kariyer zaman tüneli" },
        projects: { tag: "Vaka Analizi", title: "Projeler", desc: "Her proje bir problem, bir çözüm ve ölçülebilir bir sonuç hikayesidir.", problem: "Problem", solution: "Çözüm", result: "Sonuç", demo: "Canlı Demo", github: "GitHub", screenshotPlaceholder: "Ekran görüntüsü eklenecek" },
        skills: { tag: "Yetkinlik Haritası", title: "Araçlar & Diller", desc: "Hangi projede, ne kadar süreyle aktif kullandığım.", categories: { language: "Dil", frontend: "Frontend", backend: "Backend", database: "Veritabanı", hardware: "Donanım", devops: "DevOps", architecture: "Mimari", tool: "Araç" } },
        library: { tag: "Düşünce Köşesi", title: "Dijital Kütüphane", desc: "Okuduklarım, trendler ve düşünceler.", types: { reading: "Okuma", trend: "Trend", thought: "Düşünce" }, statuses: { reading: "Okunuyor", following: "Takip Ediliyor", thinking: "Üzerinde Düşünüyorum" } },
        contact: { title: "Birlikte üretelim.", text: "Proje fikirleri, staj veya iş birliği için her zaman açığım.", email: "E-posta", github: "GitHub", linkedin: "LinkedIn" },
        footer: { note: "Ağırbaşlı Yenilikçilik" },
      },
      en: {
        meta: { description: "Selim Dibek — Software Engineering Portfolio, Girne University", title: "Portfolio | Selim Dibek" },
        nav: { timeline: "Timeline", projects: "Projects", skills: "Skills", library: "Library", contact: "Contact", cv: "Download CV", theme: "Toggle theme", menu: "Menu" },
        hero: { ctaProjects: "View Case Studies", ctaTimeline: "Timeline", scroll: "Scroll down", photoAlt: "Selim Dibek profile photo", photoPlaceholder: "Photo coming soon", metrics: { projects: "Completed Projects", experience: "Years of Experience", stack: "Active Technologies" } },
        timeline: { tag: "Smart CV", title: "Timeline", desc: "Click each period to discover that year's biggest achievement.", placeholderTitle: "Select a period", placeholderDesc: "Click points on the timeline to view details.", ariaLabel: "Career timeline" },
        projects: { tag: "Case Study", title: "Projects", desc: "Every project is a story of problem, solution, and measurable outcome.", problem: "Problem", solution: "Solution", result: "Result", demo: "Live Demo", github: "GitHub", screenshotPlaceholder: "Screenshot coming soon" },
        skills: { tag: "Skills Map", title: "Tools & Languages", desc: "Which projects I used them in and for how long.", categories: { language: "Language", frontend: "Frontend", backend: "Backend", database: "Database", hardware: "Hardware", devops: "DevOps", architecture: "Architecture", tool: "Tool" } },
        library: { tag: "Thinking Corner", title: "Digital Library", desc: "What I'm reading, trends I follow, and ideas I'm exploring.", types: { reading: "Reading", trend: "Trend", thought: "Thought" }, statuses: { reading: "Reading", following: "Following", thinking: "Thinking About" } },
        contact: { title: "Let's build together.", text: "Always open to project ideas, internships, or collaboration.", email: "Email", github: "GitHub", linkedin: "LinkedIn" },
        footer: { note: "Measured Innovation" },
      },
    },
  };
}
