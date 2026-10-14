const { playEventAudio } = require("../services/eventAudio");

module.exports = {
  name: "30",

  async execute(message) {
    await playEventAudio(message, "30mins.mp3");
  }
};