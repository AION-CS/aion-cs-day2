/**
 * The German version of the plain-language glossary (CLAUDE.md #19), for Route 1. Same ids as data/glossary.ts. `match` lists
 * every German written form the Route 1 texts use (with the plural and genitive forms that occur); an entry without a German
 * version simply is not linked in German. Written for a learner who is not an expert: short sentences, everyday words.
 */
export type GlossEntryDe = { title: string; match: string[]; exactCase?: boolean; plain: string; example?: string; from?: string };

export const GLOSSARY_DE: Record<string, GlossEntryDe> = {
  "sales-phase": {
    title: "Vertriebsphase",
    match: ["Vertriebsphase"],
    plain: "Der mittlere Teil der Customer Journey: vom ersten gebuchten oder geführten Gespräch zwischen einem Verkäufer und einem namentlich bekannten Käuferkontakt bis einschließlich zur Unterschrift.",
  },
  "kpi-owner": {
    title: "KPI-Owner",
    match: ["KPI-Owner", "Owner der KPI"],
    plain: "Die eine Person, die die Maßnahme hinter einer KPI ändern kann und handeln soll, wenn sich die KPI in die falsche Richtung bewegt. Es ist nicht die Person, die nur die Zahl liest.",
    example: "Die Wiederkaufsrate wird davon bewegt, wie Bestandskunden betreut werden, also besitzt sie ein Key Account Manager. Controlling kann sie lesen, aber nicht ändern.",
  },
  clv: {
    title: "CLV — Customer Lifetime Value (Kundenwert)",
    match: ["CLV", "Customer Lifetime Value", "Kundenwert", "Lebenszeitwert"],
    plain:
      "Wie viel Gewinn ein Kunde Ihnen insgesamt bringt, solange er bleibt. Zwei Dinge bestimmen ihn: wie viel Gewinn Sie pro Jahr mit ihm machen und wie wahrscheinlich er ein weiteres Jahr bleibt.",
    example: "30.000 € Gewinn pro Jahr und 80 % Kunden, die jedes Jahr bleiben, ergeben rund 80.000 € über die gesamte Beziehung (eine Fallannahme).",
    from: "Gupta & Lehmann 2003",
  },
  "retention-rate": {
    title: "Kundenbindungsrate",
    match: ["Kundenbindungsrate", "Bindungsrate"],
    plain: "Der Anteil der Kunden, den Sie von einem Zeitraum zum nächsten behalten. Bei 100 Kunden und 80 gehaltenen liegt die Bindungsrate bei 80 %.",
  },
  margin: {
    title: "Marge",
    match: ["Marge", "Margen"],
    plain: "Der Gewinn, der Ihnen von einem Verkauf bleibt, nachdem Sie die Kosten der Leistung bezahlt haben.",
  },
  defection: {
    title: "Abwanderung",
    match: ["Abwanderung", "Abwanderungen"],
    plain: "Ein Kunde wechselt zu einem Wettbewerber. Die Abwanderungsrate ist der Anteil der Kunden, die in einem Zeitraum gehen.",
  },
  churn: {
    title: "Churn",
    match: ["Churn"],
    plain: "Kunden hören auf oder wandern ab, über einen Zeitraum betrachtet. Hoher Churn bedeutet, dass viele Kunden gehen.",
  },
  "one-off": {
    title: "Einmalig",
    match: ["einmalig", "einmalige", "einmaligen", "einmaliger", "einmaliges"],
    plain: "Einmal gemacht und nicht wiederholt. Eine einmalige Implementierung ist ein einzelnes großes Projekt; eine einmalige Korrektur ist eine einzelne Maßnahme ohne Verantwortlichen und ohne Nachverfolgung.",
  },
  "affective-commitment": {
    title: "Affektive Bindung",
    match: ["affektive Bindung", "affektiven Bindung"],
    plain: "Bleiben, weil man will: Man vertraut dem Lieferanten und arbeitet gern mit ihm.",
    from: "Gustafsson et al. 2005",
  },
  "calculative-commitment": {
    title: "Kalkulierte Bindung",
    match: ["kalkulierte Bindung", "kalkulierten Bindung"],
    plain: "Bleiben, weil man muss: Der Wechsel würde mehr kosten als das Bleiben. Es ist eine Rechnung, kein Gefühl.",
    from: "Gustafsson et al. 2005",
  },
  procedural: {
    title: "Prozessuale Wechselkosten",
    match: ["prozedural", "prozedurale", "prozeduralen", "prozessuale", "prozessualen"],
    plain: "Zeit und Aufwand beim Lieferantenwechsel: eine neue Ausschreibung durchführen, neue Werkzeuge lernen, alles neu einrichten.",
  },
  relational: {
    title: "Beziehungsbezogene Wechselkosten",
    match: ["relational", "relationale", "relationalen", "beziehungsbezogene", "beziehungsbezogenen"],
    plain: "Was ein Kunde an Menschen und Beziehungen verliert, wenn er geht: einen vertrauten Ansprechpartner, eine gewohnte Marke.",
  },
  tco: {
    title: "TCO — Gesamtkosten des Besitzes",
    match: ["TCO", "Gesamtkosten des Besitzes", "Gesamtbetriebskosten"],
    plain: "Die vollen Kosten einer Sache über ihre gesamte Lebensdauer, nicht nur der Preis im Angebot: Gebühren, Einrichtung, eigene Arbeitszeit und Zusatzkosten.",
    example: "Ein Angebot, das günstiger aussieht, kann insgesamt mehr kosten, sobald Einrichtung und interne Stunden dazukommen.",
  },
  touchpoint: {
    title: "Kontaktpunkt",
    match: ["Kontaktpunkt", "Kontaktpunkte", "Kontaktpunkten", "Kontaktpunkts"],
    plain: "Jeder Moment, in dem der Kunde Ihnen oder etwas von Ihnen begegnet: ein Termin, ein Bericht, eine E-Mail, ein Bewertungsportal, eine Empfehlung.",
    from: "Lemon & Verhoef 2016",
  },
  hypercare: {
    title: "Hypercare",
    match: ["Hypercare"],
    plain: "Die kurze, besonders aufmerksame Phase direkt nach dem Start eines Systems, in der der Lieferant nah dran bleibt, um Probleme schnell zu beheben.",
  },
  "go-live": {
    title: "Go-live",
    match: ["Go-live"],
    plain: "Der Tag, an dem das neue System für die echte Arbeit genutzt wird.",
  },
  crm: {
    title: "CRM",
    match: ["CRM"],
    plain: "Customer Relationship Management: das System, in dem ein Unternehmen seine Kunden, Kontakte und jedes Gespräch mit ihnen festhält.",
  },
  "framework-agreement": {
    title: "Rahmenvertrag",
    match: ["Rahmenvertrag", "Rahmenvertrags", "Rahmenverträge"],
    plain: "Ein Vertrag, der die Bedingungen für eine lange Beziehung festlegt, etwa Preis, Laufzeit und Kündigungsfrist, damit spätere Aufträge nicht von null verhandelt werden müssen.",
  },
  ausschreibung: {
    title: "Ausschreibung",
    match: ["Ausschreibung", "Ausschreibungen"],
    plain: "Ein förmliches Verfahren, bei dem ein Kunde mehrere Lieferanten um Angebote bittet und dann nach festen Regeln einen auswählt.",
  },
  mittelstand: {
    title: "Mittelstand",
    match: ["Mittelstand"],
    plain: "Die mittelgroßen, oft familiengeführten Unternehmen, die einen großen Teil der deutschen Wirtschaft ausmachen.",
  },
  betriebsrat: {
    title: "Betriebsrat",
    match: ["Betriebsrat", "Betriebsrats"],
    plain: "Das gewählte Gremium, das die Beschäftigten vertritt. In Deutschland hat er ein Mitspracherecht, wenn ein neues System zur Überwachung von Mitarbeitenden genutzt werden könnte.",
  },
  avv: {
    title: "Auftragsverarbeitungsvertrag (AVV)",
    match: ["Auftragsverarbeitungsvertrag", "AVV"],
    plain: "Ein Vertrag, der nötig ist, wenn ein Unternehmen personenbezogene Daten im Auftrag eines anderen verarbeitet. Er legt fest, was mit den Daten geschehen darf und was nicht.",
    from: "DSGVO Art. 28",
  },
  gdpr: {
    title: "DSGVO",
    match: ["DSGVO", "GDPR"],
    plain: "Das europäische Gesetz zum Schutz personenbezogener Daten. Auch eine geschäftliche E-Mail-Adresse wie name@firma gilt als personenbezogenes Datum.",
  },
  "perceived-risk": {
    title: "Wahrgenommenes Risiko",
    match: ["wahrgenommenes Risiko", "wahrgenommene Risiko", "wahrgenommenen Risikos"],
    plain: "Wie riskant eine Entscheidung dem Käufer erscheint, ob sie es tatsächlich ist oder nicht. Käufer versuchen dieses Gefühl zu verringern, bevor sie sich festlegen.",
    from: "Bauer 1960",
  },
  "loss-aversion": {
    title: "Verlustaversion",
    match: ["Verlustaversion"],
    plain: "Ein Verlust tut mehr weh, als ein gleich großer Gewinn guttut. 100 € zu verlieren fühlt sich schlechter an, als 100 € zu gewinnen sich gut anfühlt.",
    from: "Kahneman & Tversky 1979",
  },
  "status-quo-bias": {
    title: "Status-quo-Verzerrung",
    match: ["Status-quo-Verzerrung", "Status-quo-Effekt"],
    plain: "Die Neigung, Dinge lieber so zu lassen, wie sie sind, auch wenn eine Änderung besser wäre.",
    from: "Samuelson & Zeckhauser 1988",
  },
  qbr: {
    title: "QBR — vierteljährliche Business Review",
    match: ["QBR", "Quarterly Business Review", "vierteljährliche Business Review"],
    plain: "Ein Termin alle drei Monate, in dem Sie und der Kunde ansehen, welchen Wert Sie geliefert haben und was als Nächstes kommt.",
  },
  pilot: {
    title: "Pilot",
    match: ["Pilot", "Pilotphase", "Pilotphasen"],
    plain: "Eine kleine erste Version von etwas, kurz erprobt, um zu lernen, ob es funktioniert, bevor man sich ganz festlegt.",
  },
  iso27001: {
    title: "ISO/IEC 27001",
    match: ["ISO/IEC 27001"],
    plain: "Eine internationale Norm für das Management der Informationssicherheit. Ein zertifiziertes Unternehmen wurde unabhängig daran geprüft.",
  },
  bsi: {
    title: "BSI",
    match: ["BSI"],
    plain: "Das Bundesamt für Sicherheit in der Informationstechnik. Es beaufsichtigt die Unternehmen, die unter NIS2 fallen.",
  },
  onboarding: {
    title: "Onboarding",
    match: ["Onboarding"],
    plain: "Die Arbeit, einen neuen Kunden oder Lieferanten an den Start zu bringen: Kick-off, Zugänge und die erste Lieferung.",
  },
  "case-assumption": {
    title: "Fallannahme",
    match: ["Fallannahme", "Fallannahmen"],
    plain: "Eine Zahl, die der Kurs für diese Übung erfunden hat. Sie sind keine echten Daten, also behandeln Sie sie als Vorgabe im Fall, nicht als Tatsache über die Welt.",
  },
  "opportunity-cost": {
    title: "Opportunitätskosten",
    match: ["Opportunitätskosten"],
    plain: "Was Sie aufgeben, wenn Sie eine Option wählen: der Wert der nächstbesten Option, die Sie nicht gewählt haben.",
    from: "Brealey, Myers & Allen",
  },
  "capital-rationing": {
    title: "Kapitalrationierung",
    match: ["Kapitalrationierung"],
    plain: "Die Auswahl unter mehreren lohnenden Optionen, weil das Budget und nicht die Qualität einer Option Sie begrenzt.",
    from: "Brealey, Myers & Allen",
  },
  accountable: {
    title: "Accountable (verantwortlich)",
    match: ["Accountable"],
    plain: "Die eine Person, der das Ergebnis gehört und die dafür geradesteht. Jede Aktivität braucht genau eine.",
    from: "PMI · PMBOK Guide",
  },
  kpi: {
    title: "KPI — Leistungskennzahl",
    match: ["KPI", "KPIs", "Kennzahl", "Kennzahlen"],
    plain: "Eine Zahl, die Sie regelmäßig verfolgen, um zu sehen, ob etwas funktioniert. Eine KPI ist nur nützlich, wenn jemand sie verantwortet und handelt, wenn sie sich bewegt.",
    example: "Der Anteil der gebuchten Termine, die tatsächlich stattfinden.",
  },
  b2b: {
    title: "B2B",
    match: ["B2B"],
    plain: "Business to Business: ein Unternehmen verkauft an andere Unternehmen, nicht an private Verbraucher.",
  },
  funnel: {
    title: "Trichter (Verkaufstrichter)",
    match: ["Trichter", "Trichters", "Verkaufstrichter", "Trichtern"],
    plain: "Ein Bild eines Verkaufsprozesses als Stufen, die immer schmaler werden: viele Personen oben, nur wenige unterzeichnete Verträge unten. Er zeigt, wo Personen abspringen.",
  },
  lead: {
    title: "Lead",
    match: ["Leads"],
    exactCase: true,
    plain: "Eine Person oder ein Unternehmen, die Interesse gezeigt und Kontaktdaten hinterlassen haben, zum Beispiel durch ein Formular oder den Download eines Papiers.",
  },
  prospect: {
    title: "Interessent",
    match: ["Interessent", "Interessenten"],
    plain: "Ein möglicher Kunde, der noch nicht gekauft hat.",
  },
  "conversion-rate": {
    title: "Konversionsrate",
    match: ["Konversionsrate", "Konversionsraten", "Konversion"],
    plain: "Der Anteil der Personen, die von einer Stufe zur nächsten gelangen. Teilen Sie die Zahl dieser Stufe durch die Zahl der Stufe direkt darüber.",
    example: "50 Personen buchen ein Gespräch und 40 erscheinen: Die Konversion von gebucht zu durchgeführt ist 40 ÷ 50 = 80 %.",
  },
  "percentage-points": {
    title: "Prozentpunkte (PP)",
    match: ["Prozentpunkte", "Prozentpunkt", "Prozentpunkten", "PP"],
    plain: "Der Abstand zwischen zwei Prozentwerten. Von 40 % auf 45 % sind 5 Prozentpunkte. Es sind nicht „5 %“, das wäre eine andere Frage.",
    example: "Ein Ergebnis von 30 % gegenüber einem Benchmark von 40 % ist eine Abweichung von −10 PP.",
  },
  benchmark: {
    title: "Benchmark",
    match: ["Benchmark", "Benchmarks"],
    plain: "Ein Vergleichswert für das eigene Ergebnis, zum Beispiel ein üblicher Wert der Branche. Er zeigt, wo Sie abweichen, nicht warum.",
  },
  baseline: {
    title: "Ausgangswert (Baseline)",
    match: ["Baseline", "Ausgangswert", "Ausgangswerte", "Ausgangswerten", "Ausgangsdaten"],
    plain: "Ihr Startpunkt: der Wert, den Sie gemessen haben, bevor Sie etwas verändert haben. Ohne ihn können Sie später nicht sagen, ob die Änderung gewirkt hat.",
  },
  "repeat-purchase-rate": {
    title: "Wiederkaufsrate",
    match: ["Wiederkaufsrate", "Wiederkaufsraten", "Wiederkauf"],
    plain: "Der Anteil der Bestandskunden, die innerhalb einer festgelegten Zeit erneut bestellen. Sie zeigt, ob Sie die gewonnenen Kunden halten, was der Trichter nicht zeigt.",
    example: "12 von 40 Kunden, die innerhalb von 18 Monaten erneut bestellen, sind 30 %.",
  },
  "gross-profit": {
    title: "Rohertrag und Rohertragsmarge",
    match: ["Rohertrag", "Rohertragsmarge", "Bruttomarge"],
    plain: "Der Rohertrag ist der Verkaufspreis abzüglich der direkten Kosten der Leistung. Die Rohertragsmarge ist dieser Ertrag als Anteil am Preis.",
    example: "Ein Vertrag über 40.000 € bei 25 % Marge lässt 10.000 € Rohertrag.",
  },
  uplift: {
    title: "Steigerung (Uplift)",
    match: ["Steigerung", "Uplift"],
    plain: "Um wie viel etwas wegen einer Maßnahme steigt. Hier ist es der Anstieg der Wiederkaufsrate, in Prozentpunkten.",
  },
  "net-impact": {
    title: "Nettoeffekt",
    match: ["Nettoeffekt", "Nettoeffekts"],
    plain: "Was übrig bleibt, wenn Sie die Kosten einer Maßnahme vom zusätzlichen Gewinn abziehen, den sie bringt. Ist er negativ, verliert die Maßnahme Geld.",
    example: "30.000 € zusätzlicher Rohertrag und 20.000 € Kosten ergeben einen Nettoeffekt von +10.000 €.",
  },
  "break-even": {
    title: "Break-even",
    match: ["Break-even"],
    plain: "Der Punkt, an dem der zusätzliche Gewinn die Kosten genau deckt. Darunter verlieren Sie Geld, darüber gewinnen Sie.",
  },
  "fixed-cost": {
    title: "Fixkosten",
    match: ["Fixkosten", "Fixkosten-Hebel"],
    plain: "Ein Kostenblock, der gleich bleibt, egal wie viele Aufträge eingehen, zum Beispiel die Bezahlung einer Person für das Jahr.",
  },
  discount: {
    title: "Rabatt",
    match: ["Rabatt", "Rabatte", "Rabatts", "Rabattaktion"],
    plain: "Eine Preisermäßigung. Hier wird sie aus Ihrem eigenen Gewinn bezahlt, bei jedem Auftrag, für den sie gilt, auch bei Aufträgen, die der Kunde ohnehin erteilt hätte.",
  },
  undiscounted: {
    title: "Nicht abgezinst",
    match: ["nicht abgezinst", "unabgezinst"],
    plain: "Zukünftiges Geld zu seinem vollen Wert gezählt, ohne es dafür zu kürzen, dass es erst später eintrifft.",
  },
  lever: {
    title: "Hebel",
    match: ["Hebel", "Hebels", "Hebeln"],
    plain: "Eine Maßnahme, an der Sie ziehen können, um ein Ergebnis zu verändern, etwa ein benannter Kundenbetreuer, ein Rabatt oder eine Zusatzleistung.",
  },
  "value-added-service": {
    title: "Zusatzleistung (Value-added Service)",
    match: ["Zusatzleistung", "Zusatzleistungen", "Value-added Service"],
    plain: "Eine zusätzliche Leistung zum Vertrag, die der Kunde schätzt, zum Beispiel ein Sicherheitscheck oder eine Schulung für sein Team.",
  },
  segment: {
    title: "Segment",
    match: ["Segment", "Segmente", "Segmenten", "Segments", "Segmentierung"],
    plain: "Eine Gruppe von Kunden, die sich ähnlich verhalten. Hier gibt es zwei: Projektkunden und Retainer-Kunden.",
  },
  rfm: {
    title: "RFM",
    match: ["RFM"],
    plain: "Recency, Frequency, Monetary value: drei einfache Fakten über einen Kunden. Wann hat er zuletzt gekauft, wie oft kauft er, und wie viel gibt er aus?",
    from: "Fader, Hardie & Lee 2005",
  },
  retainer: {
    title: "Retainer-Kunde",
    match: ["Retainer", "Retainer-Kunden", "Retainer-Kunde"],
    plain: "Ein Kunde, der eine regelmäßige Gebühr für laufenden Support zahlt und viele kleine Aufträge erteilt. Ein Projektkunde dagegen kauft wenige große, einmalige Projekte.",
  },
  "behaviour-based-selling": {
    title: "Verhaltensbasiertes Verkaufen",
    match: ["verhaltensbasierte Verkaufsstrategie", "verhaltensbasiertes Verkaufen", "verhaltensbasierten Verkaufen", "verhaltensbasierter Vertrieb"],
    plain: "Verkaufen, indem man davon ausgeht, warum genau dieser Käufer handeln würde, seinem Motiv, und dann wählt, was man sagt und was man belegt. Das Gegenteil ist, von einer Liste von Produktmerkmalen auszugehen.",
  },
  motive: {
    title: "Kaufmotiv",
    match: ["Kaufmotiv", "Kaufmotive", "Kaufmotivs", "Motiv", "Motive", "Motivs"],
    plain: "Der Hauptgrund, aus dem ein Käufer handeln würde. In diesem Kurs gibt es vier: Vertrauen, Preis, Nutzen und Beziehung.",
  },
  "customer-value-proposition": {
    title: "Kundennutzenversprechen",
    match: ["Kundennutzenversprechen", "Nutzenversprechen"],
    plain: "Eine Aussage darüber, was der Käufer wirklich bekommt, das besser ist als die Alternative, in den eigenen Begriffen und Zahlen des Käufers.",
    from: "Anderson, Narus & van Rossum 2006",
  },
  "value-case": {
    title: "Nutzenrechnung (Value Case)",
    match: ["Nutzenrechnung", "Value Case"],
    plain: "Eine Rechnung, aus den eigenen Zahlen des Kunden aufgebaut, die zeigt, was er durch den Kauf gewinnt. Sie ist glaubwürdiger als eine Broschüre.",
  },
  "proof-of-concept": {
    title: "Proof of Concept",
    match: ["Proof of Concept"],
    plain: "Ein kleiner Test, der zeigt, dass die Idee in der echten Umgebung des Kunden funktioniert, bevor er den vollen Vertrag unterschreibt. Er senkt das Risiko des Käufers.",
  },
  "reference-customer": {
    title: "Referenzkunde",
    match: ["Referenzkunde", "Referenzkunden"],
    plain: "Ein bestehender Kunde, der bereit ist, Interessenten zu sagen, dass Ihre Arbeit gut ist, damit ein Käufer Sie prüfen kann, bevor er Ihnen vertraut.",
  },
  "bsi-c5": {
    title: "BSI C5",
    match: ["BSI C5"],
    plain: "Ein deutscher Sicherheitsstandard für Cloud-Dienste, herausgegeben vom BSI. Ein Testat bedeutet, dass ein unabhängiger Prüfer bestätigt hat, dass der Anbieter ihn erfüllt.",
  },
  fachabteilung: {
    title: "Fachabteilung",
    match: ["Fachabteilung", "Fachabteilungen"],
    plain: "Die Abteilung, die das Ergebnis tatsächlich nutzt und oft das Budget besitzt, zum Beispiel Produktion oder Finanzen, im Unterschied zur IT- oder Einkaufsabteilung.",
  },
  "it-security-officer": {
    title: "IT-Sicherheitsbeauftragter",
    match: ["IT-Sicherheitsbeauftragte", "IT-Sicherheitsbeauftragter", "IT-Sicherheitsbeauftragten"],
    plain: "Die Person, die dafür verantwortlich ist, die IT-Systeme des Unternehmens sicher zu halten. Sie kann einen Abschluss blockieren, wenn der Sicherheitsnachweis fehlt.",
  },
  procurement: {
    title: "Einkauf (Beschaffung)",
    match: ["Beschaffung", "Einkauf", "Beschaffungsprozess"],
    plain: "Der förmliche Kaufprozess eines Unternehmens, oft von einer Einkaufsabteilung nach festen Regeln geführt.",
  },
  "day-rate": {
    title: "Tagessatz",
    match: ["Tagessatz", "Tagessatzes"],
    plain: "Der Preis für einen Arbeitstag einer Person.",
  },
  cx: {
    title: "CX — Customer Experience",
    match: ["CX", "Customer Experience", "Kundenerlebnis"],
    plain: "Alles, was ein Kunde im Umgang mit einem Unternehmen erlebt, vom ersten Hören davon bis nach dem Kauf.",
  },
  "customer-journey": {
    title: "Customer Journey Mapping",
    match: ["Customer Journey Mapping", "Customer Journey", "Journey Map", "Journey-Map", "Journey"],
    plain: "Jeden Punkt auflisten, an dem ein Käufer dem Anbieter begegnet, der Reihe nach, und ihn in Phasen gruppieren. So sehen Sie, wer jeden Punkt verantwortet und wo Personen abspringen.",
    from: "Lemon & Verhoef 2016",
  },
  "pre-sales": {
    title: "Pre-Sales",
    match: ["Pre-Sales", "Pre-Sales-Phase"],
    plain: "Alles, bevor ein Verkäufer in einem echten Gespräch mit einem namentlich bekannten Käufer ist: Aufmerksamkeit und ein Erstkontakt wie ein Formular oder ein Download.",
  },
  "after-sales": {
    title: "After-Sales",
    match: ["After-Sales", "After-Sales-Phase"],
    plain: "Alles nach der Unterschrift: Start, Support und Verlängerung. Hier entscheidet sich der nächste Kauf.",
  },
  whitepaper: {
    title: "Whitepaper",
    match: ["Whitepaper", "Whitepapers", "Whitepaper-Download"],
    plain: "Ein längerer Bericht oder Leitfaden, meist als Download angeboten, der ein Thema erklärt und die Fachkompetenz des Unternehmens zeigt.",
  },
  "discovery-meeting": {
    title: "Discovery-Termin (Bedarfsgespräch)",
    match: ["Discovery-Termin", "Discovery Meeting", "Bedarfsgespräch", "Scoping-Termin"],
    plain: "Ein erstes ernsthaftes Gespräch, in dem der Verkäufer erfährt, was der Käufer braucht und wie groß die Aufgabe ist, bevor er ein Angebot macht.",
  },
  sla: {
    title: "SLA — Service Level Agreement",
    match: ["SLA", "Service Level Agreement"],
    plain: "Ein schriftliches Versprechen über das Serviceniveau, zum Beispiel wie schnell der Lieferant reagieren muss, wenn etwas schiefgeht.",
  },
  incident: {
    title: "Störung (Incident)",
    match: ["Störung", "Störungen", "Störungsbearbeitung", "Incident", "Incidents"],
    plain: "Ein Problem oder Ausfall im Service, den der Lieferant beheben muss. Wie er damit umgeht, zeigt dem Kunden, wie der Lieferant wirklich ist.",
  },
  escalation: {
    title: "Eskalation",
    match: ["Eskalationsweg", "Eskalation", "eskaliert", "eskalieren", "Eskalationsstelle"],
    plain: "Ein Problem an eine ranghöhere Person weitergeben, wenn die erste es nicht lösen kann. Ein Eskalationsweg sagt vorab, wer diese Person ist.",
  },
  "account-owner": {
    title: "Account Owner (Key Account Manager)",
    match: ["Account Owner", "Key Account Manager", "Kundenbetreuung", "Kundenbetreuer", "persönliche Kundenbetreuung"],
    plain: "Die eine Person beim Anbieter, die für die Beziehung zu einem Kunden verantwortlich ist und über die Zeit dieselbe bleibt.",
  },
  tracking: {
    title: "Tracking und Cookies",
    match: ["Tracking", "Cookies", "nicht notwendige Cookies"],
    plain: "Kleine Codebausteine, die verfolgen, was ein Besucher auf einer Website tut. In Deutschland brauchen die nicht unbedingt nötigen zuerst die Einwilligung des Besuchers.",
  },
  betrvg: {
    title: "BetrVG",
    match: ["BetrVG"],
    plain: "Das Betriebsverfassungsgesetz. Es regelt die Rechte des Betriebsrats, auch ein Mitbestimmungsrecht, wenn ein System zur Überwachung von Beschäftigten genutzt werden könnte.",
  },
  "goal-action-kpi": {
    title: "Ziel → Maßnahme → KPI",
    match: ["Ziel → Maßnahme → KPI", "Ziel → Maßnahme → Kennzahl"],
    plain: "Eine Kette, die drei Dinge verbindet: das Ziel, das Sie wollen, die Maßnahme, die Sie ergreifen, und die Zahl (KPI), die zeigt, ob die Maßnahme gewirkt hat. Eine Maßnahme ohne KPI lässt sich nicht steuern.",
  },
  scorecard: {
    title: "Scorecard",
    match: ["Balanced Scorecard", "Scorecard"],
    plain: "Eine Art zu steuern, bei der jedes Ziel mit einer Messgröße, einem Zielwert und einer Maßnahme verbunden ist, sodass das, was Menschen tun, mit dem zusammenhängt, was das Unternehmen will.",
    from: "Kaplan & Norton 1992",
  },
  governance: {
    title: "Steuerung (Governance)",
    match: ["Governance", "Steuerung"],
    plain: "Die Regeln dafür, wer eine Zahl verantwortet, wie oft sie geprüft wird und was passiert, wenn sie aus dem Ruder läuft.",
  },
  cadence: {
    title: "Rhythmus (Review-Rhythmus)",
    match: ["Rhythmus", "Review-Rhythmus", "Prüfrhythmus"],
    plain: "Wie oft etwas getan oder geprüft wird, zum Beispiel wöchentlich oder monatlich.",
  },
  trigger: {
    title: "Eskalations-Auslöser",
    match: ["Eskalations-Auslöser", "Auslöser", "Auslösers", "Eskalationsschwelle"],
    plain: "Eine vorab festgelegte Regel: Überschreitet eine Zahl einen festgelegten Wert, muss eine benannte Person handeln. Sie beendet die Diskussion darüber, ob gehandelt wird.",
    example: "„Unter 60 % zwei Monate lang“ geht an den Head of Sales.",
  },
  threshold: {
    title: "Schwellenwert",
    match: ["Schwellenwert", "Schwellenwerte", "Schwellenwerts"],
    plain: "Der Wert, an dem sich etwas ändert. Überschreiten Sie ihn, sagt die Regel, dass jemand handeln muss.",
  },
  dashboard: {
    title: "Dashboard",
    match: ["Dashboard", "Dashboards"],
    plain: "Ein Bildschirm, der die wichtigsten Zahlen zeigt, regelmäßig aktualisiert, sodass man sie lesen kann, ohne jemanden zu fragen.",
  },
  controlling: {
    title: "Controlling",
    match: ["Controlling"],
    exactCase: true,
    plain: "In einem deutschen Unternehmen die Finanzfunktion, die Budgets und Zahlen verfolgt und darüber berichtet.",
  },
  descope: {
    title: "Eingrenzen",
    match: ["eingrenzen", "eingegrenzt", "Eingrenzung", "Eingrenzen"],
    plain: "Eine Maßnahme kleiner machen, zum Beispiel nur für eine Kundengruppe durchführen, statt sie ganz zu streichen.",
  },
  leverage: {
    title: "Hebelwirkung",
    match: ["Hebelwirkung"],
    plain: "Wie viel Ergebnis Sie für jeden ausgegebenen Euro bekommen.",
  },
  sequencing: {
    title: "Reihenfolge der Einführung",
    match: ["Reihenfolge der Einführung", "Einführungsreihenfolge"],
    plain: "Die Reihenfolge, in der Sie Dinge beginnen. Sie zählt, wenn eines vorhanden sein muss, bevor sich ein anderes messen lässt.",
  },
  "pickup-point": {
    title: "Wiederaufnahmepunkt",
    match: ["Wiederaufnahmepunkt", "Wiederaufnahmepunkts"],
    plain: "Ein Datum oder eine Bedingung, vorab festgelegt, wann Sie auf etwas Zurückgestelltes zurückkommen. Ohne sie ist Zurückstellen dasselbe wie Streichen.",
  },
  "residual-gap": {
    title: "Restlücke",
    match: ["Restlücke"],
    plain: "Der Teil eines Problems, der nach einer Teillösung noch offen ist.",
  },
  pdca: {
    title: "Plan, Do, Check, Act",
    match: ["PDCA", "Plan-Do-Check-Act"],
    plain: "Ein sich wiederholender Zyklus zur Verbesserung: planen, tun, das Ergebnis prüfen, dann aus dem Gelernten handeln und von vorn beginnen.",
    from: "Deming 1986",
  },
  "head-of-sales": {
    title: "Head of Sales",
    match: ["Head of Sales"],
    plain: "Die Person, die für die Ergebnisse des Vertriebsteams und für den Trichter geradesteht. Koordinatoren und Teamleiter berichten meist an diese Rolle, deshalb ist sie oft die Person, an die eine KPI eskaliert.",
  },
  "key-account-manager": {
    title: "Key Account Manager",
    match: ["Key Account Manager"],
    plain: "Ein Vertriebsmitarbeiter, der die Beziehung zu einer Gruppe von Bestandskunden über die Zeit betreut: regelmäßige Reviews und frühzeitiger Kontakt, bevor ein Vertrag endet.",
  },
  "head-of-account-management": {
    title: "Head of Account Management",
    match: ["Head of Account Management"],
    plain: "Der Leiter der Key Account Manager. Er verantwortet, wie gut Bestandskunden gehalten werden.",
  },
  "crm-coordinator": {
    title: "CRM-Koordinator",
    match: ["CRM-Koordinator"],
    plain: "Die Person, die die Kundendatenbank und den Buchungsablauf darin betreibt: Erinnerungen, Nachfassen und die Qualität der Daten.",
  },
  "head-of-delivery": {
    title: "Head of Delivery",
    match: ["Head of Delivery"],
    plain: "Die Person, die dafür geradesteht, dass Projekte geliefert werden und der Support nach dem Go-live läuft.",
  },
  "sales-team-lead": {
    title: "Teamleiter Vertrieb",
    match: ["Teamleiter Vertrieb", "Teamleiter"],
    plain: "Die Person, die eine Gruppe von Verkäufern im Tagesgeschäft führt und coacht. Kleiner im Umfang als der Head of Sales, der für die ganze Funktion geradesteht.",
  },
  cco: {
    title: "Chief Customer Officer",
    match: ["Chief Customer Officer"],
    plain: "Die Führungskraft, die dafür geradesteht, wie gut das Unternehmen seine Kunden hält und ausbaut. In diesem Fall ist die Rolle mit der Vertriebsleitung verbunden.",
  },
};
