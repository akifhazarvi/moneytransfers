import type { SwiftContent } from "./swift-content";

export const swiftContentEs: SwiftContent = {
  editorial: {
  "united-kingdom": {
    title: "Cómo funciona SWIFT en el Reino Unido",
    intro:
      "Los clientes del Reino Unido a menudo confunden los códigos SWIFT con los códigos de clasificación y los datos de Faster Payments. No son intercambiables. Las transferencias domésticas en GBP normalmente usan el código de clasificación y el número de cuenta, mientras que las transferencias internacionales entrantes utilizan el código SWIFT/BIC del banco más el identificador de cuenta requerido por dicho banco.",
    bullets: [
      "Para las transferencias domésticas en el Reino Unido, los beneficiarios generalmente necesitan un código de clasificación y un número de cuenta. Un código SWIFT se requiere principalmente cuando el emisor está fuera del Reino Unido o el pago pasa por el sistema bancario corresponsal.",
      "Los grandes bancos del Reino Unido pueden usar un solo código SWIFT para los pagos entrantes y enrutar los fondos internamente a las sucursales locales, por lo que el código de sucursal indicado en documentos antiguos no siempre es el correcto para compartir.",
      "Si la transferencia llega en GBP desde Europa o América del Norte, las comisiones intermediarias pueden aplicarse igualmente aunque el banco beneficiario esté en Londres. Confirme la moneda de recepción preferida del banco beneficiario antes de enviar.",
    ],
  },
  netherlands: {
    title: "Cómo funciona SWIFT en los Países Bajos",
    intro:
      "Los Países Bajos están dentro de la zona SEPA, por lo que muchas transferencias en euros nunca necesitan SWIFT. Los clientes bancarios holandeses generalmente necesitan el IBAN para los pagos dentro de Europa y solo necesitan un SWIFT/BIC cuando el pago proviene de fuera de SEPA o en una moneda distinta al euro.",
    bullets: [
      "Si el emisor paga desde otro país SEPA en EUR, el IBAN holandés suele ser suficiente y la transferencia puede realizarse a través de SEPA en lugar de SWIFT.",
      "SWIFT se vuelve más relevante para pagos entrantes en USD, GBP u otras monedas no EUR, donde los bancos corresponsales y las comisiones de tramitación pueden reducir el importe final recibido.",
      "Las empresas internacionales que usan cuentas holandesas deben confirmar si el banco beneficiario quiere la liquidación en EUR o en moneda extranjera, porque la conversión automática en el banco receptor puede ser costosa.",
    ],
  },
  "hong-kong": {
    title: "Cómo funciona SWIFT en Hong Kong",
    intro:
      "Hong Kong es un importante centro bancario transfronterizo, por lo que SWIFT es mucho más central aquí que en los mercados minoristas exclusivamente domésticos. Las empresas y los expatriados a menudo reciben pagos en USD, EUR, GBP y CNY en cuentas de Hong Kong, lo que significa que el enrutamiento a través de bancos corresponsales y las decisiones sobre la moneda de liquidación son importantes.",
    bullets: [
      "Una cuenta bancaria de Hong Kong puede admitir múltiples monedas, pero el banco beneficiario puede aplicar diferentes comisiones de remesa entrante o márgenes de conversión según la moneda recibida.",
      "Si el emisor puede elegir entre la liquidación en USD o HKD, vale la pena confirmar cuál deja al beneficiario con el mejor resultado neto después de comisiones y conversión de divisas.",
      "Para los pagos relacionados con China continental, no asuma que una ruta SWIFT de Hong Kong se comporta como una transferencia doméstica en CNY. Los controles de cumplimiento, los estándares de nomenclatura de beneficiarios y los tiempos de liquidación pueden diferir significativamente.",
    ],
  },
  "united-states": {
    title: "Cómo funciona SWIFT en los Estados Unidos",
    intro:
      "El sistema bancario estadounidense usa números de enrutamiento ABA y Fedwire para las transferencias domésticas, que están completamente separados de la red SWIFT. Al enviar dinero internacionalmente a una cuenta bancaria en EE. UU., necesita el código SWIFT/BIC del banco receptor, no el número de enrutamiento ABA de nueve dígitos utilizado para transferencias domésticas ACH y wire. Muchos bancos estadounidenses tienen códigos SWIFT diferentes para sus departamentos de transferencias internacionales que para sus sucursales minoristas.",
    bullets: [
      "Los bancos estadounidenses suelen enrutar las transferencias internacionales entrantes a través de una pasarela SWIFT central, normalmente en su departamento corresponsal de Nueva York. El código SWIFT que necesita puede diferir de la sucursal donde se encuentra la cuenta, así que confirme siempre con el banco del beneficiario.",
      "Para los pagos denominados en USD que llegan del extranjero, el banco receptor puede cobrar una comisión de transferencia entrante (normalmente entre 15 y 25 USD) aunque el emisor haya pagado todos los cargos de salida. Pida al beneficiario que consulte el calendario de comisiones de su banco para las transferencias internacionales entrantes.",
      "Si está enviando a una cuenta estadounidense en una moneda distinta al USD, el banco beneficiario la convertirá a su propio tipo de cambio, que generalmente es desfavorable. Enviar en USD y dejar que el banco de origen gestione la conversión suele producir un mejor resultado.",
    ],
  },
  india: {
    title: "Cómo funciona SWIFT en India",
    intro:
      "India usa el IFSC (Código del Sistema Financiero Indio) para las transferencias bancarias domésticas a través de NEFT, RTGS e IMPS, pero estos códigos no funcionan para los pagos internacionales. Las transferencias internacionales entrantes requieren el código SWIFT/BIC del banco receptor, y todas estas transacciones están sujetas a los requisitos de cumplimiento del Banco de la Reserva de la India (RBI), incluidas las declaraciones de finalidad del pago.",
    bullets: [
      "Cada sucursal bancaria india tiene tanto un código IFSC (para transferencias domésticas) como puede estar cubierta por un código SWIFT (para transferencias internacionales). El código SWIFT suele apuntar al centro de procesamiento central del banco en lugar de a la sucursal local, así que confirme el correcto con el beneficiario.",
      "Las regulaciones del RBI exigen que se declare la finalidad de cada remesa extranjera entrante. Los códigos de finalidad comunes incluyen mantenimiento familiar, gastos de educación y pagos comerciales. Los códigos de finalidad incorrectos pueden retrasar o bloquear el crédito en la cuenta del beneficiario.",
      "Para remesas grandes a India, las comisiones de bancos intermediarios pueden reducir el importe final en INR. Enviar a través de proveedores que utilizan corredores de pago dedicados en INR en lugar de enrutamiento SWIFT de múltiples saltos suele resultar en una liquidación más rápida y un coste total más bajo.",
    ],
  },
  pakistan: {
    title: "Cómo funciona SWIFT en Pakistán",
    intro:
      "El sistema bancario de Pakistán está regulado por el Banco Estatal de Pakistán (SBP), y todas las transferencias internacionales entrantes deben cumplir con las regulaciones de divisas del SBP. SWIFT es el canal principal para recibir transferencias bancarias internacionales, con los principales bancos como HBL, UBL, MCB y Allied Bank todos conectados a la red SWIFT. La liquidación en PKR se maneja localmente después de que los fondos lleguen en moneda extranjera.",
    bullets: [
      "Los principales bancos de Pakistán — Habib Bank (HBL), United Bank (UBL), MCB Bank y Allied Bank — tienen cada uno múltiples códigos SWIFT que cubren las oficinas centrales y las sucursales clave. Siempre use el código SWIFT que corresponde a la sucursal específica o centro de procesamiento donde se encuentra la cuenta del beneficiario.",
      "Las remesas entrantes a Pakistán están exentas de retención fiscal bajo los planes de incentivos del SBP, pero el banco receptor aún puede deducir un cargo por servicio. El beneficiario debe confirmar la comisión de remesa entrante de su banco antes de que usted envíe, especialmente para cantidades pequeñas donde las comisiones fijas tienen mayor impacto.",
      "El SBP requiere que la moneda extranjera recibida a través de SWIFT se convierta a PKR al tipo vigente del banco en el día del crédito. El beneficiario no puede mantener los fondos en moneda extranjera en una cuenta PKR estándar. Para obtener mejores tipos en la conversión, compare el tipo publicado del banco receptor con el tipo interbancario.",
    ],
  },
  germany: {
    title: "Cómo funciona SWIFT en Alemania",
    intro:
      "Alemania forma parte de la zona SEPA, por lo que las transferencias denominadas en euros procedentes de otros países SEPA normalmente utilizan solo el IBAN y viajan a través de la Transferencia de Crédito SEPA en lugar de SWIFT. SWIFT se vuelve relevante cuando el pago se origina fuera de SEPA o involucra una moneda que no es EUR. Deutsche Bank, Commerzbank y la red Sparkassen se encuentran entre los participantes SWIFT más utilizados para transferencias internacionales entrantes.",
    bullets: [
      "Para pagos en EUR desde dentro de SEPA (UE, EEE, Suiza, Reino Unido para algunos esquemas), generalmente solo necesita el IBAN alemán. El código BIC/SWIFT es opcional para las transferencias SEPA y la mayoría de los bancos enrutarán el pago correctamente solo con el IBAN.",
      "Las transferencias entrantes no denominadas en EUR (como USD o GBP) a una cuenta bancaria alemana viajarán a través de SWIFT y pueden implicar cargos del banco corresponsal que reduzcan el importe recibido. Si el beneficiario tiene una cuenta multicurrencia, enviar en la moneda original evita una conversión automática al tipo del banco receptor.",
      "Las Sparkassen (cajas de ahorro) y Volksbanken (bancos cooperativos) alemanes tienen cada una sus propios códigos SWIFT distintos de los grandes bancos comerciales. No asuma que un código SWIFT genérico de Deutsche Bank funcionará para una cuenta Sparkasse: cada institución requiere su propio BIC.",
    ],
  },
  france: {
    title: "Cómo funciona SWIFT en Francia",
    intro:
      "Francia es miembro principal de SEPA, por lo que la mayoría de las transferencias en EUR desde otros países europeos no requieren un código SWIFT en absoluto: el IBAN francés es suficiente. Los códigos SWIFT (también llamados BIC en Francia) se vuelven necesarios cuando el emisor está fuera de la zona SEPA o cuando la transferencia es en una moneda que no es EUR. Los bancos franceses utilizan habitualmente códigos BIC8, con el BIC11 completo necesario únicamente para identificar una sucursal específica.",
    bullets: [
      "Para los pagos entrantes en EUR de países SEPA, basta con proporcionar el IBAN francés. Los bancos franceses, incluidos BNP Paribas, Crédit Agricole y Société Générale, los procesarán sin BIC. Para los emisores no pertenecientes a SEPA, el código BIC8 (ocho caracteres) suele ser suficiente ya que los bancos franceses enrutan internamente.",
      "Si está enviando una moneda que no es EUR (como USD o GBP) a una cuenta bancaria francesa, el pago irá a través de SWIFT y el banco receptor convertirá a EUR a su propio tipo. Esta conversión suele ser costosa: considere convertir a EUR en el lado del emisor si su proveedor ofrece un tipo de cambio mejor.",
      "Algunos bancos franceses cobran una comisión de entrada por las transferencias SWIFT que no llegan a través de SEPA. Esta comisión (a menudo llamada frais de réception de virement international) puede oscilar entre 10 y 30 EUR. El beneficiario debe consultar el calendario de tarifas de su banco para evitar sorpresas.",
    ],
  },
  "united-arab-emirates": {
    title: "Cómo funciona SWIFT en los Emiratos Árabes Unidos",
    intro:
      "Los EAU son un importante centro bancario internacional, y sus bancos están fuertemente conectados a la red SWIFT tanto para transferencias personales como comerciales. El AED está vinculado al USD a un tipo fijo, lo que simplifica las consideraciones de divisas para las transferencias denominadas en USD. Los bancos en los EAU ofrecen habitualmente cuentas multicurrencia, y muchos operan tanto en jurisdicciones de la zona franca como en las del continente.",
    bullets: [
      "Los bancos de los EAU como Emirates NBD, ADCB, FAB y Mashreq tienen cada uno códigos SWIFT distintos. Las sucursales de zonas francas (como las del DIFC o ADGM) pueden usar códigos SWIFT diferentes a los de las sucursales continentales del banco, así que confirme siempre el código exacto con el beneficiario.",
      "Dado que el AED está vinculado al USD a aproximadamente 3,6725, el envío de USD a una cuenta bancaria de los EAU resulta en una conversión predecible. Sin embargo, algunos bancos aún cobran un diferencial en la conversión USD/AED. Para transferencias grandes, puede valer la pena preguntar al beneficiario si su banco puede recibir y mantener USD directamente.",
      "Las transferencias SWIFT entrantes a bancos de los EAU se liquidan normalmente en un día hábil para las principales monedas. El Banco Central de los EAU exige documentación de cumplimiento para las transferencias por encima de ciertos límites, lo que puede retrasar el crédito en la cuenta del beneficiario si el equipo de cumplimiento del banco receptor solicita información adicional.",
    ],
  },
  canada: {
    title: "Cómo funciona SWIFT en Canadá",
    intro:
      "El sistema bancario doméstico de Canadá usa números de tránsito (cinco dígitos) combinados con números de institución (tres dígitos) para las transferencias locales a través de las redes de Interac y Payments Canada. Estos identificadores domésticos no funcionan para las transferencias internacionales. Las transferencias internacionales entrantes requieren el código SWIFT/BIC del banco del beneficiario, y los cinco grandes bancos (RBC, TD, Scotiabank, BMO, CIBC) gestionan la gran mayoría del tráfico SWIFT.",
    bullets: [
      "Los números de tránsito e institución canadienses son solo para uso doméstico. Al enviar internacionalmente a Canadá, necesita el código SWIFT/BIC del banco del beneficiario. La mayoría de los bancos canadienses enrutan todas las transferencias SWIFT entrantes a través de un centro de procesamiento central, por lo que el número de tránsito de la sucursal se proporciona por separado como parte de los datos del beneficiario.",
      "Los cinco grandes bancos canadienses tienen cada uno un código SWIFT principal para las transferencias internacionales, pero también pueden tener códigos secundarios para divisiones específicas (como gestión de patrimonio o banca comercial). Confirme con el beneficiario qué código SWIFT requiere su tipo de cuenta específico.",
      "Para las transferencias entrantes denominadas en CAD, el banco canadiense receptor acreditará la cuenta en CAD. Si envía en una moneda extranjera como USD o EUR, el banco convertirá al tipo publicado, que normalmente incluye un margen del 1-3% sobre el tipo interbancario. Enviar en CAD desde su extremo suele resultar en un coste total mejor.",
    ],
  },
  australia: {
    title: "Cómo funciona SWIFT en Australia",
    intro:
      "Australia usa códigos BSB (Bank-State-Branch) para las transferencias domésticas, pero estos códigos de seis dígitos no están reconocidos internacionalmente. Las transferencias internacionales entrantes requieren el código SWIFT/BIC del banco receptor. Los cuatro grandes bancos australianos — Commonwealth Bank, Westpac, ANZ y NAB — procesan la mayoría de los pagos SWIFT entrantes, y cada uno tiene una pasarela SWIFT central para las transferencias internacionales.",
    bullets: [
      "El BSB y el número de cuenta del beneficiario son necesarios junto con el código SWIFT para las transferencias internacionales entrantes a Australia. El código SWIFT enruta el pago al banco correcto, mientras que el BSB y el número de cuenta garantizan que llegue a la sucursal y cuenta correctas. Ambos son necesarios: proporcionar solo el código SWIFT no es suficiente.",
      "PayID y NPP (New Payments Platform) son sistemas exclusivamente domésticos y no pueden recibir transferencias SWIFT internacionales. Si el beneficiario solo proporciona un PayID (número de teléfono o correo electrónico), aún necesitará su BSB, número de cuenta y código SWIFT bancario para una transferencia internacional.",
      "Los bancos australianos suelen cobrar una comisión de pago internacional entrante de entre AUD 10 y 20 por las transferencias SWIFT. Algunos bancos la eximen para los titulares de cuentas premium o internacionales. Si envía en una moneda distinta al AUD, se aplicará el tipo de conversión del banco receptor, que generalmente es menos favorable que convertir en el lado del emisor.",
    ],
  },
  singapore: {
    title: "Cómo funciona SWIFT en Singapur",
    intro:
      "Singapur es uno de los centros financieros más importantes de Asia, y sus bancos están profundamente integrados en la red SWIFT. DBS, OCBC y UOB son los tres principales bancos locales, todos con una amplia conectividad SWIFT para múltiples monedas. La Autoridad Monetaria de Singapur (MAS) mantiene un entorno bancario bien regulado, y las transferencias internacionales entrantes generalmente se liquidan de forma rápida y fiable.",
    bullets: [
      "DBS, OCBC y UOB tienen cada uno códigos SWIFT principales para las transferencias internacionales, pero pueden usar códigos diferentes para divisiones específicas como la banca privada o las cuentas corporativas. El beneficiario debe proporcionar el código SWIFT exacto asociado a su tipo de cuenta en lugar de un código genérico encontrado en línea.",
      "Las cuentas bancarias de Singapur frecuentemente admiten múltiples monedas (SGD, USD, EUR, GBP y otras) dentro de una misma estructura de cuenta. Al enviar a Singapur, confirme con el beneficiario en qué moneda debe recibir su cuenta: enviar en la moneda incorrecta puede desencadenar una conversión automática al tipo menos favorable del banco.",
      "Las regulaciones de la MAS requieren que los bancos de Singapur realicen una diligencia debida mejorada en ciertas transferencias entrantes. Los pagos por encima de umbrales específicos o de ciertas jurisdicciones pueden quedar retenidos para revisión de cumplimiento, lo que puede añadir uno o dos días hábiles al tiempo de liquidación. Proporcionar una referencia de pago clara y su finalidad ayuda a evitar retrasos.",
    ],
  },
  "south-africa": {
    title: "Cómo funciona SWIFT en Sudáfrica",
    intro:
      "El sistema bancario de Sudáfrica está regulado por el Banco de la Reserva de Sudáfrica (SARB), que impone controles de cambio sobre los pagos transfronterizos tanto entrantes como salientes. Los cuatro grandes bancos — Standard Bank, FirstRand (FNB), Absa y Nedbank — gestionan la mayor parte del tráfico SWIFT internacional. Todas las transferencias de divisas extranjeras entrantes están sujetas a los requisitos de notificación del SARB, y es posible que el beneficiario deba presentar documentación de respaldo antes de que se liberen los fondos.",
    bullets: [
      "Los controles de cambio del SARB requieren que se declare la finalidad de cada pago internacional entrante. El banco del beneficiario solicitará documentación como una factura, un contrato de trabajo o una declaración de donación antes de acreditar moneda extranjera en una cuenta en ZAR. Los retrasos en la presentación de estos documentos retendrán los fondos.",
      "Los bancos sudafricanos convierten las divisas extranjeras entrantes a ZAR a su propio tipo de cambio, que generalmente incluye un diferencial sobre el tipo de mercado. Para transferencias grandes, el beneficiario puede a veces negociar un tipo mejor con el departamento de divisas de su banco, especialmente en Standard Bank o FNB que tienen operaciones de tesorería dedicadas.",
      "Cada uno de los cuatro grandes bancos tiene un código SWIFT principal, pero los códigos a nivel de sucursal se usan con menos frecuencia. La mayoría de las transferencias internacionales se enrutan a través de la pasarela SWIFT de la oficina central del banco en Johannesburgo. Proporcione el código de sucursal del beneficiario y el número de cuenta como datos complementarios junto con el código SWIFT principal.",
    ],
  },
  ireland: {
    title: "Cómo funciona SWIFT en Irlanda",
    intro:
      "Irlanda es miembro de SEPA, por lo que las transferencias en EUR de otros países SEPA se pueden enviar usando únicamente el IBAN irlandés sin necesidad de un código SWIFT. Los códigos SWIFT/BIC son necesarios principalmente cuando el emisor está fuera de SEPA o cuando el pago es en una moneda distinta al EUR. Los principales bancos minoristas en Irlanda — AIB, Bank of Ireland y Permanent TSB — participan todos en la red SWIFT para pagos internacionales.",
    bullets: [
      "Para las transferencias en EUR desde dentro de la zona SEPA, el IBAN irlandés del beneficiario (que comienza con IE) es suficiente. Las transferencias SEPA suelen ser gratuitas o de muy bajo coste y se liquidan en un día hábil. No es necesario proporcionar un código SWIFT/BIC para estos pagos.",
      "Si envía desde fuera de SEPA (como EE. UU., Canadá o Australia) o en una moneda distinta al EUR, necesitará el código SWIFT del banco receptor. AIB, Bank of Ireland y PTSB tienen cada uno sus propios códigos BIC, y usar el incorrecto causará retrasos o pagos fallidos.",
      "El panorama bancario de Irlanda se ha consolidado en los últimos años, con la salida del mercado de Ulster Bank y KBC. Los beneficiarios que anteriormente tenían cuentas en estos bancos han migrado a AIB, Bank of Ireland o PTSB. Asegúrese de que el beneficiario proporcione sus datos bancarios actuales, ya que los códigos SWIFT antiguos de bancos cerrados ya no funcionarán.",
    ],
  },
  "new-zealand": {
    title: "Cómo funciona SWIFT en Nueva Zelanda",
    intro:
      "El sistema bancario doméstico de Nueva Zelanda usa un formato de número de banco-sucursal-cuenta-sufijo para las transferencias locales, pero estos identificadores no son suficientes para los pagos internacionales. Las transferencias internacionales entrantes requieren el código SWIFT/BIC del banco receptor. ANZ, ASB, BNZ, Westpac y Kiwibank son los principales bancos que procesan pagos SWIFT internacionales en Nueva Zelanda.",
    bullets: [
      "A diferencia del sistema BSB de Australia, Nueva Zelanda usa un número de banco combinado (dos dígitos), número de sucursal (cuatro dígitos), número de cuenta (siete dígitos) y sufijo (dos a tres dígitos). Al enviar internacionalmente, necesita tanto el código SWIFT como el número de cuenta completo de Nueva Zelanda. Algunos emisores omiten por error el sufijo, lo que puede hacer que el pago sea rechazado.",
      "Los bancos de Nueva Zelanda suelen cobrar una comisión de transferencia internacional entrante de entre NZD 10 y 15 por pago SWIFT. Si la transferencia llega en una moneda extranjera, el banco convertirá a NZD al tipo publicado, que generalmente incluye un margen del 1-2%. Para importes superiores a NZD 10.000, el beneficiario puede a veces solicitar un tipo mejor al departamento de operaciones del banco.",
      "Los tiempos de liquidación para las transferencias SWIFT entrantes a Nueva Zelanda son generalmente de uno a dos días hábiles desde el momento en que los fondos salen del banco emisor. Nueva Zelanda se encuentra en una zona horaria muy por delante de la mayoría de los principales centros financieros, lo que puede añadir un retraso percibido cuando el pago se envía tarde en el día desde Europa o América del Norte.",
    ],
  },
  bangladesh: {
    title: "Cómo funciona SWIFT en Bangladés",
    intro:
      "Bangladesh Bank, el banco central del país, regula todas las transferencias internacionales entrantes y salientes. SWIFT es el canal principal para recibir remesas, que son un componente crítico de la economía de Bangladés. Las transferencias domésticas utilizan la Red de Transferencia Electrónica de Fondos de Bangladés (BEFTN) y el sistema RTGS, que son completamente independientes del enrutamiento SWIFT internacional.",
    bullets: [
      "Los principales bancos bangladesíes en la red SWIFT incluyen Sonali Bank (el mayor banco estatal), Islami Bank Bangladesh, BRAC Bank, Dutch-Bangla Bank y Eastern Bank. Cada uno tiene su propio código BIC: confirme siempre el código correcto con la sucursal del beneficiario, ya que algunos bancos usan diferentes códigos SWIFT para la oficina central frente a los centros regionales.",
      "Las regulaciones del Bangladesh Bank requieren que se notifiquen todas las remesas extranjeras entrantes. El banco receptor convertirá la moneda extranjera a BDT al tipo de cambio vigente en el día del crédito. Los beneficiarios no pueden mantener moneda extranjera en una cuenta BDT estándar a menos que mantengan una cuenta de Moneda Extranjera designada.",
      "Las remesas de los bangladesíes en el extranjero son una de las mayores fuentes de divisas del país. Bangladesh Bank ofrece periódicamente pagos de incentivos (bonificaciones en efectivo) sobre las remesas entrantes enviadas a través de canales bancarios oficiales, lo que hace más atractivo usar los servicios de transferencia vinculados a SWIFT o bancos que las rutas hawala informales.",
    ],
  },
  philippines: {
    title: "Cómo funciona SWIFT en Filipinas",
    intro:
      "El Bangko Sentral ng Pilipinas (BSP) regula todas las transferencias internacionales hacia y desde Filipinas. SWIFT es el canal estándar para las transferencias bancarias internacionales en moneda extranjera, mientras que las transferencias domésticas en pesos utilizan los sistemas InstaPay y PESONet operados por PhilPaSS. Filipinas es uno de los países del mundo que más remesas recibe, y prácticamente todos los principales bancos están conectados a la red SWIFT.",
    bullets: [
      "Los cuatro mayores bancos receptores de transferencias internacionales son BDO Unibank (ABORPH2X), Bank of the Philippine Islands (BABORPHMXXX), Metropolitan Bank and Trust Company (MABORPMM) y Land Bank of the Philippines (TLBPPHMM). Estos códigos SWIFT enrutan a la mesa de operaciones internacionales central de cada banco, no a las sucursales individuales.",
      "Las regulaciones del BSP exigen que el nombre del emisor y la finalidad de la transferencia se declaren para las transferencias entrantes por encima de USD 10.000. El banco receptor puede solicitar documentación de respaldo antes de acreditar los fondos, especialmente para transferencias relacionadas con negocios o inversiones. Las remesas personales por debajo del umbral generalmente se acreditan el mismo día o el siguiente día hábil.",
      "El peso filipino (PHP) no es libremente convertible. La moneda extranjera entrante se convierte automáticamente a PHP al tipo de compra del banco en la fecha de liquidación. Los emisores que quieren que el beneficiario reciba USD pueden indicar al beneficiario que abra una cuenta de depósito en moneda extranjera (FCDU), que ofrecen la mayoría de los principales bancos filipinos.",
    ],
  },
  nigeria: {
    title: "Cómo funciona SWIFT en Nigeria",
    intro:
      "El Banco Central de Nigeria (CBN) regula todos los pagos transfronterizos, y SWIFT es la columna vertebral de la conectividad bancaria internacional de Nigeria. Las transferencias domésticas en naira utilizan el Sistema de Liquidación Interbancaria de Nigeria (NIBSS), que opera de forma independiente a SWIFT. La gran diáspora nigeriana hace que las remesas entrantes sean uno de los corredores de mayor volumen en el África subsahariana.",
    bullets: [
      "Los cinco mayores bancos de Nigeria — Access Bank, Guaranty Trust Bank (GTBank), Zenith Bank, First Bank of Nigeria y United Bank for Africa (UBA) — tienen todos códigos SWIFT y procesan la mayoría de las transferencias internacionales entrantes. UBA tiene una presencia particularmente amplia en las redes bancarias corresponsales africanas, lo que la hace útil para las transferencias intra-africanas.",
      "Las regulaciones de divisas del CBN requieren que las transferencias en USD entrantes se acrediten en una cuenta de divisas (cuenta en moneda extranjera) o se conviertan a naira al tipo oficial. Mantener USD en una cuenta de divisas está permitido para personas físicas y empresas. El tipo oficial frente al tipo del mercado paralelo puede diferir significativamente, por lo que los beneficiarios deben confirmar con su banco qué tipo se aplica.",
      "Las transferencias SWIFT a Nigeria suelen tardar entre uno y tres días hábiles. Los requisitos de cumplimiento del CBN implican que las transferencias grandes pueden quedar retenidas para revisión, especialmente para pagos comerciales. Proporcionar una finalidad de pago clara y que el nombre del beneficiario coincida exactamente con el registrado en el banco puede evitar retrasos.",
    ],
  },
  mexico: {
    title: "Cómo funciona SWIFT en México",
    intro:
      "El Banco de México (Banxico) regula los pagos internacionales, y México utiliza un identificador de cuenta doméstico único llamado CLABE (Clave Bancaria Estandarizada), un número de 18 dígitos que codifica el banco, la ciudad y la cuenta. Para las transferencias internacionales entrantes, el emisor necesita el código SWIFT/BIC del banco del beneficiario así como el número CLABE. Las transferencias domésticas operan a través del sistema de liquidación en tiempo real SPEI (Sistema de Pagos Electrónicos Interbancarios).",
    bullets: [
      "Los mayores bancos de México — BBVA México, Banorte, Santander México y Citibanamex — tienen cada uno códigos SWIFT que enrutan las transferencias entrantes a sus centros de operaciones internacionales. Proporcione siempre la CLABE de 18 dígitos junto con el código SWIFT, ya que los bancos mexicanos la requieren para acreditar la cuenta correcta. Un número de cuenta estándar por sí solo es insuficiente.",
      "Los bancos mexicanos están obligados a cumplir con las regulaciones contra el lavado de dinero de México y pueden solicitar documentación para transferencias entrantes de gran importe. Las transferencias desde los Estados Unidos son especialmente comunes, y muchos corredores de EE. UU. a México ahora ofrecen servicios de depósito en cuenta bancaria que omiten el enrutamiento SWIFT tradicional para comisiones más bajas y una liquidación más rápida.",
      "El peso mexicano (MXN) se negocia libremente, y las transferencias entrantes en USD se convierten normalmente a MXN al tipo de cambio del banco en el día del crédito. Algunos bancos mexicanos ofrecen la opción de recibir y mantener USD en una cuenta denominada en dólares (cuenta en dólares), lo que puede ser útil para las empresas que realizan transacciones regularmente en USD.",
    ],
  },
  china: {
    title: "Cómo funciona SWIFT en China",
    intro:
      "El Banco Popular de China (PBOC) regula todos los pagos internacionales, y China mantiene estrictos controles de capital sobre los flujos transfronterizos de dinero. SWIFT se usa para las transferencias bancarias internacionales hacia y desde China, mientras que las transferencias domésticas usan el Sistema Nacional de Pagos Avanzados de China (CNAPS) y el CIPS (Sistema de Pagos Interbancario Transfronterizo). Las transferencias de moneda extranjera a China están sujetas a los requisitos de notificación de la Administración Estatal de Divisas (SAFE).",
    bullets: [
      "Los cuatro mayores bancos estatales de China — Banco Industrial y Comercial de China (ICBC), Banco de China (BOC), Banco de Construcción de China (CCB) y Banco Agrícola de China (ABC) — dominan el tráfico SWIFT internacional. El Banco de China, en particular, tiene la red corresponsal internacional más extensa y se usa habitualmente para transacciones transfronterizas.",
      "Las transferencias de moneda extranjera entrantes a China deben ir acompañadas de una declaración de finalidad. Las regulaciones de la SAFE limitan las conversiones individuales anuales de moneda extranjera a CNY al equivalente de USD 50.000. Las transferencias por encima de esta cantidad, o las destinadas a fines comerciales, requieren documentación y pueden ser revisadas por el equipo de cumplimiento del banco receptor.",
      "China también opera el CIPS (Sistema de Pagos Interbancario Transfronterizo) como alternativa a SWIFT para las transferencias internacionales denominadas en CNY. Algunos bancos y corredores pueden liquidar pagos en CNY a través de CIPS más rápido que a través de la red SWIFT tradicional. Para las remesas en CNY, pregunte a su proveedor si liquida a través de SWIFT o CIPS, ya que el coste y la velocidad pueden diferir.",
    ],
  },
  japan: {
    title: "Cómo funciona SWIFT en Japón",
    intro:
      "El Banco de Japón (BOJ) supervisa el sistema financiero, y las transferencias domésticas de Japón utilizan el Sistema Zengin (全銀システム) para las liquidaciones en yenes en tiempo real entre los bancos japoneses. Para las transferencias bancarias internacionales, se requieren códigos SWIFT. Los tres principales grupos bancarios de Japón — MUFG, SMBC Group y Mizuho — gestionan la gran mayoría de los pagos internacionales entrantes y salientes.",
    bullets: [
      "Los tres códigos SWIFT de los megabancos más utilizados para las transferencias entrantes son MUFG Bank (BOTKJPJT), Sumitomo Mitsui Banking Corporation (SMBCJPJT) y Mizuho Bank (MHCBJPJT). Estos códigos enrutan al centro de operaciones internacionales de Tokio de cada banco. Los bancos regionales como Resona, Fukuoka Bank y Shizuoka Bank también tienen sus propios códigos SWIFT para las transferencias internacionales.",
      "Los bancos japoneses requieren tanto un código SWIFT como el código de sucursal del beneficiario (店番号) más el número de cuenta para una transferencia internacional. Al proporcionar los datos del beneficiario, incluya el nombre y el número de la sucursal además del número de cuenta, ya que la red Zengin los utiliza internamente para enrutar los fondos a la sucursal correcta tras la llegada del pago SWIFT.",
      "Las transferencias internacionales entrantes a Japón se convierten normalmente a JPY al tipo de compra telegráfico del banco en la fecha de liquidación. Bancos como MUFG y SMBC cobran una comisión estándar de transferencia entrante de aproximadamente entre JPY 2.500 y 4.000. Los proveedores que utilizan redes de pago locales en JPY pueden a menudo entregar los fondos de forma más económica que una transferencia SWIFT de banco a banco.",
    ],
  },
  "south-korea": {
    title: "Cómo funciona SWIFT en Corea del Sur",
    intro:
      "El Banco de Corea (BOK) regula la política monetaria, mientras que la Comisión de Servicios Financieros (FSC) supervisa el cumplimiento bancario. Las transferencias domésticas en won coreano utilizan la red del Instituto de Telecomunicaciones y Compensaciones Financieras de Corea (KFTC). Las transferencias internacionales requieren códigos SWIFT. Los principales bancos de Corea del Sur — KB Kookmin, Shinhan, Hana y Woori — tienen todos una amplia conectividad SWIFT para las remesas entrantes.",
    bullets: [
      "Los cuatro mayores bancos comerciales coreanos utilizados para las transferencias internacionales entrantes son KB Kookmin Bank, Shinhan Bank, KEB Hana Bank y Woori Bank. Cada uno tiene un código SWIFT dedicado para las operaciones internacionales. El Industrial Bank of Korea (IBK) y el Korea Development Bank (KDB) también se usan habitualmente para los pagos relacionados con negocios.",
      "Las regulaciones financieras coreanas exigen que las transferencias de moneda extranjera entrantes por encima de USD 10.000 se notifiquen al Servicio de Aduanas de Corea (KCS) como parte de la Ley de Transacciones de Divisas. El banco del beneficiario gestionará la notificación, pero las transferencias personales de gran importe pueden requerir una declaración de origen de fondos. Las transferencias comerciales necesitan documentación de respaldo como facturas o contratos.",
      "El won coreano (KRW) no es libremente convertible fuera de Corea. Las transferencias de moneda extranjera entrantes se convierten normalmente a KRW al tipo de cambio del banco en la fecha del crédito. Algunos bancos coreanos ofrecen cuentas de moneda extranjera (FCA) que permiten a los beneficiarios mantener USD, EUR o JPY antes de convertir, lo que puede ser útil si se espera un tipo de cambio más favorable en KRW.",
    ],
  },
  thailand: {
    title: "Cómo funciona SWIFT en Tailandia",
    intro:
      "El Banco de Tailandia (BOT) regula los pagos internacionales y las divisas. Las transferencias domésticas en baht utilizan el sistema PromptPay — una red de pago en tiempo real vinculada a números de identificación nacional y números de teléfono — pero PromptPay no puede recibir pagos SWIFT internacionales. Para las transferencias internacionales entrantes, los principales bancos de Tailandia requieren que el emisor proporcione un código SWIFT/BIC además del número de cuenta bancaria tailandesa del beneficiario.",
    bullets: [
      "Los cuatro mayores bancos de Tailandia por volumen SWIFT son Bangkok Bank (BKKBTHBK), Kasikornbank (KASITHBK), Siam Commercial Bank (SICOTHBK) y Bank of Ayudhya/Krungsri (AYUDTHBK). Bangkok Bank tiene la red corresponsal más amplia y es especialmente popular para las transferencias entrantes en USD desde los Estados Unidos.",
      "Las regulaciones del Banco de Tailandia requieren que las transferencias extranjeras entrantes por encima del equivalente a THB 50.000 se notifiquen a través del Formulario de Transacción de Divisas (FET). El banco del beneficiario gestiona esta notificación, pero el emisor debe proporcionar una referencia de finalidad de pago clara para evitar retrasos de cumplimiento. El tratamiento médico, la educación, el turismo y la remesa familiar son finalidades aceptadas habituales.",
      "El baht tailandés (THB) es moderadamente convertible. Los USD, EUR y otras divisas principales entrantes se convierten a THB al tipo de compra del banco receptor. Los bancos tailandeses suelen cobrar una comisión de transacción de aproximadamente entre THB 200 y 500 por las transferencias internacionales entrantes. Usar un proveedor de transferencias con una red de pago local en THB puede resultar en una entrega más rápida y un coste total más bajo.",
    ],
  },
  indonesia: {
    title: "Cómo funciona SWIFT en Indonesia",
    intro:
      "Bank Indonesia (BI) regula el sistema de pagos y las divisas. Las transferencias domésticas en rupia utilizan el sistema de pago en tiempo real BI-FAST lanzado en 2021, que ha reemplazado en gran medida el antiguo enrutamiento doméstico basado en RTGS. Para las transferencias internacionales entrantes, los principales bancos de Indonesia están conectados a SWIFT, y el beneficiario debe proporcionar tanto el código SWIFT del banco como su número de cuenta doméstico.",
    bullets: [
      "Los cuatro bancos estatales de Indonesia — BCA (CENAIDJA), Bank Mandiri (BMRIIDJA), Bank Rakyat Indonesia (BRINIDJA) y Bank Negara Indonesia (BNINIDJA) — procesan la mayoría de las transferencias internacionales entrantes. Tenga en cuenta que BCA (Bank Central Asia) es de propiedad privada a pesar de su nombre. Para las remesas a pymes y minoristas, CIMB Niaga y Permata Bank también se usan con frecuencia.",
      "Las regulaciones del Bank Indonesia requieren la notificación de las transferencias de moneda extranjera por encima del equivalente a USD 25.000. Las transferencias para inversión o fines comerciales requieren documentación adicional. El banco del beneficiario es responsable de la notificación regulatoria, pero las discrepancias entre la finalidad declarada y la naturaleza de la transacción pueden causar retrasos.",
      "La rupia indonesia (IDR) es una moneda no entregable fuera de Indonesia. La moneda extranjera entrante se convierte a IDR al tipo del banco receptor en la fecha de liquidación. Los bancos indonesios suelen cobrar una comisión de transferencia entrante de aproximadamente entre IDR 50.000 y 150.000. Algunos proveedores de remesas se han asociado con bancos indonesios locales para ofrecer entrega directa a cuenta a un coste menor que el enrutamiento SWIFT estándar.",
    ],
  },
  malaysia: {
    title: "Cómo funciona SWIFT en Malasia",
    intro:
      "Bank Negara Malaysia (BNM) regula las divisas y los pagos internacionales. Las transferencias domésticas en ringgit utilizan la red de pago en tiempo real DuitNow, que enlaza con los números de MYKAD (identificación nacional) y los números de teléfono para transferencias instantáneas. Las transferencias internacionales entrantes requieren códigos SWIFT. El sistema bancario de Malasia es uno de los más avanzados del sudeste asiático, con los principales bancos ofreciendo cuentas multicurrencia.",
    bullets: [
      "Los tres mayores bancos de Malasia por uso de SWIFT son Malayan Banking Berhad (Maybank, MABORYMM), CIMB Bank (CIBBMYKL) y Public Bank Berhad (PBBEMYKL). RHB Bank, Hong Leong Bank y AmBank también se usan habitualmente para recibir transferencias internacionales. Las filiales de banca islámica de estos bancos tienen códigos SWIFT separados — por ejemplo, Maybank Islamic es distinta de la Maybank convencional.",
      "Las reglas de administración de divisas del BNM requieren que los residentes declaren la finalidad de las transferencias extranjeras entrantes por encima de MYR 10.000. El banco receptor procesa la declaración, pero el beneficiario puede necesitar proporcionar documentación para las transferencias relacionadas con negocios. Las remesas personales para mantenimiento familiar son generalmente sencillas.",
      "El ringgit malayo (MYR) no se negocia libremente en el extranjero. La moneda extranjera entrante se convierte a MYR al tipo vigente del banco en la fecha de liquidación. Los emisores que transfieren USD o SGD deben confirmar con el beneficiario si su banco puede mantener moneda extranjera, ya que algunas cuentas malasias pueden mantener saldos multicurrencia antes de la conversión.",
    ],
  },
  brazil: {
    title: "Cómo funciona SWIFT en Brasil",
    intro:
      "El Banco Central do Brasil (BCB) regula todos los pagos internacionales y las transacciones de divisas. Brasil opera el sistema de pago instantáneo Pix para las transferencias domésticas — una red disponible las 24 horas, los 7 días de la semana y sin comisiones lanzada en 2020 — pero Pix no puede recibir pagos SWIFT internacionales. Las transferencias internacionales entrantes requieren códigos SWIFT y están sujetas a los requisitos de notificación del BCB. Brasil tiene regulaciones de divisas más estrictas en comparación con la mayoría de los países latinoamericanos.",
    bullets: [
      "Los principales bancos de Brasil conectados a SWIFT incluyen Banco do Brasil, Itaú Unibanco, Bradesco, Santander Brasil y Caixa Econômica Federal. Itaú y Bradesco tienen las redes de banca corresponsal más amplias a nivel internacional. Para los pagos comerciales, muchas empresas multinacionales utilizan el código SWIFT del banco principal de su filial brasileña.",
      "Todas las transferencias de moneda extranjera entrantes a Brasil deben realizarse a través de un distribuidor autorizado brasileño (un banco o corredor de divisas con licencia). La moneda extranjera se convierte a BRL al tipo comercial, y el banco presenta un informe regulatorio (Natureza) al BCB. El código de finalidad declarado debe coincidir con la transacción subyacente; las discrepancias pueden congelar los fondos pendientes de investigación.",
      "Brasil cobra el IOF (Imposto sobre Operações Financeiras), un impuesto sobre operaciones financieras, en las transacciones de divisas. El tipo del IOF para las remesas personales entrantes es normalmente del 0,38%, aplicado al valor en BRL recibido. Las transferencias comerciales o los pagos relacionados con préstamos pueden atraer tipos de IOF diferentes. Este impuesto lo deduce el banco receptor antes de acreditar la cuenta.",
    ],
  },
  kenya: {
    title: "Cómo funciona SWIFT en Kenia",
    intro:
      "El Banco Central de Kenia (CBK) regula la banca y las divisas. Kenia tiene un ecosistema financiero dual: M-Pesa domina las transferencias domésticas de dinero móvil, mientras que SWIFT sustenta las transferencias bancarias internacionales a través del sector bancario formal. Los principales bancos kenianos, incluidos KCB, Equity Bank, Co-operative Bank y NCBA, están todos conectados a SWIFT. Las transferencias internacionales entrantes se acreditan en KES o en moneda extranjera según el tipo de cuenta.",
    bullets: [
      "Los cuatro mayores bancos de Kenia para las transferencias internacionales son Kenya Commercial Bank (KCB), Equity Bank, Cooperative Bank of Kenya y NCBA (formado de la fusión de NIC Bank y Commercial Bank of Africa). Stanbic Kenya (filial del Standard Bank Group) y Absa Kenya se usan habitualmente para los pagos corporativos en USD y EUR debido a las redes de sus matrices sudafricanas.",
      "Las regulaciones del CBK permiten a los kenianos tener cuentas de moneda extranjera (FCAs) en bancos con licencia. Las transferencias entrantes en USD, EUR o GBP se pueden acreditar directamente en una FCA sin conversión obligatoria a KES. Esto es ventajoso para los beneficiarios que reciben pagos extranjeros regularmente y quieren evitar la conversión a tipos desfavorables.",
      "M-Pesa no puede recibir directamente transferencias bancarias SWIFT internacionales, pero proveedores como Western Union y WorldRemit pueden entregar fondos a billeteras M-Pesa usando sus propias redes. Para las transferencias internacionales de banco a banco, el emisor debe usar el código SWIFT del banco receptor del beneficiario. La liquidación suele realizarse en un plazo de uno a dos días hábiles.",
    ],
  },
  ghana: {
    title: "Cómo funciona SWIFT en Ghana",
    intro:
      "El Banco de Ghana (BOG) regula los pagos internacionales y el mercado de divisas. Ghana tiene uno de los sistemas bancarios más desarrollados de África Occidental, con los principales bancos bien conectados a la red SWIFT. Junto a la banca formal, el dinero móvil (especialmente MTN MoMo y Vodafone Cash) se usa ampliamente a nivel doméstico, pero las plataformas de dinero móvil no pueden recibir directamente transferencias SWIFT internacionales.",
    bullets: [
      "Los principales bancos de Ghana en la red SWIFT incluyen GCB Bank (anteriormente Ghana Commercial Bank), Ecobank Ghana, Stanbic Bank Ghana, Absa Bank Ghana y Standard Chartered Ghana. Ecobank y Stanbic tienen sólidas redes corresponsales panafricanas, lo que los hace bien adecuados para las transferencias desde otros países africanos.",
      "Las regulaciones del Banco de Ghana requieren que todas las transferencias de moneda extranjera entrantes se declaren para la notificación estadística. Las transferencias por encima de USD 10.000 requieren documentación de finalidad. El banco del beneficiario convierte la moneda extranjera a GHS al tipo de cambio vigente a menos que el beneficiario tenga una cuenta de moneda extranjera (cuenta de divisas), que ofrecen la mayoría de los principales bancos ghaneses.",
      "Ghana opera un mercado de divisas relativamente abierto en comparación con algunos vecinos de África Occidental, pero el GHS ha experimentado una depreciación significativa en los últimos años. Los beneficiarios que esperan transferencias grandes deberían considerar el momento de la conversión o mantener los fondos en una cuenta de divisas denominada en USD si esperan un tipo más favorable en GHS.",
    ],
  },
  "sri-lanka": {
    title: "Cómo funciona SWIFT en Sri Lanka",
    intro:
      "El Banco Central de Sri Lanka (CBSL) regula todas las transacciones de divisas y los pagos internacionales. SWIFT es el canal principal para las remesas entrantes, que se encuentran entre las fuentes más importantes de ingresos de divisas de Sri Lanka. Los principales bancos, incluidos Bank of Ceylon, Commercial Bank of Ceylon, Hatton National Bank y Sampath Bank, están todos conectados a la red SWIFT.",
    bullets: [
      "Los cuatro bancos de Sri Lanka más utilizados para las transferencias internacionales entrantes son Bank of Ceylon (BCEYLKLX), Commercial Bank of Ceylon (CABORLKLXXX), Hatton National Bank (HABORLKLXXX) y Sampath Bank. El Bank of Ceylon es de propiedad estatal y gestiona una gran parte de las transferencias relacionadas con el gobierno, mientras que Commercial Bank tiene la red minorista más amplia y sólidos volúmenes de remesas de la diáspora.",
      "Las regulaciones del CBSL permiten a los residentes de Sri Lanka recibir transferencias de moneda extranjera en Cuentas de Remesas Entrantes (IRA) o cuentas de Moneda Extranjera de No Residentes (NRFC). Los fondos en cuentas NRFC se pueden mantener en moneda extranjera sin conversión obligatoria a LKR, lo que es útil para los expatriados o beneficiarios que transfieren dinero regularmente a casa.",
      "Sri Lanka ha experimentado una volatilidad económica significativa en los últimos años, que ha afectado al tipo de cambio del LKR y ha llevado a restricciones periódicas en las divisas. Los emisores deben usar transferencias SWIFT a través de canales bancarios oficiales en lugar de redes informales, ya que el CBSL prioriza la asignación de divisas a las remesas entrantes registradas oficialmente.",
    ],
  },
  nepal: {
    title: "Cómo funciona SWIFT en Nepal",
    intro:
      "Nepal Rastra Bank (NRB), el banco central, regula toda la actividad bancaria internacional y de divisas. Las remesas de los trabajadores nepalesíes en el extranjero son la mayor fuente de divisas del país, lo que hace que las transferencias SWIFT entrantes sean de vital importancia para la economía. Los principales bancos, incluidos Nabil Bank, Standard Chartered Nepal, Nepal Investment Bank e Himalayan Bank, están conectados a la red SWIFT. Las transferencias domésticas utilizan el sistema ConnectIPS.",
    bullets: [
      "Los bancos de Nepal conectados a SWIFT incluyen Nabil Bank, Standard Chartered Nepal, Nepal Investment Bank, Himalayan Bank, Everest Bank y NMB Bank. Standard Chartered Nepal se usa frecuentemente como centro corresponsal para las transferencias en USD debido a su red global. Nabil Bank (anteriormente Nepal Arab Bank) tiene una de las relaciones corresponsales internacionales más sólidas para las remesas personales.",
      "Las regulaciones del NRB requieren que todas las transferencias de moneda extranjera entrantes se conviertan a rupias nepalesas (NPR) en un plazo de tres meses desde su recepción, a menos que se mantengan en una Cuenta de Moneda Extranjera (FCA). Las FCAs están permitidas para los nepaleses no residentes (NRN) y los residentes que reciben transferencias extranjeras regularmente. El tipo de cambio para la conversión lo establece el banco receptor basándose en el tipo de referencia diario del NRB.",
      "El mercado de divisas de Nepal está estrechamente gestionado por el NRB. El NPR está vinculado a la rupia india (INR) a un tipo fijo, que a su vez afecta a la conversión USD/NPR. Los emisores deben usar operadores de transferencia de dinero con licencia o transferencias SWIFT de banco a banco en lugar de canales informales, ya que el NRB monitorea los flujos de remesas y las transferencias no oficiales pueden crear problemas cuando los fondos necesitan ser accedidos.",
    ],
  },
  turkiye: {
    title: "Cómo funciona SWIFT en Türkiye",
    intro:
      "El Banco Central de la República de Türkiye (CBRT) supervisa la política monetaria y las divisas, mientras que la Agencia de Regulación y Supervisión Bancaria (BDDK) regula el sector bancario. El sistema de pago doméstico de Türkiye usa la red EFT (Transferencia Electrónica de Fondos) para las transferencias en TRY y FAST para los pagos en tiempo real, ambos independientes de SWIFT. Los principales bancos turcos — Garanti BBVA, İş Bankası, Akbank y Yapı Kredi — están bien conectados internacionalmente a través de SWIFT.",
    bullets: [
      "Los cuatro mayores bancos privados turcos para las transacciones SWIFT son Garanti BBVA (TGBATRIS), Türkiye İş Bankası (ISBKTRIS), Akbank (AKBKTRIS) y Yapı Kredi (YAPITRIS). Los bancos estatales Ziraat Bankası y Halkbank también procesan volúmenes SWIFT significativos y son habitualmente utilizados por los expatriados turcos para enviar dinero a casa.",
      "Türkiye ha experimentado alta inflación y depreciación del TRY en los últimos años, lo que hace que la elección de la moneda de liquidación sea importante. Los emisores pueden instruir la transferencia en USD o EUR, que el beneficiario puede mantener en una cuenta de moneda extranjera (döviz hesabı) en la mayoría de los bancos turcos. Convertir grandes cantidades al tipo TRY del banco en un solo día puede ser costoso; considere escalonar las conversiones o usar la facilidad de cuenta döviz de un banco.",
      "Las regulaciones financieras de Türkiye requieren que las transferencias de moneda extranjera entrantes por encima de USD 50.000 sean notificadas por el banco receptor al CBRT para las estadísticas de la balanza de pagos. Las transferencias comerciales requieren una declaración de finalidad y pueden necesitar documentación de respaldo. Las remesas personales se procesan generalmente sin requisitos adicionales.",
    ],
  },
  egypt: {
    title: "Cómo funciona SWIFT en Egipto",
    intro:
      "El Banco Central de Egipto (CBE) regula las divisas y los pagos internacionales. Egipto opera un sistema ACH (Cámara de Compensación Automatizada) para las transferencias domésticas en EGP, mientras que las transferencias internacionales utilizan SWIFT. Las remesas de los egipcios que trabajan en el extranjero son una de las fuentes más importantes de divisas del país. El National Bank of Egypt, Banque Misr y el Commercial International Bank (CIB) son los actores dominantes en el procesamiento de transferencias bancarias internacionales.",
    bullets: [
      "Los tres bancos de Egipto más utilizados para las transferencias SWIFT entrantes son el National Bank of Egypt (NBEGEGCX), Banque Misr (BMISEGCX) y Commercial International Bank (CIBOREG1XXX). El National Bank of Egypt y Banque Misr son ambos de propiedad estatal y gestionan la mayor parte de las remesas de la diáspora. CIB es el mayor banco del sector privado y se usa ampliamente para los pagos internacionales comerciales y corporativos.",
      "Las regulaciones del CBE requieren que la moneda extranjera entrante se convierta a EGP al tipo declarado del banco a menos que el beneficiario tenga una cuenta de moneda extranjera. Egipto ha mantenido históricamente múltiples mecanismos de tipo de cambio, y la brecha entre el tipo oficial y el del mercado paralelo ha variado significativamente. Usar canales bancarios oficiales garantiza que las transferencias se reciban al tipo publicado por el CBE y que el beneficiario evite complicaciones con las regulaciones de divisas.",
      "Egipto no impone retención fiscal sobre las remesas entrantes, y las transferencias personales de los egipcios expatriados son fomentadas por la política del CBE. Sin embargo, las grandes transferencias comerciales pueden requerir documentación como facturas comerciales, licencias de importación o contratos antes de que el banco receptor libere los fondos. Asegurarse de que las referencias de pago coincidan con la finalidad declarada ayuda a evitar retrasos de cumplimiento.",
    ],
  },
  morocco: {
    title: "Cómo funciona SWIFT en Marruecos",
    intro:
      "Bank Al-Maghrib, el banco central, regula las divisas y los pagos internacionales en Marruecos. Las remesas de los marroquíes que viven en el extranjero (MRE — Marocains Résidant à l'Étranger) son la segunda mayor fuente de divisas del país después del turismo. Los principales bancos Attijariwafa Bank, BMCE Bank of Africa y Banque Populaire du Maroc están conectados a SWIFT y gestionan la mayoría de las transferencias internacionales entrantes.",
    bullets: [
      "Los tres mayores bancos marroquíes por volúmenes SWIFT entrantes son Attijariwafa Bank (BCMAMAMC), BMCE Bank of Africa (BMCEMAMC) y Banque Centrale Populaire / Banque Populaire (BCPOMAMC). Attijariwafa Bank tiene la red corresponsal más amplia en Europa, especialmente en Francia, España, Bélgica e Italia, lo que refleja la distribución geográfica de la diáspora marroquí.",
      "Bank Al-Maghrib permite a los beneficiarios de transferencias de moneda extranjera entrantes convertir a dírhams marroquíes (MAD) al tipo de cambio del banco. El MAD no es libremente convertible fuera de Marruecos, por lo que los fondos recibidos internacionalmente deben gestionarse a través del sistema bancario formal. Los marroquíes no residentes (MRE) pueden abrir cuentas CEN/CNE específicas (Comptes en Devises) para recibir y mantener moneda extranjera antes de convertir.",
      "Marruecos ha liberalizado progresivamente sus regulaciones de divisas en los últimos años, permitiendo a los residentes mantener cantidades limitadas de moneda extranjera en cuentas bancarias. Las transferencias comerciales requieren documentación que coincida con la finalidad comercial. Las remesas personales de la diáspora marroquí son activamente fomentadas por el gobierno y reciben un procesamiento simplificado en los principales bancos.",
    ],
  },
  colombia: {
    title: "Cómo funciona SWIFT en Colombia",
    intro:
      "El Banco de la República (Banrep) regula la política monetaria y las divisas, mientras que la Superintendencia Financiera de Colombia supervisa la banca. Colombia usa ACH Colombia para las transferencias domésticas en COP, que opera de forma independiente a SWIFT. Las transferencias bancarias internacionales entrantes requieren códigos SWIFT, y el regulador bancario de Colombia exige que todas las divisas extranjeras entrantes se registren a través del sistema bancario formal.",
    bullets: [
      "Los tres mayores bancos de Colombia para las transferencias internacionales basadas en SWIFT son Bancolombia (COABORBB), Banco de Bogotá (BBOGCOBB) y Davivienda (DAVICOBB). Bancolombia es el mayor banco del país y tiene las capacidades de transferencia internacional más desarrolladas, incluida una sólida conectividad con los Estados Unidos. BBVA Colombia y Scotiabank Colpatria también gestionan volúmenes transfronterizos significativos.",
      "Las regulaciones de divisas de Colombia requieren que todas las transferencias internacionales entrantes sean canalizadas a través de un intermediario financiero autorizado (un banco o corredor autorizado). El banco del beneficiario registra la transferencia en el Banrep bajo un código de razón específico. Para los importes por encima de USD 10.000, pueden ser necesarios formularios de declaración adicionales. La finalidad declarada debe coincidir con la naturaleza real de la transacción para evitar complicaciones regulatorias.",
      "El peso colombiano (COP) es libremente convertible. Las transferencias entrantes en USD o EUR se convierten a COP al tipo de mercado del banco en el día del crédito. Colombia no impone retención fiscal sobre las remesas personales. Para los pagos comerciales, se debe proporcionar documentación de factura. Se aconseja al emisor que conserve los recibos de transferencia, ya que Colombia puede solicitar evidencia de los pagos salientes con fines estadísticos.",
    ],
  },
  peru: {
    title: "Cómo funciona SWIFT en Perú",
    intro:
      "El Banco Central de Reserva del Perú (BCRP) gestiona la política monetaria y las reservas de divisas. El regulador bancario de Perú, la SBS (Superintendencia de Banca, Seguros y AFP), supervisa todos los bancos con licencia. Las transferencias domésticas en PEN utilizan el sistema de compensación CCE (Cámara de Compensación Electrónica). Para las transferencias internacionales entrantes, los principales bancos de Perú están bien conectados a SWIFT, y el sistema de divisas relativamente abierto de Perú hace que recibir transferencias internacionales sea sencillo.",
    bullets: [
      "Los cuatro principales bancos de Perú conectados a SWIFT son Banco de Crédito del Perú (BCP, BCPLPEPL), BBVA Perú (BABORPPL), Interbank (BINPPEPL) y Scotiabank Perú. El BCP es el mayor banco peruano por activos y procesa el mayor volumen de transferencias internacionales entrantes. Interbank tiene sólidas capacidades de banca digital y es popular entre los clientes minoristas que reciben remesas.",
      "Perú permite a los particulares tener cuentas en USD en los bancos locales, y las transferencias entrantes en USD se pueden acreditar directamente en una cuenta en dólares (cuenta en dólares) sin conversión obligatoria a PEN. Esta es una ventaja significativa para los beneficiarios que quieren evitar convertir al tipo de cambio del banco o que necesitan hacer pagos en USD desde su cuenta.",
      "Las regulaciones de la SBS requieren que las transferencias entrantes por encima de USD 10.000 vayan acompañadas de una declaración de origen de fondos. El banco receptor gestiona la presentación regulatoria, pero la finalidad de la transferencia debe indicarse claramente en la referencia de pago. Perú no impone retención fiscal sobre las remesas personales. Las transferencias comerciales requieren documentación de factura, especialmente para importaciones o pagos de servicios.",
    ],
  },
  },
  faqs: {
  "united-kingdom": [
    {
      q: "¿Qué es un código SWIFT para el Reino Unido?",
      a: "Un código SWIFT (también llamado BIC) es un identificador de 8 u 11 caracteres utilizado por los bancos del Reino Unido para transferencias internacionales. La parte del código de país es GB. Por ejemplo, BARCGB22 es el código SWIFT de Barclays. La estructura es: 4 caracteres para el banco, 2 para el país (GB), 2 para la ciudad o ubicación, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos del Reino Unido?",
      a: "Los principales códigos SWIFT de bancos del Reino Unido incluyen: Barclays — BARCGB22, HSBC — HBUKGB4B, Lloyds Bank — LOYDGB2L, NatWest — NWBKGB2L, Santander UK — ABBYGB2L, Standard Chartered — SCBLGB2L, y Nationwide — NAIAGB21. Confirme siempre el código exacto con el banco del beneficiario, ya que algunos bancos utilizan códigos distintos para divisiones específicas.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco en el Reino Unido?",
      a: "Puede encontrar el código SWIFT de su banco del Reino Unido en su extracto bancario, en su aplicación de banca en línea o móvil, contactando con su sucursal, o buscando en esta página. La mayoría de los bancos del Reino Unido también muestran los códigos SWIFT en sus páginas de ayuda para pagos internacionales. Verifique siempre el código con su banco antes de compartirlo con un remitente en el extranjero.",
    },
    {
      q: "¿Necesito un código SWIFT o un sort code para transferencias internacionales al Reino Unido?",
      a: "Para transferencias internacionales desde fuera del Reino Unido, el remitente necesita el código SWIFT/BIC del banco más el número de cuenta (y a menudo también el sort code). Los sort codes se utilizan únicamente para transferencias domésticas del Reino Unido a través de Faster Payments, Bacs y CHAPS, pero no son reconocidos por la red internacional SWIFT. Proporcione tanto el código SWIFT como el sort code y el número de cuenta para evitar retrasos.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT al Reino Unido?",
      a: "Las transferencias SWIFT al Reino Unido suelen llegar en uno a tres días hábiles. Las transferencias desde Europa y América del Norte suelen liquidarse en uno a dos días hábiles en los principales bancos como Barclays, HSBC y Lloyds. La posición de Londres como centro financiero mundial significa que la mayoría de los bancos del Reino Unido tienen sólidas relaciones de corresponsalía, lo que contribuye a agilizar la liquidación.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en el Reino Unido?",
      a: "Los bancos del Reino Unido pueden cobrar una comisión por pago internacional entrante, normalmente de 5 a 15 GBP, aunque algunas cuentas (especialmente las cuentas premium o internacionales) la eximen. Si la transferencia llega en una moneda distinta a GBP, el banco la convertirá al tipo de cambio propio, que generalmente incluye un margen sobre el tipo de cambio medio. Confirme la comisión por transferencia entrante de su banco antes de que se envíe la transferencia.",
    },
    {
      q: "¿Cuál es la diferencia entre Faster Payments, CHAPS y SWIFT en el Reino Unido?",
      a: "Faster Payments y CHAPS son sistemas de pago domésticos del Reino Unido: Faster Payments gestiona transferencias en tiempo real de hasta 1 millón de GBP usando sort codes y números de cuenta, mientras que CHAPS gestiona transferencias de alto valor en GBP el mismo día. Ninguno puede recibir pagos internacionales. SWIFT es la red internacional para transferencias transfronterizas. Cuando un pago SWIFT llega a un banco del Reino Unido, el banco abona el importe en la cuenta del beneficiario a través de sus sistemas internos.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras directamente en mi cuenta bancaria del Reino Unido?",
      a: "La mayoría de las cuentas corrientes estándar del Reino Unido están denominadas en GBP, y las transferencias entrantes en divisas extranjeras se convierten automáticamente a libras. Sin embargo, algunos bancos y proveedores fintech (como HSBC, Barclays, Wise y Revolut) ofrecen cuentas multidivisa que pueden mantener USD, EUR y otras divisas. Si recibe divisas extranjeras con regularidad, una cuenta multidivisa evita la conversión automática al tipo de cambio menos favorable del banco.",
    },
  ],

  netherlands: [
    {
      q: "¿Qué es un código SWIFT para los Países Bajos?",
      a: "Un código SWIFT (también llamado BIC) es un identificador de 8 u 11 caracteres utilizado por los bancos neerlandeses para transferencias internacionales. La parte del código de país es NL. Por ejemplo, ABNANL2A es el código SWIFT de ABN AMRO. La estructura es: 4 caracteres para el banco, 2 para el país (NL), 2 para la ciudad, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos neerlandeses?",
      a: "Los principales códigos SWIFT de bancos neerlandeses incluyen: ABN AMRO — ABNANL2A, ING — INGBNL2A, Rabobank — RABONL2U, SNS Bank — SNSBNL2A, Triodos Bank — TRIONL2U, y de Volksbank — SNSBNL2A. Confirme siempre el código exacto con el banco del beneficiario antes de enviar.",
    },
    {
      q: "¿Necesito un código SWIFT o solo un IBAN para transferencias a los Países Bajos?",
      a: "Si envía EUR desde dentro de la zona SEPA (UE, EEE y ciertos otros países), el IBAN neerlandés (que comienza con NL) suele ser suficiente y el pago se realiza a través de SEPA Credit Transfer, sin necesidad de código SWIFT. Si envía desde fuera de SEPA o en una divisa distinta al EUR, necesitará el código SWIFT/BIC del banco junto con el IBAN.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco neerlandés?",
      a: "Puede encontrar el código SWIFT de su banco neerlandés en su extracto bancario, en su aplicación de banca en línea, contactando con su banco, o buscando en esta página. Los IBAN neerlandeses contienen el identificador del banco en los primeros ocho caracteres, pero esto no es lo mismo que el código BIC/SWIFT completo. Verifique siempre directamente con su banco.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a los Países Bajos?",
      a: "Las transferencias SEPA en EUR desde dentro de Europa suelen llegar en un día hábil. Las transferencias SWIFT desde fuera de SEPA (como desde Estados Unidos, Canadá o Australia) tardan generalmente de uno a tres días hábiles. Las transferencias en divisas distintas al EUR pueden tardar un poco más debido al enrutamiento a través de bancos corresponsales y la conversión de divisas en el banco receptor.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en los Países Bajos?",
      a: "Las transferencias SEPA en EUR suelen ser gratuitas o de muy bajo coste. Las transferencias SWIFT no SEPA pueden generar una comisión por transferencia entrante en los bancos neerlandeses, normalmente de 5 a 15 EUR. Si la transferencia llega en una divisa distinta al EUR, el banco la convertirá a su propio tipo de cambio, que incluye un margen. Algunos bancos neerlandeses eximen de comisiones entrantes a las cuentas premium o empresariales.",
    },
    {
      q: "¿Qué es SEPA y cómo se relaciona con SWIFT en los Países Bajos?",
      a: "SEPA (Zona Única de Pagos en Euros) es un sistema de pago europeo que permite transferencias en EUR entre países participantes utilizando únicamente el IBAN. Las transferencias SEPA no utilizan SWIFT, sino que se realizan a través de una red de compensación europea separada y son generalmente más rápidas y baratas. SWIFT solo es necesario cuando el pago proviene de fuera de SEPA o está en una divisa distinta al EUR.",
    },
    {
      q: "¿Puedo recibir divisas distintas al EUR directamente en una cuenta bancaria neerlandesa?",
      a: "Algunos bancos neerlandeses (especialmente ABN AMRO, ING y Rabobank) ofrecen cuentas multidivisa que pueden mantener USD, GBP y otras divisas. Si tiene una cuenta estándar en EUR, cualquier transferencia entrante en una divisa distinta al EUR se convertirá automáticamente a euros al tipo de cambio del banco. Para recepciones habituales de divisas extranjeras, una cuenta multidivisa evita esta conversión automática.",
    },
  ],

  "hong-kong": [
    {
      q: "¿Qué es un código SWIFT para Hong Kong?",
      a: "Un código SWIFT (BIC) para Hong Kong es un identificador de 8 u 11 caracteres utilizado por los bancos hongkoneses para transferencias internacionales. La parte del código de país es HK. Por ejemplo, HSBCHKHH es el código SWIFT de HSBC Hong Kong. La estructura es: 4 caracteres para el banco, 2 para el país (HK), 2 para la ciudad, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos de Hong Kong?",
      a: "Los principales códigos SWIFT de bancos de Hong Kong incluyen: HSBC Hong Kong — HSBCHKHH, Hang Seng Bank — HASEHKHH, Bank of China Hong Kong — BKCHHKHH, Standard Chartered Hong Kong — SCBLHKHH, Citibank Hong Kong — CITIHKHX, DBS Hong Kong — DHBKHKHH, y Bank of East Asia — BEASHKHH. Confirme siempre el código exacto con el banco del beneficiario.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco en Hong Kong?",
      a: "Puede encontrar el código SWIFT de su banco de Hong Kong en su extracto bancario, en su aplicación de banca por internet o móvil, o contactando con su sucursal. La mayoría de los principales bancos de Hong Kong muestran los códigos SWIFT en sus portales de banca en línea, en la sección de transferencias internacionales o detalles de cuenta. También puede buscarlo en esta página.",
    },
    {
      q: "¿Necesito un código SWIFT o un FPS ID para transferencias internacionales a Hong Kong?",
      a: "FPS (Sistema de Pagos Más Rápidos) es la red de pago doméstica en tiempo real de Hong Kong y no puede recibir transferencias SWIFT internacionales. Para transferencias internacionales desde fuera de Hong Kong, el remitente necesita el código SWIFT/BIC del banco receptor más el número de cuenta bancaria completo. FPS solo se utiliza para transferencias locales en HKD y CNY dentro de Hong Kong.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Hong Kong?",
      a: "Las transferencias SWIFT a Hong Kong suelen llegar en uno a dos días hábiles. Como importante centro financiero internacional, los bancos de Hong Kong tienen amplias relaciones de corresponsalía que facilitan una liquidación rápida. Las transferencias desde Estados Unidos, el Reino Unido y Europa suelen llegar en un día hábil para las principales divisas como USD, GBP y EUR.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Hong Kong?",
      a: "Los bancos de Hong Kong suelen cobrar una comisión por transferencia telegráfica (TT) entrante, a menudo de 50 a 200 HKD por transacción. Si la transferencia llega en una divisa distinta a la de la cuenta, el banco aplicará su propio tipo de cambio para la conversión. HSBC, Hang Seng y Standard Chartered pueden eximir de comisiones entrantes a los clientes de banca premium.",
    },
    {
      q: "¿Puedo recibir múltiples divisas en mi cuenta bancaria de Hong Kong?",
      a: "Sí. Los bancos de Hong Kong suelen ofrecer cuentas multidivisa que pueden mantener HKD, USD, EUR, GBP, CNY y otras divisas. Esta es una gran ventaja del sistema bancario de Hong Kong: puede recibir transferencias internacionales en la divisa original sin conversión automática. Confirme con el remitente en qué divisa prefiere recibir.",
    },
    {
      q: "¿Cuál es la diferencia entre enviar USD y HKD a Hong Kong?",
      a: "El HKD está vinculado al USD a aproximadamente 7,75–7,85, por lo que la conversión entre ambos es predecible. Enviar en USD a una cuenta multidivisa evita la conversión por completo. Si el beneficiario solo tiene una cuenta en HKD, ambas divisas darán resultados similares debido a la paridad. Para otras divisas como EUR o GBP, el tipo de cambio y las comisiones del banco pueden variar dependiendo de qué divisa se envíe.",
    },
  ],

  "united-states": [
    {
      q: "¿Qué es un código SWIFT para los Estados Unidos?",
      a: "Un código SWIFT (BIC) para Estados Unidos es un identificador de 8 u 11 caracteres utilizado por los bancos estadounidenses para transferencias internacionales. La parte del código de país es US. Por ejemplo, CHASUS33 es el código SWIFT de JPMorgan Chase. La estructura es: 4 caracteres para el banco, 2 para el país (US), 2 para la ciudad, y opcionalmente 3 para la sucursal o división.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos de Estados Unidos?",
      a: "Los principales códigos SWIFT de bancos de Estados Unidos incluyen: JPMorgan Chase — CHASUS33, Bank of America — BOFAUS3N, Citibank — CITIUS33, Wells Fargo — WFBIUS6S, US Bank — USBKUS44, PNC Bank — PNCCUS33, y Capital One — HIBKUS3N. Confirme siempre el código exacto con el banco del beneficiario, ya que algunos bancos utilizan diferentes códigos SWIFT para divisiones específicas.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco en Estados Unidos?",
      a: "Puede encontrar el código SWIFT de su banco estadounidense en su extracto bancario, en su aplicación de banca en línea o móvil, llamando al servicio de transferencias internacionales del banco, o buscando en esta página. Tenga en cuenta que el código SWIFT es diferente del número de ruta ABA: el número de ruta es solo para transferencias domésticas.",
    },
    {
      q: "¿Necesito un código SWIFT o un número de ruta ABA para transferencias internacionales a Estados Unidos?",
      a: "Para transferencias internacionales desde fuera de Estados Unidos, el remitente necesita el código SWIFT/BIC del banco receptor más el número de cuenta. El número de ruta ABA de nueve dígitos se utiliza únicamente para transferencias domésticas por ACH y Fedwire y no es reconocido por la red SWIFT. Algunos bancos también pueden solicitar el número de ruta ABA como información complementaria, pero el código SWIFT es el identificador internacional esencial.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Estados Unidos?",
      a: "Las transferencias SWIFT a Estados Unidos suelen llegar en uno a tres días hábiles. Estados Unidos es el mayor receptor mundial de transferencias internacionales, y los principales bancos como JPMorgan Chase, Bank of America y Citibank tienen amplias redes de corresponsalía que facilitan una liquidación rápida. Las transferencias desde Europa y Asia suelen llegar en uno a dos días hábiles.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Estados Unidos?",
      a: "Los bancos de Estados Unidos suelen cobrar una comisión por transferencia internacional entrante, normalmente de 15 a 25 USD por transacción, incluso si el remitente pagó todos los cargos de salida. Algunas cuentas premium o empresariales eximen esta comisión. Si la transferencia llega en una divisa distinta al USD, el banco la convertirá a su propio tipo de cambio. Confirme el calendario de comisiones por transferencia entrante de su banco antes de que se envíe la transferencia.",
    },
    {
      q: "¿Cuál es la diferencia entre Fedwire, ACH y SWIFT en Estados Unidos?",
      a: "Fedwire es el sistema de liquidación bruta en tiempo real de la Reserva Federal para transferencias domésticas en USD. ACH (Cámara de Compensación Automatizada) gestiona transferencias domésticas por lotes como nóminas y pagos de facturas. Ambos utilizan números de ruta ABA y son exclusivamente domésticos. SWIFT es la red internacional para transferencias transfronterizas. Cuando un pago SWIFT llega a un banco estadounidense, el banco abona el importe en la cuenta del beneficiario a través de sus sistemas internos.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras directamente en mi cuenta bancaria de Estados Unidos?",
      a: "La mayoría de las cuentas corrientes y de ahorro estándar de Estados Unidos están denominadas en USD, y las transferencias entrantes en divisas extranjeras se convierten automáticamente a dólares. Algunos bancos más grandes como Citibank, HSBC US y ciertos bancos de inversión ofrecen cuentas en divisas extranjeras. Para la mayoría de los beneficiarios, recibir en USD es lo más sencillo: el remitente puede convertir a USD en su extremo para obtener potencialmente un tipo de cambio más favorable.",
    },
  ],

  india: [
    {
      q: "¿Qué es un código SWIFT para India?",
      a: "Un código SWIFT (BIC) para India es un identificador de 8 u 11 caracteres utilizado por los bancos indios para transferencias internacionales. La parte del código de país es IN. Por ejemplo, SBININBB es el código SWIFT del State Bank of India. La estructura es: 4 caracteres para el banco, 2 para el país (IN), 2 para la ciudad, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos indios?",
      a: "Los principales códigos SWIFT de bancos indios incluyen: State Bank of India (SBI) — SBININBB, HDFC Bank — HDFCINBB, ICICI Bank — ICICINBB, Axis Bank — AXISINBB, Punjab National Bank — PUNBINBB, Bank of Baroda — BARBINBB, y Kotak Mahindra Bank — ABORINBB. Confirme siempre el código exacto con el banco del beneficiario, ya que los códigos SWIFT a nivel de sucursal pueden variar.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco indio?",
      a: "Puede encontrar el código SWIFT de su banco indio en su extracto bancario, en su aplicación de banca por internet o móvil, visitando su sucursal, o buscando en esta página. Tenga en cuenta que el código SWIFT es diferente del código IFSC: el IFSC es para transferencias domésticas (NEFT, RTGS, IMPS), mientras que el SWIFT es para transferencias internacionales.",
    },
    {
      q: "¿Necesito un código SWIFT o un código IFSC para transferencias internacionales a India?",
      a: "Para transferencias internacionales desde fuera de India, el remitente necesita el código SWIFT/BIC del banco receptor más el número de cuenta. El código IFSC (Código del Sistema Financiero Indio) se utiliza únicamente para transferencias domésticas a través de NEFT, RTGS e IMPS. Los códigos IFSC no son reconocidos por la red SWIFT. Algunos bancos pueden solicitar el IFSC como información complementaria para identificar la sucursal internamente.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a India?",
      a: "Las transferencias SWIFT a India suelen llegar en uno a tres días hábiles. Las transferencias desde Estados Unidos, el Reino Unido y Oriente Medio, que son los principales corredores para las remesas indias, generalmente se liquidan en uno a dos días hábiles. Los requisitos de cumplimiento del RBI, incluidas las declaraciones de propósito de pago, pueden en ocasiones añadir tiempo de procesamiento para transferencias de mayor importe o relacionadas con negocios.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en India?",
      a: "Los bancos indios suelen cobrar una comisión por gestión de remesas entrantes, a menudo de 100 a 500 INR por transacción. Las comisiones de bancos intermediarios a lo largo de la ruta SWIFT también pueden reducir el importe final en INR recibido. El banco receptor convierte la divisa extranjera a INR al tipo de compra de transferencia telegráfica, que incluye un margen sobre el tipo de cambio medio. Los proveedores que utilizan corredores de pago en INR dedicados suelen ofrecer entregas más rentables.",
    },
    {
      q: "¿Cuál es el requisito del código de propósito del RBI para transferencias entrantes a India?",
      a: "El Banco de la Reserva de India (RBI) exige un código de propósito de pago en cada remesa extranjera entrante. Los códigos comunes incluyen P0801 (mantenimiento familiar), S0305 (tasas educativas) y P0107 (compra de propiedad). El banco receptor asigna el código según la referencia del pago. Los códigos de propósito incorrectos o ausentes pueden retrasar el abono: asegúrese de que el remitente incluya una descripción clara del propósito de la transferencia.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras directamente en mi cuenta bancaria india?",
      a: "Las cuentas de ahorro estándar en INR no pueden mantener divisas extranjeras: la normativa del RBI exige la conversión a INR al tipo vigente del banco. Sin embargo, los residentes indios pueden abrir una cuenta RFC (Moneda Extranjera para Residentes) para mantener divisas extranjeras recibidas del extranjero. Los NRI (Indios No Residentes) pueden utilizar cuentas NRE o NRO, que tienen normas diferentes para la recepción de divisas extranjeras y la repatriación.",
    },
  ],
  germany: [
    {
      q: "¿Qué es un código SWIFT para Alemania?",
      a: "Un código SWIFT (también llamado BIC) es un identificador de 8 u 11 caracteres que utilizan los bancos alemanes para las transferencias internacionales. La parte del código de país es DE. Por ejemplo, DEUTDEFF es el código SWIFT del Deutsche Bank Frankfurt. La estructura es: 4 caracteres para el banco, 2 para el país (DE), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos alemanes?",
      a: "Los principales códigos SWIFT de bancos alemanes incluyen: Deutsche Bank — DEUTDEFF, Commerzbank — COBADEFF, DZ Bank — GENODEFF, HypoVereinsbank (UniCredit) — HYVEDEMMXXX, N26 — NTSBDEB1, e ING Germany — INGBDEFF. Las Sparkassen y las Volksbanken tienen cada una sus propios códigos SWIFT — no asuma que un código genérico funciona para todas las entidades.",
    },
    {
      q: "¿Necesito un código SWIFT o solo un IBAN para transferencias a Alemania?",
      a: "Para transferencias en EUR dentro de la zona SEPA, el IBAN alemán (que comienza con DE, 22 caracteres) suele ser suficiente — no se necesita código SWIFT. Para transferencias desde fuera de SEPA o en una moneda distinta al EUR, necesitará el código SWIFT/BIC del banco junto con el IBAN. Las transferencias SEPA son generalmente más rápidas y baratas que las SWIFT.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco alemán?",
      a: "Puede encontrar el código SWIFT de su banco alemán en su extracto bancario, en su portal de banca en línea, contactando a su banco o buscando en esta página. Tenga en cuenta que las Sparkassen (cajas de ahorros) y las Volksbanken (bancos cooperativos) tienen cada una sus propios códigos SWIFT distintos — no puede usar un código genérico de Deutsche Bank o Commerzbank para estas entidades.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Alemania?",
      a: "Las transferencias SEPA en EUR desde Europa suelen llegar en un día hábil (a menudo el mismo día con SEPA Instant). Las transferencias SWIFT desde fuera de SEPA generalmente tardan de uno a tres días hábiles. Las transferencias en monedas distintas al EUR pueden tardar un poco más debido al enrutamiento por bancos corresponsales y la conversión de divisas en el banco receptor.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Alemania?",
      a: "Las transferencias SEPA en EUR son normalmente gratuitas o de muy bajo costo en los bancos alemanes. Las transferencias SWIFT fuera de SEPA pueden generar una comisión de recepción, generalmente entre 5 y 15 EUR. Si la transferencia llega en una moneda distinta al EUR (como USD o GBP), el banco la convertirá a su propio tipo de cambio, que incluye un margen. Consulte el Preisverzeichnis (tarifa de comisiones) de su banco para más detalles.",
    },
    {
      q: "¿Cuál es la diferencia entre un código SWIFT de una Sparkasse y el de un banco comercial?",
      a: "Las Sparkassen (cajas de ahorros) y las Volksbanken (bancos cooperativos) alemanas son entidades independientes con sus propios códigos SWIFT, distintos de los bancos comerciales como Deutsche Bank y Commerzbank. Hay cientos de Sparkassen en Alemania, cada una con un BIC único. Debe usar el código SWIFT específico de la Sparkasse del destinatario — un código SWIFT de Deutsche Bank no funcionará para una cuenta de una Sparkasse.",
    },
    {
      q: "¿Puedo recibir divisas distintas al EUR directamente en una cuenta bancaria alemana?",
      a: "Algunos bancos alemanes (en particular Deutsche Bank, Commerzbank y bancos internacionales como HSBC Germany) ofrecen cuentas multidivisa que pueden mantener USD, GBP y otras monedas. Las cuentas estándar en EUR tendrán las transferencias en divisas distintas al EUR convertidas automáticamente al tipo de cambio del banco. Para recibos frecuentes en moneda extranjera, una cuenta multidivisa evita esta conversión automática.",
    },
  ],

  france: [
    {
      q: "¿Qué es un código SWIFT para Francia?",
      a: "Un código SWIFT (también llamado BIC en Francia) es un identificador de 8 u 11 caracteres que utilizan los bancos franceses para las transferencias internacionales. La parte del código de país es FR. Por ejemplo, BNPAFRPP es el código SWIFT de BNP Paribas. La estructura es: 4 caracteres para el banco, 2 para el país (FR), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos franceses?",
      a: "Los principales códigos SWIFT de bancos franceses incluyen: BNP Paribas — BNPAFRPP, Crédit Agricole — AGRIFRPP, Société Générale — SOGEFRPP, La Banque Postale — PSSTFRPP, Caisse d'Epargne — CEPAFRPP, Crédit Mutuel — CMCIFRPP y LCL — CRLYFRPP. Los bancos franceses suelen usar códigos BIC8; la variante BIC11 identifica una sucursal específica.",
    },
    {
      q: "¿Necesito un código SWIFT o solo un IBAN para transferencias a Francia?",
      a: "Para transferencias en EUR dentro de la zona SEPA, el IBAN francés (que comienza con FR, 27 caracteres) es suficiente — no se necesita código SWIFT/BIC. Para transferencias desde fuera de SEPA o en una moneda distinta al EUR, necesitará el código BIC/SWIFT del banco junto con el IBAN. Las transferencias SEPA son más rápidas, más baratas y no generan comisiones de recepción.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco francés?",
      a: "Puede encontrar el código BIC/SWIFT de su banco francés en su RIB (Relevé d'Identité Bancaire), en sus extractos bancarios, en su portal de banca en línea o buscando en esta página. El RIB es el documento bancario estándar francés que contiene su IBAN, BIC y datos bancarios — la mayoría de los bancos franceses lo proporcionan en su aplicación o en la sucursal.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Francia?",
      a: "Las transferencias SEPA en EUR desde Europa suelen llegar en un día hábil (a menudo el mismo día con SEPA Instant). Las transferencias SWIFT desde fuera de SEPA generalmente tardan de uno a tres días hábiles. Las transferencias en monedas distintas al EUR pueden tardar un poco más. Los bancos franceses procesan las transferencias SWIFT entrantes en horario bancario estándar (hora de París).",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Francia?",
      a: "Las transferencias SEPA en EUR son normalmente gratuitas o de muy bajo costo. Las transferencias SWIFT fuera de SEPA pueden generar una comisión de recepción (frais de reception de virement international), generalmente entre 10 y 30 EUR según el banco. Si la transferencia llega en una moneda distinta al EUR, el banco la convertirá a su propio tipo de cambio. Consulte el tarif bancaire (tarifa de comisiones) de su banco para más detalles.",
    },
    {
      q: "¿Qué es un RIB y cómo se relaciona con las transferencias SWIFT?",
      a: "Un RIB (Relevé d'Identité Bancaire) es un documento bancario estándar francés que contiene su IBAN, BIC (código SWIFT), nombre del banco y datos del titular de la cuenta. Es la forma principal en que los clientes de bancos franceses comparten su información de cuenta para transferencias. Para transferencias SWIFT internacionales, proporcione al remitente el BIC y el IBAN que figuran en su RIB.",
    },
    {
      q: "¿Puedo recibir divisas distintas al EUR directamente en mi cuenta bancaria francesa?",
      a: "La mayoría de las cuentas bancarias francesas estándar están denominadas en EUR, y las transferencias entrantes en otras divisas se convierten automáticamente al tipo de cambio del banco. Algunos bancos (especialmente BNP Paribas, Société Générale y bancos internacionales) ofrecen cuentas multidivisa. Si recibe habitualmente USD o GBP, una cuenta multidivisa evita la conversión automática y el margen asociado.",
    },
  ],

  "united-arab-emirates": [
    {
      q: "¿Qué es un código SWIFT para los Emiratos Árabes Unidos?",
      a: "Un código SWIFT (BIC) para los EAU es un identificador de 8 u 11 caracteres que utilizan los bancos emiratíes para las transferencias internacionales. La parte del código de país es AE. Por ejemplo, ABORAEADXXX es el código SWIFT de Emirates NBD. La estructura es: 4 caracteres para el banco, 2 para el país (AE), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos de los EAU?",
      a: "Los principales códigos SWIFT de bancos de los EAU incluyen: Emirates NBD — ABORAEADXXX, Abu Dhabi Commercial Bank (ADCB) — ADCBAEAA, First Abu Dhabi Bank (FAB) — NBADAEAA, Mashreq Bank — BOMLAEADXXX, Dubai Islamic Bank — DUIBAEAD y RAK Bank — NABOREAD. Las sucursales en zonas francas (DIFC, ADGM) pueden usar códigos SWIFT diferentes — confirme siempre con el destinatario.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco en los EAU?",
      a: "Puede encontrar el código SWIFT de su banco en los EAU en su extracto bancario, en su aplicación de banca en línea o móvil, contactando a su banco o buscando en esta página. Los bancos de los EAU suelen mostrar los códigos SWIFT claramente en sus plataformas de banca digital. Tenga en cuenta que las sucursales del DIFC y del ADGM pueden tener códigos distintos a los de las sucursales en el continente.",
    },
    {
      q: "¿Necesito un código SWIFT y un IBAN para transferencias a los EAU?",
      a: "Sí. Para transferencias internacionales a los EAU, el remitente necesita tanto el código SWIFT/BIC del banco receptor como el IBAN del destinatario (23 caracteres que comienzan con AE). El código SWIFT dirige el pago al banco correcto, mientras que el IBAN identifica la cuenta específica. Los bancos de los EAU requieren el IBAN para todas las transferencias — proporcionar solo el número de cuenta no es suficiente.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a los EAU?",
      a: "Las transferencias SWIFT a los EAU suelen llegar en uno o dos días hábiles para las principales divisas como USD, EUR y GBP. Los EAU son un importante centro bancario internacional con sólidas relaciones de corresponsalía, especialmente para transferencias en USD debido a la vinculación AED/USD. Las transferencias en divisas menos comunes pueden tardar un día adicional.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en los EAU?",
      a: "Los bancos de los EAU suelen cobrar una comisión de transferencia telegráfica entrante, generalmente entre 15 y 50 AED por transacción. Algunos bancos la eximen para clientes de banca privada o premium. Dado que el AED está vinculado al USD a aproximadamente 3,6725, las transferencias en USD a cuentas en AED resultan en una conversión predecible — aunque algunos bancos cobran un pequeño diferencial en la conversión.",
    },
    {
      q: "¿Cómo afecta la vinculación AED/USD a las transferencias internacionales?",
      a: "El dírham de los Emiratos Árabes Unidos (AED) está vinculado al dólar estadounidense a aproximadamente 3,6725, lo que significa que el tipo de cambio es estable y predecible para las transferencias en USD. Enviar USD a una cuenta bancaria en los EAU resulta en una tasa de conversión casi fija. Para otras divisas como EUR o GBP, la conversión depende del tipo de cambio del banco, que puede incluir un margen. Enviar USD suele ser la opción más rentable.",
    },
    {
      q: "¿Los bancos del DIFC y del ADGM usan códigos SWIFT diferentes?",
      a: "Sí. Los bancos que operan en el Centro Financiero Internacional de Dubái (DIFC) o en el Mercado Global de Abu Dabi (ADGM) pueden usar códigos SWIFT diferentes a los de sus sucursales en el continente de los EAU. Por ejemplo, la sucursal DIFC de un banco puede tener un código SWIFT distinto al de sus operaciones principales en los EAU. Confirme siempre el código SWIFT exacto con el destinatario, especificando si su cuenta está en una zona franca o en una sucursal del continente.",
    },
  ],

  canada: [
    {
      q: "¿Qué es un código SWIFT para Canadá?",
      a: "Un código SWIFT (BIC) para Canadá es un identificador de 8 u 11 caracteres que utilizan los bancos canadienses para las transferencias internacionales. La parte del código de país es CA. Por ejemplo, ROYCCAT2 es el código SWIFT del Royal Bank of Canada (RBC). La estructura es: 4 caracteres para el banco, 2 para el país (CA), 2 para la ciudad y, opcionalmente, 3 para la sucursal o división.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos canadienses?",
      a: "Los principales códigos SWIFT de bancos canadienses incluyen: Royal Bank of Canada (RBC) — ROYCCAT2, TD Canada Trust — TDOMCATTTOR, Scotiabank — NOSCCATT, Bank of Montreal (BMO) — BOFMCAM2, CIBC — CABOROTT, National Bank of Canada — BNDCCAMM y Desjardins — CCDQCAMM. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco canadiense?",
      a: "Puede encontrar el código SWIFT de su banco canadiense en su extracto bancario, en su aplicación de banca en línea o móvil, contactando al departamento de transferencias internacionales de su banco o buscando en esta página. El código SWIFT es diferente de su número de tránsito y número de institución, que son exclusivos para transferencias domésticas canadienses.",
    },
    {
      q: "¿Necesito un código SWIFT o un número de tránsito para transferencias internacionales a Canadá?",
      a: "Para transferencias internacionales desde fuera de Canadá, el remitente necesita el código SWIFT/BIC del banco receptor más el número de cuenta completo. El número de tránsito de cinco dígitos y el número de institución de tres dígitos son para transferencias domésticas canadienses (Interac, EFT) y no los utiliza la red SWIFT. Sin embargo, algunos bancos solicitan el número de tránsito como información complementaria para identificar la sucursal.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Canadá?",
      a: "Las transferencias SWIFT a Canadá suelen llegar en uno a tres días hábiles. Las transferencias desde EE. UU. generalmente se liquidan en un día hábil debido a las sólidas relaciones bancarias transfronterizas. Las transferencias desde Europa y Asia suelen tardar de uno a dos días hábiles en los principales bancos como RBC, TD y Scotiabank.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Canadá?",
      a: "Los bancos canadienses suelen cobrar una comisión por transferencia internacional entrante, generalmente entre 10 y 25 CAD por transacción. Si la transferencia llega en una moneda distinta al CAD, el banco la convierte a su tipo de cambio publicado, que generalmente incluye un recargo del 1 al 3% sobre el tipo de cambio interbancario. Enviar en CAD desde su extremo a menudo resulta en un costo total mejor si su proveedor ofrece una tasa competitiva.",
    },
    {
      q: "¿Cuál es la diferencia entre Interac, EFT y SWIFT en Canadá?",
      a: "Interac e-Transfer es el sistema canadiense de pagos instantáneos entre personas usando correo electrónico o número de teléfono. EFT (Transferencia Electrónica de Fondos) gestiona transferencias domésticas por lotes entre bancos canadienses usando números de tránsito e institución. Ambos son exclusivamente domésticos y no pueden recibir pagos internacionales. SWIFT es para transferencias internacionales transfronterizas usando códigos BIC.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras directamente en mi cuenta bancaria canadiense?",
      a: "La mayoría de las cuentas corrientes canadienses estándar están denominadas en CAD. Sin embargo, los cinco grandes bancos canadienses ofrecen cuentas en USD, y algunos ofrecen cuentas multidivisa para otras monedas. Si tiene una cuenta en USD, las transferencias entrantes en USD pueden acreditarse directamente sin conversión. De lo contrario, el banco convierte al tipo publicado, que incluye un recargo.",
    },
  ],

  australia: [
    {
      q: "¿Qué es un código SWIFT para Australia?",
      a: "Un código SWIFT (BIC) para Australia es un identificador de 8 u 11 caracteres que utilizan los bancos australianos para las transferencias internacionales. La parte del código de país es AU. Por ejemplo, CTBAAU2S es el código SWIFT del Commonwealth Bank of Australia (CBA). La estructura es: 4 caracteres para el banco, 2 para el país (AU), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos australianos?",
      a: "Los principales códigos SWIFT de bancos australianos incluyen: Commonwealth Bank (CBA) — CTBAAU2S, Westpac — WPACAU2S, ANZ — ANZBAU3M, National Australia Bank (NAB) — NATAAU33, Macquarie Bank — MACQAU2S y Bendigo and Adelaide Bank — BENDAU3B. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco australiano?",
      a: "Puede encontrar el código SWIFT de su banco australiano en su extracto bancario, en su aplicación de banca por Internet o móvil, contactando a su banco o buscando en esta página. El código SWIFT es diferente del número BSB (Bank-State-Branch) — el BSB es solo para transferencias domésticas, pero tanto el BSB como el código SWIFT son necesarios para transferencias internacionales.",
    },
    {
      q: "¿Necesito un código SWIFT y un BSB para transferencias internacionales a Australia?",
      a: "Sí. Para transferencias internacionales a Australia, el remitente necesita el código SWIFT/BIC del banco receptor, el BSB (seis dígitos) y el número de cuenta. El código SWIFT dirige el pago al banco correcto, mientras que el BSB y el número de cuenta identifican la sucursal y la cuenta específica. Proporcionar solo el código SWIFT sin el BSB puede ocasionar que el pago se retrase o sea devuelto.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Australia?",
      a: "Las transferencias SWIFT a Australia suelen llegar en uno a tres días hábiles. Las transferencias desde el Reino Unido y Asia generalmente se liquidan en uno o dos días hábiles. El huso horario de Australia (AEST, UTC+10/+11) significa que las transferencias enviadas tarde en el día hábil europeo o estadounidense pueden no procesarse hasta el siguiente día bancario australiano.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Australia?",
      a: "Los bancos australianos suelen cobrar una comisión por pago internacional entrante de entre 10 y 20 AUD por transferencia SWIFT. Algunos bancos la eximen para titulares de cuentas premium o internacionales. Si la transferencia llega en una moneda distinta al AUD, el banco la convierte a su propio tipo de cambio, que suele ser menos favorable que convertir en el lado del remitente.",
    },
    {
      q: "¿Qué es PayID y puede recibir transferencias SWIFT internacionales?",
      a: "PayID forma parte de la Nueva Plataforma de Pagos (NPP) de Australia y permite transferencias instantáneas domésticas usando un número de teléfono, correo electrónico o ABN. PayID no puede recibir transferencias SWIFT internacionales — es estrictamente doméstico. Para transferencias internacionales, el remitente debe usar el código SWIFT del banco receptor junto con el BSB y el número de cuenta.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras directamente en mi cuenta bancaria australiana?",
      a: "La mayoría de las cuentas bancarias australianas estándar están denominadas en AUD. Sin embargo, CBA, Westpac, ANZ y NAB ofrecen cuentas en divisas extranjeras (FCA) que pueden mantener USD, GBP, EUR y otras monedas. Si recibe habitualmente divisas extranjeras, una FCA evita la conversión automática. De lo contrario, el banco convierte las divisas extranjeras entrantes a AUD a su tipo comprador en la fecha de liquidación.",
    },
  ],
  singapore: [
    {
      q: "¿Qué es un código SWIFT para Singapur?",
      a: "Un código SWIFT (BIC) para Singapur es un identificador de 8 u 11 caracteres utilizado por los bancos singapurenses para transferencias internacionales. La parte del código de país es SG. Por ejemplo, DBSSSGSG es el código SWIFT del DBS Bank Singapur. La estructura es: 4 caracteres para el banco, 2 para el país (SG), 2 para la ciudad y, opcionalmente, 3 para la sucursal o división.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos singapurenses?",
      a: "Los principales códigos SWIFT de bancos singapurenses incluyen: DBS Bank — DBSSSGSG, OCBC Bank — OCBCSGSG, United Overseas Bank (UOB) — UOVBSGSG, Standard Chartered Singapur — SCBLSG22, Citibank Singapur — CITISGSG y HSBC Singapur — HSBCSGSG. Confirme siempre el código exacto con el banco del destinatario, ya que distintas divisiones pueden usar códigos diferentes.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco singapurense?",
      a: "Puede encontrar el código SWIFT de su banco singapurense en su extracto bancario, en su aplicación de banca por internet o móvil, contactando a su banco o buscando en esta página. DBS, OCBC y UOB muestran los códigos SWIFT claramente en sus plataformas de banca digital. Tenga en cuenta que las divisiones de banca privada y corporativa pueden tener códigos SWIFT diferentes.",
    },
    {
      q: "¿Necesito un código SWIFT o un ID de PayNow para transferencias internacionales a Singapur?",
      a: "PayNow es el sistema de pago instantáneo doméstico de Singapur vinculado a números NRIC/FIN o números de teléfono — no puede recibir transferencias SWIFT internacionales. Para transferencias internacionales desde fuera de Singapur, el remitente necesita el código SWIFT/BIC del banco del destinatario más el número completo de cuenta bancaria. PayNow es solo para transferencias locales en SGD dentro de Singapur.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Singapur?",
      a: "Las transferencias SWIFT a Singapur suelen llegar en uno o dos días hábiles. Como uno de los centros financieros más importantes de Asia, los bancos singapurenses tienen amplias relaciones con bancos corresponsales que facilitan una liquidación rápida para las principales divisas. Las transferencias desde EE. UU., Reino Unido y Europa en USD, EUR o GBP suelen liquidarse en un día hábil.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Singapur?",
      a: "Los bancos singapurenses suelen cobrar una comisión por transferencia telegráfica entrante, a menudo de 10 a 20 SGD por transacción. DBS, OCBC y UOB pueden eximir o reducir esta comisión para ciertos tipos de cuentas. Si la transferencia llega en una divisa distinta a la de la cuenta, el banco convertirá al tipo de cambio propio, que incluye un margen sobre el tipo de cambio de mercado.",
    },
    {
      q: "¿Puedo recibir múltiples divisas en mi cuenta bancaria singapurense?",
      a: "Sí. Los bancos singapurenses ofrecen habitualmente cuentas multidivisa que pueden mantener SGD, USD, EUR, GBP, AUD, HKD y otras divisas. Esto supone una ventaja significativa: puede recibir transferencias internacionales en la divisa original sin conversión automática. Confirme qué divisa debe usar el remitente, ya que recibir en la divisa existente de la cuenta evita las comisiones de conversión.",
    },
    {
      q: "¿Existen regulaciones de la MAS que afecten a las grandes transferencias entrantes a Singapur?",
      a: "La Autoridad Monetaria de Singapur (MAS) exige a los bancos realizar una diligencia debida reforzada en determinadas transferencias entrantes. Los pagos por encima de ciertos umbrales o procedentes de ciertas jurisdicciones pueden retenerse para revisión de cumplimiento, añadiendo uno o dos días hábiles. Proporcionar una referencia de pago y un propósito claros ayuda a evitar retrasos. Las remesas personales por debajo de los umbrales habituales se procesan generalmente con rapidez.",
    },
  ],

  "south-africa": [
    {
      q: "¿Qué es un código SWIFT para Sudáfrica?",
      a: "Un código SWIFT (BIC) para Sudáfrica es un identificador de 8 u 11 caracteres utilizado por los bancos sudafricanos para transferencias internacionales. La parte del código de país es ZA. Por ejemplo, SBZAZAJJ es el código SWIFT del Standard Bank. La estructura es: 4 caracteres para el banco, 2 para el país (ZA), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos sudafricanos?",
      a: "Los principales códigos SWIFT de bancos sudafricanos incluyen: Standard Bank — SBZAZAJJ, First National Bank (FNB) — FIRNZAJJ, Absa Bank — ABSAZAJJ, Nedbank — NEDSZAJJ, Capitec Bank — CABORAZJ e Investec — IVESZAJJ. La mayoría de las transferencias internacionales se enrutan a través de la pasarela SWIFT de la sede central del banco en Johannesburgo.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco sudafricano?",
      a: "Puede encontrar el código SWIFT de su banco sudafricano en su extracto bancario, en su aplicación de banca en línea, contactando a su banco o buscando en esta página. Standard Bank, FNB, Absa y Nedbank muestran los códigos SWIFT en sus plataformas de banca digital. Los códigos a nivel de sucursal se usan con menos frecuencia — la mayoría de las transferencias pasan por la pasarela SWIFT de la sede central.",
    },
    {
      q: "¿Necesito un código SWIFT y un código de sucursal para transferencias internacionales a Sudáfrica?",
      a: "Sí. Para transferencias bancarias internacionales a Sudáfrica, el remitente necesita el código SWIFT/BIC del banco del destinatario, el código de sucursal (seis dígitos) y el número de cuenta. El código SWIFT dirige el pago al banco correcto, mientras que el código de sucursal y el número de cuenta identifican la sucursal y la cuenta específicas. Proporcione los tres para evitar retrasos.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Sudáfrica?",
      a: "Las transferencias SWIFT a Sudáfrica suelen llegar en uno a tres días hábiles. Las transferencias desde el Reino Unido — un corredor importante — suelen liquidarse en uno o dos días hábiles. Los requisitos de cumplimiento del SARB, incluida la documentación de control de cambios, pueden añadir tiempo de procesamiento si el banco del destinatario solicita documentos justificativos antes de liberar los fondos.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Sudáfrica?",
      a: "Los bancos sudafricanos suelen cobrar una comisión por transferencia entrante y una comisión SWIFT, que combinadas pueden ser de 100 a 500 ZAR según el banco y el importe. El banco convierte la divisa extranjera entrante a ZAR al tipo de cambio propio, que incluye un diferencial sobre el tipo de mercado. Para transferencias de gran cuantía, el destinatario puede en ocasiones negociar un tipo mejor con el departamento de divisas del banco.",
    },
    {
      q: "¿Qué son los controles de cambio del SARB y cómo afectan a las transferencias entrantes?",
      a: "El Banco de la Reserva de Sudáfrica (SARB) impone controles de cambio sobre los pagos transfronterizos. Por cada transferencia internacional entrante, el banco del destinatario debe establecer el propósito del pago antes de acreditar los fondos. Pueden requerirse documentos como facturas, contratos de trabajo o declaraciones de donación. Los retrasos en la presentación de estos documentos retrasarán los fondos hasta que se cumpla el requisito de cumplimiento.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras directamente en una cuenta bancaria sudafricana?",
      a: "Las cuentas estándar en ZAR no pueden mantener divisas extranjeras. Los controles de cambio del SARB exigen que la divisa extranjera entrante se convierta a ZAR. Sin embargo, algunos bancos ofrecen cuentas en divisas extranjeras (FCA) para personas y empresas que reciben pagos internacionales con regularidad. Las FCA están sujetas a la aprobación del SARB y a condiciones específicas. El destinatario debe consultar las opciones de FCA con su banco.",
    },
  ],

  ireland: [
    {
      q: "¿Qué es un código SWIFT para Irlanda?",
      a: "Un código SWIFT (también llamado BIC) es un identificador de 8 u 11 caracteres utilizado por los bancos irlandeses para transferencias internacionales. La parte del código de país es IE. Por ejemplo, AIBKIE2D es el código SWIFT del AIB (Allied Irish Banks). La estructura es: 4 caracteres para el banco, 2 para el país (IE), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos irlandeses?",
      a: "Los principales códigos SWIFT de bancos irlandeses incluyen: AIB — AIBKIE2D, Bank of Ireland — BOFIIEDD, Permanent TSB — IPBSIE2D, An Post Money — varios y Revolut Ireland — REVRIE21. Tenga en cuenta que Ulster Bank y KBC han abandonado el mercado irlandés — asegúrese de que el destinatario proporcione datos bancarios actuales. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Necesito un código SWIFT o solo un IBAN para transferencias a Irlanda?",
      a: "Para transferencias en EUR dentro de la zona SEPA, el IBAN irlandés (que comienza por IE, 22 caracteres) es suficiente — no se necesita código SWIFT/BIC. Para transferencias desde fuera de SEPA (como EE. UU., Canadá o Australia) o en una divisa no EUR, necesitará el código BIC/SWIFT del banco junto con el IBAN.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco irlandés?",
      a: "Puede encontrar el BIC/SWIFT de su banco irlandés en su extracto bancario, en su aplicación de banca en línea, en su tarjeta bancaria o buscando en esta página. Los bancos irlandeses también muestran el BIC junto al IBAN en sus portales de banca en línea. Si anteriormente usaba Ulster Bank o KBC, necesitará el código SWIFT de su nuevo banco tras la migración.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Irlanda?",
      a: "Las transferencias SEPA en EUR desde Europa suelen llegar en un día hábil (a menudo el mismo día con SEPA Instant). Las transferencias SWIFT desde fuera de SEPA suelen tardar entre uno y tres días hábiles. Las transferencias desde EE. UU. y Canadá a AIB o Bank of Ireland suelen liquidarse en uno o dos días hábiles.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Irlanda?",
      a: "Las transferencias SEPA en EUR suelen ser gratuitas o de muy bajo coste en los bancos irlandeses. Las transferencias SWIFT no SEPA pueden conllevar una comisión por transferencia entrante, normalmente de 5 a 12 EUR según el banco. Si la transferencia llega en una divisa no EUR (como USD o GBP), el banco convertirá al tipo de cambio propio. Algunos tipos de cuenta eximen las comisiones por transferencias entrantes.",
    },
    {
      q: "¿Han dejado de funcionar los códigos SWIFT de Ulster Bank y KBC en Irlanda?",
      a: "Sí. Ulster Bank y KBC Bank Ireland han abandonado el mercado irlandés y sus códigos SWIFT ya no procesan pagos. Los clientes que tenían cuentas en estos bancos han migrado a AIB, Bank of Ireland o Permanent TSB. Si anteriormente recibía transferencias internacionales en Ulster Bank o KBC, debe proporcionar al remitente el código SWIFT y el IBAN de su nuevo banco.",
    },
    {
      q: "¿Puedo recibir divisas distintas al EUR directamente en mi cuenta bancaria irlandesa?",
      a: "La mayoría de las cuentas bancarias irlandesas estándar están denominadas en EUR. Algunos bancos (especialmente AIB y Bank of Ireland para cuentas empresariales) ofrecen capacidades multidivisa. Si tiene una cuenta EUR estándar, las transferencias entrantes en divisas no EUR se convertirán al tipo de cambio del banco. Para recibos periódicos en divisas extranjeras, consulte con su banco las opciones de cuenta multidivisa.",
    },
  ],

  "new-zealand": [
    {
      q: "¿Qué es un código SWIFT para Nueva Zelanda?",
      a: "Un código SWIFT (BIC) para Nueva Zelanda es un identificador de 8 u 11 caracteres utilizado por los bancos neozelandeses para transferencias internacionales. La parte del código de país es NZ. Por ejemplo, ANZBNZ22 es el código SWIFT del ANZ New Zealand. La estructura es: 4 caracteres para el banco, 2 para el país (NZ), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos neozelandeses?",
      a: "Los principales códigos SWIFT de bancos neozelandeses incluyen: ANZ New Zealand — ANZBNZ22, ASB Bank — ASBBNZ2A, Bank of New Zealand (BNZ) — BKNZNZ22, Westpac New Zealand — WPACNZ2W, Kiwibank — KIABORZ22 y TSB Bank — TSBKNZ22. Confirme siempre el código exacto con el banco del destinatario antes de enviar.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco neozelandés?",
      a: "Puede encontrar el código SWIFT de su banco neozelandés en su extracto bancario, en su aplicación de banca por internet o móvil, contactando a su banco o buscando en esta página. ANZ, ASB, BNZ y Westpac muestran los códigos SWIFT en sus plataformas de banca en línea, en las secciones de pagos internacionales o detalles de cuenta.",
    },
    {
      q: "¿Qué datos de cuenta necesito para una transferencia internacional a Nueva Zelanda?",
      a: "Para transferencias bancarias internacionales a Nueva Zelanda, el remitente necesita: el código SWIFT/BIC del banco del destinatario y el número completo de cuenta neozelandesa. El número de cuenta de Nueva Zelanda tiene cuatro partes — número de banco (dos dígitos), número de sucursal (cuatro dígitos), número de cuenta (siete dígitos) y sufijo (dos a tres dígitos). No omita el sufijo, ya que puede provocar el rechazo del pago.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Nueva Zelanda?",
      a: "Las transferencias SWIFT a Nueva Zelanda suelen llegar en uno a tres días hábiles. Las transferencias desde Australia suelen liquidarse en un día hábil debido a las estrechas relaciones bancarias. Nueva Zelanda se encuentra en una zona horaria muy adelantada respecto a la mayoría de los centros financieros (UTC+12/+13), por lo que las transferencias enviadas al final del día hábil europeo o estadounidense pueden no procesarse hasta el siguiente día bancario en Nueva Zelanda.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Nueva Zelanda?",
      a: "Los bancos neozelandeses suelen cobrar una comisión por transferencia internacional entrante de 10 a 15 NZD por pago SWIFT. Si la transferencia llega en una divisa extranjera, el banco convierte a NZD al tipo publicado, que incluye un margen del 1 al 2% sobre el tipo de cambio de mercado. Para importes superiores a 10.000 NZD, el destinatario puede en ocasiones solicitar un tipo mejor al departamento de operaciones del banco.",
    },
    {
      q: "¿Cuál es la diferencia entre las transferencias domésticas en Nueva Zelanda y SWIFT?",
      a: "Las transferencias domésticas en Nueva Zelanda utilizan el formato número de banco-sucursal-cuenta-sufijo y se procesan a través del sistema de pagos doméstico de Nueva Zelanda. SWIFT es para transferencias transfronterizas internacionales mediante códigos BIC. Los sistemas domésticos no pueden recibir pagos del extranjero. Una vez que una transferencia SWIFT llega a un banco neozelandés, el banco acredita la cuenta del destinatario a través de sus sistemas internos.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras directamente en mi cuenta bancaria neozelandesa?",
      a: "La mayoría de las cuentas bancarias estándar de Nueva Zelanda están denominadas en NZD. ANZ, ASB, BNZ y Westpac ofrecen cuentas en divisas extranjeras que pueden mantener USD, AUD, GBP, EUR y otras divisas. Si recibe divisas extranjeras con regularidad, una cuenta en divisa extranjera evita la conversión automática al tipo del banco. De lo contrario, las divisas extranjeras entrantes se convierten a NZD en la fecha de liquidación.",
    },
  ],

  bangladesh: [
    {
      q: "¿Qué es un código SWIFT para Bangladés?",
      a: "Un código SWIFT (también llamado código BIC) es un identificador de 8 u 11 caracteres utilizado por los bancos bangladesíes para transferencias internacionales. Los primeros cuatro caracteres identifican el banco, los dos siguientes (BD) identifican Bangladés, los dos siguientes identifican la ciudad y los últimos tres opcionales identifican la sucursal. Por ejemplo, un código SWIFT que comience por SONBBD indica Sonali Bank, el mayor banco estatal de Bangladés.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos bangladesíes?",
      a: "Los principales códigos SWIFT incluyen: Sonali Bank — SONBBDDH, Islami Bank Bangladesh — IBBLBDDH, BRAC Bank — BRAKBDDH, Dutch-Bangla Bank — DBBLBDDH, Eastern Bank — EBLBBDDH, Standard Chartered Bangladesh — SCBLBDDX y Citibank Bangladesh — CITIBDDX. Confirme siempre el código exacto con el banco del destinatario, ya que los códigos a nivel de sucursal pueden diferir del código de la sede central.",
    },
    {
      q: "¿Necesito tanto un código SWIFT como un número de cuenta para enviar dinero a Bangladés?",
      a: "Sí. Para enviar una transferencia bancaria internacional a Bangladés, necesita el código SWIFT/BIC del banco del destinatario, el número completo de cuenta del destinatario, el nombre completo del destinatario tal como está registrado en el banco, y el nombre y la dirección de la sucursal bancaria. Bangladés no utiliza IBAN, por lo que el número de cuenta se proporciona directamente en lugar de en formato IBAN.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Bangladés?",
      a: "Las transferencias SWIFT a Bangladés suelen tardar entre uno y tres días hábiles. Las transferencias desde el Reino Unido y Oriente Medio — corredores importantes para los trabajadores bangladesíes — suelen llegar en uno o dos días hábiles. Las transferencias que involucran varios bancos corresponsales o que activan una revisión de cumplimiento en el Banco de Bangladés pueden tardar un día adicional. Algunos proveedores que utilizan redes de pago dedicadas a Bangladés liquidan el mismo día.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Bangladés?",
      a: "Los bancos bangladesíes suelen cobrar una comisión de gestión por remesa entrante, a menudo de unos 200 a 500 BDT por transacción. Sin embargo, el Banco de Bangladés ha eximido o reducido periódicamente las comisiones sobre las remesas de hogar para fomentar el uso de canales oficiales. El banco receptor convertirá la divisa extranjera a BDT al tipo de transferencia telegráfica vigente, que incluye un margen sobre el tipo interbancario.",
    },
    {
      q: "¿Qué es el sistema BEFTN y en qué se diferencia de SWIFT?",
      a: "BEFTN (Red de Transferencia Electrónica de Fondos de Bangladés) es el sistema de transferencia interbancaria doméstica de Bangladés — gestiona únicamente transferencias en BDT entre bancos bangladesíes y no puede recibir pagos internacionales. SWIFT se utiliza exclusivamente para transferencias transfronterizas. Si envía dinero desde el extranjero a una cuenta bancaria bangladesí, el pago viaja vía SWIFT al banco receptor, que luego acredita la cuenta a través de sus sistemas internos.",
    },
    {
      q: "¿Puedo recibir divisas extranjeras directamente en mi cuenta bancaria bangladesí?",
      a: "Las cuentas estándar en taka no pueden mantener divisas extranjeras. Las regulaciones del Banco de Bangladés exigen que todas las divisas extranjeras entrantes se conviertan a BDT al tipo vigente del banco. Si necesita mantener divisas extranjeras, puede abrir una cuenta en Moneda Extranjera (FC) en un banco bangladesí autorizado, lo que le permite recibir y mantener saldos en USD, GBP, EUR y ciertas otras divisas.",
    },
    {
      q: "¿Existe algún incentivo en efectivo por recibir remesas a través de canales oficiales en Bangladés?",
      a: "Sí. El Banco de Bangladés ha ofrecido periódicamente un incentivo en efectivo del 2 al 2,5% sobre las remesas entrantes recibidas a través de canales bancarios oficiales, incluidas las transferencias SWIFT. Este incentivo se paga en BDT por el banco del destinatario además del importe convertido. El plan está diseñado para animar a los bangladesíes en el extranjero a utilizar transferencias bancarias reguladas en lugar de redes informales de hawala.",
    },
  ],
  philippines: [
    {
      q: "¿Qué es un código SWIFT para Filipinas?",
      a: "Un código SWIFT (BIC) para Filipinas es un código de 8 u 11 caracteres que identifica a un banco filipino para transferencias internacionales. La parte del código de país es PH. Por ejemplo, ABORPH2X es el BIC de BDO Unibank, el banco filipino más grande. La estructura del código es: 4 caracteres para el banco, 2 para el país (PH), 2 para la ciudad o ubicación, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos filipinos?",
      a: "Los principales códigos SWIFT de bancos filipinos incluyen: BDO Unibank — ABORPH2X, Bank of the Philippine Islands (BPI) — BABORPHMXXX, Metropolitan Bank and Trust (Metrobank) — MABORPMM, Land Bank of the Philippines — TLBPPHMM, Philippine National Bank (PNB) — PNBMPHM1XXX, Security Bank — SBTCPHMMXXX, y UnionBank — UBPHPHMM. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cómo envío dinero a una cuenta bancaria filipina desde el extranjero?",
      a: "Para enviar una transferencia bancaria internacional a Filipinas, necesita: el código SWIFT/BIC del banco receptor, el número de cuenta completo del destinatario y el nombre completo del destinatario tal como está registrado en el banco. Filipinas no utiliza IBAN. Para transferencias desde EE. UU., muchos proveedores también ofrecen servicios directos a cuenta que utilizan redes de pago locales filipinas, lo que puede ser más rápido y económico que el enrutamiento SWIFT estándar.",
    },
    {
      q: "¿Puedo enviar dinero directamente a una billetera GCash o Maya desde el extranjero?",
      a: "GCash y Maya (PayMaya) no pueden recibir directamente transferencias SWIFT internacionales. Sin embargo, algunos proveedores internacionales de remesas (como Western Union, Remitly y WorldRemit) tienen asociaciones que permiten la entrega directa a billeteras GCash o Maya. Para transferencias internacionales entre bancos, necesita el código SWIFT y el número de cuenta del destinatario en un banco tradicional.",
    },
    {
      q: "¿Cuánto tiempo tarda una transferencia SWIFT a Filipinas?",
      a: "Las transferencias SWIFT a Filipinas suelen tardar de uno a tres días hábiles. Las transferencias desde EE. UU., Oriente Medio y Hong Kong — los principales corredores de OFW — generalmente llegan en uno o dos días hábiles. Las regulaciones del BSP exigen que los bancos receptores acrediten las remesas entrantes de manera oportuna. La entrega el mismo día o al día siguiente es posible a través de proveedores que utilizan redes de pago filipinas dedicadas.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Filipinas?",
      a: "Los bancos filipinos cobran una comisión por remesa entrante, normalmente entre USD 5 y 15 o un porcentaje del monto de la transferencia, deducido de los fondos recibidos. El BSP exige a los bancos que divulguen estas comisiones. El banco receptor convierte la moneda extranjera a PHP a su tipo de cambio comprador en la fecha de liquidación. Los proveedores que ofrecen entrega directa a cuenta a través de redes locales suelen tener costos totales más bajos que las transferencias SWIFT entre bancos.",
    },
    {
      q: "¿Cuál es la diferencia entre InstaPay, PESONet y SWIFT en Filipinas?",
      a: "InstaPay y PESONet son sistemas de pago domésticos filipinos: InstaPay gestiona transferencias en tiempo real de hasta PHP 50,000, mientras que PESONet gestiona transferencias por lotes para montos mayores. Ambos manejan únicamente PHP dentro de Filipinas. SWIFT es la red internacional para transferencias transfronterizas. El dinero enviado desde el extranjero viaja a través de SWIFT al banco del destinatario, que luego acredita la cuenta a través de su sistema interno.",
    },
    {
      q: "¿El BSP requiere documentación para transferencias entrantes de gran monto?",
      a: "Sí. Las regulaciones del BSP exigen que las transferencias entrantes de USD 10,000 o más vayan acompañadas de una declaración de propósito. El banco del destinatario solicitará documentación para transferencias clasificadas como ingresos comerciales, inversiones o producto de préstamos. Las remesas familiares personales generalmente se procesan sin requisitos adicionales. El incumplimiento de los informes del BSP puede resultar en que los fondos queden retenidos hasta que se aclare la situación.",
    },
  ],

  nigeria: [
    {
      q: "¿Qué es un código SWIFT para Nigeria?",
      a: "Un código SWIFT (BIC) para Nigeria es un código de 8 u 11 caracteres que identifica a un banco nigeriano para transferencias bancarias internacionales. La parte del código de país es NG. Por ejemplo, GTBINGLA es el BIC de Guaranty Trust Bank (GTBank). La estructura es: 4 caracteres para el banco, 2 para el país (NG), 2 para la ciudad, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos nigerianos?",
      a: "Los principales códigos SWIFT de bancos nigerianos incluyen: Access Bank — ABNGNGLA, Guaranty Trust Bank (GTBank) — GTBINGLA, Zenith Bank — ZEIBNGLA, First Bank of Nigeria — FBNINGLA, United Bank for Africa (UBA) — UNAFNGLA, Ecobank Nigeria — ECOCNGLA, y Fidelity Bank — FIDTNGLA. Verifique siempre el código exacto con el banco del destinatario antes de enviar.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir dinero del extranjero en Nigeria?",
      a: "Sí. Para recibir una transferencia bancaria internacional en Nigeria, el remitente necesita el código SWIFT/BIC de su banco junto con su número de cuenta. Nigeria no utiliza IBAN para cuentas domésticas. Proporcione siempre el código SWIFT, su número de cuenta completo, su nombre completo tal como está registrado en el banco y la dirección de la sucursal bancaria. Algunos bancos utilizan un único código SWIFT para todas las sucursales; otros pueden tener códigos específicos por sucursal.",
    },
    {
      q: "¿Puedo recibir USD directamente en una cuenta bancaria nigeriana?",
      a: "Sí, si dispone de una cuenta domiciliaria (cuenta en moneda extranjera) en un banco nigeriano. Las regulaciones del CBN permiten a personas físicas y empresas mantener y operar cuentas domiciliarias en USD, GBP, EUR y otras monedas aprobadas. Las transferencias entrantes en USD pueden acreditarse en una cuenta domiciliaria sin conversión obligatoria a naira. Las cuentas estándar en naira tendrán la moneda extranjera convertida a NGN al tipo de cambio oficial del banco.",
    },
    {
      q: "¿Cuánto tiempo tarda una transferencia SWIFT a Nigeria?",
      a: "Las transferencias SWIFT a Nigeria suelen tardar de uno a tres días hábiles. Los requisitos de cumplimiento del CBN implican que las transferencias de gran monto o las procedentes de ciertos orígenes pueden quedar retenidas para revisión, lo que añade un día hábil adicional. Las transferencias desde el Reino Unido, EE. UU. y Europa generalmente se liquidan en uno o dos días hábiles. Algunos proveedores de remesas ofrecen entregas más rápidas utilizando sus propias redes de pago nigerianas.",
    },
    {
      q: "¿Qué es NIBSS y en qué se diferencia de SWIFT?",
      a: "NIBSS (Nigeria Inter-Bank Settlement System) gestiona las transferencias domésticas en naira entre bancos nigerianos — es el equivalente al sistema ACH utilizado en otros países. NIBSS no puede recibir pagos internacionales. SWIFT se utiliza exclusivamente para transferencias internacionales transfronterizas. Si envía dinero desde el extranjero a una cuenta nigeriana, la transferencia viaja a través de SWIFT hasta el banco del destinatario.",
    },
    {
      q: "¿Existen regulaciones del CBN que afecten a las transferencias internacionales entrantes a Nigeria?",
      a: "Sí. El Banco Central de Nigeria exige que todas las transferencias extranjeras entrantes sean recibidas a través de una institución financiera autorizada. Las transferencias de gran monto pueden requerir documentación del propósito. El CBN ha ajustado periódicamente sus políticas de divisas, incluida la unificación de los tipos de cambio y los requisitos en torno a las cuentas domiciliarias. Los destinatarios deben consultar con su banco las directrices actuales del CBN antes de esperar una transferencia de gran monto.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Nigeria?",
      a: "Los bancos nigerianos suelen cobrar una comisión de procesamiento por transferencia entrante, a menudo alrededor de USD 10–25 o un pequeño porcentaje de la transferencia, según el banco y el monto de la transferencia. El tipo de conversión de USD a NGN puede variar significativamente entre bancos. Para transferencias de gran monto, puede valer la pena comparar el tipo de cambio efectivo (neto de comisiones y diferencial) entre diferentes bancos o proveedores de remesas.",
    },
  ],

  mexico: [
    {
      q: "¿Qué es un código SWIFT para México?",
      a: "Un código SWIFT (BIC) para México es un código de 8 u 11 caracteres que identifica a un banco mexicano para transferencias bancarias internacionales. La parte del código de país es MX. Por ejemplo, BCMRMXMM es el código SWIFT de Banorte (Banco Mercantil del Norte). La estructura es: 4 caracteres para el banco, 2 para el país (MX), 2 para la ciudad, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Qué es un número CLABE y necesito proporcionarlo junto con el código SWIFT?",
      a: "La CLABE (Clave Bancaria Estandarizada) es un identificador de cuenta de 18 dígitos utilizado en el sistema de pago doméstico SPEI de México. Para transferencias SWIFT internacionales a México, se requieren tanto el código SWIFT como el número CLABE del destinatario. El código SWIFT enruta el pago al banco correcto, mientras que la CLABE garantiza que llegue a la cuenta específica. Un número de cuenta estándar por sí solo no es aceptado — solicite siempre al destinatario su CLABE de 18 dígitos.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos mexicanos?",
      a: "Los principales códigos SWIFT de bancos mexicanos incluyen: BBVA México — BCMXMXMM, Banorte — BCMRMXMM, Santander México — BMSXMXMM, Citibanamex — BNMXMXMM, HSBC México — BIMEMXMM, y Scotiabank México — MBCOMXMM. Verifique siempre el código exacto con el banco del destinatario antes de enviar.",
    },
    {
      q: "¿Cuánto tiempo tarda una transferencia SWIFT a México?",
      a: "Las transferencias SWIFT a México suelen llegar en uno a tres días hábiles. Las transferencias desde Estados Unidos — el corredor más grande — frecuentemente se liquidan en un día hábil. El sistema SPEI procesa los fondos en tiempo real a nivel doméstico una vez que la transferencia internacional ha pasado el cumplimiento normativo del banco receptor. Algunos proveedores dedicados de EE. UU. a México ofrecen entrega el mismo día a cuentas bancarias.",
    },
    {
      q: "¿Puedo recibir USD en una cuenta bancaria mexicana?",
      a: "Sí. Muchos bancos mexicanos ofrecen cuentas denominadas en dólares (cuentas en dólares) que pueden recibir transferencias internacionales en USD sin conversión obligatoria a MXN. Si el destinatario tiene una cuenta estándar en MXN, el banco convertirá los USD entrantes a pesos al tipo de cambio publicado en la fecha de liquidación, que generalmente incluye un margen sobre el tipo de cambio de mercado.",
    },
    {
      q: "¿Qué es el sistema SPEI y es lo mismo que SWIFT?",
      a: "SPEI (Sistema de Pagos Electrónicos Interbancarios) es el sistema de pago interbancario doméstico en tiempo real de México, operado por el Banco de México. Gestiona transferencias en MXN entre bancos mexicanos utilizando números CLABE. SPEI es completamente independiente de SWIFT — no puede recibir pagos internacionales. SWIFT es para transferencias transfronterizas. Después de que una transferencia internacional llega por SWIFT, los fondos se liquidan internamente a través de SPEI utilizando la CLABE.",
    },
    {
      q: "¿Hay regulaciones de Banxico que deba conocer al recibir transferencias internacionales?",
      a: "El Banco de México (Banxico) regula el mercado de divisas. México tiene políticas cambiarias relativamente abiertas sin requisitos de conversión obligatoria para personas físicas. Sin embargo, los bancos deben reportar las transferencias entrantes superiores a USD 10,000 a la Unidad de Inteligencia Financiera (UIF) de México como parte de las regulaciones contra el lavado de dinero. Las transferencias comerciales de gran monto pueden requerir documentación del propósito. Las remesas familiares personales generalmente se procesan sin restricciones.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en México?",
      a: "Los bancos mexicanos suelen cobrar una comisión por transferencia entrante, a menudo entre MXN 200 y 500 o un porcentaje de la transferencia, según el banco. El diferencial de conversión de divisas es un costo implícito adicional. Para transferencias desde Estados Unidos, muchos proveedores de remesas dedicados ofrecen entrega directa a cuenta con comisión cero o muy baja, lo que resulta significativamente más económico que una transferencia bancaria tradicional.",
    },
  ],

  china: [
    {
      q: "¿Qué es un código SWIFT para China?",
      a: "Un código SWIFT (BIC) para China es un código de 8 u 11 caracteres que identifica a un banco chino para transferencias bancarias internacionales. La parte del código de país es CN. Por ejemplo, ICBKCNBJXXX es el código SWIFT de la sede del Industrial and Commercial Bank of China (ICBC). La estructura es: 4 caracteres para el banco, 2 para el país (CN), 2 para la ciudad, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos chinos?",
      a: "Los principales códigos SWIFT de bancos chinos incluyen: ICBC — ICBKCNBJ, Bank of China — BKCHCNBJ, China Construction Bank — PCBCCNBJ, Agricultural Bank of China — ABOCCNBJ, Bank of Communications — COMMCNSH, China Merchants Bank — CMBCCNBS, y CITIC Bank — CIBKCNBJ. Los códigos a nivel de sucursal se añaden como caracteres 9.º a 11.º. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cuáles son los controles de capital de China y cómo afectan a las transferencias SWIFT?",
      a: "China mantiene estrictos controles de capital bajo la Administración Estatal de Divisas (SAFE). Las personas físicas están limitadas a convertir el equivalente a USD 50,000 en moneda extranjera por año calendario. Las transferencias extranjeras entrantes que superen este umbral, o las realizadas con fines comerciales, requieren documentación y registro en SAFE. Las transferencias SWIFT están permitidas, pero el destinatario debe proporcionar una declaración de propósito, y los montos elevados pueden quedar retenidos pendientes de revisión de cumplimiento.",
    },
    {
      q: "¿Qué es CNAPS y cómo se relaciona con SWIFT?",
      a: "CNAPS (China National Advanced Payment System) es el sistema de pago interbancario doméstico de China, que gestiona las transferencias en RMB/CNY entre bancos chinos. Es completamente independiente de SWIFT. CIPS (Cross-Border Interbank Payment System) es la plataforma alternativa de liquidación internacional de China para pagos transfronterizos denominados en CNY. SWIFT gestiona las transferencias en monedas extranjeras hacia China, tras lo cual CNAPS enruta los fondos a la cuenta final.",
    },
    {
      q: "¿Debo enviar dinero a China en USD o en CNY?",
      a: "Para la mayoría de las transferencias entrantes, enviar en USD es común y aceptado por todos los principales bancos chinos. El banco del destinatario convierte los USD a CNY al tipo de cambio oficial. Alternativamente, si el remitente puede convertir a CNY en el extranjero, CIPS (Cross-Border Interbank Payment System) a veces puede liquidar más rápido que el enrutamiento SWIFT de múltiples saltos. Consulte las opciones con su proveedor de transferencias.",
    },
    {
      q: "¿Cuánto tiempo tarda una transferencia SWIFT a China?",
      a: "Las transferencias SWIFT a China suelen tardar de uno a tres días hábiles para los principales corredores de divisas. Las transferencias pueden tardar más si son marcadas para revisión de cumplimiento bajo las regulaciones de SAFE, especialmente para montos que se aproximen o superen el límite de conversión individual de USD 50,000. Proporcionar un propósito de pago claro y preciso en la referencia de la transferencia puede reducir los retrasos.",
    },
    {
      q: "¿Existen códigos SWIFT para ciudades específicas de China?",
      a: "Sí. Los códigos SWIFT de bancos chinos incluyen un código de ubicación de dos caracteres que representa la ciudad. Por ejemplo, ICBKCNBJXXX enruta a Pekín (BJ), mientras que ICBKCNSHXXX enruta a Shanghái (SH). Para la mayoría de las transferencias personales entrantes, el código SWIFT de la sede central (frecuentemente con el sufijo XXX) es suficiente, ya que los bancos enrutan los fondos internamente a la sucursal y cuenta del destinatario.",
    },
    {
      q: "¿Puedo recibir dinero en una cuenta en moneda extranjera en China?",
      a: "Sí. Los bancos chinos ofrecen cuentas en moneda extranjera (外汇账户) que pueden mantener USD, EUR, GBP y otras divisas principales. Sin embargo, las regulaciones de SAFE implican que convertir saldos por encima de la cuota anual individual requiere documentación. Para ingresos comerciales regulares en moneda extranjera, las empresas deben registrarse en SAFE y seguir procedimientos de declaración específicos antes de que los fondos puedan convertirse o repatriarse libremente.",
    },
  ],

  japan: [
    {
      q: "¿Qué es un código SWIFT para Japón?",
      a: "Un código SWIFT (BIC) para Japón es un código de 8 u 11 caracteres que identifica a un banco japonés para transferencias bancarias internacionales. La parte del código de país es JP. Por ejemplo, BOTKJPJTXXX es el código SWIFT del MUFG Bank (anteriormente Bank of Tokyo-Mitsubishi UFJ). La estructura es: 4 caracteres para el banco, 2 para el país (JP), 2 para la ciudad, y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos de Japón?",
      a: "Los principales códigos SWIFT de bancos japoneses incluyen: MUFG Bank — BOTKJPJT, Sumitomo Mitsui Banking Corporation (SMBC) — SMBCJPJT, Mizuho Bank — MHCBJPJT, Resona Bank — DIWAJPJT, Fukuoka Bank — FUKBJPJP, y Japan Post Bank — JPPYJPJT. Los bancos regionales tienen sus propios códigos SWIFT distintos de los megabancos. Confirme siempre con el banco específico del destinatario.",
    },
    {
      q: "¿Necesito un código de sucursal además del código SWIFT para una transferencia a Japón?",
      a: "Sí. Los bancos japoneses requieren tanto el código SWIFT como el código de sucursal del destinatario (店番号, tres dígitos) más el número de cuenta para las transferencias internacionales entrantes. El código de sucursal es diferente del identificador de ubicación del código SWIFT — es un número específico asignado a cada sucursal dentro del banco. El destinatario puede encontrar su código de sucursal en su tarjeta bancaria o en la aplicación de banca en línea.",
    },
    {
      q: "¿Qué es el Sistema Zengin y cómo se relaciona con SWIFT?",
      a: "El Sistema Zengin (全銀システム) es la red doméstica de liquidación interbancaria de Japón, que gestiona las transferencias en JPY entre bancos japoneses. Es completamente independiente de SWIFT y no puede recibir pagos internacionales. Cuando una transferencia SWIFT llega a un banco japonés, el banco la procesa a través de sus sistemas internos y acredita la cuenta del destinatario. Las transferencias domésticas en JPY entre cuentas bancarias japonesas utilizan Zengin, no SWIFT.",
    },
    {
      q: "¿Cuánto tiempo tarda una transferencia SWIFT a Japón?",
      a: "Las transferencias SWIFT a Japón suelen tardar de uno a tres días hábiles. Las transferencias desde Estados Unidos y Europa a los principales megabancos japoneses (MUFG, SMBC, Mizuho) generalmente llegan en uno o dos días hábiles. Las transferencias a bancos regionales pueden tardar un día adicional debido al enrutamiento interno. La zona horaria de Japón (UTC+9) implica que las transferencias enviadas a última hora del día hábil en EE. UU. pueden no ser procesadas por los bancos japoneses hasta el día siguiente.",
    },
    {
      q: "¿Qué comisiones cobran los bancos japoneses por recibir transferencias internacionales?",
      a: "Los bancos japoneses suelen cobrar una comisión de procesamiento de transferencia entrante de JPY 2,500–4,000 por transferencia. Además, si la transferencia implica una conversión de divisas, se aplica el tipo de cambio telegráfico del banco, que incluye un diferencial sobre el tipo de cambio de mercado. Para transferencias entrantes regulares, algunos proveedores utilizan redes de pago locales denominadas en JPY para evitar por completo las comisiones de transferencia bancaria.",
    },
    {
      q: "¿Puedo recibir USD o EUR directamente en mi cuenta bancaria japonesa?",
      a: "La mayoría de las cuentas bancarias japonesas estándar están denominadas en JPY, y las transferencias entrantes en moneda extranjera se convierten automáticamente a JPY. Sin embargo, los principales bancos como MUFG, SMBC y Mizuho ofrecen cuentas de depósito en moneda extranjera (外貨預金) que pueden mantener USD, EUR y otras divisas. Estas cuentas requieren una configuración separada en el banco.",
    },
    {
      q: "¿Es mejor usar un servicio de remesas o una transferencia SWIFT bancaria para enviar dinero a Japón?",
      a: "Para la mayoría de las transferencias personales, los proveedores especializados en remesas (como Wise, Revolut o Remitly) ofrecen tipos de cambio significativamente mejores y comisiones más bajas que las transferencias SWIFT entre bancos. Las comisiones de transferencia entrante de los bancos japoneses (JPY 2,500–4,000) más el diferencial de conversión pueden hacer que el SWIFT estándar resulte caro para montos pequeños. Los proveedores especializados suelen entregar en cuentas bancarias japonesas en un día hábil a un costo total más bajo.",
    },
  ],
  "south-korea": [
    {
      q: "¿Qué es un código SWIFT para Corea del Sur?",
      a: "Un código SWIFT (BIC) para Corea del Sur es un código de 8 u 11 caracteres que identifica un banco coreano para transferencias internacionales. La parte del código de país es KR. Por ejemplo, CZNBKRSE es el código SWIFT del KB Kookmin Bank. La estructura es: 4 caracteres para el banco, 2 para el país (KR), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos surcoreanos?",
      a: "Los principales códigos SWIFT de bancos surcoreanos son: KB Kookmin Bank — CZNBKRSE, Shinhan Bank — SHBKKRSE, KEB Hana Bank — KOEXKRSE, Woori Bank — HVBKKRSE, Industrial Bank of Korea (IBK) — IBKOKRSE, Nonghyup Bank — NACFKRSE y Citibank Korea — CITIKRSX. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cómo envío dinero a una cuenta bancaria surcoreana desde el extranjero?",
      a: "Para enviar una transferencia internacional a Corea del Sur, necesita: el código SWIFT/BIC del banco del destinatario, el número de cuenta completo del destinatario (entre 10 y 14 dígitos según el banco) y el nombre completo del destinatario en coreano o tal como está registrado en el banco. Corea del Sur no utiliza IBAN. Algunos proveedores exigen la fecha de nacimiento del destinatario para la verificación antilavado de dinero.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Corea del Sur?",
      a: "Las transferencias SWIFT a Corea del Sur suelen llegar en uno a tres días hábiles. Las transferencias desde Estados Unidos y Europa a los principales bancos coreanos generalmente se liquidan en uno o dos días hábiles. La zona horaria de Corea (UTC+9) significa que las transferencias enviadas tarde durante el día en EE. UU. pueden procesarse el siguiente día hábil coreano. Algunos proveedores ofrecen entrega el mismo día o al día siguiente utilizando redes locales de pago en Corea.",
    },
    {
      q: "¿Existen regulaciones financieras coreanas que afecten a las grandes transferencias entrantes?",
      a: "Sí. La Ley de Transacciones de Divisas de Corea del Sur exige que las transferencias entrantes superiores a 10 000 USD se notifiquen al Servicio de Aduanas de Corea. El banco del destinatario gestiona la notificación de forma automática. Para transferencias entrantes relacionadas con inversiones, puede ser necesario un registro adicional ante el Banco de Corea o el Ministerio de Economía y Finanzas. Las remesas personales se procesan generalmente sin pasos adicionales.",
    },
    {
      q: "¿Puedo recibir USD o EUR en una cuenta bancaria coreana?",
      a: "Sí. Los principales bancos coreanos ofrecen cuentas en moneda extranjera (외화 계좌) que pueden albergar USD, EUR, JPY y otras monedas principales. Las divisas entrantes pueden acreditarse en estas cuentas sin conversión obligatoria a KRW. Dado que el KRW no se negocia libremente fuera de Corea, los destinatarios que deseen mantener fondos en USD antes de convertirlos pueden beneficiarse de una cuenta en moneda extranjera.",
    },
    {
      q: "¿Qué es el sistema KFTC y en qué se diferencia de SWIFT?",
      a: "La red del Instituto de Telecomunicaciones y Compensación Financiera de Corea (KFTC) gestiona las transferencias interbancarias domésticas en won coreano, equivalente a los sistemas ACH de otros países. El KFTC no puede recibir pagos internacionales. SWIFT se utiliza para transferencias transfronterizas. Cuando una transferencia internacional llega a través de SWIFT a un banco coreano, el banco enruta los fondos internamente a la cuenta del destinatario mediante sus propios sistemas.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Corea del Sur?",
      a: "Los bancos coreanos suelen cobrar una comisión de transferencia internacional entrante de entre 5 000 y 15 000 KRW o un porcentaje del importe recibido. La conversión de divisas conlleva un diferencial adicional sobre el tipo de cambio de mercado. Para remesas personales, los proveedores especializados que utilizan redes locales de pago en Corea suelen ofrecer un coste total inferior al de una transferencia bancaria SWIFT estándar.",
    },
  ],

  thailand: [
    {
      q: "¿Qué es un código SWIFT para Tailandia?",
      a: "Un código SWIFT (BIC) para Tailandia es un código de 8 u 11 caracteres que identifica un banco tailandés para transferencias internacionales. La parte del código de país es TH. Por ejemplo, BKKBTHBK es el código SWIFT del Bangkok Bank. La estructura es: 4 caracteres para el banco, 2 para el país (TH), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos tailandeses?",
      a: "Los principales códigos SWIFT de bancos tailandeses son: Bangkok Bank — BKKBTHBK, Kasikornbank (KBank) — KASITHBK, Siam Commercial Bank (SCB) — SICOTHBK, Bank of Ayudhya / Krungsri — AYUDTHBK, Krungthai Bank — KRTHTHBK, TMBThanachart Bank (ttb) — TMBKTHBK y Citibank Thailand — CITITHTHX. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Puede PromptPay recibir transferencias internacionales?",
      a: "No. PromptPay es la red de pagos instantáneos doméstica de Tailandia, vinculada a números de identificación nacional y números de teléfono; solo gestiona transferencias en baht dentro de Tailandia y no puede recibir pagos SWIFT internacionales. Para transferencias internacionales, el remitente debe usar el código SWIFT del banco del destinatario junto con el número de cuenta bancaria tailandesa completo.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Tailandia?",
      a: "Las transferencias SWIFT a Tailandia suelen llegar en uno a tres días hábiles. Las transferencias desde los principales corredores, como Estados Unidos, Europa y Oriente Medio, generalmente se liquidan en uno o dos días hábiles en grandes bancos como Bangkok Bank y Kasikornbank. La zona horaria de Tailandia (UTC+7) significa que las transferencias enviadas tarde durante el día hábil en EE. UU. o Europa pueden no ser procesadas por los bancos tailandeses hasta el día siguiente.",
    },
    {
      q: "¿Qué regulaciones del Banco de Tailandia se aplican a las transferencias internacionales entrantes?",
      a: "Las regulaciones del Banco de Tailandia exigen que las transferencias extranjeras entrantes superiores al equivalente de 50 000 THB sean notificadas por el banco receptor mediante el Formulario de Transacción de Divisas (FET). Es posible que el destinatario deba proporcionar al banco una declaración del propósito de la transferencia (como remesa familiar, ingreso comercial o compra de propiedad). Las transferencias sin un propósito claro pueden retrasarse pendientes de aclaración.",
    },
    {
      q: "¿Puedo recibir USD o EUR directamente en una cuenta bancaria tailandesa?",
      a: "Sí. Los principales bancos tailandeses ofrecen cuentas de depósito en moneda extranjera (บัญชีเงินฝากเงินตราต่างประเทศ) que permiten recibir y mantener USD, EUR, GBP y otras monedas. Si el destinatario solo tiene una cuenta estándar en THB, el banco convertirá la divisa entrante a THB al tipo comprador vigente en la fecha de liquidación. El uso de una cuenta en moneda extranjera evita esta conversión automática.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Tailandia?",
      a: "Los bancos tailandeses suelen cobrar una comisión de transferencia entrante de entre 200 y 500 THB por transacción. El diferencial de conversión de divisas es un coste implícito adicional. Bangkok Bank, que cuenta con una sucursal dedicada en EE. UU. y una sólida infraestructura transfronteriza, suele recomendarse para transferencias de USD a THB. Los proveedores de remesas especializados que utilizan redes locales de pago en Tailandia pueden ofrecer un coste total inferior.",
    },
    {
      q: "¿Qué información debo proporcionar al remitente para una transferencia bancaria tailandesa?",
      a: "Proporcione al remitente: el código SWIFT de su banco (8 caracteres), su número de cuenta bancaria tailandesa completo (entre 10 y 12 dígitos), su nombre completo en inglés tal como está registrado en el banco, el nombre y la dirección de la sucursal del banco, y el propósito de la transferencia. Algunos bancos tailandeses también solicitan la dirección del destinatario. Para cumplir con las exigencias del Banco de Tailandia, asegúrese de que el propósito se indique con precisión en la referencia del pago.",
    },
  ],

  indonesia: [
    {
      q: "¿Qué es un código SWIFT para Indonesia?",
      a: "Un código SWIFT (BIC) para Indonesia es un código de 8 u 11 caracteres que identifica un banco indonesio para transferencias internacionales. La parte del código de país es ID. Por ejemplo, CENAIDJA es el código SWIFT del Bank Central Asia (BCA). La estructura es: 4 caracteres para el banco, 2 para el país (ID), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos indonesios?",
      a: "Los principales códigos SWIFT de bancos indonesios son: Bank Central Asia (BCA) — CENAIDJA, Bank Mandiri — BMRIIDJA, Bank Rakyat Indonesia (BRI) — BRINIDJA, Bank Negara Indonesia (BNI) — BNINIDJA, CIMB Niaga — BNIAIDJA, Bank Danamon — BDMNIDJA y Permata Bank — BBBAIDJA. Verifique siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cómo envío dinero a una cuenta bancaria indonesia desde el extranjero?",
      a: "Para enviar una transferencia internacional a Indonesia, necesita: el código SWIFT/BIC del banco del destinatario, el número de cuenta completo del destinatario (entre 10 y 16 dígitos según el banco) y el nombre completo del destinatario tal como está registrado en el banco. Indonesia no utiliza IBAN. En algunos bancos también se requiere el código de sucursal; solicite al destinatario que lo confirme con su banco.",
    },
    {
      q: "¿Qué es BI-FAST y en qué se diferencia de SWIFT?",
      a: "BI-FAST es el sistema de pagos domésticos en tiempo real del Banco de Indonesia, lanzado en 2021. Gestiona transferencias en rupias indonesias (IDR) entre bancos indonesios las 24 horas, los 7 días de la semana. BI-FAST no puede recibir pagos internacionales. SWIFT se utiliza para transferencias transfronterizas. Cuando una transferencia SWIFT llega a un banco indonesio, el banco la procesa internamente y acredita la cuenta del destinatario.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Indonesia?",
      a: "Las transferencias SWIFT a Indonesia suelen llegar en uno a tres días hábiles. Las transferencias desde los principales corredores (Malasia, Singapur, Oriente Medio, Europa) generalmente se liquidan en uno o dos días hábiles. La zona horaria de Indonesia (UTC+7 para Java/Bali, UTC+8 para Kalimantan, UTC+9 para Indonesia Oriental) significa que las transferencias enviadas tarde durante el día hábil europeo o estadounidense pueden procesarse el siguiente día hábil indonesio.",
    },
    {
      q: "¿Existen regulaciones del Banco de Indonesia que afecten a las grandes transferencias entrantes?",
      a: "Sí. Las regulaciones del Banco de Indonesia exigen la notificación de transferencias en divisas superiores al equivalente de 25 000 USD. El banco receptor gestiona la notificación. Para transferencias comerciales o relacionadas con inversiones, se requiere documentación de respaldo. Las remesas personales generalmente se procesan sin pasos adicionales, aunque el banco puede solicitar una breve declaración del propósito por motivos de cumplimiento.",
    },
    {
      q: "¿Puedo recibir USD u otras monedas extranjeras en una cuenta bancaria indonesia?",
      a: "Sí. La mayoría de los principales bancos indonesios ofrecen cuentas en moneda extranjera (rekening valuta asing) que pueden recibir y mantener USD, SGD, EUR y otras monedas. Las cuentas estándar en IDR convertirán automáticamente las divisas entrantes a rupias. Dado que la IDR no es entregable fuera de Indonesia, el uso del sistema bancario formal es esencial para recibir transferencias internacionales.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Indonesia?",
      a: "Los bancos indonesios suelen cobrar una comisión de procesamiento de transferencia entrante de entre 50 000 y 150 000 IDR por transacción. La conversión de divisas conlleva un diferencial adicional sobre el tipo de cambio de mercado. Los proveedores especializados con redes locales de pago en Indonesia (asociados con BCA, Mandiri o BRI) pueden ofrecer un coste total inferior y una liquidación más rápida que una transferencia bancaria SWIFT estándar.",
    },
  ],

  malaysia: [
    {
      q: "¿Qué es un código SWIFT para Malasia?",
      a: "Un código SWIFT (BIC) para Malasia es un código de 8 u 11 caracteres que identifica un banco malayo para transferencias internacionales. La parte del código de país es MY. Por ejemplo, MABORYMM es el código SWIFT del Maybank (Malayan Banking Berhad). La estructura es: 4 caracteres para el banco, 2 para el país (MY), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos malasios?",
      a: "Los principales códigos SWIFT de bancos malasios son: Maybank — MABORYMM, CIMB Bank — CIBBMYKL, Public Bank — PBBEMYKL, RHB Bank — RHBBMYKL, Hong Leong Bank — HLBBMYKL, AmBank — ARBKMYKL y Standard Chartered Malaysia — SCBLMYKXXXX. Las filiales de banca islámica tienen códigos SWIFT independientes; por ejemplo, Maybank Islamic es distinto del Maybank convencional.",
    },
    {
      q: "¿Puede DuitNow recibir transferencias internacionales?",
      a: "No. DuitNow es la red de pagos instantáneos doméstica de Malasia, vinculada a números de MYKAD (identificación nacional) y números de teléfono. DuitNow solo gestiona transferencias en MYR dentro de Malasia y no puede recibir pagos SWIFT internacionales. Para transferencias internacionales entrantes, el remitente debe usar el código SWIFT del banco del destinatario junto con el número de cuenta bancaria malaya completo.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Malasia?",
      a: "Las transferencias SWIFT a Malasia suelen llegar en uno a tres días hábiles. Las transferencias desde Singapur y otros países de la ASEAN suelen liquidarse en un día hábil debido a las estrechas relaciones entre los bancos corresponsales. La zona horaria de Malasia (UTC+8) significa que las transferencias enviadas tarde durante el día hábil europeo o estadounidense pueden procesarse el siguiente día hábil malayo.",
    },
    {
      q: "¿Existen regulaciones del Banco Negara Malaysia (BNM) sobre las transferencias entrantes?",
      a: "Sí. Las normas de Administración de Divisas (FEA) del BNM exigen que los residentes declaren el propósito de las transferencias extranjeras entrantes superiores al equivalente de 10 000 MYR. El banco receptor tramita la declaración, pero el destinatario puede necesitar aportar documentación para transferencias comerciales, de inversión o relacionadas con préstamos. Las remesas familiares personales generalmente se procesan sin requisitos adicionales.",
    },
    {
      q: "¿Puedo recibir moneda extranjera directamente en una cuenta bancaria malaya?",
      a: "Sí. La mayoría de los bancos malasios ofrecen cuentas en moneda extranjera (akaun mata wang asing) que pueden recibir y mantener USD, SGD, EUR, GBP y otras monedas. Las regulaciones del BNM permiten a los residentes mantener cuentas en moneda extranjera. El ringgit malayo (MYR) no se negocia libremente en el extranjero, por lo que las divisas extranjeras recibidas en una cuenta MYR estándar se convierten automáticamente al tipo comprador del banco.",
    },
    {
      q: "¿Cuál es la diferencia entre un código SWIFT de un banco islámico y uno de un banco convencional en Malasia?",
      a: "Malasia cuenta con entidades jurídicas independientes para la banca islámica y la convencional. Un banco como Maybank tiene tanto Maybank Berhad (convencional) como Maybank Islamic Berhad, cada uno con su propio código SWIFT. Si la cuenta del destinatario está en Maybank Islamic, debe utilizarse el código SWIFT islámico. Confirme siempre con el destinatario qué entidad gestiona su cuenta.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Malasia?",
      a: "Los bancos malasios suelen cobrar una comisión de transferencia internacional entrante de entre 10 y 30 MYR por transacción. La conversión de divisas incluye un diferencial adicional. Para remesas frecuentes desde Singapur —el mayor corredor con Malasia— muchos proveedores ofrecen entrega directa a cuenta utilizando redes locales de pago en MYR que evitan el enrutamiento SWIFT estándar y reducen el coste total.",
    },
  ],

  brazil: [
    {
      q: "¿Qué es un código SWIFT para Brasil?",
      a: "Un código SWIFT (BIC) para Brasil es un código de 8 u 11 caracteres que identifica un banco brasileño para transferencias internacionales. La parte del código de país es BR. Por ejemplo, BRASBRRJSPO es un código SWIFT del Banco do Brasil en São Paulo. La estructura es: 4 caracteres para el banco, 2 para el país (BR), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos brasileños?",
      a: "Los principales códigos SWIFT de bancos brasileños son: Banco do Brasil — BRASBRRJ, Itaú Unibanco — ITAUBRSP, Bradesco — BBDEBRSP, Santander Brasil — BSCHBRSP, Caixa Econômica Federal — CEFXBRSP y Nubank — NUBKBRSP. Pueden existir varios códigos SWIFT por banco para diferentes ciudades. Confirme siempre con el banco del destinatario.",
    },
    {
      q: "¿Puede Pix recibir transferencias internacionales?",
      a: "No. Pix es el sistema de pagos instantáneos doméstico de Brasil, que opera las 24 horas, los 7 días de la semana, de forma gratuita para particulares. Solo gestiona transferencias en BRL entre instituciones financieras brasileñas y no puede recibir pagos SWIFT internacionales. Para transferencias internacionales entrantes, el remitente debe usar el código SWIFT del banco del destinatario. Algunos proveedores están desarrollando puentes entre transferencias internacionales y pagos Pix, pero aún no existe una ruta SWIFT-a-Pix directa para transferencias bancarias estándar.",
    },
    {
      q: "¿Qué es el IOF y cómo afecta a la recepción de una transferencia SWIFT en Brasil?",
      a: "El IOF (Imposto sobre Operações Financeiras) es un impuesto brasileño sobre operaciones financieras que se aplica a las transacciones de divisas. Para remesas personales entrantes, la tasa del IOF es normalmente del 0,38 % del equivalente en BRL. Las transferencias comerciales, de préstamos o de inversión pueden estar sujetas a tasas de IOF diferentes. El banco receptor deduce el IOF automáticamente antes de acreditar la cuenta. Esto es independiente de cualquier comisión bancaria de procesamiento.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Brasil?",
      a: "Las transferencias SWIFT a Brasil suelen tardar entre dos y cuatro días hábiles debido a los requisitos de cumplimiento del BCB y al proceso obligatorio de contratación de divisas. Todas las divisas extranjeras entrantes deben contratarse formalmente a través de un intermediario autorizado (el banco receptor), lo que añade un paso de procesamiento no presente en la mayoría de los demás países. Las transferencias comerciales con documentación generalmente se procesan más rápido que las transferencias personales sin documentación.",
    },
    {
      q: "¿Cuál es el requisito de Natureza (código de propósito) para las transferencias a Brasil?",
      a: "El Banco Central de Brasil exige que cada transferencia de moneda extranjera entrante tenga asignada una Natureza (código de propósito) que describa el tipo de transacción: remesa familiar, pago de servicios, importación de bienes, inversión, etc. El banco receptor presenta esta información ante el BCB. Si la Natureza declarada no coincide con la transacción real, el banco puede congelar los fondos pendientes de aclaración. Asegúrese siempre de que la referencia de pago de su transferencia coincida con el propósito real.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Brasil?",
      a: "Los bancos brasileños suelen cobrar una comisión de contratación de divisas (diferencial) y pueden cobrar una comisión de procesamiento de transferencia entrante. El coste total de recibir una transferencia SWIFT en BRL incluye el diferencial del tipo de cambio del banco (generalmente entre el 1 % y el 3 % sobre el tipo de mercado), más el impuesto IOF (0,38 % para remesas personales), más cualquier comisión de servicio bancario. Comparar los costes totales entre proveedores —y no solo el tipo de cambio anunciado— es importante para las transferencias a Brasil.",
    },
    {
      q: "¿Puedo recibir USD o EUR en una cuenta bancaria brasileña?",
      a: "Los residentes en Brasil generalmente no pueden mantener saldos en moneda extranjera en cuentas domésticas; las regulaciones del BCB exigen la conversión a BRL. Existen excepciones para determinadas cuentas de no residentes y operaciones de comercio exterior. Las empresas que operan regularmente en moneda extranjera pueden solicitar autorizaciones específicas del BCB. Para remesas personales estándar, la moneda extranjera siempre se convierte a BRL al momento de la recepción.",
    },
  ],
  kenya: [
    {
      q: "¿Qué es un código SWIFT para Kenia?",
      a: "Un código SWIFT (BIC) para Kenia es un código de 8 u 11 caracteres que identifica a un banco keniano para transferencias bancarias internacionales. La parte del código de país es KE. Por ejemplo, KCBLKENX es un código SWIFT para Kenya Commercial Bank (KCB). La estructura es: 4 caracteres para el banco, 2 para el país (KE), 2 para la ciudad y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos kenianos?",
      a: "Los principales códigos SWIFT de bancos kenianos incluyen: Kenya Commercial Bank (KCB) — KCBLKENX, Equity Bank — EQBLKENA, Cooperative Bank of Kenya — COOPKENAXXX, NCBA Bank — CBAFKENAXXX, Stanbic Kenya — SBICKENX, Absa Kenya — BARCKENX, y Standard Chartered Kenya — SCBLKENX. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Puede M-Pesa recibir transferencias bancarias internacionales SWIFT directamente?",
      a: "No. M-Pesa es una red de dinero móvil y no puede recibir transferencias bancarias internacionales SWIFT directamente. Para transferencias bancarias internacionales de banco a banco, el remitente debe usar el código SWIFT y el número de cuenta del banco del destinatario. Sin embargo, muchos proveedores de remesas internacionales (Western Union, WorldRemit, Remitly) pueden entregar fondos a billeteras M-Pesa a través de sus propias redes, lo cual es independiente de una transferencia SWIFT.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Kenia?",
      a: "Las transferencias SWIFT a Kenia suelen llegar en uno a tres días hábiles. Las transferencias desde el Reino Unido y los Estados Unidos — los principales corredores para la diáspora keniana — generalmente se liquidan en uno a dos días hábiles. La entrega el mismo día es posible en ocasiones para transferencias enviadas temprano en el día hábil a bancos importantes como KCB o Equity Bank. Las entregas a M-Pesa a través de redes de proveedores de remesas pueden ser casi instantáneas.",
    },
    {
      q: "¿Puedo recibir USD u otras divisas extranjeras en una cuenta bancaria keniana?",
      a: "Sí. El Banco Central de Kenia permite a personas físicas y empresas tener Cuentas en Moneda Extranjera (FCA) en bancos kenianos autorizados. Las transferencias entrantes en USD, EUR y GBP pueden acreditarse directamente en una FCA sin conversión obligatoria a KES. Esto es especialmente útil para destinatarios que reciben pagos extranjeros con regularidad y desean evitar la conversión a tasas potencialmente desfavorables.",
    },
    {
      q: "¿Existen regulaciones del CBK que afecten a las grandes transferencias entrantes a Kenia?",
      a: "Sí. El Banco Central de Kenia exige que las grandes entradas de divisas extranjeras se reporten con fines de balanza de pagos. Las transferencias destinadas a propósitos específicos (inversión, compra de propiedades, negocios) pueden requerir documentación. Para remesas personales por debajo de USD 10,000, el proceso es generalmente sencillo. Los bancos kenianos están obligados a realizar verificaciones KYC (Conoce a tu Cliente) y pueden solicitar documentación para transacciones inusuales o de gran importe.",
    },
    {
      q: "¿Cuál es la diferencia entre recibir dinero por SWIFT y a través de un proveedor de dinero móvil?",
      a: "Las transferencias SWIFT van de banco a banco y requieren que el destinatario tenga una cuenta bancaria keniana con código SWIFT. Son más adecuadas para importes mayores (superiores a USD 500) y pagos empresariales. Los proveedores de dinero móvil como M-Pesa aceptan remesas internacionales a través de redes de proveedores de remesas (no SWIFT directamente) y son más apropiados para transferencias personales pequeñas y frecuentes a destinatarios sin cuentas bancarias formales.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Kenia?",
      a: "Los bancos kenianos suelen cobrar una comisión de procesamiento de transferencias entrantes de KES 500–2,000 por transacción, según el banco y el importe. La conversión de divisas incluye un diferencial adicional. Para transferencias desde el Reino Unido y los Estados Unidos, los proveedores que utilizan redes de pago de dinero móvil o bancos locales suelen ofrecer mejor valor que el SWIFT bancario estándar para importes inferiores a USD 1,000.",
    },
  ],

  ghana: [
    {
      q: "¿Qué es un código SWIFT para Ghana?",
      a: "Un código SWIFT (BIC) para Ghana es un código de 8 u 11 caracteres que identifica a un banco ghanés para transferencias bancarias internacionales. La parte del código de país es GH. Por ejemplo, GHCBGHAC es el código SWIFT de GCB Bank (antes Ghana Commercial Bank). La estructura es: 4 caracteres para el banco, 2 para el país (GH), 2 para la ciudad y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos ghaneses?",
      a: "Los principales códigos SWIFT de bancos ghaneses incluyen: GCB Bank — GHCBGHAC, Ecobank Ghana — ECOCGHAC, Stanbic Bank Ghana — SBICGHAC, Absa Bank Ghana — BARCGHAC, Standard Chartered Ghana — SCBLGHAC, y Fidelity Bank Ghana — FIDLGHAC. Confirme siempre el código exacto con el banco del destinatario, ya que los códigos pueden variar por sucursal.",
    },
    {
      q: "¿Puede el dinero móvil (MTN MoMo, Vodafone Cash) recibir transferencias SWIFT internacionales?",
      a: "No. Las plataformas de dinero móvil ghanesas como MTN MoMo y Vodafone Cash no pueden recibir transferencias bancarias internacionales SWIFT directamente. Para transferencias bancarias internacionales de banco a banco, el remitente debe usar el código SWIFT y el número de cuenta del banco del destinatario. Sin embargo, algunos proveedores de remesas (como WorldRemit y Remitly) pueden entregar fondos a billeteras móviles a través de sus propias redes de pago.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Ghana?",
      a: "Las transferencias SWIFT a Ghana suelen llegar en uno a tres días hábiles. Las transferencias desde los principales corredores (Reino Unido, Estados Unidos, Países Bajos — donde residen importantes comunidades de la diáspora ghanesa) generalmente se liquidan en uno a dos días hábiles. Algunas transferencias pueden retenerse brevemente para el cumplimiento de informes del Banco de Ghana, especialmente para importes superiores a USD 10,000.",
    },
    {
      q: "¿Puedo recibir USD u otras divisas extranjeras en una cuenta bancaria ghanesa?",
      a: "Sí. La mayoría de los principales bancos ghaneses ofrecen cuentas domiciliarias (cuentas en moneda extranjera) que pueden recibir y mantener USD, GBP y EUR. El Banco de Ghana permite a los particulares tener cuentas en moneda extranjera. Si el destinatario tiene una cuenta estándar en GHS, la moneda extranjera entrante se convierte automáticamente a cedis a la tasa de compra del banco. Dado que el GHS ha experimentado una depreciación significativa, mantener los fondos en una cuenta domiciliaria antes de convertirlos puede ser ventajoso en algunos casos.",
    },
    {
      q: "¿Existen regulaciones del Banco de Ghana que afecten a las transferencias entrantes?",
      a: "Sí. El Banco de Ghana exige informes estadísticos de todas las transferencias extranjeras entrantes. Las transferencias superiores a USD 10,000 requieren una declaración de propósito. Las transferencias relacionadas con negocios o inversiones requieren documentación. Los bancos receptores se encargan del cumplimiento normativo, pero el destinatario puede necesitar proporcionar una breve explicación del propósito de la transferencia para importes elevados.",
    },
    {
      q: "¿Cuál es la situación del tipo de cambio para recibir dinero en Ghana?",
      a: "El cedi ghanés (GHS) se ha depreciado significativamente frente a las principales divisas en los últimos años, lo que significa que los destinatarios reciben más cedis por dólar o libra con el tiempo — aunque el poder adquisitivo en Ghana también se ha visto afectado por la inflación. Los remitentes deben comparar el tipo de cambio efectivo (incluido el diferencial bancario) en lugar de basarse únicamente en la tasa anunciada al elegir un proveedor.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Ghana?",
      a: "Los bancos ghaneses suelen cobrar una comisión de procesamiento de transferencias entrantes, a menudo GHS 50–200 o un pequeño porcentaje del importe. La conversión de divisas incluye un diferencial adicional sobre la tasa de mercado interbancario. Para remesas personales de menor cuantía, los proveedores especializados con redes de pago locales en GHS suelen ofrecer mejor valor que las transferencias SWIFT bancarias estándar.",
    },
  ],

  "sri-lanka": [
    {
      q: "¿Qué es un código SWIFT para Sri Lanka?",
      a: "Un código SWIFT (BIC) para Sri Lanka es un código de 8 u 11 caracteres que identifica a un banco de Sri Lanka para transferencias bancarias internacionales. La parte del código de país es LK. Por ejemplo, BCEYLKLX es el código SWIFT del Bank of Ceylon, el banco estatal más grande de Sri Lanka. La estructura es: 4 caracteres para el banco, 2 para el país (LK), 2 para la ciudad y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos de Sri Lanka?",
      a: "Los principales códigos SWIFT de bancos de Sri Lanka incluyen: Bank of Ceylon — BCEYLKLX, Commercial Bank of Ceylon — CABORLKLXXX, Hatton National Bank (HNB) — HABORLKLXXX, Sampath Bank — BSAMLKLX, People's Bank — PEBLLKLX, Nations Trust Bank — NTBCLKLX, y Standard Chartered Sri Lanka — SCBLLKLX. Verifique siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cómo envío dinero a una cuenta bancaria de Sri Lanka desde el extranjero?",
      a: "Para realizar una transferencia bancaria internacional a Sri Lanka, necesita: el código SWIFT/BIC del banco del destinatario, el número de cuenta completo del destinatario y el nombre completo del destinatario tal como está registrado en el banco. Sri Lanka no utiliza IBAN. Algunos bancos de Sri Lanka también requieren la dirección de la sucursal y una declaración de propósito de la remesa. Pida siempre al destinatario que confirme todos los datos con su banco.",
    },
    {
      q: "¿Qué es la cuenta NRFC y cómo ayuda a los esrilanqueses en el extranjero?",
      a: "Una cuenta NRFC (Non-Resident Foreign Currency / Cuenta en Moneda Extranjera para No Residentes) es un tipo especial de cuenta que ofrecen los bancos de Sri Lanka a los esrilanqueses no residentes y expatriados. Las cuentas NRFC pueden recibir transferencias en moneda extranjera entrante y mantener saldos en USD, GBP, EUR u otras divisas sin conversión obligatoria a LKR. Esto es ventajoso para los esrilanqueses que trabajan en el extranjero y desean mantener ahorros en moneda extranjera en su país.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Sri Lanka?",
      a: "Las transferencias SWIFT a Sri Lanka suelen llegar en uno a tres días hábiles. Las transferencias desde los principales corredores (Oriente Medio, Reino Unido, Italia y Corea del Sur — destinos importantes para los trabajadores esrilanqueses) generalmente se liquidan en uno a dos días hábiles. La revisión de cumplimiento del CBSL puede añadir un día para transferencias grandes o inusuales.",
    },
    {
      q: "¿Existen regulaciones del CBSL que afecten a las transferencias entrantes?",
      a: "Sí. El Banco Central de Sri Lanka (CBSL) exige que todas las transferencias extranjeras entrantes se reciban a través de bancos autorizados y se declaren con fines de balanza de pagos. Sri Lanka ha endurecido periódicamente las normas de cambio de divisas en periodos de tensión económica. El uso de canales bancarios oficiales (transferencias SWIFT a bancos autorizados) garantiza el cumplimiento normativo y ayuda a los destinatarios a acceder a las divisas sin problemas.",
    },
    {
      q: "¿Puedo recibir dinero en LKR o en moneda extranjera en Sri Lanka?",
      a: "Las cuentas estándar en LKR reciben transferencias en moneda extranjera convertidas a rupias a la tasa del banco en la fecha de liquidación. Las cuentas NRFC reciben y mantienen moneda extranjera antes de la conversión. Las Cuentas de Remesas Entrantes (IRA) también permiten la retención temporal de moneda extranjera. Para transferencias de gran importe, el momento de la conversión a LKR puede afectar significativamente el monto recibido en rupias.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Sri Lanka?",
      a: "Los bancos de Sri Lanka suelen cobrar una comisión de procesamiento de remesas entrantes, a menudo LKR 500–1,500 por transacción o un pequeño porcentaje del importe. El diferencial del tipo de cambio es un coste implícito adicional. Para remesas personales, el gobierno de Sri Lanka ha fomentado el uso de canales bancarios oficiales ofreciendo incentivos en el tipo de cambio en distintos momentos — consulte la guía actual del CBSL antes de enviar.",
    },
  ],

  nepal: [
    {
      q: "¿Qué es un código SWIFT para Nepal?",
      a: "Un código SWIFT (BIC) para Nepal es un código de 8 u 11 caracteres que identifica a un banco nepalés para transferencias bancarias internacionales. La parte del código de país es NP. Por ejemplo, NABILNPA es el código SWIFT de Nabil Bank, uno de los bancos comerciales más grandes de Nepal. La estructura es: 4 caracteres para el banco, 2 para el país (NP), 2 para la ciudad y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos nepaleses?",
      a: "Los principales códigos SWIFT de bancos nepaleses incluyen: Nabil Bank — NABILNPA, Standard Chartered Nepal — SCBLNPKA, Nepal Investment Mega Bank — NIBLNPKA, Himalayan Bank — HIMANPKA, Everest Bank — EVBLNPKA, NMB Bank — NMBNPKKA, y Prabhu Bank — PRBLNPKA. Confirme siempre el código exacto con el banco del destinatario, ya que los códigos a nivel de sucursal pueden variar.",
    },
    {
      q: "¿Cómo llegan a Nepal las remesas desde los países del Golfo y Malasia mediante SWIFT?",
      a: "Nepal tiene una gran población trabajando en Qatar, Emiratos Árabes Unidos, Arabia Saudita, Kuwait y Malasia. Cuando estos trabajadores envían dinero a casa, las transferencias pueden realizarse vía SWIFT desde el banco del Golfo o de Malasia al banco nepalés del destinatario. Alternativamente, muchos operadores de transferencia de dinero autorizados (Western Union, IME, Prabhu Money) tienen redes de pago dedicadas para Nepal que pueden ser más rápidas y baratas que el SWIFT de banco a banco para importes menores.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Nepal?",
      a: "Las transferencias SWIFT a Nepal suelen llegar en uno a tres días hábiles. Las transferencias desde India a veces pueden liquidarse más rápido por la proximidad geográfica y las sólidas relaciones de corresponsalía, mientras que las transferencias desde Europa o Norteamérica pueden tardar dos o tres días hábiles. La revisión de cumplimiento del Nepal Rastra Bank (NRB) es generalmente ágil para las remesas personales, que son una entrada económica de importancia nacional.",
    },
    {
      q: "¿Tiene Nepal un sistema de pago doméstico similar a SWIFT?",
      a: "Sí. ConnectIPS es el sistema de pagos interbancarios doméstico de Nepal, operado bajo la supervisión del Nepal Rastra Bank. Gestiona las transferencias en NPR entre bancos nepaleses. ConnectIPS es completamente independiente de SWIFT y no puede recibir pagos internacionales. Una vez que una transferencia SWIFT llega a un banco nepalés, el banco acredita la cuenta del destinatario a través de sus sistemas internos.",
    },
    {
      q: "¿Existen regulaciones del Nepal Rastra Bank (NRB) sobre las remesas entrantes?",
      a: "Las regulaciones del NRB exigen que todas las divisas extranjeras recibidas mediante SWIFT se conviertan a rupias nepalesas (NPR) en un plazo de tres meses, salvo que se mantengan en una Cuenta en Moneda Extranjera (FCA) aprobada por el NRB. El NRB establece una tasa de referencia diaria para el NPR frente al USD (y otras divisas), y la tasa de conversión del banco receptor se basa en esta referencia. Las transferencias irregulares o de gran importe pueden requerir documentación del propósito.",
    },
    {
      q: "¿Está el NPR vinculado al INR y afecta esto a cómo debo enviar dinero?",
      a: "Sí. La rupia nepalesa (NPR) está vinculada a la rupia india (INR) a una tasa fija de NPR 1,6 por INR 1. Esto significa que los tipos de cambio USD/NPR efectivamente siguen los movimientos del USD/INR. Para los remitentes en India, transferir INR a Nepal es sencillo dada la tasa fija. Para los remitentes en USD o EUR, la conversión se realiza a través del tipo USD/NPR derivado del vínculo con el INR.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Nepal?",
      a: "Los bancos nepaleses suelen cobrar una comisión de procesamiento de transferencias entrantes, a menudo NPR 200–1,000 por transacción. La conversión de divisas incluye un diferencial adicional. Para remesas personales — especialmente desde el Golfo — los servicios de remesas especializados como IME, Prabhu Money u operadores internacionales como Western Union y Remitly suelen ofrecer una entrega más rápida y un coste total menor que el SWIFT de banco a banco.",
    },
  ],

  turkiye: [
    {
      q: "¿Qué es un código SWIFT para Türkiye?",
      a: "Un código SWIFT (BIC) para Türkiye es un código de 8 u 11 caracteres que identifica a un banco turco para transferencias bancarias internacionales. La parte del código de país es TR. Por ejemplo, TGBATRIS es el código SWIFT de Garanti BBVA. La estructura es: 4 caracteres para el banco, 2 para el país (TR), 2 para la ciudad y opcionalmente 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos turcos?",
      a: "Los principales códigos SWIFT de bancos turcos incluyen: Garanti BBVA — TGBATRIS, Türkiye İş Bankası — ISBKTRIS, Akbank — AKBKTRIS, Yapı Kredi — YAPITRIS, Ziraat Bankası — TCZBTR2A, Halkbank — TRHBTR2A, Vakıfbank — TVBATR2A, y HSBC Turkey — HSBCTRIS. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cuál es el formato IBAN de Turquía para transferencias internacionales?",
      a: "Los IBAN turcos tienen 26 caracteres: TR seguido de 2 dígitos de control, 5 dígitos de identificación del banco y 17 dígitos de cuenta. El formato completo es TR + 2 dígitos de control + código de banco de 5 dígitos + número de cuenta de 17 dígitos. Al realizar una transferencia SWIFT a Turquía, proporcione tanto el IBAN turco como el código SWIFT/BIC del banco. El código SWIFT dirige el pago al banco correcto; el IBAN identifica la cuenta específica.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Türkiye?",
      a: "Las transferencias SWIFT a Türkiye suelen llegar en uno a tres días hábiles. Las transferencias desde Alemania y otros países europeos — los principales corredores para la diáspora turca — generalmente se liquidan en uno a dos días hábiles. La zona horaria de Turquía (UTC+3) significa que las transferencias enviadas al final del día hábil europeo pueden procesarse el siguiente día bancario turco.",
    },
    {
      q: "¿Puedo recibir USD o EUR en una cuenta bancaria turca?",
      a: "Sí. Los bancos turcos ofrecen cuentas en moneda extranjera (döviz hesabı) para USD, EUR, GBP y otras divisas. Dada la histórica depreciación de la TRY, muchos residentes turcos prefieren mantener sus ahorros en moneda extranjera antes de convertirlos. Los principales bancos — Garanti BBVA, İş Bankası, Akbank — permiten abrir fácilmente cuentas en moneda extranjera junto a las cuentas estándar en TRY.",
    },
    {
      q: "¿Existen regulaciones del CBRT o del BDDK que afecten a las transferencias internacionales entrantes?",
      a: "Las transferencias de divisas extranjeras entrantes superiores al equivalente de USD 50,000 deben ser notificadas por el banco receptor al Banco Central de la República de Türkiye (CBRT) con fines estadísticos de balanza de pagos. Las transferencias empresariales requieren documentación como facturas o contratos. Las remesas personales se procesan generalmente sin pasos adicionales. Turquía no impone la conversión obligatoria de las divisas extranjeras entrantes a TRY.",
    },
    {
      q: "¿Qué es el sistema EFT en Turquía y en qué se diferencia de SWIFT?",
      a: "EFT (Elektronik Fon Transferi) es el sistema electrónico de transferencia de fondos interbancario doméstico de Turquía para pagos en TRY. FAST es el sistema de pago doméstico en tiempo real de Turquía. Ambos gestionan únicamente transferencias en TRY dentro de Turquía y no pueden recibir pagos internacionales. SWIFT se utiliza para las transferencias transfronterizas. Una vez que una transferencia SWIFT internacional llega a un banco turco, el banco acredita la cuenta del destinatario a través de sus sistemas internos.",
    },
    {
      q: "¿Hay comisiones por recibir una transferencia SWIFT en Türkiye?",
      a: "Los bancos turcos suelen cobrar una comisión de procesamiento de transferencias entrantes, a menudo TRY 50–300 o un pequeño porcentaje del importe. La conversión de divisas de USD o EUR a TRY incluye un diferencial adicional sobre la tasa de mercado interbancario. Para transferencias desde Alemania — el mayor corredor — muchos proveedores ofrecen tasas competitivas y comisiones más bajas que el SWIFT bancario estándar de banco a banco.",
    },
  ],
  egypt: [
    {
      q: "¿Qué es un código SWIFT para Egipto?",
      a: "Un código SWIFT (BIC) para Egipto es un código de 8 u 11 caracteres que identifica un banco egipcio para transferencias bancarias internacionales. La parte del código de país es EG. Por ejemplo, NBEGEGCX es el código SWIFT del Banco Nacional de Egipto. La estructura es: 4 caracteres para el banco, 2 para el país (EG), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos egipcios?",
      a: "Los códigos SWIFT clave de bancos egipcios incluyen: Banco Nacional de Egipto — NBEGEGCX, Banque Misr — BMISEGCX, Commercial International Bank (CIB) — CIBOREG1XXX, Banque du Caire — BCAIEGCX, Arab African International Bank — ARAIEGCXXX, HSBC Egypt — HBEGEGCX, y QNB Alahli — QNBAEGCXXX. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cómo recibo dinero del extranjero en una cuenta bancaria egipcia?",
      a: "Para recibir una transferencia bancaria internacional en Egipto, proporcione al remitente: el código SWIFT/BIC de su banco, su número de cuenta completo (Egipto no utiliza IBAN para cuentas estándar), su nombre completo tal como está registrado en el banco, el nombre y la dirección de la sucursal bancaria, y el propósito de la transferencia. El banco receptor convertirá la divisa extranjera a EGP al tipo oficial del CBE, a menos que tenga una cuenta en divisa extranjera.",
    },
    {
      q: "¿Puedo recibir USD o EUR directamente en una cuenta bancaria egipcia?",
      a: "Sí. Los bancos egipcios ofrecen cuentas en divisas extranjeras (حساب عملات أجنبية) que pueden recibir y mantener USD, EUR, GBP y otras divisas. El Banco Central de Egipto permite a los particulares tener cuentas en divisa extranjera. Esto es especialmente útil para los egipcios que trabajan en el extranjero o para los empresarios que reciben pagos en divisa extranjera con regularidad. Las cuentas estándar en EGP reciben la divisa extranjera convertida al tipo oficial del CBE.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Egipto?",
      a: "Las transferencias SWIFT a Egipto suelen llegar en uno a tres días hábiles. Las transferencias desde los países del Golfo (Arabia Saudita, EAU, Kuwait, Qatar), principales fuentes de remesas egipcias, generalmente se liquidan en uno a dos días hábiles. El Banco Nacional de Egipto y Banque Misr, al ser los mayores bancos estatales, tienen sólidas relaciones de banca corresponsal que facilitan una liquidación más rápida.",
    },
    {
      q: "¿Cuál es la situación del tipo de cambio en Egipto para las transferencias entrantes?",
      a: "Egipto ha experimentado importantes reformas cambiarias. La libra egipcia (EGP) se ha devaluado varias veces y el CBE ha avanzado hacia un régimen de tipo de cambio más flexible. Todas las transferencias entrantes de divisas extranjeras a través de canales bancarios oficiales se liquidan al tipo oficial del CBE. El CBE fomenta activamente el uso de canales bancarios oficiales y supervisa los flujos de remesas.",
    },
    {
      q: "¿Existen regulaciones del CBE sobre transferencias entrantes de grandes cantidades a Egipto?",
      a: "Sí. El Banco Central de Egipto exige que las transferencias comerciales entrantes estén documentadas con facturas, contratos u otro material de respaldo. Las remesas personales se procesan generalmente sin requisitos adicionales. Egipto no aplica retención fiscal sobre las remesas personales. Las transferencias de grandes importes o las transferencias repetidas de orígenes inusuales pueden desencadenar una revisión de cumplimiento adicional por parte del banco receptor.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Egipto?",
      a: "Los bancos egipcios suelen cobrar una comisión de procesamiento por transferencia entrante, a menudo entre EGP 50 y 200 por transacción, según el banco. La conversión de divisas de USD u otras divisas a EGP incluye un diferencial adicional. Los egipcios expatriados que envían dinero a casa deben comparar el tipo de cambio efectivo total (incluido el diferencial de conversión y las comisiones) entre varios proveedores, ya que las tasas pueden diferir significativamente.",
    },
  ],

  morocco: [
    {
      q: "¿Qué es un código SWIFT para Marruecos?",
      a: "Un código SWIFT (BIC) para Marruecos es un código de 8 u 11 caracteres que identifica un banco marroquí para transferencias bancarias internacionales. La parte del código de país es MA. Por ejemplo, BCMAMAMC es el código SWIFT de Attijariwafa Bank. La estructura es: 4 caracteres para el banco, 2 para el país (MA), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos marroquíes?",
      a: "Los códigos SWIFT clave de bancos marroquíes incluyen: Attijariwafa Bank — BCMAMAMC, BMCE Bank of Africa — BMCEMAMC, Banque Centrale Populaire / Banque Populaire — BCPOMAMC, BMCI (BNP Paribas Marruecos) — BMCIMAMC, CIH Bank — CIHMMAMC, y Société Générale Maroc — SGMBMAMC. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Qué es la cuenta MRE y por qué es relevante para los marroquíes en el extranjero?",
      a: "MRE son las siglas de Marocains Résidant à l'Étranger (Marroquíes Residentes en el Extranjero). Los bancos marroquíes ofrecen productos de cuenta específicos adaptados a los MRE, incluidos CEN (Compte en Devises) y CNE (Compte en Devises pour Non-Résidents). Estas cuentas permiten a los expatriados marroquíes recibir y mantener divisas extranjeras (EUR, USD, GBP) sin conversión inmediata a MAD. La mayoría de los principales bancos marroquíes disponen de servicios bancarios dedicados a los MRE.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Marruecos?",
      a: "Las transferencias SWIFT a Marruecos suelen llegar en uno a tres días hábiles. Las transferencias desde Francia, España, Bélgica e Italia, donde viven las comunidades de la diáspora marroquí más numerosas, generalmente se liquidan en uno a dos días hábiles, en parte porque los principales bancos marroquíes (especialmente Attijariwafa) tienen sucursales y relaciones de corresponsalía en esos países específicamente para las remesas de los MRE.",
    },
    {
      q: "¿Puedo recibir EUR o USD directamente en una cuenta bancaria marroquí?",
      a: "Sí. Los residentes marroquíes pueden mantener divisas extranjeras en cuentas CEN (Compte en Devises), sujeto a las regulaciones del Bank Al-Maghrib. El dírham marroquí (MAD) no es libremente convertible fuera de Marruecos. Las divisas extranjeras recibidas en una cuenta estándar en MAD se convierten al tipo comprador del banco. Tener una cuenta CEN evita esta conversión automática y permite al destinatario convertir en un momento más favorable.",
    },
    {
      q: "¿Existen regulaciones del Bank Al-Maghrib que afecten a las grandes transferencias entrantes?",
      a: "Sí. El Bank Al-Maghrib exige la declaración de las grandes transferencias de divisas extranjeras a efectos de la balanza de pagos. Las transferencias comerciales requieren documentación, como facturas o contratos. Las remesas personales de la diáspora marroquí son activamente fomentadas por el gobierno marroquí y generalmente se procesan sin inconvenientes. Marruecos ha ido liberalizando progresivamente sus normas de divisas, permitiendo a los residentes mantener cantidades limitadas de divisas extranjeras.",
    },
    {
      q: "¿Cuál es la diferencia entre recibir dinero mediante una transferencia bancaria SWIFT y a través de un agente de remesas en Marruecos?",
      a: "Las transferencias bancarias SWIFT son más adecuadas para importes mayores (superiores a EUR 500) y para destinatarios con cuentas bancarias formales. Los agentes de remesas (Western Union, RIA y operadores locales) ofrecen recogida en efectivo en numerosos puntos de Marruecos y pueden ser más rápidos y económicos para importes pequeños. Muchas familias marroquíes en zonas rurales prefieren la recogida en efectivo, ya que no requiere una cuenta bancaria.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Marruecos?",
      a: "Los bancos marroquíes pueden cobrar una pequeña comisión de procesamiento por transferencia entrante. El principal coste es el diferencial de conversión de divisas: la diferencia entre el tipo de cambio de mercado y el tipo comprador del banco, generalmente del 0,5 al 2 %. Attijariwafa Bank y BMCE Bank of Africa cuentan con amplias redes europeas y pueden ofrecer tipos más competitivos para las transferencias en EUR desde Francia o España que los bancos marroquíes más pequeños.",
    },
  ],

  colombia: [
    {
      q: "¿Qué es un código SWIFT para Colombia?",
      a: "Un código SWIFT (BIC) para Colombia es un código de 8 u 11 caracteres que identifica un banco colombiano para transferencias bancarias internacionales. La parte del código de país es CO. Por ejemplo, COABORBB es el código SWIFT de Bancolombia. La estructura es: 4 caracteres para el banco, 2 para el país (CO), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos colombianos?",
      a: "Los códigos SWIFT clave de bancos colombianos incluyen: Bancolombia — COABORBB, Banco de Bogotá — BBOGCOBB, Davivienda — DAVICOBB, BBVA Colombia — BABOROBB, Scotiabank Colpatria — COLPCOBB, Banco Agrario — BANACOBC, y Citibank Colombia — CITICOBB. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Cómo envío dinero a una cuenta bancaria colombiana desde el extranjero?",
      a: "Para enviar una transferencia bancaria internacional a Colombia, necesita: el código SWIFT/BIC del banco receptor, el número de cuenta completo del destinatario, el tipo de cuenta (ahorros/corriente) y el nombre completo y número de cédula del destinatario. Colombia no utiliza IBAN. Algunos bancos también requieren la dirección del destinatario y el propósito de la transferencia. Pida al destinatario que confirme todos los datos requeridos con su banco.",
    },
    {
      q: "¿Qué es ACH Colombia y en qué se diferencia de SWIFT?",
      a: "ACH Colombia (Asociación Bancaria y de Entidades Financieras) opera la red electrónica de pagos interbancarios domésticos en Colombia, gestionando transferencias en COP entre bancos colombianos. ACH Colombia no puede recibir pagos internacionales. SWIFT es para transferencias transfronterizas. Una vez que una transferencia internacional llega a través de SWIFT a un banco colombiano, el banco acredita la cuenta del destinatario a través de sus sistemas internos.",
    },
    {
      q: "¿Existen regulaciones del Banrep o la Superfinanciera que afecten a las transferencias entrantes?",
      a: "Sí. La normativa cambiaria de Colombia exige que todas las transferencias internacionales entrantes se canalicen a través de un intermediario financiero autorizado (un banco o casa de cambio autorizada). Las transferencias superiores a USD 10.000 requieren un formulario de declaración (Declaración de Cambio). El propósito declarado debe coincidir con el tipo de transacción real. El banco receptor es responsable de la información regulatoria, pero el destinatario puede necesitar aportar documentación.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Colombia?",
      a: "Las transferencias SWIFT a Colombia suelen llegar en uno a tres días hábiles. Las transferencias desde Estados Unidos y España, principales corredores para la diáspora colombiana, generalmente se liquidan en uno a dos días hábiles. Bancolombia, como banco más grande, tiene las relaciones de banca corresponsal más amplias y normalmente proporciona la liquidación más rápida para las transferencias entrantes en USD.",
    },
    {
      q: "¿Puedo recibir USD o EUR directamente en una cuenta bancaria colombiana?",
      a: "La normativa colombiana generalmente exige que las divisas extranjeras se conviertan a COP al recibirlas en cuentas estándar. Sin embargo, algunos bancos ofrecen cuentas denominadas en USD para empresas que realizan transacciones habituales en divisas extranjeras. Para los particulares, el proceso estándar es la conversión a COP al tipo de mercado del banco en la fecha de liquidación. El COP es libremente convertible, lo que hace que este proceso sea sencillo.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Colombia?",
      a: "Los bancos colombianos suelen cobrar una comisión de procesamiento por transferencia entrante, a menudo entre USD 10 y 25 o un pequeño porcentaje. La conversión de divisas incluye un diferencial adicional. Colombia no aplica retención fiscal sobre las remesas personales. Comparar el coste efectivo total, incluido el diferencial del tipo de cambio más las comisiones, entre varios proveedores es importante, ya que las diferencias pueden ser significativas para las transferencias habituales.",
    },
  ],

  peru: [
    {
      q: "¿Qué es un código SWIFT para Perú?",
      a: "Un código SWIFT (BIC) para Perú es un código de 8 u 11 caracteres que identifica un banco peruano para transferencias bancarias internacionales. La parte del código de país es PE. Por ejemplo, BCPLPEPL es el código SWIFT del Banco de Crédito del Perú (BCP). La estructura es: 4 caracteres para el banco, 2 para el país (PE), 2 para la ciudad y, opcionalmente, 3 para la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos peruanos?",
      a: "Los códigos SWIFT clave de bancos peruanos incluyen: Banco de Crédito del Perú (BCP) — BCPLPEPL, BBVA Perú — BABORPPL, Interbank — BINPPEPL, Scotiabank Perú — BSUDPEPL, BanBif — BFCAPEPL, Mibanco — MIBAEPPL, y Citibank Perú — CITIPEPL. Confirme siempre el código exacto con el banco del destinatario.",
    },
    {
      q: "¿Puedo recibir USD directamente en una cuenta bancaria peruana?",
      a: "Sí. Esta es una de las características bancarias más favorables para los extranjeros en Perú: los particulares pueden tener cuentas en USD (cuentas en dólares) en bancos peruanos locales. Las transferencias entrantes en USD pueden acreditarse directamente en una cuenta en dólares sin conversión obligatoria a PEN. Esto permite a los destinatarios mantener ahorros en USD en Perú, convertir en un momento favorable o realizar pagos en USD desde su cuenta.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Perú?",
      a: "Las transferencias SWIFT a Perú suelen llegar en uno a tres días hábiles. Las transferencias desde Estados Unidos y España, principales corredores para la diáspora peruana, generalmente se liquidan en uno a dos días hábiles. El BCP, como banco más grande, tiene la red de banca corresponsal más desarrollada y normalmente proporciona el procesamiento más rápido para las transferencias entrantes en USD.",
    },
    {
      q: "¿Existen regulaciones de la SBS o del BCRP que afecten a las grandes transferencias entrantes?",
      a: "Sí. La SBS de Perú (Superintendencia de Banca, Seguros y AFP) exige que las transferencias entrantes superiores a USD 10.000 vayan acompañadas de documentación sobre el origen de los fondos. El banco receptor presenta un informe a la UIF (Unidad de Inteligencia Financiera del Perú) para las transferencias de grandes importes o sospechosas. Las transferencias comerciales requieren facturas o contratos de respaldo. Perú no aplica retención fiscal sobre las remesas personales.",
    },
    {
      q: "¿Qué es el sistema CCE y en qué se diferencia de SWIFT?",
      a: "La CCE (Cámara de Compensación Electrónica) es el sistema de compensación interbancaria doméstico del Perú, que gestiona transferencias en PEN entre bancos peruanos. Es completamente independiente de SWIFT y no puede recibir pagos internacionales. SWIFT es para transferencias bancarias transfronterizas. Una vez que una transferencia internacional llega a través de SWIFT a un banco peruano, el banco acredita la cuenta del destinatario a través de sus sistemas internos.",
    },
    {
      q: "¿Perú cobra algún impuesto por recibir transferencias bancarias internacionales?",
      a: "Perú no aplica retención fiscal sobre las remesas personales entrantes. Los pagos empresariales pueden generar obligaciones del impuesto sobre la renta según la naturaleza de la transacción subyacente (pagos por servicios, dividendos, regalías, etc.), pero la transferencia en sí no está gravada en el momento de su recepción. El banco receptor no deduce impuestos de las transferencias entrantes para particulares.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Perú?",
      a: "Los bancos peruanos suelen cobrar una comisión de procesamiento por transferencia entrante, a menudo entre USD 10 y 20 por transferencia. La conversión de divisas a PEN incluye un diferencial adicional si el destinatario tiene una cuenta estándar en PEN. Dado que las cuentas en USD están ampliamente disponibles, muchos destinatarios eligen recibir en USD y convertir en el momento que prefieran, evitando así los costes inmediatos de conversión del banco.",
    },
  ],

  pakistan: [
    {
      q: "¿Qué es un código SWIFT para Pakistán?",
      a: "Un código SWIFT (también llamado código BIC) es un código de 8 u 11 caracteres que identifica un banco específico en Pakistán para transferencias bancarias internacionales. Por ejemplo, HABORPKAXXXX identifica la sede central de Bank Al Habib Limited. Los primeros 4 caracteres identifican el banco, los siguientes 2 (PK) identifican Pakistán, los siguientes 2 identifican la ciudad y los últimos 3 opcionales identifican la sucursal.",
    },
    {
      q: "¿Cuáles son los códigos SWIFT de los principales bancos pakistaníes?",
      a: "Los códigos SWIFT clave incluyen: HBL (Habib Bank Limited) — HABORPKAXXXX, UBL (United Bank Limited) — UNILPKKAXXXX, MCB Bank — MUCBPKKAXXXX, Allied Bank — ABLOOPKAXXX, Meezan Bank — MEZUPKKAXXXX, Bank Al Habib — HABORPKAXXXX, Standard Chartered Pakistan — SCBLPKKXXXX, Faysal Bank — FABORPKAXXXX, y National Bank of Pakistan — NBPAPKKAXXXX.",
    },
    {
      q: "¿Cómo encuentro el código SWIFT de mi banco pakistaní?",
      a: "Puede encontrar el código SWIFT de su banco en su extracto bancario, en la aplicación de banca en línea o móvil, contactando directamente con su sucursal, o buscando en esta página. Los principales bancos como HBL, UBL y MCB muestran los códigos SWIFT en sus portales de banca por internet. Confirme siempre el código con su banco, ya que los códigos de la sede central y de la sucursal pueden diferir.",
    },
    {
      q: "¿Necesito un código SWIFT para recibir dinero del extranjero en Pakistán?",
      a: "Sí. Para recibir una transferencia bancaria internacional en Pakistán, el remitente necesita el código SWIFT/BIC de su banco junto con su IBAN (24 caracteres que comienzan por PK). Ambos son necesarios: el código SWIFT enruta el pago a su banco, mientras que el IBAN garantiza que llegue a su cuenta específica.",
    },
    {
      q: "¿Cuánto tarda una transferencia SWIFT a Pakistán?",
      a: "Las transferencias SWIFT a Pakistán suelen tardar entre 1 y 3 días hábiles, dependiendo del país remitente, los bancos intermediarios involucrados y si el pago supera los controles de cumplimiento. Las transferencias desde el Reino Unido y Estados Unidos suelen llegar en 1-2 días hábiles. Las transferencias que implican varios bancos corresponsales o divisas inusuales pueden tardar más.",
    },
    {
      q: "¿Existen comisiones por recibir una transferencia SWIFT en Pakistán?",
      a: "La mayoría de los bancos pakistaníes cobran una comisión de servicio por remesa entrante, generalmente entre PKR 200 y 500 por transacción. Sin embargo, las remesas al hogar (transferencias personales de pakistaníes en el extranjero) suelen estar exentas de estos cargos en el marco de los programas de incentivos del SBP. El banco receptor también convertirá la divisa extranjera a PKR al tipo de cambio vigente, que incluye un margen sobre el tipo interbancario.",
    },
    {
      q: "¿Hay diferencia entre el código SWIFT y el IBAN en Pakistán?",
      a: "Sí. Un código SWIFT identifica un banco (p. ej., MUCBPKKAXXXX para MCB Bank), mientras que un IBAN identifica una cuenta específica en ese banco (p. ej., PK36SCBL0000001123456702). Para las transferencias internacionales a Pakistán, el remitente necesita ambos: el código SWIFT para enrutar el pago al banco correcto y el IBAN para acreditar la cuenta correcta.",
    },
    {
      q: "¿Puedo recibir USD o GBP directamente en mi cuenta bancaria pakistaní?",
      a: "Las cuentas estándar en PKR no pueden mantener divisas extranjeras. Las regulaciones del SBP exigen que todas las divisas extranjeras entrantes se conviertan a PKR al tipo vigente del banco en la fecha de abono. Si necesita mantener divisas extranjeras, puede abrir una Cuenta en Divisas Extranjeras (FCA) en su banco, que le permite recibir y mantener USD, GBP, EUR y otras divisas principales.",
    },
    {
      q: "¿Los monederos móviles como JazzCash y Easypaisa tienen códigos SWIFT?",
      a: "JazzCash (Mobilink Microfinance Bank) y Easypaisa (Telenor Microfinance Bank) están conectados a la red SWIFT a través de sus bancos de microfinanzas matrices. Emiten IBANs y pueden recibir transferencias bancarias internacionales si el remitente dispone del código SWIFT y el IBAN correctos. Sin embargo, para transferencias de grandes importes, una cuenta en un banco comercial puede ser más fiable.",
    },
  ],
  },
};
