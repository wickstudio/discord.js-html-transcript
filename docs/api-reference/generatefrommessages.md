# generateFromMessages

Generate a transcript from your own pre-fetched messages for full control over what gets exported.

## Example

{% tabs %}
{% tab title="JavaScript" %}

```javascript
const discordTranscripts = require('discord.js-html-transcript');

const messages = await channel.messages.fetch({ limit: 100 });

const transcript = await discordTranscripts.generateFromMessages(
  messages,
  channel,
  {
    returnType: 'attachment',
    features: {
      search: true,
      imagePreview: true,
    },
  }
);

channel.send({
  files: [transcript],
});
```

{% endtab %}

{% tab title="TypeScript" %}

```typescript
import * as discordTranscripts from 'discord.js-html-transcript';
import { Collection, Message, ExportReturnType } from 'discord.js';

const messages = await channel.messages.fetch({ limit: 100 });

const transcript = await discordTranscripts.generateFromMessages(
  messages,
  channel,
  {
    returnType: ExportReturnType.Attachment,
    features: {
      search: true,
      imagePreview: true,
    },
  }
);

channel.send({
  files: [transcript],
});
```

{% endtab %}
{% endtabs %}

## Parameters

```javascript
generateFromMessages(messages, channel, options = {});
```

### `messages: Message[] | Collection<string, Message>`

The messages that will form the body of the transcript. Can be an array of discord.js [Message](https://discord.js.org/#/docs/discord.js/main/class/Message) objects or a [Collection](https://discord.js.org/#/docs/collection/main/class/Collection) of Messages.

### `channel: Channel`

The channel used for metadata: guild name, guild icon, channel name, and channel topic.

### `options: GenerateFromMessagesOptions`

All configuration options for the transcript generation.

---

## Options Reference

#### `options.returnType: 'buffer' | 'string' | 'attachment'`

What format to return the transcript in. Use the `ExportReturnType` enum for type safety.

| Value | Description |
|-------|-------------|
| `'attachment'` | Returns an `AttachmentBuilder` ready to send |
| `'buffer'` | Returns the HTML as a `Buffer` |
| `'string'` | Returns the HTML as a raw `string` |

**Default:** `'attachment'`

#### `options.filename: string`

The output filename when `returnType` is `'attachment'`.

**Default:** `'transcript-{channel id}.html'`

---

### Asset Preservation

#### `options.saveImages: boolean`

*Legacy option.* Downloads image attachments and embeds them as base64 data URIs. Useful when the channel will be deleted and images would be lost.

> ⚠️ This can significantly increase the transcript file size.

**Default:** `false`

#### `options.saveAssets: boolean`

Downloads **all** remote assets (images, videos, avatars, emojis, icons, etc.) and embeds them as data URIs. This creates a fully offline transcript.

**Default:** `false`

#### `options.assets: TranscriptAssetOptions`

Fine-grained control over which asset categories to preserve:

| Key | Description | Default |
|-----|-------------|---------|
| `attachments` | Images, videos, audio, and file attachments | `false` |
| `embeds` | Embed images, thumbnails, videos, author/footer icons | `false` |
| `components` | Media gallery items, thumbnails, component files | `false` |
| `avatars` | User avatar images | `false` |
| `emojis` | Custom emoji and Twemoji assets | `false` |
| `guildIcons` | Transcript header and favicon guild icon | `false` |
| `inviteIcons` | Server invite preview icons | `false` |
| `roleIcons` | Highest-role icon images | `false` |
| `serverTagBadges` | Server tag badge images | `false` |

---

### Feature Toggles

#### `options.features: TranscriptFeatureOptions`

Enable or disable built-in transcript UI features:

| Key | Description | Default |
|-----|-------------|---------|
| `search` | Built-in message search bar | `true` |
| `imagePreview` | Click-to-open image lightbox | `true` |
| `spoilerReveal` | Click spoilers to reveal content | `true` |
| `messageLinks` | Reply/reference click-to-scroll | `true` |
| `profileBadges` | APP badges, server tags, role icons | `true` |
| `embedTweaks` | Client-side embed border/style fixes | `true` |

---

### Appearance

#### `options.footerText: string`

Custom footer text. Available placeholders:

- `{number}` - total number of exported messages
- `{s}` - pluralizes (adds "s" when count > 1)

**Default:** `'Exported {number} message{s}.'`

#### `options.poweredBy: boolean`

Show the "Powered by discord.js-html-transcript" credit in the footer.

**Default:** `true`

#### `options.favicon: 'guild' | string`

Set the transcript's favicon. Use `'guild'` for the server icon, or pass a custom URL.

**Default:** `'guild'`

#### `options.hydrate: boolean`

Server-side render the Discord web components instead of loading them client-side.

**Default:** `false`

---

### Callbacks

#### `options.callbacks.resolveChannel`

```typescript
(channelId: string) => Awaitable<Channel | null>
```

Custom function to resolve channel mentions. Default uses `channel.client.channels.fetch(...)`.

#### `options.callbacks.resolveUser`

```typescript
(userId: string) => Awaitable<User | null>
```

Custom function to resolve user mentions. Default uses `channel.client.users.fetch(...)`.

#### `options.callbacks.resolveRole`

```typescript
(roleId: string) => Awaitable<Role | null>
```

Custom function to resolve role mentions. Default uses `channel.guild?.roles.fetch(...)`.

#### `options.callbacks.resolveInvite`

```typescript
(code: string) => Awaitable<{ name: string; icon: string | null; online: number; members: number; url: string } | null>
```

Custom function to resolve Discord invite links into rich preview cards.

#### `options.callbacks.resolveImageSrc`

```typescript
(attachment: APIAttachment, message: APIMessage) => Awaitable<string | null | undefined>
```

Custom function to process image attachments. Return a data URI, a new URL, or `null`/`undefined` to keep the original.

#### `options.callbacks.resolveAssetSrc`

```typescript
(asset: TranscriptAsset) => Awaitable<string | null | undefined>
```

Custom function to process any transcript asset. Return a data URI, a new URL, or `null`/`undefined` to keep the original.
