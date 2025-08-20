import { useState } from "react";
import type { ReactElement } from "react";

import Board from "./components/Board";
import LandingScreen from "./components/LandingScreen";
import Sidebar from "./components/Sidebar";

export default function Game(): ReactElement {
  const [playerName, setPlayerName] = useState<string>("");
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);

  if (!started) {
    return (
      <LandingScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-white">
      <Sidebar
        playerName={playerName}
        score={score}
        onRestart={() => setScore(0)}
        onQuit={() => {
          setStarted(false);
          setScore(0);
          setPlayerName("");
        }}
      />

      <div className="flex flex-1 items-center justify-center">
        <Board size={20} />
      </div>
    </div>
  );
}
