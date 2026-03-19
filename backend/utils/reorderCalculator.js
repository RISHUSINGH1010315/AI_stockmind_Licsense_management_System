function calculateReorder(predictedDemand, currentStock, reorderLevel) {
  if (predictedDemand > currentStock) {
    return (predictedDemand - currentStock) + reorderLevel;
  }
  return 0;
}

module.exports = calculateReorder;