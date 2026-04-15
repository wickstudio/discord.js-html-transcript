import { type Awaitable, type Channel, type Message, type Role, type User } from 'discord.js';
import { prerenderToNodeStream } from 'react-dom/static';
import React from 'react';
import { buildProfiles } from '../utils/buildProfiles';
import type { Profile } from '../utils/buildProfiles';
import {
  applyServerTags,
  enableImagePreview,
  enableMessageSearch,
  fixEmbedBorders,
  revealSpoiler,
  scrollToMessage,
} from '../static/client';
import { readFileSync } from 'fs';
import path from 'path';
import { renderToString } from '@derockdev/discord-components-core/hydrate';
import DiscordMessages from './transcript';
import type { ResolveAssetCallback, ResolveImageCallback, TranscriptAsset, TranscriptInviteData } from '../types';
import type { ResolvedTranscriptAssetOptions, ResolvedTranscriptFeatureOptions } from '../options';
import { streamToString } from '../utils/utils';

// read the package.json file and get the @derockdev/discord-components-core version
let discordComponentsVersion = '^3.6.1';

try {
  const packagePath = path.join(__dirname, '..', '..', 'package.json');
  const packageJSON = JSON.parse(readFileSync(packagePath, 'utf8'));
  discordComponentsVersion = packageJSON.dependencies['@derockdev/discord-components-core'] ?? discordComponentsVersion;
  // eslint-disable-next-line no-empty
} catch {} // ignore errors

export type RenderMessageContext = {
  messages: Message[];
  channel: Channel;
  guildIcon?: string;

  callbacks: {
    resolveImageSrc?: ResolveImageCallback;
    resolveAssetSrc?: ResolveAssetCallback;
    resolveTranscriptAssetUrl: (asset: TranscriptAsset) => Promise<string | undefined>;
    resolveChannel: (channelId: string) => Awaitable<Channel | null>;
    resolveUser: (userId: string) => Awaitable<User | null>;
    resolveRole: (roleId: string) => Awaitable<Role | null>;
    resolveInvite: (code: string) => Awaitable<TranscriptInviteData | null>;
  };

  assets: ResolvedTranscriptAssetOptions;
  features: ResolvedTranscriptFeatureOptions;
  poweredBy?: boolean;
  footerText?: string;
  favicon: 'guild' | string;
  hydrate: boolean;
};

async function resolveOptionalAssetUrl(
  resolveTranscriptAssetUrl: RenderMessageContext['callbacks']['resolveTranscriptAssetUrl'],
  asset: TranscriptAsset | undefined
) {
  if (!asset?.url) {
    return undefined;
  }

  return (await resolveTranscriptAssetUrl(asset)) ?? asset.url;
}

async function resolveProfiles(
  profiles: Record<string, Profile>,
  resolveTranscriptAssetUrl: RenderMessageContext['callbacks']['resolveTranscriptAssetUrl']
) {
  const entries = await Promise.all(
    Object.entries(profiles).map(async ([id, profile]) => [
      id,
      {
        ...profile,
        avatar: await resolveOptionalAssetUrl(resolveTranscriptAssetUrl, {
          kind: 'avatar',
          url: profile.avatar ?? '',
        }),
        roleIcon: await resolveOptionalAssetUrl(resolveTranscriptAssetUrl, {
          kind: 'role-icon',
          url: profile.roleIcon ?? '',
        }),
        serverTagBadge: await resolveOptionalAssetUrl(resolveTranscriptAssetUrl, {
          kind: 'server-tag-badge',
          url: profile.serverTagBadge ?? '',
        }),
      } satisfies Profile,
    ])
  );

  return Object.fromEntries(entries);
}

export default async function render({ messages, channel, callbacks, ...options }: RenderMessageContext) {
  const rawProfiles = await buildProfiles(messages);
  const profiles = await resolveProfiles(rawProfiles, callbacks.resolveTranscriptAssetUrl);
  const guildIcon =
    channel.isDMBased() || options.guildIcon
      ? options.guildIcon
      : await resolveOptionalAssetUrl(callbacks.resolveTranscriptAssetUrl, {
          kind: 'guild-icon',
          url: channel.guild.iconURL({ size: 128, extension: 'png' }) ?? '',
        });

  const { prelude } = await prerenderToNodeStream(
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* favicon */}
        <link rel="icon" type="image/png" href={options.favicon === 'guild' ? guildIcon : options.favicon} />

        {/* title */}
        <title>{channel.isDMBased() ? 'Direct Messages' : channel.name}</title>

        {/* message reference handler */}
        {options.features.messageLinks && (
          <script
            dangerouslySetInnerHTML={{
              __html: scrollToMessage,
            }}
          />
        )}

        {/* profiles */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(window.$discordMessage=window.$discordMessage||{}).profiles=${JSON.stringify(profiles)};`,
          }}
        ></script>

        {!options.hydrate && (
          <>
            {/* component library */}
            <script
              type="module"
              src={`https://cdn.jsdelivr.net/npm/@derockdev/discord-components-core@${discordComponentsVersion}/dist/derockdev-discord-components-core/derockdev-discord-components-core.esm.js`}
            ></script>
          </>
        )}
      </head>

      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#070709',
        }}
        data-transcript-image-preview={options.features.imagePreview ? 'true' : undefined}
      >
        <DiscordMessages
          messages={messages}
          channel={channel}
          callbacks={callbacks}
          guildIcon={guildIcon}
          {...options}
        />
      </body>

      {options.features.spoilerReveal && <script dangerouslySetInnerHTML={{ __html: revealSpoiler }}></script>}

      {options.features.profileBadges && <script dangerouslySetInnerHTML={{ __html: applyServerTags }}></script>}

      {options.features.imagePreview && <script dangerouslySetInnerHTML={{ __html: enableImagePreview }}></script>}

      {options.features.search && <script dangerouslySetInnerHTML={{ __html: enableMessageSearch }}></script>}

      {options.features.embedTweaks && <script dangerouslySetInnerHTML={{ __html: fixEmbedBorders }}></script>}
    </html>
  );

  const markup = await streamToString(prelude);

  if (options.hydrate) {
    const result = await renderToString(markup, {
      beforeHydrate: async (document) => {
        document.defaultView.$discordMessage = {
          profiles,
        };
      },
    });

    return result.html;
  }

  return markup;
}
