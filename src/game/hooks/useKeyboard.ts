import { useEffect } from "react";

import { useGameStore, type Direction } from "../store/useGameStore";

/**
 * Maps keyboard arrow keys to game directions
 */
const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
} as const;

/**
 * Maps each direction to its opposite direction
 * Used to prevent the snake from reversing into itself
 */
const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
} as const;

/**
 * Keyboard input hook that handles arrow key presses and updates snake direction
 *
 * Features:
 * - Maps arrow keys to game directions
 * - Prevents immediate reverse movement (snake can't turn 180°)
 * - Buffers direction changes for smooth gameplay
 */
export function useKeyboard(): void {
  const direction = useGameStore((s) => s.direction);
  const setNextDirection = useGameStore((s) => s.setNextDirection);

  useEffect(() => {
    /**
     * Handles keyboard input and updates the snake's direction
     * @param e - Keyboard event from arrow key presses
     */
    const handleKey = (e: KeyboardEvent) => {
      // Map the pressed key to a game direction
      const newDir = KEY_TO_DIRECTION[e.key];

      // Ignore non-arrow keys
      if (!newDir) {
        return;
      }

      // Prevent snake from reversing into itself (180° turn)
      // This would cause immediate game over
      if (newDir === OPPOSITE_DIRECTIONS[direction]) {
        return;
      }

      // Buffer the direction change for the next game tick
      setNextDirection(newDir);
    };

    // Add global keyboard listener
    window.addEventListener("keydown", handleKey);

    // Cleanup: remove listener when component unmounts
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction, setNextDirection]);
}
