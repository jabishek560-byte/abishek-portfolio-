const headerOffset = 84;

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  if (!toggle || !nav) return;

  const setExpanded = (expanded) => {
    toggle.setAttribute("aria-expanded", String(expanded));
    document.body.classList.toggle("nav-open", expanded);
  };

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!expanded);
  });

  // Close menu when clicking a link (mobile)
  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest("a")) setExpanded(false);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setExpanded(false);
  });
}

function setupSmoothScroll() {
  const links = Array.from(document.querySelectorAll('a[href^="#"]'));

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      const y =
        el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Keep URL updated without jumping
      history.pushState(null, "", href);
    });
  });
}

function setupScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sectionIds = navLinks
    .map((l) => l.getAttribute("href"))
    .filter(Boolean)
    .map((href) => href.slice(1));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const setActive = (id) => {
    navLinks.forEach((l) => {
      const href = l.getAttribute("href") || "";
      l.classList.toggle("is-active", href === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (!visible) return;
      if (!(visible.target instanceof HTMLElement)) return;
      setActive(visible.target.id);
    },
    {
      root: null,
      // Trigger a bit earlier (accounts for sticky header)
      rootMargin: `-${headerOffset}px 0px -60% 0px`,
      threshold: [0.1, 0.2, 0.35, 0.5, 0.65, 0.8],
    }
  );

  sections.forEach((s) => observer.observe(s));
}

function setupRevealOnScroll() {
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!(entry.target instanceof HTMLElement)) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15,
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

setYear();
setupMobileNav();
setupSmoothScroll();
setupScrollSpy();
setupRevealOnScroll();


