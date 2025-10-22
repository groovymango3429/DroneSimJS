/**
 * Obstacle management
 */
class Obstacle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

/**
 * Create an obstacle course for the drone
 */
function createObstacleCourse(width, height) {
    const obstacles = [];
    
    // Border walls (represented as circular obstacles along the edges)
    const wallSpacing = 40;
    const wallRadius = 20;
    
    // Top wall
    for (let x = 0; x < width; x += wallSpacing) {
        obstacles.push(new Obstacle(x, 0, wallRadius));
    }
    
    // Bottom wall
    for (let x = 0; x < width; x += wallSpacing) {
        obstacles.push(new Obstacle(x, height, wallRadius));
    }
    
    // Left wall
    for (let y = 0; y < height; y += wallSpacing) {
        obstacles.push(new Obstacle(0, y, wallRadius));
    }
    
    // Right wall
    for (let y = 0; y < height; y += wallSpacing) {
        obstacles.push(new Obstacle(width, y, wallRadius));
    }
    
    // Interior obstacles - create an interesting course
    obstacles.push(new Obstacle(200, 150, 30));
    obstacles.push(new Obstacle(200, 250, 30));
    obstacles.push(new Obstacle(200, 350, 30));
    obstacles.push(new Obstacle(200, 450, 30));
    
    obstacles.push(new Obstacle(400, 100, 40));
    obstacles.push(new Obstacle(400, 300, 40));
    obstacles.push(new Obstacle(400, 500, 40));
    
    obstacles.push(new Obstacle(600, 150, 30));
    obstacles.push(new Obstacle(600, 250, 30));
    obstacles.push(new Obstacle(600, 350, 30));
    obstacles.push(new Obstacle(600, 450, 30));
    
    // Some scattered obstacles
    obstacles.push(new Obstacle(300, 200, 25));
    obstacles.push(new Obstacle(500, 400, 25));
    obstacles.push(new Obstacle(350, 450, 25));
    obstacles.push(new Obstacle(550, 150, 25));
    
    return obstacles;
}

/**
 * Goal position
 */
class Goal {
    constructor(x, y, radius = 25) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}
