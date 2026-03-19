const axios = require("axios");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

let accessToken = null;
let live = false;

async function getToken() {

    const response = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        null,
        {
            params: {
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                grant_type: "client_credentials"
            }
        }
    );

    accessToken = response.data.access_token;
}

async function checkStream(client) {

    if (!accessToken) {
        await getToken();
    }

    const response = await axios.get(
        "https://api.twitch.tv/helix/streams",
        {
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${accessToken}`
            },
            params: {
                user_login: process.env.TWITCH_CHANNEL
            }
        }
    );

    const stream = response.data.data[0];

    if (stream && !live) {

        live = true;

        const fs = require("fs");
        const path = require("path");

        const configPath = path.join(__dirname, "../../userdata/twitchConfig.json");

        let config = {};
        try {
            if (fs.existsSync(configPath)) {
                config = JSON.parse(fs.readFileSync(configPath));
            }
        } catch (err) {
            console.error("Config load error:", err);
        }

        const streamer = process.env.TWITCH_CHANNEL;

        // 🔥 Get streamer profile
        const userResponse = await axios.get(
            "https://api.twitch.tv/helix/users",
            {
                headers: {
                    "Client-ID": process.env.TWITCH_CLIENT_ID,
                    "Authorization": `Bearer ${accessToken}`
                },
                params: {
                    login: streamer
                }
            }
        );

        const user = userResponse.data.data[0];

        // 🔥 LOOP ALL GUILDS
        for (const guild of client.guilds.cache.values()) {

            const channelId = config[guild.id];

            if (!channelId) {
                console.log("No Twitch channel set for guild:", guild.id);
                continue;
            }

            const channel = guild.channels.cache.get(channelId);

            if (!channel) {
                console.log("Channel not found:", channelId);
                continue;
            }

            const embed = new EmbedBuilder()
                .setColor(0x9146FF)
                .setAuthor({
                    name: `${streamer} is now LIVE on Twitch!`,
                    iconURL: user.profile_image_url,
                    url: `https://twitch.tv/${streamer}`
                })
                .setTitle(stream.title)
                .setURL(`https://twitch.tv/${streamer}`)
                .addFields(
                    {
                        name: "🎮 Game",
                        value: stream.game_name || "Unknown",
                        inline: true
                    },
                    {
                        name: "👀 Viewers",
                        value: stream.viewer_count.toString(),
                        inline: true
                    }
                )
                .setImage(
                    stream.thumbnail_url
                        .replace("{width}", "1280")
                        .replace("{height}", "720") + `?t=${Date.now()}`
                )
                .setFooter({
                    text: "Twitch Live Alert"
                })
                .setTimestamp();

            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Watch Stream")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://twitch.tv/${streamer}`)
            );

            console.log("Sending Twitch alert to guild:", guild.id);

            channel.send({
                content: `@everyone **${streamer} is now LIVE! Come check it out and have fun with the admin team!**`,
                embeds: [embed],
                components: [button]
            }).catch(err => {
                console.error("SEND ERROR:", err);
            });
        }
    }

    // 🔴 RESET WHEN OFFLINE
    if (!stream) {
        live = false;
    }
}

module.exports = {
    checkStream
};