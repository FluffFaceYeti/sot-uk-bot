const fs = require("fs");
const path = require("path");

const statePath = path.join(__dirname, "../../userdata/eventState.json");

let timers = [];

module.exports = {
    name: "startevent",

    async execute(message, client, args) {

        const minutes = args[0] ? parseInt(args[0]) : null;

        let state = {
            running: false,
            mode: null,
            endTime: null
        };

        try {
            state = JSON.parse(fs.readFileSync(statePath, "utf8"));
        } catch {}

        if (state.running) {
            return message.reply("⚠️ An event is already running.");
        }

        // =====================
        // 🟢 MANUAL MODE
        // =====================
        if (minutes === null) {

            state.running = true;
            state.mode = "manual";

            fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

            return message.reply("✅ Event started in manual mode.");
        }

        // =====================
        // 🔴 VALIDATE INPUT
        // =====================
        if (isNaN(minutes) || minutes <= 0) {
            return message.reply("❌ Invalid time provided.");
        }

        const ms = minutes * 60000;

        state.running = true;
        state.mode = "automatic";
        state.endTime = Date.now() + ms;

        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

        message.reply(`⏳ Event timer started: ${minutes} minutes`);

        // GO immediately
        const goCmd = client.commands.get("go");
        if (goCmd) goCmd.execute(message, client, []);

        // 1 HOUR remaining
        if (minutes >= 60) {
            timers.push(setTimeout(() => {
                client.commands.get("hour")?.execute(message, client, []);
            }, (minutes - 60) * 60000));
        }

        // 30 minutes remaining
        if (minutes >= 30) {
            timers.push(setTimeout(() => {
                client.commands.get("30")?.execute(message, client, []);
            }, (minutes - 30) * 60000));
        }

        // 5 minutes remaining
        if (minutes >= 5) {
            timers.push(setTimeout(() => {
                client.commands.get("5")?.execute(message, client, []);
            }, (minutes - 5) * 60000));
        }

        // FINAL TIME
        timers.push(setTimeout(() => {

            client.commands.get("time")?.execute(message, client, []);

            state.running = false;
            state.mode = null;
            state.endTime = null;

            fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

        }, ms));
    }
};

module.exports.timers = timers;