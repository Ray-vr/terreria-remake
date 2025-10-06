const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const worldWidth = 100;
const worldHeight = 30;
let cameraX = 0;
let playerColor = "#0000ff";

// World generation
let world = Array.from({ length: worldHeight }, (_, y) =>
  Array.from({ length: worldWidth }, (_, x) => (y > worldHeight / 2 ? "dirt" : 0))
);

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

// Inventory
let inventory = { wood: 0, stone: 0, torch: 0 };

// Crafting stations
let stations = [{ name: "Work Bench", x: 20, y: worldHeight / 2 - 1 }];

// Draw functions
function drawWorld() {
  for (let y = 0; y < worldHeight; y++) {
    for (let x = 0; x < worldWidth; x++) {
      if (world[y][x]) {
        ctx.fillStyle = "#654321";
        ctx.fillRect((x - cameraX) * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = playerColor;
  ctx.fillRect((player.x - cameraX) * tileSize, player.y * tileSize, tileSize, tileSize);
}

function drawStations() {
  stations.forEach(station => {
    ctx.fillStyle = "#ccc";
    ctx.fillRect((station.x - cameraX) * tileSize, station.y * tileSize, tileSize, tileSize);
  });
}

function updateInventoryUI() {
  const inv = document.getElementById("inventory");
  inv.innerHTML = "";
  Object.keys(inventory).forEach(item => {
    const slot = document.createElement("div");
    slot.textContent = inventory[item] > 0 ? `${item[0].toUpperCase()}:${inventory[item]}` : "";
    inv.appendChild(slot);
  });
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
      if (inventory.wood >= 2 && inventory.stone >= 1) {
        inventory.wood -= 2;
        inventory.stone -= 1;
        inventory.torch += 1;
        alert("Crafted a torch!");
        updateInventoryUI();
      }
    }
  });
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  drawStations();
  drawPlayer();
}

function gameLoop() {
  updatePhysics();
  checkCrafting();
  render();
  updateInventoryUI();
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

// Click to collect resources
canvas.addEventListener("click", (e) => {
  const x = Math.floor(e.offsetX / tileSize + cameraX);
  const y = Math.floor(e.offsetY / tileSize);
  if (world[y] && world[y][x]) {
    inventory.wood++;
    world[y][x] = 0;
    updateInventoryUI();
  }
});

// Menu functions
function startGame() {
  document.getElementById("main-menu").style.display = "none";
  canvas.style.display = "block";
  document.getElementById("inventory").style.display = "grid";
  document.getElementById("saveBtn").style.display = "inline";
  document.getElementById("loadBtn").style.display = "inline";
  gameLoop();
}

function toggleSettings() {
  const settings = document.getElementById("settings");
  settings.style.display = settings.style.display === "none" ? "block" : "none";
}

function updatePlayerColor() {
  playerColor = document.getElementById("playerColor").value;
}

// Save/load
function saveGame() {
  const data = { player, inventory, world };
  localStorage.setItem("terrariaSave", JSON.stringify(data));
  alert("Game saved!");
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem("terrariaSave"));
  if (data) {
    player = data.player;
    inventory = data.inventory;
    world = data.world;
    updateInventoryUI();
    alert("Game loaded!");
  } else {
    alert("No save found.");
  }
}
