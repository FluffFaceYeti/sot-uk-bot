const fetch = require("node-fetch");

// List of API commands
const apiCommands = [
 "pirate"
];

module.exports = {

 name: "api",

 aliases: apiCommands,

 async execute(message) {

  const commandUsed = message.content
   .split(" ")[0]
   .replace("!", "")
   .toLowerCase();

  if (!apiCommands.includes(commandUsed)) return;

  const username = message.author.username;

  try {

   const res = await fetch(
    `https://flufffaceyeti.twitch.socdesigns.com/?sender=${username}&type=${commandUsed}`
   );

   const text = await res.text();

   message.channel.send(
    `@${username} ${text}`
   );

  } catch (error) {

   console.error(error);

   message.reply("The pirate oracle is currently lost at sea.");

  }

 }

};