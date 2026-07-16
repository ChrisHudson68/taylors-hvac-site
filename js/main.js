// ── Mobile Nav ──
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

// ── Sticky header shadow ──
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// ── Active nav link ──
const currentPagePath = (function () {
  function norm(p){p=(p||'').replace(/index(.html)?$/,'').replace(/.html$/,'');if(p.length>1&&p.charAt(p.length-1)==='/')p=p.slice(0,-1);return p===''?'/':p;}
  // clean-URL aware active nav
  var path = norm(window.location.pathname);
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0 || href.indexOf('#') === 0) return;
    if (norm(href) === path) link.classList.add('active');
  });
  return path;
})();

// ── Contact form ──
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        contactForm.reset();
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        alert('Something went wrong. Please call us directly at (252) 801-4548.');
      }
    } catch {
      alert('Something went wrong. Please call us directly at (252) 801-4548.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}



/* ============================================================
   MOTION & MODERN ENHANCEMENTS  (shared: HVAC + Reno)
   ============================================================ */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('motion')) root.classList.add('motion');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll progress bar ── */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function updateBar() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();

  /* ── Floating gradient orbs in dark sections ── */
  var orbSets = [
    { color: 'rgba(220,38,38,0.50)',  size: 440, x: '6%',  y: '10%', dx: '60px',  dy: '40px' },
    { color: 'rgba(43,92,156,0.45)',  size: 500, x: '68%', y: '46%', dx: '-55px', dy: '-40px' },
    { color: 'rgba(220,38,38,0.30)',  size: 360, x: '42%', y: '82%', dx: '40px',  dy: '-32px' }
  ];
  function addOrbs(el) {
    if (el.querySelector('.fx-orbs')) return;
    var box = document.createElement('div');
    box.className = 'fx-orbs';
    for (var i = 0; i < orbSets.length; i++) {
      var c = orbSets[i];
      var b = document.createElement('b');
      b.style.background = 'radial-gradient(circle, ' + c.color + ' 0%, transparent 70%)';
      b.style.width = c.size + 'px';
      b.style.height = c.size + 'px';
      b.style.left = c.x;
      b.style.top = c.y;
      b.style.setProperty('--dx', c.dx);
      b.style.setProperty('--dy', c.dy);
      b.style.animationDelay = (i * -5) + 's';
      b.style.animationDuration = (16 + i * 4) + 's';
      box.appendChild(b);
    }
    var anchor = el.querySelector(':scope > .container');
    if (anchor) el.insertBefore(box, anchor);
    else el.insertBefore(box, el.firstChild);
  }
  if (!reduce) {
    ['.hero', '.process-section', '.trust-strip', '.zeke-section', '.cta-banner', '.page-hero']
      .forEach(function (sel) {
        document.querySelectorAll(sel).forEach(addOrbs);
      });
  }

  /* ── Scroll reveal ── */
  var revealSel = '.section-header,.service-card,.why-item,.seasonal-card,.process-step,' +
    '.testimonial-card,.value-card,.license-card,.about-intro-img,.about-number,' +
    '.service-detail-body,.service-detail-img,.contact-info,.contact-form-wrap,.contact-detail,' +
    '.area-tag,.trust-item,.team-showcase,.zeke-img-wrap,.zeke-body,.military-discount-card,' +
    '.sister-inner,.gallery-item,.reveal';
  var items = Array.prototype.slice.call(document.querySelectorAll(revealSel));

  /* stagger elements that share a parent */
  var groups = [];
  items.forEach(function (el) {
    var p = el.parentNode, g = null;
    for (var i = 0; i < groups.length; i++) { if (groups[i].p === p) { g = groups[i]; break; } }
    if (!g) { g = { p: p, list: [] }; groups.push(g); }
    g.list.push(el);
  });
  groups.forEach(function (g) {
    g.list.forEach(function (el, i) { el.style.transitionDelay = Math.min(i, 6) * 80 + 'ms'; });
  });

  function revealAll() { items.forEach(function (el) { el.classList.add('in-view'); }); }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(revealAll, 2600); /* safety net */
  } else {
    revealAll();
  }

  /* ── Count-up stat numbers ── */
  function animateCount(el) {
    var raw = el.getAttribute('data-count') || el.textContent.trim();
    var m = raw.match(/^(\D*)(\d+)(.*)$/);
    if (!m) return;
    var pre = m[1], num = parseInt(m[2], 10), suf = m[3];
    if (reduce || num > 100000) { el.textContent = raw; return; }
    el.setAttribute('data-count', raw);
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(num * eased) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('.hero-stat-value, .about-number-val');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
