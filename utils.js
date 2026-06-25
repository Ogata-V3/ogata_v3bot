/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           GoatBot V2 — Utility Functions (utils.js)         ║
 * ║      Compatible with: ntkhang03/Goat-Bot-V2 structure       ║
 * ║         Author: mdajmaul  |  Bot: goatbot_ajmaul_83         ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * রাখার জায়গা: root ফোল্ডারে (index.js এর পাশে)
 * ব্যবহার করো: const utils = require("./utils");
 *           অথবা destructure করে:
 *           const { formatTime, getStreamFromURL } = require("./utils");
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const axios = require("axios");

// ─────────────────────────────────────────────────────────────
//  § 1. FORMAT HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * সংখ্যাকে কমা দিয়ে ফরম্যাট করে।
 * formatNumber(1000000) → "1,000,000"
 */
function formatNumber(num) {
  return Number(num).toLocaleString("en-US");
}

/**
 * মিলিসেকেন্ডকে মানুষ-পড়ার মতো সময়ে রূপান্তর করে।
 * formatTime(90061000) → "1 day 1 hour 1 minute 1 second"
 */
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

/**
 * Bot এর চলমান uptime ফেরত দেয়।
 * getUptime() → "2 hours 30 minutes 5 seconds"
 */
function getUptime() {
  return formatTime(process.uptime() * 1000);
}

/**
 * বর্তমান তারিখ ও সময় স্ট্রিং হিসেবে দেয় (বাংলাদেশ টাইমজোন ডিফল্ট)।
 * getDateTime() → "Thursday, June 25, 2026, 11:30:45 PM"
 */
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

/** প্রথম অক্ষর বড় হাতে করে।  capitalize("hello") → "Hello" */
function capitalize(str = "") {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * দীর্ঘ টেক্সট কেটে "..." যোগ করে।
 * truncate("Hello World", 7) → "Hell..."
 */
function truncate(str = "", maxLen = 100) {
  return str.length > maxLen ? str.slice(0, maxLen - 3) + "..." : str;
}

/** স্ট্রিং থেকে emoji সরায়। */
function removeEmoji(str = "") {
  return str
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FEFF}]/gu, "")
    .trim();
}

/**
 * র‍্যান্ডম alphanumeric ID তৈরি করে।
 * generateID(8) → "aB3xKp9Z"
 */
function generateID(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/**
 * Command args parse করে, quoted strings সাপোর্ট করে।
 * parseArgs('hello "world peace" 123') → ["hello", "world peace", "123"]
 */
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

/** অ্যারে থেকে র‍্যান্ডম একটি আইটেম। */
function randomItem(arr = []) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Fisher-Yates shuffle — মূল অ্যারে পরিবর্তন করে না। */
function shuffleArray(arr = []) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * অ্যারেকে সমান আকারের ভাগে বিভক্ত করে (pagination এ কাজে আসে)।
 * chunkArray([1,2,3,4,5], 2) → [[1,2],[3,4],[5]]
 */
function chunkArray(arr = [], size = 10) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/** দুটি অ্যারের পার্থক্য: a তে আছে কিন্তু b তে নেই। */
function arrayDiff(a = [], b = []) {
  const setB = new Set(b);
  return a.filter(x => !setB.has(x));
}

// ─────────────────────────────────────────────────────────────
//  § 4. MATH HELPERS
// ─────────────────────────────────────────────────────────────

/** min ও max এর মধ্যে (inclusive) র‍্যান্ডম পূর্ণসংখ্যা। */
function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** সংখ্যাকে নির্দিষ্ট সীমায় আটকে রাখে। clamp(150, 0, 100) → 100 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** শতাংশ বের করে। percentage(25, 200) → 12.5 */
function percentage(part, total) {
  if (!total) return 0;
  return parseFloat(((part / total) * 100).toFixed(2));
}

// ─────────────────────────────────────────────────────────────
//  § 5. FILE & PATH HELPERS
// ─────────────────────────────────────────────────────────────

/** ফাইল/ফোল্ডার আছে কিনা check। */
function fileExists(filePath) {
  try { return fs.existsSync(filePath); } catch { return false; }
}

/**
 * JSON ফাইল পড়ে।  না থাকলে বা ভুল JSON হলে defaultValue দেয়।
 * readJSON("./data/users.json", [])
 */
function readJSON(filePath, defaultValue = {}) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return defaultValue;
  }
}

/**
 * Object কে JSON ফাইলে লেখে। ফোল্ডার না থাকলে তৈরি করে।
 * writeJSON("./data/users.json", users)  → true | false
 */
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

/**
 * tmp/ ফোল্ডারে ফাইল সেভ করে path রিটার্ন করে।
 * GoatBot root এর tmp/ ফোল্ডার ব্যবহার করে (utils.js যেখানে আছে)।
 * saveTmp("image.jpg", buffer) → "/absolute/path/tmp/image.jpg"
 */
function saveTmp(filename, data) {
  // utils.js থেকে দুই লেভেল উপরে গেলে GoatBot root পাওয়া যায় না,
  // তাই process.cwd() ব্যবহার করছি — এটা সবসময় bot এর root দেখায়।
  const tmpDir = path.join(process.cwd(), "tmp");
  fs.mkdirSync(tmpDir, { recursive: true });
  const dest = path.join(tmpDir, filename);
  fs.writeFileSync(dest, data);
  return dest;
}

/** tmp ফাইল ডিলিট করে (message পাঠানোর পরে ব্যবহার করো)। */
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

/**
 * URL থেকে readable stream রিটার্ন করে।
 * GoatBot এ api.sendMessage({ attachment: await getStreamFromURL(url) }, threadID)
 */
async function getStreamFromURL(url, options = {}) {
  const response = await axios.get(url, {
    responseType: "stream",
    timeout: 30_000,
    headers: { "User-Agent": "Mozilla/5.0" },
    ...options,
  });
  return response.data;
}

/**
 * URL থেকে ছবি/ফাইল ডাউনলোড করে buffer রিটার্ন করে।
 * const buf = await downloadBuffer(url);
 */
async function downloadBuffer(url, options = {}) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30_000,
    headers: { "User-Agent": "Mozilla/5.0" },
    ...options,
  });
  return Buffer.from(response.data);
}

/**
 * GET request করে JSON ডেটা রিটার্ন করে।
 * const data = await fetchJSON("https://api.example.com/cats");
 */
async function fetchJSON(url, options = {}) {
  const response = await axios.get(url, {
    timeout: 15_000,
    headers: { "User-Agent": "Mozilla/5.0" },
    ...options,
  });
  return response.data;
}

/** স্ট্রিং একটি ভ্যালিড URL কিনা check করে। */
function isValidURL(str) {
  try { new URL(str); return true; } catch { return false; }
}

// ─────────────────────────────────────────────────────────────
//  § 7. GOATBOT V2 — SPECIFIC HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * GoatBot V2 এর permission system অনুযায়ী role check করে।
 *
 * role:
 *   0 = সবাই ব্যবহার করতে পারবে
 *   1 = শুধু group admin + bot admin
 *   2 = শুধু bot admin (adminBot in config.json)
 *
 * GoatBot V2 তে adminIDs thread data এর ভেতরে থাকে।
 * এই function সেটা সরাসরি global.GoatBot config থেকে নেয়।
 */
function checkRole(event, role = 0) {
  if (role === 0) return true;

  const { senderID } = event;
  const adminBot = global.GoatBot?.config?.adminBot ?? [];

  if (adminBot.includes(senderID)) return true; // bot admin সব পারে

  if (role === 1) {
    // group admin check: GoatBot V2 handler এ event.isGroup ও
    // event.participantIDs থেকে adminIDs আলাদাভাবে আসে না,
    // তাই global.GoatBot.threadInfo Map থেকে নেওয়া সবচেয়ে নির্ভরযোগ্য।
    const threadInfo = global.GoatBot?.threadInfo?.get?.(event.threadID);
    const adminIDs   = (threadInfo?.adminIDs ?? []).map(a => (typeof a === "object" ? a.id : a));
    if (adminIDs.includes(senderID)) return true;
  }

  return false;
}

/**
 * GoatBot V2 db controller থেকে user name বের করে।
 * যদি db না পাওয়া যায় তাহলে fallback দেয়।
 */
async function getUserName(userID) {
  try {
    // GoatBot V2 তে Users model global.db.allUserData এ থাকে না,
    // বরং database/controller/users.js এর findOne দিয়ে পাওয়া যায়।
    const userInfo = await global.db?.allUserData?.find(u => u.userID == userID);
    return userInfo?.name ?? `User ${userID}`;
  } catch {
    return `User ${userID}`;
  }
}

/**
 * Thread নাম বের করে।
 */
async function getThreadName(threadID) {
  try {
    const threadInfo = await global.db?.allThreadData?.find(t => t.threadID == threadID);
    return threadInfo?.threadName ?? `Thread ${threadID}`;
  } catch {
    return `Thread ${threadID}`;
  }
}

/**
 * GoatBot V2 style message পাঠায়।
 * auto-delete চাইলে deleteAfterMs দাও (milliseconds)।
 *
 * @example
 * await sendMessage(api, event, "হ্যালো!", 5000); // 5 সেকেন্ড পর ডিলিট
 */
async function sendMessage(api, event, message, deleteAfterMs = 0) {
  const msg = await api.sendMessage(message, event.threadID, event.messageID);
  if (deleteAfterMs > 0 && msg?.messageID) {
    setTimeout(async () => {
      try { await api.unsendMessage(msg.messageID); } catch { /* already deleted */ }
    }, deleteAfterMs);
  }
  return msg;
}

/**
 * Cooldown ম্যানেজ করার class।
 *
 * @example
 * const cd = new CooldownManager(5000); // 5 সেকেন্ড
 *
 * if (cd.isOnCooldown(event.senderID)) {
 *   return api.sendMessage(
 *     `⏳ আরও ${cd.getRemaining(event.senderID)}s অপেক্ষা করো।`,
 *     event.threadID
 *   );
 * }
 * cd.set(event.senderID);
 */
class CooldownManager {
  constructor(cooldownMs = 5000) {
    this.cooldownMs = cooldownMs;
    this._map = new Map();
  }

  isOnCooldown(userID) {
    if (!this._map.has(userID)) return false;
    return Date.now() - this._map.get(userID) < this.cooldownMs;
  }

  /** বাকি সময় সেকেন্ডে ফেরত দেয়। */
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

/** Facebook UID ভ্যালিড কিনা (10–20 সংখ্যা)। */
function isValidUID(uid) {
  return /^\d{10,20}$/.test(String(uid ?? ""));
}

/** পজিটিভ সংখ্যা কিনা। */
function isPositiveNumber(val) {
  const n = Number(val);
  return !isNaN(n) && n > 0;
}

/** ইনপুট থেকে mention করা UID গুলো বের করে। */
function getMentions(event) {
  return Object.keys(event?.mentions ?? {});
}

// ─────────────────────────────────────────────────────────────
//  § 9. LOGGER (রঙিন console output)
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

  // § 9 — Logger
  logger,
};
