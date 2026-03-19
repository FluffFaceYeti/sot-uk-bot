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

        const dayMenu1 = new StringSelectMenuBuilder()
            .setCustomId("birthday_day_1")
            .setPlaceholder("Select day (1–25)")
            .addOptions(
                Array.from({ length: 25 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: `${i + 1}`
                }))
            );

        const dayMenu2 = new StringSelectMenuBuilder()
            .setCustomId("birthday_day_2")
            .setPlaceholder("Select day (26–31)")
            .addOptions(
                Array.from({ length: 6 }, (_, i) => ({
                    label: `${i + 26}`,
                    value: `${i + 26}`
                }))
            );

        const row1 = new ActionRowBuilder().addComponents(monthMenu);
        const row2 = new ActionRowBuilder().addComponents(dayMenu1);
        const row3 = new ActionRowBuilder().addComponents(dayMenu2);

        message.reply({
            content: "🎂 Select your birthday:",
            components: [row1, row2, row3]
        });
    }
};