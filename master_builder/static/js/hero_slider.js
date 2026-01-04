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

    let index = slides.findIndex(s => s.classList.contains("is-active"));
    if (index < 0) index = 0;

    function apply(i) {
      slides.forEach((s, idx) => {
        const active = idx === i;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
      index = i;
    }

    function next() { apply((index + 1) % slides.length); }
    function prev() { apply((index - 1 + slides.length) % slides.length); }

    if (btnNext) btnNext.addEventListener("click", () => { stop(); next(); start(); });
    if (btnPrev) btnPrev.addEventListener("click", () => { stop(); prev(); start(); });

    dots.forEach((d, idx) => d.addEventListener("click", () => { stop(); apply(idx); start(); }));

    let timer = null;
    function start() {
      if (!autoplay) return;
      stop();
      timer = setInterval(next, intervalMs);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    apply(index);
    start();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-hero-slider]").forEach(initHeroSlider);
  });
})();
