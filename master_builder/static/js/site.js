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



