import {
  DiscordBold,
  DiscordCodeBlock,
  DiscordCustomEmoji,
  DiscordInlineCode,
  DiscordInvite,
  DiscordItalic,
  DiscordMention,
  DiscordQuote,
  DiscordSpoiler,
  DiscordUnderlined,
} from '@derockdev/discord-components-react';
import parse, { type RuleTypesExtended } from 'discord-markdown-parser';
import { ChannelType, type APIMessageComponentEmoji } from 'discord.js';
import React from 'react';
import type { ASTNode } from 'simple-markdown';
import { ASTNode as MessageASTNodes } from 'simple-markdown';
import type { SingleASTNode } from 'simple-markdown';
import type { RenderMessageContext } from '../';
import { parseDiscordEmoji } from '../../utils/utils';

export enum RenderType {
  EMBED,
  REPLY,
  NORMAL,
  WEBHOOK,
}

type RenderContentContext = RenderMessageContext & {
  type: RenderType;

  _internal?: {
    largeEmojis?: boolean;
  };
};

const TIMESTAMP_LOCALE = 'en-GB';
const DISCORD_ANSI_FOREGROUND: Record<number, string> = {
  30: '#4e5058',
  31: '#dc322f',
  32: '#859900',
  33: '#b58900',
  34: '#268bd2',
  35: '#d33682',
  36: '#2aa198',
  37: '#ffffff',
  90: '#4e5058',
  91: '#dc322f',
  92: '#859900',
  93: '#b58900',
  94: '#268bd2',
  95: '#d33682',
  96: '#2aa198',
  97: '#ffffff',
};
const DISCORD_ANSI_BACKGROUND: Record<number, string> = {
  40: '#002b36',
  41: '#cb4b16',
  42: '#586e75',
  43: '#657b83',
  44: '#839496',
  45: '#6c71c4',
  46: '#93a1a1',
  47: '#fdf6e3',
  100: '#002b36',
  101: '#cb4b16',
  102: '#586e75',
  103: '#657b83',
  104: '#839496',
  105: '#6c71c4',
  106: '#93a1a1',
  107: '#fdf6e3',
};
// eslint-disable-next-line no-control-regex
const ANSI_ESCAPE_SEQUENCE = /\u001b\[([0-9;]*)m/g;

type DiscordAnsiState = {
  backgroundColor?: string;
  bold?: boolean;
  color?: string;
  underline?: boolean;
};

function getDefaultAnsiState(): DiscordAnsiState {
  return {
    backgroundColor: undefined,
    bold: false,
    color: undefined,
    underline: false,
  };
}

function parseAnsiCodes(sequence: string) {
  if (!sequence) {
    return [0];
  }

  return sequence
    .split(';')
    .map((part) => Number.parseInt(part, 10))
    .filter((part) => Number.isFinite(part));
}

function applyAnsiCodes(state: DiscordAnsiState, codes: number[]) {
  const nextState = { ...state };

  for (const code of codes.length > 0 ? codes : [0]) {
    switch (code) {
      case 0:
        Object.assign(nextState, getDefaultAnsiState());
        break;
      case 1:
        nextState.bold = true;
        break;
      case 4:
        nextState.underline = true;
        break;
      case 22:
        nextState.bold = false;
        break;
      case 24:
        nextState.underline = false;
        break;
      case 39:
        nextState.color = undefined;
        break;
      case 49:
        nextState.backgroundColor = undefined;
        break;
      default:
        if (DISCORD_ANSI_FOREGROUND[code]) {
          nextState.color = DISCORD_ANSI_FOREGROUND[code];
        } else if (DISCORD_ANSI_BACKGROUND[code]) {
          nextState.backgroundColor = DISCORD_ANSI_BACKGROUND[code];
        }
        break;
    }
  }

  return nextState;
}

function getAnsiSegments(content: string) {
  const segments: Array<{ state: DiscordAnsiState; text: string }> = [];
  let state = getDefaultAnsiState();
  let lastIndex = 0;

  ANSI_ESCAPE_SEQUENCE.lastIndex = 0;

  for (let match = ANSI_ESCAPE_SEQUENCE.exec(content); match !== null; match = ANSI_ESCAPE_SEQUENCE.exec(content)) {
    if (match.index > lastIndex) {
      segments.push({
        state: { ...state },
        text: content.slice(lastIndex, match.index),
      });
    }

    state = applyAnsiCodes(state, parseAnsiCodes(match[1] ?? ''));
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({
      state: { ...state },
      text: content.slice(lastIndex),
    });
  }

  return segments;
}

function getAnsiStyle(state: DiscordAnsiState): React.CSSProperties {
  return {
    ...(state.backgroundColor ? { backgroundColor: state.backgroundColor } : {}),
    ...(state.bold ? { fontWeight: 700 } : {}),
    ...(state.color ? { color: state.color } : {}),
    ...(state.underline ? { textDecoration: 'underline' } : {}),
  };
}

function DiscordAnsiCodeBlock({ content }: { content: string }) {
  const segments = getAnsiSegments(content);

  return (
    <pre className="discord-code-block-pre discord-code-block-pre--multiline discord-ansi-code-block">
      <code className="discord-ansi-code">
        {segments.map((segment, index) =>
          segment.text.length > 0 ? (
            <span key={index} style={getAnsiStyle(segment.state)}>
              {segment.text}
            </span>
          ) : null
        )}
      </code>
    </pre>
  );
}

function formatTwoDigitDate(date: Date) {
  return new Intl.DateTimeFormat(TIMESTAMP_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function formatTime(date: Date, includeSeconds = false) {
  return new Intl.DateTimeFormat(TIMESTAMP_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' } : {}),
    hour12: false,
  }).format(date);
}

function formatLongDate(date: Date, withWeekday = false) {
  return new Intl.DateTimeFormat(TIMESTAMP_LOCALE, {
    ...(withWeekday ? { weekday: 'long' } : {}),
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatRelativeTime(target: Date) {
  const differenceMs = target.getTime() - Date.now();
  const isFuture = differenceMs > 0;
  const absoluteMs = Math.abs(differenceMs);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  const toLabel = (value: number, unit: string) => {
    const label = `${value} ${unit}${value === 1 ? '' : 's'}`;
    return isFuture ? `in ${label}` : `${label} ago`;
  };

  if (absoluteMs < minute) {
    const seconds = Math.max(1, Math.floor(absoluteMs / 1000));
    return toLabel(seconds, 'second');
  }

  if (absoluteMs < hour) {
    return toLabel(Math.floor(absoluteMs / minute), 'minute');
  }

  if (absoluteMs < day) {
    return toLabel(Math.floor(absoluteMs / hour), 'hour');
  }

  if (absoluteMs < month) {
    return toLabel(Math.max(1, Math.round(absoluteMs / day)), 'day');
  }

  if (absoluteMs < year) {
    return toLabel(Math.max(1, Math.round(absoluteMs / month)), 'month');
  }

  return toLabel(Math.max(1, Math.round(absoluteMs / year)), 'year');
}

function formatDiscordTimestamp(timestamp: number, format: string) {
  const date = new Date(timestamp);

  switch (format) {
    case 't':
      return formatTime(date);
    case 'T':
      return formatTime(date, true);
    case 'd':
      return formatTwoDigitDate(date);
    case 'D':
      return formatLongDate(date);
    case 'f':
      return `${formatLongDate(date)} ${formatTime(date)}`;
    case 'F':
      return `${formatLongDate(date, true)} ${formatTime(date)}`;
    case 'R':
      return formatRelativeTime(date);
    default:
      return `${formatLongDate(date, true)} ${formatTime(date)}`;
  }
}

export default async function MessageContent({ content, context }: { content: string; context: RenderContentContext }) {
  if (context.type === RenderType.REPLY && content.length > 180) content = content.slice(0, 180) + '...';

  const processedContent = content
    .replace(/^(\s{1,})- /gm, (_match, p1) => p1.replace(/ /g, '\u00A0') + '\u25E6 ')
    .replace(/^- /gm, '\u2022 ')
    .replace(/(?<!\/)(?:^|\s)(discord\.gg\/\S+)/gi, (match, invite) => match.replace(invite, `https://${invite}`));

  const parsed = parse(processedContent, 'extended');

  const isOnlyEmojis = parsed.every(
    (node) => ['emoji', 'twemoji'].includes(node.type) || (node.type === 'text' && node.content.trim().length === 0)
  );
  if (isOnlyEmojis) {
    const emojis = parsed.filter((node) => ['emoji', 'twemoji'].includes(node.type));
    if (emojis.length <= 25) {
      context._internal = {
        largeEmojis: true,
      };
    }
  }

  return <MessageASTNodes nodes={parsed} context={context} />;
}

async function MessageASTNodes({
  nodes,
  context,
}: {
  nodes: ASTNode;
  context: RenderContentContext;
}): Promise<React.JSX.Element> {
  if (Array.isArray(nodes)) {
    return (
      <>
        {nodes.map((node, i) => (
          <MessageSingleASTNode node={node} context={context} key={i} />
        ))}
      </>
    );
  } else {
    return <MessageSingleASTNode node={nodes} context={context} />;
  }
}

export async function MessageSingleASTNode({ node, context }: { node: SingleASTNode; context: RenderContentContext }) {
  if (!node) return null;

  const type = node.type as RuleTypesExtended;

  switch (type) {
    case 'text':
      return node.content;

    case 'link':
      return (
        <a href={node.target}>
          <MessageASTNodes nodes={node.content} context={context} />
        </a>
      );

    case 'url':
    case 'autolink': {
      const url = node.target ?? node.content?.[0]?.content;
      const text = node.target ? node.content : url;

      if (typeof url === 'string' && (url.includes('discord.gg/') || url.includes('discord.com/invite/'))) {
        const code = url.split('/').pop();
        if (code && context.callbacks.resolveInvite) {
          const invite = await context.callbacks.resolveInvite(code);
          if (invite) {
            const inviteIcon =
              invite.icon &&
              ((await context.callbacks.resolveTranscriptAssetUrl({
                kind: 'invite-icon',
                url: invite.icon,
              })) ??
                invite.icon);

            return (
              <div style={{ marginTop: '4px' }}>
                <a href={url} target="_blank" rel="noreferrer" style={{ color: '#00a8fc', textDecoration: 'none' }}>
                  {typeof text === 'string' ? text : <MessageASTNodes nodes={text} context={context} />}
                </a>
                <DiscordInvite
                  url={invite.url}
                  name={invite.name}
                  icon={inviteIcon ?? undefined}
                  online={invite.online}
                  members={invite.members}
                  joinBtn="Go to Server"
                  inviteTitle="YOU'VE BEEN INVITED TO JOIN A SERVER"
                />
              </div>
            );
          } else {
            return (
              <div style={{ marginTop: '4px' }}>
                <a href={url} target="_blank" rel="noreferrer" style={{ color: '#00a8fc', textDecoration: 'none' }}>
                  {typeof text === 'string' ? text : <MessageASTNodes nodes={text} context={context} />}
                </a>
                <div className="discord-invite" style={{ marginTop: '4px' }}>
                  <div className="discord-invite-header">You sent an invite, but...</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
                    <span style={{ fontSize: '24px' }}>✉️</span>
                    <div>
                      <div style={{ color: '#f23f42', fontWeight: 700, fontSize: '16px' }}>Invalid Invite</div>
                      <div style={{ color: '#b5bac1', fontSize: '14px' }}>Try sending a new invite!</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        }
      }

      return (
        <a href={url} target="_blank" rel="noreferrer" style={{ color: '#00a8fc', textDecoration: 'none' }}>
          {typeof text === 'string' ? text : <MessageASTNodes nodes={text} context={context} />}
        </a>
      );
    }

    case 'blockQuote':
      if (context.type === RenderType.REPLY) {
        return <MessageASTNodes nodes={node.content} context={context} />;
      }

      return (
        <DiscordQuote>
          <MessageASTNodes nodes={node.content} context={context} />
        </DiscordQuote>
      );

    case 'br':
    case 'newline':
      if (context.type === RenderType.REPLY) return ' ';
      return <br />;

    case 'channel': {
      const id = node.id as string;
      const channel = await context.callbacks.resolveChannel(id);

      return (
        <DiscordMention type={channel ? (channel.isDMBased() ? 'channel' : getChannelType(channel.type)) : 'channel'}>
          {channel ? (channel.isDMBased() ? 'DM Channel' : channel.name) : `<#${id}>`}
        </DiscordMention>
      );
    }

    case 'role': {
      const id = node.id as string;
      const role = await context.callbacks.resolveRole(id);

      return (
        <DiscordMention type="role" color={context.type === RenderType.REPLY ? undefined : role?.hexColor}>
          {role ? role.name : `deleted-role`}
        </DiscordMention>
      );
    }

    case 'user': {
      const id = node.id as string;
      const user = await context.callbacks.resolveUser(id);

      return <DiscordMention type="user">{user ? (user.displayName ?? user.username) : `Unknown User`}</DiscordMention>;
    }

    case 'here':
    case 'everyone':
      return (
        <DiscordMention type={'role'} highlight>
          {type}
        </DiscordMention>
      );

    case 'codeBlock':
      if (context.type !== RenderType.REPLY) {
        if (node.lang?.toLowerCase() === 'ansi') {
          return <DiscordAnsiCodeBlock content={node.content} />;
        }

        return <DiscordCodeBlock language={node.lang} code={node.content} />;
      }
      return <DiscordInlineCode>{node.content}</DiscordInlineCode>;

    case 'inlineCode':
      return <DiscordInlineCode>{node.content}</DiscordInlineCode>;

    case 'em':
      return (
        <DiscordItalic>
          <MessageASTNodes nodes={node.content} context={context} />
        </DiscordItalic>
      );

    case 'strong':
      return (
        <DiscordBold>
          <MessageASTNodes nodes={node.content} context={context} />
        </DiscordBold>
      );

    case 'underline':
      return (
        <DiscordUnderlined>
          <MessageASTNodes nodes={node.content} context={context} />
        </DiscordUnderlined>
      );

    case 'strikethrough':
      return (
        <s>
          <MessageASTNodes nodes={node.content} context={context} />
        </s>
      );

    case 'emoticon':
      return typeof node.content === 'string' ? (
        node.content
      ) : (
        <MessageASTNodes nodes={node.content} context={context} />
      );

    case 'spoiler':
      return (
        <DiscordSpoiler>
          <MessageASTNodes nodes={node.content} context={context} />
        </DiscordSpoiler>
      );

    case 'emoji':
    case 'twemoji': {
      const baseEmojiUrl = parseDiscordEmoji(node as APIMessageComponentEmoji);
      const emojiUrl =
        (await context.callbacks.resolveTranscriptAssetUrl({
          kind: 'emoji',
          url: baseEmojiUrl,
        })) ?? baseEmojiUrl;

      return (
        <DiscordCustomEmoji
          name={node.name}
          url={emojiUrl}
          embedEmoji={context.type === RenderType.EMBED}
          largeEmoji={context._internal?.largeEmojis}
        />
      );
    }

    case 'timestamp':
      return (
        <span className="discord-time">{formatDiscordTimestamp(parseInt(node.timestamp) * 1000, node.format)}</span>
      );

    case 'subtext':
      return (
        <span style={{ fontSize: '11px', color: '#B5BAC1', display: 'block', marginTop: '4px', lineHeight: 'normal' }}>
          <MessageASTNodes nodes={node.content} context={context} />
        </span>
      );

    case 'heading': {
      const level = node.level as number;

      const HeadingTag = `h${level}` as any;
      return (
        <HeadingTag style={{ margin: '8px 0', padding: 0, fontWeight: 'bold' }}>
          <MessageASTNodes nodes={node.content} context={context} />
        </HeadingTag>
      );
    }

    case 'list': {
      const items = node.items as any[];
      return (
        <>
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <span>{node.ordered ? `${node.start + i}. ` : '• '}</span>
              <MessageASTNodes nodes={item} context={context} />
              {i < items.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </>
      );
    }

    default: {
      console.log(`Unknown node type: ${type}`, node);
      return typeof node.content === 'string' ? (
        node.content
      ) : (
        <MessageASTNodes nodes={node.content} context={context} />
      );
    }
  }
}

export function getChannelType(channelType: ChannelType): 'channel' | 'voice' | 'thread' | 'forum' {
  switch (channelType) {
    case ChannelType.GuildCategory:
    case ChannelType.GuildAnnouncement:
    case ChannelType.GuildText:
    case ChannelType.DM:
    case ChannelType.GroupDM:
    case ChannelType.GuildDirectory:
    case ChannelType.GuildMedia:
      return 'channel';
    case ChannelType.GuildVoice:
    case ChannelType.GuildStageVoice:
      return 'voice';
    case ChannelType.PublicThread:
    case ChannelType.PrivateThread:
    case ChannelType.AnnouncementThread:
      return 'thread';
    case ChannelType.GuildForum:
      return 'forum';
    default:
      return 'channel';
  }
}
