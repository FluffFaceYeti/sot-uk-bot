const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require("discord.js");

module.exports = {
    name: "eventpanel",

    async execute(message) {

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("event_start_manual")
                .setLabel("Start Manual")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("event_start_1h")
                .setLabel("Start 1 Hour")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("event_stop")
                .setLabel("Stop")
                .setStyle(ButtonStyle.Danger)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("event_go")
                .setLabel("GO")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("event_5")
                .setLabel("5 Min")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("event_30")
                .setLabel("30 Min")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("event_hour")
                .setLabel("1 Hour Alert")
                .setStyle(ButtonStyle.Secondary)
        );

        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("event_status")
                .setLabel("Status")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("event_setup")
                .setLabel("Setup Channels")
                .setStyle(ButtonStyle.Secondary)
        );

        message.channel.send({
            content: "🎮 **Event Control Panel**",
            components: [row1, row2, row3]
        });
    }
};