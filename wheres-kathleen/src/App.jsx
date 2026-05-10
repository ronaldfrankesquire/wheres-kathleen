import React, { useEffect, useRef, useState } from "react";
import GameScene from "./components/GameScene.jsx";
import { levels } from "./data/levelsConfig.js";
import { playWinSound } from "./soundEffects.js";

const BACKGROUND_TRACK_SRC =
  "/assets/audio/audiocoffee-kid-background-110768.mp3";
const BACKGROUND_TRACK_VOLUME = 0.28;
const PLACEMENT_MAP_COUNT = 5;
const PLACEMENT_MAP_STORAGE_KEY = "wheres-kathleen-placement-offsets";

function getLaunchPlacementMapOffsets() {
  const fallbackOffsets = Object.fromEntries(
    levels.map((level) => [
      level.id,
      Math.floor(Math.random() * PLACEMENT_MAP_COUNT)
    ])
  );

  try {
    const previousOffsets = JSON.parse(
      window.localStorage.getItem(PLACEMENT_MAP_STORAGE_KEY) ?? "{}"
    );
    const nextOffsets = Object.fromEntries(
      levels.map((level) => {
        const previousOffset = Number(previousOffsets[level.id]);
        const randomStep =
          1 + Math.floor(Math.random() * (PLACEMENT_MAP_COUNT - 1));
        const nextOffset = Number.isInteger(previousOffset)
          ? (previousOffset + randomStep) % PLACEMENT_MAP_COUNT
          : Math.floor(Math.random() * PLACEMENT_MAP_COUNT);

        return [level.id, nextOffset];
      })
    );

    window.localStorage.setItem(
      PLACEMENT_MAP_STORAGE_KEY,
      JSON.stringify(nextOffsets)
    );

    return nextOffsets;
  } catch {
    return fallbackOffsets;
  }
}

export default function App() {
  const [placementMapOffsets] = useState(getLaunchPlacementMapOffsets);
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
    ((levelPlayCounts[currentLevel.id] ?? 0) +
      (placementMapOffsets[currentLevel.id] ?? 0)) %
    PLACEMENT_MAP_COUNT;

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

    if (!backgroundMusic || !isMusicOn) {
      return;
    }

    backgroundMusic.volume = BACKGROUND_TRACK_VOLUME;

    const playPromise = backgroundMusic.play();

    if (playPromise) {
      playPromise.catch(() => {});
    }
  }

  function handleEnterGame() {
    setIsLevelComplete(false);
    setIsHomeOpen(false);
    playBackgroundMusic();
  }

  function handlePlayPressStart() {
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
    backgroundMusic.load();

    return undefined;
  }, []);

  useEffect(() => {
    if (!isMusicOn) {
      backgroundMusicRef.current?.pause();
      return undefined;
    }

    function handleFirstAudioGesture() {
      playBackgroundMusic();
    }

    window.addEventListener("pointerdown", handleFirstAudioGesture, {
      capture: true,
      once: true
    });
    window.addEventListener("click", handleFirstAudioGesture, {
      capture: true,
      once: true
    });
    window.addEventListener("touchstart", handleFirstAudioGesture, {
      capture: true,
      once: true
    });
    window.addEventListener("keydown", handleFirstAudioGesture, {
      capture: true,
      once: true
    });

    playBackgroundMusic();

    return () => {
      window.removeEventListener("pointerdown", handleFirstAudioGesture, {
        capture: true
      });
      window.removeEventListener("click", handleFirstAudioGesture, {
        capture: true
      });
      window.removeEventListener("touchstart", handleFirstAudioGesture, {
        capture: true
      });
      window.removeEventListener("keydown", handleFirstAudioGesture, {
        capture: true
      });
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
    if (isMusicOn) {
      playBackgroundMusic();
      return undefined;
    }

    if (!isMusicOn) {
      backgroundMusicRef.current?.pause();
    }

    return undefined;
  }, [currentLevel.id, isHomeOpen, isLevelComplete, isMusicOn]);

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
        autoPlay
        loop
        playsInline
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
                onPointerDown={handlePlayPressStart}
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
