# createTranscript

Fetches messages from a Discord channel and generates a beautiful HTML transcript.

## Example

{% tabs %}
{% tab title="JavaScript" %}
{% code lineNumbers="true" %}

```javascript
const discordTranscripts = require('discord.js-html-transcript');

client.on('messageCreate', async (message) => {
  if (message.content === '!transcript') {
    const transcript = await discordTranscripts.createTranscript(
      message.channel,
      {
        returnType: 'attachment',
        filename: `transcript-${message.channel.id}.html`,
        limit: -1,
        features: {
          search: true,
          imagePreview: true,
        },
      }
    );

    await message.reply({
      content: '📄 Here is your transcript!',
      files: [transcript],
    });
  }
});
```

{% endcode %}
{% endtab %}

{% tab title="TypeScript" %}
{% code lineNumbers="true" %}

```typescript
import * as discordTranscripts from 'discord.js-html-transcript';
import { ExportReturnType } from 'discord.js-html-transcript';

client.on('messageCreate', async (message) => {
  if (message.content === '!transcript') {
    const transcript = await discordTranscripts.createTranscript(
      message.channel,
      {
        returnType: ExportReturnType.Attachment,
        filename: `transcript-${message.channel.id}.html`,
        limit: -1,
        features: {
          search: true,
          imagePreview: true,
        },
      }
    );

    await message.reply({
      content: '📄 Here is your transcript!',
      files: [transcript],
    });
  }
});
```

{% endcode %}
{% endtab %}
{% endtabs %}

## Parameters

```javascript
createTranscript(channel, options = {});
```

### `channel: TextBasedChannel`

Defined in [discord.js](https://discord.js.org/#/docs/discord.js/main/typedef/GuildTextBasedChannel) as `TextChannel | NewsChannel | ThreadChannel | VoiceChannel`.

This is the channel that `discord.js-html-transcript` will fetch messages from.

### `options: CreateTranscriptOptions`

Extends all options from [generateFromMessages](generatefrommessages.md) plus the following:

### `options.limit: number`

The maximum number of messages to fetch. Set to `-1` to fetch all messages recursively.

**Default:** `-1` (fetch all)

### `options.filter: (message: Message<boolean>) => boolean`

A function called for each message to determine if it should be included in the transcript. Return `false` to exclude a message.

```javascript
// Example: exclude bot messages
filter: (message) => !message.author.bot
```

**Default:** `() => true` (include all messages)
