import { execSync } from "child_process";

const ports = [3001, 5173, 5174, 5175];

function killPortWindows(port) {
  try {
    const out = execSync(`netstat -ano | findstr ":${port} " | findstr "LISTENING"`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
    const pids = new Set();
    for (const line of out.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const pid = trimmed.split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid)) pids.add(pid);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`  Port ${port} → PID ${pid} kapatıldı`);
      } catch {
        /* süreç zaten kapalı */
      }
    }
  } catch {
    /* port boş */
  }
}

if (process.platform === "win32") {
  console.log("Eski sunucu portları temizleniyor...");
  for (const port of ports) killPortWindows(port);
}
