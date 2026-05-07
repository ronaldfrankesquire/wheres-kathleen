import React, { useState } from "react";
import GameScene from "./components/GameScene.jsx";
import { levels } from "./data/levelsConfig.js";

export default function App() {
  const [currentLevelId, setCurrentLevelId] = useState("scene-level-1");
  const currentLevelIndex = levels.findIndex(
    (level) => level.id === currentLevelId
  );
  const currentLevel =
    levels[currentLevelIndex >= 0 ? currentLevelIndex : 0] ?? levels[0];
  const nextLevel = levels[currentLevelIndex + 1];

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

      <GameScene
        key={`${currentLevel.id}-${currentLevel.background}`}
        level={currentLevel}
        hasNextLevel={Boolean(nextLevel)}
        onNextLevel={() => {
          if (nextLevel) {
            setCurrentLevelId(nextLevel.id);
          }
        }}
      />
    </main>
  );
}
