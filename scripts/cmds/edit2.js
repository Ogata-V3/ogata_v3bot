module.exports = {
	config: {
		name: "edit2",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Chỉnh sửa tin nhắn bot đã gửi",
			en: "Edit a message the bot has sent"
		},
		category: "utility",
		guide: {
			en: "Reply to a bot message and use {pn} <new text> to edit it"
		}
	},

	langs: {
		vi: {
			noReply: "Vui lòng reply vào tin nhắn của bot mà bạn muốn chỉnh sửa",
			noText: "Vui lòng nhập nội dung mới\nVí dụ: %1edit2 Nội dung mới",
			success: "✅ Đã chỉnh sửa tin nhắn thành công"
		},
		en: {
			noReply: "Please reply to the bot message you want to edit",
			noText: "Please enter the new content\nExample: %1edit2 New content",
			success: "✅ Message edited successfully"
		}
	},

	onStart: async function ({ message, event, args, getLang, prefix }) {
		if (!event.messageReply)
			return message.reply(getLang("noReply"));

		const newText = args.join(" ").trim();
		if (!newText)
			return message.reply(getLang("noText", prefix));

		try {
			await message.unsend(event.messageReply.messageID);
			await message.reply(newText);
		} catch (e) {
			return message.reply("❌ Error: " + e.message);
		}
	}
};
