const handlerCheckDB = require("./handlerCheckData.js");

// ─────────────────────────────────────────────────────────────
//  HUMAN BEHAVIOR CONFIG
// ─────────────────────────────────────────────────────────────
const HUMAN_CONFIG = {
  // Reply delay range (ms) — সব সময় ২-৩ সেকেন্ডের মধ্যে random
  minDelay: 2000,
  maxDelay: 3000,

  // Spam protection — একই user কে এত ms এর মধ্যে reply না
  cooldownMs: 2000,

  // Normal chat (prefix ছাড়া) এর ক্ষেত্রে কতক্ষণ পর পর একটা মেসেজ ignore করবে (human এর মতো মাঝে মাঝে miss)
  normalChatIgnoreIntervalMin: 2 * 60 * 1000, // 2 min
  normalChatIgnoreIntervalMax: 3 * 60 * 1000, // 3 min
};

// Cooldown tracker
const cooldownMap = new Map();

// Normal chat ignore টাইমার ট্র্যাকার
let lastNormalChatIgnoreTime = 0;
let nextIgnoreInterval = getRandomInt(
  HUMAN_CONFIG.normalChatIgnoreIntervalMin,
  HUMAN_CONFIG.normalChatIgnoreIntervalMax
);

// ─────────────────────────────────────────────────────────────
//  HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getReplyDelay() {
  return getRandomInt(HUMAN_CONFIG.minDelay, HUMAN_CONFIG.maxDelay);
}

function isOnCooldown(userID) {
  if (!cooldownMap.has(userID)) return false;
  return Date.now() - cooldownMap.get(userID) < HUMAN_CONFIG.cooldownMs;
}

function setCooldown(userID) {
  cooldownMap.set(userID, Date.now());
}

// Typing indicator পাঠানো — callback style আর promise style দুইটাই handle করে
function sendTyping(api, threadID) {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    try {
      const maybePromise = api.sendTypingIndicator(threadID, (err) => {
        if (err) console.error("[TypingIndicator Callback Error]", err?.message || err);
        done();
      });
      if (maybePromise && typeof maybePromise.then === "function") {
        maybePromise.then(done).catch((err) => {
          console.error("[TypingIndicator Promise Error]", err?.message || err);
          done();
        });
      }
      // Callback না এলেও যেন আটকে না থাকে — fallback timeout
      setTimeout(done, 700);
    } catch (err) {
      console.error("[TypingIndicator Throw]", err?.message || err);
      done();
    }
  });
}

// পুরো delay জুড়ে প্রতি ~2 সেকেন্ডে typing indicator resend করে (expire হয়ে গেলেও যেন দেখা যায়)
async function humanDelayWithTyping(api, threadID) {
  const totalDelay = getReplyDelay();
  const keepAliveMs = 2000;
  const startTime = Date.now();

  await sendTyping(api, threadID);

  while (Date.now() - startTime < totalDelay) {
    const remaining = totalDelay - (Date.now() - startTime);
    const waitChunk = Math.min(keepAliveMs, remaining);
    await new Promise(r => setTimeout(r, waitChunk));

    if (Date.now() - startTime < totalDelay) {
      await sendTyping(api, threadID);
    }
  }
}

// প্রেফিক্স দিয়ে শুরু হয়েছে কিনা চেক করে — মানে এটা একটা command কিনা
function isCommandMessage(body) {
  const prefix = global.GoatBot?.config?.prefix ?? "!";
  if (typeof body !== "string") return false;
  return body.trim().startsWith(prefix);
}

// প্রতি ~2-3 মিনিটে একবার normal chat (prefix ছাড়া) মেসেজ ignore করার জন্য
function shouldIgnoreNormalChat() {
  const now = Date.now();
  if (now - lastNormalChatIgnoreTime >= nextIgnoreInterval) {
    lastNormalChatIgnoreTime = now;
    // পরের ignore এর জন্য নতুন random interval সেট করো
    nextIgnoreInterval = getRandomInt(
      HUMAN_CONFIG.normalChatIgnoreIntervalMin,
      HUMAN_CONFIG.normalChatIgnoreIntervalMax
    );
    return true;
  }
  return false;
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

  // Wrap reply with typing indicator (keep-alive) + 2-3s human delay
  const originalReply = baseMessage.reply.bind(baseMessage);
  baseMessage.reply = async (msg, callback) => {
    // Typing indicator পুরো delay জুড়ে চালু রাখে (auto-expire হলে resend করে)
    await humanDelayWithTyping(api, event.threadID);

    // Reply করো (error হলেও bot crash করবে না)
    try {
      return await originalReply(msg, callback);
    } catch (err) {
      console.error("[Reply Error]", err?.message || err);
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

      if (event.type === "message") {
        const isCommand = isCommandMessage(event.body);

        if (isCommand) {
          // ── Command হলে কখনোই ignore হবে না, শুধু spam-cooldown প্রযোজ্য
          if (isOnCooldown(senderID)) return;
          setCooldown(senderID);
        } else {
          // ── Normal chat (prefix ছাড়া) — প্রতি ~2-3 মিনিটে একবার একটা মেসেজ ignore করবে
          if (isOnCooldown(senderID)) return;
          setCooldown(senderID);

          if (shouldIgnoreNormalChat()) return;
        }

        // Mark as seen
        try { api.markAsRead(event.threadID); } catch (err) {
          console.error("[MarkAsRead Error]", err?.message || err);
        }
      }

      // Human-like message wrapper তৈরি করো (typing + delay সহ)
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
      // Silent fail — bot কখনো crash করবে না, শুধু log হবে
      console.error("[HandlerAction Error]", err?.message || err);
    }
  };
};
