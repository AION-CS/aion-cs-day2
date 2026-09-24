import type { MaterialId } from "@/data/materialIndex";

/**
 * The "In plain words" box under each card's scan line: the idea in everyday language, why it matters for the
 * day's case and tasks, and how to read the diagram or interactive below. Written for someone who has never met
 * the topic. Typed as a full Record so a card without an explanation fails the typecheck. Every control and label
 * named in `picture` was checked against the component that draws it.
 */
export type PlainExplain = {
  /** The idea itself, in everyday words. */
  idea: string;
  /** Why the learner should care, tied to the case or the task. */
  why: string;
  /** How to read or use the picture below. Omitted for cards without a diagram to read. */
  picture?: string;
};

export const MATERIAL_PLAIN: Record<MaterialId, PlainExplain> = {
  /* ---------------------------------------------------------------- Materi A */
  A1: {
    idea: "Before you decide what to say in a sales conversation, ask why this buyer would act at all. Most buyers have one main reason: they want to feel safe (trust), they want the total cost to be clear (price), they want to see a result (benefit), or they want to keep working with people they know (relationship). Each reason calls for a different action from you, and a different kind of proof.",
    why: "Both tasks that follow start from the buyer's reason. A discount offered to a buyer who is worried about risk gives margin away and leaves the worry exactly where it was.",
    picture: "The four boxes on the left are the buying motives, and the boxes on the right are the strategy each one calls for. Click a motive: the panel underneath lists the proof that buyer looks for, and adds a note on how it looks in a German company.",
  },
  A2: {
    idea: "A customer journey is the list of moments where a buyer and your company meet, in order. Here they are grouped into three phases. Pre-sales: the buyer is looking around and no seller has spoken to them. Sales: a seller and a named contact are in a booked or held conversation, up to and including the signature. After-sales: everything that happens after the signature.",
    why: "In Task 1 you sort the six stages of DigitalIT Solutions' funnel into these phases. The sort only works if you ask the same two questions of every stage: is a named contact in a booked or held conversation, and has the contract been signed?",
    picture: "The eight boxes in the middle are touchpoints, the bands on the left name the three phases, and the two dashed lines are the boundaries: where sales starts, and where it ends at the signature. Click a touchpoint to read what it covers and who usually owns it. Further down, the worked example sorts a different company's stages: click one to see why it sits where it does.",
  },
  A3: {
    idea: "Trust, relevance and consistency are three things a buying committee checks again and again. Trust: can I rely on this vendor? Relevance: is this about my problem? Consistency: is what they promise now what they do later? In Germany each one meets a hard local rule, for example that tracking and cold e-mail need consent.",
    why: "When a step in DigitalIT's funnel leaks, one of the three may have failed there, or between two steps. Asking “did a promise break between two touchpoints?” points you to better questions than “the prospects are not interested”.",
    picture: "The grid has three rows (trust, relevance, consistency) and three columns (pre-sales, sales, after-sales). Click a cell to read one concrete German B2B IT example. Read a row from left to right: the same mechanism needs different proof in each phase.",
  },
  A4: {
    idea: "Three numbers do most of the work in this course. Conversion rate: of the people at one stage, how many reach the next? Customer value: how much profit one client brings over the whole relationship. Repurchase rate: of your existing clients, how many order again within a stated time?",
    why: "Task 1 asks you to read a funnel exactly this way: divide each stage by the stage above it, compare with a benchmark, and give the difference in percentage points. If you divide by the wrong number, every later answer moves with it.",
    picture: "The picture is a worked example on a different, made-up company (Alpenwerk), and nothing on it is clickable. Read each row from left to right: the two counts, the percentage they give, the reference figure (ref), and the gap. The hatched bar is the size of the gap, and its sign tells you whether the company is above or below its reference.",
  },

  /* ---------------------------------------------------------------- Materi B */
  B1: {
    idea: "A lever is one thing you can do to make existing clients order again. This day compares three: a personal account manager, a discount, and a service that adds value on top of the contract. Each one answers a different reason a client might leave (relationship, price, perceived value), and each one costs money in a different way.",
    why: "In Task 2 you put a euro figure on all three, in two client segments. Picking a lever that answers the wrong reason spends the money without touching why clients leave.",
    picture: "Each row is one option: the lever on the left, the buying motive it answers in the middle, and how its cost behaves on the right. A solid block means the cost is paid per client, whatever the orders. Dashed stripes mean the cost is paid again on every order. Click a row to read what the lever is, how its cost is counted and where it fits.",
  },
  B2: {
    idea: "Not every client behaves the same. Project clients place few, large orders and are rarely in contact between projects. Retainer clients place many small orders and are in regular contact. The same lever lands differently on each.",
    why: "Task 2 has one grid that covers both segments. Without this idea the figures look like a surprise: the same discount can pay in one segment and lose money in the other.",
    picture: "Along the bottom is how often a client orders (rare to frequent), and up the side is how large each order is (small to large). The two circles show where the segments sit. Click one to read how levers land on it.",
  },
  B3: {
    idea: "Net impact answers one question: after paying for it, does the lever make money? Count the extra orders it brings, multiply by the profit on each order, and subtract what the lever costs. The result can be negative, and that is a valid answer.",
    why: "This is the calculation behind every cell of the Task 2 grid. Only one step changes from lever to lever: how the cost is counted.",
    picture: "Read the four boxes from left to right: extra orders, times gross profit, minus cost, equals net impact. Only the third box changes between levers. The worked example below (Alpenwerk, made up) runs the same four steps for two levers and shows how the same uplift gives two different verdicts.",
  },
  B4: {
    idea: "A discount is paid on every order, including the ones that would have come anyway. So the more repeat orders a segment already places, the more a discount costs before it wins a single extra order. The break-even is the uplift a discount has to reach just to cover itself.",
    why: "In Task 2 the discount wins in one segment and loses in the other. This card shows the mechanism, so you can explain why and not only read the number.",
    picture: "Two sliders: “Uplift in the repeat rate” moves the dotted vertical marker along the bottom, and “Existing repeat orders” changes how many orders the discount is paid on. The solid line is a lever with a fixed cost per client, and the dashed line is the discount. Where a line crosses the zero line it breaks even. Raise the existing orders and only the dashed line moves.",
  },

  /* ---------------------------------------------------------------- Materi C */
  C1: {
    idea: "A retention plan is not one action. It is a set of actions, and each one needs a goal above it (what you want to change, by how much, by when) and a KPI below it (the number that shows whether it worked). If you cannot write an action in that goal → action → KPI form, it is not ready for money.",
    why: "Task 3 gives you four line items and one budget. Each item you fund needs its own KPI, and this card tells you which KPI belongs to which item.",
    picture: "Each row is one worked chain from Alpenwerk (made up): goal on the left, action in the middle, KPI on the right, with arrows between. Click a row. The panel underneath says what holds the chain together and how it would fail.",
  },
  C2: {
    idea: "A one-off fix spends money and then nobody looks at the result. A governed system does the same action but adds an owner who reads a KPI on a fixed rhythm, and a rule for when to change course. That loop is what makes an action correctable.",
    why: "In Task 3 you must say who owns each funded item and what makes them act. Without the loop, a cut you make cannot be reviewed either.",
    picture: "The four boxes on the left form a loop: KPI, review, trigger, act, and back to the KPI. The dashed box on the right is a one-off discount campaign: a single step and nothing that reads the result afterwards. Click a step of the loop to read what happens there.",
  },
  C3: {
    idea: "Some actions serve every client for the same cost (a dashboard, a booking automation). Others cost more with every client, or with every order. When money is short, you need to know which is which before you cut anything.",
    why: "Task 3 asks you to decide what to fund and what to leave out. Cutting a fixed-cost foundation and narrowing a per-client lever to one segment have different consequences, and the memo has to name them.",
    picture: "Move the “Clients served” slider. The solid line is a system built once for a flat cost. The dashed line is an action that costs the same for each client, so it rises as the client base grows. A faint vertical line marks where the two costs are equal: with fewer clients than that, the system is the dearer of the two.",
  },
  C4: {
    idea: "A KPI without an owner, a rhythm and a trigger is just a number. Governance means three things: one named role acts on the KPI (the owner), looks at it on a fixed schedule (the cadence), and has a written number that decides when to escalate and to whom (the trigger).",
    why: "Block 3.4 of Task 3 asks for exactly these three things for every item you fund, and Block 3.5 asks what you postpone and when you will pick it up.",
    picture: "Each row of the table is one KPI with its owner, its cadence and its trigger. Click a row to read why each of the three is set the way it is, and who the KPI escalates to. Below the table, the role profiles show what each owner option typically does and can change, which is what the owner test is applied to.",
  },
};
