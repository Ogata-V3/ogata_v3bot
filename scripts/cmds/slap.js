const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "slap",
    version: "1.0.0",
    author: "Zoro",
    countDown: 3,
    role: 0,
    shortDescription: "𝐒𝐥𝐚𝐩 𝐚 𝐮𝐬𝐞𝐫 😆",
    longDescription: "𝐒𝐥𝐚𝐩 𝐚𝐧𝐲𝐨𝐧𝐞 𝐰𝐢𝐭𝐡 𝐚 𝐟𝐮𝐧𝐧𝐲 𝐢𝐦𝐚𝐠𝐞",
    category: "fun",
    guide: {
      en: "{pn} @mention / reply"
    }
  },

  onStart: async function ({ event, message, usersData }) {
    try {
      const senderID = event.senderID;

      let targetID =
        (event.type === "message_reply" && event.messageReply?.senderID) ||
        (event.mentions && Object.keys(event.mentions)[0]);

      if (!targetID) {
        return message.reply("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐦𝐞𝐧𝐭𝐢𝐨𝐧 𝐨𝐫 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐬𝐨𝐦𝐞𝐨𝐧𝐞!");
      }

      const name1 = await usersData.getName(senderID).catch(() => "User");
      const name2 = await usersData.getName(targetID).catch(() => "User");

      try {
        // Get profile pictures
        const senderImg = await loadImage(
          `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        ).catch(() => null);

        const targetImg = await loadImage(
          `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        ).catch(() => null);

        // Load template image
        const templateImg = await loadImage("https://i.imgur.com/LyG1bq1.jpeg");

        // Create canvas
        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Draw template background
        ctx.drawImage(templateImg, 0, 0, width, height);

        // Draw profile pictures as circles with border
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

        // Draw slapper and target pictures - positioned better
        if (senderImg) drawCircle(ctx, senderImg, 80, 140, 220);
        if (targetImg) drawCircle(ctx, targetImg, 500, 140, 220);

        // Save image
        const outputPath = path.join(__dirname, "slap_output.png");
        const stream = canvas.createPNGStream();
        const out = fs.createWriteStream(outputPath);
        
        stream.pipe(out);

        out.on("finish", () => {
          const replyText = `🤣 ${name1} 𝐬𝐥𝐚𝐩𝐩𝐞𝐝 ${name2}! 😆`;

          message.reply({
            body: replyText,
            attachment: fs.createReadStream(outputPath)
          }, () => {
            try { fs.unlinkSync(outputPath); } catch (e) {}
          });
        });

      } catch (imageErr) {
        console.error("Image error:", imageErr);
        return message.reply(`🤣 ${name1} 𝐬𝐥𝐚𝐩𝐩𝐞𝐝 ${name2}! 😆`);
      }

    } catch (err) {
      console.error("SLAP CMD ERROR:", err);
      return message.reply("❌ 𝐒𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐰𝐞𝐧𝐭 𝐰𝐫𝐨𝐧𝐠!");
    }
  }
};
