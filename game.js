// Inventory
let inventory = {
  wood: 0,
  stone: 0,
  torch: 0
};

function updateInventoryUI() {
  const inv = document.getElementById("inventory");
  inv.innerHTML = "";
  Object.keys(inventory).forEach(item => {
    const slot = document.createElement("div");
    slot.textContent = inventory[item] > 0 ? `${item[0].toUpperCase()}:${inventory[item]}` : "";
    inv.appendChild(slot);
  });
}

// Simulate collecting resources
canvas.addEventListener("click", (e) => {
  const x = Math.floor(e.offsetX / tileSize + cameraX);
  const y = Math.floor(e.offsetY / tileSize);
  if (world[y] && world[y][x]) {
    let biome = world[y][x];
    if (biome === "forest") inventory.wood++;
    if (biome === "underworld") inventory.stone++;
    world[y][x] = 0;
    updateInventoryUI();
  }
});

// Crafting
function craftTorch() {
  if (inventory.wood >= 2 && inventory.stone >= 1) {
    inventory.wood -= 2;
    inventory.stone -= 1;
    inventory.torch += 1;
    alert("Crafted a torch!");
    updateInventoryUI();
  }
}

// Trigger crafting near Work Bench
function checkCrafting() {
  stations.forEach(station => {
    if (station.name === "Work Bench" &&
        Math.abs(player.x - station.x) < 1 &&
        Math.abs(player.y - station.y) < 1) {
      craftTorch();
    }
  });
}

// Save/Load
function saveGame() {
  const data = {
    player,
    inventory,
    world
  };
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
