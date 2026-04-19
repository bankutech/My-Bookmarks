// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initCustomCursor();
  initClock();
  initSearch();
  initGreeting();
  initTilt();
  initModal();
  refreshDashboard();
});


function refreshDashboard() {
  loadCustomBookmarks();
  renderCategories();
}

// Theme logic removed - Exclusive Light Mode

// Clock Logic
function initClock() {
  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');

  function update() {
    const now = new Date();
    
    // Time: 12h format
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    timeEl.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

    // Date: Day, Date Month Year
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const date = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();
    
    dateEl.textContent = `${day}, ${date} ${month} ${year}`;
  }

  update();
  setInterval(update, 1000);
}

// Rendering
function renderCategories() {
  const container = document.getElementById('categories-container');
  const navList = document.querySelector('.nav-list');
  
  navList.innerHTML = '';
  container.innerHTML = '';

  categories.forEach((cat, index) => {
    // Add to sidebar
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `
      <a href="#${cat.id}" class="nav-link ${index === 0 ? 'active' : ''}" onclick="setActiveNav(this)">
        <i class="fa-solid ${cat.icon}"></i>
        <span>${cat.title.split(' ')[0]}</span>
      </a>
    `;
    navList.appendChild(li);

    // Add to main content
    const section = document.createElement('section');
    section.id = cat.id;
    section.className = 'category-section animate-in';
    section.style.animationDelay = `${index * 0.1}s`;
    
    section.innerHTML = `
      <div class="section-header">
        <i class="fa-solid ${cat.icon}"></i>
        <h2>${cat.title}</h2>
      </div>
      <div class="grid">
        ${cat.bookmarks.map((b, bIndex) => `
          <div class="card modern-card 3d-card" style="animation-delay: ${bIndex * 0.05}s">
            <div class="card-inner">
              <!-- Front: White Box -->
              <div class="card-front">
                <div class="card-top">
                  <h3 class="card-title">${b.name}</h3>
                  <div class="card-icon-box yellow-icon">
                    <i class="fa-solid ${b.icon}"></i>
                  </div>
                </div>
                <p class="card-description">${b.action || 'Manage Resource'}</p>
                <div class="flip-hint"><i class="fa-solid fa-rotate"></i> Flip for more</div>
              </div>
              
              <!-- Back: Black Box -->
              <div class="card-back">
                <div class="back-content">
                  <h3 class="back-title">${b.name}</h3>
                  <p class="back-url">${b.url.substring(0, 40)}${b.url.length > 40 ? '...' : ''}</p>
                  
                  <div class="back-actions">
                    <a href="${b.url}" target="_blank" class="btn btn-primary visit-btn">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Site
                    </a>
                  </div>
                  
                  <div class="manage-row">
                    <button class="action-btn edit" onclick="openEditModal('${cat.id}', ${bIndex})" title="Edit">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteBookmark('${cat.id}', ${bIndex})" title="Delete">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(section);
  });
}

// Global nav helper
window.setActiveNav = (el) => {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
};

// Search Logic
function initSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      const titleEl = card.querySelector('.card-title');
      const descEl = card.querySelector('.card-description');
      
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      const desc = descEl ? descEl.textContent.toLowerCase() : '';
      const isMatch = title.includes(term) || desc.includes(term);
      
      card.style.display = isMatch ? 'block' : 'none';
      card.style.opacity = isMatch ? '1' : '0';
      
      if (term && isMatch && titleEl) {
         highlightText(titleEl, term);
      } else if (titleEl) {
         resetHighlight(titleEl);
      }
    });

    // Hide empty sections
    document.querySelectorAll('.category-section').forEach(section => {
      const visibleCards = section.querySelectorAll('.card');
      let hasVisible = false;
      visibleCards.forEach(c => {
        if (c.style.display !== 'none') hasVisible = true;
      });
      section.style.display = hasVisible ? 'block' : 'none';
    });
  });
}

function highlightText(el, term) {
  const original = el.textContent;
  const index = original.toLowerCase().indexOf(term);
  if (index >= 0) {
    const inner = original.substring(0, index) + 
                  `<mark>${original.substring(index, index + term.length)}</mark>` + 
                  original.substring(index + term.length);
    el.innerHTML = inner;
  }
}

function resetHighlight(el) {
  el.innerHTML = el.textContent;
}

// Advanced 3D Tilt & Holographic Effect
function initTilt() {
  const onMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    // Calculate glare position
    const glareX = ((x / rect.width) * 100) - 50;
    const glareY = ((y / rect.height) * 100) - 50;

    requestAnimationFrame(() => {
      card.style.setProperty('--rx', `${rotateX}deg`);
      card.style.setProperty('--ry', `${rotateY}deg`);
      card.querySelector('.card-front').style.setProperty('--glare-x', `${glareX}%`);
      card.querySelector('.card-front').style.setProperty('--glare-y', `${glareY}%`);
    });
  };

  const onLeave = (card) => {
    card.style.setProperty('--rx', `0deg`);
    card.style.setProperty('--ry', `0deg`);
  };


  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.card-inner');
    if (card) onMove(e, card);
  });

  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.card-inner');
    if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
      onLeave(card);
    }
  });
}

// Particle Background Engine
function initParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.init();
    }
    init() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// Custom Cursor & Magnetic Effect
function initCustomCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
    
    // Smooth outline movement
    cursorOutline.animate({
      left: `${clientX}px`,
      top: `${clientY}px`
    }, { duration: 500, fill: "forwards" });

    // Magnetic effect
    const target = e.target.closest('.btn, .nav-link, .fab, .action-btn');
    if (target) {
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorOutline.style.borderColor = 'var(--accent-secondary)';
      
      const rect = target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const distanceX = clientX - x;
      const distanceY = clientY - y;
      
      target.style.transform = `translate(${distanceX * 0.2}px, ${distanceY * 0.2}px)`;
    } else {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorOutline.style.borderColor = 'var(--accent)';
      document.querySelectorAll('.btn, .nav-link, .fab, .action-btn').forEach(el => {
        el.style.transform = '';
      });
    }
  });
}

// Text Scramble Effect
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initGreeting() {
  const greetingEl = document.getElementById('greeting-text');
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  
  const fx = new TextScramble(greetingEl);
  fx.setText(`${greeting}, Explorer`);
}


// Modal & Custom Bookmarks Logic
function initModal() {
  const addBtn = document.getElementById('add-bookmark-btn');
  const modal = document.getElementById('bookmark-modal');
  
  if (addBtn && modal) {
    addBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  window.closeModal = () => {
    modal.classList.remove('active');
    document.getElementById('edit-index').value = "-1";
    document.getElementById('modal-title').textContent = "Add New Resource";
  };

  window.openEditModal = (catId, index) => {
    const cat = categories.find(c => c.id === catId);
    const bm = cat.bookmarks[index];
    
    document.getElementById('edit-index').value = `${catId}|${index}`;
    document.getElementById('modal-title').textContent = "Edit Resource";
    document.getElementById('bm-name').value = bm.name;
    document.getElementById('bm-url').value = bm.url;
    document.getElementById('bm-category').value = catId;
    
    modal.classList.add('active');
  };

  window.saveBookmark = () => {
    const name = document.getElementById('bm-name').value;
    const url = document.getElementById('bm-url').value;
    const catId = document.getElementById('bm-category').value;
    const editVal = document.getElementById('edit-index').value;

    if (!name || !url) return alert('Please fill all fields');

    const bookmark = {
      name,
      url,
      icon: 'fa-link',
      action: 'Visit Resource'
    };

    const customs = JSON.parse(localStorage.getItem('custom_bookmarks') || '{}');

    if (editVal !== "-1") {
      // Edit mode
      const [oldCatId, oldIndex] = editVal.split('|');
      
      // If category changed, remove from old, add to new
      if (oldCatId !== catId) {
        // Remove from old
        if (customs[oldCatId]) {
            const oldCat = categories.find(c => c.id === oldCatId);
            const oldBm = oldCat.bookmarks[parseInt(oldIndex)];
            customs[oldCatId] = customs[oldCatId].filter(c => c.url !== oldBm.url);
            oldCat.bookmarks.splice(parseInt(oldIndex), 1);
        }
        // Add to new
        if (!customs[catId]) customs[catId] = [];
        customs[catId].push(bookmark);
      } else {
        // Just update in same category
        const oldCat = categories.find(c => c.id === oldCatId);
        const oldBm = oldCat.bookmarks[parseInt(oldIndex)];
        
        if (customs[catId]) {
            const idxInCustoms = customs[catId].findIndex(c => c.url === oldBm.url);
            if (idxInCustoms > -1) {
                customs[catId][idxInCustoms] = bookmark;
            } else {
                customs[catId].push(bookmark);
            }
        } else {
            customs[catId] = [bookmark];
        }
        // Update in-memory
        oldCat.bookmarks[parseInt(oldIndex)] = bookmark;
      }
    } else {
      // Add mode
      if (!customs[catId]) customs[catId] = [];
      customs[catId].push(bookmark);
    }

    localStorage.setItem('custom_bookmarks', JSON.stringify(customs));

    // Refresh everything
    refreshDashboard();
    closeModal();
    
    // Reset fields
    document.getElementById('bm-name').value = '';
    document.getElementById('bm-url').value = '';
  };
}

function loadCustomBookmarks() {
  // 1. Remove markers for hidden defaults
  const hidden = JSON.parse(localStorage.getItem('hidden_bookmarks') || '[]');
  categories.forEach(cat => {
    cat.bookmarks = cat.bookmarks.filter(b => !hidden.includes(b.url));
  });

  // 2. Add truly custom bookmarks
  const customs = JSON.parse(localStorage.getItem('custom_bookmarks') || '{}');
  Object.keys(customs).forEach(catId => {
    const cat = categories.find(c => c.id === catId);
    if (cat) {
      customs[catId].forEach(cb => {
        if (!cat.bookmarks.find(b => b.url === cb.url)) {
          cat.bookmarks.push(cb);
        }
      });
    }
  });
}

// Global update for delete Bookmark
window.deleteBookmark = (catId, index) => {
  if (!confirm('Are you sure you want to delete this bookmark?')) return;
  
  const cat = categories.find(c => c.id === catId);
  const bm = cat.bookmarks[index];
  
  // Track hidden defaults
  const hidden = JSON.parse(localStorage.getItem('hidden_bookmarks') || '[]');
  if (!hidden.includes(bm.url)) {
    hidden.push(bm.url);
    localStorage.setItem('hidden_bookmarks', JSON.stringify(hidden));
  }

  // Remove from localStorage customs if it exists there
  const customs = JSON.parse(localStorage.getItem('custom_bookmarks') || '{}');
  if (customs[catId]) {
    customs[catId] = customs[catId].filter(c => c.url !== bm.url);
    localStorage.setItem('custom_bookmarks', JSON.stringify(customs));
  }
  
  // Remove from in-memory cat
  cat.bookmarks.splice(index, 1);
  
  renderCategories();
};
