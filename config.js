/* ============================================================
   MASSANUTTEN ADVENTURE — CONFIGURATION
   ------------------------------------------------------------
   This is the ONLY file you should need to edit.
   Everything else reads from this object.

   HOW DATES WORK
   - Write dates as "YYYY-MM-DDTHH:MM" (24-hour clock), meaning that
     wall-clock time in the TIMEZONE set below — NOT each visitor's own
     device timezone. This matters: if his phone's timezone is set
     differently than expected (wrong auto-detected zone, manually set
     wrong, etc.), unlock times would otherwise land at a different real
     moment on his phone than on your laptop. Anchoring to one fixed
     timezone keeps every device in sync regardless of its own clock/TZ
     settings.
   - "unlock" dates control when a letter/section becomes available.
   - "deadline" dates control when a decision letter locks/closes.
   - "revealAt" dates control when a secret itinerary item shows
     its real content instead of the locked placeholder.
   ============================================================ */

const CONFIG = {

  /* ---------------- TIMEZONE ----------------
     All dates in this file are interpreted in this fixed timezone.
     Massanutten, VA is US Eastern. Value = hours WEST of UTC.
     Eastern Daylight Time (EDT) = 4 — in effect for this entire trip
     window (through the first Sunday of November). If you ever add
     dates after that, switch to 5 (EST). */
  timezoneOffsetHours: 4,

  /* ---------------- TRIP BASICS ---------------- */
  trip: {
    destination: "Massanutten, Virginia",
    startDate: "2026-09-05T00:00",   // Saturday — trip day 1 (itinerary unlocks at start of this day)
    endDate:   "2026-09-07T23:59",   // Monday — trip day 3
  },

  /* ---------------- VISUAL THEME ----------------
     Change hex values to retheme the whole site. */
  theme: {
    parchment:   "#f8ece7",
    parchmentDk: "#f1dad3",
    ink:         "#3a2432",
    burgundy:    "#8a2a49",
    burgundyDk:  "#5e1c33",
    dustyRose:   "#eaa9b3",
    mauve:       "#b96a86",
    gold:        "#cf9a52",
    goldLight:   "#e8bd82",
    forest:      "#6c7c60",
  },

  /* ---------------- OPEN WHEN LETTERS ----------------
     type: "story" | "useless" | "choice" | "riddle"
     id must be unique + stable (used as localStorage key for "opened" state)
  ------------------------------------------------------------ */
  letters: [
    {
      id: "first-turn",
      title: "The First Turn",
      type: "story",
      unlock: "2026-08-16T09:00",
      mapLabel: "First Turn",
      body: [
        "Okay, you found it.",
        "I figured I'd give you a little something to do while we wait.",
        "I made this map for our weekend, and I'm going to add things to it over the next few weeks. You already know where we're going and when. That's about all you're getting for now.",
        "Things will unlock as we get closer, so check back every once in a while.",
        "I figured waiting 21 days should at least come with some entertainment."
      ]
    },
    {
      id: "rise-or-risk",
      title: "Rise or Risk",
      type: "choice",
      unlock: "2026-08-16T09:00",
      mapLabel: "Rise or Risk",
      choiceKey: "sundayMorning",
      deadline: "2026-08-21T23:59",
      intro: [
        "Okay, this one actually matters.",
        "Sunday morning has two options.",
        "One is RISE.",
        "One is RISK.",
        "I'm not telling you what either one means because that would defeat the point.",
        "Pick whichever sounds better to you right now. Or pick the one you think I'd want you to pick. I won't tell you if you're right.",
        "Make your choice by August 21."
      ],
      options: [
        { value: "RISE", label: "RISE" },
        { value: "RISK", label: "RISK" }
      ],
      lockedMessage: (choice) => `<div class="locked-caps">CHOICE LOCKED</div>You chose ${choice}.<br>That's all you're getting for now.<br>No changing your mind.`,
      expiredMessage: "This one's closed now. I already made the call for us — you'll find out soon which way we're going."
    },
    {
      id: "an-aside",
      title: "An Aside",
      type: "useless",
      unlock: "2026-08-17T00:00",
      mapLabel: "An Aside",
      body: [
        "Completely unrelated, but golden retrievers weigh about 65 pounds on average.",
        "I don't know why I know that.",
        "Anyway. I love you. 😘"
      ]
    },
    {
      id: "home",
      title: "Home",
      type: "story",
      unlock: "2026-08-17T23:15",
      mapLabel: "Home",
      body: [
        "I used to think home was a place.",
        "Four walls.",
        "A street.",
        "Somewhere to come back to.",
        "Then I met you and somehow \"home\" started sounding a lot more like your name."
      ]
    },
    {
      id: "future-us",
      title: "For a Future Version of Us",
      type: "story",
      unlock: "2026-08-18T05:45",
      mapLabel: "Future Us",
      body: [
        "I wonder what we're going to be like years from now.",
        "What our house looks like.",
        "What ridiculous thing we'll argue about.",
        "What we're eating on a random Tuesday night.",
        "What our vacations look like.",
        "What we'll laugh about when we're old.",
        "I don't know any of it yet.",
        "But I really like knowing that you're the person I get to find out with."
      ]
    },
    {
      id: "the-quiet-part",
      title: "The Quiet Part",
      type: "story",
      unlock: "2026-08-18T20:00",
      mapLabel: "The Quiet Part",
      body: [
        "[PLACEHOLDER — write this letter before Aug 18, 8:00 PM. See config.js: letters[] -> id \"the-quiet-part\".]"
      ]
    },
    {
      id: "small-detour",
      title: "A Small Detour",
      type: "story",
      unlock: "2026-08-19T05:45",
      mapLabel: "Small Detour",
      body: [
        "Small heads-up for Saturday:",
        "There's a good chance I'm going to make us stop somewhere before we get to the condo.",
        "There will be a view. It shouldn't require any serious effort, but bring closed-toe shoes.",
        "That's all you're getting.",
        "See? I'm capable of giving you useful information."
      ]
    },
    {
      id: "necessary-fact-1",
      title: "A Completely Necessary Fact",
      type: "useless",
      unlock: "2026-08-20T05:45",
      mapLabel: "Necessary Fact",
      body: [
        "Did you know that wombat poop is cube-shaped?",
        "You're welcome.",
        "I love you. 😘"
      ]
    },
    {
      id: "passing-thought",
      title: "A Passing Thought",
      type: "useless",
      unlock: "2026-08-22T05:45",
      mapLabel: "Passing Thought",
      body: [
        "You know when you walk into a room and immediately forget why you went in there?",
        "Anyway, that's all.",
        "I love you. 😘"
      ]
    },
    {
      id: "what-to-bring",
      title: "What to Bring",
      type: "story",
      unlock: "2026-08-24T05:45",
      mapLabel: "What to Bring",
      body: [
        "Alright, one boring one.",
        "Bring clothes you can comfortably be outside in, something warm for at night, closed-toe shoes you can actually walk in, and one outfit that's a little nicer.",
        "Bring a swimsuit, too.",
        "And don't forget your bottom retainers.",
        "That's it. No hidden meaning. No puzzle. I'm just telling you what to pack.",
        "You're welcome."
      ]
    },
    {
      id: "dad-joke",
      title: "Dad Joke Department",
      type: "useless",
      unlock: "2026-08-25T05:45",
      mapLabel: "Dad Joke",
      body: [
        "Why don't mountains ever get cold?",
        "Because they wear snow caps.",
        "I'll be here all week.",
        "I love you. 😘"
      ]
    },
    {
      id: "the-wanderer",
      title: "The Wanderer",
      type: "riddle",
      unlock: "2026-08-27T05:45",
      mapLabel: "The Wanderer",
      body: [
        "Here's a weird one.",
        "Some things get better when you leave them alone for a while.",
        "Sunday evening has something to do with that.",
        "That's your clue.",
        "No, I'm not explaining it.",
        "You can think about it if you want."
      ]
    },
    {
      id: "customer-service",
      title: "Customer Service",
      type: "useless",
      unlock: "2026-08-28T05:45",
      mapLabel: "Customer Service",
      body: [
        "Thank you for using Girlfriend Travel Services.",
        "Your patience is appreciated.",
        "Your request for additional information has been denied.",
        "Please do not submit another request at this time.",
        "Have a nice day.",
        "I love you. 😘"
      ]
    },
    {
      id: "above-or-below",
      title: "Above or Below",
      type: "choice",
      unlock: "2026-08-29T05:45",
      mapLabel: "Above or Below",
      choiceKey: "mondayFinal",
      deadline: "2026-09-01T23:59",
      intro: [
        "You've got another choice.",
        "Monday morning, we're taking one last detour before heading home.",
        "One option takes us ABOVE.",
        "The other takes us BELOW.",
        "Pick one. I'll handle the rest.",
        "Make your choice by September 1."
      ],
      options: [
        { value: "ABOVE", label: "ABOVE" },
        { value: "BELOW", label: "BELOW" }
      ],
      lockedMessage: (choice) => `<div class="locked-caps">CHOICE LOCKED</div>You chose ${choice}.<br>Monday morning is officially decided.<br>You'll find out exactly what that means when we get there.`,
      expiredMessage: "This one's closed now. It's already decided — you'll see which way we went once Monday gets here."
    },
    {
      id: "in-between",
      title: "In Between",
      type: "useless",
      unlock: "2026-08-31T05:45",
      mapLabel: "In Between",
      body: [
        "Still checking these?",
        "Respect.",
        "I don't have anything useful for you today. I just wanted to see if you'd actually keep coming back.",
        "Apparently you did.",
        "I love you. 😘"
      ]
    },
    {
      id: "necessary-fact-2",
      title: "One More Completely Necessary Fact",
      type: "useless",
      unlock: "2026-09-01T05:45",
      mapLabel: "Necessary Fact",
      body: [
        "Bananas are berries.",
        "Strawberries aren't.",
        "I don't make the rules.",
        "I love you. 😘"
      ]
    },
    {
      id: "the-question",
      title: "The Question",
      type: "story",
      unlock: "2026-09-02T05:45",
      mapLabel: "The Question",
      body: [
        "I've really liked planning this.",
        "Not just the actual stuff we're doing, but having something that's just ours to look forward to. I love getting to plan things for us, especially when it means we get a few days where neither of us has to worry about anything else and we can just be together.",
        "I know it's only three days, but I really like that it's three days that are just ours.",
        "That's my favorite part of this whole thing.",
        "Anyway, that's all. I'm done being sincere for now.",
        "I love you so so much. ❤️"
      ]
    },
    {
      id: "last-turn",
      title: "The Last Turn",
      type: "story",
      unlock: "2026-09-04T05:45",
      mapLabel: "Last Turn",
      body: [
        "That's everything you're getting from me before we go.",
        "Pack your stuff, charge your phone, and don't forget your bottom retainers.",
        "From here on out, the map is going to be a lot more useful in person.",
        "See you Saturday. ❤️"
      ]
    }
  ],

  /* ---------------- ITINERARY ----------------
     day: "saturday" | "sunday" | "monday"
     status types are computed at runtime, but you control:
       - visibleFrom: when this row even appears (usually trip start)
       - secret: true items stay LOCKED until revealAt passes
       - revealAt: timestamp the true label/detail appears
       - choiceKey: for items tied to his decisions, shows chosen path
         label immediately, but "detail" stays hidden until revealAt
  ------------------------------------------------------------ */
  itinerary: {
    unlocksAt: "2026-09-05T00:00", // whole page locked before this

    days: [
      {
        id: "saturday",
        label: "Saturday",
        date: "Sept 5",
        items: [
          {
            id: "sat-arrival",
            label: "Arrival",
            detail: "Drive up to Massanutten.",
            secret: false
          },
          {
            id: "sat-lookout",
            label: "Resort lookout",
            detail: "A short detour to the view before we settle in.",
            secret: false
          },
          {
            id: "sat-checkin",
            label: "Check-in",
            detail: "Condo check-in and unpacking.",
            secret: false
          },
          {
            id: "sat-evening",
            label: "Evening",
            secret: true,
            revealAt: "2026-09-05T17:30",
            lockedLabel: "Evening plans",
            lockedHint: "This one's mine to give you in person.",
            detail: "I made you something. It's ready when you are.",
            mapReveal: "Surprise"
          }
        ]
      },
      {
        id: "sunday",
        label: "Sunday",
        date: "Sept 6",
        items: [
          {
            id: "sun-morning",
            label: "Morning",
            secret: true,
            choiceKey: "sundayMorning",
            revealAt: "2026-09-06T07:00",
            lockedLabel: "Morning activity",
            lockedHint: "Your choice is locked in. The details show up morning-of.",
            options: {
              RISE: { detail: "Scenic chairlift — 11:50 AM. Dress warm, it's breezy up top.", mapReveal: "Chairlift" },
              RISK: { detail: "Zipline / tubing — 10:00 AM. Wear shoes you can move in.", mapReveal: "Zipline" }
            }
          },
          {
            id: "sun-free",
            label: "Free time",
            detail: "No plans. On purpose.",
            secret: false
          },
          {
            id: "sun-evening",
            label: "Evening",
            secret: true,
            revealAt: "2026-09-06T16:30",
            lockedLabel: "Evening plans",
            lockedHint: "The Wanderer told you to be patient. Almost there.",
            detail: "We're headed to a small winery nearby — a quiet evening, just the two of us.",
            mapReveal: "Winery"
          }
        ]
      },
      {
        id: "monday",
        label: "Monday",
        date: "Sept 7",
        items: [
          {
            id: "mon-final",
            label: "Final activity",
            secret: true,
            choiceKey: "mondayFinal",
            revealAt: "2026-09-07T08:00",
            lockedLabel: "Final activity",
            lockedHint: "Your choice is locked in. Details show up the morning of.",
            options: {
              ABOVE: { detail: "Skyline Drive — a scenic overlook drive along the ridge.", mapReveal: "Skyline Drive" },
              BELOW: { detail: "Caverns tour nearby — cool, underground, very much the opposite of above.", mapReveal: "Caverns" }
            }
          },
          {
            id: "mon-home",
            label: "Drive home",
            detail: "Back home, adventure complete.",
            secret: false
          }
        ]
      }
    ]
  }
};
