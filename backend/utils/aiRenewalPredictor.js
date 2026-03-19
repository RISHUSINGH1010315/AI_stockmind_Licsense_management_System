// 🤖 AI Renewal Prediction Engine

const predictRenewal = (daysLeft, renewalCount, paidCount) => {
  // Days left score (0–40)
  let daysScore = 0;
  if (daysLeft <= 5) daysScore = 40;
  else if (daysLeft <= 15) daysScore = 30;
  else if (daysLeft <= 30) daysScore = 20;
  else daysScore = 10;

  // Renewal history score (0–30)
  const renewalScore = Math.min(renewalCount * 10, 30);

  // Payment history score (0–30)
  const paymentScore = Math.min(paidCount * 10, 30);

  const probability = daysScore + renewalScore + paymentScore;

  let risk = "HIGH";
  if (probability >= 70) risk = "LOW";
  else if (probability >= 40) risk = "MEDIUM";

  return { probability, risk };
};

module.exports = predictRenewal;