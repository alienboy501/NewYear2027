(() => {
  "use strict";

  const TARGET_TIMESTAMP = Date.parse("2027-01-01T00:00:00+03:00");
  const NEAR_MIDNIGHT_WINDOW = 60 * 60 * 1000;
  const FINAL_MINUTES_WINDOW = 5 * 60 * 1000;
  const isDevelopmentPreview = window.location.protocol === "file:"
    || ["localhost", "127.0.0.1", "::1", "[::1]"].includes(window.location.hostname);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const heroAtmosphere = document.querySelector(".hero__atmosphere");
  if (heroAtmosphere && finePointer.matches && !reducedMotion.matches) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let parallaxFrame = 0;

    function resetParallax() {
      if (parallaxFrame) window.cancelAnimationFrame(parallaxFrame);
      parallaxFrame = 0;
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      heroAtmosphere.style.removeProperty("--hero-parallax-x");
      heroAtmosphere.style.removeProperty("--hero-parallax-y");
    }

    function updateParallax() {
      if (document.hidden || reducedMotion.matches) {
        resetParallax();
        return;
      }
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      heroAtmosphere.style.setProperty("--hero-parallax-x", `${currentX.toFixed(2)}px`);
      heroAtmosphere.style.setProperty("--hero-parallax-y", `${currentY.toFixed(2)}px`);
      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        parallaxFrame = window.requestAnimationFrame(updateParallax);
      } else {
        parallaxFrame = 0;
      }
    }

    window.addEventListener("pointermove", (event) => {
      if (document.hidden || reducedMotion.matches) {
        resetParallax();
        return;
      }
      targetX = (event.clientX / window.innerWidth - 0.5) * 10;
      targetY = (event.clientY / window.innerHeight - 0.5) * 8;
      if (!parallaxFrame && !document.hidden) parallaxFrame = window.requestAnimationFrame(updateParallax);
    }, { passive: true });
    reducedMotion.addEventListener("change", (event) => {
      if (!event.matches) return;
      resetParallax();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) resetParallax();
    });
  }
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
  let hasRenderedCountdown = false;
  let midnightLaunchStarted = false;
  let midnightRevealInProgress = false;
  let isMidnightPreview = false;
  let midnightCloseTimer = 0;
  const gatewaySections = [...document.querySelectorAll("main > section.chapter:not(.hero)")];
  const main = document.querySelector("main");
  const chapterNav = document.querySelector(".chapter-nav");
  const yearExperience = document.getElementById("new-year-experience");
  const yearExperienceContent = yearExperience.querySelector(".year-experience__content");
  const enterExistingExperience = document.getElementById("enter-existing-experience");
  const yearExperienceAction = document.querySelector("[data-year-experience-action]");
  const yearStages = [...yearExperience.querySelectorAll("[data-year-stage]")];
  const yearPreviousButton = document.getElementById("year-experience-previous");
  const yearNextButton = document.getElementById("year-experience-next");
  const yearNextLabel = document.querySelector("[data-year-next-label]");
  const yearProgress = yearExperience.querySelector("[data-year-progress]");
  const yearProgressFill = yearExperience.querySelector("[data-year-progress-fill]");
  const yearStepCount = yearExperience.querySelector("[data-year-step-count]");
  const yearProgressMarks = [...yearExperience.querySelectorAll(".year-experience__progress-marks span")];
  const journeyChoices = [...yearExperience.querySelectorAll("[data-year-choice]")];
  const journeyTitle = yearExperience.querySelector("[data-year-journey-title]");
  const journeyCopy = yearExperience.querySelector("[data-year-journey-copy]");
  const wishForm = document.getElementById("year-wish-form");
  const wishInput = document.getElementById("year-wish-input");
  const wishCount = yearExperience.querySelector("[data-year-wish-count]");
  const wishConfirmation = document.getElementById("year-wish-confirmation");
  const savedWishDisplay = yearExperience.querySelector("[data-year-saved-wish]");
  const wishStorageKey = "new-year-2027-wish";
  const yearStageLabels = ["BEGIN THE JOURNEY", "MAKE A WISH", "CARRY IT FORWARD"];
  const journeyPossibilities = {
    wonder: {
      label: "01 / WONDER",
      title: "Follow a little wonder.",
      copy: "Let curiosity take the long way home. Some of the best things begin as a detour."
    },
    space: {
      label: "02 / SPACE",
      title: "Make room for what matters.",
      copy: "Leave a little breathing room for people, quiet, and the things you have not planned yet."
    },
    courage: {
      label: "03 / COURAGE",
      title: "Begin before you feel ready.",
      copy: "A brave year is often made of small first steps, taken before the whole path is clear."
    },
    delight: {
      label: "04 / DELIGHT",
      title: "Notice what makes you glad.",
      copy: "Keep an eye out for the ordinary good things. They have a way of becoming the whole story."
    }
  };
  let currentYearStage = 0;
  let savedWish = "";
  let experienceTransitioning = false;
  let previousMainInert = false;
  let previousMainAriaHidden = null;
  let previousNavInert = false;
  let previousNavAriaHidden = null;
  let revealMainInert = false;
  let revealMainAriaHidden = null;
  let revealNavInert = false;
  let revealNavAriaHidden = null;

  function setCountdownGateway(isActive) {
    document.documentElement.classList.toggle("is-countdown-gateway", isActive);
    gatewaySections.forEach((section) => { section.inert = isActive; });
    chapterNav.inert = isActive;
  }

  function setYearExperienceStage(stageIndex, shouldFocus = true) {
    if (stageIndex < 0 || stageIndex >= yearStages.length) return;
    currentYearStage = stageIndex;
    yearExperienceContent.scrollTop = 0;
    yearStages.forEach((stage, index) => {
      const isCurrent = index === stageIndex;
      stage.hidden = !isCurrent;
      stage.inert = !isCurrent;
      stage.classList.toggle("is-active", isCurrent);
      stage.classList.remove("is-arriving");
      if (isCurrent) {
        void stage.offsetWidth;
        stage.classList.add("is-arriving");
      }
    });
    const heading = yearStages[stageIndex].querySelector("h1, h2");
    yearExperience.setAttribute("aria-labelledby", heading.id);
    yearProgress.setAttribute("aria-valuenow", String(stageIndex + 1));
    yearProgressFill.style.transform = `scaleX(${(stageIndex + 1) / yearStages.length})`;
    yearStepCount.textContent = `${String(stageIndex + 1).padStart(2, "0")} / ${String(yearStages.length).padStart(2, "0")}`;
    yearProgressMarks.forEach((mark, index) => {
      mark.classList.toggle("is-current", index === stageIndex);
      mark.classList.toggle("is-complete", index < stageIndex);
    });
    yearPreviousButton.disabled = stageIndex === 0;
    yearNextButton.hidden = stageIndex === yearStages.length - 1;
    yearNextButton.disabled = stageIndex === 2 && wishConfirmation.hidden;
    yearNextLabel.textContent = yearStageLabels[stageIndex] || "CONTINUE";
    if (shouldFocus) heading.focus({ preventScroll: true });
  }

  function selectJourneyPossibility(key) {
    const possibility = journeyPossibilities[key];
    if (!possibility) return;
    journeyChoices.forEach((choice) => {
      const isSelected = choice.dataset.yearChoice === key;
      choice.classList.toggle("is-selected", isSelected);
      choice.setAttribute("aria-pressed", String(isSelected));
    });
    const label = yearExperience.querySelector("[data-year-journey-label]");
    if (label) label.textContent = possibility.label;
    journeyTitle.textContent = possibility.title;
    journeyCopy.textContent = possibility.copy;
  }

  function updateWishCount() {
    wishCount.textContent = String(wishInput.value.length);
  }

  function revealSavedWish(shouldFocus = true) {
    const wish = wishInput.value.trim();
    if (!wish) {
      wishInput.focus();
      return false;
    }
    savedWish = wish;
    try {
      window.localStorage.setItem(wishStorageKey, savedWish);
    } catch {
      savedWish = wish;
    }
    savedWishDisplay.textContent = savedWish;
    wishForm.hidden = true;
    wishConfirmation.hidden = false;
    wishConfirmation.classList.remove("is-revealing");
    void wishConfirmation.offsetWidth;
    wishConfirmation.classList.add("is-revealing");
    yearNextButton.disabled = false;
    if (shouldFocus) document.getElementById("year-wish-confirmation-title").focus({ preventScroll: true });
    return true;
  }

  function restoreSavedWish() {
    try {
      savedWish = window.localStorage.getItem(wishStorageKey) || "";
    } catch {
      savedWish = "";
    }
    wishInput.value = savedWish.slice(0, 240);
    updateWishCount();
    if (!savedWish.trim()) return;
    savedWishDisplay.textContent = savedWish;
    wishForm.hidden = true;
    wishConfirmation.hidden = false;
  }

  function editSavedWish() {
    wishConfirmation.hidden = true;
    wishConfirmation.classList.remove("is-revealing");
    wishForm.hidden = false;
    yearNextButton.disabled = true;
    wishInput.focus();
  }

  function restartYearExperience() {
    try {
      window.localStorage.removeItem(wishStorageKey);
    } catch {
      savedWish = "";
    }
    savedWish = "";
    wishInput.value = "";
    updateWishCount();
    wishForm.hidden = false;
    wishConfirmation.hidden = true;
    wishConfirmation.classList.remove("is-revealing");
    selectJourneyPossibility("wonder");
    setYearExperienceStage(0);
  }

  function stopCountdown() {
    if (countdownTimer) window.clearTimeout(countdownTimer);
    countdownTimer = 0;
  }

  function startCountdown() {
    if (!countdownTimer && !document.hidden && !getCountdownParts().isComplete) {
      countdownTimer = window.setTimeout(
        updateCountdown,
        Math.min(1000, Math.max(TARGET_TIMESTAMP - Date.now(), 1))
      );
    }
  }

  function getCountdownParts(now = Date.now()) {
    const remaining = Math.max(0, TARGET_TIMESTAMP - now);
    const totalSeconds = Math.ceil(remaining / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      remainingMilliseconds: remaining,
      isComplete: remaining === 0
    };
  }

  function animateCountdownValue(display) {
    if (reducedMotion.matches || typeof display.animate !== "function") return;
    display.animate([
      { opacity: 0.48, transform: "translate3d(0, 7px, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" }
    ], { duration: 360, easing: "cubic-bezier(.2, .75, .2, 1)" });
  }

  function updateCountdown() {
    countdownTimer = 0;
    const parts = getCountdownParts();
    for (const [unit, display] of Object.entries(timeDisplays)) {
      const value = String(parts[unit]).padStart(unit === "days" ? 3 : 2, "0");
      if (display.textContent !== value) {
        display.textContent = value;
        if (hasRenderedCountdown) animateCountdownValue(display);
      }
    }
    hasRenderedCountdown = true;
    hero.classList.toggle("is-near-midnight", !parts.isComplete && parts.remainingMilliseconds <= NEAR_MIDNIGHT_WINDOW);
    hero.classList.toggle("is-final-minutes", !parts.isComplete && parts.remainingMilliseconds <= FINAL_MINUTES_WINDOW);
    if (parts.isComplete) {
      const completedStatus = "It’s 2027. Make it yours.";
      const celebrateLabel = document.querySelector("[data-celebrate-label]");
      hero.classList.add("is-celebration-ready");
      if (countdownStatus.textContent !== completedStatus) countdownStatus.textContent = completedStatus;
      if (celebrateLabel.textContent !== "Celebrate 2027") celebrateLabel.textContent = "Celebrate 2027";
      if (enterLabel.textContent !== "CELEBRATE 2027") enterLabel.textContent = "CELEBRATE 2027";
      stopCountdown();
      if (!midnightLaunchStarted && document.documentElement.classList.contains("is-countdown-gateway")) {
        startMidnightReveal();
      }
    } else {
      startCountdown();
    }
  }

  const chapters = [...document.querySelectorAll("main > section.chapter")];
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

  function closeCelebration(unlockGateway = true) {
    if (celebration.hidden) return;
    if (midnightCloseTimer) window.clearTimeout(midnightCloseTimer);
    midnightCloseTimer = 0;
    celebration.hidden = true;
    celebration.setAttribute("aria-hidden", "true");
    celebration.setAttribute("aria-labelledby", "celebration-title");
    celebration.classList.remove("celebration--midnight");
    stopFireworks();
    window.removeEventListener("resize", resizeCanvas);
    document.removeEventListener("keydown", onCelebrationKeydown);
    particles = [];
    rockets = [];
    lastFrame = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
    previousFocus = null;
    if (unlockGateway) setCountdownGateway(false);
  }

  function onCelebrationKeydown(event) {
    if (event.key === "Escape") {
      if (!celebration.classList.contains("celebration--midnight")) closeCelebration();
      return;
    }
    if (event.key !== "Tab") return;
    event.preventDefault();
    if (celebration.classList.contains("celebration--midnight")) {
      document.getElementById("midnight-title").focus();
    } else {
      closeButton.focus();
    }
  }

  function openCelebration(returnFocus = document.activeElement, isMidnight = false) {
    if (!celebration.hidden) return;
    previousFocus = isMidnight ? null : returnFocus;
    celebration.classList.toggle("celebration--midnight", isMidnight);
    celebration.setAttribute("aria-labelledby", isMidnight ? "midnight-title" : "celebration-title");
    celebration.hidden = false;
    celebration.setAttribute("aria-hidden", "false");
    resizeCanvas();
    if (isMidnight) {
      document.getElementById("midnight-title").focus();
    } else {
      closeButton.focus();
    }
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

  function startMidnightReveal(isPreview = false) {
    if (isPreview) {
      if (!isDevelopmentPreview || Date.now() >= TARGET_TIMESTAMP || midnightLaunchStarted || midnightRevealInProgress || !celebration.hidden) return false;
      isMidnightPreview = true;
    } else {
      if (midnightLaunchStarted) return false;
      midnightLaunchStarted = true;
      isMidnightPreview = false;
      stopCountdown();
      revealMainInert = main.inert;
      revealMainAriaHidden = main.getAttribute("aria-hidden");
      revealNavInert = chapterNav.inert;
      revealNavAriaHidden = chapterNav.getAttribute("aria-hidden");
      main.inert = true;
      main.setAttribute("aria-hidden", "true");
      chapterNav.inert = true;
      chapterNav.setAttribute("aria-hidden", "true");
    }
    if (midnightRevealInProgress) return true;

    midnightRevealInProgress = true;
    openCelebration(null, true);
    midnightCloseTimer = window.setTimeout(() => {
      closeCelebration(false);
      midnightRevealInProgress = false;
      if (!isMidnightPreview) restorePageAfterMidnightReveal();
      showYearExperience(isMidnightPreview);
    }, reducedMotion.matches ? 1800 : 9200);
    return true;
  }

  function restorePageAfterMidnightReveal() {
    main.inert = revealMainInert;
    if (revealMainAriaHidden === null) main.removeAttribute("aria-hidden");
    else main.setAttribute("aria-hidden", revealMainAriaHidden);
    chapterNav.inert = revealNavInert;
    if (revealNavAriaHidden === null) chapterNav.removeAttribute("aria-hidden");
    else chapterNav.setAttribute("aria-hidden", revealNavAriaHidden);
  }

  function showYearExperience(isPreview = false) {
    if (yearExperience.hidden) {
      previousMainInert = main.inert;
      previousMainAriaHidden = main.getAttribute("aria-hidden");
      previousNavInert = chapterNav.inert;
      previousNavAriaHidden = chapterNav.getAttribute("aria-hidden");
    }
    isMidnightPreview = isPreview;
    yearExperienceAction.textContent = isPreview ? "RETURN TO COUNTDOWN" : "EXPLORE THE ORIGINAL SITE";
    setYearExperienceStage(0, false);
    yearExperience.hidden = false;
    yearExperience.setAttribute("aria-hidden", "false");
    main.inert = true;
    main.setAttribute("aria-hidden", "true");
    chapterNav.inert = true;
    chapterNav.setAttribute("aria-hidden", "true");
    document.documentElement.classList.add("is-new-year-experience");
    if (!isPreview) midnightLaunchStarted = true;
    yearStages[0].querySelector("h1").focus();
    document.addEventListener("keydown", onYearExperienceKeydown);
  }

  function leaveYearExperience() {
    if (yearExperience.hidden) return;
    const returnToCountdown = isMidnightPreview && Date.now() < TARGET_TIMESTAMP;
    document.removeEventListener("keydown", onYearExperienceKeydown);
    yearExperience.hidden = true;
    yearExperience.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("is-new-year-experience");
    main.inert = previousMainInert;
    if (previousMainAriaHidden === null) main.removeAttribute("aria-hidden");
    else main.setAttribute("aria-hidden", previousMainAriaHidden);
    chapterNav.inert = previousNavInert;
    if (previousNavAriaHidden === null) chapterNav.removeAttribute("aria-hidden");
    else chapterNav.setAttribute("aria-hidden", previousNavAriaHidden);
    isMidnightPreview = false;
    setCountdownGateway(returnToCountdown);
    updateCountdown();

    if (returnToCountdown) {
      document.getElementById("hero-title").focus();
      return;
    }
    if (Date.now() >= TARGET_TIMESTAMP && !midnightLaunchStarted) {
      startMidnightReveal();
      return;
    }
    arrivalTitle.focus();
    arrival.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
  }

  function onYearExperienceKeydown(event) {
    if (event.key === "Escape" && isMidnightPreview) {
      leaveYearExperience();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...yearExperience.querySelectorAll('a[href], button:not(:disabled), textarea:not(:disabled)')]
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !yearExperience.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }

  function previewMidnightReveal() {
    return startMidnightReveal(true);
  }

  celebrateButton.addEventListener("click", () => openCelebration());
  closeButton.addEventListener("click", closeCelebration);
  enterExistingExperience.addEventListener("click", leaveYearExperience);
  yearPreviousButton.addEventListener("click", () => setYearExperienceStage(currentYearStage - 1));
  yearNextButton.addEventListener("click", () => {
    if (currentYearStage === 2 && wishConfirmation.hidden) return;
    setYearExperienceStage(currentYearStage + 1);
  });
  journeyChoices.forEach((choice) => {
    choice.addEventListener("click", () => selectJourneyPossibility(choice.dataset.yearChoice));
  });
  wishInput.addEventListener("input", updateWishCount);
  wishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    revealSavedWish();
  });
  document.getElementById("edit-year-wish").addEventListener("click", editSavedWish);
  document.getElementById("restart-year-experience").addEventListener("click", restartYearExperience);
  restoreSavedWish();
  selectJourneyPossibility("wonder");
  document.documentElement.classList.toggle("page-hidden", document.hidden);
  document.addEventListener("visibilitychange", () => {
    document.documentElement.classList.toggle("page-hidden", document.hidden);
    if (document.hidden) {
      stopCountdown();
      stopFireworks();
      return;
    }
    updateCountdown();
    startFireworks();
  });

  const isAfterTarget = Date.now() >= TARGET_TIMESTAMP;
  setCountdownGateway(!isAfterTarget);
  updateCountdown();
  if (isAfterTarget) showYearExperience(false);

  const publicApi = { getCountdownParts, targetTimestamp: TARGET_TIMESTAMP };
  if (isDevelopmentPreview) publicApi.previewMidnightReveal = previewMidnightReveal;
  window.NewYear2027 = Object.freeze(publicApi);
  if (isDevelopmentPreview && new URLSearchParams(window.location.search).get("preview") === "midnight") {
    previewMidnightReveal();
  }
})();