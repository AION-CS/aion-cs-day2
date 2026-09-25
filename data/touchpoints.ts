import type { Phase, StageId } from "@/data/funnel";
import { tt } from "@/lib/lang";

/**
 * Task 1 · Block 1.1 — the six funnel stages as touchpoints to sort into a journey phase. The phase rule is
 * taught in Materi A · A2. `truth` is never shown to the learner outside the mentor answer key.
 * Learner-facing texts are getters (English or German, read when shown); `rejected` is mentor-only and stays English.
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
    get label() {
      return tt("Website visitors", "Website-Besucher");
    },
    truth: "pre",
    get clue() {
      return tt(
        "Has anyone on the buyer's side told you who they are, or spoken to a seller?",
        "Hat jemand auf Käuferseite gesagt, wer er ist, oder mit einem Verkäufer gesprochen?",
      );
    },
    get why() {
      return tt(
        "Anonymous traffic: awareness. Nobody is in a conversation with a seller yet, so it is pre-sales.",
        "Anonymer Traffic: Aufmerksamkeit. Noch spricht niemand mit einem Verkäufer, also ist es Pre-Sales.",
      );
    },
    rejected: {
      sales: "No named buyer contact and no scheduled conversation exists yet, so the sales test is not met.",
      after: "No contract exists, so nothing can be after-sales.",
    },
  },
  {
    id: "leads",
    get label() {
      return tt("Leads (contact / download)", "Leads (Kontakt / Download)");
    },
    truth: "pre",
    get clue() {
      return tt(
        "Is a named buyer contact in a scheduled or held conversation with a seller, or has the person only left contact details?",
        "Führt ein namentlich bekannter Ansprechpartner des Käufers ein geplantes oder geführtes Gespräch mit einem Verkäufer, oder hat die Person nur Kontaktdaten hinterlassen?",
      );
    },
    get why() {
      return tt(
        "A contact form or a download is first contact. A named person exists, but no seller has a scheduled or held conversation with them yet, so it is still pre-sales.",
        "Ein Kontaktformular oder ein Download ist der Erstkontakt. Es gibt eine namentlich bekannte Person, aber noch hat kein Verkäufer ein geplantes oder geführtes Gespräch mit ihr, also ist es weiterhin Pre-Sales.",
      );
    },
    rejected: {
      sales: "First contact is not yet a conversation: the sales test needs a scheduled or held conversation with a seller.",
      after: "No contract exists.",
    },
  },
  {
    id: "booked",
    get label() {
      return tt("Consultation booked", "Beratungstermin gebucht");
    },
    truth: "sales",
    get clue() {
      return tt(
        "Is there now a date in a seller's calendar against a named buyer contact?",
        "Steht jetzt ein Termin im Kalender eines Verkäufers, verbunden mit einem namentlich bekannten Ansprechpartner des Käufers?",
      );
    },
    get why() {
      return tt(
        "A booked consultation puts a named contact and a date on a seller's plan. By the convention taught in A2, sales starts at the scheduled conversation. This is the boundary case of the sort.",
        "Ein gebuchter Beratungstermin bringt einen namentlich bekannten Ansprechpartner und einen Termin in die Planung eines Verkäufers. Nach der in A2 vermittelten Konvention beginnt der Vertrieb beim geplanten Gespräch. Das ist der Grenzfall der Zuordnung.",
      );
    },
    rejected: {
      pre: "The buyer has moved beyond first contact: a scheduled conversation with a named contact exists.",
      after: "No contract exists.",
    },
  },
  {
    id: "held",
    get label() {
      return tt("Consultation held", "Beratung durchgeführt");
    },
    truth: "sales",
    get clue() {
      return tt(
        "Which part of the journey is 'consultation' named in, before any proposal?",
        "In welchem Teil der Journey liegt die „Beratung“, noch vor jedem Angebot?",
      );
    },
    get why() {
      return tt(
        "The consultation is the first live sales conversation. It sits before proposal and contract, so it is sales.",
        "Die Beratung ist das erste echte Verkaufsgespräch. Sie liegt vor Angebot und Vertrag, also gehört sie zum Vertrieb.",
      );
    },
    rejected: {
      pre: "A seller and a named buyer contact have actually met: that is past awareness and first contact.",
      after: "No contract exists.",
    },
  },
  {
    id: "proposal",
    get label() {
      return tt("Proposal sent", "Angebot versendet");
    },
    truth: "sales",
    get clue() {
      return tt(
        "Is the contract signed at this point, or is the buyer still deciding?",
        "Ist der Vertrag an dieser Stelle schon unterzeichnet, oder entscheidet der Käufer noch?",
      );
    },
    get why() {
      return tt(
        "A proposal is written for a buyer who has not yet decided. It belongs to sales, before negotiation and signature.",
        "Ein Angebot wird für einen Käufer geschrieben, der noch nicht entschieden hat. Es gehört zum Vertrieb, vor Verhandlung und Unterschrift.",
      );
    },
    rejected: {
      pre: "The buyer has had a consultation and now holds a written offer.",
      after: "The contract is not signed; the buyer is still deciding.",
    },
  },
  {
    id: "signed",
    get label() {
      return tt("Contract signed", "Vertrag unterzeichnet");
    },
    truth: "sales",
    get clue() {
      return tt(
        "Which comes first in the journey: the signature or onboarding? Which phase does the boundary rule give the signature to?",
        "Was kommt in der Journey zuerst: die Unterschrift oder das Onboarding? Welcher Phase ordnet die Grenzregel die Unterschrift zu?",
      );
    },
    get why() {
      return tt(
        "The signature is the last sales event. After-sales starts with onboarding, support and renewal, which all come after it. This is why the funnel has no stage in after-sales.",
        "Die Unterschrift ist das letzte Vertriebsereignis. After-Sales beginnt mit Onboarding, Support und Verlängerung, die alle danach kommen. Deshalb hat der Trichter keine Stufe im After-Sales.",
      );
    },
    rejected: {
      pre: "The buyer has decided; this is the end of the conversation, not its start.",
      after: "The signature closes sales. Onboarding, support and renewal open after-sales, so they come after the signature.",
    },
  },
];
export const TOUCHPOINT_BY_ID = Object.fromEntries(TOUCHPOINTS.map((t) => [t.id, t])) as Record<StageId, Touchpoint>;

/* ------------------------------------------------------------------ the tests behind the sort (taught in Materi A2) */

/** One test question per phase, phrased so a learner can apply it to a touchpoint. Taught in A2; repeated on request in Block 1.1. */
export const PHASE_TESTS: { phase: Phase; name: string; test: string; belongs: string; notBelongs: string }[] = [
  {
    phase: "pre",
    get name() {
      return tt("Pre-sales", "Pre-Sales");
    },
    get test() {
      return tt(
        "Is a named buyer contact in a scheduled or held conversation with a seller? If not, and the contract is not signed, it is pre-sales.",
        "Führt ein namentlich bekannter Ansprechpartner des Käufers ein geplantes oder geführtes Gespräch mit einem Verkäufer? Wenn nicht und der Vertrag nicht unterzeichnet ist, ist es Pre-Sales.",
      );
    },
    get belongs() {
      return tt(
        "Awareness and first contact: anonymous traffic, a contact-form message, a whitepaper download, a call-back request.",
        "Aufmerksamkeit und Erstkontakt: anonymer Traffic, eine Nachricht über das Kontaktformular, ein Whitepaper-Download, eine Rückrufbitte.",
      );
    },
    get notBelongs() {
      return tt(
        "A booked or held conversation with a named contact (that is sales), and anything after the signature.",
        "Ein gebuchtes oder geführtes Gespräch mit einem namentlich bekannten Ansprechpartner (das ist Vertrieb) und alles nach der Unterschrift.",
      );
    },
  },
  {
    phase: "sales",
    get name() {
      return tt("Sales", "Vertrieb");
    },
    get test() {
      return tt(
        "Is a named buyer contact in a scheduled or held conversation with a seller, and is the contract not yet signed? If yes, it is sales. The signature itself is the last sales event.",
        "Führt ein namentlich bekannter Ansprechpartner des Käufers ein geplantes oder geführtes Gespräch mit einem Verkäufer, und ist der Vertrag noch nicht unterzeichnet? Wenn ja, ist es Vertrieb. Die Unterschrift selbst ist das letzte Vertriebsereignis.",
      );
    },
    get belongs() {
      return tt(
        "A booked or held consultation, a proposal, negotiation, and the contract up to and including its signature.",
        "Ein gebuchter oder geführter Beratungstermin, ein Angebot, die Verhandlung und der Vertrag bis einschließlich seiner Unterschrift.",
      );
    },
    get notBelongs() {
      return tt(
        "A person who has only left contact details, and onboarding, support and renewal.",
        "Eine Person, die nur Kontaktdaten hinterlassen hat, sowie Onboarding, Support und Verlängerung.",
      );
    },
  },
  {
    phase: "after",
    get name() {
      return tt("After-sales", "After-Sales");
    },
    get test() {
      return tt(
        "Does this event come after the signature? If yes, it is after-sales.",
        "Kommt dieses Ereignis nach der Unterschrift? Wenn ja, ist es After-Sales.",
      );
    },
    get belongs() {
      return tt("Onboarding, support, renewal and the next project.", "Onboarding, Support, Verlängerung und das nächste Projekt.");
    },
    get notBelongs() {
      return tt(
        "Anything up to and including the signature. A funnel that counts people up to the signature has no stage here.",
        "Alles bis einschließlich der Unterschrift. Ein Trichter, der Personen bis zur Unterschrift zählt, hat hier keine Stufe.",
      );
    },
  },
];

/** The distinguishing test for each confusable pair of phases. */
export const PHASE_PAIR_TESTS: { pair: string; test: string }[] = [
  {
    get pair() {
      return tt("Pre-sales or sales?", "Pre-Sales oder Vertrieb?");
    },
    get test() {
      return tt(
        "Has a name and a date been put in a seller’s plan (a booked consultation), or has the person only left details? A name and a date means sales.",
        "Stehen ein Name und ein Termin in der Planung eines Verkäufers (ein gebuchter Beratungstermin), oder hat die Person nur Daten hinterlassen? Name und Termin bedeuten Vertrieb.",
      );
    },
  },
  {
    get pair() {
      return tt("Sales or after-sales?", "Vertrieb oder After-Sales?");
    },
    get test() {
      return tt(
        "Is the signature part of this event, or has it already happened? The signature closes sales; only what follows it is after-sales.",
        "Gehört die Unterschrift zu diesem Ereignis, oder ist sie schon geschehen? Die Unterschrift schließt den Vertrieb ab; erst was danach kommt, ist After-Sales.",
      );
    },
  },
  {
    get pair() {
      return tt("A phase with nothing in it", "Eine Phase ohne Inhalt");
    },
    get test() {
      return tt(
        "If no stage passes the test of a phase, that phase stays empty. A phase is a test, not a quota.",
        "Besteht keine Stufe den Test einer Phase, bleibt diese Phase leer. Eine Phase ist ein Test, keine Quote.",
      );
    },
  },
];
