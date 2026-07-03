module.exports = (api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData) => {
	const handlerCheckDB = require(`${__dirname}/handlerCheckData.js`);
	const handlerEventsFactory = require(process.env.NODE_ENV == 'development' ? `${__dirname}/handlerEvents.dev.js` : `${__dirname}/handlerEvents.js`);

	function logError(tag, err) {
		const log = global.utils?.log;
		if (log && typeof log.err === "function") {
			log.err(tag, err?.message || err);
		} else {
			console.error(tag, err?.message || err);
		}
	}

	async function safeCall(fn, name) {
		if (typeof fn !== "function") return;
		try {
			await fn();
		} catch (e) {
			logError(`HANDLER:${name}`, e);
		}
	}

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

			try {
				await handlerCheckDB(usersData, threadsData, event);
			} catch (e) {
				logError("DB", e);
			}

			const handlerEvents = handlerEventsFactory(api, threadModel, userModel, dashBoardModel, globalModel, usersData, threadsData, dashBoardData, globalData);
			const handlerChat = await handlerEvents(event, message);
			if (!handlerChat)
				return;

			const {
				onAnyEvent, onFirstChat, onStart, onChat,
				onReply, onEvent, handlerEvent, onReaction,
				typ, presence, read_receipt
			} = handlerChat;

			await safeCall(onAnyEvent, "onAnyEvent");

			switch (event.type) {
				case "message":
				case "message_reply":
				case "message_unsend":
					await safeCall(onFirstChat, "onFirstChat");
					await safeCall(onChat, "onChat");
					await safeCall(onStart, "onStart");
					await safeCall(onReply, "onReply");
					break;
				case "event":
					await safeCall(handlerEvent, "handlerEvent");
					await safeCall(onEvent, "onEvent");
					break;
				case "message_reaction":
					await safeCall(onReaction, "onReaction");
					break;
				case "typ":
					await safeCall(typ, "typ");
					break;
				case "presence":
					await safeCall(presence, "presence");
					break;
				case "read_receipt":
					await safeCall(read_receipt, "read_receipt");
					break;
				default:
					break;
			}
		} catch (err) {
			logError("HANDLER", err);
		}
	};
};
