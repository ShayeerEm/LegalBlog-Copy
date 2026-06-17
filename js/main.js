/* ── THEME ─────────────────────────────────────────────────── */
const THEME_KEY = 'preferred-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '○' : '●';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ── CUSTOM CURSOR ─────────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  function tickRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(tickRing);
  }
  tickRing();

  const hoverTargets = 'a, button, [role="button"], input, textarea, select, label, .blog-row, .blog-list-item, .exp-card, .ach-card, .port-item, .pf-cell';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('is-hovering');
      ring.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('cursor--hidden');
    ring.classList.add('cursor--hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('cursor--hidden');
    ring.classList.remove('cursor--hidden');
  });
}

/* ── NAVIGATION ────────────────────────────────────────────── */
function initNav() {
  const nav       = document.querySelector('.nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 20);
    updateScrollProgress();
    toggleBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

/* ── SCROLL PROGRESS ───────────────────────────────────────── */
function updateScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width  = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
}

/* ── BACK TO TOP ───────────────────────────────────────────── */
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('is-visible', window.scrollY > 500);
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── SCROLL ANIMATIONS ─────────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-fade');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 70 + 'ms';
    observer.observe(el);
  });
}

/* ── SKILL BARS ────────────────────────────────────────────── */
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

/* ── PORTFOLIO FILTER ──────────────────────────────────────── */
function initPortfolioFilter() {
  const tabs  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('[data-category]');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const filter = tab.getAttribute('data-filter');

      items.forEach(item => {
        const show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.transition = 'opacity .2s, transform .2s';
        item.style.opacity = '0';
        item.style.transform = 'scale(.96)';

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
}

/* ── BLOG SEARCH & FILTER ──────────────────────────────────── */
function initBlogFilter() {
  const searchInput = document.getElementById('blog-search');
  const filterBtns  = document.querySelectorAll('.blog-filter-btn');
  const posts        = document.querySelectorAll('.blog-post-item');
  if (!posts.length) return;

  let activeCategory = 'all';

  function filterPosts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    posts.forEach(post => {
      const titleEl    = post.querySelector('.blog-list-item__title');
      const title      = titleEl ? titleEl.textContent.toLowerCase() : '';
      const category   = post.getAttribute('data-category') || '';
      const matchQuery = !query || title.includes(query);
      const matchCat   = activeCategory === 'all' || category === activeCategory;
      post.style.display = matchQuery && matchCat ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterPosts);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      filterPosts();
    });
  });
}

/* ── TABLE OF CONTENTS ─────────────────────────────────────── */
function initTOC() {
  const toc     = document.querySelector('.post-toc__list');
  const content = document.querySelector('.post-content');
  if (!toc || !content) return;

  const headings = content.querySelectorAll('h2, h3');
  headings.forEach((heading, i) => {
    if (!heading.id) heading.id = 'h-' + i;
    const item = document.createElement('div');
    item.className = 'post-toc__item' + (heading.tagName === 'H3' ? ' post-toc__item--sub' : '');
    item.textContent = heading.textContent;
    item.setAttribute('data-target', heading.id);
    item.addEventListener('click', () => {
      document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    toc.appendChild(item);
  });

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

/* ── CONTACT FORM ──────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Sent ✓';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1500);
  });
}

/* ── COUNTERS ──────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-cell__number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseInt(el.getAttribute('data-count'), 10);
      const suffix   = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start    = performance.now();

      function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const v = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(v * target) + suffix;
        if (p < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getStoredTheme());

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  initCursor();
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
