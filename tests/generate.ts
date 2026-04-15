import * as discord from 'discord.js';
import { createTranscript, ExportReturnType } from '../src';
import * as fs from 'fs';
import * as path from 'path';

import { config } from 'dotenv';
config();

const { GuildMessages, Guilds, MessageContent } = discord.GatewayIntentBits;

const client = new discord.Client({
  intents: [GuildMessages, Guilds, MessageContent],
});

const OUTPUT_DIR = path.resolve(__dirname, '..', 'output');
const CHANNEL_ID = process.env.CHANNEL!;

client.on('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  console.log(`Fetching channel: ${CHANNEL_ID}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  if (!channel || !channel.isTextBased()) {
    console.error('Invalid channel provided.');
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.time('transcript');

  const attachment = await createTranscript(channel as discord.TextChannel, {
    returnType: ExportReturnType.Attachment,
    filename: `transcript-${channel.id}.html`,
    limit: -1,
    poweredBy: true,
    footerText: 'Exported {number} message{s}.',
    features: {
      search: true,
      imagePreview: true,
      spoilerReveal: true,
      messageLinks: true,
      profileBadges: true,
      embedTweaks: true,
    },
  });

  console.timeEnd('transcript');

  const htmlBuffer = attachment.attachment;
  if (Buffer.isBuffer(htmlBuffer)) {
    const outputPath = path.join(OUTPUT_DIR, `transcript-${channel.id}.html`);
    fs.writeFileSync(outputPath, htmlBuffer);
    console.log(`Saved transcript to ${outputPath} (${(htmlBuffer.length / 1024).toFixed(1)} KB)`);

    const debugPath = path.resolve(__dirname, '..', 'debug_transcript.html');
    fs.writeFileSync(debugPath, htmlBuffer);
    console.log(`Saved debug copy to ${debugPath}`);
  }

  await (channel as discord.TextChannel).send({
    content: `Transcript generated (${new Date().toLocaleString()})`,
    files: [attachment],
  });

  console.log('Transcript sent to channel.');
  client.destroy();
  process.exit(0);
});

client.login(process.env.TOKEN!);
