import { memo, type ReactElement } from "react";

import { useGameStore } from "../store/useGameStore";

function Sidebar(): ReactElement {
  const playerName = useGameStore((s) => s.playerName);
  const score = useGameStore((s) => s.score);
  const restartGame = useGameStore((s) => s.resetGame);
  const quitGame = useGameStore((s) => s.setStarted);

  console.log("Sidebar rendered");

  return (
    <div className="w-72 bg-slate-800 p-6 flex-col justify-between shadow-lg hidden md:flex">
      <div>
        <h2 className="text-3xl font-bold text-lime-400 mb-6 drop-shadow">
          🐍 Sneaky
        </h2>
        <p className="mb-2">
          Player: <span className="font-semibold">{playerName}</span>
        </p>
        <p className="mb-6">
          Score: <span className="font-bold text-lime-400">{score}</span>
        </p>

        <div className="space-y-3">
          <button
            onClick={restartGame}
            className="w-full rounded bg-lime-500 px-4 py-2 text-black font-semibold hover:bg-lime-400 transition"
          >
            Restart
          </button>
          <button
            onClick={() => quitGame(false)}
            className="w-full rounded bg-slate-700 px-4 py-2 hover:bg-slate-600 transition text-black"
          >
            Quit
          </button>
        </div>
      </div>
      <footer className="text-xs text-gray-400 text-center">
        🐍 Sneaky v1
      </footer>
    </div>
  );
}

export default memo(Sidebar);
