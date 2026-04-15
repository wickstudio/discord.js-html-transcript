import {
  DiscordAttachments,
  DiscordCommand,
  DiscordMessage as DiscordMessageComponent,
  DiscordQuote,
  DiscordReaction,
  DiscordReactions,
  DiscordThread,
  DiscordThreadMessage,
} from '@derockdev/discord-components-react';
import { type APIMessage, type Message as MessageType } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '..';
import { parseDiscordEmoji } from '../../utils/utils';
import { Attachments } from './attachment';
import ComponentRow from './components';
import MessageContent, { RenderType } from './content';
import { DiscordEmbed } from './embed';
import MessageReply from './reply';
import DiscordSystemMessage from './systemMessage';
import DiscordPoll from './components/poll';

export default async function DiscordMessage({
  message,
  context,
}: {
  message: MessageType;
  context: RenderMessageContext;
}) {
  if (message.system) return <DiscordSystemMessage message={message} context={context} />;

  const hasSnapshots = Boolean((message as any).messageSnapshots?.size);
  const isForwarded = Boolean(
    (message.flags && (message.flags.bitfield & 16384) === 16384) ||
      (message.reference as any)?.type === 2 ||
      hasSnapshots
  );
  const isCrosspost = Boolean(
    !isForwarded && message.reference?.guildId && message.reference.guildId !== message.guild?.id
  );
  const reactions = await Promise.all(
    Array.from(message.reactions.cache.values()).map(async (reaction, id) => (
      <DiscordReaction
        key={`${message.id}r${id}`}
        name={reaction.emoji.name!}
        emoji={
          (await context.callbacks.resolveTranscriptAssetUrl({
            kind: 'emoji',
            url: parseDiscordEmoji(reaction.emoji),
            message: message.toJSON() as APIMessage,
          })) ?? parseDiscordEmoji(reaction.emoji)
        }
        count={reaction.count}
      />
    ))
  );

  return (
    <DiscordMessageComponent
      id={`m-${message.id}`}
      timestamp={message.createdAt.toISOString()}
      key={message.id}
      edited={message.editedAt !== null}
      {...(isCrosspost ? { server: true } : {})}
      highlight={message.mentions.everyone}
      profile={message.author.id}
    >
      {/* reply */}
      <MessageReply message={message} context={context} />

      {/* slash command */}
      {message.interaction && (
        <DiscordCommand
          slot="reply"
          profile={message.interaction.user.id}
          command={'/' + message.interaction.commandName}
        />
      )}

      {(() => {
        const snapshot = hasSnapshots ? (message as any).messageSnapshots?.first?.() : null;

        if (isForwarded) {
          const snapshotMsg = snapshot || message; // Fallback to current message if snapshot fails
          const snapshotEmbeds = Array.isArray(snapshotMsg.embeds) ? snapshotMsg.embeds : [];
          const snapshotComponents = Array.isArray(snapshotMsg.components) ? snapshotMsg.components : [];

          return (
            <DiscordQuote>
              <div className="discord-forwarding-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    fill="currentColor"
                    d="M12.793 4.93175C12.793 4.10264 13.7845 3.67499 14.3879 4.24647L21.4646 10.9502C21.8211 11.288 21.8211 11.854 21.4646 12.1918L14.3879 18.8955C13.7845 19.467 12.793 19.0393 12.793 18.2102V15.008C7.58782 15.008 3.84478 16.5163 2.14691 20.3159C1.86518 20.9463 0.941961 20.6559 1.10091 19.982C2.41724 14.4011 5.95251 11.2588 12.793 10.7481V4.93175Z"
                  />
                </svg>
                <span>Forwarded</span>
              </div>
              {snapshotMsg.content && (
                <MessageContent
                  content={snapshotMsg.content}
                  context={{ ...context, type: snapshotMsg.webhookId ? RenderType.WEBHOOK : RenderType.NORMAL }}
                />
              )}
              {snapshotEmbeds.map((embed: any, id: number) => (
                <DiscordEmbed
                  embed={embed}
                  context={{ ...context, index: id, message: snapshotMsg as MessageType }}
                  forceStatic
                  key={id}
                />
              ))}
              {snapshotMsg.poll && <DiscordPoll poll={snapshotMsg.poll} context={context} />}
              {snapshotComponents.length > 0 && (
                <DiscordAttachments>
                  {snapshotComponents.map((component: any, id: number) => (
                    <ComponentRow key={id} id={id} component={component} context={context} />
                  ))}
                </DiscordAttachments>
              )}
              {snapshotMsg.attachments && <Attachments message={snapshotMsg} context={context} inline />}
              <div style={{ color: '#949ba4', fontSize: '12px', marginTop: '4px', fontWeight: 500 }}>
                {snapshotMsg.channel?.name ? '#' + snapshotMsg.channel.name + ' • ' : ''}
                {(snapshotMsg.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </DiscordQuote>
          );
        }

        return message.content ? (
          <MessageContent
            content={message.content}
            context={{ ...context, type: message.webhookId ? RenderType.WEBHOOK : RenderType.NORMAL }}
          />
        ) : null;
      })()}

      {/* message embeds */}
      {!isForwarded &&
        message.embeds.map((embed, id) => (
          <DiscordEmbed embed={embed} context={{ ...context, index: id, message }} key={id} />
        ))}

      {/* message poll */}
      {!isForwarded && message.poll && <DiscordPoll poll={message.poll} context={context} />}

      {/* components */}
      {!isForwarded && message.components.length > 0 && (
        <DiscordAttachments slot="components">
          {message.components.map((component, id) => (
            <ComponentRow key={id} id={id} component={component} context={context} />
          ))}
        </DiscordAttachments>
      )}

      {/* attachments */}
      {!isForwarded && <Attachments message={message} context={context} />}

      {/* reactions */}
      {message.reactions.cache.size > 0 && <DiscordReactions slot="reactions">{reactions}</DiscordReactions>}

      {/* threads */}
      {message.hasThread && message.thread && (
        <DiscordThread
          slot="thread"
          name={message.thread.name}
          cta={
            message.thread.messageCount
              ? `${message.thread.messageCount} Message${message.thread.messageCount > 1 ? 's' : ''}`
              : 'View Thread'
          }
        >
          {message.thread.lastMessage ? (
            <DiscordThreadMessage profile={message.thread.lastMessage.author.id}>
              <MessageContent
                content={
                  message.thread.lastMessage.content.length > 128
                    ? message.thread.lastMessage.content.substring(0, 125) + '...'
                    : message.thread.lastMessage.content
                }
                context={{ ...context, type: RenderType.REPLY }}
              />
            </DiscordThreadMessage>
          ) : (
            `Thread messages not saved.`
          )}
        </DiscordThread>
      )}
    </DiscordMessageComponent>
  );
}
