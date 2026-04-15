import React from 'react';
import { getGalleryLayout, getImageStyle } from './utils';

export type AttachmentGalleryItem = {
  id: string;
  url: string;
  alt?: string;
};

export default function DiscordAttachmentGallery({ items }: { items: AttachmentGalleryItem[] }) {
  if (items.length === 0) {
    return null;
  }

  const imagesToShow = items.slice(0, 10);
  const hasMore = items.length > imagesToShow.length;
  const visibleCount = imagesToShow.length;
  const layout = {
    ...getGalleryLayout(visibleCount),
    gap: '2px',
    maxWidth: '610px',
  };

  return (
    <div className="discord-attachment-gallery" style={layout} slot="attachment">
      {imagesToShow.map((item, idx) => (
        <div key={item.id} className="discord-attachment-gallery-item" style={getImageStyle(idx, visibleCount)}>
          <img
            src={item.url}
            alt={item.alt ?? 'Image attachment'}
            className="discord-attachment-gallery-image"
            loading="lazy"
            decoding="async"
          />
          {hasMore && idx === imagesToShow.length - 1 && (
            <div className="discord-attachment-gallery-more">+{items.length - imagesToShow.length}</div>
          )}
        </div>
      ))}
    </div>
  );
}
