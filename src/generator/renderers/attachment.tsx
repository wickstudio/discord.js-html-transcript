import { DiscordAttachment, DiscordAttachments } from '@derockdev/discord-components-react';
import React from 'react';
import type { APIAttachment, APIMessage, Attachment as AttachmentType, Message } from 'discord.js';
import type { RenderMessageContext } from '..';
import type { AttachmentTypes, TranscriptAssetKind } from '../../types';
import { formatBytes } from '../../utils/utils';
import DiscordAttachmentGallery from './components/Attachment Gallery';

/**
 * Renders all attachments for a message
 * @param message
 * @param context
 * @returns
 */
export async function Attachments(props: { message: Message; context: RenderMessageContext; inline?: boolean }) {
  if (props.message.attachments.size === 0) return <></>;

  const attachments = Array.from(props.message.attachments.values());
  const isImageCollection =
    attachments.length > 1 &&
    attachments.every(
      (attachment) => !isVoiceMessage(attachment, props.message) && getAttachmentType(attachment) === 'image'
    );

  if (isImageCollection) {
    const images = await Promise.all(
      attachments.map(async (attachment) => ({
        id: attachment.id,
        url: await resolveAttachmentUrl(attachment, props.message, props.context),
        alt: attachment.name ?? undefined,
      }))
    );

    return (
      <DiscordAttachments {...(props.inline ? {} : { slot: 'attachments' })}>
        <DiscordAttachmentGallery items={images} />
      </DiscordAttachments>
    );
  }

  return (
    <DiscordAttachments {...(props.inline ? {} : { slot: 'attachments' })}>
      {attachments.map((attachment, id) => (
        <Attachment attachment={attachment} message={props.message} context={props.context} key={id} />
      ))}
    </DiscordAttachments>
  );
}

// "audio" | "video" | "image" | "file"
function getAttachmentType(attachment: AttachmentType): AttachmentTypes {
  const type = attachment.contentType?.split('/')?.[0] ?? 'unknown';
  if (['audio', 'video', 'image'].includes(type)) return type as AttachmentTypes;
  return 'file';
}

function getAttachmentAssetKind(type: AttachmentTypes): TranscriptAssetKind {
  switch (type) {
    case 'image':
      return 'attachment-image';
    case 'video':
      return 'attachment-video';
    case 'audio':
      return 'attachment-audio';
    case 'file':
      return 'attachment-file';
  }
}

function isVoiceMessage(attachment: AttachmentType, message: Message): boolean {
  if (message.flags && (message.flags.bitfield & 8192) === 8192) return true;
  if (attachment.waveform && attachment.duration) return true;
  return false;
}

async function resolveAttachmentUrl(attachment: AttachmentType, message: Message, context: RenderMessageContext) {
  const type = getAttachmentType(attachment);
  const attachmentJson = attachment.toJSON() as APIAttachment;
  const messageJson = message.toJSON() as APIMessage;

  if (type === 'image' && context.callbacks.resolveImageSrc) {
    const downloaded = await context.callbacks.resolveImageSrc(attachmentJson, messageJson);
    if (typeof downloaded === 'string') {
      return downloaded;
    }

    if (downloaded === null) {
      return attachment.url;
    }
  }

  return (
    (await context.callbacks.resolveTranscriptAssetUrl({
      kind: getAttachmentAssetKind(type),
      url: attachment.url,
      contentType: attachment.contentType,
      filename: attachment.name,
      size: attachment.size,
      width: attachment.width,
      height: attachment.height,
      attachment: attachmentJson,
      message: messageJson,
    })) ?? attachment.url
  );
}

/**
 * Renders one Discord Attachment
 * @param props - the attachment and rendering context
 */
export async function Attachment({
  attachment,
  context,
  message,
}: {
  attachment: AttachmentType;
  context: RenderMessageContext;
  message: Message;
}) {
  const url = await resolveAttachmentUrl(attachment, message, context);
  const name = attachment.name;
  const width = attachment.width;
  const height = attachment.height;

  // Voice messages must be checked before getAttachmentType since voice .ogg files would otherwise be "audio"
  if (isVoiceMessage(attachment, message)) {
    const DiscordVoiceMessage = (await import('./components/voice')).default;
    return <DiscordVoiceMessage attachment={attachment} />;
  }

  const type = getAttachmentType(attachment);

  if (type === 'file') {
    return (
      <div className="discord-custom-file-base" slot="attachment">
        <div className="discord-custom-file-icon">
          <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18 0H4C1.79086 0 0 1.79086 0 4V36C0 38.2091 1.79086 40 4 40H26C28.2091 40 30 38.2091 30 36V12L18 0Z"
              fill="#C9CDD3"
            />
            <path d="M18 0L30 12H18V0Z" fill="#88919E" />
          </svg>
        </div>
        <div className="discord-custom-file-inner">
          <a className="discord-custom-file-name" href={url} target="_blank" rel="noopener noreferrer">
            {name ?? 'file'}
          </a>
          <div className="discord-custom-file-size">{formatBytes(attachment.size)}</div>
        </div>
        <a className="discord-custom-file-download" href={url} download>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.293 9.29289C16.6835 8.90237 17.3167 8.90237 17.7072 9.29289C18.0977 9.68342 18.0977 10.3166 17.7072 10.7071L12.7072 15.7071C12.3167 16.0976 11.6835 16.0976 11.293 15.7071L6.29297 10.7071C5.90244 10.3166 5.90244 9.68342 6.29297 9.29289C6.68349 8.90237 7.31666 8.90237 7.70718 9.29289L11.0001 12.5858V2C11.0001 1.44772 11.4478 1 12.0001 1C12.5524 1 13.0001 1.44772 13.0001 2V12.5858L16.293 9.29289ZM3 19C2.44772 19 2 19.4477 2 20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20C22 19.4477 21.5523 19 21 19H3Z"
            />
          </svg>
        </a>
      </div>
    );
  }

  return (
    <DiscordAttachment
      type={type}
      size={formatBytes(attachment.size)}
      key={attachment.id}
      slot="attachment"
      url={url}
      alt={name ?? undefined}
      width={width ?? undefined}
      height={height ?? undefined}
    />
  );
}
