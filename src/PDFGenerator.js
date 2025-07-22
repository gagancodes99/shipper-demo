import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

// Exact app theme colors matching screen designs
const THEME_COLORS = {
  // Primary brand gradient: bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600
  primary: {
    blue500: [59, 130, 246], // blue-500
    blue600: [37, 99, 235], // blue-600
    purple600: [147, 51, 234], // purple-600
  },
  // Secondary gradients
  blue: {
    50: [240, 249, 255], // blue-50
    100: [219, 234, 254], // blue-100
    200: [191, 219, 254], // blue-200
    300: [147, 197, 253], // blue-300
    600: [37, 99, 235], // blue-600
    700: [29, 78, 216], // blue-700
    800: [30, 64, 175], // blue-800
    900: [30, 58, 138], // blue-900
  },
  emerald: {
    100: [209, 250, 229], // emerald-100
    200: [167, 243, 208], // emerald-200
    500: [16, 185, 129], // emerald-500
    600: [5, 150, 105], // emerald-600
    700: [4, 120, 87], // emerald-700
    800: [6, 95, 70], // emerald-800
  },
  red: {
    500: [239, 68, 68], // red-500
    600: [220, 38, 127], // red-600
    700: [185, 28, 28], // red-700
    800: [153, 27, 27], // red-800
  },
  purple: {
    50: [250, 245, 255], // purple-50
    200: [221, 214, 254], // purple-200
    800: [109, 40, 217], // purple-800
    900: [88, 28, 135], // purple-900
  },
  orange: {
    500: [249, 115, 22], // orange-500
    600: [234, 88, 12], // orange-600
    700: [194, 65, 12], // orange-700
  },
  slate: {
    50: [248, 250, 252], // slate-50
    100: [241, 245, 249], // slate-100
    200: [226, 232, 240], // slate-200
    300: [203, 213, 225], // slate-300
    400: [148, 163, 184], // slate-400
    500: [100, 116, 139], // slate-500
    600: [71, 85, 105], // slate-600
    700: [51, 65, 85], // slate-700
    800: [30, 41, 59], // slate-800
  },
  amber: {
    50: [255, 251, 235], // amber-50
    100: [254, 243, 199], // amber-100
    200: [253, 230, 138], // amber-200
    800: [146, 64, 14], // amber-800
  },
  indigo: {
    50: [238, 242, 255], // indigo-50
  },
  white: [255, 255, 255], // white
};

// Utility functions for data formatting
const formatAddress = (address) => {
  if (!address) return "No address provided";
  return `${address.address}, ${address.suburb} ${address.postcode}`;
};

const getJobTypeLabel = (jobType) => {
  const labels = {
    single: "Single Pickup/Drop",
    "multi-pickup": "Multi-Pickup",
    "multi-drop": "Multi-Drop",
  };
  return labels[jobType] || jobType;
};

const formatDetailedPackaging = (packagingTypes) => {
  if (!packagingTypes) return "No packaging specified";

  const details = [];

  // Pallets with detailed breakdown
  if (packagingTypes.pallets?.selected) {
    const count = packagingTypes.pallets.quantity || "Not specified";
    const weight = packagingTypes.pallets.weight
      ? `${packagingTypes.pallets.weight}kg`
      : "Weight not specified";
    const secured = packagingTypes.pallets.secured ? "Secured" : "Unsecured";

    let palletBreakdown = `Pallets: ${count} (${weight}) - ${secured}`;

    // Add pallet type breakdown if available
    if (packagingTypes.pallets.palletTypes) {
      const types = [];
      const pt = packagingTypes.pallets.palletTypes;
      if (pt.CHEP) types.push(`CHEP: ${pt.CHEP}`);
      if (pt.LOSCAM) types.push(`LOSCAM: ${pt.LOSCAM}`);
      if (pt.Plain) types.push(`Plain Wood: ${pt.Plain}`);
      if (pt.Other) types.push(`Other: ${pt.Other}`);
      if (types.length > 0) {
        palletBreakdown += `\n  Types: ${types.join(", ")}`;
      }
      if (pt.otherDimensions) {
        palletBreakdown += `\n  Other Dimensions: ${pt.otherDimensions}`;
      }
    }

    details.push(palletBreakdown);
  }

  // Boxes with dimensions
  if (packagingTypes.boxes?.selected) {
    const count = packagingTypes.boxes.quantity || "Not specified";
    const weight = packagingTypes.boxes.weight
      ? `${packagingTypes.boxes.weight}kg`
      : "Weight not specified";
    const dimensions =
      packagingTypes.boxes.dimensions || "Dimensions not specified";
    details.push(`Boxes: ${count} (${weight})\n  Dimensions: ${dimensions}`);
  }

  // Bags with dimensions
  if (packagingTypes.bags?.selected) {
    const count = packagingTypes.bags.quantity || "Not specified";
    const weight = packagingTypes.bags.weight
      ? `${packagingTypes.bags.weight}kg`
      : "Weight not specified";
    const dimensions =
      packagingTypes.bags.dimensions || "Dimensions not specified";
    details.push(`Bags: ${count} (${weight})\n  Dimensions: ${dimensions}`);
  }

  // Loose items with dimensions
  if (packagingTypes.others?.selected) {
    const count = packagingTypes.others.quantity || "Not specified";
    const weight = packagingTypes.others.weight
      ? `${packagingTypes.others.weight}kg`
      : "Weight not specified";
    const dimensions =
      packagingTypes.others.dimensions || "Dimensions not specified";
    details.push(
      `Loose Items: ${count} (${weight})\n  Dimensions: ${dimensions}`
    );
  }

  return details.length > 0 ? details.join("\n\n") : "No packaging specified";
};

const formatVehicleDetails = (vehicle, truckBodyType, isRefrigerated) => {
  if (!vehicle) return "No vehicle specified";

  let details = `${vehicle.name} (${vehicle.capacity})`;
  if (vehicle.pallets) details += `\nPallet Capacity: ${vehicle.pallets}`;
  if (vehicle.maxWeight) details += `\nMax Weight: ${vehicle.maxWeight} tonnes`;
  if (truckBodyType) details += `\nBody Type: ${truckBodyType}`;
  if (isRefrigerated) details += `\nRefrigerated: Yes`;

  return details;
};

const calculateTotalWeight = (goodsArray) => {
  if (!goodsArray || goodsArray.length === 0) return 0;

  return goodsArray.reduce((total, goods) => {
    if (!goods?.packagingTypes) return total;

    const pt = goods.packagingTypes;
    let weight = 0;

    if (pt.pallets?.selected && pt.pallets.weight) weight += pt.pallets.weight;
    if (pt.boxes?.selected && pt.boxes.weight) weight += pt.boxes.weight;
    if (pt.bags?.selected && pt.bags.weight) weight += pt.bags.weight;
    if (pt.others?.selected && pt.others.weight) weight += pt.others.weight;

    return total + weight;
  }, 0);
};

const calculateTotalItems = (goodsArray) => {
  if (!goodsArray || goodsArray.length === 0) return 0;

  return goodsArray.reduce((total, goods) => {
    if (!goods?.packagingTypes) return total;

    const pt = goods.packagingTypes;
    let count = 0;

    if (pt.pallets?.selected && pt.pallets.quantity)
      count += pt.pallets.quantity;
    if (pt.boxes?.selected && pt.boxes.quantity) count += pt.boxes.quantity;
    if (pt.bags?.selected && pt.bags.quantity) count += pt.bags.quantity;
    if (pt.others?.selected && pt.others.quantity) count += pt.others.quantity;

    return total + count;
  }, 0);
};

const generateQRCodeDataURL = async (data) => {
  try {
    return await QRCode.toDataURL(data, { width: 80, margin: 1 });
  } catch (err) {
    console.error("QR Code generation error:", err);
    return null;
  }
};

const generateBarcodeDataURL = (data) => {
  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, data, {
      format: "CODE128",
      width: 2,
      height: 40,
      displayValue: false,
    });
    return canvas.toDataURL();
  } catch (err) {
    console.error("Barcode generation error:", err);
    return null;
  }
};

// Card component helper with dynamic height calculation
const drawDynamicCard = (doc, x, y, width, content, options = {}) => {
  const {
    fillColor = THEME_COLORS.white,
    borderColor = THEME_COLORS.slate[200],
    cornerRadius = 3,
    padding = 5,
    title = "",
    titleSize = 9,
    titleColor = THEME_COLORS.slate[800],
    lineHeight = 5,
    fontSize = 7,
    textColor = THEME_COLORS.slate[600],
    boldTextColor = THEME_COLORS.slate[700],
  } = options;

  // Calculate content height
  let contentHeight = 0;
  const tempY = y + padding + (title ? titleSize + 5 : 0);

  if (Array.isArray(content)) {
    contentHeight = content.reduce((height, item) => {
      if (item.type === "text") {
        const lines = doc.splitTextToSize(item.text, width - padding * 2);
        return height + lines.length * lineHeight;
      } else if (item.type === "table") {
        return height + item.rows.length * lineHeight * 1.5 + 10;
      }
      return height;
    }, 0);
  } else if (typeof content === "string") {
    const lines = doc.splitTextToSize(content, width - padding * 2);
    contentHeight = lines.length * lineHeight;
  }

  // Add padding and title space
  const cardHeight = contentHeight + padding * 2 + (title ? titleSize + 5 : 0);

  // Draw card background
  doc.setFillColor(...fillColor);
  doc.roundedRect(x, y, width, cardHeight, cornerRadius, cornerRadius, "F");

  // Draw border
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, width, cardHeight, cornerRadius, cornerRadius, "S");

  // Add title if provided
  if (title) {
    doc.setFontSize(titleSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...titleColor);
    doc.text(title, x + padding, y + padding + titleSize);
  }

  // Add content
  let currentY = y + padding + (title ? titleSize + 5 : 0);

  if (Array.isArray(content)) {
    content.forEach((item) => {
      if (item.type === "text") {
        doc.setFontSize(fontSize);
        if (item.bold) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...boldTextColor);
        } else {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(...textColor);
        }

        const lines = doc.splitTextToSize(item.text, width - padding * 2);
        doc.text(lines, x + padding, currentY);
        currentY += lines.length * lineHeight;
      } else if (item.type === "table") {
        // Inside drawDynamicCard function, update the autoTable configuration:
        doc.autoTable({
          startY: currentY,
          head: [item.headers],
          body: item.rows,
          margin: { left: x + padding },
          tableWidth: width - padding * 2,
          styles: {
            fontSize: 9, // Increased from fontSize - 1
            cellPadding: 3, // Increased padding
            overflow: "linebreak",
            halign: "left",
            valign: "middle",
            font: "helvetica", // Explicit font
            lineWidth: 0.1, // Thinner borders
            lineColor: [200, 200, 200], // Lighter border color
          },
          headStyles: {
            fillColor: [...borderColor, 50],
            textColor: boldTextColor,
            fontStyle: "bold",
            fontSize: 9, // Consistent header size
            cellPadding: 4, // Slightly more padding for headers
          },
          bodyStyles: {
            textColor: textColor,
            fontSize: 8, // Slightly smaller than header but still readable
            cellPadding: 2,
          },
          columnStyles: item.columnStyles || {},
        });
        currentY = doc.lastAutoTable.finalY + 5;
      }
    });
  } else if (typeof content === "string") {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    const lines = doc.splitTextToSize(content, width - padding * 2);
    doc.text(lines, x + padding, currentY);
  }

  return { height: cardHeight, finalY: currentY };
};

// Gradient background helper matching app screens
const drawGradientBackground = (doc, x, y, width, height, colors) => {
  const steps = 20;
  const stepHeight = height / steps;

  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(colors[0][0] + (colors[1][0] - colors[0][0]) * ratio);
    const g = Math.round(colors[0][1] + (colors[1][1] - colors[0][1]) * ratio);
    const b = Math.round(colors[0][2] + (colors[1][2] - colors[0][2]) * ratio);

    doc.setFillColor(r, g, b);
    doc.rect(x, y + i * stepHeight, width, stepHeight + 1, "F");
  }
};

// Three-color gradient helper for primary brand gradient
const drawTripleGradient = (
  doc,
  x,
  y,
  width,
  height,
  color1,
  color2,
  color3
) => {
  const steps = 30;
  const stepWidth = width / steps;

  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    let r, g, b;

    if (ratio <= 0.5) {
      const localRatio = ratio * 2;
      r = Math.round(color1[0] + (color2[0] - color1[0]) * localRatio);
      g = Math.round(color1[1] + (color2[1] - color1[1]) * localRatio);
      b = Math.round(color1[2] + (color2[2] - color1[2]) * localRatio);
    } else {
      const localRatio = (ratio - 0.5) * 2;
      r = Math.round(color2[0] + (color3[0] - color2[0]) * localRatio);
      g = Math.round(color2[1] + (color3[1] - color2[1]) * localRatio);
      b = Math.round(color2[2] + (color3[2] - color2[2]) * localRatio);
    }

    doc.setFillColor(r, g, b);
    doc.rect(x + i * stepWidth, y, stepWidth + 1, height, "F");
  }
};

// Compact section header
const drawSectionHeader = (
  doc,
  x,
  y,
  width,
  height,
  title,
  subtitle = "",
  isPickup = false,
  isDelivery = false
) => {
  if (isPickup) {
    drawGradientBackground(doc, x, y, width, height, [
      THEME_COLORS.emerald[500],
      THEME_COLORS.emerald[600],
    ]);
  } else if (isDelivery) {
    drawGradientBackground(doc, x, y, width, height, [
      THEME_COLORS.red[500],
      THEME_COLORS.red[600],
    ]);
  } else {
    drawTripleGradient(
      doc,
      x,
      y,
      width,
      height,
      THEME_COLORS.primary.blue500,
      THEME_COLORS.primary.blue600,
      THEME_COLORS.primary.purple600
    );
  }

  // Standardized text positioning for 25px height
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(title, x + width / 2, y + height / 2 - 2, { align: "center" });

  if (subtitle) {
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, x + width / 2, y + height / 2 + 6, { align: "center" });
  }
};

// Main PDF generation function
export const generateBookingPDF = async (jobData, jobId, otp) => {
  try {
    // Initialize jsPDF with autotable plugin
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Properly initialize autoTable (critical fix)

    // Calculate total pages for proper numbering
    let totalPages = 1; // Summary page
    totalPages += jobData.pickups?.length || 0; // Pickup pages

    // Calculate delivery pages based on packaging units
    if (jobData.deliveries && jobData.deliveries.length > 0) {
      jobData.deliveries.forEach((delivery, i) => {
        const goods = jobData.deliveryGoods?.[i];
        let packagingUnitCount = 0;

        if (goods?.packagingTypes) {
          const packagingTypes = ["pallets", "boxes", "bags", "others"];
          packagingTypes.forEach((type) => {
            const pkg = goods.packagingTypes[type];
            if (pkg && pkg.selected && pkg.quantity) {
              packagingUnitCount += pkg.quantity;
            }
          });
        }

        totalPages += Math.max(packagingUnitCount, 1); // At least 1 page per delivery
      });
    }

    // Generate barcodes and QR codes
    const barcodeDataURL = generateBarcodeDataURL(jobId);

    // Generate summary page
    await generateSummaryPage(
      doc,
      jobData,
      jobId,
      otp,
      barcodeDataURL,
      totalPages
    );

    // Generate pickup pages
    if (jobData.pickups && jobData.pickups.length > 0) {
      for (let i = 0; i < jobData.pickups.length; i++) {
        doc.addPage();
        await generatePickupPage(
          doc,
          jobData.pickups[i],
          i,
          jobData,
          jobId,
          totalPages
        );
      }
    }

    // Generate delivery pages
    if (jobData.deliveries && jobData.deliveries.length > 0) {
      for (let i = 0; i < jobData.deliveries.length; i++) {
        const delivery = jobData.deliveries[i];
        const goods = jobData.deliveryGoods?.[i];

        const packagingUnits = [];

        if (goods?.packagingTypes) {
          const packagingTypes = {
            pallets: "Pallet",
            boxes: "Box",
            bags: "Bag",
            others: "Loose Item",
          };

          Object.entries(packagingTypes).forEach(([type, label]) => {
            const pkg = goods.packagingTypes[type];
            if (pkg && pkg.selected && pkg.quantity) {
              for (let unitIndex = 0; unitIndex < pkg.quantity; unitIndex++) {
                packagingUnits.push({
                  type: type,
                  label: label,
                  unitIndex: unitIndex + 1,
                  totalUnits: pkg.quantity,
                  packageData: pkg,
                });
              }
            }
          });
        }

        if (packagingUnits.length === 0) {
          packagingUnits.push({
            type: "delivery",
            label: "Delivery",
            unitIndex: 1,
            totalUnits: 1,
            packageData: null,
          });
        }

        for (let unitIdx = 0; unitIdx < packagingUnits.length; unitIdx++) {
          doc.addPage();
          await generateDeliveryPage(
            doc,
            delivery,
            i,
            jobData,
            jobId,
            packagingUnits[unitIdx],
            packagingUnits.length,
            totalPages
          );
        }
      }
    }

    return doc;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

// Generate compact master documentation page with dynamic cards
const generateSummaryPage = async (
  doc,
  jobData,
  jobId,
  otp,
  barcodeDataURL,
  totalPages
) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Main background
  doc.setFillColor(...THEME_COLORS.slate[50]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Standardized header height
  drawTripleGradient(
    doc,
    0,
    0,
    pageWidth,
    25,
    THEME_COLORS.primary.blue500,
    THEME_COLORS.primary.blue600,
    THEME_COLORS.primary.purple600
  );

  // Compact header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PHOENIX PRIME SHIPPER - MASTER DOCUMENTATION", pageWidth / 2, 15, {
    align: "center",
  });

  let yPos = 30;

  // Job Information Card with table format
  const jobInfoContent = [
    {
      type: "table",
      headers: ["Field", "Value", "Field", "Value"],
      rows: [
        [
          { content: "Job ID:", styles: { fontStyle: "bold" } },
          jobId,
          { content: "Driver OTP:", styles: { fontStyle: "bold" } },
          otp.toString(),
        ],
        [
          { content: "Date Created:", styles: { fontStyle: "bold" } },
          new Date().toLocaleDateString(),
          { content: "Time Created:", styles: { fontStyle: "bold" } },
          new Date().toLocaleTimeString(),
        ],
        [
          { content: "Job Type:", styles: { fontStyle: "bold" } },
          getJobTypeLabel(jobData.jobType),
          { content: "Status:", styles: { fontStyle: "bold" } },
          "Confirmed",
        ],
        [
          { content: "Total Locations:", styles: { fontStyle: "bold" } },
          `${jobData.pickups?.length || 0}P / ${
            jobData.deliveries?.length || 0
          }D`,
          { content: "Transfer Type:", styles: { fontStyle: "bold" } },
          jobData.transferType || "Standard",
        ],
        [
          { content: "Service Level:", styles: { fontStyle: "bold" } },
          jobData.isRefrigerated ? "Refrigerated" : "Standard",
          "",
          "",
        ],
      ],
      // Example for jobInfoContent table:
      columnStyles: {
        0: { cellWidth: 40, halign: "left" }, // Increased from 35
        1: { cellWidth: 45, halign: "left" }, // Increased from 40
        2: { cellWidth: 40, halign: "left" }, // Increased from 35
        3: { cellWidth: 45, halign: "left" }, // Increased from 40
      },
    },
  ];

  const jobInfoCard = drawDynamicCard(
    doc,
    5,
    yPos,
    pageWidth - 10,
    jobInfoContent,
    {
      title: "JOB DETAILS",
      fillColor: THEME_COLORS.white,
      borderColor: THEME_COLORS.slate[200],
    }
  );
  yPos += jobInfoCard.height + 10;

  // Vehicle & Service Information Card with table format
  const vehicle = jobData.vehicle || {};
  const vehicleContent = [
    {
      type: "table",
      headers: ["Field", "Value", "Field", "Value"],
      rows: [
        [
          { content: "Vehicle:", styles: { fontStyle: "bold" } },
          vehicle.name || "N/A",
          { content: "Capacity:", styles: { fontStyle: "bold" } },
          vehicle.capacity || "N/A",
        ],
        [
          { content: "Max Weight:", styles: { fontStyle: "bold" } },
          vehicle.maxWeight ? `${vehicle.maxWeight} tonnes` : "N/A",
          { content: "Pallet Capacity:", styles: { fontStyle: "bold" } },
          vehicle.pallets ? `${vehicle.pallets} pallets` : "N/A",
        ],
        [
          { content: "Body Type:", styles: { fontStyle: "bold" } },
          jobData.truckBodyType || "Standard",
          { content: "Refrigeration:", styles: { fontStyle: "bold" } },
          jobData.isRefrigerated ? "Required" : "Not Required",
        ],
      ],
      // Example for jobInfoContent table:
      columnStyles: {
        0: { cellWidth: 40, halign: "left" }, // Increased from 35
        1: { cellWidth: 45, halign: "left" }, // Increased from 40
        2: { cellWidth: 40, halign: "left" }, // Increased from 35
        3: { cellWidth: 45, halign: "left" }, // Increased from 40
      },
    },
  ];

  const vehicleCard = drawDynamicCard(
    doc,
    5,
    yPos,
    pageWidth - 10,
    vehicleContent,
    {
      title: "VEHICLE & SERVICE SPECIFICATIONS",
      fillColor: THEME_COLORS.white,
      borderColor: THEME_COLORS.slate[200],
    }
  );
  yPos += vehicleCard.height + 10;

  // Pickup Locations Section
  if (jobData.pickups && jobData.pickups.length > 0) {
    const pickupContent = jobData.pickups
      .map((pickup, index) => {
        const goods = jobData.pickupGoods?.[index];
        const addressLines = doc.splitTextToSize(
          formatAddress(pickup.address),
          pageWidth - 85
        );
        const packagingSummary = goods
          ? formatDetailedPackaging(goods.packagingTypes).replace(/\n/g, " | ")
          : "No packaging specified";
        const packagingLines = doc.splitTextToSize(
          packagingSummary,
          pageWidth - 60
        );
        const instructionLines = pickup.instructions
          ? doc.splitTextToSize(pickup.instructions, pageWidth - 60)
          : [];

        return [
          {
            type: "text",
            text: `${index + 1}. ${pickup.customerName || "N/A"}`,
            bold: true,
          },
          {
            type: "table",
            headers: ["Field", "Value"],
            rows: [
              [
                { content: "Address:", styles: { fontStyle: "bold" } },
                { content: addressLines, styles: { valign: "middle" } },
              ],
              [
                { content: "Schedule:", styles: { fontStyle: "bold" } },
                `${pickup.date || "N/A"} at ${pickup.time || "N/A"}`,
              ],
              [
                { content: "Contact:", styles: { fontStyle: "bold" } },
                pickup.recipientMobile || "N/A",
              ],
              goods
                ? [
                    { content: "Goods:", styles: { fontStyle: "bold" } },
                    goods.description || "N/A",
                  ]
                : ["", ""],
              goods
                ? [
                    { content: "Method:", styles: { fontStyle: "bold" } },
                    goods.pickupMethod || "N/A",
                  ]
                : ["", ""],
              goods
                ? [
                    { content: "Packaging:", styles: { fontStyle: "bold" } },
                    { content: packagingLines, styles: { valign: "middle" } },
                  ]
                : ["", ""],
            ],
            columnStyles: {
              0: { cellWidth: 35, halign: "left" },
              1: { cellWidth: "auto", halign: "left" },
            },
          },
          ...(pickup.instructions
            ? [
                {
                  type: "text",
                  text: `Instructions: ${pickup.instructions}`,
                  bold: false,
                },
              ]
            : []),
        ];
      })
      .flat();

    const pickupCard = drawDynamicCard(
      doc,
      5,
      yPos,
      pageWidth - 10,
      pickupContent,
      {
        title: "PICKUP LOCATIONS",
        fillColor: THEME_COLORS.emerald[100],
        borderColor: THEME_COLORS.emerald[200],
        titleColor: THEME_COLORS.emerald[800],
      }
    );
    yPos += pickupCard.height + 10;
  }

  // Delivery Locations Section
  if (jobData.deliveries && jobData.deliveries.length > 0) {
    const deliveryContent = jobData.deliveries
      .map((delivery, index) => {
        const goods = jobData.deliveryGoods?.[index];
        const addressLines = doc.splitTextToSize(
          formatAddress(delivery.address),
          pageWidth - 85
        );
        const packagingSummary = goods
          ? formatDetailedPackaging(goods.packagingTypes).replace(/\n/g, " | ")
          : "No packaging specified";
        const packagingLines = doc.splitTextToSize(
          packagingSummary,
          pageWidth - 60
        );
        const instructionLines = delivery.instructions
          ? doc.splitTextToSize(delivery.instructions, pageWidth - 60)
          : [];

        return [
          {
            type: "text",
            text: `${index + 1}. ${delivery.customerName || "N/A"}`,
            bold: true,
          },
          {
            type: "table",
            headers: ["Field", "Value"],
            rows: [
              [
                { content: "Address:", styles: { fontStyle: "bold" } },
                { content: addressLines, styles: { valign: "middle" } },
              ],
              [
                { content: "Schedule:", styles: { fontStyle: "bold" } },
                `${delivery.date || "N/A"} at ${delivery.time || "N/A"}`,
              ],
              [
                { content: "Trading Hours:", styles: { fontStyle: "bold" } },
                delivery.tradingHours || "N/A",
              ],
              goods
                ? [
                    { content: "Goods:", styles: { fontStyle: "bold" } },
                    goods.description || "N/A",
                  ]
                : ["", ""],
              goods
                ? [
                    { content: "Method:", styles: { fontStyle: "bold" } },
                    goods.deliveryMethod || "N/A",
                  ]
                : ["", ""],
              goods
                ? [
                    { content: "Packaging:", styles: { fontStyle: "bold" } },
                    { content: packagingLines, styles: { valign: "middle" } },
                  ]
                : ["", ""],
            ],
            columnStyles: {
              0: { cellWidth: 35, halign: "left" },
              1: { cellWidth: "auto", halign: "left" },
            },
          },
          ...(delivery.instructions
            ? [
                {
                  type: "text",
                  text: `Instructions: ${delivery.instructions}`,
                  bold: false,
                },
              ]
            : []),
        ];
      })
      .flat();

    const deliveryCard = drawDynamicCard(
      doc,
      5,
      yPos,
      pageWidth - 10,
      deliveryContent,
      {
        title: "DELIVERY LOCATIONS",
        fillColor: THEME_COLORS.red[100],
        borderColor: THEME_COLORS.red[200],
        titleColor: THEME_COLORS.red[800],
      }
    );
    yPos += deliveryCard.height + 10;
  }

  // Shipment Totals & Calculations
  const totalPickupWeight = calculateTotalWeight(jobData.pickupGoods || []);
  const totalDeliveryWeight = calculateTotalWeight(jobData.deliveryGoods || []);
  const totalPickupItems = calculateTotalItems(jobData.pickupGoods || []);
  const totalDeliveryItems = calculateTotalItems(jobData.deliveryGoods || []);

  const totalsContent = [
    {
      type: "table",
      headers: ["Field", "Value", "Field", "Value"],
      rows: [
        [
          { content: "Total Weight:", styles: { fontStyle: "bold" } },
          `${totalPickupWeight + totalDeliveryWeight}kg`,
          { content: "Total Items:", styles: { fontStyle: "bold" } },
          `${totalPickupItems + totalDeliveryItems} pieces`,
        ],
        [
          { content: "Total Locations:", styles: { fontStyle: "bold" } },
          `${
            (jobData.pickups?.length || 0) + (jobData.deliveries?.length || 0)
          }`,
          "",
          "",
        ],
        [
          {
            content: "Pickup Weight:",
            styles: { fontStyle: "bold", textColor: THEME_COLORS.emerald[700] },
          },
          {
            content: `${totalPickupWeight}kg`,
            styles: { textColor: THEME_COLORS.emerald[600] },
          },
          {
            content: "Pickup Items:",
            styles: { fontStyle: "bold", textColor: THEME_COLORS.emerald[700] },
          },
          {
            content: `${totalPickupItems} pieces`,
            styles: { textColor: THEME_COLORS.emerald[600] },
          },
        ],
        [
          {
            content: "Delivery Weight:",
            styles: { fontStyle: "bold", textColor: THEME_COLORS.red[700] },
          },
          {
            content: `${totalDeliveryWeight}kg`,
            styles: { textColor: THEME_COLORS.red[600] },
          },
          {
            content: "Delivery Items:",
            styles: { fontStyle: "bold", textColor: THEME_COLORS.red[700] },
          },
          {
            content: `${totalDeliveryItems} pieces`,
            styles: { textColor: THEME_COLORS.red[600] },
          },
        ],
        [
          {
            content: "Pickup Locations:",
            styles: { fontStyle: "bold", textColor: THEME_COLORS.emerald[700] },
          },
          {
            content: `${jobData.pickups?.length || 0}`,
            styles: { textColor: THEME_COLORS.emerald[600] },
          },
          {
            content: "Delivery Locations:",
            styles: { fontStyle: "bold", textColor: THEME_COLORS.red[700] },
          },
          {
            content: `${jobData.deliveries?.length || 0}`,
            styles: { textColor: THEME_COLORS.red[600] },
          },
        ],
      ],
      // Example for jobInfoContent table:
      columnStyles: {
        0: { cellWidth: 40, halign: "left" }, // Increased from 35
        1: { cellWidth: 45, halign: "left" }, // Increased from 40
        2: { cellWidth: 40, halign: "left" }, // Increased from 35
        3: { cellWidth: 45, halign: "left" }, // Increased from 40
      },
    },
  ];

  const totalsCard = drawDynamicCard(
    doc,
    5,
    yPos,
    pageWidth - 10,
    totalsContent,
    {
      title: "SHIPMENT TOTALS & CALCULATIONS",
      fillColor: THEME_COLORS.white,
      borderColor: THEME_COLORS.slate[200],
    }
  );
  yPos += totalsCard.height + 10;

  // Compact barcode
  if (barcodeDataURL) {
    drawDynamicCard(doc, 5, yPos, pageWidth - 10, [], {
      fillColor: THEME_COLORS.white,
      borderColor: THEME_COLORS.slate[200],
      title: "MASTER TRACKING CODE",
    });
    doc.addImage(barcodeDataURL, "PNG", 10, yPos + 15, pageWidth - 20, 14);
    yPos += 35;
  }

  // Footer with app branding
  drawTripleGradient(
    doc,
    0,
    pageHeight - 25,
    pageWidth,
    25,
    THEME_COLORS.primary.blue500,
    THEME_COLORS.primary.blue600,
    THEME_COLORS.primary.purple600
  );

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Generated by Phoenix Prime Shipper",
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" }
  );
  doc.setFontSize(8);
  doc.text(`Page 1 of ${totalPages}`, pageWidth / 2, pageHeight - 7, {
    align: "center",
  });
};

// Generate comprehensive pickup page with dynamic cards
const generatePickupPage = async (
  doc,
  pickup,
  index,
  jobData,
  jobId,
  totalPages
) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Clean white page background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Standardized header height
  const title =
    jobData.pickups.length > 1
      ? `PICKUP LOCATION ${index + 1}`
      : "PICKUP LOCATION";
  drawSectionHeader(
    doc,
    0,
    0,
    pageWidth,
    25,
    title,
    "Collection Details",
    true,
    false
  );

  let yPos = 30;
  const goods = jobData.pickupGoods?.[index];
  const addressLines = doc.splitTextToSize(
    formatAddress(pickup.address),
    pageWidth - 90
  );

  // Customer Information Card
  const customerContent = [
    {
      type: "table",
      headers: ["Field", "Value", "Field", "Value"],
      rows: [
        [
          { content: "Customer:", styles: { fontStyle: "bold" } },
          pickup.customerName || "N/A",
          { content: "Mobile:", styles: { fontStyle: "bold" } },
          pickup.recipientMobile || "N/A",
        ],
        [
          { content: "Address:", styles: { fontStyle: "bold" } },
          { content: addressLines, styles: { valign: "middle" } },
          "",
          "",
        ],
      ],
      // Example for jobInfoContent table:
      columnStyles: {
        0: { cellWidth: 40, halign: "left" }, // Increased from 35
        1: { cellWidth: 45, halign: "left" }, // Increased from 40
        2: { cellWidth: 40, halign: "left" }, // Increased from 35
        3: { cellWidth: 45, halign: "left" }, // Increased from 40
      },
    },
  ];

  const customerCard = drawDynamicCard(
    doc,
    10,
    yPos,
    pageWidth - 20,
    customerContent,
    {
      title: "CUSTOMER INFORMATION",
      fillColor: THEME_COLORS.white,
      borderColor: THEME_COLORS.slate[200],
    }
  );
  yPos += customerCard.height + 10;

  // Schedule Information Card
  const scheduleContent = [
    {
      type: "table",
      headers: ["Field", "Value", "Field", "Value"],
      rows: [
        [
          { content: "Date:", styles: { fontStyle: "bold" } },
          pickup.date || "N/A",
          { content: "Time:", styles: { fontStyle: "bold" } },
          pickup.time || "N/A",
        ],
        [
          { content: "Trading Hours:", styles: { fontStyle: "bold" } },
          pickup.tradingHours || "N/A",
          "",
          "",
        ],
      ],
      // Example for jobInfoContent table:
      columnStyles: {
        0: { cellWidth: 40, halign: "left" }, // Increased from 35
        1: { cellWidth: 45, halign: "left" }, // Increased from 40
        2: { cellWidth: 40, halign: "left" }, // Increased from 35
        3: { cellWidth: 45, halign: "left" }, // Increased from 40
      },
    },
  ];

  const scheduleCard = drawDynamicCard(
    doc,
    10,
    yPos,
    pageWidth - 20,
    scheduleContent,
    {
      title: "SCHEDULE INFORMATION",
      fillColor: THEME_COLORS.white,
      borderColor: THEME_COLORS.slate[200],
    }
  );
  yPos += scheduleCard.height + 10;

  // Special Instructions Card (if exists)
  if (pickup.instructions) {
    const instructionsCard = drawDynamicCard(
      doc,
      10,
      yPos,
      pageWidth - 20,
      [
        {
          type: "text",
          text: pickup.instructions,
        },
      ],
      {
        title: "SPECIAL INSTRUCTIONS",
        fillColor: THEME_COLORS.blue[50],
        borderColor: THEME_COLORS.blue[200],
        titleColor: THEME_COLORS.blue[800],
        textColor: THEME_COLORS.blue[900],
      }
    );
    yPos += instructionsCard.height + 10;
  }

  // Appointment Details Card (if exists)
  if (pickup.appointmentDetails) {
    const appointmentCard = drawDynamicCard(
      doc,
      10,
      yPos,
      pageWidth - 20,
      [
        {
          type: "text",
          text: pickup.appointmentDetails,
        },
      ],
      {
        title: "APPOINTMENT DETAILS",
        fillColor: THEME_COLORS.purple[50],
        borderColor: THEME_COLORS.purple[200],
        titleColor: THEME_COLORS.purple[800],
        textColor: THEME_COLORS.purple[900],
      }
    );
    yPos += appointmentCard.height + 10;
  }

  // Goods Information Card (if exists)
  if (goods) {
    const totalWeight = goods.packagingTypes
      ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
          return sum + (pkg.selected && pkg.weight ? pkg.weight : 0);
        }, 0)
      : 0;

    const totalItems = goods.packagingTypes
      ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
          return sum + (pkg.selected && pkg.quantity ? pkg.quantity : 0);
        }, 0)
      : 0;

    const goodsContent = [
      {
        type: "table",
        headers: ["Field", "Value", "Field", "Value"],
        rows: [
          [
            { content: "Description:", styles: { fontStyle: "bold" } },
            goods.description || "N/A",
            { content: "Pickup Method:", styles: { fontStyle: "bold" } },
            goods.pickupMethod || "N/A",
          ],
          [
            { content: "Total Weight:", styles: { fontStyle: "bold" } },
            `${totalWeight}kg`,
            { content: "Total Items:", styles: { fontStyle: "bold" } },
            `${totalItems} pieces`,
          ],
        ],
        // Example for jobInfoContent table:
        columnStyles: {
          0: { cellWidth: 40, halign: "left" }, // Increased from 35
          1: { cellWidth: 45, halign: "left" }, // Increased from 40
          2: { cellWidth: 40, halign: "left" }, // Increased from 35
          3: { cellWidth: 45, halign: "left" }, // Increased from 40
        },
      },
      {
        type: "text",
        text: "PACKAGING DETAILS:",
        bold: true,
      },
    ];

    // Add packaging details
    if (goods.packagingTypes) {
      const packagingTypes = ["pallets", "boxes", "bags", "others"];
      const packagingLabels = {
        pallets: "Pallets",
        boxes: "Boxes",
        bags: "Bags",
        others: "Loose Items",
      };

      packagingTypes.forEach((type) => {
        const pkg = goods.packagingTypes[type];
        if (pkg && pkg.selected) {
          goodsContent.push({
            type: "text",
            text: `${packagingLabels[type]}: ${pkg.quantity || "N/A"} units • ${
              pkg.weight || "N/A"
            }kg • ${pkg.dimensions || "N/A"} • ${
              pkg.secured ? "Secured" : "Unsecured"
            }${pkg.fragile ? " • Fragile" : ""}`,
            bold: false,
          });
        }
      });
    }

    // Add special instructions if they exist
    if (goods.pickupInstructions) {
      goodsContent.push({
        type: "text",
        text: `Special Instructions: ${goods.pickupInstructions}`,
        bold: false,
      });
    }

    const goodsCard = drawDynamicCard(
      doc,
      10,
      yPos,
      pageWidth - 20,
      goodsContent,
      {
        title: "GOODS INFORMATION",
        fillColor: THEME_COLORS.white,
        borderColor: THEME_COLORS.slate[200],
      }
    );
    yPos += goodsCard.height + 10;
  }

  // QR Code
  try {
    const qrData = JSON.stringify({
      type: "PICKUP",
      jobId: jobId,
      locationIndex: index + 1,
      customer: pickup.customerName,
      date: pickup.date,
      time: pickup.time,
    });
    const qrCodeDataURL = await generateQRCodeDataURL(qrData);
    if (qrCodeDataURL) {
      doc.addImage(qrCodeDataURL, "PNG", pageWidth - 60, 35, 50, 50);
      doc.setFontSize(6);
      doc.setTextColor(...THEME_COLORS.slate[500]);
      doc.text("Scan for verification", pageWidth - 35, 90, {
        align: "center",
      });
    }
  } catch (error) {
    console.error("QR code generation failed:", error);
  }

  // Compact footer with emerald gradient
  drawGradientBackground(doc, 0, pageHeight - 18, pageWidth, 18, [
    THEME_COLORS.emerald[500],
    THEME_COLORS.emerald[600],
  ]);
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Phoenix Prime Shipper - Pickup Documentation",
    pageWidth / 2,
    pageHeight - 11,
    { align: "center" }
  );
  doc.setFontSize(6);
  const currentPage = 1 + (index + 1); // Summary page + pickup page number
  doc.text(
    `Job ID: ${jobId} | Location ${
      index + 1
    } | Page ${currentPage} of ${totalPages}`,
    pageWidth / 2,
    pageHeight - 5,
    { align: "center" }
  );
};

// Generate comprehensive delivery page with dynamic cards
const generateDeliveryPage = async (
  doc,
  delivery,
  index,
  jobData,
  jobId,
  packagingUnit,
  totalUnits = 1,
  totalPages
) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Clean white page background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Header with packaging unit information
  const locationTitle =
    jobData.deliveries.length > 1
      ? `DELIVERY LOCATION ${index + 1}`
      : "DELIVERY LOCATION";
  const packageTitle =
    totalUnits > 1
      ? `${packagingUnit.label.toUpperCase()} ${packagingUnit.unitIndex} OF ${
          packagingUnit.totalUnits
        }`
      : "DELIVERY DETAILS";
  drawSectionHeader(
    doc,
    0,
    0,
    pageWidth,
    25,
    locationTitle,
    packageTitle,
    false,
    true
  );

  let yPos = 30;
  const goods = jobData.deliveryGoods?.[index];
  const addressLines = doc.splitTextToSize(
    formatAddress(delivery.address),
    pageWidth - 90
  );

  // Packaging Unit Information Card (if multiple units)
  if (totalUnits > 1) {
    const pkg = packagingUnit.packageData;
    const unitWeight = pkg?.weight
      ? Math.round((pkg.weight / packagingUnit.totalUnits) * 100) / 100
      : null;

    const packagingContent = [
      {
        type: "table",
        headers: ["Field", "Value", "Field", "Value"],
        rows: [
          [
            { content: "Unit Type:", styles: { fontStyle: "bold" } },
            packagingUnit.label,
            { content: "Unit Number:", styles: { fontStyle: "bold" } },
            `${packagingUnit.unitIndex} of ${packagingUnit.totalUnits}`,
          ],
          ...(unitWeight
            ? [
                [
                  { content: "Unit Weight:", styles: { fontStyle: "bold" } },
                  `~${unitWeight}kg`,
                  { content: "Dimensions:", styles: { fontStyle: "bold" } },
                  pkg.dimensions || "N/A",
                ],
              ]
            : []),
          ...(pkg?.secured || pkg?.fragile || pkg?.hazardous
            ? [
                [
                  {
                    content: "Special Handling:",
                    styles: { fontStyle: "bold" },
                  },
                  [
                    ...(pkg.secured ? ["Secured"] : []),
                    ...(pkg.fragile ? ["Fragile"] : []),
                    ...(pkg.hazardous ? ["Hazardous"] : []),
                  ].join(", "),
                  "",
                  "",
                ],
              ]
            : []),
        ],
        // Example for jobInfoContent table:
        columnStyles: {
          0: { cellWidth: 40, halign: "left" }, // Increased from 35
          1: { cellWidth: 45, halign: "left" }, // Increased from 40
          2: { cellWidth: 40, halign: "left" }, // Increased from 35
          3: { cellWidth: 45, halign: "left" }, // Increased from 40
        },
      },
    ];

    const packagingCard = drawDynamicCard(
      doc,
      10,
      yPos,
      pageWidth - 20,
      packagingContent,
      {
        title: "PACKAGING UNIT INFORMATION",
        fillColor: THEME_COLORS.white,
        borderColor: THEME_COLORS.slate[200],
      }
    );
    yPos += packagingCard.height + 10;
  }

  // Customer Information Card
  const customerContent = [
    {
      type: "table",
      headers: ["Field", "Value", "Field", "Value"],
      rows: [
        [
          { content: "Customer:", styles: { fontStyle: "bold" } },
          delivery.customerName || "N/A",
          { content: "Contact:", styles: { fontStyle: "bold" } },
          delivery.contactNumber || "N/A",
        ],
        [
          { content: "Address:", styles: { fontStyle: "bold" } },
          { content: addressLines, styles: { valign: "middle" } },
          "",
          "",
        ],
      ],
      // Example for jobInfoContent table:
      columnStyles: {
        0: { cellWidth: 40, halign: "left" }, // Increased from 35
        1: { cellWidth: 45, halign: "left" }, // Increased from 40
        2: { cellWidth: 40, halign: "left" }, // Increased from 35
        3: { cellWidth: 45, halign: "left" }, // Increased from 40
      },
    },
  ];

  const customerCard = drawDynamicCard(
    doc,
    10,
    yPos,
    pageWidth - 20,
    customerContent,
    {
      title: "CUSTOMER INFORMATION",
      fillColor: THEME_COLORS.white,
      borderColor: THEME_COLORS.slate[200],
    }
  );
  yPos += customerCard.height + 10;

  // Schedule Information Card
  const scheduleContent = [
    {
      type: "table",
      headers: ["Field", "Value", "Field", "Value"],
      rows: [
        [
          { content: "Date:", styles: { fontStyle: "bold" } },
          delivery.date || "N/A",
          { content: "Time:", styles: { fontStyle: "bold" } },
          delivery.time || "N/A",
        ],
        [
          { content: "Trading Hours:", styles: { fontStyle: "bold" } },
          delivery.tradingHours || "N/A",
          "",
          "",
        ],
      ],
      // Example for jobInfoContent table:
      columnStyles: {
        0: { cellWidth: 40, halign: "left" }, // Increased from 35
        1: { cellWidth: 45, halign: "left" }, // Increased from 40
        2: { cellWidth: 40, halign: "left" }, // Increased from 35
        3: { cellWidth: 45, halign: "left" }, // Increased from 40
      },
    },
  ];

  const scheduleCard = drawDynamicCard(
    doc,
    10,
    yPos,
    pageWidth - 20,
    scheduleContent,
    {
      title: "SCHEDULE INFORMATION",
      fillColor: THEME_COLORS.white,
      borderColor: THEME_COLORS.slate[200],
    }
  );
  yPos += scheduleCard.height + 10;

  // Special Instructions Card (if exists)
  if (delivery.instructions) {
    const instructionsCard = drawDynamicCard(
      doc,
      10,
      yPos,
      pageWidth - 20,
      [
        {
          type: "text",
          text: delivery.instructions,
        },
      ],
      {
        title: "SPECIAL INSTRUCTIONS",
        fillColor: THEME_COLORS.blue[50],
        borderColor: THEME_COLORS.blue[200],
        titleColor: THEME_COLORS.blue[800],
        textColor: THEME_COLORS.blue[900],
      }
    );
    yPos += instructionsCard.height + 10;
  }

  // Appointment Details Card (if exists)
  if (delivery.appointmentDetails) {
    const appointmentCard = drawDynamicCard(
      doc,
      10,
      yPos,
      pageWidth - 20,
      [
        {
          type: "text",
          text: delivery.appointmentDetails,
        },
      ],
      {
        title: "APPOINTMENT DETAILS",
        fillColor: THEME_COLORS.purple[50],
        borderColor: THEME_COLORS.purple[200],
        titleColor: THEME_COLORS.purple[800],
        textColor: THEME_COLORS.purple[900],
      }
    );
    yPos += appointmentCard.height + 10;
  }

  // Goods Information Card (if exists)
  if (goods) {
    const totalWeight = goods.packagingTypes
      ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
          return sum + (pkg.selected && pkg.weight ? pkg.weight : 0);
        }, 0)
      : 0;

    const totalItems = goods.packagingTypes
      ? Object.values(goods.packagingTypes).reduce((sum, pkg) => {
          return sum + (pkg.selected && pkg.quantity ? pkg.quantity : 0);
        }, 0)
      : 0;

    const goodsContent = [
      {
        type: "table",
        headers: ["Field", "Value", "Field", "Value"],
        rows: [
          [
            { content: "Description:", styles: { fontStyle: "bold" } },
            goods.description || "N/A",
            { content: "Delivery Method:", styles: { fontStyle: "bold" } },
            goods.deliveryMethod || "N/A",
          ],
          [
            { content: "Total Weight:", styles: { fontStyle: "bold" } },
            `${totalWeight}kg`,
            { content: "Total Items:", styles: { fontStyle: "bold" } },
            `${totalItems} pieces`,
          ],
        ],
        // Example for jobInfoContent table:
        columnStyles: {
          0: { cellWidth: 40, halign: "left" }, // Increased from 35
          1: { cellWidth: 45, halign: "left" }, // Increased from 40
          2: { cellWidth: 40, halign: "left" }, // Increased from 35
          3: { cellWidth: 45, halign: "left" }, // Increased from 40
        },
      },
    ];

    // Add current packaging unit info if multiple units
    if (totalUnits > 1 && packagingUnit.packageData) {
      const pkg = packagingUnit.packageData;
      const unitWeight = pkg.weight
        ? Math.round((pkg.weight / packagingUnit.totalUnits) * 100) / 100
        : null;

      goodsContent.push({
        type: "text",
        text: `THIS ${packagingUnit.label.toUpperCase()}:`,
        bold: true,
      });

      const currentUnitInfo = [];
      if (unitWeight) {
        currentUnitInfo.push(`Weight: ~${unitWeight}kg`);
      }
      if (pkg.dimensions) {
        currentUnitInfo.push(`Dimensions: ${pkg.dimensions}`);
      }

      const characteristics = [];
      if (pkg.secured) characteristics.push("Secured");
      if (pkg.fragile) characteristics.push("Fragile");
      if (pkg.hazardous) characteristics.push("Hazardous");
      if (pkg.temperature) characteristics.push(`${pkg.temperature}°C`);

      if (characteristics.length > 0) {
        currentUnitInfo.push(`Characteristics: ${characteristics.join(" • ")}`);
      }

      goodsContent.push({
        type: "text",
        text: currentUnitInfo.join(" • "),
        bold: false,
      });
    }

    // Add packaging details header
    goodsContent.push({
      type: "text",
      text: "PACKAGING DETAILS:",
      bold: true,
    });

    // Add packaging details
    if (goods.packagingTypes) {
      const packagingTypes = ["pallets", "boxes", "bags", "others"];
      const packagingLabels = {
        pallets: "Pallets",
        boxes: "Boxes",
        bags: "Bags",
        others: "Loose Items",
      };

      packagingTypes.forEach((type) => {
        const pkg = goods.packagingTypes[type];
        if (pkg && pkg.selected) {
          const isCurrentUnit = packagingUnit.type === type;
          const highlightStyle = isCurrentUnit
            ? { textColor: THEME_COLORS.red[600] }
            : {};

          goodsContent.push({
            type: "text",
            text: `${packagingLabels[type]}: ${pkg.quantity || "N/A"} units • ${
              pkg.weight || "N/A"
            }kg • ${pkg.dimensions || "N/A"} • ${
              pkg.secured ? "Secured" : "Unsecured"
            }${pkg.fragile ? " • Fragile" : ""}${
              pkg.hazardous ? " • Hazardous" : ""
            }${isCurrentUnit && totalUnits > 1 ? " → CURRENT UNIT" : ""}`,
            bold: isCurrentUnit,
            styles: highlightStyle,
          });
        }
      });
    }

    // Add special instructions if they exist
    if (goods.deliveryInstructions) {
      goodsContent.push({
        type: "text",
        text: `Special Instructions: ${goods.deliveryInstructions}`,
        bold: false,
      });
    }

    const goodsCard = drawDynamicCard(
      doc,
      10,
      yPos,
      pageWidth - 20,
      goodsContent,
      {
        title: "GOODS INFORMATION",
        fillColor: THEME_COLORS.white,
        borderColor: THEME_COLORS.slate[200],
      }
    );
    yPos += goodsCard.height + 10;
  }

  // QR Code with Packaging Unit Information
  try {
    const qrData = JSON.stringify({
      type: "DELIVERY",
      jobId: jobId,
      locationIndex: index + 1,
      packagingType: packagingUnit.type,
      packagingLabel: packagingUnit.label,
      unitNumber: packagingUnit.unitIndex,
      totalUnits: packagingUnit.totalUnits,
      customer: delivery.customerName,
      date: delivery.date,
      time: delivery.time,
    });
    const qrCodeDataURL = await generateQRCodeDataURL(qrData);
    if (qrCodeDataURL) {
      doc.addImage(qrCodeDataURL, "PNG", pageWidth - 60, 35, 50, 50);
      doc.setFontSize(6);
      doc.setTextColor(...THEME_COLORS.slate[500]);
      if (totalUnits > 1) {
        doc.text(
          `${packagingUnit.label} ${packagingUnit.unitIndex}/${packagingUnit.totalUnits}`,
          pageWidth - 35,
          90,
          { align: "center" }
        );
      } else {
        doc.text("Scan for verification", pageWidth - 35, 90, {
          align: "center",
        });
      }
    }
  } catch (error) {
    console.error("QR code generation failed:", error);
  }

  // Compact footer with red gradient
  drawGradientBackground(doc, 0, pageHeight - 18, pageWidth, 18, [
    THEME_COLORS.red[500],
    THEME_COLORS.red[600],
  ]);

  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "Phoenix Prime Shipper - Delivery Documentation",
    pageWidth / 2,
    pageHeight - 11,
    { align: "center" }
  );
  doc.setFontSize(6);

  // Calculate current page number (summary + pickups + delivery pages)
  let currentPage = 1 + (jobData.pickups?.length || 0); // Summary + all pickup pages

  // Add previous delivery pages
  for (let i = 0; i < index; i++) {
    const prevGoods = jobData.deliveryGoods?.[i];
    if (prevGoods?.packagingTypes) {
      const packagingTypes = ["pallets", "boxes", "bags", "others"];
      packagingTypes.forEach((type) => {
        const pkg = prevGoods.packagingTypes[type];
        if (pkg && pkg.selected && pkg.quantity) {
          currentPage += pkg.quantity;
        }
      });
    } else {
      currentPage += 1; // Default delivery page
    }
  }

  // Add current packaging unit position
  currentPage += packagingUnit.unitIndex;

  const footerText =
    totalUnits > 1
      ? `Job ID: ${jobId} | Location ${index + 1} | ${packagingUnit.label} ${
          packagingUnit.unitIndex
        }/${packagingUnit.totalUnits} | Page ${currentPage} of ${totalPages}`
      : `Job ID: ${jobId} | Location ${
          index + 1
        } | Page ${currentPage} of ${totalPages}`;
  doc.text(footerText, pageWidth / 2, pageHeight - 5, { align: "center" });
};

// Export function to download PDF
export const downloadBookingPDF = async (jobData, jobId, otp) => {
  try {
    if (!jobData || !jobId || !otp) {
      throw new Error("Missing required data for PDF generation");
    }

    console.log("Generating comprehensive PDF with all collected details...");

    const doc = await generateBookingPDF(jobData, jobId, otp);
    doc.save(`Phoenix_Shipper_Complete_${jobId}.pdf`);

    console.log("Comprehensive PDF generated successfully");
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    return false;
  }
};
