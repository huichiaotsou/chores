const DB = require("./db")


async function getChoreTimes(date, nameId) {
    const [checkEligibility] = await DB.query(`SELECT COUNT(*) AS number FROM records WHERE 
    datetime > DATE(?)+1 + INTERVAL - 7 day AND 
    datetime < DATE(?)+1 AND 
    name_id = ?
    `, [date, date, nameId])
     return checkEligibility.number
}

module.exports = {
    getChoreTimes,
}