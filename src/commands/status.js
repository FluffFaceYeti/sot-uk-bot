const fs = require("fs");
const path = require("path");

module.exports = {

 name: "status",

 async execute(message, client, args) {

  const allowedUsers = [
   "406942041885638677"
  ];

  if (!allowedUsers.includes(message.author.id)) return;

  if (!args.length) {
   return message.reply("Usage: !status <text>");
  }

  const statusText = args.join(" ");

  try {

   client.user.setPresence({
    activities: [{
     name: statusText,
     type: 0
    }],
    status: "online"
   });

   const filePath = path.join(__dirname, "..", "data", "status.json");

   fs.writeFileSync(filePath, JSON.stringify({
    text: statusText
   }, null, 2));

   message.react("✅");

  } catch (error) {

   console.error(error);
   message.reply("Failed to update bot status.");

  }

 }

};