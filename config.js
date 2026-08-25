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
    startDate: "2026-09-04T00:00",   // Friday — trip day 1 (itinerary unlocks at start of this day)
    endDate:   "2026-09-07T23:59",   // Monday — trip day 4
  },

  /* ---------------- ANNOUNCEMENT BANNER ----------------
     One-time celebratory banner (with a little confetti) shown once
     ever, on the homepage, then dismissed for good. To retire it,
     set active:false. To use it again for a future update, change
     "id" to something new — a fresh id shows again even if an old
     one was already seen/dismissed. */
  announcement: {
    id: "friday-update-1",
    active: true,
    title: "Change of plans.",
    message: "We're leaving Friday now instead of Saturday. 😊"
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
      id: "a-very-simple-one",
      title: "A Very Simple One",
      type: "story",
      unlock: "2026-08-18T11:00",
      mapLabel: "Simple One",
      body: [
        "I really, really like you.",
        "That's it.",
        "That's the letter.",
        "I love you. 😘"
      ]
    },
    {
      id: "the-long-way",
      title: "The Long Way",
      type: "story",
      unlock: "2026-08-18T19:00",
      mapLabel: "The Long Way",
      body: [
        "I don't care if we take the long way.",
        "I don't care if the plans change.",
        "I don't care if we get lost.",
        "As long as when I look over, you're still there."
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
      id: "thank-you-for-being-patient",
      title: "Thank You for Being Patient With Me",
      type: "story",
      unlock: "2026-08-19T18:30",
      mapLabel: "Patient",
      body: [
        "I know I'm not always easy.",
        "Sometimes I overthink things.",
        "Sometimes I need reassurance about things I already know the answer to.",
        "Sometimes my brain decides there's a problem before there actually is one.",
        "Thank you for being patient with me while I figure out how to be better at all of that.",
        "I'm working on it.",
        "And I'm really grateful that I get to do that with you."
      ]
    },
    {
      id: "still",
      title: "Still",
      type: "story",
      unlock: "2026-08-20T05:45",
      mapLabel: "Still",
      body: [
        "After all the talking,",
        "laughing,",
        "planning,",
        "worrying,",
        "I still like",
        "the quietest part best:",
        "sitting beside you",
        "with nothing to say",
        "and nowhere else to be."
      ]
    },
    {
      id: "necessary-fact-1",
      title: "A Completely Necessary Fact",
      type: "useless",
      unlock: "2026-08-20T18:30",
      mapLabel: "Necessary Fact",
      body: [
        "Did you know that wombat poop is cube-shaped?",
        "You're welcome.",
        "I love you. 😘"
      ]
    },
    {
      id: "firsts",
      title: "Firsts",
      type: "story",
      unlock: "2026-08-20T18:30",
      mapLabel: "Firsts",
      body: [
        "There are still so many firsts left for us.",
        "First place we live together.",
        "First Christmas in our own place.",
        "First trip somewhere neither of us has been.",
        "First time we have to assemble furniture.",
        "First time we can wake up in each other's arms and not worry about going home.",
        "First time in the love room",
        "I like that we haven't gotten to those yet.",
        "There's still so much ahead for us."
      ]
    },
    {
      id: "trip-to-the-future",
      title: "A Trip to the Future",
      type: "story",
      unlock: "2026-08-21T05:45",
      mapLabel: "Trip to Future",
      body: [
        "I wish we could meet the version of us five years from now for five minutes.",
        "I'd want to know what we got right.",
        "What we worried about that turned out not to matter.",
        "What we're laughing about.",
        "What our life looks like.",
        "I wouldn't ask for spoilers, though.",
        "I think I'd rather find out with you."
      ]
    },
    {
      id: "the-wanderer",
      title: "The Wanderer",
      type: "choice",
      unlock: "2026-08-21T15:00",
      mapLabel: "The Wanderer",
      choiceKey: "sundayEvening",
      deadline: "2026-08-21T22:00",
      intro: [
        "Remember that choice you made for Sunday morning?",
        "You chose RISK.",
        "I'm still not telling you what that means.",
        "You have another choice.",
        "Sunday evening has two paths.",
        "One is CHARM.",
        "The other is CHALLENGE.",
        "Pick whichever sounds more like your kind of evening.",
        "Decision required by August 21 at 10:00 PM."
      ],
      options: [
        { value: "CHARM", label: "CHARM" },
        { value: "CHALLENGE", label: "CHALLENGE" }
      ],
      lockedMessage: (choice) => choice === "CHARM"
        ? `<div class="locked-caps">CHOICE LOCKED</div>You chose CHARM.<br>That's all you're getting for now.<br>You'll find out what you picked when the time comes. 😘`
        : `<div class="locked-caps">CHOICE LOCKED</div>You chose CHALLENGE.<br>Bold.<br>You'll find out what you signed yourself up for when the time comes.`,
      expiredMessage: "This one's closed now. I made the call for us — you'll find out what that means when Sunday evening gets here."
    },
    {
      id: "crush",
      title: "Crush",
      type: "story",
      unlock: "2026-08-21T18:30",
      mapLabel: "Crush",
      body: [
        "Just wanted to let you know I have a crush on you. I think you're kinda cute 😊"
      ]
    },
    {
      id: "you",
      title: "You",
      type: "story",
      unlock: "2026-08-22T05:45",
      mapLabel: "You",
      body: [
        "You are",
        "my favorite notification,",
        "my favorite voice,",
        "my favorite face",
        "in a crowded room.",
        "You are",
        "the person I look for",
        "without thinking.",
        "I don't know when",
        "you became that.",
        "I just know",
        "you are."
      ]
    },
    {
      id: "before-we-knew",
      title: "Before We Knew",
      type: "story",
      unlock: "2026-08-22T18:30",
      mapLabel: "Before We Knew",
      body: [
        "There was a version of us that didn't know any of this was coming.",
        "We didn't know we'd end up here.",
        "We didn't know how much we'd come to mean to each other.",
        "We didn't know what we'd be planning together.",
        "I kind of love that.",
        "Somewhere along the way, without either of us really noticing, you became my forever."
      ]
    },
    {
      id: "boyfriend-review",
      title: "Boyfriend Review",
      type: "story",
      unlock: "2026-08-23T05:45",
      mapLabel: "BF Review",
      body: [
        "Appearance: 10/10",
        "Humor: questionable but effective",
        "Cuddling: excellent",
        "Listening: fantastic",
        "Ability to distract me: exceptional",
        "Overall experience: would recommend",
        "★★★★★",
        "I love you. 😘"
      ]
    },
    {
      id: "when-im-old",
      title: "When I'm Old",
      type: "story",
      unlock: "2026-08-23T18:30",
      mapLabel: "When I'm Old",
      body: [
        "When I'm old, I hope I still recognize the little things about you.",
        "I hope I still know when you're annoyed before you say anything.",
        "I hope I still know what you're going to order.",
        "I hope I still know which stories you've told a thousand times.",
        "I hope you still make me laugh.",
        "And I hope I still look at you sometimes and think,",
        "Thank you, Lord, for sending me my other half."
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
      id: "something-that-scares-me",
      title: "Something That Scares Me",
      type: "story",
      unlock: "2026-08-24T18:30",
      mapLabel: "Scares Me",
      body: [
        "Sometimes I think about how much I love you, and it scares me a little.",
        "Not because I don't trust you. Not because I think something is going to go wrong.",
        "I think it's because loving someone this much means giving them a part of you that they can actually affect.",
        "You matter to me enough that what happens to you matters to me. Your happiness affects mine. Your sadness hurts my heart.",
        "And, if I'm being completely honest, the thought of ever losing you is one of the few things that genuinely scares me.",
        "I don't think there's a way to love someone deeply without taking that risk. You can't keep your heart completely protected and still let someone all the way in.",
        "But I'm grateful that I've found someone worth taking the risk for.",
        "Someone I trust. Someone I admire. Someone I genuinely love being around. Someone I can laugh with, dream with, make plans with, and eventually look back on all of this with.",
        "So yes, loving you scares me a little.",
        "But mostly, it makes me excited.",
        "Because if this is what it feels like to have someone worth taking a chance on, then I'd take the chance again.",
        "Every time. From now until forever. ❤️"
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
      id: "above-or-below",
      title: "Above or Below",
      type: "choice",
      unlock: "2026-08-25T18:30",
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
      id: "when-it-was-new",
      title: "When It Was New",
      type: "story",
      unlock: "2026-08-26T05:45",
      mapLabel: "When New",
      body: [
        "I still remember what it felt like when we first started dating.",
        "Everything was new.",
        "I remember the butterflies before seeing you, the stupid smile I'd get when your name showed up on my phone, and how I'd replay little moments with you afterward because I wasn't ready for them to be over yet.",
        "There was something so exciting about not knowing what was coming next. Every date was something to look forward to. Every conversation felt like discovering another little piece of you.",
        "I'd go home and realize I had spent hours with you and somehow still wanted more.",
        "I loved that feeling of oh my God, I really like this person.",
        "And I think what makes me happiest is that, even now, I still get pieces of that feeling.",
        "Not in exactly the same way. The butterflies have settled into something deeper. The excitement of wondering whether you'd text has become the comfort of knowing you probably will. The nervousness of a first date has become the ease of knowing I can be completely myself with you.",
        "But every once in a while, you'll look at me a certain way or say something that makes me laugh, and I'll get this little flash of that girl who was first falling for you.",
        "And I love that she's still in there.",
        "I love that after everything we've already been through, there are still things about you I get to discover. There are still places we'll go, memories we haven't made, inside jokes we haven't created, and ordinary days that haven't happened yet.",
        "I think that's one of the best parts. I don't miss the beginning because I wish we were still there. I love the beginning because it was the first glimpse of everything we could become.",
        "And somehow, I still get excited when I think about what's next. ❤️"
      ]
    },
    {
      id: "things-i-love-about-you",
      title: "Things I Love About You",
      type: "story",
      unlock: "2026-08-27T05:45",
      mapLabel: "Things I Love",
      body: [
        "Things I love about you:",
        "Your laugh.",
        "Your hands.",
        "The way you concentrate.",
        "The way you get excited when you're talking about something you like.",
        "The way the right side of your mouth turns up when you're up to no good.",
        "The way you remember things.",
        "The way you work for the life you want.",
        "The way you love people even when they make it difficult.",
        "I could keep going.",
        "I probably will."
      ]
    },
    {
      id: "the-lucky-part",
      title: "The Lucky Part",
      type: "story",
      unlock: "2026-08-27T18:30",
      mapLabel: "Lucky Part",
      body: [
        "People talk about luck like it's something that happens to you.",
        "A winning number. The right place. The right time.",
        "But sometimes I think luck is recognizing something good when it finds you.",
        "And then being brave enough to hold onto it.",
        "I found you.",
        "That's my lucky part."
      ]
    },
    {
      id: "customer-service",
      title: "Customer Service",
      type: "useless",
      unlock: "2026-08-28T18:30",
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
      id: "no-one-told-me",
      title: "No One Told Me",
      type: "story",
      unlock: "2026-08-29T05:45",
      mapLabel: "No One Told Me",
      body: [
        "No one told me love could feel this ordinary.",
        "Not ordinary as in unimportant. Ordinary as in: I saw something today and immediately thought of you.",
        "I want to tell you what happened.",
        "I know you'll laugh at this.",
        "I wonder what you're doing.",
        "Somehow you became part of the background of my entire life.",
        "And somehow that's one of my favorite things about loving you."
      ]
    },
    {
      id: "more-than-i-expected",
      title: "More Than I Expected",
      type: "story",
      unlock: "2026-08-30T05:45",
      mapLabel: "More Expected",
      body: [
        "I thought love would be fireworks.",
        "Something obvious. Something loud.",
        "I didn't expect to find it in being understood.",
        "In being remembered.",
        "In having someone who knows my moods and still comes closer.",
        "I didn't expect love to make my world feel bigger.",
        "But you did.",
        "You made room for more life than I knew I wanted."
      ]
    },
    {
      id: "you-specifically",
      title: "You, Specifically",
      type: "story",
      unlock: "2026-08-31T05:45",
      mapLabel: "You, Specifically",
      body: [
        "I don't want the perfect life.",
        "I don't even know what that would look like.",
        "I want the life that has you in it.",
        "Your shoes by the door. Your things on the counter. Your voice from another room.",
        "I want the grocery runs and the long drives and the completely unnecessary arguments about where to eat.",
        "I want the days that feel like nothing special until years later when we realize they were everything.",
        "There are a million ways a life could turn out.",
        "And I'd choose the one with you every time."
      ]
    },
    {
      id: "in-between",
      title: "In Between",
      type: "useless",
      unlock: "2026-08-31T18:30",
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
      id: "the-photograph",
      title: "The Photograph",
      type: "story",
      unlock: "2026-09-01T05:45",
      mapLabel: "Photograph",
      body: [
        "I wish I could see",
        "every version of us",
        "that exists in other people's memories.",
        "Us laughing",
        "when someone happened to look over.",
        "Us walking somewhere",
        "without realizing",
        "someone was watching.",
        "The little moments",
        "we didn't think were worth remembering.",
        "I think we'd be surprised",
        "by how often",
        "we looked happy.",
        "Maybe that's what photographs",
        "really give us:",
        "proof that we were there",
        "for moments",
        "we were too busy living",
        "to notice."
      ]
    },
    {
      id: "necessary-fact-2",
      title: "One More Completely Necessary Fact",
      type: "useless",
      unlock: "2026-09-01T18:30",
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
      unlock: "2026-09-02T18:30",
      mapLabel: "The Question",
      body: [
        "I've really liked planning this.",
        "Not just the actual stuff we're doing, but having something that's just ours to look forward to. I love getting to plan things for us, especially when it means we get a few days where neither of us has to worry about anything else and we can just be together.",
        "I know it's only four days, but I really like that it's four days that are just ours.",
        "That's my favorite part of this whole thing.",
        "Anyway, that's all. I'm done being sincere for now.",
        "I love you so so much. ❤️"
      ]
    },
    {
      id: "the-road",
      title: "The Road",
      type: "story",
      unlock: "2026-09-03T05:45",
      mapLabel: "The Road",
      body: [
        "I like being in the car",
        "with you.",
        "Not because",
        "we're going anywhere particular.",
        "I just like",
        "being beside you",
        "while the world",
        "keeps moving past us.",
        "Music on.",
        "Windows down.",
        "Some completely unnecessary",
        "conversation happening.",
        "There's something comforting",
        "about knowing",
        "I don't need to know",
        "exactly where we're going",
        "to enjoy getting there.",
        "Especially when",
        "you're driving."
      ]
    },
    {
      id: "five-minutes",
      title: "Five Minutes",
      type: "story",
      unlock: "2026-09-03T18:30",
      mapLabel: "Five Minutes",
      body: [
        "Give me five minutes",
        "with you",
        "and I can forget",
        "what I was worried about.",
        "Not because",
        "you fix everything.",
        "You just remind me",
        "that whatever is happening",
        "isn't the only thing",
        "that's happening.",
        "There's still laughter.",
        "There's still tomorrow.",
        "There's still us.",
        "Sometimes that's enough",
        "to make the world",
        "feel manageable again."
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
        "See you Friday. ❤️"
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
    unlocksAt: "2026-09-04T00:00", // whole page locked before this

    days: [
      {
        id: "friday",
        label: "Friday",
        date: "Sept 4",
        items: [
          {
            id: "fri-arrival",
            label: "Arrival",
            detail: "Drive up to Massanutten, get settled in.",
            secret: false
          },
          {
            id: "fri-lookout",
            label: "Resort lookout",
            detail: "A short detour to the view before we settle in. Around 5.",
            secret: false
          },
          {
            id: "fri-checkin",
            label: "Check-in",
            detail: "Condo check-in and unpacking. Around 5.",
            secret: false
          },
          {
            id: "fri-evening",
            label: "Evening",
            secret: true,
            revealAt: "2026-09-04T17:30",
            lockedLabel: "SURPRISE",
            lockedHint: "You'll find out when you get there. :)",
            detail: "I planned something for you. It's ready when you are.",
            mapReveal: "Surprise"
          }
        ]
      },
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
            id: "sat-attraction",
            label: "Exploration",
            secret: true,
            choiceKey: "mondayFinal",
            revealAt: "2026-09-05T08:00",
            lockedLabel: "Exploration",
            lockedHint: "Same choice as Monday, flipped. Details show up morning-of.",
            options: {
              ABOVE: { detail: "Caverns tour nearby — cool, underground, and about as far from a scenic overlook as you can get.", mapReveal: "Caverns" },
              BELOW: { detail: "Skyline Drive — a scenic overlook drive along the ridge.", mapReveal: "Skyline Drive" }
            }
          },
          {
            id: "sat-later-activity",
            label: "Evening: Mini Golf & Arcade",
            detail: "Bumper cars and arcade time too.",
            secret: false
          },
          {
            id: "sat-evening",
            label: "Evening",
            secret: true,
            revealAt: "2026-09-05T17:30",
            lockedLabel: "SURPRISE",
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
              RISK: { detail: "Chairlift + tubing — 10:00 AM to 2:00 PM. Wear shoes you can move in.", mapReveal: "Chairlift & Tubing" }
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
            choiceKey: "sundayEvening",
            revealAt: "2026-09-06T16:30",
            lockedLabel: "Evening plans",
            lockedHint: "The Wanderer already decided this one. The details show up evening-of.",
            options: {
              CHARM: { detail: "Paint & Sip — no talent required, just show up.", mapReveal: "Paint & Sip" },
              CHALLENGE: { detail: "Mini golf, bumper cars, arcade — game on.", mapReveal: "Game Night" }
            }
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
