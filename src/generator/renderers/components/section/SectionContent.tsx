import React from 'react';

interface SectionContentProps {
  children: React.ReactNode;
}

function SectionContent({ children }: SectionContentProps) {
  const items = React.Children.toArray(children);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 0,
        flex: '1 1 auto',
      }}
    >
      {items.map((child, index) => (
        <div
          key={index}
          style={{
            width: '100%',
            minWidth: 0,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export default SectionContent;
