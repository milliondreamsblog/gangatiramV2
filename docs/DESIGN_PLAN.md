# Ganga Tiram — Frontend Design Plan

*The strategy an agency would pitch: one story, two conversions, zero confusion.*

---

## 1. Strategy first: what this site must do

**Two conversions. Everything else serves them.**

| Goal | Visitor gives | Emotional trigger |
|---|---|---|
| **Buy the book** | Money → funds the mission | "I want to hold this journey in my hands" |
| **Volunteer / contribute** | Time or support → does the mission | "I want to be part of her story" |

**Audiences** (design for all four, in this order):
1. Devotees & diaspora — buy from love; need reverence, not marketing.
2. Culture & travel readers — buy from beauty; need to *see inside* the book.
3. Young volunteers — act from urgency; need a concrete, local, doable ask.
4. Low-tech visitors (parents, elders) — need big type, plain words, obvious buttons.

**The single message** every section must ladder up to:

> *For 2,525 km she has fed our soul, body, and mind. Now she needs ours.*

The book is the **artifact** of devotion. Volunteering is the **act** of devotion. FACE is **how** the mission works. The river journey is **why** you should care.

---

## 2. The creative concept: "The page is the river"

One continuous scroll = one journey downstream. The visitor *travels* the Ganga from
glacier to sea as they scroll. This is the "river design" — not decoration, but the
site's skeleton.

**The River Line.** A single SVG river thread flows down the entire homepage,
connecting every section like stations on a pilgrimage:

- **Source (hero):** a thin, icy-teal thread — born at Gomukh.
- **Midstream (journey, book, FACE):** widens, warms to river-blue — life on her banks.
- **The Wound (environment section):** the line frays / darkens — the crisis.
- **Delta (act + footer):** the line splits into distributaries and opens into the
  sea — your action is where she is released.

The line is drawn on scroll (SVG `stroke-dashoffset` tied to scroll progress — Motion
library already in the stack). On mobile it becomes a slim left rail; sections dock to it.

**Temperature shift.** The page background subtly warms as you descend: glacial
cream-blue at top → warm cream midway → dusk amber at the delta. Felt, not seen.
(This idea existed in V1 as `temperature.ts` — it survives the redesign.)

---

## 3. Homepage blueprint (top → bottom)

```
┌──────────────────────────────────────────────┐
│ NAV: Journey · The Book · Mission · Act      │  4 items max. Gold "Get the Book"
├──────────────────────────────────────────────┤
│ 1 HERO — "2,525 Kilometers of Heritage"      │  Keep. River Line is born here,
│   [Get the Book]  [Begin the Journey]        │  a thin teal thread from the title.
├──────────────────────────────────────────────┤
│ 2 HER THREE GIFTS — Soul · Body · Mind       │  NEW. Triptych. See §4.
├──────────────────────────────────────────────┤
│ 3 THE JOURNEY — 8 stations on the line       │  Rework of places section. See §5.
│   → "Explore all 75 places"                  │
├──────────────────────────────────────────────┤
│ 4 THE BOOK — the conversion centerpiece      │  Full redesign. See §6.
├──────────────────────────────────────────────┤
│ 5 THE FACE OF GANGA — 4 mission pillars      │  Rework. See §7.
├──────────────────────────────────────────────┤
│ 6 THE WOUND — dark environmental interlude   │  NEW. The river line frays. See §8.
├──────────────────────────────────────────────┤
│ 7 ACT — Volunteer · Contribute · Share       │  Rework: "Take a Sankalp". See §8.
├──────────────────────────────────────────────┤
│ 8 DELTA FOOTER — line opens into the sea     │  Newsletter, credits, Radhanath
│                                              │  Swami inspiration note.
└──────────────────────────────────────────────┘
```

**Order rationale (agency logic):** feel (gifts) → believe (journey) → *desire (book)*
→ understand (FACE) → hurt (wound) → **act**. The book sits mid-page at peak goodwill;
the volunteer ask comes after the emotional low point, when motivation peaks. The
sticky mobile CTA stays "Get the Book" until the visitor passes The Wound — then it
switches to "Join the Mission."

---

## 4. "Her Three Gifts" — Soul · Body · Mind (new section)

The user-requested "history and nourishment" section. Three tall panels, river line
threading through all three:

| Panel | Copy angle | Imagery | Book tie-in |
|---|---|---|---|
| **SOUL** | Moksha, aartis, 1,000 leaf-lamps at Har Ki Pauri | Haridwar aarti photo (have it) | Varanasi & Haridwar chapters |
| **BODY** | Her water feeds 4 in 10 Indians; silk looms, farms, fisherfolk | Craft photo (have it) | Kanpur, Bhagalpur, Kolkata chapters |
| **MIND** | Kashi's 3,000 years of learning; ragas at dawn; poetry | Music/art photo (have it) | Kashi, Nabadwip, Mayapur chapters |

Each panel: one serif line ≤ 8 words, two sentences max, one place-name link into the
75-places explorer. This section is *the thesis*; it earns the ask that follows.

---

## 5. The Journey — 8 stations, 75 places

Adopt V1's eight stages as the narrative spine (they're already written and they're
excellent): **Birth · Naming · Testing · Gathering · Reckoning · Working Life ·
Wound · Return.**

- Each station = a dot on the River Line + stage name + its one-line card copy
  (already written in `docs/v1-reference/RIVER_JOURNEY.md`, e.g. Birth: *"She wakes
  in the glacier already knowing she will end — and begins anyway."*)
- Clicking a station filters the 75-place explorer to that stretch of river.
- Add `stage: 1–8` to each entry in `data.ts` (mechanical: assign by position in
  the downstream order).
- The existing photo cards stay — they become the "featured" places per station.

This turns "a list of 75 cards" into "eight chapters of a life," which is both more
creative *and* clearer.

---

## 6. The Book section — the inspiration engine (full redesign)

Sell the feeling, then the object, then the specs. Five beats:

1. **The object, hero-sized.** Real cover, large, gentle 3-D tilt on hover, soft
   shadow. No carousel controls fighting for attention — the book *is* the slide.
2. **Look inside.** 4–6 real spreads exported from the PDF as a horizontal
   swipe/scroll gallery with captions ("Gomukh, where she is born" …). This is the
   single highest-leverage addition: people buy photo books after seeing spreads.
   *(Asset task: export spreads from `GANGA TIRAM INSIDE.pdf` — straightforward.)*
3. **One voice from the book.** A full-width pull quote in serif — e.g. the
   Bhagavatam verse that opens the book, or a lyrical line from a chapter. Silence
   around it. This is the moment of reverence.
4. **What the book holds + what it funds.** Left: "75 places · 2,525 km · 240
   photographs · 300 pages." Right: "Every copy funds ghat cleanups and keeps
   weaver looms running." Purpose-purchase framing — the buyer joins the mission.
5. **The ask.** One gold button: **Get the Book — ₹—**. Price visible (hiding price
   costs trust and sales). Below, small line: *"Direct UPI. Shipped in 24h with
   tracking."* → existing checkout.

Authority note near the quote: *"A journey inspired by Radhanath Swami's* The
Journey Home." (Link out; quote sparingly — that book is copyrighted.)

---

## 7. The FACE of Ganga — from labels to promises

Keep the acronym; make each letter a **mission pillar with its own proof and its own
micro-action**. Current cards say what FACE *is*; redesigned cards say what FACE
*does*:

| Letter | Pillar headline | Proof stat | Micro-CTA |
|---|---|---|---|
| **F** — Festivals (digital) | "No festival dies if it is recorded" | 4K aarti & Kumbh archive | Watch a festival → |
| **A** — Art | "150 painters still paint her" | Madhubani, Kalighat, Patachitra | Meet the artists → |
| **C** — Craft | "50 looms still weave her" | Banarasi & Tussar silk families | See the craft → |
| **E** — Environment | "5,000 kg of plastic leaves her banks monthly" | cleanup + dolphin watch | Join a cleanup → |

Full-bleed photo cards (keep the current beautiful treatment), but the description is
replaced by *headline + stat + arrow*. E's arrow jumps to the Act section — E is the
bridge to volunteering.

Clarity rule: spell it once, plainly, above the cards: **"FACE is how we serve her:
Festivals, Art, Craft, Environment."** No jargon after that.

---

## 8. The Wound → the Act (environment + volunteer redesign)

**The Wound (new, short, dark).** One viewport. Background shifts to ink `#2D241E`.
The River Line visually frays into threads. Three stark stats (from the book's own
pollution passages — tanneries, glacier retreat, waste). One line of copy:
*"Here is where we put her in chains."* No button. Let it land.

**The Act (redesigned).** Background returns to warm cream — hope after grief:

> ### Which part of her life will you keep alive?
> *(the Sankalp framing — with the plain-language subtitle: "Volunteer, contribute, or share her story.")*

- **Volunteer** — reframed from generic form to *pick your stretch*: "Where are
  you?" (city dropdown of river cities from the 75) + interest + availability →
  existing modal, now feeling local and concrete.
- **Contribute** — keep, but state what each amount does ("₹500 = one cleanup kit").
- **Share** — the heritage kit download, unchanged.

Impact counters above the three cards (kg removed / looms funded / ghats archived) —
numbers make the mission feel real and audited.

---

## 9. Design system (evolve, don't replace)

The current palette stays — it's good and the user likes it:

| Token | Value | Role |
|---|---|---|
| Cream | `#FDFCF8` | page |
| Ink | `#2D241E` | text, Wound section |
| River Blue | `#3A7CA5` | **act/volunteer CTAs only** |
| Sand Gold | `#D4A373` | **buy CTAs only** |
| *new* Glacial Teal | `#8FBFBF` | River Line at source |
| *new* Delta Amber | `#C97B4A` | River Line at delta |

**Hard rules for clarity (the "everyone" requirement):**
- Gold always means *buy*; blue always means *act*. Never swapped, never mixed.
- One idea per viewport. Headline ≤ 8 words, subtext ≤ 2 lines.
- Body text ≥ 16 px mobile / 18 px desktop; contrast AA everywhere.
- Every image captioned (place name, state). Photos over illustrations.
- Nav: 4 items. Footer: real links only (kill the `href="#"` placeholders).
- Motion is garnish: reveals ≤ 600 ms, river-line draw tied to scroll, everything
  respects `prefers-reduced-motion`.
- Hindi headline subtitles are a Phase-3 nicety, not a launch need.

Type stays serif display + sans body. The serif carries the sacred register; the sans
carries instructions and forms.

---

## 10. Build phases (each shippable alone)

| Phase | Scope | Effort |
|---|---|---|
| **1. Book section** | Spreads export, look-inside gallery, pull quote, purpose framing, price CTA | The conversion win — do first |
| **2. River Line + Three Gifts** | SVG scroll-drawn line, triptych section, temperature shift | The creative signature |
| **3. Journey stations** | `stage` field in data, 8 stations UI, filtered explorer | Uses V1 copy as-is |
| **4. FACE + Wound + Act** | Pillar rework, dark interlude, Sankalp reframing, impact counters | The mission funnel |
| **5. Polish** | Sticky-CTA swap logic, reduced-motion, footer links, meta/OG/title | Launch hygiene |

*(Independent of design but before real launch: wire the forms to storage.)*
