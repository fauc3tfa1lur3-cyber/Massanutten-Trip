# Massanutten Adventure Map

A self-contained website: `index.html`, `itinerary.html`, `styles.css`, `tailwind-lite.css`, `app.js`, `config.js`.

The map/timeline on `index.html` is written with Tailwind-style utility classes, but `tailwind-lite.css` is a hand-compiled static stylesheet covering exactly those classes — not the Tailwind CDN script. That keeps the site a genuine zero-dependency bundle (no external script has to load correctly for the page to look right, which matters on hotel wifi or a bad connection). If you add new Tailwind classes to `app.js` or `index.html` later, add the matching rule to `tailwind-lite.css` (there's a comment at the top explaining the convention).

## Editing content

Everything you'll want to change lives in **`config.js`**: trip dates, letter text and unlock dates, decision deadlines and wording, itinerary items, and reveal timestamps. You shouldn't need to touch `app.js` or `styles.css` unless you want to change colors (those are also at the top of `styles.css` and mirrored in `config.js`'s `theme` object for reference).

Dates are written as `"YYYY-MM-DDTHH:MM"` in your local time.

- `trip.startDate` / `trip.endDate` — the Saturday–Monday window. Changing `startDate` shifts when the itinerary page unlocks.
- `letters[]` — each letter has an `unlock` date. Add, remove, or reorder freely; the map renders them in array order.
- Decision letters (`type: "choice"`) have a `deadline`, `options`, and messages shown once locked or once expired unanswered.
- `itinerary` — each day's items. Set `secret: true` and a `revealAt` timestamp for anything that should stay locked until a specific moment during the trip. Items tied to his decisions use `choiceKey` + per-option `detail`/`mapReveal`.

## Previewing future dates

Add `?simDate=2026-09-06T18:00` to either page's URL to preview how the site looks on that date/time, without waiting for real time to pass or touching your system clock. This is just a query param — nothing is saved, and normal visits without it use the real current time.

## Notifications

There are three layers, stacked from "always works" to "nice bonus":

1. **NEW badge** on the timeline — any unlocked-but-unopened letter gets a small badge next to its title. Always on, no permissions needed.
2. **Bell icon + one-time banner** — the bell in the top bar shows a count of unread letters, and a dismissible banner appears announcing how many new things unlocked. Both are pure `localStorage`, no permissions needed. The banner is click-to-open (jumps straight to the first unread letter) and only ever announces a given letter once (`announced_<id>` in localStorage).
3. **Optional browser notifications** — after he's opened at least one letter, a small "Want a nudge when something new unlocks?" prompt appears. If he turns it on, the site will fire a real browser `Notification` when a letter unlocks *while the tab is open*. This is **not** true background push — there's no service worker or server, so it only works while the site is open in a tab (foreground or background tab, not "phone locked, browser closed"). That's a deliberate tradeoff to avoid adding any backend/server/database — everything still runs as a static site with zero infrastructure. Permission is only ever requested on an explicit button click, never automatically.

## Checking his choices

Add `?admin=1` to `index.html`'s URL to see a small panel at the bottom of the page listing his choices and which letters he's opened. This reads from the same browser's localStorage, so it only shows data from whatever device/browser you check it on — if he opens the site on his phone, check `?admin=1` on his phone (or ask him, still totally in the spirit of the surprise).

## Deploying

This is plain static HTML/CSS/JS — no build step, no server required. The simplest options:

- **Netlify Drop** (netlify.com/drop) — drag the folder in, get a URL instantly.
- **GitHub Pages** — push the folder to a repo, enable Pages on the `main` branch.
- **Vercel** — `vercel deploy` from inside the folder, or drag-and-drop on vercel.com.

Whichever you pick, just make sure all six files stay together in the same folder.

## Notes

- His choices and opened-letter state are stored in `localStorage` in his browser. If he clears site data or switches devices/browsers partway through, he'll lose progress on what he's opened (but not anything you've already locked in server-side, since there is no server — the source of truth for his choice is whichever device he made it on).
- The Saturday-evening and Sunday-evening surprises are written to remain non-specific until their `revealAt` time passes — double check the exact times in `config.js` match your real plans before the trip.
- The countdown is date-driven, not a fixed "21 days" — as of the current letter schedule (starting Aug 16, trip starts Sept 5), that's actually 20 days. If you want the countdown to read exactly 21 on the day he first opens the site, either move `trip.startDate` a day later or just treat "21 days" as the framing in his in-person conversation rather than something the site itself needs to literally display.
