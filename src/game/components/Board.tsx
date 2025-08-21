import type { ReactElement } from "react";

import { useGameStore } from "../store/useGameStore";

export default function Board(): ReactElement {
  const snake = useGameStore((s) => s.snake);
  const food = useGameStore((s) => s.food);
  const size = useGameStore((s) => s.boardSize);
  const score = useGameStore((s) => s.score);
  const playerName = useGameStore((s) => s.playerName);
  const resetGame = useGameStore((s) => s.resetGame);
  const setStarted = useGameStore((s) => s.setStarted);
  const cells = Array.from({ length: size * size });

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      {/* Mobile score display - visible only on small screens */}
      <div className="mb-4 md:hidden bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-1">{playerName}</p>
          <p className="text-lg font-bold text-lime-400">Score: {score}</p>
        </div>
      </div>

      <div
        className="grid aspect-square w-full max-w-[90vmin] max-h-[90vmin]"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {cells.map((_, i) => {
          const isSnake = snake.includes(i);
          const isSnakeHead = snake[0] === i;
          const isFood = food === i;

          return (
            <div
              key={i}
              className={`
                border border-slate-800
                ${
                  isSnakeHead
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-inner shadow-yellow-600"
                    : isSnake
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-inner shadow-emerald-800"
                      : isFood
                        ? "bg-gradient-to-br from-blue-400 to-blue-500 shadow-inner shadow-blue-600"
                        : "bg-gradient-to-br from-slate-700 to-slate-800"
                }
              `}
            />
          );
        })}
      </div>

      {/* Mobile controls - visible only on small screens */}
      <div className="mt-4 md:hidden flex gap-2 w-full max-w-[90vmin]">
        <button
          onClick={resetGame}
          className="flex-1 rounded bg-lime-500 px-3 py-2 text-sm font-semibold text-black hover:bg-lime-400 transition"
        >
          Restart
        </button>
        <button
          onClick={() => setStarted(false)}
          className="flex-1 rounded bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600 transition text-black"
        >
          Quit
        </button>
      </div>
    </div>
  );
}
