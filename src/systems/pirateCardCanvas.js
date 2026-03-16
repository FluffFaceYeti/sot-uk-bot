const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const { AttachmentBuilder } = require("discord.js");

// Load Pirate Font (absolute path)
const fontPath = path.join(__dirname, "../assets/fonts/PirataOne-Regular.ttf");

registerFont(fontPath, {
    family: "PirataOne"
});

async function drawCard(photoURL, card) {

    const width = 700;
    const height = 1000;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const portrait = await loadImage(photoURL);
    const frame = await loadImage(
        path.join(__dirname, "../assets/cards/base-card.png")
    );

    // ---- Draw Portrait ----
    ctx.save();

    ctx.beginPath();
    ctx.rect(120, 130, 460, 360);
    ctx.clip();

    ctx.drawImage(portrait, 120, 130, 460, 360);

    ctx.restore();

    // ---- Draw Frame on top ----
    ctx.drawImage(frame, 0, 0, width, height);

    ctx.fillStyle = "#2a1a0a";
    ctx.textAlign = "center";

    // ---- Pirate Name ----
    ctx.font = '52px "PirataOne"';
    ctx.fillText(card.name, 350, 95);

    // ---- Pirate Title ----
    ctx.font = '36px "PirataOne"';
    ctx.fillText(card.title, 350, 515);

    // ---- Stats ----
    ctx.textAlign = "left";
    ctx.font = '32px "PirataOne"';

    ctx.fillText(card.stats.sword, 300, 640);
    ctx.fillText(card.stats.cannon, 300, 690);
    ctx.fillText(card.stats.navigation, 300, 740);
    ctx.fillText(card.stats.rum, 300, 790);
    ctx.fillText(card.stats.chaos, 300, 840);

    // ---- Rarity Colors ----
    const rarityColors = {
        Common: "#c9c9c9",
        Rare: "#3aa0ff",
        Epic: "#b84cff",
        Legendary: "#ffd700"
    };

    ctx.fillStyle = rarityColors[card.rarity] || "#ffffff";

    ctx.textAlign = "center";
    ctx.font = '46px "PirataOne"';

    ctx.fillText(card.rarity.toUpperCase(), 350, 930);

    // ---- Card Number ----
    ctx.fillStyle = "#2a1a0a";
    ctx.font = '22px "PirataOne"';
    ctx.textAlign = "right";

    ctx.fillText(`#${card.cardNumber}/500`, 660, 40);

    return new AttachmentBuilder(canvas.toBuffer(), {
        name: "pirate-card.png"
    });
}

module.exports = drawCard;