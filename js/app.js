/* ============================================================================
   PORTFOLIO — LOGIQUE APPLICATIVE (Vanilla JS ES6+)
   ----------------------------------------------------------------------------
   Organisation modulaire : chaque fonctionnalité = une fonction init*().
   Les données personnelles viennent de data.js (portfolioData).
   ============================================================================ */
"use strict";

/* --------------------------------- UTILS ---------------------------------- */
const $  = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

/** Throttle via requestAnimationFrame — idéal pour le scroll. */
function rafThrottle(callback) {
  let ticking = false;
  return (...args) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { callback(...args); ticking = false; });
  };
}

/** Debounce classique. */
function debounce(callback, delay = 200) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

/* ============================== 1. NAVIGATION ============================= */
function initNavigation() {
  const navbar = $("#navbar");
  const navLinks = $$(".navbar-custom .nav-link[href^='#']");
  const navbarCollapse = $("#navbarNav");
  if (!navbar) return;

  // État "scrolled" de la navbar
  const updateNavbarState = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", rafThrottle(updateNavbarState), { passive: true });
  updateNavbarState();

  // Fermer le menu mobile après un clic sur un lien
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse && navbarCollapse.classList.contains("show") && window.bootstrap) {
        const collapse = window.bootstrap.Collapse.getInstance(navbarCollapse)
          || new window.bootstrap.Collapse(navbarCollapse);
        collapse.hide();
      }
    });
  });

  // Lien actif selon la section visible (scroll-spy maison, léger)
  const sections = navLinks
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.toggle("active",
            l.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  // Année du footer
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ==================== 2. MOTEUR DE PARTICULES (HERO) =======================
   Réseau numérique interactif "maison" (canvas 2D, zéro dépendance) :
   particules + connexions + grab souris + répulsion douce + clic + vitesse.
   -------------------------------------------------------------------------- */
function initParticles() {
  const canvas = $("#particles-canvas");
  const hero = $("#accueil");
  if (!canvas || !hero || typeof particleConfig === "undefined") return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = prefersReducedMotion();
  const touch = isTouchDevice();
  const mouseCfg = (typeof mouseInteraction !== "undefined") ? mouseInteraction : { enabled: false };

  let particles = [];
  let tempParticles = [];      // particules générées au clic (éphémères)
  let ripples = [];            // ondes de propagation au clic
  let cfg = particleConfig.desktop;
  let heroVisible = true;
  let rafId = null;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // État du curseur (+ vitesse pour la perturbation dynamique)
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, speed: 0, active: false, lastX: -9999, lastY: -9999 };

  // Couleurs lues depuis les variables CSS (suit le thème dark/light)
  function getColors() {
    const styles = getComputedStyle(document.documentElement);
    const dark = document.documentElement.getAttribute("data-theme") !== "light";
    return {
      particle: dark ? "235, 240, 255" : "30, 64, 175",
      line: dark ? "139, 146, 255" : "37, 99, 235",
      glow: styles.getPropertyValue("--color-accent").trim() || "#38BDF8"
    };
  }
  let colors = getColors();

  // Profil actif selon la largeur d'écran
  function activeProfile() {
    const w = window.innerWidth;
    if (w < particleConfig.breakpoints.mobile) return particleConfig.mobile;
    if (w < particleConfig.breakpoints.tablet) return particleConfig.tablet;
    return particleConfig.desktop;
  }

  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function randomVelocity(baseSpeed) {
    const angle = Math.random() * Math.PI * 2;
    const magnitude = baseSpeed * (0.4 + Math.random() * 0.9);
    return { vx: Math.cos(angle) * magnitude, vy: Math.sin(angle) * magnitude };
  }

  function createParticle(temporary = false, x = null, y = null) {
    const rect = hero.getBoundingClientRect();
    const v = randomVelocity(cfg.speed * (temporary ? 2.2 : 1));
    // Tailles variées : petites (majorité), moyennes, quelques grandes
    const roll = Math.random();
    const sizeFactor = roll > 0.93 ? 2.1 : roll > 0.7 ? 1.4 : 0.7 + Math.random() * 0.6;
    return {
      x: x !== null ? x : Math.random() * rect.width,
      y: y !== null ? y : Math.random() * rect.height,
      vx: v.vx, vy: v.vy,
      baseVx: v.vx, baseVy: v.vy,
      size: cfg.particleSize * sizeFactor,
      opacity: cfg.opacity * (0.45 + Math.random() * 0.55),
      temp: temporary,
      life: temporary ? 1 : Infinity
    };
  }

  function buildParticles() {
    cfg = activeProfile();
    particles = Array.from({ length: cfg.count }, () => createParticle(false));
    tempParticles = [];
  }

  /* ------------------------- Interactions souris ------------------------ */
  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (mouse.lastX > -9999) {
      mouse.vx = x - mouse.lastX;
      mouse.vy = y - mouse.lastY;
      // Lissage de la vitesse (évite les à-coups)
      mouse.speed += (Math.hypot(mouse.vx, mouse.vy) - mouse.speed) * 0.15;
    }
    mouse.x = x; mouse.y = y;
    mouse.lastX = x; mouse.lastY = y;
    mouse.active = true;
  }
  function onMouseLeave() {
    mouse.x = -9999; mouse.y = -9999;
    mouse.lastX = -9999; mouse.lastY = -9999;
    mouse.speed = 0; mouse.active = false;
  }
  function onClick(e) {
    if (reducedMotion) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Onde de propagation subtile
    ripples.push({ x, y, radius: 6, alpha: 0.5 });
    // Quelques particules éphémères
    const n = mouseCfg.clickParticles || 4;
    for (let i = 0; i < n; i++) tempParticles.push(createParticle(true, x, y));
    // Petite impulsion radiale sur les particules proches (jamais violente)
    particles.forEach((p) => {
      const dx = p.x - x, dy = p.y - y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < mouseCfg.radius) {
        const force = (1 - dist / mouseCfg.radius) * 1.4;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
  }

  const mouseEnabled = mouseCfg.enabled && !touch;
  if (mouseEnabled) {
    hero.addEventListener("mousemove", onMouseMove, { passive: true });
    hero.addEventListener("mouseleave", onMouseLeave);
  }
  hero.addEventListener("click", onClick);

  /* ------------------------------ Rendu --------------------------------- */
  function stepParticle(p, width, height) {
    // Retour progressif vers la vélocité de base (le réseau "se recompose")
    p.vx += (p.baseVx - p.vx) * 0.015;
    p.vy += (p.baseVy - p.vy) * 0.015;

    // Interaction curseur : répulsion douce + micro-attraction orbitale
    if (mouseEnabled && mouse.active) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy) || 1;

      if (dist < mouseCfg.repulseDistance) {
        // Répulsion douce, amplifiée légèrement par la vitesse du curseur
        const velocityFactor = 1 + Math.min(mouse.speed / 40, 1) * (mouseCfg.velocityBoost || 0);
        const force = (1 - dist / mouseCfg.repulseDistance)
          * (mouseCfg.repulsionStrength || 0.3) * velocityFactor;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      } else if (dist < mouseCfg.radius) {
        // Attraction subtile vers le curseur (effet "grab" physique)
        const force = (1 - dist / mouseCfg.radius) * (mouseCfg.attractionStrength || 0.1);
        p.vx -= (dx / dist) * force * 0.4;
        p.vy -= (dy / dist) * force * 0.4;
      }
    }

    p.x += p.vx;
    p.y += p.vy;

    // Rebond élégant sur les bords
    if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); p.baseVx = Math.abs(p.baseVx); }
    if (p.x > width) { p.x = width; p.vx = -Math.abs(p.vx); p.baseVx = -Math.abs(p.baseVx); }
    if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); p.baseVy = Math.abs(p.baseVy); }
    if (p.y > height) { p.y = height; p.vy = -Math.abs(p.vy); p.baseVy = -Math.abs(p.baseVy); }

    if (p.temp) p.life -= 0.008; // les particules de clic s'estompent
  }

  function drawLinks(pool, linkDistance) {
    for (let i = 0; i < pool.length; i++) {
      for (let j = i + 1; j < pool.length; j++) {
        const a = pool[i], b = pool[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > linkDistance || Math.abs(dy) > linkDistance) continue;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDistance) {
          const alpha = (1 - dist / linkDistance) * 0.55;
          ctx.strokeStyle = `rgba(${colors.line},${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawGrabLinks() {
    if (!mouseEnabled || !mouse.active || reducedMotion) return;
    const grab = mouseCfg.grabDistance || mouseCfg.radius;
    particles.forEach((p) => {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      if (Math.abs(dx) > grab || Math.abs(dy) > grab) return;
      const dist = Math.hypot(dx, dy);
      if (dist < grab) {
        const alpha = (1 - dist / grab) * 0.8;
        ctx.strokeStyle = `rgba(${colors.line},${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    });
  }

  function drawParticles(pool) {
    pool.forEach((p) => {
      const alpha = p.temp ? p.opacity * Math.max(p.life, 0) : p.opacity;
      // Halo lumineux discret sur les plus grosses particules
      if (p.size > cfg.particleSize * 1.6) {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(${colors.particle},${(alpha * 0.5).toFixed(3)})`);
        gradient.addColorStop(1, `rgba(${colors.particle},0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(${colors.particle},${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawRipples() {
    ripples = ripples.filter((r) => r.alpha > 0.02);
    ripples.forEach((r) => {
      ctx.strokeStyle = `rgba(${colors.line},${r.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.stroke();
      r.radius += 2.2;
      r.alpha *= 0.94;
    });
  }

  function frame() {
    const rect = hero.getBoundingClientRect();
    const width = rect.width, height = rect.height;
    ctx.clearRect(0, 0, width, height);

    tempParticles = tempParticles.filter((p) => p.life > 0);
    const pool = particles.concat(tempParticles);

    pool.forEach((p) => stepParticle(p, width, height));
    // Décroissance naturelle de la vitesse mesurée du curseur
    mouse.speed *= 0.94;

    drawLinks(pool, cfg.linkDistance);
    drawGrabLinks();
    drawRipples();
    drawParticles(pool);

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId === null && heroVisible && !reducedMotion) rafId = requestAnimationFrame(frame);
  }
  function stop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // Pause intelligente : le hero n'est plus visible → on stoppe la boucle
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) start(); else stop();
    }, { threshold: 0.02 }).observe(hero);
  }

  // Redimensionnement : reconstruit le réseau (debounced)
  window.addEventListener("resize", debounce(() => {
    resizeCanvas();
    buildParticles();
    colors = getColors();
    if (reducedMotion) renderStaticFrame();
  }, 250));

  // Le changement de thème met à jour les couleurs des particules
  document.addEventListener("themechange", () => { colors = getColors(); });

  // Rendu statique unique si l'utilisateur préfère réduire les animations
  function renderStaticFrame() {
    const rect = hero.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawLinks(particles, cfg.linkDistance);
    drawParticles(particles);
  }

  // Initialisation
  resizeCanvas();
  buildParticles();
  if (reducedMotion || !heroVisible) {
    renderStaticFrame();
    if (!reducedMotion) start();
  } else {
    start();
  }
}

/* ============================ 3. THÈME DARK/LIGHT ========================= */
function initTheme() {
  const toggle = $("#theme-toggle");
  const root = document.documentElement;
  const STORAGE_KEY = "portfolio-theme";

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* stockage indisponible */ }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", theme === "light" ? "#f3f7ff" : "#080b18");
    if (toggle) {
      const icon = $("i", toggle);
      if (icon) icon.className = theme === "light" ? "bi bi-moon-stars" : "bi bi-sun";
      toggle.setAttribute("aria-label", theme === "light" ? "Activer le mode sombre" : "Activer le mode clair");
    }
    document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  };

  let saved = "dark";
  try { saved = localStorage.getItem(STORAGE_KEY) || "dark"; } catch (e) { /* ignore */ }
  applyTheme(saved === "light" ? "light" : "dark");

  if (toggle) {
    toggle.addEventListener("click", () => {
      applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }
}

/* ====================== 4. ANIMATIONS D'APPARITION ======================== */
function initAnimations() {
  // Délais en cascade pour l'entrée du hero
  $$(".hero-anim").forEach((el, index) => {
    el.style.animationDelay = `${0.1 + index * 0.12}s`;
  });

  // Révélation des sections au scroll
  const revealEls = $$(".reveal");
  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    revealEls.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // une seule fois → performance
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => observer.observe(el));
}

/* ==================== 5. ROTATEUR DE TITRES (HERO) ======================== */
function initRoleRotator() {
  const el = $("#role-rotator");
  if (!el || typeof portfolioData === "undefined" || prefersReducedMotion()) return;
  const roles = portfolioData.roles || [];
  if (roles.length < 2) return;
  let index = 0;
  setInterval(() => {
    el.classList.add("swap");
    setTimeout(() => {
      index = (index + 1) % roles.length;
      el.textContent = roles[index];
      el.classList.remove("swap");
    }, 350);
  }, 3200);
}

/* ============================ 6. COMPTEURS ================================ */
function initCounters() {
  const counters = $$("[data-count]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Easing "easeOutExpo" : rapide au début, doux à la fin
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
    counters.forEach((el) => { el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || ""); });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // une seule exécution
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => observer.observe(el));
}

/* ====================== 7. COMPÉTENCES + BARRES =========================== */
function initSkills() {
  const container = $("#skills-container");
  if (!container || typeof portfolioData === "undefined") return;

  container.innerHTML = portfolioData.skills.map((cat, i) => `
    <div class="col-md-6 col-xl-4 reveal" style="--reveal-delay:${(i % 3) * 0.1}s">
      <div class="skill-category-card">
        <h3 class="skill-category-title"><i class="bi ${cat.icon}" aria-hidden="true"></i>${cat.category}</h3>
        ${cat.items.map((skill) => `
          <div class="skill-row">
            <div class="skill-top">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-percent" data-skill-percent="${skill.level}">0%</span>
            </div>
            <div class="skill-bar" role="progressbar" aria-valuenow="${skill.level}"
                 aria-valuemin="0" aria-valuemax="100" aria-label="${skill.name}">
              <div class="skill-fill" data-skill-level="${skill.level}"></div>
            </div>
          </div>`).join("")}
      </div>
    </div>`).join("");

  // Révélation + remplissage des barres quand la section est visible
  const fills = $$(".skill-fill", container);
  const percents = $$("[data-skill-percent]", container);

  const animateSkills = () => {
    fills.forEach((fill) => { fill.style.width = `${fill.getAttribute("data-skill-level")}%`; });
    percents.forEach((el) => {
      const target = parseInt(el.getAttribute("data-skill-percent"), 10);
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1200, 1);
        el.textContent = `${Math.round((1 - Math.pow(2, -10 * p)) * target)}%`;
        if (p < 1) requestAnimationFrame(tick);
      };
      if (prefersReducedMotion()) el.textContent = `${target}%`;
      else requestAnimationFrame(tick);
    });
  };

  // Les cartes générées dynamiquement doivent aussi être observées pour .reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const skillsSection = $("#competences");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkills();
        sectionObserver.disconnect(); // une seule fois
      }
    });
  }, { threshold: 0.15 });

  $$(".reveal", container).forEach((el) => revealObserver.observe(el));
  if (skillsSection) sectionObserver.observe(skillsSection);
}

/* ====================== 8. TIMELINE EXPÉRIENCE ============================ */
function initExperience() {
  const timeline = $("#timeline");
  if (!timeline || typeof portfolioData === "undefined") return;

  timeline.innerHTML = `<div class="timeline-progress" id="timeline-progress"></div>` +
    portfolioData.experiences.map((exp) => `
      <article class="timeline-item reveal">
        <span class="timeline-dot" aria-hidden="true"></span>
        <div class="timeline-card">
          <span class="timeline-period">${exp.period}</span>
          <h3 class="timeline-role">${exp.role}</h3>
          <p class="timeline-company">${exp.company}</p>
          <p class="timeline-desc">${exp.description}</p>
          <ul class="timeline-achievements">
            ${exp.achievements.map((a) => `<li>${a}</li>`).join("")}
          </ul>
          <div class="tech-pills">
            ${exp.technologies.map((t) => `<span class="tech-pill">${t}</span>`).join("")}
          </div>
        </div>
      </article>`).join("");

  // Révélation des items
  const items = $$(".timeline-item", timeline);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible", "visible-timeline");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  if (prefersReducedMotion()) items.forEach((i) => i.classList.add("visible", "visible-timeline"));
  else items.forEach((i) => observer.observe(i));

  // Progression de la ligne verticale au scroll
  const progress = $("#timeline-progress");
  const section = $("#experience");
  if (!progress || !section || prefersReducedMotion()) {
    if (progress) progress.style.height = "100%";
    return;
  }
  const updateProgress = () => {
    const rect = section.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.6;
    const total = rect.height;
    const passed = Math.min(Math.max(viewportCenter - rect.top, 0), total);
    progress.style.height = `${(passed / total) * 100}%`;
  };
  window.addEventListener("scroll", rafThrottle(updateProgress), { passive: true });
  updateProgress();
}

/* ================== 9. PROJETS + FILTRES + MODAL ========================== */
function initProjects() {
  const grid = $("#projects-grid");
  const filterBar = $("#project-filters");
  if (!grid || !filterBar || typeof portfolioData === "undefined") return;
  const projects = portfolioData.projects || [];

  // Boutons de filtre
  filterBar.innerHTML = portfolioData.projectCategories.map((cat, i) => `
    <button type="button" class="filter-btn${i === 0 ? " active" : ""}"
            data-filter="${cat}" aria-pressed="${i === 0}">${cat}</button>`).join("");

  // Cartes projets
  grid.innerHTML = projects.map((p, i) => `
    <div class="col-md-6 col-xl-4 reveal" style="--reveal-delay:${(i % 3) * 0.1}s" data-category="${p.category}">
      <article class="project-card" data-project-index="${i}" tabindex="0" role="button"
               aria-label="Voir le détail du projet ${p.title}">
        <div class="project-cover${p.video ? " has-video" : ""}" style="background:${p.gradient}">
          <span class="project-category">${p.category}</span>
          ${p.video ? `<video class="project-video" data-src="${p.video}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video><span class="video-play-hint" aria-hidden="true"><i class="bi bi-play-fill"></i></span>` : ""}
          <i class="bi ${p.icon} project-fallback-icon" aria-hidden="true"></i>
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <p class="project-result"><i class="bi bi-graph-up-arrow" aria-hidden="true"></i> ${p.result}</p>
          <div class="project-footer">
            <div class="tech-pills">${p.technologies.slice(0, 3).map((t) => `<span class="tech-pill">${t}</span>`).join("")}</div>
            <div class="project-links">
              <a href="${p.github}" target="_blank" rel="noopener" class="project-link-btn"
                 aria-label="Code source de ${p.title}" data-stop-modal><i class="bi bi-github"></i></a>
              <a href="${p.demo}" target="_blank" rel="noopener" class="project-link-btn"
                 aria-label="Démo de ${p.title}" data-stop-modal><i class="bi bi-box-arrow-up-right"></i></a>
            </div>
          </div>
        </div>
      </article>
    </div>`).join("");

  // Révélation des cartes
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  $$(".reveal", grid).forEach((el) => revealObserver.observe(el));

  // Apercus video au survol des cartes (style Netflix)
  setupVideoPreviews(grid);

  // Filtrage dynamique (fade/scale, sans rechargement)
  $$(".filter-btn", filterBar).forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".filter-btn", filterBar).forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      const filter = btn.getAttribute("data-filter");
      $$("[data-category]", grid).forEach((col) => {
        const match = filter === "Tous" || col.getAttribute("data-category") === filter;
        const card = $(".project-card", col);
        if (match) {
          col.classList.remove("d-none");
          requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove("filter-hide")));
        } else {
          card.classList.add("filter-hide");
          setTimeout(() => col.classList.add("d-none"), 280);
        }
      });
    });
  });

  // Modal dynamique (une seule modal Bootstrap, contenu injecté)
  const modalEl = $("#project-modal");
  if (modalEl && window.bootstrap) {
    const modal = new window.bootstrap.Modal(modalEl);
    const openProject = (index) => {
      const p = projects[index];
      if (!p) return;
      $("#modal-cover").style.background = p.gradient;
      $("#modal-cover-icon").className = `bi ${p.icon}`;
      $("#project-modal-label").textContent = p.title;
      $("#modal-category").textContent = p.category;
      $("#modal-description").textContent = p.description;
      $("#modal-problem").textContent = p.problem;
      $("#modal-solution").textContent = p.solution;
      $("#modal-architecture").textContent = p.architecture;
      $("#modal-features").innerHTML = p.features.map((f) => `<li>${f}</li>`).join("");
      $("#modal-tech").innerHTML = p.technologies.map((t) => `<span class="tech-pill">${t}</span>`).join("");
      $("#modal-result").textContent = p.result;
      $("#modal-github").href = p.github;
      $("#modal-demo").href = p.demo;
      setupModalVideo(p);
      pauseAllPreviews();
      modal.show();
    };
    grid.addEventListener("click", (e) => {
      if (e.target.closest("[data-stop-modal]")) return; // les liens directs n'ouvrent pas la modal
      const card = e.target.closest("[data-project-index]");
      if (card) openProject(parseInt(card.getAttribute("data-project-index"), 10));
    });
    grid.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-project-index]")) {
        e.preventDefault();
        openProject(parseInt(e.target.getAttribute("data-project-index"), 10));
      }
    });
  }
}

/* ================== 10. SERVICES / TECH / CERTIFS / GITHUB ================ */
function initServices() {
  const container = $("#services-container");
  if (!container || typeof portfolioData === "undefined") return;
  container.innerHTML = portfolioData.services.map((s, i) => `
    <div class="col-md-6 col-lg-4 reveal" style="--reveal-delay:${(i % 3) * 0.1}s">
      <div class="service-card">
        <span class="service-icon"><i class="bi ${s.icon}" aria-hidden="true"></i></span>
        <h3 class="service-title">${s.title}</h3>
        <p>${s.description}</p>
      </div>
    </div>`).join("");
  observeReveal(container);
}

function initTechStack() {
  const container = $("#tech-grid");
  if (!container || typeof portfolioData === "undefined") return;
  container.innerHTML = portfolioData.techStack.map((t, i) => `
    <div class="tech-item reveal" style="--reveal-delay:${(i % 5) * 0.07}s">
      <i class="bi ${t.icon}" aria-hidden="true"></i>
      <span class="tech-name">${t.name}</span>
    </div>`).join("");
  observeReveal(container);
}

function initCertifications() {
  const container = $("#certifications-container");
  if (!container || typeof portfolioData === "undefined") return;
  container.innerHTML = portfolioData.certifications.map((c, i) => `
    <div class="col-md-6 reveal" style="--reveal-delay:${(i % 2) * 0.1}s">
      <div class="cert-card">
        <span class="cert-icon"><i class="bi ${c.icon}" aria-hidden="true"></i></span>
        <div>
          <h3 class="cert-title">${c.title}</h3>
          <p class="cert-issuer">${c.issuer}</p>
          <span class="cert-year">${c.year}</span>
        </div>
      </div>
    </div>`).join("");
  observeReveal(container);
}

function initGithub() {
  if (typeof portfolioData === "undefined") return;
  const gh = portfolioData.github;
  if (!gh) return;

  const statsEl = $("#github-stats");
  if (statsEl) {
    statsEl.innerHTML = gh.stats.map((s) => `
      <div class="col-6 col-md-3">
        <div class="github-stat">
          <div class="github-stat-value">${s.value}</div>
          <div class="github-stat-label">${s.label}</div>
        </div>
      </div>`).join("");
  }
  const langsEl = $("#github-languages");
  if (langsEl) {
    langsEl.innerHTML = gh.languages.map((l) => `
      <div class="lang-row">
        <span class="lang-name">${l.name}</span>
        <div class="lang-bar"><div class="lang-fill" data-lang-level="${l.percent}" style="background:${l.color}"></div></div>
        <span class="lang-percent">${l.percent}%</span>
      </div>`).join("");
    // Animation des barres de langages à la visibilité
    const section = $("#github");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $$(".lang-fill", langsEl).forEach((f) => { f.style.width = `${f.getAttribute("data-lang-level")}%`; });
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    if (section) obs.observe(section);
  }
  const reposEl = $("#github-repos");
  if (reposEl) {
    reposEl.innerHTML = gh.pinned.map((r) => `
      <div class="repo-card">
        <div class="repo-name"><i class="bi bi-journal-code" aria-hidden="true"></i>${r.name}</div>
        <p class="repo-desc">${r.description}</p>
        <div class="repo-meta">
          <span><i class="bi bi-circle-fill" style="font-size:.6rem" aria-hidden="true"></i> ${r.language}</span>
          <span><i class="bi bi-star" aria-hidden="true"></i> ${r.stars}</span>
        </div>
      </div>`).join("");
  }
  const linkEl = $("#github-profile-link");
  if (linkEl) linkEl.href = gh.profileUrl;
}

/** Observe les éléments .reveal ajoutés dynamiquement dans un conteneur. */
function observeReveal(container) {
  const els = $$(".reveal", container);
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => observer.observe(el));
}

/* ========================= 11. TÉMOIGNAGES ================================ */
function initTestimonials() {
  const wrap = $("#testimonial-slides");
  const dotsWrap = $("#testimonial-dots");
  if (!wrap || !dotsWrap || typeof portfolioData === "undefined") return;
  const items = portfolioData.testimonials || [];
  if (!items.length) return;

  wrap.innerHTML = items.map((t, i) => `
    <figure class="testimonial-slide${i === 0 ? " active" : ""}" ${i === 0 ? "" : "aria-hidden='true'"}>
      <i class="bi bi-quote quote-icon" aria-hidden="true"></i>
      <blockquote class="testimonial-text">« ${t.text} »</blockquote>
      <figcaption><div class="testimonial-author">${t.author}</div>
      <div class="testimonial-context">${t.context}</div></figcaption>
    </figure>`).join("");
  dotsWrap.innerHTML = items.map((_, i) => `
    <button type="button" class="testimonial-dot${i === 0 ? " active" : ""}"
            data-slide="${i}" aria-label="Témoignage ${i + 1}"></button>`).join("");

  const slides = $$(".testimonial-slide", wrap);
  const dots = $$(".testimonial-dot", dotsWrap);
  let index = 0;
  let timer = null;

  const goTo = (i) => {
    index = (i + items.length) % items.length;
    slides.forEach((s, k) => {
      s.classList.toggle("active", k === index);
      if (k === index) s.removeAttribute("aria-hidden");
      else s.setAttribute("aria-hidden", "true");
    });
    dots.forEach((d, k) => d.classList.toggle("active", k === index));
  };
  const restart = () => {
    clearInterval(timer);
    if (!prefersReducedMotion()) timer = setInterval(() => goTo(index + 1), 5500);
  };
  dots.forEach((d) => d.addEventListener("click", () => {
    goTo(parseInt(d.getAttribute("data-slide"), 10));
    restart();
  }));
  restart();
}

/* ========================= 12. FORMULAIRE CONTACT ========================= */
function initContactForm() {
  const form = $("#contact-form");
  if (!form) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateField = (field) => {
    const value = field.value.trim();
    let valid = value.length > 0;
    if (field.type === "email") valid = emailPattern.test(value);
    if (field.id === "contact-message") valid = value.length >= 10;
    field.classList.toggle("is-valid", valid);
    field.classList.toggle("is-invalid", !valid);
    return valid;
  };

  // Validation en direct (blur + input après erreur)
  $$("input, textarea", form).forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = $$("input, textarea", form);
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) {
      const firstInvalid = $(".is-invalid", form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = $("#contact-submit");
    const alertBox = $("#form-alert");
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true"></span> Envoi en cours…`;
    alertBox.className = "d-none";

    /* ------------------------------------------------------------------
       1) Formspree : remplacez FORM_ID puis POSTez vers
                      https://formspree.io/f/FORM_ID
       2) EmailJS   : emailjs.send("SERVICE_ID", "TEMPLATE_ID", {...})
       ------------------------------------------------------------------ */
    const payload = {
      name: $("#contact-name").value.trim(),
      email: $("#contact-email").value.trim(),
      subject: $("#contact-subject").value.trim(),
      message: $("#contact-message").value.trim()
    };

    // Simulation d'envoi (pas de backend) — remplacez ce bloc par un fetch réel.
    new Promise((resolve) => setTimeout(resolve, 1400))
      .then(() => {
        console.info("[Contact] Message prêt à être envoyé :", payload);
        alertBox.className = "alert alert-warning form-alert";
        alertBox.setAttribute("role", "status");
        alertBox.innerHTML = `<i class="bi bi-check-circle-fill me-2" aria-hidden="true"></i>
          Message non envoyé !`;
        form.reset();
        fields.forEach((f) => f.classList.remove("is-valid", "is-invalid"));
      })
      .catch(() => {
        alertBox.className = "alert alert-danger form-alert";
        alertBox.setAttribute("role", "alert");
        alertBox.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
          Une erreur est survenue. Veuillez réessayer ou me contacter directement par e-mail.`;
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
      });
  });
}

/* ================== 13. SCROLL PROGRESS + BACK TO TOP ===================== */
function initScrollProgress() {
  const bar = $("#scroll-progress");
  if (!bar) return;
  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = scrollable > 0 ? `${(window.scrollY / scrollable) * 100}%` : "0%";
  };
  window.addEventListener("scroll", rafThrottle(update), { passive: true });
  update();
}

function initBackToTop() {
  const btn = $("#back-to-top");
  if (!btn) return;
  const update = () => btn.classList.toggle("show", window.scrollY > 600);
  window.addEventListener("scroll", rafThrottle(update), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" }));
  update();
}

/* ============ 14. SYNCHRONISATION DES INFOS PERSONNELLES ==================
   Remplit les zones marquées data-personal="..." depuis portfolioData,
   pour que tout se modifie dans data.js uniquement.                           */
function initPersonalData() {
  if (typeof portfolioData === "undefined") return;
  const p = portfolioData.personal;
  $$("[data-personal]").forEach((el) => {
    const key = el.getAttribute("data-personal");
    if (p[key] === undefined) return;
    // Les liens "icone seule" gardent leur icone : on ne remplace le texte
    // que pour les elements sans icone (libelles textuels).
    const hasIcon = el.querySelector("i, svg, img") !== null;
    if (key === "email") {
      if (!hasIcon) el.textContent = p.email;
      if (el.tagName === "A") el.href = `mailto:${p.email}`;
    } else if (key === "phone" || key === "phone2") {
      if (!hasIcon) el.textContent = p[key];
      if (el.tagName === "A") el.href = `tel:${p[key].replace(/[^+\d]/g, "")}`;
    } else if (key === "github" || key === "linkedin" || key === "whatsapp") {
      if (el.tagName === "A") el.href = p[key];
      else el.textContent = p[key];
    } else if (key === "cv") {
      if (el.tagName === "A") el.href = p.cv;
    } else {
      el.textContent = p[key];
    }
  });
  const rotator = $("#role-rotator");
  if (rotator && portfolioData.roles && portfolioData.roles.length) {
    rotator.textContent = portfolioData.roles[0];
  }
}

/* ================== 15. VIDEOS PROJETS (STYLE NETFLIX) =====================
   - Apercu muet au survol des cartes (desktop uniquement).
   - Lecteur personnalise dans la modal : play/pause, +/-10 s, progression,
     volume, plein ecran, raccourcis clavier.
   -------------------------------------------------------------------------- */

/** Coupe tous les apercus des cartes (ex. a l'ouverture de la modal). */
function pauseAllPreviews() {
  $$(".project-video").forEach((video) => {
    try { if (!video.paused) video.pause(); } catch (e) { /* ignore */ }
    const cover = video.closest(".project-cover");
    if (cover) cover.classList.remove("playing");
  });
}

/** Apercus video au survol — promesses de lecture securisees (zero bug). */
function setupVideoPreviews(grid) {
  const canHoverPreview = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = prefersReducedMotion();

  $$(".project-card", grid).forEach((card) => {
    const video = $(".project-video", card);
    if (!video) return;
    const cover = $(".project-cover", card);
    let playPromise = null;

    // La video ne s'affiche que lorsqu'elle peut reellement jouer.
    video.addEventListener("canplay", () => video.classList.add("ready"));
    // Fichier manquant / illisible -> couverture classique, sans erreur visible.
    video.addEventListener("error", () => {
      video.remove();
      if (cover) cover.classList.remove("has-video", "playing");
    });

    if (!canHoverPreview || reduceMotion) return; // tactile : lecture dans la modal

    card.addEventListener("mouseenter", () => {
      if (!video.isConnected) return;
      if (!video.getAttribute("src")) video.setAttribute("src", video.getAttribute("data-src"));
      video.muted = true;
      try {
        playPromise = video.play();
        if (playPromise) playPromise.catch(() => { /* autoplay refuse : apercu ignore */ });
      } catch (e) { /* ignore */ }
      if (cover) cover.classList.add("playing");
    });
    card.addEventListener("mouseleave", () => {
      if (cover) cover.classList.remove("playing");
      const stop = () => {
        if (!video.isConnected) return;
        try {
          video.pause();
          video.currentTime = 0;
        } catch (e) { /* ignore */ }
      };
      // Attendre la fin du play() avant pause() (evite les erreurs console).
      if (playPromise) playPromise.then(stop).catch(stop);
      else stop();
    });
  });

  // Securite : si la grille quitte l'ecran, on coupe les apercus.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) pauseAllPreviews();
    }).observe(grid);
  }
}

/** Formate un temps en m:ss. */
function formatVideoTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ":" + s.toString().padStart(2, "0");
}

/** Charge la video du projet dans le lecteur de la modal (ou masque le lecteur). */
function setupModalVideo(project) {
  const player = $("#modal-player");
  const cover = $("#modal-cover");
  const video = $("#modal-video");
  if (!player || !video) return;

  stopModalPlayback(); // reset complet avant chaque ouverture

  if (project && project.video) {
    if (cover) cover.classList.add("d-none");
    player.classList.remove("d-none");
    const errBox = $("#np-error");
    if (errBox) errBox.classList.add("d-none");
    if (video.getAttribute("src") !== project.video) {
      video.setAttribute("src", project.video);
      video.load();
    }
    // Lecture auto avec son (autorisee : l'ouverture suit un clic).
    video.muted = false;
    updateModalPlayUI();
    try {
      const attempt = video.play();
      if (attempt) attempt.catch(() => updateModalPlayUI()); // sinon : gros bouton play
    } catch (e) { updateModalPlayUI(); }
  } else {
    player.classList.add("d-none");
    if (cover) cover.classList.remove("d-none");
  }
}

/** Met a jour les icones play/pause du lecteur modal. */
function updateModalPlayUI() {
  const video = $("#modal-video");
  const playIcon = $("#np-play i");
  const center = $("#np-center");
  if (!video || !playIcon) return;
  const playing = !video.paused && !video.ended;
  playIcon.className = playing ? "bi bi-pause-fill" : "bi bi-play-fill";
  if (center) center.classList.toggle("d-none", playing);
}

/** Bascule lecture / pause + animation eclair. */
function toggleModalPlayback() {
  const video = $("#modal-video");
  if (!video || !video.getAttribute("src")) return;
  const willPlay = video.paused || video.ended;
  if (willPlay) {
    try {
      const attempt = video.play();
      if (attempt) attempt.catch(() => updateModalPlayUI());
    } catch (e) { /* ignore */ }
  } else {
    try { video.pause(); } catch (e) { /* ignore */ }
  }
  flashModalIcon(willPlay ? "bi-play-fill" : "bi-pause-fill");
}

/** Petite animation d'icone au centre (feedback visuel). */
function flashModalIcon(iconClass) {
  const flash = $("#np-flash");
  if (!flash) return;
  flash.innerHTML = '<i class="bi ' + iconClass + '" aria-hidden="true"></i>';
  flash.classList.remove("show");
  void flash.offsetWidth; // relance l'animation CSS
  flash.classList.add("show");
}

/** Arrete la lecture modal et reinitialise l'UI (a la fermeture). */
function stopModalPlayback() {
  const video = $("#modal-video");
  if (video) {
    try { if (!video.paused) video.pause(); } catch (e) { /* ignore */ }
  }
  cancelModalProgressLoop();
  const spinner = $("#np-spinner");
  if (spinner) spinner.classList.add("d-none");
  updateModalPlayUI();
}

/* Boucle fluide de la barre de progression (requestAnimationFrame). */
let modalProgressRaf = null;
function cancelModalProgressLoop() {
  if (modalProgressRaf !== null) {
    cancelAnimationFrame(modalProgressRaf);
    modalProgressRaf = null;
  }
}
function modalProgressLoop() {
  const video = $("#modal-video");
  if (!video) return;
  const played = $("#np-played");
  const handle = $("#np-handle");
  const time = $("#np-time");
  const progress = $("#np-progress");
  const duration = video.duration || 0;
  const current = video.currentTime || 0;
  const ratio = duration > 0 ? (current / duration) * 100 : 0;
  if (played) played.style.width = ratio + "%";
  if (handle) handle.style.left = ratio + "%";
  if (time) time.textContent = formatVideoTime(current) + " / " + formatVideoTime(duration);
  if (progress) progress.setAttribute("aria-valuenow", String(Math.round(ratio)));
  // Portion chargee (buffered)
  const bufferedEl = $("#np-buffered");
  if (bufferedEl && duration > 0 && video.buffered.length) {
    try {
      const end = video.buffered.end(video.buffered.length - 1);
      bufferedEl.style.width = Math.min((end / duration) * 100, 100) + "%";
    } catch (e) { /* ignore */ }
  }
  if (!video.paused && !video.ended) {
    modalProgressRaf = requestAnimationFrame(modalProgressLoop);
  } else {
    modalProgressRaf = null;
  }
}

/** Initialise le lecteur video de la modal (une seule fois). */
function initModalPlayer() {
  const player = $("#modal-player");
  const video = $("#modal-video");
  const modalEl = $("#project-modal");
  if (!player || !video || !modalEl) return;

  const playBtn = $("#np-play");
  const center = $("#np-center");
  const progress = $("#np-progress");
  const muteBtn = $("#np-mute");
  const volume = $("#np-volume");
  const fsBtn = $("#np-fullscreen");
  const spinner = $("#np-spinner");
  const backBtn = $("#np-back");
  const fwdBtn = $("#np-forward");

  // --- Transport ---
  if (playBtn) playBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleModalPlayback(); });
  if (center) center.addEventListener("click", (e) => { e.stopPropagation(); toggleModalPlayback(); });
  video.addEventListener("click", toggleModalPlayback);
  video.addEventListener("dblclick", () => toggleModalFullscreen());
  if (backBtn) backBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    try { video.currentTime = Math.max(0, video.currentTime - 10); } catch (err) { /* ignore */ }
    flashModalIcon("bi-arrow-counterclockwise");
  });
  if (fwdBtn) fwdBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    try { video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); } catch (err) { /* ignore */ }
    flashModalIcon("bi-arrow-clockwise");
  });

  // --- Etats ---
  video.addEventListener("play", () => {
    updateModalPlayUI();
    cancelModalProgressLoop();
    modalProgressRaf = requestAnimationFrame(modalProgressLoop);
  });
  video.addEventListener("pause", () => { updateModalPlayUI(); cancelModalProgressLoop(); modalProgressLoop(); });
  video.addEventListener("ended", () => { updateModalPlayUI(); cancelModalProgressLoop(); });
  video.addEventListener("waiting", () => { if (spinner) spinner.classList.remove("d-none"); });
  video.addEventListener("playing", () => { if (spinner) spinner.classList.add("d-none"); });
  video.addEventListener("canplay", () => { if (spinner) spinner.classList.add("d-none"); });
  video.addEventListener("loadedmetadata", () => modalProgressLoop());
  video.addEventListener("error", () => {
    if (!video.getAttribute("src")) return;
    if (spinner) spinner.classList.add("d-none");
    const errBox = $("#np-error");
    if (errBox) errBox.classList.remove("d-none");
    updateModalPlayUI();
  });

  // --- Seek : clic + glisser sur la barre de progression ---
  const seekFromEvent = (e) => {
    const rect = progress.getBoundingClientRect();
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    if (video.duration) {
      try { video.currentTime = ratio * video.duration; } catch (err) { /* ignore */ }
    }
    modalProgressLoop();
  };
  let seeking = false;
  if (progress) {
    progress.addEventListener("pointerdown", (e) => {
      seeking = true;
      try { progress.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      seekFromEvent(e);
    });
    progress.addEventListener("pointermove", (e) => { if (seeking) seekFromEvent(e); });
    progress.addEventListener("pointerup", () => { seeking = false; });
    progress.addEventListener("pointercancel", () => { seeking = false; });
  }

  // --- Volume ---
  const updateMuteIcon = () => {
    const icon = $("#np-mute i");
    if (!icon) return;
    if (video.muted || video.volume === 0) icon.className = "bi bi-volume-mute-fill";
    else if (video.volume < 0.5) icon.className = "bi bi-volume-down-fill";
    else icon.className = "bi bi-volume-up-fill";
  };
  if (muteBtn) muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (!video.muted && volume) volume.value = video.volume;
    updateMuteIcon();
  });
  if (volume) volume.addEventListener("input", () => {
    video.volume = parseFloat(volume.value);
    video.muted = video.volume === 0;
    updateMuteIcon();
  });
  video.addEventListener("volumechange", updateMuteIcon);

  // --- Plein ecran ---
  if (fsBtn) fsBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleModalFullscreen(); });
  document.addEventListener("fullscreenchange", () => {
    const icon = $("#np-fullscreen i");
    if (icon) icon.className = document.fullscreenElement ? "bi bi-fullscreen-exit" : "bi bi-fullscreen";
  });

  // --- Masquage auto des controles pendant la lecture ---
  let hideTimer = null;
  const showControls = () => {
    player.classList.remove("idle");
    clearTimeout(hideTimer);
    if (!video.paused) hideTimer = setTimeout(() => player.classList.add("idle"), 2600);
  };
  ["mousemove", "touchstart", "click"].forEach((evt) =>
    player.addEventListener(evt, showControls, { passive: true }));
  video.addEventListener("pause", () => { player.classList.remove("idle"); clearTimeout(hideTimer); });

  // --- Raccourcis clavier (modal ouverte + lecteur visible) ---
  document.addEventListener("keydown", (e) => {
    if (!modalEl.classList.contains("show") || player.classList.contains("d-none")) return;
    if (e.target.matches("input, textarea")) return;
    switch (e.key) {
      case " ":
      case "k": e.preventDefault(); toggleModalPlayback(); break;
      case "ArrowRight":
        try { video.currentTime = Math.min(video.duration || 0, video.currentTime + 5); } catch (err) { /* ignore */ }
        break;
      case "ArrowLeft":
        try { video.currentTime = Math.max(0, video.currentTime - 5); } catch (err) { /* ignore */ }
        break;
      case "ArrowUp":
        e.preventDefault();
        video.volume = Math.min(1, video.volume + 0.1);
        if (volume) volume.value = video.volume;
        break;
      case "ArrowDown":
        e.preventDefault();
        video.volume = Math.max(0, video.volume - 0.1);
        if (volume) volume.value = video.volume;
        break;
      case "f": case "F": toggleModalFullscreen(); break;
      case "m": case "M": video.muted = !video.muted; break;
    }
  });

  // --- Fermeture de la modal : on coupe tout ---
  modalEl.addEventListener("hide.bs.modal", () => {
    stopModalPlayback();
    if (document.fullscreenElement) {
      try { document.exitFullscreen().catch(() => {}); } catch (err) { /* ignore */ }
    }
  });
  modalEl.addEventListener("show.bs.modal", pauseAllPreviews);
}

/** Bascule le plein ecran du lecteur (avec repli iOS/Safari). */
function toggleModalFullscreen() {
  const player = $("#modal-player");
  const video = $("#modal-video");
  if (!player || !video) return;
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (player.requestFullscreen) {
      player.requestFullscreen().catch(() => {});
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen(); // iOS Safari
    }
  } catch (e) { /* plein ecran indisponible */ }
}

/* ================================ DÉMARRAGE =============================== */
document.addEventListener("DOMContentLoaded", () => {
  initPersonalData();
  initNavigation();
  initTheme();
  initParticles();
  initAnimations();
  initRoleRotator();
  initCounters();
  initSkills();
  initExperience();
  initProjects();
  initModalPlayer();
  initServices();
  initTechStack();
  initCertifications();
  initGithub();
  initTestimonials();
  initContactForm();
  initScrollProgress();
  initBackToTop();
});
