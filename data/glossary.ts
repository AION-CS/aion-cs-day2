/**
 * Plain-language glossary. Every technical term, abbreviation or German word that
 * the material or a task uses is an entry here. In the text it becomes a dotted
 * link; a click opens the explanation. Write for someone who is NOT an expert:
 * short sentences, everyday words, one example where it helps.
 *
 * `match` lists every way the term is written. An all-capitals match ("CLV") is
 * matched exactly, so "ice" or "ale" in ordinary words never turns into a link.
 * Set `exactCase` when an ordinary word must only link in its capitalised form
 * (for example "Leads", so "leads to" is never a link).
 */
export type GlossEntry = {
  id: string;
  /** Heading of the explanation. */
  title: string;
  match: string[];
  /** Link only when the text is written exactly as in `match`. */
  exactCase?: boolean;
  /** The explanation, in the simplest words. */
  plain: string;
  example?: string;
  /** Where the idea comes from, when it is a named framework or law. */
  from?: string;
};

export const GLOSSARY: GlossEntry[] = [
  // --- money and retention --------------------------------------------------
  {
    id: "clv",
    title: "CLV — customer lifetime value",
    match: ["CLV", "customer lifetime value", "lifetime value", "customer value"],
    plain:
      "How much profit one customer brings you in total, for as long as they stay. Two things drive it: how much profit you make from them each year, and how likely they are to stay another year.",
    example: "€30,000 profit a year and 80% of customers staying each year gives about €80,000 over the whole relationship (a Case assumption).",
    from: "Gupta & Lehmann 2003",
  },
  {
    id: "retention-rate",
    title: "Retention rate",
    match: ["retention rate"],
    plain: "The share of customers you keep from one period to the next. Start with 100 customers, keep 80, and the retention rate is 80%.",
  },
  {
    id: "discount-rate",
    title: "Discount rate",
    match: ["discount rate"],
    plain: "How much less a euro next year is worth to you than a euro today. It is why money far in the future counts for less in a calculation.",
  },
  {
    id: "margin",
    title: "Margin",
    match: ["margin"],
    plain: "The profit you keep from a sale after paying the costs of delivering it.",
  },
  {
    id: "defection",
    title: "Defection",
    match: ["defection", "defections"],
    plain: "A customer leaving you for a competitor. The defection rate is the share of customers who leave in a period.",
  },
  {
    id: "churn",
    title: "Churn",
    match: ["churn", "churned"],
    plain: "Customers stopping, or leaving, over a period of time. High churn means many customers are leaving.",
  },
  {
    id: "one-off",
    title: "One-off",
    match: ["one-off"],
    plain: "Done once and not repeated. A one-off implementation is a single large project; a one-off fix is a single action with no owner and no follow-up.",
  },
  {
    id: "abnahme",
    title: "Abnahme (acceptance)",
    match: ["Abnahme"],
    plain: "The moment the customer formally says the project is finished and accepted. After it, the project revenue normally stops.",
  },
  {
    id: "milestone-invoice",
    title: "Milestone invoice",
    match: ["milestone invoices", "milestone invoice"],
    plain: "A bill you send each time an agreed part of the project is finished, instead of one big bill at the end.",
  },
  {
    id: "follow-on",
    title: "Follow-on order",
    match: ["follow-on"],
    plain: "A new order from the same customer after the first project has ended, for example a service contract or an extension.",
  },
  {
    id: "csat",
    title: "CSAT — customer satisfaction score",
    match: ["CSAT"],
    plain: "A survey score, often 1 to 5, that shows how satisfied a customer says they are with what they received.",
  },
  {
    id: "nps",
    title: "NPS — net promoter score",
    match: ["NPS"],
    plain: "A survey score built on one question: how likely are you to recommend us? It shows what people say they intend, not what they actually do.",
    from: "Reichheld 2003",
  },
  {
    id: "share-of-wallet",
    title: "Share of wallet",
    match: ["share of wallet"],
    plain: "Out of everything a customer spends on this kind of service, the share that goes to you. If they spend €100,000 and €30,000 is yours, your share of wallet is 30%.",
  },
  {
    id: "grr",
    title: "GRR — gross revenue retention",
    match: ["GRR"],
    plain: "Of the regular income you had at the start of a period, how much is still there at the end, not counting any growth. It can only go down or stay the same.",
  },
  {
    id: "nrr",
    title: "NRR — net revenue retention",
    match: ["NRR"],
    plain: "The same idea as GRR, but growth from existing customers (they buy more) is added back. It can go above 100%.",
  },
  {
    id: "recurring-revenue",
    title: "Recurring revenue",
    match: ["recurring revenue"],
    plain: "Income that repeats by itself, such as a monthly service fee, instead of a single project payment.",
  },
  {
    id: "renewal-rate",
    title: "Renewal rate",
    match: ["renewal rate"],
    plain: "Of the contracts that came up for renewal, the share the customer actually renewed.",
  },
  {
    id: "repeat-order-rate",
    title: "Repeat-order rate",
    match: ["repeat-order rate"],
    plain: "The share of customers who place another order within a set time, here within 24 months.",
  },
  {
    id: "relative-attitude",
    title: "Relative attitude",
    match: ["relative attitude"],
    plain: "How much a customer prefers you compared with the alternatives. It is about the choice between suppliers, not only about being happy with you.",
    from: "Dick & Basu 1994",
  },
  {
    id: "repeat-behaviour",
    title: "Repeat behaviour",
    match: ["repeat behaviour"],
    plain: "What the customer actually does: whether they buy from you again. It is a fact you can see in orders, not an opinion.",
  },
  {
    id: "latent-loyalty",
    title: "Latent loyalty",
    match: ["latent loyalty"],
    plain: "The customer likes you but does not buy again, often because something outside their control gets in the way, such as a rule that forces them to collect several offers.",
  },
  {
    id: "spurious-loyalty",
    title: "Spurious loyalty",
    match: ["spurious loyalty"],
    plain: "The customer keeps buying but does not really prefer you. They stay because leaving is too hard or too costly. It looks like loyalty but is not.",
  },
  {
    id: "loyalists",
    title: "Loyalists",
    match: ["Loyalists"],
    plain: "Customers who are satisfied and loyal: they are happy and they stay.",
    from: "Jones & Sasser 1995",
  },
  {
    id: "mercenaries",
    title: "Mercenaries",
    match: ["Mercenaries"],
    plain: "Customers who are satisfied but not loyal. They are happy today and will still leave for a better offer.",
    from: "Jones & Sasser 1995",
  },
  {
    id: "hostages",
    title: "Hostages",
    match: ["Hostages"],
    plain: "Customers who are unhappy but stay anyway because leaving is too hard, too costly or forbidden. When the barrier drops, they can leave quickly.",
    from: "Jones & Sasser 1995",
  },
  {
    id: "defectors",
    title: "Defectors",
    match: ["Defectors"],
    plain: "Customers who are unhappy and leave.",
    from: "Jones & Sasser 1995",
  },
  {
    id: "affective-commitment",
    title: "Affective commitment",
    match: ["affective commitment"],
    plain: "Staying because you want to: you trust the supplier and like working with them.",
    from: "Gustafsson et al. 2005",
  },
  {
    id: "calculative-commitment",
    title: "Calculative commitment",
    match: ["calculative commitment"],
    plain: "Staying because you have to: leaving would cost more than staying. It is a calculation, not a feeling.",
    from: "Gustafsson et al. 2005",
  },
  {
    id: "switching-costs",
    title: "Switching costs",
    match: ["switching costs", "switching cost"],
    plain: "Everything a customer would lose or have to do to change supplier: time to learn a new system, money, risk, and the people they know. The higher these are, the harder it is to leave.",
    from: "Burnham, Frels & Mahajan 2003",
  },
  {
    id: "procedural",
    title: "Procedural switching cost",
    match: ["procedural"],
    plain: "The time and effort of changing supplier: running a new tender, learning new tools, setting things up again.",
  },
  {
    id: "relational",
    title: "Relational switching cost",
    match: ["relational"],
    plain: "What a customer loses in people and relationships when they leave: a trusted contact, a brand they are used to.",
  },
  {
    id: "tco",
    title: "TCO — total cost of ownership",
    match: ["TCO", "total cost of ownership"],
    plain: "The full cost of something over its whole life, not just the price on the offer: fees, set-up, your own staff time, and extra charges.",
    example: "An offer that looks cheaper can cost more in total once set-up and internal hours are added.",
  },
  {
    id: "touchpoint",
    title: "Touchpoint",
    match: ["touchpoint", "touchpoints"],
    plain: "Any moment where the customer meets you or something about you: a meeting, a report, an email, a review site, a recommendation from a peer.",
    from: "Lemon & Verhoef 2016",
  },
  {
    id: "hypercare",
    title: "Hypercare",
    match: ["hypercare"],
    plain: "The short, extra-careful period right after a system goes live, when the supplier stays close to fix problems fast.",
  },
  {
    id: "go-live",
    title: "Go-live",
    match: ["go-live"],
    plain: "The day the new system starts to be used for real work.",
  },
  {
    id: "crm",
    title: "CRM",
    match: ["CRM"],
    plain: "Customer relationship management: the system where a company records its customers, contacts and every conversation with them.",
  },
  {
    id: "framework-agreement",
    title: "Framework agreement (Rahmenvertrag)",
    match: ["framework agreement", "framework contract", "Rahmenvertrag"],
    plain: "A contract that sets the terms for a long relationship, such as price, length and notice period, so later orders do not need to be negotiated from zero.",
  },
  {
    id: "notice-period",
    title: "Notice period (Kündigungsfrist)",
    match: ["Kündigungsfrist", "notice period"],
    plain: "How long before the end of a contract you must tell the other side that you are leaving. A six-month notice means you have to speak up at least six months ahead.",
  },
  {
    id: "managed-service",
    title: "Managed service",
    match: ["managed service", "managed-service", "Managed Security"],
    plain: "The supplier runs something for you on an ongoing basis for a monthly or yearly fee, for example watching your systems for attacks.",
  },

  // --- German words ----------------------------------------------------------
  {
    id: "ausschreibung",
    title: "Ausschreibung (formal tender)",
    match: ["Ausschreibung"],
    plain: "A formal process where a customer asks several suppliers for offers and then chooses one, following set rules.",
  },
  {
    id: "mittelstand",
    title: "Mittelstand",
    match: ["Mittelstand"],
    plain: "The mid-sized, often family-owned companies that make up much of the German economy.",
  },
  {
    id: "einkauf",
    title: "Einkauf (procurement)",
    match: ["Einkauf"],
    plain: "The purchasing department. It makes sure the buying process is followed, for example that enough offers are compared.",
  },
  {
    id: "geschaeftsfuehrer",
    title: "Geschäftsführer (managing director)",
    match: ["Geschäftsführer"],
    plain: "The managing director of a German company, the person who has the final word on larger spending.",
  },
  {
    id: "it-leiter",
    title: "IT-Leiter (head of IT)",
    match: ["IT-Leiter"],
    plain: "The person in charge of the company's IT. They are the technical voice in a purchase and carry the risk if systems fail.",
  },
  {
    id: "betriebsrat",
    title: "Betriebsrat (works council)",
    match: ["Betriebsrat"],
    plain: "The elected body that represents employees. In Germany it has a say when a new system could be used to monitor staff.",
  },
  {
    id: "datenschutzbeauftragter",
    title: "Datenschutzbeauftragter (data protection officer)",
    match: ["Datenschutzbeauftragter"],
    plain: "The person in a company who watches over how personal data is handled and whether it follows the law.",
  },
  {
    id: "avv",
    title: "Auftragsverarbeitungsvertrag",
    match: ["Auftragsverarbeitungsvertrag"],
    plain: "A contract required when one company handles personal data on behalf of another. It sets out what may and may not be done with the data.",
    from: "GDPR Art. 28",
  },

  // --- reading evidence ------------------------------------------------------
  {
    id: "ladder",
    title: "Ladder of inference",
    match: ["ladder of inference"],
    plain: "A picture of how we jump from a fact to a decision: we notice some facts, add meaning, make assumptions, reach conclusions and act. Only the bottom rung, the fact itself, can be checked in a record.",
    from: "Argyris 1990",
  },
  {
    id: "mece",
    title: "MECE",
    match: ["MECE"],
    plain: "A way of sorting so that the groups do not overlap and together cover everything. Every item fits in exactly one group, and none is left out.",
    from: "Minto 2009",
  },

  // --- law -----------------------------------------------------------------
  {
    id: "gdpr",
    title: "GDPR",
    match: ["GDPR"],
    plain: "The European law on personal data. Even a work email address such as name@company counts as personal data.",
  },
  {
    id: "legitimate-interest",
    title: "Legitimate interest",
    match: ["legitimate interest"],
    plain: "One legal reason under the GDPR to use personal data without asking first, when you have a real business reason and it does not override the person's rights.",
  },
  {
    id: "opt-out",
    title: "Opt-out",
    match: ["opt-out"],
    plain: "A simple way for a person to say \"stop sending me this\". You must tell them about it when you collect their address and in every message.",
  },
  {
    id: "uwg",
    title: "UWG",
    match: ["UWG"],
    plain: "The German law against unfair competition. Its section 7 says advertising emails need the recipient's prior consent, with a narrow exception for existing customers.",
  },
  {
    id: "data-minimisation",
    title: "Data minimisation",
    match: ["data minimisation"],
    plain: "Only collect and keep the personal data you really need.",
  },
  {
    id: "storage-limitation",
    title: "Storage limitation",
    match: ["storage limitation"],
    plain: "Do not keep personal data for longer than you need it.",
  },
  {
    id: "co-determination",
    title: "Co-determination",
    match: ["co-determination"],
    plain: "The right of employees, through the works council, to have a say in certain company decisions.",
  },

  // --- how buyers decide -----------------------------------------------------
  {
    id: "perceived-risk",
    title: "Perceived risk",
    match: ["perceived risk"],
    plain: "How risky a choice feels to the buyer, whether or not it really is. Buyers try to reduce this feeling before they commit.",
    from: "Bauer 1960",
  },
  {
    id: "loss-aversion",
    title: "Loss aversion",
    match: ["loss aversion"],
    plain: "A loss hurts more than an equal gain feels good. Losing €100 feels worse than winning €100 feels nice.",
    from: "Kahneman & Tversky 1979",
  },
  {
    id: "status-quo-bias",
    title: "Status-quo bias",
    match: ["status-quo bias"],
    plain: "The habit of preferring to leave things as they are, even when a change would be better.",
    from: "Samuelson & Zeckhauser 1988",
  },
  {
    id: "jolt",
    title: "JOLT",
    match: ["JOLT"],
    plain: "A method for buyers who cannot decide: Judge the indecision, Offer a recommendation, Limit exploration, Take risk off the table.",
    from: "Dixon & McKenna 2022",
  },
  {
    id: "buying-centre",
    title: "Buying centre (buying group)",
    match: ["buying centre", "buying group"],
    plain: "All the people inside the customer who take part in a purchase decision. One purchase is rarely decided by one person.",
    from: "Webster & Wind 1972",
  },
  {
    id: "gatekeeper",
    title: "Gatekeeper",
    match: ["Gatekeeper", "gatekeeper"],
    plain: "Someone who does not choose the supplier but can stop or slow the purchase, for example the data protection officer or the works council.",
  },
  {
    id: "decider",
    title: "Decider",
    match: ["Decider", "decider"],
    plain: "The person with the final say on a purchase.",
  },
  {
    id: "spin",
    title: "SPIN",
    match: ["SPIN"],
    plain: "A way of asking questions in sales: Situation, Problem, Implication, Need-payoff. The last two, which draw out what a problem costs and what fixing it is worth, matter most in large deals.",
    from: "Rackham 1988",
  },
  {
    id: "qbr",
    title: "QBR — quarterly business review",
    match: ["QBR", "quarterly business review"],
    plain: "A meeting every three months where you and the customer look at what value you have delivered and what comes next.",
  },
  {
    id: "health-score",
    title: "Health score",
    match: ["health score"],
    plain: "One number that tells you how likely a customer is to stay, built from signs such as how much they use the service, how many contacts you have, and how many complaints they raise.",
  },
  {
    id: "pilot",
    title: "Pilot",
    match: ["pilot"],
    plain: "A small, first version of something, run for a short time, to learn whether it works before committing to all of it.",
  },
  {
    id: "exit-clause",
    title: "Exit clause",
    match: ["exit clause", "exit clauses"],
    plain: "A term in a contract that lets a party leave under set conditions. It makes a contract less risky to sign.",
  },

  // --- numbers and risk ------------------------------------------------------
  {
    id: "ale",
    title: "ALE — annual loss expectancy",
    match: ["ALE"],
    plain: "The average yearly loss you should expect from a risk. It is a probability-weighted number: it appears on no budget line and is not money you will certainly spend.",
    example: "A loss of €150,000 that happens with a 4% chance a year gives an ALE of €6,000 a year.",
  },
  {
    id: "sle",
    title: "SLE — single-loss expectancy",
    match: ["SLE"],
    plain: "How much one occurrence of the bad event would cost you.",
  },
  {
    id: "aro",
    title: "ARO — annual rate of occurrence",
    match: ["ARO"],
    plain: "How often the bad event is expected to happen in a year. 0.05 means about one time in twenty years.",
  },
  {
    id: "expected-value",
    title: "Expected value",
    match: ["expected value", "expected loss"],
    plain: "An average that weighs each outcome by how likely it is. It tells you the size of a risk over time, not what will happen in one particular year.",
  },
  {
    id: "base-rate",
    title: "Base rate",
    match: ["base rate"],
    plain: "How often something happens across a whole group, such as the share of all customers who re-order. You need many cases to know it.",
  },
  {
    id: "small-numbers",
    title: "Law of small numbers",
    match: ["law of small numbers"],
    plain: "The mistake of treating a very small sample as if it showed the general pattern. One customer tells you about that customer, not about all of them.",
    from: "Tversky & Kahneman 1971",
  },
  {
    id: "n1",
    title: "n = 1",
    match: ["n = 1"],
    plain: "\"n\" is the number of cases you looked at. n = 1 means you have only one case, so you cannot say how common something is.",
  },
  {
    id: "iso27001",
    title: "ISO/IEC 27001",
    match: ["ISO/IEC 27001"],
    plain: "An international standard for managing information security. A company that is certified has been independently checked against it.",
  },
  {
    id: "nis2",
    title: "NIS2",
    match: ["NIS2"],
    plain: "A European law that requires many companies to protect their networks and systems and report security incidents. Company leaders can be held responsible.",
  },
  {
    id: "bsi",
    title: "BSI",
    match: ["BSI"],
    plain: "The German federal office for information security. It supervises the companies that fall under NIS2.",
  },
  {
    id: "ransomware",
    title: "Ransomware",
    match: ["ransomware"],
    plain: "A cyber attack that locks a company's files or systems and demands money to unlock them. It can stop production for days.",
  },
  {
    id: "tm",
    title: "T&M — time and material",
    match: ["T&M", "time & material"],
    plain: "You pay for the hours worked and the materials used, at an hourly rate, instead of a fixed price.",
  },
  {
    id: "fee-line",
    title: "Fee line",
    match: ["fee line", "fee-line"],
    plain: "The part of a customer's budget set aside for this kind of yearly fee. It can have its own upper limit, separate from other budgets.",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    match: ["onboarding"],
    plain: "The work of getting a new customer or supplier started: kick-off, access and the first delivery.",
  },
  {
    id: "monitoring-hours",
    title: "8×5 and 24×7",
    match: ["8×5", "24×7"],
    plain: "How many hours a service watches over your systems. 8×5 is 8 hours a day on 5 working days. 24×7 is all day, every day.",
  },
  {
    id: "case-assumption",
    title: "Case assumption",
    match: ["Case assumption", "Case assumptions"],
    plain: "A number the course made up for this exercise. It is not real data, so treat it as a given in the case, not as a fact about the world.",
  },

  // --- Level 3 -------------------------------------------------------------
  {
    id: "one-way-door",
    title: "One-way door",
    match: ["one-way door", "one-way-door"],
    plain: "A decision that is hard or impossible to undo, so it deserves a slow, careful discussion.",
    from: "Bezos 2015",
  },
  {
    id: "two-way-door",
    title: "Two-way door",
    match: ["two-way door", "two-way-door"],
    plain: "A decision you can reverse cheaply if it turns out badly, so it can be made quickly.",
    from: "Bezos 2015",
  },
  {
    id: "planning-fallacy",
    title: "Planning fallacy",
    match: ["planning fallacy"],
    plain: "Plans are almost always too optimistic. We focus on our own plan and forget how similar projects usually turn out.",
    from: "Kahneman & Lovallo 1993",
  },
  {
    id: "inside-view",
    title: "Inside view",
    match: ["inside view"],
    plain: "Judging a project only from its own details and plan. It tends to give a rosy forecast.",
    from: "Kahneman & Lovallo 1993",
  },
  {
    id: "outside-view",
    title: "Outside view",
    match: ["outside view"],
    plain: "Judging a project by looking at how similar projects turned out, then asking where yours fits.",
    from: "Kahneman & Lovallo 1993",
  },
  {
    id: "reference-class",
    title: "Reference-class forecasting",
    match: ["reference class forecasting", "reference-class forecasting", "reference class"],
    plain: "A way of forecasting by finding a group of similar past cases and using what happened to them as your starting point.",
    from: "Kahneman & Lovallo 1993",
  },
  {
    id: "rice",
    title: "RICE",
    match: ["RICE"],
    plain: "A scoring method for ranking options: Reach times Impact times Confidence, divided by Effort. A higher score means a better use of your effort.",
    from: "Intercom 2016",
  },
  {
    id: "ice",
    title: "ICE",
    match: ["ICE"],
    plain: "A lighter scoring method: Impact times Confidence times Ease.",
    from: "Ellis & Brown 2017",
  },
  {
    id: "opportunity-cost",
    title: "Opportunity cost",
    match: ["opportunity cost", "Opportunity cost"],
    plain: "What you give up by choosing one option: the value of the next-best option you did not pick.",
    from: "Brealey, Myers & Allen",
  },
  {
    id: "capital-rationing",
    title: "Capital rationing",
    match: ["capital rationing"],
    plain: "Choosing among several worthwhile options because the budget, not the quality of any option, is what limits you.",
    from: "Brealey, Myers & Allen",
  },
  {
    id: "raci",
    title: "RACI",
    match: ["RACI"],
    plain: "A grid that shows who does what: Responsible (does the work), Accountable (owns the result, exactly one person), Consulted (asked for input), Informed (told the result).",
    from: "PMI · PMBOK Guide",
  },
  {
    id: "accountable",
    title: "Accountable",
    match: ["Accountable"],
    plain: "The one person who owns the result and answers for it. Every activity needs exactly one.",
    from: "PMI · PMBOK Guide",
  },
  {
    id: "real-options",
    title: "Real options",
    match: ["real options", "Real options"],
    plain: "Treating a first small step as buying the right, not the duty, to do more later. You start small and expand only if the early results are good.",
    from: "Amram & Kulatilaka 1999",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    match: ["portfolio"],
    plain: "All of your customers, or projects, taken together as one group, instead of looking at a single one.",
  },
  {
    id: "cap",
    title: "Cap",
    match: ["cap"],
    plain: "A hard upper limit on an amount. Here, the most money the program is allowed to commit.",
  },

  // --- Day 2: funnel, sales strategy, retention levers and control logic --------------
  {
    id: "kpi",
    title: "KPI — key performance indicator",
    match: ["KPI", "KPIs"],
    plain: "A number you follow regularly to see whether something is working. A KPI is only useful if someone owns it and acts when it moves.",
    example: "The share of booked meetings that actually take place.",
  },
  {
    id: "b2b",
    title: "B2B",
    match: ["B2B"],
    plain: "Business to business: a company selling to other companies, not to private consumers.",
  },
  {
    id: "funnel",
    title: "Funnel (sales funnel)",
    match: ["funnel", "sales funnel"],
    plain: "A picture of a sales process as stages that get narrower: many people at the top, only a few signed contracts at the bottom. It shows where people drop out.",
  },
  {
    id: "lead",
    title: "Lead",
    match: ["Leads"],
    exactCase: true,
    plain: "A person or company that has shown interest and left contact details, for example by filling in a form or downloading a paper.",
  },
  {
    id: "prospect",
    title: "Prospect",
    match: ["prospect", "prospects"],
    plain: "A possible customer who has not bought yet.",
  },
  {
    id: "conversion-rate",
    title: "Conversion rate",
    match: ["conversion rate", "conversion"],
    plain: "The share of people who move from one stage to the next. Divide the number at this stage by the number at the stage just above it.",
    example: "50 people book a call and 40 turn up: the conversion from booked to held is 40 ÷ 50 = 80%.",
  },
  {
    id: "percentage-points",
    title: "Percentage points (pp)",
    match: ["percentage points", "percentage point", "pp"],
    plain: "The distance between two percentages. Going from 40% to 45% is 5 percentage points. It is not '5%', which would be a different question.",
    example: "A result of 30% against a benchmark of 40% is a gap of −10 pp.",
  },
  {
    id: "benchmark",
    title: "Benchmark",
    match: ["benchmark", "benchmarks"],
    plain: "A reference figure to compare your own result with, for example a typical value in your industry. It shows where you differ, not why.",
  },
  {
    id: "baseline",
    title: "Baseline",
    match: ["baseline"],
    plain: "Where you start: the value you measured before you changed anything. Without it you cannot tell later whether the change worked.",
  },
  {
    id: "repeat-purchase-rate",
    title: "Repeat-purchase rate",
    match: ["repeat-purchase rate", "repurchase rate", "repeat rate", "repeat purchase"],
    plain: "The share of existing customers who place another order within a set time. It shows whether you keep the customers you win, which the funnel does not.",
    example: "12 of 40 clients re-ordering within 18 months is 30%.",
  },
  {
    id: "gross-profit",
    title: "Gross profit and gross margin",
    match: ["gross profit", "gross margin"],
    plain: "Gross profit is the selling price minus the direct cost of delivering the work. Gross margin is that profit as a share of the price.",
    example: "A €40,000 contract at a 25% margin leaves €10,000 of gross profit.",
  },
  {
    id: "uplift",
    title: "Uplift",
    match: ["uplift"],
    plain: "How much something goes up because of an action. Here it is the rise in the repeat-purchase rate, in percentage points.",
  },
  {
    id: "net-impact",
    title: "Net impact",
    match: ["net impact", "net euros"],
    plain: "What is left after you subtract the cost of an action from the extra profit it brings. If it is negative, the action loses money.",
    example: "€30,000 of extra gross profit and a cost of €20,000 gives a net impact of +€10,000.",
  },
  {
    id: "break-even",
    title: "Break-even",
    match: ["break-even", "breaks even", "break even"],
    plain: "The point where the extra profit exactly covers the cost. Below it you lose money, above it you gain.",
  },
  {
    id: "fixed-cost",
    title: "Fixed cost",
    match: ["fixed cost", "fixed-cost"],
    plain: "A cost that stays the same however many orders come in, for example paying a person for the year.",
  },
  {
    id: "discount",
    title: "Discount",
    match: ["discount"],
    plain: "A reduction in the price. Here it is paid out of your own profit on every order it applies to, including orders the customer would have placed anyway.",
  },
  {
    id: "undiscounted",
    title: "Undiscounted",
    match: ["undiscounted"],
    plain: "Counting future money at its full value, without reducing it for the fact that it arrives later.",
  },
  {
    id: "lever",
    title: "Lever",
    match: ["lever", "levers"],
    plain: "One action you can pull to change a result, such as a named account manager, a discount or an extra service.",
  },
  {
    id: "value-added-service",
    title: "Value-added service",
    match: ["value-added service"],
    plain: "An extra service on top of the contract that the customer values, for example a security check or training for their team.",
  },
  {
    id: "segment",
    title: "Segment",
    match: ["segment", "segments", "segmentation"],
    plain: "A group of customers who behave in a similar way. Here there are two: project clients and retainer clients.",
  },
  {
    id: "rfm",
    title: "RFM",
    match: ["RFM"],
    plain: "Recency, Frequency, Monetary value: three simple facts about a customer. When did they last buy, how often do they buy, and how much do they spend?",
    from: "Fader, Hardie & Lee 2005",
  },
  {
    id: "retainer",
    title: "Retainer client",
    match: ["retainer", "Retainer"],
    plain: "A client who pays a regular fee for ongoing support and places many small orders. A project client, by contrast, buys a few large one-off projects.",
  },
  {
    id: "behaviour-based-selling",
    title: "Behaviour-based selling",
    match: ["behaviour-based sales strategy", "behaviour-based selling"],
    plain: "Selling by starting from why this particular buyer would act, their motive, and then choosing what you say and what you prove. The opposite is starting from a list of product features.",
  },
  {
    id: "motive",
    title: "Buying motive",
    match: ["buying motive", "motive", "motives"],
    plain: "The main reason a buyer would act. In this course there are four: trust, price, benefit and relationship.",
  },
  {
    id: "customer-value-proposition",
    title: "Customer value proposition",
    match: ["customer value proposition"],
    plain: "A statement of what the buyer will really get that is better than the alternative, in the buyer's own terms and figures.",
    from: "Anderson, Narus & van Rossum 2006",
  },
  {
    id: "value-case",
    title: "Value case",
    match: ["value case"],
    plain: "A calculation, built from the customer's own numbers, that shows what they gain by buying. It is more believable than a brochure.",
  },
  {
    id: "proof-of-concept",
    title: "Proof of concept",
    match: ["proof of concept"],
    plain: "A small trial that shows the idea works in the customer's real setting, before they sign the full contract. It lowers the buyer's risk.",
  },
  {
    id: "reference-customer",
    title: "Reference customer (Referenzkunde)",
    match: ["Referenzkunden", "reference customers", "reference customer"],
    plain: "An existing customer who is willing to tell prospects that your work is good, so a buyer can check you before trusting you.",
  },
  {
    id: "bsi-c5",
    title: "BSI C5",
    match: ["BSI C5"],
    plain: "A German security standard for cloud services, issued by the BSI. An attestation means an independent auditor confirmed that the provider meets it.",
  },
  {
    id: "fachabteilung",
    title: "Fachabteilung (business department)",
    match: ["Fachabteilung"],
    plain: "The department that will actually use the result and often owns the budget, for example production or finance, as opposed to the IT or purchasing department.",
  },
  {
    id: "it-security-officer",
    title: "IT security officer",
    match: ["IT security officer"],
    plain: "The person responsible for keeping the company's IT systems safe. They can block a deal if the security proof is missing.",
  },
  {
    id: "procurement",
    title: "Procurement",
    match: ["procurement"],
    plain: "The formal buying process of a company, often run by a purchasing department with fixed rules.",
  },
  {
    id: "day-rate",
    title: "Day rate",
    match: ["day-rate"],
    plain: "The price of one person's working day.",
  },
  {
    id: "abc",
    title: "Ability, benevolence, integrity",
    match: ["ability, benevolence and integrity", "ability, benevolence, integrity"],
    plain: "The three things a buyer judges when deciding whether to trust a supplier: can you do the job (ability), do you care about my interests (benevolence), and do you keep your word (integrity).",
    from: "Mayer, Davis & Schoorman 1995",
  },
  {
    id: "cio",
    title: "CIO",
    match: ["CIO"],
    plain: "Chief Information Officer: the senior executive responsible for a company's IT.",
  },
  {
    id: "cfo",
    title: "CFO",
    match: ["CFO"],
    plain: "Chief Financial Officer: the senior executive responsible for the company's money and reporting.",
  },
  {
    id: "cx",
    title: "CX — customer experience",
    match: ["CX"],
    plain: "Everything a customer goes through when dealing with a company, from first hearing about it to after they have bought.",
  },
  {
    id: "customer-journey",
    title: "Customer journey mapping",
    match: ["customer journey mapping", "customer journey", "journey map"],
    plain: "Listing every point where a buyer meets the vendor, in order, and grouping them into phases. It lets you see who owns each point and where people drop out.",
    from: "Lemon & Verhoef 2016",
  },
  {
    id: "pre-sales",
    title: "Pre-sales",
    match: ["pre-sales"],
    plain: "Everything before a seller is in a real conversation with a named buyer: awareness, and a first contact such as a form or a download.",
  },
  {
    id: "after-sales",
    title: "After-sales",
    match: ["after-sales"],
    plain: "Everything after the signature: getting started, support and renewal. It is where the next purchase is decided.",
  },
  {
    id: "whitepaper",
    title: "Whitepaper",
    match: ["whitepaper"],
    plain: "A longer report or guide, usually offered as a download, that explains a topic and shows the company's expertise.",
  },
  {
    id: "discovery-meeting",
    title: "Discovery meeting",
    match: ["discovery meeting", "scoping meeting"],
    plain: "A first serious conversation in which the seller learns what the buyer needs and how big the job is, before making any offer.",
  },
  {
    id: "sla",
    title: "SLA — service level agreement",
    match: ["SLA", "service level agreement"],
    plain: "A written promise about the level of service, for example how quickly the supplier must respond when something goes wrong.",
  },
  {
    id: "incident",
    title: "Incident",
    match: ["incident handling", "incidents", "incident"],
    plain: "A problem or outage in the service that the supplier has to fix. How it is handled shows the customer what the supplier is really like.",
  },
  {
    id: "escalation",
    title: "Escalation",
    match: ["escalation path", "escalates", "escalate", "escalation"],
    plain: "Passing a problem up to a more senior person when the first person cannot solve it. An escalation path says in advance who that person is.",
  },
  {
    id: "account-owner",
    title: "Account owner (key account manager)",
    match: ["account owner", "key account manager", "account management"],
    plain: "The one person at the vendor who is responsible for the relationship with a customer, and who stays the same person over time.",
  },
  {
    id: "consent",
    title: "Consent",
    match: ["consent"],
    plain: "A person's clear, free permission, given before you act, to use their data or to contact them.",
  },
  {
    id: "tracking",
    title: "Tracking and cookies",
    match: ["non-essential cookies", "tracking", "cookies"],
    plain: "Small pieces of code that follow what a visitor does on a website. In Germany the ones that are not strictly needed require the visitor's consent first.",
  },
  {
    id: "tdddg",
    title: "TDDDG",
    match: ["TDDDG"],
    plain: "The German law on data protection in digital services. Its section 25 says you need consent before storing or reading information on a visitor's device, for example non-essential cookies.",
  },
  {
    id: "edpb",
    title: "EDPB",
    match: ["EDPB"],
    plain: "The European Data Protection Board: the EU body that publishes guidance on how data-protection law should be applied.",
  },
  {
    id: "betrvg",
    title: "BetrVG",
    match: ["BetrVG"],
    plain: "The German Works Constitution Act. It sets out the rights of the works council, including a say when a system could be used to monitor employees.",
  },
  {
    id: "personalisation",
    title: "Personalisation",
    match: ["personalisation"],
    plain: "Adjusting what a visitor sees to who they are or to what they did before.",
  },
  {
    id: "cold-email",
    title: "Cold e-mail",
    match: ["cold e-mail", "cold email"],
    plain: "An e-mail sent to someone who has never dealt with you and did not ask for it. In Germany a business advertising e-mail like this needs prior consent.",
  },
  {
    id: "goal-action-kpi",
    title: "Ziel → Maßnahme → KPI",
    match: ["Ziel → Maßnahme → KPI", "goal → action → KPI", "goal → action → metric"],
    plain: "A chain that ties three things together: the goal you want, the action you take, and the number (KPI) that shows whether the action worked. An action without a KPI cannot be managed.",
  },
  {
    id: "scorecard",
    title: "Scorecard",
    match: ["balanced scorecard", "scorecard"],
    plain: "A way of managing by tying every objective to a measure, a target and an action, so that what people do is linked to what the company wants.",
    from: "Kaplan & Norton 1992",
  },
  {
    id: "governance",
    title: "Governance",
    match: ["governance"],
    plain: "The rules for who owns a number, how often it is checked, and what happens when it goes wrong.",
  },
  {
    id: "cadence",
    title: "Cadence",
    match: ["cadence"],
    plain: "How often something is done or checked, for example weekly or monthly.",
  },
  {
    id: "trigger",
    title: "Escalation trigger",
    match: ["escalation trigger", "trigger"],
    plain: "A rule written in advance: when a number crosses a set value, a named person must act. It removes the debate about whether to act.",
    example: "'Below 60% for two months' goes to the head of sales.",
  },
  {
    id: "threshold",
    title: "Threshold",
    match: ["threshold"],
    plain: "The value at which something changes. Cross it and the rule says someone must act.",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    match: ["dashboard"],
    plain: "One screen that shows the key numbers, updated regularly, so people can read them without asking anyone.",
  },
  {
    id: "controlling",
    title: "Controlling",
    match: ["Controlling"],
    exactCase: true,
    plain: "In a German company, the finance function that tracks budgets and figures and reports on them.",
  },
  {
    id: "descope",
    title: "Descope",
    match: ["descope", "descoping"],
    plain: "Make an action smaller, for example run it for one customer group only, instead of cancelling it altogether.",
  },
  {
    id: "leverage",
    title: "Leverage",
    match: ["leverage"],
    plain: "How much result you get for each euro you spend.",
  },
  {
    id: "sequencing",
    title: "Sequencing",
    match: ["sequencing"],
    plain: "The order in which you start things. It matters when one thing has to be in place before another can be measured.",
  },
  {
    id: "pickup-point",
    title: "Pickup point",
    match: ["pickup point"],
    plain: "A date or a condition, set in advance, for when you will come back to something you postponed. Without one, postponing is the same as cutting.",
  },
  {
    id: "residual-gap",
    title: "Residual gap",
    match: ["residual gap"],
    plain: "The part of a problem that is still open after a partial fix.",
  },
  {
    id: "pdca",
    title: "Plan, do, study, act",
    match: ["plan, do, study, act", "PDCA"],
    plain: "A repeating cycle for improving something: plan it, do it, study the result, then act on what you learned and start again.",
    from: "Deming 1986",
  },
  {
    id: "sales-phase",
    title: "Sales phase",
    match: ["sales phase"],
    plain: "The middle part of the customer journey: from the first booked or held conversation between a seller and a named buyer contact, up to and including the signature.",
  },
  {
    id: "kpi-owner",
    title: "KPI owner",
    match: ["KPI owner", "owner of the KPI"],
    plain: "The one person who can change the action behind a KPI and is expected to act when it moves the wrong way. It is not the person who only reads the number.",
    example: "The repeat-purchase rate is moved by how existing clients are served, so a key account manager owns it. Controlling can read it but cannot change it.",
  },
  {
    id: "head-of-sales",
    title: "Head of Sales",
    match: ["Head of Sales"],
    plain: "The person who answers for the sales team's results and for the funnel. Coordinators and team leads usually report to this role, so it is often the person a KPI escalates to.",
  },
  {
    id: "key-account-manager",
    title: "Key account manager",
    match: ["key account manager"],
    plain: "A salesperson who looks after the relationship with a group of existing clients over time: regular reviews, and early contact before a contract ends.",
  },
  {
    id: "head-of-account-management",
    title: "Head of Account Management",
    match: ["Head of Account Management"],
    plain: "The manager of the key account managers. Answers for how well existing clients are kept.",
  },
  {
    id: "crm-coordinator",
    title: "CRM coordinator",
    match: ["CRM coordinator"],
    plain: "The person who runs the customer database and the booking workflow in it: reminders, follow-ups and the quality of the data.",
  },
  {
    id: "head-of-delivery",
    title: "Head of Delivery",
    match: ["Head of Delivery"],
    plain: "The person who answers for getting projects delivered and for support after go-live.",
  },
  {
    id: "sales-team-lead",
    title: "Sales team lead",
    match: ["Sales team lead", "sales team lead"],
    plain: "The person who leads a group of sellers day to day and coaches them. Smaller in scope than the Head of Sales, who answers for the whole function.",
  },
  {
    id: "cco",
    title: "Chief Customer Officer",
    match: ["Chief Customer Officer"],
    plain: "The senior manager who answers for how well the company keeps and grows its customers. In this case the role is combined with Sales Manager.",
  },
];

import { GLOSSARY_DE } from "@/data/glossaryDe";
import { getLang } from "@/lib/lang";

// --- lookup ---------------------------------------------------------------------

export const GLOSS_BY_ID: Record<string, GlossEntry> = Object.fromEntries(GLOSSARY.map((g) => [g.id, g]));

const isAcronym = (s: string) => s === s.toUpperCase() && /[A-Z]/.test(s);

/** lowercase written form → its entry, and whether that form must be matched exactly. */
export const GLOSS_LOOKUP = new Map<string, { entry: GlossEntry; exact: string | null }>();
for (const g of GLOSSARY) {
  for (const m of g.match) GLOSS_LOOKUP.set(m.toLowerCase(), { entry: g, exact: g.exactCase || isAcronym(m) ? m : null });
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One regex for all written forms, longest first, so "customer lifetime value" wins over "lifetime value". */
export const GLOSS_RE = new RegExp(
  `(?<![\\p{L}\\p{N}_])(${[...GLOSS_LOOKUP.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeRe)
    .join("|")})(?![\\p{L}\\p{N}_])`,
  "giu",
);

/** The German written forms, for Route 1 in German. An entry without a German version is simply not linked there. */
export const GLOSS_LOOKUP_DE = new Map<string, { entry: GlossEntry; exact: string | null }>();
for (const [id, d] of Object.entries(GLOSSARY_DE)) {
  const entry = GLOSS_BY_ID[id];
  if (!entry) continue;
  for (const m of d.match) GLOSS_LOOKUP_DE.set(m.toLowerCase(), { entry, exact: d.exactCase || isAcronym(m) ? m : null });
}
export const GLOSS_RE_DE = new RegExp(
  `(?<![\\p{L}\\p{N}_])(${[...GLOSS_LOOKUP_DE.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeRe)
    .join("|")})(?![\\p{L}\\p{N}_])`,
  "giu",
);

/** The title, explanation, example and source of an entry in the active language (English when there is no German version). */
export function glossText(entry: GlossEntry): { title: string; plain: string; example?: string; from?: string } {
  const de = getLang() === "de" ? GLOSSARY_DE[entry.id] : undefined;
  return de ? { title: de.title, plain: de.plain, example: de.example, from: de.from } : { title: entry.title, plain: entry.plain, example: entry.example, from: entry.from };
}
