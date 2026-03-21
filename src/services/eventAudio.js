const fs = require("fs");
const path = require("path");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus,
  StreamType
} = require("@discordjs/voice");

const dataPath = path.join(__dirname, "../../userdata/eventChannels.json");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playEventAudio(message, audioFile) {

  const data = JSON.parse(fs.readFileSync(dataPath));

  const audioPath = path.join(__dirname, "../audio", audioFile);

  if (!fs.existsSync(audioPath)) {
    return message.reply("Audio file not found.");
  }

  const guildChannels = data[message.guild.id] || [];
  const channels = [...new Set(guildChannels)];

  if (channels.length === 0) {
    return message.reply("❌ No event channels configured for this server.");
  }

  const startMessage = await message.channel.send(`🔔 Playing event alert: **${audioFile}**`);

  await sleep(1000); // shorter delay (optional tweak)

  // 🔥 SIMULTANEOUS AUDIO
  const playPromises = channels.map(async (channelId) => {

    const channel = message.guild.channels.cache.get(channelId);
    if (!channel || channel.type !== 2) return;

    // 🔒 Permission check (prevents silent failures)
    if (!channel.permissionsFor(message.guild.members.me).has(["Connect", "Speak"])) {
      console.log(`❌ Missing permissions in ${channel.name}`);
      return;
    }

    try {

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: false
      });

      try {
        await entersState(connection, VoiceConnectionStatus.Ready, 20000);
      } catch (err) {
        console.log(`❌ Failed to connect to ${channel.name}`);
        connection.destroy();
        return;
      }

      const player = createAudioPlayer();

      const resource = createAudioResource(
        fs.createReadStream(audioPath),
        { inputType: StreamType.Arbitrary }
      );

      connection.subscribe(player);
      player.play(resource);

      await new Promise(resolve => {
        player.once(AudioPlayerStatus.Idle, resolve);
      });

      connection.destroy();

    } catch (err) {
      console.error(`❌ Voice error in ${channel?.name}:`, err);
    }

  });

  // 🔥 WAIT FOR ALL CHANNELS TO FINISH
  await Promise.all(playPromises);

  const endMessage = await message.channel.send("🔔 Alert finished!");

  await sleep(2000);

  try {
    await startMessage.delete();
    await endMessage.delete();
  } catch (err) {
    console.error("Failed to delete messages:", err);
  }
}

module.exports = { playEventAudio };