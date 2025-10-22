/**
 * A* Pathfinding Algorithm Implementation
 * Finds the optimal path from start to goal while avoiding obstacles
 */

class PathfindingGrid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.floor(width / cellSize);
        this.rows = Math.floor(height / cellSize);
        this.grid = [];
        
        // Initialize grid
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = {
                    row: i,
                    col: j,
                    x: j * cellSize + cellSize / 2,
                    y: i * cellSize + cellSize / 2,
                    walkable: true,
                    g: 0,
                    h: 0,
                    f: 0,
                    parent: null
                };
            }
        }
    }
    
    /**
     * Mark obstacles on the grid
     */
    markObstacles(obstacles) {
        for (let obstacle of obstacles) {
            const col = Math.floor(obstacle.x / this.cellSize);
            const row = Math.floor(obstacle.y / this.cellSize);
            
            // Mark cells around the obstacle
            const radius = Math.ceil(obstacle.radius / this.cellSize) + 1;
            
            for (let r = row - radius; r <= row + radius; r++) {
                for (let c = col - radius; c <= col + radius; c++) {
                    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                        const dx = c * this.cellSize + this.cellSize / 2 - obstacle.x;
                        const dy = r * this.cellSize + this.cellSize / 2 - obstacle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < obstacle.radius + this.cellSize / 2) {
                            this.grid[r][c].walkable = false;
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Get neighbors of a cell
     */
    getNeighbors(node) {
        const neighbors = [];
        const directions = [
            { row: -1, col: 0 },  // up
            { row: 1, col: 0 },   // down
            { row: 0, col: -1 },  // left
            { row: 0, col: 1 },   // right
            { row: -1, col: -1 }, // up-left
            { row: -1, col: 1 },  // up-right
            { row: 1, col: -1 },  // down-left
            { row: 1, col: 1 }    // down-right
        ];
        
        for (let dir of directions) {
            const newRow = node.row + dir.row;
            const newCol = node.col + dir.col;
            
            if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                const neighbor = this.grid[newRow][newCol];
                if (neighbor.walkable) {
                    neighbors.push(neighbor);
                }
            }
        }
        
        return neighbors;
    }
    
    /**
     * Calculate heuristic (Manhattan distance)
     */
    heuristic(nodeA, nodeB) {
        const dx = Math.abs(nodeA.col - nodeB.col);
        const dy = Math.abs(nodeA.row - nodeB.row);
        return dx + dy;
    }
    
    /**
     * Reset grid for new pathfinding
     */
    reset() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j].g = 0;
                this.grid[i][j].h = 0;
                this.grid[i][j].f = 0;
                this.grid[i][j].parent = null;
            }
        }
    }
}

/**
 * A* Pathfinding Algorithm
 */
function findPath(startX, startY, goalX, goalY, obstacles, width, height) {
    const cellSize = 20;
    const grid = new PathfindingGrid(width, height, cellSize);
    
    // Mark obstacles
    grid.markObstacles(obstacles);
    
    // Get start and end nodes
    const startCol = Math.floor(startX / cellSize);
    const startRow = Math.floor(startY / cellSize);
    const goalCol = Math.floor(goalX / cellSize);
    const goalRow = Math.floor(goalY / cellSize);
    
    // Validate start and goal
    if (startRow < 0 || startRow >= grid.rows || startCol < 0 || startCol >= grid.cols) {
        return [];
    }
    if (goalRow < 0 || goalRow >= grid.rows || goalCol < 0 || goalCol >= grid.cols) {
        return [];
    }
    
    const startNode = grid.grid[startRow][startCol];
    const goalNode = grid.grid[goalRow][goalCol];
    
    if (!startNode.walkable || !goalNode.walkable) {
        return [];
    }
    
    // A* algorithm
    const openSet = [startNode];
    const closedSet = new Set();
    
    startNode.g = 0;
    startNode.h = grid.heuristic(startNode, goalNode);
    startNode.f = startNode.h;
    
    while (openSet.length > 0) {
        // Find node with lowest f score
        let currentIndex = 0;
        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].f < openSet[currentIndex].f) {
                currentIndex = i;
            }
        }
        
        const current = openSet[currentIndex];
        
        // Check if reached goal
        if (current === goalNode) {
            // Reconstruct path
            const path = [];
            let temp = current;
            while (temp) {
                path.push({ x: temp.x, y: temp.y });
                temp = temp.parent;
            }
            return path.reverse();
        }
        
        // Move current from open to closed
        openSet.splice(currentIndex, 1);
        closedSet.add(current);
        
        // Check neighbors
        const neighbors = grid.getNeighbors(current);
        for (let neighbor of neighbors) {
            if (closedSet.has(neighbor)) {
                continue;
            }
            
            // Calculate tentative g score
            const dx = neighbor.col - current.col;
            const dy = neighbor.row - current.row;
            const moveCost = (dx !== 0 && dy !== 0) ? 1.414 : 1; // Diagonal vs straight
            const tentativeG = current.g + moveCost;
            
            let isNewNode = !openSet.includes(neighbor);
            
            if (isNewNode || tentativeG < neighbor.g) {
                neighbor.g = tentativeG;
                neighbor.h = grid.heuristic(neighbor, goalNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
                
                if (isNewNode) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    
    // No path found
    return [];
}

/**
 * Smooth path by removing unnecessary waypoints
 */
function smoothPath(path, obstacles) {
    if (path.length <= 2) return path;
    
    const smoothed = [path[0]];
    let currentIndex = 0;
    
    while (currentIndex < path.length - 1) {
        let farthestVisible = currentIndex + 1;
        
        // Find farthest visible point
        for (let i = currentIndex + 2; i < path.length; i++) {
            if (isLineOfSightClear(path[currentIndex], path[i], obstacles)) {
                farthestVisible = i;
            } else {
                break;
            }
        }
        
        smoothed.push(path[farthestVisible]);
        currentIndex = farthestVisible;
    }
    
    return smoothed;
}

/**
 * Check if line of sight is clear between two points
 */
function isLineOfSightClear(pointA, pointB, obstacles) {
    const steps = 20;
    const dx = (pointB.x - pointA.x) / steps;
    const dy = (pointB.y - pointA.y) / steps;
    
    for (let i = 0; i <= steps; i++) {
        const x = pointA.x + dx * i;
        const y = pointA.y + dy * i;
        
        for (let obstacle of obstacles) {
            const dist = Math.sqrt(
                Math.pow(x - obstacle.x, 2) + Math.pow(y - obstacle.y, 2)
            );
            if (dist < obstacle.radius + 10) {
                return false;
            }
        }
    }
    
    return true;
}
