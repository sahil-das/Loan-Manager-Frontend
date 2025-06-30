import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePDF(groupedData) {
  const doc = new jsPDF();

  const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString("en-IN")}`;

  // --- PAGE 1: COVER PAGE ---
  doc.setFontSize(22);
  doc.text("Borrow Book", 105, 60, { align: "center" });

  doc.setFontSize(14);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 80, {
    align: "center",
  });

  // --- PAGE 2: SUMMARY OVERVIEW ---
  doc.addPage();
  doc.setFontSize(16);
  doc.text("Summary Overview", 14, 20);

  const overviewData = Object.entries(groupedData).map(([person, list]) => {
    const totalBorrow = list
      .filter((e) => e.type === "borrow")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalRepay = list
      .filter((e) => e.type === "repay")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const outstanding = totalBorrow - totalRepay;
    const lastDate = list.length
      ? new Date(Math.max(...list.map((e) => new Date(e.date)))).toLocaleDateString()
      : "-";

    return [
      person,
      formatCurrency(totalBorrow),
      formatCurrency(totalRepay),
      formatCurrency(outstanding),
      lastDate,
    ];
  });

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
  const totalBorrowed = allEntries
    .filter((e) => e.type === "borrow")
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const totalRepaid = allEntries
    .filter((e) => e.type === "repay")
    .reduce((sum, e) => sum + Number(e.amount), 0);
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
      new Date(e.date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["#", "Description", "Amount", "Type", "Date"]],
      body: details,
      styles: { fontSize: 10 },
      theme: 'striped',
    });

    const totalBorrow = list
      .filter((e) => e.type === "borrow")
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalRepay = list
      .filter((e) => e.type === "repay")
      .reduce((sum, e) => sum + Number(e.amount), 0);
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
    doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: "center" });
  }

  // --- SAVE PDF ---
  doc.save("Borrow Book.pdf");
}