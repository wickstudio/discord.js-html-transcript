import type { CSSProperties } from 'react';
import { ButtonStyle } from 'discord.js';

// Container styles
export const containerStyle = {
  display: 'grid',
  gap: '4px',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '8px',
  overflow: 'hidden',
} satisfies CSSProperties;

// Base image style
export const baseImageStyle = {
  overflow: 'hidden',
  position: 'relative',
  background: '#2b2d31',
} satisfies CSSProperties;

// Button style mapping
export const ButtonStyleMapping = {
  [ButtonStyle.Primary]: 'primary',
  [ButtonStyle.Secondary]: 'secondary',
  [ButtonStyle.Success]: 'success',
  [ButtonStyle.Danger]: 'destructive',
  [ButtonStyle.Link]: 'link',
} as const;

export const globalStyles = `
  .discord-container {
    display: grid;
    gap: 4px;
    width: 100%;
    max-width: 500px;
    border-radius: 8px;
    overflow: hidden;
  }

  .discord-base-image {
    overflow: hidden;
    position: relative;
    background: #2b2d31;
  }

  .discord-action-row {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 500px;
  }

  [slot="components"] {
    width: 100%;
  }

  .discord-button {
    color: #ffffff !important;
    padding: 0 14px;
    border-radius: 8px;
    text-decoration: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
    height: 34px;
    min-height: 34px;
    min-width: 78px;
    cursor: pointer;
    font-family: 'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid transparent;
    outline: none;
    transition: background-color 0.17s ease, border-color 0.17s ease, color 0.17s ease;
    white-space: nowrap;
    flex: 0 0 auto;
    gap: 8px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .discord-button:hover {
    text-decoration: none !important;
  }

  .discord-button-content,
  .discord-button-launch {
    display: inline-flex;
    align-items: center;
  }

  .discord-button-content {
    gap: 8px;
  }

  .discord-button-emoji {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .discord-button-label {
    line-height: 1;
  }

  .discord-button-launch {
    color: inherit;
    opacity: 0.9;
  }

  .discord-button:active {
    transform: translateY(1px);
  }

  .discord-button-primary {
    background-color: #5865f2;
  }
  .discord-button-primary:hover {
    background-color: #4752c4;
  }

  .discord-button-secondary {
    background-color: #4e5058;
  }
  .discord-button-secondary:hover {
    background-color: #6d6f78;
  }

  .discord-button-success {
    background-color: #248046;
  }
  .discord-button-success:hover {
    background-color: #1a6334;
  }

  .discord-button-destructive {
    background-color: #da373c;
  }
  .discord-button-destructive:hover {
    background-color: #a12828;
  }

  .discord-button-link {
    background-color: #2b2d31;
    border-color: #3f4147;
    color: #dbdee1 !important;
    min-width: 0;
  }
  .discord-button-link:hover {
    background-color: #35373c;
    border-color: #4f545c;
  }

  .discord-select-menu {
    position: relative;
    width: 100%;
    max-width: 500px;
    min-width: 0;
    height: 40px;
    background-color: #1e1f22;
    border-radius: 8px;
    color: #dbdee1;
    cursor: pointer;
    font-family: 'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    justify-content: space-between;
    box-sizing: border-box;
    border: 1px solid #3f4147;
    transition: border-color 0.2s, background-color 0.2s;
    flex: 1 1 auto;
  }

  .discord-select-menu:hover {
    background-color: #232428;
    border-color: #4f545c;
  }

  .discord-select-menu-label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #dbdee1;
    font-weight: 500;
  }

  .discord-select-menu-chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
    color: #b5bac1;
  }

  .discord-select-menu-options {
    display: none;
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    background-color: #2b2d31;
    border-radius: 8px;
    z-index: 10;
    border: 1px solid #1e1f22;
    max-height: 320px;
    overflow-y: auto;
    box-shadow: 0 8px 16px rgba(0,0,0,0.24);
  }

  .discord-select-menu-options.open {
    display: block;
  }

  .discord-select-menu-option {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.1s;
    color: #dbdee1;
  }

  .discord-select-menu-option-emoji {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .discord-select-menu-option:hover {
    background-color: #3f4147;
    color: #ffffff;
  }

  .discord-attachment-gallery {
    width: 100%;
    max-width: 610px;
    border-radius: 8px;
    overflow: hidden;
  }

  .discord-attachment-gallery-item {
    position: relative;
    overflow: hidden;
    background: #2b2d31;
  }

  .discord-attachment-gallery-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: zoom-in;
  }

  .discord-attachment-gallery-more {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
  }

  .discord-message .discord-attachments > discord-attachment[type="file"] {
    display: block;
    width: auto;
    max-width: min(520px, 100%);
  }

  .discord-custom-file-base {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: min(520px, 100%);
    min-width: 0;
    justify-self: stretch; /* fixes the derockdev discord-attachments grid expanding */
    padding: 16px;
    background-color: #2b2d31;
    border: 1px solid #1e1f22;
    border-radius: 8px;
    box-sizing: border-box;
    gap: 16px;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .discord-custom-file-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .discord-custom-file-inner {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    gap: 2px;
  }

  .discord-custom-file-name {
    color: #00a8fc;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.25;
    text-decoration: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }

  .discord-custom-file-name:hover {
    text-decoration: underline;
  }

  .discord-custom-file-size {
    color: #8da3b9;
    font-size: 14px;
    line-height: 1.25;
  }

  .discord-custom-file-download {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 8px;
    cursor: pointer;
    color: #b5bac1;
    transition: color 0.15s ease;
  }

  .discord-custom-file-download:hover {
    color: #dbdee1;
  }

  .discord-custom-file-download svg {
    width: 24px;
    height: 24px;
  }

  .discord-image-preview-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(5, 5, 7, 0.88);
    backdrop-filter: blur(8px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.16s ease;
    z-index: 9999;
  }

  .discord-image-preview-overlay.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .discord-image-preview-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    max-width: min(100vw - 48px, 1440px);
    max-height: min(100vh - 48px, 1100px);
  }

  .discord-image-preview-image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
    background: #111214;
  }

  .discord-image-preview-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 999px;
    background: rgba(32, 34, 37, 0.9);
    color: #f2f3f5;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.16s ease, transform 0.16s ease;
  }

  .discord-image-preview-close:hover {
    background: rgba(49, 51, 56, 0.96);
  }

  .discord-image-preview-close:active {
    transform: scale(0.97);
  }

  .discord-transcript-header-bar {
    position: sticky;
    top: 0;
    z-index: 9200;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 48px;
    padding: 8px 16px;
    background: rgba(7, 7, 9, 0.96);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(16px);
    box-sizing: border-box;
  }

  .discord-transcript-header-main {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    flex: 1 1 auto;
  }

  .discord-transcript-header-server-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    flex: 0 0 auto;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .discord-transcript-header-glyph,
  .discord-transcript-header-avatar {
    width: 24px;
    height: 24px;
    flex: 0 0 auto;
  }

  .discord-transcript-header-glyph {
    color: #b5bac1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .discord-transcript-header-glyph--hash {
    font-size: 24px;
    font-weight: 500;
    line-height: 1;
    transform: translateY(-1px);
  }

  .discord-transcript-header-avatar {
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .discord-transcript-header-copy {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    white-space: nowrap;
  }

  .discord-transcript-header-title {
    color: #f2f3f5;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    flex: 0 0 auto;
  }

  .discord-transcript-header-separator {
    color: #4e5058;
    flex: 0 0 auto;
  }

  .discord-transcript-header-topic {
    color: #949ba4;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .discord-transcript-header-topic > * {
    display: inline;
  }

  .discord-transcript-header-tools {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    flex: 0 1 auto;
    min-width: 0;
  }

  .discord-transcript-header-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 0 0 auto;
  }

  .discord-transcript-header-tool {
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: #b5bac1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    transition: background-color 0.16s ease, color 0.16s ease;
  }

  .discord-transcript-header-tool:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f2f3f5;
  }

  .discord-transcript-header-search-slot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
    flex: 0 1 auto;
  }

  .discord-transcript-header-search-slot .discord-transcript-search-shell {
    position: static;
    top: auto;
    right: auto;
    max-width: none;
    align-items: center;
  }

  .discord-transcript-header-search-slot .discord-transcript-search {
    position: relative;
    overflow: visible;
    transform-origin: center right;
  }

  .discord-transcript-header-search-slot .discord-transcript-search-bar {
    box-shadow: none;
  }

  .discord-transcript-header-search-slot .discord-transcript-search-meta {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: max-content;
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    background: rgba(17, 18, 20, 0.98);
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(16px);
  }

  .discord-transcript-search-shell {
    position: fixed;
    top: calc(env(safe-area-inset-top) + 16px);
    right: calc(env(safe-area-inset-right) + 16px);
    z-index: 9500;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 0;
    max-width: calc(100vw - 24px);
  }

  .discord-transcript-search-shell.is-open {
    gap: 8px;
  }

  .discord-transcript-search-toggle {
    width: 42px;
    height: 42px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    background: rgba(17, 18, 20, 0.92);
    color: #dbdee1;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 18px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(14px);
    transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, transform 0.16s ease;
  }

  .discord-transcript-search-toggle:hover {
    background: rgba(27, 28, 32, 0.96);
    border-color: rgba(255, 255, 255, 0.14);
  }

  .discord-transcript-search-toggle:active {
    transform: translateY(1px);
  }

  .discord-transcript-search-shell.is-open .discord-transcript-search-toggle {
    color: #ffffff;
    border-color: rgba(88, 101, 242, 0.35);
    background: rgba(36, 38, 43, 0.96);
  }

  .discord-transcript-search {
    width: 0;
    max-width: 0;
    display: grid;
    gap: 6px;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    box-sizing: border-box;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px) scale(0.98);
    transform-origin: top right;
    pointer-events: none;
    transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s ease, width 0.16s ease, max-width 0.16s ease;
  }

  .discord-transcript-search-shell.is-open .discord-transcript-search {
    width: min(248px, calc(100vw - 84px));
    max-width: min(248px, calc(100vw - 84px));
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  .discord-transcript-search-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    height: 36px;
    padding: 0 8px 0 12px;
    border-radius: 8px;
    border: 1px solid #2b2d31;
    background: rgba(10, 11, 13, 0.98);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
    box-sizing: border-box;
    transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
  }

  .discord-transcript-search-bar:focus-within {
    border-color: #3f4147;
    box-shadow: 0 0 0 1px rgba(88, 101, 242, 0.18), 0 12px 28px rgba(0, 0, 0, 0.24);
    background: #070709;
  }

  .discord-transcript-search-input {
    min-width: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 0;
    border: 0;
    background: transparent;
    color: #f2f3f5;
    font: inherit;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
  }

  .discord-transcript-search-input::placeholder {
    color: #949ba4;
  }

  .discord-transcript-search-submit {
    width: 28px;
    height: 28px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: #aeb4bb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex: 0 0 auto;
    transition: background-color 0.16s ease, color 0.16s ease;
  }

  .discord-transcript-search-submit:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #f2f3f5;
  }

  .discord-transcript-search-meta {
    display: none;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
    padding: 0 2px;
  }

  .discord-transcript-search.has-query .discord-transcript-search-meta {
    display: flex;
  }

  .discord-transcript-search-actions {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
  }

  .discord-transcript-search-count {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    color: #b5bac1;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    flex: 1 1 auto;
  }

  .discord-transcript-search-button {
    height: 30px;
    min-width: 30px;
    padding: 0 8px;
    border-radius: 8px;
    border: 1px solid #2b2d31;
    background: rgba(30, 31, 34, 0.92);
    color: #c9ced6;
    font: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.16s ease, border-color 0.16s ease, opacity 0.16s ease;
  }

  .discord-transcript-search-button:hover:not(:disabled) {
    background: #2b2d31;
    border-color: #3f4147;
  }

  .discord-transcript-search-button:disabled {
    cursor: default;
    opacity: 0.45;
  }

  .discord-transcript-search-button--ghost {
    color: #b5bac1;
  }

  .discord-transcript-search-hint {
    display: none;
  }

  discord-message.discord-search-match {
    background: rgba(88, 101, 242, 0.08);
    border-radius: 8px;
    transition: background-color 0.16s ease, box-shadow 0.16s ease;
  }

  discord-message.discord-search-match--active {
    background: rgba(88, 101, 242, 0.14);
    box-shadow: 0 0 0 1px rgba(88, 101, 242, 0.55), 0 0 0 6px rgba(88, 101, 242, 0.12);
  }

  body[data-transcript-image-preview="true"] discord-attachment[type="image"] {
    cursor: zoom-in;
  }

  body[data-transcript-image-preview="true"] .discord-embed-image img,
  body[data-transcript-image-preview="true"] [slot="components"] img:not(.discord-button-emoji):not(.discord-select-menu-option-emoji):not(.discord-server-tag-badge),
  body[data-transcript-image-preview="true"] .discord-container img:not(.discord-button-emoji):not(.discord-select-menu-option-emoji):not(.discord-server-tag-badge) {
    cursor: zoom-in;
  }

  /* Background colors */
  body,
  .discord-dark-theme,
  .discord-light-theme,
  discord-messages,
  .discord-messages {
    background-color: #070709 !important;
  }
  .discord-message {
    background-color: transparent !important;
  }
  .discord-message:hover {
    background-color: #242428 !important;
  }
  .discord-message::selection,
  .discord-message *::selection {
    background-color: #242428;
    color: inherit;
  }
  
  /* Embed borders */
  .discord-embed .discord-embed-wrapper,
  [class*="discord-embed"] [class*="discord-embed-wrapper"],
  discord-embed .discord-embed-wrapper,
  discord-embed > .discord-embed > .discord-embed-wrapper {
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-radius: 4px !important;
  }

  /* APP badge */
  .discord-application-tag[data-transcript-app-tag-kind="bot"] {
    font-size: 0px !important;
    letter-spacing: 0 !important;
  }
  .discord-application-tag[data-transcript-app-tag-kind="bot"]::after {
    content: "APP";
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    vertical-align: middle;
  }

  /* Discord Server Tags */
  .discord-server-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 6px;
    padding: 2px 6px 2px 4px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(17, 18, 20, 0.55);
    color: #dbdee1;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    vertical-align: middle;
    white-space: nowrap;
  }
  .discord-server-tag-badge {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  .discord-server-tag-text {
    letter-spacing: 0.02em;
  }
  .discord-message .discord-author-info .discord-author-role-icon {
    border-radius: 4px;
    object-fit: cover;
  }
  .discord-author-info .discord-server-tag + .discord-author-role-icon {
    margin-left: 0.375rem;
  }
  .discord-replied-message .discord-author-role-icon {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    border-radius: 4px;
    object-fit: cover;
    flex: 0 0 auto;
  }
  .discord-replied-message .discord-server-tag {
    margin-left: 4px;
    padding: 1px 5px 1px 3px;
    font-size: 9px;
  }
  .discord-replied-message .discord-server-tag-badge {
    width: 12px;
    height: 12px;
  }
  .discord-light-theme .discord-server-tag {
    border-color: rgba(116, 127, 141, 0.18);
    background: rgba(116, 127, 141, 0.12);
    color: #4f5660;
  }

  @media (min-width: 901px) {
    .discord-transcript-search-toggle {
      display: none;
    }

    .discord-transcript-search {
      opacity: 1;
      visibility: visible;
      transform: none;
      pointer-events: auto;
      width: 240px;
    }
  }

  /* Mention Highlight Colors */
  .discord-message.discord-highlight-mention,
  .discord-message.discord-highlight {
    background-color: rgba(250, 166, 26, 0.1) !important;
  }
  .discord-message.discord-highlight::before,
  .discord-message.discord-highlight-mention::before {
    background-color: #faa61a !important;
  }

  /* Heading line-height fix */
  .discord-message h1, .discord-message h2, .discord-message h3 {
    line-height: normal !important;
    margin-top: 16px !important;
    margin-bottom: 8px !important;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    html, body, .discord-messages {
      max-width: 100vw;
      overflow-x: clip;
    }
    
    .discord-embed .discord-embed-wrapper,
    [class*="discord-embed"] [class*="discord-embed-wrapper"],
    discord-embed .discord-embed-wrapper {
      max-width: calc(100vw - 32px) !important;
    }

    .discord-embed .discord-embed-media .discord-embed-video,
    .discord-embed .discord-embed-image img,
    .discord-embed .discord-embed-thumbnail img,
    .discord-attachment,
    discord-attachment,
    .discord-attachment-generic,
    .discord-attachment-generic-inner {
      max-width: 100% !important;
      height: auto !important;
      min-width: 0 !important;
    }

    .discord-embed .discord-embed-wrapper .discord-embed-grid {
      grid-template-columns: 1fr !important;
      padding: 0.5rem !important;
    }
    
    .discord-message {
      padding-right: 12px !important;
    }

    .discord-action-row {
      width: 100%;
    }

    .discord-select-menu {
      width: 100%;
      max-width: 100%;
      flex-basis: 100%;
    }

    .discord-image-preview-overlay {
      padding: 16px;
    }

    .discord-image-preview-close {
      top: calc(env(safe-area-inset-top) + 14px);
      right: calc(env(safe-area-inset-right) + 14px);
    }

    .discord-message .discord-author-info {
      flex-wrap: wrap;
      row-gap: 4px;
    }

    .discord-server-tag {
      margin-left: 4px;
      padding: 1px 5px 1px 3px;
      font-size: 9px;
    }

    .discord-server-tag-badge {
      width: 12px;
      height: 12px;
    }

    .discord-message .discord-author-info .discord-author-role-icon {
      width: 16px;
      height: 16px;
    }

    .discord-transcript-header-bar {
      gap: 10px;
      padding: 8px 12px;
    }

    .discord-transcript-header-server-icon {
      width: 23px;
      height: 23px;
    }

    .discord-transcript-header-copy {
      gap: 6px;
    }

    .discord-transcript-header-title {
      font-size: 15px;
    }

    .discord-transcript-header-topic {
      font-size: 13px;
    }

    .discord-transcript-header-actions {
      gap: 2px;
    }

    .discord-transcript-header-tool {
      width: 30px;
      height: 30px;
    }

    .discord-transcript-header-tool--hide-mobile {
      display: none;
    }

    .discord-transcript-search-shell {
      top: calc(env(safe-area-inset-top) + 12px);
      right: calc(env(safe-area-inset-right) + 12px);
      align-items: flex-end;
      gap: 8px;
    }

    .discord-transcript-header-search-slot .discord-transcript-search-shell {
      top: auto;
      right: auto;
      align-items: center;
      max-width: 100%;
    }

    .discord-transcript-search {
      width: min(calc(100vw - 76px), 248px);
    }

    .discord-transcript-search-meta {
      gap: 8px;
      align-items: center;
      flex-direction: row;
    }

    .discord-transcript-search-actions {
      justify-content: flex-end;
    }

    .discord-transcript-search-count {
      min-width: 0;
    }

    .discord-attachment-gallery {
      max-width: calc(100vw - 32px);
    }

    .discord-message .discord-attachments > discord-attachment[type="file"] {
      width: min(100%, calc(100vw - 92px));
      max-width: min(520px, calc(100vw - 92px));
    }

    .discord-attachment-generic {
      width: min(100%, calc(100vw - 92px)) !important;
      max-width: min(520px, calc(100vw - 92px)) !important;
      padding: 10px 12px !important;
    }

    .discord-invite {
      width: min(100%, calc(100vw - 92px));
      max-width: min(432px, calc(100vw - 92px));
      padding: 14px !important;
    }

    .discord-invite .discord-invite-root {
      grid-template-columns: 50px minmax(0, 1fr);
    }

    .discord-invite .discord-invite-join {
      grid-column: 1 / -1;
      justify-self: stretch;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box !important;
      margin-top: 10px;
    }

    .discord-invite .discord-invite-counts {
      flex-wrap: wrap;
      row-gap: 6px;
    }

    .discord-invite .discord-invite-header {
      white-space: normal;
      overflow: visible;
      text-overflow: initial;
    }

    .discord-image-preview-stage {
      max-width: calc(100vw - 32px);
      max-height: calc(100vh - 32px);
    }

    .discord-voice-message {
      width: min(100%, calc(100vw - 92px));
      max-width: min(400px, calc(100vw - 92px));
      padding: 8px 12px 8px 8px;
      gap: 6px;
    }

    .discord-voice-waveform {
      gap: 1px;
    }

    .discord-voice-waveform-bar {
      width: 2px;
      flex-basis: 2px;
    }

    .discord-voice-duration {
      min-width: 28px;
      font-size: 11px;
    }

    .discord-voice-speed {
      padding: 2px 5px;
      font-size: 11px;
    }

    .discord-voice-volume svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    .discord-transcript-header-bar {
      padding: 8px 10px;
    }

    .discord-transcript-header-server-icon,
    .discord-transcript-header-glyph,
    .discord-transcript-header-avatar {
      width: 22px;
      height: 22px;
    }

    .discord-transcript-header-topic,
    .discord-transcript-header-separator {
      display: none;
    }

    .discord-transcript-header-tools {
      gap: 8px;
    }

    .discord-transcript-search-shell {
      top: calc(env(safe-area-inset-top) + 10px);
      right: calc(env(safe-area-inset-right) + 10px);
      max-width: calc(100vw - 20px);
    }

    .discord-transcript-search-toggle {
      width: 40px;
      height: 40px;
      border-radius: 11px;
    }

    .discord-transcript-search {
      width: min(calc(100vw - 72px), 228px);
    }

    .discord-transcript-search-bar {
      height: 38px;
    }

    .discord-invite {
      width: min(100%, calc(100vw - 84px));
      max-width: min(432px, calc(100vw - 84px));
      padding: 12px !important;
    }

    .discord-message .discord-attachments > discord-attachment[type="file"] {
      width: min(100%, calc(100vw - 84px));
      max-width: min(520px, calc(100vw - 84px));
    }

    .discord-attachment-generic {
      width: min(100%, calc(100vw - 84px)) !important;
      max-width: min(520px, calc(100vw - 84px)) !important;
      gap: 8px;
      padding: 10px !important;
    }

    .discord-attachment-generic-icon > svg {
      width: 26px;
    }

    .discord-invite .discord-invite-icon {
      width: 44px !important;
      height: 44px !important;
      margin-right: 0 !important;
      border-radius: 14px !important;
    }

    .discord-invite .discord-invite-title {
      font-size: 15px !important;
    }

    .discord-invite .discord-invite-counts {
      font-size: 13px !important;
    }

    .discord-button {
      max-width: 100%;
    }

    .discord-voice-message {
      width: min(100%, calc(100vw - 84px));
      max-width: min(400px, calc(100vw - 84px));
      border-radius: 20px;
    }

    .discord-voice-play-button {
      width: 30px;
      height: 30px;
      min-width: 30px;
    }
  }

  /* Code blocks */
  .discord-message .discord-message-body code {
    background-color: #1e1f22 !important;
    padding: 0.2em 0.4em !important;
    border-radius: 4px !important;
    font-size: 85% !important;
  }
  .discord-message .discord-message-body pre {
    border: 1px solid #1e1f22 !important;
    border-radius: 4px !important;
  }
  .discord-code-block-pre,
  .discord-code-block-pre--multiline,
  .discord-code-block-pre--multiline.hljs {
    background-color: #1e1f22 !important;
    border-color: #1a1b1e !important;
  }
  .discord-ansi-code-block {
    margin: 0;
  }
  .discord-ansi-code-block .discord-ansi-code {
    background: transparent !important;
    color: #dcddde;
    display: block;
    font-size: inherit !important;
    padding: 0 !important;
    white-space: break-spaces;
  }

  /* Invite cards */
  .discord-invite {
    background-color: #2b2d31 !important;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-radius: 8px !important;
    width: min(432px, 100%);
    max-width: min(432px, calc(100vw - 104px));
    min-width: 0;
    box-sizing: border-box;
  }
  .discord-invite .discord-invite-root {
    display: grid !important;
    grid-template-columns: 50px minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
  .discord-invite .discord-invite-info {
    min-width: 0;
  }
  .discord-invite .discord-invite-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .discord-invite .discord-invite-counts {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    min-width: 0;
  }
  .discord-invite .discord-invite-count {
    min-width: 0;
  }
  .discord-invite .discord-invite-header {
    color: #b5bac1 !important;
    text-transform: uppercase !important;
    font-size: 12px !important;
  }
  .discord-invite .discord-invite-icon {
    background-color: #1e1f22 !important;
    border-radius: 16px !important;
  }
  .discord-invite .discord-invite-join {
    background-color: #248046 !important;
    border-radius: 4px !important;
    font-size: 14px !important;
    padding: 0 16px !important;
    margin-left: 0 !important;
    max-width: 100%;
    box-sizing: border-box !important;
  }
  .discord-invite .discord-invite-join:hover {
    background-color: #1a6334 !important;
  }

  /* Custom styling for Forwards */
  .discord-forwarding-pill {
    display: flex;
    align-items: center;
    color: #8b8e95;
    margin-bottom: 4px;
    font-size: 13px;
    font-weight: 500;
  }
  .discord-forwarding-pill svg {
    margin-right: 4px;
  }

  /* Custom styling for System Message Thread Previews */
  .discord-thread-preview-container {
    position: relative;
    margin-left: 16px;
    margin-top: 4px;
    margin-bottom: 4px;
  }
  .discord-thread-preview-container::before {
    content: '';
    position: absolute;
    top: -15px;
    bottom: 50%;
    left: -24px;
    width: 24px;
    border-left: 2px solid #4f545c;
    border-bottom: 2px solid #4f545c;
    border-bottom-left-radius: 6px;
  }
  .discord-thread-preview-box {
    background-color: #2b2d31;
    border: 1px solid #1e1f22;
    border-radius: 8px;
    padding: 12px;
    max-width: 400px;
  }
  .discord-thread-preview-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    color: #dbdee1;
    margin-bottom: 4px;
  }
  .discord-thread-preview-header span {
    font-size: 12px;
    font-weight: 600;
    color: #00a8fc;
  }
  .discord-thread-preview-message {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .discord-thread-preview-message img {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
  .discord-thread-preview-message span {
    font-size: 13px;
    color: #B5BAC1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .discord-thread-preview-message strong {
    color: #dbdee1;
    font-weight: 500;
  }

  /* Custom styling for Discord Polls */
  .discord-poll {
    border: 1px solid #3f4147;
    border-radius: 8px;
    padding: 16px;
    margin-top: 8px;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .discord-poll-header {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .discord-poll-question {
    font-size: 16px;
    font-weight: 700;
    color: #f2f3f5;
  }
  .discord-poll-subtitle {
    font-size: 12px;
    color: #949ba4;
    font-weight: 400;
  }
  .discord-poll-answers {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .discord-poll-answer {
    position: relative;
    background-color: #2b2d31;
    border: 1px solid #3f4147;
    border-radius: 8px;
    overflow: hidden;
    min-height: 44px;
    cursor: pointer;
    transition: border-color 0.15s ease;
  }
  .discord-poll-answer:hover {
    border-color: #5865f2;
  }
  .discord-poll-answer.finalized {
    cursor: default;
    border-color: #3f4147;
  }
  .discord-poll-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: #5865f2;
    opacity: 0.2;
    border-radius: 7px;
    transition: width 0.3s ease;
  }
  .discord-poll-content {
    display: flex;
    align-items: center;
    padding: 0 16px;
    width: 100%;
    height: 44px;
    z-index: 1;
    position: relative;
    gap: 8px;
    box-sizing: border-box;
  }
  .discord-poll-emoji {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .discord-poll-emoji img {
    max-width: 100%;
    max-height: 100%;
  }
  .discord-poll-text {
    flex-grow: 1;
    font-size: 16px;
    color: #dbdee1;
    font-weight: 500;
  }
  .discord-poll-votes {
    font-size: 13px;
    color: #949ba4;
    font-weight: 600;
    flex-shrink: 0;
  }
  .discord-poll-radio {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
  }
  .discord-poll-footer {
    font-size: 14px;
    color: #949ba4;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .discord-poll-footer-left {
    font-size: 14px;
    font-weight: 700;
    color: #b5bac1;
  }
  .discord-poll-footer-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .discord-poll-show-results {
    color: #dbdee1;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .discord-poll-show-results:hover {
    text-decoration: underline;
  }
  .discord-poll-vote-btn {
    background-color: #5865f2;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 20px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
  }
  .discord-poll-vote-btn:hover {
    background-color: #4752c4;
  }

  /* Custom styling for Voice Messages */
  .discord-voice-message {
    display: flex;
    align-items: center;
    background-color: #2b2d31;
    border-radius: 22px;
    padding: 8px 16px 8px 8px;
    margin-top: 4px;
    width: min(100%, 400px);
    max-width: min(400px, 100%);
    min-width: 0;
    box-sizing: border-box;
    overflow: hidden;
    gap: 8px;
  }
  .discord-voice-play-button {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    background-color: #5865f2;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }
  .discord-voice-waveform {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 24px;
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
  }
  .discord-voice-waveform-bar {
    width: 3px;
    flex: 0 0 3px;
    min-height: 4px;
    border-radius: 2px;
    background-color: #5d5f6b;
    transition: background-color 0.15s;
  }
  .discord-voice-duration {
    font-size: 12px;
    font-weight: 500;
    color: #949ba4;
    font-family: 'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    white-space: nowrap;
    min-width: 30px;
  }
  .discord-voice-speed {
    background-color: #3f4147;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 700;
    color: #dbdee1;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .discord-voice-volume {
    color: #b5bac1;
    display: flex;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
  }
`;
