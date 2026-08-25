/* ============================================================
   RESTAURANTS PAGE — self-contained, reads CONFIG.restaurants only.
   Does not touch letters, itinerary, decisions, or notifications —
   this is a completely independent feature. Edit the restaurant
   list itself in config.js under CONFIG.restaurants.
   ============================================================ */
(function () {
  "use strict";

  const CATEGORY_ORDER = ["Italian", "American", "Mexican", "Cajun", "Breakfast", "Lunch", "Dessert"];
  const MEAL_FILTERS = [
    { value: "all", label: "All" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "dessert", label: "Dessert" }
  ];
  const WHEEL_COLORS = ["#8a2a49", "#d9a75c", "#b96a86", "#6c7c60", "#5e1c33", "#cf9a52"];

  let activeFilter = "all";
  let spinning = false;
  let currentRotation = 0;

  function restaurants() {
    return (typeof CONFIG !== "undefined" && Array.isArray(CONFIG.restaurants)) ? CONFIG.restaurants : [];
  }

  function filteredRestaurants() {
    if (activeFilter === "all") return restaurants();
    return restaurants().filter(r => Array.isArray(r.meals) && r.meals.indexOf(activeFilter) !== -1);
  }

  /* small mountain/pine mark reused from the itinerary page, for
     visual consistency between the two "card" pages */
  const CARD_FLOURISH = `
    <svg class="day-flourish" viewBox="0 0 100 34" aria-hidden="true">
      <polyline points="2,28 16,10 28,22 42,6 54,20 66,10 80,24 98,14" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" opacity="0.6"/>
      <polyline points="2,33 16,20 28,30 42,16 54,28 66,20 80,32 98,24" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" opacity="0.3"/>
      <line x1="24" y1="33" x2="24" y2="29.5" stroke="currentColor" stroke-width="1" opacity="0.9"/>
      <path d="M24 30 L19.3 24.2 L28.7 24.2 Z" fill="currentColor" opacity="0.9"/>
      <path d="M24 25.6 L20.3 20.6 L27.7 20.6 Z" fill="currentColor" opacity="0.9"/>
      <line x1="63" y1="33" x2="63" y2="30" stroke="currentColor" stroke-width="1" opacity="0.8"/>
      <path d="M63 30.5 L59.3 25.5 L66.7 25.5 Z" fill="currentColor" opacity="0.8"/>
    </svg>`;

  function renderList() {
    const el = document.getElementById("rest-list");
    if (!el) return;
    const all = restaurants();
    let html = "";
    CATEGORY_ORDER.forEach(cat => {
      const items = all.filter(r => r.category === cat);
      if (!items.length) return;
      html += `<div class="rest-block">
        <div class="rest-block-head">
          ${CARD_FLOURISH}
          <div class="rest-category">${cat}</div>
        </div>
        <div class="rest-items">`;
      items.forEach(r => {
        html += `<div class="rest-item">
          <div class="rest-name">${r.name}</div>
          <div class="rest-desc">${r.description || ""}</div>
        </div>`;
      });
      html += `</div></div>`;
    });
    el.innerHTML = html;
  }

  function renderFilters() {
    const el = document.getElementById("rest-filter-row");
    if (!el) return;
    el.innerHTML = MEAL_FILTERS.map(f =>
      `<button type="button" class="rest-filter-chip${f.value === activeFilter ? " active" : ""}" data-filter="${f.value}">${f.label}</button>`
    ).join("");
    el.querySelectorAll(".rest-filter-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        if (spinning) return;
        activeFilter = btn.getAttribute("data-filter");
        renderFilters();
        buildWheel();
        hideResult();
      });
    });
  }

  function buildWheel() {
    const disc = document.getElementById("wheel-disc");
    const spinBtn = document.getElementById("spin-btn");
    if (!disc) return;
    const list = filteredRestaurants();
    disc.style.transition = "none";
    currentRotation = currentRotation % 360;
    disc.style.transform = `rotate(${currentRotation}deg)`;

    if (!list.length) {
      disc.style.background = "var(--card-dim)";
      if (spinBtn) spinBtn.disabled = true;
      return;
    }
    if (spinBtn) spinBtn.disabled = false;

    const n = list.length;
    const slice = 360 / n;
    let stops = [];
    for (let i = 0; i < n; i++) {
      const color = WHEEL_COLORS[i % WHEEL_COLORS.length];
      stops.push(`${color} ${i * slice}deg ${(i + 1) * slice}deg`);
    }
    disc.style.background = `conic-gradient(${stops.join(", ")})`;
  }

  function hideResult() {
    const result = document.getElementById("wheel-result");
    const spinBtn = document.getElementById("spin-btn");
    if (result) result.hidden = true;
    if (spinBtn) spinBtn.hidden = false;
  }

  function spin() {
    if (spinning) return;
    const list = filteredRestaurants();
    if (!list.length) return;
    spinning = true;

    const disc = document.getElementById("wheel-disc");
    const spinBtn = document.getElementById("spin-btn");
    spinBtn.disabled = true;

    const n = list.length;
    const slice = 360 / n;
    const winnerIndex = Math.floor(Math.random() * n);

    // the pointer sits at the top (0deg / 12 o'clock). Slice i spans
    // [i*slice, (i+1)*slice) starting from 0deg going clockwise, so its
    // midpoint angle is (i + 0.5) * slice. Rotating the disc by R degrees
    // clockwise moves that point to (midpoint + R) mod 360, so we need
    // (midpoint + R) mod 360 === 0 for it to land under the pointer.
    const targetMid = (winnerIndex + 0.5) * slice;
    const baseTarget = (360 - targetMid) % 360; // R mod 360 we're aiming for
    let curMod = currentRotation % 360;
    if (curMod < 0) curMod += 360;
    const deltaToTarget = (baseTarget - curMod + 360) % 360;
    const extraSpins = 5 + Math.floor(Math.random() * 2); // 5-6 full turns
    const finalRotation = currentRotation + deltaToTarget + extraSpins * 360;

    disc.style.transition = "transform 3.6s cubic-bezier(0.17, 0.67, 0.2, 1)";
    // force reflow so the transition applies after the "none" set in buildWheel
    void disc.offsetHeight;
    disc.style.transform = `rotate(${finalRotation}deg)`;
    currentRotation = finalRotation;

    window.setTimeout(() => {
      spinning = false;
      showResult(list[winnerIndex]);
    }, 3700);
  }

  function showResult(item) {
    const result = document.getElementById("wheel-result");
    const nameEl = document.getElementById("wheel-result-name");
    const descEl = document.getElementById("wheel-result-desc");
    const spinBtn = document.getElementById("spin-btn");
    if (nameEl) nameEl.textContent = item.name;
    if (descEl) descEl.textContent = item.description || "";
    if (result) result.hidden = false;
    if (spinBtn) spinBtn.hidden = true;
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderList();
    renderFilters();
    buildWheel();

    const spinBtn = document.getElementById("spin-btn");
    const againBtn = document.getElementById("spin-again-btn");
    if (spinBtn) spinBtn.addEventListener("click", spin);
    if (againBtn) againBtn.addEventListener("click", hideResult);
  });
})();
