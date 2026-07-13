# Gangatirtham — The River Journey (the narrative engine)

> **The central narrative device. LOCKED.** The website is not "75 Places," not "FACE GANGA," not a book landing page. It is **The Biography of a River**. The river is the protagonist; places are chapters; the eight stages are emotional states. Every content type — place pages, book chapters, FACE entities, Sankalp — connects back to these eight stages. This document is the spine; the canonical taxonomy in code is `lib/journey.ts`.

## The realization

The eight stages are **Birth · Naming · Testing · Gathering · Reckoning · Working Life · Wound · Return.** That is not a river — **that is a life.** A visitor who has never heard of Devprayag, Prayagraj, Bhagalpur, or Farakka still understands it, because the emotional structure is universal: born, named, tested by the world, gathered to, reckoning with mortality, the long working years, a late wound, a return. Once the site has a story, every design decision gets easier:

- **The Book** is not a product — it is *Volume I of the river's biography.*
- **FACE** is not four random categories — it is *the festivals/art/craft/environment of a feeling* (Birth→Environment, Naming→Art, Testing→Festivals, Working Life→Craft, Wound→Environment…).
- **Sankalp** is not "Support Us" — it is *"Which part of the river's life would you like to keep alive?"*

## The throughline

A single life told in first water. A drop wakes at the glacier **already knowing it will end** (Birth), receives a self at the confluence (Naming), is adored and exploited by the first hands (Testing), is gathered to by the largest human tide on earth, met through one face (Gathering), reaches its still centre where dying is the point and is met with grave peace (Reckoning), gets up the next morning to simply work, unworshipped (Working Life), takes the one wound it does not deserve (Wound), and — refusing to end on that wound — widens past being a river at all and is **released** into the sea and the sky it fell from (Return). **Two movements:** Descent (1–7) and Return (8); the Wound is the hinge. **Karuna is exactly one beat; the arc ends in release, not despair.**

## The eight stages

| № | Stage | Emotional state | Place (chapter) · km · temp | Book | FACE | A lamp here keeps alive… |
|---|---|---|---|---|---|---|
| 1 | **Birth** | Wonder, shadowed by mortality | Gaumukh · 0 · glacial ★ | Vol. I Ch. 1 | Environment (stewardship) | the watch on the origin — the glacier's retreat |
| 2 | **Naming** | Quiet recognition | Devprayag · 230 · glacial | Ch. 2 | Art | language & lineage — the manuscript of the name |
| 3 | **Testing** | Clear-eyed love | Haridwar · 320 · meltwater | Ch. 3 | Festivals (labour) | the hands behind the aarti |
| 4 | **Gathering** | Vast belonging | Prayagraj · 1,230 · silt (pivot) | Ch. 4 | Festivals (multitude) | one face among the millions |
| 5 | **Reckoning** | Grave peace | Kashi · 1,384 · warm ★ | Ch. 5 | Art | the dignity of the crossing (the centre lamp) |
| 6 | **Working Life** | Unworshipped dignity | Patna 1,700 / Bhagalpur 1,950 · sandbar | Ch. 6 | Craft | the makers — silk, river-trade |
| 7 | **Wound** | Grief, held (karuna) | Farakka 2,200 · delta | Ch. 7 | Environment (**obituary**) | a vigil — the dolphin survey, the chained river |
| 8 | **Return** | Release, homecoming | Sundarbans 2,450 → Ganga Sagar 2,525 · delta amber ★ | Ch. 8 | Festivals (release) | the cycle — the dawn aarti, the standing lamp |

★ = the three launch anchors (cold pole · emotional centre · warm pole).

### Homepage card copy (≤ 40 words/stage; the river is "she")

1. **Birth** — *She wakes in the glacier already knowing she will end — and begins anyway.*
2. **Naming** — *Where two waters meet she is given a name and becomes herself: Ganga.*
3. **Testing** — *The first hands worship her and use her in the very same gesture.*
4. **Gathering** — *The largest crowd on earth comes to her; she meets it as one face.*
5. **Reckoning** — *At her still centre, dying is the point — and she holds it without breaking.*
6. **Working Life** — *She rises the next morning and simply works, carrying a country that never thanks her.*
7. **Wound** — *Here we put her in chains; the river that was a river begins to thin.*
8. **Return** — *She widens past being a river at all — given back to the sea and sky.*

EN + HI copy is authored in `lib/journey.ts`.

## The connective model — `journeyStage`

`journeyStage` is to **emotional** architecture what `riverPosition.km` is to **chromatic** architecture: one derived-but-confirmable axis, carried first-class by every content document, that reorganises the product **by feeling, not by content type.**

- **Deterministic derivation (parallel, not serial):** km branches to BOTH `temperature` (read straight from km) AND `journeyStage` (`kmToStage(km)`, editor-overridable) — two monotonic axes from one input, i.e. `km → temperature` and `km → journeyStage`, **never** `km → journeyStage → temperature`. Emotion can never reorder the locked descent; a stage never invents a colour; colour never routes through a stage.
- **Place pages** carry `journeyStage` (+ optional `journeyStageSecondary` — the split escape hatch). Lateral rails prefer same-stage → next-stage siblings: wandering becomes *lingering in one mood, then crossing into the next.*
- **Book chapters** — each `tableOfContents[].journeyStage`; **the Vol. I ToC is the 8-stage arc.**
- **FACE entities** carry `journeyStage`; the register is a function of stage — **the obituary register is schema-permitted only at stage 7** (the Karuna Guard).
- **Sankalp** campaigns carry `journeyStage` ("which part of her life to keep alive").
- **One cross-type query** `*[journeyStage == $n]` assembles a "stage view" — every place + chapter + FACE entity + lamp that lives in one emotional state.

## Site manifestation

- **The Waterline / Descent Gauge** becomes the 8-stop spine: the marker warms monotonically source→ocean; at exactly one point (stage 7, the barrage) the stroke is **interrupted** and the marker **stutters** — the single visual signature of the one grief beat — then mends and opens into the horizon at stage 8, where it rests. The mono tick reads `km · place · stage-name`.
- **Homepage order (LOCKED):** The River → The Book → **The Journey (8 stages)** → FACE → Sankalp. The Journey section replaces the old 75-Places grid; cards expand to the Book / Place / FACE connections.
- **Place template:** a stage badge (`V · The Reckoning`); cold search visitors still lead with the place's distinct truth + answer (the badge is secondary chrome).
- **Library:** the ToC renders as the 8-stage arc, frontispiece → horizon.
- **FACE-ganga:** viewable by stage; Environment shows the obituary register only at stage 7.
- **Sankalp:** each campaign framed by its stage; the floated lamp starts from the stage's position on the Waterline.

## Locked decisions

1. **Bhagalpur split** — primary stage 6 (silk/Craft); the dolphin is a *subordinate* secondary stage-7 reference, never co-equal. The place leads with the silk truth.
2. **The Wound = one beat** — Farakka's chain is the dominant truth; the Bhagalpur dolphin and the Sundarbans threshold are its two facets, not three grief stages.
3. **Derive from km** — `journeyStage` is derived from km, editor-confirmable only at the sanctioned 6/7 and 7/8 splits.
4. **No `/journey` route for v1** — the homepage Journey lens + the per-page stage badge carry it. A dedicated "travel by feeling" route is post-v1.
5. **SEO / cold arrival** — place pages keep leading with the place's distinct truth + query answer; the stage vocabulary is secondary chrome, never the page's primary label.

## Implementation status (M4.5)

- `lib/journey.ts` — canonical taxonomy + `kmToStage` + EN/HI card copy. ✅
- `journeyStage` on `place` (+ secondary), `book.tableOfContents`, `festival`/`art`/`craft`/`environmentalIssue`, `sankalpCampaign`; the **Karuna Guard** on `environmentalIssue.register`. ✅
- Homepage **Journey** section (`HomeJourney` + expandable `JourneyCard`), reordered River → Book → Journey → FACE → Sankalp. ✅
- **Pending:** wire the place template's stage badge + DescentGauge stage readout; stage-aware lateral rails; the marker-stutter at stage 7; tag the seed/fixture content with stages.
