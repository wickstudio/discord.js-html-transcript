# Image Compression

When saving images with `saveImages` or `assets.attachments`, image files are stored as-is by default. You can optionally enable compression to reduce transcript file size.

## Requirements

Install the `sharp` package as a dependency:

```bash
npm install sharp
```

## Usage

Use the built-in `TranscriptImageDownloader` class:

```javascript
const { TranscriptImageDownloader } = require('discord.js-html-transcript');

const transcript = await discordTranscripts.createTranscript(channel, {
  callbacks: {
    resolveImageSrc: new TranscriptImageDownloader()
      .withMaxSize(5120)          // skip images larger than 5MB (in KB)
      .withCompression(40, true)  // 40% quality, convert to WebP
      .build(),
  },
});
```

## Options

### `.withMaxSize(sizeInKB: number)`

Sets the maximum file size for downloaded images (in kilobytes). Images larger than this limit will be skipped and the original CDN URL will be used instead.

```javascript
new TranscriptImageDownloader()
  .withMaxSize(5120)  // 5MB max
```

### `.withCompression(quality: number, toWebP: boolean)`

Enables image compression using `sharp`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `quality` | `number` | Compression quality percentage (1-100). Lower = smaller files. |
| `toWebP` | `boolean` | Whether to convert images to WebP format for better compression. |

```javascript
new TranscriptImageDownloader()
  .withCompression(40, true)   // 40% quality, WebP format
```

### Combining Options

```javascript
new TranscriptImageDownloader()
  .withMaxSize(8192)            // 8MB max per image
  .withCompression(60, true)    // 60% quality, WebP format
  .build()
```

## File Size Impact

| Setting | Typical Reduction |
|---------|-------------------|
| No compression | Baseline |
| Quality 80, no WebP | ~30-40% smaller |
| Quality 60, WebP | ~60-70% smaller |
| Quality 40, WebP | ~75-85% smaller |

> **Tip:** Quality 40 with WebP conversion provides the best balance between file size and visual quality for most transcripts.
