import React from 'react';

interface DiscordButtonProps {
  type: string;
  url?: string;
  emoji?: string;
  children: React.ReactNode;
}

export function DiscordButton({ type, url, emoji, children }: DiscordButtonProps) {
  const content = (
    <>
      <span className="discord-button-content">
        {emoji && <img src={emoji} alt="" className="discord-button-emoji" draggable={false} />}
        <span className="discord-button-label">{children}</span>
      </span>
      {url && (
        <span className="discord-button-launch" aria-hidden="true">
          <svg role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V4.41l-4.3 4.3a1 1 0 1 1-1.4-1.42L19.58 3H16a1 1 0 0 1-1-1Z"
            />
            <path
              fill="currentColor"
              d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 1 0-2 0v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 1 0 0-2H5Z"
            />
          </svg>
        </span>
      )}
    </>
  );

  if (!url) {
    return <span className={`discord-button discord-button-${type}`}>{content}</span>;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`discord-button discord-button-${type}`}>
      {content}
    </a>
  );
}

export default DiscordButton;
