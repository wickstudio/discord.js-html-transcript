import React from 'react';
import type { RenderMessageContext } from '../..';

async function DiscordThumbnail({ url, context }: { url: string; context: RenderMessageContext }) {
  const resolvedUrl =
    (await context.callbacks.resolveTranscriptAssetUrl({
      kind: 'component-thumbnail',
      url,
    })) ?? url;

  return (
    <img
      src={resolvedUrl}
      alt="Thumbnail"
      style={{
        width: '85px',
        height: '85px',
        objectFit: 'cover',
        borderRadius: '8px',
      }}
    />
  );
}

export default DiscordThumbnail;
