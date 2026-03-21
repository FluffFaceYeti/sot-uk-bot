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

  let data = {};

  try {
    data = JSON.parse(fs.readFileSync(dataPath));
  } catch (err) {
    console.error("❌ Failed to load eventChannels.json:", err);
  }

  const guildChannels = data[message.guild.id];

  if (!guildChannels || guildChannels.length === 0) {
    return message.reply("❌ No event channels configured for this server.");
  }

  const channels = [...new Set(guildChannels)];

  const audioPath = path.join(__dirname, "../audio", audioFile);

  if (!fs.existsSync(audioPath)) {
    return message.reply("❌ Audio file not found.");
  }

  const startMessage = await message.channel.send(
    `🔔 Playing event alert: **${audioFile}**`
  );

  await sleep(1000);

  // 🔥 SEQUENTIAL PLAYBACK (VERY STABLE)
  for (const channelId of channels) {

    const channel = message.guild.channels.cache.get(channelId);

    if (!channel || channel.type !== 2) {
      console.log(`❌ Invalid channel ID: ${channelId}`);
      continue;
    }

    console.log(`➡️ Joining: ${channel.name}`);

    if (!channel.permissionsFor(message.guild.members.me).has(["Connect", "Speak"])) {
      console.log(`❌ Missing permissions in ${channel.name}`);
      continue;
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
        continue;
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

      // 🔥 small delay between channels
      await sleep(500);

    } catch (err) {
      console.error(`❌ Voice error in ${channel?.name}:`, err);
    }
  }

  const endMessage = await message.channel.send("🔔 Alert finished!");

  await sleep(2000);

  try {
    await startMessage.delete();
    await endMessage.delete();
  } catch (err) {
    console.error("❌ Failed to delete messages:", err);
  }
}

module.exports = { playEventAudio };