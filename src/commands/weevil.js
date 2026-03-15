const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const path = require("path");

module.exports = {
name: "weevil",


async execute(message) {

    // TARGET USER ID
    const targetUserId = "461842426613465089";

    // CHANNEL TO MOVE THEM TO
    const trollChannelId = "1475273097996406784";

    const member = message.guild.members.cache.get(targetUserId);

    if (!member) {
        return message.reply("Target user not found.");
    }

    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        return message.reply("Target user is not in a voice channel.");
    }

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();

    const resource = createAudioResource(
        path.join(__dirname, "../audio/weevil.wav")
    );

    connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {

        const trollChannel = message.guild.channels.cache.get(trollChannelId);

        if (trollChannel) {
            member.voice.setChannel(trollChannel);
        }

        connection.destroy();
    });

}


};
