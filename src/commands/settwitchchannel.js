const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../data/twitchConfig.json");

module.exports = {
    name: "settwitchchannel",

    execute(message) {

        if (!message.member.permissions.has("Administrator")) {
            return message.reply("You must be an administrator to use this command.");
        }

        const config = JSON.parse(fs.readFileSync(configPath));

        config[message.guild.id] = message.channel.id;

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        message.reply("✅ Twitch alerts will now be sent to this channel.");
    }
};