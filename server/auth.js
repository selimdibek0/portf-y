import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOT_FILE = join(__dirname, "..", "data", "server-boot.json");

const SESSIONS = new Map();
const SESSION_TTL = 1000 * 60 * 60 * 2; // 2 saat
const IDLE_TIMEOUT = 1000 * 60 * 30; // 30 dk hareketsizlik

/** Her sunucu başlatıldığında yeni ID — eski oturumlar geçersiz olur */
export const SERVER_BOOT_ID = (() => {
  const bootId = randomBytes(16).toString("hex");
  writeFileSync(
    BOOT_FILE,
    JSON.stringify({ bootId, startedAt: new Date().toISOString() }, null, 2)
  );
  return bootId;
})();

export function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  const attempt = scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, "hex");
  return timingSafeEqual(attempt, stored);
}

export function createSession() {
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  SESSIONS.set(token, {
    expires: now + SESSION_TTL,
    lastActive: now,
    bootId: SERVER_BOOT_ID,
  });
  return { token };
}

export function validateSession(token) {
  if (!token) return false;
  const session = SESSIONS.get(token);
  if (!session) return false;

  const now = Date.now();
  if (session.bootId !== SERVER_BOOT_ID) {
    SESSIONS.delete(token);
    return false;
  }
  if (now > session.expires || now - session.lastActive > IDLE_TIMEOUT) {
    SESSIONS.delete(token);
    return false;
  }

  session.lastActive = now;
  return true;
}

export function destroySession(token) {
  SESSIONS.delete(token);
}

export function authMiddleware(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!validateSession(token)) {
    res.clearCookie("admin_token", { httpOnly: true, sameSite: "lax" });
    return res.status(401).json({ error: "Oturum gerekli" });
  }
  next();
}

export function clearAuthCookie(res) {
  res.clearCookie("admin_token", { httpOnly: true, sameSite: "lax" });
}

export function getBootInfo() {
  return { bootId: SERVER_BOOT_ID, bootFile: BOOT_FILE };
}
