const { playEventAudio } = require("../services/eventAudio");

let timers = [];

module.exports = {
    name: "startevent",

    async execute(message, client, args) {

        const minutes = parseInt(args[0]);

        // MANUAL MODE
        if (!minutes) {

            message.reply("✅ Event started in manual mode.");
            return;

        }

        message.reply(`⏳ Event timer started: ${minutes} minutes`);

        const ms = minutes * 60000;

        // 1 hour remaining
        if (minutes >= 60) {

            timers.push(setTimeout(() => {
                playEventAudio(message, "hour.wav");
            }, (minutes - 60) * 60000));

        }

        // 30 minutes remaining
        if (minutes >= 30) {

            timers.push(setTimeout(() => {
                playEventAudio(message, "30.wav");
            }, (minutes - 30) * 60000));

        }

        // 5 minutes remaining
        timers.push(setTimeout(() => {
            playEventAudio(message, "5.wav");
        }, (minutes - 5) * 60000));

        // GO
        timers.push(setTimeout(() => {
            playEventAudio(message, "go.wav");
        }, ms));

    }
};

module.exports.timers = timers;