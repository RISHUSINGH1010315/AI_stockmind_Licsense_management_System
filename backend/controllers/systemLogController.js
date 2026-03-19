const pool = require("../config/db");

//////////////////////////////////////////////////
// GET SYSTEM LOGS
//////////////////////////////////////////////////

exports.getLogs = async (req,res)=>{

try{

const logs = await pool.query(
"SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 50"
);

res.json(logs.rows);

}catch(err){

console.log("LOG FETCH ERROR",err);
res.status(500).json({error:"Server error"});

}

};