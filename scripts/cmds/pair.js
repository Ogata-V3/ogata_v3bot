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
      const senderData = await usersData.get(event.senderID);
      const senderName = senderData?.name || "User";

      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData?.userInfo || [];

      if (users.length === 0) {
        return api.sendMessage("❌ No users found in this group.", event.threadID, event.messageID);
      }

      const senderUser = users.find(u => u.id === event.senderID);
      if (!senderUser || !senderUser.gender) {
        return api.sendMessage("⚠️ Your gender is not set. Cannot find a match.", event.threadID, event.messageID);
      }

      const senderGender = senderUser.gender.toUpperCase();
      let oppositeGender = senderGender === "MALE" ? "FEMALE" : "MALE";
      let matchCandidates = users.filter(user =>
        user.id !== event.senderID &&
        user.gender &&
        user.gender.toUpperCase() === oppositeGender
      );

      if (matchCandidates.length === 0) {
        return api.sendMessage(`❌ No ${oppositeGender.toLowerCase()} users found in this group.`, event.threadID, event.messageID);
      }

      const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
      if (!selectedMatch || !selectedMatch.id) {
        return api.sendMessage("❌ Error selecting match.", event.threadID, event.messageID);
      }

      const matchName = selectedMatch.name || "Unknown User";

      try {
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        try {
          const bgImage = await loadImage("https://files.catbox.moe/29jl5s.jpg");
          ctx.drawImage(bgImage, 0, 0, width, height);
        } catch (e) {
          ctx.fillStyle = "#FF69B4";
          ctx.fillRect(0, 0, width, height);
        }

        const senderImg = await loadImage(
          `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        ).catch(() => null);

        const matchImg = await loadImage(
          `https://graph.facebook.com/${selectedMatch.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        ).catch(() => null);

        function drawCircleProfile(ctx, img, cx, cy, radius) {
          // সাদা border
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.restore();

          // ছবি clip করে বসানো
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          if (img) {
            ctx.drawImage(img, cx - radius, cy - radius, radius * 2, radius * 2);
          } else {
            ctx.fillStyle = "#CCCCCC";
            ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
          }
          ctx.restore();
        }

        // Screenshot বিশ্লেষণ:
        // Sender: বামে একটু ডানে এবং উপরে যেতে হবে
        // Match: ডানে আরো ডানে এবং একটু উপরে যেতে হবে
        const FRAME_1 = { cx: 360, cy: 170, r: 88 };  // sender - ডানে সরানো
        const FRAME_2 = { cx: 580, cy: 385, r: 95 };  // match - ডানে ও উপরে সরানো

        drawCircleProfile(ctx, senderImg, FRAME_1.cx, FRAME_1.cy, FRAME_1.r);
        drawCircleProfile(ctx, matchImg, FRAME_2.cx, FRAME_2.cy, FRAME_2.r);

        // Heart মাঝখানে
        const heartX = (FRAME_1.cx + FRAME_2.cx) / 2;
        const heartY = (FRAME_1.cy + FRAME_2.cy) / 2;
        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#FF4D6D";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("♥", heartX, heartY);

        const outputPath = path.join(__dirname, `pair_${event.senderID}_${Date.now()}.png`);
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
            { body: message, attachment: fs.createReadStream(outputPath) },
            event.threadID,
            () => { try { fs.unlinkSync(outputPath); } catch (e) {} },
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
      api.sendMessage(`❌ Error: ${error.message || "Unknown error"}`, event.threadID, event.messageID);
    }
  },
};
