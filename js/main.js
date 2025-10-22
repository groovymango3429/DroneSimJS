/**
 * Main simulation controller
 */

// Configuration
const CONFIG = {
    canvasWidth: 800,
    canvasHeight: 600,
    targetFPS: 60,
    droneStartX: 100,
    droneStartY: 100,
    goalX: 700,
    goalY: 500
};

// Global state
let drone;
let obstacles;
let goal;
let renderer;
let controls;
let lastFrameTime = 0;

/**
 * Initialize the simulation
 */
function init() {
    // Get canvas
    const canvas = document.getElementById('droneCanvas');
    
    // Create drone
    drone = new Drone(CONFIG.droneStartX, CONFIG.droneStartY);
    
    // Create obstacles
    obstacles = createObstacleCourse(CONFIG.canvasWidth, CONFIG.canvasHeight);
    
    // Create goal
    goal = new Goal(CONFIG.goalX, CONFIG.goalY);
    
    // Create renderer
    renderer = new Renderer(canvas);
    
    // Create controls
    controls = new Controls(drone, handleModeChange);
    
    // Start animation loop
    requestAnimationFrame(gameLoop);
}

/**
 * Main game loop
 */
function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    
    // Update
    update();
    
    // Render
    render();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

/**
 * Update simulation state
 */
function update() {
    // Update controls (for manual mode)
    controls.update();
    
    // Update drone
    drone.update(obstacles);
    
    // Update UI
    updateStatusPanel();
}

/**
 * Render everything
 */
function render() {
    // Clear canvas
    renderer.clear();
    
    // Draw goal
    renderer.drawGoal(goal);
    
    // Draw obstacles
    renderer.drawObstacles(obstacles);
    
    // Draw autonomous path if active
    if (drone.isAutonomous && drone.path && drone.path.length > 0) {
        renderer.drawPath(drone.path);
        
        // Highlight current waypoint
        if (drone.currentWaypointIndex < drone.path.length) {
            renderer.drawCurrentWaypoint(drone.path[drone.currentWaypointIndex]);
        }
    }
    
    // Draw drone
    renderer.drawDrone(drone);
}

/**
 * Update status panel with current drone state
 */
function updateStatusPanel() {
    // Mode
    document.getElementById('modeStatus').textContent = 
        drone.isAutonomous ? 'Autonomous' : 'Manual';
    
    // Position
    document.getElementById('positionStatus').textContent = 
        `X: ${Math.round(drone.x)}, Y: ${Math.round(drone.y)}`;
    
    // Speed
    document.getElementById('speedStatus').textContent = 
        drone.getSpeed().toFixed(2);
    
    // Velocity
    document.getElementById('velocityStatus').textContent = 
        `${drone.vx.toFixed(2)}, ${drone.vy.toFixed(2)}`;
    
    // Orientation
    document.getElementById('orientationStatus').textContent = 
        `${drone.getOrientationDegrees()}°`;
    
    // Autonomous-specific info
    const autonomousInfoElements = document.querySelectorAll('.autonomous-info');
    if (drone.isAutonomous) {
        autonomousInfoElements.forEach(el => el.style.display = 'flex');
        
        // Current waypoint
        if (drone.path && drone.currentWaypointIndex < drone.path.length) {
            const waypoint = drone.path[drone.currentWaypointIndex];
            document.getElementById('waypointStatus').textContent = 
                `${drone.currentWaypointIndex + 1}/${drone.path.length} (${Math.round(waypoint.x)}, ${Math.round(waypoint.y)})`;
        } else {
            document.getElementById('waypointStatus').textContent = 'Goal Reached!';
        }
        
        // Obstacles detected (count obstacles near drone)
        let nearbyObstacles = 0;
        const detectionRadius = 100;
        for (let obstacle of obstacles) {
            const dx = drone.x - obstacle.x;
            const dy = drone.y - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < detectionRadius) {
                nearbyObstacles++;
            }
        }
        document.getElementById('obstaclesStatus').textContent = nearbyObstacles;
        
        // Progress
        document.getElementById('progressStatus').textContent = 
            `${drone.getProgress()}%`;
    } else {
        autonomousInfoElements.forEach(el => el.style.display = 'none');
    }
}

/**
 * Handle mode changes
 */
function handleModeChange(mode) {
    const modeIndicator = document.getElementById('modeIndicator');
    
    if (mode === 'manual') {
        modeIndicator.textContent = 'Manual Mode Active';
        modeIndicator.classList.remove('autonomous');
        renderer.clearTrail();
    } else if (mode === 'autonomous') {
        modeIndicator.textContent = 'Autonomous Mode Active';
        modeIndicator.classList.add('autonomous');
        
        // Calculate path from current position to goal
        const path = findPath(
            drone.x, 
            drone.y, 
            goal.x, 
            goal.y, 
            obstacles,
            CONFIG.canvasWidth,
            CONFIG.canvasHeight
        );
        
        if (path.length > 0) {
            // Smooth the path
            const smoothedPath = smoothPath(path, obstacles);
            drone.enableAutonomousMode(smoothedPath);
            renderer.clearTrail();
        } else {
            // No path found
            alert('No path to goal found! Try moving to a different position.');
            drone.enableManualMode();
            modeIndicator.textContent = 'Manual Mode Active';
            modeIndicator.classList.remove('autonomous');
        }
    }
}

// Start simulation when page loads
window.addEventListener('load', init);
