import { Mail, MailFolder } from "./types";

export const mockMails: Mail[] = [
  {
    id: "1",
    subject: "Kostenübernahme für Physiotherapie",
    sender: "Anna Müller",
    senderEmail: "anna.mueller@email.de",
    preview:
      "Sehr geehrte Damen und Herren, ich benötige eine Kostenübernahme für eine Physiotherapie nach meinem Bandscheibenvorfall...",
    body: `Sehr geehrte Damen und Herren,

nach meinem Bandscheibenvorfall im Dezember 2023 hat mein Orthopäde mir eine Physiotherapie verordnet.

Details zu meiner Anfrage:
- Diagnose: Bandscheibenvorfall L4/L5
- Verordnete Behandlungen: 20 Einheiten Physiotherapie
- Behandlungszeitraum: 6 Wochen
- Praxis: Physiotherapie Schmidt, München

Ich bitte um schnellstmögliche Bearbeitung, da die Schmerzen sehr stark sind.

Mit freundlichen Grüßen,
Anna Müller
Versichertennummer: 12345678`,
    date: new Date("2024-01-15T09:30:00"),
    read: false,
    starred: true,
    important: true,
    labels: ["Kostenübernahme", "Physiotherapie"],
    attachments: [
      {
        name: "arztbericht-orthopaedie.pdf",
        size: "1.8 MB",
        type: "PDF",
      },
    ],
  },
  {
    id: "2",
    subject: "Widerspruch gegen Ablehnungsbescheid",
    sender: "Klaus Weber",
    senderEmail: "k.weber@email.de",
    preview:
      "Hiermit lege ich Widerspruch gegen Ihren Ablehnungsbescheid vom 10.01.2024 bezüglich meiner Reha-Maßnahme ein...",
    body: `Sehr geehrte Damen und Herren,

hiermit lege ich förmlich Widerspruch gegen Ihren Ablehnungsbescheid vom 10.01.2024 ein.

Begründung:
- Aktenzeichen: RH-2024-0156
- Abgelehnte Leistung: Rehabilitationsmaßnahme nach Herzinfarkt
- Medizinische Notwendigkeit ist gegeben
- Facharzt bestätigt dringende Empfehlung

Ich bitte um erneute Prüfung meines Falls und stelle alle erforderlichen Unterlagen zur Verfügung.

Mit freundlichen Grüßen,
Klaus Weber
Versichertennummer: 87654321`,
    date: new Date("2024-01-14T14:22:00"),
    read: true,
    starred: false,
    important: true,
    labels: ["Widerspruch", "Rehabilitation"],
  },
  {
    id: "3",
    subject: "Versichertenkarte verloren - Ersatzkarte beantragen",
    sender: "Maria Schmidt",
    senderEmail: "maria.schmidt@email.de",
    preview:
      "Guten Tag, ich habe meine Versichertenkarte verloren und benötige dringend eine Ersatzkarte...",
    body: `Guten Tag,

ich habe leider meine Versichertenkarte verloren und benötige dringend eine Ersatzkarte.

Details:
- Versichertennummer: 11223344
- Verloren am: 12.01.2024
- Ort: Hamburg Hauptbahnhof
- Dringlichkeit: Habe morgen einen Arzttermin

Können Sie mir bitte eine Ersatzkarte zusenden oder eine vorläufige Bescheinigung ausstellen?

Vielen Dank für Ihre schnelle Hilfe.

Mit freundlichen Grüßen,
Maria Schmidt`,
    date: new Date("2024-01-14T14:15:00"),
    read: false,
    starred: false,
    important: true,
    labels: ["Versichertenkarte", "Verlust"],
  },
  {
    id: "4",
    subject: "Terminanfrage: Beratung zu Zusatzleistungen",
    sender: "Thomas Becker",
    senderEmail: "thomas.becker@email.de",
    preview:
      "Sehr geehrtes Team, ich würde gerne einen Beratungstermin zu Ihren Zusatzleistungen vereinbaren...",
    body: `Sehr geehrtes Team,

ich würde gerne einen Beratungstermin zu Ihren Zusatzleistungen vereinbaren.

Interessensgebiete:
- Zahnzusatzversicherung
- Auslandsreisekrankenversicherung  
- Naturheilverfahren
- Chefarztbehandlung

Verfügbare Zeiten:
- Montag bis Freitag: 14:00 - 18:00 Uhr
- Bevorzugt: Persönlicher Termin in der Geschäftsstelle

Bitte teilen Sie mir einen passenden Termin mit.

Mit freundlichen Grüßen,
Thomas Becker
Versichertennummer: 55667788`,
    date: new Date("2024-01-14T12:00:00"),
    read: true,
    starred: false,
    important: false,
    labels: ["Beratung", "Zusatzleistungen"],
  },
  {
    id: "5",
    subject: "Rückerstattung Arztkosten - Privatrechnung",
    sender: "Sandra Fischer",
    senderEmail: "sandra.fischer@email.de",
    preview:
      "Sehr geehrte Damen und Herren, ich bitte um Erstattung der Kosten für eine privatärztliche Behandlung...",
    body: `Sehr geehrte Damen und Herren,

ich bitte um Erstattung der Kosten für eine privatärztliche Behandlung.

Behandlungsdetails:
- Datum: 08.01.2024
- Arzt: Dr. med. Hartmann, Privatpraxis
- Behandlung: Notfallbehandlung am Wochenende
- Rechnungsbetrag: 180,00 €
- Grund: Kein Kassenarzt verfügbar

Die Originalrechnung ist beigefügt. Ich bitte um zeitnahe Bearbeitung.

Mit freundlichen Grüßen,
Sandra Fischer
Versichertennummer: 99887766`,
    date: new Date("2024-01-13T16:45:00"),
    read: true,
    starred: false,
    important: true,
    labels: ["Erstattung", "Privatrechnung"],
    attachments: [
      {
        name: "privatrechnung-dr-hartmann.pdf",
        size: "0.8 MB",
        type: "PDF",
      },
    ],
  },
  {
    id: "6",
    subject: "Änderung der Bankverbindung",
    sender: "Robert Schneider",
    senderEmail: "robert.schneider@email.de",
    preview:
      "Hiermit teile ich Ihnen meine neue Bankverbindung für Erstattungen mit...",
    body: `Sehr geehrte Damen und Herren,

hiermit teile ich Ihnen meine neue Bankverbindung mit:

Neue Bankdaten:
- Kontoinhaber: Robert Schneider
- IBAN: DE89 1234 5678 9012 3456 78
- BIC: DEUTDEFF123
- Bank: Deutsche Bank AG

Alte Bankverbindung:
- IBAN: DE12 9876 5432 1098 7654 32

Bitte aktualisieren Sie meine Daten für zukünftige Erstattungen.

Mit freundlichen Grüßen,
Robert Schneider
Versichertennummer: 44556677`,
    date: new Date("2024-01-13T08:00:00"),
    read: false,
    starred: false,
    important: false,
    labels: ["Bankdaten", "Änderung"],
  },
  {
    id: "7",
    subject: "Schwangerschaft - Anmeldung und Leistungen",
    sender: "Julia Hoffmann",
    senderEmail: "julia.hoffmann@email.de",
    preview:
      "Sehr geehrtes Team, ich bin schwanger und möchte mich über die Leistungen der Krankenkasse informieren...",
    body: `Sehr geehrtes Team,

ich bin schwanger (8. Woche) und möchte mich über die Leistungen informieren.

Meine Fragen:
1. Welche Vorsorgeuntersuchungen werden übernommen?
2. Kostenübernahme für Hebamme
3. Mutterschaftsgeld - Antragsstellung
4. Zusätzliche Leistungen für Schwangere

Erwarteter Geburtstermin: September 2024

Ich freue mich auf Ihre Informationen und einen Beratungstermin.

Mit freundlichen Grüßen,
Julia Hoffmann
Versichertennummer: 33445566`,
    date: new Date("2024-01-12T11:30:00"),
    read: true,
    starred: true,
    important: true,
    labels: ["Schwangerschaft", "Beratung"],
  },
  {
    id: "8",
    subject: "Beschwerde über Wartezeit beim Facharzt",
    sender: "Heinrich Müller",
    senderEmail: "heinrich.mueller@email.de",
    preview:
      "Sehr geehrte Damen und Herren, ich beschwere mich über die unzumutbare Wartezeit für einen Facharzttermin...",
    body: `Sehr geehrte Damen und Herren,

ich beschwere mich über die unzumutbare Wartezeit für einen Facharzttermin.

Situation:
- Überweisung zum Kardiologen seit 15.12.2023
- Nächster freier Termin: Mai 2024
- Wartezeit: 5 Monate
- Beschwerden: Herzrhythmusstörungen

Diese Wartezeit ist bei meinen Beschwerden nicht akzeptabel. Ich bitte um Ihre Unterstützung bei der Terminvermittlung.

Mit freundlichen Grüßen,
Heinrich Müller
Versichertennummer: 66778899`,
    date: new Date("2024-01-12T09:15:00"),
    read: true,
    starred: false,
    important: true,
    labels: ["Beschwerde", "Terminvermittlung"],
  },
];

export const mockFolders: MailFolder[] = [
  {
    id: "inbox",
    name: "Posteingang",
    count: 5,
    icon: "inbox",
  },
  {
    id: "sent",
    name: "Gesendet",
    count: 12,
    icon: "send",
  },
  {
    id: "drafts",
    name: "Entwürfe",
    count: 3,
    icon: "file-text",
  },
  {
    id: "starred",
    name: "Markiert",
    count: 2,
    icon: "star",
  },
  {
    id: "important",
    name: "Wichtig",
    count: 4,
    icon: "alert-circle",
  },
  {
    id: "spam",
    name: "Spam",
    count: 0,
    icon: "shield",
  },
  {
    id: "trash",
    name: "Papierkorb",
    count: 1,
    icon: "trash",
  },
];
