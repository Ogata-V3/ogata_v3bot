module.exports = {
	config: {
		name: "resend",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Gửi lại tin nhắn",
			en: "Resend a message"
		},
		category: "utility",
		guide: {
			en: "Reply to a message and use {pn} to resend it"
		}
	},

	langs: {
		vi: {
			noReply: "Vui lòng reply vào tin nhắn bạn muốn gửi lại"
		},
		en: {
			noReply: "Please reply to the message you want to resend"
		}
	},

	onStart: async function ({ message, event, getLang }) {
		if (!event.messageReply)
			return message.reply(getLang("noReply"));

		const { body, attachments } = event.messageReply;

		if (attachments && attachments.length > 0) {
			const { getStreamFromURL } = global.utils;
			const attachmentStreams = [];
			for (const att of attachments) {
				if (att.type === "photo" || att.type === "sticker" || att.type === "animated_image") {
					try {
						const stream = await getStreamFromURL(att.url || att.previewUrl);
						if (stream) attachmentStreams.push(stream);
					} catch (e) {}
				}
			}
			return message.reply({
				body: body || "",
				attachment: attachmentStreams.length > 0 ? attachmentStreams : undefined
			});
		}

		if (body)
			return message.reply(body);

		return message.reply(getLang("noReply"));
	}
};
