const axios = require("axios");
const fs = require("fs");
const path = require("path");

let twitchToken = null;
let isLive = false;

async function getTwitchToken() {

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

    twitchToken = response.data.access_token;

}

async function checkTwitch(client) {

    if (!twitchToken) {
        await getTwitchToken();
    }

    const response = await axios.get(
        "https://api.twitch.tv/helix/streams",
        {
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${twitchToken}`
            },
            params: {
                user_login: "sot_uk"
            }
        }
    );

    const stream = response.data.data[0];

    if (stream && !isLive) {

        isLive = true;

        const channel = client.channels.cache.get("YOUR_DISCORD_CHANNEL_ID");

        if (channel) {

            channel.send(
                `🔴 **SoT_UK is LIVE!**\nhttps://www.twitch.tv/sot_uk`
            );

        }

    }

    if (!stream) {
        isLive = false;
    }

}

module.exports = {
    name: "clientReady",
    once: true,

    execute(client) {

        console.log(`SoT_UK Bot is online as ${client.user.tag}`);

        const statusFile = path.join(__dirname, "..", "data", "status.json");

        let statusText = "🏴‍☠️ Stealing your booty 🏴‍☠️";

        if (fs.existsSync(statusFile)) {

            const statusData = JSON.parse(fs.readFileSync(statusFile));

            if (statusData.text) {
                statusText = statusData.text;
            }

        }

        client.user.setPresence({
            activities: [{
                name: statusText,
                type: 0
            }],
            status: "online"
        });

        // check Twitch every 90 seconds
        setInterval(() => {
            checkTwitch(client);
        }, 90000);

    }
};