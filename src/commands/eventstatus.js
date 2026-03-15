const fs = require("fs");
const path = require("path");

const statePath = path.join(__dirname, "../data/eventState.json");
const channelsPath = path.join(__dirname, "../data/eventChannels.json");

module.exports = {
name: "eventstatus",

execute(message) {

    let state = { running: false, mode: null, endTime: null };
    let channelsData = { channels: [] };

    try {
        state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    } catch (err) {}

    try {
        channelsData = JSON.parse(fs.readFileSync(channelsPath, "utf8"));
    } catch (err) {}

    const channels = channelsData.channels || [];

    if (!state.running) {

        return message.reply(`📢 **Event Status**


No event is currently running.

Configured Voice Channels: ${channels.length}`);


    }

    let remaining = "Unknown";

    if (state.endTime) {

        const diff = state.endTime - Date.now();
        const minutes = Math.max(0, Math.floor(diff / 60000));

        remaining = `${minutes} minutes`;

    }

    message.reply(`📢 **Event Status**


Mode: ${state.mode}
Time Remaining: ${remaining}
Configured Voice Channels: ${channels.length}`);

}
};
