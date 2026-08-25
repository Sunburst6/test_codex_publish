"use client";

import { useEffect, useRef, useState } from "react";

const melody = [
  261.63, 329.63, 392, 493.88,
  293.66, 349.23, 440, 523.25,
  246.94, 329.63, 392, 587.33,
  220, 293.66, 369.99, 493.88,
];

export default function BgmPlayer() {
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.32);
  const audioContext = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const noteIndex = useRef(0);

  useEffect(() => {
    const savedVolume = Number(window.localStorage.getItem("hoshikuzu-bgm-volume"));
    if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
      setVolume(savedVolume);
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
      void audioContext.current?.close();
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("hoshikuzu-bgm-volume", String(volume));
    if (masterGain.current && audioContext.current) {
      masterGain.current.gain.setTargetAtTime(volume * 0.24, audioContext.current.currentTime, 0.08);
    }
  }, [volume]);

  function createNote(frequency: number) {
    const context = audioContext.current;
    const output = masterGain.current;
    if (!context || !output) return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const overtone = context.createOscillator();
    const envelope = context.createGain();
    const overtoneEnvelope = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    overtone.type = "triangle";
    overtone.frequency.value = frequency * 2;

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.45, now + 0.12);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
    overtoneEnvelope.gain.setValueAtTime(0.0001, now);
    overtoneEnvelope.gain.exponentialRampToValueAtTime(0.08, now + 0.2);
    overtoneEnvelope.gain.exponentialRampToValueAtTime(0.0001, now + 1.7);

    oscillator.connect(envelope).connect(output);
    overtone.connect(overtoneEnvelope).connect(output);
    oscillator.start(now);
    overtone.start(now);
    oscillator.stop(now + 2.5);
    overtone.stop(now + 1.8);
  }

  function startSequence() {
    const playNext = () => {
      createNote(melody[noteIndex.current % melody.length]);
      if (noteIndex.current % 4 === 0) {
        createNote(melody[noteIndex.current % melody.length] / 2);
      }
      noteIndex.current += 1;
    };
    playNext();
    timer.current = setInterval(playNext, 920);
  }

  async function togglePlayback() {
    if (!audioContext.current) {
      const context = new AudioContext();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2600;
      gain.gain.value = volume * 0.24;
      gain.connect(filter).connect(context.destination);
      audioContext.current = context;
      masterGain.current = gain;
    }

    if (playing) {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      await audioContext.current.suspend();
      setPlaying(false);
      return;
    }

    await audioContext.current.resume();
    startSequence();
    setPlaying(true);
  }

  return (
    <aside className={`bgm-player${playing ? " is-playing" : ""}${open ? " is-open" : ""}`} aria-label="背景音乐播放器">
      <div className="bgm-panel" aria-hidden={!open}>
        <div>
          <small>NOW PLAYING</small>
          <strong>星屑夜航</strong>
          <span>ambient loop · original</span>
        </div>
        <label>
          <span>音量</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label="背景音乐音量"
            tabIndex={open ? 0 : -1}
          />
        </label>
      </div>
      <button className="bgm-disc" type="button" onClick={togglePlayback} aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}>
        <span className="bgm-orbit" aria-hidden="true" />
        <span className="bgm-icon" aria-hidden="true">{playing ? "Ⅱ" : "♪"}</span>
      </button>
      <button className="bgm-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "收起音乐设置" : "展开音乐设置"}>
        {open ? "×" : "···"}
      </button>
    </aside>
  );
}
