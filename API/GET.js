const utils = require("../utils/save")


const getRewards = async (req, res, next)=> {
    try {
        const {name} = req.params
        const today = new Date()
        const formatDate = today.getFullYear()+"-"+ parseInt(today.getMonth()+1) +"-"+ today.getDate()
        const rewards = await utils.calculateRewards(name)
        const todayRecords = await utils.getTodayRecords(name, formatDate)

        console.log({
            name, 
            rewards,
            todayRecords,
            date: formatDate
        });
    
        res.send(
            {
                name, 
                rewards,
                todayRecords,
                date: formatDate
            })
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

const getRecords = async (req, res, next)=> {
    const {name} = req.params
    const sortedRecords = await utils.getAllRecordsSorted(name)
    const rewards = await utils.calculateRewards(name)

    console.log(rewards);

    res.send(
        {
            sortedRecords,
            rewards
        }
    )

}

module.exports = {
    rewards: getRewards,
    records: getRecords,
}