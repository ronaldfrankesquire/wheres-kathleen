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
  const [isHomeOpen, setIsHomeOpen] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isSoundEffectsOn, setIsSoundEffectsOn] = useState(true);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const backgroundMusicRef = useRef(null);
  const preloadedImagesRef = useRef(new Map());
  const currentLevelIndex = levels.findIndex(
    (level) => level.id === currentLevelId
  );
  const currentLevel =
    levels[currentLevelIndex >= 0 ? currentLevelIndex : 0] ?? levels[0];
  const nextLevel = levels[currentLevelIndex + 1];
  const currentPlacementMapIndex =
    (levelPlayCounts[currentLevel.id] ?? 0) % PLACEMENT_MAP_COUNT;

  function startLevel(levelId) {
    setIsHomeOpen(false);
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

  function handleEnterGame() {
    setIsHomeOpen(false);
    playBackgroundMusic();
  }

  function handleHomeClick() {
    setIsHomeOpen(true);
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
    const levelsToPreload = [
      levels[0],
      levels[currentLevelIndex - 1],
      currentLevel,
      nextLevel
    ].filter(Boolean);
    const imageSources = new Set();

    levelsToPreload.forEach((level) => {
      imageSources.add(level.background);
      level.kathleens.forEach((kathleen) => imageSources.add(kathleen.src));

      if (level.completionKathleen) {
        imageSources.add(level.completionKathleen.src);
      }
    });

    imageSources.forEach((source) => {
      if (preloadedImagesRef.current.has(source)) {
        return;
      }

      const image = new Image();
      image.decoding = "async";
      image.src = source;
      preloadedImagesRef.current.set(source, image);
    });
  }, [currentLevel, currentLevelIndex, nextLevel]);

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
    <main className={`app-shell ${isHomeOpen ? "is-home-open" : ""}`}>
      <audio
        ref={backgroundMusicRef}
        src={BACKGROUND_TRACK_SRC}
        loop
        preload="auto"
      />

      {isHomeOpen && (
        <section
          className="title-screen"
          style={{ "--title-background": `url("${levels[0].background}")` }}
          aria-labelledby="title-screen-heading"
        >
          <div className="title-panel">
            <h1 className="title-logo" id="title-screen-heading">
              Where&apos;s Kathleen?
            </h1>
            <div className="title-actions" aria-label="Title actions">
              <button
                className="title-play-button"
                type="button"
                onClick={handleEnterGame}
              >
                Play
              </button>
            </div>
            <div className="title-audio-actions" aria-label="Audio controls">
              <button
                className="audio-toggle title-audio-toggle"
                type="button"
                aria-pressed={isMusicOn}
                onClick={handleMusicToggle}
              >
                {isMusicOn ? "Music on" : "Music off"}
              </button>
              <button
                className="audio-toggle title-audio-toggle"
                type="button"
                aria-pressed={isSoundEffectsOn}
                onClick={handleSoundEffectsToggle}
              >
                {isSoundEffectsOn ? "Effects on" : "Effects off"}
              </button>
            </div>
          </div>
        </section>
      )}

      <div
        className={`game-view ${isHomeOpen ? "is-hidden" : ""}`}
        aria-hidden={isHomeOpen}
      >
        <nav className="level-switcher" aria-label="Game controls">
          <button
            className="level-step-button home-button home-icon-button"
            type="button"
            aria-label="Home"
            title="Home"
            onClick={handleHomeClick}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              focusable="false"
            >
              <path d="M3 10.7 12 3l9 7.7" />
              <path d="M5.5 9.4V21h5v-6h3v6h5V9.4" />
            </svg>
          </button>

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
          isActive={!isHomeOpen}
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
      </div>
    </main>
  );
}
