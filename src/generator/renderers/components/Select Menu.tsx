import React from 'react';
import { type MessageActionRowComponent, ComponentType } from 'discord.js';
import type { RenderMessageContext } from '../..';
import { parseDiscordEmoji } from '../../../utils/utils';
import { getSelectTypeLabel } from './utils';

async function DiscordSelectMenu({
  component,
  context,
}: {
  component: Exclude<MessageActionRowComponent, { type: ComponentType.Button }>;
  context: RenderMessageContext;
}) {
  const isStringSelect = component.type === ComponentType.StringSelect;
  const placeholder = component.placeholder || getSelectTypeLabel(component.type);
  const options =
    isStringSelect && component.options
      ? await Promise.all(
          component.options.map(async (option) => ({
            ...option,
            emojiUrl: option.emoji
              ? ((await context.callbacks.resolveTranscriptAssetUrl({
                  kind: 'emoji',
                  url: parseDiscordEmoji(option.emoji),
                })) ?? parseDiscordEmoji(option.emoji))
              : undefined,
          }))
        )
      : [];

  return (
    <div className="discord-select-menu">
      <div className="discord-select-menu-label">{placeholder}</div>
      <div className="discord-select-menu-chevron" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
        </svg>
      </div>
      {isStringSelect && options.length > 0 && (
        <div className="discord-select-menu-options">
          {options.map((option, idx) => (
            <div key={idx} className="discord-select-menu-option">
              {option.emojiUrl && <img src={option.emojiUrl} alt="" className="discord-select-menu-option-emoji" />}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DiscordSelectMenu;
