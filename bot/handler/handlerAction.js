const handlerCheckDB = require("./handlerCheckData.js");

// ─────────────────────────────────────────────────────────────
//  HUMAN BEHAVIOR CONFIG
// ─────────────────────────────────────────────────────────────
const HUMAN_CONFIG = {
  // Active hours (24h format) — bot slow/fast এর সময়
  activeHours: { start: 8, end: 23 }, // সকাল ৮টা - রাত ১১টা

  // Typing delay (ms per word)
  typingSpeedMs: 120,

  // Min/Max delay before replying
  minDelay: 800,
  maxDelay: 4500,

  // Night mode delay (রাতে slow)
  nightMinDelay: 3000,
  nightMaxDelay: 9000,

  // Seen delay — message দেখার পর reply এর আগে
  seenDelay: { min: 1000, max: 5000 },

  // React only chance (reply না করে শুধু react করার % chance)
  reactOnlyChance: 8, // 8% chance

  // Random ignore chance (কিছু message ignore করবে)
  ignoreChance: 3, // 3% chance

  // Spam protection — একই user কে এত ms এর মধ্যে reply না
  cooldownMs: 2000,
};

// Emojis for random reactions
const REACT_EMOJIS = ["😊", "👍", "❤️", "😂", "🔥", "✨", "😎", "💯"];

// Cooldown tracker
const cooldownMap = new Map();

// ─────────────────────────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function isNightTime() {
  const hour = new Date().toLocaleString("en-US", {
    timeZone: global.GoatBot?.config?.timeZone || "Asia/Dhaka",
    hour: "numeric",
    hour12: false
  });
  const h = parseInt(hour);
  return h < HUMAN_CONFIG.activeHours.start || h >= HUMAN_CONFIG.activeHours.end;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTypingDelay(text = "") {
  const words = String(text).split(" ").length;
  const baseDelay = words * HUMAN_CONFIG.typingSpeedMs;
  const night = isNightTime();

  const min = night ? HUMAN_CONFIG.nightMinDelay : HUMAN_CONFIG.minDelay;
  const max = night ? HUMAN_CONFIG.nightMaxDelay : HUMAN_CONFIG.maxDelay;

  // Clamp between min and max
  return Math.min(Math.max(baseDelay, min), max);
}

function shouldIgnore() {
  return Math.random() * 100 < HUMAN_CONFIG.ignoreChance;
}

function shouldReactOnly() {
  return Math.random() * 100 < HUMAN_CONFIG.reactOnlyChance;
}

function getRandomEmoji() {
  return REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];
}

function isOnCooldown(userID) {
  if (!cooldownMap.has(userID)) return false;
  return Date.now() - cooldownMap.get(userID) < HUMAN_CONFIG.cooldownMs;
}

function setCooldown(userID) {
  cooldownMap.set(userID, Date.now());
}

async function humanDelay(text = "") {
  const delay = getTypingDelay(text);
  await new Promise(r => setTimeout(r, delay));
}

async function seenDelay() {
  const delay = getRandomInt(
    HUMAN_CONFIG.seenDelay.min,
    HUMAN_CONFIG.seenDelay.max
  );
  await new Promise(r => setTimeout(r, delay));
}

// ─────────────────────────────────────────────────────────────
//  HUMAN-LIKE API WRAPPER
// ─────────────────────────────────────────────────────────────

function createHumanMessage(api, event) {
  const messageFunc = global.utils?.message;
  const baseMessage = typeof messageFunc === "function"
    ? messageFunc(api, event)
    : {
        reply: (msg) => api.sendMessage(msg, event.threadID),
        send: (msg) => api.sendMessage(msg, event.threadID),
        delete: (msgID) => api.unsendMessage(msgID || event.messageID),
      };

  // Wrap reply with human delay + typing indicator
  const originalReply = baseMessage.reply.bind(baseMessage);
  baseMessage.reply = async (msg, callback) => {
    try {
      // Typing indicator চালু
      await api.sendTypingIndicator(event.threadID);
      // Human delay
      await humanDelay(typeof msg === "string" ? msg : msg?.body || "");
      // Reply করো
      return await originalReply(msg, callback);
    } catch {
      return await originalReply(msg, callback);
    }
  };

  return baseMessage;
}

// ─────────────────────────────────────────────────────────────
//  MAIN HANDLER
// ─────────────────────────────────────────────────────────────

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
  const handlerEvents = require(
    process.env.NODE_ENV == "development"
      ? "./handlerEvents.dev.js"
      : "./handlerEvents.js"
  )(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);

  return async function (event) {
    try {
      // Anti inbox check
      if (
        global.GoatBot.config.antiInbox == true &&
        (event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
        (event.senderID || event.userID || event.isGroup == false)
      ) return;

      const senderID = event.senderID || event.userID;

      // ── Message type হলে human behavior apply করো
      if (event.type === "message" || event.type === "message_reply") {

        // Spam protection
        if (isOnCooldown(senderID)) return;
        setCooldown(senderID);

        // Random ignore — কিছু message এ reply করবে না (human এর মতো)
        if (shouldIgnore()) return;

        // Seen delay — দেখার পর একটু দেরি করে reply
        await seenDelay();

        // Mark as seen
        try { api.markAsRead(event.threadID); } catch {}

        // React only mode — reply না করে শুধু react করবে (মাঝে মাঝে)
        if (shouldReactOnly() && event.messageID) {
          try {
            await api.setMessageReaction(
              getRandomEmoji(),
              event.messageID,
              () => {},
              true
            );
          } catch {}
          return;
        }
      }

      // Human-like message wrapper তৈরি করো
      const message = createHumanMessage(api, event);

      await handlerCheckDB(usersData, threadsData, event);
      const handlerChat = await handlerEvents(event, message);
      if (!handlerChat) return;

      const {
        onAnyEvent, onFirstChat, onStart, onChat,
        onReply, onEvent, handlerEvent, onReaction,
        typ, presence, read_receipt
      } = handlerChat;

      onAnyEvent();

      switch (event.type) {
        case "message":
        case "message_reply":
        case "message_unsend":
          onFirstChat();
          onChat();
          onStart();
          onReply();
          break;
        case "event":
          handlerEvent();
          onEvent();
          break;
        case "message_reaction":
          onReaction();
          break;
        case "typ":
          typ();
          break;
        case "presence":
          presence();
          break;
        case "read_receipt":
          read_receipt();
          break;
        default:
          break;
      }

    } catch (err) {
      // Silent fail — bot কখনো crash করবে না
      console.error("[HandlerAction Error]", err?.message || err);
    }
  };
};
