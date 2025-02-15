import { jsPDF } from "jspdf"
import "jspdf-autotable"

export const generatePDF = (data: any) => {
  const doc = new jsPDF()

  // Brand Profile Section
  doc.setFontSize(16)
  doc.text("Marketing Scorecard", 14, 15)

  doc.setFontSize(14)
  doc.text("Brand Profile", 14, 25)

  const brandProfileData = [
    ["Total Budget", `$${data.brandProfile.totalBudget.toLocaleString()}`],
    ["Personnel", data.brandProfile.personnel.join(", ")],
    ["Products", data.brandProfile.products],
    ["Industry", data.brandProfile.industry],
    ["Segments", data.brandProfile.segments],
    ["Channels", data.brandProfile.channels],
  ]

  doc.autoTable({
    startY: 30,
    head: [["Field", "Value"]],
    body: brandProfileData,
  })

  // Marketing Mix Section
  doc.text("Marketing Mix", 14, doc.lastAutoTable.finalY + 10)

  const marketingMixData = Object.entries(data.marketingMix).map(([channel, mix]: [string, any]) => [
    channel,
    `${mix.percentage}%`,
    `$${mix.amount.toLocaleString()}`,
  ])

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Channel", "Percentage", "Amount"]],
    body: marketingMixData,
  })

  // Benchmarks Section
  doc.text("Benchmarks & Goals", 14, doc.lastAutoTable.finalY + 10)

  const benchmarksData = data.benchmarks.map((benchmark: any) => [
    benchmark.timeline,
    benchmark.metricName,
    benchmark.benchmark,
    benchmark.goal,
  ])

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Timeline", "Metric", "Benchmark", "Goal"]],
    body: benchmarksData,
  })

  // Initiatives Section
  doc.text("Marketing Initiatives", 14, doc.lastAutoTable.finalY + 10)

  const initiativesData = data.benchmarks.flatMap((benchmark: any) =>
    benchmark.initiatives.map((initiative: any) => [
      initiative.name,
      `$${initiative.cost.toLocaleString()}`,
      `${initiative.budgetPercent.toFixed(2)}%`,
      "⚪".repeat(initiative.difficulty),
      initiative.personnel.join(", "),
      initiative.status,
    ]),
  )

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Initiative", "Cost", "Budget %", "Difficulty", "Personnel", "Status"]],
    body: initiativesData,
  })

  doc.save("marketing-scorecard.pdf")
}

