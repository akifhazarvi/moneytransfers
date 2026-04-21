export interface SwedishCorridorBlock {
  h2: string;
  intro: string;
  faqs: { q: string; a: string }[];
}

export const swedishCorridorBlocks: Record<string, SwedishCorridorBlock> = {
  "sweden-to-morocco": {
    h2: "Skicka pengar från Sverige till Marocko — jämför bästa kursen",
    intro:
      "Sverige har en av Nordens största marockanska gemenskaper, med över 50 000 personer med marockansk bakgrund. Jämför SEK till MAD från 10+ leverantörer — Wise, Remitly, Paysend, Western Union, Ria, MoneyGram — för att hitta den billigaste vägen. Du kan välja bankinsättning till CIH, BMCE eller Attijariwafa, kontantuttag hos 4 000+ agenter, eller direkt till Orange Money-plånbok. Skillnaden i växelkurs mellan en svensk bank (Swedbank, SEB, Nordea) och en specialist kan vara 3–5 %.",
    faqs: [
      {
        q: "Hur mycket kostar det att skicka pengar från Sverige till Marocko?",
        a: "Kostnaden består av två delar: avgiften och växelkursmarginalen. Paysend tar ut en platt avgift på 19 SEK oavsett belopp. Wise använder den verkliga marknadskursen och tar en transparent avgift på 0,8–1,2 %. Svenska banker (Swedbank, SEB, Nordea, Handelsbanken) kan lägga till 3–5 % på växelkursen plus 150–200 SEK i SWIFT-avgift. På en överföring på 5 000 SEK kan skillnaden mellan en specialist och en bank överstiga 200 MAD.",
      },
      {
        q: "Hur lång tid tar en överföring från Sverige till Marocko?",
        a: "Orange Money-leverans är snabbast — 1–5 minuter via leverantörer som stöder det. Kontantuttag via Western Union, MoneyGram eller Ria är tillgängligt inom 1–2 timmar på 4 000+ platser i Marocko. Bankinsättningar till CIH, BMCE eller Attijariwafa tar normalt 1–2 arbetsdagar med Wise, och 2–5 dagar via traditionell SWIFT från svenska banker. Om du finansierar överföringen med Swish eller SEPA Instant sker sändarsidan nästan omedelbart.",
      },
      {
        q: "Kan jag skicka pengar till Orange Money från Sverige?",
        a: "Ja, vissa specialistleverantörer stöder direkt Orange Money-leverans från Sverige, och pengarna kommer fram inom 1–5 minuter. Orange Money är ett samarbete med franska Orange Group och en av de snabbast växande betalningsrälserna i Marocko. Om din mottagare har ett Orange Money-konto är detta ofta betydligt snabbare än kontantuttag eller bankinsättning. Kontrollera leveransalternativen hos din valda leverantör — alla stöder inte denna ruta än.",
      },
    ],
  },
  "sweden-to-mexico": {
    h2: "Skicka pengar från Sverige till Mexiko — jämför bästa kursen SEK till MXN",
    intro:
      "Mexiko är världens näst största mottagarland för remitteringar och tog emot 63,3 miljarder USD under 2024. Den svensk-mexikanska korridoren är liten men växande, och drar nytta av Mexikos toppklass SPEI-system för realtidsbetalningar samt ett omfattande nätverk för kontantuttag hos 21 000+ Oxxo-butiker. Jämför SEK till MXN från 10+ leverantörer — Wise, Remitly, Western Union, MoneyGram — för att hitta den billigaste rutten. Svenska banker (Swedbank, SEB, Nordea) kan lägga till 3–5 % på växelkursen plus 150–200 SEK i SWIFT-avgift.",
    faqs: [
      {
        q: "Vilken är den billigaste leverantören från Sverige till Mexiko?",
        a: "Wise och Remitly levererar konsekvent mest pesos per krona. Wise använder den verkliga marknadskursen med en transparent avgift på cirka 0,6–1,0 % — bäst för överföringar över 2 000 SEK. Remitly erbjuder kampanjer med avgiftsfria första överföringar och snabb leverans. För kontantuttag i Oxxo är Western Union och MoneyGram starkast med 21 000+ platser. Jämför alltid det totala MXN-beloppet mottagaren får, inte bara avgiften.",
      },
      {
        q: "Vad är SPEI och varför spelar det roll?",
        a: "SPEI (Sistema de Pagos Electrónicos Interbancarios) är Mexikos betalningsrals i realtid, drivet av Banxico. När du skickar SEK via Wise eller Remitly tar leverantören emot dina kronor, växlar till MXN och använder SPEI för att kreditera mottagarens mexikanska bankkonto — normalt inom 30 sekunder. Detta är snabbare än en typisk inhemsk banköverföring i de flesta länder. Mottagarens bank (BBVA México, Banorte, Santander, Citibanamex, HSBC) stöder alla SPEI.",
      },
      {
        q: "Hur lång tid tar en överföring från Sverige till Mexiko?",
        a: "Bankinsättning via SPEI (med Wise eller Remitly) tar sekunder till minuter. Oxxo-kontantuttag är tillgängligt inom 1–2 timmar på 21 000+ butiker. Traditionella SWIFT-överföringar från svenska banker tar 2–4 arbetsdagar. Om du finansierar med Swish eller SEPA Instant sker sändarsidan omedelbart — hela överföringen kan ta mindre än en timme på en specialistleverantör.",
      },
    ],
  },
  "sweden-to-romania": {
    h2: "Skicka pengar från Sverige till Rumänien — bästa kursen SEK till RON",
    intro:
      "Rumänien är Sveriges största östeuropeiska diaspora med 30 000–45 000 rumänskfödda invånare. Revolut är särskilt populärt på denna rutt — Rumänien är en av Revoluts största europeiska marknader med miljontals användare. Jämför SEK till RON från 10+ leverantörer — Wise, Revolut, TransferGo, Paysend — för att hitta den billigaste rutten. Mottagare hos BCR, BRD, Banca Transilvania, ING Bank Romania eller Raiffeisen får normalt pengarna samma dag.",
    faqs: [
      {
        q: "Vilken är den billigaste leverantören från Sverige till Rumänien?",
        a: "Revolut är svårslaget om både avsändare och mottagare har Revolut — överföringar är omedelbara och gratis. För icke-Revolut-mottagare är Wise och TransferGo mest kostnadseffektiva: Wise tar cirka 0,6–1,0 % med verklig marknadskurs; TransferGo erbjuder Now (omedelbart) och Tomorrow (billigare) som hastighetsalternativ. Paysend har platt avgift på 19 SEK, idealt för belopp under 2 000 SEK.",
      },
      {
        q: "Kan jag skicka euro direkt till ett rumänskt konto?",
        a: "Ja. Många rumänska bankkonton kan hålla både EUR och RON — BCR, BRD, Banca Transilvania, ING Bank Romania och Raiffeisen stöder flervalutakonton. Wise och Revolut kan skicka EUR direkt via SEPA Instant med leverans på sekunder under arbetstid. Mottagaren kan sedan växla EUR till RON lokalt om det behövs — ibland ger det bättre kurs än att leverantören växlar i förväg.",
      },
      {
        q: "Hur lång tid tar en överföring från Sverige till Rumänien?",
        a: "Revolut-till-Revolut är omedelbart. TransferGo Now levererar inom 30 minuter. Wise levererar normalt till rumänska bankkonton inom några timmar via SEPA. Paysend levererar inom 1–2 arbetsdagar. Traditionella SWIFT-överföringar från svenska banker tar 2–4 arbetsdagar och är det långsammaste alternativet.",
      },
    ],
  },
  "sweden-to-brazil": {
    h2: "Skicka pengar från Sverige till Brasilien — bästa kursen SEK till BRL via PIX",
    intro:
      "Brasilien tog emot 5,3 miljarder USD i remitteringar under 2024, och Sverige har en växande brasiliansk gemenskap på cirka 8 000–12 000 personer. SEK→BRL-korridoren definieras av PIX — Brasiliens kostnadsfria betalningssystem i realtid som levererar till alla brasilianska banker och mobilplånböcker på under 10 sekunder, dygnet runt. Wise, Remitly och Instarem stöder direkta PIX-leveranser till Itaú, Bradesco, Santander, Banco do Brasil, Nubank och Inter. En CPF (brasilianskt skattenummer) krävs för alla internationella överföringar till Brasilien.",
    faqs: [
      {
        q: "Vilken är den billigaste leverantören från Sverige till Brasilien?",
        a: "Wise är konsekvent billigast för överföringar över 2 000 SEK — verklig marknadskurs plus en transparent avgift på 0,8–1,3 % med PIX-leverans på under 10 sekunder. Remitly är konkurrenskraftigt och kör ofta kampanjer med avgiftsfria första överföringar. Svenska banker är dyrast — 3–5 % växelkursmarginal plus 150–200 SEK i SWIFT-avgifter. Jämför alltid totalt BRL-belopp efter IOF-skatt, inte bara avgiften.",
      },
      {
        q: "Vad är PIX och hur fungerar det?",
        a: "PIX är Brasiliens omedelbara betalningssystem, lanserat av Banco Central do Brasil i november 2020. Det levererar överföringar på under 10 sekunder, dygnet runt, helt kostnadsfritt för privatpersoner. Alla brasilianska banker och digitala plånböcker (Itaú, Bradesco, Santander, Banco do Brasil, Nubank, Inter) deltar. Mottagaren anger en PIX-nyckel — CPF-nummer, e-post, telefonnummer eller slumpmässig UUID — och leverantören (Wise, Remitly) triggar leveransen automatiskt.",
      },
      {
        q: "Vad är IOF-skatt?",
        a: "IOF (Imposto sobre Operações Financeiras) är en brasiliansk federal skatt på finansiella transaktioner, inklusive inkommande valutaväxling. För privata överföringar är IOF normalt 0,38 % av det överförda beloppet. Skatten dras automatiskt innan pengarna når mottagaren — det slutliga BRL-beloppet i din offert är netto efter IOF. Du behöver inte göra något — det hanteras i banksystemet.",
      },
      {
        q: "Behöver mottagaren ett CPF-nummer?",
        a: "Ja. CPF (Cadastro de Pessoas Físicas) är Brasiliens skattenummer och krävs för alla internationella överföringar — detta är ett federalt krav, inte en leverantörsregel. Din mottagare måste uppge sitt CPF när du initierar överföringen. Om de använder CPF som PIX-nyckel fyller samma nummer båda rollerna.",
      },
    ],
  },
  "sweden-to-colombia": {
    h2: "Skicka pengar från Sverige till Colombia — bästa kursen SEK till COP",
    intro:
      "Colombia tog emot 11,8 miljarder USD i remitteringar under 2024 — det tredje största inflödet i Latinamerika efter Mexiko och Guatemala. Sverige har 6 000–9 000 personer med colombiansk bakgrund, en gemenskap byggd genom flyktingmigration på 1970–80-talet och nyare arbets- och studievägar. Jämför SEK till COP från 10+ leverantörer — Wise, Remitly, Western Union, MoneyGram, WorldRemit. Leverans till mobilplånböckerna Nequi och Daviplata (över 20 miljoner användare vardera) är normalt färdig på minuter.",
    faqs: [
      {
        q: "Vilken är den billigaste leverantören från Sverige till Colombia?",
        a: "Wise och Remitly levererar konsekvent mest pesos per krona. Wise tar cirka 0,7–1,2 % med verklig marknadskurs — bäst för överföringar över 2 000 SEK. Remitly erbjuder avgiftsfria första överföringar och snabb leverans till bank och till Nequi/Daviplata-plånböcker. För kontantuttag har Western Union och MoneyGram det bredaste nätverket, särskilt på landsbygden där bankerna är glesa.",
      },
      {
        q: "Vad är Nequi och Daviplata?",
        a: "Nequi (ägs av Bancolombia) och Daviplata (ägs av Davivienda) är Colombias två dominerande mobilplånböcker med över 20 miljoner användare vardera. Mottagare håller colombianska pesos i en smartphone-app kopplad till sitt nationella ID (cédula). Remitly stöder direkt insättning till båda — pengarna kommer fram inom minuter. För obankade eller delvis bankade mottagare är Nequi/Daviplata mycket lättare att öppna än ett traditionellt bankkonto.",
      },
      {
        q: "Kan jag skicka kontanter för upphämtning i Colombia?",
        a: "Ja. Western Union, MoneyGram och Ria har tusentals upphämtningsplatser i Colombia — inklusive stora stormarknader (Éxito, Jumbo, Olímpica), apotekskedjor (Cruz Verde, La Rebaja) och dedikerade agentkontor. Täckningen är stark både i storstäderna (Bogotá, Medellín, Cali, Barranquilla, Cartagena) och på landsbygden. Kontanter är normalt tillgängliga inom 1–2 timmar. Mottagaren behöver sitt colombianska cédula-ID och referensnumret.",
      },
      {
        q: "Hur lång tid tar en överföring från Sverige till Colombia?",
        a: "Leveranser till Nequi och Daviplata via Remitly tar minuter. Kontantuttag via Western Union, MoneyGram eller Ria är normalt tillgängligt inom 1–2 timmar. Bankinsättningar till Bancolombia, Davivienda, Banco de Bogotá, BBVA Colombia eller AV Villas via Wise kommer normalt fram samma dag under colombianska banktider. Traditionella SWIFT-överföringar från svenska banker tar 2–4 arbetsdagar.",
      },
    ],
  },
  "sweden-to-philippines": {
    h2: "Skicka pengar från Sverige till Filippinerna — bästa kursen SEK till PHP",
    intro:
      "Filippinerna tog emot 39,6 miljarder USD i överföringar 2024 — världens fjärde största mottagarland. Svensk-filippinska familjer, filippinsk sjukvårdspersonal i Sverige och pensionärer med filippinska partners skickar regelbundet pengar hem. Jämför SEK till PHP från 10+ leverantörer — Wise, Remitly, Panda Remit, WorldRemit, TransferGo — för att hitta den billigaste rutten. Du kan välja GCash (direkt till mobilplånbok), bankinsättning till BDO/BPI/Metrobank via InstaPay, eller kontantuttag hos Cebuana Lhuillier, M Lhuillier och LBC.",
    faqs: [
      {
        q: "Vilken är den billigaste leverantören från Sverige till Filippinerna?",
        a: "Wise och Remitly levererar konsekvent mest PHP per SEK. Wise använder mellankursen (marknadskursen) med en liten transparent avgift på cirka 0,8–1,2 %. Remitly erbjuder snabb leverans och kör ofta kampanjer med avgiftsfria första överföringar. Panda Remit har ofta avgiftsfria första överföringar. Svenska banker (Swedbank, SEB, Nordea) lägger till 3–5 % på växelkursen plus 50–200 SEK i avgift — på en 5 000 SEK-överföring kan skillnaden överstiga 400 PHP. Jämför alltid det totala PHP-beloppet mottagaren får, inte bara avgiften.",
      },
      {
        q: "Kan jag skicka pengar från Sverige direkt till GCash?",
        a: "Ja. Remitly, Wise och WorldRemit stöder direkt GCash-leverans från Sverige — pengarna kommer normalt fram till mottagarens GCash-plånbok inom 30 minuter. GCash är den dominerande mobilplånboken på Filippinerna med över 81 miljoner användare. Din mottagare behöver ett aktivt GCash-konto kopplat till sitt filippinska mobilnummer. Internationella banköverföringar kan inte gå direkt till GCash — du måste använda en licensierad remittanspartner.",
      },
      {
        q: "När är bästa tiden att skicka SEK till PHP?",
        a: "Den svenska kronan var exceptionellt volatil under 2024–2025 — kronan steg 16,8 % mot US-dollarn under 2025, vilket gjorde den till den G10-valuta som utvecklades bäst. För SEK→PHP-avsändare betydde detta betydligt mer PHP per krona i slutet av året än i början. Ställ in en kursvakt via Wise eller Remitly för att låsa en förmånlig kurs. För julöverföringar (december är högsäsong) är kurserna ofta något sämre på grund av hög efterfrågan — att skicka i början av november ger ofta mer PHP.",
      },
    ],
  },
};
