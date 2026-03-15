const { timers } = require("../services/eventAudio");

module.exports = {
    name: "stopevent",

    execute(message) {

        timers.forEach(timer => clearTimeout(timer));
        timers = [];

        message.reply("🛑 Event timer stopped.");

    }
};
