import type { ResolveImageCallback } from '../types';
import type { WebpOptions } from 'sharp';
import { request } from 'undici';
import debug from 'debug';
export type { ResolveImageCallback } from '../types';

/**
 * Builder to build a image saving callback.
 */
export class TranscriptImageDownloader {
  private static log = debug('discord-html-transcripts:TranscriptImageDownloader');
  private log = TranscriptImageDownloader.log;

  private maxFileSize?: number; // in kilobytes
  private compression?: {
    quality: number; // 1-100
    convertToWebP: boolean;
    options: Omit<WebpOptions, 'quality' | 'force'>;
  };

  /**
   * Sets the maximum file size for *each* individual image.
   * @param size The maximum file size in kilobytes
   */
  withMaxSize(size: number) {
    this.maxFileSize = size;
    return this;
  }

  /**
   * Sets the compression quality for each image. This requires `sharp` to be installed.
   * Optionally, images can be converted to WebP format which is smaller in size.
   * @param quality The quality of the image (1 lowest - 100 highest). Lower quality means smaller file size.
   * @param convertToWebP Whether to convert the image to WebP format
   */
  withCompression(quality = 80, convertToWebP = false, options: Omit<WebpOptions, 'quality' | 'force'> = {}) {
    if (quality < 1 || quality > 100) throw new Error('Quality must be between 1 and 100');

    // try and import sharp
    import('sharp').catch((err) => {
      console.error(err);
      console.error(
        `[discord-html-transcripts] Failed to import 'sharp'. Image compression requires the 'sharp' package to be installed. Either install sharp or remove the compression options.`
      );
    });

    this.compression = { quality, convertToWebP, options };
    return this;
  }

  /**
   * Builds the image saving callback.
   */
  build(): ResolveImageCallback {
    return async (attachment) => {
      if (!attachment.width || !attachment.height) return undefined;

      if (this.maxFileSize && attachment.size > this.maxFileSize * 1024) return undefined;

      this.log(`Fetching attachment ${attachment.id}: ${attachment.url}`);
      const response = await request(attachment.url).catch((err) => {
        console.error(`[discord-html-transcripts] Failed to download image for transcript: `, err);
        return null;
      });

      if (!response) return undefined;

      const mimetype = response.headers['content-type'];
      const buffer = await response.body.arrayBuffer().then((res) => Buffer.from(res));
      this.log(`Finished fetching ${attachment.id} (${buffer.length} bytes)`);

      if (this.compression) {
        try {
          const sharp = await import('sharp');

          this.log(`Compressing ${attachment.id} with 'sharp'`);

          let pipeline = sharp.default(buffer);

          const metadata = await pipeline.metadata();
          if (metadata.width && metadata.width > 1200) {
            pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true });
          }

          const sharpbuf = await pipeline
            .webp({
              quality: this.compression.quality,
              force: this.compression.convertToWebP,
              effort: 6, // maximum compression effort
              smartSubsample: true,
              ...this.compression.options,
            })
            .toBuffer({ resolveWithObject: true });

          this.log(`Finished compressing ${attachment.id} (${sharpbuf.info.size} bytes)`);

          return `data:image/${sharpbuf.info.format};base64,${sharpbuf.data.toString('base64')}`;
        } catch (e) {
          this.log(`Advanced compression failed for ${attachment.id}, falling back safely:`, e);
          // fall through to uncompressed buffer below
        }
      }

      return `data:${mimetype};base64,${buffer.toString('base64')}`;
    };
  }
}
