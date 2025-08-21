import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";

import { useGameStore } from "../useGameStore";

describe("useGameStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.quitGame();
      result.current.setGamesPlayed(0);
    });
  });

  describe("Initial State", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useGameStore());

      expect(result.current.playerName).toBe("");
      expect(result.current.started).toBe(false);
      expect(result.current.score).toBe(0);
      expect(result.current.gamesPlayed).toBe(0);
      expect(result.current.snake).toEqual([2, 1, 0]);
      expect(result.current.food).toBe(50);
      expect(result.current.direction).toBe("RIGHT");
      expect(result.current.nextDirection).toBe("RIGHT");
      expect(result.current.gameOver).toBe("NONE");
      expect(result.current.boardSize).toBe(20);
    });
  });

  describe("Player Management", () => {
    it("should set player name", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setPlayerName("TestPlayer");
      });

      expect(result.current.playerName).toBe("TestPlayer");
    });

    it("should start and quit game", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setStarted(true);
      });
      expect(result.current.started).toBe(true);

      act(() => {
        result.current.quitGame();
      });
      expect(result.current.started).toBe(false);
      expect(result.current.playerName).toBe("");
      expect(result.current.score).toBe(0);
    });
  });

  describe("Game State Management", () => {
    it("should update score", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setScore(10);
      });
      expect(result.current.score).toBe(10);

      act(() => {
        result.current.setScore((prev) => prev + 5);
      });
      expect(result.current.score).toBe(15);
    });

    it("should update snake position", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setSnake([5, 4, 3]);
      });
      expect(result.current.snake).toEqual([5, 4, 3]);

      act(() => {
        result.current.setSnake((prev) => [6, ...prev]);
      });
      expect(result.current.snake).toEqual([6, 5, 4, 3]);
    });

    it("should update food position", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setFood(25);
      });
      expect(result.current.food).toBe(25);
    });

    it("should update direction", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setDirection("UP");
      });
      expect(result.current.direction).toBe("UP");
    });

    it("should update next direction", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setNextDirection("DOWN");
      });
      expect(result.current.nextDirection).toBe("DOWN");
    });

    it("should set game over state", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setGameOver("WIN");
      });
      expect(result.current.gameOver).toBe("WIN");

      act(() => {
        result.current.setGameOver("LOSE");
      });
      expect(result.current.gameOver).toBe("LOSE");
    });
  });

  describe("Game Reset", () => {
    it("should reset game to initial state", () => {
      const { result } = renderHook(() => useGameStore());

      // Modify some state
      act(() => {
        result.current.setScore(25);
        result.current.setSnake([10, 9, 8]);
        result.current.setDirection("UP");
        result.current.setGameOver("WIN");
      });

      // Reset game
      act(() => {
        result.current.resetGame();
      });

      // Check reset values
      expect(result.current.snake).toEqual([2, 1, 0]);
      expect(result.current.direction).toBe("RIGHT");
      expect(result.current.nextDirection).toBe("RIGHT");
      expect(result.current.score).toBe(0);
      expect(result.current.gameOver).toBe("NONE");
      expect(result.current.gamesPlayed).toBe(1); // Should increment
    });

    it("should increment games played on reset", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.resetGame();
      });
      expect(result.current.gamesPlayed).toBe(1);

      act(() => {
        result.current.resetGame();
      });
      expect(result.current.gamesPlayed).toBe(2);
    });
  });

  describe("Games Played Counter", () => {
    it("should update games played", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setGamesPlayed(5);
      });
      expect(result.current.gamesPlayed).toBe(5);

      act(() => {
        result.current.setGamesPlayed((prev) => prev + 2);
      });
      expect(result.current.gamesPlayed).toBe(7);
    });
  });

  describe("Board Size Management", () => {
    it("should set board size", () => {
      const { result } = renderHook(() => useGameStore());

      act(() => {
        result.current.setBoardSize(15);
      });
      expect(result.current.boardSize).toBe(15);
    });

    it("should maintain board size on game reset", () => {
      const { result } = renderHook(() => useGameStore());

      // Change board size
      act(() => {
        result.current.setBoardSize(25);
      });
      expect(result.current.boardSize).toBe(25);

      // Reset game
      act(() => {
        result.current.resetGame();
      });

      // Board size should remain unchanged
      expect(result.current.boardSize).toBe(25);
    });

    it("should reset board size on quit game", () => {
      const { result } = renderHook(() => useGameStore());

      // Change board size
      act(() => {
        result.current.setBoardSize(30);
      });
      expect(result.current.boardSize).toBe(30);

      // Quit game
      act(() => {
        result.current.quitGame();
      });

      // Board size should reset to default
      expect(result.current.boardSize).toBe(20);
    });

    it("should generate food within board boundaries", () => {
      const { result } = renderHook(() => useGameStore());

      // Set a small board size
      act(() => {
        result.current.setBoardSize(10);
      });

      // Reset game to generate new food
      act(() => {
        result.current.resetGame();
      });

      // Food should be within 0 to 99 (10x10 - 1)
      expect(result.current.food).toBeGreaterThanOrEqual(0);
      expect(result.current.food).toBeLessThan(100);
    });
  });
});
