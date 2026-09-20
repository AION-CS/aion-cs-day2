import type { Phase, StageId } from "@/data/funnel";

/**
 * Task 1 · Block 1.1 — the six funnel stages as touchpoints to sort into a journey phase. The phase rule is
 * taught in Materi A · A2. `truth` is never shown to the learner outside the mentor answer key.
 */
export type Touchpoint = {
  id: StageId;
  label: string;
  truth: Phase;
  /** One question that teaches how to test the item. Shown for every row at once, never only the wrong ones. */
  clue: string;
  /** Why it belongs where it does — opened only after two genuine checks, and recorded in the export. */
  why: string;
  /** For the mentor answer key: why each rejected phase is rejected. */
  rejected: Partial<Record<Phase, string>>;
};

export const TOUCHPOINTS: Touchpoint[] = [
  {
    id: "visitors",
    label: "Website visitors",
    truth: "pre",
    clue: "Has anyone on the buyer's side told you who they are, or spoken to a seller?",
    why: "Anonymous traffic: awareness. Nobody is in a conversation with a seller yet, so it is pre-sales.",
    rejected: {
      sales: "No named buyer contact and no scheduled conversation exists yet, so the sales test is not met.",
      after: "No contract exists, so nothing can be after-sales.",
    },
  },
  {
    id: "leads",
    label: "Leads (contact / download)",
    truth: "pre",
    clue: "Is a named buyer contact in a scheduled or held conversation with a seller, or has the person only left contact details?",
    why: "A contact form or a download is first contact. A named person exists, but no seller has a scheduled or held conversation with them yet, so it is still pre-sales.",
    rejected: {
      sales: "First contact is not yet a conversation: the sales test needs a scheduled or held conversation with a seller.",
      after: "No contract exists.",
    },
  },
  {
    id: "booked",
    label: "Consultation booked",
    truth: "sales",
    clue: "Is there now a date in a seller's calendar against a named buyer contact?",
    why: "A booked consultation puts a named contact and a date on a seller's plan. By the convention taught in A2, sales starts at the scheduled conversation. This is the boundary case of the sort.",
    rejected: {
      pre: "The buyer has moved beyond first contact: a scheduled conversation with a named contact exists.",
      after: "No contract exists.",
    },
  },
  {
    id: "held",
    label: "Consultation held",
    truth: "sales",
    clue: "Which part of the journey is 'consultation' named in, before any proposal?",
    why: "The consultation is the first live sales conversation. It sits before proposal and contract, so it is sales.",
    rejected: {
      pre: "A seller and a named buyer contact have actually met: that is past awareness and first contact.",
      after: "No contract exists.",
    },
  },
  {
    id: "proposal",
    label: "Proposal sent",
    truth: "sales",
    clue: "Is the contract signed at this point, or is the buyer still deciding?",
    why: "A proposal is written for a buyer who has not yet decided. It belongs to sales, before negotiation and signature.",
    rejected: {
      pre: "The buyer has had a consultation and now holds a written offer.",
      after: "The contract is not signed; the buyer is still deciding.",
    },
  },
  {
    id: "signed",
    label: "Contract signed",
    truth: "sales",
    clue: "Which comes first in the journey: the signature or onboarding? Which phase does the boundary rule give the signature to?",
    why: "The signature is the last sales event. After-sales starts with onboarding, support and renewal, which all come after it. This is why the funnel has no stage in after-sales.",
    rejected: {
      pre: "The buyer has decided; this is the end of the conversation, not its start.",
      after: "The signature closes sales. Onboarding, support and renewal open after-sales, so they come after the signature.",
    },
  },
];
export const TOUCHPOINT_BY_ID = Object.fromEntries(TOUCHPOINTS.map((t) => [t.id, t])) as Record<StageId, Touchpoint>;
