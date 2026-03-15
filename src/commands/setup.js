const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
name: "setup",


execute(message) {

    if (!message.member.permissions.has("Administrator")) {
        return message.reply("You must be an administrator to use setup.");
    }

    const row = new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId("setup_event_channels")
            .setLabel("Event Voice Channels")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("setup_twitch_channel")
            .setLabel("Twitch Alert Channel")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("setup_prefix")
            .setLabel("Set Prefix")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("reset_config")
            .setLabel("Reset Config")
            .setStyle(ButtonStyle.Danger)
    );

    message.reply({
        content: "⚙️ **Bot Setup Panel**\nSelect an option below:",
        components: [row]
    });

}


};
