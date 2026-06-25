/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 * ! If you do not download the source code from the above address, you are using an unknown version and at risk of having your account hacked
 *
 * English:
 * ! Please do not change the below code, it is very important for the project.
 * It is my motivation to maintain and develop the project for free.
 * ! If you change it, you will be banned forever
 * Thank you for using
 *
 * Vietnamese:
 * ! Vui lòng không thay đổi mã bên dưới, nó rất quan trọng đối với dự án.
 * Nó là động lực để tôi duy trì và phát triển dự án miễn phí.
 * ! Nếu thay đổi nó, bạn sẽ bị cấm vĩnh viễn
 * Cảm ơn bạn đã sử dụng
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");

// ============ AUTO-RESTART CONFIGURATION ============
const RESTART_CONFIG = {
  minDelay: 3000,       // 3s minimum delay before restart
  maxDelay: 60000,      // 60s maximum delay (cap for backoff)
  resetAfter: 300000,   // reset crash counter after 5 minutes of stable uptime
  maxCrashes: 10        // stop after 10 consecutive crashes (likely a fatal bug)
};

let crashCount = 0;
let lastCrashTime = null;
let stableTimer = null;

function getRestartDelay() {
  // Exponential backoff: 3s, 6s, 12s, 24s, 48s, 60s, 60s...
  const delay = Math.min(
    RESTART_CONFIG.minDelay * Math.pow(2, crashCount - 1),
    RESTART_CONFIG.maxDelay
  );
  return delay;
}

function startProject() {
  const startTime = Date.now();

  // Clear any previous stable timer
  if (stableTimer) clearTimeout(stableTimer);

  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  // If bot runs stably for resetAfter ms, reset crash counter
  stableTimer = setTimeout(() => {
    if (crashCount > 0) {
      console.log(`[AUTO-RESTART] ✓ Bot stable for 5 minutes — resetting crash counter (was ${crashCount})`);
      crashCount = 0;
    }
  }, RESTART_CONFIG.resetAfter);

  child.on("close", (code) => {
    if (stableTimer) clearTimeout(stableTimer);

    const uptime = Math.floor((Date.now() - startTime) / 1000);

    // Exit code 0 = clean exit (intentional stop), don't restart
    if (code === 0) {
      console.log(`[AUTO-RESTART] Bot stopped cleanly (uptime: ${uptime}s). Not restarting.`);
      return;
    }

    // Exit code 2 = intentional restart signal from bot (e.g. .restart command)
    if (code === 2) {
      console.log(`[AUTO-RESTART] ↻ Bot requested restart (uptime: ${uptime}s). Restarting now...`);
      crashCount = 0;
      return startProject();
    }

    // Any other exit = crash
    crashCount++;
    lastCrashTime = Date.now();
    const delay = getRestartDelay();

    if (crashCount >= RESTART_CONFIG.maxCrashes) {
      console.log(`[AUTO-RESTART] ❌ Bot crashed ${crashCount} times in a row. Stopping auto-restart to prevent infinite loop.`);
      console.log(`[AUTO-RESTART] Please check the logs and fix the error, then restart manually.`);
      return;
    }

    console.log(`[AUTO-RESTART] ⚠ Bot crashed with code ${code} (uptime: ${uptime}s, crash #${crashCount}). Restarting in ${delay / 1000}s...`);

    setTimeout(() => {
      console.log(`[AUTO-RESTART] ↻ Restarting now... (attempt ${crashCount}/${RESTART_CONFIG.maxCrashes})`);
      startProject();
    }, delay);
  });

  child.on("error", (err) => {
    console.error(`[AUTO-RESTART] Failed to start process:`, err.message);
  });
}

// ============ START BOT ============
console.log(`[AUTO-RESTART] Starting bot with auto-restart enabled...`);
startProject();

// ============ UPTIME SERVER ============
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`<h1>✅ Bot is running</h1><p>Uptime: ${Math.floor(process.uptime())}s | Crash count: ${crashCount}</p>`);
});

app.get('/uptime', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    crashCount,
    lastCrashTime
  });
});

app.listen(PORT, () => {
  console.log(`[UPTIME] Server running on port ${PORT}`);
});
