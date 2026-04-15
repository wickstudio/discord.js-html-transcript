import type { ResolveAssetCallback, TranscriptAsset } from '../types';
import debug from 'debug';
import { request } from 'undici';

/**
 * Builder to build a generic asset saving callback.
 */
export class TranscriptAssetDownloader {
  private static log = debug('discord-html-transcripts:TranscriptAssetDownloader');
  private log = TranscriptAssetDownloader.log;

  private maxFileSize?: number; // in kilobytes

  /**
   * Sets the maximum file size for each downloaded asset.
   * @param size The maximum file size in kilobytes
   */
  withMaxSize(size: number) {
    this.maxFileSize = size;
    return this;
  }

  /**
   * Builds the asset saving callback.
   */
  build(): ResolveAssetCallback {
    return async (asset: TranscriptAsset) => {
      if (!asset.url || asset.url.startsWith('data:')) {
        return asset.url;
      }

      if (this.maxFileSize && asset.size && asset.size > this.maxFileSize * 1024) {
        return undefined;
      }

      this.log(`Fetching ${asset.kind}: ${asset.url}`);
      const response = await request(asset.url).catch((err) => {
        console.error(`[discord-html-transcripts] Failed to download asset for transcript: `, err);
        return null;
      });

      if (!response) {
        return undefined;
      }

      const mimeType = response.headers['content-type'] ?? 'application/octet-stream';
      const buffer = await response.body.arrayBuffer().then((res) => Buffer.from(res));
      this.log(`Finished fetching ${asset.kind} (${buffer.length} bytes)`);

      return `data:${mimeType};base64,${buffer.toString('base64')}`;
    };
  }
}
