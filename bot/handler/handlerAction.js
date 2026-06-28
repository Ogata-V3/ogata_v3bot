const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerEventsFile = process.env.NODE_ENV == 'development' ? "./handlerEvents.dev.js" : "./handlerEvents.js";
	const handlerEventsFactory = require(handlerEventsFile);

	return async function (event) {
		try {
			// Check antiInbox
			if (
				global.GoatBot.config.antiInbox == true &&
				event.isGroup == false &&
				event.senderID == event.threadID
			)
				return;

			// Build message object
			const messageFunc = global.utils?.message;
			const message = typeof messageFunc === "function"
				? messageFunc(api, event)
				: {
					reply: (msg) => api.sendMessage(msg, event.threadID),
					send: (msg) => api.sendMessage(msg, event.threadID),
					delete: (msgID) => api.unsendMessage(msgID || event.messageID),
				};

			// Check DB (don't let this crash the whole flow)
			try {
				await handlerCheckDB(usersData, threadsData, event);
			} catch (dbErr) {
				const log = global.utils?.log || { err: console.error };
				log.err("HANDLER_DB", "handlerCheckDB error: " + dbErr.message);
			}

			// Build handler for this event
			const handlerEvents = handlerEventsFactory(
				api, threadModel, userModel, dashBoardModel, globalModel,
				usersData, threadsData, dashBoardData, globalData
			);

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
		} catch (err) {
			const log = global.utils?.log || { err: console.error };
			log.err("HANDLER", "Unhandled error in handlerAction: " + err.message, err);
		}
	};
};
