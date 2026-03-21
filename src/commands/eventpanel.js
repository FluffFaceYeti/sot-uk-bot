const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require("discord.js");

module.exports = {
    name: "eventpanel",

    async execute(message) {

        if (!message.member.permissions.has("Administrator")) {
            return message.reply("❌ Admins only.");
        }

        // =====================
        // 🎮 MAIN CONTROLS
        // =====================
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("event_start_manual")
                .setLabel("Start Manual")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("event_start_auto")
                .setLabel("Start Auto")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("event_stop")
                .setLabel("Stop")
                .setStyle(ButtonStyle.Danger)
        );

        // =====================
        // 🔔 ALERT CONTROLS
        // =====================
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
                .setStyle(ButtonStyle.Secondary),

            // ✅ NEW BUTTON
            new ButtonBuilder()
                .setCustomId("event_time")
                .setLabel("Time")
                .setStyle(ButtonStyle.Secondary)
        );

        // =====================
        // ⚙️ INFO + SETUP
        // =====================
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