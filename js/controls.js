/**
 * Controls - Manages keyboard input and mode switching
 */
class Controls {
    constructor(drone, onModeChange) {
        this.drone = drone;
        this.onModeChange = onModeChange;
        this.keys = {};
        
        this.setupEventListeners();
    }
    
    /**
     * Setup keyboard event listeners
     */
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Enter key - switch to manual mode
            if (e.key === 'Enter') {
                if (this.drone.isAutonomous) {
                    this.drone.enableManualMode();
                    this.onModeChange('manual');
                }
            }
            
            // Q key - switch to autonomous mode
            if (e.key.toLowerCase() === 'q') {
                if (!this.drone.isAutonomous) {
                    this.onModeChange('autonomous');
                }
            }
            
            // Prevent default behavior for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    /**
     * Update drone based on current key states (for manual mode)
     */
    update() {
        if (this.drone.isAutonomous) {
            return;
        }
        
        // Forward movement (W or ArrowUp)
        const forward = this.keys['w'] || this.keys['arrowup'];
        
        // Backward movement (S or ArrowDown)
        const backward = this.keys['s'] || this.keys['arrowdown'];
        
        // Turn left (A or ArrowLeft)
        const left = this.keys['a'] || this.keys['arrowleft'];
        
        // Turn right (D or ArrowRight)
        const right = this.keys['d'] || this.keys['arrowright'];
        
        this.drone.setMovement(forward, backward, left, right);
    }
}
