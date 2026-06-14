const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  ExternalHyperlink, ImageRun, AlignmentType, LevelFormat,
  Header, Footer, PageNumber, TabStopType, TabStopPosition,
  BorderStyle
} = require("docx");

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 } // 11pt default
      }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1A3A5C" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 }
      },
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 4 } },
            children: [
              new TextRun({ text: "Ayuntamiento de Donostia / San Sebastián", font: "Arial", size: 18, color: "666666", italics: true }),
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Página ", font: "Arial", size: 18, color: "999999" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "999999" }),
            ]
          })
        ]
      })
    },
    children: [
      // Título principal
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text: "Afectaciones al tráfico en Gros", bold: true })]
      }),

      // Fecha y hora destacada
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: "6 de junio de 2026", bold: true, size: 28, color: "C00000" }),
        ]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Horario: ", bold: true }),
          new TextRun({ text: "20:30 – 23:30 (aproximadamente)" }),
        ]
      }),

      // Descripción
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "La " }),
          new ExternalHyperlink({
            children: [new TextRun({ text: "carrera nocturna Binter NightRun", style: "Hyperlink" })],
            link: "https://www.binternightrun.es/sansebastian/",
          }),
          new TextRun({ text: " que se celebrará este sábado, 6 de junio, tendrá afectaciones al tráfico, sobre todo en el barrio de Gros. Los cortes se realizarán de 20:30 a 23:30, aproximadamente." }),
        ]
      }),

      // Imagen de la noticia
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 300 },
        children: [new ImageRun({
          type: "jpg",
          data: fs.readFileSync("/opt/donostiatik/skills/news_image.jpg"),
          transformation: { width: 540, height: 410 },
          altText: { title: "Plano de afectaciones", description: "Mapa con los viales cortados por la Binter NightRun en Gros", name: "Plano afectaciones tráfico" },
        })]
      }),

      // Viales cortados
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "Viales cortados" })]
      }),

      ...([
        "Avenida de Navarra: tanto entrada como salida de ciudad (estará abierto para la salida de la ciudad el acceso desde Marino Tabuyo).",
        "Calzada Vieja de Ategorrieta.",
        "Avenida de Zurriola, en ambos sentidos.",
        "Paseo de Ramón María Lili.",
        "Un carril del puente de Santa Catalina.",
        "Un carril del paseo de la República Argentina.",
        "Puente de Zurriola.",
        "Sagües.",
      ].map(text =>
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: [new TextRun({ text })]
        })
      )),

      // OTA
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "OTA — Estacionamiento regulado" })]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Las personas que disponen del permiso de aparcamiento del Sector OTA 2-1 y 2-2, podrán " }),
          new ExternalHyperlink({
            children: [new TextRun({ text: "estacionar en cualquiera de los demás Sectores de Estacionamiento Regulado de la ciudad", style: "Hyperlink" })],
            link: "https://donostia.eus/es/movilidad/quiero-aparcar-ciudad/ota",
          }),
          new TextRun({ text: ", en las mismas condiciones que los y las titulares de la OTA del Sector de destino." }),
        ]
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Este permiso será válido del ", bold: true }),
          new TextRun({ text: "5 al 8 de junio de 2026", bold: true }),
          new TextRun({ text: ", ambos incluidos. No obstante, estos residentes no podrán estacionar de forma gratuita en las zonas de pago obligatorio (zonas 15) dentro del horario de regulación establecido." }),
        ]
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: "Esta autorización se concede sin perjuicio del cumplimiento de las condiciones establecidas para el acceso de vehículos a la Zona de Bajas Emisiones (ZBE).", italics: true, size: 20 }),
        ]
      }),

      // Transporte público
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: "Transporte público" })]
      }),

      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Modificación de recorridos en el transporte público:" }),
        ]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [
          new ExternalHyperlink({
            children: [new TextRun({ text: "Dbus — Modificación de recorridos", style: "Hyperlink" })],
            link: "https://dbus.eus/es/noticias/modificacion-de-recorridos-por-la-binter-nightrun-donostia/",
          }),
        ]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 200 },
        children: [
          new ExternalHyperlink({
            children: [new TextRun({ text: "Lurraldebus — Detalles de la afección", style: "Hyperlink" })],
            link: "https://lurraldebus.eus/news/details/3487",
          }),
        ]
      }),

      // Separador
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 1 } },
        spacing: { before: 200, after: 200 },
        children: []
      }),

      // Pie: fecha publicación y fuente
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: "Publicado el 04/06/2026", size: 20, color: "888888" }),
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: "Fuente: ", size: 20, color: "888888" }),
          new ExternalHyperlink({
            children: [new TextRun({ text: "donostia.eus", style: "Hyperlink", size: 20 })],
            link: "https://www.donostia.eus/es/avisos",
          }),
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        children: [
          new TextRun({ text: "Ayuntamiento de Donostia / San Sebastián", size: 20, color: "888888", italics: true }),
        ]
      }),

      // Contacto
      new Paragraph({
        spacing: { before: 200, after: 60 },
        children: [
          new TextRun({ text: "Contacto", bold: true, size: 22 }),
        ]
      }),
      new Paragraph({
        spacing: { after: 20 },
        children: [
          new TextRun({ text: "Teléfono: 010 (gratuito desde Donostia / San Sebastián) / (+34) 943 481 000", size: 20 }),
        ]
      }),
      new Paragraph({
        children: [
          new ExternalHyperlink({
            children: [new TextRun({ text: "Buzón de la ciudadanía", style: "Hyperlink", size: 20 })],
            link: "https://www.donostia.eus/es/web/nirekarpeta/buzon-sugerencias",
          }),
        ]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/opt/donostiatik/skills/Afectaciones_Trafico_Gros_Junio2026.docx", buffer);
  console.log("Documento creado: Afectaciones_Trafico_Gros_Junio2026.docx");
});
