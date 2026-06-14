const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun,
  Header, Footer, AlignmentType,
  BorderStyle, PageNumber, Table, TableCell, TableRow,
  WidthType, ShadingType, HeadingLevel
} = require("docx");

// ============================================================
// ANTHROPIC BRAND GUIDELINES — Color Palette
// ============================================================
const COLORS = {
  dark:       "#141413",  // Primary text and dark backgrounds
  light:      "#FAF9F5",  // Light backgrounds and text on dark
  midGray:    "#B0AEA5",  // Secondary elements
  lightGray:  "#E8E6DC",  // Subtle backgrounds
  orange:     "#D97757",  // Primary accent
  blue:       "#6A9BCC",  // Secondary accent
  green:      "#788C5D",  // Tertiary accent
};

// Typography
const HEADING_FONT = "Poppins";
const BODY_FONT = "Lora";
const HEADING_FALLBACK = "Arial";
const BODY_FALLBACK = "Georgia";

// Page dimensions
const PAGE_WIDTH = 11906;   // A4
const PAGE_HEIGHT = 16838;
const MARGIN = 1080;

// Helper: color with swatch block
function colorSwatch(color, label) {
  return new TableCell({
    width: { size: 1380, type: WidthType.DXA },
    shading: { type: ShadingType.SOLID, color: color.replace("#", "") },
    children: [
      new Paragraph({ spacing: { before: 300, after: 300 }, children: [] }),
    ],
  });
}

function colorLabel(color, label, hex) {
  const isDark = ["#141413"].includes(hex);
  return new TableCell({
    width: { size: 2400, type: WidthType.DXA },
    shading: { type: ShadingType.SOLID, color: color.replace("#", "") },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: label, bold: true, size: 22, font: HEADING_FALLBACK, color: isDark ? COLORS.light.replace("#", "") : COLORS.dark.replace("#", "") }),
          new TextRun({ break: 1, text: hex, size: 18, font: BODY_FALLBACK, color: isDark ? COLORS.midGray.replace("#", "") : COLORS.midGray.replace("#", "") }),
        ],
      }),
    ],
  });
}

// Build table row for colour palette
function colorRow(colorHex, label) {
  return new TableRow({
    children: [colorSwatch(colorHex, label), colorLabel(colorHex, label, colorHex)],
  });
}

// ============================================================
// DOCUMENT
// ============================================================
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: BODY_FONT, size: 22, color: COLORS.dark.replace("#", "") } },
    },
  },
  sections: [
    // ===== COVER PAGE =====
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.orange.replace("#", ""), space: 4 } },
              children: [
                new TextRun({ text: "Anthropic Brand Guidelines", size: 16, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", ""), italics: true }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.lightGray.replace("#", ""), space: 4 } },
              children: [
                new TextRun({ text: "Anthropic Brand Style Guide  ·  ", size: 16, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Decorative top bar
        new Paragraph({
          spacing: { after: 0 },
          border: { top: { style: BorderStyle.SINGLE, size: 36, color: COLORS.orange.replace("#", ""), space: 0 } },
          children: [],
        }),
        new Paragraph({ spacing: { before: 2400 }, children: [] }),

        // Main title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Anthropic", size: 72, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        // Subtitle
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Brand Style Guide", size: 52, bold: true, font: HEADING_FONT, color: COLORS.orange.replace("#", "") }),
          ],
        }),
        new Paragraph({ spacing: { before: 300 }, children: [] }),
        // Tagline
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Colour · Typography · Visual Identity", size: 24, font: BODY_FONT, color: COLORS.midGray.replace("#", ""), italics: true }),
          ],
        }),

        // Decorative accent line
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 400 },
          children: [
            new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━", size: 18, font: BODY_FALLBACK, color: COLORS.blue.replace("#", "") }),
          ],
        }),

        // Bottom info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 600 },
          children: [
            new TextRun({ text: "Document generated   ·   June 2026", size: 20, font: BODY_FONT, color: COLORS.midGray.replace("#", "") }),
          ],
        }),
      ],
    },

    // ===== SECTION 2: COLOUR PALETTE =====
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.orange.replace("#", ""), space: 4 } },
              children: [
                new TextRun({ text: "Anthropic Brand Guidelines  ·  Colour Palette", size: 16, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", ""), italics: true }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.lightGray.replace("#", ""), space: 4 } },
              children: [
                new TextRun({ text: "Anthropic Brand Style Guide  ·  ", size: 16, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Section title
        new Paragraph({
          spacing: { after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.orange.replace("#", ""), space: 8 } },
          children: [
            new TextRun({ text: "Colour Palette", size: 44, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 360 },
          children: [
            new TextRun({ text: "The Anthropic brand uses a warm, sophisticated colour palette. Four neutral tones provide structure while three accent colours add personality and hierarchy.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // === MAIN COLOURS ===
        new Paragraph({
          spacing: { before: 240, after: 160 },
          children: [
            new TextRun({ text: "Main / Neutral Colours", size: 30, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Foundation colours for text, backgrounds and secondary UI elements.", size: 22, font: BODY_FONT, color: COLORS.midGray.replace("#", "") }),
          ],
        }),

        // Main colours table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Swatch", bold: true, size: 20, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", "") })] })],
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Name & Hex Code", bold: true, size: 20, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", "") })] })],
                }),
                new TableCell({
                  width: { size: 3746, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Usage", bold: true, size: 20, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", "") })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLORS.dark.replace("#", "") },
                  children: [new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [
                    new TextRun({ text: "Dark", bold: true, size: 22, font: HEADING_FALLBACK, color: COLORS.dark.replace("#", "") }),
                    new TextRun({ break: 1, text: "#141413", size: 18, font: "Courier New", color: COLORS.midGray.replace("#", "") }),
                  ]})],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Primary text and dark backgrounds. Use for main body copy and high-contrast surfaces.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLORS.light.replace("#", "") },
                  children: [new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [
                    new TextRun({ text: "Light", bold: true, size: 22, font: HEADING_FALLBACK, color: COLORS.dark.replace("#", "") }),
                    new TextRun({ break: 1, text: "#FAF9F5", size: 18, font: "Courier New", color: COLORS.midGray.replace("#", "") }),
                  ]})],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Light backgrounds and text on dark surfaces. Warm off-white for page backgrounds.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLORS.midGray.replace("#", "") },
                  children: [new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [
                    new TextRun({ text: "Mid Gray", bold: true, size: 22, font: HEADING_FALLBACK, color: COLORS.dark.replace("#", "") }),
                    new TextRun({ break: 1, text: "#B0AEA5", size: 18, font: "Courier New", color: COLORS.midGray.replace("#", "") }),
                  ]})],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Secondary elements — captions, subtle borders, disabled states and metadata.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLORS.lightGray.replace("#", "") },
                  children: [new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [
                    new TextRun({ text: "Light Gray", bold: true, size: 22, font: HEADING_FALLBACK, color: COLORS.dark.replace("#", "") }),
                    new TextRun({ break: 1, text: "#E8E6DC", size: 18, font: "Courier New", color: COLORS.midGray.replace("#", "") }),
                  ]})],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Subtle backgrounds — card surfaces, callout boxes and section dividers.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") })] })],
                }),
              ],
            }),
          ],
        }),

        // === ACCENT COLOURS ===
        new Paragraph({
          spacing: { before: 480, after: 160 },
          children: [
            new TextRun({ text: "Accent Colours", size: 30, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Three distinctive accent colours bring warmth, trust and balance. Use for interactive elements, highlights and visual interest.", size: 22, font: BODY_FONT, color: COLORS.midGray.replace("#", "") }),
          ],
        }),

        // Accent colours table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Swatch", bold: true, size: 20, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", "") })] })],
                }),
                new TableCell({
                  width: { size: 3000, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Name & Hex Code", bold: true, size: 20, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", "") })] })],
                }),
                new TableCell({
                  width: { size: 3746, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Usage", bold: true, size: 20, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", "") })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLORS.orange.replace("#", "") },
                  children: [new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [
                    new TextRun({ text: "Orange", bold: true, size: 22, font: HEADING_FALLBACK, color: COLORS.dark.replace("#", "") }),
                    new TextRun({ break: 1, text: "#D97757", size: 18, font: "Courier New", color: COLORS.midGray.replace("#", "") }),
                    new TextRun({ break: 1, text: "Primary accent", size: 16, font: BODY_FALLBACK, color: COLORS.orange.replace("#", ""), italics: true }),
                  ]})],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Primary CTA buttons, key highlights, section accents. The dominant brand accent.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLORS.blue.replace("#", "") },
                  children: [new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [
                    new TextRun({ text: "Blue", bold: true, size: 22, font: HEADING_FALLBACK, color: COLORS.dark.replace("#", "") }),
                    new TextRun({ break: 1, text: "#6A9BCC", size: 18, font: "Courier New", color: COLORS.midGray.replace("#", "") }),
                    new TextRun({ break: 1, text: "Secondary accent", size: 16, font: BODY_FALLBACK, color: COLORS.blue.replace("#", ""), italics: true }),
                  ]})],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Links, secondary buttons, informational elements. Cool, trustworthy tone.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLORS.green.replace("#", "") },
                  children: [new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [
                    new TextRun({ text: "Green", bold: true, size: 22, font: HEADING_FALLBACK, color: COLORS.dark.replace("#", "") }),
                    new TextRun({ break: 1, text: "#788C5D", size: 18, font: "Courier New", color: COLORS.midGray.replace("#", "") }),
                    new TextRun({ break: 1, text: "Tertiary accent", size: 16, font: BODY_FALLBACK, color: COLORS.green.replace("#", ""), italics: true }),
                  ]})],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Success states, environmental cues, tertiary highlights. Earthy, grounded feel.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") })] })],
                }),
              ],
            }),
          ],
        }),
      ],
    },

    // ===== SECTION 3: TYPOGRAPHY =====
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.orange.replace("#", ""), space: 4 } },
              children: [
                new TextRun({ text: "Anthropic Brand Guidelines  ·  Typography", size: 16, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", ""), italics: true }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.lightGray.replace("#", ""), space: 4 } },
              children: [
                new TextRun({ text: "Anthropic Brand Style Guide  ·  ", size: 16, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Section title
        new Paragraph({
          spacing: { after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.blue.replace("#", ""), space: 8 } },
          children: [
            new TextRun({ text: "Typography", size: 44, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 280 },
          children: [
            new TextRun({ text: "Anthropic pairs Poppins (a geometric sans-serif) with Lora (a humanist serif) to balance clarity with warmth.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // Font overview
        new Paragraph({
          spacing: { before: 160, after: 120 },
          children: [
            new TextRun({ text: "Font Pairing", size: 30, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // Poppins
        new Paragraph({
          spacing: { before: 160, after: 60 },
          children: [
            new TextRun({ text: "Poppins — Headings", size: 36, bold: true, font: HEADING_FONT, color: COLORS.orange.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", size: 28, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "abcdefghijklmnopqrstuvwxyz", size: 28, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "0123456789  ·  @#$%&*!?  ·  The quick brown fox jumps over the lazy dog.", size: 22, font: HEADING_FONT, color: COLORS.midGray.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: COLORS.blue.replace("#", ""), space: 8 } },
          indent: { left: 240 },
          children: [
            new TextRun({ text: "Fallback: ", size: 20, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", ""), italics: true }),
            new TextRun({ text: "Arial", size: 20, font: "Arial", color: COLORS.midGray.replace("#", ""), bold: true }),
            new TextRun({ text: "  ·  Applied automatically to all headings 24pt and above.", size: 20, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
          ],
        }),

        // Lora
        new Paragraph({
          spacing: { before: 360, after: 60 },
          children: [
            new TextRun({ text: "Lora — Body Text", size: 36, bold: true, font: HEADING_FONT, color: COLORS.orange.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ  ·  abcdefghijklmnopqrstuvwxyz", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        // Lora paragraph sample
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: "Lora is a well-balanced contemporary serif with roots in calligraphy. Its moderate contrast and brushed curves lend it a warm, readable personality — ideal for extended reading. Anthropic uses Lora for all body copy to complement the clean geometry of Poppins headings.",
              size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", ""),
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: COLORS.blue.replace("#", ""), space: 8 } },
          indent: { left: 240 },
          children: [
            new TextRun({ text: "Fallback: ", size: 20, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", ""), italics: true }),
            new TextRun({ text: "Georgia", size: 20, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", ""), bold: true }),
            new TextRun({ text: "  ·  Applied automatically to all body text.", size: 20, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
          ],
        }),

        // Smart font application
        new Paragraph({
          spacing: { before: 480, after: 160 },
          children: [
            new TextRun({ text: "Smart Font Application Rules", size: 30, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "✓  ", size: 22, font: BODY_FALLBACK, color: COLORS.green.replace("#", ""), bold: true }),
            new TextRun({ text: "Headings 24pt and larger: ", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", ""), bold: true }),
            new TextRun({ text: "Poppins (or Arial if unavailable)", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "✓  ", size: 22, font: BODY_FALLBACK, color: COLORS.green.replace("#", ""), bold: true }),
            new TextRun({ text: "Body text: ", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", ""), bold: true }),
            new TextRun({ text: "Lora (or Georgia if unavailable)", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "✓  ", size: 22, font: BODY_FALLBACK, color: COLORS.green.replace("#", ""), bold: true }),
            new TextRun({ text: "Colour selection: ", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", ""), bold: true }),
            new TextRun({ text: "Automatically adjusts based on background darkness (light text on dark surfaces, dark text on light surfaces).", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "✓  ", size: 22, font: BODY_FALLBACK, color: COLORS.green.replace("#", ""), bold: true }),
            new TextRun({ text: "Hierarchy preserved: ", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", ""), bold: true }),
            new TextRun({ text: "Font sizes, bold/italic styling and outline levels are maintained through the brand application.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
      ],
    },

    // ===== SECTION 4: VISUAL IDENTITY IN USE =====
    {
      properties: {
        page: {
          size: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.orange.replace("#", ""), space: 4 } },
              children: [
                new TextRun({ text: "Anthropic Brand Guidelines  ·  Visual Identity", size: 16, font: HEADING_FALLBACK, color: COLORS.midGray.replace("#", ""), italics: true }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.lightGray.replace("#", ""), space: 4 } },
              children: [
                new TextRun({ text: "Anthropic Brand Style Guide  ·  ", size: 16, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, font: BODY_FALLBACK, color: COLORS.midGray.replace("#", "") }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Section title
        new Paragraph({
          spacing: { after: 120 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.green.replace("#", ""), space: 8 } },
          children: [
            new TextRun({ text: "Visual Identity in Use", size: 44, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // Shape & Accent Colours section
        new Paragraph({
          spacing: { before: 280, after: 120 },
          children: [
            new TextRun({ text: "Shape & Accent Application", size: 30, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: "Non-text shapes and graphic elements cycle through the three accent colours (orange, blue, green) to maintain visual interest while staying on-brand.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // Accent demo 1 — Orange
        new Paragraph({
          spacing: { before: 240, after: 40 },
          border: { left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.orange.replace("#", ""), space: 12 } },
          indent: { left: 360 },
          children: [
            new TextRun({ text: "PRIMARY ACCENT — ORANGE #D97757", size: 16, font: HEADING_FALLBACK, color: COLORS.orange.replace("#", ""), bold: true }),
            new TextRun({ break: 1, text: "Primary call-to-action buttons, section dividers, and high-emphasis highlights use the warm orange accent. This is the dominant brand colour for interactive and attention-drawing elements.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // Accent demo 2 — Blue
        new Paragraph({
          spacing: { before: 280, after: 40 },
          border: { left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.blue.replace("#", ""), space: 12 } },
          indent: { left: 360 },
          children: [
            new TextRun({ text: "SECONDARY ACCENT — BLUE #6A9BCC", size: 16, font: HEADING_FALLBACK, color: COLORS.blue.replace("#", ""), bold: true }),
            new TextRun({ break: 1, text: "Hyperlinks, secondary buttons and informational badges use the calming blue. It conveys trust and reliability — ideal for data displays and status indicators.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // Accent demo 3 — Green
        new Paragraph({
          spacing: { before: 280, after: 40 },
          border: { left: { style: BorderStyle.SINGLE, size: 24, color: COLORS.green.replace("#", ""), space: 12 } },
          indent: { left: 360 },
          children: [
            new TextRun({ text: "TERTIARY ACCENT — GREEN #788C5D", size: 16, font: HEADING_FALLBACK, color: COLORS.green.replace("#", ""), bold: true }),
            new TextRun({ break: 1, text: "Success messages, environmental cues and tertiary highlights use the grounded green. It brings balance to the palette with its earthy, organic tone.", size: 20, font: BODY_FALLBACK, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // Dark background example
        new Paragraph({
          spacing: { before: 480, after: 120 },
          children: [
            new TextRun({ text: "Dark Background Treatment", size: 30, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),

        // Simulate a dark card
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: COLORS.dark.replace("#", "") },
                  width: { size: 9746, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      spacing: { before: 200, after: 80 },
                      children: [new TextRun({ text: "Anthropic Brand on Dark Surface", size: 30, bold: true, font: HEADING_FONT, color: COLORS.light.replace("#", "") })],
                    }),
                    new Paragraph({
                      spacing: { after: 60 },
                      children: [new TextRun({ text: "When text sits on the dark background (#141413), it inverts to the light colour (#FAF9F5) for optimal contrast. Accent colours remain unchanged, creating a striking, sophisticated look.", size: 22, font: BODY_FONT, color: COLORS.light.replace("#", "") })],
                    }),
                    new Paragraph({
                      spacing: { after: 200 },
                      children: [
                        new TextRun({ text: "● ", size: 24, font: BODY_FALLBACK, color: COLORS.orange.replace("#", "") }),
                        new TextRun({ text: "Orange accent  ", size: 22, font: BODY_FONT, color: COLORS.light.replace("#", "") }),
                        new TextRun({ text: "● ", size: 24, font: BODY_FALLBACK, color: COLORS.blue.replace("#", "") }),
                        new TextRun({ text: "Blue accent  ", size: 22, font: BODY_FONT, color: COLORS.light.replace("#", "") }),
                        new TextRun({ text: "● ", size: 24, font: BODY_FALLBACK, color: COLORS.green.replace("#", "") }),
                        new TextRun({ text: "Green accent", size: 22, font: BODY_FONT, color: COLORS.light.replace("#", "") }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Best Practices summary
        new Paragraph({
          spacing: { before: 480, after: 120 },
          children: [
            new TextRun({ text: "Best Practices", size: 30, bold: true, font: HEADING_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "1.  ", size: 22, font: BODY_FONT, color: COLORS.orange.replace("#", ""), bold: true }),
            new TextRun({ text: "Always pre-install Poppins and Lora fonts for the most authentic brand expression. Fallbacks (Arial / Georgia) are acceptable but produce a slightly different feel.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "2.  ", size: 22, font: BODY_FONT, color: COLORS.orange.replace("#", ""), bold: true }),
            new TextRun({ text: "Use the dark colour (#141413) for primary text on light backgrounds — never pure black. The warm undertone is essential to the brand's approachable character.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "3.  ", size: 22, font: BODY_FONT, color: COLORS.orange.replace("#", ""), bold: true }),
            new TextRun({ text: "Cycle through orange, blue and green accents when styling multiple shapes or graphic elements. Avoid using a single accent colour everywhere.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "4.  ", size: 22, font: BODY_FONT, color: COLORS.orange.replace("#", ""), bold: true }),
            new TextRun({ text: "Maintain generous white space. The light (#FAF9F5) and light gray (#E8E6DC) backgrounds create breathing room — avoid overcrowding elements.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: "5.  ", size: 22, font: BODY_FONT, color: COLORS.orange.replace("#", ""), bold: true }),
            new TextRun({ text: "Preserve text hierarchy. Headings should always use a larger font size (24pt+) with Poppins; body text should consistently use Lora for a unified reading experience.", size: 22, font: BODY_FONT, color: COLORS.dark.replace("#", "") }),
          ],
        }),
      ],
    },
  ],
});

// ============================================================
// WRITE FILE
// ============================================================
const OUTPUT = "Anthropic_Brand_Style_Guide.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`✅ Generated: ${OUTPUT}  (${(buffer.length / 1024).toFixed(1)} KB)`);
});
