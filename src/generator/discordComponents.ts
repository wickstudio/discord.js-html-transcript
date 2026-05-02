import React, { createElement } from 'react';

type DiscordComponentProps = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  slot?: string;
  [key: string]: unknown;
};

function camelToDashCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function getElementProps(props: DiscordComponentProps) {
  return Object.fromEntries(
    Object.entries(props)
      .filter(([key, value]) => key !== 'children' && value !== undefined && value !== null && value !== false)
      .map(([key, value]) => [key === 'className' ? 'class' : camelToDashCase(key), value])
  );
}

function createDiscordComponent(tagName: string) {
  function DiscordComponent({ children, ...props }: DiscordComponentProps) {
    return createElement(tagName, getElementProps(props), children);
  }

  DiscordComponent.displayName = tagName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  return DiscordComponent;
}

export const DiscordActionRow = createDiscordComponent('discord-action-row');
export const DiscordAttachment = createDiscordComponent('discord-attachment');
export const DiscordAttachments = createDiscordComponent('discord-attachments');
export const DiscordBold = createDiscordComponent('discord-bold');
export const DiscordButton = createDiscordComponent('discord-button');
export const DiscordCodeBlock = createDiscordComponent('discord-code-block');
export const DiscordCommand = createDiscordComponent('discord-command');
export const DiscordCustomEmoji = createDiscordComponent('discord-custom-emoji');
export const DiscordEmbed = createDiscordComponent('discord-embed');
export const DiscordEmbedDescription = createDiscordComponent('discord-embed-description');
export const DiscordEmbedField = createDiscordComponent('discord-embed-field');
export const DiscordEmbedFields = createDiscordComponent('discord-embed-fields');
export const DiscordEmbedFooter = createDiscordComponent('discord-embed-footer');
export const DiscordInlineCode = createDiscordComponent('discord-inline-code');
export const DiscordInvite = createDiscordComponent('discord-invite');
export const DiscordItalic = createDiscordComponent('discord-italic');
export const DiscordMention = createDiscordComponent('discord-mention');
export const DiscordMessage = createDiscordComponent('discord-message');
export const DiscordMessages = createDiscordComponent('discord-messages');
export const DiscordQuote = createDiscordComponent('discord-quote');
export const DiscordReaction = createDiscordComponent('discord-reaction');
export const DiscordReactions = createDiscordComponent('discord-reactions');
export const DiscordReply = createDiscordComponent('discord-reply');
export const DiscordSpoiler = createDiscordComponent('discord-spoiler');
export const DiscordSystemMessage = createDiscordComponent('discord-system-message');
export const DiscordThread = createDiscordComponent('discord-thread');
export const DiscordThreadMessage = createDiscordComponent('discord-thread-message');
export const DiscordUnderlined = createDiscordComponent('discord-underlined');
