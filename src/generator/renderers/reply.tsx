import { DiscordReply } from '@derockdev/discord-components-react';
import { type APIMessage, type Message, UserFlags } from 'discord.js';
import type { RenderMessageContext } from '..';
import React from 'react';
import MessageContent, { RenderType } from './content';

export default async function MessageReply({ message, context }: { message: Message; context: RenderMessageContext }) {
  if (!message.reference) return null;
  if (
    (message.flags && (message.flags.bitfield & 16384) === 16384) ||
    (message.reference as any).type === 2 ||
    ((message as any).messageSnapshots && (message as any).messageSnapshots.size > 0)
  )
    return null;

  if (message.reference.guildId !== message.guild?.id) return null;

  const referencedMessage = context.messages.find((m) => m.id === message.reference!.messageId);

  if (!referencedMessage) return <DiscordReply slot="reply">Message could not be loaded.</DiscordReply>;

  const referencedMember =
    referencedMessage.member ??
    (referencedMessage.guild && !referencedMessage.webhookId
      ? await referencedMessage.guild.members.fetch(referencedMessage.author.id).catch(() => null)
      : null);

  const isCrossPost = Boolean(
    referencedMessage.reference?.guildId && referencedMessage.reference.guildId !== message.guild?.id
  );
  const isCommand = referencedMessage.interaction !== null;
  const replyAvatar =
    referencedMember?.displayAvatarURL({ size: 32 }) ?? referencedMessage.author.avatarURL({ size: 32 }) ?? undefined;

  return (
    <DiscordReply
      slot="reply"
      profile={referencedMessage.author.id}
      edited={!isCommand && referencedMessage.editedAt !== null}
      attachment={referencedMessage.attachments.size > 0}
      author={referencedMember?.nickname ?? referencedMessage.author.displayName ?? referencedMessage.author.username}
      avatar={
        replyAvatar
          ? ((await context.callbacks.resolveTranscriptAssetUrl({
              kind: 'avatar',
              url: replyAvatar,
              message: referencedMessage.toJSON() as APIMessage,
            })) ?? replyAvatar)
          : undefined
      }
      roleColor={
        referencedMember?.displayHexColor && referencedMember.displayHexColor !== '#000000'
          ? referencedMember.displayHexColor
          : undefined
      }
      bot={!isCrossPost && referencedMessage.author.bot}
      verified={referencedMessage.author.flags?.has(UserFlags.VerifiedBot)}
      op={message?.channel?.isThread?.() && referencedMessage.author.id === message?.channel?.ownerId}
      {...(isCrossPost ? { server: true } : {})}
      command={isCommand}
    >
      {referencedMessage.content ? (
        <span data-goto={referencedMessage.id}>
          <MessageContent content={referencedMessage.content} context={{ ...context, type: RenderType.REPLY }} />
        </span>
      ) : isCommand ? (
        <em data-goto={referencedMessage.id}>Click to see command.</em>
      ) : (
        <em data-goto={referencedMessage.id}>Click to see attachment.</em>
      )}
    </DiscordReply>
  );
}
