import {
  type APIMessageComponentEmoji,
  type Guild,
  type GuildMember,
  type Message,
  type User,
  UserFlags,
} from 'discord.js';
import { parseDiscordEmoji } from './utils';

export type Profile = {
  author: string; // author of the message
  avatar?: string; // avatar of the author
  roleColor?: string; // role color of the author
  roleIcon?: string; // role color of the author
  roleName?: string; // role name of the author
  serverTagText?: string; // 1-4 character server tag text
  serverTagBadge?: string; // server tag badge URL
  serverTagGuildId?: string; // guild id backing the server tag

  bot?: boolean; // is the author a bot
  verified?: boolean; // is the author verified
};

export async function buildProfiles(messages: Message[]) {
  const profiles: Record<string, Profile> = {};
  const memberCache = new Map<string, Promise<GuildMember | null>>();
  const confirmedHumans = new Set<string>();

  const resolveMember = (
    guild: Guild | null,
    userId: string,
    fallbackMember?: GuildMember | null,
    isWebhook = false
  ) => {
    if (fallbackMember) {
      return Promise.resolve(fallbackMember);
    }

    if (!guild || isWebhook) {
      return Promise.resolve(null);
    }

    const cacheKey = `${guild.id}:${userId}`;
    const cached = memberCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const pending = guild.members.fetch(userId).catch(() => null);
    memberCache.set(cacheKey, pending);
    return pending;
  };

  for (const message of messages) {
    void resolveMember(message.guild ?? null, message.author.id, message.member, Boolean(message.webhookId));

    if (message.interaction) {
      void resolveMember(message.guild ?? null, message.interaction.user.id, null, false);
    }

    if (message.thread?.lastMessage) {
      void resolveMember(
        message.thread.lastMessage.guild ?? message.guild ?? null,
        message.thread.lastMessage.author.id,
        message.thread.lastMessage.member,
        Boolean(message.thread.lastMessage.webhookId)
      );
    }
  }

  // loop through messages
  for (const message of messages) {
    // add all users
    const author = message.author;
    const authorMember = await resolveMember(
      message.guild ?? null,
      author.id,
      message.member,
      Boolean(message.webhookId)
    );
    profiles[author.id] = mergeProfile(profiles[author.id], buildProfile(authorMember, author));

    if (!author.bot && !message.webhookId) {
      confirmedHumans.add(author.id);
    }

    // add interaction users
    if (message.interaction) {
      const user = message.interaction.user;
      const member = await resolveMember(message.guild ?? null, user.id);
      profiles[user.id] = mergeProfile(profiles[user.id], buildProfile(member, user));
    }

    // threads
    if (message.thread && message.thread.lastMessage) {
      const threadLastMessage = message.thread.lastMessage;
      const member = await resolveMember(
        threadLastMessage.guild ?? message.guild ?? null,
        threadLastMessage.author.id,
        threadLastMessage.member,
        Boolean(threadLastMessage.webhookId)
      );
      profiles[threadLastMessage.author.id] = mergeProfile(
        profiles[threadLastMessage.author.id],
        buildProfile(member, threadLastMessage.author)
      );
    }
  }

  for (const message of messages) {
    const author = message.author;
    const profile = profiles[author.id];
    if (!profile || !profile.bot || profile.verified) continue;

    if (confirmedHumans.has(author.id)) {
      profile.bot = false;
    }
  }

  return profiles;
}

function mergeProfile(existing: Profile | undefined, next: Profile): Profile {
  if (!existing) {
    return next;
  }

  const nextRoleColor = next.roleColor && next.roleColor !== '#000000' ? next.roleColor : undefined;
  const existingRoleColor = existing.roleColor && existing.roleColor !== '#000000' ? existing.roleColor : undefined;

  return {
    author: next.author || existing.author,
    avatar: next.avatar ?? existing.avatar,
    roleColor: nextRoleColor ?? existingRoleColor,
    roleIcon: next.roleIcon ?? existing.roleIcon,
    roleName: next.roleName ?? existing.roleName,
    serverTagText: next.serverTagText ?? existing.serverTagText,
    serverTagBadge: next.serverTagBadge ?? existing.serverTagBadge,
    serverTagGuildId: next.serverTagGuildId ?? existing.serverTagGuildId,
    bot: next.bot ?? existing.bot,
    verified: next.verified ?? existing.verified,
  };
}

function buildProfile(member: GuildMember | null, author: User) {
  const serverTag = getServerTag(author);
  const roleIconRole = member?.roles.icon;
  const roleColor =
    member?.displayHexColor && member.displayHexColor !== '#000000' ? member.displayHexColor : undefined;

  return {
    author: member?.nickname ?? author.displayName ?? author.username,
    avatar: member?.displayAvatarURL({ size: 64 }) ?? author.displayAvatarURL({ size: 64 }),
    roleColor,
    roleIcon: getRoleIconUrl(roleIconRole),
    roleName: roleIconRole?.name || member?.roles.hoist?.name || member?.roles.highest?.name || undefined,
    serverTagText: serverTag?.text,
    serverTagBadge: serverTag?.badge,
    serverTagGuildId: serverTag?.guildId,
    bot: author.bot,
    verified: author.flags?.has(UserFlags.VerifiedBot),
  };
}

function getRoleIconUrl(role: GuildMember['roles']['icon'] | undefined) {
  if (!role) {
    return undefined;
  }

  return (
    role.iconURL({ size: 32 }) ??
    (role.unicodeEmoji
      ? parseDiscordEmoji({
          name: role.unicodeEmoji,
        } as APIMessageComponentEmoji)
      : undefined)
  );
}

function getServerTag(author: User): { text: string; badge?: string; guildId?: string } | undefined {
  const user = author as User & {
    primaryGuild?: {
      identityEnabled?: boolean | null;
      identityGuildId?: string | null;
      tag?: string | null;
    } | null;
    guildTagBadgeURL?: (options?: { size?: number }) => string | null;
  };

  const primaryGuild = user.primaryGuild;
  if (!primaryGuild || primaryGuild.identityEnabled !== true || !primaryGuild.tag) {
    return undefined;
  }

  const text = primaryGuild.tag.trim().slice(0, 4);
  if (!text) {
    return undefined;
  }

  const badge =
    typeof user.guildTagBadgeURL === 'function' ? (user.guildTagBadgeURL({ size: 32 }) ?? undefined) : undefined;

  return {
    text,
    badge,
    guildId: primaryGuild.identityGuildId ?? undefined,
  };
}
