import React, { useEffect, useMemo, useRef, useState } from "react";
import Celebration from "./Celebration.jsx";
import ProgressBar from "./ProgressBar.jsx";
import {
  playFoundSound,
  playHintSound,
  playMissSound,
  playWinSound
} from "../soundEffects.js";

const EMPTY_SPACE_MESSAGE = "Not there... keep looking!";
const COMPLETE_MESSAGE = "You found all the Kathleens!";
const START_MESSAGE = "Tap the hidden Kathleens when you spot them.";
const MAX_HINTS = 3;
const HINT_REGEN_SECONDS = 30;
const HINT_VISIBLE_MS = 5200;

function clampPercentage(value, min = 7, max = 93) {
  return Math.min(Math.max(value, min), max);
}

export default function GameScene({ level }) {
  const [foundIds, setFoundIds] = useState(() => new Set());
  const [message, setMessage] = useState(START_MESSAGE);
  const [sparkles, setSparkles] = useState([]);
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS);
  const [hintCountdown, setHintCountdown] = useState(HINT_REGEN_SECONDS);
  const [activeHint, setActiveHint] = useState(null);
  const hintTimeoutRef = useRef(null);

  const totalCount = level.kathleens.length;
  const foundCount = foundIds.size;
  const isComplete = foundCount === totalCount;

  const kathleenLookup = useMemo(
    () => new Map(level.kathleens.map((kathleen) => [kathleen.id, kathleen])),
    [level.kathleens]
  );

  useEffect(() => {
    if (isComplete || hintsRemaining >= MAX_HINTS) {
      setHintCountdown(HINT_REGEN_SECONDS);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setHintCountdown((currentCountdown) => Math.max(0, currentCountdown - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [hintsRemaining, isComplete]);

  useEffect(() => {
    if (!isComplete && hintsRemaining < MAX_HINTS && hintCountdown === 0) {
      setHintsRemaining((currentHints) => Math.min(MAX_HINTS, currentHints + 1));
      setHintCountdown(HINT_REGEN_SECONDS);
    }
  }, [hintCountdown, hintsRemaining, isComplete]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) {
        window.clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  function handleKathleenClick(event, kathleenId) {
    event.stopPropagation();

    if (foundIds.has(kathleenId)) {
      return;
    }

    const kathleen = kathleenLookup.get(kathleenId);
    const willComplete = foundCount + 1 === totalCount;

    setFoundIds((currentFoundIds) => {
      const nextFoundIds = new Set(currentFoundIds);
      nextFoundIds.add(kathleenId);

      return nextFoundIds;
    });

    if (willComplete) {
      setMessage(COMPLETE_MESSAGE);
      playWinSound();
    } else {
      setMessage(`${kathleen?.label ?? "Kathleen"} found!`);
      playFoundSound();
    }

    setActiveHint((currentHint) =>
      currentHint?.kathleenId === kathleenId ? null : currentHint
    );

    const sparkleId = `${kathleenId}-${Date.now()}`;
    setSparkles((currentSparkles) => [
      ...currentSparkles,
      { id: sparkleId, kathleenId }
    ]);

    window.setTimeout(() => {
      setSparkles((currentSparkles) =>
        currentSparkles.filter((sparkle) => sparkle.id !== sparkleId)
      );
    }, 900);
  }

  function handleSceneClick() {
    if (!isComplete) {
      setMessage(EMPTY_SPACE_MESSAGE);
      playMissSound();
    }
  }

  function handleHintClick() {
    if (hintsRemaining <= 0 || isComplete) {
      return;
    }

    const hiddenKathleens = level.kathleens.filter(
      (kathleen) => !foundIds.has(kathleen.id)
    );

    if (hiddenKathleens.length === 0) {
      return;
    }

    const hintedKathleen =
      hiddenKathleens[Math.floor(Math.random() * hiddenKathleens.length)];
    const hintSize = Math.max(18, hintedKathleen.width * 4.2);
    const looseOffsetX = (Math.random() - 0.5) * 9;
    const looseOffsetY = (Math.random() - 0.5) * 9;

    setHintsRemaining((currentHints) => Math.max(0, currentHints - 1));
    setActiveHint({
      id: `${hintedKathleen.id}-${Date.now()}`,
      kathleenId: hintedKathleen.id,
      x: clampPercentage(hintedKathleen.x + looseOffsetX),
      y: clampPercentage(hintedKathleen.y + looseOffsetY),
      size: hintSize
    });
    setMessage("A little magic is pointing near something...");
    playHintSound();

    if (hintTimeoutRef.current) {
      window.clearTimeout(hintTimeoutRef.current);
    }

    hintTimeoutRef.current = window.setTimeout(() => {
      setActiveHint(null);
    }, HINT_VISIBLE_MS);
  }

  function handlePlayAgain() {
    setFoundIds(new Set());
    setSparkles([]);
    setHintsRemaining(MAX_HINTS);
    setHintCountdown(HINT_REGEN_SECONDS);
    setActiveHint(null);
    setMessage(START_MESSAGE);
  }

  return (
    <section className="game-layout">
      <header className="game-header">
        <p className="level-title">{level.title}</p>
        <h1>Where&apos;s Kathleen?</h1>
      </header>

      <ProgressBar foundCount={foundCount} totalCount={totalCount} />

      <div className="game-tools">
        <button
          className="hint-button"
          type="button"
          disabled={hintsRemaining === 0 || isComplete}
          onClick={handleHintClick}
        >
          Hint {hintsRemaining} / {MAX_HINTS}
        </button>
        <span className="hint-status" aria-live="polite">
          {isComplete
            ? "All found"
            : hintsRemaining < MAX_HINTS
              ? `Next hint in ${hintCountdown}s`
              : "Hints ready"}
        </span>
      </div>

      <p className={`game-message ${isComplete ? "is-complete" : ""}`}>
        {message}
      </p>

      <div
        className={`scene-frame ${isComplete ? "is-complete" : ""}`}
        onClick={handleSceneClick}
        style={{
          "--scene-background-filter": level.backgroundFilter,
          "--scene-complete-background-filter": level.completeBackgroundFilter
        }}
      >
        <img
          className="scene-background"
          src={level.background}
          alt={`${level.title} seek-and-find scene`}
          draggable="false"
        />

        {activeHint && (
          <span
            className="hint-area"
            key={activeHint.id}
            style={{
              left: `${activeHint.x}%`,
              top: `${activeHint.y}%`,
              width: `${activeHint.size}%`
            }}
          />
        )}

        {level.kathleens.map((kathleen) => {
          const isFound = foundIds.has(kathleen.id);
          const kathleenSparkles = sparkles.filter(
            (sparkle) => sparkle.kathleenId === kathleen.id
          );

          return (
            <button
              className={`kathleen-target ${isFound ? "is-found" : ""}`}
              key={kathleen.id}
              type="button"
              aria-label={
                isFound
                  ? `${kathleen.label} found`
                  : `Find ${kathleen.label}`
              }
              onClick={(event) => handleKathleenClick(event, kathleen.id)}
              style={{
                left: `${kathleen.x}%`,
                top: `${kathleen.y}%`,
                width: `${kathleen.width}%`,
                "--kathleen-hidden-filter": kathleen.hiddenFilter,
                "--kathleen-hidden-opacity": kathleen.hiddenOpacity,
                transform: `translate(-50%, -50%) rotate(${
                  kathleen.rotation ?? 0
                }deg)`,
                zIndex: kathleen.zIndex ?? 2
              }}
            >
              <img
                src={kathleen.src}
                alt={kathleen.label}
                draggable="false"
              />
              {kathleenSparkles.map((sparkle) => (
                <span className="mini-sparkles" key={sparkle.id}>
                  <span />
                  <span />
                  <span />
                </span>
              ))}
            </button>
          );
        })}

        <Celebration active={isComplete} />
      </div>

      {isComplete && (
        <button
          className="play-again-button"
          type="button"
          onClick={handlePlayAgain}
        >
          Play again
        </button>
      )}
    </section>
  );
}
