const axios = require("axios");

module.exports = {
	config: {
		name: "youai",
		aliases: ["you", "youchat", "ai", "gemini"],
		version: "1.0",
		author: "Ajmaul",
		countDown: 5,
		role: 0,
		shortDescription: "Chat with You AI",
		longDescription: "Send a message and get a friendly AI response with related questions",
		category: "ai",
		guide: {
			en: "{pn} <your message>"
		}
	},

	langs: {
		en: {
			noInput: "⚠️ Please type something to ask.",
			loading: "🧠 Thinking...",
			error: "❌ Failed to get response from You AI."
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const input = args.join(" ");
		if (!input) return message.reply(getLang("noInput"));

		message.reply(getLang("loading"));

		try {
			const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/you?chat=${encodeURIComponent(input)}`;
			const res = await axios.get(apiUrl);

			const data = res.data;
			if (!data || !data.response) return message.reply(getLang("error"));

			const related = data.relatedSearch?.length
				? "\n\n💡 Related:\n" + data.relatedSearch.map((r, i) => `• ${r}`).join("\n")
				: "";

			return message.reply(`🧠 ${data.response}${related}`);
		} catch (err) {
			console.error("YouAI Error:", err.message || err);
			return message.reply(getLang("error"));
		}
	}
};
