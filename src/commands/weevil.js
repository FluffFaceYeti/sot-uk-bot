const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const fs = require("fs");
const path = require("path");

const permPath = path.join(__dirname, "../../userdata/weevilPermissions.json");
const blacklistPath = path.join(__dirname, "../../userdata/weevilBlacklist.json");

module.exports = {
    name: "naughty",

    async execute(message) {

        // LOAD BLACKLIST
        let blacklist = { blocked: {} };
        try {
            blacklist = JSON.parse(fs.readFileSync(blacklistPath));
        } catch {}

        const blockedMessage = blacklist.blocked[message.author.id];
        if (blockedMessage) {
            return message.reply(blockedMessage);
        }

        // LOAD PERMISSIONS
        let perms = { users: [], roles: [] };
        try {
            perms = JSON.parse(fs.readFileSync(permPath));
        } catch {}

        const allowedUser = perms.users.includes(message.author.id);
        const allowedRole = message.member.roles.cache.some(role => perms.roles.includes(role.id));

        if (!allowedUser && !allowedRole && !message.member.permissions.has("Administrator")) {
            return message.reply("🚫 You don't have permission to use this command.");
        }

        // MUST BE IN VC
        const authorVC = message.member.voice.channel;
        if (!authorVC) {
            return message.reply("You must be in a voice channel to use this command.");
        }

        const trollChannelId = "1475273097996406784";

        // GET TARGETS
        const mentionEveryone = message.content.includes("@everyone");
        const mentionedUsers = message.mentions.members;

        let targets = [];

        if (mentionEveryone) {
            // Everyone in your VC except you
            targets = authorVC.members.filter(m => m.id !== message.author.id);

        } else if (mentionedUsers.size > 0) {
            // Only users in YOUR VC
            targets = mentionedUsers.filter(m => 
                m.voice.channel && m.voice.channel.id === authorVC.id
            );

            if (targets.size === 0) {
                return message.reply("That user must be in your voice channel.");
            }

        } else {
            return message.reply("Please mention a user or use @everyone.");
        }

        // OPTIONAL: Prevent moving admins (uncomment if needed)
        /*
        targets = targets.filter(m => !m.permissions.has("Administrator"));
        */

        if (targets.size === 0) {
            return message.reply("No valid targets found.");
        }

        // JOIN YOUR VC
        const connection = joinVoiceChannel({
            channelId: authorVC.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer();

        const resource = createAudioResource(
            path.join(__dirname, "../audio/weevil.wav") // change if needed
        );

        connection.subscribe(player);
        player.play(resource);

        player.on(AudioPlayerStatus.Idle, async () => {

            const trollChannel = message.guild.channels.cache.get(trollChannelId);

            if (trollChannel) {
                for (const member of targets.values()) {
                    if (member.voice.channel) {
                        try {
                            await member.voice.setChannel(trollChannel);
                        } catch (err) {
                            console.log(`Failed to move ${member.user.tag}`);
                        }
                    }
                }
            }

            connection.destroy();
        });

    }
};