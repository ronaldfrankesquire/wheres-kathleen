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
        <button
          className="level-step-button"
          type="button"
          disabled={currentLevelIndex <= 0}
          onClick={() => setCurrentLevelId(levels[currentLevelIndex - 1].id)}
        >
          Previous
        </button>

        <label className="level-select-label">
          <span>Scene</span>
          <select
            className="level-select"
            aria-label="Choose scene level"
            value={currentLevel.id}
            onChange={(event) => setCurrentLevelId(event.target.value)}
          >
            {levels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.title}
              </option>
            ))}
          </select>
        </label>

        <button
          className="level-step-button"
          type="button"
          disabled={!nextLevel}
          onClick={() => {
            if (nextLevel) {
              setCurrentLevelId(nextLevel.id);
            }
          }}
        >
          Next
        </button>
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
