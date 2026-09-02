const axios = require("axios");

module.exports = {
        config: {
                name: "ffinfo",
                version: "1.7",
                author: "ajmaul",
                countDown: 5,
                role: 0,
                description: {
                        bn: "ফ্রি ফায়ার প্লেয়ারের বিস্তারিত তথ্য দেখুন",
                        en: "Get full Free Fire player information",
                        vi: "Lấy thông tin chi tiết người chơi Free Fire"
                },
                category: "game",
                guide: {
                        bn: '   {pn} [UID]: প্লেয়ার আইডি দিন',
                        en: '   {pn} [UID]: Provide player UID',
                        vi: '   {pn} [UID]: Cung cấp UID người chơi'
                }
        },

        langs: {
                bn: {
                        noUid: "• দয়া করে একটি ফ্রি ফায়ার UID দিন।",
                        notFound: "× প্লেয়ার খুঁজে পাওয়া যায়নি!",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact Aizen।",
                        success: "✅ সফল!"
                },
                en: {
                        noUid: "• Please provide a Free Fire UID.\n\nexample: !ffinfo 404394256",
                        notFound: "× Player not found!",
                        error: "× API error: %1. Contact Aizen for help.",
                        success: "✅ Success!"
                },
                vi: {
                        noUid: "• Vui lòng cung cấp UID Free Fire.",
                        notFound: "× Không tìm thấy người chơi!",
                        error: "× Lỗi: %1. Liên hệ Aizen để hỗ trợ.",
                        success: "✅ Thành công!"
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const lang = getLang();
                
                if (!args[0]) {
                        return message.reply(lang.noUid);
                }

                const uid = args[0];
                
                try {
                        // Try multiple API endpoints
                        const apis = [
                                `https://api.ffshayari.site/userinfo?uid=${uid}`,
                                `https://api-free-fire.vercel.app/userinfo?uid=${uid}`,
                                `https://ffapi.herokuapp.com/userinfo?uid=${uid}`
                        ];

                        let data = null;
                        
                        for (let apiUrl of apis) {
                                try {
                                        const response = await axios.get(apiUrl, { timeout: 5000 });
                                        if (response.data && response.data.data) {
                                                data = response.data.data;
                                                break;
                                        }
                                } catch (e) {
                                        continue;
                                }
                        }

                        if (!data) {
                                return message.reply(lang.notFound);
                        }

                        const info = `
🎮 Free Fire Player Info
━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${data.name || data.nickname || "N/A"}
🆔 UID: ${uid}
⭐ Level: ${data.level || "N/A"}
🏆 Rank: ${data.rank || "N/A"}
⚔️ Total Kills: ${data.totalKills || data.kills || 0}
💀 Deaths: ${data.death || data.deaths || 0}
📊 K/D Ratio: ${((data.totalKills || data.kills || 0) / (data.death || data.deaths || 1)).toFixed(2)}
🎯 Wins: ${data.wins || 0}
🔥 Headshots: ${data.headshots || 0}
━━━━━━━━━━━━━━━━━━━━━
                        `;

                        return message.reply(info);

                } catch (error) {
                        return message.reply(lang.error.replace("%1", error.message || "Unknown error"));
                }
        }
};
