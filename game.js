let playerColor = "#0000ff";

function startGame() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game").style.display = "block";
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

// Replace drawPlayer function
function drawPlayer() {
  ctx.fillStyle = playerColor;
  ctx.fillRect((player.x - cameraX) * tileSize, player.y * tileSize, tileSize, tileSize);
}
