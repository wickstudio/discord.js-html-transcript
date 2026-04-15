import React from 'react';
import type { ButtonComponent, ThumbnailComponent } from 'discord.js';
import type { RenderMessageContext } from '../../..';
import { Component } from '../../components';
import SectionContent from './SectionContent';
import SectionAccessory from './SectionAccessory';

interface DiscordSectionProps {
  children: React.ReactNode;
  accessory?: ButtonComponent | ThumbnailComponent;
  context: RenderMessageContext;
  id: number;
}

function DiscordSection({ children, accessory, context, id }: DiscordSectionProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <SectionContent>{children}</SectionContent>
      <SectionAccessory>{accessory && <Component component={accessory} id={id} context={context} />}</SectionAccessory>
    </div>
  );
}

export default DiscordSection;
