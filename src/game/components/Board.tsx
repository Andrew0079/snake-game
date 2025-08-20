// src/game/components/Board.tsx
import type { ReactElement } from "react";

interface BoardProps {
  size?: number;
  snake?: number[];
  food?: number;
}

export default function Board({
  size = 20,
  snake = [],
  food,
}: BoardProps): ReactElement {
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
          const isFood = food === i;

          return (
            <div
              key={i}
              className={`
                border border-slate-800
                ${
                  isSnake
                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-inner shadow-emerald-800"
                    : isFood
                      ? "bg-gradient-to-br from-red-500 to-red-600 shadow-inner shadow-red-800"
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
