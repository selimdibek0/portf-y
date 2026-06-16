/**
 * Yapısal veriler — linkler, görseller, metrikler.
 * Metin içerikleri src/i18n.js dosyasındadır.
 */

export const profile = {
  initials: "S.D.",
  name: "Selim Dibek",
  field: {
    tr: "Girne Üniversitesi · Yazılım Mühendisliği · 4. Sınıf",
    en: "Girne University · Software Engineering · Year 4",
  },
  /** public/images/profile.jpg yoluna fotoğrafınızı ekleyin; null ise placeholder gösterilir */
  photo: null,
  /** public/cv.pdf dosyasına CV'nizi ekleyin */
  cvPdf: "/cv.pdf",
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
};

export const timeline = [
  {
    id: "2022",
    year: "2022",
    tags: ["Java", "Algoritma", "OOP"],
  },
  {
    id: "2023",
    year: "2023",
    tags: ["HTML/CSS", "JavaScript", "SQL"],
  },
  {
    id: "2024",
    year: "2024",
    tags: ["React", "Node.js", "SQL", "REST API"],
  },
  {
    id: "2025",
    year: "2025",
    tags: ["Full-Stack", "UI/UX", "Bitirme Projesi"],
  },
];

export const projects = [
  {
    id: "car-rental",
    year: "2024",
    stack: ["React", "Node.js", "Express", "SQL"],
    /** public/images/projects/car-rental/ klasörüne görseller ekleyin */
    screenshots: [
      null,
      null,
      null,
    ],
    demo: null,
    github: null,
  },
  {
    id: "gym-booking",
    year: "2024",
    stack: ["React", "JavaScript", "REST API", "SQL"],
    screenshots: [
      null,
      null,
      null,
    ],
    demo: null,
    github: null,
  },
  {
    id: "web-apps",
    year: "2023–2025",
    stack: ["JavaScript", "React", "SQL", "Git"],
    screenshots: [
      null,
      null,
    ],
    demo: null,
    github: null,
  },
];

export const skills = [
  { id: "javascript", name: "JavaScript", category: "language", duration: "3+ yıl", intensity: "high" },
  { id: "react", name: "React", category: "frontend", duration: "18 ay", intensity: "high" },
  { id: "nodejs", name: "Node.js", category: "backend", duration: "14 ay", intensity: "high" },
  { id: "sql", name: "SQL", category: "database", duration: "2+ yıl", intensity: "high" },
  { id: "htmlcss", name: "HTML / CSS", category: "frontend", duration: "3+ yıl", intensity: "medium" },
  { id: "java", name: "Java", category: "language", duration: "2 yıl", intensity: "medium" },
  { id: "git", name: "Git", category: "tool", duration: "3+ yıl", intensity: "high" },
  { id: "restapi", name: "REST API", category: "architecture", duration: "12 ay", intensity: "medium" },
];

export const library = [
  { id: "clean-code", type: "reading", status: "reading" },
  { id: "fullstack-trend", type: "trend", status: "following" },
  { id: "user-first", type: "thought", status: "thinking" },
  { id: "ddia", type: "reading", status: "reading" },
];

export const typeIcons = {
  reading: "📖",
  trend: "📡",
  thought: "💭",
};
