---
description: Official documentation for discord.js-html-transcript - generate pixel-perfect Discord HTML transcripts.
---

# 🏠 Home

**discord.js-html-transcript** is a powerful Node.js module that generates beautiful, pixel-perfect HTML transcripts of Discord channels. It processes Discord-flavored markdown, renders native-looking attachments, embeds, buttons, polls, voice messages, and much more - all in a fully responsive, modern UI.

> **This package is a modernized fork of [`discord-html-transcripts`](https://github.com/ItzDerock/discord-html-transcripts) by ItzDerock, rebuilt with a completely redesigned UI and dozens of new features by [Wick Studio](https://github.com/wickstudio).**

## Features

This module renders the following Discord elements:

- ✅ **Messages** - Text, markdown, mentions, timestamps, and replies
- ✅ **Embeds** - Rich embeds with fields, images, thumbnails, videos, footers, and authors
- ✅ **Attachments** - Images, videos, audio files, and generic file attachments
- ✅ **Forwarded Messages** - Full forwarded message blocks with origin channel and timestamp
- ✅ **Voice Messages** - Waveform visualization with duration and playback controls
- ✅ **Polls / Voting** - Poll questions with answer options and vote counts
- ✅ **Buttons & Select Menus** - All Discord button styles and dropdown select menus
- ✅ **Server Tags** - APP badges, role icons, and server tag badges
- ✅ **Thread Previews** - Thread starter messages with preview cards
- ✅ **Discord Invite Previews** - Rich invite cards with server info and member counts
- ✅ **Reactions** - Emoji reactions with counts
- ✅ **System Messages** - Joins, pinned messages, boosts, thread creation
- ✅ **Slash Commands** - Command name display in the same style as Discord
- ✅ **Code Blocks** - Syntax-highlighted code blocks with ANSI escape sequence support
- ✅ **Image Preview Lightbox** - Click any image to open a fullscreen preview
- ✅ **Message Search** - Built-in search bar to find specific messages
- ✅ **Fully Responsive** - Mobile-first design that works on all screen sizes
- ✅ **Sticky Header** - Channel header stays pinned during scrolling

## Socials

- 💬 **Discord:** [discord.gg/wicks](https://discord.gg/wicks)
- 🐛 **Issues:** [GitHub Issues](https://github.com/wickstudio/discord.js-html-transcript/issues)
- 📦 **NPM:** [discord.js-html-transcript](https://www.npmjs.com/package/discord.js-html-transcript)

## Getting Started

Install the package using your preferred package manager:

{% tabs %}
{% tab title="npm" %}

```shell
npm install discord.js-html-transcript
```

{% endtab %}

{% tab title="pnpm" %}

```shell
pnpm add discord.js-html-transcript
```

{% endtab %}

{% tab title="yarn" %}

```shell
yarn add discord.js-html-transcript
```

{% endtab %}
{% endtabs %}

> **Requirements:** discord.js v14 or v15

## Quick Example

```javascript
const discordTranscripts = require('discord.js-html-transcript');

client.on('messageCreate', async (message) => {
  if (message.content === '!transcript') {
    const transcript = await discordTranscripts.createTranscript(message.channel, {
      limit: -1,
      returnType: 'attachment',
      filename: `transcript-${message.channel.id}.html`,
    });

    await message.reply({
      content: '📄 Here is your transcript!',
      files: [transcript],
    });
  }
});
```

## Contributing

The source code is available on GitHub:

{% embed url="https://github.com/wickstudio/discord.js-html-transcript" %}
wickstudio/discord.js-html-transcript
{% endembed %}

## Credits

Built upon the foundation of [`discord-html-transcripts`](https://github.com/ItzDerock/discord-html-transcripts) by [ItzDerock](https://github.com/ItzDerock). All new features and UI modernization by [Wick Studio](https://github.com/wickstudio).

## Useful Links

{% content-ref url="api-reference/createtranscript.md" %}
[createTranscript](api-reference/createtranscript.md)
{% endcontent-ref %}

{% content-ref url="api-reference/generatefrommessages.md" %}
[generateFromMessages](api-reference/generatefrommessages.md)
{% endcontent-ref %}

{% content-ref url="guides/features.md" %}
[Feature Toggles](guides/features.md)
{% endcontent-ref %}

{% content-ref url="guides/assets.md" %}
[Asset Preservation](guides/assets.md)
{% endcontent-ref %}
