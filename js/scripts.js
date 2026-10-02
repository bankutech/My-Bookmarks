// Nexus Portal — UI logic.
// Data lives in data.js (CATEGORIES). Everything below renders from it,
// and all bookmark mutations go by unique id, never by URL.

'use strict';

const STORAGE_KEYS = {
  custom: 'custom_bookmarks',
  hidden: 'hidden_bookmarks'
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const touchDevice = window.matchMedia('(hover: none), (pointer: coarse)');

// ============================================================
// Boot
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeEffects();
  refreshDashboard(); // applies hidden + custom bookmarks, then renders
  initSearch();
  initClock();
  initGreeting();
  initModal();
});

function initializeEffects() {
  if (!reducedMotion.matches && !touchDevice.matches) {
    initParticleBackground();
  }
  if (!touchDevice.matches) {
    initTilt();
    initCustomCursor();
  }
}

// ============================================================
// Rendering
// ============================================================

function renderSidebar() {
  const navList = document.querySelector('.nav-list');
  navList.innerHTML = '';

  CATEGORIES.forEach((cat, index) => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `
      <a href="#${cat.id}" class="nav-link${index === 0 ? ' active' : ''}" data-nav="${cat.id}">
        <i class="fa-solid ${cat.icon}" aria-hidden="true"></i>
        <span class="nav-label">${escapeHtml(cat.title.split(' ')[0])}</span>
        <span class="nav-count">${cat.bookmarks.length}</span>
      </a>
    `;
    navList.appendChild(li);
  });

  const activeLink = navList.querySelector('.nav-link');
  if (activeLink) setActiveNav(activeLink);

  const total = CATEGORIES.reduce((sum, cat) => sum + cat.bookmarks.length, 0);
  document.getElementById('bookmark-total').textContent = `${total} links`;
}

function renderCategories() {
  const container = document.getElementById('categories-container');
  container.innerHTML = '';

  CATEGORIES.forEach((cat, index) => {
    const section = document.createElement('section');
    section.className = 'category-section';
    section.id = cat.id;
    section.dataset.categoryId = cat.id;
    section.setAttribute('aria-labelledby', `${cat.id}-heading`);

    section.innerHTML = `
      <header class="section-header">
        <i class="fa-solid ${cat.icon} section-icon" aria-hidden="true"></i>
        <h2 id="${cat.id}-heading">${escapeHtml(cat.title)}</h2>
        <span class="section-rule" aria-hidden="true"></span>
        <span class="section-count">${cat.bookmarks.length}</span>
      </header>
      <div class="grid">
        ${cat.bookmarks.map(bookmark => renderBookmarkCard(bookmark, cat)).join('')}
      </div>
    `;
    container.appendChild(section);
  });

  initCardInteractions(container);
}

function renderBookmarkCard(bookmark, category) {
  const domain = getDomain(bookmark.url);
  const safeName = escapeHtml(bookmark.name);
  const safeDescription = escapeHtml(bookmark.description || 'Open resource');
  const safeUrl = escapeHtml(bookmark.url);
  const shortUrl = escapeHtml(shortenUrl(bookmark.url, 46));

  return `
    <article class="card bookmark-card-3d" data-id="${bookmark.id}">
      <div class="card-inner">
        <div class="card-face card-front">
          <div class="card-glare" aria-hidden="true"></div>
          <div class="card-top">
            <span class="card-icon"><i class="${bookmark.icon}" aria-hidden="true"></i></span>
            <i class="fa-solid fa-arrow-up-right-from-square card-visit-hint" aria-hidden="true"></i>
          </div>
          <h3 class="card-title">${safeName}</h3>
          <p class="card-description">${safeDescription}</p>
          <footer class="card-meta">
            <span class="card-category">${escapeHtml(category.title)}</span>
            <span class="card-domain">${domain}</span>
          </footer>
        </div>
        <div class="card-face card-back">
          <div class="back-content">
            <p class="back-kicker">${escapeHtml(category.title)}</p>
            <h3 class="back-title">${safeName}</h3>
            <p class="back-url" title="${safeUrl}">${shortUrl}</p>
            <div class="back-actions">
              <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="back-btn back-btn-visit">
                <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Visit
              </a>
              <div class="back-manage">
                <button type="button" class="back-btn-icon js-edit" data-id="${bookmark.id}" title="Edit bookmark" aria-label="Edit ${safeName}">
                  <i class="fa-solid fa-pen" aria-hidden="true"></i>
                </button>
                <button type="button" class="back-btn-icon js-delete" data-id="${bookmark.id}" title="Delete bookmark" aria-label="Delete ${safeName}">
                  <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

// ============================================================
// Card interactions (delegated — survives re-renders)
// ============================================================

function initCardInteractions(container) {
  container.addEventListener('click', (event) => {
    const editBtn = event.target.closest('.js-edit');
    if (editBtn) {
      openBookmarkModal(editBtn.dataset.id);
      return;
    }

    const deleteBtn = event.target.closest('.js-delete');
    if (deleteBtn) {
      deleteBookmark(deleteBtn.dataset.id);
      return;
    }

    const cardInner = event.target.closest('.card-inner');
    if (!cardInner) return;

    if (!cardInner.classList.contains('is-flipped')) {
      // Touch has no hover, so the first tap flips to reveal actions;
      // with a mouse the hover already flipped it and a click opens the site.
      if (touchDevice.matches) {
        cardInner.classList.add('is-flipped');
        return;
      }
      const card = cardInner.closest('.card');
      const found = findBookmark(card.dataset.id);
      if (found) window.open(found.bookmark.url, '_blank', 'noopener');
    } else if (touchDevice.matches && !event.target.closest('a, button')) {
      cardInner.classList.remove('is-flipped');
    }
  });

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const cardInner = event.target.closest('.card-inner');
    if (!cardInner || event.target.closest('a, button')) return;
    if (cardInner.classList.contains('is-flipped')) return;
    event.preventDefault();
    const card = cardInner.closest('.card');
    const found = findBookmark(card.dataset.id);
    if (found) window.open(found.bookmark.url, '_blank', 'noopener');
  });
}

// ============================================================
// Sidebar active state (delegated on the nav list)
// ============================================================

document.addEventListener('click', (event) => {
  const link = event.target.closest('.nav-link');
  if (link) setActiveNav(link);
});

function setActiveNav(link) {
  document.querySelectorAll('.nav-link.active').forEach(el => el.classList.remove('active'));
  link.classList.add('active');
}

// ============================================================
// Search
// ============================================================

function initSearch() {
  const input = document.getElementById('search-input');
  const emptyState = document.getElementById('search-empty');

  input.addEventListener('input', () => filterBookmarks(input.value.trim().toLowerCase(), emptyState));
}

function filterBookmarks(term, emptyState) {
  let anyVisible = false;

  document.querySelectorAll('.category-section').forEach(section => {
    let sectionVisible = false;

    section.querySelectorAll('.card').forEach(card => {
      const found = findBookmark(card.dataset.id);
      const haystack = found
        ? `${found.bookmark.name} ${found.bookmark.description || ''} ${getDomain(found.bookmark.url)}`.toLowerCase()
        : card.textContent.toLowerCase();
      const isMatch = !term || haystack.includes(term);

      card.hidden = !isMatch;
      if (isMatch) sectionVisible = true;
      if (isMatch && term) highlightCard(card, term);
      if (!term) resetHighlight(card);
    });

    section.hidden = !sectionVisible;
    if (sectionVisible) anyVisible = true;
  });

  emptyState.hidden = anyVisible;
}

// Applies <mark> highlighting to the first occurrence of the term in a
// card's title and description.
function highlightCard(card, term) {
  const titleEl = card.querySelector('.card-title');
  const descEl = card.querySelector('.card-description');
  highlightText(titleEl, term);
  highlightText(descEl, term);
}

function resetHighlight(card) {
  card.querySelectorAll('.card-title, .card-description').forEach(el => {
    if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) return;
    el.textContent = el.textContent;
  });
}

function highlightText(el, term) {
  if (!el || !term) return;
  const original = el.textContent;
  const index = original.toLowerCase().indexOf(term);
  if (index === -1) return;
  el.innerHTML =
    escapeHtml(original.substring(0, index)) +
    `<mark>${escapeHtml(original.substring(index, index + term.length))}</mark>` +
    escapeHtml(original.substring(index + term.length));
}

// ============================================================
// Clock
// ============================================================

function initClock() {
  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');

  function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    // Tabular numerals + fixed-width container prevent layout shift.
    timeEl.textContent = `${hours}:${minutes} ${ampm}`;

    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    dateEl.textContent = `${day}, ${now.getDate()} ${month}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// ============================================================
// Greeting (subtle scramble)
// ============================================================

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#';
    this.frame = 0;
    this.frameRequest = null;
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    return new Promise(resolve => {
      this.resolve = resolve;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += escapeHtml(to);
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble">${escapeHtml(char)}</span>`;
      } else {
        output += escapeHtml(from);
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frame++;
      this.frameRequest = requestAnimationFrame(this.update);
    }
  }
}

function initGreeting() {
  const greetingEl = document.getElementById('greeting-text');
  const hour = new Date().getHours();
  let greeting = 'Good night';
  if (hour >= 5 && hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  else if (hour < 22) greeting = 'Good evening';

  if (reducedMotion.matches) {
    greetingEl.textContent = `${greeting}, Sagnik`;
    return;
  }

  new TextScramble(greetingEl).setText(`${greeting}, Sagnik`);
}

// ============================================================
// 3D tilt + glare (pointer-driven, desktop only)
// ============================================================

function initTilt() {
  const MAX_TILT = 8; // degrees — kept restrained on purpose

  const applyTransform = (cardInner, rx, ry, glareX, glareY) => {
    cardInner.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    cardInner.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
    cardInner.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
    cardInner.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const cardInner = event.target.closest('.card-inner');
    if (!cardInner || cardInner.classList.contains('is-flipped')) return;

    const rect = cardInner.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;   // 0..1
    const py = (event.clientY - rect.top) / rect.height;  // 0..1

    const rx = (0.5 - py) * MAX_TILT;
    const ry = (px - 0.5) * MAX_TILT;
    // Glare: a soft radial highlight that follows the cursor.
    applyTransform(cardInner, rx, ry, px * 100, py * 100);
  });

  document.addEventListener('pointerout', (event) => {
    if (event.pointerType !== 'mouse') return;
    const cardInner = event.target.closest('.card-inner');
    if (!cardInner) return;
    if (event.relatedTarget && cardInner.contains(event.relatedTarget)) return;
    applyTransform(cardInner, 0, 0, 50, 50);
  });
}

// ============================================================
// Particle background — slow, quiet, behind everything
// ============================================================

function initParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationId = null;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    seedParticles();
  };

  const seedParticles = () => {
    const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 30000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      size: Math.random() * 1.6 + 0.6
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.06)';
      ctx.fill();
    }
    animationId = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  resize();

  if (reducedMotion.matches) {
    // Draw a single static frame, no animation loop.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  draw();

  // Pause the loop entirely when the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      animationId = null;
    } else if (animationId === null) {
      draw();
    }
  });
}

// ============================================================
// Custom cursor — desktop only, subtle
// ============================================================

function initCustomCursor() {
  if (touchDevice.matches) return;

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (!cursorDot || !cursorOutline) return;

  let outlineX = 0, outlineY = 0, targetX = 0, targetY = 0;
  let rafId = null;

  const animateOutline = () => {
    // Simple lerp: the ring trails the dot instead of snapping.
    outlineX += (targetX - outlineX) * 0.18;
    outlineY += (targetY - outlineY) * 0.18;
    cursorOutline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`;
    if (Math.abs(targetX - outlineX) > 0.5 || Math.abs(targetY - outlineY) > 0.5) {
      rafId = requestAnimationFrame(animateOutline);
    } else {
      rafId = null;
    }
  };

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const { clientX, clientY } = event;
    // Hidden at origin until the first real move (avoids a ring at 0,0).
    cursorDot.classList.add('is-visible');
    cursorOutline.classList.add('is-visible');
    cursorDot.style.transform = `translate(${clientX - 4}px, ${clientY - 4}px)`;

    targetX = clientX;
    targetY = clientY;
    if (rafId === null) rafId = requestAnimationFrame(animateOutline);

    const interactive = event.target.closest('a, button, .card-inner, input, select');
    cursorOutline.classList.toggle('is-active', Boolean(interactive));
  }, { passive: true });
}

// ============================================================
// Modal + add/edit flow
// ============================================================

function initModal() {
  const addBtn = document.getElementById('add-bookmark-btn');
  const modal = document.getElementById('bookmark-modal');
  const form = document.getElementById('bookmark-form');

  addBtn.addEventListener('click', () => openBookmarkModal(null));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveBookmark();
  });
}

function openBookmarkModal(id) {
  const modal = document.getElementById('bookmark-modal');
  const form = document.getElementById('bookmark-form');
  const titleEl = document.getElementById('modal-title');
  const found = id ? findBookmark(id) : null;

  form.reset();
  document.getElementById('edit-id').value = id || '';

  if (found) {
    titleEl.textContent = 'Edit bookmark';
    document.getElementById('bm-name').value = found.bookmark.name;
    document.getElementById('bm-url').value = found.bookmark.url;
    document.getElementById('bm-description').value = found.bookmark.description || '';
    document.getElementById('bm-category').value = found.category.id;
  } else {
    titleEl.textContent = 'New bookmark';
  }

  modal.classList.add('is-open');
  modal.removeAttribute('hidden');
  // Move focus into the dialog for keyboard users.
  document.getElementById('bm-name').focus();
}

function closeModal() {
  const modal = document.getElementById('bookmark-modal');
  modal.classList.remove('is-open');
  modal.setAttribute('hidden', '');
  document.getElementById('add-bookmark-btn').focus();
}

function saveBookmark() {
  const name = document.getElementById('bm-name').value.trim();
  const rawUrl = document.getElementById('bm-url').value.trim();
  const description = document.getElementById('bm-description').value.trim();
  const catId = document.getElementById('bm-category').value;
  const editId = document.getElementById('edit-id').value;

  if (!name || !rawUrl) {
    alert('Please fill in both a name and a URL.');
    return;
  }

  const url = normalizeUrl(rawUrl);
  if (!url) {
    alert('That URL does not look valid. Include the domain, e.g. https://example.com');
    return;
  }

  const bookmark = {
    id: editId || generateBookmarkId(),
    name,
    url,
    description: description || 'Open resource',
    icon: 'fa-solid fa-link'
  };

  if (editId) {
    updateBookmark(editId, bookmark, catId);
  } else {
    addCustomBookmark(bookmark, catId);
  }

  refreshDashboard();
  closeModal();
}

function normalizeUrl(input) {
  try {
    const url = new URL(input.includes('://') ? input : `https://${input}`);
    return url.href;
  } catch {
    return null;
  }
}

function generateBookmarkId() {
  let id;
  do {
    id = `bm-custom-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`;
  } while (findBookmark(id));
  return id;
}

// ============================================================
// Bookmark mutations (all by id)
// ============================================================

function updateBookmark(id, bookmark, newCatId) {
  const found = findBookmark(id);
  if (!found) return;
  const customs = readStore(STORAGE_KEYS.custom, {});

  const wasCustom = found.category.bookmarks.some(b => b.id === id && customs[found.category.id]?.some(c => c.id === id));

  // Same category: update in place (memory + storage entry if custom).
  if (found.category.id === newCatId) {
    const index = found.category.bookmarks.findIndex(b => b.id === id);
    found.category.bookmarks[index] = bookmark;
    if (wasCustom) {
      const list = customs[found.category.id] || [];
      const idx = list.findIndex(c => c.id === id);
      if (idx > -1) list[idx] = bookmark;
      customs[found.category.id] = list;
      writeStore(STORAGE_KEYS.custom, customs);
    }
    return;
  }

  // Category changed: remove from old, append to new.
  if (wasCustom) {
    customs[found.category.id] = (customs[found.category.id] || []).filter(c => c.id !== id);
  } else {
    // A default bookmark moved to another category is recorded as hidden in
    // its old home and re-created as a custom bookmark in the new one.
    hideBookmarkById(id);
    customs[newCatId] = customs[newCatId] || [];
    customs[newCatId].push(bookmark);
    writeStore(STORAGE_KEYS.custom, customs);
    return;
  }

  found.category.bookmarks = found.category.bookmarks.filter(b => b.id !== id);
  customs[newCatId] = customs[newCatId] || [];
  customs[newCatId].push(bookmark);
  writeStore(STORAGE_KEYS.custom, customs);
}

function addCustomBookmark(bookmark, catId) {
  const customs = readStore(STORAGE_KEYS.custom, {});
  customs[catId] = customs[catId] || [];
  customs[catId].push(bookmark);
  writeStore(STORAGE_KEYS.custom, customs);

  const cat = CATEGORIES.find(c => c.id === catId);
  if (cat) cat.bookmarks.push(bookmark);
}

function deleteBookmark(id) {
  const found = findBookmark(id);
  if (!found) return;
  if (!confirm(`Delete “${found.bookmark.name}”? You can re-add it later.`)) return;
  hideBookmarkById(id);
  refreshDashboard();
}

function hideBookmarkById(id) {
  const found = findBookmark(id);
  if (!found) return;
  const customs = readStore(STORAGE_KEYS.custom, {});

  if (customs[found.category.id]) {
    const before = customs[found.category.id].length;
    customs[found.category.id] = customs[found.category.id].filter(c => c.id !== id);
    if (customs[found.category.id].length !== before) {
      writeStore(STORAGE_KEYS.custom, customs);
    }
  }

  // Defaults are tracked as "hidden" so they stay gone across reloads.
  const isDefault = found.category.bookmarks.some(b => b.id === id && !b.id.startsWith('bm-custom-'));
  found.category.bookmarks = found.category.bookmarks.filter(b => b.id !== id);

  if (isDefault) {
    const hidden = readStore(STORAGE_KEYS.hidden, []);
    if (!hidden.includes(found.bookmark.name)) {
      hidden.push(found.bookmark.name);
      writeStore(STORAGE_KEYS.hidden, hidden);
    }
  }
}

// ============================================================
// LocalStorage persistence
// ============================================================

function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadCustomBookmarks() {
  // 1. Re-apply hidden defaults (matched by name — the legacy format).
  const hiddenNames = readStore(STORAGE_KEYS.hidden, []);
  if (hiddenNames.length) {
    CATEGORIES.forEach(cat => {
      cat.bookmarks = cat.bookmarks.filter(b => !hiddenNames.includes(b.name));
    });
  }

  // 2. Merge saved custom bookmarks into the in-memory data.
  const customs = readStore(STORAGE_KEYS.custom, {});
  Object.keys(customs).forEach(catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return;
    customs[catId].forEach(custom => {
      if (!cat.bookmarks.some(b => b.id === custom.id)) {
        cat.bookmarks.push(custom);
      }
    });
  });
}

function refreshDashboard() {
  loadCustomBookmarks();
  renderSidebar();
  renderCategories();
}

// ============================================================
// Helpers
// ============================================================

function findBookmark(id) {
  for (const cat of CATEGORIES) {
    const bookmark = cat.bookmarks.find(b => b.id === id);
    if (bookmark) return { bookmark, category: cat };
  }
  return null;
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function shortenUrl(url, max) {
  return url.length > max ? `${url.slice(0, max - 1)}…` : url;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
