const { config } = global.GoatBot;

module.exports = {

	config: {

		name: "wl",

		version: "1.0",

		author: "Zoro",

		countDown: 5,

		role: 2,

		longDescription: {

			en: "Add, remove, edit whiteListIds"

		},

		category: "owner",

		guide: {

			en: '   {pn} [add | -a] <uid | @tag>: Add whiteList role for user'

				+ '\n   {pn} [remove | -r] <uid | @tag>: Remove whiteList role of user'

				+ '\n   {pn} [list | -l]: List all whiteListIds'

        + '\n   {pn} [on | off]: enable and disable whiteList mode'

		}

	},


	langs: {

		en: {

			added: "✅ | Added whiteList role for %1 users:\n%2",

			alreadyWhiteList: "\n⚠ | %1 users already have whiteList role:\n%2",

			missingIdAdd: "⚠ | Please enter ID or tag user to add in whiteListIds",

			removed: "✅ | Removed whiteList role of %1 users:\n%2",

			notWhiteList: "⚠ | %1 users don't have whiteList role:\n%2",

			missingIdRemove: "⚠ | Please enter ID or tag user to remove from whiteListIds",

			listWhiteList: "👑 | List of whiteListIds:\n%1",

      enable: "✅ Turned on",

      disable: "✅ Turned off"

		}

	},


	onStart: async function ({ message, args, usersData, event, getLang, api }) {

    const { writeFileSync } = require("fs-extra");

		switch (args[0]) {

			case "add":

			case "-a": {

				if (args[1]) {

					let uids = [];

					if (Object.keys(event.mentions).length > 0)

						uids = Object.keys(event.mentions);

					else if (event.messageReply)

						uids.push(event.messageReply.senderID);

					else

						uids = args.filter(arg => !isNaN(arg));

					const notWhiteListIds = [];

					const whiteListIds = [];

					for (const uid of uids) {

						if (config.whiteListMode.whiteListIds.includes(uid))

							whiteListIds.push(uid);

						else

							notWhiteListIds.push(uid);

					}


					config.whiteListMode.whiteListIds.push(...notWhiteListIds);

					const getNames = await Promise.all(notWhiteListIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					return message.reply(

						(notWhiteListIds.length > 0 ? getLang("added", notWhiteListIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")

						+ (whiteListIds.length > 0 ? getLang("alreadyWhiteList", whiteListIds.length, whiteListIds.map(uid => `• ${uid}`).join("\n")) : "")

					);

				}

				else

					return message.reply(getLang("missingIdAdd"));

			}

			case "remove":

			case "-r": {

				if (args[1]) {

					let uids = [];

					if (Object.keys(event.mentions).length > 0)

						uids = Object.keys(event.mentions);

					else

						uids = args.filter(arg => !isNaN(arg));

					const notWhiteListIds = [];

					const whiteListIds = [];

					for (const uid of uids) {

						if (config.whiteListMode.whiteListIds.includes(uid))

							whiteListIds.push(uid);

						else

							notWhiteListIds.push(uid);

					}

					for (const uid of whiteListIds)

						config.whiteListMode.whiteListIds.splice(config.whiteListMode.whiteListIds.indexOf(uid), 1);

					const getNames = await Promise.all(whiteListIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

					return message.reply(

						(whiteListIds.length > 0 ? getLang("removed", whiteListIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")

						+ (notWhiteListIds.length > 0 ? getLang("notWhiteList", notWhiteListIds.length, notWhiteListIds.map(uid => `• ${uid}`).join("\n")) : "")

					);

				}

				else

					return message.reply(getLang("missingIdRemove"));

			}

			case "list":

			case "-l": {

				const getNames = await Promise.all(config.whiteListMode.whiteListIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

				return message.reply(getLang("listWhiteList", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));

			}

        case "on": {              

   config.whiteListMode.enable = true;

                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

                return message.reply(getLang("enable"))

            }

            case "off": {

   config.whiteListMode.enable = false;

                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

                return message.reply(getLang("disable"))

            }

            default:

                return message.reply("❌ Invalid command. Use: add, remove, list, on, off")

        }

    }

};
