module.exports = {
	config: {
		name: "count",
		version: "1.3",
		author: "Zoro",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem số lượng tin nhắn của tất cả thành viên hoặc bản thân",
			en: "View the number of messages of all members or yourself"
		},
		category: "box chat",
		guide: {
			vi: "   {pn}: dùng để xem số lượng tin nhắn của bạn\n   {pn} all: xem tất cả",
			en: "   {pn}: view your messages\n   {pn} all: view all members"
		}
	},

	langs: {
		vi: {
			count: "Số tin nhắn của các thành viên:",
			endMessage: "Những người không có tên trong danh sách là chưa gửi tin nhắn nào.",
			page: "Trang [%1/%2]",
			reply: "Phản hồi tin nhắn này kèm số trang để xem tiếp",
			result: "%1 hạng %2 với %3 tin nhắn",
			yourResult: "Bạn đứng hạng %1 và đã gửi %2 tin nhắn trong nhóm này",
			invalidPage: "Số trang không hợp lệ",
			noData: "Chưa có dữ liệu tin nhắn"
		},
		en: {
			count: "Number of messages of members:",
			endMessage: "Those not in the list have not sent any messages.",
			page: "Page [%1/%2]",
			reply: "Reply to this message with the page number to view more",
			result: "%1 rank %2 with %3 messages",
			yourResult: "You are ranked %1 and have sent %2 messages in this group",
			invalidPage: "Invalid page number",
			noData: "No message data yet"
		}
	},

	onStart: async function ({ args, threadsData, message, event, api, commandName, getLang }) {
		try {
			const { threadID, senderID } = event;
			const threadData = await threadsData.get(threadID);
			const members = threadData?.members || [];

			let usersInGroup = [];
			try {
				usersInGroup = (await api.getThreadInfo(threadID)).participantIDs || [];
			} catch(e) {}

			let arraySort = [];
			for (const user of members) {
				if (usersInGroup.length > 0 && !usersInGroup.includes(user.userID))
					continue;
				const charac = "️️️️️️️️️️️️️️️️️";
				arraySort.push({
					name: (user.name || "Unknown").includes(charac) ? `Uid: ${user.userID}` : (user.name || "Unknown"),
					count: user.count || 0,
					uid: user.userID
				});
			}

			let stt = 1;
			arraySort.sort((a, b) => b.count - a.count);
			arraySort.map(item => item.stt = stt++);

			if (args[0]) {
				if (args[0].toLowerCase() == "all") {
					let msg = getLang("count");
					const endMessage = getLang("endMessage");
					for (const item of arraySort) {
						if (item.count > 0)
							msg += `\n${item.stt}/ ${item.name}: ${item.count}`;
					}
					message.reply(msg + "\n\n" + endMessage);
				}
				else if (event.mentions) {
					let msg = "";
					for (const id in event.mentions) {
						const findUser = arraySort.find(item => item.uid == id);
						if (findUser)
							msg += `\n${getLang("result", findUser.name, findUser.stt, findUser.count)}`;
					}
					if (msg) message.reply(msg);
				}
			}
			else {
				const findUser = arraySort.find(item => item.uid == senderID);
				if (!findUser)
					return message.reply(getLang("noData"));
				return message.reply(getLang("yourResult", findUser.stt, findUser.count));
			}
		} catch(err) {
			console.error("count.js error:", err.message);
		}
	},

	onChat: async ({ usersData, threadsData, event }) => {
		try {
			const { senderID, threadID } = event;
			if (!threadID || !senderID) return;
			const members = await threadsData.get(threadID, "members") || [];
			const findMember = members.find(user => user.userID == senderID);
			if (!findMember) {
				let name = "Unknown";
				try { name = await usersData.getName(senderID) || "Unknown"; } catch(e) {}
				members.push({ userID: senderID, name, nickname: null, inGroup: true, count: 1 });
			}
			else {
				findMember.count = (findMember.count || 0) + 1;
			}
			await threadsData.set(threadID, members, "members");
		} catch(err) {
			console.error("count.js onChat error:", err.message);
		}
	}
};
