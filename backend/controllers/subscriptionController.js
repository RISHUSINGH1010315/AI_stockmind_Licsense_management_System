const pool = require("../config/db");

exports.createSubscription = async (req,res)=>{

try{

const {companyId,planId,amount} = req.body;

const start = new Date();

const expiry = new Date();
expiry.setDate(expiry.getDate()+30);

await pool.query(
`INSERT INTO subscriptions(company_id,plan_id,start_date,expiry_date)
VALUES($1,$2,$3,$4)`,
[companyId,planId,start,expiry]
);

await pool.query(
`INSERT INTO payments(company_id,plan_id,amount)
VALUES($1,$2,$3)`,
[companyId,planId,amount]
);

res.json({message:"Subscription created"});

}catch(err){

console.log(err);

res.status(500).json({
message:"Subscription failed"
});

}

};
exports.getAllSubscriptions = async (req,res)=>{

try{

const result = await pool.query(`
SELECT 
subscriptions.id,
companies.name AS company,
plans.name AS plan,
subscriptions.start_date,
subscriptions.expiry_date,
subscriptions.status
FROM subscriptions
LEFT JOIN companies ON subscriptions.company_id = companies.id
LEFT JOIN plans ON subscriptions.plan_id = plans.id
ORDER BY subscriptions.id DESC
`);

res.json(result.rows);

}catch(err){

console.log(err);

res.status(500).json({
message:"Failed to fetch subscriptions"
});

}

};