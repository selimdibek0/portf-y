import "./style.css";
import { loadSiteContent } from "./contentLoader.js";

let currentLang = localStorage.getItem("lang") || "tr";
let content = null;
let translations = null;
let profile = null;
let timeline = null;
let projects = null;
let skills = null;
let library = null;
let typeIcons = null;

function t(path) {
  const keys = path.split(".");
  let val = translations[currentLang];
  for (const key of keys) val = val?.[key];
  return val ?? path;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  render();
}

// ─── Theme ───────────────────────────────────────────────────────────────────
const themeToggle = document.getElementById("theme-toggle");
const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

setTheme(storedTheme || (prefersDark ? "dark" : "light"));
themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ─── Navigation ──────────────────────────────────────────────────────────────
const header = document.getElementById("header");
const navBurger = document.getElementById("nav-burger");
const navLinks = document.getElementById("nav-links");

navBurger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  navBurger.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
});

document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
  btn.addEventListener("click", () => setLang(btn.dataset.lang));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

function formatTagline(text) {
  const match = text.match(/— (.+?) (benim|is my)/);
  if (match) return text.replace(match[0], `— <em>${match[1]}</em> ${match[2]}`);
  return text;
}

function renderScreenshots(project, placeholder) {
  const shots = (project.screenshots || []).filter(Boolean);
  const items = shots.length ? shots : [null];
  return `
    <div class="project-card__gallery">
      ${items
        .map((src, i) => {
          if (src) {
            return `<figure class="project-card__shot"><img src="${src}" alt="${t(`projects.items.${project.id}.title`)} ${i + 1}" loading="lazy" /></figure>`;
          }
          return `
            <figure class="project-card__shot project-card__shot--placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>${placeholder}</span>
            </figure>`;
        })
        .join("")}
    </div>`;
}

function renderProjectLinks(project) {
  const links = [];
  if (project.demo) {
    links.push(`<a href="${project.demo}" class="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer">${t("projects.demo")}</a>`);
  } else {
    links.push(`<span class="btn btn--sm btn--disabled">${t("projects.demo")}</span>`);
  }
  if (project.github) {
    links.push(`<a href="${project.github}" class="btn btn--ghost btn--sm" target="_blank" rel="noopener noreferrer">${t("projects.github")}</a>`);
  } else {
    links.push(`<span class="btn btn--sm btn--disabled btn--ghost">${t("projects.github")}</span>`);
  }
  return `<div class="project-card__links">${links.join("")}</div>`;
}

function getCvHref() {
  const url = profile.cvPdf;
  if (url && url.endsWith(".pdf") && url !== "/cv.pdf") return url;
  return "/cv.html?print=1";
}

function setupCvLink(el) {
  const href = getCvHref();
  el.href = href;
  if (href.endsWith(".pdf")) {
    el.setAttribute("download", "");
    el.removeAttribute("target");
  } else {
    el.removeAttribute("download");
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  }
}

function renderNav() {
  document.querySelector(".nav__logo").textContent = profile.initials;
  document.querySelector('[data-i18n="nav.timeline"]').textContent = t("nav.timeline");
  document.querySelector('[data-i18n="nav.projects"]').textContent = t("nav.projects");
  document.querySelector('[data-i18n="nav.skills"]').textContent = t("nav.skills");
  document.querySelector('[data-i18n="nav.library"]').textContent = t("nav.library");
  document.querySelector('[data-i18n="nav.contact"]').textContent = t("nav.contact");
  document.querySelector('[data-i18n="nav.cv"]').textContent = t("nav.cv");
  themeToggle.setAttribute("aria-label", t("nav.theme"));
  navBurger.setAttribute("aria-label", t("nav.menu"));
  const cvBtn = document.getElementById("cv-download");
  setupCvLink(cvBtn);
}

function renderHero() {
  const photoEl = document.getElementById("hero-photo");
  const photoInner = photoEl.querySelector(".hero__photo-inner");

  document.querySelector(".hero__eyebrow").textContent = profile.field[currentLang];
  document.querySelector(".hero__title").innerHTML = formatTagline(t("hero.tagline"));
  document.querySelector(".hero__subtitle").textContent = `${profile.name} · ${t("hero.subtitle")}`;

  if (profile.photo) {
    photoInner.innerHTML = `<img src="${profile.photo}" alt="${t("hero.photoAlt")}" class="hero__photo-img" />`;
    photoEl.classList.remove("hero__photo--empty");
  } else {
    photoInner.innerHTML = `
      <span class="hero__photo-initials">${profile.initials}</span>
      <span class="hero__photo-hint">${t("hero.photoPlaceholder")}</span>`;
    photoEl.classList.add("hero__photo--empty");
  }

  document.getElementById("hero-metrics").innerHTML = profile.metrics
    .map(
      (m) => `
      <div class="hero__metric">
        <span class="hero__metric-value">${m.value}</span>
        <span class="hero__metric-label">${t(`hero.metrics.${m.key}`)}</span>
      </div>`
    )
    .join("");

  document.querySelector('[data-i18n="hero.ctaProjects"]').textContent = t("hero.ctaProjects");
  document.querySelector('[data-i18n="hero.ctaTimeline"]').textContent = t("hero.ctaTimeline");
  document.querySelector('[data-i18n="hero.scroll"]').textContent = t("hero.scroll");
}

let activeTimelineIndex = -1;
let timelineControlsBound = false;

const TIMELINE_ICONS = ["🎓", "🌐", "⚡", "🚀"];

function getTimelineIcon(item, index) {
  return item.icon || TIMELINE_ICONS[index % TIMELINE_ICONS.length];
}

function updateTimelineProgress(index) {
  const fill = document.getElementById("timeline-progress");
  if (!fill) return;
  if (timeline.length <= 1) {
    fill.style.width = timeline.length === 1 ? "100%" : "0%";
    return;
  }
  const pct = (index / (timeline.length - 1)) * 100;
  fill.style.width = `${pct}%`;
}

function updateTimelineNav(index) {
  const prev = document.getElementById("timeline-prev");
  const next = document.getElementById("timeline-next");
  if (prev) prev.disabled = index <= 0;
  if (next) next.disabled = index >= timeline.length - 1;
}

function selectTimeline(index, { scroll = true } = {}) {
  if (!timeline.length) return;
  const i = Math.max(0, Math.min(index, timeline.length - 1));
  activeTimelineIndex = i;
  const item = timeline[i];
  const track = document.getElementById("timeline-track");

  track?.querySelectorAll(".timeline__node").forEach((node, ni) => {
    const isActive = ni === i;
    node.classList.toggle("active", isActive);
    node.setAttribute("aria-selected", isActive ? "true" : "false");
    node.tabIndex = isActive ? 0 : -1;
    if (isActive && scroll) {
      node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });

  updateTimelineProgress(i);
  updateTimelineNav(i);
  renderTimelineDetail(item, i);
}

function renderTimelineDetail(item, index) {
  const data = t(`timeline.items.${item.id}`);
  const detail = document.getElementById("timeline-detail");
  const icon = getTimelineIcon(item, index);

  detail.classList.remove("active");
  detail.innerHTML = `
    <div class="timeline__detail-content">
      <div class="timeline__detail-head">
        <span class="timeline__detail-icon" aria-hidden="true">${icon}</span>
        <div>
          <span class="timeline__detail-period">${data.period}</span>
          <h3 class="timeline__detail-title">${data.title}</h3>
        </div>
      </div>
      <p class="timeline__detail-highlight">${data.highlight}</p>
      <div class="timeline__detail-tags">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <div class="timeline__detail-metric">
        <span class="timeline__detail-metric-label">${t("timeline.metricLabel")}</span>
        <strong>${data.metric}</strong>
      </div>
    </div>`;

  requestAnimationFrame(() => detail.classList.add("active"));
}

function bindTimelineControls() {
  if (timelineControlsBound) return;
  timelineControlsBound = true;

  document.getElementById("timeline-prev")?.addEventListener("click", () => {
    selectTimeline(activeTimelineIndex - 1);
  });
  document.getElementById("timeline-next")?.addEventListener("click", () => {
    selectTimeline(activeTimelineIndex + 1);
  });

  document.getElementById("timeline-panel")?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectTimeline(activeTimelineIndex - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectTimeline(activeTimelineIndex + 1);
    }
  });
}

function renderTimeline() {
  document.querySelector('[data-i18n="timeline.tag"]').textContent = t("timeline.tag");
  document.querySelector('[data-i18n="timeline.title"]').textContent = t("timeline.title");
  document.querySelector('[data-i18n="timeline.desc"]').textContent = t("timeline.desc");

  const track = document.getElementById("timeline-track");
  const prevBtn = document.getElementById("timeline-prev");
  const nextBtn = document.getElementById("timeline-next");
  const prevLabel = t("timeline.prevLabel");
  const nextLabel = t("timeline.nextLabel");

  if (prevBtn && prevLabel !== "timeline.prevLabel") prevBtn.setAttribute("aria-label", prevLabel);
  if (nextBtn && nextLabel !== "timeline.nextLabel") nextBtn.setAttribute("aria-label", nextLabel);

  const previousId = activeTimelineIndex >= 0 ? timeline[activeTimelineIndex]?.id : null;
  track.innerHTML = "";
  track.setAttribute("aria-label", t("timeline.ariaLabel"));

  timeline.forEach((item, i) => {
    const data = t(`timeline.items.${item.id}`);
    const btn = document.createElement("button");
    const isCurrent = i === timeline.length - 1;
    btn.className = "timeline__node" + (isCurrent ? " timeline__node--current" : "");
    btn.dataset.id = item.id;
    btn.dataset.index = String(i);
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", "false");
    btn.tabIndex = -1;
    btn.innerHTML = `
      <span class="timeline__node-icon" aria-hidden="true">${getTimelineIcon(item, i)}</span>
      <span class="timeline__node-year">${item.year}</span>
      <span class="timeline__node-dot"></span>
      <span class="timeline__node-label">${data.period}</span>`;
    btn.addEventListener("click", () => selectTimeline(i));
    track.appendChild(btn);
  });

  bindTimelineControls();

  const restoreIndex = previousId
    ? Math.max(0, timeline.findIndex((item) => item.id === previousId))
    : timeline.length - 1;
  selectTimeline(restoreIndex, { scroll: false });
}

function renderProjects() {
  document.querySelector('[data-i18n="projects.tag"]').textContent = t("projects.tag");
  document.querySelector('[data-i18n="projects.title"]').textContent = t("projects.title");
  document.querySelector('[data-i18n="projects.desc"]').textContent = t("projects.desc");

  const grid = document.getElementById("projects-grid");
  grid.innerHTML = "";
  projects.forEach((project, i) => {
    const data = t(`projects.items.${project.id}`);
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.id = `project-${project.id}`;
    card.style.transitionDelay = `${i * 0.08}s`;
    card.innerHTML = `
      ${renderScreenshots(project, t("projects.screenshotPlaceholder"))}
      <header class="project-card__header">
        <span class="project-card__year">${project.year}</span>
        <h3 class="project-card__title">${data.title}</h3>
        <p class="project-card__subtitle">${data.subtitle}</p>
      </header>
      ${renderProjectLinks(project)}
      <div class="project-card__phases">
        <div class="phase"><span class="phase__label">${t("projects.problem")}</span><p class="phase__text">${data.problem}</p></div>
        <div class="phase"><span class="phase__label">${t("projects.solution")}</span><p class="phase__text">${data.solution}</p></div>
        <div class="phase phase--result"><span class="phase__label">${t("projects.result")}</span><p class="phase__text">${data.result}</p></div>
      </div>
      <footer class="project-card__footer">${project.stack.map((s) => `<span class="tag tag--outline">${s}</span>`).join("")}</footer>`;
    grid.appendChild(card);
    revealObserver.observe(card);
  });
}

function renderSkills() {
  document.querySelector('[data-i18n="skills.tag"]').textContent = t("skills.tag");
  document.querySelector('[data-i18n="skills.title"]').textContent = t("skills.title");
  document.querySelector('[data-i18n="skills.desc"]').textContent = t("skills.desc");

  const map = document.getElementById("skills-map");
  map.innerHTML = "";
  skills.forEach((skill, i) => {
    const skillData = t(`skills.items.${skill.id}`);
    const card = document.createElement("div");
    card.className = `skill-node skill-node--${skill.intensity} reveal`;
    card.style.transitionDelay = `${i * 0.05}s`;
    card.innerHTML = `
      <div class="skill-node__header">
        <h4 class="skill-node__name">${skill.name}</h4>
        <span class="skill-node__category">${t(`skills.categories.${skill.category}`)}</span>
      </div>
      <div class="skill-node__duration">
        <span class="skill-node__duration-bar"></span>
        <span class="skill-node__duration-text">${skill.duration}</span>
      </div>
      <ul class="skill-node__projects">${skillData.projects.map((p) => `<li>${p}</li>`).join("")}</ul>`;
    map.appendChild(card);
    revealObserver.observe(card);
  });
}

function renderLibrary() {
  document.querySelector('[data-i18n="library.tag"]').textContent = t("library.tag");
  document.querySelector('[data-i18n="library.title"]').textContent = t("library.title");
  document.querySelector('[data-i18n="library.desc"]').textContent = t("library.desc");

  const grid = document.getElementById("library-grid");
  grid.innerHTML = "";
  library.forEach((item, i) => {
    const data = t(`library.items.${item.id}`);
    const card = document.createElement("article");
    card.className = "library-card reveal";
    card.style.transitionDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="library-card__type"><span aria-hidden="true">${typeIcons[item.type]}</span>${t(`library.types.${item.type}`)}</div>
      <h3 class="library-card__title">${data.title}</h3>
      <p class="library-card__author">${data.author}</p>
      <p class="library-card__note">${data.note}</p>
      <span class="library-card__status">${t(`library.statuses.${item.status}`)}</span>`;
    grid.appendChild(card);
    revealObserver.observe(card);
  });
}

function renderContact() {
  document.querySelector('[data-i18n="contact.title"]').textContent = t("contact.title");
  document.querySelector('[data-i18n="contact.text"]').textContent = t("contact.text");

  const contactLinks = document.getElementById("contact-links");
  contactLinks.innerHTML = "";
  [
    { label: t("contact.email"), href: `mailto:${profile.contact.email}`, icon: "✉" },
    profile.contact.github && { label: t("contact.github"), href: profile.contact.github, icon: "⌥" },
    profile.contact.linkedin && { label: t("contact.linkedin"), href: profile.contact.linkedin, icon: "in" },
  ]
    .filter(Boolean)
    .forEach((link) => {
      const a = document.createElement("a");
      a.className = "contact__link";
      a.href = link.href;
      if (link.href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.innerHTML = `<span class="contact__link-icon">${link.icon}</span>${link.label}`;
      contactLinks.appendChild(a);
    });

  const cvLink = document.createElement("a");
  cvLink.className = "contact__link contact__link--cv";
  setupCvLink(cvLink);
  cvLink.innerHTML = `<span class="contact__link-icon">↓</span>${t("nav.cv")}`;
  contactLinks.appendChild(cvLink);
}

function renderFooter() {
  document.getElementById("year").textContent = new Date().getFullYear();
  document.querySelector(".footer__name").textContent = `© ${new Date().getFullYear()} ${profile.name}`;
  document.querySelector('[data-i18n="footer.note"]').textContent = t("footer.note");
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').content = t("meta.description");
}

function render() {
  if (!content) return;
  renderNav();
  renderHero();
  renderTimeline();
  renderProjects();
  renderSkills();
  renderLibrary();
  renderContact();
  renderFooter();
}

document.getElementById("nav-links").addEventListener("click", (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.querySelector(anchor.getAttribute("href"));
  if (target) {
    e.preventDefault();
    navLinks.classList.remove("open");
    navBurger.classList.remove("active");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

async function init() {
  try {
    content = await loadSiteContent();
    ({ profile, timeline, projects, skills, library, translations, typeIcons } = content);
    document.documentElement.lang = currentLang;
    document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
    render();
  } catch (err) {
    document.body.innerHTML = `<div style="padding:2rem;text-align:center;font-family:sans-serif"><h1>İçerik yüklenemedi</h1><p>${err.message}</p><p>API sunucusunu başlatın: <code>npm run server</code></p></div>`;
  }
}

init();
