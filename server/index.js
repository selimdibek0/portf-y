import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import { join, extname } from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";
import dotenv from "dotenv";
import {
  initStorage,
  readContent,
  saveContent,
  readAdminConfig,
  saveAdminConfig,
  listMedia,
  deleteMedia,
  isAllowedUpload,
  UPLOADS_DIR,
  PUBLIC_DIR,
} from "./storage.js";
import {
  hashPassword,
  verifyPassword,
  createSession,
  validateSession,
  destroySession,
  authMiddleware,
  clearAuthCookie,
  SERVER_BOOT_ID,
} from "./auth.js";

dotenv.config();

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

initStorage();

let uploadCounter = 0;
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    uploadCounter += 1;
    const name = `${Date.now()}-${uploadCounter}-${randomBytes(6).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (isAllowedUpload(file.originalname, file.mimetype)) cb(null, true);
    else cb(new Error("Desteklenmeyen dosya türü"));
  },
});

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Vite proxy üzerinden veya doğrudan API erişimi (geliştirme)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isLocalDev =
    origin &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  if (isLocalDev) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use("/uploads", express.static(UPLOADS_DIR));

// Eski /cv.pdf linkleri — gerçek PDF yoksa CV sayfasına yönlendir
app.get("/cv.pdf", (_req, res) => {
  const staticPdf = join(PUBLIC_DIR, "cv.pdf");
  if (existsSync(staticPdf)) return res.download(staticPdf, "Selim-Dibek-CV.pdf");

  const content = readContent();
  const cvUrl = content.profile?.cvPdf;
  if (cvUrl?.endsWith(".pdf") && cvUrl !== "/cv.pdf") {
    const uploaded = join(PUBLIC_DIR, cvUrl.replace(/^\//, ""));
    if (existsSync(uploaded)) return res.download(uploaded, "Selim-Dibek-CV.pdf");
  }
  res.redirect("/cv.html?print=1");
});

app.use(express.static(join(__dirname, "..", "public")));

function setAdminPassword(password, extra = {}) {
  const { salt, hash } = hashPassword(password);
  saveAdminConfig({ passwordHash: hash, salt, needsSetup: false, ...extra });
}

function ensureAdminPassword() {
  const config = readAdminConfig();

  if (process.env.ADMIN_PASSWORD) {
    const envChanged = config.envPassword !== process.env.ADMIN_PASSWORD;
    if (!config.passwordHash || config.needsSetup || envChanged) {
      setAdminPassword(process.env.ADMIN_PASSWORD, {
        envPassword: process.env.ADMIN_PASSWORD,
      });
      console.log("\n🔐 Admin şifresi .env dosyasından ayarlandı.\n");
      return;
    }
  }

  if (!config.passwordHash) {
    saveAdminConfig({ ...config, needsSetup: true });
    console.log("\n🔐 İlk giriş: http://localhost:5173/admin/ adresinde şifre oluşturun.\n");
    return;
  }

  if (config.needsSetup === undefined) {
    saveAdminConfig({ ...config, needsSetup: false });
  }
}

ensureAdminPassword();

function issueSession(res) {
  const { token } = createSession();
  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // maxAge yok: tarayıcı kapanınca çerez silinir
  });
}

function authStatus(req, res) {
  const config = readAdminConfig();
  const token = req.cookies?.admin_token;
  const authenticated = validateSession(token);

  if (token && !authenticated) {
    clearAuthCookie(res);
  }

  res.json({
    authenticated,
    needsSetup: Boolean(config.needsSetup || !config.passwordHash),
  });
}

// ─── Auth ────────────────────────────────────────────────────────────────────
app.get("/api/auth/status", authStatus);

app.post("/api/auth/setup", (req, res) => {
  const config = readAdminConfig();
  if (config.passwordHash && !config.needsSetup) {
    return res.status(403).json({ error: "Şifre zaten ayarlanmış" });
  }

  const { password, confirm } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Şifre en az 8 karakter olmalı" });
  }
  if (password !== confirm) {
    return res.status(400).json({ error: "Şifreler eşleşmiyor" });
  }

  setAdminPassword(password);
  issueSession(res);
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  const config = readAdminConfig();

  if (config.needsSetup || !config.passwordHash) {
    return res.status(403).json({ error: "Önce şifre oluşturmalısınız", needsSetup: true });
  }
  if (!password) {
    return res.status(400).json({ error: "Şifre gerekli" });
  }

  const valid = verifyPassword(password, config.salt, config.passwordHash);
  if (!valid) return res.status(401).json({ error: "Hatalı şifre" });

  issueSession(res);
  res.json({ ok: true });
});

app.post("/api/auth/logout", (req, res) => {
  destroySession(req.cookies?.admin_token);
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get("/api/auth/check", authStatus);

app.post("/api/auth/password", authMiddleware, (req, res) => {
  const { currentPassword, newPassword, confirm } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "Yeni şifre en az 8 karakter olmalı" });
  }
  if (newPassword !== confirm) {
    return res.status(400).json({ error: "Yeni şifreler eşleşmiyor" });
  }
  const config = readAdminConfig();
  if (!verifyPassword(currentPassword, config.salt, config.passwordHash)) {
    return res.status(401).json({ error: "Mevcut şifre hatalı" });
  }
  setAdminPassword(newPassword, { envPassword: null });
  res.json({ ok: true });
});

// ─── Content ─────────────────────────────────────────────────────────────────
app.get("/api/content", (_req, res) => {
  res.json(readContent());
});

app.put("/api/content", authMiddleware, (req, res) => {
  try {
    const saved = saveContent(req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Media ───────────────────────────────────────────────────────────────────
app.get("/api/media", authMiddleware, (_req, res) => {
  res.json(listMedia());
});

app.post("/api/upload", authMiddleware, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const msg =
        err.code === "LIMIT_FILE_SIZE"
          ? "Dosya çok büyük (max 10MB)"
          : err.message || "Yükleme hatası";
      return res.status(400).json({ error: msg });
    }
    if (!req.file) return res.status(400).json({ error: "Dosya seçilmedi" });

    const url = `/uploads/${req.file.filename}`;
    const isPdf = req.file.mimetype === "application/pdf";

    if (isPdf && req.body.target === "cv") {
      const content = readContent();
      content.profile.cvPdf = url;
      saveContent(content);
    }

    if (req.body.target === "profile") {
      const content = readContent();
      content.profile.photo = url;
      saveContent(content);
    }

    res.json({
      url,
      filename: req.file.filename,
      size: req.file.size,
      type: extname(req.file.filename).toLowerCase(),
    });
  });
});

app.delete("/api/media/:filename", authMiddleware, (req, res) => {
  const ok = deleteMedia(req.params.filename);
  if (!ok) return res.status(404).json({ error: "Dosya bulunamadı" });
  res.json({ ok: true });
});

// ─── Backup ──────────────────────────────────────────────────────────────────
app.get("/api/backup", authMiddleware, (_req, res) => {
  const content = readContent();
  res.setHeader("Content-Disposition", 'attachment; filename="site-backup.json"');
  res.json(content);
});

app.post("/api/backup/import", authMiddleware, (req, res) => {
  try {
    const saved = saveContent(req.body);
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: "Geçersiz yedek dosyası" });
  }
});

app.listen(PORT, () => {
  console.log(`API sunucusu http://localhost:${PORT} (oturum: ${SERVER_BOOT_ID.slice(0, 8)}…)`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n⚠ Port ${PORT} kullanımda — eski API süreci hâlâ çalışıyor olabilir.\n` +
        `   baslat.bat ile yeniden başlatın veya portu kullanan süreci kapatın.\n`
    );
    process.exit(1);
  }
  throw err;
});
