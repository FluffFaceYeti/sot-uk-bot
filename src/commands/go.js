const { playEventAudio } = require("../services/eventAudio");

module.exports = {
  name: "go",

  async execute(message) {
    await playEventAudio(message, "gogogo.mp3");
  }
};