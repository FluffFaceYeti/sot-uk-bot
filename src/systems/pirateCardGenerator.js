const seededRandom = require("./seededRandom");

const titles = [
 "Kraken Botherer",
 "Storm Navigator",
 "Treasure Hoarder",
 "Fort Raider",
 "Skeleton Slayer",
 "Cannon Maniac",
 "Grog Champion"
];

function generateCard(userID, username) {

 const seed = parseInt(userID.slice(-6));

 function stat(n) {
  return Math.floor(seededRandom(seed + n) * 100);
 }

 const rarityRoll = seededRandom(seed + 500);

 let rarity = "Common";

 if (rarityRoll > 0.97) rarity = "Legendary";
 else if (rarityRoll > 0.9) rarity = "Epic";
 else if (rarityRoll > 0.7) rarity = "Rare";

 return {

  name: username,
  title: titles[Math.floor(seededRandom(seed + 10) * titles.length)],
  rarity,

  cardNumber: Math.floor(seededRandom(seed + 20) * 500),

  stats: {
   sword: stat(1),
   cannon: stat(2),
   navigation: stat(3),
   rum: stat(4),
   chaos: stat(5)
  }

 };
}

module.exports = generateCard;