(() => {
  "use strict";

  const AXES = ["dream", "strategy", "creator", "explorer", "wit", "optimism"];
  const QUESTIONS = [
    {
      prompt: "You have an unexpectedly free Saturday. What sounds most appealing?",
      answers: [
        { text: "Going somewhere new.", axis: "explorer", energy: 1 },
        { text: "Staying home and relaxing.", axis: "dream", energy: -1 },
        { text: "Spending time with friends.", axis: "optimism", energy: 1 },
        { text: "Working on something interesting.", axis: "creator", energy: 1 }
      ]
    },
    {
      prompt: "Which setting sounds best for an evening?",
      answers: [
        { text: "A quiet place under the stars.", axis: "dream", energy: -1 },
        { text: "A lively city full of lights.", axis: "wit", energy: 1 },
        { text: "Somewhere surrounded by nature.", axis: "explorer", energy: -1 },
        { text: "A comfortable place with good music.", axis: "creator", energy: -1 }
      ]
    },
    {
      prompt: "If you could instantly learn one new skill, what would you choose?",
      answers: [
        { text: "Creating something artistic.", axis: "creator", energy: 1 },
        { text: "Solving difficult problems.", axis: "strategy", energy: -1 },
        { text: "Speaking another language.", axis: "wit", energy: 1 },
        { text: "Mastering a sport.", axis: "explorer", energy: 1 }
      ]
    },
    {
      prompt: "A group is picking an activity. Which option sounds best?",
      answers: [
        { text: "Try something nobody has done before.", axis: "explorer", energy: 1 },
        { text: "Choose something everyone can enjoy.", axis: "optimism", energy: 1 },
        { text: "Find somewhere peaceful.", axis: "strategy", energy: -1 },
        { text: "Do something completely unexpected.", axis: "wit", energy: 1 }
      ]
    },
    {
      prompt: "Which fictional adventure would you rather experience?",
      answers: [
        { text: "Exploring an undiscovered world.", axis: "explorer", energy: 1 },
        { text: "Solving an unforgettable mystery.", axis: "strategy", energy: -1 },
        { text: "Building something extraordinary.", axis: "dream", energy: 1 },
        { text: "Going on an unpredictable journey.", axis: "wit", energy: 1 }
      ]
    }
  ];

  const IDENTITIES = {
    "dream-bold": {
      title: "The Moonshot With a Calendar",
      description: "Your imagination has booked the venue, named the project, and bought a notebook. The first step is still allowed to be very small.",
      prediction: "In 2027, a 'what if' survives its first practical question and gets a date, a budget, or at least its own tab.",
      motto: "Give the big idea a Tuesday.",
      motif: "orbit",
      accent: "#d6b56d",
      glow: "rgba(214, 181, 109, .13)",
      ground: "#15120d"
    },
    "dream-calm": {
      title: "The Quiet Plot Twist",
      description: "You don't announce the reinvention. You change one small thing, keep at it, and let people notice three weeks later.",
      prediction: "A private little experiment becomes the part of your routine you'd miss if it disappeared.",
      motto: "No press release required.",
      motif: "horizon",
      accent: "#a9b8cb",
      glow: "rgba(169, 184, 203, .12)",
      ground: "#10151c"
    },
    "strategy-calm": {
      title: "The Margin-Note Detective",
      description: "You spot the one detail everyone skipped, then make the messy plan seem like it had a plan all along.",
      prediction: "An overlooked line in a message saves a meeting and earns you a very specific thank-you.",
      motto: "Check the footnote.",
      motif: "grid",
      accent: "#b3b0c5",
      glow: "rgba(179, 176, 197, .12)",
      ground: "#121119"
    },
    "strategy-bold": {
      title: "The Velvet Negotiator",
      description: "You can make 'we should talk' sound less like a summons and more like an actual conversation.",
      prediction: "Two incompatible plans meet in the middle; everyone assumes it was easy. You know the napkin math.",
      motto: "Ask the useful question.",
      motif: "arc",
      accent: "#c49b86",
      glow: "rgba(196, 155, 134, .12)",
      ground: "#19120f"
    },
    "creator-calm": {
      title: "The After-Hours Tinkerer",
      description: "Your best ideas turn up when the house is quiet and you were absolutely about to go to bed.",
      prediction: "The draft you keep reopening finally gets a name, a shape, and a person who wants to see it.",
      motto: "Save one more version.",
      motif: "spark",
      accent: "#b39ac7",
      glow: "rgba(179, 154, 199, .13)",
      ground: "#15111a"
    },
    "creator-bold": {
      title: "The Story Department",
      description: "You can turn a strange Tuesday into a story people retell, with just enough embellishment to improve the pacing.",
      prediction: "A casual photo, voice note, or half-finished project becomes the keepsake everyone asks you to send.",
      motto: "Keep the good detail.",
      motif: "frame",
      accent: "#d19c77",
      glow: "rgba(209, 156, 119, .13)",
      ground: "#19120e"
    },
    "explorer-bold": {
      title: "The Detour Specialist",
      description: "You treat 'wrong turn' as a temporary theory. Somehow there are snacks, a better view, and no one is checking the map now.",
      prediction: "A last-minute yes puts an unfamiliar name in your favourites, playlist, or saved places.",
      motto: "Take the road with a story.",
      motif: "compass",
      accent: "#89b7b0",
      glow: "rgba(137, 183, 176, .13)",
      ground: "#0e1716"
    },
    "explorer-calm": {
      title: "The Field-Note Romantic",
      description: "You travel at the speed of noticing: the odd shop sign, the quiet path, the place with a very good window seat.",
      prediction: "One place you nearly pass becomes the spot you recommend with unreasonable confidence.",
      motto: "Look twice; wander once.",
      motif: "map",
      accent: "#8ea8c7",
      glow: "rgba(142, 168, 199, .13)",
      ground: "#10151d"
    },
    "wit-bold": {
      title: "The Footnote Instigator",
      description: "You make the connection nobody else saw, then present it as if it was obvious in the first place.",
      prediction: "A joke in a planning chat gets a laugh, then a date, then somehow a group reservation.",
      motto: "Make the useful joke.",
      motif: "prism",
      accent: "#d3ad79",
      glow: "rgba(211, 173, 121, .13)",
      ground: "#18140e"
    },
    "wit-calm": {
      title: "The Deadpan Oracle",
      description: "You let the room do its thing, notice the exact absurdity, and deliver one line that becomes the meeting title.",
      prediction: "Your quietest observation gets repeated back to you by someone who thinks they came up with it.",
      motto: "Wait for the good pause.",
      motif: "ripple",
      accent: "#aeb4bd",
      glow: "rgba(174, 180, 189, .12)",
      ground: "#131518"
    },
    "optimism-bold": {
      title: "The Cheerful Instigator",
      description: "You are the person who says 'we could just...' and has already found the link, the spare chair, or a willing accomplice.",
      prediction: "An invitation you send on a whim turns into the plan people keep asking to repeat.",
      motto: "Send the first text.",
      motif: "sunrise",
      accent: "#e0c47f",
      glow: "rgba(224, 196, 127, .14)",
      ground: "#17150e"
    },
    "optimism-calm": {
      title: "The Human Porch Light",
      description: "You make arrivals easier: a remembered preference, a warm hello, and a sense that nobody needs to perform.",
      prediction: "Someone accepts your low-pressure invitation, then tells you later it was exactly the evening they needed.",
      motto: "Make room at the table.",
      motif: "lantern",
      accent: "#9ebca8",
      glow: "rgba(158, 188, 168, .13)",
      ground: "#111713"
    }
  };

  const CARD_LAYOUTS = {
    "dream-bold": { align: "left", width: 700, titleSize: 74, titleFont: "serif", titleStyle: "italic", titleWeight: 400, artX: 920, artY: 310, artScale: 2.5 },
    "dream-calm": { align: "center", width: 820, titleSize: 68, titleFont: "serif", titleStyle: "normal", titleWeight: 400, artX: 540, artY: 265, artScale: 2.2 },
    "strategy-calm": { align: "left", width: 730, titleSize: 64, titleFont: "sans", titleStyle: "normal", titleWeight: 500, uppercase: true, artX: 920, artY: 330, artScale: 2.3 },
    "strategy-bold": { align: "right", width: 700, titleSize: 66, titleFont: "sans", titleStyle: "normal", titleWeight: 500, artX: 155, artY: 340, artScale: 2.6 },
    "creator-calm": { align: "center", width: 790, titleSize: 70, titleFont: "serif", titleStyle: "italic", titleWeight: 400, artX: 540, artY: 285, artScale: 2.0 },
    "creator-bold": { align: "left", width: 760, titleSize: 72, titleFont: "serif", titleStyle: "normal", titleWeight: 500, artX: 910, artY: 270, artScale: 2.4 },
    "explorer-bold": { align: "right", width: 700, titleSize: 68, titleFont: "sans", titleStyle: "normal", titleWeight: 400, artX: 160, artY: 300, artScale: 2.7 },
    "explorer-calm": { align: "left", width: 680, titleSize: 72, titleFont: "serif", titleStyle: "italic", titleWeight: 400, artX: 920, artY: 390, artScale: 2.1 },
    "wit-bold": { align: "center", width: 850, titleSize: 66, titleFont: "sans", titleStyle: "normal", titleWeight: 600, uppercase: true, artX: 540, artY: 275, artScale: 2.5 },
    "wit-calm": { align: "right", width: 720, titleSize: 70, titleFont: "serif", titleStyle: "italic", titleWeight: 400, artX: 155, artY: 370, artScale: 2.2 },
    "optimism-bold": { align: "center", width: 800, titleSize: 72, titleFont: "sans", titleStyle: "normal", titleWeight: 500, uppercase: true, artX: 540, artY: 265, artScale: 2.8 },
    "optimism-calm": { align: "left", width: 740, titleSize: 68, titleFont: "serif", titleStyle: "normal", titleWeight: 400, artX: 910, artY: 320, artScale: 2.3 }
  };

  function resolveResult(answerIndexes) {
    if (!Array.isArray(answerIndexes) || answerIndexes.length !== QUESTIONS.length) {
      throw new RangeError("Answer all five questions to reveal an identity.");
    }

    const scores = Object.fromEntries(AXES.map((axis) => [axis, 0]));
    let energy = 0;
    const chosenAxes = answerIndexes.map((answerIndex, questionIndex) => {
      const answer = QUESTIONS[questionIndex].answers[answerIndex];
      if (!answer) throw new RangeError("An answer is outside the available choices.");
      scores[answer.axis] += 1;
      energy += answer.energy;
      return answer.axis;
    });

    const highestScore = Math.max(...Object.values(scores));
    const tiedAxes = AXES.filter((axis) => scores[axis] === highestScore);
    const leadingAxis = chosenAxes.find((axis) => tiedAxes.includes(axis)) || tiedAxes[0];
    const mood = energy >= 0 ? "bold" : "calm";
    const key = `${leadingAxis}-${mood}`;
    return { key, ...IDENTITIES[key] };
  }

  const section = document.getElementById("identity");
  const backgroundSections = [...document.querySelectorAll("main > section:not(#identity)")].map((element) => ({
    element,
    wasInert: element.inert
  }));
  const views = Object.fromEntries(
    [...section.querySelectorAll("[data-identity-view]")].map((view) => [view.dataset.identityView, view])
  );
  const viewHeadings = {
    intro: "identity-section-title",
    quiz: "identity-question",
    reveal: "identity-reveal-heading",
    profile: "identity-profile-title",
    share: "identity-share-title"
  };
  const questionLegend = document.getElementById("identity-question");
  const answersContainer = section.querySelector("[data-identity-answers]");
  const progress = section.querySelector("[data-identity-progress]");
  const counter = section.querySelector("[data-identity-counter]");
  const backButton = document.getElementById("identity-back");
  const backLabel = section.querySelector("[data-identity-back-label]");
  const exitButton = document.getElementById("identity-exit");
  const secretTrigger = section.querySelector("[data-identity-secret-trigger]");
  const secretMessage = section.querySelector("[data-identity-secret]");
  const card = document.getElementById("identity-card");
  const status = section.querySelector("[data-identity-status]");
  const revealTitle = section.querySelector("[data-identity-reveal-title]");
  const profileTitle = section.querySelector("[data-identity-profile-title]");
  const profileVisual = section.querySelector("[data-identity-visual]");
  let currentQuestion = 0;
  let answers = [];
  let currentView = "intro";
  let revealTimer = 0;
  let answerTimer = 0;
  let secretTimer = 0;
  let secretResetTimer = 0;
  let isTransitioning = false;
  let secretTapCount = 0;

  function renderQuestion(shouldFocus = true) {
    const question = QUESTIONS[currentQuestion];
    questionLegend.textContent = question.prompt;
    counter.textContent = `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / 05`;
    progress.value = currentQuestion + 1;
    progress.setAttribute("aria-valuetext", `Question ${currentQuestion + 1} of ${QUESTIONS.length}`);
    backLabel.textContent = currentQuestion === 0 ? "INTRO" : "PREVIOUS";
    answersContainer.replaceChildren(...question.answers.map((answer, answerIndex) => {
      const button = document.createElement("button");
      const marker = document.createElement("span");
      const text = document.createElement("span");
      const arrow = document.createElement("span");
      button.type = "button";
      button.className = "identity__answer";
      button.dataset.answer = String(answerIndex);
      button.setAttribute("aria-pressed", String(answers[currentQuestion] === answerIndex));
      if (answers[currentQuestion] === answerIndex) button.classList.add("is-selected");
      marker.className = "identity__answer-mark";
      marker.setAttribute("aria-hidden", "true");
      marker.textContent = String.fromCharCode(65 + answerIndex);
      text.className = "identity__answer-text";
      text.textContent = answer.text;
      arrow.className = "identity__answer-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "\u2197";
      button.append(marker, text, arrow);
      return button;
    }));
    if (shouldFocus) {
      (answersContainer.querySelector(".is-selected") || answersContainer.querySelector("button"))?.focus();
    }
  }

  function changeView(nextView, focusTarget) {
    const outgoing = views[currentView];
    const incoming = views[nextView];
    isTransitioning = true;
    outgoing.inert = true;
    outgoing.hidden = true;
    outgoing.classList.remove("is-leaving");
    incoming.hidden = false;
    incoming.inert = false;
    incoming.classList.remove("is-arriving");
    void incoming.offsetWidth;
    incoming.classList.add("is-arriving");
    currentView = nextView;
    section.dataset.scene = nextView;
    section.setAttribute("aria-labelledby", viewHeadings[nextView]);
    if (focusTarget) focusTarget.focus();
    isTransitioning = false;
  }

  function goToQuestion(questionIndex) {
    const fieldset = section.querySelector(".identity__fieldset");
    isTransitioning = false;
    fieldset.classList.remove("is-arriving");
    currentQuestion = questionIndex;
    renderQuestion(false);
    void fieldset.offsetWidth;
    fieldset.classList.add("is-arriving");
    (answersContainer.querySelector(".is-selected") || answersContainer.querySelector("button"))?.focus();
  }

  function onIdentityKeydown(event) {
    if (event.key === "Escape") {
      exitButton.click();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...section.querySelectorAll('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function setBackgroundInert(isInert) {
    backgroundSections.forEach(({ element, wasInert }) => {
      element.inert = isInert || wasInert;
    });
  }

  function revealEasterEgg() {
    secretTapCount += 1;
    window.clearTimeout(secretResetTimer);
    if (secretTapCount < 3) {
      secretResetTimer = window.setTimeout(() => { secretTapCount = 0; }, 1200);
      return;
    }

    secretTapCount = 0;
    secretMessage.hidden = false;
    secretMessage.classList.remove("is-visible");
    void secretMessage.offsetWidth;
    secretMessage.classList.add("is-visible");
    window.clearTimeout(secretTimer);
    secretTimer = window.setTimeout(() => {
      secretMessage.classList.remove("is-visible");
      secretTimer = window.setTimeout(() => { secretMessage.hidden = true; }, 250);
    }, 3200);
  }

  function makeResultText(result) {
    return `NEW YEAR 2027 / YOUR 2027 IDENTITY\n${result.title}\n\n${result.description}\n\nTHE 2027 FORECAST\n${result.prediction}\n\nMOTTO\n\u201c${result.motto}\u201d\n\nA just-for-fun forecast, made for what comes next.`;
  }

  function showResult() {
    const result = resolveResult(answers);
    section.dataset.identity = result.key;
    revealTitle.textContent = result.title;
    revealTitle.classList.remove("is-revealed");
    profileTitle.textContent = result.title;
    section.querySelector("[data-identity-profile-description]").textContent = result.description;
    section.querySelector("[data-identity-profile-prediction]").textContent = result.prediction;
    section.querySelector("[data-identity-profile-motto]").textContent = `\u201c${result.motto}\u201d`;
    section.style.setProperty("--identity-accent", result.accent);
    section.style.setProperty("--identity-glow", result.glow);
    section.style.setProperty("--identity-ground", result.ground);
    profileVisual.style.setProperty("--identity-accent", result.accent);
    profileVisual.style.setProperty("--identity-glow", result.glow);
    profileVisual.style.setProperty("--identity-ground", result.ground);
    profileVisual.dataset.motif = result.motif;
    card.dataset.identity = result.key;
    section.querySelector("[data-identity-name]").textContent = result.title;
    section.querySelector("[data-identity-description]").textContent = result.description;
    section.querySelector("[data-identity-prediction]").textContent = result.prediction;
    section.querySelector("[data-identity-motto]").textContent = `\u201c${result.motto}\u201d`;
    section.querySelector("[data-identity-sigil]").dataset.motif = result.motif;
    section.querySelector("[data-identity-edition]").textContent = "YOUR 2027 EDITION";
    status.textContent = "";
    changeView("reveal", revealTitle);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.clearTimeout(revealTimer);
    revealTimer = window.setTimeout(() => {
      revealTitle.classList.add("is-revealed");
      revealTimer = window.setTimeout(() => {
        changeView("profile", profileTitle);
      }, reducedMotion ? 350 : 1500);
    }, reducedMotion ? 0 : 450);
  }

  function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && context.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    lines.forEach((value, index) => context.fillText(value, x, y + index * lineHeight));
    return y + lines.length * lineHeight;
  }

  function drawSigil(context, motif, x, y, color, scale = 1) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    if (motif === "orbit" || motif === "ripple" || motif === "lantern") {
      context.ellipse(0, 0, 31, motif === "orbit" ? 17 : 26, motif === "orbit" ? -0.5 : 0, 0, Math.PI * 2);
      context.ellipse(0, 0, motif === "ripple" ? 16 : 9, motif === "ripple" ? 10 : 9, 0.4, 0, Math.PI * 2);
    } else if (motif === "grid" || motif === "map") {
      context.rect(-24, -24, 48, 48);
      context.moveTo(-8, -24); context.lineTo(-8, 24);
      context.moveTo(8, -24); context.lineTo(8, 24);
      context.moveTo(-24, -8); context.lineTo(24, -8);
      context.moveTo(-24, 8); context.lineTo(24, 8);
    } else if (motif === "compass" || motif === "prism") {
      context.moveTo(0, -31); context.lineTo(22, 0); context.lineTo(0, 31); context.lineTo(-22, 0); context.closePath();
      context.moveTo(0, -15); context.lineTo(9, 0); context.lineTo(0, 15); context.lineTo(-9, 0); context.closePath();
    } else if (motif === "horizon" || motif === "sunrise") {
      context.arc(0, 12, 24, Math.PI, 0);
      context.moveTo(-32, 12); context.lineTo(32, 12);
      context.moveTo(-22, 23); context.lineTo(22, 23);
      context.moveTo(-14, 32); context.lineTo(14, 32);
    } else if (motif === "spark" || motif === "frame") {
      context.rect(-24, -24, 48, 48);
      context.moveTo(-8, 0); context.lineTo(8, 0);
      context.moveTo(0, -8); context.lineTo(0, 8);
      context.moveTo(-16, -16); context.lineTo(16, 16);
      context.moveTo(16, -16); context.lineTo(-16, 16);
    } else {
      context.arc(0, 12, 25, Math.PI, 0);
      context.moveTo(-30, 12); context.lineTo(30, 12);
      context.moveTo(-20, 23); context.lineTo(20, 23);
    }
    context.stroke();
    context.restore();
  }

  async function downloadCard() {
    const result = resolveResult(answers);
    const layout = CARD_LAYOUTS[result.key];
    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    canvas.width = 2160;
    canvas.height = 2700;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineJoin = "round";
    const background = context.createLinearGradient(0, 0, 1080, 1350);
    background.addColorStop(0, result.ground);
    background.addColorStop(1, "#07070b");
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const light = context.createRadialGradient(850, 130, 12, 850, 130, 640);
    light.addColorStop(0, result.glow);
    light.addColorStop(1, "rgba(7, 7, 11, 0)");
    context.fillStyle = light;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const margin = 84;
    const right = 1080 - margin;
    context.strokeStyle = `${result.accent}70`;
    context.lineWidth = 1;
    context.strokeRect(54, 54, 972, 1242);
    context.strokeStyle = `${result.accent}35`;
    context.strokeRect(68, 68, 944, 1214);

    context.strokeStyle = `${result.accent}a0`;
    context.lineWidth = 1.5;
    context.strokeRect(margin, 91, 46, 46);
    context.fillStyle = result.accent;
    context.font = "400 31px 'Cormorant Garamond', Georgia, serif";
    context.textAlign = "center";
    context.fillText("N", margin + 23, 124);
    context.textAlign = "left";
    context.fillStyle = "#f1f0ed";
    context.font = "600 19px 'Space Grotesk', sans-serif";
    context.fillText("NEW YEAR", margin + 62, 111);
    context.fillStyle = result.accent;
    context.font = "500 15px 'Space Grotesk', sans-serif";
    context.fillText("/ 2027", margin + 62, 135);
    context.textAlign = "right";
    context.fillStyle = "#d0cfd2";
    context.font = "500 12px 'Space Grotesk', sans-serif";
    context.fillText("PERSONAL EDITION", right, 108);
    context.fillStyle = "#9695a0";
    context.font = "400 11px 'Space Grotesk', sans-serif";
    context.fillText("A FORECAST FOR WHAT COMES NEXT", right, 130);
    context.textAlign = "left";
    context.strokeStyle = `${result.accent}55`;
    context.beginPath();
    context.moveTo(margin, 170);
    context.lineTo(right, 170);
    context.stroke();

    context.save();
    context.globalAlpha = 0.58;
    drawSigil(context, result.motif, layout.artX, layout.artY, result.accent, layout.artScale);
    context.restore();

    const textX = layout.align === "left" ? margin : layout.align === "right" ? right : 540;
    const textWidth = layout.width;
    context.textAlign = layout.align;
    context.fillStyle = result.accent;
    context.font = "500 13px 'Space Grotesk', sans-serif";
    context.fillText("A NOTE FROM THE YEAR AHEAD", textX, 300);

    const title = layout.uppercase ? result.title.toUpperCase() : result.title;
    const titleFamily = layout.titleFont === "sans" ? "'Space Grotesk', sans-serif" : "'Cormorant Garamond', Georgia, serif";
    context.fillStyle = "#f1f0ed";
    context.font = `${layout.titleStyle} ${layout.titleWeight} ${layout.titleSize}px ${titleFamily}`;
    let y = wrapCanvasText(context, title, textX, 382, textWidth, layout.titleSize * 1.08);
    y += 14;
    context.fillStyle = "#d0cfd2";
    context.font = "400 22px 'Space Grotesk', sans-serif";
    y = wrapCanvasText(context, result.description, textX, y, textWidth, 34);

    const dividerY = y + 34;
    context.strokeStyle = `${result.accent}66`;
    context.beginPath();
    context.moveTo(layout.align === "left" ? margin : layout.align === "right" ? right - textWidth : 540 - textWidth / 2, dividerY);
    context.lineTo(layout.align === "left" ? margin + textWidth : layout.align === "right" ? right : 540 + textWidth / 2, dividerY);
    context.stroke();
    context.fillStyle = result.accent;
    context.font = "500 12px 'Space Grotesk', sans-serif";
    context.fillText("THE 2027 FORECAST", textX, dividerY + 28);
    context.fillStyle = "#d0cfd2";
    context.font = "400 20px 'Space Grotesk', sans-serif";
    y = wrapCanvasText(context, result.prediction, textX, dividerY + 64, textWidth, 31);

    const mottoY = Math.max(y + 48, 1050);
    context.strokeStyle = result.accent;
    context.lineWidth = 2;
    const mottoX = layout.align === "left" ? margin : layout.align === "right" ? right - textWidth : 540 - textWidth / 2;
    context.beginPath();
    context.moveTo(mottoX, mottoY - 38);
    context.lineTo(mottoX, mottoY + 24);
    context.stroke();
    context.fillStyle = result.accent;
    context.font = "italic 38px 'Cormorant Garamond', Georgia, serif";
    wrapCanvasText(context, `\u201c${result.motto}\u201d`, mottoX + 20, mottoY, textWidth - 20, 46);

    context.strokeStyle = `${result.accent}55`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(margin, 1220);
    context.lineTo(right, 1220);
    context.stroke();
    context.fillStyle = "#9695a0";
    context.font = "500 14px 'Space Grotesk', sans-serif";
    context.textAlign = "left";
    context.fillText("MADE FOR WHAT COMES NEXT", margin, 1252);
    context.fillStyle = result.accent;
    context.textAlign = "right";
    context.fillText("NEW YEAR / 27", right, 1252);
    context.textAlign = "left";

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("This browser could not create the identity card image.");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `new-year-2027-${result.key}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyResult() {
    const text = makeResultText(resolveResult(answers));
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fall through to the selection-based copy path.
      }
    }
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.setAttribute("readonly", "");
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.append(temporary);
    temporary.select();
    const copied = document.execCommand("copy");
    temporary.remove();
    if (!copied) throw new Error("Copy is not available in this browser.");
  }
  
  secretTrigger.addEventListener("click", revealEasterEgg);

  document.getElementById("identity-start").addEventListener("click", () => {
    window.clearTimeout(answerTimer);
    window.clearTimeout(revealTimer);
    isTransitioning = false;
    currentQuestion = 0;
    answers = [];
    delete section.dataset.identity;
    window.clearTimeout(secretTimer);
    window.clearTimeout(secretResetTimer);
    secretMessage.hidden = true;
    secretMessage.classList.remove("is-visible");
    secretTapCount = 0;
    status.textContent = "";
    section.classList.add("identity--active");
    section.setAttribute("role", "dialog");
    section.setAttribute("aria-modal", "true");
    document.body.classList.add("identity-open");
    setBackgroundInert(true);
    document.addEventListener("keydown", onIdentityKeydown);
    exitButton.hidden = false;
    renderQuestion(false);
    changeView("quiz", answersContainer.querySelector("button"));
  });

  answersContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (!button || isTransitioning) return;
    const selectedAnswer = Number(button.dataset.answer);
    if (answers[currentQuestion] !== selectedAnswer) answers.length = currentQuestion;
    answers[currentQuestion] = selectedAnswer;
    answersContainer.querySelectorAll("[data-answer]").forEach((answerButton) => {
      const selected = answerButton === button;
      answerButton.classList.toggle("is-selected", selected);
      answerButton.setAttribute("aria-pressed", String(selected));
    });
    isTransitioning = true;
    window.clearTimeout(answerTimer);
    answerTimer = window.setTimeout(() => {
      isTransitioning = false;
      if (currentQuestion === QUESTIONS.length - 1) {
        showResult();
        return;
      }
      goToQuestion(currentQuestion + 1);
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 150);
  });

  backButton.addEventListener("click", () => {
    if (isTransitioning) return;
    if (currentQuestion === 0) {
      changeView("intro", document.getElementById("identity-start"));
      return;
    }
    goToQuestion(currentQuestion - 1);
  });

  exitButton.addEventListener("click", () => {
    window.clearTimeout(answerTimer);
    window.clearTimeout(revealTimer);
    window.clearTimeout(secretTimer);
    window.clearTimeout(secretResetTimer);
    isTransitioning = false;
    Object.entries(views).forEach(([name, view]) => {
      view.hidden = name !== "intro";
      view.inert = name !== "intro";
      view.classList.remove("is-arriving", "is-leaving");
    });
    currentView = "intro";
    section.classList.remove("identity--active");
    section.removeAttribute("role");
    section.removeAttribute("aria-modal");
    section.setAttribute("aria-labelledby", viewHeadings.intro);
    document.body.classList.remove("identity-open");
    setBackgroundInert(false);
    document.removeEventListener("keydown", onIdentityKeydown);
    exitButton.hidden = true;
    delete section.dataset.identity;
    secretMessage.hidden = true;
    secretMessage.classList.remove("is-visible");
    secretTapCount = 0;
    document.getElementById("identity-start").focus();
  });

  document.getElementById("identity-to-card").addEventListener("click", () => {
    changeView("share", document.getElementById("identity-download"));
  });

  document.getElementById("identity-profile-back").addEventListener("click", () => {
    changeView("profile", document.getElementById("identity-to-card"));
  });

  document.getElementById("identity-edit-answers").addEventListener("click", () => {
    currentQuestion = QUESTIONS.length - 1;
    renderQuestion(false);
    changeView("quiz", answersContainer.querySelector(".is-selected") || answersContainer.querySelector("button"));
  });

  document.getElementById("identity-restart").addEventListener("click", () => {
    window.clearTimeout(answerTimer);
    window.clearTimeout(revealTimer);
    window.clearTimeout(secretTimer);
    window.clearTimeout(secretResetTimer);
    isTransitioning = false;
    currentQuestion = 0;
    answers = [];
    delete section.dataset.identity;
    secretMessage.hidden = true;
    secretMessage.classList.remove("is-visible");
    secretTapCount = 0;
    renderQuestion(false);
    status.textContent = "";
    changeView("intro", document.getElementById("identity-start"));
  });

  document.getElementById("identity-download").addEventListener("click", async () => {
    const button = document.getElementById("identity-download");
    button.disabled = true;
    status.textContent = "Preparing your card...";
    try {
      await downloadCard();
      status.textContent = "Your identity card is ready.";
    } catch (error) {
      status.textContent = error.message || "The card could not be downloaded.";
    } finally {
      button.disabled = false;
    }
  });

  document.getElementById("identity-copy").addEventListener("click", async () => {
    try {
      await copyResult();
      status.textContent = "Your result has been copied.";
    } catch {
      status.textContent = "Copy is unavailable here. You can still download your card.";
    }
  });

  window.NewYearIdentity = Object.freeze({
    questions: QUESTIONS.length,
    identities: Object.keys(IDENTITIES).length,
    resolveResult
  });
})();
