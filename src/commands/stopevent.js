const fs = require("fs");
const path = require("path");
const { clearScheduledTimers } = require("./startevent");

const statePath = path.join(__dirname, "../../userdata/eventState.json");

module.exports = {
name: "stopevent",


execute(message) {

    let state;

    try {
        state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    } catch {
        state = { running: false };
    }

    if (!state.running) {
        return message.reply("⚠️ No event is currently running.");
    }

    clearScheduledTimers();

    state.running = false;
    state.mode = null;
    state.endTime = null;
    state.guildId = null;
    state.channelId = null;

    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

    message.reply("🛑 Event stopped successfully.");

}


};
