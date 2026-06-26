module.exports = {
	config: {
		name: "autoreplybot",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		description: {
			vi: "Bật/tắt tự động trả lời tin nhắn",
			en: "Turn on/off auto reply message"
		},
		category: "box chat",
		guide: {
			en: "{pn} on | off"
		}
	},

	langs: {
		vi: {
			on: "✅ Đã bật tự động trả lời tin nhắn",
			off: "❌ Đã tắt tự động trả lời tin nhắn",
			status_on: "✅ Tự động trả lời đang: BẬT",
			status_off: "❌ Tự động trả lời đang: TẮT",
			invalid: "Vui lòng nhập on hoặc off\nVí dụ: %1autoreplybot on"
		},
		en: {
			on: "✅ Auto reply has been turned ON",
			off: "❌ Auto reply has been turned OFF",
			status_on: "✅ Auto reply is currently: ON",
			status_off: "❌ Auto reply is currently: OFF",
			invalid: "Please enter on or off\nExample: %1autoreplybot on"
		}
	},

	onStart: async function ({ message, args, getLang, threadModel, event, prefix }) {
		const threadID = event.threadID;
		const action = (args[0] || "").toLowerCase();

		if (!action) {
			const threadData = await threadModel.getInfo(threadID);
			const current = threadData?.data?.autoReply || false;
			return message.reply(current ? getLang("status_on") : getLang("status_off"));
		}

		if (action !== "on" && action !== "off")
			return message.reply(getLang("invalid", prefix));

		const value = action === "on";
		await threadModel.updateInfo(threadID, { "data.autoReply": value });

		return message.reply(value ? getLang("on") : getLang("off"));
	}
};
