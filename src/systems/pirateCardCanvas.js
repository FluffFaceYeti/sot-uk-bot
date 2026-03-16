const { createCanvas, loadImage, registerFont } = require("canvas");
const { AttachmentBuilder } = require("discord.js");

registerFont("./src/assets/fonts/pirata.ttf", { family: "Pirate" });

function fitText(ctx, text, maxWidth, startSize) {

    let size = startSize;

    do {
        ctx.font = `${size}px Pirate`;
        size--;
    } while (ctx.measureText(text).width > maxWidth && size > 20);

    return ctx.font;
}

async function drawCard(photoURL, card) {

    const width = 700;
    const height = 1000;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const frame = await loadImage("./src/assets/cards/base-card.png");
    const portrait = await loadImage(photoURL);

    // Portrait

    const portraitX = 120;
    const portraitY = 120;
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

    // Frame overlay

    ctx.drawImage(frame, 0, 0, width, height);

    ctx.fillStyle = "#2a1a0a";
    ctx.textAlign = "center";

    // Name (auto size)

    ctx.font = fitText(ctx, card.name, 500, 52);
    ctx.fillText(card.name, 350, 95);

    // Title

    ctx.font = fitText(ctx, card.title, 420, 36);
    ctx.fillText(card.title, 350, 520);

    // Stats

    ctx.textAlign = "left";
    ctx.font = "30px Pirate";

    ctx.fillText(card.stats.sword, 250, 640);
    ctx.fillText(card.stats.cannon, 250, 690);
    ctx.fillText(card.stats.navigation, 250, 740);
    ctx.fillText(card.stats.rum, 250, 790);
    ctx.fillText(card.stats.chaos, 250, 840);

    // Rarity Colors

    const rarityColors = {
        Common: "#c9c9c9",
        Rare: "#3aa0ff",
        Epic: "#b84cff",
        Legendary: "#ffd700"
    };

    const color = rarityColors[card.rarity] || "#ffffff";

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.font = "46px Pirate";

    ctx.fillText(card.rarity.toUpperCase(), 350, 930);

    // Glow effect

    ctx.shadowColor = color;
    ctx.shadowBlur = card.rarity === "Legendary" ? 30 : 12;

    ctx.fillText(card.rarity.toUpperCase(), 350, 930);

    ctx.shadowBlur = 0;

    // Legendary shine overlay

    if (card.rarity === "Legendary") {

        const gradient = ctx.createLinearGradient(0, 0, width, height);

        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(0.5, "rgba(255,255,255,0.25)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    // Card number

    ctx.fillStyle = "#2a1a0a";
    ctx.font = "22px Pirate";
    ctx.textAlign = "right";

    ctx.fillText(`#${card.cardNumber} / 500`, 660, 40);

    return new AttachmentBuilder(canvas.toBuffer(), {
        name: "pirate-card.png"
    });
}

module.exports = drawCard;