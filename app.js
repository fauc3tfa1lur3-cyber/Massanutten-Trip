/* ============================================================
   MASSANUTTEN ADVENTURE — APP LOGIC
   Reads everything from CONFIG (config.js). Do not put copy here.
   ============================================================ */

(function () {
  "use strict";

  // Bump this string every time app.js changes. Visible via ?admin=1 —
  // lets you tell a stale-cached copy on one device apart from an actual
  // clock/timezone disagreement when the same letter unlocks on one
  // device but not another.
  const SITE_VERSION = "2026-09-04-gradual-day-unlock-map-sync";

  const LS_PREFIX = "mnadv_";

  /* ---------------- TIME HELPERS ----------------
     Supports ?simDate=YYYY-MM-DDTHH:MM in the URL to preview the
     site as it will look on a future date. Harmless for normal
     visitors — only used when you add the param yourself. */
  function getNow() {
    const params = new URLSearchParams(window.location.search);
    const sim = params.get("simDate");
    if (sim) {
      const d = parseDate(sim);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }

  function parseDate(str) {
    // Manually parse "YYYY-MM-DDTHH:MM" (seconds optional) and anchor it
    // to CONFIG.timezoneOffsetHours (a FIXED timezone — Eastern, since
    // the trip is in Virginia) rather than the visitor's own device
    // timezone. Two reasons this matters:
    //   1. `new Date(y, mo, d, h, mi)` resolves in whatever timezone the
    //      device itself is set to — if two phones have different TZ
    //      settings (wrong auto-detected zone, manually misconfigured,
    //      etc.), the "same" unlock time lands at two different real
    //      moments. Anchoring to one fixed offset keeps every device in
    //      sync regardless of its own clock/TZ settings.
    //   2. Some browsers (notably Safari/iOS) unreliably parse ISO
    //      date-time strings that omit seconds/offset via `new Date(str)`,
    //      silently returning an Invalid Date. Parsing components
    //      ourselves avoids that entirely.
    const m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return new Date(str); // fallback for any unexpected format
    const [, y, mo, d, h, mi, s] = m;
    const offsetHours = (typeof CONFIG !== "undefined" && typeof CONFIG.timezoneOffsetHours === "number")
      ? CONFIG.timezoneOffsetHours
      : 4; // default: Eastern Daylight Time (UTC-4)
    return new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s || 0)) + offsetHours * 60 * 60 * 1000);
  }

  function isPast(dateStr) {
    return getNow().getTime() >= parseDate(dateStr).getTime();
  }

  function isFuture(dateStr) {
    return !isPast(dateStr);
  }

  function daysUntil(dateStr) {
    const now = getNow();
    const target = parseDate(dateStr);
    const ms = target.getTime() - now.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  function formatCountdownDays() {
    const d = daysUntil(CONFIG.trip.startDate);
    return d;
  }

  // Formats a config timestamp for display, always in the fixed trip
  // timezone (America/New_York) — NOT the viewing device's own timezone —
  // so the date/time shown reads the same on every device, same as the
  // underlying unlock logic in parseDate().
  function formatUnlock(dateStr) {
    const d = parseDate(dateStr);
    if (isNaN(d.getTime())) return "";
    try {
      return d.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit"
      });
    } catch (e) {
      return d.toString();
    }
  }

  /* ---------------- LOCALSTORAGE ---------------- */
  function lsGet(key) {
    try { return localStorage.getItem(LS_PREFIX + key); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(LS_PREFIX + key, val); } catch (e) { /* ignore */ }
  }

  function isOpened(letterId) {
    return lsGet("opened_" + letterId) === "1";
  }
  function markOpened(letterId) {
    lsSet("opened_" + letterId, "1");
  }

  function getChoice(choiceKey) {
    return lsGet("choice_" + choiceKey);
  }
  function setChoice(choiceKey, value) {
    if (getChoice(choiceKey)) return false; // already locked, no overwrite
    lsSet("choice_" + choiceKey, value);
    lsSet("choice_" + choiceKey + "_time", getNow().toISOString());
    return true;
  }

  /* ---------------- LETTER STATE ---------------- */
  function letterStatus(letter) {
    if (isFuture(letter.unlock)) return "locked";
    if (letter.type === "choice") {
      const chosen = getChoice(letter.choiceKey);
      if (chosen) return "opened"; // still show as opened envelope on map
    }
    return isOpened(letter.id) ? "opened" : "unlocked";
  }

  /* ---------------- MAP RENDERING (index.html) ----------------
     Vertical timeline built from Tailwind utility classes. Each
     "row" is an icon marker attached to a vertical line, plus a
     card with the title/status to its right. */

  function iconForLetter(letter) {
    if (letter.type === "useless") return "🗒";
    if (letter.type === "choice") return "🗝";
    if (letter.type === "riddle") return "🪶";
    return "✉";
  }

  const ICON_BASE = "relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full text-lg border-2 transition-transform duration-200";
  const CARD_BASE = "flex-1 min-w-0 rounded-xl border px-4 py-3 transition-all duration-200";

  const STATE_STYLES = {
    locked: {
      icon: "border-white/10 bg-white/5 text-white/25",
      card: "border-white/10 bg-white/5 text-white/40"
    },
    unlocked: {
      icon: "border-gold-400 bg-gold-500 text-ink shadow-[0_0_0_5px_rgba(217,167,92,0.18)] animate-pulse cursor-pointer",
      card: "border-gold-400/60 bg-card text-ink shadow-lg shadow-black/30 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl"
    },
    opened: {
      icon: "border-wine-400 bg-wine-600 text-rose-100 cursor-pointer",
      card: "border-wine-400/30 bg-card/95 text-ink/90 cursor-pointer hover:-translate-y-0.5"
    },
    landmark: {
      icon: "border-gold-400/70 bg-canvas-soft text-gold-300",
      card: "border-transparent bg-transparent text-rose-100/85 !px-1 !py-1.5 shadow-none"
    },
    toggle: {
      icon: "border-gold-400/70 bg-canvas-soft text-gold-300 cursor-pointer",
      card: "border-gold-400/60 bg-white/5 text-rose-100/85 cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
    },
    chosenPending: {
      icon: "border-rose-300 bg-rose-400 text-ink",
      card: "border-rose-300/50 bg-card/95 text-ink"
    },
    revealed: {
      icon: "border-gold-400 bg-gold-500 text-ink",
      card: "border-gold-400/60 bg-card text-ink"
    },
    anchor: {
      icon: "border-gold-400 bg-gold-500 text-ink text-xl",
      card: "border-transparent bg-transparent text-gold-100 font-semibold !px-1 !py-1.5 shadow-none"
    }
  };

  function row({ icon, eyebrow, title, sub, state, attrs }) {
    const s = STATE_STYLES[state] || STATE_STYLES.locked;
    const attrStr = attrs || "";
    return `<div class="relative flex items-start gap-4 mb-9 last:mb-0" ${attrStr}>
      <div class="${ICON_BASE} ${s.icon}">${icon}</div>
      <div class="${CARD_BASE} ${s.card}">
        ${eyebrow ? `<div class="text-[10px] font-bold uppercase tracking-wider ${state === 'landmark' || state === 'anchor' ? 'text-gold-400/80' : 'text-wine-500'} mb-0.5">${eyebrow}</div>` : ""}
        <div class="font-display text-lg leading-snug ${state === 'landmark' ? '' : 'font-semibold'}">${title}</div>
        ${sub ? `<div class="text-xs mt-1 ${state === 'landmark' || state === 'anchor' ? 'text-rose-100/60' : 'text-ink-soft'}">${sub}</div>` : ""}
      </div>
    </div>`;
  }

  function timelineWrap(innerHTML) {
    return `<div class="relative pl-1">
      <div class="absolute left-[27px] top-1 bottom-1 w-[2px] bg-gradient-to-b from-gold-400/50 via-rose-300/25 to-transparent rounded-full"></div>
      ${innerHTML}
    </div>`;
  }

  function dayGroupHTML(title, innerHTML) {
    return `<section class="mb-10">
      <div class="inline-block mb-5 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-display text-base text-rose-100">${title}</div>
      ${timelineWrap(innerHTML)}
    </section>`;
  }

  function landmarkRow(icon, label) {
    return row({ icon, title: label, state: "landmark" });
  }

  function anchorRow(icon, label) {
    return row({ icon, title: label, state: "anchor" });
  }

  function letterRow(letter) {
    const status = letterStatus(letter);
    const attrs = `data-letter="${letter.id}" data-status="${status}" tabindex="0" role="button" aria-label="${status === 'locked' ? 'Locked letter' : letter.title}"`;

    const unlockStamp = formatUnlock(letter.unlock);

    if (status === "locked") {
      const d = daysUntil(letter.unlock);
      const dayPart = d > 0 ? `Unlocks in ${d} ${d === 1 ? "day" : "days"}` : "Unlocks soon";
      return row({
        icon: "🔒", title: "???",
        sub: unlockStamp ? `${dayPart} · ${unlockStamp}` : dayPart,
        state: "locked", attrs
      });
    }

    const icon = iconForLetter(letter);
    let eyebrow = letter.type === "choice" ? "Decision" : null;
    let sub = unlockStamp ? `Unlocked ${unlockStamp}` : null;
    if (letter.type === "choice" && status === "opened") {
      const chosen = getChoice(letter.choiceKey);
      eyebrow = "Decision · Locked In";
      sub = chosen ? `You chose ${chosen}${unlockStamp ? ` · Unlocked ${unlockStamp}` : ""}` : sub;
    }

    const isNew = status === "unlocked";
    const titleHTML = letter.title + (isNew ? ` <span class="new-badge">NEW</span>` : "");

    return row({
      icon, title: titleHTML, eyebrow, sub,
      state: status === "opened" ? "opened" : "unlocked",
      attrs
    });
  }

  function choiceRow(choiceKey, fallbackLabel) {
    const chosen = getChoice(choiceKey);
    if (!chosen) {
      return row({ icon: "🔒", title: "???", sub: fallbackLabel || "Decision pending", state: "locked" });
    }
    let revealed = false, revealLabel = chosen;
    CONFIG.itinerary.days.forEach(day => {
      day.items.forEach(item => {
        if (item.choiceKey === choiceKey && isPast(item.revealAt)) {
          revealed = true;
          const opt = item.options[chosen];
          if (opt) revealLabel = opt.mapReveal || chosen;
        }
      });
    });
    return row({
      icon: revealed ? "🌟" : "🔖",
      title: revealed ? revealLabel : `Chosen: ${chosen}`,
      sub: revealed ? null : "Details reveal morning-of",
      state: revealed ? "revealed" : "chosenPending"
    });
  }

  function secretRow(itemId) {
    let node = null;
    CONFIG.itinerary.days.forEach(day => {
      day.items.forEach(item => { if (item.id === itemId) node = item; });
    });
    if (!node) return "";
    if (isPast(node.revealAt)) {
      return row({ icon: "🌟", title: node.mapReveal || node.label, state: "revealed" });
    }
    return row({ icon: "🔒", title: "???", sub: "Still under wraps", state: "locked" });
  }

  const OPENED_COLLAPSE_KEY = "openedCollapsed";

  function isOpenedCollapsed() {
    // default: expanded, so already-read letters stay easy to reopen
    // and revisit instead of disappearing behind a toggle he has to
    // remember exists. He can still collapse them himself if the list
    // gets long.
    return lsGet(OPENED_COLLAPSE_KEY) === "1";
  }

  function renderPreTripMap(container) {
    const opened = [];
    const rest = []; // locked + unlocked (unread) — always shown, never collapsed
    CONFIG.letters.forEach(letter => {
      (letterStatus(letter) === "opened" ? opened : rest).push(letter);
    });

    let inner = anchorRow("🏳", "Start");

    if (opened.length) {
      const collapsed = isOpenedCollapsed();
      inner += row({
        icon: collapsed ? "▸" : "▾",
        title: `${opened.length} letter${opened.length === 1 ? "" : "s"} already opened`,
        sub: collapsed ? "Tap to show them again" : "Tap to hide",
        state: "toggle",
        attrs: `data-toggle-opened="1" tabindex="0" role="button" aria-label="Toggle opened letters" aria-expanded="${!collapsed}"`
      });
      if (!collapsed) {
        opened.forEach(letter => { inner += letterRow(letter); });
      }
    }

    rest.forEach(letter => { inner += letterRow(letter); });

    const itinLocked = isFuture(CONFIG.itinerary.unlocksAt);
    inner += row({
      icon: itinLocked ? "🔒" : "🗺",
      title: "Itinerary",
      sub: itinLocked ? "Unlocks the morning we leave" : "Open the full itinerary",
      state: itinLocked ? "locked" : "revealed",
      attrs: `data-itin-link="1" tabindex="0" role="button" aria-label="Itinerary"`
    });
    container.innerHTML = dayGroupHTML("The Path So Far", inner);
  }

  // Mirrors choiceRow(), but scoped to ONE specific itinerary item rather
  // than "whichever item currently matches this choiceKey". This matters
  // because a single choiceKey (e.g. "mondayFinal") can be reused across
  // two different itinerary items with inverted options (see sat-attraction
  // / mon-final) — resolving by item, not by key, keeps each row showing
  // its own reveal state/label instead of borrowing the other item's.
  function itineraryChoiceRow(item) {
    const chosen = getChoice(item.choiceKey);
    if (!chosen) {
      return row({ icon: "🔒", title: "???", sub: item.label || "Decision pending", state: "locked" });
    }
    if (isPast(item.revealAt)) {
      const opt = item.options[chosen];
      const label = opt ? (opt.mapReveal || chosen) : chosen;
      return row({ icon: "🌟", title: label, state: "revealed" });
    }
    return row({
      icon: "🔖",
      title: `Chosen: ${chosen}`,
      sub: "Details reveal morning-of",
      state: "chosenPending"
    });
  }

  function itineraryRow(item) {
    if (!item.secret) {
      if (item.id === "mon-home") return anchorRow(item.icon || "🚗", item.label);
      return landmarkRow(item.icon || "•", item.label);
    }
    if (item.choiceKey) return itineraryChoiceRow(item);
    return secretRow(item.id);
  }

  // Once the trip starts, the map switches from "letters only" to a
  // day-by-day view built straight from CONFIG.itinerary — one section
  // per trip day, in order, each showing its itinerary items PLUS any
  // letters that unlock sometime during that calendar day. A day's
  // section only appears once that day has actually begun, so nothing
  // shows up early.
  const TRIP_DAY_IDS = ["friday", "saturday", "sunday", "monday"];

  function renderTripMap(container) {
    // Each day's section on the map appears at that day's own configured
    // unlocksAt (e.g. Saturday's block at Friday 8 PM, not Saturday
    // midnight) — same gating itinerary.html uses for its day-blocks, so
    // the map and the full itinerary always agree on when a day reveals.
    // Falls back to midnight-of-that-day if a day is ever missing its own
    // unlocksAt, so nothing breaks if one gets left blank.
    const dayStarts = TRIP_DAY_IDS.map((id, i) => {
      const dayConfig = CONFIG.itinerary.days.find(d => d.id === id);
      if (dayConfig && dayConfig.unlocksAt) return parseDate(dayConfig.unlocksAt);
      return new Date(parseDate(CONFIG.trip.startDate).getTime() + i * 24 * 60 * 60 * 1000);
    });

    function lettersForDay(i) {
      const from = dayStarts[i].getTime();
      const to = i + 1 < dayStarts.length ? dayStarts[i + 1].getTime() : Infinity;
      return CONFIG.letters.filter(letter => {
        const t = parseDate(letter.unlock).getTime();
        return t >= from && t < to;
      });
    }

    const now = getNow();
    let html = "";

    // Letters that unlocked before the trip began (the pretrip "Open When"
    // letters) don't stop existing just because the trip started — he can
    // still get back to any of them here. Collapsed by default since there
    // can be dozens; the toggle (shared with the pretrip map's same control)
    // remembers his last choice either way.
    const preTripLetters = CONFIG.letters.filter(letter => parseDate(letter.unlock).getTime() < dayStarts[0].getTime());
    if (preTripLetters.length) {
      const collapsed = isOpenedCollapsed();
      let pre = row({
        icon: collapsed ? "▸" : "▾",
        title: `${preTripLetters.length} letter${preTripLetters.length === 1 ? "" : "s"} from before the trip`,
        sub: collapsed ? "Tap to show them again" : "Tap to hide",
        state: "toggle",
        attrs: `data-toggle-opened="1" tabindex="0" role="button" aria-label="Toggle earlier letters" aria-expanded="${!collapsed}"`
      });
      if (!collapsed) {
        preTripLetters.forEach(letter => { pre += letterRow(letter); });
      }
      html += dayGroupHTML("Before the Trip", pre);
    }

    for (let i = 0; i < TRIP_DAY_IDS.length; i++) {
      if (now.getTime() < dayStarts[i].getTime()) break; // this day hasn't arrived yet

      const dayConfig = CONFIG.itinerary.days.find(d => d.id === TRIP_DAY_IDS[i]);
      if (!dayConfig) continue;

      let inner = i === 0 ? anchorRow("🏳", "Start") : "";
      dayConfig.items.forEach(item => { inner += itineraryRow(item); });
      lettersForDay(i).forEach(letter => { inner += letterRow(letter); });

      html += dayGroupHTML(dayConfig.label, inner);
    }

    container.innerHTML = html;
  }

  function renderMap() {
    const container = document.getElementById("map-container");
    if (!container) return;
    if (isPast(CONFIG.trip.startDate)) {
      renderTripMap(container);
    } else {
      renderPreTripMap(container);
    }
    attachMapHandlers();
  }

  function attachMapHandlers() {
    document.querySelectorAll("[data-letter]").forEach(el => {
      el.addEventListener("click", () => openLetterById(el.getAttribute("data-letter")));
      el.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") openLetterById(el.getAttribute("data-letter"));
      });
    });
    document.querySelectorAll("[data-itin-link]").forEach(el => {
      el.addEventListener("click", () => { window.location.href = "itinerary.html"; });
      el.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") window.location.href = "itinerary.html";
      });
    });
    document.querySelectorAll("[data-toggle-opened]").forEach(el => {
      const toggle = () => {
        lsSet(OPENED_COLLAPSE_KEY, isOpenedCollapsed() ? "0" : "1");
        renderMap();
      };
      el.addEventListener("click", toggle);
      el.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") toggle();
      });
    });
  }

  /* ---------------- LETTER MODAL ---------------- */
  function openLetterById(id) {
    const letter = CONFIG.letters.find(l => l.id === id);
    if (!letter) return;
    if (isFuture(letter.unlock)) return; // locked, do nothing

    if (letter.type !== "choice") markOpened(letter.id);

    const overlay = document.getElementById("modal-overlay");
    const card = document.getElementById("letter-card");
    card.innerHTML = buildLetterInnerHTML(letter);
    overlay.classList.add("active");
    attachLetterHandlers(letter);

    // re-render map in background so envelope flips to "opened" once modal closes
    overlay.dataset.pendingRerender = "1";
  }

  function buildLetterInnerHTML(letter) {
    let kicker = "";
    if (letter.type === "riddle") kicker = `<div class="letter-kicker">A Riddle</div>`;
    if (letter.type === "story") kicker = `<div class="letter-kicker">Open When</div>`;

    let inner = `<button class="letter-close" aria-label="Close">&times;</button>`;

    if (letter.type === "choice") {
      inner += buildChoiceLetterHTML(letter);
    } else {
      inner += `${kicker}<h2 class="letter-title">${letter.title}</h2><div class="letter-body">`;
      // A body entry that's itself an array renders as a bullet list
      // instead of a paragraph — lets a letter mix prose with a skimmable
      // list (e.g. stops along a route) without any extra config fields.
      letter.body.forEach(p => {
        if (Array.isArray(p)) {
          inner += `<ul class="letter-list">${p.map(li => `<li>${li}</li>`).join("")}</ul>`;
        } else {
          inner += `<p>${p}</p>`;
        }
      });
      inner += `</div>`;
      // riddles keep their answer hidden until he clicks to reveal it
      if (letter.type === "riddle" && letter.answer) {
        inner += `<div class="riddle-answer-wrap">
          <button class="riddle-reveal-btn" type="button">Reveal the Answer</button>
          <div class="riddle-answer" hidden>${letter.answer}</div>
        </div>`;
      }
    }
    return inner;
  }

  function buildChoiceLetterHTML(letter) {
    const chosen = getChoice(letter.choiceKey);
    const deadlinePassed = isPast(letter.deadline);
    const deadlineDate = parseDate(letter.deadline);
    const deadlineStr = deadlineDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

    let html = `<div class="decision-flag">Decision Required</div>`;
    html += `<h2 class="letter-title">${letter.title}</h2>`;
    html += `<div class="deadline-line ${deadlinePassed && !chosen ? 'expired' : ''}">Deadline: ${deadlineStr}</div>`;
    html += `<div class="letter-body">`;
    letter.intro.forEach(p => { html += `<p>${p}</p>`; });
    html += `</div>`;

    if (chosen) {
      html += `<div class="locked-choice-box">${letter.lockedMessage(chosen)}</div>`;
    } else if (deadlinePassed) {
      html += `<div class="locked-choice-box">${letter.expiredMessage}</div>`;
    } else {
      html += `<div class="choice-row">`;
      letter.options.forEach(opt => {
        html += `<button class="choice-btn" data-choice-value="${opt.value}" data-choice-key="${letter.choiceKey}">${opt.label}</button>`;
      });
      html += `</div>`;
    }
    return html;
  }

  function attachLetterHandlers(letter) {
    const overlay = document.getElementById("modal-overlay");
    overlay.querySelector(".letter-close").addEventListener("click", closeLetterModal);

    overlay.querySelectorAll(".choice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-choice-key");
        const value = btn.getAttribute("data-choice-value");
        const ok = setChoice(key, value);
        if (ok) {
          // rebuild the same letter to show locked state
          const card = document.getElementById("letter-card");
          card.innerHTML = buildLetterInnerHTML(letter);
          attachLetterHandlers(letter);
        }
      });
    });

    const revealBtn = overlay.querySelector(".riddle-reveal-btn");
    if (revealBtn) {
      revealBtn.addEventListener("click", () => {
        const answerEl = overlay.querySelector(".riddle-answer");
        if (answerEl) answerEl.hidden = false;
        revealBtn.hidden = true;
      });
    }
  }

  function closeLetterModal() {
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("active");
    if (overlay.dataset.pendingRerender === "1") {
      overlay.dataset.pendingRerender = "0";
      renderMap();
      renderNotifBell();
    }
  }

  /* ---------------- COUNTDOWN ---------------- */
  function renderCountdown() {
    const el = document.getElementById("countdown-number");
    const labelEl = document.getElementById("countdown-label");
    const subEl = document.getElementById("countdown-sub");
    if (!el) return;

    const now = getNow();
    const start = parseDate(CONFIG.trip.startDate);
    const end = parseDate(CONFIG.trip.endDate);

    if (now < start) {
      const d = daysUntil(CONFIG.trip.startDate);
      el.textContent = d;
      labelEl.textContent = d === 1 ? "day until Massanutten" : "days until Massanutten";
      if (subEl) subEl.textContent = "Something is being planned for you.";
    } else if (now >= start && now <= end) {
      el.textContent = "♥";
      labelEl.textContent = "we're here";
      if (subEl) subEl.textContent = "Check the itinerary for what's next.";
    } else {
      el.textContent = "✓";
      labelEl.textContent = "the adventure happened";
      if (subEl) subEl.textContent = "Hope it was a good one.";
    }
  }

  /* ---------------- ITINERARY PAGE ---------------- */
  function itemStatus(item) {
    if (!item.secret) return "available";
    if (item.choiceKey) {
      const chosen = getChoice(item.choiceKey);
      if (!chosen) return "locked";
      if (isPast(item.revealAt)) return "revealed";
      return "chosen";
    }
    if (isPast(item.revealAt)) return "revealed";
    return "locked";
  }

  function itemDisplayDetail(item, status) {
    if (status === "revealed") {
      if (item.choiceKey) {
        const chosen = getChoice(item.choiceKey);
        const opt = item.options[chosen];
        return opt ? opt.detail : item.detail;
      }
      return item.detail;
    }
    if (status === "chosen") {
      const chosen = getChoice(item.choiceKey);
      return `You chose ${chosen}. ${item.lockedHint || "Details reveal soon."}`;
    }
    if (status === "locked") {
      return item.lockedHint || "Still locked.";
    }
    return item.detail || "";
  }

  function itemDisplayLabel(item, status) {
    if (status === "locked") return item.lockedLabel || item.label;
    return item.label;
  }

  function iconForStatus(status) {
    switch (status) {
      case "available": return "◦";
      case "completed": return "✓";
      case "locked": return "🔒";
      case "chosen": return "🔖";
      case "revealed": return "🌟";
      default: return "◦";
    }
  }

  function renderItinerary() {
    const lockScreen = document.getElementById("itin-lock-screen");
    const content = document.getElementById("itin-content");
    if (!content) return;

    if (isFuture(CONFIG.itinerary.unlocksAt)) {
      lockScreen.style.display = "block";
      content.style.display = "none";
      const d = daysUntil(CONFIG.itinerary.unlocksAt);
      const dEl = document.getElementById("itin-lock-days");
      if (dEl) dEl.textContent = d > 0 ? `Unlocks in ${d} ${d === 1 ? "day" : "days"}.` : "Unlocks very soon.";
      return;
    }

    lockScreen.style.display = "none";
    content.style.display = "block";

    // small stationery-style flourish reused per day card — a thin-line
    // mountain ridge (echoing the page's own watermark) with two small
    // pines standing at the base
    const DAY_FLOURISH = `
      <svg class="day-flourish" viewBox="0 0 100 34" aria-hidden="true">
        <polyline points="2,28 16,10 28,22 42,6 54,20 66,10 80,24 98,14" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round" opacity="0.6"/>
        <polyline points="2,33 16,20 28,30 42,16 54,28 66,20 80,32 98,24" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round" opacity="0.3"/>
        <line x1="24" y1="33" x2="24" y2="29.5" stroke="currentColor" stroke-width="1" opacity="0.9"/>
        <path d="M24 30 L19.3 24.2 L28.7 24.2 Z" fill="currentColor" opacity="0.9"/>
        <path d="M24 25.6 L20.3 20.6 L27.7 20.6 Z" fill="currentColor" opacity="0.9"/>
        <line x1="63" y1="33" x2="63" y2="30" stroke="currentColor" stroke-width="1" opacity="0.8"/>
        <path d="M63 30.5 L59.3 25.5 L66.7 25.5 Z" fill="currentColor" opacity="0.8"/>
      </svg>`;

    let html = "";
    CONFIG.itinerary.days.forEach(day => {
      html += `<div class="day-block">
        <div class="day-head">
          ${DAY_FLOURISH}
          <div class="day-name">${day.label}</div>
          <div class="day-date">${day.date}</div>
        </div>
        <div class="day-body">
          <div class="day-divider" aria-hidden="true"></div>
          <div class="day-items">`;

      // A day can stay hidden as a whole (not just its individual secret
      // items) until an evening-before unlock time, so the itinerary fills
      // in gradually as the trip goes rather than showing every day at
      // once from the moment the page unlocks.
      if (day.unlocksAt && isFuture(day.unlocksAt)) {
        html += `<div class="itin-item locked">
          <div class="itin-icon">🔒</div>
          <div class="itin-text">
            <div class="itin-label">Not yet</div>
            <div class="itin-detail">This day unlocks ${formatUnlock(day.unlocksAt)}.</div>
          </div>
        </div>`;
        html += `</div></div></div>`;
        return;
      }

      day.items.forEach(item => {
        let status = itemStatus(item);
        const label = itemDisplayLabel(item, status);
        const detail = itemDisplayDetail(item, status);
        const chipClass = status === "available" ? "" : status;
        // non-secret items can supply their own flavor icon (e.g. 🚗, ☀️, 🌿) —
        // "" hides it entirely. Secret/choice items always use the computed
        // status icon (🔒/🌟/etc.) so lock/reveal state stays honest.
        const icon = (status === "available" && item.icon !== undefined) ? item.icon : iconForStatus(status);
        const iconHtml = icon ? `<div class="itin-icon">${icon}</div>` : `<div class="itin-icon itin-icon-empty" aria-hidden="true"></div>`;
        html += `<div class="itin-item ${status}">
          ${iconHtml}
          <div class="itin-text">
            <div class="itin-label">${label}${chipClass ? `<span class="chip ${chipClass}">${status}</span>` : ""}</div>
            ${detail ? `<div class="itin-detail">${detail}</div>` : ""}
          </div>
        </div>`;
      });
      html += `</div></div></div>`;
    });
    content.innerHTML = html;
  }

  /* ---------------- ADMIN PANEL (?admin=1) ---------------- */
  function maybeRenderAdmin() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") !== "1") return;
    const panel = document.createElement("div");
    panel.className = "admin-panel";

    // --- diagnostics: helps tell apart "stale cached code on this
    // device" vs "this device's clock/timezone disagrees with the fixed
    // trip timezone" when a letter unlocks on one device but not another ---
    let text = "ADMIN VIEW — diagnostics:\n\n";
    text += `Site build: ${typeof SITE_VERSION !== "undefined" ? SITE_VERSION : "(no SITE_VERSION found — very old cached copy)"}\n`;
    text += `Timezone offset in use: ${typeof CONFIG.timezoneOffsetHours === "number" ? CONFIG.timezoneOffsetHours : "(missing — old cached config.js)"}\n`;
    const rawNow = new Date();
    text += `This device's raw clock: ${rawNow.toString()}\n`;
    text += `Computed "now" the site is using: ${getNow().toString()}\n`;
    text += `\nLetter unlock check (should read the same real moment on every device):\n`;
    CONFIG.letters.forEach(l => {
      const target = parseDate(l.unlock);
      text += `  ${l.id}: unlock="${l.unlock}" -> parsed=${isNaN(target.getTime()) ? "INVALID DATE" : target.toString()} -> ${isPast(l.unlock) ? "PAST (should be unlocked)" : "still future (locked)"}\n`;
    });

    text += "\nADMIN VIEW — his choices so far:\n\n";
    CONFIG.letters.filter(l => l.type === "choice").forEach(l => {
      const val = getChoice(l.choiceKey);
      const time = lsGet("choice_" + l.choiceKey + "_time");
      text += `${l.title} (${l.choiceKey}): ${val ? val : "— not chosen yet —"}${time ? " @ " + time : ""}\n`;
    });
    text += `\nOpened letters:\n`;
    CONFIG.letters.forEach(l => {
      text += `  ${l.id}: ${isOpened(l.id) ? "opened" : "not opened"}\n`;
    });
    text += `\n(This panel only appears with ?admin=1 in the URL — he won't see it.)`;
    panel.innerHTML = `<h4>Admin</h4>${text.replace(/\n/g, "<br/>")}`;
    document.querySelector(".wrap").appendChild(panel);
  }

  /* ---------------- NOTIFICATIONS ----------------
     No backend, no push service — just localStorage + the optional
     browser Notification API. Three layers, in order of reliability:

     1. "NEW" badge on unopened-but-unlocked letters in the timeline
        (see letterRow above) — always works, no permission needed.
     2. A one-time dismissible banner + a bell icon with an unread
        count in the header — always works, no permission needed.
     3. Real OS-level browser notifications — fully optional, off by
        default, only offered after he's already engaged with the
        site once, and only fires while this tab is open (a true
        background/closed-tab push would need a service worker plus
        a push server, which is the complexity we're deliberately
        not introducing). If unsupported or declined, layers 1 and 2
        still work exactly the same. */

  const NOTIF_ENABLED_KEY = "notifEnabled";
  const NOTIF_DISMISSED_KEY = "notifPromptDismissed";
  const PENDING_OPEN_KEY = "pendingOpenLetter";

  function unreadLetters() {
    return CONFIG.letters.filter(l => letterStatus(l) === "unlocked");
  }

  function renderNotifBell() {
    const countEl = document.getElementById("notif-bell-count");
    if (!countEl) return;
    const n = unreadLetters().length;
    if (n > 0) {
      countEl.textContent = n > 9 ? "9+" : String(n);
      countEl.classList.remove("hidden");
    } else {
      countEl.classList.add("hidden");
    }
  }

  function openFirstUnread() {
    const list = unreadLetters();
    if (list.length) openLetterById(list[0].id);
  }

  function renderNotifBanner() {
    const banner = document.getElementById("notif-banner");
    const textEl = document.getElementById("notif-banner-text");
    if (!banner || !textEl) return;

    // only letters unlocked-but-not-yet-announced trigger the banner,
    // and only once per letter — re-opening the site later won't
    // re-show a banner for something already announced
    const fresh = unreadLetters().filter(l => lsGet("announced_" + l.id) !== "1");
    if (!fresh.length) return;
    fresh.forEach(l => lsSet("announced_" + l.id, "1"));

    textEl.textContent = fresh.length === 1
      ? `New: "${fresh[0].title}" just unlocked.`
      : `${fresh.length} new things just unlocked.`;
    banner.dataset.targetId = fresh[0].id;
    banner.classList.remove("hidden");
  }

  function initNotifBannerHandlers() {
    const banner = document.getElementById("notif-banner");
    const closeBtn = document.getElementById("notif-banner-close");
    const bell = document.getElementById("notif-bell");
    if (banner) {
      banner.addEventListener("click", (e) => {
        if (e.target === closeBtn) return;
        const id = banner.dataset.targetId;
        banner.classList.add("hidden");
        if (id) openLetterById(id);
      });
      banner.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") banner.click();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        banner.classList.add("hidden");
      });
    }
    if (bell) bell.addEventListener("click", openFirstUnread);
  }

  function notifSupported() {
    return typeof Notification !== "undefined";
  }

  function maybeShowNotifPrompt() {
    const el = document.getElementById("notif-prompt");
    if (!el) return;
    if (!notifSupported()) return;
    if (Notification.permission !== "default") return;
    if (lsGet(NOTIF_DISMISSED_KEY) === "1") return;
    // don't greet him with this on a completely fresh first visit —
    // only offer it once he's actually opened something
    const hasEngaged = CONFIG.letters.some(l => isOpened(l.id) || (l.choiceKey && getChoice(l.choiceKey)));
    if (!hasEngaged) return;
    el.classList.remove("hidden");
  }

  function initNotifPromptHandlers() {
    const enableBtn = document.getElementById("notif-enable-btn");
    const dismissBtn = document.getElementById("notif-dismiss-btn");
    const el = document.getElementById("notif-prompt");
    if (enableBtn) {
      enableBtn.addEventListener("click", () => {
        Notification.requestPermission().then(perm => {
          lsSet(NOTIF_ENABLED_KEY, perm === "granted" ? "1" : "0");
          if (el) el.classList.add("hidden");
          maybeFireBrowserNotifications();
        });
      });
    }
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        lsSet(NOTIF_DISMISSED_KEY, "1");
        if (el) el.classList.add("hidden");
      });
    }
  }

  function maybeFireBrowserNotifications() {
    if (!notifSupported()) return;
    if (Notification.permission !== "granted") return;
    if (lsGet(NOTIF_ENABLED_KEY) !== "1") return;
    unreadLetters().forEach(l => {
      if (lsGet("pushed_" + l.id) === "1") return;
      lsSet("pushed_" + l.id, "1");
      try {
        const n = new Notification("New on the map: " + l.title, {
          body: "Something new just unlocked.",
          tag: "mnadv-" + l.id
        });
        n.onclick = () => {
          lsSet(PENDING_OPEN_KEY, l.id);
          window.focus();
          openLetterById(l.id);
          n.close();
        };
      } catch (e) {
        /* Notification constructor can throw on some platforms — fail silently, badges/banner still work */
      }
    });
  }

  function consumePendingOpen() {
    const id = lsGet(PENDING_OPEN_KEY);
    if (id) {
      lsSet(PENDING_OPEN_KEY, "");
      openLetterById(id);
      return true;
    }
    return false;
  }

  // On initial load, jump straight to the newest unread letter instead of
  // making him scroll/search the whole timeline for it. Runs once on load
  // only (not on the periodic re-render) so it doesn't yank the page out
  // from under him while he's reading something else.
  function scrollToFirstUnread() {
    const el = document.querySelector('[data-letter][data-status="unlocked"]');
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  }

  /* ---------------- TRIP-UPDATE ANNOUNCEMENT BANNER ----------------
     A one-time celebratory banner (config-driven via CONFIG.announcement)
     for calling out a trip-detail change — e.g. a new departure day.
     Shows once ever per "id", with a small confetti burst, then stays
     dismissed on every future visit. See config.js for how to edit or
     retire it. */
  const ANNOUNCEMENT_SEEN_PREFIX = "announcementSeen_";
  const CONFETTI_COLORS = ["#d9a75c", "#f0cd94", "#8a2a49", "#e2a2ad", "#6c7c60"];

  function fireConfetti() {
    const layer = document.getElementById("confetti-layer");
    if (!layer) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const count = 46;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      const size = 6 + Math.random() * 6;
      const duration = 2.6 + Math.random() * 2;
      const delay = Math.random() * 0.5;
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.width = size + "px";
      piece.style.height = size * 1.6 + "px";
      piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.animationDuration = duration + "s";
      piece.style.animationDelay = delay + "s";
      layer.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
    }
  }

  function renderAnnouncementBanner() {
    const cfg = CONFIG.announcement;
    const overlay = document.getElementById("trip-update-overlay");
    if (!cfg || !overlay || !cfg.active) return;
    if (lsGet(ANNOUNCEMENT_SEEN_PREFIX + cfg.id) === "1") return;

    const titleEl = document.getElementById("trip-update-title");
    const msgEl = document.getElementById("trip-update-message");
    if (titleEl) titleEl.textContent = cfg.title || "";
    if (msgEl) msgEl.textContent = cfg.message || "";
    overlay.classList.remove("hidden");
    fireConfetti();
  }

  function dismissAnnouncementBanner() {
    const cfg = CONFIG.announcement;
    const overlay = document.getElementById("trip-update-overlay");
    if (overlay) overlay.classList.add("hidden");
    if (cfg) lsSet(ANNOUNCEMENT_SEEN_PREFIX + cfg.id, "1");
  }

  function initAnnouncementBannerHandlers() {
    const overlay = document.getElementById("trip-update-overlay");
    const closeBtn = document.getElementById("trip-update-close");
    if (!overlay) return;
    // clicking the dimmed backdrop (but not the card itself) dismisses,
    // same as any standard modal
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) dismissAnnouncementBanner();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) dismissAnnouncementBanner();
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dismissAnnouncementBanner();
      });
    }
  }

  /* ---------------- INIT ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderCountdown();
    renderMap();
    renderItinerary();
    maybeRenderAdmin();

    renderNotifBell();
    renderNotifBanner();
    initNotifBannerHandlers();
    maybeShowNotifPrompt();
    initNotifPromptHandlers();
    maybeFireBrowserNotifications();
    initAnnouncementBannerHandlers();
    renderAnnouncementBanner();
    const openedFromNotification = consumePendingOpen();
    if (!openedFromNotification) scrollToFirstUnread();

    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeLetterModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLetterModal();
      });
    }

    // keep countdown/map/itinerary/notifications fresh if the tab
    // stays open across an unlock time
    setInterval(() => {
      renderCountdown();
      renderItinerary();
      renderMap();
      renderNotifBell();
      renderNotifBanner();
      maybeShowNotifPrompt();
      maybeFireBrowserNotifications();
    }, 60 * 1000);
  });
})();
