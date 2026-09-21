const fs = require("fs");
const path = require("path");

// 🎂 Birthday system
const { checkBirthdays } = require("../utils/birthdayCheck");

// 🔴 Twitch system
const { checkStream } = require("../services/twitchMonitor");

const statusFile = path.join(__dirname, "../../userdata/status.json");

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

        // 🎂 Birthday system
        checkBirthdays(client);

        setInterval(() => {
            checkBirthdays(client);
        }, 60 * 1000);
    }
};