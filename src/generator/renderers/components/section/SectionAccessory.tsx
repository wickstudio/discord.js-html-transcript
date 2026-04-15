import React from 'react';

interface SectionAccessoryProps {
  children?: React.ReactNode;
}

function SectionAccessory({ children }: SectionAccessoryProps) {
  if (!children) return null;

  return (
    <div
      style={{
        display: 'flex',
        width: 'fit-content',
        flex: '0 0 auto',
        marginLeft: '16px',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
}

export default SectionAccessory;
