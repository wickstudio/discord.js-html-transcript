import { AttachmentBuilder, version, Collection, type Channel, type Message, type TextBasedChannel } from 'discord.js';
import DiscordMessages from './generator';
import {
  ExportReturnType,
  type CreateTranscriptOptions,
  type GenerateFromMessagesOptions,
  type ObjectType,
  type TranscriptAsset,
} from './types';
import { TranscriptImageDownloader, type ResolveImageCallback } from './downloader/images';
import { TranscriptAssetDownloader } from './downloader/assets';
import { hasSavedAssetsEnabled, resolveAssetOptions, resolveFeatureOptions, shouldSaveAsset } from './options';

// re-exports
export { default as DiscordMessages } from './generator/transcript';
export { TranscriptImageDownloader } from './downloader/images';
export { TranscriptAssetDownloader } from './downloader/assets';

// version check
const versionPrefix = version.split('.')[0];

if (versionPrefix !== '14' && versionPrefix !== '15') {
  console.error(
    `[discord-html-transcripts] Versions v3.x.x of discord-html-transcripts are only compatible with discord.js v14.x.x and v15.x.x, and you are using v${version}.` +
      `    For v13.x.x support, please install discord-html-transcripts v2.x.x using "npm install discord-html-transcripts@^2".`
  );
  process.exit(1);
}

/**
 *
 * @param messages The messages to generate a transcript from
 * @param channel  The channel the messages are from (used for header and guild name)
 * @param options  The options to use when generating the transcript
 * @returns        The generated transcript
 */
export async function generateFromMessages<T extends ExportReturnType = ExportReturnType.Attachment>(
  messages: Message[] | Collection<string, Message>,
  channel: Channel,
  options: GenerateFromMessagesOptions<T> = {}
): Promise<ObjectType<T>> {
  const transformedMessages = messages instanceof Collection ? Array.from(messages.values()) : messages;
  const resolvedFeatures = resolveFeatureOptions(options.features);
  const resolvedAssets = resolveAssetOptions({
    saveImages: options.saveImages,
    saveAssets: options.saveAssets,
    assets: options.assets,
  });

  let resolveImageSrc: ResolveImageCallback | undefined = options.callbacks?.resolveImageSrc;
  if (options.saveImages) {
    if (resolveImageSrc) {
      console.warn(
        `[discord-html-transcripts] You have specified both saveImages and resolveImageSrc, please only specify one. resolveImageSrc will be used.`
      );
    } else {
      resolveImageSrc = new TranscriptImageDownloader().build();
    }
  }

  let resolveAssetSrc = options.callbacks?.resolveAssetSrc;
  if (hasSavedAssetsEnabled(resolvedAssets) && !resolveAssetSrc) {
    resolveAssetSrc = new TranscriptAssetDownloader().build();
  }

  const resolveTranscriptAssetUrl = async (asset: TranscriptAsset) => {
    if (!asset.url || asset.url.startsWith('data:')) {
      return asset.url;
    }

    if (!shouldSaveAsset(asset.kind, resolvedAssets)) {
      return asset.url;
    }

    const resolved = await resolveAssetSrc?.(asset);
    return resolved !== null ? (resolved ?? asset.url) : asset.url;
  };

  const html = await DiscordMessages({
    messages: transformedMessages,
    channel,
    assets: resolvedAssets,
    features: resolvedFeatures,
    callbacks: {
      resolveImageSrc,
      resolveAssetSrc,
      resolveTranscriptAssetUrl,
      resolveChannel: async (id) => channel.client.channels.fetch(id).catch(() => null),
      resolveUser: async (id) => channel.client.users.fetch(id).catch(() => null),
      resolveRole: channel.isDMBased() ? () => null : async (id) => channel.guild?.roles.fetch(id).catch(() => null),
      resolveInvite: async (code) => {
        try {
          const invite = await channel.client.fetchInvite(code);
          return {
            name: invite.guild?.name ?? 'Unknown Server',
            icon: invite.guild?.iconURL({ size: 64 }) ?? null,
            online: invite.presenceCount ?? 0,
            members: invite.memberCount ?? 0,
            url: `https://discord.gg/${code}`,
          };
        } catch {
          return null;
        }
      },

      ...(options.callbacks ?? {}),
    },
    poweredBy: options.poweredBy ?? true,
    footerText: options.footerText ?? 'Exported {number} message{s}.',
    favicon: options.favicon ?? 'guild',
    hydrate: options.hydrate ?? false,
  });

  if (options.returnType === ExportReturnType.Buffer) {
    return Buffer.from(html) as unknown as ObjectType<T>;
  }

  if (options.returnType === ExportReturnType.String) {
    return html as unknown as ObjectType<T>;
  }

  return new AttachmentBuilder(Buffer.from(html), {
    name: options.filename ?? `transcript-${channel.id}.html`,
  }) as unknown as ObjectType<T>;
}

/**
 *
 * @param channel The channel to create a transcript from
 * @param options The options to use when creating the transcript
 * @returns       The generated transcript
 */
export async function createTranscript<T extends ExportReturnType = ExportReturnType.Attachment>(
  channel: TextBasedChannel,
  options: CreateTranscriptOptions<T> = {}
): Promise<ObjectType<T>> {
  if (!channel.isTextBased()) {
    // @ts-expect-error(2339): run-time check
    throw new TypeError(`Provided channel must be text-based, received ${channel.type}`);
  }

  let allMessages: Message[] = [];
  let lastMessageId: string | undefined;
  const { limit, filter } = options;
  const resolvedLimit = typeof limit === 'undefined' || limit === -1 ? Infinity : limit;

  while (true) {
    const fetchLimitOptions = { limit: 100, before: lastMessageId };
    if (!lastMessageId) delete fetchLimitOptions.before;

    const messages = await channel.messages.fetch(fetchLimitOptions);
    const filteredMessages = typeof filter === 'function' ? messages.filter(filter) : messages;

    allMessages.push(...filteredMessages.values());
    lastMessageId = messages.lastKey();

    // if there are no more messages, break
    if (messages.size < 100) break;

    // if the limit has been reached, break
    if (allMessages.length >= resolvedLimit) break;
  }

  if (resolvedLimit < allMessages.length) allMessages = allMessages.slice(0, limit);

  return generateFromMessages<T>(allMessages.reverse(), channel, options);
}

export default {
  createTranscript,
  generateFromMessages,
};
export * from './types';
