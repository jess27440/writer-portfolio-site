const state = {
  lang: "zh",
  slide: 0
};

const content = window.SITE_CONTENT;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function t(value) {
  if (typeof value === "string") return value;
  return value[state.lang] || value.zh || "";
}

function applyLanguage() {
  document.documentElement.lang = state.lang === "zh" ? "zh-Hant" : "en";
  $$("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = t(content.ui[key]);
  });
  $("[data-language-toggle]").textContent = state.lang === "zh" ? "EN" : "中文";
  renderDynamicSections();
  updateHero();
}

function updateHero() {
  const slides = content.gallery.filter((item) => item.hero);
  const active = slides[state.slide % slides.length];
  const image = $("[data-hero-image]");
  image.src = active.image;
  image.alt = t(active.alt);
  $("[data-hero-title]").textContent = t(active.title);
  $("[data-hero-meta]").textContent = active.meta;
}

function workCard(work) {
  const tags = work.tags.map((tag) => `<span class="tag">${t(tag)}</span>`).join("");
  return `
    <article class="work-card">
      <img src="${work.image}" alt="${t(work.imageAlt)}" loading="lazy">
      <div class="work-card-content">
        <p class="card-meta">${work.year} / ${t(work.platform)}</p>
        <h3>${t(work.title)}</h3>
        <p>${t(work.logline)}</p>
        <div class="tag-row">${tags}</div>
      </div>
    </article>
  `;
}

function galleryItem(item) {
  return `
    <figure class="gallery-item">
      <img src="${item.image}" alt="${t(item.alt)}" loading="lazy">
      <figcaption class="gallery-caption">${t(item.title)} / ${item.sourceLabel}</figcaption>
    </figure>
  `;
}

function characterCard(character) {
  return `
    <article class="character-card">
      <img src="${character.image}" alt="${t(character.alt)}" loading="lazy">
      <p class="card-meta">${t(character.work)}</p>
      <h3>${t(character.name)}</h3>
      <p>${t(character.note)}</p>
    </article>
  `;
}

function timelineItem(item) {
  return `
    <li>
      <strong>${item.year}</strong>
      <div>
        <p class="timeline-meta">${t(item.platform)}</p>
        <h3>${t(item.title)}</h3>
        <p>${t(item.note)}</p>
      </div>
    </li>
  `;
}

function videoCard(video) {
  return `
    <a class="video-card" href="${video.url}" target="_blank" rel="noreferrer">
      <img src="${video.thumbnail}" alt="${t(video.alt)}" loading="lazy">
      <div>
        <p class="card-meta">${video.sourceLabel}</p>
        <h3>${t(video.title)}</h3>
      </div>
    </a>
  `;
}

function pressCard(item) {
  return `
    <article class="press-card">
      <p class="source">${item.date} / ${item.publisher}</p>
      <h3>${t(item.title)}</h3>
      <p>${t(item.summary)}</p>
      <a href="${item.url}" target="_blank" rel="noreferrer">${t(content.ui.readSource)}</a>
    </article>
  `;
}

function renderDynamicSections() {
  $("[data-work-grid]").innerHTML = content.works.map(workCard).join("");
  $("[data-gallery-grid]").innerHTML = content.gallery.map(galleryItem).join("");
  $("[data-character-rail]").innerHTML = content.characters.map(characterCard).join("");
  $("[data-timeline]").innerHTML = content.timeline.map(timelineItem).join("");
  $("[data-video-grid]").innerHTML = content.videos.map(videoCard).join("");
  $("[data-press-list]").innerHTML = content.press.map(pressCard).join("");
}

function bindEvents() {
  $("[data-language-toggle]").addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : "zh";
    applyLanguage();
  });

  $("[data-slide-next]").addEventListener("click", () => {
    state.slide += 1;
    updateHero();
  });

  $("[data-slide-prev]").addEventListener("click", () => {
    const heroCount = content.gallery.filter((item) => item.hero).length;
    state.slide = (state.slide - 1 + heroCount) % heroCount;
    updateHero();
  });

  window.setInterval(() => {
    state.slide += 1;
    updateHero();
  }, 6200);
}

bindEvents();
applyLanguage();
