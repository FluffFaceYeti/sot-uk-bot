const { ChannelSelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "birthdaychannel",

    async execute(message) {

        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ You need admin.");
        }

        const menu = new ChannelSelectMenuBuilder()
            .setCustomId("birthday_channel_select")
            .setPlaceholder("Select birthday channel")
            .setMinValues(1)
            .setMaxValues(1)
            .addChannelTypes(0); // text channels

        const row = new ActionRowBuilder().addComponents(menu);

        message.reply({
            content: "🎂 Select the birthday channel:",
            components: [row]
        });
    }
};