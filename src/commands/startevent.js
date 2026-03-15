const fs = require("fs");
const path = require("path");
const { playEventAudio } = require("../services/eventAudio");

const statePath = path.join(__dirname, "../data/eventState.json");

let timers = [];

module.exports = {
name: "startevent",


async execute(message, client, args) {

    const minutes = parseInt(args[0]);

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

    if (!minutes) {

        state.running = true;
        state.mode = "manual";
        state.endTime = null;

        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

        return message.reply("✅ Event started in manual mode.");

    }

    const ms = minutes * 60000;

    state.running = true;
    state.mode = "automatic";
    state.endTime = Date.now() + ms;

    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

    message.reply(`⏳ Event timer started: ${minutes} minutes`);

    if (minutes >= 60) {
        timers.push(setTimeout(() => {
            playEventAudio(message, "hour.wav");
        }, (minutes - 60) * 60000));
    }

    if (minutes >= 30) {
        timers.push(setTimeout(() => {
            playEventAudio(message, "30.wav");
        }, (minutes - 30) * 60000));
    }

    if (minutes >= 5) {
        timers.push(setTimeout(() => {
            playEventAudio(message, "5.wav");
        }, (minutes - 5) * 60000));
    }

    timers.push(setTimeout(() => {

        playEventAudio(message, "go.wav");

        state.running = false;
        state.mode = null;
        state.endTime = null;

        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

    }, ms));

}

};
module.exports.timers = timers;
