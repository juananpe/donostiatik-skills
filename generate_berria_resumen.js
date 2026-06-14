const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun,
  Header, Footer, AlignmentType, HeadingLevel,
  BorderStyle, PageNumber, PageBreak, ExternalHyperlink
} = require("docx");

// A4 page (default for Basque/Spanish documents)
const PAGE_WIDTH = 11906;
const PAGE_HEIGHT = 16838;
const MARGIN = 1440; // 1 inch
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN; // 9026

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } } // 11pt
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1A3C6E" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
    ]
  },
  sections: [
    // === SECTION 1: Cover / Title Page ===
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 4 } },
              children: [
                new TextRun({ text: "BERRIA.EUS - 2026ko ekainaren 13a", bold: true, size: 18, color: "888888" }),
              ],
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
              children: [
                new TextRun({ text: "Berria.eus - ", size: 16, color: "888888" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888" }),
              ]
            })
          ]
        })
      },
      children: [
        // Title
        new Paragraph({ spacing: { before: 2400 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Hiru albiste nagusi", size: 52, bold: true, font: "Arial", color: "1A3C6E" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "2026ko ekainaren 13a", size: 28, color: "2E75B6" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ text: "Berria.eus egunkaritik hartutako laburpena", size: 22, color: "666666" })]
        }),
        // Decorative line
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "2E75B6", space: 1 } },
          spacing: { after: 400 },
          children: []
        }),
        // Summary intro
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Eguneko hiru albiste nagusien laburpena dakarzuegu: ", size: 22 }),
            new TextRun({ text: "Euskaltzaleon Martxa Iruñean", bold: true, size: 22 }),
            new TextRun({ text: ", ", size: 22 }),
            new TextRun({ text: "hizkuntza eskakizunen erreforma Eusko Legebiltzarrean", bold: true, size: 22 }),
            new TextRun({ text: " eta ", size: 22 }),
            new TextRun({ text: "Iranen eta AEBen arteko akordioaren gertutasuna", bold: true, size: 22 }),
            new TextRun({ text: ".", size: 22 }),
          ]
        }),
        new Paragraph({
          children: [new TextRun({ text: "Albiste guztiak Berria.eus-en irakur daitezke osorik.", italics: true, size: 20, color: "888888" })]
        }),
      ]
    },

    // === SECTION 2: News 1 - Euskaltzaleon Martxa ===
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 4 } },
              children: [
                new TextRun({ text: "BERRIA.EUS - ALBISTE NAGUSIAK - 2026-06-13", bold: true, size: 18, color: "888888" }),
              ],
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
              children: [
                new TextRun({ text: "Berria.eus - ", size: 16, color: "888888" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888" }),
              ]
            })
          ]
        })
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("1. Euskaltzaleon Martxa, gaur Iruñean")]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Egilea: ", bold: true, size: 20, color: "666666" }),
            new TextRun({ text: "Arantxa Iraola", size: 20, color: "666666" }),
            new TextRun({ text: " | ", size: 20, color: "CCCCCC" }),
            new TextRun({ text: "Kategoria: ", bold: true, size: 20, color: "666666" }),
            new TextRun({ text: "Euskal Herria", size: 20, color: "666666" }),
            new TextRun({ text: " | ", size: 20, color: "CCCCCC" }),
            new TextRun({ text: "Data: 2026-06-13", size: 20, color: "666666" }),
          ]
        }),
        // Image
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [new ImageRun({
            type: "jpg",
            data: fs.readFileSync("img1_martxa.jpg"),
            transformation: { width: 520, height: 315 },
            altText: { title: "Euskaltzaleon Martxa aurkezpena", description: "Martxaren aurkezpena Iruñeko Gazteluko plazan", name: "martxa.jpg" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Martxaren aurkezpena, Iruñeko Gazteluko plazan. JAGOBA MANTEROLA / FOKU", italics: true, size: 18, color: "888888" })]
        }),
        // Article summary
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Euskalgintzaren Kontseiluak antolatuta, gaur, ekainaren 13an, milaka lagun bilduko dituen Euskaltzaleon Martxa egingo da Iruñean, ", size: 22 }),
            new TextRun({ text: "\"Euskaraz bizitzeko behar den dena\"", bold: true, size: 22 }),
            new TextRun({ text: " lelopean.", size: 22 }),
          ]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Goizeko 11:00etan hasiko dira ekitaldiak, haur eta gurasoentzako jarduerekin: Porrotx eta Zapotxin pailazoak Santa Ana plazan arituko dira. 12:00etan Kantujira ibiliko da Alde Zaharrean, eta 13:30ean Gazte Euskaltzaleen martxari harrera egingo diote Karmen kalean.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Arratsaldeko 17:10ean abiatuko dira hiru zutabeak: Askatasunaren plazatik, Antoniutti parketik eta Runa parketik. 18:00etan hasiko da amaiera ekitaldia Gazteluko plazan, non Idurre Eskisabel Euskalgintzaren Kontseiluko idazkari nagusiak hitzaldi nagusia egingo duen.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Zutabe bakoitzak bere mezua eramango du: Runak ofizialtasun osoa eskatuko du, Antoniuttik hizkuntza politiketan jauzia, eta Askatasunak euskaltzaletasuna hauspotzeko deia. Guztira, 32 gizarte eragilek babesten dute martxa.", size: 22 })]
        }),
        // Source link
        new Paragraph({
          spacing: { before: 240 },
          children: [
            new TextRun({ text: "Jatorrizko albistea: ", size: 18, color: "888888" }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "berria.eus", style: "Hyperlink", size: 18 })],
              link: "https://www.berria.eus/euskal-herria/hiru-zutabe-bost-mezu-milaka-ahots-euskaltzaleon-martxa-da-gaur-irunean_2159609_102.html"
            })
          ]
        }),
      ]
    },

    // === SECTION 3: News 2 - Hizkuntza eskakizunak ===
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 4 } },
              children: [
                new TextRun({ text: "BERRIA.EUS - ALBISTE NAGUSIAK - 2026-06-13", bold: true, size: 18, color: "888888" }),
              ],
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
              children: [
                new TextRun({ text: "Berria.eus - ", size: 16, color: "888888" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888" }),
              ]
            })
          ]
        })
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("2. Hizkuntza eskakizunen erreforma onetsi dute, EAJren proposamenarekin")]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Egilea: ", bold: true, size: 20, color: "666666" }),
            new TextRun({ text: "Arantxa Iraola", size: 20, color: "666666" }),
            new TextRun({ text: " | ", size: 20, color: "CCCCCC" }),
            new TextRun({ text: "Kategoria: ", bold: true, size: 20, color: "666666" }),
            new TextRun({ text: "Euskal Herria / Politika", size: 20, color: "666666" }),
            new TextRun({ text: " | ", size: 20, color: "CCCCCC" }),
            new TextRun({ text: "Data: 2026-06-12", size: 20, color: "666666" }),
          ]
        }),
        // Image
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [new ImageRun({
            type: "jpg",
            data: fs.readFileSync("img2_eskakizunak.jpg"),
            transformation: { width: 520, height: 315 },
            altText: { title: "Eusko Legebiltzarreko batzordea", description: "Erakundeen, Gobernantza Publikoaren eta Segurtasunaren Batzordea", name: "eskakizunak.jpg" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Eusko Legebiltzarreko Erakundeen, Gobernantza Publikoaren eta Segurtasunaren Batzordea, gaur goizean. ENDIKA PORTILLO / FOKU", italics: true, size: 18, color: "888888" })]
        }),
        // Article summary
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Eusko Legebiltzarreko Erakundeen, Gobernantza Publikoaren eta Segurtasunaren Batzordeak EAJren hizkuntza eskakizunen erreforma proposamena onetsi du, ", size: 22 }),
            new TextRun({ text: "EH Bilduren abstentzioari esker", bold: true, size: 22 }),
            new TextRun({ text: ". EH Bilduren proposamena, aldiz, bertan behera geratu da.", size: 22 }),
          ]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "EAJren proposamenaren muina da hizkuntza eskakizunak ezartzeko erabiltzen den derrigortasun indizea ezabatzea, epaile askok horren kontra egin dutelako. Helburua da erakunde publikoei segurtasun juridiko handiagoa ematea. Lan eskaintza publikoetan \"derrigortasun geroratuaren figura\" orokortzea proposatu du EAJk.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "EH Bilduk, Josu Aztiriaren bitartez, adierazi du \"akordioaren\" alde egin behar dutela eta azken minutura arte negoziatzen jarraituko dutela. Markel Olano EAJko ordezkariak, berriz, administrazio publiko elebidunaren garrantzia azpimarratu du.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Gainerako taldeek (Sumar, PP, Vox, PSE-EE) bi proposamenen kontra bozkatu dute. Behin betiko onespena ekainaren 25eko osoko bilkuran egingo da.", size: 22 })]
        }),
        // Source link
        new Paragraph({
          spacing: { before: 240 },
          children: [
            new TextRun({ text: "Jatorrizko albistea: ", size: 18, color: "888888" }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "berria.eus", style: "Hyperlink", size: 18 })],
              link: "https://www.berria.eus/euskal-herria/hizkuntza-eskakizunak-erreformatzeko-eajren-proposamena-onetsi-da-bildu-abstenitu-delako_2159560_102.html"
            })
          ]
        }),
      ]
    },

    // === SECTION 4: News 3 - Iran-AEB akordioa ===
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 4 } },
              children: [
                new TextRun({ text: "BERRIA.EUS - ALBISTE NAGUSIAK - 2026-06-13", bold: true, size: 18, color: "888888" }),
              ],
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
              children: [
                new TextRun({ text: "Berria.eus - ", size: 16, color: "888888" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "888888" }),
              ]
            })
          ]
        })
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("3. Iranen eta AEBen arteko akordioa, «inoiz baino hurbilago»")]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Egilea: ", bold: true, size: 20, color: "666666" }),
            new TextRun({ text: "Julen Otaegi Leonet", size: 20, color: "666666" }),
            new TextRun({ text: " | ", size: 20, color: "CCCCCC" }),
            new TextRun({ text: "Kategoria: ", bold: true, size: 20, color: "666666" }),
            new TextRun({ text: "Mundua / Nazioartea", size: 20, color: "666666" }),
            new TextRun({ text: " | ", size: 20, color: "CCCCCC" }),
            new TextRun({ text: "Data: 2026-06-12", size: 20, color: "666666" }),
          ]
        }),
        // Image
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [new ImageRun({
            type: "jpg",
            data: fs.readFileSync("img3_iran.jpg"),
            transformation: { width: 520, height: 315 },
            altText: { title: "Emakume bat Teheranen", description: "Irango eta AEBen arteko negoziazioen murala Teheranen", name: "iran.jpg" }
          })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "Emakume bat Teheranen, Iranen eta AEBen arteko negoziazioak irudikatzen dituen mural baten ondoan. ABEDIN TAHERKENAREH / EFE", italics: true, size: 18, color: "888888" })]
        }),
        // Article summary
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "Donald Trump AEBetako presidentearen arabera, ", size: 22 }),
            new TextRun({ text: "\"memorandum oso sendo bat\" onartu dute", bold: true, size: 22 }),
            new TextRun({ text: " Iranekin. Oraingoan, alde guztiak bat datoz akordioa inoiz baino gertuago dagoela esatean. Abbas Araghtxi Irango Atzerri ministroak ere baieztatu du: ", size: 22 }),
            new TextRun({ text: "\"Inoiz ez da hain gertu egon\"", bold: true, size: 22 }),
            new TextRun({ text: ". Pakistango lehen ministro Shehbaz Sharifek, bitartekari lanetan, bake akordioa adostu dela iragarri du.", size: 22 }),
          ]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Memorandumaren arabera, AEBek 30 eguneko epean Irango portuei ezarritako blokeoa etengo dute, eta Iranek Ormuzko itsasartea irekiko du. Washingtonek eskualdera bidalitako tropak erretiratuko ditu, Irango petrolio zigorrak kenduko ditu eta nazioarteko bankuetan blokeatutako funtsak desblokeatuko ditu.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Reuters agentziaren arabera, baliteke memoranduma etzi sinatzea Genevan (Suitza). JD Vance AEBetako presidenteordea eta Mohammad Bagher Ghalibaf Irango ordezkaria izango lirateke sinatzaileak. Dokumentuari \"Islamabadeko Adierazpena\" deitu diote.", size: 22 })]
        }),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Bestalde, Israelek Libanoren kontrako erasoei eusten die. Hala ere, akordioak Israelgo armada iparraldeko bizilagunetik erretiratzea ere barne hartuko lukeela jakinarazi du Haaretz egunkariak.", size: 22 })]
        }),
        // Source link
        new Paragraph({
          spacing: { before: 240 },
          children: [
            new TextRun({ text: "Jatorrizko albistea: ", size: 18, color: "888888" }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "berria.eus", style: "Hyperlink", size: 18 })],
              link: "https://www.berria.eus/mundua/iranek-baieztatu-du-negoziatzen-ari-dela-aebekin-baina-akordioa-baztertu-du_2159587_102.html"
            })
          ]
        }),
      ]
    },
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Berria_Albisteak_2026-06-13.docx", buffer);
  console.log("Document created: Berria_Albisteak_2026-06-13.docx");
});
