import {
  DiscordEmbed as DiscordEmbedComponent,
  DiscordEmbedDescription,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordEmbedFooter,
} from '@derockdev/discord-components-react';
import type { APIMessage, Message } from 'discord.js';
import React from 'react';
import type { RenderMessageContext } from '..';
import type { TranscriptAssetKind } from '../../types';
import { calculateInlineIndex } from '../../utils/embeds';
import MessageContent, { RenderType } from './content';

type RenderEmbedContext = RenderMessageContext & {
  index: number;
  message: Message;
};

type EmbedLike = {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  hexColor?: string | null;
  color?: number | null;
  provider?: { name?: string | null } | null;
  author?: {
    name?: string | null;
    url?: string | null;
    iconURL?: string | null;
    proxyIconURL?: string | null;
    icon_url?: string | null;
    proxy_icon_url?: string | null;
  } | null;
  footer?: {
    text?: string | null;
    iconURL?: string | null;
    proxyIconURL?: string | null;
    icon_url?: string | null;
    proxy_icon_url?: string | null;
  } | null;
  image?: { url?: string | null; proxyURL?: string | null; proxy_url?: string | null } | null;
  thumbnail?: { url?: string | null; proxyURL?: string | null; proxy_url?: string | null } | null;
  video?: { url?: string | null; proxyURL?: string | null; proxy_url?: string | null } | null;
  timestamp?: string | number | Date | null;
};

function getStringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getMediaUrl(
  media: { proxyURL?: string | null; proxy_url?: string | null; url?: string | null } | null | undefined
) {
  return getStringValue(media?.proxyURL) ?? getStringValue(media?.proxy_url) ?? getStringValue(media?.url);
}

function getColor(embed: EmbedLike) {
  if (getStringValue(embed.hexColor)) {
    return embed.hexColor ?? undefined;
  }

  if (typeof embed.color === 'number') {
    return `#${embed.color.toString(16).padStart(6, '0')}`;
  }

  return undefined;
}

function getTimestamp(value: unknown) {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value).toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return undefined;
}

function getFooterTimestampText(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

async function resolveEmbedAssetUrl(context: RenderEmbedContext, kind: TranscriptAssetKind, url: string | undefined) {
  if (!url) {
    return undefined;
  }

  return (
    (await context.callbacks.resolveTranscriptAssetUrl({
      kind,
      url,
      message: context.message.toJSON() as APIMessage,
    })) ?? url
  );
}

function stripWrappedBold(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
    return trimmed.slice(2, -2);
  }

  return content;
}

export async function DiscordEmbed({
  embed,
  context,
  forceStatic = false,
}: {
  embed: EmbedLike;
  context: RenderEmbedContext;
  forceStatic?: boolean;
}) {
  const title = getStringValue(embed.title);
  const description = getStringValue(embed.description);
  const providerName = getStringValue(embed.provider?.name);
  const authorName = getStringValue(embed.author?.name);
  const authorUrl = getStringValue(embed.author?.url);
  const authorImageUrl =
    getStringValue(embed.author?.proxyIconURL) ??
    getStringValue(embed.author?.proxy_icon_url) ??
    getStringValue(embed.author?.iconURL) ??
    getStringValue(embed.author?.icon_url);
  const embedUrl = getStringValue(embed.url);
  const videoUrl = getMediaUrl(embed.video);
  const thumbnailUrl = getMediaUrl(embed.thumbnail);
  const imageUrl = getMediaUrl(embed.image);
  const fields = Array.isArray(embed.fields) ? embed.fields : [];
  const footerText = getStringValue(embed.footer?.text);
  const footerImageUrl =
    getStringValue(embed.footer?.proxyIconURL) ??
    getStringValue(embed.footer?.proxy_icon_url) ??
    getStringValue(embed.footer?.iconURL) ??
    getStringValue(embed.footer?.icon_url);
  const footerTimestamp = getTimestamp(embed.timestamp);

  const isExternalVideo = Boolean(videoUrl && providerName);
  const [authorImage, resolvedVideoUrl, resolvedThumbnailUrl, resolvedImageUrl, footerImage] = await Promise.all([
    resolveEmbedAssetUrl(context, 'embed-author-icon', authorImageUrl),
    isExternalVideo ? Promise.resolve(videoUrl) : resolveEmbedAssetUrl(context, 'embed-video', videoUrl),
    resolveEmbedAssetUrl(context, 'embed-thumbnail', thumbnailUrl),
    resolveEmbedAssetUrl(context, 'embed-image', imageUrl),
    resolveEmbedAssetUrl(context, 'embed-footer-icon', footerImageUrl),
  ]);

  if (forceStatic) {
    return (
      <div className="discord-embed" key={`${context.message.id}-e-${context.index}`}>
        <div style={{ backgroundColor: getColor(embed) }} className="discord-left-border" />
        <div className="discord-embed-root">
          <div className="discord-embed-wrapper">
            <div className="discord-embed-grid">
              {providerName && <div className="discord-embed-provider">{providerName}</div>}

              {authorName && (
                <div className="discord-embed-author">
                  {authorImage ? <img src={authorImage} alt="" className="discord-author-image" /> : null}
                  {authorUrl ? (
                    <a href={authorUrl} target="_blank" rel="noopener noreferrer">
                      {authorName}
                    </a>
                  ) : (
                    authorName
                  )}
                </div>
              )}

              {title && (
                <div className="discord-embed-title">
                  {embedUrl ? (
                    <a href={embedUrl} target="_blank" rel="noopener noreferrer">
                      {title}
                    </a>
                  ) : (
                    title
                  )}
                </div>
              )}

              {description && !isExternalVideo && (
                <div className="discord-embed-description">
                  <MessageContent content={description} context={{ ...context, type: RenderType.EMBED }} />
                </div>
              )}

              {fields.length > 0 && (
                <div className="discord-embed-fields">
                  {fields.map((field, id) => {
                    const inlineIndex = calculateInlineIndex(fields, id);
                    const className = [
                      'discord-embed-field',
                      field.inline ? 'discord-embed-inline-field' : '',
                      field.inline ? `discord-embed-inline-field-${inlineIndex}` : '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return (
                      <div key={`${context.message.id}-e-${context.index}-sf-${id}`} className={className}>
                        <div className="discord-field-title">
                          <MessageContent
                            content={stripWrappedBold(field.name)}
                            context={{ ...context, type: RenderType.EMBED }}
                          />
                        </div>
                        <MessageContent content={field.value} context={{ ...context, type: RenderType.EMBED }} />
                      </div>
                    );
                  })}
                </div>
              )}

              {isExternalVideo && (resolvedThumbnailUrl || resolvedImageUrl) ? (
                <div
                  className="discord-embed-description"
                  style={{
                    position: 'relative',
                    marginTop: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    maxWidth: '400px',
                  }}
                >
                  <a href={embedUrl ?? videoUrl ?? '#'} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                    <img
                      src={resolvedThumbnailUrl || resolvedImageUrl || ''}
                      alt={title ?? 'Video thumbnail'}
                      style={{ width: '100%', display: 'block', borderRadius: '4px' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </a>
                </div>
              ) : null}

              {!isExternalVideo && (resolvedImageUrl || resolvedVideoUrl) ? (
                <div className={`discord-embed-media${resolvedVideoUrl ? ' discord-embed-media-video' : ''}`}>
                  {resolvedVideoUrl ? (
                    <video
                      controls
                      muted
                      preload="none"
                      poster={resolvedImageUrl}
                      src={resolvedVideoUrl}
                      height="225"
                      width="400"
                      className="discord-embed-video"
                    >
                      {resolvedImageUrl ? (
                        <img src={resolvedImageUrl} alt="Discord embed media" className="discord-embed-image" />
                      ) : null}
                    </video>
                  ) : resolvedImageUrl ? (
                    <img src={resolvedImageUrl} alt="Discord embed media" className="discord-embed-image" />
                  ) : null}
                </div>
              ) : null}

              {resolvedThumbnailUrl ? (
                <img src={resolvedThumbnailUrl} alt="" className="discord-embed-thumbnail" />
              ) : null}

              {(footerText || footerTimestamp) && (
                <div className="discord-embed-footer">
                  {footerImage ? <img src={footerImage} alt="" className="discord-footer-image" /> : null}
                  {footerText ? (
                    <MessageContent content={footerText} context={{ ...context, type: RenderType.EMBED }} />
                  ) : null}
                  {footerText && footerTimestamp ? <span className="discord-footer-separator">•</span> : null}
                  {footerTimestamp ? getFooterTimestampText(footerTimestamp) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DiscordEmbedComponent
      embedTitle={title}
      slot="embeds"
      key={`${context.message.id}-e-${context.index}`}
      authorImage={authorImage}
      authorName={authorName}
      authorUrl={authorUrl}
      color={getColor(embed)}
      image={isExternalVideo ? undefined : resolvedImageUrl}
      thumbnail={isExternalVideo ? undefined : resolvedThumbnailUrl}
      video={isExternalVideo ? undefined : resolvedVideoUrl}
      provider={providerName}
      url={embedUrl}
    >
      {/* Description */}
      {description && !isExternalVideo && (
        <DiscordEmbedDescription slot="description">
          <MessageContent content={description} context={{ ...context, type: RenderType.EMBED }} />
        </DiscordEmbedDescription>
      )}

      {/* Fields */}
      {fields.length > 0 && (
        <DiscordEmbedFields slot="fields">
          {fields.map(async (field, id) => (
            <DiscordEmbedField
              key={`${context.message.id}-e-${context.index}-f-${id}`}
              fieldTitle={field.name}
              inline={field.inline}
              inlineIndex={calculateInlineIndex(fields, id)}
            >
              <MessageContent content={field.value} context={{ ...context, type: RenderType.EMBED }} />
            </DiscordEmbedField>
          ))}
        </DiscordEmbedFields>
      )}

      {/* External video thumbnail */}
      {isExternalVideo && (resolvedThumbnailUrl || resolvedImageUrl) && (
        <div
          slot="description"
          style={{ position: 'relative', marginTop: '8px', borderRadius: '4px', overflow: 'hidden', maxWidth: '400px' }}
        >
          <a href={embedUrl ?? videoUrl ?? '#'} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
            <img
              src={resolvedThumbnailUrl || resolvedImageUrl || ''}
              alt={title ?? 'Video thumbnail'}
              style={{ width: '100%', display: 'block', borderRadius: '4px' }}
            />

            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </a>
        </div>
      )}

      {/* Footer */}
      {(footerText || footerTimestamp) && (
        <DiscordEmbedFooter slot="footer" footerImage={footerImage} timestamp={footerTimestamp}>
          {footerText ? <MessageContent content={footerText} context={{ ...context, type: RenderType.EMBED }} /> : null}
        </DiscordEmbedFooter>
      )}
    </DiscordEmbedComponent>
  );
}
