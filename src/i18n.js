export const translations = {
  tr: {
    meta: {
      description: "Selim Dibek — Girne Üniversitesi Yazılım Mühendisliği portföyü",
      title: "Portföy | Selim Dibek",
    },
    nav: {
      timeline: "Zaman Tüneli",
      projects: "Projeler",
      skills: "Yetkinlikler",
      library: "Kütüphane",
      contact: "İletişim",
      cv: "CV İndir",
      theme: "Tema değiştir",
      menu: "Menü",
      lang: "Dil değiştir",
    },
    hero: {
      badge: "Bitirme projesi hazırlığında",
      tagline:
        "Gerçek ihtiyaçları kullanılabilir yazılıma dönüştürmek — kod ile çözmek benim yöntemim.",
      subtitle:
        "Web ve mobil tabanlı uygulamalar geliştiriyorum; araç kiralama, randevu sistemleri ve iş süreçlerini dijitalleştiren full-stack projeler üzerinde çalışıyorum.",
      ctaProjects: "Vaka Analizlerini İncele",
      ctaTimeline: "Zaman Tüneli",
      scroll: "Aşağı kaydır",
      photoAlt: "Selim Dibek profil fotoğrafı",
      photoPlaceholder: "Fotoğraf eklenecek",
      metrics: {
        projects: "Tamamlanan Proje",
        experience: "Yıllık Deneyim",
        stack: "Aktif Teknoloji",
      },
    },
    timeline: {
      tag: "Akıllı CV",
      title: "Zaman Tüneli",
      desc: "Kronolojik bir liste değil — her döneme tıklayarak o yılların en büyük başarısını keşfedin.",
      placeholderTitle: "Bir dönem seçin",
      placeholderDesc: "Zaman çizgisindeki noktalara tıklayarak detayları görüntüleyin.",
      ariaLabel: "Kariyer zaman tüneli",
      items: {
        "2022": {
          period: "Girne Üniversitesi — 1. Yıl",
          title: "Yazılım Mühendisliğine Giriş",
          highlight:
            "Programlama temelleri, algoritma mantığı ve nesne yönelimli programlama dersleriyle mühendislik düşüncesini oluşturdum. İlk konsol uygulamalarımı ve takım çalışması projelerimi tamamladım.",
          metric: "Temel mühendislik dersleri · 2 dönem projesi",
        },
        "2023": {
          period: "Girne Üniversitesi — 2. Yıl",
          title: "Web Geliştirmeye Geçiş",
          highlight:
            "Veritabanı yönetimi ve web teknolojileri dersleriyle frontend–backend ayrımını öğrendim. REST API mantığını kavrayarak ilk tam yığın (full-stack) ödev projelerimi geliştirdim.",
          metric: "İlk web projeleri · Veritabanı tasarımı",
        },
        "2024": {
          period: "Girne Üniversitesi — 3. Yıl",
          title: "Uygulama Geliştirme Dönemi",
          highlight:
            "Araç kiralama ve spor salonu randevu uygulamalarını sıfırdan tasarlayıp geliştirdim. Kullanıcı yönetimi, rezervasyon akışları ve admin panellerini uçtan uca hayata geçirdim.",
          metric: "2 ana proje · Full-stack geliştirme",
        },
        "2025": {
          period: "Girne Üniversitesi — 4. Sınıf",
          title: "Bitirme & Profesyonelleşme",
          highlight:
            "Son sınıfta mevcut projelerimi iyileştiriyor, yeni iş uygulamaları geliştiriyor ve bitirme projesi hazırlığı yapıyorum. Temiz kod, test edilebilir mimari ve kullanıcı deneyimi odaklı yaklaşım benimsiyorum.",
          metric: "Devam ediyor · Staj & iş birliği açık",
        },
      },
    },
    projects: {
      tag: "Vaka Analizi",
      title: "Projeler",
      desc: "Her proje bir problem, bir çözüm ve ölçülebilir bir sonuç hikayesidir.",
      problem: "Problem",
      solution: "Çözüm",
      result: "Sonuç",
      demo: "Canlı Demo",
      github: "GitHub",
      screenshotPlaceholder: "Ekran görüntüsü eklenecek",
      items: {
        "car-rental": {
          title: "Araç Kiralama Uygulaması",
          subtitle: "Online Rezervasyon ve Filo Yönetim Sistemi",
          problem:
            "Küçük ölçekli kiralama firmaları araç müsaitliğini telefon veya defter üzerinden takip ediyordu; çakışan rezervasyonlar ve manuel süreçler hem müşteri memnuniyetini hem operasyon verimliliğini düşürüyordu.",
          solution:
            "Araç listeleme, tarih bazlı müsaitlik kontrolü, online rezervasyon ve admin paneli içeren full-stack bir uygulama geliştirdim. Kullanıcı kaydı, ödeme öncesi rezervasyon akışı ve filo yönetimi modüllerini REST API üzerinden entegre ettim.",
          result:
            "Rezervasyon süreci tek platformda toplandı; müsaitlik kontrolü otomatikleşerek çakışma riski ortadan kalktı. Proje ders kapsamında tam puan aldı ve portföyümün öne çıkan çalışmalarından biri oldu.",
        },
        "gym-booking": {
          title: "Spor Salonu Randevu Uygulaması",
          subtitle: "Antrenör ve Seans Rezervasyon Platformu",
          problem:
            "Spor salonlarında antrenör seansları WhatsApp veya telefonla ayarlanıyordu; iptal edilen seanslar takip edilemiyor, salon doluluk oranı verimli yönetilemiyordu.",
          solution:
            "Üyelerin antrenör seçebildiği, tarih ve saat bazlı randevu alabildiği bir web uygulaması tasarladım. Admin paneli ile seans takibi, üye yönetimi ve randevu onay/iptal akışlarını tek sistemde birleştirdim.",
          result:
            "Randevu süreci dijitalleşti; salon personelinin manuel koordinasyon yükü azaldı ve üyeler 7/24 online rezervasyon yapabilir hale geldi.",
        },
        "web-apps": {
          title: "İş Süreci Web Uygulamaları",
          subtitle: "Yönetim Paneli ve CRUD Tabanlı Sistemler",
          problem:
            "Üniversite ve kişisel projeler kapsamında farklı sektörlerin veri yönetimi ihtiyaçları vardı; her biri için tekrar kullanılabilir, ölçeklenebilir bir yapı gerekiyordu.",
          solution:
            "Modüler mimari ile kullanıcı yetkilendirme, CRUD işlemleri ve raporlama ekranları içeren birden fazla web uygulaması geliştirdim. Ortak bileşen kütüphanesi ve API katmanı sayesinde geliştirme süresini kısalttım.",
          result:
            "Farklı domainlere uyarlanabilen bir geliştirme yaklaşımı oluşturdum; her yeni proje öncekilerden öğrendiklerimle daha hızlı tamamlandı.",
        },
      },
    },
    skills: {
      tag: "Yetkinlik Haritası",
      title: "Araçlar & Diller",
      desc: "Yüzde barları yerine — hangi projede, ne kadar süreyle aktif kullandığım.",
      categories: {
        language: "Dil",
        frontend: "Frontend",
        backend: "Backend",
        database: "Veritabanı",
        hardware: "Donanım",
        devops: "DevOps",
        architecture: "Mimari",
        tool: "Araç",
      },
      items: {
        javascript: { projects: ["Araç Kiralama", "Randevu Uygulaması", "Web Projeleri"] },
        react: { projects: ["Araç Kiralama", "Randevu Uygulaması", "Bu Portföy"] },
        nodejs: { projects: ["Araç Kiralama", "REST API Projeleri"] },
        sql: { projects: ["Tüm Web Uygulamaları"] },
        htmlcss: { projects: ["Tüm Projeler"] },
        java: { projects: ["Üniversite Projeleri", "OOP Dersleri"] },
        git: { projects: ["Tüm Projeler"] },
        restapi: { projects: ["Araç Kiralama", "Randevu Sistemi"] },
      },
    },
    library: {
      tag: "Düşünce Köşesi",
      title: "Dijital Kütüphane",
      desc: "Şu an okuduklarım, takip ettiğim trendler ve üzerine düşündüğüm fikirler.",
      types: { reading: "Okuma", trend: "Trend", thought: "Düşünce" },
      statuses: {
        reading: "Okunuyor",
        following: "Takip Ediliyor",
        thinking: "Üzerinde Düşünüyorum",
      },
      items: {
        "clean-code": {
          title: "Clean Code",
          author: "Robert C. Martin",
          note: "Okunabilir ve sürdürülebilir kod yazma prensiplerini projelerime uygulamak için yeniden gözden geçiriyorum.",
        },
        "fullstack-trend": {
          title: "Full-Stack Web Mimarileri",
          author: "Sektör Trendi",
          note: "React + Node.js ekosistemindeki server actions, API tasarım kalıpları ve modern auth çözümlerini takip ediyorum.",
        },
        "user-first": {
          title: "Kullanıcı Önce Tasarım",
          author: "Kişisel Not",
          note: "Bir özelliği kodlamadan önce kullanıcının gerçek akışını haritalamak — gereksiz karmaşıklığı baştan elemek.",
        },
        "ddia": {
          title: "Designing Data-Intensive Applications",
          author: "Martin Kleppmann",
          note: "Bitirme projesi için veri modelleme ve ölçeklenebilir sistem tasarımı konularında referans kaynak.",
        },
      },
    },
    contact: {
      title: "Birlikte üretelim.",
      text: "Proje fikirleri, staj veya iş birliği için her zaman açığım.",
      email: "E-posta",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    footer: {
      note: "Ağırbaşlı Yenilikçilik",
    },
  },

  en: {
    meta: {
      description: "Selim Dibek — Software Engineering Portfolio, Girne University",
      title: "Portfolio | Selim Dibek",
    },
    nav: {
      timeline: "Timeline",
      projects: "Projects",
      skills: "Skills",
      library: "Library",
      contact: "Contact",
      cv: "Download CV",
      theme: "Toggle theme",
      menu: "Menu",
      lang: "Change language",
    },
    hero: {
      badge: "Preparing graduation project",
      tagline:
        "Turning real needs into usable software — solving with code is my approach.",
      subtitle:
        "I build web and mobile applications; full-stack projects including car rental, booking systems, and business process digitization.",
      ctaProjects: "View Case Studies",
      ctaTimeline: "Timeline",
      scroll: "Scroll down",
      photoAlt: "Selim Dibek profile photo",
      photoPlaceholder: "Photo coming soon",
      metrics: {
        projects: "Completed Projects",
        experience: "Years of Experience",
        stack: "Active Technologies",
      },
    },
    timeline: {
      tag: "Smart CV",
      title: "Timeline",
      desc: "Not a chronological list — click each period to discover that year's biggest achievement.",
      placeholderTitle: "Select a period",
      placeholderDesc: "Click points on the timeline to view details.",
      ariaLabel: "Career timeline",
      items: {
        "2022": {
          period: "Girne University — Year 1",
          title: "Entering Software Engineering",
          highlight:
            "Built engineering thinking through programming fundamentals, algorithms, and OOP. Completed my first console apps and team projects.",
          metric: "Core engineering courses · 2 semester projects",
        },
        "2023": {
          period: "Girne University — Year 2",
          title: "Transition to Web Development",
          highlight:
            "Learned frontend–backend separation through database management and web technologies. Built my first full-stack assignment projects with REST API design.",
          metric: "First web projects · Database design",
        },
        "2024": {
          period: "Girne University — Year 3",
          title: "Application Development Phase",
          highlight:
            "Designed and built car rental and gym booking apps from scratch. Implemented user management, reservation flows, and admin panels end-to-end.",
          metric: "2 major projects · Full-stack development",
        },
        "2025": {
          period: "Girne University — Year 4",
          title: "Graduation & Professional Growth",
          highlight:
            "In my final year I'm improving existing projects, building new business apps, and preparing my graduation project with a focus on clean code and UX.",
          metric: "Ongoing · Open to internships & collaboration",
        },
      },
    },
    projects: {
      tag: "Case Study",
      title: "Projects",
      desc: "Every project is a story of problem, solution, and measurable outcome.",
      problem: "Problem",
      solution: "Solution",
      result: "Result",
      demo: "Live Demo",
      github: "GitHub",
      screenshotPlaceholder: "Screenshot coming soon",
      items: {
        "car-rental": {
          title: "Car Rental Application",
          subtitle: "Online Reservation & Fleet Management System",
          problem:
            "Small rental companies tracked vehicle availability by phone or notebook; overlapping reservations and manual processes hurt both satisfaction and efficiency.",
          solution:
            "Built a full-stack app with vehicle listing, date-based availability, online booking, and admin panel. Integrated registration, pre-payment booking flow, and fleet management via REST API.",
          result:
            "Reservation process unified on one platform; automatic availability checks eliminated conflicts. Earned full marks and became a portfolio highlight.",
        },
        "gym-booking": {
          title: "Gym Appointment App",
          subtitle: "Trainer & Session Booking Platform",
          problem:
            "Gym trainer sessions were booked via WhatsApp or phone; cancellations weren't tracked and occupancy was poorly managed.",
          solution:
            "Designed a web app where members pick trainers and book by date/time. Combined session tracking, member management, and approve/cancel flows in one admin system.",
          result:
            "Booking went digital; staff coordination load dropped and members can reserve online 24/7.",
        },
        "web-apps": {
          title: "Business Process Web Apps",
          subtitle: "Admin Panels & CRUD-Based Systems",
          problem:
            "University and personal projects needed reusable, scalable data management across different domains.",
          solution:
            "Built multiple web apps with modular auth, CRUD, and reporting. Shared component library and API layer shortened development time.",
          result:
            "Established an adaptable approach; each new project shipped faster building on previous learnings.",
        },
      },
    },
    skills: {
      tag: "Skills Map",
      title: "Tools & Languages",
      desc: "No percentage bars — which projects I used them in and for how long.",
      categories: {
        language: "Language",
        frontend: "Frontend",
        backend: "Backend",
        database: "Database",
        hardware: "Hardware",
        devops: "DevOps",
        architecture: "Architecture",
        tool: "Tool",
      },
      items: {
        javascript: { projects: ["Car Rental", "Booking App", "Web Projects"] },
        react: { projects: ["Car Rental", "Booking App", "This Portfolio"] },
        nodejs: { projects: ["Car Rental", "REST API Projects"] },
        sql: { projects: ["All Web Applications"] },
        htmlcss: { projects: ["All Projects"] },
        java: { projects: ["University Projects", "OOP Courses"] },
        git: { projects: ["All Projects"] },
        restapi: { projects: ["Car Rental", "Booking System"] },
      },
    },
    library: {
      tag: "Thinking Corner",
      title: "Digital Library",
      desc: "What I'm reading, trends I follow, and ideas I'm exploring.",
      types: { reading: "Reading", trend: "Trend", thought: "Thought" },
      statuses: {
        reading: "Reading",
        following: "Following",
        thinking: "Thinking About",
      },
      items: {
        "clean-code": {
          title: "Clean Code",
          author: "Robert C. Martin",
          note: "Revisiting readable, maintainable code principles to apply in my projects.",
        },
        "fullstack-trend": {
          title: "Full-Stack Web Architectures",
          author: "Industry Trend",
          note: "Following server actions, API design patterns, and modern auth in the React + Node.js ecosystem.",
        },
        "user-first": {
          title: "User-First Design",
          author: "Personal Note",
          note: "Mapping the user's real flow before coding a feature — eliminating unnecessary complexity upfront.",
        },
        "ddia": {
          title: "Designing Data-Intensive Applications",
          author: "Martin Kleppmann",
          note: "Reference for data modeling and scalable system design for my graduation project.",
        },
      },
    },
    contact: {
      title: "Let's build together.",
      text: "Always open to project ideas, internships, or collaboration.",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    footer: {
      note: "Measured Innovation",
    },
  },
};
