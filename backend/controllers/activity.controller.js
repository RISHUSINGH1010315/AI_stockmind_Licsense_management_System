const { getAllLogs } = require("../models/activityLog.model");

const fetchLogs = async (req, res) => {
  try {
    const logs = await getAllLogs();

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });

  } catch (error) {
    console.error("Fetch Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs",
    });
  }
};

module.exports = {
  fetchLogs,
};