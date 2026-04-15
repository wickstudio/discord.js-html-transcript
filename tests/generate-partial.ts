import * as discord from 'discord.js';
import { generateFromMessages, ExportReturnType } from '../src';
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
const MESSAGE_LIMIT = 50;

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

  console.log(`Fetching last ${MESSAGE_LIMIT} messages...`);
  const messages = await (channel as discord.TextChannel).messages.fetch({ limit: MESSAGE_LIMIT });
  console.log(`Fetched ${messages.size} messages.`);

  console.time('partial-transcript');

  const html = await generateFromMessages(messages, channel, {
    returnType: ExportReturnType.String,
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

  console.timeEnd('partial-transcript');

  const outputPath = path.join(OUTPUT_DIR, `partial-transcript-${channel.id}.html`);
  fs.writeFileSync(outputPath, html as string, 'utf-8');
  console.log(`Saved partial transcript to ${outputPath} (${((html as string).length / 1024).toFixed(1)} KB)`);

  client.destroy();
  process.exit(0);
});

client.login(process.env.TOKEN!);
