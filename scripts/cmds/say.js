const axios = require("axios");

module.exports = {
  config: {
    name: "say",
    version: "1.7",
    author: "ajmaul",
    countDown: 5,
    role: 0,
    category: "media",
    guide: "{pn} <text> (or reply to a message)",
  },

  onStart: async function ({ api, message, args, event }) {
    let text = args.join(" ");

    if (event.type === "message_reply" && event.messageReply.body) {
      text = event.messageReply.body;
    }

    if (!text) {
      return message.reply("⚠️ দয়া করে কিছু লিখুন বা একটি মেসেজে রিপ্লাই দিন!");
    }

    try {
      // Google Translate TTS (Free, no API key needed)
      const lang = "bn"; // Bengali
      const encodedText = encodeURIComponent(text);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${lang}&client=tw-ob`;

      const response = await axios.get(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        responseType: "stream",
      });

      return message.reply({
        body: `🎤 Speaking: "${text}"`,
        attachment: response.data,
      });

    } catch (e) {
      console.error("TTS Error:", e.message);
      
      // Fallback message
      return message.reply(`🐥 দুঃখিত! সমস্যা হয়েছে।\n\n📝 আপনার টেক্সট: ${text}\n\n⚠️ অডিও তৈরি করতে পারছি না। পরে চেষ্টা করুন।`);
    }
  },
};
