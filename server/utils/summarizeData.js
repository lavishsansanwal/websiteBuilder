/**
 * Advanced Semantic Data Science Profiler & Summarizer
 * 
 * Analyzes uploaded CSV/JSON datasets to extract:
 * 1. Semantic Column Roles (Financial, Count, Date, Percentage, Score, Category, Primary Entity)
 * 2. Statistical Aggregations (Sum, Mean, Min, Max, Median, Distinct Counts)
 * 3. Outlier & Skew Detection (for chart scaling & breakout spotlight banners)
 * 4. Recommended Chart Pairing Matrix (Distribution, Donut, 2x2 Opportunity Matrix)
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

    const keys = Object.keys(uploadedData[0] || {});
    if (keys.length === 0) return "DATASET HAS NO COLUMNS";

    // 1. Classify Column Types & Compute Deep Statistics
    const columnProfiles = {};
    let primaryEntityColumn = null;
    let timeSeriesColumn = null;
    const numericColumns = [];
    const categoricalColumns = [];

    for (const key of keys) {
        const lowerKey = key.toLowerCase();
        let numericCount = 0;
        let nullCount = 0;
        let sum = 0;
        const numbers = [];
        const categoryCounts = {};

        for (const row of uploadedData) {
            const val = row[key];
            if (val === undefined || val === null || val === "" || val === "N/A" || val === "null" || val === "NaN") {
                nullCount++;
                continue;
            }

            const num = Number(val);
            if (!isNaN(num) && typeof val !== "boolean") {
                numericCount++;
                sum += num;
                numbers.push(num);
            } else {
                const catStr = String(val).trim();
                categoryCounts[catStr] = (categoryCounts[catStr] || 0) + 1;
            }
        }

        const validCount = totalRecords - nullCount;
        const isNumeric = numericCount > 0 && numericCount >= validCount * 0.7;

        if (isNumeric && numbers.length > 0) {
            numbers.sort((a, b) => a - b);
            const min = numbers[0];
            const max = numbers[numbers.length - 1];
            const avg = sum / numbers.length;
            const median = numbers[Math.floor(numbers.length / 2)];
            const hasExtremeOutliers = max > 0 && median > 0 && (max / median > 15 || max / (avg || 1) > 10);

            // Infer Semantic Role using substring matching
            let semanticRole = "metric";
            if (/(price|cost|revenue|profit|salary|budget|amount|sales|fee|mrr|arr|ltv|spend)/i.test(lowerKey)) {
                semanticRole = "financial_currency";
            } else if (/(download|count|units|volume|users|views|impressions|clicks|quantity|visitors|stock|subscribers)/i.test(lowerKey)) {
                semanticRole = "volume_count";
            } else if (/(rank|position|rating|score|priority|prospect|index|comp|stars)/i.test(lowerKey)) {
                semanticRole = "score_rank";
            } else if (/(rate|pct|percent|ratio|roi|churn|conversion|margin|growth)/i.test(lowerKey) || (max <= 1 && avg <= 1 && max > 0)) {
                semanticRole = "percentage_rate";
            }

            const profile = {
                type: "numeric",
                semanticRole,
                sum: Math.round(sum * 100) / 100,
                avg: Math.round(avg * 100) / 100,
                median: Math.round(median * 100) / 100,
                min,
                max,
                outlierDetected: hasExtremeOutliers,
                sampleCount: numbers.length
            };

            columnProfiles[key] = profile;
            numericColumns.push({ key, ...profile });
        } else {
            // Categorical Column Analysis
            const uniqueCount = Object.keys(categoryCounts).length;
            const isDate = /(date|time|created|updated|month|year|timestamp|day)/i.test(lowerKey);

            if (isDate && !timeSeriesColumn) {
                timeSeriesColumn = key;
            }

            if (!primaryEntityColumn && !isDate && uniqueCount >= Math.min(3, totalRecords * 0.3)) {
                primaryEntityColumn = key;
            }

            const sortedCategories = Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1]);

            const topCategories = sortedCategories.slice(0, 8).map(([cat, cnt]) => ({
                label: cat,
                count: cnt,
                percentage: Math.round((cnt / totalRecords) * 100)
            }));

            const profile = {
                type: isDate ? "date_time" : "category",
                uniqueValuesCount: uniqueCount,
                topCategories
            };

            columnProfiles[key] = profile;
            categoricalColumns.push({ key, ...profile });
        }
    }

    // Fallback for primary entity if not detected (first non-numeric column or first column)
    if (!primaryEntityColumn) {
        const firstCategory = categoricalColumns.find(c => c.type === "category");
        primaryEntityColumn = firstCategory ? firstCategory.key : keys[0];
    }

    // 2. Determine Chart Recommendations Matrix
    const chartRecommendations = {
        primaryEntityColumn,
        timeSeriesColumn,
        topDistributionChart: null,
        compositionDonutChart: null,
        opportunityMatrixChart: null
    };

    // Best Metric for Distribution (e.g. downloads, revenue, volume)
    const volumeMetric = numericColumns.find(n => n.semanticRole === "volume_count" || n.semanticRole === "financial_currency") || numericColumns[0];
    if (volumeMetric) {
        chartRecommendations.topDistributionChart = {
            chartType: "bar",
            title: `Top ${primaryEntityColumn} by ${volumeMetric.key}`,
            labelColumn: primaryEntityColumn,
            valueColumn: volumeMetric.key,
            outlierScaling: volumeMetric.outlierDetected ? "logarithmic_or_spotlight" : "linear"
        };
    }

    // Best Categorical Column for Donut Breakdown (2 to 8 distinct categories, distinct from primary entity)
    const bestCategory = categoricalColumns.find(c => c.key !== primaryEntityColumn && c.uniqueValuesCount >= 2 && c.uniqueValuesCount <= 8) || categoricalColumns.find(c => c.uniqueValuesCount >= 2 && c.uniqueValuesCount <= 8);
    if (bestCategory) {
        chartRecommendations.compositionDonutChart = {
            chartType: "doughnut",
            title: `${bestCategory.key} Ratio Breakdown`,
            categoryColumn: bestCategory.key,
            slices: bestCategory.topCategories
        };
    }

    // Best 2 Metrics for 2x2 Opportunity Matrix (e.g. Competition vs Volume, Cost vs Revenue)
    if (numericColumns.length >= 2) {
        const xMetric = numericColumns.find(n => n.semanticRole === "score_rank" || n.key.toLowerCase().includes("comp")) || numericColumns[1];
        const yMetric = numericColumns.find(n => n.key !== xMetric.key && (n.semanticRole === "volume_count" || n.semanticRole === "financial_currency" || n.semanticRole === "percentage_rate")) || numericColumns[0];

        chartRecommendations.opportunityMatrixChart = {
            chartType: "scatter_bubble",
            title: `2x2 Opportunity Matrix: ${xMetric.key} vs. ${yMetric.key}`,
            xAxisColumn: xMetric.key,
            yAxisColumn: yMetric.key,
            labelColumn: primaryEntityColumn,
            quadrants: {
                topLeft: "High Potential / Quick Wins",
                topRight: "High Volume / Strategic Focus",
                bottomLeft: "Niche / Long Tail",
                bottomRight: "High Friction / Monitor"
            }
        };
    }

    // Include full dataset if <= 150 rows, or top 50 rows for larger datasets
    const dataRecords = totalRecords <= 150 ? uploadedData : uploadedData.slice(0, 50);

    const summaryReport = {
        datasetInstructions: "CRITICAL: You MUST use these exact column names and row values in the dashboard table and charts. NEVER invent placeholder names.",
        totalRecords,
        primaryEntityColumn,
        timeSeriesColumn,
        columns: keys,
        columnProfiles,
        chartRecommendations,
        exactDataRows: dataRecords
    };

    return JSON.stringify(summaryReport, null, 2);
}
