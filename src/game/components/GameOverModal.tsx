import type { ReactElement } from "react";

import { useGameStore } from "../store/useGameStore";

export default function GameOverModal(): ReactElement | null {
  const gameOver = useGameStore((s) => s.gameOver);
  const score = useGameStore((s) => s.score);
  const gamesPlayed = useGameStore((s) => s.gamesPlayed);
  const resetGame = useGameStore((s) => s.resetGame);
  const quitGame = useGameStore((s) => s.quitGame);

  if (!["LOSE", "WIN"].includes(gameOver)) {
    return null;
  }

  console.log(gameOver);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
      <div className="bg-slate-800 rounded-lg p-8 text-center space-y-4 shadow-lg">
        <h2
          className={`text-3xl font-bold drop-shadow ${
            gameOver === "WIN" ? "text-lime-400" : "text-red-500"
          }`}
        >
          {gameOver === "WIN" ? "🎉 You Win!" : "💀 Game Over"}
        </h2>
        <p className="text-lg">Final Score: {score}</p>
        <p className="text-sm text-gray-400">Games played: {gamesPlayed + 1}</p>
        <div className="space-x-4">
          <button
            onClick={resetGame}
            className="rounded bg-lime-500 px-4 py-2 font-semibold text-black hover:bg-lime-400"
          >
            New Game
          </button>
          <button
            onClick={quitGame}
            className="rounded bg-slate-600 px-4 py-2 hover:bg-slate-500 text-black"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}
