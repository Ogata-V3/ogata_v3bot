const deltaNext = global.GoatBot?.configCommands?.envCommands?.rank?.deltaNext || 5;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);

module.exports = {
	config: {
		name: "rankup",
		version: "1.4",
		author: "Zoro",
		countDown: 5,
		role: 0,
		description: {
			en: "Turn on/off level up notification"
		},
		category: "rank",
		guide: {
			en: "{pn} [on | off]"
		},
		envConfig: {
			deltaNext: 5
		}
	},

	langs: {
		vi: {
			syntaxError: "Sai cú pháp, chỉ có thể dùng {pn} on hoặc {pn} off",
			turnedOn: "Đã bật thông báo level up",
			turnedOff: "Đã tắt thông báo level up",
			notiMessage: "🎉🎉 chúc mừng bạn đạt level %1"
		},
		en: {
			syntaxError: "Syntax error, only use {pn} on or {pn} off",
			turnedOn: "Turned on level up notification",
			turnedOff: "Turned off level up notification",
			notiMessage: "🎉🎉 Congratulations on reaching level %1"
		}
	},

	onStart: async function ({ message, event, threadsData, args, getLang }) {
		try {
			if (!["on", "off"].includes(args[0]))
				return message.reply(getLang("syntaxError"));
			await threadsData.set(event.threadID, args[0] == "on", "settings.sendRankupMessage");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		} catch(err) {
			console.error("rankup.js onStart error:", err.message);
		}
	},

	onChat: async function ({ threadsData, usersData, event, message, getLang }) {
		try {
			const threadData = await threadsData.get(event.threadID);
			if (!threadData) return;

			const sendRankupMessage = threadData?.settings?.sendRankupMessage;
			if (!sendRankupMessage) return;

			const userData = await usersData.get(event.senderID);
			if (!userData) return;

			const exp = userData.exp || 0;
			const currentLevel = expToLevel(exp);
			const prevLevel = expToLevel(Math.max(0, exp - 1));

			if (currentLevel > prevLevel) {
				const customMessage = await threadsData.get(event.threadID, "data.rankup.message");
				const formMessage = {};

				if (customMessage) {
					let msg = customMessage
						.replace(/{oldRank}/g, currentLevel - 1)
						.replace(/{currentRank}/g, currentLevel)
						.replace(/{userName}/g, userData.name || "Unknown");

					if (msg.includes("{userNameTag}")) {
						msg = msg.replace(/{userNameTag}/g, `@${userData.name || "Unknown"}`);
						formMessage.mentions = [{ tag: `@${userData.name || "Unknown"}`, id: event.senderID }];
					}
					formMessage.body = msg;
				}
				else {
					formMessage.body = getLang("notiMessage", currentLevel);
				}

				message.reply(formMessage);
			}
		} catch(err) {
			console.error("rankup.js onChat error:", err.message);
		}
	}
};
