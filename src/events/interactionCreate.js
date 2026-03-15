const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/alertChannels.json");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // HANDLE DROPDOWN CHANNEL SELECTION
        if (interaction.isChannelSelectMenu()) {

            if (interaction.customId === "alert_channel_select") {

                const selectedChannels = interaction.values;

                const data = { channels: selectedChannels };

                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

                return interaction.reply({
                    content: "✅ Alert channels saved successfully!",
                    ephemeral: true
                });
            }
        }

        // HANDLE SLASH COMMANDS
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error executing this command.",
                ephemeral: true
            });
        }
    }
};