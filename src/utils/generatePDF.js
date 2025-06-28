import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generatePDF(groupedData) {
  const doc = new jsPDF();
  const pages = [];

  // Helper to format amounts
  const formatCurrency = (amount) => `Rs. ${Number(amount).toLocaleString("en-IN")}`;


  // COVER PAGE
  doc.setFontSize(22);
  doc.text("Loan Report", 105, 60, { align: "center" });

  doc.setFontSize(14);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 80, {
    align: "center",
  });

  pages.push(doc.internal.getNumberOfPages());
  doc.addPage();

  // SUMMARY OVERVIEW PAGE
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
  });

  pages.push(doc.internal.getNumberOfPages());

  // EACH PERSON ON A NEW PAGE
  Object.entries(groupedData).forEach(([person, list]) => {
    doc.addPage();
    pages.push(doc.internal.getNumberOfPages());

    doc.setFontSize(14);
    doc.text(`Details for: ${person}`, 14, 20);

    const details = list.map((e, i) => [
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

  // FINAL OVERALL SUMMARY PAGE
  doc.addPage();
  pages.push(doc.internal.getNumberOfPages());

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
    styles: { fontSize: 12, cellStyles: { fontStyle: "bold" } },
    theme: "grid",
  });

  // ADD PAGE NUMBERS (after content is done)
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: "center" }); // Footer
  }

  doc.save("loan-report.pdf");
}
