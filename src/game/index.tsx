import type { ReactElement } from "react";

import Board from "./components/Board";
import GameOverModal from "./components/GameOverModal";
import LandingScreen from "./components/LandingScreen";
import Sidebar from "./components/Sidebar";
import { useGameLoop } from "./hooks/useGameLoop";
import { useKeyboard } from "./hooks/useKeyboard";
import { useGameStore } from "./store/useGameStore";

export default function Game(): ReactElement {
  const started = useGameStore((s) => s.started);

  useGameLoop(150);

  useKeyboard();

  if (!started) {
    return <LandingScreen />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-white relative">
      <Sidebar />
      <div className="flex flex-1 items-center justify-center">
        <Board />
      </div>
      <GameOverModal />
    </div>
  );
}
