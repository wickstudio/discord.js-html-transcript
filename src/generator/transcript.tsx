import { DiscordMessages as DiscordMessagesComponent } from '@derockdev/discord-components-react';
import { ChannelType } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '.';
import MessageContent, { RenderType } from './renderers/content';
import DiscordMessage from './renderers/message';
import { globalStyles } from './renderers/components/styles';

function getChannelName(context: RenderMessageContext['channel']) {
  if (context.isDMBased()) {
    return context.type === ChannelType.DM ? (context.recipient?.tag ?? 'Direct Messages') : 'Direct Messages';
  }

  return context.name;
}

function getChannelSummary(context: RenderMessageContext['channel']) {
  if (context.isThread()) {
    return `Thread in #${context.parent?.name ?? 'Unknown Channel'}`;
  }

  if (context.isDMBased()) {
    return `Direct Messages`;
  }

  if (context.isVoiceBased()) {
    return `Voice text channel`;
  }

  if (context.type === ChannelType.GuildCategory) {
    return `Category`;
  }

  if ('topic' in context && context.topic) {
    return context.topic;
  }

  return `This is the start of #${context.name} channel.`;
}

function HeaderChannelGlyph({ channel }: { channel: RenderMessageContext['channel'] }) {
  if (channel.isDMBased() && channel.type === ChannelType.DM && channel.recipient) {
    return (
      <img
        src={channel.recipient.displayAvatarURL({ size: 64 })}
        alt={channel.recipient.username}
        className="discord-transcript-header-avatar"
      />
    );
  }

  if (!channel.isThread() && !channel.isVoiceBased() && channel.type !== ChannelType.GuildForum) {
    return (
      <span className="discord-transcript-header-glyph discord-transcript-header-glyph--hash" aria-hidden="true">
        #
      </span>
    );
  }

  const path = channel.isThread()
    ? 'M5 5a3 3 0 0 1 3-3h8v2H8a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8v2H8a3 3 0 0 1-3-3V5Zm7 4V7h9v2h-9Zm0 4v-2h7v2h-7Zm0 4v-2h5v2h-5Z'
    : channel.isVoiceBased()
      ? 'M12 3a1 1 0 0 1 1 1v10.38a3 3 0 1 1-2 2.83V8.62l-6 1.2v6.59a3 3 0 1 1-2 2.8V7a1 1 0 0 1 .8-.98l8-1.6A1 1 0 0 1 12 3Z'
      : channel.type === ChannelType.GuildForum
        ? 'M5 3h14a2 2 0 0 1 2 2v14l-4-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 4v2h10V7H7Zm0 4v2h7v-2H7Z'
        : 'M5.47 3.47a.75.75 0 0 1 1.06 0L8.06 5h4.88l1.53-1.53a.75.75 0 1 1 1.06 1.06L14.06 6h2.19a.75.75 0 0 1 0 1.5h-3.69L11.31 12h3.94a.75.75 0 0 1 0 1.5h-4.44l-.72 2.53a.75.75 0 0 1-1.44-.41l.6-2.12H4.75a.75.75 0 0 1 0-1.5h4.94l1.25-4.5H6.75a.75.75 0 0 1 0-1.5h4.6l.72-2.53a.75.75 0 1 1 1.44.41L12.91 6h4.34a.75.75 0 0 1 0 1.5H12.5L11.25 12h4a.75.75 0 0 1 0 1.5h-4.41l-.72 2.53a.75.75 0 0 1-1.44-.41l.6-2.12H4.75a.75.75 0 0 1 0-1.5h4.94l1.25-4.5H6.75a.75.75 0 0 1 0-1.5h4.6l.72-2.53a.75.75 0 0 1 .41-.5Z';

  return (
    <span className="discord-transcript-header-glyph" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d={path} />
      </svg>
    </span>
  );
}

function HeaderServerIcon({ channel, guildIcon }: { channel: RenderMessageContext['channel']; guildIcon?: string }) {
  if (channel.isDMBased() || !guildIcon) return null;

  return <img src={guildIcon} alt={channel.guild.name} className="discord-transcript-header-server-icon" />;
}

function HeaderTool({ label, path, hideOnMobile = false }: { label: string; path: string; hideOnMobile?: boolean }) {
  return (
    <button
      type="button"
      className={`discord-transcript-header-tool${hideOnMobile ? ' discord-transcript-header-tool--hide-mobile' : ''}`}
      aria-label={label}
      title={label}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d={path} />
      </svg>
    </button>
  );
}

export default async function DiscordMessages({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  const channelName = getChannelName(channel);
  const channelSummary = getChannelSummary(channel);

  return (
    <DiscordMessagesComponent style={{ minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div className="discord-transcript-header-bar" data-channel-name={channelName}>
        <div className="discord-transcript-header-main">
          <HeaderServerIcon channel={channel} guildIcon={options.guildIcon} />
          <HeaderChannelGlyph channel={channel} />
          <div className="discord-transcript-header-copy">
            <span className="discord-transcript-header-title">{channelName}</span>
            {channelSummary ? (
              <>
                <span className="discord-transcript-header-separator" aria-hidden="true">
                  •
                </span>
                <span className="discord-transcript-header-topic">
                  <MessageContent
                    content={channelSummary}
                    context={{ messages, channel, callbacks, type: RenderType.REPLY, ...options }}
                  />
                </span>
              </>
            ) : null}
          </div>
        </div>
        <div className="discord-transcript-header-tools">
          <div className="discord-transcript-header-actions" aria-hidden="true">
            <HeaderTool
              label="Threads"
              path="M5 5a3 3 0 0 1 3-3h8v2H8a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8v2H8a3 3 0 0 1-3-3V5Zm7 2h9v2h-9V7Zm0 4h7v2h-7v-2Zm0 4h5v2h-5v-2Z"
              hideOnMobile
            />
            <HeaderTool
              label="Notifications"
              path="M9.1 2.75a2.9 2.9 0 0 1 5.8 0c2.14.62 3.6 2.57 3.6 4.87v4.29c0 .76.2 1.5.57 2.17l.73 1.29a1 1 0 0 1-.87 1.5H5.07a1 1 0 0 1-.87-1.5l.73-1.29c.38-.67.57-1.41.57-2.17V7.62c0-2.3 1.46-4.25 3.6-4.87ZM12 21a3 3 0 0 0 2.82-2H9.18A3 3 0 0 0 12 21Z"
              hideOnMobile
            />
            <HeaderTool
              label="Pinned Messages"
              path="M15.45 3.05a1 1 0 0 1 1.41 0l4.1 4.1a1 1 0 0 1 0 1.41l-1.28 1.28a3 3 0 0 0-.88 2.12v2.54a1 1 0 0 1-.3.71l-2.1 2.1a1 1 0 0 1-1.41 0l-3.7-3.7-5.58 5.58a1 1 0 1 1-1.41-1.41l5.58-5.58-3.7-3.7a1 1 0 0 1 0-1.41l2.1-2.1a1 1 0 0 1 .7-.3h2.55c.8 0 1.57-.32 2.12-.88l1.3-1.28Z"
              hideOnMobile
            />
            <HeaderTool
              label="Member List"
              path="M12 12.5a3.25 3.25 0 1 0 0-6.5a3.25 3.25 0 0 0 0 6.5Zm-6.25 0a2.75 2.75 0 1 0 0-5.5a2.75 2.75 0 0 0 0 5.5Zm12.5 0a2.75 2.75 0 1 0 0-5.5a2.75 2.75 0 0 0 0 5.5ZM12 14c-3.37 0-6.25 1.7-6.25 4.13c0 .48.39.87.88.87h10.74c.49 0 .88-.39.88-.87C18.25 15.7 15.37 14 12 14Zm-8.93 1.32C1.78 15.87 1 16.7 1 17.66c0 .37.3.67.67.67h2.8c-.06-.27-.09-.56-.09-.85c0-.82.27-1.56.69-2.16Zm17.86 0c.42.6.69 1.34.69 2.16c0 .29-.03.58-.1.85h2.81c.37 0 .67-.3.67-.67c0-.96-.78-1.79-2.07-2.34Z"
              hideOnMobile
            />
          </div>
          <div className="discord-transcript-header-search-slot" />
        </div>
      </div>
      {/* body */}
      {messages.map((message) => (
        <DiscordMessage message={message} context={{ messages, channel, callbacks, ...options }} key={message.id} />
      ))}
      {/* footer */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        {options.footerText
          ? options.footerText
              .replaceAll('{number}', messages.length.toString())
              .replaceAll('{s}', messages.length > 1 ? 's' : '')
          : `Exported ${messages.length} message${messages.length > 1 ? 's' : ''}.`}{' '}
        {options.poweredBy ? (
          <span style={{ textAlign: 'center' }}>
            Powered by{' '}
            <a href="https://github.com/wickstudio/discord.js-html-transcript" style={{ color: 'lightblue' }}>
              discord.js-html-transcript
            </a>
            .
          </span>
        ) : null}
      </div>
    </DiscordMessagesComponent>
  );
}
