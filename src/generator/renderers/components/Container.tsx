import React from 'react';

function DiscordContainer({ children, accentColor }: { children: React.ReactNode; accentColor?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        maxWidth: '628px',
        flexDirection: 'column',
        backgroundColor: '#111214',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderLeft: `4px solid ${accentColor ?? '#4f545c'}`,
        marginTop: '2px',
        marginBottom: '2px',
        borderRadius: '8px',
        gap: '8px',
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

export default DiscordContainer;
