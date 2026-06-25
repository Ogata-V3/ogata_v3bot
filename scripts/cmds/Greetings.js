const last = {};
const cool = 10000;

module.exports.config = {
  name: "greetings",
  version: "5.1",
  author: "Ajmaul",
  countDown: 0,
  role: 0,
  shortDescription: "Auto greeting reply system",
  longDescription: "Replies to salam and fork/github questions automatically",
  category: "system",
  guide: { en: "Auto trigger — no manual use needed" }
};

module.exports.onStart = async function () {};

module.exports.onChat = async function ({ event, api }) {
  const t = event.threadID;
  const n = Date.now();
  if (last[t] && n - last[t] < cool) return;

  const m = (event.body || "").toLowerCase().trim();
  if (!m) return;

  const isSalam = m.includes("সালাম") ||
    m.includes("আস্সালামু") ||
    m.includes("assalam") ||
    m.includes("salam") ||
    m.includes("alaikum") ||
    m.includes("w salam");

  const isFork = m.includes("fork") ||
    m.includes("github") ||
    m.includes("repo") ||
    m.includes("git link");

  let sent = false;

  if (isSalam) {
    api.sendMessage("ওলাইকুমুস সালাম ☪️", t, event.messageID);
    sent = true;
  } else if (isFork) {
    api.sendMessage(
      "🔗 আমার GitHub Repo:\nhttps://github.com/mdajmaul/goatbot_ajmaul_83",
      t,
      event.messageID
    );
    sent = true;
  }

  if (sent) last[t] = n;
};
