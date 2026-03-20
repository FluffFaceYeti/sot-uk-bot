const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 🎂 Birthday system
const { checkBirthdays } = require("../utils/birthdayCheck");

// 🔴 Twitch system
let twitchToken = null;
let isLive = false;

const { checkStream } = require("../services/twitchMonitor");

const statusFile = path.join(__dirname, "../../userdata/status.json");
const configPath = path.join(__dirname, "../../userdata/twitchConfig.json");

const STREAMER = "sot_uk";

// 🔑 Get Twitch token
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

// 🔍 Check Twitch live status (presence only)
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

    // 🔴 LIVE
    if (stream && !isLive) {

        isLive = true;

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
                if (saved.text) statusText = saved.text;
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

        // 🟢 Default status
        let statusText = "🏴‍☠️ Stealing your booty 🏴‍☠️";

        try {
            if (fs.existsSync(statusFile)) {
                const statusData = JSON.parse(fs.readFileSync(statusFile));
                if (statusData.text) statusText = statusData.text;
            }
        } catch {}

        client.user.setPresence({
            activities: [{
                name: statusText,
                type: 0
            }],
            status: "online"
        });

        // 🔴 Twitch alert system (external embed handler)
        checkStream(client);

        setInterval(() => {
            checkStream(client);
        }, 90000);

        // (Optional presence updater if you want both)
        // setInterval(() => {
        //     checkTwitch(client);
        // }, 90000);

        // 🎂 Birthday system
        checkBirthdays(client);

        setInterval(() => {
            checkBirthdays(client);
        }, 60 * 1000);
    }
};