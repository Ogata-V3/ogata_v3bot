module.exports.config = {
  name: "autoreact",
  version: "3.1",
  author: "Ajmaul",
  countDown: 0,
  role: 0,
  shortDescription: "Auto react to messages based on keywords",
  longDescription: "Automatically reacts with emojis based on message content",
  category: "system",
  guide: { en: "Auto trigger — no manual use needed" }
};

module.exports.onStart = async function () {};

// onChat fires on every message — proper GoatBot V2 format
module.exports.onChat = async function ({ api, event }) {
  const { messageID, body } = event;
  if (!body || !messageID) return;

  const msg = body.toLowerCase();

  const match = (list) => list.some(w => msg.includes(w));

  const reactions = [
    { words: ["🖤","soul","dark","alone","black heart"], emoji: "🖤" },
    { words: ["love","ilove","labyu","baby","babe","kiss","hug","crush","cute","sweet","mwah","😘","😍","🥰","❤️","💋","romantic"], emoji: "❤️" },
    { words: ["sex","fuck","porn","horny","xxx"], emoji: "😏" },
    { words: ["sad","pain","hurt","cry","😭","😢","lonely","broken","breakup","depress"], emoji: "😢" },
    { words: ["good morning","gm","good night","gn","morning","night","sleep","wake"], emoji: "❤" },
    { words: ["wow","amazing","great","super","nice","awesome","legend","bot op"], emoji: "😮" },
    { words: ["angry","mad","fuck you","bitch","stop","shut up"], emoji: "😡" },
    { words: ["lol","lmao","haha","😂","🤣","funny","haste"], emoji: "😂" },
    { words: ["food","pizza","burger","rice","eat","hungry","khida"], emoji: "🍔" },
    { words: ["song","music","gan","lyrics","beat","rap"], emoji: "🎶" },
    { words: ["fire","lit","power","boss","king","danger"], emoji: "🔥" },
    { words: ["hmm","think","maybe","idea","confuse"], emoji: "🤔" },
    { words: ["yes","true","right","ok","agree","done","sure"], emoji: "✅" },
    { words: ["no","false","wrong","never","cancel"], emoji: "❌" },
    { words: ["?","why","what","how","when","keno","kivabe"], emoji: "❓" }
  ];

  return async () => {
    try {
      for (const r of reactions) {
        if (match(r.words)) {
          api.setMessageReaction(r.emoji, messageID, () => {}, true);
          return;
        }
      }
    } catch {}
  };
};
