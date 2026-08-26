"use client";

import { useEffect, useRef, useState } from "react";

const tracks = [
  {
    title: "星屑夜航",
    subtitle: "stardust voyage",
    tempo: 920,
    waveform: "sine" as OscillatorType,
    melody: [261.63, 329.63, 392, 493.88, 293.66, 349.23, 440, 523.25, 246.94, 329.63, 392, 587.33, 220, 293.66, 369.99, 493.88],
  },
  {
    title: "雨落玻璃窗",
    subtitle: "rainy window",
    tempo: 780,
    waveform: "triangle" as OscillatorType,
    melody: [293.66, 349.23, 440, 523.25, 329.63, 392, 493.88, 587.33, 261.63, 349.23, 440, 698.46, 293.66, 392, 523.25, 659.25],
  },
  {
    title: "橘子汽水海",
    subtitle: "orange soda sea",
    tempo: 690,
    waveform: "sine" as OscillatorType,
    melody: [392, 493.88, 587.33, 783.99, 440, 523.25, 659.25, 880, 349.23, 440, 587.33, 698.46, 392, 523.25, 659.25, 783.99],
  },
  {
    title: "月台末班车",
    subtitle: "last train home",
    tempo: 1040,
    waveform: "triangle" as OscillatorType,
    melody: [220, 261.63, 329.63, 440, 196, 246.94, 293.66, 392, 174.61, 220, 261.63, 349.23, 164.81, 220, 293.66, 392],
  },
  {
    title: "黎明前的花园",
    subtitle: "garden before dawn",
    tempo: 850,
    waveform: "sine" as OscillatorType,
    melody: [329.63, 392, 493.88, 659.25, 349.23, 440, 523.25, 698.46, 293.66, 392, 493.88, 587.33, 261.63, 349.23, 440, 523.25],
  },
];

export default function BgmPlayer() {
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.32);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const noteIndex = useRef(0);
  const trackIndex = useRef(0);

  useEffect(() => {
    const storedVolume = window.localStorage.getItem("hoshikuzu-bgm-volume");
    const savedVolume = Number(storedVolume);
    if (storedVolume !== null && Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
      setVolume(savedVolume);
    }

    const savedTrack = Number(window.localStorage.getItem("hoshikuzu-bgm-track"));
    if (Number.isInteger(savedTrack) && savedTrack >= 0 && savedTrack < tracks.length) {
      setCurrentTrack(savedTrack);
      trackIndex.current = savedTrack;
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

    oscillator.type = tracks[trackIndex.current].waveform;
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

  function startSequence(selectedTrack = trackIndex.current) {
    if (timer.current) clearInterval(timer.current);
    trackIndex.current = selectedTrack;
    noteIndex.current = 0;
    const track = tracks[selectedTrack];

    const playNext = () => {
      if (noteIndex.current >= track.melody.length * 2) {
        const nextTrack = (selectedTrack + 1) % tracks.length;
        setCurrentTrack(nextTrack);
        window.localStorage.setItem("hoshikuzu-bgm-track", String(nextTrack));
        startSequence(nextTrack);
        return;
      }

      createNote(track.melody[noteIndex.current % track.melody.length]);
      if (noteIndex.current % 4 === 0) {
        createNote(track.melody[noteIndex.current % track.melody.length] / 2);
      }
      noteIndex.current += 1;
    };
    playNext();
    timer.current = setInterval(playNext, track.tempo);
  }

  function selectTrack(selectedTrack: number) {
    const nextTrack = (selectedTrack + tracks.length) % tracks.length;
    setCurrentTrack(nextTrack);
    trackIndex.current = nextTrack;
    window.localStorage.setItem("hoshikuzu-bgm-track", String(nextTrack));

    if (playing) startSequence(nextTrack);
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
        <div className="bgm-heading">
          <div>
            <small>{playing ? "NOW PLAYING" : "STARDUST RADIO"}</small>
            <strong>{tracks[currentTrack].title}</strong>
            <span>{tracks[currentTrack].subtitle} · original</span>
          </div>
          <span className="bgm-counter">{String(currentTrack + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}</span>
        </div>
        <div className="bgm-controls">
          <button type="button" onClick={() => selectTrack(currentTrack - 1)} aria-label="上一首" tabIndex={open ? 0 : -1}>←</button>
          <button type="button" onClick={() => selectTrack(currentTrack + 1)} aria-label="下一首" tabIndex={open ? 0 : -1}>→</button>
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
        <div className="bgm-tracklist" aria-label="背景音乐歌单">
          {tracks.map((track, index) => (
            <button
              key={track.title}
              className={index === currentTrack ? "is-current" : ""}
              type="button"
              onClick={() => selectTrack(index)}
              aria-pressed={index === currentTrack}
              tabIndex={open ? 0 : -1}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {track.title}
              <i aria-hidden="true">{index === currentTrack ? "♪" : "↗"}</i>
            </button>
          ))}
        </div>
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
