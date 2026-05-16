
module.exports = {
	// You can customize the language here or directly in the command files
	onlyadminbox: {
		description: "turn on/off only admin box can use bot",
		guide: "   {pn} [on | off]",
		text: {
			turnedOn: "Turned on the mode only admin of group can use bot",
			turnedOff: "Turned off the mode only admin of group can use bot",
			syntaxError: "Syntax error, only use {pn} on or {pn} off"
		}
	},
	adduser: {
		description: "Add user to box chat of you",
		guide: "   {pn} [link profile | uid]",
		text: {
			alreadyInGroup: "Already in group",
			successAdd: "- Successfully added %1 members to the group",
			failedAdd: "- Failed to add %1 members to the group",
			approve: "- Added %1 members to the approval list",
			invalidLink: "Please enter a valid facebook link",
			cannotGetUid: "Cannot get uid of this user",
			linkNotExist: "This profile url does not exist",
			cannotAddUser: "Bot is blocked or this user blocked strangers from adding to the group"
		}
	},
	admin: {
		description: "Add, remove, edit admin role",
		guide: "   {pn} [add | -a] <uid>: Add admin role for user\n\t  {pn} [remove | -r] <uid>: Remove admin role of user\n\t  {pn} [list | -l]: List all admins",
		text: {
			added: "✅ | Added admin role for %1 users:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users already have admin role:\n%2",
			missingIdAdd: "⚠️ | Please enter ID or tag user to add admin role",
			removed: "✅ | Removed admin role of %1 users:\n%2",
			notAdmin: "⚠️ | %1 users don't have admin role:\n%2",
			missingIdRemove: "⚠️ | Please enter ID or tag user to remove admin role",
			listAdmin: "👑 | List of admins:\n%1"
		}
	},
	adminonly: {
		description: "turn on/off only admin can use bot",
		guide: "{pn} [on | off]",
		text: {
			turnedOn: "Turned on the mode only admin can use bot",
			turnedOff: "Turned off the mode only admin can use bot",
			syntaxError: "Syntax error, only use {pn} on or {pn} off"
		}
	},
	all: {
		description: "Tag all members in your group chat",
		guide: "{pn} [content | empty]"
	},
	anime: {
		description: "random anime image",
		guide: "{pn} <endpoint>\n   List of endpoint: neko, kitsune, hug, pat, waifu, cry, kiss, slap, smug, punch",
		text: {
			loading: "Initializing image, please wait...",
			error: "An error occurred, please try again later"
		}
	},
	antichangeinfobox: {
		description: "Turn on/off anti change info box",
		guide: "   {pn} avt [on | off]: anti change avatar box chat\n   {pn} name [on | off]: anti change name box chat\n   {pn} theme [on | off]: anti change theme (chủ đề) box chat\n   {pn} emoji [on | off]: anti change emoji box chat",
		text: {
			antiChangeAvatarOn: "Turn on anti change avatar box chat",
			antiChangeAvatarOff: "Turn off anti change avatar box chat",
			missingAvt: "You have not set avatar for box chat",
			antiChangeNameOn: "Turn on anti change name box chat",
			antiChangeNameOff: "Turn off anti change name box chat",
			antiChangeThemeOn: "Turn on anti change theme box chat",
			antiChangeThemeOff: "Turn off anti change theme box chat",
			antiChangeEmojiOn: "Turn on anti change emoji box chat",
			antiChangeEmojiOff: "Turn off anti change emoji box chat",
			antiChangeAvatarAlreadyOn: "Your box chat is currently on anti change avatar",
			antiChangeNameAlreadyOn: "Your box chat is currently on anti change name",
			antiChangeThemeAlreadyOn: "Your box chat is currently on anti change theme",
			antiChangeEmojiAlreadyOn: "Your box chat is currently on anti change emoji"
		}
	},
	appstore: {
		description: "Search app on appstore",
		text: {
			missingKeyword: "You haven't entered any keyword",
			noResult: "No result found for keyword %1"
		}
	},
	autosetname: {
		description: "Auto change nickname of new member",
		guide: "   {pn} set <nickname>: use to set config to auto change nickname, with some shortcuts:\n   + {userName}: name of new member\n   + {userID}: member id\n   Example:\n    {pn} set {userName} 🚀\n\n   {pn} [on | off]: use to turn on/off this feature\n\n   {pn} [view | info]: show current config",
		text: {
			missingConfig: "Please enter the required configuration",
			configSuccess: "The configuration has been set successfully",
			currentConfig: "The current autoSetName configuration in your chat group is:\n%1",
			notSetConfig: "Your group has not set the autoSetName configuration",
			syntaxError: "Syntax error, only \"{pn} on\" or \"{pn} off\" can be used",
			turnOnSuccess: "The autoSetName feature has been turned on",
			turnOffSuccess: "The autoSetName feature has been turned off",
			error: "An error occurred while using the autoSetName feature, try turning off the invite link feature in the group and try again later"
		}
	},
	avatar: {
		description: "create anime avatar with signature",
		guide: "{p}{n} <character id or character name> | <background text> | <signature> | <background color name or hex color>\n{p}{n} help: view how to use this command",
		text: {
			initImage: "Initializing image, please wait...",
			invalidCharacter: "Currently there are only %1 characters on the system, please enter a character id less than",
			notFoundCharacter: "No character named %1 was found in the character list",
			errorGetCharacter: "An error occurred while getting character data:\n%1: %2",
			success: "✅ Your avatar\nCharacter: %1\nID: %2\nBackground text: %3\nSignature: %4\nColor: %5",
			defaultColor: "default",
			error: "An error occurred\n%1: %2"
		}
	},
	badwords: {
		description: "Turn on/off/add/remove bad words warning, if a member violates, he will be warned, the second time he will be kicked out of the chat box",
		guide: "   {pn} add <words>: add banned words (you can add multiple words separated by commas \",\" or vertical bars \"|\")\n   {pn} delete <words>: delete banned words (you can delete multiple words separated by commas \",\" or vertical bars \"|\")\n   {pn} list <hide | leave blank>: turn off warning (add \"hide\" to hide banned words)\n   {pn} unwarn [<userID> | <@tag>]: remove 1 warning of 1 member\n   {pn} on: turn off warning\n   {pn} off: turn on warning",
		text: {
			onText: "on",
			offText: "off",
			onlyAdmin: "⚠️ | Only admins can add banned words to the list",
			missingWords: "⚠️ | You haven't entered the banned words",
			addedSuccess: "✅ | Added %1 banned words to the list",
			alreadyExist: "❌ | %1 banned words already exist in the list before: %2",
			tooShort: "⚠️ | %1 banned words cannot be added to the list because they are shorter than 2 characters: %2",
			onlyAdmin2: "⚠️ | Only admins can delete banned words from the list",
			missingWords2: "⚠️ | You haven't entered the words to delete",
			deletedSuccess: "✅ | Deleted %1 banned words from the list",
			notExist: "❌ | %1 banned words do not exist in the list before: %2",
			emptyList: "⚠️ | The list of banned words in your group is currently empty",
			badWordsList: "📑 | The list of banned words in your group: %1",
			onlyAdmin3: "⚠️ | Only admins can %1 this feature",
			turnedOnOrOff: "✅ | Banned words warning has been %1",
			onlyAdmin4: "⚠️ | Only admins can delete banned words warning",
			missingTarget: "⚠️ | You haven't entered user ID or tagged user",
			notWarned: "⚠️ | User %1 has not been warned for banned words",
			removedWarn: "✅ | User %1 | %2 has been removed 1 banned words warning",
			warned: "⚠️ | Banned words \"%1\" have been detected in your message, if you continue to violate you will be kicked from the group.",
			warned2: "⚠️ | Banned words \"%1\" have been detected in your message, you have violated 2 times and will be kicked from the group.",
			needAdmin: "Bot needs admin privileges to kick banned members",
			unwarned: "✅ | Removed banned words warning of user %1 | %2"
		}
	},
	balance: {
		description: "view your money or the money of the tagged person",
		guide: "   {pn}: view your money\n   {pn} <@tag>: view the money of the tagged person",
		text: {
			money: "You have %1$",
			moneyOf: "%1 has %2$"
		}
	},
	batslap: {
		description: "Batslap image",
		text: {
			noTag: "You must tag the person you want to slap"
		}
	},
	busy: {
		description: "turn on do not disturb mode, when you are tagged bot will notify",
		guide: "   {pn} [empty | <reason>]: turn on do not disturb mode\n   {pn} off: turn off do not disturb mode",
		text: {
			turnedOff: "✅ | Do not disturb mode has been turned off",
			turnedOn: "✅ | Do not disturb mode has been turned on",
			turnedOnWithReason: "✅ | Do not disturb mode has been turned on with reason: %1",
			alreadyOn: "User %1 is currently busy",
			alreadyOnWithReason: "User %1 is currently busy with reason: %2"
		}
	},
	callad: {
		description: "send report, feedback, bug,... to admin bot",
		guide: "   {pn} <message>",
		text: {
			missingMessage: "Please enter the message you want to send to admin",
			sendByGroup: "\n- Sent from group: %1\n- Thread ID: %2",
			sendByUser: "\n- Sent from user",
			content: "\n\nContent:\n─────────────────\n%1\n─────────────────\nReply this message to send message to user",
			success: "Sent your message to admin successfully!",
			reply: "📍 Reply from admin %1:\n─────────────────\n%2\n─────────────────\nReply this message to continue send message to admin",
			replySuccess: "Sent your reply to admin successfully!",
			feedback: "📝 Feedback from user %1:\n- User ID: %2%3\n\nContent:\n─────────────────\n%4\n─────────────────\nReply this message to send message to user",
			replyUserSuccess: "Sent your reply to user successfully!"
		}
	},
	cmd: {
		description: "Manage your command files",
		guide: "{pn} load <command file name>\n{pn} loadAll\n{pn} install <url> <command file name>: Download and install a command file from a url, url is the path to the file (raw)",
		text: {
			missingFileName: "⚠️ | Please enter the command name you want to reload",
			loaded: "✅ | Loaded command \"%1\" successfully",
			loadedError: "❌ | Failed to load command \"%1\" with error\n%2: %3",
			loadedSuccess: "✅ | Loaded successfully \"%1\" command",
			loadedFail: "❌ | Failed to load \"%1\" command\n%2",
			missingCommandNameUnload: "⚠️ | Please enter the command name you want to unload",
			unloaded: "✅ | Unloaded command \"%1\" successfully",
			unloadedError: "❌ | Failed to unload command \"%1\" with error\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and command file name you want to install",
			missingUrlOrCode: "⚠️ | Please enter the url or code of the command file you want to install",
			missingFileNameInstall: "⚠️ | Please enter the file name to save the command (with .js extension)",
			invalidUrlOrCode: "⚠️ | Unable to get command code",
			alreadExist: "⚠️ | The command file already exists, are you sure you want to overwrite the old command file?\nReact to this message to continue",
			installed: "✅ | Installed command \"%1\" successfully, the command file is saved at %2",
			installedError: "❌ | Failed to install command \"%1\" with error\n%2: %3",
			missingFile: "⚠️ | Command file \"%1\" not found",
			invalidFileName: "⚠️ | Invalid command file name",
			unloadedFile: "✅ | Unloaded command \"%1\""
		}
	},
	count: {
		description: "View the number of messages of all members or yourself (since the bot joined the group)",
		guide: "   {pn}: used to view the number of messages of you\n   {pn} @tag: used to view the number of messages of those tagged\n   {pn} all: used to view the number of messages of all members",
		text: {
			count: "Number of messages of members:",
			endMessage: "Those who do not have a name in the list have not sent any messages.",
			page: "Page [%1/%2]",
			reply: "Reply to this message with the page number to view more",
			result: "%1 rank %2 with %3 messages",
			yourResult: "You are ranked %1 and have sent %2 messages in this group",
			invalidPage: "Invalid page number"
		}
	},
	customrankcard: {
		description: "Design rank card by your own",
		guide: {
			body: "   {pn} [maincolor | subcolor | linecolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <value>"
				+ "\n   In which: "
				+ "\n  + maincolor | background <value>: main background of rank card"
				+ "\n  + subcolor <value>: sub background"
				+ "\n  + linecolor <value>: color of line between main and sub background"
				+ "\n  + expbarcolor <value>: color of exp bar"
				+ "\n  + progresscolor <value>: color of current exp bar"
				+ "\n  + alphasubcolor <value>: opacity of sub background (from 0 -> 1)"
				+ "\n  + textcolor <value>: color of text (hex color or rgba)"
				+ "\n  + namecolor <value>: color of name"
				+ "\n  + expcolor <value>: color of exp"
				+ "\n  + rankcolor <value>: color of rank"
				+ "\n  + levelcolor <value>: color of level"
				+ "\n    • <value> can be hex color, rgb, rgba, gradient (each color is separated by space) or image url"
				+ "\n    • If you want to use gradient, please enter many colors separated by space"
				+ "\n   {pn} reset: reset all to default"
				+ "\n   Example:"
				+ "\n    {pn} maincolor #fff000"
				+ "\n    {pn} subcolor rgba(255,136,86,0.4)"
				+ "\n    {pn} reset",
			attachment: {
				[`${process.cwd()}/scripts/cmds/assets/guide/customrankcard_1.jpg`]: "https://i.ibb.co/BZ2Qgs1/image.png",
				[`${process.cwd()}/scripts/cmds/assets/guide/customrankcard_2.png`]: "https://i.ibb.co/wy1ZHHL/image.png"
			}
		},
		text: {
			invalidImage: "Invalid image url, please choose an url with image destination (jpg, jpeg, png, gif), you can upload image to https://imgbb.com/ and choose \"get direct link\" to get image url",
			invalidAttachment: "Invalid attachment, please choose an image file",
			invalidColor: "Invalid color code, please choose a hex color code (6 digits) or rgba color code",
			notSupportImage: "Url image is not supported with option \"%1\"",
			success: "Your changes have been saved, here is a preview",
			reseted: "All settings have been reset to default",
			invalidAlpha: "Please choose a number from 0 -> 1"
		}
	},
	dhbc: {
		description: "play game catch the word",
		guide: "{pn}",
		text: {
			reply: "Please reply this message with the answer\n%1",
			isSong: "This is the name of the song of the singer %1",
			notPlayer: "⚠️ You are not the player of this question",
			correct: "🎉 Congratulations you have answered correctly and received %1$",
			wrong: "⚠️ You have answered incorrectly"
		}
	},
	emojimix: {
		description: "Mix 2 emoji together",
		guide: "   {pn} <emoji1> <emoji2>\n   Example:  {pn} 🤣 🥰"
	},
	eval: {
		description: "Test code quickly",
		guide: "{pn} <code to test>",
		text: {
			error: "❌ An error occurred:"
		}
	},
	event: {
		description: "Manage your event command files",
		guide: "{pn} load <command file name>\n{pn} loadAll\n{pn} install <url> <command file name>: Download and load event command, url is the path to the command file (raw)",
		text: {
			missingFileName: "⚠️ | Please enter the command name you want to reload",
			loaded: "✅ | Loaded event command \"%1\" successfully",
			loadedError: "❌ | Loaded event command \"%1\" failed with error\n%2: %3",
			loadedSuccess: "✅ | Loaded \"%1\" event command successfully",
			loadedFail: "❌ | Loaded event command \"%1\" failed\n%2",
			missingCommandNameUnload: "⚠️ | Please enter the command name you want to unload",
			unloaded: "✅ | Unloaded event command \"%1\" successfully",
			unloadedError: "❌ | Unloaded event command \"%1\" failed with error\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and command file name you want to install",
			missingUrlOrCode: "⚠️ | Please enter the url or code of the command file you want to install",
			missingFileNameInstall: "⚠️ | Please enter the file name to save the command (with .js extension)",
			invalidUrlOrCode: "⚠️ | Unable to get command code",
			alreadExist: "⚠️ | The command file already exists, are you sure you want to overwrite the old command file?\nReact to this message to continue",
			installed: "✅ | Installed event command \"%1\" successfully, the command file is saved at %2",
			installedError: "❌ | Installed event command \"%1\" failed with error\n%2: %3",
			missingFile: "⚠️ | File \"%1\" not found",
			invalidFileName: "⚠️ | Invalid file name",
			unloadedFile: "✅ | Unloaded command \"%1\""
		}
	},
	filteruser: {
		description: "filter group members by number of messages or locked account",
		guide: "   {pn} [<number of messages> | die]",
		text: {
			needAdmin: "⚠️ | Please add the bot as a group admin to use this command",
			confirm: "⚠️ | Are you sure you want to delete group members with less than %1 messages?\nReact to this message to confirm",
			kickByBlock: "✅ | Successfully deleted %1 members who are locked acc",
			kickByMsg: "✅ | Successfully deleted %1 members with less than %2 messages",
			kickError: "❌ | An error occurred and could not kick %1 members:\n%2",
			noBlock: "✅ | There are no members who are locked acc",
			noMsg: "✅ | There are no members with less than %1 messages"
		}
	},
	getfbstate: {
		description: "Get current fbstate",
		guide: "{pn}",
		text: {
			success: "Sent fbstate to you, please check bot's private message"
		}
	},
	grouptag: {
		description: "Tag members by group",
		guide: "   {pn} add <groupTagName> <@tags>: use to add new group tag or add members to group tag\n   Example:\n    {pn} TEAM1 @tag1 @tag2\n\n   {pn} del <groupTagName> <@tags>: use to remove members from group tag\n   Example:\n    {pn} del TEAM1 @tag1 @tag2\n\n   {pn} remove <groupTagName>: use to remove group tag\n   Example:\n    {pn} remove TEAM1\n\n   {pn} rename <groupTagName> | <newGroupTagName>: use to rename group tag\n\n   {pn} [list | all]: use to view list of group tag in your group chat\n\n   {pn} info <groupTagName>: use to view info of group tag",
		text: {
			noGroupTagName: "Please enter group tag name",
			noMention: "You haven't tagged any member to add to group tag",
			addedSuccess: "Added members:\n%1\nto group tag \"%2\"",
			addedSuccess2: "Added group tag \"%1\" with members:\n%2",
			existedInGroupTag: "Members:\n%1\nalready existed in group tag \"%2\"",
			notExistedInGroupTag: "Members:\n%1\ndoesn't exist in group tag \"%2\"",
			noExistedGroupTag: "Group tag \"%1\" doesn't exist in your group chat",
			noExistedGroupTag2: "Your group chat hasn't added any group tag",
			noMentionDel: "Please tag members to remove from group tag \"%1\"",
			deletedSuccess: "Deleted members:\n%1\nfrom group tag \"%2\"",
			deletedSuccess2: "Deleted group tag \"%1\"",
			tagged: "Tag group \"%1\":\n%2",
			noGroupTagName2: "Please enter old group tag name and new group tag name, separated by \"|\"",
			renamedSuccess: "Renamed group tag \"%1\" to \"%2\"",
			infoGroupTag: "📑 | Group name: \"%1\"\n👥 | Number of members: %2\n👨‍👩‍👧‍👦 | List of members:\n %3"
		}
	},
	help: {
		description: "View command usage",
		guide: "{pn} [empty | <page number> | <command name>]",
		text: {
			help: "╭─────────────⭓\n%1\n├─────⭔\n│ Page [ %2/%3 ]\n│ Currently, the bot has %4 commands that can be used\n│ » Type %5help <page> to view the command list\n│ » Type %5help to view the details of how to use that command\n├────────⭔\n│ %6\n╰─────────────⭓",
			help2: "%1├───────⭔\n│ » Currently, the bot has %2 commands that can be used\n│ » Type %3help <command name> to view the details of how to use that command\n│ %4\n╰─────────────⭓",
			commandNotFound: "Command \"%1\" does not exist",
			getInfoCommand: "╭── NAME ────⭓\n│ %1\n├── INFO\n│ Description: %2\n│ Other names: %3\n│ Other names in your group: %4\n│ Version: %5\n│ Role: %6\n│ Time per command: %7s\n│ Author: %8\n├── Usage\n%9\n├── Notes\n│ The content inside <XXXXX> can be changed\n│ The content inside [a|b|c] is a or b or c\n╰──────⭔",
			doNotHave: "Do not have",
			roleText0: "0 (All users)",
			roleText1: "1 (Group administrators)",
			roleText2: "2 (Admin bot)",
			roleText0setRole: "0 (set role, all users)",
			roleText1setRole: "1 (set role, group administrators)",
			pageNotFound: "
