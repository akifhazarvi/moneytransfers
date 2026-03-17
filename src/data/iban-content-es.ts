import type { IbanContent } from "./iban-content";

export const ibanContentEs: IbanContent = {
  editorial: {
  denmark: {
    title: "Cómo se usa el IBAN en Dinamarca",
    intro:
      "Dinamarca forma parte de SEPA, pero mantiene sólidos hábitos bancarios domésticos basados en números de registro y números de cuenta. Para las transferencias locales, los daneses suelen utilizar datos bancarios nacionales, mientras que las transferencias internacionales entrantes generalmente requieren el IBAN danés completo.",
    bullets: [
      "Si un remitente paga desde otro país de Europa en EUR, el IBAN danés es normalmente el dato clave, aunque el beneficiario pueda conocer su cuenta localmente por número de registro y número de cuenta.",
      "Para las empresas que reciben pagos transfronterizos en DKK, conviene comprobar si el banco del pagador forzará una conversión de divisa antes de la liquidación o enviará los fondos directamente en coronas.",
      "Cuando los usuarios tienen dificultades para encontrar los datos de recepción correctos, la solución más rápida suele ser preguntar al banco beneficiario cuáles son exactamente sus instrucciones de pago internacional, en lugar de depender de los datos de pago domésticos que aparecen en la aplicación bancaria.",
    ],
  },
  "united-kingdom": {
    title: "Cómo funciona el IBAN en el Reino Unido",
    intro:
      "El Reino Unido adoptó el formato IBAN relativamente tarde en comparación con la mayor parte de Europa, y muchos titulares de cuentas británicas siguen estando más familiarizados con su código de clasificación de seis dígitos y su número de cuenta de ocho dígitos. Desde que el Reino Unido abandonó la UE y SEPA, los IBAN siguen siendo válidos para recibir transferencias internacionales, pero los pagos domésticos se realizan a través de BACS, Faster Payments y CHAPS en lugar de la red SEPA.",
    bullets: [
      "Un IBAN del Reino Unido tiene 22 caracteres e incorpora tanto el código de clasificación como el número de cuenta tras el código de país GB y dos dígitos de control. Si alguien en el extranjero le pide su IBAN, puede derivarlo de su código de clasificación y número de cuenta, o encontrarlo en su portal de banca en línea.",
      "Dado que el Reino Unido ya no forma parte de SEPA, los pagos en euros desde bancos de la UE pueden enrutarse a través de SWIFT en lugar del esquema más económico de Transferencia de Crédito SEPA. Esto puede suponer mayores comisiones para el remitente, por lo que conviene confirmar con el banco emisor cómo se enrutará el pago.",
      "Para las transferencias entrantes en GBP, asegúrese de que el remitente tenga tanto su IBAN como el código SWIFT/BIC de su banco. Algunos bancos no británicos rechazarán el pago si solo se facilita el IBAN, especialmente en transferencias de alto valor elegibles para CHAPS.",
    ],
  },
  germany: {
    title: "Cómo se usa el IBAN en Alemania",
    intro:
      "Alemania fue uno de los primeros países en adoptar el estándar IBAN, y la transición desde el antiguo sistema de Bankleitzahl (BLZ) y Kontonummer ya se ha completado. El BLZ de ocho dígitos se incorpora directamente en la parte BBAN del IBAN alemán, lo que hace que la conversión sea sencilla. Como miembro central de SEPA, prácticamente todas las transferencias de euros domésticas e internacionales en Alemania utilizan el IBAN de forma exclusiva.",
    bullets: [
      "Un IBAN alemán tiene 22 caracteres: el código de país DE, dos dígitos de control, el BLZ de ocho dígitos (código de enrutamiento bancario) y un número de cuenta de diez dígitos. Si su número de cuenta tiene menos de diez dígitos, se rellena con ceros a la izquierda.",
      "Para las transferencias dentro de la zona SEPA, solo se requiere el IBAN. Sin embargo, al enviar o recibir desde fuera de SEPA, los bancos alemanes suelen solicitar también el código BIC/SWIFT. Los principales bancos como Deutsche Bank, Commerzbank y las Sparkassen tienen rangos de BLZ distintos que son fáciles de consultar.",
      "Los débitos directos (Lastschrift) y las órdenes permanentes en Alemania dependen todos del IBAN. Si está configurando un mandato de Débito Directo SEPA para una suscripción o servicio público, deberá proporcionar su IBAN y autorizar al acreedor con un mandato firmado.",
    ],
  },
  france: {
    title: "Cómo se usa el IBAN en Francia",
    intro:
      "Francia realizó una transición fluida al IBAN porque la estructura existente del RIB (Relevé d'Identité Bancaire) encaja perfectamente en el formato IBAN. El RIB contiene un código bancario, código de sucursal (code guichet), número de cuenta y una clave RIB de dos dígitos, todos los cuales se incorporan directamente en el IBAN francés de 27 caracteres. Las transferencias SEPA mediante el IBAN son el estándar tanto para los pagos en euros domésticos como transfronterizos.",
    bullets: [
      "Un IBAN francés tiene 27 caracteres, comenzando con FR, dos dígitos de control, el código bancario de cinco dígitos, el código de sucursal de cinco dígitos, el número de cuenta de once caracteres y la clave de control nacional de dos dígitos. Si dispone de un RIB de su banco, la conversión al IBAN es directa.",
      "Todos los grandes bancos franceses — BNP Paribas, Société Générale, Crédit Agricole y La Banque Postale — muestran el IBAN de forma destacada en la banca en línea. Para recibir transferencias internacionales, solo el IBAN es suficiente para los pagos SEPA, aunque los remitentes fuera de SEPA también necesitarán el BIC.",
      "Al configurar un prélèvement (débito directo) para servicios públicos, alquiler o suscripciones franceses, se le pedirá que rellene un formulario de mandato SEPA con su IBAN. Asegúrese de que el IBAN sea correcto, ya que los dígitos incorrectos harán que el mandato sea rechazado por su banco.",
    ],
  },
  netherlands: {
    title: "Cómo se usa el IBAN en los Países Bajos",
    intro:
      "Los Países Bajos fue uno de los primeros países en hacer obligatorio el IBAN para todas las transferencias bancarias, y el sistema bancario doméstico ahora funciona completamente con enrutamiento basado en IBAN. El antiguo formato de número de cuenta holandés ha sido completamente retirado. Con tres bancos dominantes — ABN AMRO, ING y Rabobank — que cubren la gran mayoría de las cuentas personales y empresariales, la estructura del IBAN holandés es coherente y está bien estandarizada.",
    bullets: [
      "Un IBAN holandés tiene 18 caracteres, compuesto por NL, dos dígitos de control, un código bancario de cuatro letras (como ABNA, INGB o RABO) y un número de cuenta de diez dígitos. El código bancario corto facilita la identificación de la entidad que tiene la cuenta.",
      "Todas las transferencias domésticas entre bancos holandeses utilizan el IBAN — no hay ningún formato heredado en funcionamiento. Si está pagando una factura holandesa o recibiendo un salario en los Países Bajos, el IBAN de la factura o del formulario de nómina es todo lo que necesita.",
      "Para las transferencias internacionales entrantes desde fuera de la zona SEPA, los remitentes deben incluir tanto el IBAN como el código BIC/SWIFT del banco holandés receptor. Dentro de SEPA, solo el IBAN es suficiente, y las transferencias suelen liquidarse en un día hábil.",
    ],
  },
  spain: {
    title: "Cómo se usa el IBAN en España",
    intro:
      "España utiliza un IBAN de 24 caracteres que incorpora la antigua estructura CCC (Código Cuenta Cliente). El CCC incluye un código bancario de cuatro dígitos, un código de sucursal de cuatro dígitos, dos dígitos de control y un número de cuenta de diez dígitos, todos los cuales se incorporan directamente en el IBAN. Como miembro de SEPA, España procesa la gran mayoría de las transferencias en euros a través de la red SEPA.",
    bullets: [
      "Un IBAN español comienza con ES, seguido de dos dígitos de control y luego el CCC de 20 dígitos. Si tiene su antiguo número CCC de un extracto bancario, convertirlo a IBAN es cuestión de añadir el prefijo ES y calcular los dígitos de control. Los principales bancos como Santander, BBVA y CaixaBank muestran los IBAN en sus portales en línea.",
      "Para recibir dinero del extranjero, su IBAN español es el dato principal que debe compartir. Dentro de SEPA, el remitente solo necesita el IBAN. Para los pagos originados fuera de Europa, el remitente también necesitará el código BIC de su banco español.",
      "España tiene una sólida red de cajas de ahorros locales junto a los grandes bancos comerciales, y cada una tiene su propio código bancario dentro de la estructura IBAN. Al proporcionar su IBAN para pagos de nómina o pagos gubernamentales, verifique los códigos bancarios y de sucursal para evitar transferencias mal enrutadas.",
    ],
  },
  italy: {
    title: "Cómo se usa el IBAN en Italia",
    intro:
      "Italia utiliza un IBAN de 27 caracteres que incorpora los códigos bancarios italianos tradicionales: un CIN (Número de Control Interno) de un carácter, un código bancario ABI (Associazione Bancaria Italiana) de cinco dígitos, un código de sucursal CAB (Codice di Avviamento Bancario) de cinco dígitos y un número de cuenta de doce caracteres. Italia es miembro fundador de SEPA, y las transferencias basadas en IBAN son el estándar para todas las operaciones bancarias.",
    bullets: [
      "Un IBAN italiano comienza con IT, dos dígitos de control, y luego el CIN, ABI, CAB y número de cuenta. El CIN es un carácter único utilizado para la validación doméstica. Los principales bancos como UniCredit, Intesa Sanpaolo y Banco BPM mostrarán su IBAN completo en su banca por internet y en los extractos.",
      "Para recibir transferencias internacionales en Italia, debe proporcionar tanto su IBAN como el BIC al remitente, especialmente si el pago procede de fuera de la zona SEPA. Dentro de SEPA, el IBAN solo es suficiente y las transferencias en euros suelen llegar en un día hábil.",
      "Al abrir una nueva cuenta bancaria italiana o conto corrente, su IBAN se genera automáticamente y aparecerá en su contrato y documentos de bienvenida. Para tareas habituales como pagar impuestos italianos (F24), configurar débitos directos de servicios públicos o recibir su estipendio (salario), el IBAN es la única referencia de cuenta que necesita.",
    ],
  },
  belgium: {
    title: "Cómo se usa el IBAN en Bélgica",
    intro:
      "Bélgica utiliza un IBAN de 16 caracteres, uno de los formatos más cortos de Europa, que incorpora directamente el antiguo número de cuenta bancaria belga. La transición al IBAN fue sencilla porque el anterior número de cuenta de doce dígitos encaja en la parte BBAN con una modificación mínima. Como miembro central de SEPA y sede de varias instituciones de la UE, Bélgica procesa diariamente un elevado volumen de transferencias en euros transfronterizas.",
    bullets: [
      "Un IBAN belga comienza con BE, dos dígitos de control y luego un BBAN de doce dígitos compuesto por un código bancario de tres dígitos, un número de cuenta de siete dígitos y dos dígitos de control nacionales. La estructura compacta hace que los IBAN belgas sean fáciles de verificar de un vistazo.",
      "Los principales bancos belgas — KBC, BNP Paribas Fortis, ING Belgium y Belfius — muestran el IBAN de forma destacada en sus aplicaciones y portales en línea. Para las transferencias SEPA, solo se requiere el IBAN. Los remitentes fuera de SEPA también deben incluir el código SWIFT/BIC del banco.",
      "Bélgica tiene una alta tasa de adopción de débitos directos SEPA para facturas de servicios públicos, primas de seguros y servicios de suscripción. Al configurar una domiciliering (débito directo), deberá proporcionar su IBAN y firmar un mandato SEPA, que su banco almacena electrónicamente.",
    ],
  },
  austria: {
    title: "Cómo se usa el IBAN en Austria",
    intro:
      "Austria utiliza un IBAN de 20 caracteres que incorpora el Bankleitzahl (BLZ) austriaco de cinco dígitos y un número de cuenta de once dígitos. La estructura es limpia y está bien estandarizada en todos los bancos austriacos. Como miembro de SEPA dentro de la eurozona, Austria gestiona las transferencias en euros domésticas e internacionales exclusivamente a través del sistema IBAN.",
    bullets: [
      "Un IBAN austriaco comienza con AT, dos dígitos de control, luego un código bancario de cinco dígitos (BLZ) y un número de cuenta de once dígitos. Erste Bank, Raiffeisen, Bank Austria (UniCredit) y BAWAG tienen rangos de BLZ distintos. Su IBAN se muestra en su banca en línea y en los extractos bancarios.",
      "Dentro de SEPA, solo se necesita el IBAN austriaco para las transferencias en euros — no se requiere BIC. Para los pagos desde fuera de Europa, como desde Estados Unidos o Asia, el remitente debe incluir tanto el IBAN como el código SWIFT/BIC de su banco para garantizar un enrutamiento correcto.",
      "Los empleadores, propietarios y agencias gubernamentales austriacos utilizan el IBAN para los pagos de salarios, el cobro de alquileres y el desembolso de prestaciones. Si se traslada a Austria, una de las primeras cosas que debe hacer es abrir una cuenta bancaria local — su nuevo IBAN será la clave para recibir todos los pagos regulares.",
    ],
  },
  ireland: {
    title: "Cómo se usa el IBAN en Irlanda",
    intro:
      "Irlanda utiliza un IBAN de 22 caracteres que incorpora el Código Nacional de Clasificación (NSC) de seis dígitos y el número de cuenta de ocho dígitos del sistema doméstico heredado. Dado que Irlanda es miembro tanto de la UE como de la eurozona, las transferencias SEPA utilizando el IBAN son el método principal para los pagos en euros domésticos e internacionales. El panorama bancario irlandés está relativamente concentrado, con AIB, Bank of Ireland y Permanent TSB como principales bancos minoristas.",
    bullets: [
      "Un IBAN irlandés comienza con IE, dos dígitos de control, un código bancario de cuatro caracteres (como AIBK o BOFI), un código de clasificación de sucursal de seis dígitos y un número de cuenta de ocho dígitos. Si conoce su NSC y número de cuenta, su banco puede proporcionarle el IBAN completo, o puede encontrarlo en la configuración de su banca en línea.",
      "Para recibir transferencias internacionales en euros dentro de SEPA, solo se necesita el IBAN. Los pagos desde fuera de SEPA, por ejemplo desde EE. UU. o el Reino Unido, requieren tanto el IBAN como el código BIC/SWIFT del banco. Tras el Brexit, las transferencias de bancos del Reino Unido ya no se procesan a través de SEPA y pueden conllevar comisiones más altas.",
      "Irlanda ha experimentado un crecimiento significativo en la banca digital, con servicios como Revolut y N26 ampliamente utilizados junto a los bancos tradicionales. Independientemente del proveedor que utilice, su IBAN irlandés (comenzando con IE) funciona de forma idéntica para recibir pagos SEPA y configurar débitos directos para facturas y suscripciones.",
    ],
  },
  portugal: {
    title: "Cómo se usa el IBAN en Portugal",
    intro:
      "Portugal utiliza un IBAN de 25 caracteres que se corresponde directamente con el antiguo NIB (Número de Identificação Bancária), que era la referencia de cuenta doméstica estándar. El NIB consiste en un código bancario de cuatro dígitos, un código de sucursal de cuatro dígitos, un número de cuenta de once dígitos y dos dígitos de control, todos incorporados en el IBAN portugués. Como miembro de la eurozona y de SEPA, Portugal se basa en los IBAN para todas las transferencias bancarias.",
    bullets: [
      "Un IBAN portugués comienza con PT, dos dígitos de control y luego el NIB de 21 dígitos. Si tiene un NIB antiguo de un extracto bancario, convertirlo a IBAN es sencillo. Los principales bancos como Caixa Geral de Depósitos (CGD), Millennium BCP, Novo Banco y Santander Totta muestran el IBAN en sus aplicaciones y extractos.",
      "Dentro de SEPA, solo se requiere el IBAN para las transferencias en euros. Portugal también utiliza ampliamente la red Multibanco para los pagos domésticos, pero para las transferencias internacionales, el IBAN es siempre la referencia correcta que debe compartir con los remitentes en el extranjero.",
      "Los empleadores portugueses y los organismos gubernamentales (como a Segurança Social para las prestaciones sociales) requieren su IBAN para los depósitos de salarios y los pagos de prestaciones. Si se traslada a Portugal o recibe ingresos por alquiler de una propiedad portuguesa, asegúrese de compartir su IBAN con prefijo PT con todos los pagadores.",
    ],
  },
  switzerland: {
    title: "Cómo se usa el IBAN en Suiza",
    intro:
      "Suiza utiliza un IBAN de 21 caracteres y ocupa una posición única en el panorama de pagos europeo. Aunque Suiza no es miembro de la UE, participa en SEPA para las transferencias denominadas en euros, aunque los pagos domésticos en CHF se procesan a través del sistema SIC suizo (Swiss Interbank Clearing) en lugar de SEPA. Esta configuración dual significa que su IBAN suizo funciona tanto para los pagos domésticos en CHF como para las transferencias entrantes en euros desde la zona SEPA.",
    bullets: [
      "Un IBAN suizo comienza con CH, dos dígitos de control, un número de compensación bancaria de cinco dígitos y un número de cuenta de doce dígitos. Los principales bancos como UBS, Credit Suisse (ahora parte de UBS), Raiffeisen Switzerland y los bancos cantonales (Kantonalbanken) tienen rangos de números de compensación distintos.",
      "Para recibir euros de países de la UE, su IBAN suizo es aceptado dentro de la red SEPA, y estas transferencias generalmente se benefician de precios SEPA. Sin embargo, para las transferencias en CHF desde el extranjero, el pago se enruta a través de SWIFT y puede incurrir en comisiones de banca corresponsal. Confirme siempre con el remitente si está enviando en EUR o CHF.",
      "Los QR-bills suizos, que han reemplazado a los antiguos comprobantes de pago, incorporan directamente el IBAN del acreedor en el código QR. Si está pagando facturas en Suiza, su aplicación bancaria lee el código QR y rellena el IBAN automáticamente. Para las transferencias entrantes, proporcione su IBAN junto con el BIC del banco, especialmente para los remitentes fuera de SEPA.",
    ],
  },
  sweden: {
    title: "Cómo se usa el IBAN en Suecia",
    intro:
      "Suecia utiliza un IBAN de 24 caracteres, pero el sistema bancario doméstico se ha basado históricamente en números de compensación y el sistema Bankgiro para los pagos. La transición al IBAN para las transferencias internacionales está completa, aunque muchos suecos siguen utilizando los números Bankgiro para las facturas domésticas y Swish para los pagos entre particulares. Como miembro de la UE y de SEPA, Suecia admite transferencias en euros basadas en IBAN junto a su infraestructura doméstica en SEK.",
    bullets: [
      "Un IBAN sueco comienza con SE, dos dígitos de control, un código bancario de tres dígitos y una referencia de cuenta de diecisiete dígitos que incluye el número de compensación. La correspondencia entre el número de compensación doméstico y el IBAN puede variar entre bancos — Swedbank, SEB, Handelsbanken y Nordea tienen distintas convenciones. Utilice las herramientas en línea de su banco para confirmar su IBAN exacto.",
      "Para recibir transferencias internacionales en SEK, el remitente necesita su IBAN y el código BIC/SWIFT de su banco. Para las transferencias en euros desde dentro de SEPA, el IBAN solo es suficiente. Tenga en cuenta que Suecia utiliza la corona (SEK), por lo que los pagos SEPA en euros serán convertidos a SEK por su banco al tipo de cambio que apliquen.",
      "El sistema Bankgiro de Suecia sigue siendo ampliamente utilizado para los pagos de facturas domésticas, pero es independiente del sistema IBAN. Si alguien en el extranjero quiere pagarle, proporcione siempre su IBAN en lugar de un número Bankgiro, que no está reconocido fuera de Suecia.",
    ],
  },
  poland: {
    title: "Cómo se usa el IBAN en Polonia",
    intro:
      "Polonia utiliza un IBAN de 28 caracteres, uno de los formatos más largos de Europa, construido a partir del estándar doméstico NRB (Numer Rachunku Bankowego). El NRB contiene una suma de verificación de dos dígitos, un código de clasificación bancaria de ocho dígitos y un número de cuenta de dieciséis dígitos. Desde que Polonia se incorporó a la UE, es miembro pleno de SEPA, y los IBAN se utilizan para todas las transferencias en euros transfronterizas, aunque la moneda doméstica es el esloti (PLN).",
    bullets: [
      "Un IBAN polaco comienza con PL, dos dígitos de control y luego el NRB de 24 dígitos. Los principales bancos como PKO Bank Polski (PKO BP), mBank, ING Bank Śląski, Bank Pekao y Santander Bank Polska proporcionan IBANs en sus plataformas de banca en línea. Si tiene su NRB, simplemente anteponga PL y los dígitos de control del IBAN.",
      "Para recibir transferencias en euros desde dentro de SEPA, solo se necesita el IBAN polaco. Sin embargo, si alguien está enviando PLN desde el extranjero, la transferencia pasa por SWIFT y el remitente necesitará su IBAN más el código BIC de su banco. Tenga en cuenta que algunos bancos polacos mantienen números de cuenta separados en EUR y PLN, cada uno con su propio IBAN.",
      "Los sistemas Elixir y Express Elixir de Polonia gestionan las transferencias domésticas en PLN, pero son invisibles para el usuario final — simplemente proporcione su IBAN. Para las remesas entrantes de países como el Reino Unido o EE. UU., asegúrese de que el remitente especifique la moneda correcta para evitar comisiones de conversión innecesarias en el banco receptor.",
    ],
  },
  pakistan: {
    title: "Cómo se usa el IBAN en Pakistán",
    intro:
      "Pakistán adoptó el sistema IBAN en diciembre de 2012, cuando el Banco Estatal de Pakistán (SBP) ordenó que todos los bancos migraran de los números de cuenta heredados al formato IBAN de 24 caracteres. La transición se completó en julio de 2013, y hoy en día cada cuenta bancaria en PKR en Pakistán tiene un IBAN correspondiente. Pakistán no forma parte de SEPA, por lo que todas las transferencias internacionales a Pakistán se enrutan a través de la red SWIFT en lugar del sistema de pagos SEPA utilizado en Europa.",
    bullets: [
      "Un IBAN pakistaní tiene exactamente 24 caracteres: el código de país PK, dos dígitos de control, un código bancario alfanumérico de 4 caracteres y un número de cuenta de 16 dígitos. Por ejemplo, en PK36SCBL0000001123456702, SCBL es el código bancario de Standard Chartered Bank Pakistan. El código bancario de 4 caracteres es asignado por el SBP e identifica de forma única a cada banco — MUCB para MCB Bank, HABB para Bank Al Habib, UNIL para United Bank Limited (UBL) y ALFH para Allied Bank (ABL).",
      "Pakistán tiene más de 30 bancos comerciales y 5 bancos especializados conectados al sistema IBAN, incluidos los bancos islámicos como Meezan Bank (MEZU) y BankIslami (BKIP). Los bancos de microfinanzas como JazzCash (Mobilink Microfinance Bank) y Easypaisa (Telenor Microfinance Bank) también emiten IBANs, lo que significa que las cuentas de monedero móvil pueden recibir transferencias internacionales si el remitente tiene el IBAN correcto.",
      "Al enviar dinero a Pakistán, el beneficiario debe proporcionar su IBAN completo de 24 caracteres junto con el código SWIFT/BIC del banco. Las regulaciones del SBP exigen que todas las remesas en moneda extranjera entrantes sean convertidas a PKR al tipo vigente del banco en la fecha de acreditación. Las remesas enviadas al hogar en Pakistán están exentas de retención a cuenta e impuesto sobre la renta según los planes de incentivos del SBP, lo que hace que las transferencias bancarias basadas en IBAN sean una forma fiscalmente eficiente de recibir dinero del extranjero.",
    ],
  },
  norway: {
    title: "Cómo se usa el IBAN en Noruega",
    intro:
      "Noruega utiliza un IBAN de 15 caracteres, uno de los más cortos de Europa, que incorpora directamente el número de cuenta bancaria noruego de once dígitos. Aunque Noruega no es miembro de la UE, forma parte del EEE (Espacio Económico Europeo) y participa en SEPA para los pagos en euros. Las transferencias domésticas en NOK se realizan a través del sistema noruego NICS (Norwegian Interbank Clearing System), pero las transferencias internacionales dependen del IBAN y la red SWIFT.",
    bullets: [
      "Un IBAN noruego comienza con NO, dos dígitos de control y luego el número de cuenta doméstico de once dígitos (número de registro bancario de cuatro dígitos, número de cuenta de seis dígitos y un dígito de control). DNB, Nordea Norway, SpareBank 1 y Handelsbanken se encuentran entre los bancos más grandes. El formato corto hace que los IBAN noruegos sean fáciles de comunicar y verificar.",
      "Para los pagos en euros de países SEPA, su IBAN noruego es suficiente. Para las transferencias en NOK desde fuera de Noruega, los remitentes necesitan tanto el IBAN como el código BIC/SWIFT. Dado que Noruega utiliza la corona (NOK), los pagos SEPA entrantes en euros serán convertidos por su banco — compare el tipo de conversión que ofrece su banco con los proveedores especializados para evitar pérdidas de valor.",
      "El sistema de pagos móvil Vipps de Noruega domina los pagos entre particulares domésticos, pero no se utiliza para las transferencias internacionales. Al recibir dinero del extranjero — ya sea salario, pensión o una remesa — comparta siempre su IBAN con prefijo NO junto con el BIC del banco para garantizar que el pago se enrute correctamente.",
    ],
  },
  turkey: {
    title: "Cómo se usa el IBAN en Turquía",
    intro:
      "Turquía adoptó el estándar IBAN en 2010 bajo la regulación de la Agencia de Regulación y Supervisión Bancaria (BDDK) y el Banco Central de la República de Turquía (TCMB). Cada cuenta bancaria turca tiene un IBAN de 26 caracteres con prefijo TR, y este es el formato requerido para todas las transferencias internacionales a Turquía. Turquía no forma parte de SEPA, por lo que los pagos transfronterizos se procesan a través de la red SWIFT en TRY o divisa extranjera.",
    bullets: [
      "Un IBAN turco tiene 26 caracteres: el código de país TR, dos dígitos de control, un código bancario de cinco dígitos, un dígito cero reservado y un número de cuenta de 16 dígitos. Los principales bancos — Garanti BBVA (código bancario 00062), Is Bankası (00064), Akbank (00046) y Yapı Kredi (00067) — tienen códigos bancarios distintos incorporados en el IBAN.",
      "El sistema doméstico de transferencias interbancarias de Turquía es el EFT (Elektronik Fon Transferi) para transferencias de alto valor en el mismo día y FAST (Fonların Anlık ve Sürekli Transferi) para pagos minoristas instantáneos. Ambos sistemas utilizan el IBAN internamente, pero para recibir dinero del extranjero siempre necesita el IBAN TR completo de 26 caracteres y el código SWIFT/BIC de su banco.",
      "Al recibir transferencias internacionales en Turquía, los fondos pueden llegar en la divisa extranjera original o ser convertidos a TRY por el banco receptor. Los controles de divisas de Turquía exigen que ciertos ingresos en divisa extranjera que superen determinados umbrales sean notificados al TCMB. Si recibe una transferencia de gran importe, confirme con su banco si aplica alguna obligación de declaración o conversión.",
    ],
  },
  romania: {
    title: "Cómo se usa el IBAN en Rumanía",
    intro:
      "Rumanía utiliza un IBAN de 24 caracteres y es miembro pleno de SEPA, lo que permite transferencias en euros de bajo coste hacia y desde otros países SEPA. El Banco Nacional de Rumanía (BNR) supervisa el estándar IBAN y los sistemas de pago domésticos SENT (compensación electrónica) y ReGIS (SLBTR). Aunque la moneda de Rumanía es el leu (RON), el IBAN funciona igualmente para las cuentas en RON y en EUR de los bancos rumanos.",
    bullets: [
      "Un IBAN rumano comienza con RO, dos dígitos de control, un código bancario alfanumérico de cuatro caracteres (como RNCB para BCR, BRDE para BRD, INGB para ING Romania y BTRL para Banca Transilvania) y un número de cuenta de 16 caracteres. El identificador bancario de cuatro letras facilita la identificación de la entidad que tiene la cuenta.",
      "Como miembro de SEPA, Rumanía participa en la Transferencia de Crédito SEPA (SCT) y la Transferencia de Crédito SEPA Instantánea (SCT Inst), lo que significa que los pagos en euros de los países de la eurozona son rápidos y económicos. Sin embargo, las transferencias en RON desde fuera de Rumanía se procesan a través de SWIFT y pueden conllevar comisiones de banca corresponsal.",
      "Los rumanos que viven en el extranjero suelen enviar remesas a casa mediante servicios de transferencia especializados. Al dirigir una transferencia a una cuenta bancaria rumana, proporcione siempre el IBAN RO completo de 24 caracteres. Para los pagos denominados en RON, confirme si el proveedor emisor admite la entrega directa en RON o enruta a través de EUR con una conversión al tipo de referencia del BNR.",
    ],
  },
  czechia: {
    title: "Cómo se usa el IBAN en Chequia",
    intro:
      "Chequia utiliza un IBAN de 24 caracteres y es miembro de SEPA, aunque la moneda doméstica sigue siendo la corona checa (CZK). El Banco Nacional Checo (CNB) supervisa el sistema de pagos, y los IBAN se utilizan junto al antiguo formato de cuenta doméstico de prefijo/número de cuenta/código bancario. El IBAN checo se genera codificando el código bancario doméstico de cuatro dígitos y la combinación del prefijo de cuenta y el número de cuenta en el BBAN.",
    bullets: [
      "Un IBAN checo comienza con CZ, dos dígitos de control, un código bancario de cuatro dígitos, un prefijo de cuenta de seis dígitos (con relleno de ceros) y un número de cuenta de diez dígitos. Los bancos como CSOB (código bancario 0300), Komerční banka (0100) y Česká spořitelna (0800) se identifican por sus códigos bancarios. Si conoce su número de cuenta checo doméstico en el formato prefijo-numerodecuenta/codigobancario, puede derivar el IBAN usando el conversor oficial del CNB.",
      "Para recibir transferencias en euros de países SEPA, su IBAN checo solo es suficiente. Para las transferencias en CZK desde el extranjero, los remitentes necesitan tanto el IBAN como el código SWIFT/BIC. Los bancos checos como Air Bank, Moneta y Raiffeisenbank Czech también utilizan IBANs en todos los tipos de cuenta, incluidas las cuentas de ahorro y empresariales.",
      "Los empleadores y organismos gubernamentales checos utilizan cada vez más el IBAN para los pagos de salarios y prestaciones, aunque el formato doméstico heredado (prefijo-número/código bancario) sigue siendo ampliamente entendido localmente. Al compartir sus datos bancarios internacionalmente, utilice siempre el IBAN CZ completo en lugar del formato doméstico para evitar pagos mal enrutados.",
    ],
  },
  hungary: {
    title: "Cómo se usa el IBAN en Hungría",
    intro:
      "Hungría utiliza un IBAN de 28 caracteres — uno de los más largos de Europa — que refleja el formato de número de cuenta Giro doméstico de 24 dígitos del país. Hungría es miembro de SEPA, aunque mantiene su propia moneda, el forinto (HUF). El Magyar Nemzeti Bank (MNB) rige los sistemas de pago, y los IBAN son obligatorios para todas las transferencias transfronterizas. Las transferencias domésticas en HUF se procesan a través del sistema de compensación GIRO.",
    bullets: [
      "Un IBAN húngaro comienza con HU, dos dígitos de control y luego el número de cuenta doméstico de 24 dígitos en su totalidad. Este número doméstico incorpora un código bancario de tres dígitos, un código de sucursal de cuatro dígitos, un dígito de control, un número de cuenta de 15 dígitos y un dígito de control final. Los principales bancos incluyen OTP Bank (código bancario 117), K&H Bank (103), Erste Bank Hungary (116) y MKB Bank (108).",
      "Dado que Hungría está en SEPA pero fuera de la eurozona, las transferencias en euros de los países de la UE se procesan de forma económica a través de SCT, pero las transferencias en HUF desde el extranjero viajan vía SWIFT. Si necesita recibir HUF, el remitente debe especificar HUF como moneda; de lo contrario, muchos bancos usarán EUR por defecto y generarán una conversión.",
      "El sistema de Pago Instantáneo de Hungría (AFR — Azonnali Fizetési Rendszer), lanzado en 2020, permite transferencias instantáneas en HUF a nivel doméstico utilizando el IBAN. Si es cliente de OTP, Raiffeisen Hungary o cualquier banco húngaro importante, puede recibir créditos instantáneos en HUF las 24 horas del día, los 7 días de la semana, siempre que el remitente utilice su IBAN HU completo de 28 caracteres.",
    ],
  },
  croatia: {
    title: "Cómo se usa el IBAN en Croacia",
    intro:
      "Croacia adoptó el euro e ingresó en la eurozona en enero de 2023, sustituyendo la kuna por el EUR y convirtiéndose automáticamente en miembro pleno de SEPA. Los bancos croatas ahora operan principalmente en EUR, y el IBAN de 21 caracteres es el estándar para todas las transferencias en euros domésticas e internacionales. El Banco Nacional de Croacia (HNB) supervisa la infraestructura de pagos, y el sistema de compensación NKS fue completamente migrado a los estándares SEPA con la entrada en la eurozona.",
    bullets: [
      "Un IBAN croata tiene 21 caracteres: el código de país HR, dos dígitos de control, un código bancario de siete dígitos (que incluye el identificador bancario de tres dígitos y el código de sucursal de cuatro dígitos) y un número de cuenta de diez dígitos. Los principales bancos incluyen Zagrebačka banka (ZABA, parte de UniCredit), Privredna banka Zagreb (PBZ, parte de Intesa Sanpaolo) y Erste Bank Croatia.",
      "Desde que Croacia ingresó en la eurozona en 2023, todas las transferencias en EUR domésticas se procesan a través del esquema de Transferencia de Crédito SEPA Instantánea (SCT Inst), liquidándose en segundos. Esto reemplazó al antiguo sistema HSVP RTGS para la mayoría de los pagos minoristas. Al enviar dinero a Croacia desde la UE, el IBAN HR es todo lo que el beneficiario necesita compartir.",
      "Los residentes croatas que anteriormente tenían cuentas en kunas vieron sus números de cuenta redenominados a EUR al tipo de conversión fijo de 7,53450 HRK por EUR. El IBAN de la cuenta en sí no cambió de formato — solo la etiqueta de moneda de la cuenta. Si realiza un pago a Croacia, especifique EUR y utilice el IBAN HR de 21 caracteres del beneficiario.",
    ],
  },
  finland: {
    title: "Cómo se usa el IBAN en Finlandia",
    intro:
      "Finlandia utiliza un IBAN de 18 caracteres, uno de los formatos más cortos de Europa, que se corresponde directamente con el número de cuenta bancaria finlandés heredado. Finlandia es miembro de la eurozona y de SEPA, y las transferencias basadas en IBAN han sido el único estándar tanto para los pagos en euros domésticos como transfronterizos desde que se completó la migración a SEPA. El Banco de Finlandia (Suomen Pankki) supervisa la estabilidad de los pagos, con el sector bancario comercial dominado por Nordea, OP Financial Group y Danske Bank Finland.",
    bullets: [
      "Un IBAN finlandés comienza con FI, dos dígitos de control, un código de sucursal bancaria de seis dígitos y un número de cuenta de ocho dígitos con un dígito de control final. El código de sucursal de seis dígitos identifica tanto el banco como la sucursal. Los IBANs de Nordea suelen comenzar con FI12, las cuentas de OP Financial Group con FI50-FI58 y Danske Bank Finland con FI34. Todos los bancos finlandeses muestran el IBAN en su banca en línea y móvil.",
      "Dentro de SEPA, el IBAN finlandés solo es suficiente para las transferencias en euros — no se requiere BIC para las transferencias de crédito dentro de la UE y el EEE. Finlandia también opera el sistema de pago instantáneo doméstico Siirto, que utiliza el IBAN como identificador de cuenta subyacente para los pagos en EUR en tiempo real entre bancos finlandeses.",
      "Los empleadores finlandeses, la institución de seguridad social Kela y la Administración Tributaria Finlandesa utilizan el IBAN para los desembolsos de salarios, prestaciones y reembolsos. Si se traslada a Finlandia o recibe pagos de pensión finlandesa desde el extranjero, registre su IBAN con prefijo FI en la autoridad pertinente tan pronto como se abra su cuenta.",
    ],
  },
  greece: {
    title: "Cómo se usa el IBAN en Grecia",
    intro:
      "Grecia utiliza un IBAN de 27 caracteres y es miembro fundador de la eurozona y de SEPA. El Banco de Grecia (Trapeza tis Ellados) regula el sistema de pagos, y todas las cuentas bancarias en Grecia están denominadas en euros. Los IBAN griegos se utilizan tanto para la compensación doméstica DIAS como para las transferencias SEPA transfronterizas, lo que hace del IBAN la referencia de cuenta universal para todas las transacciones bancarias en el país.",
    bullets: [
      "Un IBAN griego comienza con GR, dos dígitos de control, un código bancario de tres dígitos, un código de sucursal de cuatro dígitos y un número de cuenta de 16 dígitos. Los principales bancos — Alpha Bank (código bancario 014), Eurobank (026), Piraeus Bank (017) y National Bank of Greece (011) — tienen sus propios rangos de códigos. Su IBAN GR completo de 27 caracteres aparece en los extractos bancarios y en la configuración de su banca en línea.",
      "Dentro de SEPA, solo se requiere el IBAN griego para las transferencias en euros — no se necesita BIC para las Transferencias de Crédito SEPA. Para los pagos desde fuera de la zona SEPA, como desde Estados Unidos o Australia, el remitente necesitará tanto el IBAN como el código SWIFT/BIC del banco receptor. Los bancos griegos suelen liquidar las transferencias SEPA entrantes en un día hábil.",
      "Grecia tiene una alta proporción de su diáspora enviando remesas al país. Al dirigir una transferencia a una cuenta bancaria griega, utilice el IBAN GR completo en lugar de cualquier número de cuenta doméstico abreviado. Si el servicio de envío admite SEPA, la transferencia será más rápida y económica que un pago enrutado por SWIFT; confirme qué enrutamiento utiliza el proveedor antes de iniciar la transferencia.",
    ],
  },
  cyprus: {
    title: "Cómo se usa el IBAN en Chipre",
    intro:
      "Chipre utiliza un IBAN de 28 caracteres y es miembro de la eurozona y de SEPA. El Banco Central de Chipre (CBC) supervisa el sistema bancario, que experimentó una importante reestructuración tras la crisis bancaria de 2012-2013. Hoy en día, el sector bancario está liderado por el Bank of Cyprus y el Hellenic Bank, con todas las cuentas denominadas en EUR y los IBAN utilizados para todas las transferencias domésticas e internacionales.",
    bullets: [
      "Un IBAN chipriota comienza con CY, dos dígitos de control, un código bancario de tres dígitos, un código de sucursal de cinco dígitos y un número de cuenta de 16 caracteres. Las cuentas del Bank of Cyprus se identifican por el código bancario 002, mientras que Hellenic Bank utiliza el 005. Su IBAN está disponible a través de la banca en línea, las aplicaciones móviles o impreso en los extractos bancarios.",
      "Chipre participa en SEPA, por lo que las transferencias en euros de los países de la UE se procesan rápidamente y a bajo coste. Para los pagos que llegan desde fuera de SEPA — por ejemplo del Reino Unido tras el Brexit, o de países no pertenecientes a la UE — el remitente necesitará su IBAN CY completo de 28 caracteres y el código SWIFT/BIC de su banco. Tanto Hellenic Bank como Bank of Cyprus publican sus códigos SWIFT en sus sitios web.",
      "Chipre cuenta con una importante comunidad empresarial internacional y un alto volumen de pagos transfronterizos. Al recibir pagos de jurisdicciones no pertenecientes a la UE, tenga en cuenta que algunos bancos chipriotas aplican una diligencia debida reforzada y pueden solicitar documentación para las transferencias entrantes de gran importe. Confirmar los requisitos de cumplimiento con su banco antes de esperar una remesa de alto valor puede evitar retrasos inesperados.",
    ],
  },
  luxembourg: {
    title: "Cómo se usa el IBAN en Luxemburgo",
    intro:
      "Luxemburgo utiliza un IBAN de 20 caracteres y es miembro fundador de la eurozona y de SEPA. Como uno de los principales centros financieros de Europa, Luxemburgo procesa un volumen excepcionalmente alto de transferencias transfronterizas en relación con su población. La Commission de Surveillance du Secteur Financier (CSSF) regula el sector bancario, con los principales actores incluyendo BGL BNP Paribas, BCEE (Spuerkeess) y Banque de Luxembourg, que gestionan tanto la banca minorista como la privada.",
    bullets: [
      "Un IBAN luxemburgués comienza con LU, dos dígitos de control, un código bancario de tres dígitos y un número de cuenta de 13 dígitos. BCEE (Spuerkeess) lleva el código bancario 001, BGL BNP Paribas utiliza el 002 e ING Luxembourg el 030. Como miembro de SEPA, solo se requiere el IBAN para las transferencias en euros dentro de la UE y el EEE — no se necesita BIC para las Transferencias de Crédito SEPA.",
      "El sector bancario de Luxemburgo sirve a una gran comunidad de empleados de instituciones de la UE, profesionales financieros y gestores de fondos de inversión. Muchos titulares de cuentas mantienen cuentas denominadas en múltiples divisas junto a su cuenta IBAN en EUR. Para las transferencias no denominadas en EUR, se requieren datos de enrutamiento adicionales, incluidos los códigos SWIFT.",
      "El sistema LUIPS (Luxembourg Interbank Payment System) se conecta a TARGET2 para las liquidaciones de alto valor en euros. Para los pagos minoristas, se aplican los esquemas SEPA y las transferencias entre Luxemburgo y otros países de la UE se liquidan en un día hábil. Si trabaja para una institución de la UE con sede en Luxemburgo, su empleador requerirá su IBAN LU para la nómina.",
    ],
  },
  "united-arab-emirates": {
    title: "Cómo se usa el IBAN en los Emiratos Árabes Unidos",
    intro:
      "Los EAU introdujeron el uso obligatorio del IBAN en mayo de 2011 bajo un mandato del Banco Central de los EAU (CBUAE). Todas las cuentas bancarias en los EAU tienen un IBAN de 23 caracteres, y este es el formato requerido para todas las transferencias interbancarias domésticas y las transferencias internacionales al país. Los EAU no forman parte de SEPA, por lo que todos los pagos transfronterizos se procesan a través de la red SWIFT. La moneda es el dírham emiratí (AED), y las transacciones se liquidan a través del Sistema de Transferencia de Fondos de los EAU (UAEFTS).",
    bullets: [
      "Un IBAN de los EAU tiene 23 caracteres: el código de país AE, dos dígitos de control y un código bancario de tres dígitos seguido de un número de cuenta de 16 dígitos. Emirates NBD (código bancario 033), Abu Dhabi Commercial Bank — ADCB (030), First Abu Dhabi Bank — FAB (035) y Mashreq (020) se encuentran entre los bancos más grandes. Su IBAN se muestra en su portal de banca en línea, aplicación móvil o impreso en su extracto bancario.",
      "El Sistema de Transferencia de Fondos de los EAU (UAEFTS) gestiona todas las transferencias interbancarias domésticas en AED y utiliza el IBAN como identificador de cuenta obligatorio. El sistema opera las 24 horas del día, los 7 días de la semana, y liquida las transferencias en tiempo real. Para enviar dinero entre bancos de los EAU localmente, comparta su IBAN AE de 23 caracteres — no se necesita código SWIFT para las transferencias domésticas dentro de los EAU.",
      "Para las transferencias internacionales a los EAU desde el extranjero, los remitentes siempre necesitan el IBAN AE completo del beneficiario junto con el código SWIFT/BIC del banco. Los principales bancos de los EAU procesan las transferencias SWIFT entrantes en una amplia gama de monedas, pero los fondos se mantienen normalmente en AED. Si necesita recibir moneda extranjera sin conversión, consulte con su banco la apertura de una cuenta en moneda extranjera con un IBAN separado.",
    ],
  },
  "saudi-arabia": {
    title: "Cómo se usa el IBAN en Arabia Saudita",
    intro:
      "Arabia Saudita obligó el uso del IBAN para todas las transferencias domésticas e internacionales en 2010 bajo la supervisión de la Autoridad Monetaria de Arabia Saudita (SAMA, ahora el Banco Central Saudita — SAMA). Cada cuenta bancaria saudita lleva un IBAN de 24 caracteres con prefijo SA. Arabia Saudita no forma parte de SEPA; las transferencias internacionales se enrutan a través de SWIFT. A nivel doméstico, la Red de Pagos Saudita (mada) y el sistema SARIE (liquidación bruta en tiempo real de Arabia Saudita) utilizan el IBAN como identificador de cuenta estándar.",
    bullets: [
      "Un IBAN saudita tiene 24 caracteres: el código de país SA, dos dígitos de control, un código bancario de dos dígitos y un número de cuenta de 18 dígitos. Al Rajhi Bank (código bancario 05), Saudi National Bank — SNB (10), Riyad Bank (07) y Banque Saudi Fransi (55) se encuentran entre las instituciones más grandes. Su IBAN está disponible en la plataforma de banca en línea o móvil de su banco, en su extracto de cuenta o visitando una sucursal.",
      "El sistema de liquidación bruta en tiempo real SARIE de Arabia Saudita procesa todas las transferencias domésticas en SAR de alto valor utilizando el IBAN. El país también cuenta con el sistema de Pagos Instantáneos (IP) para las transferencias minoristas en tiempo real. Ambos sistemas son solo domésticos — para las transferencias transfronterizas, SWIFT sigue siendo el estándar y los remitentes fuera de Arabia Saudita necesitan su IBAN SA completo más el código SWIFT de su banco.",
      "Arabia Saudita tiene uno de los flujos de remesas salientes más grandes del mundo, pero también importantes transferencias entrantes — en particular para los expatriados que trabajan en el Reino y envían dinero desde sus países de origen. Al recibir una transferencia del extranjero, su banco puede aplicar conversión de moneda desde la moneda entrante a SAR. Las regulaciones de SAMA también exigen que los bancos informen de las transferencias internacionales por encima de ciertos umbrales, por lo que las grandes transferencias entrantes pueden implicar controles de cumplimiento adicionales.",
    ],
  },
  qatar: {
    title: "Cómo se usa el IBAN en Qatar",
    intro:
      "Qatar adoptó el IBAN como formato de cuenta obligatorio bajo el marco regulatorio del Banco Central de Qatar (QCB). Todas las cuentas bancarias de Qatar llevan un IBAN de 29 caracteres con prefijo QA. Qatar no forma parte de SEPA; las transferencias internacionales se procesan a través de la red SWIFT en QAR u otras monedas. A nivel doméstico, el Sistema de Pagos de Qatar (QPS) y el Sistema de Liquidación Bruta en Tiempo Real de Qatar (QRTGS) utilizan el IBAN para toda la liquidación interbancaria.",
    bullets: [
      "Un IBAN de Qatar tiene 29 caracteres: el código de país QA, dos dígitos de control, un código bancario alfanumérico de cuatro caracteres y un número de cuenta de 21 caracteres. Qatar National Bank — QNB (código bancario QNBA) es el banco más grande del país y la región. Otros bancos importantes incluyen Commercial Bank of Qatar (CBQA), Doha Bank (DOHB), Qatar Islamic Bank (QIIB) y Masraf Al Rayan (MARK).",
      "El QPS de Qatar opera el sistema de pago interbancario doméstico y procesa todas las transferencias minoristas en QAR equivalente a SAR entre bancos locales. Para las transacciones de alto valor, el QRTGS proporciona liquidación en tiempo real. Ambos sistemas requieren el IBAN QA completo de 29 caracteres para la identificación del beneficiario. Los remitentes internacionales también deben proporcionar el código SWIFT/BIC del banco del beneficiario.",
      "Qatar alberga una gran fuerza laboral expatriada, y las remesas entrantes son un caso de uso importante para las transferencias basadas en IBAN. Muchos bancos de Qatar también ofrecen cuentas en múltiples monedas que pueden recibir USD, EUR o GBP sin conversión inmediata. Si recibe un salario en Qatar o espera una transferencia en moneda extranjera, pregunte a su banco si hay disponible una cuenta IBAN en moneda extranjera separada para evitar una conversión no deseada a QAR.",
    ],
  },
  kuwait: {
    title: "Cómo se usa el IBAN en Kuwait",
    intro:
      "Kuwait adoptó el IBAN bajo la supervisión del Banco Central de Kuwait (CBK). Las cuentas bancarias kuwaití llevan un IBAN de 30 caracteres — uno de los más largos del mundo — con prefijo KW. Kuwait no es miembro de SEPA; todas las transferencias transfronterizas se enrutan a través de la red SWIFT. La moneda doméstica es el dinar kuwaití (KWD), consistentemente una de las monedas de mayor valor a nivel global. Las transferencias interbancarias domésticas se liquidan a través del Sistema Automatizado de Liquidación de Kuwait (KASS).",
    bullets: [
      "Un IBAN de Kuwait tiene 30 caracteres: el código de país KW, dos dígitos de control, un código bancario alfanumérico de cuatro caracteres y un número de cuenta de 22 caracteres. National Bank of Kuwait — NBK (código bancario NBOK) es el banco más grande. Kuwait Finance House — KFH (KFHO), Gulf Bank (GULF) y Burgan Bank (BURG) son otras instituciones importantes. El IBAN inusualmente largo refleja el extenso sistema de numeración de cuentas doméstico de Kuwait.",
      "El sistema KASS (Kuwait Automated Settlement System) procesa los pagos interbancarios domésticos en KWD y utiliza el IBAN como identificador de cuenta. Para las transferencias internacionales entrantes, el remitente necesita el IBAN KW completo de 30 caracteres del beneficiario y el código SWIFT/BIC del banco. Las transferencias suelen llegar en uno o dos días hábiles.",
      "El dinar kuwaití está vinculado a una cesta de monedas y actualmente es una de las monedas más fuertes del mundo por valor nominal. Al recibir una transferencia internacional en KWD, el tipo de cambio aplicado por su banco o el servicio emisor puede tener un impacto significativo en el importe final recibido. Compare el tipo de mercado medio con el tipo publicado por su banco, ya que el diferencial del KWD puede ser considerable en transferencias de gran importe.",
    ],
  },
  bahrain: {
    title: "Cómo se usa el IBAN en Baréin",
    intro:
      "Baréin introdujo el uso obligatorio del IBAN bajo el marco regulatorio del Banco Central de Baréin (CBB). Todas las cuentas bancarias de Baréin llevan un IBAN de 22 caracteres con prefijo BH. Baréin no forma parte de SEPA; las transferencias internacionales se procesan a través de SWIFT. A nivel doméstico, el Sistema de Liquidación Interbancaria de Baréin (BISS) y la Cámara de Compensación Automatizada de Baréin (BACH) utilizan el IBAN para todo el procesamiento de pagos interbancarios en dinar de Baréin (BHD).",
    bullets: [
      "Un IBAN de Baréin tiene 22 caracteres: el código de país BH, dos dígitos de control, un código bancario alfanumérico de cuatro caracteres y un número de cuenta de 14 caracteres. Los principales bancos incluyen Ahli United Bank (código bancario AUBB), National Bank of Bahrain — NBB (NBOB), Bank of Bahrain and Kuwait — BBK (BBKU) e Ithmaar Bank (ITHMB). Su IBAN se muestra en su portal de banca en línea y se imprime en los extractos bancarios.",
      "Los sistemas BISS y BACH de Baréin gestionan la liquidación interbancaria doméstica en BHD utilizando el IBAN completo. Para las transferencias internacionales, los remitentes fuera de Baréin necesitan el IBAN BH de 22 caracteres del beneficiario y el código SWIFT/BIC del banco receptor. Baréin es un centro financiero regional, y los principales bancos como Ahli United Bank y NBB gestionan regularmente altos volúmenes de transferencias SWIFT transfronterizas.",
      "Baréin tiene una proporción significativa de residentes expatriados que envían remesas desde sus países de origen. Las transferencias entrantes en monedas extranjeras se convierten a BHD al tipo de cambio del banco receptor, a menos que la cuenta sea una cuenta en moneda extranjera designada. El BHD está vinculado al dólar estadounidense a un tipo fijo de 0,376 BHD por USD, lo que significa que las transferencias en USD llegan con valores de conversión a BHD predecibles.",
    ],
  },
  jordan: {
    title: "Cómo se usa el IBAN en Jordania",
    intro:
      "Jordania adoptó el IBAN bajo el Banco Central de Jordania (CBJ). Las cuentas bancarias jordanas llevan un IBAN de 30 caracteres — uno de los formatos más largos a nivel mundial — con prefijo JO. Jordania no forma parte de SEPA; las transferencias internacionales se procesan a través de la red SWIFT. La moneda doméstica es el dinar jordano (JOD), vinculado al dólar estadounidense. Las transferencias interbancarias domésticas se procesan a través del Sistema Electrónico de Pagos de Jordania (JoPACC).",
    bullets: [
      "Un IBAN de Jordania tiene 30 caracteres: el código de país JO, dos dígitos de control, un código bancario alfanumérico de cuatro caracteres, cuatro dígitos de información de sucursal y un número de cuenta de 18 caracteres. Arab Bank (código bancario ARAB) es el banco jordano más grande y con mayor conexión internacional. Housing Bank for Trade and Finance (HBHO) y Jordan Islamic Bank (JIBS) son otras instituciones importantes. Su IBAN está disponible a través de la aplicación móvil de su banco, la banca en línea o en su extracto de cuenta.",
      "JoPACC de Jordania opera la infraestructura de pagos doméstica, incluidos los sistemas de compensación JRTGS (Liquidación Bruta en Tiempo Real de Jordania) y JCSS para el sector minorista. Ambos utilizan el IBAN JO completo para la identificación del beneficiario. Para las transferencias transfronterizas, el remitente necesita su IBAN JO de 30 caracteres junto con el código SWIFT/BIC de su banco.",
      "Jordania recibe importantes flujos de remesas entrantes, en particular de jordanos que trabajan en el Golfo. Arab Bank, con su amplia presencia regional, se utiliza habitualmente para recibir transferencias de Arabia Saudita, los EAU y Kuwait. Cuando el remitente está en un país del Golfo, confirme si su banco puede recibir la transferencia sin necesidad de un paso de banco corresponsal manual, ya que esto puede reducir tanto las comisiones como el tiempo de liquidación.",
    ],
  },
  egypt: {
    title: "Cómo se usa el IBAN en Egipto",
    intro:
      "Egipto ordenó la adopción del IBAN para todas las cuentas bancarias mediante una directiva del Banco Central de Egipto (CBE). Las cuentas bancarias egipcias llevan un IBAN de 29 caracteres con prefijo EG. Egipto no forma parte de SEPA; las transferencias internacionales utilizan la red SWIFT. La moneda doméstica es la libra egipcia (EGP). A nivel doméstico, el Sistema Bancario Egipcio procesa las transferencias interbancarias a través de los sistemas de compensación electrónica EG-RTGS (Liquidación Bruta en Tiempo Real de Egipto) y ACH de Egipto.",
    bullets: [
      "Un IBAN egipcio tiene 29 caracteres: el código de país EG, dos dígitos de control, un código bancario de cuatro dígitos, un código de sucursal de cuatro dígitos y un número de cuenta de 17 dígitos. Los principales bancos incluyen National Bank of Egypt — NBE (código bancario 0019), Banque Misr (0002), Commercial International Bank — CIB (0010) y Banque du Caire (0027). Su IBAN está disponible en su plataforma de banca en línea, aplicación móvil o impreso en su extracto de cuenta.",
      "El EG-RTGS de Egipto procesa las transferencias domésticas en EGP de alto valor, mientras que el ACH gestiona las transferencias por lotes minoristas, ambos utilizando el IBAN completo como identificador de cuenta. Para las transferencias internacionales a Egipto, los remitentes necesitan el IBAN EG de 29 caracteres del beneficiario y el código SWIFT/BIC del banco receptor. Las regulaciones del CBE pueden exigir que las grandes remesas entrantes en moneda extranjera sean convertidas a EGP al tipo de cambio oficial.",
      "Egipto es uno de los mayores receptores de remesas en Oriente Medio y Norte de África. El CBE ha introducido varios incentivos para las remesas a través de canales bancarios, incluidos tipos de cambio mejorados para los remitentes que dirigen transferencias a cuentas bancarias egipcias a través de canales bancarios oficiales. Si recibe remesas regularmente, pregunte a su banco sobre los beneficios de tipo o comisión específicos para remesas disponibles para las transferencias entrantes basadas en IBAN.",
    ],
  },
  israel: {
    title: "Cómo se usa el IBAN en Israel",
    intro:
      "Israel utiliza un IBAN de 23 caracteres regulado por el Banco de Israel (BoI). Las cuentas bancarias israelíes llevan el prefijo IL y el IBAN es el formato requerido para las transferencias internacionales. Israel no forma parte de SEPA; los pagos transfronterizos se procesan a través de SWIFT. La moneda doméstica es el nuevo séquel israelí (ILS). El sistema de pagos doméstico de Israel, ZAHAV (Zikui Amiti Hagvoh V'Irtzi), gestiona la liquidación bruta en tiempo real para las transferencias en ILS de alto valor.",
    bullets: [
      "Un IBAN israelí tiene 23 caracteres: el código de país IL, dos dígitos de control, un número bancario de tres dígitos y un número de cuenta de 13 dígitos (sucursal de tres dígitos y cuenta de diez dígitos). Bank Leumi (número bancario 10), Bank Hapoalim (12), Israel Discount Bank (11) y Mizrahi Tefahot Bank (20) son los cuatro bancos más grandes por activos. Su IBAN se muestra en su cuenta de banca en línea y en su extracto bancario.",
      "El sistema ZAHAV de Israel procesa las transferencias interbancarias en ILS del mismo día entre bancos israelíes utilizando el IBAN. Para las transferencias internacionales desde el extranjero, los remitentes necesitan su IBAN IL completo de 23 caracteres y el código SWIFT/BIC de su banco. Las regulaciones del Banco de Israel exigen que ciertos flujos de entrada en moneda extranjera por encima de umbrales definidos sean notificados, y su banco puede pedirle que documente el origen de las grandes transferencias internacionales.",
      "Israel tiene una gran diáspora, especialmente en América del Norte y Europa, de la que las remesas son una fuente habitual de transferencias SWIFT entrantes. Muchos bancos israelíes ofrecen cuentas en moneda extranjera (USD, EUR, GBP) junto a la cuenta estándar en ILS, cada una con su propio IBAN. Si recibe regularmente transferencias en USD o EUR, mantener una cuenta en moneda extranjera puede evitar costosas conversiones a ILS al tipo de cambio minorista de su banco.",
    ],
  },
  brazil: {
    title: "Cómo se usa el IBAN en Brasil",
    intro:
      "Brasil utiliza un IBAN de 29 caracteres supervisado por el Banco Central do Brasil (BCB). Las cuentas bancarias brasileñas llevan el prefijo BR y el IBAN se utiliza para las transferencias internacionales a Brasil, junto al número de identificación fiscal doméstico CPF (personas físicas) o CNPJ (empresas). Brasil no forma parte de SEPA; los pagos internacionales se procesan a través de SWIFT. La moneda doméstica es el real brasileño (BRL). A nivel doméstico, los brasileños utilizan los sistemas de pago PIX, TED y DOC — el IBAN se utiliza específicamente para el enrutamiento internacional.",
    bullets: [
      "Un IBAN brasileño tiene 29 caracteres: el código de país BR, dos dígitos de control, un código bancario de ocho dígitos (código ISPB), un código de sucursal de cinco dígitos, un número de cuenta de diez dígitos y dos caracteres de control. Los principales bancos incluyen Banco do Brasil (ISPB 00000000), Itaú Unibanco (60701190), Bradesco (60746948) y Santander Brasil (90400888). Su IBAN no siempre se muestra de forma destacada en las aplicaciones bancarias brasileñas, que se centran en las claves PIX y los números de cuenta domésticos — puede que necesite contactar directamente con su banco para obtenerlo.",
      "El sistema de pago instantáneo PIX de Brasil, lanzado en 2020 y regulado por el BCB, domina las transferencias domésticas utilizando el CPF, el número de teléfono o el correo electrónico como identificadores en lugar del IBAN. Sin embargo, para recibir transferencias internacionales desde el extranjero, el remitente necesita su IBAN BR completo de 29 caracteres, el código SWIFT/BIC de su banco y, a menudo, su número fiscal CPF o CNPJ por razones de cumplimiento.",
      "Al recibir una transferencia en moneda extranjera a Brasil, las regulaciones del BCB exigen que los fondos sean convertidos a BRL al tipo de cambio acordado con su banco. El impuesto IOF (Imposto sobre Operações Financeiras) de Brasil se aplica a las transferencias en moneda extranjera entrantes a tipos variables según el tipo de transacción. Las transferencias clasificadas como préstamos financieros, inversiones de capital o pagos comerciales conllevan diferentes tasas de IOF — consulte a un asesor fiscal local o a su banco si recibe regularmente transferencias internacionales por encima de importes modestos.",
    ],
  },
  ukraine: {
    title: "Cómo se usa el IBAN en Ucrania",
    intro:
      "Ucrania adoptó el estándar IBAN de 29 caracteres en 2019 bajo un mandato del Banco Nacional de Ucrania (NBU), sustituyendo el sistema heredado MFO (código de clasificación bancaria) y número de cuenta para las transferencias internacionales. Las cuentas bancarias ucranianas llevan el prefijo UA. Ucrania no forma parte de SEPA; los pagos transfronterizos se procesan a través de SWIFT en UAH o moneda extranjera. Las transferencias domésticas utilizan el sistema de compensación SEP (Sistema de Pagos Electrónicos) operado por el NBU.",
    bullets: [
      "Un IBAN ucraniano tiene 29 caracteres: el código de país UA, dos dígitos de control, un código de clasificación bancaria MFO de seis dígitos y un número de cuenta de 19 dígitos. Los principales bancos incluyen PrivatBank (MFO 305299), Oschadbank (322001), Raiffeisen Bank Ukraine (380805) y PUMB (334851). Su IBAN está disponible en la banca en línea, la aplicación Privat24 u otras aplicaciones móviles, o puede solicitarlo en cualquier sucursal.",
      "El sistema SEP de Ucrania procesa las transferencias interbancarias domésticas en UAH utilizando el IBAN completo. Para las transferencias internacionales desde el extranjero, los remitentes necesitan el IBAN UA de 29 caracteres del beneficiario y el código SWIFT/BIC del banco. Debido al conflicto en curso desde 2022, algunos proveedores de pago internacionales han restringido las transferencias a Ucrania; sin embargo, los principales bancos incluidos PrivatBank y Oschadbank continúan procesando las transferencias SWIFT entrantes.",
      "El NBU de Ucrania ha implementado controles de capital temporales y restricciones de divisas desde 2022. Las transferencias entrantes en moneda extranjera que superen ciertos umbrales pueden estar sujetas a conversión obligatoria a UAH al tipo de cambio del NBU, y puede requerirse documentación del propósito de la transferencia. Si recibe remesas del extranjero, confirme las normas actuales del NBU con su banco, ya que estas regulaciones se actualizan periódicamente.",
    ],
  },
  georgia: {
    title: "Cómo se usa el IBAN en Georgia",
    intro:
      "Georgia adoptó el estándar IBAN bajo el Banco Nacional de Georgia (NBG). Las cuentas bancarias georgianas llevan un IBAN de 22 caracteres con prefijo GE. Georgia no forma parte de SEPA; las transferencias internacionales se procesan a través de SWIFT. La moneda doméstica es el lari georgiano (GEL). El sector bancario georgiano está concentrado, con dos bancos dominantes — TBC Bank y Bank of Georgia — que representan la mayoría de los activos bancarios del país y gestionan la mayor parte de las transferencias internacionales.",
    bullets: [
      "Un IBAN georgiano tiene 22 caracteres: el código de país GE, dos dígitos de control, un código bancario alfanumérico de dos caracteres y un número de cuenta de 16 dígitos. TBC Bank utiliza el código bancario TB, mientras que Bank of Georgia utiliza GG. Liberty Bank (LB) y ProCredit Bank Georgia (PC) son otras instituciones destacadas. Su IBAN está disponible a través de las aplicaciones móviles de TBC o BOG, los portales de banca por internet o en su extracto de cuenta.",
      "El sistema de pago interbancario doméstico de Georgia utiliza el IBAN como identificador de cuenta estándar para todas las transferencias en GEL y en moneda extranjera entre bancos georgianos. Para las transferencias internacionales desde el extranjero, los remitentes necesitan el IBAN GE de 22 caracteres del beneficiario y el código SWIFT/BIC del banco. Tanto TBC Bank como Bank of Georgia tienen sólidas redes internacionales de banca corresponsal y gestionan eficientemente las transferencias entrantes en múltiples divisas.",
      "Georgia es cada vez más popular como base para trabajadores remotos, nómadas digitales y empresas internacionales debido a su régimen fiscal liberal y la facilidad para operar con cuentas bancarias. Los bancos georgianos permiten abrir cuentas en GEL, USD, EUR y GBP — cada tenencia de moneda tiene normalmente su propio IBAN. Al recibir transferencias internacionales, especifique qué cuenta de moneda debe recibir los fondos para evitar la conversión automática a GEL al tipo de cambio minorista menos favorable de su banco.",
    ],
  },
  },
  faqs: {
  denmark: [
    {
      q: "¿Cuál es el formato del IBAN para Dinamarca?",
      a: "Un IBAN danés tiene exactamente 18 caracteres. Comienza con el código de país DK, seguido de 2 dígitos de control, un código bancario de 4 dígitos (número de registro) y un número de cuenta de 10 dígitos. Ejemplo: DK50 0040 0440 1162 43.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Dinamarca?",
      a: "Tu IBAN danés (DK) aparece en la banca en línea (netbank) o en la aplicación móvil de tu banco, en la sección de detalles de cuenta. Danske Bank, Nordea Denmark, Jyske Bank y Nykredit muestran de forma destacada el IBAN de 18 caracteres. También aparece en los extractos bancarios. Si solo conoces tu número de registro y número de cuenta, tu banco puede proporcionarte el IBAN completo.",
    },
    {
      q: "¿Dinamarca forma parte de SEPA?",
      a: "Sí. Dinamarca es miembro de la UE y participante pleno de SEPA, lo que significa que las transferencias en euros desde otros países de la UE y el EEE se procesan de forma económica a través de SEPA Credit Transfer (SCT). Sin embargo, la moneda de Dinamarca es la corona danesa (DKK), por lo que los pagos SEPA entrantes en EUR se convertirán a DKK, a menos que dispongas de una cuenta en EUR dedicada.",
    },
    {
      q: "¿Cuál es la diferencia entre un número de registro danés y un IBAN?",
      a: "El número de registro danés (registreringsnummer) es un código de 4 dígitos que identifica el banco o la sucursal, combinado con un número de cuenta de 10 dígitos para transferencias domésticas. El IBAN envuelve estos datos en un formato internacional: DK + 2 dígitos de control + el número de registro de 4 dígitos + el número de cuenta de 10 dígitos, con un total de 18 caracteres.",
    },
    {
      q: "¿Necesito un código BIC/SWIFT para recibir una transferencia a Dinamarca?",
      a: "Para transferencias SEPA desde países de la UE y el EEE en EUR, solo se requiere el IBAN danés (DK) — no se necesita BIC. Para transferencias desde fuera de SEPA, o para transferencias en DKK desde el extranjero, el remitente debe incluir tanto tu IBAN como el código SWIFT/BIC de tu banco. El código SWIFT de Danske Bank es DABADKKK; el de Nordea Denmark es NDEADKKK.",
    },
    {
      q: "¿Puedo recibir DKK desde el extranjero a través de SEPA?",
      a: "No. SEPA solo procesa transferencias en EUR, no en DKK. Si alguien en el extranjero desea enviarte DKK, la transferencia debe realizarse a través de la red SWIFT, y el remitente necesitará tu IBAN danés (DK) más el código SWIFT de tu banco. Para pagos en euros dentro de SEPA, solo se necesita el IBAN.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN danés?",
      a: "Los errores más comunes son: confundir el número de registro de 4 dígitos con el IBAN completo, proporcionar solo el número de cuenta doméstico sin el prefijo DK y los dígitos de control, o transponer dígitos en el número de cuenta de 10 dígitos. Verifica siempre el IBAN completo de 18 caracteres antes de compartirlo con un remitente internacional.",
    },
    {
      q: "¿Qué consideraciones sobre divisas debo tener en cuenta para transferencias a Dinamarca?",
      a: "Dinamarca utiliza la corona danesa (DKK), que está vinculada al euro dentro de una banda estrecha. Si recibes una transferencia SEPA en EUR, tu banco danés la convertirá a DKK a su tipo de cambio. Compara el tipo que ofrece tu banco con el tipo de mercado interbancario para entender el coste de la conversión. Si recibes EUR con frecuencia, consulta a tu banco sobre la posibilidad de abrir una cuenta en EUR dedicada.",
    },
  ],
  "united-kingdom": [
    {
      q: "¿Cuál es el formato del IBAN para el Reino Unido?",
      a: "Un IBAN del Reino Unido tiene exactamente 22 caracteres. Comienza con GB, 2 dígitos de control, un código bancario de 4 caracteres, un código de clasificación (sort code) de 6 dígitos y un número de cuenta de 8 dígitos. Ejemplo: GB29 NWBK 6016 1331 9268 19.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en el Reino Unido?",
      a: "Tu IBAN GB está disponible en la banca en línea o en la aplicación móvil de tu banco, en los detalles de cuenta o en la configuración de pagos internacionales. Barclays, HSBC, Lloyds, NatWest y Nationwide muestran el IBAN de 22 caracteres. También puedes obtenerlo a partir de tu sort code de 6 dígitos y tu número de cuenta de 8 dígitos mediante la herramienta de cálculo de IBAN de tu banco.",
    },
    {
      q: "¿El Reino Unido forma parte de SEPA?",
      a: "No. Desde el Brexit, el Reino Unido ya no forma parte de SEPA (Zona Única de Pagos en Euros). Las transferencias entre el Reino Unido y los países de la UE ahora se canalizan a través de SWIFT en lugar del más económico sistema SEPA Credit Transfer. Esto puede implicar comisiones más elevadas y plazos de tramitación más largos en comparación con las transferencias dentro de la UE.",
    },
    {
      q: "¿Cuál es la diferencia entre sort code/número de cuenta e IBAN en el Reino Unido?",
      a: "El sistema doméstico del Reino Unido utiliza un sort code de 6 dígitos (que identifica el banco y la sucursal) y un número de cuenta de 8 dígitos. El IBAN envuelve estos datos en un formato internacional: GB + 2 dígitos de control + código bancario de 4 letras + el sort code de 6 dígitos + el número de cuenta de 8 dígitos, con un total de 22 caracteres. Para transferencias domésticas en el Reino Unido (Faster Payments, BACS, CHAPS), se usan el sort code y el número de cuenta. Para transferencias internacionales, se requiere el IBAN.",
    },
    {
      q: "¿Necesito un código SWIFT además de mi IBAN para recibir transferencias internacionales en el Reino Unido?",
      a: "Sí. Dado que el Reino Unido está fuera de SEPA, los remitentes del extranjero siempre deben proporcionar tanto tu IBAN GB de 22 caracteres como el código SWIFT/BIC de tu banco. Por ejemplo, el código SWIFT de Barclays es BARCGB22; el de HSBC es MIDLGB22; el de Lloyds es LOYDGB21; el de NatWest es NWBKGB2L.",
    },
    {
      q: "¿Cuáles son los errores más comunes al usar un IBAN del Reino Unido?",
      a: "Los errores más comunes incluyen: proporcionar solo el sort code y el número de cuenta sin el prefijo GB y los dígitos de control, confundir el código bancario de 4 letras con el código SWIFT, e introducir dígitos incorrectos del sort code. Algunos remitentes de la UE también pueden intentar erróneamente enviar mediante SEPA a un IBAN del Reino Unido, lo que puede ser rechazado tras el Brexit — deben utilizar SWIFT.",
    },
    {
      q: "¿Puedo recibir EUR en una cuenta bancaria del Reino Unido?",
      a: "La mayoría de las cuentas estándar del Reino Unido están denominadas en GBP, por lo que las transferencias entrantes en EUR serán convertidas a GBP por tu banco a su tipo de cambio. Algunos bancos del Reino Unido (en particular HSBC, Barclays y bancos digitales como Wise y Revolut) ofrecen cuentas multidivisa o denominadas en EUR. Si recibes EUR con frecuencia, abrir una cuenta en EUR dedicada puede evitar comisiones de conversión.",
    },
  ],
  germany: [
    {
      q: "¿Cuál es el formato del IBAN para Alemania?",
      a: "Un IBAN alemán tiene exactamente 22 caracteres. Comienza con DE, 2 dígitos de control, un Bankleitzahl de 8 dígitos (BLZ — código de clasificación bancaria) y un número de cuenta de 10 dígitos (completado con ceros a la izquierda si es más corto). Ejemplo: DE89 3704 0044 0532 0130 00.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Alemania?",
      a: "Tu IBAN alemán (DE) aparece en la banca en línea (Onlinebanking) o en la aplicación móvil de tu banco. Deutsche Bank, Commerzbank, Sparkassen y Volksbanken/Raiffeisenbanken muestran el IBAN de 22 caracteres en el resumen de cuenta. También aparece en tu Kontoauszug (extracto bancario) y en el anverso de tu Girocard (tarjeta de débito).",
    },
    {
      q: "¿Alemania forma parte de SEPA?",
      a: "Sí. Alemania es miembro fundador de la eurozona y de SEPA. Todas las transferencias en euros, tanto domésticas como transfronterizas, utilizan exclusivamente el IBAN. Dentro de SEPA, solo se requiere el IBAN alemán (DE) para transferencias de crédito en euros — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Qué es un Bankleitzahl (BLZ) y cómo se relaciona con el IBAN?",
      a: "El Bankleitzahl (BLZ) es el código de clasificación bancaria alemán de 8 dígitos que identifica el banco y la sucursal. Se mapea directamente en las posiciones 5-12 del IBAN alemán. Por ejemplo, el BLZ 37040044 de Deutsche Bank aparece como DE89 3704 0044 en el IBAN. El antiguo sistema BLZ + Kontonummer ha sido completamente sustituido por el IBAN para todas las transferencias.",
    },
    {
      q: "¿Necesito un código BIC para transferencias dentro de Alemania o la UE?",
      a: "No. Para transferencias SEPA dentro de la UE y el EEE, solo se requiere el IBAN alemán (DE). Los códigos BIC ya no son obligatorios para las transferencias de crédito SEPA. Sin embargo, para transferencias desde fuera de SEPA (como desde EE. UU. o Asia), el remitente debe incluir el código SWIFT/BIC de tu banco junto con el IBAN.",
    },
    {
      q: "¿Cómo funcionan los débitos directos SEPA (Lastschrift) con el IBAN alemán?",
      a: "Los adeudos directos SEPA en Alemania requieren el IBAN del deudor y un mandato SEPA firmado que autorice al acreedor a cobrar pagos. Este es el estándar para pagos recurrentes como alquiler, suministros, seguros y suscripciones. Al configurar un Lastschrift, proporciona tu IBAN alemán (DE) y firma el formulario de mandato (Lastschriftmandat).",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN alemán?",
      a: "Los errores más comunes incluyen: confundir el BLZ de 8 dígitos con el IBAN completo, proporcionar el Kontonummer sin el prefijo DE y el BLZ, introducir un número de cuenta que no ha sido correctamente completado con ceros hasta 10 dígitos, y transponer dígitos en el BLZ. Verifica siempre el IBAN completo de 22 caracteres antes de compartirlo.",
    },
    {
      q: "¿Pueden Sparkassen, Volksbanken y los bancos en línea recibir transferencias internacionales mediante IBAN?",
      a: "Sí. Todos los bancos alemanes — incluidos Sparkassen, Volksbanken/Raiffeisenbanken, bancos comerciales tradicionales (Deutsche Bank, Commerzbank) y bancos en línea (N26, DKB, ING Germany) — utilizan el mismo formato de IBAN alemán de 22 caracteres y pueden recibir tanto transferencias SEPA como SWIFT. El rango de BLZ identifica la institución específica.",
    },
  ],
  france: [
    {
      q: "¿Cuál es el formato del IBAN para Francia?",
      a: "Un IBAN francés tiene exactamente 27 caracteres. Comienza con FR, 2 dígitos de control, un código bancario de 5 dígitos, un código de sucursal de 5 dígitos (code guichet), un número de cuenta de 11 caracteres y una clave de verificación nacional de 2 dígitos (clé RIB). Ejemplo: FR76 3000 6000 0112 3456 7890 189.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Francia?",
      a: "Tu IBAN francés (FR) aparece en la banca en línea (espace client) o en la aplicación móvil de tu banco. BNP Paribas, Société Générale, Crédit Agricole y La Banque Postale muestran el IBAN de 27 caracteres en la página de detalles de cuenta. También aparece en tu RIB (Relevé d'Identité Bancaire), que puedes descargar o imprimir desde tu banca en línea.",
    },
    {
      q: "¿Francia forma parte de SEPA?",
      a: "Sí. Francia es miembro fundador de la eurozona y de SEPA. Las transferencias en euros desde otros países de la UE y el EEE se procesan mediante SEPA Credit Transfer (SCT) o SEPA Instant Credit Transfer (SCT Inst). Dentro de SEPA, solo se requiere el IBAN francés (FR) — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Qué es un RIB y cómo se relaciona con el IBAN francés?",
      a: "Un RIB (Relevé d'Identité Bancaire) es el documento de identificación de cuenta bancaria francés que contiene el código bancario, el código de sucursal (code guichet), el número de cuenta y la clave RIB. Todos estos componentes se mapean directamente en el IBAN francés. El IBAN es esencialmente FR + 2 dígitos de control + el RIB completo. Cuando alguien solicita tu RIB, proporcionar tu IBAN es equivalente.",
    },
    {
      q: "¿Necesito un código BIC para transferencias SEPA a Francia?",
      a: "No. Para transferencias de crédito SEPA dentro de la UE y el EEE, solo se requiere el IBAN francés (FR). El BIC ya no es obligatorio para las transferencias dentro de SEPA. Para transferencias desde fuera de SEPA (como desde EE. UU., el Reino Unido tras el Brexit, o Asia), el remitente debe incluir tanto tu IBAN FR como el código SWIFT/BIC de tu banco.",
    },
    {
      q: "¿Cómo funcionan los adeudos directos (prélèvement) con el IBAN francés?",
      a: "Los adeudos directos SEPA (prélèvement SEPA) en Francia requieren tu IBAN y un mandato SEPA firmado (mandat de prélèvement). Este es el estándar para pagar servicios básicos franceses (EDF, agua), alquiler, primas de seguros y servicios de suscripción como internet y planes de telefonía móvil. Proporciona tu IBAN FR en el formulario de mandato para autorizar los cobros.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN francés?",
      a: "Los errores más comunes incluyen: confundir la clave RIB (2 dígitos) con los dígitos de control del IBAN, proporcionar solo el número de cuenta doméstico sin el prefijo FR y los códigos, y mezclar el código bancario con el código de sucursal (code guichet). La longitud de 27 caracteres se encuentra entre las más largas de SEPA, por lo que los errores de transposición de dígitos son más probables — verifica siempre con cuidado.",
    },
  ],
  netherlands: [
    {
      q: "¿Cuál es el formato del IBAN para los Países Bajos?",
      a: "Un IBAN neerlandés tiene exactamente 18 caracteres. Comienza con NL, 2 dígitos de control, un código bancario de 4 letras (como ABNA, INGB o RABO) y un número de cuenta de 10 dígitos. Ejemplo: NL91 ABNA 0417 1643 00.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en los Países Bajos?",
      a: "Tu IBAN neerlandés (NL) aparece en la banca en línea o en la aplicación móvil de tu banco. ABN AMRO, ING y Rabobank — los tres bancos neerlandeses más grandes — muestran de forma destacada el IBAN de 18 caracteres en el resumen de cuenta. También aparece en los extractos bancarios, en tu tarjeta de débito y en facturas. El antiguo formato de número de cuenta neerlandés ha sido completamente retirado.",
    },
    {
      q: "¿Los Países Bajos forman parte de SEPA?",
      a: "Sí. Los Países Bajos son miembro fundador de la eurozona y de SEPA. Todas las transferencias en euros, tanto domésticas como transfronterizas, utilizan exclusivamente el IBAN. Dentro de SEPA, solo se requiere el IBAN neerlandés (NL) — no se necesita código BIC/SWIFT para transferencias de crédito en euros.",
    },
    {
      q: "¿Qué significan los códigos bancarios de 4 letras en un IBAN neerlandés?",
      a: "El código bancario de 4 letras en las posiciones 5-8 del IBAN neerlandés identifica el banco: ABNA es ABN AMRO, INGB es ING, RABO es Rabobank, SNSB es SNS Bank, ASNB es ASN Bank, TRIO es Triodos Bank, KNAB es Knab y BUNQ es bunq. Esto facilita identificar la institución que gestiona la cuenta de un vistazo.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir una transferencia internacional en los Países Bajos?",
      a: "Para transferencias SEPA desde países de la UE y el EEE en EUR, solo el IBAN neerlandés (NL) es suficiente. Para transferencias desde fuera del área SEPA (como desde EE. UU., el Reino Unido o Asia), el remitente debe incluir tanto el IBAN como el código SWIFT/BIC del banco. El código SWIFT de ABN AMRO es ABNANL2A; el de ING es INGBNL2A; el de Rabobank es RABONL2U.",
    },
    {
      q: "¿Todavía existen números de cuenta neerlandeses heredados en uso?",
      a: "No. Los Países Bajos fueron uno de los primeros países en retirar completamente los números de cuenta domésticos heredados. Todas las transferencias bancarias neerlandesas — domésticas e internacionales — utilizan exclusivamente el IBAN. Si encuentras un número de cuenta neerlandés en formato antiguo, no puede utilizarse para transferencias; necesitas el IBAN NL completo de 18 caracteres.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN neerlandés?",
      a: "Los errores más comunes incluyen: confundir el código bancario de 4 letras con el código SWIFT/BIC (son diferentes), introducir un número de cuenta incorrecto o desactualizado, y olvidar incluir el prefijo NL al compartirlo con remitentes internacionales. El formato relativamente corto de 18 caracteres hace que los IBAN neerlandeses sean menos propensos a errores de transposición de dígitos que los IBAN más largos.",
    },
  ],
  spain: [
    {
      q: "¿Cuál es el formato del IBAN para España?",
      a: "Un IBAN español tiene exactamente 24 caracteres. Comienza con ES, 2 dígitos de control, y luego el CCC de 20 dígitos (Código Cuenta Cliente), que incluye un código bancario de 4 dígitos, un código de sucursal de 4 dígitos, 2 dígitos de control nacionales y un número de cuenta de 10 dígitos. Ejemplo: ES91 2100 0418 4502 0005 1332.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en España?",
      a: "Tu IBAN español (ES) aparece en la banca en línea (banca online) o en la aplicación móvil de tu banco. Santander, BBVA, CaixaBank y Sabadell muestran el IBAN de 24 caracteres en la página de detalles de cuenta. También aparece en los extractos bancarios y en el contrato de cuenta. Si tienes tu antiguo número CCC, convertirlo a IBAN es sencillo añadiendo el prefijo ES y los dígitos de control.",
    },
    {
      q: "¿España forma parte de SEPA?",
      a: "Sí. España es miembro de la eurozona y de SEPA. Las transferencias en euros desde otros países de la UE y el EEE se procesan mediante SEPA Credit Transfer (SCT) o SEPA Instant Credit Transfer (SCT Inst). Dentro de SEPA, solo se requiere el IBAN español (ES) — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Qué es el CCC y cómo se relaciona con el IBAN español?",
      a: "El CCC (Código Cuenta Cliente) es el número de cuenta bancaria español tradicional de 20 dígitos, compuesto por: un código bancario de 4 dígitos, un código de sucursal de 4 dígitos, 2 dígitos de control (dígitos de control) y un número de cuenta de 10 dígitos. El IBAN envuelve el CCC con el código de país ES y 2 dígitos de control IBAN: ES + dígitos de control + CCC = 24 caracteres.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir una transferencia desde fuera de Europa a España?",
      a: "Para transferencias SEPA desde países de la UE y el EEE, solo se requiere el IBAN español (ES). Para transferencias desde fuera de SEPA (como desde EE. UU., América Latina o Asia), el remitente necesita tanto tu IBAN ES de 24 caracteres como el código SWIFT/BIC de tu banco. El código SWIFT de Santander es BSCHESMM; el de BBVA es BBVAESMM; el de CaixaBank es CABORKMM.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN español?",
      a: "Los errores más comunes incluyen: proporcionar solo el CCC de 20 dígitos sin el prefijo ES y los dígitos de control IBAN, confundir los 2 dígitos de control nacionales del CCC con los 2 dígitos de control IBAN, y mezclar el código bancario con el código de sucursal. España tiene muchas cajas de ahorro locales junto a los grandes bancos comerciales, cada una con su propio código, así que verifica siempre los códigos bancario y de sucursal.",
    },
    {
      q: "¿Cómo funcionan los adeudos directos (domiciliación) con el IBAN español?",
      a: "Los adeudos directos SEPA (domiciliación bancaria) en España requieren tu IBAN y un mandato SEPA firmado. Esta es la forma estándar de pagar servicios básicos, alquiler, seguros, facturas de teléfono y suscripciones en España. Proporciona tu IBAN ES al rellenar el formulario de mandato (orden de domiciliación). Tu banco almacena el mandato de forma electrónica.",
    },
  ],
  italy: [
    {
      q: "¿Cuál es el formato del IBAN para Italia?",
      a: "Un IBAN italiano tiene exactamente 27 caracteres. Comienza con IT, 2 dígitos de control, un CIN de 1 carácter (Número de Control Interno), un código bancario ABI de 5 dígitos, un código de sucursal CAB de 5 dígitos y un número de cuenta de 12 caracteres. Ejemplo: IT60 X054 2811 1010 0000 0123 456.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Italia?",
      a: "Tu IBAN italiano (IT) aparece en la banca por internet o en la aplicación móvil de tu banco. UniCredit, Intesa Sanpaolo, Banco BPM y BPER Banca muestran el IBAN de 27 caracteres en el resumen de cuenta (estratto conto). También aparece en los extractos bancarios y en los documentos de bienvenida (foglio informativo) que recibiste al abrir la cuenta.",
    },
    {
      q: "¿Italia forma parte de SEPA?",
      a: "Sí. Italia es miembro fundador de la eurozona y de SEPA. Todas las transferencias en euros, tanto domésticas como transfronterizas, utilizan el IBAN. Dentro de SEPA, solo se requiere el IBAN italiano (IT) para transferencias de crédito en euros — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Qué son los códigos CIN, ABI y CAB en un IBAN italiano?",
      a: "El CIN (Número de Control Interno) es un único carácter utilizado para la validación doméstica italiana. El ABI (Associazione Bancaria Italiana) es un código bancario de 5 dígitos — por ejemplo, 05428 para UniCredit, 03069 para Intesa Sanpaolo. El CAB (Codice di Avviamento Bancario) es un código de sucursal de 5 dígitos. Juntos, CIN + ABI + CAB + número de cuenta forman el BBAN italiano integrado en el IBAN.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir transferencias internacionales en Italia?",
      a: "Para transferencias SEPA desde países de la UE y el EEE en EUR, solo el IBAN italiano (IT) es suficiente — no se requiere código SWIFT. Para transferencias desde fuera de SEPA (como desde EE. UU., el Reino Unido o países no pertenecientes a la UE), el remitente necesita tanto tu IBAN IT de 27 caracteres como el código SWIFT/BIC de tu banco. El código SWIFT de UniCredit es UNCRITMM; el de Intesa Sanpaolo es BCITITMM.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN italiano?",
      a: "Los errores más comunes incluyen: omitir el carácter CIN (posición 5), confundir el código bancario ABI con el código de sucursal CAB, proporcionar solo las coordenadas bancarias domésticas sin el prefijo IT, e introducir un número de cuenta que no ha sido completado con ceros hasta 12 caracteres. La longitud de 27 caracteres hace que la verificación cuidadosa sea importante.",
    },
    {
      q: "¿Cómo configuro los adeudos directos (addebito diretto) con mi IBAN italiano?",
      a: "Los adeudos directos SEPA (addebito diretto SEPA o SDD) en Italia requieren tu IBAN y un mandato SEPA firmado. Este es el estándar para pagar servicios básicos italianos, impuestos (pagos F24), seguros y suscripciones. Proporciona tu IBAN IT en el formulario de mandato. Los bancos italianos procesan los cobros SDD de forma electrónica a través de la infraestructura SEPA.",
    },
    {
      q: "¿Puedo usar mi IBAN italiano para pagos de nómina e impuestos?",
      a: "Sí. Los empleadores italianos pagan los salarios (stipendio) directamente a tu IBAN IT. Los pagos de impuestos (modelo F24), las cotizaciones a la seguridad social (INPS) y las prestaciones gubernamentales están todos vinculados a tu IBAN. Al comenzar un empleo o registrarte en el INPS, se te pedirá que proporciones tu IBAN IT completo de 27 caracteres.",
    },
  ],
  belgium: [
    {
      q: "¿Cuál es el formato del IBAN para Bélgica?",
      a: "Un IBAN belga tiene exactamente 16 caracteres — uno de los más cortos de Europa. Comienza con BE, 2 dígitos de control, un código bancario de 3 dígitos, un número de cuenta de 7 dígitos y 2 dígitos de control nacionales. Ejemplo: BE68 5390 0754 7034.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Bélgica?",
      a: "Tu IBAN belga (BE) aparece en la banca en línea o en la aplicación móvil de tu banco. KBC, BNP Paribas Fortis, ING Belgium y Belfius muestran el IBAN de 16 caracteres en el resumen de cuenta. También aparece en los extractos bancarios, en tu tarjeta de débito y en los documentos de bienvenida de tu banco.",
    },
    {
      q: "¿Bélgica forma parte de SEPA?",
      a: "Sí. Bélgica es miembro fundador de la eurozona y de SEPA. Todas las transferencias en euros, tanto domésticas como transfronterizas, utilizan el IBAN. Dentro de SEPA, solo se requiere el IBAN belga (BE) para transferencias de crédito en euros — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Cómo se convirtió el antiguo número de cuenta belga al IBAN?",
      a: "El antiguo número de cuenta bancaria belga de 12 dígitos se mapea directamente en el IBAN. El IBAN es: BE + 2 dígitos de control IBAN + el BBAN de 12 dígitos (compuesto por un código bancario de 3 dígitos, un número de cuenta de 7 dígitos y 2 dígitos de control nacionales). La conversión fue sencilla porque la estructura existente solo necesitaba el prefijo BE y los dígitos de control.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir transferencias desde fuera de Europa?",
      a: "Para transferencias SEPA desde países de la UE y el EEE, solo el IBAN belga (BE) es suficiente. Para transferencias desde fuera de SEPA (como desde EE. UU., el Reino Unido o Asia), el remitente debe incluir tanto el IBAN como el código SWIFT/BIC del banco. El código SWIFT de KBC es KREDBEBB; el de BNP Paribas Fortis es GEBABEBB; el de ING Belgium es BBRUBEBB; el de Belfius es GKCCBEBB.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN belga?",
      a: "Los errores más comunes son: proporcionar solo el antiguo número de cuenta de 12 dígitos sin el prefijo BE y los dígitos de control IBAN, confundir el código bancario de 3 dígitos con el código SWIFT, y transponer dígitos. El formato compacto de 16 caracteres hace que los IBAN belgas sean relativamente fáciles de verificar, pero verifica siempre antes de compartirlo.",
    },
    {
      q: "¿Cómo funcionan los adeudos directos (domiciliëring) con el IBAN belga?",
      a: "Los adeudos directos SEPA (domiciliëring/domiciliation) en Bélgica requieren tu IBAN y un mandato SEPA firmado. Este sistema se usa ampliamente para facturas de servicios básicos, primas de seguros, suscripciones de telecomunicaciones y cuotas de membresía. Bélgica tiene una de las tasas de adopción de adeudos directos SEPA más altas de Europa. Proporciona tu IBAN BE en el formulario de mandato para autorizar al acreedor.",
    },
  ],
  austria: [
    {
      q: "¿Cuál es el formato del IBAN para Austria?",
      a: "Un IBAN austríaco tiene exactamente 20 caracteres. Comienza con AT, 2 dígitos de control, un Bankleitzahl de 5 dígitos (BLZ — código de clasificación bancaria) y un número de cuenta de 11 dígitos. Ejemplo: AT61 1904 3002 3457 3201.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Austria?",
      a: "Tu IBAN austríaco (AT) aparece en la banca en línea (Internetbanking) o en la aplicación móvil de tu banco. Erste Bank, Raiffeisen, Bank Austria (UniCredit) y BAWAG muestran el IBAN de 20 caracteres en el resumen de cuenta (Kontoübersicht). También aparece en los extractos bancarios (Kontoauszug) y en tu tarjeta de débito.",
    },
    {
      q: "¿Austria forma parte de SEPA?",
      a: "Sí. Austria es miembro de la eurozona y de SEPA. Todas las transferencias en euros, tanto domésticas como transfronterizas, utilizan exclusivamente el IBAN. Dentro de SEPA, solo se requiere el IBAN austríaco (AT) para transferencias en euros — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Qué es el Bankleitzahl (BLZ) austríaco y cómo aparece en el IBAN?",
      a: "El BLZ austríaco es un código de clasificación bancaria de 5 dígitos que identifica el banco y la sucursal. Ocupa las posiciones 5-9 del IBAN. Erste Bank utiliza rangos de BLZ que comienzan con 20, los bancos Raiffeisen comienzan con 3, Bank Austria (UniCredit) con 12, y BAWAG con 14. El BLZ más el número de cuenta de 11 dígitos forman el BBAN austríaco.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir una transferencia desde fuera de Europa?",
      a: "Para transferencias SEPA desde países de la UE y el EEE, solo se requiere el IBAN austríaco (AT). Para transferencias desde fuera de SEPA (como desde EE. UU., el Reino Unido o Asia), el remitente necesita tanto tu IBAN AT de 20 caracteres como el código SWIFT/BIC de tu banco. El código SWIFT de Erste Bank es GIBAATWWXXX; el de Raiffeisen Zentralbank es RZBAATWW; el de Bank Austria es BKAUATWW.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN austríaco?",
      a: "Los errores más comunes incluyen: confundir el BLZ de 5 dígitos con el código SWIFT, proporcionar solo el Kontonummer sin el prefijo AT y el BLZ, e introducir dígitos de BLZ incorrectos (que pueden redirigir el pago al banco equivocado). La longitud de 20 caracteres hace que los IBAN austríacos sean relativamente compactos y fáciles de verificar.",
    },
    {
      q: "¿Puedo usar mi IBAN austríaco para pagos de nómina, alquiler y prestaciones gubernamentales?",
      a: "Sí. Los empleadores, propietarios e instituciones gubernamentales austríacas utilizan el IBAN para pagos de nómina, cobro de alquiler y desembolso de prestaciones. Al comenzar un nuevo empleo, firmar un contrato de alquiler o registrarse para recibir prestaciones sociales en Austria, se te pedirá que proporciones tu IBAN AT.",
    },
  ],
  ireland: [
    {
      q: "¿Cuál es el formato del IBAN para Irlanda?",
      a: "Un IBAN irlandés tiene exactamente 22 caracteres. Comienza con IE, 2 dígitos de control, un código bancario de 4 caracteres (como AIBK o BOFI), un código de clasificación de sucursal de 6 dígitos (NSC) y un número de cuenta de 8 dígitos. Ejemplo: IE29 AIBK 9311 5212 3456 78.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Irlanda?",
      a: "Tu IBAN irlandés (IE) aparece en la banca en línea o en la aplicación móvil de tu banco. AIB, Bank of Ireland y Permanent TSB muestran el IBAN de 22 caracteres en la página de detalles de cuenta. También aparece en los extractos bancarios. Si conoces tu NSC (National Sort Code) y número de cuenta, tu banco puede proporcionarte el IBAN completo.",
    },
    {
      q: "¿Irlanda forma parte de SEPA?",
      a: "Sí. Irlanda es miembro de la eurozona y de SEPA. Las transferencias en euros desde otros países de la UE y el EEE se procesan mediante SEPA Credit Transfer (SCT) o SEPA Instant Credit Transfer (SCT Inst). Dentro de SEPA, solo se requiere el IBAN irlandés (IE) — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Qué es el National Sort Code (NSC) y cómo aparece en el IBAN irlandés?",
      a: "El NSC es un código de 6 dígitos que identifica la sucursal bancaria en el sistema doméstico irlandés. Ocupa las posiciones 9-14 del IBAN irlandés, después del código bancario de 4 caracteres. AIB utiliza el código bancario AIBK, Bank of Ireland utiliza BOFI y Permanent TSB utiliza IPBS. El NSC + el número de cuenta de 8 dígitos forman la referencia de cuenta doméstica.",
    },
    {
      q: "¿Las transferencias del Reino Unido a Irlanda siguen utilizando SEPA?",
      a: "No. Desde el Brexit, el Reino Unido ya no forma parte de SEPA. Las transferencias desde bancos del Reino Unido a Irlanda ahora se canalizan a través de SWIFT en lugar del sistema SEPA más económico. Esto puede implicar comisiones más elevadas y plazos de tramitación más largos. El remitente necesita tanto tu IBAN IE como el código SWIFT/BIC de tu banco. El código SWIFT de AIB es AABORKMM; el de Bank of Ireland es BOFIIE2D.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN irlandés?",
      a: "Los errores más comunes incluyen: proporcionar solo el NSC y el número de cuenta sin el prefijo IE, confundir el código bancario de 4 caracteres (AIBK, BOFI) con el código SWIFT, e introducir un código de clasificación de sucursal incorrecto. Verifica siempre el IBAN completo de 22 caracteres antes de compartirlo con un remitente.",
    },
    {
      q: "¿Puedo usar IBAN de bancos digitales (Revolut, N26) para transferencias SEPA en Irlanda?",
      a: "Sí. Los bancos digitales y proveedores de dinero electrónico que operan en Irlanda — incluidos Revolut y N26 — emiten IBAN irlandeses (que comienzan con IE) que funcionan de forma idéntica a los IBAN de bancos tradicionales para pagos SEPA. Puedes recibir transferencias de crédito SEPA, configurar adeudos directos y recibir pagos de nómina utilizando un IBAN IE de banco digital.",
    },
  ],
  portugal: [
    {
      q: "¿Cuál es el formato del IBAN para Portugal?",
      a: "Un IBAN portugués tiene exactamente 25 caracteres. Comienza con PT, 2 dígitos de control, y luego el NIB de 21 dígitos (Número de Identificação Bancária), que consta de un código bancario de 4 dígitos, un código de sucursal de 4 dígitos, un número de cuenta de 11 dígitos y 2 dígitos de control. Ejemplo: PT50 0002 0123 1234 5678 9015 4.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Portugal?",
      a: "Tu IBAN portugués (PT) aparece en la banca en línea (homebanking) o en la aplicación móvil de tu banco. Caixa Geral de Depósitos (CGD), Millennium BCP, Novo Banco y Santander Totta muestran el IBAN de 25 caracteres en la página de detalles de cuenta. También aparece en los extractos bancarios y en el contrato de cuenta.",
    },
    {
      q: "¿Portugal forma parte de SEPA?",
      a: "Sí. Portugal es miembro de la eurozona y de SEPA. Las transferencias en euros desde otros países de la UE y el EEE se procesan mediante SEPA Credit Transfer (SCT) o SEPA Instant Credit Transfer (SCT Inst). Dentro de SEPA, solo se requiere el IBAN portugués (PT) — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Qué es el NIB y cómo se relaciona con el IBAN portugués?",
      a: "El NIB (Número de Identificação Bancária) es la referencia de cuenta bancaria portuguesa tradicional de 21 dígitos, compuesta por un código bancario de 4 dígitos, un código de sucursal de 4 dígitos, un número de cuenta de 11 dígitos y 2 dígitos de control. El IBAN envuelve el NIB: PT + 2 dígitos de control IBAN + NIB de 21 dígitos = 25 caracteres. Si tienes un NIB antiguo, la conversión al IBAN es sencilla.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir transferencias desde fuera de Europa?",
      a: "Para transferencias SEPA desde países de la UE y el EEE, solo el IBAN portugués (PT) es suficiente. Para transferencias desde fuera de SEPA (como desde Brasil, EE. UU. o el Reino Unido), el remitente necesita tanto el IBAN PT de 25 caracteres como el código SWIFT/BIC de tu banco. El código SWIFT de CGD es CGDIPTPL; el de Millennium BCP es BCOMPTPL; el de Novo Banco es BESCPTPL.",
    },
    {
      q: "¿Qué es Multibanco y puede usarse en lugar del IBAN?",
      a: "Multibanco es la ampliamente utilizada red doméstica portuguesa de cajeros automáticos y pagos para facturas, compras y transferencias. Sin embargo, las referencias de Multibanco son solo para uso doméstico y no pueden utilizarse para transferencias internacionales. Al recibir dinero del extranjero, proporciona siempre tu IBAN PT en lugar de una referencia de Multibanco.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN portugués?",
      a: "Los errores más comunes incluyen: proporcionar solo el NIB de 21 dígitos sin el prefijo PT y los dígitos de control IBAN, confundir el código bancario con el código de sucursal, y mezclar los dígitos de control del NIB con los dígitos de control IBAN. Con 25 caracteres, el IBAN portugués es moderadamente largo, así que verifica cada sección con cuidado.",
    },
  ],
  switzerland: [
    {
      q: "¿Cuál es el formato del IBAN para Suiza?",
      a: "Un IBAN suizo tiene exactamente 21 caracteres. Comienza con CH, 2 dígitos de control, un número de compensación bancaria de 5 dígitos y un número de cuenta de 12 dígitos. Ejemplo: CH93 0076 2011 6238 5295 7.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Suiza?",
      a: "Tu IBAN suizo (CH) aparece en la banca electrónica (e-banking) o en la aplicación móvil de tu banco. UBS, Credit Suisse (ahora parte de UBS), Raiffeisen Switzerland, PostFinance y los bancos cantonales (Kantonalbanken) muestran el IBAN de 21 caracteres en el resumen de cuenta. También aparece en los extractos bancarios y en las facturas QR.",
    },
    {
      q: "¿Suiza forma parte de SEPA?",
      a: "Parcialmente. Suiza no es miembro de la UE, pero participa en SEPA para transferencias denominadas en euros. Los pagos SEPA en EUR a un IBAN suizo generalmente se benefician de las tarifas SEPA. Sin embargo, las transferencias en CHF se procesan a través del sistema suizo SIC (Swiss Interbank Clearing) y no forman parte de SEPA. Para CHF entrante desde el extranjero, se utiliza SWIFT.",
    },
    {
      q: "¿Cuál es la diferencia entre transferencias SEPA en EUR y transferencias SWIFT en CHF a Suiza?",
      a: "Las transferencias en EUR desde países SEPA a tu IBAN suizo se canalizan a través de la red SEPA a bajo coste. Las transferencias en CHF desde el extranjero pasan por SWIFT y pueden incurrir en comisiones bancarias corresponsales más elevadas. Confirma siempre con el remitente si está enviando EUR (más económico a través de SEPA) o CHF (canalizado a través de SWIFT).",
    },
    {
      q: "¿Necesito un código BIC para transferencias a Suiza?",
      a: "Para transferencias SEPA en EUR desde países de la UE/EEE, solo el IBAN suizo (CH) suele ser suficiente. Para transferencias en CHF desde el extranjero o cualquier transferencia no SEPA, el remitente necesita tanto el IBAN como el código SWIFT/BIC de tu banco. El código SWIFT de UBS es UBSWCHZH80A; el de Raiffeisen Switzerland es RAIFCH22; el de PostFinance es POFICHBEXXX.",
    },
    {
      q: "¿Qué son las facturas QR y cómo utilizan el IBAN suizo?",
      a: "Las facturas QR suizas reemplazaron los antiguos comprobantes de pago (Einzahlungsschein) e incorporan el IBAN del acreedor directamente en el código QR. Cuando escaneas una factura QR con tu aplicación bancaria, el IBAN y los detalles de pago se completan automáticamente. Para recibir pagos, tu IBAN aparece en tus facturas QR.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN suizo?",
      a: "Los errores más comunes incluyen: confundir el número de compensación de 5 dígitos con el código SWIFT, proporcionar el antiguo número de cuenta postal (Postkonto) en lugar del IBAN, y enviar EUR a una cuenta en CHF o viceversa (lo que activa una conversión). Especifica siempre la divisa y verifica el IBAN de 21 caracteres antes de compartirlo.",
    },
  ],
  sweden: [
    {
      q: "¿Cuál es el formato del IBAN para Suecia?",
      a: "Un IBAN sueco tiene exactamente 24 caracteres. Comienza con SE, 2 dígitos de control, un código bancario de 3 dígitos y una referencia de cuenta de 17 dígitos que incorpora el número de compensación. Ejemplo: SE45 5000 0000 0583 9825 7466.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Suecia?",
      a: "Tu IBAN sueco (SE) está disponible en la banca por internet (internetbank) o en la aplicación móvil de tu banco. Swedbank, SEB, Handelsbanken y Nordea Sweden muestran el IBAN de 24 caracteres en la página de detalles de cuenta. El mapeo del número de compensación doméstico al IBAN varía entre bancos, así que usa la herramienta de búsqueda de IBAN de tu propio banco si no estás seguro.",
    },
    {
      q: "¿Suecia forma parte de SEPA?",
      a: "Sí. Suecia es miembro de la UE y participante pleno de SEPA. Las transferencias en euros desde otros países de la UE y el EEE se procesan mediante SEPA Credit Transfer. Sin embargo, la moneda de Suecia es la corona sueca (SEK), por lo que las transferencias SEPA entrantes en EUR serán convertidas a SEK por tu banco, a menos que dispongas de una cuenta en EUR dedicada.",
    },
    {
      q: "¿Cuál es la diferencia entre un número de compensación sueco, Bankgiro e IBAN?",
      a: "Un número de compensación (4-5 dígitos) identifica el banco y la sucursal para transferencias domésticas. Bankgiro es un sistema de pago de facturas doméstico independiente. El IBAN incorpora el número de compensación en un formato internacional (SE + dígitos de control + código bancario + referencia de cuenta). Los números Bankgiro no están reconocidos fuera de Suecia — para transferencias internacionales, usa siempre tu IBAN SE.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir una transferencia internacional en Suecia?",
      a: "Para transferencias SEPA en EUR desde países de la UE y el EEE, solo se requiere el IBAN sueco (SE). Para transferencias en SEK desde el extranjero o transferencias desde países no pertenecientes a SEPA, el remitente necesita tanto tu IBAN como el código SWIFT/BIC de tu banco. El código SWIFT de Swedbank es SWEDSESS; el de SEB es ESSESESS; el de Handelsbanken es HANDSESS; el de Nordea Sweden es NDEASESS.",
    },
    {
      q: "¿Puedo recibir SEK desde el extranjero a través de SEPA?",
      a: "No. SEPA solo procesa transferencias en EUR. Las transferencias en SEK desde el extranjero deben realizarse a través de SWIFT, y el remitente necesitará tu IBAN SE y el código SWIFT de tu banco. Si alguien en la UE te envía EUR mediante SEPA, tu banco sueco lo convertirá a SEK a su tipo de cambio.",
    },
    {
      q: "¿Cuáles son los errores más comunes al compartir un IBAN sueco?",
      a: "Los errores más comunes incluyen: proporcionar un número Bankgiro en lugar del IBAN (Bankgiro es solo para uso doméstico), confundir el número de compensación con el IBAN, y errores en la referencia de cuenta de 17 dígitos. El mapeo entre los números de compensación domésticos y el IBAN varía según el banco, así que confirma siempre tu IBAN exacto a través de las herramientas de tu banco.",
    },
  ],
  poland: [
    {
      q: "¿Cuál es el formato del IBAN para Polonia?",
      a: "Un IBAN polaco tiene exactamente 28 caracteres — uno de los formatos más largos de Europa. Comienza con PL, 2 dígitos de control y luego el número NRB (Numer Rachunku Bankowego) de 24 dígitos, compuesto por un checksum de 2 dígitos, un código de clasificación bancaria de 8 dígitos y un número de cuenta de 16 dígitos. Ejemplo: PL61 1090 1014 0000 0712 1981 2874.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Polonia?",
      a: "Su IBAN PL está disponible en la banca en línea (bankowosc internetowa) o en la aplicación móvil de su banco. PKO Bank Polski, mBank, ING Bank Slaski, Bank Pekao y Santander Bank Polska muestran el IBAN de 28 caracteres en la página de detalles de la cuenta. Si tiene su NRB (número doméstico de 26 dígitos), simplemente anteponga PL y los 2 dígitos de control del IBAN.",
    },
    {
      q: "¿Polonia forma parte de SEPA?",
      a: "Sí. Polonia es miembro de la UE y participante pleno de SEPA. Las transferencias en euros de otros países de la UE y el EEE pueden recibirse a través de SEPA Credit Transfer. Sin embargo, la moneda de Polonia es el esloti (PLN), por lo que las transferencias SEPA en EUR pueden convertirse a PLN a menos que tenga una cuenta dedicada en EUR. Las transferencias en PLN desde el extranjero se realizan a través de SWIFT.",
    },
    {
      q: "¿Qué es el NRB y cómo se relaciona con el IBAN polaco?",
      a: "El NRB (Numer Rachunku Bankowego) es el número de cuenta bancaria doméstico de 26 dígitos de Polonia, compuesto por un checksum de 2 dígitos, un código de clasificación bancaria de 8 dígitos y un número de cuenta de 16 dígitos. El IBAN añade el código de país PL y 2 dígitos de control del IBAN al inicio: PL + dígitos de control + porción de 24 dígitos del NRB = 28 caracteres.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir transferencias del extranjero en Polonia?",
      a: "Para transferencias SEPA en EUR de países de la UE y el EEE, solo el IBAN PL es suficiente. Para transferencias en PLN desde el extranjero o cualquier transferencia desde fuera de SEPA, el remitente necesita tanto su IBAN PL de 28 caracteres como el código SWIFT/BIC de su banco. El código SWIFT de PKO BP es BPKOPLPW; el de mBank es BREXPLPW; el de ING Bank Slaski es INGBPLPW.",
    },
    {
      q: "¿Los bancos polacos tienen cuentas separadas en EUR y PLN?",
      a: "Sí. Muchos bancos polacos mantienen cuentas separadas en EUR y PLN, cada una con su propio IBAN. Si recibe regularmente EUR desde dentro de la UE, consulte con su banco sobre la apertura de una cuenta dedicada en EUR para evitar la conversión automática a PLN. PKO BP, mBank e ING ofrecen opciones de cuentas multidivisa.",
    },
    {
      q: "¿Cuáles son los errores comunes al compartir un IBAN polaco?",
      a: "Los errores comunes incluyen: confundir el formato doméstico NRB con el IBAN (el NRB tiene 26 dígitos sin el prefijo PL), transponer dígitos en el largo IBAN de 28 caracteres y proporcionar el código de clasificación incorrecto. La longitud de 28 caracteres hace que los IBANs polacos sean más propensos a errores de transcripción — compruebe siempre antes de compartir.",
    },
    {
      q: "¿Qué sistemas de pago domésticos usa Polonia junto con el IBAN?",
      a: "El sistema Elixir de Polonia gestiona las transferencias domésticas estándar en PLN y Express Elixir proporciona pagos instantáneos en PLN — ambos usan el IBAN internamente. BLIK es el popular sistema de pago móvil de Polonia para pagos en tienda y entre particulares. Para transferencias internacionales, SWIFT y el IBAN PL son el estándar requerido.",
    },
  ],
  norway: [
    {
      q: "¿Cuál es el formato del IBAN para Noruega?",
      a: "Un IBAN noruego tiene exactamente 15 caracteres — uno de los más cortos de Europa. Comienza con NO, 2 dígitos de control y luego el número de cuenta doméstico de 11 dígitos (número de registro bancario de 4 dígitos, número de cuenta de 6 dígitos y 1 dígito de control). Ejemplo: NO93 8601 1117 947.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Noruega?",
      a: "Su IBAN NO se muestra en la banca en línea (nettbank) o en la aplicación móvil de su banco. DNB, Nordea Norway, SpareBank 1 y Handelsbanken Norway muestran el IBAN de 15 caracteres en el resumen de la cuenta. También aparece en los extractos bancarios. Como el IBAN es simplemente NO + dígitos de control + su número de cuenta de 11 dígitos, es fácil de deducir.",
    },
    {
      q: "¿Noruega forma parte de SEPA?",
      a: "Sí. Aunque Noruega no es miembro de la UE, forma parte del EEE (Espacio Económico Europeo) y participa plenamente en SEPA. Las transferencias en euros de países de la UE y el EEE se procesan a través de SEPA Credit Transfer. La moneda de Noruega es la corona noruega (NOK), por lo que los pagos SEPA en EUR serán convertidos a NOK por su banco.",
    },
    {
      q: "¿Cuál es la diferencia entre un número de cuenta noruego y un IBAN?",
      a: "Un número de cuenta doméstico noruego tiene 11 dígitos: un número de registro bancario de 4 dígitos, un número de cuenta de 6 dígitos y 1 dígito de control. El IBAN envuelve esto con el prefijo NO y 2 dígitos de control: NO + 2 dígitos de control + número de cuenta de 11 dígitos = 15 caracteres. El formato corto hace que los IBANs noruegos sean fáciles de comunicar.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir una transferencia del extranjero en Noruega?",
      a: "Para transferencias SEPA en EUR de países de la UE y el EEE, solo se requiere el IBAN NO. Para transferencias en NOK desde el extranjero o transferencias desde fuera de SEPA, el remitente necesita tanto el IBAN como el código SWIFT/BIC de su banco. El código SWIFT de DNB es DNBANOKKXXX; el de Nordea Norway es NDEANOKK; el de SpareBank 1 SR-Bank es SPRONO22.",
    },
    {
      q: "¿Puedo recibir NOK desde el extranjero a través de SEPA?",
      a: "No. SEPA solo procesa transferencias en EUR. Las transferencias en NOK desde el extranjero se realizan a través de SWIFT, y el remitente necesita su IBAN NO y código SWIFT. Si alguien en la UE envía EUR a través de SEPA, su banco noruego lo convertirá a NOK al tipo de cambio del banco. Compare este tipo con el tipo de cambio interbancario para evaluar el coste de la conversión.",
    },
    {
      q: "¿Qué es Vipps y puede recibir transferencias internacionales?",
      a: "Vipps es el sistema de pago móvil dominante en Noruega para pagos domésticos entre particulares y comerciantes. Sin embargo, Vipps es estrictamente un sistema noruego doméstico y no puede recibir transferencias internacionales. Para dinero que llega del extranjero, comparta siempre su IBAN NO (y código SWIFT para remitentes fuera de SEPA) en lugar de sus datos de Vipps.",
    },
    {
      q: "¿Cuáles son los errores comunes al compartir un IBAN noruego?",
      a: "Los errores comunes incluyen: proporcionar solo el número de cuenta doméstico de 11 dígitos sin el prefijo NO y los dígitos de control, confundir el número de registro bancario de 4 dígitos con el código SWIFT y transponer dígitos. El formato corto de 15 caracteres hace que los IBANs noruegos sean fáciles de verificar, pero compruebe siempre antes de compartir con remitentes internacionales.",
    },
  ],
  pakistan: [
    {
      q: "¿Cuál es el formato del IBAN para Pakistán?",
      a: "Un IBAN de Pakistán tiene exactamente 24 caracteres. Comienza con el código de país PK, seguido de 2 dígitos de control, un código bancario alfanumérico de 4 caracteres (p. ej., SCBL para Standard Chartered, MUCB para MCB Bank) y un número de cuenta de 16 dígitos. Ejemplo: PK36 SCBL 0000 0011 2345 6702.",
    },
    {
      q: "¿Cuándo adoptó Pakistán el sistema IBAN?",
      a: "El Banco Estatal de Pakistán (SBP) obligó la adopción del IBAN en diciembre de 2012, con la migración completa finalizada en julio de 2013. Todas las cuentas bancarias pakistaníes — incluidas las de bancos comerciales, bancos islámicos y bancos de microfinanzas — ahora tienen un IBAN de 24 caracteres.",
    },
    {
      q: "¿Necesito un IBAN para recibir dinero del extranjero en Pakistán?",
      a: "Sí. Todas las transferencias internacionales a Pakistán requieren el IBAN completo de 24 caracteres del beneficiario junto con el código SWIFT/BIC del banco. Sin un IBAN válido, el pago puede retrasarse o ser rechazado por el banco beneficiario.",
    },
    {
      q: "¿Pakistán forma parte de SEPA?",
      a: "No. Pakistán no forma parte de SEPA (Zona Única de Pagos en Euros). Las transferencias internacionales a Pakistán se procesan a través de la red SWIFT, que generalmente tarda de 1 a 3 días hábiles y puede conllevar comisiones de bancos intermediarios.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Pakistán?",
      a: "Puede encontrar su IBAN de Pakistán a través del portal de banca en línea o de la aplicación móvil de su banco, en su extracto bancario o en el anverso/reverso de su tarjeta de débito. También puede visitar su sucursal bancaria y solicitarlo. Los principales bancos como HBL, UBL, MCB y Meezan Bank muestran el IBAN en sus aplicaciones de banca digital.",
    },
    {
      q: "¿Cuáles son los códigos bancarios de los principales bancos pakistaníes?",
      a: "Cada banco pakistaní tiene un código único de 4 caracteres asignado por el SBP: SCBL (Standard Chartered), MUCB (MCB Bank), HABB (Bank Al Habib), UNIL (United Bank Limited), ALFH (Allied Bank), FAYS (Faysal Bank), MEZU (Meezan Bank), BKIP (BankIslami), HMBK (Habib Metropolitan Bank) y JSBL (JS Bank).",
    },
    {
      q: "¿Las remesas familiares a Pakistán están gravadas?",
      a: "No. Según los esquemas de incentivos del SBP, las remesas familiares recibidas a través de canales bancarios (incluidas las transferencias bancarias basadas en IBAN) están exentas de retención fiscal e impuesto sobre la renta. Esto hace que las transferencias bancarias sean una de las formas más eficientes fiscalmente de recibir dinero del extranjero en Pakistán.",
    },
    {
      q: "¿Las cuentas de billetera móvil (JazzCash, Easypaisa) pueden recibir transferencias internacionales mediante IBAN?",
      a: "Sí. Los bancos de microfinanzas como Mobilink Microfinance Bank (JazzCash) y Telenor Microfinance Bank (Easypaisa) emiten IBANs para sus cuentas. Si el remitente tiene el IBAN correcto y el código SWIFT, las transferencias bancarias internacionales pueden acreditarse en estas cuentas bancarias vinculadas a billeteras móviles.",
    },
    {
      q: "¿Qué ocurre con la divisa cuando recibo una transferencia internacional en Pakistán?",
      a: "Las regulaciones del SBP exigen que toda la moneda extranjera entrante se convierta a PKR al tipo de cambio vigente del banco receptor el día del abono. Los beneficiarios no pueden mantener moneda extranjera en una cuenta PKR estándar. El tipo de conversión varía entre bancos, por lo que vale la pena comparar el tipo publicado de su banco con el tipo interbancario.",
    },
    {
      q: "¿Cuál es la diferencia entre el IBAN y el número de cuenta en Pakistán?",
      a: "Su IBAN contiene su número de cuenta pero añade información adicional para el enrutamiento internacional. Un IBAN de Pakistán = PK (país) + 2 dígitos de control + código bancario de 4 caracteres + su número de cuenta de 16 dígitos. El IBAN garantiza que su transferencia internacional llegue al banco y la cuenta correctos sin intervención manual.",
    },
  ],
  turkey: [
    {
      q: "¿Cuál es el formato del IBAN para Turquía?",
      a: "Un IBAN turco tiene exactamente 26 caracteres. Comienza con el código de país TR, seguido de 2 dígitos de control, un código bancario de 5 dígitos, 1 dígito cero reservado y un número de cuenta de 16 dígitos. Ejemplo: TR33 0006 1005 1978 6457 8413 26.",
    },
    {
      q: "¿Cuándo empezó Turquía a usar el IBAN?",
      a: "Turquía adoptó el IBAN en 2010 por mandato de la Agencia de Regulación y Supervisión Bancaria (BDDK) y el Banco Central de la República de Turquía (TCMB). Desde entonces, todas las cuentas bancarias turcas tienen un IBAN TR de 26 caracteres.",
    },
    {
      q: "¿Turquía forma parte de SEPA?",
      a: "No. Turquía no es miembro de SEPA (Zona Única de Pagos en Euros). Todas las transferencias internacionales a Turquía se enrutan a través de la red SWIFT, que generalmente tarda de 1 a 3 días hábiles y puede conllevar comisiones de banca corresponsal.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Garanti BBVA, Is Bankasi o Akbank?",
      a: "Inicie sesión en la aplicación móvil o en el portal de banca por internet de su banco — su IBAN TR se muestra en la página de resumen de la cuenta. También puede encontrarlo en su extracto bancario o visitando una sucursal. Garanti BBVA, Is Bankasi, Akbank y Yapi Kredi muestran prominentemente el IBAN de 26 caracteres en sus interfaces de banca digital.",
    },
    {
      q: "¿Qué códigos bancarios usan los principales bancos turcos en el IBAN?",
      a: "Cada banco turco tiene un código bancario único de 5 dígitos integrado en las posiciones 5 a 9 del IBAN. Garanti BBVA es 00062, Is Bankasi es 00064, Akbank es 00046, Yapi Kredi es 00067 y Ziraat Bankasi es 00010. Estos códigos son asignados por el TCMB.",
    },
    {
      q: "¿Qué debo proporcionar para recibir una transferencia del extranjero?",
      a: "Comparta su IBAN TR completo de 26 caracteres y el código SWIFT/BIC de su banco. Por ejemplo, el código SWIFT de Garanti BBVA es TGBATRISXXX. Sin ambos datos, el banco remitente puede no ser capaz de enrutar la transferencia correctamente.",
    },
    {
      q: "¿Llegará el dinero en TRY o en la divisa del remitente?",
      a: "Depende del tipo de cuenta y de la configuración de su banco. La mayoría de las cuentas turcas son cuentas en TRY, por lo que la moneda extranjera entrante se convierte al tipo de cambio vigente de su banco. Algunos bancos turcos ofrecen subcuentas en USD o EUR — si el suyo lo hace, puede indicar al remitente que especifique la divisa correcta para que aterrice en una cuenta en moneda extranjera y evitar la conversión inmediata a TRY.",
    },
    {
      q: "¿El sistema EFT o FAST de Turquía usa el IBAN?",
      a: "Sí. Tanto EFT (Elektronik Fon Transferi) para transferencias domésticas de alto valor en el mismo día como FAST para pagos minoristas instantáneos usan el IBAN como identificador de cuenta dentro de Turquía. Estos sistemas son solo para transferencias domésticas en TRY — para transferencias internacionales, se requieren SWIFT y su IBAN TR.",
    },
  ],
  romania: [
    {
      q: "¿Cuál es el formato del IBAN para Rumanía?",
      a: "Un IBAN rumano tiene exactamente 24 caracteres. Comienza con RO, 2 dígitos de control, un código bancario alfanumérico de 4 caracteres y un número de cuenta de 16 caracteres. Ejemplo: RO49 AAAA 1B31 0075 9384 0000.",
    },
    {
      q: "¿Rumanía forma parte de SEPA?",
      a: "Sí. Rumanía es miembro de SEPA, lo que significa que las transferencias en euros de otros países de la UE y el EEE pueden procesarse de forma económica y rápida a través del esquema SEPA Credit Transfer. Sin embargo, la moneda de Rumanía es el leu rumano (RON), por lo que las transferencias SEPA en euros pueden convertirse a RON al recibirlas, a menos que tenga una cuenta en EUR.",
    },
    {
      q: "¿Cuáles son los códigos bancarios de BCR, BRD, ING Romania y Banca Transilvania?",
      a: "Los códigos bancarios de 4 caracteres integrados en los IBANs rumanos son: RNCB para Banca Comerciala Romana (BCR), BRDE para BRD Groupe Société Générale, INGB para ING Romania y BTRL para Banca Transilvania. Estos códigos identifican de manera única al banco dentro de la estructura IBAN.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco rumano?",
      a: "Su IBAN está disponible en el portal de banca en línea o en la aplicación móvil de su banco, en su extracto bancario o solicitándolo en una sucursal. La aplicación George de BCR, la aplicación MyBRD de BRD y BT Pay de Banca Transilvania muestran el IBAN RO completo de 24 caracteres en la pantalla de detalles de la cuenta.",
    },
    {
      q: "¿Puedo recibir transferencias en RON desde el extranjero usando mi IBAN?",
      a: "Sí, pero las transferencias en RON desde fuera de Rumanía se realizan a través de SWIFT en lugar de SEPA. El remitente necesita su IBAN RO de 24 caracteres y el código SWIFT/BIC de su banco. SEPA solo transporta EUR, por lo que cualquier transferencia en RON debe realizarse a través de la red bancaria corresponsal SWIFT tradicional.",
    },
    {
      q: "¿Necesito un código BIC para transferencias en euros a Rumanía desde la UE?",
      a: "Para las SEPA Credit Transfers dentro de la UE y el EEE, el IBAN solo es suficiente — no se requiere BIC. Sin embargo, para transferencias desde fuera de SEPA (por ejemplo, desde EE. UU. o el Reino Unido), el remitente debe incluir tanto el IBAN RO como el código SWIFT/BIC del banco para garantizar el enrutamiento correcto.",
    },
    {
      q: "¿Cuál es el sistema de pago doméstico de Rumanía?",
      a: "El Banco Nacional de Rumanía (BNR) opera el sistema de liquidación bruta en tiempo real ReGIS para pagos de alto valor y el sistema de compensación electrónica SENT para transacciones minoristas. Ambos usan el IBAN como referencia de cuenta. Rumanía también participa en SEPA Instant Credit Transfer (SCT Inst) a través de bancos seleccionados.",
    },
  ],
  czechia: [
    {
      q: "¿Cuál es el formato del IBAN para Chequia?",
      a: "Un IBAN checo tiene exactamente 24 caracteres. Comienza con CZ, 2 dígitos de control, un código bancario de 4 dígitos, un prefijo de cuenta de 6 dígitos (rellenado con ceros) y un número de cuenta de 10 dígitos. Ejemplo: CZ65 0800 0000 1920 0014 5399.",
    },
    {
      q: "¿Cómo se relaciona el número de cuenta doméstico checo con el IBAN?",
      a: "Las cuentas domésticas checas se expresan como prefijo-numerocuenta/codigobanco (p. ej., 19-2000145399/0800). Para formar el IBAN, el código bancario de 4 dígitos ocupa las posiciones 5 a 8, el prefijo de 6 dígitos (rellenado con ceros) ocupa las posiciones 9 a 14 y el número de cuenta de 10 dígitos rellena las posiciones 15 a 24. El Banco Nacional Checo (CNB) proporciona una herramienta de conversión oficial en su sitio web.",
    },
    {
      q: "¿Chequia forma parte de SEPA?",
      a: "Sí. Chequia es miembro de SEPA, lo que permite transferencias en euros económicas y rápidas desde países de la UE y el EEE. Sin embargo, la moneda doméstica es la corona checa (CZK), por lo que los pagos SEPA entrantes en EUR pueden convertirse a CZK a menos que tenga una cuenta dedicada en EUR en su banco checo.",
    },
    {
      q: "¿Cuáles son los códigos bancarios de CSOB, Komercni banka y Ceska sporitelna?",
      a: "Los códigos bancarios de 4 dígitos usados en los IBANs checos son: 0300 para CSOB (Ceskoslovenska obchodni banka), 0100 para Komercni banka y 0800 para Ceska sporitelna (propiedad de Erste Group). Otros códigos comunes incluyen 2010 para Fio banka, 3030 para Air Bank y 5500 para Raiffeisenbank Czech.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco checo?",
      a: "Su IBAN se muestra en su banca en línea o aplicación móvil en la página de detalles de la cuenta. También aparece en extractos bancarios y correspondencia. La aplicación CSOB Smart de CSOB, el portal MojeBanka de Komercni banka y la aplicación George de Ceska sporitelna muestran el IBAN CZ de 24 caracteres.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir una transferencia internacional a Chequia?",
      a: "Para las transferencias SEPA de países de la UE y el EEE en EUR, solo se requiere el IBAN CZ — no se necesita código SWIFT. Para transferencias en CZK desde fuera de Chequia, o cualquier transferencia desde un país no perteneciente a SEPA, el remitente también necesita el código SWIFT/BIC de su banco.",
    },
    {
      q: "¿Puedo recibir CZK desde el extranjero a través de SEPA?",
      a: "No. Las transferencias SEPA solo transportan EUR — no puede recibir CZK a través de SEPA. Las transferencias en CZK desde el extranjero deben enviarse a través de SWIFT, y el remitente necesitará su IBAN CZ más el código SWIFT de su banco. Algunos bancos checos mantienen tanto una cuenta en CZK como una en EUR, cada una con su propio IBAN.",
    },
  ],
  hungary: [
    {
      q: "¿Cuál es el formato del IBAN para Hungría?",
      a: "Un IBAN húngaro tiene exactamente 28 caracteres — uno de los más largos de Europa. Comienza con HU, 2 dígitos de control y luego el número de cuenta Giro doméstico completo de 24 dígitos, que incluye un código bancario de 3 dígitos, un código de sucursal de 4 dígitos, 1 dígito de control, un número de cuenta de 15 dígitos y un dígito de control final. Ejemplo: HU42 1177 3016 1111 1018 0000 0000.",
    },
    {
      q: "¿Por qué el IBAN húngaro tiene 28 caracteres?",
      a: "El IBAN húngaro tiene 28 caracteres porque el número de cuenta Giro doméstico utilizado para todas las cuentas bancarias húngaras tiene 24 dígitos. El IBAN envuelve el número doméstico completo de 24 dígitos con el código de país HU y 2 dígitos de control, dando como resultado el formato completo de 28 caracteres.",
    },
    {
      q: "¿Hungría forma parte de SEPA?",
      a: "Sí. Hungría es miembro de la UE y participante pleno de SEPA, lo que permite transferencias en euros económicas y rápidas hacia y desde otros países SEPA. La moneda de Hungría es el forinto (HUF), por lo que las transferencias SEPA en EUR pueden convertirse a HUF a menos que se especifique una cuenta en EUR.",
    },
    {
      q: "¿Qué códigos bancarios usan OTP Bank, K&H Bank y Erste Bank Hungary?",
      a: "Los códigos bancarios de 3 dígitos integrados en los IBANs húngaros (posiciones 5 a 7) incluyen: 117 para OTP Bank, 103 para K&H Bank (parte del Grupo KBC), 116 para Erste Bank Hungary y 108 para MKB Bank. El código de sucursal ocupa los siguientes 4 dígitos.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco húngaro?",
      a: "Su IBAN HU se muestra en su banca en línea o aplicación móvil bajo los detalles de la cuenta. La aplicación OTP SmartBank de OTP Bank, la K&H mobilbank de K&H y la plataforma George Hungary de Erste Bank muestran el IBAN de 28 caracteres. También aparece en los extractos bancarios.",
    },
    {
      q: "¿Cuál es el sistema de pago instantáneo de Hungría y usa el IBAN?",
      a: "Sí. El Azonnali Fizetési Rendszer (AFR) de Hungría, lanzado en marzo de 2020, permite transferencias en HUF en tiempo real 24/7 entre todos los bancos húngaros. El AFR utiliza el IBAN HU completo de 28 caracteres como identificador de cuenta. Todos los bancos húngaros están obligados a participar en el AFR.",
    },
    {
      q: "¿Puedo recibir HUF desde el extranjero a través de SEPA?",
      a: "No. Las transferencias SEPA solo procesan EUR, no HUF. Para recibir HUF desde fuera de Hungría, el remitente debe usar una transferencia SWIFT y especificar HUF como divisa. El remitente necesitará su IBAN HU y el código SWIFT/BIC de su banco. Tenga en cuenta que algunos servicios internacionales no ofrecen entrega en HUF — en ese caso, recibir EUR y convertir localmente puede ser la única opción.",
    },
    {
      q: "¿Necesito un código BIC para transferencias SEPA en EUR a Hungría?",
      a: "Dentro de SEPA, solo se requiere el IBAN HU para transferencias en EUR — no se necesita BIC. Para transferencias desde fuera de SEPA (como desde EE. UU. o el Reino Unido), o para transferencias en HUF, el remitente debe incluir el código SWIFT/BIC de su banco junto con el IBAN.",
    },
  ],
  croatia: [
    {
      q: "¿Cuál es el formato del IBAN para Croacia?",
      a: "Un IBAN croata tiene exactamente 21 caracteres. Comienza con HR, 2 dígitos de control, un código de banco y sucursal de 7 dígitos y un número de cuenta de 10 dígitos. Ejemplo: HR12 1001 0051 8630 0016 0.",
    },
    {
      q: "¿Cuándo se incorporó Croacia a la zona euro?",
      a: "Croacia se incorporó a la zona euro el 1 de enero de 2023, sustituyendo la kuna croata (HRK) por el euro (EUR) al tipo de conversión fijo de 7,53450 HRK por EUR. Desde entonces, todas las cuentas bancarias croatas están denominadas en EUR y Croacia se convirtió en miembro pleno de SEPA.",
    },
    {
      q: "¿Croacia forma parte de SEPA?",
      a: "Sí. Croacia es miembro de SEPA desde su incorporación a la zona euro en enero de 2023. Las transferencias en euros de otros países de la UE y el EEE se procesan ahora a través de SEPA Instant Credit Transfer (SCT Inst), liquidándose en segundos. Esto significa que recibir EUR desde el resto de la UE es rápido y económico.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de Zagrebacka banka y PBZ?",
      a: "Zagrebacka banka (ZABA, propiedad de UniCredit) tiene el código SWIFT ZABAHR2X. Privredna banka Zagreb (PBZ, propiedad de Intesa Sanpaolo) usa PBZGHR2X. El código SWIFT de Erste Bank Croatia es ESBCHR22. Estos son necesarios para transferencias entrantes desde fuera del área SEPA.",
    },
    {
      q: "¿Cambiaron los números IBAN croatas cuando el país adoptó el euro?",
      a: "No. La estructura y el formato de los IBANs croatas (HR, 21 caracteres) no cambiaron cuando Croacia adoptó el euro. Solo cambió la denominación en divisa de las cuentas de HRK a EUR. Los números de cuenta existentes simplemente se redenominaron; no necesita un nuevo IBAN.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco croata?",
      a: "Su IBAN HR aparece en la aplicación móvil o en la banca por internet de su banco bajo los detalles de la cuenta. La aplicación m-zaba de Zagrebacka banka, el portal PBZ365 de PBZ y George Croatia de Erste muestran el IBAN de 21 caracteres. También está impreso en los extractos bancarios.",
    },
    {
      q: "¿Necesito un código BIC para recibir EUR de la UE a Croacia?",
      a: "Dentro de SEPA, solo se necesita el IBAN HR para transferencias en euros — no se requiere BIC. Para transferencias desde fuera de SEPA (por ejemplo, desde EE. UU. o países no pertenecientes a la UE), el remitente debe incluir tanto el IBAN como el código SWIFT/BIC de su banco.",
    },
  ],
  finland: [
    {
      q: "¿Cuál es el formato del IBAN para Finlandia?",
      a: "Un IBAN finlandés tiene exactamente 18 caracteres — uno de los IBANs más cortos de Europa. Comienza con FI, 2 dígitos de control, un código de sucursal bancaria de 6 dígitos y un número de cuenta de 8 dígitos con un dígito de control al final. Ejemplo: FI21 1234 5600 0007 85.",
    },
    {
      q: "¿Finlandia forma parte de SEPA?",
      a: "Sí. Finlandia es miembro fundador de la zona euro y de SEPA. Las transferencias en euros de otros países de la UE y el EEE se procesan a través de SEPA Instant Credit Transfer (SCT Inst) o SEPA Credit Transfer (SCT), liquidándose en segundos o al siguiente día hábil. El sector bancario finlandés participa plenamente en ambos esquemas.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Nordea o OP Financial Group?",
      a: "Inicie sesión en el netbank o en la aplicación móvil de Nordea — su IBAN FI se muestra en el resumen de la cuenta. La aplicación móvil OP de OP Financial Group y la banca por internet también muestran el IBAN de 18 caracteres bajo los detalles de la cuenta. Los clientes de Danske Bank Finland pueden encontrar el suyo en la aplicación Danske Mobile. Su IBAN también está impreso en los extractos de cuenta.",
    },
    {
      q: "¿Cómo son los IBANs finlandeses por banco?",
      a: "Los IBANs finlandeses son identificables por la parte del código de sucursal. Las cuentas de Nordea generalmente comienzan con FI12, las de OP Financial Group con FI50–FI58, las de Danske Bank Finland con FI34 y las de Aktia Bank con FI40. El código de sucursal bancaria de 6 dígitos codifica tanto el banco como la sucursal específica.",
    },
    {
      q: "¿Necesito un código BIC para recibir EUR en Finlandia desde la UE?",
      a: "Dentro de SEPA, solo se requiere el IBAN FI para transferencias en euros. El BIC ya no es obligatorio para las SEPA Credit Transfers dentro de la UE y el EEE. Para transferencias desde fuera de SEPA (como desde EE. UU. o el Reino Unido), el remitente debe incluir tanto el IBAN como el código SWIFT/BIC de su banco.",
    },
    {
      q: "¿Qué es el sistema de pago Siirto de Finlandia?",
      a: "Siirto es el servicio de pago instantáneo doméstico de Finlandia que permite transferencias en EUR en tiempo real entre cuentas bancarias finlandesas, usando el IBAN (o el número de teléfono vinculado a una cuenta) como identificador. Se usa para pagos entre particulares y comerciantes, pero es independiente de las transferencias internacionales SEPA — Siirto solo funciona entre cuentas bancarias finlandesas.",
    },
    {
      q: "¿Puedo usar mi IBAN finlandés para recibir salario o prestaciones de Kela?",
      a: "Sí. Los empleadores finlandeses y la institución de seguro social Kela pagan salarios y prestaciones directamente a su IBAN FI. Cuando comience a trabajar en Finlandia o solicite apoyo de Kela, se le pedirá que proporcione el IBAN de su cuenta bancaria. Asegúrese de registrar el IBAN FI correcto de 18 caracteres para evitar retrasos en los pagos.",
    },
  ],
  greece: [
    {
      q: "¿Cuál es el formato del IBAN para Grecia?",
      a: "Un IBAN griego tiene exactamente 27 caracteres. Comienza con GR, 2 dígitos de control, un código bancario de 3 dígitos, un código de sucursal de 4 dígitos y un número de cuenta de 16 dígitos. Ejemplo: GR16 0110 1250 0000 0001 2300 695.",
    },
    {
      q: "¿Grecia forma parte de SEPA?",
      a: "Sí. Grecia es miembro de la zona euro y de SEPA. Las transferencias en euros de otros países de la UE y el EEE se procesan a través de SEPA Credit Transfer (SCT) o SEPA Instant Credit Transfer (SCT Inst). Para transferencias dentro de SEPA, solo se requiere el IBAN GR — no se necesita código BIC/SWIFT.",
    },
    {
      q: "¿Qué códigos bancarios usan Alpha Bank, Eurobank, Piraeus Bank y el Banco Nacional de Grecia?",
      a: "Los códigos bancarios de 3 dígitos en los IBANs griegos son: 014 para Alpha Bank, 026 para Eurobank, 017 para Piraeus Bank y 011 para el Banco Nacional de Grecia (Ethniki Trapeza). Estos códigos aparecen en las posiciones 5 a 7 del IBAN de 27 caracteres.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco griego?",
      a: "Inicie sesión en la banca en línea o en la aplicación móvil de su banco — su IBAN GR generalmente se muestra en el resumen de la cuenta. Alpha Web Banking de Alpha Bank, e-Banking de Eurobank y winbank de Piraeus Bank muestran el IBAN de 27 caracteres. También aparece en extractos bancarios y correspondencia.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir una transferencia desde fuera de la UE a Grecia?",
      a: "Para transferencias SEPA dentro de la UE y el EEE en EUR, no se necesita código SWIFT — solo el IBAN GR. Para transferencias desde países no pertenecientes a SEPA (como EE. UU., Reino Unido o Australia), el remitente necesita tanto su IBAN GR de 27 caracteres como el código SWIFT/BIC de su banco.",
    },
    {
      q: "¿Cuánto tiempo tarda en recibirse una transferencia SEPA en una cuenta bancaria griega?",
      a: "Las SEPA Credit Transfers (SCT) generalmente llegan en un día hábil. Las SEPA Instant Credit Transfers (SCT Inst) pueden liquidarse en segundos si tanto el banco emisor como el receptor admiten el esquema instantáneo. La mayoría de los principales bancos griegos admiten SCT Inst para pagos entrantes de la zona euro.",
    },
    {
      q: "¿Pueden los griegos que viven en el extranjero recibir remesas usando su IBAN griego?",
      a: "Sí, pero el acuerdo funciona a la inversa — son los griegos que viven en Grecia quienes pueden recibir remesas de griegos en el extranjero. Para enviar una transferencia a una cuenta bancaria griega desde fuera de la UE, el remitente debe proporcionar el IBAN GR completo de 27 caracteres del beneficiario y el código SWIFT del banco. Si el remitente está dentro de SEPA, solo el IBAN es suficiente.",
    },
    {
      q: "¿Qué es DIAS y cómo se relaciona con el IBAN griego?",
      a: "DIAS (Diateraiki Agora Simeoseon) es la organización griega de compensación y liquidación interbancaria que opera la infraestructura de pagos domésticos, incluido el procesamiento del esquema SEPA en Grecia. Todas las transferencias bancarias griegas — domésticas e internacionales — se procesan a través de DIAS usando el IBAN como identificador de cuenta.",
    },
  ],
  cyprus: [
    {
      q: "¿Cuál es el formato del IBAN para Chipre?",
      a: "Un IBAN chipriota tiene exactamente 28 caracteres. Comienza con CY, 2 dígitos de control, un código bancario de 3 dígitos, un código de sucursal de 5 dígitos y un número de cuenta de 16 caracteres. Ejemplo: CY17 0020 0128 0000 0012 0052 7600.",
    },
    {
      q: "¿Chipre forma parte de SEPA?",
      a: "Sí. Chipre es miembro de la zona euro y de SEPA. Las transferencias en euros de otros países de la UE y el EEE pueden procesarse a través de SEPA Credit Transfer o SEPA Instant Credit Transfer. Solo se necesita el IBAN CY para las transferencias SEPA — no se requiere BIC.",
    },
    {
      q: "¿Cuáles son los códigos bancarios del Bank of Cyprus y el Hellenic Bank?",
      a: "El Bank of Cyprus usa el código bancario 002 y el Hellenic Bank usa el 005. Estos códigos de 3 dígitos aparecen en las posiciones 5 a 7 del IBAN chipriota de 28 caracteres. Otros bancos como Eurobank Cyprus y Alpha Bank Cyprus tienen sus propios códigos distintos.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en el Bank of Cyprus o el Hellenic Bank?",
      a: "Inicie sesión en la banca por internet 1bank del Bank of Cyprus o en la aplicación BOC — su IBAN CY aparece en la página de detalles de la cuenta. El portal HB Direct de Hellenic Bank y la aplicación móvil también muestran el IBAN de 28 caracteres. También aparece en los extractos bancarios y en la carta de bienvenida que recibió al abrir la cuenta.",
    },
    {
      q: "¿Necesito un código SWIFT para transferencias desde fuera de la UE a Chipre?",
      a: "Para transferencias SEPA de países de la UE y el EEE en EUR, solo se necesita el IBAN CY. Para transferencias desde países no pertenecientes a SEPA — como el Reino Unido tras el Brexit, Rusia o EE. UU. — el remitente necesita tanto el IBAN CY de 28 caracteres como el código SWIFT/BIC del banco. El código SWIFT del Bank of Cyprus es BCYPCY2N; el del Hellenic Bank es HEBACY2N.",
    },
    {
      q: "¿Puedo recibir USD o GBP en una cuenta bancaria chipriota?",
      a: "Sí. Los principales bancos chipriotas, incluidos Bank of Cyprus y Hellenic Bank, ofrecen cuentas multidivisa que pueden recibir USD, GBP y EUR. Cada posición en divisas puede tener su propio IBAN o puede compartir el mismo IBAN con un especificador de divisa. Confirme con su banco si necesita un número de cuenta separado para recibos en moneda extranjera.",
    },
    {
      q: "¿Hay controles de cumplimiento reforzados para grandes transferencias a Chipre?",
      a: "Sí. El sector bancario de Chipre aplica la debida diligencia reforzada para ciertas transferencias internacionales de alto valor o complejas, de conformidad con las regulaciones de la UE contra el blanqueo de capitales y los requisitos del Banco Central de Chipre. Para grandes transferencias entrantes, su banco puede solicitar documentación sobre el propósito y el origen de la transacción. Planificar con antelación y notificar a su banco antes de esperar una gran transferencia puede evitar retrasos.",
    },
  ],
  luxembourg: [
    {
      q: "¿Cuál es el formato del IBAN para Luxemburgo?",
      a: "Un IBAN luxemburgués tiene exactamente 20 caracteres. Comienza con LU, 2 dígitos de control, un código bancario de 3 dígitos y un número de cuenta de 13 dígitos. Ejemplo: LU28 0019 4006 4475 0000.",
    },
    {
      q: "¿Luxemburgo forma parte de SEPA?",
      a: "Sí. Luxemburgo es miembro fundador de la zona euro y de SEPA. Las transferencias en euros de otros países de la UE y el EEE se procesan a través de SEPA Credit Transfer (SCT) o SEPA Instant Credit Transfer (SCT Inst). Solo se necesita el IBAN LU para transferencias SEPA entrantes — no se requiere BIC.",
    },
    {
      q: "¿Qué códigos bancarios usan BGL BNP Paribas, BCEE (Spuerkeess) y Banque de Luxembourg?",
      a: "Códigos bancarios de Luxemburgo (3 dígitos, posiciones 5 a 7 del IBAN): BCEE (Spuerkeess) usa 001, BGL BNP Paribas usa 002 e ING Luxembourg usa 030. Banque de Luxembourg y Raiffeisen Luxembourg tienen cada uno códigos distintos de 3 dígitos asignados por la Banque centrale du Luxembourg.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco luxemburgués?",
      a: "Su IBAN LU se muestra en la banca en línea o en la aplicación móvil de su banco bajo los detalles de la cuenta. La banca por internet LuxTrust de BCEE, la aplicación Hello bank! de BGL BNP Paribas y la banca en línea de ING Luxembourg muestran el IBAN de 20 caracteres. También aparece en los extractos bancarios y en sus documentos de bienvenida de la cuenta.",
    },
    {
      q: "¿Los bancos luxemburgueses ofrecen cuentas multidivisa?",
      a: "Sí. Los bancos privados y minoristas de Luxemburgo ofrecen habitualmente cuentas multidivisa en EUR, USD, GBP, CHF y otras divisas, lo que refleja el estatus del país como centro financiero internacional. Cada cuenta en divisa puede tener su propio IBAN o compartir el IBAN de la cuenta principal con un código de divisa. Confirme con su banco qué cuenta e IBAN proporcionar al remitente.",
    },
    {
      q: "¿Cuál es la conexión de Luxemburgo con TARGET2?",
      a: "Luxemburgo está conectado a TARGET2, el sistema de liquidación bruta en tiempo real del Eurosistema para pagos en euros de alto valor. La Banque centrale du Luxembourg actúa como el componente nacional. Para transferencias transfronterizas en EUR de gran valor, los pagos pueden liquidarse a través de TARGET2 el mismo día, usando su IBAN LU como identificador de cuenta.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir una transferencia desde fuera de la UE a Luxemburgo?",
      a: "Para transferencias SEPA de países de la UE y el EEE, solo se requiere el IBAN LU. Para transferencias desde fuera de SEPA — por ejemplo, desde EE. UU., Reino Unido o Suiza en divisas no SEPA — el remitente también necesita el código SWIFT/BIC de su banco. El código SWIFT de BGL BNP Paribas es BGLLLULL; el de BCEE es BCEELULL.",
    },
  ],
  "united-arab-emirates": [
    {
      q: "¿Cuál es el formato de IBAN para los Emiratos Árabes Unidos?",
      a: "Un IBAN de los EAU tiene exactamente 23 caracteres. Comienza con el código de país AE, 2 dígitos de control, un código de banco de 3 dígitos y un número de cuenta de 16 dígitos. Ejemplo: AE07 0331 2345 6789 0123 456.",
    },
    {
      q: "¿Cuándo empezaron los EAU a utilizar el IBAN?",
      a: "El Banco Central de los EAU (CBUAE) exigió el IBAN para todas las cuentas bancarias desde mayo de 2011. Desde entonces, cada cuenta bancaria de los EAU tiene un IBAN AE de 23 caracteres y es el formato requerido para todas las transferencias interbancarias domésticas a través de UAEFTS y para transferencias internacionales por cable.",
    },
    {
      q: "¿Son los EAU parte de SEPA?",
      a: "No. Los EAU no forman parte de SEPA. Todas las transferencias internacionales a cuentas bancarias de los EAU se procesan a través de la red SWIFT. Las transferencias domésticas se procesan a través del Sistema de Transferencia de Fondos de los EAU (UAEFTS), que opera 24/7.",
    },
    {
      q: "¿Cuáles son los códigos de banco para Emirates NBD, ADCB, FAB y Mashreq?",
      a: "Códigos de banco de los EAU (3 dígitos, posiciones 5–7 del IBAN): Emirates NBD es 033, Abu Dhabi Commercial Bank (ADCB) es 030, First Abu Dhabi Bank (FAB) es 035 y Mashreq es 020. Los bancos más pequeños y los bancos islámicos también tienen códigos asignados. El código de banco identifica la institución dentro del IBAN de 23 caracteres.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en los EAU?",
      a: "Su IBAN AE aparece en la aplicación móvil o la banca en línea de su banco, en los detalles de la cuenta. La aplicación Liv. de Emirates NBD, la banca móvil de ADCB, la aplicación móvil de FAB y el portal NeoBiz de Mashreq muestran el IBAN de 23 caracteres. También aparece en los extractos bancarios y en la correspondencia de su banco.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras en mi cuenta bancaria de los EAU?",
      a: "Sí. Los principales bancos de los EAU ofrecen cuentas multidivisa y cuentas de ahorro en moneda extranjera que pueden recibir USD, EUR, GBP y otras monedas principales sin conversión automática a AED. Estas cuentas generalmente tienen su propio IBAN separado o un número de cuenta designado por moneda. Consulte con su banco qué IBAN proporcionar para cada moneda.",
    },
    {
      q: "¿Qué necesito dar a un remitente para recibir dinero en los EAU?",
      a: "Para transferencias domésticas de los EAU, su IBAN AE de 23 caracteres es suficiente; no se necesita código SWIFT para UAEFTS. Para transferencias internacionales desde el extranjero, proporcione su IBAN AE completo y el código SWIFT/BIC de su banco. Por ejemplo, el código SWIFT de Emirates NBD es EBILAEAD; el de ADCB es ADCBAEAD; el de FAB es NBADAEAA.",
    },
    {
      q: "¿Cuánto tarda en recibirse una transferencia SWIFT internacional en los EAU?",
      a: "Las transferencias SWIFT internacionales a bancos de los EAU suelen tardar entre 1 y 3 días hábiles, según el país remitente, los bancos intermediarios implicados y las diferencias horarias. Las transferencias de países del CCG (Arabia Saudí, Kuwait, Qatar, Baréin, Omán) suelen llegar más rápido por las relaciones de banca corresponsal directas. El horario de corte de transferencias entrantes de su banco también afecta al procesamiento en el mismo día frente al día siguiente.",
    },
  ],
  "saudi-arabia": [
    {
      q: "¿Cuál es el formato de IBAN para Arabia Saudí?",
      a: "Un IBAN saudí tiene exactamente 24 caracteres. Comienza con SA, 2 dígitos de control, un código de banco de 2 dígitos y un número de cuenta de 18 dígitos. Ejemplo: SA03 8000 0000 6080 1016 7519.",
    },
    {
      q: "¿Cuándo adoptó Arabia Saudí el IBAN?",
      a: "SAMA (Autoridad Monetaria de Arabia Saudí, ahora el Banco Central Saudí) ordenó la adopción del IBAN en 2010. Todas las cuentas bancarias saudíes han tenido un IBAN SA de 24 caracteres desde que se completó la implantación total. El sistema SARIE de SAMA también utiliza el IBAN como identificador de cuenta estándar para las transferencias domésticas de alto valor.",
    },
    {
      q: "¿Es Arabia Saudí parte de SEPA?",
      a: "No. Arabia Saudí no es miembro de SEPA. Las transferencias internacionales a Arabia Saudí se procesan a través de la red SWIFT. SEPA es específico de los países europeos y el sistema bancario de Arabia Saudí se conecta globalmente a través de SWIFT.",
    },
    {
      q: "¿Qué códigos de banco utilizan Al Rajhi Bank, SNB, Riyad Bank y Banque Saudi Fransi?",
      a: "Códigos de banco saudíes (2 dígitos, posiciones 5–6 del IBAN): Al Rajhi Bank es 05, Saudi National Bank (SNB) es 10, Riyad Bank es 07 y Banque Saudi Fransi es 55. Arab National Bank es 30 y Saudi British Bank (SABB) es 45.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco saudí?",
      a: "Su IBAN SA está disponible en la aplicación móvil o la banca por Internet de su banco, en los detalles de la cuenta. La aplicación móvil de Al Rajhi Bank, la aplicación AlAhli Digital de SNB y Riyad Online de Riyad Bank muestran el IBAN de 24 caracteres. También aparece en los extractos bancarios. En Al Rajhi Bank, el IBAN se muestra de forma destacada en la pantalla de resumen de la cuenta.",
    },
    {
      q: "¿Qué es SARIE y cómo utiliza el IBAN?",
      a: "SARIE (Liquidación Bruta en Tiempo Real de Arabia Saudí) es el sistema de pago interbancario de alto valor del Banco Central Saudí. Procesa en tiempo real todas las transferencias domésticas en SAR de gran valor, utilizando el IBAN como identificador de cuenta. Arabia Saudí también cuenta con el sistema de Pagos Instantáneos (IP) para transferencias minoristas en tiempo real, también basado en IBAN.",
    },
    {
      q: "¿Qué necesito para recibir una transferencia internacional a Arabia Saudí?",
      a: "Proporcione su IBAN SA completo de 24 caracteres y el código SWIFT/BIC de su banco. El código SWIFT de Al Rajhi Bank es RJHISARI; el de SNB es NCBKSAJE; el de Riyad Bank es RIBLSARI; el de Banque Saudi Fransi es BSFRSARI.",
    },
    {
      q: "¿Están sujetas a declaración las grandes transferencias entrantes a Arabia Saudí?",
      a: "Sí. La normativa saudí administrada por SAMA exige a los bancos que informen de las transferencias internacionales por encima de determinados importes umbrales para el cumplimiento de las normas contra el blanqueo de capitales (AML). Además, SAMA puede exigir documentación sobre el propósito de las grandes transferencias entrantes. Si espera una transferencia de alto valor, notifíquelo a su banco con antelación y esté preparado para aportar documentación justificativa.",
    },
  ],
  qatar: [
    {
      q: "¿Cuál es el formato de IBAN para Qatar?",
      a: "Un IBAN qatarí tiene exactamente 29 caracteres. Comienza con QA, 2 dígitos de control, un código de banco alfanumérico de 4 caracteres y un número de cuenta de 21 caracteres. Ejemplo: QA58 DOHB 0000 1234 5678 90AB CDEF G.",
    },
    {
      q: "¿Es Qatar parte de SEPA?",
      a: "No. Qatar no es miembro de SEPA. Todas las transferencias internacionales a Qatar se procesan a través de la red SWIFT. Las transferencias domésticas se procesan a través del Sistema de Pagos de Qatar (QPS) y el sistema de Liquidación Bruta en Tiempo Real de Qatar (QRTGS).",
    },
    {
      q: "¿Cuáles son los códigos de banco para QNB, Commercial Bank y Doha Bank?",
      a: "Códigos de banco qataríes (4 caracteres, posiciones 5–8 del IBAN): Qatar National Bank (QNB) utiliza QNBA, Commercial Bank of Qatar utiliza CBQA, Doha Bank utiliza DOHB, Qatar Islamic Bank utiliza QIIB y Masraf Al Rayan utiliza MARK.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco qatarí?",
      a: "Su IBAN QA está disponible a través de la aplicación móvil o la banca por Internet de su banco. La aplicación de banca móvil de QNB, la aplicación CBQ Mobile de Commercial Bank y la banca móvil de Doha Bank muestran el IBAN de 29 caracteres en los detalles de la cuenta. También aparece en los extractos bancarios.",
    },
    {
      q: "¿Qué necesito dar a un remitente para recibir una transferencia a Qatar?",
      a: "Proporcione su IBAN QA completo de 29 caracteres y el código SWIFT/BIC de su banco. El código SWIFT de QNB es QNBAQAQA; el de Commercial Bank es CBQAQAQA; el de Doha Bank es DOHBQAQA. Sin ambos, es posible que el banco remitente no pueda enrutar el pago correctamente.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras en una cuenta bancaria qatarí sin conversión a QAR?",
      a: "Sí. Los principales bancos qataríes, incluidos QNB y Commercial Bank, ofrecen cuentas en moneda extranjera en USD, EUR y GBP. Si indica al remitente que envíe en una moneda extranjera específica y usted dispone de una cuenta en esa moneda, los fondos pueden abonarse sin conversión a QAR. Confirme el IBAN o número de cuenta de la cuenta en divisas con su banco.",
    },
    {
      q: "¿Cuánto tarda una transferencia internacional a Qatar?",
      a: "Las transferencias SWIFT a Qatar suelen llegar en 1–2 días hábiles. QNB, como uno de los mayores bancos de Oriente Medio y África, mantiene relaciones de corresponsalía directa con los principales bancos internacionales, lo que puede agilizar el procesamiento. Las transferencias de países del CCG (EAU, Arabia Saudí, Kuwait, Baréin) suelen liquidarse más rápido que las transferencias intercontinentales.",
    },
  ],
  kuwait: [
    {
      q: "¿Cuál es el formato de IBAN para Kuwait?",
      a: "Un IBAN kuwaití tiene exactamente 30 caracteres, uno de los más largos del mundo. Comienza con KW, 2 dígitos de control, un código de banco alfanumérico de 4 caracteres y un número de cuenta de 22 caracteres. Ejemplo: KW81 CBKU 0000 0000 0000 1234 5601 01.",
    },
    {
      q: "¿Por qué el IBAN kuwaití tiene 30 caracteres?",
      a: "El IBAN kuwaití de 30 caracteres refleja el sistema de numeración de cuentas domésticas ampliado utilizado por los bancos kuwaitíes. La porción del número de cuenta de 22 caracteres dentro del IBAN es más larga que la de la mayoría de los demás países, lo que da como resultado una longitud total del IBAN de 30 caracteres.",
    },
    {
      q: "¿Es Kuwait parte de SEPA?",
      a: "No. Kuwait no es miembro de SEPA. Todas las transferencias internacionales a Kuwait se enrutan a través de la red SWIFT. A nivel nacional, el Sistema de Liquidación Automatizada de Kuwait (KASS) procesa las transferencias interbancarias en KWD utilizando el IBAN.",
    },
    {
      q: "¿Cuáles son los códigos de banco para NBK, KFH, Gulf Bank y Burgan Bank?",
      a: "Códigos de banco kuwaitíes (4 caracteres, posiciones 5–8 del IBAN): National Bank of Kuwait (NBK) utiliza NBOK, Kuwait Finance House (KFH) utiliza KFHO, Gulf Bank utiliza GULF y Burgan Bank utiliza BURG. Commercial Bank of Kuwait utiliza COMB.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco kuwaití?",
      a: "Su IBAN KW está disponible en la aplicación móvil o el portal de banca por Internet de su banco, en los detalles de la cuenta. La banca móvil de NBK, la aplicación de KFH y la banca digital de Gulf Bank muestran el IBAN de 30 caracteres. También puede encontrarlo en su extracto bancario o llamando al servicio de atención al cliente de su banco.",
    },
    {
      q: "¿Qué necesito dar a un remitente para recibir una transferencia a Kuwait?",
      a: "Proporcione su IBAN KW completo de 30 caracteres y el código SWIFT/BIC de su banco. El código SWIFT de NBK es NBOKKWKW; el de KFH es KFHOKWKW; el de Gulf Bank es GULBKWKW. Sin el código SWIFT, los bancos internacionales no pueden enrutar el pago a la institución kuwaití correcta.",
    },
    {
      q: "¿Cuál es el tipo de cambio actual del KWD y por qué es importante para las transferencias?",
      a: "El dinar kuwaití (KWD) está vinculado a una cesta de monedas y actualmente es una de las monedas con mayor valor nominal. Al recibir una transferencia internacional, el tipo de cambio KWD aplicado por el banco o servicio remitente puede afectar significativamente al importe recibido. Compare siempre el tipo de mercado medio con el tipo ofrecido por su proveedor: el diferencial en KWD puede ser considerable para transferencias de gran valor.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Kuwait?",
      a: "Las transferencias SWIFT internacionales a Kuwait suelen tardar entre 1 y 3 días hábiles. Las transferencias de países del CCG (EAU, Arabia Saudí, Qatar, Baréin) suelen liquidarse más rápido por las relaciones bancarias directas. NBK, como uno de los bancos kuwaitíes con mayor proyección internacional, suele procesar los créditos SWIFT entrantes más rápido que las instituciones domésticas más pequeñas.",
    },
  ],
  bahrain: [
    {
      q: "¿Cuál es el formato de IBAN para Baréin?",
      a: "Un IBAN bareiní tiene exactamente 22 caracteres. Comienza con BH, 2 dígitos de control, un código de banco alfanumérico de 4 caracteres y un número de cuenta de 14 caracteres. Ejemplo: BH67 BMAG 0000 1299 1234 56.",
    },
    {
      q: "¿Es Baréin parte de SEPA?",
      a: "No. Baréin no es miembro de SEPA. Las transferencias internacionales a Baréin se procesan a través de la red SWIFT. A nivel nacional, el Sistema de Liquidación Interbancaria de Baréin (BISS) y la Cámara de Compensación Automatizada de Baréin (BACH) procesan los pagos interbancarios en BHD utilizando el IBAN.",
    },
    {
      q: "¿Cuáles son los códigos de banco para Ahli United Bank, NBB, BBK e Ithmaar Bank?",
      a: "Códigos de banco bareiníes (4 caracteres, posiciones 5–8 del IBAN): Ahli United Bank utiliza AUBB, National Bank of Bahrain (NBB) utiliza NBOB, Bank of Bahrain and Kuwait (BBK) utiliza BBKU, Ithmaar Bank utiliza ITHMB y Al Salam Bank utiliza BISLB.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco bareiní?",
      a: "Su IBAN BH está disponible en la banca en línea o la aplicación móvil de su banco, en los detalles de la cuenta. La banca en línea de Ahli United Bank, la aplicación móvil de NBB y el portal de banca electrónica de BBK muestran el IBAN de 22 caracteres. También aparece impreso en los extractos bancarios y en la correspondencia de la cuenta.",
    },
    {
      q: "¿Qué necesito para recibir una transferencia internacional a Baréin?",
      a: "Proporcione su IBAN BH completo de 22 caracteres y el código SWIFT/BIC de su banco. El código SWIFT de Ahli United Bank es AUBBBHBM; el de NBB es NBOBBHBM; el de BBK es BBKUBHBM. Sin ambos, el banco remitente puede tener dificultades para enrutar el pago correctamente.",
    },
    {
      q: "¿Está el BHD vinculado al USD y qué implica eso para las transferencias?",
      a: "Sí. El dinar bareiní (BHD) está vinculado al dólar estadounidense a un tipo fijo de 0,376 BHD por USD. Esta vinculación se ha mantenido durante décadas y hace que la conversión de USD a BHD sea totalmente predecible: 1 USD equivale siempre a aproximadamente 0,376 BHD. Si recibe una transferencia en USD, puede calcular el importe exacto en BHD antes de que lleguen los fondos.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Baréin?",
      a: "Las transferencias SWIFT a Baréin suelen tardar entre 1 y 2 días hábiles. Baréin es un centro bancario regional y los principales bancos como Ahli United Bank y NBB cuentan con sólidas redes de banca corresponsal con bancos de Oriente Medio, Europa y EE. UU. Las transferencias de países del CCG suelen liquidarse el mismo día o el siguiente día hábil.",
    },
  ],
  jordan: [
    {
      q: "¿Cuál es el formato de IBAN para Jordania?",
      a: "Un IBAN jordano tiene exactamente 30 caracteres. Comienza con JO, 2 dígitos de control, un código de banco alfanumérico de 4 caracteres, 4 dígitos de información de sucursal y un número de cuenta de 18 caracteres. Ejemplo: JO94 CBJO 0010 0000 0000 0131 0003 02.",
    },
    {
      q: "¿Es Jordania parte de SEPA?",
      a: "No. Jordania no es miembro de SEPA. Las transferencias internacionales a Jordania se procesan a través de la red SWIFT. El Banco Central de Jordania (CBJ) regula los pagos internacionales y, a nivel nacional, el Sistema de Pago Electrónico de Jordania (JoPACC) gestiona las transferencias interbancarias.",
    },
    {
      q: "¿Cuáles son los códigos de banco para Arab Bank, Housing Bank y Jordan Islamic Bank?",
      a: "Códigos de banco jordanos (4 caracteres, posiciones 5–8 del IBAN): Arab Bank utiliza ARAB, Housing Bank for Trade and Finance utiliza HBHO, Jordan Islamic Bank utiliza JIBS, Cairo Amman Bank utiliza CABJ y Bank of Jordan utiliza BOFJ.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco jordano?",
      a: "Su IBAN JO está disponible en la banca en línea o la aplicación móvil de su banco. La plataforma Arab Online de Arab Bank y la banca digital de Jordan Islamic Bank muestran el IBAN de 30 caracteres en los detalles de la cuenta. También aparece en los extractos bancarios. Puede solicitarlo en cualquier sucursal si no puede encontrarlo digitalmente.",
    },
    {
      q: "¿Qué necesito para recibir una transferencia desde el extranjero a Jordania?",
      a: "Proporcione su IBAN JO completo de 30 caracteres y el código SWIFT/BIC de su banco. El código SWIFT de Arab Bank es ARABJOAX; el de Housing Bank es HBHOJOA2; el de Jordan Islamic Bank es JIBSJOA1. La extensa red regional de Arab Bank lo hace especialmente adecuado para recibir transferencias de países del Golfo.",
    },
    {
      q: "¿Está el JOD vinculado al USD?",
      a: "Sí. El dinar jordano (JOD) está vinculado al dólar estadounidense a un tipo fijo de aproximadamente 0,709 JOD por USD. Esta vinculación está en vigor desde 1995 y aporta previsibilidad para las transferencias entrantes en USD. Si recibe una transferencia bancaria en USD, puede estimar el valor en JOD antes de que llegue.",
    },
    {
      q: "¿Cómo utilizan el IBAN los sistemas JoPACC de Jordania?",
      a: "JoPACC (Empresa de Pagos y Compensación de Jordania) opera el JRTGS (Sistema de Liquidación Bruta en Tiempo Real de Jordania) para pagos de alto valor y el JCSS (Sistema de Compensación y Liquidación de Jordania) para transferencias minoristas. Ambos sistemas utilizan el IBAN JO completo de 30 caracteres como identificador de cuenta para todas las transferencias interbancarias domésticas.",
    },
    {
      q: "¿Es fácil recibir transferencias de países del Golfo a un banco jordano?",
      a: "Sí. Jordania recibe flujos de remesas significativos de jordanos que trabajan en Arabia Saudí, los EAU y Kuwait. Arab Bank, con oficinas en todo el mundo árabe, es especialmente eficiente para recibir transferencias de los países del Consejo de Cooperación del Golfo (CCG). Algunas transferencias de bancos del Golfo pueden llegar en cuestión de horas gracias a los acuerdos bilaterales directos de banca corresponsal.",
    },
  ],
  egypt: [
    {
      q: "¿Cuál es el formato de IBAN para Egipto?",
      a: "Un IBAN egipcio tiene exactamente 29 caracteres. Comienza con EG, 2 dígitos de control, un código de banco de 4 dígitos, un código de sucursal de 4 dígitos y un número de cuenta de 17 dígitos. Ejemplo: EG38 0019 0005 0000 0000 2631 8000 2.",
    },
    {
      q: "¿Cuándo impuso Egipto la adopción del IBAN?",
      a: "El Banco Central de Egipto (CBE) exigió el IBAN para todas las cuentas bancarias como parte de sus esfuerzos por modernizar la infraestructura de pagos de Egipto y facilitar las transferencias internacionales. Todas las cuentas bancarias egipcias llevan ahora un IBAN EG de 29 caracteres y es el formato requerido para las transferencias internacionales por cable al país.",
    },
    {
      q: "¿Es Egipto parte de SEPA?",
      a: "No. Egipto no es miembro de SEPA. Las transferencias internacionales a Egipto se procesan a través de la red SWIFT. A nivel nacional, el CBE opera el EG-RTGS para la liquidación de alto valor y el ACH de Egipto para las transferencias minoristas, ambos utilizando el IBAN.",
    },
    {
      q: "¿Cuáles son los códigos de banco para National Bank of Egypt, CIB y Banque Misr?",
      a: "Códigos de banco egipcios (4 dígitos, posiciones 5–8 del IBAN): National Bank of Egypt (NBE) utiliza 0019, Banque Misr utiliza 0002, Commercial International Bank (CIB) utiliza 0010 y Banque du Caire utiliza 0027. Arab African International Bank utiliza 0057.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco egipcio?",
      a: "Su IBAN EG está disponible en la banca en línea o la aplicación móvil de su banco. La aplicación de banca móvil de CIB, el portal de banca en línea de NBE y la aplicación móvil de Banque Misr muestran el IBAN de 29 caracteres. También aparece impreso en los extractos bancarios. Puede solicitarlo en cualquier sucursal o a través de la línea de atención al cliente de su banco.",
    },
    {
      q: "¿Qué necesito para recibir una transferencia internacional a Egipto?",
      a: "Proporcione su IBAN EG completo de 29 caracteres y el código SWIFT/BIC de su banco. El código SWIFT de NBE es NBEGEGCX; el de Banque Misr es BMISEGCX; el de CIB es CIBEEGCX. El CBE puede exigir a los bancos que documenten determinadas transferencias entrantes de gran valor, por lo que su banco puede solicitar el propósito de la transferencia.",
    },
    {
      q: "¿Existen incentivos para recibir remesas en cuentas bancarias egipcias?",
      a: "Sí. El CBE ha introducido varios programas de incentivos a las remesas para atraer entradas de divisas a través de canales bancarios oficiales. En determinados periodos, estos han incluido tipos de cambio preferenciales para las transferencias recibidas en cuentas bancarias egipcias en comparación con las transferencias en efectivo. Consulte con su banco si existen programas de tasas de remesas vigentes aplicables a sus transferencias entrantes.",
    },
    {
      q: "¿Se convertirá automáticamente mi divisas extranjera entrante a EGP?",
      a: "En general, sí. Para las cuentas bancarias egipcias estándar, las transferencias entrantes en moneda extranjera se convierten a EGP al tipo de cambio publicado por el banco receptor en la fecha de liquidación. Algunos bancos ofrecen cuentas en moneda extranjera (en USD, EUR o GBP) que pueden retener la moneda original; consulte con su banco si esta opción está disponible en caso de que reciba habitualmente grandes cantidades en una moneda extranjera específica.",
    },
  ],
  israel: [
    {
      q: "¿Cuál es el formato de IBAN para Israel?",
      a: "Un IBAN israelí tiene exactamente 23 caracteres. Comienza con IL, 2 dígitos de control, un número de banco de 3 dígitos, un número de sucursal de 3 dígitos y un número de cuenta de 13 dígitos. Ejemplo: IL62 0108 0000 0009 9999 999.",
    },
    {
      q: "¿Es Israel parte de SEPA?",
      a: "No. Israel no es miembro de SEPA. Las transferencias internacionales a Israel se procesan a través de la red SWIFT. Las transferencias domésticas se procesan a través de ZAHAV (Zikui Amiti Hagvoh V'Irtzi), el sistema de liquidación bruta en tiempo real del Banco de Israel para pagos de alto valor en ILS.",
    },
    {
      q: "¿Qué números de banco utilizan Bank Leumi, Bank Hapoalim e Israel Discount Bank?",
      a: "Números de banco israelíes (3 dígitos, posiciones 5–7 del IBAN): Bank Leumi utiliza 10, Bank Hapoalim utiliza 12, Israel Discount Bank utiliza 11 y Mizrahi Tefahot Bank utiliza 20. First International Bank of Israel (FIBI) utiliza 31 y Bank Yahav utiliza 04.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en un banco israelí?",
      a: "Su IBAN IL está disponible en la banca en línea o la aplicación móvil de su banco, en los detalles de la cuenta. La LeuminSmartApp de Bank Leumi, Poalim Digital de Bank Hapoalim y la banca digital de Israel Discount Bank muestran el IBAN de 23 caracteres. También aparece en los extractos bancarios y en los documentos de bienvenida.",
    },
    {
      q: "¿Qué necesito para recibir una transferencia internacional a Israel?",
      a: "Proporcione su IBAN IL completo de 23 caracteres y el código SWIFT/BIC de su banco. El código SWIFT de Bank Leumi es LUMIILITTLV; el de Bank Hapoalim es POALILIT; el de Israel Discount Bank es DSCBILITXXX. El Banco de Israel puede exigir a los bancos que notifiquen y documenten las grandes transferencias entrantes en divisas.",
    },
    {
      q: "¿Ofrecen los bancos israelíes cuentas en moneda extranjera?",
      a: "Sí. Los principales bancos israelíes, Bank Leumi, Bank Hapoalim e Israel Discount Bank, ofrecen cuentas en moneda extranjera en USD, EUR y GBP junto a las cuentas estándar en ILS. Las cuentas en moneda extranjera tienen cada una su propio IBAN y pueden recibir transferencias internacionales sin conversión a ILS. Esto es especialmente útil para recibir salarios o pagos en USD de empleadores o clientes con sede en EE. UU.",
    },
    {
      q: "¿Existen requisitos de declaración para las grandes transferencias internacionales a Israel?",
      a: "Sí. La normativa del Banco de Israel exige que los bancos notifiquen las grandes transferencias entrantes en moneda extranjera por encima de determinados importes umbrales. Para transferencias de muy alto valor, su banco puede pedirle que aporte documentación sobre el origen de los fondos y el propósito de la transferencia. Se trata de una medida estándar de cumplimiento AML (contra el blanqueo de capitales) aplicada por todos los principales bancos israelíes.",
    },
    {
      q: "¿Pueden los miembros de la diáspora israelí en EE. UU. o Europa enviar a IBANs israelíes fácilmente?",
      a: "Sí. Todos los principales bancos israelíes mantienen sólidas relaciones de banca corresponsal con bancos de EE. UU. y Europa. Las transferencias en USD desde EE. UU. o en EUR desde Europa se procesan habitualmente con liquidación en 1–3 días hábiles. Los servicios de pago dedicados a Israel y algunos bancos israelíes también ofrecen tipos de cambio competitivos para las remesas de la diáspora.",
    },
  ],
  brazil: [
    {
      q: "¿Cuál es el formato de IBAN para Brasil?",
      a: "Un IBAN brasileño tiene exactamente 29 caracteres. Comienza con BR, 2 dígitos de control, un código de banco ISPB de 8 dígitos, un código de sucursal de 5 dígitos, un número de cuenta de 10 dígitos y 2 caracteres alfanuméricos de control. Ejemplo: BR15 0000 0000 0000 1093 2840 814 P2.",
    },
    {
      q: "¿Es Brasil parte de SEPA?",
      a: "No. Brasil no es miembro de SEPA. Las transferencias internacionales a Brasil se procesan a través de la red SWIFT. El ecosistema de pagos domésticos de Brasil incluye PIX (pagos instantáneos), TED (alto valor en tiempo real) y DOC (transferencias minoristas programadas), todos regulados por el Banco Central do Brasil (BCB).",
    },
    {
      q: "¿Cuáles son los códigos ISPB para Banco do Brasil, Itaú, Bradesco y Santander Brasil?",
      a: "Códigos ISPB de bancos brasileños (8 dígitos, posiciones 5–12 del IBAN): Banco do Brasil es 00000000, Itaú Unibanco es 60701190, Bradesco es 60746948, Santander Brasil es 90400888 y Caixa Econômica Federal es 00360305.",
    },
    {
      q: "¿Necesito mi CPF o CNPJ además de mi IBAN para recibir una transferencia internacional?",
      a: "Sí. Los bancos brasileños generalmente exigen al remitente que proporcione no solo el IBAN BR de 29 caracteres y el código SWIFT del destinatario, sino también el CPF del destinatario (Cadastro de Pessoas Físicas — número de identificación fiscal individual) o el CNPJ (para empresas), en cumplimiento de la normativa contra el blanqueo de capitales del BCB. La omisión del CPF/CNPJ puede provocar retrasos o devoluciones de la transferencia.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en Banco do Brasil, Itaú o Bradesco?",
      a: "Las aplicaciones de banca brasileñas suelen dar prioridad a las claves PIX y a los números de cuenta domésticos en lugar del IBAN. Es posible que su IBAN BR no sea visible de inmediato en la aplicación; puede que necesite contactar con el servicio de atención al cliente de su banco, visitar una sucursal o consultar la sección de transferencias internacionales del portal de banca en línea para obtener su IBAN de 29 caracteres.",
    },
    {
      q: "¿Qué es el impuesto IOF de Brasil sobre las transferencias internacionales entrantes?",
      a: "El IOF de Brasil (Imposto sobre Operações Financeiras) es un impuesto sobre operaciones financieras que puede aplicarse a las transferencias bancarias internacionales entrantes. El tipo depende del tipo de transacción: los pagos comerciales, las transferencias de capital y las remesas personales tienen tipos de IOF diferentes (algunos del 0 %). Consulte con su banco o con un asesor fiscal local para entender qué tipo de IOF corresponde a su tipo de transferencia específico.",
    },
    {
      q: "¿Puedo recibir USD o EUR sin conversión a BRL?",
      a: "En general, el CBE exige que toda la moneda extranjera entrante se convierta a BRL al tipo de cambio oficial. Brasil no permite ampliamente a los residentes mantener moneda extranjera en cuentas bancarias estándar. Algunas cuentas especializadas para empresas con actividades de exportación o determinadas cuentas de inversión pueden tener normas distintas; consulte con su banco sobre las opciones disponibles si esto le preocupa.",
    },
    {
      q: "¿Qué es PIX y se utiliza para transferencias internacionales?",
      a: "PIX es el altamente exitoso sistema de pago instantáneo doméstico de Brasil, lanzado en 2020. Utiliza el CPF, el número de teléfono o el correo electrónico como claves de pago y liquida las transacciones 24/7 en segundos. Sin embargo, PIX es estrictamente un sistema doméstico brasileño; no puede utilizarse para transferencias internacionales. Para recibir dinero del extranjero, solo son aplicables las transferencias SWIFT basadas en IBAN.",
    },
  ],
  ukraine: [
    {
      q: "¿Cuál es el formato de IBAN para Ucrania?",
      a: "Un IBAN ucraniano tiene exactamente 29 caracteres. Comienza con UA, 2 dígitos de control, un código de clasificación bancaria MFO de 6 dígitos y un número de cuenta de 19 dígitos. Ejemplo: UA21 3223 1300 0002 6007 2335 6600 1.",
    },
    {
      q: "¿Cuándo adoptó Ucrania el IBAN?",
      a: "El Banco Nacional de Ucrania (NBU) exigió la adopción del IBAN para todas las cuentas bancarias en 2019, sustituyendo el antiguo sistema de código de clasificación MFO y número de cuenta para las transferencias internacionales. La transición tenía por objeto alinear la infraestructura de pagos de Ucrania con los estándares europeos y facilitar las transferencias transfronterizas.",
    },
    {
      q: "¿Es Ucrania parte de SEPA?",
      a: "No. Ucrania no es miembro de SEPA, aunque tiene un Acuerdo de Asociación con la UE y aspira a la membresía europea. Las transferencias internacionales a Ucrania se procesan a través de la red SWIFT. A nivel nacional, la cámara de compensación SEP (Sistema de Pagos Electrónicos) del NBU procesa todas las transferencias interbancarias en UAH.",
    },
    {
      q: "¿Cuáles son los códigos MFO de PrivatBank, Oschadbank y Raiffeisen Bank Ukraine?",
      a: "Códigos MFO de bancos ucranianos (6 dígitos, posiciones 5–10 del IBAN): PrivatBank es 305299, Oschadbank (Caja de Ahorros del Estado) es 322001, Raiffeisen Bank Ukraine es 380805, PUMB (First Ukrainian International Bank) es 334851 y Ukrsibbank es 351005.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en PrivatBank u Oschadbank?",
      a: "Su IBAN UA está disponible en la aplicación móvil Privat24 de PrivatBank y en la banca por Internet; búsquelo en los detalles de la cuenta en la página de la tarjeta o cuenta. La aplicación Oschadbank24/7 y la banca por Internet de Oschadbank muestran de manera similar el IBAN de 29 caracteres. También puede visitar cualquier sucursal o contactar con el servicio de atención al cliente.",
    },
    {
      q: "¿Puedo recibir transferencias internacionales a Ucrania dado el conflicto actual?",
      a: "Sí, pero con algunas advertencias. Muchos proveedores de pago internacionales han restringido las transferencias a Ucrania desde 2022, pero los principales bancos, incluidos PrivatBank y Oschadbank, siguen procesando transferencias SWIFT entrantes. Los remitentes deben verificar que su banco o proveedor de transferencias admite Ucrania antes de iniciar el envío. Proporcione su IBAN UA completo de 29 caracteres y el código SWIFT/BIC de su banco.",
    },
    {
      q: "¿Existen restricciones de divisas para las transferencias entrantes a Ucrania?",
      a: "Sí. El NBU ha implementado controles de divisas temporales desde febrero de 2022. Las grandes transferencias entrantes en moneda extranjera pueden estar sujetas a conversión obligatoria a UAH al tipo de cambio oficial del NBU, y puede haber restricciones para retirar divisas en efectivo. El NBU actualiza periódicamente estas normativas; consulte las reglas vigentes con su banco ucraniano antes de esperar una transferencia entrante de alto valor.",
    },
    {
      q: "¿Qué código SWIFT utiliza PrivatBank para las transferencias internacionales?",
      a: "El código SWIFT de PrivatBank es PBANUA2X. El código SWIFT de Oschadbank es OSCBUAUX. Raiffeisen Bank Ukraine utiliza RAIFUA2K. Cuando facilite su IBAN a un remitente internacional, incluya siempre el código SWIFT/BIC correcto de su banco junto al IBAN UA de 29 caracteres.",
    },
  ],
  georgia: [
    {
      q: "¿Cuál es el formato de IBAN para Georgia?",
      a: "Un IBAN georgiano tiene exactamente 22 caracteres. Comienza con GE, 2 dígitos de control, un código de banco alfanumérico de 2 caracteres y un número de cuenta de 16 dígitos. Ejemplo: GE29 NB00 0000 0101 9049 17.",
    },
    {
      q: "¿Es Georgia parte de SEPA?",
      a: "No. Georgia no es miembro de SEPA. Las transferencias internacionales a Georgia se procesan a través de la red SWIFT. El Banco Nacional de Georgia (NBG) regula el sistema de pagos y el RTGS doméstico gestiona las liquidaciones interbancarias en GEL de alto valor.",
    },
    {
      q: "¿Qué códigos de banco utilizan TBC Bank y Bank of Georgia?",
      a: "Códigos de banco georgianos (2 caracteres, posiciones 5–6 del IBAN): TBC Bank utiliza TB y Bank of Georgia utiliza GG. Liberty Bank utiliza LB y ProCredit Bank Georgia utiliza PC. Estos códigos de dos caracteres identifican la institución dentro del IBAN GE de 22 caracteres.",
    },
    {
      q: "¿Cómo encuentro mi IBAN en TBC Bank o Bank of Georgia?",
      a: "Su IBAN GE está disponible en la aplicación TBC Pay de TBC Bank y en la banca por Internet de TBC, visible en la pantalla de detalles de la cuenta. La aplicación de banca móvil de Bank of Georgia (BOG) y la banca por Internet muestran de manera similar el IBAN de 22 caracteres. También aparece en los extractos bancarios y en la correspondencia de la cuenta. Ambos bancos cuentan con interfaces en inglés.",
    },
    {
      q: "¿Qué necesito para recibir una transferencia internacional a Georgia?",
      a: "Proporcione su IBAN GE completo de 22 caracteres y el código SWIFT/BIC de su banco. El código SWIFT de TBC Bank es TBCBGE22; el de Bank of Georgia es BAGAGE22. Ambos bancos tienen sólidas relaciones de corresponsalía internacional y procesan eficientemente transferencias SWIFT en USD, EUR, GBP y GEL.",
    },
    {
      q: "¿Puedo tener USD o EUR en una cuenta bancaria georgiana?",
      a: "Sí. Los bancos georgianos, TBC Bank y Bank of Georgia en particular, ofrecen cuentas multidivisa en GEL, USD, EUR y GBP como estándar. Cada posición en divisas suele tener su propio IBAN. Esto hace que Georgia sea especialmente atractiva para nómadas digitales y empresarios internacionales, ya que puede recibir transferencias en USD o EUR sin conversión a GEL.",
    },
    {
      q: "¿Cómo se adapta el sistema bancario de Georgia a los trabajadores remotos y nómadas digitales?",
      a: "Georgia se ha vuelto popular entre los trabajadores remotos gracias a su régimen fiscal simplificado (impuesto sobre la renta plano del 20%, con normas favorables de zona virtual para empresas de TI), la apertura de cuentas bancarias sin complicaciones (disponible para no residentes en la mayoría de las sucursales con pasaporte) y los servicios bancarios en inglés en TBC Bank y Bank of Georgia. Los IBAN multidivisa facilitan la recepción de salarios internacionales o pagos de clientes en EUR o USD.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Georgia?",
      a: "Las transferencias SWIFT a Georgia suelen tardar entre 1 y 3 días hábiles. TBC Bank y Bank of Georgia tienen cuentas corresponsales directas en USD en EE. UU. (a través de grandes bancos corresponsales estadounidenses) y cuentas en EUR en Europa, lo que reduce los intermediarios y acelera la liquidación. Las transferencias en USD desde EE. UU. y las transferencias en EUR desde la UE suelen llegar en 1–2 días hábiles.",
    },
  ],
  },
};
