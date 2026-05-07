let audioContext;

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
  playTone({ frequency: 660, duration: 0.12, type: "triangle", volume: 0.07 });
  playTone({ frequency: 990, duration: 0.16, delay: 0.07, type: "triangle", volume: 0.06 });
}

export function playMissSound() {
  playTone({ frequency: 180, duration: 0.1, type: "sine", volume: 0.035 });
}

export function playHintSound() {
  playTone({ frequency: 520, duration: 0.16, type: "sine", volume: 0.05 });
  playTone({ frequency: 780, duration: 0.2, delay: 0.1, type: "sine", volume: 0.045 });
}

export function playWinSound() {
  [523, 659, 784, 1047, 1319].forEach((frequency, index) => {
    playTone({
      frequency,
      duration: 0.22,
      delay: index * 0.09,
      type: "triangle",
      volume: 0.065
    });
  });
}
