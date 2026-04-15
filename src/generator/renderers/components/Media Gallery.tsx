import React from 'react';
import type { MediaGalleryComponent } from 'discord.js';
import type { RenderMessageContext } from '../..';
import { getGalleryLayout, getImageStyle } from './utils';

async function DiscordMediaGallery({
  component,
  context,
}: {
  component: MediaGalleryComponent;
  context: RenderMessageContext;
}) {
  if (!component.items || component.items.length === 0) {
    return null;
  }

  const count = component.items.length;
  const imagesToShow = await Promise.all(
    component.items.slice(0, 10).map(async (item) => ({
      ...item,
      media: {
        ...item.media,
        url:
          (await context.callbacks.resolveTranscriptAssetUrl({
            kind: 'component-image',
            url: item.media.url,
          })) ?? item.media.url,
      },
    }))
  );
  const hasMore = component.items.length > 10;

  return (
    <div style={getGalleryLayout(count)}>
      {imagesToShow.map((media, idx) => (
        <div key={idx} style={getImageStyle(idx, count)}>
          <img
            src={media.media.url}
            alt={media.data.description || 'Media content'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {hasMore && idx === imagesToShow.length - 1 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              +{component.items.length - 10}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DiscordMediaGallery;
