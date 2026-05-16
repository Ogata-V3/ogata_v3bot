---

🛠️ Built-in Functions:

Translate

convertTime

enable/disable process.stderr.clearLine

getExtFromMimeType

getTime

jsonStringifyColor

randomString/Number

findUid Facebook

getStreamsFromAttachment

getStreamFromURL

Google Drive: (upload, delete, getFile, etc...)

And more...<br />
See utils.js for more details.



---

👤 Author / Fork Info

Name: Ajmaul

Fork: https://github.com/mdajmaul/goatbot_ajmaul_83.git



---

🧠 Prepare

Node.js 16.x

IDE or Text Editor (VSCode, Sublime Text, Atom, Notepad++, ...)

Knowledge of Javascript, Node.js, JSON,...

Knowledge of Facebook Chat API Unofficial



---

⚠️ Important Note

Any issues related to 18+, vulgarity, obscenity, pornography, treason, politics, etc., are not allowed in GoatBot.

Adding custom commands or modifying the code to violate these rules will result in a permanent ban.

Please be cautious with each line of your code.



---

💾 Database

Type:

You can choose one of the following storage methods (config in config.json):

JSON

SQLite

MONGODB



---

👥 Users

// CREATE USER DATA
const newUserData = await usersData.create(userID, userInfo);

// GET USER DATA
const userData = await usersData.get(userID);

// SET USER DATA
await usersData.set(userID, updateData, path);

// GET ALL USER DATA
const allUsers = await usersData.getAll();

// GET USER NAME
const userName = await usersData.getName(userID);

// GET USER AVATAR URL
const avatarUrl = await usersData.getAvatarUrl(userID);


---

💬 Threads

// CREATE THREAD DATA
const newThreadData = await threadsData.create(threadID, threadInfo);

// GET THREAD DATA
const threadData = await threadsData.get(threadID);

// SET THREAD DATA
await threadsData.set(threadID, updateData, path);


---

📦 Create New Command

Requirements:

JavaScript basics (variables, loops, functions, async/await)

Node.js basics (require, module.exports)

Facebook Chat API knowledge



---

🚀 Start Creating

Example commands:
https://github.com/ntkhang03/Goat-Bot-V2/tree/main/scripts/cmds

Example event:
https://github.com/ntkhang03/Goat-Bot-V2/tree/main/scripts/events



---

🚀 Status

Updating...


---
