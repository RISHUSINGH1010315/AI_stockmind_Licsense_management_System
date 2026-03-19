const pool = require("../config/db");
const predictNextMonth = require("../utils/demandPrediction");
const calculateReorder = require("../utils/reorderCalculator");

exports.getForecast = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1️⃣ Get product
    const productResult = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];

    // 2️⃣ Get monthly aggregated sales
    const salesResult = await pool.query(
      `
      SELECT DATE_TRUNC('month', sale_date) AS month,
             SUM(quantity) AS total
      FROM sales
      WHERE product_id = $1
      GROUP BY month
      ORDER BY month ASC
      `,
      [productId]
    );

    // Convert Postgres SUM result to Number
    const salesData = salesResult.rows.map(row => Number(row.total));

    // 3️⃣ Predict next month demand
    const predictedDemand = predictNextMonth(salesData);

    // 4️⃣ Forecast revenue
    const forecastRevenue = predictedDemand * product.price;

    // 5️⃣ Safety stock (20%)
    const safetyStock = Math.round(predictedDemand * 0.2);

    // 6️⃣ Current stock from total_licenses
    const currentStock = product.total_licenses;

    // 7️⃣ Auto reorder calculation
    const reorderQty = calculateReorder(
      predictedDemand,
      currentStock,
      product.reorder_level
    );

    res.json({
      predictedDemand,
      forecastRevenue,
      safetyStock,
      currentStock,
      reorderQty
    });

  } catch (error) {
    console.error("Forecast Error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getLowStockAlerts = async (req, res) => {
  try {
    const productsResult = await pool.query(`
      SELECT *
      FROM products
      WHERE total_licenses <= reorder_level
      ORDER BY total_licenses ASC
    `);

    const lowStockProducts = [];

    for (const product of productsResult.rows) {

      // 🔥 Get monthly sales aggregation
      const salesResult = await pool.query(
        `
        SELECT DATE_TRUNC('month', sale_date) AS month,
               SUM(quantity) AS total
        FROM sales
        WHERE product_id = $1
        GROUP BY month
        ORDER BY month ASC
        `,
        [product.id]
      );

      const salesData = salesResult.rows.map(row => Number(row.total));

      const predictedDemand = predictNextMonth(salesData);

      const recommendedOrder =
        predictedDemand > product.total_licenses
          ? (predictedDemand - product.total_licenses) + product.reorder_level
          : 0;

      const estimatedCost = recommendedOrder * product.price;

      lowStockProducts.push({
        ...product,
        predictedDemand,
        recommendedOrder,
        estimatedCost
      });
    }

    res.json({
      count: lowStockProducts.length,
      products: lowStockProducts
    });

  } catch (error) {
    console.error("Low Stock Alert Error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const productsResult = await pool.query(`SELECT * FROM products`);

    let totalLowStock = 0;
    let totalPurchaseCost = 0;
    let totalPredictedRevenue = 0;
    let highestShortage = 0;
    let topRiskProduct = null;

    for (const product of productsResult.rows) {

      const salesResult = await pool.query(
        `
        SELECT DATE_TRUNC('month', sale_date) AS month,
               SUM(quantity) AS total
        FROM sales
        WHERE product_id = $1
        GROUP BY month
        ORDER BY month ASC
        `,
        [product.id]
      );

      const salesData = salesResult.rows.map(row => Number(row.total));

      const predictedDemand = predictNextMonth(salesData);

      totalPredictedRevenue += predictedDemand * product.price;

      if (product.total_licenses <= product.reorder_level) {
        totalLowStock++;

        const shortage =
          predictedDemand > product.total_licenses
            ? predictedDemand - product.total_licenses
            : 0;

        const recommendedOrder = shortage + product.reorder_level;
        const estimatedCost = recommendedOrder * product.price;

        totalPurchaseCost += estimatedCost;

        if (shortage > highestShortage) {
          highestShortage = shortage;
          topRiskProduct = product.name;
        }
      }
    }

    res.json({
      totalLowStock,
      totalPurchaseCost,
      totalPredictedRevenue,
      topRiskProduct
    });

  } catch (error) {
    console.error("Analytics Summary Error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getForecastTrend = async (req, res) => {
  try {
    const { productId } = req.params;

    const salesResult = await pool.query(
      `
      SELECT DATE_TRUNC('month', sale_date) AS month,
             SUM(quantity) AS total
      FROM sales
      WHERE product_id = $1
      GROUP BY month
      ORDER BY month ASC
      `,
      [productId]
    );

    const salesData = salesResult.rows.map(row => ({
      month: row.month,
      actual: Number(row.total)
    }));

    const numericSales = salesData.map(d => d.actual);

    const predicted = predictNextMonth(numericSales);

    const nextMonth = new Date(salesData[salesData.length - 1].month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    salesData.push({
      month: nextMonth,
      actual: predicted
    });

    res.json(salesData);

  } catch (error) {
    console.error("Trend Error:", error);
    res.status(500).json({ message: error.message });
  }
};
//////////////////////////////////////////////////
// AUTO REORDER AI
//////////////////////////////////////////////////

exports.getAutoReorder = async (req, res) => {

  try {

    const result = await pool.query(`
  SELECT 
    p.id,
    p.name,
    p.stock,
    p.reorder_level,
    COALESCE(SUM(s.quantity),0) AS sold_last_30_days
  FROM products p
  LEFT JOIN stock_out s
  ON p.id = s.product_id
  AND s.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY p.id
`);

    const recommendations = result.rows.map(product => {

      const avgDailyDemand = product.sold_last_30_days / 30;

      const predictedNextMonth = Math.round(avgDailyDemand * 30);

      const reorderQuantity = predictedNextMonth - product.stock;

      return {
        productId: product.id,
        productName: product.name,
        stock: product.stock,
        predictedNextMonth,
        reorderSuggestion: reorderQuantity > 0 ? reorderQuantity : 0
      };

    });

    res.json(recommendations);

  } catch (err) {

    console.error("AUTO REORDER ERROR:", err);

    res.status(500).json({
      message: "Auto reorder AI failed"
    });

  }

};

//////////////////////////////////////////////////
// AI SMART INSIGHTS
//////////////////////////////////////////////////

exports.getAIInsights = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        name,
        total_licenses,
        reorder_level
      FROM products
      ORDER BY total_licenses ASC
      LIMIT 5
    `);

    const insights = result.rows.map((p) => {

      const predictedDemand = p.reorder_level * 2;

      const reorderSuggestion =
        predictedDemand > p.total_licenses
          ? predictedDemand - p.total_licenses
          : 0;

      return {
        product: p.name,
        predictedDemand,
        reorderSuggestion
      };

    });

    res.json(insights);

  } catch (error) {

    console.error("AI INSIGHTS ERROR:", error.message);

    res.status(500).json({
      message: "AI insights failed"
    });

  }
};