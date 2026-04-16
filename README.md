<p align="center">
  <img src="https://i.imgur.com/hNAL2yY.png" width="300" alt="discord.js-html-transcript" />
</p>

<h1 align="center">discord.js-html-transcript</h1>

<p align="center">
  <strong>Generate pixel-perfect, native-looking Discord HTML transcripts.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/discord.js-html-transcript"><img src="https://img.shields.io/npm/v/discord.js-html-transcript?color=5865F2&label=npm&logo=npm&logoColor=white" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/discord.js-html-transcript"><img src="https://img.shields.io/npm/dw/discord.js-html-transcript?color=5865F2&logo=npm&logoColor=white" alt="npm downloads" /></a>
  <a href="https://discord.gg/wicks"><img src="https://img.shields.io/discord/1061971978845700176?color=5865F2&label=discord&logo=discord&logoColor=white" alt="Discord" /></a>
  <a href="https://github.com/wickstudio/discord.js-html-transcript"><img src="https://img.shields.io/github/stars/wickstudio/discord.js-html-transcript?style=social" alt="GitHub stars" /></a>
  <a href="https://github.com/wickstudio/discord.js-html-transcript/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="License" /></a>
</p>

<p align="center">
  <a href="https://demo.linkux.xyz/"><strong>📖 Official Documentation</strong></a> •
  <a href="https://demo.linkux.xyz/demo.html"><strong>🖥️ Live Demo</strong></a><br>
  <br>
  <a href="#-installation">Installation</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#%EF%B8%8F-configuration">Configuration</a> •
  <a href="#-api-reference">API Reference</a>
</p>

---

## ✨ What's New in v4

This package is a **completely modernized fork** of [`discord-html-transcripts`](https://github.com/ItzDerock/discord-html-transcripts) by **ItzDerock**, rebuilt from the ground up with a native Discord UI that is indistinguishable from the real thing.

### 🆕 New Features

| Feature                       | Description                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| 🔀 **Forwarded Messages**     | Full support for Discord's forwarded message format with origin info                        |
| 🎙️ **Voice Messages**         | Waveform visualization with play button, duration, and speed controls                       |
| 📊 **Polls / Voting**         | Native poll rendering with answer options, vote counts, and progress bars                   |
| 🏷️ **Server Tags**            | APP badges, role icons, and server tag badges on user profiles                              |
| 🔘 **Buttons & Select Menus** | Primary, secondary, success, danger, and link button styles + dropdown menus                |
| 🔗 **Invite Link Previews**   | Rich invite cards with server icon, member counts, and join button                          |
| 🖼️ **Image Preview Lightbox** | Click any image to open a full-screen lightbox overlay                                      |
| 🔍 **Message Search**         | Built-in search bar to find messages within transcripts                                     |
| 🧵 **Thread Previews**        | Thread starter messages with preview boxes and participant info                             |
| 📎 **File Attachments**       | Native-styled file attachment cards with download buttons                                   |
| 🎨 **ANSI Code Blocks**       | Full ANSI escape sequence rendering with colors and formatting                              |
| 📱 **Fully Responsive**       | Mobile-first responsive design that works perfectly on all screen sizes                     |
| 📌 **Sticky Header**          | Channel header stays visible while scrolling, just like Discord                             |
| ⚙️ **Configurable Features**  | Toggle search, image preview, spoiler reveal, and more on/off                               |
| 💾 **Granular Asset Saving**  | Fine-grained control over which remote assets (images, avatars, emojis, etc.) are preserved |

### 🎨 UI Improvements

- Redesigned button and select menu components matching Discord's current design
- Modern dark theme background (`#070709`) matching native Discord
- Improved embed border styling with subtle transparency
- Enhanced markdown rendering (headings, lists, block quotes, code blocks)
- Responsive image galleries with multi-image grid layouts
- Native vote/poll UI with interactive styling
- Voice message capsule with amplitude-proportional waveform bars
- Custom file attachment cards with file type icons

---

## 📦 Installation

```bash
# npm
npm install discord.js-html-transcript

# pnpm
pnpm add discord.js-html-transcript

# yarn
yarn add discord.js-html-transcript
```

> **Requirements:** Node.js 16+ and **discord.js v14 or v15**

---

## 🛠️ Get Started

### Using the built-in message fetcher

```javascript
const discordTranscripts = require('discord.js-html-transcript');

const channel = message.channel;

const attachment = await discordTranscripts.createTranscript(channel);

channel.send({
  files: [attachment],
});
```

### Using your own messages

```javascript
const discordTranscripts = require('discord.js-html-transcript');

const messages = await channel.messages.fetch({ limit: 100 });

const attachment = await discordTranscripts.generateFromMessages(messages, channel);

channel.send({
  files: [attachment],
});
```

### TypeScript

```typescript
import * as discordTranscripts from 'discord.js-html-transcript';

const attachment = await discordTranscripts.createTranscript(channel, {
  returnType: discordTranscripts.ExportReturnType.Attachment,
  filename: `transcript-${channel.id}.html`,
});
```

---

## ⚙️ Configuration

Both `createTranscript` and `generateFromMessages` accept an options object.
**All options are optional** - sensible defaults are used when omitted.

```javascript
const attachment = await discordTranscripts.createTranscript(channel, {
  // ── Output ────────────────────────────────────────────────
  returnType: 'attachment',       // 'buffer' | 'string' | 'attachment'
  filename: 'transcript.html',   // output filename (when returnType is 'attachment')

  // ── Message Fetching (createTranscript only) ──────────────
  limit: -1,                     // max messages to fetch (-1 = all)
  filter: (message) => true,     // filter which messages to include

  // ── Asset Preservation ────────────────────────────────────
  saveImages: false,             // legacy: save image attachments as data URIs
  saveAssets: false,             // save ALL remote assets as data URIs
  assets: {
    attachments: false,          // images, videos, audio, and files
    embeds: false,               // embed media + author/footer icons
    components: false,           // media gallery items, thumbnails, component files
    avatars: false,              // user avatars
    emojis: false,               // custom emoji + twemoji assets
    guildIcons: false,           // header + favicon guild icon
    inviteIcons: false,          // invite preview server icons
    roleIcons: false,            // highest-role icon images
    serverTagBadges: false,      // server tag badge images
  },

  // ── Feature Toggles ───────────────────────────────────────
  features: {
    search: true,                // built-in message search UI
    imagePreview: true,          // click-to-open image lightbox
    spoilerReveal: true,         // click spoilers to reveal
    messageLinks: true,          // reply click-to-scroll behavior
    profileBadges: true,         // APP badges, server tags, role icons
    embedTweaks: true,           // client-side embed border/style fixes
  },

  // ── Appearance ────────────────────────────────────────────
  footerText: 'Exported {number} message{s}.',
  poweredBy: true,               // show "Powered by" footer credit
  favicon: 'guild',             // 'guild' or a custom URL string
  hydrate: false,                // server-side hydrate the HTML

  // ── Callbacks ─────────────────────────────────────────────
  callbacks: {
    resolveChannel: (channelId) => channel.client.channels.fetch(channelId),
    resolveUser:    (userId)    => channel.client.users.fetch(userId),
    resolveRole:    (roleId)    => channel.guild?.roles.fetch(roleId),
    resolveInvite:  (code)      => /* return { name, icon, online, members, url } */,
    resolveImageSrc: (attachment, message) => /* return data URI or URL */,
    resolveAssetSrc: (asset)    => /* return data URI or URL */,
  },
});
```

### Image Compression

Install `sharp` as a dev dependency to enable image compression:

```bash
npm install sharp --save-dev
```

```javascript
const { TranscriptImageDownloader } = require('discord.js-html-transcript');

const attachment = await discordTranscripts.createTranscript(channel, {
  callbacks: {
    resolveImageSrc: new TranscriptImageDownloader()
      .withMaxSize(5120) // 5MB max per image (in KB)
      .withCompression(40, true) // 40% quality, convert to webp
      .build(),
  },
});
```

### Saving All Assets (Offline Transcripts)

For transcripts that survive Discord CDN expiration:

```javascript
const { TranscriptAssetDownloader } = require('discord.js-html-transcript');

const attachment = await discordTranscripts.createTranscript(channel, {
  saveAssets: true,
  // Or for fine-grained control:
  assets: {
    attachments: true,
    embeds: true,
    avatars: true,
    emojis: true,
    guildIcons: true,
  },
  callbacks: {
    resolveAssetSrc: new TranscriptAssetDownloader()
      .withMaxSize(10240) // 10MB per asset
      .build(),
  },
});
```

---

## 🖼️ Preview

### Messages & Attachments

|                   Normal Image                   |                   Multi Images                   |             File Attachment              |
| :----------------------------------------------: | :----------------------------------------------: | :--------------------------------------: |
| ![Normal Image](https://i.imgur.com/af2N5vi.png) | ![Multi Images](https://i.imgur.com/8P4BrYW.png) | ![File](https://i.imgur.com/VO399ds.png) |

### Forwarded Messages & Reactions

|                Forwarded Image                |                  Forwarded + Reactions                  |
| :-------------------------------------------: | :-----------------------------------------------------: |
| ![Forwarded](https://i.imgur.com/mc5hig6.png) | ![Forwarded Reactions](https://i.imgur.com/xJCyoLX.png) |

### Polls, Threads & Mentions

|                   Poll                   |                   Thread                   |                   Mentions                   |
| :--------------------------------------: | :----------------------------------------: | :------------------------------------------: |
| ![Poll](https://i.imgur.com/g4XUNBm.png) | ![Thread](https://i.imgur.com/T93KkSG.png) | ![Mentions](https://i.imgur.com/AhqzzOD.png) |

### Buttons, Select Menus & Slash Commands

|            Buttons & Select Menu            |           Slash Command & Voice           |
| :-----------------------------------------: | :---------------------------------------: |
| ![Buttons](https://i.imgur.com/JicYFrG.png) | ![Slash](https://i.imgur.com/t16ZCrJ.png) |

### Embeds

|                  Embed 1                  |                  Embed 2                  |                  Embed 3                  |
| :---------------------------------------: | :---------------------------------------: | :---------------------------------------: |
| ![Embed](https://i.imgur.com/7K1Vo6a.png) | ![Embed](https://i.imgur.com/bw6BNXq.png) | ![Embed](https://i.imgur.com/4r76uSu.png) |

### Links & Invites

|                   Links                   |               Invite Preview               |
| :---------------------------------------: | :----------------------------------------: |
| ![Links](https://i.imgur.com/9I3wkgp.png) | ![Invite](https://i.imgur.com/w4VlqKd.png) |

### Markdown Formatting

|             Basic Formatting              |               Code Blocks                |                   Headings                   |
| :---------------------------------------: | :--------------------------------------: | :------------------------------------------: |
| ![Basic](https://i.imgur.com/007RSBl.png) | ![Code](https://i.imgur.com/lFrHlRO.png) | ![Headings](https://i.imgur.com/3bho2uy.png) |

|                Block Quotes                |                   Lists                   |               ANSI Styling               |
| :----------------------------------------: | :---------------------------------------: | :--------------------------------------: |
| ![Quotes](https://i.imgur.com/wpJQhSA.png) | ![Lists](https://i.imgur.com/A7dKzLa.png) | ![ANSI](https://i.imgur.com/WstVA3K.png) |

---

## 📚 API Reference

### `createTranscript(channel, options?)`

Fetches messages from a channel and generates an HTML transcript.

| Parameter | Type                      | Description                       |
| --------- | ------------------------- | --------------------------------- |
| `channel` | `TextBasedChannel`        | The channel to export             |
| `options` | `CreateTranscriptOptions` | Configuration options (see above) |

**Returns:** `Promise<AttachmentBuilder | Buffer | string>`

```javascript
const transcript = await discordTranscripts.createTranscript(channel, {
  limit: 500,
  filter: (msg) => !msg.author.bot,
  returnType: 'attachment',
});
```

---

### `generateFromMessages(messages, channel, options?)`

Generates a transcript from a pre-fetched array of messages.

| Parameter  | Type                                       | Description                       |
| ---------- | ------------------------------------------ | --------------------------------- |
| `messages` | `Message[] \| Collection<string, Message>` | Messages to include               |
| `channel`  | `Channel`                                  | Channel for header/guild info     |
| `options`  | `GenerateFromMessagesOptions`              | Configuration options (see above) |

**Returns:** `Promise<AttachmentBuilder | Buffer | string>`

```javascript
const messages = await channel.messages.fetch({ limit: 100 });
const transcript = await discordTranscripts.generateFromMessages(messages, channel);
```

---

### Return Types

Use the `ExportReturnType` enum for type-safe return values:

```typescript
import { ExportReturnType } from 'discord.js-html-transcript';

// Returns a Buffer
const buffer = await discordTranscripts.createTranscript(channel, {
  returnType: ExportReturnType.Buffer,
});

// Returns a string
const html = await discordTranscripts.createTranscript(channel, {
  returnType: ExportReturnType.String,
});

// Returns an AttachmentBuilder (default)
const attachment = await discordTranscripts.createTranscript(channel, {
  returnType: ExportReturnType.Attachment,
});
```

---

### Asset Classes

#### `TranscriptImageDownloader`

```javascript
const downloader = new TranscriptImageDownloader()
  .withMaxSize(5120) // max file size in KB
  .withCompression(40, true) // quality %, convert to webp
  .build(); // returns a resolveImageSrc callback
```

#### `TranscriptAssetDownloader`

```javascript
const downloader = new TranscriptAssetDownloader()
  .withMaxSize(10240) // max file size in KB
  .build(); // returns a resolveAssetSrc callback
```

---

## 📖 Full Example

```javascript
const discordTranscripts = require('discord.js-html-transcript');
const { TranscriptAssetDownloader } = require('discord.js-html-transcript');

client.on('messageCreate', async (message) => {
  if (message.content === '!transcript') {
    const transcript = await discordTranscripts.createTranscript(message.channel, {
      returnType: 'attachment',
      filename: `transcript-${message.channel.id}.html`,
      limit: -1,
      assets: {
        attachments: true,
        embeds: true,
        avatars: true,
        emojis: true,
        guildIcons: true,
        inviteIcons: true,
        roleIcons: true,
        serverTagBadges: true,
      },
      features: {
        search: true,
        imagePreview: true,
        spoilerReveal: true,
        messageLinks: true,
        profileBadges: true,
        embedTweaks: true,
      },
      callbacks: {
        resolveAssetSrc: new TranscriptAssetDownloader().withMaxSize(10240).build(),
      },
      footerText: 'Exported {number} message{s}.',
      poweredBy: true,
    });

    await message.reply({
      content: '📄 Here is your transcript!',
      files: [transcript],
    });
  }
});
```

---

## 🆚 Comparison with Original

| Feature                         | `discord-html-transcripts` | `discord.js-html-transcript` |
| ------------------------------- | :------------------------: | :--------------------------: |
| Basic Messages & Embeds         |             ✅             |              ✅              |
| Forwarded Messages              |             ❌             |              ✅              |
| Voice Messages                  |             ❌             |              ✅              |
| Polls / Voting                  |             ❌             |              ✅              |
| Server Tags & Role Icons        |             ❌             |              ✅              |
| Buttons & Select Menus (Modern) |             ❌             |              ✅              |
| Discord Invite Previews         |             ❌             |              ✅              |
| Image Preview Lightbox          |             ❌             |              ✅              |
| Message Search                  |             ❌             |              ✅              |
| ANSI Code Block Styling         |             ❌             |              ✅              |
| Thread Preview Cards            |             ❌             |              ✅              |
| Fully Responsive Mobile UI      |             ❌             |              ✅              |
| Sticky Channel Header           |             ❌             |              ✅              |
| Feature Toggle System           |             ❌             |              ✅              |
| Granular Asset Saving           |             ❌             |              ✅              |
| Native File Attachment Cards    |             ❌             |              ✅              |
| Image Compression (sharp)       |             ❌             |              ✅              |
| Multi-Image Gallery Grid        |             ❌             |              ✅              |

---

## 🤝 Credits

This package is built upon the excellent foundation of [`discord-html-transcripts`](https://github.com/ItzDerock/discord-html-transcripts) by [**ItzDerock**](https://github.com/ItzDerock). Original styles powered by [`@derockdev/discord-components`](https://github.com/ItzDerock/discord-components).

All new features, UI modernization, mobile responsiveness, and component redesigns by [**Wick Studio**](https://github.com/wickstudio).

---

## 💬 Support

- 🌐 **Discord Server:** [discord.gg/wicks](https://discord.gg/wicks)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/wickstudio/discord.js-html-transcript/issues)
- 📦 **NPM:** [discord.js-html-transcript](https://www.npmjs.com/package/discord.js-html-transcript)

---

## 📜 License

This project is licensed under the [Apache License 2.0](./LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/wickstudio">Wick Studio</a>
</p>
