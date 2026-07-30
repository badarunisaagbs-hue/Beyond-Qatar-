/**
 * BADARUNISA IBRAHIM – BEYOND QATAR
 * Mood Board Editorial Controller
 */

class BeyondQatarApp {
  constructor() {
    this.searchQuery = '';
    this.init();
  }

  init() {
    this.renderArticles();
    this.renderResources();
    this.setupScrollListeners();
    this.setupKeyboardShortcuts();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  setupScrollListeners() {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progressBar = document.getElementById('reading-progress-bar');
      if (progressBar) progressBar.style.width = scrolled + '%';
    });
  }

  playPodcast() {
    const modal = document.getElementById('media-player-modal');
    if (modal) modal.classList.add('open');
    const audio = document.getElementById('audio-element');
    if (audio) audio.play().catch(() => {});
  }

  closeMediaPlayer() {
    const modal = document.getElementById('media-player-modal');
    if (modal) modal.classList.remove('open');
    const audio = document.getElementById('audio-element');
    if (audio) audio.pause();
  }

  toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.classList.toggle('open');
  }

  closeMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.classList.remove('open');
  }

  renderArticles() {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    const filtered = SITE_DATA.articles.filter(a => 
      this.searchQuery === '' ||
      a.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      a.snippet.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    grid.innerHTML = filtered.map(article => `
      <article class="editorial-card" style="padding: 28px; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--burgundy-accent); letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 8px;">${article.categoryLabel} &bull; ${article.readTime}</span>
          <h3 style="font-size: 1.35rem; margin-bottom: 10px; line-height: 1.3;">${article.title}</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted-dark); margin-bottom: 20px;">${article.snippet}</p>
        </div>
        <div style="padding-top: 16px; border-top: 1px solid var(--border-light);">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--espresso-dark); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;" onclick="app.openArticleModal('${article.id}')">
            Read Article <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
          </span>
        </div>
      </article>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  filterArticles() {
    const input = document.getElementById('blog-search-input');
    if (input) {
      this.searchQuery = input.value;
      this.renderArticles();
    }
  }

  renderResources() {
    const grid = document.getElementById('resources-grid');
    if (!grid) return;

    grid.innerHTML = SITE_DATA.resources.map(res => `
      <div class="passport-card">
        <div>
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--burgundy-accent); letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 8px;">${res.badge}</span>
          <span style="font-size: 0.78rem; color: var(--taupe-primary); font-weight: 700; display: block; margin-bottom: 8px;">${res.format}</span>
          <h3 style="font-size: 1.3rem; margin-bottom: 10px;">${res.title}</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted-dark); margin-bottom: 20px;">${res.desc}</p>
        </div>
        <button class="btn btn-espresso btn-sm w-full" onclick="app.openResourceModal('${res.id}')">
          Download Guide <i data-lucide="download"></i>
        </button>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  openArticleModal(articleId) {
    const article = SITE_DATA.articles.find(a => a.id === articleId);
    if (!article) return;

    const modal = document.getElementById('article-modal');
    const categoryBadge = document.getElementById('article-modal-category');
    const modalBody = document.getElementById('article-modal-body');

    if (categoryBadge) categoryBadge.innerText = article.categoryLabel;
    if (modalBody) {
      modalBody.innerHTML = `
        <h2 style="font-size: 2.2rem; margin-bottom: 14px;">${article.title}</h2>
        <div style="font-size: 0.85rem; color: var(--taupe-primary); margin-bottom: 20px; display: flex; gap: 16px;">
          <span><strong>Author:</strong> Badarunisa Ibrahim</span>
          <span><strong>Date:</strong> ${article.date}</span>
          <span><strong>Read Time:</strong> ${article.readTime}</span>
        </div>
        <div style="line-height: 1.8; color: var(--text-dark);">
          ${article.content}
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-outline-dark btn-sm" onclick="app.showToast('Article link copied!', 'info')">
            Share Article <i data-lucide="share-2"></i>
          </button>
          <a href="#contact" class="btn btn-espresso btn-sm" onclick="app.closeArticleModal()">
            Work With Badarunisa <i data-lucide="arrow-right"></i>
          </a>
        </div>
      `;
    }

    if (modal) modal.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
  }

  closeArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) modal.classList.remove('open');
  }

  openResourceModal(resourceId) {
    const resource = SITE_DATA.resources.find(r => r.id === resourceId) || SITE_DATA.resources[0];
    const modal = document.getElementById('resource-modal');
    const body = document.getElementById('resource-modal-body');

    if (body) {
      body.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--burgundy-accent); letter-spacing: 2px; text-transform: uppercase;">${resource.format}</span>
          <h3 style="font-size: 1.5rem; margin: 10px 0;">${resource.title}</h3>
          <p style="color: var(--text-muted-dark); font-size: 0.9rem;">${resource.desc}</p>
        </div>
        <form onsubmit="app.handleResourceDownload(event, '${resource.title}')">
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px;">Your Full Name</label>
            <input type="text" required placeholder="Enter full name" class="input-pill">
          </div>
          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px;">Email Address</label>
            <input type="email" required placeholder="Enter email address" class="input-pill">
          </div>
          <button type="submit" class="btn btn-espresso btn-lg w-full">
            <span>Instant Download</span>
            <i data-lucide="download"></i>
          </button>
        </form>
      `;
    }

    if (modal) modal.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
  }

  closeResourceModal() {
    const modal = document.getElementById('resource-modal');
    if (modal) modal.classList.remove('open');
  }

  openInquiryModal(serviceId = '') {
    const select = document.getElementById('inquiry-service');
    if (select && serviceId) select.value = serviceId;
    window.location.href = '#contact';
  }

  openSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.add('open');
    const input = document.getElementById('modal-search-input');
    if (input) input.focus();
  }

  closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.remove('open');
  }

  performModalSearch() {
    const input = document.getElementById('modal-search-input');
    const resultsContainer = document.getElementById('modal-search-results');
    if (!input || !resultsContainer) return;

    const query = input.value.trim().toLowerCase();
    if (query === '') {
      resultsContainer.innerHTML = `<p style="color: var(--text-muted-dark); font-size: 0.9rem; text-align: center;">Start typing to search...</p>`;
      return;
    }

    const matchedArticles = SITE_DATA.articles.filter(a => 
      a.title.toLowerCase().includes(query) || a.snippet.toLowerCase().includes(query)
    );

    if (matchedArticles.length === 0) {
      resultsContainer.innerHTML = `<p style="color: var(--text-muted-dark); font-size: 0.9rem; text-align: center;">No matches found for "${query}".</p>`;
      return;
    }

    resultsContainer.innerHTML = matchedArticles.map(a => `
      <div style="padding: 12px; border-bottom: 1px solid var(--border-light); cursor: pointer;" onclick="app.closeSearchModal(); app.openArticleModal('${a.id}');">
        <strong>${a.title}</strong>
        <p style="font-size: 0.8rem; color: var(--text-muted-dark); margin-top: 4px;">${a.snippet}</p>
      </div>
    `).join('');
  }

  handleResourceDownload(event, title) {
    event.preventDefault();
    this.closeResourceModal();
    
    const element = document.createElement("a");
    const file = new Blob([
      `BEYOND QATAR - EXECUTIVE GUIDE BY BADARUNISA IBRAHIM\n\nTitle: ${title}\nPlatform: Beyond Qatar (www.beyondqatar.com)\nAuthor: Badarunisa Ibrahim\n\nThank you for downloading this guide!`
    ], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    this.showToast(`Downloading: "${title}"`, 'success');
  }

  handleInquirySubmit(event) {
    event.preventDefault();
    const name = document.getElementById('inquiry-name')?.value || 'Valued Client';
    this.showToast(`Thank you ${name}! Badarunisa Ibrahim will contact you shortly.`, 'success');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchModal();
      }
      if (e.key === 'Escape') {
        this.closeArticleModal();
        this.closeResourceModal();
        this.closeSearchModal();
        this.closeMediaPlayer();
      }
    });
  }
}

const app = new BeyondQatarApp();
window.app = app;
