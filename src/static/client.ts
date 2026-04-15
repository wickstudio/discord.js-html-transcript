export const scrollToMessage =
  'document.addEventListener("click",t=>{let e=t.target;if(!e)return;let o=e?.getAttribute("data-goto");if(o){let r=document.getElementById(`m-${o}`);r?(r.scrollIntoView({behavior:"smooth",block:"center"}),r.style.backgroundColor="rgba(148, 156, 247, 0.1)",r.style.transition="background-color 0.5s ease",setTimeout(()=>{r.style.backgroundColor="transparent"},1e3)):console.warn("Message ${goto} not found.")}});';

export const revealSpoiler =
  'document.addEventListener("click",e=>{const t=e.target;if(!(t instanceof Element))return;const o=t.closest(".discord-spoiler");o&&o.classList.contains("discord-spoiler")&&(o.classList.remove("discord-spoiler"),o.classList.add("discord-spoiler--revealed"))});';

export const applyServerTags = `
(() => {
  const hostSelector = 'discord-message[profile], discord-reply[profile], discord-thread-message[profile], discord-command[profile]';
  const rootSelector = 'discord-message, discord-reply, discord-thread-message, discord-command';

  const getProfiles = () => window.$discordMessage?.profiles ?? {};
  const getOwningHost = (element) => element.closest(rootSelector);

  const getInjectedTag = (host) =>
    Array.from(host.querySelectorAll('.discord-server-tag[data-transcript-server-tag="true"]')).find(
      (element) => getOwningHost(element) === host
    ) ?? null;

  const getInjectedRoleIcon = (host) =>
    Array.from(host.querySelectorAll('.discord-author-role-icon[data-transcript-role-icon="true"]')).find(
      (element) => getOwningHost(element) === host
    ) ?? null;

  const getNativeRoleIcon = (host) =>
    Array.from(host.querySelectorAll('.discord-author-role-icon')).find(
      (element) => getOwningHost(element) === host && element.dataset.transcriptRoleIcon !== 'true'
    ) ?? null;

  const getUsernameElement = (host) => {
    const usernameSelector =
      host.tagName === 'DISCORD-MESSAGE' || host.tagName === 'DISCORD-THREAD-MESSAGE'
        ? '.discord-author-username'
        : '.discord-replied-message-username';

    return Array.from(host.querySelectorAll(usernameSelector)).find((element) => getOwningHost(element) === host) ?? null;
  };

  const createServerTag = (tagText, badgeUrl, guildId) => {
    const container = document.createElement('span');
    container.className = 'discord-server-tag';
    container.dataset.transcriptServerTag = 'true';
    container.dataset.tag = tagText;
    container.dataset.badge = badgeUrl ?? '';
    container.title = 'Server Tag: ' + tagText;

    if (guildId) {
      container.dataset.guildId = guildId;
    }

    if (badgeUrl) {
      const badge = document.createElement('img');
      badge.className = 'discord-server-tag-badge';
      badge.src = badgeUrl;
      badge.alt = '';
      badge.loading = 'lazy';
      badge.decoding = 'async';
      badge.draggable = false;
      container.appendChild(badge);
    }

    const label = document.createElement('span');
    label.className = 'discord-server-tag-text';
    label.textContent = tagText;
    container.appendChild(label);

    return container;
  };

  const createRoleIcon = (iconUrl, roleName) => {
    const icon = document.createElement('img');
    icon.className = 'discord-author-role-icon';
    icon.dataset.transcriptRoleIcon = 'true';
    icon.src = iconUrl;
    icon.alt = roleName || '';
    icon.loading = 'lazy';
    icon.decoding = 'async';
    icon.draggable = false;

    if (roleName) {
      icon.title = roleName;
    }

    return icon;
  };

  const applyToHost = (host) => {
    const profileId = host.getAttribute('profile');
    if (!profileId) {
      return;
    }

    const profile = getProfiles()[profileId];
    const tagText = typeof profile?.serverTagText === 'string' ? profile.serverTagText.trim() : '';
    const badgeUrl = typeof profile?.serverTagBadge === 'string' ? profile.serverTagBadge : '';
    const guildId = typeof profile?.serverTagGuildId === 'string' ? profile.serverTagGuildId : '';
    const existing = getInjectedTag(host);

    if (!tagText) {
      existing?.remove();
      return;
    }

    const username = getUsernameElement(host);
    if (!username) {
      return;
    }

    if (existing?.dataset.tag === tagText && (existing.dataset.badge ?? '') === badgeUrl) {
      return;
    }

    existing?.remove();
    username.insertAdjacentElement('afterend', createServerTag(tagText, badgeUrl || undefined, guildId || undefined));
  };

  const applyRoleIconToHost = (host) => {
    const profileId = host.getAttribute('profile');
    if (!profileId) {
      return;
    }

    const profile = getProfiles()[profileId];
    const roleIcon = typeof profile?.roleIcon === 'string' ? profile.roleIcon : '';
    const roleName = typeof profile?.roleName === 'string' ? profile.roleName : '';
    const existing = getInjectedRoleIcon(host);
    const nativeIcon = getNativeRoleIcon(host);

    if (!roleIcon) {
      existing?.remove();
      return;
    }

    if (nativeIcon) {
      if (nativeIcon.getAttribute('src') !== roleIcon) {
        nativeIcon.setAttribute('src', roleIcon);
      }

      nativeIcon.setAttribute('alt', roleName);
      if (roleName) {
        nativeIcon.setAttribute('title', roleName);
      }
      return;
    }

    const username = getUsernameElement(host);
    if (!username) {
      return;
    }

    const anchor = getInjectedTag(host) ?? username;
    if (existing) {
      if (existing.getAttribute('src') !== roleIcon) {
        existing.setAttribute('src', roleIcon);
      }

      existing.setAttribute('alt', roleName);
      if (roleName) {
        existing.setAttribute('title', roleName);
      } else {
        existing.removeAttribute('title');
      }

      if (existing.previousElementSibling !== anchor) {
        anchor.insertAdjacentElement('afterend', existing);
      }
      return;
    }

    anchor.insertAdjacentElement('afterend', createRoleIcon(roleIcon, roleName));
  };

  const normalizeApplicationTags = () => {
    document.querySelectorAll('.discord-application-tag').forEach((tag) => {
      const label = Array.from(tag.childNodes)
        .map((node) => node.textContent ?? '')
        .join('')
        .replace(/\\s+/g, ' ')
        .trim()
        .toLowerCase();

      if (label === 'bot') {
        tag.setAttribute('data-transcript-app-tag-kind', 'bot');
        return;
      }

      if (label === 'server') {
        tag.setAttribute('data-transcript-app-tag-kind', 'server');
        return;
      }

      tag.removeAttribute('data-transcript-app-tag-kind');
    });
  };

  let scheduled = false;

  const applyAll = () => {
    document.querySelectorAll(hostSelector).forEach((host) => applyToHost(host));
    document.querySelectorAll(hostSelector).forEach((host) => applyRoleIconToHost(host));
    normalizeApplicationTags();
  };

  const schedule = () => {
    if (scheduled) {
      return;
    }

    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      applyAll();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }

  window.addEventListener('load', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
`;

export const enableImagePreview = `
(() => {
  const overlay = document.createElement('div');
  overlay.className = 'discord-image-preview-overlay';
  overlay.innerHTML = \`
    <button type="button" class="discord-image-preview-close" aria-label="Close image preview">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M17.66 6.34a1 1 0 0 0-1.41 0L12 10.59 7.76 6.34a1 1 0 1 0-1.41 1.41L10.59 12l-4.24 4.24a1 1 0 1 0 1.41 1.41L12 13.41l4.24 4.24a1 1 0 0 0 1.41-1.41L13.41 12l4.24-4.24a1 1 0 0 0 0-1.41Z" />
      </svg>
    </button>
    <div class="discord-image-preview-stage">
      <img class="discord-image-preview-image" alt="" />
    </div>
  \`;

  const previewImage = overlay.querySelector('.discord-image-preview-image');
  const closeButton = overlay.querySelector('.discord-image-preview-close');
  const ignoredAncestors =
    '.discord-image-preview-overlay, .discord-author-avatar, .discord-replied-message, .discord-button, .discord-select-menu-option, .discord-server-tag, .discord-thread-preview-message, .discord-poll-emoji, .discord-invite';
  let previousOverflow = '';

  const closePreview = () => {
    overlay.classList.remove('is-open');
    previewImage.removeAttribute('src');
    previewImage.alt = '';
    document.body.style.overflow = previousOverflow;
  };

  const openPreview = (src, alt) => {
    if (!src) {
      return;
    }

    previousOverflow = document.body.style.overflow;
    previewImage.src = src;
    previewImage.alt = alt || 'Image preview';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const getPreviewCandidate = (target) => {
    const attachment = target.closest('discord-attachment[type="image"]');
    if (attachment) {
      return {
        src: attachment.getAttribute('url') || '',
        alt: attachment.getAttribute('alt') || 'Image preview',
      };
    }

    const image = target.closest('img');
    if (!image) {
      return null;
    }

    if (
      image.classList.contains('discord-button-emoji') ||
      image.classList.contains('discord-select-menu-option-emoji') ||
      image.classList.contains('discord-server-tag-badge') ||
      image.classList.contains('discord-author-role-icon') ||
      image.closest(ignoredAncestors)
    ) {
      return null;
    }

    const src = image.currentSrc || image.getAttribute('src') || '';
    if (!src) {
      return null;
    }

    return {
      src,
      alt: image.getAttribute('alt') || 'Image preview',
    };
  };

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target === overlay || target.closest('.discord-image-preview-close')) {
        event.preventDefault();
        closePreview();
        return;
      }

      const candidate = getPreviewCandidate(target);
      if (!candidate) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openPreview(candidate.src, candidate.alt);
    },
    true
  );

  overlay.querySelector('.discord-image-preview-stage')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
      closePreview();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      closePreview();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlay), { once: true });
  } else {
    document.body.appendChild(overlay);
  }
})();
`;

export const enableMessageSearch = `
(() => {
  const SEARCH_SELECTOR = 'discord-message[id^="m-"]';
  const MATCH_CLASS = 'discord-search-match';
  const ACTIVE_CLASS = 'discord-search-match--active';
  const SHELL_CLASS = 'discord-transcript-search-shell';
  const PANEL_CLASS = 'discord-transcript-search';
  const OPEN_CLASS = 'is-open';

  const normalize = (value) => value.toLowerCase().replace(/\\s+/g, ' ').trim();

  const extractMessageId = (value) => {
    const trimmed = value.trim();
    const directMatch = trimmed.match(/^(?:m-)?(\\d{15,21})$/);
    if (directMatch) {
      return directMatch[1];
    }

    const linkMatch = trimmed.match(/\\/(\\d{15,21})(?:\\/?(?:\\?.*)?)?$/);
    return linkMatch ? linkMatch[1] : null;
  };

  const getMessages = () =>
    Array.from(document.querySelectorAll(SEARCH_SELECTOR))
      .filter((element) => element instanceof HTMLElement)
      .map((element) => ({
        element,
        id: (element.id || '').replace(/^m-/, ''),
        text: normalize(element.textContent || ''),
      }));

  const shell = document.createElement('div');
  shell.className = SHELL_CLASS;
  shell.innerHTML =
    '<button class="discord-transcript-search-toggle" type="button" aria-label="Toggle transcript search" aria-expanded="false">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16Zm0 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm11.71 15.29a1 1 0 0 1 0 1.42a1 1 0 0 1-1.42 0l-3.4-3.39a1 1 0 0 1 1.42-1.42l3.4 3.39Z"/></svg>' +
    '</button>' +
    '<div class="' +
    PANEL_CLASS +
    '" role="search" aria-hidden="true">' +
    '<label class="discord-transcript-search-bar">' +
    '<input class="discord-transcript-search-input" type="search" aria-label="Search transcript messages" />' +
    '<button class="discord-transcript-search-submit" type="button" data-action="next" aria-label="Search transcript">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16Zm0 2a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm11.71 15.29a1 1 0 0 1 0 1.42a1 1 0 0 1-1.42 0l-3.4-3.39a1 1 0 0 1 1.42-1.42l3.4 3.39Z"/></svg>' +
    '</button>' +
    '</label>' +
    '<div class="discord-transcript-search-meta">' +
    '<span class="discord-transcript-search-count" aria-live="polite">Ready</span>' +
    '<div class="discord-transcript-search-actions">' +
    '<button class="discord-transcript-search-button" type="button" data-action="prev" aria-label="Previous match">↑</button>' +
    '<button class="discord-transcript-search-button" type="button" data-action="next" aria-label="Next match">↓</button>' +
    '<button class="discord-transcript-search-button discord-transcript-search-button--ghost" type="button" data-action="clear" aria-label="Clear search">✕</button>' +
    '</div>' +
    '</div>' +
    '</div>';

  const desktopMedia = window.matchMedia('(min-width: 901px)');
  const panel = shell.querySelector('.discord-transcript-search');
  const toggleButton = shell.querySelector('.discord-transcript-search-toggle');
  const input = shell.querySelector('.discord-transcript-search-input');
  const count = shell.querySelector('.discord-transcript-search-count');
  const previousButton = shell.querySelector('[data-action="prev"]');
  const nextButton = shell.querySelectorAll('[data-action="next"]')[1];
  const submitButton = shell.querySelector('.discord-transcript-search-submit');
  const clearButton = shell.querySelector('[data-action="clear"]');
  const headerChannel =
    document.querySelector('.discord-transcript-header-bar')?.getAttribute('data-channel-name') ||
    document.querySelector('discord-header')?.getAttribute('channel') ||
    document.title ||
    'transcript';

  let matches = [];
  let activeIndex = -1;
  let scheduled = false;
  let hasUserToggled = false;

  input.placeholder = 'Search ' + headerChannel;

  const setOpen = (next, focus = false) => {
    shell.classList.toggle(OPEN_CLASS, next);
    toggleButton.setAttribute('aria-expanded', String(next));
    panel.setAttribute('aria-hidden', String(!next));

    if (focus && next) {
      requestAnimationFrame(() => {
        input.focus();
        input.select();
      });
    }

    if (!next) {
      input.blur();
    }
  };

  const syncDefaultVisibility = (force = false) => {
    if (!force && hasUserToggled) {
      return;
    }

    setOpen(desktopMedia.matches, false);
  };

  const clearHighlights = () => {
    document.querySelectorAll(SEARCH_SELECTOR + '.' + MATCH_CLASS).forEach((message) => {
      message.classList.remove(MATCH_CLASS, ACTIVE_CLASS);
    });
  };

  const updateControls = () => {
    const total = matches.length;
    const query = (input.value || '').trim();
    panel.classList.toggle('has-query', Boolean(query));
    count.textContent =
      !query ? 'Ready' : total > 0 && activeIndex >= 0 ? activeIndex + 1 + ' of ' + total : 'No matches';
    previousButton.disabled = total === 0;
    nextButton.disabled = total === 0;
    clearButton.disabled = !(input.value || '').trim();
  };

  const focusMatch = (index, scroll = true) => {
    if (matches.length === 0) {
      activeIndex = -1;
      updateControls();
      return;
    }

    if (activeIndex >= 0 && matches[activeIndex]) {
      matches[activeIndex].element.classList.remove(ACTIVE_CLASS);
    }

    activeIndex = ((index % matches.length) + matches.length) % matches.length;
    const match = matches[activeIndex];
    match.element.classList.add(ACTIVE_CLASS);

    if (scroll) {
      match.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    updateControls();
  };

  const runSearch = (scroll = true) => {
    clearHighlights();
    matches = [];
    activeIndex = -1;

    const rawQuery = (input.value || '').trim();
    if (!rawQuery) {
      updateControls();
      return;
    }

    const normalizedQuery = normalize(rawQuery.replace(/^m-/, ''));
    const exactMessageId = extractMessageId(rawQuery);
    const availableMessages = getMessages();

    matches = availableMessages.filter((message) => {
      if (exactMessageId) {
        return message.id === exactMessageId;
      }

      return message.id.includes(normalizedQuery) || message.text.includes(normalizedQuery);
    });

    matches.forEach((match) => match.element.classList.add(MATCH_CLASS));
    focusMatch(0, scroll);
  };

  const scheduleSearchRefresh = () => {
    if (scheduled || !(input.value || '').trim()) {
      return;
    }

    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      runSearch(false);
    });
  };

  input.addEventListener('input', () => runSearch(false));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (matches.length > 0) {
        focusMatch(activeIndex + (event.shiftKey ? -1 : 1));
      } else {
        runSearch();
      }
      return;
    }

    if (event.key === 'Escape') {
      if ((input.value || '').trim()) {
        input.value = '';
        runSearch(false);
      } else {
        setOpen(false, false);
      }
    }
  });

  toggleButton.addEventListener('click', () => {
    hasUserToggled = true;
    setOpen(!shell.classList.contains(OPEN_CLASS), !shell.classList.contains(OPEN_CLASS));
  });

  previousButton.addEventListener('click', () => focusMatch(activeIndex - 1));
  nextButton.addEventListener('click', () => {
    if (matches.length > 0) {
      focusMatch(activeIndex + 1);
      return;
    }

    runSearch();
  });
  submitButton.addEventListener('click', () => {
    if (matches.length > 0) {
      focusMatch(activeIndex + 1);
      return;
    }

    runSearch();
  });
  clearButton.addEventListener('click', () => {
    input.value = '';
    runSearch(false);
    input.focus();
  });

  document.addEventListener('keydown', (event) => {
    const isFindShortcut = (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'f';
    if (!isFindShortcut) {
      return;
    }

    event.preventDefault();
    setOpen(true, true);
  });

  document.addEventListener(
    'pointerdown',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element) || desktopMedia.matches || !shell.classList.contains(OPEN_CLASS)) {
        return;
      }

      if (!shell.contains(target)) {
        setOpen(false, false);
      }
    },
    true
  );

  desktopMedia.addEventListener('change', () => syncDefaultVisibility(false));

  const mount = () => {
    const mountTarget = document.querySelector('.discord-transcript-header-search-slot') || document.body;

    if (!mountTarget.contains(shell)) {
      mountTarget.appendChild(shell);
      syncDefaultVisibility(true);
      updateControls();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }

  const transcriptRoot = document.querySelector('discord-messages');
  if (transcriptRoot) {
    new MutationObserver(scheduleSearchRefresh).observe(transcriptRoot, { childList: true, subtree: true });
  }
})();
`;

export const fixEmbedBorders =
  'setTimeout(()=>{document.querySelectorAll(".discord-embed-wrapper").forEach(e=>{e.style.border="1px solid rgba(255, 255, 255, 0.06)";e.style.borderRadius="4px"});},500);setTimeout(()=>{document.querySelectorAll(".discord-embed-wrapper").forEach(e=>{e.style.border="1px solid rgba(255, 255, 255, 0.06)";e.style.borderRadius="4px"});},2000);';
