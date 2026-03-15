module.exports = {
    name: "clientReady",
    once: true,
    execute(client) {
        console.log(`SoT_UK Bot is online as ${client.user.tag}`);
    }
};