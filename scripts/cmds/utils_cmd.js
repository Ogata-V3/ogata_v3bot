module.exports = {
  config: {
    name: "utils",
    aliases: ["util"],
    version: "1.0",
    author: "ajmaul",
    countDown: 5,
    role: 2,
    shortDescription: "Bot utility info",
    longDescription: "Shows bot utility stats and info",
    category: "owner",
    guide: "{pn}utils"
  },

  onStart: async function ({ message, args }) {
    const { formatTime, getUptime, getDateTime } = global.utils || {};

    const uptime = typeof getUptime === "function" ? getUptime() : "N/A";
    const time   = typeof getDateTime === "function" ? getDateTime() : new Date().toLocaleString();

    const msg =
      `⚙️ BOT UTILITY INFO\n` +
      `━━━━━━━━━━━━━━━━\n` +
      `🕐 Uptime: ${uptime}\n` +
      `📅 Time: ${time}\n` +
      `💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
      `🟢 Node: ${process.version}`;

    return message.reply(msg);
  }
};
