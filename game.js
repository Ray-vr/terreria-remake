function startGame() {
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  document.getElementById("inventory").style.display = "grid";
  document.getElementById("saveBtn").style.display = "inline";
  document.getElementById("loadBtn").style.display = "inline";
  gameLoop(); // Make sure this starts your game
}

function toggleSettings() {
  const settings = document.getElementById("settings");
  settings.style.display = settings.style.display === "none" ? "block" : "none";
}

function exitGame() {
  alert("Thanks for playing!");
  location.reload(); // Simple exit behavior
}

function clearSettings() {
  document.getElementById("playerColor").value = "#0000ff";
  updatePlayerColor();
  alert("Settings reset.");
}

function updatePlayerColor() {
  playerColor = document.getElementById("playerColor").value;
}
