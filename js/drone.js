/**
 * Drone class - Manages drone state, physics, and movement
 */
class Drone {
    constructor(x, y) {
        // Position
        this.x = x;
        this.y = y;
        
        // Velocity
        this.vx = 0;
        this.vy = 0;
        
        // Orientation (in radians)
        this.angle = 0;
        
        // Physics properties
        this.acceleration = 0.3;
        this.deceleration = 0.15;
        this.maxSpeed = 4;
        this.turnSpeed = 0.05;
        
        // Drone dimensions
        this.radius = 15;
        
        // Movement state
        this.isMovingForward = false;
        this.isMovingBackward = false;
        this.isTurningLeft = false;
        this.isTurningRight = false;
        
        // Autonomous mode properties
        this.isAutonomous = false;
        this.targetX = null;
        this.targetY = null;
        this.path = [];
        this.currentWaypointIndex = 0;
        this.waypointReachedThreshold = 10;
    }
    
    /**
     * Update drone position and velocity
     */
    update(obstacles) {
        if (this.isAutonomous) {
            this.updateAutonomous(obstacles);
        } else {
            this.updateManual(obstacles);
        }
        
        // Apply velocity to position
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply deceleration
        this.vx *= (1 - this.deceleration);
        this.vy *= (1 - this.deceleration);
        
        // Stop if moving very slowly
        if (Math.abs(this.vx) < 0.01) this.vx = 0;
        if (Math.abs(this.vy) < 0.01) this.vy = 0;
    }
    
    /**
     * Update drone in manual mode
     */
    updateManual(obstacles) {
        // Turning
        if (this.isTurningLeft) {
            this.angle -= this.turnSpeed;
        }
        if (this.isTurningRight) {
            this.angle += this.turnSpeed;
        }
        
        // Forward/backward movement
        let targetVx = 0;
        let targetVy = 0;
        
        if (this.isMovingForward) {
            targetVx = Math.cos(this.angle) * this.maxSpeed;
            targetVy = Math.sin(this.angle) * this.maxSpeed;
        }
        if (this.isMovingBackward) {
            targetVx = -Math.cos(this.angle) * this.maxSpeed * 0.5;
            targetVy = -Math.sin(this.angle) * this.maxSpeed * 0.5;
        }
        
        // Smooth acceleration
        this.vx += (targetVx - this.vx) * this.acceleration;
        this.vy += (targetVy - this.vy) * this.acceleration;
        
        // Check for collisions before moving
        if (this.wouldCollide(this.x + this.vx, this.y + this.vy, obstacles)) {
            this.vx *= 0.5;
            this.vy *= 0.5;
        }
    }
    
    /**
     * Update drone in autonomous mode
     */
    updateAutonomous(obstacles) {
        if (!this.path || this.path.length === 0) {
            return;
        }
        
        // Get current waypoint
        if (this.currentWaypointIndex >= this.path.length) {
            // Reached the end
            this.vx = 0;
            this.vy = 0;
            return;
        }
        
        const waypoint = this.path[this.currentWaypointIndex];
        const dx = waypoint.x - this.x;
        const dy = waypoint.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if reached waypoint
        if (distance < this.waypointReachedThreshold) {
            this.currentWaypointIndex++;
            return;
        }
        
        // Calculate desired angle to waypoint
        const targetAngle = Math.atan2(dy, dx);
        
        // Smooth angle transition
        let angleDiff = targetAngle - this.angle;
        
        // Normalize angle difference to [-PI, PI]
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        // Turn towards target
        if (Math.abs(angleDiff) > 0.05) {
            this.angle += Math.sign(angleDiff) * this.turnSpeed;
        } else {
            this.angle = targetAngle;
        }
        
        // Move towards waypoint
        const speed = Math.min(this.maxSpeed, distance / 20);
        this.vx = Math.cos(this.angle) * speed;
        this.vy = Math.sin(this.angle) * speed;
        
        // Collision avoidance in autonomous mode
        if (this.wouldCollide(this.x + this.vx, this.y + this.vy, obstacles)) {
            this.vx *= 0.3;
            this.vy *= 0.3;
        }
    }
    
    /**
     * Check if drone would collide with obstacles
     */
    wouldCollide(newX, newY, obstacles) {
        for (let obstacle of obstacles) {
            const dx = newX - obstacle.x;
            const dy = newY - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.radius + obstacle.radius) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Set manual movement controls
     */
    setMovement(forward, backward, left, right) {
        this.isMovingForward = forward;
        this.isMovingBackward = backward;
        this.isTurningLeft = left;
        this.isTurningRight = right;
    }
    
    /**
     * Switch to autonomous mode
     */
    enableAutonomousMode(path) {
        this.isAutonomous = true;
        this.path = path;
        this.currentWaypointIndex = 0;
        // Gradually stop current movement
        this.vx *= 0.5;
        this.vy *= 0.5;
    }
    
    /**
     * Switch to manual mode
     */
    enableManualMode() {
        this.isAutonomous = false;
        this.path = [];
        this.currentWaypointIndex = 0;
        // Gradually stop current movement
        this.vx *= 0.5;
        this.vy *= 0.5;
        this.setMovement(false, false, false, false);
    }
    
    /**
     * Get current speed
     */
    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }
    
    /**
     * Get orientation in degrees
     */
    getOrientationDegrees() {
        return ((this.angle * 180 / Math.PI) % 360).toFixed(1);
    }
    
    /**
     * Get autonomous mode progress
     */
    getProgress() {
        if (!this.path || this.path.length === 0) return 0;
        return Math.round((this.currentWaypointIndex / this.path.length) * 100);
    }
}
