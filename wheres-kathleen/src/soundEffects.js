let audioContext;

const FOUND_SOUND_SRC = "/assets/audio/liecio-collect-points-190037.mp3";
const MISS_SOUND_SRC = "/assets/audio/freesound_community-wrong-47985.mp3";
const WIN_SOUND_SRC =
  "/assets/audio/freesound_community-piglevelwin2mp3-14800.mp3";

function playAudioFile(src, volume = 0.42) {
  if (typeof Audio === "undefined") {
    return;
  }

  const audio = new Audio(src);
  audio.volume = volume;

  const playPromise = audio.play();

  if (playPromise) {
    playPromise.catch(() => {});
  }
}

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone({ frequency, duration, delay = 0, type = "sine", volume = 0.08 }) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const startTime = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

export function playFoundSound() {
  playAudioFile(FOUND_SOUND_SRC, 0.46);
}

export function playMissSound() {
  playAudioFile(MISS_SOUND_SRC, 0.38);
}

export function playHintSound() {
  playTone({ frequency: 520, duration: 0.16, type: "sine", volume: 0.05 });
  playTone({ frequency: 780, duration: 0.2, delay: 0.1, type: "sine", volume: 0.045 });
}

export function playWinSound() {
  playAudioFile(WIN_SOUND_SRC, 0.5);
}
