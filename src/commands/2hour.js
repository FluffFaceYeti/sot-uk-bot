const { playEventAudio } = require("../services/eventAudio");

module.exports = {
  name: "2hour",

  async execute(message) {
    await playEventAudio(message, "2hour.wav");
  }
};
