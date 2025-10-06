const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const worldWidth = 300;
const worldHeight = 40;
let cameraX = 0;

// Biomes and colors
const BIOMES = ["forest", "desert", "jungle", "underworld"];
const COLORS = {
  forest: "#228B22",
  desert: "#DEB887",
  jungle: "#006400",
  underworld: "#4B0082",
  dirt: "#654321"
};

// World generation
let world = Array.from({ length: worldHeight }, () => Array(worldWidth).fill(0));
let biomeMap = [];
for (let x = 0; x < worldWidth; x++) {
  let biome = BIOMES[Math.floor(x / (worldWidth / BIOMES.length))];
  biomeMap[x] = biome;
  for (let y = worldHeight / 2; y < worldHeight; y++) {
    world[Math.floor(y)][x] = biome;
  }
}

// Floating islands
for (let i = 0; i < 5; i++) {
  let ix = Math.floor(Math.random() * worldWidth);
  let iy = Math.floor(Math.random() * worldHeight / 2);
  for (let y = -1; y <= 1; y++) {
    for (let x = -2; x <= 2; x++) {
      if (world[iy + y] && world[iy + y][ix + x] !== undefined) {
        world[iy + y][ix + x] = "dirt";
      }
    }
  }
}

// Player
let player = {
  x: 10,
  y: 10,
  vx: 0,
  vy: 0,
  width: 1,
  height: 1,
  grounded: false
};

// Crafting stations
let stations = [
  { name: "Work Bench", x: 20, y: worldHeight / 2 - 1 },
  { name: "Furnace", x: 25, y: worldHeight / 2 - 1 },
  { name: "Anvil", x: 30, y: worldHeight / 2 - 1 }
];

// NPCs
let npcs = [
  { name: "Guide", x: 15, y: worldHeight / 2 - 1, service: "tips" },
  { name: "Merchant", x: 35, y: worldHeight / 2 - 1, service: "shop" }
];

// Boss
let boss = { x: 50, y: worldHeight / 2 - 1, active: false, health: 100 };

// Drawing functions
function drawWorld() {
  for (let y = 0; y < worldHeight; y++) {
    for (let x = 0; x < worldWidth; x++) {
      let tile = world[y][x];
      if (tile) {
        ctx.fillStyle = COLORS[tile] || "#000";
        ctx.fillRect((x - cameraX) * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "#00f";
  ctx.fillRect((player.x - cameraX) * tileSize, player.y * tileSize, tileSize, tileSize);
}

function drawStations() {
  stations.forEach(station => {
    ctx.fillStyle = "#ccc";
    ctx.fillRect((station.x - cameraX) * tileSize, station.y * tileSize, tileSize, tileSize);
    ctx.fillStyle = "#000";
    ctx.fillText(station.name[0], (station.x - cameraX) * tileSize + 10, station.y * tileSize + 25);
  });
}

function drawNPCs() {
  npcs.forEach(npc => {
    ctx.fillStyle = "#ff0";
    ctx.fillRect((npc.x - cameraX) * tileSize, npc.y * tileSize, tileSize, tileSize);
    ctx.fillStyle = "#000";
    ctx.fillText(npc.name[0], (npc.x - cameraX) * tileSize + 10, npc.y * tileSize + 25);
  });
}

function drawBoss() {
  if (boss.active) {
    ctx.fillStyle = "#f00";
    ctx.fillRect((boss.x - cameraX) * tileSize, boss.y * tileSize, tileSize, tileSize);
    ctx.fillStyle = "#fff";
    ctx.fillText(`HP: ${Math.floor(boss.health)}`, (boss.x - cameraX) * tileSize, boss.y * tileSize - 10);
  }
}

// Game logic
function updatePhysics() {
  player.vy += 0.5;
  player.x += player.vx;
  player.y += player.vy;

  player.grounded = false;
  for (let y = Math.floor(player.y); y < Math.ceil(player.y + player.height); y++) {
    for (let x = Math.floor(player.x); x < Math.ceil(player.x + player.width); x++) {
      if (world[y] && world[y][x]) {
        if (player.vy > 0) {
          player.y = y - player.height;
          player.vy = 0;
          player.grounded = true;
        } else if (player.vy < 0) {
          player.y = y + 1;
          player.vy = 0;
        }
      }
    }
  }

  player.x = Math.max(0, Math.min(worldWidth - player.width, player.x));
  player.y = Math.min(worldHeight - player.height, player.y);
  cameraX = Math.floor(player.x - canvas.width / tileSize / 2);
  cameraX = Math.max(0, Math.min(worldWidth - canvas.width / tileSize, cameraX));
}

function checkCrafting() {
  stations.forEach(station => {
    if (Math.abs(player.x - station.x) < 1 && Math.abs(player.y - station.y) < 1) {
      console.log(`Near ${station.name}: Crafting unlocked`);
    }
  });
}

function checkNPCInteraction() {
  npcs.forEach(npc => {
    if (Math.abs(player.x - npc.x) < 1 && Math.abs(player.y - npc.y) < 1) {
      console.log(`Met ${npc.name}: Offers ${npc.service}`);
    }
  });
}

function checkBossTrigger() {
  if (!boss.active && Math.abs(player.x - boss.x) < 1) {
    boss.active = true;
    console.log("Boss fight started!");
  }
}

function updateBoss() {
  if (boss.active) {
    boss.health -= 0.5;
    if (boss.health <= 0) {
      console.log("Boss defeated! Loot earned.");
      boss.active = false;
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  drawStations();
  drawNPCs();
  drawBoss();
  drawPlayer();
}

function gameLoop() {
  updatePhysics();
  checkCrafting();
  checkNPCInteraction();
  checkBossTrigger();
  updateBoss();
  render();
  requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.vx = -0.2;
  if (e.key === "ArrowRight") player.vx = 0.2;
  if (e.key === " " && player.grounded) player.vy = -10;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.vx = 0;
});

// Click to toggle blocks
canvas.addEventListener("click", (e) => {
  const x = Math.floor(e.offsetX / tileSize + cameraX);
  const y = Math.floor(e.offsetY / tileSize);
  if (world[y] && world[y][x] !== undefined) {
    world[y][x] = world[y][x] ? 0 : "dirt";
  }
});

gameLoop();
