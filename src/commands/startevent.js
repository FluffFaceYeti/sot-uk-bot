const fs = require("fs");
const path = require("path");

const statePath = path.join(__dirname, "../../userdata/eventState.json");

let timers = [];

function clearScheduledTimers() {
    timers.forEach(timer => clearTimeout(timer));
    timers.length = 0;
}

// Schedules the remaining alerts for an event that has `minutes` left on the clock.
// Used both when an event is first started and when resuming one after a restart.
function scheduleAlerts(fakeMessage, client, minutes, state) {

    // 2 HOURS remaining
    if (minutes >= 120) {
        timers.push(setTimeout(() => {
            client.commands.get("2hour")?.execute(fakeMessage, client, []);
        }, (minutes - 120) * 60000));
    }

    // 1 HOUR remaining
    if (minutes >= 60) {
        timers.push(setTimeout(() => {
            client.commands.get("hour")?.execute(fakeMessage, client, []);
        }, (minutes - 60) * 60000));
    }

    // 30 minutes remaining
    if (minutes >= 30) {
        timers.push(setTimeout(() => {
            client.commands.get("30")?.execute(fakeMessage, client, []);
        }, (minutes - 30) * 60000));
    }

    // 10 minutes remaining
    if (minutes >= 10) {
        timers.push(setTimeout(() => {
            client.commands.get("10")?.execute(fakeMessage, client, []);
        }, (minutes - 10) * 60000));
    }

    // 5 minutes remaining
    if (minutes >= 5) {
        timers.push(setTimeout(() => {
            client.commands.get("5")?.execute(fakeMessage, client, []);
        }, (minutes - 5) * 60000));
    }

    // FINAL TIME
    timers.push(setTimeout(() => {

        client.commands.get("time")?.execute(fakeMessage, client, []);

        state.running = false;
        state.mode = null;
        state.endTime = null;
        state.guildId = null;
        state.channelId = null;

        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

    }, minutes * 60000));
}

module.exports = {
    name: "startevent",

    async execute(message, client, args) {

        const minutes = args[0] ? parseInt(args[0]) : null;

        let state = {
            running: false,
            mode: null,
            endTime: null,
            guildId: null,
            channelId: null
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
            state.guildId = message.guild.id;
            state.channelId = message.channel.id;

            fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

            return message.reply("✅ Event started in manual mode.");
        }

        // =====================
        // 🔴 VALIDATE INPUT
        // =====================
        if (isNaN(minutes) || minutes <= 0) {
            return message.reply("❌ Invalid time provided.");
        }

        state.running = true;
        state.mode = "automatic";
        state.endTime = Date.now() + minutes * 60000;
        state.guildId = message.guild.id;
        state.channelId = message.channel.id;

        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

        message.reply(`⏳ Event timer started: ${minutes} minutes`);

        // GO immediately
        const goCmd = client.commands.get("go");
        if (goCmd) goCmd.execute(message, client, []);

        scheduleAlerts(message, client, minutes, state);
    },

    // Called once at bot startup to pick back up an automatic event that was
    // still running when the process last stopped (crash, redeploy, restart).
    resume(client) {

        let state;

        try {
            state = JSON.parse(fs.readFileSync(statePath, "utf8"));
        } catch {
            return;
        }

        if (!state.running || state.mode !== "automatic" || !state.endTime) {
            return;
        }

        const minutesRemaining = Math.ceil((state.endTime - Date.now()) / 60000);

        const resetState = () => {
            state.running = false;
            state.mode = null;
            state.endTime = null;
            state.guildId = null;
            state.channelId = null;
            fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
        };

        if (minutesRemaining <= 0) {
            console.log("⚠️ Event ended while the bot was offline — resetting state.");
            return resetState();
        }

        const guild = client.guilds.cache.get(state.guildId);
        const channel = guild?.channels.cache.get(state.channelId);

        if (!guild || !channel) {
            console.log("⚠️ Could not resume event (guild/channel not found) — resetting state.");
            return resetState();
        }

        const fakeMessage = {
            guild,
            channel,
            reply: (msg) => channel.send(msg)
        };

        console.log(`🔁 Resuming event: ${minutesRemaining} minute(s) remaining.`);

        scheduleAlerts(fakeMessage, client, minutesRemaining, state);
    }
};

module.exports.timers = timers;
module.exports.clearScheduledTimers = clearScheduledTimers;
