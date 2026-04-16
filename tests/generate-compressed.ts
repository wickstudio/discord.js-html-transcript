import * as discord from 'discord.js';
import { createTranscript, ExportReturnType, TranscriptImageDownloader } from '../src';
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

  console.time('compressed-transcript');

  const attachment = await createTranscript(channel as discord.TextChannel, {
    returnType: ExportReturnType.Attachment,
    filename: `compressed-transcript-${channel.id}.html`,
    limit: -1,
    poweredBy: true,
    callbacks: {
      resolveImageSrc: new TranscriptImageDownloader().withMaxSize(5120).withCompression(40, true).build(),
    },
    features: {
      search: true,
      imagePreview: true,
      spoilerReveal: true,
      messageLinks: true,
      profileBadges: true,
      embedTweaks: true,
    },
  });

  console.timeEnd('compressed-transcript');

  const htmlBuffer = attachment.attachment;
  if (Buffer.isBuffer(htmlBuffer)) {
    const outputPath = path.join(OUTPUT_DIR, `compressed-transcript-${channel.id}.html`);
    fs.writeFileSync(outputPath, htmlBuffer);
    console.log(`Saved compressed transcript to ${outputPath} (${(htmlBuffer.length / 1024).toFixed(1)} KB)`);
  }

  await (channel as discord.TextChannel).send({
    content: `Compressed transcript generated (${new Date().toLocaleString()})`,
    files: [attachment],
  });

  console.log('Compressed transcript sent to channel.');
  client.destroy();
  process.exit(0);
});

client.login(process.env.TOKEN!);
