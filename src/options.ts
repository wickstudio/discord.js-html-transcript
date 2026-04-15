import type { TranscriptAssetKind, TranscriptAssetOptions, TranscriptFeatureOptions } from './types';

export type ResolvedTranscriptFeatureOptions = {
  search: boolean;
  imagePreview: boolean;
  spoilerReveal: boolean;
  messageLinks: boolean;
  profileBadges: boolean;
  embedTweaks: boolean;
};

export type ResolvedTranscriptAssetOptions = {
  attachmentImages: boolean;
  attachmentVideos: boolean;
  attachmentAudio: boolean;
  attachmentFiles: boolean;
  embedImages: boolean;
  embedThumbnails: boolean;
  embedVideos: boolean;
  embedAuthorIcons: boolean;
  embedFooterIcons: boolean;
  componentImages: boolean;
  componentThumbnails: boolean;
  componentFiles: boolean;
  avatars: boolean;
  emojis: boolean;
  guildIcons: boolean;
  inviteIcons: boolean;
  roleIcons: boolean;
  serverTagBadges: boolean;
};

const DEFAULT_FEATURES: ResolvedTranscriptFeatureOptions = {
  search: true,
  imagePreview: true,
  spoilerReveal: true,
  messageLinks: true,
  profileBadges: true,
  embedTweaks: true,
};

const DEFAULT_ASSETS: ResolvedTranscriptAssetOptions = {
  attachmentImages: false,
  attachmentVideos: false,
  attachmentAudio: false,
  attachmentFiles: false,
  embedImages: false,
  embedThumbnails: false,
  embedVideos: false,
  embedAuthorIcons: false,
  embedFooterIcons: false,
  componentImages: false,
  componentThumbnails: false,
  componentFiles: false,
  avatars: false,
  emojis: false,
  guildIcons: false,
  inviteIcons: false,
  roleIcons: false,
  serverTagBadges: false,
};

export function resolveFeatureOptions(
  features: TranscriptFeatureOptions | undefined
): ResolvedTranscriptFeatureOptions {
  return {
    ...DEFAULT_FEATURES,
    ...(features ?? {}),
  };
}

export function resolveAssetOptions({
  saveImages,
  saveAssets,
  assets,
}: {
  saveImages?: boolean;
  saveAssets?: boolean;
  assets?: TranscriptAssetOptions;
}): ResolvedTranscriptAssetOptions {
  if (saveAssets) {
    return Object.fromEntries(Object.keys(DEFAULT_ASSETS).map((key) => [key, true])) as ResolvedTranscriptAssetOptions;
  }

  return {
    ...DEFAULT_ASSETS,
    attachmentImages: Boolean(saveImages || assets?.attachments),
    attachmentVideos: Boolean(assets?.attachments),
    attachmentAudio: Boolean(assets?.attachments),
    attachmentFiles: Boolean(assets?.attachments),
    embedImages: Boolean(assets?.embeds),
    embedThumbnails: Boolean(assets?.embeds),
    embedVideos: Boolean(assets?.embeds),
    embedAuthorIcons: Boolean(assets?.embeds),
    embedFooterIcons: Boolean(assets?.embeds),
    componentImages: Boolean(assets?.components),
    componentThumbnails: Boolean(assets?.components),
    componentFiles: Boolean(assets?.components),
    avatars: Boolean(assets?.avatars),
    emojis: Boolean(assets?.emojis),
    guildIcons: Boolean(assets?.guildIcons),
    inviteIcons: Boolean(assets?.inviteIcons),
    roleIcons: Boolean(assets?.roleIcons),
    serverTagBadges: Boolean(assets?.serverTagBadges),
  };
}

export function hasSavedAssetsEnabled(options: ResolvedTranscriptAssetOptions) {
  return Object.values(options).some(Boolean);
}

export function shouldSaveAsset(kind: TranscriptAssetKind, options: ResolvedTranscriptAssetOptions) {
  switch (kind) {
    case 'attachment-image':
      return options.attachmentImages;
    case 'attachment-video':
      return options.attachmentVideos;
    case 'attachment-audio':
      return options.attachmentAudio;
    case 'attachment-file':
      return options.attachmentFiles;
    case 'embed-image':
      return options.embedImages;
    case 'embed-thumbnail':
      return options.embedThumbnails;
    case 'embed-video':
      return options.embedVideos;
    case 'embed-author-icon':
      return options.embedAuthorIcons;
    case 'embed-footer-icon':
      return options.embedFooterIcons;
    case 'component-image':
      return options.componentImages;
    case 'component-thumbnail':
      return options.componentThumbnails;
    case 'component-file':
      return options.componentFiles;
    case 'avatar':
      return options.avatars;
    case 'emoji':
      return options.emojis;
    case 'guild-icon':
      return options.guildIcons;
    case 'invite-icon':
      return options.inviteIcons;
    case 'role-icon':
      return options.roleIcons;
    case 'server-tag-badge':
      return options.serverTagBadges;
    default:
      return false;
  }
}
