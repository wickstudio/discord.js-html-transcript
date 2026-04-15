import { DiscordActionRow, DiscordAttachment, DiscordSpoiler } from '@derockdev/discord-components-react';
import {
  ComponentType,
  type ThumbnailComponent,
  type MessageActionRowComponent,
  type TopLevelComponent,
} from 'discord.js';
import React from 'react';
import { parseDiscordEmoji } from '../../utils/utils';
import DiscordSelectMenu from './components/Select Menu';
import DiscordContainer from './components/Container';
import DiscordSection from './components/section/Section';
import DiscordMediaGallery from './components/Media Gallery';
import DiscordSeparator from './components/Spacing';
import DiscordButton from './components/Button';
import DiscordThumbnail from './components/Thumbnail';
import MessageContent from './content';
import { RenderType } from './content';
import type { RenderMessageContext } from '..';
import { ButtonStyleMapping } from './components/styles';

export default async function ComponentRow({
  component,
  id,
  context,
}: {
  component: TopLevelComponent;
  id: number;
  context: RenderMessageContext;
}) {
  switch (component.type) {
    case ComponentType.ActionRow:
      return (
        <DiscordActionRow key={id}>
          <>
            {component.components.map((nestedComponent, id) => (
              <Component component={nestedComponent} id={id} key={id} context={context} />
            ))}
          </>
        </DiscordActionRow>
      );

    case ComponentType.Container:
      return (
        <DiscordContainer key={id} accentColor={component.hexAccentColor ?? undefined}>
          <>
            {component.components.map((nestedComponent, id) => (
              <ComponentRow component={nestedComponent} id={id} key={id} context={context} />
            ))}
          </>
        </DiscordContainer>
      );

    case ComponentType.File:
      return (
        <>
          {component.spoiler ? (
            <DiscordSpoiler key={component.id} slot="attachment">
              <DiscordAttachment
                type="file"
                key={component.id}
                slot="attachment"
                url={
                  (await context.callbacks.resolveTranscriptAssetUrl({
                    kind: 'component-file',
                    url: component.file.url,
                  })) ?? component.file.url
                }
                alt="Discord Attachment"
              />
            </DiscordSpoiler>
          ) : (
            <DiscordAttachment
              type="file"
              key={component.id}
              slot="attachment"
              url={
                (await context.callbacks.resolveTranscriptAssetUrl({
                  kind: 'component-file',
                  url: component.file.url,
                })) ?? component.file.url
              }
              alt="Discord Attachment"
            />
          )}
        </>
      );

    case ComponentType.MediaGallery:
      return <DiscordMediaGallery component={component} context={context} key={id} />;

    case ComponentType.Section:
      return (
        <DiscordSection key={id} accessory={component.accessory} id={id} context={context}>
          {component.components.map((nestedComponent, id) => (
            <ComponentRow component={nestedComponent} id={id} key={id} context={context} />
          ))}
        </DiscordSection>
      );

    case ComponentType.Separator:
      return <DiscordSeparator key={id} spacing={component.spacing} divider={component.divider} />;

    case ComponentType.TextDisplay:
      return (
        <div
          key={id}
          style={{
            width: '100%',
            minWidth: 0,
          }}
        >
          <MessageContent content={component.content} context={{ ...context, type: RenderType.NORMAL }} />
        </div>
      );

    default:
      return null;
  }
}

export async function Component({
  component,
  id,
  context,
}: {
  component: MessageActionRowComponent | ThumbnailComponent;
  id: number;
  context: RenderMessageContext;
}) {
  switch (component.type) {
    case ComponentType.Button:
      return (
        <DiscordButton
          key={id}
          type={ButtonStyleMapping[component.style as keyof typeof ButtonStyleMapping]}
          url={component.url ?? undefined}
          emoji={
            component.emoji
              ? ((await context.callbacks.resolveTranscriptAssetUrl({
                  kind: 'emoji',
                  url: parseDiscordEmoji(component.emoji),
                })) ?? parseDiscordEmoji(component.emoji))
              : undefined
          }
        >
          {component.label}
        </DiscordButton>
      );

    case ComponentType.StringSelect:
    case ComponentType.UserSelect:
    case ComponentType.RoleSelect:
    case ComponentType.MentionableSelect:
    case ComponentType.ChannelSelect:
      return <DiscordSelectMenu key={id} component={component} context={context} />;

    case ComponentType.Thumbnail:
      return <DiscordThumbnail key={id} url={component.media.url} context={context} />;

    default:
      return undefined;
  }
}
