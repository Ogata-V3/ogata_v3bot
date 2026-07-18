const axios = require("axios");
const fs = require('fs-extra');
const path = require('path');

module.exports = {
        config: {
                name: "audio",
                version: "1.7",
                author: "Ajmaul",
                countDown: 5,
                role: 0,
                description: {
                        en: "Download any song directly from YouTube",
                        bn: "যেকোনো গান সরাসরি ডাউনলোড করুন",
                        vi: "Tải bất kỳ bài hát nào trực tiếp từ YouTube"
                },
                category: "music",
                guide: {
                        en: '   {pn} <song name>\n   Example: {pn} stay justin bieber',
                        bn: '   {pn} <গানের নাম>\n   উদাহরণ: {pn} tui chinli na amay',
                        vi: '   {pn} <tên bài hát>\n   Ví dụ: {pn} see you again'
                }
        },

        langs: {
                bn: {
                        error: "❌ API Down! Contact Aizen",
                        noResult: "⭕ কোনো গান খুঁজে পাইনি: %1",
                        success: "✅ আপনার গান: %1"
                },
                en: {
                        error: "❌ API Down! Contact Aizen",
                        noResult: "⭕ No results found for: %1",
                        success: "✅ Your song: %1"
                },
                vi: {
                        error: "❌ API Down! Contact Aizen",
                        noResult: "⭕ Không tìm thấy: %1",
                        success: "✅ Bài hát của bạn: %1"
                }
        },

        onStart: async function ({ api, args, message, event, getLang }) {
                return api.sendMessage("⚠️ Audio API currently unavailable. Try !sing command instead.", event.threadID, event.messageID);
        }
};
