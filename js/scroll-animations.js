/* ============================================================
 * js/scroll-animations.js — Scroll Reveal Engine
 * Phase 19 — Cuộn đến đâu hiện đến đó, mượt mà & an toàn 100%
 * Include sau tất cả script khác, trước </body>
 * ============================================================ */
(function() {
  'use strict';

  var SELECTOR = '.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale';

  function init() {
    var elements = document.querySelectorAll(SELECTOR);
    if (!elements || elements.length === 0) return;

    // Fallback nếu trình duyệt không hỗ trợ IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function(el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Chỉ chạy 1 lần khi cuộn tới
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    elements.forEach(function(el) {
      // An toàn: bỏ qua element đang bị ẩn display:none hoặc visibility:hidden
      try {
        var computed = window.getComputedStyle(el);
        if (computed.display === 'none' || computed.visibility === 'hidden') return;
      } catch(e) {}
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Backup trigger sau khi window load hoàn tất
  window.addEventListener('load', function() {
    setTimeout(init, 100);
  });
})();
