const pool = require("../config/db");

/* ================= STOCK IN ================= */
exports.stockIn = async (req, res) => {
  const client = await pool.connect();

  try {
    const { item_name, qty, price_per_unit, supplier_name } = req.body;

    if (!item_name || !qty || !price_per_unit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quantity = Number(qty);
    const price = Number(price_per_unit);
    const total_amount = quantity * price;

    await client.query("BEGIN");

    // Check if item already exists
    const existing = await client.query(
      "SELECT * FROM inventory WHERE item_name = $1",
      [item_name]
    );

    let itemId;

    if (existing.rows.length > 0) {
      itemId = existing.rows[0].id;

      await client.query(
        `UPDATE inventory
         SET total_qty = total_qty + $1,
             available_qty = available_qty + $1
         WHERE id = $2`,
        [quantity, itemId]
      );
    } else {
      const newItem = await client.query(
        `INSERT INTO inventory (item_name, total_qty, available_qty)
         VALUES ($1, $2, $2)
         RETURNING id`,
        [item_name, quantity]
      );

      itemId = newItem.rows[0].id;
    }

    // Insert into stock_in
    await client.query(
      `INSERT INTO stock_in 
       (item_id, qty, price_per_unit, total_amount, supplier_name)
       VALUES ($1,$2,$3,$4,$5)`,
      [itemId, quantity, price, total_amount, supplier_name]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Stock In successful",
      item_id: itemId
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("STOCK IN ERROR:", error.message);

    res.status(500).json({ message: "Stock In failed" });

  } finally {
    client.release();
  }
};


/* ================= STOCK OUT ================= */
exports.stockOut = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      item_id,
      qty,
      price_per_unit,
      customer_name,
      vehicle_no,
      gst_number,
      notes
    } = req.body;

    if (!item_id || !qty || !price_per_unit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quantity = Number(qty);
    const price = Number(price_per_unit);
    const total_amount = quantity * price;

    await client.query("BEGIN");

    // Check inventory
    const item = await client.query(
      "SELECT available_qty FROM inventory WHERE id = $1",
      [item_id]
    );

    if (item.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.rows[0].available_qty < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Reduce stock
    await client.query(
      `UPDATE inventory
       SET available_qty = available_qty - $1
       WHERE id = $2`,
      [quantity, item_id]
    );

    // Insert stock_out
    await client.query(
      `INSERT INTO stock_out
       (item_id, qty, price_per_unit, total_amount, customer_name, vehicle_no, gst_number, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        item_id,
        quantity,
        price,
        total_amount,
        customer_name,
        vehicle_no,
        gst_number,
        notes
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Stock Out successful"
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("STOCK OUT ERROR:", error.message);

    res.status(500).json({
      message: "Stock Out failed"
    });

  } finally {
    client.release();
  }
};


/* ================= GET INVENTORY ================= */
exports.getInventory = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM inventory ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (error) {

    console.error("GET INVENTORY ERROR:", error.message);

    res.status(500).json({
      message: "Failed to fetch inventory"
    });

  }
};


/* ================= STOCK IN HISTORY ================= */
exports.getStockInHistory = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        si.id,
        i.item_name,
        si.qty,
        si.price_per_unit,
        si.total_amount,
        si.supplier_name,
        si.created_at
      FROM stock_in si
      JOIN inventory i ON si.item_id = i.id
      ORDER BY si.created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error("STOCK IN HISTORY ERROR:", error.message);

    res.status(500).json({
      message: "Failed to fetch stock in history"
    });

  }
};


/* ================= STOCK OUT HISTORY ================= */
exports.getStockOutHistory = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        so.id,
        i.item_name,
        so.qty,
        so.price_per_unit,
        so.total_amount,
        so.customer_name,
        so.vehicle_no,
        so.gst_number,
        so.notes,
        so.created_at
      FROM stock_out so
      JOIN inventory i ON so.item_id = i.id
      ORDER BY so.created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error("STOCK OUT HISTORY ERROR:", error.message);

    res.status(500).json({
      message: "Failed to fetch stock out history"
    });

  }
};