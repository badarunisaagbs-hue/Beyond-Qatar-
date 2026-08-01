/**
 * BADARUNISA IBRAHIM – BEYOND QATAR
 * Luxury Redesign — Application Controller
 */

class BeyondQatarApp {
  constructor() {
    this.searchQuery = '';
    this.announcementHeight = 0;
    this.currentSlideIndex = 0;
    this.slideshowTimer = null;
    this.init();
  }

  init() {
    this.renderArticles();
    this.renderResources();
    this.setupScrollListeners();
    this.setupKeyboardShortcuts();
    this.setupScrollAnimations();
    this.measureAnnouncementBar();
    this.initHeroSlideshow();
    this.setupPortraitFallback();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ── Announcement Bar ──────────────────────────────
  measureAnnouncementBar() {
    const bar = document.getElementById('announcement-bar');
    if (bar) {
      this.announcementHeight = bar.offsetHeight;
    }
  }

  // ── Hero Slideshow ─────────────────────────────────
  initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    this.startSlideshowTimer();
  }

  startSlideshowTimer() {
    if (this.slideshowTimer) clearInterval(this.slideshowTimer);
    this.slideshowTimer = setInterval(() => {
      const slides = document.querySelectorAll('.hero-slide');
      if (slides.length === 0) return;
      const nextIndex = (this.currentSlideIndex + 1) % slides.length;
      this.goToSlide(nextIndex);
    }, 5500);
  }

  goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const thumbs = document.querySelectorAll('.hero-thumb');
    const caption = document.getElementById('hero-slide-caption');

    if (index < 0 || index >= slides.length) return;

    // Remove active state
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    thumbs.forEach(t => t.classList.remove('active'));

    // Set active state
    this.currentSlideIndex = index;
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    if (thumbs[index]) thumbs[index].classList.add('active');

    // Update caption
    if (caption && slides[index]) {
      caption.innerText = slides[index].dataset.caption || 'Qatar';
    }

    // Reset timer so manual clicks don't jump immediately
    this.startSlideshowTimer();
  }

  // ── Portrait Fallback ──────────────────────────────
  setupPortraitFallback() {
    const img = document.getElementById('portrait-img');
    const fallback = document.getElementById('portrait-fallback');

    if (img && fallback) {
      img.onerror = () => {
        img.style.display = 'none';
        fallback.style.display = 'flex';
      };
    }
  }

  // ── Scroll Handling ───────────────────────────────
  setupScrollListeners() {
    const header = document.getElementById('main-header');
    const progressBar = document.getElementById('reading-progress-bar');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Reading progress
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (progressBar) progressBar.style.width = ((scrollY / total) * 100) + '%';

      // Header scroll state
      if (header) {
        if (scrollY > 60) {
          header.classList.add('scrolled');
          header.style.top = '0';
        } else {
          header.classList.remove('scrolled');
          header.style.top = this.announcementHeight + 'px';
        }
      }
    }, { passive: true });
  }

  // ── Scroll-triggered Animations ───────────────────
  setupScrollAnimations() {
    const targets = document.querySelectorAll('.fade-up, .fade-in, .slide-left, .slide-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  // ── Mobile Menu ────────────────────────────────────
  toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.classList.toggle('open');
  }

  closeMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.classList.remove('open');
  }

  // ── Podcast ────────────────────────────────────────
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

  // ── Render Articles ────────────────────────────────
  renderArticles() {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;

    const query = this.searchQuery.toLowerCase();
    const filtered = SITE_DATA.articles.filter(a =>
      query === '' ||
      a.title.toLowerCase().includes(query) ||
      a.snippet.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-taupe);">
          <p style="font-size:1.1rem;">No articles found for "<strong>${this.searchQuery}</strong>".</p>
          <button class="btn btn-outline-dark btn-sm" style="margin-top:16px;" onclick="document.getElementById('blog-search-input').value='';app.searchQuery='';app.renderArticles();">Clear Search</button>
        </div>
      `;
      return;
    }

    // Each category gets its own Qatar image + a warm colour overlay that still shows the photo
    const articleVisuals = {
      career: {
        img: './assets/doha_skyline.jpg',
        overlay: 'linear-gradient(160deg, rgba(46,34,27,0.72) 0%, rgba(169,131,75,0.45) 100%)',
        accent: '#C8A26A'
      },
      life: {
        img: './assets/souq_waqif.jpg',
        overlay: 'linear-gradient(160deg, rgba(28,20,16,0.68) 0%, rgba(93,70,55,0.50) 100%)',
        accent: '#B89060'
      },
      business: {
        img: './assets/lusail_marina.jpg',
        overlay: 'linear-gradient(160deg, rgba(20,28,36,0.70) 0%, rgba(139,117,100,0.45) 100%)',
        accent: '#A9834B'
      },
      skills: {
        img: './assets/mia_museum.jpg',
        overlay: 'linear-gradient(160deg, rgba(28,20,16,0.65) 0%, rgba(90,70,55,0.45) 100%)',
        accent: '#C8A26A'
      },
      opportunities: {
        img: './assets/lusail_marina.jpg',
        overlay: 'linear-gradient(160deg, rgba(18,26,32,0.65) 0%, rgba(169,131,75,0.40) 100%)',
        accent: '#D4AF72'
      }
    };

    grid.innerHTML = filtered.map((article, i) => {
      const visual = articleVisuals[article.category] || articleVisuals.career;
      return `
        <article class="article-card fade-up" style="transition-delay:${i * 0.08}s;">
          <div class="article-card-img-wrap" style="position:relative;overflow:hidden;">
            <!-- Qatar background photo -->
            <img
              src="${visual.img}"
              alt="${article.categoryLabel}"
              class="article-card-photo"
              loading="lazy"
            >
            <!-- Warm editorial colour overlay -->
            <div class="article-card-img-overlay" style="background:${visual.overlay};"></div>
            <!-- Icon medallion -->
            <div class="article-icon-medallion" style="border-color:${visual.accent};">
              <i data-lucide="${article.icon || 'file-text'}" style="color:${visual.accent};"></i>
            </div>
            <!-- Category badge -->
            <span class="article-category-badge">${article.categoryLabel}</span>
          </div>
          <div class="article-card-body">
            <div class="article-meta">
              <span>${article.date}</span>
              <span>·</span>
              <span>${article.readTime}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.snippet}</p>
            <div class="article-card-footer">
              <span class="article-read-link" onclick="app.openArticleModal('${article.id}')">
                Read Article <i data-lucide="arrow-right"></i>
              </span>
              <span style="font-size:0.75rem;color:var(--text-taupe);">${article.readTime}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      document.querySelectorAll('#articles-grid .fade-up').forEach(el => {
        el.classList.add('visible');
      });
    }, 50);
  }


          <h3>${article.title}</h3>
          <p>${article.snippet}</p>
          <div class="article-card-footer">
            <span class="article-read-link" onclick="app.openArticleModal('${article.id}')">
              Read Article <i data-lucide="arrow-right"></i>
            </span>
            <span style="font-size:0.75rem;color:var(--text-taupe);">${article.readTime}</span>
          </div>
        </div>
      </article>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      document.querySelectorAll('#articles-grid .fade-up').forEach(el => {
        el.classList.add('visible');
      });
    }, 50);
  }

  filterArticles() {
    const input = document.getElementById('blog-search-input');
    if (input) {
      this.searchQuery = input.value;
      this.renderArticles();
    }
  }

  // ── Render Resources ───────────────────────────────
  renderResources() {
    const grid = document.getElementById('resources-grid');
    if (!grid) return;

    const iconMap = {
      'qatar-career-guide':      'file-text',
      'newcomer-guide':          'map',
      'cv-template':             'file-badge',
      'interview-checklist':     'check-square',
      'linkedin-growth-guide':   'users',
      'business-setup-checklist':'building-2',
    };

    grid.innerHTML = SITE_DATA.resources.map((res, i) => `
      <div class="resource-card fade-up" style="transition-delay:${i * 0.07}s;">
        <div>
          <span class="resource-badge">${res.badge}</span>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="width:36px;height:36px;border-radius:50%;background:rgba(200,162,106,0.12);border:1px solid var(--border-gold);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="${iconMap[res.id] || 'file'}" style="width:16px;height:16px;color:var(--gold-antique);"></i>
            </div>
            <span class="resource-format">${res.format}</span>
          </div>
          <h3>${res.title}</h3>
          <p>${res.desc}</p>
        </div>
        <button class="btn btn-espresso btn-sm w-full" onclick="app.openResourceModal('${res.id}')">
          <i data-lucide="download"></i>
          <span>Download Guide</span>
        </button>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      document.querySelectorAll('#resources-grid .fade-up').forEach(el => {
        el.classList.add('visible');
      });
    }, 50);
  }

  // ── Article Modal ──────────────────────────────────
  openArticleModal(articleId) {
    const article = SITE_DATA.articles.find(a => a.id === articleId);
    if (!article) return;

    const modal = document.getElementById('article-modal');
    const categoryBadge = document.getElementById('article-modal-category');
    const modalBody = document.getElementById('article-modal-body');

    if (categoryBadge) categoryBadge.innerText = `${article.categoryLabel} · ${article.readTime}`;

    if (modalBody) {
      modalBody.innerHTML = `
        <h2 style="font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.2rem);color:var(--text-espresso);margin-bottom:14px;line-height:1.2;">${article.title}</h2>
        <div style="display:flex;gap:20px;font-size:0.82rem;color:var(--text-taupe);margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid var(--border-light);flex-wrap:wrap;">
          <span><strong>Author:</strong> Badarunisa Ibrahim</span>
          <span><strong>Date:</strong> ${article.date}</span>
          <span><strong>Read Time:</strong> ${article.readTime}</span>
        </div>
        <div style="line-height:1.85;color:var(--text-espresso);font-size:0.96rem;" class="article-content">
          ${article.content}
        </div>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
          <button class="btn btn-outline-dark btn-sm" onclick="app.showToast('Article link copied!', 'info')">
            <i data-lucide="share-2"></i> Share Article
          </button>
          <a href="#contact" class="btn btn-gold btn-sm" onclick="app.closeArticleModal()">
            Work With Badarunisa <i data-lucide="arrow-right"></i>
          </a>
        </div>
      `;
    }

    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  closeArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Resource Modal ─────────────────────────────────
  openResourceModal(resourceId) {
    const resource = SITE_DATA.resources.find(r => r.id === resourceId) || SITE_DATA.resources[0];
    const modal = document.getElementById('resource-modal');
    const body = document.getElementById('resource-modal-body');

    if (body) {
      body.innerHTML = `
        <div style="text-align:center;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid var(--border-light);">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(200,162,106,0.12);border:1px solid var(--border-gold);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            <i data-lucide="download" style="width:22px;height:22px;color:var(--gold-antique);"></i>
          </div>
          <span style="font-size:0.72rem;font-weight:700;color:var(--gold-antique);letter-spacing:2.5px;text-transform:uppercase;">${resource.format}</span>
          <h3 style="font-family:var(--font-display);font-size:1.45rem;margin:10px 0;color:var(--text-espresso);">${resource.title}</h3>
          <p style="color:var(--text-taupe);font-size:0.9rem;line-height:1.7;">${resource.desc}</p>
        </div>
        <form onsubmit="app.handleResourceDownload(event, '${resource.title.replace(/'/g,"\\'")}')">
          <div class="form-group">
            <label>Your Full Name</label>
            <input type="text" required placeholder="Enter full name" class="input-luxury">
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" required placeholder="Enter email address" class="input-luxury">
          </div>
          <button type="submit" class="btn btn-gold btn-lg w-full">
            <span>Instant Download</span>
            <i data-lucide="download"></i>
          </button>
        </form>
      `;
    }

    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }

  closeResourceModal() {
    const modal = document.getElementById('resource-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Search ─────────────────────────────────────────
  openSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.add('open');
    const input = document.getElementById('modal-search-input');
    if (input) setTimeout(() => input.focus(), 100);
    document.body.style.overflow = 'hidden';
  }

  closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  performModalSearch() {
    const input = document.getElementById('modal-search-input');
    const resultsContainer = document.getElementById('modal-search-results');
    if (!input || !resultsContainer) return;

    const query = input.value.trim().toLowerCase();
    if (query === '') {
      resultsContainer.innerHTML = `<p style="color:var(--text-taupe);font-size:0.9rem;text-align:center;">Start typing to search...</p>`;
      return;
    }

    const matched = SITE_DATA.articles.filter(a =>
      a.title.toLowerCase().includes(query) || a.snippet.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
      resultsContainer.innerHTML = `<p style="color:var(--text-taupe);font-size:0.9rem;text-align:center;">No matches found for "<strong>${query}</strong>".</p>`;
      return;
    }

    resultsContainer.innerHTML = matched.map(a => `
      <div class="search-result-item" onclick="app.closeSearchModal(); app.openArticleModal('${a.id}');">
        <strong>${a.title}</strong>
        <p>${a.snippet}</p>
      </div>
    `).join('');
  }

  // ── Form Handlers ─────────────────────────────────
  handleResourceDownload(event, title) {
    event.preventDefault();
    this.closeResourceModal();

    const element = document.createElement('a');
    const file = new Blob([
      `BEYOND QATAR — EXECUTIVE GUIDE BY BADARUNISA IBRAHIM\n\nTitle: ${title}\nPlatform: Beyond Qatar (www.beyondqatar.com)\nAuthor: Badarunisa Ibrahim\n\nThank you for downloading this guide!\n\nFor personalized consultation, contact: badarunisa@beyondqatar.com`
    ], { type: 'text/plain' });
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
    event.target.reset();
    this.showToast(`Thank you ${name}! Badarunisa Ibrahim will contact you shortly.`, 'success');
  }

  openInquiryModal(serviceId = '') {
    const select = document.getElementById('inquiry-service');
    if (select && serviceId) select.value = select.value = serviceId;
    window.location.href = '#contact';
  }

  // ── Toast ──────────────────────────────────────────
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
    }, 4500);
  }

  // ── Keyboard Shortcuts ────────────────────────────
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
        this.closeMobileMenu();
      }
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.closeArticleModal();
          this.closeResourceModal();
          this.closeSearchModal();
          this.closeMediaPlayer();
        }
      });
    });
  }
}

const app = new BeyondQatarApp();
window.app = app;
