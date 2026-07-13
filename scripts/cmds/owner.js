const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.0.0",
    author: "Ajmaul",
    category: "owner",
    guide: {
      en: "{pn}"
    },
    usePrefix: true
  },

  sentThreads: new Map(),

  onStart: async function ({ event, message }) {
    const threadID = event.threadID;

    if (this.sentThreads.has(threadID)) return;
    this.sentThreads.set(threadID, true);

    const ownerInfo = {
      name: "𝐑𝐚𝐡𝐚𝐭 𝐌𝐚𝐡𝐦𝐮𝐝",
      nick: "𝐄 𝐆 𝐎",
      age: "17",
      gender: "Male",
      country: "Bangladesh",
      city: "Barishal ",
      religion: "Islam",
      status: "Single",
      hobby: "Coding, Gaming",
      profession: "Bot Developer",
      bot: "RAHAT V3",
      github: "github.com/rahatmahmud007",
      facebook: "facebook.com"
    };

    const msg = `
╔══════════════════════╗
      👑 OWNER INFO 👑
╚══════════════════════╝

👤 Name      : ${ownerInfo.name}
🏷️ Nick      : ${ownerInfo.nick}
🎂 Age       : ${ownerInfo.age}
🚹 Gender    : ${ownerInfo.gender}
🌍 Country   : ${ownerInfo.country}
📍 City      : ${ownerInfo.city}
🕌 Religion  : ${ownerInfo.religion}
❤️ Status    : ${ownerInfo.status}

━━━━━━━━━━━━━━━━━━━━━━

🤖 Bot       : ${ownerInfo.bot}
💻 Profession: ${ownerInfo.profession}
🎯 Hobby     : ${ownerInfo.hobby}

🌐 GitHub    : ${ownerInfo.github}
📘 Facebook  : ${ownerInfo.facebook}

━━━━━━━━━━━━━━━━━━━━━━

❤️ Thanks For Using
      RAHAT V3
`;

    try {
      const image = (
        await axios.get(
          "https://i.ibb.co.com/SwMLdyKN/Screenshot-20260707-133847-Gallery.jpg",
          {
            responseType: "stream"
          }
        )
      ).data;

      await message.reply({
        body: msg,
        attachment: image
      });

    } catch (err) {
      console.log(err);

      await message.reply(
        msg +
        "\n\n⚠️ Image could not be loaded from the provided link."
      );
    }

    setTimeout(() => {
      this.sentThreads.delete(threadID);
    }, 300000);
  }
};
