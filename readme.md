# 🚁 Drone Simulation (DroneSimJS)

A browser-based drone simulation using JavaScript that allows users to switch between manual and autonomous control modes. Features realistic movement, obstacle avoidance with A* pathfinding, and clear visual representation.

## 🎮 Live Demo

Visit the live simulation: [https://groovymango3429.github.io/DroneSimJS/](https://groovymango3429.github.io/DroneSimJS/)

## ✨ Features

### Control Modes

#### 1. Manual Mode
- **Activation**: Press `Enter` key
- **Controls**:
  - `W` / `↑`: Move forward
  - `A` / `←`: Turn left
  - `S` / `↓`: Move backward
  - `D` / `→`: Turn right
- **Features**:
  - Smooth acceleration and deceleration
  - Real-time collision detection
  - Responsive keyboard controls
  - Visual speed indicators

#### 2. Autonomous Mode
- **Activation**: Press `Q` key
- **Features**:
  - Automatic navigation through obstacle course
  - A* pathfinding algorithm for optimal path
  - Real-time path smoothing
  - Obstacle avoidance
  - Natural orientation adjustments
- **Visual Feedback**:
  - Display current waypoint
  - Show path trajectory
  - Real-time progress tracking
  - Obstacle detection count

### Visualization

#### Graphics
- **2D Canvas Rendering**: Top-down view using HTML Canvas
- **Smooth Animation**: Targets 60 FPS
- **Visual Elements**:
  - Drone with directional indicator
  - Obstacles (walls and interior objects)
  - Goal marker with crosshair
  - Path trajectory in autonomous mode
  - Motion trail showing drone history

#### Status Panel
- Current mode (Manual/Autonomous)
- Real-time position (X, Y coordinates)
- Current speed
- Velocity vector
- Orientation in degrees
- Autonomous mode specifics:
  - Current waypoint
  - Detected obstacles nearby
  - Progress percentage

### User Interaction
- Seamless mode switching at any time
- Smooth transitions between modes
- Position and orientation maintained during switches
- Emergency stop capabilities

## 🏗️ Code Structure

The project follows a modular architecture for easy maintenance and expansion:

```
DroneSimJS/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── js/
│   ├── main.js         # Main simulation controller and game loop
│   ├── drone.js        # Drone class (physics, movement, state)
│   ├── controls.js     # Keyboard input handling
│   ├── obstacles.js    # Obstacle management and course creation
│   ├── pathfinding.js  # A* pathfinding algorithm implementation
│   └── renderer.js     # Canvas rendering engine
└── readme.md           # Documentation
```

### Module Descriptions

- **main.js**: Initializes simulation, manages game loop, coordinates all modules
- **drone.js**: Core drone logic including physics, manual controls, autonomous navigation
- **controls.js**: Handles keyboard events and mode switching
- **obstacles.js**: Creates and manages obstacle course
- **pathfinding.js**: Implements A* algorithm with grid-based pathfinding
- **renderer.js**: All canvas drawing operations for visualization

## 🚀 Getting Started

### Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/groovymango3429/DroneSimJS.git
   cd DroneSimJS
   ```

2. **Open in browser**:
   Simply open `index.html` in any modern web browser:
   ```bash
   # Using Python's built-in server (recommended)
   python -m http.server 8000
   # Then open http://localhost:8000
   
   # OR using Node.js http-server
   npx http-server
   
   # OR just open the file directly
   open index.html  # macOS
   start index.html # Windows
   xdg-open index.html # Linux
   ```

3. **Start exploring**:
   - Press `Enter` to activate Manual Mode
   - Use WASD or Arrow keys to control the drone
   - Press `Q` to switch to Autonomous Mode and watch the drone navigate!

### GitHub Pages Deployment

This project is configured to work with GitHub Pages out of the box:

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select the branch (e.g., `main`) as the source
4. Save, and your simulation will be live!

## 🎯 How It Works

### Manual Mode
The drone responds immediately to keyboard inputs with smooth acceleration/deceleration curves. Collision detection prevents the drone from hitting obstacles by reducing velocity when obstacles are detected in the path.

### Autonomous Mode
When activated:
1. **Path Calculation**: A* algorithm calculates optimal path from current position to goal
2. **Path Smoothing**: Unnecessary waypoints are removed using line-of-sight checks
3. **Navigation**: Drone follows waypoints sequentially
4. **Obstacle Avoidance**: Real-time collision detection adjusts velocity near obstacles
5. **Orientation**: Smooth angle transitions as drone turns toward waypoints

### A* Pathfinding Algorithm
- Creates a grid overlay on the canvas
- Marks cells occupied by obstacles as unwalkable
- Uses Manhattan distance heuristic for efficiency
- Supports diagonal movement with appropriate cost calculation
- Guarantees shortest path when path exists

## 🎨 Customization

### Adjusting Drone Physics
Edit values in `js/drone.js`:
```javascript
this.acceleration = 0.3;      // How quickly drone speeds up
this.deceleration = 0.15;     // How quickly drone slows down
this.maxSpeed = 4;            // Maximum movement speed
this.turnSpeed = 0.05;        // How quickly drone turns
```

### Modifying Obstacle Course
Edit `createObstacleCourse()` in `js/obstacles.js` to create custom layouts.

### Changing Goal Position
Modify values in `js/main.js`:
```javascript
goalX: 700,
goalY: 500
```

### Adjusting Pathfinding
Modify cell size in `js/pathfinding.js`:
```javascript
const cellSize = 20;  // Smaller = more precise, but slower
```

## 📋 Requirements

- Modern web browser with HTML5 Canvas support
- JavaScript enabled
- No external dependencies or frameworks required

## 🔧 Technical Details

- **Language**: Pure JavaScript (ES6+)
- **Graphics**: HTML5 Canvas API
- **Architecture**: Modular OOP design
- **Performance**: Optimized for 60 FPS
- **Algorithm**: A* pathfinding with diagonal movement
- **Physics**: Custom implementation with smooth interpolation

## 🌟 Future Enhancements

Potential features for expansion:
- [ ] 3D visualization using Three.js or WebGL
- [ ] Multiple drones with swarm behavior
- [ ] Different pathfinding algorithms (Dijkstra, Potential Fields)
- [ ] Adjustable speed and sensitivity controls
- [ ] Save/load custom obstacle courses
- [ ] Simulated sensors (proximity, GPS, altimeter)
- [ ] Advanced minimap with trajectory history
- [ ] Mobile touch controls
- [ ] Multiplayer mode

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

Created for the DroneSimJS project.

---

**Enjoy flying your virtual drone! 🚁✨**
