import "./admin.css";

let site = null;
let media = [];
let currentSection = "dashboard";
let saveTimeout = null;
let saveQueue = Promise.resolve();
let isDirty = false;

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

let isAdminAuthenticated = false;

function assetUrl(path) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  return path;
}

async function api(path, options = {}) {
  let lastError = null;

  try {
    const res = await fetch(path, { credentials: "include", ...options });
    let data = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("json")) data = await res.json();

    if (res.status === 401 && !path.includes("/login") && !path.includes("/setup")) {
      isAdminAuthenticated = false;
      renderLogin("Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
      throw new Error("Giriş gerekli");
    }

    if (!res.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`);
    }

    return data;
  } catch (err) {
    lastError = err;
    const isNetwork =
      err.message === "Failed to fetch" ||
      err.name === "TypeError" ||
      err.message.includes("fetch");
    if (isNetwork) {
      throw new Error(
        "Sunucuya bağlanılamadı. Sunucunun çalıştığından emin olun ve sayfayı yenileyin."
      );
    }
    throw err;
  }
}

async function uploadFile(file, target = "") {
  const fd = new FormData();
  fd.append("file", file);
  if (target) fd.append("target", target);
  return api("/api/upload", { method: "POST", body: fd });
}

function bi(tr = "", en = "") {
  return { tr, en };
}

function markDirty() {
  isDirty = true;
  const badge = $("#save-status");
  if (badge) {
    badge.textContent = "Kaydedilmemiş değişiklikler";
    badge.className = "save-status save-status--dirty";
  }
}

function markSaved() {
  isDirty = false;
  const badge = $("#save-status");
  if (badge) {
    badge.textContent = `Son kayıt: ${new Date(site.updatedAt || Date.now()).toLocaleString("tr-TR")}`;
    badge.className = "save-status save-status--saved";
  }
}

async function saveSite({ quiet = false } = {}) {
  const payload = JSON.parse(JSON.stringify(site));
  const saved = await api("/api/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  site = saved;
  markSaved();
  if (!quiet) toast("Site kaydedildi ✓");
  return saved;
}

function enqueueSave(options = {}) {
  saveQueue = saveQueue
    .then(() => saveSite(options))
    .catch((err) => toast(err.message, "error"));
  return saveQueue;
}

function debounceSave() {
  markDirty();
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => enqueueSave({ quiet: true }), 1500);
}

async function uploadShotImage(file, project, shotIndex) {
  if (file.size > 10 * 1024 * 1024) {
    toast("Dosya 10MB'dan büyük olamaz", "error");
    return false;
  }
  try {
    const res = await uploadFile(file);
    if (!project.screenshots) project.screenshots = [];
    project.screenshots[shotIndex] = res.url;
    try { media = await api("/api/media"); } catch { /* medya listesi güncellenemedi */ }
    await enqueueSave({ quiet: true });
    toast("Görsel yüklendi ✓");
    return true;
  } catch (err) {
    toast(err.message, "error");
    return false;
  }
}

function toast(msg, type = "success") {
  const t = document.createElement("div");
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str ?? "";
  return d.innerHTML;
}

function renderLogin(error = "") {
  $("#app").innerHTML = `
    <div class="login">
      <form class="login__card" id="login-form">
        <div class="login__icon" aria-hidden="true">🔒</div>
        <h1>Admin Girişi</h1>
        <p>Portföy sitenizi yönetmek için şifrenizi girin.</p>
        ${error ? `<p class="login__error">${esc(error)}</p>` : ""}
        <label>Şifre
          <div class="password-field">
            <input type="password" name="password" id="login-password" required autofocus minlength="8" placeholder="••••••••" />
            <button type="button" class="password-toggle" id="toggle-password" aria-label="Şifreyi göster">👁</button>
          </div>
        </label>
        <button type="submit" class="btn btn--primary btn--block">Giriş Yap</button>
      </form>
    </div>`;

  $("#toggle-password").onclick = () => {
    const input = $("#login-password");
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    $("#toggle-password").textContent = isHidden ? "🙈" : "👁";
  };

  $("#login-form").onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Giriş yapılıyor...";
    try {
      await api("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: e.target.password.value }),
      });
      await init();
    } catch (err) {
      renderLogin(err.message);
    }
  };
}

function renderSetup() {
  $("#app").innerHTML = `
    <div class="login">
      <form class="login__card" id="setup-form">
        <div class="login__icon" aria-hidden="true">🛡️</div>
        <h1>Şifre Oluştur</h1>
        <p>Admin paneline erişmek için güçlü bir şifre belirleyin.</p>
        <p class="login__hint">En az 8 karakter kullanın. Bu şifreyi kimseyle paylaşmayın.</p>
        <label>Şifre
          <div class="password-field">
            <input type="password" name="password" id="setup-password" required minlength="8" placeholder="Yeni şifre" />
            <button type="button" class="password-toggle" data-target="setup-password">👁</button>
          </div>
        </label>
        <label>Şifre Tekrar
          <div class="password-field">
            <input type="password" name="confirm" id="setup-confirm" required minlength="8" placeholder="Şifreyi tekrar girin" />
            <button type="button" class="password-toggle" data-target="setup-confirm">👁</button>
          </div>
        </label>
        <button type="submit" class="btn btn--primary btn--block">Şifreyi Kaydet ve Giriş Yap</button>
      </form>
    </div>`;

  $$(".password-toggle").forEach((btn) => {
    btn.onclick = () => {
      const input = $(`#${btn.dataset.target}`);
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      btn.textContent = isHidden ? "🙈" : "👁";
    };
  });

  $("#setup-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const password = fd.get("password");
    const confirm = fd.get("confirm");
    if (password !== confirm) {
      toast("Şifreler eşleşmiyor", "error");
      return;
    }
    try {
      await api("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirm }),
      });
      toast("Şifre oluşturuldu ✓");
      await init();
    } catch (err) {
      toast(err.message, "error");
    }
  };
}

function fieldBi(label, obj, key, type = "input") {
  const val = obj[key] || bi();
  const Tag = type === "textarea" ? "textarea" : "input";
  return `
    <div class="field-group">
      <label class="field-label">${label}</label>
      <div class="bi-fields">
        <div class="bi-field">
          <span>🇹🇷 TR</span>
          <${Tag} data-bi="${key}" data-lang="tr" ${type === "textarea" ? 'rows="3"' : ""}>${esc(val.tr)}</${Tag}>
        </div>
        <div class="bi-field">
          <span>🇬🇧 EN</span>
          <${Tag} data-bi="${key}" data-lang="en" ${type === "textarea" ? 'rows="3"' : ""}>${esc(val.en)}</${Tag}>
        </div>
      </div>
    </div>`;
}

function bindBiFields(container, obj) {
  $$("[data-bi]", container).forEach((el) => {
    el.oninput = () => {
      const key = el.dataset.bi;
      const lang = el.dataset.lang;
      if (!obj[key]) obj[key] = bi();
      obj[key][lang] = el.value;
      debounceSave();
    };
  });
}

function renderShell() {
  const sections = [
    { id: "dashboard", icon: "◉", label: "Genel Bakış" },
    { id: "profile", icon: "◎", label: "Profil & Hero" },
    { id: "timeline", icon: "◈", label: "Zaman Tüneli" },
    { id: "projects", icon: "◆", label: "Projeler" },
    { id: "skills", icon: "◇", label: "Yetkinlikler" },
    { id: "library", icon: "◐", label: "Kütüphane" },
    { id: "media", icon: "▣", label: "Medya" },
    { id: "labels", icon: "◑", label: "Site Metinleri" },
    { id: "settings", icon: "⚙", label: "Ayarlar" },
  ];

  $("#app").innerHTML = `
    <div class="admin">
      <aside class="admin__sidebar">
        <div class="admin__brand">
          <strong>Portföy Admin</strong>
          <span>${esc(site.profile.name)}</span>
        </div>
        <nav class="admin__nav">
          ${sections.map((s) => `<button class="admin__nav-btn ${currentSection === s.id ? "active" : ""}" data-section="${s.id}"><span>${s.icon}</span>${s.label}</button>`).join("")}
        </nav>
        <div class="admin__sidebar-footer">
          <a href="/" target="_blank" class="btn btn--ghost btn--sm btn--block">Siteyi Görüntüle ↗</a>
          <button class="btn btn--ghost btn--sm btn--block" id="logout-btn">Çıkış Yap</button>
        </div>
      </aside>
      <main class="admin__main">
        <header class="admin__header">
          <h1 id="section-title"></h1>
          <div class="admin__header-actions">
            <span class="save-status" id="save-status"></span>
            <button class="btn btn--primary" id="save-btn">Kaydet</button>
          </div>
        </header>
        <div class="admin__content" id="content"></div>
      </main>
    </div>`;

  $$(".admin__nav-btn").forEach((btn) => {
    btn.onclick = () => {
      currentSection = btn.dataset.section;
      renderShell();
      renderSection();
    };
  });

  $("#save-btn").onclick = () => enqueueSave();
  $("#logout-btn").onclick = async () => {
    await api("/api/auth/logout", { method: "POST" });
    isAdminAuthenticated = false;
    renderLogin();
  };

  markSaved();
  renderSection();
}

function renderSection() {
  const titles = {
    dashboard: "Genel Bakış",
    profile: "Profil & Hero",
    timeline: "Zaman Tüneli",
    projects: "Projeler",
    skills: "Yetkinlikler",
    library: "Dijital Kütüphane",
    media: "Medya Kütüphanesi",
    labels: "Site Metinleri (TR/EN)",
    settings: "Ayarlar & Yedekleme",
  };
  $("#section-title").textContent = titles[currentSection];

  const renderers = {
    dashboard: renderDashboard,
    profile: renderProfile,
    timeline: renderTimeline,
    projects: renderProjects,
    skills: renderSkills,
    library: renderLibrary,
    media: renderMedia,
    labels: renderLabels,
    settings: renderSettings,
  };
  renderers[currentSection]();
}

function renderDashboard() {
  const c = $("#content");
  c.innerHTML = `
    <div class="stats">
      <div class="stat-card"><span class="stat-card__value">${site.projects.length}</span><span class="stat-card__label">Proje</span></div>
      <div class="stat-card"><span class="stat-card__value">${site.timeline.length}</span><span class="stat-card__label">Zaman Dönemi</span></div>
      <div class="stat-card"><span class="stat-card__value">${site.skills.length}</span><span class="stat-card__label">Yetkinlik</span></div>
      <div class="stat-card"><span class="stat-card__value">${media.length}</span><span class="stat-card__label">Medya Dosyası</span></div>
    </div>
    <div class="card">
      <h3>Hızlı İşlemler</h3>
      <div class="quick-actions">
        <button class="btn btn--ghost" id="qa-projects">Projelere Git</button>
        <button class="btn btn--ghost" id="qa-media">Medya Yükle</button>
        <a href="/" target="_blank" class="btn btn--ghost">Siteyi Önizle</a>
      </div>
    </div>
    <div class="card">
      <h3>Son Güncelleme</h3>
      <p>${site.updatedAt ? new Date(site.updatedAt).toLocaleString("tr-TR") : "Henüz kaydedilmedi"}</p>
    </div>`;

  $("#qa-projects").onclick = () => { currentSection = "projects"; renderShell(); };
  $("#qa-media").onclick = () => { currentSection = "media"; renderShell(); };
}

function renderProfile() {
  const p = site.profile;
  const c = $("#content");
  c.innerHTML = `
    <div class="card">
      <h3>Kişisel Bilgiler</h3>
      <div class="form-grid">
        <label>Ad Soyad<input value="${esc(p.name)}" id="f-name" /></label>
        <label>Baş Harfler<input value="${esc(p.initials)}" id="f-initials" maxlength="4" /></label>
        <label>E-posta<input type="email" value="${esc(p.contact.email)}" id="f-email" /></label>
        <label>GitHub URL<input value="${esc(p.contact.github || "")}" id="f-github" placeholder="https://github.com/..." /></label>
        <label>LinkedIn URL<input value="${esc(p.contact.linkedin || "")}" id="f-linkedin" placeholder="https://linkedin.com/in/..." /></label>
      </div>
      ${fieldBi("Bölüm / Okul", p, "field")}
      ${fieldBi("Hero Rozeti", p, "badge")}
      ${fieldBi("Hero Ana Cümle", p, "tagline", "textarea")}
      ${fieldBi("Hero Alt Metin", p, "subtitle", "textarea")}
    </div>
    <div class="card">
      <h3>Profil Fotoğrafı</h3>
      <div class="photo-picker">
        ${p.photo ? `<img src="${assetUrl(p.photo)}" class="photo-picker__preview" alt="" />` : `<div class="photo-picker__empty">${p.initials}</div>`}
        <div class="photo-picker__actions">
          <label class="btn btn--primary btn--sm upload-label">
            📷 Fotoğraf Yükle
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/*" id="profile-photo-upload" hidden />
          </label>
          <button class="btn btn--ghost btn--sm" id="pick-photo">Medyadan Seç</button>
          ${p.photo ? `<button class="btn btn--ghost btn--sm btn--danger" id="remove-photo">Kaldır</button>` : ""}
        </div>
      </div>
      <p class="field-hint">JPG, PNG veya WebP — max 10MB. Yükleme sonrası sitede otomatik görünür.</p>
    </div>
    <div class="card">
      <h3>Metrikler (Hero)</h3>
      <div id="metrics-list"></div>
      <button class="btn btn--ghost btn--sm" id="add-metric">+ Metrik Ekle</button>
    </div>
    <div class="card">
      <h3>CV Dosyası</h3>
      <p>Mevcut: <code>${esc(p.cvPdf || "/cv.pdf")}</code></p>
      <label class="upload-zone">
        <input type="file" accept=".pdf" id="cv-upload" hidden />
        PDF Yükle
      </label>
    </div>`;

  bindBiFields(c, p);
  $("#f-name").oninput = (e) => { p.name = e.target.value; debounceSave(); };
  $("#f-initials").oninput = (e) => { p.initials = e.target.value; debounceSave(); };
  $("#f-email").oninput = (e) => { p.contact.email = e.target.value; debounceSave(); };
  $("#f-github").oninput = (e) => { p.contact.github = e.target.value || null; debounceSave(); };
  $("#f-linkedin").oninput = (e) => { p.contact.linkedin = e.target.value || null; debounceSave(); };

  $("#profile-photo-upload").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast("Dosya 10MB'dan büyük olamaz", "error");
      return;
    }
    try {
      toast("Yükleniyor...");
      const res = await uploadFile(file, "profile");
      p.photo = res.url;
      site.profile.photo = res.url;
      await saveSite();
      renderProfile();
      toast("Profil fotoğrafı yüklendi ✓");
    } catch (err) {
      toast(err.message, "error");
    }
    e.target.value = "";
  };

  $("#remove-photo")?.addEventListener("click", () => {
    p.photo = null;
    debounceSave();
    renderProfile();
    toast("Fotoğraf kaldırıldı");
  });

  $("#pick-photo").onclick = () => openMediaPicker((url) => {
    p.photo = url;
    enqueueSave({ quiet: true }).then(renderProfile);
  });

  function renderMetrics() {
    $("#metrics-list").innerHTML = p.metrics.map((m, i) => `
      <div class="inline-row">
        <input value="${esc(m.value)}" data-metric="value" data-i="${i}" placeholder="3+" />
        <select data-metric="key" data-i="${i}">
          <option value="projects" ${m.key === "projects" ? "selected" : ""}>Proje</option>
          <option value="experience" ${m.key === "experience" ? "selected" : ""}>Deneyim</option>
          <option value="stack" ${m.key === "stack" ? "selected" : ""}>Teknoloji</option>
        </select>
        <button class="btn-icon btn-icon--danger" data-del-metric="${i}">✕</button>
      </div>`).join("");

    $$("[data-metric]", $("#metrics-list")).forEach((el) => {
      el.oninput = el.onchange = () => {
        p.metrics[+el.dataset.i][el.dataset.metric] = el.value;
        debounceSave();
      };
    });
    $$("[data-del-metric]").forEach((btn) => {
      btn.onclick = () => { p.metrics.splice(+btn.dataset.delMetric, 1); renderMetrics(); debounceSave(); };
    });
  }
  renderMetrics();
  $("#add-metric").onclick = () => { p.metrics.push({ value: "1", key: "projects" }); renderMetrics(); debounceSave(); };

  $("#cv-upload").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      toast("CV yükleniyor...");
      const res = await uploadFile(file, "cv");
      p.cvPdf = res.url;
      await saveSite();
      renderProfile();
      toast("CV yüklendi ✓");
    } catch (err) { toast(err.message, "error"); }
  };
}

function renderTimeline() {
  const c = $("#content");
  c.innerHTML = `
    <div class="section-toolbar">
      <button class="btn btn--primary btn--sm" id="add-timeline">+ Dönem Ekle</button>
    </div>
    <div id="timeline-list"></div>`;

  function renderList() {
    $("#timeline-list").innerHTML = site.timeline.map((item, idx) => `
      <details class="card card--collapsible" ${idx === 0 ? "open" : ""}>
        <summary>
          <strong>${esc(item.year)}</strong> — ${esc(item.title?.tr || item.id)}
          <span class="card-actions">
            <button class="btn-icon" data-move="up" data-i="${idx}" ${idx === 0 ? "disabled" : ""}>↑</button>
            <button class="btn-icon" data-move="down" data-i="${idx}" ${idx === site.timeline.length - 1 ? "disabled" : ""}>↓</button>
            <button class="btn-icon btn-icon--danger" data-del="${idx}">✕</button>
          </span>
        </summary>
        <div class="card-body" data-idx="${idx}">
          <div class="form-grid">
            <label>ID<input value="${esc(item.id)}" data-f="id" /></label>
            <label>Yıl<input value="${esc(item.year)}" data-f="year" /></label>
            <label>İkon (emoji)<input value="${esc(item.icon || "")}" data-f="icon" placeholder="🎓" /></label>
            <label>Etiketler (virgülle)<input value="${esc(item.tags.join(", "))}" data-f="tags" /></label>
          </div>
          <div data-bi-container="${idx}"></div>
        </div>
      </details>`).join("");

    site.timeline.forEach((item, idx) => {
      const container = $(`[data-bi-container="${idx}"]`);
      container.innerHTML =
        fieldBi("Dönem", item, "period") +
        fieldBi("Başlık", item, "title") +
        fieldBi("Öne Çıkan Başarı", item, "highlight", "textarea") +
        fieldBi("Metrik", item, "metric");
      bindBiFields(container, item);

      $$(`[data-f]`, $(`[data-idx="${idx}"]`)).forEach((el) => {
        el.oninput = () => {
          const f = el.dataset.f;
          if (f === "tags") item.tags = el.value.split(",").map((t) => t.trim()).filter(Boolean);
          else item[f] = el.value;
          debounceSave();
        };
      });
    });

    $$("[data-move]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const i = +btn.dataset.i;
        const j = btn.dataset.move === "up" ? i - 1 : i + 1;
        [site.timeline[i], site.timeline[j]] = [site.timeline[j], site.timeline[i]];
        renderList();
        debounceSave();
      };
    });
    $$("[data-del]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (confirm("Bu dönemi silmek istediğinize emin misiniz?")) {
          site.timeline.splice(+btn.dataset.del, 1);
          renderList();
          debounceSave();
        }
      };
    });
  }

  renderList();
  $("#add-timeline").onclick = () => {
    const year = String(new Date().getFullYear());
    site.timeline.push({
      id: year,
      year,
      icon: "📌",
      tags: [],
      period: bi("Yeni Dönem", "New Period"),
      title: bi("Başlık", "Title"),
      highlight: bi("", ""),
      metric: bi("", ""),
    });
    renderList();
    debounceSave();
  };
}

function renderProjects() {
  const c = $("#content");
  c.innerHTML = `
    <div class="section-toolbar">
      <button class="btn btn--primary btn--sm" id="add-project">+ Proje Ekle</button>
    </div>
    <div id="projects-list"></div>`;

  function renderList() {
    const openIds = new Set();
    $$("#projects-list details[open]").forEach((el) => {
      const body = el.querySelector("[data-pidx]");
      if (body) {
        const p = site.projects[+body.dataset.pidx];
        if (p) openIds.add(p.id);
      }
    });

    $("#projects-list").innerHTML = site.projects.map((p, idx) => `
      <details class="card card--collapsible" ${openIds.has(p.id) || (openIds.size === 0 && idx === 0) ? "open" : ""}>
        <summary>
          <strong>${esc(p.title?.tr || p.id)}</strong>
          <span class="card-actions">
            <button class="btn-icon" data-move="up" data-i="${idx}" ${idx === 0 ? "disabled" : ""}>↑</button>
            <button class="btn-icon" data-move="down" data-i="${idx}" ${idx === site.projects.length - 1 ? "disabled" : ""}>↓</button>
            <button class="btn-icon btn-icon--danger" data-del="${idx}">✕</button>
          </span>
        </summary>
        <div class="card-body" data-pidx="${idx}">
          <div class="form-grid">
            <label>ID (slug)<input value="${esc(p.id)}" data-f="id" /></label>
            <label>Yıl<input value="${esc(p.year)}" data-f="year" /></label>
            <label>Demo URL<input value="${esc(p.demo || "")}" data-f="demo" placeholder="https://..." /></label>
            <label>GitHub URL<input value="${esc(p.github || "")}" data-f="github" placeholder="https://github.com/..." /></label>
            <label>Teknolojiler (virgülle)<input value="${esc(p.stack.join(", "))}" data-f="stack" /></label>
          </div>
          <h4>Ekran Görüntüleri</h4>
          <div class="screenshots-grid" data-shots="${idx}"></div>
          <button class="btn btn--ghost btn--sm" data-add-shot="${idx}">+ Görsel Ekle</button>
          <div data-bi-container="${idx}" style="margin-top:1rem"></div>
        </div>
      </details>`).join("");

    site.projects.forEach((p, idx) => {
      const container = $(`[data-bi-container="${idx}"]`);
      container.innerHTML =
        fieldBi("Başlık", p, "title") +
        fieldBi("Alt Başlık", p, "subtitle") +
        fieldBi("Problem", p, "problem", "textarea") +
        fieldBi("Çözüm", p, "solution", "textarea") +
        fieldBi("Sonuç", p, "result", "textarea");
      bindBiFields(container, p);

      const shotsEl = $(`[data-shots="${idx}"]`);
      shotsEl.innerHTML = (p.screenshots || []).map((url, si) => `
        <div class="shot-item">
          ${url ? `<img src="${assetUrl(url)}" alt="" />` : `<div class="shot-item__empty">Boş</div>`}
          <input value="${esc(url || "")}" data-shot="${si}" placeholder="URL veya medyadan seç" />
          <div class="shot-item__actions">
            <label class="btn btn--ghost btn--sm upload-label">
              Yükle
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/*" data-upload-shot="${si}" hidden />
            </label>
            <button type="button" class="btn btn--ghost btn--sm" data-pick-shot="${si}">Seç</button>
          </div>
          <button class="btn-icon btn-icon--danger" data-rm-shot="${si}">✕</button>
        </div>`).join("");

      $$(`[data-upload-shot]`, shotsEl).forEach((input) => {
        input.onchange = async (e) => {
          const file = e.target.files[0];
          e.target.value = "";
          if (!file) return;
          const ok = await uploadShotImage(file, p, +input.dataset.uploadShot);
          if (ok) renderList();
        };
      });

      $$(`[data-shot]`, shotsEl).forEach((el) => {
        el.oninput = () => { p.screenshots[+el.dataset.shot] = el.value || null; debounceSave(); };
      });
      $$(`[data-pick-shot]`, shotsEl).forEach((btn) => {
        btn.onclick = () => openMediaPicker((url) => {
          p.screenshots[+btn.dataset.pickShot] = url;
          renderList();
          debounceSave();
        });
      });
      $$(`[data-rm-shot]`, shotsEl).forEach((btn) => {
        btn.onclick = () => { p.screenshots.splice(+btn.dataset.rmShot, 1); renderList(); debounceSave(); };
      });

      $$(`[data-f]`, $(`[data-pidx="${idx}"]`)).forEach((el) => {
        el.oninput = () => {
          const f = el.dataset.f;
          if (f === "stack") p.stack = el.value.split(",").map((t) => t.trim()).filter(Boolean);
          else p[f] = el.value || null;
          debounceSave();
        };
      });
    });

    $$("[data-add-shot]").forEach((btn) => {
      btn.onclick = () => {
        site.projects[+btn.dataset.addShot].screenshots.push(null);
        renderList();
        debounceSave();
      };
    });
    $$("[data-move]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const i = +btn.dataset.i;
        const j = btn.dataset.move === "up" ? i - 1 : i + 1;
        [site.projects[i], site.projects[j]] = [site.projects[j], site.projects[i]];
        renderList();
        debounceSave();
      };
    });
    $$("[data-del]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (confirm("Bu projeyi silmek istediğinize emin misiniz?")) {
          site.projects.splice(+btn.dataset.del, 1);
          renderList();
          debounceSave();
        }
      };
    });
  }

  renderList();
  $("#add-project").onclick = () => {
    const id = `proje-${Date.now()}`;
    site.projects.push({
      id,
      year: String(new Date().getFullYear()),
      stack: [],
      screenshots: [null],
      demo: null,
      github: null,
      title: bi("Yeni Proje", "New Project"),
      subtitle: bi("", ""),
      problem: bi("", ""),
      solution: bi("", ""),
      result: bi("", ""),
    });
    renderList();
    debounceSave();
  };
}

function renderSkills() {
  const c = $("#content");
  c.innerHTML = `
    <div class="section-toolbar"><button class="btn btn--primary btn--sm" id="add-skill">+ Yetkinlik Ekle</button></div>
    <div id="skills-list"></div>`;

  function renderList() {
    $("#skills-list").innerHTML = site.skills.map((s, idx) => `
      <div class="card">
        <div class="inline-row" style="margin-bottom:1rem">
          <strong>${esc(s.name)}</strong>
          <button class="btn-icon btn-icon--danger" data-del="${idx}">✕</button>
        </div>
        <div class="form-grid" data-sidx="${idx}">
          <label>ID<input value="${esc(s.id)}" data-f="id" /></label>
          <label>Ad<input value="${esc(s.name)}" data-f="name" /></label>
          <label>Kategori<select data-f="category">
            ${["language","frontend","backend","database","tool","architecture","devops","hardware"].map((cat) => `<option value="${cat}" ${s.category===cat?"selected":""}>${cat}</option>`).join("")}
          </select></label>
          <label>Süre<input value="${esc(s.duration)}" data-f="duration" /></label>
          <label>Yoğunluk<select data-f="intensity">
            <option value="high" ${s.intensity==="high"?"selected":""}>Yüksek</option>
            <option value="medium" ${s.intensity==="medium"?"selected":""}>Orta</option>
            <option value="low" ${s.intensity==="low"?"selected":""}>Düşük</option>
          </select></label>
          <label>Projeler TR (virgülle)<input value="${esc(s.projects.tr.join(", "))}" data-f="projects-tr" /></label>
          <label>Projeler EN (virgülle)<input value="${esc(s.projects.en.join(", "))}" data-f="projects-en" /></label>
        </div>
      </div>`).join("");

    site.skills.forEach((s, idx) => {
      $$(`[data-f]`, $(`[data-sidx="${idx}"]`)).forEach((el) => {
        el.oninput = el.onchange = () => {
          const f = el.dataset.f;
          if (f === "projects-tr") s.projects.tr = el.value.split(",").map((t) => t.trim()).filter(Boolean);
          else if (f === "projects-en") s.projects.en = el.value.split(",").map((t) => t.trim()).filter(Boolean);
          else s[f] = el.value;
          debounceSave();
        };
      });
    });
    $$("[data-del]").forEach((btn) => {
      btn.onclick = () => {
        if (confirm("Silinsin mi?")) { site.skills.splice(+btn.dataset.del, 1); renderList(); debounceSave(); }
      };
    });
  }
  renderList();
  $("#add-skill").onclick = () => {
    site.skills.push({ id: `skill-${Date.now()}`, name: "Yeni", category: "tool", duration: "1 yıl", intensity: "medium", projects: bi([], []) });
    renderList();
    debounceSave();
  };
}

function renderLibrary() {
  const c = $("#content");
  c.innerHTML = `
    <div class="section-toolbar"><button class="btn btn--primary btn--sm" id="add-lib">+ Kayıt Ekle</button></div>
    <div id="lib-list"></div>`;

  function renderList() {
    $("#lib-list").innerHTML = site.library.map((item, idx) => `
      <details class="card card--collapsible">
        <summary>${esc(item.title?.tr || item.id)} <button class="btn-icon btn-icon--danger" data-del="${idx}">✕</button></summary>
        <div class="card-body" data-lidx="${idx}">
          <div class="form-grid">
            <label>ID<input value="${esc(item.id)}" data-f="id" /></label>
            <label>Tür<select data-f="type">
              <option value="reading" ${item.type==="reading"?"selected":""}>Okuma</option>
              <option value="trend" ${item.type==="trend"?"selected":""}>Trend</option>
              <option value="thought" ${item.type==="thought"?"selected":""}>Düşünce</option>
            </select></label>
            <label>Durum<select data-f="status">
              <option value="reading" ${item.status==="reading"?"selected":""}>Okunuyor</option>
              <option value="following" ${item.status==="following"?"selected":""}>Takip Ediliyor</option>
              <option value="thinking" ${item.status==="thinking"?"selected":""}>Düşünülüyor</option>
            </select></label>
          </div>
          <div data-bi-container="${idx}"></div>
        </div>
      </details>`).join("");

    site.library.forEach((item, idx) => {
      const container = $(`[data-bi-container="${idx}"]`);
      container.innerHTML = fieldBi("Başlık", item, "title") + fieldBi("Yazar/Kaynak", item, "author") + fieldBi("Not", item, "note", "textarea");
      bindBiFields(container, item);
      $$(`[data-f]`, $(`[data-lidx="${idx}"]`)).forEach((el) => {
        el.oninput = el.onchange = () => { item[el.dataset.f] = el.value; debounceSave(); };
      });
    });
    $$("[data-del]").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (confirm("Silinsin mi?")) { site.library.splice(+btn.dataset.del, 1); renderList(); debounceSave(); }
      };
    });
  }
  renderList();
  $("#add-lib").onclick = () => {
    site.library.push({ id: `lib-${Date.now()}`, type: "reading", status: "reading", title: bi("", ""), author: bi("", ""), note: bi("", "") });
    renderList();
    debounceSave();
  };
}

async function renderMedia() {
  try { media = await api("/api/media"); } catch { media = []; }
  const c = $("#content");
  c.innerHTML = `
    <div class="card">
      <label class="upload-zone upload-zone--large" id="media-drop">
        <input type="file" accept="image/*,.pdf" id="media-upload" multiple hidden />
        <strong>Dosya yükle</strong>
        <span>JPG, PNG, WebP, GIF, SVG, PDF — max 10MB</span>
      </label>
    </div>
    <div class="media-grid" id="media-grid">
      ${media.length ? media.map((m) => mediaCard(m)).join("") : '<p class="empty-msg">Henüz dosya yok.</p>'}
    </div>`;

  $("#media-upload").onchange = async (e) => {
    const files = [...e.target.files];
    e.target.value = "";
    await uploadFiles(files);
  };
  const drop = $("#media-drop");
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("dragover"); };
  drop.ondragleave = () => drop.classList.remove("dragover");
  drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove("dragover"); uploadFiles([...e.dataTransfer.files]); };

  $$("[data-copy-url]").forEach((btn) => {
    btn.onclick = () => { navigator.clipboard.writeText(btn.dataset.copyUrl); toast("URL kopyalandı"); };
  });
  $$("[data-del-media]").forEach((btn) => {
    btn.onclick = async () => {
      if (!confirm("Dosya silinsin mi?")) return;
      await api(`/api/media/${btn.dataset.delMedia}`, { method: "DELETE" });
      renderMedia();
      toast("Dosya silindi");
    };
  });
}

function mediaCard(m) {
  const isImg = [".jpg",".jpeg",".png",".webp",".gif",".svg",".heic",".heif",".bmp"].includes(m.type);
  const src = assetUrl(m.url);
  return `
    <div class="media-card">
      ${isImg ? `<img src="${src}" alt="" />` : `<div class="media-card__file">📄 ${esc(m.filename)}</div>`}
      <div class="media-card__info">
        <code>${esc(m.url)}</code>
        <div class="media-card__actions">
          <button class="btn btn--ghost btn--sm" data-copy-url="${esc(m.url)}">Kopyala</button>
          <button class="btn btn--ghost btn--sm btn--danger" data-del-media="${esc(m.filename)}">Sil</button>
        </div>
      </div>
    </div>`;
}

async function uploadFiles(files) {
  if (!files.length) return;
  let ok = 0;
  let fail = 0;
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      toast(`${file.name}: 10MB limiti aşıldı`, "error");
      fail++;
      continue;
    }
    try {
      await uploadFile(file);
      ok++;
      try { media = await api("/api/media"); } catch { /* ignore */ }
    } catch (err) {
      toast(`${file.name}: ${err.message}`, "error");
      fail++;
    }
  }
  if (currentSection === "media") await renderMedia();
  if (ok) toast(`${ok} dosya yüklendi ✓`);
  if (fail && !ok) toast("Yükleme başarısız — giriş yaptığınızdan emin olun", "error");
}

async function openMediaPicker(callback) {
  try { media = await api("/api/media"); } catch { /* mevcut listeyi kullan */ }
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal__box">
      <header><h3>Medya Seç</h3><button class="btn-icon" id="close-modal">✕</button></header>
      <div class="media-grid media-grid--picker" id="picker-grid">
        ${media.length ? media.filter((m) => m.type !== ".pdf").map((m) => `
          <button class="media-pick" data-url="${esc(m.url)}"><img src="${assetUrl(m.url)}" alt="" /></button>`).join("") : "<p>Önce medya yükleyin.</p>"}
      </div>
    </div>`;
  document.body.appendChild(modal);
  $("#close-modal", modal).onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  $$(".media-pick", modal).forEach((btn) => {
    btn.onclick = () => { callback(btn.dataset.url); modal.remove(); };
  });
}

function renderLabels() {
  const c = $("#content");
  const sections = [
    { key: "meta", label: "SEO (Meta)" },
    { key: "nav", label: "Navigasyon" },
    { key: "hero", label: "Hero Butonları" },
    { key: "timeline", label: "Zaman Tüneli Başlıkları" },
    { key: "projects", label: "Projeler Başlıkları" },
    { key: "skills", label: "Yetkinlikler Başlıkları" },
    { key: "library", label: "Kütüphane Başlıkları" },
    { key: "contact", label: "İletişim" },
    { key: "footer", label: "Footer" },
  ];

  c.innerHTML = sections.map((sec) => `
    <details class="card card--collapsible">
      <summary>${sec.label}</summary>
      <div class="card-body" data-sec="${sec.key}"></div>
    </details>`).join("");

  sections.forEach((sec) => {
    const container = $(`[data-sec="${sec.key}"]`);
    const trObj = site.ui.tr[sec.key] || {};
    const enObj = site.ui.en[sec.key] || {};
    const keys = [...new Set([...Object.keys(trObj), ...Object.keys(enObj)])].filter((k) => typeof trObj[k] === "string" || typeof enObj[k] === "string");

    container.innerHTML = keys.map((key) => `
      <div class="field-group">
        <label class="field-label">${key}</label>
        <div class="bi-fields">
          <div class="bi-field"><span>🇹🇷</span><input data-sec="${sec.key}" data-key="${key}" data-lang="tr" value="${esc(trObj[key] || "")}" /></div>
          <div class="bi-field"><span>🇬🇧</span><input data-sec="${sec.key}" data-key="${key}" data-lang="en" value="${esc(enObj[key] || "")}" /></div>
        </div>
      </div>`).join("");

    $$("input[data-sec]", container).forEach((el) => {
      el.oninput = () => {
        const { sec, key, lang } = el.dataset;
        if (!site.ui[lang][sec]) site.ui[lang][sec] = {};
        site.ui[lang][sec][key] = el.value;
        debounceSave();
      };
    });
  });
}

function renderSettings() {
  const c = $("#content");
  c.innerHTML = `
    <div class="card">
      <h3>Şifre Değiştir</h3>
      <form id="password-form" class="form-grid">
        <label>Mevcut Şifre<input type="password" name="current" required /></label>
        <label>Yeni Şifre<input type="password" name="new" required minlength="8" /></label>
        <label>Yeni Şifre (Tekrar)<input type="password" name="confirm" required minlength="8" /></label>
        <button type="submit" class="btn btn--primary">Şifreyi Güncelle</button>
      </form>
    </div>
    <div class="card">
      <h3>Yedekleme</h3>
      <p>Tüm site içeriğini JSON olarak indirin veya geri yükleyin.</p>
      <div class="quick-actions">
        <button class="btn btn--ghost" id="export-backup">↓ Yedek İndir</button>
        <label class="btn btn--ghost upload-label">
          ↑ Yedek Yükle<input type="file" accept=".json" id="import-backup" hidden />
        </label>
      </div>
    </div>
    <div class="card card--warning">
      <h3>⚠ Dikkat</h3>
      <p>Admin paneli çalışması için <code>npm run dev</code> ile API sunucusunun açık olması gerekir.</p>
      <p>Şifrenizi <code>.env</code> dosyasındaki <code>ADMIN_PASSWORD</code> ile de yönetebilirsiniz.</p>
    </div>`;

  $("#password-form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (fd.get("new") !== fd.get("confirm")) return toast("Şifreler eşleşmiyor", "error");
    try {
      await api("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: fd.get("current"),
          newPassword: fd.get("new"),
          confirm: fd.get("confirm"),
        }),
      });
      toast("Şifre güncellendi");
      e.target.reset();
    } catch (err) { toast(err.message, "error"); }
  };

  $("#export-backup").onclick = async () => {
    const data = await api("/api/backup");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `site-backup-${Date.now()}.json`;
    a.click();
  };

  $("#import-backup").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      site = await api("/api/backup/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast("Yedek geri yüklendi");
      renderShell();
    } catch (err) { toast(err.message, "error"); }
  };
}

async function getAuthStatus() {
  for (const path of ["/api/auth/check", "/api/auth/status"]) {
    try {
      const res = await fetch(path, { credentials: "include" });
      if (!res.ok) continue;
      const data = await res.json();
      return {
        authenticated: !!data.authenticated,
        needsSetup: !!data.needsSetup,
      };
    } catch {
      /* sonraki endpoint */
    }
  }
  throw new Error("Sunucuya bağlanılamadı");
}

async function init() {
  isAdminAuthenticated = false;
  try {
    const status = await getAuthStatus();
    if (status.needsSetup) return renderSetup();
    if (!status.authenticated) return renderLogin();
    isAdminAuthenticated = true;
    site = await api("/api/content");
    try { media = await api("/api/media"); } catch { media = []; }
    renderShell();
  } catch {
    renderLogin(`Sunucuya bağlanılamadı.

1. Tüm terminal pencerelerini kapatın (Ctrl+C)
2. Proje klasöründe: npm run dev
3. Terminalde yazan adresi açın (ör. http://localhost:5173/admin/)
4. Şifre: .env dosyasındaki ADMIN_PASSWORD`);
  }
}

let reloadingAdmin = false;
window.addEventListener("keydown", (e) => {
  if (e.key === "F5" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r")) {
    reloadingAdmin = true;
  }
});

window.addEventListener("pagehide", () => {
  if (reloadingAdmin || !isAdminAuthenticated) return;
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    keepalive: true,
  });
});

window.addEventListener("beforeunload", (e) => {
  if (isDirty) { e.preventDefault(); e.returnValue = ""; }
});

init();
