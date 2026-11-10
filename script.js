(() => {
  "use strict";

  const TARGET_TIMESTAMP = Date.UTC(2027, 0, 1, 0, 0, 0) - 3 * 60 * 60 * 1000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".hero");
  const countdownStatus = document.querySelector("[data-countdown-status]");
  const enterLabel = document.querySelector("[data-enter-label]");
  const timeDisplays = {
    days: document.querySelector('[data-time="days"]'),
    hours: document.querySelector('[data-time="hours"]'),
    minutes: document.querySelector('[data-time="minutes"]'),
    seconds: document.querySelector('[data-time="seconds"]')
  };
  let countdownTimer = 0;

  function stopCountdown() {
    if (countdownTimer) window.clearInterval(countdownTimer);
    countdownTimer = 0;
  }

  function startCountdown() {
    if (!countdownTimer && !document.hidden && !getCountdownParts().isComplete) {
      countdownTimer = window.setInterval(updateCountdown, 1000);
    }
  }

  function getCountdownParts(now = Date.now()) {
    const remaining = Math.max(0, TARGET_TIMESTAMP - now);
    const totalSeconds = Math.floor(remaining / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      isComplete: remaining === 0
    };
  }

  function updateCountdown() {
    const parts = getCountdownParts();
    for (const [unit, display] of Object.entries(timeDisplays)) {
      const value = String(parts[unit]).padStart(unit === "days" ? 3 : 2, "0");
      if (display.textContent !== value) display.textContent = value;
    }
    if (parts.isComplete) {
      const completedStatus = "It’s 2027. Make it yours.";
      const celebrateLabel = document.querySelector("[data-celebrate-label]");
      hero.classList.add("is-celebration-ready");
      if (countdownStatus.textContent !== completedStatus) countdownStatus.textContent = completedStatus;
      if (celebrateLabel.textContent !== "Celebrate 2027") celebrateLabel.textContent = "Celebrate 2027";
      if (enterLabel.textContent !== "CELEBRATE 2027") enterLabel.textContent = "CELEBRATE 2027";
      stopCountdown();
    }
  }

  updateCountdown();
  startCountdown();

  const chapters = [...document.querySelectorAll("main > section.chapter")];
  const chapterNav = document.querySelector(".chapter-nav");
  const chapterLinks = [...chapterNav.querySelectorAll(".chapter-nav__dot")];
  const chapterProgress = chapterNav.querySelector("[data-chapter-progress]");

  function updateActiveChapter() {
    const viewportCenter = window.innerHeight / 2;
    let activeIndex = chapters.findIndex((chapter) => {
      const bounds = chapter.getBoundingClientRect();
      return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
    });
    if (activeIndex < 0) activeIndex = 0;

    chapterLinks.forEach((link, index) => {
      const isActive = index === activeIndex;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    chapterNav.querySelector(".chapter-nav__track").setAttribute("aria-valuenow", String(activeIndex + 1));
    chapterProgress.style.setProperty("--chapter-progress", String(activeIndex / Math.max(chapters.length - 1, 1)));
  }

  updateActiveChapter();
  if ("IntersectionObserver" in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-in-view", entry.isIntersecting);
      });
      updateActiveChapter();
    }, { threshold: 0.14, rootMargin: "-10% 0px -10% 0px" });
    chapters.forEach((chapter) => chapterObserver.observe(chapter));
  } else {
    chapters.forEach((chapter) => chapter.classList.add("is-in-view"));
    window.addEventListener("scroll", updateActiveChapter, { passive: true });
  }
  window.addEventListener("resize", updateActiveChapter, { passive: true });

  const enterLink = document.getElementById("enter-experience");
  const arrival = document.getElementById("experience");
  const arrivalTitle = document.getElementById("arrival-title");
  const celebrateButton = document.getElementById("celebrate");
  let transitionTimer = 0;
  enterLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (getCountdownParts().isComplete) {
      openCelebration(enterLink);
      return;
    }
    if (transitionTimer) return;

    window.history.replaceState(null, "", enterLink.getAttribute("href"));
    document.documentElement.classList.add("is-entering-experience");
    arrivalTitle.focus({ preventScroll: true });
    arrival.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
    transitionTimer = window.setTimeout(() => {
      transitionTimer = 0;
      document.documentElement.classList.remove("is-entering-experience");
    }, reducedMotion.matches ? 0 : 520);
  });

  const messages = [
    { caption: "FRIENDSHIP, WITH LESS SCHEDULING", text: "May the group chat finally agree on a date. And may the plans be even better than the planning." },
    { caption: "ROOM TO GET IT WRONG", text: "You don’t need a five-year plan. A Tuesday plan would be a pretty good start." },
    { caption: "THE LITTLE THINGS COUNT", text: "Here’s to the ordinary afternoons that turn out, later, to have been the good old days." },
    { caption: "NEW THINGS, SAME PEOPLE", text: "May something surprise you. May someone show up. May you be brave enough to say yes." },
    { caption: "A VERY GOOD YEAR IN PROGRESS", text: "Whatever 2027 has in mind, at least we can say we showed up for it. That’s not nothing." }
  ];
  let messageIndex = 0;
  const messageNumber = document.querySelector("[data-message-number]");
  const messageText = document.querySelector("[data-message-text]");
  const messageCaption = document.querySelector("[data-message-caption]");
  document.getElementById("next-note").addEventListener("click", () => {
    messageIndex = (messageIndex + 1) % messages.length;
    const message = messages[messageIndex];
    messageNumber.textContent = String(messageIndex + 1).padStart(2, "0");
    messageText.textContent = message.text;
    messageCaption.textContent = message.caption;
  });

  const celebration = document.getElementById("celebration");
  const closeButton = document.getElementById("close-celebration");
  const canvas = document.getElementById("fireworks");
  const context = canvas.getContext("2d");
  const colors = ["rgb(214, 181, 109)", "rgb(241, 240, 237)", "rgb(171, 183, 206)", "rgb(145, 132, 172)"];
  const patterns = ["peony", "ring", "willow", "double"];
  let animationFrame = 0;
  let lastBurst = 0;
  let lastFrame = 0;
  let burstIndex = 0;
  let particles = [];
  let rockets = [];
  let previousFocus = null;
  let pixelRatio = 1;

  function resizeCanvas() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 1.25 : 1.5);
    canvas.width = Math.round(window.innerWidth * pixelRatio);
    canvas.height = Math.round(window.innerHeight * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function getParticleLimit() {
    return window.innerWidth < 600 ? 100 : 220;
  }

  function launchFirework() {
    if (rockets.length >= 2) return;
    rockets.push({
      x: window.innerWidth * (0.16 + Math.random() * 0.68),
      y: window.innerHeight + 8,
      targetY: window.innerHeight * (0.2 + Math.random() * 0.27),
      vy: -(6.4 + Math.random() * 1.4),
      pattern: patterns[burstIndex % patterns.length],
      color: colors[burstIndex % colors.length]
    });
    burstIndex += 1;
  }

  function burstFirework(rocket) {
    const count = Math.min(window.innerWidth < 600 ? 27 : 40, getParticleLimit() - particles.length);
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      const speed = rocket.pattern === "ring"
        ? 2.15 + Math.random() * 0.35
        : rocket.pattern === "double" && index % 4 === 0
          ? 0.8 + Math.random() * 0.25
          : 1 + Math.random() * (rocket.pattern === "willow" ? 1.3 : 2.3);
      particles.push({
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: rocket.pattern === "willow" ? 72 + Math.random() * 28 : 42 + Math.random() * 27,
        gravity: rocket.pattern === "willow" ? 0.055 : 0.025,
        drag: rocket.pattern === "willow" ? 0.985 : 0.992,
        size: 1.4 + Math.random() * 1.2,
        color: rocket.color
      });
    }
  }

  function drawFireworks(timestamp) {
    if (celebration.hidden || document.hidden) {
      animationFrame = 0;
      return;
    }
    const frameScale = lastFrame ? Math.min((timestamp - lastFrame) / 16.67, 2) : 1;
    lastFrame = timestamp;
    context.fillStyle = "rgba(7, 7, 11, 0.2)";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    if (timestamp - lastBurst > 850) {
      launchFirework();
      lastBurst = timestamp;
    }

    for (let index = rockets.length - 1; index >= 0; index -= 1) {
      const rocket = rockets[index];
      if (rocket.y <= rocket.targetY || rocket.vy >= -0.5) {
        burstFirework(rocket);
        rockets.splice(index, 1);
        continue;
      }
      rocket.y += rocket.vy * frameScale;
      rocket.vy += 0.045 * frameScale;
      context.globalAlpha = 0.72;
      context.fillStyle = rocket.color;
      context.fillRect(rocket.x, rocket.y, 2, 4);
    }
    let activeParticles = 0;
    for (let index = 0, length = particles.length; index < length; index += 1) {
      const particle = particles[index];
      if (particle.life <= 0) continue;
      particle.x += particle.vx * frameScale;
      particle.y += particle.vy * frameScale;
      particle.vy += particle.gravity * frameScale;
      particle.vx *= Math.pow(particle.drag, frameScale);
      particle.life -= frameScale;
      if (particle.life <= 0) continue;
      context.globalAlpha = Math.min(particle.life / 24, 1);
      context.fillStyle = particle.color;
      context.fillRect(particle.x, particle.y, particle.size, particle.size);
      particles[activeParticles] = particle;
      activeParticles += 1;
    }
    particles.length = activeParticles;
    context.globalAlpha = 1;
    animationFrame = window.requestAnimationFrame(drawFireworks);
  }

  function closeCelebration() {
    if (celebration.hidden) return;
    celebration.hidden = true;
    celebration.setAttribute("aria-hidden", "true");
    stopFireworks();
    window.removeEventListener("resize", resizeCanvas);
    document.removeEventListener("keydown", onCelebrationKeydown);
    particles = [];
    rockets = [];
    lastFrame = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (previousFocus) previousFocus.focus();
  }

  function onCelebrationKeydown(event) {
    if (event.key === "Escape") closeCelebration();
    if (event.key !== "Tab") return;
    event.preventDefault();
    closeButton.focus();
  }

  function openCelebration(returnFocus = document.activeElement) {
    if (!celebration.hidden) return;
    previousFocus = returnFocus;
    celebration.hidden = false;
    celebration.setAttribute("aria-hidden", "false");
    resizeCanvas();
    closeButton.focus();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("keydown", onCelebrationKeydown);
    startFireworks();
  }

  function stopFireworks() {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function startFireworks() {
    if (celebration.hidden || reducedMotion.matches || document.hidden || animationFrame) return;
    lastBurst = 0;
    lastFrame = 0;
    animationFrame = window.requestAnimationFrame(drawFireworks);
  }

  celebrateButton.addEventListener("click", () => openCelebration());
  closeButton.addEventListener("click", closeCelebration);
  document.documentElement.classList.toggle("page-hidden", document.hidden);
  document.addEventListener("visibilitychange", () => {
    document.documentElement.classList.toggle("page-hidden", document.hidden);
    if (document.hidden) {
      stopCountdown();
      stopFireworks();
      return;
    }
    updateCountdown();
    startCountdown();
    startFireworks();
  });

  window.NewYear2027 = Object.freeze({ getCountdownParts, targetTimestamp: TARGET_TIMESTAMP });
})();