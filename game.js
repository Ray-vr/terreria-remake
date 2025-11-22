window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const TILE_SIZE = 20;
    const WORLD_WIDTH = canvas.width / TILE_SIZE;
    const WORLD_HEIGHT = canvas.height / TILE_SIZE;

    // A simple 2D array to represent the world (0: air, 1: ground)
    const world = [];
    for (let y = 0; y < WORLD_HEIGHT; y++) {
        world[y] = [];
        for (let x = 0; x < WORLD_WIDTH; x++) {
            if (y > WORLD_HEIGHT / 2) {
                world[y][x] = 1; // Ground
            } else {
                world[y][x] = 0; // Air
            }
        }
    }

    const player = {
        x: 5,
        y: WORLD_HEIGHT / 2 - 1,
        color: 'green',
        name: 'Player',
        update: function() {
            // Basic gravity simulation (very simple)
            if (this.y  0.5) {
                this.x += (Math.random() > 0.5 ? 0.1 : -0.1);
            }
            // Basic gravity simulation
            if (this.y  {
        switch (e.key) {
            case 'ArrowLeft':
                if (player.x > 0 && world[Math.floor(player.y)][Math.floor(player.x - 0.5)] === 0) player.x -= 0.2;
                break;
            case 'ArrowRight':
                if (player.x < WORLD_WIDTH - 1 && world[Math.floor(player.y)][Math.floor(player.x + 1.5)] === 0) player.x += 0.2;
                break;
            case 'ArrowUp':
                // Simple jump (no physics, just move up if in air)
                if (player.y > 0 && world[Math.floor(player.y - 1)][Math.floor(player.x)] === 0) player.y -= 0.5;
                break;
            case 'ArrowDown':
                if (player.y < WORLD_HEIGHT - 1 && world[Math.floor(player.y + 1)][Math.floor(player.x)] === 0) player.y += 0.2;
                break;
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the world
        for (let y = 0; y < WORLD_HEIGHT; y++) {
            for (let x = 0; x < WORLD_WIDTH; x++) {
                if (world[y][x] === 1) {
                    ctx.fillStyle = '#8b4513'; // Brown for ground
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }

        // Draw entities
        entities.forEach(ent => {
            ent.update();
            ctx.fillStyle = ent.color;
            ctx.fillRect(ent.x * TILE_SIZE, ent.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            // Draw name above
            ctx.fillStyle = 'black';
            ctx.font = '10px Arial';
            ctx.fillText(ent.name, ent.x * TILE_SIZE, ent.y * TILE_SIZE - 5);
        });

        requestAnimationFrame(draw); // Game loop
    }

    draw(); // Start the game loop
};
