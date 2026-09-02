/**
 * userdata.js
 * ---------------------------------------------------------
 * Generic key-value storage for ANY user data, using GoatBot's
 * built-in `usersData` object — which is already wired to your
 * SQLite database (via database/DataModel.js). Because of that,
 * everything saved here survives bot restarts / going offline.
 *
 * You don't need a new database for this — usersData already
 * persists. This file just gives you an easy command + helper
 * functions any other command file can reuse.
 * ---------------------------------------------------------
 */

module.exports = {
  config: {
    name: "userdata",
    version: "1.0.0",
    author: "ajmaul",
    countDown: 3,
    role: 0,
    shortDescription: "Save/get any custom user data",
    longDescription: "Generic persistent key-value storage per user (survives bot restart)",
    category: "system",
    guide: {
      en:
        "{pn} set <key> <value> — save a value under a key for you\n" +
        "{pn} get <key> — read back a saved value\n" +
        "{pn} all — show all your saved data\n" +
        "{pn} del <key> — delete a saved key\n\n" +
        "Admin only:\n" +
        "{pn} set <key> <value> -u <uid> — set data for another user"
    }
  },

  langs: {
    en: {
      noKey: "❌ Please give a key. Example: userdata get coins",
      noValue: "❌ Please give a value to save. Example: userdata set coins 100",
      saved: "✅ Saved 「%key%」 ⇢ %value%",
      got: "📦 「%key%」 ⇢ %value%",
      notFound: "❌ No data found for key 「%key%」",
      deleted: "🗑️ Deleted key 「%key%」",
      allEmpty: "📭 No saved data yet.",
      allHeader: "📦 Your saved data:\n",
      ownerOnly: "⛔ Only admins can set data for other users"
    }
  },

  onStart: async function ({ api, event, args, usersData, getLang }) {
    const { threadID, messageID, senderID } = event;
    const sub = (args[0] || "").toLowerCase();

    // ---- helper: which uid are we operating on ----
    let targetUid = senderID;
    const uFlagIndex = args.indexOf("-u");
    if (uFlagIndex !== -1 && args[uFlagIndex + 1]) {
      if (!global.GoatBot.config.adminBot.includes(senderID)) {
        return api.sendMessage(getLang("ownerOnly"), threadID, messageID);
      }
      targetUid = args[uFlagIndex + 1];
      args.splice(uFlagIndex, 2); // remove -u <uid> from args so key/value parsing stays clean
    }

    switch (sub) {
      case "set": {
        const key = args[1];
        const value = args.slice(2).join(" ");
        if (!key) return api.sendMessage(getLang("noKey"), threadID, messageID);
        if (!value) return api.sendMessage(getLang("noValue"), threadID, messageID);

        await usersData.set(targetUid, value, `data.custom.${key}`);
        return api.sendMessage(
          getLang("saved").replace("%key%", key).replace("%value%", value),
          threadID,
          messageID
        );
      }

      case "get": {
        const key = args[1];
        if (!key) return api.sendMessage(getLang("noKey"), threadID, messageID);

        const value = await usersData.get(targetUid, `data.custom.${key}`, null);
        if (value === null || value === undefined) {
          return api.sendMessage(getLang("notFound").replace("%key%", key), threadID, messageID);
        }
        return api.sendMessage(
          getLang("got").replace("%key%", key).replace("%value%", value),
          threadID,
          messageID
        );
      }

      case "del": {
        const key = args[1];
        if (!key) return api.sendMessage(getLang("noKey"), threadID, messageID);

        await usersData.set(targetUid, null, `data.custom.${key}`);
        return api.sendMessage(getLang("deleted").replace("%key%", key), threadID, messageID);
      }

      case "all": {
        const userData = await usersData.get(targetUid, "data.custom", {});
        const keys = Object.keys(userData || {});
        if (!keys.length) return api.sendMessage(getLang("allEmpty"), threadID, messageID);

        const lines = keys.map((k) => `❯ ${k}: ${userData[k]}`).join("\n");
        return api.sendMessage(getLang("allHeader") + lines, threadID, messageID);
      }

      default:
        return api.sendMessage(
          "Usage:\nuserdata set <key> <value>\nuserdata get <key>\nuserdata all\nuserdata del <key>",
          threadID,
          messageID
        );
    }
  }
};

/**
 * ---------------------------------------------------------
 * Reusing this from OTHER command files:
 *
 *   // save something
 *   await usersData.set(senderID, "some value", "data.custom.myKey");
 *
 *   // read it back later, even after bot restart
 *   const value = await usersData.get(senderID, "data.custom.myKey", "default");
 *
 * `usersData` is passed automatically into every onStart's
 * destructured params, same as `threadsData`. No extra setup
 * needed since your DataModel.js already persists it to SQLite.
 * ---------------------------------------------------------
 */
