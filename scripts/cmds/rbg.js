const axios = require("axios");

const apiKey = "66e0cfbb-62b8-4829-90c7-c78cacc72ae2";

module.exports = {
  config: {
    name: "rbg",
    version: "1.0",
    author: "Aizen_here",
    category: "image",
    shortDescription: "Remove background from image",
    longDescription: "Removes background from replied or attached image using removebgv3 API",
    guide: "{pn} (reply to image)"
  },

  onStart: async function({ api, event, args }) {
    try {
      let imageUrl = "";

      if (event.type === "message_reply" && event.messageReply?.attachments?.length) {
        imageUrl = event.messageReply.attachments[0].url;
      } else if (event.attachments?.length) {
        imageUrl = event.attachments[0].url;
      } else {
        return api.sendMessage("❌ Please reply to or attach an image.", event.threadID, event.messageID);
      }

      if (!imageUrl) {
        return api.sendMessage("❌ Couldn't get a valid image URL from that attachment.", event.threadID, event.messageID);
      }

      const apiUrl = `https://kaiz-apis.gleeze.com/api/removebgv3?url=${encodeURIComponent(imageUrl)}&stream=true&apikey=${apiKey}`;

      const response = await axios({
        method: "GET",
        url: apiUrl,
        responseType: "stream",
        timeout: 30000
      });

      const contentType = response.headers["content-type"] || "";
      if (!contentType.startsWith("image/")) {
        // API didn't return an image — likely an error payload
        let chunks = [];
        for await (const chunk of response.data) chunks.push(chunk);
        const bodyText = Buffer.concat(chunks).toString("utf8");
        console.error("rbg: non-image response:", bodyText);
        return api.sendMessage("❌ Failed to remove background (API error, check logs).", event.threadID, event.messageID);
      }

      return api.sendMessage({
        attachment: response.data
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error("rbg command error:", error.response?.data || error.message || error);
      return api.sendMessage("❌ Failed to remove background.", event.threadID, event.messageID);
    }
  }
};
