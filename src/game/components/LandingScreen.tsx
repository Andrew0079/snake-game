import type { ReactElement } from "react";

import { useGameStore } from "../store/useGameStore";

export default function LandingScreen(): ReactElement {
  const playerName = useGameStore((s) => s.playerName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setStarted = useGameStore((s) => s.setStarted);
  const boardSize = useGameStore((s) => s.boardSize);
  const setBoardSize = useGameStore((s) => s.setBoardSize);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="text-center space-y-6 w-full max-w-sm">
        <h1 className="text-6xl font-extrabold tracking-wide text-lime-400 drop-shadow-lg">
          Sneaky
        </h1>

        <input
          type="text"
          placeholder="Enter your name..."
          className="w-full rounded-md border border-gray-300 bg-white/90 px-4 py-2 text-lg text-black shadow-sm focus:border-lime-500 focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Board Size: {boardSize}×{boardSize}
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">10</span>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              value={boardSize}
              onChange={(e) => setBoardSize(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-400">30</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Small</span>
            <span>Medium</span>
            <span>Large</span>
          </div>
        </div>

        <button
          onClick={() => setStarted(true)}
          disabled={!playerName.trim()}
          className="w-full rounded-md bg-lime-500 px-6 py-2 text-lg font-bold text-black hover:bg-lime-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Play
        </button>

        <p className="text-sm text-gray-400">Avoid collisions!</p>
      </div>
    </div>
  );
}
