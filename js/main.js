/* ============================================================
   THEME TOGGLE
   ============================================================ */

const THEME_KEY = 'preferred-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '☾';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ============================================================
   NAVIGATION
   ============================================================ */

function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  // Scrolled state
  function onScroll() {
    if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 20);
    updateScrollProgress();
    toggleBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('nav__link--active');
      link.classList.add('nav__mobile-link--active');
    }
  });
}

/* ============================================================
   SCROLL PROGRESS
   ============================================================ */

function updateScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
}

/* ============================================================
   BACK TO TOP
   ============================================================ */

function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('is-visible', window.scrollY > 500);
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */

function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 80 + 'ms';
    observer.observe(el);
  });
}

/* ============================================================
   SKILL BARS
   ============================================================ */

function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.getAttribute('data-width') || '0%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
}

/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */

function initPortfolioFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const filter = tab.getAttribute('data-filter');

      items.forEach(item => {
        const show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';

        setTimeout(() => {
          item.style.display = show ? '' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }
        }, 200);
      });
    });
  });

  items.forEach(item => {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
}

/* ============================================================
   BLOG SEARCH & FILTER
   ============================================================ */

function initBlogFilter() {
  const searchInput = document.getElementById('blog-search');
  const categoryLinks = document.querySelectorAll('.sidebar-category');
  const posts = document.querySelectorAll('.blog-post-item');

  if (!searchInput && !categoryLinks.length) return;

  let activeCategory = 'all';

  function filterPosts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    posts.forEach(post => {
      const title = post.querySelector('.blog-card__title')?.textContent.toLowerCase() || '';
      const excerpt = post.querySelector('.blog-card__excerpt')?.textContent.toLowerCase() || '';
      const category = post.getAttribute('data-category') || '';
      const matchesQuery = !query || title.includes(query) || excerpt.includes(query);
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      post.style.display = matchesQuery && matchesCategory ? '' : 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterPosts);
  }

  categoryLinks.forEach(link => {
    link.addEventListener('click', () => {
      categoryLinks.forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');
      activeCategory = link.getAttribute('data-category') || 'all';
      filterPosts();
    });
  });
}

/* ============================================================
   TABLE OF CONTENTS (Blog post)
   ============================================================ */

function initTOC() {
  const toc = document.querySelector('.post-toc__list');
  const content = document.querySelector('.post-content');
  if (!toc || !content) return;

  const headings = content.querySelectorAll('h2, h3');

  headings.forEach((heading, i) => {
    if (!heading.id) heading.id = 'heading-' + i;
    const item = document.createElement('div');
    item.className = 'post-toc__item' + (heading.tagName === 'H3' ? ' post-toc__item--sub' : '');
    item.textContent = heading.textContent;
    item.setAttribute('data-target', heading.id);
    item.addEventListener('click', () => {
      document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    toc.appendChild(item);
  });

  // Highlight active heading
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.post-toc__item').forEach(item => {
          item.classList.toggle('is-active', item.getAttribute('data-target') === entry.target.id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(h => observer.observe(h));
}

/* ============================================================
   CONTACT FORM
   ============================================================ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1500);
  });
}

/* ============================================================
   COUNTERS (Stats)
   ============================================================ */

function initCounters() {
  const counters = document.querySelectorAll('.stat-item__number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getStoredTheme());

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  initNav();
  initBackToTop();
  initScrollAnimations();
  initSkillBars();
  initPortfolioFilter();
  initBlogFilter();
  initTOC();
  initContactForm();
  initCounters();
});
