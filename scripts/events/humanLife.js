module.exports = {
	config: {
		name: "humanLife",
		version: "1.0",
		author: "Claude",
		description: "Makes bot behave like a human — typing indicator, random delay before reply",
		category: "system",
		countDown: 0,
		role: 0
	},

	onStart: async function () { },

	onChat: async function ({ api, event }) {
		const { threadID, body, type } = event;

		// Only apply to message events with body
		if (type !== "message" || !body) return;

		// Don't apply to commands (starts with prefix)
		const prefix = global.GoatBot?.config?.prefix || ".";
		if (body.startsWith(prefix)) return;

		// Random delay: 1.5 to 4 seconds
		const delay = Math.floor(Math.random() * 2500) + 1500;

		// Show typing indicator
		try {
			await api.sendTypingIndicator(threadID);
		} catch (e) { /* silent */ }

		// Wait
		await new Promise(resolve => setTimeout(resolve, delay));

		// Stop typing (automatically stops after sending, but good practice)
	},

	onAnyEvent: async function ({ api, event }) {
		// For non-message events, just add small delay
		if (event.type === "message") return;

		const delay = Math.floor(Math.random() * 1000) + 500;
		await new Promise(resolve => setTimeout(resolve, delay));
	}
};
