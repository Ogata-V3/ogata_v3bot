const axios = require("axios");

module.exports = {
  config: {
    name: "say",
    version: "1.7",
    author: "Aizen",
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
      // Using alternative TTS API
      const response = await axios.get(`https://tts-api.com/tts`, {
        params: { 
          text: text,
          lang: "bn"
        },
        responseType: "stream",
      });

      message.reply({
        body: "🎤 আপনার বার্তা:",
        attachment: response.data,
      });

    } catch (e) {
      console.error("API Error:", e.message);
      message.reply("🐥 দুঃখিত, TTS API এখন উপলব্ধ নয়। পরে চেষ্টা করুন।");
    }
  },
};
