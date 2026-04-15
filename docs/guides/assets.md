# Asset Preservation

By default, transcript images and assets reference Discord's CDN URLs. These links can expire or break when channels/messages are deleted. `discord.js-html-transcript` provides multiple strategies to preserve assets.

## Quick Options

### `saveImages` (Legacy)

The simplest option - downloads image attachments and embeds them as base64 data URIs.

```javascript
const transcript = await discordTranscripts.createTranscript(channel, {
  saveImages: true,
});
```

> ⚠️ This only saves image attachments, not avatars, emojis, embed media, or other assets.

### `saveAssets` (Everything)

Downloads **every** remote asset and embeds them as data URIs for a fully offline transcript.

```javascript
const transcript = await discordTranscripts.createTranscript(channel, {
  saveAssets: true,
});
```

> ⚠️ This can produce very large files. Use the granular `assets` option for more control.

### `assets` (Granular Control)

Pick exactly which asset categories to preserve:

```javascript
const transcript = await discordTranscripts.createTranscript(channel, {
  assets: {
    attachments: true,      // images, videos, audio, files
    embeds: true,           // embed images, thumbnails, videos, icons
    components: true,       // media gallery items, component files
    avatars: true,          // user avatars
    emojis: true,           // custom emoji + twemoji
    guildIcons: true,       // transcript header guild icon
    inviteIcons: true,      // invite preview server icons
    roleIcons: true,        // highest-role icon images
    serverTagBadges: true,  // server tag badge images
  },
});
```

## Custom Asset Resolution

For advanced use cases (e.g., storing assets on your own CDN), implement the `resolveAssetSrc` callback:

```javascript
const transcript = await discordTranscripts.createTranscript(channel, {
  assets: { attachments: true, avatars: true },
  callbacks: {
    resolveAssetSrc: async (asset) => {
      // asset.kind - 'avatar', 'attachment-image', 'emoji', etc.
      // asset.url - the original Discord CDN URL

      // Upload to your own CDN and return the new URL
      const newUrl = await uploadToMyCDN(asset.url);
      return newUrl;

      // Or return null/undefined to keep the original URL
    },
  },
});
```

### Asset Kinds

The `asset.kind` property identifies the type of asset:

| Kind | Description |
|------|-------------|
| `attachment-image` | Image attachment |
| `attachment-video` | Video attachment |
| `attachment-audio` | Audio attachment |
| `attachment-file` | Generic file attachment |
| `embed-image` | Embed image |
| `embed-thumbnail` | Embed thumbnail |
| `embed-video` | Embed video |
| `embed-author-icon` | Embed author icon |
| `embed-footer-icon` | Embed footer icon |
| `component-image` | Component media gallery image |
| `component-thumbnail` | Component thumbnail |
| `component-file` | Component file |
| `avatar` | User avatar |
| `emoji` | Custom emoji or Twemoji |
| `guild-icon` | Guild/server icon |
| `invite-icon` | Invite preview server icon |
| `role-icon` | Role icon image |
| `server-tag-badge` | Server tag badge image |

## Using the Built-in Downloader

The package includes `TranscriptAssetDownloader` for easy asset preservation:

```javascript
const { TranscriptAssetDownloader } = require('discord.js-html-transcript');

const transcript = await discordTranscripts.createTranscript(channel, {
  assets: { attachments: true, embeds: true, avatars: true },
  callbacks: {
    resolveAssetSrc: new TranscriptAssetDownloader()
      .withMaxSize(10240)  // skip assets larger than 10MB
      .build(),
  },
});
```
