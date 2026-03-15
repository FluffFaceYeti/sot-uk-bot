const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/alertChannels.json");

module.exports = {
    name: "setupalertchannel",

    async execute(message) {

        if (!message.member.permissions.has("Administrator")) {
            return message.reply("You need Administrator permission to run this.");
        }

        const selectMenu = new ChannelSelectMenuBuilder()
            .setCustomId("alert_channel_select")
            .setPlaceholder("Select voice channels for alerts")
            .setMinValues(1)
            .setMaxValues(5)
            .addChannelTypes(ChannelType.GuildVoice);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        message.reply({
            content: "Select the voice channels used for event alerts:",
            components: [row]
        });
    }
};