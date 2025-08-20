import { useEffect } from "react";

import { useGameStore } from "../store/useGameStore";

/**
 * Game loop hook that handles snake movement, collision detection, and food spawning
 *
 * @param size - The size of the game board (e.g., 20 for a 20x20 grid)
 * @param speed - The interval in milliseconds between game ticks (lower = faster)
 */
export function useGameLoop(size = 20, speed = 150): void {
  const started = useGameStore((s) => s.started);

  useEffect(() => {
    // Don't run game loop if game hasn't started
    if (!started) {
      return;
    }

    /**
     * Spawns food at a random position that doesn't overlap with the snake
     * @param snakeArr - Current snake positions to avoid
     * @returns Random food position (0 to size*size-1)
     */
    const spawnFood = (snakeArr: number[]) => {
      let newFood: number;
      do {
        newFood = Math.floor(Math.random() * size * size);
      } while (snakeArr.includes(newFood));
      return newFood;
    };

    const interval = setInterval(() => {
      const state = useGameStore.getState();

      // Promote buffered direction to active direction
      // This allows for smooth direction changes without missing inputs
      if (state.nextDirection !== state.direction) {
        useGameStore.getState().setDirection(state.nextDirection);
      }

      useGameStore.getState().setSnake((prevSnake) => {
        const currentState = useGameStore.getState();
        const head = prevSnake[0]; // First element is the snake's head
        let newHead = head;

        // Calculate new head position based on current direction
        // Grid positions: 0 to size*size-1, where each row has 'size' cells
        if (currentState.direction === "UP") newHead -= size; // Move up one row
        if (currentState.direction === "DOWN") newHead += size; // Move down one row
        if (currentState.direction === "LEFT") newHead -= 1; // Move left one cell
        if (currentState.direction === "RIGHT") newHead += 1; // Move right one cell

        // Wall collision detection
        // Check if snake hits the grid boundaries or wraps around incorrectly
        const hitWall =
          newHead < 0 || // Top edge
          newHead >= size * size || // Bottom edge
          (currentState.direction === "LEFT" && head % size === 0) || // Left edge
          (currentState.direction === "RIGHT" && head % size === size - 1); // Right edge

        // Self collision detection
        // Check if snake's head hits any part of its body
        const hitSelf = prevSnake.includes(newHead);

        // Game over conditions
        if (hitWall || hitSelf) {
          useGameStore.getState().setGameOver("LOSE");
          return prevSnake; // Keep snake in current position
        }

        // Create new snake with new head position
        const newSnake = [newHead, ...prevSnake];

        // Food collision detection and scoring
        if (newHead === currentState.food) {
          // Snake ate food: increase score and spawn new food
          useGameStore.getState().setScore((s) => {
            const next = s + 3;
            if (next >= 30) {
              useGameStore.getState().setGameOver("WIN"); // Win condition
            }
            return next;
          });
          useGameStore.getState().setFood(spawnFood(newSnake));
          // Note: Don't pop tail - snake grows by 1 segment
        } else {
          newSnake.pop(); // Remove tail if no food eaten (snake doesn't grow)
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [started, size, speed]);
}
