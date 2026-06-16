import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync, statSync } from "fs";
import { join, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";
import { getDefaultContent } from "./defaults.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
export const DATA_DIR = join(ROOT, "data");
export const SITE_FILE = join(DATA_DIR, "site.json");
export const ADMIN_FILE = join(DATA_DIR, "admin.json");
export const PUBLIC_DIR = join(ROOT, "public");
export const UPLOADS_DIR = join(PUBLIC_DIR, "uploads");
export const CONTENT_PUBLIC = join(PUBLIC_DIR, "content", "site.json");

export function ensureDirs() {
  [DATA_DIR, UPLOADS_DIR, join(PUBLIC_DIR, "content")].forEach((dir) => {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  });
}

export function initStorage() {
  ensureDirs();
  if (!existsSync(SITE_FILE)) {
    saveContent(getDefaultContent());
  }
  if (!existsSync(ADMIN_FILE)) {
    writeFileSync(
      ADMIN_FILE,
      JSON.stringify({ passwordHash: null, salt: null, needsSetup: true }, null, 2)
    );
  }
}

export function readContent() {
  initStorage();
  return JSON.parse(readFileSync(SITE_FILE, "utf-8"));
}

export function saveContent(content) {
  ensureDirs();
  const data = { ...content, updatedAt: new Date().toISOString() };
  writeFileSync(SITE_FILE, JSON.stringify(data, null, 2), "utf-8");
  writeFileSync(CONTENT_PUBLIC, JSON.stringify(data, null, 2), "utf-8");
  return data;
}

export function readAdminConfig() {
  initStorage();
  return JSON.parse(readFileSync(ADMIN_FILE, "utf-8"));
}

export function saveAdminConfig(config) {
  ensureDirs();
  writeFileSync(ADMIN_FILE, JSON.stringify(config, null, 2), "utf-8");
}

export function listMedia() {
  ensureDirs();
  if (!existsSync(UPLOADS_DIR)) return [];
  return readdirSync(UPLOADS_DIR)
    .filter((f) => !f.startsWith("."))
    .map((filename) => {
      const full = join(UPLOADS_DIR, filename);
      const stat = statSync(full);
      return {
        filename,
        url: `/uploads/${filename}`,
        size: stat.size,
        createdAt: stat.birthtime.toISOString(),
        type: extname(filename).toLowerCase(),
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function deleteMedia(filename) {
  const safe = basename(filename);
  const full = join(UPLOADS_DIR, safe);
  if (!existsSync(full)) return false;
  unlinkSync(full);
  return true;
}

export function isAllowedUpload(filename, mimetype) {
  const ext = extname(filename).toLowerCase();
  const allowedExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".svg", ".heic", ".heif", ".bmp"];
  if (!allowedExt.includes(ext)) return false;
  if (!mimetype) return true;
  if (mimetype.startsWith("image/") || mimetype === "application/pdf") return true;
  return false;
}
