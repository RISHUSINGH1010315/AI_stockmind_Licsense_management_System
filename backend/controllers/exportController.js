const ExcelJS = require("exceljs");
const pool = require("../config/db");

exports.exportLicenses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM licenses");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Licenses");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "End Time", key: "end_time", width: 20 },
    ];

    result.rows.forEach(row => worksheet.addRow(row));

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=licenses.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Export failed");
  }
};

exports.exportRenewals = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM renewal_requests");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Renewals");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "License ID", key: "license_id", width: 15 },
      { header: "Duration", key: "duration", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Payment", key: "payment_status", width: 15 },
    ];

    result.rows.forEach(row => worksheet.addRow(row));

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=renewals.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Export failed");
  }
};