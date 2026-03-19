const cron = require("node-cron");
const pool = require("../config/db");

cron.schedule("0 0 * * *", async () => {

console.log("Running subscription expiry check...");

try{

await pool.query(`
UPDATE subscriptions
SET status='expired'
WHERE expiry_date < NOW()
AND status='active'
`);

console.log("Subscription expiry updated");

}catch(err){

console.log("Cron error:",err);

}

});