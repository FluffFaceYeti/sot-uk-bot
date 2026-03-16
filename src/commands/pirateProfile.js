const generateCard = require("../systems/pirateCardGenerator");
const drawCard = require("../systems/pirateCardCanvas");

module.exports = {

 name: "pirateprofile",

 async execute(message, client, args) {

  const subcommand = args && args[0] ? args[0].toLowerCase() : null;

  if (subcommand !== "create") {
   return message.reply(
    "Use `!pirateprofile create` to forge your pirate card."
   );
  }

  // Ask for image
  await message.reply("🏴 Upload your pirate selfie.");

  const filter = m =>
   m.author.id === message.author.id && m.attachments.size > 0;

  try {

   const collected = await message.channel.awaitMessages({
    filter,
    max: 1,
    time: 30000,
    errors: ["time"]
   });

   const photo = collected.first().attachments.first().url;

   // Generate pirate stats
   const card = generateCard(
    message.author.id,
    message.author.username
   );

   const reveal = await message.channel.send(
    "Forging pirate card..."
   );

   const steps = [
    "Drawing treasure map...",
    "Sharpening cutlass...",
    "Rolling the dice of fate..."
   ];

   for (const step of steps) {

    await new Promise(r => setTimeout(r, 1500));
    await reveal.edit(step);

   }

   await new Promise(r => setTimeout(r, 2000));

   await reveal.edit(
    `⭐ **${card.rarity.toUpperCase()} PIRATE DISCOVERED** ⭐`
   );

   // Generate card image
   const cardImage = await drawCard(photo, card);

   await message.channel.send({

    content:
`🏴 **Here is your pirate profile.**
Keep this image safe — SoT_UK does not store pirate photos.`,

    files: [cardImage]

   });

  } catch {

   message.reply(
    "⏳ You didn't upload an image in time. Try again with `!pirateprofile create`."
   );

  }

 }

};