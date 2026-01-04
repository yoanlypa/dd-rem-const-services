(function () {
  // FAQ Accordion
  const accordions = document.querySelectorAll("[data-accordion]");
  accordions.forEach((root) => {
    const buttons = root.querySelectorAll("[data-acc-btn]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accItem");
        const body = item.querySelector("[data-acc-body]");
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        // Close others (optional, keeps it clean)
        buttons.forEach((otherBtn) => {
          if (otherBtn === btn) return;
          otherBtn.setAttribute("aria-expanded", "false");
          const otherItem = otherBtn.closest(".accItem");
          const otherBody = otherItem.querySelector("[data-acc-body]");
          otherBody.hidden = true;
          const icon = otherBtn.querySelector(".accIcon");
          if (icon) icon.textContent = "+";
        });

        btn.setAttribute("aria-expanded", String(!isOpen));
        body.hidden = isOpen;

        const icon = btn.querySelector(".accIcon");
        if (icon) icon.textContent = isOpen ? "+" : "–";
      });
    });
  });

  // Testimonials slider (simple)
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const track = slider.querySelector("[data-track]");
    const slides = slider.querySelectorAll("[data-slide]");
    const prev = slider.querySelector("[data-prev]");
    const next = slider.querySelector("[data-next]");

    if (!track || slides.length === 0) return;

    let index = 0;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    prev?.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    });

    next?.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      update();
    });

    // Optional auto-advance (comment out if you dislike)
    // setInterval(() => { index = (index + 1) % slides.length; update(); }, 7000);

    update();
  });
})();




(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Rotate FAQ icon when open
  document.querySelectorAll("[data-accordion] [data-acc-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const icon = btn.querySelector(".accIcon");
      if (icon) icon.style.transform = expanded ? "rotate(0deg)" : "rotate(45deg)";
    });
  });

  // Scroll reveal (subtle)
  if (!prefersReduced) {
    const reveal = (el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    };

    const targets = document.querySelectorAll(".hero, .band, .pricing, .testimonials, .faq, .values, .stats, .footer");
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach((el) => io.observe(el));
  }

  // Stats counter
  const stats = document.querySelectorAll(".stat__value");
  if (stats.length && !prefersReduced) {
    const parseNum = (txt) => {
      const clean = txt.replace(/,/g, "").trim();
      const plus = clean.endsWith("+");
      const num = parseFloat(clean.replace("+",""));
      return { num: isNaN(num) ? null : num, plus, raw: txt };
    };

    const animate = (el) => {
      const { num, plus, raw } = parseNum(el.textContent);
      if (num === null) return;

      const isInt = Number.isInteger(num);
      const duration = 900;
      const start = performance.now();

      const step = (t) => {
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = num * eased;

        el.textContent = (isInt ? Math.round(val) : val.toFixed(1)) + (plus ? "+" : "");
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = raw; // deja el original al final (por formato)
      };

      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });

    stats.forEach((el) => io.observe(el));
  }
})();


(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-hero-slider]").forEach((root) => {
    const slides = Array.from(root.querySelectorAll("[data-slide]"));
    const dots = Array.from(root.querySelectorAll("[data-dot]"));
    const prevBtn = root.querySelector("[data-prev]");
    const nextBtn = root.querySelector("[data-next]");

    if (!slides.length) return;

    let index = 0;
    let timer = null;

    const autoplay = root.getAttribute("data-autoplay") === "1";
    const intervalSec = parseInt(root.getAttribute("data-interval") || "6", 10);
    const intervalMs = Math.max(3000, Math.min(12000, intervalSec * 1000));

    const setActive = (i) => {
      index = (i + slides.length) % slides.length;

      slides.forEach((s, idx) => {
        const active = idx === index;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", active ? "false" : "true");
      });

      dots.forEach((d, idx) => d.classList.toggle("is-active", idx === index));
    };

    const next = () => setActive(index + 1);
    const prev = () => setActive(index - 1);

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (!autoplay || prefersReduced) return;
      stop();
      timer = window.setInterval(next, intervalMs);
    };

    // Init
    setActive(0);
    start();

    // Controls
    nextBtn?.addEventListener("click", () => { next(); start(); });
    prevBtn?.addEventListener("click", () => { prev(); start(); });

    dots.forEach((d, idx) => {
      d.addEventListener("click", () => { setActive(idx); start(); });
    });

    // Pause on hover/focus (desktop)
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    // Keyboard
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { next(); start(); }
      if (e.key === "ArrowLeft") { prev(); start(); }
    });

    // Touch swipe (mobile)
    let x0 = null;
    const onTouchStart = (e) => { x0 = e.touches?.[0]?.clientX ?? null; };
    const onTouchMove = (e) => {
      if (x0 == null) return;
      const x1 = e.touches?.[0]?.clientX ?? null;
      if (x1 == null) return;
      const dx = x0 - x1;

      if (Math.abs(dx) > 40) {
        dx > 0 ? next() : prev();
        start();
        x0 = null;
      }
    };
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
  });
})();


(function () {
  const drawer = document.querySelector("[data-drawer]");
  const burger = document.querySelector("[data-burger]");
  const closeBtn = document.querySelector("[data-close]");
  const backdrop = document.querySelector("[data-backdrop]");

  if (!drawer || !burger) return;

  const setOpen = (open) => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  };

  burger.addEventListener("click", () => setOpen(true));
  closeBtn?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));

  drawer.querySelectorAll("[data-drawer-link]").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();
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

      if (dots.length) {
        dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
      }

      index = i;
    }

    function next() { apply((index + 1) % slides.length); }
    function prev() { apply((index - 1 + slides.length) % slides.length); }

    if (btnNext) btnNext.addEventListener("click", () => { stop(); next(); start(); });
    if (btnPrev) btnPrev.addEventListener("click", () => { stop(); prev(); start(); });

    if (dots.length) {
      dots.forEach((d, idx) => {
        d.addEventListener("click", () => { stop(); apply(idx); start(); });
      });
    }

    // Keyboard accessibility
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { stop(); next(); start(); }
      if (e.key === "ArrowLeft") { stop(); prev(); start(); }
    });

    // Autoplay management (pause on hover/focus)
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
