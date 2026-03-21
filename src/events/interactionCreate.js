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

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
}

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        // =========================
        // 🔒 ADMIN LOCK
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
            const member = interaction.guild.members.cache.get(interaction.user.id);

            const fakeMessage = {
                guild: interaction.guild,
                channel: interaction.channel,
                member,
                author: interaction.user,
                reply: (msg) => interaction.channel.send(msg)
            };

            const reply = (msg) =>
                interaction.reply({ content: msg, ephemeral: true });

            try {

                if (id === "event_start_manual") {
                    client.commands.get("startevent").execute(fakeMessage, client, []);
                    return reply("✅ Manual event started");
                }

                if (id === "event_start_auto") {

                    const modal = new ModalBuilder()
                        .setCustomId("event_hours_modal")
                        .setTitle("Start Automatic Event");

                    const input = new TextInputBuilder()
                        .setCustomId("event_hours_input")
                        .setLabel("Duration (hours)")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(input)
                    );

                    return interaction.showModal(modal);
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

                if (id === "event_time") {
                client.commands.get("time").execute(fakeMessage);
                return reply("⏱️ Event end triggered");
                }

                if (id === "event_status") {
                client.commands.get("eventstatus").execute(fakeMessage);
                return reply("📊 Status sent");
                }

                if (id === "event_setup") {
                    client.commands.get("setupevent").execute(fakeMessage);
                    return reply("⚙️ Setup opened");
                }

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

            } catch (err) {
                console.error("BUTTON ERROR:", err);

                if (!interaction.replied) {
                    return interaction.reply({
                        content: "❌ Something went wrong.",
                        ephemeral: true
                    });
                }
            }
        }

        // =========================
        // 📂 CHANNEL SELECT
        // =========================
        if (interaction.isChannelSelectMenu()) {

            // 🎮 EVENT CHANNELS (FIXED)
            if (interaction.customId === "event_channel_select") {

                console.log("📥 SELECT VALUES:", interaction.values);

                if (!interaction.values || interaction.values.length === 0) {
                    return interaction.reply({
                        content: "❌ No channels selected. Previous config kept.",
                        ephemeral: true
                    });
                }

                let config = {};

                try {
                    config = JSON.parse(fs.readFileSync(eventPath));
                } catch {}

                config[interaction.guild.id] = interaction.values;

                fs.writeFileSync(eventPath, JSON.stringify(config, null, 2));

                console.log("✅ SAVED CHANNELS:", config[interaction.guild.id]);

                return interaction.reply({
                    content: `✅ Saved ${interaction.values.length} event channel(s)!`,
                    ephemeral: true
                });
            }

            // Twitch
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

            // Birthday
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
        }

        // =========================
        // 🧾 MODALS
        // =========================
        if (interaction.isModalSubmit()) {

            try {

                if (interaction.customId === "event_hours_modal") {

                    const hours = parseFloat(
                        interaction.fields.getTextInputValue("event_hours_input")
                    );

                    if (isNaN(hours) || hours <= 0) {
                        return interaction.reply({
                            content: "❌ Enter a valid number.",
                            ephemeral: true
                        });
                    }

                    const member = interaction.guild.members.cache.get(interaction.user.id);

                    const fakeMessage = {
                        guild: interaction.guild,
                        channel: interaction.channel,
                        member,
                        author: interaction.user,
                        reply: (msg) => interaction.channel.send(msg)
                    };

                    const minutes = Math.round(hours * 60);

                    await client.commands
                        .get("startevent")
                        .execute(fakeMessage, client, [String(minutes)]);

                    return interaction.reply({
                        content: `⏳ Auto event started for ${hours} hour(s)`,
                        ephemeral: true
                    });
                }

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

            } catch (err) {
                console.error("MODAL ERROR:", err);

                if (!interaction.replied) {
                    return interaction.reply({
                        content: "❌ Something went wrong.",
                        ephemeral: true
                    });
                }
            }
        }
    }
};