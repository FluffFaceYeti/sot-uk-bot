const { playEventAudio } = require("../services/eventAudio");

module.exports = {
  name: "10",

  async execute(message) {
    await playEventAudio(message, "10mins.mp3");
  }
};
