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

        // Draw an image clipped into an ELLIPSE (matches the background's oval frames),
        // with a white border ring drawn first.
        function drawInOval(ctx, img, cx, cy, rx, ry) {
          // white border ring
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx + 6, ry + 6, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.save();
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          if (img) {
            // draw image to fully cover the ellipse's bounding box
            ctx.drawImage(img, cx - rx, cy - ry, rx * 2, ry * 2);
          } else {
            ctx.fillStyle = "#DDDDDD";
            ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
          }
          ctx.restore();
        }

        // ===== Positions measured from the background template's two oval frames =====
        // Tweak these 6 numbers if your background image differs slightly.
        const TOP_OVAL    = { cx: 515, cy: 150, rx: 95,  ry: 112 };
        const BOTTOM_OVAL = { cx: 655, cy: 415, rx: 112, ry: 125 };

        drawInOval(ctx, senderImg, TOP_OVAL.cx, TOP_OVAL.cy, TOP_OVAL.rx, TOP_OVAL.ry);
        drawInOval(ctx, matchImg, BOTTOM_OVAL.cx, BOTTOM_OVAL.cy, BOTTOM_OVAL.rx, BOTTOM_OVAL.ry);

        // Heart between the two ovals (roughly on the line connecting their centers)
        const heartX = (TOP_OVAL.cx + BOTTOM_OVAL.cx) / 2;
        const heartY = (TOP_OVAL.cy + BOTTOM_OVAL.cy) / 2;
        ctx.fillStyle = "#FF4D6D";
        ctx.font = "bold 46px Arial";
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
