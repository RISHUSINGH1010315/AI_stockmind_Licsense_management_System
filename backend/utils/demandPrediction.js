// backend/utils/demandPrediction.js

function predictNextMonth(salesData) {
  if (salesData.length === 0) return 0;

  const n = salesData.length;
  const x = salesData.map((_, i) => i + 1);
  const y = salesData;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const m =
    (n * sumXY - sumX * sumY) /
    (n * sumX2 - sumX * sumX);

  const b = (sumY - m * sumX) / n;

  const nextMonth = n + 1;

  return Math.max(0, Math.round(m * nextMonth + b));
}

module.exports = predictNextMonth;