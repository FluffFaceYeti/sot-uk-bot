module.exports = {
name: "commands",

execute(message, client) {

    const seen = new Set();
    const commandList = [];

    client.commands.forEach(cmd => {
        if (seen.has(cmd)) return;
        seen.add(cmd);
        commandList.push(`• ${cmd.name}`);
    });

    message.reply(


`📜 **Available Commands**

${commandList.join("\n")}

Use your server prefix before each command.`
);

}

};
