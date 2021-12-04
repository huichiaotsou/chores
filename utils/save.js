const DB = require("./db")
const utils = require("./utils")

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
    await DB.query("DELETE FROM records WHERE date = ? AND name_id = ?", [formatDate, nameId])

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

    const nameId = resultName.id 

    const result = await DB.query("SELECT datetime FROM records WHERE name_id = ? GROUP BY datetime ORDER BY datetime", nameId)
    const dates = result.map(r => r.datetime)

    const accumulatedArray = []
    let counter = 1
    let rewards = 0
    for(let i = 1 ; i < dates.length; i++) {        
        const dayDiff = Math.ceil((new Date(dates[i]).setHours(0, 0, 0) - new Date(dates[i - 1]).setHours(0, 0, 0)) / (1000 * 60 * 60 * 24))
        if (dayDiff == 1) {
            counter += 1
            if (counter % 7 == 0) {
                if (await utils.getChoreTimes(dates[i], nameId) >= 15) {
                    rewards += 500
                }
            }
            if (counter % 28 == 0) {
                if (await utils.getChoreTimes(dates[i], nameId) >= 15) {
                    rewards += 1000
                }
            }
        } else if (dayDiff > 1) {
            accumulatedArray.push(counter)
            counter = 1
        } 
        
    }
    accumulatedArray.push(counter)
    

    return {
        rewards, 
        accumulated: accumulatedArray[accumulatedArray.length -1],
        accumulatedTimes: await utils.getChoreTimes(new Date(), nameId),
    }
}

async function getTodayRecords(name, formatDate) {
    const [resultName] = await DB.query("SELECT id FROM names WHERE name = ?", name)
    if (resultName == undefined) return []

    const result = await DB.query(
        `SELECT chore FROM records 
            JOIN chores ON chores.id = records.chore_id 
            WHERE name_id = ? 
            AND date = ?`, 
        [resultName.id, formatDate]
    )

    return result.map(r => r.chore)
}

async function getAllRecordsSorted(name) {
    const [resultName] = await DB.query("SELECT id FROM names WHERE name = ?", name)
    if (resultName == undefined) return []

    const result = await DB.query(
        `SELECT records.date, chores.chore FROM records 
        JOIN names ON names.id = records.name_id 
        JOIN chores ON chores.id = records.chore_id 
        WHERE name_id = ? 
        ORDER BY datetime DESC`, 
        resultName.id,
    )

    const res = []

    result.forEach(r => {
        if (res.length == 0) {
            res.push(
                {
                    date: r.date,
                    chores: [r.chore],
                }
            )
        } else {
            let lastEl = res[res.length-1]
            if(lastEl.date == r.date) {
                lastEl.chores.push(r.chore)
            } else {
                res.push(
                    {
                        date: r.date,
                        chores: [r.chore],
                    }
                )
            }
        }
    })

    return res
}

module.exports = {
    saveName,
    saveRecords,
    saveChores,
    calculateRewards,
    getTodayRecords,
    getAllRecordsSorted
}