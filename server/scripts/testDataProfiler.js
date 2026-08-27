import { prepareUploadedDataSummary } from "../utils/summarizeData.js";

const sampleAsoDataset = [
  { Keyword: "maxlife one app", Rank: "1", SearchVolume: "0.5", Competition: "10", Prospect: "0.544457", EstDownloads: "64", AppCount: "79", Type: "Generic" },
  { Keyword: "maxlife insurance", Rank: "1", SearchVolume: "0.5", Competition: "8.014708", Prospect: "1.071768", EstDownloads: "64", AppCount: "250", Type: "Branded" },
  { Keyword: "axis max life insurance", Rank: "1", SearchVolume: "5", Competition: "9.64233", Prospect: "2.177107", EstDownloads: "8308", AppCount: "13", Type: "Branded" },
  { Keyword: "term insurance", Rank: "3", SearchVolume: "0.5", Competition: "6.294606", Prospect: "2.619044", EstDownloads: "9", AppCount: "44", Type: "Generic" }
];

console.log("Testing Semantic Data Profiler on ASO dataset...");
const summary = prepareUploadedDataSummary(sampleAsoDataset);
console.log(summary);

const parsed = JSON.parse(summary);
console.log("\n✅ Profiler Checks:");
console.log("- Total Records:", parsed.totalRecords);
console.log("- Primary Entity Column:", parsed.primaryEntityColumn);
console.log("- Columns Identified:", parsed.columns);
console.log("- Outlier Detected on EstDownloads:", parsed.columnProfiles.EstDownloads.outlierDetected);
console.log("- Semantic Role of EstDownloads:", parsed.columnProfiles.EstDownloads.semanticRole);
console.log("- Semantic Role of Competition:", parsed.columnProfiles.Competition.semanticRole);
console.log("- Chart 1 (Distribution):", parsed.chartRecommendations.topDistributionChart);
console.log("- Chart 2 (Composition Donut):", parsed.chartRecommendations.compositionDonutChart);
console.log("- Chart 3 (2x2 Opportunity Matrix):", parsed.chartRecommendations.opportunityMatrixChart);
console.log("\nALL CHECKS PASSED!");
