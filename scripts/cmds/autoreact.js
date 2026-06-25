module.exports.config = {
  name: "autoreact",
  version: "3.0.0",
  hasPermission: 0,
  credits: "ALVI",
  description: "Ultra Advanced Auto Reaction",
  commandCategory: "No Prefix",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { messageID } = event;
  if (!event.body || !messageID) return;

  const msg = event.body.toLowerCase();

  // ---------- WORD CATEGORIES ----------
  const loveWords = [
    "love","ilove","labyu","mahal","baby","babe","bby","kiss","hug",
    "crush","cute","kilig","sweet","mwah","😗","😘","😍","🥰",
    "heart","❤️","💋","hot","romantic","sexy","u love me"
  ];

  const badWords = [
    "sex","fuck","porn","hot video","horny","vagina","dick","boob",
    "cum","nude","xxx","xvideo","manyak"
  ];

  const sadWords = [
    "sad","pain","hurt","cry","😭","😢","😞","😔","lonely",
    "broken","breakup","die","kill me","depress","stress"
  ];

  const greetWords = [
    "good morning","gm","good night","gn","morning","night",
    "evening","sleep","wake"
  ];

  const wowWords = [
    "wow","amazing","bot op","great","super","nice",
    "awesome","legend"
  ];

  const soulWords = [
    "soul","dark","alone","black heart"
  ];

  const angryWords = [
    "angry","rag","mad","fuck you","bitch","stop","shut up"
  ];

  const laughWords = [
    "lol","lmao","haha","😂","🤣","funny","joke","haste"
  ];

  const questionWords = [
    "?","why","what","how","kivabe","keno","ki","when"
  ];

  const foodWords = [
    "food","pizza","burger","rice","eat","hungry","khida"
  ];

  const musicWords = [
    "song","music","gan","lyrics","beat","rap","singer"
  ];

  const fireWords = [
    "fire","lit","power","boss","king","danger","killer"
  ];

  const thinkWords = [
    "think","hmm","maybe","idea","wait","confuse"
  ];

  const yesWords = [
    "yes","true","right","ok","agree","done","sure"
  ];

  const noWords = [
    "no","false","wrong","not","never","cancel"
  ];

  // ---------- MATCH ----------
  const match = (list) => list.some(word => msg.includes(word));

  // ---------- REACTIONS ----------
  if (match(soulWords)) return api.setMessageReaction("🖤", messageID, () => {});
  if (match(loveWords)) return api.setMessageReaction("❤️", messageID, () => {});
  if (match(badWords)) return api.setMessageReaction("😏", messageID, () => {});
  if (match(sadWords)) return api.setMessageReaction("😢", messageID, () => {});
  if (match(greetWords)) return api.setMessageReaction("❤", messageID, () => {});
  if (match(wowWords)) return api.setMessageReaction("😮", messageID, () => {});
  if (match(angryWords)) return api.setMessageReaction("😡", messageID, () => {});
  if (match(laughWords)) return api.setMessageReaction("😂", messageID, () => {});
  if (match(questionWords)) return api.setMessageReaction("❓", messageID, () => {});
  if (match(foodWords)) return api.setMessageReaction("🍔", messageID, () => {});
  if (match(musicWords)) return api.setMessageReaction("🎶", messageID, () => {});
  if (match(fireWords)) return api.setMessageReaction("🔥", messageID, () => {});
  if (match(thinkWords)) return api.setMessageReaction("🤔", messageID, () => {});
  if (match(yesWords)) return api.setMessageReaction("✅", messageID, () => {});
  if (match(noWords)) return api.setMessageReaction("❌", messageID, () => {});
};

module.exports.run = async function () {};
