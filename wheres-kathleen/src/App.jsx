import React, { useState } from "react";
import GameScene from "./components/GameScene.jsx";
import { levels } from "./data/levelsConfig.js";

export default function App() {
  const [currentLevelId, setCurrentLevelId] = useState("scene-level-2");
  const currentLevel =
    levels.find((level) => level.id === currentLevelId) ?? levels[0];

  return (
    <main className="app-shell">
      <nav className="level-switcher" aria-label="Choose scene">
        {levels.map((level) => (
          <button
            className={level.id === currentLevelId ? "is-active" : ""}
            key={level.id}
            type="button"
            aria-pressed={level.id === currentLevelId}
            onClick={() => setCurrentLevelId(level.id)}
          >
            {level.title}
          </button>
        ))}
      </nav>

      <GameScene key={currentLevel.id} level={currentLevel} />
    </main>
  );
}
