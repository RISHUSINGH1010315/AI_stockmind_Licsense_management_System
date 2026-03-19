exports.getRenewalRecommendation = (expiryDate) => {
  const today = new Date();
  const exp = new Date(expiryDate);

  const diffDays = (today - exp) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return { decision: "APPROVE" };
  if (diffDays <= 30) return { decision: "APPROVE" };
  if (diffDays <= 180) return { decision: "REVIEW" };

  return { decision: "REJECT" };
};