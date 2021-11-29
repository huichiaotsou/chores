const DB = require("./db")

async function saveName(name) {
    const [row] = await DB.query("SELECT * FROM names WHERE name = ?", name)
    if (row == undefined) {
        const result = await DB.query("INSERT INTO names (name) VALUES (?)" ,name)
        
        console.log("nameId: ", result.insertId);
        return result.insertId
    }

    return row.id
}


async function saveChores(chores) {
    const choreIds = []
    for (let chore of chores) {
        if (chore == undefined) {
            continue
        }
        const [row] = await DB.query("SELECT * FROM chores WHERE chore = ?", chore)
        if (row == undefined) {
            const result = await DB.query("INSERT INTO chores (chore) VALUES (?)", chore)
            choreIds.push(result.insertId)
        } else {
            choreIds.push(row.id)
        }
    }

    return choreIds
}

async function saveRecords(nameId, choreIds, date) {
    if (choreIds.length == 0)  {
        return
    }
    //Delete existing results if already inserted
    const formatDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    await DB.query("DELETE FROM records WHERE date = ?", formatDate)

    const stmt = "INSERT INTO records (name_id, chore_id, date, datetime) VALUES ?"
    const sqlValues = []
    for (let choreId of choreIds) {
        sqlValues.push([nameId, choreId, formatDate, date])
    }

    await DB.query(stmt, [sqlValues])
}

async function calculateRewards(name) {
    const [resultName] = await DB.query("SELECT id FROM names WHERE name = ?", name)
    if (resultName == undefined) return 0

    const result = await DB.query("SELECT datetime FROM records WHERE name_id = ? GROUP BY datetime ORDER BY datetime", resultName.id)
    const dates = result.map(r => r.datetime)

    const accumulatedArray = []
    let counter = 1
    for(let i = 1 ; i < dates.length; i++) {
        const dayDiff = Math.ceil((new Date(dates[i]).setHours(0, 0, 0) - new Date(dates[i - 1]).setHours(0, 0, 0)) / (1000 * 60 * 60 * 24))
        if (dayDiff == 1) {
            counter += 1
        } else if (dayDiff > 1) {
            accumulatedArray.push(counter)
            counter = 1
        } 
        
    }
    accumulatedArray.push(counter)
    

    console.log("accumulatedArray: ", accumulatedArray);

    let rewards = 0;
    accumulatedArray.forEach(a => {
        for (i = 1; i <= a; i++) {
            if (i % 7 == 0) {
                rewards += 500
            }
            if (i % 28 == 0) {
                rewards += 1000
            }
        }
    })

    return {rewards, accumulated: accumulatedArray[accumulatedArray.length -1]}
}

module.exports = {
    saveName,
    saveRecords,
    saveChores,
    calculateRewards,
}