const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let world = Array.from({ length: rows }, (_, y) =>
  Array.from({ length: cols }, (_, x) => (y > rows / 2 ? 1 : 0))
);

let player = { x: 5, y: 5 };

function drawWorld() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (world[y][x] === 1) {
        ctx.fillStyle = "#654321";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "#00f";
  ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  drawPlayer();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.x = Math.max(0, player.x - 1);
  if (e.key === "ArrowRight") player.x = Math.min(cols - 1, player.x + 1);
  if (e.key === "ArrowUp") player.y = Math.max(0, player.y - 1);
  if (e.key === "ArrowDown") player.y = Math.min(rows - 1, player.y + 1);
  update();
});

update();
