const fs = require("fs");
const path = require("path");
const { 
    ChannelSelectMenuBuilder, 
    ActionRowBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle 
} = require("discord.js");

// ✅ BASE PATH
const basePath = path.join(__dirname, "../../userdata");

// FILES
const eventPath = path.join(basePath, "eventChannels.json");
const twitchPath = path.join(basePath, "twitchConfig.json");
const prefixPath = path.join(basePath, "prefixes.json");
const birthdayPath = path.join(basePath, "birthdays.json");
const birthdayChannelPath = path.join(basePath, "birthdayChannels.json");

// temp storage
const temp = {};

// ensure folder exists
if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
}

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // =========================
        // 🔒 GLOBAL ADMIN LOCK (buttons + menus + modals)
        // =========================
        if (
            interaction.isButton() ||
            interaction.isChannelSelectMenu() ||
            interaction.isStringSelectMenu() ||
            interaction.isModalSubmit()
        ) {
            if (!interaction.member.permissions.has("Administrator")) {
                return interaction.reply({
                    content: "❌ Admins only.",
                    ephemeral: true
                });
            }
        }

        // =========================
        // 🎯 BUTTONS
        // =========================
        if (interaction.isButton()) {

            const id = interaction.customId;

            // 🔁 Fake message (so existing commands still work)
            const fakeMessage = {
                guild: interaction.guild,
                channel: interaction.channel,
                member: interaction.member,
                author: interaction.user,
                reply: (msg) => interaction.channel.send(msg)
            };

            const reply = (msg) =>
                interaction.reply({ content: msg, ephemeral: true });

            // =====================
            // 🎮 EVENT PANEL BUTTONS
            // =====================

            if (id === "event_start_manual") {
                client.commands.get("startevent").execute(fakeMessage, client, []);
                return reply("✅ Manual event started");
            }

            if (id === "event_start_1h") {
                client.commands.get("startevent").execute(fakeMessage, client, ["60"]);
                return reply("⏳ 1 hour event started");
            }

            if (id === "event_stop") {
                client.commands.get("stopevent").execute(fakeMessage);
                return reply("🛑 Event stopped");
            }

            if (id === "event_go") {
                client.commands.get("go").execute(fakeMessage);
                return reply("▶️ GO triggered");
            }

            if (id === "event_5") {
                client.commands.get("5").execute(fakeMessage);
                return reply("⏱️ 5 minute alert");
            }

            if (id === "event_30") {
                client.commands.get("30").execute(fakeMessage);
                return reply("⏱️ 30 minute alert");
            }

            if (id === "event_hour") {
                client.commands.get("hour").execute(fakeMessage);
                return reply("⏱️ 1 hour alert");
            }

            if (id === "event_status") {
                client.commands.get("eventstatus").execute(fakeMessage);
                return reply("📊 Status sent");
            }

            if (id === "event_setup") {
                client.commands.get("setupevent").execute(fakeMessage);
                return reply("⚙️ Setup opened");
            }

            // =====================
            // ⚙️ YOUR EXISTING SETUP BUTTONS
            // =====================

            if (id === "setup_event_channels") {

                const menu = new ChannelSelectMenuBuilder()
                    .setCustomId("event_channel_select")
                    .setPlaceholder("Select event voice channels")
                    .setMinValues(1)
                    .setMaxValues(10)
                    .addChannelTypes(2);

                return interaction.reply({
                    content: "Select event voice channels:",
                    components: [new ActionRowBuilder().addComponents(menu)],
                    ephemeral: true
                });
            }

            if (id === "setup_twitch_channel") {

                const menu = new ChannelSelectMenuBuilder()
                    .setCustomId("twitch_channel_select")
                    .setPlaceholder("Select Twitch alert channel")
                    .addChannelTypes(0);

                return interaction.reply({
                    content: "Select Twitch channel:",
                    components: [new ActionRowBuilder().addComponents(menu)],
                    ephemeral: true
                });
            }

            if (id === "setup_prefix") {

                const modal = new ModalBuilder()
                    .setCustomId("prefix_modal")
                    .setTitle("Change Prefix");

                const input = new TextInputBuilder()
                    .setCustomId("prefix_input")
                    .setLabel("New prefix")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(input));

                return interaction.showModal(modal);
            }
        }

        // =========================
        // 📂 CHANNEL SELECT MENUS
        // =========================
        if (interaction.isChannelSelectMenu()) {

            if (interaction.customId === "birthday_channel_select") {

                let config = {};
                try {
                    config = JSON.parse(fs.readFileSync(birthdayChannelPath));
                } catch {}

                config[interaction.guild.id] = interaction.values[0];

                fs.writeFileSync(birthdayChannelPath, JSON.stringify(config, null, 2));

                return interaction.reply({
                    content: "🎂 Birthday channel saved!",
                    ephemeral: true
                });
            }

            if (interaction.customId === "twitch_channel_select") {

                let config = {};
                try {
                    config = JSON.parse(fs.readFileSync(twitchPath));
                } catch {}

                config[interaction.guild.id] = interaction.values[0];

                fs.writeFileSync(twitchPath, JSON.stringify(config, null, 2));

                return interaction.reply({
                    content: "📡 Twitch channel saved!",
                    ephemeral: true
                });
            }
        }

        // =========================
        // 🎂 STRING SELECT MENUS
        // =========================
        if (interaction.isStringSelectMenu()) {

            const userId = interaction.user.id;

            if (interaction.customId === "birthday_month") {

                temp[userId] = { month: parseInt(interaction.values[0]) };

                return interaction.reply({
                    content: "Now pick your day 🎉",
                    ephemeral: true
                });
            }

            if (
                interaction.customId === "birthday_day_1" ||
                interaction.customId === "birthday_day_2"
            ) {

                if (!temp[userId]) {
                    return interaction.reply({
                        content: "Pick a month first!",
                        ephemeral: true
                    });
                }

                const month = temp[userId].month;
                const day = parseInt(interaction.values[0]);

                let data = {};
                try {
                    data = JSON.parse(fs.readFileSync(birthdayPath));
                } catch {}

                data[userId] = { day, month };

                fs.writeFileSync(birthdayPath, JSON.stringify(data, null, 2));

                delete temp[userId];

                return interaction.reply({
                    content: `🎂 Birthday saved: **${day}/${month}**`,
                    ephemeral: true
                });
            }
        }

        // =========================
        // 🧾 MODALS
        // =========================
        if (interaction.isModalSubmit()) {

            if (interaction.customId === "prefix_modal") {

                let prefixes = {};
                try {
                    prefixes = JSON.parse(fs.readFileSync(prefixPath));
                } catch {}

                const newPrefix = interaction.fields.getTextInputValue("prefix_input");

                prefixes[interaction.guild.id] = newPrefix;

                fs.writeFileSync(prefixPath, JSON.stringify(prefixes, null, 2));

                return interaction.reply({
                    content: `✅ Prefix updated to \`${newPrefix}\``,
                    ephemeral: true
                });
            }
        }

        // =========================
        // 💬 SLASH COMMANDS
        // =========================
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Error executing command.", ephemeral: true });
        }
    }
};