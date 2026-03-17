import type { SwiftContent } from "./swift-content";

export const swiftContentFr: SwiftContent = {
  editorial: {
  "united-kingdom": {
    title: "Comment fonctionne SWIFT au Royaume-Uni",
    intro:
      "Les clients britanniques confondent souvent les codes SWIFT avec les codes de tri et les coordonnées Faster Payments. Ces éléments ne sont pas interchangeables. Les virements nationaux en GBP utilisent normalement le code de tri et le numéro de compte, tandis que les virements internationaux entrants utilisent le code SWIFT/BIC de la banque ainsi que l'identifiant de compte requis par cette banque.",
    bullets: [
      "Pour les virements nationaux au Royaume-Uni, les bénéficiaires ont généralement besoin d'un code de tri et d'un numéro de compte. Un code SWIFT est principalement requis lorsque l'expéditeur est situé hors du Royaume-Uni ou que le paiement transite par le système bancaire correspondant.",
      "Les grandes banques britanniques peuvent utiliser un seul code SWIFT pour les paiements entrants et acheminer les fonds en interne vers les agences locales, de sorte que le code d'agence figurant sur d'anciens documents n'est pas toujours le bon à communiquer.",
      "Si le virement arrive en GBP depuis l'Europe ou l'Amérique du Nord, des frais intermédiaires peuvent quand même s'appliquer même si la banque bénéficiaire est à Londres. Confirmez la devise de réception préférée de la banque bénéficiaire avant d'envoyer.",
    ],
  },
  netherlands: {
    title: "Comment fonctionne SWIFT aux Pays-Bas",
    intro:
      "Les Pays-Bas font partie de la zone SEPA, de sorte que de nombreux virements en euros n'ont jamais besoin de SWIFT. Les clients bancaires néerlandais ont généralement besoin de l'IBAN pour les paiements intra-européens et n'ont besoin d'un SWIFT/BIC que lorsque le paiement provient de l'extérieur de la SEPA ou dans une devise autre que l'euro.",
    bullets: [
      "Si l'expéditeur paie depuis un autre pays SEPA en EUR, l'IBAN néerlandais est généralement suffisant et le virement peut transiter par SEPA plutôt que par SWIFT.",
      "SWIFT devient plus pertinent pour les paiements entrants en USD, GBP ou autres devises non EUR, où les banques correspondantes et les frais de levée peuvent réduire le montant final reçu.",
      "Les entreprises internationales utilisant des comptes néerlandais doivent confirmer si la banque bénéficiaire souhaite un règlement en EUR ou en devise étrangère, car la conversion automatique à la banque réceptrice peut être coûteuse.",
    ],
  },
  "hong-kong": {
    title: "Comment fonctionne SWIFT à Hong Kong",
    intro:
      "Hong Kong est un important centre bancaire transfrontalier, de sorte que SWIFT y est bien plus central que sur les marchés de détail exclusivement nationaux. Les entreprises et les expatriés reçoivent souvent des paiements en USD, EUR, GBP et CNY sur des comptes à Hong Kong, ce qui signifie que le routage via les banques correspondantes et les choix de devise de règlement ont leur importance.",
    bullets: [
      "Un compte bancaire à Hong Kong peut prendre en charge plusieurs devises, mais la banque bénéficiaire peut quand même appliquer des frais de remise entrants ou des marges de conversion différents selon la devise reçue.",
      "Si l'expéditeur peut choisir entre un règlement en USD ou en HKD, il vaut la peine de confirmer lequel laisse au bénéficiaire le meilleur résultat net après frais et conversion de devises.",
      "Pour les paiements liés à la Chine continentale, ne supposez pas qu'un itinéraire SWIFT via Hong Kong se comporte comme un virement CNY national. Les contrôles de conformité, les normes de dénomination des bénéficiaires et les délais de règlement peuvent différer sensiblement.",
    ],
  },
  "united-states": {
    title: "Comment fonctionne SWIFT aux États-Unis",
    intro:
      "Le système bancaire américain utilise les numéros de routage ABA et Fedwire pour les virements nationaux, qui sont complètement séparés du réseau SWIFT. Lorsque vous envoyez de l'argent à l'international vers un compte bancaire américain, vous avez besoin du code SWIFT/BIC de la banque destinataire, et non du numéro de routage ABA à neuf chiffres utilisé pour les virements ACH et wire nationaux. De nombreuses banques américaines ont des codes SWIFT différents pour leurs guichets de virements internationaux et leurs agences de détail.",
    bullets: [
      "Les banques américaines acheminent souvent les virements internationaux entrants via une passerelle SWIFT centrale, généralement au niveau de leur correspondant à New York. Le code SWIFT dont vous avez besoin peut différer de l'agence où le compte est domicilié, confirmez donc toujours avec la banque du bénéficiaire.",
      "Pour les paiements libellés en USD arrivant de l'étranger, la banque réceptrice peut facturer des frais de virement entrant (généralement 15-25 USD) même si l'expéditeur a payé tous les frais de sortie. Demandez au bénéficiaire de vérifier le barème des frais de sa banque pour les virements internationaux entrants.",
      "Si vous envoyez vers un compte américain dans une devise autre que l'USD, la banque bénéficiaire effectuera la conversion à son propre taux de change, qui est généralement défavorable. Envoyer en USD et laisser la banque d'origine gérer la conversion produit souvent un meilleur résultat.",
    ],
  },
  india: {
    title: "Comment fonctionne SWIFT en Inde",
    intro:
      "L'Inde utilise l'IFSC (Indian Financial System Code) pour les virements bancaires nationaux via NEFT, RTGS et IMPS, mais ces codes ne fonctionnent pas pour les paiements internationaux. Les virements internationaux entrants nécessitent le code SWIFT/BIC de la banque réceptrice, et toutes ces transactions sont soumises aux exigences de conformité de la Reserve Bank of India (RBI), notamment les déclarations d'objet du paiement.",
    bullets: [
      "Chaque agence bancaire indienne possède à la fois un code IFSC (pour les virements nationaux) et peut être couverte par un code SWIFT (pour les virements internationaux). Le code SWIFT pointe souvent vers le centre de traitement central de la banque plutôt que vers l'agence locale, confirmez donc le bon code avec le bénéficiaire.",
      "Les réglementations de la RBI exigent que l'objet de chaque remise étrangère entrante soit déclaré. Les codes d'objet courants incluent l'entretien familial, les frais de scolarité et les paiements commerciaux. Des codes d'objet incorrects peuvent retarder ou bloquer le crédit sur le compte du bénéficiaire.",
      "Pour les remises importantes vers l'Inde, les frais des banques intermédiaires peuvent réduire le montant final en INR. Passer par des prestataires qui utilisent des corridors de paiement dédiés en INR plutôt que le routage SWIFT multi-saut permet souvent d'obtenir un règlement plus rapide et un coût total plus faible.",
    ],
  },
  pakistan: {
    title: "Comment fonctionne SWIFT au Pakistan",
    intro:
      "Le système bancaire du Pakistan est réglementé par la State Bank of Pakistan (SBP), et tous les virements internationaux entrants doivent respecter les réglementations de change du SBP. SWIFT est le principal canal pour recevoir les virements bancaires internationaux, avec les grandes banques comme HBL, UBL, MCB et Allied Bank toutes connectées au réseau SWIFT. Le règlement en PKR est géré localement après l'arrivée des fonds en devise étrangère.",
    bullets: [
      "Les grandes banques du Pakistan — Habib Bank (HBL), United Bank (UBL), MCB Bank et Allied Bank — disposent chacune de plusieurs codes SWIFT couvrant les sièges sociaux et les agences principales. Utilisez toujours le code SWIFT correspondant à l'agence spécifique ou au centre de traitement où est domicilié le compte du bénéficiaire.",
      "Les remises entrantes au Pakistan sont exonérées de retenue à la source dans le cadre des programmes d'incitation du SBP, mais la banque réceptrice peut quand même déduire des frais de service. Le bénéficiaire doit confirmer les frais de remise entrants de sa banque avant que vous n'envoyiez, surtout pour les petits montants où les frais fixes ont un impact plus important.",
      "Le SBP exige que les devises étrangères reçues via SWIFT soient converties en PKR au taux en vigueur de la banque le jour du crédit. Le bénéficiaire ne peut pas conserver les fonds en devise étrangère dans un compte PKR standard. Pour de meilleurs taux sur la conversion, comparez le taux affiché de la banque réceptrice avec le taux interbancaire.",
    ],
  },
  germany: {
    title: "Comment fonctionne SWIFT en Allemagne",
    intro:
      "L'Allemagne fait partie de la zone SEPA, de sorte que les virements libellés en euros en provenance d'autres pays SEPA transitent généralement uniquement via l'IBAN et empruntent le Virement SEPA plutôt que SWIFT. SWIFT devient pertinent lorsque le paiement provient de l'extérieur de la SEPA ou implique une devise autre que l'EUR. Deutsche Bank, Commerzbank et le réseau Sparkassen figurent parmi les participants SWIFT les plus fréquemment utilisés pour les virements internationaux entrants.",
    bullets: [
      "Pour les paiements en EUR depuis la zone SEPA (UE, EEE, Suisse, Royaume-Uni pour certains schémas), vous n'avez généralement besoin que de l'IBAN allemand. Le code BIC/SWIFT est facultatif pour les virements SEPA et la plupart des banques achemineront le paiement correctement avec le seul IBAN.",
      "Les virements entrants non libellés en EUR (comme USD ou GBP) vers un compte bancaire allemand emprunteront SWIFT et peuvent entraîner des frais de banque correspondante qui réduisent le montant reçu. Si le bénéficiaire détient un compte multidevises, envoyer dans la devise d'origine évite une conversion automatique au taux de la banque réceptrice.",
      "Les Sparkassen (caisses d'épargne) et les Volksbanken (banques coopératives) allemandes ont chacune leurs propres codes SWIFT distincts de ceux des grandes banques commerciales. Ne supposez pas qu'un code SWIFT Deutsche Bank générique fonctionnera pour un compte Sparkasse — chaque établissement requiert son propre BIC.",
    ],
  },
  france: {
    title: "Comment fonctionne SWIFT en France",
    intro:
      "La France est un membre central de la SEPA, de sorte que la plupart des virements en EUR depuis d'autres pays européens ne nécessitent pas du tout de code SWIFT — l'IBAN français est suffisant. Les codes SWIFT (également appelés BIC en France) deviennent nécessaires lorsque l'expéditeur est situé hors de la zone SEPA ou lorsque le virement est dans une devise autre que l'EUR. Les banques françaises utilisent couramment les codes BIC8, le BIC11 complet n'étant nécessaire que pour identifier une agence spécifique.",
    bullets: [
      "Pour les paiements EUR entrants en provenance des pays SEPA, fournir l'IBAN français suffit. Les banques françaises, dont BNP Paribas, Crédit Agricole et Société Générale, les traiteront sans BIC. Pour les expéditeurs hors SEPA, le code BIC8 (huit caractères) est généralement suffisant car les banques françaises routent en interne.",
      "Si vous envoyez une devise autre que l'EUR (comme USD ou GBP) vers un compte bancaire français, le paiement transitera par SWIFT et la banque réceptrice convertira en EUR à son propre taux. Cette conversion est souvent coûteuse — envisagez de convertir en EUR du côté de l'expéditeur si votre prestataire offre un meilleur taux de change.",
      "Certaines banques françaises facturent une commission d'entrée pour les virements SWIFT qui n'arrivent pas via SEPA. Ces frais (souvent appelés frais de réception de virement international) peuvent varier de 10 à 30 EUR. Le bénéficiaire doit consulter le barème tarifaire de sa banque pour éviter les mauvaises surprises.",
    ],
  },
  "united-arab-emirates": {
    title: "Comment fonctionne SWIFT aux Émirats arabes unis",
    intro:
      "Les EAU sont un important centre bancaire international, et leurs banques sont fortement connectées au réseau SWIFT pour les virements personnels et professionnels. L'AED est indexé sur le USD à un taux fixe, ce qui simplifie les considérations de devises pour les virements libellés en USD. Les banques des EAU proposent couramment des comptes multidevises, et beaucoup opèrent à la fois dans les juridictions de la zone franche et dans celles du continent.",
    bullets: [
      "Les banques des EAU comme Emirates NBD, ADCB, FAB et Mashreq ont chacune des codes SWIFT distincts. Les agences en zones franches (comme celles du DIFC ou de l'ADGM) peuvent utiliser des codes SWIFT différents de ceux des agences continentales de la banque, confirmez donc toujours le code exact avec le bénéficiaire.",
      "Comme l'AED est indexé sur le USD à environ 3,6725, l'envoi en USD vers un compte bancaire des EAU entraîne une conversion prévisible. Toutefois, certaines banques appliquent quand même un écart sur la conversion USD/AED. Pour les virements importants, il peut valoir la peine de demander au bénéficiaire si sa banque peut recevoir et conserver des USD directement.",
      "Les virements SWIFT entrants vers les banques des EAU se règlent généralement dans un jour ouvrable pour les principales devises. La Banque centrale des EAU exige une documentation de conformité pour les virements dépassant certains seuils, ce qui peut retarder le crédit sur le compte du bénéficiaire si l'équipe de conformité de la banque réceptrice demande des informations supplémentaires.",
    ],
  },
  canada: {
    title: "Comment fonctionne SWIFT au Canada",
    intro:
      "Le système bancaire national canadien utilise des numéros de transit (cinq chiffres) combinés à des numéros d'institution (trois chiffres) pour les virements locaux via les réseaux Interac et Paiements Canada. Ces identifiants nationaux ne fonctionnent pas pour les virements internationaux. Les virements internationaux entrants nécessitent le code SWIFT/BIC de la banque du bénéficiaire, et les cinq grandes banques (RBC, TD, Scotiabank, BMO, CIBC) gèrent la grande majorité du trafic SWIFT.",
    bullets: [
      "Les numéros de transit et d'institution canadiens sont réservés à un usage national. Lors d'un envoi international vers le Canada, vous avez besoin du code SWIFT/BIC de la banque du bénéficiaire. La plupart des banques canadiennes acheminent tous les virements SWIFT entrants via un centre de traitement central, de sorte que le numéro de transit de l'agence est fourni séparément dans les coordonnées du bénéficiaire.",
      "Chacune des cinq grandes banques canadiennes dispose d'un code SWIFT principal pour les virements internationaux, mais elles peuvent également avoir des codes secondaires pour des divisions spécifiques (telles que la gestion de patrimoine ou la banque commerciale). Confirmez avec le bénéficiaire le code SWIFT requis par son type de compte spécifique.",
      "Pour les virements entrants libellés en CAD, la banque canadienne réceptrice créditera le compte en CAD. Si vous envoyez dans une devise étrangère comme USD ou EUR, la banque convertira à son taux affiché, qui comprend généralement une majoration de 1 à 3 % par rapport au taux interbancaire. Envoyer en CAD de votre côté se traduit souvent par un coût total plus avantageux.",
    ],
  },
  australia: {
    title: "Comment fonctionne SWIFT en Australie",
    intro:
      "L'Australie utilise les codes BSB (Bank-State-Branch) pour les virements nationaux, mais ces codes à six chiffres ne sont pas reconnus à l'international. Les virements internationaux entrants nécessitent le code SWIFT/BIC de la banque réceptrice. Les quatre grandes banques australiennes — Commonwealth Bank, Westpac, ANZ et NAB — traitent la majorité des paiements SWIFT entrants, et chacune dispose d'une passerelle SWIFT centrale pour les virements internationaux.",
    bullets: [
      "Le BSB et le numéro de compte du bénéficiaire sont nécessaires aux côtés du code SWIFT pour les virements internationaux entrants vers l'Australie. Le code SWIFT achemine le paiement vers la bonne banque, tandis que le BSB et le numéro de compte garantissent qu'il atteint la bonne agence et le bon compte. Les deux sont requis — fournir uniquement le code SWIFT est insuffisant.",
      "PayID et NPP (New Payments Platform) sont des systèmes exclusivement nationaux et ne peuvent pas recevoir de virements SWIFT internationaux. Si le bénéficiaire ne fournit qu'un PayID (numéro de téléphone ou adresse e-mail), vous aurez quand même besoin de son BSB, de son numéro de compte et du code SWIFT bancaire pour un virement international.",
      "Les banques australiennes facturent généralement des frais de paiement international entrant de AUD 10 à 20 pour les virements SWIFT. Certaines banques les dispensent pour les titulaires de comptes premium ou internationaux. Si vous envoyez dans une devise autre que l'AUD, le taux de conversion de la banque réceptrice s'appliquera, ce qui est généralement moins avantageux que la conversion du côté de l'expéditeur.",
    ],
  },
  singapore: {
    title: "Comment fonctionne SWIFT à Singapour",
    intro:
      "Singapour est l'un des centres financiers les plus importants d'Asie, et ses banques sont profondément intégrées au réseau SWIFT. DBS, OCBC et UOB sont les trois principales banques locales, toutes dotées d'une connectivité SWIFT étendue pour de multiples devises. La Monetary Authority of Singapore (MAS) maintient un environnement bancaire bien réglementé, et les virements internationaux entrants se règlent généralement rapidement et de manière fiable.",
    bullets: [
      "DBS, OCBC et UOB disposent chacune de codes SWIFT principaux pour les virements internationaux, mais peuvent utiliser des codes différents pour des divisions spécifiques telles que la banque privée ou les comptes d'entreprise. Le bénéficiaire doit fournir le code SWIFT exact associé à son type de compte plutôt qu'un code générique trouvé en ligne.",
      "Les comptes bancaires à Singapour prennent fréquemment en charge plusieurs devises (SGD, USD, EUR, GBP et autres) au sein d'une même structure de compte. Lors d'un envoi vers Singapour, confirmez avec le bénéficiaire dans quelle devise son compte doit recevoir les fonds — envoyer dans la mauvaise devise peut déclencher une conversion automatique au taux moins favorable de la banque.",
      "Les réglementations de la MAS exigent que les banques de Singapour effectuent une diligence raisonnable renforcée sur certains virements entrants. Les paiements dépassant des seuils spécifiques ou provenant de certaines juridictions peuvent être retenus pour examen de conformité, ce qui peut ajouter un à deux jours ouvrables au délai de règlement. Fournir une référence de paiement claire et l'objet du paiement aide à éviter les retards.",
    ],
  },
  "south-africa": {
    title: "Comment fonctionne SWIFT en Afrique du Sud",
    intro:
      "Le système bancaire d'Afrique du Sud est réglementé par la South African Reserve Bank (SARB), qui impose des contrôles des changes sur les paiements transfrontaliers entrants et sortants. Les quatre grandes banques — Standard Bank, FirstRand (FNB), Absa et Nedbank — gèrent la majeure partie du trafic SWIFT international. Tous les virements en devises étrangères entrants sont soumis aux exigences de déclaration du SARB, et le bénéficiaire peut devoir fournir des pièces justificatives avant que les fonds ne soient libérés.",
    bullets: [
      "Les contrôles des changes du SARB exigent que l'objet de chaque paiement international entrant soit déclaré. La banque du bénéficiaire demandera des documents tels qu'une facture, un contrat de travail ou une déclaration de don avant de créditer des devises étrangères sur un compte en ZAR. Les retards dans la fourniture de ces documents bloqueront les fonds.",
      "Les banques sud-africaines convertissent les devises étrangères entrantes en ZAR à leur propre taux de change, qui comprend généralement un écart par rapport au taux du marché. Pour les virements importants, le bénéficiaire peut parfois négocier un meilleur taux auprès du bureau des changes de sa banque, en particulier à Standard Bank ou FNB qui disposent de services de trésorerie dédiés.",
      "Chacune des quatre grandes banques dispose d'un code SWIFT principal, mais les codes au niveau des agences sont moins couramment utilisés. La plupart des virements internationaux sont acheminés via la passerelle SWIFT du siège de la banque à Johannesburg. Fournissez le code d'agence du bénéficiaire et le numéro de compte comme informations complémentaires aux côtés du code SWIFT principal.",
    ],
  },
  ireland: {
    title: "Comment fonctionne SWIFT en Irlande",
    intro:
      "L'Irlande est membre de la SEPA, de sorte que les virements en EUR provenant d'autres pays SEPA peuvent être envoyés en utilisant uniquement l'IBAN irlandais sans code SWIFT. Les codes SWIFT/BIC sont principalement nécessaires lorsque l'expéditeur est situé hors de la SEPA ou lorsque le paiement est dans une devise autre que l'EUR. Les principales banques de détail en Irlande — AIB, Bank of Ireland et Permanent TSB — participent toutes au réseau SWIFT pour les paiements internationaux.",
    bullets: [
      "Pour les virements en EUR depuis la zone SEPA, l'IBAN irlandais du bénéficiaire (commençant par IE) est suffisant. Les virements SEPA sont généralement gratuits ou très peu coûteux et se règlent en un jour ouvrable. Il n'est pas nécessaire de fournir un code SWIFT/BIC pour ces paiements.",
      "Si vous envoyez depuis l'extérieur de la SEPA (comme les États-Unis, le Canada ou l'Australie) ou dans une devise autre que l'EUR, vous aurez besoin du code SWIFT de la banque réceptrice. AIB, Bank of Ireland et PTSB ont chacune leurs propres codes BIC, et utiliser le mauvais entraînera des retards ou des paiements échoués.",
      "Le paysage bancaire irlandais s'est consolidé ces dernières années, avec la sortie du marché d'Ulster Bank et KBC. Les bénéficiaires qui détenaient auparavant des comptes dans ces banques ont migré vers AIB, Bank of Ireland ou PTSB. Assurez-vous que le bénéficiaire fournit ses coordonnées bancaires actuelles, car les anciens codes SWIFT de banques fermées ne fonctionneront plus.",
    ],
  },
  "new-zealand": {
    title: "Comment fonctionne SWIFT en Nouvelle-Zélande",
    intro:
      "Le système bancaire national de la Nouvelle-Zélande utilise un format numéro-banque-agence-compte-suffixe pour les virements locaux, mais ces identifiants ne sont pas suffisants pour les paiements internationaux. Les virements internationaux entrants nécessitent le code SWIFT/BIC de la banque réceptrice. ANZ, ASB, BNZ, Westpac et Kiwibank sont les principales banques traitant les paiements SWIFT internationaux en Nouvelle-Zélande.",
    bullets: [
      "Contrairement au système BSB australien, la Nouvelle-Zélande utilise un numéro de banque combiné (deux chiffres), un numéro d'agence (quatre chiffres), un numéro de compte (sept chiffres) et un suffixe (deux à trois chiffres). Lors d'un envoi international, vous avez besoin à la fois du code SWIFT et du numéro de compte néo-zélandais complet. Certains expéditeurs omettent par erreur le suffixe, ce qui peut entraîner le rejet du paiement.",
      "Les banques néo-zélandaises facturent généralement des frais de virement international entrant de NZD 10 à 15 par paiement SWIFT. Si le virement arrive dans une devise étrangère, la banque convertira en NZD à son taux affiché, qui comprend généralement une marge de 1 à 2 %. Pour les montants supérieurs à NZD 10 000, le bénéficiaire peut parfois demander un meilleur taux auprès de la salle des marchés de la banque.",
      "Les délais de règlement pour les virements SWIFT entrants vers la Nouvelle-Zélande sont généralement d'un à deux jours ouvrables à compter du moment où les fonds quittent la banque expéditrice. La Nouvelle-Zélande se situe dans un fuseau horaire très en avance sur la plupart des grands centres financiers, ce qui peut créer un délai perçu lorsque le paiement est envoyé tard dans la journée depuis l'Europe ou l'Amérique du Nord.",
    ],
  },
  bangladesh: {
    title: "Comment fonctionne SWIFT au Bangladesh",
    intro:
      "Bangladesh Bank, la banque centrale du pays, réglemente tous les virements internationaux entrants et sortants. SWIFT est le principal canal pour recevoir les remises, qui constituent une composante essentielle de l'économie bangladaise. Les virements nationaux utilisent le Bangladesh Electronic Funds Transfer Network (BEFTN) et le système RTGS, qui sont entièrement séparés du routage SWIFT international.",
    bullets: [
      "Les principales banques bangladaises sur le réseau SWIFT comprennent Sonali Bank (la plus grande banque d'État), Islami Bank Bangladesh, BRAC Bank, Dutch-Bangla Bank et Eastern Bank. Chacune dispose de son propre code BIC — confirmez toujours le bon code auprès de l'agence du bénéficiaire, car certaines banques utilisent des codes SWIFT différents pour le siège social par rapport aux centres régionaux.",
      "Les réglementations de Bangladesh Bank exigent que toutes les remises étrangères entrantes soient déclarées. La banque réceptrice convertira les devises étrangères en BDT au taux de change en vigueur le jour du crédit. Les bénéficiaires ne peuvent pas conserver de devises étrangères dans un compte BDT standard à moins qu'ils ne disposent d'un compte en devises étrangères désigné.",
      "Les remises des Bangladais de l'étranger constituent l'une des plus importantes sources de devises du pays. Bangladesh Bank propose périodiquement des paiements incitatifs (primes en espèces) sur les remises entrantes envoyées via les circuits bancaires officiels, ce qui rend l'utilisation de SWIFT ou des services de transfert liés aux banques plus attrayante que les circuits hawala informels.",
    ],
  },
  philippines: {
    title: "Comment fonctionne SWIFT aux Philippines",
    intro:
      "La Bangko Sentral ng Pilipinas (BSP) réglemente tous les virements internationaux vers et depuis les Philippines. SWIFT est le canal standard pour les virements bancaires internationaux en devises étrangères, tandis que les virements nationaux en pesos utilisent les systèmes InstaPay et PESONet opérés par PhilPaSS. Les Philippines sont l'un des plus grands pays récepteurs de remises au monde, et pratiquement toutes les grandes banques sont connectées au réseau SWIFT.",
    bullets: [
      "Les quatre plus grandes banques réceptrices de virements internationaux sont BDO Unibank (ABORPH2X), Bank of the Philippine Islands (BABORPHMXXX), Metropolitan Bank and Trust Company (MABORPMM) et Land Bank of the Philippines (TLBPPHMM). Ces codes SWIFT acheminent vers le bureau central des opérations internationales de chaque banque, et non vers les agences individuelles.",
      "Les réglementations de la BSP exigent que le nom de l'expéditeur et l'objet du virement soient déclarés pour les virements entrants supérieurs à 10 000 USD. La banque réceptrice peut demander des pièces justificatives avant de créditer les fonds, notamment pour les virements liés aux affaires ou aux investissements. Les remises personnelles inférieures au seuil sont généralement créditées le jour même ou le lendemain.",
      "Le peso philippin (PHP) n'est pas librement convertible. Les devises étrangères entrantes sont automatiquement converties en PHP au taux d'achat de la banque à la date de règlement. Les expéditeurs souhaitant que le bénéficiaire reçoive des USD peuvent demander au bénéficiaire d'ouvrir un compte de dépôt en devises étrangères (FCDU), que la plupart des grandes banques philippines proposent.",
    ],
  },
  nigeria: {
    title: "Comment fonctionne SWIFT au Nigeria",
    intro:
      "La Central Bank of Nigeria (CBN) réglemente tous les paiements transfrontaliers, et SWIFT est l'épine dorsale de la connectivité bancaire internationale du Nigeria. Les virements nationaux en naira utilisent le Nigeria Inter-Bank Settlement System (NIBSS), qui fonctionne indépendamment de SWIFT. La grande diaspora nigériane fait des remises entrantes l'un des corridors les plus actifs en Afrique subsaharienne.",
    bullets: [
      "Les cinq plus grandes banques nigérianes — Access Bank, Guaranty Trust Bank (GTBank), Zenith Bank, First Bank of Nigeria et United Bank for Africa (UBA) — disposent toutes de codes SWIFT et traitent la majorité des virements internationaux entrants. UBA dispose d'une présence particulièrement large dans les réseaux bancaires correspondants africains, ce qui la rend utile pour les virements intra-africains.",
      "Les réglementations de change de la CBN exigent que les virements entrants en USD soient crédités sur un compte domiciliaire (compte en devises étrangères) ou convertis en naira au taux officiel. La détention de USD dans un compte domiciliaire est autorisée pour les particuliers et les entreprises. L'écart entre le taux officiel et le taux du marché parallèle peut être significatif, les bénéficiaires doivent donc confirmer avec leur banque quel taux s'applique.",
      "Les virements SWIFT vers le Nigeria prennent généralement d'un à trois jours ouvrables. Les exigences de conformité de la CBN impliquent que les virements importants peuvent être retenus pour examen, notamment pour les paiements professionnels. Fournir un objet de paiement clair et faire correspondre exactement le nom du bénéficiaire tel qu'il est enregistré auprès de la banque peut prévenir les retards.",
    ],
  },
  mexico: {
    title: "Comment fonctionne SWIFT au Mexique",
    intro:
      "Le Banco de México (Banxico) réglemente les paiements internationaux, et le Mexique utilise un identifiant de compte national unique appelé CLABE (Clave Bancaria Estandarizada), un numéro à 18 chiffres qui encode la banque, la ville et le compte. Pour les virements internationaux entrants, l'expéditeur a besoin du code SWIFT/BIC de la banque du bénéficiaire ainsi que du numéro CLABE. Les virements nationaux fonctionnent via le système de règlement en temps réel SPEI (Sistema de Pagos Electrónicos Interbancarios).",
    bullets: [
      "Les plus grandes banques du Mexique — BBVA México, Banorte, Santander México et Citibanamex — disposent chacune de codes SWIFT qui acheminent les virements entrants vers leurs centres d'opérations internationales. Fournissez toujours la CLABE à 18 chiffres avec le code SWIFT, car les banques mexicaines en ont besoin pour créditer le bon compte. Un numéro de compte standard seul est insuffisant.",
      "Les banques mexicaines sont tenues de respecter les réglementations anti-blanchiment du Mexique et peuvent demander des documents pour les virements entrants importants. Les virements en provenance des États-Unis sont particulièrement courants, et de nombreux corridors États-Unis-Mexique proposent désormais des services de dépôt sur compte bancaire qui contournent le routage SWIFT traditionnel pour des frais moindres et un règlement plus rapide.",
      "Le peso mexicain (MXN) est librement négociable, et les virements entrants en USD sont généralement convertis en MXN au taux de change de la banque le jour du crédit. Certaines banques mexicaines proposent l'option de recevoir et conserver des USD dans un compte libellé en dollars (cuenta en dólares), ce qui peut être utile pour les entreprises effectuant régulièrement des transactions en USD.",
    ],
  },
  china: {
    title: "Comment fonctionne SWIFT en Chine",
    intro:
      "La Banque populaire de Chine (PBOC) réglemente tous les paiements internationaux, et la Chine maintient des contrôles stricts sur les flux transfrontaliers d'argent. SWIFT est utilisé pour les virements bancaires internationaux vers et depuis la Chine, tandis que les virements nationaux utilisent le China National Advanced Payment System (CNAPS) et le CIPS (Cross-Border Interbank Payment System). Les virements en devises étrangères vers la Chine sont soumis aux exigences de déclaration de l'Administration d'État des changes (SAFE).",
    bullets: [
      "Les quatre plus grandes banques étatiques de Chine — Industrial and Commercial Bank of China (ICBC), Bank of China (BOC), China Construction Bank (CCB) et Agricultural Bank of China (ABC) — dominent le trafic SWIFT international. La Bank of China, en particulier, dispose du réseau correspondant international le plus étendu et est couramment utilisée pour les transactions transfrontalières.",
      "Les virements en devises étrangères entrants vers la Chine doivent être accompagnés d'une déclaration d'objet. Les réglementations SAFE plafonnent les conversions individuelles annuelles de devises étrangères en CNY à l'équivalent de 50 000 USD. Les virements dépassant ce montant, ou ceux à des fins professionnelles, nécessitent des documents et peuvent être examinés par l'équipe de conformité de la banque réceptrice.",
      "La Chine gère également le CIPS (Cross-Border Interbank Payment System) comme alternative à SWIFT pour les virements internationaux libellés en CNY. Certaines banques et certains corridors peuvent régler les paiements en CNY via CIPS plus rapidement que via le réseau SWIFT traditionnel. Pour les remises en CNY, demandez à votre prestataire s'il règle via SWIFT ou CIPS, car le coût et la rapidité peuvent différer.",
    ],
  },
  japan: {
    title: "Comment fonctionne SWIFT au Japon",
    intro:
      "La Banque du Japon (BOJ) supervise le système financier, et les virements nationaux japonais utilisent le système Zengin (全銀システム) pour les règlements en yens en temps réel entre les banques japonaises. Pour les virements bancaires internationaux, des codes SWIFT sont requis. Les trois grands groupes bancaires japonais — MUFG, SMBC Group et Mizuho — gèrent la grande majorité des paiements internationaux entrants et sortants.",
    bullets: [
      "Les trois codes SWIFT de méga-banques les plus fréquemment utilisés pour les virements entrants sont MUFG Bank (BOTKJPJT), Sumitomo Mitsui Banking Corporation (SMBCJPJT) et Mizuho Bank (MHCBJPJT). Ces codes acheminent vers le centre des opérations internationales de Tokyo de chaque banque. Les banques régionales telles que Resona, Fukuoka Bank et Shizuoka Bank disposent également de leurs propres codes SWIFT pour les virements internationaux.",
      "Les banques japonaises exigent à la fois un code SWIFT et le code d'agence du bénéficiaire (店番号) ainsi que le numéro de compte pour un virement international. Lors de la fourniture des coordonnées du bénéficiaire, incluez le nom et le numéro de l'agence en plus du numéro de compte, car le réseau Zengin les utilise en interne pour acheminer les fonds vers la bonne agence après l'arrivée du paiement SWIFT.",
      "Les virements internationaux entrants vers le Japon sont généralement convertis en JPY au taux d'achat télégraphique de la banque à la date de règlement. Des banques comme MUFG et SMBC facturent des frais de virement entrant standard d'environ 2 500 à 4 000 JPY. Les prestataires utilisant des réseaux de paiement locaux en JPY peuvent souvent livrer les fonds moins cher qu'un virement SWIFT de banque à banque.",
    ],
  },
  "south-korea": {
    title: "Comment fonctionne SWIFT en Corée du Sud",
    intro:
      "La Banque de Corée (BOK) réglemente la politique monétaire, tandis que la Financial Services Commission (FSC) supervise la conformité bancaire. Les virements nationaux en won coréen utilisent le réseau Korea Financial Telecommunications and Clearings Institute (KFTC). Les virements internationaux nécessitent des codes SWIFT. Les principales banques de Corée du Sud — KB Kookmin, Shinhan, Hana et Woori — disposent toutes d'une connectivité SWIFT étendue pour les remises entrantes.",
    bullets: [
      "Les quatre plus grandes banques commerciales coréennes utilisées pour les virements internationaux entrants sont KB Kookmin Bank, Shinhan Bank, KEB Hana Bank et Woori Bank. Chacune dispose d'un code SWIFT dédié pour les opérations internationales. Industrial Bank of Korea (IBK) et Korea Development Bank (KDB) sont également couramment utilisées pour les paiements liés aux affaires.",
      "Les réglementations financières coréennes exigent que les virements en devises étrangères entrants supérieurs à 10 000 USD soient déclarés au Korea Customs Service (KCS) dans le cadre de la Foreign Exchange Transactions Act. La banque du bénéficiaire gérera la déclaration, mais les virements personnels importants peuvent nécessiter une déclaration d'origine des fonds. Les virements professionnels nécessitent des pièces justificatives telles que des factures ou des contrats.",
      "Le won coréen (KRW) n'est pas librement convertible hors de Corée. Les virements en devises étrangères entrants sont généralement convertis en KRW au taux de change de la banque à la date du crédit. Certaines banques coréennes proposent des comptes en devises étrangères (FCA) permettant aux bénéficiaires de conserver des USD, EUR ou JPY avant de les convertir, ce qui peut être utile si l'on attend un taux de change KRW plus favorable.",
    ],
  },
  thailand: {
    title: "Comment fonctionne SWIFT en Thaïlande",
    intro:
      "La Banque de Thaïlande (BOT) réglemente les paiements internationaux et les changes. Les virements nationaux en baht utilisent le système PromptPay — un réseau de paiement en temps réel lié aux numéros d'identification nationaux et aux numéros de téléphone — mais PromptPay ne peut pas recevoir de paiements SWIFT internationaux. Pour les virements internationaux entrants, les principales banques de Thaïlande exigent que l'expéditeur fournisse un code SWIFT/BIC ainsi que le numéro de compte bancaire thaïlandais du bénéficiaire.",
    bullets: [
      "Les quatre plus grandes banques de Thaïlande par volume SWIFT sont Bangkok Bank (BKKBTHBK), Kasikornbank (KASITHBK), Siam Commercial Bank (SICOTHBK) et Bank of Ayudhya/Krungsri (AYUDTHBK). Bangkok Bank dispose du plus large réseau correspondant et est particulièrement populaire pour les virements entrants en USD en provenance des États-Unis.",
      "Les réglementations de la Banque de Thaïlande exigent que les virements étrangers entrants supérieurs à l'équivalent de 50 000 THB soient déclarés via le Foreign Exchange Transaction Form (FET). La banque du bénéficiaire gère cette déclaration, mais l'expéditeur doit fournir une référence d'objet de paiement claire pour éviter les retards de conformité. Le traitement médical, l'éducation, le tourisme et la remise familiale sont des objets acceptés courants.",
      "Le baht thaïlandais (THB) est modérément convertible. Les USD, EUR et autres grandes devises entrants sont convertis en THB au taux d'achat de la banque réceptrice. Les banques thaïlandaises facturent généralement des frais de transaction d'environ 200 à 500 THB pour les virements internationaux entrants. Utiliser un prestataire de transfert avec un réseau de paiement local en THB peut se traduire par une livraison plus rapide et un coût total plus faible.",
    ],
  },
  indonesia: {
    title: "Comment fonctionne SWIFT en Indonésie",
    intro:
      "Bank Indonesia (BI) réglemente le système de paiement et les changes. Les virements nationaux en roupie utilisent le système de paiement en temps réel BI-FAST lancé en 2021, qui a largement remplacé l'ancien routage national basé sur RTGS. Pour les virements internationaux entrants, les principales banques indonésiennes sont connectées à SWIFT, et le bénéficiaire doit fournir à la fois le code SWIFT de la banque et son numéro de compte national.",
    bullets: [
      "Les quatre banques étatiques indonésiennes — BCA (CENAIDJA), Bank Mandiri (BMRIIDJA), Bank Rakyat Indonesia (BRINIDJA) et Bank Negara Indonesia (BNINIDJA) — traitent la majorité des virements internationaux entrants. Notez que BCA (Bank Central Asia) est à capitaux privés malgré son nom. Pour les remises aux PME et aux particuliers, CIMB Niaga et Permata Bank sont également couramment utilisées.",
      "Les réglementations de Bank Indonesia exigent la déclaration des virements en devises étrangères supérieurs à l'équivalent de 25 000 USD. Les virements à des fins d'investissement ou professionnelles nécessitent des documents supplémentaires. La banque du bénéficiaire est responsable de la déclaration réglementaire, mais les divergences entre l'objet déclaré et la nature de la transaction peuvent entraîner des retards.",
      "La roupie indonésienne (IDR) est une devise non livrable hors d'Indonésie. Les devises étrangères entrantes sont converties en IDR au taux de la banque réceptrice à la date de règlement. Les banques indonésiennes facturent généralement des frais de virement entrant d'environ 50 000 à 150 000 IDR. Certains prestataires de remises se sont associés à des banques indonésiennes locales pour proposer une livraison directe sur compte à un coût inférieur au routage SWIFT standard.",
    ],
  },
  malaysia: {
    title: "Comment fonctionne SWIFT en Malaisie",
    intro:
      "Bank Negara Malaysia (BNM) réglemente les changes et les paiements internationaux. Les virements nationaux en ringgit utilisent le réseau de paiement en temps réel DuitNow, qui est lié aux numéros MYKAD (carte d'identité nationale) et aux numéros de téléphone pour les virements instantanés. Les virements internationaux entrants nécessitent des codes SWIFT. Le système bancaire malaisien est l'un des plus avancés d'Asie du Sud-Est, les principales banques proposant des comptes multidevises.",
    bullets: [
      "Les trois plus grandes banques de Malaisie par usage SWIFT sont Malayan Banking Berhad (Maybank, MABORYMM), CIMB Bank (CIBBMYKL) et Public Bank Berhad (PBBEMYKL). RHB Bank, Hong Leong Bank et AmBank sont également couramment utilisées pour recevoir des virements internationaux. Les filiales de banque islamique de ces banques disposent de codes SWIFT séparés — par exemple, Maybank Islamic est distincte de la Maybank conventionnelle.",
      "Les règles d'administration des changes du BNM exigent que les résidents déclarent l'objet des virements étrangers entrants supérieurs à 10 000 MYR. La banque réceptrice traite la déclaration, mais le bénéficiaire peut devoir fournir des documents pour les virements liés aux affaires. Les remises personnelles pour l'entretien familial sont généralement simples.",
      "Le ringgit malaisien (MYR) n'est pas librement négociable à l'étranger. Les devises étrangères entrantes sont converties en MYR au taux en vigueur de la banque à la date de règlement. Les expéditeurs de USD ou SGD doivent confirmer avec le bénéficiaire si sa banque peut conserver des devises étrangères, car certains comptes malaisiens peuvent maintenir des soldes multidevises avant la conversion.",
    ],
  },
  brazil: {
    title: "Comment fonctionne SWIFT au Brésil",
    intro:
      "Le Banco Central do Brasil (BCB) réglemente tous les paiements internationaux et les transactions de change. Le Brésil opère le système de paiement instantané Pix pour les virements nationaux — un réseau disponible 24h/24, 7j/7, sans frais, lancé en 2020 — mais Pix ne peut pas recevoir de paiements SWIFT internationaux. Les virements internationaux entrants nécessitent des codes SWIFT et sont soumis aux exigences de déclaration du BCB. Le Brésil dispose de réglementations de change plus strictes que la plupart des pays d'Amérique latine.",
    bullets: [
      "Les principales banques brésiliennes connectées à SWIFT comprennent Banco do Brasil, Itaú Unibanco, Bradesco, Santander Brasil et Caixa Econômica Federal. Itaú et Bradesco disposent des réseaux de banque correspondante les plus étendus à l'international. Pour les paiements professionnels, de nombreuses multinationales utilisent le code SWIFT de la banque principale de leur filiale brésilienne.",
      "Tous les virements en devises étrangères entrants vers le Brésil doivent être contractés via un distributeur autorisé brésilien (une banque ou un courtier en change agréé). La devise étrangère est convertie en BRL au taux commercial, et la banque dépose un rapport réglementaire (Natureza) auprès du BCB. Le code d'objet déclaré doit correspondre à la transaction sous-jacente — les divergences peuvent bloquer les fonds dans l'attente d'une enquête.",
      "Le Brésil prélève l'IOF (Imposto sobre Operações Financeiras), une taxe sur les opérations financières, sur les transactions de change. Le taux IOF pour les remises personnelles entrantes est généralement de 0,38 %, appliqué à la valeur BRL reçue. Les virements professionnels ou les paiements liés à des prêts peuvent être soumis à des taux IOF différents. Cette taxe est déduite par la banque réceptrice avant de créditer le compte.",
    ],
  },
  kenya: {
    title: "Comment fonctionne SWIFT au Kenya",
    intro:
      "La Central Bank of Kenya (CBK) réglemente les activités bancaires et les changes. Le Kenya dispose d'un double écosystème financier : M-Pesa domine les virements mobiles nationaux, tandis que SWIFT sous-tend les virements bancaires internationaux via le secteur bancaire formel. Les principales banques kenyanes, dont KCB, Equity Bank, Co-operative Bank et NCBA, sont toutes connectées à SWIFT. Les virements internationaux entrants sont crédités en KES ou en devises étrangères selon le type de compte.",
    bullets: [
      "Les quatre plus grandes banques du Kenya pour les virements internationaux sont Kenya Commercial Bank (KCB), Equity Bank, Cooperative Bank of Kenya et NCBA (née de la fusion de NIC Bank et Commercial Bank of Africa). Stanbic Kenya (filiale du Standard Bank Group) et Absa Kenya sont couramment utilisées pour les paiements d'entreprise en USD et EUR en raison des réseaux de leurs maisons mères sud-africaines.",
      "Les réglementations de la CBK permettent aux Kenyans de détenir des comptes en devises étrangères (FCA) dans les banques agréées. Les virements entrants en USD, EUR ou GBP peuvent être crédités directement sur un FCA sans conversion obligatoire en KES. C'est avantageux pour les bénéficiaires qui reçoivent régulièrement des paiements étrangers et souhaitent éviter la conversion à des taux défavorables.",
      "M-Pesa ne peut pas recevoir directement des virements SWIFT internationaux, mais des prestataires comme Western Union et WorldRemit peuvent livrer des fonds vers des portefeuilles M-Pesa en utilisant leurs propres réseaux. Pour les virements internationaux de banque à banque, l'expéditeur doit utiliser le code SWIFT de la banque du bénéficiaire. Le règlement intervient généralement dans un délai d'un à deux jours ouvrables.",
    ],
  },
  ghana: {
    title: "Comment fonctionne SWIFT au Ghana",
    intro:
      "La Bank of Ghana (BOG) réglemente les paiements internationaux et le marché des changes. Le Ghana dispose de l'un des systèmes bancaires les plus développés d'Afrique de l'Ouest, avec des banques importantes bien connectées au réseau SWIFT. En parallèle de la banque formelle, la monnaie mobile (notamment MTN MoMo et Vodafone Cash) est largement utilisée au niveau national, mais les plateformes de monnaie mobile ne peuvent pas recevoir directement des virements SWIFT internationaux.",
    bullets: [
      "Les principales banques ghanéennes sur le réseau SWIFT comprennent GCB Bank (anciennement Ghana Commercial Bank), Ecobank Ghana, Stanbic Bank Ghana, Absa Bank Ghana et Standard Chartered Ghana. Ecobank et Stanbic disposent de solides réseaux correspondants panafricains, ce qui les rend bien adaptées aux virements en provenance d'autres pays africains.",
      "Les réglementations de la Bank of Ghana exigent que tous les virements en devises étrangères entrants soient déclarés à des fins de statistiques. Les virements supérieurs à 10 000 USD nécessitent une documentation de l'objet. La banque du bénéficiaire convertit les devises étrangères en GHS au taux de change en vigueur à moins que le bénéficiaire ne détienne un compte en devises étrangères (compte domiciliaire), que la plupart des grandes banques ghanéennes proposent.",
      "Le Ghana opère un marché des changes relativement ouvert par rapport à certains voisins d'Afrique de l'Ouest, mais le GHS a connu une dépréciation significative ces dernières années. Les bénéficiaires attendant des virements importants devraient envisager le moment de la conversion ou conserver les fonds dans un compte domiciliaire libellé en USD dans l'attente d'un taux GHS plus favorable.",
    ],
  },
  "sri-lanka": {
    title: "Comment fonctionne SWIFT au Sri Lanka",
    intro:
      "La Central Bank of Sri Lanka (CBSL) réglemente toutes les transactions de change et les paiements internationaux. SWIFT est le principal canal pour les remises entrantes, qui comptent parmi les sources les plus importantes de recettes en devises du Sri Lanka. Les grandes banques, dont Bank of Ceylon, Commercial Bank of Ceylon, Hatton National Bank et Sampath Bank, sont toutes connectées au réseau SWIFT.",
    bullets: [
      "Les quatre banques sri-lankaises les plus utilisées pour les virements internationaux entrants sont Bank of Ceylon (BCEYLKLX), Commercial Bank of Ceylon (CABORLKLXXX), Hatton National Bank (HABORLKLXXX) et Sampath Bank. Bank of Ceylon est publique et gère une grande part des virements liés au gouvernement, tandis que Commercial Bank dispose du réseau de détail le plus étendu et d'importants volumes de remises de la diaspora.",
      "Les réglementations du CBSL permettent aux résidents sri-lankais de recevoir des virements en devises étrangères sur des Inward Remittance Accounts (IRA) ou des comptes Non-Resident Foreign Currency (NRFC). Les fonds dans les comptes NRFC peuvent être conservés en devises étrangères sans conversion obligatoire en LKR, ce qui est utile pour les expatriés ou les bénéficiaires qui transfèrent régulièrement de l'argent chez eux.",
      "Le Sri Lanka a connu une volatilité économique significative ces dernières années, qui a affecté le taux de change du LKR et entraîné des restrictions périodiques sur les changes. Les expéditeurs doivent utiliser des virements SWIFT via les circuits bancaires officiels plutôt que des réseaux informels, car le CBSL priorise l'allocation des devises aux remises entrantes officiellement enregistrées.",
    ],
  },
  nepal: {
    title: "Comment fonctionne SWIFT au Népal",
    intro:
      "Nepal Rastra Bank (NRB), la banque centrale, réglemente toutes les activités bancaires internationales et de change. Les remises des travailleurs népalais à l'étranger sont la plus grande source de devises du pays, ce qui rend les virements SWIFT entrants d'une importance capitale pour l'économie. Les principales banques, dont Nabil Bank, Standard Chartered Nepal, Nepal Investment Bank et Himalayan Bank, sont connectées au réseau SWIFT. Les virements nationaux utilisent le système ConnectIPS.",
    bullets: [
      "Les banques népalaises connectées à SWIFT comprennent Nabil Bank, Standard Chartered Nepal, Nepal Investment Bank, Himalayan Bank, Everest Bank et NMB Bank. Standard Chartered Nepal est fréquemment utilisée comme centre correspondant pour les virements en USD grâce à son réseau mondial. Nabil Bank (anciennement Nepal Arab Bank) dispose de l'une des relations correspondantes internationales les plus solides pour les remises personnelles.",
      "Les réglementations du NRB exigent que tous les virements en devises étrangères entrants soient encaissés en roupies népalaises (NPR) dans les trois mois suivant leur réception, à moins qu'ils ne soient détenus dans un Foreign Currency Account (FCA). Les FCA sont autorisés pour les Népalais non-résidents (NRN) et les résidents qui reçoivent régulièrement des virements étrangers. Le taux d'encaissement est fixé par la banque réceptrice sur la base du taux de référence quotidien du NRB.",
      "Le marché des changes du Népal est étroitement géré par le NRB. Le NPR est indexé sur la roupie indienne (INR) à un taux fixe, ce qui affecte à son tour la conversion USD/NPR. Les expéditeurs doivent utiliser des opérateurs de transfert d'argent agréés ou des virements SWIFT de banque à banque plutôt que des circuits informels, car le NRB surveille les flux de remises et les transferts non officiels peuvent créer des problèmes lors de l'accès aux fonds.",
    ],
  },
  turkiye: {
    title: "Comment fonctionne SWIFT en Türkiye",
    intro:
      "La Banque centrale de la République de Türkiye (CBRT) supervise la politique monétaire et les changes, tandis que l'Agence de réglementation et de supervision bancaire (BDDK) réglemente le secteur bancaire. Le système de paiement national de Türkiye utilise le réseau EFT (Electronic Fund Transfer) pour les virements en TRY et FAST pour les paiements en temps réel, tous deux séparés de SWIFT. Les grandes banques turques — Garanti BBVA, İş Bankası, Akbank et Yapı Kredi — sont bien connectées à l'international via SWIFT.",
    bullets: [
      "Les quatre plus grandes banques privées turques pour les transactions SWIFT sont Garanti BBVA (TGBATRIS), Türkiye İş Bankası (ISBKTRIS), Akbank (AKBKTRIS) et Yapı Kredi (YAPITRIS). Les banques publiques Ziraat Bankası et Halkbank traitent également des volumes SWIFT significatifs et sont couramment utilisées par les expatriés turcs pour envoyer de l'argent au pays.",
      "La Türkiye a connu une inflation élevée et une dépréciation du TRY ces dernières années, ce qui rend le choix de la devise de règlement important. Les expéditeurs peuvent libeller le virement en USD ou EUR, que le bénéficiaire peut conserver dans un compte en devises étrangères (döviz hesabı) dans la plupart des banques turques. Convertir de grandes sommes au taux TRY de la banque en une seule journée peut être coûteux — envisagez d'échelonner les conversions ou d'utiliser le service de compte döviz d'une banque.",
      "Les réglementations financières de Türkiye exigent que les virements en devises étrangères entrants supérieurs à 50 000 USD soient déclarés par la banque réceptrice à la CBRT pour les statistiques de la balance des paiements. Les virements professionnels nécessitent une déclaration d'objet et peuvent nécessiter des pièces justificatives. Les remises personnelles sont généralement traitées sans exigences supplémentaires.",
    ],
  },
  egypt: {
    title: "Comment fonctionne SWIFT en Égypte",
    intro:
      "La Banque centrale d'Égypte (CBE) réglemente les changes et les paiements internationaux. L'Égypte opère un système ACH (Automated Clearing House) pour les virements nationaux en EGP, tandis que les virements internationaux utilisent SWIFT. Les remises des Égyptiens travaillant à l'étranger sont l'une des sources les plus importantes de devises du pays. La National Bank of Egypt, Banque Misr et la Commercial International Bank (CIB) sont les acteurs dominants dans le traitement des virements bancaires internationaux.",
    bullets: [
      "Les trois banques d'Égypte les plus utilisées pour les virements SWIFT entrants sont la National Bank of Egypt (NBEGEGCX), Banque Misr (BMISEGCX) et Commercial International Bank (CIBOREG1XXX). La National Bank of Egypt et Banque Misr sont toutes deux publiques et gèrent l'essentiel des remises de la diaspora. CIB est la plus grande banque du secteur privé et est largement utilisée pour les paiements internationaux professionnels et d'entreprise.",
      "Les réglementations de la CBE exigent que les devises étrangères entrantes soient converties en EGP au taux déclaré de la banque à moins que le bénéficiaire ne détienne un compte en devises étrangères. L'Égypte a historiquement maintenu plusieurs mécanismes de taux de change, et l'écart entre le taux officiel et celui du marché parallèle a varié considérablement. Utiliser les circuits bancaires officiels garantit que les virements sont reçus au taux publié par la CBE et que le bénéficiaire évite les complications liées aux réglementations de change.",
      "L'Égypte n'impose pas de retenue à la source sur les remises entrantes, et les virements personnels des expatriés égyptiens sont encouragés par la politique de la CBE. Cependant, les virements professionnels importants peuvent nécessiter des documents tels que des factures commerciales, des licences d'importation ou des contrats avant que la banque réceptrice ne libère les fonds. S'assurer que les références de paiement correspondent à l'objet déclaré permet d'éviter les retards de conformité.",
    ],
  },
  morocco: {
    title: "Comment fonctionne SWIFT au Maroc",
    intro:
      "Bank Al-Maghrib, la banque centrale, réglemente les changes et les paiements internationaux au Maroc. Les remises des Marocains résidant à l'étranger (MRE) sont la deuxième source de devises du pays après le tourisme. Les grandes banques Attijariwafa Bank, BMCE Bank of Africa et Banque Populaire du Maroc sont connectées à SWIFT et gèrent la majorité des virements internationaux entrants.",
    bullets: [
      "Les trois plus grandes banques marocaines par volumes SWIFT entrants sont Attijariwafa Bank (BCMAMAMC), BMCE Bank of Africa (BMCEMAMC) et Banque Centrale Populaire / Banque Populaire (BCPOMAMC). Attijariwafa Bank dispose du réseau correspondant le plus étendu en Europe, notamment en France, en Espagne, en Belgique et en Italie, reflétant la distribution géographique de la diaspora marocaine.",
      "Bank Al-Maghrib permet aux bénéficiaires de virements en devises étrangères entrants de convertir en dirhams marocains (MAD) au taux de change de la banque. Le MAD n'est pas librement convertible hors du Maroc, de sorte que les fonds reçus à l'international doivent être gérés via le système bancaire formel. Les Marocains non-résidents (MRE) peuvent ouvrir des comptes CEN/CNE spécifiques (Comptes en Devises) pour recevoir et conserver des devises étrangères avant de les convertir.",
      "Le Maroc a progressivement libéralisé ses réglementations de change ces dernières années, permettant aux résidents de détenir des montants limités de devises étrangères sur des comptes bancaires. Les virements professionnels nécessitent une documentation correspondant à l'objet commercial. Les remises personnelles de la diaspora marocaine sont activement encouragées par le gouvernement et bénéficient d'un traitement simplifié dans les grandes banques.",
    ],
  },
  colombia: {
    title: "Comment fonctionne SWIFT en Colombie",
    intro:
      "Le Banco de la República (Banrep) réglemente la politique monétaire et les changes, tandis que la Superintendencia Financiera de Colombia supervise les activités bancaires. La Colombie utilise ACH Colombia pour les virements nationaux en COP, qui fonctionne indépendamment de SWIFT. Les virements bancaires internationaux entrants nécessitent des codes SWIFT, et le régulateur bancaire colombien exige que toutes les devises étrangères entrantes soient enregistrées via le système bancaire formel.",
    bullets: [
      "Les trois plus grandes banques de Colombie pour les virements internationaux basés sur SWIFT sont Bancolombia (COABORBB), Banco de Bogotá (BBOGCOBB) et Davivienda (DAVICOBB). Bancolombia est la plus grande banque du pays et dispose des capacités de virement international les plus développées, avec notamment une forte connectivité avec les États-Unis. BBVA Colombia et Scotiabank Colpatria gèrent également des volumes transfrontaliers significatifs.",
      "Les réglementations de change colombiennes exigent que tous les virements internationaux entrants transitent par un intermédiaire financier agréé (une banque ou un courtier autorisé). La banque du bénéficiaire enregistre le virement auprès de la Banrep sous un code de raison spécifique. Pour les montants supérieurs à 10 000 USD, des formulaires de déclaration supplémentaires peuvent être nécessaires. L'objet déclaré doit correspondre à la nature réelle de la transaction pour éviter des complications réglementaires.",
      "Le peso colombien (COP) est librement convertible. Les virements entrants en USD ou EUR sont convertis en COP au taux du marché de la banque le jour du crédit. La Colombie n'impose pas de retenue à la source sur les remises personnelles. Pour les paiements professionnels, une documentation de facturation doit être fournie. L'expéditeur est conseillé de conserver les reçus de virement, car la Colombie peut demander des preuves de paiements sortants à des fins statistiques.",
    ],
  },
  peru: {
    title: "Comment fonctionne SWIFT au Pérou",
    intro:
      "Le Banco Central de Reserva del Perú (BCRP) gère la politique monétaire et les réserves de change. Le régulateur bancaire péruvien, la SBS (Superintendencia de Banca, Seguros y AFP), supervise toutes les banques agréées. Les virements nationaux en PEN utilisent le système de compensation CCE (Cámara de Compensación Electrónica). Pour les virements internationaux entrants, les principales banques péruviennes sont bien connectées à SWIFT, et le système de change relativement ouvert du Pérou rend la réception de virements internationaux simple.",
    bullets: [
      "Les quatre principales banques péruviennes connectées à SWIFT sont Banco de Crédito del Perú (BCP, BCPLPEPL), BBVA Perú (BABORPPL), Interbank (BINPPEPL) et Scotiabank Perú. BCP est la plus grande banque péruvienne par actifs et traite le plus grand volume de virements internationaux entrants. Interbank dispose de solides capacités de banque numérique et est populaire auprès des clients particuliers qui reçoivent des remises.",
      "Le Pérou permet aux particuliers de détenir des comptes en USD dans les banques locales, et les virements entrants en USD peuvent être crédités directement sur un compte en dollars (cuenta en dólares) sans conversion obligatoire en PEN. Il s'agit d'un avantage significatif pour les bénéficiaires qui souhaitent éviter la conversion au taux de change de la banque ou qui doivent effectuer des paiements en USD depuis leur compte.",
      "Les réglementations de la SBS exigent que les virements entrants supérieurs à 10 000 USD s'accompagnent d'une déclaration d'origine des fonds. La banque réceptrice gère le dépôt réglementaire, mais l'objet du virement doit être clairement indiqué dans la référence de paiement. Le Pérou n'impose pas de retenue à la source sur les remises personnelles. Les virements professionnels nécessitent une documentation de facturation, notamment pour les importations ou les paiements de services.",
    ],
  },
  },
  faqs: {
  "united-kingdom": [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Royaume-Uni ?",
      a: "Un code SWIFT (également appelé BIC) est un identifiant de 8 ou 11 caractères utilisé par les banques britanniques pour les virements internationaux. La partie code pays est GB. Par exemple, BARCGB22 est le code SWIFT de Barclays. La structure est : 4 caractères pour la banque, 2 pour le pays (GB), 2 pour la ville ou l'emplacement, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques britanniques ?",
      a: "Les principaux codes SWIFT des banques britanniques comprennent : Barclays — BARCGB22, HSBC — HBUKGB4B, Lloyds Bank — LOYDGB2L, NatWest — NWBKGB2L, Santander UK — ABBYGB2L, Standard Chartered — SCBLGB2L, et Nationwide — NAIAGB21. Confirmez toujours le code exact auprès de la banque du bénéficiaire, car certaines banques utilisent des codes différents pour des divisions spécifiques.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque au Royaume-Uni ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque britannique sur votre relevé bancaire, dans votre application bancaire en ligne ou mobile, en contactant votre agence, ou en effectuant une recherche sur cette page. La plupart des banques britanniques affichent également les codes SWIFT sur leurs pages d'aide aux paiements internationaux. Vérifiez toujours le code auprès de votre banque avant de le communiquer à un expéditeur étranger.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou d'un sort code pour les virements internationaux vers le Royaume-Uni ?",
      a: "Pour les virements internationaux depuis l'extérieur du Royaume-Uni, l'expéditeur a besoin du code SWIFT/BIC de la banque ainsi que du numéro de compte (et souvent du sort code également). Les sort codes sont utilisés uniquement pour les virements domestiques britanniques via Faster Payments, Bacs et CHAPS, mais ne sont pas reconnus par le réseau SWIFT international. Fournissez à la fois le code SWIFT, le sort code et le numéro de compte pour éviter les retards.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Royaume-Uni ?",
      a: "Les virements SWIFT vers le Royaume-Uni arrivent généralement en un à trois jours ouvrables. Les virements en provenance d'Europe et d'Amérique du Nord se règlent souvent en un à deux jours ouvrables dans les grandes banques comme Barclays, HSBC et Lloyds. La position de Londres en tant que centre financier mondial signifie que la plupart des banques britanniques entretiennent de solides relations de correspondance, ce qui contribue à accélérer le règlement.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Royaume-Uni ?",
      a: "Les banques britanniques peuvent facturer des frais de paiement international entrant, généralement de 5 à 15 GBP, bien que certains comptes (notamment les comptes premium ou internationaux) en soient exemptés. Si le virement arrive dans une devise autre que la GBP, la banque le convertira à son propre taux de change, qui inclut généralement une marge par rapport au taux médian du marché. Confirmez les frais de virement entrant de votre banque avant l'envoi du virement.",
    },
    {
      q: "Quelle est la différence entre Faster Payments, CHAPS et SWIFT au Royaume-Uni ?",
      a: "Faster Payments et CHAPS sont des systèmes de paiement domestiques britanniques — Faster Payments gère les virements en temps réel jusqu'à 1 million de GBP en utilisant des sort codes et des numéros de compte, tandis que CHAPS gère les virements en GBP de grande valeur le jour même. Aucun des deux ne peut recevoir de paiements internationaux. SWIFT est le réseau international pour les virements transfrontaliers. Lorsqu'un paiement SWIFT arrive dans une banque britannique, celle-ci crédite le compte du bénéficiaire via ses systèmes internes.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur mon compte bancaire britannique ?",
      a: "La plupart des comptes courants standards britanniques sont libellés en GBP, et les virements entrants en devises étrangères sont automatiquement convertis en livres sterling. Cependant, certaines banques et fournisseurs fintech (tels que HSBC, Barclays, Wise et Revolut) proposent des comptes multidevises pouvant détenir des USD, EUR et autres devises. Si vous recevez régulièrement des devises étrangères, un compte multidevises évite la conversion automatique au taux moins avantageux de la banque.",
    },
  ],

  netherlands: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour les Pays-Bas ?",
      a: "Un code SWIFT (également appelé BIC) est un identifiant de 8 ou 11 caractères utilisé par les banques néerlandaises pour les virements internationaux. La partie code pays est NL. Par exemple, ABNANL2A est le code SWIFT d'ABN AMRO. La structure est : 4 caractères pour la banque, 2 pour le pays (NL), 2 pour la ville, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques néerlandaises ?",
      a: "Les principaux codes SWIFT des banques néerlandaises comprennent : ABN AMRO — ABNANL2A, ING — INGBNL2A, Rabobank — RABONL2U, SNS Bank — SNSBNL2A, Triodos Bank — TRIONL2U, et de Volksbank — SNSBNL2A. Confirmez toujours le code exact auprès de la banque du bénéficiaire avant d'envoyer.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou simplement d'un IBAN pour les virements vers les Pays-Bas ?",
      a: "Si vous envoyez des EUR depuis la zone SEPA (UE, EEE et certains autres pays), l'IBAN néerlandais (commençant par NL) est généralement suffisant et le paiement transite par le Virement SEPA — aucun code SWIFT n'est nécessaire. Si vous envoyez depuis l'extérieur de la zone SEPA ou dans une devise autre que l'EUR, vous aurez besoin du code SWIFT/BIC de la banque en plus de l'IBAN.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque néerlandaise ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque néerlandaise sur votre relevé bancaire, dans votre application de banque en ligne, en contactant votre banque, ou en effectuant une recherche sur cette page. Les IBAN néerlandais contiennent l'identifiant bancaire dans les huit premiers caractères, mais ce n'est pas la même chose que le code BIC/SWIFT complet. Vérifiez toujours directement auprès de votre banque.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers les Pays-Bas ?",
      a: "Les virements SEPA en EUR depuis l'Europe arrivent généralement en un jour ouvrable. Les virements SWIFT depuis l'extérieur de la zone SEPA (comme des États-Unis, du Canada ou d'Australie) prennent généralement un à trois jours ouvrables. Les virements en devises autres que l'EUR peuvent prendre légèrement plus longtemps en raison du routage par les banques correspondantes et de la conversion de devises à la banque réceptrice.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT aux Pays-Bas ?",
      a: "Les virements SEPA en EUR sont généralement gratuits ou très peu coûteux. Les virements SWIFT hors SEPA peuvent entraîner des frais de virement entrant dans les banques néerlandaises, généralement de 5 à 15 EUR. Si le virement arrive dans une devise autre que l'EUR, la banque le convertira à son propre taux de change, incluant une marge. Certaines banques néerlandaises dispensent de frais entrants les comptes premium ou professionnels.",
    },
    {
      q: "Qu'est-ce que SEPA et quel est son lien avec SWIFT aux Pays-Bas ?",
      a: "SEPA (Espace unique de paiement en euros) est un système de paiement européen permettant les virements en EUR entre pays participants en utilisant uniquement l'IBAN. Les virements SEPA n'utilisent pas SWIFT — ils transitent par un réseau de compensation européen distinct et sont généralement plus rapides et moins coûteux. SWIFT n'est nécessaire que lorsque le paiement provient de l'extérieur de la zone SEPA ou est libellé dans une devise autre que l'EUR.",
    },
    {
      q: "Puis-je recevoir des devises autres que l'EUR directement sur un compte bancaire néerlandais ?",
      a: "Certaines banques néerlandaises (notamment ABN AMRO, ING et Rabobank) proposent des comptes multidevises pouvant détenir des USD, GBP et autres devises. Si vous détenez un compte EUR standard, tout virement entrant dans une devise autre que l'EUR sera automatiquement converti en euros au taux de change de la banque. Pour les réceptions régulières de devises étrangères, un compte multidevises évite cette conversion automatique.",
    },
  ],

  "hong-kong": [
    {
      q: "Qu'est-ce qu'un code SWIFT pour Hong Kong ?",
      a: "Un code SWIFT (BIC) pour Hong Kong est un identifiant de 8 ou 11 caractères utilisé par les banques hongkongaises pour les virements internationaux. La partie code pays est HK. Par exemple, HSBCHKHH est le code SWIFT de HSBC Hong Kong. La structure est : 4 caractères pour la banque, 2 pour le pays (HK), 2 pour la ville, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques de Hong Kong ?",
      a: "Les principaux codes SWIFT des banques de Hong Kong comprennent : HSBC Hong Kong — HSBCHKHH, Hang Seng Bank — HASEHKHH, Bank of China Hong Kong — BKCHHKHH, Standard Chartered Hong Kong — SCBLHKHH, Citibank Hong Kong — CITIHKHX, DBS Hong Kong — DHBKHKHH, et Bank of East Asia — BEASHKHH. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque à Hong Kong ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque hongkongaise sur votre relevé bancaire, dans votre application de banque Internet ou mobile, ou en contactant votre agence. La plupart des grandes banques de Hong Kong affichent les codes SWIFT dans leurs portails bancaires en ligne, dans la section virements internationaux ou détails du compte. Vous pouvez également effectuer une recherche sur cette page.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou d'un identifiant FPS pour les virements internationaux vers Hong Kong ?",
      a: "FPS (Faster Payment System) est le réseau de paiement domestique en temps réel de Hong Kong et ne peut pas recevoir de virements SWIFT internationaux. Pour les virements internationaux depuis l'extérieur de Hong Kong, l'expéditeur a besoin du code SWIFT/BIC de la banque bénéficiaire ainsi que du numéro de compte bancaire complet. FPS est uniquement utilisé pour les virements locaux en HKD et CNY au sein de Hong Kong.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers Hong Kong ?",
      a: "Les virements SWIFT vers Hong Kong arrivent généralement en un à deux jours ouvrables. En tant que grande place financière internationale, les banques de Hong Kong entretiennent de nombreuses relations de correspondance qui facilitent un règlement rapide. Les virements en provenance des États-Unis, du Royaume-Uni et d'Europe arrivent généralement en un jour ouvrable pour les principales devises comme l'USD, la GBP et l'EUR.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT à Hong Kong ?",
      a: "Les banques de Hong Kong facturent généralement des frais de virement télégraphique (TT) entrant, souvent de 50 à 200 HKD par transaction. Si le virement arrive dans une devise autre que la devise du compte, la banque appliquera son propre taux de change pour la conversion. HSBC, Hang Seng et Standard Chartered peuvent dispenser de frais entrants les clients en banque premium.",
    },
    {
      q: "Puis-je recevoir plusieurs devises sur mon compte bancaire à Hong Kong ?",
      a: "Oui. Les banques de Hong Kong proposent couramment des comptes multidevises pouvant détenir des HKD, USD, EUR, GBP, CNY et autres devises. C'est un avantage majeur du système bancaire de Hong Kong — vous pouvez recevoir des virements internationaux dans la devise d'origine sans conversion automatique. Confirmez avec l'expéditeur dans quelle devise vous préférez recevoir.",
    },
    {
      q: "Quelle est la différence entre envoyer des USD et des HKD à Hong Kong ?",
      a: "Le HKD est arrimé à l'USD à environ 7,75–7,85, de sorte que la conversion entre les deux est prévisible. Envoyer en USD sur un compte multidevises évite toute conversion. Si le bénéficiaire ne dispose que d'un compte en HKD, les deux devises donneront des résultats similaires grâce à l'arrimage. Pour d'autres devises comme l'EUR ou la GBP, le taux de conversion et les frais de la banque peuvent différer selon la devise envoyée.",
    },
  ],

  "united-states": [
    {
      q: "Qu'est-ce qu'un code SWIFT pour les États-Unis ?",
      a: "Un code SWIFT (BIC) pour les États-Unis est un identifiant de 8 ou 11 caractères utilisé par les banques américaines pour les virements internationaux. La partie code pays est US. Par exemple, CHASUS33 est le code SWIFT de JPMorgan Chase. La structure est : 4 caractères pour la banque, 2 pour le pays (US), 2 pour la ville, et optionnellement 3 pour l'agence ou la division.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques américaines ?",
      a: "Les principaux codes SWIFT des banques américaines comprennent : JPMorgan Chase — CHASUS33, Bank of America — BOFAUS3N, Citibank — CITIUS33, Wells Fargo — WFBIUS6S, US Bank — USBKUS44, PNC Bank — PNCCUS33, et Capital One — HIBKUS3N. Confirmez toujours le code exact auprès de la banque du bénéficiaire, car certaines banques utilisent des codes SWIFT différents pour des divisions spécifiques.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque aux États-Unis ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque américaine sur votre relevé bancaire, dans votre application de banque en ligne ou mobile, en appelant le service des virements internationaux de la banque, ou en effectuant une recherche sur cette page. Notez que le code SWIFT est différent du numéro d'acheminement ABA — le numéro d'acheminement est uniquement pour les virements domestiques.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou d'un numéro d'acheminement ABA pour les virements internationaux vers les États-Unis ?",
      a: "Pour les virements internationaux depuis l'extérieur des États-Unis, l'expéditeur a besoin du code SWIFT/BIC de la banque bénéficiaire ainsi que du numéro de compte. Le numéro d'acheminement ABA à neuf chiffres est utilisé uniquement pour les virements domestiques ACH et Fedwire et n'est pas reconnu par le réseau SWIFT. Certaines banques peuvent également demander le numéro d'acheminement ABA à titre d'information complémentaire, mais le code SWIFT est l'identifiant international essentiel.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers les États-Unis ?",
      a: "Les virements SWIFT vers les États-Unis arrivent généralement en un à trois jours ouvrables. Les États-Unis sont le plus grand récepteur mondial de virements internationaux, et les grandes banques comme JPMorgan Chase, Bank of America et Citibank disposent de vastes réseaux de correspondance qui facilitent un règlement rapide. Les virements en provenance d'Europe et d'Asie arrivent généralement en un à deux jours ouvrables.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT aux États-Unis ?",
      a: "Les banques américaines facturent généralement des frais de virement international entrant, généralement de 15 à 25 USD par transaction, même si l'expéditeur a pris en charge tous les frais sortants. Certains comptes premium ou professionnels sont dispensés de ces frais. Si le virement arrive dans une devise autre que l'USD, la banque le convertira à son propre taux de change. Confirmez le barème des frais de virement entrant de votre banque avant l'envoi du virement.",
    },
    {
      q: "Quelle est la différence entre Fedwire, ACH et SWIFT aux États-Unis ?",
      a: "Fedwire est le système de règlement brut en temps réel de la Réserve fédérale pour les virements domestiques en USD. ACH (Automated Clearing House) gère les virements domestiques par lots comme les paies et les paiements de factures. Les deux utilisent des numéros d'acheminement ABA et sont exclusivement domestiques. SWIFT est le réseau international pour les virements transfrontaliers. Lorsqu'un paiement SWIFT arrive dans une banque américaine, celle-ci crédite le compte du bénéficiaire via ses systèmes internes.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur mon compte bancaire américain ?",
      a: "La plupart des comptes chèques et épargne standards américains sont libellés en USD, et les virements entrants en devises étrangères sont automatiquement convertis en dollars. Certaines grandes banques comme Citibank, HSBC US et certaines banques d'investissement proposent des comptes en devises étrangères. Pour la plupart des bénéficiaires, recevoir en USD est le plus simple — l'expéditeur peut convertir en USD de son côté pour potentiellement obtenir un meilleur taux de change.",
    },
  ],

  india: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour l'Inde ?",
      a: "Un code SWIFT (BIC) pour l'Inde est un identifiant de 8 ou 11 caractères utilisé par les banques indiennes pour les virements internationaux. La partie code pays est IN. Par exemple, SBININBB est le code SWIFT de la State Bank of India. La structure est : 4 caractères pour la banque, 2 pour le pays (IN), 2 pour la ville, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques indiennes ?",
      a: "Les principaux codes SWIFT des banques indiennes comprennent : State Bank of India (SBI) — SBININBB, HDFC Bank — HDFCINBB, ICICI Bank — ICICINBB, Axis Bank — AXISINBB, Punjab National Bank — PUNBINBB, Bank of Baroda — BARBINBB, et Kotak Mahindra Bank — ABORINBB. Confirmez toujours le code exact auprès de la banque du bénéficiaire, car les codes SWIFT au niveau de l'agence peuvent différer.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque indienne ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque indienne sur votre relevé bancaire, dans votre application de banque Internet ou mobile, en vous rendant dans votre agence, ou en effectuant une recherche sur cette page. Notez que le code SWIFT est différent du code IFSC — l'IFSC est utilisé pour les virements domestiques (NEFT, RTGS, IMPS), tandis que SWIFT est utilisé pour les virements internationaux.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou d'un code IFSC pour les virements internationaux vers l'Inde ?",
      a: "Pour les virements internationaux depuis l'extérieur de l'Inde, l'expéditeur a besoin du code SWIFT/BIC de la banque bénéficiaire ainsi que du numéro de compte. Le code IFSC (Indian Financial System Code) est utilisé uniquement pour les virements domestiques via NEFT, RTGS et IMPS. Les codes IFSC ne sont pas reconnus par le réseau SWIFT. Certaines banques peuvent demander l'IFSC à titre d'information complémentaire pour identifier l'agence en interne.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers l'Inde ?",
      a: "Les virements SWIFT vers l'Inde arrivent généralement en un à trois jours ouvrables. Les virements en provenance des États-Unis, du Royaume-Uni et du Moyen-Orient — principaux corridors pour les envois de fonds indiens — se règlent généralement en un à deux jours ouvrables. Les exigences de conformité de la RBI, notamment les déclarations d'objet du paiement, peuvent parfois allonger le délai de traitement pour les virements de montant élevé ou à caractère professionnel.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Inde ?",
      a: "Les banques indiennes facturent généralement des frais de traitement des envois de fonds entrants, souvent de 100 à 500 INR par transaction. Les frais des banques intermédiaires sur le trajet SWIFT peuvent également réduire le montant final en INR reçu. La banque réceptrice convertit les devises étrangères en INR au taux d'achat télégraphique, qui inclut une marge par rapport au taux médian du marché. Les prestataires utilisant des corridors de paiement en INR dédiés offrent souvent une livraison plus économique.",
    },
    {
      q: "Quelle est l'exigence de code d'objet de la RBI pour les virements entrants vers l'Inde ?",
      a: "La Reserve Bank of India (RBI) exige un code d'objet du paiement sur chaque envoi de fonds étranger entrant. Les codes courants comprennent P0801 (entretien familial), S0305 (frais de scolarité) et P0107 (achat immobilier). La banque réceptrice attribue le code en fonction de la référence du paiement. Des codes d'objet incorrects ou manquants peuvent retarder le crédit — assurez-vous que l'expéditeur inclut une description claire de l'objet du virement.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur mon compte bancaire indien ?",
      a: "Les comptes d'épargne standards libellés en INR ne peuvent pas détenir de devises étrangères — la réglementation de la RBI impose la conversion en INR au taux en vigueur de la banque. Cependant, les résidents indiens peuvent ouvrir un compte RFC (Resident Foreign Currency) pour détenir des devises étrangères reçues de l'étranger. Les NRI (Indiens non-résidents) peuvent utiliser des comptes NRE ou NRO, qui sont soumis à des règles différentes pour la réception de devises étrangères et le rapatriement des fonds.",
    },
  ],
  germany: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour l'Allemagne ?",
      a: "Un code SWIFT (également appelé BIC) est un identifiant de 8 ou 11 caractères utilisé par les banques allemandes pour les virements internationaux. La partie code pays est DE. Par exemple, DEUTDEFF est le code SWIFT de la Deutsche Bank Francfort. La structure est : 4 caractères pour la banque, 2 pour le pays (DE), 2 pour la ville et, facultativement, 3 pour la succursale.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques allemandes ?",
      a: "Les principaux codes SWIFT des banques allemandes comprennent : Deutsche Bank — DEUTDEFF, Commerzbank — COBADEFF, DZ Bank — GENODEFF, HypoVereinsbank (UniCredit) — HYVEDEMMXXX, N26 — NTSBDEB1 et ING Germany — INGBDEFF. Les Sparkassen et les Volksbanken ont chacune leurs propres codes SWIFT — ne supposez pas qu'un code générique fonctionne pour tous les établissements.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou seulement d'un IBAN pour les virements vers l'Allemagne ?",
      a: "Pour les virements en EUR depuis la zone SEPA, l'IBAN allemand (commençant par DE, 22 caractères) est généralement suffisant — aucun code SWIFT n'est nécessaire. Pour les virements depuis l'extérieur de la zone SEPA ou dans une devise autre que l'EUR, vous aurez besoin du code SWIFT/BIC de la banque en plus de l'IBAN. Les virements SEPA sont généralement plus rapides et moins coûteux que les virements SWIFT.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque allemande ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque allemande sur votre relevé bancaire, dans votre portail de banque en ligne, en contactant votre banque ou en effectuant une recherche sur cette page. Notez que les Sparkassen (caisses d'épargne) et les Volksbanken (banques coopératives) ont chacune leurs propres codes SWIFT distincts — vous ne pouvez pas utiliser un code générique de la Deutsche Bank ou de la Commerzbank pour ces établissements.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers l'Allemagne ?",
      a: "Les virements SEPA en EUR depuis l'Europe arrivent généralement en un jour ouvrable (souvent le jour même avec SEPA Instant). Les virements SWIFT depuis l'extérieur de la zone SEPA prennent généralement un à trois jours ouvrables. Les virements dans des devises autres que l'EUR peuvent prendre un peu plus de temps en raison du routage par les banques correspondantes et de la conversion de devises à la banque réceptrice.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Allemagne ?",
      a: "Les virements SEPA en EUR sont généralement gratuits ou très peu coûteux dans les banques allemandes. Les virements SWIFT hors SEPA peuvent entraîner des frais de réception, généralement entre 5 et 15 EUR. Si le virement arrive dans une devise autre que l'EUR (comme l'USD ou la GBP), la banque convertira à son propre taux de change, qui inclut une marge. Consultez le Preisverzeichnis (grille tarifaire) de votre banque pour plus de détails.",
    },
    {
      q: "Quelle est la différence entre un code SWIFT d'une Sparkasse et celui d'une banque commerciale ?",
      a: "Les Sparkassen (caisses d'épargne) et les Volksbanken (banques coopératives) allemandes sont des établissements indépendants avec leurs propres codes SWIFT, distincts de ceux des banques commerciales comme la Deutsche Bank et la Commerzbank. Il existe des centaines de Sparkassen en Allemagne, chacune avec un BIC unique. Vous devez utiliser le code SWIFT spécifique de la Sparkasse du destinataire — un code SWIFT de la Deutsche Bank ne fonctionnera pas pour un compte Sparkasse.",
    },
    {
      q: "Puis-je recevoir des devises autres que l'EUR directement sur un compte bancaire allemand ?",
      a: "Certaines banques allemandes (notamment Deutsche Bank, Commerzbank et des banques internationales comme HSBC Germany) proposent des comptes multidevises pouvant détenir des USD, GBP et d'autres devises. Les comptes EUR standard verront les virements dans d'autres devises automatiquement convertis au taux de change de la banque. Pour des réceptions régulières en devises étrangères, un compte multidevises évite cette conversion automatique.",
    },
  ],

  france: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour la France ?",
      a: "Un code SWIFT (également appelé BIC en France) est un identifiant de 8 ou 11 caractères utilisé par les banques françaises pour les virements internationaux. La partie code pays est FR. Par exemple, BNPAFRPP est le code SWIFT de BNP Paribas. La structure est : 4 caractères pour la banque, 2 pour le pays (FR), 2 pour la ville et, facultativement, 3 pour la succursale.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques françaises ?",
      a: "Les principaux codes SWIFT des banques françaises comprennent : BNP Paribas — BNPAFRPP, Crédit Agricole — AGRIFRPP, Société Générale — SOGEFRPP, La Banque Postale — PSSTFRPP, Caisse d'Epargne — CEPAFRPP, Crédit Mutuel — CMCIFRPP et LCL — CRLYFRPP. Les banques françaises utilisent généralement des codes BIC8 ; la variante BIC11 identifie une succursale spécifique.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou seulement d'un IBAN pour les virements vers la France ?",
      a: "Pour les virements en EUR depuis la zone SEPA, l'IBAN français (commençant par FR, 27 caractères) est suffisant — aucun code SWIFT/BIC n'est nécessaire. Pour les virements depuis l'extérieur de la zone SEPA ou dans une devise autre que l'EUR, vous aurez besoin du code BIC/SWIFT de la banque en plus de l'IBAN. Les virements SEPA sont plus rapides, moins coûteux et n'entraînent pas de frais de réception.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque française ?",
      a: "Vous pouvez trouver le code BIC/SWIFT de votre banque française sur votre RIB (Relevé d'Identité Bancaire), sur vos relevés bancaires, dans votre portail de banque en ligne ou en effectuant une recherche sur cette page. Le RIB est le document bancaire standard français contenant votre IBAN, votre BIC et vos coordonnées bancaires — la plupart des banques françaises le fournissent dans leur application ou en agence.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la France ?",
      a: "Les virements SEPA en EUR depuis l'Europe arrivent généralement en un jour ouvrable (souvent le jour même avec SEPA Instant). Les virements SWIFT depuis l'extérieur de la zone SEPA prennent généralement un à trois jours ouvrables. Les virements dans des devises autres que l'EUR peuvent prendre un peu plus de temps. Les banques françaises traitent les virements SWIFT entrants pendant les heures bancaires standard (heure de Paris).",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en France ?",
      a: "Les virements SEPA en EUR sont généralement gratuits ou très peu coûteux. Les virements SWIFT hors SEPA peuvent entraîner une commission de réception (frais de reception de virement international), généralement entre 10 et 30 EUR selon la banque. Si le virement arrive dans une devise autre que l'EUR, la banque convertira à son propre taux. Consultez le tarif bancaire (grille tarifaire) de votre banque pour plus de détails.",
    },
    {
      q: "Qu'est-ce qu'un RIB et quel est son lien avec les virements SWIFT ?",
      a: "Un RIB (Relevé d'Identité Bancaire) est un document bancaire standard français contenant votre IBAN, votre BIC (code SWIFT), le nom de la banque et les coordonnées du titulaire du compte. C'est le moyen principal par lequel les clients des banques françaises partagent leurs informations de compte pour les virements. Pour les virements SWIFT internationaux, communiquez à l'expéditeur le BIC et l'IBAN figurant sur votre RIB.",
    },
    {
      q: "Puis-je recevoir des devises autres que l'EUR directement sur mon compte bancaire français ?",
      a: "La plupart des comptes bancaires français standard sont libellés en EUR, et les virements entrants dans d'autres devises sont automatiquement convertis au taux de change de la banque. Certaines banques (notamment BNP Paribas, Société Générale et les banques internationales) proposent des comptes multidevises. Si vous recevez régulièrement des USD ou des GBP, un compte multidevises évite la conversion automatique et la marge associée.",
    },
  ],

  "united-arab-emirates": [
    {
      q: "Qu'est-ce qu'un code SWIFT pour les Émirats arabes unis ?",
      a: "Un code SWIFT (BIC) pour les EAU est un identifiant de 8 ou 11 caractères utilisé par les banques émiraties pour les virements internationaux. La partie code pays est AE. Par exemple, ABORAEADXXX est le code SWIFT d'Emirates NBD. La structure est : 4 caractères pour la banque, 2 pour le pays (AE), 2 pour la ville et, facultativement, 3 pour la succursale.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques des EAU ?",
      a: "Les principaux codes SWIFT des banques des EAU comprennent : Emirates NBD — ABORAEADXXX, Abu Dhabi Commercial Bank (ADCB) — ADCBAEAA, First Abu Dhabi Bank (FAB) — NBADAEAA, Mashreq Bank — BOMLAEADXXX, Dubai Islamic Bank — DUIBAEAD et RAK Bank — NABOREAD. Les succursales en zone franche (DIFC, ADGM) peuvent utiliser des codes SWIFT différents — confirmez toujours avec le destinataire.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque aux EAU ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque aux EAU sur votre relevé bancaire, dans votre application de banque en ligne ou mobile, en contactant votre banque ou en effectuant une recherche sur cette page. Les banques des EAU affichent généralement clairement les codes SWIFT dans leurs plateformes de banque numérique. Notez que les succursales du DIFC et de l'ADGM peuvent avoir des codes différents de ceux des succursales continentales.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT et d'un IBAN pour les virements vers les EAU ?",
      a: "Oui. Pour les virements internationaux vers les EAU, l'expéditeur a besoin à la fois du code SWIFT/BIC de la banque du destinataire et de l'IBAN du destinataire (23 caractères commençant par AE). Le code SWIFT achemine le paiement vers la bonne banque, tandis que l'IBAN identifie le compte spécifique. Les banques des EAU exigent l'IBAN pour tous les virements — fournir uniquement le numéro de compte n'est pas suffisant.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers les EAU ?",
      a: "Les virements SWIFT vers les EAU arrivent généralement en un à deux jours ouvrables pour les principales devises telles que l'USD, l'EUR et la GBP. Les EAU constituent un important centre bancaire international avec de solides relations de correspondance, notamment pour les virements en USD en raison de l'ancrage AED/USD. Les virements impliquant des devises moins courantes peuvent prendre un jour supplémentaire.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT aux EAU ?",
      a: "Les banques des EAU facturent généralement des frais de virement télégraphique entrant, souvent entre 15 et 50 AED par transaction. Certaines banques les dispensent pour les clients de banque privée ou premium. L'AED étant ancré à l'USD à environ 3,6725, les virements en USD vers des comptes en AED donnent lieu à une conversion prévisible — bien que certaines banques appliquent quand même un petit écart sur la conversion.",
    },
    {
      q: "Comment l'ancrage AED/USD affecte-t-il les virements internationaux ?",
      a: "Le dirham des Émirats arabes unis (AED) est ancré au dollar américain à environ 3,6725, ce qui signifie que le taux de change est stable et prévisible pour les virements en USD. Envoyer des USD vers un compte bancaire aux EAU donne lieu à un taux de conversion quasi fixe. Pour d'autres devises comme l'EUR ou la GBP, la conversion dépend du taux de change de la banque, qui peut inclure une marge. Envoyer des USD est souvent l'option la plus économique.",
    },
    {
      q: "Les banques du DIFC et de l'ADGM utilisent-elles des codes SWIFT différents ?",
      a: "Oui. Les banques opérant dans le Centre financier international de Dubaï (DIFC) ou sur le marché mondial d'Abou Dhabi (ADGM) peuvent utiliser des codes SWIFT différents de ceux de leurs succursales continentales aux EAU. Par exemple, la succursale DIFC d'une banque peut avoir un code SWIFT distinct de ses opérations principales aux EAU. Confirmez toujours le code SWIFT exact avec le destinataire, en précisant si son compte est dans une zone franche ou une succursale continentale.",
    },
  ],

  canada: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Canada ?",
      a: "Un code SWIFT (BIC) pour le Canada est un identifiant de 8 ou 11 caractères utilisé par les banques canadiennes pour les virements internationaux. La partie code pays est CA. Par exemple, ROYCCAT2 est le code SWIFT de la Banque Royale du Canada (RBC). La structure est : 4 caractères pour la banque, 2 pour le pays (CA), 2 pour la ville et, facultativement, 3 pour la succursale ou la division.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques canadiennes ?",
      a: "Les principaux codes SWIFT des banques canadiennes comprennent : Banque Royale du Canada (RBC) — ROYCCAT2, TD Canada Trust — TDOMCATTTOR, Banque Scotia — NOSCCATT, Banque de Montréal (BMO) — BOFMCAM2, CIBC — CABOROTT, Banque Nationale du Canada — BNDCCAMM et Desjardins — CCDQCAMM. Confirmez toujours le code exact avec la banque du destinataire.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque canadienne ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque canadienne sur votre relevé bancaire, dans votre application de banque en ligne ou mobile, en contactant le service des virements internationaux de votre banque ou en effectuant une recherche sur cette page. Le code SWIFT est différent de votre numéro de transit et de votre numéro d'institution, qui sont réservés aux virements domestiques canadiens.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou d'un numéro de transit pour les virements internationaux vers le Canada ?",
      a: "Pour les virements internationaux depuis l'extérieur du Canada, l'expéditeur a besoin du code SWIFT/BIC de la banque du destinataire ainsi que du numéro de compte complet. Le numéro de transit à cinq chiffres et le numéro d'institution à trois chiffres sont destinés aux virements domestiques canadiens (Interac, TEF) et ne sont pas utilisés par le réseau SWIFT. Cependant, certaines banques demandent le numéro de transit à titre d'information complémentaire pour identifier la succursale.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Canada ?",
      a: "Les virements SWIFT vers le Canada arrivent généralement en un à trois jours ouvrables. Les virements depuis les États-Unis se règlent généralement en un jour ouvrable grâce aux solides relations bancaires transfrontalières. Les virements depuis l'Europe et l'Asie prennent généralement un à deux jours ouvrables dans les grandes banques comme RBC, TD et Banque Scotia.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Canada ?",
      a: "Les banques canadiennes facturent généralement des frais de virement international entrant, souvent entre 10 et 25 CAD par transaction. Si le virement arrive dans une devise autre que le CAD, la banque convertit à son taux de change affiché, qui inclut généralement une majoration de 1 à 3 % par rapport au taux interbancaire. Envoyer en CAD depuis votre côté permet souvent d'obtenir un coût total plus avantageux si votre prestataire offre un taux compétitif.",
    },
    {
      q: "Quelle est la différence entre Interac, le TEF et SWIFT au Canada ?",
      a: "Interac Virement est le système canadien de paiements instantanés entre particuliers utilisant une adresse e-mail ou un numéro de téléphone. Le TEF (Transfert électronique de fonds) gère les virements domestiques par lots entre banques canadiennes à l'aide de numéros de transit et d'institution. Ces deux systèmes sont exclusivement domestiques et ne peuvent pas recevoir de paiements internationaux. SWIFT est destiné aux virements internationaux transfrontaliers utilisant des codes BIC.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur mon compte bancaire canadien ?",
      a: "La plupart des comptes chèques canadiens standard sont libellés en CAD. Cependant, les cinq grandes banques canadiennes proposent toutes des comptes en USD, et certaines offrent des comptes multidevises pour d'autres monnaies. Si vous détenez un compte en USD, les virements entrants en USD peuvent être crédités directement sans conversion. Sinon, la banque convertit au taux affiché, qui inclut une majoration.",
    },
  ],

  australia: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour l'Australie ?",
      a: "Un code SWIFT (BIC) pour l'Australie est un identifiant de 8 ou 11 caractères utilisé par les banques australiennes pour les virements internationaux. La partie code pays est AU. Par exemple, CTBAAU2S est le code SWIFT de la Commonwealth Bank of Australia (CBA). La structure est : 4 caractères pour la banque, 2 pour le pays (AU), 2 pour la ville et, facultativement, 3 pour la succursale.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques australiennes ?",
      a: "Les principaux codes SWIFT des banques australiennes comprennent : Commonwealth Bank (CBA) — CTBAAU2S, Westpac — WPACAU2S, ANZ — ANZBAU3M, National Australia Bank (NAB) — NATAAU33, Macquarie Bank — MACQAU2S et Bendigo and Adelaide Bank — BENDAU3B. Confirmez toujours le code exact avec la banque du destinataire.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque australienne ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque australienne sur votre relevé bancaire, dans votre application de banque par Internet ou mobile, en contactant votre banque ou en effectuant une recherche sur cette page. Le code SWIFT est différent du numéro BSB (Bank-State-Branch) — le BSB est réservé aux virements domestiques, mais les deux (BSB et code SWIFT) sont nécessaires pour les virements internationaux.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT et d'un BSB pour les virements internationaux vers l'Australie ?",
      a: "Oui. Pour les virements internationaux vers l'Australie, l'expéditeur a besoin du code SWIFT/BIC de la banque du destinataire, du BSB (six chiffres) et du numéro de compte. Le code SWIFT achemine le paiement vers la bonne banque, tandis que le BSB et le numéro de compte identifient la succursale et le compte spécifiques. Fournir uniquement le code SWIFT sans le BSB peut entraîner un retard ou un retour du paiement.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers l'Australie ?",
      a: "Les virements SWIFT vers l'Australie arrivent généralement en un à trois jours ouvrables. Les virements depuis le Royaume-Uni et l'Asie se règlent généralement en un à deux jours ouvrables. Le fuseau horaire australien (AEST, UTC+10/+11) signifie que les virements envoyés en fin de journée ouvrable européenne ou américaine peuvent ne pas être traités avant le jour bancaire australien suivant.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Australie ?",
      a: "Les banques australiennes facturent généralement des frais de paiement international entrant de 10 à 20 AUD par virement SWIFT. Certaines banques les dispensent pour les titulaires de comptes premium ou internationaux. Si le virement arrive dans une devise autre que l'AUD, la banque convertit à son propre taux, généralement moins favorable que la conversion du côté de l'expéditeur.",
    },
    {
      q: "Qu'est-ce que PayID et peut-il recevoir des virements SWIFT internationaux ?",
      a: "PayID fait partie de la Nouvelle Plateforme de Paiements (NPP) australienne et permet des virements domestiques instantanés à l'aide d'un numéro de téléphone, d'une adresse e-mail ou d'un ABN. PayID ne peut pas recevoir de virements SWIFT internationaux — il est strictement domestique. Pour les virements internationaux, l'expéditeur doit utiliser le code SWIFT de la banque du destinataire ainsi que le BSB et le numéro de compte.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur mon compte bancaire australien ?",
      a: "La plupart des comptes bancaires australiens standard sont libellés en AUD. Cependant, CBA, Westpac, ANZ et NAB proposent des comptes en devises étrangères (FCA) pouvant détenir des USD, GBP, EUR et d'autres devises. Si vous recevez régulièrement des devises étrangères, un FCA évite la conversion automatique. Sinon, la banque convertit les devises étrangères entrantes en AUD à son taux acheteur à la date de règlement.",
    },
  ],
  singapore: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour Singapour ?",
      a: "Un code SWIFT (BIC) pour Singapour est un identifiant de 8 ou 11 caractères utilisé par les banques singapouriennes pour les virements internationaux. La partie code pays est SG. Par exemple, DBSSSGSG est le code SWIFT de DBS Bank Singapour. La structure est : 4 caractères pour la banque, 2 pour le pays (SG), 2 pour la ville et, optionnellement, 3 pour l'agence ou la division.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques singapouriennes ?",
      a: "Les principaux codes SWIFT des banques singapouriennes incluent : DBS Bank — DBSSSGSG, OCBC Bank — OCBCSGSG, United Overseas Bank (UOB) — UOVBSGSG, Standard Chartered Singapour — SCBLSG22, Citibank Singapour — CITISGSG et HSBC Singapour — HSBCSGSG. Confirmez toujours le code exact auprès de la banque du bénéficiaire, car différentes divisions peuvent utiliser des codes différents.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque singapourienne ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque singapourienne sur votre relevé bancaire, dans votre application de banque en ligne ou mobile, en contactant votre banque ou en effectuant une recherche sur cette page. DBS, OCBC et UOB affichent clairement les codes SWIFT dans leurs plateformes de banque numérique. Sachez que les divisions de banque privée et corporate peuvent avoir des codes SWIFT différents.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou d'un identifiant PayNow pour les virements internationaux vers Singapour ?",
      a: "PayNow est le système de paiement instantané domestique de Singapour lié aux numéros NRIC/FIN ou aux numéros de téléphone — il ne peut pas recevoir de virements SWIFT internationaux. Pour les virements internationaux depuis l'extérieur de Singapour, l'expéditeur a besoin du code SWIFT/BIC de la banque du bénéficiaire ainsi que du numéro de compte bancaire complet. PayNow est uniquement destiné aux transferts locaux en SGD au sein de Singapour.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers Singapour ?",
      a: "Les virements SWIFT vers Singapour arrivent généralement en un à deux jours ouvrables. En tant que l'un des centres financiers les plus importants d'Asie, les banques singapouriennes disposent d'un vaste réseau de banques correspondantes qui facilitent un règlement rapide pour les principales devises. Les virements en provenance des États-Unis, du Royaume-Uni et d'Europe en USD, EUR ou GBP se règlent généralement en un jour ouvrable.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT à Singapour ?",
      a: "Les banques singapouriennes facturent généralement des frais de virement télégraphique entrant, souvent de 10 à 20 SGD par transaction. DBS, OCBC et UOB peuvent exonérer ou réduire ces frais pour certains types de comptes. Si le virement arrive dans une devise différente de celle du compte, la banque convertira à son propre taux de change, qui comprend une marge sur le taux de marché.",
    },
    {
      q: "Puis-je recevoir plusieurs devises sur mon compte bancaire singapourien ?",
      a: "Oui. Les banques singapouriennes proposent couramment des comptes multidevises pouvant détenir des SGD, USD, EUR, GBP, AUD, HKD et d'autres devises. C'est un avantage considérable — vous pouvez recevoir des virements internationaux dans la devise d'origine sans conversion automatique. Confirmez la devise que l'expéditeur doit utiliser, car recevoir dans la devise existante du compte évite les frais de conversion.",
    },
    {
      q: "Existe-t-il des réglementations de la MAS affectant les grands virements entrants vers Singapour ?",
      a: "L'Autorité monétaire de Singapour (MAS) exige des banques qu'elles effectuent une diligence raisonnable renforcée sur certains virements entrants. Les paiements dépassant des seuils spécifiques ou provenant de certaines juridictions peuvent être retenus pour examen de conformité, ajoutant un à deux jours ouvrables. Fournir une référence de paiement et un motif clairs aide à éviter les retards. Les remises personnelles en dessous des seuils habituels sont généralement traitées rapidement.",
    },
  ],

  "south-africa": [
    {
      q: "Qu'est-ce qu'un code SWIFT pour l'Afrique du Sud ?",
      a: "Un code SWIFT (BIC) pour l'Afrique du Sud est un identifiant de 8 ou 11 caractères utilisé par les banques sud-africaines pour les virements internationaux. La partie code pays est ZA. Par exemple, SBZAZAJJ est le code SWIFT de Standard Bank. La structure est : 4 caractères pour la banque, 2 pour le pays (ZA), 2 pour la ville et, optionnellement, 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques sud-africaines ?",
      a: "Les principaux codes SWIFT des banques sud-africaines incluent : Standard Bank — SBZAZAJJ, First National Bank (FNB) — FIRNZAJJ, Absa Bank — ABSAZAJJ, Nedbank — NEDSZAJJ, Capitec Bank — CABORAZJ et Investec — IVESZAJJ. La plupart des virements internationaux sont acheminés via la passerelle SWIFT du siège social de la banque à Johannesburg.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque sud-africaine ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque sud-africaine sur votre relevé bancaire, dans votre application de banque en ligne, en contactant votre banque ou en effectuant une recherche sur cette page. Standard Bank, FNB, Absa et Nedbank affichent tous les codes SWIFT dans leurs plateformes de banque numérique. Les codes au niveau des agences sont moins couramment utilisés — la plupart des virements passent par la passerelle SWIFT du siège social.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT et d'un code d'agence pour les virements internationaux vers l'Afrique du Sud ?",
      a: "Oui. Pour les virements bancaires internationaux vers l'Afrique du Sud, l'expéditeur a besoin du code SWIFT/BIC de la banque du bénéficiaire, du code d'agence (six chiffres) et du numéro de compte. Le code SWIFT achemine le paiement vers la bonne banque, tandis que le code d'agence et le numéro de compte identifient l'agence et le compte spécifiques. Fournissez les trois pour éviter les retards.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers l'Afrique du Sud ?",
      a: "Les virements SWIFT vers l'Afrique du Sud arrivent généralement en un à trois jours ouvrables. Les virements en provenance du Royaume-Uni — un corridor majeur — se règlent généralement en un à deux jours ouvrables. Les exigences de conformité de la SARB, notamment la documentation de contrôle des changes, peuvent allonger le délai de traitement si la banque du bénéficiaire demande des documents justificatifs avant de libérer les fonds.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Afrique du Sud ?",
      a: "Les banques sud-africaines facturent généralement des frais de virement entrant et une commission SWIFT, qui combinés peuvent représenter 100 à 500 ZAR selon la banque et le montant. La banque convertit les devises étrangères entrantes en ZAR à son taux de change, qui comprend un écart par rapport au taux de marché. Pour les virements importants, le bénéficiaire peut parfois négocier un meilleur taux auprès du bureau des changes de la banque.",
    },
    {
      q: "Que sont les contrôles des changes de la SARB et comment affectent-ils les virements entrants ?",
      a: "La Banque de réserve sud-africaine (SARB) impose des contrôles des changes sur les paiements transfrontaliers. Pour chaque virement international entrant, la banque du bénéficiaire doit établir le motif du paiement avant de créditer les fonds. Des documents tels que des factures, des contrats de travail ou des déclarations de don peuvent être requis. Les retards dans la fourniture de ces documents bloqueront les fonds jusqu'à ce que la conformité soit satisfaite.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur un compte bancaire sud-africain ?",
      a: "Les comptes ZAR standard ne peuvent pas détenir de devises étrangères. Les contrôles des changes de la SARB exigent que toutes les devises étrangères entrantes soient converties en ZAR. Cependant, certaines banques proposent des comptes en devises étrangères (FCA) pour les particuliers et les entreprises qui reçoivent régulièrement des paiements internationaux. Les FCA sont soumis à l'approbation de la SARB et à des conditions spécifiques. Le bénéficiaire doit discuter des options de FCA avec sa banque.",
    },
  ],

  ireland: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour l'Irlande ?",
      a: "Un code SWIFT (également appelé BIC) est un identifiant de 8 ou 11 caractères utilisé par les banques irlandaises pour les virements internationaux. La partie code pays est IE. Par exemple, AIBKIE2D est le code SWIFT de l'AIB (Allied Irish Banks). La structure est : 4 caractères pour la banque, 2 pour le pays (IE), 2 pour la ville et, optionnellement, 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques irlandaises ?",
      a: "Les principaux codes SWIFT des banques irlandaises incluent : AIB — AIBKIE2D, Bank of Ireland — BOFIIEDD, Permanent TSB — IPBSIE2D, An Post Money — divers et Revolut Ireland — REVRIE21. Notez qu'Ulster Bank et KBC ont quitté le marché irlandais — assurez-vous que le bénéficiaire fournit des coordonnées bancaires actuelles. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT ou seulement d'un IBAN pour les virements vers l'Irlande ?",
      a: "Pour les virements en EUR depuis la zone SEPA, l'IBAN irlandais (commençant par IE, 22 caractères) est suffisant — aucun code SWIFT/BIC n'est nécessaire. Pour les virements depuis l'extérieur de SEPA (comme les États-Unis, le Canada ou l'Australie) ou dans une devise non EUR, vous aurez besoin du code BIC/SWIFT de la banque en plus de l'IBAN.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque irlandaise ?",
      a: "Vous pouvez trouver le BIC/SWIFT de votre banque irlandaise sur votre relevé bancaire, dans votre application de banque en ligne, sur votre carte bancaire ou en effectuant une recherche sur cette page. Les banques irlandaises affichent également le BIC à côté de l'IBAN dans leurs portails de banque en ligne. Si vous utilisiez précédemment Ulster Bank ou KBC, vous aurez besoin du code SWIFT de votre nouvelle banque après la migration.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers l'Irlande ?",
      a: "Les virements SEPA en EUR depuis l'Europe arrivent généralement en un jour ouvrable (souvent le jour même avec SEPA Instant). Les virements SWIFT depuis l'extérieur de SEPA prennent généralement un à trois jours ouvrables. Les virements en provenance des États-Unis et du Canada vers AIB ou Bank of Ireland se règlent généralement en un à deux jours ouvrables.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Irlande ?",
      a: "Les virements SEPA en EUR sont généralement gratuits ou peu coûteux dans les banques irlandaises. Les virements SWIFT non SEPA peuvent entraîner des frais de virement entrant, généralement de 5 à 12 EUR selon la banque. Si le virement arrive dans une devise non EUR (comme USD ou GBP), la banque convertira à son propre taux de change. Certains types de comptes exonèrent les frais de virement entrant.",
    },
    {
      q: "Les codes SWIFT d'Ulster Bank et de KBC ont-ils cessé de fonctionner en Irlande ?",
      a: "Oui. Ulster Bank et KBC Bank Ireland ont quitté le marché irlandais et leurs codes SWIFT ne traitent plus les paiements. Les clients qui détenaient des comptes dans ces banques ont migré vers AIB, Bank of Ireland ou Permanent TSB. Si vous receviez précédemment des virements internationaux chez Ulster Bank ou KBC, vous devez fournir à l'expéditeur le code SWIFT et l'IBAN de votre nouvelle banque.",
    },
    {
      q: "Puis-je recevoir des devises autres que l'EUR directement sur mon compte bancaire irlandais ?",
      a: "La plupart des comptes bancaires irlandais standard sont libellés en EUR. Certaines banques (notamment AIB et Bank of Ireland pour les comptes professionnels) proposent des capacités multidevises. Si vous détenez un compte EUR standard, les virements entrants en devises non EUR seront convertis au taux de change de la banque. Pour les réceptions régulières en devises étrangères, renseignez-vous auprès de votre banque sur les options de compte multidevise.",
    },
  ],

  "new-zealand": [
    {
      q: "Qu'est-ce qu'un code SWIFT pour la Nouvelle-Zélande ?",
      a: "Un code SWIFT (BIC) pour la Nouvelle-Zélande est un identifiant de 8 ou 11 caractères utilisé par les banques néo-zélandaises pour les virements internationaux. La partie code pays est NZ. Par exemple, ANZBNZ22 est le code SWIFT d'ANZ New Zealand. La structure est : 4 caractères pour la banque, 2 pour le pays (NZ), 2 pour la ville et, optionnellement, 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques néo-zélandaises ?",
      a: "Les principaux codes SWIFT des banques néo-zélandaises incluent : ANZ New Zealand — ANZBNZ22, ASB Bank — ASBBNZ2A, Bank of New Zealand (BNZ) — BKNZNZ22, Westpac New Zealand — WPACNZ2W, Kiwibank — KIABORZ22 et TSB Bank — TSBKNZ22. Confirmez toujours le code exact auprès de la banque du bénéficiaire avant d'envoyer.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque néo-zélandaise ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque néo-zélandaise sur votre relevé bancaire, dans votre application de banque en ligne ou mobile, en contactant votre banque ou en effectuant une recherche sur cette page. ANZ, ASB, BNZ et Westpac affichent tous les codes SWIFT dans leurs plateformes de banque en ligne, dans les sections paiement international ou détails du compte.",
    },
    {
      q: "Quelles informations de compte dois-je fournir pour un virement international vers la Nouvelle-Zélande ?",
      a: "Pour les virements bancaires internationaux vers la Nouvelle-Zélande, l'expéditeur a besoin : du code SWIFT/BIC de la banque du bénéficiaire et du numéro de compte néo-zélandais complet. Le numéro de compte néo-zélandais comporte quatre parties — numéro de banque (deux chiffres), numéro d'agence (quatre chiffres), numéro de compte (sept chiffres) et suffixe (deux à trois chiffres). N'omettez pas le suffixe, car cela peut entraîner le rejet du paiement.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la Nouvelle-Zélande ?",
      a: "Les virements SWIFT vers la Nouvelle-Zélande arrivent généralement en un à trois jours ouvrables. Les virements en provenance d'Australie se règlent généralement en un jour ouvrable en raison des relations bancaires étroites. La Nouvelle-Zélande se trouve dans un fuseau horaire bien en avance sur la plupart des centres financiers (UTC+12/+13), de sorte que les virements envoyés en fin de journée ouvrée européenne ou américaine peuvent ne pas être traités avant le prochain jour bancaire néo-zélandais.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Nouvelle-Zélande ?",
      a: "Les banques néo-zélandaises facturent généralement des frais de virement international entrant de 10 à 15 NZD par paiement SWIFT. Si le virement arrive dans une devise étrangère, la banque convertit en NZD à son taux affiché, qui comprend une marge de 1 à 2% par rapport au taux de marché. Pour les montants supérieurs à 10 000 NZD, le bénéficiaire peut parfois demander un meilleur taux auprès de la salle des marchés de la banque.",
    },
    {
      q: "Quelle est la différence entre les virements domestiques en Nouvelle-Zélande et SWIFT ?",
      a: "Les virements domestiques en Nouvelle-Zélande utilisent le format numéro de banque-agence-compte-suffixe et sont traités via le système de paiement domestique néo-zélandais. SWIFT est destiné aux virements transfrontaliers internationaux utilisant des codes BIC. Les systèmes domestiques ne peuvent pas recevoir de paiements de l'étranger. Après qu'un virement SWIFT arrive dans une banque néo-zélandaise, la banque crédite le compte du bénéficiaire via ses systèmes internes.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur mon compte bancaire néo-zélandais ?",
      a: "La plupart des comptes bancaires standard en Nouvelle-Zélande sont libellés en NZD. ANZ, ASB, BNZ et Westpac proposent des comptes en devises étrangères pouvant détenir des USD, AUD, GBP, EUR et d'autres devises. Si vous recevez régulièrement des devises étrangères, un compte en devise étrangère évite la conversion automatique au taux de la banque. Sinon, les devises étrangères entrantes sont converties en NZD à la date de règlement.",
    },
  ],

  bangladesh: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Bangladesh ?",
      a: "Un code SWIFT (également appelé code BIC) est un identifiant de 8 ou 11 caractères utilisé par les banques bangladaises pour les virements internationaux. Les quatre premiers caractères identifient la banque, les deux suivants (BD) identifient le Bangladesh, les deux suivants identifient la ville et les trois derniers facultatifs identifient l'agence. Par exemple, un code SWIFT commençant par SONBBD indique Sonali Bank, la plus grande banque publique du Bangladesh.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques bangladaises ?",
      a: "Les principaux codes SWIFT incluent : Sonali Bank — SONBBDDH, Islami Bank Bangladesh — IBBLBDDH, BRAC Bank — BRAKBDDH, Dutch-Bangla Bank — DBBLBDDH, Eastern Bank — EBLBBDDH, Standard Chartered Bangladesh — SCBLBDDX et Citibank Bangladesh — CITIBDDX. Confirmez toujours le code exact auprès de la banque du bénéficiaire, car les codes au niveau des agences peuvent différer du code du siège social.",
    },
    {
      q: "Ai-je besoin à la fois d'un code SWIFT et d'un numéro de compte pour envoyer de l'argent au Bangladesh ?",
      a: "Oui. Pour effectuer un virement bancaire international vers le Bangladesh, vous avez besoin du code SWIFT/BIC de la banque du bénéficiaire, du numéro de compte complet du bénéficiaire, du nom complet du bénéficiaire tel qu'enregistré auprès de la banque, ainsi que du nom et de l'adresse de l'agence bancaire. Le Bangladesh n'utilise pas l'IBAN, le numéro de compte est donc fourni directement plutôt que sous format IBAN.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Bangladesh ?",
      a: "Les virements SWIFT vers le Bangladesh prennent généralement un à trois jours ouvrables. Les virements en provenance du Royaume-Uni et du Moyen-Orient — corridors majeurs pour les travailleurs bangladais — arrivent souvent en un à deux jours ouvrables. Les virements impliquant plusieurs banques correspondantes ou déclenchant un examen de conformité à Bangladesh Bank peuvent prendre un jour supplémentaire. Certains prestataires utilisant des réseaux de paiement dédiés au Bangladesh règlent le même jour.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Bangladesh ?",
      a: "Les banques bangladaises facturent généralement des frais de traitement de remise entrante, souvent d'environ 200 à 500 BDT par transaction. Cependant, Bangladesh Bank a périodiquement exonéré ou réduit les frais sur les remises familiales pour encourager l'utilisation des canaux officiels. La banque réceptrice convertira les devises étrangères en BDT au taux de virement télégraphique en vigueur, qui comprend une marge sur le taux interbancaire.",
    },
    {
      q: "Qu'est-ce que le système BEFTN et en quoi diffère-t-il de SWIFT ?",
      a: "BEFTN (Bangladesh Electronic Funds Transfer Network) est le système de transfert interbancaire domestique du Bangladesh — il ne traite que les virements en BDT entre banques bangladaises et ne peut pas recevoir de paiements internationaux. SWIFT est utilisé exclusivement pour les virements transfrontaliers. Si vous envoyez de l'argent de l'étranger vers un compte bancaire bangladais, le paiement transite via SWIFT vers la banque réceptrice, qui crédite ensuite le compte via ses systèmes internes.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur mon compte bancaire bangladais ?",
      a: "Les comptes taka standard ne peuvent pas détenir de devises étrangères. Les réglementations de Bangladesh Bank exigent que toutes les devises étrangères entrantes soient converties en BDT au taux en vigueur de la banque. Si vous avez besoin de détenir des devises étrangères, vous pouvez ouvrir un compte en devises étrangères (FC) auprès d'une banque bangladaise agréée, ce qui vous permet de recevoir et de maintenir des soldes en USD, GBP, EUR et certaines autres devises.",
    },
    {
      q: "Existe-t-il une prime en espèces pour la réception de remises via les canaux officiels au Bangladesh ?",
      a: "Oui. Bangladesh Bank a périodiquement proposé une prime en espèces de 2 à 2,5% sur les remises entrantes reçues via les canaux bancaires officiels, y compris les virements SWIFT. Cette prime est versée en BDT par la banque du bénéficiaire en plus du montant converti. Le dispositif est conçu pour encourager les Bangladais expatriés à utiliser les virements bancaires réglementés plutôt que les réseaux informels de hawala.",
    },
  ],
  philippines: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour les Philippines ?",
      a: "Un code SWIFT (BIC) pour les Philippines est un code de 8 ou 11 caractères identifiant une banque philippine pour les virements internationaux. La partie code pays est PH. Par exemple, ABORPH2X est le BIC de BDO Unibank, la plus grande banque philippine. La structure du code est : 4 caractères pour la banque, 2 pour le pays (PH), 2 pour la ville ou la localisation, et éventuellement 3 pour la succursale.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques philippines ?",
      a: "Les principaux codes SWIFT des banques philippines incluent : BDO Unibank — ABORPH2X, Bank of the Philippine Islands (BPI) — BABORPHMXXX, Metropolitan Bank and Trust (Metrobank) — MABORPMM, Land Bank of the Philippines — TLBPPHMM, Philippine National Bank (PNB) — PNBMPHM1XXX, Security Bank — SBTCPHMMXXX, et UnionBank — UBPHPHMM. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Comment envoyer de l'argent vers un compte bancaire philippin depuis l'étranger ?",
      a: "Pour effectuer un virement international vers les Philippines, vous avez besoin : du code SWIFT/BIC de la banque réceptrice, du numéro de compte complet du bénéficiaire et de son nom complet tel qu'il est enregistré auprès de la banque. Les Philippines n'utilisent pas l'IBAN. Pour les virements depuis les États-Unis, de nombreux prestataires proposent également des services de paiement direct sur compte utilisant les réseaux de paiement locaux philippins, ce qui peut être plus rapide et moins coûteux que le routage SWIFT standard.",
    },
    {
      q: "Puis-je envoyer de l'argent directement vers un portefeuille GCash ou Maya depuis l'étranger ?",
      a: "GCash et Maya (PayMaya) ne peuvent pas recevoir directement des virements SWIFT internationaux. Cependant, certains prestataires de transfert international (comme Western Union, Remitly et WorldRemit) ont des partenariats qui permettent la livraison directe vers des portefeuilles GCash ou Maya. Pour les virements internationaux de banque à banque, vous avez besoin du code SWIFT et du numéro de compte du bénéficiaire auprès d'une banque traditionnelle.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers les Philippines ?",
      a: "Les virements SWIFT vers les Philippines prennent généralement un à trois jours ouvrables. Les virements depuis les États-Unis, le Moyen-Orient et Hong Kong — principaux corridors OFW — arrivent habituellement en un à deux jours ouvrables. La réglementation de la BSP exige que les banques réceptrices créditent rapidement les remises entrantes. La livraison le jour même ou le lendemain est possible via des prestataires utilisant des réseaux de paiement philippins dédiés.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT aux Philippines ?",
      a: "Les banques philippines facturent des frais de remise entrante, généralement entre USD 5 et 15 ou un pourcentage du montant du virement, déduits des fonds reçus. La BSP exige que les banques divulguent ces frais. La banque réceptrice convertit la devise étrangère en PHP à son taux d'achat à la date de règlement. Les prestataires proposant une livraison directe sur compte via les réseaux locaux ont souvent des coûts totaux inférieurs aux virements SWIFT de banque à banque.",
    },
    {
      q: "Quelle est la différence entre InstaPay, PESONet et SWIFT aux Philippines ?",
      a: "InstaPay et PESONet sont des systèmes de paiement domestiques philippins : InstaPay gère les virements en temps réel jusqu'à PHP 50 000, tandis que PESONet gère les virements par lots pour des montants plus élevés. Les deux ne traitent que des PHP au sein des Philippines. SWIFT est le réseau international pour les transferts transfrontaliers. L'argent envoyé depuis l'étranger transite par SWIFT vers la banque du bénéficiaire, qui crédite ensuite le compte via son système interne.",
    },
    {
      q: "La BSP exige-t-elle des documents pour les virements entrants importants ?",
      a: "Oui. La réglementation de la BSP exige que les virements entrants de USD 10 000 ou plus soient accompagnés d'une déclaration d'objet. La banque du bénéficiaire demandera des documents pour les virements classés comme revenus professionnels, investissements ou produits de prêts. Les remises familiales personnelles sont généralement traitées sans exigences supplémentaires. Le non-respect des obligations de déclaration auprès de la BSP peut entraîner le blocage des fonds dans l'attente d'une clarification.",
    },
  ],

  nigeria: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Nigeria ?",
      a: "Un code SWIFT (BIC) pour le Nigeria est un code de 8 ou 11 caractères identifiant une banque nigériane pour les virements internationaux. La partie code pays est NG. Par exemple, GTBINGLA est le BIC de Guaranty Trust Bank (GTBank). La structure est : 4 caractères pour la banque, 2 pour le pays (NG), 2 pour la ville, et éventuellement 3 pour la succursale.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques nigérianes ?",
      a: "Les principaux codes SWIFT des banques nigérianes incluent : Access Bank — ABNGNGLA, Guaranty Trust Bank (GTBank) — GTBINGLA, Zenith Bank — ZEIBNGLA, First Bank of Nigeria — FBNINGLA, United Bank for Africa (UBA) — UNAFNGLA, Ecobank Nigeria — ECOCNGLA, et Fidelity Bank — FIDTNGLA. Vérifiez toujours le code exact auprès de la banque du bénéficiaire avant d'envoyer.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir de l'argent de l'étranger au Nigeria ?",
      a: "Oui. Pour recevoir un virement international au Nigeria, l'expéditeur a besoin du code SWIFT/BIC de votre banque ainsi que de votre numéro de compte. Le Nigeria n'utilise pas l'IBAN pour les comptes domestiques. Fournissez toujours le code SWIFT, votre numéro de compte complet, votre nom complet tel qu'enregistré auprès de la banque et l'adresse de votre agence bancaire. Certaines banques utilisent un code SWIFT unique pour toutes les agences ; d'autres peuvent avoir des codes spécifiques par agence.",
    },
    {
      q: "Puis-je recevoir des USD directement sur un compte bancaire nigérian ?",
      a: "Oui, si vous détenez un compte en devises (compte domiciliary) auprès d'une banque nigériane. La réglementation de la CBN autorise les particuliers et les entreprises à détenir et à gérer des comptes en devises en USD, GBP, EUR et autres devises approuvées. Les virements entrants en USD peuvent être crédités sur un compte domiciliary sans conversion obligatoire en naira. Les comptes standard en naira feront l'objet d'une conversion de la devise étrangère en NGN au taux officiel de la banque.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Nigeria ?",
      a: "Les virements SWIFT vers le Nigeria prennent généralement un à trois jours ouvrables. Les exigences de conformité de la CBN signifient que les virements importants ou en provenance de certaines origines peuvent être retenus pour examen, ajoutant un jour ouvrable supplémentaire. Les virements depuis le Royaume-Uni, les États-Unis et l'Europe se règlent généralement en un à deux jours ouvrables. Certains prestataires de remises proposent une livraison plus rapide en utilisant leurs propres réseaux de paiement nigérians.",
    },
    {
      q: "Qu'est-ce que NIBSS et en quoi diffère-t-il de SWIFT ?",
      a: "NIBSS (Nigeria Inter-Bank Settlement System) gère les virements domestiques en naira entre les banques nigérianes — c'est l'équivalent du système ACH utilisé dans d'autres pays. NIBSS ne peut pas recevoir de paiements internationaux. SWIFT est utilisé exclusivement pour les virements internationaux transfrontaliers. Si vous envoyez de l'argent de l'étranger vers un compte nigérian, le virement transite par SWIFT jusqu'à la banque du bénéficiaire.",
    },
    {
      q: "Existe-t-il des réglementations de la CBN affectant les virements internationaux entrants au Nigeria ?",
      a: "Oui. La Banque centrale du Nigeria exige que tous les virements étrangers entrants soient reçus par l'intermédiaire d'un établissement financier agréé. Les virements importants peuvent nécessiter une documentation de l'objet. La CBN a périodiquement ajusté ses politiques de change, notamment l'unification des taux de change et les exigences relatives aux comptes en devises. Les bénéficiaires doivent vérifier auprès de leur banque les directives actuelles de la CBN avant d'attendre un virement important.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Nigeria ?",
      a: "Les banques nigérianes facturent généralement des frais de traitement pour les virements entrants, souvent environ USD 10–25 ou un faible pourcentage du virement, selon la banque et le montant. Le taux de conversion de USD en NGN peut varier considérablement d'une banque à l'autre. Pour les virements importants, il peut être intéressant de comparer le taux de change effectif (net des frais et de la marge) entre différentes banques ou prestataires de remises.",
    },
  ],

  mexico: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Mexique ?",
      a: "Un code SWIFT (BIC) pour le Mexique est un code de 8 ou 11 caractères identifiant une banque mexicaine pour les virements internationaux. La partie code pays est MX. Par exemple, BCMRMXMM est le code SWIFT de Banorte (Banco Mercantil del Norte). La structure est : 4 caractères pour la banque, 2 pour le pays (MX), 2 pour la ville, et éventuellement 3 pour la succursale.",
    },
    {
      q: "Qu'est-ce qu'un numéro CLABE et dois-je le fournir en plus du code SWIFT ?",
      a: "La CLABE (Clave Bancaria Estandarizada) est un identifiant de compte à 18 chiffres utilisé dans le système de paiement domestique SPEI du Mexique. Pour les virements SWIFT internationaux vers le Mexique, le code SWIFT et le numéro CLABE du bénéficiaire sont tous deux obligatoires. Le code SWIFT achemine le paiement vers la bonne banque, tandis que la CLABE garantit qu'il parvient au compte spécifique. Un simple numéro de compte standard n'est pas accepté — demandez toujours au bénéficiaire sa CLABE à 18 chiffres.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques mexicaines ?",
      a: "Les principaux codes SWIFT des banques mexicaines incluent : BBVA México — BCMXMXMM, Banorte — BCMRMXMM, Santander México — BMSXMXMM, Citibanamex — BNMXMXMM, HSBC México — BIMEMXMM, et Scotiabank México — MBCOMXMM. Vérifiez toujours le code exact auprès de la banque du bénéficiaire avant d'envoyer.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Mexique ?",
      a: "Les virements SWIFT vers le Mexique arrivent généralement en un à trois jours ouvrables. Les virements depuis les États-Unis — le corridor le plus important — se règlent souvent en un jour ouvrable. Le système SPEI traite les fonds en temps réel au niveau domestique une fois que le virement international a satisfait aux exigences de conformité de la banque réceptrice. Certains prestataires dédiés États-Unis–Mexique proposent une livraison le jour même sur des comptes bancaires.",
    },
    {
      q: "Puis-je recevoir des USD sur un compte bancaire mexicain ?",
      a: "Oui. De nombreuses banques mexicaines proposent des comptes libellés en dollars (cuentas en dólares) pouvant recevoir des virements internationaux en USD sans conversion obligatoire en MXN. Si le bénéficiaire détient un compte standard en MXN, la banque convertira les USD entrants en pesos au taux de change publié à la date de règlement, qui inclut généralement une marge par rapport au taux de change interbancaire.",
    },
    {
      q: "Qu'est-ce que le système SPEI et est-il identique à SWIFT ?",
      a: "SPEI (Sistema de Pagos Electrónicos Interbancarios) est le système mexicain de paiement interbancaire domestique en temps réel, géré par la Banque du Mexique. Il gère les virements en MXN entre les banques mexicaines à l'aide des numéros CLABE. SPEI est entièrement distinct de SWIFT — il ne peut pas recevoir de paiements internationaux. SWIFT est destiné aux virements transfrontaliers. Après l'arrivée d'un virement international via SWIFT, les fonds sont réglés en interne via SPEI à l'aide de la CLABE.",
    },
    {
      q: "Existe-t-il des réglementations de Banxico à connaître lors de la réception de virements internationaux ?",
      a: "La Banque du Mexique (Banxico) réglemente les opérations de change. Le Mexique dispose de politiques de change relativement ouvertes sans exigence de conversion obligatoire pour les particuliers. Cependant, les banques doivent déclarer les virements entrants supérieurs à USD 10 000 à l'Unité de renseignement financier (UIF) du Mexique dans le cadre des réglementations anti-blanchiment d'argent. Les virements professionnels importants peuvent nécessiter une documentation de l'objet. Les remises familiales personnelles sont généralement traitées sans restrictions.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Mexique ?",
      a: "Les banques mexicaines facturent généralement des frais de virement entrant, souvent entre MXN 200 et 500 ou un pourcentage du virement, selon la banque. La marge de conversion de devises constitue un coût implicite supplémentaire. Pour les virements depuis les États-Unis, de nombreux prestataires de remises dédiés proposent une livraison directe sur compte sans frais ou à faibles frais, ce qui est nettement moins cher qu'un virement bancaire traditionnel.",
    },
  ],

  china: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour la Chine ?",
      a: "Un code SWIFT (BIC) pour la Chine est un code de 8 ou 11 caractères identifiant une banque chinoise pour les virements internationaux. La partie code pays est CN. Par exemple, ICBKCNBJXXX est le code SWIFT du siège social de l'Industrial and Commercial Bank of China (ICBC). La structure est : 4 caractères pour la banque, 2 pour le pays (CN), 2 pour la ville, et éventuellement 3 pour la succursale.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques chinoises ?",
      a: "Les principaux codes SWIFT des banques chinoises incluent : ICBC — ICBKCNBJ, Bank of China — BKCHCNBJ, China Construction Bank — PCBCCNBJ, Agricultural Bank of China — ABOCCNBJ, Bank of Communications — COMMCNSH, China Merchants Bank — CMBCCNBS, et CITIC Bank — CIBKCNBJ. Les codes au niveau des succursales sont ajoutés en tant que 9e–11e caractères. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Quels sont les contrôles des capitaux en Chine et comment affectent-ils les virements SWIFT ?",
      a: "La Chine maintient des contrôles stricts des capitaux sous l'autorité de l'Administration d'État des changes (SAFE). Les particuliers sont limités à la conversion de l'équivalent de USD 50 000 en devises étrangères par année civile. Les virements étrangers entrants dépassant ce seuil, ou à des fins professionnelles, nécessitent une documentation et une inscription auprès de SAFE. Les virements SWIFT sont autorisés, mais le bénéficiaire doit fournir une déclaration d'objet, et les montants importants peuvent être retenus dans l'attente d'un examen de conformité.",
    },
    {
      q: "Qu'est-ce que CNAPS et quel est son rapport avec SWIFT ?",
      a: "CNAPS (China National Advanced Payment System) est le système de paiement interbancaire domestique de la Chine, qui gère les virements en RMB/CNY entre les banques chinoises. Il est entièrement distinct de SWIFT. CIPS (Cross-Border Interbank Payment System) est la plateforme alternative de règlement international de la Chine pour les paiements transfrontaliers libellés en CNY. SWIFT gère les virements en devises étrangères vers la Chine, après quoi CNAPS achemine les fonds vers le compte final.",
    },
    {
      q: "Dois-je envoyer de l'argent en Chine en USD ou en CNY ?",
      a: "Pour la plupart des virements entrants, l'envoi en USD est courant et accepté par toutes les grandes banques chinoises. La banque du bénéficiaire convertit les USD en CNY au taux de change officiel. Alternativement, si l'expéditeur peut convertir en CNY à l'étranger, CIPS (Cross-Border Interbank Payment System) peut parfois régler plus rapidement qu'un routage SWIFT multi-étapes. Discutez des options avec votre prestataire de virement.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la Chine ?",
      a: "Les virements SWIFT vers la Chine prennent généralement un à trois jours ouvrables pour les principaux corridors de devises. Les virements peuvent prendre plus de temps s'ils sont signalés pour un examen de conformité dans le cadre des réglementations SAFE, notamment pour les montants s'approchant ou dépassant le plafond de conversion individuel de USD 50 000. Fournir un objet de paiement clair et précis dans la référence du virement peut réduire les délais.",
    },
    {
      q: "Existe-t-il des codes SWIFT pour des villes spécifiques en Chine ?",
      a: "Oui. Les codes SWIFT des banques chinoises comprennent un code de localisation à deux caractères représentant la ville. Par exemple, ICBKCNBJXXX achemine vers Pékin (BJ), tandis qu'ICBKCNSHXXX achemine vers Shanghai (SH). Pour la plupart des virements personnels entrants, le code SWIFT du siège social (souvent avec le suffixe XXX) est suffisant, car les banques acheminent les fonds en interne vers la succursale et le compte du bénéficiaire.",
    },
    {
      q: "Puis-je recevoir de l'argent sur un compte en devises étrangères en Chine ?",
      a: "Oui. Les banques chinoises proposent des comptes en devises étrangères (外汇账户) pouvant détenir des USD, EUR, GBP et autres grandes devises. Cependant, la réglementation SAFE implique que la conversion de soldes dépassant le quota annuel individuel nécessite une documentation. Pour les encaissements professionnels réguliers en devises étrangères, les entreprises doivent s'enregistrer auprès de SAFE et suivre des procédures de déclaration spécifiques avant que les fonds puissent être librement convertis ou rapatriés.",
    },
  ],

  japan: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Japon ?",
      a: "Un code SWIFT (BIC) pour le Japon est un code de 8 ou 11 caractères identifiant une banque japonaise pour les virements internationaux. La partie code pays est JP. Par exemple, BOTKJPJTXXX est le code SWIFT de MUFG Bank (anciennement Bank of Tokyo-Mitsubishi UFJ). La structure est : 4 caractères pour la banque, 2 pour le pays (JP), 2 pour la ville, et éventuellement 3 pour la succursale.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques japonaises ?",
      a: "Les principaux codes SWIFT des banques japonaises incluent : MUFG Bank — BOTKJPJT, Sumitomo Mitsui Banking Corporation (SMBC) — SMBCJPJT, Mizuho Bank — MHCBJPJT, Resona Bank — DIWAJPJT, Fukuoka Bank — FUKBJPJP, et Japan Post Bank — JPPYJPJT. Les banques régionales ont leurs propres codes SWIFT distincts de ceux des méga-banques. Confirmez toujours auprès de la banque spécifique du bénéficiaire.",
    },
    {
      q: "Ai-je besoin d'un code de succursale en plus du code SWIFT pour un virement vers le Japon ?",
      a: "Oui. Les banques japonaises exigent à la fois le code SWIFT et le code de succursale du bénéficiaire (店番号, trois chiffres) ainsi que le numéro de compte pour les virements internationaux entrants. Le code de succursale est différent de l'identifiant de localisation du code SWIFT — c'est un numéro spécifique attribué à chaque agence au sein de la banque. Le bénéficiaire peut trouver son code de succursale sur sa carte bancaire ou dans son application de banque en ligne.",
    },
    {
      q: "Qu'est-ce que le système Zengin et quel est son rapport avec SWIFT ?",
      a: "Le système Zengin (全銀システム) est le réseau de règlement interbancaire domestique du Japon, gérant les virements en JPY entre les banques japonaises. Il est entièrement distinct de SWIFT et ne peut pas recevoir de paiements internationaux. Lorsqu'un virement SWIFT arrive dans une banque japonaise, celle-ci le traite via ses systèmes internes et crédite le compte du bénéficiaire. Les virements domestiques en JPY entre comptes bancaires japonais utilisent Zengin, et non SWIFT.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Japon ?",
      a: "Les virements SWIFT vers le Japon prennent généralement un à trois jours ouvrables. Les virements depuis les États-Unis et l'Europe vers les principales méga-banques japonaises (MUFG, SMBC, Mizuho) arrivent habituellement en un à deux jours ouvrables. Les virements vers les banques régionales peuvent nécessiter un jour supplémentaire en raison du routage interne. Le fuseau horaire du Japon (UTC+9) signifie que les virements envoyés en fin de journée ouvrée aux États-Unis peuvent ne pas être traités par les banques japonaises avant le lendemain.",
    },
    {
      q: "Quels frais les banques japonaises facturent-elles pour la réception de virements internationaux ?",
      a: "Les banques japonaises facturent généralement des frais de traitement de virement entrant de JPY 2 500 à 4 000 par virement. De plus, si le virement implique une conversion de devises, le taux de change télégraphique de la banque s'applique, ce qui inclut une marge sur le taux de change interbancaire. Pour les virements entrants réguliers, certains prestataires utilisent des réseaux de paiement locaux libellés en JPY pour éviter entièrement les frais de virement bancaire.",
    },
    {
      q: "Puis-je recevoir des USD ou des EUR directement sur mon compte bancaire japonais ?",
      a: "La plupart des comptes bancaires japonais standard sont libellés en JPY, et les virements entrants en devises étrangères sont automatiquement convertis en JPY. Cependant, les grandes banques telles que MUFG, SMBC et Mizuho proposent des comptes de dépôt en devises étrangères (外貨預金) pouvant détenir des USD, EUR et autres devises. Ces comptes nécessitent une ouverture séparée auprès de la banque.",
    },
    {
      q: "Est-il préférable d'utiliser un service de transfert de fonds ou un virement SWIFT bancaire pour envoyer de l'argent au Japon ?",
      a: "Pour la plupart des virements personnels, les prestataires spécialisés dans les remises (comme Wise, Revolut ou Remitly) offrent des taux de change nettement meilleurs et des frais plus bas que les virements SWIFT de banque à banque. Les frais de virement entrant des banques japonaises (JPY 2 500–4 000) plus la marge de conversion peuvent rendre le SWIFT standard coûteux pour les petits montants. Les prestataires spécialisés livrent souvent sur des comptes bancaires japonais en un jour ouvrable à un coût total inférieur.",
    },
  ],
  "south-korea": [
    {
      q: "Qu'est-ce qu'un code SWIFT pour la Corée du Sud ?",
      a: "Un code SWIFT (BIC) pour la Corée du Sud est un code de 8 ou 11 caractères identifiant une banque coréenne pour les virements internationaux. La partie code pays est KR. Par exemple, CZNBKRSE est le code SWIFT de la KB Kookmin Bank. La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (KR), 2 pour la ville et, en option, 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques sud-coréennes ?",
      a: "Les principaux codes SWIFT des banques sud-coréennes sont : KB Kookmin Bank — CZNBKRSE, Shinhan Bank — SHBKKRSE, KEB Hana Bank — KOEXKRSE, Woori Bank — HVBKKRSE, Industrial Bank of Korea (IBK) — IBKOKRSE, Nonghyup Bank — NACFKRSE et Citibank Korea — CITIKRSX. Vérifiez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Comment envoyer de l'argent vers un compte bancaire sud-coréen depuis l'étranger ?",
      a: "Pour effectuer un virement international vers la Corée du Sud, vous avez besoin : du code SWIFT/BIC de la banque du bénéficiaire, du numéro de compte complet du bénéficiaire (10 à 14 chiffres selon la banque) et du nom complet du bénéficiaire en coréen ou tel qu'il est enregistré auprès de la banque. La Corée du Sud n'utilise pas l'IBAN. Certains prestataires exigent la date de naissance du bénéficiaire pour la vérification anti-blanchiment.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la Corée du Sud ?",
      a: "Les virements SWIFT vers la Corée du Sud arrivent généralement en un à trois jours ouvrables. Les virements depuis les États-Unis et l'Europe vers les principales banques coréennes se règlent habituellement en un à deux jours ouvrables. Le fuseau horaire coréen (UTC+9) signifie que les virements envoyés en fin de journée aux États-Unis peuvent être traités le jour ouvrable coréen suivant. Certains prestataires proposent une livraison le jour même ou le lendemain via des réseaux de paiement locaux en Corée.",
    },
    {
      q: "Existe-t-il des réglementations financières coréennes concernant les transferts entrants importants ?",
      a: "Oui. La loi sud-coréenne sur les transactions de change exige que les transferts entrants supérieurs à 10 000 USD soient déclarés au Service des douanes coréen. La banque du bénéficiaire effectue automatiquement cette déclaration. Pour les transferts entrants liés à des investissements, un enregistrement supplémentaire auprès de la Banque de Corée ou du ministère de l'Économie et des Finances peut être requis. Les envois de fonds personnels sont généralement traités sans démarches supplémentaires.",
    },
    {
      q: "Puis-je recevoir des USD ou des EUR sur un compte bancaire coréen ?",
      a: "Oui. Les principales banques coréennes proposent des comptes en devises étrangères (외화 계좌) pouvant détenir des USD, EUR, JPY et autres devises principales. Les devises étrangères entrantes peuvent être créditées sur ces comptes sans conversion obligatoire en KRW. Le KRW n'étant pas librement négocié en dehors de la Corée, les bénéficiaires souhaitant conserver des fonds en USD avant de les convertir peuvent tirer parti d'un compte en devises étrangères.",
    },
    {
      q: "Qu'est-ce que le système KFTC et en quoi diffère-t-il de SWIFT ?",
      a: "Le réseau du Korea Financial Telecommunications and Clearings Institute (KFTC) gère les virements interbancaires domestiques en won coréen — c'est l'équivalent des systèmes ACH d'autres pays. Le KFTC ne peut pas recevoir de paiements internationaux. SWIFT est utilisé pour les transferts transfrontaliers. Lorsqu'un virement international arrive via SWIFT dans une banque coréenne, la banque achemine les fonds en interne vers le compte du bénéficiaire via ses propres systèmes.",
    },
    {
      q: "Des frais sont-ils appliqués pour recevoir un virement SWIFT en Corée du Sud ?",
      a: "Les banques coréennes facturent généralement des frais de virement international entrant de 5 000 à 15 000 KRW ou un pourcentage du montant reçu. La conversion de devises implique un écart supplémentaire par rapport au taux de marché. Pour les envois de fonds personnels, les prestataires spécialisés utilisant des réseaux de paiement locaux en Corée proposent souvent un coût total inférieur à celui d'un virement bancaire SWIFT standard.",
    },
  ],

  thailand: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour la Thaïlande ?",
      a: "Un code SWIFT (BIC) pour la Thaïlande est un code de 8 ou 11 caractères identifiant une banque thaïlandaise pour les virements internationaux. La partie code pays est TH. Par exemple, BKKBTHBK est le code SWIFT de la Bangkok Bank. La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (TH), 2 pour la ville et, en option, 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques thaïlandaises ?",
      a: "Les principaux codes SWIFT des banques thaïlandaises sont : Bangkok Bank — BKKBTHBK, Kasikornbank (KBank) — KASITHBK, Siam Commercial Bank (SCB) — SICOTHBK, Bank of Ayudhya / Krungsri — AYUDTHBK, Krungthai Bank — KRTHTHBK, TMBThanachart Bank (ttb) — TMBKTHBK et Citibank Thailand — CITITHTHX. Vérifiez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "PromptPay peut-il recevoir des virements internationaux ?",
      a: "Non. PromptPay est le réseau de paiement instantané domestique de la Thaïlande, lié aux numéros d'identité nationale et aux numéros de téléphone — il ne traite que les virements en baht en Thaïlande et ne peut pas recevoir de paiements SWIFT internationaux. Pour les virements internationaux, l'expéditeur doit utiliser le code SWIFT de la banque du bénéficiaire ainsi que le numéro de compte bancaire thaïlandais complet.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la Thaïlande ?",
      a: "Les virements SWIFT vers la Thaïlande arrivent généralement en un à trois jours ouvrables. Les virements depuis les principaux corridors tels que les États-Unis, l'Europe et le Moyen-Orient se règlent habituellement en un à deux jours ouvrables dans les grandes banques comme Bangkok Bank et Kasikornbank. Le fuseau horaire de la Thaïlande (UTC+7) signifie que les virements envoyés en fin de journée ouvrable aux États-Unis ou en Europe peuvent ne pas être traités par les banques thaïlandaises avant le jour suivant.",
    },
    {
      q: "Quelles réglementations de la Banque de Thaïlande s'appliquent aux virements internationaux entrants ?",
      a: "Les réglementations de la Banque de Thaïlande exigent que les virements étrangers entrants supérieurs à l'équivalent de 50 000 THB soient déclarés par la banque réceptrice via le Formulaire de transaction de change (FET). Le bénéficiaire peut être amené à fournir à la banque une déclaration d'objet (remise familiale, revenu d'activité ou achat immobilier, par exemple). Les virements sans objet clairement défini peuvent être retardés dans l'attente d'une clarification.",
    },
    {
      q: "Puis-je recevoir des USD ou des EUR directement sur un compte bancaire thaïlandais ?",
      a: "Oui. Les principales banques thaïlandaises proposent des comptes de dépôt en devises étrangères (บัญชีเงินฝากเงินตราต่างประเทศ) permettant de recevoir et de conserver des USD, EUR, GBP et autres devises. Si le bénéficiaire ne possède qu'un compte standard en THB, la banque convertira la devise entrante en THB au taux acheteur en vigueur à la date de règlement. L'utilisation d'un compte en devises étrangères évite cette conversion automatique.",
    },
    {
      q: "Des frais sont-ils appliqués pour recevoir un virement SWIFT en Thaïlande ?",
      a: "Les banques thaïlandaises facturent généralement des frais de virement entrant de 200 à 500 THB par transaction. L'écart de conversion de devises représente un coût implicite supplémentaire. Bangkok Bank, qui dispose d'une agence dédiée aux États-Unis et d'une solide infrastructure transfrontalière, est souvent recommandée pour les virements USD vers THB. Les prestataires de transfert spécialisés utilisant des réseaux de paiement locaux en Thaïlande peuvent souvent proposer un coût total inférieur.",
    },
    {
      q: "Quelles informations dois-je fournir à l'expéditeur pour un virement bancaire thaïlandais ?",
      a: "Fournissez à l'expéditeur : le code SWIFT de votre banque (8 caractères), votre numéro de compte bancaire thaïlandais complet (10 à 12 chiffres), votre nom complet en anglais tel qu'il est enregistré auprès de la banque, le nom et l'adresse de l'agence bancaire, ainsi que l'objet du virement. Certaines banques thaïlandaises demandent également l'adresse du bénéficiaire. Pour respecter les exigences de la Banque de Thaïlande, assurez-vous que l'objet est indiqué avec précision dans la référence du paiement.",
    },
  ],

  indonesia: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour l'Indonésie ?",
      a: "Un code SWIFT (BIC) pour l'Indonésie est un code de 8 ou 11 caractères identifiant une banque indonésienne pour les virements internationaux. La partie code pays est ID. Par exemple, CENAIDJA est le code SWIFT de la Bank Central Asia (BCA). La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (ID), 2 pour la ville et, en option, 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques indonésiennes ?",
      a: "Les principaux codes SWIFT des banques indonésiennes sont : Bank Central Asia (BCA) — CENAIDJA, Bank Mandiri — BMRIIDJA, Bank Rakyat Indonesia (BRI) — BRINIDJA, Bank Negara Indonesia (BNI) — BNINIDJA, CIMB Niaga — BNIAIDJA, Bank Danamon — BDMNIDJA et Permata Bank — BBBAIDJA. Vérifiez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Comment envoyer de l'argent vers un compte bancaire indonésien depuis l'étranger ?",
      a: "Pour effectuer un virement international vers l'Indonésie, vous avez besoin : du code SWIFT/BIC de la banque du bénéficiaire, du numéro de compte complet du bénéficiaire (10 à 16 chiffres selon la banque) et du nom complet du bénéficiaire tel qu'il est enregistré auprès de la banque. L'Indonésie n'utilise pas l'IBAN. Pour certaines banques, le code d'agence est également requis — demandez au bénéficiaire de le confirmer auprès de sa banque.",
    },
    {
      q: "Qu'est-ce que BI-FAST et en quoi diffère-t-il de SWIFT ?",
      a: "BI-FAST est le système de paiement domestique en temps réel de Bank Indonesia, lancé en 2021. Il gère les virements en roupies indonésiennes (IDR) entre les banques indonésiennes 24h/24, 7j/7. BI-FAST ne peut pas recevoir de paiements internationaux. SWIFT est utilisé pour les transferts transfrontaliers. Lorsqu'un virement SWIFT arrive dans une banque indonésienne, la banque le traite en interne et crédite le compte du bénéficiaire.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers l'Indonésie ?",
      a: "Les virements SWIFT vers l'Indonésie arrivent généralement en un à trois jours ouvrables. Les virements depuis les principaux corridors (Malaisie, Singapour, Moyen-Orient, Europe) se règlent habituellement en un à deux jours ouvrables. Le fuseau horaire de l'Indonésie (UTC+7 pour Java/Bali, UTC+8 pour Kalimantan, UTC+9 pour l'Indonésie orientale) signifie que les virements envoyés en fin de journée ouvrable européenne ou américaine peuvent être traités le jour ouvrable indonésien suivant.",
    },
    {
      q: "Existe-t-il des réglementations de Bank Indonesia concernant les transferts entrants importants ?",
      a: "Oui. Les réglementations de Bank Indonesia exigent la déclaration des virements en devises supérieurs à l'équivalent de 25 000 USD. La banque réceptrice effectue la déclaration. Pour les virements professionnels ou liés à des investissements, des documents justificatifs sont requis. Les envois de fonds personnels sont généralement traités sans démarches supplémentaires, bien que la banque puisse demander une brève déclaration d'objet à des fins de conformité.",
    },
    {
      q: "Puis-je recevoir des USD ou d'autres devises étrangères sur un compte bancaire indonésien ?",
      a: "Oui. La plupart des grandes banques indonésiennes proposent des comptes en devises étrangères (rekening valuta asing) pouvant recevoir et détenir des USD, SGD, EUR et autres devises. Les comptes IDR standard verront les devises entrantes automatiquement converties en roupies. La roupie étant non livrable en dehors de l'Indonésie, le recours au système bancaire formel est indispensable pour recevoir des virements internationaux.",
    },
    {
      q: "Des frais sont-ils appliqués pour recevoir un virement SWIFT en Indonésie ?",
      a: "Les banques indonésiennes facturent généralement des frais de traitement de virement entrant de 50 000 à 150 000 IDR par transaction. La conversion de devises implique un écart supplémentaire par rapport au taux de marché. Les prestataires spécialisés disposant de réseaux de paiement locaux en Indonésie (en partenariat avec BCA, Mandiri ou BRI) peuvent souvent proposer un coût total inférieur et un règlement plus rapide qu'un virement bancaire SWIFT standard.",
    },
  ],

  malaysia: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour la Malaisie ?",
      a: "Un code SWIFT (BIC) pour la Malaisie est un code de 8 ou 11 caractères identifiant une banque malaisienne pour les virements internationaux. La partie code pays est MY. Par exemple, MABORYMM est le code SWIFT de Maybank (Malayan Banking Berhad). La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (MY), 2 pour la ville et, en option, 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques malaisiennes ?",
      a: "Les principaux codes SWIFT des banques malaisiennes sont : Maybank — MABORYMM, CIMB Bank — CIBBMYKL, Public Bank — PBBEMYKL, RHB Bank — RHBBMYKL, Hong Leong Bank — HLBBMYKL, AmBank — ARBKMYKL et Standard Chartered Malaysia — SCBLMYKXXXX. Les filiales de banque islamique ont des codes SWIFT distincts — par exemple, Maybank Islamic est distinct de Maybank conventionnel.",
    },
    {
      q: "DuitNow peut-il recevoir des virements internationaux ?",
      a: "Non. DuitNow est le réseau de paiement instantané domestique de Malaisie, lié aux numéros MYKAD (carte d'identité nationale) et aux numéros de téléphone. DuitNow ne traite que les virements en MYR en Malaisie et ne peut pas recevoir de paiements SWIFT internationaux. Pour les virements internationaux entrants, l'expéditeur doit utiliser le code SWIFT de la banque du bénéficiaire ainsi que le numéro de compte bancaire malaisien complet.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la Malaisie ?",
      a: "Les virements SWIFT vers la Malaisie arrivent généralement en un à trois jours ouvrables. Les virements depuis Singapour et d'autres pays de l'ASEAN se règlent souvent en un jour ouvrable en raison des relations étroites entre banques correspondantes. Le fuseau horaire de la Malaisie (UTC+8) signifie que les virements envoyés en fin de journée ouvrable européenne ou américaine peuvent être traités le jour ouvrable malaisien suivant.",
    },
    {
      q: "Existe-t-il des réglementations de Bank Negara Malaysia (BNM) sur les virements entrants ?",
      a: "Oui. Les règles d'Administration des changes (FEA) du BNM exigent que les résidents déclarent l'objet des virements étrangers entrants supérieurs à l'équivalent de 10 000 MYR. La banque réceptrice traite la déclaration, mais le bénéficiaire peut être amené à fournir des documents pour les virements à caractère commercial, d'investissement ou liés à des prêts. Les remises familiales personnelles sont généralement traitées sans exigences supplémentaires.",
    },
    {
      q: "Puis-je recevoir des devises étrangères directement sur un compte bancaire malaisien ?",
      a: "Oui. La plupart des banques malaisiennes proposent des comptes en devises étrangères (akaun mata wang asing) pouvant recevoir et détenir des USD, SGD, EUR, GBP et autres devises. Les réglementations du BNM permettent aux résidents de détenir des comptes en devises étrangères. Le ringgit malaisien (MYR) n'étant pas librement négocié à l'étranger, les devises étrangères reçues sur un compte MYR standard sont automatiquement converties au taux acheteur de la banque.",
    },
    {
      q: "Quelle est la différence entre un code SWIFT d'une banque islamique et celui d'une banque conventionnelle en Malaisie ?",
      a: "La Malaisie dispose d'entités juridiques distinctes pour la banque islamique et la banque conventionnelle. Une banque comme Maybank possède à la fois Maybank Berhad (conventionnelle) et Maybank Islamic Berhad, chacune avec son propre code SWIFT. Si le compte du bénéficiaire est détenu auprès de Maybank Islamic, le code SWIFT islamique doit être utilisé. Vérifiez toujours auprès du bénéficiaire quelle entité détient son compte.",
    },
    {
      q: "Des frais sont-ils appliqués pour recevoir un virement SWIFT en Malaisie ?",
      a: "Les banques malaisiennes facturent généralement des frais de virement international entrant de 10 à 30 MYR par transaction. La conversion de devises inclut un écart supplémentaire. Pour les remises fréquentes depuis Singapour — le principal corridor avec la Malaisie — de nombreux prestataires proposent une livraison directe sur compte via des réseaux de paiement locaux en MYR qui contournent l'acheminement SWIFT standard et réduisent le coût total.",
    },
  ],

  brazil: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Brésil ?",
      a: "Un code SWIFT (BIC) pour le Brésil est un code de 8 ou 11 caractères identifiant une banque brésilienne pour les virements internationaux. La partie code pays est BR. Par exemple, BRASBRRJSPO est un code SWIFT de Banco do Brasil à São Paulo. La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (BR), 2 pour la ville et, en option, 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques brésiliennes ?",
      a: "Les principaux codes SWIFT des banques brésiliennes sont : Banco do Brasil — BRASBRRJ, Itaú Unibanco — ITAUBRSP, Bradesco — BBDEBRSP, Santander Brasil — BSCHBRSP, Caixa Econômica Federal — CEFXBRSP et Nubank — NUBKBRSP. Plusieurs codes SWIFT peuvent exister par banque pour différentes villes. Vérifiez toujours auprès de la banque du bénéficiaire.",
    },
    {
      q: "Pix peut-il recevoir des virements internationaux ?",
      a: "Non. Pix est le système de paiement instantané domestique du Brésil, fonctionnant 24h/24, 7j/7 et gratuitement pour les particuliers. Il ne traite que les virements en BRL entre institutions financières brésiliennes et ne peut pas recevoir de paiements SWIFT internationaux. Pour les virements internationaux entrants, l'expéditeur doit utiliser le code SWIFT de la banque du bénéficiaire. Certains prestataires développent des passerelles entre les virements internationaux et les paiements Pix, mais une voie SWIFT vers Pix directe n'existe pas encore pour les virements bancaires standard.",
    },
    {
      q: "Qu'est-ce que la taxe IOF et comment affecte-t-elle la réception d'un virement SWIFT au Brésil ?",
      a: "L'IOF (Imposto sobre Operações Financeiras) est une taxe brésilienne sur les opérations financières appliquée aux transactions de change. Pour les remises personnelles entrantes, le taux de l'IOF est généralement de 0,38 % de l'équivalent en BRL. Les virements professionnels, de prêts ou d'investissements peuvent être soumis à des taux d'IOF différents. La banque réceptrice déduit automatiquement l'IOF avant de créditer le compte. Cela est distinct de tout frais de traitement bancaire.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Brésil ?",
      a: "Les virements SWIFT vers le Brésil prennent généralement deux à quatre jours ouvrables en raison des exigences de conformité du BCB et du processus obligatoire de contrat de change. Toutes les devises étrangères entrantes doivent être formellement contractées auprès d'un intermédiaire agréé (la banque réceptrice), ce qui ajoute une étape de traitement absente dans la plupart des autres pays. Les virements professionnels accompagnés de justificatifs sont généralement traités plus rapidement que les virements personnels non documentés.",
    },
    {
      q: "Qu'est-ce que l'exigence de Natureza (code d'objet) pour les virements vers le Brésil ?",
      a: "La Banco Central do Brasil exige que chaque virement en devises étrangères entrant soit accompagné d'une Natureza (code d'objet) décrivant le type de transaction : remise familiale, paiement de service, importation de marchandises, investissement, etc. La banque réceptrice transmet cette information au BCB. Si la Natureza déclarée ne correspond pas à la transaction réelle, la banque peut geler les fonds dans l'attente d'une clarification. Veillez toujours à ce que la référence de paiement de votre virement corresponde à l'objet réel.",
    },
    {
      q: "Des frais sont-ils appliqués pour recevoir un virement SWIFT au Brésil ?",
      a: "Les banques brésiliennes facturent généralement des frais de contrat de change (écart) et peuvent appliquer des frais de traitement de virement entrant. Le coût total de la réception d'un virement SWIFT en BRL comprend l'écart du taux de change de la banque (souvent de 1 à 3 % au-dessus du taux de marché), plus la taxe IOF (0,38 % pour les remises personnelles), plus les éventuels frais de service bancaire. Comparer les coûts totaux entre prestataires — et pas seulement le taux de change affiché — est essentiel pour les virements vers le Brésil.",
    },
    {
      q: "Puis-je recevoir des USD ou des EUR sur un compte bancaire brésilien ?",
      a: "Les résidents brésiliens ne peuvent généralement pas détenir de soldes en devises étrangères sur des comptes domestiques — les réglementations du BCB exigent la conversion en BRL. Des exceptions existent pour certains comptes de non-résidents et opérations de commerce extérieur. Les entreprises effectuant régulièrement des transactions en devises étrangères peuvent solliciter des autorisations spécifiques auprès du BCB. Pour les remises personnelles standard, la devise étrangère est toujours convertie en BRL à la réception.",
    },
  ],
  kenya: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Kenya ?",
      a: "Un code SWIFT (BIC) pour le Kenya est un code de 8 ou 11 caractères identifiant une banque kenyane pour les virements internationaux. La partie du code correspondant au pays est KE. Par exemple, KCBLKENX est un code SWIFT pour Kenya Commercial Bank (KCB). La structure est : 4 caractères pour la banque, 2 pour le pays (KE), 2 pour la ville, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques kenyanes ?",
      a: "Les principaux codes SWIFT de banques kenyanes comprennent : Kenya Commercial Bank (KCB) — KCBLKENX, Equity Bank — EQBLKENA, Cooperative Bank of Kenya — COOPKENAXXX, NCBA Bank — CBAFKENAXXX, Stanbic Kenya — SBICKENX, Absa Kenya — BARCKENX, et Standard Chartered Kenya — SCBLKENX. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "M-Pesa peut-il recevoir directement des virements SWIFT internationaux ?",
      a: "Non. M-Pesa est un réseau de monnaie mobile et ne peut pas recevoir directement des virements SWIFT internationaux. Pour les virements internationaux de banque à banque, l'expéditeur doit utiliser le code SWIFT et le numéro de compte de la banque du bénéficiaire. Cependant, de nombreux prestataires de transfert de fonds internationaux (Western Union, WorldRemit, Remitly) peuvent acheminer des fonds vers des portefeuilles M-Pesa via leurs propres réseaux — ce qui est distinct d'un virement SWIFT.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Kenya ?",
      a: "Les virements SWIFT vers le Kenya arrivent généralement en un à trois jours ouvrables. Les virements depuis le Royaume-Uni et les États-Unis — principaux corridors pour la diaspora kenyane — se règlent habituellement en un à deux jours ouvrables. La livraison le jour même est parfois possible pour les virements envoyés tôt dans la journée ouvrée vers des grandes banques comme KCB ou Equity Bank. Les livraisons via M-Pesa par le biais des réseaux de prestataires de transfert de fonds peuvent être quasi instantanées.",
    },
    {
      q: "Puis-je recevoir des USD ou d'autres devises étrangères sur un compte bancaire kenyan ?",
      a: "Oui. La Banque centrale du Kenya autorise les particuliers et les entreprises à détenir des Comptes en Devises Étrangères (FCA) auprès de banques kenyanes agréées. Les virements entrants en USD, EUR et GBP peuvent être crédités directement sur un FCA sans conversion obligatoire en KES. Cela est particulièrement utile pour les bénéficiaires qui reçoivent régulièrement des paiements en devises étrangères et souhaitent éviter une conversion à des taux potentiellement défavorables.",
    },
    {
      q: "Existe-t-il des réglementations de la CBK affectant les grands virements entrants vers le Kenya ?",
      a: "Oui. La Banque centrale du Kenya exige que les importants flux de devises étrangères soient déclarés à des fins de balance des paiements. Les virements destinés à des usages spécifiques (investissement, achat immobilier, activités commerciales) peuvent nécessiter une documentation. Pour les envois de fonds personnels inférieurs à 10 000 USD, le processus est généralement simple. Les banques kenyanes sont tenues d'effectuer des vérifications KYC (Connaissance du Client) et peuvent demander une documentation pour les transactions inhabituelles ou de montant élevé.",
    },
    {
      q: "Quelle est la différence entre recevoir de l'argent via SWIFT et via un prestataire de monnaie mobile ?",
      a: "Les virements SWIFT sont des transferts de banque à banque et nécessitent que le bénéficiaire dispose d'un compte bancaire kenyan avec un code SWIFT. Ils conviennent mieux aux montants importants (supérieurs à 500 USD) et aux paiements professionnels. Les prestataires de monnaie mobile comme M-Pesa acceptent les envois de fonds internationaux via les réseaux des prestataires de transfert (pas directement via SWIFT) et sont plus adaptés aux transferts personnels fréquents de petits montants vers des bénéficiaires ne disposant pas de comptes bancaires formels.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Kenya ?",
      a: "Les banques kenyanes facturent généralement des frais de traitement des virements entrants de 500 à 2 000 KES par transaction, selon la banque et le montant. La conversion de devises inclut une commission supplémentaire. Pour les virements depuis le Royaume-Uni et les États-Unis, les prestataires utilisant des réseaux de paiement par monnaie mobile ou des réseaux bancaires locaux offrent souvent un meilleur rapport qualité-prix que le SWIFT bancaire standard pour les montants inférieurs à 1 000 USD.",
    },
  ],

  ghana: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Ghana ?",
      a: "Un code SWIFT (BIC) pour le Ghana est un code de 8 ou 11 caractères identifiant une banque ghanéenne pour les virements internationaux. La partie du code correspondant au pays est GH. Par exemple, GHCBGHAC est le code SWIFT de GCB Bank (anciennement Ghana Commercial Bank). La structure est : 4 caractères pour la banque, 2 pour le pays (GH), 2 pour la ville, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques ghanéennes ?",
      a: "Les principaux codes SWIFT de banques ghanéennes comprennent : GCB Bank — GHCBGHAC, Ecobank Ghana — ECOCGHAC, Stanbic Bank Ghana — SBICGHAC, Absa Bank Ghana — BARCGHAC, Standard Chartered Ghana — SCBLGHAC, et Fidelity Bank Ghana — FIDLGHAC. Confirmez toujours le code exact auprès de la banque du bénéficiaire, car les codes peuvent varier selon l'agence.",
    },
    {
      q: "La monnaie mobile (MTN MoMo, Vodafone Cash) peut-elle recevoir des virements SWIFT internationaux ?",
      a: "Non. Les plateformes de monnaie mobile ghanéennes comme MTN MoMo et Vodafone Cash ne peuvent pas recevoir directement des virements SWIFT internationaux de banque à banque. Pour les virements internationaux de banque à banque, l'expéditeur doit utiliser le code SWIFT et le numéro de compte de la banque du bénéficiaire. Cependant, certains prestataires de transfert de fonds (comme WorldRemit et Remitly) peuvent acheminer des fonds vers des portefeuilles mobiles via leurs propres réseaux de paiement.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Ghana ?",
      a: "Les virements SWIFT vers le Ghana arrivent généralement en un à trois jours ouvrables. Les virements depuis les principaux corridors (Royaume-Uni, États-Unis, Pays-Bas — qui abritent d'importantes communautés de la diaspora ghanéenne) se règlent habituellement en un à deux jours ouvrables. Certains virements peuvent être brièvement retenus pour les rapports de conformité de la Banque du Ghana, notamment pour les montants supérieurs à 10 000 USD.",
    },
    {
      q: "Puis-je recevoir des USD ou d'autres devises étrangères sur un compte bancaire ghanéen ?",
      a: "Oui. La plupart des grandes banques ghanéennes proposent des comptes domiciliaires (comptes en devises étrangères) pouvant recevoir et détenir des USD, GBP et EUR. La Banque du Ghana autorise les particuliers à détenir des comptes en devises étrangères. Si le bénéficiaire détient un compte GHS standard, les devises étrangères entrantes sont automatiquement converties en cedis au taux d'achat de la banque. Étant donné la dépréciation significative du GHS ces dernières années, conserver des fonds dans un compte domiciliaire avant de les convertir peut parfois être avantageux.",
    },
    {
      q: "Existe-t-il des réglementations de la Banque du Ghana affectant les virements entrants ?",
      a: "Oui. La Banque du Ghana exige un rapport statistique sur tous les virements étrangers entrants. Les virements supérieurs à 10 000 USD nécessitent une déclaration d'objet. Les virements liés à des activités commerciales ou à des investissements nécessitent une documentation. Les banques réceptrices se chargent du reporting réglementaire, mais le bénéficiaire peut avoir à fournir une brève explication de l'objet du virement pour les montants importants.",
    },
    {
      q: "Quelle est la situation du taux de change pour recevoir de l'argent au Ghana ?",
      a: "Le cedi ghanéen (GHS) s'est considérablement déprécié par rapport aux principales devises ces dernières années, ce qui signifie que les bénéficiaires reçoivent davantage de cedis par dollar ou par livre au fil du temps — mais le pouvoir d'achat au Ghana a également été affecté par l'inflation. Les expéditeurs devraient comparer le taux de change effectif (y compris la commission bancaire) plutôt que de se fier uniquement au taux affiché lors du choix d'un prestataire.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Ghana ?",
      a: "Les banques ghanéennes facturent généralement des frais de traitement des virements entrants, souvent 50 à 200 GHS ou un faible pourcentage du montant. La conversion de devises inclut une commission supplémentaire par rapport au taux interbancaire médian. Pour les petits envois de fonds personnels, les prestataires spécialisés disposant de réseaux de paiement locaux en GHS offrent souvent un meilleur rapport qualité-prix que les virements SWIFT bancaires standard.",
    },
  ],

  "sri-lanka": [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Sri Lanka ?",
      a: "Un code SWIFT (BIC) pour le Sri Lanka est un code de 8 ou 11 caractères identifiant une banque sri-lankaise pour les virements internationaux. La partie du code correspondant au pays est LK. Par exemple, BCEYLKLX est le code SWIFT de Bank of Ceylon, la plus grande banque publique du Sri Lanka. La structure est : 4 caractères pour la banque, 2 pour le pays (LK), 2 pour la ville, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques sri-lankaises ?",
      a: "Les principaux codes SWIFT de banques sri-lankaises comprennent : Bank of Ceylon — BCEYLKLX, Commercial Bank of Ceylon — CABORLKLXXX, Hatton National Bank (HNB) — HABORLKLXXX, Sampath Bank — BSAMLKLX, People's Bank — PEBLLKLX, Nations Trust Bank — NTBCLKLX, et Standard Chartered Sri Lanka — SCBLLKLX. Vérifiez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Comment envoyer de l'argent vers un compte bancaire sri-lankais depuis l'étranger ?",
      a: "Pour effectuer un virement international vers le Sri Lanka, vous avez besoin : du code SWIFT/BIC de la banque du bénéficiaire, du numéro de compte complet du bénéficiaire et du nom complet du bénéficiaire tel qu'il est enregistré auprès de la banque. Le Sri Lanka n'utilise pas l'IBAN. Certaines banques sri-lankaises exigent également l'adresse de l'agence et une déclaration d'objet du virement. Demandez toujours au bénéficiaire de confirmer tous les détails auprès de sa banque.",
    },
    {
      q: "Qu'est-ce que le compte NRFC et comment aide-t-il les Sri-Lankais résidant à l'étranger ?",
      a: "Un compte NRFC (Non-Resident Foreign Currency / Compte en Devises Étrangères pour Non-Résidents) est un type de compte spécial proposé par les banques sri-lankaises aux Sri-Lankais non-résidents et aux expatriés. Les comptes NRFC peuvent recevoir des virements en devises étrangères et conserver des soldes en USD, GBP, EUR ou d'autres devises sans conversion obligatoire en LKR. Cela est avantageux pour les Sri-Lankais travaillant à l'étranger qui souhaitent conserver une épargne en devises étrangères dans leur pays.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Sri Lanka ?",
      a: "Les virements SWIFT vers le Sri Lanka arrivent généralement en un à trois jours ouvrables. Les virements depuis les principaux corridors (Moyen-Orient, Royaume-Uni, Italie et Corée du Sud — destinations importantes pour les travailleurs sri-lankais) se règlent habituellement en un à deux jours ouvrables. La vérification de conformité de la CBSL peut ajouter un jour pour les virements importants ou inhabituels.",
    },
    {
      q: "Existe-t-il des réglementations de la CBSL affectant les virements entrants ?",
      a: "Oui. La Banque centrale du Sri Lanka (CBSL) exige que tous les virements étrangers entrants soient reçus par l'intermédiaire de banques agréées et déclarés à des fins de balance des paiements. Le Sri Lanka a périodiquement durci ses règles de change en période de tensions économiques. L'utilisation des canaux bancaires officiels (virements SWIFT vers des banques agréées) garantit la conformité et aide les bénéficiaires à accéder aux devises en toute fluidité.",
    },
    {
      q: "Puis-je recevoir de l'argent en LKR ou en devises étrangères au Sri Lanka ?",
      a: "Les comptes LKR standard reçoivent les virements en devises étrangères convertis en roupies au taux de la banque à la date de règlement. Les comptes NRFC reçoivent et conservent les devises étrangères avant leur conversion. Les Comptes de Transfert Entrant (IRA) permettent également la détention temporaire de devises étrangères. Pour les virements importants, le moment de la conversion en LKR peut affecter significativement le montant reçu en roupies.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Sri Lanka ?",
      a: "Les banques sri-lankaises facturent généralement des frais de traitement des remises entrantes, souvent 500 à 1 500 LKR par transaction ou un faible pourcentage du montant. L'écart de taux de change constitue un coût implicite supplémentaire. Pour les envois de fonds personnels, le gouvernement sri-lankais a encouragé le recours aux canaux bancaires officiels en offrant des incitations sur le taux de change à diverses occasions — consultez les recommandations actuelles de la CBSL avant d'effectuer un envoi.",
    },
  ],

  nepal: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Népal ?",
      a: "Un code SWIFT (BIC) pour le Népal est un code de 8 ou 11 caractères identifiant une banque népalaise pour les virements internationaux. La partie du code correspondant au pays est NP. Par exemple, NABILNPA est le code SWIFT de Nabil Bank, l'une des plus grandes banques commerciales du Népal. La structure est : 4 caractères pour la banque, 2 pour le pays (NP), 2 pour la ville, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques népalaises ?",
      a: "Les principaux codes SWIFT de banques népalaises comprennent : Nabil Bank — NABILNPA, Standard Chartered Nepal — SCBLNPKA, Nepal Investment Mega Bank — NIBLNPKA, Himalayan Bank — HIMANPKA, Everest Bank — EVBLNPKA, NMB Bank — NMBNPKKA, et Prabhu Bank — PRBLNPKA. Confirmez toujours le code exact auprès de la banque du bénéficiaire, car les codes au niveau des agences peuvent varier.",
    },
    {
      q: "Comment les envois de fonds depuis les pays du Golfe et la Malaisie parviennent-ils au Népal via SWIFT ?",
      a: "Le Népal dispose d'une importante population de travailleurs au Qatar, aux Émirats arabes unis, en Arabie saoudite, au Koweït et en Malaisie. Lorsque ces travailleurs envoient de l'argent chez eux, les virements peuvent transiter via SWIFT depuis la banque du Golfe ou malaisienne vers la banque népalaise du bénéficiaire. Par ailleurs, de nombreux opérateurs de transfert de fonds agréés (Western Union, IME, Prabhu Money) disposent de réseaux de paiement dédiés au Népal qui peuvent être plus rapides et moins coûteux que le SWIFT de banque à banque pour les petits montants.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Népal ?",
      a: "Les virements SWIFT vers le Népal arrivent généralement en un à trois jours ouvrables. Les virements depuis l'Inde peuvent parfois se régler plus rapidement en raison de la proximité géographique et de solides relations de correspondance, tandis que les virements depuis l'Europe ou l'Amérique du Nord peuvent prendre deux à trois jours ouvrables. La vérification de conformité de la Nepal Rastra Bank (NRB) est généralement rapide pour les envois de fonds personnels, qui représentent une entrée économique d'importance nationale.",
    },
    {
      q: "Le Népal dispose-t-il d'un système de paiement national similaire à SWIFT ?",
      a: "Oui. ConnectIPS est le système de paiement interbancaire domestique du Népal, exploité sous la supervision de la Nepal Rastra Bank. Il gère les transferts en NPR entre les banques népalaises. ConnectIPS est entièrement distinct de SWIFT et ne peut pas recevoir de paiements internationaux. Après qu'un virement SWIFT arrive dans une banque népalaise, celle-ci crédite le compte du bénéficiaire via ses systèmes internes.",
    },
    {
      q: "Existe-t-il des réglementations de la Nepal Rastra Bank (NRB) sur les envois de fonds entrants ?",
      a: "Les réglementations du NRB exigent que toutes les devises étrangères reçues via SWIFT soient converties en roupies népalaises (NPR) dans un délai de trois mois, sauf si elles sont conservées sur un Compte en Devises Étrangères (FCA) approuvé par le NRB. Le NRB fixe un taux de référence quotidien pour le NPR par rapport au USD (et d'autres devises), et le taux de conversion de la banque réceptrice est basé sur cette référence. Les virements irréguliers ou importants peuvent nécessiter une documentation de l'objet.",
    },
    {
      q: "Le NPR est-il indexé sur l'INR et cela affecte-t-il la manière dont je dois envoyer de l'argent ?",
      a: "Oui. La roupie népalaise (NPR) est indexée sur la roupie indienne (INR) à un taux fixe de 1,6 NPR pour 1 INR. Cela signifie que les taux USD/NPR suivent effectivement les mouvements du USD/INR. Pour les expéditeurs en Inde, le transfert d'INR vers le Népal est simple compte tenu du taux fixe. Pour les expéditeurs en USD ou en EUR, la conversion est effectuée via le taux USD/NPR dérivé de l'indexation sur l'INR.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Népal ?",
      a: "Les banques népalaises facturent généralement des frais de traitement des virements entrants, souvent 200 à 1 000 NPR par transaction. La conversion de devises inclut une commission supplémentaire. Pour les envois de fonds personnels — notamment depuis le Golfe — les services de transfert spécialisés comme IME, Prabhu Money ou les opérateurs internationaux comme Western Union et Remitly offrent souvent une livraison plus rapide et un coût total inférieur au SWIFT de banque à banque.",
    },
  ],

  turkiye: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour la Türkiye ?",
      a: "Un code SWIFT (BIC) pour la Türkiye est un code de 8 ou 11 caractères identifiant une banque turque pour les virements internationaux. La partie du code correspondant au pays est TR. Par exemple, TGBATRIS est le code SWIFT de Garanti BBVA. La structure est : 4 caractères pour la banque, 2 pour le pays (TR), 2 pour la ville, et optionnellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques turques ?",
      a: "Les principaux codes SWIFT de banques turques comprennent : Garanti BBVA — TGBATRIS, Türkiye İş Bankası — ISBKTRIS, Akbank — AKBKTRIS, Yapı Kredi — YAPITRIS, Ziraat Bankası — TCZBTR2A, Halkbank — TRHBTR2A, Vakıfbank — TVBATR2A, et HSBC Turkey — HSBCTRIS. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Quel est le format IBAN de la Turquie pour les virements internationaux ?",
      a: "Les IBAN turcs comportent 26 caractères : TR suivi de 2 chiffres de contrôle, 5 chiffres d'identification de la banque et 17 chiffres de compte. Le format complet est TR + 2 chiffres de contrôle + code banque à 5 chiffres + numéro de compte à 17 chiffres. Lors d'un virement SWIFT vers la Turquie, fournissez à la fois l'IBAN turc et le code SWIFT/BIC de la banque. Le code SWIFT achemine le paiement vers la banque correcte ; l'IBAN identifie le compte spécifique.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la Türkiye ?",
      a: "Les virements SWIFT vers la Türkiye arrivent généralement en un à trois jours ouvrables. Les virements depuis l'Allemagne et d'autres pays européens — principaux corridors pour la diaspora turque — se règlent habituellement en un à deux jours ouvrables. Le fuseau horaire de la Turquie (UTC+3) signifie que les virements envoyés en fin de journée ouvrée européenne peuvent être traités le jour bancaire turc suivant.",
    },
    {
      q: "Puis-je recevoir des USD ou des EUR sur un compte bancaire turc ?",
      a: "Oui. Les banques turques proposent des comptes en devises étrangères (döviz hesabı) pour les USD, EUR, GBP et d'autres devises. Compte tenu de la dépréciation historique de la TRY, de nombreux résidents turcs préfèrent conserver leur épargne en devises étrangères avant de les convertir. Les grandes banques — Garanti BBVA, İş Bankası, Akbank — permettent d'ouvrir facilement des comptes en devises étrangères en parallèle des comptes TRY standard.",
    },
    {
      q: "Existe-t-il des réglementations de la CBRT ou de la BDDK affectant les virements internationaux entrants ?",
      a: "Les virements de devises étrangères entrants supérieurs à l'équivalent de 50 000 USD doivent être déclarés par la banque réceptrice à la Banque centrale de la République de Türkiye (CBRT) à des fins statistiques de balance des paiements. Les virements professionnels nécessitent une documentation telle que des factures ou des contrats. Les envois de fonds personnels sont généralement traités sans démarches supplémentaires. La Turquie n'impose pas la conversion obligatoire des devises étrangères entrantes en TRY.",
    },
    {
      q: "Qu'est-ce que le système EFT en Turquie et en quoi diffère-t-il de SWIFT ?",
      a: "L'EFT (Elektronik Fon Transferi) est le système électronique de transfert de fonds interbancaire domestique de la Turquie pour les paiements en TRY. FAST est le système de paiement domestique en temps réel de la Turquie. Les deux systèmes ne gèrent que les transferts en TRY au sein de la Turquie et ne peuvent pas recevoir de paiements internationaux. SWIFT est utilisé pour les transferts transfrontaliers. Après qu'un virement SWIFT international arrive dans une banque turque, celle-ci crédite le compte du bénéficiaire via ses systèmes internes.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Türkiye ?",
      a: "Les banques turques facturent généralement des frais de traitement des virements entrants, souvent 50 à 300 TRY ou un faible pourcentage du montant. La conversion de devises de USD ou EUR en TRY inclut une commission supplémentaire par rapport au taux interbancaire médian. Pour les virements depuis l'Allemagne — le principal corridor — de nombreux prestataires proposent des taux compétitifs et des frais inférieurs au SWIFT bancaire standard de banque à banque.",
    },
  ],
  egypt: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour l'Égypte ?",
      a: "Un code SWIFT (BIC) pour l'Égypte est un code de 8 ou 11 caractères identifiant une banque égyptienne pour les virements internationaux. La partie code pays est EG. Par exemple, NBEGEGCX est le code SWIFT de la Banque Nationale d'Égypte. La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (EG), 2 pour la ville, et éventuellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques égyptiennes ?",
      a: "Les principaux codes SWIFT de banques égyptiennes sont : Banque Nationale d'Égypte — NBEGEGCX, Banque Misr — BMISEGCX, Commercial International Bank (CIB) — CIBOREG1XXX, Banque du Caire — BCAIEGCX, Arab African International Bank — ARAIEGCXXX, HSBC Egypt — HBEGEGCX, et QNB Alahli — QNBAEGCXXX. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Comment recevoir de l'argent de l'étranger sur un compte bancaire égyptien ?",
      a: "Pour recevoir un virement international en Égypte, communiquez à l'expéditeur : le code SWIFT/BIC de votre banque, votre numéro de compte complet (l'Égypte n'utilise pas l'IBAN pour les comptes standard), votre nom complet tel qu'il est enregistré auprès de la banque, le nom et l'adresse de l'agence bancaire, ainsi que l'objet du virement. La banque réceptrice convertira la devise étrangère en EGP au taux officiel de la CBE, sauf si vous détenez un compte en devise étrangère.",
    },
    {
      q: "Puis-je recevoir des USD ou des EUR directement sur un compte bancaire égyptien ?",
      a: "Oui. Les banques égyptiennes proposent des comptes en devises étrangères (حساب عملات أجنبية) pouvant recevoir et conserver des USD, EUR, GBP et d'autres devises. La Banque centrale d'Égypte autorise les particuliers à détenir des comptes en devises étrangères. Cela est particulièrement utile pour les Égyptiens travaillant à l'étranger ou pour les hommes d'affaires qui reçoivent régulièrement des paiements en devises étrangères. Les comptes standard en EGP reçoivent les devises étrangères converties au taux officiel de la CBE.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers l'Égypte ?",
      a: "Les virements SWIFT vers l'Égypte arrivent généralement en un à trois jours ouvrables. Les virements en provenance des pays du Golfe (Arabie Saoudite, EAU, Koweït, Qatar) — principales sources de remises égyptiennes — sont habituellement réglés en un à deux jours ouvrables. La Banque Nationale d'Égypte et la Banque Misr, en tant que plus grandes banques publiques, disposent de solides relations de banque correspondante qui facilitent un règlement plus rapide.",
    },
    {
      q: "Quelle est la situation du taux de change en Égypte pour les virements entrants ?",
      a: "L'Égypte a entrepris d'importantes réformes de change. La livre égyptienne (EGP) a été dévaluée plusieurs fois et la CBE a évolué vers un régime de taux de change plus flexible. Tous les virements entrants en devises étrangères via les canaux bancaires officiels sont réglés au taux officiel de la CBE. L'utilisation des canaux bancaires officiels est fortement encouragée par la CBE, qui surveille activement les flux de remises.",
    },
    {
      q: "Existe-t-il des réglementations de la CBE concernant les virements entrants importants vers l'Égypte ?",
      a: "Oui. La Banque centrale d'Égypte exige que les virements commerciaux entrants soient documentés par des factures, des contrats ou d'autres pièces justificatives. Les remises personnelles sont généralement traitées sans exigences supplémentaires. L'Égypte n'applique pas de retenue à la source sur les remises personnelles. Les virements importants ou répétés en provenance d'origines inhabituelles peuvent déclencher un examen de conformité supplémentaire par la banque réceptrice.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Égypte ?",
      a: "Les banques égyptiennes facturent généralement des frais de traitement pour les virements entrants, souvent entre EGP 50 et 200 par transaction, selon la banque. La conversion de devises de l'USD ou d'autres devises en EGP inclut un écart supplémentaire. Les Égyptiens expatriés qui envoient de l'argent chez eux devraient comparer le taux de change effectif total (y compris l'écart de conversion et les frais) auprès de plusieurs prestataires, car les taux peuvent varier considérablement.",
    },
  ],

  morocco: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Maroc ?",
      a: "Un code SWIFT (BIC) pour le Maroc est un code de 8 ou 11 caractères identifiant une banque marocaine pour les virements internationaux. La partie code pays est MA. Par exemple, BCMAMAMC est le code SWIFT d'Attijariwafa Bank. La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (MA), 2 pour la ville, et éventuellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques marocaines ?",
      a: "Les principaux codes SWIFT de banques marocaines sont : Attijariwafa Bank — BCMAMAMC, BMCE Bank of Africa — BMCEMAMC, Banque Centrale Populaire / Banque Populaire — BCPOMAMC, BMCI (BNP Paribas Maroc) — BMCIMAMC, CIH Bank — CIHMMAMC, et Société Générale Maroc — SGMBMAMC. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Qu'est-ce que le compte MRE et pourquoi est-il pertinent pour les Marocains résidant à l'étranger ?",
      a: "MRE signifie Marocains Résidant à l'Étranger. Les banques marocaines proposent des produits de compte spécifiques adaptés aux MRE, notamment le CEN (Compte en Devises) et le CNE (Compte en Devises pour Non-Résidents). Ces comptes permettent aux expatriés marocains de recevoir et de conserver des devises étrangères (EUR, USD, GBP) sans conversion immédiate en MAD. La plupart des grandes banques marocaines disposent de services bancaires dédiés aux MRE.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Maroc ?",
      a: "Les virements SWIFT vers le Maroc arrivent généralement en un à trois jours ouvrables. Les virements en provenance de France, d'Espagne, de Belgique et d'Italie — où vivent les plus grandes communautés de la diaspora marocaine — sont habituellement réglés en un à deux jours ouvrables, notamment parce que les principales banques marocaines (en particulier Attijariwafa) y disposent d'agences et de relations de correspondance spécifiquement pour les remises des MRE.",
    },
    {
      q: "Puis-je recevoir des EUR ou des USD directement sur un compte bancaire marocain ?",
      a: "Oui. Les résidents marocains peuvent détenir des devises étrangères sur des comptes CEN (Compte en Devises), sous réserve des réglementations de Bank Al-Maghrib. Le dirham marocain (MAD) n'est pas librement convertible en dehors du Maroc. Les devises étrangères reçues sur un compte MAD standard sont converties au taux acheteur de la banque. La détention d'un compte CEN évite cette conversion automatique et permet au bénéficiaire de convertir à un moment plus favorable.",
    },
    {
      q: "Existe-t-il des réglementations de Bank Al-Maghrib concernant les virements entrants importants ?",
      a: "Oui. Bank Al-Maghrib exige la déclaration des virements importants en devises étrangères à des fins de balance des paiements. Les virements commerciaux nécessitent une documentation telle que des factures ou des contrats. Les remises personnelles de la diaspora marocaine sont activement encouragées par le gouvernement marocain et sont généralement traitées sans difficulté. Le Maroc a progressivement libéralisé ses règles de change, permettant aux résidents de détenir des montants limités en devises étrangères.",
    },
    {
      q: "Quelle est la différence entre recevoir de l'argent par virement bancaire SWIFT et par un agent de transfert de fonds au Maroc ?",
      a: "Les virements bancaires SWIFT conviennent mieux aux montants importants (supérieurs à EUR 500) et sont adaptés aux bénéficiaires disposant de comptes bancaires formels. Les agents de transfert de fonds (Western Union, RIA et opérateurs locaux) proposent le retrait d'espèces dans de nombreux points du Maroc et peuvent être plus rapides et moins coûteux pour les petits montants. De nombreuses familles marocaines dans les zones rurales préfèrent le retrait d'espèces car il ne nécessite pas de compte bancaire.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Maroc ?",
      a: "Les banques marocaines peuvent facturer de petits frais de traitement pour les virements entrants. Le coût principal est l'écart de conversion de devises — la différence entre le taux du marché interbancaire et le taux acheteur de la banque, généralement de 0,5 à 2 %. Attijariwafa Bank et BMCE Bank of Africa disposent de vastes réseaux européens et peuvent proposer des taux plus compétitifs pour les virements en EUR depuis la France ou l'Espagne que les banques marocaines plus petites.",
    },
  ],

  colombia: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour la Colombie ?",
      a: "Un code SWIFT (BIC) pour la Colombie est un code de 8 ou 11 caractères identifiant une banque colombienne pour les virements internationaux. La partie code pays est CO. Par exemple, COABORBB est le code SWIFT de Bancolombia. La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (CO), 2 pour la ville, et éventuellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques colombiennes ?",
      a: "Les principaux codes SWIFT de banques colombiennes sont : Bancolombia — COABORBB, Banco de Bogotá — BBOGCOBB, Davivienda — DAVICOBB, BBVA Colombia — BABOROBB, Scotiabank Colpatria — COLPCOBB, Banco Agrario — BANACOBC, et Citibank Colombia — CITICOBB. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Comment envoyer de l'argent sur un compte bancaire colombien depuis l'étranger ?",
      a: "Pour effectuer un virement international vers la Colombie, vous avez besoin de : le code SWIFT/BIC de la banque du bénéficiaire, le numéro de compte complet du bénéficiaire, le type de compte (épargne/courant), ainsi que le nom complet et le numéro de carte d'identité nationale (cédula) du bénéficiaire. La Colombie n'utilise pas l'IBAN. Certaines banques exigent également l'adresse du bénéficiaire et l'objet du virement. Demandez au bénéficiaire de confirmer tous les détails requis auprès de sa banque.",
    },
    {
      q: "Qu'est-ce qu'ACH Colombia et en quoi diffère-t-il de SWIFT ?",
      a: "ACH Colombia (Asociación Bancaria y de Entidades Financieras) exploite le réseau électronique de paiements interbancaires domestiques en Colombie, gérant les virements en COP entre banques colombiennes. ACH Colombia ne peut pas recevoir de paiements internationaux. SWIFT est destiné aux virements transfrontaliers. Lorsqu'un virement international arrive via SWIFT dans une banque colombienne, la banque crédite le compte du bénéficiaire via ses systèmes internes.",
    },
    {
      q: "Existe-t-il des réglementations de la Banrep ou de la Superfinanciera affectant les virements entrants ?",
      a: "Oui. La réglementation des changes en Colombie exige que tous les virements internationaux entrants transitent par un intermédiaire financier agréé (une banque ou une maison de change autorisée). Les virements supérieurs à 10 000 USD nécessitent un formulaire de déclaration (Declaración de Cambio). L'objet déclaré doit correspondre au type de transaction réel. La banque réceptrice est responsable des déclarations réglementaires, mais le bénéficiaire peut devoir fournir des documents.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la Colombie ?",
      a: "Les virements SWIFT vers la Colombie arrivent généralement en un à trois jours ouvrables. Les virements en provenance des États-Unis et d'Espagne — principaux corridors pour la diaspora colombienne — sont habituellement réglés en un à deux jours ouvrables. Bancolombia, en tant que plus grande banque, dispose des relations de banque correspondante les plus étendues et offre généralement le règlement le plus rapide pour les virements USD entrants.",
    },
    {
      q: "Puis-je recevoir des USD ou des EUR directement sur un compte bancaire colombien ?",
      a: "La réglementation colombienne exige généralement que les devises étrangères soient converties en COP à leur réception sur des comptes standard. Cependant, certaines banques proposent des comptes libellés en USD pour les entreprises qui effectuent régulièrement des transactions en devises étrangères. Pour les particuliers, la procédure standard est la conversion en COP au taux du marché de la banque à la date de règlement. Le COP est librement convertible, ce qui rend cette opération simple.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT en Colombie ?",
      a: "Les banques colombiennes facturent généralement des frais de traitement pour les virements entrants, souvent entre 10 et 25 USD ou un faible pourcentage. La conversion de devises inclut un écart supplémentaire. La Colombie n'applique pas de retenue à la source sur les remises personnelles. Comparer le coût effectif total — y compris l'écart du taux de change et les frais — auprès de plusieurs prestataires est important, car les différences peuvent être significatives pour les virements réguliers.",
    },
  ],

  peru: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Pérou ?",
      a: "Un code SWIFT (BIC) pour le Pérou est un code de 8 ou 11 caractères identifiant une banque péruvienne pour les virements internationaux. La partie code pays est PE. Par exemple, BCPLPEPL est le code SWIFT de la Banco de Crédito del Perú (BCP). La structure est la suivante : 4 caractères pour la banque, 2 pour le pays (PE), 2 pour la ville, et éventuellement 3 pour l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques péruviennes ?",
      a: "Les principaux codes SWIFT de banques péruviennes sont : Banco de Crédito del Perú (BCP) — BCPLPEPL, BBVA Perú — BABORPPL, Interbank — BINPPEPL, Scotiabank Perú — BSUDPEPL, BanBif — BFCAPEPL, Mibanco — MIBAEPPL, et Citibank Perú — CITIPEPL. Confirmez toujours le code exact auprès de la banque du bénéficiaire.",
    },
    {
      q: "Puis-je recevoir des USD directement sur un compte bancaire péruvien ?",
      a: "Oui. C'est l'une des caractéristiques bancaires les plus favorables aux étrangers au Pérou : les particuliers peuvent détenir des comptes en USD (cuentas en dólares) dans des banques péruviennes locales. Les virements USD entrants peuvent être crédités directement sur un compte en dollars sans conversion obligatoire en PEN. Cela permet aux bénéficiaires de conserver des économies en USD au Pérou, de convertir à un moment favorable ou d'effectuer des paiements en USD depuis leur compte.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Pérou ?",
      a: "Les virements SWIFT vers le Pérou arrivent généralement en un à trois jours ouvrables. Les virements en provenance des États-Unis et d'Espagne — principaux corridors pour la diaspora péruvienne — sont habituellement réglés en un à deux jours ouvrables. La BCP, en tant que plus grande banque, dispose du réseau de banque correspondante le plus développé et offre généralement le traitement le plus rapide pour les virements USD entrants.",
    },
    {
      q: "Existe-t-il des réglementations de la SBS ou de la BCRP concernant les virements entrants importants ?",
      a: "Oui. La SBS péruvienne (Superintendencia de Banca, Seguros y AFP) exige que les virements entrants supérieurs à 10 000 USD soient accompagnés d'une documentation sur l'origine des fonds. La banque réceptrice dépose un rapport auprès de l'UIF (Unidad de Inteligencia Financiera del Perú) pour les virements importants ou suspects. Les virements commerciaux nécessitent des factures ou des contrats justificatifs. Le Pérou n'applique pas de retenue à la source sur les remises personnelles.",
    },
    {
      q: "Qu'est-ce que le système CCE et en quoi diffère-t-il de SWIFT ?",
      a: "La CCE (Cámara de Compensación Electrónica) est le système de compensation interbancaire domestique du Pérou, gérant les virements en PEN entre banques péruviennes. Il est totalement distinct de SWIFT et ne peut pas recevoir de paiements internationaux. SWIFT est destiné aux virements transfrontaliers. Lorsqu'un virement international arrive via SWIFT dans une banque péruvienne, la banque crédite le compte du bénéficiaire via ses systèmes internes.",
    },
    {
      q: "Le Pérou prélève-t-il une taxe sur la réception de virements bancaires internationaux ?",
      a: "Le Pérou n'applique pas de retenue à la source sur les remises personnelles entrantes. Les paiements commerciaux peuvent entraîner des obligations fiscales sur le revenu selon la nature de la transaction sous-jacente (paiements de services, dividendes, redevances, etc.), mais le virement lui-même n'est pas taxé au moment de sa réception. La banque réceptrice ne prélève pas d'impôts sur les virements entrants pour les particuliers.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Pérou ?",
      a: "Les banques péruviennes facturent généralement des frais de traitement pour les virements entrants, souvent entre 10 et 20 USD par virement. La conversion de devises en PEN inclut un écart supplémentaire si le bénéficiaire détient un compte standard en PEN. Les comptes en USD étant facilement accessibles, de nombreux bénéficiaires choisissent de recevoir en USD et de convertir au moment qui leur convient, évitant ainsi les coûts immédiats de conversion bancaire.",
    },
  ],

  pakistan: [
    {
      q: "Qu'est-ce qu'un code SWIFT pour le Pakistan ?",
      a: "Un code SWIFT (également appelé code BIC) est un code de 8 ou 11 caractères qui identifie une banque spécifique au Pakistan pour les virements internationaux. Par exemple, HABORPKAXXXX identifie le siège social de Bank Al Habib Limited. Les 4 premiers caractères identifient la banque, les 2 suivants (PK) identifient le Pakistan, les 2 suivants identifient la ville, et les 3 derniers optionnels identifient l'agence.",
    },
    {
      q: "Quels sont les codes SWIFT des principales banques pakistanaises ?",
      a: "Les principaux codes SWIFT sont : HBL (Habib Bank Limited) — HABORPKAXXXX, UBL (United Bank Limited) — UNILPKKAXXXX, MCB Bank — MUCBPKKAXXXX, Allied Bank — ABLOOPKAXXX, Meezan Bank — MEZUPKKAXXXX, Bank Al Habib — HABORPKAXXXX, Standard Chartered Pakistan — SCBLPKKXXXX, Faysal Bank — FABORPKAXXXX, et National Bank of Pakistan — NBPAPKKAXXXX.",
    },
    {
      q: "Comment trouver le code SWIFT de ma banque pakistanaise ?",
      a: "Vous pouvez trouver le code SWIFT de votre banque sur votre relevé bancaire, dans votre application de banque en ligne ou mobile, en contactant directement votre agence, ou en effectuant une recherche sur cette page. Les grandes banques comme HBL, UBL et MCB affichent les codes SWIFT dans leurs portails de banque en ligne. Confirmez toujours le code auprès de votre banque, car les codes du siège et des agences peuvent différer.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir de l'argent de l'étranger au Pakistan ?",
      a: "Oui. Pour recevoir un virement international au Pakistan, l'expéditeur a besoin du code SWIFT/BIC de votre banque ainsi que de votre IBAN (24 caractères commençant par PK). Les deux sont nécessaires : le code SWIFT achemine le paiement vers votre banque, tandis que l'IBAN garantit qu'il parvient à votre compte spécifique.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Pakistan ?",
      a: "Les virements SWIFT vers le Pakistan prennent généralement 1 à 3 jours ouvrables, selon le pays expéditeur, les banques intermédiaires impliquées et si le paiement passe les contrôles de conformité. Les virements en provenance du Royaume-Uni et des États-Unis arrivent généralement en 1 à 2 jours ouvrables. Les virements impliquant plusieurs banques correspondantes ou des devises inhabituelles peuvent prendre plus de temps.",
    },
    {
      q: "Y a-t-il des frais pour recevoir un virement SWIFT au Pakistan ?",
      a: "La plupart des banques pakistanaises facturent des frais de service pour les remises entrantes, généralement entre PKR 200 et 500 par transaction. Cependant, les remises vers le pays natal (virements personnels d'expatriés pakistanais) sont souvent exonérées de ces frais dans le cadre des programmes d'incitation de la SBP. La banque réceptrice convertira également la devise étrangère en PKR au taux de change en vigueur, qui inclut une marge par rapport au taux interbancaire.",
    },
    {
      q: "Y a-t-il une différence entre le code SWIFT et l'IBAN au Pakistan ?",
      a: "Oui. Un code SWIFT identifie une banque (par exemple, MUCBPKKAXXXX pour MCB Bank), tandis qu'un IBAN identifie un compte spécifique dans cette banque (par exemple, PK36SCBL0000001123456702). Pour les virements internationaux vers le Pakistan, l'expéditeur a besoin des deux : le code SWIFT pour acheminer le paiement vers la bonne banque, et l'IBAN pour créditer le bon compte.",
    },
    {
      q: "Puis-je recevoir des USD ou des GBP directement sur mon compte bancaire pakistanais ?",
      a: "Les comptes standard en PKR ne peuvent pas détenir de devises étrangères. Les réglementations de la SBP exigent que toutes les devises étrangères entrantes soient converties en PKR au taux en vigueur de la banque le jour du crédit. Si vous souhaitez détenir des devises étrangères, vous pouvez ouvrir un Compte en Devises Étrangères (FCA) dans votre banque, ce qui vous permet de recevoir et de conserver des USD, GBP, EUR et d'autres devises principales.",
    },
    {
      q: "Les portefeuilles mobiles comme JazzCash et Easypaisa ont-ils des codes SWIFT ?",
      a: "JazzCash (Mobilink Microfinance Bank) et Easypaisa (Telenor Microfinance Bank) sont connectés au réseau SWIFT via leurs banques de microfinance mères. Ils émettent des IBAN et peuvent recevoir des virements internationaux si l'expéditeur dispose du code SWIFT et de l'IBAN corrects. Cependant, pour les virements importants, un compte dans une banque commerciale peut être plus fiable.",
    },
  ],
  },
};
