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
      const lovePercent = Math.floor(Math.random() * 31) + 70;

      try {
        // Get profile pictures
        const senderImg = await loadImage(
          `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        ).catch(() => null);

        const matchImg = await loadImage(
          `https://graph.facebook.com/${selectedMatch.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
        ).catch(() => null);

        const attachments = [];

        // Create sender image
        if (senderImg) {
          const canvas1 = createCanvas(400, 400);
          const ctx1 = canvas1.getContext("2d");
          ctx1.drawImage(senderImg, 0, 0, 400, 400);
          
          const senderPath = path.join(__dirname, "pair_sender.png");
          const stream1 = canvas1.createPNGStream();
          const out1 = fs.createWriteStream(senderPath);
          stream1.pipe(out1);
          
          attachments.push(new Promise(resolve => {
            out1.on("finish", () => resolve(senderPath));
          }));
        }

        // Create match image
        if (matchImg) {
          const canvas2 = createCanvas(400, 400);
          const ctx2 = canvas2.getContext("2d");
          ctx2.drawImage(matchImg, 0, 0, 400, 400);
          
          const matchPath = path.join(__dirname, "pair_match.png");
          const stream2 = canvas2.createPNGStream();
          const out2 = fs.createWriteStream(matchPath);
          stream2.pipe(out2);
          
          attachments.push(new Promise(resolve => {
            out2.on("finish", () => resolve(matchPath));
          }));
        }

        // Wait for both images to finish
        Promise.all(attachments).then(paths => {
          const message = `🥰 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹 𝗽𝗮𝗶𝗿𝗶𝗻𝗴
・${senderName} 🎀
・${matchName} 🎀
💌 𝗪𝗶𝘀𝗵 𝘆𝗼𝘂 𝘁𝘄𝗼 𝗵𝘂𝗻𝗱𝗿𝗲𝗱 𝘆𝗲𝗮𝗿𝘀 𝗼𝗳 𝗵𝗮𝗽𝗽𝗶𝗻𝗲𝘀𝘴 ❤️❤️

𝗟𝗼𝘃𝗲 𝗣𝗲𝗿𝗰𝗲𝗻𝘁𝗮𝗴𝗲: ${lovePercent}% 💙`;

          api.sendMessage(
            {
              body: message,
              attachment: paths.map(p => fs.createReadStream(p))
            },
            event.threadID,
            () => {
              paths.forEach(p => {
                try { fs.unlinkSync(p); } catch (e) {}
              });
            },
            event.messageID
          );
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
