const moment = require("moment-timezone");

module.exports.config = {
  name: "autotimer",
  version: "3.3",
  role: 0,
  author: "Ajmaul",
  description: "⏰ প্রতি ঘণ্টায় সব গ্রুপে হেডারসহ অটো মেসেজ পাঠাবে (24-hour system)",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {

  // ⏳ বট লোড হতে ৫ সেকেন্ড অপেক্ষা করবে
  setTimeout(async () => {

    const timerData = {
      "12:00:00 AM": "🌙 মধ্যরাত! ঘুমাও, কালকের দিন নতুন আশায় শুরু করো 😴",
      "01:00:00 AM": "🌌 রাত গভীর! একটু বিশ্রাম নাও 💤",
      "02:00:00 AM": "🌠 এখনো জেগে আছো? চোখটা বন্ধ করো 😪",
      "03:00:00 AM": "🌃 রাত প্রায় শেষ, ঘুমাও বন্ধু 😴",
      "04:00:00 AM": "🌄 ভোর হতে যাচ্ছে, নতুন আলো আসছে 🌤️",
      "05:00:00 AM": "🌅 শুভ সকাল! হাসিমুখে দিন শুরু করো ☀️",
      "06:00:00 AM": "🌞 সকাল বেলা! এক কাপ চা কফি কেমন হবে ☕",
      "07:00:00 AM": "🍞 নাস্তার সময়! শরীর ভালো রাখো 💪",
      "08:00:00 AM": "🌤️ নতুন দিনের ব্যস্ততা শুরু! সফল হও ✨",
      "09:00:00 AM": "🕘 শুভ সকাল! কাজে মন দাও 💼",
      "10:00:00 AM": "🌞 সকালের সূর্য তোমার জন্য শক্তি আনুক ☀️",
      "11:00:00 AM": "🌻 সকাল শেষ! একটু বিশ্রাম নাও 😌",
      "12:00:00 PM": "🍛 দুপুরের খাবার সময়! খেয়ে নাও 😋",
      "01:00:00 PM": "😴 একটু বিশ্রাম নাও, দুপুরের ঘুম ভালো জিনিস 💤",
      "02:00:00 PM": "🌤️ বিকেল আসছে! মন ভালো রাখো ☀️",
      "03:00:00 PM": "☀️ বিকেলের রোদে হাসি ছড়াও 💛",
      "04:00:00 PM": "🌇 বিকেল শেষ! একটু শান্তি নাও ☕",
      "05:00:00 PM": "🌆 সন্ধ্যা নামছে! দিনটা কেমন কাটলো? 😊",
      "06:00:00 PM": "🌇 শুভ সন্ধ্যা! একটু সময় নিজের জন্য রাখো ✨",
      "07:00:00 PM": "🌃 রাত নামছে, মনটা শান্ত করো 💫",
      "08:00:00 PM": "🍽️ রাতের খাবার সময় 😋",
      "09:00:00 PM": "🌙 রাত গভীর হচ্ছে! বিশ্রাম নাও 🛌",
      "10:00:00 PM": "😴 শুভ রাত্রি! মিষ্টি ঘুমে চোখ বুজে ফেলো 🌠",
      "11:00:00 PM": "🌌 দিন শেষ! ঘুমানোর প্রস্তুতি নাও 💤"
    };

    console.log("✅ AutoTimer System Loaded — প্রতি ঘণ্টায় সময় চেক শুরু হয়েছে...");

    const checkTimeAndSend = async () => {
      const now = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
      const messageText = timerData[now];

      if (messageText) {
        const timeFormatted = moment().tz("Asia/Dhaka").format("hh:mm A");
        const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
        const hour = parseInt(moment().tz("Asia/Dhaka").format("HH"));
        let period = "";

        if (hour >= 4 && hour < 12) period = "সকাল";
        else if (hour >= 12 && hour < 17) period = "দুপুর";
        else if (hour >= 17 && hour < 20) period = "বিকেল";
        else if (hour >= 20 && hour < 24) period = "রাত";
        else period = "ভোর";

        const finalMessage =
`━━━━━━━━━━━━━━━━━━━━━
🕒 এখন সময়: ${period} ${timeFormatted}  
${messageText}
━━━━━━━━━━━━━━━━━━━━━
📅 DATE : ${todayDate}
🤖 𝙱𝚘𝚝 𝙾𝚠𝚗𝚎𝚛 : 𝙰𝚕𝚟𝚒-𝙱𝚘𝚜𝚜
━━━━━━━━━━━━━━━━━━━━━`;

        try {
          const allThreads = await api.getThreadList(100, null, ["INBOX"]);
          const groupThreads = allThreads.filter(t => t.isGroup);

          console.log(`🕒 ${now} → ${groupThreads.length} গ্রুপে পাঠানো হচ্ছে...`);

          for (const thread of groupThreads) {
            await api.sendMessage(finalMessage, thread.threadID);
          }

          console.log("✅ সফলভাবে সব গ্রুপে বার্তা পাঠানো হয়েছে!");
        } catch (err) {
          console.error("❌ AutoTimer Error:", err);
        }
      }
    };

    setInterval(checkTimeAndSend, 1000);
  }, 5000);
};

module.exports.onStart = () => {};
