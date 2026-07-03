const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "pair",
    author: "Ew'r Saim X Ariyan",
    category: "love",
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      // Get sender info
      const senderData = await usersData.get(event.senderID);
      const senderName = senderData?.name || "User";

      // Get thread info
      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData?.userInfo || [];

      if (users.length === 0) {
        return api.sendMessage("❌ No users found in this group.", event.threadID, event.messageID);
      }

      // Get sender gender
      const senderUser = users.find(u => u.id === event.senderID);
      if (!senderUser || !senderUser.gender) {
        return api.sendMessage("⚠️ Your gender is not set. Cannot find a match.", event.threadID, event.messageID);
      }

      const senderGender = senderUser.gender.toUpperCase();

      // Find opposite gender users
      let oppositeGender = senderGender === "MALE" ? "FEMALE" : "MALE";
      let matchCandidates = users.filter(user => 
        user.id !== event.senderID && 
        user.gender && 
        user.gender.toUpperCase() === oppositeGender
      );

      if (matchCandidates.length === 0) {
        return api.sendMessage(`❌ No ${oppositeGender.toLowerCase()} users found in this group.`, event.threadID, event.messageID);
      }

      // Select random match
      const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
      
      if (!selectedMatch || !selectedMatch.id) {
        return api.sendMessage("❌ Error selecting match.", event.threadID, event.messageID);
      }

      const matchName = selectedMatch.name || "Unknown User";

      try {
        // Create canvas
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Load background image from catbox
        let bgImage;
        try {
          bgImage = await loadImage("https://files.catbox.moe/29jl5s.jpg");
          ctx.drawImage(bgImage, 0, 0, width, height);
        } catch (e) {
          // Fallback: pink background
          ctx.fillStyle = "#FF69B4";
          ctx.fillRect(0, 0, width, height);
        }

        // Get profile pictures
        const senderImg = await loadImage(
          `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        ).catch(() => null);

        const matchImg = await loadImage(
          `https://graph.facebook.com/${selectedMatch.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        ).catch(() => null);

        // Draw circles with white border
        function drawCircle(ctx, img, x, y, size) {
          // White border
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, size / 2 + 5, 0, Math.PI * 2);
          ctx.fill();

          // Image circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          if (img) {
            ctx.drawImage(img, x, y, size, size);
          }
          ctx.restore();
        }

        // Draw profile pictures - centered position
        if (senderImg) drawCircle(ctx, senderImg, 150, 200, 150);
        if (matchImg) drawCircle(ctx, matchImg, 500, 200, 150);

        // Heart in middle
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("💕", width / 2, 330);

        // Save image
        const outputPath = path.join(__dirname, "pair_output.png");
        const stream = canvas.createPNGStream();
        const out = fs.createWriteStream(outputPath);
        
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
              try { fs.unlinkSync(outputPath); } catch (e) {}
            },
            event.messageID
          );
        });

        out.on("error", (err) => {
          api.sendMessage(`❌ Image error: ${err.message}`, event.threadID, event.messageID);
        });

      } catch (canvasError) {
        api.sendMessage(`❌ Canvas error: ${canvasError.message}`, event.threadID, event.messageID);
      }

    } catch (error) {
      api.sendMessage(
        `❌ Error: ${error.message || "Unknown error"}`,
        event.threadID,
        event.messageID
      );
    }
  },
};
