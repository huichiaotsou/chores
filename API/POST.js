const utils = require("../utils/save")

const submit = async (req, res, next) => {
    try {
        const { name, dateAjustment, formatDate} = req.body
    
        const {
            washClothes, hangClothes, collectClothes, foldClothes, washDishes,
            mopFloor, trash, washBedSheet, changeBedSheet, tidyUp,
            washDogs, dogShit, dogPee, walkDog, others
        } = req.body
    
        const chores = [ 
            washClothes, hangClothes, collectClothes, foldClothes, washDishes, 
            mopFloor, trash, washBedSheet, changeBedSheet, tidyUp, 
            washDogs, dogShit, dogPee, walkDog
        ]

        if (others.length != 0) {
            chores.push(others)
        }
    
        const today = new Date(formatDate)
        const adjustedDate = new Date(today.setDate(today.getDate() + parseInt(dateAjustment)))
        console.log("adjustedDate: ", adjustedDate);
    
        const nameId = await utils.saveName(name)
        const choreIds = await utils.saveChores(chores)
        await utils.saveRecords(nameId, choreIds, adjustedDate)
    
        console.log("name id: ", nameId);
        console.log("chore id: ", choreIds);
    
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

module.exports = {
    submit,
}