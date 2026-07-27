const nav = document.getElementById("nav");
const animationSection = document.getElementById("animation");
const animationStage = document.querySelector(".scrolly-sticky");
const frameWrap = document.querySelector(".frame-wrap");
const frameImage = document.getElementById("frame-image");
const bubbles = Array.from(document.querySelectorAll(".story-bubble"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const navLinks = nav ? nav.querySelector(".nav-links") : null;

if (nav && navLinks) {
  const menuButton = document.createElement("button");
  menuButton.className = "nav-menu-toggle";
  menuButton.type = "button";
  menuButton.setAttribute("aria-label", "Open navigation");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = "<span></span><span></span><span></span>";
  nav.insertBefore(menuButton, nav.querySelector(".button-small"));

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.addEventListener("click", () => {
    nav.classList.remove("nav-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  });
}

const frameCount = 288;

function frameUrl(index) {
  const number = String(index + 1).padStart(4, "0");
  return `media/frames/Law-Tie Landing Page_${number}.jpg`;
}

function preloadFrames() {
  if (!frameImage) return;

  for (let index = 0; index < frameCount; index += 1) {
    const image = new Image();
    image.src = frameUrl(index);
  }
}

function updateNavigation() {
  if (!nav) return;
  nav.classList.toggle("scrolled", window.scrollY > 20);
}

function updateFrameAnimation() {
  if (!animationSection || !animationStage || !frameWrap || !frameImage) return;

  const sectionRect = animationSection.getBoundingClientRect();
  const sectionTop = sectionRect.top + window.scrollY;
  const stageHeight = animationStage.offsetHeight;
  const stageTop = (window.innerHeight * 0.5) - (stageHeight / 2);
  const releaseGap = 96;
  const startScroll = sectionTop - stageTop + 2;
  const endScroll = sectionTop + sectionRect.height - releaseGap - stageHeight - stageTop;
  const totalScroll = Math.max(1, endScroll - startScroll);
  const currentScroll = window.scrollY - startScroll;
  const progress = Math.min(1, Math.max(0, currentScroll / totalScroll));
  const frameIndex = Math.round(progress * (frameCount - 1));
  const bubbleIndex = Math.min(bubbles.length - 1, Math.floor(progress * bubbles.length));
  const isPinned = window.scrollY >= startScroll && window.scrollY <= endScroll;
  const isAfter = window.scrollY > endScroll;

  animationStage.classList.toggle("is-pinned", isPinned);
  animationStage.classList.toggle("is-after", isAfter);
  frameImage.src = frameUrl(frameIndex);
  bubbles.forEach((bubble, index) => {
    bubble.classList.toggle("active", index === bubbleIndex);
  });
}

function updateReveals() {
  const trigger = window.innerHeight * 0.88;

  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < trigger) {
      item.classList.add("visible");
    }
  });
}

function updateStackCards() {
  const container = document.querySelector('.stack-cards-container');
  const cards = document.querySelectorAll('.stack-cards__item');
  const stack = document.querySelector('.stack-cards');
  const visuals = document.querySelector('.stack-visuals');
  const visualItems = document.querySelectorAll('.stack-visual');
  if (!container || cards.length === 0 || !stack || !visuals || visualItems.length === 0) return;

  const containerRect = container.getBoundingClientRect();
  const containerTop = containerRect.top + window.scrollY;
  
  const cardHeight = cards[0].getBoundingClientRect().height || 420;
  const stickyTop = (window.innerHeight * 0.5) - (cardHeight / 2);
  const startScroll = containerTop - stickyTop + 2;
  const endScroll = containerTop + containerRect.height - 80 - cardHeight - stickyTop;
  const totalScroll = Math.max(100, endScroll - startScroll);
  const currentScroll = window.scrollY - startScroll;

  const progress = Math.min(Math.max(0, currentScroll / totalScroll), 1);
  const activeCard = progress < 0.36 ? 0 : progress < 0.7 ? 1 : 2;
  const visualOrder = Array.from(cards).reverse();

  const isPinned = window.scrollY >= startScroll && window.scrollY <= endScroll;
  const isAfter = window.scrollY > endScroll;
  stack.classList.toggle('is-pinned', isPinned);
  stack.classList.toggle('is-after', isAfter);
  visuals.classList.toggle('is-pinned', isPinned);
  visuals.classList.toggle('is-after', isAfter);

  visualOrder.forEach((card, visualIndex) => {
    card.classList.remove('is-current', 'is-waiting', 'is-past');

    if (visualIndex < activeCard) {
      card.classList.add('is-past');
    } else if (visualIndex === activeCard) {
      card.classList.add('is-current');
    } else {
      card.classList.add('is-waiting');
    }
  });

  visualItems.forEach((image, index) => {
    image.classList.remove('is-current', 'is-waiting', 'is-past');

    if (index < activeCard) {
      image.classList.add('is-past');
    } else if (index === activeCard) {
      image.classList.add('is-current');
    } else {
      image.classList.add('is-waiting');
    }
  });
}

document.querySelectorAll(".chattie-avatar").forEach((avatar) => {
  let speechTimer;

  const showGreeting = () => {
    window.clearTimeout(speechTimer);
    avatar.classList.remove("is-speaking");
    void avatar.offsetWidth;
    avatar.classList.add("is-speaking");

    speechTimer = window.setTimeout(() => {
      avatar.classList.remove("is-speaking");
    }, 4200);
  };

  avatar.addEventListener("pointerenter", showGreeting);
  avatar.addEventListener("focus", showGreeting);
});

const tabletTime = document.querySelector("#tablet-time");

if (tabletTime) {
  const updateTabletTime = () => {
    tabletTime.textContent = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date());
  };

  updateTabletTime();
  window.setInterval(updateTabletTime, 30000);
}

const tabletSearch = document.querySelector("#tablet-app-search");
const tabletSearchResults = document.querySelector("#tablet-search-results");

if (tabletSearch && tabletSearchResults) {
  const searchOptions = Array.from(tabletSearchResults.querySelectorAll("[data-contact-app], [data-search-href]"));

  const closeTabletSearch = () => {
    tabletSearchResults.hidden = true;
    tabletSearch.setAttribute("aria-expanded", "false");
  };

  const updateTabletSearch = () => {
    const query = tabletSearch.value.trim().toLowerCase();

    searchOptions.forEach((option) => {
      const isMatch = option.textContent.toLowerCase().includes(query);
      option.hidden = query.length === 0;
      option.classList.toggle("is-search-match", query.length > 0 && isMatch);
      option.style.order = isMatch ? "0" : "1";
    });

    tabletSearchResults.hidden = query.length === 0;
    tabletSearch.setAttribute("aria-expanded", String(query.length > 0));
  };

  tabletSearch.addEventListener("input", updateTabletSearch);
  tabletSearch.addEventListener("keydown", (event) => {
    const visibleOptions = searchOptions.filter((option) => !option.hidden);

    if (event.key === "Escape") {
      closeTabletSearch();
    } else if (event.key === "ArrowDown" && visibleOptions.length > 0) {
      event.preventDefault();
      visibleOptions[0].focus();
    } else if (event.key === "Enter" && visibleOptions.length > 0) {
      event.preventDefault();
      visibleOptions[0].click();
    }
  });

  searchOptions.forEach((option) => {
    option.addEventListener("click", () => {
      if (option.dataset.searchHref) {
        window.location.href = option.dataset.searchHref;
        return;
      }

      const target = document.querySelector(`#${option.dataset.contactApp}`);
      tabletSearch.value = option.textContent.trim();
      closeTabletSearch();
      target?.focus();
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".tablet-search-wrap")) closeTabletSearch();
  });
}

window.addEventListener("scroll", () => {
  updateNavigation();
  updateFrameAnimation();
  updateReveals();
  updateStackCards();
}, { passive: true });

window.addEventListener("resize", () => {
  updateFrameAnimation();
  updateStackCards();
}, { passive: true });

preloadFrames();
updateNavigation();
updateFrameAnimation();
updateReveals();
updateStackCards();
