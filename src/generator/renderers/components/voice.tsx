import type { Attachment } from 'discord.js';
import React from 'react';

export default function DiscordVoiceMessage({ attachment }: { attachment: Attachment }) {
  const durationSecs = (attachment as any).duration_secs ?? (attachment as any).duration ?? 5;
  const mins = Math.floor(durationSecs / 60);
  const secs = Math.floor(durationSecs % 60);
  const duration = `${mins}:${secs.toString().padStart(2, '0')}`;

  let waveformBars: number[] = [];
  const rawWaveform = (attachment as any).waveform;
  if (rawWaveform && typeof rawWaveform === 'string') {
    try {
      const decoded = Buffer.from(rawWaveform, 'base64');
      const values = Array.from(decoded);
      const barCount = 32;
      const step = Math.max(1, Math.floor(values.length / barCount));
      for (let i = 0; i < values.length && waveformBars.length < barCount; i += step) {
        waveformBars.push(values[i]);
      }
    } catch {
      // fallback below
    }
  }

  if (waveformBars.length === 0) {
    waveformBars = [
      40, 80, 60, 120, 90, 150, 70, 200, 130, 80, 170, 50, 90, 140, 60, 180, 100, 70, 160, 50, 110, 130, 80, 60, 140,
      90, 170, 70, 50, 120, 80, 40,
    ];
  }

  const maxVal = Math.max(...waveformBars, 1);

  return (
    <div className="discord-voice-message" slot="attachment">
      {/* Play button */}
      <div className="discord-voice-play-button">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </div>

      {/* Waveform bars */}
      <div className="discord-voice-waveform">
        {waveformBars.map((val, i) => {
          const height = Math.max(4, Math.round((val / maxVal) * 24));
          return <div key={i} className="discord-voice-waveform-bar" style={{ height: `${height}px` }} />;
        })}
      </div>

      {/* Duration */}
      <div className="discord-voice-duration">{duration}</div>

      {/* Speed button */}
      <div className="discord-voice-speed">1X</div>

      {/* Volume icon */}
      <div className="discord-voice-volume">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M11 5V19L4.5 14H2V10H4.5L11 5Z" />
          <path fill="currentColor" d="M16.5 12C16.5 10.2 15.4 8.7 14 8V16C15.4 15.3 16.5 13.8 16.5 12Z" />
          <path
            fill="currentColor"
            d="M14 3.2V5.3C16.9 6.1 19 8.8 19 12C19 15.2 16.9 17.9 14 18.7V20.8C18.1 19.9 21 16.3 21 12C21 7.7 18.1 4.1 14 3.2Z"
          />
        </svg>
      </div>
    </div>
  );
}
