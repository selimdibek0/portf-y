/** site.json → render formatına dönüştürür */
export const typeIcons = {
  reading: "📖",
  trend: "📡",
  thought: "💭",
};

export function normalizeContent(site) {
  const tr = structuredClone(site.ui.tr);
  const en = structuredClone(site.ui.en);

  tr.hero = { ...tr.hero, badge: site.profile.badge.tr, tagline: site.profile.tagline.tr, subtitle: site.profile.subtitle.tr };
  en.hero = { ...en.hero, badge: site.profile.badge.en, tagline: site.profile.tagline.en, subtitle: site.profile.subtitle.en };

  tr.timeline.items = {};
  en.timeline.items = {};
  site.timeline.forEach((item) => {
    tr.timeline.items[item.id] = {
      period: item.period.tr,
      title: item.title.tr,
      highlight: item.highlight.tr,
      metric: item.metric.tr,
    };
    en.timeline.items[item.id] = {
      period: item.period.en,
      title: item.title.en,
      highlight: item.highlight.en,
      metric: item.metric.en,
    };
  });

  tr.projects.items = {};
  en.projects.items = {};
  site.projects.forEach((p) => {
    tr.projects.items[p.id] = {
      title: p.title.tr,
      subtitle: p.subtitle.tr,
      problem: p.problem.tr,
      solution: p.solution.tr,
      result: p.result.tr,
    };
    en.projects.items[p.id] = {
      title: p.title.en,
      subtitle: p.subtitle.en,
      problem: p.problem.en,
      solution: p.solution.en,
      result: p.result.en,
    };
  });

  tr.skills.items = {};
  en.skills.items = {};
  site.skills.forEach((s) => {
    tr.skills.items[s.id] = { projects: s.projects.tr };
    en.skills.items[s.id] = { projects: s.projects.en };
  });

  tr.library.items = {};
  en.library.items = {};
  site.library.forEach((l) => {
    tr.library.items[l.id] = { title: l.title.tr, author: l.author.tr, note: l.note.tr };
    en.library.items[l.id] = { title: l.title.en, author: l.author.en, note: l.note.en };
  });

  return {
    profile: site.profile,
    timeline: site.timeline.map(({ id, year, tags, icon }) => ({ id, year, tags, icon })),
    projects: site.projects.map(({ id, year, stack, screenshots, demo, github }) => ({
      id,
      year,
      stack,
      screenshots,
      demo,
      github,
    })),
    skills: site.skills,
    library: site.library.map(({ id, type, status }) => ({ id, type, status })),
    translations: { tr, en },
    typeIcons,
    updatedAt: site.updatedAt,
  };
}

export async function loadSiteContent() {
  const isLocal =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const sources = isLocal
    ? ["/api/content", "/content/site.json"]
    : ["/content/site.json", "/api/content"];
  for (const url of sources) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const site = await res.json();
        return normalizeContent(site);
      }
    } catch {
      /* sonraki kaynağı dene */
    }
  }
  throw new Error("İçerik yüklenemedi");
}
