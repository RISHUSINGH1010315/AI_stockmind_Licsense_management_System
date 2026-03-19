const pool = require("../config/db");

//////////////////////////////////////////////////
// GET ALL COMPANIES
//////////////////////////////////////////////////

exports.getCompanies = async (req, res) => {
  try {

    const companies = await pool.query(
      "SELECT * FROM companies ORDER BY created_at DESC"
    );

    res.json(companies.rows);

  } catch (err) {

    console.log("COMPANY FETCH ERROR", err);
    res.status(500).json({ error: "Server error" });

  }
};

//////////////////////////////////////////////////
// CREATE COMPANY
//////////////////////////////////////////////////

exports.createCompany = async (req,res)=>{

  try{

    const {name,admin_id} = req.body;

    const company = await pool.query(

      `INSERT INTO companies(name,admin_id)
       VALUES($1,$2)
       RETURNING *`,

       [name,admin_id]

    );

    res.json(company.rows[0]);

  }catch(err){

    console.log("CREATE COMPANY ERROR",err);
    res.status(500).json({error:"Server error"});

  }

};

exports.getCompanyDetails = async (req, res) => {

  try {

    const { id } = req.params;

    const company = await pool.query(
      "SELECT * FROM companies WHERE id=$1",
      [id]
    );

    const employees = await pool.query(
      "SELECT id,name,email FROM users WHERE company_id=$1",
      [id]
    );

    res.json({
      company: company.rows[0],
      employees: employees.rows
    });

  } catch (err) {

    console.log("COMPANY DETAILS ERROR", err);
    res.status(500).json({ error: "Server error" });

  }

};

//////////////////////////////////////////////////
// DELETE COMPANY
//////////////////////////////////////////////////

exports.deleteCompany = async (req,res)=>{

  try{

    const {id} = req.params;

    await pool.query(
      "DELETE FROM companies WHERE id=$1",
      [id]
    );

    res.json({message:"Company deleted"});

  }catch(err){

    console.log("DELETE COMPANY ERROR",err);
    res.status(500).json({error:"Server error"});

  }

};

exports.assignPlan = async (req, res) => {

  try {

    const { companyId, planId } = req.body;

    const start = new Date();

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    await pool.query(
      `UPDATE companies
       SET plan_id=$1, plan_start=$2, plan_expiry=$3
       WHERE id=$4`,
      [planId, start, expiry, companyId]
    );

    res.json({
      message: "Plan assigned successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Assign plan failed"
    });

  }

};