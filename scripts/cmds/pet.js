const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "pet",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Ajmaul",
  description: "Pet a tagged user",
  commandCategory: "🤣funny🤣",
  usages: "pet [@mention/reply/UID/link/name]",
  cooldowns: 5
};

// ===== Helper: Full Name Mention Detection =====
async function getUIDByFullName(api, threadID, body) {
  if (!body.includes("@")) return null;
  
  const match = body.match(/@(.+)/);
  if (!match) return null;
  
  const targetName = match[1].trim().toLowerCase().replace(/\s+/g, " ");
  const threadInfo = await api.getThreadInfo(threadID);
  const users = threadInfo.userInfo || [];
  
  const user = users.find(u => {
    if (!u.name) return false;
    const fullName = u.name.trim().toLowerCase().replace(/\s+/g, " ");
    return fullName === targetName;
  });
  
  return user ? user.id : null;
}

module.exports.run = async function ({ api, event, Users, args }) {
  try {
    const { threadID, messageID, senderID } = event;
    
    // ===== Determine targetID in three ways =====
    let targetID;
    let userName = "";
    
    if (event.type === "message_reply") {
      // Way 1: Reply to a message
      targetID = event.messageReply.senderID;
      try {
        const userInfo = await api.getUserInfo(targetID);
        userName = userInfo[targetID]?.name || "Friend";
      } catch (e) {
        userName = "Friend";
      }
    } else if (args[0]) {
      if (args[0].indexOf(".com/") !== -1) {
        // Way 2: Facebook profile link
        try {
          targetID = await api.getUID(args[0]);
          const userInfo = await api.getUserInfo(targetID);
          userName = userInfo[targetID]?.name || "Friend";
        } catch (e) {
          console.error("Error getting UID from link:", e);
          return api.sendMessage("❌Facebook লিঙ্ক থেকে আইডি পাওয়া যায়নি!", threadID, messageID);
        }
      } else if (args.join().includes("@")) {
        // Way 3: Mention or full name
        // 3a: Direct Facebook mention
        targetID = Object.keys(event.mentions || {})[0];
        if (targetID) {
          userName = event.mentions[targetID] || "Friend";
          // Remove @ symbol if present
          userName = userName.replace("@", "");
        } else {
          // 3b: Full name detection
          targetID = await getUIDByFullName(api, threadID, args.join(" "));
          if (targetID) {
            const userInfo = await api.getUserInfo(targetID);
            userName = userInfo[targetID]?.name || "Friend";
          }
        }
      } else {
        // Direct UID
        targetID = args[0];
        try {
          const userInfo = await api.getUserInfo(targetID);
          userName = userInfo[targetID]?.name || "Friend";
        } catch (e) {
          userName = "Friend";
        }
      }
    } else if (Object.keys(event.mentions || {}).length > 0) {
      // Traditional mention
      targetID = Object.keys(event.mentions)[0];
      userName = event.mentions[targetID] || "Friend";
      userName = userName.replace("@", "");
    } else {
      return api.sendMessage(
        "❌কাউকে ম্যানশন করো বা রিপ্লাই করো",
        threadID,
        messageID
      );
    }
    
    if (!targetID) {
      return api.sendMessage(
        "❌রাহাদ বসকে ডাক দে🫩\nকীভাবে কমান্ড ব্যবহার করতে হয় শিখায় দিবো🥴",
        threadID,
        messageID
      );
    }
    
    // Check if trying to pet oneself
    if (targetID === senderID) {
      return api.sendMessage("❌নিজের মেসেজ এর রিপ্লাই দিলে হবে না🐸", threadID, messageID);
    }
    
    // Get user name if not already got
    if (!userName || userName === "Friend") {
      try {
        const userInfo = await api.getUserInfo(targetID);
        userName = userInfo[targetID]?.name || "Friend";
      } catch (e) {
        userName = "Friend";
      }
    }
    
    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/pet?userid=${targetID}`;

    const res = await axios.get(apiUrl, { responseType: "arraybuffer" });
    const contentType = res.headers["content-type"] || "";

    let ext = "jpg";
    if (contentType.includes("gif")) ext = "gif";
    else if (contentType.includes("mp4")) ext = "mp4";

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = path.join(cacheDir, `pet_${targetID}.${ext}`);
    fs.writeFileSync(filePath, res.data);
    
    const petMessages = [
      `🐾 ${userName} কে আদর করা হচ্ছে`,
      `😻 ${userName} কে আদর করতে ভালোই লাগে😶`,
      `💕 ${userName} কে আদর করছি!`,
      `🐕 ${userName} ভালো বাচ্ছা!`,
      `❤️ ${userName} কে আদরের ঝাপি!`
    ];
    
    const randomMessage = petMessages[Math.floor(Math.random() * petMessages.length)];

    api.sendMessage(
      {
        body: randomMessage,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      () => fs.unlinkSync(filePath),
      messageID
    );
  } catch (err) {
    console.error("❌ pet command error:", err);
    api.sendMessage(
      "⚠️ API তে সমস্যা হয়েছে, পরে চেষ্টা করুন!",
      event.threadID,
      event.messageID
    );
  }
};
