const fs = require("fs");
const path = require("path");

const statePath = path.join(__dirname, "../data/eventState.json");

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

    state.running = false;
    state.mode = null;
    state.endTime = null;

    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

    message.reply("🛑 Event stopped successfully.");

}

};
