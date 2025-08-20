import { create } from "zustand";

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type GameOver = "NONE" | "LOSE" | "WIN";

interface GameState {
  playerName: string;
  started: boolean;
  score: number;
  gamesPlayed: number;
  snake: number[];
  food: number;
  direction: Direction;
  nextDirection: Direction;
  gameOver: GameOver;

  setPlayerName: (name: string) => void;
  setStarted: (started: boolean) => void;
  setScore: (score: number | ((prev: number) => number)) => void;
  setGamesPlayed: (games: number | ((prev: number) => number)) => void;
  setSnake: (snake: number[] | ((prev: number[]) => number[])) => void;
  setFood: (food: number) => void;
  setDirection: (dir: Direction) => void;
  setNextDirection: (dir: Direction) => void;
  setGameOver: (status: GameOver) => void;
  resetGame: () => void;
  quitGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerName: "",
  started: false,
  score: 0,
  gamesPlayed: 0,
  snake: [2, 1, 0],
  food: 50,
  direction: "RIGHT",
  nextDirection: "RIGHT",
  gameOver: "NONE",

  setPlayerName: (playerName) => set({ playerName }),
  setStarted: (started) => set({ started }),
  setScore: (score) =>
    set((state) => ({
      score: typeof score === "function" ? score(state.score) : score,
    })),
  setGamesPlayed: (games) =>
    set((state) => ({
      gamesPlayed:
        typeof games === "function" ? games(state.gamesPlayed) : games,
    })),
  setSnake: (snake) =>
    set((state) => ({
      snake: typeof snake === "function" ? snake(state.snake) : snake,
    })),
  setFood: (food) => set({ food }),
  setDirection: (direction) => set({ direction }),
  setNextDirection: (nextDirection) => set({ nextDirection }),
  setGameOver: (gameOver) => set({ gameOver }),

  resetGame: () =>
    set((state) => ({
      snake: [2, 1, 0],
      direction: "RIGHT",
      nextDirection: "RIGHT",
      score: 0,
      food: Math.floor(Math.random() * 20 * 20),
      gameOver: "NONE",
      gamesPlayed: state.gamesPlayed + 1,
    })),

  quitGame: () =>
    set(() => ({
      started: false,
      playerName: "",
      score: 0,
      gameOver: "NONE",
    })),
}));
