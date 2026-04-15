# Tests

Test scripts for validating `discord.js-html-transcript` functionality against a live Discord bot.

## Setup

1. Copy `.env.example` to `.env` in the project root:
   ```
   TOKEN=your_bot_token_here
   CHANNEL=your_channel_id_here
   ```

2. Make sure the bot has access to the specified channel with `Read Message History` and `Send Messages` permissions.

## Available Tests

### `generate.ts` - Standard Transcript

Generates a full channel transcript with all features enabled and sends it back to the channel.

```bash
pnpm run test:typescript
```

- Fetches all messages from the channel
- Enables search, image preview, spoiler reveal, message links, profile badges, embed tweaks
- Saves the HTML output to `output/` and `debug_transcript.html`
- Sends the transcript as an attachment to the channel

---

### `generate-offline.ts` - Offline Transcript

Generates a fully self-contained transcript where all remote assets (images, avatars, emojis, icons) are embedded as base64 data URIs.

```bash
pnpm run test:offline
```

- Uses `TranscriptAssetDownloader` with a 10MB per-asset limit
- All asset categories enabled (attachments, embeds, avatars, emojis, guild icons, invite icons, role icons, server tag badges)
- The resulting HTML file works without any internet connection

---

### `generate-partial.ts` - Partial Transcript

Generates a transcript from only the last 50 messages using `generateFromMessages()` and saves the raw HTML string to disk (no channel send).

```bash
pnpm run test:partial
```

- Demonstrates `generateFromMessages` API usage
- Uses `ExportReturnType.String` for raw HTML output
- No message is sent to Discord; the file is saved locally only

---

### `generate-compressed.ts` - Compressed Transcript

Generates a transcript with image compression using `sharp`. All images are resized and converted to WebP format at 40% quality.

```bash
pnpm run test:compressed
```

- Requires `sharp` to be installed (`pnpm add -D sharp`)
- Uses `TranscriptImageDownloader` with 5MB max size and WebP compression
- Significantly smaller file size compared to the standard transcript

---

### `components-v2-send.ts` - Component Test Messages

Sends test messages containing Discord Components v2 (buttons, select menus, media galleries, rich layouts) to the specified channel for transcript rendering verification.

```bash
pnpm run test:send-components-v2
```

- Sends buttons (all 5 styles) and a string select menu
- Sends media gallery with 3 images and another with 10 images
- Sends a rich layout with sections, separators, thumbnails, and action rows

## Output

All generated transcript files are saved to the `output/` directory in the project root. A `debug_transcript.html` is also written to the project root for quick browser preview.

The `output/` directory is git-ignored.
