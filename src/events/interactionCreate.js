const fs = require("fs");
const path = require("path");
const { ChannelSelectMenuBuilder, ActionRowBuilder } = require("discord.js");

const eventPath = path.join(__dirname, "../data/eventChannels.json");
const twitchPath = path.join(__dirname, "../data/twitchConfig.json");

module.exports = {
name: "interactionCreate",


async execute(interaction, client) {

    // BUTTON HANDLER (SETUP DASHBOARD)
    if (interaction.isButton()) {

        // EVENT CHANNEL SETUP
        if (interaction.customId === "setup_event_channels") {

            const menu = new ChannelSelectMenuBuilder()
                .setCustomId("event_channel_select")
                .setPlaceholder("Select event voice channels")
                .setMinValues(1)
                .setMaxValues(10)
                .addChannelTypes(2); // voice channels

            const row = new ActionRowBuilder().addComponents(menu);

            return interaction.reply({
                content: "Select the voice channels used for event alerts:",
                components: [row],
                flags: 64
            });
        }

        // TWITCH CHANNEL SETUP
        if (interaction.customId === "setup_twitch_channel") {

            const menu = new ChannelSelectMenuBuilder()
                .setCustomId("twitch_channel_select")
                .setPlaceholder("Select Twitch alert channel")
                .setMinValues(1)
                .setMaxValues(1)
                .addChannelTypes(0); // text channels

            const row = new ActionRowBuilder().addComponents(menu);

            return interaction.reply({
                content: "Select the channel where Twitch alerts should be sent:",
                components: [row],
                flags: 64
            });
        }
    }

    // CHANNEL SELECT MENUS
    if (interaction.isChannelSelectMenu()) {

        // EVENT VOICE CHANNELS
        if (interaction.customId === "event_channel_select") {

            const selectedChannels = interaction.values;

            const data = { channels: selectedChannels };

            fs.writeFileSync(eventPath, JSON.stringify(data, null, 2));

            return interaction.reply({
                content: "✅ Event voice channels saved!",
                flags: 64
            });
        }

        // TWITCH ALERT CHANNEL
        if (interaction.customId === "twitch_channel_select") {

            let config = {};

            try {
                config = JSON.parse(fs.readFileSync(twitchPath));
            } catch {}

            const channelId = interaction.values[0];

            config[interaction.guild.id] = channelId;

            fs.writeFileSync(twitchPath, JSON.stringify(config, null, 2));

            return interaction.reply({
                content: "📡 Twitch alert channel saved!",
                flags: 64
            });
        }
    }

    // SLASH COMMANDS
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {

        await command.execute(interaction, client);

    } catch (error) {

        console.error(error);

        await interaction.reply({
            content: "There was an error executing this command.",
            flags: 64
        });
    }
}


};
