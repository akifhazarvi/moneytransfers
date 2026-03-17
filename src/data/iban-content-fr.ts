import type { IbanContent } from "./iban-content";

export const ibanContentFr: IbanContent = {
  editorial: {
  denmark: {
    title: "Comment l'IBAN est utilisé au Danemark",
    intro:
      "Le Danemark fait partie de l'espace SEPA, mais conserve de solides habitudes bancaires nationales fondées sur les numéros d'enregistrement et les numéros de compte. Pour les virements locaux, les Danois utilisent souvent leurs coordonnées bancaires nationales, tandis que les virements internationaux entrants nécessitent généralement l'IBAN danois complet.",
    bullets: [
      "Si un expéditeur effectue un paiement depuis un autre pays d'Europe en EUR, l'IBAN danois est généralement l'information clé, même si le bénéficiaire connaît son compte localement par son numéro d'enregistrement et son numéro de compte.",
      "Pour les entreprises recevant des paiements transfrontaliers en DKK, il convient de vérifier si la banque du payeur forcera une conversion de devise avant le règlement ou enverra les fonds directement en couronnes.",
      "Lorsque les utilisateurs ont du mal à trouver les coordonnées de réception correctes, la solution la plus rapide consiste généralement à demander à la banque du bénéficiaire ses instructions exactes de paiement international, plutôt que de se fier aux coordonnées de paiement nationales affichées dans l'application bancaire.",
    ],
  },
  "united-kingdom": {
    title: "Comment fonctionne l'IBAN au Royaume-Uni",
    intro:
      "Le Royaume-Uni a adopté le format IBAN relativement tard par rapport à la majeure partie de l'Europe, et de nombreux titulaires de comptes britanniques sont encore plus familiers avec leur code de tri à six chiffres et leur numéro de compte à huit chiffres. Depuis que le Royaume-Uni a quitté l'UE et l'espace SEPA, les IBAN restent valides pour recevoir des virements internationaux, mais les paiements nationaux transitent par BACS, Faster Payments et CHAPS plutôt que par le réseau SEPA.",
    bullets: [
      "Un IBAN britannique comporte 22 caractères et intègre à la fois le code de tri et le numéro de compte après le code pays GB et deux chiffres de contrôle. Si quelqu'un à l'étranger vous demande votre IBAN, vous pouvez le déduire de votre code de tri et de votre numéro de compte, ou le trouver dans votre portail de banque en ligne.",
      "Comme le Royaume-Uni ne fait plus partie de l'espace SEPA, les paiements en euros provenant de banques de l'UE peuvent être acheminés via SWIFT plutôt que par le système de virement SEPA moins coûteux. Cela peut entraîner des frais plus élevés pour l'expéditeur ; il est donc conseillé de confirmer avec la banque émettrice comment le paiement sera acheminé.",
      "Pour les virements entrants en GBP, assurez-vous que l'expéditeur dispose à la fois de votre IBAN et du code SWIFT/BIC de votre banque. Certaines banques non britanniques rejetteront le paiement si seul l'IBAN est fourni, notamment pour les virements de grande valeur éligibles au CHAPS.",
    ],
  },
  germany: {
    title: "Comment l'IBAN est utilisé en Allemagne",
    intro:
      "L'Allemagne a été l'un des premiers pays à adopter la norme IBAN, et la transition depuis l'ancien système Bankleitzahl (BLZ) et Kontonummer est désormais achevée. Le BLZ à huit chiffres s'intègre directement dans la partie BBAN d'un IBAN allemand, ce qui simplifie la conversion. En tant que membre central de l'espace SEPA, pratiquement tous les virements en euros, nationaux et internationaux, en Allemagne utilisent exclusivement l'IBAN.",
    bullets: [
      "Un IBAN allemand comporte 22 caractères : le code pays DE, deux chiffres de contrôle, le BLZ à huit chiffres (code de routage bancaire) et un numéro de compte à dix chiffres. Si votre numéro de compte comporte moins de dix chiffres, il est complété par des zéros en tête.",
      "Pour les virements au sein de la zone SEPA, seul l'IBAN est nécessaire. Cependant, lors d'envois ou de réceptions depuis l'extérieur de la zone SEPA, les banques allemandes demandent souvent également le code BIC/SWIFT. Les grandes banques comme Deutsche Bank, Commerzbank et les Sparkassen ont chacune des plages de BLZ distinctes facilement consultables.",
      "Les prélèvements automatiques (Lastschrift) et les virements permanents en Allemagne reposent tous sur l'IBAN. Si vous mettez en place un mandat de prélèvement SEPA pour un abonnement ou un service public, vous devrez fournir votre IBAN et autoriser le créancier au moyen d'un mandat signé.",
    ],
  },
  france: {
    title: "Comment l'IBAN est utilisé en France",
    intro:
      "La France a effectué une transition en douceur vers l'IBAN, car la structure existante du RIB (Relevé d'Identité Bancaire) s'intègre parfaitement dans le format IBAN. Le RIB contient un code banque, un code guichet, un numéro de compte et une clé RIB à deux chiffres, qui s'insèrent tous directement dans l'IBAN français à 27 caractères. Les virements SEPA utilisant l'IBAN constituent la norme tant pour les paiements en euros nationaux que transfrontaliers.",
    bullets: [
      "Un IBAN français comporte 27 caractères, commençant par FR, deux chiffres de contrôle, puis le code banque à cinq chiffres, le code guichet à cinq chiffres, le numéro de compte à onze caractères et la clé nationale de contrôle à deux chiffres. Si vous disposez d'un RIB de votre banque, la conversion en IBAN est directe.",
      "Toutes les grandes banques françaises — BNP Paribas, Société Générale, Crédit Agricole et La Banque Postale — affichent l'IBAN en bonne place dans leurs espaces de banque en ligne. Pour les virements internationaux entrants, seul l'IBAN suffit pour les paiements SEPA, bien que les expéditeurs hors SEPA aient également besoin du BIC.",
      "Lors de la mise en place d'un prélèvement pour des services publics, un loyer ou des abonnements français, il vous sera demandé de remplir un formulaire de mandat SEPA avec votre IBAN. Veillez à ce que l'IBAN soit exact, car des chiffres incorrects entraîneront le rejet du mandat par votre banque.",
    ],
  },
  netherlands: {
    title: "Comment l'IBAN est utilisé aux Pays-Bas",
    intro:
      "Les Pays-Bas ont été l'un des premiers pays à rendre l'IBAN obligatoire pour tous les virements bancaires, et le système bancaire national fonctionne désormais entièrement sur la base du routage par IBAN. L'ancien format de numéro de compte néerlandais a été entièrement abandonné. Avec trois banques dominantes — ABN AMRO, ING et Rabobank — couvrant la grande majorité des comptes personnels et professionnels, la structure de l'IBAN néerlandais est cohérente et bien standardisée.",
    bullets: [
      "Un IBAN néerlandais comporte 18 caractères : NL, deux chiffres de contrôle, un code banque à quatre lettres (comme ABNA, INGB ou RABO) et un numéro de compte à dix chiffres. Le code banque court permet d'identifier facilement l'établissement détenteur du compte.",
      "Tous les virements nationaux entre banques néerlandaises utilisent l'IBAN — aucun format hérité n'est encore en vigueur. Si vous payez une facture néerlandaise ou recevez un salaire aux Pays-Bas, l'IBAN figurant sur la facture ou le bulletin de salaire est tout ce dont vous avez besoin.",
      "Pour les virements internationaux entrants en provenance de l'extérieur de la zone SEPA, les expéditeurs doivent inclure à la fois l'IBAN et le code BIC/SWIFT de la banque néerlandaise destinataire. Au sein de la zone SEPA, seul l'IBAN suffit et les virements sont généralement réglés en un jour ouvrable.",
    ],
  },
  spain: {
    title: "Comment l'IBAN est utilisé en Espagne",
    intro:
      "L'Espagne utilise un IBAN à 24 caractères qui intègre l'ancienne structure CCC (Código Cuenta Cliente). Le CCC comprend un code banque à quatre chiffres, un code agence à quatre chiffres, deux chiffres de contrôle et un numéro de compte à dix chiffres, qui s'intègrent tous directement dans l'IBAN. En tant que membre de l'espace SEPA, l'Espagne traite la grande majorité des virements en euros via le réseau SEPA.",
    bullets: [
      "Un IBAN espagnol commence par ES, suivi de deux chiffres de contrôle puis du CCC à 20 chiffres. Si vous disposez de votre ancien numéro CCC figurant sur un relevé bancaire, sa conversion en IBAN consiste simplement à ajouter le préfixe ES et à calculer les chiffres de contrôle. Les grandes banques comme le Santander, BBVA et CaixaBank affichent toutes les IBAN sur leurs portails en ligne.",
      "Pour recevoir de l'argent de l'étranger, votre IBAN espagnol est la coordonnée principale à communiquer. Au sein de la zone SEPA, l'expéditeur n'a besoin que de l'IBAN. Pour les paiements en provenance de l'extérieur de l'Europe, l'expéditeur aura également besoin du code BIC de votre banque espagnole.",
      "L'Espagne dispose d'un solide réseau de caisses d'épargne locales (cajas) aux côtés des grandes banques commerciales, chacune ayant son propre code banque au sein de la structure IBAN. Lorsque vous fournissez votre IBAN pour des paiements de salaire ou des paiements gouvernementaux, vérifiez les codes banque et agence pour éviter les virements mal acheminés.",
    ],
  },
  italy: {
    title: "Comment l'IBAN est utilisé en Italie",
    intro:
      "L'Italie utilise un IBAN à 27 caractères qui intègre les codes bancaires italiens traditionnels : un CIN (Numéro de Contrôle Interne) à un caractère, un code banque ABI (Associazione Bancaria Italiana) à cinq chiffres, un code agence CAB (Codice di Avviamento Bancario) à cinq chiffres et un numéro de compte à douze caractères. L'Italie est membre fondateur de l'espace SEPA, et les virements basés sur l'IBAN constituent la norme pour toutes les opérations bancaires.",
    bullets: [
      "Un IBAN italien commence par IT, deux chiffres de contrôle, puis le CIN, l'ABI, le CAB et le numéro de compte. Le CIN est un caractère unique utilisé pour la validation nationale. Les grandes banques comme UniCredit, Intesa Sanpaolo et Banco BPM affichent votre IBAN complet dans leur espace de banque en ligne et sur les relevés.",
      "Pour recevoir des virements internationaux en Italie, vous devez fournir à la fois votre IBAN et le BIC à l'expéditeur, notamment si le paiement provient de l'extérieur de la zone SEPA. Au sein de la zone SEPA, seul l'IBAN suffit et les virements en euros arrivent généralement en un jour ouvrable.",
      "Lors de l'ouverture d'un nouveau compte bancaire italien ou conto corrente, votre IBAN est généré automatiquement et figurera sur votre contrat et vos documents de bienvenue. Pour les tâches courantes telles que le paiement des impôts italiens (F24), la mise en place de prélèvements automatiques pour les services publics ou la réception de votre stipendio (salaire), l'IBAN est la seule référence de compte dont vous avez besoin.",
    ],
  },
  belgium: {
    title: "Comment l'IBAN est utilisé en Belgique",
    intro:
      "La Belgique utilise un IBAN à 16 caractères, l'un des formats les plus courts d'Europe, qui intègre directement l'ancien numéro de compte bancaire belge. La transition vers l'IBAN a été aisée, car l'ancien numéro de compte à douze chiffres s'insère dans la partie BBAN avec une modification minimale. En tant que membre central de l'espace SEPA et siège de plusieurs institutions de l'UE, la Belgique traite chaque jour un volume élevé de virements en euros transfrontaliers.",
    bullets: [
      "Un IBAN belge commence par BE, deux chiffres de contrôle, puis un BBAN à douze chiffres comprenant un code banque à trois chiffres, un numéro de compte à sept chiffres et deux chiffres de contrôle nationaux. La structure compacte facilite la vérification visuelle des IBAN belges.",
      "Les grandes banques belges — KBC, BNP Paribas Fortis, ING Belgique et Belfius — affichent toutes l'IBAN en bonne place dans leurs applications et portails en ligne. Pour les virements SEPA, seul l'IBAN est requis. Les expéditeurs hors SEPA doivent également inclure le code SWIFT/BIC de la banque.",
      "La Belgique présente un taux d'adoption élevé des prélèvements automatiques SEPA pour les factures de services publics, les primes d'assurance et les services par abonnement. Lors de la mise en place d'une domiciliering (prélèvement automatique), vous devrez fournir votre IBAN et signer un mandat SEPA, que votre banque conserve électroniquement.",
    ],
  },
  austria: {
    title: "Comment l'IBAN est utilisé en Autriche",
    intro:
      "L'Autriche utilise un IBAN à 20 caractères qui intègre le Bankleitzahl (BLZ) autrichien à cinq chiffres et un numéro de compte à onze chiffres. La structure est claire et bien standardisée dans toutes les banques autrichiennes. En tant que membre de l'espace SEPA au sein de la zone euro, l'Autriche gère les virements en euros, tant nationaux que transfrontaliers, exclusivement via le système IBAN.",
    bullets: [
      "Un IBAN autrichien commence par AT, deux chiffres de contrôle, puis un code banque à cinq chiffres (BLZ) et un numéro de compte à onze chiffres. Erste Bank, Raiffeisen, Bank Austria (UniCredit) et BAWAG ont chacune des plages de BLZ distinctes. Votre IBAN est affiché dans votre espace de banque en ligne et sur vos relevés bancaires.",
      "Au sein de la zone SEPA, seul l'IBAN autrichien est nécessaire pour les virements en euros — aucun BIC n'est requis. Pour les paiements en provenance de l'extérieur de l'Europe, comme des États-Unis ou d'Asie, l'expéditeur doit inclure à la fois l'IBAN et le code SWIFT/BIC de votre banque pour garantir un bon acheminement.",
      "Les employeurs, propriétaires et agences gouvernementales autrichiens utilisent tous l'IBAN pour les paiements de salaires, l'encaissement des loyers et le versement des prestations. Si vous vous installez en Autriche, l'une des premières démarches à effectuer est d'ouvrir un compte bancaire local — votre nouvel IBAN sera la clé pour recevoir tous vos paiements réguliers.",
    ],
  },
  ireland: {
    title: "Comment l'IBAN est utilisé en Irlande",
    intro:
      "L'Irlande utilise un IBAN à 22 caractères qui intègre le Code de Tri National (NSC) à six chiffres et le numéro de compte à huit chiffres de l'ancien système national. L'Irlande étant membre à la fois de l'UE et de la zone euro, les virements SEPA utilisant l'IBAN constituent le principal mode de paiement en euros, tant national que transfrontalier. Le paysage bancaire irlandais est relativement concentré, avec AIB, Bank of Ireland et Permanent TSB comme principales banques de détail.",
    bullets: [
      "Un IBAN irlandais commence par IE, deux chiffres de contrôle, un code banque à quatre caractères (comme AIBK ou BOFI), un code de tri d'agence à six chiffres et un numéro de compte à huit chiffres. Si vous connaissez votre NSC et votre numéro de compte, votre banque peut vous fournir l'IBAN complet, ou vous pouvez le trouver dans les paramètres de votre espace de banque en ligne.",
      "Pour recevoir des virements internationaux en euros au sein de la zone SEPA, seul l'IBAN est nécessaire. Les paiements en provenance de l'extérieur de la zone SEPA, par exemple des États-Unis ou du Royaume-Uni, nécessitent à la fois l'IBAN et le code BIC/SWIFT de la banque. Depuis le Brexit, les virements en provenance de banques britanniques ne transitent plus par la zone SEPA et peuvent entraîner des frais plus élevés.",
      "L'Irlande a connu une croissance significative de la banque en ligne, avec des services comme Revolut et N26 largement utilisés aux côtés des banques traditionnelles. Quel que soit le prestataire que vous utilisez, votre IBAN irlandais (commençant par IE) fonctionne de manière identique pour recevoir des paiements SEPA et mettre en place des prélèvements automatiques pour les factures et abonnements.",
    ],
  },
  portugal: {
    title: "Comment l'IBAN est utilisé au Portugal",
    intro:
      "Le Portugal utilise un IBAN à 25 caractères qui correspond directement à l'ancien NIB (Número de Identificação Bancária), qui était la référence de compte nationale standard. Le NIB comprend un code banque à quatre chiffres, un code agence à quatre chiffres, un numéro de compte à onze chiffres et deux chiffres de contrôle, tous intégrés dans l'IBAN portugais. En tant que membre de la zone euro et de l'espace SEPA, le Portugal s'appuie sur les IBAN pour tous les virements bancaires.",
    bullets: [
      "Un IBAN portugais commence par PT, deux chiffres de contrôle, puis le NIB à 21 chiffres. Si vous disposez d'un ancien NIB figurant sur un relevé bancaire, sa conversion en IBAN est simple. Les grandes banques comme la Caixa Geral de Depósitos (CGD), Millennium BCP, Novo Banco et Santander Totta affichent toutes l'IBAN dans leurs applications et sur leurs relevés.",
      "Au sein de la zone SEPA, seul l'IBAN est requis pour les virements en euros. Le Portugal utilise également largement le réseau Multibanco pour les paiements nationaux, mais pour les virements internationaux, l'IBAN est toujours la bonne référence à communiquer aux expéditeurs à l'étranger.",
      "Les employeurs portugais et les organismes gouvernementaux (tels que la Segurança Social pour les prestations sociales) exigent votre IBAN pour les dépôts de salaires et les versements de prestations. Si vous vous installez au Portugal ou percevez des revenus locatifs d'un bien portugais, veillez à communiquer votre IBAN préfixé PT à tous les payeurs.",
    ],
  },
  switzerland: {
    title: "Comment l'IBAN est utilisé en Suisse",
    intro:
      "La Suisse utilise un IBAN à 21 caractères et occupe une position unique dans le paysage des paiements européens. Bien que la Suisse ne soit pas membre de l'UE, elle participe à l'espace SEPA pour les virements libellés en euros, tandis que les paiements nationaux en CHF transitent par le système SIC suisse (Swiss Interbank Clearing) plutôt que par le réseau SEPA. Cette configuration double signifie que votre IBAN suisse fonctionne aussi bien pour les paiements nationaux en CHF que pour les virements entrants en euros depuis la zone SEPA.",
    bullets: [
      "Un IBAN suisse commence par CH, deux chiffres de contrôle, un numéro de compensation bancaire à cinq chiffres et un numéro de compte à douze chiffres. Les grandes banques comme UBS, Credit Suisse (désormais intégré à UBS), Raiffeisen Switzerland et les banques cantonales (Kantonalbanken) ont chacune des plages de numéros de compensation distinctes.",
      "Pour recevoir des euros depuis des pays de l'UE, votre IBAN suisse est accepté au sein du réseau SEPA et ces virements bénéficient généralement des tarifs SEPA. En revanche, pour les virements en CHF depuis l'étranger, le paiement est acheminé via SWIFT et peut entraîner des frais de banque correspondante. Confirmez toujours avec l'expéditeur s'il envoie en EUR ou en CHF.",
      "Les QR-factures suisses, qui ont remplacé les anciens bulletins de versement, intègrent directement l'IBAN du créancier dans le code QR. Si vous payez des factures en Suisse, votre application bancaire lit le code QR et renseigne l'IBAN automatiquement. Pour les virements entrants, fournissez votre IBAN ainsi que le BIC de la banque, notamment pour les expéditeurs hors SEPA.",
    ],
  },
  sweden: {
    title: "Comment l'IBAN est utilisé en Suède",
    intro:
      "La Suède utilise un IBAN à 24 caractères, mais le système bancaire national s'est historiquement appuyé sur les numéros de compensation et le système Bankgiro pour les paiements. La transition vers l'IBAN pour les virements internationaux est achevée, bien que de nombreux Suédois utilisent encore les numéros Bankgiro pour les factures nationales et Swish pour les paiements entre particuliers. En tant que membre de l'UE et de l'espace SEPA, la Suède prend en charge les virements en euros basés sur l'IBAN aux côtés de son infrastructure nationale en SEK.",
    bullets: [
      "Un IBAN suédois commence par SE, deux chiffres de contrôle, un code banque à trois chiffres et une référence de compte à dix-sept chiffres incluant le numéro de compensation. La correspondance entre le numéro de compensation national et l'IBAN peut varier selon les banques — Swedbank, SEB, Handelsbanken et Nordea ont chacune leurs propres conventions. Utilisez les outils en ligne de votre banque pour confirmer votre IBAN exact.",
      "Pour recevoir des virements internationaux en SEK, l'expéditeur a besoin de votre IBAN et du code BIC/SWIFT de votre banque. Pour les virements en euros depuis la zone SEPA, seul l'IBAN suffit. Notez que la Suède utilise la couronne (SEK) ; les paiements SEPA en euros seront donc convertis en SEK par votre banque à son taux de change.",
      "Le système Bankgiro suédois reste largement utilisé pour les paiements de factures nationales, mais il est distinct du système IBAN. Si quelqu'un à l'étranger souhaite vous payer, fournissez toujours votre IBAN plutôt qu'un numéro Bankgiro, qui n'est pas reconnu en dehors de la Suède.",
    ],
  },
  poland: {
    title: "Comment l'IBAN est utilisé en Pologne",
    intro:
      "La Pologne utilise un IBAN à 28 caractères, l'un des formats les plus longs d'Europe, construit à partir de la norme nationale NRB (Numer Rachunku Bankowego). Le NRB contient une somme de contrôle à deux chiffres, un code de tri bancaire à huit chiffres et un numéro de compte à seize chiffres. Depuis l'adhésion de la Pologne à l'UE, elle est membre à part entière de l'espace SEPA, et les IBAN sont utilisés pour tous les virements en euros transfrontaliers, même si la monnaie nationale est le zloty (PLN).",
    bullets: [
      "Un IBAN polonais commence par PL, deux chiffres de contrôle, puis le NRB à 24 chiffres. Les grandes banques comme PKO Bank Polski (PKO BP), mBank, ING Bank Śląski, Bank Pekao et Santander Bank Polska fournissent toutes des IBAN sur leurs plateformes de banque en ligne. Si vous disposez de votre NRB, ajoutez simplement PL et les chiffres de contrôle de l'IBAN.",
      "Pour recevoir des virements en euros depuis la zone SEPA, seul l'IBAN polonais est nécessaire. En revanche, si quelqu'un envoie des PLN depuis l'étranger, le virement transite par SWIFT et l'expéditeur aura besoin de votre IBAN ainsi que du code BIC de votre banque. Sachez que certaines banques polonaises maintiennent des numéros de compte distincts en EUR et en PLN, chacun avec son propre IBAN.",
      "Les systèmes Elixir et Express Elixir en Pologne gèrent les virements nationaux en PLN, mais restent invisibles pour l'utilisateur final — il vous suffit de fournir votre IBAN. Pour les envois de fonds entrants en provenance de pays comme le Royaume-Uni ou les États-Unis, assurez-vous que l'expéditeur précise la bonne devise afin d'éviter des frais de conversion inutiles à la banque destinataire.",
    ],
  },
  pakistan: {
    title: "Comment l'IBAN est utilisé au Pakistan",
    intro:
      "Le Pakistan a adopté le système IBAN en décembre 2012, lorsque la Banque d'État du Pakistan (SBP) a imposé à toutes les banques de migrer des anciens numéros de compte vers le format IBAN à 24 caractères. La transition a été achevée en juillet 2013, et aujourd'hui chaque compte bancaire en PKR au Pakistan possède un IBAN correspondant. Le Pakistan ne fait pas partie de l'espace SEPA ; tous les virements internationaux vers le Pakistan sont acheminés via le réseau SWIFT plutôt que par le système de paiement SEPA utilisé en Europe.",
    bullets: [
      "Un IBAN pakistanais comporte exactement 24 caractères : le code pays PK, deux chiffres de contrôle, un code banque alphanumérique à 4 caractères et un numéro de compte à 16 chiffres. Par exemple, dans PK36SCBL0000001123456702, SCBL est le code banque de Standard Chartered Bank Pakistan. Le code banque à 4 caractères est attribué par la SBP et identifie de manière unique chaque banque — MUCB pour MCB Bank, HABB pour Bank Al Habib, UNIL pour United Bank Limited (UBL) et ALFH pour Allied Bank (ABL).",
      "Le Pakistan compte plus de 30 banques commerciales et 5 banques spécialisées connectées au système IBAN, dont des banques islamiques comme Meezan Bank (MEZU) et BankIslami (BKIP). Les institutions de microfinance telles que JazzCash (Mobilink Microfinance Bank) et Easypaisa (Telenor Microfinance Bank) émettent également des IBAN, ce qui signifie que les comptes de portefeuilles mobiles peuvent recevoir des virements internationaux si l'expéditeur dispose de l'IBAN correct.",
      "Lors d'un envoi d'argent au Pakistan, le bénéficiaire doit fournir son IBAN complet à 24 caractères ainsi que le code SWIFT/BIC de la banque. Les réglementations de la SBP exigent que toutes les remises entrantes en devises étrangères soient converties en PKR au taux en vigueur de la banque à la date du crédit. Les envois de fonds vers le Pakistan sont exonérés de la retenue à la source et de l'impôt sur le revenu dans le cadre des programmes d'incitation de la SBP, ce qui fait des virements bancaires basés sur l'IBAN un moyen fiscalement efficace de recevoir de l'argent de l'étranger.",
    ],
  },
  norway: {
    title: "Comment l'IBAN est utilisé en Norvège",
    intro:
      "La Norvège utilise un IBAN à 15 caractères, l'un des plus courts d'Europe, qui intègre directement le numéro de compte bancaire norvégien à onze chiffres. Bien que la Norvège ne soit pas membre de l'UE, elle fait partie de l'EEE (Espace Économique Européen) et participe à l'espace SEPA pour les paiements en euros. Les virements nationaux en NOK transitent par le système norvégien NICS (Norwegian Interbank Clearing System), mais les virements internationaux s'appuient sur l'IBAN et le réseau SWIFT.",
    bullets: [
      "Un IBAN norvégien commence par NO, deux chiffres de contrôle, puis le numéro de compte national à onze chiffres (numéro d'enregistrement bancaire à quatre chiffres, numéro de compte à six chiffres et un chiffre de contrôle). DNB, Nordea Norway, SpareBank 1 et Handelsbanken comptent parmi les plus grandes banques. Le format court rend les IBAN norvégiens faciles à communiquer et à vérifier.",
      "Pour les paiements en euros depuis des pays SEPA, votre IBAN norvégien suffit. Pour les virements en NOK depuis l'extérieur de la Norvège, les expéditeurs ont besoin à la fois de l'IBAN et du code BIC/SWIFT. La Norvège utilisant la couronne (NOK), les paiements SEPA entrants en euros seront convertis par votre banque — comparez le taux de conversion proposé par votre banque avec ceux des prestataires spécialisés afin d'éviter de perdre de la valeur.",
      "Le système de paiement mobile Vipps en Norvège domine les paiements entre particuliers au niveau national, mais n'est pas utilisé pour les virements internationaux. Lorsque vous recevez de l'argent de l'étranger — qu'il s'agisse d'un salaire, d'une pension ou d'une remise de fonds — communiquez toujours votre IBAN préfixé NO ainsi que le BIC de la banque pour garantir un acheminement correct du paiement.",
    ],
  },
  turkey: {
    title: "Comment l'IBAN est utilisé en Turquie",
    intro:
      "La Turquie a adopté la norme IBAN en 2010 sous la réglementation de l'Agence de Régulation et de Supervision Bancaire (BDDK) et de la Banque Centrale de la République de Turquie (TCMB). Chaque compte bancaire turc possède un IBAN à 26 caractères préfixé TR, et c'est le format requis pour tous les virements internationaux vers la Turquie. La Turquie ne fait pas partie de l'espace SEPA ; les paiements transfrontaliers sont traités via le réseau SWIFT en TRY ou en devises étrangères.",
    bullets: [
      "Un IBAN turc comporte 26 caractères : le code pays TR, deux chiffres de contrôle, un code banque à cinq chiffres, un chiffre zéro réservé et un numéro de compte à 16 chiffres. Les grandes banques — Garanti BBVA (code banque 00062), İş Bankası (00064), Akbank (00046) et Yapı Kredi (00067) — ont chacune des codes banque distincts intégrés dans l'IBAN.",
      "Le système de virement interbancaire national de la Turquie est l'EFT (Elektronik Fon Transferi) pour les virements de grande valeur le jour même et FAST (Fonların Anlık ve Sürekli Transferi) pour les paiements de détail instantanés. Les deux systèmes utilisent l'IBAN en interne, mais pour recevoir de l'argent de l'étranger, vous avez toujours besoin de l'IBAN TR complet à 26 caractères et du code SWIFT/BIC de votre banque.",
      "Lors de la réception de virements internationaux en Turquie, les fonds peuvent arriver dans la devise étrangère d'origine ou être convertis en TRY par la banque destinataire. Les contrôles des changes en Turquie exigent que certaines entrées de devises étrangères dépassant des seuils définis soient déclarées à la TCMB. Si vous recevez un virement de grande valeur, confirmez avec votre banque si une obligation de déclaration ou de conversion s'applique.",
    ],
  },
  romania: {
    title: "Comment l'IBAN est utilisé en Roumanie",
    intro:
      "La Roumanie utilise un IBAN à 24 caractères et est membre à part entière de l'espace SEPA, permettant des virements en euros à faible coût vers et depuis d'autres pays SEPA. La Banque Nationale de Roumanie (BNR) supervise la norme IBAN ainsi que les systèmes de paiement nationaux SENT (compensation électronique) et ReGIS (SLBTR). Bien que la monnaie de la Roumanie soit le leu (RON), l'IBAN fonctionne également pour les comptes en RON et en EUR détenus auprès de banques roumaines.",
    bullets: [
      "Un IBAN roumain commence par RO, deux chiffres de contrôle, un code banque alphanumérique à quatre caractères (comme RNCB pour BCR, BRDE pour BRD, INGB pour ING Roumanie et BTRL pour Banca Transilvania) et un numéro de compte à 16 caractères. L'identifiant bancaire à quatre lettres facilite l'identification de l'établissement détenteur du compte.",
      "En tant que membre de l'espace SEPA, la Roumanie participe au Virement SEPA (SCT) et au Virement SEPA Instantané (SCT Inst), ce qui signifie que les paiements en euros depuis les pays de la zone euro sont rapides et peu coûteux. En revanche, les virements en RON depuis l'extérieur de la Roumanie sont traités via SWIFT et peuvent entraîner des frais de banque correspondante.",
      "Les Roumains vivant à l'étranger envoient fréquemment des fonds dans leur pays via des services de transfert spécialisés. Pour diriger un virement vers un compte bancaire roumain, fournissez toujours l'IBAN RO complet à 24 caractères. Pour les paiements libellés en RON, confirmez si le prestataire émetteur prend en charge la livraison directe en RON ou s'il achemine via EUR avec une conversion au taux de référence de la BNR.",
    ],
  },
  czechia: {
    title: "Comment l'IBAN est utilisé en Tchéquie",
    intro:
      "La Tchéquie utilise un IBAN à 24 caractères et est membre de l'espace SEPA, bien que la monnaie nationale reste la couronne tchèque (CZK). La Banque Nationale Tchèque (CNB) supervise le système de paiement, et les IBAN sont utilisés en parallèle avec l'ancien format de compte national composé d'un préfixe, d'un numéro de compte et d'un code banque. L'IBAN tchèque est généré en encodant le code banque national à quatre chiffres et la combinaison du préfixe de compte et du numéro de compte dans le BBAN.",
    bullets: [
      "Un IBAN tchèque commence par CZ, deux chiffres de contrôle, un code banque à quatre chiffres, un préfixe de compte à six chiffres (avec zéros de remplissage) et un numéro de compte à dix chiffres. Les banques comme CSOB (code banque 0300), Komerční banka (0100) et Česká spořitelna (0800) sont identifiées par leurs codes banque. Si vous connaissez votre numéro de compte tchèque national au format préfixe-numéro/codebanque, vous pouvez dériver l'IBAN à l'aide du convertisseur officiel de la CNB.",
      "Pour recevoir des virements en euros depuis des pays SEPA, seul votre IBAN tchèque suffit. Pour les virements en CZK depuis l'étranger, les expéditeurs ont besoin à la fois de l'IBAN et du code SWIFT/BIC. Les banques tchèques telles qu'Air Bank, Moneta et Raiffeisenbank Czech utilisent également les IBAN pour tous les types de comptes, y compris les comptes d'épargne et les comptes professionnels.",
      "Les employeurs tchèques et les organismes gouvernementaux recourent de plus en plus à l'IBAN pour les paiements de salaires et de prestations, bien que l'ancien format national (préfixe-numéro/code banque) soit encore largement compris localement. Lorsque vous communiquez vos coordonnées bancaires à l'international, utilisez toujours l'IBAN CZ complet plutôt que le format national pour éviter les virements mal acheminés.",
    ],
  },
  hungary: {
    title: "Comment l'IBAN est utilisé en Hongrie",
    intro:
      "La Hongrie utilise un IBAN à 28 caractères — l'un des plus longs d'Europe — reflétant le format de numéro de compte Giro national à 24 chiffres du pays. La Hongrie est membre de l'espace SEPA, bien qu'elle conserve sa propre monnaie, le forint (HUF). La Magyar Nemzeti Bank (MNB) régit les systèmes de paiement, et les IBAN sont obligatoires pour tous les virements transfrontaliers. Les virements nationaux en HUF transitent par le système de compensation GIRO.",
    bullets: [
      "Un IBAN hongrois commence par HU, deux chiffres de contrôle, puis le numéro de compte national à 24 chiffres dans son intégralité. Ce numéro national intègre un code banque à trois chiffres, un code agence à quatre chiffres, un chiffre de contrôle, un numéro de compte à 15 chiffres et un chiffre de contrôle final. Les principales banques comprennent OTP Bank (code banque 117), K&H Bank (103), Erste Bank Hungary (116) et MKB Bank (108).",
      "La Hongrie étant membre de l'espace SEPA mais hors zone euro, les virements en euros depuis les pays de l'UE sont traités à faible coût via le SCT, mais les virements en HUF depuis l'étranger transitent par SWIFT. Si vous avez besoin de recevoir des HUF, l'expéditeur doit préciser HUF comme devise ; sinon, de nombreuses banques utiliseront l'EUR par défaut et déclencheront une conversion.",
      "Le système de Paiement Instantané (AFR — Azonnali Fizetési Rendszer) hongrois, lancé en 2020, permet des virements instantanés en HUF au niveau national en utilisant l'IBAN. Si vous êtes client d'OTP, Raiffeisen Hungary ou de toute grande banque hongroise, vous pouvez recevoir des crédits instantanés en HUF 24h/24, 7j/7, à condition que l'expéditeur utilise votre IBAN HU complet à 28 caractères.",
    ],
  },
  croatia: {
    title: "Comment l'IBAN est utilisé en Croatie",
    intro:
      "La Croatie a adopté l'euro et rejoint la zone euro en janvier 2023, remplaçant la kuna par l'EUR et devenant automatiquement membre à part entière de l'espace SEPA. Les banques croates opèrent désormais principalement en EUR, et l'IBAN à 21 caractères est la norme pour tous les virements en euros, tant nationaux que transfrontaliers. La Banque Nationale de Croatie (HNB) supervise l'infrastructure des paiements, et le système de compensation NKS a été entièrement migré vers les normes SEPA lors de l'entrée dans la zone euro.",
    bullets: [
      "Un IBAN croate comporte 21 caractères : le code pays HR, deux chiffres de contrôle, un code banque à sept chiffres (qui comprend l'identifiant bancaire à trois chiffres et le code agence à quatre chiffres) et un numéro de compte à dix chiffres. Les principales banques comprennent Zagrebačka banka (ZABA, faisant partie d'UniCredit), Privredna banka Zagreb (PBZ, faisant partie d'Intesa Sanpaolo) et Erste Bank Croatia.",
      "Depuis l'adhésion de la Croatie à la zone euro en 2023, tous les virements en EUR nationaux sont traités via le système de Virement SEPA Instantané (SCT Inst), avec règlement en quelques secondes. Cela a remplacé l'ancien système HSVP RTGS pour la plupart des paiements de détail. Lors d'un envoi d'argent vers la Croatie depuis l'UE, l'IBAN HR est tout ce que le bénéficiaire doit communiquer.",
      "Les résidents croates qui détenaient auparavant des comptes en kunas ont vu leurs numéros de compte redenominés en EUR au taux de conversion fixe de 7,53450 HRK par EUR. Le format de l'IBAN lui-même n'a pas changé — seul le libellé de devise du compte a été modifié. Si vous effectuez un paiement vers la Croatie, précisez EUR et utilisez l'IBAN HR à 21 caractères du bénéficiaire.",
    ],
  },
  finland: {
    title: "Comment l'IBAN est utilisé en Finlande",
    intro:
      "La Finlande utilise un IBAN à 18 caractères, l'un des formats les plus courts d'Europe, qui correspond directement à l'ancien numéro de compte bancaire finlandais. La Finlande est membre de la zone euro et de l'espace SEPA, et les virements basés sur l'IBAN constituent la seule norme pour les paiements en euros, tant nationaux que transfrontaliers, depuis l'achèvement de la migration SEPA. La Banque de Finlande (Suomen Pankki) supervise la stabilité des paiements, le secteur bancaire commercial étant dominé par Nordea, OP Financial Group et Danske Bank Finland.",
    bullets: [
      "Un IBAN finlandais commence par FI, deux chiffres de contrôle, un code d'agence bancaire à six chiffres et un numéro de compte à huit chiffres avec un chiffre de contrôle final. Le code d'agence à six chiffres identifie à la fois la banque et l'agence. Les IBAN de Nordea commencent généralement par FI12, les comptes d'OP Financial Group par FI50-FI58 et Danske Bank Finland par FI34. Toutes les banques finlandaises affichent l'IBAN dans leur espace de banque en ligne et mobile.",
      "Au sein de la zone SEPA, seul l'IBAN finlandais suffit pour les virements en euros — aucun BIC n'est requis pour les virements de crédit au sein de l'UE et de l'EEE. La Finlande exploite également le système de paiement instantané national Siirto, qui utilise l'IBAN comme identifiant de compte sous-jacent pour les paiements en EUR en temps réel entre les banques finlandaises.",
      "Les employeurs finlandais, l'institution d'assurance sociale Kela et l'Administration fiscale finlandaise utilisent tous l'IBAN pour les versements de salaires, de prestations et de remboursements. Si vous vous installez en Finlande ou recevez des pensions finlandaises de l'étranger, enregistrez votre IBAN préfixé FI auprès de l'autorité compétente dès l'ouverture de votre compte.",
    ],
  },
  greece: {
    title: "Comment l'IBAN est utilisé en Grèce",
    intro:
      "La Grèce utilise un IBAN à 27 caractères et est membre fondateur de la zone euro et de l'espace SEPA. La Banque de Grèce (Trapeza tis Ellados) régule le système de paiement, et tous les comptes bancaires en Grèce sont libellés en euros. Les IBAN grecs sont utilisés aussi bien pour la compensation nationale DIAS que pour les virements SEPA transfrontaliers, faisant de l'IBAN la référence de compte universelle pour toutes les transactions bancaires dans le pays.",
    bullets: [
      "Un IBAN grec commence par GR, deux chiffres de contrôle, un code banque à trois chiffres, un code agence à quatre chiffres et un numéro de compte à 16 chiffres. Les grandes banques — Alpha Bank (code banque 014), Eurobank (026), Piraeus Bank (017) et National Bank of Greece (011) — ont chacune leurs propres plages de codes. Votre IBAN GR complet à 27 caractères figure sur les relevés bancaires et dans les paramètres de votre espace de banque en ligne.",
      "Au sein de la zone SEPA, seul l'IBAN grec est requis pour les virements en euros — aucun BIC n'est nécessaire pour les Virements SEPA. Pour les paiements en provenance de l'extérieur de la zone SEPA, comme des États-Unis ou d'Australie, l'expéditeur aura besoin à la fois de l'IBAN et du code SWIFT/BIC de la banque destinataire. Les banques grecques règlent généralement les virements SEPA entrants en un jour ouvrable.",
      "La Grèce compte une proportion élevée de sa diaspora envoyant des fonds dans le pays. Pour diriger un virement vers un compte bancaire grec, utilisez l'IBAN GR complet plutôt qu'un numéro de compte national abrégé. Si le service d'envoi prend en charge la zone SEPA, le virement sera plus rapide et moins coûteux qu'un paiement acheminé via SWIFT ; confirmez le mode d'acheminement utilisé par le prestataire avant d'initier le virement.",
    ],
  },
  cyprus: {
    title: "Comment l'IBAN est utilisé à Chypre",
    intro:
      "Chypre utilise un IBAN à 28 caractères et est membre de la zone euro et de l'espace SEPA. La Banque Centrale de Chypre (CBC) supervise le système bancaire, qui a fait l'objet d'une importante restructuration à la suite de la crise bancaire de 2012-2013. Le secteur bancaire est aujourd'hui dominé par Bank of Cyprus et Hellenic Bank, tous les comptes étant libellés en EUR et les IBAN étant utilisés pour tous les virements, nationaux comme internationaux.",
    bullets: [
      "Un IBAN chypriote commence par CY, deux chiffres de contrôle, un code banque à trois chiffres, un code agence à cinq chiffres et un numéro de compte à 16 caractères. Les comptes de Bank of Cyprus sont identifiés par le code banque 002, tandis qu'Hellenic Bank utilise le 005. Votre IBAN est disponible via la banque en ligne, les applications mobiles ou imprimé sur les relevés bancaires.",
      "Chypre participe à l'espace SEPA, de sorte que les virements en euros depuis les pays de l'UE sont traités rapidement et à faible coût. Pour les paiements en provenance de l'extérieur de la zone SEPA — par exemple du Royaume-Uni après le Brexit, ou de pays hors UE — l'expéditeur aura besoin de votre IBAN CY complet à 28 caractères et du code SWIFT/BIC de votre banque. Hellenic Bank et Bank of Cyprus publient tous deux leurs codes SWIFT sur leurs sites Web.",
      "Chypre dispose d'une importante communauté d'affaires internationale et d'un volume élevé de paiements transfrontaliers. Lors de la réception de paiements en provenance de juridictions hors UE, sachez que certaines banques chypriotes appliquent une vigilance renforcée et peuvent demander une documentation pour les virements entrants de grande valeur. Confirmer les exigences de conformité avec votre banque avant d'attendre une remise de valeur élevée peut éviter des retards inattendus.",
    ],
  },
  luxembourg: {
    title: "Comment l'IBAN est utilisé au Luxembourg",
    intro:
      "Le Luxembourg utilise un IBAN à 20 caractères et est membre fondateur de la zone euro et de l'espace SEPA. En tant que l'un des principaux centres financiers d'Europe, le Luxembourg traite un volume exceptionnellement élevé de virements transfrontaliers par rapport à sa population. La Commission de Surveillance du Secteur Financier (CSSF) régule le secteur bancaire, avec des acteurs majeurs tels que BGL BNP Paribas, BCEE (Spuerkeess) et Banque de Luxembourg prenant en charge aussi bien la banque de détail que la banque privée.",
    bullets: [
      "Un IBAN luxembourgeois commence par LU, deux chiffres de contrôle, un code banque à trois chiffres et un numéro de compte à 13 chiffres. BCEE (Spuerkeess) porte le code banque 001, BGL BNP Paribas utilise le 002 et ING Luxembourg le 030. En tant que membre de l'espace SEPA, seul l'IBAN est requis pour les virements en euros au sein de l'UE et de l'EEE — aucun BIC n'est nécessaire pour les Virements SEPA.",
      "Le secteur bancaire luxembourgeois sert une large communauté d'employés des institutions de l'UE, de professionnels de la finance et de gestionnaires de fonds d'investissement. De nombreux titulaires de comptes maintiennent des comptes libellés dans plusieurs devises en parallèle de leur compte IBAN en EUR. Pour les virements non libellés en EUR, des informations de routage supplémentaires, notamment les codes SWIFT, sont requises.",
      "Le système LUIPS (Luxembourg Interbank Payment System) est connecté à TARGET2 pour les règlements en euros de grande valeur. Pour les paiements de détail, les schémas SEPA s'appliquent et les virements entre le Luxembourg et les autres pays de l'UE sont réglés en un jour ouvrable. Si vous travaillez pour une institution de l'UE basée au Luxembourg, votre employeur exigera votre IBAN LU pour la paie.",
    ],
  },
  "united-arab-emirates": {
    title: "Comment l'IBAN est utilisé aux Émirats Arabes Unis",
    intro:
      "Les EAU ont introduit l'utilisation obligatoire de l'IBAN en mai 2011 sur mandat de la Banque Centrale des EAU (CBUAE). Tous les comptes bancaires aux EAU disposent d'un IBAN à 23 caractères, et c'est le format requis pour tous les virements interbancaires nationaux et les virements internationaux vers le pays. Les EAU ne font pas partie de l'espace SEPA ; tous les paiements transfrontaliers sont traités via le réseau SWIFT. La devise est le dirham des EAU (AED), et les transactions sont réglées via le Système de Transfert de Fonds des EAU (UAEFTS).",
    bullets: [
      "Un IBAN des EAU comporte 23 caractères : le code pays AE, deux chiffres de contrôle et un code banque à trois chiffres suivi d'un numéro de compte à 16 chiffres. Emirates NBD (code banque 033), Abu Dhabi Commercial Bank — ADCB (030), First Abu Dhabi Bank — FAB (035) et Mashreq (020) comptent parmi les plus grandes banques. Votre IBAN est affiché sur votre portail de banque en ligne, votre application mobile ou imprimé sur votre relevé bancaire.",
      "Le Système de Transfert de Fonds des EAU (UAEFTS) gère tous les virements interbancaires nationaux en AED et utilise l'IBAN comme identifiant de compte obligatoire. Le système fonctionne 24h/24, 7j/7 et règle les virements en temps réel. Pour envoyer de l'argent entre des banques des EAU localement, communiquez votre IBAN AE à 23 caractères — aucun code SWIFT n'est nécessaire pour les virements nationaux au sein des EAU.",
      "Pour les virements internationaux vers les EAU depuis l'étranger, les expéditeurs ont toujours besoin de l'IBAN AE complet du bénéficiaire ainsi que du code SWIFT/BIC de la banque. Les grandes banques des EAU traitent les virements SWIFT entrants dans un large éventail de devises, mais les fonds sont généralement conservés en AED. Si vous avez besoin de recevoir des devises étrangères sans conversion, renseignez-vous auprès de votre banque sur l'ouverture d'un compte en devises étrangères avec un IBAN distinct.",
    ],
  },
  "saudi-arabia": {
    title: "Comment l'IBAN est utilisé en Arabie Saoudite",
    intro:
      "L'Arabie Saoudite a rendu obligatoire l'utilisation de l'IBAN pour tous les virements nationaux et internationaux en 2010, sous la supervision de l'Autorité Monétaire d'Arabie Saoudite (SAMA, désormais la Banque Centrale Saoudienne — SAMA). Chaque compte bancaire saoudien est doté d'un IBAN à 24 caractères préfixé SA. L'Arabie Saoudite ne fait pas partie de l'espace SEPA ; les virements internationaux sont acheminés via SWIFT. Sur le plan national, le Réseau de Paiements Saoudien (mada) et le système SARIE (règlement brut en temps réel d'Arabie Saoudite) utilisent l'IBAN comme identifiant de compte standard.",
    bullets: [
      "Un IBAN saoudien comporte 24 caractères : le code pays SA, deux chiffres de contrôle, un code banque à deux chiffres et un numéro de compte à 18 chiffres. Al Rajhi Bank (code banque 05), Saudi National Bank — SNB (10), Riyad Bank (07) et Banque Saudi Fransi (55) comptent parmi les plus grands établissements. Votre IBAN est disponible sur la plateforme de banque en ligne ou mobile de votre banque, sur votre relevé de compte ou en vous rendant en agence.",
      "Le système de règlement brut en temps réel SARIE d'Arabie Saoudite traite tous les virements nationaux en SAR de grande valeur à l'aide de l'IBAN. Le pays dispose également d'un système de Paiements Instantanés (IP) pour les virements de détail en temps réel. Les deux systèmes sont exclusivement nationaux — pour les virements transfrontaliers, SWIFT reste la norme et les expéditeurs hors d'Arabie Saoudite ont besoin de votre IBAN SA complet ainsi que du code SWIFT de votre banque.",
      "L'Arabie Saoudite présente l'un des plus importants flux de remises sortantes au monde, mais aussi d'importants flux entrants — notamment pour les expatriés travaillant dans le Royaume et recevant des fonds depuis leur pays d'origine. Lors de la réception d'un virement de l'étranger, votre banque peut appliquer une conversion de devise depuis la devise entrante vers le SAR. Les réglementations de la SAMA exigent également que les banques déclarent les virements internationaux dépassant certains seuils ; les virements entrants de grande valeur peuvent donc faire l'objet de vérifications de conformité supplémentaires.",
    ],
  },
  qatar: {
    title: "Comment l'IBAN est utilisé au Qatar",
    intro:
      "Le Qatar a adopté l'IBAN comme format de compte obligatoire dans le cadre réglementaire de la Banque Centrale du Qatar (QCB). Tous les comptes bancaires au Qatar sont dotés d'un IBAN à 29 caractères préfixé QA. Le Qatar ne fait pas partie de l'espace SEPA ; les virements internationaux sont traités via le réseau SWIFT en QAR ou dans d'autres devises. Sur le plan national, le Système de Paiement du Qatar (QPS) et le Système de Règlement Brut en Temps Réel du Qatar (QRTGS) utilisent l'IBAN pour l'ensemble du règlement interbancaire.",
    bullets: [
      "Un IBAN qatari comporte 29 caractères : le code pays QA, deux chiffres de contrôle, un code banque alphanumérique à quatre caractères et un numéro de compte à 21 caractères. Qatar National Bank — QNB (code banque QNBA) est la plus grande banque du pays et de la région. Parmi les autres grandes banques figurent Commercial Bank of Qatar (CBQA), Doha Bank (DOHB), Qatar Islamic Bank (QIIB) et Masraf Al Rayan (MARK).",
      "Le QPS du Qatar exploite le système de paiement interbancaire national et traite tous les virements de détail en QAR entre les banques locales. Pour les transactions de grande valeur, le QRTGS assure un règlement en temps réel. Les deux systèmes exigent l'IBAN QA complet à 29 caractères pour l'identification du bénéficiaire. Les expéditeurs internationaux doivent également fournir le code SWIFT/BIC de la banque du bénéficiaire.",
      "Le Qatar accueille une importante main-d'œuvre expatriée, et les remises entrantes constituent un cas d'usage majeur pour les virements basés sur l'IBAN. De nombreuses banques qataries proposent également des comptes multidevises pouvant recevoir des USD, EUR ou GBP sans conversion immédiate. Si vous percevez un salaire au Qatar ou attendez un virement en devises étrangères, demandez à votre banque si un compte IBAN en devises étrangères distinct est disponible pour éviter une conversion indésirable en QAR.",
    ],
  },
  kuwait: {
    title: "Comment l'IBAN est utilisé au Koweït",
    intro:
      "Le Koweït a adopté l'IBAN sous la supervision de la Banque Centrale du Koweït (CBK). Les comptes bancaires koweïtiens sont dotés d'un IBAN à 30 caractères — l'un des plus longs au monde — préfixé KW. Le Koweït n'est pas membre de l'espace SEPA ; tous les virements transfrontaliers sont acheminés via le réseau SWIFT. La monnaie nationale est le dinar koweïtien (KWD), régulièrement l'une des devises les plus valorisées au monde. Les virements interbancaires nationaux sont réglés via le Système de Règlement Automatisé du Koweït (KASS).",
    bullets: [
      "Un IBAN koweïtien comporte 30 caractères : le code pays KW, deux chiffres de contrôle, un code banque alphanumérique à quatre caractères et un numéro de compte à 22 caractères. National Bank of Kuwait — NBK (code banque NBOK) est la plus grande banque. Kuwait Finance House — KFH (KFHO), Gulf Bank (GULF) et Burgan Bank (BURG) sont d'autres établissements importants. La longueur inhabituelle de l'IBAN reflète le système étendu de numérotation des comptes nationaux au Koweït.",
      "Le système KASS (Kuwait Automated Settlement System) traite les paiements interbancaires nationaux en KWD et utilise l'IBAN comme identifiant de compte. Pour les virements internationaux entrants, l'expéditeur a besoin de l'IBAN KW complet à 30 caractères du bénéficiaire et du code SWIFT/BIC de la banque. Les virements arrivent généralement en un à deux jours ouvrables.",
      "Le dinar koweïtien est indexé sur un panier de devises et représente actuellement l'une des monnaies les plus fortes au monde en valeur nominale. Lors de la réception d'un virement international en KWD, le taux de change appliqué par votre banque ou le service d'envoi peut avoir un impact significatif sur le montant final reçu. Comparez le taux du marché médian avec le taux affiché par votre banque, car l'écart du KWD peut être notable pour les virements de grande valeur.",
    ],
  },
  bahrain: {
    title: "Comment l'IBAN est utilisé à Bahreïn",
    intro:
      "Bahreïn a introduit l'utilisation obligatoire de l'IBAN dans le cadre réglementaire de la Banque Centrale de Bahreïn (CBB). Tous les comptes bancaires à Bahreïn sont dotés d'un IBAN à 22 caractères préfixé BH. Bahreïn ne fait pas partie de l'espace SEPA ; les virements internationaux sont traités via SWIFT. Sur le plan national, le Système de Règlement Interbancaire de Bahreïn (BISS) et la Chambre de Compensation Automatisée de Bahreïn (BACH) utilisent l'IBAN pour tout le traitement des paiements interbancaires en dinar de Bahreïn (BHD).",
    bullets: [
      "Un IBAN bahreïnien comporte 22 caractères : le code pays BH, deux chiffres de contrôle, un code banque alphanumérique à quatre caractères et un numéro de compte à 14 caractères. Les principales banques comprennent Ahli United Bank (code banque AUBB), National Bank of Bahrain — NBB (NBOB), Bank of Bahrain and Kuwait — BBK (BBKU) et Ithmaar Bank (ITHMB). Votre IBAN est affiché sur votre portail de banque en ligne et imprimé sur les relevés bancaires.",
      "Les systèmes BISS et BACH de Bahreïn gèrent le règlement interbancaire national en BHD à l'aide de l'IBAN complet. Pour les virements internationaux, les expéditeurs situés en dehors de Bahreïn ont besoin de l'IBAN BH à 22 caractères du bénéficiaire et du code SWIFT/BIC de la banque destinataire. Bahreïn est un centre financier régional, et des banques majeures comme Ahli United Bank et NBB gèrent régulièrement d'importants volumes de virements SWIFT transfrontaliers.",
      "Bahreïn compte une proportion importante de résidents expatriés qui envoient des fonds depuis leur pays d'origine. Les virements entrants en devises étrangères sont convertis en BHD au taux de change de la banque destinataire, sauf si le compte est un compte en devises étrangères désigné. Le BHD est indexé sur le dollar américain à un taux fixe de 0,376 BHD par USD, ce qui signifie que les virements en USD arrivent avec des valeurs de conversion en BHD prévisibles.",
    ],
  },
  jordan: {
    title: "Comment l'IBAN est utilisé en Jordanie",
    intro:
      "La Jordanie a adopté l'IBAN sous la Banque Centrale de Jordanie (CBJ). Les comptes bancaires jordaniens sont dotés d'un IBAN à 30 caractères — l'un des formats les plus longs au niveau mondial — préfixé JO. La Jordanie ne fait pas partie de l'espace SEPA ; les virements internationaux sont traités via le réseau SWIFT. La monnaie nationale est le dinar jordanien (JOD), indexé sur le dollar américain. Les virements interbancaires nationaux sont traités via le Système de Paiement Électronique Jordanien (JoPACC).",
    bullets: [
      "Un IBAN jordanien comporte 30 caractères : le code pays JO, deux chiffres de contrôle, un code banque alphanumérique à quatre caractères, quatre chiffres d'information d'agence et un numéro de compte à 18 caractères. Arab Bank (code banque ARAB) est la banque jordanienne la plus grande et la plus connectée à l'international. Housing Bank for Trade and Finance (HBHO) et Jordan Islamic Bank (JIBS) sont d'autres établissements importants. Votre IBAN est disponible via l'application mobile de votre banque, la banque en ligne ou sur votre relevé de compte.",
      "JoPACC en Jordanie exploite l'infrastructure de paiement nationale, notamment les systèmes de compensation JRTGS (Règlement Brut en Temps Réel de Jordanie) et JCSS pour les paiements de détail. Les deux utilisent l'IBAN JO complet pour l'identification du bénéficiaire. Pour les virements transfrontaliers, l'expéditeur a besoin de votre IBAN JO à 30 caractères ainsi que du code SWIFT/BIC de votre banque.",
      "La Jordanie reçoit d'importants flux de remises entrants, notamment de Jordaniens travaillant dans le Golfe. Arab Bank, avec sa vaste présence régionale, est couramment utilisée pour recevoir des virements d'Arabie Saoudite, des EAU et du Koweït. Lorsque l'expéditeur se trouve dans un pays du Golfe, vérifiez si votre banque peut recevoir le virement sans nécessiter d'étape de banque correspondante manuelle, ce qui peut réduire à la fois les frais et le délai de règlement.",
    ],
  },
  egypt: {
    title: "Comment l'IBAN est utilisé en Égypte",
    intro:
      "L'Égypte a rendu obligatoire l'adoption de l'IBAN pour tous les comptes bancaires par une directive de la Banque Centrale d'Égypte (CBE). Les comptes bancaires égyptiens sont dotés d'un IBAN à 29 caractères préfixé EG. L'Égypte ne fait pas partie de l'espace SEPA ; les virements internationaux utilisent le réseau SWIFT. La monnaie nationale est la livre égyptienne (EGP). Sur le plan national, le Système Bancaire Égyptien traite les virements interbancaires via les systèmes de compensation électronique EG-RTGS (Règlement Brut en Temps Réel d'Égypte) et ACH d'Égypte.",
    bullets: [
      "Un IBAN égyptien comporte 29 caractères : le code pays EG, deux chiffres de contrôle, un code banque à quatre chiffres, un code agence à quatre chiffres et un numéro de compte à 17 chiffres. Les principales banques comprennent National Bank of Egypt — NBE (code banque 0019), Banque Misr (0002), Commercial International Bank — CIB (0010) et Banque du Caire (0027). Votre IBAN est disponible sur votre plateforme de banque en ligne, votre application mobile ou imprimé sur votre relevé de compte.",
      "L'EG-RTGS d'Égypte traite les virements nationaux en EGP de grande valeur, tandis que l'ACH gère les virements par lots de détail, les deux utilisant l'IBAN complet comme identifiant de compte. Pour les virements internationaux vers l'Égypte, les expéditeurs ont besoin de l'IBAN EG à 29 caractères du bénéficiaire et du code SWIFT/BIC de la banque destinataire. Les réglementations de la CBE peuvent exiger que les importantes remises entrantes en devises étrangères soient converties en EGP au taux de change officiel.",
      "L'Égypte est l'un des plus grands destinataires de remises au Moyen-Orient et en Afrique du Nord. La CBE a introduit plusieurs incitations pour les remises via les canaux bancaires, notamment des taux de change améliorés pour les expéditeurs dirigeant des virements vers des comptes bancaires égyptiens via les canaux bancaires officiels. Si vous recevez régulièrement des remises, renseignez-vous auprès de votre banque sur les avantages tarifaires ou en matière de frais spécifiques aux remises disponibles pour les virements entrants basés sur l'IBAN.",
    ],
  },
  israel: {
    title: "Comment l'IBAN est utilisé en Israël",
    intro:
      "Israël utilise un IBAN à 23 caractères réglementé par la Banque d'Israël (BoI). Les comptes bancaires israéliens portent le préfixe IL et l'IBAN est le format requis pour les virements internationaux. Israël ne fait pas partie de l'espace SEPA ; les paiements transfrontaliers sont traités via SWIFT. La monnaie nationale est le nouveau shekel israélien (ILS). Le système de paiement national d'Israël, ZAHAV (Zikui Amiti Hagvoh V'Irtzi), gère le règlement brut en temps réel pour les virements en ILS de grande valeur.",
    bullets: [
      "Un IBAN israélien comporte 23 caractères : le code pays IL, deux chiffres de contrôle, un numéro de banque à trois chiffres et un numéro de compte à 13 chiffres (agence à trois chiffres et compte à dix chiffres). Bank Leumi (numéro de banque 10), Bank Hapoalim (12), Israel Discount Bank (11) et Mizrahi Tefahot Bank (20) sont les quatre plus grandes banques par actifs. Votre IBAN est affiché sur votre compte de banque en ligne et sur votre relevé bancaire.",
      "Le système ZAHAV d'Israël traite les virements interbancaires en ILS le jour même entre les banques israéliennes à l'aide de l'IBAN. Pour les virements internationaux depuis l'étranger, les expéditeurs ont besoin de votre IBAN IL complet à 23 caractères et du code SWIFT/BIC de votre banque. Les réglementations de la Banque d'Israël exigent que certains flux entrants en devises étrangères dépassant des seuils définis soient déclarés, et votre banque peut vous demander de documenter la source des virements internationaux importants.",
      "Israël compte une importante diaspora, notamment en Amérique du Nord et en Europe, dont les remises constituent une source courante de virements SWIFT entrants. De nombreuses banques israéliennes proposent des comptes en devises étrangères (USD, EUR, GBP) aux côtés du compte standard en ILS, chacun avec son propre IBAN. Si vous recevez régulièrement des virements en USD ou en EUR, conserver un compte en devises étrangères peut vous éviter de coûteuses conversions en ILS au taux de change de détail de votre banque.",
    ],
  },
  brazil: {
    title: "Comment l'IBAN est utilisé au Brésil",
    intro:
      "Le Brésil utilise un IBAN à 29 caractères supervisé par la Banque Centrale du Brésil (BCB). Les comptes bancaires brésiliens portent le préfixe BR et l'IBAN est utilisé pour les virements internationaux vers le Brésil, en parallèle du numéro d'identification fiscale nationale CPF (particuliers) ou CNPJ (entreprises). Le Brésil ne fait pas partie de l'espace SEPA ; les paiements internationaux sont traités via SWIFT. La monnaie nationale est le real brésilien (BRL). Sur le plan national, les Brésiliens utilisent les systèmes de paiement PIX, TED et DOC — l'IBAN est utilisé spécifiquement pour le routage international.",
    bullets: [
      "Un IBAN brésilien comporte 29 caractères : le code pays BR, deux chiffres de contrôle, un code banque à huit chiffres (code ISPB), un code agence à cinq chiffres, un numéro de compte à dix chiffres et deux caractères de contrôle. Les principales banques comprennent Banco do Brasil (ISPB 00000000), Itaú Unibanco (60701190), Bradesco (60746948) et Santander Brasil (90400888). Votre IBAN n'est pas toujours affiché en bonne place dans les applications bancaires brésiliennes, qui se concentrent sur les clés PIX et les numéros de compte nationaux — vous devrez peut-être contacter directement votre banque pour l'obtenir.",
      "Le système de paiement instantané PIX au Brésil, lancé en 2020 et réglementé par la BCB, domine les virements nationaux en utilisant le CPF, le numéro de téléphone ou l'adresse e-mail comme identifiants plutôt que l'IBAN. Cependant, pour recevoir des virements internationaux depuis l'étranger, l'expéditeur a besoin de votre IBAN BR complet à 29 caractères, du code SWIFT/BIC de votre banque et souvent de votre numéro fiscal CPF ou CNPJ à des fins de conformité.",
      "Lors de la réception d'un virement en devises étrangères au Brésil, les réglementations de la BCB exigent que les fonds soient convertis en BRL au taux de change convenu avec votre banque. La taxe IOF brésilienne (Imposto sobre Operações Financeiras) s'applique aux virements entrants en devises étrangères à des taux variables selon le type de transaction. Les virements classifiés comme prêts financiers, investissements en capital ou paiements commerciaux sont soumis à des taux d'IOF différents — consultez un conseiller fiscal local ou votre banque si vous recevez régulièrement des virements internationaux dépassant des montants modestes.",
    ],
  },
  ukraine: {
    title: "Comment l'IBAN est utilisé en Ukraine",
    intro:
      "L'Ukraine a adopté la norme IBAN à 29 caractères en 2019 sur mandat de la Banque Nationale d'Ukraine (NBU), remplaçant le système hérité MFO (code de tri bancaire) et numéro de compte pour les virements internationaux. Les comptes bancaires ukrainiens portent le préfixe UA. L'Ukraine ne fait pas partie de l'espace SEPA ; les paiements transfrontaliers sont traités via SWIFT en UAH ou en devises étrangères. Les virements nationaux utilisent la chambre de compensation SEP (Système de Paiements Électroniques) exploitée par la NBU.",
    bullets: [
      "Un IBAN ukrainien comporte 29 caractères : le code pays UA, deux chiffres de contrôle, un code de tri bancaire MFO à six chiffres et un numéro de compte à 19 chiffres. Les principales banques comprennent PrivatBank (MFO 305299), Oschadbank (322001), Raiffeisen Bank Ukraine (380805) et PUMB (334851). Votre IBAN est disponible dans la banque en ligne, l'application Privat24 ou d'autres applications mobiles, ou peut être demandé dans n'importe quelle agence.",
      "Le système SEP d'Ukraine traite les virements interbancaires nationaux en UAH à l'aide de l'IBAN complet. Pour les virements internationaux depuis l'étranger, les expéditeurs ont besoin de l'IBAN UA à 29 caractères du bénéficiaire et du code SWIFT/BIC de la banque. En raison du conflit en cours depuis 2022, certains prestataires de paiement internationaux ont restreint les virements vers l'Ukraine ; cependant, les principales banques dont PrivatBank et Oschadbank continuent de traiter les virements SWIFT entrants.",
      "La NBU ukrainienne a mis en place des contrôles temporaires des capitaux et des restrictions de change depuis 2022. Les virements entrants en devises étrangères dépassant certains seuils peuvent être soumis à une conversion obligatoire en UAH au taux de change de la NBU, et une documentation justifiant l'objet du virement peut être requise. Si vous recevez des remises de l'étranger, confirmez les règles actuelles de la NBU avec votre banque, ces réglementations étant régulièrement mises à jour.",
    ],
  },
  georgia: {
    title: "Comment l'IBAN est utilisé en Géorgie",
    intro:
      "La Géorgie a adopté la norme IBAN sous la Banque Nationale de Géorgie (NBG). Les comptes bancaires géorgiens sont dotés d'un IBAN à 22 caractères préfixé GE. La Géorgie ne fait pas partie de l'espace SEPA ; les virements internationaux sont traités via SWIFT. La monnaie nationale est le lari géorgien (GEL). Le secteur bancaire géorgien est concentré, avec deux banques dominantes — TBC Bank et Bank of Georgia — représentant la majorité des actifs bancaires du pays et gérant l'essentiel des virements internationaux.",
    bullets: [
      "Un IBAN géorgien comporte 22 caractères : le code pays GE, deux chiffres de contrôle, un code banque alphanumérique à deux caractères et un numéro de compte à 16 chiffres. TBC Bank utilise le code banque TB, tandis que Bank of Georgia utilise GG. Liberty Bank (LB) et ProCredit Bank Georgia (PC) sont d'autres établissements notables. Votre IBAN est disponible via les applications mobiles de TBC ou BOG, les portails de banque en ligne ou sur votre relevé de compte.",
      "Le système de paiement interbancaire national de la Géorgie utilise l'IBAN comme identifiant de compte standard pour tous les virements en GEL et en devises étrangères entre les banques géorgiennes. Pour les virements internationaux depuis l'étranger, les expéditeurs ont besoin de l'IBAN GE à 22 caractères du bénéficiaire et du code SWIFT/BIC de la banque. TBC Bank et Bank of Georgia disposent toutes deux de solides réseaux de banques correspondantes internationales et gèrent efficacement les virements entrants multidevises.",
      "La Géorgie est de plus en plus prisée comme base pour les travailleurs à distance, les nomades numériques et les entreprises internationales en raison de son régime fiscal libéral et de la facilité d'accès aux services bancaires. Les banques géorgiennes permettent l'ouverture de comptes en GEL, USD, EUR et GBP — chaque devise détenue dispose généralement de son propre IBAN. Lors de la réception de virements internationaux, précisez quel compte en devises doit recevoir les fonds afin d'éviter une conversion automatique en GEL au taux de change de détail moins favorable de votre banque.",
    ],
  },
  },
  faqs: {
  denmark: [
    {
      q: "Quel est le format de l'IBAN pour le Danemark ?",
      a: "Un IBAN danois comporte exactement 18 caractères. Il commence par le code pays DK, suivi de 2 chiffres de contrôle, d'un code bancaire à 4 chiffres (numéro d'enregistrement) et d'un numéro de compte à 10 chiffres. Exemple : DK50 0040 0440 1162 43.",
    },
    {
      q: "Comment trouver mon IBAN au Danemark ?",
      a: "Votre IBAN danois (DK) est affiché dans la banque en ligne (netbank) ou l'application mobile de votre banque, dans la section détails du compte. Danske Bank, Nordea Denmark, Jyske Bank et Nykredit affichent tous de manière bien visible l'IBAN à 18 caractères. Il figure également sur les relevés bancaires. Si vous ne connaissez que votre numéro d'enregistrement et votre numéro de compte, votre banque peut vous fournir l'IBAN complet.",
    },
    {
      q: "Le Danemark fait-il partie de SEPA ?",
      a: "Oui. Le Danemark est membre de l'UE et participant à part entière de SEPA, ce qui signifie que les virements en euros depuis d'autres pays de l'UE et de l'EEE sont traités à faible coût via le virement SEPA (SCT). Cependant, la monnaie du Danemark est la couronne danoise (DKK), de sorte que les paiements SEPA entrants en EUR seront convertis en DKK, sauf si vous détenez un compte dédié en EUR.",
    },
    {
      q: "Quelle est la différence entre un numéro d'enregistrement danois et un IBAN ?",
      a: "Le numéro d'enregistrement danois (registreringsnummer) est un code à 4 chiffres identifiant la banque ou l'agence, associé à un numéro de compte à 10 chiffres pour les virements domestiques. L'IBAN intègre ces données dans un format international : DK + 2 chiffres de contrôle + le numéro d'enregistrement à 4 chiffres + le numéro de compte à 10 chiffres, soit 18 caractères au total.",
    },
    {
      q: "Ai-je besoin d'un code BIC/SWIFT pour recevoir un virement au Danemark ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE en EUR, seul l'IBAN danois (DK) est nécessaire — aucun BIC n'est requis. Pour les virements depuis l'extérieur de SEPA, ou pour les virements en DKK depuis l'étranger, l'expéditeur doit inclure à la fois votre IBAN et le code SWIFT/BIC de votre banque. Le code SWIFT de Danske Bank est DABADKKK ; celui de Nordea Denmark est NDEADKKK.",
    },
    {
      q: "Puis-je recevoir des DKK depuis l'étranger via SEPA ?",
      a: "Non. SEPA ne traite que les virements en EUR, pas en DKK. Si quelqu'un à l'étranger souhaite vous envoyer des DKK, le virement doit passer par le réseau SWIFT, et l'expéditeur aura besoin de votre IBAN danois (DK) ainsi que du code SWIFT de votre banque. Pour les paiements en euros au sein de SEPA, seul l'IBAN est nécessaire.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN danois ?",
      a: "Les erreurs les plus fréquentes sont : confondre le numéro d'enregistrement à 4 chiffres avec l'IBAN complet, fournir uniquement le numéro de compte domestique sans le préfixe DK et les chiffres de contrôle, ou transposer des chiffres dans le numéro de compte à 10 chiffres. Vérifiez toujours l'IBAN complet à 18 caractères avant de le communiquer à un expéditeur international.",
    },
    {
      q: "Quelles considérations relatives aux devises dois-je connaître pour les virements vers le Danemark ?",
      a: "Le Danemark utilise la couronne danoise (DKK), qui est arrimée à l'euro dans une bande étroite. Si vous recevez un virement SEPA en EUR, votre banque danoise le convertira en DKK à son taux de change. Comparez le taux proposé par votre banque avec le taux interbancaire du marché pour comprendre le coût de la conversion. Si vous recevez régulièrement des EUR, renseignez-vous auprès de votre banque sur l'ouverture d'un compte dédié en EUR.",
    },
  ],
  "united-kingdom": [
    {
      q: "Quel est le format de l'IBAN pour le Royaume-Uni ?",
      a: "Un IBAN britannique comporte exactement 22 caractères. Il commence par GB, 2 chiffres de contrôle, un code bancaire à 4 caractères, un code de tri (sort code) à 6 chiffres et un numéro de compte à 8 chiffres. Exemple : GB29 NWBK 6016 1331 9268 19.",
    },
    {
      q: "Comment trouver mon IBAN au Royaume-Uni ?",
      a: "Votre IBAN GB est disponible dans la banque en ligne ou l'application mobile de votre banque, dans les détails du compte ou les paramètres de paiement international. Barclays, HSBC, Lloyds, NatWest et Nationwide affichent tous l'IBAN à 22 caractères. Vous pouvez également le déduire de votre sort code à 6 chiffres et de votre numéro de compte à 8 chiffres grâce à l'outil de calcul IBAN de votre banque.",
    },
    {
      q: "Le Royaume-Uni fait-il partie de SEPA ?",
      a: "Non. Depuis le Brexit, le Royaume-Uni ne fait plus partie de SEPA (Espace unique de paiement en euros). Les virements entre le Royaume-Uni et les pays de l'UE sont désormais acheminés via SWIFT plutôt que par le système moins coûteux de virement SEPA. Cela peut entraîner des frais plus élevés et des délais de traitement plus longs par rapport aux virements intra-UE.",
    },
    {
      q: "Quelle est la différence entre sort code/numéro de compte et IBAN au Royaume-Uni ?",
      a: "Le système domestique britannique utilise un sort code à 6 chiffres (identifiant la banque et l'agence) et un numéro de compte à 8 chiffres. L'IBAN intègre ces données dans un format international : GB + 2 chiffres de contrôle + code bancaire à 4 lettres + le sort code à 6 chiffres + le numéro de compte à 8 chiffres, soit 22 caractères au total. Pour les virements domestiques au Royaume-Uni (Faster Payments, BACS, CHAPS), le sort code et le numéro de compte sont utilisés. Pour les virements internationaux, l'IBAN est requis.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT en plus de mon IBAN pour recevoir des virements internationaux au Royaume-Uni ?",
      a: "Oui. Étant donné que le Royaume-Uni est hors de SEPA, les expéditeurs de l'étranger doivent toujours fournir à la fois votre IBAN GB à 22 caractères et le code SWIFT/BIC de votre banque. Par exemple, le code SWIFT de Barclays est BARCGB22 ; celui de HSBC est MIDLGB22 ; celui de Lloyds est LOYDGB21 ; celui de NatWest est NWBKGB2L.",
    },
    {
      q: "Quelles sont les erreurs courantes lors de l'utilisation d'un IBAN britannique ?",
      a: "Les erreurs courantes comprennent : fournir uniquement le sort code et le numéro de compte sans le préfixe GB et les chiffres de contrôle, confondre le code bancaire à 4 lettres avec le code SWIFT, et saisir des chiffres incorrects du sort code. Certains expéditeurs de l'UE peuvent également tenter par erreur d'envoyer via SEPA vers un IBAN britannique, ce qui peut être rejeté après le Brexit — ils doivent utiliser SWIFT à la place.",
    },
    {
      q: "Puis-je recevoir des EUR sur un compte bancaire britannique ?",
      a: "La plupart des comptes britanniques standard sont libellés en GBP, de sorte que les virements entrants en EUR seront convertis en GBP par votre banque à son taux de change. Certaines banques britanniques (notamment HSBC, Barclays et les banques numériques comme Wise et Revolut) proposent des comptes multidevises ou libellés en EUR. Si vous recevez régulièrement des EUR, l'ouverture d'un compte dédié en EUR peut éviter des frais de conversion.",
    },
  ],
  germany: [
    {
      q: "Quel est le format de l'IBAN pour l'Allemagne ?",
      a: "Un IBAN allemand comporte exactement 22 caractères. Il commence par DE, 2 chiffres de contrôle, un Bankleitzahl à 8 chiffres (BLZ — code de routage bancaire) et un numéro de compte à 10 chiffres (complété par des zéros en tête si plus court). Exemple : DE89 3704 0044 0532 0130 00.",
    },
    {
      q: "Comment trouver mon IBAN en Allemagne ?",
      a: "Votre IBAN allemand (DE) est affiché dans la banque en ligne (Onlinebanking) ou l'application mobile de votre banque. Deutsche Bank, Commerzbank, les Sparkassen et les Volksbanken/Raiffeisenbanken affichent tous l'IBAN à 22 caractères dans le récapitulatif du compte. Il figure également sur votre Kontoauszug (relevé bancaire) et sur le recto de votre Girocard (carte de débit).",
    },
    {
      q: "L'Allemagne fait-elle partie de SEPA ?",
      a: "Oui. L'Allemagne est membre fondateur de la zone euro et de SEPA. Tous les virements en euros, domestiques et transfrontaliers, utilisent exclusivement l'IBAN. Au sein de SEPA, seul l'IBAN allemand (DE) est requis pour les virements de crédit en euros — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Qu'est-ce qu'un Bankleitzahl (BLZ) et comment se rapporte-t-il à l'IBAN ?",
      a: "Le Bankleitzahl (BLZ) est le code de routage bancaire allemand à 8 chiffres qui identifie la banque et l'agence. Il se mappe directement aux positions 5-12 de l'IBAN allemand. Par exemple, le BLZ 37040044 de Deutsche Bank apparaît sous la forme DE89 3704 0044 dans l'IBAN. L'ancien système BLZ + Kontonummer a été entièrement remplacé par l'IBAN pour tous les virements.",
    },
    {
      q: "Ai-je besoin d'un code BIC pour les virements au sein de l'Allemagne ou de l'UE ?",
      a: "Non. Pour les virements SEPA au sein de l'UE et de l'EEE, seul l'IBAN allemand (DE) est requis. Les codes BIC ne sont plus obligatoires pour les virements de crédit SEPA. Cependant, pour les virements depuis l'extérieur de SEPA (comme depuis les États-Unis ou l'Asie), l'expéditeur doit inclure le code SWIFT/BIC de votre banque en plus de l'IBAN.",
    },
    {
      q: "Comment fonctionnent les prélèvements automatiques SEPA (Lastschrift) avec l'IBAN allemand ?",
      a: "Les prélèvements automatiques SEPA en Allemagne nécessitent l'IBAN du débiteur et un mandat SEPA signé autorisant le créancier à percevoir des paiements. C'est la norme pour les paiements récurrents tels que le loyer, les services publics, les assurances et les abonnements. Lors de la mise en place d'un Lastschrift, fournissez votre IBAN allemand (DE) et signez le formulaire de mandat (Lastschriftmandat).",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN allemand ?",
      a: "Les erreurs courantes comprennent : confondre le BLZ à 8 chiffres avec l'IBAN complet, fournir le Kontonummer sans le préfixe DE et le BLZ, saisir un numéro de compte qui n'a pas été correctement complété par des zéros jusqu'à 10 chiffres, et transposer des chiffres dans le BLZ. Vérifiez toujours l'IBAN complet à 22 caractères avant de le partager.",
    },
    {
      q: "Les Sparkassen, les Volksbanken et les banques en ligne peuvent-ils tous recevoir des virements internationaux via IBAN ?",
      a: "Oui. Toutes les banques allemandes — y compris les Sparkassen, les Volksbanken/Raiffeisenbanken, les banques commerciales traditionnelles (Deutsche Bank, Commerzbank) et les banques en ligne (N26, DKB, ING Germany) — utilisent le même format d'IBAN allemand à 22 caractères et peuvent recevoir des virements SEPA et SWIFT. La plage du BLZ identifie l'établissement spécifique.",
    },
  ],
  france: [
    {
      q: "Quel est le format de l'IBAN pour la France ?",
      a: "Un IBAN français comporte exactement 27 caractères. Il commence par FR, 2 chiffres de contrôle, un code banque à 5 chiffres, un code guichet à 5 chiffres, un numéro de compte à 11 caractères et une clé RIB à 2 chiffres. Exemple : FR76 3000 6000 0112 3456 7890 189.",
    },
    {
      q: "Comment trouver mon IBAN en France ?",
      a: "Votre IBAN français (FR) est affiché dans la banque en ligne (espace client) ou l'application mobile de votre banque. BNP Paribas, Société Générale, Crédit Agricole et La Banque Postale affichent tous l'IBAN à 27 caractères sur la page des détails du compte. Il figure également sur votre RIB (Relevé d'Identité Bancaire), que vous pouvez télécharger ou imprimer depuis votre banque en ligne.",
    },
    {
      q: "La France fait-elle partie de SEPA ?",
      a: "Oui. La France est membre fondateur de la zone euro et de SEPA. Les virements en euros depuis d'autres pays de l'UE et de l'EEE sont traités via le virement SEPA (SCT) ou le virement SEPA instantané (SCT Inst). Au sein de SEPA, seul l'IBAN français (FR) est requis — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Qu'est-ce qu'un RIB et comment se rapporte-t-il à l'IBAN français ?",
      a: "Un RIB (Relevé d'Identité Bancaire) est le document d'identification du compte bancaire français contenant le code banque, le code guichet, le numéro de compte et la clé RIB. Tous ces composants se mappent directement dans l'IBAN français. L'IBAN est essentiellement FR + 2 chiffres de contrôle + le RIB complet. Lorsqu'on vous demande votre RIB, fournir votre IBAN est équivalent.",
    },
    {
      q: "Ai-je besoin d'un code BIC pour les virements SEPA vers la France ?",
      a: "Non. Pour les virements de crédit SEPA au sein de l'UE et de l'EEE, seul l'IBAN français (FR) est requis. Le BIC n'est plus obligatoire pour les virements intra-SEPA. Pour les virements depuis l'extérieur de SEPA (comme depuis les États-Unis, le Royaume-Uni post-Brexit, ou l'Asie), l'expéditeur doit inclure à la fois votre IBAN FR et le code SWIFT/BIC de votre banque.",
    },
    {
      q: "Comment fonctionnent les prélèvements automatiques avec l'IBAN français ?",
      a: "Les prélèvements SEPA en France nécessitent votre IBAN et un mandat SEPA signé (mandat de prélèvement). C'est la norme pour payer les factures de services publics français (EDF, eau), le loyer, les primes d'assurance et les services d'abonnement comme Internet et les forfaits téléphoniques. Fournissez votre IBAN FR sur le formulaire de mandat pour autoriser les prélèvements.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN français ?",
      a: "Les erreurs courantes comprennent : confondre la clé RIB (2 chiffres) avec les chiffres de contrôle de l'IBAN, fournir uniquement le numéro de compte domestique sans le préfixe FR et les codes, et mélanger le code banque avec le code guichet. La longueur de 27 caractères est parmi les plus longues de SEPA, ce qui rend les erreurs de transposition de chiffres plus probables — vérifiez toujours soigneusement.",
    },
  ],
  netherlands: [
    {
      q: "Quel est le format de l'IBAN pour les Pays-Bas ?",
      a: "Un IBAN néerlandais comporte exactement 18 caractères. Il commence par NL, 2 chiffres de contrôle, un code bancaire à 4 lettres (tel que ABNA, INGB ou RABO) et un numéro de compte à 10 chiffres. Exemple : NL91 ABNA 0417 1643 00.",
    },
    {
      q: "Comment trouver mon IBAN aux Pays-Bas ?",
      a: "Votre IBAN néerlandais (NL) est affiché dans la banque en ligne ou l'application mobile de votre banque. ABN AMRO, ING et Rabobank — les trois plus grandes banques néerlandaises — affichent tous de manière bien visible l'IBAN à 18 caractères dans le récapitulatif du compte. Il figure également sur les relevés bancaires, votre carte de débit et les factures. L'ancien format de numéro de compte néerlandais a été entièrement abandonné.",
    },
    {
      q: "Les Pays-Bas font-ils partie de SEPA ?",
      a: "Oui. Les Pays-Bas sont membres fondateurs de la zone euro et de SEPA. Tous les virements en euros, domestiques et transfrontaliers, utilisent exclusivement l'IBAN. Au sein de SEPA, seul l'IBAN néerlandais (NL) est requis — aucun code BIC/SWIFT n'est nécessaire pour les virements de crédit en euros.",
    },
    {
      q: "Que signifient les codes bancaires à 4 lettres dans un IBAN néerlandais ?",
      a: "Le code bancaire à 4 lettres aux positions 5-8 de l'IBAN néerlandais identifie la banque : ABNA est ABN AMRO, INGB est ING, RABO est Rabobank, SNSB est SNS Bank, ASNB est ASN Bank, TRIO est Triodos Bank, KNAB est Knab et BUNQ est bunq. Cela permet d'identifier facilement l'établissement détenteur du compte en un coup d'œil.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir un virement international aux Pays-Bas ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE en EUR, seul l'IBAN néerlandais (NL) est suffisant. Pour les virements depuis l'extérieur de la zone SEPA (comme depuis les États-Unis, le Royaume-Uni ou l'Asie), l'expéditeur doit inclure à la fois l'IBAN et le code SWIFT/BIC de la banque. Le code SWIFT d'ABN AMRO est ABNANL2A ; celui d'ING est INGBNL2A ; celui de Rabobank est RABONL2U.",
    },
    {
      q: "Existe-t-il encore des anciens numéros de compte néerlandais en usage ?",
      a: "Non. Les Pays-Bas ont été l'un des premiers pays à abandonner entièrement les anciens numéros de compte domestiques. Tous les virements bancaires néerlandais — domestiques et internationaux — utilisent exclusivement l'IBAN. Si vous rencontrez un ancien numéro de compte néerlandais, il ne peut pas être utilisé pour des virements ; vous avez besoin de l'IBAN NL complet à 18 caractères.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN néerlandais ?",
      a: "Les erreurs courantes comprennent : confondre le code bancaire à 4 lettres avec le code SWIFT/BIC (ils sont différents), saisir un numéro de compte incorrect ou obsolète, et oublier d'inclure le préfixe NL lors du partage avec des expéditeurs internationaux. Le format relativement court à 18 caractères rend les IBAN néerlandais moins sujets aux erreurs de transposition de chiffres que les IBAN plus longs.",
    },
  ],
  spain: [
    {
      q: "Quel est le format de l'IBAN pour l'Espagne ?",
      a: "Un IBAN espagnol comporte exactement 24 caractères. Il commence par ES, 2 chiffres de contrôle, puis le CCC à 20 chiffres (Código Cuenta Cliente), qui comprend un code bancaire à 4 chiffres, un code agence à 4 chiffres, 2 chiffres de contrôle nationaux et un numéro de compte à 10 chiffres. Exemple : ES91 2100 0418 4502 0005 1332.",
    },
    {
      q: "Comment trouver mon IBAN en Espagne ?",
      a: "Votre IBAN espagnol (ES) est affiché dans la banque en ligne (banca online) ou l'application mobile de votre banque. Santander, BBVA, CaixaBank et Sabadell affichent tous l'IBAN à 24 caractères sur la page des détails du compte. Il figure également sur les relevés bancaires et dans le contrat de compte. Si vous avez votre ancien numéro CCC, le convertir en IBAN est simple en ajoutant le préfixe ES et les chiffres de contrôle.",
    },
    {
      q: "L'Espagne fait-elle partie de SEPA ?",
      a: "Oui. L'Espagne est membre de la zone euro et de SEPA. Les virements en euros depuis d'autres pays de l'UE et de l'EEE sont traités via le virement SEPA (SCT) ou le virement SEPA instantané (SCT Inst). Au sein de SEPA, seul l'IBAN espagnol (ES) est requis — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Qu'est-ce que le CCC et comment se rapporte-t-il à l'IBAN espagnol ?",
      a: "Le CCC (Código Cuenta Cliente) est le numéro de compte bancaire espagnol traditionnel à 20 chiffres, composé de : un code bancaire à 4 chiffres, un code agence à 4 chiffres, 2 chiffres de contrôle (dígitos de control) et un numéro de compte à 10 chiffres. L'IBAN intègre le CCC avec le code pays ES et 2 chiffres de contrôle IBAN : ES + chiffres de contrôle + CCC = 24 caractères.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir un virement depuis l'extérieur de l'Europe vers l'Espagne ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE, seul l'IBAN espagnol (ES) est requis. Pour les virements depuis l'extérieur de SEPA (comme depuis les États-Unis, l'Amérique latine ou l'Asie), l'expéditeur a besoin à la fois de votre IBAN ES à 24 caractères et du code SWIFT/BIC de votre banque. Le code SWIFT de Santander est BSCHESMM ; celui de BBVA est BBVAESMM ; celui de CaixaBank est CABORKMM.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN espagnol ?",
      a: "Les erreurs courantes comprennent : fournir uniquement le CCC à 20 chiffres sans le préfixe ES et les chiffres de contrôle IBAN, confondre les 2 chiffres de contrôle nationaux du CCC avec les 2 chiffres de contrôle de l'IBAN, et mélanger le code bancaire avec le code agence. L'Espagne possède de nombreuses caisses d'épargne locales (cajas) aux côtés des grandes banques commerciales, chacune avec son propre code — vérifiez bien les codes bancaire et agence.",
    },
    {
      q: "Comment fonctionnent les prélèvements automatiques (domiciliación) avec l'IBAN espagnol ?",
      a: "Les prélèvements automatiques SEPA (domiciliación bancaria) en Espagne nécessitent votre IBAN et un mandat SEPA signé. C'est la méthode standard pour payer les factures de services publics, le loyer, les assurances, les factures de téléphone et les abonnements en Espagne. Fournissez votre IBAN ES lors du remplissage du formulaire de mandat (orden de domiciliación). Votre banque conserve le mandat sous forme électronique.",
    },
  ],
  italy: [
    {
      q: "Quel est le format de l'IBAN pour l'Italie ?",
      a: "Un IBAN italien comporte exactement 27 caractères. Il commence par IT, 2 chiffres de contrôle, un CIN à 1 caractère (Numéro de contrôle interne), un code bancaire ABI à 5 chiffres, un code agence CAB à 5 chiffres et un numéro de compte à 12 caractères. Exemple : IT60 X054 2811 1010 0000 0123 456.",
    },
    {
      q: "Comment trouver mon IBAN en Italie ?",
      a: "Votre IBAN italien (IT) est affiché dans la banque en ligne ou l'application mobile de votre banque. UniCredit, Intesa Sanpaolo, Banco BPM et BPER Banca affichent tous l'IBAN à 27 caractères dans le récapitulatif du compte (estratto conto). Il figure également sur les relevés bancaires et dans les documents de bienvenue (foglio informativo) reçus lors de l'ouverture du compte.",
    },
    {
      q: "L'Italie fait-elle partie de SEPA ?",
      a: "Oui. L'Italie est membre fondateur de la zone euro et de SEPA. Tous les virements en euros, domestiques et transfrontaliers, utilisent l'IBAN. Au sein de SEPA, seul l'IBAN italien (IT) est requis pour les virements de crédit en euros — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Que sont les codes CIN, ABI et CAB dans un IBAN italien ?",
      a: "Le CIN (Numéro de contrôle interne) est un caractère unique utilisé pour la validation domestique italienne. L'ABI (Associazione Bancaria Italiana) est un code bancaire à 5 chiffres — par exemple, 05428 pour UniCredit, 03069 pour Intesa Sanpaolo. Le CAB (Codice di Avviamento Bancario) est un code agence à 5 chiffres. Ensemble, CIN + ABI + CAB + numéro de compte forment le BBAN italien intégré dans l'IBAN.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir des virements internationaux en Italie ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE en EUR, seul l'IBAN italien (IT) est suffisant — aucun code SWIFT n'est requis. Pour les virements depuis l'extérieur de SEPA (comme depuis les États-Unis, le Royaume-Uni ou les pays hors UE), l'expéditeur a besoin à la fois de votre IBAN IT à 27 caractères et du code SWIFT/BIC de votre banque. Le code SWIFT d'UniCredit est UNCRITMM ; celui d'Intesa Sanpaolo est BCITITMM.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN italien ?",
      a: "Les erreurs courantes comprennent : omettre le caractère CIN (position 5), confondre le code bancaire ABI avec le code agence CAB, fournir uniquement les coordonnées bancaires domestiques sans le préfixe IT, et saisir un numéro de compte qui n'a pas été complété par des zéros jusqu'à 12 caractères. La longueur de 27 caractères rend une vérification minutieuse importante.",
    },
    {
      q: "Comment configurer les prélèvements automatiques (addebito diretto) avec mon IBAN italien ?",
      a: "Les prélèvements automatiques SEPA (addebito diretto SEPA ou SDD) en Italie nécessitent votre IBAN et un mandat SEPA signé. C'est la norme pour payer les factures de services publics italiens, les impôts (paiements F24), les assurances et les abonnements. Fournissez votre IBAN IT sur le formulaire de mandat. Les banques italiennes traitent les prélèvements SDD sous forme électronique via l'infrastructure SEPA.",
    },
    {
      q: "Puis-je utiliser mon IBAN italien pour les paiements de salaire et d'impôts ?",
      a: "Oui. Les employeurs italiens versent les salaires (stipendio) directement sur votre IBAN IT. Les paiements d'impôts (modèle F24), les cotisations de sécurité sociale (INPS) et les prestations gouvernementales sont tous liés à votre IBAN. Lors de la prise d'un emploi ou de l'inscription à l'INPS, vous serez invité à fournir votre IBAN IT complet à 27 caractères.",
    },
  ],
  belgium: [
    {
      q: "Quel est le format de l'IBAN pour la Belgique ?",
      a: "Un IBAN belge comporte exactement 16 caractères — l'un des plus courts d'Europe. Il commence par BE, 2 chiffres de contrôle, un code bancaire à 3 chiffres, un numéro de compte à 7 chiffres et 2 chiffres de contrôle nationaux. Exemple : BE68 5390 0754 7034.",
    },
    {
      q: "Comment trouver mon IBAN en Belgique ?",
      a: "Votre IBAN belge (BE) est affiché dans la banque en ligne ou l'application mobile de votre banque. KBC, BNP Paribas Fortis, ING Belgium et Belfius affichent tous l'IBAN à 16 caractères dans le récapitulatif du compte. Il figure également sur les relevés bancaires, votre carte de débit et dans les documents de bienvenue de votre banque.",
    },
    {
      q: "La Belgique fait-elle partie de SEPA ?",
      a: "Oui. La Belgique est membre fondateur de la zone euro et de SEPA. Tous les virements en euros, domestiques et transfrontaliers, utilisent l'IBAN. Au sein de SEPA, seul l'IBAN belge (BE) est requis pour les virements de crédit en euros — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Comment l'ancien numéro de compte belge a-t-il été converti en IBAN ?",
      a: "L'ancien numéro de compte bancaire belge à 12 chiffres se mappe directement dans l'IBAN. L'IBAN est : BE + 2 chiffres de contrôle IBAN + le BBAN à 12 chiffres (composé d'un code bancaire à 3 chiffres, d'un numéro de compte à 7 chiffres et de 2 chiffres de contrôle nationaux). La conversion était simple car la structure existante nécessitait uniquement le préfixe BE et les chiffres de contrôle.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir des virements depuis l'extérieur de l'Europe ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE, seul l'IBAN belge (BE) est suffisant. Pour les virements depuis l'extérieur de SEPA (comme depuis les États-Unis, le Royaume-Uni ou l'Asie), l'expéditeur doit inclure à la fois l'IBAN et le code SWIFT/BIC de la banque. Le code SWIFT de KBC est KREDBEBB ; celui de BNP Paribas Fortis est GEBABEBB ; celui d'ING Belgium est BBRUBEBB ; celui de Belfius est GKCCBEBB.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN belge ?",
      a: "Les erreurs les plus fréquentes sont : fournir uniquement l'ancien numéro de compte à 12 chiffres sans le préfixe BE et les chiffres de contrôle IBAN, confondre le code bancaire à 3 chiffres avec le code SWIFT, et transposer des chiffres. Le format compact à 16 caractères rend les IBAN belges relativement faciles à vérifier, mais vérifiez toujours avant de les partager.",
    },
    {
      q: "Comment fonctionnent les prélèvements automatiques (domiciliëring) avec l'IBAN belge ?",
      a: "Les prélèvements automatiques SEPA (domiciliëring/domiciliation) en Belgique nécessitent votre IBAN et un mandat SEPA signé. Ils sont largement utilisés pour les factures de services publics, les primes d'assurance, les abonnements télécom et les cotisations. La Belgique affiche l'un des taux d'adoption des prélèvements automatiques SEPA les plus élevés d'Europe. Fournissez votre IBAN BE sur le formulaire de mandat pour autoriser le créancier.",
    },
  ],
  austria: [
    {
      q: "Quel est le format de l'IBAN pour l'Autriche ?",
      a: "Un IBAN autrichien comporte exactement 20 caractères. Il commence par AT, 2 chiffres de contrôle, un Bankleitzahl à 5 chiffres (BLZ — code de routage bancaire) et un numéro de compte à 11 chiffres. Exemple : AT61 1904 3002 3457 3201.",
    },
    {
      q: "Comment trouver mon IBAN en Autriche ?",
      a: "Votre IBAN autrichien (AT) est affiché dans la banque en ligne (Internetbanking) ou l'application mobile de votre banque. Erste Bank, Raiffeisen, Bank Austria (UniCredit) et BAWAG affichent tous l'IBAN à 20 caractères dans le récapitulatif du compte (Kontoübersicht). Il figure également sur les relevés bancaires (Kontoauszug) et sur votre carte de débit.",
    },
    {
      q: "L'Autriche fait-elle partie de SEPA ?",
      a: "Oui. L'Autriche est membre de la zone euro et de SEPA. Tous les virements en euros, domestiques et transfrontaliers, utilisent exclusivement l'IBAN. Au sein de SEPA, seul l'IBAN autrichien (AT) est requis pour les virements en euros — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Qu'est-ce que le Bankleitzahl (BLZ) autrichien et comment apparaît-il dans l'IBAN ?",
      a: "Le BLZ autrichien est un code de routage bancaire à 5 chiffres qui identifie la banque et l'agence. Il occupe les positions 5-9 de l'IBAN. Erste Bank utilise des plages de BLZ commençant par 20, les banques Raiffeisen commencent par 3, Bank Austria (UniCredit) par 12 et BAWAG par 14. Le BLZ plus le numéro de compte à 11 chiffres forment le BBAN autrichien.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir un virement depuis l'extérieur de l'Europe ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE, seul l'IBAN autrichien (AT) est requis. Pour les virements depuis l'extérieur de SEPA (comme depuis les États-Unis, le Royaume-Uni ou l'Asie), l'expéditeur a besoin à la fois de votre IBAN AT à 20 caractères et du code SWIFT/BIC de votre banque. Le code SWIFT d'Erste Bank est GIBAATWWXXX ; celui de Raiffeisen Zentralbank est RZBAATWW ; celui de Bank Austria est BKAUATWW.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN autrichien ?",
      a: "Les erreurs courantes comprennent : confondre le BLZ à 5 chiffres avec le code SWIFT, fournir uniquement le Kontonummer sans le préfixe AT et le BLZ, et saisir des chiffres de BLZ incorrects (ce qui peut acheminer le paiement vers la mauvaise banque). La longueur de 20 caractères rend les IBAN autrichiens relativement compacts et faciles à vérifier.",
    },
    {
      q: "Puis-je utiliser mon IBAN autrichien pour les paiements de salaire, de loyer et les prestations gouvernementales ?",
      a: "Oui. Les employeurs, propriétaires et organismes gouvernementaux autrichiens utilisent tous l'IBAN pour les paiements de salaire, la perception des loyers et le versement des prestations. Lors de la prise d'un nouvel emploi, de la signature d'un contrat de location ou de l'inscription aux prestations sociales en Autriche, vous serez invité à fournir votre IBAN AT.",
    },
  ],
  ireland: [
    {
      q: "Quel est le format de l'IBAN pour l'Irlande ?",
      a: "Un IBAN irlandais comporte exactement 22 caractères. Il commence par IE, 2 chiffres de contrôle, un code bancaire à 4 caractères (tel que AIBK ou BOFI), un code de tri de succursale à 6 chiffres (NSC) et un numéro de compte à 8 chiffres. Exemple : IE29 AIBK 9311 5212 3456 78.",
    },
    {
      q: "Comment trouver mon IBAN en Irlande ?",
      a: "Votre IBAN irlandais (IE) est affiché dans la banque en ligne ou l'application mobile de votre banque. AIB, Bank of Ireland et Permanent TSB affichent tous l'IBAN à 22 caractères sur la page des détails du compte. Il figure également sur les relevés bancaires. Si vous connaissez votre NSC (National Sort Code) et votre numéro de compte, votre banque peut vous fournir l'IBAN complet.",
    },
    {
      q: "L'Irlande fait-elle partie de SEPA ?",
      a: "Oui. L'Irlande est membre de la zone euro et de SEPA. Les virements en euros depuis d'autres pays de l'UE et de l'EEE sont traités via le virement SEPA (SCT) ou le virement SEPA instantané (SCT Inst). Au sein de SEPA, seul l'IBAN irlandais (IE) est requis — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Qu'est-ce que le National Sort Code (NSC) et comment apparaît-il dans l'IBAN irlandais ?",
      a: "Le NSC est un code à 6 chiffres qui identifie l'agence bancaire dans le système domestique irlandais. Il occupe les positions 9-14 de l'IBAN irlandais, après le code bancaire à 4 caractères. AIB utilise le code bancaire AIBK, Bank of Ireland utilise BOFI et Permanent TSB utilise IPBS. Le NSC + le numéro de compte à 8 chiffres forment la référence de compte domestique.",
    },
    {
      q: "Les virements du Royaume-Uni vers l'Irlande utilisent-ils encore SEPA ?",
      a: "Non. Depuis le Brexit, le Royaume-Uni ne fait plus partie de SEPA. Les virements des banques britanniques vers l'Irlande sont désormais acheminés via SWIFT plutôt que par le système SEPA moins coûteux. Cela peut entraîner des frais potentiellement plus élevés et des délais de traitement plus longs. L'expéditeur a besoin à la fois de votre IBAN IE et du code SWIFT/BIC de votre banque. Le code SWIFT d'AIB est AABORKMM ; celui de Bank of Ireland est BOFIIE2D.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN irlandais ?",
      a: "Les erreurs courantes comprennent : fournir uniquement le NSC et le numéro de compte sans le préfixe IE, confondre le code bancaire à 4 caractères (AIBK, BOFI) avec le code SWIFT, et saisir un code de tri de succursale incorrect. Vérifiez toujours l'IBAN complet à 22 caractères avant de le communiquer à un expéditeur.",
    },
    {
      q: "Puis-je utiliser des IBAN de banques numériques (Revolut, N26) pour les virements SEPA en Irlande ?",
      a: "Oui. Les banques numériques et les prestataires de monnaie électronique opérant en Irlande — notamment Revolut et N26 — émettent des IBAN irlandais (commençant par IE) qui fonctionnent de manière identique aux IBAN des banques traditionnelles pour les paiements SEPA. Vous pouvez recevoir des virements de crédit SEPA, mettre en place des prélèvements automatiques et recevoir des paiements de salaire en utilisant un IBAN IE de banque numérique.",
    },
  ],
  portugal: [
    {
      q: "Quel est le format de l'IBAN pour le Portugal ?",
      a: "Un IBAN portugais comporte exactement 25 caractères. Il commence par PT, 2 chiffres de contrôle, puis le NIB à 21 chiffres (Número de Identificação Bancária), qui se compose d'un code bancaire à 4 chiffres, d'un code agence à 4 chiffres, d'un numéro de compte à 11 chiffres et de 2 chiffres de contrôle. Exemple : PT50 0002 0123 1234 5678 9015 4.",
    },
    {
      q: "Comment trouver mon IBAN au Portugal ?",
      a: "Votre IBAN portugais (PT) est affiché dans la banque en ligne (homebanking) ou l'application mobile de votre banque. Caixa Geral de Depósitos (CGD), Millennium BCP, Novo Banco et Santander Totta affichent tous l'IBAN à 25 caractères sur la page des détails du compte. Il figure également sur les relevés bancaires et dans le contrat de compte.",
    },
    {
      q: "Le Portugal fait-il partie de SEPA ?",
      a: "Oui. Le Portugal est membre de la zone euro et de SEPA. Les virements en euros depuis d'autres pays de l'UE et de l'EEE sont traités via le virement SEPA (SCT) ou le virement SEPA instantané (SCT Inst). Au sein de SEPA, seul l'IBAN portugais (PT) est requis — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Qu'est-ce que le NIB et comment se rapporte-t-il à l'IBAN portugais ?",
      a: "Le NIB (Número de Identificação Bancária) est la référence de compte bancaire portugaise traditionnelle à 21 chiffres, composée d'un code bancaire à 4 chiffres, d'un code agence à 4 chiffres, d'un numéro de compte à 11 chiffres et de 2 chiffres de contrôle. L'IBAN intègre le NIB : PT + 2 chiffres de contrôle IBAN + NIB à 21 chiffres = 25 caractères. Si vous possédez un ancien NIB, la conversion en IBAN est simple.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir des virements depuis l'extérieur de l'Europe ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE, seul l'IBAN portugais (PT) est suffisant. Pour les virements depuis l'extérieur de SEPA (comme depuis le Brésil, les États-Unis ou le Royaume-Uni), l'expéditeur a besoin à la fois de l'IBAN PT à 25 caractères et du code SWIFT/BIC de votre banque. Le code SWIFT de CGD est CGDIPTPL ; celui de Millennium BCP est BCOMPTPL ; celui de Novo Banco est BESCPTPL.",
    },
    {
      q: "Qu'est-ce que Multibanco et peut-il être utilisé à la place de l'IBAN ?",
      a: "Multibanco est le réseau domestique portugais largement utilisé de DAB et de paiement pour les factures, les achats et les virements. Cependant, les références Multibanco sont uniquement domestiques et ne peuvent pas être utilisées pour les virements internationaux. Lorsque vous recevez de l'argent de l'étranger, fournissez toujours votre IBAN PT plutôt qu'une référence Multibanco.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN portugais ?",
      a: "Les erreurs courantes comprennent : fournir uniquement le NIB à 21 chiffres sans le préfixe PT et les chiffres de contrôle IBAN, confondre le code bancaire avec le code agence, et mélanger les chiffres de contrôle du NIB avec les chiffres de contrôle de l'IBAN. Avec 25 caractères, l'IBAN portugais est d'une longueur modérée, vérifiez donc chaque section avec soin.",
    },
  ],
  switzerland: [
    {
      q: "Quel est le format de l'IBAN pour la Suisse ?",
      a: "Un IBAN suisse comporte exactement 21 caractères. Il commence par CH, 2 chiffres de contrôle, un numéro de clearing bancaire à 5 chiffres et un numéro de compte à 12 chiffres. Exemple : CH93 0076 2011 6238 5295 7.",
    },
    {
      q: "Comment trouver mon IBAN en Suisse ?",
      a: "Votre IBAN suisse (CH) est affiché dans la banque en ligne (e-banking) ou l'application mobile de votre banque. UBS, Credit Suisse (désormais intégré à UBS), Raiffeisen Switzerland, PostFinance et les banques cantonales (Kantonalbanken) affichent tous l'IBAN à 21 caractères dans le récapitulatif du compte. Il figure également sur les relevés bancaires et les factures QR.",
    },
    {
      q: "La Suisse fait-elle partie de SEPA ?",
      a: "Partiellement. La Suisse n'est pas membre de l'UE mais participe à SEPA pour les virements libellés en euros. Les paiements SEPA en EUR vers un IBAN suisse bénéficient généralement des tarifs SEPA. Cependant, les virements en CHF sont traités via le système suisse SIC (Swiss Interbank Clearing) et ne font pas partie de SEPA. Pour les CHF entrants depuis l'étranger, SWIFT est utilisé.",
    },
    {
      q: "Quelle est la différence entre les virements SEPA en EUR et les virements SWIFT en CHF vers la Suisse ?",
      a: "Les virements en EUR depuis les pays SEPA vers votre IBAN suisse sont acheminés via le réseau SEPA à faible coût. Les virements en CHF depuis l'étranger passent par SWIFT et peuvent entraîner des frais bancaires correspondants plus élevés. Confirmez toujours avec l'expéditeur s'il envoie des EUR (moins cher via SEPA) ou des CHF (acheminé via SWIFT).",
    },
    {
      q: "Ai-je besoin d'un code BIC pour les virements vers la Suisse ?",
      a: "Pour les virements SEPA en EUR depuis les pays de l'UE/EEE, seul l'IBAN suisse (CH) est généralement suffisant. Pour les virements en CHF depuis l'étranger ou tout virement non SEPA, l'expéditeur a besoin à la fois de l'IBAN et du code SWIFT/BIC de votre banque. Le code SWIFT d'UBS est UBSWCHZH80A ; celui de Raiffeisen Switzerland est RAIFCH22 ; celui de PostFinance est POFICHBEXXX.",
    },
    {
      q: "Que sont les factures QR et comment utilisent-elles l'IBAN suisse ?",
      a: "Les factures QR suisses ont remplacé les anciens bulletins de versement (Einzahlungsschein) et intègrent l'IBAN du créancier directement dans le code QR. Lorsque vous scannez une facture QR avec votre application bancaire, l'IBAN et les détails de paiement sont renseignés automatiquement. Pour recevoir des paiements, votre IBAN apparaît sur vos factures QR.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN suisse ?",
      a: "Les erreurs courantes comprennent : confondre le numéro de clearing à 5 chiffres avec le code SWIFT, fournir l'ancien numéro de compte postal (Postkonto) au lieu de l'IBAN, et envoyer des EUR sur un compte en CHF ou vice versa (ce qui déclenche une conversion). Précisez toujours la devise et vérifiez l'IBAN à 21 caractères avant de le partager.",
    },
  ],
  sweden: [
    {
      q: "Quel est le format de l'IBAN pour la Suède ?",
      a: "Un IBAN suédois comporte exactement 24 caractères. Il commence par SE, 2 chiffres de contrôle, un code bancaire à 3 chiffres et une référence de compte à 17 chiffres qui intègre le numéro de clearing. Exemple : SE45 5000 0000 0583 9825 7466.",
    },
    {
      q: "Comment trouver mon IBAN en Suède ?",
      a: "Votre IBAN suédois (SE) est disponible dans la banque en ligne (internetbank) ou l'application mobile de votre banque. Swedbank, SEB, Handelsbanken et Nordea Sweden affichent tous l'IBAN à 24 caractères sur la page des détails du compte. La correspondance entre le numéro de clearing domestique et l'IBAN varie selon les banques, utilisez donc l'outil de recherche IBAN de votre propre banque en cas de doute.",
    },
    {
      q: "La Suède fait-elle partie de SEPA ?",
      a: "Oui. La Suède est membre de l'UE et participant à part entière de SEPA. Les virements en euros depuis d'autres pays de l'UE et de l'EEE sont traités via le virement SEPA. Cependant, la monnaie de la Suède est la couronne suédoise (SEK), de sorte que les virements SEPA entrants en EUR seront convertis en SEK par votre banque, sauf si vous détenez un compte dédié en EUR.",
    },
    {
      q: "Quelle est la différence entre un numéro de clearing suédois, Bankgiro et IBAN ?",
      a: "Un numéro de clearing (4-5 chiffres) identifie la banque et l'agence pour les virements domestiques. Bankgiro est un système de paiement de factures domestique distinct. L'IBAN intègre le numéro de clearing dans un format international (SE + chiffres de contrôle + code bancaire + référence de compte). Les numéros Bankgiro ne sont pas reconnus en dehors de la Suède — pour les virements internationaux, utilisez toujours votre IBAN SE.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir un virement international en Suède ?",
      a: "Pour les virements SEPA en EUR depuis les pays de l'UE et de l'EEE, seul l'IBAN suédois (SE) est requis. Pour les virements en SEK depuis l'étranger ou les virements depuis des pays hors SEPA, l'expéditeur a besoin à la fois de votre IBAN et du code SWIFT/BIC de votre banque. Le code SWIFT de Swedbank est SWEDSESS ; celui de SEB est ESSESESS ; celui de Handelsbanken est HANDSESS ; celui de Nordea Sweden est NDEASESS.",
    },
    {
      q: "Puis-je recevoir des SEK depuis l'étranger via SEPA ?",
      a: "Non. SEPA ne traite que les virements en EUR. Les virements en SEK depuis l'étranger doivent passer par SWIFT, et l'expéditeur aura besoin de votre IBAN SE et du code SWIFT de votre banque. Si quelqu'un dans l'UE vous envoie des EUR via SEPA, votre banque suédoise les convertira en SEK à son taux de change.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN suédois ?",
      a: "Les erreurs courantes comprennent : fournir un numéro Bankgiro au lieu de l'IBAN (Bankgiro est uniquement domestique), confondre le numéro de clearing avec l'IBAN, et des erreurs dans la référence de compte à 17 chiffres. La correspondance entre les numéros de clearing domestiques et l'IBAN varie selon les banques — confirmez toujours votre IBAN exact via les outils de votre banque.",
    },
  ],
  poland: [
    {
      q: "Quel est le format de l'IBAN pour la Pologne ?",
      a: "Un IBAN polonais comporte exactement 28 caractères — l'un des formats les plus longs en Europe. Il commence par PL, 2 chiffres de contrôle, puis le numéro NRB (Numer Rachunku Bankowego) de 24 chiffres, composé d'une somme de contrôle de 2 chiffres, d'un code de tri bancaire de 8 chiffres et d'un numéro de compte de 16 chiffres. Exemple : PL61 1090 1014 0000 0712 1981 2874.",
    },
    {
      q: "Comment trouver mon IBAN en Pologne ?",
      a: "Votre IBAN PL est disponible dans la banque en ligne (bankowosc internetowa) ou l'application mobile de votre banque. PKO Bank Polski, mBank, ING Bank Slaski, Bank Pekao et Santander Bank Polska affichent tous l'IBAN de 28 caractères sur la page des détails du compte. Si vous disposez de votre NRB (numéro domestique de 26 chiffres), il vous suffit de faire précéder PL et les 2 chiffres de contrôle de l'IBAN.",
    },
    {
      q: "La Pologne fait-elle partie de SEPA ?",
      a: "Oui. La Pologne est membre de l'UE et participe pleinement à SEPA. Les virements en euros provenant d'autres pays de l'UE et de l'EEE peuvent être reçus via SEPA Credit Transfer. Cependant, la monnaie de la Pologne est le zloty (PLN), donc les virements SEPA en EUR peuvent être convertis en PLN sauf si vous détenez un compte dédié en EUR. Les virements en PLN depuis l'étranger passent par SWIFT.",
    },
    {
      q: "Qu'est-ce que le NRB et comment est-il lié à l'IBAN polonais ?",
      a: "Le NRB (Numer Rachunku Bankowego) est le numéro de compte bancaire domestique polonais à 26 chiffres, composé d'une somme de contrôle de 2 chiffres, d'un code de tri bancaire de 8 chiffres et d'un numéro de compte de 16 chiffres. L'IBAN ajoute le code pays PL et 2 chiffres de contrôle IBAN au début : PL + chiffres de contrôle + portion de 24 chiffres du NRB = 28 caractères.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir des virements de l'étranger en Pologne ?",
      a: "Pour les virements SEPA en EUR provenant de pays de l'UE et de l'EEE, seul l'IBAN PL est suffisant. Pour les virements en PLN depuis l'étranger ou tout virement depuis l'extérieur de SEPA, l'expéditeur a besoin à la fois de votre IBAN PL de 28 caractères et du code SWIFT/BIC de votre banque. Le code SWIFT de PKO BP est BPKOPLPW ; celui de mBank est BREXPLPW ; celui d'ING Bank Slaski est INGBPLPW.",
    },
    {
      q: "Les banques polonaises ont-elles des comptes EUR et PLN séparés ?",
      a: "Oui. De nombreuses banques polonaises maintiennent des comptes EUR et PLN séparés, chacun avec son propre IBAN. Si vous recevez régulièrement des EUR depuis l'UE, demandez à votre banque l'ouverture d'un compte EUR dédié pour éviter la conversion automatique en PLN. PKO BP, mBank et ING proposent tous des options de compte multidevises.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN polonais ?",
      a: "Les erreurs courantes incluent : confondre le format domestique NRB avec l'IBAN (le NRB comporte 26 chiffres sans le préfixe PL), transposer des chiffres dans le long IBAN de 28 caractères et fournir un code de tri incorrect. La longueur de 28 caractères rend les IBAN polonais plus sujets aux erreurs de transcription — vérifiez toujours avant de partager.",
    },
    {
      q: "Quels systèmes de paiement domestiques la Pologne utilise-t-elle aux côtés de l'IBAN ?",
      a: "Le système Elixir de la Pologne gère les virements domestiques standard en PLN et Express Elixir fournit des paiements instantanés en PLN — les deux utilisent l'IBAN en interne. BLIK est le système de paiement mobile populaire de la Pologne pour les paiements en magasin et entre particuliers. Pour les virements internationaux, SWIFT et l'IBAN PL sont le standard requis.",
    },
  ],
  norway: [
    {
      q: "Quel est le format de l'IBAN pour la Norvège ?",
      a: "Un IBAN norvégien comporte exactement 15 caractères — l'un des plus courts en Europe. Il commence par NO, 2 chiffres de contrôle, puis le numéro de compte domestique à 11 chiffres (numéro d'enregistrement bancaire de 4 chiffres, numéro de compte de 6 chiffres et 1 chiffre de contrôle). Exemple : NO93 8601 1117 947.",
    },
    {
      q: "Comment trouver mon IBAN en Norvège ?",
      a: "Votre IBAN NO est affiché dans la banque en ligne (nettbank) ou l'application mobile de votre banque. DNB, Nordea Norway, SpareBank 1 et Handelsbanken Norway affichent tous l'IBAN de 15 caractères dans l'aperçu du compte. Il apparaît également sur les relevés bancaires. Comme l'IBAN est simplement NO + chiffres de contrôle + votre numéro de compte à 11 chiffres, il est facile à déduire.",
    },
    {
      q: "La Norvège fait-elle partie de SEPA ?",
      a: "Oui. Bien que la Norvège ne soit pas membre de l'UE, elle fait partie de l'EEE (Espace économique européen) et participe pleinement à SEPA. Les virements en euros provenant de pays de l'UE et de l'EEE sont traités via SEPA Credit Transfer. La monnaie de la Norvège est la couronne norvégienne (NOK), donc les paiements SEPA en EUR seront convertis en NOK par votre banque.",
    },
    {
      q: "Quelle est la différence entre un numéro de compte norvégien et un IBAN ?",
      a: "Un numéro de compte domestique norvégien comporte 11 chiffres : un numéro d'enregistrement bancaire de 4 chiffres, un numéro de compte de 6 chiffres et 1 chiffre de contrôle. L'IBAN enveloppe ceci avec le préfixe NO et 2 chiffres de contrôle : NO + 2 chiffres de contrôle + numéro de compte à 11 chiffres = 15 caractères. Le format court rend les IBAN norvégiens faciles à communiquer.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir un virement de l'étranger en Norvège ?",
      a: "Pour les virements SEPA en EUR provenant de pays de l'UE et de l'EEE, seul l'IBAN NO est requis. Pour les virements en NOK depuis l'étranger ou les virements depuis l'extérieur de SEPA, l'expéditeur a besoin à la fois de l'IBAN et du code SWIFT/BIC de votre banque. Le code SWIFT de DNB est DNBANOKKXXX ; celui de Nordea Norway est NDEANOKK ; celui de SpareBank 1 SR-Bank est SPRONO22.",
    },
    {
      q: "Puis-je recevoir des NOK depuis l'étranger via SEPA ?",
      a: "Non. SEPA ne traite que les virements en EUR. Les virements en NOK depuis l'étranger passent par SWIFT, et l'expéditeur a besoin de votre IBAN NO et du code SWIFT. Si quelqu'un dans l'UE envoie des EUR via SEPA, votre banque norvégienne les convertira en NOK au taux de change de la banque. Comparez ce taux avec le taux interbancaire pour évaluer le coût de conversion.",
    },
    {
      q: "Qu'est-ce que Vipps et peut-il recevoir des virements internationaux ?",
      a: "Vipps est le système de paiement mobile dominant en Norvège pour les paiements domestiques entre particuliers et les paiements marchands. Cependant, Vipps est strictement un système norvégien domestique et ne peut pas recevoir de virements internationaux. Pour l'argent venant de l'étranger, partagez toujours votre IBAN NO (et le code SWIFT pour les expéditeurs hors SEPA) plutôt que vos coordonnées Vipps.",
    },
    {
      q: "Quelles sont les erreurs courantes lors du partage d'un IBAN norvégien ?",
      a: "Les erreurs courantes incluent : fournir uniquement le numéro de compte domestique à 11 chiffres sans le préfixe NO et les chiffres de contrôle, confondre le numéro d'enregistrement bancaire à 4 chiffres avec le code SWIFT et transposer des chiffres. Le format court de 15 caractères rend les IBAN norvégiens faciles à vérifier, mais vérifiez toujours avant de partager avec des expéditeurs internationaux.",
    },
  ],
  pakistan: [
    {
      q: "Quel est le format de l'IBAN pour le Pakistan ?",
      a: "Un IBAN pakistanais comporte exactement 24 caractères. Il commence par le code pays PK, suivi de 2 chiffres de contrôle, d'un code bancaire alphanumérique de 4 caractères (p. ex. SCBL pour Standard Chartered, MUCB pour MCB Bank) et d'un numéro de compte de 16 chiffres. Exemple : PK36 SCBL 0000 0011 2345 6702.",
    },
    {
      q: "Quand le Pakistan a-t-il adopté le système IBAN ?",
      a: "La Banque d'État du Pakistan (SBP) a rendu obligatoire l'adoption de l'IBAN en décembre 2012, avec une migration complète achevée en juillet 2013. Tous les comptes bancaires pakistanais — y compris ceux des banques commerciales, des banques islamiques et des banques de microfinance — disposent désormais d'un IBAN de 24 caractères.",
    },
    {
      q: "Ai-je besoin d'un IBAN pour recevoir de l'argent de l'étranger au Pakistan ?",
      a: "Oui. Tous les virements bancaires internationaux vers le Pakistan nécessitent l'IBAN complet de 24 caractères du bénéficiaire ainsi que le code SWIFT/BIC de la banque. Sans IBAN valide, le paiement peut être retardé ou rejeté par la banque bénéficiaire.",
    },
    {
      q: "Le Pakistan fait-il partie de SEPA ?",
      a: "Non. Le Pakistan ne fait pas partie de SEPA (Espace unique de paiement en euros). Les virements internationaux vers le Pakistan sont traités via le réseau SWIFT, ce qui prend généralement 1 à 3 jours ouvrables et peut entraîner des frais de banque intermédiaire.",
    },
    {
      q: "Comment trouver mon IBAN au Pakistan ?",
      a: "Vous pouvez trouver votre IBAN pakistanais via le portail de banque en ligne ou l'application mobile de votre banque, sur votre relevé bancaire ou au recto/verso de votre carte de débit. Vous pouvez également vous rendre à votre agence bancaire et le demander. Les grandes banques comme HBL, UBL, MCB et Meezan Bank affichent toutes l'IBAN dans leurs applications de banque numérique.",
    },
    {
      q: "Quels sont les codes bancaires des principales banques pakistanaises ?",
      a: "Chaque banque pakistanaise a un code unique de 4 caractères attribué par la SBP : SCBL (Standard Chartered), MUCB (MCB Bank), HABB (Bank Al Habib), UNIL (United Bank Limited), ALFH (Allied Bank), FAYS (Faysal Bank), MEZU (Meezan Bank), BKIP (BankIslami), HMBK (Habib Metropolitan Bank) et JSBL (JS Bank).",
    },
    {
      q: "Les envois de fonds familiaux vers le Pakistan sont-ils taxés ?",
      a: "Non. Dans le cadre des programmes d'incitation de la SBP, les envois de fonds familiaux reçus via des canaux bancaires (y compris les virements basés sur l'IBAN) sont exemptés de retenue à la source et d'impôt sur le revenu. Cela fait des virements bancaires l'un des moyens les plus avantageux fiscalement pour recevoir de l'argent de l'étranger au Pakistan.",
    },
    {
      q: "Les comptes de portefeuille mobile (JazzCash, Easypaisa) peuvent-ils recevoir des virements internationaux via IBAN ?",
      a: "Oui. Les banques de microfinance comme Mobilink Microfinance Bank (JazzCash) et Telenor Microfinance Bank (Easypaisa) émettent des IBAN pour leurs comptes. Si l'expéditeur dispose de l'IBAN correct et du code SWIFT, les virements bancaires internationaux peuvent être crédités sur ces comptes bancaires liés aux portefeuilles mobiles.",
    },
    {
      q: "Que se passe-t-il avec la devise lorsque je reçois un virement international au Pakistan ?",
      a: "La réglementation de la SBP exige que toutes les devises étrangères entrantes soient converties en PKR au taux de change en vigueur de la banque réceptrice le jour du crédit. Les bénéficiaires ne peuvent pas détenir de devises étrangères sur un compte PKR standard. Le taux de conversion varie d'une banque à l'autre, il vaut donc la peine de comparer le taux affiché de votre banque avec le taux interbancaire.",
    },
    {
      q: "Quelle est la différence entre l'IBAN et le numéro de compte au Pakistan ?",
      a: "Votre IBAN contient votre numéro de compte mais y ajoute des informations supplémentaires pour l'acheminement international. Un IBAN pakistanais = PK (pays) + 2 chiffres de contrôle + code bancaire de 4 caractères + votre numéro de compte de 16 chiffres. L'IBAN garantit que votre virement international parvient à la bonne banque et au bon compte sans intervention manuelle.",
    },
  ],
  turkey: [
    {
      q: "Quel est le format de l'IBAN pour la Turquie ?",
      a: "Un IBAN turc comporte exactement 26 caractères. Il commence par le code pays TR, suivi de 2 chiffres de contrôle, d'un code bancaire de 5 chiffres, de 1 chiffre zéro réservé et d'un numéro de compte de 16 chiffres. Exemple : TR33 0006 1005 1978 6457 8413 26.",
    },
    {
      q: "Quand la Turquie a-t-elle commencé à utiliser l'IBAN ?",
      a: "La Turquie a adopté l'IBAN en 2010 sur mandat de l'Agence de régulation et de supervision bancaire (BDDK) et de la Banque centrale de la République de Turquie (TCMB). Depuis lors, tous les comptes bancaires turcs disposent d'un IBAN TR de 26 caractères.",
    },
    {
      q: "La Turquie fait-elle partie de SEPA ?",
      a: "Non. La Turquie n'est pas membre de SEPA (Espace unique de paiement en euros). Tous les virements internationaux vers la Turquie sont acheminés via le réseau SWIFT, ce qui prend généralement 1 à 3 jours ouvrables et peut entraîner des frais de banque correspondante.",
    },
    {
      q: "Comment trouver mon IBAN chez Garanti BBVA, Is Bankasi ou Akbank ?",
      a: "Connectez-vous à l'application mobile ou au portail de banque en ligne de votre banque — votre IBAN TR est affiché sur la page de synthèse du compte. Vous pouvez également le trouver sur votre relevé bancaire ou en visitant une agence. Garanti BBVA, Is Bankasi, Akbank et Yapi Kredi affichent tous l'IBAN de 26 caractères de manière bien visible dans leurs interfaces de banque numérique.",
    },
    {
      q: "Quels codes bancaires les principales banques turques utilisent-elles dans l'IBAN ?",
      a: "Chaque banque turque dispose d'un code bancaire unique à 5 chiffres intégré aux positions 5 à 9 de l'IBAN. Garanti BBVA est 00062, Is Bankasi est 00064, Akbank est 00046, Yapi Kredi est 00067 et Ziraat Bankasi est 00010. Ces codes sont attribués par la TCMB.",
    },
    {
      q: "Que dois-je communiquer pour recevoir un virement de l'étranger ?",
      a: "Communiquez votre IBAN TR complet de 26 caractères et le code SWIFT/BIC de votre banque. Par exemple, le code SWIFT de Garanti BBVA est TGBATRISXXX. Sans les deux, la banque expéditrice peut ne pas être en mesure d'acheminer correctement le virement.",
    },
    {
      q: "L'argent arrivera-t-il en TRY ou dans la devise de l'expéditeur ?",
      a: "Cela dépend du type de compte et de la configuration de votre banque. La plupart des comptes turcs sont des comptes en TRY, donc les devises étrangères entrantes sont converties au taux de change en vigueur de votre banque. Certaines banques turques proposent des sous-comptes en USD ou en EUR — si c'est le cas, vous pouvez demander à l'expéditeur de préciser la devise correcte pour qu'elle arrive sur un compte en devises étrangères et éviter la conversion immédiate en TRY.",
    },
    {
      q: "Le système EFT ou FAST de la Turquie utilise-t-il l'IBAN ?",
      a: "Oui. L'EFT (Elektronik Fon Transferi) pour les virements domestiques de grande valeur le jour même et FAST pour les paiements de détail instantanés utilisent tous deux l'IBAN comme identifiant de compte en Turquie. Ces systèmes sont réservés aux virements domestiques en TRY — pour les virements internationaux, SWIFT et votre IBAN TR sont requis.",
    },
  ],
  romania: [
    {
      q: "Quel est le format de l'IBAN pour la Roumanie ?",
      a: "Un IBAN roumain comporte exactement 24 caractères. Il commence par RO, 2 chiffres de contrôle, un code bancaire alphanumérique de 4 caractères et un numéro de compte de 16 caractères. Exemple : RO49 AAAA 1B31 0075 9384 0000.",
    },
    {
      q: "La Roumanie fait-elle partie de SEPA ?",
      a: "Oui. La Roumanie est membre de SEPA, ce qui signifie que les virements en euros provenant d'autres pays de l'UE et de l'EEE peuvent être traités de manière économique et rapide via le schéma SEPA Credit Transfer. Cependant, la monnaie de la Roumanie est le leu roumain (RON), donc les virements SEPA en euros peuvent être convertis en RON à la réception, sauf si vous détenez un compte en EUR.",
    },
    {
      q: "Quels sont les codes bancaires de BCR, BRD, ING Romania et Banca Transilvania ?",
      a: "Les codes bancaires de 4 caractères intégrés dans les IBAN roumains sont : RNCB pour Banca Comerciala Romana (BCR), BRDE pour BRD Groupe Société Générale, INGB pour ING Romania et BTRL pour Banca Transilvania. Ces codes identifient de manière unique la banque au sein de la structure IBAN.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque roumaine ?",
      a: "Votre IBAN est disponible dans le portail de banque en ligne ou l'application mobile de votre banque, sur votre relevé bancaire ou en le demandant en agence. L'application George de BCR, l'application MyBRD de BRD et BT Pay de Banca Transilvania affichent tous l'IBAN RO complet de 24 caractères sur l'écran des détails du compte.",
    },
    {
      q: "Puis-je recevoir des virements en RON depuis l'étranger en utilisant mon IBAN ?",
      a: "Oui, mais les virements en RON depuis l'extérieur de la Roumanie transitent par SWIFT plutôt que par SEPA. L'expéditeur a besoin de votre IBAN RO de 24 caractères et du code SWIFT/BIC de votre banque. SEPA ne transporte que des EUR, donc tout virement en RON doit passer par le réseau bancaire correspondant SWIFT traditionnel.",
    },
    {
      q: "Ai-je besoin d'un code BIC pour les virements en euros vers la Roumanie depuis l'UE ?",
      a: "Pour les SEPA Credit Transfers au sein de l'UE et de l'EEE, l'IBAN seul suffit — aucun BIC n'est requis. Cependant, pour les virements depuis l'extérieur de SEPA (par exemple, depuis les États-Unis ou le Royaume-Uni), l'expéditeur doit inclure à la fois l'IBAN RO et le code SWIFT/BIC de la banque pour garantir un acheminement correct.",
    },
    {
      q: "Quel est le système de paiement domestique de la Roumanie ?",
      a: "La Banque nationale de Roumanie (BNR) exploite le système de règlement brut en temps réel ReGIS pour les paiements de grande valeur et le système de compensation électronique SENT pour les transactions de détail. Les deux utilisent l'IBAN comme référence de compte. La Roumanie participe également au SEPA Instant Credit Transfer (SCT Inst) via des banques sélectionnées.",
    },
  ],
  czechia: [
    {
      q: "Quel est le format de l'IBAN pour la Tchéquie ?",
      a: "Un IBAN tchèque comporte exactement 24 caractères. Il commence par CZ, 2 chiffres de contrôle, un code bancaire de 4 chiffres, un préfixe de compte de 6 chiffres (complété par des zéros) et un numéro de compte de 10 chiffres. Exemple : CZ65 0800 0000 1920 0014 5399.",
    },
    {
      q: "Comment le numéro de compte domestique tchèque est-il lié à l'IBAN ?",
      a: "Les comptes domestiques tchèques sont exprimés sous la forme préfixe-numérocompte/codebanque (p. ex., 19-2000145399/0800). Pour former l'IBAN, le code bancaire à 4 chiffres occupe les positions 5 à 8, le préfixe à 6 chiffres (complété par des zéros) occupe les positions 9 à 14, et le numéro de compte à 10 chiffres remplit les positions 15 à 24. La Banque nationale tchèque (CNB) fournit un outil de conversion officiel sur son site web.",
    },
    {
      q: "La Tchéquie fait-elle partie de SEPA ?",
      a: "Oui. La Tchéquie est membre de SEPA, permettant des virements en euros économiques et rapides depuis les pays de l'UE et de l'EEE. Cependant, la monnaie domestique est la couronne tchèque (CZK), donc les paiements SEPA entrants en EUR peuvent être convertis en CZK sauf si vous détenez un compte en EUR dédié dans votre banque tchèque.",
    },
    {
      q: "Quels sont les codes bancaires de CSOB, Komercni banka et Ceska sporitelna ?",
      a: "Les codes bancaires à 4 chiffres utilisés dans les IBAN tchèques sont : 0300 pour CSOB (Ceskoslovenska obchodni banka), 0100 pour Komercni banka et 0800 pour Ceska sporitelna (appartenant au groupe Erste). Les autres codes courants incluent 2010 pour Fio banka, 3030 pour Air Bank et 5500 pour Raiffeisenbank Czech.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque tchèque ?",
      a: "Votre IBAN est affiché dans votre banque en ligne ou votre application mobile sur la page des détails du compte. Il apparaît également sur les relevés bancaires et la correspondance. L'application CSOB Smart de CSOB, le portail MojeBanka de Komercni banka et l'application George de Ceska sporitelna affichent tous l'IBAN CZ de 24 caractères.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir un virement international vers la Tchéquie ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE en EUR, seul l'IBAN CZ est requis — aucun code SWIFT n'est nécessaire. Pour les virements en CZK depuis l'extérieur de la Tchéquie, ou tout virement depuis un pays hors SEPA, l'expéditeur a également besoin du code SWIFT/BIC de votre banque.",
    },
    {
      q: "Puis-je recevoir des CZK depuis l'étranger via SEPA ?",
      a: "Non. Les virements SEPA ne transportent que des EUR — vous ne pouvez pas recevoir des CZK via SEPA. Les virements en CZK depuis l'étranger doivent être envoyés via SWIFT, et l'expéditeur aura besoin de votre IBAN CZ ainsi que du code SWIFT de votre banque. Certaines banques tchèques maintiennent à la fois un compte en CZK et un compte en EUR, chacun avec son propre IBAN.",
    },
  ],
  hungary: [
    {
      q: "Quel est le format de l'IBAN pour la Hongrie ?",
      a: "Un IBAN hongrois comporte exactement 28 caractères — l'un des plus longs en Europe. Il commence par HU, 2 chiffres de contrôle, puis le numéro de compte Giro domestique complet de 24 chiffres, qui comprend un code bancaire de 3 chiffres, un code d'agence de 4 chiffres, 1 chiffre de contrôle, un numéro de compte de 15 chiffres et un chiffre de contrôle final. Exemple : HU42 1177 3016 1111 1018 0000 0000.",
    },
    {
      q: "Pourquoi l'IBAN hongrois comporte-t-il 28 caractères ?",
      a: "L'IBAN hongrois comporte 28 caractères parce que le numéro de compte Giro domestique utilisé pour tous les comptes bancaires hongrois est long de 24 chiffres. L'IBAN enveloppe l'intégralité du numéro domestique de 24 chiffres avec le code pays HU et 2 chiffres de contrôle, donnant le format complet de 28 caractères.",
    },
    {
      q: "La Hongrie fait-elle partie de SEPA ?",
      a: "Oui. La Hongrie est membre de l'UE et participe pleinement à SEPA, permettant des virements en euros économiques et rapides vers et depuis d'autres pays SEPA. La monnaie de la Hongrie est le forint (HUF), donc les virements SEPA en EUR peuvent être convertis en HUF sauf si un compte en EUR est spécifié.",
    },
    {
      q: "Quels codes bancaires OTP Bank, K&H Bank et Erste Bank Hungary utilisent-ils ?",
      a: "Les codes bancaires à 3 chiffres intégrés dans les IBAN hongrois (positions 5 à 7) comprennent : 117 pour OTP Bank, 103 pour K&H Bank (membre du groupe KBC), 116 pour Erste Bank Hungary et 108 pour MKB Bank. Le code d'agence occupe les 4 chiffres suivants.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque hongroise ?",
      a: "Votre IBAN HU est affiché dans votre banque en ligne ou votre application mobile sous les détails du compte. L'application OTP SmartBank d'OTP Bank, la K&H mobilbank de K&H et la plateforme George Hungary d'Erste Bank affichent tous l'IBAN de 28 caractères. Il apparaît également sur les relevés bancaires.",
    },
    {
      q: "Quel est le système de paiement instantané de la Hongrie et utilise-t-il l'IBAN ?",
      a: "Oui. L'Azonnali Fizetési Rendszer (AFR) hongrois, lancé en mars 2020, permet des virements en HUF en temps réel 24h/24 et 7j/7 entre toutes les banques hongroises. L'AFR utilise l'IBAN HU complet de 28 caractères comme identifiant de compte. Toutes les banques hongroises sont tenues de participer à l'AFR.",
    },
    {
      q: "Puis-je recevoir des HUF depuis l'étranger via SEPA ?",
      a: "Non. Les virements SEPA ne traitent que des EUR, pas des HUF. Pour recevoir des HUF depuis l'extérieur de la Hongrie, l'expéditeur doit utiliser un virement SWIFT et spécifier HUF comme devise. L'expéditeur aura besoin de votre IBAN HU et du code SWIFT/BIC de votre banque. Sachez que certains services internationaux ne proposent pas la livraison en HUF — dans ce cas, recevoir des EUR et convertir localement peut être la seule option.",
    },
    {
      q: "Ai-je besoin d'un code BIC pour les virements SEPA en EUR vers la Hongrie ?",
      a: "Au sein de SEPA, seul l'IBAN HU est requis pour les virements en EUR — aucun BIC n'est nécessaire. Pour les virements depuis l'extérieur de SEPA (comme depuis les États-Unis ou le Royaume-Uni), ou pour les virements en HUF, l'expéditeur doit inclure le code SWIFT/BIC de votre banque avec l'IBAN.",
    },
  ],
  croatia: [
    {
      q: "Quel est le format de l'IBAN pour la Croatie ?",
      a: "Un IBAN croate comporte exactement 21 caractères. Il commence par HR, 2 chiffres de contrôle, un code de banque et d'agence de 7 chiffres et un numéro de compte de 10 chiffres. Exemple : HR12 1001 0051 8630 0016 0.",
    },
    {
      q: "Quand la Croatie a-t-elle rejoint la zone euro ?",
      a: "La Croatie a rejoint la zone euro le 1er janvier 2023, remplaçant la kuna croate (HRK) par l'euro (EUR) au taux de conversion fixe de 7,53450 HRK par EUR. Depuis lors, tous les comptes bancaires croates sont libellés en EUR et la Croatie est devenue membre à part entière de SEPA.",
    },
    {
      q: "La Croatie fait-elle partie de SEPA ?",
      a: "Oui. La Croatie est membre de SEPA depuis son adhésion à la zone euro en janvier 2023. Les virements en euros provenant d'autres pays de l'UE et de l'EEE sont désormais traités via SEPA Instant Credit Transfer (SCT Inst), avec un règlement en quelques secondes. Cela signifie que recevoir des EUR depuis d'autres pays de l'UE est rapide et peu coûteux.",
    },
    {
      q: "Quels sont les codes SWIFT de Zagrebacka banka et PBZ ?",
      a: "Zagrebacka banka (ZABA, appartenant à UniCredit) a le code SWIFT ZABAHR2X. Privredna banka Zagreb (PBZ, appartenant à Intesa Sanpaolo) utilise PBZGHR2X. Le code SWIFT d'Erste Bank Croatia est ESBCHR22. Ceux-ci sont nécessaires pour les virements entrants depuis l'extérieur de la zone SEPA.",
    },
    {
      q: "Les numéros IBAN croates ont-ils changé lorsque le pays a adopté l'euro ?",
      a: "Non. La structure et le format des IBAN croates (HR, 21 caractères) n'ont pas changé lorsque la Croatie a adopté l'euro. Seule la dénomination en devise des comptes a changé, passant de HRK à EUR. Les numéros de compte existants ont simplement été redenominés ; vous n'avez pas besoin d'un nouvel IBAN.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque croate ?",
      a: "Votre IBAN HR apparaît dans l'application mobile ou la banque en ligne de votre banque sous les détails du compte. L'application m-zaba de Zagrebacka banka, le portail PBZ365 de PBZ et George Croatia d'Erste affichent tous l'IBAN de 21 caractères. Il est également imprimé sur les relevés bancaires.",
    },
    {
      q: "Ai-je besoin d'un code BIC pour recevoir des EUR de l'UE vers la Croatie ?",
      a: "Au sein de SEPA, seul l'IBAN HR est nécessaire pour les virements en euros — aucun BIC n'est requis. Pour les virements depuis l'extérieur de SEPA (par exemple, depuis les États-Unis ou des pays hors UE), l'expéditeur doit inclure à la fois l'IBAN et le code SWIFT/BIC de votre banque.",
    },
  ],
  finland: [
    {
      q: "Quel est le format de l'IBAN pour la Finlande ?",
      a: "Un IBAN finlandais comporte exactement 18 caractères — l'un des IBAN les plus courts en Europe. Il commence par FI, 2 chiffres de contrôle, un code d'agence bancaire de 6 chiffres et un numéro de compte de 8 chiffres avec un chiffre de contrôle à la fin. Exemple : FI21 1234 5600 0007 85.",
    },
    {
      q: "La Finlande fait-elle partie de SEPA ?",
      a: "Oui. La Finlande est membre fondateur de la zone euro et de SEPA. Les virements en euros provenant d'autres pays de l'UE et de l'EEE sont traités via SEPA Instant Credit Transfer (SCT Inst) ou SEPA Credit Transfer (SCT), avec un règlement en quelques secondes ou le jour ouvrable suivant. Le secteur bancaire finlandais participe pleinement aux deux schémas.",
    },
    {
      q: "Comment trouver mon IBAN chez Nordea ou OP Financial Group ?",
      a: "Connectez-vous à la banque en ligne (netbank) ou à l'application mobile de Nordea — votre IBAN FI est affiché dans le résumé du compte. L'application mobile OP d'OP Financial Group et la banque en ligne affichent également l'IBAN de 18 caractères sous les détails du compte. Les clients de Danske Bank Finland peuvent trouver le leur dans l'application Danske Mobile. Votre IBAN est également imprimé sur les relevés de compte.",
    },
    {
      q: "À quoi ressemblent les IBAN finlandais par banque ?",
      a: "Les IBAN finlandais sont identifiables par la partie code d'agence. Les comptes Nordea commencent généralement par FI12, ceux d'OP Financial Group par FI50–FI58, ceux de Danske Bank Finland par FI34 et ceux d'Aktia Bank par FI40. Le code d'agence bancaire de 6 chiffres encode à la fois la banque et l'agence spécifique.",
    },
    {
      q: "Ai-je besoin d'un code BIC pour recevoir des EUR en Finlande depuis l'UE ?",
      a: "Au sein de SEPA, seul l'IBAN FI est requis pour les virements en euros. Le BIC n'est plus obligatoire pour les SEPA Credit Transfers au sein de l'UE et de l'EEE. Pour les virements depuis l'extérieur de SEPA (comme depuis les États-Unis ou le Royaume-Uni), l'expéditeur doit inclure à la fois l'IBAN et le code SWIFT/BIC de votre banque.",
    },
    {
      q: "Qu'est-ce que le système de paiement Siirto en Finlande ?",
      a: "Siirto est le service de paiement instantané domestique de la Finlande qui permet des virements en EUR en temps réel entre les comptes bancaires finlandais, en utilisant l'IBAN (ou le numéro de téléphone lié à un compte) comme identifiant. Il est utilisé pour les paiements entre particuliers et les paiements marchands, mais est distinct des virements internationaux SEPA — Siirto ne fonctionne qu'entre des comptes bancaires finlandais.",
    },
    {
      q: "Puis-je utiliser mon IBAN finlandais pour recevoir un salaire ou des prestations Kela ?",
      a: "Oui. Les employeurs finlandais et l'institution d'assurance sociale Kela versent les salaires et les prestations directement sur votre IBAN FI. Lorsque vous commencez un emploi en Finlande ou demandez un soutien Kela, il vous sera demandé de fournir l'IBAN de votre compte bancaire. Assurez-vous d'enregistrer le bon IBAN FI de 18 caractères pour éviter les retards de paiement.",
    },
  ],
  greece: [
    {
      q: "Quel est le format de l'IBAN pour la Grèce ?",
      a: "Un IBAN grec comporte exactement 27 caractères. Il commence par GR, 2 chiffres de contrôle, un code bancaire de 3 chiffres, un code d'agence de 4 chiffres et un numéro de compte de 16 chiffres. Exemple : GR16 0110 1250 0000 0001 2300 695.",
    },
    {
      q: "La Grèce fait-elle partie de SEPA ?",
      a: "Oui. La Grèce est membre de la zone euro et de SEPA. Les virements en euros provenant d'autres pays de l'UE et de l'EEE sont traités via SEPA Credit Transfer (SCT) ou SEPA Instant Credit Transfer (SCT Inst). Pour les virements au sein de SEPA, seul l'IBAN GR est requis — aucun code BIC/SWIFT n'est nécessaire.",
    },
    {
      q: "Quels codes bancaires Alpha Bank, Eurobank, Piraeus Bank et la Banque nationale de Grèce utilisent-ils ?",
      a: "Les codes bancaires à 3 chiffres dans les IBAN grecs sont : 014 pour Alpha Bank, 026 pour Eurobank, 017 pour Piraeus Bank et 011 pour la Banque nationale de Grèce (Ethniki Trapeza). Ces codes apparaissent aux positions 5 à 7 de l'IBAN de 27 caractères.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque grecque ?",
      a: "Connectez-vous à la banque en ligne ou à l'application mobile de votre banque — votre IBAN GR est généralement affiché dans l'aperçu du compte. Alpha Web Banking d'Alpha Bank, e-Banking d'Eurobank et winbank de Piraeus Bank affichent tous l'IBAN de 27 caractères. Il apparaît également sur les relevés bancaires et la correspondance.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir un virement depuis l'extérieur de l'UE vers la Grèce ?",
      a: "Pour les virements SEPA au sein de l'UE et de l'EEE en EUR, aucun code SWIFT n'est nécessaire — seul l'IBAN GR suffit. Pour les virements depuis des pays hors SEPA (comme les États-Unis, le Royaume-Uni ou l'Australie), l'expéditeur a besoin à la fois de votre IBAN GR de 27 caractères et du code SWIFT/BIC de votre banque.",
    },
    {
      q: "Combien de temps faut-il pour recevoir un virement SEPA sur un compte bancaire grec ?",
      a: "Les SEPA Credit Transfers (SCT) arrivent généralement en un jour ouvrable. Les SEPA Instant Credit Transfers (SCT Inst) peuvent se régler en quelques secondes si les banques expéditrice et réceptrice prennent en charge le schéma instantané. La plupart des grandes banques grecques prennent en charge SCT Inst pour les paiements entrants de la zone euro.",
    },
    {
      q: "Les Grecs vivant à l'étranger peuvent-ils recevoir des envois de fonds en utilisant leur IBAN grec ?",
      a: "Oui, mais l'arrangement fonctionne en sens inverse — ce sont les Grecs vivant en Grèce qui peuvent recevoir des envois de fonds de Grecs vivant à l'étranger. Pour envoyer un virement vers un compte bancaire grec depuis l'extérieur de l'UE, l'expéditeur doit fournir l'IBAN GR complet de 27 caractères du bénéficiaire et le code SWIFT de la banque. Si l'expéditeur est au sein de SEPA, l'IBAN seul suffit.",
    },
    {
      q: "Qu'est-ce que DIAS et comment est-il lié à l'IBAN grec ?",
      a: "DIAS (Diateraiki Agora Simeoseon) est l'organisation grecque de compensation et de règlement interbancaires qui exploite l'infrastructure de paiement domestique, y compris le traitement du schéma SEPA en Grèce. Tous les virements bancaires grecs — domestiques et transfrontaliers — sont traités via DIAS en utilisant l'IBAN comme identifiant de compte.",
    },
  ],
  cyprus: [
    {
      q: "Quel est le format de l'IBAN pour Chypre ?",
      a: "Un IBAN chypriote comporte exactement 28 caractères. Il commence par CY, 2 chiffres de contrôle, un code bancaire de 3 chiffres, un code d'agence de 5 chiffres et un numéro de compte de 16 caractères. Exemple : CY17 0020 0128 0000 0012 0052 7600.",
    },
    {
      q: "Chypre fait-elle partie de SEPA ?",
      a: "Oui. Chypre est membre de la zone euro et de SEPA. Les virements en euros provenant d'autres pays de l'UE et de l'EEE peuvent être traités via SEPA Credit Transfer ou SEPA Instant Credit Transfer. Seul l'IBAN CY est nécessaire pour les virements SEPA — aucun BIC n'est requis.",
    },
    {
      q: "Quels sont les codes bancaires de la Bank of Cyprus et de la Hellenic Bank ?",
      a: "La Bank of Cyprus utilise le code bancaire 002 et la Hellenic Bank le code 005. Ces codes à 3 chiffres apparaissent aux positions 5 à 7 de l'IBAN chypriote de 28 caractères. D'autres banques comme Eurobank Cyprus et Alpha Bank Cyprus ont leurs propres codes distincts.",
    },
    {
      q: "Comment trouver mon IBAN à la Bank of Cyprus ou à la Hellenic Bank ?",
      a: "Connectez-vous à la banque en ligne 1bank de la Bank of Cyprus ou à l'application BOC — votre IBAN CY apparaît sur la page des détails du compte. Le portail HB Direct de Hellenic Bank et l'application mobile affichent également l'IBAN de 28 caractères. Il apparaît également sur les relevés bancaires et dans la lettre de bienvenue reçue lors de l'ouverture du compte.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour les virements depuis l'extérieur de l'UE vers Chypre ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE en EUR, seul l'IBAN CY est nécessaire. Pour les virements depuis des pays hors SEPA — comme le Royaume-Uni après le Brexit, la Russie ou les États-Unis — l'expéditeur a besoin à la fois de l'IBAN CY de 28 caractères et du code SWIFT/BIC de la banque. Le code SWIFT de la Bank of Cyprus est BCYPCY2N ; celui de la Hellenic Bank est HEBACY2N.",
    },
    {
      q: "Puis-je recevoir des USD ou des GBP sur un compte bancaire chypriote ?",
      a: "Oui. Les principales banques chypriotes, dont la Bank of Cyprus et la Hellenic Bank, proposent des comptes multidevises pouvant recevoir des USD, des GBP et des EUR sans conversion automatique en AED. Chaque position en devise peut avoir son propre IBAN ou partager le même IBAN avec un spécificateur de devise. Confirmez auprès de votre banque si vous avez besoin d'un numéro de compte séparé pour les encaissements en devises étrangères.",
    },
    {
      q: "Des contrôles de conformité renforcés s'appliquent-ils aux grands virements vers Chypre ?",
      a: "Oui. Le secteur bancaire chypriote applique une diligence raisonnable renforcée pour certains virements internationaux de grande valeur ou complexes, conformément aux réglementations de l'UE en matière de lutte contre le blanchiment d'argent et aux exigences de la Banque centrale de Chypre. Pour les virements entrants importants, votre banque peut demander une documentation sur l'objet et l'origine de la transaction. Planifier à l'avance et prévenir votre banque avant de recevoir un virement important peut éviter les retards.",
    },
  ],
  luxembourg: [
    {
      q: "Quel est le format de l'IBAN pour le Luxembourg ?",
      a: "Un IBAN luxembourgeois comporte exactement 20 caractères. Il commence par LU, 2 chiffres de contrôle, un code bancaire de 3 chiffres et un numéro de compte de 13 chiffres. Exemple : LU28 0019 4006 4475 0000.",
    },
    {
      q: "Le Luxembourg fait-il partie de SEPA ?",
      a: "Oui. Le Luxembourg est membre fondateur de la zone euro et de SEPA. Les virements en euros provenant d'autres pays de l'UE et de l'EEE sont traités via SEPA Credit Transfer (SCT) ou SEPA Instant Credit Transfer (SCT Inst). Seul l'IBAN LU est nécessaire pour les virements SEPA entrants — aucun BIC n'est requis.",
    },
    {
      q: "Quels codes bancaires BGL BNP Paribas, BCEE (Spuerkeess) et Banque de Luxembourg utilisent-ils ?",
      a: "Codes bancaires luxembourgeois (3 chiffres, positions 5 à 7 de l'IBAN) : BCEE (Spuerkeess) utilise 001, BGL BNP Paribas utilise 002 et ING Luxembourg utilise 030. La Banque de Luxembourg et Raiffeisen Luxembourg disposent chacune de codes à 3 chiffres distincts attribués par la Banque centrale du Luxembourg.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque luxembourgeoise ?",
      a: "Votre IBAN LU est affiché dans la banque en ligne ou l'application mobile de votre banque sous les détails du compte. La banque en ligne LuxTrust de BCEE, l'application Hello bank! de BGL BNP Paribas et la banque en ligne d'ING Luxembourg affichent tous l'IBAN de 20 caractères. Il apparaît également sur les relevés bancaires et dans vos documents de bienvenue du compte.",
    },
    {
      q: "Les banques luxembourgeoises proposent-elles des comptes multidevises ?",
      a: "Oui. Les banques privées et de détail luxembourgeoises proposent régulièrement des comptes multidevises en EUR, USD, GBP, CHF et d'autres devises, reflétant le statut de centre financier international du pays. Chaque compte en devise peut avoir son propre IBAN ou partager l'IBAN du compte principal avec un code de devise. Confirmez auprès de votre banque quel compte et IBAN fournir à l'expéditeur.",
    },
    {
      q: "Quel est le lien du Luxembourg avec TARGET2 ?",
      a: "Le Luxembourg est connecté à TARGET2, le système de règlement brut en temps réel de l'Eurosystème pour les paiements en euros de grande valeur. La Banque centrale du Luxembourg en est la composante nationale. Pour les virements transfrontaliers en EUR de grande valeur, les paiements peuvent se régler via TARGET2 le jour même, en utilisant votre IBAN LU comme identifiant de compte.",
    },
    {
      q: "Ai-je besoin d'un code SWIFT pour recevoir un virement depuis l'extérieur de l'UE vers le Luxembourg ?",
      a: "Pour les virements SEPA depuis les pays de l'UE et de l'EEE, seul l'IBAN LU est requis. Pour les virements depuis l'extérieur de SEPA — par exemple depuis les États-Unis, le Royaume-Uni ou la Suisse pour des devises hors SEPA — l'expéditeur a également besoin du code SWIFT/BIC de votre banque. Le code SWIFT de BGL BNP Paribas est BGLLLULL ; celui de BCEE est BCEELULL.",
    },
  ],
  "united-arab-emirates": [
    {
      q: "Quel est le format de l'IBAN pour les Émirats arabes unis ?",
      a: "Un IBAN des EAU comporte exactement 23 caractères. Il commence par le code pays AE, 2 chiffres de contrôle, un code bancaire à 3 chiffres et un numéro de compte à 16 chiffres. Exemple : AE07 0331 2345 6789 0123 456.",
    },
    {
      q: "Quand les EAU ont-ils commencé à utiliser l'IBAN ?",
      a: "La Banque centrale des EAU (CBUAE) a rendu l'IBAN obligatoire pour tous les comptes bancaires à partir de mai 2011. Depuis lors, chaque compte bancaire des EAU possède un IBAN AE à 23 caractères, et il s'agit du format requis pour tous les virements interbancaires nationaux via UAEFTS et pour les virements internationaux.",
    },
    {
      q: "Les EAU font-ils partie de SEPA ?",
      a: "Non. Les EAU ne font pas partie de SEPA. Tous les virements internationaux vers des comptes bancaires des EAU sont traités via le réseau SWIFT. Les virements nationaux sont traités via le Système de transfert de fonds des EAU (UAEFTS), qui fonctionne 24h/24 et 7j/7.",
    },
    {
      q: "Quels sont les codes bancaires d'Emirates NBD, ADCB, FAB et Mashreq ?",
      a: "Codes bancaires des EAU (3 chiffres, positions 5 à 7 de l'IBAN) : Emirates NBD est 033, Abu Dhabi Commercial Bank (ADCB) est 030, First Abu Dhabi Bank (FAB) est 035 et Mashreq est 020. Les banques plus petites et les banques islamiques ont également des codes attribués. Le code bancaire identifie l'établissement au sein de l'IBAN à 23 caractères.",
    },
    {
      q: "Comment trouver mon IBAN aux EAU ?",
      a: "Votre IBAN AE est affiché dans l'application mobile ou la banque en ligne de votre banque, dans les détails du compte. L'application Liv. d'Emirates NBD, la banque mobile d'ADCB, l'application mobile de FAB et le portail NeoBiz de Mashreq affichent tous l'IBAN à 23 caractères. Il figure également sur les relevés bancaires et la correspondance de votre banque.",
    },
    {
      q: "Puis-je recevoir des devises étrangères sur mon compte bancaire aux EAU ?",
      a: "Oui. Les principales banques des EAU proposent des comptes multidevises et des comptes d'épargne en devises étrangères pouvant recevoir des USD, EUR, GBP et d'autres grandes devises sans conversion automatique en AED. Ces comptes ont généralement leur propre IBAN distinct ou un numéro de compte désigné par devise. Demandez à votre banque quel IBAN fournir pour chaque devise.",
    },
    {
      q: "Que dois-je donner à un expéditeur pour recevoir de l'argent aux EAU ?",
      a: "Pour les virements nationaux aux EAU, votre IBAN AE à 23 caractères suffit — aucun code SWIFT n'est nécessaire pour UAEFTS. Pour les virements internationaux depuis l'étranger, fournissez votre IBAN AE complet et le code SWIFT/BIC de votre banque. Par exemple, le code SWIFT d'Emirates NBD est EBILAEAD ; celui d'ADCB est ADCBAEAD ; celui de FAB est NBADAEAA.",
    },
    {
      q: "Combien de temps faut-il pour recevoir un virement SWIFT international aux EAU ?",
      a: "Les virements SWIFT internationaux vers les banques des EAU prennent généralement 1 à 3 jours ouvrés, selon le pays expéditeur, les banques intermédiaires impliquées et les décalages horaires. Les virements en provenance des pays du CCG (Arabie saoudite, Koweït, Qatar, Bahreïn, Oman) arrivent souvent plus rapidement en raison de relations bancaires correspondantes directes. L'heure limite d'encaissement des virements entrants de votre banque influence également le traitement le jour même ou le lendemain.",
    },
  ],
  "saudi-arabia": [
    {
      q: "Quel est le format de l'IBAN pour l'Arabie saoudite ?",
      a: "Un IBAN saoudien comporte exactement 24 caractères. Il commence par SA, 2 chiffres de contrôle, un code bancaire à 2 chiffres et un numéro de compte à 18 chiffres. Exemple : SA03 8000 0000 6080 1016 7519.",
    },
    {
      q: "Quand l'Arabie saoudite a-t-elle adopté l'IBAN ?",
      a: "SAMA (Autorité monétaire d'Arabie saoudite, désormais la Banque centrale saoudienne) a rendu l'adoption de l'IBAN obligatoire en 2010. Tous les comptes bancaires saoudiens sont dotés d'un IBAN SA à 24 caractères depuis la fin du déploiement complet. Le système SARIE de SAMA utilise également l'IBAN comme identifiant de compte standard pour les virements nationaux de grande valeur.",
    },
    {
      q: "L'Arabie saoudite fait-elle partie de SEPA ?",
      a: "Non. L'Arabie saoudite n'est pas membre de SEPA. Les virements internationaux vers l'Arabie saoudite sont traités via le réseau SWIFT. SEPA est propre aux pays européens et le système bancaire saoudien se connecte au niveau mondial via SWIFT.",
    },
    {
      q: "Quels codes bancaires utilisent Al Rajhi Bank, SNB, Riyad Bank et Banque Saudi Fransi ?",
      a: "Codes bancaires saoudiens (2 chiffres, positions 5 à 6 de l'IBAN) : Al Rajhi Bank est 05, Saudi National Bank (SNB) est 10, Riyad Bank est 07 et Banque Saudi Fransi est 55. Arab National Bank est 30 et Saudi British Bank (SABB) est 45.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque saoudienne ?",
      a: "Votre IBAN SA est disponible dans l'application mobile ou la banque en ligne de votre banque, dans les détails du compte. L'application mobile d'Al Rajhi Bank, l'application AlAhli Digital de SNB et Riyad Online de Riyad Bank affichent tous l'IBAN à 24 caractères. Il figure également sur les relevés bancaires. Pour Al Rajhi Bank, l'IBAN est affiché de manière bien visible sur l'écran récapitulatif du compte.",
    },
    {
      q: "Qu'est-ce que SARIE et comment utilise-t-il l'IBAN ?",
      a: "SARIE (Saudi Arabia Real Time Gross Settlement) est le système de paiement interbancaire de grande valeur de la Banque centrale saoudienne. Il traite en temps réel tous les virements nationaux en SAR de grande valeur, en utilisant l'IBAN comme identifiant de compte. L'Arabie saoudite dispose également du système de paiements instantanés (IP) pour les virements de détail en temps réel, lui aussi basé sur l'IBAN.",
    },
    {
      q: "Que dois-je fournir pour recevoir un virement international vers l'Arabie saoudite ?",
      a: "Fournissez votre IBAN SA complet à 24 caractères et le code SWIFT/BIC de votre banque. Le code SWIFT d'Al Rajhi Bank est RJHISARI ; celui de SNB est NCBKSAJE ; celui de Riyad Bank est RIBLSARI ; celui de Banque Saudi Fransi est BSFRSARI.",
    },
    {
      q: "Les virements entrants importants vers l'Arabie saoudite sont-ils soumis à déclaration ?",
      a: "Oui. La réglementation saoudienne administrée par SAMA oblige les banques à déclarer les virements internationaux dépassant certains seuils dans le cadre du respect des règles de lutte contre le blanchiment d'argent (LCB). De plus, SAMA peut exiger une documentation relative à l'objet des virements entrants importants. Si vous attendez un virement de grande valeur, prévenez votre banque à l'avance et préparez-vous à fournir les justificatifs nécessaires.",
    },
  ],
  qatar: [
    {
      q: "Quel est le format de l'IBAN pour le Qatar ?",
      a: "Un IBAN qatari comporte exactement 29 caractères. Il commence par QA, 2 chiffres de contrôle, un code bancaire alphanumérique à 4 caractères et un numéro de compte à 21 caractères. Exemple : QA58 DOHB 0000 1234 5678 90AB CDEF G.",
    },
    {
      q: "Le Qatar fait-il partie de SEPA ?",
      a: "Non. Le Qatar n'est pas membre de SEPA. Tous les virements internationaux vers le Qatar sont traités via le réseau SWIFT. Les virements nationaux sont traités via le Système de paiement du Qatar (QPS) et le système de règlement brut en temps réel du Qatar (QRTGS).",
    },
    {
      q: "Quels sont les codes bancaires de QNB, Commercial Bank et Doha Bank ?",
      a: "Codes bancaires qataris (4 caractères, positions 5 à 8 de l'IBAN) : Qatar National Bank (QNB) utilise QNBA, Commercial Bank of Qatar utilise CBQA, Doha Bank utilise DOHB, Qatar Islamic Bank utilise QIIB et Masraf Al Rayan utilise MARK.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque qatarie ?",
      a: "Votre IBAN QA est disponible via l'application mobile ou la banque en ligne de votre banque. L'application Mobile Banking de QNB, l'application CBQ Mobile de Commercial Bank et la banque mobile de Doha Bank affichent tous l'IBAN à 29 caractères dans les détails du compte. Il figure également sur les relevés bancaires.",
    },
    {
      q: "Que dois-je donner à un expéditeur pour recevoir un virement vers le Qatar ?",
      a: "Fournissez votre IBAN QA complet à 29 caractères et le code SWIFT/BIC de votre banque. Le code SWIFT de QNB est QNBAQAQA ; celui de Commercial Bank est CBQAQAQA ; celui de Doha Bank est DOHBQAQA. Sans ces deux éléments, la banque expéditrice pourrait ne pas être en mesure d'acheminer le paiement correctement.",
    },
    {
      q: "Puis-je recevoir des devises étrangères sur un compte bancaire qatari sans conversion en QAR ?",
      a: "Oui. Les principales banques qataries, dont QNB et Commercial Bank, proposent des comptes en devises étrangères en USD, EUR et GBP. Si vous demandez à l'expéditeur de virer dans une devise étrangère spécifique et que vous détenez un compte dans cette devise, les fonds peuvent être crédités sans conversion en QAR. Confirmez l'IBAN ou le numéro de compte du compte en devises avec votre banque.",
    },
    {
      q: "Combien de temps prend un virement international vers le Qatar ?",
      a: "Les virements SWIFT vers le Qatar arrivent généralement en 1 à 2 jours ouvrés. QNB, l'une des plus grandes banques du Moyen-Orient et d'Afrique, entretient des relations de correspondance directes avec les principales banques internationales, ce qui peut accélérer le traitement. Les virements en provenance des pays du CCG (EAU, Arabie saoudite, Koweït, Bahreïn) se règlent souvent plus rapidement que les virements intercontinentaux.",
    },
  ],
  kuwait: [
    {
      q: "Quel est le format de l'IBAN pour le Koweït ?",
      a: "Un IBAN koweïtien comporte exactement 30 caractères — l'un des plus longs au monde. Il commence par KW, 2 chiffres de contrôle, un code bancaire alphanumérique à 4 caractères et un numéro de compte à 22 caractères. Exemple : KW81 CBKU 0000 0000 0000 1234 5601 01.",
    },
    {
      q: "Pourquoi l'IBAN koweïtien comporte-t-il 30 caractères ?",
      a: "L'IBAN koweïtien à 30 caractères reflète le système de numérotation des comptes nationaux étendu utilisé par les banques koweïtiennes. La partie numéro de compte à 22 caractères au sein de l'IBAN est plus longue que celle de la plupart des autres pays, ce qui entraîne une longueur totale de l'IBAN de 30 caractères.",
    },
    {
      q: "Le Koweït fait-il partie de SEPA ?",
      a: "Non. Le Koweït n'est pas membre de SEPA. Tous les virements internationaux vers le Koweït transitent par le réseau SWIFT. Au niveau national, le Système de règlement automatisé du Koweït (KASS) traite les virements interbancaires en KWD à l'aide de l'IBAN.",
    },
    {
      q: "Quels sont les codes bancaires de NBK, KFH, Gulf Bank et Burgan Bank ?",
      a: "Codes bancaires koweïtiens (4 caractères, positions 5 à 8 de l'IBAN) : National Bank of Kuwait (NBK) utilise NBOK, Kuwait Finance House (KFH) utilise KFHO, Gulf Bank utilise GULF et Burgan Bank utilise BURG. Commercial Bank of Kuwait utilise COMB.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque koweïtienne ?",
      a: "Votre IBAN KW est disponible dans l'application mobile ou le portail de banque en ligne de votre banque, dans les détails du compte. La banque mobile de NBK, l'application de KFH et la banque numérique de Gulf Bank affichent tous l'IBAN à 30 caractères. Vous pouvez également le trouver sur votre relevé bancaire ou en appelant le service client de votre banque.",
    },
    {
      q: "Que dois-je donner à un expéditeur pour recevoir un virement vers le Koweït ?",
      a: "Fournissez votre IBAN KW complet à 30 caractères et le code SWIFT/BIC de votre banque. Le code SWIFT de NBK est NBOKKWKW ; celui de KFH est KFHOKWKW ; celui de Gulf Bank est GULBKWKW. Sans le code SWIFT, les banques internationales ne peuvent pas acheminer le paiement vers le bon établissement koweïtien.",
    },
    {
      q: "Quel est le taux de change actuel du KWD et pourquoi est-il important pour les virements ?",
      a: "Le dinar koweïtien (KWD) est rattaché à un panier de devises et est actuellement l'une des monnaies les plus valorisées en termes de taux de change nominal. Lors de la réception d'un virement international, le taux de change KWD appliqué par la banque ou le service expéditeur peut affecter considérablement le montant reçu. Comparez toujours le taux du marché médian avec le taux proposé par votre prestataire — l'écart sur le KWD peut être important pour les virements de grande valeur.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers le Koweït ?",
      a: "Les virements SWIFT internationaux vers le Koweït prennent généralement 1 à 3 jours ouvrés. Les virements en provenance des pays du CCG (EAU, Arabie saoudite, Qatar, Bahreïn) se règlent souvent plus rapidement grâce aux relations bancaires directes. NBK, l'une des banques koweïtiennes les plus connectées à l'international, traite généralement les crédits SWIFT entrants plus rapidement que les établissements nationaux plus petits.",
    },
  ],
  bahrain: [
    {
      q: "Quel est le format de l'IBAN pour Bahreïn ?",
      a: "Un IBAN bahreïni comporte exactement 22 caractères. Il commence par BH, 2 chiffres de contrôle, un code bancaire alphanumérique à 4 caractères et un numéro de compte à 14 caractères. Exemple : BH67 BMAG 0000 1299 1234 56.",
    },
    {
      q: "Bahreïn fait-il partie de SEPA ?",
      a: "Non. Bahreïn n'est pas membre de SEPA. Les virements internationaux vers Bahreïn sont traités via le réseau SWIFT. Au niveau national, le Système de règlement interbancaire de Bahreïn (BISS) et la Chambre de compensation automatisée de Bahreïn (BACH) traitent les paiements interbancaires en BHD à l'aide de l'IBAN.",
    },
    {
      q: "Quels sont les codes bancaires d'Ahli United Bank, NBB, BBK et Ithmaar Bank ?",
      a: "Codes bancaires bahreïnis (4 caractères, positions 5 à 8 de l'IBAN) : Ahli United Bank utilise AUBB, National Bank of Bahrain (NBB) utilise NBOB, Bank of Bahrain and Kuwait (BBK) utilise BBKU, Ithmaar Bank utilise ITHMB et Al Salam Bank utilise BISLB.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque bahreïnie ?",
      a: "Votre IBAN BH est disponible dans la banque en ligne ou l'application mobile de votre banque, dans les détails du compte. La banque en ligne d'Ahli United Bank, l'application mobile de NBB et le portail de banque électronique de BBK affichent tous l'IBAN à 22 caractères. Il figure également sur les relevés bancaires et la correspondance liée au compte.",
    },
    {
      q: "Que dois-je fournir pour recevoir un virement international vers Bahreïn ?",
      a: "Fournissez votre IBAN BH complet à 22 caractères et le code SWIFT/BIC de votre banque. Le code SWIFT d'Ahli United Bank est AUBBBHBM ; celui de NBB est NBOBBHBM ; celui de BBK est BBKUBHBM. Sans ces deux éléments, la banque expéditrice pourrait avoir du mal à acheminer le paiement correctement.",
    },
    {
      q: "Le BHD est-il rattaché au USD et qu'est-ce que cela implique pour les virements ?",
      a: "Oui. Le dinar bahreïni (BHD) est rattaché au dollar américain à un taux fixe de 0,376 BHD par USD. Ce rattachement est maintenu depuis des décennies et rend la conversion USD-BHD totalement prévisible — 1 USD équivaut toujours à environ 0,376 BHD. Si vous recevez un virement en USD, vous pouvez calculer le montant exact en BHD avant l'arrivée des fonds.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers Bahreïn ?",
      a: "Les virements SWIFT vers Bahreïn prennent généralement 1 à 2 jours ouvrés. Bahreïn est un centre bancaire régional et les grandes banques comme Ahli United Bank et NBB disposent de solides réseaux de banque correspondante avec des banques du Moyen-Orient, d'Europe et des États-Unis. Les virements en provenance des pays du CCG se règlent souvent le jour même ou le jour ouvré suivant.",
    },
  ],
  jordan: [
    {
      q: "Quel est le format de l'IBAN pour la Jordanie ?",
      a: "Un IBAN jordanien comporte exactement 30 caractères. Il commence par JO, 2 chiffres de contrôle, un code bancaire alphanumérique à 4 caractères, 4 chiffres d'information de succursale et un numéro de compte à 18 caractères. Exemple : JO94 CBJO 0010 0000 0000 0131 0003 02.",
    },
    {
      q: "La Jordanie fait-elle partie de SEPA ?",
      a: "Non. La Jordanie n'est pas membre de SEPA. Les virements internationaux vers la Jordanie sont traités via le réseau SWIFT. La Banque centrale de Jordanie (CBJ) réglemente les paiements internationaux et, au niveau national, le Système de paiement électronique jordanien (JoPACC) gère les virements interbancaires.",
    },
    {
      q: "Quels sont les codes bancaires d'Arab Bank, Housing Bank et Jordan Islamic Bank ?",
      a: "Codes bancaires jordaniens (4 caractères, positions 5 à 8 de l'IBAN) : Arab Bank utilise ARAB, Housing Bank for Trade and Finance utilise HBHO, Jordan Islamic Bank utilise JIBS, Cairo Amman Bank utilise CABJ et Bank of Jordan utilise BOFJ.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque jordanienne ?",
      a: "Votre IBAN JO est disponible dans la banque en ligne ou l'application mobile de votre banque. La plateforme Arab Online d'Arab Bank et la banque numérique de Jordan Islamic Bank affichent tous deux l'IBAN à 30 caractères dans les détails du compte. Il figure également sur les relevés bancaires. Vous pouvez le demander dans n'importe quelle agence si vous ne le trouvez pas en ligne.",
    },
    {
      q: "Que dois-je fournir pour recevoir un virement de l'étranger vers la Jordanie ?",
      a: "Fournissez votre IBAN JO complet à 30 caractères et le code SWIFT/BIC de votre banque. Le code SWIFT d'Arab Bank est ARABJOAX ; celui de Housing Bank est HBHOJOA2 ; celui de Jordan Islamic Bank est JIBSJOA1. L'étendue du réseau régional d'Arab Bank en fait un choix particulièrement adapté pour recevoir des virements des pays du Golfe.",
    },
    {
      q: "Le JOD est-il rattaché au USD ?",
      a: "Oui. Le dinar jordanien (JOD) est rattaché au dollar américain à un taux fixe d'environ 0,709 JOD par USD. Ce rattachement est en place depuis 1995 et offre une prévisibilité pour les virements entrants en USD. Si vous recevez un virement bancaire en USD, vous pouvez estimer la valeur en JOD avant qu'il arrive.",
    },
    {
      q: "Comment les systèmes JoPACC de Jordanie utilisent-ils l'IBAN ?",
      a: "JoPACC (Jordan Payments and Clearing Company) exploite le JRTGS (Système jordanien de règlement brut en temps réel) pour les paiements de grande valeur et le JCSS (Système jordanien de compensation et de règlement) pour les virements de détail. Les deux systèmes utilisent l'IBAN JO complet à 30 caractères comme identifiant de compte pour tous les virements interbancaires nationaux.",
    },
    {
      q: "Est-il facile de recevoir des virements des pays du Golfe vers une banque jordanienne ?",
      a: "Oui. La Jordanie reçoit d'importants flux de fonds de Jordaniens travaillant en Arabie saoudite, aux EAU et au Koweït. Arab Bank, avec des agences dans tout le monde arabe, est particulièrement efficace pour recevoir des virements des pays du Conseil de coopération du Golfe (CCG). Certains virements en provenance de banques du Golfe peuvent arriver en quelques heures grâce à des accords bilatéraux directs de banque correspondante.",
    },
  ],
  egypt: [
    {
      q: "Quel est le format de l'IBAN pour l'Égypte ?",
      a: "Un IBAN égyptien comporte exactement 29 caractères. Il commence par EG, 2 chiffres de contrôle, un code bancaire à 4 chiffres, un code d'agence à 4 chiffres et un numéro de compte à 17 chiffres. Exemple : EG38 0019 0005 0000 0000 2631 8000 2.",
    },
    {
      q: "Quand l'Égypte a-t-elle rendu l'IBAN obligatoire ?",
      a: "La Banque centrale d'Égypte (CBE) a rendu l'IBAN obligatoire pour tous les comptes bancaires dans le cadre de ses efforts de modernisation de l'infrastructure de paiement égyptienne et de facilitation des virements internationaux. Tous les comptes bancaires égyptiens portent désormais un IBAN EG à 29 caractères, et c'est le format requis pour les virements internationaux entrants dans le pays.",
    },
    {
      q: "L'Égypte fait-elle partie de SEPA ?",
      a: "Non. L'Égypte n'est pas membre de SEPA. Les virements internationaux vers l'Égypte sont traités via le réseau SWIFT. Au niveau national, la CBE exploite l'EG-RTGS pour le règlement de grande valeur et l'Egypt ACH pour les virements de détail, tous deux utilisant l'IBAN.",
    },
    {
      q: "Quels sont les codes bancaires de la National Bank of Egypt, de CIB et de Banque Misr ?",
      a: "Codes bancaires égyptiens (4 chiffres, positions 5 à 8 de l'IBAN) : National Bank of Egypt (NBE) utilise 0019, Banque Misr utilise 0002, Commercial International Bank (CIB) utilise 0010 et Banque du Caire utilise 0027. Arab African International Bank utilise 0057.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque égyptienne ?",
      a: "Votre IBAN EG est disponible dans la banque en ligne ou l'application mobile de votre banque. L'application de banque mobile de CIB, le portail de banque en ligne de NBE et l'application mobile de Banque Misr affichent tous l'IBAN à 29 caractères. Il figure également sur les relevés bancaires. Vous pouvez le demander dans n'importe quelle agence ou via la ligne de service client de votre banque.",
    },
    {
      q: "Que dois-je fournir pour recevoir un virement international vers l'Égypte ?",
      a: "Fournissez votre IBAN EG complet à 29 caractères et le code SWIFT/BIC de votre banque. Le code SWIFT de NBE est NBEGEGCX ; celui de Banque Misr est BMISEGCX ; celui de CIB est CIBEEGCX. La CBE peut demander aux banques de documenter certains virements entrants importants, votre banque pourra donc vous demander l'objet du virement.",
    },
    {
      q: "Existe-t-il des incitations pour recevoir des fonds sur des comptes bancaires égyptiens ?",
      a: "Oui. La CBE a introduit plusieurs programmes d'incitation aux envois de fonds pour attirer des entrées de devises étrangères via les canaux bancaires officiels. Ceux-ci ont périodiquement inclus des taux de change préférentiels pour les virements reçus sur des comptes bancaires égyptiens par rapport aux transferts en espèces. Renseignez-vous auprès de votre banque sur les programmes de taux de change actuels applicables à vos virements entrants.",
    },
    {
      q: "Ma devise étrangère entrante sera-t-elle automatiquement convertie en EGP ?",
      a: "En général, oui. Pour les comptes bancaires égyptiens standard, les virements entrants en devises étrangères sont convertis en EGP au taux de change affiché par la banque réceptrice à la date de règlement. Certaines banques proposent des comptes en devises étrangères (en USD, EUR ou GBP) permettant de conserver la devise d'origine — renseignez-vous auprès de votre banque sur cette option si vous recevez régulièrement de grandes sommes dans une devise étrangère spécifique.",
    },
  ],
  israel: [
    {
      q: "Quel est le format de l'IBAN pour Israël ?",
      a: "Un IBAN israélien comporte exactement 23 caractères. Il commence par IL, 2 chiffres de contrôle, un numéro de banque à 3 chiffres, un numéro d'agence à 3 chiffres et un numéro de compte à 13 chiffres. Exemple : IL62 0108 0000 0009 9999 999.",
    },
    {
      q: "Israël fait-il partie de SEPA ?",
      a: "Non. Israël n'est pas membre de SEPA. Les virements internationaux vers Israël sont traités via le réseau SWIFT. Les virements nationaux sont traités via ZAHAV (Zikui Amiti Hagvoh V'Irtzi), le système de règlement brut en temps réel de la Banque d'Israël pour les paiements ILS de grande valeur.",
    },
    {
      q: "Quels numéros de banque utilisent Bank Leumi, Bank Hapoalim et Israel Discount Bank ?",
      a: "Numéros de banque israéliens (3 chiffres, positions 5 à 7 de l'IBAN) : Bank Leumi utilise 10, Bank Hapoalim utilise 12, Israel Discount Bank utilise 11 et Mizrahi Tefahot Bank utilise 20. First International Bank of Israel (FIBI) utilise 31 et Bank Yahav utilise 04.",
    },
    {
      q: "Comment trouver mon IBAN dans une banque israélienne ?",
      a: "Votre IBAN IL est disponible dans la banque en ligne ou l'application mobile de votre banque, dans les détails du compte. La LeuminSmartApp de Bank Leumi, Poalim Digital de Bank Hapoalim et la banque numérique d'Israel Discount Bank affichent tous l'IBAN à 23 caractères. Il figure également sur les relevés bancaires et les documents de bienvenue.",
    },
    {
      q: "Que dois-je fournir pour recevoir un virement international vers Israël ?",
      a: "Fournissez votre IBAN IL complet à 23 caractères et le code SWIFT/BIC de votre banque. Le code SWIFT de Bank Leumi est LUMIILITTLV ; celui de Bank Hapoalim est POALILIT ; celui d'Israel Discount Bank est DSCBILITXXX. La Banque d'Israël peut exiger des banques qu'elles déclarent et documentent les importants virements entrants en devises étrangères.",
    },
    {
      q: "Les banques israéliennes proposent-elles des comptes en devises étrangères ?",
      a: "Oui. Les principales banques israéliennes — Bank Leumi, Bank Hapoalim et Israel Discount Bank — proposent des comptes en devises étrangères en USD, EUR et GBP aux côtés des comptes standard en ILS. Les comptes en devises étrangères ont chacun leur propre IBAN et peuvent recevoir des virements internationaux sans conversion en ILS. Cela est particulièrement utile pour recevoir un salaire ou des paiements en USD d'employeurs ou de clients basés aux États-Unis.",
    },
    {
      q: "Existe-t-il des obligations déclaratives pour les importants virements internationaux vers Israël ?",
      a: "Oui. La réglementation de la Banque d'Israël exige que les banques déclarent les importants virements entrants en devises étrangères dépassant certains seuils. Pour les virements très importants, votre banque peut vous demander de fournir des documents justifiant l'origine des fonds et l'objet du virement. Il s'agit d'une mesure standard de conformité LCB (lutte contre le blanchiment de capitaux) appliquée par toutes les grandes banques israéliennes.",
    },
    {
      q: "Les membres de la diaspora israélienne aux États-Unis ou en Europe peuvent-ils envoyer facilement des fonds vers des IBAN israéliens ?",
      a: "Oui. Toutes les grandes banques israéliennes entretiennent de solides relations de banque correspondante avec des banques américaines et européennes. Les virements en USD depuis les États-Unis ou en EUR depuis l'Europe sont traités couramment avec un règlement en 1 à 3 jours ouvrés. Des services de paiement dédiés à Israël et certaines banques israéliennes proposent également des taux de change compétitifs pour les envois de fonds de la diaspora.",
    },
  ],
  brazil: [
    {
      q: "Quel est le format de l'IBAN pour le Brésil ?",
      a: "Un IBAN brésilien comporte exactement 29 caractères. Il commence par BR, 2 chiffres de contrôle, un code bancaire ISPB à 8 chiffres, un code d'agence à 5 chiffres, un numéro de compte à 10 chiffres et 2 caractères alphanumériques de contrôle. Exemple : BR15 0000 0000 0000 1093 2840 814 P2.",
    },
    {
      q: "Le Brésil fait-il partie de SEPA ?",
      a: "Non. Le Brésil n'est pas membre de SEPA. Les virements internationaux vers le Brésil sont traités via le réseau SWIFT. L'écosystème de paiements nationaux du Brésil comprend PIX (paiements instantanés), TED (grande valeur en temps réel) et DOC (virements de détail programmés), tous réglementés par la Banque centrale du Brésil (BCB).",
    },
    {
      q: "Quels sont les codes ISPB de Banco do Brasil, Itaú, Bradesco et Santander Brasil ?",
      a: "Codes ISPB des banques brésiliennes (8 chiffres, positions 5 à 12 de l'IBAN) : Banco do Brasil est 00000000, Itaú Unibanco est 60701190, Bradesco est 60746948, Santander Brasil est 90400888 et Caixa Econômica Federal est 00360305.",
    },
    {
      q: "Ai-je besoin de mon CPF ou CNPJ en plus de mon IBAN pour recevoir un virement international ?",
      a: "Oui. Les banques brésiliennes demandent généralement à l'expéditeur de fournir non seulement l'IBAN BR à 29 caractères et le code SWIFT du destinataire, mais aussi le CPF du destinataire (Cadastro de Pessoas Físicas — numéro d'identification fiscale individuel) ou le CNPJ (pour les entreprises) pour se conformer à la réglementation LCB de la BCB. L'omission du CPF/CNPJ peut entraîner le retard ou le retour du virement.",
    },
    {
      q: "Comment trouver mon IBAN à Banco do Brasil, Itaú ou Bradesco ?",
      a: "Les applications bancaires brésiliennes mettent généralement en avant les clés PIX et les numéros de compte nationaux plutôt que l'IBAN. Votre IBAN BR peut ne pas être immédiatement visible dans l'application — vous devrez peut-être contacter le service client de votre banque, vous rendre dans une agence ou consulter la section des virements internationaux du portail de banque en ligne pour obtenir votre IBAN à 29 caractères.",
    },
    {
      q: "Qu'est-ce que la taxe IOF brésilienne sur les virements internationaux entrants ?",
      a: "L'IOF brésilien (Imposto sobre Operações Financeiras) est une taxe sur les opérations financières qui peut s'appliquer aux virements bancaires internationaux entrants. Le taux dépend du type de transaction — les paiements commerciaux, les transferts de capitaux et les envois de fonds personnels ont chacun des taux d'IOF différents (certains à 0 %). Consultez votre banque ou un conseiller fiscal local pour comprendre quel taux d'IOF s'applique à votre type de virement spécifique.",
    },
    {
      q: "Puis-je recevoir des USD ou des EUR sans conversion en BRL ?",
      a: "En général, la CBE exige que toutes les devises étrangères entrantes soient converties en BRL au taux de change officiel. Le Brésil n'autorise pas largement les résidents à détenir des devises étrangères sur des comptes bancaires standard. Certains comptes spécialisés pour les entreprises ayant des activités d'exportation ou certains comptes d'investissement peuvent obéir à des règles différentes — consultez votre banque sur les options disponibles si cela vous préoccupe.",
    },
    {
      q: "Qu'est-ce que PIX et est-il utilisé pour les virements internationaux ?",
      a: "PIX est le système de paiement instantané national du Brésil, lancé en 2020 avec un grand succès. Il utilise le CPF, le numéro de téléphone ou l'adresse e-mail comme clés de paiement et règle les transactions 24h/24 et 7j/7 en quelques secondes. Cependant, PIX est strictement un système national brésilien — il ne peut pas être utilisé pour les virements internationaux. Pour recevoir de l'argent de l'étranger, seuls les virements SWIFT basés sur l'IBAN sont applicables.",
    },
  ],
  ukraine: [
    {
      q: "Quel est le format de l'IBAN pour l'Ukraine ?",
      a: "Un IBAN ukrainien comporte exactement 29 caractères. Il commence par UA, 2 chiffres de contrôle, un code de tri bancaire MFO à 6 chiffres et un numéro de compte à 19 chiffres. Exemple : UA21 3223 1300 0002 6007 2335 6600 1.",
    },
    {
      q: "Quand l'Ukraine a-t-elle adopté l'IBAN ?",
      a: "La Banque nationale d'Ukraine (NBU) a rendu l'adoption de l'IBAN obligatoire pour tous les comptes bancaires en 2019, remplaçant l'ancien système de code de tri MFO et de numéro de compte pour les virements internationaux. La transition visait à aligner l'infrastructure de paiement ukrainienne sur les normes européennes et à faciliter les virements transfrontaliers.",
    },
    {
      q: "L'Ukraine fait-elle partie de SEPA ?",
      a: "Non. L'Ukraine n'est pas membre de SEPA, bien qu'elle ait un accord d'association avec l'UE et aspire à l'adhésion à l'UE. Les virements internationaux vers l'Ukraine sont traités via le réseau SWIFT. Au niveau national, la chambre de compensation SEP (Système de paiements électroniques) de la NBU traite tous les virements interbancaires en UAH.",
    },
    {
      q: "Quels sont les codes MFO de PrivatBank, Oschadbank et Raiffeisen Bank Ukraine ?",
      a: "Codes MFO des banques ukrainiennes (6 chiffres, positions 5 à 10 de l'IBAN) : PrivatBank est 305299, Oschadbank (Caisse d'épargne de l'État) est 322001, Raiffeisen Bank Ukraine est 380805, PUMB (First Ukrainian International Bank) est 334851 et Ukrsibbank est 351005.",
    },
    {
      q: "Comment trouver mon IBAN à PrivatBank ou Oschadbank ?",
      a: "Votre IBAN UA est disponible dans l'application mobile Privat24 de PrivatBank et dans la banque en ligne — cherchez-le dans les détails du compte sur la page de la carte ou du compte. L'application Oschadbank24/7 et la banque en ligne d'Oschadbank affichent de même l'IBAN à 29 caractères. Vous pouvez également vous rendre dans n'importe quelle agence ou contacter le service client.",
    },
    {
      q: "Puis-je recevoir des virements internationaux vers l'Ukraine compte tenu du conflit actuel ?",
      a: "Oui, mais avec certaines réserves. De nombreux prestataires de paiement internationaux ont restreint les transferts vers l'Ukraine depuis 2022, mais les grandes banques comme PrivatBank et Oschadbank continuent de traiter les virements SWIFT entrants. Les expéditeurs doivent vérifier que leur banque ou prestataire de transfert prend en charge l'Ukraine avant d'initier un virement. Fournissez votre IBAN UA complet à 29 caractères et le code SWIFT/BIC de votre banque.",
    },
    {
      q: "Existe-t-il des restrictions de change pour les virements entrants vers l'Ukraine ?",
      a: "Oui. La NBU a mis en place des contrôles temporaires des changes depuis février 2022. Les importants virements entrants en devises étrangères peuvent être soumis à une conversion obligatoire en UAH au taux de change officiel de la NBU, et il peut exister des restrictions sur les retraits en devises étrangères en espèces. La NBU met périodiquement à jour ces réglementations — vérifiez les règles en vigueur auprès de votre banque ukrainienne avant d'attendre un virement entrant de grande valeur.",
    },
    {
      q: "Quel code SWIFT PrivatBank utilise-t-il pour les virements internationaux ?",
      a: "Le code SWIFT de PrivatBank est PBANUA2X. Le code SWIFT d'Oschadbank est OSCBUAUX. Raiffeisen Bank Ukraine utilise RAIFUA2K. Lorsque vous communiquez votre IBAN à un expéditeur international, incluez toujours le code SWIFT/BIC correct de votre banque avec l'IBAN UA à 29 caractères.",
    },
  ],
  georgia: [
    {
      q: "Quel est le format de l'IBAN pour la Géorgie ?",
      a: "Un IBAN géorgien comporte exactement 22 caractères. Il commence par GE, 2 chiffres de contrôle, un code bancaire alphanumérique à 2 caractères et un numéro de compte à 16 chiffres. Exemple : GE29 NB00 0000 0101 9049 17.",
    },
    {
      q: "La Géorgie fait-elle partie de SEPA ?",
      a: "Non. La Géorgie n'est pas membre de SEPA. Les virements internationaux vers la Géorgie sont traités via le réseau SWIFT. La Banque nationale de Géorgie (NBG) réglemente le système de paiement et le RTGS national gère les règlements interbancaires en GEL de grande valeur.",
    },
    {
      q: "Quels codes bancaires utilisent TBC Bank et Bank of Georgia ?",
      a: "Codes bancaires géorgiens (2 caractères, positions 5 à 6 de l'IBAN) : TBC Bank utilise TB et Bank of Georgia utilise GG. Liberty Bank utilise LB et ProCredit Bank Georgia utilise PC. Ces codes à deux caractères identifient l'établissement au sein de l'IBAN GE à 22 caractères.",
    },
    {
      q: "Comment trouver mon IBAN à TBC Bank ou Bank of Georgia ?",
      a: "Votre IBAN GE est disponible dans l'application TBC Pay de TBC Bank et dans la banque en ligne de TBC, affiché sur l'écran des détails du compte. L'application de banque mobile de Bank of Georgia (BOG) et la banque en ligne affichent de même l'IBAN à 22 caractères. Il figure également sur les relevés bancaires et la correspondance liée au compte. Les deux banques disposent d'interfaces en anglais.",
    },
    {
      q: "Que dois-je fournir pour recevoir un virement international vers la Géorgie ?",
      a: "Fournissez votre IBAN GE complet à 22 caractères et le code SWIFT/BIC de votre banque. Le code SWIFT de TBC Bank est TBCBGE22 ; celui de Bank of Georgia est BAGAGE22. Les deux banques entretiennent de solides relations de correspondance internationale et traitent efficacement les virements SWIFT en USD, EUR, GBP et GEL.",
    },
    {
      q: "Puis-je détenir des USD ou des EUR sur un compte bancaire géorgien ?",
      a: "Oui. Les banques géorgiennes — TBC Bank et Bank of Georgia en particulier — proposent des comptes multidevises en GEL, USD, EUR et GBP en standard. Chaque position en devise dispose généralement de son propre IBAN. Cela rend la Géorgie particulièrement attrayante pour les nomades numériques et les entrepreneurs internationaux, car vous pouvez recevoir des virements en USD ou en EUR sans conversion en GEL.",
    },
    {
      q: "En quoi le système bancaire géorgien convient-il aux travailleurs à distance et aux nomades numériques ?",
      a: "La Géorgie est devenue populaire auprès des travailleurs à distance grâce à son régime fiscal simplifié (impôt sur le revenu forfaitaire de 20 %, avec des règles favorables de zone virtuelle pour les entreprises informatiques), l'ouverture de comptes bancaires simplifiée (accessible aux non-résidents dans la plupart des agences avec un passeport) et les services bancaires en anglais de TBC Bank et Bank of Georgia. Les IBAN multidevises facilitent la réception de salaires internationaux ou de paiements de clients en EUR ou en USD.",
    },
    {
      q: "Combien de temps prend un virement SWIFT vers la Géorgie ?",
      a: "Les virements SWIFT vers la Géorgie prennent généralement 1 à 3 jours ouvrés. TBC Bank et Bank of Georgia disposent toutes deux de comptes correspondants USD directs aux États-Unis (via de grandes banques correspondantes américaines) et de comptes EUR en Europe, ce qui réduit les intermédiaires et accélère le règlement. Les virements en USD depuis les États-Unis et les virements en EUR depuis l'UE arrivent souvent en 1 à 2 jours ouvrés.",
    },
  ],
  },
};
