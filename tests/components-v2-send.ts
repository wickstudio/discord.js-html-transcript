import {
  Client,
  GatewayIntentBits,
  Events,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ComponentType,
  MessageFlags,
} from 'discord.js';
import { config } from 'dotenv';

config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

async function sendButtonsAndSelectMenu(channel: TextChannel) {
  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('primary_btn').setLabel('Primary').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('secondary_btn').setLabel('Secondary').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('success_btn').setLabel('Success').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('danger_btn').setLabel('Danger').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setLabel('Link').setURL('https://discord.com').setStyle(ButtonStyle.Link).setEmoji('🔗')
  );

  const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('string_select')
      .setPlaceholder('Make a selection!')
      .addOptions([
        { label: 'Option 1', description: 'The first option.', value: 'option_1', emoji: '1️⃣' },
        { label: 'Option 2', description: 'The second option.', value: 'option_2', emoji: '2️⃣' },
      ])
  );

  await channel.send({
    content: 'Testing standard buttons and a string select menu.',
    components: [buttons, selectMenu],
  });
}

async function sendMediaGallery(channel: TextChannel) {
  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [
      {
        type: ComponentType.Container,
        components: [
          {
            type: ComponentType.MediaGallery,
            items: [
              { media: { url: 'https://placehold.co/400x800.png?text=Tall' }, description: 'Image 1' },
              { media: { url: 'https://placehold.co/400x400.png?text=Square+1' }, description: 'Image 2' },
              { media: { url: 'https://placehold.co/400x400.png?text=Square+2' }, description: 'Image 3' },
            ],
          },
        ],
      },
    ],
  });

  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [
      {
        type: ComponentType.Container,
        components: [
          {
            type: ComponentType.MediaGallery,
            items: Array.from({ length: 10 }, (_, i) => ({
              media: { url: `https://placehold.co/300x300.png?text=Image+${i + 1}` },
              description: `Image ${i + 1}`,
            })),
          },
        ],
      },
    ],
  });
}

async function sendRichLayout(channel: TextChannel) {
  await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [
      {
        type: ComponentType.Container,
        components: [
          {
            type: ComponentType.TextDisplay,
            content: 'Hello world',
          },
          {
            type: ComponentType.Section,
            components: [
              {
                type: ComponentType.TextDisplay,
                content: '**This is a Section Header**\nThis section has a button accessory.',
              },
            ],
            accessory: { type: ComponentType.Button, style: 1, label: 'Click Me', custom_id: 'section_btn_1' },
          },
          { type: ComponentType.Separator, divider: true, spacing: 2 },
          {
            type: ComponentType.Section,
            components: [
              { type: ComponentType.TextDisplay, content: 'This section has a `Thumbnail` with _markdown_.' },
            ],
            accessory: {
              type: ComponentType.Thumbnail,
              media: { url: 'https://placehold.co/85.png?text=Thumb' },
            },
          },
          {
            type: ComponentType.ActionRow,
            components: [
              { type: ComponentType.Button, style: 2, label: 'Final Action', custom_id: 'final_action_btn' },
            ],
          },
        ],
      },
    ],
  });
}

client.once(Events.ClientReady, async (c) => {
  console.log(`Logged in as ${c.user.tag}`);

  const channelId = process.env.CHANNEL;
  if (!channelId) {
    console.error('CHANNEL environment variable is not set.');
    process.exit(1);
  }

  try {
    const channel = await client.channels.fetch(channelId);

    if (!channel || !(channel instanceof TextChannel)) {
      console.error(`Could not find text channel: ${channelId}`);
      process.exit(1);
    }

    console.log(`Running component tests in #${channel.name}...`);

    await sendButtonsAndSelectMenu(channel);
    console.log('  Sent buttons & select menu');

    await sendMediaGallery(channel);
    console.log('  Sent media gallery');

    await sendRichLayout(channel);
    console.log('  Sent rich layout');

    console.log('All component tests sent.');
  } catch (error) {
    console.error('Failed to run tests:', error);
  } finally {
    client.destroy();
  }
});

const token = process.env.TOKEN;
if (!token) {
  console.error('TOKEN environment variable is not set.');
  process.exit(1);
}

client.login(token);
