/**
 * Day 2 reference list. Cards cite by key; each `References` accordion shows the union of what its own
 * cards cite. `chip` is the short "Author Year" label a Source chip prints.
 */
export type RefKey =
  | "reichheld1990"
  | "lemon2016"
  | "gartner2017"
  | "bauer1960"
  | "morgan1994"
  | "mayer1995"
  | "anderson2006"
  | "dick1994"
  | "burnham2003"
  | "cialdini2021"
  | "gupta2003"
  | "fader2005"
  | "nagle2018"
  | "kahneman1979"
  | "samuelson1988"
  | "kahneman1991"
  | "gustafsson2005"
  | "iso27001"
  | "bsic5"
  | "gdpr"
  | "tdddg25"
  | "edpb2020"
  | "uwg7";

export type Reference = { key: RefKey; chip: string; full: string };

export const REFERENCES: Record<RefKey, Reference> = {
  reichheld1990: {
    key: "reichheld1990",
    chip: "Reichheld & Sasser 1990",
    full: "Reichheld, F. F., & Sasser, W. E. (1990). Zero defections: Quality comes to services. Harvard Business Review, 68(5), 105–111. (Cutting defections by 5% raised profits by 25% to 85% across the service industries studied.)",
  },
  lemon2016: {
    key: "lemon2016",
    chip: "Lemon & Verhoef 2016",
    full: "Lemon, K. N., & Verhoef, P. C. (2016). Understanding customer experience throughout the customer journey. Journal of Marketing, 80(6), 69–96. (Customer journey and touchpoints across the pre-purchase, purchase and post-purchase phases.)",
  },
  gartner2017: {
    key: "gartner2017",
    chip: "Gartner 2017",
    full: "Gartner (2017). Digital B2B Buyer Survey (n = 750), as reported in Gartner buyer-enablement materials. (Buyers spend about 17% of buying time meeting suppliers; the median buying group for a complex solution has 6–10 decision makers.)",
  },
  bauer1960: {
    key: "bauer1960",
    chip: "Bauer 1960",
    full: "Bauer, R. A. (1960). Consumer behavior as risk taking. In R. S. Hancock (Ed.), Dynamic Marketing for a Changing World (pp. 389–398). American Marketing Association. (Perceived risk.)",
  },
  morgan1994: {
    key: "morgan1994",
    chip: "Morgan & Hunt 1994",
    full: "Morgan, R. M., & Hunt, S. D. (1994). The commitment-trust theory of relationship marketing. Journal of Marketing, 58(3), 20–38.",
  },
  mayer1995: {
    key: "mayer1995",
    chip: "Mayer, Davis & Schoorman 1995",
    full: "Mayer, R. C., Davis, J. H., & Schoorman, F. D. (1995). An integrative model of organizational trust. Academy of Management Review, 20(3), 709–734. (Trust rests on ability, benevolence and integrity.)",
  },
  anderson2006: {
    key: "anderson2006",
    chip: "Anderson, Narus & van Rossum 2006",
    full: "Anderson, J. C., Narus, J. A., & van Rossum, W. (2006). Customer value propositions in business markets. Harvard Business Review, 84(3), 90–99.",
  },
  dick1994: {
    key: "dick1994",
    chip: "Dick & Basu 1994",
    full: "Dick, A. S., & Basu, K. (1994). Customer loyalty: Toward an integrated conceptual framework. Journal of the Academy of Marketing Science, 22(2), 99–113.",
  },
  burnham2003: {
    key: "burnham2003",
    chip: "Burnham, Frels & Mahajan 2003",
    full: "Burnham, T. A., Frels, J. K., & Mahajan, V. (2003). Consumer switching costs: A typology, antecedents, and consequences. Journal of the Academy of Marketing Science, 31(2), 109–126. (Procedural, financial and relational switching costs.)",
  },
  cialdini2021: {
    key: "cialdini2021",
    chip: "Cialdini 2021",
    full: "Cialdini, R. B. (2021). Influence, New and Expanded: The Psychology of Persuasion. Harper Business. (Commitment and consistency.)",
  },
  gupta2003: {
    key: "gupta2003",
    chip: "Gupta & Lehmann 2003",
    full: "Gupta, S., & Lehmann, D. R. (2003). Customers as assets. Journal of Interactive Marketing, 17(1), 9–24. (Customer lifetime value from margin, retention and discount rate.)",
  },
  fader2005: {
    key: "fader2005",
    chip: "Fader, Hardie & Lee 2005",
    full: "Fader, P. S., Hardie, B. G. S., & Lee, K. L. (2005). RFM and CLV: Using iso-value curves for customer base analysis. Journal of Marketing Research, 42(4), 415–430. (Recency, frequency and monetary value.)",
  },
  nagle2018: {
    key: "nagle2018",
    chip: "Nagle & Müller 2018",
    full: "Nagle, T. T., & Müller, G. (2018). The Strategy and Tactics of Pricing (6th ed.). Routledge. (Break-even volume for a price change.)",
  },
  kahneman1979: {
    key: "kahneman1979",
    chip: "Kahneman & Tversky 1979",
    full: "Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. Econometrica, 47(2), 263–291. (Loss aversion.)",
  },
  samuelson1988: {
    key: "samuelson1988",
    chip: "Samuelson & Zeckhauser 1988",
    full: "Samuelson, W., & Zeckhauser, R. (1988). Status quo bias in decision making. Journal of Risk and Uncertainty, 1(1), 7–59.",
  },
  kahneman1991: {
    key: "kahneman1991",
    chip: "Kahneman, Knetsch & Thaler 1991",
    full: "Kahneman, D., Knetsch, J. L., & Thaler, R. H. (1991). Anomalies: The endowment effect, loss aversion, and status quo bias. Journal of Economic Perspectives, 5(1), 193–206.",
  },
  gustafsson2005: {
    key: "gustafsson2005",
    chip: "Gustafsson, Johnson & Roos 2005",
    full: "Gustafsson, A., Johnson, M. D., & Roos, I. (2005). The effects of customer satisfaction, relationship commitment dimensions, and triggers on customer retention. Journal of Marketing, 69(4), 210–218. (Separates affective from calculative commitment.)",
  },
  iso27001: {
    key: "iso27001",
    chip: "ISO/IEC 27001:2022",
    full: "ISO/IEC 27001:2022. Information security, cybersecurity and privacy protection — Information security management systems — Requirements.",
  },
  bsic5: {
    key: "bsic5",
    chip: "BSI C5:2020",
    full: "Bundesamt für Sicherheit in der Informationstechnik (BSI) (2020). Cloud Computing Compliance Criteria Catalogue (C5:2020).",
  },
  gdpr: {
    key: "gdpr",
    chip: "GDPR",
    full: "Regulation (EU) 2016/679 (GDPR), Art. 6(1)(a) and (f) (lawful basis), Art. 7 (conditions for consent), Art. 28 (processor: the Auftragsverarbeitungsvertrag, AVV).",
  },
  tdddg25: {
    key: "tdddg25",
    chip: "§ 25 TDDDG",
    full: "§ 25 TDDDG (Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz, formerly TTDSG): storing or reading information on a user's terminal equipment (cookies, tracking) needs consent unless it is strictly necessary.",
  },
  edpb2020: {
    key: "edpb2020",
    chip: "EDPB 2020",
    full: "European Data Protection Board (2020). Guidelines 05/2020 on consent under Regulation 2016/679, version 1.1.",
  },
  uwg7: {
    key: "uwg7",
    chip: "§ 7 UWG",
    full: "§ 7 UWG (Gesetz gegen den unlauteren Wettbewerb): unreasonable harassment. Advertising by e-mail needs prior consent, and by telephone at least the presumed consent of a business contact.",
  },
};

/** Print order of the accordion. */
export const REFERENCE_ORDER: RefKey[] = Object.keys(REFERENCES) as RefKey[];
