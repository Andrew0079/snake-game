import type { ReactElement } from "react";

interface LandingScreenProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onStart: () => void;
}

export default function LandingScreen({
  playerName,
  setPlayerName,
  onStart,
}: LandingScreenProps): ReactElement {
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

        <button
          onClick={onStart}
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
