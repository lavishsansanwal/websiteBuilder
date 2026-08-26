/**
 * Analyze and summarize uploaded dataset (CSV/JSON rows)
 * to give the AI accurate aggregations, categories, and clean samples.
 */
export function prepareUploadedDataSummary(uploadedData) {
    if (!uploadedData) return "NO UPLOADED DATA PROVIDED";

    if (!Array.isArray(uploadedData)) {
        if (typeof uploadedData === "object") {
            return JSON.stringify(uploadedData, null, 2);
        }
        return String(uploadedData);
    }

    const totalRecords = uploadedData.length;
    if (totalRecords === 0) return "EMPTY DATASET PROVIDED";

    const sampleRows = uploadedData.slice(0, 20); // Top 20 rows
    const keys = Object.keys(uploadedData[0] || {});

    // Analyze numeric vs categorical fields
    const numericStats = {};
    const categoricalStats = {};

    for (const key of keys) {
        let isNumeric = true;
        let sum = 0;
        let count = 0;
        const categoryCounts = {};

        for (const row of uploadedData) {
            const val = row[key];
            if (val === undefined || val === null || val === "") continue;

            const num = Number(val);
            if (!isNaN(num) && typeof val !== "boolean") {
                sum += num;
                count++;
            } else {
                isNumeric = false;
                const catStr = String(val).trim();
                categoryCounts[catStr] = (categoryCounts[catStr] || 0) + 1;
            }
        }

        if (isNumeric && count > 0) {
            numericStats[key] = {
                totalSum: Math.round(sum * 100) / 100,
                average: Math.round((sum / count) * 100) / 100,
                sampleCount: count
            };
        } else {
            // Sort categories by frequency
            const topCategories = Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([cat, cnt]) => `${cat}: ${cnt}`);

            if (topCategories.length > 0) {
                categoricalStats[key] = topCategories;
            }
        }
    }

    // Include full dataset rows if under 150 rows, otherwise include top 50 sample rows
    const dataRecords = totalRecords <= 150 ? uploadedData : uploadedData.slice(0, 50);

    const summaryReport = {
        datasetInstructions: "CRITICAL: You MUST use these exact column names and row values in the dashboard table and charts. Do NOT invent fake placeholder names.",
        totalRows: totalRecords,
        columns: keys,
        calculatedMetrics: numericStats,
        topCategoryBreakdown: categoricalStats,
        exactDataRows: dataRecords
    };

    return JSON.stringify(summaryReport, null, 2);
}
