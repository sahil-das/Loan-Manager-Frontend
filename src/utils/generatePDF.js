import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default async function generatePDF(groupedData) {
  const doc = new jsPDF(); // Portrait mode (default)

  // Set PDF metadata
  doc.setProperties({
    title: "Borrow Book Report",
    subject: "Loan and Repayment Summary",
    author: "Borrow Book App",
    keywords: "borrow, repay, loan, PDF",
    creator: "Borrow Book App"
  });

  const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString("en-IN")}`;
  const formatDate = (dateStr) =>
    new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(dateStr));

  // Try loading the logo SVG
  let svgBase64 = null;
  try {
    const response = await fetch("/vite.svg");
    if (response.ok) {
      const svgText = await response.text();
      svgBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`;
    } else {
      console.warn("Logo not loaded, continuing without it.");
    }
  } catch (err) {
    console.warn("Error loading logo:", err.message);
  }

  // --- PAGE 1: COVER PAGE ---
  if (svgBase64) {
    doc.addImage(svgBase64, 'SVG', 80, 30, 50, 50);
  }

  doc.setFontSize(20);
  doc.text("Borrow Book", 105, 90, { align: "center" });

  doc.setFontSize(14);
  doc.text(`Generated on: ${new Date().toLocaleString("en-IN")}`, 105, 105, { align: "center" });

  // Watermark (optional branding)
  doc.setTextColor(150);
  doc.setFontSize(40);
  doc.text("BorrowBook", 105, 180, { angle: 45, align: "center", opacity: 0.05 });

  // --- PAGE 2: SUMMARY OVERVIEW ---
  doc.addPage();
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Summary Overview", 14, 20);

  const overviewData = Object.entries(groupedData).map(([person, list]) => {
    const totalBorrow = list.filter((e) => e.type === "borrow")
                            .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalRepay = list.filter((e) => e.type === "repay")
                           .reduce((sum, e) => sum + Number(e.amount), 0);
    const outstanding = totalBorrow - totalRepay;
    const lastDate = list.length
      ? formatDate(Math.max(...list.map((e) => new Date(e.date))))
      : "-";

    return [
      person,
      formatCurrency(totalBorrow),
      formatCurrency(totalRepay),
      formatCurrency(outstanding),
      lastDate,
    ];
  });

  // Optional: Add Grand Total Row
  const grandTotal = overviewData.reduce(
    (acc, row) => {
      acc[0] += parseFloat(row[1].replace(/[^0-9.-]/g, ""));
      acc[1] += parseFloat(row[2].replace(/[^0-9.-]/g, ""));
      acc[2] += parseFloat(row[3].replace(/[^0-9.-]/g, ""));
      return acc;
    },
    [0, 0, 0]
  );

  overviewData.push([
    "Grand Total",
    formatCurrency(grandTotal[0]),
    formatCurrency(grandTotal[1]),
    formatCurrency(grandTotal[2]),
    "-"
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["Person", "Total Borrowed", "Total Repaid", "Outstanding", "Last Date"]],
    body: overviewData,
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === 'body') {
        const value = data.cell.text[0].replace(/[^0-9.-]/g, '');
        if (parseFloat(value) > 0) data.cell.styles.textColor = [200, 0, 0];
        else if (parseFloat(value) < 0) data.cell.styles.textColor = [0, 150, 0];
      }
    },
    theme: 'grid',
  });

  // --- PAGE 3: OVERALL SUMMARY ---
  doc.addPage();
  doc.setFontSize(16);
  doc.text("Overall Summary", 14, 20);

  const allEntries = Object.values(groupedData).flat();
  const totalBorrowed = allEntries.filter(e => e.type === "borrow").reduce((sum, e) => sum + Number(e.amount), 0);
  const totalRepaid = allEntries.filter(e => e.type === "repay").reduce((sum, e) => sum + Number(e.amount), 0);
  const totalOutstanding = totalBorrowed - totalRepaid;

  autoTable(doc, {
    startY: 30,
    body: [
      ["Total Borrowed", formatCurrency(totalBorrowed)],
      ["Total Repaid", formatCurrency(totalRepaid)],
      ["Outstanding", formatCurrency(totalOutstanding)],
    ],
    styles: { fontSize: 12 },
    theme: "grid",
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: [255, 255, 255],
    },
    bodyStyles: {
      fontStyle: "bold",
    },
  });

  // --- PAGE 4+: INDIVIDUAL PERSON DETAILS ---
  Object.entries(groupedData).forEach(([person, list]) => {
    doc.addPage();
    doc.setFontSize(14);
    doc.text(`Details for: ${person}`, 14, 20);

    const sortedList = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));

    const details = sortedList.map((e, i) => [
      i + 1,
      e.description,
      formatCurrency(e.amount),
      e.type === "borrow" ? "Borrowed" : "Repaid",
      formatDate(e.date),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["#", "Description", "Amount", "Type", "Date"]],
      body: details,
      styles: { fontSize: 10 },
      theme: 'striped',
    });

    const totalBorrow = list.filter((e) => e.type === "borrow").reduce((sum, e) => sum + Number(e.amount), 0);
    const totalRepay = list.filter((e) => e.type === "repay").reduce((sum, e) => sum + Number(e.amount), 0);
    const outstanding = totalBorrow - totalRepay;

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Summary", 14, finalY);

    autoTable(doc, {
      startY: finalY + 4,
      body: [
        ["Total Borrowed", formatCurrency(totalBorrow)],
        ["Total Repaid", formatCurrency(totalRepay)],
        ["Outstanding", formatCurrency(outstanding)],
      ],
      styles: { fontSize: 11 },
      theme: "grid",
    });
  });

  // --- FOOTER: PAGE NUMBERS ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: "center" });
  }

  // --- SAVE PDF ---
  //doc.save("Borrow Book.pdf");

  // OR return Blob if needed:
  const blob = doc.output("blob");
   return blob;
}