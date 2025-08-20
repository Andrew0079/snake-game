import type { ReactElement } from "react";

import { useGameStore } from "../store/useGameStore";

export default function Board(): ReactElement {
  const snake = useGameStore((s) => s.snake);
  const food = useGameStore((s) => s.food);
  const size = 20;
  const cells = Array.from({ length: size * size });

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div
        className="grid aspect-square w-full h-full max-w-[90vmin] max-h-[90vmin]"
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
    </div>
  );
}
