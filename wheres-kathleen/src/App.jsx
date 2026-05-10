import React, { useEffect, useRef, useState } from "react";
import GameScene from "./components/GameScene.jsx";
import { levels } from "./data/levelsConfig.js";
import { playWinSound } from "./soundEffects.js";

const BACKGROUND_TRACK_SRC =
  "/assets/audio/audiocoffee-kid-background-110768.mp3";
const BACKGROUND_TRACK_VOLUME = 0.28;
const PLACEMENT_MAP_COUNT = 5;

export default function App() {
  const [currentLevelId, setCurrentLevelId] = useState("scene-level-1");
  const [levelPlayCounts, setLevelPlayCounts] = useState({});
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isSoundEffectsOn, setIsSoundEffectsOn] = useState(true);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const backgroundMusicRef = useRef(null);
  const currentLevelIndex = levels.findIndex(
    (level) => level.id === currentLevelId
  );
  const currentLevel =
    levels[currentLevelIndex >= 0 ? currentLevelIndex : 0] ?? levels[0];
  const nextLevel = levels[currentLevelIndex + 1];
  const currentPlacementMapIndex =
    (levelPlayCounts[currentLevel.id] ?? 0) % PLACEMENT_MAP_COUNT;

  function startLevel(levelId) {
    setLevelPlayCounts((currentPlayCounts) => ({
      ...currentPlayCounts,
      [levelId]: ((currentPlayCounts[levelId] ?? 0) + 1) % PLACEMENT_MAP_COUNT
    }));
    setCurrentLevelId(levelId);
  }

  function playBackgroundMusic() {
    const backgroundMusic = backgroundMusicRef.current;

    if (!backgroundMusic || !isMusicOn || isLevelComplete) {
      return;
    }

    backgroundMusic.volume = BACKGROUND_TRACK_VOLUME;

    const playPromise = backgroundMusic.play();

    if (playPromise) {
      playPromise.catch(() => {});
    }
  }

  useEffect(() => {
    const backgroundMusic = backgroundMusicRef.current;

    if (!backgroundMusic) {
      return undefined;
    }

    backgroundMusic.volume = BACKGROUND_TRACK_VOLUME;

    return undefined;
  }, []);

  useEffect(() => {
    if (!isMusicOn) {
      backgroundMusicRef.current?.pause();
      return undefined;
    }

    function handleFirstInteraction() {
      playBackgroundMusic();
    }

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true
    });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [isMusicOn]);

  useEffect(() => {
    setIsLevelComplete(false);
  }, [currentLevel.id]);

  useEffect(() => {
    if (isMusicOn && !isLevelComplete) {
      playBackgroundMusic();
      return undefined;
    }

    backgroundMusicRef.current?.pause();

    return undefined;
  }, [currentLevel.id, isLevelComplete, isMusicOn]);

  function handleMusicToggle() {
    const backgroundMusic = backgroundMusicRef.current;

    if (!backgroundMusic) {
      setIsMusicOn((currentIsMusicOn) => !currentIsMusicOn);
      return;
    }

    if (isMusicOn) {
      backgroundMusic.pause();
      setIsMusicOn(false);
      return;
    }

    setIsMusicOn(true);
    backgroundMusic.volume = BACKGROUND_TRACK_VOLUME;

    if (isLevelComplete) {
      return;
    }

    const playPromise = backgroundMusic.play();

    if (playPromise) {
      playPromise.catch(() => {});
    }
  }

  function handleSoundEffectsToggle() {
    setIsSoundEffectsOn((currentIsSoundEffectsOn) => !currentIsSoundEffectsOn);
  }

  function handleLevelComplete() {
    const backgroundMusic = backgroundMusicRef.current;

    setIsLevelComplete(true);

    if (backgroundMusic) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }

    if (isSoundEffectsOn) {
      playWinSound();
    }
  }

  function handleRestartLevel() {
    setIsLevelComplete(false);
    startLevel(currentLevel.id);
  }

  return (
    <main className="app-shell">
      <audio
        ref={backgroundMusicRef}
        src={BACKGROUND_TRACK_SRC}
        loop
        preload="auto"
      />

      <nav className="level-switcher" aria-label="Choose scene">
        <button
          className="level-step-button"
          type="button"
          disabled={currentLevelIndex <= 0}
          onClick={() => startLevel(levels[currentLevelIndex - 1].id)}
        >
          Previous
        </button>

        <span className="current-level-pill" aria-live="polite">
          {currentLevel.title}
        </span>

        <button
          className="level-step-button"
          type="button"
          disabled={!nextLevel}
          onClick={() => {
            if (nextLevel) {
              startLevel(nextLevel.id);
            }
          }}
        >
          Next
        </button>

        <button
          className="audio-toggle"
          type="button"
          aria-pressed={isMusicOn}
          onClick={handleMusicToggle}
        >
          {isMusicOn ? "Music on" : "Music off"}
        </button>

        <button
          className="audio-toggle"
          type="button"
          aria-pressed={isSoundEffectsOn}
          onClick={handleSoundEffectsToggle}
        >
          {isSoundEffectsOn ? "Effects on" : "Effects off"}
        </button>
      </nav>

      <GameScene
        key={`${currentLevel.id}-${currentLevel.background}-${currentPlacementMapIndex}`}
        level={currentLevel}
        placementMapIndex={currentPlacementMapIndex}
        hasNextLevel={Boolean(nextLevel)}
        soundEffectsOn={isSoundEffectsOn}
        onLevelComplete={handleLevelComplete}
        onNextLevel={() => {
          if (nextLevel) {
            startLevel(nextLevel.id);
          }
        }}
        onRestartLevel={handleRestartLevel}
      />
    </main>
  );
}
