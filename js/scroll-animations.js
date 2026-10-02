/* ============================================================
 * js/scroll-animations.js — Scroll Reveal Engine
 * Phase 19 — Không phụ thuộc thư viện ngoài
 * Include sau tất cả script khác, trước </body>
 * ============================================================ */
(function() {
  'use strict';

  // Không chạy nếu user prefer reduced motion (accessibility)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELECTOR = '.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale';

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Chỉ chạy 1 lần duy nhất
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -30px 0px'
  });

  function init() {
    document.querySelectorAll(SELECTOR).forEach(function(el) {
      // An toàn: bỏ qua element đang bị ẩn
      var computed = window.getComputedStyle(el);
      if (computed.display === 'none' || computed.visibility === 'hidden') return;
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM đã sẵn sàng
    init();
  }
})();
