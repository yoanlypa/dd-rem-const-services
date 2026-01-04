(function () {
  function initHeroSlider(root) {
    const slidesWrap = root.querySelector("[data-slides]");
    if (!slidesWrap) return;

    const slides = Array.from(slidesWrap.querySelectorAll("[data-slide]"));
    if (slides.length <= 1) return;

    const dotsWrap = root.querySelector("[data-dots]");
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll("[data-dot]")) : [];

    const btnPrev = root.querySelector("[data-prev]");
    const btnNext = root.querySelector("[data-next]");

    const autoplay = root.getAttribute("data-autoplay") === "1";
    const intervalSec = Number(root.getAttribute("data-interval") || "6");
    const intervalMs = Math.max(2000, intervalSec * 1000);

    // A11y
    root.setAttribute("tabindex", root.getAttribute("tabindex") || "0");
    root.setAttribute("aria-roledescription", "carousel");
    root.setAttribute("aria-label", root.getAttribute("aria-label") || "Hero slider");

    let index = slides.findIndex(s => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    let timer = null;
    let isVisible = true;
    let isPausedByUser = false;

    function setDotState(i) {
      dots.forEach((d, idx) => {
        const active = idx === i;
        d.classList.toggle("is-active", active);
        d.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    function apply(i, { fromUser = false } = {}) {
      slides.forEach((s, idx) => {
        const active = idx === i;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", active ? "false" : "true");
      });

      if (dots.length) setDotState(i);
      index = i;

      // Preload next image for smoother transitions
      preloadNext();
      if (fromUser) isPausedByUser = true;
    }

    function next(fromUser = false) { apply((index + 1) % slides.length, { fromUser }); }
    function prev(fromUser = false) { apply((index - 1 + slides.length) % slides.length, { fromUser }); }

    function start() {
      if (!autoplay) return;
      if (!isVisible) return;
      if (isPausedByUser) return;
      stop();
      timer = setInterval(() => next(false), intervalMs);
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function preloadNext() {
      const nextIndex = (index + 1) % slides.length;
      const img = slides[nextIndex].querySelector("img");
      if (!img) return;

      const src = img.currentSrc || img.getAttribute("src");
      if (!src) return;

      const linkId = "preload-hero-next";
      let link = document.getElementById(linkId);
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "preload";
        link.as = "image";
        document.head.appendChild(link);
      }
      link.href = src;
    }

    // Buttons
    if (btnNext) btnNext.addEventListener("click", () => { stop(); next(true); start(); });
    if (btnPrev) btnPrev.addEventListener("click", () => { stop(); prev(true); start(); });

    // Dots
    if (dots.length) {
      dots.forEach((d, idx) => {
        d.setAttribute("type", "button");
        d.setAttribute("aria-label", `Go to slide ${idx + 1}`);
        d.addEventListener("click", () => { stop(); apply(idx, { fromUser: true }); start(); });
      });
    }

    // Keyboard
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { stop(); next(true); start(); }
      if (e.key === "ArrowLeft") { stop(); prev(true); start(); }
      if (e.key === " " || e.key === "Enter") {
        // toggle pause/play
        isPausedByUser = !isPausedByUser;
        if (isPausedByUser) stop(); else start();
        e.preventDefault();
      }
    });

    // Pause on hover/focus
    root.addEventListener("mouseenter", () => { stop(); });
    root.addEventListener("mouseleave", () => { start(); });
    root.addEventListener("focusin", () => { stop(); });
    root.addEventListener("focusout", () => { start(); });

    // Swipe (touch)
    let startX = 0;
    let startY = 0;
    let tracking = false;

    root.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      tracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    root.addEventListener("touchend", (e) => {
      if (!tracking) return;
      tracking = false;

      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // Ignore vertical scroll gestures
      if (Math.abs(dy) > Math.abs(dx)) return;

      const threshold = 40;
      if (dx <= -threshold) { stop(); next(true); start(); }
      if (dx >= threshold) { stop(); prev(true); start(); }
    }, { passive: true });

    // Pause when not visible
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        isVisible = entries.some(en => en.isIntersecting);
        if (!isVisible) stop();
        else start();
      }, { threshold: 0.2 });
      io.observe(root);
    }

    // Init
    apply(index, { fromUser: false });
    start();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-hero-slider]").forEach(initHeroSlider);
  });
})();
