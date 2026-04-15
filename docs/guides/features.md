# Feature Toggles

`discord.js-html-transcript` includes several built-in UI features that can be individually enabled or disabled via the `features` option.

## Available Features

### 🔍 Search (`search`)

Adds a built-in search bar to the transcript that allows users to find specific messages by content.

- Highlights matching messages with a visual indicator
- Navigation buttons to jump between matches
- Shows total match count

**Default:** `true`

### 🖼️ Image Preview (`imagePreview`)

Enables a click-to-open lightbox for images. When a user clicks an image attachment or embed image, it opens in a fullscreen overlay with a dark background.

- Works with image attachments, embed images, and media gallery items
- Close with the X button or by clicking outside the image
- Optimized for both desktop and mobile

**Default:** `true`

### 👁️ Spoiler Reveal (`spoilerReveal`)

Allows spoiler-tagged content to be revealed by clicking on it, matching Discord's native behavior.

**Default:** `true`

### 🔗 Message Links (`messageLinks`)

Enables click-to-scroll behavior for reply references. When a user clicks on a reply preview, the page scrolls to the original message and highlights it briefly.

**Default:** `true`

### 🏷️ Profile Badges (`profileBadges`)

Enables post-render injection of:
- **APP badges** - Normalizes the old "BOT" badge to Discord's modern "APP" badge
- **Server tags** - Custom server tag badges displayed next to usernames
- **Role icons** - Highest-role icon images next to usernames

**Default:** `true`

### 🎨 Embed Tweaks (`embedTweaks`)

Applies client-side fixes to embed borders and styling that can't be controlled through the component library's server-side rendering.

**Default:** `true`

## Usage

```javascript
const transcript = await discordTranscripts.createTranscript(channel, {
  features: {
    search: true,          // enable search bar
    imagePreview: true,    // enable image lightbox
    spoilerReveal: true,   // enable spoiler click-to-reveal
    messageLinks: true,    // enable reply scroll behavior
    profileBadges: true,   // enable APP badges, server tags, role icons
    embedTweaks: true,     // enable embed style fixes
  },
});
```

### Disabling All Features

```javascript
const transcript = await discordTranscripts.createTranscript(channel, {
  features: {
    search: false,
    imagePreview: false,
    spoilerReveal: false,
    messageLinks: false,
    profileBadges: false,
    embedTweaks: false,
  },
});
```

This produces a minimal, static transcript with no interactive JavaScript.
