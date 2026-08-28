const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "delete",
		aliases: ["del"],
		version: "1.8",
		author: "ajmaul",
		countDown: 10,
		role: 2,
		description: {
			vi: "Xóa một lệnh",
			en: "Delete a command"
		},
		category: "admin",
		guide: {
			vi: "   {pn} <tên lệnh>: xóa lệnh",
			en: "   {pn} <command name>: delete command"
		}
	},

	langs: {
		vi: {
			noArgs: "❌ Vui lòng cung cấp tên lệnh cần xóa",
			notFound: "❌ Không tìm thấy lệnh: %1",
			deleted: "✅ Đã xóa lệnh: %1",
			error: "✗ Đã xảy ra lỗi: %1"
		},
		en: {
			noArgs: "❌ Please provide command name to delete",
			notFound: "❌ The Command not found: %1",
			deleted: "✅ Deleted The command: %1",
			error: "✗ An error occurred: %1"
		}
	},

	onStart: async function ({ args, message, getLang }) {
		if (!args.length) {
			return message.reply(getLang("noArgs"));
		}

		const commandName = args[0].toLowerCase();

		// Recursively search for the command file starting from this
		// command's folder root (handles commands stored in subfolders too)
		function findCommandFile(startDir, fileName) {
			const entries = fs.readdirSync(startDir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = path.join(startDir, entry.name);
				if (entry.isDirectory()) {
					const found = findCommandFile(fullPath, fileName);
					if (found) return found;
				} else if (entry.isFile() && entry.name.toLowerCase() === fileName) {
					return fullPath;
				}
			}
			return null;
		}

		try {
			// __dirname is this file's folder; go up one level to the
			// commands root in case commands live in category subfolders
			const searchRoot = path.resolve(__dirname, "..");
			const commandPath = findCommandFile(searchRoot, `${commandName}.js`);

			if (!commandPath) {
				return message.reply(getLang("notFound", commandName));
			}

			// Remove the file from disk
			fs.unlinkSync(commandPath);

			// Clear it from require cache so it stops being usable immediately
			delete require.cache[require.resolve(commandPath)];

			// Remove from the bot's active command registry, if present.
			// Adjust this block to match your framework's actual global object
			// (e.g. global.client.commands, global.GoatBot.commands, etc.)
			if (global.client && global.client.commands) {
				const cmd = global.client.commands.get(commandName);
				if (cmd) {
					global.client.commands.delete(commandName);
					if (cmd.config && Array.isArray(cmd.config.aliases)) {
						for (const alias of cmd.config.aliases) {
							global.client.commands.delete(alias);
						}
					}
				}
			}

			return message.reply(getLang("deleted", commandName));
		} catch (err) {
			return message.reply(getLang("error", err.message));
		}
	}
};
