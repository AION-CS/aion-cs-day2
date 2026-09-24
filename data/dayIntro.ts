/**
 * The home page's day intro: what the day is about, the story that runs through the three routes, and
 * "What's in it for you" (WIIFM), the personal pay-off of each skill. Only facts the day's own material and
 * cases state (DigitalIT Solutions, its funnel of 24,000 visitors and 4 signed contracts, its 38 clients, the
 * €150,000 budget over four months).
 */

export const DAY_INTRO = {
  about:
    "Today is about what happens between a prospect's first look at your website and the day a client signs, and what happens to that client afterwards. You learn how a buyer's reason for acting decides which sales action fits, where prospects drop out of a funnel, what three ways of keeping clients are worth in euros, and how to spend a limited budget on keeping more of them.",
  caseLine:
    "One case runs through the whole day: DigitalIT Solutions GmbH, a mid-size B2B IT services vendor in Germany that sells project implementations and retainer support contracts. The managing director's brief is three phrases long: many leads, few closings, weak retention. In a year its website had 24,000 visitors and its funnel ended in 4 signed contracts.",
  story: [
    {
      route: 1 as const,
      verb: "Diagnose",
      question: "Where does DigitalIT Solutions lose prospects between the website and the signature, and what does the repeat-purchase rate say about the clients it already has?",
      output: "Diagnostic Note",
    },
    {
      route: 2 as const,
      verb: "Calculate",
      question: "Three ways to keep clients (a personal account manager, a discount, a value-added service): what does each net in euros for its 14 project clients and its 24 retainer clients, and which do you recommend?",
      output: "Calculation Note",
    },
    {
      route: 3 as const,
      verb: "Decide",
      question: "With €150,000 and four months, which of four line items do you fund, in what order, who owns each result, and what do you postpone?",
      output: "Decision Memo",
    },
  ],
  wiifm: [
    {
      skill: "Read a funnel by its gaps, not its counts",
      payoff: "Counts fall at every stage of any sales pipeline, so the biggest drop is not automatically the biggest problem. Comparing each step with its benchmark, in percentage points, shows where you really lose people, and it works on any pipeline report you are handed.",
      route: 1 as const,
    },
    {
      skill: "Match the sales action to the buyer's reason",
      payoff: "Trust, price, benefit and relationship each call for different proof. You learn to name the reason first, so you stop offering a discount to a buyer who is worried about risk or who lost their contact person.",
      route: 1 as const,
    },
    {
      skill: "Put a euro figure on a retention idea",
      payoff: "Extra orders times the profit on each, minus what the idea costs. Any proposal you meet at work (“let's add a service”, “let's cut the price”) then arrives with a number you can defend or challenge, including a negative one.",
      route: 2 as const,
    },
    {
      skill: "Know when a price cut costs more than it wins",
      payoff: "A discount is paid on every order, including the ones that would have come anyway. You can check its break-even in a minute and explain to a colleague why the same discount pays in one client group and loses money in another.",
      route: 2 as const,
    },
    {
      skill: "Decide with a budget that cannot fund everything",
      payoff: "You practise choosing, starting the measurement before the action it measures, saying openly what you leave out and when you will come back to it. That is what gets a budget request approved and then carried out, in any role.",
      route: 3 as const,
    },
    {
      skill: "Leave with three documents you can reuse",
      payoff: "A Diagnostic Note, a Calculation Note and a Decision Memo, each built on a case file. Use them as templates the next time you have to diagnose a funnel, compare options in euros or ask for budget, and give each KPI an owner, a rhythm and a trigger.",
      route: 3 as const,
    },
  ],
} as const;
