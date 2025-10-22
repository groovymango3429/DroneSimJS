/**
 * Renderer - Handles all canvas drawing operations
 */
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.trailPoints = [];
        this.maxTrailLength = 100;
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw grid
        this.drawGrid();
    }
    
    /**
     * Draw a subtle grid
     */
    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        
        for (let x = 0; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw obstacles
     */
    drawObstacles(obstacles) {
        for (let obstacle of obstacles) {
            this.ctx.fillStyle = '#f44336';
            this.ctx.strokeStyle = '#d32f2f';
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            this.ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw the goal
     */
    drawGoal(goal) {
        // Outer glow
        const gradient = this.ctx.createRadialGradient(
            goal.x, goal.y, 0,
            goal.x, goal.y, goal.radius * 1.5
        );
        gradient.addColorStop(0, 'rgba(33, 150, 243, 0.5)');
        gradient.addColorStop(1, 'rgba(33, 150, 243, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(goal.x, goal.y, goal.radius * 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Main goal
        this.ctx.fillStyle = '#2196F3';
        this.ctx.strokeStyle = '#1976D2';
        this.ctx.lineWidth = 3;
        
        this.ctx.beginPath();
        this.ctx.arc(goal.x, goal.y, goal.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Target symbol
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        
        // Crosshair
        this.ctx.beginPath();
        this.ctx.moveTo(goal.x - goal.radius * 0.5, goal.y);
        this.ctx.lineTo(goal.x + goal.radius * 0.5, goal.y);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(goal.x, goal.y - goal.radius * 0.5);
        this.ctx.lineTo(goal.x, goal.y + goal.radius * 0.5);
        this.ctx.stroke();
    }
    
    /**
     * Draw the drone
     */
    drawDrone(drone) {
        // Add to trail
        this.trailPoints.push({ x: drone.x, y: drone.y });
        if (this.trailPoints.length > this.maxTrailLength) {
            this.trailPoints.shift();
        }
        
        // Draw trail
        if (this.trailPoints.length > 1) {
            this.ctx.strokeStyle = 'rgba(76, 175, 80, 0.3)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
            for (let i = 1; i < this.trailPoints.length; i++) {
                this.ctx.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
            }
            this.ctx.stroke();
        }
        
        // Save context
        this.ctx.save();
        
        // Move to drone position and rotate
        this.ctx.translate(drone.x, drone.y);
        this.ctx.rotate(drone.angle);
        
        // Draw drone body
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.strokeStyle = '#388E3C';
        this.ctx.lineWidth = 2;
        
        // Main body (circle)
        this.ctx.beginPath();
        this.ctx.arc(0, 0, drone.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Direction indicator (arrow)
        this.ctx.fillStyle = '#2E7D32';
        this.ctx.beginPath();
        this.ctx.moveTo(drone.radius * 0.8, 0);
        this.ctx.lineTo(drone.radius * 0.2, drone.radius * 0.4);
        this.ctx.lineTo(drone.radius * 0.2, -drone.radius * 0.4);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Propeller indicators
        const propPositions = [
            { x: -8, y: -8 },
            { x: 8, y: -8 },
            { x: -8, y: 8 },
            { x: 8, y: 8 }
        ];
        
        this.ctx.fillStyle = '#1B5E20';
        for (let prop of propPositions) {
            this.ctx.beginPath();
            this.ctx.arc(prop.x, prop.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Restore context
        this.ctx.restore();
        
        // Draw speed indicator
        if (drone.getSpeed() > 0.5) {
            this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(drone.x, drone.y, drone.radius + 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw autonomous path
     */
    drawPath(path) {
        if (!path || path.length < 2) return;
        
        // Draw path line
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x, path[i].y);
        }
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
        
        // Draw waypoints
        for (let i = 0; i < path.length; i++) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
            this.ctx.strokeStyle = 'rgba(255, 200, 0, 0.9)';
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            this.ctx.arc(path[i].x, path[i].y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw current waypoint highlight
     */
    drawCurrentWaypoint(waypoint) {
        if (!waypoint) return;
        
        this.ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(waypoint.x, waypoint.y, 8, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    /**
     * Clear trail
     */
    clearTrail() {
        this.trailPoints = [];
    }
}
