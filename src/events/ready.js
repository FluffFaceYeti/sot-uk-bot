module.exports = {
    name: "clientReady",
    once: true,
    execute(client) {

        console.log(`SoT_UK Bot is online as ${client.user.tag}`);

        client.user.setPresence({
            activities: [
                {
                    name: "🏴‍☠️ Stealing your booty 🏴‍☠️",
                    type: 0 // Playing
                }
            ],
            status: "online"
        });

    }
};