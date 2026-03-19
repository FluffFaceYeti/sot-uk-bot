const axios = require("axios");
const fs = require("fs");
const path = require("path");

let twitchToken = null;
let isLive = false;

const statusFile = path.join(__dirname, "../../userdata/status.json");
const configPath = path.join(__dirname, "../../userdata/twitchConfig.json");
const { checkBirthdays } = require("../../utils/birthdayCheck");

const STREAMER = "sot_uk";

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
                user_login: STREAMER
            }
        }
    );

    const stream = response.data.data[0];

    let config = {};
    try {
        if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath));
        }
    } catch (err) {
        console.error("Config load error:", err);
    }

    // 🔴 LIVE
    if (stream && !isLive) {

        isLive = true;

        // ❌ REMOVED OLD MESSAGE SENDING BLOCK
        // Twitch alerts are now handled by twitchMonitor.js

        client.user.setPresence({
            activities: [{
                name: `LIVE: ${stream.game_name}`,
                type: 0
            }],
            status: "online"
        });
    }

    // ⚫ OFFLINE
    if (!stream && isLive) {

        isLive = false;

        let statusText = "🏴‍☠️ Stealing your booty 🏴‍☠️";

        try {
            if (fs.existsSync(statusFile)) {
                const saved = JSON.parse(fs.readFileSync(statusFile));
                if (saved.text) {
                    statusText = saved.text;
                }
            }
        } catch {}

        client.user.setPresence({
            activities: [{
                name: statusText,
                type: 0
            }],
            status: "online"
        });
    }
}

module.exports = {
    name: "clientReady",
    once: true,

    execute(client) {

        console.log(`SoT_UK Bot is online as ${client.user.tag}`);

        let statusText = "🏴‍☠️ Stealing your booty 🏴‍☠️";

        try {
            if (fs.existsSync(statusFile)) {
                const statusData = JSON.parse(fs.readFileSync(statusFile));
                if (statusData.text) {
                    statusText = statusData.text;
                }
            }
        } catch {}

        client.user.setPresence({
            activities: [{
                name: statusText,
                type: 0
            }],
            status: "online"
        });

        // 🔴 Twitch presence checker
        checkTwitch(client);

        setInterval(() => {
            checkTwitch(client);
        }, 90000);

        // 🎂 RUN EVERY MINUTE
        setInterval(() => {
            checkBirthdays(client);
        }, 60 * 1000);
    }
};
