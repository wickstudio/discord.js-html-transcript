import type { APIAttachment, APIMessage, AttachmentBuilder, Awaitable, Channel, Message, Role, User } from 'discord.js';

export type AttachmentTypes = 'audio' | 'video' | 'image' | 'file';

export type TranscriptInviteData = {
  name: string;
  icon: string | null;
  online: number;
  members: number;
  url: string;
};

/**
 * Callback used to save an image attachment.
 * The returned string is the URL that will be used in the transcript.
 *
 * `undefined` indicates to use the original attachment URL.
 * `null` indicates to keep the original attachment URL.
 * `string` indicates to use the returned URL as the attachment URL (base64 or remote image).
 */
export type ResolveImageCallback = (
  attachment: APIAttachment,
  message: APIMessage
) => Awaitable<string | null | undefined>;

export type TranscriptAssetKind =
  | 'attachment-image'
  | 'attachment-video'
  | 'attachment-audio'
  | 'attachment-file'
  | 'embed-image'
  | 'embed-thumbnail'
  | 'embed-video'
  | 'embed-author-icon'
  | 'embed-footer-icon'
  | 'component-image'
  | 'component-thumbnail'
  | 'component-file'
  | 'avatar'
  | 'emoji'
  | 'guild-icon'
  | 'invite-icon'
  | 'role-icon'
  | 'server-tag-badge';

export type TranscriptAsset = {
  kind: TranscriptAssetKind;
  url: string;
  contentType?: string | null;
  filename?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  message?: APIMessage | null;
  attachment?: APIAttachment | null;
};

export type ResolveAssetCallback = (asset: TranscriptAsset) => Awaitable<string | null | undefined>;

export type TranscriptCallbacks = Partial<{
  resolveChannel: (channelId: string) => Awaitable<Channel | null>;
  resolveUser: (userId: string) => Awaitable<User | null>;
  resolveRole: (roleId: string) => Awaitable<Role | null>;
  resolveInvite: (code: string) => Awaitable<TranscriptInviteData | null>;
  resolveImageSrc: ResolveImageCallback;
  resolveAssetSrc: ResolveAssetCallback;
}>;

export type TranscriptFeatureOptions = Partial<{
  /**
   * Enables the built-in message search bar.
   * @default true
   */
  search: boolean;

  /**
   * Enables the click-to-open image lightbox.
   * @default true
   */
  imagePreview: boolean;

  /**
   * Enables client-side spoiler reveal behavior.
   * @default true
   */
  spoilerReveal: boolean;

  /**
   * Enables message jump handling for replies and references.
   * @default true
   */
  messageLinks: boolean;

  /**
   * Enables profile decorations like APP badges, role icons, and server tags.
   * @default true
   */
  profileBadges: boolean;

  /**
   * Enables client-side embed border/style fixes for the component library.
   * @default true
   */
  embedTweaks: boolean;
}>;

export type TranscriptAssetOptions = Partial<{
  /**
   * Save all regular message attachments (images, videos, audio, and files).
   * @default false
   */
  attachments: boolean;

  /**
   * Save embed images, thumbnails, videos, and author/footer icons.
   * @default false
   */
  embeds: boolean;

  /**
   * Save component media such as media galleries, thumbnails, and file components.
   * @default false
   */
  components: boolean;

  /**
   * Save user avatars used throughout the transcript.
   * @default false
   */
  avatars: boolean;

  /**
   * Save custom emoji and Twemoji image assets.
   * @default false
   */
  emojis: boolean;

  /**
   * Save the transcript header/favicon guild icon.
   * @default false
   */
  guildIcons: boolean;

  /**
   * Save invite preview server icons.
   * @default false
   */
  inviteIcons: boolean;

  /**
   * Save highest-role icon images.
   * @default false
   */
  roleIcons: boolean;

  /**
   * Save server tag badge images.
   * @default false
   */
  serverTagBadges: boolean;
}>;

export enum ExportReturnType {
  Buffer = 'buffer',
  String = 'string',
  Attachment = 'attachment',
}

export type ObjectType<T extends ExportReturnType> = T extends ExportReturnType.Buffer
  ? Buffer
  : T extends ExportReturnType.String
    ? string
    : AttachmentBuilder;

export type GenerateFromMessagesOptions<T extends ExportReturnType> = Partial<{
  /**
   * The type of object to return
   * @default ExportReturnType.ATTACHMENT
   */
  returnType: T;

  /**
   * Downloads attachment images and encodes them as base64 data urls
   * @default false
   */
  saveImages: boolean;

  /**
   * Downloads all supported transcript assets and encodes them as base64 data urls
   * @default false
   */
  saveAssets: boolean;

  /**
   * Fine-grained controls for which remote assets are preserved in the transcript.
   * @default {}
   */
  assets: TranscriptAssetOptions;

  /**
   * Enables or disables built-in transcript UI features.
   * @default {}
   */
  features: TranscriptFeatureOptions;

  /**
   * Callbacks for resolving channels, users, and roles
   */
  callbacks: TranscriptCallbacks;

  /**
   * The name of the file to return if returnType is ExportReturnType.ATTACHMENT
   * @default 'transcript-{channel-id}.html'
   */
  filename: string;

  /**
   * Whether to include the "Powered by discord-html-transcripts" footer
   * @default true
   */
  poweredBy: boolean;

  /**
   * The message right before "Powered by" text. Remember to put the {s}
   * @default 'Exported {number} message{s}.'
   */
  footerText: string;

  /**
   * Whether to show the guild icon or a custom icon as the favicon
   * 'guild' - use the guild icon
   * or pass in a url to use a custom icon
   * @default "guild"
   */
  favicon: 'guild' | string;

  /**
   * Whether to hydrate the html server-side
   * @default false - the returned html will be hydrated client-side
   */
  hydrate: boolean;
}>;

export type CreateTranscriptOptions<T extends ExportReturnType> = Partial<
  GenerateFromMessagesOptions<T> & {
    /**
     * The max amount of messages to fetch. Use `-1` to recursively fetch.
     */
    limit: number;

    /**
     * Filter messages of the channel
     * @default (() => true)
     */
    filter: (message: Message<boolean>) => boolean;
  }
>;
