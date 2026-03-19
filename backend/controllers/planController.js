const pool = require("../config/db");

//////////////////////////////////////////////////
// GET ALL PLANS
//////////////////////////////////////////////////

exports.getPlans = async (req,res)=>{

try{

const plans = await pool.query(
"SELECT * FROM plans ORDER BY id DESC"
);

res.json(plans.rows);

}catch(err){

console.log(err);
res.status(500).json({error:"Server error"});

}

};

//////////////////////////////////////////////////
// CREATE PLAN
//////////////////////////////////////////////////

exports.createPlan = async(req,res)=>{

try{

const {name,price,users_limit,duration} = req.body;

await pool.query(
"INSERT INTO plans(name,price,users_limit,duration) VALUES($1,$2,$3,$4)",
[name,price,users_limit,duration]
);

res.json({message:"Plan created"});

}catch(err){

console.log(err);
res.status(500).json({error:"Server error"});

}

};

//////////////////////////////////////////////////
// DELETE PLAN
//////////////////////////////////////////////////

exports.deletePlan = async(req,res)=>{

try{

const {id} = req.params;

await pool.query(
"DELETE FROM plans WHERE id=$1",
[id]
);

res.json({message:"Plan deleted"});

}catch(err){

console.log(err);
res.status(500).json({error:"Server error"});

}

};