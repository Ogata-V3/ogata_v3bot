const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

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
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact Aizen।"
                },
                en: {
                        noUid: "• Please provide a Free Fire UID.\n\nexample: !ffinfo 404394256",
                        notFound: "× Player not found!",
                        error: "× API error: %1. Contact Aizen for help."
                },
                vi: {
                        noUid: "• Vui lòng cung cấp UID Free Fire.",
                        notFound: "× Không tìm thấy người chơi!",
                        error: "× Lỗi: %1. Liên hệ Aizen để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const lang = getLang();
                
                if (!args[0]) {
                        return message.reply(lang.noUid);
                }

                const uid = args[0];
                
                try {
                        const apiUrl = await mahmud();
                        const response = await axios.get(`${apiUrl}/userinfo?uid=${uid}`);
                        
                        if (!response.data || response.data.error) {
                                return message.reply(lang.notFound);
                        }

                        const data = response.data;
                        const info = `
👤 Player Info:
━━━━━━━━━━━
📱 Nickname: ${data.nickname}
🆔 UID: ${data.uid}
