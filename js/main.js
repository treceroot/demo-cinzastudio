/* ============================================================
   CINZA STUDIO — main.js
   Nav, reveals, contadores, hero interactivo, galería,
   horarios (hora de Santiago) y cursor.
   ============================================================ */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Nav: estado al hacer scroll ---------- */
  const nav = $("#nav");
  const onScrollNav = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Menú móvil ---------- */
  const burger = $("#burger");
  const mobileMenu = $("#mobile-menu");

  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    if (open) {
      mobileMenu.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => mobileMenu.classList.add("is-open"));
    } else {
      mobileMenu.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(() => { mobileMenu.hidden = true; }, reducedMotion ? 0 : 250);
    }
  };

  burger.addEventListener("click", () =>
    setMenu(burger.getAttribute("aria-expanded") !== "true")
  );
  $$(".mobile-menu-links a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.hidden) {
      setMenu(false);
      burger.focus();
    }
  });

  /* ---------- Scrollspy ---------- */
  const navAnchors = $$(".nav-links a");
  const spySections = navAnchors
    .map((a) => $(a.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  spySections.forEach((s) => spy.observe(s));

  /* ---------- Reveals al hacer scroll ---------- */
  const revealEls = $$("[data-reveal]");
  if (reducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Contadores (cifras) ---------- */
  const fmtCL = (n) => n.toLocaleString("es-CL");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const prefix = el.dataset.prefix || "";
    if (reducedMotion) {
      el.textContent = prefix + fmtCL(target);
      return;
    }
    const dur = 1600;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      el.textContent = prefix + fmtCL(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  $$(".stat-num").forEach((el) => countIO.observe(el));

  /* ---------- Hero: spotlight interactivo ---------- */
  const heroWord = $("#hero-word");
  if (heroWord && finePointer && !reducedMotion) {
    let mx = 0.5, my = 0.5;      // posición objetivo (0..1)
    let cx = 0.5, cy = 0.5;      // posición actual (lerp)
    const rect = () => heroWord.getBoundingClientRect();

    window.addEventListener("mousemove", (e) => {
      const r = rect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
    }, { passive: true });

    const loop = () => {
      cx += (mx - cx) * 0.09;
      cy += (my - cy) * 0.09;
      heroWord.style.setProperty("--mx", `${(cx * 100).toFixed(2)}%`);
      heroWord.style.setProperty("--my", `${(cy * 100).toFixed(2)}%`);
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Hero: scramble decode del título ---------- */
  const scrambleEl = $(".hero-word-outline");
  const scrambleFill = $(".hero-word-fill");
  if (scrambleEl && !reducedMotion) {
    const finalText = scrambleEl.textContent;
    const chars = "ABCDEFGHIKLMNOPRSTUVXYZ#%&/·";
    const dur = 1400;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const locked = Math.floor(p * finalText.length);
      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        out += i < locked
          ? finalText[i]
          : chars[Math.floor(Math.random() * chars.length)];
      }
      scrambleEl.textContent = out;
      if (scrambleFill) scrambleFill.textContent = out;
      if (p < 1) requestAnimationFrame(tick);
      else {
        scrambleEl.textContent = finalText;
        if (scrambleFill) scrambleFill.textContent = finalText;
      }
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Hero: parallax al hacer scroll ---------- */
  const heroBg = $(".hero-bg img");
  const heroInner = $(".hero-inner");
  if (heroBg && heroInner && !reducedMotion) {
    let ticking = false;
    const parallax = () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = `translateY(${y * 0.28}px) scale(1.06)`;
        heroInner.style.transform = `translateY(${y * 0.14}px)`;
        heroInner.style.opacity = String(Math.max(1 - y / (window.innerHeight * 0.9), 0));
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(parallax);
      }
    }, { passive: true });
  }

  /* ---------- Galería: lightbox (foto al primer plano) ---------- */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightbox-img");
  const lightboxCaption = $("#lightbox-caption");
  const lightboxClose = $("#lightbox-close");
  let lastFocus = null;

  const openLightbox = (item) => {
    const img = $("img", item);
    lastFocus = item;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightbox.hidden = true;
      lightboxImg.src = "";
    }, reducedMotion ? 0 : 320);
    if (lastFocus) lastFocus.focus();
  };

  $$(".gallery-item").forEach((item) => {
    item.tabIndex = 0;
    item.addEventListener("click", () => openLightbox(item));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* ---------- Horarios: abierto / cerrado (hora de Santiago) ---------- */
  // 0 = domingo ... 6 = sábado
  const HOURS = {
    0: { open: 11 * 60, close: 17 * 60 },   // domingo
    1: { open: 10 * 60, close: 20 * 60 },   // lunes
    2: { open: 10 * 60, close: 20 * 60 },
    3: { open: 10 * 60, close: 20 * 60 },
    4: { open: 10 * 60, close: 20 * 60 },
    5: { open: 10 * 60, close: 20 * 60 },
    6: { open: 10 * 60, close: 20 * 60 },   // sábado
  };
  const fmtTime = (min) =>
    `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

  const updateHours = () => {
    const status = $("#hours-status");
    const text = $(".hours-status-text", status);
    if (!status || !text) return;

    let day, minutes;
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Santiago",
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t)?.value;
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      day = days.indexOf(get("weekday"));
      const h = parseInt(get("hour"), 10) % 24;
      minutes = h * 60 + parseInt(get("minute"), 10);
    } catch {
      text.textContent = "Horario no disponible";
      return;
    }
    if (day === -1) return;

    const today = HOURS[day];
    const isOpen = minutes >= today.open && minutes < today.close;

    status.classList.toggle("is-open", isOpen);
    status.classList.toggle("is-closed", !isOpen);

    if (isOpen) {
      text.textContent = `Abierto ahora · Cierra ${fmtTime(today.close)}`;
    } else {
      // próximo horario: hoy si aún no abre, mañana si ya cerró
      if (minutes < today.open) {
        text.textContent = `Cerrado · Abre hoy ${fmtTime(today.open)}`;
      } else {
        const tomorrow = HOURS[(day + 1) % 7];
        text.textContent = `Cerrado · Abre mañana ${fmtTime(tomorrow.open)}`;
      }
    }
  };
  updateHours();
  setInterval(updateHours, 60_000);

  /* ---------- Cursor personalizado (solo pointer fino) ---------- */
  const cursor = $("#cursor");
  if (cursor && finePointer && !reducedMotion) {
    let cx = -100, cy = -100, tx = -100, ty = -100, visible = false;

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        cx = tx;
        cy = ty;
        cursor.classList.add("is-active");
      }
    }, { passive: true });
    document.addEventListener("mouseleave", () => {
      visible = false;
      cursor.classList.remove("is-active");
    });

    const hoverables = "a, button, .gallery-item, .manifesto-word, .service-row";
    document.addEventListener("mouseover", (e) => {
      cursor.classList.toggle("is-hover", !!e.target.closest(hoverables));
    });

    const loop = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Año del footer ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
