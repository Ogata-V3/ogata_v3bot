module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerCheckDB = require(`${__dirname}/handlerCheckData.js`);
	const handlerEventsFactory = require(process.env.NODE_ENV == 'development' ? `${__dirname}/handlerEvents.dev.js` : `${__dirname}/handlerEvents.js`);

	return async function (event) {
		try {
			if (
				global.GoatBot.config.antiInbox == true &&
				event.isGroup == false &&
				event.senderID == event.threadID
			)
				return;

			const messageFunc = global.utils?.message;
			const message = typeof messageFunc === "function"
				? messageFunc(api, event)
				: {
					reply: (msg) => api.sendMessage(msg, event.threadID),
					send: (msg) => api.sendMessage(msg, event.threadID),
					delete: (msgID) => api.unsendMessage(msgID || event.messageID),
				};

			try { await handlerCheckDB(usersData, threadsData, event); }
			catch (e) { (global.utils?.log || console).err?.("DB", e.message) || console.error("DB", e.message); }

			const handlerEvents = handlerEventsFactory(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);
			const handlerChat = await handlerEvents(event, message);
			if (!handlerChat)
				return;

			const {
				onAnyEvent, onFirstChat, onStart, onChat,
				onReply, onEvent, handlerEvent, onReaction,
				typ, presence, read_receipt
			} = handlerChat;

			onAnyEvent();
			switch (event.type) {
				case "message":
				case "message_reply":
				case "message_unsend":
					onFirstChat();
					onChat();
					onStart();
					onReply();
					break;
				case "event":
					handlerEvent();
					onEvent();
					break;
				case "message_reaction":
					onReaction();
					break;
				case "typ":
					typ();
					break;
				case "presence":
					presence();
					break;
				case "read_receipt":
					read_receipt();
					break;
				default:
					break;
			}
		} catch(err) {
			(global.utils?.log || console).err?.("HANDLER", err.message) || console.error("HANDLER", err);
		}
	};
};
