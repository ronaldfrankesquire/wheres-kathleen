import React, { useEffect, useMemo, useRef, useState } from "react";
import Celebration from "./Celebration.jsx";
import ProgressBar from "./ProgressBar.jsx";
import {
  playFoundSound,
  playHintSound,
  playMissSound
} from "../soundEffects.js";

const EMPTY_SPACE_MESSAGE = "Not there... keep looking!";
const COMPLETE_MESSAGE = "You found all the Kathleens!";
const START_MESSAGE = "Tap the hidden Kathleens when you spot them.";
const MAX_HINTS = 3;
const HINT_REGEN_SECONDS = 30;
const HINT_VISIBLE_MS = 5200;
const MIN_SCENE_LOADING_MS = 950;
const PLACEMENT_MAP_COUNT = 5;
const SCENE_REVEAL_MS = 520;
const COLLISION_RESOLUTION_PASSES = 10;
const PLACEMENT_MAP_RECIPES = [
  { multiplier: 1, shift: 0 },
  { multiplier: 7, shift: 4 },
  { multiplier: 13, shift: 9 },
  { multiplier: 3, shift: 8 },
  { multiplier: 17, shift: 15 }
];

function decodeImageSource(source) {
  return new Promise((resolve) => {
    const image = new Image();

    function finish() {
      if (image.decode) {
        image.decode().then(resolve, resolve);
        return;
      }

      resolve();
    }

    image.onload = finish;
    image.onerror = resolve;
    image.decoding = "async";
    image.src = source;

    if (image.complete && image.naturalWidth > 0) {
      finish();
    }
  });
}

function clampPercentage(value, min = 7, max = 93) {
  return Math.min(Math.max(value, min), max);
}

function getMovedPlacementSlot(slot, mapIndex, seed) {
  const waveX = Math.sin(seed * 1.19) * 6.8;
  const waveY = Math.cos(seed * 1.41) * 5.2;
  const centerX = slot.x - 50;
  const centerY = slot.y - 50;

  switch (mapIndex) {
    case 1:
      return {
        x: 100 - slot.x + waveX,
        y: slot.y + waveY
      };
    case 2:
      return {
        x: slot.x + waveX,
        y: 100 - slot.y + waveY
      };
    case 3:
      return {
        x: 100 - slot.x + waveX,
        y: 100 - slot.y + waveY
      };
    case 4:
      return {
        x: 50 + centerY * 1.18 + waveX,
        y: 50 - centerX * 0.72 + waveY
      };
    default:
      return {
        x: slot.x,
        y: slot.y
      };
  }
}

function getMinimumKathleenDistance(firstKathleen, secondKathleen) {
  return Math.max(
    8,
    (firstKathleen.width + secondKathleen.width) * 0.82
  );
}

function spreadOverlappingKathleens(kathleens) {
  const spreadKathleens = kathleens.map((kathleen) => ({ ...kathleen }));

  for (let pass = 0; pass < COLLISION_RESOLUTION_PASSES; pass += 1) {
    for (let firstIndex = 0; firstIndex < spreadKathleens.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < spreadKathleens.length;
        secondIndex += 1
      ) {
        const firstKathleen = spreadKathleens[firstIndex];
        const secondKathleen = spreadKathleens[secondIndex];
        let deltaX = secondKathleen.x - firstKathleen.x;
        let deltaY = secondKathleen.y - firstKathleen.y;
        let distance = Math.hypot(deltaX, deltaY);
        const minimumDistance = getMinimumKathleenDistance(
          firstKathleen,
          secondKathleen
        );

        if (distance >= minimumDistance) {
          continue;
        }

        if (distance < 0.01) {
          const angle = (firstIndex + secondIndex + pass + 1) * 2.399;
          deltaX = Math.cos(angle);
          deltaY = Math.sin(angle);
          distance = 1;
        }

        const pushDistance = (minimumDistance - distance) / 2;
        const pushX = (deltaX / distance) * pushDistance;
        const pushY = (deltaY / distance) * pushDistance;

        firstKathleen.x = clampPercentage(firstKathleen.x - pushX, 5, 95);
        firstKathleen.y = clampPercentage(firstKathleen.y - pushY, 6, 94);
        secondKathleen.x = clampPercentage(secondKathleen.x + pushX, 5, 95);
        secondKathleen.y = clampPercentage(secondKathleen.y + pushY, 6, 94);
      }
    }
  }

  return spreadKathleens;
}

function getPlacementMapKathleens(level, placementMapIndex = 0) {
  const normalizedMapIndex =
    ((placementMapIndex % PLACEMENT_MAP_COUNT) + PLACEMENT_MAP_COUNT) %
    PLACEMENT_MAP_COUNT;
  const recipe = PLACEMENT_MAP_RECIPES[normalizedMapIndex];
  const maxOffsetX = (level.randomOffsetX ?? 3.4) * 0.24;
  const maxOffsetY = (level.randomOffsetY ?? 2.6) * 0.24;
  const maxRotation = (level.randomRotation ?? 4) * 0.6;
  const placementCount = level.kathleens.length;

  const mappedKathleens = level.kathleens.map((kathleen, index) => {
    const placementSlot =
      level.kathleens[
        (index * recipe.multiplier + recipe.shift) % placementCount
      ];
    const seed = (index + 1) * (normalizedMapIndex + 2);
    const movedSlot = getMovedPlacementSlot(
      placementSlot,
      normalizedMapIndex,
      seed
    );
    const offsetX =
      normalizedMapIndex === 0 ? 0 : Math.sin(seed * 1.73) * maxOffsetX;
    const offsetY =
      normalizedMapIndex === 0 ? 0 : Math.cos(seed * 1.37) * maxOffsetY;
    const rotationOffset =
      normalizedMapIndex === 0
        ? 0
        : Math.sin(seed * 2.11 + normalizedMapIndex) * maxRotation;

    return {
      ...kathleen,
      x: clampPercentage(movedSlot.x + offsetX, 5, 95),
      y: clampPercentage(movedSlot.y + offsetY, 6, 94),
      width: placementSlot.width,
      rotation: (placementSlot.rotation ?? 0) + rotationOffset,
      zIndex: placementSlot.zIndex ?? kathleen.zIndex
    };
  });

  return spreadOverlappingKathleens(mappedKathleens);
}

export default function GameScene({
  hasNextLevel = false,
  isActive = true,
  level,
  onLevelComplete,
  onNextLevel,
  onRestartLevel,
  placementMapIndex = 0,
  soundEffectsOn = true
}) {
  const [visibleKathleens, setVisibleKathleens] = useState(() =>
    getPlacementMapKathleens(level, placementMapIndex)
  );
  const [foundIds, setFoundIds] = useState(() => new Set());
  const [message, setMessage] = useState(START_MESSAGE);
  const [sparkles, setSparkles] = useState([]);
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS);
  const [hintCountdown, setHintCountdown] = useState(HINT_REGEN_SECONDS);
  const [activeHint, setActiveHint] = useState(null);
  /** loading: decode assets | reveal: fade cover over prepared scene | ready: play */
  const [scenePhase, setScenePhase] = useState("loading");
  const hintTimeoutRef = useRef(null);
  const minLoadingTimeoutRef = useRef(null);
  const revealFallbackTimeoutRef = useRef(null);
  const loadingOverlayRef = useRef(null);
  const sceneBackgroundImgRef = useRef(null);
  /** Bumped on each level/placement reset so stale decode/onLoad callbacks are ignored. */
  const sceneLoadGenerationRef = useRef(0);
  const loadingStartedAtRef = useRef(Date.now());
  const isActiveRef = useRef(isActive);
  const backgroundSourceRef = useRef(level.background);

  const totalCount = visibleKathleens.length;
  const foundCount = foundIds.size;
  const isComplete = foundCount === totalCount;
  const hintRechargeProgress =
    isComplete || hintsRemaining >= MAX_HINTS
      ? 1
      : (HINT_REGEN_SECONDS - hintCountdown) / HINT_REGEN_SECONDS;
  const hintFillPercent = Math.min(
    100,
    ((hintsRemaining + hintRechargeProgress) / MAX_HINTS) * 100
  );

  const kathleenLookup = useMemo(
    () => new Map(visibleKathleens.map((kathleen) => [kathleen.id, kathleen])),
    [visibleKathleens]
  );

  useEffect(() => {
    sceneLoadGenerationRef.current += 1;
    loadingStartedAtRef.current = Date.now();
    backgroundSourceRef.current = level.background;
    setVisibleKathleens(getPlacementMapKathleens(level, placementMapIndex));
    setFoundIds(new Set());
    setSparkles([]);
    setHintsRemaining(MAX_HINTS);
    setHintCountdown(HINT_REGEN_SECONDS);
    setActiveHint(null);
    setMessage(START_MESSAGE);
    setScenePhase("loading");

    if (hintTimeoutRef.current) {
      window.clearTimeout(hintTimeoutRef.current);
    }
    if (minLoadingTimeoutRef.current) {
      window.clearTimeout(minLoadingTimeoutRef.current);
      minLoadingTimeoutRef.current = null;
    }
    if (revealFallbackTimeoutRef.current) {
      window.clearTimeout(revealFallbackTimeoutRef.current);
      revealFallbackTimeoutRef.current = null;
    }

    const img = sceneBackgroundImgRef.current;
    if (
      img &&
      img.getAttribute("src") === backgroundSourceRef.current &&
      img.complete &&
      img.naturalWidth > 0
    ) {
      handleBackgroundReady({ currentTarget: img });
    }
  }, [level, placementMapIndex]);

  useEffect(() => {
    isActiveRef.current = isActive;

    if (!isActive) {
      setScenePhase("loading");
      if (minLoadingTimeoutRef.current) {
        window.clearTimeout(minLoadingTimeoutRef.current);
        minLoadingTimeoutRef.current = null;
      }
      if (revealFallbackTimeoutRef.current) {
        window.clearTimeout(revealFallbackTimeoutRef.current);
        revealFallbackTimeoutRef.current = null;
      }
      return;
    }

    sceneLoadGenerationRef.current += 1;
    loadingStartedAtRef.current = Date.now();
    setScenePhase("loading");

    const img = sceneBackgroundImgRef.current;
    if (
      img &&
      img.getAttribute("src") === backgroundSourceRef.current &&
      img.complete &&
      img.naturalWidth > 0
    ) {
      handleBackgroundReady({ currentTarget: img });
    }
  }, [isActive]);

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
      if (minLoadingTimeoutRef.current) {
        window.clearTimeout(minLoadingTimeoutRef.current);
      }
      if (revealFallbackTimeoutRef.current) {
        window.clearTimeout(revealFallbackTimeoutRef.current);
      }
    };
  }, []);

  function clearRevealFallback() {
    if (revealFallbackTimeoutRef.current) {
      window.clearTimeout(revealFallbackTimeoutRef.current);
      revealFallbackTimeoutRef.current = null;
    }
  }

  function finishRevealToReady() {
    setScenePhase((current) => (current === "reveal" ? "ready" : current));
    clearRevealFallback();
  }

  function handleRevealOverlayTransitionEnd(event) {
    if (event.propertyName !== "opacity") {
      return;
    }
    if (event.target !== loadingOverlayRef.current) {
      return;
    }
    finishRevealToReady();
  }

  function handleBackgroundReady(event) {
    const backgroundImage = event.currentTarget;
    const backgroundSource = backgroundImage.getAttribute("src");
    const loadGeneration = sceneLoadGenerationRef.current;

    function afterAssetsDecoded() {
      if (backgroundSource !== backgroundSourceRef.current) {
        return;
      }
      if (sceneLoadGenerationRef.current !== loadGeneration) {
        return;
      }
      if (!isActiveRef.current) {
        return;
      }

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        const remainingLoadingTime = Math.max(
          0,
          MIN_SCENE_LOADING_MS - (Date.now() - loadingStartedAtRef.current)
        );

        minLoadingTimeoutRef.current = window.setTimeout(() => {
          if (
            backgroundSource === backgroundSourceRef.current &&
            sceneLoadGenerationRef.current === loadGeneration &&
            isActiveRef.current
          ) {
            setScenePhase("ready");
          }
        }, remainingLoadingTime);
        return;
      }

      function startReveal() {
        if (backgroundSource !== backgroundSourceRef.current) {
          return;
        }
        setScenePhase("reveal");
        clearRevealFallback();
        revealFallbackTimeoutRef.current = window.setTimeout(() => {
          finishRevealToReady();
        }, SCENE_REVEAL_MS + 120);
      }

      const remainingLoadingTime = Math.max(
        0,
        MIN_SCENE_LOADING_MS - (Date.now() - loadingStartedAtRef.current)
      );

      if (minLoadingTimeoutRef.current) {
        window.clearTimeout(minLoadingTimeoutRef.current);
      }

      minLoadingTimeoutRef.current = window.setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(startReveal);
        });
      }, remainingLoadingTime);
    }

    function afterBackgroundDecoded() {
      Promise.all(
        visibleKathleens.map((kathleen) => decodeImageSource(kathleen.src))
      )
        .then(afterAssetsDecoded, afterAssetsDecoded);
    }

    if (backgroundImage.decode) {
      backgroundImage
        .decode()
        .then(afterBackgroundDecoded, afterBackgroundDecoded);
      return;
    }

    afterBackgroundDecoded();
  }

  function handleKathleenClick(event, kathleenId) {
    event.stopPropagation();

    if (scenePhase !== "ready") {
      return;
    }

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
      onLevelComplete?.();
    } else {
      setMessage(`${kathleen?.label ?? "Kathleen"} found!`);
      if (soundEffectsOn) {
        playFoundSound();
      }
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
    if (scenePhase !== "ready") {
      return;
    }

    if (!isComplete) {
      setMessage(EMPTY_SPACE_MESSAGE);
      if (soundEffectsOn) {
        playMissSound();
      }
    }
  }

  function handleHintClick() {
    if (scenePhase !== "ready" || hintsRemaining <= 0 || isComplete) {
      return;
    }

    const hiddenKathleens = visibleKathleens.filter(
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
    if (soundEffectsOn) {
      playHintSound();
    }

    if (hintTimeoutRef.current) {
      window.clearTimeout(hintTimeoutRef.current);
    }

    hintTimeoutRef.current = window.setTimeout(() => {
      setActiveHint(null);
    }, HINT_VISIBLE_MS);
  }

  function handlePlayAgain() {
    setFoundIds(new Set());
    setVisibleKathleens(getPlacementMapKathleens(level, placementMapIndex));
    setSparkles([]);
    setHintsRemaining(MAX_HINTS);
    setHintCountdown(HINT_REGEN_SECONDS);
    setActiveHint(null);
    setMessage(START_MESSAGE);
    onRestartLevel?.();
  }

  return (
    <section className="game-layout">
      <header className="game-header">
        <h1>Where&apos;s Kathleen?</h1>
      </header>

      <ProgressBar foundCount={foundCount} totalCount={totalCount} />

      <div className="game-tools">
        <button
          className="hint-button"
          type="button"
          aria-label={
            hintsRemaining < MAX_HINTS && !isComplete
              ? `Hint ${hintsRemaining} of ${MAX_HINTS}. Recharging.`
              : `Hint ${hintsRemaining} of ${MAX_HINTS}`
          }
          disabled={
            scenePhase !== "ready" || hintsRemaining === 0 || isComplete
          }
          onClick={handleHintClick}
          style={{ "--hint-fill": `${hintFillPercent}%` }}
        >
          <span className="hint-button-label">
            Hint {hintsRemaining} / {MAX_HINTS}
          </span>
        </button>
        <button
          className="replay-button"
          type="button"
          onClick={handlePlayAgain}
        >
          Replay
        </button>
      </div>

      <p className={`game-message ${isComplete ? "is-complete" : ""}`}>
        {message}
      </p>

      <div className="scene-viewport">
        <div
          className={`scene-frame ${isComplete ? "is-complete" : ""} ${
            scenePhase === "ready"
              ? "is-scene-ready"
              : scenePhase === "reveal"
                ? "is-scene-revealing"
                : "is-scene-loading"
          }`}
          onClick={handleSceneClick}
          style={{
            "--scene-background-filter": level.backgroundFilter,
            "--scene-complete-background-filter": level.completeBackgroundFilter
          }}
        >
          <img
            ref={sceneBackgroundImgRef}
            className="scene-background"
            src={level.background}
            alt={`${level.title} seek-and-find scene`}
            draggable="false"
            onLoad={handleBackgroundReady}
          />

          {(scenePhase === "loading" || scenePhase === "reveal") && (
            <div
              ref={loadingOverlayRef}
              className={`scene-loading ${
                scenePhase === "reveal" ? "is-exiting" : ""
              }`}
              aria-live="polite"
              onTransitionEnd={handleRevealOverlayTransitionEnd}
            >
              <div className="scene-loading-panel">
                <span className="scene-loading-title">{level.title}</span>
                <span className="scene-loading-label">Loading</span>
                <span className="scene-loading-meter" aria-hidden="true">
                  <span />
                </span>
                <span className="scene-loading-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          )}

          {scenePhase === "ready" && activeHint && (
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

          {scenePhase !== "loading" && (
            <div className="kathleen-layer">
              {visibleKathleens.map((kathleen) => {
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
            </div>
          )}

          <Celebration active={isComplete} />

          {isComplete && level.completionKathleen && (
            <div className="finale-kathleen" aria-hidden="true">
              <img
                src={level.completionKathleen.src}
                alt=""
                draggable="false"
              />
            </div>
          )}

          {isComplete && (
            <div className="completion-actions">
              <button
                className="play-again-button"
                type="button"
                onClick={handlePlayAgain}
              >
                Play again
              </button>
              {hasNextLevel && (
                <button
                  className="next-level-button"
                  type="button"
                  onClick={onNextLevel}
                >
                  Next level
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
