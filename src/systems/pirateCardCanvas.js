const { createCanvas, loadImage, registerFont } = require("canvas");
const { AttachmentBuilder } = require("discord.js");

// Load Pirate Font
registerFont("./src/assets/fonts/PirataOne-Regular.ttf", {
 family: "Pirata One"
});

// Automatically shrink text if too long
function fitText(ctx, text, maxWidth, startSize) {

 let size = startSize;

 do {
  ctx.font = `${size}px "Pirata One"`;
  size--;
 } while (ctx.measureText(text).width > maxWidth && size > 20);

 return ctx.font;
}

async function drawCard(photoURL, card) {

 const width = 700;
 const height = 1000;

 const canvas = createCanvas(width, height);
 const ctx = canvas.getContext("2d");

 const portrait = await loadImage(photoURL);
 const frame = await loadImage("./src/assets/cards/base-card.png");

 // Portrait (draw first)

 const portraitX = 120;
 const portraitY = 130;
 const portraitW = 460;
 const portraitH = 360;

 const size = Math.min(portrait.width, portrait.height);

 ctx.drawImage(
  portrait,
  (portrait.width - size) / 2,
  (portrait.height - size) / 2,
  size,
  size,
  portraitX,
  portraitY,
  portraitW,
  portraitH
 );

 // Card frame on top
 ctx.drawImage(frame, 0, 0, width, height);

 ctx.fillStyle = "#2a1a0a";
 ctx.textAlign = "center";

 // Pirate Name
 ctx.font = fitText(ctx, card.name, 500, 52);
 ctx.fillText(card.name, 350, 90);

 // Pirate Title
 ctx.font = fitText(ctx, card.title, 420, 36);
 ctx.fillText(card.title, 350, 520);

 // Stats
 ctx.textAlign = "left";
 ctx.font = `32px "Pirata One"`;

 ctx.fillText(card.stats.sword, 260, 640);
 ctx.fillText(card.stats.cannon, 260, 690);
 ctx.fillText(card.stats.navigation, 260, 740);
 ctx.fillText(card.stats.rum, 260, 790);
 ctx.fillText(card.stats.chaos, 260, 840);

 // Rarity Colors
 const rarityColors = {
  Common: "#c9c9c9",
  Rare: "#3aa0ff",
  Epic: "#b84cff",
  Legendary: "#ffd700"
 };

 ctx.fillStyle = rarityColors[card.rarity] || "#ffffff";

 ctx.textAlign = "center";
 ctx.font = `46px "Pirata One"`;

 ctx.fillText(card.rarity.toUpperCase(), 350, 930);

 // Card number
 ctx.fillStyle = "#2a1a0a";
 ctx.font = `22px "Pirata One"`;
 ctx.textAlign = "right";

 ctx.fillText(`#${card.cardNumber}/500`, 660, 40);

 return new AttachmentBuilder(canvas.toBuffer(), {
  name: "pirate-card.png"
 });
}

module.exports = drawCard;