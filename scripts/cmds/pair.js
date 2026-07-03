const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pair",
    author: "Zoro",
    category: "love",
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const senderData = await usersData.get(event.senderID);
      const senderName = senderData.name;
      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData.userInfo || [];

      if (!users || users.length === 0) {
        return api.sendMessage("❌ Could not get user info from this group.", event.threadID, event.messageID);
      }

      const myData = users.find((user) => user.id === event.senderID);
      if (!myData) {
        return api.sendMessage("⚠️ Could not find your data in the group.", event.threadID, event.messageID);
      }

      const myGender = myData.gender ? myData.gender.toUpperCase() : null;
      if (!myGender || (myGender !== "MALE" && myGender !== "FEMALE")) {
        return api.sendMessage("⚠️ Your gender is not set or undefined. Cannot find a match.", event.threadID, event.messageID);
      }

      let matchCandidates = [];

      if (myGender === "MALE") {
        matchCandidates = users.filter(user => user.gender && user.gender.toUpperCase() === "FEMALE" && user.id !== event.senderID);
      } else if (myGender === "FEMALE") {
        matchCandidates = users.filter(user => user.gender && user.gender.toUpperCase() === "MALE" && user.id !== event.senderID);
      }

      if (matchCandidates.length === 0) {
        return api.sendMessage("❌ No suitable match found in the group.", event.threadID, event.messageID);
      }

      const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
      const matchName = selectedMatch.name || "Unknown";

      const width = 800;
      const height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Load background
      let background;
      try {
        background = await loadImage("https://files.catbox.moe/29jl5s.jpg");
      } catch (e) {
        // Fallback: create solid background
        ctx.fillStyle = "#FF69B4";
        ctx.fillRect(0, 0, width, height);
      }
      
      if (background) {
        ctx.drawImage(background, 0, 0, width, height);
      }

      // Load profile pictures
      let sIdImage, pairPersonImage;
      try {
        sIdImage = await loadImage(
          `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        );
      } catch (e) {
        api.sendMessage("⚠️ Could not load your profile picture.", event.threadID, event.messageID);
        return;
      }

      try {
        pairPersonImage = await loadImage(
          `https://graph.facebook.com/${selectedMatch.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        );
      } catch (e) {
        api.sendMessage("⚠️ Could not load match's profile picture.", event.threadID, event.messageID);
        return;
      }

      // Draw circular avatars
      function drawCircle(ctx, img, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }

      drawCircle(ctx, sIdImage, 385, 40, 170);
      drawCircle(ctx, pairPersonImage, width - 213, 190, 170);

      // Add text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("💕 PAIR MATCH 💕", width / 2, height - 30);

      // Save to file
      const outputPath = path.join(__dirname, "pair_output.png");
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on("finish", () => {
        const lovePercent = Math.floor(Math.random() * 31) + 70;

        const message = `🥰 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 𝗽𝗮𝗶𝗿𝗶𝗻𝗴
・${senderName} 🎀
・${matchName} 🎀
💌 𝗪𝗶𝘀𝗵 𝘆𝗼𝘂 𝘁𝘄𝗼 𝗵𝘂𝗻𝗱𝗿𝗲𝗱 𝘆𝗲𝗮𝗿𝘀 𝗼𝗳 𝗵𝗮𝗽𝗽𝗶𝗻𝗲𝘀𝘀 ❤️❤️

𝗟𝗼𝘃𝗲 𝗣𝗲𝗿𝗰𝗲𝗻𝘁𝗮𝗴𝗲: ${lovePercent}% 💙`;

        api.sendMessage(
          {
            body: message,
            attachment: fs.createReadStream(outputPath),
          },
          event.threadID,
          () => {
            fs.unlinkSync(outputPath);
          },
          event.messageID
        );
      });

      out.on("error", (err) => {
        api.sendMessage("❌ Error creating image: " + err.message, event.threadID, event.messageID);
      });

    } catch (error) {
      api.sendMessage(
        "❌ An error occurred: " + (error.message || "Unknown error"),
        event.threadID,
        event.messageID
      );
    }
  },
};
