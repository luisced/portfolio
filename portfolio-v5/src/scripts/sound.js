// Small synthesized sounds for the things in the room. No audio files: a few oscillators and a noise burst, made on demand.
// Off until the visitor turns it on.
let ac = null, noise = null;

function ctx() {
  if (!ac) {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    noise = ac.createBuffer(1, ac.sampleRate * 0.3, ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

/** One voice: a pitch that glides through `freqs` over `dur` seconds. */
function tone(type, freqs, dur, gain = 0.12, at = 0, filter = 0) {
  const a = ctx(), t = a.currentTime + at, o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freqs[0], t);
  freqs.slice(1).forEach((f, i) => o.frequency.exponentialRampToValueAtTime(f, t + (dur * (i + 1)) / (freqs.length - 1)));
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let out = o;
  if (filter) { const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = filter; f.Q.value = 2.5; o.connect(f); out = f; }
  out.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

function click(at = 0, gain = 0.1, freq = 2600, dur = 0.03) {
  const a = ctx(), t = a.currentTime + at, s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  s.buffer = noise; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.2;
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(a.destination);
  s.start(t); s.stop(t + dur + 0.02);
}

const SOUNDS = {
  on: () => tone('sine', [660, 990], 0.14, 0.08),
  lamp: () => { click(0, 0.16, 1500, 0.035); tone('sine', [180, 120], 0.08, 0.06); },
  cat: () => { tone('sawtooth', [520, 780, 640, 430], 0.46, 0.09, 0, 1400); tone('sine', [540, 800, 660, 440], 0.46, 0.05); },
  duck: () => { tone('square', [820, 1500], 0.07, 0.05, 0, 1800); tone('square', [1500, 700], 0.13, 0.05, 0.07, 1500); },
  cube: () => { for (let i = 0; i < 4; i++) click(i * 0.07, 0.09, 3200 - i * 300, 0.025); },
  keys: () => { for (let i = 0; i < 9; i++) click(i * 0.055 + Math.random() * 0.02, 0.07, 2200 + Math.random() * 1400, 0.022); },
  rack: () => { [880, 1175, 1568].forEach((f, i) => tone('square', [f, f], 0.06, 0.03, i * 0.09)); },
  yarn: () => { tone('sine', [140, 70], 0.16, 0.14); click(0, 0.05, 500, 0.06); },
  box: () => { tone('sine', [260, 90], 0.1, 0.14); [1320, 1760, 2093, 2637].forEach((f, i) => tone('triangle', [f, f], 0.22, 0.04, 0.08 + i * 0.05)); },
  lights: () => { [1047, 1319, 1568, 2093, 1568].forEach((f, i) => tone('triangle', [f, f], 0.2, 0.045, i * 0.09)); },
  neon: () => { for (let i = 0; i < 5; i++) tone('sawtooth', [120, 118], 0.05, 0.05, i * 0.09 + Math.random() * 0.03, 900); },
  camera: () => { click(0, 0.14, 3000, 0.02); click(0.07, 0.12, 1800, 0.035); },
  window: () => { [392, 494, 587, 784].forEach((f, i) => tone('sine', [f, f], 1.1, 0.04, i * 0.12)); },
};

export function blip(name) {
  try { (SOUNDS[name] || SOUNDS.on)(); } catch { /* no audio: the room stays silent */ }
}
