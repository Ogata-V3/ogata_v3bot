"use strict";

const fs    = require("fs");
const path  = require("path");
const axios = require("axios");

// ─────────────────────────────────────────────────────────────
//  § 0. LOGGER — defined first so all functions can use it
// ─────────────────────────────────────────────────────────────
const logger = {
  info   : (msg) => console.log(`\x1b[36m[INFO]\x1b[0m    ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  warn   : (msg) => console.warn(`\x1b[33m[WARN]\x1b[0m    ${msg}`),
  error  : (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m   ${msg}`),
  debug  : (msg) => {
    if (process.env.NODE_ENV === "development")
      console.log(`\x1b[35m[DEBUG]\x1b[0m   ${msg}`);
  },
};

// ─────────────────────────────────────────────────────────────
//  § 1. FORMAT HELPERS
// ─────────────────────────────────────────────────────────────

function formatNumber(num) {
  return Number(num).toLocaleString("en-US");
}

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts = [];
  if (d > 0) parts.push(`${d} day${d !== 1 ? "s" : ""}`);
  if (h > 0) parts.push(`${h} hour${h !== 1 ? "s" : ""}`);
  if (m > 0) parts.push(`${m} minute${m !== 1 ? "s" : ""}`);
  if (s > 0 || parts.length === 0) parts.push(`${s} second${s !== 1 ? "s" : ""}`);
  return parts.join(" ");
}

function getUptime() {
  return formatTime(process.uptime() * 1000);
}

function getDateTime(timezone = "Asia/Dhaka") {
  return new Date().toLocaleString("en-BD", {
    timeZone: timezone,
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
    second:  "2-digit",
    hour12:  true,
  });
}

// ─────────────────────────────────────────────────────────────
//  § 2. STRING HELPERS
// ─────────────────────────────────────────────────────────────

function capitalize(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str = "", maxLen = 100) {
  return str.length > maxLen ? str.slice(0, maxLen - 3) + "..." : str;
}

function removeEmoji(str = "") {
  return str
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FEFF}]/gu, "")
    .trim();
}

function generateID(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function parseArgs(input = "") {
  const args = [];
  const regex = /"([^"]+)"|'([^']+)'|(\S+)/g;
  let match;
  while ((match = regex.exec(input)) !== null) {
    args.push(match[1] ?? match[2] ?? match[3]);
  }
  return args;
}

// ─────────────────────────────────────────────────────────────
//  § 3. ARRAY & OBJECT HELPERS
// ─────────────────────────────────────────────────────────────

function randomItem(arr = []) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(arr = []) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function chunkArray(arr = [], size = 10) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function arrayDiff(a = [], b = []) {
  const setB = new Set(b);
  return a.filter(x => !setB.has(x));
}

// ─────────────────────────────────────────────────────────────
//  § 4. MATH HELPERS
// ─────────────────────────────────────────────────────────────

function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function percentage(part, total) {
  if (!total) return 0;
  return parseFloat(((part / total) * 100).toFixed(2));
}

// ─────────────────────────────────────────────────────────────
//  § 5. FILE & PATH HELPERS
// ─────────────────────────────────────────────────────────────

function fileExists(filePath) {
  try { return fs.existsSync(filePath); } catch { return false; }
}

function readJSON(filePath, defaultValue = {}) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return defaultValue;
  }
}

function writeJSON(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    logger.error(`[writeJSON] ${err.message}`);
    return false;
  }
}

function saveTmp(filename, data) {
  const tmpDir = path.join(process.cwd(), "tmp");
  fs.mkdirSync(tmpDir, { recursive: true });
  const dest = path.join(tmpDir, filename);
  fs.writeFileSync(dest, data);
  return dest;
}

function deleteTmp(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    logger.warn(`[deleteTmp] ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────
//  § 6. NETWORK / API HELPERS
// ─────────────────────────────────────────────────────────────

async function getStreamFromURL(url, options = {}) {
  const response = await axios.get(url, {
    responseType: "stream",
    timeout: 30_000,
    headers: { "User-Agent": "Mozilla/5.0" },
    ...options,
  });
  return response.data;
}

async function downloadBuffer(url, options = {}) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30_000,
    headers: { "User-Agent": "Mozilla/5.0" },
    ...options,
  });
  return Buffer.from(response.data);
}

async function fetchJSON(url, options = {}) {
  const response = await axios.get(url, {
    timeout: 15_000,
    headers: { "User-Agent": "Mozilla/5.0" },
    ...options,
  });
  return response.data;
}

function isValidURL(str) {
  try { new URL(str); return true; } catch { return false; }
}

// ─────────────────────────────────────────────────────────────
//  § 7. GOATBOT V2 — SPECIFIC HELPERS
// ─────────────────────────────────────────────────────────────

function checkRole(event, role = 0) {
  if (role === 0) return true;
  const { senderID } = event;
  const adminBot = global.GoatBot?.config?.adminBot ?? [];
  if (adminBot.includes(senderID)) return true;
  if (role === 1) {
    const threadInfo = global.GoatBot?.threadInfo?.get?.(event.threadID);
    const adminIDs   = (threadInfo?.adminIDs ?? []).map(a => (typeof a === "object" ? a.id : a));
    if (adminIDs.includes(senderID)) return true;
  }
  return false;
}

async function getUserName(userID) {
  try {
    const userInfo = await global.db?.allUserData?.find(u => u.userID == userID);
    return userInfo?.name ?? `User ${userID}`;
  } catch {
    return `User ${userID}`;
  }
}

async function getThreadName(threadID) {
  try {
    const threadInfo = await global.db?.allThreadData?.find(t => t.threadID == threadID);
    return threadInfo?.threadName ?? `Thread ${threadID}`;
  } catch {
    return `Thread ${threadID}`;
  }
}

async function sendMessage(api, event, msg, deleteAfterMs = 0) {
  const sent = await api.sendMessage(msg, event.threadID, event.messageID);
  if (deleteAfterMs > 0 && sent?.messageID) {
    setTimeout(async () => {
      try { await api.unsendMessage(sent.messageID); } catch { /* already deleted */ }
    }, deleteAfterMs);
  }
  return sent;
}

class CooldownManager {
  constructor(cooldownMs = 5000) {
    this.cooldownMs = cooldownMs;
    this._map = new Map();
  }
  isOnCooldown(userID) {
    if (!this._map.has(userID)) return false;
    return Date.now() - this._map.get(userID) < this.cooldownMs;
  }
  getRemaining(userID) {
    if (!this._map.has(userID)) return 0;
    const rem = this.cooldownMs - (Date.now() - this._map.get(userID));
    return Math.max(0, Math.ceil(rem / 1000));
  }
  set(userID) { this._map.set(userID, Date.now()); }
  clear(userID) { this._map.delete(userID); }
  clearAll() { this._map.clear(); }
}

// ─────────────────────────────────────────────────────────────
//  § 8. VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────

function isValidUID(uid) {
  return /^\d{10,20}$/.test(String(uid ?? ""));
}

function isPositiveNumber(val) {
  const n = Number(val);
  return !isNaN(n) && n > 0;
}

function getMentions(event) {
  return Object.keys(event?.mentions ?? {});
}

// ─────────────────────────────────────────────────────────────
//  § 9. GOATBOT EXTRA UTILS
// ─────────────────────────────────────────────────────────────

function loading(text = "") {
  const frames = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  let i = 0, timer = null;
  const spin = {
    _start() {
      process.stdout.write("\x1b[?25l");
      timer = setInterval(() => {
        process.stdout.write(`\r\x1b[36m${frames[i++ % frames.length]}\x1b[0m ${text}`);
      }, 80);
      return spin;
    },
    _stop() {
      if (timer) { clearInterval(timer); timer = null; }
      process.stdout.write("\r\x1b[2K\x1b[?25h");
      return spin;
    },
    succeed(msg) { spin._stop(); console.log(`\x1b[32m✔\x1b[0m ${msg || text}`); return spin; },
    fail(msg)    { spin._stop(); console.log(`\x1b[31m✖\x1b[0m ${msg || text}`); return spin; },
    warn(msg)    { spin._stop(); console.log(`\x1b[33m⚠\x1b[0m ${msg || text}`); return spin; },
  };
  return spin;
}

function removeHomeDir(str = "") {
  const home = process.env.HOME || process.env.USERPROFILE || "";
  return home ? str.replace(home, "~") : str;
}

function loadScripts(type = "cmds", fileName) {
  try {
    const folder = type === "cmds" ? "scripts/cmds" : "scripts/events";
    const filePath = path.normalize(`${process.cwd()}/${folder}/${fileName}.js`);
    const fsExtra = require("fs-extra");
    if (fsExtra.existsSync(filePath)) {
      delete require.cache[require.resolve(filePath)];
      const script = require(filePath);
      return { success: true, script };
    }
    return { success: false, error: `File ${fileName} not found` };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function unloadScripts(type = "cmds", fileName) {
  try {
    const folder = type === "cmds" ? "scripts/cmds" : "scripts/events";
    const filePath = path.normalize(`${process.cwd()}/${folder}/${fileName}.js`);
    if (require.cache[require.resolve(filePath)]) {
      delete require.cache[require.resolve(filePath)];
      return { success: true };
    }
    return { success: false, error: `File ${fileName} not loaded` };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
//  § 10. GOATBOT MESSAGE WRAPPER
// ─────────────────────────────────────────────────────────────

/**
 * GoatBot V2 compatible message wrapper
 * global.utils.message(api, event) দিয়ে call হয়
 */
function message(api, event) {
  return {
    reply: (msg, callback) =>
      api.sendMessage(msg, event.threadID, callback, event.messageID),

    send: (msg, threadID, callback) =>
      api.sendMessage(msg, threadID || event.threadID, callback),

    delete: (msgID) =>
      api.unsendMessage(msgID || event.messageID),

    react: (emoji, msgID) =>
      api.setMessageReaction(emoji, msgID || event.messageID, () => {}, true),

    unsend: (msgID) =>
      api.unsendMessage(msgID),
  };
}

// ─────────────────────────────────────────────────────────────
//  EXPORTS
// ─────────────────────────────────────────────────────────────

module.exports = {
  // § 1 — Format
  formatNumber,
  formatTime,
  getUptime,
  getDateTime,

  // § 2 — String
  capitalize,
  truncate,
  removeEmoji,
  generateID,
  parseArgs,

  // § 3 — Array / Object
  randomItem,
  shuffleArray,
  chunkArray,
  arrayDiff,

  // § 4 — Math
  randomInt,
  clamp,
  percentage,

  // § 5 — File
  fileExists,
  readJSON,
  writeJSON,
  saveTmp,
  deleteTmp,

  // § 6 — Network
  getStreamFromURL,
  downloadBuffer,
  fetchJSON,
  isValidURL,

  // § 7 — GoatBot specific
  checkRole,
  getUserName,
  getThreadName,
  sendMessage,
  CooldownManager,

  // § 8 — Validation
  isValidUID,
  isPositiveNumber,
  getMentions,

  // § 9 — GoatBot extra
  loading,
  removeHomeDir,
  loadScripts,
  unloadScripts,

  // § 10 — Message wrapper
  message,

  // § 0 — Logger
  logger,
};
