const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "birthday",

    async execute(message) {

        const monthMenu = new StringSelectMenuBuilder()
            .setCustomId("birthday_month")
            .setPlaceholder("Select your birth month")
            .addOptions([
                { label: "January", value: "1" },
                { label: "February", value: "2" },
                { label: "March", value: "3" },
                { label: "April", value: "4" },
                { label: "May", value: "5" },
                { label: "June", value: "6" },
                { label: "July", value: "7" },
                { label: "August", value: "8" },
                { label: "September", value: "9" },
                { label: "October", value: "10" },
                { label: "November", value: "11" },
                { label: "December", value: "12" }
            ]);

        const dayMenu = new StringSelectMenuBuilder()
            .setCustomId("birthday_day")
            .setPlaceholder("Select your birth day")
            .addOptions(
                Array.from({ length: 31 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: `${i + 1}`
                }))
            );

        const row1 = new ActionRowBuilder().addComponents(monthMenu);
        const row2 = new ActionRowBuilder().addComponents(dayMenu);

        message.reply({
            content: "🎂 Select your birthday:",
            components: [row1, row2]
        });
    }
};