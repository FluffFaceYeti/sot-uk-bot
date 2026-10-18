require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();

// One bad command/alert shouldn't be able to take the whole bot down.
client.on("error", (err) => console.error("CLIENT ERROR:", err));

process.on("unhandledRejection", (err) => console.error("UNHANDLED REJECTION:", err));

require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);

client.login(process.env.TOKEN);